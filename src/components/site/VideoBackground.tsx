"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import styles from "./VideoBackground.module.css";

/* ==================================================================
   VIDEO BACKGROUND PRIMITIVE
   ==================================================================
   The single consumption point for all background video assets
   (Envato Elements, original footage, generated). Design-controlled
   by construction: the raw video never touches the viewer directly —
   it's always sandwiched between a saturation/hue filter (push
   toward brand palette) and three overlay layers (tint, vignette,
   section blend). This is the reason a stock AI-data-center clip
   reads as "custom-built for this product".

   API contract (keeps call sites simple):
     - Sections pass ONLY a variant key. They do NOT know file paths,
       formats, or poster frames.
     - The catalog (VIDEO_ASSETS) controls which asset plays and
       what brand-tint rules apply.
     - Motion + mobile + reduced-motion preferences are respected
       automatically — no section needs to re-implement the guard.

   Performance:
     - Only plays when in viewport (IntersectionObserver via
       framer-motion's useInView with a 200px preload margin).
     - Static poster is served on mobile (< 768px) AND when
       prefers-reduced-motion is set — no wasted battery or data.
     - WebM preferred, MP4 fallback, lazy preload=metadata.
   ================================================================== */

export type VideoVariant =
  | "data-center"
  | "modular-infra"
  | "data-flow"
  | "fusion"
  | "solar-grid"
  | "neural"
  | "particles";

interface VideoAsset {
  webm?: string;       // preferred — smaller, modern codec
  mp4: string;         // universal fallback
  poster: string;      // static image used on mobile + reduced-motion
  /** Drives which color gradient overlay is applied on top of the video. */
  tint: "brand" | "cyan" | "deep" | "neutral";
  /** Controls overlay alpha — lower intensity shows more of the footage. */
  intensity: "subtle" | "medium" | "strong";
}

/**
 * Central asset catalog. When swapping an Envato clip or adding a new
 * variant, edit only this object — no section code changes required.
 *
 * File-naming convention for assets dropped in /public/videos/:
 *   <variant>.webm        (preferred)
 *   <variant>.mp4         (fallback)
 *   <variant>.jpg         (poster — first-frame or hand-curated still)
 */
const VIDEO_ASSETS: Record<VideoVariant, VideoAsset> = {
  "data-center": {
    // Custom hero footage — drives the HeroAIWall background. Lower
    // `intensity` than the rest of the catalog because the user-supplied
    // clip IS the hero visual, not just atmosphere; "strong" overlays
    // would mask the content we explicitly want to showcase.
    mp4: "/videos/hero.mp4",
    poster: "/videos/hero-bg.jpg",
    tint: "brand",
    intensity: "medium",
  },
  "modular-infra": {
    mp4: "/videos/hero-bg.mp4",
    poster: "/videos/hero-bg.jpg",
    tint: "cyan",
    intensity: "medium",
  },
  "data-flow": {
    mp4: "/videos/particles-bg.mp4",
    poster: "/videos/particles-bg.jpg",
    tint: "cyan",
    intensity: "medium",
  },
  fusion: {
    mp4: "/videos/neural-bg.mp4",
    poster: "/videos/neural-bg.jpg",
    tint: "deep",
    intensity: "strong",
  },
  "solar-grid": {
    mp4: "/videos/hero-bg.mp4",
    poster: "/videos/hero-bg.jpg",
    tint: "brand",
    intensity: "medium",
  },
  neural: {
    mp4: "/videos/neural-bg.mp4",
    poster: "/videos/neural-bg.jpg",
    tint: "brand",
    intensity: "strong",
  },
  particles: {
    mp4: "/videos/particles-bg.mp4",
    poster: "/videos/particles-bg.jpg",
    tint: "cyan",
    intensity: "subtle",
  },
};

interface VideoBackgroundProps {
  variant: VideoVariant;
  className?: string;
  /** Force static poster even when motion/bandwidth would allow video. */
  staticOnly?: boolean;
  /** Override the default opacity (0–1). Defaults derived from intensity. */
  opacity?: number;
  /** Disable the top/bottom section-edge blend (when parent styles its own). */
  noBlend?: boolean;
  /** Override intensity set in the catalog (rare — prefer catalog edits). */
  intensity?: "subtle" | "medium" | "strong";
}

export default function VideoBackground({
  variant,
  className,
  // Default to `true` — videos are currently disabled pitch-wide. Each
  // variant renders a brand-gradient fallback instead of playing footage.
  // Flip to `false` (or pass the prop) once video assets are re-selected.
  staticOnly = true,
  opacity,
  noBlend = false,
  intensity,
}: VideoBackgroundProps) {
  const asset = VIDEO_ASSETS[variant];
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(containerRef, { margin: "200px 0px" });
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection — gate video playback on small screens.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const shouldRenderStatic = staticOnly || reduce || isMobile;

  // Pause video when off-screen (battery + bandwidth discipline).
  useEffect(() => {
    const v = videoRef.current;
    if (!v || shouldRenderStatic) return;
    if (inView) {
      // autoplay may be blocked on some browsers — silently ignore.
      v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, [inView, shouldRenderStatic]);

  // Videos disabled pitch-wide: render nothing so sections show the
  // page's native `--paper` (light) background — matching the
  // "light cyber-tech, no dark-luxury" design pivot in globals.css.
  // The hooks above still run unconditionally so React rules are safe.
  if (shouldRenderStatic) return null;

  const effectiveIntensity = intensity ?? asset.intensity;

  const classes = [
    styles.root,
    styles[`tint-${asset.tint}`],
    styles[`intensity-${effectiveIntensity}`],
    noBlend ? styles.noBlend : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const styleVars = (opacity !== undefined
    ? ({ ["--vb-opacity-override" as string]: String(opacity) } as CSSProperties)
    : undefined);

  return (
    <div
      ref={containerRef}
      className={classes}
      style={styleVars}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className={styles.media}
        poster={asset.poster}
        muted
        playsInline
        loop
        preload="metadata"
        autoPlay
        // Firefox respects disablePictureInPicture; Chrome uses the property.
        disablePictureInPicture
      >
        {asset.webm && <source src={asset.webm} type="video/webm" />}
        <source src={asset.mp4} type="video/mp4" />
      </video>

      {/* Design-control overlay stack — applied to EVERY variant, always.
          Order matters:
            1. tint   — forces brand palette via mix-blend-mode
            2. vignette — radial darkening, center-focus
            3. blend  — top/bottom fade into section surface */}
      <div className={styles.tint} />
      <div className={styles.vignette} />
      {!noBlend && <div className={styles.blend} />}
    </div>
  );
}
