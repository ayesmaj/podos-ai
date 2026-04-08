"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REQUEST_TYPES = [
  { label: "Technical Call", tag: "30 min" },
  { label: "Presentation", tag: "Deck" },
  { label: "Deployment", tag: "Scoping" },
];

export default function CTAControlPanel() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = contentRef.current?.children;
      if (!els) return;
      gsap.fromTo(
        Array.from(els),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--void)", paddingTop: "7rem", paddingBottom: "7rem" }}
    >
      {/* Video background — very subtle */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.1 }}
        src="/videos/particles-bg.mp4"
      />

      {/* Single centered glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 40%, rgba(37,99,235,0.07) 0%, transparent 70%)",
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

      {/* ── Content ── */}
      <div
        ref={contentRef}
        className="relative"
        style={{ maxWidth: 720, margin: "0 auto", padding: "0 2rem" }}
      >
        {/* Header — tight, no fluff */}
        <div style={{ opacity: 0, marginBottom: "4rem", textAlign: "center" }}>
          <h2 className="text-headline" style={{ color: "var(--text-primary)" }}>
            Ready to deploy?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              marginTop: "1rem",
              lineHeight: 1.6,
            }}
          >
            Our infrastructure team responds within 24 hours.
          </p>
        </div>

        {/* ── Form panel — single clean card ── */}
        <div
          style={{
            opacity: 0,
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {sent ? (
            /* ── Success state ── */
            <div
              style={{
                padding: "4rem 3rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "1.5px solid #22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#22c55e",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p style={{ color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 600 }}>
                  Request sent
                </p>
                <p className="text-mono" style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "0.8rem" }}>
                  We&rsquo;ll reach <span style={{ color: "var(--text-primary)" }}>{email}</span> within 24 hours.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* ── Request type selector — horizontal tabs ── */}
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {REQUEST_TYPES.map((type, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelected(i)}
                    style={{
                      flex: 1,
                      padding: "1.1rem 1rem",
                      background: selected === i ? "rgba(37,99,235,0.08)" : "transparent",
                      borderBottom: selected === i ? "2px solid var(--accent)" : "2px solid transparent",
                      color: selected === i ? "var(--text-primary)" : "var(--text-muted)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      border: "none",
                      borderBottomStyle: "solid",
                      borderBottomWidth: "2px",
                      borderBottomColor: selected === i ? "var(--accent)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {type.label}
                    <span
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 500,
                        color: selected === i ? "var(--accent)" : "var(--text-muted)",
                        opacity: 0.7,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {type.tag}
                    </span>
                  </button>
                ))}
              </div>

              {/* ── Form fields ── */}
              <div style={{ padding: "2.5rem 2.5rem 2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {([
                    { label: "Name", value: name, set: setName, placeholder: "Jane Smith", type: "text" },
                    { label: "Work Email", value: email, set: setEmail, placeholder: "jane@company.com", type: "email" },
                    { label: "Organisation", value: org, set: setOrg, placeholder: "ACME Corp", type: "text" },
                  ] as const).map((field) => (
                    <div key={field.label}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        required
                        value={field.value}
                        onChange={(e) =>
                          (field.set as React.Dispatch<React.SetStateAction<string>>)(e.target.value)
                        }
                        placeholder={field.placeholder}
                        style={{
                          width: "100%",
                          border: "none",
                          borderBottom: "1px solid rgba(255,255,255,0.12)",
                          background: "transparent",
                          padding: "0.7rem 0",
                          color: "var(--text-primary)",
                          fontSize: "0.9rem",
                          fontFamily: "var(--font-geist-sans)",
                          outline: "none",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderBottomColor = "var(--accent)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.12)";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Submit row ── */}
              <div
                style={{
                  padding: "0 2.5rem 2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                }}
              >
                <p
                  className="text-mono"
                  style={{ color: "var(--text-muted)", fontSize: "0.62rem", lineHeight: 1.6 }}
                >
                  inquiries@podosai.com
                </p>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "0.75rem 2.5rem", fontSize: "0.7rem", flexShrink: 0 }}
                >
                  Send Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
