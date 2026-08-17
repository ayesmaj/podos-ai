"use client";

/**
 * FinalCTA — the closing conversion moment: generated aspirational
 * visual behind a centered glass card with the two final actions.
 */

import { ArrowRight } from "lucide-react";
import { FINAL_CTA, CTA, MIN_INVESTMENT, fmtUSD } from "@/data/investContent";
import Reveal from "./Reveal";
import GeneratedSectionImage from "./GeneratedSectionImage";

export default function FinalCTA() {
  return (
    <section className="iv-section">
      <div className="iv-container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px]">
            <div className="absolute inset-0">
              <GeneratedSectionImage
                id="final-cta"
                sizes="1200px"
                className="h-full w-full !rounded-none object-cover"
              />
              {/* dark scrim keeps text ≥4.5:1 over the navy brand imagery */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(2,5,12,0.45), rgba(2,5,12,0.8) 75%)",
                }}
              />
            </div>

            <div className="relative mx-auto max-w-2xl px-6 py-20 text-center md:py-28">
              <h2 className="iv-h2" style={{ color: "#f7f9fc" }}>
                {FINAL_CTA.headline}
              </h2>
              <p className="iv-sub mx-auto mt-6" style={{ color: "rgba(237,242,248,0.82)" }}>
                {FINAL_CTA.sub}
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a href={CTA.continueHref} className="iv-btn iv-btn-light">
                  {FINAL_CTA.primary}
                  <ArrowRight size={17} strokeWidth={2.2} />
                </a>
                <a
                  href={CTA.talkToTeamHref}
                  className="iv-btn"
                  style={{
                    color: "#f7f9fc",
                    background: "rgba(255,255,255,0.09)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {FINAL_CTA.secondary}
                </a>
              </div>

              <p
                className="mt-8 text-[12px]"
                style={{ fontFamily: "var(--iv-mono)", color: "rgba(237,242,248,0.65)" }}
              >
                Entry from {fmtUSD(MIN_INVESTMENT)} · {CTA.email} · {CTA.phone}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
