"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import {
  GridField,
  AmbientOrbs,
  CircuitTraces,
  Particles,
  VignetteLight,
} from "./BackgroundLayers";
import styles from "./RequestAccessCTA.module.css";

/**
 * SECTION 08 — CTA (Request Investor Access)
 *
 * The closing inversion. After a dense investor dashboard (TRACTION),
 * this section is deliberately minimal — one headline, one action,
 * three facts. The visual weight is concentrated in the gradient
 * button, which carries a long cyan shadow to feel "clickable" even
 * on the viewer's first glance.
 *
 * Design rules respected:
 *   - LIGHT section (the only allowed dark panel was spent on SYNTROPIC)
 *   - Single focal action (no secondary competing button)
 *   - Gradient button is the page's final "click moment"
 *   - Factbar is mono/tight: investor-grade, not consumer
 *
 * Three factbar cells answer the three questions a qualified investor
 * has right before they reach out: what stage is this round, what can
 * I actually see, how fast will we meet.
 */

/**
 * Post-intro facts — the three things the LP wants to know about the
 * process after they've seen the deal terms. Timeline answers "am I
 * too late?", data room answers "what will I see?", cadence answers
 * "how fast does this move?". Deal status used to live here, but was
 * promoted to its own DEAL TERMS strip above.
 */
const FACTS = [
  {
    code: "F-01",
    label: "TIMELINE TO CLOSE",
    value: "Target Q2 2026",
    detail: "Allocations filled on first-committed basis · no auction dynamics",
  },
  {
    code: "F-02",
    label: "DATA ROOM",
    value: "Full access on NDA",
    detail: "Technical, financial, IP, hardware, and pod-throughput telemetry",
  },
  {
    code: "F-03",
    label: "MEETING CADENCE",
    value: "Call within 72 hrs",
    detail: "30-min founder intro · factory walkthrough available on request",
  },
];

/**
 * Deal terms — the four numbers every qualified investor asks in
 * the first five minutes. Kept inline so the document reads as
 * "here's the ask" not "click to see more".
 */
const DEAL_TERMS = [
  { k: "ROUND SIZE", v: "$18M",  d: "Seed · priced" },
  { k: "PRE-MONEY",  v: "$54M",  d: "Valuation at close" },
  { k: "POST-MONEY", v: "$72M",  d: "Fully-diluted basis" },
  { k: "ALLOCATION", v: "25%",   d: "For the full round" },
];

/**
 * Outcome scenarios — the three exit paths an LP models, in the
 * BEAR / BASE / BULL frame the deck uses. Numbers mirror the Slide-15
 * canonical: $15M invested against a 25% seed position, ridden through
 * to exit with the stated proportional ownership (deck modeling).
 *
 *   BEAR  : $120M exit → ~3.6×   | ~28%  IRR  (soft landing, IP sale / acqui-hire)
 *   BASE  : $400M exit → ~9.3×   | ~70%  IRR  (Vantage-shaped infra outcome)
 *   BULL  : $1B+  exit → ~23×    | ~90%+ IRR  (category-leader / Nvidia-shaped)
 *
 * These numbers are deck-canonical and track the narrative the LP
 * will already have seen. If the financial model updates, change
 * here only — the copy is deliberately illustrative, not a forecast.
 */
const RETURN_SCENARIOS = [
  {
    tag: "BEAR",
    ev: "$120M",
    multiple: "3.6×",
    irr: "~28% IRR",
    rationale: "Soft landing — IP sale or strategic acqui-hire.",
    tone: "base" as const,
  },
  {
    tag: "BASE",
    ev: "$400M",
    multiple: "9.3×",
    irr: "~70% IRR",
    rationale: "Vantage-shaped infra exit. Pod deployed, Syntropic in production.",
    tone: "mid" as const,
  },
  {
    tag: "BULL",
    ev: "$1B+",
    multiple: "23×",
    irr: "~90%+ IRR",
    rationale: "Category-leader, Nvidia-parallel. Five-layer stack compounds.",
    tone: "hi" as const,
  },
];

