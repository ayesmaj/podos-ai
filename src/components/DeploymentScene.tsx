"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { deployEnvironments } from "@/data/siteContent";

gsap.registerPlugin(ScrollTrigger);

const ENV_ACCENTS: Record<string, string> = {
  "Industrial Site": "#f59e0b",
  "Solar Campus": "#10b981",
  "Edge Deployment": "#8b5cf6",
  "Technology Park": "#2563eb",
};

const ENV_FEATURES: Record<string, string[]> = {
  "Industrial Site": ["Up to 10 MW capacity", "Generator tie-in standard", "Heavy-duty cooling systems"],
  "Solar Campus": ["Renewable energy integration", "Net-zero operation ready", "Green energy certified"],
  "Edge Deployment": ["Sub-10ms latency targets", "Remote fleet management", "Cellular + satellite uplinks"],
  "Technology Park": ["Premium fibre connectivity", "Multi-tenant isolation", "24/7 on-site engineering"],
};

const ENV_ICONS: Record<string, React.ReactNode> = {
  "Industrial Site": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  "Solar Campus": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "Edge Deployment": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 12h20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  "Technology Park": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="7" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="3" width="7" height="19" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 11h2M5.5 14h2M5.5 17h2M16.5 7h2M16.5 10h2M16.5 13h2M16.5 16h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export default function DeploymentScene() {
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
          stagger: 0.1,
          ease: "power3.out",
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
      id="deployment"
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
        style={{ opacity: 0.08 }}
        src="/videos/particles-bg.mp4"
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(37,99,235,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Top horizon line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.25) 50%, transparent 100%)",
        }}
      />

      {/* Header */}
      <div
        ref={headerRef}
        style={{
          opacity: 0,
          textAlign: "center",
          marginBottom: "4rem",
          padding: "0 2rem",
        }}
      >
        <span
          className="text-label"
          style={{
            color: "var(--accent)",
            letterSpacing: "0.22em",
            display: "inline-block",
            marginBottom: "1.25rem",
          }}
        >
          Deploy Anywhere
        </span>
        <h2 className="text-headline" style={{ color: "var(--text-primary)" }}>
          One pod.<br />
          <span style={{ color: "var(--text-secondary)" }}>Any environment.</span>
        </h2>
        <p
          className="text-subhead"
          style={{
            color: "var(--text-secondary)",
            maxWidth: "30rem",
            margin: "1rem auto 0",
          }}
        >
          Desert heat, arctic cold, industrial power, renewable solar —
          PODOS pods are engineered for any deployment context.
        </p>
      </div>

      {/* Environment cards grid */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {deployEnvironments.map((env, i) => {
          const accent = ENV_ACCENTS[env.label];
          const features = ENV_FEATURES[env.label] ?? [];
          const icon = ENV_ICONS[env.label];

          return (
            <div
              key={env.label}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="group relative overflow-hidden"
              style={{
                opacity: 0,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderTop: `2px solid ${accent}`,
                borderRadius: 14,
                padding: "2rem 1.75rem",
                transition: "border-color 0.3s ease, background 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${accent}50`;
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.borderTopColor = accent;
                e.currentTarget.style.background = "rgba(255,255,255,0.025)";
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 30% 20%, ${accent}15 0%, transparent 60%)`,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
                ref={(el) => {
                  if (!el) return;
                  const card = el.parentElement;
                  if (!card) return;
                  card.addEventListener("mouseenter", () => {
                    el.style.opacity = "1";
                  });
                  card.addEventListener("mouseleave", () => {
                    el.style.opacity = "0";
                  });
                }}
              />

              <div className="relative">
                {/* Icon + number row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.25rem",
                  }}
                >
                  <span
                    className="text-mono"
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--text-muted)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ color: accent, opacity: 0.7 }}>{icon}</div>
                </div>

                {/* Name */}
                <h3
                  style={{
                    fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                    marginBottom: "0.4rem",
                  }}
                >
                  {env.label}
                </h3>

                {/* Sub */}
                <p
                  className="text-mono"
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.72rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {env.sub}
                </p>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {features.map((f) => (
                    <div
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: accent,
                          opacity: 0.5,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="text-mono"
                        style={{ color: "var(--text-muted)", fontSize: "0.62rem" }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
