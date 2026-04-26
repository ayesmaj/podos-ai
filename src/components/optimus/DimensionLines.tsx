"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "./DimensionLines.module.css";

/**
 * DimensionLines — engineering-drawing dimension callouts overlaid on
 * the pod canvas. Three labels animate in via stroke-dashoffset:
 *
 *   • 128× GPU BAY  — top ledger above the pod
 *   • 6 096 mm      — width line spanning the top edge
 *   • 2 591 mm      — height line on the left edge
 *
 * The reveal is sequenced (60ms between paths) so it reads as a
 * "drawing being drawn", not all-at-once.
 *
 * Visibility is controlled by `visible` prop. Once the user has
 * triggered a reveal (clicked any pin) the parent flips this to true
 * and leaves it true for the rest of the session — re-animating the
 * lines on every panel toggle would be distracting.
 *
 * Coordinate system: viewBox 0 0 100 60, normalized to the canvas's
 * aspect-ratio box. Drawn in slate-300 stroke + mono labels.
 */

type Props = {
  visible: boolean;
};

export default function DimensionLines({ visible }: Props) {
  const reduce = useReducedMotion();

  return (
    <svg
      className={styles.svg}
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Width dimension line — spans the top of the pod. Tick marks
          at each end + label centered. Rendered as a single fade-in
          opacity transition (no pathLength animation) because the
          framer-motion pathLength implementation uses stroke-dasharray
          internally — that combined with strokeWidth made the line
          render as visible dash segments instead of a clean solid
          stroke. Plain opacity fade keeps the line crisp and
          rectangle-free. */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.6, delay: visible ? 0.1 : 0 }}
      >
        <line x1="4" y1="6" x2="96" y2="6" stroke="rgba(100, 116, 139, 0.6)" strokeWidth="0.14" />
        {/* End ticks */}
        <line x1="4" y1="3.5" x2="4" y2="8.5" stroke="rgba(100, 116, 139, 0.6)" strokeWidth="0.14" />
        <line x1="96" y1="3.5" x2="96" y2="8.5" stroke="rgba(100, 116, 139, 0.6)" strokeWidth="0.14" />
      </motion.g>
      <motion.text
        x="50"
        y="4.6"
        textAnchor="middle"
        className={styles.label}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4, delay: visible ? 0.45 : 0 }}
      >
        6 096 mm
      </motion.text>

      {/* Height dimension — left edge. Same simplified treatment as
          the width line above: plain opacity fade, no pathLength
          animation, no dashed strokes. */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.6, delay: visible ? 0.2 : 0 }}
      >
        <line x1="2" y1="12" x2="2" y2="56" stroke="rgba(100, 116, 139, 0.6)" strokeWidth="0.14" />
        <line x1="0.5" y1="12" x2="3.5" y2="12" stroke="rgba(100, 116, 139, 0.6)" strokeWidth="0.14" />
        <line x1="0.5" y1="56" x2="3.5" y2="56" stroke="rgba(100, 116, 139, 0.6)" strokeWidth="0.14" />
      </motion.g>
      <motion.text
        x="3.5"
        y="34"
        className={styles.label}
        transform="rotate(-90 3.5 34)"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4, delay: visible ? 0.55 : 0 }}
      >
        2 591 mm
      </motion.text>

      {/*
        128× GPU BAY banner removed 2026-04-24 — the EngineeringCallout
        for `gpu-bay` already renders this label at the top-left corner
        of the pod with its dashed connector line. Painting it here too
        produced a visible duplicate. The EngineeringCallout version is
        canonical because it's the clickable interaction surface.
      */}
    </svg>
  );
}
