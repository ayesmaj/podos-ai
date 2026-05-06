"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import "./HeroAIWall.shared.css";

/**
 * HERO — premium investor reveal.
 *
 * Promoted from the standalone `/hero` route on 2026-04-25 to be the
 * canonical first section of the PODOS investor site. Lives directly
 * under the sticky NavHeader (mounted globally in app/page.tsx); does
 * NOT mount its own NavHeader.
 *
 * Layered composition (bottom → top):
 *
 *   z:0   sky-blue base scrim                  (no parallax)
 *   z:1   campus background image              (0.15× scroll, 8px mouse)
 *   z:2   soft cloud wash                      (0.35× scroll)
 *   z:3   text scrim — diagonal white→clear    (no parallax)
 *   z:4   content (eyebrow, headline, CTAs)    (full scroll)
 *   z:6   floating glass telemetry card        (-0.4× scroll, +6px mouse, 6s float)
 *
 * The "alive" feeling comes from six concurrent live elements stacked
 * at restrained intensities — no chaotic particles, no cursor effects,
 * no scrim darkening. See HeroAIWall.shared.css for class-by-class
 * breakdown.
 */

function useUptime(reduce: boolean) {
  // 47 days, 2h 14m 57s — matches the rest of the site's uptime
  // baseline so cross-section continuity holds.
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

export default function HeroAIWall() {
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;

  // Mouse-tracked parallax — small offset, capped at ±8px for the
  // deepest layer so the cursor parallax never feels gimmicky.
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

  // Scroll parallax — three depth speeds. Background (slowest), cloud
  // wash (medium), telemetry card (counter-scrolls upward).
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
    <section ref={heroRef} className="hr-root" id="top">
      {/* ── LAYER 0: bright sky-blue base scrim ─────────────────── */}
      <div className="hr-base" aria-hidden />

      {/* ── LAYER 1: campus background (slowest parallax) ───────── */}
      <motion.div
        className="hr-bg"
        style={{ y: bgY, x: reduce ? 0 : mouse.x * -8 }}
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

      {/* ── LAYER 2: soft cloud wash ────────────────────────────── */}
      <motion.div className="hr-clouds" style={{ y: cloudY }} aria-hidden />

      {/* ── LAYER 3: diagonal text scrim ────────────────────────── */}
      <div className="hr-scrim" aria-hidden />

      {/* (no top bar — sticky NavHeader is mounted at the app level) */}

      {/* ── LAYER 4: content ────────────────────────────────────── */}
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
            PODOS AI · MODULAR COMPUTE INFRASTRUCTURE
          </motion.span>

          <motion.h1
            className="hr-headline"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Modular AI compute
            <br />
            capacity,{" "}
            <span className="hr-headlineGrad">built to deploy.</span>
          </motion.h1>

          <motion.p
            className="hr-sub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            PODOS AI delivers <b>factory-built AI compute pods</b> designed
            for rapid deployment at facilities that need serious compute
            capacity — without waiting years for hyperscale construction.
          </motion.p>

          <motion.div
            className="hr-ctaRow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#access" className="hr-btn hr-btnPrimary">
              Request a Deployment Conversation
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
            <a href="#podos" className="hr-btn hr-btnGhost">
              Explore the Pod
            </a>
          </motion.div>

          <motion.div
            className="hr-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <span><b>1-MW</b> Modular Pods</span>
            <span className="hr-trustSep">·</span>
            <span><b>90–120 day</b> Deploy</span>
            <span className="hr-trustSep">·</span>
            <span><b>Factory-Built</b> Infrastructure</span>
            <span className="hr-trustSep">·</span>
            <span><b>Site-Ready</b> Commissioning</span>
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
              <path
                d="M0,55 L20,48 L40,52 L60,40 L80,44 L100,32 L120,38 L140,28 L160,33 L180,22 L200,28 L220,18 L240,24 L260,14 L280,20 L300,10 L320,16 L320,70 L0,70 Z"
                fill="url(#hrChartGrad)"
              />
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

          <div className="hr-cardFoot">
            <span className="hr-cardFootLeft">
              PODOS PLATFORM · <b>ACTIVE</b>
            </span>
            <span className="hr-cardFootRight">UPTIME {uptime}</span>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
