"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import NavHeader, { type NavItem } from "@/components/ui/nav-header";
import "./hero.css";

/* Site-wide nav — same items as on `/` so a user landing here sees
   continuity with the rest of the investor site. Anchors point back
   to the home route (`/#section`) since the hero page is its own
   route and those sections live on `/`. */
const HERO_NAV: NavItem[] = [
  { label: "Home", href: "/#top" },
  { label: "Problem", href: "/#problem" },
  { label: "Solution", href: "/#podos" },
  { label: "Console", href: "/#syntropic-console" },
  { label: "Market", href: "/#market" },
  { label: "Moat", href: "/#ip-portfolio" },
  { label: "Invest", href: "/#use-of-funds" },
];

/**
 * Premium investor hero — PODOS + SYNTROPIC unified.
 *
 * Composition strategy: a six-layer parallax stack over a single
 * cinematic image of the campus. Each layer translates at a different
 * rate based on scroll progress + mouse position so the scene reads
 * as REAL DEPTH (sky farthest, foreground landscaping nearest).
 *
 *   LAYERS (slow → fast):
 *     0. white-blue scrim     — fixed, no parallax
 *     1. campus background    — 0.15× scroll, 8px mouse range (slow)
 *     2. soft cloud wash      — 0.35× scroll
 *     3. text scrim gradient  — fixed (readability)
 *     4. content + CTA        — full scroll (no transform)
 *     5. telemetry card       — 0.6× scroll, 12px float loop
 *
 * Telemetry card is REAL DOM, not pasted into the image — that means
 * the uptime ticks, the chart pulses, the ONLINE dot breathes. The
 * "alive" feeling comes from those micro-motions stacked, not from
 * over-the-top entrance animations.
 *
 * Bright + premium discipline:
 *   • Background NEVER darkened past 0.85 opacity
 *   • Scrim behind text is a soft white→transparent gradient, not a
 *     black overlay — preserves the campus visibility at the edges
 *   • Brand gradient ("Physical Layer") is the ONLY color emphasis;
 *     everything else is grayscale ink.
 */

function useUptime(reduce: boolean) {
  // 47 days, 2h 14m 57s — same baseline as the existing site so
  // continuity holds if a user navigates between this page and /
  const BASE = 47 * 86_400 + 2 * 3_600 + 14 * 60 + 57;
  const [s, setS] = useState(BASE);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, [reduce]);
  const d = Math.floor(s / 86_400);
  const r = s % 86_400;
  const hh = String(Math.floor(r / 3_600)).padStart(2, "0");
  const mm = String(Math.floor((r % 3_600) / 60)).padStart(2, "0");
  const ss = String(r % 60).padStart(2, "0");
  return `${d}D · ${hh}:${mm}:${ss}`;
}

function useThroughputJitter(reduce: boolean, base = 84.5) {
  // ±0.3 jitter every 1.4s — feels like live telemetry without
  // visually stealing attention from the headline.
  const [v, setV] = useState(base);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setV(base + (Math.random() - 0.5) * 0.6);
    }, 1400);
    return () => clearInterval(id);
  }, [reduce, base]);
  return v.toFixed(1);
}

