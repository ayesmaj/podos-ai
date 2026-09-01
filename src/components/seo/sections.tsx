/**
 * sections.tsx — the PODOS SEO section library.
 *
 * Every SEO page is composed from these. All are SERVER components, so
 * SEO pages still ship zero client JavaScript; the sticky explainer,
 * hovers, and table scrolling are CSS-only.
 *
 * Layout classes live in src/app/seo-sections.css — NOT Tailwind
 * utilities, because globals.css carries an unlayered `*` reset that
 * beats @layer utilities. See docs/design/COMPONENT_MAP.md.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import SeoImage from "./SeoImage";

type Surface = "paper" | "canvas" | "ink" | "blueprint";
type Width = "bleed" | "wide" | "site" | "content";
type Pad = "hero" | "major" | "band" | "flow";
export type Field =
  | "cooling"
  | "power"
  | "network"
  | "deploy"
  | "safety"
  | "compare"
  | "insight"
  | "blueprint";

/* ------------------------------------------------------------------ */
/* shell                                                               */
/* ------------------------------------------------------------------ */

export function Section({
  surface = "paper",
  width = "site",
  pad = "flow",
  field,
  id,
  children,
}: {
  surface?: Surface;
  width?: Width;
  pad?: Pad;
  field?: Field;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`sec sec--${surface} sec--${pad}`} style={{ scrollMarginTop: 96 }}>
      {field ? <div className="sec__field" data-field={field} aria-hidden /> : null}
      <div className={`sec__in sec__in--${width}`}>{children}</div>
    </section>
  );
}

