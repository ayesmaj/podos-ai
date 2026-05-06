"use client";

import { useEffect, useRef } from "react";
import styles from "./DeploymentTimeline.module.css";

/**
 * DeploymentTimeline — sticky-video scroll-driven section.
 *
 * Layout matches the ChatGPT reference: no card chrome around the
 * step text — instead the headline + description float directly over
 * the factory video with a subtle text-shadow for legibility. A
 * horizontal stepper lives at the bottom (PLANNING → DEPLOYMENT);
 * HUD-style corner readouts sell the "live system" feel; a vertical
 * dot stack on the right side mirrors the step the user is on; a
 * progress percent badge sits in the upper-right.
 *
 * Six factory-side activities collapse into four customer-facing
 * phases so the stepper matches the reference and reads as a
 * narrative the buyer can hold in their head.
 */
const STEPS = [
  {
    n: "01",
    phase: "PLANNING",
    pauseAt: 2.5,
    title: "Site evaluation",
    body: "Assess location, power availability, network access, and operational fit for one or more pods.",
  },
  {
    n: "02",
    phase: "CONFIGURATION",
    pauseAt: 7,
    title: "Pod configuration",
    body: "Specify compute density, accelerator family, cooling strategy, and deployment footprint.",
  },
  {
    n: "03",
    phase: "FACTORY BUILD",
    pauseAt: 12,
    title: "Factory build",
    body: "Pods are constructed in a controlled production environment using a repeatable process.",
  },
  {
    n: "04",
    phase: "DELIVERY",
    pauseAt: 17,
    title: "Delivery and placement",
    body: "Completed pods are shipped to the destination facility and positioned for connection.",
  },
  {
    n: "05",
    phase: "CONNECTION",
    pauseAt: 21,
    title: "Power & network connection",
    body: "Standardized site interfaces minimize on-site work and accelerate readiness.",
  },
  {
    n: "06",
    phase: "COMMISSIONING",
    pauseAt: 25,
    title: "Commissioning",
    body: "Acceptance testing, monitoring integration, and handover to operational use.",
  },
];

