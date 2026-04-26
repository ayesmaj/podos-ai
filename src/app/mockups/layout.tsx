import type { Metadata } from "next";
import Image from "next/image";
import DirectionSwitcher from "@/components/mockups/DirectionSwitcher";
import NavHeader, { type NavItem } from "@/components/ui/nav-header";
import "./mockups.css";

export const metadata: Metadata = {
  title: "PODOS AI — Direction Mockups",
  description: "Three hero directions for the PODOS AI investor site.",
};

/**
 * Mockup-route nav items. These mirror the main-site SITE_NAV in
 * src/app/page.tsx but with a leading "/" on every href.
 *
 * Why "/"-prefixed hrefs:
 *   On the main site, "#problem" is a same-document anchor jump. On a
 *   /mockups/* page, the #problem element doesn't exist (mockups are
 *   self-contained routes). Prefixing with "/" makes the browser do a
 *   cross-route navigation back to the home route, then anchor-scroll
 *   to #problem after the route swap. The NavHeader's
 *   IntersectionObserver still runs on mockup routes, finds zero
 *   matching ids, and quietly no-ops — the cursor parks on items[0].
 *
 *   That's exactly what "design-review continuity" means: while
 *   reviewing a mockup, the reviewer can click any section name and
 *   land in the same place on the real site with one click.
 */
const MOCKUP_NAV: NavItem[] = [
  { label: "Home", href: "/#top" },
  { label: "Problem", href: "/#problem" },
  { label: "Solution", href: "/#podos" },
  { label: "Console", href: "/#syntropic-console" },
  { label: "Market", href: "/#market" },
  { label: "Moat", href: "/#ip-portfolio" },
  { label: "Invest", href: "/#use-of-funds" },
];

export default function MockupsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-route="mockups">
      {/*
        Sticky glass-bubble nav, mounted on every /mockups/* route for
        design-review continuity with the main site. Same visual
        primitive as src/app/page.tsx; different items list (prefixed
        with "/" for cross-route anchor navigation). See NavHeader's
        module comment for the fixed-wrapper / pointer-events reasoning.
      */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none md:top-6">
        <div className="pointer-events-auto">
          <NavHeader
            items={MOCKUP_NAV}
            ariaLabel="PODOS investor site sections"
            logo={
              /*
                Same brand lockup as the main site (see app/page.tsx for
                full reasoning). Mockup routes mount NavHeader through
                this layout so the logo + tabs travel together across
                /mockups/* — clicking the logo navigates to "/" (because
                the home item in MOCKUP_NAV is "/#top", and NavHeader
                binds the logo's href to items[0].href).
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

      {children}

      {/* The DirectionSwitcher is mockup-specific chrome — it lets the
          reviewer flip between industrial/hyperscaler/prospectus
          directions. Kept separate from the site nav because its
          audience is "us reviewing options", not "LPs reading the
          deck". */}
      <DirectionSwitcher />
    </div>
  );
}
