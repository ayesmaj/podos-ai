"use client";

/**
 * PodosRack3D — interactive 3D viewer for the PODOS server rack.
 *
 * Two modes of operation:
 *   1. **Standalone (no `scrollProgress` prop)**: idle auto-rotate +
 *      drag-to-orbit. Used when the rack is rendered as a self-contained
 *      widget with no scroll choreography.
 *   2. **Scroll-choreographed (`scrollProgress` prop provided)**: the
 *      model's rotation is locked to scroll progress (a MotionValue
 *      coming from framer-motion's `useScroll`). At progress 0 the rack
 *      sits at a hero 3/4 angle; at progress 1 it lands at an isometric
 *      "marketing render" angle that complements the engineering
 *      schematic next to it. A subtle sin-wave drift keeps it from
 *      feeling frozen mid-scroll.
 *
 * Why MotionValue instead of regular React state?
 *   useScroll updates *every animation frame* during scroll. If we put
 *   that into useState, we'd re-render the entire <Canvas> tree on
 *   every frame — tens of unnecessary React reconciliations per second.
 *   MotionValue is a pure observable: `.get()` reads the current value
 *   without triggering React. We read it inside useFrame (which already
 *   runs every frame) and apply the rotation directly to the Three.js
 *   group. Zero React re-renders, smooth 60fps choreography.
 *
 * SSR safety: react-three-fiber needs `window`/WebGL, so this file is
 * `"use client"`. The consumer in PodosPod.tsx ALSO loads this via
 * `next/dynamic({ ssr: false })` so the heavy three.js bundle is split
 * out of the initial page payload entirely.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

useGLTF.preload("/models/podos-rack.glb");

/* -------------------------------------------------------------------- */
/* Choreography keyframes — tuned to pair with the schematic next to it  */
/* -------------------------------------------------------------------- */
// Default rotation: 0 (the GLB's authored front view). The previous
// Solar Freight pod needed +π/2 to show its long side; the new pod 3d
// model has bounds 7.70 × 5.94 × 1.52 (more cube-like than ribbon-like)
// so the natural front face reads as the hero angle without rotation.
//
// If you swap models again and the natural orientation looks wrong,
// try Math.PI / 2 (right side), -Math.PI / 2 (left side), or
// Math.PI (back) until the right face is camera-facing.
const SIDE_ROT_Y = 0;
const HERO_ROT_Y = SIDE_ROT_Y;
const HERO_ROT_X = 0;
const LOCK_ROT_Y = SIDE_ROT_Y;
const LOCK_ROT_X = 0;

/* -------------------------------------------------------------------- */
/* Geometry tuning                                                       */
/* -------------------------------------------------------------------- */
// The model's overall scale factor. With the new .podComposition
// structure (canvas spans the full header+studio area), the cable's
// upward cropping is handled by the canvas's natural top edge, not
// by a clip-path constraint — so we can scale up further. 5.0 makes
// the pod ~43% bigger than the previous 3.5, while staying within
// the canvas's horizontal visible bounds (~12 world units at the
// current camera fov).
const MODEL_SCALE = 5.0;

// Where the rotation pivot sits in the GLB's bbox-centered local
// coordinate system. Negative = below the bbox geometric center.
// User pointed at a red dot near the front-lower part of the pod
// body; -0.5 puts the pivot in that area so dragging or scroll-
// choreographed rotation makes the pod swing around its own base
// rather than wobbling around the geometric centroid (which sits
// in empty space between the pod body and the cable rigging above).
const PIVOT_LOCAL_Y = -0.5;

// World-y of the pivot point (= world-y where the rotation happens
// AND where OrbitControls targets).
//
// IMPORTANT: this value does NOT effectively control the pod's
// on-screen vertical position! Because OrbitControls.target = this
// value, the camera *follows* the pivot — when we lower the pivot
// in world, the camera tilts down to keep looking at it, so the
// pod stays at roughly the same canvas pixel position. To move the
// pod up/down on screen relative to the podium image, shift the
// .studioBackdrop image via CSS `transform: translateY(...)` instead
// (see PodosPod.module.css → .studioBackdrop).
//
// The value here just needs to keep the rotation feeling natural
// (pivot inside the pod body, not floating in space). 0 puts the
// pivot at world origin which works fine.
const PIVOT_WORLD_Y = 0;