export default function DeploymentTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepperDotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sideDotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressPctRef = useRef<HTMLDivElement>(null);
  const stepperFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let stopped = false;
    let lenisHooked: { off: (e: string, cb: () => void) => void } | null = null;
    let inView = false;

    const stepCount = STEPS.length;
    // Bell-curve half-width — controls crossfade overlap between
    // adjacent step titles. With 6 steps each owns a tighter band,
    // so the multiplier sits closer to the step center.
    const halfWidth = 1 / (stepCount * 1.4);

    const visObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0, rootMargin: "200px 0px" },
    );
    visObserver.observe(section);

    const onScroll = () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration)) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionScrollDist = Math.max(1, rect.height - vh);
      const scrolledIntoSection = Math.max(0, -rect.top);
      const progress = Math.max(
        0,
        Math.min(1, scrolledIntoSection / sectionScrollDist),
      );

      // Scrub video
      video.currentTime = progress * duration;

      // Top progress rail + bottom-stepper fill + corner % badge
      const pct = Math.round(progress * 100);
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress * 100}%`;
      }
      if (stepperFillRef.current) {
        stepperFillRef.current.style.width = `${progress * 100}%`;
      }
      if (progressPctRef.current) {
        progressPctRef.current.textContent = `${pct}%`;
      }

      // Determine current "active" step index (closest center)
      let activeIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < stepCount; i++) {
        const center = (i + 0.5) / stepCount;
        const d = Math.abs(progress - center);
        if (d < bestDist) {
          bestDist = d;
          activeIdx = i;
        }
      }

      // Title crossfade — centered float over video, no card chrome
      titleRefs.current.forEach((el, i) => {
        if (!el) return;
        const center = (i + 0.5) / stepCount;
        const dist = Math.abs(progress - center);
        const t = Math.max(0, 1 - dist / halfWidth);
        const eased = 1 - Math.pow(1 - t, 3);
        el.style.opacity = String(eased);
        el.style.setProperty("--title-y", `${(1 - eased) * 22}px`);
        el.style.filter = `blur(${(1 - eased) * 6}px)`;
      });

      // Bottom stepper dots — toggle .active class
      stepperDotRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === activeIdx) el.classList.add(styles.dotActive);
        else el.classList.remove(styles.dotActive);
        // Past steps: smaller filled state
        if (i < activeIdx) el.classList.add(styles.dotPast);
        else el.classList.remove(styles.dotPast);
      });

      // Side rail dots — same active highlighting
      sideDotRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === activeIdx) el.classList.add(styles.sideDotActive);
        else el.classList.remove(styles.sideDotActive);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const tryHookLenis = () => {
      const lenis = (window as unknown as {
        __lenis?: {
          on: (e: string, cb: () => void) => void;
          off: (e: string, cb: () => void) => void;
        };
      }).__lenis;
      if (lenis && !lenisHooked) {
        lenis.on("scroll", onScroll);
        lenisHooked = lenis;
      }
    };
    tryHookLenis();
    const lenisPoll = window.setInterval(tryHookLenis, 100);

    const tick = () => {
      if (stopped) return;
      if (inView) onScroll();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    return () => {
      stopped = true;
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(lenisPoll);
      lenisHooked?.off("scroll", onScroll);
      visObserver.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="deployment"
      className={styles.section}
      aria-labelledby="deployment-heading"
    >
      <div className={styles.sticky}>
        <video
          ref={videoRef}
          className={styles.video}
          src="/factory-scrub.mp4"
          muted
          playsInline
          preload="auto"
        />
        <div className={styles.vignette} aria-hidden />

        {/* Top progress rail */}
        <div ref={progressBarRef} className={styles.progressRail} aria-hidden />

        {/* Top-right progress % badge */}
        <div className={styles.progressBadge} aria-hidden>
          <span ref={progressPctRef}>0%</span>
        </div>

        {/* Section header — top of viewport */}
        <header className={styles.header}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowIdx}>04</span>
            <span className={styles.eyebrowSep}>·</span>
            DEPLOYMENT
          </span>
          <h2 id="deployment-heading" className={styles.headline}>
            From factory to facility.
          </h2>
        </header>

        {/* Floating step titles — crossfade based on scroll progress.
            No card chrome — text floats directly over the video with
            text-shadow for legibility. */}
        <div className={styles.titlesWrap} aria-hidden>
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              ref={(el) => {
                titleRefs.current[i] = el;
              }}
              className={styles.title}
            >
              <div className={styles.stepBadge}>STEP</div>
              <div className={styles.stepNumber}>{step.n}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          ))}
        </div>

        {/* Bottom horizontal stepper — 4 phases connected by a line.
            The active phase circle is filled cyan with a glow; past
            phases are dimmed; future phases are empty rings. */}
        <div className={styles.stepper} aria-hidden>
          <div className={styles.stepperTrack}>
            <div ref={stepperFillRef} className={styles.stepperFill} />
          </div>
          <div className={styles.stepperRow}>
            {STEPS.map((step, i) => (
              <div key={step.n} className={styles.stepperItem}>
                <div
                  ref={(el) => {
                    stepperDotRefs.current[i] = el;
                  }}
                  className={styles.dot}
                />
                <div className={styles.stepperLabel}>
                  <span className={styles.stepperLabelN}>{step.n}</span>
                  <span className={styles.stepperLabelPhase}>{step.phase}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HUD corner: bottom-left coordinates */}
        <div className={styles.hudBl} aria-hidden>
          <div className={styles.hudBlLine}>GD90G</div>
          <div className={styles.hudBlLine}>47°5821&apos; N</div>
          <div className={styles.hudBlLine}>122.1564&apos; W</div>
        </div>

        {/* HUD corner: bottom-right system status */}
        <div className={styles.hudBr} aria-hidden>
          <div className={styles.hudBrLabel}>SYSTEM STATUS</div>
          <div className={styles.hudBrValue}>
            NOMINAL <span className={styles.hudBrDot} />
          </div>
        </div>

        {/* Right-side vertical dot stack — one per step, active highlighted */}
        <div className={styles.sideRail} aria-hidden>
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              ref={(el) => {
                sideDotRefs.current[i] = el;
              }}
              className={styles.sideDot}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
