"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  GridField,
  AmbientOrbs,
  CircuitTraces,
  Particles,
  VignetteLight,
} from "./BackgroundLayers";
import styles from "./InvestorTraction.module.css";

/**
 * SECTION 07 — TRACTION + THE TEAM
 *
 * Four stacked investor-dashboard blocks:
 *   1. Metric bar        — four validation KPIs (patents / raise / pre-money / benchmark)
 *   2. Traction signals  — six signed / validated / active / pipeline items
 *   3. Leadership        — the actual five-person founding + operating team
 *   4. Valuation ladder  — six-stop milestone timeline, each with target valuation
 *
 * No fabricated "ex-Tesla / ex-DARPA" name drops. Every person, partner,
 * and pipeline item here is on the investor deck (Slide 10 + Slide 11 +
 * Slide 14). Josef Elimelech — inventor on every claim — gets the
 * brand-ringed "founder" emphasis on his card.
 */

/* ---------------- useCountUp (shared pattern) ---------------- */
function useCountUp(
  target: number,
  inView: boolean,
  delay = 0,
  duration = 1.4,
  decimals = 0
) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) {
      setV(0);
      return;
    }
    let rafId = 0;
    const startAt = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const e = Math.max(0, Math.min(1, (now - startAt) / (duration * 1000)));
      const q = 1 - Math.pow(1 - e, 4);
      setV(q * target);
      if (e < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, inView, delay, duration]);
  return decimals === 0 ? Math.round(v).toString() : v.toFixed(decimals);
}

/* ---------------- DATA ---------------- */

type SignalTone = "signed" | "validated" | "brand";

const TRACTION_SIGNALS: Array<{
  status: string;
  tone: SignalTone;
  title: string;
  sub: string;
  detail: string;
}> = [
  {
    status: "SIGNED",
    tone: "signed",
    title: "California Modulars",
    sub: "Manufacturing Agreement",
    detail:
      "420+ commercial units delivered · factory capacity reserved · PODOS AI controls all funds · milestone-based payments.",
  },
  {
    status: "VALIDATED",
    tone: "validated",
    title: "Syntropic · 3 GPU Platforms",
    sub: "Independent Benchmark Proof",
    detail:
      "99.6% quality @ 3-bit · 8.0× ratio on Mistral-7B · NVIDIA GH200 480 GB + 2× RTX 4090 24 GB.",
  },
  {
    status: "FILED",
    tone: "brand",
    title: "76+ USPTO Patents",
    sub: "IP Moat · Holdco Structured",
    detail:
      "20+ hardware (6 systems) · 56 software · Josef Elimelech inventor of record across every claim.",
  },
  {
    status: "ACTIVE",
    tone: "brand",
    title: "Inflection Capital",
    sub: "Justin Kunz",
    detail:
      "Family-office network · reviewed Vantage reference deck · relationship progressing to commitment.",
  },
  {
    status: "PIPELINE",
    tone: "brand",
    title: "EcoSynQ",
    sub: "251-Nation Franchise",
    detail:
      "Hunter / Sean · global DC network · awaiting gold-sample completion · open invitation to return with validated unit.",
  },
  {
    status: "NDA",
    tone: "brand",
    title: "Israel DC Pipeline",
    sub: "$4.1B · 2025–30",
    detail:
      "Avi Ben Susan · EU EED compliance angle · signed NDA · active engagement.",
  },
];

