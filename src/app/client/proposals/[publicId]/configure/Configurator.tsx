"use client";

/**
 * Configurator — the client's step-through workspace (master brief 9).
 *
 * Left step rail (completion state) · center step canvas · right sticky
 * summary. Every field change and option selection autosaves to the server
 * (debounced) through /api/proposal/save-step, which writes under the viewer's
 * session — the browser never holds the session token or computes any price.
 * localStorage is a recovery cache only; the server is the source of truth.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STEPS, STEP_CATEGORY, type Field } from "@/lib/proposals/steps";

export interface CatalogOption { sku: string; name: string; short_description: string | null; price_cents: number | null; billing_frequency: string; pending: boolean; }
type Save = "idle" | "saving" | "saved" | "failed";

const usd = (c: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(c / 100);
const mono: React.CSSProperties = { fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" };

export default function Configurator({
  publicId, viewerEmail, company, catalogByCategory, initial,
}: {
  publicId: string;
  viewerEmail: string;
  company: string | null;
  catalogByCategory: Record<string, CatalogOption[]>;
  initial: Record<string, Record<string, unknown>>;
}) {
  const [active, setActive] = useState(0);
  const [data, setData] = useState<Record<string, Record<string, unknown>>>(initial);
  const [save, setSave] = useState<Save>("idle");
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const lsKey = `podos:wsp:${publicId}`;

  // recovery cache (server remains source of truth; this only survives reloads)
  useEffect(() => {
    try {
      const cached = localStorage.getItem(lsKey);
      if (cached) setData((d) => ({ ...JSON.parse(cached), ...d }));
    } catch { /* private mode etc. */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((stepId: string, payload: Record<string, unknown>) => {
    try { localStorage.setItem(lsKey, JSON.stringify({ ...data, [stepId]: payload })); } catch { /* ignore */ }
    setSave("saving");
    clearTimeout(timers.current[stepId]);
    timers.current[stepId] = setTimeout(async () => {
      try {
        const res = await fetch("/api/proposal/save-step", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: stepId, payload }),
        });
        setSave(res.ok ? "saved" : "failed");
      } catch { setSave("failed"); }
    }, 600);
  }, [data, lsKey]);

  const setField = (stepId: string, key: string, value: unknown) => {
    setData((d) => {
      const next = { ...(d[stepId] ?? {}), [key]: value };
      const merged = { ...d, [stepId]: next };
      persist(stepId, next);
      return merged;
    });
  };

  const stepComplete = (stepId: string) => {
    const payload = data[stepId];
    return !!payload && Object.values(payload).some((v) => v !== "" && v != null && !(Array.isArray(v) && v.length === 0));
  };

  const step = STEPS[active];
  const catCategory = STEP_CATEGORY[step.id];
  const options = catCategory ? catalogByCategory[catCategory] ?? [] : [];

  // right-summary rollup of chosen product options
  const chosen = useMemo(() => {
    const picks: { label: string; price: number | null; pending: boolean }[] = [];
    for (const [sid, cat] of Object.entries(STEP_CATEGORY)) {
      const sku = data[sid]?.sku as string | undefined;
      if (!sku) continue;
      const opt = (catalogByCategory[cat] ?? []).find((o) => o.sku === sku);
      if (opt) picks.push({ label: opt.name, price: opt.price_cents, pending: opt.pending });
    }
    return picks;
  }, [data, catalogByCategory]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px minmax(0,1fr) 340px", gap: "1.4rem", alignItems: "start", maxWidth: 1680, margin: "0 auto", padding: "1.4rem clamp(1rem,3vw,2rem)" }}>
      {/* step rail */}
      <nav style={{ position: "sticky", top: "1rem", display: "grid", gap: 2 }}>
        {STEPS.map((s, i) => {
          const done = stepComplete(s.id);
          const isActive = i === active;
          return (
            <button key={s.id} onClick={() => setActive(i)} style={{
              textAlign: "left", display: "flex", alignItems: "center", gap: 8,
              padding: "0.5rem 0.6rem", borderRadius: 8, border: "none", cursor: "pointer",
              background: isActive ? "var(--brand-wash)" : "transparent",
            }}>
              <span style={{ ...mono, fontSize: 9, width: 18, color: done ? "#15803D" : isActive ? "var(--brand-deep)" : "var(--ink-faint)" }}>{done ? "✓" : s.no}</span>
              <span style={{ fontSize: 12.5, color: isActive ? "var(--brand-deep)" : "var(--ink-dim)", fontWeight: isActive ? 700 : 500 }}>{s.title}</span>
            </button>
          );
        })}
      </nav>

      {/* canvas */}
      <section style={{ border: "1px solid var(--edge)", borderRadius: 14, background: "var(--panel)", padding: "1.6rem", minHeight: 420 }}>
        <p style={{ ...mono, fontSize: 10, color: "var(--brand)" }}>Step {step.no}</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.02em", color: "var(--ink-strong)", marginTop: 4 }}>{step.title}</h2>
        {step.intro && <p style={{ color: "var(--ink-dim)", fontSize: 13.5, marginTop: 6, lineHeight: 1.55 }}>{step.intro}</p>}

        {/* option cards for product steps */}
        {catCategory && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: "0.8rem", marginTop: "1.2rem" }}>
            {options.length === 0 && <p style={{ fontSize: 13, color: "var(--ink-faint)" }}>Options for this step will appear once the catalog is finalized with PODOS.</p>}
            {options.map((o) => {
              const selected = data[step.id]?.sku === o.sku;
              return (
                <button key={o.sku} onClick={() => setField(step.id, "sku", o.sku)} style={{
                  textAlign: "left", padding: "1rem", borderRadius: 12, cursor: "pointer",
                  border: selected ? "2px solid var(--brand)" : "1px solid var(--edge-bright)",
                  background: selected ? "var(--brand-wash)" : "var(--paper)",
                }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-strong)" }}>{o.name}</p>
                  {o.short_description && <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 4, lineHeight: 1.5 }}>{o.short_description}</p>}
                  <p style={{ ...mono, fontSize: 10, marginTop: 8, color: o.pending ? "#B45309" : "var(--brand-deep)" }}>
                    {o.pending ? "Pending review" : o.price_cents != null ? `${usd(o.price_cents)}${o.billing_frequency === "per_year" ? "/yr" : ""}` : "Included"}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* generic fields */}
        {step.fields.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: "0.9rem", marginTop: "1.2rem" }}>
            {step.fields.map((f) => <FieldInput key={f.key} field={f} value={data[step.id]?.[f.key]} onChange={(v) => setField(step.id, f.key, v)} />)}
          </div>
        )}

        {step.id === "review" && <ReviewSummary data={data} chosen={chosen} />}

        {/* nav */}
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.8rem", paddingTop: "1.2rem", borderTop: "1px solid var(--edge)" }}>
          <button disabled={active === 0} onClick={() => setActive((a) => Math.max(0, a - 1))} style={navBtn(active === 0)}>← Back</button>
          {active < STEPS.length - 1 && <button onClick={() => setActive((a) => Math.min(STEPS.length - 1, a + 1))} style={{ ...navBtn(false), background: "var(--brand-gradient)", color: "#fff", border: "none", marginLeft: "auto" }}>Continue →</button>}
        </div>
      </section>

      {/* sticky summary */}
      <aside style={{ position: "sticky", top: "1rem", border: "1px solid var(--edge)", borderRadius: 14, background: "var(--panel)", padding: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)" }}>Your configuration</p>
          <SaveBadge state={save} />
        </div>
        <p style={{ ...mono, fontSize: 8.5, color: "var(--ink-faint)", marginTop: 4 }}>Prepared for {company ?? viewerEmail}</p>

        <div style={{ marginTop: "1rem", display: "grid", gap: "0.4rem" }}>
          {chosen.length === 0 ? (
            <p style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>Select platform, compute, cooling, power and network options to build your configuration.</p>
          ) : chosen.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem", fontSize: 12.5 }}>
              <span style={{ color: "var(--ink-dim)" }}>{c.label}</span>
              <span style={{ ...mono, fontSize: 9, color: c.pending ? "#B45309" : "var(--ink-strong)", whiteSpace: "nowrap" }}>{c.pending ? "review" : c.price != null ? usd(c.price) : "incl."}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: "1.2rem", lineHeight: 1.6, borderTop: "1px solid var(--edge-faint)", paddingTop: "0.8rem" }}>
          Preliminary — final pricing and scope are confirmed by PODOS after engineering review. Your progress saves automatically.
        </p>
        <p style={{ ...mono, fontSize: 8, color: "var(--ink-faint)", marginTop: "1rem" }}>Confidential — prepared for {company ?? viewerEmail}</p>
      </aside>
    </div>
  );
}

