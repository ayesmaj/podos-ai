/**
 * EvidenceSource — visible numbered source rail for technical and
 * research pages (SEO master brief §4). Server component; styled with
 * the MAIN site's light technical system (not the invest palette).
 */

export interface Source {
  n: number;
  name: string;
  publisher: string;
  url?: string;
  date?: string;
}

export function EvidenceSourceRail({ sources }: { sources: Source[] }) {
  if (!sources.length) return null;
  return (
    <section aria-label="Sources" style={{ borderTop: "1px solid var(--edge)", marginTop: "3rem", paddingTop: "1.5rem" }}>
      <h2
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--graphite)",
        }}
      >
        Sources
      </h2>
      <ol style={{ marginTop: "0.9rem", display: "grid", gap: "0.55rem" }}>
        {sources.map((s) => (
          <li key={s.n} id={`source-${s.n}`} style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--graphite)" }}>
            <span style={{ fontFamily: "var(--font-body)", color: "var(--brand)" }}>
              [{s.n}]
            </span>{" "}
            {s.url ? (
              <a href={s.url} rel="noopener" target="_blank" style={{ textDecoration: "underline" }}>
                {s.name}
              </a>
            ) : (
              s.name
            )}
            {" — "}
            {s.publisher}
            {s.date ? `, ${s.date}` : ""}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Inline citation marker: renders [n] linking to the rail entry. */
export function Cite({ n }: { n: number }) {
  return (
    <sup>
      <a
        href={`#source-${n}`}
        aria-label={`Source ${n}`}
        style={{ fontFamily: "var(--font-body)", fontSize: "0.72em", color: "var(--brand)" }}
      >
        [{n}]
      </a>
    </sup>
  );
}