/* -------------------------------------------------------------------- */
/* The model itself — handles centering, shadows, rotation logic         */
/* -------------------------------------------------------------------- */
function RackModel({
  paused,
  hovering,
  scrollProgress,
}: {
  paused: boolean;
  hovering: boolean;
  scrollProgress?: MotionValue<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/podos-rack.glb");

  // Re-center on bounding-box midpoint so the GLB's geometric centroid
  // is at scene's local origin, then shift the scene further so the
  // PIVOT POINT (not the bbox center) ends up at the wrapping <group>'s
  // local origin — this is what makes rotation feel like rotating
  // around the red-dot pivot the user pointed at, rather than around
  // the empty space between the pod body and the cable above it.
  //
  // After sub(center), pivot point at GLB-local p = (0, PIVOT_LOCAL_Y, 0)
  // is at scene-local (0, PIVOT_LOCAL_Y, 0). To move it to scene-local
  // (0, 0, 0), shift scene.position by -SCALE × PIVOT_LOCAL_Y on y
  // (the SCALE multiplier is needed because the wrapping primitive
  // applies scale on top of scene.position; without compensating, the
  // shift would be undersized by 1/SCALE).
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    scene.position.y += -MODEL_SCALE * PIVOT_LOCAL_Y;

    scene.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  // Initial rotation seed — when we're scroll-choreographed, snap the
  // group to the hero angle on mount so the user sees "the lock-in
  // animation starts from here", not a default y=0 jump on first scroll.
  useEffect(() => {
    if (groupRef.current && scrollProgress) {
      groupRef.current.rotation.y = HERO_ROT_Y;
      groupRef.current.rotation.x = HERO_ROT_X;
    }
  }, [scrollProgress]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // ── Hover-driven rotation ────────────────────────────────────
    // When the cursor is over the canvas (and the user isn't actively
    // dragging via OrbitControls), continuously rotate the pod on its
    // Y axis at ~36°/sec. This gives passive viewers a sense of the
    // model's 3D-ness without requiring them to drag. The rotation
    // is applied DIRECTLY (no lerp toward a target) — pure angular
    // velocity — so it feels like the pod is gently spinning rather
    // than snapping to a pose. Drag still works (OrbitControls owns
    // camera orbit independently of model rotation).
    if (hovering && !paused) {
      groupRef.current.rotation.y += delta * 0.6;
      return;
    }

    if (scrollProgress) {
      // ── Scroll-driven mode ──────────────────────────────────────
      // .get() reads current value WITHOUT triggering React re-render
      // (this is the whole point of using MotionValue — it's an
      // observable readable from any frame loop).
      const p = THREE.MathUtils.clamp(scrollProgress.get(), 0, 1);

      const targetY = THREE.MathUtils.lerp(HERO_ROT_Y, LOCK_ROT_Y, p);
      const targetX = THREE.MathUtils.lerp(HERO_ROT_X, LOCK_ROT_X, p);

      // Lerp back toward scroll-target after hover ends, so the pod
      // settles to its canonical pose without a hard snap.
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetY,
        delta * 5,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetX,
        delta * 5,
      );
    } else if (!paused) {
      // ── Idle mode ───────────────────────────────────────────────
      // After hover ends (or in standalone non-scroll usage), lerp
      // back to the canonical side angle so the model reads as a
      // stable product profile.
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        SIDE_ROT_Y,
        delta * 5,
      );
    }
  });

  // The wrapping <group> is the rotation reference — its local origin
  // is the pivot point (set by PIVOT_WORLD_Y). The <primitive> inside
  // is the model itself, scaled by MODEL_SCALE; the useEffect above
  // already translated scene.position so the pivot point sits at the
  // group's local origin (0,0,0), so rotating the group rotates the
  // entire model around the user-specified red-dot pivot.
  //
  // OrbitControls also uses PIVOT_WORLD_Y (in PodosRack3D below) so
  // user drag-to-orbit pivots around the same point — both rotation
  // mechanisms (scroll choreography on the group, drag on the camera)
  // share a single coherent rotation pivot.
  return (
    <group
      ref={groupRef}
      position-y={PIVOT_WORLD_Y}
      rotation-y={HERO_ROT_Y}
      rotation-x={HERO_ROT_X}
    >
      <primitive object={scene} scale={MODEL_SCALE} />
    </group>
  );
}

