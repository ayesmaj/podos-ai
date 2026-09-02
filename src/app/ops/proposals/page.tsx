import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  AlertTriangle, CheckCircle2, Clock, DollarSign, Eye, FilePlus2, FileText, Inbox, KeyRound, Link2, PenLine, Send, Settings2, ShieldCheck, Trash2, UserPlus, Wrench,
} from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { nowMs } from "@/lib/ops/clock";
import {
  ADMIN_SECRET, listContacts, listEstimates, listInvitations, listOrganizations, listProjects, opsDashboard,
  type EstimateRow, type InvitationRow,
} from "@/lib/estimates/admin";
import { SITE } from "@/lib/seo/site";
import { AppShell, Avatar, Cell, Chip, EmptyState, KpiCard, KpiGrid, Notice, PageHeader, Panel, PanelLink, Pipeline, StatusChip, Toolbar, ago, compact, fmtDate, ops as s, usd } from "@/components/ops/ui";
import { CLOSED_STATUSES, PIPELINE_STAGES, statusMeta } from "@/components/ops/ui/status";
import AdminResult from "@/components/ops/AdminResult";
import ConfirmDelete from "@/components/ops/ConfirmDelete";
import NewProposalWizard from "./NewProposalWizard";
import { dismissInviteReveal, inviteContactAction, revokeInvitationAction } from "./actions";
import { deleteProposalAction } from "./[publicId]/actions";

/**
 * /ops/proposals — monitoring, filtering and managing proposals (brief §14–16).
 * Header · six KPIs · connected pipeline (click = filter) · toolbar · 8/4 split:
 * entity rows with a collapsible Secure Access panel, right rail with attention
 * items, recent activity and engagement. Creation lives in the wizard drawer.
 * Every figure is real data from the database.
 */

export const metadata: Metadata = { title: "Proposals · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const STAGE_ICON: Record<string, React.ReactNode> = {
  draft: <FilePlus2 size={18} strokeWidth={1.8} />, invited: <UserPlus size={18} strokeWidth={1.8} />, configuring: <Settings2 size={18} strokeWidth={1.8} />,
  submitted: <Inbox size={18} strokeWidth={1.8} />, review: <Wrench size={18} strokeWidth={1.8} />, sent: <Send size={18} strokeWidth={1.8} />,
  signature: <PenLine size={18} strokeWidth={1.8} />, signed: <CheckCircle2 size={18} strokeWidth={1.8} />,
};
const RELEASED_STATES = new Set(["released", "signature_requested", "client_signed", "signed", "countersigned", "completed", "won", "lost", "declined", "expired"]);
const stageOf = (r: EstimateRow) => (r.revoked || CLOSED_STATUSES.has(r.status)) ? null : PIPELINE_STAGES.find((st) => st.statuses.includes(r.signed_at ? "client_signed" : r.status))?.key ?? "draft";
const isActive = (r: EstimateRow) => !r.revoked && !CLOSED_STATUSES.has(r.status) && !["client_signed", "signed", "countersigned", "completed", "won"].includes(r.status) && !r.signed_at;
const days = (d: string | null) => (d ? (new Date(d).getTime() - Date.now()) / 86_400_000 : null);

async function NewInviteReveal() {
  const raw = (await cookies()).get("podos_new_invite")?.value;
  if (!raw) return null;
  const [estimateNo, token, status, detail] = raw.split("|");
  const sent = status === "sent";
  return (
    <Notice tone={sent ? "ok" : "warn"}>
      <KeyRound size={16} aria-hidden />
      <div style={{ flex: 1, minWidth: 0 }}>
        <b>Secure link issued for {estimateNo}</b> · {sent ? `emailed to ${detail}` : `email not sent (${detail}) — send it yourself`}
        <input readOnly value={`${SITE.baseUrl}/e/${token}`} onFocus={undefined} className={s.input} style={{ marginTop: 8, height: 36, fontSize: 12.5 }} aria-label="Secure link (shown once)" />
      </div>
      <form action={dismissInviteReveal}><button type="submit" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Done</button></form>
    </Notice>
  );
}

