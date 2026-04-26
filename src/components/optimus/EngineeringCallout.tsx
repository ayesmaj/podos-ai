"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { OptimusComponent } from "@/lib/optimusComponents";
import styles from "./EngineeringCallout.module.css";

/**
 * EngineeringCallout — corner-style label for top-level pod systems.
 * Renders a small node at the anchor `position`, a dashed connector
 * line, and a label set in mono caps positioned outside the pod
 * footprint. Style mirrors industrial spec sheets (Anduril / Tesla /
 * NVIDIA marketing).
 *
 * Geometry by corner:
 *   tl  → label sits ABOVE the pod, line drops down-and-right to anchor
 *   tr  → label sits ABOVE the pod, line drops down-and-left to anchor
 *   bl  → label sits BELOW the pod, line goes up-and-right to anchor
 *   br  → label sits BELOW the pod, line goes up-and-left to anchor
 *
 * The component takes percentage coords (0–100) on the pod canvas as
 * its placement, then computes label offsets relative to the corner.
 *
 * The dashed line is rendered via an inline `<svg>` per callout so we
 * can animate its stroke-dashoffset on hover without coordinating with
 * a shared SVG layer. The cost is one extra inline SVG per corner
 * callout — negligible at 4 callouts total.
 */

type Props = {
  component: OptimusComponent & { placement: { kind: "corner"; corner: "tl" | "tr" | "bl" | "br" } };
  active: boolean;
  dimmed: boolean;
  onActivate: (id: string) => void;
};

export default function EngineeringCallout({ component, active, dimmed, onActivate }: Props) {
  const reduce = useReducedMotion();
  const { corner } = component.placement;
  const { x, y } = component.position;

  // Label offset from the anchor — measured in percentage of the canvas.
  // Values were tuned visually against the reference; corner-specific
  // because each corner extends the label into the margin in a
  // different direction. Kept small (±2-3) so labels stay INSIDE the
  // canvas viewport even at the extreme x=92 / x=8 anchors. The label
  // box itself uses transform: translate(-100%) on right-aligned
  // corners, so the visible text grows AWAY from the anchor.
  const offset = {
    tl: { dx: -2, dy: -7 },
    tr: { dx: 2, dy: -7 },
    bl: { dx: -2, dy: 9 },
    br: { dx: 2, dy: 9 },
  }[corner];

  const labelLeft = `${x + offset.dx}%`;
  const labelTop = `${y + offset.dy}%`;
  const align = corner === "tl" || corner === "bl" ? "right" : "left";

  return (
    <button
      type="button"
      className={styles.root}
      data-active={active || undefined}
      data-dimmed={dimmed || undefined}
      data-corner={corner}
      onClick={() => onActivate(component.id)}
      aria-label={`${component.label} — click to view specs`}
      aria-expanded={active}
      style={{
        ["--anchor-x" as string]: `${x}%`,
        ["--anchor-y" as string]: `${y}%`,
      }}
    >
      {/*
        Anchor "tap target" — replaces the previous square draftsman
        tick with an explicit affordance: a small cobalt-tinted circle
        with a `+` glyph that universally reads as "more info". On
        hover/focus/active the glyph rotates 45° into an `×` so it
        also signals open/closed state. Sits at the same (x,y) anchor
        on the pod that the dashed connector originates from.
      */}
      <span
        className={styles.anchor}
        style={{ left: `${x}%`, top: `${y}%` }}
        aria-hidden
      >
        <svg
          viewBox="0 0 14 14"
          width="14"
          height="14"
          className={styles.anchorIcon}
          aria-hidden
        >
          {/* + glyph — two strokes that meet at center. */}
          <line x1="3.5" y1="7" x2="10.5" y2="7" />
          <line x1="7" y1="3.5" x2="7" y2="10.5" />
        </svg>
      </span>

      {/*
        Dashed connector line removed 2026-04-24 — feedback was that
        the animated stroke-dasharray rendered as visible stacked
        rectangles (especially on near-vertical corner-to-label paths
        like seismic-frame), which read as visual noise instead of
        engineering-drawing rigor. The corner labels are clearly
        associated with their pod corners by proximity alone — the
        connector line was decoration, not communication. The label +
        anchor pair carries the meaning on its own.

        If you want the dashed line back later, re-add a <motion.line>
        with `className={styles.connectorLine}` here. The CSS rule
        still exists (kept it as a hidden affordance) but no element
        in the DOM uses it.
      */}

      {/* Label tag — appears in the margin of the pod canvas. */}
      <span
        className={styles.labelWrap}
        style={{
          left: labelLeft,
          top: labelTop,
          textAlign: align,
          transform:
            align === "right" ? "translate(-100%, -50%)" : "translateY(-50%)",
        }}
      >
        <span className={styles.label}>{component.label.toUpperCase()}</span>
      </span>
    </button>
  );
}
