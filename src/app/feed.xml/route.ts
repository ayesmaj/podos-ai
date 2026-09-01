/**
 * /feed.xml — RSS 2.0 feed for insights and newsroom posts.
 *
 * Derived from the indexable-route registry so a published article
 * appears here automatically. Static (no revalidation needed) because the
 * route list is compile-time data.
 */

import { INDEXABLE_ROUTES, SITE, canonicalUrl } from "@/lib/seo/site";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Title-case a slug: "ai-data-center-power" -> "AI Data Center Power" */
const titleFromPath = (p: string) =>
  (p.split("/").pop() ?? "")
    .split("-")
    .map((w) => (/^(ai|gpu|pue|wue|ere|kv|mw)$/i.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

export async function GET() {
  const items = INDEXABLE_ROUTES.filter(
    (r) => r.cluster === "insights" || r.path.startsWith("/newsroom"),
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} — Insights</title>
    <link>${SITE.baseUrl}/</link>
    <description>${esc(SITE.description)}</description>
    <language>en-us</language>
    <atom:link href="${SITE.baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (r) => `    <item>
      <title>${esc(titleFromPath(r.path))}</title>
      <link>${canonicalUrl(r.path)}</link>
      <guid isPermaLink="true">${canonicalUrl(r.path)}</guid>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
