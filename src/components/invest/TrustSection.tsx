"use client";

/**
 * TrustSection — credibility: strategy pillars, founder statement,
 * and an FAQ accordion.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { TRUST } from "@/data/investContent";
import Reveal from "./Reveal";

export default function TrustSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="iv-section">
      <div className="iv-container">
        <Reveal className="max-w-3xl">
          <span className="iv-eyebrow">{TRUST.eyebrow}</span>
          <h2 className="iv-h2 mt-5">{TRUST.headline}</h2>
        </Reveal>

        {/* pillars */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TRUST.pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.09}>
              <div className="h-full border-l pl-6" style={{ borderColor: "rgba(200,169,107,0.45)" }}>
                <h3 className="font-semibold text-[17px]">{p.title}</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* founder quote */}
        <Reveal delay={0.1}>
          <figure
            className="iv-card iv-card-solid mx-auto mt-16 max-w-3xl p-10 text-center"
            style={{ borderColor: "rgba(200,169,107,0.3)" }}
          >
            <blockquote
              className="text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug"
              style={{ fontFamily: "var(--iv-serif)", fontWeight: 500 }}
            >
              &ldquo;{TRUST.founderQuote.text}&rdquo;
            </blockquote>
            <figcaption className="iv-label mt-6">
              {TRUST.founderQuote.name} · {TRUST.founderQuote.role}
            </figcaption>
          </figure>
        </Reveal>

        {/* FAQ */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-16 max-w-3xl">
            <div className="iv-label mb-4">Frequently asked</div>
            {TRUST.faq.map((item, i) => (
              <div key={item.q} className="iv-faq-item">
                <button
                  className="iv-faq-q"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
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
                      <p
                        className="px-1 pb-6 text-[14.5px] leading-relaxed"
                        style={{ color: "var(--iv-steel)" }}
                      >
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
