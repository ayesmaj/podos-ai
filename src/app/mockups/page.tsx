import Link from "next/link";
import styles from "./index.module.css";

const DIRECTIONS = [
  {
    href: "/mockups/prospectus",
    letter: "A",
    title: "Institutional Prospectus",
    lede: "Paper, ink, and ledger. An S-1 filing rendered as a cover page. Fraunces serif + IBM Plex Mono. One oxblood accent. Drop cap. Term sheet in hero.",
    tags: ["Editorial", "Bloomberg", "Fraunces", "Oxblood"],
    palette: ["#f2ede1", "#11223e", "#8a1f24"],
  },
  {
    href: "/mockups/industrial",
    letter: "B",
    title: "Industrial — Product First",
    lede: "Blueprint on brushed concrete. A dimensioned Pod drawing with titleblock, arrowheads, and spec callouts. Big Shoulders condensed + Space Mono.",
    tags: ["Blueprint", "Amber", "Big Shoulders", "SVG"],
    palette: ["#1b1b1a", "#ffb020", "#c44419"],
  },
  {
    href: "/mockups/hyperscaler",
    letter: "C",
    title: "Hyperscaler Peer",
    lede: "Editorial cream. Instrument Serif display with stagger-reveal, ember accent, moss secondary. Compression diagram as signature visual — the thesis in geometry.",
    tags: ["Anthropic-esque", "Editorial", "Instrument Serif", "Ember"],
    palette: ["#f4f1e8", "#0c0b09", "#d55a3b"],
  },
];

export default function MockupsIndex() {
  return (
    <main className={`ms-page ${styles.page}`}>
      <header className={styles.head}>
        <div className={styles.eyebrow}>
          <span className={styles.dot} />
          Podos AI · Direction Study · April 2026
        </div>
        <h1 className={styles.title}>
          Three hero directions. <em>Pick one, then we build the site.</em>
        </h1>
        <p className={styles.sub}>
          Each route is a complete, production-grade hero &mdash; real typography,
          real data, no Lorem Ipsum. Scroll each to feel it. The floating
          pill-rail below swaps routes; your choice shapes the rest of the build.
        </p>
      </header>

      <section className={styles.cards}>
        {DIRECTIONS.map((d) => (
          <Link key={d.href} href={d.href} className={styles.card}>
            <div
              className={styles.swatch}
              style={{
                background: d.palette[0],
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div
                className={styles.swatchInk}
                style={{ background: d.palette[1] }}
              />
              <div
                className={styles.swatchAccent}
                style={{ background: d.palette[2] }}
              />
              <div
                className={styles.swatchLetter}
                style={{ color: d.palette[1] }}
              >
                {d.letter}
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardHead}>
                <span className={styles.cardLetter}>Direction {d.letter}</span>
                <span className={styles.cardOpen}>Open →</span>
              </div>
              <h2 className={styles.cardTitle}>{d.title}</h2>
              <p className={styles.cardLede}>{d.lede}</p>
              <div className={styles.tags}>
                {d.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </section>

      <div className={styles.note}>
        All three use real copy from your April 2026 deck (76 patents, $18M
        seed, 99.6% benchmark, etc.). Nothing is placeholder. The deck PPTX
        is in <code>podos-ai/original/uploads/</code>.
      </div>
    </main>
  );
}
