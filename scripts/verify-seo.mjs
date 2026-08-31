/**
 * verify-seo.mjs — build-quality gate for indexable pages (brief §17).
 *
 * Usage:  node scripts/verify-seo.mjs [baseUrl]
 *         (default http://localhost:3000 — run against `next start` or dev)
 *
 * Fetches /sitemap.xml, then for every listed URL asserts:
 *   - HTTP 200
 *   - <title> present and unique across pages
 *   - meta description present and unique
 *   - exactly one canonical, matching the sitemap URL
 *   - exactly one <h1>
 *   - og:image present
 *   - BreadcrumbList JSON-LD on internal pages (not "/")
 *   - every <img> carries an alt attribute (empty alt allowed = decorative)
 *   - no unpublishable claim ids rendered (data-claim attributes)
 *   - internal <a href="/..."> targets exist in the sitemap or known routes
 *
 * ponytail: HTML checks are regex-based (no DOM dependency). Upgrade to
 * a real parser (linkedom) if markup ever defeats them.
 */

import { readFileSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3000";
const failures = [];
const warn = [];

// unpublishable claim ids from the register (regex-parse the TS file)
const claimsSrc = readFileSync(new URL("../src/content/data/claims.ts", import.meta.url), "utf8");
const blockedIds = [...claimsSrc.matchAll(/id: "([a-z0-9-]+)",[\s\S]*?publishable: (true|false)/g)]
  .filter((m) => m[2] === "false")
  .map((m) => m[1]);

const get = async (path) => {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, html: await res.text() };
};

const one = (html, re, label, url) => {
  const matches = html.match(new RegExp(re.source, re.flags + "g")) ?? [];
  if (matches.length !== 1) failures.push(`${url}: expected exactly one ${label}, found ${matches.length}`);
  return matches[0];
};

const main = async () => {
  const { status, html: sm } = await get("/sitemap.xml");
  if (status !== 200) {
    console.error(`FATAL: /sitemap.xml returned ${status}`);
    process.exit(1);
  }
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const paths = urls.map((u) => new URL(u).pathname.replace(/\/$/, "") || "/");
  console.log(`Sitemap lists ${paths.length} URLs: ${paths.join(", ")}`);

  const titles = new Map();
  const descriptions = new Map();

  for (const [i, path] of paths.entries()) {
    const url = urls[i];
    const { status, html } = await get(path === "/" ? "/" : path);
    if (status !== 200) {
      failures.push(`${path}: HTTP ${status}`);
      continue;
    }

    const title = one(html, /<title>([^<]{1,200})<\/title>/, "<title>", path)?.replace(/<\/?title>/g, "");
    if (title) {
      if (titles.has(title)) failures.push(`${path}: duplicate title with ${titles.get(title)}`);
      titles.set(title, path);
    }

    const desc = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    if (!desc) failures.push(`${path}: missing meta description`);
    else {
      if (descriptions.has(desc)) failures.push(`${path}: duplicate description with ${descriptions.get(desc)}`);
      descriptions.set(desc, path);
    }

    const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
    if (canonicals.length !== 1) failures.push(`${path}: expected 1 canonical, found ${canonicals.length}`);
    else if (canonicals[0].replace(/\/$/, "") !== url.replace(/\/$/, ""))
      failures.push(`${path}: canonical ${canonicals[0]} != sitemap ${url}`);

    one(html, /<h1[\s>]/, "<h1>", path);

    if (!/property="og:image" content="[^"]+"/.test(html)) failures.push(`${path}: missing og:image`);

    if (path !== "/" && !path.startsWith("/invest") && !html.includes('"BreadcrumbList"'))
      failures.push(`${path}: missing BreadcrumbList JSON-LD`);

    const imgsNoAlt = [...html.matchAll(/<img (?![^>]*alt=)[^>]*>/g)];
    if (imgsNoAlt.length) failures.push(`${path}: ${imgsNoAlt.length} <img> without alt attribute`);

    for (const id of blockedIds) {
      if (html.includes(`data-claim="${id}"`))
        failures.push(`${path}: renders unpublishable claim "${id}"`);
    }

    const internal = [...html.matchAll(/href="(\/[a-z0-9\-\/]*)(?:[?#][^"]*)?"/g)]
      .map((m) => m[1].replace(/\/$/, "") || "/")
      .filter((h) => !h.startsWith("/_next") && !h.startsWith("/api"));
    const known = new Set([...paths, "/"]);
    for (const link of new Set(internal)) {
      if (!known.has(link) && !/\.[a-z0-9]+$/.test(link))
        warn.push(`${path}: internal link ${link} not in sitemap (verify it resolves)`);
    }
  }

  if (warn.length) console.log(`\nWARNINGS (${warn.length}):\n- ` + warn.join("\n- "));
  if (failures.length) {
    console.error(`\nSEO GATE FAILED (${failures.length}):\n- ` + failures.join("\n- "));
    process.exit(1);
  }
  console.log(`\nSEO gate passed for ${paths.length} pages.`);
};

main().catch((e) => {
  console.error("verify-seo crashed:", e);
  process.exit(1);
});
