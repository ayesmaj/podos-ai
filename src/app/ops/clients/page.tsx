import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, createOrganization, listOrganizations, usd } from "@/lib/estimates/admin";
import OpsShell from "@/components/ops/OpsShell";

/**
 * /ops/clients — organizations list + inline create (master brief 7.4).
 */

export const metadata: Metadata = {
  title: "Clients · PODOS ops",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const mono: React.CSSProperties = { fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase" };

async function newClient(formData: FormData) {
  "use server";
  await requireOps();
  const name = String(formData.get("name") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  if (!name) return;
  await createOrganization(ADMIN_SECRET, name, website || undefined);
  revalidatePath("/ops/clients");
}

const input: React.CSSProperties = {
  padding: "0.5rem 0.6rem", borderRadius: 8, border: "1px solid var(--edge-bright)",
  background: "var(--panel)", fontSize: 13.5, fontFamily: "inherit", minWidth: 0,
};

export default async function ClientsPage() {
  await requireOps();
  const orgs = (await listOrganizations(ADMIN_SECRET)) ?? [];

  return (
    <OpsShell active="/ops/clients" title="Clients">
      <form action={newClient} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.4rem" }}>
        <input style={{ ...input, flex: "1 1 240px" }} name="name" required placeholder="Company name" />
        <input style={{ ...input, flex: "1 1 200px" }} name="website" placeholder="Website (optional)" />
        <button type="submit" style={{ ...mono, fontSize: 10.5, padding: ".55rem .9rem", borderRadius: 8, border: "none", background: "var(--brand-gradient)", color: "#fff", cursor: "pointer" }}>
          + Add client
        </button>
      </form>

      {orgs.length === 0 ? (
        <p style={{ color: "var(--ink-dim)", fontSize: 14 }}>No clients yet — add the first above.</p>
      ) : (
        <div style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "1rem", padding: "0.55rem 1rem", borderBottom: "1px solid var(--edge)", ...mono, fontSize: 9, color: "var(--ink-faint)" }}>
            <span style={{ flex: "1 1 240px" }}>Company</span>
            <span style={{ width: 80, textAlign: "right" }}>Contacts</span>
            <span style={{ width: 80, textAlign: "right" }}>Proposals</span>
            <span style={{ width: 130, textAlign: "right" }}>Open value</span>
          </div>
          {orgs.map((o) => (
            <Link key={o.id} href={`/ops/clients/${o.id}`} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.7rem 1rem", borderTop: "1px solid var(--edge-faint)", textDecoration: "none" }}>
              <span style={{ flex: "1 1 240px", fontSize: 14, color: "var(--ink-strong)", fontWeight: 500 }}>
                {o.name}
                {o.website && <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-faint)" }}>{o.website}</span>}
              </span>
              <span style={{ width: 80, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13.5, color: "var(--ink-dim)" }}>{o.contacts}</span>
              <span style={{ width: 80, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13.5, color: "var(--ink-dim)" }}>{o.proposals}</span>
              <span style={{ width: 130, textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 13.5, color: "var(--ink-strong)" }}>{usd(o.open_value_cents)}</span>
            </Link>
          ))}
        </div>
      )}
    </OpsShell>
  );
}
