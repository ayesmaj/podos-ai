"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import styles from "./IPPortfolio.module.css";
import {
  GridField,
  AmbientOrbs,
  CircuitTraces,
  Particles,
  VignetteLight,
} from "./BackgroundLayers";

/**
 * SECTION 08 — IP PORTFOLIO (Slide 12)
 *
 * The moat. After the competitive section proves "no one has what we
 * have", this section shows precisely what "what we have" is — a
 * 76-claim patent portfolio organized into two platforms:
 *
 *   OPTIMUS   — 20+ hardware patents (Pod, Thermos, Cooling, ORC,
 *               MEGA SILO, AI Design Platform)
 *   SYNTROPIC — 56 software patents across 6 claim groups
 *
 * Josef Elimelech is named inventor on every claim. IP is held by a
 * separate Holdco, structured for institutional due diligence —
 * information that matters to LPs underwriting IP-heavy deals.
 *
 * Rendered as a two-column masonry: one column per platform, each a
 * header + stack of cards. Each card shows a claim-code (SYS-02 or
 * 01–12) + a one-line topic + a tight detail.
 */

/* ------------------------------------------------------------------ */
/* OPTIMUS · 20+ HARDWARE PATENTS                                      */
/* ------------------------------------------------------------------ */
const OPTIMUS_PATENTS = [
  {
    code: "SYS-01",
    title: "Pod Architecture",
    detail: "Complete factory-built integrated AI compute unit.",
  },
  {
    code: "SYS-02",
    title: "Thermos Enclosure",
    detail:
      "Multi-layer foam + reflective barrier on all 6 surfaces. Climate-agnostic PUE.",
  },
  {
    code: "SYS-03",
    title: "Direct Liquid Cooling",
    detail:
      "Cold plates on every GPU · 95%+ heat capture · closed-loop, zero water.",
  },
  {
    code: "SYS-04",
    title: "ORC Heat Engine",
    detail:
      "Organic Rankine Cycle on the waste-heat loop — 60–110 kW reclaimed per pod.",
  },
  {
    code: "SYS-05",
    title: "MEGA SILO™",
    detail:
      "Hyperbaric N₂ enclosure at 3–5+ atm. No competitor product exists at this density.",
  },
  {
    code: "SYS-06",
    title: "AI Design Platform",
    detail:
      "Automated Pod configuration for any workload, any site — productized engineering.",
  },
];

/* ------------------------------------------------------------------ */
/* SYNTROPIC · 56 SOFTWARE PATENTS · 6 CLAIM GROUPS                    */
/* ------------------------------------------------------------------ */
const SYNTROPIC_PATENTS = [
  {
    code: "01–12",
    title: "KV Cache Compression",
    detail: "Adaptive per-head compression · <0.5% quality loss.",
  },
  {
    code: "13–22",
    title: "Streaming Compression",
    detail: "Per-token · <0.1 ms · no TTFT impact · inline in the hot path.",
  },
  {
    code: "23–31",
    title: "Context Expansion",
    detail:
      "200 K → 2 M+ tokens served on the same hardware via progressive compression.",
  },
  {
    code: "32–44",
    title: "Universal Compression",
    detail:
      "56 formats · 9 modalities · transparent middleware across the stack.",
  },
  {
    code: "45–50",
    title: "Secure Compression",
    detail: "3-layer encryption · HIPAA · ITAR · SOX-ready out of the box.",
  },
  {
    code: "51–56",
    title: "Carbon Attribution",
    detail:
      "Per-workload CO₂ calculation · automatic ESG reporting for enterprise.",
  },
];

