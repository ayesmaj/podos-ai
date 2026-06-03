"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavHeader, { type NavItem } from "@/components/ui/nav-header";
import styles from "./HeroVideoNarrative.module.css";

// Register GSAP plugin once at module load (safe in client component).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * CHAPTERS — the narrative structure of the hero.
 *
 * Single chapter design: video scrubs from 0 → pauseAt as the user
 * scrolls. At pauseAt, the video holds on the final pod beauty shot
 * and the hero text overlay fades in. The user reads while continuing
 * to scroll through the dwell window, then the pin releases and the
 * page proper begins. No further video plays after this chapter.
 *
 * EDITING NOTES:
 *   - Video (intro-scrub.mp4) is 7.04 seconds long. pauseAt = 6.9
 *     lands on the final pod beauty shot per design intent.
 *   - The "Compression software" line contradicts the PODOS-only
 *     public-website cleanup we did earlier. Verify intent.
 *   - To swap the intro: drop a new MP4 in public/, then re-encode
 *     into intro-scrub.mp4 with every frame as a keyframe:
 *       ffmpeg -y -i source.mp4 -c:v libx264 -preset slow \
 *         -x264opts keyint=1:min-keyint=1:no-scenecut \
 *         -pix_fmt yuv420p -movflags +faststart -an \
 *         public/intro-scrub.mp4
 *     And regenerate the poster from a late frame:
 *       ffmpeg -y -ss 6.5 -i source.mp4 -frames:v 1 \
 *         public/intro-poster.jpg
 *     This way the JSX <video src="/intro-scrub.mp4"> never changes.
 */
const CHAPTERS = [
  {
    pauseAt: 6.9,
    eyebrow: "PODOS AI",
    /* The title is split so the rendered <h1> can highlight the
       active phrase with the global `t-sweep-brand` gradient. The
       prefix renders in white, the accent in cyan/blue gradient —
       same treatment used in PodosPod and DeploymentTimeline so
       the hero reads as part of the same design system. */
    titlePrefix: "The integrated",
    titleAccent: "AI compute platform.",
    sub: "Compression software + modular pod hardware in one company.",
    tagline: "Built to deploy. Built to scale.",
  },
];

