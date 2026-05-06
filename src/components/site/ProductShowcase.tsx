"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./ProductShowcase.module.css";

/**
 * ProductShowcase — premium "Product Ladder · Same DNA, Two Scales".
 *
 * Replaces the older inline ProductLadder grid (text-only tiles)
 * with two image-led product cards: PODOS POD (1 MW unit) and MEGA
 * SILO (20 MW cluster). Each card uses a blueprint-style hero
 * render as the central visual anchor — same product DNA at two
 * different scales told through matching card architecture.
 *
 * Card anatomy (top → bottom):
 *   1. status row    — PROD-NN code (left) + availability pill (right)
 *   2. title block   — large product name + spec tag (e.g., 1 MW · UNIT)
 *   3. image hero    — 16:10 framed product render
 *   4. description   — one paragraph of context
 *   5. metrics grid  — 2×2 spec sheet under a divider line
 */
const PRODUCTS = [
  {
    code: "PROD-01",
    name: "PODOS POD",
    tag: "1 MW · UNIT",
    subtitle:
      "Containerized factory-built AI supercomputer. 720 sq ft, fully relocatable, off-grid capable.",
    specs: [
      { k: "POWER", v: "1 MW" },
      { k: "COMPUTE", v: "128 GPUs" },
      { k: "FOOTPRINT", v: "720 sq ft" },
      { k: "DEPLOY", v: "90–120 days" },
    ],
    badge: "PILOT · VALIDATED",
    badgeTone: "signed" as const,
    image: "/products/pod.png",
    alt: "PODOS POD blueprint — 1 MW factory-built AI supercomputer with dimensional callouts and metric badges.",
  },
  {
    code: "PROD-02",
    name: "MEGA SILO",
    tag: "20 MW · CLUSTER",
    subtitle:
      "Hyperbaric N₂ compound at 3–5+ atm. 24 pods in 20,000 sq ft — replaces 100,000 sq ft of traditional data center (83% smaller).",
    specs: [
      { k: "POWER", v: "20 MW" },
      { k: "COMPUTE", v: "2,560 GPUs" },
      { k: "DENSITY", v: "3–5+ atm N₂" },
      { k: "FOOTPRINT", v: "−83% vs DC" },
    ],
    badge: "Q4 2026 · TAKING LOIs",
    badgeTone: "validated" as const,
    image: "/products/silo.png",
    alt: "MEGA SILO blueprint — 24-pod cluster arranged in V formation with hyperbaric N₂ compound and metric callouts.",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductShowcase() {
  return (
    <section
      id="product-showcase"
      className={styles.section}
      aria-labelledby="product-showcase-heading"
    >
      {/* Subtle blueprint grid backdrop — same texture as
          EngineeringAdvantages so the two sections feel like
          chapters of one document. */}
      <div className={styles.gridBackdrop} aria-hidden />

      <div className={styles.container}>
        {/* ============== Section header — hero text style ==============
            Same pattern as EngineeringAdvantages: centered pill eyebrow
            + huge bold display headline with brand-gradient accent
            + body-text subhead. */}
        <motion.header
          className={styles.head}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.label}>PRODUCT LADDER</span>
          <h2
            id="product-showcase-heading"
            className={styles.headline}
          >
            Same DNA,{" "}
            <span className={styles.headlineAccent}>two scales.</span>
          </h2>
          <p className={styles.subhead}>
            Unit economics prove at 1 MW · cluster economics unlock at
            20 MW.
          </p>
        </motion.header>

        {/* ============== Bare image grid + per-image hero label ==============
            Each product gets a hero text label in the same mono-blue
            eyebrow style as the section header above. Below the label:
            the bare product render, no card frame. */}
        <div className={styles.grid}>
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.code}
              className={styles.imageBlock}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.05 + i * 0.1,
              }}
            >
              <span className={styles.imageLabel}>
                {p.code} · {p.name} · {p.tag}
              </span>
              <div className={styles.imageOnly}>
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className={styles.image}
                  priority={i === 0}
                  unoptimized
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
