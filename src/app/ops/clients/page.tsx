import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Archive, ArchiveRestore } from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, createOrganization, listOrganizations, usd } from "@/lib/estimates/admin";
import OpsShell from "@/components/ops/OpsShell";
import AdminResult from "@/components/ops/AdminResult";
import ConfirmDelete from "@/components/ops/ConfirmDelete";
import { archiveOrgAction, deleteOrgAction } from "./[orgId]/actions";

/**
 * /ops/clients — organizations list with inline create and per-row control:
 * open, archive / restore, delete (typed-name confirmation when the client has
 * released or signed proposals).
 */

export const metadata: Metadata = { title: "Clients · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const mono: React.CSSProperties = { fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase" };
const input: React.CSSProperties = { padding: "0.5rem 0.6rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", fontSize: 13.5, fontFamily: "inherit", minWidth: 0 };
const ghost: React.CSSProperties = { ...mono, fontSize: 9, padding: ".25rem .5rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" };

interface OrgRow { id: string; name: string; website: string | null; archived_at: string | null; contacts: number; projects: number; proposals: number; released: number; open_value_cents: number }

async function newClient(formData: FormData) {
  "use server";
  await requireOps();
  const name = String(formData.get("name") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  if (!name) return;
  await createOrganization(ADMIN_SECRET, name, website || undefined);
  revalidatePath("/ops/clients");
}

export default async function ClientsPage() {
  await requireOps();
  const orgs = ((await listOrganizations(ADMIN_SECRET)) ?? []) as unknown as OrgRow[];

  return (
    <OpsShell active="/ops/clients" title="Clients">
      <AdminResult />
      <form action={newClient} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.4rem" }}>
        <input style={{ ...input, flex: "1 1 240px" }} name="name" required placeholder="Company name" />
        <input style={{ ...input, flex: "1 1 200px" }} name="website" placeholder="Website (optional)" />
        <button type="submit" style={{ ...mono, fontSize: 10.5, padding: ".55rem .9rem", borderRadius: 8, border: "none", background: "var(--brand-gradient)", color: "#fff", cursor: "pointer" }}>+ Add client</button>
      </form>

      {orgs.length === 0 ? (
        <p style={{ color: "var(--ink-dim)", fontSize: 14 }}>No clients yet — add the first above.</p>
      ) : (
        <div style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", overflow: "visible" }}>
          <div style={{ display: "flex", gap: "1rem", padding: "0.55rem 1rem", borderBottom: "1px solid var(--edge)", ...mono, fontSize: 9, color: "var(--ink-faint)" }}>
            <span style={{ flex: "1 1 240px" }}>Company</span>
            <span style={{ width: 70, textAlign: "right" }}>Contacts</span>
            <span style={{ width: 70, textAlign: "right" }}>Projects</span>
            <span style={{ width: 80, textAlign: "right" }}>Proposals</span>
            <span style={{ width: 120, textAlign: "right" }}>Open value</span>
            <span style={{ width: 230, textAlign: "right" }}>Actions</span>
          </div>
          {orgs.map((o) => (
            <div key={o.id} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.7rem 1rem", borderTop: "1px solid var(--edge-faint)", opacity: o.archived_at ? 0.6 : 1 }}>
              <Link href={`/ops/clients/${o.id}`} style={{ flex: "1 1 240px", fontSize: 14, color: "var(--ink-strong)", fontWeight: 500, textDecoration: "none", minWidth: 0 }}>
                {o.name}
                {o.archived_at && <span style={{ ...mono, fontSize: 8.5, color: "#B45309", marginLeft: 8, border: "1px solid rgba(180,83,9,.4)", borderRadius: 999, padding: ".1rem .45rem" }}>archived</span>}
                {o.website && <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-faint)" }}>{o.website}</span>}
              </Link>
              <span style={{ width: 70, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13.5, color: "var(--ink-dim)" }}>{o.contacts}</span>
              <span style={{ width: 70, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13.5, color: "var(--ink-dim)" }}>{o.projects}</span>
              <span style={{ width: 80, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13.5, color: "var(--ink-dim)" }}>{o.proposals}</span>
              <span style={{ width: 120, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13.5, color: "var(--ink-strong)" }}>{usd(o.open_value_cents)}</span>
              <div style={{ width: 230, display: "flex", gap: 6, justifyContent: "flex-end", alignItems: "center" }}>
                <Link href={`/ops/clients/${o.id}`} style={ghost}>Open · edit</Link>
                <form action={archiveOrgAction}>
                  <input type="hidden" name="orgId" value={o.id} /><input type="hidden" name="archived" value={o.archived_at ? "0" : "1"} />
                  <button type="submit" style={ghost} title={o.archived_at ? "Restore" : "Archive (hide, keep everything)"}>{o.archived_at ? <ArchiveRestore size={11} aria-hidden /> : <Archive size={11} aria-hidden />}{o.archived_at ? "Restore" : "Archive"}</button>
                </form>
                <ConfirmDelete
                  compact action={deleteOrgAction} hidden={{ orgId: o.id }} label="Delete"
                  text={`Permanently deletes ${o.name} with ${o.contacts} contact(s), ${o.projects} project(s) and ${o.proposals} proposal(s).`}
                  guard={o.released > 0 ? { reason: `${o.released} proposal(s) were released or signed.`, expectName: o.name, what: "the company name" } : null}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </OpsShell>
  );
}
