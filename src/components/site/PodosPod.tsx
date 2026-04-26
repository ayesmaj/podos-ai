"use client";

import { motion, useInView, useScroll } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";
import styles from "./PodosPod.module.css";
import {
  GridField,
  CircuitTraces,
  AmbientOrbs,
  VignetteLight,
} from "./BackgroundLayers";
import LineIcon from "./LineIcon";
import VideoBackground from "./VideoBackground";
import OptimusInteractive from "../optimus/OptimusInteractive";

/**
 * 3D rack viewer — code-split out of the initial bundle.
 *   • `ssr: false` because react-three-fiber needs window/WebGL
 *   • the heavy three.js + drei chunks (~600 kB gzipped) only load
 *     when the user actually scrolls the PODOS section into view
 *   • `loading` shows the section's skeleton chrome instead of a flash
 *     of nothing while the chunk + GLB stream in
 */
const PodosRack3D = dynamic(() => import("./PodosRack3D"), {
  ssr: false,
  loading: () => (
    <div className={styles.studioRackLoader}>Streaming rack geometry…</div>
  ),
});

/**
 * PODOS · The Physical Layer
 *
 * After the PROBLEM section diagnoses a broken industry, PODOS opens
 * with the hardware answer: a 1-MW modular pod, factory-built, shipped
 * in 90–120 days. Reads like a CAD package cover page — blueprint pod on
 * the left, spec sheet on the right, deploy timeline below.
 *
 * Aesthetic choices:
 *   - The pod is an SVG blueprint, not a render. Thin strokes, dimension
 *     arrows, mono callouts. Reads as "engineering drawing", not "hero
 *     marketing image". The brand gradient appears only on the GPU rack
 *     fill — the productive volume of the pod.
 *   - The spec rail reads as a manufacturer nameplate: label-value rows,
 *     tabular figures, subtle hairlines between. No icons, no flourishes.
 *   - 90–120 day timeline is the ONE place we let the brand gradient fill
 *     a whole line — "this is how fast the physical stack lands".
 *   - Blueprint path-draws in as the section enters viewport
 *     (pathLength 0→1 over ~1.8s), so the user sees the pod "assemble".
 *
 * This is the PHYSICAL pillar. SYNTROPIC (next section) is the SOFTWARE
 * pillar. Together they multiply → 85× in FUSION.
 */

/* ------------------------------------------------------------------ */
/* SPEC SHEET DATA — manufacturer nameplate                            */
/* ------------------------------------------------------------------ */
const specs = [
  { label: "POWER",    value: "1",      unit: "MW",    note: "per pod · 13.8 kV MV input" },
  { label: "COMPUTE",  value: "128",    unit: "GPUs",  note: "per pod" },
  { label: "FOOTPRINT",value: "720",    unit: "sq ft", note: "12 × 60 ft · fully relocatable" },
  { label: "COOLING",  value: "Closed-loop liquid", unit: "", note: "direct-to-chip · zero water" },
  { label: "PUE",      value: "1.08–1.12", unit: "",  note: "hyperscaler avg 1.58" },
  { label: "ENCLOSURE",value: "Thermos", unit: "",    note: "6-surface foam + reflective barrier" },
  { label: "OFF-GRID", value: "Solar + battery + generator", unit: "", note: "no fiber or grid required" },
  { label: "HEAT RECOVERY", value: "ORC", unit: "engine", note: "60–110 kW reclaimed per pod" },
  { label: "DEPLOY",   value: "90–120", unit: "days",  note: "door to dashboard" },
  { label: "MFG",      value: "California", unit: "", note: "shipped · not sited" },
  { label: "PATENTS",  value: "76+",    unit: "USPTO", note: "granted + pending" },
];

/* ------------------------------------------------------------------ */
/* DEPLOY TIMELINE DATA                                                */
/* ------------------------------------------------------------------ */
const timeline = [
  { d: "D+0",  label: "Order placed",      detail: "Site engineering kickoff." },
  { d: "D+30", label: "Factory complete",  detail: "Pod integrated, burned-in, shipped." },
  { d: "D+60", label: "Site + arrival",    detail: "Concrete pad cured, pod craned in." },
  { d: "D+90–120", label: "Serving inference", detail: "First megawatt online." },
];

