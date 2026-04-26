"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import styles from "./UseOfFunds.module.css";
import {
  GridField,
  AmbientOrbs,
  CircuitTraces,
  Particles,
  VignetteLight,
} from "./BackgroundLayers";

/**
 * SECTION 09 — USE OF FUNDS (Slide 13)
 *
 * The "where the $10.5M goes" page, rendered as a horizontal allocation
 * strip with six buckets totaling the 24-month build-validate-scale
 * program. Each bucket: dollar figure, bucket name, and the deliverable
 * line items within that bucket (direct from deck bullets).
 *
 * Design notes:
 *   - The 6 categories are NOT equal size — the largest (Syntropic
 *     Engineering · $3.5M) gets visible bar-weight. This shows the
 *     company's bet: the software platform gets the majority of the
 *     build spend.
 *   - The total ($10.5M) is a 24-month allocated build. The remaining
 *     $7.5M of the $18M raise is operational reserve / market reaction
 *     capital — stated explicitly in the footer so LPs don't worry
 *     about the arithmetic delta.
 *   - "PODOS AI controls 100% of funds · California Modulars paid on
 *     milestone completion" — quoted verbatim from the deck. This is
 *     the governance promise that separates this raise from a typical
 *     infrastructure pre-order book.
 */

/* ------------------------------------------------------------------ */
/* FUND BUCKETS · deck-canonical                                       */
/* ------------------------------------------------------------------ */
/**
 * Ordered by dollar size (descending) so the visual bar weights the
 * page correctly. `pct` is the percentage of the allocated $10.5M
 * (not the $18M total) — used to size the allocation bar fill.
 */
const FUND_BUCKETS = [
  {
    code: "F-01",
    amount: "$3.5M",
    pct: 33.3,
    category: "Syntropic Engineering",
    detail:
      "Full GPU engineering team (5 engineers) · HIPAA/ITAR/SOX certification · enterprise integration tools · GPU seat-licensing platform.",
    tone: "hero" as const,
  },
  {
    code: "F-02",
    amount: "$2.8M",
    pct: 26.7,
    category: "Operations · 24 months",
    detail:
      "Leadership team · legal · patent advancement · customer development · travel · accounting · insurance.",
    tone: "primary" as const,
  },
  {
    code: "F-03",
    amount: "$2.3M",
    pct: 21.9,
    category: "MEGA SILO™ Prototype",
    detail:
      "Pressure-vessel fabrication · N₂ system · conveyor sled · blind-mate connectors · safety certification · ASME rating.",
    tone: "primary" as const,
  },
  {
    code: "F-04",
    amount: "$950K",
    pct: 9.05,
    category: "PODOS Pod Prototype",
    detail:
      "Manufacturing · design · thermos enclosure · power infrastructure · permitting · third-party testing · commissioning.",
    tone: "secondary" as const,
  },
  {
    code: "F-05",
    amount: "$600K",
    pct: 5.7,
    category: "Enterprise Pilots",
    detail:
      "Syntropic first enterprise pilots · Optimus LOI legal · customer integration · proof-of-concept deployments.",
    tone: "secondary" as const,
  },
  {
    code: "F-06",
    amount: "$350K",
    pct: 3.35,
    category: "Contingency + IP Advancement",
    detail:
      "Patent advancement · buffer for prototype surprises · LOI legal · unexpected certification requirements.",
    tone: "secondary" as const,
  },
];

const TOTAL_ALLOCATED = "$10.5M";
const TOTAL_RAISE = "$18M";
const RESERVE = "$7.5M";

