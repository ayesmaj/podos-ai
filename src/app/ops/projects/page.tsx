import type { Metadata } from "next";
import Link from "next/link";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, listProjects } from "@/lib/estimates/admin";
import OpsShell from "@/components/ops/OpsShell";

/**
 * /ops/projects — all projects across clients (master brief 6.1). Projects are
 * created inside a client (they belong to an organization); this is the
 * cross-client index.
 */

export const metadata: Metadata = {
  title: "Projects · PODOS ops",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const mono: React.CSSProperties = { fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase" };

export default async function ProjectsPage() {
  await requireOps();
  const projects = (await listProjects(ADMIN_SECRET)) ?? [];

  return (
    <OpsShell active="/ops/projects" title="Projects">
      {projects.length === 0 ? (
        <p style={{ color: "var(--ink-dim)", fontSize: 14 }}>
          No projects yet. Open a <Link href="/ops/clients" style={{ color: "var(--brand)" }}>client</Link> to add one.
        </p>
      ) : (
        <div style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "1rem", padding: "0.55rem 1rem", borderBottom: "1px solid var(--edge)", ...mono, fontSize: 9, color: "var(--ink-faint)" }}>
            <span style={{ flex: "1 1 200px" }}>Project</span>
            <span style={{ flex: "1 1 160px" }}>Client</span>
            <span style={{ width: 70, textAlign: "right" }}>Pods</span>
            <span style={{ width: 90, textAlign: "right" }}>Proposals</span>
          </div>
          {projects.map((p) => (
            <div key={p.id} style={{ display: "flex", gap: "1rem", alignItems: "baseline", padding: "0.7rem 1rem", borderTop: "1px solid var(--edge-faint)" }}>
              <span style={{ flex: "1 1 200px", fontSize: 14, color: "var(--ink-strong)", fontWeight: 500 }}>
                {p.name}
                {p.description && <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-faint)" }}>{p.description}</span>}
              </span>
              <span style={{ flex: "1 1 160px", fontSize: 13 }}>
                {p.org_id ? <Link href={`/ops/clients/${p.org_id}`} style={{ color: "var(--brand)", textDecoration: "none" }}>{p.org_name}</Link> : <span style={{ color: "var(--ink-faint)" }}>—</span>}
              </span>
              <span style={{ width: 70, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13.5, color: "var(--ink-dim)" }}>{p.pod_quantity ?? "—"}</span>
              <span style={{ width: 90, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13.5, color: "var(--ink-dim)" }}>{p.proposals}</span>
            </div>
          ))}
        </div>
      )}
    </OpsShell>
  );
}