/* -------------------------------------------------------------------- */
/* InViewLoopDriver — render-loop gate (2026-05-20 perf pass)            */
/* -------------------------------------------------------------------- */
/*
 * The killer problem: <Canvas> defaults to frameloop="always", so Three.js
 * was rendering the rack scene at 60Hz forever — even when the pod section
 * was scrolled completely off-screen. Shadow maps, useFrame lerp math,
 * OrbitControls damping, drei <Environment> sampling — all running while
 * the user scrolled through Team or Footer 5000px away. That continuous
 * GPU+CPU bleed is what was still making the page feel "stuck" after the
 * backdrop-filter fix.
 *
 * The fix below:
 *   1. Canvas now uses frameloop="demand" — it renders ONLY when something
 *      calls invalidate().
 *   2. The wrapper div has an IntersectionObserver. When the pod section
 *      enters the viewport, we start a rAF loop that calls invalidate()
 *      each frame (so useFrame still runs and scroll-driven rotation works).
 *      When it leaves the viewport, the rAF stops — zero work.
 *
 * This is a 100% reduction in GPU/CPU work for the 90% of the page where
 * the pod isn't visible. The user perceives this as the rest of the site
 * suddenly feeling responsive.
 */
function InViewLoopDriver({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return;
    let rafId = 0;
    const tick = () => {
      invalidate();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, invalidate]);
  return null;
}

