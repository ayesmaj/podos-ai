"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import styles from "./MarketOpportunity.module.css";
import {
  GridField,
  AmbientOrbs,
  CircuitTraces,
  Particles,
  VignetteLight,
} from "./BackgroundLayers";

/**
 * SECTION 06 — MARKET
 *
 * After FUSION lands the 85× moment, the investor asks the next honest
 * question: "OK — how big is the water we're swimming in?" This section
 * answers that as a TAM → SAM → SOM waterfall (deck Slide 8).
 *
 * Design rules:
 *   - The TAM cell is visually dominant (big glyph, brand gradient halo).
 *     Below it, SAM is ~65% the size. SOM is ~35% and lit with the cyan
 *     accent — that's the capture we're actually underwriting.
 *   - Numbers are deck-canonical and sourced from IDC/Gartner/Synergy
 *     frames most LPs recognize — no novel math in this section.
 *   - A secondary strip of three demand drivers (AI DC spend, edge
 *     compute, global reach) gives the reader concrete subtotals that
 *     compose into the TAM above.
 *
 * This is a trust-before-diligence section: it exists to prove we've
 * sized the market honestly, not to drive novel claims.
 */

/* ------------------------------------------------------------------ */
/* MARKET WATERFALL · three nested tiers                               */
/* ------------------------------------------------------------------ */
const MARKET_TIERS = [
  {
    tier: "TAM",
    tierFull: "TOTAL ADDRESSABLE",
    value: "$300B+",
    label: "AI infrastructure market",
    detail:
      "All spend on physical AI compute, power, cooling and facilities worldwide. Combined hyperscaler capex + sovereign + enterprise by 2030.",
    tone: "tam" as const,
  },
  {
    tier: "SAM",
    tierFull: "SERVICEABLE ADDRESSABLE",
    value: "$55B",
    label: "Annual modular deployment opportunity",
    detail:
      "The slice we can credibly compete for: factory-built AI compute demand from edge, enterprise, and sovereign buyers who can't wait 3+ years for a traditional build.",
    tone: "sam" as const,
  },
  {
    tier: "SOM",
    tierFull: "SERVICEABLE OBTAINABLE",
    value: "$4.1B",
    label: "5-year capturable revenue",
    detail:
      "Conservative underwriting — single-digit market share of SAM over the first five years. The bull case is a multiple of this figure.",
    tone: "som" as const,
  },
];

/* ------------------------------------------------------------------ */
/* DEMAND DRIVERS · the concrete subtotals beneath the TAM             */
/* ------------------------------------------------------------------ */
const DEMAND_DRIVERS = [
  {
    code: "DD-01",
    value: "$224B",
    label: "AI Data Center spend",
    year: "2026",
    note: "Hyperscaler + sovereign capex this single year alone.",
  },
  {
    code: "DD-02",
    value: "$48B",
    label: "Edge compute SOM",
    year: "BY 2028",
    note: "Distributed inference at the physical edge — no hyperscaler product fits.",
  },
  {
    code: "DD-03",
    value: "251",
    label: "Nations + markets",
    year: "GLOBAL",
    note: "Underserved power-constrained geographies needing factory-built AI infrastructure.",
  },
];

