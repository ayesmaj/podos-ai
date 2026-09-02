import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, Info, Layers, Package, SlidersHorizontal, Tags } from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import {
  ADMIN_SECRET, listCatalog, listCatalogCategories, listPricingRules, type CatalogItemRow,
} from "@/lib/estimates/admin";
import { menuImage } from "@/lib/proposals/menu-manifest";
import { AppShell, Chip, EmptyState, KpiCard, KpiGrid, PageHeader, Panel, ops as s, usd } from "@/components/ops/ui";
import CatalogEditor, { NewCategoryDrawer, NewItemDrawer, SpreadEditor, TiersEditor, type Tier } from "./CatalogEditor";
import p from "./pricing.module.css";

/**
 * /ops/pricing — Catalog & Pricing (archetype 2, catalog variant + rule
 * editor rail). The founder edits every price, name, description, billing
 * type, unit and client visibility, adds and removes items and categories,
 * and sets the volume tiers and the preliminary range spread. No verification
 * gate (founder decision, docs/decisions.md). Changes take effect immediately
 * in the client configurator's live estimate and in new line items; released
 * proposals are immutable snapshots and are not affected.
 */

export const metadata: Metadata = { title: "Catalog & pricing · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const UNCAT = "uncategorized";

export default async function OpsPricingPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  await requireOps();
  const sp = await searchParams;
  const [itemsRaw, categoriesRaw, rules] = await Promise.all([
    listCatalog(ADMIN_SECRET), listCatalogCategories(ADMIN_SECRET), listPricingRules(ADMIN_SECRET),
  ]);
  const items = itemsRaw ?? [];
  const categories = categoriesRaw ?? [];
  const tierRule = (rules ?? []).find((r) => r.kind === "QUANTITY_TIER" && r.active);
  const rangeRule = (rules ?? []).find((r) => r.kind === "RANGE" && r.active);
  const tiers = (Array.isArray(tierRule?.params) ? (tierRule!.params as Tier[]) : []).map((t) => ({ minPods: Number(t.minPods), multiplier: Number(t.multiplier) }));
  const spreadPercent = Math.round((Number((rangeRule?.params as { spread?: number } | undefined)?.spread ?? 0.15)) * 100);
  const activeRules = (rules ?? []).filter((r) => r.active).length;

  const slugOf = (it: CatalogItemRow) => it.category_slug ?? UNCAT;
  const counts = new Map<string, number>();
  for (const it of items) counts.set(slugOf(it), (counts.get(slugOf(it)) ?? 0) + 1);
  const rail = [...categories.map((c) => ({ slug: c.slug, name: c.name })), ...(counts.has(UNCAT) ? [{ slug: UNCAT, name: "Uncategorized" }] : [])];
  const cat = sp.cat && rail.some((c) => c.slug === sp.cat) ? sp.cat : null;
  const visible = cat ? items.filter((it) => slugOf(it) === cat) : items;
  const clientVisible = items.filter((it) => it.client_visible).length;
  const catName = (slug: string) => rail.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <AppShell active="/ops/pricing">
      <PageHeader title="Catalog & Pricing"
        subtitle="Every product, service and price the client configurator and new line items draw from. Edits apply immediately; released proposals keep their locked snapshot."
        count={`${items.length} item${items.length === 1 ? "" : "s"} · ${categories.length} categor${categories.length === 1 ? "y" : "ies"} · ${activeRules} pricing rule${activeRules === 1 ? "" : "s"} active`}
        actions={<><NewCategoryDrawer /><NewItemDrawer categories={categories} defaultCategory={cat ?? undefined} /></>} />

      <div className={p.kpis}><KpiGrid>
        <KpiCard icon={<Package size={20} strokeWidth={1.8} />} label="Catalog items" value={items.length} context={`${items.length - clientVisible} hidden from clients`} href="/ops/pricing" />
        <KpiCard icon={<Eye size={20} strokeWidth={1.8} />} label="Client-visible items" value={clientVisible} context="shown in the client configurator" tone="green" />
        <KpiCard icon={<Layers size={20} strokeWidth={1.8} />} label="Categories" value={categories.length} context={counts.has(UNCAT) ? `${counts.get(UNCAT)} item(s) uncategorized` : "every item has a category"} tone="cyan" />
        <KpiCard icon={<SlidersHorizontal size={20} strokeWidth={1.8} />} label="Pricing rules active" value={activeRules} context={`${tiers.length} volume tier${tiers.length === 1 ? "" : "s"} · ±${spreadPercent}% range`} tone="purple" />
      </KpiGrid></div>

      <div className={s.split75}>
        <div className={s.stack}>
          <Panel title="Categories" icon={<Tags size={18} aria-hidden />} tight summary={cat ? `Showing ${visible.length} of ${items.length} items in ${catName(cat)}` : `Showing all ${items.length} items`}>
            <div className={p.cats}>
              <Link href="/ops/pricing" className={`${s.filterChip}${cat ? "" : ` ${s.filterChipActive}`}`} aria-pressed={!cat}>All<span className={p.catCount}>{items.length}</span></Link>
              {rail.map((c) => (
                <Link key={c.slug} href={`/ops/pricing?cat=${encodeURIComponent(c.slug)}`} className={`${s.filterChip}${cat === c.slug ? ` ${s.filterChipActive}` : ""}`} aria-pressed={cat === c.slug}>
                  {c.name}<span className={p.catCount}>{counts.get(c.slug) ?? 0}</span>
                </Link>
              ))}
            </div>
          </Panel>

          {items.length === 0 ? (
            <EmptyState icon={<Package size={22} strokeWidth={1.8} />} title="The catalog is empty" text="Add a category, then the first item with the buttons above. Client estimates and line items are priced from here." />
          ) : visible.length === 0 ? (
            <EmptyState title={`No items in ${catName(cat!)}`} text="Add one with “New item” — the category is preselected." action={<Link href="/ops/pricing" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Show all</Link>} />
          ) : (
            <div className={p.grid}>
              {visible.map((it) => {
                const img = it.sku ? menuImage(it.sku) : undefined;
                return (
                  <article key={it.id} className={`${p.card}${it.client_visible ? "" : ` ${p.cardHidden}`}`}>
                    <div className={p.media}>
                      {img ? <Image src={img} alt="" fill sizes="(max-width: 760px) 100vw, 360px" /> : <span className={p.mediaIcon}><Package size={36} strokeWidth={1.5} aria-hidden /></span>}
                      <span className={p.mediaChip}><Chip tone={it.client_visible ? "green" : "muted"}>{it.client_visible ? "Client-visible" : "Hidden"}</Chip></span>
                    </div>
                    <div className={p.body}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ minWidth: 0 }}>
                          <p className={p.name}>{it.name}</p>
                          <p className={s.mono} style={{ marginTop: 3 }}>{it.sku ?? "No SKU"}</p>
                        </div>
                        <Chip tone="cobalt">{catName(slugOf(it))}</Chip>
                      </div>
                      {it.short_description && <p className={p.desc}>{it.short_description}</p>}
                      <div className={p.foot}>
                        <div>
                          <p className={p.price}>{it.price_cents == null ? "—" : usd(it.price_cents)}</p>
                          <p className={p.priceSub}>{it.price_cents == null ? "no price set" : `${it.billing_frequency === "per_year" ? "per year" : "one-time"} · per ${it.unit ?? "pod"}`}</p>
                        </div>
                        <CatalogEditor item={it} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className={s.rail}>
          <Panel title="Volume tiers" icon={<SlidersHorizontal size={18} aria-hidden />} tight summary="Multiplier applied to one-time prices from the given pod count upward (1.00 = list price).">
            <TiersEditor tiers={tiers} />
          </Panel>
          <Panel title="Preliminary range" icon={<Layers size={18} aria-hidden />} tight summary="Client estimates show total × (1 − spread) to total × (1 + spread). 15 = ±15%.">
            <SpreadEditor spreadPercent={spreadPercent} />
          </Panel>
          <Panel title="How prices are built" icon={<Info size={18} aria-hidden />} tight>
            <div className={p.how}>
              <p><b>List price.</b> Each catalog item carries one price in USD, billed <b>one-time</b> or <b>per year</b>, per unit (usually a pod). Only client-visible items appear in the configurator; hidden items can still be added to line items by PODOS.</p>
              <p><b>Volume tiers.</b> One-time prices are multiplied by the tier matching the pod count:</p>
              <div>
                {(tiers.length ? tiers : [{ minPods: 1, multiplier: 1 }]).map((t, i) => (
                  <div key={i} className={p.howRow}><span>from <b className={s.num}>{t.minPods}</b> pod{t.minPods === 1 ? "" : "s"}</span><b className={s.num}>× {t.multiplier.toFixed(2)}</b></div>
                ))}
              </div>
              <p><b>Preliminary range.</b> The client sees the tiered total as a range of <b className={s.num}>±{spreadPercent}%</b> until PODOS releases the proposal.</p>
              <p><b>Snapshots.</b> Edits here change live estimates and new line items immediately. Released proposals keep their locked prices.</p>
            </div>
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}
