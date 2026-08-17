"use client";

/**
 * OpportunitySection (V3) — the deployment-model split: traditional
 * construction vs PODOS as two precision timelines readable in three
 * seconds. Minimal words, hairlines, no icon soup. The traditional side
 * carries the construction aerial; the PODOS side rides on manufacturing.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { OPPORTUNITY } from "@/data/investContent";
import GeneratedSectionImage from "./GeneratedSectionImage";
import Reveal from "./Reveal";

function Timeline({
  label,
  duration,
  durationNote,
  steps,
  gold,
  delay,
}: {
  label: string;
  duration: string;
  durationNote: string;
  steps: string[];
  gold: boolean;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="iv-label">{label}</span>
        <span className="text-right">
          <span
            className="iv-num text-[26px] font-extrabold tracking-tight"
            style={{ color: gold ? "var(--iv-gold-deep)" : "var(--iv-ink)" }}
          >
            {duration}
          </span>
          <span className="iv-claim-chip ml-3 align-middle">{durationNote.toUpperCase()}</span>
        </span>
      </div>

      <div className="relative mt-6 h-px" style={{ background: "var(--iv-border)" }}>
        <motion.i
          className="absolute inset-0 block"
          style={{
            background: gold ? "var(--iv-gold)" : "var(--iv-silver)",
            transformOrigin: "left",
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: gold ? 0.9 : 2.4, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <ol className="mt-4 flex justify-between">
        {steps.map((s, i) => (
          <motion.li
            key={s}
            className="flex flex-col items-start gap-1.5"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: delay + i * (gold ? 0.14 : 0.4), duration: 0.4 }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: gold ? "var(--iv-gold)" : "var(--iv-silver)" }}
            />
            <span
              style={{
                fontFamily: "var(--iv-mono)",
                fontSize: "clamp(8.5px, 1.1vw, 11px)",
                letterSpacing: "0.1em",
                color: "var(--iv-steel)",
              }}
            >
              {s}
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export default function OpportunitySection() {
  return (
    <section id="opportunity" className="iv-section" style={{ background: "var(--iv-white)" }}>
      <div className="iv-container">
        <Reveal className="max-w-3xl">
          <span className="iv-eyebrow">{OPPORTUNITY.eyebrow}</span>
          <h2 className="iv-display-md mt-5">
            {OPPORTUNITY.headline[0]}
            <br />
            {OPPORTUNITY.headline[1]}
          </h2>
        </Reveal>

        <div className="mt-9 grid gap-14 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <GeneratedSectionImage
              id="traditional-construction"
              sizes="(max-width: 1024px) 100vw, 580px"
              labelText="ILLUSTRATIVE"
            />
            <div className="mt-8">
              <Timeline
                label={OPPORTUNITY.traditional.label.toUpperCase()}
                duration={OPPORTUNITY.traditional.duration}
                durationNote={OPPORTUNITY.traditional.durationNote}
                steps={OPPORTUNITY.traditional.steps}
                gold={false}
                delay={0.2}
              />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <GeneratedSectionImage
              id="factory-line"
              sizes="(max-width: 1024px) 100vw, 580px"
            />
            <div className="mt-8">
              <Timeline
                label={OPPORTUNITY.podos.label.toUpperCase()}
                duration={OPPORTUNITY.podos.duration}
                durationNote={OPPORTUNITY.podos.durationNote}
                steps={OPPORTUNITY.podos.steps}
                gold
                delay={0.35}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
