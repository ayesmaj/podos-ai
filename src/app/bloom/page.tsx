import { Poppins, Source_Serif_4 } from "next/font/google";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Download,
  Menu,
  Sparkles,
  Wand2,
} from "lucide-react";
import "./bloom.css";

/* Brand-logo icons inlined as SVG components — lucide-react removed
   Twitter / Linkedin / Instagram from its ship list (they're brand
   marks, not generic icons). These match the lucide stroke style
   (24×24 viewBox, 2px stroke, round caps/joins) so visual rhythm
   matches the rest of the icon set. */
function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C21.18 7.773 22.392 5.59 22 4.01z" />
    </svg>
  );
}
function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/**
 * Bloom · AI-powered plant / floral design platform — hero landing.
 *
 * Architecture:
 *   • Full-bleed muted/looped video at z-0
 *   • Two-panel split (52% / 48%) at z-10, glass-morphism throughout
 *   • Strict grayscale palette — all warmth comes from the video
 *
 * This route lives separate from the PODOS AI investor site at /bloom.
 * Fonts are loaded at the page level so the rest of the app keeps its
 * existing Geist + Inter Tight + Geist Mono stack untouched.
 *
 * Asset notes:
 *   • /logo.png — currently the PODOS lockup; replace with bloom mark
 *   • Flower thumbnail in the bottom card uses /optimus/optimus-pod-front.png
 *     as a placeholder until @/assets/hero-flowers.png is provided.
 */

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic", "normal"],
  variable: "--font-source-serif",
  display: "swap",
});

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4";

export default function BloomPage() {
  return (
    <div
      className={`${poppins.variable} ${sourceSerif.variable} font-display relative min-h-screen w-full overflow-hidden bg-black text-white`}
    >
      {/* ── z-0 · full-bleed video background ─────────────────────── */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />

      {/* ── z-10 · two-panel split content ────────────────────────── */}
      <div className="relative z-10 flex min-h-screen w-full flex-row">
        {/* ============= LEFT PANEL (52%) ============= */}
        <section className="relative flex w-full flex-col p-4 lg:w-[52%] lg:p-6">
          {/* Heavy-glass overlay covering the whole left panel */}
          <div
            className="liquid-glass-strong absolute inset-4 rounded-3xl lg:inset-6"
            aria-hidden
          />

          {/* All actual content sits ABOVE the overlay */}
          <div className="relative z-10 flex h-full min-h-[calc(100vh-2rem)] flex-col p-6 lg:min-h-[calc(100vh-3rem)] lg:p-8">
            {/* Top nav: logo + Menu */}
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="bloom"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-md object-contain"
                />
                <span className="text-2xl font-semibold tracking-tighter text-white">
                  bloom
                </span>
              </div>
              <button
                type="button"
                className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white/80 transition-transform hover:scale-105"
              >
                <Menu className="h-4 w-4" />
                <span>Menu</span>
              </button>
            </nav>

            {/* Hero center — logo + headline + CTA + pill row */}
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <Image
                src="/logo.png"
                alt="bloom mark"
                width={80}
                height={80}
                className="mb-6 h-20 w-20 rounded-2xl object-contain"
                priority
              />

              <h1 className="mb-8 text-6xl font-medium leading-[0.95] tracking-[-0.05em] text-white lg:text-7xl">
                Innovating the
                <br />
                spirit of{" "}
                <em className="font-serif font-normal not-italic text-white/80">
                  <i className="italic">bloom</i>
                </em>{" "}
                AI
              </h1>

              <button
                type="button"
                className="liquid-glass-strong mb-6 flex items-center gap-3 rounded-full py-3 pl-6 pr-3 text-sm text-white transition-transform hover:scale-105 active:scale-95"
              >
                <span>Explore Now</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                  <Download className="h-3.5 w-3.5" />
                </span>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {["Artistic Gallery", "AI Generation", "3D Structures"].map(
                  (label) => (
                    <span
                      key={label}
                      className="liquid-glass rounded-full px-4 py-1.5 text-xs text-white/80"
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Bottom — quote block */}
            <footer className="mt-12 flex flex-col items-center text-center">
              <span className="mb-4 text-xs uppercase tracking-[0.3em] text-white/50">
                VISIONARY DESIGN
              </span>
              <p className="mb-3 max-w-xl text-lg text-white/80">
                <span className="font-display">We imagined a realm </span>
                <em className="font-serif italic text-white">
                  with no ending.
                </em>
              </p>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-white/30" />
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                  MARCUS AURELIO
                </span>
                <span className="h-px w-10 bg-white/30" />
              </div>
            </footer>
          </div>
        </section>

        {/* ============= RIGHT PANEL (48%) — desktop only ============= */}
        <aside className="relative hidden w-[48%] flex-col p-6 lg:flex">
          {/* Top bar: socials pill + account button */}
          <div className="flex items-center justify-between">
            <div className="liquid-glass flex items-center gap-2 rounded-full px-2 py-1.5">
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:text-white/80"
                aria-label="Twitter"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:text-white/80"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:text-white/80"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <span className="ml-2 mr-1 text-white/70">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <button
              type="button"
              className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
              aria-label="Account"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          </div>

          {/* Community card */}
          <div className="liquid-glass mt-6 w-56 rounded-2xl p-4">
            <h3 className="mb-1 text-sm font-medium text-white">
              Enter our ecosystem
            </h3>
            <p className="text-xs leading-relaxed text-white/60">
              Join a community of designers cultivating ideas through
              generative botanical AI.
            </p>
          </div>

          {/* Bottom feature container — pushed to bottom via mt-auto */}
          <div className="liquid-glass-strong mt-auto rounded-[2.5rem] p-3">
            {/* Two side-by-side cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="liquid-glass rounded-3xl p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Wand2 className="h-5 w-5 text-white" />
                </div>
                <h4 className="mb-1 text-sm font-medium text-white">
                  Processing
                </h4>
                <p className="text-xs leading-relaxed text-white/60">
                  Real-time generative pipelines for floral synthesis.
                </p>
              </div>
              <div className="liquid-glass rounded-3xl p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h4 className="mb-1 text-sm font-medium text-white">
                  Growth Archive
                </h4>
                <p className="text-xs leading-relaxed text-white/60">
                  Every iteration cataloged across 3D bloom states.
                </p>
              </div>
            </div>

            {/* Bottom card — flower thumb + title + + button */}
            <div className="liquid-glass mt-3 flex items-center gap-4 rounded-3xl p-3">
              {/* Flower thumb placeholder. When @/assets/hero-flowers.png
                  becomes available, swap the src below to that path. */}
              <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-white/5">
                <Image
                  src="/optimus/optimus-pod-front.png"
                  alt="Floral structure preview"
                  fill
                  className="object-cover opacity-70"
                  sizes="96px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-white">
                  Advanced Plant Sculpting
                </h4>
                <p className="truncate text-xs text-white/60">
                  Procedural petal generation with morphing controls.
                </p>
              </div>
              <button
                type="button"
                className="liquid-glass flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
                aria-label="Open"
              >
                <span className="text-lg leading-none">+</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
