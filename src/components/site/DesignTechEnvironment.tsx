"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./NewSections.module.css";

/* -------------------- data -------------------- */

type Pillar = { idx: string; title: string; body: string; icon: ReactNode };

const PILLARS: Pillar[] = [
  { idx: "D-01", title: "Compute density",        body: "Engineered to host high-performance accelerator configurations within a single deployable unit.", icon: <ChipIcon /> },
  { idx: "D-02", title: "Cooling architecture",   body: "Thermal design matched to AI compute load, sustained under continuous operation.",                  icon: <SnowflakeIcon /> },
  { idx: "D-03", title: "Power readiness",        body: "Power distribution sized for high-density compute and configured for site interconnect.",            icon: <PowerIcon /> },
  { idx: "D-04", title: "Physical security",      body: "Hardened enclosure with controlled access and environmental protection.",                            icon: <ShieldIcon /> },
  { idx: "D-05", title: "Operational flexibility",body: "Configurable for different compute profiles, deployment contexts, and operational models.",          icon: <SlidersIcon /> },
  { idx: "D-06", title: "Deployment speed",       body: "Designed end-to-end for fast site commissioning and compressed time-to-capacity.",                   icon: <GaugeIcon /> },
];

const CREDS: Array<{ label: string; sub: string; icon: ReactNode }> = [
  { label: "Engineered system",  sub: "Not assembled.",        icon: <CrosshairIcon /> },
  { label: "Built for uptime",   sub: "Continuous by design.", icon: <ShieldIcon mini /> },
  { label: "Modular by design",  sub: "Adaptable to any site.",icon: <CubeIcon /> },
  { label: "Commissioned faster",sub: "From site to service.", icon: <GaugeIcon mini /> },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

/* -------------------- component -------------------- */

export default function DesignTechEnvironment() {
  const reduce = useReducedMotion();
  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      id="design"
      className={`${styles.sectionBlueprint} section-pad`}
      aria-labelledby="design-heading"
    >
      <div className={styles.container}>
        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={transition}
        >
          <span className={styles.eyebrowIdx}>07</span>
          <span className={styles.eyebrowSep}>·</span>
          ENGINEERING
        </motion.span>

        <motion.h2
          id="design-heading"
          className={styles.headline}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...transition, delay: 0.05 }}
        >
          Engineered for deployment, density, and control
          <span className={styles.headlineAccent}>.</span>
        </motion.h2>

        <motion.p
          className={styles.lede}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...transition, delay: 0.12 }}
        >
          PODOS pods are built around six engineering pillars that together
          define what a deployable AI compute unit is supposed to be.
        </motion.p>

        <div className={styles.engGrid}>
          {/* ───── Left: pod hero with dimensional callouts (image carries
                  6058mm / 2591mm / 2438mm dimensions + circuit fade) ───── */}
          <motion.div
            className={styles.engPodHero}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...transition, delay: 0.15 }}
          >
            <Image
              src="/engineering/pod-hero.png"
              alt="PODOS deployable AI compute unit, shown with dimensional callouts: 6058mm long, 2591mm tall, 2438mm wide. The pod is rendered as a black industrial enclosure with a glowing blue interior visible through a service door, sitting on a faintly illuminated floor with a circuit-style trace pattern fading toward the right edge."
              width={1300}
              height={760}
              sizes="(max-width: 1080px) 92vw, 560px"
              className={styles.engPodImg}
              priority={false}
            />
          </motion.div>

          {/* ───── Right: 6 pillar cards (3 × 2) ───── */}
          <div className={styles.engPillars}>
            {PILLARS.map((p, i) => (
              <motion.article
                key={p.idx}
                className={styles.engCard}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
                transition={{ ...transition, delay: reduce ? 0 : 0.06 * i }}
              >
                <span className={styles.engCardIdx}>{p.idx}</span>
                <span className={styles.engCardIcon} aria-hidden>
                  {p.icon}
                </span>
                <h3 className={styles.engCardTitle}>{p.title}</h3>
                <p className={styles.engCardBody}>{p.body}</p>
                <span className={styles.engCardCorner} aria-hidden />
              </motion.article>
            ))}
          </div>
        </div>

        {/* ───── Credentials strip (4 metrics) ───── */}
        <motion.div
          className={styles.engCreds}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...transition, delay: 0.1 }}
          role="list"
        >
          {CREDS.map((c) => (
            <div key={c.label} className={styles.engCred} role="listitem">
              <span className={styles.engCredIcon} aria-hidden>{c.icon}</span>
              <div className={styles.engCredText}>
                <span className={styles.engCredLabel}>{c.label}</span>
                <span className={styles.engCredSub}>{c.sub}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- icon glyphs -------------------- */

function ChipIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="0.5" />
      <path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" />
    </svg>
  );
}

function SnowflakeIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07" />
      <path d="M9 4l3 3 3-3M9 20l3-3 3 3M4 9l3 3-3 3M20 9l-3 3 3 3" />
    </svg>
  );
}

function PowerIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <path d="M12 2v10" />
    </svg>
  );
}

function ShieldIcon({ mini = false }: { mini?: boolean }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      {!mini && <path d="m9 12 2 2 4-4" />}
      {mini && <path d="m9 12 2 2 4-4" />}
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h12M19 6h2" />
      <path d="M3 12h6M13 12h8" />
      <path d="M3 18h14M21 18h-2" />
      <circle cx="17" cy="6" r="2" />
      <circle cx="11" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

function GaugeIcon({ mini = false }: { mini?: boolean }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 13a9 9 0 0 1 18 0" />
      <path d="m12 13 4-3" />
      {!mini && <circle cx="12" cy="13" r="1" fill="currentColor" stroke="none" />}
      {mini && <circle cx="12" cy="13" r="1" fill="currentColor" stroke="none" />}
    </svg>
  );
}

function CrosshairIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  );
}

function CubeIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" />
      <path d="M12 12v9M4 7.5 12 12l8-4.5" />
    </svg>
  );
}
