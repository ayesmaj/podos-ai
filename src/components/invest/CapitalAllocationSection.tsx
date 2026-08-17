"use client";

/**
 * CapitalAllocationSection — where the money goes: six elegant cards
 * around the generated build montage.
 */

import { Cpu, Truck, Factory, PlugZap, Settings2, Rocket } from "lucide-react";
import { ALLOCATION } from "@/data/investContent";
import Reveal from "./Reveal";
import GeneratedSectionImage from "./GeneratedSectionImage";

const ICONS = { Cpu, Truck, Factory, PlugZap, Settings2, Rocket } as const;

export default function CapitalAllocationSection() {
  return (
    <section id="allocation" className="iv-section" style={{ background: "var(--iv-beige)" }}>
      <div className="iv-container">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.9fr]">
          <Reveal>
            <span className="iv-eyebrow">{ALLOCATION.eyebrow}</span>
            <h2 className="iv-h2 mt-5">{ALLOCATION.headline}</h2>
            <p className="iv-sub mt-6">{ALLOCATION.sub}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <GeneratedSectionImage
              id="capital-allocation"
              sizes="(max-width: 1024px) 100vw, 540px"
              className="shadow-[0_24px_70px_-32px_rgba(26,26,26,0.3)]"
            />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALLOCATION.items.map((item, i) => {
            const Icon = ICONS[item.icon as keyof typeof ICONS];
            return (
              <Reveal key={item.title} delay={i * 0.07}>
                <div className="iv-card iv-card-hover group flex h-full items-start gap-5 p-6">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(202,214,232,0.35))",
                      border: "1px solid var(--iv-border)",
                    }}
                  >
                    <Icon size={21} strokeWidth={1.7} style={{ color: "var(--iv-gold-deep)" }} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