/* ================================================================== */
/* SECTION                                                             */
/* ================================================================== */
export default function IPPortfolio() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const t = reduce ? 0 : 1;

  return (
    <section
      id="ip-portfolio"
      ref={ref}
      className={`${styles.section} section-pad`}
      aria-labelledby="ip-heading"
    >
      <div className={styles.bg} aria-hidden>
        <GridField variant="sparse" />
        <AmbientOrbs config="electric" />
        <CircuitTraces accent="electric" />
        <Particles count={10} />
        <VignetteLight />
      </div>

      <div className="container-site" style={{ position: "relative", zIndex: 2 }}>
        {/* ============== HEADER ============== */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 * t, ease: "easeOut" }}
        >
          <span className="t-eyebrow">
            <span className={styles.eyebrowIdx}>08</span>
            <span className={styles.eyebrowSep}>·</span>
            IP PORTFOLIO & COMPETITIVE MOAT
          </span>
          <h2 id="ip-heading" className={`${styles.headline} t-display`}>
            <span className="t-sweep-brand">76+ patents.</span>
            <br />
            No competitor holds either platform.
          </h2>
          <p className={styles.lede}>
            Two patent families, one inventor, zero overlap with hyperscaler
            IP. Held in a structured IP Holdco — clean for institutional due
            diligence and M&amp;A optionality.
          </p>
        </motion.header>

        {/* ============== PORTFOLIO COLUMNS ============== */}
        <div className={styles.columns}>
          {/* OPTIMUS COLUMN */}
          <motion.div
            className={`${styles.column} ${styles.columnOptimus}`}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85 * t, delay: 0.25 * t, ease: "easeOut" }}
          >
            <header className={styles.columnHead}>
              <div className={styles.columnTitleBlock}>
                <span className={styles.columnTag}>OPTIMUS</span>
                <h3 className={styles.columnTitle}>Hardware Platform</h3>
              </div>
              <div className={styles.columnMetric}>
                <span className={styles.columnMetricValue}>20+</span>
                <span className={styles.columnMetricLabel}>PATENTS</span>
              </div>
            </header>
            <div className={styles.columnRule} aria-hidden />
            <ul className={styles.patentList}>
              {OPTIMUS_PATENTS.map((p, i) => (
                <motion.li
                  key={p.code}
                  className={styles.patent}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.55 * t,
                    delay: (0.4 + i * 0.07) * t,
                    ease: "easeOut",
                  }}
                >
                  <span className={styles.patentCode}>{p.code}</span>
                  <div className={styles.patentBody}>
                    <span className={styles.patentTitle}>{p.title}</span>
                    <span className={styles.patentDetail}>{p.detail}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* SYNTROPIC COLUMN */}
          <motion.div
            className={`${styles.column} ${styles.columnSyntropic}`}
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85 * t, delay: 0.4 * t, ease: "easeOut" }}
          >
            <header className={styles.columnHead}>
              <div className={styles.columnTitleBlock}>
                <span className={`${styles.columnTag} ${styles.columnTagSyn}`}>
                  SYNTROPIC
                </span>
                <h3 className={styles.columnTitle}>Software Platform</h3>
              </div>
              <div className={styles.columnMetric}>
                <span className={styles.columnMetricValue}>56</span>
                <span className={styles.columnMetricLabel}>CLAIMS · 6 GROUPS</span>
              </div>
            </header>
            <div className={styles.columnRule} aria-hidden />
            <ul className={styles.patentList}>
              {SYNTROPIC_PATENTS.map((p, i) => (
                <motion.li
                  key={p.code}
                  className={styles.patent}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.55 * t,
                    delay: (0.55 + i * 0.07) * t,
                    ease: "easeOut",
                  }}
                >
                  <span className={`${styles.patentCode} ${styles.patentCodeSyn}`}>
                    {p.code}
                  </span>
                  <div className={styles.patentBody}>
                    <span className={styles.patentTitle}>{p.title}</span>
                    <span className={styles.patentDetail}>{p.detail}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ============== DILIGENCE FOOTER ============== */}
        <motion.div
          className={styles.diligence}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 * t, delay: 1.3 * t, ease: "easeOut" }}
        >
          <div className={styles.diligenceLeft}>
            <span className={styles.diligenceDot} aria-hidden />
            <span className={styles.diligenceText}>
              <strong>Josef Elimelech</strong> · inventor of record on every
              claim. IP Holdco structured · clean for institutional due
              diligence.
            </span>
          </div>
          <div className={styles.diligenceRight}>
            <span className={styles.diligenceCode}>
              USPTO · GRANTED + PENDING
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
