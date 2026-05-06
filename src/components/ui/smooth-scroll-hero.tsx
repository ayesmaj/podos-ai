"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Smooth-scroll clip-path "open" hero.
 *
 * The background image starts as a small inset rectangle (clip-path
 * polygon shrunk to `initialClipPercentage`) and expands to full
 * screen as the user scrolls through the section. Background size
 * also gently zooms in (170% → 100%) for a subtle Ken Burns effect.
 *
 * Adapted from the upstream demo so each instance is scoped to its
 * OWN section's scroll progress instead of the window's. Stacking
 * multiple SmoothScrollHero blocks on the same page now works — each
 * one runs its animation independently as the user scrolls past it.
 */

export interface SmoothScrollHeroProps {
  /** Inner section height in px. Total section height = scrollHeight + 100vh. */
  scrollHeight?: number;
  /** Hero image for desktop. */
  desktopImage: string;
  /** Hero image for mobile (defaults to desktop). */
  mobileImage?: string;
  /** Initial clip-path inset (each side, %). 25 → small centered rect. */
  initialClipPercentage?: number;
  /** Final clip-path coverage (each side, %). Should be 100 - initial for symmetric open. */
  finalClipPercentage?: number;
  /** Optional content rendered inside the clipped frame (title, description, tag). */
  children?: React.ReactNode;
  /** Optional className passed onto the outer wrapper. */
  className?: string;
}

interface BackgroundProps extends Omit<SmoothScrollHeroProps, "children" | "className"> {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const SmoothScrollHeroBackground: React.FC<
  React.PropsWithChildren<BackgroundProps>
> = ({
  scrollHeight = 1500,
  desktopImage,
  mobileImage,
  initialClipPercentage = 25,
  finalClipPercentage = 75,
  sectionRef,
  children,
}) => {
  // Section-scoped scroll progress (0 when section bottom enters
  // viewport, 1 when section top leaves the viewport top). The
  // clip-path animation runs over the first half of this range so
  // the section is fully open by the time it pins.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Suppress unused-var warning while keeping API symmetry with
  // upstream — kept available so callers passing scrollHeight to
  // tune total runway still work.
  void scrollHeight;

  // The clip-path opens between progress 0.0 → 0.5 (the first half
  // of the section's scroll). After that it stays fully open.
  const clipStart = useTransform(
    scrollYProgress,
    [0, 0.5],
    [initialClipPercentage, 0],
  );
  const clipEnd = useTransform(
    scrollYProgress,
    [0, 0.5],
    [finalClipPercentage, 100],
  );

  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;

  // Subtle zoom-in over the whole section's scroll length.
  const backgroundSize = useTransform(
    scrollYProgress,
    [0, 1],
    ["170%", "100%"],
  );

  const mobileSrc = mobileImage || desktopImage;

  return (
    <motion.div
      className="sticky top-0 h-screen w-full bg-black overflow-hidden"
      style={{
        clipPath,
        willChange: "clip-path",
      }}
    >
      {/* Mobile background */}
      <motion.div
        className="absolute inset-0 md:hidden"
        style={{
          backgroundImage: `url(${mobileSrc})`,
          backgroundSize,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Desktop background */}
      <motion.div
        className="absolute inset-0 hidden md:block"
        style={{
          backgroundImage: `url(${desktopImage})`,
          backgroundSize,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Foreground content (title / description / tag etc.).
          Rendered inside the clipped element so it only becomes
          visible as the clip opens. */}
      {children}
    </motion.div>
  );
};

const SmoothScrollHero: React.FC<SmoothScrollHeroProps> = ({
  scrollHeight = 1500,
  desktopImage,
  mobileImage,
  initialClipPercentage = 25,
  finalClipPercentage = 75,
  children,
  className,
}) => {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  return (
    <div
      ref={sectionRef}
      style={{ height: `calc(${scrollHeight}px + 100vh)` }}
      className={`relative w-full ${className ?? ""}`}
    >
      <SmoothScrollHeroBackground
        scrollHeight={scrollHeight}
        desktopImage={desktopImage}
        mobileImage={mobileImage}
        initialClipPercentage={initialClipPercentage}
        finalClipPercentage={finalClipPercentage}
        sectionRef={sectionRef}
      >
        {children}
      </SmoothScrollHeroBackground>
    </div>
  );
};

export default SmoothScrollHero;
