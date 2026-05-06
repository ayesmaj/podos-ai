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
// Centered, straight-on view — no rotation. Both hero and lock keep
// the rack head-on so it reads as a centered product photo at every
// scroll position.
const HERO_ROT_Y = 0;
const HERO_ROT_X = 0;
const LOCK_ROT_Y = 0;
const LOCK_ROT_X = 0;

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

  // Re-center on bounding-box midpoint so [0,0,0] is the visual center
  // of the rack — Meshy's exporter often dumps the origin at a corner
  // or far below the model, which makes auto-rotate look like the rack
  // is wobbling on a pivot.
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

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
      // No auto-rotate — keep the rack centered head-on. User can
      // still drag via OrbitControls if they want to inspect.
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0,
        delta * 5,
      );
    }
  });

  return <primitive ref={groupRef} object={scene} scale={2.0} />;
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
      camera={{ position: [0, 0.4, 6.5], fov: 35 }}
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
        onStart={() => setIsDragging(true)}
        onEnd={() => setIsDragging(false)}
      />
    </Canvas>
  );
}
