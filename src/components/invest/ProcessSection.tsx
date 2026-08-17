"use client";

/**
 * ProcessSection — DISCOVER / REVIEW / VERIFY / INVEST on a single
 * elegant horizontal line that traces as it scrolls into view, followed
 * by the FAQ (risk & offering information) accordion.
 */

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { PROCESS, FAQ } from "@/data/investContent";
import { offering } from "@/data/investOffering";
import Reveal from "./Reveal";

export default function ProcessSection() {
  const [open, setOpen] = useState<number | null>(0);
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(lineRef, { once: true, amount: 0.5 });

  return (
    <section id="faq" className="iv-section" style={{ background: "var(--iv-beige)" }}>
      <div className="iv-container">
        <Reveal className="text-center">
          <span className="iv-eyebrow">{PROCESS.eyebrow}</span>
          <h2 className="iv-display-md mt-5">{PROCESS.headline}</h2>
        </Reveal>

        <div ref={lineRef} className="relative mt-10 grid gap-10 md:grid-cols-4 md:gap-6">
          <div className="iv-process-line hidden md:block">
            <motion.i
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {PROCESS.steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <div className="relative">
                <div
                  className="iv-num relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-[14px] font-bold"
                  style={{
                    background: "var(--iv-bg)",
                    border: "1px solid var(--iv-gold)",
                    color: "var(--iv-gold-deep)",
                    boxShadow: "0 0 0 6px var(--iv-beige)",
                  }}
                >
                  {s.n}
                </div>
                <h3 className="mt-5 text-[16px] font-extrabold tracking-[0.06em]">{s.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                  {i === 3 && offering.portalURL ? (
                    <>
                      {s.body}{" "}
                      <a href={offering.portalURL} className="font-semibold underline">
                        Open the portal →
                      </a>
                    </>
                  ) : (
                    s.body
                  )}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* FAQ / risk & offering information */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-8 max-w-3xl">
            <div className="iv-label mb-4">Risk &amp; offering information</div>
            {FAQ.map((item, i) => (
              <div key={item.q} className="iv-faq-item">
                <button className="iv-faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                  {item.q}
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0"
                    style={{ color: "var(--iv-gold-deep)" }}
                  >
                    <Plus size={18} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-1 pb-6 text-[14.5px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
