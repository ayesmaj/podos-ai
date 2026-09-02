import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Archive, ArchiveRestore, Building2, Clock, DollarSign, FolderKanban, Mail, TrendingUp, Users } from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, listOrganizations, opsDashboard } from "@/lib/estimates/admin";
import { AppShell, Avatar, Cell, Chip, EmptyState, KpiCard, KpiGrid, PageHeader, Panel, PanelLink, StatusChip, Toolbar, ago, compact, fmtDate, ops as s, usd } from "@/components/ops/ui";
import AdminResult from "@/components/ops/AdminResult";
import ConfirmDelete from "@/components/ops/ConfirmDelete";
import NewClientDrawer from "./NewClientDrawer";
import { archiveOrgAction, deleteOrgAction } from "./[orgId]/actions";

/**
 * /ops/clients — accounts overview (brief §17): header · KPIs · toolbar · 8/4
 * split with client rows (identity · pipeline · engagement · actions) and a
 * right rail that never leaves the viewport empty (attention, top accounts,
 * recent activity). Creation lives in the drawer.
 */

export const metadata: Metadata = { title: "Clients · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

interface OrgRow {
  id: string; name: string; website: string | null; notes: string | null; archived_at: string | null; created_at: string; industry: string | null; country: string | null;
  primary_contact: { name: string | null; email: string | null; title: string | null } | null;
  contacts: number; projects: number; proposals: number; active_proposals: number; released: number; awaiting: number; open_value_cents: number; last_activity: string | null; top_status: string | null;
}

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string; show?: string }> }) {
  await requireOps();
  const sp = await searchParams;
  const [raw, dashRaw] = await Promise.all([listOrganizations(ADMIN_SECRET), opsDashboard(ADMIN_SECRET)]);
  const orgs = (raw ?? []) as unknown as OrgRow[];
  const dash = (dashRaw ?? {}) as { recent_activity?: { at: string; event: string; company: string | null; public_id: string | null }[] };
  const live = orgs.filter((o) => !o.archived_at);
  const q = (sp.q ?? "").trim().toLowerCase();
  const show = sp.show ?? "active";
  const visible = orgs.filter((o) => (show === "all" ? true : show === "archived" ? !!o.archived_at : !o.archived_at)).filter((o) => !q || `${o.name} ${o.website ?? ""} ${o.industry ?? ""} ${o.country ?? ""} ${o.primary_contact?.name ?? ""} ${o.primary_contact?.email ?? ""}`.toLowerCase().includes(q));
  const href = (patch: Record<string, string | null>) => { const p = new URLSearchParams(); for (const [k, v] of Object.entries({ q: sp.q ?? "", show, ...patch })) if (v) p.set(k, v); const qs = p.toString(); return `/ops/clients${qs ? `?${qs}` : ""}`; };

  const openValue = live.reduce((a, o) => a + o.open_value_cents, 0);
  const activeOpps = live.reduce((a, o) => a + o.active_proposals, 0);
  const awaiting = live.reduce((a, o) => a + o.awaiting, 0);
  const newThisMonth = live.filter((o) => Date.now() - new Date(o.created_at).getTime() < 30 * 86_400_000).length;
  const attention = live.flatMap((o) => {
    const items: { o: OrgRow; why: string; tone: "amber" | "red" | "cobalt" }[] = [];
    if (o.contacts === 0 || !o.primary_contact?.email) items.push({ o, why: "No contact with an email — nobody can be invited", tone: "red" });
    if (o.projects === 0) items.push({ o, why: "No project yet — a proposal needs one", tone: "amber" });
    if (o.awaiting > 0) items.push({ o, why: `${o.awaiting} proposal${o.awaiting === 1 ? "" : "s"} awaiting the client`, tone: "cobalt" });
    return items;
  }).slice(0, 8);
  const top = [...live].sort((a, b) => b.open_value_cents - a.open_value_cents).slice(0, 5);

  return (
    <AppShell active="/ops/clients">
      <PageHeader title="Clients" subtitle="Every account PODOS is working with: contacts, projects, live proposals and open value. Proposals can only exist under a client." count={`${live.length} active · ${orgs.length - live.length} archived`} actions={<NewClientDrawer />} />
      <AdminResult />

      <KpiGrid>
        <KpiCard icon={<Building2 size={20} strokeWidth={1.8} />} label="Total clients" value={live.length} context={`${orgs.length - live.length} archived`} href={href({ show: "active" })} />
        <KpiCard icon={<TrendingUp size={20} strokeWidth={1.8} />} label="Active opportunities" value={activeOpps} context="open proposals across all clients" tone="cyan" />
        <KpiCard icon={<DollarSign size={20} strokeWidth={1.8} />} label="Open value" value={compact(openValue)} context={openValue ? usd(openValue) : "no open value yet"} tone="green" />
        <KpiCard icon={<Clock size={20} strokeWidth={1.8} />} label="Awaiting response" value={awaiting} context="sent, not opened · or signature pending" tone="amber" />
        <KpiCard icon={<Users size={20} strokeWidth={1.8} />} label="New this month" value={newThisMonth} context="clients created in the last 30 days" tone="purple" />
      </KpiGrid>

      <div className={s.split84}>
        <div className={s.stack}>
          <Toolbar action="/ops/clients" searchValue={sp.q} placeholder="Search company, contact, industry or country"
            filters={[["active", "Active"], ["archived", "Archived"], ["all", "All"]].map(([k, l]) => ({ label: l, href: href({ show: k }), active: show === k }))}
            count={`${visible.length} of ${orgs.length}`} />

          {orgs.length === 0 ? (
            <EmptyState icon={<Building2 size={22} strokeWidth={1.8} />} title="No clients yet" text="Create the first client with the button above. Contacts, projects and proposals live under it." />
          ) : visible.length === 0 ? (
            <EmptyState title="Nothing matches" text="Try another filter or clear the search." action={<Link href="/ops/clients" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Clear</Link>} />
          ) : (
            <div className={s.rows}>
              {visible.map((o) => (
                <article key={o.id} className={s.row} style={o.archived_at ? { opacity: 0.7 } : undefined}>
                  <div className={s.rowIdentity}>
                    <Avatar name={o.name} />
                    <div style={{ minWidth: 0 }}>
                      <Link href={`/ops/clients/${o.id}`} className={s.rowTitle}>{o.name}</Link>
                      <p className={s.rowMeta}>{o.primary_contact?.name ? <><b>{o.primary_contact.name}</b>{o.primary_contact.title ? ` · ${o.primary_contact.title}` : ""}</> : <span className={s.muted}>No primary contact</span>}</p>
                      <p className={s.rowMetaMuted}>{[o.industry, o.country, o.website?.replace(/^https?:\/\//, "")].filter(Boolean).join(" · ") || "Details not set"}</p>
                    </div>
                  </div>
                  <Cell label="Pipeline">
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {o.archived_at ? <Chip tone="muted"><Archive size={12} aria-hidden /> Archived</Chip> : o.top_status ? <StatusChip status={o.top_status} /> : <Chip tone="gray">No proposals</Chip>}
                    </div>
                    <span className={s.rowSmall}><b style={{ color: "var(--ops-ink)" }}>{o.active_proposals}</b> active of {o.proposals} proposal{o.proposals === 1 ? "" : "s"} · {o.projects} project{o.projects === 1 ? "" : "s"}</span>
                  </Cell>
                  <Cell label="Open value">
                    <span className={s.rowValue}>{o.open_value_cents > 0 ? compact(o.open_value_cents) : "—"}</span>
                    <span className={s.rowSmall}>{o.open_value_cents > 0 ? usd(o.open_value_cents) : "no priced proposal yet"}</span>
                  </Cell>
                  <Cell label="Engagement" className={s.rowCellEngagement}>
                    <span className={s.rowSmall}><b style={{ color: "var(--ops-ink)" }}>{o.contacts}</b> contact{o.contacts === 1 ? "" : "s"}{o.awaiting ? ` · ${o.awaiting} awaiting client` : ""}</span>
                    <span className={s.rowSmall}>{o.last_activity ? `Last activity ${ago(o.last_activity)}` : `Created ${fmtDate(o.created_at)}`}</span>
                  </Cell>
                  <div className={s.rowActions}>
                    <Link href={`/ops/clients/${o.id}`} className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Open</Link>
                    <div style={{ display: "flex", gap: 6 }}>
                      <form action={archiveOrgAction}><input type="hidden" name="orgId" value={o.id} /><input type="hidden" name="archived" value={o.archived_at ? "0" : "1"} /><button type="submit" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`} title={o.archived_at ? "Restore" : "Archive"}>{o.archived_at ? <ArchiveRestore size={13} aria-hidden /> : <Archive size={13} aria-hidden />}{o.archived_at ? "Restore" : "Archive"}</button></form>
                      <ConfirmDelete compact action={deleteOrgAction} hidden={{ orgId: o.id }} label="Delete" text={`Permanently deletes ${o.name} with ${o.contacts} contact(s), ${o.projects} project(s) and ${o.proposals} proposal(s).`}
                        guard={o.released > 0 ? { reason: `${o.released} proposal(s) were released or signed.`, expectName: o.name, what: "the company name" } : null} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className={s.rail}>
          <Panel title="Requiring attention" icon={<AlertTriangle size={18} aria-hidden />} tight>
            {attention.length === 0 ? <p className={s.muted} style={{ fontSize: 13.5 }}>Every client has a contact, a project, and nothing waiting.</p> : attention.map((a, i) => (
              <Link key={`${a.o.id}-${i}`} href={`/ops/clients/${a.o.id}`} className={s.listRow} style={{ textDecoration: "none" }}>
                <span style={{ minWidth: 0 }}><span style={{ display: "block", fontWeight: 600, fontSize: 13.5 }}>{a.o.name}</span><span className={s.muted} style={{ fontSize: 12.5 }}>{a.why}</span></span>
                <Chip tone={a.tone}>{a.tone === "red" ? "Missing data" : a.tone === "amber" ? "Setup" : "Waiting"}</Chip>
              </Link>
            ))}
          </Panel>
          <Panel title="Top pipeline accounts" icon={<TrendingUp size={18} aria-hidden />} tight action={<PanelLink href="/ops/proposals">Proposals</PanelLink>}>
            {top.filter((o) => o.open_value_cents > 0).length === 0 ? <p className={s.muted} style={{ fontSize: 13.5 }}>No priced proposals yet.</p> : top.filter((o) => o.open_value_cents > 0).map((o) => (
              <Link key={o.id} href={`/ops/clients/${o.id}`} className={s.listRow} style={{ textDecoration: "none" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}><Avatar name={o.name} /><span style={{ minWidth: 0 }}><span style={{ display: "block", fontWeight: 600, fontSize: 13.5 }}>{o.name}</span><span className={s.muted} style={{ fontSize: 12.5 }}>{o.active_proposals} active proposal{o.active_proposals === 1 ? "" : "s"}</span></span></span>
                <span className={s.num} style={{ fontWeight: 700 }}>{compact(o.open_value_cents)}</span>
              </Link>
            ))}
          </Panel>
          <Panel title="Recent activity" icon={<Clock size={18} aria-hidden />} tight>
            {(dash.recent_activity ?? []).length === 0 ? <p className={s.muted} style={{ fontSize: 13.5 }}>No activity yet.</p> : (dash.recent_activity ?? []).slice(0, 6).map((a, i) => (
              <div key={i} className={s.listRow}><span style={{ minWidth: 0 }}><span className={s.timelineText}>{a.event.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}</span><span className={s.timelineMeta} style={{ display: "block" }}>{a.company ?? ""}{a.public_id ? ` · ${a.public_id}` : ""}</span></span><span className={s.timelineTime}>{ago(a.at)}</span></div>
            ))}
          </Panel>
          <Panel title="Missing contact data" icon={<Mail size={18} aria-hidden />} tight>
            {live.filter((o) => !o.primary_contact?.email).length === 0 ? <p className={s.muted} style={{ fontSize: 13.5 }}>Every active client has an email contact.</p> : live.filter((o) => !o.primary_contact?.email).slice(0, 5).map((o) => (
              <Link key={o.id} href={`/ops/clients/${o.id}`} className={s.listRow} style={{ textDecoration: "none" }}><span style={{ fontWeight: 600, fontSize: 13.5 }}>{o.name}</span><FolderKanban size={14} className={s.muted} aria-hidden /></Link>
            ))}
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}
