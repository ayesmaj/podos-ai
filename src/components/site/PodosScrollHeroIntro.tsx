"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./PodosScrollHeroIntro.css";

/**
 * PodosScrollHeroIntro — scroll-controlled, page-pinned intro.
 *
 * Behavior:
 *   1. Component mounts as `position: fixed; inset: 0` covering the
 *      whole viewport. Page underneath is invisible.
 *   2. Body scroll is HARD-LOCKED via `overflow: hidden` on <html> +
 *      <body>. The user cannot scroll past the intro until it ends.
 *   3. Wheel + touch + arrow-key input is CAPTURED and accumulated
 *      into a virtual progress value (0..1). The DOM doesn't move —
 *      only the virtual progress does.
 *   4. The virtual progress is smoothed via lerp (8% catch-up per
 *      frame) and drives BOTH the video.currentTime AND the
 *      text-step crossfade envelope. Smoothing eliminates the
 *      flickering you saw before, because video.currentTime no
 *      longer jumps in sharp wheel-event-sized increments — it
 *      eases between values, so the decoder never has to replay
 *      the same keyframe chain twice in succession.
 *   5. When progress reaches 1.0 and stays there for 1.4s, the
 *      overlay fades out and body scroll unlocks. The user can now
 *      scroll the actual page below.
 *
 * Anti-flicker mechanics:
 *   • Lerp factor 0.08 → video.currentTime updates smoothly between
 *     wheel events instead of jumping per-event
 *   • 0.05-second threshold for seeks → tiny fractional updates skip
 *     entirely, decoder never thrashes
 *   • Single rAF loop drives BOTH video time and text → no race
 *     between competing scroll listeners
 *
 * Returning users: a "Skip intro" button appears top-right after
 * 800ms. One click = unlock immediately.
 */

type Step = {
  range: [number, number];
  headline: string;
  subline?: string;
  isLogo?: boolean;
};

const STEPS: Step[] = [
  {
    range: [0.00, 0.20],
    headline: "The AI Economy Needs a New Physical Layer.",
    subline: "AI demand is exploding. Infrastructure cannot keep up.",
  },
  {
    range: [0.20, 0.40],
    headline: "Compute is waiting for infrastructure.",
    subline:
      "Traditional data centers take years. The market needs deployable capacity now.",
  },
  {
    range: [0.40, 0.60],
    headline: "PODOS deploys AI infrastructure in 90–120 days.",
    subline:
      "Factory-built modular supercomputers designed for speed, scale, and real-world energy deployment.",
  },
  {
    range: [0.60, 0.80],
    headline: "Modular AI compute capacity, built to deploy.",
    subline:
      "Factory-built pods designed for rapid commissioning at facilities that need serious compute, fast.",
  },
  {
    range: [0.80, 1.00],
    headline: "",
    isLogo: true,
  },
];

/**
 * Total accumulated wheel/touch input (in pixels) required to traverse
 * the entire intro from progress 0 to progress 1. ~3 viewport heights
 * of scroll input feels right — slow enough to read each step, fast
 * enough that impatient users aren't stuck. Tune by feel.
 */
const TOTAL_INPUT_PX = 2400;

/* Bell-curve envelope. See component for shape per step. */
function envelope(
  globalProgress: number,
  range: [number, number],
  index: number,
  isLogo: boolean,
) {
  const [start, end] = range;
  const span = end - start;
  const local = Math.max(0, Math.min(1, (globalProgress - start) / span));

  const isFirst = index === 0;

  if (isLogo) {
    if (local <= 0.35) {
      const t = local / 0.35;
      return { opacity: t, blur: 16 * (1 - t), y: 0, scale: 0.94 + 0.06 * t };
    }
    return { opacity: 1, blur: 0, y: 0, scale: 1 };
  }

  if (isFirst) {
    if (local <= 0.7) return { opacity: 1, blur: 0, y: 0, scale: 1 };
    const t = (local - 0.7) / 0.3;
    return { opacity: 1 - t, blur: 12 * t, y: -16 * t, scale: 1 };
  }

  if (local <= 0.3) {
    const t = local / 0.3;
    return { opacity: t, blur: 12 * (1 - t), y: 16 * (1 - t), scale: 1 };
  }
  if (local <= 0.7) return { opacity: 1, blur: 0, y: 0, scale: 1 };
  const t = (local - 0.7) / 0.3;
  return { opacity: 1 - t, blur: 12 * t, y: -16 * t, scale: 1 };
}

