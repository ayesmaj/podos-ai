"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./NewSections.module.css";

/* -------------------- data -------------------- */

type Point = { strong: string; body: string; icon: ReactNode };

const POINTS: Point[] = [
  {
    strong: "Factory-built approach",
    body: "Pods are produced as engineered infrastructure products, not site-fabricated assemblies.",
    icon: <FactoryGlyph />,
  },
  {
    strong: "Consistent production process",
    body: "A repeatable build sequence reduces variability and improves predictability.",
    icon: <CycleGlyph />,
  },
  {
    strong: "Faster deployment path",
    body: "Off-site construction runs in parallel with site preparation, compressing the overall timeline.",
    icon: <BoltGlyph />,
  },
  {
    strong: "Controlled quality",
    body: "Production-environment QA replaces field rework as the primary quality lever.",
    icon: <ShieldGlyph />,
  },
  {
    strong: "Repeatable pod architecture",
    body: "A common architecture across deployments simplifies operations, spares, and upgrades.",
    icon: <CubeGlyph />,
  },
];

const STEPS = [
  { num: "01", label: "FACTORY", desc: "Engineered and assembled in a controlled environment." },
  { num: "02", label: "POD", desc: "Fully tested, integrated, and quality-validated." },
  { num: "03", label: "SITE", desc: "Delivered and deployed for rapid site integration." },
];

const TAGS: Array<{ label: string; icon: ReactNode }> = [
  { label: "CONTROLLED QA", icon: <ShieldGlyph mini /> },
  { label: "REPEATABLE SPEC", icon: <CubeGlyph mini /> },
  { label: "PARALLELIZED SCHEDULE", icon: <ClockGlyph mini /> },
  { label: "FACTORY BUILD", icon: <FactoryGlyph mini /> },
];

/* -------------------- component -------------------- */

export default function Manufacturing() {
  const reduce = useReducedMotion();
  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      id="manufacturing"
      className={`${styles.sectionBlueprint} section-pad`}
      aria-labelledby="manufacturing-heading"
    >
      <div className={styles.container}>
        {/* ───── Hero block (full-width above the split) ───── */}
        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={transition}
        >
          <span className={styles.eyebrowIdx}>06</span>
          <span className={styles.eyebrowSep}>·</span>
          MANUFACTURING
        </motion.span>

        <motion.h2
          id="manufacturing-heading"
          className={styles.headline}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...transition, delay: 0.05 }}
        >
          Built through modular{" "}
          <span className={styles.headlineAccent}>
            manufacturing discipline.
          </span>
        </motion.h2>

        <motion.p
          className={styles.lede}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...transition, delay: 0.12 }}
        >
          PODOS brings modular construction principles to AI infrastructure.
          Pods are engineered in a controlled production environment and
          delivered for site deployment.
        </motion.p>

        {/* ───── Split: bullets (left) + build-model card (right) ───── */}
        <div className={styles.split}>
          <ul className={styles.bulletList}>
            {POINTS.map((p, i) => (
              <motion.li
                key={p.strong}
                className={styles.bullet}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ ...transition, delay: reduce ? 0 : 0.08 * i }}
              >
                <span className={styles.bulletIcon} aria-hidden>
                  {p.icon}
                </span>
                <div className={styles.bulletBody}>
                  <span className={styles.bulletStrong}>{p.strong}.</span>
                  <span className={styles.bulletDesc}>{p.body}</span>
                </div>
              </motion.li>
            ))}
          </ul>

          <motion.aside
            className={`${styles.framePanel} ${styles.buildModelPanel}`}
            aria-label="Build model: Factory, Pod, Site — modular manufacturing pipeline"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...transition, delay: 0.2 }}
          >
            <Image
              src="/pod factory site.png"
              alt="Build model diagram: Factory, Pod, Site. Three-stage modular pipeline — factory production with robotic assembly, the PODOS AI compute pod, and site deployment by crane. Steps: 01 Factory — engineered and assembled in a controlled environment; 02 Pod — fully tested, integrated, and quality-validated; 03 Site — delivered and deployed for rapid site integration. Tags: Controlled QA, Repeatable Spec, Parallelized Schedule, Factory Build."
              width={1400}
              height={900}
              sizes="(max-width: 880px) 92vw, 700px"
              className={styles.buildModelImage}
              priority={false}
            />
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