/* -------------------------------------------------------------------- */
/* Public component — the entire <Canvas> + lighting rig                 */
/* -------------------------------------------------------------------- */
export default function PodosRack3D({
  scrollProgress,
}: {
  scrollProgress?: MotionValue<number>;
}) {
  // Drag interaction state. In standalone mode, dragging pauses idle
  // auto-rotate so the user's input takes precedence. In scroll-driven
  // mode, drag has NO effect on the model rotation (scroll still
  // controls that) — instead OrbitControls orbits the CAMERA around
  // the scene, letting the user inspect the rack from any angle while
  // the scroll choreography continues independently. Camera transforms
  // and model transforms compose multiplicatively in Three.js, so the
  // two systems coexist without fighting.
  const [isDragging, setIsDragging] = useState(false);
  // Hover state — true while the cursor is anywhere over the canvas
  // bounds. Drives passive auto-rotation of the pod model so casual
  // viewers see the model spin without needing to drag.
  const [isHovering, setIsHovering] = useState(false);
  // Visibility tracking for demand-driven frameloop (see InViewLoopDriver
  // above). rootMargin: '200px' starts the loop slightly before the
  // section enters the viewport so the first visible frame is already
  // rendered, not a blank flash.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ width: "100%", height: "100%" }}
    >
    <Canvas
      // frameloop="demand": render ONLY on invalidate(). InViewLoopDriver
      // below drives invalidation while the section is on-screen. When
      // off-screen, zero render work happens.
      frameloop="demand"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
      // dpr cap dropped 2 → 1.5: at 2x on a retina screen, every pixel
      // costs 4× as much. 1.5 is the sweet spot where shapes still look
      // crisp but shading work is halved.
      dpr={[1, 1.5]}
      // Camera pulled back (z=14) + FOV widened (45°) gives ~11.6 units
      // visible vertical world-space, enough to fit the full GLB cable
      // rigging. Camera stays at y=1.5 — moving it would drag the
      // model's on-screen Y back up (the projection is relative to
      // the camera). Lowering the MODEL alone (via POD_Y_OFFSET) is
      // what brings the pod down toward the podium image.
      camera={{ position: [0, 1.5, 14], fov: 45 }}
      // cursor affordance — `grab` on hover, `grabbing` while dragging.
      // OrbitControls itself doesn't manage the canvas cursor, so we
      // toggle it via the same isDragging state used to pause auto-rotate.
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      // DOM mouse events on the Canvas wrapper div — these fire when
      // the cursor enters/leaves the canvas's bounding rect. We use
      // them to toggle hover-driven rotation. NOTE: R3F's `onPointerOver`
      // and friends are different — those are raycasted scene events
      // that only fire when over a 3D object. We want any-cursor-on-
      // canvas behavior, so the DOM events are the right choice here.
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Render-loop gate — runs invalidate() per frame ONLY while the
          pod section is in viewport. Off-screen → zero work. */}
      <InViewLoopDriver active={inView} />

      {/* Ambient floor — keeps the dark side of the rack from going pitch */}
      <ambientLight intensity={0.55} />

      {/* Key light — warm white, top-right. Reads as overhead data-center
          ceiling lighting. Casts the contact shadow. */}
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.7}
        color="#ffffff"
        castShadow
        // Shadow map 1024 → 512: shadow-map render passes cost O(N²) in
        // resolution. 512 still looks sharp at the rack's on-screen size
        // and halves both the GPU memory and the per-frame draw cost.
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />

      {/* Cyan fill — left-side, brand-coherent kicker. Pushes the rack
          into the cyan/blue palette without tinting the entire model. */}
      <directionalLight position={[-4, 3, -2]} intensity={0.7} color="#22d3ee" />

      {/* Warm under-fill — bounce light from the imaginary floor to lift
          the rack's underside out of pure shadow. */}
      <directionalLight position={[0, -3, 2]} intensity={0.25} color="#fff5e1" />

      {/* Brand-blue rim — back light gives the rack a glowing edge against
          the section background. */}
      <pointLight position={[0, 4, -5]} intensity={1.4} color="#3b82f6" />

      <Suspense fallback={null}>
        <RackModel
          paused={isDragging}
          hovering={isHovering}
          scrollProgress={scrollProgress}
        />

        {/* PBR environment so anything metallic on the rack picks up
            warehouse reflections — looks much more plausible than flat
            shaded geometry. */}
        <Environment preset="warehouse" />

        {/* Soft grounded shadow so the rack doesn't appear to float. */}
        <ContactShadows
          position={[0, -1.25, 0]}
          opacity={0.5}
          scale={6}
          blur={2.6}
          far={3}
        />
      </Suspense>

      {/* OrbitControls is ALWAYS mounted now — even in scroll-choreographed
          mode. It rotates the CAMERA around the scene origin; my scroll
          choreography rotates the rack GROUP around its own pivot. The two
          transforms compose multiplicatively in Three.js, so the user can
          drag to inspect the rack from any angle while scroll continues
          to drive the model's own rotation independently.

          • `enableZoom: false` — prevents wheel events from being captured
            by the canvas, so the user's scroll continues to scroll the
            page (and drive the choreography). This is critical: if zoom
            were enabled, mouse wheel inside the canvas would zoom the
            camera and never reach the page → the user would be trapped.
          • `enablePan: false` — keeps the rack centered. Pan would let
            the user drag the rack out of frame, breaking layout.
          • Polar limits — clamp drag arc to a comfortable inspection
            range (no upside-down or top-down views of a product showcase).
          • `enableDamping` + `dampingFactor` — release momentum decay,
            so flick-rotates feel weighted instead of snapping to stop. */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.55}
        rotateSpeed={0.85}
        enableDamping
        dampingFactor={0.08}
        // Target the pivot point so drag-to-orbit rotates the camera
        // around the same red-dot pivot the model rotates around.
        // Without this, drag would orbit around (0,0,0) — the world
        // origin — and the model would appear to swing eccentrically
        // around an off-center point.
        target={[0, PIVOT_WORLD_Y, 0]}
        onStart={() => setIsDragging(true)}
        onEnd={() => setIsDragging(false)}
      />
    </Canvas>
    </div>
  );
}