/* ================================================================== */
/* SECTION                                                             */
/* ================================================================== */
export default function UseOfFunds() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const t = reduce ? 0 : 1;

  return (
    <section
      id="use-of-funds"
      ref={ref}
      className={`${styles.section} section-pad`}
      aria-labelledby="uof-heading"
    >
      <div className={styles.bg} aria-hidden>
        <GridField variant="sparse" />
        <AmbientOrbs config="teal" />
        <CircuitTraces accent="mixed" />
        <Particles count={8} />
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
            <span className={styles.eyebrowIdx}>09</span>
            <span className={styles.eyebrowSep}>·</span>
            USE OF FUNDS
          </span>
          <h2 id="uof-heading" className={`${styles.headline} t-display`}>
            <span className="t-sweep-brand">{TOTAL_ALLOCATED}</span> allocated
            across a
            <br />
            24-month build, validate, and scale program.
          </h2>
          <p className={styles.lede}>
            Every bucket below is tied to a deliverable milestone. PODOS AI
            controls 100% of funds. California Modulars, the manufacturing
            partner, is paid only on milestone completion &mdash; not on
            drawdown.
          </p>
        </motion.header>

        {/* ============== TOTAL BAR — proportional allocation ============== */}
        <motion.div
          className={styles.totalBar}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 * t, delay: 0.25 * t, ease: "easeOut" }}
        >
          <div className={styles.totalBarHead}>
            <span className={styles.totalBarLabel}>
              {TOTAL_ALLOCATED} · PROPORTIONAL ALLOCATION
            </span>
            <span className={styles.totalBarMeta}>
              Largest bucket anchors the software platform
            </span>
          </div>
          <div
            className={styles.totalBarTrack}
            role="img"
            aria-label={`Use of funds: ${TOTAL_ALLOCATED} across six buckets`}
          >
            {FUND_BUCKETS.map((b, i) => (
              <motion.div
                key={b.code}
                className={`${styles.totalBarSeg} ${
                  styles[`segTone-${b.tone}`]
                }`}
                initial={{ flexBasis: "0%" }}
                animate={inView ? { flexBasis: `${b.pct}%` } : { flexBasis: "0%" }}
                transition={{
                  duration: 1.1 * t,
                  delay: (0.45 + i * 0.06) * t,
                  ease: [0.22, 1, 0.36, 1],
                }}
                title={`${b.category} · ${b.amount}`}
                aria-label={`${b.category}: ${b.amount}`}
              >
                <span className={styles.totalBarSegLabel}>{b.amount}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ============== BUCKET GRID ============== */}
        <div className={styles.grid}>
          {FUND_BUCKETS.map((b, i) => (
            <motion.article
              key={b.code}
              className={`${styles.bucket} ${styles[`bucketTone-${b.tone}`]}`}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.65 * t,
                delay: (0.85 + i * 0.08) * t,
                ease: "easeOut",
              }}
            >
              <header className={styles.bucketHead}>
                <span className={styles.bucketCode}>{b.code}</span>
                <span className={styles.bucketPct}>{b.pct.toFixed(1)}%</span>
              </header>
              <div className={styles.bucketAmount}>{b.amount}</div>
              <h3 className={styles.bucketCategory}>{b.category}</h3>
              <p className={styles.bucketDetail}>{b.detail}</p>
            </motion.article>
          ))}
        </div>

        {/* ============== GOVERNANCE FOOTER ============== */}
        <motion.div
          className={styles.governance}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 * t, delay: 1.6 * t, ease: "easeOut" }}
        >
          <div className={styles.govRow}>
            <div className={styles.govItem}>
              <span className={styles.govLabel}>TOTAL RAISE</span>
              <span className={styles.govValue}>{TOTAL_RAISE}</span>
            </div>
            <span className={styles.govSep} aria-hidden>—</span>
            <div className={styles.govItem}>
              <span className={styles.govLabel}>ALLOCATED</span>
              <span className={styles.govValue}>{TOTAL_ALLOCATED}</span>
            </div>
            <span className={styles.govSep} aria-hidden>=</span>
            <div className={styles.govItem}>
              <span className={styles.govLabel}>RESERVE</span>
              <span className={styles.govValue}>{RESERVE}</span>
            </div>
          </div>
          <div className={styles.govNote}>
            <span className={styles.govDot} aria-hidden />
            PODOS AI controls 100% of funds · California Modulars paid on
            milestone completion
          </div>
        </motion.div>
      </div>
    </section>
  );
}
