import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import "./mobile.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import GlobalEnergyLayer from "@/components/site/GlobalEnergyLayer";

/**
 * Industrial typography stack — engineered, not editorial.
 *
 *   Geist           — display / headlines. Vercel's neo-grotesk. Tight,
 *                     controlled, infrastructural. Used at 700–900 for hero
 *                     and section heads. Line-height 1.04, tracking −0.04em.
 *
 *   Inter Tight     — body text. Slightly condensed Inter with neutral
 *                     warmth. 400–500 for readable UI copy, 1.55–1.65
 *                     line-height, tracking near zero.
 *
 *   Geist Mono      — numbers, telemetry labels, live pills, trust strip.
 *                     Tabular figures turned on for stat count-ups.
 *
 * Together: the Vercel / Linear / Anthropic / Palantir control-panel
 * aesthetic. No serif. No italic. No startup friendliness. Every glyph
 * reads as system output, not marketing.
 */

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PODOS · Syntropic — The New Physical Layer for AI",
  description:
    "PODOS builds deployable AI infrastructure. Syntropic multiplies the output of every GPU inside it. 1-MW modular supercomputers shipped in 90 days. 85× useful throughput per watt.",
  metadataBase: new URL("https://synthtropic-al.com"),
  openGraph: {
    title: "PODOS · Syntropic",
    description: "The AI economy needs a new physical layer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${interTight.variable} ${geistMono.variable}`}
    >
      <body>
        {/* GlobalEnergyLayer — site-wide ambient motion (scan beam,
            pulsing grid, brand sparks). Renders behind all content but
            above section backgrounds. Hidden under prefers-reduced-
            motion. See GlobalEnergyLayer.tsx for the full breakdown
            of what it paints and why. */}
        <GlobalEnergyLayer />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