const LEADERSHIP: Array<{
  name: string;
  role: string;
  bio: string;
  tag: string;
  founder?: boolean;
  /**
   * Headshot for the team card. Currently Unsplash placeholders; swap
   * to /team/<slug>.jpg once the user provides real photos. Photos
   * render full-width at the top of the card at 180px height with
   * `object-position: top center`, so portrait crops with the face
   * in the upper third look best.
   */
  photo: string;
}> = [
  {
    name: "Josef Elimelech",
    role: "Founder & Inventor",
    bio: "Inventor of record on all 76+ USPTO patents across both platforms. Technical architect behind PODOS Pod, MEGA SILO, Syntropic, and the Optimus campus system.",
    tag: "ALL 76+ PATENTS",
    founder: true,
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Greg McNulty",
    role: "Chief Executive Officer",
    bio: "Former Microsoft executive. Enterprise operational leadership, institutional investor relationships, and the commercial credibility to take PODOS AI from invention to global market.",
    tag: "EX-MICROSOFT",
    photo: "/team/greg.jpg",
  },
  {
    name: "Mike Sherman",
    role: "Chief Technology Officer",
    bio: "Built and executed the Syntropic GPU benchmark suite. Validated 99.6% quality preservation on Mistral-7B across three GPU platforms. Hands-on engineering lead for both platforms.",
    tag: "BENCHMARK VALIDATOR",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Barbara Liebeck",
    role: "VP Sales & BD",
    bio: "High-value enterprise account management. Leading customer pipeline across AI infrastructure — EcoSynQ, Israel market, hyperscaler prospects.",
    tag: "ENTERPRISE PIPELINE",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Rafael Smadja",
    role: "Graphic Design & Web",
    bio: "Brand identity, thesyntropic.com, PODOS AI web presence, and social. Translating the technical platform into investor-grade visual communications.",
    tag: "BRAND · WEB",
    photo: "/team/rafael.jpg",
  },
];

type MilestoneStatus = "complete" | "active" | "pending";
const MILESTONES: Array<{
  marker: string;
  label: string;
  detail: string;
  valuation: string;
  status: MilestoneStatus;
}> = [
  {
    marker: "NOW",
    label: "Pre-Seed Close",
    detail:
      "Patents filed · benchmarks validated · manufacturing signed · team assembled.",
    valuation: "$54M",
    status: "active",
  },
  {
    marker: "M+3",
    label: "PODOS Pod Design",
    detail:
      "Engineering drawings · permit filed · manufacturing begins · Syntropic enterprise pilot 1.",
    valuation: "$70M+",
    status: "pending",
  },
  {
    marker: "M+6",
    label: "Pod 1 Complete",
    detail:
      "First PODOS Pod delivered · tested · certified · photo + video for LOI conversations.",
    valuation: "$85M+",
    status: "pending",
  },
  {
    marker: "M+9",
    label: "First LOI Signed",
    detail:
      "Paying customer on record · Syntropic pilot 2 · MEGA SILO engineering underway.",
    valuation: "$100M+",
    status: "pending",
  },
  {
    marker: "M+12",
    label: "Syntropic Revenue Live",
    detail:
      "First recurring GPU seat licenses · 2+ enterprise pilots generating data.",
    valuation: "$120M+",
    status: "pending",
  },
  {
    marker: "M+18–24",
    label: "Series A",
    detail:
      "Pod 1 deployed + revenue · MEGA SILO prototype · Syntropic 3+ paying customers · $40–60M raise.",
    valuation: "$150M+",
    status: "pending",
  },
];

