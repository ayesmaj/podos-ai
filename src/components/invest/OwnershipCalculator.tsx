"use client";

/**
 * OwnershipCalculator — the page's interactive centerpiece.
 *
 * Input + log-scaled slider + quick chips drive an estimated position:
 * shares, ownership %, and an animated "equity ring" showing the user's
 * slice of the company. The slice is drawn with a minimum visible arc
 * (real early-stage stakes are fractions of a degree) and honestly
 * captioned as enlarged for visibility.
 *
 * All math derives from placeholder constants in data/investContent.ts.
 */

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  CALCULATOR,
  CTA,
  MIN_INVESTMENT,
  MAX_INVESTMENT,
  QUICK_AMOUNTS,
  SECURITY_TYPE_SHORT,
  estimatedShares,
  estimatedOwnershipPct,
  fmtUSD,
  fmtPct,
} from "@/data/investContent";
import Reveal from "./Reveal";
import GeneratedSectionImage from "./GeneratedSectionImage";

/* slider maps 0..1 -> log scale between MIN and MAX so small amounts
   aren't crushed into the first few pixels */
const LOG_MIN = Math.log(MIN_INVESTMENT);
const LOG_MAX = Math.log(MAX_INVESTMENT);
const posToAmount = (p: number) =>
  Math.round(Math.exp(LOG_MIN + (LOG_MAX - LOG_MIN) * p) / 100) * 100;
const amountToPos = (a: number) => (Math.log(a) - LOG_MIN) / (LOG_MAX - LOG_MIN);

const R = 118;
const CIRC = 2 * Math.PI * R;

