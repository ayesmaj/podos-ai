import styles from "./industrial.module.css";

export default function IndustrialHero() {
  return (
    <main className={`ms-page ${styles.shop}`}>
      <div className={styles.blueprintGrid} aria-hidden />
      <div className={styles.scanline} aria-hidden />

      {/* ===== TITLEBLOCK — upper rail ===== */}
      <header className={styles.titleblock}>
        <div className={styles.tbCell}>
          <div className={styles.tbLabel}>Project</div>
          <div className={styles.tbValue}>PODOS · AI · INC.</div>
        </div>
        <div className={styles.tbCell}>
          <div className={styles.tbLabel}>Drawing</div>
          <div className={styles.tbValue}>01 / 06</div>
        </div>
        <div className={styles.tbCell}>
          <div className={styles.tbLabel}>Unit</div>
          <div className={styles.tbValue}>POD · OPTIMUS</div>
        </div>
        <div className={styles.tbCell}>
          <div className={styles.tbLabel}>Rev.</div>
          <div className={styles.tbValue}>A</div>
        </div>
        <div className={styles.tbCell}>
          <div className={styles.tbLabel}>Issued</div>
          <div className={styles.tbValue}>2026 · 04 · APR</div>
        </div>
        <div className={`${styles.tbCell} ${styles.tbStamp}`}>
          <div className={styles.stampFrame}>
            <div className={styles.stampText}>FACTORY · BUILT</div>
            <div className={styles.stampSub}>90 DAY DEPLOY</div>
          </div>
        </div>
      </header>

      <div className={styles.stage}>
        {/* LEFT — typography statement */}
        <section className={styles.statement}>
          <div className={styles.marker}>
            <span className={styles.markerDot} />
            SPEC · 01
            <span className={styles.markerLine} />
          </div>

          <h1 className={styles.headline}>
            <span className={styles.hlA}>The data center</span>
            <span className={styles.hlB}>
              isn&rsquo;t a <mark>building</mark>.
            </span>
            <span className={styles.hlC}>It&rsquo;s a <em>unit</em>.</span>
          </h1>

          <p className={styles.lead}>
            12&thinsp;×&thinsp;60&nbsp;ft. Factory-built. Delivered complete.
            Plug in, power on, go live &mdash; in <b>90&ndash;120 days</b>,
            not four years. Thermos enclosure on all six surfaces. PUE
            target <b>&le; 1.20</b>. Zero water. Zero concrete. Fully
            relocatable.
          </p>

          {/* spec callouts */}
          <div className={styles.specs}>
            <Spec k="720" u="sq ft" l="Enclosed footprint" />
            <Spec k="1.08" u="PUE" l="Lab-measured" />
            <Spec k="110" u="kW" l="ORC heat recovery" accent />
            <Spec k="57K+" u="USD/yr" l="Revenue per Pod" />
          </div>

          <div className={styles.ctaRow}>
            <a className={styles.btnPrimary} href="#spec">
              <span>Read the spec</span>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="M3 8h10m-4-4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
              </svg>
            </a>
            <a className={styles.btnGhost} href="#cad">
              Download CAD ·&nbsp;<span className={styles.ext}>.STEP</span>
            </a>
          </div>
        </section>

        {/* RIGHT — blueprint SVG of the Pod with dimension lines */}
        <section className={styles.bp}>
          <div className={styles.bpHeader}>
            <span>PLAN · ELEVATION</span>
            <span className={styles.bpHeaderDim}>SCALE 1:24 · INCHES</span>
          </div>

          <svg
            className={styles.podSvg}
            viewBox="0 0 560 420"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Dimensioned Pod drawing"
          >
            <defs>
              <pattern id="ribs" width="12" height="12" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              </pattern>
              <pattern id="roofSolar" width="22" height="10" patternUnits="userSpaceOnUse">
                <rect width="18" height="6" x="2" y="2" fill="rgba(108,139,179,0.22)" stroke="rgba(108,139,179,0.55)" strokeWidth="0.7" />
              </pattern>
              <marker id="arrLeft" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M9 1 L1 5 L9 9 Z" fill="var(--ms-amber)" />
              </marker>
              <marker id="arrRight" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M1 1 L9 5 L1 9 Z" fill="var(--ms-amber)" />
              </marker>
            </defs>

            {/* solar roof band */}
            <rect x="80" y="108" width="400" height="34" fill="url(#roofSolar)" stroke="rgba(108,139,179,0.7)" strokeWidth="1" />
            <text x="280" y="130" textAnchor="middle" fill="rgba(108,139,179,0.95)" fontSize="9" letterSpacing="3" fontFamily="var(--font-space-mono)">SOLAR · INTEGRATED</text>

            {/* pod body */}
            <rect x="80" y="142" width="400" height="160" fill="#17171a" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
            <rect x="80" y="142" width="400" height="160" fill="url(#ribs)" />

            {/* door */}
            <rect x="430" y="180" width="36" height="110" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <circle cx="461" cy="235" r="1.8" fill="var(--ms-amber)" />
            <text x="448" y="305" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="7" letterSpacing="2" fontFamily="var(--font-space-mono)">ACCESS</text>

            {/* GPU rack windows */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <g key={i}>
                <rect
                  x={100 + i * 46}
                  y={162}
                  width={34}
                  height={100}
                  fill="#0b0b0c"
                  stroke="rgba(108,139,179,0.5)"
                  strokeWidth="0.8"
                />
                <line x1={100 + i * 46 + 4} y1={170} x2={100 + i * 46 + 30} y2={170} stroke="var(--ms-amber)" strokeWidth="0.6" opacity="0.8" />
                <line x1={100 + i * 46 + 4} y1={196} x2={100 + i * 46 + 30} y2={196} stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                <line x1={100 + i * 46 + 4} y1={220} x2={100 + i * 46 + 30} y2={220} stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                <line x1={100 + i * 46 + 4} y1={244} x2={100 + i * 46 + 30} y2={244} stroke="var(--ms-oxide)" strokeWidth="0.6" opacity="0.85" />
              </g>
            ))}

            {/* base / skids */}
            <rect x="80" y="302" width="400" height="10" fill="#0b0b0c" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <rect x="100" y="312" width="14" height="10" fill="#0b0b0c" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
            <rect x="446" y="312" width="14" height="10" fill="#0b0b0c" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />

            {/* ground rule */}
            <line x1="30" y1="326" x2="530" y2="326" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" strokeDasharray="3 3" />

            {/* DIMENSION — length, bottom */}
            <line x1="80" y1="360" x2="480" y2="360" stroke="var(--ms-amber)" strokeWidth="0.9" markerStart="url(#arrLeft)" markerEnd="url(#arrRight)" />
            <line x1="80" y1="320" x2="80" y2="368" stroke="var(--ms-amber)" strokeWidth="0.6" />
            <line x1="480" y1="320" x2="480" y2="368" stroke="var(--ms-amber)" strokeWidth="0.6" />
            <rect x="258" y="350" width="44" height="20" fill="var(--ms-concrete-2)" />
            <text x="280" y="364" textAnchor="middle" fill="var(--ms-amber)" fontSize="11" fontFamily="var(--font-space-mono)" fontWeight="700">60 FT</text>

            {/* DIMENSION — height, right */}
            <line x1="500" y1="108" x2="500" y2="312" stroke="var(--ms-amber)" strokeWidth="0.9" markerStart="url(#arrLeft)" markerEnd="url(#arrRight)" />
            <line x1="480" y1="108" x2="508" y2="108" stroke="var(--ms-amber)" strokeWidth="0.6" />
            <line x1="480" y1="312" x2="508" y2="312" stroke="var(--ms-amber)" strokeWidth="0.6" />
            <rect x="492" y="202" width="30" height="18" fill="var(--ms-concrete-2)" />
            <text x="507" y="214" textAnchor="middle" fill="var(--ms-amber)" fontSize="10" fontFamily="var(--font-space-mono)" fontWeight="700">12 FT</text>

            {/* callout — thermos enclosure */}
            <g>
              <line x1="32" y1="186" x2="78" y2="186" stroke="var(--ms-oxide)" strokeWidth="0.9" markerEnd="url(#arrRight)" />
              <line x1="30" y1="166" x2="30" y2="206" stroke="var(--ms-oxide)" strokeWidth="0.8" />
              <text x="10" y="174" fill="var(--ms-oxide)" fontSize="9" fontFamily="var(--font-space-mono)" letterSpacing="1">THERMOS</text>
              <text x="10" y="188" fill="rgba(255,255,255,0.78)" fontSize="8" fontFamily="var(--font-space-mono)">ENCLOSURE</text>
              <text x="10" y="202" fill="rgba(255,255,255,0.5)" fontSize="7.5" fontFamily="var(--font-space-mono)">6 SURFACES</text>
            </g>

            {/* callout — ORC */}
            <g>
              <line x1="276" y1="70" x2="276" y2="105" stroke="var(--ms-oxide)" strokeWidth="0.9" markerEnd="url(#arrRight)" />
              <line x1="210" y1="68" x2="360" y2="68" stroke="var(--ms-oxide)" strokeWidth="0.8" />
              <text x="210" y="58" fill="var(--ms-oxide)" fontSize="9" fontFamily="var(--font-space-mono)" letterSpacing="1">ORC · HEAT ENGINE</text>
              <text x="210" y="46" fill="rgba(255,255,255,0.62)" fontSize="7.5" fontFamily="var(--font-space-mono)">WASTE HEAT &rarr; 110 kW</text>
            </g>

            {/* callout — rack density */}
            <g>
              <line x1="218" y1="380" x2="218" y2="340" stroke="var(--ms-blueprint)" strokeWidth="0.8" markerStart="url(#arrLeft)" />
              <text x="218" y="395" textAnchor="middle" fill="var(--ms-blueprint)" fontSize="8.5" fontFamily="var(--font-space-mono)" letterSpacing="1">DIRECT LIQUID · 95% HEAT CAPTURE</text>
            </g>
          </svg>

          <div className={styles.bpFooter}>
            <span>SYS 01 · POD ARCHITECTURE</span>
            <span>SYS 02 · THERMOS</span>
            <span>SYS 03 · LIQUID COOL</span>
            <span>SYS 04 · ORC</span>
            <span>SYS 05 · MEGA SILO™</span>
            <span>SYS 06 · AI DESIGN</span>
          </div>
        </section>
      </div>

      {/* lower data rail */}
      <div className={styles.dataRail}>
        <span><em>01</em> 90-DAY DEPLOY</span>
        <span><em>02</em> ZERO WATER</span>
        <span><em>03</em> PUE&nbsp;&le;&nbsp;1.20</span>
        <span><em>04</em> 20+ HW PATENTS</span>
        <span><em>05</em> FACTORY-BUILT</span>
        <span><em>06</em> OFF-GRID CAPABLE</span>
      </div>
    </main>
  );
}

function Spec({
  k, u, l, accent,
}: { k: string; u: string; l: string; accent?: boolean }) {
  return (
    <div className={`${styles.spec} ${accent ? styles.specAccent : ""}`}>
      <div className={styles.specNum}>
        <span>{k}</span>
        <span className={styles.specUnit}>{u}</span>
      </div>
      <div className={styles.specLbl}>{l}</div>
    </div>
  );
}
