"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hero } from "@/data/siteContent";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

/* ── Particle + energy canvas system ── */
function initParticles(
  canvas: HTMLCanvasElement,
  mouse: React.RefObject<{ x: number; y: number }>
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  const onResize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", onResize);

  const COUNT = 60;
  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.2,
    vy: -Math.random() * 0.3 - 0.05,
    r: Math.random() * 1.5 + 0.3,
    a: Math.random() * 0.25 + 0.05,
  }));

  let raf: number;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const mx = mouse.current.x;
    const my = mouse.current.y;

    /* Horizontal energy scan lines — shift with mouse */
    ctx.strokeStyle = "rgba(37,99,235,0.04)";
    ctx.lineWidth = 0.5;
    const t = Date.now() * 0.0001;
    for (let i = 0; i < 4; i++) {
      const yy = ((t + i * 0.25) % 1) * h;
      ctx.beginPath();
      ctx.moveTo(0, yy);
      ctx.lineTo(w, yy + (mx - 0.5) * 15);
      ctx.stroke();
    }

    /* Particles */
    for (const p of particles) {
      const dx = mx * w - p.x;
      const dy = my * h - p.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const pull = Math.max(0, 1 - d / 400) * 0.002;

      p.x += p.vx + dx * pull;
      p.y += p.vy + dy * pull;

      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,165,250,${p.a})`;
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  };
  draw();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
  };
}

export default function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  /* Canvas particles + energy lines */
  useEffect(() => {
    if (!canvasRef.current) return;
    return initParticles(canvasRef.current, mouseRef);
  }, []);

  /* Mouse tracking */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  /* GSAP entrance + scroll */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      /* Eyebrow — scale + fade */
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 16, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }
      );

      /* Headline words — staggered with skew */
      const words = headlineRef.current?.children;
      if (words) {
        tl.fromTo(
          Array.from(words),
          { opacity: 0, y: 50, skewY: 3 },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 1.1,
            stagger: 0.18,
            ease: "power3.out",
          },
          "-=0.5"
        );
      }

      /* Sub text */
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
        "-=0.6"
      );

      /* CTA buttons */
      tl.fromTo(
        ctaRef.current?.children ?? [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" },
        "-=0.5"
      );

      /* Glow pulse on the gradient headline ("a System.") */
      if (words && words[2]) {
        gsap.to(words[2], {
          textShadow: "0 0 40px rgba(59,130,246,0.3)",
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2,
        });
      }

      /* LED blinking — randomized */
      const leds = sectionRef.current?.querySelectorAll("[data-led]");
      if (leds) {
        leds.forEach((led) => {
          gsap.to(led, {
            opacity: 0.7,
            duration: 0.2,
            repeat: -1,
            yoyo: true,
            repeatDelay: 1.5 + Math.random() * 4,
            delay: Math.random() * 5,
            ease: "power2.inOut",
          });
        });
      }

      /* Scroll fade-out */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (overlayRef.current) {
            gsap.set(overlayRef.current, { opacity: self.progress * 0.85 });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full"
      style={{ height: "100svh" }}
    >
      {/* ── Layer 0: Video background ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ background: "#060608" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
          style={{ opacity: 0.55 }}
          src="/videos/hero-bg.mp4"
        />
        {/* Dark overlay for text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(6,6,8,0.7) 0%, rgba(6,6,8,0.3) 50%, rgba(6,6,8,0.6) 100%)",
          }}
        />
      </div>

      {/* ── Layer 1: Particle + energy canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* ── Layer 1b: SVG edge energy lines ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <line
          x1="5%"
          y1="0"
          x2="5%"
          y2="100%"
          stroke="#2563eb"
          strokeWidth="0.5"
          opacity="0.06"
        />
        <line
          x1="95%"
          y1="0"
          x2="95%"
          y2="100%"
          stroke="#2563eb"
          strokeWidth="0.5"
          opacity="0.06"
        />
        <line
          x1="0"
          y1="88%"
          x2="100%"
          y2="88%"
          stroke="#2563eb"
          strokeWidth="0.5"
          opacity="0.04"
        />
      </svg>

      {/* ── Layer 1c: LED strip across top ── */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-between pointer-events-none"
        style={{ padding: "0 8%", zIndex: 1, height: 2 }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            data-led
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "#3b82f6",
              opacity: 0,
              boxShadow: "0 0 4px #3b82f6",
            }}
          />
        ))}
      </div>

      {/* ── Layer 2: Depth fog overlays ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 70% at 50% 100%, rgba(6,6,8,0.5) 0%, transparent 55%)",
          zIndex: 2,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(37,99,235,0.04) 0%, transparent 60%)",
          zIndex: 2,
        }}
      />

      {/* Scroll-out overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--void)", opacity: 0, zIndex: 4 }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "35%",
          background:
            "linear-gradient(to top, var(--void) 0%, transparent 100%)",
          zIndex: 3,
        }}
      />

      {/* ── Layer 3: Hero content ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 5 }}
      >
        <div
          className="w-full flex flex-col items-center text-center"
          style={{ maxWidth: 800, padding: "0 2rem" }}
        >
          {/* Eyebrow badge — glass */}
          <span
            ref={eyebrowRef}
            className="inline-flex items-center"
            style={{
              opacity: 0,
              gap: "0.5rem",
              marginBottom: "2rem",
              border: "1px solid rgba(37,99,235,0.3)",
              borderRadius: 999,
              padding: "0.4rem 1rem",
              background: "rgba(37,99,235,0.06)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent-bright)",
                boxShadow: "0 0 8px rgba(59,130,246,0.8)",
                flexShrink: 0,
              }}
            />
            <span
              className="text-label"
              style={{
                color: "var(--text-accent)",
                letterSpacing: "0.18em",
              }}
            >
              {hero.eyebrow}
            </span>
          </span>

          {/* Headline — staggered words */}
          <div ref={headlineRef}>
            <h1
              className="text-display block"
              style={{ opacity: 0, color: "var(--text-primary)" }}
            >
              {hero.headline[0]}
            </h1>
            <h1
              className="text-display block"
              style={{ opacity: 0, color: "var(--text-primary)" }}
            >
              {hero.headline[1]}
            </h1>
            <h1
              className="text-display text-gradient block"
              style={{ opacity: 0 }}
            >
              {hero.headline[2]}
            </h1>
          </div>

          {/* Subtext */}
          <p
            ref={subRef}
            className="text-subhead"
            style={{
              opacity: 0,
              color: "var(--text-secondary)",
              maxWidth: "30rem",
              marginTop: "1.5rem",
            }}
          >
            {hero.sub}
          </p>

          {/* CTA buttons — glass style */}
          <div
            ref={ctaRef}
            className="flex flex-row flex-wrap justify-center pointer-events-auto"
            style={{ gap: "0.75rem", marginTop: "2.5rem" }}
          >
            {hero.cta.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={item.primary ? "btn-primary" : "btn-ghost"}
                style={{
                  opacity: 0,
                  backdropFilter: "blur(8px)",
                  boxShadow: item.primary
                    ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(37,99,235,0.15)"
                    : "inset 0 1px 0 rgba(255,255,255,0.05)",
                  transition:
                    "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  if (item.primary) {
                    e.currentTarget.style.boxShadow =
                      "inset 0 1px 0 rgba(255,255,255,0.15), 0 0 35px rgba(37,99,235,0.3)";
                  } else {
                    e.currentTarget.style.boxShadow =
                      "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(37,99,235,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = item.primary
                    ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(37,99,235,0.15)"
                    : "inset 0 1px 0 rgba(255,255,255,0.05)";
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Status readout — top right */}
      <div
        className="absolute top-20 right-8 text-mono hidden md:flex flex-col items-end"
        style={{ gap: "0.4rem", opacity: 0.22, zIndex: 5 }}
      >
        {(
          [
            ["SYS", "ONLINE"],
            ["PWR", "NOMINAL"],
            ["TMP", "32\u00B0C"],
            ["POD", "\u00D708 READY"],
          ] as const
        ).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              style={{
                color: "var(--text-muted)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
              }}
            >
              {key}
            </span>
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.58rem",
              }}
            >
              ·
            </span>
            <span
              style={{
                color: "var(--accent-bright)",
                fontSize: "0.58rem",
                letterSpacing: "0.12em",
              }}
            >
              {val}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom-left coordinate */}
      <div
        className="absolute bottom-8 left-8 text-mono hidden md:block"
        style={{
          opacity: 0.18,
          fontSize: "0.55rem",
          letterSpacing: "0.12em",
          zIndex: 5,
        }}
      >
        <div style={{ color: "var(--text-muted)" }}>24.47°N 54.37°E</div>
        <div style={{ color: "var(--text-muted)", marginTop: 2 }}>
          GLOBAL DEPLOYMENT ACTIVE
        </div>
      </div>

      {/* Scroll indicator — bottom center */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        style={{ gap: "0.75rem", opacity: 0.4, zIndex: 5 }}
      >
        <span
          className="text-label"
          style={{ fontSize: "0.5rem", letterSpacing: "0.25em" }}
        >
          SCROLL
        </span>
        <div
          className="relative"
          style={{ width: 1, height: 52, overflow: "hidden" }}
        >
          <div
            className="absolute w-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--text-primary), transparent)",
              height: "200%",
              animation: "scan-sweep 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}
