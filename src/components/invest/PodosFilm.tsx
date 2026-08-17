"use client";

/**
 * PodosFilm — the investor film section. Plays the real produced film
 * (FILM.videoSrc) with a poster + play overlay, native controls once
 * playing, preload="metadata" (the ~66MB master never blocks page load),
 * and auto-pause when scrolled out of the viewport.
 *
 * If FILM.videoSrc is ever unset, the section still renders the poster
 * frame — the old storyboard player was retired when the real film
 * arrived (git: ec53f3c has it if ever needed again).
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FILM } from "@/data/investContent";
import { openInvestorAccess } from "./investAccess";
import Reveal from "./Reveal";

export default function PodosFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const inView = useInView(frameRef, { amount: 0.3 });
  const reduced = useReducedMotion();

  /* pause when the film scrolls out of view */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !started) return;
    if (!inView && !v.paused) v.pause();
  }, [inView, started]);

  const start = () => {
    setStarted(true);
    // play after the overlay unmounts so controls receive focus cleanly
    requestAnimationFrame(() => videoRef.current?.play());
  };

  return (
    <section id="film" className="iv-section" style={{ background: "var(--iv-beige)" }}>
      <div className="iv-container">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="iv-eyebrow">{FILM.eyebrow}</span>
              <h2 className="iv-display-md mt-5">
                {FILM.headline[0]}
                <br />
                {FILM.headline[1]}
              </h2>
            </div>
            <span
              className="iv-claim-chip"
              style={{ fontSize: 11, padding: "6px 12px" }}
            >
              {FILM.durationLabel}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div ref={frameRef} className="iv-film mt-12">
            <video
              ref={videoRef}
              src={FILM.videoSrc}
              poster={FILM.poster}
              preload="metadata"
              playsInline
              controls={started}
              className="absolute inset-0 h-full w-full object-cover"
              aria-label="PODOS investor film"
            />

            {!started && (
              <button
                onClick={start}
                className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-5"
                aria-label="Play the PODOS investor film"
                style={{ background: "rgba(23,25,27,0.18)" }}
              >
                <motion.span
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{
                    background: "rgba(247,246,242,0.92)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 18px 60px -12px rgba(23,25,27,0.6)",
                  }}
                  whileHover={reduced ? undefined : { scale: 1.07 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Play size={26} strokeWidth={2} style={{ color: "var(--iv-ink)", marginLeft: 3 }} />
                </motion.span>
                <span
                  className="text-[12px] font-semibold tracking-[0.22em] text-white"
                  style={{ fontFamily: "var(--iv-mono)", textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
                >
                  WATCH THE FILM
                </span>
              </button>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[11.5px]" style={{ color: "var(--iv-warmgray)" }}>
              {FILM.footnote}
            </p>
            <button onClick={() => openInvestorAccess()} className="iv-btn iv-btn-ghost !py-3 !text-[13.5px]">
              {FILM.cta}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
