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

import { Canvas, useFrame } from "@react-three/fiber";
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
// The model's overall scale factor. Bumped 2.3 → 3.5 per user request
// for a "much bigger" model. At this scale the cable still has plenty
// of cropping headroom (cable_top world ~11.25, frustum top ~7.3).
const MODEL_SCALE = 3.5;

// Where the rotation pivot sits in the GLB's bbox-centered local
// coordinate system. Negative = below the bbox geometric center.
// User pointed at a red dot near the front-lower part of the pod
// body; -0.5 puts the pivot in that area so dragging or scroll-
// choreographed rotation makes the pod swing around its own base
// rather than wobbling around the geometric centroid (which sits
// in empty space between the pod body and the cable rigging above).
const PIVOT_LOCAL_Y = -0.5;

// World-y of the pivot point (= world-y where the rotation happens
// AND where OrbitControls targets). With MODEL_SCALE bumped to 3.5,
// the model is much taller — the pod's pixel-bottom sits well below
// the pod center, so we have to drop PIVOT_WORLD_Y substantially to
// bring the pod's bottom edge near the studio podium image.
//
// -2.2 places the rotation pivot ~1.3 world units below the previous
// tuning at scale 2.3, which translates to ~190 canvas pixels of
// downward shift — closing most of the gap between the bigger pod
// and the podium while keeping a clear "hovering above" air-gap.
//
// Cable cropping is preserved with margin to spare:
//   cable_top_world = -2.2 + (-3.5 × -0.5) + 3.5 × 2.97
//                   = -2.2 + 1.75 + 10.395 = 9.945
//   frustum_top ≈ 7.3, so cable still crops out the canvas top.
const PIVOT_WORLD_Y = -2.2;

/* -------------------------------------------------------------------- */
/* The model itself — handles centering, shadows, rotation logic         */
/* -------------------------------------------------------------------- */
function RackModel({
  paused,
  scrollProgress,
}: {
  paused: boolean;
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

    if (scrollProgress) {
      // ── Scroll-driven mode ──────────────────────────────────────
      // .get() reads current value WITHOUT triggering React re-render
      // (this is the whole point of using MotionValue — it's an
      // observable readable from any frame loop).
      const p = THREE.MathUtils.clamp(scrollProgress.get(), 0, 1);

      const targetY = THREE.MathUtils.lerp(HERO_ROT_Y, LOCK_ROT_Y, p);
      const targetX = THREE.MathUtils.lerp(HERO_ROT_X, LOCK_ROT_X, p);

      // No drift — keep the rack perfectly still, head-on.
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
      // No auto-rotate — lerp the rack back to the canonical side
      // view when the user releases a drag. They can still orbit via
      // OrbitControls during drag; release returns to this resting
      // angle so the model reads as a stable product profile.
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

  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
      dpr={[1, 2]}
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
    >
      {/* Ambient floor — keeps the dark side of the rack from going pitch */}
      <ambientLight intensity={0.55} />

      {/* Key light — warm white, top-right. Reads as overhead data-center
          ceiling lighting. Casts the contact shadow. */}
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.7}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
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
        <RackModel paused={isDragging} scrollProgress={scrollProgress} />

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
  );
}
