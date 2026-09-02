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
import { saveLineItem, removeLineItem, addFromCatalog } from "./actions";

export interface Item {
  id: string; name: string; customer_description: string | null; category_slug: string | null;
  qty: number; unit: string | null; unit_price_cents: number;
  optional: boolean; recurring: boolean; pending_review: boolean;
}
export interface CatalogOption { sku: string; name: string; category: string | null; price_cents: number | null; }

const usd = (c: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(c / 100);
const mono: React.CSSProperties = { fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" };
const cell: React.CSSProperties = { padding: "0.35rem 0.4rem", borderRadius: 6, border: "1px solid var(--edge-bright)", background: "var(--panel)", fontSize: 13, fontFamily: "inherit" };

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
      <div>
        <p style={{ ...mono, fontSize: 9.5, color: "#B45309", marginBottom: "0.7rem" }}>
          Version locked — signed/released proposals are immutable. Create a revision to change it.
        </p>
        <ReadOnlyTable grouped={grouped} />
      </div>
    );
  }

  return (
    <div>
      {[...grouped.entries()].map(([cat, rows]) => (
        <div key={cat} style={{ marginBottom: "1.1rem" }}>
          <p style={{ ...mono, fontSize: 9, color: "var(--brand-deep)", marginBottom: "0.4rem" }}>{cat}</p>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            {rows.map((it) => (
              <div key={it.id} style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap", padding: "0.4rem", borderRadius: 8, background: busyId === it.id ? "var(--brand-wash)" : "transparent", border: "1px solid var(--edge-faint)" }}>
                <input
                  defaultValue={it.name}
                  onBlur={(e) => e.target.value !== it.name && commit(it, { name: e.target.value })}
                  style={{ ...cell, flex: "1 1 200px", fontWeight: 500 }}
                />
                <input
                  type="number" min="0" step="1" defaultValue={it.qty}
                  onBlur={(e) => Number(e.target.value) !== it.qty && commit(it, { qty: Number(e.target.value) })}
                  style={{ ...cell, width: 60, textAlign: "right" }}
                  title="Quantity"
                />
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>$</span>
                  <input
                    type="number" min="0" step="1000" defaultValue={Math.round(it.unit_price_cents / 100)}
                    onBlur={(e) => Math.round(Number(e.target.value)) * 100 !== it.unit_price_cents && commit(it, { unit_price_cents: Math.round(Number(e.target.value)) * 100 })}
                    style={{ ...cell, width: 110, textAlign: "right" }}
                    title="Unit price (USD)"
                  />
                </div>
                <span style={{ width: 100, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13, color: "var(--ink-strong)" }}>
                  {usd(Math.round(it.qty * it.unit_price_cents))}
                </span>
                <label style={{ ...mono, fontSize: 8.5, display: "flex", alignItems: "center", gap: 3, color: "var(--ink-dim)" }} title="Recurring (per year)">
                  <input type="checkbox" defaultChecked={it.recurring} onChange={(e) => commit(it, { recurring: e.target.checked })} /> Rec
                </label>
                <label style={{ ...mono, fontSize: 8.5, display: "flex", alignItems: "center", gap: 3, color: "var(--ink-dim)" }} title="Optional alternate">
                  <input type="checkbox" defaultChecked={it.optional} onChange={(e) => commit(it, { optional: e.target.checked })} /> Opt
                </label>
                <label style={{ ...mono, fontSize: 8.5, display: "flex", alignItems: "center", gap: 3, color: "#B45309" }} title="Pending engineering review">
                  <input type="checkbox" defaultChecked={it.pending_review} onChange={(e) => commit(it, { pending_review: e.target.checked })} /> Pend
                </label>
                <button
                  onClick={() => { setBusyId(it.id); start(async () => { await removeLineItem(publicId, it.id); setBusyId(null); }); }}
                  style={{ ...mono, fontSize: 9, color: "#B91C1C", background: "none", border: "none", cursor: "pointer" }}
                  title="Delete line"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* add controls */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.9rem", paddingTop: "0.9rem", borderTop: "1px solid var(--edge)" }}>
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
    <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
      <select value={sku} onChange={(e) => setSku(e.target.value)} style={{ ...cell }}>
        <option value="">Add catalog item…</option>
        {catalog.map((c) => (
          <option key={c.sku} value={c.sku}>{c.category ? `${c.category} · ` : ""}{c.name}{c.price_cents != null ? ` (${usd(c.price_cents)})` : ""}</option>
        ))}
      </select>
      <button
        disabled={!sku || disabled}
        onClick={() => { const s = sku; setSku(""); start(async () => { await addFromCatalog(publicId, s); }); }}
        style={{ ...mono, fontSize: 9.5, padding: ".45rem .7rem", borderRadius: 8, border: "1px solid var(--brand)", background: "var(--brand-wash)", color: "var(--brand-deep)", cursor: sku ? "pointer" : "not-allowed", opacity: sku ? 1 : 0.5 }}
      >
        + Add
      </button>
    </div>
  );
}

function AddCustom({ publicId, disabled }: { publicId: string; disabled: boolean }) {
  const [, start] = useTransition();
  const [name, setName] = useState("");
  return (
    <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Custom line name…" style={cell} />
      <button
        disabled={!name.trim() || disabled}
        onClick={() => {
          const n = name.trim(); setName("");
          start(async () => { await saveLineItem({ publicId, name: n, qty: 1, unitPriceCents: 0, optional: false, recurring: false, pendingReview: true, categorySlug: "custom" }); });
        }}
        style={{ ...mono, fontSize: 9.5, padding: ".45rem .7rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", cursor: name.trim() ? "pointer" : "not-allowed", opacity: name.trim() ? 1 : 0.5 }}
      >
        + Custom
      </button>
    </div>
  );
}

function ReadOnlyTable({ grouped }: { grouped: Map<string, Item[]> }) {
  return (
    <div>
      {[...grouped.entries()].map(([cat, rows]) => (
        <div key={cat} style={{ marginBottom: "0.9rem" }}>
          <p style={{ ...mono, fontSize: 9, color: "var(--brand-deep)", marginBottom: "0.3rem" }}>{cat}</p>
          {rows.map((it) => (
            <div key={it.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", padding: "0.3rem 0", fontSize: 13, borderTop: "1px solid var(--edge-faint)" }}>
              <span style={{ color: "var(--ink-strong)" }}>{it.name} {it.qty > 1 && <span style={{ color: "var(--ink-faint)" }}>×{it.qty}</span>}</span>
              <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink-strong)" }}>{usd(Math.round(it.qty * it.unit_price_cents))}{it.recurring ? "/yr" : ""}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