/* ================================================================== */
/* SECTION                                                             */
/* ================================================================== */
export default function MarketOpportunity() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const t = reduce ? 0 : 1;

  return (
    <section
      id="market"
      ref={ref}
      className={`${styles.section} section-pad`}
      aria-labelledby="market-heading"
    >
      <div className={styles.bg} aria-hidden>
        <GridField variant="sparse" />
        <AmbientOrbs config="teal" />
        <CircuitTraces accent="mixed" />
        <Particles count={8} />
        <VignetteLight />
      </div>

      {/* Money-falling video overlay with REAL alpha transparency.
          ----------------------------------------------------------------
          Two sources are listed: WebM (VP9 with alpha channel, the
          chroma-keyed transcode) is preferred because every modern
          browser except old Safari respects its alpha layer — so the
          dark backdrop of the source clip is genuinely transparent
          and the bills float over the page. MP4 is the legacy
          fallback for Safari < 16 (no alpha support) where the video
          plays opaque-but-screen-blended via CSS so the white page
          still shows through-ish.

          Sits at z-index 9999 — IN FRONT of the sticky NavHeader
          (z:50) and ScrollProgressRail. pointer-events: none so the
          video never blocks interaction with the cards under it.
          Standard autoplay quartet (autoPlay + muted + loop +
          playsInline) for cross-browser autoplay. */}
      <video
        className={styles.moneyFall}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      >
        <source src="/market/money-fall.webm" type="video/webm" />
        <source src="/market/money-fall.mp4" type="video/mp4" />
      </video>

      <div className="container-site" style={{ position: "relative", zIndex: 2 }}>
        {/* ============== HEADER ============== */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 * t, ease: "easeOut" }}
        >
          <span className="t-eyebrow">
            <span className={styles.eyebrowIdx}>06</span>
            <span className={styles.eyebrowSep}>·</span>
            THE MARKET
          </span>
          <h2 id="market-heading" className={`${styles.headline} t-display`}>
            A{" "}
            <span className="t-sweep-brand">$300 billion category</span>,
            <br />
            already being built by accident.
          </h2>
          <p className={styles.lede}>
            The AI infrastructure market is the biggest capex shift since the
            oil boom. It&rsquo;s being served today by products that were never
            designed for it. We&rsquo;re sizing our ambition conservatively
            against it.
          </p>
        </motion.header>

        {/* ============== WATERFALL ============== */}
        <div
          className={styles.waterfall}
          role="group"
          aria-label="Market size waterfall: TAM, SAM, SOM"
        >
          {MARKET_TIERS.map((m, i) => (
            <motion.article
              key={m.tier}
              className={`${styles.tier} ${styles[`tier-${m.tone}`]}`}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8 * t,
                delay: (0.3 + i * 0.18) * t,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <header className={styles.tierHead}>
                <span className={styles.tierTag}>{m.tier}</span>
                <span className={styles.tierTagFull}>{m.tierFull}</span>
              </header>
              <div className={styles.tierValue}>{m.value}</div>
              <div className={styles.tierRule} aria-hidden />
              <div className={styles.tierLabel}>{m.label}</div>
              <p className={styles.tierDetail}>{m.detail}</p>
            </motion.article>
          ))}

          {/*
            CASCADE OVERLAY — absolute-positioned SVG decoration painted
            UNDER the tier cards (z-index 0; cards are z-index 2+). A
            traveling cyan pulse sweeps left → right on an 8s loop,
            invisible while passing through a card (opaque backgrounds
            mask it) but visible as it crosses each of the two gaps.

            Visual effect: the pulse appears to "hop" from the TAM→SAM
            gap to the SAM→SOM gap, reinforcing the waterfall narrative
            without duplicating the tier labels.

            Chevron positions (left: 39%, 71%) approximate the grid
            gap centers for the 1.2fr/1fr/0.85fr column ratios. They
            don't need pixel-perfect alignment — they're decorative
            waypoints, and the cards' shadows hide the exact position
            anyway.

            Hidden on mobile (<960px) where the waterfall collapses to
            vertical, because a horizontal overlay would float over
            nothing useful. See MarketOpportunity.module.css .cascadeOverlay.
          */}
          <div className={styles.cascadeOverlay} aria-hidden>
            <svg
              viewBox="0 0 100 6"
              preserveAspectRatio="none"
              width="100%"
              height="6"
            >
              <defs>
                <linearGradient id="mktCascadeGrad" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Horizontal spine — draws on mount alongside the tiers */}
              <motion.line
                x1="0"
                y1="3"
                x2="100"
                y2="3"
                stroke="url(#mktCascadeGrad)"
                strokeWidth="0.35"
                strokeDasharray="1 1.2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  inView
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{
                  pathLength: { duration: 1.6 * t, delay: 0.2 * t, ease: [0.22, 0.61, 0.36, 1] },
                  opacity: { duration: 0.4, delay: 0.2 * t },
                }}
              />

              {/* Two chevrons at column gaps — hint at direction of flow */}
              {[39, 71].map((leftPct, i) => (
                <motion.path
                  key={leftPct}
                  d={`M ${leftPct - 1.2} 1.5 L ${leftPct} 3 L ${leftPct - 1.2} 4.5`}
                  fill="none"
                  stroke="var(--cyan)"
                  strokeOpacity="0.85"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ opacity: 0, x: -2 }}
                  animate={
                    inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -2 }
                  }
                  transition={{
                    duration: 0.4 * t,
                    delay: (1.0 + i * 0.18) * t,
                  }}
                />
              ))}

              {/* Traveling pulse — loops TAM→SOM at 8s cadence */}
              <motion.circle
                cy="3"
                r="0.9"
                fill="var(--cyan)"
                filter="drop-shadow(0 0 0.6px rgba(34,211,238,0.9))"
                vectorEffect="non-scaling-stroke"
                initial={{ cx: 0, opacity: 0 }}
                animate={
                  inView
                    ? { cx: [0, 100], opacity: [0, 1, 1, 0] }
                    : { cx: 0, opacity: 0 }
                }
                transition={{
                  duration: 4.8,
                  delay: 2.1 * t,
                  repeat: Infinity,
                  repeatDelay: 1.8,
                  ease: "easeInOut",
                  times: [0, 0.06, 0.94, 1],
                }}
              />
            </svg>
          </div>
        </div>

        {/* ============== DEMAND DRIVERS ============== */}
        <motion.div
          className={styles.drivers}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 * t, delay: 1.0 * t, ease: "easeOut" }}
        >
          <div className={styles.driversHead}>
            <span className="t-eyebrow">
              DEMAND DRIVERS · WHY THE TAM IS THE TAM
            </span>
            <span className={styles.driversNote}>
              Three concrete subtotals that compose into the $300B headline.
            </span>
          </div>

          <div className={styles.driversGrid}>
            {DEMAND_DRIVERS.map((d, i) => (
              <motion.article
                key={d.code}
                className={styles.driver}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.65 * t,
                  delay: (1.15 + i * 0.1) * t,
                  ease: "easeOut",
                }}
              >
                <header className={styles.driverHead}>
                  <span className={styles.driverCode}>{d.code}</span>
                  <span className={styles.driverYear}>{d.year}</span>
                </header>
                <div className={styles.driverValue}>{d.value}</div>
                <div className={styles.driverLabel}>{d.label}</div>
                <p className={styles.driverNote}>{d.note}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* ============== FOOTER CLAIM ============== */}
        <motion.div
          className={styles.claim}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9 * t, delay: 1.6 * t, ease: "easeOut" }}
        >
          <span className={styles.claimDot} aria-hidden />
          <span className={styles.claimText}>
            PODOS targets <strong>&lt;1% of SAM by 2030</strong> — below
            Vantage/QTS penetration, above current modular share. The ceiling
            is set by manufacturing capacity, not demand.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
