import type { Metadata } from "next";
import Link from "next/link";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, listProjects } from "@/lib/estimates/admin";
import OpsShell from "@/components/ops/OpsShell";
import AdminResult from "@/components/ops/AdminResult";
import ConfirmDelete from "@/components/ops/ConfirmDelete";
import { deleteProjectAction } from "../clients/[orgId]/actions";

/**
 * /ops/projects — all projects across clients. Projects are created and edited
 * inside their client; this index links there and offers delete per row
 * (typed-name confirmation when released or signed proposals exist).
 */

export const metadata: Metadata = { title: "Projects · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const mono: React.CSSProperties = { fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase" };
const ghost: React.CSSProperties = { ...mono, fontSize: 9, padding: ".25rem .5rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" };

interface ProjectRow { id: string; name: string; description: string | null; org_id: string | null; org_name: string | null; pod_quantity: number | null; proposals: number; released: number }

export default async function ProjectsPage() {
  await requireOps();
  const projects = ((await listProjects(ADMIN_SECRET)) ?? []) as unknown as ProjectRow[];

  return (
    <OpsShell active="/ops/projects" title="Projects">
      <AdminResult />
      {projects.length === 0 ? (
        <p style={{ color: "var(--ink-dim)", fontSize: 14 }}>No projects yet. Open a <Link href="/ops/clients" style={{ color: "var(--brand)" }}>client</Link> to add one.</p>
      ) : (
        <div style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)" }}>
          <div style={{ display: "flex", gap: "1rem", padding: "0.55rem 1rem", borderBottom: "1px solid var(--edge)", ...mono, fontSize: 9, color: "var(--ink-faint)" }}>
            <span style={{ flex: "1 1 200px" }}>Project</span>
            <span style={{ flex: "1 1 160px" }}>Client</span>
            <span style={{ width: 60, textAlign: "right" }}>Pods</span>
            <span style={{ width: 80, textAlign: "right" }}>Proposals</span>
            <span style={{ width: 170, textAlign: "right" }}>Actions</span>
          </div>
          {projects.map((p) => (
            <div key={p.id} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.7rem 1rem", borderTop: "1px solid var(--edge-faint)" }}>
              <span style={{ flex: "1 1 200px", fontSize: 14, color: "var(--ink-strong)", fontWeight: 500, minWidth: 0 }}>
                {p.name}
                {p.description && <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-faint)" }}>{p.description}</span>}
              </span>
              <span style={{ flex: "1 1 160px", fontSize: 13 }}>
                {p.org_id ? <Link href={`/ops/clients/${p.org_id}`} style={{ color: "var(--brand)", textDecoration: "none" }}>{p.org_name}</Link> : <span style={{ color: "var(--ink-faint)" }}>—</span>}
              </span>
              <span style={{ width: 60, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13.5, color: "var(--ink-dim)" }}>{p.pod_quantity ?? "—"}</span>
              <span style={{ width: 80, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13.5, color: "var(--ink-dim)" }}>{p.proposals}</span>
              <div style={{ width: 170, display: "flex", gap: 6, justifyContent: "flex-end", alignItems: "center" }}>
                {p.org_id && <Link href={`/ops/clients/${p.org_id}#project-${p.id}`} style={ghost}>Edit</Link>}
                {p.org_id && (
                  <ConfirmDelete
                    compact action={deleteProjectAction} hidden={{ id: p.id, orgId: p.org_id }} label="Delete"
                    text={`Deletes ${p.name} and its ${p.proposals} proposal(s).`}
                    guard={p.released > 0 ? { reason: `${p.released} proposal(s) were released or signed.`, expectName: p.name, what: "the project name" } : null}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </OpsShell>
  );
}
