"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whyPoints } from "@/data/siteContent";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, React.ReactNode> = {
  deploy: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V5M12 5l-4 4M12 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  modular: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  cooling: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 4v16M4 12h16M7.76 7.76l8.48 8.48M16.24 7.76l-8.48 8.48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  energy: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4 14h8l-1 8 9-12h-8l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  enclosure: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 11h20M7 4v2M17 4v2M6 14h1M6 17h1M9 14h1M9 17h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export default function WhyPodos() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardRefs.current[0],
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why"
      className="relative w-full overflow-hidden"
      style={{ background: "#060608", paddingTop: "7rem", paddingBottom: "7rem" }}
    >
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.12 }}
        src="/videos/neural-bg.mp4"
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 90%, rgba(37,99,235,0.08) 0%, transparent 70%)",
        }}
      />
      {/* Top horizon line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.35) 50%, transparent 100%)",
        }}
      />

      {/* Section header */}
      <div
        ref={headerRef}
        className="text-center"
        style={{ opacity: 0, marginBottom: "3.5rem", maxWidth: 1200, marginLeft: "auto", marginRight: "auto", padding: "0 2.5rem" }}
      >
        <span
          className="text-label inline-block"
          style={{ color: "var(--accent)", letterSpacing: "0.22em", marginBottom: "1rem" }}
        >
          Why PODOS
        </span>
        <h2 className="text-headline mt-3" style={{ color: "var(--text-primary)" }}>
          The case for{" "}
          <span style={{ color: "var(--text-secondary)" }}>modular infrastructure.</span>
        </h2>
      </div>

      {/* Cards grid */}
      <div style={{ maxWidth: 1200, marginLeft: "auto", marginRight: "auto", padding: "0 2.5rem" }}>
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "1.25rem", maxWidth: 900, margin: "0 auto" }}
        >
          {whyPoints.map((point, i) => (
            <div
              key={point.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="group relative overflow-hidden"
              style={{
                opacity: 0,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "2rem 2rem",
                transition: "border-color 0.3s ease, background 0.3s ease",
                ...(i === 4 ? { gridColumn: "1 / -1", maxWidth: 440, justifySelf: "center" } : {}),
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(37,99,235,0.3)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.025)";
              }}
            >
              {/* Top accent line — appears on hover */}
              <div
                className="absolute top-0 left-0 right-0 pointer-events-none"
                style={{
                  height: 1,
                  background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
                ref={(el) => {
                  if (!el) return;
                  const card = el.closest(".group") as HTMLElement | null;
                  if (!card) return;
                  card.addEventListener("mouseenter", () => { el.style.opacity = "1"; });
                  card.addEventListener("mouseleave", () => { el.style.opacity = "0"; });
                }}
              />

              {/* Number + Icon row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <span
                  className="text-mono"
                  style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.2em" }}
                >
                  {point.label.split(" — ")[0]}
                </span>
                <div style={{ color: "var(--accent)", opacity: 0.7 }}>
                  {ICONS[point.id]}
                </div>
              </div>

              {/* Headline */}
              <h3 style={{
                fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
                marginBottom: "0.6rem",
              }}>
                {point.headline}
              </h3>

              {/* Body — trimmed */}
              <p style={{
                color: "var(--text-secondary)",
                fontSize: "0.78rem",
                lineHeight: 1.7,
              }}>
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
