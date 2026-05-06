"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./EngineeringAdvantages.module.css";

/**
 * EngineeringAdvantages — premium 4-card feature section.
 *
 * Replaces the older inline EngineeringPrinciples grid inside
 * PodosPod with a richer, image-led product-feature block.
 * Visual language: Apple keynote × NVIDIA infrastructure brochure —
 * soft cool gray paper, generous spacing, crisp typography, real
 * product imagery for each card (no generic icons).
 *
 * Each card is a premium product feature unit:
 *   ┌──────────────────────────────┐
 *   │ E-01           6 surfaces    │  ← code pill + metric
 *   │                INSULATED      │
 *   │                              │
 *   │      [ product image ]       │  ← real render, rounded frame
 *   │                              │
 *   │      Thermos enclosure       │  ← title
 *   │      Multi-layer foam ...    │  ← body
 *   └──────────────────────────────┘
 *
 * Image paths point to /public/engineering/*.png — drop the four
 * supplied product renders at those exact filenames and they load
 * automatically (Next.js Image handles AVIF/WebP/lazy-load).
 */
const ADVANTAGES = [
  {
    code: "E-01",
    metric: "6 surfaces",
    metricLabel: "INSULATED",
    title: "Thermos enclosure",
    body: "Multi-layer foam core + reflective vapor barrier on all six surfaces. Thermal delta held steady regardless of climate — Arctic field to Phoenix tarmac, same PUE.",
    image: "/engineering/thermos.png",
    alt: "Cutaway view of the PODOS pod showing multi-layer insulation: foam core, reflective vapor barrier, and arrows indicating heat reflection.",
  },
  {
    code: "E-02",
    metric: "$57K",
    metricLabel: "/yr/pod reclaimed",
    title: "ORC heat engine",
    body: "Organic Rankine Cycle on the waste-heat loop recaptures 60–110 kW as grid-synchronous electricity. Adds revenue per pod without any additional footprint.",
    image: "/engineering/orc.png",
    alt: "PODOS pod connected to an ORC heat-recovery engine via copper waste-heat pipes returning grid-synchronous electricity.",
  },
  {
    code: "E-03",
    metric: "0",
    metricLabel: "GRID DEPENDENCY",
    title: "Off-grid ready",
    body: "Solar roof + battery bank + backup generator integrated. Deploy to remote edge sites without fiber or utility interconnect — same 90-day timeline, anywhere on the map.",
    image: "/engineering/offgrid.png",
    alt: "PODOS pod paired with adjacent solar array, battery bank, and backup generator on a clean studio floor.",
  },
  {
    code: "E-04",
    metric: "0 gal",
    metricLabel: "WATER · CONCRETE",
    title: "Zero water · zero concrete",
    body: "Closed-loop direct-to-chip liquid cooling means no cooling towers, no water-rights negotiation, no slab permits. The pod lands on gravel or asphalt and starts serving inference.",
    image: "/engineering/zero.png",
    alt: "Crane placing the PODOS pod on removable foundation supports — no concrete slab, no water infrastructure required.",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function EngineeringAdvantages() {
  return (
    <section
      id="engineering-advantages"
      className={styles.section}
      aria-labelledby="engineering-advantages-heading"
    >
      {/* Subtle blueprint grid texture in the background — sits at z:0
          behind everything. Single SVG-like CSS pattern, no images. */}
      <div className={styles.gridBackdrop} aria-hidden />

      <div className={styles.container}>
        {/* ============== Section intro ============== */}
        <motion.header
          className={styles.head}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.label}>ENGINEERING ADVANTAGES</span>
          <h2
            id="engineering-advantages-heading"
            className={styles.headline}
          >
            Infrastructure designed for faster,{" "}
            <span className={styles.headlineAccent}>simpler deployment.</span>
          </h2>
          <p className={styles.subhead}>
            Every PODOS module is engineered to reduce deployment friction,
            increase resilience, and improve infrastructure economics.
          </p>
        </motion.header>

        {/* ============== Cards grid ============== */}
        <div className={styles.grid}>
          {ADVANTAGES.map((adv, i) => (
            <motion.article
              key={adv.code}
              className={styles.card}
              /* Always visible. whileInView was unreliable in this
                 layout (sticky ancestors + Lenis confused the
                 IntersectionObserver). Same fix as ProblemDiagnosis. */
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.05 + i * 0.08,
              }}
            >
              {/* Top metric strip — code pill (left) + metric value/label (right) */}
              <header className={styles.cardHead}>
                <span className={styles.codePill}>{adv.code}</span>
                <div className={styles.metricBlock}>
                  <span className={styles.metricValue}>{adv.metric}</span>
                  <span className={styles.metricLabel}>{adv.metricLabel}</span>
                </div>
              </header>

              {/* Image area — real product render, rounded frame */}
              <div className={styles.imageFrame}>
                <Image
                  src={adv.image}
                  alt={adv.alt}
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  className={styles.image}
                  unoptimized
                />
                {/* Soft bottom-edge fade so the image blends into card */}
                <div className={styles.imageFade} aria-hidden />
              </div>

              {/* Content area */}
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{adv.title}</h3>
                <p className={styles.cardCopy}>{adv.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
