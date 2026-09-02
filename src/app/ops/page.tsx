import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, Building2, CheckCircle2, DollarSign, FilePlus2, Inbox, PenLine, Send, Settings2, ShieldAlert, UserPlus, Users, Wrench } from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, listEstimates, listOrganizations, opsDashboard } from "@/lib/estimates/admin";
import { AppShell, Avatar, Chip, KpiCard, KpiGrid, PageHeader, Panel, PanelLink, Pipeline, StatusChip, ago, compact, ops as s, usd } from "@/components/ops/ui";
import { PIPELINE_STAGES, isOpenProposal, stageKeyFor } from "@/components/ops/ui/status";

/**
 * /ops — Operations Dashboard: the benchmark composition. Six KPIs, the
 * connected pipeline, review queue + client engagement (8) and recent activity,
 * live sessions and a 24-hour security summary (4). Every figure is computed
 * from real rows; no invented trends.
 */

export const metadata: Metadata = { title: "Operations dashboard · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const STAGE_ICON: Record<string, React.ReactNode> = {
  draft: <FilePlus2 size={18} strokeWidth={1.8} />, invited: <UserPlus size={18} strokeWidth={1.8} />, configuring: <Settings2 size={18} strokeWidth={1.8} />,
  submitted: <Inbox size={18} strokeWidth={1.8} />, review: <Wrench size={18} strokeWidth={1.8} />, sent: <Send size={18} strokeWidth={1.8} />,
  signature: <PenLine size={18} strokeWidth={1.8} />, signed: <CheckCircle2 size={18} strokeWidth={1.8} />,
};
const humanize = (e: string) => e.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

type Dash = {
  viewed_today: number; active_invitations: number;
  review_queue: { public_id: string; estimate_no: string; client: string; company: string | null; project: string | null; status: string; high_cents: number; updated_at: string }[];
  live_sessions: { public_id: string; estimate_no: string; company: string | null; viewer: string; last_seen: string; steps_saved: number }[];
  recent_activity: { at: string; actor: string; event: string; estimate_no: string | null; public_id: string | null; company: string | null; metadata?: { note?: string } | null }[];
  security_24h?: { invalid_links: number; failed_codes: number; admin_logins: number };
};
interface OrgRow { id: string; name: string; archived_at: string | null; proposals: number; active_proposals: number; open_value_cents: number; primary_contact?: { name: string | null; email: string | null } | null }

