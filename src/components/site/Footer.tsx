"use client";

import Image from "next/image";
import styles from "./NewSections.module.css";

/**
 * Premium footer — four columns over a dark-navy surface.
 *
 *   1. Brand block  — logo lockup + tagline + LinkedIn / X / GitHub
 *   2. Product      — anchors into product/spec sections
 *   3. Deployment   — anchors into deployment + manufacturing
 *   4. Stay informed — newsletter form + legal links
 *
 * Bottom strip carries copyright, the modular-AI tagline, and a live
 * status pill (reuses the global .live-pulse utility from globals.css).
 */
export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.footerInner}>
        {/* ── Brand block ── */}
        <div className={styles.footerBrandBlock}>
          <a href="#top" className={styles.footerLockup} aria-label="PODOS AI — home">
            <Image
              src="/podos-logo-lockup.png"
              alt="PODOS AI"
              width={760}
              height={500}
              priority={false}
              className={styles.footerLockupImg}
            />
          </a>
          <p className={styles.footerTagline}>
            Factory-built modular AI compute pods. Deployable at the
            facilities that need serious compute capacity, without waiting
            years for hyperscale construction.
          </p>
          <div className={styles.footerSocials}>
            <a href="#" className={styles.footerSocial} aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
            <a href="#" className={styles.footerSocial} aria-label="X (Twitter)">
              <XIcon />
            </a>
            <a href="#" className={styles.footerSocial} aria-label="GitHub">
              <GithubIcon />
            </a>
          </div>
        </div>

        {/* ── Product column ── */}
        <div>
          <div className={styles.footerColTitle}>Product</div>
          <ul className={styles.footerLinks}>
            <li><a className={styles.footerLink} href="#podos">The Pod</a></li>
            <li><a className={styles.footerLink} href="#solution">Solution</a></li>
            <li><a className={styles.footerLink} href="#design">Engineering</a></li>
            <li><a className={styles.footerLink} href="#problem">The Problem</a></li>
          </ul>
        </div>

        {/* ── Deployment column ── */}
        <div>
          <div className={styles.footerColTitle}>Deployment</div>
          <ul className={styles.footerLinks}>
            <li><a className={styles.footerLink} href="#deployment">Process</a></li>
            <li><a className={styles.footerLink} href="#manufacturing">Manufacturing</a></li>
            <li><a className={styles.footerLink} href="#use-cases">Use Cases</a></li>
            <li><a className={styles.footerLink} href="#access">Get in Touch</a></li>
          </ul>
        </div>

        {/* ── Newsletter column ── */}
        <div className={styles.footerNewsletter}>
          <div className={styles.footerColTitle}>Stay informed</div>
          <p className={styles.footerNewsletterCopy}>
            Deployment milestones, factory updates, and the occasional engineering note.
          </p>
          <form
            className={styles.footerForm}
            onSubmit={(e) => {
              // No backend yet — submit triggers a graceful no-op so the form
              // doesn't navigate away. Replace with a real handler when the
              // marketing list is set up.
              e.preventDefault();
            }}
          >
            <input
              type="email"
              required
              placeholder="you@company.com"
              aria-label="Email"
              className={styles.footerInput}
            />
            <button type="submit" className={styles.footerSubmit}>
              Subscribe
              <ArrowRightIcon />
            </button>
          </form>
          <div className={styles.footerLegal}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>

      {/* ── Bottom strip ── */}
      <div className={styles.footerBase}>
        <span>© {new Date().getFullYear()} PODOS AI · All rights reserved</span>
        <span>Modular AI Compute Infrastructure</span>
        <span className={styles.footerStatus}>
          <span className="live-pulse" aria-hidden />
          <span>Live · Taking deployment inquiries</span>
        </span>
      </div>
    </footer>
  );
}

/* ----------- inline icons ----------- */

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 4 6 20M6 4l12 16" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

