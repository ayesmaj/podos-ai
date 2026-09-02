"use client";

/**
 * Catalog editing surfaces for /ops/pricing (redesign brief §22, archetype 2
 * catalog variant). The founder edits every price directly — no verification
 * gate. All forms live in drawers; the page itself only lists and links.
 *
 *  - default `CatalogEditor` — per-item edit drawer (name, description, price in
 *    USD sent as integer cents, billing, unit, client visibility, delete).
 *    Fields commit on blur/change through the same server actions as before.
 *  - `NewItemDrawer`      — add an item to a category.
 *  - `NewCategoryDrawer`  — add a category (posts to addCatalogCategory).
 *  - `TiersEditor`, `SpreadEditor` — the pricing rules, rendered in the rail.
 */

import { useState, useTransition } from "react";
import { Check, Eye, EyeOff, FolderPlus, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { CatalogCategoryRow, CatalogItemRow } from "@/lib/estimates/admin";
import Drawer from "@/components/ops/ui/Drawer";
import s from "@/components/ops/ui/ops.module.css";
import p from "./pricing.module.css";
import { saveCatalogItem, removeCatalogItem, addCatalogCategory, saveVolumeTiers, saveRangeSpread } from "./actions";

export interface Tier { minPods: number; multiplier: number; }

function SaveState({ pending, saved }: { pending: boolean; saved: boolean }) {
  return (
    <span className={p.saveState} aria-live="polite">
      {pending ? <><Loader2 size={13} className={p.spin} aria-hidden /> Saving…</> : saved ? <><Check size={13} aria-hidden /> Saved</> : null}
    </span>
  );
}

/* ---------- per-item editor (drawer) ---------- */
export default function CatalogEditor({ item: it }: { item: CatalogItemRow }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState(it.client_visible);

  function commit(patch: Partial<{ name: string; short_description: string | null; price_cents: number | null; billing_frequency: string; unit: string | null; client_visible: boolean }>) {
    setSaved(false);
    start(async () => {
      await saveCatalogItem({
        id: it.id, categorySlug: it.category_slug ?? "uncategorized", sku: it.sku ?? undefined,
        name: patch.name ?? it.name,
        shortDescription: (patch.short_description ?? it.short_description) || undefined,
        priceCents: patch.price_cents !== undefined ? patch.price_cents : it.price_cents,
        billingFrequency: ((patch.billing_frequency ?? it.billing_frequency) === "per_year" ? "per_year" : "one_time"),
        unit: (patch.unit ?? it.unit) || undefined,
        clientVisible: patch.client_visible ?? it.client_visible,
      });
      setSaved(true);
    });
  }

  return (
    <Drawer
      open={open} onOpenChange={setOpen}
      title={it.name} subtitle={`${it.sku ?? "No SKU"} · ${it.category ?? it.category_slug ?? "Uncategorized"} · changes save on blur`}
      trigger={(openDrawer) => <button type="button" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`} onClick={openDrawer}><Pencil size={14} aria-hidden /> Edit</button>}
      footer={(close) => (
        <>
          <button type="button" className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} disabled={pending}
            onClick={() => { if (confirm(`Delete "${it.name}" from the catalog?`)) start(async () => { await removeCatalogItem(it.id); close(); }); }}>
            <Trash2 size={14} aria-hidden /> Delete item
          </button>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <SaveState pending={pending} saved={saved} />
            <button type="button" className={`${s.btn} ${s.btnPrimary} ${s.btnSm}`} onClick={close}>Done</button>
          </span>
        </>
      )}
    >
      <div className={p.drawerForm}>
        <label className={s.field}>Name
          <input className={s.input} defaultValue={it.name} onBlur={(e) => e.target.value.trim() && e.target.value !== it.name && commit({ name: e.target.value.trim() })} aria-label={`${it.name} name`} />
        </label>
        <label className={s.field}>Short description
          <input className={s.input} defaultValue={it.short_description ?? ""} onBlur={(e) => e.target.value !== (it.short_description ?? "") && commit({ short_description: e.target.value || null })} aria-label={`${it.name} description`} />
        </label>
        <div className={p.drawerRow}>
          <label className={s.field}>Price (USD)
            <span className={p.money}><span aria-hidden>$</span>
              <input className={s.input} type="number" min="0" step="1000" defaultValue={it.price_cents == null ? "" : Math.round(it.price_cents / 100)} placeholder="—"
                onBlur={(e) => { const v = e.target.value === "" ? null : Math.round(Number(e.target.value)) * 100; if (v !== it.price_cents) commit({ price_cents: v }); }} aria-label={`${it.name} price in dollars`} />
            </span>
          </label>
          <label className={s.field}>Billing
            <select className={s.input} defaultValue={it.billing_frequency} onChange={(e) => commit({ billing_frequency: e.target.value })} aria-label={`${it.name} billing`}>
              <option value="one_time">One-time</option><option value="per_year">Per year</option>
            </select>
          </label>
        </div>
        <div className={p.drawerRow}>
          <label className={s.field}>Unit
            <input className={s.input} defaultValue={it.unit ?? "pod"} onBlur={(e) => e.target.value !== (it.unit ?? "pod") && commit({ unit: e.target.value || null })} aria-label={`${it.name} unit`} />
          </label>
          <div className={s.field}>Client visibility
            <button type="button" className={`${s.btn} ${s.btnSecondary}`} style={{ justifyContent: "flex-start", color: visible ? "var(--ops-cobalt-deep)" : "var(--ops-ink-muted)" }}
              aria-pressed={visible} title={visible ? "Visible to clients — click to hide" : "Hidden from clients — click to show"}
              onClick={() => { const next = !visible; setVisible(next); commit({ client_visible: next }); }}>
              {visible ? <Eye size={16} aria-hidden /> : <EyeOff size={16} aria-hidden />} {visible ? "Visible to clients" : "Hidden from clients"}
            </button>
          </div>
        </div>
        <p className={s.muted} style={{ fontSize: 12.5, lineHeight: 1.5 }}>Prices are typed in dollars and stored as integer cents. Edits apply immediately to client estimates and new line items; released proposals keep their locked snapshot.</p>
      </div>
    </Drawer>
  );
}

/* ---------- new item (drawer) ---------- */
export function NewItemDrawer({ categories, defaultCategory }: { categories: CatalogCategoryRow[]; defaultCategory?: string }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [name, setName] = useState(""); const [desc, setDesc] = useState(""); const [price, setPrice] = useState(""); const [billing, setBilling] = useState<"one_time" | "per_year">("one_time");
  const [categorySlug, setCategorySlug] = useState(defaultCategory && categories.some((c) => c.slug === defaultCategory) ? defaultCategory : (categories[0]?.slug ?? "uncategorized"));
  const canSave = !!name.trim() && !pending;
  return (
    <Drawer
      open={open} onOpenChange={setOpen}
      title="New catalog item" subtitle="Created client-visible with unit “pod”; refine it from its card afterwards."
      trigger={(openDrawer) => <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={openDrawer}><Plus size={16} aria-hidden /> New item</button>}
      footer={(close) => (
        <>
          <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={close}>Cancel</button>
          <button type="button" className={`${s.btn} ${s.btnPrimary}`} disabled={!canSave} title="Add item" aria-label="Add item"
            onClick={() => { const n = name.trim(); const d = desc.trim(); const pc = price === "" ? null : Math.round(Number(price)) * 100; const b = billing; start(async () => { await saveCatalogItem({ categorySlug, name: n, shortDescription: d || undefined, priceCents: pc, billingFrequency: b, unit: "pod", clientVisible: true }); close(); }); }}>
            {pending ? <Loader2 size={15} className={p.spin} aria-hidden /> : <Plus size={15} aria-hidden />} Add item
          </button>
        </>
      )}
    >
      <div className={p.drawerForm}>
        <label className={s.field}>Category
          <select className={s.input} value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} aria-label="New item category">
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            {!categories.length && <option value="uncategorized">Uncategorized</option>}
          </select>
        </label>
        <label className={s.field}>Name<input className={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="New item name" autoFocus aria-label="New item name" /></label>
        <label className={s.field}>Short description<input className={s.input} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description" aria-label="New item description" /></label>
        <div className={p.drawerRow}>
          <label className={s.field}>Price (USD)
            <span className={p.money}><span aria-hidden>$</span><input className={s.input} type="number" min="0" step="1000" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="price" aria-label="New item price in dollars" /></span>
          </label>
          <label className={s.field}>Billing
            <select className={s.input} value={billing} onChange={(e) => setBilling(e.target.value as "one_time" | "per_year")} aria-label="New item billing"><option value="one_time">One-time</option><option value="per_year">Per year</option></select>
          </label>
        </div>
      </div>
    </Drawer>
  );
}

/* ---------- new category (drawer) ---------- */
export function NewCategoryDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer
      open={open} onOpenChange={setOpen}
      title="New category" subtitle="Groups catalog items in the configurator and on proposals."
      trigger={(openDrawer) => <button type="button" className={`${s.btn} ${s.btnSecondary}`} onClick={openDrawer}><FolderPlus size={16} aria-hidden /> New category</button>}
      footer={(close) => (
        <>
          <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={close}>Cancel</button>
          <button type="submit" form="new-category-form" className={`${s.btn} ${s.btnPrimary}`}><Plus size={15} aria-hidden /> Add category</button>
        </>
      )}
    >
      {(close) => (
        <form id="new-category-form" className={p.drawerForm} action={async (fd) => { await addCatalogCategory(fd); close(); }}>
          <label className={s.field}>Category name<input className={s.input} name="name" required autoFocus placeholder="e.g. Storage" /></label>
          <label className={s.field}>Slug (optional)<input className={s.input} name="slug" placeholder="e.g. storage — derived from the name when empty" /></label>
        </form>
      )}
    </Drawer>
  );
}

/* ---------- pricing rules ---------- */
export function TiersEditor({ tiers, disabled = false }: { tiers: Tier[]; disabled?: boolean }) {
  const initial = tiers.length ? tiers : [{ minPods: 1, multiplier: 1 }];
  const [rows, setRows] = useState<Tier[]>(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(rows) !== JSON.stringify(initial);
  const update = (i: number, patch: Partial<Tier>) => setRows((r) => r.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  return (
    <div>
      <div className={p.tierGrid} style={{ marginBottom: 6 }}><span className={s.label}>From pods</span><span className={s.label}>Multiplier</span><span /></div>
      <div style={{ display: "grid", gap: 8 }}>
        {rows.map((t, i) => (
          <div key={i} className={p.tierGrid}>
            <input className={s.input} type="number" min="1" value={t.minPods} onChange={(e) => update(i, { minPods: Number(e.target.value) })} aria-label={`Tier ${i + 1} minimum pods`} />
            <input className={s.input} type="number" min="0.01" max="2" step="0.01" value={t.multiplier} onChange={(e) => update(i, { multiplier: Number(e.target.value) })} aria-label={`Tier ${i + 1} multiplier`} />
            <button type="button" className={s.iconBtn} style={{ width: 44, height: 44, color: "var(--ops-danger)" }} onClick={() => setRows((r) => r.filter((_, j) => j !== i))} disabled={rows.length === 1} aria-label={`Remove tier ${i + 1}`}><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
      <div className={p.editorFoot}>
        <button type="button" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`} onClick={() => setRows((r) => [...r, { minPods: (r[r.length - 1]?.minPods ?? 0) + 1, multiplier: r[r.length - 1]?.multiplier ?? 1 }])}><Plus size={14} aria-hidden /> Tier</button>
        <button type="button" className={`${s.btn} ${dirty ? s.btnPrimary : s.btnSecondary} ${s.btnSm}`} disabled={disabled || pending} onClick={() => start(async () => { await saveVolumeTiers(rows); setSaved(true); setTimeout(() => setSaved(false), 2000); })}><Check size={14} aria-hidden /> Save tiers</button>
        <SaveState pending={pending} saved={saved} />
      </div>
    </div>
  );
}

export function SpreadEditor({ spreadPercent, disabled = false }: { spreadPercent: number; disabled?: boolean }) {
  const [v, setV] = useState(String(spreadPercent));
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const dirty = Number(v) !== spreadPercent;
  return (
    <div>
      <label className={s.field} style={{ maxWidth: 200 }}>Spread (±%)
        <input className={s.input} type="number" min="0" max="90" step="1" value={v} onChange={(e) => setV(e.target.value)} aria-label="Range spread percent" style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }} />
      </label>
      <div className={p.editorFoot}>
        <button type="button" className={`${s.btn} ${dirty ? s.btnPrimary : s.btnSecondary} ${s.btnSm}`} disabled={disabled || pending} onClick={() => start(async () => { await saveRangeSpread(Number(v)); setSaved(true); setTimeout(() => setSaved(false), 2000); })}><Check size={14} aria-hidden /> Save spread</button>
        <SaveState pending={pending} saved={saved} />
      </div>
    </div>
  );
}
