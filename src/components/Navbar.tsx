"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Technology", href: "#technology" },
  { label: "Energy", href: "#energy" },
  { label: "Deployment", href: "#deployment" },
  { label: "Specs", href: "#specs" },
];

function AnimatedNavLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-block overflow-hidden no-underline"
      style={{ height: "1.1em", verticalAlign: "bottom" }}
    >
      <div
        className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2"
        style={{ lineHeight: "1.1em" }}
      >
        <span
          className="text-label block"
          style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}
        >
          {label}
        </span>
        <span
          className="text-label block"
          style={{ color: "var(--text-primary)", whiteSpace: "nowrap" }}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "80px top",
        onEnter: () => {
          gsap.to(navRef.current, {
            backgroundColor: "rgba(5,5,7,0.95)",
            backdropFilter: "blur(24px)",
            borderBottomColor: "rgba(255,255,255,0.07)",
            duration: 0.35,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(navRef.current, {
            backgroundColor: "rgba(5,5,7,0.6)",
            backdropFilter: "blur(16px)",
            borderBottomColor: "rgba(255,255,255,0.04)",
            duration: 0.35,
            ease: "power2.out",
          });
        },
      });
    });
    return () => ctx.revert();
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: 68,
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          backgroundColor: "rgba(5,5,7,0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div
          className="flex items-center justify-between h-full"
          style={{ maxWidth: 1400, margin: "0 auto", padding: "0 1.5rem" }}
        >
          {/* Logo */}
          <Link
            href="#hero"
            className="flex items-center no-underline shrink-0"
            style={{ zIndex: 1 }}
          >
            <Image
              src="/logo.png"
              alt="PODOS AI"
              width={130}
              height={44}
              priority
              style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
            />
          </Link>

          {/* Desktop center links */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <AnimatedNavLink key={link.label} label={link.label} href={link.href} />
            ))}
          </div>

          {/* Right side: CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="#contact"
              className="btn-primary hidden md:inline-flex"
              style={{ padding: "0.6rem 1.4rem", fontSize: "0.65rem", letterSpacing: "0.14em" }}
            >
              Contact Us
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-9 h-9"
              style={{ background: "none", border: "none", cursor: "pointer", gap: 0 }}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 1.5,
                  background: "var(--text-secondary)",
                  borderRadius: 2,
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                  transform: menuOpen ? "rotate(45deg) translate(0px, 5px)" : "none",
                  marginBottom: menuOpen ? 0 : 5,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 1.5,
                  background: "var(--text-secondary)",
                  borderRadius: 2,
                  transition: "opacity 0.2s ease",
                  opacity: menuOpen ? 0 : 1,
                  marginBottom: menuOpen ? 0 : 5,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 1.5,
                  background: "var(--text-secondary)",
                  borderRadius: 2,
                  transition: "transform 0.3s ease",
                  transform: menuOpen ? "rotate(-45deg) translate(0px, -5px)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className="fixed left-0 right-0 z-40 md:hidden flex flex-col items-center gap-6 py-8 overflow-hidden"
        style={{
          top: 68,
          background: "rgba(5,5,7,0.97)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          maxHeight: menuOpen ? 400 : 0,
          paddingTop: menuOpen ? "2rem" : 0,
          paddingBottom: menuOpen ? "2rem" : 0,
          transition: "max-height 0.4s ease, padding 0.4s ease",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-label no-underline"
            style={{ color: "var(--text-secondary)", letterSpacing: "0.18em" }}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="#contact"
          className="btn-primary"
          style={{ padding: "0.65rem 2rem", fontSize: "0.65rem", letterSpacing: "0.14em" }}
          onClick={() => setMenuOpen(false)}
        >
          Contact Us
        </Link>
      </div>
    </>
  );
}