function navBtn(disabled: boolean): React.CSSProperties {
  return { padding: "0.65rem 1.1rem", borderRadius: 10, fontSize: 13.5, fontWeight: 600, fontFamily: "inherit",
    border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)",
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 };
}

function SaveBadge({ state }: { state: Save }) {
  const map: Record<Save, { t: string; c: string }> = {
    idle: { t: "", c: "" }, saving: { t: "Saving…", c: "var(--ink-faint)" },
    saved: { t: "Saved", c: "#15803D" }, failed: { t: "Save failed", c: "#B91C1C" },
  };
  const m = map[state];
  if (!m.t) return null;
  return <span style={{ ...mono, fontSize: 8.5, color: m.c }}>{m.t}</span>;
}

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const base: React.CSSProperties = { width: "100%", padding: "0.6rem 0.7rem", borderRadius: 9, border: "1px solid var(--edge-bright)", background: "var(--paper)", fontSize: 14, fontFamily: "inherit", color: "var(--ink-strong)" };
  const wide = field.type === "textarea" || field.type === "multiselect";
  return (
    <div style={{ gridColumn: wide ? "1 / -1" : undefined }}>
      <label style={{ ...mono, fontSize: 9, color: "var(--ink-faint)", display: "block", marginBottom: 4 }}>{field.label}</label>
      {field.type === "textarea" ? (
        <textarea defaultValue={(value as string) ?? ""} placeholder={field.placeholder} rows={3} onBlur={(e) => onChange(e.target.value)} style={{ ...base, resize: "vertical" }} />
      ) : field.type === "select" ? (
        <select value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} style={base}>
          <option value="">—</option>
          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : field.type === "multiselect" ? (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {field.options?.map((o) => {
            const arr = Array.isArray(value) ? (value as string[]) : [];
            const on = arr.includes(o);
            return (
              <button key={o} type="button" onClick={() => onChange(on ? arr.filter((x) => x !== o) : [...arr, o])} style={{
                ...mono, fontSize: 9.5, padding: ".4rem .7rem", borderRadius: 999, cursor: "pointer",
                border: on ? "1px solid var(--brand)" : "1px solid var(--edge-bright)",
                background: on ? "var(--brand-wash)" : "var(--paper)", color: on ? "var(--brand-deep)" : "var(--ink-dim)",
              }}>{o}</button>
            );
          })}
        </div>
      ) : (
        <input type={field.type} defaultValue={(value as string) ?? ""} placeholder={field.placeholder} onBlur={(e) => onChange(field.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)} style={base} />
      )}
      {field.help && <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 3 }}>{field.help}</p>}
    </div>
  );
}

function ReviewSummary({ data, chosen }: { data: Record<string, Record<string, unknown>>; chosen: { label: string; price: number | null; pending: boolean }[] }) {
  const company = data.company?.company_legal_name as string | undefined;
  const project = data.project?.project_name as string | undefined;
  return (
    <div style={{ marginTop: "1.2rem" }}>
      <p style={{ fontSize: 14, color: "var(--ink-dim)", lineHeight: 1.6 }}>
        Review your configuration, then submit it to PODOS for engineering review. Our team confirms
        pricing, compatibility and scope, and returns a formal proposal.
      </p>
      <div style={{ marginTop: "1rem", display: "grid", gap: "0.4rem", fontSize: 13 }}>
        {company && <Row k="Company" v={company} />}
        {project && <Row k="Project" v={project} />}
        {chosen.map((c, i) => <Row key={i} k={c.label} v={c.pending ? "Pending review" : c.price != null ? usd(c.price) : "Included"} />)}
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", borderTop: "1px solid var(--edge-faint)", padding: "0.35rem 0" }}>
      <span style={{ color: "var(--ink-faint)" }}>{k}</span>
      <span style={{ color: "var(--ink-strong)" }}>{v}</span>
    </div>
  );
}
