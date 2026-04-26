"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./SyntropicCompression.module.css";
import {
  GridDots,
  AmbientOrbs,
  Particles,
  EnergyFlow,
  VignetteLight,
} from "./BackgroundLayers";
import VideoBackground from "./VideoBackground";

/**
 * SYNTROPIC · The Intelligence Layer
 *
 * Software counterpart to PODOS. If PODOS is the physical pod, Syntropic
 * is the compression compiler that fits 10 models into the VRAM of 1.
 *
 * The visual argument:
 *   BEFORE — one GPU card = one model blob occupying most of 140 GB.
 *   AFTER  — one GPU card = ten small model blobs tiling the same box.
 *
 * We literally draw "the same container" on each side, then render the
 * contents at two very different densities. The eye gets "same box, 10×
 * the content" without needing numbers to read it. The numbers confirm
 * what the eye already saw.
 *
 * Then a live-ish compression log mimics an ops-dashboard feed — model
 * names, original size, compressed size, ratio. Each row pulses in.
 *
 * Support stats across the bottom: COMPRESSION 10:1 · GPU UTIL 99.6% ·
 * USERS/GPU 10× · LATENCY +0 ms — all tabular figures, mono labels,
 * count-up animations on enter.
 */

/* ------------------------------------------------------------------ */
/* COUNT-UP HOOK — reused from PROBLEM                                 */
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
/* BENCHMARK VALIDATION — Mistral-7B head-to-head, Mike Sherman (CTO) */
/* ------------------------------------------------------------------ */
const GPU_PLATFORMS = [
  { code: "GPU-01", name: "NVIDIA GH200", spec: "480 GB · Lambda Labs" },
  { code: "GPU-02", name: "NVIDIA RTX 4090", spec: "24 GB · RunPod #1" },
  { code: "GPU-03", name: "NVIDIA RTX 4090", spec: "24 GB · RunPod #2" },
];

type BenchmarkRow = {
  engine: "syntropic" | "competitor";
  engineName: string;
  bit: string;
  ratio: string;
  quality: string;
  verdict: string;
  win: boolean;
};
const BENCHMARK_ROWS: BenchmarkRow[] = [
  { engine: "syntropic",  engineName: "Syntropic",         bit: "3-bit", ratio: "8.0×", quality: "99.6%", verdict: "NEAR LOSSLESS",  win: true  },
  { engine: "syntropic",  engineName: "Syntropic",         bit: "4-bit", ratio: "7.1×", quality: "98%+",  verdict: "EXCELLENT",      win: true  },
  { engine: "competitor", engineName: "Google TurboQuant", bit: "3-bit", ratio: "9.1×", quality: "87.1%", verdict: "FUNCTIONAL LOSS",win: false },
  { engine: "competitor", engineName: "Google TurboQuant", bit: "4-bit", ratio: "7.1×", quality: "93.9%", verdict: "NOTABLE LOSS",   win: false },
];

/* ------------------------------------------------------------------ */
/* COMPRESSION LOG — simulated ops feed                                */
/* ------------------------------------------------------------------ */
const logRows = [
  { model: "llama-3-70B",       orig: "140 GB", comp: "14.0 GB", ratio: "10.0x" },
  { model: "mixtral-8x22B",     orig: "176 GB", comp: "19.8 GB", ratio: "8.9x"  },
  { model: "qwen-2.5-72B",      orig: "145 GB", comp: "14.2 GB", ratio: "10.2x" },
  { model: "claude-haiku-dist", orig: "84 GB",  comp: "8.6 GB",  ratio: "9.8x"  },
  { model: "dbrx-132B",         orig: "264 GB", comp: "28.1 GB", ratio: "9.4x"  },
  { model: "custom-ft-405B",    orig: "810 GB", comp: "79.3 GB", ratio: "10.2x" },
];

/* ==================================================================
 * COMPRESSION VISUAL — static hero image (2026-04-25)
 * ==================================================================
 * The previous code-rendered 3-part comparison was replaced with a
 * polished static render at user request. The image already contains
 * the section title ("One GPU. Ten Times More Work."), the side-by-
 * side cards, the hexagonal compression core, and the bottom metric
 * strip — so the React component just renders the asset with a
 * scroll-triggered fade-up.
 *
 * Asset: /public/syntropic/compression-hero.png (1481 KB, ~16:9)
 * Stored in /public so Next.js serves it at the URL root.
 *
 * Original 3-part breakdown still describes what the image shows: */
