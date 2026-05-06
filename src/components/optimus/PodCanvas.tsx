"use client";

import Image from "next/image";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  OPTIMUS_COMPONENTS,
  type OptimusCategory,
} from "@/lib/optimusComponents";
import EngineeringCallout from "./EngineeringCallout";
import PortCallout from "./PortCallout";
import DimensionLines from "./DimensionLines";
import styles from "./PodCanvas.module.css";

/**
 * PodCanvas — assembles the full reference layout in stacked layers:
 *
 *   z:0   pod render (next/image of optimus-pod-front.png)
 *   z:1   chassis-glow gradient (subtle radial behind the cutaway)
 *   z:2   CutawayOverlay (cyan internal grid + flow + ONLINE pill)
 *   z:2   DimensionLines (6 096 mm + 2 591 mm + 128× banner)
 *   z:3-5 Callouts (engineering + port — these catch clicks)
 *
 * The aspect ratio of the pod render is locked via `paddingBottom`
 * (CSS image-aspect-ratio trick) so the % coordinate space the pins
 * use stays identical regardless of viewport width.
 *
 * The cutaway overlay + dimension lines fade in once the canvas is
 * scrolled into view (`useInView`) — that's the "instrumentation
 * comes online" moment when the user reaches the section. The
 * callouts fade in on the same trigger but with no per-callout
 * animation (the corner/port components handle their own micro-
 * interactions on hover/focus).
 */

type Props = {
  activeId: string | null;
  filterCategory: OptimusCategory | null;
  onActivate: (id: string) => void;
};

export default function PodCanvas({ activeId, filterCategory, onActivate }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Trigger overlay reveal when 30% of the canvas is on screen — early
  // enough that the user catches the staggered bay fade-in but late
  // enough that off-screen tabs don't burn animation budget.
  const inView = useInView(ref, { amount: 0.3, once: true });

  const cornerCallouts = OPTIMUS_COMPONENTS.filter(
    (c) => c.placement.kind === "corner",
  );
  const portCallouts = OPTIMUS_COMPONENTS.filter(
    (c) => c.placement.kind === "port",
  );

  // Helper: when a category filter is active, every component outside
  // that category dims to ~35% opacity. When a specific component is
  // active, every other component dims. The two states compose: a
  // filtered-out item ALSO dims regardless of active.
  const isDimmed = (id: string, category: OptimusCategory) => {
    if (filterCategory && category !== filterCategory) return true;
    if (activeId && activeId !== id) return true;
    return false;
  };

  return (
    <div ref={ref} className={styles.canvas}>
      {/* Pod render + dimension lines share the same rectangle so their
          coordinate systems align. The dimension SVG sits INSIDE
          imageWrap (not as a sibling of canvas) — siblings would
          inherit the canvas height (which includes the top banner
          space + bottom port-row strip), stretching the SVG viewBox
          vertically and breaking alignment with the pod.

          Note: a cyan X-ray cutaway overlay (8-bay grid + ONLINE pill +
          CLOSED-LOOP COOLANT flow line) was removed 2026-04-24 — the
          actual photorealistic pod render already shows the GPU racks
          glowing through its open doors, so the synthetic overlay was
          redundant and visually competed with the genuine hardware
          detail. CutawayOverlay.tsx remains on disk for now in case a
          future render replaces the photo with a closed-doors variant
          where the X-ray would carry weight again. */}
      <div className={styles.imageWrap}>
        <Image
          src="/optimus/optimus-pod-front.png"
          alt="Optimus pod — front elevation"
          fill
          priority
          // `unoptimized` short-circuits Next.js's image optimizer.
          // The pod render is 1822×863 — small enough that optimization
          // isn't winning much, and the dev-mode optimizer was failing
          // to deliver a 3840w upscale variant (image stayed in
          // currentSrc="" perpetually). Serving the raw PNG fixes it.
          unoptimized
          sizes="(max-width: 900px) 100vw, 1200px"
          className={styles.image}
        />
        {/* Dimension callouts (6 096 mm, 2 591 mm). */}
        <DimensionLines visible={inView} />
      </div>

      {/* Engineering corner callouts — 4 total. */}
      {cornerCallouts.map((c) => (
        <EngineeringCallout
          key={c.id}
          // TS narrowing: filter above guarantees corner placement
          component={c as typeof c & { placement: { kind: "corner"; corner: "tl" | "tr" | "bl" | "br" } }}
          active={c.id === activeId}
          dimmed={isDimmed(c.id, c.category)}
          onActivate={onActivate}
        />
      ))}

      {/* Port callouts — sit below the pod (pod baseline is ~y=86).
          Wrapped in a `.portRow` container that's `display: contents`
          on desktop (zero layout effect — children still use their
          inline `left: X%` to anchor to GPU-bay positions) and switches
          to a centered flex row on mobile (≤760px) so the 5 icons
          spread evenly under the pod instead of clustering on the
          left half. PortCallout's inline absolute positioning is
          overridden inside the mobile rule. */}
      <div className={styles.portRow}>
        {portCallouts.map((c) => (
          <PortCallout
            key={c.id}
            component={c as typeof c & { placement: { kind: "port" } }}
            active={c.id === activeId}
            dimmed={isDimmed(c.id, c.category)}
            onActivate={onActivate}
          />
        ))}
      </div>
    </div>
  );
}
