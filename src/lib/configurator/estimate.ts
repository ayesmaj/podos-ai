/**
 * estimate.ts — pure estimate engine for /estimate.
 *
 * Pure function over (selection, pricing) so it is trivially testable and
 * so the admin page can re-price a live preview without touching UI code.
 * Capacity figures come from the approved claims register (1 MW per pod
 * designed capacity, 128 GPUs designed-for, 90-day deployment target) —
 * see src/content/data/claims.ts.
 */

import { PRICING, type PricingConfig } from "@/data/configuratorPricing";

/** Approved claim values — do not hardcode these anywhere else. */
export const MW_PER_POD = 1;
export const GPUS_PER_POD = 128;
export const DEPLOY_TARGET_DAYS = 90;

export interface Selection {
  pods: number;
  includeCompute: boolean;
  cooling: string;
  power: string;
  network: string;
  support: string;
  services: string[];
  /** available site power in MW, used for a fit check (0 = unknown) */
  sitePowerMw: number;
}

export interface LineItem {
  label: string;
  detail?: string;
  amount: number;
  kind: "one-time" | "recurring";
}

export interface EstimateResult {
  totalMw: number;
  totalGpus: number;
  deployTargetDays: number;
  lineItems: LineItem[];
  oneTimeSubtotal: number;
  volumeMultiplier: number;
  oneTimeTotal: number;
  recurringPerYear: number;
  /** presentation range — this is an estimate, never a quote */
  low: number;
  high: number;
  /** honest fit warnings; never silently "corrected" */
  warnings: string[];
}

export const DEFAULT_SELECTION: Selection = {
  pods: 2,
  includeCompute: true,
  cooling: "direct-to-chip",
  power: "standard",
  network: "standard",
  support: "standard",
  services: ["siteAssessment", "transport", "commissioning"],
  sitePowerMw: 0,
};

export function estimate(sel: Selection, pricing: PricingConfig = PRICING): EstimateResult {
  const pods = Math.max(1, Math.min(50, Math.round(sel.pods || 1)));
  const items: LineItem[] = [];

  items.push({
    label: `PODOS Pod × ${pods}`,
    detail: "Enclosure, structure, base, systems integration",
    amount: pricing.podBase * pods,
    kind: "one-time",
  });

  if (sel.includeCompute) {
    items.push({
      label: `Compute package × ${pods}`,
      detail: `Designed for ${GPUS_PER_POD} GPUs per pod`,
      amount: pricing.computePackage * pods,
      kind: "one-time",
    });
  }

  const perPod = (
    group: Record<string, { label: string; price: number; note: string }>,
    key: string,
    groupName: string,
  ) => {
    const opt = group[key];
    if (!opt) return;
    items.push({
      label: `${groupName}: ${opt.label}`,
      detail: opt.note,
      amount: opt.price * pods,
      kind: "one-time",
    });
  };
  perPod(pricing.cooling, sel.cooling, "Cooling");
  perPod(pricing.power, sel.power, "Power");
  perPod(pricing.network, sel.network, "Network");

  for (const id of sel.services) {
    const svc = pricing.services[id];
    if (!svc) continue;
    items.push({
      label: svc.label,
      detail: svc.note,
      amount: svc.price * pods,
      kind: "one-time",
    });
  }

  const oneTimeSubtotal = items
    .filter((i) => i.kind === "one-time")
    .reduce((s, i) => s + i.amount, 0);

  // highest tier whose threshold the pod count meets
  const volumeMultiplier = pricing.volumeTiers
    .filter((t) => pods >= t.minPods)
    .reduce((m, t) => Math.min(m, t.multiplier), 1);

  const oneTimeTotal = Math.round(oneTimeSubtotal * volumeMultiplier);

  const support = pricing.support[sel.support];
  const recurringPerYear = support ? support.pricePerYear * pods : 0;
  if (support) {
    items.push({
      label: `Support: ${support.label}`,
      detail: support.note,
      amount: recurringPerYear,
      kind: "recurring",
    });
  }

  const warnings: string[] = [];
  const totalMw = pods * MW_PER_POD;
  if (sel.sitePowerMw > 0 && sel.sitePowerMw < totalMw) {
    warnings.push(
      `This configuration is designed for ${totalMw} MW but you indicated ${sel.sitePowerMw} MW available on site. Either reduce the pod count or plan additional capacity — power availability is the usual constraint.`,
    );
  }
  if (sel.cooling === "air" && sel.includeCompute) {
    warnings.push(
      "Air-only cooling limits achievable rack density. High-density accelerator deployments generally require direct-to-chip liquid cooling.",
    );
  }
  if (sel.power === "off-grid" && pods > 6) {
    warnings.push(
      "Off-grid operation at this scale requires substantial on-site generation and storage — expect a longer site-development timeline.",
    );
  }

  const spread = pricing.rangeSpread;
  return {
    totalMw,
    totalGpus: sel.includeCompute ? pods * GPUS_PER_POD : 0,
    deployTargetDays: DEPLOY_TARGET_DAYS,
    lineItems: items,
    oneTimeSubtotal,
    volumeMultiplier,
    oneTimeTotal,
    recurringPerYear,
    low: Math.round((oneTimeTotal * (1 - spread)) / 10000) * 10000,
    high: Math.round((oneTimeTotal * (1 + spread)) / 10000) * 10000,
    warnings,
  };
}

export const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** Compact form for big figures: $6.2M */
export const fmtCompact = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2)}M`
    : fmtUSD(n);