export default function RequestAccessCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const t = reduce ? 0 : 1;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("josef@californiamodulars.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <section ref={ref} className={`${styles.section} section-pad`}>
      <div className={styles.bg}>
        <GridField variant="sparse" />
        <AmbientOrbs config="teal" />
        <CircuitTraces accent="mixed" />
        <Particles count={6} />
        <VignetteLight />
      </div>

      <div className="container-site" style={{ position: "relative", zIndex: 2 }}>
        {/* ============== EYEBROW ============== */}
        <motion.div
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 * t, ease: "easeOut" }}
        >
          <span className={styles.eyebrowIdx}>08</span>
          <span className={styles.eyebrowSep}>·</span>
          NEXT STEP
        </motion.div>

        {/* ============== HEADLINE ============== */}
        <motion.h2
          className={styles.headline}
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 * t, delay: 0.1 * t, ease: "easeOut" }}
        >
          The earliest entry point into the{" "}
          <span className="t-sweep-brand">new physical layer of AI</span>.
        </motion.h2>

        {/* ============== SUB-LINE ============== */}
        <motion.p
          className={styles.lede}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 * t, delay: 0.3 * t, ease: "easeOut" }}
        >
          Pod #1 is validated. The factory is under lease. The $18M seed is
          half-committed and we&rsquo;re deliberate about who fills the rest.
          If you underwrite infrastructure and want to see the numbers
          behind the 85&times;, start here.
        </motion.p>

        {/* ============== DEAL TERMS STRIP ============== */}
        {/* Four cells across, each a single number — the answers to the
            four questions a qualified investor asks before asking
            anything else. Gradient top-rule picks up the brand. */}
        <motion.div
          className={styles.dealTerms}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 * t, delay: 0.42 * t, ease: "easeOut" }}
          aria-label="Deal terms"
        >
          <header className={styles.dealTermsHead}>
            <span className={styles.dealTermsEyebrow}>
              DEAL TERMS · Q2 2026 SEED
            </span>
            <span className={styles.dealTermsStatus}>
              <span className={styles.dealStatusDot} aria-hidden />
              HALF-COMMITTED · ROOM FOR 1 STRATEGIC
            </span>
          </header>

          <div className={styles.dealGrid}>
            {DEAL_TERMS.map((d) => (
              <div key={d.k} className={styles.dealCell}>
                <span className={styles.dealKey}>{d.k}</span>
                <span className={styles.dealValue}>{d.v}</span>
                <span className={styles.dealDetail}>{d.d}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ============== RETURN LADDER ============== */}
        {/* Three stacked scenarios. Each card gets a tiered accent
            (base → mid → hi) — NOT a glaring "high-return" sell but a
            subtle thermometer that gets more lit the further out we
            project. Disclaimer below keeps this honestly illustrative. */}
        <motion.div
          className={styles.returnLadder}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 * t, delay: 0.52 * t, ease: "easeOut" }}
          aria-label="Outcome scenarios"
        >
          <header className={styles.ladderHead}>
            <span className={styles.ladderEyebrow}>
              OUTCOME SCENARIOS · on $18M SEED
            </span>
            <span className={styles.ladderNote}>
              Multiples shown assume typical infrastructure dilution
              through Series A–C. Illustrative, not a forecast.
            </span>
          </header>

          <div className={styles.ladderGrid}>
            {RETURN_SCENARIOS.map((s, i) => (
              <motion.div
                key={s.tag}
                className={`${styles.ladderCell} ${
                  s.tone === "mid"
                    ? styles.ladderCellMid
                    : s.tone === "hi"
                      ? styles.ladderCellHi
                      : styles.ladderCellBase
                }`}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.55 * t,
                  delay: (0.62 + i * 0.08) * t,
                  ease: "easeOut",
                }}
              >
                <span className={styles.ladderTag}>{s.tag}</span>

                <div className={styles.ladderPrimary}>
                  <span className={styles.ladderEV}>{s.ev}</span>
                  <span className={styles.ladderEVLabel}>ENTERPRISE VALUE</span>
                </div>

                <div className={styles.ladderRule} aria-hidden />

                <div className={styles.ladderReturn}>
                  <span className={styles.ladderMultiple}>{s.multiple}</span>
                  <span className={styles.ladderMultipleLabel}>
                    RETURN ON SEED
                  </span>
                </div>

                <span className={styles.ladderIRR}>{s.irr}</span>

                <p className={styles.ladderRationale}>{s.rationale}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ============== ACTION ROW ============== */}
        {/* Delay pushed to 0.92s so the primary CTA lands *after* the
            return-ladder cells (which finish ~0.83s). The CTA reads
            as a climax: "you've seen the numbers, now act". */}
        <motion.div
          className={styles.actionRow}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 * t, delay: 0.92 * t, ease: "easeOut" }}
        >
          <a
            href="mailto:josef@californiamodulars.com?subject=Investor%20intro%20%C2%B7%20PODOS%20AI%20seed&body=Fund%3A%20%0AStage%20focus%3A%20%0ATypical%20check%3A%20%0AReason%20for%20fit%3A%20%0A"
            className={styles.primary}
          >
            <span className={styles.primaryGlow} aria-hidden />
            <span className={styles.primaryLabel}>Request Investor Access</span>
            <svg
              className={styles.primaryArrow}
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden
            >
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className={styles.secondary}
            aria-label="Copy josef@californiamodulars.com to clipboard"
          >
            <span className={styles.secondaryDot} aria-hidden />
            <span className={styles.secondaryText}>josef@californiamodulars.com</span>
            <span className={styles.secondaryHint}>
              {copied ? "COPIED" : "CLICK TO COPY"}
            </span>
          </button>
        </motion.div>

        {/* ============== FACTBAR ============== */}
        <motion.div
          className={styles.factbar}
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 * t, delay: 1.1 * t, ease: "easeOut" }}
        >
          {FACTS.map((f, i) => (
            <motion.div
              key={f.code}
              className={`${styles.fact} card-lift`}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6 * t,
                delay: (1.2 + i * 0.08) * t,
                ease: "easeOut",
              }}
            >
              <div className={styles.factHead}>
                <span className={styles.factCode}>{f.code}</span>
                <span className={styles.factLabel}>{f.label}</span>
              </div>
              <div className={styles.factValue}>{f.value}</div>
              <div className={styles.factRule} aria-hidden />
              <div className={styles.factDetail}>{f.detail}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ============== SIGNOFF ============== */}
        <motion.div
          className={styles.signoff}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 * t, delay: 1.6 * t, ease: "easeOut" }}
        >
          <div className={styles.signoffLeft}>
            <span className={styles.signoffCode}>PODOS-AI-CTA-v1.0</span>
            <span className={styles.signoffSep}>·</span>
            <span>Built in California · Shipping from California</span>
          </div>
          <div className={styles.signoffRight}>
            <span className={styles.signoffStatus} aria-hidden />
            <span>SEED · OPEN · Q2&nbsp;2026</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
