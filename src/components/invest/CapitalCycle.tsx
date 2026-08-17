"use client";

/**
 * CapitalCycle — the scale-economics story, redesigned for instant
 * legibility: a numbered left-to-right chain (CAPITAL → … → CUSTOMER)
 * with explicit arrows, and a gold return path underneath that loops
 * back to CAPITAL ("every cycle funds the next unit"). Stacks vertically
 * with down-arrows on mobile. Use-of-capital categories follow, without
 * invented percentages.
 */

import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowDown, RotateCcw } from "lucide-react";
import { useRef } from "react";
import { CAPITAL } from "@/data/investContent";
import GeneratedSectionImage from "./GeneratedSectionImage";
import Reveal from "./Reveal";

export default function CapitalCycle() {
  const flowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(flowRef, { once: true, amount: 0.5 });
  const n = CAPITAL.cycle.length;

  return (
    <section id="capital" className="iv-section" style={{ background: "var(--iv-beige)" }}>
      <div className="iv-container">
        <Reveal className="max-w-3xl">
          <span className="iv-eyebrow">{CAPITAL.eyebrow}</span>
          <h2 className="iv-display-md mt-5">
            {CAPITAL.headline[0]}
            <br />
            <span style={{ color: "var(--iv-steel)" }}>{CAPITAL.headline[1]}</span>
          </h2>
        </Reveal>

        {/* the chain */}
        <div ref={flowRef} className="mt-10">
          {/* desktop: horizontal chain */}
          <div className="hidden md:block">
            <div className="flex items-start justify-between">
              {CAPITAL.cycle.map((label, i) => (
                <div key={label} className="flex flex-1 items-start">
                  <motion.div
                    className="flex flex-col items-center gap-3 text-center"
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ minWidth: 86 }}
                  >
                    <span
                      className="iv-num flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-bold"
                      style={{
                        background: i === 0 ? "var(--iv-ink)" : "var(--iv-bg)",
                        color: i === 0 ? "#f5f4f0" : "var(--iv-ink)",
                        border: "1px solid var(--iv-border)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--iv-mono)",
                        fontSize: 11.5,
                        letterSpacing: "0.12em",
                      }}
                    >
                      {label}
                    </span>
                  </motion.div>
                  {i < n - 1 && (
                    <motion.div
                      className="mt-[14px] flex flex-1 items-center px-2"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: i * 0.18 + 0.12, duration: 0.4 }}
                    >
                      <span className="h-px flex-1" style={{ background: "var(--iv-border)" }} />
                      <ArrowRight size={14} style={{ color: "var(--iv-steel)", flexShrink: 0 }} />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* return loop: CUSTOMER back to CAPITAL */}
            <motion.div
              className="mx-[22px] mt-6 flex items-center gap-3 rounded-b-2xl border-x border-b px-6 pb-4 pt-2"
              style={{ borderColor: "var(--iv-gold)", borderTopColor: "transparent" }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: n * 0.18 + 0.2, duration: 0.6 }}
            >
              <RotateCcw size={14} style={{ color: "var(--iv-gold-deep)", flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: "var(--iv-mono)",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  color: "var(--iv-gold-deep)",
                }}
              >
                REPEAT — EVERY CYCLE FUNDS THE NEXT UNIT
              </span>
              <span className="h-px flex-1" style={{ background: "var(--iv-gold)", opacity: 0.5 }} />
            </motion.div>
          </div>

          {/* mobile: vertical chain */}
          <div className="flex flex-col items-center gap-2 md:hidden">
            {CAPITAL.cycle.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className="flex items-center gap-3 rounded-full px-5 py-2.5"
                  style={{
                    background: i === 0 ? "var(--iv-ink)" : "var(--iv-bg)",
                    color: i === 0 ? "#f5f4f0" : "var(--iv-ink)",
                    border: "1px solid var(--iv-border)",
                  }}
                >
                  <span className="iv-num text-[12px] font-bold">{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "var(--iv-mono)", fontSize: 12, letterSpacing: "0.12em" }}>
                    {label}
                  </span>
                </div>
                {i < n - 1 && <ArrowDown size={14} style={{ color: "var(--iv-steel)" }} />}
              </div>
            ))}
            <div className="mt-3 flex items-center gap-2 text-center">
              <RotateCcw size={13} style={{ color: "var(--iv-gold-deep)" }} />
              <span style={{ fontFamily: "var(--iv-mono)", fontSize: 10.5, letterSpacing: "0.14em", color: "var(--iv-gold-deep)" }}>
                REPEAT — EVERY CYCLE FUNDS THE NEXT UNIT
              </span>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-xl text-center text-[13.5px]" style={{ color: "var(--iv-steel)" }}>
            {CAPITAL.cycleNote}
          </p>
        </div>

        {/* capital → capacity editorial image — height-capped crop */}
        <Reveal delay={0.1}>
          <div className="relative mt-10 h-[32svh] overflow-hidden" style={{ borderRadius: 12 }}>
            <GeneratedSectionImage id="capital-capacity" sizes="(max-width: 768px) 100vw, 1200px" fill />
          </div>
        </Reveal>

        {/* use of capital — categories only, no invented percentages */}
        <Reveal delay={0.1}>
          <div className="mt-10">
            <div className="iv-rule" />
            <div className="grid grid-cols-2 gap-px pt-px sm:grid-cols-3 lg:grid-cols-6" style={{ background: "var(--iv-border)" }}>
              {CAPITAL.allocation.categories.map((c) => (
                <div
                  key={c}
                  className="py-6 text-center"
                  style={{
                    background: "var(--iv-beige)",
                    fontFamily: "var(--iv-mono)",
                    fontSize: 11.5,
                    letterSpacing: "0.12em",
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
            <div className="iv-rule" />
            <p className="mt-4 text-[11.5px]" style={{ color: "var(--iv-warmgray)" }}>
              {CAPITAL.allocation.note}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
