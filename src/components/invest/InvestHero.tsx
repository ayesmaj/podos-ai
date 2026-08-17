"use client";

/**
 * InvestHero (V3) — the monumental pavilion image is the architectural
 * canvas. Editorial headline block on the left, a minimal investor-access
 * module lower-right. No invented securities terms; the module reads from
 * the approved offering config only. Slow image scale on scroll gives the
 * cinematic "camera settling" feel.
 */

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { HERO } from "@/data/investContent";
import GeneratedSectionImage from "./GeneratedSectionImage";
import { openInvestorAccess } from "./investAccess";

function Rise({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function InvestHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.03, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: "var(--iv-bg)" }}>
      {/* architectural canvas */}
      <div className="relative min-h-[88svh]">
        <motion.div
          className="absolute inset-0"
          style={reduced ? undefined : { scale: imgScale, y: imgY }}
        >
          <GeneratedSectionImage
            id="hero-pavilion"
            priority
            fill
            label={false}
            sizes="100vw"
          />
          {/* legibility wash — bright, not a dark scrim */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(247,246,242,0.92) 0%, rgba(247,246,242,0.72) 34%, rgba(247,246,242,0.12) 62%, rgba(247,246,242,0) 80%), linear-gradient(0deg, rgba(247,246,242,0.9) 0%, rgba(247,246,242,0) 28%)",
            }}
          />
        </motion.div>

        <div className="iv-container relative flex min-h-[88svh] flex-col justify-between pb-10 pt-[96px]">
          {/* left editorial block */}
          <div className="max-w-3xl">
            <Rise>
              <span className="iv-eyebrow">{HERO.eyebrow}</span>
            </Rise>
            <Rise delay={0.08}>
              <h1 className="iv-display mt-6">
                {HERO.headline[0]}
                <br />
                {HERO.headline[1]}
                <br />
                <span style={{ color: "var(--iv-gold-deep)" }}>{HERO.headline[2]}</span>
              </h1>
            </Rise>
            <Rise delay={0.16}>
              <p className="iv-sub mt-7 max-w-xl">{HERO.sub}</p>
              <p className="mt-4 max-w-xl text-[15px] font-medium">{HERO.investorLine}</p>
            </Rise>
            <Rise delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#film" className="iv-btn iv-btn-primary">
                  {HERO.primaryCta}
                  <ArrowRight size={17} strokeWidth={2.2} />
                </a>
                <a href="#film" className="iv-btn iv-btn-ghost">
                  <Play size={15} strokeWidth={2.4} />
                  {HERO.secondaryCta}
                </a>
              </div>
            </Rise>
          </div>

          {/* minimal investor-access module, lower-right */}
          <Rise delay={0.36}>
            <div className="mt-8 flex justify-end">
              <div
                className="w-full max-w-[380px] border-t-2 px-6 py-5"
                style={{
                  borderColor: "var(--iv-gold)",
                  background: "var(--iv-glass-strong)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div className="iv-label">{HERO.accessModule.label}</div>
                <dl className="mt-4 space-y-2.5">
                  {HERO.accessModule.rows.map((r) => (
                    <div key={r.k} className="flex items-baseline justify-between gap-4 text-[13.5px]">
                      <dt style={{ color: "var(--iv-steel)" }}>{r.k}</dt>
                      <dd className="iv-num font-semibold">{r.v}</dd>
                    </div>
                  ))}
                </dl>
                <button
                  onClick={() => openInvestorAccess()}
                  className="mt-5 flex w-full cursor-pointer items-center justify-between text-[14px] font-semibold transition-opacity hover:opacity-70"
                >
                  {HERO.accessModule.cta}
                  <ArrowRight size={16} strokeWidth={2.2} />
                </button>
                <p className="mt-4 text-[11px] leading-relaxed" style={{ color: "var(--iv-warmgray)" }}>
                  {HERO.accessModule.note}
                </p>
              </div>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
