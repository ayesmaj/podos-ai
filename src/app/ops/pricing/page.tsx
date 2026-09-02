import type { Metadata } from "next";
import { requireOps } from "@/lib/ops/session";
import {
  ADMIN_SECRET, listCatalog, listCatalogCategories, listPricingRules,
} from "@/lib/estimates/admin";
import OpsShell from "@/components/ops/OpsShell";
import CatalogEditor, { type Tier } from "./CatalogEditor";
import s from "@/components/private/private.module.css";

/**
 * /ops/pricing — Catalog & pricing EDITOR. The founder edits every price,
 * name, description, billing type, unit and client visibility directly, adds
 * and removes items and categories, and sets the volume tiers and the
 * preliminary range spread. No verification gate (founder decision,
 * docs/decisions.md). Changes take effect immediately in the client
 * configurator's live estimate and in new line items; released proposals are
 * immutable snapshots and are not affected.
 */

export const metadata: Metadata = { title: "Catalog & pricing · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

export default async function OpsPricingPage() {
  await requireOps();
  const [items, categories, rules] = await Promise.all([
    listCatalog(ADMIN_SECRET), listCatalogCategories(ADMIN_SECRET), listPricingRules(ADMIN_SECRET),
  ]);
  const tierRule = (rules ?? []).find((r) => r.kind === "QUANTITY_TIER" && r.active);
  const rangeRule = (rules ?? []).find((r) => r.kind === "RANGE" && r.active);
  const tiers = (Array.isArray(tierRule?.params) ? (tierRule!.params as Tier[]) : []).map((t) => ({ minPods: Number(t.minPods), multiplier: Number(t.multiplier) }));
  const spreadPercent = Math.round((Number((rangeRule?.params as { spread?: number } | undefined)?.spread ?? 0.15)) * 100);

  return (
    <OpsShell active="/ops/pricing" title="Catalog & pricing">
      <div className={s.root} style={{ minHeight: 0, background: "transparent" }}>
        <p className={s.body} style={{ marginTop: "-1rem", marginBottom: "1.2rem", maxWidth: "80ch" }}>
          {items?.length ?? 0} items across {categories?.length ?? 0} categories. Edit any field inline — changes save on blur and
          apply immediately to client estimates and new line items. Released proposals keep their locked snapshot.
        </p>
        <CatalogEditor items={items ?? []} categories={categories ?? []} tiers={tiers} spreadPercent={spreadPercent} />
      </div>
    </OpsShell>
  );
}
