"use client";

import styles from "./GlobalEnergyLayer.module.css";

/**
 * GlobalEnergyLayer — site-wide ambient energy.
 *
 * Mounts once at the root layout and paints THREE always-on motion
 * primitives across the entire viewport:
 *
 *   1. `.beam`        — a horizontal scan beam that sweeps top→bottom
 *                        every 14s, blending screen so it brightens
 *                        rather than darkens whatever's beneath. Reads
 *                        as a "scan line of light" passing over the
 *                        page. Slow enough that it never distracts
 *                        from reading.
 *   2. `.pulse-grid`  — a faint cyan dot grid that breathes (opacity
 *                        + slight scale) on a 7s cycle. Provides a
 *                        living substrate so even sections without
 *                        their own atmospherics still feel awake.
 *   3. `.spark-trail` — three tiny brand-blue sparks at staggered
 *                        positions, each pulsing on a different
 *                        period (4s/6s/8s) so the eye never settles
 *                        on a synchronized blink. Subtle "system is
 *                        processing" cue.
 *
 * Stack order:
 *   • position: fixed; z-index: 1 — sits above section backgrounds
 *     but below ALL content (which lives at z:2+).
 *   • pointer-events: none on the wrapper AND each child — never
 *     blocks clicks anywhere on the page.
 *
 * Reduced-motion: the entire layer is hidden via @media query.
 * Performance: only opacity/transform animated → GPU compositor
 * handles it; no layout/paint work.
 */
export default function GlobalEnergyLayer() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.beam} />
      <div className={styles.pulseGrid} />
      <span className={`${styles.spark} ${styles.spark1}`} />
      <span className={`${styles.spark} ${styles.spark2}`} />
      <span className={`${styles.spark} ${styles.spark3}`} />
    </div>
  );
}
