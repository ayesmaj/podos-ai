"use client";

import {
  Server,
  Droplet,
  Activity,
  Globe,
  ShieldCheck,
} from "lucide-react";
import styles from "./FeatureRibbon.module.css";

/**
 * FeatureRibbon — 5-column bottom strip mirroring the reference's
 * brand-feature row. Pure-static; not interactive. Sits below the
 * port callouts as the section's "spec sheet footer".
 *
 * The five columns are intentionally hardcoded here (not data-driven)
 * because they're the section's brand promises, not pod components.
 * Editing them is a copywriting decision, not an ops decision.
 */

const FEATURES = [
  {
    Icon: Server,
    title: "8× HIGH-DENSITY",
    sub: "GPU MODULES",
  },
  {
    Icon: Droplet,
    title: "CLOSED-LOOP",
    sub: "LIQUID COOLING",
  },
  {
    Icon: Activity,
    title: "HIGH CAPACITY",
    sub: "POWER DELIVERY",
  },
  {
    Icon: Globe,
    title: "HIGH-SPEED",
    sub: "NETWORK FABRIC",
  },
  {
    Icon: ShieldCheck,
    title: "RUGGED. SECURE.",
    sub: "BUILT TO DEPLOY.",
  },
] as const;

export default function FeatureRibbon() {
  return (
    <ul className={styles.ribbon} aria-label="Pod feature highlights">
      {FEATURES.map(({ Icon, title, sub }) => (
        <li key={title} className={styles.item}>
          <span className={styles.iconBox} aria-hidden>
            <Icon size={20} strokeWidth={1.6} />
          </span>
          <span className={styles.text}>
            <span className={styles.title}>{title}</span>
            <span className={styles.sub}>{sub}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
