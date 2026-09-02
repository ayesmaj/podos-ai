"use client";

/**
 * Configurator v2 — the guided private configuration experience
 * (redesign brief §6–§11). Left step rail (Origin UI stepper state model,
 * ported) · center step canvas (option cards as native radios, structured
 * fields) · right sticky live estimate (server-computed; the figure springs
 * to new values) · Review & Submit · success state.
 *
 * Money never originates here: every change autosaves to
 * /api/proposal/save-step, whose response carries the estimate computed in
 * the database. localStorage is a recovery cache only. Intake-only: there is
 * no approval or signature anywhere in this flow.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Info, Loader2, Send, ShieldCheck, Sparkles,
  Building2, MapPin, Boxes, Cpu, Snowflake, Zap, Network, ShieldAlert, Code2, Truck, LifeBuoy, PenLine, ClipboardCheck,
} from "lucide-react";
import { STEPS, STEP_CATEGORY, type Field } from "@/lib/proposals/steps";
import type { EstimatePreview } from "@/lib/proposals/access";
import EstimateFigure from "@/components/private/EstimateFigure";
import { compactUsd } from "@/lib/proposals/money";
import s from "@/components/private/private.module.css";

export interface CatalogOption {
  sku: string; name: string; short_description: string | null;
  price_cents: number | null; billing_frequency: string; pending: boolean;
}
type Save = "idle" | "saving" | "saved" | "failed";
type Payload = Record<string, unknown>;

const STEP_ICON: Record<string, React.ReactNode> = {
  company: <Building2 size={16} strokeWidth={1.75} />, project: <ClipboardCheck size={16} strokeWidth={1.75} />,
  site: <MapPin size={16} strokeWidth={1.75} />, platform: <Boxes size={16} strokeWidth={1.75} />,
  compute: <Cpu size={16} strokeWidth={1.75} />, cooling: <Snowflake size={16} strokeWidth={1.75} />,
  power: <Zap size={16} strokeWidth={1.75} />, network: <Network size={16} strokeWidth={1.75} />,
  safety: <ShieldAlert size={16} strokeWidth={1.75} />, software: <Code2 size={16} strokeWidth={1.75} />,
  deployment: <Truck size={16} strokeWidth={1.75} />, warranty: <LifeBuoy size={16} strokeWidth={1.75} />,
  custom: <PenLine size={16} strokeWidth={1.75} />, review: <Send size={16} strokeWidth={1.75} />,
};

const usd = (c: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(c / 100);

export default function Configurator({
  publicId, viewerEmail, company, project, catalogByCategory, images, initial, initialEstimate, locked, initialStep,
}: {
  publicId: string;
  viewerEmail: string;
  company: string | null;
  project: string | null;
  catalogByCategory: Record<string, CatalogOption[]>;
  images: Record<string, string>;        // sku -> public image path (only those that exist)
  initial: Record<string, Payload>;
  initialEstimate: EstimatePreview | null;
  locked: boolean;                       // submitted / under review: read-only
  initialStep: number;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(Math.min(Math.max(initialStep, 0), STEPS.length - 1));
  const [data, setData] = useState<Record<string, Payload>>(initial);
  const [estimate, setEstimate] = useState<EstimatePreview | null>(initialEstimate);
  const [save, setSave] = useState<Save>("idle");
  const [flashKey, setFlashKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ reference: string; at: string } | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const lsKey = `podos:wsp:${publicId}`;

  // recovery cache only — the server remains the source of truth
  useEffect(() => {
    try {
      const cached = localStorage.getItem(lsKey);
      if (cached) setData((d) => ({ ...JSON.parse(cached), ...d }));
    } catch { /* private mode */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((stepId: string, payload: Payload, all: Record<string, Payload>) => {
    try { localStorage.setItem(lsKey, JSON.stringify(all)); } catch { /* ignore */ }
    if (locked) return;
    setSave("saving");
    clearTimeout(timers.current[stepId]);
    timers.current[stepId] = setTimeout(async () => {
      try {
        const res = await fetch("/api/proposal/save-step", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: stepId, payload }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) { setSave("failed"); return; }
        setSave("saved");
        if (json.estimate) { setEstimate(json.estimate); setFlashKey(stepId); }
      } catch { setSave("failed"); }
    }, 600);
  }, [lsKey, locked]);

  const setField = (stepId: string, key: string, value: unknown) => {
    setData((d) => {
      const next = { ...(d[stepId] ?? {}), [key]: value };
      const all = { ...d, [stepId]: next };
      persist(stepId, next, all);
      return all;
    });
  };

  const stepDone = (id: string) => {
    const p = data[id];
    return !!p && Object.values(p).some((v) => v !== "" && v != null && !(Array.isArray(v) && v.length === 0));
  };
  const doneCount = STEPS.filter((st) => st.id !== "review" && stepDone(st.id)).length;
  const pct = Math.round((doneCount / (STEPS.length - 1)) * 100);

  const step = STEPS[active];
  const cat = STEP_CATEGORY[step.id];
  const options = cat ? catalogByCategory[cat] ?? [] : [];

  const chosen = useMemo(() => Object.entries(STEP_CATEGORY).flatMap(([sid, c]) => {
    const sku = data[sid]?.sku as string | undefined;
    const opt = sku ? (catalogByCategory[c] ?? []).find((o) => o.sku === sku) : undefined;
    return opt ? [{ step: sid, ...opt }] : [];
  }), [data, catalogByCategory]);

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/proposal/submit", { method: "POST" });
      const json = await res.json();
      if (json.ok || json.reason === "already_submitted") {
        setSubmitted({ reference: json.reference ?? publicId, at: json.submitted_at ?? new Date().toISOString() });
      }
    } finally { setSubmitting(false); }
  }

  /* ------------------------------------------------ success state */
  if (submitted) {
    return (
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(2rem, 6vw, 5rem) 1.25rem" }}>
        <motion.section
          initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`${s.panel} ${s.panelLift}`} style={{ padding: "clamp(1.8rem, 4vw, 3rem)", textAlign: "center" }}
        >
          <motion.div initial={reduce ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
            style={{ width: 72, height: 72, borderRadius: 999, margin: "0 auto", display: "grid", placeItems: "center", background: "rgba(34,197,94,.12)", color: "#15803D" }}>
            <CheckCircle2 size={40} strokeWidth={1.75} aria-hidden />
          </motion.div>
          <p className={`${s.label} ${s.labelBrand}`} style={{ marginTop: "1.2rem" }}>Configuration received</p>
          <h1 className={s.display} style={{ marginTop: "0.6rem" }}>Thank you — PODOS has your configuration.</h1>
          <p className={s.body} style={{ marginTop: "1rem", maxWidth: "52ch", marginInline: "auto" }}>
            Our engineering and commercial teams review every submission — feasibility, compatibility and
            pricing are confirmed before we send you a formal proposal. You will receive a separate private
            link when it is ready.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.6rem", marginTop: "1.6rem", flexWrap: "wrap" }}>
            <div><p className={s.label}>Reference</p><p className={s.num} style={{ fontWeight: 700, marginTop: 4 }}>{submitted.reference}</p></div>
            <div><p className={s.label}>Submitted</p><p style={{ fontWeight: 700, marginTop: 4 }}>{new Date(submitted.at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p></div>
          </div>
          <Link href={`/client/proposals/${publicId}`} className={`${s.btn} ${s.btnSecondary}`} style={{ marginTop: "1.8rem" }}>
            Back to your workspace
          </Link>
        </motion.section>
      </main>
    );
  }

  /* ------------------------------------------------ workspace */
  return (
    <main style={{ maxWidth: 1680, margin: "0 auto", padding: "1.4rem clamp(1rem, 3vw, 2rem) 6rem" }}>
      <div className={s.rise} style={{ display: "grid", gridTemplateColumns: "232px minmax(0, 1fr) 360px", gap: "1.4rem", alignItems: "start" }}>
        {/* ---- step rail ---- */}
        <nav aria-label="Configuration steps" className={s.panel} style={{ padding: "0.8rem", position: "sticky", top: 76, maxHeight: "calc(100vh - 92px)", overflowY: "auto" }}>
          <div className={s.rail}>
            {STEPS.map((st, i) => {
              const state = i === active ? "active" : stepDone(st.id) ? "completed" : "inactive";
              return (
                <button key={st.id} type="button" className={s.step} data-state={state} aria-current={i === active ? "step" : undefined} onClick={() => setActive(i)}>
                  <span className={s.stepNo}>{st.no}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>{STEP_ICON[st.id]}{st.title}</span>
                  <Check size={14} strokeWidth={2.5} className={s.stepTick} aria-hidden />
                </button>
              );
            })}
          </div>
          <div style={{ margin: "0.9rem 0.4rem 0.2rem", paddingTop: "0.9rem", borderTop: "1px solid var(--edge-faint)" }}>
            <p className={s.label}>Estimation completion</p>
            <p className={s.headline} style={{ fontSize: "1.5rem", marginTop: 4 }}>{pct}<span style={{ fontSize: "0.9rem", color: "var(--ink-dim)" }}>%</span></p>
            <div className={s.progress} style={{ marginTop: 8 }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><div className={s.progressFill} style={{ width: `${pct}%` }} /></div>
            <p className={s.help}>{doneCount} of {STEPS.length - 1} complete</p>
          </div>
        </nav>

        {/* ---- canvas ---- */}
        <section className={`${s.panel} ${s.panelLift}`} style={{ padding: "clamp(1.3rem, 2.4vw, 2rem)", minHeight: 560, overflow: "hidden" }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step.id}
              initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
              <p className={`${s.label} ${s.labelBrand}`}>Step {step.no} of {STEPS.length} <span aria-hidden>›</span></p>
              <h2 className={s.headline} style={{ marginTop: 6, fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>{step.title}</h2>
              {step.intro && <p className={s.body} style={{ marginTop: 8, maxWidth: "58ch" }}>{step.intro}</p>}

              {locked && (
                <p className={`${s.chip} ${s.chipCyan}`} style={{ marginTop: "1rem" }}>
                  <Info size={12} strokeWidth={2} aria-hidden /> Submitted — under PODOS review. Read-only.
                </p>
              )}

              {cat && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "1.2rem", padding: "0.75rem 0.9rem", borderRadius: 12, background: "var(--brand-wash)", border: "1px solid rgba(37,99,235,.2)" }}>
                    <Info size={16} strokeWidth={2} color="var(--brand-deep)" aria-hidden />
                    <p style={{ fontSize: 13, color: "var(--ink-dim)" }}><strong style={{ color: "var(--brand-deep)" }}>Engineering guidance</strong> — every option is validated by PODOS engineering after submission; prices are preliminary.</p>
                  </div>
                  <fieldset className={s.optionGroup} style={{ marginTop: "1.1rem" }} disabled={locked}>
                    <legend>{step.title} options</legend>
                    {options.length === 0 && <p className={s.body}>Options for this step are finalized with PODOS during review.</p>}
                    {options.map((o, i) => {
                      const selected = data[step.id]?.sku === o.sku;
                      const img = images[o.sku];
                      return (
                        <label key={o.sku} className={s.option}>
                          <input type="radio" name={`step-${step.id}`} value={o.sku} checked={selected} onChange={() => setField(step.id, "sku", o.sku)} />
                          {i === 0 && <span className={s.optionRibbon}>Recommended</span>}
                          <span className={s.optionCheck} aria-hidden><Check size={14} strokeWidth={3} /></span>
                          <span className={s.optionMedia}>
                            {img ? <Image src={img} alt="" width={640} height={480} sizes="(max-width: 720px) 90vw, 300px" /> : <span style={{ color: "var(--brand)", opacity: 0.6 }}>{STEP_ICON[step.id]}</span>}
                          </span>
                          <span>
                            <span className={s.title} style={{ display: "block" }}>{o.name}</span>
                            {o.short_description && <span className={s.help} style={{ display: "block", marginTop: 4, lineHeight: 1.5 }}>{o.short_description}</span>}
                          </span>
                          <span className={`${s.optionPrice} ${o.pending ? "pending" : o.price_cents ? "" : "included"}`}>
                            {o.pending ? "Pending review" : o.price_cents ? `${o.billing_frequency === "per_year" ? "" : "+ "}${compactUsd(o.price_cents)}${o.billing_frequency === "per_year" ? " / yr" : " per pod"}` : "Included"}
                          </span>
                        </label>
                      );
                    })}
                  </fieldset>
                </>
              )}

              {step.fields.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem", marginTop: "1.2rem" }}>
                  {step.fields.map((f) => <FieldInput key={f.key} field={f} value={data[step.id]?.[f.key]} disabled={locked} onChange={(v) => setField(step.id, f.key, v)} />)}
                </div>
              )}

              {step.id === "review" && (
                <Review data={data} chosen={chosen} images={images} estimate={estimate} viewerEmail={viewerEmail} company={company} project={project} />
              )}

              <div style={{ display: "flex", gap: "0.7rem", alignItems: "center", marginTop: "1.8rem", paddingTop: "1.2rem", borderTop: "1px solid var(--edge)", flexWrap: "wrap" }}>
                <button type="button" className={`${s.btn} ${s.btnSecondary}`} disabled={active === 0} onClick={() => setActive((a) => Math.max(0, a - 1))}>
                  <ArrowLeft size={16} strokeWidth={2} aria-hidden /> Back
                </button>
                {active < STEPS.length - 1 ? (
                  <>
                    <p className={s.help} style={{ marginTop: 0, display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Info size={13} aria-hidden /> Next: {STEPS[active + 1].title}
                    </p>
                    <button type="button" className={`${s.btn} ${s.btnPrimary}`} style={{ marginLeft: "auto" }} onClick={() => setActive((a) => a + 1)}>
                      Next: {STEPS[active + 1].title} <ArrowRight size={16} strokeWidth={2} aria-hidden />
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className={`${s.btn} ${s.btnGhost}`} onClick={() => setActive(0)}><PenLine size={14} aria-hidden /> Edit selections</button>
                    <button type="button" className={`${s.btn} ${s.btnPrimary}`} style={{ marginLeft: "auto", minHeight: 52 }} disabled={submitting || locked} onClick={submit}>
                      {submitting ? <Loader2 size={18} className="spin" aria-hidden /> : <Send size={18} strokeWidth={2} aria-hidden />}
                      {locked ? "Already submitted" : "Submit configuration"}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ---- live estimate ---- */}
        <aside className={s.estimate} aria-label="Preliminary estimate">
          <div className={s.estimateHead}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p className={`${s.label} ${s.labelBrand}`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Sparkles size={13} strokeWidth={2} aria-hidden /> Preliminary estimate</p>
              <SaveBadge state={save} />
            </div>
            <p className={s.estimateFigure} style={{ marginTop: 10 }}>
              {estimate && estimate.high_cents > 0 ? (
                <><EstimateFigure cents={estimate.low_cents} /> – <EstimateFigure cents={estimate.high_cents} suffix="USD" /></>
              ) : (<span style={{ color: "var(--ink-faint)", fontSize: "1.2rem", fontWeight: 600 }}>Select options to see a range</span>)}
            </p>
            {estimate && estimate.recurring_cents > 0 && (
              <p style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 6 }}>+ <EstimateFigure cents={estimate.recurring_cents} compact={false} /> / year support</p>
            )}
            <p className={s.help} style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8 }}><Info size={12} aria-hidden /> Order of magnitude — confirmed by PODOS engineering.</p>
          </div>

          {estimate && estimate.pods > 0 && (
            <div className={s.estimateRow}>
              <span className={s.iconTile} style={{ width: 36, height: 36, borderRadius: 10 }}><Boxes size={16} strokeWidth={1.75} /></span>
              <div><p className={s.label}>Pod quantity</p><p style={{ fontWeight: 700 }}>{estimate.pods} {estimate.multiplier < 1 && <span className={`${s.chip} ${s.chipOk}`} style={{ marginLeft: 6 }}>volume tier</span>}</p></div>
              <span />
            </div>
          )}
          {chosen.length === 0 ? (
            <p className={s.help} style={{ padding: "0.9rem 1.2rem 1.2rem" }}>Choose platform, compute, cooling, power and network options to build your configuration.</p>
          ) : chosen.map((c) => (
            <div key={c.step} className={`${s.estimateRow} ${flashKey === c.step ? s.flash : ""}`} onAnimationEnd={() => setFlashKey(null)}>
              <span className={s.iconTile} style={{ width: 36, height: 36, borderRadius: 10 }}>{STEP_ICON[c.step]}</span>
              <div style={{ minWidth: 0 }}>
                <p className={s.label}>{STEPS.find((x) => x.id === c.step)?.title}</p>
                <p style={{ fontWeight: 600, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
              </div>
              <span className={`${s.label} ${c.pending ? "" : s.labelBrand}`} style={{ color: c.pending ? "#B45309" : undefined, whiteSpace: "nowrap" }}>
                {c.pending ? "review" : c.price_cents ? compactUsd(c.price_cents) : "incl."}
              </span>
            </div>
          ))}
          <div style={{ padding: "0.9rem 1.2rem 1.1rem", borderTop: "1px solid var(--edge-faint)", display: "grid", gap: 6 }}>
            <p className={`${s.chip} ${doneCount === STEPS.length - 1 ? s.chipOk : s.chipCyan}`} style={{ justifySelf: "start" }}>
              <ShieldCheck size={12} strokeWidth={2} aria-hidden /> {locked ? "Submitted" : doneCount === STEPS.length - 1 ? "Configuration complete" : "Draft · autosaved"}
            </p>
            <p className={s.help}>Confidential — prepared for {company ?? viewerEmail}. Access is recorded.</p>
          </div>
        </aside>
      </div>

      {/* mobile summary sheet */}
      <button type="button" className={`${s.btn} ${s.btnPrimary} mobileSheetBtn`} onClick={() => setSheetOpen((o) => !o)} aria-expanded={sheetOpen}
        style={{ position: "fixed", left: 12, right: 12, bottom: 12, zIndex: 30, display: "none" }} data-mobile-sheet>
        {estimate && estimate.high_cents > 0 ? `${compactUsd(estimate.low_cents)} – ${compactUsd(estimate.high_cents)}` : "Estimate"} · {pct}% <ArrowRight size={16} aria-hidden />
      </button>
      <style>{`
        @media (max-width: 1100px) {
          main > div { grid-template-columns: 1fr !important; }
          nav[aria-label="Configuration steps"] { position: static !important; }
          nav[aria-label="Configuration steps"] .${s.rail} { display: flex; overflow-x: auto; gap: 6px; padding-bottom: 4px; }
          nav[aria-label="Configuration steps"] .${s.step} { grid-template-columns: 26px auto; white-space: nowrap; }
          nav[aria-label="Configuration steps"] .${s.stepTick} { display: none; }
          [data-mobile-sheet] { display: inline-flex !important; }
          aside.${s.estimate} { display: ${sheetOpen ? "block" : "none"}; position: fixed; left: 12px; right: 12px; bottom: 72px; z-index: 29; max-height: 60vh; overflow: auto; }
        }
        .spin { animation: prvSpin 900ms linear infinite; } @keyframes prvSpin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}

function SaveBadge({ state }: { state: Save }) {
  if (state === "idle") return null;
  const m = { saving: ["Saving…", "var(--ink-faint)"], saved: ["All changes saved", "#15803D"], failed: ["Save failed — retrying on next change", "#B91C1C"] }[state];
  return <span className={s.label} style={{ color: m[1], fontSize: "0.62rem" }} role="status">{m[0]}</span>;
}

function FieldInput({ field, value, disabled, onChange }: { field: Field; value: unknown; disabled: boolean; onChange: (v: unknown) => void }) {
  const wide = field.type === "textarea" || field.type === "multiselect";
  const id = `f-${field.key}`;
  return (
    <div style={{ gridColumn: wide ? "1 / -1" : undefined }}>
      <label htmlFor={id} className={`${s.label} ${s.fieldLabel}`}>{field.label}</label>
      {field.type === "textarea" ? (
        <textarea id={id} className={s.textarea} defaultValue={(value as string) ?? ""} placeholder={field.placeholder} disabled={disabled} onBlur={(e) => onChange(e.target.value)} />
      ) : field.type === "select" ? (
        <select id={id} className={s.select} value={(value as string) ?? ""} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>
          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : field.type === "multiselect" ? (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }} role="group" aria-labelledby={id}>
          {field.options?.map((o) => {
            const arr = Array.isArray(value) ? (value as string[]) : [];
            const on = arr.includes(o);
            return (
              <button key={o} type="button" disabled={disabled} aria-pressed={on} className={`${s.chip} ${on ? s.chipBrand : ""}`} style={{ cursor: "pointer", minHeight: 36 }}
                onClick={() => onChange(on ? arr.filter((x) => x !== o) : [...arr, o])}>{on && <Check size={11} strokeWidth={3} aria-hidden />}{o}</button>
            );
          })}
        </div>
      ) : (
        <input id={id} className={s.input} type={field.type} defaultValue={(value as string) ?? ""} placeholder={field.placeholder} disabled={disabled}
          onBlur={(e) => onChange(field.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)} />
      )}
      {field.help && <p className={s.help}>{field.help}</p>}
    </div>
  );
}

function Review({ data, chosen, images, estimate, viewerEmail, company, project }: {
  data: Record<string, Payload>; chosen: (CatalogOption & { step: string })[]; images: Record<string, string>;
  estimate: EstimatePreview | null; viewerEmail: string; company: string | null; project: string | null;
}) {
  const c = data.company ?? {}; const pr = data.project ?? {}; const site = data.site ?? {};
  const rows: { icon: React.ReactNode; k: string; v: string; chips: string[]; img?: string }[] = [
    { icon: <Building2 size={18} strokeWidth={1.75} />, k: "Company", v: String(c.company_legal_name || company || "—"), chips: [String(c.industry || ""), String(c.company_size || "")].filter(Boolean) },
    { icon: <ClipboardCheck size={18} strokeWidth={1.75} />, k: "Project", v: String(pr.project_name || project || "—"), chips: [pr.workload ? String(pr.workload) : "", pr.pod_quantity ? `${pr.pod_quantity} pods` : "", pr.required_capacity_mw ? `${pr.required_capacity_mw} MW` : ""].filter(Boolean) },
    { icon: <MapPin size={18} strokeWidth={1.75} />, k: "Deployment site", v: String(site.site_name || site.address || "—"), chips: [String(site.site_type || ""), String(site.fiber || "")].filter(Boolean) },
    ...chosen.map((o) => ({ icon: STEP_ICON[o.step], k: STEPS.find((x) => x.id === o.step)?.title ?? o.step, v: o.name, chips: [o.pending ? "Pending review" : o.price_cents ? compactUsd(o.price_cents) + (o.billing_frequency === "per_year" ? "/yr" : " per pod") : "Included", "Selected"], img: images[o.sku] })),
  ];
  return (
    <div style={{ marginTop: "1.3rem" }}>
      <div className={s.panel} style={{ overflow: "hidden" }}>
        {rows.map((r) => (
          <div key={r.k} className={s.summaryRow}>
            <span className={s.iconTile} style={{ width: 40, height: 40, borderRadius: 10 }}>{r.icon}</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{r.k}</span>
            <span style={{ fontSize: 14.5, color: "var(--ink-strong)" }}>{r.v}</span>
            <span style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {r.chips.map((ch) => <span key={ch} className={`${s.chip} ${ch === "Selected" ? s.chipOk : ch === "Pending review" ? s.chipAmber : ""}`}>{ch === "Selected" && <Check size={11} strokeWidth={3} aria-hidden />}{ch}</span>)}
            </span>
            {r.img ? <span className={s.summaryThumb}><Image src={r.img} alt="" width={168} height={112} /></span> : <span aria-hidden />}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center", marginTop: "1.2rem", padding: "1rem 1.2rem", borderRadius: 14, background: "var(--brand-wash)", border: "1px solid rgba(37,99,235,.2)" }}>
        <div>
          <p className={s.label}>Preliminary estimate</p>
          <p className={s.headline} style={{ fontSize: "1.6rem", marginTop: 2 }}>{estimate && estimate.high_cents > 0 ? `${usd(estimate.low_cents)} – ${usd(estimate.high_cents)}` : "Select options"}</p>
          {estimate && estimate.recurring_cents > 0 && <p className={s.help}>+ {usd(estimate.recurring_cents)} / year support</p>}
        </div>
        <p className={s.help} style={{ maxWidth: "34ch", textAlign: "right" }}>Upon submission, our engineering team reviews your configuration, validates feasibility and follows up with recommendations. Prepared for {viewerEmail}.</p>
      </div>
      <FieldInput field={{ key: "notes", label: "Notes or questions for PODOS (optional)", type: "textarea", placeholder: "Anything we should know before review…" }} value={data.review?.notes} disabled={false} onChange={() => undefined} />
    </div>
  );
}
