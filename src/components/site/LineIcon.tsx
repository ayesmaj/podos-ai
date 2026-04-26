/* ==================================================================
   LINE ICON · unified icon system
   ==================================================================
   Single consumption point for ALL iconography. Design control is
   enforced by construction: every icon ships through the same SVG
   envelope, so stroke-width, linecap, linejoin, viewBox, and color
   inheritance are guaranteed identical across the entire site.

   This is the antidote to the "template stitched together" look that
   happens when you drop assorted Envato/Iconscout icons into a design.
   Sections can't reach in and override envelope props — they can only
   pick a name, size, and color.

   API contract:
     <LineIcon name="pod" />                          → brand-current color
     <LineIcon name="silo" size={32} />               → custom size
     <LineIcon name="shield" color="var(--status)" /> → custom color
     <LineIcon name="arrow-right" strokeWidth={2} />  → override stroke

   Extending the set:
     1. Add an entry to ICONS with a path (or multiple paths joined).
     2. Use coordinates within the 24×24 viewBox.
     3. Never add fills — this is a LINE icon library. If a filled
        shape is needed, it belongs in a separate primitive.
   ================================================================== */

import type { SVGProps } from "react";

export type IconName =
  // Infrastructure
  | "pod"
  | "silo"
  | "rack"
  | "gpu"
  | "chip"
  | "cooling"
  | "grid"
  | "factory"
  // Data / model
  | "compress"
  | "layers"
  | "neural"
  | "model"
  // Business / signals
  | "dollar"
  | "growth"
  | "shield"
  | "gauge"
  | "timer"
  | "patent"
  // UX / controls
  | "arrow-right"
  | "arrow-up-right"
  | "check"
  | "x"
  | "dot"
  | "chevron-down"
  | "play"
  | "external"
  | "copy"
  // Social proof
  | "lock"
  | "signature"
  | "handshake"
  | "spark";

/**
 * Icon path registry.
 *
 * Every path is authored for a 24×24 viewBox, 1.5px stroke, round
 * caps + joins, no fills. If you're adding a new icon and it looks
 * weird at small sizes, re-trace it at integer coordinates with a
 * 12× or 24× grid — sub-pixel paths blur when rasterized.
 */
const ICONS: Record<IconName, string> = {
  // ============== INFRASTRUCTURE ==============
  // Pod = modular box with ports (the PODOS hero glyph)
  pod: "M4 6h16v12H4zM4 10h16M8 6v12M16 6v12M2 14h2M20 14h2",
  // Silo = tall cylindrical unit with cap (MEGA SILO product)
  silo: "M7 3h10l-1 2v14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5zM7 8h10M7 13h10M7 18h10",
  // Rack = server rack with 4 unit slots
  rack: "M4 3h16v18H4zM4 8h16M4 12h16M4 16h16M7 5.5h2M7 9.5h2M7 13.5h2M7 17.5h2",
  // GPU = card with fins
  gpu: "M3 9h18v6H3zM6 9v6M10 9v6M14 9v6M18 9v6M21 11v2",
  // Chip = die with pins
  chip: "M8 8h8v8H8zM4 10h4M4 14h4M16 10h4M16 14h4M10 4v4M14 4v4M10 16v4M14 16v4",
  // Cooling = droplet inside frame (liquid cooling)
  cooling: "M12 4c-3 4-5 6-5 9a5 5 0 0 0 10 0c0-3-2-5-5-9zM9 13a3 3 0 0 0 3 3",
  // Grid = power grid cross
  grid: "M3 12h18M12 3v18M7 3v18M17 3v18M3 7h18M3 17h18",
  // Factory = industrial building
  factory: "M3 21V10l5 3V10l5 3V7l5 3v11zM7 21v-4M12 21v-4M17 21v-4",

  // ============== DATA / MODEL ==============
  // Compress = arrows pointing inward
  compress: "M4 4l5 5M20 4l-5 5M4 20l5-5M20 20l-5-5M9 9H5M9 9V5M15 9h4M15 9V5M9 15H5M9 15v4M15 15h4M15 15v4",
  // Layers = stacked plates
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5",
  // Neural = nodes + edges (dots via round-linecap on zero-length lines)
  neural: "M5 6L12 12L5 18M19 6L12 12L19 18M5 6L5 6.01M19 6L19 6.01M12 12L12 12.01M5 18L5 18.01M19 18L19 18.01",
  // Model = box with nested box (weights)
  model: "M4 6h16v12H4zM8 10h8v4H8z",

  // ============== BUSINESS / SIGNALS ==============
  dollar: "M12 3v18M16 7c0-2-1.8-3-4-3s-4 1-4 3 2 2.5 4 3 4 1 4 3-2 3-4 3-4-1-4-3",
  // Growth = up-trend arrow
  growth: "M3 17l6-6 4 4 7-8M14 7h7v7",
  // Shield (IP moat)
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  // Gauge = half-circle with needle
  gauge: "M4 15a8 8 0 0 1 16 0M12 15l4-4",
  // Timer = clock with hand
  timer: "M12 8v5l3 2M12 3v2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z",
  // Patent = document with badge
  patent: "M7 3h8l4 4v14H7zM14 3v4h4M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM10 15l-1 4 3-2 3 2-1-4",

  // ============== UX / CONTROLS ==============
  "arrow-right": "M5 12h14M13 5l7 7-7 7",
  "arrow-up-right": "M7 17L17 7M8 7h9v9",
  check: "M5 12l5 5L20 6",
  x: "M6 6l12 12M6 18L18 6",
  dot: "M12 12h0",
  "chevron-down": "M6 9l6 6 6-6",
  play: "M8 5v14l11-7z",
  external: "M14 4h6v6M10 14l10-10M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6",
  copy: "M9 9h10v10H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1",

  // ============== SOCIAL PROOF ==============
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  signature: "M3 17c4-8 7 0 11-6 2 4 4 4 7 2M3 21h18",
  handshake: "M12 10l3-3 3 3-3 3-3-3 3-3M9 14l-3-3M12 13l-3-3-3 3 3 3zM18 13l3-2M6 14H3",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8",
};

export interface LineIconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  /** Icon key — must exist in the ICONS registry. */
  name: IconName;
  /** Square size in px. Defaults to 24 (matches viewBox 1:1). */
  size?: number | string;
  /** CSS color. If omitted, inherits `currentColor` from parent text color. */
  color?: string;
  /** Stroke width in viewBox units. Default 1.5 — change only with intent. */
  strokeWidth?: number;
  /** Optional accessible label. Omit for purely decorative icons. */
  title?: string;
}

/**
 * Unified line-icon primitive. Use everywhere an icon is needed.
 *
 * Decorative (default): no label, aria-hidden.
 *   <LineIcon name="pod" />
 *
 * Meaningful (needs label): pass `title` to surface it to screen readers.
 *   <LineIcon name="check" title="Validated" />
 */
export default function LineIcon({
  name,
  size = 24,
  color,
  strokeWidth = 1.5,
  title,
  ...rest
}: LineIconProps) {
  const path = ICONS[name];
  const decorative = !title;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color ?? "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
      {...rest}
    >
      {title && !decorative && <title>{title}</title>}
      <path d={path} />
    </svg>
  );
}

/**
 * Re-export the registry so tooling (Storybook, docs, tests) can
 * iterate the full icon set without duplicating the list.
 */
export { ICONS };
