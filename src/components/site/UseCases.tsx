"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./NewSections.module.css";

interface UseCase {
  tag: string;
  title: string;
  description: string;
  src: string;
}

/* Two-line max copy for every card. Meaning preserved, density
 * reduced. Featured and small cards both stay under ~110 chars. */
const FEATURED: UseCase[] = [
  {
    tag: "U-01",
    title: "Enterprise AI teams",
    description:
      "Internal compute for training, inference, and AI product development — close to the data.",
    src: "/use-cases/office.jpg",
  },
  {
    tag: "U-02",
    title: "Healthcare facilities",
    description:
      "On-prem AI infrastructure for clinical, imaging, and research workloads inside the compliance boundary.",
    src: "/use-cases/hospital-pod.jpg",
  },
];

const SECONDARY: UseCase[] = [
  {
    tag: "U-03",
    title: "Universities & research labs",
    description:
      "Dedicated compute for research groups without competing for shared cluster time.",
    src: "/use-cases/university.jpg",
  },
  {
    tag: "U-04",
    title: "Manufacturing sites",
    description:
      "On-floor compute for industrial AI, vision systems, and process intelligence.",
    src: "/use-cases/lab 4.png",
  },
  {
    tag: "U-05",
    title: "Financial institutions",
    description:
      "Inference and modeling capacity inside controlled, audit-friendly infrastructure.",
    src: "/use-cases/Financial.png",
  },
];

const TERTIARY: UseCase[] = [
  {
    tag: "U-06",
    title: "Government & secure environments",
    description:
      "Pods for restricted facilities and operations that require physical and network control.",
    src: "/use-cases/government.png",
  },
  {
    tag: "U-07",
    title: "Edge AI deployments",
    description:
      "Compute placed close to where data is generated — closer to operations, lower latency.",
    src: "/use-cases/manifactoor.jpg",
  },
  {
    tag: "U-08",
    title: "Supplemental capacity",
    description:
      "Add headroom to existing infrastructure without waiting years for new construction.",
    src: "/use-cases/Supplemental.png",
  },
];

const ALL = [...FEATURED, ...SECONDARY, ...TERTIARY];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/* ============================================================
 * Premium Use-Case tile
 *
 * Disciplined system across all 3 sizes (featured/secondary/tertiary):
 *   • SAME aspect ratio (16:10) across every card → unified
 *     image rhythm down the page.
 *   • SAME typography scale per size: title = display weight, desc
 *     = body, meta = mono whisper.
 *   • SAME 2-line description clamp → all card bottoms align.
 *   • SAME minimum title height (2-line slot) → cards never bounce
 *     when one title runs short.
 *   • Hover lifts 4px + faint blue glow + subtle image zoom.
 * ============================================================ */
