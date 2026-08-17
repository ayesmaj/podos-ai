"use client";

/**
 * InvestmentSteps — how to invest: four steps on a horizontal
 * gold-threaded timeline (stacks vertically on mobile).
 */

import { STEPS } from "@/data/investContent";
import Reveal from "./Reveal";

export default function InvestmentSteps() {
  return (
    <section id="steps" className="iv-section" style={{ background: "var(--iv-beige)" }}>
      <div className="iv-container">
        <Reveal className="text-center">
          <span className="iv-eyebrow">{STEPS.eyebrow}</span>
          <h2 className="iv-h2 mt-5">{STEPS.headline}</h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          {/* connecting thread (desktop) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[22px] hidden h-px md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(200,169,107,0.6) 12%, rgba(200,169,107,0.6) 88%, transparent)",
            }}
          />
          {STEPS.steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <div className="relative">
                <div
                  className="iv-num relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-semibold"
                  style={{
                    background: "linear-gradient(145deg, #ffffff, #efece3)",
                    border: "1px solid rgba(200,169,107,0.55)",
                    boxShadow: "0 4px 14px -6px rgba(20,20,20,0.25), 0 0 0 6px var(--iv-beige)",
                    color: "var(--iv-gold-deep)",
                  }}
                >
                  {s.n}
                </div>
                <h3 className="mt-5 text-[16.5px] font-semibold">{s.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
