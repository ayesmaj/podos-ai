"use client";

/**
 * PodosFilm — the "35-second story": a timed cinematic sequence built from
 * the approved still frames with on-screen typography, following the V3
 * storyboard. Runs like a film (auto-advance, per-scene progress bar,
 * pause out of viewport, replay), but ships as images + CSS so it costs a
 * fraction of a video download.
 *
 * ponytail: when a real produced MP4 exists, swap the scene player for a
 * <video> with the same poster/controls — the section shell stays.
 */

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FILM, CTA } from "@/data/investContent";
import GeneratedSectionImage from "./GeneratedSectionImage";
import Reveal from "./Reveal";

export default function PodosFilm() {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [done, setDone] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { amount: 0.35 });
  const reduced = useReducedMotion();

  const active = playing && inView && !done && !reduced;

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => {
      if (scene < FILM.scenes.length - 1) setScene(scene + 1);
      else setDone(true);
    }, FILM.scenes[scene].seconds * 1000);
    return () => clearTimeout(t);
  }, [active, scene]);

  const replay = () => {
    setScene(0);
    setDone(false);
    setPlaying(true);
  };

  const current = FILM.scenes[scene];

  return (
    <section id="film" className="iv-section" style={{ background: "var(--iv-beige)" }}>
      <div className="iv-container">
        <Reveal>
          <span className="iv-eyebrow">{FILM.eyebrow}</span>
          <h2 className="iv-display-md mt-5">
            {FILM.headline[0]}
            <br />
            {FILM.headline[1]}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div ref={frameRef} className="iv-film mt-12" role="group" aria-label="PODOS 35-second story">
            {/* reduced-motion fallback: static final frame + full text list */}
            {reduced ? (
              <>
                <GeneratedSectionImage id="final-vision" fill label={false} sizes="100vw" />
                <div className="iv-film-scrim" />
                <div className="iv-film-text">
                  <span>TURN POWER</span>
                  <span>INTO AI CAPACITY.</span>
                </div>
              </>
            ) : (
              <>
                <AnimatePresence mode="sync">
                  <motion.div
                    key={done ? "done" : scene}
                    className="iv-film-scene"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <GeneratedSectionImage
                      id={done ? "final-vision" : current.imageId}
                      fill
                      label={false}
                      sizes="(max-width: 768px) 100vw, 1200px"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="iv-film-scrim" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={done ? "closing" : `t-${scene}`}
                    className="iv-film-text"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {done ? (
                      <>
                        <span>TURN POWER</span>
                        <span>INTO AI CAPACITY.</span>
                        <span
                          className="mt-4 text-[11px] font-medium tracking-[0.3em]"
                          style={{ fontFamily: "var(--iv-mono)" }}
                        >
                          {FILM.closing.toUpperCase()}
                        </span>
                      </>
                    ) : (
                      current.text.map((l) => <span key={l}>{l}</span>)
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* controls */}
                <div className="iv-film-controls">
                  {done ? (
                    <button className="iv-film-btn" onClick={replay} aria-label="Replay story">
                      <RotateCcw size={13} /> REPLAY
                    </button>
                  ) : (
                    <button
                      className="iv-film-btn"
                      onClick={() => setPlaying(!playing)}
                      aria-label={playing ? "Pause story" : "Play story"}
                    >
                      {playing ? <Pause size={13} /> : <Play size={13} />}
                      {playing ? "PAUSE" : "PLAY"}
                    </button>
                  )}
                </div>

                {/* per-scene progress */}
                <div className="iv-film-progress" aria-hidden>
                  {FILM.scenes.map((s, i) => (
                    <span key={s.imageId}>
                      {i < scene || done ? (
                        <i style={{ transform: "scaleX(1)" }} />
                      ) : i === scene ? (
                        <motion.i
                          key={`p-${scene}-${active}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: active ? 1 : 0 }}
                          transition={{ duration: s.seconds, ease: "linear" }}
                        />
                      ) : null}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[11.5px]" style={{ color: "var(--iv-warmgray)" }}>
              {FILM.footnote}
            </p>
            <a href={CTA.accessHref} className="iv-btn iv-btn-ghost !py-3 !text-[13.5px]">
              {FILM.cta}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
