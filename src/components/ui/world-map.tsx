"use client";

import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DottedMap from "dotted-map";

/**
 * WorldMap · animated arc-path globe primitive
 *
 * Adapted from a shadcn-style generic into the project's design system:
 *   • Light-mode only (the project is single-mode; no next-themes coupling)
 *   • Default line color is the brand cyan (#22D3EE) instead of sky-500
 *   • Dot map uses deep-navy ink at 25% opacity on paper — low-contrast
 *     substrate that lets the animated arcs carry the visual weight
 *   • Labels use the project's glass-panel + ink-strong type pattern
 *   • No dark: Tailwind classes; tokens are resolved via className prop
 *     or the defaults so it slots into the cyber-tech aesthetic
 *
 * Animation contract: arcs draw in staggered sequence, then a leading dot
 * traces the path, then reset and loop. Endpoints pulse with a radial
 * "ping" using raw SVG <animate> (cheaper than motion for simple pulses).
 */

export interface WorldMapArc {
  start: { lat: number; lng: number; label?: string };
  end: { lat: number; lng: number; label?: string };
}

interface WorldMapProps {
  dots?: WorldMapArc[];
  /** Arc + endpoint color. Defaults to the project's cyan accent. */
  lineColor?: string;
  /** Color for the base dotted-map substrate. Defaults to deep-navy ink. */
  mapDotColor?: string;
  showLabels?: boolean;
  animationDuration?: number;
  loop?: boolean;
}

