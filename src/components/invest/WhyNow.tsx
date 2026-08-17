"use client";

/**
 * WhyNow — four stat-driven statement cards: the market timing argument.
 */

import { TrendingUp, Zap, Timer, Boxes } from "lucide-react";
import { WHY_NOW } from "@/data/investContent";
import Reveal from "./Reveal";

const ICONS = { TrendingUp, Zap, Timer, Boxes } as const;

export default function WhyNow() {
  return (
    <section id="why-now" className="iv-section">
      <div className="iv-container">
        <Reveal>
          <span className="iv-eyebrow">{WHY_NOW.eyebrow}</span>
          <h2 className="iv-h2 mt-5 max-w-xl">{WHY_NOW.headline}</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_NOW.cards.map((card, i) => {
            const Icon = ICONS[card.icon as keyof typeof ICONS];
            return (
              <Reveal key={card.title} delay={i * 0.09}>
                <div className="iv-card iv-card-hover flex h-full flex-col p-7">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      background: "linear-gradient(145deg, rgba(200,169,107,0.14), rgba(202,214,232,0.3))",
                      border: "1px solid rgba(200,169,107,0.25)",
                    }}
                  >
                    <Icon size={20} strokeWidth={1.8} style={{ color: "var(--iv-gold-deep)" }} />
                  </div>

                  <div className="iv-num mt-7 text-[42px] font-semibold leading-none">{card.stat}</div>
                  <div className="iv-label mt-2 leading-relaxed normal-case tracking-normal">
                    {card.statLabel}
                  </div>

                  <div className="iv-divider my-5" />

                  <h3 className="text-[16.5px] font-semibold">{card.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                    {card.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
