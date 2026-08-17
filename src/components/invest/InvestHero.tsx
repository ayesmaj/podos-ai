"use client";

/**
 * InvestHero — full-height opening: dramatic serif headline + investor
 * summary glass card over a bright luxury environment with the generated
 * PODOS product render anchoring the lower half.
 */

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import {
  HERO,
  CTA,
  MIN_INVESTMENT,
  PRICE_PER_SHARE,
  SECURITY_TYPE_SHORT,
  estimatedOwnershipPct,
  fmtUSD,
  fmtPct,
} from "@/data/investContent";
import GeneratedSectionImage from "./GeneratedSectionImage";

function HeroReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function InvestHero() {
  return (
    <section className="relative overflow-hidden pt-[128px] pb-16 md:pt-[150px]">
      <div className="iv-light" />
      <div className="iv-grid-bg" />

      <div className="iv-container relative">
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* left — narrative */}
          <div>
            <HeroReveal>
              <span className="iv-eyebrow">
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: "var(--iv-gold)" }}
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--iv-gold-deep)" }} />
                </span>
                {HERO.eyebrow}
              </span>
            </HeroReveal>

            <HeroReveal delay={0.08}>
              <h1 className="iv-h1 mt-6">
                {HERO.headline[0]}{" "}
                <em
                  className="not-italic"
                  style={{
                    background: "linear-gradient(110deg, var(--iv-gold-deep), #d8bc82 55%, var(--iv-gold-deep))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {HERO.headline[1]}
                </em>{" "}
                {HERO.headline[2]}
              </h1>
            </HeroReveal>

            <HeroReveal delay={0.16}>
              <p className="iv-sub mt-7">{HERO.sub}</p>
            </HeroReveal>

            <HeroReveal delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#calculator" className="iv-btn iv-btn-primary">
                  {HERO.primaryCta}
                  <ArrowRight size={17} strokeWidth={2.2} />
                </a>
                <a href="#calculator" className="iv-btn iv-btn-ghost">
                  {HERO.secondaryCta}
                </a>
              </div>
            </HeroReveal>

            <HeroReveal delay={0.34}>
              <div
                className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3"
                style={{ fontFamily: "var(--iv-mono)", fontSize: 12, color: "var(--iv-steel)" }}
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={15} style={{ color: "var(--iv-gold-deep)" }} />
                  Physical AI infrastructure
                </span>
                <span>1-MW modular units</span>
                <span>90-day deployment target</span>
              </div>
            </HeroReveal>
          </div>

          {/* right — investor summary card */}
          <HeroReveal delay={0.28}>
            <div className="iv-card iv-card-solid p-8">
              <div className="iv-label">Investor summary</div>

              <div className="mt-6 space-y-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[14px]" style={{ color: "var(--iv-steel)" }}>
                    Minimum investment
                  </span>
                  <span className="iv-num text-[26px] font-semibold">{fmtUSD(MIN_INVESTMENT)}</span>
                </div>
                <div className="iv-divider" />
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[14px]" style={{ color: "var(--iv-steel)" }}>
                    Security type
                  </span>
                  <span className="text-[14.5px] font-medium">{SECURITY_TYPE_SHORT}</span>
                </div>
                <div className="iv-divider" />
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[14px]" style={{ color: "var(--iv-steel)" }}>
                    Est. share price
                  </span>
                  <span className="iv-num text-[19px] font-semibold">${PRICE_PER_SHARE.toFixed(2)}*</span>
                </div>
                <div className="iv-divider" />
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[14px]" style={{ color: "var(--iv-steel)" }}>
                    Est. ownership at {fmtUSD(MIN_INVESTMENT)}
                  </span>
                  <span className="iv-num text-[19px] font-semibold">
                    {fmtPct(estimatedOwnershipPct(MIN_INVESTMENT))}*
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                <a href={CTA.investHref} className="iv-btn iv-btn-primary w-full">
                  Invest Now
                  <ArrowRight size={17} strokeWidth={2.2} />
                </a>
                <a href="#opportunity" className="iv-btn iv-btn-ghost w-full">
                  View Opportunity
                </a>
              </div>

              <p className="mt-6 text-[11.5px] leading-relaxed" style={{ color: "var(--iv-warmgray)" }}>
                {HERO.cardNote}
              </p>
            </div>
          </HeroReveal>
        </div>

        {/* product render */}
        <HeroReveal delay={0.42}>
          <div className="relative mt-16 md:mt-20">
            <div
              aria-hidden
              className="absolute -inset-x-10 -top-10 h-40"
              style={{
                background: "radial-gradient(60% 100% at 50% 100%, rgba(31,168,255,0.14), transparent 75%)",
              }}
            />
            <GeneratedSectionImage
              id="hero-product"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="shadow-[0_40px_120px_-40px_rgba(26,26,26,0.35)]"
            />
          </div>
        </HeroReveal>
      </div>
    </section>
  );
}
