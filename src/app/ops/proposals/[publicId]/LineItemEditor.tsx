"use client";

/**
 * LineItemEditor — the categorized, editable line-item table (master brief 8).
 *
 * Edits commit on blur / toggle via server actions that recompute totals in
 * the database and revalidate the page (optimistic UI would drift from the
 * authoritative total, so we let the server be the source of truth and show a
 * brief saving state). A locked version (signed/released) renders read-only.
 */

import { useState, useTransition } from "react";
import { Lock, Plus, Trash2 } from "lucide-react";
import s from "@/components/ops/ui/ops.module.css";
import p from "./proposal.module.css";
import { saveLineItem, removeLineItem, addFromCatalog } from "./actions";

export interface Item {
  id: string; name: string; customer_description: string | null; category_slug: string | null;
  qty: number; unit: string | null; unit_price_cents: number;
  optional: boolean; recurring: boolean; pending_review: boolean;
}
export interface CatalogOption { sku: string; name: string; category: string | null; price_cents: number | null; }

const usd = (c: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(c / 100);
const CATEGORIES = ["platform", "compute", "cooling", "power", "network", "deployment", "support", "custom"];

export default function LineItemEditor({
  publicId, items, catalog, locked,
}: {
  publicId: string; items: Item[]; catalog: CatalogOption[]; locked: boolean;
}) {
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const grouped = new Map<string, Item[]>();
  for (const it of items) {
    const key = it.category_slug ?? "custom";
    grouped.set(key, [...(grouped.get(key) ?? []), it]);
  }

  function commit(it: Item, patch: Partial<Item>) {
    if (locked) return;
    setBusyId(it.id);
    start(async () => {
      await saveLineItem({
        publicId, itemId: it.id,
        name: patch.name ?? it.name,
        customerDescription: (patch.customer_description ?? it.customer_description) || undefined,
        categorySlug: (patch.category_slug ?? it.category_slug) || undefined,
        unit: (patch.unit ?? it.unit) || undefined,
        qty: patch.qty ?? it.qty,
        unitPriceCents: patch.unit_price_cents ?? it.unit_price_cents,
        optional: patch.optional ?? it.optional,
        recurring: patch.recurring ?? it.recurring,
        pendingReview: patch.pending_review ?? it.pending_review,
      });
      setBusyId(null);
    });
  }

  if (locked) {
    return (
      <div className={p.editor}>
        <div className={`${s.notice} ${s.noticeWarn}`} style={{ marginBottom: 14 }}>
          <Lock size={15} aria-hidden /> Version locked — signed/released proposals are immutable. Reopen or create a revision to change it.
        </div>
        <ReadOnlyTable grouped={grouped} />
      </div>
    );
  }

  return (
    <div className={p.editor}>
      {[...grouped.entries()].map(([cat, rows]) => (
        <div key={cat} className={p.group}>
          <div className={p.groupHead}><p className={s.label}>{cat}</p><span className={s.muted} style={{ fontSize: 12.5 }}>{rows.length} line{rows.length === 1 ? "" : "s"}</span></div>
          {rows.map((it) => (
            <div key={it.id} className={`${p.li}${busyId === it.id ? ` ${p.liBusy}` : ""}`} aria-busy={busyId === it.id}>
              <input
                className={p.cell} defaultValue={it.name} aria-label="Line item name"
                onBlur={(e) => e.target.value !== it.name && commit(it, { name: e.target.value })}
                style={{ fontWeight: 550 }}
              />
              <input
                className={`${p.cell} ${p.cellNum}`} type="number" min="0" step="1" defaultValue={it.qty}
                onBlur={(e) => Number(e.target.value) !== it.qty && commit(it, { qty: Number(e.target.value) })}
                title="Quantity" aria-label="Quantity"
              />
              <div className={p.price}>
                <span aria-hidden>$</span>
                <input
                  className={`${p.cell} ${p.cellNum}`} type="number" min="0" step="1000" defaultValue={Math.round(it.unit_price_cents / 100)}
                  onBlur={(e) => Math.round(Number(e.target.value)) * 100 !== it.unit_price_cents && commit(it, { unit_price_cents: Math.round(Number(e.target.value)) * 100 })}
                  title="Unit price (USD)" aria-label="Unit price (USD)"
                />
              </div>
              <span className={p.liTotal}>{usd(Math.round(it.qty * it.unit_price_cents))}{it.recurring ? <span className={s.muted} style={{ fontWeight: 500 }}> /yr</span> : null}</span>

              <div className={p.liMeta}>
                <label className={p.flag} title="Recurring (per year)">
                  <input type="checkbox" defaultChecked={it.recurring} onChange={(e) => commit(it, { recurring: e.target.checked })} /> Recurring
                </label>
                <label className={p.flag} title="Optional alternate">
                  <input type="checkbox" defaultChecked={it.optional} onChange={(e) => commit(it, { optional: e.target.checked })} /> Optional
                </label>
                <label className={`${p.flag} ${p.flagPend}`} title="Pending engineering review — blocks release">
                  <input type="checkbox" defaultChecked={it.pending_review} onChange={(e) => commit(it, { pending_review: e.target.checked })} /> Pending review
                </label>
                <button
                  type="button" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`} style={{ marginLeft: "auto", color: "var(--ops-danger)" }}
                  onClick={() => {
                    if (!window.confirm(`Delete "${it.name}" from this proposal?`)) return;
                    setBusyId(it.id); start(async () => { await removeLineItem(publicId, it.id); setBusyId(null); });
                  }}
                  title="Delete line" aria-label={`Delete ${it.name}`}
                >
                  <Trash2 size={13} aria-hidden /> Delete
                </button>
                {/* client-facing description, category and unit — what the estimate sheet prints */}
                <details className={p.detail}>
                  <summary>
                    {it.customer_description ? `Description · ${it.customer_description.slice(0, 90)}${it.customer_description.length > 90 ? "…" : ""}` : "Add client description · category · unit"}
                  </summary>
                  <div className={p.detailGrid}>
                    <textarea
                      className={p.cell} defaultValue={it.customer_description ?? ""} rows={2} placeholder="What the client reads under the item name (one bullet per line)"
                      onBlur={(e) => e.target.value !== (it.customer_description ?? "") && commit(it, { customer_description: e.target.value })}
                      aria-label="Client description"
                    />
                    <select className={p.cell} defaultValue={it.category_slug ?? "custom"} onChange={(e) => commit(it, { category_slug: e.target.value })} title="Category" aria-label="Category">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input className={p.cell} defaultValue={it.unit ?? "pod"} maxLength={16} onBlur={(e) => e.target.value !== (it.unit ?? "") && commit(it, { unit: e.target.value })} title="Unit (e.g. pod, ea, yr)" aria-label="Unit" />
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      ))}

      {items.length === 0 && <p className={s.muted} style={{ fontSize: 13.5 }}>No line items yet — add from the catalog or start a custom line below.</p>}

      {/* add controls */}
      <div className={p.addRow}>
        <AddCatalog publicId={publicId} catalog={catalog} disabled={pending} />
        <AddCustom publicId={publicId} disabled={pending} />
      </div>
    </div>
  );
}

function AddCatalog({ publicId, catalog, disabled }: { publicId: string; catalog: CatalogOption[]; disabled: boolean }) {
  const [, start] = useTransition();
  const [sku, setSku] = useState("");
  return (
    <div className={p.addGroup}>
      <select className={p.cell} value={sku} onChange={(e) => setSku(e.target.value)} aria-label="Catalog item">
        <option value="">Add catalog item…</option>
        {catalog.map((c) => (
          <option key={c.sku} value={c.sku}>{c.category ? `${c.category} · ` : ""}{c.name}{c.price_cents != null ? ` (${usd(c.price_cents)})` : ""}</option>
        ))}
      </select>
      <button
        type="button" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`} disabled={!sku || disabled}
        onClick={() => { const chosen = sku; setSku(""); start(async () => { await addFromCatalog(publicId, chosen); }); }}
      >
        <Plus size={14} aria-hidden /> Add
      </button>
    </div>
  );
}

function AddCustom({ publicId, disabled }: { publicId: string; disabled: boolean }) {
  const [, start] = useTransition();
  const [name, setName] = useState("");
  return (
    <div className={p.addGroup}>
      <input className={p.cell} value={name} onChange={(e) => setName(e.target.value)} placeholder="Custom line name…" aria-label="Custom line name" />
      <button
        type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} disabled={!name.trim() || disabled}
        onClick={() => {
          const n = name.trim(); setName("");
          start(async () => { await saveLineItem({ publicId, name: n, qty: 1, unitPriceCents: 0, optional: false, recurring: false, pendingReview: true, categorySlug: "custom" }); });
        }}
      >
        <Plus size={14} aria-hidden /> Custom
      </button>
    </div>
  );
}

function ReadOnlyTable({ grouped }: { grouped: Map<string, Item[]> }) {
  return (
    <div>
      {[...grouped.entries()].map(([cat, rows]) => (
        <div key={cat} className={p.group}>
          <p className={s.label} style={{ marginBottom: 4 }}>{cat}</p>
          {rows.map((it) => (
            <div key={it.id} className={p.ro}>
              <span style={{ color: "var(--ops-ink)", minWidth: 0 }}>{it.name} {it.qty > 1 && <span className={s.muted}>×{it.qty}</span>}</span>
              <span className={s.num} style={{ fontWeight: 650 }}>{usd(Math.round(it.qty * it.unit_price_cents))}{it.recurring ? "/yr" : ""}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
