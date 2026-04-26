import type { Metadata } from "next";
import SyntropicConsole from "@/components/site/SyntropicConsole";

/**
 * /mockups/syntropic-console
 *
 * Deep-dive product mockup — a glimpse of the PODOS operator console on Day 1.
 * This is NOT one of the three original hero directions (A/B/C); it's a
 * separate "what does the product look like?" asset for investor calls after
 * the thesis lands. Keeps the primary 12-section narrative lean while giving
 * us a concrete product surface to point at.
 *
 * The <SyntropicConsole /> section carries its own paper background +
 * BackgroundLayers chrome, so the page shell is deliberately minimal. The
 * mockups layout's DirectionSwitcher floats on top of this route as well.
 */
export const metadata: Metadata = {
  title: "PODOS AI — Syntropic Operator Console",
  description:
    "Day-1 operator console preview: global pod fleet map, live deployment events feed, 10× tokens/sec ramp vs traditional DCs, and two operator capability cards.",
};

export default function SyntropicConsolePage() {
  return (
    <main className="ms-page">
      <SyntropicConsole />
    </main>
  );
}
