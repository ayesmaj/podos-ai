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
 *   - Video (intro-scrub.mp4) is 7.07 seconds long. pauseAt = 6.9
 *     lands on the final pod beauty shot per design intent.
 *   - The "Compression software" line contradicts the PODOS-only
 *     public-website cleanup we did earlier. Verify intent.
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

export default function HeroVideoNarrative() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
  // DESKTOP: GSAP ScrollTrigger pinned timeline
  // ============================================================
  useEffect(() => {
    if (isMobile || skipped) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let cleanup: (() => void) | null = null;

    const setup = () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration)) return;

      // The hero is now position: sticky (CSS). It stays pinned to the
      // top of the viewport while the next section (main.pageOverlay)
      // slides up over it via natural scroll flow. No ScrollTrigger
      // pin needed — sticky handles that for free.
      //
      // ScrollTrigger here is purely for ANIMATION CONTROL: scrubbing
      // the video and fading in the chapter text as the user scrolls
      // through the HERO DWELL ZONE (the first 100vh of scroll, where
      // main has not yet entered the viewport because of its
      // margin-top: 100vh). After this dwell, CSS sticky + flow takes
      // over for the slide-up phase (next 100vh of scroll).
      const totalScroll = window.innerHeight;

      // ============================================================
      // NATIVE scroll listener for video scrub.
      //
      // ScrollTrigger turned out to not be receiving scroll events
      // reliably in this project (likely a Lenis/ScrollTrigger
      // integration issue specific to our setup). Native scroll
      // events fire reliably and Lenis emits them via its rAF loop,
      // so a plain `addEventListener('scroll')` works perfectly.
      //
      // We map scroll position 0 → totalScroll to video time
      // 0 → chapter.pauseAt, then fade in the chapter text in the
      // last 15% of the range (when video reaches its final frame).
      // ============================================================

      const lastChapter = CHAPTERS[CHAPTERS.length - 1];
      const targetTime = lastChapter.pauseAt;
      const textFadeStart = totalScroll * 0.85;
      const textFadeEnd = totalScroll;

      const onScroll = () => {
        const y = window.scrollY;
        const progress = Math.max(0, Math.min(1, y / totalScroll));

        // Video scrub — direct currentTime mapping. Cheap and exact.
        video.currentTime = progress * targetTime;

        // Progress rail (top-edge gradient bar)
        if (progressRef.current) {
          progressRef.current.style.width = `${progress * 100}%`;
        }

        // Chapter text fade-in — interpolate opacity/transform/filter
        // over the last 15% of the dwell zone. Manual interpolation
        // avoids the GSAP/Lenis sync issues we hit with ScrollTrigger.
        const textProgress = Math.max(
          0,
          Math.min(1, (y - textFadeStart) / (textFadeEnd - textFadeStart)),
        );
        // Ease-out cubic for a smooth land
        const eased = 1 - Math.pow(1 - textProgress, 3);
        chapterRefs.current.forEach((ref) => {
          if (!ref) return;
          ref.style.opacity = String(eased);
          ref.style.transform = `translateY(${(1 - eased) * 24}px)`;
          ref.style.filter = `blur(${(1 - eased) * 6}px)`;
        });
      };

      // Drive video scrub via a continuous requestAnimationFrame loop.
      //
      // Why rAF over scroll events:
      //   - Lenis's smoothWheel intercepts wheel input and uses its own
      //     rAF ticker to update window.scrollY. Native 'scroll' events
      //     don't always fire for these programmatic updates.
      //   - Lenis's own 'scroll' event has timing/race issues
      //     (SmoothScrollProvider mounts AFTER HeroVideoNarrative, so
      //     window.__lenis isn't available at first useEffect tick).
      //   - rAF runs every frame regardless of how scroll happens —
      //     it just reads window.scrollY. This is bulletproof.
      //
      // The loop only does work when scroll position changes (cheap
      // early-exit if unchanged). Auto-stops when component unmounts.
      // Initial paint, then bind ALL the things to maximize the chance
      // that at least one mechanism fires per scroll tick:
      //   1. window 'scroll' event (fires on native scroll changes)
      //   2. Lenis 'scroll' event (fires on Lenis-driven scroll updates)
      //   3. Self-perpetuating rAF as a fallback poll
      onScroll();

      window.addEventListener("scroll", onScroll, { passive: true });

      // Hook into Lenis when it becomes available (race-safe poll)
      let lenisHooked: { off: (e: string, cb: () => void) => void } | null = null;
      const tryHookLenis = () => {
        const lenis = (window as unknown as { __lenis?: { on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void } }).__lenis;
        if (lenis && !lenisHooked) {
          lenis.on("scroll", onScroll);
          lenisHooked = lenis;
        }
      };
      tryHookLenis();
      const lenisPoll = window.setInterval(tryHookLenis, 100);

      // Self-perpetuating rAF fallback — covers cases where neither
      // scroll event fires (some smooth-scroll setups suppress them).
      let stopped = false;
      const tick = () => {
        if (stopped) return;
        onScroll();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      cleanup = () => {
        stopped = true;
        window.removeEventListener("scroll", onScroll);
        window.clearInterval(lenisPoll);
        lenisHooked?.off("scroll", onScroll);
      };
    };

    // Wait for video metadata before building the timeline (we need duration)
    if (video.readyState >= 1) {
      setup();
    } else {
      video.addEventListener("loadedmetadata", setup, { once: true });
    }

    return () => {
      cleanup?.();
      video.removeEventListener("loadedmetadata", setup);
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
        {/* Two video sources — intro-scrub.mp4 has every frame as a
            keyframe (much faster seeking, 18MB) and is used by the
            scroll-driven scrubbing. The full-quality intro.mp4
            (50MB, 1440p) is kept in /public/ as a fallback or for
            non-scrub uses. */}
        <video
          ref={videoRef}
          className={styles.video}
          src="/intro-scrub.mp4"
          muted
          playsInline
          preload="auto"
          poster="/intro-poster.jpg"
        />
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
