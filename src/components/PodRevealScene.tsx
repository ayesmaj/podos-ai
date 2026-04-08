"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  { label: "Liquid-Assisted Cooling", sub: "PUE < 1.15", color: "#60a5fa" },
  { label: "Airflow Management", sub: "Precision ventilation grid", color: "#93c5fd" },
  { label: "GPU Compute Array", sub: "Up to 256 accelerators", color: "#2563eb" },
  { label: "Power Distribution", sub: "2N redundancy standard", color: "#f59e0b" },
];

export default function PodRevealScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const podRef = useRef<HTMLDivElement>(null);
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
        podRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: podRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );

      cardRefs.current.filter(Boolean).forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="technology"
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
        style={{ opacity: 0.15 }}
        src="/videos/hero-bg.mp4"
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 40% 50%, rgba(37,99,235,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Top horizon line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.3) 50%, transparent 100%)",
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
          Inside the Pod
        </span>
        <h2 className="text-headline" style={{ color: "var(--text-primary)" }}>
          Engineered<br />
          <span style={{ color: "var(--text-secondary)" }}>from within.</span>
        </h2>
        <p
          className="text-subhead"
          style={{
            color: "var(--text-secondary)",
            maxWidth: "28rem",
            margin: "1rem auto 0",
          }}
        >
          Every PODOS pod is a self-contained compute unit — cooling, power, and
          GPU arrays integrated in one enclosure.
        </p>
      </div>

      {/* ── Content: Pod SVG + Layer cards ── */}
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          gap: "3rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Pod SVG illustration */}
        <div
          ref={podRef}
          className="relative"
          style={{
            opacity: 0,
            width: "clamp(260px, 28vw, 380px)",
            flexShrink: 0,
          }}
        >
          {/* Glow halo */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-15%",
              background:
                "radial-gradient(ellipse at center, rgba(37,99,235,0.1) 0%, transparent 65%)",
              filter: "blur(20px)",
            }}
          />

          <svg
            viewBox="0 0 320 500"
            fill="none"
            className="w-full h-auto relative"
            style={{ filter: "drop-shadow(0 0 30px rgba(37,99,235,0.12))" }}
          >
            {/* Outer enclosure */}
            <rect x="40" y="20" width="240" height="460" rx="10" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <rect x="40" y="20" width="240" height="460" rx="10" fill="rgba(255,255,255,0.02)" />
            <line x1="50" y1="20" x2="270" y2="20" stroke="#2563eb" strokeWidth="2" opacity="0.7" />
            <line x1="50" y1="480" x2="270" y2="480" stroke="#2563eb" strokeWidth="2" opacity="0.7" />
            <path d="M40 40 L40 20 L60 20" stroke="#2563eb" strokeWidth="1.5" opacity="0.6" fill="none" />
            <path d="M280 40 L280 20 L260 20" stroke="#2563eb" strokeWidth="1.5" opacity="0.6" fill="none" />
            <path d="M40 460 L40 480 L60 480" stroke="#2563eb" strokeWidth="1.5" opacity="0.6" fill="none" />
            <path d="M280 460 L280 480 L260 480" stroke="#2563eb" strokeWidth="1.5" opacity="0.6" fill="none" />
            <line x1="50" y1="135" x2="270" y2="135" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            <line x1="50" y1="250" x2="270" y2="250" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            <line x1="50" y1="365" x2="270" y2="365" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            <rect x="36" y="40" width="4" height="420" rx="2" fill="rgba(37,99,235,0.2)" />
            <rect x="280" y="40" width="4" height="420" rx="2" fill="rgba(37,99,235,0.2)" />

            {/* Cooling system */}
            <path d="M65 50 C65 50,90 60,90 90 C90 120,65 130,65 130" stroke="#60a5fa" strokeWidth="1.2" opacity="0.7" fill="none" />
            <path d="M100 50 C100 50,125 60,125 90 C125 120,100 130,100 130" stroke="#60a5fa" strokeWidth="1.2" opacity="0.7" fill="none" />
            <path d="M135 50 C135 50,160 60,160 90 C160 120,135 130,135 130" stroke="#60a5fa" strokeWidth="1.2" opacity="0.6" fill="none" />
            <rect x="180" y="55" width="80" height="65" rx="4" stroke="#60a5fa" strokeWidth="1" opacity="0.5" fill="rgba(96,165,250,0.06)" />
            {[0, 1, 2, 3, 4].map((j) => (
              <line key={`fin-${j}`} x1="190" y1={65 + j * 12} x2="250" y2={65 + j * 12} stroke="#60a5fa" strokeWidth="0.5" opacity="0.4" />
            ))}
            <text x="200" y="48" fill="#60a5fa" fontSize="8" fontFamily="monospace" opacity="0.7">COOLING SYS</text>

            {/* Ventilation grid */}
            {[0, 1, 2, 3, 4, 5, 6].map((j) => (
              <rect key={`vent-${j}`} x="60" y={148 + j * 14} width="200" height="6" rx="1" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="rgba(255,255,255,0.03)" />
            ))}
            <path d="M70 180 L70 160 L75 165" stroke="#93c5fd" strokeWidth="0.8" opacity="0.5" fill="none" />
            <path d="M140 180 L140 160 L145 165" stroke="#93c5fd" strokeWidth="0.8" opacity="0.5" fill="none" />
            <path d="M210 180 L210 160 L215 165" stroke="#93c5fd" strokeWidth="0.8" opacity="0.5" fill="none" />
            <text x="200" y="148" fill="#93c5fd" fontSize="8" fontFamily="monospace" opacity="0.6">AIRFLOW</text>

            {/* GPU compute array */}
            {[0, 1, 2, 3].map((row) => (
              <g key={`gpu-${row}`}>
                <rect x="60" y={262 + row * 24} width="200" height="18" rx="3" stroke="#2563eb" strokeWidth="1" opacity="0.6" fill="rgba(37,99,235,0.07)" />
                {[0, 1, 2, 3].map((col) => (
                  <rect key={`chip-${col}`} x={72 + col * 50} y={265 + row * 24} width="36" height="12" rx="1.5" stroke="#2563eb" strokeWidth="0.5" opacity="0.5" fill="rgba(37,99,235,0.12)" />
                ))}
                <circle cx="255" cy={271 + row * 24} r="2" fill="#2563eb" opacity="0.8">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin={`${row * 0.3}s`} />
                </circle>
              </g>
            ))}
            <line x1="60" y1="358" x2="260" y2="358" stroke="#2563eb" strokeWidth="0.5" opacity="0.4" strokeDasharray="4 4" />
            <text x="70" y="258" fill="#2563eb" fontSize="8" fontFamily="monospace" opacity="0.7">GPU ARRAY</text>

            {/* Power distribution */}
            <rect x="60" y="378" width="90" height="50" rx="4" stroke="#f59e0b" strokeWidth="1" opacity="0.5" fill="rgba(245,158,11,0.05)" />
            <rect x="170" y="378" width="90" height="50" rx="4" stroke="#f59e0b" strokeWidth="1" opacity="0.5" fill="rgba(245,158,11,0.05)" />
            <text x="80" y="408" fill="#f59e0b" fontSize="9" fontFamily="monospace" opacity="0.6">PDU-A</text>
            <text x="190" y="408" fill="#f59e0b" fontSize="9" fontFamily="monospace" opacity="0.6">PDU-B</text>
            <line x1="60" y1="440" x2="260" y2="440" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
            <line x1="60" y1="446" x2="260" y2="446" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
            <circle cx="90" cy="440" r="3" stroke="#f59e0b" strokeWidth="0.5" fill="rgba(245,158,11,0.2)" opacity="0.6" />
            <circle cx="160" cy="440" r="3" stroke="#f59e0b" strokeWidth="0.5" fill="rgba(245,158,11,0.2)" opacity="0.6" />
            <circle cx="230" cy="440" r="3" stroke="#f59e0b" strokeWidth="0.5" fill="rgba(245,158,11,0.2)" opacity="0.6" />
            <text x="70" y="375" fill="#f59e0b" fontSize="8" fontFamily="monospace" opacity="0.7">POWER DIST</text>
          </svg>
        </div>

        {/* Layer description cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            maxWidth: 360,
            flexGrow: 1,
          }}
        >
          {LAYERS.map((layer, i) => (
            <div
              key={layer.label}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{
                opacity: 0,
                padding: "1.25rem 1.5rem",
                background: "rgba(6,6,8,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderLeft: `3px solid ${layer.color}`,
                borderRadius: "0 10px 10px 0",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginBottom: "0.35rem",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: layer.color,
                    boxShadow: `0 0 8px ${layer.color}60`,
                    flexShrink: 0,
                  }}
                />
                <p
                  className="text-mono"
                  style={{
                    color: layer.color,
                    fontSize: "0.72rem",
                    letterSpacing: "0.06em",
                  }}
                >
                  {layer.label}
                </p>
              </div>
              <p
                className="text-mono"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.68rem",
                  paddingLeft: "calc(6px + 0.6rem)",
                }}
              >
                {layer.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
