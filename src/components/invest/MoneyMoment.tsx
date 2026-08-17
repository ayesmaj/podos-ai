"use client";

/**
 * MoneyMoment — one extremely clean typographic beat on warm white.
 * No image, no card, no icon. The most memorable frame on the page.
 */

import { MONEY_MOMENT } from "@/data/investContent";
import GeneratedSectionImage from "./GeneratedSectionImage";
import Reveal from "./Reveal";

export default function MoneyMoment() {
  return (
    <section
      className="iv-section relative overflow-hidden"
      style={{ paddingBlock: "clamp(90px, 11vw, 150px)" }}
    >
      {/* quiet architectural light backdrop — near-white so the dark
          typography keeps full contrast; ivory wash as a safety layer */}
      <div className="absolute inset-0" aria-hidden>
        <GeneratedSectionImage id="money-backdrop" fill label={false} sizes="100vw" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(247,246,242,0.92), rgba(247,246,242,0.45) 45%, rgba(247,246,242,0.92))",
          }}
        />
      </div>
      <div className="iv-container relative text-center">
        <Reveal>
          <p
            className="mx-auto max-w-3xl font-semibold tracking-tight"
            style={{ fontSize: "clamp(1.3rem, 2.6vw, 2rem)", lineHeight: 1.25, color: "var(--iv-steel)" }}
          >
            {MONEY_MOMENT.lines[0]}
            <br />
            {MONEY_MOMENT.lines[1]}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="iv-display mx-auto mt-8 max-w-5xl">
            {MONEY_MOMENT.emphasis[0]}
            <br />
            <span style={{ color: "var(--iv-gold-deep)" }}>{MONEY_MOMENT.emphasis[1]}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="iv-rule-gold mx-auto mt-8 w-24" />
          <p className="mt-8 text-[17px] font-semibold">{MONEY_MOMENT.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}
