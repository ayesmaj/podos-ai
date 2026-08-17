"use client";

/**
 * ProductAnatomy — interactive cutaway: the anatomy render stays pinned on
 * the left while the eight integrated systems highlight one at a time as
 * the user scrolls the list. Labels live in the UI, not the image.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ANATOMY } from "@/data/investContent";
import GeneratedSectionImage from "./GeneratedSectionImage";
import Reveal from "./Reveal";

export default function ProductAnatomy() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = itemRefs.current.indexOf(e.target as HTMLLIElement);
            if (idx >= 0) setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    itemRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="anatomy" className="iv-section">
      <div className="iv-container">
        <Reveal className="max-w-3xl">
          <span className="iv-eyebrow">{ANATOMY.eyebrow}</span>
          <h2 className="iv-display-md mt-5">
            {ANATOMY.headline[0]}
            <br />
            {ANATOMY.headline[1]}
            <br />
            <span style={{ color: "var(--iv-gold-deep)" }}>{ANATOMY.headline[2]}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* pinned cutaway */}
          <div className="lg:sticky lg:top-[110px] lg:self-start">
            <GeneratedSectionImage
              id="product-anatomy"
              sizes="(max-width: 1024px) 100vw, 660px"
              labelText="ENGINEERING CONCEPT"
            />
            <div
              className="mt-4 flex items-center justify-between"
              style={{ fontFamily: "var(--iv-mono)", fontSize: 11, color: "var(--iv-steel)" }}
            >
              <span>PODOS UNIT — SYSTEM VIEW</span>
              <span className="iv-num">
                {ANATOMY.systems[active].n} / {String(ANATOMY.systems.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* scroll-highlight list */}
          <ol className="space-y-1">
            {ANATOMY.systems.map((s, i) => (
              <li
                key={s.n}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="border-b py-6 pl-5 transition-colors duration-300"
                style={{
                  borderColor: "var(--iv-border-soft)",
                  borderLeft: `2px solid ${active === i ? "var(--iv-gold)" : "transparent"}`,
                  background: active === i ? "rgba(255,255,255,0.55)" : "transparent",
                }}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="iv-num text-[13px] font-semibold"
                    style={{ color: active === i ? "var(--iv-gold-deep)" : "var(--iv-warmgray)" }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <h3
                      className="text-[17px] font-bold tracking-tight transition-colors"
                      style={{ color: active === i ? "var(--iv-ink)" : "var(--iv-steel)" }}
                    >
                      {s.title}
                    </h3>
                    <motion.p
                      className="mt-1.5 text-[14px] leading-relaxed"
                      style={{ color: "var(--iv-steel)" }}
                      animate={reduced ? undefined : { opacity: active === i ? 1 : 0.55 }}
                      transition={{ duration: 0.3 }}
                    >
                      {s.body}
                    </motion.p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
