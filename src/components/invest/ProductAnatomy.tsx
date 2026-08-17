"use client";

/**
 * ProductAnatomy — interactive system tour of the cutaway render.
 *
 * As each system in the list crosses mid-viewport, the pinned "camera"
 * pushes into that system's zone of the cutaway (scale + transform-origin
 * pan) and a technical-blue callout labels it. The active list item gets
 * the same tech-blue mark. Reduced motion: static full view, list
 * highlight only.
 */

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ANATOMY } from "@/data/investContent";
import { getInvestImage } from "@/data/invest-page-images";

import Reveal from "./Reveal";

export default function ProductAnatomy() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reduced = useReducedMotion();
  const img = getInvestImage("product-anatomy");
  const sys = ANATOMY.systems[active];

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
          {/* pinned system camera */}
          <div className="lg:sticky lg:top-[110px] lg:self-start">
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: 12,
                aspectRatio: img ? `${img.width} / ${img.height}` : "3 / 2",
                background: "#f0efe9",
              }}
            >
              {img?.status === "ready" && (
                <motion.div
                  className="absolute inset-0"
                  animate={
                    reduced
                      ? undefined
                      : { scale: sys.zoom, transformOrigin: `${sys.x}% 55%` }
                  }
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 660px"
                    style={{ objectFit: "cover" }}
                  />
                </motion.div>
              )}

              {/* technical callout — blue, mono, precise */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={sys.n}
                  className="absolute left-4 top-4 flex items-center gap-2.5"
                  initial={reduced ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: "var(--iv-tech)", boxShadow: "0 0 0 4px rgba(47,108,196,0.18)" }}
                  />
                  <span
                    className="px-3 py-1.5"
                    style={{
                      fontFamily: "var(--iv-mono)",
                      fontSize: 11,
                      letterSpacing: "0.16em",
                      color: "var(--iv-tech)",
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(47,108,196,0.3)",
                      borderRadius: 4,
                    }}
                  >
                    {sys.n} · {sys.title.toUpperCase()}
                  </span>
                </motion.div>
              </AnimatePresence>

              <span className="iv-concept-tag">ENGINEERING CONCEPT</span>
            </div>

            <div
              className="mt-4 flex items-center justify-between"
              style={{ fontFamily: "var(--iv-mono)", fontSize: 11, color: "var(--iv-steel)" }}
            >
              <span>PODOS UNIT — SYSTEM VIEW</span>
              <span className="iv-num" style={{ color: "var(--iv-tech)" }}>
                {sys.n} / {String(ANATOMY.systems.length).padStart(2, "0")}
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
                  borderLeft: `2px solid ${active === i ? "var(--iv-tech)" : "transparent"}`,
                  background: active === i ? "rgba(218,229,241,0.28)" : "transparent",
                }}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="iv-num text-[13px] font-semibold"
                    style={{ color: active === i ? "var(--iv-tech)" : "var(--iv-warmgray)" }}
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
