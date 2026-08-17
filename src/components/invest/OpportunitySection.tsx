"use client";

/**
 * OpportunitySection — the investment thesis told visually: traditional
 * buildout vs the PODOS modular model, anchored by the generated
 * transformation illustration.
 */

import { Minus, Check } from "lucide-react";
import { OPPORTUNITY } from "@/data/investContent";
import Reveal from "./Reveal";
import GeneratedSectionImage from "./GeneratedSectionImage";

export default function OpportunitySection() {
  return (
    <section id="opportunity" className="iv-section" style={{ background: "var(--iv-beige)" }}>
      <div className="iv-container">
        <Reveal className="max-w-3xl">
          <span className="iv-eyebrow">{OPPORTUNITY.eyebrow}</span>
          <h2 className="iv-h2 mt-5">{OPPORTUNITY.headline}</h2>
          <p className="iv-sub mt-6">{OPPORTUNITY.sub}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-14">
            <GeneratedSectionImage
              id="opportunity-network"
              sizes="(max-width: 768px) 100vw, 1200px"
              className="shadow-[0_30px_90px_-40px_rgba(26,26,26,0.3)]"
            />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* traditional */}
          <Reveal delay={0.05}>
            <div className="iv-card h-full p-8" style={{ background: "rgba(255,255,255,0.45)" }}>
              <div className="iv-label">{OPPORTUNITY.traditional.label}</div>
              <ul className="mt-6 space-y-5">
                {OPPORTUNITY.traditional.points.map((p) => (
                  <li key={p.title} className="flex gap-4">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "rgba(20,20,20,0.06)" }}
                    >
                      <Minus size={13} style={{ color: "var(--iv-warmgray)" }} />
                    </span>
                    <div>
                      <span className="font-semibold text-[15px]">{p.title}</span>
                      <span className="text-[14px]" style={{ color: "var(--iv-steel)" }}>
                        {" "}— {p.body}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* podos */}
          <Reveal delay={0.15}>
            <div
              className="iv-card iv-card-solid h-full p-8"
              style={{ borderColor: "rgba(200,169,107,0.4)" }}
            >
              <div className="iv-label" style={{ color: "var(--iv-gold-deep)" }}>
                {OPPORTUNITY.podos.label}
              </div>
              <ul className="mt-6 space-y-5">
                {OPPORTUNITY.podos.points.map((p) => (
                  <li key={p.title} className="flex gap-4">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: "linear-gradient(145deg, rgba(200,169,107,0.22), rgba(200,169,107,0.1))",
                        border: "1px solid rgba(200,169,107,0.35)",
                      }}
                    >
                      <Check size={13} strokeWidth={2.5} style={{ color: "var(--iv-gold-deep)" }} />
                    </span>
                    <div>
                      <span className="font-semibold text-[15px]">{p.title}</span>
                      <span className="text-[14px]" style={{ color: "var(--iv-steel)" }}>
                        {" "}— {p.body}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