export default async function OpsDashboard() {
  await requireOps();
  const [raw, orgsRaw, rows] = await Promise.all([opsDashboard(ADMIN_SECRET), listOrganizations(ADMIN_SECRET), listEstimates(ADMIN_SECRET)]);
  const d = (raw ?? {}) as unknown as Dash;
  const orgs = ((orgsRaw ?? []) as unknown as OrgRow[]).filter((o) => !o.archived_at);
  const all = rows ?? [];
  const open = all.filter(isOpenProposal);
  const pipeline = open.reduce((a, r) => a + r.one_time_high_cents, 0);
  const byStage = (k: string) => all.filter((r) => stageKeyFor(r) === k);
  const stages = PIPELINE_STAGES.map((st) => { const list = byStage(st.key); return { key: st.key, label: st.label, icon: STAGE_ICON[st.key], count: list.length, valueCents: list.reduce((a, r) => a + r.one_time_high_cents, 0) }; });
  const sec = d.security_24h ?? { invalid_links: 0, failed_codes: 0, admin_logins: 0 };
  const orgName = new Map(orgs.map((o) => [o.id, o.name]));

  return (
    <AppShell active="/ops">
      <PageHeader title="Operations Dashboard" subtitle="What is happening across clients, configurations, proposals and signatures right now." count={`${orgs.length} active client${orgs.length === 1 ? "" : "s"} · ${open.length} open proposal${open.length === 1 ? "" : "s"}`}
        actions={<><Link href="/ops/clients" className={`${s.btn} ${s.btnSecondary}`}><Building2 size={16} aria-hidden /> Clients</Link><Link href="/ops/proposals" className={`${s.btn} ${s.btnPrimary}`}><FilePlus2 size={16} aria-hidden /> Proposals</Link></>} />

      <KpiGrid>
        <KpiCard icon={<UserPlus size={20} strokeWidth={1.8} />} label="Active invitations" value={d.active_invitations ?? 0} context="personal secure links that can still be opened" href="/ops/proposals" />
        <KpiCard icon={<Settings2 size={20} strokeWidth={1.8} />} label="Configurations in progress" value={byStage("configuring").length + byStage("invited").length} context="clients building or invited to build" tone="cyan" href="/ops/proposals?stage=configuring" />
        <KpiCard icon={<Inbox size={20} strokeWidth={1.8} />} label="Submitted for review" value={byStage("submitted").length + byStage("review").length} context="waiting on engineering or commercial review" tone="amber" href="/ops/proposals?stage=submitted" />
        <KpiCard icon={<Send size={20} strokeWidth={1.8} />} label="Proposals sent" value={byStage("sent").length + byStage("signature").length} context={`${d.viewed_today ?? 0} viewed in the last 24 h`} tone="electric" href="/ops/proposals?stage=sent" />
        <KpiCard icon={<DollarSign size={20} strokeWidth={1.8} />} label="Open pipeline" value={compact(pipeline)} context={pipeline ? usd(pipeline) : "no priced proposals yet"} tone="green" />
        <KpiCard icon={<PenLine size={20} strokeWidth={1.8} />} label="Signed" value={byStage("signed").length} context={byStage("signed").length ? usd(byStage("signed").reduce((a, r) => a + r.one_time_high_cents, 0)) : "no signatures yet"} tone="purple" href="/ops/proposals?stage=signed" />
      </KpiGrid>

      <Panel title="Proposal pipeline" icon={<Send size={18} aria-hidden />} summary="Every proposal by stage, with the value at that stage. Click a stage to open the filtered list." tight action={<PanelLink href="/ops/proposals">All proposals</PanelLink>}>
        <Pipeline stages={stages} hrefFor={(k) => `/ops/proposals?stage=${k}`} totalCents={pipeline} />
      </Panel>

      <div className={s.split84}>
        <div className={s.stack}>
          <Panel title="Proposal review queue" icon={<Inbox size={18} aria-hidden />} summary="Submitted configurations and reviews waiting on PODOS." action={<PanelLink href="/ops/proposals?stage=submitted">Open queue</PanelLink>}>
            {(d.review_queue ?? []).length === 0 ? (
              <div className={s.empty} style={{ padding: 28 }}><span className={s.emptyIcon}><CheckCircle2 size={20} /></span><p className={s.emptyTitle}>Nothing waiting for review</p><p className={s.emptyText}>Submitted configurations appear here the moment a client sends one.</p></div>
            ) : (
              <div className={s.stack}>
                {(d.review_queue ?? []).map((q) => (
                  <Link key={q.public_id} href={`/ops/proposals/${q.public_id}`} className={s.row} style={{ minHeight: 0, padding: "14px 18px", gridTemplateColumns: "auto minmax(0,1fr) auto auto", textDecoration: "none" }}>
                    <Avatar name={q.company ?? q.client} />
                    <span style={{ minWidth: 0 }}><span className={s.rowTitle}>{q.company ?? q.client}{q.project ? ` — ${q.project}` : ""}</span><span className={s.rowMetaMuted}>{q.public_id} · updated {ago(q.updated_at)}</span></span>
                    <span style={{ display: "grid", gap: 4, justifyItems: "end" }}><StatusChip status={q.status} /><span className={s.num} style={{ fontSize: 13, color: "var(--ops-ink-secondary)" }}>{q.high_cents ? compact(q.high_cents) : "—"}</span></span>
                    <ArrowRight size={16} color="var(--ops-cobalt)" aria-hidden />
                  </Link>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Client engagement" icon={<Users size={18} aria-hidden />} summary="Active accounts by open value." action={<PanelLink href="/ops/clients">All clients</PanelLink>}>
            {orgs.length === 0 ? (
              <div className={s.empty} style={{ padding: 28 }}><span className={s.emptyIcon}><Building2 size={20} /></span><p className={s.emptyTitle}>No clients yet</p><p className={s.emptyText}>Create the first client to start a proposal.</p><Link href="/ops/clients" className={`${s.btn} ${s.btnPrimary} ${s.btnSm}`}>Go to Clients</Link></div>
            ) : (
              <div>
                <div className={s.listRow} style={{ paddingTop: 0 }}><span className={s.label}>Client</span><span className={s.label} style={{ display: "grid", gridTemplateColumns: "90px 120px", textAlign: "right" }}><span>Proposals</span><span>Open value</span></span></div>
                {[...orgs].sort((a, b) => b.open_value_cents - a.open_value_cents).slice(0, 6).map((o) => (
                  <Link key={o.id} href={`/ops/clients/${o.id}`} className={s.listRow} style={{ textDecoration: "none" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}><Avatar name={o.name} /><span style={{ minWidth: 0 }}><span style={{ display: "block", fontWeight: 600, fontSize: 14 }}>{o.name}</span><span className={s.muted} style={{ fontSize: 12.5 }}>{o.primary_contact?.name ?? "No primary contact"}</span></span></span>
                    <span style={{ display: "grid", gridTemplateColumns: "90px 120px", textAlign: "right" }}><span className={s.num}>{o.active_proposals}<span className={s.muted}> / {o.proposals}</span></span><span className={s.num} style={{ fontWeight: 700 }}>{o.open_value_cents ? compact(o.open_value_cents) : "—"}</span></span>
                  </Link>
                ))}
              </div>
            )}
          </Panel>
        </div>

        <aside className={s.rail}>
          <Panel title="Recent activity" icon={<Activity size={18} aria-hidden />} tight>
            {(d.recent_activity ?? []).length === 0 ? <p className={s.muted} style={{ fontSize: 13.5 }}>No activity yet — events appear as clients open links, configure, comment and sign.</p> : (d.recent_activity ?? []).slice(0, 10).map((a, i) => (
              <div key={i} className={s.listRow}>
                <span style={{ minWidth: 0 }}><span className={s.timelineText}>{humanize(a.event)}{a.company ? ` · ${a.company}` : ""}</span><span className={s.timelineMeta} style={{ display: "block" }}>{a.public_id ?? ""}{a.actor ? ` · ${a.actor}` : ""}{a.metadata?.note ? ` — “${a.metadata.note.slice(0, 80)}”` : ""}</span></span>
                <span className={s.timelineTime}>{ago(a.at)}</span>
              </div>
            ))}
          </Panel>
          <Panel title="Live client sessions" icon={<Settings2 size={18} aria-hidden />} tight>
            {(d.live_sessions ?? []).length === 0 ? <p className={s.muted} style={{ fontSize: 13.5 }}>No client is signed in right now.</p> : (d.live_sessions ?? []).map((l, i) => (
              <Link key={i} href={`/ops/proposals/${l.public_id}`} className={s.listRow} style={{ textDecoration: "none" }}>
                <span style={{ minWidth: 0 }}><span style={{ display: "block", fontWeight: 600, fontSize: 13.5 }}>{l.company ?? orgName.get(l.public_id) ?? l.estimate_no}</span><span className={s.muted} style={{ fontSize: 12.5 }}>{l.viewer} · {l.steps_saved} steps saved</span></span>
                <Chip tone="green">{ago(l.last_seen)}</Chip>
              </Link>
            ))}
          </Panel>
          <Panel title="Security · last 24 h" icon={<ShieldAlert size={18} aria-hidden />} tight>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[["Admin sign-ins", sec.admin_logins, "cobalt"], ["Invalid links", sec.invalid_links, sec.invalid_links ? "amber" : "cobalt"], ["Failed codes", sec.failed_codes, sec.failed_codes ? "red" : "cobalt"]].map(([l, v, tone]) => (
                <div key={String(l)} style={{ padding: "12px 12px", borderRadius: 12, background: "var(--ops-bg-elevated)", border: "1px solid var(--ops-border)" }}>
                  <p className={s.rowCellLabel}>{l}</p><p className={s.num} style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: tone === "red" ? "var(--ops-danger)" : tone === "amber" ? "#9a6300" : "var(--ops-ink)" }}>{v}</p>
                </div>
              ))}
            </div>
            <p className={s.muted} style={{ fontSize: 12.5, marginTop: 10 }}>Invalid links are anonymous attempts to open a secure link with a bad or expired token; they are logged, not tied to a client.</p>
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}
