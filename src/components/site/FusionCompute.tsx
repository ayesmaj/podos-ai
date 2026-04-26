"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  GridField,
  AmbientOrbs,
  EnergyFlow,
  Particles,
  VignetteLight,
} from "./BackgroundLayers";
import VideoBackground from "./VideoBackground";
import styles from "./FusionCompute.module.css";

/**
 * SECTION 05 — FUSION
 *
 * The climax. Up to this point the narrative has been:
 *   02 PROBLEM    — conventional AI infra is broken
 *   03 PODOS      — hardware advantage: 10× faster deploy
 *   04 SYNTROPIC  — software advantage: 10× per-GPU productivity
 *
 * FUSION multiplies the two into a single number that investors carry
 * out of the deck in their heads:  10 × 8.5 = 85×.
 *
 * Layout — a math equation, left-to-right:
 *   [ FACTOR A  · 10 × ]  ×  [ FACTOR B · 8.5 × ]  =  [ RESULT · 85 × ]
 *
 * The RESULT cell is visually dominant (~1.8× width and numeric scale
 * of the factor cells) and carries a soft gradient halo. Below the
 * equation, a "translation" strip converts 85× into four investor-
 * legible consequences for a hyperscaler trying to match one PODOS pod.
 */

/* ------------------------------------------------------------------
   useCountUp — shared easeOutQuart ramp used across PROBLEM / PODOS /
   SYNTROPIC number tiles. Keeps telemetry feel consistent.
   ------------------------------------------------------------------ */
function useCountUp(
  target: number,
  inView: boolean,
  delay = 0,
  duration = 1.4,
  decimals = 0
) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) {
      setV(0);
      return;
    }
    let rafId = 0;
    const startAt = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const e = Math.max(0, Math.min(1, (now - startAt) / (duration * 1000)));
      const q = 1 - Math.pow(1 - e, 4);
      setV(q * target);
      if (e < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, inView, delay, duration]);
  return decimals === 0 ? Math.round(v).toString() : v.toFixed(decimals);
}

