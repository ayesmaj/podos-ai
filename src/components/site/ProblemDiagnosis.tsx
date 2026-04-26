"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import styles from "./ProblemDiagnosis.module.css";
import {
  GridField,
  AmbientOrbs,
  Particles,
  VignetteLight,
} from "./BackgroundLayers";

/**
 * PROBLEM · The Diagnosis
 *
 * Reads like an SRE incident report on the whole AI build industry.
 * Four dashboard cards — each a single number that hurts to look at —
 * composed against the same light cyber-tech background vocabulary as
 * HERO. The waste portion of every visualization is rendered in
 * `--ink-whisper` (≈3% alpha ink), so the eye slides to the tiny
 * brand-gradient slice that hints at where PODOS sits.
 *
 * Composition rules:
 *   - Big number in `--ink-strong`. No color on the number itself —
 *     the authority is in the glyph, not the hue.
 *   - Mono eyebrow / unit labels. Tabular-figures ON via --font-mono.
 *   - Each card carries one visualization archetype so the page reads
 *     as a control-panel, not a homepage: timeline, stacked capex,
 *     utilisation ring, queue bar.
 *   - Numbers count up with useInView so they only fire when the
 *     section enters the viewport. Progress fills from 0 to target.
 *
 * This section is the bridge. Hero = "the AI economy needs a new
 * physical layer". PROBLEM = "here's the bill of indictment". Next:
 * PODOS = "here's the hardware fix".
 */

/* ------------------------------------------------------------------ */
/* COUNT-UP HOOK — useInView-triggered numeric ease                    */
/* ------------------------------------------------------------------ */
function useCountUp(
  target: number,
  inView: boolean,
  duration = 1400,
  start = 0
) {
  const [value, setValue] = useState(start);
  useEffect(() => {
    if (!inView) return;
    const startAt = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - startAt) / duration, 1);
      // easeOutQuart — feels authoritative, lands clean.
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(start + (target - start) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, inView, duration, start]);
  return value;
}

