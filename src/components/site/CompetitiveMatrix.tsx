"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import {
  GridField,
  AmbientOrbs,
  Particles,
  VignetteLight,
} from "./BackgroundLayers";
import styles from "./CompetitiveMatrix.module.css";

/**
 * SECTION 06 — COMPETITION
 *
 * Category-defining comparison. Four ways to build AI infrastructure,
 * rendered as a spec-sheet matrix with PODOS as the highlighted column.
 * Below the matrix, a capital-efficiency bar chart converts the 85×
 * advantage from FUSION into a single scannable picture: useful tokens
 * served per $ of deployed capital, PODOS = 1.00× baseline.
 *
 * Visual discipline:
 *   - PODOS column gets brand-ring border + faint gradient wash
 *   - All other columns are neutral (no hostile red/strike through)
 *   - Numbers in display font, labels in mono, tabular figures
 *   - Capital-efficiency bars animate in from left on scroll
 */

const COMPETITORS = [
  {
    key: "podos",
    name: "PODOS AI",
    tag: "New Physical Layer",
    highlight: true,
  },
  {
    key: "hyperscaler",
    name: "Hyperscalers",
    tag: "AWS · Azure · GCP",
    highlight: false,
  },
  {
    key: "specialty",
    name: "Specialty AI",
    tag: "CoreWeave · Lambda",
    highlight: false,
  },
  {
    key: "legacy",
    name: "Legacy Colo",
    tag: "Equinix · Digital Realty",
    highlight: false,
  },
] as const;

type RowValues = [string, string, string, string];

const ROWS: Array<{ metric: string; code: string; values: RowValues }> = [
  {
    code: "R-01",
    metric: "Time to 1 MW online",
    values: ["90–120 days", "24–36 months", "9–12 months", "18–24 months"],
  },
  {
    code: "R-02",
    metric: "Sustained GPU utilization",
    values: ["99.6%", "12%", "35%", "12%"],
  },
  {
    code: "R-03",
    metric: "Models per GPU",
    values: ["10", "1", "1", "1"],
  },
  {
    code: "R-04",
    metric: "Site requirements",
    values: [
      "Grid-agnostic",
      "20+ MW & fiber",
      "20+ MW & fiber",
      "20+ MW & fiber",
    ],
  },
  {
    code: "R-05",
    metric: "Cooling envelope",
    values: [
      "Closed-loop liquid",
      "Air + liquid retrofit",
      "Air",
      "Air",
    ],
  },
  {
    code: "R-06",
    metric: "Hardware refresh",
    values: [
      "Swap the pod",
      "Rip & replace",
      "Rip & replace",
      "Rip & replace",
    ],
  },
  {
    code: "R-07",
    metric: "IP moat",
    values: ["76+ USPTO", "—", "—", "—"],
  },
];

const CAPITAL_EFFICIENCY = [
  { key: "podos", name: "PODOS AI", ratio: 1.0, highlight: true },
  { key: "specialty", name: "Specialty AI", ratio: 0.04, highlight: false },
  { key: "hyperscaler", name: "Hyperscalers", ratio: 0.012, highlight: false },
  { key: "legacy", name: "Legacy Colo", ratio: 0.008, highlight: false },
];

