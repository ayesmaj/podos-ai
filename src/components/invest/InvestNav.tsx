"use client";

/**
 * InvestNav — sticky glass navigation for the /invest page.
 * Transparent over the hero, frosts once the page scrolls.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/data/investContent";

export default function InvestNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(247,247,243,0.78)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(20,20,20,0.07)" : "1px solid transparent",
      }}
    >
      <div className="iv-container flex h-[68px] items-center justify-between">
        <Link
          href="/"
          className="font-semibold tracking-[0.22em] text-[15px]"
          style={{ fontFamily: "var(--iv-mono)" }}
        >
          PODOS
          <span className="ml-2 text-[10px] tracking-[0.28em]" style={{ color: "var(--iv-gold-deep)" }}>
            INVEST
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] font-medium transition-colors hover:opacity-100"
              style={{ color: "var(--iv-steel)" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#calculator" className="iv-btn iv-btn-primary !px-6 !py-2.5 !text-[13.5px]">
          Invest Now
        </a>
      </div>
    </header>
  );
}