/* ------------------------------------------------------------------ */
/* PROGRESS BAR — fills once in view. Waste vs signal.                 */
/* ------------------------------------------------------------------ */
function WasteBar({
  wastePct,
  usefulPct,
  inView,
}: {
  wastePct: number;
  usefulPct: number;
  inView: boolean;
}) {
  return (
    <div className={styles.wasteBar}>
      <motion.div
        className={styles.wasteBarFill}
        initial={{ width: 0 }}
        animate={inView ? { width: `${wastePct}%` } : { width: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1], delay: 0.25 }}
      />
      <motion.div
        className={styles.wasteBarUseful}
        initial={{ width: 0 }}
        animate={inView ? { width: `${usefulPct}%` } : { width: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1], delay: 0.6 }}
        style={{ left: `${wastePct}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RING — single-value utilisation dial                                */
/* ------------------------------------------------------------------ */
function UtilRing({ usefulPct, inView }: { usefulPct: number; inView: boolean }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const filled = (usefulPct / 100) * c;
  return (
    <svg className={styles.ring} viewBox="0 0 120 120" aria-hidden>
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--cyan)" />
        </linearGradient>
      </defs>
      {/* Waste ring — ghost */}
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="var(--edge)"
        strokeWidth="6"
      />
      {/* Signal ring — tiny brand slice */}
      <motion.circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={inView ? { strokeDashoffset: c - filled } : { strokeDashoffset: c }}
        transition={{ duration: 1.3, ease: [0.22, 0.61, 0.36, 1], delay: 0.4 }}
        style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }}
      />
      {/* Center dot — control-panel tick */}
      <circle cx="60" cy="60" r="2" fill="var(--ink-dim)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* STACKED CAPEX BAR — $ breakdown                                     */
/* ------------------------------------------------------------------ */
const capexSegments = [
  { label: "SITE + EPC", pct: 34, amt: "$52M" },
  { label: "GRID + SUBSTATION", pct: 22, amt: "$34M" },
  { label: "COOLING + WATER", pct: 18, amt: "$28M" },
  { label: "GPUs + NETWORK", pct: 26, amt: "$41M" },
];
function CapexStack({ inView }: { inView: boolean }) {
  return (
    <div className={styles.capexStack}>
      <div className={styles.capexTrack}>
        {capexSegments.map((s, i) => (
          <motion.div
            key={s.label}
            className={styles.capexSeg}
            data-idx={i}
            initial={{ width: 0, opacity: 0 }}
            animate={inView ? { width: `${s.pct}%`, opacity: 1 } : { width: 0, opacity: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 0.61, 0.36, 1],
              delay: 0.35 + i * 0.12,
            }}
          />
        ))}
      </div>
      <div className={styles.capexLegend}>
        {capexSegments.map((s) => (
          <div key={s.label} className={styles.capexChip}>
            <span className={styles.capexChipLabel}>{s.label}</span>
            <span className={styles.capexChipAmt}>{s.amt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* QUEUE BAR — grid interconnect timeline                              */
/* ------------------------------------------------------------------ */
const queueMarks = [
  { at: 0, label: "APPLY" },
  { at: 18, label: "STUDY" },
  { at: 48, label: "AGREEMENT" },
  { at: 72, label: "BUILD" },
  { at: 100, label: "POWER ON" },
];
function QueueBar({ inView }: { inView: boolean }) {
  return (
    <div className={styles.queue}>
      <div className={styles.queueTrack}>
        <motion.div
          className={styles.queueFill}
          initial={{ width: 0 }}
          animate={inView ? { width: "100%" } : { width: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1], delay: 0.3 }}
        />
        {queueMarks.map((m, i) => (
          <motion.div
            key={m.label}
            className={styles.queueNode}
            style={{ left: `${m.at}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              delay: 0.4 + i * 0.18,
            }}
          />
        ))}
      </div>
      <div className={styles.queueLabels}>
        {queueMarks.map((m) => (
          <span
            key={m.label}
            className={styles.queueLabel}
            style={{ left: `${m.at}%` }}
          >
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* METRIC CARD SHELL                                                   */
/* ------------------------------------------------------------------ */
function MetricCard({
  code,
  label,
  number,
  unit,
  sub,
  children,
  index,
  inView,
}: {
  code: string;
  label: string;
  number: React.ReactNode;
  unit: string;
  sub: string;
  children: React.ReactNode;
  index: number;
  inView: boolean;
}) {
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 0.61, 0.36, 1],
        delay: 0.1 + index * 0.08,
      }}
    >
      <header className={styles.cardHead}>
        <span className={styles.cardCode}>{code}</span>
        <span className={styles.cardStatus}>
          <span className={styles.statusDotDegraded} />
          DEGRADED
        </span>
      </header>
      <div className={styles.cardLabel}>{label}</div>
      <div className={styles.cardFigure}>
        <span className={styles.cardNumber}>{number}</span>
        <span className={styles.cardUnit}>{unit}</span>
      </div>
      <div className={styles.cardSub}>{sub}</div>
      <div className={styles.cardViz}>{children}</div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* FORMATTERS                                                          */
/* ------------------------------------------------------------------ */
const fmt1 = (n: number) => n.toFixed(1);
const fmtInt = (n: number) => Math.round(n).toString();

/* ================================================================== */
/* SECTION                                                             */
/* ================================================================== */
export default function ProblemDiagnosis() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  // Count-ups — seeded so the numbers FEEL like telemetry reading in.
  const buildYears = useCountUp(3.2, inView, 1400, 0);
  const capexM = useCountUp(155, inView, 1600, 0);
  const gpuUseful = useCountUp(12, inView, 1400, 0);
  const gpuWaste = useCountUp(88, inView, 1400, 0); // noqa
  const queueMo = useCountUp(30, inView, 1500, 0);

  return (
    <section
      id="problem"
      ref={ref}
      className={`${styles.section} section-pad`}
      aria-labelledby="problem-heading"
    >
      {/* Background composition — continues the hero's atmosphere but
          slightly more "engineering diagnostic": sparser grid, single
          ambient orb, drifting particles. */}
      <div className={styles.bg} aria-hidden>
        <GridField variant="sparse" />
        <AmbientOrbs config="teal" />
        <Particles count={12} />
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
            <span className={styles.eyebrowIdx}>01</span>
            <span className={styles.eyebrowSep}>·</span>
            THE DIAGNOSIS
          </span>
          <h2 id="problem-heading" className={`${styles.headline} t-display`}>
            The AI economy is running on{" "}
            <span className="t-sweep-brand">broken infrastructure</span>.
          </h2>
          <p className={styles.lede}>
            Four metrics explain every missed AI deployment, stranded GPU, and
            24-month grid queue. The stack we inherited from cloud doesn&apos;t
            work at AI physics.
          </p>
        </motion.header>

        {/* METRIC GRID */}
        <div className={styles.grid}>
          <MetricCard
            code="M-01"
            label="BUILD TIMELINE"
            number={
              <>
                {fmt1(buildYears)}
                <span className={styles.cardNumberRange}>–4</span>
              </>
            }
            unit="years"
            sub="Industry median from broken ground to first MW serving inference."
            index={0}
            inView={inView}
          >
            <QueueBar inView={inView} />
          </MetricCard>

          <MetricCard
            code="M-02"
            label="CAPEX PER MEGAWATT"
            number={
              <>
                <span className={styles.cardCurrency}>$</span>
                {fmtInt(capexM)}
                <span className={styles.cardNumberRange}>–170</span>
              </>
            }
            unit="million"
            sub="Mostly concrete, substation, and cooling — not compute."
            index={1}
            inView={inView}
          >
            <CapexStack inView={inView} />
          </MetricCard>

          <MetricCard
            code="M-03"
            label="GPU MEMORY USEFUL"
            number={
              <>
                {fmtInt(gpuUseful)}
                <span className={styles.cardNumberRange}>–20</span>
              </>
            }
            unit="percent"
            sub="The rest is duplication, KV-cache overhead, and idle VRAM."
            index={2}
            inView={inView}
          >
            <div className={styles.ringWrap}>
              <UtilRing usefulPct={12} inView={inView} />
              <div className={styles.ringCaption}>
                <span className={styles.ringCaptionBig}>80–90%</span>
                <span className={styles.ringCaptionLbl}>VRAM WASTED</span>
              </div>
            </div>
          </MetricCard>

          <MetricCard
            code="M-04"
            label="TIME-TO-POWER"
            number={
              <>
                {fmtInt(queueMo)}
                <span className={styles.cardNumberRange}>–36</span>
              </>
            }
            unit="months"
            sub="Utility interconnect queue for a 100 MW+ greenfield site."
            index={3}
            inView={inView}
          >
            <WasteBar wastePct={80} usefulPct={12} inView={inView} />
            <div className={styles.wasteLegend}>
              <span className={styles.legendWaste}>
                <i /> GRID QUEUE · 80%
              </span>
              <span className={styles.legendUseful}>
                <i /> ACTIVE BUILD · 12%
              </span>
            </div>
          </MetricCard>
        </div>

        {/* TRANSITION LINE — flows to PODOS */}
        <motion.div
          className={styles.bridge}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <span className={styles.bridgeRule} aria-hidden />
          <span className={styles.bridgeText}>
            The industry is building 2020-era data centers for 2030 AI. PODOS
            starts over.
          </span>
          <span className={styles.bridgeRule} aria-hidden />
        </motion.div>
      </div>
    </section>
  );
}