export default function FusionCompute() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const t = reduce ? 0 : 1;

  // Timing beats — factors arrive first, operators next, RESULT last.
  const hw = useCountUp(10, inView, 0.55 * t, 0.9, 0);
  const sw = useCountUp(8.5, inView, 0.95 * t, 1.0, 1);
  const fus = useCountUp(85, inView, 1.75 * t, 1.5, 0);

  return (
    <section ref={ref} className={`${styles.section} section-pad`}>
      <div className={styles.bg}>
        {/* Base: plasma-core footage, deep-tinted at strong intensity.
            Climax energy for the 85× moment — the overlay leans dark so
            bright hot-spots in the source punch through as the only
            light in the section. */}
        <VideoBackground variant="fusion" />
        <GridField variant="sparse" />
        <AmbientOrbs config="tri" />
        <EnergyFlow lines={3} />
        <Particles count={14} />
        <VignetteLight />
      </div>

      <div className="container-site" style={{ position: "relative", zIndex: 2 }}>
        {/* ============== HEADER ============== */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 * t, ease: "easeOut" }}
        >
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowIdx}>05</span>
            <span className={styles.eyebrowSep}>·</span>
            THE MULTIPLICATION
          </div>
          <h2 className={styles.headline}>
            Deploy <span className="t-sweep-brand">10× faster</span>. Every GPU{" "}
            <span className="t-sweep-brand">10× more productive</span>. Net
            result: <span className="t-sweep-brand">85×</span>.
          </h2>
          <p className={styles.lede}>
            Hardware speed and software density compound. One PODOS pod
            running Syntropic delivers the useful AI throughput of an 85-pod
            conventional build-out — at roughly one-eighty-fifth the capital
            cost per token served.
          </p>
        </motion.header>

        {/* ============== EQUATION ============== */}
        <div className={styles.equation}>
          <FactorCell
            idx="A"
            label="HARDWARE LAYER"
            subLabel="Time to Capacity"
            number={hw}
            unit="×"
            tagline="FASTER DEPLOY"
            line1="90-day PODOS pod · factory-built, grid-agnostic"
            line2="vs. 24–36 month hyperscaler site build"
            barFill={1.0}
            inView={inView}
            delay={0.45}
          />

          <Operator type="times" inView={inView} delay={1.15} />

          <FactorCell
            idx="B"
            label="SOFTWARE LAYER"
            subLabel="Per-GPU Throughput"
            number={sw}
            unit="×"
            tagline="USEFUL TOKENS / GPU-HR"
            line1="99.6% sustained utilization vs. 12% baseline"
            line2="× 10:1 Syntropic model packing"
            barFill={0.85}
            inView={inView}
            delay={0.85}
          />

          <Operator type="equals" inView={inView} delay={1.55} />

          <ResultCell inView={inView} value={fus} />
        </div>

        {/* ============== TRANSLATION STRIP ============== */}
        <motion.div
          className={styles.translation}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 * t, delay: 2.5 * t, ease: "easeOut" }}
        >
          <div className={styles.translationHead}>
            <span className={styles.translationTag}>THE TRANSLATION</span>
            <span className={styles.translationCaption}>
              To match the useful output of a single PODOS pod, a conventional
              hyperscaler would need:
            </span>
          </div>
          <div className={styles.translationRows}>
            {TRANSLATION_ROWS.map((r, i) => (
              <motion.div
                key={r.label}
                className={styles.translationRow}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6 * t,
                  delay: (2.8 + i * 0.12) * t,
                  ease: "easeOut",
                }}
              >
                <span className={styles.translationMetric}>{r.metric}</span>
                <div className={styles.translationBody}>
                  <span className={styles.translationLabel}>{r.label}</span>
                  <span className={styles.translationNote}>{r.note}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ============== ECONOMICS LEDGER (Slide 7) ==============
            The translation strip above is qualitative — "how much more
            is required to match us". This ledger is quantitative — the
            actual dollars and tons on a like-for-like 5-MW workload.
            Reads as an accounting statement, not a marketing claim. */}
        <motion.div
          className={styles.economics}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 * t, delay: 3.6 * t, ease: "easeOut" }}
          aria-label="5-MW workload economics: traditional data center vs PODOS"
        >
          <div className={styles.economicsHead}>
            <span className={styles.economicsTag}>
              LEDGER · 5-MW WORKLOAD · LIKE-FOR-LIKE
            </span>
            <span className={styles.economicsCaption}>
              Five PODOS pods replacing a 5-MW traditional AI data center.
              Numbers are deck-canonical.
            </span>
          </div>

          <div className={styles.economicsTable} role="table">
            <div className={styles.economicsHeader} role="row">
              <span role="columnheader">Metric</span>
              <span role="columnheader">Traditional DC</span>
              <span role="columnheader">PODOS</span>
              <span role="columnheader">Δ</span>
            </div>
            {ECONOMICS_ROWS.map((row, i) => (
              <motion.div
                key={row.metric}
                role="row"
                className={styles.economicsRow}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.55 * t,
                  delay: (3.85 + i * 0.1) * t,
                  ease: "easeOut",
                }}
              >
                <span className={styles.economicsMetric} role="cell">
                  {row.metric}
                </span>
                <span
                  className={`${styles.economicsCell} ${styles.economicsTrad}`}
                  role="cell"
                >
                  {row.traditional}
                </span>
                <span
                  className={`${styles.economicsCell} ${styles.economicsPodos}`}
                  role="cell"
                >
                  {row.podos}
                </span>
                <span
                  className={`${styles.economicsDelta} ${
                    row.tone === "win" ? styles.economicsDeltaWin : ""
                  }`}
                  role="cell"
                >
                  {row.delta}
                </span>
                <span className={styles.economicsNote}>{row.note}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================== */
/* FACTOR CELL                                                     */
/* ============================================================== */

type FactorCellProps = {
  idx: string;
  label: string;
  subLabel: string;
  number: string;
  unit: string;
  tagline: string;
  line1: string;
  line2: string;
  barFill: number; // 0–1
  inView: boolean;
  delay: number;
};

function FactorCell({
  idx,
  label,
  subLabel,
  number,
  unit,
  tagline,
  line1,
  line2,
  barFill,
  inView,
  delay,
}: FactorCellProps) {
  return (
    <motion.div
      className={styles.factor}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.factorHead}>
        <span className={styles.factorIdx}>FACTOR {idx}</span>
        <span className={styles.factorLabel}>{label}</span>
      </div>
      <div className={styles.factorSub}>{subLabel}</div>

      <div className={styles.factorNumberWrap}>
        <span className={styles.factorNumber}>{number}</span>
        <span className={styles.factorUnit}>{unit}</span>
      </div>

      <div className={styles.factorTagline}>{tagline}</div>

      <div className={styles.factorBar} aria-hidden>
        <motion.div
          className={styles.factorBarFill}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: barFill } : {}}
          transition={{
            duration: 1.3,
            delay: delay + 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformOrigin: "left center" }}
        />
        <div className={styles.factorBarTicks}>
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className={styles.factorBarTick} />
          ))}
        </div>
      </div>

      <div className={styles.factorLines}>
        <div className={styles.factorLine}>{line1}</div>
        <div className={styles.factorLine}>{line2}</div>
      </div>
    </motion.div>
  );
}

/* ============================================================== */
/* OPERATOR — "×" and "=" signs between cells                      */
/* ============================================================== */

