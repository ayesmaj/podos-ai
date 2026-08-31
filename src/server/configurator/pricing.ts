/**
 * pricing.ts — the configurator's pricing engine.
 *
 * Domain service: pure functions, no React, no I/O. The browser may render
 * what this returns but must never be the authoritative calculator — the
 * server action in src/app/configure/actions.ts is the only caller that
 * produces a customer-facing total.
 *
 * Money is integer minor units (US cents) end to end. No floating-point
 * arithmetic ever touches a currency value. Rounding happens once, per line,
 * half-up; totals are the sum of already-rounded lines.
 *
 * ⚠️ Prices come from src/data/configuratorCatalog.ts, which is DEMO data.
 * This engine is real; the numbers it multiplies are not.
 */

import {
  BASE_LEAD_TIME_WEEKS,
  BASE_POD_PRICE_CENTS,
  OPTION_BY_ID,
  POD_COUNT,
  STEPS,
  type CfgOption,
} from "../../data/configuratorCatalog.ts";

export type LineKind = "one-time" | "recurring" | "pending-review";

export interface EstimateLine {
  optionId: string;
  label: string;
  stepLabel: string;
  kind: LineKind;
  /** Resolved amount in cents. Zero for pending-review lines. */
  amountCents: number;
  /** The inputs that produced amountCents — retained for auditability. */
  formula: { unitCents: number; quantity: number; basis: string };
}

export interface Estimate {
  podCount: number;
  lines: EstimateLine[];
  oneTimeSubtotalCents: number;
  recurringAnnualCents: number;
  /** Lines that cannot be priced without PODOS review. */
  pendingReview: { optionId: string; label: string; stepLabel: string }[];
  /** Delivery target in weeks: baseline plus the longest option lead time. */
  leadTimeWeeks: number;
  /** Blocking or advisory rule violations. */
  violations: Violation[];
  /** Range shown to the customer, derived from the one-time subtotal. */
  rangeLowCents: number;
  rangeHighCents: number;
  isDemo: boolean;
}

export interface Violation {
  severity: "blocked" | "review-required" | "info";
  optionId: string;
  message: string;
}

/** Range spread applied to a preliminary estimate: −8% / +18%. */
const RANGE_LOW_BP = 9_200; // basis points of 10,000
const RANGE_HIGH_BP = 11_800;

/**
 * Integer-safe scaling by basis points, rounded half-up.
 * Kept separate so the rounding rule is stated in exactly one place.
 */
export function applyBasisPoints(cents: number, bp: number): number {
  const scaled = cents * bp;
  return Math.floor((scaled + 5_000) / 10_000);
}

function quantityFor(basis: CfgOption["basis"], podCount: number): number {
  return basis === "per-pod" || basis === "per-pod-recurring" ? podCount : 1;
}

function kindFor(basis: CfgOption["basis"]): LineKind {
  if (basis === "pending-review") return "pending-review";
  return basis === "per-pod-recurring" || basis === "flat-recurring" ? "recurring" : "one-time";
}

/**
 * Evaluate compatibility rules over the current selection.
 * Rules are declared on catalog options (requires / excludes). Real threshold
 * rules are authored by PODOS engineering — see BUSINESS_DATA_REQUIRED §D.
 */
export function evaluateRules(selected: Set<string>): Violation[] {
  const violations: Violation[] = [];
  for (const id of selected) {
    const option = OPTION_BY_ID.get(id);
    if (!option) continue;

    for (const req of option.requires ?? []) {
      if (!selected.has(req)) {
        violations.push({
          severity: "blocked",
          optionId: id,
          message: `${option.label} requires ${OPTION_BY_ID.get(req)?.label ?? req}.`,
        });
      }
    }
    for (const exc of option.excludes ?? []) {
      if (selected.has(exc)) {
        violations.push({
          severity: "blocked",
          optionId: id,
          message: `${option.label} cannot be combined with ${OPTION_BY_ID.get(exc)?.label ?? exc}.`,
        });
      }
    }
    if (option.basis === "pending-review") {
      violations.push({
        severity: "review-required",
        optionId: id,
        message: `${option.label} is priced by PODOS engineering after review.`,
      });
    }
  }
  return violations;
}

/**
 * Produce the authoritative estimate for a set of selected option ids.
 * Unknown ids are ignored rather than throwing — a stale client must not be
 * able to crash the calculation.
 */
export function priceConfiguration(selectedIds: string[]): Estimate {
  const selected = new Set(selectedIds.filter((id) => OPTION_BY_ID.has(id)));

  const capacityId = [...selected].find((id) => id in POD_COUNT);
  const podCount = capacityId ? POD_COUNT[capacityId] : 1;

  const lines: EstimateLine[] = [];
  const pendingReview: Estimate["pendingReview"] = [];
  let maxOptionLeadWeeks = 0;

  // Base platform, always present.
  lines.push({
    optionId: "base-platform",
    label: "PODOS pod platform",
    stepLabel: "Platform",
    kind: "one-time",
    amountCents: BASE_POD_PRICE_CENTS * podCount,
    formula: { unitCents: BASE_POD_PRICE_CENTS, quantity: podCount, basis: "per-pod" },
  });

  for (const step of STEPS) {
    for (const option of step.options) {
      if (!selected.has(option.id)) continue;

      if (option.basis === "pending-review") {
        pendingReview.push({ optionId: option.id, label: option.label, stepLabel: step.label });
        continue;
      }
      const unit = option.priceCents ?? 0;
      if (unit === 0) continue; // included at no charge — no line item

      const quantity = quantityFor(option.basis, podCount);
      lines.push({
        optionId: option.id,
        label: option.label,
        stepLabel: step.label,
        kind: kindFor(option.basis),
        amountCents: unit * quantity,
        formula: { unitCents: unit, quantity, basis: option.basis },
      });
      maxOptionLeadWeeks = Math.max(maxOptionLeadWeeks, option.leadTimeWeeks ?? 0);
    }
  }

  const oneTimeSubtotalCents = lines
    .filter((l) => l.kind === "one-time")
    .reduce((sum, l) => sum + l.amountCents, 0);
  const recurringAnnualCents = lines
    .filter((l) => l.kind === "recurring")
    .reduce((sum, l) => sum + l.amountCents, 0);

  return {
    podCount,
    lines,
    oneTimeSubtotalCents,
    recurringAnnualCents,
    pendingReview,
    leadTimeWeeks: BASE_LEAD_TIME_WEEKS + maxOptionLeadWeeks,
    violations: evaluateRules(selected),
    rangeLowCents: applyBasisPoints(oneTimeSubtotalCents, RANGE_LOW_BP),
    rangeHighCents: applyBasisPoints(oneTimeSubtotalCents, RANGE_HIGH_BP),
    isDemo: true,
  };
}

/** Format cents as USD for display. Never used for arithmetic. */
export function formatUsd(cents: number, opts?: { compact?: boolean }): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    ...(opts?.compact ? { notation: "compact", maximumFractionDigits: 1 } : {}),
  }).format(dollars);
}
