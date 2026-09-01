"use client";

/**
 * SiteChrome — the site header for every route EXCEPT the homepage.
 *
 * Why this exists: the nav was mounted inside HeroVideoNarrative (a
 * homepage hero component) and the footer inside app/page.tsx, so every
 * other route — all the SEO pages, /platform, /invest, /configure —
 * rendered with no header and no footer at all. A visitor arriving from
 * search had no logo, no menu, and no way back to the site.
 *
 * The homepage keeps its own hero-pinned nav because its items are
 * in-page anchors driven by a scroll observer. Inner pages get ROUTE
 * links instead, with the current section passed as a controlled
 * activeHref (there are no anchors here for the observer to watch).
 *
 * The footer is mounted globally in app/layout.tsx — it is identical on
 * every page, so it does not belong to any one route.
 */

import Image from "next/image";
import { usePathname } from "next/navigation";
import NavHeader, { type NavItem } from "@/components/ui/nav-header";
import { PRICING } from "@/data/configuratorPricing";

/**
 * Route-based nav. Every href here resolves to a real page.tsx.
 * "Home" MUST stay first: NavHeader links its logo to items[0].href by
 * site convention, so anything else here sends the logo to the wrong page.
 */
const ROUTE_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/platform" },
  { label: "Engineering", href: "/engineering" },
  { label: "Deploy", href: "/deploy" },
  { label: "Use Cases", href: "/use-cases" },
  // Estimator appears only once a founder-approved price book exists —
  // same gate as the footer and the sitemap. See configuratorPricing.ts.
  ...(PRICING.approved ? [{ label: "Estimator", href: "/estimate" }] : []),
  { label: "Invest", href: "/invest" },
  { label: "Contact", href: "/#access" },
];

export default function SiteChrome() {
  const pathname = usePathname();

  // The homepage mounts its own anchor nav inside the hero.
  if (pathname === "/") return null;

  // Longest matching prefix wins, so /engineering/thermal-enclosure
  // highlights "Engineering" rather than nothing.
  const active = ROUTE_NAV.filter((i) => i.href !== "/#access")
    .filter((i) => pathname === i.href || pathname.startsWith(i.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none md:top-6">
      <div className="pointer-events-auto">
        <NavHeader
          items={ROUTE_NAV}
          activeHref={active}
          ariaLabel="PODOS AI site sections"
          logo={
            <Image src="/logo.png" alt="PODOS AI" width={1078} height={370} priority sizes="100px" />
          }
        />
      </div>
    </div>
  );
}