function UseCaseCard({
  c,
  index,
  size,
  imageRef,
}: {
  c: UseCase;
  index: number;
  size: "featured" | "secondary" | "tertiary";
  /** Optional ref attached to the image area — used by the
   *  helicopter overlay to compute its landing rect. */
  imageRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const reduce = useReducedMotion();
  const totalLabel = String(ALL.length).padStart(2, "0");
  const idxLabel = String(index + 1).padStart(2, "0");

  const titleClass =
    size === "featured"
      ? "text-[clamp(1.6rem,2.05vw,2rem)]"
      : "text-[clamp(1.1rem,1.4vw,1.25rem)]";
  const bodyClass =
    size === "featured"
      ? "text-[clamp(0.95rem,1.05vw,1.05rem)]"
      : "text-[clamp(0.88rem,0.95vw,0.95rem)]";
  // Title min-height removed — reserving 2-line height left a
  // visible empty gap below single-line titles. Bottom alignment
  // is now carried by the description's `min-h-[3em]` (every card
  // commits to a 2-line description slot via `line-clamp-2`), so
  // the title can sit naturally tight to the description.
  const titleMinH = "";
  const bodyMinH = size === "featured" ? "min-h-[3em]" : "min-h-[3em]";
  const padClass =
    size === "featured"
      ? "p-8 md:p-10 lg:p-12"
      : "p-6 md:p-7";
  // Vertical rhythm INSIDE the text block. Bigger gaps on featured
  // cards so they read as the priority tier.
  const innerGapClass =
    size === "featured" ? "gap-4 md:gap-5" : "gap-3 md:gap-3.5";

  return (
    <motion.article
      className="group relative rounded-[22px] overflow-hidden bg-white border border-slate-200/70 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.14),0_2px_6px_-2px_rgba(15,23,42,0.05)] flex flex-col h-full transition-all duration-500 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_28px_60px_-22px_rgba(37,99,235,0.22),0_8px_18px_-4px_rgba(15,23,42,0.08)] hover:border-blue-200/80"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={cardVariants}
      transition={
        reduce
          ? { duration: 0 }
          : {
              duration: 0.7,
              delay: 0.05 * index,
              ease: [0.22, 1, 0.36, 1] as const,
            }
      }
    >
      {/* IMAGE — unified 16:10 across every card.
          Cool blue tint to keep brightness/contrast consistent
          across the row regardless of source photo. */}
      <div
        ref={imageRef}
        className="relative w-full aspect-[16/10] overflow-hidden bg-[linear-gradient(180deg,#0b1628_0%,#1a2740_100%)]"
      >
        <div
          className="absolute inset-0 transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
          style={{
            backgroundImage: `url("${c.src}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Soft, near-imperceptible cool tint locks every photo
            into the section's blueprint mood. */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply"
          style={{
            background:
              "linear-gradient(180deg, rgba(219, 234, 254, 0.06) 0%, rgba(11, 22, 40, 0.10) 100%)",
          }}
        />
      </div>

      {/* TEXT BLOCK — disciplined three-tier hierarchy, center-aligned. */}
      <div
        className={`flex-1 flex flex-col items-center justify-start text-center ${padClass} ${innerGapClass}`}
      >
        {/* META — quiet code label row */}
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <span
            className="text-[0.68rem] tracking-[0.28em] uppercase font-semibold text-blue-700"
            style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
          >
            {c.tag}
          </span>
          <span className="text-slate-300/80 text-xs leading-none select-none">
            ·
          </span>
          <span
            className="text-[0.68rem] tracking-[0.18em] uppercase font-medium"
            style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
          >
            {idxLabel} <span className="text-slate-300">/</span> {totalLabel}
          </span>
        </div>

        {/* TITLE — uniform min-height keeps every card bottom aligned. */}
        <h3
          className={`${titleClass} ${titleMinH} font-extrabold tracking-[-0.018em] leading-[1.12] text-slate-900`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {c.title}
        </h3>

        {/* DESCRIPTION — clamped to 2 lines + min-h floor for parity. */}
        <p
          className={`${bodyClass} ${bodyMinH} leading-[1.55] text-slate-600 line-clamp-2`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          {c.description}
        </p>

        {/* Featured-only accent — single thin gradient line that
            grows on hover. Quiet enough to skip on small cards. */}
        {size === "featured" && (
          <div
            className="h-px w-12 mt-2 opacity-50 group-hover:opacity-100 group-hover:w-20 transition-all duration-500"
            style={{
              background:
                "linear-gradient(90deg, #2563eb, #22d3ee, transparent)",
            }}
          />
        )}
      </div>

      {/* Soft brand-blue glow on hover, GPU-composited overlay. */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(37,99,235,0.07), transparent 60%)",
        }}
      />
    </motion.article>
  );
}

export default function UseCases() {
  const reduce = useReducedMotion();
  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

  /* ============================================================
   * Helicopter video — VIDEO-TIME-driven landing.
   *
   * Plays once when the section enters view (IntersectionObserver
   * fires `play()`). The wrap is position:fixed and a rAF loop
   * interpolates its box between two anchor states based on
   * `video.currentTime / video.duration`:
   *
   *   • t = 0           → full viewport (BIG, fits whole section)
   *   • t = duration    → exactly the U-02 hospital image rect (SMALL)
   *
   * SCROLL DOES NOT DRIVE THE SCALE. Only video time. After the
   * video reaches the end it pauses (no `loop` attribute) and the
   * wrap holds at image size.
   * ============================================================ */
  const sectionRef = useRef<HTMLElement>(null);
  const targetRef = useRef<HTMLDivElement>(null); // U-02 card image area
  const heliRef = useRef<HTMLVideoElement>(null);
  const heliWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    // Skip on mobile — the fixed-position 100vw×100vh helicopter overlay
    // crops awkwardly on narrow portrait viewports (its WebM is composed
    // for landscape) and the rAF loop is wasted work since the CSS media
    // query hides the wrap. Save bandwidth + CPU on phones.
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) return;
    const sec = sectionRef.current;
    const target = targetRef.current;
    const wrap = heliWrapRef.current;
    const heli = heliRef.current;
    if (!sec || !target || !wrap || !heli) return;

    let stopped = false;
    let started = false;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Visibility gate — kicks off playback the first time the
    // section enters view, then leaves the wrap visible so the
    // helicopter can stay parked on the hospital image once landed.
    const visObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          heli.currentTime = 0;
          heli.play().catch(() => {});
          wrap.style.display = "block";
        }
      },
      { threshold: 0.05 },
    );
    visObserver.observe(sec);

    const update = () => {
      if (!started) return;
      const tr = target.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      const dur = heli.duration;
      const p =
        !dur || !isFinite(dur)
          ? 0
          : Math.max(0, Math.min(1, heli.currentTime / dur));
      const e = easeInOutCubic(p);

      const w = lerp(vw, tr.width, e);
      const h = lerp(vh, tr.height, e);
      const x = lerp(0, tr.left, e);
      const y = lerp(0, tr.top, e);

      wrap.style.width = `${w}px`;
      wrap.style.height = `${h}px`;
      wrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const tick = () => {
      if (stopped) return;
      update();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    return () => {
      stopped = true;
      visObserver.disconnect();
    };
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="use-cases"
      className={`${styles.section} section-pad`}
      aria-labelledby="use-cases-heading"
    >
      <div className={styles.container}>
        {/* Header block — centered, premium chrome.
            Same treatment as the EngineeringAdvantages / PodosPod
            headlines: pill eyebrow, big display headline with a
            `t-sweep-brand` gradient sweep on the accent phrase,
            centered lede beneath. Inline `text-align/margin: auto`
            overrides the default left-aligned `.headline` / `.lede`
            so the same shared classes work centered here. */}
        <div className="flex flex-col items-center text-center">
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={transition}
          >
            <span className={styles.eyebrowIdx}>05</span>
            <span className={styles.eyebrowSep}>·</span>
            USE CASES
          </motion.span>

          <motion.h2
            id="use-cases-heading"
            className={styles.headline}
            style={{
              textAlign: "center",
              maxWidth: "22ch",
              marginInline: "auto",
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...transition, delay: 0.05 }}
          >
            Built for organizations that need{" "}
            <span className="t-sweep-brand">
              controlled AI infrastructure.
            </span>
          </motion.h2>

          <motion.p
            className={styles.lede}
            style={{
              textAlign: "center",
              maxWidth: "58ch",
              marginInline: "auto",
            }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...transition, delay: 0.12 }}
          >
            From research and clinical environments to manufacturing floors and
            edge sites, PODOS pods deploy AI compute where it&apos;s actually
            used.
          </motion.p>
        </div>

        {/* ============ EDITORIAL ASYMMETRIC GRID ============
            More breathing room above the grid (mt-20/24/28) so the
            transition from intro → grid feels intentional, not
            cramped. Grid uses identical row-gap so featured row
            visually breathes from the secondary tier below. */}
        <div className="mt-20 md:mt-24 lg:mt-28 flex flex-col gap-6 md:gap-7">
          {/* Featured row — 2 large hero tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 auto-rows-fr">
            {FEATURED.map((c, i) => (
              <UseCaseCard
                key={c.tag}
                c={c}
                index={i}
                size="featured"
                /* The helicopter lands on U-02 (Healthcare). Pass
                   the targetRef so the rAF loop can read its
                   position every frame. */
                imageRef={c.tag === "U-02" ? targetRef : undefined}
              />
            ))}
          </div>

          {/* Secondary row — 3 medium tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 auto-rows-fr">
            {SECONDARY.map((c, i) => (
              <UseCaseCard
                key={c.tag}
                c={c}
                index={FEATURED.length + i}
                size="secondary"
              />
            ))}
          </div>

          {/* Tertiary row — 3 medium tiles, same chrome as secondary
              for visual rhythm; a smaller delay so they don't
              feel like an afterthought. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 auto-rows-fr">
            {TERTIARY.map((c, i) => (
              <UseCaseCard
                key={c.tag}
                c={c}
                index={FEATURED.length + SECONDARY.length + i}
                size="tertiary"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Helicopter overlay — fixed-position layer that the rAF
          loop resizes + repositions every frame. Starts hidden;
          IntersectionObserver flips display:block + plays the video
          the first time the section enters view. Alpha-channel
          WebM, so the wrap stays transparent and only the helicopter
          pixels render against whatever is behind. */}
      <div
        ref={heliWrapRef}
        aria-hidden
        className={styles.helicopterWrap}
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 30,
          willChange: "transform, width, height",
          transformOrigin: "top left",
        }}
      >
        <video
          ref={heliRef}
          src="/use-cases/helicopter.webm"
          muted
          playsInline
          preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            background: "transparent",
            pointerEvents: "none",
          }}
        />
      </div>
    </section>
  );
}
