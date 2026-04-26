"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "./CutawayOverlay.module.css";

/**
 * CutawayOverlay — the cyan X-ray layer painted over the photorealistic
 * pod render. Shows the 8-bay GPU grid (2 rows × 4 columns) with
 * dashed coolant-flow lines connecting them and a CLOSED-LOOP COOLANT
 * label. Includes the green ONLINE status pill at the top-left of the
 * grid.
 *
 * Why SVG-on-image instead of a pre-baked cutaway PNG:
 *   • Sharper at every viewport size — no rasterization
 *   • Animatable — flow arrows can pulse, ONLINE dot can blink
 *   • Smaller payload — a few hundred bytes vs. another ~1MB image
 *   • The cyan grid stays brand-disciplined regardless of the
 *     underlying photograph, so swapping renders later is harmless
 *
 * Coordinate space: viewBox 0 0 100 60. The overlay's outer container
 * sits at the same percentage rectangle as the pod render (managed by
 * PodCanvas), so this viewBox maps directly onto the pod chassis.
 *
 * The overlay sits BETWEEN the pod image (z:1) and the callout layer
 * (z:4) — it's purely visual, never interactive (pointer-events: none).
 */

type Props = {
  /** When true, the overlay fades in. Driven by viewport entry from parent. */
  visible: boolean;
};

// Grid geometry — the cutaway shows 2 rows × 4 cols of GPU bays.
// Coords are in viewBox units (0–100 horizontally, 0–60 vertically),
// matching the pod render's framed area. The pod render has visible
// GPU racks behind doors on its LEFT HALF (roughly x:10..53), and a
// closed PODOS AI branded face on its RIGHT HALF (x:53..96). Our cyan
// X-ray overlay sits over the GPU-rack half so it reads as "X-raying
// the productive volume".
const GRID_X = 11;       // left edge of cutaway grid (just inside pod's left bezel)
const GRID_W = 43;       // grid total width — covers the GPU-rack left half
const GRID_Y = 14;       // top edge of grid (just below the chassis frame top)
const GRID_H = 36;       // grid total height — keeps the bottom row INSIDE
                         // the photorealistic pod chassis (without 36 the
                         // cutaway extended past the pod's baseline into
                         // the white margin below)
const ROW_H = GRID_H / 2;
const COL_W = GRID_W / 4;

export default function CutawayOverlay({ visible }: Props) {
  const reduce = useReducedMotion();

  // Pre-compute the 8 bay rectangles. Each bay is the cell of the
  // 2×4 grid with a small inset so they don't touch.
  const bays = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      bays.push({
        x: GRID_X + c * COL_W + 0.6,
        y: GRID_Y + r * ROW_H + 0.6,
        w: COL_W - 1.2,
        h: ROW_H - 1.2,
        delay: (r * 4 + c) * 0.05,
      });
    }
  }

  return (
    <motion.svg
      className={styles.svg}
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer rectangle — frames the cutaway with corner ticks. The
          dashed border is the engineering "exposed plane" indicator. */}
      <motion.rect
        x={GRID_X - 1.5}
        y={GRID_Y - 2}
        width={GRID_W + 3}
        height={GRID_H + 4}
        fill="none"
        stroke="rgba(6, 182, 212, 0.55)"
        strokeWidth="0.18"
        strokeDasharray="0.8 0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: visible ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Corner anchors — small squares at the 4 corners of the cutaway
          rect. They give the dimension-line callouts their visual
          attachment points. */}
      {[
        [GRID_X - 1.5, GRID_Y - 2],
        [GRID_X + GRID_W + 1.5, GRID_Y - 2],
        [GRID_X - 1.5, GRID_Y + GRID_H + 2],
        [GRID_X + GRID_W + 1.5, GRID_Y + GRID_H + 2],
      ].map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={(x as number) - 0.6}
          y={(y as number) - 0.6}
          width="1.2"
          height="1.2"
          fill="#0f172a"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="0.1"
        />
      ))}

      {/* The 8 GPU bays — translucent cyan fills with brighter borders.
          Stagger fade-in for a subtle "powering up" feel. */}
      {bays.map((bay, i) => (
        <motion.rect
          key={i}
          x={bay.x}
          y={bay.y}
          width={bay.w}
          height={bay.h}
          rx="0.4"
          fill="rgba(34, 211, 238, 0.18)"
          stroke="rgba(34, 211, 238, 0.85)"
          strokeWidth="0.18"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{
            opacity: visible ? 1 : 0,
            scale: visible ? 1 : 0.96,
          }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: 0.45,
                  delay: visible ? 0.2 + bay.delay : 0,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
          style={{ transformOrigin: `${bay.x + bay.w / 2}px ${bay.y + bay.h / 2}px` }}
        />
      ))}

      {/* Internal coolant flow lines — horizontal dashed line down the
          middle of the grid (between rows 1 and 2) plus 4 vertical
          drop-lines connecting top row to bottom. Animated path
          dasharray creates a "fluid flowing" effect. */}
      <motion.line
        x1={GRID_X + 2}
        y1={GRID_Y + ROW_H}
        x2={GRID_X + GRID_W - 2}
        y2={GRID_Y + ROW_H}
        stroke="rgba(34, 211, 238, 0.7)"
        strokeWidth="0.18"
        strokeDasharray="1.2 0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: visible ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 1, delay: visible ? 0.6 : 0 }}
      />
      {/* Animated flow shimmer — overlay a brighter dash that scrolls. */}
      {!reduce && visible && (
        <motion.line
          x1={GRID_X + 2}
          y1={GRID_Y + ROW_H}
          x2={GRID_X + GRID_W - 2}
          y2={GRID_Y + ROW_H}
          stroke="#ffffff"
          strokeWidth="0.22"
          strokeDasharray="0.8 8"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -50 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          opacity={0.55}
        />
      )}

      {/* Coolant label — sits centered on the flow line. */}
      <motion.text
        x={GRID_X + GRID_W / 2}
        y={GRID_Y + ROW_H - 0.5}
        textAnchor="middle"
        className={styles.flowLabel}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4, delay: visible ? 1 : 0 }}
      >
        CLOSED-LOOP COOLANT
      </motion.text>

      {/* ONLINE status pill — top-left corner of the grid, mirrors the
          reference. Green dot + uppercase label inside a rounded chip. */}
      <motion.g
        initial={{ opacity: 0, y: -1 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -1 }}
        transition={{ duration: 0.5, delay: visible ? 0.85 : 0 }}
      >
        <rect
          x={GRID_X + 0.6}
          y={GRID_Y + 0.6}
          width="9"
          height="3"
          rx="1.5"
          fill="rgba(15, 23, 42, 0.78)"
          stroke="rgba(34, 197, 94, 0.4)"
          strokeWidth="0.12"
        />
        <circle cx={GRID_X + 2} cy={GRID_Y + 2.1} r="0.7" fill="#22c55e" />
        {!reduce && (
          /* Pulse halo — animated via opacity-only on a fixed-radius
             ring. Animating the SVG `r` attribute through framer-motion
             produced an "Expected length, 'undefined'" error on initial
             render, so we use a sibling ring whose opacity pulses
             instead. Same visual effect, no SVG attribute conflict. */
          <motion.circle
            cx={GRID_X + 2}
            cy={GRID_Y + 2.1}
            r={1.4}
            fill="none"
            stroke="#22c55e"
            strokeWidth={0.18}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <text
          x={GRID_X + 3.2}
          y={GRID_Y + 2.55}
          className={styles.onlineLabel}
        >
          ONLINE
        </text>
      </motion.g>
    </motion.svg>
  );
}
