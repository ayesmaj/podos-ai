"use client";

import {
  Cpu,
  Zap,
  Droplets,
  Plug,
  Waves,
  Network,
  Fan,
  Shield,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { OptimusComponent } from "@/lib/optimusComponents";
import styles from "./PortCallout.module.css";

/**
 * PortCallout — bottom-row icon-and-label callout. Used for the 5
 * physical port connections (PWR IN, COOL IN, COOL OUT, NET FIBER,
 * EXHAUST) that live on the bottom edge of the pod.
 *
 * Visual:
 *
 *   ┃ ← short vertical dashed line up from the icon box to the pod
 *   │   baseline anchor at `position`
 *   ┌──┐
 *   │ ⚡ │  ← icon box (the clickable button itself)
 *   └──┘
 *   PWR IN  ← uppercase mono label below the box
 *
 * The component renders inside an absolutely-positioned wrapper that
 * sits BELOW the pod canvas (the parent PodCanvas reserves vertical
 * space for the port row). Each callout is positioned by its
 * `position.x` percentage, then offset upward to sit just below the
 * pod baseline.
 */

const ICON_MAP: Record<string, LucideIcon> = {
  Cpu,
  Zap,
  Droplets,
  Plug,
  Waves,
  Network,
  Fan,
  Shield,
  Sun,
};

type Props = {
  component: OptimusComponent & { placement: { kind: "port" } };
  active: boolean;
  dimmed: boolean;
  onActivate: (id: string) => void;
};

export default function PortCallout({ component, active, dimmed, onActivate }: Props) {
  const reduce = useReducedMotion();
  const Icon = ICON_MAP[component.icon] ?? Plug;
  const { x, y } = component.position;

  return (
    <div
      className={styles.root}
      style={{ left: `${x}%`, top: `${y}%` }}
      data-active={active || undefined}
      data-dimmed={dimmed || undefined}
    >
      {/* Vertical dashed riser — from pod baseline (anchor) down to
          the top of the icon box. Drawn as a CSS pseudo-element on
          .root so we don't add another DOM node per callout. */}

      <button
        type="button"
        className={styles.box}
        onClick={() => onActivate(component.id)}
        aria-label={`${component.label} — click to view specs`}
        aria-expanded={active}
      >
        <motion.span
          className={styles.iconWrap}
          animate={{ scale: active ? 1.08 : 1 }}
          transition={
            reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 22 }
          }
        >
          <Icon size={18} strokeWidth={1.6} aria-hidden />
        </motion.span>
      </button>
      <span className={styles.label}>{component.label}</span>
    </div>
  );
}
