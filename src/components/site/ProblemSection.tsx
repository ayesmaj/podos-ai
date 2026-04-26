"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate,
} from "framer-motion";
import { useEffect, useRef } from "react";
import styles from "./ProblemSection.module.css";

/**
 * SECTION 02 — "THE PROBLEM"
 *
 * Cold, architectural, constricted. Ember enters for the first time
 * as the "crisis" accent. Three count-up statistics land like body-
 * blows; a quiet divergence chart whispers the why.
 *
 * Narrative beat:
 *   "A four-year data center can't serve a four-month release cycle."
 *
 * All motion is lazy (useInView, once: true) so the reveal doesn't
 * fire until the section is actually approaching the viewport — and
 * the count-ups gate on entry completion to avoid visual noise.
 */
export default function ProblemSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.22 });
  const t = reduce ? 0 : 1;

  return (
    <section ref={ref} id="problem" className={styles.section}>
      <div className={styles.mesh} aria-hidden />
      <div className={styles.walls} aria-hidden>
        <span className={`${styles.wall} ${styles.wall1}`} />
        <span className={`${styles.wall} ${styles.wall2}`} />
        <span className={`${styles.wall} ${styles.wall3}`} />
      </div>
      <div className={styles.grain} aria-hidden />

      <div className={styles.content}>
        {/* Eyebrow */}
        <motion.div
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8 * t, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.emberDot} />
          <span>02 &middot; The Problem</span>
          <span className={styles.sep}>/</span>
          <span>Why every trad DC is already obsolete</span>
        </motion.div>

        {/* Headline — 3-line stagger */}
        <h2 className={styles.headline}>
          <ProblemLine inView={inView} delay={0.15 * t}>
            A four-year data center
          </ProblemLine>
          <ProblemLine inView={inView} delay={0.35 * t}>
            can&rsquo;t serve a
          </ProblemLine>
          <ProblemLine inView={inView} delay={0.55 * t} emphasis>
            four-<em>month</em> release cycle.
          </ProblemLine>
        </h2>

        {/* Lede */}
        <motion.p
          className={styles.lede}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0)" }
              : undefined
          }
          transition={{
            duration: 1.1 * t,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.95 * t,
          }}
        >
          The capital is here. The chips are here. The power is here.
          <br />
          <span className={styles.ledeEm}>
            The wall is between them.
          </span>
        </motion.p>

        {/* Stat cards */}
        <div className={styles.stats}>
          <StatCard
            index="01"
            inView={inView}
            delay={1.25 * t}
            value={4}
            suffix=" yrs"
            label="average build time for a greenfield data center"
            footnote="Permit · power · site work · shell · commissioning"
            tone="ember"
          />
          <StatCard
            index="02"
            inView={inView}
            delay={1.45 * t}
            value={90}
            suffix="%"
            label="of GPU capacity sits idle in air-cooled racks"
            footnote="Thermal throttle · queue wait · underutilized power envelope"
            tone="gold"
          />
          <StatCard
            index="03"
            inView={inView}
            delay={1.65 * t}
            prefix="$"
            value={50}
            suffix="B+"
            label="in silicon stranded in warehouses"
            footnote="Shipped · unplugged · depreciating on the pallet"
            tone="ember"
          />
        </div>

        {/* Divergence chart */}
        <motion.figure
          className={styles.chart}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: 1.2 * t,
            ease: [0.22, 1, 0.36, 1],
            delay: 2.0 * t,
          }}
        >
          <div className={styles.chartHeader}>
            <div>
              <div className={styles.chartTitle}>
                Fig. 01 &middot; AI compute demand vs. data-center capacity
              </div>
              <figcaption className={styles.chartCaption}>
                Demand is a curve. Supply is a wall.
              </figcaption>
            </div>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}>
                <span
                  className={`${styles.legendSwatch} ${styles.legendSwatchDemand}`}
                />
                AI compute demand
              </span>
              <span className={styles.legendItem}>
                <span
                  className={`${styles.legendSwatch} ${styles.legendSwatchSupply}`}
                />
                DC capacity (trad)
              </span>
            </div>
          </div>
          <DivergenceChart inView={inView} reduce={!!reduce} />
        </motion.figure>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- */
/* Helpers                                                              */
/* -------------------------------------------------------------------- */