export function WorldMap({
  dots = [],
  lineColor = "#22D3EE",
  /**
   * IMPORTANT — tuned for LIGHT paper backgrounds.
   * The shadcn original (rgba at ~0.22) was calibrated for dark backgrounds
   * where low-opacity light dots still read. Inverted on light paper, 22%
   * opacity navy dots become visually invisible. 38% is the floor for
   * "recognizable as a continent silhouette" on paper #F7F9FB.
   */
  mapDotColor = "rgba(15, 23, 42, 0.38)",
  showLabels = true,
  animationDuration = 2,
  loop = true,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // DottedMap instance is expensive to build — memo by grid config only.
  const map = useMemo(
    () => new DottedMap({ height: 100, grid: "diagonal" }),
    []
  );

  const svgMap = useMemo(
    () =>
      map.getSVG({
        // Dots render at this radius in an internal 198×100 viewBox. When the
        // map is rendered at ~500-700px wide, radius 0.22 = sub-pixel dots
        // that disappear on light paper. 0.58 gives roughly 1.5-2px dots —
        // recognizably a world silhouette, not a foggy smudge.
        radius: 0.58,
        color: mapDotColor,
        shape: "circle",
        backgroundColor: "transparent",
      }),
    [map, mapDotColor]
  );

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  // Animation scheduling math: each arc gets a 0.3s stagger offset, then
  // all arcs pause together for 2s before the loop resets. This keeps the
  // "ensemble" feeling — arcs draw like a swarm, not a queue.
  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 2;
  const fullCycleDuration = totalAnimationTime + pauseTime;

  return (
    <div
      className="relative font-sans overflow-hidden w-full"
      style={{ aspectRatio: "2 / 1" }}
    >
      {/*
        Plain <img> instead of next/image — the src is a ~50KB inline data-URL
        SVG emitted by DottedMap. Next's image optimizer can't do anything
        useful with that, and routing data-URLs through it has been flaky
        across Next 16 + Turbopack builds. A vanilla <img> is both simpler
        and more reliable here. The mask-image is moved to inline style so
        it doesn't depend on Tailwind arbitrary-value JIT generation.
      */}
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full pointer-events-none select-none object-cover absolute inset-0"
        alt="world map"
        draggable={false}
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
        }}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-auto select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="wm-path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <filter id="wm-glow">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Arc paths + leading dot */}
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const pathD = createCurvedPath(startPoint, endPoint);

          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime = (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#wm-path-gradient)"
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={
                  loop
                    ? { pathLength: [0, 0, 1, 1, 0] }
                    : { pathLength: 1 }
                }
                transition={
                  loop
                    ? {
                        duration: fullCycleDuration,
                        times: [0, startTime, endTime, resetTime, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0,
                      }
                    : {
                        duration: animationDuration,
                        delay: i * staggerDelay,
                        ease: "easeInOut",
                      }
                }
              />

              {loop && (
                <motion.circle
                  r="4"
                  fill={lineColor}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: ["0%", "0%", "100%", "100%", "100%"],
                    opacity: [0, 0, 1, 0, 0],
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                  style={{ offsetPath: `path('${pathD}')` }}
                />
              )}
            </g>
          );
        })}

        {/* Endpoint dots + labels (rendered in a second pass so they sit above arcs) */}
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);

          return (
            <g key={`points-group-${i}`}>
              {/* Start endpoint */}
              <EndpointMarker
                cx={startPoint.x}
                cy={startPoint.y}
                color={lineColor}
                label={dot.start.label}
                index={i}
                showLabels={showLabels}
                onHoverStart={() => setHoveredLocation(dot.start.label || `Location ${i}`)}
                onHoverEnd={() => setHoveredLocation(null)}
                pingDelay={0}
              />
              {/* End endpoint */}
              <EndpointMarker
                cx={endPoint.x}
                cy={endPoint.y}
                color={lineColor}
                label={dot.end.label}
                index={i}
                showLabels={showLabels}
                onHoverStart={() => setHoveredLocation(dot.end.label || `Destination ${i}`)}
                onHoverEnd={() => setHoveredLocation(null)}
                pingDelay={0.5}
                labelOffsetDelay={0.2}
              />
            </g>
          );
        })}
      </svg>

      {/* Mobile-only hover tooltip — labels are hidden on small screens,
          so a fallback tooltip surfaces the hovered name */}
      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm sm:hidden"
            style={{
              background: "var(--glass-bg-strong, rgba(255,255,255,0.82))",
              color: "var(--ink-strong, #0F172A)",
              border: "1px solid var(--edge, rgba(15,23,42,0.08))",
            }}
          >
            {hoveredLocation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Internal: endpoint marker (dot + pulsing ping + optional label)      */
/* ------------------------------------------------------------------ */
function EndpointMarker({
  cx,
  cy,
  color,
  label,
  index,
  showLabels,
  onHoverStart,
  onHoverEnd,
  pingDelay,
  labelOffsetDelay = 0,
}: {
  cx: number;
  cy: number;
  color: string;
  label?: string;
  index: number;
  showLabels: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  pingDelay: number;
  labelOffsetDelay?: number;
}) {
  return (
    <g>
      <motion.g
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        className="cursor-pointer"
        whileHover={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <circle cx={cx} cy={cy} r="3" fill={color} filter="url(#wm-glow)" />
        <circle cx={cx} cy={cy} r="3" fill={color} opacity="0.5">
          <animate
            attributeName="r"
            from="3"
            to="12"
            dur="2s"
            begin={`${pingDelay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.6"
            to="0"
            dur="2s"
            begin={`${pingDelay}s`}
            repeatCount="indefinite"
          />
        </circle>
      </motion.g>

      {showLabels && label && (
        <motion.g
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 * index + 0.3 + labelOffsetDelay, duration: 0.5 }}
          className="pointer-events-none"
        >
          <foreignObject x={cx - 50} y={cy - 35} width="100" height="30" className="block">
            <div className="flex items-center justify-center h-full">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-md shadow-sm"
                style={{
                  background: "var(--glass-bg-strong, rgba(255,255,255,0.92))",
                  color: "var(--ink-strong, #0F172A)",
                  border: "1px solid var(--edge, rgba(15,23,42,0.08))",
                  letterSpacing: "0.02em",
                  fontFeatureSettings: '"tnum" 1',
                }}
              >
                {label}
              </span>
            </div>
          </foreignObject>
        </motion.g>
      )}
    </g>
  );
}
