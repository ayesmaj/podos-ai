"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./intro.css";

/**
 * PodosScrollHeroIntro — vanilla-React version.
 *
 * Rewritten with NO framer-motion, NO useScroll, NO useTransform —
 * just a manual scroll listener that reads the wrapper's
 * getBoundingClientRect and writes opacity/blur/transform inline.
 * This bypasses any Lenis/framer-motion timing collisions and works
 * with absolutely any scroll system.
 */

type Step = {
  headline: string;
  subline?: string;
  isLogo?: boolean;
};

const STEPS: Array<Step & { range: [number, number] }> = [
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
    headline: "SYNTROPIC makes every GPU do the work of ten.",
    subline:
      "Compression transforms the memory bottleneck into usable compute.",
  },
  {
    range: [0.80, 1.00],
    headline: "",
    isLogo: true,
  },
];

/**
 * Compute the visual envelope for one step at a given progress.
 *
 * Returns opacity + blur (px) + y (px) values per step.
 *
 *   Step 0 (first):  opacity 1 → 1 → 0 across [0, 0.7, 1.0] of slice
 *                    blur    0 → 0 → 12
 *                    y       0 → 0 → -16
 *   Step n (mid):    opacity 0 → 1 → 1 → 0 across [0, 0.3, 0.7, 1.0]
 *                    blur    12 → 0 → 0 → 12
 *                    y       16 → 0 → 0 → -16
 *   Logo (last):     opacity 0 → 1 → 1 across [0, 0.35, 1.0]
 *                    blur    16 → 0 → 0
 *                    scale  0.94 → 1 → 1
 */
function envelope(
  globalProgress: number,
  range: [number, number],
  index: number,
  total: number,
  isLogo: boolean,
) {
  const [start, end] = range;
  const span = end - start;
  // local progress within this step's slice (0..1, clamped)
  const local = Math.max(0, Math.min(1, (globalProgress - start) / span));

  const isFirst = index === 0;

  if (isLogo) {
    // 0..0.35  → enter (opacity 0→1, blur 16→0, scale 0.94→1)
    // 0.35..1  → hold
    if (local <= 0.35) {
      const t = local / 0.35;
      return {
        opacity: t,
        blur: 16 * (1 - t),
        y: 0,
        scale: 0.94 + 0.06 * t,
      };
    }
    return { opacity: 1, blur: 0, y: 0, scale: 1 };
  }

  if (isFirst) {
    // 0..0.7   → hold (opacity 1, blur 0, y 0)
    // 0.7..1   → exit (opacity 1→0, blur 0→12, y 0→-16)
    if (local <= 0.7) {
      return { opacity: 1, blur: 0, y: 0, scale: 1 };
    }
    const t = (local - 0.7) / 0.3;
    return {
      opacity: 1 - t,
      blur: 12 * t,
      y: -16 * t,
      scale: 1,
    };
  }

  // Mid-step bell curve.
  // 0..0.3   → enter (opacity 0→1, blur 12→0, y 16→0)
  // 0.3..0.7 → hold
  // 0.7..1   → exit (opacity 1→0, blur 0→12, y 0→-16)
  if (local <= 0.3) {
    const t = local / 0.3;
    return {
      opacity: t,
      blur: 12 * (1 - t),
      y: 16 * (1 - t),
      scale: 1,
    };
  }
  if (local <= 0.7) {
    return { opacity: 1, blur: 0, y: 0, scale: 1 };
  }
  const t = (local - 0.7) / 0.3;
  return {
    opacity: 1 - t,
    blur: 12 * t,
    y: -16 * t,
    scale: 1,
  };
}

export default function IntroPage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeDot, setActiveDot] = useState(0);
  const [reduce, setReduce] = useState(false);

  // Detect prefers-reduced-motion at runtime so we can bail on
  // blur/y for users who've opted out.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduce(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Force first-frame paint of the video. Some browsers (Chrome
  // especially) refuse to decode a paused video's frames until you
  // call .play() at least once.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    const prime = async () => {
      try {
        await video.play();
        if (!cancelled) video.pause();
      } catch {
        // autoplay blocked — that's fine, scrub will still work
      }
    };
    prime();
  }, []);

  // ── The main scroll loop ───────────────────────────────────────
  // Read window scroll position, compute progress through the wrapper,
  // then write opacity/blur/transform to each step element. Drive the
  // video's currentTime from the same progress value. All in a single
  // rAF loop so we never thrash layout.
  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap) return;

    let raf = 0;
    let lastP = -1;

    const tick = () => {
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p =
        total > 0
          ? Math.max(0, Math.min(1, -rect.top / total))
          : 0;

      // Skip writes if progress hasn't changed enough to matter.
      if (Math.abs(p - lastP) > 0.0008) {
        lastP = p;

        // Active dot — five even slices.
        setActiveDot((prev) => {
          const next = Math.min(4, Math.floor(p * 5));
          return next === prev ? prev : next;
        });

        // Update each step.
        STEPS.forEach((step, i) => {
          const el = stepRefs.current[i];
          if (!el) return;
          const env = envelope(p, step.range, i, STEPS.length, !!step.isLogo);
          const blurPx = reduce ? 0 : env.blur;
          const yPx = reduce ? 0 : env.y;
          el.style.opacity = String(env.opacity);
          el.style.filter = `blur(${blurPx}px)`;
          el.style.transform = step.isLogo
            ? `scale(${env.scale})`
            : `translate3d(0, ${yPx}px, 0)`;
        });

        // Update video currentTime — only if the diff is meaningful.
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
          const target = p * video.duration;
          if (Math.abs(video.currentTime - target) > 0.04) {
            video.currentTime = target;
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <div ref={wrapRef} className="intro-wrap">
      <div className="intro-stage">
        {/* Video layer */}
        <video
          ref={videoRef}
          className="intro-video"
          src="/intro/podos-intro.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden
        />

        {/* Dim overlay */}
        <div className="intro-dim" aria-hidden />

        {/* Foreground content */}
        <div className="intro-fg">
          {STEPS.map((step, i) => {
            // Initial inline style — Step 0 starts visible, others
            // start invisible. The rAF loop will overwrite these on
            // first frame anyway.
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
                    <p className="intro-poweredBy">Powered by Syntropic</p>
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

        {/* Progress dots */}
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
      </div>
    </div>
  );
}