/* ------------------------------------------------------------------
 * Investor-grade design. Three-card transformation:
 *
 *   LEFT  · STANDARD       1 model per GPU   ·  one oversized memory
 *                                                block trapped inside
 *                                                the GPU frame
 *   CENTER · COMPRESSION    a hexagonal Syntropic core with energy
 *                          flowing in from left and exploding out to
 *                          the right. Reads as "the engine".
 *   RIGHT · SYNTROPIC      10 models per GPU ·  ten compact, glowing
 *                                               tiles in a 2×5 grid
 *                                               occupying the same box
 *
 * Design vocabulary:
 *   • Frame chrome — anodized aluminum-style header strip + corner
 *     bracket marks; reads as a real GPU shroud, not a generic card.
 *   • Memory blocks — saturated blue gradient with inner highlights
 *     and a soft outer glow, NOT flat rectangles.
 *   • Compression core — hexagon clip-path with concentric rings,
 *     animated inflow streamlines on the left edge, outflow on the
 *     right. The Syntropic glyph sits dead center.
 *   • Bottom strip — three premium metric chips in mono caps with
 *     transition arrows: 140 GB → 14 GB · 1 Model → 10 Models ·
 *     99.6% Quality Preserved.
 *
 * All animation is scroll-triggered via the `inView` prop and runs
 * once. No bouncy springs — `[0.22, 1, 0.36, 1]` (Apple-style
 * decelerate cubic) throughout.
 * ================================================================== */
function CompressionVisual({ inView }: { inView: boolean }) {
  return (
    <motion.div
      className={styles.compHeroWrap}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Animated compression hero — looped MP4 covering the same
          composition as compression-hero.png. The PNG is kept on disk
          and used as `poster` so the static frame paints instantly
          while the video buffers (and on browsers that block autoplay).
          autoPlay + muted + playsInline + loop are the four flags
          required for cross-browser autoplay (iOS Safari needs all
          of them). preload="auto" because this asset is in the main
          scroll path — investors will reach it within seconds of
          landing on the page. */}
      <video
        className={styles.compHeroImg}
        src="/syntropic/compression-hero.mp4"
        poster="/syntropic/compression-hero.png"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="One GPU. Ten Times More Work. Standard 1 model per GPU at 140 GB compresses 10:1 to 10 syntropic models at 14 GB each on the same GPU."
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * (Legacy code-rendered comparison kept below for reference but no
 * longer used. The image above carries the same information.)
 * ------------------------------------------------------------------ */
function CompressionVisualLegacy({ inView }: { inView: boolean }) {
  return (
    <>
      {/* Section eyebrow + title above the comparison grid. */}
      <motion.div
        className={styles.compIntro}
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <h3 className={styles.compTitle}>
          One GPU. <span className="t-sweep-brand">Ten Times</span> More Work.
        </h3>
        <p className={styles.compSub}>
          Syntropic compresses the memory bottleneck — turning a 140 GB model
          footprint into 10 smaller deployable workloads on the same GPU.
        </p>
      </motion.div>

      <div className={styles.compGrid}>
        {/* ============= LEFT · STANDARD ============= */}
        <motion.div
          className={`${styles.compCard} ${styles.compCardStandard}`}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className={styles.compCardHead}>
            <span className={`${styles.compTag} ${styles.compTagMuted}`}>STANDARD</span>
          </header>
          <div className={styles.compMetric}>
            <span className={styles.compMetricBig}>1</span>
            <span className={styles.compMetricLbl}>Model per GPU</span>
            <span className={styles.compMetricSub}>~ 140 GB VRAM</span>
          </div>
          <GpuFrame variant="standard" inView={inView} />
        </motion.div>

        {/* ============= CENTER · COMPRESSION CORE ============= */}
        <motion.div
          className={styles.compCenter}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <CompressionCore inView={inView} />
          <div className={styles.compCenterCaption}>
            <span className={styles.compCenterEyebrow}>SYNTROPIC COMPRESSION</span>
            <span className={styles.compCenterRatio}>10:1</span>
            <span className={styles.compCenterSub}>
              Same GPU. <span className={styles.compCenterSubBrand}>10× More Output.</span>
            </span>
          </div>
        </motion.div>

        {/* ============= RIGHT · SYNTROPIC ============= */}
        <motion.div
          className={`${styles.compCard} ${styles.compCardSyntropic}`}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className={styles.compCardHead}>
            <span className={`${styles.compTag} ${styles.compTagBrand}`}>SYNTROPIC</span>
          </header>
          <div className={styles.compMetric}>
            <span className={`${styles.compMetricBig} ${styles.compMetricBigBrand}`}>10</span>
            <span className={styles.compMetricLbl}>Models per GPU</span>
            <span className={`${styles.compMetricSub} ${styles.compMetricSubBrand}`}>14 GB each</span>
          </div>
          <GpuFrame variant="syntropic" inView={inView} />
        </motion.div>
      </div>

      {/* Bottom premium metric strip — three transformation chips. */}
      <motion.div
        className={styles.compStrip}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.7, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.compChip}>
          <span className={styles.compChipIcon} aria-hidden>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v14a9 3 0 0 0 18 0V5" />
              <path d="M3 12a9 3 0 0 0 18 0" />
            </svg>
          </span>
          <span className={styles.compChipFrom}>140 GB</span>
          <span className={styles.compChipArrow} aria-hidden>→</span>
          <span className={styles.compChipTo}>14 GB</span>
          <span className={styles.compChipNote}>each</span>
        </div>

        <div className={styles.compChip}>
          <span className={styles.compChipIcon} aria-hidden>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </span>
          <span className={styles.compChipFrom}>1 Model</span>
          <span className={styles.compChipArrow} aria-hidden>→</span>
          <span className={styles.compChipTo}>10 Models</span>
        </div>

        <div className={styles.compChip}>
          <span className={styles.compChipIcon} aria-hidden>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <span className={`${styles.compChipFrom} ${styles.compChipQualityNum}`}>99.6%</span>
          <span className={styles.compChipNote}>Quality Preserved</span>
        </div>
      </motion.div>
    </>
  );
}

