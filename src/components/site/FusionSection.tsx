"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef } from "react";
import styles from "./FusionSection.module.css";

/**
 * SECTION 05 — "FUSION"
 *
 * The climactic moment. Two streams of color — gold (hardware) from the
 * left and viridian (software) from the right — collide at the center of
 * the section. The collision ignites. The ignition births the single
 * largest typographic moment on the whole site: 85×.
 *
 * Animation beats (s):
 *   0.15  eyebrow in
 *   0.35  kicker (serif italic) in
 *   0.60  beams shoot in from both sides
 *   1.40  flash ignites at center
 *   1.55  85× emerges (scale + blur-to-focus, count from 0 → 85)
 *   2.20  unit sub-label fades in
 *   2.50  horizontal rule draws outward
 *   2.70  proof row fades in (staggered)
 *
 * Everything respects prefers-reduced-motion.
 */
export default function FusionSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const t = reduce ? 0 : 1;

  // Timing beats
  const T_EYEBROW = 0.15 * t;
  const T_KICKER = 0.35 * t;
  const T_BEAM = 0.6 * t;
  const T_FLASH = 1.4 * t;
  const T_NUMBER = 1.55 * t;
  const T_UNIT = 2.2 * t;
  const T_RULE = 2.5 * t;
  const T_STATS = 2.7 * t;

  return (
    <section ref={ref} id="fusion" className={styles.section}>
      {/* Ambient halo (always on, slow pulse) */}
      <div className={styles.ambientHalo} aria-hidden />

      {/* Gold beam shoots in from the left toward center */}
      {!reduce && (
        <motion.div
          className={`${styles.beam} ${styles.beamGold}`}
          aria-hidden
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            inView ? { scaleX: 1, opacity: [0, 1, 0.55] } : undefined
          }
          transition={{
            duration: 0.95 * t,
            ease: [0.22, 1, 0.36, 1],
            delay: T_BEAM,
            times: [0, 0.6, 1],
          }}
        />
      )}

      {/* Viridian beam shoots in from the right toward center */}
      {!reduce && (
        <motion.div
          className={`${styles.beam} ${styles.beamViridian}`}
          aria-hidden
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            inView ? { scaleX: 1, opacity: [0, 1, 0.55] } : undefined
          }
          transition={{
            duration: 0.95 * t,
            ease: [0.22, 1, 0.36, 1],
            delay: T_BEAM,
            times: [0, 0.6, 1],
          }}
        />
      )}

      {/* Ignition flash — white-hot core that settles into a soft afterglow */}
      {!reduce && (
        <motion.div
          className={styles.flash}
          aria-hidden
          initial={{ opacity: 0, scale: 0.45 }}
          animate={
            inView
              ? {
                  opacity: [0, 1, 0.4, 0.35],
                  scale: [0.45, 1.35, 1, 1],
                }
              : undefined
          }
          transition={{
            duration: 1.7 * t,
            ease: [0.22, 1, 0.36, 1],
            delay: T_FLASH,
            times: [0, 0.3, 0.65, 1],
          }}
        />
      )}

      <div className={styles.grain} aria-hidden />
      <div className={styles.vignette} aria-hidden />

      {/* --- Content --- */}
      <div className={styles.content}>
        {/* Eyebrow */}
        <motion.div
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: 0.8 * t,
            ease: [0.22, 1, 0.36, 1],
            delay: T_EYEBROW,
          }}
        >
          <span className={styles.brandDot} />
          <span>05 &middot; Fusion</span>
          <span className={styles.sep}>/</span>
          <span>Hardware &times; Compiler</span>
        </motion.div>

        {/* Kicker */}
        <motion.p
          className={styles.kicker}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={
            inView ? { opacity: 1, y: 0, filter: "blur(0)" } : undefined
          }
          transition={{
            duration: 1.0 * t,
            ease: [0.16, 1, 0.3, 1],
            delay: T_KICKER,
          }}
        >
          The same silicon. <em>Recompiled.</em>
        </motion.p>

        {/* THE 85× — climax */}
        <div className={styles.bigNumberWrap}>
          <BigNumber
            inView={inView}
            reduce={!!reduce}
            delay={T_NUMBER}
          />
        </div>

        {/* Unit */}
        <motion.div
          className={styles.unit}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: 0.9 * t,
            ease: [0.22, 1, 0.36, 1],
            delay: T_UNIT,
          }}
        >
          useful throughput per watt &mdash; same silicon, same power envelope
        </motion.div>

        {/* Horizontal rule — draws outward from center */}
        <motion.div
          className={styles.rule}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{
            duration: 1.0 * t,
            ease: [0.22, 1, 0.36, 1],
            delay: T_RULE,
          }}
          aria-hidden
        >
          <div className={styles.ruleInner} />
        </motion.div>

        {/* Proof row — three before→after micro-stats */}
        <div className={styles.proof}>
          <ProofStat
            inView={inView}
            delay={T_STATS}
            before="1×"
            after="85×"
            label="useful throughput"
            accent="gradient"
          />
          <ProofStat
            inView={inView}
            delay={T_STATS + 0.15 * t}
            before="15%"
            after="95%"
            label="silicon utilization"
            accent="viridian"
          />
          <ProofStat
            inView={inView}
            delay={T_STATS + 0.3 * t}
            before="$1.00"
            after="$0.012"
            label="relative cost / 1M tokens"
            accent="gold"
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- */
/* BigNumber — the 85× itself, counts up from 0                         */
/* -------------------------------------------------------------------- */
function BigNumber({
  inView,
  reduce,
  delay,
}: {
  inView: boolean;
  reduce: boolean;
  delay: number;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const digitRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView) return;

    // Reduced motion → just plant the number
    if (reduce) {
      count.set(85);
      if (digitRef.current) digitRef.current.textContent = "85";
      return;
    }

    const controls = animate(count, 85, {
      duration: 1.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = rounded.on("change", (v) => {
      if (digitRef.current) digitRef.current.textContent = String(v);
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, reduce, delay, count, rounded]);

  return (
    <motion.div
      className={styles.bigNumber}
      initial={{ opacity: 0, scale: 0.55, filter: "blur(18px)" }}
      animate={
        inView
          ? { opacity: 1, scale: 1, filter: "blur(0)" }
          : undefined
      }
      transition={{
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
        delay: delay - 0.1,
      }}
    >
      <span ref={digitRef} className={styles.bigNumberDigits}>
        0
      </span>
      <span className={styles.bigNumberX}>&times;</span>
    </motion.div>
  );
}

/* -------------------------------------------------------------------- */
/* ProofStat — before → after micro comparison                          */
/* -------------------------------------------------------------------- */
function ProofStat({
  inView,
  delay,
  before,
  after,
  label,
  accent,
}: {
  inView: boolean;
  delay: number;
  before: string;
  after: string;
  label: string;
  accent: "gold" | "viridian" | "gradient";
}) {
  const afterClass =
    accent === "gold"
      ? styles.proofAfterGold
      : accent === "viridian"
        ? styles.proofAfterViridian
        : styles.proofAfterGradient;

  return (
    <motion.div
      className={styles.proofCard}
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      animate={
        inView ? { opacity: 1, y: 0, filter: "blur(0)" } : undefined
      }
      transition={{
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      <div className={styles.proofRow}>
        <span className={styles.proofBefore}>{before}</span>
        <span className={styles.proofArrow} aria-hidden>
          &rarr;
        </span>
        <span className={`${styles.proofAfter} ${afterClass}`}>{after}</span>
      </div>
      <span className={styles.proofLabel}>{label}</span>
    </motion.div>
  );
}
