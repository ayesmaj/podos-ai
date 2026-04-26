"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import styles from "./SplitSection.module.css";

/**
 * SECTION 04 — "THE SPLIT"
 *
 * The site literally splits in two. Left column owns gold (hardware),
 * right column owns viridian (software). A central vertical seam
 * gradient is the exact line where the two halves meet.
 *
 * The diverge animation:
 *   1. Header fades + rises
 *   2. Tick mark scales from center outward (vertical)
 *   3. Left column slides in from centre-left with 50ms cascade
 *   4. Right column follows ~180ms later (left-to-right eye-track)
 *   5. Inside each column the 3 spec cards stagger-reveal
 */
export default function SplitSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.18 });
  const t = reduce ? 0 : 1;

  return (
    <section ref={ref} id="split" className={styles.section}>
      {/* Central seam — scales from midpoint outward */}
      <motion.div
        className={styles.tickMarks}
        aria-hidden
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : undefined}
        transition={{
          duration: 1.4 * t,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.5 * t,
        }}
      />
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
              delay: 0.15 * t,
            }}
          >
            <span className={styles.brandDot} />
            <span>04 · The Split</span>
            <span className={styles.sep}>/</span>
            <span>Hardware meets compiler</span>
          </motion.div>

          <motion.h2
            className={`${styles.headline} ${styles.headlineEm}`}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={
              inView ? { opacity: 1, y: 0, filter: "blur(0)" } : undefined
            }
            transition={{
              duration: 1.1 * t,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.35 * t,
            }}
          >
            One platform. <em>Two halves.</em>
          </motion.h2>

          <motion.p
            className={styles.subhead}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{
              duration: 1.0 * t,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.55 * t,
            }}
          >
            PODOS is the modular building &mdash; physics re-engineered from the
            slab up. Syntropic is the compiler &mdash; the software layer that
            compounds every watt.
          </motion.p>
        </div>

        {/* --- Split grid --- */}
        <div className={styles.split}>
          {/* LEFT — PODOS / Hardware */}
          <div className={`${styles.column} ${styles.columnLeft}`}>
            <motion.div
              className={`${styles.colHead} ${styles.colHeadLeft}`}
              initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
              animate={
                inView
                  ? { opacity: 1, x: 0, filter: "blur(0)" }
                  : undefined
              }
              transition={{
                duration: 1.1 * t,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.85 * t,
              }}
            >
              <span className={styles.colTag}>A · Hardware</span>
              <span className={`${styles.colName} ${styles.colNameGold}`}>
                PODOS
              </span>
              <span className={styles.colRole}>The building.</span>
              <p className={styles.colBlurb}>
                A 1-megawatt modular supercomputer. Rolls off a California
                assembly line every 90 days. Three physics breakthroughs make
                it possible.
              </p>
            </motion.div>

            <div className={styles.specList}>
              <SpecCard
                side="left"
                index="A.01"
                title="Two-phase direct-to-chip liquid cooling"
                measure={<>100 kW / rack · ~10&times; industry avg.</>}
                desc={
                  <>
                    Refrigerant boils at the die, lifts heat directly, condenses,
                    returns. Air-cooled racks top out at 10&ndash;20 kW; PODOS
                    racks run at 100.
                  </>
                }
                inView={inView}
                delay={(1.1 + 0 * 0.14) * t}
              />
              <SpecCard
                side="left"
                index="A.02"
                title="MgO composite shell + hypoxic air"
                measure={<>R-60 envelope · 15% O&#8322; interior</>}
                desc={
                  <>
                    Double-magnesium oxide walls, R-60 insulation, and a 15%
                    oxygen interior. Combustion is chemically impossible.
                    Fire codes disappear.
                  </>
                }
                inView={inView}
                delay={(1.1 + 1 * 0.14) * t}
              />
              <SpecCard
                side="left"
                index="A.03"
                title="Behind-the-meter power"
                measure={<>Wind · solar · flare gas</>}
                desc={
                  <>
                    Deploy where the electrons already are &mdash; stranded
                    renewables, oilfield flare sites, curtailed nuclear. No grid
                    queue, no interconnect wait.
                  </>
                }
                inView={inView}
                delay={(1.1 + 2 * 0.14) * t}
              />
            </div>
          </div>

          {/* RIGHT — SYNTROPIC / Software */}
          <div className={`${styles.column} ${styles.columnRight}`}>
            <motion.div
              className={`${styles.colHead} ${styles.colHeadRight}`}
              initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
              animate={
                inView
                  ? { opacity: 1, x: 0, filter: "blur(0)" }
                  : undefined
              }
              transition={{
                duration: 1.1 * t,
                ease: [0.16, 1, 0.3, 1],
                delay: 1.05 * t,
              }}
            >
              <span className={styles.colTag}>B · Software</span>
              <span className={`${styles.colName} ${styles.colNameViridian}`}>
                SYNTROPIC
              </span>
              <span className={styles.colRole}>The compiler.</span>
              <p className={styles.colBlurb}>
                A model-aware compiler stack. Compresses, re-orders, and
                schedules inference so the same silicon does an order of
                magnitude more useful work per watt.
              </p>
            </motion.div>

            <div className={styles.specList}>
              <SpecCard
                side="right"
                index="B.01"
                title="Model-aware throughput compiler"
                measure={<>85&times; useful throughput · same silicon</>}
                desc={
                  <>
                    Graph-level re-writes, kernel fusion, and scheduling
                    heuristics produced from 50+ compression patents.
                    No accuracy loss. No retraining.
                  </>
                }
                inView={inView}
                delay={(1.3 + 0 * 0.14) * t}
              />
              <SpecCard
                side="right"
                index="B.02"
                title="Autonomous orchestration"
                measure={<>Zero-touch fleet · self-scheduling</>}
                desc={
                  <>
                    Real-time load balancing across the pod, the region, and
                    the fleet. Operators do not babysit queues; the compiler
                    keeps silicon saturated.
                  </>
                }
                inView={inView}
                delay={(1.3 + 1 * 0.14) * t}
              />
              <SpecCard
                side="right"
                index="B.03"
                title="Lossless compression stack"
                measure={<>50+ USPTO patents · deep-learning aware</>}
                desc={
                  <>
                    Weight, activation, and KV-cache compression tuned for
                    transformer workloads. Pushes more tokens through every
                    PCIe lane and every HBM channel.
                  </>
                }
                inView={inView}
                delay={(1.3 + 2 * 0.14) * t}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- */
/* SpecCard                                                             */
/* -------------------------------------------------------------------- */
function SpecCard({
  side,
  index,
  title,
  measure,
  desc,
  inView,
  delay,
}: {
  side: "left" | "right";
  index: string;
  title: string;
  measure: React.ReactNode;
  desc: React.ReactNode;
  inView: boolean;
  delay: number;
}) {
  const measureClass =
    side === "left" ? styles.specMeasureGold : styles.specMeasureViridian;

  return (
    <motion.div
      className={styles.specCard}
      initial={{
        opacity: 0,
        x: side === "left" ? -24 : 24,
        filter: "blur(8px)",
      }}
      animate={
        inView ? { opacity: 1, x: 0, filter: "blur(0)" } : undefined
      }
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      <span className={styles.specIndex}>{index}</span>
      <span className={styles.specTitle}>{title}</span>
      <span className={`${styles.specMeasure} ${measureClass}`}>{measure}</span>
      <p className={styles.specDesc}>{desc}</p>
    </motion.div>
  );
}
