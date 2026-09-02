import type { Metadata } from "next";
import Link from "next/link";
import { Building2, CalendarClock, FileText, FolderKanban, Layers, PenLine, Zap } from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { nowMs } from "@/lib/ops/clock";
import { ADMIN_SECRET, listProjects } from "@/lib/estimates/admin";
import { AppShell, Avatar, Cell, Chip, EmptyState, KpiCard, KpiGrid, PageHeader, Toolbar, fmtDate, ops as s } from "@/components/ops/ui";
import AdminResult from "@/components/ops/AdminResult";
import ConfirmDelete from "@/components/ops/ConfirmDelete";
import { deleteProjectAction } from "../clients/[orgId]/actions";

/**
 * /ops/projects — every project across clients (archetype 2, list variant).
 * Header · 5 KPIs · toolbar (search + proposal filter) · 12-col entity rows.
 * Projects are created and edited inside their client; this index links there
 * and offers delete per row (typed-name confirmation when released/signed
 * proposals exist). No right rail: width belongs to the rows.
 */

export const metadata: Metadata = { title: "Projects · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

interface ProjectRow {
  id: string; name: string; description: string | null; org_id: string | null; org_name: string | null;
  pod_quantity: number | null; required_capacity_mw: number | null; target_golive: string | null; proposals: number; released: number;
}

const MW = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ q?: string; has?: string }> }) {
  await requireOps();
  const sp = await searchParams;
  const projects = ((await listProjects(ADMIN_SECRET)) ?? []) as unknown as ProjectRow[];

  const q = (sp.q ?? "").trim().toLowerCase();
  const has = sp.has === "with" || sp.has === "without" ? sp.has : "all";
  const visible = projects
    .filter((p) => (has === "with" ? p.proposals > 0 : has === "without" ? p.proposals === 0 : true))
    .filter((p) => !q || `${p.name} ${p.org_name ?? ""} ${p.description ?? ""}`.toLowerCase().includes(q));
  const href = (patch: Record<string, string | null>) => { const u = new URLSearchParams(); for (const [k, v] of Object.entries({ q: sp.q ?? "", has, ...patch })) if (v && v !== "all") u.set(k, v); const qs = u.toString(); return `/ops/projects${qs ? `?${qs}` : ""}`; };

  const totalMw = projects.reduce((a, p) => a + (p.required_capacity_mw ?? 0), 0);
  const totalPods = projects.reduce((a, p) => a + (p.pod_quantity ?? 0), 0);
  const withProposals = projects.filter((p) => p.proposals > 0).length;
  const totalProposals = projects.reduce((a, p) => a + p.proposals, 0);
  const released = projects.reduce((a, p) => a + p.released, 0);
  const clients = new Set(projects.map((p) => p.org_id).filter(Boolean)).size;

  return (
    <AppShell active="/ops/projects">
      <PageHeader
        title="Projects"
        subtitle="Every deployment a client is planning: pod count, required capacity and target go-live. Proposals are always bound to one project."
        count={`${plural(projects.length, "project")} across ${plural(clients, "client")}`}
      />
      <AdminResult />

      <KpiGrid>
        <KpiCard icon={<FolderKanban size={20} strokeWidth={1.8} />} label="Active projects" value={projects.length} context={`${plural(clients, "client")}`} href={href({ has: null })} />
        <KpiCard icon={<Zap size={20} strokeWidth={1.8} />} label="Total planned capacity" value={`${MW.format(totalMw)} MW`} context={totalMw ? `across ${plural(projects.filter((p) => p.required_capacity_mw).length, "sized project")}` : "no capacity set yet"} tone="cyan" />
        <KpiCard icon={<Layers size={20} strokeWidth={1.8} />} label="Total pods" value={totalPods} context={totalPods ? `${MW.format(totalPods ? totalMw / totalPods : 0)} MW per pod on average` : "no pod counts yet"} tone="electric" />
        <KpiCard icon={<FileText size={20} strokeWidth={1.8} />} label="Projects with proposals" value={withProposals} context={`${plural(projects.length - withProposals, "project")} without one`} tone="amber" href={href({ has: "with" })} />
        <KpiCard icon={<PenLine size={20} strokeWidth={1.8} />} label="Released or signed" value={released} context={`of ${plural(totalProposals, "proposal")} in total`} tone="green" />
      </KpiGrid>

      <div className={s.stack}>
        <Toolbar action="/ops/projects" searchValue={sp.q} placeholder="Search project, client or description"
          filters={[["all", "All"], ["with", "With proposals"], ["without", "Without proposals"]].map(([k, l]) => ({ label: l, href: href({ has: k }), active: has === k }))}
          count={`${visible.length} of ${projects.length}`} />

        {projects.length === 0 ? (
          <EmptyState icon={<FolderKanban size={22} strokeWidth={1.8} />} title="No projects yet" text="Projects are created inside their client. Open a client and add the first project there — proposals need one."
            action={<Link href="/ops/clients" className={`${s.btn} ${s.btnSecondary}`}>Go to Clients</Link>} />
        ) : visible.length === 0 ? (
          <EmptyState title={q ? `No matches for “${sp.q}”` : "Nothing matches this filter"} text="Try another filter or clear the search." action={<Link href="/ops/projects" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Clear filters</Link>} />
        ) : (
          <div className={s.rows}>
            {visible.map((p) => {
              const open = p.org_id ? `/ops/clients/${p.org_id}#project-${p.id}` : null;
              return (
                <article key={p.id} className={s.row}>
                  <div className={s.rowIdentity}>
                    <Avatar name={p.org_name ?? p.name} />
                    <div style={{ minWidth: 0 }}>
                      {open ? <Link href={open} className={s.rowTitle}>{p.name}</Link> : <span className={s.rowTitle}>{p.name}</span>}
                      <p className={s.rowMeta}>{p.org_id ? <Link href={`/ops/clients/${p.org_id}`} style={{ color: "var(--ops-cobalt)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}><Building2 size={13} aria-hidden />{p.org_name}</Link> : <span className={s.muted}>No client</span>}</p>
                      <p className={s.rowMetaMuted}>{p.description || "No description"}</p>
                    </div>
                  </div>
                  <Cell label="Capacity">
                    <span className={s.rowValue}>{p.pod_quantity != null ? plural(p.pod_quantity, "pod") : "— pods"} · {p.required_capacity_mw != null ? `${MW.format(p.required_capacity_mw)} MW` : "— MW"}</span>
                    <span className={s.rowSmall}>{p.pod_quantity && p.required_capacity_mw ? `${MW.format(p.required_capacity_mw / p.pod_quantity)} MW per pod` : "sizing not complete"}</span>
                  </Cell>
                  <Cell label="Proposals">
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span className={s.rowValue}>{p.proposals}</span>
                      {p.released > 0 ? <Chip tone="green">{p.released} released</Chip> : p.proposals > 0 ? <Chip tone="cobalt">In progress</Chip> : <Chip tone="gray">None yet</Chip>}
                    </div>
                    <span className={s.rowSmall}>{p.released > 0 ? `${p.released} of ${p.proposals} released or signed` : p.proposals > 0 ? "nothing released to the client yet" : "no proposal for this project"}</span>
                  </Cell>
                  <Cell label="Go-live" className={s.rowCellEngagement}>
                    <span className={s.rowSmall} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><CalendarClock size={14} aria-hidden className={s.muted} /><b style={{ color: "var(--ops-ink)" }}>{fmtDate(p.target_golive)}</b></span>
                    <span className={s.rowSmall}>{p.target_golive ? (new Date(p.target_golive).getTime() < nowMs() ? "target date passed" : "target go-live") : "no target date set"}</span>
                  </Cell>
                  <div className={s.rowActions}>
                    {open && <Link href={open} className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Open</Link>}
                    {p.org_id && (
                      <ConfirmDelete compact action={deleteProjectAction} hidden={{ id: p.id, orgId: p.org_id }} label="Delete"
                        text={`Deletes ${p.name} and its ${p.proposals} proposal(s).`}
                        guard={p.released > 0 ? { reason: `${p.released} proposal(s) were released or signed.`, expectName: p.name, what: "the project name" } : null} />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <p className={s.muted} style={{ fontSize: 13, maxWidth: "76ch" }}>Projects are created and edited inside their client — open a row to jump to that client&apos;s project card. Deleting a project removes its proposals; a typed confirmation is required once anything was released or signed.</p>
    </AppShell>
  );
}
