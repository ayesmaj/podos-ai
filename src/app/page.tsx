import Image from "next/image";
import HeroAIWall from "@/components/site/HeroAIWall";
import PodosScrollHeroIntro from "@/components/site/PodosScrollHeroIntro";
import ProblemDiagnosis from "@/components/site/ProblemDiagnosis";
import PodosPod from "@/components/site/PodosPod";
import SyntropicCompression from "@/components/site/SyntropicCompression";
import SyntropicConsole from "@/components/site/SyntropicConsole";
import FusionCompute from "@/components/site/FusionCompute";
import NvidiaBlueprint from "@/components/site/NvidiaBlueprint";
import MarketOpportunity from "@/components/site/MarketOpportunity";
import CompetitiveMatrix from "@/components/site/CompetitiveMatrix";
import IPPortfolio from "@/components/site/IPPortfolio";
import InvestorTraction from "@/components/site/InvestorTraction";
import UseOfFunds from "@/components/site/UseOfFunds";
import RequestAccessCTA from "@/components/site/RequestAccessCTA";
import ScrollProgressRail from "@/components/site/ScrollProgressRail";
import NavHeader, { type NavItem } from "@/components/ui/nav-header";

/**
 * Sticky glass-bubble nav — 7 items, coarse-grained chapter rhythm.
 *
 * Why 7 and not 13:
 *   The full narrative has 13 sections. That's too many for a pill-nav
 *   — investors would lose the "oh, that's where I am" cue at a glance.
 *   Seven items fits the deck's rhythm without overflowing the pill on
 *   desktop (≈640px wide at md:text-[13px]). The ScrollProgressRail on
 *   the right still carries the fine-grained 1-through-13 counter.
 *
 * Why these specific anchors:
 *   - #top              → HeroAIWall (entry / section 01) — dock point
 *                          for active-state cursor on first paint
 *   - #problem          → ProblemDiagnosis (section 02)
 *   - #podos            → PodosPod; entry-point for the
 *                          PODOS+SYNTROPIC+FUSION "what we're selling"
 *                          block
 *   - #syntropic-console → SyntropicConsole (the operator-surface demo
 *                          with the live globe — the most investor-
 *                          friendly "show, don't tell" surface)
 *   - #market           → MarketOpportunity (TAM/SAM/SOM)
 *   - #ip-portfolio     → IPPortfolio (the 76-patent moat)
 *   - #use-of-funds     → UseOfFunds (the $10.5M ask)
 *
 * Note: mockup routes mount the SAME NavHeader with "/#…"-prefixed
 * hrefs via src/app/mockups/layout.tsx — so clicking a nav item from
 * any /mockups/* page takes the reviewer back to the main site at the
 * right section. Design-review continuity without duplicating the nav.
 */
const SITE_NAV: NavItem[] = [
  { label: "Home", href: "#top" },
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#podos" },
  { label: "Console", href: "#syntropic-console" },
  { label: "Market", href: "#market" },
  { label: "Moat", href: "#ip-portfolio" },
  { label: "Invest", href: "#use-of-funds" },
];

/**
 * California Modulars — Investor Site
 * (Optimus hardware + Syntropic software)
 *
 * Design pivot: light cyber-tech aesthetic. Geist / Inter Tight / Geist
 * Mono. Blue→cyan brand gradient derived from the PODOS AI logo. Green
 * reserved for LIVE/healthy-status signals only. No dark-luxury anywhere.
 *
 * Narrative arc (matches the investor-deck order):
 *
 *   1. HERO       — the new physical layer           ← shipped
 *   2. PROBLEM    — diagnosis dashboard              ← shipped
 *   3. PODOS      — hardware + ladder + principles   ← shipped
 *   4. SYNTROPIC  — software intelligence            ← shipped
 *  4½. CONSOLE    — operator surface (day-1 preview) ← shipped
 *   5. FUSION     — 85× climax + economics ledger    ← shipped
 *  5½. BLUEPRINT  — $3.4T Nvidia parallel            ← shipped
 *   6. MARKET     — TAM / SAM / SOM waterfall        ← shipped (new)
 *   7. COMPETITION— clean head-to-head comparison    ← shipped
 *   8. IP         — 76+ patent moat (Optimus + Syn)  ← shipped (new)
 *   9. TRACTION   — team + milestones + dashboard    ← shipped
 *  10. USE OF FUNDS — $10.5M allocation + promise    ← shipped (new)
 *  11. CTA        — earliest entry point             ← shipped
 *
 * Why the three new sections sit where they do:
 *
 *   MARKET between BLUEPRINT and COMPETITION: BLUEPRINT reframes the
 *   opportunity as Nvidia-shaped. MARKET immediately grounds that
 *   reframe in TAM/SAM/SOM numbers so COMPETITION reads as "why we
 *   win a real category" rather than "is there a category at all".
 *
 *   IP between COMPETITION and TRACTION: after COMPETITION proves
 *   "no one else has this", IP documents *exactly what this is* —
 *   76 claims across Optimus + Syntropic. TRACTION then shows the
 *   team shipping against that defensible moat.
 *
 *   USE OF FUNDS between TRACTION and CTA: once the LP has seen the
 *   team and the milestones, the "where the $10.5M goes" breakdown
 *   answers the final underwriting question before the ask. CTA
 *   then closes with deal terms and the return ladder.
 */
export default function Home() {
  return (
    <>
      {/*
        Sticky pill-rail nav. Sits in a `fixed` wrapper so it pins to the top
        of the viewport as the page scrolls — independent of the main flow so
        it doesn't steal layout space from HeroAIWall's full-bleed composition.
        The outer wrapper is `pointer-events-none` so stray clicks in the
        gutter pass through to content behind; the inner pill is
        `pointer-events-auto` so the nav itself is interactive. z-50 keeps it
        above section content but well below anything that might be modal in
        the future.
      */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none md:top-6">
        <div className="pointer-events-auto">
          <NavHeader
            items={SITE_NAV}
            ariaLabel="PODOS investor site sections"
            logo={
              /*
                PODOS AI brand lockup, embedded INSIDE the glass bubble
                (left of the tab row). Lives in the sticky nav now, not
                the hero, so it travels with the user as they scroll.

                Asset is 1078×370 native (~2.91:1). The CSS module
                constrains height to 24px (mobile) / 28px (desktop)
                inside the .logoSlot, with width:auto to preserve
                aspect — so sizes="100px" gives the next/image loader
                enough headroom for retina without over-fetching.

                priority=true because this paints in the first viewport
                on every page load (sticky nav is always visible).
              */
              <Image
                src="/logo.png"
                alt="PODOS AI"
                width={1078}
                height={370}
                priority
                sizes="100px"
              />
            }
          />
        </div>
      </div>

      <main>
        {/* Cinematic scroll-driven intro — 400vh sticky runway that
            scrubs the campus video and crossfades 5 text steps. Lands
            on the PODOS AI logo, then releases into the rest of the
            site below. Investors see the intro on first load. */}
        <PodosScrollHeroIntro />
        <HeroAIWall />
        <ProblemDiagnosis />
        <PodosPod />
        <SyntropicCompression />
        <SyntropicConsole />
        <FusionCompute />
        <NvidiaBlueprint />
        <MarketOpportunity />
        <CompetitiveMatrix />
        <IPPortfolio />
        <InvestorTraction />
        <UseOfFunds />
        <RequestAccessCTA />
      </main>
      <ScrollProgressRail />
    </>
  );
}
