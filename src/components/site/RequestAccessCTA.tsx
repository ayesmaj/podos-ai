"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import {
  GridField,
  AmbientOrbs,
  CircuitTraces,
  Particles,
  VignetteLight,
} from "./BackgroundLayers";
import styles from "./RequestAccessCTA.module.css";

/**
 * SECTION — CONTACT / REQUEST A CONVERSATION
 *
 * Public, product-facing CTA. Replaces the prior investor-deck close
 * (deal terms, return ladder, "earliest entry point" framing) with a
 * single, calm question: do you need AI compute capacity faster than
 * a hyperscale build can deliver?
 *
 * Three FACTS describe what the conversation actually IS — response
 * time, scope, format — so a real prospect can decide whether to
 * email before reading any further.
 */
const FACTS = [
  {
    code: "F-01",
    label: "RESPONSE TIME",
    value: "Within 72 hours",
    detail: "Initial outreach acknowledged · scoping call scheduled within the week",
  },
  {
    code: "F-02",
    label: "WHAT WE COVER",
    value: "Site, capacity, timeline",
    detail: "Use case, power profile, deployment footprint, commissioning window",
  },
  {
    code: "F-03",
    label: "CONVERSATION FORMAT",
    value: "30-min intro call",
    detail: "Followed by a written deployment scope · factory walkthrough on request",
  },
];

export default function RequestAccessCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const t = reduce ? 0 : 1;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@podos.ai");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <section ref={ref} id="access" className={`${styles.section} section-pad`}>
      <div className={styles.bg}>
        <GridField variant="sparse" />
        <AmbientOrbs config="teal" />
        <CircuitTraces accent="mixed" />
        <Particles count={6} />
        <VignetteLight />
      </div>

      <div className="container-site" style={{ position: "relative", zIndex: 2 }}>
        {/* ============== EYEBROW ============== */}
        <motion.div
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 * t, ease: "easeOut" }}
        >
          <span className={styles.eyebrowIdx}>09</span>
          <span className={styles.eyebrowSep}>·</span>
          GET IN TOUCH
        </motion.div>

        {/* ============== HEADLINE ============== */}
        <motion.h2
          className={styles.headline}
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 * t, delay: 0.1 * t, ease: "easeOut" }}
        >
          Need AI compute capacity without a{" "}
          <span className="t-sweep-brand">multi-year infrastructure timeline</span>?
        </motion.h2>

        {/* ============== SUB-LINE ============== */}
        <motion.p
          className={styles.lede}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 * t, delay: 0.3 * t, ease: "easeOut" }}
        >
          Talk with PODOS AI about modular compute pod deployment options
          for your facility.
        </motion.p>

        {/* ============== ACTION ROW ============== */}
        <motion.div
          className={styles.actionRow}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 * t, delay: 0.5 * t, ease: "easeOut" }}
        >
          <a
            href="mailto:hello@podos.ai?subject=PODOS%20AI%20%C2%B7%20Deployment%20conversation&body=Organization%3A%20%0ALocation%3A%20%0ATimeline%3A%20%0ACompute%20need%3A%20%0A"
            className={styles.primary}
          >
            <span className={styles.primaryGlow} aria-hidden />
            <span className={styles.primaryLabel}>Request a Conversation</span>
            <svg
              className={styles.primaryArrow}
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden
            >
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className={styles.secondary}
            aria-label="Copy hello@podos.ai to clipboard"
          >
            <span className={styles.secondaryDot} aria-hidden />
            <span className={styles.secondaryText}>hello@podos.ai</span>
            <span className={styles.secondaryHint}>
              {copied ? "COPIED" : "CLICK TO COPY"}
            </span>
          </button>
        </motion.div>

        {/* ============== FACTBAR ============== */}
        <motion.div
          className={styles.factbar}
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 * t, delay: 0.7 * t, ease: "easeOut" }}
        >
          {FACTS.map((f, i) => (
            <motion.div
              key={f.code}
              className={`${styles.fact} card-lift`}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6 * t,
                delay: (0.85 + i * 0.08) * t,
                ease: "easeOut",
              }}
            >
              <div className={styles.factHead}>
                <span className={styles.factCode}>{f.code}</span>
                <span className={styles.factLabel}>{f.label}</span>
              </div>
              <div className={styles.factValue}>{f.value}</div>
              <div className={styles.factRule} aria-hidden />
              <div className={styles.factDetail}>{f.detail}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ============== CONTACT CARD — "Let's Work Together" ============== */}
        <motion.div
          className={styles.contactCard}
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 * t, delay: 0.95 * t, ease: "easeOut" }}
        >
          <div className={styles.contactPitch}>
            <span className={styles.contactKicker}>Let's Work Together</span>
            <h3 className={styles.contactTitle}>
              The fastest path to a deployment conversation
            </h3>
            <p className={styles.contactCopy}>
              Reach out by phone, email, or stop by the factory. We respond
              to every inquiry within 72 hours.
            </p>
          </div>

          <div className={styles.contactRows}>
            <div className={styles.contactRow}>
              <span className={styles.contactIcon} aria-hidden>
                <PinIcon />
              </span>
              <div className={styles.contactRowText}>
                <span className={styles.contactRowLabel}>Headquarters</span>
                <span className={styles.contactRowValue}>
                  Modular Compute Lab
                  <br />
                  United States
                </span>
              </div>
            </div>

            <div className={styles.contactRow}>
              <span className={styles.contactIcon} aria-hidden>
                <MailIcon />
              </span>
              <div className={styles.contactRowText}>
                <span className={styles.contactRowLabel}>Email</span>
                <a
                  className={`${styles.contactRowValue} ${styles.contactRowValueLink}`}
                  href="mailto:hello@podos.ai"
                >
                  hello@podos.ai
                </a>
              </div>
            </div>

            <div className={styles.contactRow}>
              <span className={styles.contactIcon} aria-hidden>
                <PhoneIcon />
              </span>
              <div className={styles.contactRowText}>
                <span className={styles.contactRowLabel}>Phone</span>
                <a
                  className={`${styles.contactRowValue} ${styles.contactRowValueLink}`}
                  href="tel:+1"
                >
                  +1 (555) 000-0000
                </a>
              </div>
            </div>

            <div className={styles.contactSocials}>
              <span className={styles.contactSocialLabel}>Follow</span>
              <a className={styles.contactSocial} href="#" aria-label="LinkedIn">
                <LinkedinSvg />
              </a>
              <a className={styles.contactSocial} href="#" aria-label="X (Twitter)">
                <XSvg />
              </a>
              <a className={styles.contactSocial} href="#" aria-label="GitHub">
                <GithubSvg />
              </a>
            </div>
          </div>
        </motion.div>

        {/* ============== SIGNOFF ============== */}
        <motion.div
          className={styles.signoff}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 * t, delay: 1.1 * t, ease: "easeOut" }}
        >
          <div className={styles.signoffLeft}>
            <span className={styles.signoffCode}>PODOS-AI · CONTACT</span>
            <span className={styles.signoffSep}>·</span>
            <span>Modular AI compute infrastructure</span>
          </div>
          <div className={styles.signoffRight}>
            <span className={styles.signoffStatus} aria-hidden />
            <span>OPEN · TAKING DEPLOYMENT INQUIRIES</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------- inline icons (kept local to avoid lucide-react version drift) ----------- */

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13Z" />
      <circle cx="12" cy="9" r="3" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function LinkedinSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function XSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 4 6 20M6 4l12 16" />
    </svg>
  );
}

function GithubSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}
