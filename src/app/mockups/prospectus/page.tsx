import styles from "./prospectus.module.css";

export default function ProspectusHero() {
  return (
    <main className={`ms-page ${styles.paper}`}>
      {/* paper grain texture overlay */}
      <div className={styles.grain} aria-hidden />

      {/* folio header — upper rail */}
      <div className={styles.folio}>
        <span className={styles.folioLeft}>
          <span className={styles.dot} /> Confidential · Private Placement Memorandum
        </span>
        <span className={styles.folioCenter}>PODOS AI INC.</span>
        <span className={styles.folioRight}>Folio 01 / 16 · April 2026</span>
      </div>

      <div className={styles.rule} />

      <section className={styles.grid}>
        {/* LEFT COLUMN — masthead + editorial lead */}
        <div className={styles.leftCol}>
          <div className={styles.eyebrow}>
            <span>Silicon Valley, CA</span>
            <span className={styles.bullet}>·</span>
            <span>Re: Proposed Seed Round</span>
          </div>

          <h1 className={styles.masthead}>
            <span className={styles.lineOne}>Podos AI Inc.</span>
            <span className={styles.lineTwo}>
              <em>Memorandum</em> on the Reinvention
            </span>
            <span className={styles.lineThree}>of the Data Center.</span>
          </h1>

          <div className={styles.leadRow}>
            <p className={styles.lead}>
              <span className={styles.dropCap}>T</span>his memorandum concerns the
              proposed private placement of <b>$18,000,000</b> in Series Seed
              Preferred Stock at a pre-money valuation of{" "}
              <b>$54,000,000</b>. The Company — headquartered in Silicon
              Valley and controlled by Josef&nbsp;Elimelech, inventor of record
              on each of its <span className={styles.oxblood}>seventy-six</span>{" "}
              filed U.S. patent claims — owns two unique platforms: a
              factory-built data center Pod, and a software compression engine
              that multiplies the effective capacity of any GPU tenfold.
            </p>
            <aside className={styles.marginNote}>
              <div className={styles.marginLabel}>Note ¹</div>
              Benchmark validated on Mistral-7B across three independent GPU
              platforms; 99.6% quality preservation at 8.0× compression, per
              Arthur&nbsp;Sherman, C.T.O.
            </aside>
          </div>

          <div className={styles.signatureBlock}>
            <div className={styles.sigLine}>
              <div className={styles.sigName}>Josef Elimelech</div>
              <div className={styles.sigRole}>Founder &amp; Inventor</div>
            </div>
            <div className={styles.sigStamp}>
              <svg width="84" height="84" viewBox="0 0 84 84" fill="none" aria-hidden>
                <circle cx="42" cy="42" r="39" stroke="currentColor" strokeWidth="0.6" />
                <circle cx="42" cy="42" r="31" stroke="currentColor" strokeWidth="0.6" />
                <text x="42" y="38" textAnchor="middle" fontSize="6" letterSpacing="2" fill="currentColor" fontFamily="var(--font-plex-mono)">
                  PODOS · AI
                </text>
                <text x="42" y="48" textAnchor="middle" fontSize="5" letterSpacing="1" fill="currentColor" fontFamily="var(--font-plex-mono)">
                  EST · 2026
                </text>
                <path d="M22 54 L62 54" stroke="currentColor" strokeWidth="0.6" />
                <text x="42" y="62" textAnchor="middle" fontSize="4" letterSpacing="2" fill="currentColor" fontFamily="var(--font-plex-mono)">
                  SEAL OF THE INVENTOR
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — the term sheet */}
        <aside className={styles.rightCol}>
          <div className={styles.exhibit}>Exhibit A — Term Sheet</div>
          <div className={styles.ruleThin} />
          <table className={styles.terms}>
            <tbody>
              <tr><td>Round</td><td>Series Seed Preferred</td></tr>
              <tr><td>Raise</td><td>$18,000,000</td></tr>
              <tr><td>Pre-money</td><td>$54,000,000</td></tr>
              <tr><td>Post-money</td><td>$72,000,000</td></tr>
              <tr><td>Investor ownership</td><td>25.00 %</td></tr>
              <tr><td>IP license / Pod</td><td>$50,000</td></tr>
              <tr><td>Series A target</td><td>$40–60 M · 18–24 mo</td></tr>
              <tr>
                <td>USPTO filings</td>
                <td><span className={styles.oxblood}>76 +</span></td>
              </tr>
            </tbody>
          </table>

          <div className={styles.ruleThin} />

          <div className={styles.returns}>
            <div className={styles.returnsHead}>Investor Return · $15 M at 25 %</div>
            <div className={styles.returnRow}>
              <div>
                <div className={styles.caseLabel}>Bear</div>
                <div className={styles.caseExit}>$120 M exit</div>
              </div>
              <div className={styles.caseMult}>~3.6×</div>
              <div className={styles.caseIrr}>28 % IRR</div>
            </div>
            <div className={`${styles.returnRow} ${styles.returnStar}`}>
              <div>
                <div className={styles.caseLabel}>Base ★</div>
                <div className={styles.caseExit}>$400 M exit</div>
              </div>
              <div className={styles.caseMult}>~9.3×</div>
              <div className={styles.caseIrr}>70 % IRR</div>
            </div>
            <div className={styles.returnRow}>
              <div>
                <div className={styles.caseLabel}>Bull</div>
                <div className={styles.caseExit}>$1 B+ exit</div>
              </div>
              <div className={styles.caseMult}>~23×</div>
              <div className={styles.caseIrr}>90 %+ IRR</div>
            </div>
          </div>

          <div className={styles.footnote}>
            Accredited investors only. Not an offer to sell securities. See
            Exhibit B for risk factors.
          </div>
        </aside>
      </section>

      {/* footer rail */}
      <div className={styles.rule} />
      <div className={styles.footerRail}>
        <span>Contact — <b>josef@californiamodulars.com</b></span>
        <span>thesyntropic.com</span>
        <span>Doc 2026-04 · REV A</span>
      </div>
    </main>
  );
}
