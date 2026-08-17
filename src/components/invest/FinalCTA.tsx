"use client";

/**
 * FinalCTA (V3) — bright and monumental: the sunrise portal frame,
 * full-bleed, with a light legibility wash and dark editorial type.
 * No dark fleet, no scrim of doom.
 */

import { ArrowRight } from "lucide-react";
import { FINAL_CTA, CTA } from "@/data/investContent";
import { offering, termsLive } from "@/data/investOffering";
import GeneratedSectionImage from "./GeneratedSectionImage";
import Reveal from "./Reveal";

export default function FinalCTA() {
  const live = termsLive();
  const primaryHref = live && offering.portalURL ? offering.portalURL : CTA.accessHref;
  const primaryLabel = live ? FINAL_CTA.primaryLive : FINAL_CTA.primary;

  return (
    <section id="access" className="relative overflow-hidden">
      <div className="relative min-h-[86svh]">
        <GeneratedSectionImage id="final-vision" fill label={false} sizes="100vw" />
        {/* bright wash for dark-type legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(247,246,242,0.88) 0%, rgba(247,246,242,0.55) 34%, rgba(247,246,242,0.12) 65%, rgba(247,246,242,0.55) 100%)",
          }}
        />
        <div className="iv-container relative flex min-h-[86svh] flex-col items-center justify-center py-24 text-center">
          <Reveal>
            <h2 className="iv-display max-w-4xl">
              {FINAL_CTA.headline[0]}
              <br />
              {FINAL_CTA.headline[1]}
              <br />
              <span style={{ color: "var(--iv-gold-deep)" }}>{FINAL_CTA.headline[2]}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href={primaryHref} className="iv-btn iv-btn-primary !px-9 !py-[18px] !text-[15.5px]">
                {primaryLabel}
                <ArrowRight size={18} strokeWidth={2.2} />
              </a>
              <a href={CTA.talkToTeamHref} className="iv-btn iv-btn-ghost">
                {FINAL_CTA.secondary}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-9 max-w-md text-[12px] leading-relaxed" style={{ color: "var(--iv-steel)", fontFamily: "var(--iv-mono)" }}>
              {FINAL_CTA.note}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