/* -------------------- icon glyphs -------------------- */

function FactoryGlyph({ mini = false }: { mini?: boolean }) {
  const s = mini ? 14 : 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21V10l6 4V10l6 4V6l6 4v11Z" />
      <path d="M7 17h2M11 17h2M15 17h2" />
    </svg>
  );
}

function CycleGlyph({ mini = false }: { mini?: boolean }) {
  const s = mini ? 14 : 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function BoltGlyph({ mini = false }: { mini?: boolean }) {
  const s = mini ? 14 : 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m13 3-9 11h7l-1 7 9-11h-7l1-7Z" />
    </svg>
  );
}

function ShieldGlyph({ mini = false }: { mini?: boolean }) {
  const s = mini ? 14 : 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CubeGlyph({ mini = false }: { mini?: boolean }) {
  const s = mini ? 14 : 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" />
      <path d="M12 12v9M4 7.5 12 12l8-4.5" />
    </svg>
  );
}

function ClockGlyph({ mini = false }: { mini?: boolean }) {
  const s = mini ? 14 : 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

/* -------------------- diagram parts -------------------- */

function FlowArrow() {
  return (
    <svg className={styles.flowArrow} viewBox="0 0 40 12" fill="none" aria-hidden>
      <path d="M2 6h32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="m30 2 6 4-6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FactoryScene() {
  return (
    <svg viewBox="0 0 220 160" className={styles.sceneSvg} fill="none" aria-hidden>
      <defs>
        <pattern id="bp-grid-f" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0H0V10" stroke="currentColor" strokeOpacity="0.10" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="220" height="160" fill="url(#bp-grid-f)" />
      <path d="M10 130h200" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
      <path d="M10 134h200" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={20 + i * 22} cy="138" r="2.5" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.4" />
      ))}
      <g stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.85" strokeLinecap="round">
        <path d="M40 130v-40" />
        <path d="M40 90l25-22" />
        <path d="M65 68l18 14" />
        <circle cx="40" cy="90" r="3" />
        <circle cx="65" cy="68" r="3" />
      </g>
      <g stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.7" strokeLinecap="round">
        <path d="M180 130v-32" />
        <path d="M180 98l-22-18" />
        <circle cx="180" cy="98" r="2.5" />
      </g>
      <rect x="92" y="78" width="56" height="42" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.9" />
      <path d="M92 92h56M92 106h56M108 78v42M124 78v42M140 78v42" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.4" />
      <path d="M83 82l-4-4M83 82l4-4M83 82v-5" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6" />
    </svg>
  );
}

function SiteScene() {
  return (
    <svg viewBox="0 0 220 160" className={styles.sceneSvg} fill="none" aria-hidden>
      <defs>
        <pattern id="bp-grid-s" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0H0V10" stroke="currentColor" strokeOpacity="0.10" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="220" height="160" fill="url(#bp-grid-s)" />
      <path d="M0 140h220" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M0 120l30-22 22 18 30-30 28 24 22-14 30 22 28-12 30 18v16H0Z" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.25" />
      <g stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.9" strokeLinecap="round">
        <path d="M30 140V40" />
        <path d="M22 140h16" />
        <path d="M30 50h140" />
        <path d="M30 50l140 12" />
        <path d="M150 50v18" />
        <rect x="16" y="46" width="14" height="8" />
      </g>
      <path d="M150 68v22" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6" />
      <rect x="132" y="90" width="36" height="22" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.95" />
      <path d="M132 100h36M150 90v22" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.5" />
      <rect x="60" y="118" width="80" height="22" stroke="currentColor" strokeWidth="1" strokeOpacity="0.75" />
      <path d="M60 130h80M76 118v22M92 118v22M108 118v22M124 118v22" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4" />
    </svg>
  );
}

