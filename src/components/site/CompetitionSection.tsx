"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import styles from "./CompetitionSection.module.css";

/**
 * SECTION 06 — "COMPETITION"
 *
 * The delta. A ledger-style reckoning of traditional hyperscale
 * infrastructure vs. PODOS. Each row is a direct, quantitative strike:
 * "X is Y, we do Z." Traditional values sit on the left with a muted
 * ember strikethrough (corpse language); PODOS values sit on the right
 * in gold/viridian (alive).
 *
 * Rows stagger in as the section comes into view so the reader sees
 * each number land like evidence.
 */

type Accent = "gold" | "viridian" | "gradient";

interface Row {
  metric: string;
  traditional: string;
  traditionalNote?: string;
  podos: string;
  podosNote?: string;
  accent: Accent;
  multiplier?: string;
}

const ROWS: Row[] = [
  {
    metric: "Build time",
    traditional: "4 years",
    traditionalNote: "permit · site · grid",
    podos: "90 days",
    podosNote: "factory · ship · plug",
    accent: "gold",
    multiplier: "16× faster",
  },
  {
    metric: "Capex / MW",
    traditional: "$1 – 2 B",
    traditionalNote: "per hyperscale site",
    podos: "$30 M",
    podosNote: "per 1-MW pod",
    accent: "gold",
    multiplier: "~40× cheaper",
  },
  {
    metric: "Rack density",
    traditional: "10 – 20 kW",
    traditionalNote: "air-cooled ceiling",
    podos: "100 kW",
    podosNote: "two-phase liquid",
    accent: "gold",
    multiplier: "~10× denser",
  },
  {
    metric: "GPU utilization",
    traditional: "15 – 25%",
    traditionalNote: "industry average",
    podos: "85 – 95%",
    podosNote: "syntropic scheduling",
    accent: "viridian",
    multiplier: "~5× useful work",
  },
  {
    metric: "Grid queue",
    traditional: "2 – 6 years",
    traditionalNote: "interconnect wait",
    podos: "0",
    podosNote: "behind-the-meter",
    accent: "gradient",
  },
  {
    metric: "Cooling",
    traditional: "Air",
    traditionalNote: "CRAC + containment",
    podos: "Two-phase liquid",
    podosNote: "refrigerant at the die",
    accent: "gold",
  },
  {
    metric: "Power source",
    traditional: "Grid-tethered",
    traditionalNote: "fossil baseload",
    podos: "Renewables + flare + curtailed",
    podosNote: "stranded electrons",
    accent: "viridian",
  },
];

export default function CompetitionSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const t = reduce ? 0 : 1;

  return (
    <section ref={ref} id="competition" className={styles.section}>
      <div className={styles.grain} aria-hidden />

      <div className={styles.content}>
        {/* --- Header --- */}
        <div className={styles.header}>
          <motion.div
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{
              duration: 0.8 * t,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1 * t,
            }}
          >
            <span className={styles.brandDot} />
            <span>06 &middot; Competition</span>
            <span className={styles.sep}>/</span>
            <span>The delta</span>
          </motion.div>

          <motion.h2
            className={styles.headline}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={
              inView ? { opacity: 1, y: 0, filter: "blur(0)" } : undefined
            }
            transition={{
              duration: 1.1 * t,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.3 * t,
            }}
          >
            Everything traditional data centers do in <em>years</em>,
            <br />
            we do in <em>weeks</em>.
          </motion.h2>

          <motion.p
            className={styles.subhead}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{
              duration: 1.0 * t,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.5 * t,
            }}
          >
            Seven axes. Seven reckonings. The old playbook is not losing to us
            on one dimension &mdash; it is losing on every dimension at once.
          </motion.p>
        </div>

        {/* --- Ledger --- */}
        <motion.div
          className={styles.ledger}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: 0.9 * t,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.75 * t,
          }}
        >
          {/* Column header */}
          <div className={styles.ledgerHead}>
            <span className={styles.headColLeft}>
              <span className={`${styles.headTag} ${styles.headTagMuted}`} />
              Traditional
            </span>
            <span className={styles.headColCenter}>Metric</span>
            <span className={styles.headColRight}>
              PODOS
              <span className={`${styles.headTag} ${styles.headTagAlive}`} />
            </span>
          </div>

          {ROWS.map((row, i) => (
            <LedgerRow
              key={row.metric}
              row={row}
              inView={inView}
              delay={(0.95 + i * 0.09) * t}
            />
          ))}
        </motion.div>

        {/* Sting */}
        <motion.p
          className={styles.sting}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={
            inView ? { opacity: 1, y: 0, filter: "blur(0)" } : undefined
          }
          transition={{
            duration: 1.1 * t,
            ease: [0.16, 1, 0.3, 1],
            delay: (0.95 + ROWS.length * 0.09 + 0.2) * t,
          }}
        >
          The incumbents are not competitors.{" "}
          <span className={styles.stingAccent}>They are the market we replace.</span>
        </motion.p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- */
/* LedgerRow                                                            */
/* -------------------------------------------------------------------- */
function LedgerRow({
  row,
  inView,
  delay,
}: {
  row: Row;
  inView: boolean;
  delay: number;
}) {
  const valueClass =
    row.accent === "gold"
      ? styles.rowPodosValueGold
      : row.accent === "viridian"
        ? styles.rowPodosValueViridian
        : styles.rowPodosValueGradient;

  return (
    <motion.div
      className={styles.row}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {/* Traditional */}
      <motion.div
        className={styles.rowTraditional}
        initial={{ opacity: 0, x: -18 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1],
          delay: delay + 0.02,
        }}
      >
        <span className={styles.rowTraditionalValue}>{row.traditional}</span>
        {row.traditionalNote && (
          <span className={styles.rowTraditionalNote}>{row.traditionalNote}</span>
        )}
      </motion.div>

      {/* Metric */}
      <span className={styles.rowMetric}>{row.metric}</span>

      {/* PODOS */}
      <motion.div
        className={styles.rowPodos}
        initial={{ opacity: 0, x: 18 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1],
          delay: delay + 0.18,
        }}
      >
        <span className={`${styles.rowPodosValue} ${valueClass}`}>
          {row.podos}
        </span>
        {row.podosNote && (
          <span className={styles.rowPodosNote}>{row.podosNote}</span>
        )}
        {row.multiplier && (
          <span className={styles.rowMultiplier}>
            <span>&#9650;</span>
            <span>{row.multiplier}</span>
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
