"use client";

/**
 * MoneySection — the aspirational upside section. Big serif numerals,
 * responsible investor language, no promised returns.
 */

import { MONEY } from "@/data/investContent";
import Reveal from "./Reveal";

export default function MoneySection() {
  return (
    <section className="iv-section relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 0%, rgba(200,169,107,0.1), transparent 70%)",
        }}
      />
      <div className="iv-container relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="iv-eyebrow">{MONEY.eyebrow}</span>
          <h2 className="iv-h2 mt-5">{MONEY.headline}</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MONEY.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.09}>
              <div className="iv-card iv-card-hover flex h-full flex-col p-7 text-center">
                <div
                  className="iv-num text-[44px] font-semibold leading-none"
                  style={{
                    background:
                      "linear-gradient(160deg, var(--iv-ink) 30%, var(--iv-gold-deep))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {card.big}
                </div>
                <h3 className="mt-4 text-[15.5px] font-semibold">{card.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                  {card.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p
            className="mx-auto mt-12 max-w-2xl text-center text-[13px] leading-relaxed"
            style={{ color: "var(--iv-warmgray)" }}
          >
            {MONEY.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
