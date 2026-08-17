"use client";

/**
 * CapitalCycle — the scale-economics story: a circular CAPITAL →
 * MANUFACTURING → POD → DEPLOYMENT → CAPACITY → CUSTOMER loop (SVG,
 * traced on scroll) beside the capital-to-capacity editorial image, and
 * the planned use-of-capital categories WITHOUT invented percentages.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CAPITAL } from "@/data/investContent";
import GeneratedSectionImage from "./GeneratedSectionImage";
import Reveal from "./Reveal";

const R = 150;
const CX = 210;
const CY = 210;

export default function CapitalCycle() {
  const ringRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ringRef, { once: true, amount: 0.4 });
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

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          {/* the cycle */}
          <Reveal>
            <div ref={ringRef} className="mx-auto max-w-[420px]">
              <svg viewBox="0 0 420 420" role="img" aria-label="Capital to capacity cycle">
                <motion.circle
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke="var(--iv-gold)"
                  strokeWidth="1.5"
                  strokeDasharray={2 * Math.PI * R}
                  initial={{ strokeDashoffset: 2 * Math.PI * R }}
                  animate={inView ? { strokeDashoffset: 0 } : {}}
                  transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
                  transform={`rotate(-90 ${CX} ${CY})`}
                />
                {/* direction arrow */}
                <motion.path
                  d={`M ${CX + R - 6} ${CY - 10} l 7 10 l -12 3`}
                  fill="none"
                  stroke="var(--iv-gold-deep)"
                  strokeWidth="1.5"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 2, duration: 0.5 }}
                />
                {CAPITAL.cycle.map((label, i) => {
                  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
                  const x = CX + Math.cos(a) * R;
                  const y = CY + Math.sin(a) * R;
                  const lx = CX + Math.cos(a) * (R + 34);
                  const ly = CY + Math.sin(a) * (R + 34);
                  return (
                    <motion.g
                      key={label}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.3 + (i / n) * 1.8, duration: 0.45 }}
                    >
                      <circle cx={x} cy={y} r="5" fill="var(--iv-bg)" stroke="var(--iv-gold-deep)" strokeWidth="1.5" />
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fontFamily: "var(--iv-mono)",
                          fontSize: 10.5,
                          letterSpacing: "0.1em",
                          fill: "var(--iv-ink)",
                        }}
                      >
                        {label}
                      </text>
                    </motion.g>
                  );
                })}
                <motion.text
                  x={CX}
                  y={CY - 8}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--iv-mono)", fontSize: 11, letterSpacing: "0.2em", fill: "var(--iv-gold-deep)" }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 2.2, duration: 0.6 }}
                >
                  REPEAT
                </motion.text>
                <motion.text
                  x={CX}
                  y={CY + 12}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--iv-mono)", fontSize: 9.5, fill: "var(--iv-steel)" }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 2.4, duration: 0.6 }}
                >
                  EVERY CYCLE FUNDS THE NEXT UNIT
                </motion.text>
              </svg>
              <p className="mt-2 text-center text-[13px]" style={{ color: "var(--iv-steel)" }}>
                {CAPITAL.cycleNote}
              </p>
            </div>
          </Reveal>

          {/* capital → capacity editorial image */}
          <Reveal delay={0.12}>
            <GeneratedSectionImage
              id="capital-capacity"
              sizes="(max-width: 1024px) 100vw, 580px"
            />
          </Reveal>
        </div>

        {/* use of capital — categories only, no invented percentages */}
        <Reveal delay={0.1}>
          <div className="mt-16">
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
