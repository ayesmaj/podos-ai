"use client";

/**
 * EstimateFigure — the live estimate number. Springs from its previous value
 * to the new one (signature motion of the configurator). Pattern adapted from
 * the 21st Stat Card (id 7461): framer-motion spring + transform to text.
 * The VALUE is always server-computed cents; this component only formats and
 * animates. Honors prefers-reduced-motion (snaps instantly).
 */

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

import { compactUsd, usd } from "@/lib/proposals/money";

export default function EstimateFigure({
  cents,
  compact = true,
  className,
  suffix,
}: {
  cents: number;
  compact?: boolean;
  className?: string;
  suffix?: string;
}) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(cents);
  const first = useRef(true);
  const text = useTransform(mv, (v) => (compact ? compactUsd(Math.round(v)) : usd(Math.round(v))));

  useEffect(() => {
    if (reduce || first.current) {
      mv.set(cents);
      first.current = false;
      return;
    }
    const controls = animate(mv, cents, { type: "spring", stiffness: 90, damping: 22, mass: 0.8 });
    return controls.stop;
  }, [cents, mv, reduce]);

  return (
    <span className={className} aria-live="polite" aria-atomic="true">
      <motion.span style={{ fontVariantNumeric: "tabular-nums" }}>{text}</motion.span>
      {suffix && <span style={{ fontSize: "0.5em", fontWeight: 600, marginLeft: 6, color: "var(--ink-faint)", letterSpacing: "0.04em" }}>{suffix}</span>}
    </span>
  );
}