/* ------------------------------------------------------------------ */
/* PRODUCT LADDER — POD (1 MW) → SILO (20 MW)                          */
/* ------------------------------------------------------------------ */
/**
 * Two-tier product offering. The POD is the unit economics atom. The
 * SILO is a multi-pod cluster that ships at hyperscaler scale with the
 * same factory-built discipline. The visual ladder sells the story:
 * "same DNA, scales to $20M sites."
 *
 * Each tile mirrors the same shape so the asymmetric numbers (1 → 20,
 * 128 → 2,560) do the rhetorical work without copy gymnastics.
 */
const PRODUCT_LADDER = [
  {
    code: "PROD-01",
    icon: "pod" as const,
    name: "PODOS POD",
    tag: "1 MW · UNIT",
    subtitle:
      "Containerized factory-built AI supercomputer. 720 sq ft, fully relocatable, off-grid capable.",
    specs: [
      { k: "POWER",     v: "1 MW" },
      { k: "COMPUTE",   v: "128 GPUs" },
      { k: "FOOTPRINT", v: "720 sq ft" },
      { k: "DEPLOY",    v: "90–120 days" },
    ],
    badge: "PILOT · VALIDATED",
    badgeTone: "signed" as const,
  },
  {
    code: "PROD-02",
    icon: "silo" as const,
    name: "MEGA SILO",
    tag: "20 MW · CLUSTER",
    subtitle:
      "Hyperbaric N₂ compound at 3–5+ atm. 24 pods in 20,000 sq ft — replaces 100,000 sq ft of traditional data center (83% smaller).",
    specs: [
      { k: "POWER",     v: "20 MW" },
      { k: "COMPUTE",   v: "2,560 GPUs" },
      { k: "DENSITY",   v: "3–5+ atm N₂" },
      { k: "FOOTPRINT", v: "−83% vs DC" },
    ],
    badge: "Q4 2026 · TAKING LOIs",
    badgeTone: "validated" as const,
  },
];

/* ------------------------------------------------------------------ */
/* ENGINEERING PRINCIPLES — four pillars that make the box different   */
/* ------------------------------------------------------------------ */
/**
 * Deck Slide 5 "The PODOS Pod" lists four defensible engineering
 * decisions that collectively make the modular approach work. These
 * aren't "features" — they're the reason the capex and deploy-time
 * numbers in the spec sheet are achievable at all. Rendered as
 * four cards AFTER the product ladder so the user reads:
 *
 *   1. Here's the product (POD + SILO)
 *   2. Here's WHY the product economics are real
 *
 * Not HERE's how you use them — HERE's what makes them possible.
 */
const ENGINEERING_PRINCIPLES = [
  {
    code: "E-01",
    title: "Thermos enclosure",
    detail:
      "Multi-layer foam core + reflective vapor barrier on all six surfaces. Thermal delta held steady regardless of climate — Arctic field to Phoenix tarmac, same PUE.",
    metric: "6 surfaces",
    metricLabel: "INSULATED",
  },
  {
    code: "E-02",
    title: "ORC heat engine",
    detail:
      "Organic Rankine Cycle on the waste-heat loop recaptures 60–110 kW as grid-synchronous electricity. Adds ~$57K/yr of revenue per pod without any additional footprint.",
    metric: "$57K",
    metricLabel: "/yr/pod reclaimed",
  },
  {
    code: "E-03",
    title: "Off-grid ready",
    detail:
      "Solar roof + battery bank + backup generator integrated. Can deploy to remote edge sites without fiber or utility interconnect — same 90-day timeline, anywhere on the map.",
    metric: "0",
    metricLabel: "GRID DEPENDENCY",
  },
  {
    code: "E-04",
    title: "Zero water · zero concrete",
    detail:
      "Closed-loop direct-to-chip liquid means no cooling towers, no water-rights negotiation, no slab permits. The pod lands on gravel or asphalt and starts serving inference.",
    metric: "0 gal",
    metricLabel: "WATER · CONCRETE",
  },
];

