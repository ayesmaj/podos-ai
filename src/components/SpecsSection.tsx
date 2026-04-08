"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { podSpecs, techSpecs } from "@/data/siteContent";

gsap.registerPlugin(ScrollTrigger);

/** Scramble-reveal: rapidly cycles random chars before settling on real value */
function scrambleText(el: HTMLElement, finalValue: string, duration = 0.9) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]";
  const len = finalValue.length;
  let frame = 0;
  const totalFrames = Math.round(duration * 60);

  const tick = () => {
    frame++;
    const progress = frame / totalFrames;
    const revealed = Math.floor(progress * len);
    let output = "";
    for (let i = 0; i < len; i++) {
      if (i < revealed) {
        output += finalValue[i];
      } else {
        output += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    el.textContent = output;
    if (frame < totalFrames) requestAnimationFrame(tick);
    else el.textContent = finalValue;
  };
  requestAnimationFrame(tick);
}

export default function SpecsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const specValueRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const specRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const techGroupRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 80%", toggleActions: "play none none none" },
        }
      );

      specRowRefs.current.forEach((el, i) => {
        if (!el) return;
        const valueEl = specValueRefs.current[i];
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1, y: 0, duration: 0.65, ease: "power2.out",
            delay: i * 0.07,
            scrollTrigger: { trigger: el, start: "top 84%", toggleActions: "play none none none" },
            onStart: () => {
              if (valueEl) scrambleText(valueEl, valueEl.dataset.value ?? "", 0.85);
            },
          }
        );
      });

      techGroupRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="specs"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--surface)", paddingTop: "7rem", paddingBottom: "7rem" }}
    >
      {/* Top horizon line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.25) 50%, transparent 100%)",
        }}
      />

      {/* Ambient center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(37,99,235,0.055) 0%, transparent 70%)",
        }}
      />

      {/* ── Constrained container ── */}
      <div style={{ maxWidth: 1200, marginLeft: "auto", marginRight: "auto", padding: "0 2.5rem" }}>

        {/* ── Section Header ── */}
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center"
          style={{
            opacity: 0,
            marginBottom: "3.5rem",
          }}
        >
          <span
            className="text-label"
            style={{ color: "var(--accent)", letterSpacing: "0.22em", marginBottom: "1rem" }}
          >
            Technical Specifications
          </span>
          <h2 className="text-headline" style={{ color: "var(--text-primary)" }}>
            Built to spec.<br />
            <span style={{ color: "var(--text-secondary)" }}>Verified in the field.</span>
          </h2>
        </div>

        {/* ── Key Specs — 6-cell grid ── */}
        <div
          className="grid grid-cols-2 md:grid-cols-3"
          style={{
            background: "var(--border)",
            gap: "1px",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: "3rem",
          }}
        >
          {podSpecs.map((spec, i) => (
            <div
              key={spec.label}
              ref={(el) => { specRowRefs.current[i] = el; }}
              className="group relative overflow-hidden"
              style={{
                opacity: 0,
                background: "var(--void)",
                padding: "2.5rem 2rem",
              }}
            >
              {/* Hover top border slides in */}
              <div
                className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, var(--accent), var(--accent-bright))",
                  transition: "width 0.45s cubic-bezier(0.4,0,0.2,1)",
                }}
              />

              {/* Hover inner glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 70% at 20% 20%, rgba(37,99,235,0.10) 0%, transparent 60%)",
                }}
              />

              <div className="relative z-10">
                {/* Label */}
                <span
                  className="text-label block mb-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  {spec.label}
                </span>

                {/* Big mono value — scrambled on enter */}
                <p
                  ref={(el) => { specValueRefs.current[i] = el; }}
                  data-value={spec.value}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(1.1rem, 2.2vw, 1.75rem)",
                    fontWeight: 300,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.1,
                    marginBottom: "0.5rem",
                  }}
                >
                  {spec.value}
                </p>

                {/* Unit in accent */}
                <p
                  className="text-mono"
                  style={{
                    color: "var(--accent)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {spec.unit}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tech Specs — 4-column category grid ── */}
        <div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: "var(--border)", borderRadius: 12, overflow: "hidden" }}
        >
          {techSpecs.map((group, i) => (
            <div
              key={group.category}
              ref={(el) => { techGroupRefs.current[i] = el; }}
              className="relative"
              style={{
                opacity: 0,
                background: "var(--void)",
                padding: "2rem 1.75rem",
              }}
            >
              {/* Category header */}
              <div
                className="flex items-center gap-2.5 mb-5 pb-3"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <span
                  className="inline-block flex-shrink-0"
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    boxShadow: "0 0 6px rgba(37,99,235,0.6)",
                  }}
                />
                <h4
                  className="text-label"
                  style={{ color: "var(--accent)", letterSpacing: "0.18em", fontSize: "0.6rem" }}
                >
                  {group.category}
                </h4>
              </div>

              {/* Items */}
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5"
                    style={{ paddingBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <span
                      className="flex-shrink-0"
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: "var(--text-muted)",
                        marginTop: 6,
                        opacity: 0.5,
                      }}
                    />
                    <span
                      className="text-mono"
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.7rem",
                        lineHeight: 1.6,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
