"use client";

/**
 * CatalogEditor — the founder edits every price directly (redesign brief §22).
 * Per category: inline-editable name, description, price (typed in USD, sent
 * as integer cents), billing (one-time / per year), unit, client visibility,
 * delete; add items per category; add categories; volume tiers and the
 * preliminary range spread. Edits commit on blur/change through server
 * actions that validate in the database and keep version history.
 */

import { useState, useTransition } from "react";
import { Check, Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import type { CatalogCategoryRow, CatalogItemRow } from "@/lib/estimates/admin";
import { saveCatalogItem, removeCatalogItem, addCatalogCategory, saveVolumeTiers, saveRangeSpread } from "./actions";
import s from "@/components/private/private.module.css";

export interface Tier { minPods: number; multiplier: number; }

const cell: React.CSSProperties = { padding: "0.45rem 0.6rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", fontSize: 13.5, fontFamily: "inherit", minHeight: 38 };
const mono: React.CSSProperties = { fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" };

export default function CatalogEditor({
  items, categories, tiers, spreadPercent,
}: {
  items: CatalogItemRow[]; categories: CatalogCategoryRow[]; tiers: Tier[]; spreadPercent: number;
}) {
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);
  const grouped = new Map<string, CatalogItemRow[]>();
  for (const c of categories) grouped.set(c.slug, []);
  for (const it of items) grouped.set(it.category_slug ?? "uncategorized", [...(grouped.get(it.category_slug ?? "uncategorized") ?? []), it]);

  function commit(it: CatalogItemRow, patch: Partial<{ name: string; short_description: string | null; price_cents: number | null; billing_frequency: string; unit: string | null; client_visible: boolean }>) {
    setBusy(it.id);
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
      setBusy(null);
    });
  }

  return (
    <div style={{ display: "grid", gap: "1.2rem" }}>
      {/* ---- pricing rules ---- */}
      <section className={s.panel} style={{ padding: "1.1rem 1.2rem" }}>
        <p className={`${s.label} ${s.labelBrand}`}>Pricing rules</p>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "1.2rem", marginTop: "0.8rem" }}>
          <TiersEditor tiers={tiers} disabled={pending} />
          <SpreadEditor spreadPercent={spreadPercent} disabled={pending} />
        </div>
      </section>

      {/* ---- catalog by category ---- */}
      {[...grouped.entries()].map(([slug, rows]) => {
        const cat = categories.find((c) => c.slug === slug);
        return (
          <section key={slug} className={s.panel} style={{ padding: "1.1rem 1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <p className={`${s.label} ${s.labelBrand}`}>{cat?.name ?? slug}</p>
              <span className={s.help} style={{ marginTop: 0 }}>{rows.length} item{rows.length === 1 ? "" : "s"}</span>
            </div>

            <div style={{ display: "grid", gap: 6, marginTop: "0.7rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(140px, 1.1fr) minmax(160px, 1.6fr) 130px 120px 90px 44px 36px", gap: 8, ...mono, color: "var(--ink-faint)", padding: "0 0.3rem" }}>
                <span>Name</span><span>Description</span><span>Price (USD)</span><span>Billing</span><span>Unit</span><span>Visible</span><span />
              </div>
              {rows.map((it) => (
                <div key={it.id} style={{ display: "grid", gridTemplateColumns: "minmax(140px, 1.1fr) minmax(160px, 1.6fr) 130px 120px 90px 44px 36px", gap: 8, alignItems: "center", padding: "0.3rem", borderRadius: 10, background: busy === it.id ? "var(--brand-wash)" : "transparent" }}>
                  <input defaultValue={it.name} style={{ ...cell, fontWeight: 600 }} onBlur={(e) => e.target.value.trim() && e.target.value !== it.name && commit(it, { name: e.target.value.trim() })} aria-label={`${it.name} name`} />
                  <input defaultValue={it.short_description ?? ""} style={cell} onBlur={(e) => e.target.value !== (it.short_description ?? "") && commit(it, { short_description: e.target.value || null })} aria-label={`${it.name} description`} />
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ color: "var(--ink-faint)", fontSize: 13 }}>$</span>
                    <input type="number" min="0" step="1000" defaultValue={it.price_cents == null ? "" : Math.round(it.price_cents / 100)} placeholder="—" style={{ ...cell, textAlign: "right", width: "100%" }}
                      onBlur={(e) => { const v = e.target.value === "" ? null : Math.round(Number(e.target.value)) * 100; if (v !== it.price_cents) commit(it, { price_cents: v }); }} aria-label={`${it.name} price in dollars`} />
                  </div>
                  <select defaultValue={it.billing_frequency} style={cell} onChange={(e) => commit(it, { billing_frequency: e.target.value })} aria-label={`${it.name} billing`}>
                    <option value="one_time">One-time</option><option value="per_year">Per year</option>
                  </select>
                  <input defaultValue={it.unit ?? "pod"} style={cell} onBlur={(e) => e.target.value !== (it.unit ?? "pod") && commit(it, { unit: e.target.value || null })} aria-label={`${it.name} unit`} />
                  <button type="button" onClick={() => commit(it, { client_visible: !it.client_visible })} title={it.client_visible ? "Visible to clients — click to hide" : "Hidden from clients — click to show"} aria-pressed={it.client_visible}
                    style={{ ...cell, display: "grid", placeItems: "center", cursor: "pointer", color: it.client_visible ? "var(--brand-deep)" : "var(--ink-faint)" }}>
                    {it.client_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button type="button" onClick={() => { if (confirm(`Delete "${it.name}" from the catalog?`)) { setBusy(it.id); start(async () => { await removeCatalogItem(it.id); setBusy(null); }); } }}
                    title="Delete item" aria-label={`Delete ${it.name}`} style={{ ...cell, display: "grid", placeItems: "center", cursor: "pointer", color: "#B91C1C" }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <AddItem categorySlug={slug} disabled={pending} />
            </div>
          </section>
        );
      })}

      {/* ---- new category ---- */}
      <form action={addCatalogCategory} className={s.panel} style={{ padding: "1rem 1.2rem", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <p className={`${s.label} ${s.labelBrand}`} style={{ marginRight: 8 }}>New category</p>
        <input name="name" required placeholder="Category name (e.g. Storage)" style={{ ...cell, flex: "1 1 220px" }} />
        <input name="slug" placeholder="slug (optional, e.g. storage)" style={{ ...cell, flex: "1 1 160px" }} />
        <button type="submit" className={`${s.btn} ${s.btnSecondary}`} style={{ minHeight: 38, fontSize: 13 }}><Plus size={14} aria-hidden /> Add category</button>
      </form>
      {pending && <p className={s.help} style={{ display: "flex", alignItems: "center", gap: 6 }}><Loader2 size={13} className="spin" aria-hidden /> Saving…</p>}
      <style>{`.spin{animation:prvSpin 900ms linear infinite}@keyframes prvSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function AddItem({ categorySlug, disabled }: { categorySlug: string; disabled: boolean }) {
  const [, start] = useTransition();
  const [name, setName] = useState(""); const [desc, setDesc] = useState(""); const [price, setPrice] = useState(""); const [billing, setBilling] = useState<"one_time" | "per_year">("one_time");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(140px, 1.1fr) minmax(160px, 1.6fr) 130px 120px 90px 44px 36px", gap: 8, alignItems: "center", padding: "0.3rem", borderTop: "1px dashed var(--edge-bright)", marginTop: 4, paddingTop: 10 }}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New item name" style={cell} aria-label="New item name" />
      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description" style={cell} aria-label="New item description" />
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: "var(--ink-faint)", fontSize: 13 }}>$</span><input type="number" min="0" step="1000" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="price" style={{ ...cell, textAlign: "right", width: "100%" }} aria-label="New item price in dollars" /></div>
      <select value={billing} onChange={(e) => setBilling(e.target.value as "one_time" | "per_year")} style={cell} aria-label="New item billing"><option value="one_time">One-time</option><option value="per_year">Per year</option></select>
      <span className={s.help} style={{ marginTop: 0 }}>pod</span>
      <span />
      <button type="button" disabled={!name.trim() || disabled} title="Add item" aria-label="Add item"
        onClick={() => { const n = name.trim(); const d = desc.trim(); const p = price === "" ? null : Math.round(Number(price)) * 100; const b = billing; setName(""); setDesc(""); setPrice(""); start(async () => { await saveCatalogItem({ categorySlug, name: n, shortDescription: d || undefined, priceCents: p, billingFrequency: b, unit: "pod", clientVisible: true }); }); }}
        style={{ ...cell, display: "grid", placeItems: "center", cursor: name.trim() ? "pointer" : "not-allowed", color: "var(--brand-deep)", opacity: name.trim() ? 1 : 0.5 }}>
        <Plus size={16} />
      </button>
    </div>
  );
}

function TiersEditor({ tiers, disabled }: { tiers: Tier[]; disabled: boolean }) {
  const [rows, setRows] = useState<Tier[]>(tiers.length ? tiers : [{ minPods: 1, multiplier: 1 }]);
  const [, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const update = (i: number, patch: Partial<Tier>) => setRows((r) => r.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  return (
    <div>
      <p className={s.title} style={{ fontSize: "0.95rem" }}>Volume tiers</p>
      <p className={s.help}>Multiplier applied to one-time prices from the given pod count upward (1.00 = list price).</p>
      <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: 8, ...mono, color: "var(--ink-faint)" }}><span>From pods</span><span>Multiplier</span><span /></div>
        {rows.map((t, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: 8 }}>
            <input type="number" min="1" value={t.minPods} onChange={(e) => update(i, { minPods: Number(e.target.value) })} style={cell} aria-label={`Tier ${i + 1} minimum pods`} />
            <input type="number" min="0.01" max="2" step="0.01" value={t.multiplier} onChange={(e) => update(i, { multiplier: Number(e.target.value) })} style={cell} aria-label={`Tier ${i + 1} multiplier`} />
            <button type="button" onClick={() => setRows((r) => r.filter((_, j) => j !== i))} disabled={rows.length === 1} aria-label={`Remove tier ${i + 1}`} style={{ ...cell, display: "grid", placeItems: "center", cursor: "pointer", color: "#B91C1C" }}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
        <button type="button" className={`${s.btn} ${s.btnSecondary}`} style={{ minHeight: 36, fontSize: 12.5 }} onClick={() => setRows((r) => [...r, { minPods: (r[r.length - 1]?.minPods ?? 0) + 1, multiplier: r[r.length - 1]?.multiplier ?? 1 }])}><Plus size={13} aria-hidden /> Tier</button>
        <button type="button" className={`${s.btn} ${s.btnPrimary}`} style={{ minHeight: 36, fontSize: 12.5 }} disabled={disabled} onClick={() => start(async () => { await saveVolumeTiers(rows); setSaved(true); setTimeout(() => setSaved(false), 2000); })}><Check size={13} aria-hidden /> Save tiers</button>
        {saved && <span className={`${s.chip} ${s.chipOk}`}>Saved</span>}
      </div>
    </div>
  );
}

function SpreadEditor({ spreadPercent, disabled }: { spreadPercent: number; disabled: boolean }) {
  const [v, setV] = useState(String(spreadPercent));
  const [, start] = useTransition();
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <p className={s.title} style={{ fontSize: "0.95rem" }}>Preliminary range spread</p>
      <p className={s.help}>Client estimates show total × (1 − spread) to total × (1 + spread). 15 = ±15%.</p>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
        <input type="number" min="0" max="90" step="1" value={v} onChange={(e) => setV(e.target.value)} style={{ ...cell, width: 110, textAlign: "right" }} aria-label="Range spread percent" />
        <span style={{ color: "var(--ink-dim)", fontSize: 14 }}>%</span>
        <button type="button" className={`${s.btn} ${s.btnPrimary}`} style={{ minHeight: 36, fontSize: 12.5 }} disabled={disabled} onClick={() => start(async () => { await saveRangeSpread(Number(v)); setSaved(true); setTimeout(() => setSaved(false), 2000); })}><Check size={13} aria-hidden /> Save spread</button>
        {saved && <span className={`${s.chip} ${s.chipOk}`}>Saved</span>}
      </div>
    </div>
  );
}