function Operator({
  type,
  inView,
  delay,
}: {
  type: "times" | "equals";
  inView: boolean;
  delay: number;
}) {
  return (
    <motion.div
      className={styles.operator}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-hidden
    >
      {type === "times" ? (
        <svg viewBox="0 0 40 40" className={styles.operatorSvg}>
          <path
            d="M 10 10 L 30 30 M 30 10 L 10 30"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 40 40" className={styles.operatorSvg}>
          <path
            d="M 8 16 L 32 16 M 8 24 L 32 24"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </motion.div>
  );
}

/* ============================================================== */
/* RESULT CELL — the 85× hero                                      */
/* ============================================================== */

function ResultCell({ inView, value }: { inView: boolean; value: string }) {
  return (
    <motion.div
      className={styles.result}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1.0, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/*
        Soft radial halo behind the number — the one place on the
        page where the brand gradient is used as a glow, not a fill.

        We CANNOT use the CSS `.breathe-slow` utility here: .resultHalo
        already uses `transform: translate(-50%, -50%)` for centering,
        and a keyframe animation setting `transform: scale(...)` would
        overwrite the translate each frame, jumping the halo to the
        top-left of the parent during each breathe cycle.

        Framer-motion composes transforms cleanly (it maintains its own
        transform map internally), so animating `scale` alongside the
        CSS-level translate works. Opacity also breathes [0.55 → 0.82]
        for a second axis of "aliveness" without scale overreach.
      */}
      <motion.div
        className={styles.resultHalo}
        aria-hidden
        animate={
          inView
            ? { scale: [1, 1.08, 1], opacity: [0.55, 0.82, 0.55] }
            : { scale: 1, opacity: 0.7 }
        }
        transition={{
          duration: 6,
          delay: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className={styles.resultHead}>
        <span className={styles.resultIdx}>= FUSION</span>
        <span className={styles.resultStatus}>
          {/* Existing fusionPulse keyframe on .resultStatusDot already
              provides a 1.8s scale/opacity throb — no additional
              live-pulse utility needed (they'd compound awkwardly). */}
          <span className={styles.resultStatusDot} />
          DELIVERED
        </span>
      </div>
      <div className={styles.resultSub}>Net AI Infrastructure Advantage</div>

      {/*
        Climax number throb. Scale oscillates 1.000 → 1.014 → 1.000
        on a 5.5s loop — almost imperceptible per-frame, but over time
        it makes the 85× glyph feel like it's "powered on". Delay of
        3s lets the mount scale-in + count-up land first (count-up
        finishes at 1.7s + 1.75s ≈ 3.45s).
      */}
      <motion.div
        className={styles.resultNumberWrap}
        animate={
          inView
            ? { scale: [1, 1.014, 1] }
            : { scale: 1 }
        }
        transition={{
          duration: 5.5,
          delay: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className={styles.resultNumber}>{value}</span>
        <span className={styles.resultUnit}>×</span>
      </motion.div>

      <div className={styles.resultTagline}>
        THROUGHPUT vs. INCUMBENT AI INFRA
      </div>

      {/* Decomposition — gives investors the math in one glance. */}
      <div className={styles.resultDecompose}>
        <span className={styles.resultDecomposeCell}>10×</span>
        <span className={styles.resultDecomposeOp}>×</span>
        <span className={styles.resultDecomposeCell}>8.5×</span>
        <span className={styles.resultDecomposeOp}>=</span>
        <span className={styles.resultDecomposeResult}>85×</span>
      </div>

      <div className={styles.resultFootnote}>
        Multiplicative: deployment speed × per-GPU efficacy. Not additive.
      </div>
    </motion.div>
  );
}

/* ============================================================== */
/* TRANSLATION ROWS DATA                                           */
/* ============================================================== */

const TRANSLATION_ROWS = [
  {
    metric: "85×",
    label: "GPU capacity",
    note: "Same useful output, 85 times the silicon investment",
  },
  {
    metric: "10×",
    label: "real estate",
    note: "Square footage scales linearly with pod count",
  },
  {
    metric: "36 mo",
    label: "earlier power hookup",
    note: "Assumes the grid queue is already secured",
  },
  {
    metric: "10×",
    label: "cooling + draw per token",
    note: "Same power envelope, fraction of useful work",
  },
];

/* ============================================================== */
/* SLIDE-7 ECONOMICS TABLE — concrete dollars and tons             */
/* ============================================================== */
/**
 * The deck's Slide 7 is a side-by-side ledger: what a traditional
 * 5-MW data center build costs vs. what five PODOS pods cost to serve
 * the same — or in most metrics, 10× better — compute capacity.
 *
 * Rendered as a four-row comparison table so the numbers read as
 * accounting, not marketing. "DELTA" column is signed (red for
 * negative = worse outcome avoided, green for positive = upside).
 *
 * Values are deck-canonical.
 */
const ECONOMICS_ROWS = [
  {
    metric: "Build cost",
    traditional: "$140–170M",
    podos: "$26.4M",
    delta: "−84%",
    tone: "win" as const,
    note: "Factory labor + shared tooling replaces 3-year site construction",
  },
  {
    metric: "Users served",
    traditional: "1×",
    podos: "10×",
    delta: "10× more",
    tone: "win" as const,
    note: "Same footprint · Syntropic lifts per-GPU throughput",
  },
  {
    metric: "Annual energy",
    traditional: "$13M",
    podos: "$1–2M",
    delta: "−85 to −92%",
    tone: "win" as const,
    note: "PUE 1.10 vs 1.58 · ORC heat recovery on every pod",
  },
  {
    metric: "CO₂ footprint",
    traditional: "Baseline",
    podos: "−93%+",
    delta: "−93%+",
    tone: "win" as const,
    note: "No concrete pour · lower draw per token · heat reuse",
  },
];