/* ==================================================================
 * GPU FRAME — premium card visual containing the model block(s)
 * ================================================================== */
function GpuFrame({
  variant,
  inView,
}: {
  variant: "standard" | "syntropic";
  inView: boolean;
}) {
  return (
    <div
      className={`${styles.gpuFrame} ${
        variant === "syntropic" ? styles.gpuFrameSyntropic : styles.gpuFrameStandard
      }`}
    >
      {/* Anodized header strip — the "shroud" of the GPU card. */}
      <div className={styles.gpuFrameShroud}>
        <span className={styles.gpuFrameShroudVent} />
        <span className={styles.gpuFrameShroudVent} />
        <span className={styles.gpuFrameShroudVent} />
      </div>

      {/* Corner bracket ticks — engineering-drawing detail. */}
      <span className={`${styles.gpuFrameCorner} ${styles.gpuFrameCornerTl}`} />
      <span className={`${styles.gpuFrameCorner} ${styles.gpuFrameCornerTr}`} />
      <span className={`${styles.gpuFrameCorner} ${styles.gpuFrameCornerBl}`} />
      <span className={`${styles.gpuFrameCorner} ${styles.gpuFrameCornerBr}`} />

      {/* Memory zone — the actual content area. */}
      <div className={styles.gpuFrameZone}>
        {variant === "standard" ? (
          <motion.div
            className={styles.memBlockBig}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.memBlockLabel}>LLAMA-3-70B · 140 GB</span>
          </motion.div>
        ) : (
          <div className={styles.memBlockGrid}>
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className={styles.memBlockTile}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                transition={{
                  duration: 0.45,
                  delay: 1.0 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================================================================
 * COMPRESSION CORE — hexagonal Syntropic engine in the center column
 * ==================================================================
 * Three layers stacked at the same coordinates:
 *   1. Inflow streamlines (left side) — six animated lines feeding
 *      data INTO the core, each pulsing on a slight offset so the
 *      flow reads as continuous.
 *   2. Hexagon body — clip-path: polygon hexagon with brand gradient
 *      fill, inner concentric ring, and the Syntropic mark dead
 *      center.
 *   3. Outflow streamlines (right side) — six animated lines fanning
 *      OUT from the core, the visual punchline of compression →
 *      multiple-output expansion.
 * ================================================================== */
function CompressionCore({ inView }: { inView: boolean }) {
  return (
    <div className={styles.core}>
      {/* Inflow lines — 6 streamlines feeding into the hex from the left. */}
      <svg className={styles.coreFlowLeft} viewBox="0 0 100 120" aria-hidden>
        <defs>
          <linearGradient id="inflowGrad" x1="0%" x2="100%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0" />
            <stop offset="60%" stopColor="var(--brand)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="1" />
          </linearGradient>
        </defs>
        {[15, 30, 45, 60, 75, 90].map((y, i) => (
          <motion.line
            key={y}
            x1="0"
            y1={y + (i % 2 === 0 ? -2 : 2)}
            x2="92"
            y2="60"
            stroke="url(#inflowGrad)"
            strokeWidth="0.9"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.7 + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </svg>

      {/* Outflow lines — 6 streamlines fanning out to the right. */}
      <svg className={styles.coreFlowRight} viewBox="0 0 100 120" aria-hidden>
        <defs>
          <linearGradient id="outflowGrad" x1="0%" x2="100%">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity="1" />
            <stop offset="40%" stopColor="var(--cyan)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[15, 30, 45, 60, 75, 90].map((y, i) => (
          <motion.line
            key={y}
            x1="8"
            y1="60"
            x2="100"
            y2={y + (i % 2 === 0 ? -2 : 2)}
            stroke="url(#outflowGrad)"
            strokeWidth="0.9"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{
              duration: 0.9,
              delay: 1.0 + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </svg>

      {/* Hexagon body with center mark. */}
      <motion.div
        className={styles.coreHex}
        initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
        animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.7, rotate: -8 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.coreHexInner}>
          {/* Syntropic glyph — sine/wave mark. */}
          <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden>
            <path
              d="M 4 16 Q 10 6, 16 16 T 28 16"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        {/* Outer concentric ring — pulses subtly on a slow loop. */}
        <span className={styles.coreHexRing} />
      </motion.div>
    </div>
  );
}

/* ================================================================== */
/* SECTION                                                             */
/* ================================================================== */
export default function SyntropicCompression() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const comp = useCountUp(10, inView, 1400);
  const util = useCountUp(99.6, inView, 1800);
  const users = useCountUp(10, inView, 1400);

  return (
    <section
      id="syntropic"
      ref={ref}
      className={`${styles.section} section-pad`}
      aria-labelledby="syntropic-heading"
    >
      {/* Software atmosphere — data flow, particles, teal ambient */}
      <div className={styles.bg} aria-hidden>
        {/* Base: abstract data-flow footage tinted cyan. Reinforces the
            "software intelligence layer" framing without shouting. */}
        <VideoBackground variant="data-flow" />
        <GridDots />
        <AmbientOrbs config="teal" />
        <Particles count={22} />
        <EnergyFlow lines={4} />
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
            <span className={styles.eyebrowIdx}>03</span>
            <span className={styles.eyebrowSep}>·</span>
            THE INTELLIGENCE LAYER
          </span>
          <h2
            id="syntropic-heading"
            className={`${styles.headline} t-display`}
          >
            Syntropic compresses models{" "}
            <span className="t-sweep-brand">10× smaller</span>. Same answers.
            No latency penalty.
          </h2>
          <p className={styles.lede}>
            We rebuild the model&apos;s memory layout at runtime — deduplicating
            weights, collapsing KV-cache overhead, and keeping the residency
            window packed. The result: one GPU hosts what used to need ten.
          </p>
        </motion.header>

        {/* MAIN VISUAL */}
        <motion.div
          className={styles.visualCard}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <CompressionVisual inView={inView} />
        </motion.div>

        {/* SECONDARY — stats + compression log */}
        <div className={styles.lower}>
          {/* STATS */}
          <div className={styles.stats}>
            <StatTile
              label="COMPRESSION"
              value={Math.round(comp).toString()}
              unit=":1"
              note="weight + KV-cache fusion"
            />
            <StatTile
              label="GPU UTIL"
              value={util.toFixed(1)}
              unit="%"
              note="99.6% sustained under load"
              highlight
            />
            <StatTile
              label="USERS · GPU"
              value={Math.round(users).toString() + "×"}
              unit=""
              note="concurrent multi-tenant"
            />
            <StatTile
              label="ADDED LATENCY"
              value="+0"
              unit="ms"
              note="zero-overhead decompression"
            />
          </div>

          {/* COMPRESSION LOG */}
          <div className={styles.logCard}>
            <header className={styles.logHead}>
              <span className={styles.logTitle}>
                <span className={styles.logDot} />
                COMPRESSION STREAM · LIVE
              </span>
              <span className={styles.logMeta}>
                pod-0042 · west-3 · 418 m uptime
              </span>
            </header>
            <table className={styles.logTable}>
              <thead>
                <tr>
                  <th>MODEL</th>
                  <th>ORIGINAL</th>
                  <th>COMPRESSED</th>
                  <th>RATIO</th>
                </tr>
              </thead>
              <tbody>
                {logRows.map((r, i) => (
                  <motion.tr
                    key={r.model}
                    initial={{ opacity: 0, x: 14 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 14 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.9 + i * 0.12,
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                  >
                    <td>{r.model}</td>
                    <td>{r.orig}</td>
                    <td className={styles.logCompressed}>{r.comp}</td>
                    <td className={styles.logRatio}>{r.ratio}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============== BENCHMARK VALIDATION ==============
            Independent head-to-head vs Google TurboQuant on Mistral-7B,
            reproducible across three GPU platforms. Deck Slide 6. */}
        <motion.div
          className={styles.benchmark}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className={styles.benchmarkHead}>
            <div className={styles.benchmarkTitleCol}>
              <span className={styles.benchmarkTag}>
                <span className={styles.benchmarkTagDot} />
                INDEPENDENT BENCHMARK · HEAD-TO-HEAD
              </span>
              <h3 className={styles.benchmarkTitle}>
                Syntropic beats Google TurboQuant by{" "}
                <span className="t-sweep-brand">+12.5 points</span> at 3-bit.
              </h3>
              <p className={styles.benchmarkSub}>
                Mistral-7B · baseline perplexity 8.14 → compressed 8.17 ·
                0.43% degradation. Reproducible across three validated GPU
                platforms. Prepared by Mike Sherman, CTO.
              </p>
            </div>

            <div className={styles.benchmarkPlatforms}>
              {GPU_PLATFORMS.map((g, i) => (
                <motion.div
                  key={g.code}
                  className={styles.benchmarkPlatform}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + i * 0.08,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                >
                  <span className={styles.benchmarkPlatformCode}>{g.code}</span>
                  <span className={styles.benchmarkPlatformName}>{g.name}</span>
                  <span className={styles.benchmarkPlatformSpec}>{g.spec}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className={styles.benchmarkTable}>
            <div className={styles.benchmarkTableHead}>
              <span>ENGINE</span>
              <span>BIT</span>
              <span>RATIO</span>
              <span>QUALITY</span>
              <span>VERDICT</span>
            </div>
            {BENCHMARK_ROWS.map((r, i) => (
              <motion.div
                key={r.engineName + r.bit}
                className={`${styles.benchmarkRow} ${
                  r.engine === "syntropic"
                    ? styles.benchmarkRowSyntropic
                    : styles.benchmarkRowCompetitor
                }`}
                initial={{ opacity: 0, x: 12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.7 + i * 0.1,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                <span className={styles.benchmarkRowEngine}>
                  {r.engine === "syntropic" && (
                    <span className={styles.benchmarkRowDot} aria-hidden />
                  )}
                  {r.engineName}
                </span>
                <span className={styles.benchmarkRowBit}>{r.bit}</span>
                <span className={styles.benchmarkRowRatio}>{r.ratio}</span>
                <span
                  className={
                    r.win
                      ? `${styles.benchmarkRowQuality} ${styles.benchmarkRowQualityWin}`
                      : `${styles.benchmarkRowQuality} ${styles.benchmarkRowQualityLose}`
                  }
                >
                  {r.quality}
                </span>
                <span
                  className={
                    r.win
                      ? `${styles.benchmarkVerdict} ${styles.benchmarkVerdictWin}`
                      : `${styles.benchmarkVerdict} ${styles.benchmarkVerdictLose}`
                  }
                >
                  {r.win ? "✓" : "✗"} {r.verdict}
                </span>
              </motion.div>
            ))}
          </div>

          <div className={styles.benchmarkFoot}>
            <span className={styles.benchmarkFootDot} aria-hidden />
            <span>
              At 3-bit, Syntropic preserves{" "}
              <b className={styles.benchmarkFootBrand}>99.6%</b> of Mistral-7B
              quality while Google TurboQuant drops to 87.1%. That&apos;s a
              12.5-point margin at the bit-width where competitors break down
              — reproducible on any of the three GPU platforms above.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* STAT TILE                                                           */
/* ------------------------------------------------------------------ */
function StatTile({
  label,
  value,
  unit,
  note,
  highlight = false,
}: {
  label: string;
  value: string;
  unit: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div className={`${styles.stat} ${highlight ? styles.statHl : ""}`}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statFigure}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statUnit}>{unit}</span>
      </div>
      <div className={styles.statNote}>{note}</div>
    </div>
  );
}