/* ================================================================== */
/* SECTION                                                             */
/* ================================================================== */
export default function PodosPod() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  /* ================================================================
   * SCROLL CHOREOGRAPHY — drives the 3D rack rotation
   * ----------------------------------------------------------------
   * The `studio` div is 140vh tall; its inner `.studioStage` is
   * `position: sticky`. While the user scrolls through the studio
   * region, the stage stays pinned (100vh) and the rack inside
   * rotates from a hero 3/4 "product photo" angle (progress 0) to
   * a marketing-isometric lock pose (progress 1) — so the schematic
   * beside it reads as the engineering source-of-truth while the
   * 3D model performs the live render counterpart.
   *
   * `useScroll` returns a `MotionValue<number>` clamped to [0, 1].
   * We hand it directly to `<PodosRack3D>` — the WebGL component
   * subscribes to `.get()` inside its `useFrame` callback, so React
   * never re-renders the canvas tree when the value changes.
   * ================================================================ */
  const studioRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: studioRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="podos"
      ref={ref}
      className={`${styles.section} section-pad`}
      aria-labelledby="podos-heading"
    >
      {/* Background — engineer's drafting table: dense grid, a single
          ambient blue orb off-screen, faint circuit traces behind. */}
      <div className={styles.bg} aria-hidden>
        {/* Base: modular-infra footage (shipping containers, factory
            yards). Tinted cyan by the VideoBackground overlay stack so
            warehouse beige becomes brand-coherent. */}
        <VideoBackground variant="modular-infra" />
        <GridField variant="dense" />
        <CircuitTraces accent="electric" />
        <AmbientOrbs config="electric" />
        <VignetteLight />
      </div>

      <div className={`container-site ${styles.inner}`}>
        {/* HEADER */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <span className="t-eyebrow">
            <span className={styles.eyebrowIdx}>02</span>
            <span className={styles.eyebrowSep}>·</span>
            THE PHYSICAL LAYER
          </span>
          <h2 id="podos-heading" className={`${styles.headline} t-display`}>
            Deploy <span className="t-sweep-brand">one megawatt</span> in
            90–120 days.
            <br />
            Not four years.
          </h2>
          <p className={styles.lede}>
            PODOS is a factory-built modular AI supercomputer. Power, cooling,
            networking, fire, seismic — integrated and pressure-tested before
            it leaves California. Sites prepare the pad. The pod brings the
            data center.
          </p>
        </motion.header>

        {/* ============ STUDIO — 3D rack only, full-width, scroll-locked ============
            The rack now occupies the full content width centered above
            the engineering schematic. This restores horizontal room
            (no more right-edge clipping) and gives the lock-in scroll
            choreography a more dramatic stage. The schematic + spec
            nameplate live in the original side-by-side grid directly
            below this block, exactly where they used to be.

            Sticky behaviour: 140vh outer wrapper, 100vh sticky inner
            stage. Below 1020px both relax to normal block flow (CSS). */}
        <div ref={studioRef} className={styles.studio}>
          <div className={styles.studioStage}>
            <div className={styles.studioGrid}>
              <motion.div
                className={styles.studioRack}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.9,
                  delay: 0.15,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                <div className={styles.studioRackHead}>
                  <span>
                    <span className={styles.studioRackHeadDot} aria-hidden />
                    <b>POD-0042 · ASSY</b>
                  </span>
                  <span>3D · LIVE GEOMETRY · DRAG OR SCROLL</span>
                </div>

                {/* Pass scroll progress as a MotionValue. Inside the
                    Canvas, useFrame reads .get() each animation frame
                    and rotates the group toward target — no React
                    re-renders fire when the value updates. */}
                <PodosRack3D scrollProgress={scrollYProgress} />

                {/* Affordance for the rotation interaction. Hidden on
                    touch devices (CSS hover:none rule) since the
                    scroll-rotate metaphor is already self-evident on
                    mobile. */}
                <div className={styles.studioScrollHint} aria-hidden>
                  <svg viewBox="0 0 12 12">
                    <path
                      d="M2 4 L6 9 L10 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Drag or scroll to rotate
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ============ INTERACTIVE OPTIMUS POD SPEC ============
            2026-04-24: Replaced the static side-by-side
            blueprint+nameplate with the interactive Optimus spec view.
            The new component (OptimusInteractive) renders:
              • the photorealistic pod render (`/public/optimus/optimus-pod-front.png`)
              • a cyan SVG cutaway overlay (8-bay grid + flow arrows)
              • engineering callouts (corner-style) and port callouts (icon row)
              • a 5-column feature ribbon below the pod
              • a slide-in DetailPanel for each callout with rich specs
            The 9 callouts replace the static spec rows the nameplate
            used to show — each panel carries far richer per-component
            spec content. The legacy `specs` array + `PodSVG` component
            remain in this file for now (they're dead but small) so
            this swap is fully reversible if needed. */}
        <OptimusInteractive />

        {/* DEPLOY TIMELINE */}
        <div className={styles.timelineWrap}>
          <div className={styles.timelineHead}>
            <span className="t-eyebrow">DEPLOY · 90–120 DAYS · FACTORY TO FIRST MW</span>
          </div>
          <div className={styles.timeline}>
            <div className={styles.timelineTrack}>
              <motion.div
                className={styles.timelineFill}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1.6, delay: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
              />
            </div>
            <div className={styles.timelineStops}>
              {timeline.map((t, i) => (
                <motion.div
                  key={t.d}
                  className={styles.timelineStop}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.0 + i * 0.15,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                >
                  <span className={styles.timelineNode} />
                  <span className={styles.timelineDay}>{t.d}</span>
                  <span className={styles.timelineLabel}>{t.label}</span>
                  <span className={styles.timelineDetail}>{t.detail}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ============ PRODUCT LADDER ============
            POD (1 MW) → MEGA SILO (20 MW). Same factory DNA, different
            scale. Positioned AFTER the timeline so the reader has
            absorbed "90–120 days to 1 MW" before being asked to picture
            the 20-MW cluster. */}
        <ProductLadder inView={inView} />

        {/* ============ ENGINEERING PRINCIPLES ============
            Four pillars that make the capex + deploy-time numbers
            above possible at all. Thermos, ORC, off-grid, zero-water.
            Reads as "here's why the numbers are real", not "here are
            some features". */}
        <EngineeringPrinciples inView={inView} />
      </div>
    </section>
  );
}

/* ================================================================== */
/* PRODUCT LADDER — POD (1 MW) → MEGA SILO (20 MW)                     */
/* ================================================================== */
/**
 * A two-tile product strip that introduces the MEGA SILO (20 MW
 * cluster) as the scaled-up sibling of the POD. Tiles share layout
 * so the asymmetric numbers (1 → 20, 128 → 2,560) carry the argument
 * without needing marketing copy.
 *
 * Tile anatomy (identical across both tiers):
 *   - Icon (LineIcon primitive — pod / silo)
 *   - Code pill + badge (availability status)
 *   - Product name + tier tag
 *   - One-line subtitle
 *   - 4-row spec grid (POWER / COMPUTE / DEPLOY / PUE)
 *
 * The only visual differentiation between tiles is which spec
 * numbers change. This is intentional — the product design rhymes
 * across tiers, so the user reads "same system, bigger scale."
 */
function ProductLadder({ inView }: { inView: boolean }) {
  return (
    <motion.div
      className={styles.ladder}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 1.7, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <div className={styles.ladderHead}>
        <span className="t-eyebrow">PRODUCT LADDER · SAME DNA, TWO SCALES</span>
        <span className={styles.ladderHeadNote}>
          Unit economics prove at 1 MW · cluster economics unlock at 20 MW
        </span>
      </div>

      <div className={styles.ladderGrid}>
        {PRODUCT_LADDER.map((p, i) => (
          <motion.article
            key={p.code}
            className={`${styles.ladderTile} ${
              i === 0 ? styles.ladderTilePod : styles.ladderTileSilo
            }`}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 1.85 + i * 0.12,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            <header className={styles.ladderTileHead}>
              <span className={styles.ladderCode}>{p.code}</span>
              <span
                className={`${styles.ladderBadge} ${
                  p.badgeTone === "signed"
                    ? styles.ladderBadgeSigned
                    : styles.ladderBadgeValidated
                }`}
              >
                <span className={styles.ladderBadgeDot} aria-hidden />
                {p.badge}
              </span>
            </header>

            <div className={styles.ladderTileBody}>
              <div className={styles.ladderIconWrap}>
                <LineIcon name={p.icon} size={32} strokeWidth={1.4} />
              </div>
              <div className={styles.ladderTileTitle}>
                <div className={styles.ladderName}>{p.name}</div>
                <div className={styles.ladderTag}>{p.tag}</div>
              </div>
            </div>

            <p className={styles.ladderSubtitle}>{p.subtitle}</p>

            <dl className={styles.ladderSpecs}>
              {p.specs.map((s) => (
                <div key={s.k} className={styles.ladderSpec}>
                  <dt className={styles.ladderSpecKey}>{s.k}</dt>
                  <dd className={styles.ladderSpecVal}>{s.v}</dd>
                </div>
              ))}
            </dl>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/* ENGINEERING PRINCIPLES — four-card panel                            */
/* ================================================================== */
/**
 * A four-column strip that follows the product ladder. Each card is
 * tight: eyebrow code, title, one detail paragraph, one standout
 * metric. Visually matches the product-ladder tiles so the section
 * reads as one continuous spec document — pod + silo + principles —
 * rather than three disconnected panels.
 */
function EngineeringPrinciples({ inView }: { inView: boolean }) {
  return (
    <motion.div
      className={styles.principles}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 2.1, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <div className={styles.principlesHead}>
        <span className="t-eyebrow">
          ENGINEERING PRINCIPLES · WHY THE ECONOMICS WORK
        </span>
        <span className={styles.principlesHeadNote}>
          Four decisions that collapse three years of traditional DC
          construction into a 90-day factory cycle.
        </span>
      </div>

      <div className={styles.principlesGrid}>
        {ENGINEERING_PRINCIPLES.map((p, i) => (
          <motion.article
            key={p.code}
            className={styles.principleTile}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 2.25 + i * 0.1,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            <header className={styles.principleHead}>
              <span className={styles.principleCode}>{p.code}</span>
              <div className={styles.principleMetric}>
                <span className={styles.principleMetricValue}>{p.metric}</span>
                <span className={styles.principleMetricLabel}>
                  {p.metricLabel}
                </span>
              </div>
            </header>
            <h3 className={styles.principleTitle}>{p.title}</h3>
            <p className={styles.principleDetail}>{p.detail}</p>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/* POD BLUEPRINT SVG                                                   */
/* ================================================================== */
/**
 * A CAD-style front elevation of a 1-MW pod.
 *
 * - Outer shell: 20ft ISO-container silhouette with corner castings
 * - 4x2 GPU rack bays (filled with brand gradient — productive volume)
 * - Ports on the front: power, coolant in/out, network fiber, exhaust
 * - Dimension arrows at bottom (width) and right (height)
 * - Callout lines pointing to 4 subsystems
 *
 * Each path has a synthetic "draw-in" animation on enter via pathLength.
 */
function PodSVG({ inView }: { inView: boolean }) {
  // Drawing geometry — expressed in an 800×500 viewBox so we can scale
  // fluidly. Numbers tuned for visual balance, not literal 20ft scale.
  const frame = { x: 100, y: 80, w: 600, h: 300 };
  const bayCols = 4;
  const bayRows = 2;
  const bayGap = 14;
  const bayInset = 28;

  const bayW =
    (frame.w - bayInset * 2 - bayGap * (bayCols - 1)) / bayCols;
  const bayH =
    (frame.h - bayInset * 2 - bayGap * (bayRows - 1)) / bayRows;

  const bays = [];
  for (let r = 0; r < bayRows; r++) {
    for (let c = 0; c < bayCols; c++) {
      bays.push({
        x: frame.x + bayInset + c * (bayW + bayGap),
        y: frame.y + bayInset + r * (bayH + bayGap),
        w: bayW,
        h: bayH,
        idx: r * bayCols + c,
      });
    }
  }

  // Entrance animation for every path is shared.
  // The `as const` on the ease tuple narrows it from `number[]` to
  // `readonly [number, number, number, number]`, which framer-motion
  // v12 accepts as a valid cubic-bezier `Easing` when the object is
  // spread into an SVGMotion component (where inline literal inference
  // doesn't kick in).
  const draw = (delay = 0) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: inView
      ? { pathLength: 1, opacity: 1 }
      : { pathLength: 0, opacity: 0 },
    transition: { duration: 1.4, delay, ease: [0.22, 0.61, 0.36, 1] as const },
  });

  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0 },
    animate: inView ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: 0.6, delay },
  });

  return (
    <svg
      className={styles.podSvg}
      viewBox="-60 -20 920 560"
      role="img"
      aria-label="PODOS 1-MW pod blueprint — front elevation"
    >
      <defs>
        <linearGradient id="bayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="bayStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--cyan)" />
        </linearGradient>
      </defs>

      {/* --- Outer frame --- */}
      <motion.rect
        x={frame.x}
        y={frame.y}
        width={frame.w}
        height={frame.h}
        fill="none"
        stroke="var(--ink-strong)"
        strokeWidth="1.5"
        {...draw(0.2)}
      />
      {/* Corner castings */}
      {[
        [frame.x, frame.y],
        [frame.x + frame.w, frame.y],
        [frame.x, frame.y + frame.h],
        [frame.x + frame.w, frame.y + frame.h],
      ].map(([cx, cy], i) => (
        <motion.rect
          key={i}
          x={cx - 8}
          y={cy - 8}
          width="16"
          height="16"
          fill="var(--paper)"
          stroke="var(--ink-strong)"
          strokeWidth="1.2"
          {...fadeIn(0.6 + i * 0.05)}
        />
      ))}

      {/* --- GPU bays --- */}
      {bays.map((b) => (
        <g key={b.idx}>
          <motion.rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill="url(#bayGrad)"
            stroke="url(#bayStroke)"
            strokeWidth="1"
            {...fadeIn(0.8 + b.idx * 0.08)}
          />
          {/* rack slot lines */}
          {[0.3, 0.5, 0.7].map((p, i) => (
            <motion.line
              key={i}
              x1={b.x + 4}
              x2={b.x + b.w - 4}
              y1={b.y + b.h * p}
              y2={b.y + b.h * p}
              stroke="var(--cyan)"
              strokeOpacity="0.35"
              strokeWidth="0.6"
              {...fadeIn(1.0 + b.idx * 0.05 + i * 0.02)}
            />
          ))}
          {/* node dot — this is the per-bay "activity LED". After it
              fades in with the drawing sequence, it keeps breathing
              forever via a per-attribute framer-motion loop on `r`.
              Using a radius animation (not opacity) keeps it distinct
              from the fadeIn controller — the two transitions don't
              fight each other, and the 0.13s offset per bay
              desynchronizes the grid so it reads as "live nodes",
              not "synchronized blinker". */}
          <motion.circle
            cx={b.x + b.w - 7}
            cy={b.y + 7}
            initial={{ opacity: 0, r: 1.8 }}
            animate={
              inView
                ? {
                    opacity: 1,
                    r: [1.6, 2.5, 1.4, 2.2, 1.7, 2.4, 1.6],
                  }
                : { opacity: 0, r: 1.8 }
            }
            transition={{
              opacity: {
                duration: 0.6,
                delay: 1.1 + b.idx * 0.05,
                ease: [0.22, 0.61, 0.36, 1],
              },
              r: {
                duration: 3.2,
                delay: 1.5 + b.idx * 0.13,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            fill="var(--cyan)"
          />
        </g>
      ))}

      {/* --- Cooling manifold loop ---
          A live coolant flow path routed from the COOL IN port (bottom,
          x≈300) up into the pod, horizontally through the inter-bay
          gap (y≈230 — midway between row 0 and row 1), and back down
          to COOL OUT (x≈400). Stroke-dashoffset animates continuously
          via the `.data-stream` utility class defined in globals.css —
          no JS timer, no framer-motion overhead after first paint.
          The surrounding `<motion.g>` handles the one-shot fade-in to
          sync with the rest of the blueprint draw sequence. */}
      <motion.g {...fadeIn(2.05)}>
        {/* Primary coolant loop — up → across → down (U-shape) */}
        <path
          d="M 300 404 L 300 240 L 130 240 L 130 230 L 670 230 L 670 240 L 400 240 L 400 404"
          fill="none"
          stroke="var(--cyan)"
          strokeOpacity="0.72"
          strokeWidth="1.2"
          strokeLinejoin="round"
          className="data-stream data-stream--slow"
        />
        {/* Return line — a second thinner pass just above, completes
            the "loop" read so the eye sees a closed circuit not an
            open pipe. */}
        <path
          d="M 140 217 L 660 217"
          fill="none"
          stroke="var(--brand)"
          strokeOpacity="0.45"
          strokeWidth="0.9"
          className="data-stream"
        />
        {/* Flow-direction arrowheads — small chevrons placed at two
            points along the manifold so the flow direction reads at a
            glance, not just as "shimmering dashes". */}
        <path
          d="M 398 228 L 404 232 L 398 236"
          fill="none"
          stroke="var(--cyan)"
          strokeOpacity="0.8"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 302 242 L 296 238 L 302 234"
          fill="none"
          stroke="var(--cyan)"
          strokeOpacity="0.8"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Coolant label — tucked above the manifold so the path
            reads as "this is what the flowing dashes are" without
            stealing attention from the GPU bays. */}
        <text
          x={400}
          y={208}
          textAnchor="middle"
          className={styles.podSvgCallout}
          opacity="0.78"
        >
          CLOSED-LOOP COOLANT
        </text>
      </motion.g>

      {/* --- Front-panel ports across the bottom of the frame --- */}
      {[
        { cx: 180, label: "PWR IN" },
        { cx: 300, label: "COOL IN" },
        { cx: 400, label: "COOL OUT" },
        { cx: 520, label: "NET FIBER" },
        { cx: 640, label: "EXHAUST" },
      ].map((p, i) => (
        <g key={p.label}>
          <motion.rect
            x={p.cx - 16}
            y={frame.y + frame.h + 10}
            width="32"
            height="14"
            fill="var(--panel)"
            stroke="var(--ink-strong)"
            strokeWidth="1"
            {...fadeIn(1.3 + i * 0.07)}
          />
          <motion.text
            x={p.cx}
            y={frame.y + frame.h + 38}
            textAnchor="middle"
            className={styles.podSvgLabel}
            {...fadeIn(1.4 + i * 0.07)}
          >
            {p.label}
          </motion.text>
        </g>
      ))}

      {/* --- Dimension arrow (width) --- */}
      <motion.g {...fadeIn(1.7)}>
        <line
          x1={frame.x}
          x2={frame.x + frame.w}
          y1={frame.y - 24}
          y2={frame.y - 24}
          stroke="var(--ink-faint)"
          strokeWidth="0.8"
        />
        <line x1={frame.x} x2={frame.x} y1={frame.y - 30} y2={frame.y - 18} stroke="var(--ink-faint)" strokeWidth="0.8" />
        <line x1={frame.x + frame.w} x2={frame.x + frame.w} y1={frame.y - 30} y2={frame.y - 18} stroke="var(--ink-faint)" strokeWidth="0.8" />
        <rect x={frame.x + frame.w / 2 - 28} y={frame.y - 34} width="56" height="20" fill="var(--paper)" />
        <text
          x={frame.x + frame.w / 2}
          y={frame.y - 20}
          textAnchor="middle"
          className={styles.podSvgDim}
        >
          6 096 mm
        </text>
      </motion.g>

      {/* --- Dimension arrow (height) --- */}
      <motion.g {...fadeIn(1.8)}>
        <line
          x1={frame.x - 24}
          x2={frame.x - 24}
          y1={frame.y}
          y2={frame.y + frame.h}
          stroke="var(--ink-faint)"
          strokeWidth="0.8"
        />
        <line x1={frame.x - 30} x2={frame.x - 18} y1={frame.y} y2={frame.y} stroke="var(--ink-faint)" strokeWidth="0.8" />
        <line x1={frame.x - 30} x2={frame.x - 18} y1={frame.y + frame.h} y2={frame.y + frame.h} stroke="var(--ink-faint)" strokeWidth="0.8" />
        <rect x={frame.x - 52} y={frame.y + frame.h / 2 - 10} width="56" height="20" fill="var(--paper)" />
        <text
          x={frame.x - 24}
          y={frame.y + frame.h / 2 + 4}
          textAnchor="middle"
          className={styles.podSvgDim}
        >
          2 591 mm
        </text>
      </motion.g>

      {/* --- Callouts --- */}
      {[
        { from: [bays[0].x + bayW / 2, bays[0].y], to: [80, 40], label: "128× GPU BAY" },
        { from: [frame.x + frame.w, frame.y + 40], to: [740, 40], label: "MV SWITCHGEAR" },
        { from: [frame.x + frame.w, frame.y + frame.h - 40], to: [740, frame.y + frame.h + 20], label: "COOLING MANIFOLD" },
        { from: [bays[bayCols].x + bayW / 2, bays[bayCols].y + bayH], to: [80, frame.y + frame.h + 40], label: "SEISMIC FRAME" },
      ].map((c, i) => {
        const [fx, fy] = c.from;
        const [tx, ty] = c.to;
        const midX = (fx + tx) / 2;
        return (
          <motion.g key={c.label} {...fadeIn(1.9 + i * 0.1)}>
            <path
              d={`M ${fx} ${fy} L ${midX} ${fy} L ${midX} ${ty} L ${tx} ${ty}`}
              fill="none"
              stroke="var(--cyan)"
              strokeOpacity="0.55"
              strokeWidth="0.8"
              strokeDasharray="3 2"
            />
            <circle cx={fx} cy={fy} r="2.5" fill="var(--cyan)" />
            <text
              x={tx < 400 ? tx - 4 : tx + 4}
              y={ty + 4}
              textAnchor={tx < 400 ? "end" : "start"}
              className={styles.podSvgCallout}
            >
              {c.label}
            </text>
          </motion.g>
        );
      })}

      {/* --- Status tick ---
          Living breathing "ONLINE" chip. Two layered circles replace the
          previous static green dot:
            1. Outer ring: expands + fades on a 2.2s loop — the "heartbeat"
               signal reviewers read as "this thing is actually running".
            2. Inner core: a subtle r breathe keeps the dot itself alive
               even mid-expansion, so the eye always has a solid anchor.
          Same rhythm as the Hero HUD's live-pulse--sm dot (CSS utility),
          but implemented via framer-motion because pseudo-elements can't
          be used inside an <svg> context. */}
      <motion.g {...fadeIn(2.3)}>
        <rect
          x={frame.x + 12}
          y={frame.y + 12}
          width="70"
          height="18"
          rx="2"
          fill="var(--panel)"
          stroke="var(--ink-whisper)"
          strokeWidth="0.8"
        />
        {/* Expanding heartbeat ring — starts invisible, scales out, fades. */}
        <motion.circle
          cx={frame.x + 24}
          cy={frame.y + 21}
          fill="var(--status)"
          initial={{ r: 3, opacity: 0 }}
          animate={inView ? { r: [3, 8, 8], opacity: [0.55, 0, 0] } : { r: 3, opacity: 0 }}
          transition={{
            duration: 2.2,
            delay: 2.6,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        {/* Solid core — subtle breathe so the dot never feels frozen. */}
        <motion.circle
          cx={frame.x + 24}
          cy={frame.y + 21}
          fill="var(--status)"
          initial={{ r: 3 }}
          animate={inView ? { r: [3, 3.4, 3] } : { r: 3 }}
          transition={{
            duration: 2.2,
            delay: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <text x={frame.x + 32} y={frame.y + 25} className={styles.podSvgStatus}>
          ONLINE
        </text>
      </motion.g>
    </svg>
  );
}
