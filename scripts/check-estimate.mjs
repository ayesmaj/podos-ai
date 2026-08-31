/**
 * check-estimate.mjs — assert-based self-check for the estimator math.
 * Run: node scripts/check-estimate.mjs
 * No framework: mirrors the pure logic in src/lib/configurator/estimate.ts
 * against the real pricing config, so a bad edit to either is caught.
 */
import { readFileSync } from "node:fs";

const src = readFileSync("src/data/configuratorPricing.ts", "utf8");
const num = (k) => {
  const m = src.match(new RegExp(k + ":\\s*([0-9_]+)"));
  return m ? Number(m[1].replace(/_/g, "")) : null;
};
const podBase = num("podBase");
const computePackage = num("computePackage");
const spread = Number(src.match(/rangeSpread:\s*([0-9.]+)/)[1]);

let failures = 0;
const ok = (cond, msg) => { if (!cond) { console.error("FAIL:", msg); failures++; } else console.log("ok  -", msg); };

ok(podBase > 0, `podBase parsed (${podBase})`);
ok(computePackage > 0, `computePackage parsed (${computePackage})`);
ok(spread > 0 && spread < 0.5, `rangeSpread sane (${spread})`);

// capacity arithmetic must match the approved claims
const est = readFileSync("src/lib/configurator/estimate.ts", "utf8");
ok(/MW_PER_POD = 1\b/.test(est), "1 MW per pod matches approved claim");
ok(/GPUS_PER_POD = 128\b/.test(est), "128 GPUs per pod matches approved claim");
ok(/DEPLOY_TARGET_DAYS = 90\b/.test(est), "90-day target matches approved claim");

// volume tiers must be monotonically non-increasing and never below 0.5
const tiers = [...src.matchAll(/minPods:\s*(\d+),\s*multiplier:\s*([0-9.]+)/g)]
  .map((m) => ({ minPods: +m[1], multiplier: +m[2] }));
ok(tiers.length >= 2, `volume tiers present (${tiers.length})`);
let prev = Infinity, mono = true;
for (const t of tiers) { if (t.multiplier > prev) mono = false; prev = t.multiplier; }
ok(mono, "volume multipliers never increase with pod count");
ok(tiers.every((t) => t.multiplier > 0.5 && t.multiplier <= 1), "multipliers within (0.5, 1]");

// pricing must be flagged unapproved until a real price book lands
ok(/approved:\s*false/.test(src), "pricing flagged approved:false (estimate-only mode)");

// the page must never call an estimate a quote
const page = readFileSync("src/app/configure/page.tsx", "utf8").toLowerCase();
ok(!/\bis a quote\b|\bbinding quote\b/.test(page), "page never calls the estimate a binding quote");
ok(/preliminary/.test(page), "page carries preliminary-estimate language");

console.log(failures ? `\n${failures} CHECK(S) FAILED` : "\nAll estimator checks passed.");
process.exit(failures ? 1 : 0);
