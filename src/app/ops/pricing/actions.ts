"use server";

import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import {
  ADMIN_SECRET, deleteCatalogItem, setPricingRule, upsertCatalogCategory, upsertCatalogItem,
} from "@/lib/estimates/admin";

/**
 * Server actions for the catalog & pricing editor. Every action re-checks the
 * admin session and delegates to a SECURITY DEFINER RPC that validates and
 * snapshots history. Prices arrive as integer cents (the client converts the
 * dollars typed in the UI); the browser never computes or stores money.
 */

export async function saveCatalogItem(input: {
  id?: string | null; categorySlug: string; sku?: string; name: string; shortDescription?: string;
  priceCents: number | null; billingFrequency: "one_time" | "per_year"; unit?: string; clientVisible?: boolean;
}) {
  await requireOps();
  const cents = input.priceCents == null ? null : Math.max(0, Math.min(1_000_000_000_000, Math.round(input.priceCents)));
  await upsertCatalogItem(ADMIN_SECRET, { ...input, priceCents: cents });
  revalidatePath("/ops/pricing");
}

export async function removeCatalogItem(id: string) {
  await requireOps();
  await deleteCatalogItem(ADMIN_SECRET, id);
  revalidatePath("/ops/pricing");
}

export async function addCatalogCategory(formData: FormData) {
  await requireOps();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40);
  if (name && slug.length >= 2) await upsertCatalogCategory(ADMIN_SECRET, slug, name);
  revalidatePath("/ops/pricing");
}

export async function saveVolumeTiers(tiers: { minPods: number; multiplier: number }[]) {
  await requireOps();
  const clean = tiers
    .filter((t) => Number.isFinite(t.minPods) && Number.isFinite(t.multiplier))
    .map((t) => ({ minPods: Math.max(1, Math.round(t.minPods)), multiplier: Math.min(2, Math.max(0.01, t.multiplier)) }))
    .sort((a, b) => a.minPods - b.minPods);
  if (clean.length) await setPricingRule(ADMIN_SECRET, "QUANTITY_TIER", clean);
  revalidatePath("/ops/pricing");
}

export async function saveRangeSpread(spreadPercent: number) {
  await requireOps();
  const spread = Math.min(0.9, Math.max(0, spreadPercent / 100));
  await setPricingRule(ADMIN_SECRET, "RANGE", { spread });
  revalidatePath("/ops/pricing");
}
