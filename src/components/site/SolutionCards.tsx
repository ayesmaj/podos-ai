"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "./NewSections.module.css";

const FEATURES = [
  {
    idx: "F-01",
    title: "Modular pod architecture",
    body: "Engineered infrastructure units, not custom one-offs. A repeatable design with predictable interfaces means faster site work, simpler operations, and a lower-variance commissioning timeline.",
    featured: true,
  },
  {
    idx: "F-02",
    title: "Factory-built construction",
    body: "Pods are produced in a controlled environment with consistent quality, then shipped as completed assemblies. Off-site construction runs in parallel with site preparation.",
    featured: true,
  },
  {
    idx: "F-03",
    title: "High-density compute",
    body: "Dense GPU and accelerator configurations engineered for AI workloads, with the cooling and power to match.",
  },
  {
    idx: "F-04",
    title: "Deployable at facilities",
    body: "Designed to be placed where compute is actually needed — campuses, sites, edge locations.",
  },
  {
    idx: "F-05",
    title: "Fast commissioning",
    body: "Standardized hookups for power, network, and cooling cut weeks off on-site bring-up.",
  },
  {
    idx: "F-06",
    title: "Secure, controlled enclosure",
    body: "Hardened pod chassis with controlled access, environmental sealing, and integrated monitoring.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function SolutionCards() {
  const reduce = useReducedMotion();
  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      id="solution"
      className={`${styles.sectionLightShow} section-pad`}
      aria-labelledby="solution-heading"
    >
      {/* Live light show — three slowly drifting cyan/blue orbs +
          two scanning beams on a deep navy backdrop. Pure CSS
          animations, GPU-promoted, pointer-events disabled so it
          never blocks card interaction. */}
      <div className={styles.lightShow} aria-hidden>
        <div className={styles.lightOrb} />
        <div className={styles.lightBeam} />
        <div className={styles.lightBeam2} />
      </div>

      <div className={styles.container}>
        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={transition}
        >
          <span className={styles.eyebrowIdx}>02</span>
          <span className={styles.eyebrowSep}>·</span>
          THE SOLUTION
        </motion.span>

        <motion.h2
          id="solution-heading"
          className={styles.headline}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...transition, delay: 0.05 }}
        >
          Factory-built AI compute pods.
        </motion.h2>

        <motion.p
          className={styles.lede}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...transition, delay: 0.12 }}
        >
          PODOS AI designs modular compute pods that arrive as engineered
          infrastructure units — built for power, cooling, compute density,
          deployment speed, and operational flexibility.
        </motion.p>

        <div className={styles.gridFeatured4}>
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.idx}
              className={`${styles.card} ${f.featured ? styles.cardFeatured : ""}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              transition={{ ...transition, delay: reduce ? 0 : 0.08 * i }}
            >
              {f.featured && <span className={styles.cardAccent} aria-hidden />}
              <span className={styles.cardIdx}>{f.idx}</span>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardBody}>{f.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
