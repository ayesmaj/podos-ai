"use client";

/**
 * OwnershipCalculator (V3) — "YOUR PIECE OF PODOS".
 *
 * Two hard modes, decided by the offering config (never by JSX):
 *   EXPLORATION (offering.termsApproved !== true) — amount exploration
 *     only. No securities, prices, or ownership numbers are shown or
 *     implied; the ring is labeled an exploration view and the CTA points
 *     at official offering documents.
 *   LIVE — real terms exist: securities + ownership math, with an
 *     ACTUAL SCALE / MAGNIFIED VIEW toggle so tiny slices are never
 *     geometrically inflated without saying so.
 *
 * Motion is precise and silent (350–700ms), no casino effects.
 */

import { animate, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  OWNERSHIP,
  CTA,
  MIN_INVESTMENT,
  MAX_INVESTMENT,
  QUICK_AMOUNTS,
  fmtUSD,
  fmtPct,
} from "@/data/investContent";
import { offering, termsLive } from "@/data/investOffering";
import Reveal from "./Reveal";

const LOG_MIN = Math.log(MIN_INVESTMENT);
const LOG_MAX = Math.log(MAX_INVESTMENT);
const posToAmount = (p: number) =>
  Math.round(Math.exp(LOG_MIN + (LOG_MAX - LOG_MIN) * p) / 100) * 100;
const amountToPos = (a: number) =>
  (Math.log(Math.max(MIN_INVESTMENT, a)) - LOG_MIN) / (LOG_MAX - LOG_MIN);

const R = 128;
const CIRC = 2 * Math.PI * R;

