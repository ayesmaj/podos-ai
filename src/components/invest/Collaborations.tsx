"use client";

/**
 * Collaborations — the confidential-relationships section, rendered as one
 * cinematic horizontal composition: POWER (utility imagery) → PODOS →
 * COMPUTE (integration imagery), joined by a thin line that traces on
 * scroll. Only configuration-approved statements render; no names, no
 * logos, no invented partnership language.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { VALIDATION } from "@/data/investContent";
import { visibleCollaborations, collaborationsFootnote } from "@/data/investOffering";
import GeneratedSectionImage from "./GeneratedSectionImage";
import Reveal from "./Reveal";

export default function Collaborations() {
  const collabs = visibleCollaborations();
  const flowRef = useRef<HTMLDivElement>(null);
  const flowInView = useInView(flowRef, { once: true, amount: 0.45 });

  if (collabs.length === 0) return null;
  const [power, compute] = [
    collabs.find((c) => c.id === "ca-utility") ?? collabs[0],
    collabs.find((c) => c.id === "compute-provider") ?? collabs[1],
  ];

  return (
    <section id="validation" className="iv-section" style={{ background: "var(--iv-beige)" }}>
      <div className="iv-container">
        <Reveal className="max-w-3xl">
          <span className="iv-eyebrow">{VALIDATION.eyebrow}</span>
          <h2 className="iv-display-md mt-5">
            {VALIDATION.headline[0]}
            <br />
            {VALIDATION.headline[1]}
          </h2>
          <p className="iv-sub mt-6">{VALIDATION.sub}</p>
        </Reveal>

        {/* POWER → PODOS → COMPUTE */}
        <div ref={flowRef} className="mt-14">
          <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]">
            {/* power side */}
            <Reveal>
              <figure>
                <div className="iv-figure" style={{ borderRadius: 12, overflow: "hidden" }}>
                  <GeneratedSectionImage
                    id={power.imageId}
                    sizes="(max-width: 1024px) 100vw, 560px"
                    rounded={false}
                  />
                </div>
                <figcaption className="mt-5">
                  <div className="iv-label" style={{ color: "var(--iv-gold-deep)" }}>
                    {power.category}
                  </div>
                  <h3 className="mt-2 text-[19px] font-bold tracking-tight">{power.publicLabel}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                    {power.approvedPublicStatement}
                  </p>
                </figcaption>
              </figure>
            </Reveal>

            {/* center spine */}
            <div className="hidden items-center lg:flex">
              <div className="relative flex h-full w-[120px] flex-col items-center justify-center">
                <motion.div
                  className="absolute top-0 w-px"
                  style={{ background: "var(--iv-gold)", height: "38%" }}
                  initial={{ scaleY: 0, transformOrigin: "top" }}
                  animate={flowInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={flowInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 flex flex-col items-center gap-2"
                >
                  <Image src="/products/pod.png" alt="PODOS unit" width={110} height={30} style={{ width: 110, height: "auto" }} />
                  <span className="iv-label" style={{ color: "var(--iv-ink)" }}>
                    {VALIDATION.flowLabels.center}
                  </span>
                </motion.div>
                <motion.div
                  className="absolute bottom-0 w-px"
                  style={{ background: "var(--iv-gold)", height: "38%" }}
                  initial={{ scaleY: 0, transformOrigin: "bottom" }}
                  animate={flowInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            {/* compute side */}
            <Reveal delay={0.12}>
              <figure>
                <div className="iv-figure" style={{ borderRadius: 12, overflow: "hidden" }}>
                  <GeneratedSectionImage
                    id={compute.imageId}
                    sizes="(max-width: 1024px) 100vw, 560px"
                    rounded={false}
                  />
                </div>
                <figcaption className="mt-5">
                  <div className="iv-label" style={{ color: "var(--iv-gold-deep)" }}>
                    {compute.category}
                  </div>
                  <h3 className="mt-2 text-[19px] font-bold tracking-tight">{compute.publicLabel}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                    {compute.approvedPublicStatement}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* mobile flow */}
          <div
            className="mt-8 flex items-center justify-center gap-3 lg:hidden"
            style={{ fontFamily: "var(--iv-mono)", fontSize: 11, letterSpacing: "0.14em", color: "var(--iv-steel)" }}
          >
            {VALIDATION.flowLabels.left} <span style={{ color: "var(--iv-gold-deep)" }}>→</span>{" "}
            {VALIDATION.flowLabels.center} <span style={{ color: "var(--iv-gold-deep)" }}>→</span>{" "}
            {VALIDATION.flowLabels.right}
          </div>

          <Reveal delay={0.2}>
            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0 }}
              animate={flowInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.3, duration: 0.7 }}
            >
              <span
                className="iv-label"
                style={{ color: "var(--iv-gold-deep)", letterSpacing: "0.26em" }}
              >
                {VALIDATION.flowResult}
              </span>
            </motion.div>
          </Reveal>
        </div>

        <p className="mt-12 text-center text-[11.5px]" style={{ color: "var(--iv-warmgray)" }}>
          {collaborationsFootnote}
        </p>
      </div>
    </section>
  );
}
