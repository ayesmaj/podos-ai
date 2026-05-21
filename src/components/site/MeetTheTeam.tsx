"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "./NewSections.module.css";

/* -------------------- data --------------------
   Placeholder team data — REPLACE with real names + roles + bios when
   ready, and (optionally) drop headshots into /public/team/<slug>.jpg
   to swap the gradient monograms for real portraits. The component
   uses the monogram fallback automatically when `photo` is undefined. */

type Member = {
  idx: string;
  name: string;
  role: string;
  bio: string;
  monogram: string;     // 1–2 letters shown on the gradient avatar
  photo?: string;       // optional path under /public, e.g. "/team/foo.jpg"
};

const TEAM: Member[] = [
  {
    idx: "T-01",
    name: "Josef Elimelech",
    role: "Founder & Inventor",
    bio: "Creator of all 76+ patent claims across both platforms — inventor of record on every USPTO filing. Technical architect of PODOS Pod, MEGA SILO, Syntropic, and Optimus.",
    monogram: "JE",
    photo: "/team/josef.jpg",
  },
  {
    idx: "T-02",
    name: "Greg McNulty",
    role: "Chief Executive Officer",
    bio: "Former Microsoft executive. Enterprise-scale operational leadership and institutional investor relationships taking PODOS AI from invention to global market.",
    monogram: "GM",
    photo: "/team/greg.jpg",
  },
  {
    idx: "T-03",
    name: "Mike Sherman",
    role: "Chief Technology Officer",
    bio: "Built the Syntropic GPU benchmark suite — validated 99.6% quality preservation on Mistral-7B across 3 GPU platforms. Engineering lead for Optimus and Syntropic.",
    monogram: "MS",
    photo: "/team/mike.jpg",
  },
  {
    idx: "T-04",
    name: "Barbara Liebeck",
    role: "VP Sales & Business Dev.",
    bio: "Enterprise account management across AI infrastructure. Leads the customer pipeline for EcoSynQ, the Israel market, and hyperscaler prospects.",
    monogram: "BL",
  },
  {
    idx: "T-05",
    name: "Rafael Smadja",
    role: "Graphic Designer & Web",
    bio: "Brand identity, thesyntropic.com, and PODOS AI web presence. Translates the technical platform into investor-grade visual communications.",
    monogram: "RS",
    photo: "/team/rafael.jpg",
  },
];

/* -------------------- component -------------------- */

const cardVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function MeetTheTeam() {
  const reduce = useReducedMotion();
  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      id="team"
      className={`${styles.sectionBlueprint} section-pad`}
      aria-labelledby="team-heading"
    >
      <div className={styles.container}>
        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={transition}
        >
          <span className={styles.eyebrowIdx}>08</span>
          <span className={styles.eyebrowSep}>·</span>
          TEAM
        </motion.span>

        <motion.h2
          id="team-heading"
          className={styles.headline}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...transition, delay: 0.05 }}
        >
          Meet the operators behind{" "}
          <span className={styles.headlineAccent}>modular compute</span>
        </motion.h2>

        <motion.p
          className={styles.lede}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...transition, delay: 0.12 }}
        >
          A small team with deep operational experience across data center
          construction, industrial manufacturing, and AI infrastructure.
        </motion.p>

        <div className={styles.teamGrid}>
          {TEAM.map((m, i) => (
            <motion.article
              key={m.idx}
              className={styles.teamCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              transition={{ ...transition, delay: reduce ? 0 : 0.06 * i }}
            >
              <div className={styles.teamPortrait}>
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photo}
                    alt={`${m.name} portrait`}
                    className={styles.teamPortraitImg}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span className={styles.teamMonogram} aria-hidden>
                    {m.monogram}
                  </span>
                )}
              </div>
              <span className={styles.teamCardIdx}>{m.idx}</span>
              <h3 className={styles.teamName}>{m.name}</h3>
              <span className={styles.teamRole}>{m.role}</span>
              <p className={styles.teamBio}>{m.bio}</p>
              <span className={styles.teamCardCorner} aria-hidden />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
