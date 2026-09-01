"use client";

/**
 * SiteHeader — the fixed glass pill nav for every page that isn't the
 * homepage.
 *
 * Why this exists: NavHeader is mounted inside HeroVideoNarrative, so only
 * "/" ever rendered site navigation. Every other route — the estimator and
 * all the SEO pillar pages people land on from search — had no header and no
 * way out except the breadcrumb. This mounts the same NavHeader with the same
 * markup the homepage uses.
 *
 * Hrefs are real page paths rather than the homepage's in-page anchors, so
 * they work from anywhere. "Contact" is the one anchor, pointing back to the
 * homepage CTA section (there is no standalone contact route).
 */

import Image from "next/image";
import NavHeader, { type NavItem } from "@/components/ui/nav-header";

const ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/platform" },
  { label: "Engineering", href: "/engineering" },
  { label: "Deploy", href: "/deploy" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Estimate", href: "/estimate" },
  { label: "Invest", href: "/invest" },
  { label: "Contact", href: "/#access" },
];

export default function SiteHeader() {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none md:top-6">
      <div className="pointer-events-auto">
        <NavHeader
          items={ITEMS}
          ariaLabel="PODOS AI site navigation"
          /* NavHeader wraps this slot in its own anchor to items[0].href —
             never nest another link inside it (invalid HTML, hydration error). */
          logo={<Image src="/logo.png" alt="PODOS AI" width={1078} height={370} sizes="100px" priority />}
        />
      </div>
    </div>
  );
}