function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  // layout effect rewrites the text before paint, so the render below
  // never flashes the final value ahead of the tween
  useLayoutEffect(() => {
    const controls = animate(shown.current, value, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        shown.current = v;
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [value, format]);
  return <span ref={ref}>{format(value)}</span>;
}

export default function OwnershipCalculator() {
  const [amount, setAmount] = useState(10_000);

  const clamp = (n: number) => Math.min(MAX_INVESTMENT, Math.max(MIN_INVESTMENT, n));
  const shares = estimatedShares(amount);
  const ownership = estimatedOwnershipPct(amount);

  /* the visible gold arc: true proportion, floored at 3% of the ring so
     it reads at all — caption declares the enlargement */
  const trueFrac = ownership / 100;
  const visFrac = Math.max(trueFrac, 0.03);
  const enlarged = visFrac > trueFrac;
  const sliderPos = useMemo(() => amountToPos(amount), [amount]);

  const onInput = (raw: string) => {
    const digits = Number(raw.replace(/[^0-9]/g, ""));
    if (!Number.isNaN(digits)) setAmount(Math.min(MAX_INVESTMENT, Math.max(0, digits)));
  };

  return (
    <section id="calculator" className="iv-section relative overflow-hidden">
      <div className="iv-light" style={{ opacity: 0.7 }} />
      <div className="iv-container relative">
        <Reveal className="max-w-3xl">
          <span className="iv-eyebrow">{CALCULATOR.eyebrow}</span>
          <h2 className="iv-h2 mt-5">{CALCULATOR.headline}</h2>
          <p className="iv-sub mt-6">{CALCULATOR.sub}</p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="iv-card iv-card-solid mt-14 grid overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
            {/* ---- left: controls + outputs ---- */}
            <div className="p-8 md:p-10">
              <label className="iv-label" htmlFor="iv-amount">
                {CALCULATOR.outputs.investment}
              </label>
              <div
                className="mt-3 flex items-center gap-1 border-b pb-3"
                style={{ borderColor: "var(--iv-border)" }}
              >
                <span className="iv-num text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold" style={{ color: "var(--iv-warmgray)" }}>
                  $
                </span>
                <input
                  id="iv-amount"
                  className="iv-input"
                  inputMode="numeric"
                  value={amount.toLocaleString("en-US")}
                  onChange={(e) => onInput(e.target.value)}
                  onBlur={() => setAmount(clamp(amount))}
                  aria-label="Investment amount in US dollars"
                />
              </div>

              <input
                type="range"
                min={0}
                max={1000}
                value={Math.round(sliderPos * 1000)}
                onChange={(e) => setAmount(clamp(posToAmount(Number(e.target.value) / 1000)))}
                className="iv-range mt-8"
                style={{ ["--iv-range-fill" as string]: `${sliderPos * 100}%` }}
                aria-label="Investment amount slider"
              />
              <div
                className="mt-2 flex justify-between"
                style={{ fontFamily: "var(--iv-mono)", fontSize: 11, color: "var(--iv-warmgray)" }}
              >
                <span>{fmtUSD(MIN_INVESTMENT)}</span>
                <span>{fmtUSD(MAX_INVESTMENT)}</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {QUICK_AMOUNTS.map((q) => (
                  <button
                    key={q}
                    className="iv-chip"
                    data-active={amount === q}
                    onClick={() => setAmount(q)}
                  >
                    {fmtUSD(q)}
                  </button>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7">
                <div>
                  <div className="iv-label">{CALCULATOR.outputs.shares}</div>
                  <div className="iv-num mt-1.5 text-[30px] font-semibold">
                    <AnimatedNumber
                      value={shares}
                      format={(v) => Math.round(v).toLocaleString("en-US")}
                    />
                    <span className="text-[15px]" style={{ color: "var(--iv-warmgray)" }}>
                      *
                    </span>
                  </div>
                </div>
                <div>
                  <div className="iv-label">{CALCULATOR.outputs.ownership}</div>
                  <div className="iv-num mt-1.5 text-[30px] font-semibold">
                    <AnimatedNumber value={ownership} format={(v) => fmtPct(Math.max(0, v))} />
                    <span className="text-[15px]" style={{ color: "var(--iv-warmgray)" }}>
                      *
                    </span>
                  </div>
                </div>
                <div>
                  <div className="iv-label">{CALCULATOR.outputs.security}</div>
                  <div className="mt-1.5 text-[15px] font-medium">{SECURITY_TYPE_SHORT}</div>
                </div>
                <div>
                  <div className="iv-label">{CALCULATOR.outputs.participation}</div>
                  <div className="mt-1.5 text-[13.5px] leading-snug" style={{ color: "var(--iv-steel)" }}>
                    {CALCULATOR.participationNote}
                  </div>
                </div>
              </div>

              <a href={CTA.continueHref} className="iv-btn iv-btn-primary mt-10 w-full sm:w-auto">
                Continue with {fmtUSD(amount)}
                <ArrowRight size={17} strokeWidth={2.2} />
              </a>
            </div>

            {/* ---- right: equity ring ---- */}
            <div
              className="relative flex flex-col items-center justify-center gap-6 p-10"
              style={{
                background:
                  "linear-gradient(160deg, rgba(232,238,246,0.75), rgba(237,235,228,0.85))",
                borderLeft: "1px solid var(--iv-border-soft)",
              }}
            >
              <div className="absolute inset-0 opacity-[0.16]">
                <GeneratedSectionImage
                  id="ownership-abstract"
                  sizes="640px"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="relative">
                <svg width="300" height="300" viewBox="0 0 300 300" role="img" aria-label="Estimated ownership visualization">
                  {/* decorative concentric rings */}
                  <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(20,20,20,0.05)" strokeWidth="1" />
                  <circle cx="150" cy="150" r="96" fill="none" stroke="rgba(20,20,20,0.05)" strokeWidth="1" />
                  {/* the company */}
                  <circle
                    cx="150" cy="150" r={R} fill="none"
                    stroke="rgba(20,20,20,0.1)" strokeWidth="10"
                  />
                  {/* the user's slice */}
                  <motion.circle
                    cx="150" cy="150" r={R} fill="none"
                    stroke="url(#ivGold)" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={CIRC}
                    animate={{ strokeDashoffset: CIRC * (1 - visFrac) }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    transform="rotate(-90 150 150)"
                    style={{ filter: "drop-shadow(0 0 10px rgba(200,169,107,0.55))" }}
                  />
                  <defs>
                    <linearGradient id="ivGold" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#d8bc82" />
                      <stop offset="100%" stopColor="#a8874a" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="iv-label">Your stake</div>
                  <div className="iv-num mt-1 text-[34px] font-semibold leading-none">
                    <AnimatedNumber value={ownership} format={(v) => fmtPct(Math.max(0, v))} />
                  </div>
                  <div className="iv-num mt-2 text-[15px]" style={{ color: "var(--iv-steel)" }}>
                    <AnimatedNumber value={amount} format={(v) => fmtUSD(Math.round(v))} />
                  </div>
                </div>
              </div>

              <p
                className="relative max-w-[280px] text-center text-[11.5px] leading-relaxed"
                style={{ color: "var(--iv-warmgray)" }}
              >
                {enlarged
                  ? "Gold arc enlarged for visibility — the number shown is your actual estimated stake."
                  : "Gold arc drawn to scale."}{" "}
                *Estimates based on placeholder terms.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