export default function InvestorTraction() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const t = reduce ? 0 : 1;

  const patents = useCountUp(76, inView, 0.5 * t, 1.1, 0);
  const raise = useCountUp(18, inView, 0.7 * t, 1.1, 0);
  const pre = useCountUp(54, inView, 0.9 * t, 1.1, 0);
  const quality = useCountUp(99.6, inView, 1.1 * t, 1.2, 1);

  return (
    <section ref={ref} className={`${styles.section} section-pad`}>
      <div className={styles.bg}>
        <GridField variant="sparse" />
        <AmbientOrbs config="electric" />
        <CircuitTraces accent="mixed" />
        <Particles count={10} />
        <VignetteLight />
      </div>

      <div className="container-site" style={{ position: "relative", zIndex: 2 }}>
        {/* ============== HEADER ============== */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 * t, ease: "easeOut" }}
        >
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowIdx}>07</span>
            <span className={styles.eyebrowSep}>·</span>
            TRACTION + THE TEAM
          </div>
          <h2 className={styles.headline}>
            The only team that has{" "}
            <span className="t-sweep-brand">already built this</span>.
          </h2>
          <p className={styles.lede}>
            76+ USPTO patents filed. Syntropic benchmarked at 99.6% on three
            GPU platforms — beating Google TurboQuant head-to-head.
            Manufacturing signed with California Modulars. A five-person
            leadership team assembled from Microsoft, the patents themselves,
            and the enterprise pipeline. The next five quarters are execution,
            not R&amp;D.
          </p>
        </motion.header>

        {/* ============== METRIC BAR ============== */}
        <div className={styles.metricBar}>
          <MetricTile
            code="T-01"
            label="USPTO FILED"
            value={patents}
            suffix="+"
            detail="20+ hardware · 56 software · Josef inventor of record on every claim"
            inView={inView}
            delay={0.35}
            brand
          />
          <MetricTile
            code="T-02"
            label="SEED RAISE"
            value={raise}
            prefix="$"
            suffix="M"
            detail="On $54M pre-money · 25% investor ownership · Josef retains majority"
            inView={inView}
            delay={0.5}
          />
          <MetricTile
            code="T-03"
            label="PRE-MONEY"
            value={pre}
            prefix="$"
            suffix="M"
            detail="Priced off validated IP + signed manufacturing, not promises"
            inView={inView}
            delay={0.65}
          />
          <MetricTile
            code="T-04"
            label="SYNTROPIC QUALITY"
            value={quality}
            suffix="%"
            detail="3-bit · 8.0× ratio · Mistral-7B · beats Google TurboQuant 87.1%"
            inView={inView}
            delay={0.8}
            status="live"
          />
        </div>

        {/* ============== TRACTION SIGNALS ============== */}
        <motion.div
          className={styles.signalsWrap}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 * t, delay: 0.9 * t, ease: "easeOut" }}
        >
          <div className={styles.signalsHead}>
            <span className={styles.signalsTag}>TRACTION SIGNALS · LIVE</span>
            <span className={styles.signalsCaption}>
              Agreements, benchmarks, and pipeline items independently
              verifiable in diligence.
            </span>
          </div>
          <div className={styles.signalsGrid}>
            {TRACTION_SIGNALS.map((s, i) => (
              <motion.div
                key={s.title}
                className={`${styles.signal} card-lift`}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.55 * t,
                  delay: (1.0 + i * 0.07) * t,
                  ease: "easeOut",
                }}
              >
                <div className={styles.signalHead}>
                  <span
                    className={`${styles.signalBadge} ${
                      s.tone === "signed"
                        ? styles.signalBadgeSigned
                        : s.tone === "validated"
                          ? styles.signalBadgeValidated
                          : styles.signalBadgeBrand
                    }`}
                  >
                    <span className={styles.signalBadgeDot} aria-hidden />
                    {s.status}
                  </span>
                  <span className={styles.signalSub}>{s.sub}</span>
                </div>
                <div className={styles.signalTitle}>{s.title}</div>
                <div className={styles.signalDetail}>{s.detail}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ============== LEADERSHIP TEAM ============== */}
        <motion.div
          className={styles.teamWrap}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 * t, delay: 1.2 * t, ease: "easeOut" }}
        >
          <div className={styles.teamHead}>
            <span className={styles.teamTag}>LEADERSHIP · 5 PRINCIPALS</span>
            <span className={styles.teamCaption}>
              The inventors, the operator, the validator, the commercial lead,
              and the brand — on the deck, on the cap table, or both.
            </span>
          </div>
          <div className={styles.teamGrid}>
            {LEADERSHIP.map((p, i) => (
              <motion.div
                key={p.name}
                className={`${styles.teamCard} ${
                  p.founder ? styles.teamCardFounder : ""
                } card-lift`}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6 * t,
                  delay: (1.35 + i * 0.08) * t,
                  ease: "easeOut",
                }}
              >
                {/* Photo block — full card width, 180px tall. Founder
                    pill (Josef only) overlays as a glass chip on the
                    photo's top-left corner; non-founder cards render
                    no overlay. */}
                <div className={styles.teamCardPhoto}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.photo}
                    alt={`${p.name}, ${p.role}`}
                    className={styles.teamCardPhotoImg}
                  />
                  {p.founder && (
                    <span className={styles.teamCardPhotoBadge}>
                      <span className={styles.teamCardPhotoBadgeDot} />
                      FOUNDER · INVENTOR
                    </span>
                  )}
                </div>
                <div className={styles.teamCardRole}>{p.role}</div>
                <div className={styles.teamCardName}>{p.name}</div>
                <div className={styles.teamCardRule} aria-hidden />
                <div className={styles.teamCardBio}>{p.bio}</div>
                <div className={styles.teamCardTag}>
                  <span className={styles.teamCardTagDot} />
                  {p.tag}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ============== VALUATION LADDER ============== */}
        <motion.div
          className={styles.milestones}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 * t, delay: 1.9 * t, ease: "easeOut" }}
        >
          <div className={styles.milestonesHead}>
            <span className={styles.milestonesTag}>
              VALUATION LADDER · 24-MONTH EXECUTION PLAN
            </span>
            <span className={styles.milestonesCaption}>
              Active &nbsp;●&nbsp;&nbsp; On-Deck · Every milestone unlocks the
              next step-up
            </span>
          </div>

          <div className={styles.timeline}>
            {/* Track fill — active at position 1/6 */}
            <div className={styles.timelineTrack} aria-hidden>
              <motion.div
                className={styles.timelineFill}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 / 6 } : {}}
                transition={{
                  duration: 1.6 * t,
                  delay: 2.1 * t,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: "left center" }}
              />
            </div>

            <div className={styles.timelineStops}>
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.marker}
                  className={styles.timelineStop}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.55 * t,
                    delay: (2.3 + i * 0.1) * t,
                    ease: "easeOut",
                  }}
                >
                  <span
                    className={`${styles.timelineNode} ${
                      m.status === "complete"
                        ? styles.timelineNodeDone
                        : m.status === "active"
                          ? styles.timelineNodeActive
                          : styles.timelineNodePending
                    }`}
                    aria-hidden
                  />
                  <div className={styles.timelineQuarter}>{m.marker}</div>
                  <div className={styles.timelineLabel}>{m.label}</div>
                  <div className={styles.timelineDetail}>{m.detail}</div>
                  <div className={styles.timelineValuation}>
                    <span className={styles.timelineValuationLabel}>
                      TARGET
                    </span>
                    <span
                      className={
                        m.status === "active"
                          ? `${styles.timelineValuationValue} ${styles.timelineValuationValueActive}`
                          : styles.timelineValuationValue
                      }
                    >
                      {m.valuation}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={styles.milestonesFoot}>
              Valuation ladder benchmarked against comparable exits: Vantage DC
              ($4.8B), EdgeConneX (~$2.5B), Equinix ($80B+). Syntropic layers a
              software multiple (15–25×) on top of the hardware base.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============ MetricTile ============ */

type MetricTileProps = {
  code: string;
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  detail: string;
  inView: boolean;
  delay: number;
  brand?: boolean;
  status?: "live" | "none";
};

function MetricTile({
  code,
  label,
  value,
  prefix,
  suffix,
  detail,
  inView,
  delay,
  brand,
  status,
}: MetricTileProps) {
  return (
    <motion.div
      className={`${styles.metric} ${brand ? styles.metricBrand : ""} card-lift`}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
    >
      <div className={styles.metricHead}>
        <span className={styles.metricCode}>{code}</span>
        {status === "live" && (
          <span className={styles.metricLive}>
            <span className={styles.metricLiveDot} />
            LIVE
          </span>
        )}
      </div>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricFigure}>
        {prefix && <span className={styles.metricAffix}>{prefix}</span>}
        <span className={brand ? `${styles.metricValue} ${styles.metricValueBrand}` : styles.metricValue}>
          {value}
        </span>
        {suffix && <span className={styles.metricAffix}>{suffix}</span>}
      </div>
      <div className={styles.metricDetail}>{detail}</div>
    </motion.div>
  );
}