function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  useLayoutEffect(() => {
    const controls = animate(shown.current, value, {
      duration: 0.55,
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
  const [amount, setAmount] = useState(25_000);
  const [view, setView] = useState<"actual" | "magnified">("magnified");
  const reduced = useReducedMotion();
  const live = termsLive();

  const clamp = (n: number) => Math.min(MAX_INVESTMENT, Math.max(MIN_INVESTMENT, n));
  const sliderPos = useMemo(() => amountToPos(amount), [amount]);

  /* live-mode math — only meaningful when real terms exist */
  const securities = live ? Math.floor(amount / (offering.pricePerSecurity ?? 1)) : 0;
  const ownershipPct = live ? (securities / (offering.fullyDilutedShares ?? 1)) * 100 : 0;

  /* ring fraction:
     exploration → position within the exploration range (labeled as such)
     live actual → true ownership fraction
     live magnified → floored at 3% of the ring, labeled magnified */
  const trueFrac = live ? ownershipPct / 100 : sliderPos;
  const frac = live && view === "magnified" ? Math.max(trueFrac, 0.03) : trueFrac;

  const onInput = (raw: string) => {
    const digits = Number(raw.replace(/[^0-9]/g, ""));
    if (!Number.isNaN(digits)) setAmount(Math.min(MAX_INVESTMENT, Math.max(0, digits)));
  };

  return (
    <section id="calculator" className="iv-section" style={{ background: "var(--iv-white)" }}>
      <div className="iv-container">
        {/* earned transition */}
        <Reveal className="mx-auto max-w-4xl text-center">
          <h2 className="iv-display-md">
            {OWNERSHIP.transition[0]}
            <br />
            {OWNERSHIP.transition[1]}
            <br />
            <span style={{ color: "var(--iv-gold-deep)" }}>
              {OWNERSHIP.transition[2]} {OWNERSHIP.transition[3]}
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 grid gap-14 lg:grid-cols-2 lg:gap-10">
            {/* ---- controls ---- */}
            <div>
              <span className="iv-eyebrow">{OWNERSHIP.eyebrow}</span>
              <h3 className="mt-4 text-[24px] font-extrabold tracking-tight">{OWNERSHIP.headline}</h3>
              <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                {OWNERSHIP.sub}
              </p>

              <label className="iv-label mt-9 block" htmlFor="iv-amount">
                {OWNERSHIP.outputs.investment}
              </label>
              <div className="mt-2 flex items-center gap-1 border-b pb-3" style={{ borderColor: "var(--iv-ink)" }}>
                <span className="iv-num text-[clamp(1.9rem,3.2vw,2.5rem)] font-bold" style={{ color: "var(--iv-warmgray)" }}>
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
                className="iv-range mt-7"
                style={{ ["--iv-range-fill" as string]: `${sliderPos * 100}%` }}
                aria-label="Investment amount slider"
              />
              <div className="mt-2 flex justify-between" style={{ fontFamily: "var(--iv-mono)", fontSize: 11, color: "var(--iv-warmgray)" }}>
                <span>{fmtUSD(MIN_INVESTMENT)}</span>
                <span>{fmtUSD(MAX_INVESTMENT)}</span>
              </div>

              <div className="-mx-1 mt-5 flex gap-2.5 overflow-x-auto px-1 pb-1">
                {QUICK_AMOUNTS.map((q) => (
                  <button key={q} className="iv-chip shrink-0" data-active={amount === q} onClick={() => setAmount(q)}>
                    {fmtUSD(q)}
                  </button>
                ))}
              </div>

              {live ? (
                <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <div className="iv-label">{OWNERSHIP.outputs.investment}</div>
                    <div className="iv-num mt-1 text-[28px] font-bold">
                      <AnimatedNumber value={amount} format={(v) => fmtUSD(Math.round(v))} />
                    </div>
                  </div>
                  <div>
                    <div className="iv-label">{OWNERSHIP.outputs.securities}</div>
                    <div className="iv-num mt-1 text-[28px] font-bold">
                      <AnimatedNumber value={securities} format={(v) => Math.round(v).toLocaleString("en-US")} />
                    </div>
                  </div>
                  <div>
                    <div className="iv-label">{OWNERSHIP.outputs.ownership}</div>
                    <div className="iv-num mt-1 text-[28px] font-bold">
                      <AnimatedNumber value={ownershipPct} format={(v) => fmtPct(Math.max(0, v))} />
                    </div>
                  </div>
                  <div className="self-end">
                    {offering.portalURL && (
                      <a href={offering.portalURL} className="iv-btn iv-btn-primary w-full">
                        Continue to the offering
                        <ArrowRight size={16} strokeWidth={2.2} />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-10 border-l-2 pl-5" style={{ borderColor: "var(--iv-gold)" }}>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                    {OWNERSHIP.demoNotice}
                  </p>
                  <a href={CTA.documentsHref} className="iv-btn iv-btn-primary mt-5">
                    {OWNERSHIP.demoCta}
                    <ArrowRight size={16} strokeWidth={2.2} />
                  </a>
                </div>
              )}
            </div>

            {/* ---- YOUR PIECE OF PODOS ---- */}
            <div className="flex flex-col items-center justify-center">
              {live && (
                <div className="mb-6 flex gap-px" style={{ background: "var(--iv-border)" }} role="tablist">
                  {(["actual", "magnified"] as const).map((v) => (
                    <button
                      key={v}
                      role="tab"
                      aria-selected={view === v}
                      onClick={() => setView(v)}
                      className="px-5 py-2.5 text-[11.5px] font-semibold tracking-[0.1em]"
                      style={{
                        fontFamily: "var(--iv-mono)",
                        background: view === v ? "var(--iv-ink)" : "var(--iv-white)",
                        color: view === v ? "#f5f4f0" : "var(--iv-steel)",
                        cursor: "pointer",
                      }}
                    >
                      {v === "actual" ? OWNERSHIP.viewActual.toUpperCase() : OWNERSHIP.viewMagnified.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <svg width="320" height="320" viewBox="0 0 320 320" role="img" aria-label="Participation visualization">
                  <defs>
                    <linearGradient id="ivTitanium" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#e8e9ec" />
                      <stop offset="45%" stopColor="#c9cdd2" />
                      <stop offset="100%" stopColor="#f2f3f5" />
                    </linearGradient>
                    <linearGradient id="ivChampagne" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#d3ba85" />
                      <stop offset="100%" stopColor="#8a6f3c" />
                    </linearGradient>
                  </defs>
                  {/* optical-glass outer rim */}
                  <circle cx="160" cy="160" r="152" fill="none" stroke="rgba(23,25,27,0.06)" strokeWidth="1" />
                  {/* brushed titanium body ring */}
                  <circle cx="160" cy="160" r={R} fill="none" stroke="url(#ivTitanium)" strokeWidth="16" />
                  {/* black inset detail */}
                  <circle cx="160" cy="160" r={R - 14} fill="none" stroke="var(--iv-ink)" strokeWidth="1.5" opacity="0.5" />
                  {/* the user's piece — restrained gold only */}
                  <motion.circle
                    cx="160"
                    cy="160"
                    r={R}
                    fill="none"
                    stroke="url(#ivChampagne)"
                    strokeWidth="16"
                    strokeDasharray={CIRC}
                    animate={{ strokeDashoffset: CIRC * (1 - Math.max(0.0015, frac)) }}
                    transition={reduced ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    transform="rotate(-90 160 160)"
                  />
                  <circle cx="160" cy="160" r={R - 30} fill="var(--iv-bg)" stroke="var(--iv-border)" strokeWidth="1" />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="iv-label">{live ? "Your stake" : "Exploring"}</div>
                  <div className="iv-num mt-1 text-[32px] font-extrabold leading-none tracking-tight">
                    {live ? (
                      <AnimatedNumber value={ownershipPct} format={(v) => fmtPct(Math.max(0, v))} />
                    ) : (
                      <AnimatedNumber value={amount} format={(v) => fmtUSD(Math.round(v))} />
                    )}
                  </div>
                  {live && (
                    <div className="iv-num mt-2 text-[14px]" style={{ color: "var(--iv-steel)" }}>
                      <AnimatedNumber value={amount} format={(v) => fmtUSD(Math.round(v))} />
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-5 max-w-[300px] text-center text-[11.5px] leading-relaxed" style={{ color: "var(--iv-warmgray)" }}>
                {live
                  ? view === "magnified" && frac > trueFrac
                    ? OWNERSHIP.magnifiedNote
                    : "Drawn to actual scale."
                  : "Exploration view — the gold arc reflects your position within the exploration range, not ownership."}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
