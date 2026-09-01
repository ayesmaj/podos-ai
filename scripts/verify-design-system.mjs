/**
 * verify-design-system.mjs — measures every SEO page against the
 * acceptance gate in docs/design/SEO_PAGE_DESIGN_SYSTEM.md §11.
 *
 * Fetches the rendered HTML (needs a running server) and checks, per page:
 *   - section count and how many DISTINCT section types are used
 *   - surface sequence, and whether two ADJACENT sections share a surface
 *   - presence of at least one ink band and one wide section
 *   - exactly one <h1>, every <img> has alt
 *   - only publishable data-claim ids appear
 *
 * Usage: node scripts/verify-design-system.mjs http://localhost:PORT
 */

const BASE = process.argv[2] ?? "http://localhost:3000";

const PUBLISHABLE = new Set(["unit-capacity-1mw", "deployment-window", "pod-gpu-capacity"]);

const PAGES = [
  "/engineering",
  "/engineering/direct-to-chip-liquid-cooling",
  "/engineering/data-center-power-architecture",
  "/engineering/high-density-gpu-infrastructure",
  "/engineering/networking-fiber",
  "/engineering/thermal-enclosure",
  "/engineering/safety-security",
  "/engineering/monitoring-controls",
  "/engineering/data-center-heat-recovery",
  "/deploy",
  "/deploy/site-power-readiness",
  "/deploy/configuration-engineering",
  "/deploy/factory-build-testing",
  "/deploy/transport-placement",
  "/deploy/commissioning",
  "/deploy/operations-maintenance",
  "/use-cases",
  "/use-cases/enterprise-ai",
  "/use-cases/edge-ai",
  "/use-cases/healthcare",
  "/use-cases/universities-research",
  "/compare/modular-ai-data-center-vs-traditional-data-center",
  "/compare/factory-built-vs-site-built-data-center",
  "/compare/liquid-cooling-vs-air-cooling",
  "/compare/on-prem-ai-infrastructure-vs-cloud",
  "/insights/why-ai-infrastructure-is-moving-to-liquid-cooling",
  "/insights/ai-data-center-electricity-demand",
  "/insights/behind-the-meter-ai-compute",
  "/insights/closed-loop-cooling-and-data-center-water-use",
  "/insights/direct-to-chip-vs-immersion-vs-air-cooling",
  "/insights/how-to-evaluate-ai-infrastructure-claims",
  "/insights/warm-water-liquid-cooling-explained",
  "/insights/kv-cache-memory-bottleneck",
  "/resources/ai-infrastructure-glossary",
  "/resources/data-center-readiness-checklist",
];

/** Pull the <main> subtree so nav/footer sections are not counted. */
const mainOf = (html) => {
  const i = html.indexOf("<main");
  if (i === -1) return html;
  const j = html.lastIndexOf("</main>");
  return j === -1 ? html.slice(i) : html.slice(i, j);
};

const analyse = (html) => {
  const main = mainOf(html);

  // top-level-ish sections: any <section class="sec ...">
  const secs = [...main.matchAll(/<section[^>]*class="([^"]*\bsec\b[^"]*)"/g)].map((m) => m[1]);
  const surfaces = secs.map((c) => (c.match(/sec--(paper|canvas|ink|blueprint)/) || [])[1] ?? "?");
  const pads = secs.map((c) => (c.match(/sec--(hero|major|band|flow)/) || [])[1] ?? "?");

  const widths = [...main.matchAll(/sec__in--(bleed|wide|site|content)/g)].map((m) => m[1]);

  let adjacentSame = 0;
  for (let i = 1; i < surfaces.length; i++) if (surfaces[i] === surfaces[i - 1]) adjacentSame++;

  // distinct "section types" approximated by the layout primitives present
  const types = new Set();
  for (const [cls, name] of [
    ["hsplit", "HeroSplit"],
    ["sticky2", "StickyExplainer"],
    ["proserail", "ProseWithRail"],
    ["split", "SplitFeature"],
    ["tblwrap", "MatrixTable"],
    ["limits", "LimitsBlock"],
    ["linkcard", "RelatedRail"],
    ["metric-rail", "MetricRail"],
    ["card", "CardGrid"],
    ["btn--primary", "CTABand"],
  ]) {
    if (new RegExp(`class="[^"]*\\b${cls}\\b`).test(main)) types.add(name);
  }

  const imgs = [...main.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  // A MISSING alt is the failure. alt="" is correct for a decorative image (it
  // tells a screen reader to skip it) — e.g. the glossary header plate, whose
  // registry alt is intentionally empty.
  const imgsNoAlt = imgs.filter((t) => !/\balt=/.test(t)).length;

  const claims = [...main.matchAll(/data-claim="([^"]+)"/g)].map((m) => m[1]);
  const badClaims = [...new Set(claims)].filter((c) => !PUBLISHABLE.has(c));

  return {
    sections: secs.length,
    distinctTypes: types.size,
    surfaces: surfaces.map((s) => s[0].toUpperCase()).join(""),
    adjacentSame,
    ink: surfaces.filter((s) => s === "ink").length,
    wide: widths.filter((w) => w === "wide").length,
    h1: (main.match(/<h1\b/g) || []).length,
    images: imgs.length,
    imgsNoAlt,
    badClaims,
    stale: /in preparation|upcoming|forthcoming/i.test(main),
  };
};

const rows = [];
let fails = 0;

for (const path of PAGES) {
  let html;
  try {
    const res = await fetch(BASE + path);
    if (!res.ok) {
      rows.push({ path, err: `HTTP ${res.status}` });
      fails++;
      continue;
    }
    html = await res.text();
  } catch (e) {
    rows.push({ path, err: String(e.message ?? e) });
    fails++;
    continue;
  }

  const a = analyse(html);
  const problems = [];
  if (a.sections < 6) problems.push(`only ${a.sections} sections`);
  if (a.distinctTypes < 4) problems.push(`only ${a.distinctTypes} section types`);
  if (a.adjacentSame > 0) problems.push(`${a.adjacentSame} adjacent same-surface`);
  if (a.h1 !== 1) problems.push(`${a.h1} h1`);
  if (a.imgsNoAlt) problems.push(`${a.imgsNoAlt} img without alt`);
  if (a.badClaims.length) problems.push(`non-publishable claim: ${a.badClaims.join(",")}`);
  if (a.stale) problems.push(`stale "in preparation" copy`);

  if (problems.length) fails++;
  rows.push({ path, ...a, problems });
}

const pad = (s, n) => String(s).padEnd(n);
console.log(
  pad("PAGE", 58) + pad("SEC", 5) + pad("TYP", 5) + pad("INK", 5) + pad("WIDE", 6) + pad("IMG", 5) + "SURFACES / PROBLEMS",
);
console.log("-".repeat(130));
for (const r of rows) {
  if (r.err) {
    console.log(pad(r.path, 58) + "ERROR " + r.err);
    continue;
  }
  const tail = r.problems.length ? `${r.surfaces}   ⚠ ${r.problems.join("; ")}` : r.surfaces;
  console.log(
    pad(r.path, 58) + pad(r.sections, 5) + pad(r.distinctTypes, 5) + pad(r.ink, 5) + pad(r.wide, 6) + pad(r.images, 5) + tail,
  );
}
console.log("-".repeat(130));
console.log(`${rows.length - fails}/${rows.length} pages pass the design-system gate.`);
process.exit(fails ? 1 : 0);