export default async function ProposalsPage({ searchParams }: { searchParams: Promise<{ q?: string; stage?: string; show?: string }> }) {
  await requireOps();
  const sp = await searchParams;
  const [rows, orgs, projects, contacts, dashRaw] = await Promise.all([
    listEstimates(ADMIN_SECRET), listOrganizations(ADMIN_SECRET), listProjects(ADMIN_SECRET), listContacts(ADMIN_SECRET), opsDashboard(ADMIN_SECRET),
  ]);
  const all = rows ?? [];
  const dash = (dashRaw ?? {}) as { viewed_today?: number; active_invitations?: number; live_sessions?: unknown[]; recent_activity?: { at: string; actor: string; event: string; estimate_no: string | null; public_id: string | null; company: string | null; metadata?: { note?: string } | null }[] };
  const invitations = new Map<string, InvitationRow[]>();
  await Promise.all(all.map(async (r) => invitations.set(r.estimate_no, (await listInvitations(ADMIN_SECRET, r.estimate_no)) ?? [])));
  const orgName = new Map((orgs ?? []).map((o) => [o.id, o.name]));
  const contactOpts = (contacts ?? []).map((c) => ({ id: c.id, organization_id: c.organization_id, label: `${[c.first_name, c.last_name].filter(Boolean).join(" ") || "Contact"}${c.email ? ` · ${c.email}` : ""}`, hasEmail: !!c.email }));

  /* KPIs + pipeline (all real) */
  const active = all.filter(isActive);
  const openPipeline = active.reduce((a, r) => a + r.one_time_high_cents, 0);
  const byStage = (key: string) => all.filter((r) => stageOf(r) === key);
  const stages = PIPELINE_STAGES.map((st) => { const list = byStage(st.key); return { key: st.key, label: st.label, icon: STAGE_ICON[st.key], count: list.length, valueCents: list.reduce((a, r) => a + r.one_time_high_cents, 0) }; });
  const signedCount = byStage("signed").length;

  /* filtering */
  const q = (sp.q ?? "").trim().toLowerCase();
  const show = sp.show ?? "all";
  const stage = sp.stage && PIPELINE_STAGES.some((x) => x.key === sp.stage) ? sp.stage : null;
  const visible = all.filter((r) => {
    if (stage && stageOf(r) !== stage) return false;
    if (show === "active" && !isActive(r)) return false;
    if (show === "signed" && stageOf(r) !== "signed") return false;
    if (show === "closed" && !(r.revoked || CLOSED_STATUSES.has(r.status))) return false;
    if (q) { const hay = `${orgName.get(r.organization_id) ?? ""} ${r.company ?? ""} ${r.client_name} ${r.project_name ?? ""} ${r.estimate_no} ${r.public_id}`.toLowerCase(); if (!hay.includes(q)) return false; }
    return true;
  });
  const href = (patch: Record<string, string | null>) => { const p = new URLSearchParams(); const merged = { q: sp.q ?? "", show, stage: stage ?? "", ...patch }; for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v); const qs = p.toString(); return `/ops/proposals${qs ? `?${qs}` : ""}`; };

  /* attention rail */
  const attention = all.filter((r) => !r.revoked).flatMap((r) => {
    const items: { r: EstimateRow; why: string; tone: "amber" | "red" | "violet" | "cobalt" }[] = [];
    if (["client_submitted", "engineering_review", "commercial_review"].includes(r.status)) items.push({ r, why: "Awaiting your review", tone: "amber" });
    if (r.status === "signature_requested" && !r.signed_at) items.push({ r, why: `Signature pending${r.last_viewed_at ? ` · last viewed ${ago(r.last_viewed_at)}` : ""}`, tone: "violet" });
    const d = days(r.expires_at); if (isActive(r) && d != null && d < 7) items.push({ r, why: d < 0 ? "Validity expired" : `Expires in ${Math.max(1, Math.ceil(d))} day${Math.ceil(d) === 1 ? "" : "s"}`, tone: d < 0 ? "red" : "amber" });
    if (["released", "sent", "client_invited"].includes(r.status) && !r.first_viewed_at && (nowMs() - new Date(r.created_at).getTime()) / 86_400_000 > 3) items.push({ r, why: "Sent 3+ days ago, not opened", tone: "cobalt" });
    return items;
  }).slice(0, 8);

  const wizard = (
    <NewProposalWizard
      orgs={(orgs ?? []).filter((o) => !(o as { archived_at?: string | null }).archived_at).map((o) => ({ id: o.id, name: o.name }))}
      projects={(projects ?? []).map((p) => ({ id: p.id, name: p.name, org_id: p.org_id }))}
      contacts={contactOpts}
    />
  );

  return (
    <AppShell active="/ops/proposals">
      <PageHeader
        title="Proposals"
        subtitle="Manage private client configurations, formal proposals, secure access, engagement, versions and signatures."
        count={`${all.length} proposal${all.length === 1 ? "" : "s"} · ${active.length} active`}
        actions={<><Link href="/ops/clients" className={`${s.btn} ${s.btnSecondary}`}>Clients</Link>{wizard}</>}
      />
      <AdminResult />
      <NewInviteReveal />

      <KpiGrid>
        <KpiCard icon={<FileText size={20} strokeWidth={1.8} />} label="Active proposals" value={active.length} context={`${all.length} total · ${all.filter((r) => r.revoked).length} withdrawn`} href={href({ show: "active", stage: null })} />
        <KpiCard icon={<DollarSign size={20} strokeWidth={1.8} />} label="Open pipeline" value={compact(openPipeline)} context={openPipeline ? usd(openPipeline) : "no open value yet"} tone="green" />
        <KpiCard icon={<Settings2 size={20} strokeWidth={1.8} />} label="Configuring" value={byStage("configuring").length + byStage("invited").length} context={`${dash.active_invitations ?? 0} active links · invited or building`} tone="cyan" href={href({ stage: "configuring", show: "all" })} />
        <KpiCard icon={<Inbox size={20} strokeWidth={1.8} />} label="In review" value={byStage("submitted").length + byStage("review").length} context="submitted · engineering or commercial review" tone="amber" href={href({ stage: "submitted", show: "all" })} />
        <KpiCard icon={<Send size={20} strokeWidth={1.8} />} label="Proposals sent" value={byStage("sent").length + byStage("signature").length} context={`${dash.viewed_today ?? 0} viewed in the last 24 h`} tone="electric" href={href({ stage: "sent", show: "all" })} />
        <KpiCard icon={<PenLine size={20} strokeWidth={1.8} />} label="Signed" value={signedCount} context={signedCount ? usd(byStage("signed").reduce((a, r) => a + r.one_time_high_cents, 0)) : "no signatures yet"} tone="purple" href={href({ stage: "signed", show: "all" })} />
      </KpiGrid>

      <Panel title="Proposal pipeline" icon={<Send size={18} aria-hidden />} summary="Click a stage to filter the list below." tight action={stage ? <Link href={href({ stage: null })} className={s.panelAction}>Clear stage filter</Link> : undefined}>
        <Pipeline stages={stages} active={stage} hrefFor={(k) => href({ stage: k === stage ? null : k })} totalCents={openPipeline} />
      </Panel>

      <div className={s.split84}>
        <div className={s.stack}>
          <Toolbar
            action="/ops/proposals" searchValue={sp.q} placeholder="Search client, project or proposal number"
            filters={[["all", "All"], ["active", "Active"], ["signed", "Signed"], ["closed", "Closed / withdrawn"]].map(([k, l]) => ({ label: l, href: href({ show: k }), active: show === k }))}
            count={`${visible.length} of ${all.length}`}
          />

          {all.length === 0 ? (
            <EmptyState icon={<FileText size={22} strokeWidth={1.8} />} title="No proposals yet" text="Create a client with a project in Clients, then start the first proposal from the button above. Everything here is real data — nothing is pre-filled." action={<Link href="/ops/clients" className={`${s.btn} ${s.btnSecondary}`}>Go to Clients</Link>} />
          ) : visible.length === 0 ? (
            <EmptyState title="Nothing matches this filter" text="Try another stage or clear the search." action={<Link href="/ops/proposals" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Clear filters</Link>} />
          ) : (
            <div className={s.rows}>
              {visible.map((r) => {
                const company = orgName.get(r.organization_id) ?? r.company ?? r.client_name;
                const inv = invitations.get(r.estimate_no) ?? [];
                const live = inv.filter((i) => !i.revoked);
                const verified = live.filter((i) => i.exchanged_at).length;
                const meta = statusMeta(r.status, { revoked: r.revoked, signedAt: r.signed_at });
                const orgContacts = contactOpts.filter((c) => c.organization_id === r.organization_id && c.hasEmail);
                const exp = days(r.expires_at);
                const featured = ["client_submitted", "engineering_review", "commercial_review", "signature_requested"].includes(r.status) && !r.revoked;
                return (
                  <article key={r.public_id} className={`${s.row}${featured ? ` ${s.rowFeatured}` : ""}`}>
                    <div className={s.rowIdentity}>
                      <Avatar name={company} />
                      <div style={{ minWidth: 0 }}>
                        <Link href={`/ops/proposals/${r.public_id}`} className={s.rowTitle}>{company}{r.project_name ? ` — ${r.project_name}` : ""}</Link>
                        <p className={s.rowMeta}><b className={s.num}>{r.public_id}</b> · {r.estimate_no} · {r.client_name}</p>
                        <p className={s.rowMetaMuted}>{r.mode === "admin_built" ? "PODOS builds the line items" : "Client builds via the menu"} · created {fmtDate(r.created_at)}</p>
                      </div>
                    </div>
                    <Cell label="Status">
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><StatusChip status={r.status} revoked={r.revoked} signedAt={r.signed_at} />{meta.stage >= 5 && !r.signed_at && !r.revoked && <Chip tone="gray">v released</Chip>}</div>
                      <span className={s.rowSmall}>{r.signed_at ? `Signed by ${r.signer_name ?? "client"} · ${fmtDate(r.signed_at)}` : exp != null ? (exp < 0 ? `Validity expired ${fmtDate(r.expires_at)}` : `Valid until ${fmtDate(r.expires_at)}`) : "No validity date"}</span>
                    </Cell>
                    <Cell label="Commercial">
                      <span className={s.rowValue}>{r.one_time_high_cents > 0 ? (r.one_time_low_cents === r.one_time_high_cents ? usd(r.one_time_high_cents) : `${compact(r.one_time_low_cents)} – ${compact(r.one_time_high_cents)}`) : "—"}</span>
                      <span className={s.rowSmall}>{r.recurring_cents > 0 ? `${usd(r.recurring_cents)} / yr recurring` : "no recurring services"}</span>
                    </Cell>
                    <Cell label="Engagement" className={s.rowCellEngagement}>
                      <span className={s.rowSmall}><b style={{ color: "var(--ops-ink)" }}>{live.length}</b> authorized · <b style={{ color: "var(--ops-ink)" }}>{verified}</b> verified</span>
                      <span className={s.rowSmall}>{r.view_count > 0 ? `Viewed ${r.view_count}× · last ${ago(r.last_viewed_at)}` : "Not opened yet"}</span>
                    </Cell>
                    <div className={s.rowActions}>
                      <Link href={`/ops/proposals/${r.public_id}`} className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Open</Link>
                      <ConfirmDelete compact action={deleteProposalAction} hidden={{ publicId: r.public_id }} label="Delete"
                        text={`Permanently deletes ${r.estimate_no} (${r.public_id}) with its line items, links and activity.`}
                        guard={r.signed_at || RELEASED_STATES.has(r.status) ? { reason: r.signed_at ? "This proposal was signed by the client." : "This proposal was released to the client.", expectName: r.public_id, what: "the proposal number" } : null} />
                    </div>

                    {/* secure access — summary line, details on demand, never raw tokens */}
                    <details className={s.expander}>
                      <summary><ShieldCheck size={15} aria-hidden /> Secure access · {live.length} authorized viewer{live.length === 1 ? "" : "s"} · {live.reduce((a, i) => a + (i.sessions ?? 0), 0)} session{live.reduce((a, i) => a + (i.sessions ?? 0), 0) === 1 ? "" : "s"}{inv.length - live.length > 0 ? ` · ${inv.length - live.length} revoked` : ""}</summary>
                      <div className={s.expanderBody}>
                        {live.length === 0 && <p className={s.muted} style={{ fontSize: 13 }}>No one has access yet. Issue a personal link below.</p>}
                        {live.map((i) => (
                          <div key={i.invitation_id} className={s.accessRow}>
                            <div style={{ minWidth: 0 }}><b style={{ display: "block", fontWeight: 600 }}>{i.recipient_name ?? "Contact"}</b><span className={s.muted} style={{ fontSize: 12.5 }}>{i.recipient_email}</span></div>
                            <Chip tone="cobalt">{i.access_policy === "otp" ? "One-time code" : "Email confirm"}</Chip>
                            <span className={s.rowSmall}>{i.exchanged_at ? `Verified · last seen ${ago(i.last_seen)}` : `Not opened · expires ${fmtDate(i.expires_at)}`}</span>
                            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                              {i.link_token && r.mode === "client_configured" && <a href={`${SITE.baseUrl}/e/${i.link_token}?to=configure`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`}><Link2 size={13} aria-hidden /> Build link</a>}
                              {i.link_token && <a href={`${SITE.baseUrl}/e/${i.link_token}?to=proposal`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`}><Eye size={13} aria-hidden /> Proposal link</a>}
                              <form action={revokeInvitationAction}><input type="hidden" name="invitationId" value={i.invitation_id} /><input type="hidden" name="publicId" value={r.public_id} /><button type="submit" className={`${s.btn} ${s.btnDanger} ${s.btnXs}`}><Trash2 size={12} aria-hidden /> Revoke</button></form>
                            </div>
                          </div>
                        ))}
                        {orgContacts.length === 0 ? (
                          <p className={s.muted} style={{ fontSize: 13 }}>Add a contact with an email to <Link href={`/ops/clients/${r.organization_id}`} style={{ color: "var(--ops-cobalt)", fontWeight: 600 }}>{company}</Link> to grant access.</p>
                        ) : (
                          <form action={inviteContactAction} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                            <input type="hidden" name="estimateNo" value={r.estimate_no} /><input type="hidden" name="publicId" value={r.public_id} /><input type="hidden" name="mode" value={r.mode} />
                            <input type="hidden" name="company" value={company} /><input type="hidden" name="project" value={r.project_name ?? ""} />
                            <select name="contactId" required defaultValue="" className={s.select} style={{ minWidth: 240 }}><option value="" disabled>Add a viewer…</option>{orgContacts.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
                            <select name="policy" defaultValue="email-confirm" className={s.select}><option value="email-confirm">Email confirmation</option><option value="otp">One-time code</option></select>
                            <button type="submit" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}><UserPlus size={14} aria-hidden /> Grant access</button>
                          </form>
                        )}
                      </div>
                    </details>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className={s.rail}>
          <Panel title="Attention required" icon={<AlertTriangle size={18} aria-hidden />} tight>
            {attention.length === 0 ? <p className={s.muted} style={{ fontSize: 13.5 }}>Nothing is waiting on you.</p> : attention.map((a, i) => (
              <Link key={`${a.r.public_id}-${i}`} href={`/ops/proposals/${a.r.public_id}`} className={s.listRow} style={{ textDecoration: "none" }}>
                <span style={{ minWidth: 0 }}><span style={{ display: "block", fontWeight: 600, fontSize: 13.5 }}>{orgName.get(a.r.organization_id) ?? a.r.company}{a.r.project_name ? ` — ${a.r.project_name}` : ""}</span><span className={s.muted} style={{ fontSize: 12.5 }}>{a.why}</span></span>
                <Chip tone={a.tone}>{statusMeta(a.r.status).label}</Chip>
              </Link>
            ))}
          </Panel>
          <Panel title="Recent activity" icon={<Clock size={18} aria-hidden />} tight action={<PanelLink href="/ops">Dashboard</PanelLink>}>
            {(dash.recent_activity ?? []).length === 0 ? <p className={s.muted} style={{ fontSize: 13.5 }}>No activity yet.</p> : (dash.recent_activity ?? []).slice(0, 8).map((a, i) => (
              <div key={i} className={s.listRow}>
                <span style={{ minWidth: 0 }}><span className={s.timelineText}>{a.event.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}{a.company ? ` · ${a.company}` : ""}</span><span className={s.timelineMeta} style={{ display: "block" }}>{a.public_id ?? ""}{a.actor ? ` · ${a.actor}` : ""}{a.metadata?.note ? ` — “${a.metadata.note.slice(0, 80)}”` : ""}</span></span>
                <span className={s.timelineTime}>{ago(a.at)}</span>
              </div>
            ))}
          </Panel>
          <Panel title="Engagement" icon={<Eye size={18} aria-hidden />} tight>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[["Viewed today", dash.viewed_today ?? 0], ["Active links", dash.active_invitations ?? 0], ["Live sessions", (dash.live_sessions ?? []).length]].map(([l, v]) => (
                <div key={String(l)} style={{ padding: "12px 14px", borderRadius: 12, background: "var(--ops-bg-elevated)", border: "1px solid var(--ops-border)" }}>
                  <p className={s.rowCellLabel}>{l}</p><p className={s.num} style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{v}</p>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}
