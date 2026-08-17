"use client";

/**
 * MoneyMoment — one extremely clean typographic beat on warm white.
 * No image, no card, no icon. The most memorable frame on the page.
 */

import { MONEY_MOMENT } from "@/data/investContent";
import Reveal from "./Reveal";

export default function MoneyMoment() {
  return (
    <section className="iv-section" style={{ paddingBlock: "clamp(110px, 16vw, 220px)" }}>
      <div className="iv-container text-center">
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
          <div className="iv-rule-gold mx-auto mt-12 w-24" />
          <p className="mt-8 text-[17px] font-semibold">{MONEY_MOMENT.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}