export default function CompetitiveMatrix() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const t = reduce ? 0 : 1;

  return (
    <section ref={ref} className={`${styles.section} section-pad`}>
      <div className={styles.bg}>
        <GridField variant="default" />
        <AmbientOrbs config="teal" />
        <Particles count={10} />
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
            <span className={styles.eyebrowIdx}>06</span>
            <span className={styles.eyebrowSep}>·</span>
            CATEGORY POSITION
          </div>
          <h2 className={styles.headline}>
            Four ways to build AI infrastructure.{" "}
            <span className="t-sweep-brand">One ships this year.</span>
          </h2>
          <p className={styles.lede}>
            Every competing approach assumes the data center is a building
            problem. PODOS treats it as a product. The spec sheet below is
            what the rest of the industry will spend the next decade trying
            to match.
          </p>
        </motion.header>

        {/* ============== MATRIX ============== */}
        <motion.div
          className={styles.matrixWrap}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 * t, delay: 0.2 * t, ease: "easeOut" }}
        >
          {/* Column headers */}
          <div className={styles.matrixHead}>
            <div className={styles.matrixHeadSpacer}>
              <span className={styles.matrixHeadTag}>SPEC</span>
              <span className={styles.matrixHeadSubtag}>7 DIMENSIONS</span>
            </div>
            {COMPETITORS.map((c, i) => (
              <motion.div
                key={c.key}
                className={`${styles.matrixHeadCell} ${c.highlight ? styles.matrixHeadCellHl : ""}`}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5 * t,
                  delay: (0.4 + i * 0.08) * t,
                  ease: "easeOut",
                }}
              >
                {c.highlight && (
                  <span className={styles.matrixHeadBadge}>
                    <span className={styles.matrixHeadBadgeDot} />
                    CATEGORY OF ONE
                  </span>
                )}
                <div
                  className={
                    c.highlight
                      ? `${styles.matrixHeadName} ${styles.matrixHeadNameBrand}`
                      : styles.matrixHeadName
                  }
                >
                  {c.name}
                </div>
                <div className={styles.matrixHeadTagSmall}>{c.tag}</div>
              </motion.div>
            ))}
          </div>

          {/* Body rows */}
          <div className={styles.matrixBody}>
            {ROWS.map((row, rowIdx) => (
              <motion.div
                key={row.code}
                className={styles.matrixRow}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.55 * t,
                  delay: (0.6 + rowIdx * 0.07) * t,
                  ease: "easeOut",
                }}
              >
                <div className={styles.matrixRowLabel}>
                  <span className={styles.matrixRowCode}>{row.code}</span>
                  <span className={styles.matrixRowMetric}>{row.metric}</span>
                </div>
                {row.values.map((v, colIdx) => {
                  const hl = COMPETITORS[colIdx].highlight;
                  return (
                    <div
                      key={colIdx}
                      className={`${styles.matrixCell} ${hl ? styles.matrixCellHl : ""}`}
                    >
                      {hl && <span className={styles.matrixCellMarker} aria-hidden />}
                      <span
                        className={
                          hl
                            ? `${styles.matrixCellValue} ${styles.matrixCellValueBrand}`
                            : styles.matrixCellValue
                        }
                      >
                        {v}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </div>

          {/* Matrix legend / footer */}
          <div className={styles.matrixFoot}>
            <span className={styles.matrixFootCode}>PODOS-MTX-v2.1</span>
            <span className={styles.matrixFootSep}>·</span>
            <span>SOURCES: IDC 2025, Uptime Institute, company filings, internal</span>
          </div>
        </motion.div>

        {/* ============== CAPITAL EFFICIENCY BAR CHART ============== */}
        <motion.div
          className={styles.capex}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 * t, delay: 1.4 * t, ease: "easeOut" }}
        >
          <div className={styles.capexHead}>
            <div>
              <div className={styles.capexTag}>THE MONEY SHOT</div>
              <div className={styles.capexTitle}>
                Capital efficiency — useful tokens per $ deployed
              </div>
            </div>
            <div className={styles.capexUnit}>
              <span>PODOS = </span>
              <span className={styles.capexUnitBrand}>1.00×</span>
              <span> BASELINE</span>
            </div>
          </div>

          <div className={styles.capexBars}>
            {CAPITAL_EFFICIENCY.map((c, i) => (
              <div key={c.key} className={styles.capexRow}>
                <div
                  className={
                    c.highlight
                      ? `${styles.capexLabel} ${styles.capexLabelBrand}`
                      : styles.capexLabel
                  }
                >
                  {c.name}
                </div>
                <div className={styles.capexTrack}>
                  <motion.div
                    className={
                      c.highlight
                        ? `${styles.capexFill} ${styles.capexFillBrand}`
                        : styles.capexFill
                    }
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: c.ratio } : {}}
                    transition={{
                      duration: 1.4 * t,
                      delay: (1.7 + i * 0.18) * t,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformOrigin: "left center" }}
                  />
                  <div className={styles.capexTicks}>
                    {Array.from({ length: 10 }, (_, idx) => (
                      <span key={idx} className={styles.capexTick} />
                    ))}
                  </div>
                </div>
                <div
                  className={
                    c.highlight
                      ? `${styles.capexValue} ${styles.capexValueBrand}`
                      : styles.capexValue
                  }
                >
                  {c.ratio.toFixed(c.ratio < 0.1 ? 3 : 2)}×
                </div>
              </div>
            ))}
          </div>

          <div className={styles.capexFoot}>
            <span className={styles.capexFootDot} />
            <span>
              Reading: a hyperscaler spends ~85× the deployed capital to serve
              the same volume of useful AI tokens. A legacy colo, ~125×.
              PODOS is not on the same axis.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
