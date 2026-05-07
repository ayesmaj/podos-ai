"use client";

import {
  Sun,
  Droplet,
  Truck,
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
 *
 * Rebrand 2026-05-07: shifted from the prior Optimus-rack identity
 * ("8× DENSITY", "GPU MODULES", "POWER DELIVERY") to the Solar Freight
 * pod identity (on-board solar, road-rated mobility, multi-path
 * uplink). The section's pod render and 9 callouts changed in the same
 * pass; these 5 brand promises summarize the same story for the
 * scanner who doesn't click any callouts.
 */

const FEATURES = [
  {
    Icon: Sun,
    title: "ON-BOARD SOLAR",
    sub: "12 KW HARVEST",
  },
  {
    Icon: Droplet,
    title: "CLOSED-LOOP",
    sub: "LIQUID COOLED",
  },
  {
    Icon: Truck,
    title: "ROAD-RATED",
    sub: "FREIGHT MOBILITY",
  },
  {
    Icon: Globe,
    title: "MULTI-PATH",
    sub: "NETWORK UPLINK",
  },
  {
    Icon: ShieldCheck,
    title: "SELF-CONTAINED.",
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
