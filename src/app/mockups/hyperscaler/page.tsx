import { Fragment } from "react";
import styles from "./hyperscaler.module.css";

export default function HyperscalerHero() {
  // Per-word wrapper keeps letters atomic (no mid-word breaks); per-letter
  // inner span drives the staggered reveal via CSS animation-delay.
  const letters = (text: string, base: number) => {
    let i = 0;
    const words = text.split(" ");
    return words.map((w, wi) => (
      <Fragment key={`w-${wi}`}>
        <span className={styles.word}>
          {[...w].map((ch, ci) => (
            <span
              key={`c-${wi}-${ci}`}
              className={styles.letter}
              style={{ animationDelay: `${base + i++ * 28}ms` }}
            >
              {ch}
            </span>
          ))}
        </span>
        {wi < words.length - 1 && " "}
      </Fragment>
    ));
  };

  return (
    <main className={`ms-page ${styles.cream}`}>
      {/* soft mesh gradient — top right */}
      <div className={styles.mesh} aria-hidden />
      <div className={styles.grain} aria-hidden />

      {/* upper rail */}
      <header className={styles.upper}>
        <div className={styles.mark}>
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
            <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth="1.1" />
            <circle cx="11" cy="11" r="3.6" fill="currentColor" />
          </svg>
          <span>Podos AI</span>
        </div>
        <nav className={styles.navLinks} aria-label="Primary">
          <a href="#thesis">Thesis</a>
          <a href="#platform">Platform</a>
          <a href="#research">Research</a>
          <a href="#invest">Invest</a>
        </nav>
        <div className={styles.upperRight}>
          <span className={styles.issueTag}>Issue 01 · Infrastructure</span>
        </div>
      </header>

      <section className={styles.grid}>
        {/* LEFT — editorial display */}
        <div className={styles.col}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Podos Research · 2026
          </div>

          <h1 className={styles.display}>
            <span className={styles.line}>{letters("The next data", 120)}</span>
            <span className={`${styles.line} ${styles.italic}`}>{letters("center isn't a", 420)}</span>
            <span className={styles.line}>{letters("building. It&rsquo;s", 720)}</span>
            <span className={`${styles.line} ${styles.accent}`}>
              {letters("a pod. ", 1060)}
              <span className={styles.amp}>&amp;</span>
              {letters("  a compiler.", 1200)}
            </span>
          </h1>

          <div className={styles.leadWrap}>
            <p className={styles.lead}>
              We built a factory that ships complete, operational data-center
              units in <b>ninety days</b> &mdash; and a compiler that makes
              every&nbsp;GPU inside it serve <b>ten&nbsp;times</b> as many users,
              at <b>99.6% quality preservation</b>. One company.
              Two inventions. Seventy-six patents. No competitor has either.
            </p>
            <div className={styles.authorLine}>
              <span className={styles.byline}>Letter from the Founder</span>
              <span className={styles.dash}>—</span>
              <span>Josef Elimelech</span>
              <span className={styles.role}>Founder &amp; Inventor</span>
            </div>
          </div>

          <div className={styles.ctaRow}>
            <a href="#thesis" className={styles.cta}>
              Read the thesis
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M3 11L11 3M11 3H5M11 3V9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
              </svg>
            </a>
            <a href="#invest" className={styles.ctaGhost}>
              Investor memo&nbsp;·&nbsp;April 2026
            </a>
          </div>
        </div>

        {/* RIGHT — compression diagram */}
        <div className={styles.art}>
          <div className={styles.artLabel}>
            <div className={styles.artLabelL}>Fig. 01</div>
            <div className={styles.artLabelR}>Syntropic · KV Cache Compression</div>
          </div>

          <svg
            className={styles.diagram}
            viewBox="0 0 520 520"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Compression diagram: 10x10 grid of tokens collapses into a dense cluster"
          >
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(213,90,59,0.35)" />
                <stop offset="60%" stopColor="rgba(213,90,59,0.08)" />
                <stop offset="100%" stopColor="rgba(213,90,59,0)" />
              </radialGradient>
            </defs>

            {/* left side: sparse 10x10 grid (uncompressed tokens) */}
            <g className={styles.dGridLeft}>
              {Array.from({ length: 10 }).map((_, r) =>
                Array.from({ length: 10 }).map((_, c) => (
                  <circle
                    key={`g-${r}-${c}`}
                    cx={30 + c * 20}
                    cy={40 + r * 20}
                    r="1.9"
                    fill="#0c0b09"
                    opacity={0.55}
                  />
                ))
              )}
              <text x="30" y="20" fill="rgba(12,11,9,0.55)" fontSize="10" letterSpacing="2" fontFamily="var(--font-geist-mono)">
                100 TOKENS · 140 GB
              </text>
            </g>

            {/* arrow + transform */}
            <g>
              <line x1="245" y1="145" x2="305" y2="145" stroke="#0c0b09" strokeWidth="0.8" />
              <path d="M302 141 L310 145 L302 149 Z" fill="#0c0b09" />
              <text x="275" y="130" textAnchor="middle" fill="rgba(12,11,9,0.6)" fontSize="9" letterSpacing="3" fontFamily="var(--font-geist-mono)">
                COMPRESS · 9.6×
              </text>
              <text x="275" y="160" textAnchor="middle" fill="var(--ms-ember)" fontSize="9" letterSpacing="3" fontFamily="var(--font-geist-mono)" fontWeight="600">
                &lt; 0.5% LOSS
              </text>
            </g>

            {/* right side: condensed cluster with ember glow */}
            <g className={styles.dGridRight}>
              <circle cx="415" cy="145" r="64" fill="url(#glow)" />
              {Array.from({ length: 3 }).map((_, r) =>
                Array.from({ length: 3 }).map((_, c) => (
                  <circle
                    key={`c-${r}-${c}`}
                    cx={400 + c * 15}
                    cy={130 + r * 15}
                    r="2.4"
                    fill="var(--ms-ember)"
                  />
                ))
              )}
              <text x="415" y="230" textAnchor="middle" fill="var(--ms-ember)" fontSize="10" letterSpacing="2" fontFamily="var(--font-geist-mono)" fontWeight="600">
                14 GB · 99.6% QUALITY
              </text>
            </g>

            {/* baseline comparison bars */}
            <g transform="translate(30,290)">
              <text x="0" y="0" fill="rgba(12,11,9,0.55)" fontSize="10" letterSpacing="2" fontFamily="var(--font-geist-mono)">
                USERS · PER · CLUSTER
              </text>

              <g transform="translate(0,22)">
                <text x="0" y="14" fill="rgba(12,11,9,0.7)" fontSize="11" fontFamily="var(--font-geist-sans)">Traditional</text>
                <rect x="108" y="4" width="40" height="14" fill="#0c0b09" opacity="0.75" />
                <text x="156" y="14" fill="rgba(12,11,9,0.55)" fontSize="10" fontFamily="var(--font-geist-mono)">1×</text>
              </g>

              <g transform="translate(0,50)">
                <text x="0" y="14" fill="rgba(12,11,9,0.7)" fontSize="11" fontFamily="var(--font-geist-sans)">Optimus only</text>
                <rect x="108" y="4" width="40" height="14" fill="var(--ms-moss)" opacity="0.85" />
                <text x="156" y="14" fill="rgba(12,11,9,0.55)" fontSize="10" fontFamily="var(--font-geist-mono)">1×</text>
              </g>

              <g transform="translate(0,78)">
                <text x="0" y="14" fill="var(--ms-ember)" fontSize="11" fontFamily="var(--font-geist-sans)" fontWeight="600">
                  Optimus + Syntropic
                </text>
                <rect x="108" y="4" width="400" height="14" fill="var(--ms-ember)" />
                <text x="516" y="14" textAnchor="end" fill="var(--ms-ember)" fontSize="11" fontFamily="var(--font-geist-mono)" fontWeight="700">
                  10×
                </text>
              </g>
            </g>

            {/* footnote */}
            <text x="30" y="500" fill="rgba(12,11,9,0.4)" fontSize="9" fontFamily="var(--font-geist-mono)" letterSpacing="2">
              MISTRAL-7B · 3 GPU PLATFORMS · PPL 8.14 → 8.17
            </text>
          </svg>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statN}>90<span>days</span></div>
              <div className={styles.statL}>Deploy. Not four years.</div>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <div className={styles.statN}>10<span>×</span></div>
              <div className={styles.statL}>GPU throughput, same silicon.</div>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <div className={styles.statN}>76<span>+</span></div>
              <div className={styles.statL}>USPTO patents, inventor of record.</div>
            </div>
          </div>
        </div>
      </section>

      {/* lower rail */}
      <footer className={styles.lower}>
        <span>Silicon Valley · California</span>
        <span className={styles.sep}>/</span>
        <span>Patented hardware. Patented software. Deployed in weeks.</span>
        <span className={styles.sep}>/</span>
        <span className={styles.link}>thesyntropic.com →</span>
      </footer>
    </main>
  );
}