const SITE_NAV: NavItem[] = [
  { label: "Home", href: "#top" },
  { label: "Pod", href: "#podos" },
  { label: "Deploy", href: "#deployment" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Engineering", href: "#design" },
  { label: "Contact", href: "#access" },
];

// Number of JPEGs in /public/intro-frames/. Source intro-scrub.mp4 is
// 7s @ 60fps interpolated; we sample at 30fps for the image sequence
// (209 frames). Bump this if you re-extract at a different fps.
const INTRO_FRAME_COUNT = 209;

export default function HeroVideoNarrative() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [skipped, setSkipped] = useState(false);

  // Detect mobile once on mount. We disable scroll-jack on phones because
  // pinning + scrubbing fights the rubber-band scroll and makes the
  // experience feel broken. Mobile gets a simpler timer-driven version.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // ============================================================
  // DESKTOP: image-sequence scroll-scrub via <img> src swap
  // ============================================================
  // Why image sequence instead of <video>: video.currentTime = X
  // kicks off a decode pipeline the next set 16ms later cancels —
  // even with rVFC pacing, decoder thrash makes fast scroll feel
  // chunky. Image sequence sidesteps the decoder entirely: every
  // frame is a pre-loaded JPEG already in browser cache, and setting
  // <img src=> is a cache hit + ~3ms paint, much faster than any
  // video.currentTime path.
  //
  // Bandwidth: ~12 MB total (slightly heavier than the 10 MB video)
  // for visibly smoother scroll. Frames live at
  // /public/intro-frames/001.jpg ... 209.jpg, sampled at 30fps from
  // the 60fps interpolated intro-scrub.mp4 source.
  //
  // Mobile keeps <video> for autoplay-loop (no scrub there).
  // ============================================================
  useEffect(() => {
    if (isMobile || skipped) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Build the frame array. Use `window.Image` explicitly because
    // the file imports `Image` from `next/image` at the top — `new
    // Image()` would resolve to that React component and fail.
    const frames: HTMLImageElement[] = new Array(INTRO_FRAME_COUNT);

    // Schedule frame loads: frame 0 immediately (so the canvas can
    // draw something on first scroll), the rest progressively during
    // browser idle time so we don't lock up the network/decoder
    // firing 209 requests at once. Frames load in scroll order
    // (1..209), so by the time the user scrolls past frame N, frame
    // N+1 is already in cache.
    const loadFrame = (i: number) => {
      const img = new window.Image();
      img.src = `/intro-frames/${String(i + 1).padStart(3, "0")}.jpg`;
      // CRITICAL perf: decode the JPEG off the main thread NOW, during
      // idle, instead of letting the first drawImage() during scroll
      // trigger a synchronous decode. A 1280×720 JPEG decode is
      // 5–15ms on the main thread — do that 209× while scrolling and
      // the hero drops to ~14 FPS (measured). img.decode() hands the
      // work to the browser's image-decoding thread; by the time the
      // user scrubs to frame N it's already a ready-to-blit bitmap.
      if (typeof img.decode === "function") {
        img.decode().catch(() => {
          /* decode can reject if the image errors or is detached —
             harmless, drawFrame's `complete`/`naturalWidth` guard
             still protects the draw path. */
        });
      }
      frames[i] = img;
      return img;
    };
    // Eager load: frame 0 (visible immediately) + first few for
    // initial scroll responsiveness without saturating the network.
    const eagerCount = 12;
    for (let i = 0; i < eagerCount; i++) loadFrame(i);

    // Lazy load: rest of the frames during idle time. requestIdleCallback
    // is supported in Chrome/Edge/Firefox; Safari falls back to a
    // setTimeout chain. Either way, frames trickle in without
    // blocking the main thread or saturating the connection budget.
    type IdleSchedule = (cb: () => void) => number;
    const ric = (window as unknown as { requestIdleCallback?: IdleSchedule })
      .requestIdleCallback;
    let lazyIdx = eagerCount;
    const scheduleLazy = () => {
      if (lazyIdx >= INTRO_FRAME_COUNT) return;
      const next = () => {
        if (lazyIdx >= INTRO_FRAME_COUNT) return;
        loadFrame(lazyIdx);
        lazyIdx += 1;
        scheduleLazy();
      };
      if (typeof ric === "function") ric(next);
      else window.setTimeout(next, 16);
    };
    scheduleLazy();

    // Draw a frame to canvas if it's loaded. If the frame hasn't
    // loaded yet, skip — canvas retains the previous frame, so the
    // user sees the last known good frame instead of flicker.
    const drawFrame = (idx: number) => {
      const frame = frames[idx];
      if (!frame || !frame.complete || frame.naturalWidth === 0) return;
      // Lazy-resize canvas backing store to match source image
      // resolution. Canvas displays at CSS size (100% × 100%) with
      // `object-fit: cover` from styles.video; the backing store
      // holds the actual pixel data at native resolution for crisp
      // output on retina screens.
      if (
        canvas.width !== frame.naturalWidth ||
        canvas.height !== frame.naturalHeight
      ) {
        canvas.width = frame.naturalWidth;
        canvas.height = frame.naturalHeight;
      }
      ctx.drawImage(frame, 0, 0);
    };

    // Draw frame 0 as soon as it's available (or immediately if
    // already cached from a prior visit).
    if (frames[0].complete) {
      drawFrame(0);
    } else {
      frames[0].onload = () => drawFrame(0);
    }

    // The hero is position: sticky (CSS). Sticky handles the pin;
    // this useEffect just animates the image sequence + chapter text
    // as the user scrolls through the dwell zone (first 100vh).
    const totalScroll = window.innerHeight;
    const textFadeStart = totalScroll * 0.85;
    const textFadeEnd = totalScroll;

    // Dedup guard: onScroll is wired to native scroll + Lenis 'scroll'
    // + a self-perpetuating rAF (three sources for race-safety against
    // Lenis's smoothWheel suppressing native events). Without dedup,
    // all three fire on every actual scroll change. lastY skips work
    // when scrollY hasn't moved; lastIdx skips img.src writes when
    // we're still showing the same frame.
    let lastY = -1;
    let lastIdx = -1;
    let stopped = false;

    const onScroll = () => {
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      const progress = Math.max(0, Math.min(1, y / totalScroll));

      // Frame index 0..208. floor() ensures we don't overshoot — at
      // progress=1.0, Math.floor(1.0 * 209) = 209 which is OOB; the
      // Math.min clamp handles it.
      const idx = Math.min(
        INTRO_FRAME_COUNT - 1,
        Math.floor(progress * INTRO_FRAME_COUNT),
      );
      if (idx !== lastIdx) {
        lastIdx = idx;
        // Atomic canvas draw — drawImage is a memcpy from the
        // already-decoded HTMLImageElement to the canvas backing
        // store, then a single paint. No transitional state, no
        // flicker. If the frame isn't loaded yet (lazy-load still
        // catching up), drawFrame is a no-op and the canvas keeps
        // showing the previous frame — graceful degradation.
        drawFrame(idx);
      }

      if (progressRef.current) {
        progressRef.current.style.width = `${progress * 100}%`;
      }
      const textProgress = Math.max(
        0,
        Math.min(1, (y - textFadeStart) / (textFadeEnd - textFadeStart)),
      );
      const eased = 1 - Math.pow(1 - textProgress, 3);
      chapterRefs.current.forEach((ref) => {
        if (!ref) return;
        // opacity + transform only — both run on the compositor and
        // cost ~nothing. The previous `filter: blur()` here forced a
        // main-thread re-rasterization of each chapter element every
        // scroll frame (expensive, and invisible at scroll speed).
        ref.style.opacity = String(eased);
        ref.style.transform = `translateY(${(1 - eased) * 24}px)`;
      });
    };

    // === SCROLL HANDLING (2026-05-20 perf pass) =====================
    // Previously this effect registered THREE handlers all calling
    // onScroll(): a window scroll listener, a Lenis "scroll" listener,
    // AND a self-perpetuating requestAnimationFrame loop that ran
    // 60Hz forever. The rAF loop alone was responsible for the
    // "stuck" feel — it forced layout via getBoundingClientRect on
    // every chapter, every frame, regardless of whether the user was
    // actually scrolling.
    //
    // New approach: a single rAF-throttled handler shared by all
    // scroll sources. Scroll events queue at most one rAF; the rAF
    // does the geometry read + style writes. No continuous loop.
    let rafPending = false;
    const scheduleScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        if (!stopped) onScroll();
      });
    };

    // Initial paint — one synchronous read so the page is correct
    // before the user touches the wheel.
    onScroll();

    window.addEventListener("scroll", scheduleScroll, { passive: true });

    // Hook into Lenis when it becomes available (race-safe poll).
    // Lenis fires "scroll" on its own RAF when it's animating; we
    // still throttle to one DOM read per frame via scheduleScroll.
    let lenisHooked: { off: (e: string, cb: () => void) => void } | null = null;
    const tryHookLenis = () => {
      const lenis = (window as unknown as { __lenis?: { on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void } }).__lenis;
      if (lenis && !lenisHooked) {
        lenis.on("scroll", scheduleScroll);
        lenisHooked = lenis;
      }
    };
    tryHookLenis();
    // Poll for Lenis is bounded — give up after 2 seconds so we don't
    // spin the interval forever if the provider never mounts.
    let polls = 0;
    const lenisPoll = window.setInterval(() => {
      tryHookLenis();
      if (++polls > 20 || lenisHooked) window.clearInterval(lenisPoll);
    }, 100);

    return () => {
      stopped = true;
      window.removeEventListener("scroll", scheduleScroll);
      window.clearInterval(lenisPoll);
      lenisHooked?.off("scroll", scheduleScroll);
    };
  }, [isMobile, skipped]);

  // ============================================================
  // MOBILE: simple auto-play with timer-driven text overlays
  // ============================================================
  useEffect(() => {
    if (!isMobile || skipped) return;
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Autoplay can be blocked — fail silently, video will be controllable
    });

    // Drive text overlays from video.currentTime
    let activeIndex = -1;
    const onTimeUpdate = () => {
      const t = video.currentTime;
      // Show text whose pauseAt is the most recent (within ±0.6s window)
      let nextActive = -1;
      for (let i = 0; i < CHAPTERS.length; i++) {
        if (Math.abs(t - CHAPTERS[i].pauseAt) < 1.5) {
          nextActive = i;
          break;
        }
      }
      if (nextActive !== activeIndex) {
        chapterRefs.current.forEach((el, i) => {
          if (!el) return;
          el.style.opacity = i === nextActive ? "1" : "0";
          el.style.transform = i === nextActive ? "translateY(0)" : "translateY(20px)";
        });
        activeIndex = nextActive;
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [isMobile, skipped]);

  // Skip button — release pin and jump past hero to the rest of the page.
  const onSkip = () => {
    setSkipped(true);
    // Allow the next paint to remove the ScrollTrigger pin, then scroll
    // to the next section.
    requestAnimationFrame(() => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    });
  };

  return (
    <>
      {/* Navigation pinned over the hero — reuses the same NavHeader as
          the rest of the site. */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none md:top-6">
        <div className="pointer-events-auto">
          <NavHeader
            items={SITE_NAV}
            ariaLabel="PODOS AI site sections"
            logo={
              <Image
                src="/logo.png"
                alt="PODOS AI"
                width={1078}
                height={370}
                priority
                sizes="100px"
              />
            }
          />
        </div>
      </div>

      <section
        ref={sectionRef}
        id="top"
        className={styles.hero}
        aria-label="PODOS AI hero introduction"
      >
        {/* Hero intro — different render strategies per breakpoint:
              • Desktop (>768px): <img> with image-sequence src swap.
                209 pre-loaded JPEGs at /intro-frames/001.jpg..209.jpg
                give buttery scroll-scrub because there's no decoder
                pipeline — every src-swap is a cache hit + ~3ms paint.
                Replaces the prior <video> currentTime approach which
                couldn't avoid decoder thrash during fast scroll even
                with rVFC pacing.
              • Mobile (≤768px): <video> for autoplay-loop. Mobile
                doesn't scroll-scrub the hero, so the decoder thrash
                doesn't apply; the smaller intro-mobile.mp4 is the
                right primitive there. */}
        {isMobile ? (
          <video
            ref={videoRef}
            className={styles.video}
            src="/intro-mobile.mp4"
            muted
            playsInline
            preload="auto"
            poster="/intro-poster.jpg"
          />
        ) : (
          <canvas
            ref={canvasRef}
            className={styles.video}
            // CSS background fallback: until frame 0 is loaded and
            // drawn to the canvas backing store, the canvas is
            // transparent. Showing /intro-frames/001.jpg as a CSS
            // background means the user sees the opening frame
            // immediately on hard-reload (cold cache) instead of a
            // blank canvas. Once we drawImage, opaque canvas pixels
            // cover the background — no double-paint.
            style={{
              background:
                "url('/intro-frames/001.jpg') center / cover no-repeat",
            }}
          />
        )}
        <div className={styles.vignette} aria-hidden />

        {/* Top progress rail — fills as the user scrolls through the hero */}
        <div ref={progressRef} className={styles.progressRail} aria-hidden />

        {/* Skip — for repeat visitors */}
        <button
          type="button"
          onClick={onSkip}
          className={styles.skip}
          aria-label="Skip hero introduction"
        >
          Skip intro →
        </button>

        {/* Text chapter overlays — absolutely positioned, all stacked on
            top of each other; GSAP fades them in/out at chapter marks. */}
        <div className={styles.overlays}>
          {CHAPTERS.map((chapter, i) => (
            <div
              key={i}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              className={styles.chapter}
              data-chapter={i}
            >
              <div className={styles.eyebrow}>{chapter.eyebrow}</div>
              <h1 className={styles.title}>
                {chapter.titlePrefix}{" "}
                <span className="t-sweep-brand">{chapter.titleAccent}</span>
              </h1>
              <p className={styles.sub}>{chapter.sub}</p>
              <span className={styles.tagline}>{chapter.tagline}</span>
            </div>
          ))}
        </div>

        {/* Scroll hint — pulses gently to invite first scroll */}
        <div className={styles.scrollHint} aria-hidden>
          Scroll to continue
          <span className={styles.scrollHintArrow} />
        </div>
      </section>
    </>
  );
}
