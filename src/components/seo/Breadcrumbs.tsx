/**
 * Breadcrumbs — visible crumb trail + matching BreadcrumbList JSON-LD.
 * Required on every internal page (SEO master brief §11).
 */

import Link from "next/link";
import { BreadcrumbJsonLd, type Crumb } from "./jsonld";

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <>
      <BreadcrumbJsonLd crumbs={crumbs} />
      <nav aria-label="Breadcrumb">
        <ol
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.45rem",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 12,
            letterSpacing: "0.08em",
            /* Surface-overridable: a dark section redefines these (see
               .sec--ink in seo-sections.css) so the trail stays legible.
               Without them the current crumb was ink-on-ink, contrast 1.0. */
            color: "var(--crumb-fg, var(--graphite))",
          }}
        >
          {crumbs.map((c, i) => (
            <li key={c.path} style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
              {i > 0 && <span aria-hidden>/</span>}
              {i === crumbs.length - 1 ? (
                <span aria-current="page" style={{ color: "var(--crumb-current, var(--ink))" }}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} style={{ textDecoration: "none", color: "inherit" }}>
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