export function Eyebrow({ code, children }: { code?: string; children: ReactNode }) {
  return (
    <p className="eyebrow">
      {code ? (
        <>
          <b>{code}</b>
          <span aria-hidden style={{ opacity: 0.4 }}>
            ·
          </span>
        </>
      ) : null}
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  code,
  title,
  accent,
  lede,
}: {
  eyebrow?: string;
  code?: string;
  title: string;
  accent?: string;
  lede?: string;
}) {
  return (
    <div style={{ maxWidth: "min(100%, 62ch)" }}>
      {eyebrow ? <Eyebrow code={code}>{eyebrow}</Eyebrow> : null}
      <h2 className="h2" style={{ marginTop: eyebrow ? "1rem" : 0 }}>
        {title}
        {accent ? (
          <>
            {" "}
            <span className="t-sweep-brand">{accent}</span>
          </>
        ) : null}
      </h2>
      {lede ? (
        <p className="lede" style={{ marginTop: "1.1rem" }}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* metrics                                                             */
/* ------------------------------------------------------------------ */

export type Metric = { value: string; label: string; claim?: string };

export function MetricRail({ items, columns = 3 }: { items: Metric[]; columns?: 2 | 3 | 4 }) {
  return (
    <dl
      className={`metric-rail ${columns === 4 ? "grid4" : columns === 2 ? "grid2" : "grid3"}`}
      style={{ borderTop: "1px solid currentColor", paddingTop: "1.5rem", opacity: 0.999 }}
    >
      {items.map((m) => (
        <div key={m.label}>
          <dd className="metric" {...(m.claim ? { "data-claim": m.claim } : {})}>
            {m.value}
          </dd>
          <dt className="eyebrow" style={{ marginTop: "0.6rem" }}>
            {m.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* heroes — three distinct variants, never mixed on sibling pages       */
/* ------------------------------------------------------------------ */

/** Archetype A / D: ink surface, text left, wide visual right. */
export function HeroSplit({
  code,
  cluster,
  title,
  accent,
  lede,
  imageId,
  metrics,
  field,
  crumbs,
  meta,
}: {
  code: string;
  cluster: string;
  title: string;
  accent?: string;
  lede: string;
  imageId: string;
  metrics?: Metric[];
  field?: Field;
  crumbs?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <section className="sec sec--ink sec--hero">
      {field ? <div className="sec__field" data-field={field} aria-hidden /> : null}
      <div className="sec__in sec__in--site">
        {crumbs}
        <div className="hsplit" style={{ marginTop: crumbs ? "2.5rem" : 0 }}>
          <div>
            <Eyebrow code={code}>{cluster}</Eyebrow>
            <h1 className="h-display" style={{ marginTop: "1.25rem" }}>
              {title}
              {accent ? (
                <>
                  {" "}
                  <span className="t-sweep-brand">{accent}</span>
                </>
              ) : null}
            </h1>
            <p className="lede" style={{ marginTop: "1.5rem" }}>
              {lede}
            </p>
            {metrics ? (
              <div style={{ marginTop: "2.5rem" }}>
                <MetricRail items={metrics} columns={metrics.length as 2 | 3 | 4} />
              </div>
            ) : null}
            {meta ? <div style={{ marginTop: "2rem" }}>{meta}</div> : null}
          </div>
          <div className="hsplit__media">
            <SeoImage
              id={imageId}
              priority
              ratio="4 / 3"
              radius={14}
              sizes="(max-width: 980px) 100vw, 46vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Archetype E: editorial, no product shot — a stat carries the hero.
 * Also the fallback hero for any page with no image of its own; pass
 * `code` and `field` to relabel it for a non-insight cluster.
 */
export function HeroEditorial({
  category,
  code = "INSIGHT",
  title,
  accent,
  lede,
  stats,
  crumbs,
  meta,
  field = "insight",
}: {
  category: string;
  code?: string;
  title: string;
  accent?: string;
  lede: string;
  stats?: Metric[];
  crumbs?: ReactNode;
  meta?: ReactNode;
  field?: Field;
}) {
  return (
    <section className="sec sec--paper sec--hero">
      <div className="sec__field" data-field={field} aria-hidden />
      <div className="sec__in sec__in--content">
        {crumbs}
        <div style={{ marginTop: crumbs ? "2.5rem" : 0 }}>
          <Eyebrow code={code}>{category}</Eyebrow>
          <h1 className="h-display" style={{ marginTop: "1.25rem", maxWidth: "18ch" }}>
            {title}
            {accent ? (
              <>
                {" "}
                <span className="t-sweep-brand">{accent}</span>
              </>
            ) : null}
          </h1>
          <p className="lede" style={{ marginTop: "1.5rem", maxWidth: "64ch" }}>
            {lede}
          </p>
          {meta ? <div style={{ marginTop: "2rem" }}>{meta}</div> : null}
          {stats ? (
            <div style={{ marginTop: "3rem" }}>
              <MetricRail items={stats} columns={stats.length as 2 | 3 | 4} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Archetype B: the image IS the surface. */
export function HeroMedia({
  code,
  cluster,
  title,
  accent,
  lede,
  imageId,
  metrics,
  crumbs,
}: {
  code: string;
  cluster: string;
  title: string;
  accent?: string;
  lede: string;
  imageId: string;
  metrics?: Metric[];
  crumbs?: ReactNode;
}) {
  return (
    <section className="sec sec--ink" style={{ paddingBlock: 0 }}>
      <div style={{ position: "relative", minHeight: "clamp(560px, 82vh, 900px)", display: "grid" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <SeoImage
            id={imageId}
            priority
            label={false}
            radius={0}
            cover
            sizes="100vw"
          />
        </div>
        {/* scrim: a gradient, not a flat overlay, so the image keeps depth */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.72) 38%, rgba(15,23,42,0.24) 72%, rgba(15,23,42,0.35) 100%)",
          }}
        />
        <div
          className="sec__in sec__in--site"
          style={{
            position: "relative",
            zIndex: 2,
            alignSelf: "end",
            paddingBlock: "clamp(7rem, 12vh, 9rem) clamp(3rem, 6vh, 4.5rem)",
          }}
        >
          {crumbs}
          <div style={{ marginTop: crumbs ? "2rem" : 0, maxWidth: "min(100%, 68ch)" }}>
            <Eyebrow code={code}>{cluster}</Eyebrow>
            <h1 className="h-display" style={{ marginTop: "1.25rem", color: "#F8FAFC" }}>
              {title}
              {accent ? (
                <>
                  {" "}
                  <span className="t-sweep-brand">{accent}</span>
                </>
              ) : null}
            </h1>
            <p className="lede" style={{ marginTop: "1.35rem", color: "rgba(226,232,240,0.9)" }}>
              {lede}
            </p>
          </div>
          {metrics ? (
            <div style={{ marginTop: "2.5rem", color: "rgba(226,232,240,0.5)" }}>
              <MetricRail items={metrics} columns={metrics.length as 2 | 3 | 4} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* body sections                                                       */
/* ------------------------------------------------------------------ */

export type Item = { code?: string; title: string; body: ReactNode };

/** Scannable takeaways directly under the hero. */
export function SummaryBand({ title, items }: { title: string; items: Item[] }) {
  return (
    <Section surface="canvas" width="site" pad="band">
      <Eyebrow>{title}</Eyebrow>
      <div className={items.length === 4 ? "grid4" : "grid3"} style={{ marginTop: "1.75rem" }}>
        {items.map((it) => (
          <div key={it.title} style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.1rem" }}>
            {it.code ? <span className="pill">{it.code}</span> : null}
            <h3 className="h3" style={{ marginTop: it.code ? "0.75rem" : 0 }}>
              {it.title}
            </h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.94rem", lineHeight: 1.62, color: "var(--ink-dim)" }}>
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** The page's visual centre: a wide render with HTML callouts beneath. */
export function DiagramWide({
  imageId,
  eyebrow,
  title,
  lede,
  callouts,
  field,
  surface = "paper",
}: {
  imageId: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  callouts?: Item[];
  field?: Field;
  surface?: Surface;
}) {
  return (
    <Section surface={surface} width="wide" pad="major" field={field}>
      <SectionHead eyebrow={eyebrow} title={title} lede={lede} />
      <figure style={{ marginTop: "clamp(2rem, 4vw, 3.25rem)" }}>
        <SeoImage id={imageId} ratio="16 / 9" radius={16} sizes="94vw" />
      </figure>
      {callouts ? (
        <div className={callouts.length === 3 ? "grid3" : "grid4"} style={{ marginTop: "2rem" }}>
          {callouts.map((c, i) => (
            <div key={c.title} style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1rem" }}>
              <span
                className="metric"
                style={{ fontSize: "1.1rem", color: "var(--brand-deep)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="h3" style={{ marginTop: "0.5rem", fontSize: "1rem" }}>
                {c.title}
              </h3>
              <p style={{ marginTop: "0.4rem", fontSize: "0.88rem", lineHeight: 1.6, color: "var(--ink-dim)" }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </Section>
  );
}

/** Sticky visual + scrolling numbered steps. CSS sticky, no JS. */
export function StickyExplainer({
  imageId,
  eyebrow,
  title,
  lede,
  steps,
  caption,
  surface = "canvas",
  field,
}: {
  imageId: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  steps: Item[];
  caption?: string;
  surface?: Surface;
  field?: Field;
}) {
  return (
    <Section surface={surface} width="site" pad="major" field={field}>
      <div className="sticky2">
        <div className="sticky2__stick">
          <SeoImage id={imageId} ratio="4 / 5" radius={14} sizes="(max-width: 980px) 100vw, 44vw" />
          {caption ? (
            <p className="eyebrow" style={{ marginTop: "0.9rem" }}>
              {caption}
            </p>
          ) : null}
        </div>
        <div>
          <SectionHead eyebrow={eyebrow} title={title} lede={lede} />
          <ol style={{ listStyle: "none", marginTop: "2.5rem", display: "grid", gap: "2rem" }}>
            {steps.map((s, i) => (
              <li key={s.title} style={{ display: "grid", gridTemplateColumns: "3.25rem 1fr", gap: "1rem" }}>
                <span className="metric" style={{ fontSize: "1.25rem", color: "var(--brand-deep)" }}>
                  {s.code ?? String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="h3">{s.title}</h3>
                  <p style={{ marginTop: "0.5rem", fontSize: "0.97rem", lineHeight: 1.7, color: "var(--ink-dim)" }}>
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

/** 50-50 copy + edge-filling visual. Alternate `flip` between instances. */
export function SplitFeature({
  imageId,
  eyebrow,
  title,
  accent,
  children,
  bullets,
  flip = false,
  surface = "paper",
  field,
  ratio = "4 / 3",
}: {
  imageId: string;
  eyebrow?: string;
  title: string;
  accent?: string;
  children?: ReactNode;
  bullets?: string[];
  flip?: boolean;
  surface?: Surface;
  field?: Field;
  ratio?: string;
}) {
  return (
    <Section surface={surface} width="site" pad="major" field={field}>
      <div className={`split${flip ? " split--flip" : ""}`}>
        <div>
          <SectionHead eyebrow={eyebrow} title={title} accent={accent} />
          <div className="prose" style={{ marginTop: "1.35rem" }}>
            {children}
          </div>
          {bullets ? (
            <ul className="limits" style={{ marginTop: "1.75rem" }}>
              {bullets.map((b) => (
                <li key={b.slice(0, 28)} style={{ fontSize: "0.95rem" }}>
                  {b}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <SeoImage id={imageId} ratio={ratio} radius={14} sizes="(max-width: 900px) 100vw, 46vw" />
      </div>
    </Section>
  );
}

/** Wide decision/comparison table that scrolls in its own container. */
export function MatrixTable({
  eyebrow,
  title,
  lede,
  head,
  rows,
  surface = "paper",
  field,
  id,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  head: string[];
  rows: ReactNode[][];
  surface?: Surface;
  field?: Field;
  id?: string;
}) {
  return (
    <Section surface={surface} width="wide" pad="major" field={field} id={id}>
      <SectionHead eyebrow={eyebrow} title={title} lede={lede} />
      <div className="tblwrap" style={{ marginTop: "2.25rem" }}>
        <table className="tbl">
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/** The ink contrast beat. Must be followed by a light surface. */
export function QuoteMetric({
  quote,
  attribution,
  metric,
  label,
  claim,
  field,
}: {
  quote: string;
  attribution?: string;
  metric?: string;
  label?: string;
  claim?: string;
  field?: Field;
}) {
  return (
    <Section surface="ink" width="site" pad="band" field={field}>
      <div
        style={{
          display: "grid",
          gap: "clamp(2rem, 4vw, 4rem)",
          gridTemplateColumns: metric ? "minmax(0, 1.7fr) minmax(0, 1fr)" : "1fr",
          alignItems: "center",
        }}
      >
        <blockquote style={{ margin: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-display), ui-sans-serif, system-ui",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.25,
              fontSize: "clamp(1.4rem, 2.8vw, 2.3rem)",
              color: "#F8FAFC",
              textWrap: "balance",
            }}
          >
            {quote}
          </p>
          {attribution ? (
            <footer className="eyebrow" style={{ marginTop: "1.25rem" }}>
              {attribution}
            </footer>
          ) : null}
        </blockquote>
        {metric ? (
          <div style={{ textAlign: "right" }}>
            <p className="metric" {...(claim ? { "data-claim": claim } : {})}>
              {metric}
            </p>
            {label ? (
              <p className="eyebrow" style={{ marginTop: "0.7rem", justifyContent: "flex-end" }}>
                {label}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </Section>
  );
}

/** Archetype E: the answer, up front, oversized, in a glass panel. */
export function ExecutiveAnswer({
  label = "The short answer",
  children,
  surface = "canvas",
}: {
  label?: string;
  children: ReactNode;
  surface?: Surface;
}) {
  return (
    <Section surface={surface} width="content" pad="flow" id="answer">
      <div
        style={{
          border: "1px solid var(--edge-bright)",
          borderLeft: "3px solid var(--brand)",
          borderRadius: 14,
          background: "var(--glass-bg-strong)",
          padding: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        <p className="eyebrow">{label}</p>
        <div
          style={{
            marginTop: "1rem",
            fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)",
            lineHeight: 1.6,
            color: "var(--ink-strong)",
          }}
        >
          {children}
        </div>
      </div>
    </Section>
  );
}

/** A wide figure — chart, table, or worked calculation — with a caption. */
export function DataFigure({
  eyebrow,
  title,
  lede,
  caption,
  children,
  surface = "paper",
  width = "wide",
  field,
  id,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  caption?: string;
  children: ReactNode;
  surface?: Surface;
  width?: Width;
  field?: Field;
  id?: string;
}) {
  return (
    <Section surface={surface} width={width} pad="major" field={field} id={id}>
      <SectionHead eyebrow={eyebrow} title={title} lede={lede} />
      <figure style={{ marginTop: "clamp(2rem, 4vw, 3rem)" }}>
        {children}
        {caption ? (
          <figcaption className="eyebrow" style={{ marginTop: "1rem" }}>
            {caption}
          </figcaption>
        ) : null}
      </figure>
    </Section>
  );
}

/** Honest limits. Mandatory on engineering, use-case, and insight pages. */
export function LimitsBlock({
  title = "Where this is not the right answer",
  eyebrow = "HONEST LIMITS",
  lede,
  items,
}: {
  title?: string;
  eyebrow?: string;
  lede?: string;
  /** ReactNode so a limit can carry an inline <Cite/>; strings still work. */
  items: ReactNode[];
}) {
  return (
    <Section surface="canvas" width="content" pad="flow" id="limitations">
      <SectionHead eyebrow={eyebrow} title={title} lede={lede} />
      <ul className="limits" style={{ marginTop: "2rem" }}>
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </Section>
  );
}

/** The only place long prose is allowed — and it is still two columns. */
export function ProseWithRail({
  rail,
  children,
  surface = "paper",
  width = "content",
  id,
}: {
  rail?: ReactNode;
  children: ReactNode;
  surface?: Surface;
  width?: Width;
  id?: string;
}) {
  return (
    <Section surface={surface} width={width} pad="flow" id={id}>
      <div className="proserail">
        <div className="prose">{children}</div>
        {rail ? <aside className="proserail__rail">{rail}</aside> : null}
      </div>
    </Section>
  );
}

export function CardGrid({
  eyebrow,
  title,
  lede,
  items,
  columns = 3,
  surface = "paper",
  field,
  id,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  items: Item[];
  columns?: 2 | 3 | 4;
  surface?: Surface;
  field?: Field;
  id?: string;
}) {
  return (
    <Section surface={surface} width="site" pad="major" field={field} id={id}>
      <SectionHead eyebrow={eyebrow} title={title} lede={lede} />
      <div
        className={columns === 4 ? "grid4" : columns === 2 ? "grid2" : "grid3"}
        style={{ marginTop: "2.5rem" }}
      >
        {items.map((it) => (
          <article key={it.title} className="card">
            {it.code ? <span className="pill">{it.code}</span> : null}
            <h3 className="h3" style={{ marginTop: it.code ? "0.8rem" : 0 }}>
              {it.title}
            </h3>
            <p>{it.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

/** Static markup (no accordion) so answers stay in the DOM for FAQJsonLd. */
export function FAQBlock({
  items,
  title = "Frequently asked questions",
  surface = "paper",
}: {
  items: { q: string; a: string }[];
  title?: string;
  surface?: Surface;
}) {
  return (
    <Section surface={surface} width="site" pad="major" id="faq">
      <SectionHead eyebrow="QUESTIONS" title={title} />
      <div className="grid2" style={{ marginTop: "2.5rem" }}>
        {items.map((f) => (
          <div key={f.q} style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <h3 className="h3">{f.q}</h3>
            <p style={{ marginTop: "0.65rem", fontSize: "0.97rem", lineHeight: 1.7, color: "var(--ink-dim)" }}>
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function RelatedRail({
  title = "Continue",
  items,
  surface = "canvas",
}: {
  title?: string;
  items: { href: string; label: string; title: string }[];
  surface?: Surface;
}) {
  return (
    <Section surface={surface} width="site" pad="flow">
      <Eyebrow>{title}</Eyebrow>
      <div className={items.length === 4 ? "grid4" : "grid3"} style={{ marginTop: "1.75rem" }}>
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="linkcard">
            <span className="eyebrow">{it.label}</span>
            <h3 className="h3" style={{ marginTop: "0.7rem", fontSize: "1.05rem" }}>
              {it.title}
            </h3>
            <span
              className="arrow"
              aria-hidden
              style={{ marginTop: "1rem", display: "inline-block", color: "var(--brand-deep)" }}
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function CTABand({
  title,
  accent,
  body,
  primary,
  secondary,
  field,
}: {
  title: string;
  accent?: string;
  body?: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  field?: Field;
}) {
  return (
    <section className="sec sec--ink sec--band">
      {field ? <div className="sec__field" data-field={field} aria-hidden /> : null}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "radial-gradient(60% 70% at 50% 110%, rgba(37,99,235,0.35), transparent 70%)",
        }}
      />
      <div className="sec__in sec__in--site" style={{ textAlign: "center" }}>
        <h2 className="h2" style={{ marginInline: "auto" }}>
          {title}
          {accent ? (
            <>
              {" "}
              <span className="t-sweep-brand">{accent}</span>
            </>
          ) : null}
        </h2>
        {body ? (
          <p className="lede" style={{ marginTop: "1.1rem", marginInline: "auto", textAlign: "center" }}>
            {body}
          </p>
        ) : null}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "0.85rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href={primary.href} className="btn btn--primary">
            {primary.label}
          </Link>
          {secondary ? (
            <Link href={secondary.href} className="btn btn--ghost">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
