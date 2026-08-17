"use client";

/**
 * ScaleModel — 1 → 10 → 100 → 1,000 units. A scroll-progressive pull-back:
 * the unit-count and capacity math step up as the reader moves through the
 * section, over the aerial campus frame. Clearly labeled ILLUSTRATIVE
 * SCALE MODEL — it explains modular math, it does not claim deployments.
 */

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SCALE } from "@/data/investContent";
import GeneratedSectionImage from "./GeneratedSectionImage";
import Reveal from "./Reveal";

function useStep(progress: MotionValue<number>, count: number) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      setStep(Math.min(count - 1, Math.max(0, Math.floor(v * count))));
    });
    return unsub;
  }, [progress, count]);
  return step;
}

export default function ScaleModel() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.9"] });
  const step = useStep(scrollYProgress, SCALE.steps.length);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const current = SCALE.steps[reduced ? SCALE.steps.length - 1 : step];

  return (
    <section id="scale" className="iv-section">
      <div className="iv-container">
        <Reveal className="max-w-3xl">
          <span className="iv-eyebrow">{SCALE.eyebrow}</span>
          <h2 className="iv-display-md mt-5">
            {SCALE.headline[0]}
            <br />
            {SCALE.headline[1]}
          </h2>
          <p className="iv-sub mt-6">{SCALE.sub}</p>
        </Reveal>

        <div ref={ref} className="relative mt-10">
          {/* height-capped crop so header + frame + ladder fit one viewport */}
          <div className="relative h-[46svh] overflow-hidden" style={{ borderRadius: 12 }}>
            <motion.div className="absolute inset-0" style={reduced ? undefined : { scale: imgScale }}>
              <GeneratedSectionImage
                id="modular-campus"
                sizes="(max-width: 768px) 100vw, 1200px"
                label={false}
                rounded={false}
                fill
              />
            </motion.div>
            <span className="iv-concept-tag">ILLUSTRATIVE SCALE MODEL</span>

            {/* capacity readout */}
            <div
              className="absolute right-4 top-4 px-5 py-4 text-right md:right-8 md:top-8"
              style={{
                background: "rgba(247,246,242,0.9)",
                backdropFilter: "blur(12px)",
                borderTop: "2px solid var(--iv-gold)",
              }}
            >
              <div className="iv-num text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-none tracking-tight">
                {current.units.toLocaleString("en-US")}
                <span className="ml-2 text-[0.45em]" style={{ color: "var(--iv-steel)" }}>
                  {current.units === 1 ? "UNIT" : "UNITS"}
                </span>
              </div>
              <div
                className="mt-2"
                style={{ fontFamily: "var(--iv-mono)", fontSize: 12, color: "var(--iv-steel)" }}
              >
                {current.math} ={" "}
                <span className="font-semibold" style={{ color: "var(--iv-gold-deep)" }}>
                  {current.capacity}
                </span>
              </div>
            </div>
          </div>

          {/* step ladder */}
          <div className="mt-8 grid grid-cols-4 gap-px" style={{ background: "var(--iv-border)" }}>
            {SCALE.steps.map((s, i) => (
              <div
                key={s.capacity}
                className="px-3 py-4 text-center transition-colors duration-500 sm:px-5"
                style={{
                  background:
                    (reduced ? i === SCALE.steps.length - 1 : i <= step)
                      ? "var(--iv-white)"
                      : "var(--iv-bg)",
                }}
              >
                <div
                  className="iv-num text-[clamp(1.1rem,2.6vw,1.8rem)] font-extrabold tracking-tight"
                  style={{
                    color:
                      (reduced ? i === SCALE.steps.length - 1 : i <= step)
                        ? "var(--iv-ink)"
                        : "var(--iv-warmgray)",
                  }}
                >
                  {s.capacity}
                </div>
                <div
                  style={{
                    fontFamily: "var(--iv-mono)",
                    fontSize: "clamp(8.5px, 1vw, 10.5px)",
                    letterSpacing: "0.1em",
                    color: "var(--iv-warmgray)",
                  }}
                >
                  {s.math}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[11.5px]" style={{ color: "var(--iv-warmgray)" }}>
            {SCALE.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