function ProblemLine({
  children,
  delay,
  inView,
  emphasis = false,
}: {
  children: React.ReactNode;
  delay: number;
  inView: boolean;
  emphasis?: boolean;
}) {
  return (
    <span className={`${styles.line} ${emphasis ? styles.lineEm : ""}`}>
      <motion.span
        className={styles.lineInner}
        initial={{ opacity: 0, y: 32, filter: "blur(14px)" }}
        animate={
          inView ? { opacity: 1, y: 0, filter: "blur(0)" } : undefined
        }
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
          delay,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function StatCard({
  index,
  inView,
  delay,
  prefix,
  value,
  suffix,
  label,
  footnote,
  tone,
}: {
  index: string;
  inView: boolean;
  delay: number;
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
  footnote: string;
  tone: "ember" | "gold";
}) {
  const reduce = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  // Count-up triggers once the card's entry animation has (nearly) settled,
  // so the number doesn't "jump" while the card is still translating.
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, {
      duration: 1.8,
      delay: delay + 0.45,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, reduce, value, delay, count]);

  return (
    <motion.div
      className={`${styles.statCard} ${
        tone === "ember" ? styles.toneEmber : styles.toneGold
      }`}
      initial={{ opacity: 0, y: 44, filter: "blur(10px)" }}
      animate={
        inView ? { opacity: 1, y: 0, filter: "blur(0)" } : undefined
      }
      transition={{
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      <span className={styles.statIndex}>{index}</span>
      <div className={styles.statNumber}>
        {prefix && <span className={styles.statAffix}>{prefix}</span>}
        <motion.span className={styles.statCount}>{rounded}</motion.span>
        {suffix && <span className={styles.statAffix}>{suffix}</span>}
      </div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statFootnote}>{footnote}</div>
    </motion.div>
  );
}

/**
 * DivergenceChart
 *
 * Two paths share the same origin, then split:
 *   - demand  → steep exponential climb (viridian)
 *   - supply  → nearly flat, low-slope (bone-faint)
 * The polygon between them is filled with a faint ember gradient —
 * the visible "wall" of unmet demand.
 */
function DivergenceChart({
  inView,
  reduce,
}: {
  inView: boolean;
  reduce: boolean;
}) {
  // Paths designed inside a 1000×280 viewBox.
  // Y is inverted in SVG — 0 is top (high value), 280 is bottom.
  const supplyPath =
    "M 0 210 L 160 206 L 320 200 L 480 196 L 640 192 L 800 188 L 1000 182";
  const demandPath = "M 0 210 C 200 200, 380 170, 540 120 S 840 50, 1000 22";
  const gapPath =
    "M 0 210 C 200 200, 380 170, 540 120 S 840 50, 1000 22 L 1000 182 L 800 188 L 640 192 L 480 196 L 320 200 L 160 206 L 0 210 Z";

  const delay = reduce ? 0 : 2.4;
  const dur = reduce ? 0 : 1;

  return (
    <svg
      className={styles.chartSvg}
      viewBox="0 0 1000 280"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="podosGapGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,107,74,0.28)" />
          <stop offset="100%" stopColor="rgba(255,107,74,0.02)" />
        </linearGradient>
      </defs>

      {/* Grid guides — 4 horizontal + 6 vertical */}
      <g opacity="0.35">
        {[56, 112, 168, 224].map((y) => (
          <line
            key={`h-${y}`}
            x1="0"
            x2="1000"
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="2 6"
          />
        ))}
        {[200, 400, 600, 800].map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            x2={x}
            y1="0"
            y2="280"
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="2 6"
          />
        ))}
      </g>

      {/* Ember gap — the wall itself */}
      <motion.path
        d={gapPath}
        className={styles.chartGap}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{
          duration: 1.6 * (reduce ? 0 : 1),
          delay: delay + 0.6 * dur,
          ease: "easeOut",
        }}
      />

      {/* Supply line — flat, bone-faint */}
      <motion.path
        d={supplyPath}
        stroke="rgba(234, 234, 227, 0.38)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="3 6"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          inView ? { pathLength: 1, opacity: 1 } : undefined
        }
        transition={{
          duration: 1.4 * dur,
          delay: delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Demand line — steep, viridian */}
      <motion.path
        d={demandPath}
        stroke="var(--viridian)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        style={{
          filter: "drop-shadow(0 0 6px rgba(47, 210, 127, 0.35))",
        }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          inView ? { pathLength: 1, opacity: 1 } : undefined
        }
        transition={{
          duration: 2.0 * dur,
          delay: delay + 0.2 * dur,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Endpoint markers */}
      <motion.circle
        cx="1000"
        cy="22"
        r="4"
        fill="var(--viridian)"
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : undefined}
        transition={{
          duration: 0.5 * dur,
          delay: delay + 2.2 * dur,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          filter: "drop-shadow(0 0 10px rgba(47, 210, 127, 0.7))",
        }}
      />

      {/* Axis labels */}
      <text x="6" y="270" className={styles.chartLabel}>
        2020
      </text>
      <text x="496" y="270" className={styles.chartLabel} textAnchor="middle">
        2024
      </text>
      <text x="994" y="270" className={styles.chartLabel} textAnchor="end">
        2028 &rarr;
      </text>

      {/* Gap label */}
      <motion.text
        x="700"
        y="130"
        className={`${styles.chartLabel} ${styles.chartLabelEmber}`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{
          duration: 0.8 * dur,
          delay: delay + 1.8 * dur,
        }}
      >
        the wall
      </motion.text>
    </svg>
  );
}
