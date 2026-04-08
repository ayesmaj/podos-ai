"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FLOW_STEPS = [
  {
    id: "grid",
    label: "Grid / Generator Input",
    value: "Up to 10 MW",
    svgX: 100,
    svgY: 96,
    color: "#f59e0b",
    posX: "7%",
    posY: "12%",
  },
  {
    id: "ups",
    label: "UPS + PDU Layer",
    value: "2N Redundancy",
    svgX: 100,
    svgY: 240,
    color: "#22d3ee",
    posX: "7%",
    posY: "46%",
  },
  {
    id: "compute",
    label: "GPU Compute Array",
    value: "256 Accelerators",
    svgX: 420,
    svgY: 168,
    color: "#2563eb",
    posX: "37%",
    posY: "28%",
  },
  {
    id: "heat",
    label: "Heat Extraction",
    value: "Rear-door HX",
    svgX: 720,
    svgY: 120,
    color: "#ef4444",
    posX: "67%",
    posY: "12%",
  },
  {
    id: "cool",
    label: "Cooling System",
    value: "PUE < 1.15",
    svgX: 720,
    svgY: 298,
    color: "#10b981",
    posX: "67%",
    posY: "55%",
  },
  {
    id: "monitor",
    label: "Real-time Monitoring",
    value: "Every 100ms",
    svgX: 420,
    svgY: 346,
    color: "#8b5cf6",
    posX: "37%",
    posY: "68%",
  },
];

const STATS = [
  { n: "< 1.15", label: "Power Usage Effectiveness" },
  { n: "100ms", label: "Thermal monitoring interval" },
  { n: "99.999%", label: "Power availability SLA" },
  { n: "−30°C", label: "Minimum operating ambient" },
];

export default function EnergyFlowScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll("path");
    if (!paths) return;

    paths.forEach((path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1.2,
        },
      });

      paths.forEach((path, i) => {
        tl.to(path, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, i * 0.15);
      });

      nodeRefs.current.forEach((node, i) => {
        if (!node) return;
        tl.fromTo(
          node,
          { opacity: 0, scale: 0.7, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" },
          i * 0.18
        );
      });

      if (statsRef.current) {
        tl.fromTo(
          statsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.9
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="energy"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--color-void)", paddingTop: "7rem", paddingBottom: "7rem" }}
    >
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.1 }}
        src="/videos/neural-bg.mp4"
      />

      {/* Top horizon line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.3) 50%, transparent 100%)",
        }}
      />

      {/* Central radial blue glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 45%, rgba(37,99,235,0.085) 0%, transparent 65%)",
        }}
      />
      {/* Outer vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(6,6,8,0.7) 100%)",
        }}
      />

      {/* ── Section Header ── */}
      <div
        className="flex flex-col items-center text-center"
        style={{ padding: "2.5rem 2rem 0", marginBottom: "4rem" }}
      >
        <span
          className="text-label mb-5"
          style={{ color: "var(--color-accent)", letterSpacing: "0.22em" }}
        >
          03 — Energy + Cooling Flow
        </span>
        <h2 className="text-headline" style={{ color: "var(--color-white)" }}>
          Power enters.<br />
          <span style={{ color: "var(--color-chrome)" }}>Heat never stays.</span>
        </h2>
        <p
          className="text-subhead mt-5"
          style={{ color: "var(--color-white-dim)", maxWidth: "32rem" }}
        >
          Every watt is tracked. Every degree of heat is captured and managed.
          This is what a PUE of under 1.15 looks like in practice.
        </p>
      </div>

      {/* ── Flow Diagram ── */}
      <div
        className="relative"
        style={{
          height: "520px",
          maxWidth: 1100,
          marginLeft: "auto",
          marginRight: "auto",
          padding: "0 2rem",
          background: "rgba(13,13,16,0.5)",
          border: "1px solid var(--color-edge)",
          boxShadow: "0 0 0 1px rgba(37,99,235,0.1), 0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Inner ambient glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 42% 35%, rgba(37,99,235,0.06) 0%, transparent 60%)",
          }}
        />

        {/* SVG connection lines */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 520"
          preserveAspectRatio="none"
        >
          {/* Defs: glow filter */}
          <defs>
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Subtle grid pattern */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <line key={`hg-${i}`} x1="0" y1={i * 52} x2="1000" y2={i * 52} stroke="rgba(37,99,235,0.04)" strokeWidth="0.5" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <line key={`vg-${i}`} x1={i * 80} y1="0" x2={i * 80} y2="520" stroke="rgba(37,99,235,0.04)" strokeWidth="0.5" />
          ))}

          {/* Grid → UPS */}
          <path
            d="M 100 96 L 100 240"
            fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.55"
            filter="url(#lineGlow)"
          />
          {/* UPS → Compute */}
          <path
            d="M 100 240 Q 260 240 420 168"
            fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.55"
            filter="url(#lineGlow)"
          />
          {/* Compute → Heat */}
          <path
            d="M 420 168 Q 570 144 720 120"
            fill="none" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.55"
            filter="url(#lineGlow)"
          />
          {/* Compute → Cooling */}
          <path
            d="M 420 168 Q 580 220 720 298"
            fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.55"
            filter="url(#lineGlow)"
          />
          {/* Compute → Monitor */}
          <path
            d="M 420 168 Q 420 250 420 346"
            fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.55"
            filter="url(#lineGlow)"
          />
        </svg>

        {/* Flow nodes */}
        {FLOW_STEPS.map((step, i) => (
          <div
            key={step.id}
            ref={(el) => { nodeRefs.current[i] = el; }}
            className="absolute"
            style={{
              left: step.posX,
              top: step.posY,
              transform: "translate(-0%, -50%)",
              opacity: 0,
              minWidth: 164,
              maxWidth: 200,
              /* Glass panel with colored left border */
              background: "rgba(13,13,16,0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderLeft: `2px solid ${step.color}`,
              boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.5), 0 0 24px ${step.color}30`,
              padding: "0.85rem 1.1rem",
            }}
          >
            {/* Colored dot */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.35rem",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: step.color,
                  boxShadow: `0 0 6px ${step.color}`,
                  flexShrink: 0,
                }}
              />
              <p
                className="text-mono"
                style={{
                  color: step.color,
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  lineHeight: 1.3,
                }}
              >
                {step.label}
              </p>
            </div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-white)",
                fontSize: "0.88rem",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              {step.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Stats Row ── */}
      <div
        ref={statsRef}
        className="grid grid-cols-2 md:grid-cols-4"
        style={{
          opacity: 0,
          maxWidth: 1100,
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 1,
          padding: "0 2rem",
          background: "var(--color-graphite)",
          border: "1px solid var(--color-edge)",
          borderTop: "none",
          boxShadow: "0 0 0 1px rgba(37,99,235,0.08), 0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="relative flex flex-col justify-center"
            style={{
              padding: "2.5rem 2rem",
              borderRight: i < STATS.length - 1 ? "1px solid var(--color-edge)" : "none",
            }}
          >
            {/* Faint accent glow behind number */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(37,99,235,0.06) 0%, transparent 70%)",
              }}
            />
            <p
              className="relative"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)",
                fontWeight: 300,
                color: "var(--color-white)",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                marginBottom: "0.6rem",
              }}
            >
              {s.n}
            </p>
            <p
              className="text-label relative"
              style={{ color: "var(--color-mist)", lineHeight: 1.5 }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
