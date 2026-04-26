"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import {
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  OPTIMUS_COMPONENTS,
  type OptimusComponent,
} from "@/lib/optimusComponents";
import styles from "./DetailPanel.module.css";

/**
 * DetailPanel — slide-in spec drawer that opens when a callout is
 * activated. Renders panel structure per the prompt:
 *
 *   1. Close button (top-right)
 *   2. Category badge (small pill)
 *   3. Title + subtitle
 *   4. Hero metric card (only if panel.metric exists)
 *   5. Specs table (label/value rows, monospace values)
 *   6. Description paragraph
 *   7. Footer: prev / next arrows (cycle through OPTIMUS_COMPONENTS)
 *
 * Accessibility:
 *   - role="dialog", aria-modal="false" — page is still scrollable
 *   - aria-labelledby points to the title
 *   - focus is moved to the close button on open; returned to the
 *     activator pin on close (handled by the parent OptimusInteractive)
 *   - ESC closes — handled by parent (so a single keydown listener
 *     covers all open/close/nav cases)
 *
 * Motion:
 *   - Slides in from the right on desktop (translateX)
 *   - Slides up from the bottom on mobile (translateY) — handled
 *     entirely via CSS @media query on the .panel transform origin
 *   - Reduced-motion: replaces slide with instant fade
 */

type Props = {
  /** The component to display. null when closed. */
  component: OptimusComponent | null;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
};

export default function DetailPanel({ component, onClose, onNavigate }: Props) {
  const reduce = useReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Move focus to the close button on open so keyboard users have a
  // sensible starting point. Browsers re-focus to the previously
  // focused element on close (handled by `inert` attribute pattern
  // OR by parent restoring focus — we handle in the parent for
  // robustness).
  useEffect(() => {
    if (component) {
      // Wait one frame so the slide-in animation starts before focus
      // moves (avoids a "focus before paint" flash).
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    }
  }, [component?.id]);

  // Find current index for prev/next labels (enables disabling at ends
  // — but we choose to CYCLE instead of disable, so always enabled).
  const idx = component
    ? OPTIMUS_COMPONENTS.findIndex((c) => c.id === component.id)
    : -1;
  const prevLabel =
    idx > -1
      ? OPTIMUS_COMPONENTS[
          (idx - 1 + OPTIMUS_COMPONENTS.length) % OPTIMUS_COMPONENTS.length
        ].label
      : "";
  const nextLabel =
    idx > -1
      ? OPTIMUS_COMPONENTS[(idx + 1) % OPTIMUS_COMPONENTS.length].label
      : "";

  // Animation config — slide from right (desktop) / bottom (mobile, via CSS).
  const slide = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
      };

  return (
    <AnimatePresence mode="wait">
      {component && (
        <motion.aside
          key={component.id /* re-mount on switch so title/specs cross-fade cleanly */}
          className={styles.panel}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`panel-title-${component.id}`}
          initial={slide.initial}
          animate={slide.animate}
          exit={slide.exit}
          transition={{
            duration: reduce ? 0 : 0.32,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Top bar — close button. */}
          <div className={styles.topBar}>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className={styles.closeBtn}
              aria-label="Close panel"
            >
              <X size={18} strokeWidth={1.8} aria-hidden />
            </button>
          </div>

          {/* Body — scrolls if content overflows. */}
          <div className={styles.body}>
            {/* Category badge */}
            <span
              className={styles.badge}
              style={{
                ["--cat-color" as string]: CATEGORY_COLOR[component.category],
              }}
            >
              <span className={styles.badgeDot} aria-hidden />
              {CATEGORY_LABEL[component.category]}
            </span>

            <h3 id={`panel-title-${component.id}`} className={styles.title}>
              {component.panel.title}
            </h3>
            <p className={styles.subtitle}>{component.panel.subtitle}</p>

            {/* Hero metric — optional. Big number + label + delta. */}
            {component.panel.metric && (
              <div className={styles.metric}>
                <div className={styles.metricLabel}>
                  {component.panel.metric.label}
                </div>
                <div className={styles.metricValue}>
                  {component.panel.metric.value}
                </div>
                {component.panel.metric.delta && (
                  <div className={styles.metricDelta}>
                    {component.panel.metric.delta}
                  </div>
                )}
              </div>
            )}

            {/* Specs table — label left (slate-400), value right (white mono). */}
            <dl className={styles.specs}>
              {component.panel.specs.map((spec) => (
                <div key={spec.label} className={styles.specRow}>
                  <dt className={styles.specLabel}>{spec.label}</dt>
                  <dd className={styles.specValue}>{spec.value}</dd>
                </div>
              ))}
            </dl>

            <p className={styles.description}>{component.panel.description}</p>
          </div>

          {/* Footer nav — prev / next cycle through all 9 components. */}
          <div className={styles.footer}>
            <button
              type="button"
              onClick={() => onNavigate("prev")}
              className={styles.navBtn}
              aria-label={`Previous component: ${prevLabel}`}
            >
              <ArrowLeft size={16} strokeWidth={1.8} aria-hidden />
              <span>{prevLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("next")}
              className={styles.navBtn}
              aria-label={`Next component: ${nextLabel}`}
            >
              <span>{nextLabel}</span>
              <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
