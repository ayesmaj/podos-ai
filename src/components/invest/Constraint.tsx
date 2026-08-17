"use client";

/**
 * Constraint (replaces WhyNow) — a financial-editorial composition:
 * massive statement heading, then huge asynchronously-placed figures with
 * claim-status chips (industry estimate vs PODOS target) instead of four
 * equal cards. Data + status come from the claims registry.
 */

import { CONSTRAINT } from "@/data/investContent";
import { approvedClaims } from "@/data/investOffering";
import Reveal from "./Reveal";

const OFFSETS = ["lg:mt-0", "lg:mt-20", "lg:mt-8", "lg:mt-28"];

export default function Constraint() {
  const stats = approvedClaims();

  return (
    <section id="constraint" className="iv-section">
      <div className="iv-container">
        <Reveal>
          <span className="iv-eyebrow">{CONSTRAINT.eyebrow}</span>
          <h2 className="iv-display mt-6 max-w-4xl">
            {CONSTRAINT.headline[0]}
            <br />
            <span style={{ color: "var(--iv-steel)" }}>{CONSTRAINT.headline[1]}</span>
            <br />
            {CONSTRAINT.headline[2]}
          </h2>
          <p className="iv-sub mt-7">{CONSTRAINT.sub}</p>
        </Reveal>

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.1} className={OFFSETS[i % OFFSETS.length]}>
              <div className="border-t pt-5" style={{ borderColor: "var(--iv-ink)" }}>
                <div className="flex items-baseline gap-2">
                  <span className="iv-num text-[clamp(3.4rem,6vw,5.2rem)] font-extrabold leading-none tracking-tight">
                    {c.value}
                  </span>
                  {c.unit && (
                    <span
                      className="iv-num text-[clamp(1.2rem,2vw,1.7rem)] font-bold"
                      style={{ color: "var(--iv-gold-deep)" }}
                    >
                      {c.unit}
                    </span>
                  )}
                </div>
                <div className="iv-label mt-3">{c.label}</div>
                <p className="mt-2.5 text-[13.5px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                  {c.description}
                </p>
                <span className={`iv-claim-chip mt-4 ${c.internalTarget ? "iv-claim-chip--target" : ""}`}>
                  {c.internalTarget ? "PODOS TARGET" : (c.sourceLabel ?? "ESTIMATE").toUpperCase()}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
