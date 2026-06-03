"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScrollProgressRail.module.css";

/**
 * FLOATING RIGHT-SIDE PROGRESS RAIL
 *
 * Vertical 8-dot navigation pinned to the right edge. Each dot maps
 * to a section, glows cyan when that section is in view, and jumps
 * the user there on click. A thin gradient track fills downward with
 * overall scroll progress.
 *
 * Implementation notes:
 *   - IntersectionObserver tracks which section is most visible
 *     (performance: no scroll listener)
 *   - Hover reveals a short label on the left (mono typography)
 *   - Hidden on viewports narrower than 880px (the rail would
 *     crowd tablet/mobile content)
 *   - Respects prefers-reduced-motion: no progress fill transition
 *
 * The rail is mounted once at the page root; it finds sections via
 * `main > *` in the DOM. No prop wiring needed.
 */

type RailItem = {
  id: string;
  label: string;
  short: string; // hover label — e.g. "HERO", "PROBLEM"
};

const RAIL_ITEMS: RailItem[] = [
  { id: "rail-hero", label: "Modular AI compute, built to deploy", short: "HERO" },
  { id: "rail-problem", label: "AI infrastructure is moving too slowly", short: "PROBLEM" },
  { id: "rail-solution", label: "Factory-built AI compute pods", short: "SOLUTION" },
  { id: "rail-podos", label: "The PODOS compute pod", short: "PRODUCT" },
  { id: "rail-deployment", label: "From factory to facility", short: "DEPLOY" },
  { id: "rail-usecases", label: "Built for controlled AI infrastructure", short: "USE CASES" },
  { id: "rail-manufacturing", label: "Modular manufacturing discipline", short: "MFG" },
  { id: "rail-design", label: "Engineered for deployment, density, control", short: "DESIGN" },
  { id: "rail-cta", label: "Request a conversation", short: "CONTACT" },
];

export default function ScrollProgressRail() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  // Cache the resolved DOM elements in order so scroll handlers
  // and jumpTo don't have to re-query. Respects whatever id each
  // section already has in markup.
  const sectionsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const children = Array.from(
      document.querySelectorAll<HTMLElement>("main > *")
    );

    // Tag any untagged section so the rail's id-fallback is usable
    // for deep-linking later (#rail-fusion, etc). Existing ids are
    // left untouched.
    children.forEach((el, i) => {
      if (RAIL_ITEMS[i] && !el.id) {
        el.id = RAIL_ITEMS[i].id;
      }
    });

    sectionsRef.current = children;

    // === Scroll handler perf (2026-05-20 pass) ===========================
    // OLD: ran on EVERY scroll event. Each call did:
    //   - reads scrollHeight (forced layout)
    //   - reads getBoundingClientRect() on all 9 sections (9 forced layouts!)
    //   - calls setProgress() + setActive() — two React re-renders
    // At Lenis's smoothWheel rate (~60Hz), that's ~10 forced layouts +
    // 2 React renders PER FRAME during scroll. This was a top contributor
    // to the "1,350ms total forced reflow" the Chrome trace reported.
    //
    // NEW: rAF-throttled (one tick per actual paint frame, max) + dedup
    // (skip setProgress/setActive when value unchanged so React doesn't
    // schedule a no-op re-render).
    let rafPending = false;
    let lastActive = -1;
    let lastProgress = -1;
    const tick = () => {
      rafPending = false;
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      // Quantize to 0.001 so micro-changes (sub-pixel scroll) don't
      // trigger React renders that produce no visible difference.
      const pQ = Math.round(p * 1000) / 1000;
      if (pQ !== lastProgress) {
        lastProgress = pQ;
        setProgress(pQ);
      }
      // pickActive() inlined here so we can dedup its result too.
      const mid = window.innerHeight * 0.4;
      let bestIdx = 0;
      let bestDist = Infinity;
      const sections = sectionsRef.current;
      for (let i = 0; i < sections.length; i++) {
        const r = sections[i].getBoundingClientRect();
        const distance =
          r.top <= mid && r.bottom > mid ? 0 : Math.abs(r.top - mid);
        if (distance < bestDist) {
          bestDist = distance;
          bestIdx = i;
        }
      }
      if (bestIdx !== lastActive) {
        lastActive = bestIdx;
        setActive(bestIdx);
      }
    };
    const onScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(tick);
    };

    tick(); // initial paint
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const jumpTo = (idx: number) => {
    // Prefer the cached element ref (respects existing ids), fall
    // back to the rail's own id as a deep-link escape hatch.
    const el =
      sectionsRef.current[idx] ||
      document.getElementById(RAIL_ITEMS[idx].id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigation"
      className={styles.rail}
    >
      {/* Track + animated fill */}
      <div className={styles.track} aria-hidden>
        <div
          className={styles.trackFill}
          style={{ transform: `scaleY(${progress})` }}
        />
      </div>

      {/* Dots */}
      <ol className={styles.dots}>
        {RAIL_ITEMS.map((it, i) => {
          const isActive = i === active;
          const isDone = i < active;
          return (
            <li key={it.id} className={styles.dotItem}>
              <button
                type="button"
                className={`${styles.dot} ${
                  isActive
                    ? styles.dotActive
                    : isDone
                      ? styles.dotDone
                      : styles.dotPending
                }`}
                onClick={() => jumpTo(i)}
                aria-label={`Jump to ${it.short} — ${it.label}`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className={styles.dotInner} aria-hidden />
                <span className={styles.dotLabel}>
                  <span className={styles.dotLabelIdx}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.dotLabelName}>{it.short}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Bottom progress readout */}
      <div className={styles.readout} aria-hidden>
        <span className={styles.readoutValue}>
          {String(Math.round(progress * 100)).padStart(2, "0")}
        </span>
        <span className={styles.readoutUnit}>%</span>
      </div>
    </nav>
  );
}
