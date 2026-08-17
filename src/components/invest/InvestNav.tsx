"use client";

/**
 * InvestNav — sticky glass navigation for the /invest page.
 * Transparent over the hero, frosts once the page scrolls.
 */

import Image from "next/image";
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
        <Link href="/" aria-label="PODOS AI — home">
          <Image
            src="/podos-invest-logo.png"
            alt="PODOS AI Invest — Infrastructure, Intelligence, Impact"
            width={2172}
            height={724}
            priority
            sizes="150px"
            style={{ width: "auto", height: 44 }}
          />
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

        <a href="#access" className="iv-btn iv-btn-primary !px-6 !py-2.5 !text-[13.5px]">
          Investor Access
        </a>
      </div>
    </header>
  );
}
