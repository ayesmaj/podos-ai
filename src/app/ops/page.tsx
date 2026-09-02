import type { Metadata } from "next";
import Link from "next/link";
import {
  UserPlus, Settings2, FileText, Send, DollarSign, PenLine, Building2, ArrowRight, Activity, Users, Inbox,
} from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, listOrganizations, opsDashboard } from "@/lib/estimates/admin";
import OpsShell from "@/components/ops/OpsShell";
import EstimateFigure from "@/components/private/EstimateFigure";
import { compactUsd } from "@/lib/proposals/money";
import s from "@/components/private/private.module.css";

/**
 * /ops — Operations Dashboard (redesign brief §14, founder mockup #5).
 * Premium metric cards, stage pipeline with values, review queue, live client
 * sessions, client engagement, activity feed. Every figure is computed
 * server-side by ops_dashboard v2 — nothing here is invented or estimated in
 * the browser. No "vs last 7 days" deltas until a real prior-period series
 * exists (no fabricated trends).
 */

export const metadata: Metadata = { title: "Operations dashboard · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const STAGES: [string, string, React.ReactNode][] = [
  ["client_invited", "Invited", <UserPlus size={16} strokeWidth={1.75} key="a" />],
  ["client_configuring", "Configuring", <Settings2 size={16} strokeWidth={1.75} key="b" />],
  ["client_submitted", "Submitted", <Inbox size={16} strokeWidth={1.75} key="c" />],
  ["engineering_review", "Eng. review", <FileText size={16} strokeWidth={1.75} key="d" />],
  ["released", "Proposal sent", <Send size={16} strokeWidth={1.75} key="e" />],
  ["signature_requested", "Signature", <PenLine size={16} strokeWidth={1.75} key="f" />],
  ["client_signed", "Closed won", <DollarSign size={16} strokeWidth={1.75} key="g" />],
];
const usd = (c: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(c / 100);
const ago = (d: string) => { const m = Math.max(1, Math.round((Date.now() - new Date(d).getTime()) / 60000)); return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`; };

type Dash = {
  total: number; pipeline_high_cents: number; signed: number; viewed_today: number; active_invitations: number;
  configuring: number; submitted: number; released: number; orgs: number; projects: number;
  by_status: Record<string, { n: number; value_cents: number }>;
  review_queue: { public_id: string; estimate_no: string; client: string; company: string | null; project: string | null; status: string; high_cents: number; updated_at: string }[];
  live_sessions: { public_id: string; estimate_no: string; company: string | null; viewer: string; last_seen: string; steps_saved: number }[];
  recent_activity: { at: string; actor: string; event: string; estimate_no: string | null; public_id: string | null }[];
};

export default async function OpsDashboard() {
  await requireOps();
  const [raw, orgs] = await Promise.all([opsDashboard(ADMIN_SECRET), listOrganizations(ADMIN_SECRET)]);
  const d = (raw ?? {}) as unknown as Dash;
  const by = d.by_status ?? {};
  // legacy statuses fold into the modern stages for the pipeline view
  const stageN = (k: string) => (by[k]?.n ?? 0) + (k === "client_invited" ? (by.sent?.n ?? 0) + (by.viewed?.n ?? 0) + (by.draft?.n ?? 0) : 0) + (k === "client_signed" ? (by.signed?.n ?? 0) : 0);
  const stageV = (k: string) => (by[k]?.value_cents ?? 0) + (k === "client_invited" ? (by.sent?.value_cents ?? 0) + (by.viewed?.value_cents ?? 0) + (by.draft?.value_cents ?? 0) : 0) + (k === "client_signed" ? (by.signed?.value_cents ?? 0) : 0);
  const totalStage = STAGES.reduce((a, [k]) => a + stageN(k), 0) || 1;

  const metrics: { icon: React.ReactNode; label: string; value: React.ReactNode }[] = [
    { icon: <UserPlus size={20} strokeWidth={1.75} />, label: "Active invitations", value: d.active_invitations ?? 0 },
    { icon: <Settings2 size={20} strokeWidth={1.75} />, label: "Configurations in progress", value: d.configuring ?? 0 },
    { icon: <Inbox size={20} strokeWidth={1.75} />, label: "Submitted requests", value: d.submitted ?? 0 },
    { icon: <Send size={20} strokeWidth={1.75} />, label: "Proposals sent", value: d.released ?? 0 },
    { icon: <DollarSign size={20} strokeWidth={1.75} />, label: "Pipeline value", value: <EstimateFigure cents={Number(d.pipeline_high_cents ?? 0)} /> },
    { icon: <PenLine size={20} strokeWidth={1.75} />, label: "Signed", value: d.signed ?? 0 },
  ];

  return (
    <OpsShell
      active="/ops"
      title="Operations Dashboard"
      actions={
        <Link href="/ops/clients" className={`${s.btn} ${s.btnPrimary}`} style={{ minHeight: 42, fontSize: 14 }}>
          <UserPlus size={16} aria-hidden /> New client
        </Link>
      }
    >
      <div className={s.root} style={{ minHeight: 0, background: "transparent" }}>
        <p className={s.body} style={{ marginTop: "-1rem", marginBottom: "1.4rem" }}>Here&apos;s what&apos;s happening across your proposal operations.</p>

        {/* metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.8rem" }}>
          {metrics.map((m) => (
            <div key={m.label} className={s.metric}>
              <span className={s.iconTile}>{m.icon}</span>
              <div><p className={s.label}>{m.label}</p><p className={`${s.metricValue} ${s.num}`}>{m.value}</p></div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(300px, 1fr)", gap: "1rem", marginTop: "1rem", alignItems: "start" }}>
          {/* pipeline */}
          <section className={`${s.panel} ${s.panelPad}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
              <p className={s.title}>Proposal pipeline</p>
              <p className={s.label}>Total pipeline value <strong className={s.num} style={{ color: "var(--ink-strong)", fontSize: "1rem", marginLeft: 6 }}>{usd(Number(d.pipeline_high_cents ?? 0))}</strong></p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${STAGES.length}, minmax(0, 1fr))`, gap: 6, marginTop: "1rem" }}>
              {STAGES.map(([k, label, icon]) => (
                <div key={k} style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--paper)", padding: "0.8rem 0.7rem", minWidth: 0 }}>
                  <span className={s.iconTile} style={{ width: 30, height: 30, borderRadius: 8 }}>{icon}</span>
                  <p className={s.label} style={{ marginTop: 8, fontSize: "0.52rem", letterSpacing: "0.06em", lineHeight: 1.3, minHeight: "2.6em", wordBreak: "keep-all", overflowWrap: "normal" }}>{label}</p>
                  <p className={`${s.metricValue} ${s.num}`} style={{ fontSize: "1.35rem", marginTop: 2 }}>{stageN(k)}</p>
                  <p className={`${s.help} ${s.num}`} style={{ marginTop: 0, whiteSpace: "nowrap" }}>{compactUsd(stageV(k))}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", background: "var(--canvas)", marginTop: "0.9rem" }} aria-hidden>
              {STAGES.map(([k], i) => <span key={k} style={{ width: `${(stageN(k) / totalStage) * 100}%`, background: `hsl(${222 - i * 8} 84% ${52 + i * 3}%)` }} />)}
            </div>
          </section>

          {/* activity */}
          <section className={`${s.panel} ${s.panelPad}`}>
            <p className={s.title} style={{ display: "flex", alignItems: "center", gap: 8 }}><Activity size={16} color="var(--brand)" aria-hidden /> Recent activity</p>
            <div style={{ marginTop: "0.8rem", display: "grid", gap: 2 }}>
              {(d.recent_activity ?? []).length === 0 && <p className={s.help}>No activity yet.</p>}
              {(d.recent_activity ?? []).slice(0, 8).map((a, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, padding: "0.45rem 0", borderTop: i ? "1px solid var(--edge-faint)" : "none", fontSize: 13 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, textTransform: "capitalize", color: "var(--ink-strong)" }}>{a.event.replace(/_/g, " ")}</p>
                    <p className={s.help} style={{ marginTop: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.estimate_no ?? ""}{a.estimate_no ? " · " : ""}{a.actor}</p>
                  </div>
                  <span className={s.help} style={{ marginTop: 0, whiteSpace: "nowrap" }}>{ago(a.at)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)", gap: "1rem", marginTop: "1rem", alignItems: "start" }}>
          {/* client engagement */}
          <section className={`${s.panel} ${s.panelPad}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <p className={s.title} style={{ display: "flex", alignItems: "center", gap: 8 }}><Users size={16} color="var(--brand)" aria-hidden /> Client engagement</p>
              <Link href="/ops/clients" className={s.label} style={{ color: "var(--brand)", textDecoration: "none" }}>View all</Link>
            </div>
            <div style={{ marginTop: "0.8rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 120px", gap: 8, padding: "0.35rem 0", borderBottom: "1px solid var(--edge)" }} className={s.label}><span>Client</span><span style={{ textAlign: "right" }}>Proposals</span><span style={{ textAlign: "right" }}>Pipeline value</span></div>
              {(orgs ?? []).slice(0, 6).map((o) => (
                <Link key={o.id} href={`/ops/clients/${o.id}`} style={{ display: "grid", gridTemplateColumns: "1fr 80px 120px", gap: 8, padding: "0.6rem 0", borderTop: "1px solid var(--edge-faint)", textDecoration: "none", fontSize: 13.5, alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--ink-strong)", fontWeight: 600 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 999, background: "var(--brand)", color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800 }}>{o.name.slice(0, 2).toUpperCase()}</span>{o.name}
                  </span>
                  <span className={s.num} style={{ textAlign: "right", color: "var(--ink-dim)" }}>{o.proposals}</span>
                  <span className={s.num} style={{ textAlign: "right", color: "var(--ink-strong)", fontWeight: 600 }}>{usd(o.open_value_cents)}</span>
                </Link>
              ))}
              {(orgs ?? []).length === 0 && <p className={s.help}>No clients yet.</p>}
            </div>
          </section>

          {/* review queue + live sessions */}
          <section className={`${s.panel} ${s.panelPad}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <p className={s.title} style={{ display: "flex", alignItems: "center", gap: 8 }}><Inbox size={16} color="var(--brand)" aria-hidden /> Proposal review queue</p>
              <Link href="/ops/proposals" className={s.label} style={{ color: "var(--brand)", textDecoration: "none" }}>View all</Link>
            </div>
            <div style={{ marginTop: "0.8rem", display: "grid", gap: 8 }}>
              {(d.review_queue ?? []).length === 0 && <p className={s.help}>Nothing waiting for review.</p>}
              {(d.review_queue ?? []).map((q) => (
                <Link key={q.public_id} href={`/ops/proposals/${q.public_id}`} style={{ display: "grid", gridTemplateColumns: "44px 1fr auto auto", gap: 12, alignItems: "center", padding: "0.7rem 0.8rem", borderRadius: 12, border: "1px solid var(--edge)", background: "var(--paper)", textDecoration: "none" }}>
                  <span className={s.iconTile}><Building2 size={18} strokeWidth={1.75} /></span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontWeight: 700, fontSize: 14, color: "var(--ink-strong)" }}>{q.company ?? q.client}{q.project ? ` — ${q.project}` : ""}</span>
                    <span className={s.help} style={{ marginTop: 0 }}>{q.estimate_no} · {ago(q.updated_at)}</span>
                  </span>
                  <span className={`${s.chip} ${q.status === "client_submitted" ? s.chipCyan : s.chipBrand}`}>{q.status.replace(/_/g, " ")}</span>
                  <ArrowRight size={16} color="var(--brand)" aria-hidden />
                </Link>
              ))}
            </div>

            <p className={s.title} style={{ marginTop: "1.4rem", display: "flex", alignItems: "center", gap: 8 }}><Settings2 size={16} color="var(--brand)" aria-hidden /> Live client sessions</p>
            <div style={{ marginTop: "0.6rem" }}>
              {(d.live_sessions ?? []).length === 0 && <p className={s.help}>No active client sessions.</p>}
              {(d.live_sessions ?? []).map((l, i) => (
                <Link key={i} href={`/ops/proposals/${l.public_id}`} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, padding: "0.5rem 0", borderTop: i ? "1px solid var(--edge-faint)" : "none", textDecoration: "none", fontSize: 13 }}>
                  <span style={{ color: "var(--ink-strong)" }}>{l.company ?? l.estimate_no} <span className={s.help} style={{ marginTop: 0, display: "inline" }}>· {l.viewer}</span></span>
                  <span className={`${s.chip} ${s.chipOk}`}>{l.steps_saved} steps saved</span>
                  <span className={s.help} style={{ marginTop: 0 }}>{ago(l.last_seen)}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </OpsShell>
  );
}