export default function PodosScrollHeroIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [done, setDone] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [fading, setFading] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  // Virtual scroll state — refs so they don't trigger re-renders.
  const inputAccumRef = useRef(0);          // total wheel/touch input in px
  const targetProgressRef = useRef(0);      // 0..1, derived from input
  const smoothedProgressRef = useRef(0);    // 0..1, lerped toward target

  /* Detect prefers-reduced-motion — kills blur+y, keeps the rest. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduce(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Lock body+html scroll AND stop Lenis while the intro is active.
     ----------------------------------------------------------------
     Lenis (SmoothScrollProvider) maintains an internal scroll state
     decoupled from window.scrollY. When the lock releases, Lenis's
     internal value persists and the page snaps back to it — that's
     why the user kept landing on the Solution section after the
     intro: Lenis remembered scrollY was 1500 from before mount.

     Three-step lock:
       1. lenis.stop()                — pause Lenis's RAF + scroll math
       2. window.scrollTo(0, 0)       — native scroll to top
       3. overflow: hidden            — body lock so wheel events
                                        scrolling is impossible

     Three-step unlock (reverse order):
       4. overflow: restore           — body scrollable again
       5. lenis.scrollTo(0, immediate)— snap Lenis's internal state to 0
       6. lenis.start()               — resume Lenis RAF
       Force window.scrollTo(0, 0) one final time as safety. */
  useEffect(() => {
    if (done) return;
    // Reach the global Lenis instance (set by SmoothScrollProvider).
    type LenisHandle = {
      stop?: () => void;
      start?: () => void;
      scrollTo?: (y: number, opts?: { immediate?: boolean }) => void;
    };
    const lenis = (window as unknown as { __lenis?: LenisHandle }).__lenis;

    const prevScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    // Step 1+2: stop Lenis AND snap native scroll to top BEFORE
    // applying overflow:hidden (which would no-op subsequent scrolls).
    lenis?.stop?.();
    window.scrollTo(0, 0);

    // Step 3: lock the body.
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      // Step 4: unlock body
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      // Step 5: snap Lenis's internal state to 0 with `immediate` so
      // it doesn't smooth-animate from its old value
      lenis?.scrollTo?.(0, { immediate: true });
      // Step 6: resume Lenis
      lenis?.start?.();
      // Final safety net
      window.scrollTo(0, 0);
      window.history.scrollRestoration = prevScrollRestoration;
    };
  }, [done]);

  /* Reveal Skip button after 800ms. */
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 800);
    return () => clearTimeout(t);
  }, []);

  /* === Input capture === */
  useEffect(() => {
    if (done) return;

    const onWheel = (e: WheelEvent) => {
      // Capture phase + stopImmediatePropagation prevents Lenis's
      // own wheel listener from also processing this event. Without
      // this, even a stopped Lenis can still spin its wheel handlers.
      e.preventDefault();
      e.stopImmediatePropagation();
      inputAccumRef.current = Math.max(
        0,
        Math.min(TOTAL_INPUT_PX, inputAccumRef.current + e.deltaY),
      );
      targetProgressRef.current = inputAccumRef.current / TOTAL_INPUT_PX;
    };

    let lastTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0]?.clientY ?? 0;
      const dy = lastTouchY - y;
      lastTouchY = y;
      inputAccumRef.current = Math.max(
        0,
        Math.min(TOTAL_INPUT_PX, inputAccumRef.current + dy),
      );
      targetProgressRef.current = inputAccumRef.current / TOTAL_INPUT_PX;
    };

    const onKey = (e: KeyboardEvent) => {
      const KEY_STEP = 80;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        inputAccumRef.current = Math.min(
          TOTAL_INPUT_PX,
          inputAccumRef.current + KEY_STEP,
        );
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        inputAccumRef.current = Math.max(0, inputAccumRef.current - KEY_STEP);
      } else if (e.key === "End") {
        e.preventDefault();
        inputAccumRef.current = TOTAL_INPUT_PX;
      } else if (e.key === "Home") {
        e.preventDefault();
        inputAccumRef.current = 0;
      } else {
        return;
      }
      targetProgressRef.current = inputAccumRef.current / TOTAL_INPUT_PX;
    };

    // capture: true so we run BEFORE Lenis's bubble-phase listener.
    // Combined with stopImmediatePropagation in the handler, this
    // hard-blocks Lenis from ever seeing these events.
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true } as EventListenerOptions);
      window.removeEventListener("touchstart", onTouchStart, { capture: true } as EventListenerOptions);
      window.removeEventListener("touchmove", onTouchMove, { capture: true } as EventListenerOptions);
      window.removeEventListener("keydown", onKey);
    };
  }, [done]);

  /* === Main rAF loop ===
     Smooth target → smoothed via lerp, then write everything. */
  useEffect(() => {
    if (done) return;
    const video = videoRef.current;
    if (!video) return;

    // Prime the video with a play().pause() so Chrome decodes the
    // first frame and shows it instead of black.
    let cancelled = false;
    (async () => {
      try {
        await video.play();
        if (!cancelled) video.pause();
      } catch {
        /* autoplay blocked — fine, we drive currentTime manually */
      }
    })();

    let raf = 0;
    let endHoldStart = 0;

    const tick = () => {
      // Lerp smoothed toward target. 0.08 = catches up in ~12 frames.
      const target = targetProgressRef.current;
      const sm = smoothedProgressRef.current + (target - smoothedProgressRef.current) * 0.08;
      smoothedProgressRef.current = sm;

      // Active dot
      const dot = Math.min(4, Math.floor(sm * 5));
      setActiveDot((prev) => (prev === dot ? prev : dot));

      // Per-step opacity/blur/transform
      STEPS.forEach((step, i) => {
        const el = stepRefs.current[i];
        if (!el) return;
        const env = envelope(sm, step.range, i, !!step.isLogo);
        const blurPx = reduce ? 0 : env.blur;
        const yPx = reduce ? 0 : env.y;
        el.style.opacity = String(env.opacity);
        el.style.filter = `blur(${blurPx}px)`;
        el.style.transform = step.isLogo
          ? `scale(${env.scale})`
          : `translate3d(0, ${yPx}px, 0)`;
      });

      // Drive video — only seek when the diff exceeds ~1 frame at 24fps
      if (Number.isFinite(video.duration) && video.duration > 0) {
        const t = sm * video.duration;
        if (Math.abs(video.currentTime - t) > 0.05) {
          video.currentTime = t;
        }
      }

      // End-of-runway detection: progress + smoothed both at full,
      // hold 1.4s, then fade + release.
      if (target >= 0.999 && sm >= 0.995) {
        if (!endHoldStart) endHoldStart = performance.now();
        if (performance.now() - endHoldStart > 1400) {
          setFading(true);
          setTimeout(() => setDone(true), 600);
          return;
        }
      } else {
        endHoldStart = 0;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [done, reduce]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(() => setDone(true), 350);
  };

  if (done) return null;

  return (
    <div
      className="intro-overlay"
      data-fading={fading || undefined}
      role="dialog"
      aria-label="PODOS AI introduction"
    >
      <video
        ref={videoRef}
        className="intro-video"
        src="/intro/podos-intro.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden
      />

      <div className="intro-dim" aria-hidden />

      <div className="intro-fg">
        {STEPS.map((step, i) => {
          const initial =
            i === 0
              ? { opacity: 1, filter: "blur(0px)", transform: "translate3d(0,0,0)" }
              : step.isLogo
              ? { opacity: 0, filter: "blur(16px)", transform: "scale(0.94)" }
              : { opacity: 0, filter: "blur(12px)", transform: "translate3d(0,16px,0)" };
          return (
            <div
              key={i}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className={step.isLogo ? "intro-logo" : "intro-step"}
              style={initial}
            >
              {step.isLogo ? (
                <>
                  <Image
                    src="/logo.png"
                    alt="PODOS AI"
                    width={1078}
                    height={370}
                    priority
                    sizes="(max-width: 768px) 220px, 360px"
                    className="intro-logoImg"
                  />
                  <p className="intro-tagline">
                    The New Physical Layer for AI.
                  </p>
                  <p className="intro-poweredBy">Modular AI Compute</p>
                </>
              ) : (
                <>
                  <h1 className="intro-headline">{step.headline}</h1>
                  {step.subline && (
                    <p className="intro-subline">{step.subline}</p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {!reduce && (
        <div className="intro-dots" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`intro-dot ${i === activeDot ? "intro-dotActive" : ""}`}
            />
          ))}
        </div>
      )}

      {/* Hint text near the bottom — small, fades after first input. */}
      {!reduce && (
        <div className="intro-hint" aria-hidden>
          Scroll to advance
        </div>
      )}

      {showSkip && (
        <button
          type="button"
          className="intro-skip"
          onClick={handleSkip}
          aria-label="Skip intro"
        >
          Skip intro
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M3 7H11M11 7L7 3M11 7L7 11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
