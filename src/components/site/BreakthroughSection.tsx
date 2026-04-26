"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import styles from "./BreakthroughSection.module.css";

/**
 * SECTION 03 — "BREAKTHROUGH"
 *
 * The narrative pivot. After the cold Problem, the void reopens —
 * now with a hopeful viridian/gold aurora instead of the ember wall.
 *
 * Narrative beat:
 *   "We didn't optimize the system. We rewrote the physics."
 *
 * Then the two product names converge into one mark: PODOS (hardware,
 * gold) and SYNTROPIC (software, viridian). A single short caption
 * sets up Section 4 (SPLIT), where each half is unpacked.
 *
 * This section is intentionally short and declarative — a breath
 * between two dense passages. All animation is scroll-triggered
 * and respects prefers-reduced-motion.
 */
export default function BreakthroughSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.28 });
  const t = reduce ? 0 : 1;

  // Timing beats (s)
  const T_EYEBROW = 0.15 * t;
  const T_QUOTE_A = 0.45 * t;
  const T_QUOTE_B = 0.75 * t;
  const T_DIVIDER = 1.35 * t;
  const T_GLYPH   = 1.55 * t;
  const T_PODOS   = 1.75 * t;
  const T_SYNTRO  = 1.75 * t; // same, opposite directions
  const T_CAPTION = 2.3 * t;
  const T_BEAM    = 0.0;

  return (
    <section ref={ref} id="breakthrough" className={styles.section}>
      {/* Motes — slow drifting ambient energy */}
      <div className={styles.motes} aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className={`${styles.mote} ${i % 3 === 0 ? styles.moteGold : ""}`}
            style={{
              left: `${(i * 73) % 100}%`,
              top: `${15 + ((i * 41) % 75)}%`,
              animationDelay: `${(i * 340) % 6200}ms`,
              animationDuration: `${7000 + (i % 4) * 1500}ms`,
            }}
          />
        ))}
      </div>

      {/* Scan beam — sweeps once on enter */}
      {!reduce && (
        <motion.div
          className={styles.beam}
          aria-hidden
          initial={{ x: "-100%", opacity: 0 }}
          animate={inView ? { x: "220%", opacity: [0, 0.9, 0] } : undefined}
          transition={{
            duration: 2.2,
            delay: T_BEAM,
            ease: [0.22, 1, 0.36, 1],
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
          <span>03 &middot; Breakthrough</span>
          <span className={styles.sep}>/</span>
          <span>We rewrote the physics</span>
        </motion.div>

        {/* Manifesto quote */}
        <blockquote className={styles.quote}>
          <QuoteLine inView={inView} delay={T_QUOTE_A}>
            We didn&rsquo;t <span className={styles.quoteAccent}>optimize</span> the system.
          </QuoteLine>
          <QuoteLine inView={inView} delay={T_QUOTE_B}>
            We <span className={styles.quoteGold}>rewrote</span> the physics.
          </QuoteLine>
        </blockquote>

        {/* Divider — draws outward from center */}
        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{
            duration: 1.1 * t,
            delay: T_DIVIDER,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-hidden
        >
          <div className={styles.dividerInner} />
        </motion.div>

        {/* Reveal row */}
        <div className={styles.reveal}>
          {/* Left — PODOS slides in from left */}
          <motion.div
            className={`${styles.brandBlock} ${styles.brandBlockLeft}`}
            initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
            animate={
              inView
                ? { opacity: 1, x: 0, filter: "blur(0)" }
                : undefined
            }
            transition={{
              duration: 1.1 * t,
              ease: [0.16, 1, 0.3, 1],
              delay: T_PODOS,
            }}
          >
            <span className={styles.brandTag}>Hardware</span>
            <span className={`${styles.brandName} ${styles.brandNameGold}`}>
              PODOS
            </span>
            <span className={styles.brandRole}>
              The building.
            </span>
          </motion.div>

          {/* Center — two-tone diamond glyph */}
          <motion.div
            className={styles.glyph}
            initial={{ opacity: 0, scale: 0.3, rotate: -40 }}
            animate={
              inView ? { opacity: 1, scale: 1, rotate: 0 } : undefined
            }
            transition={{
              duration: 1.0 * t,
              ease: [0.22, 1, 0.36, 1],
              delay: T_GLYPH,
            }}
            aria-hidden
          >
            <svg
              className={styles.glyphSvg}
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Upper triangle — gold (hardware) */}
              <motion.polygon
                points="30,4 56,30 30,30 4,30"
                fill="var(--gold)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0.95 } : undefined}
                transition={{
                  duration: 0.8 * t,
                  delay: T_GLYPH + 0.15 * t,
                }}
              />
              {/* Lower triangle — viridian (software) */}
              <motion.polygon
                points="30,56 4,30 30,30 56,30"
                fill="var(--viridian)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0.95 } : undefined}
                transition={{
                  duration: 0.8 * t,
                  delay: T_GLYPH + 0.3 * t,
                }}
              />
              {/* Hairline seam at the middle */}
              <motion.line
                x1="4"
                y1="30"
                x2="56"
                y2="30"
                stroke="rgba(10, 12, 20, 0.8)"
                strokeWidth="0.6"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : undefined}
                transition={{
                  duration: 0.6 * t,
                  delay: T_GLYPH + 0.45 * t,
                }}
              />
            </svg>
          </motion.div>

          {/* Right — SYNTROPIC slides in from right */}
          <motion.div
            className={`${styles.brandBlock} ${styles.brandBlockRight}`}
            initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
            animate={
              inView
                ? { opacity: 1, x: 0, filter: "blur(0)" }
                : undefined
            }
            transition={{
              duration: 1.1 * t,
              ease: [0.16, 1, 0.3, 1],
              delay: T_SYNTRO,
            }}
          >
            <span className={styles.brandTag}>Software</span>
            <span className={`${styles.brandName} ${styles.brandNameViridian}`}>
              SYNTROPIC
            </span>
            <span className={styles.brandRole}>
              The compiler.
            </span>
          </motion.div>
        </div>

        {/* Caption — bridges to Section 4 */}
        <motion.p
          className={styles.caption}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={
            inView ? { opacity: 1, y: 0, filter: "blur(0)" } : undefined
          }
          transition={{
            duration: 1.1 * t,
            ease: [0.16, 1, 0.3, 1],
            delay: T_CAPTION,
          }}
        >
          A <span className={styles.captionEm}>1-megawatt AI supercomputer</span> rolls off
          a California assembly line every{" "}
          <span className={styles.captionGold}>90 days</span> &mdash; orchestrated by a
          compiler that delivers{" "}
          <span className={styles.captionViridian}>85&times; throughput</span> on the same silicon.
        </motion.p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- */
/* QuoteLine — blur-to-focus reveal for serif manifesto lines           */
/* -------------------------------------------------------------------- */
function QuoteLine({
  children,
  delay,
  inView,
}: {
  children: React.ReactNode;
  delay: number;
  inView: boolean;
}) {
  return (
    <span className={styles.quoteLine}>
      <motion.span
        className={styles.quoteInner}
        initial={{ opacity: 0, y: 32, filter: "blur(14px)" }}
        animate={
          inView ? { opacity: 1, y: 0, filter: "blur(0)" } : undefined
        }
        transition={{
          duration: 1.3,
          ease: [0.16, 1, 0.3, 1],
          delay,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
