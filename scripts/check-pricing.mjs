/**
 * check-pricing.mjs — self-check for the configurator pricing engine.
 *
 * No test framework (the repo has none). Plain asserts, runnable with:
 *   node scripts/check-pricing.mjs
 *
 * Covers the behaviour that would silently corrupt a customer-facing total:
 * per-pod multiplication, one-time vs recurring separation, pending-review
 * lines never contributing money, integer-only math, and rule evaluation.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// The engine is TypeScript; Node 24 strips types on import for .ts files.
const { priceConfiguration, applyBasisPoints, evaluateRules, formatUsd } = await import(
  "../src/server/configurator/pricing.ts"
);

let passed = 0;
const check = (name, fn) => {
  fn();
  passed++;
  console.log("  ok  " + name);
};

console.log("pricing engine self-check\n");

check("base platform is charged once per pod", () => {
  const one = priceConfiguration(["cap-1"]);
  const four = priceConfiguration(["cap-4"]);
  assert.equal(four.podCount, 4);
  assert.equal(four.oneTimeSubtotalCents, one.oneTimeSubtotalCents * 4);
});

check("per-pod options scale with pod count, flat options do not", () => {
  // svc-survey is flat; svc-transport is per-pod.
  const one = priceConfiguration(["cap-1", "svc-survey", "svc-transport"]);
  const two = priceConfiguration(["cap-2", "svc-survey", "svc-transport"]);
  const survey1 = one.lines.find((l) => l.optionId === "svc-survey");
  const survey2 = two.lines.find((l) => l.optionId === "svc-survey");
  const trans1 = one.lines.find((l) => l.optionId === "svc-transport");
  const trans2 = two.lines.find((l) => l.optionId === "svc-transport");
  assert.equal(survey1.amountCents, survey2.amountCents, "flat line must not scale");
  assert.equal(trans2.amountCents, trans1.amountCents * 2, "per-pod line must scale");
});

check("recurring support is excluded from the one-time subtotal", () => {
  const withSupport = priceConfiguration(["cap-1", "sup-monitored"]);
  const without = priceConfiguration(["cap-1"]);
  assert.equal(
    withSupport.oneTimeSubtotalCents,
    without.oneTimeSubtotalCents,
    "recurring must not leak into one-time"
  );
  assert.ok(withSupport.recurringAnnualCents > 0, "recurring total must be populated");
});

check("recurring support scales per pod", () => {
  const one = priceConfiguration(["cap-1", "sup-monitored"]);
  const four = priceConfiguration(["cap-4", "sup-monitored"]);
  assert.equal(four.recurringAnnualCents, one.recurringAnnualCents * 4);
});

check("pending-review options add no money and are surfaced", () => {
  const base = priceConfiguration(["cap-1"]);
  const withPending = priceConfiguration(["cap-1", "cmp-podos"]);
  assert.equal(
    withPending.oneTimeSubtotalCents,
    base.oneTimeSubtotalCents,
    "a pending-review option must never be silently priced"
  );
  assert.equal(withPending.pendingReview.length, 1);
  assert.equal(withPending.pendingReview[0].optionId, "cmp-podos");
  assert.ok(
    withPending.violations.some(
      (v) => v.optionId === "cmp-podos" && v.severity === "review-required"
    )
  );
});

check("every monetary value stays an integer", () => {
  const est = priceConfiguration([
    "cap-8", "wl-training", "site-renewable", "ext-climate", "cool-n1",
    "pwr-grid-upgrade", "net-redundant", "saf-fire", "svc-civil", "sup-onsite",
  ]);
  for (const line of est.lines) {
    assert.ok(Number.isInteger(line.amountCents), `${line.optionId} amount not an integer`);
  }
  for (const v of [est.oneTimeSubtotalCents, est.recurringAnnualCents, est.rangeLowCents, est.rangeHighCents]) {
    assert.ok(Number.isInteger(v), "aggregate not an integer");
  }
});

check("subtotal equals the sum of its one-time lines", () => {
  const est = priceConfiguration(["cap-4", "ext-acoustic", "cool-waterless", "svc-transport", "sup-standard"]);
  const summed = est.lines
    .filter((l) => l.kind === "one-time")
    .reduce((s, l) => s + l.amountCents, 0);
  assert.equal(est.oneTimeSubtotalCents, summed);
});

check("range brackets the subtotal and rounds half-up", () => {
  const est = priceConfiguration(["cap-2", "ext-solar"]);
  assert.ok(est.rangeLowCents < est.oneTimeSubtotalCents);
  assert.ok(est.rangeHighCents > est.oneTimeSubtotalCents);
  // 12345 * 9200bp = 11357.4 -> 11357;  half-up boundary check:
  assert.equal(applyBasisPoints(100, 10_050), 101);
  assert.equal(applyBasisPoints(1, 5_000), 1); // 0.5 rounds up
});

check("unknown option ids are ignored, not fatal", () => {
  const est = priceConfiguration(["cap-1", "does-not-exist", ""]);
  assert.equal(est.podCount, 1);
  assert.ok(est.oneTimeSubtotalCents > 0);
});

check("lead time is baseline plus the longest option lead, not the sum", () => {
  const est = priceConfiguration(["cap-1", "pwr-grid-upgrade", "ext-climate"]);
  // grid upgrade = 8 weeks, climate = 2 weeks -> baseline + 8, never + 10
  assert.equal(est.leadTimeWeeks, 13 + 8);
});

check("no selection still returns a usable single-pod estimate", () => {
  const est = priceConfiguration([]);
  assert.equal(est.podCount, 1);
  assert.equal(est.lines.length, 1);
  assert.equal(est.violations.length, 0);
});

check("every catalog option id is unique", () => {
  const src = readFileSync(new URL("../src/data/configuratorCatalog.ts", import.meta.url), "utf8");
  const ids = [...src.matchAll(/^\s{8}id: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, "duplicate option id in catalog");
  assert.ok(ids.length > 30, `expected a populated catalog, found ${ids.length}`);
});

check("formatUsd renders whole dollars", () => {
  assert.equal(formatUsd(1_850_000_00), "$1,850,000");
  assert.equal(formatUsd(0), "$0");
});

check("evaluateRules reports nothing for a clean selection", () => {
  assert.equal(evaluateRules(new Set(["cap-1", "wl-inference", "cool-n"])).length, 0);
});

console.log(`\n${passed} checks passed.`);