export default function HeroPage() {
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;

  // Mouse-tracked parallax — a tiny offset so cursor movement nudges
  // the scene. Capped at ±8px on the deepest layer so it never feels
  // gimmicky. We track normalized [-1, 1] coords from the hero center.
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setMouse({ x: nx * 2, y: ny * 2 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  // Scroll parallax — different translateY per layer based on scroll
  // through the hero section.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0px", "0px"] : ["0px", "120px"],
  );
  const cloudY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0px", "0px"] : ["0px", "60px"],
  );
  const cardY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0px", "0px"] : ["0px", "-40px"],
  );

  const uptime = useUptime(reduce);
  const throughput = useThroughputJitter(reduce);

  return (
    <section ref={heroRef} className="hr-root" id="hero-root">
      {/* ── LAYER 0: bright sky-blue base scrim ────────────────────── */}
      <div className="hr-base" aria-hidden />

      {/* ── LAYER 1: campus background (slowest parallax) ──────────── */}
      <motion.div
        className="hr-bg"
        style={{
          y: bgY,
          x: reduce ? 0 : mouse.x * -8,
        }}
        aria-hidden
      >
        <Image
          src="/hero/campus.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hr-bgImg"
        />
      </motion.div>

      {/* ── LAYER 2: soft white cloud wash ─────────────────────────── */}
      <motion.div
        className="hr-clouds"
        style={{ y: cloudY }}
        aria-hidden
      />

      {/* ── LAYER 3: text scrim — soft white→transparent for legibility */}
      <div className="hr-scrim" aria-hidden />

      {/* ── TOP BAR · site-wide sticky NavHeader ─────────────────────
          Mounted in a fixed wrapper identical to the one in
          app/page.tsx so the hero page shares the exact same nav
          chrome as the rest of the site. Logo lives in the bubble's
          left slot, 7 anchor items track active section via
          IntersectionObserver (no targets here → cursor parks on
          items[0], graceful no-op). z:50 so it sits above the hero's
          content (z:4) and the telemetry card (z:6, but the card
          doesn't extend into the top strip). */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none md:top-6">
        <div className="pointer-events-auto">
          <NavHeader
            items={HERO_NAV}
            ariaLabel="PODOS investor site sections"
            logo={
              <Image
                src="/logo.png"
                alt="PODOS AI"
                width={1078}
                height={370}
                priority
                sizes="100px"
              />
            }
          />
        </div>
      </div>

      {/* ── LAYER 4: content (full scroll speed) ───────────────────── */}
      <div className="hr-grid">
        {/* LEFT — copy + CTAs */}
        <div className="hr-copy">
          <motion.span
            className="hr-eyebrow"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="hr-eyeDot" />
            CALIFORNIA MODULARS · SERIES SEED · APRIL 2026
          </motion.span>

          <motion.h1
            className="hr-headline"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            The AI Economy
            <br />
            Needs a New{" "}
            <span className="hr-headlineGrad">Physical Layer.</span>
          </motion.h1>

          <motion.p
            className="hr-sub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <b>One company. Two inventions.</b> PODOS ships{" "}
            <b>1-MW AI supercomputers in 90–120 days</b>. Syntropic makes every
            GPU inside them do the work of ten. Together they turn GPU
            deployment from a construction project into a product.
          </motion.p>

          <motion.div
            className="hr-ctaRow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#access" className="hr-btn hr-btnPrimary">
              Request Investor Access
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path
                  d="M3.5 8H12.5M12.5 8L8 3.5M12.5 8L8 12.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </a>
            <a href="#delta" className="hr-btn hr-btnGhost">
              See the Delta
            </a>
          </motion.div>

          <motion.div
            className="hr-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <span><b>$3.4T</b> AI Infra Buildout</span>
            <span className="hr-trustSep">·</span>
            <span><b>76+</b> USPTO Patents</span>
            <span className="hr-trustSep">·</span>
            <span><b>90–120 day</b> Deploy</span>
            <span className="hr-trustSep">·</span>
            <span><b>85×</b> Useful Tp/W</span>
          </motion.div>
        </div>

        {/* RIGHT — floating glass telemetry card */}
        <motion.aside
          className="hr-card"
          style={{ y: cardY, x: reduce ? 0 : mouse.x * 6 }}
          initial={{ opacity: 0, x: 30, y: 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* card-header */}
          <div className="hr-cardHead">
            <div className="hr-cardId">
              POD-0042
              <span className="hr-cardRegion">· US-WEST-CA-3</span>
              <span className="hr-cardFleet">1 of 47 deployed pods</span>
            </div>
            <div className="hr-cardOnline">
              <span className="hr-onlineDot" />
              ONLINE
            </div>
          </div>

          {/* 2×2 stat grid */}
          <div className="hr-cardStats">
            <div className="hr-stat">
              <span className="hr-statLbl">Throughput</span>
              <span className="hr-statVal">
                {throughput}
                <span className="hr-statUnit">tok/ms</span>
              </span>
              <span className="hr-statBar"><span className="hr-statFill" style={{ width: "82%" }} /></span>
            </div>
            <div className="hr-stat">
              <span className="hr-statLbl">GPU Util</span>
              <span className="hr-statVal">
                93<span className="hr-statUnit">%</span>
              </span>
              <span className="hr-statBar"><span className="hr-statFill" style={{ width: "93%" }} /></span>
            </div>
            <div className="hr-stat">
              <span className="hr-statLbl">Power</span>
              <span className="hr-statVal">
                968<span className="hr-statUnit">kW</span>
              </span>
              <span className="hr-statBar"><span className="hr-statFill" style={{ width: "77%" }} /></span>
            </div>
            <div className="hr-stat">
              <span className="hr-statLbl">Die Temp</span>
              <span className="hr-statVal">
                38<span className="hr-statUnit">°C</span>
              </span>
              <span className="hr-statBar"><span className="hr-statFill" style={{ width: "42%" }} /></span>
            </div>
          </div>

          {/* mini-chart */}
          <div className="hr-cardChart">
            <div className="hr-cardChartHead">
              <span>Useful Throughput · Last 24H</span>
              <span className="hr-cardChartDelta">+42.7%</span>
            </div>
            <svg viewBox="0 0 320 70" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="hrChartGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(34, 211, 238, 0.4)" />
                  <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
                </linearGradient>
                <linearGradient id="hrChartLine" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              {/* Filled area beneath the line — gives the chart depth */}
              <path
                d="M0,55 L20,48 L40,52 L60,40 L80,44 L100,32 L120,38 L140,28 L160,33 L180,22 L200,28 L220,18 L240,24 L260,14 L280,20 L300,10 L320,16 L320,70 L0,70 Z"
                fill="url(#hrChartGrad)"
              />
              {/* Animated stroke draw-in */}
              <motion.path
                d="M0,55 L20,48 L40,52 L60,40 L80,44 L100,32 L120,38 L140,28 L160,33 L180,22 L200,28 L220,18 L240,24 L260,14 L280,20 L300,10 L320,16"
                fill="none"
                stroke="url(#hrChartLine)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduce ? 0 : 1.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <span className="hr-cardChartCaption">vs. unscheduled baseline</span>
          </div>

          {/* footer */}
          <div className="hr-cardFoot">
            <span className="hr-cardFootLeft">
              SYNTROPIC SCHEDULER · <b>ACTIVE</b>
            </span>
            <span className="hr-cardFootRight">UPTIME {uptime}</span>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
