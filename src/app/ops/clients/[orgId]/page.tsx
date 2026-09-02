import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import {
  ADMIN_SECRET, addOrgNote, createContact, createProject, getOrganization, usd,
} from "@/lib/estimates/admin";
import OpsShell from "@/components/ops/OpsShell";
import { createProposalAction } from "../../proposals/actions";

/**
 * /ops/clients/[orgId] — client detail (master brief 7.4): contacts (with
 * roles), projects, proposals, internal notes, and the actions that create
 * them. Everything is one server round-trip via get_organization.
 */

export const metadata: Metadata = {
  title: "Client · PODOS ops",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const mono: React.CSSProperties = { fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase" };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const input: React.CSSProperties = {
  padding: "0.45rem 0.6rem", borderRadius: 8, border: "1px solid var(--edge-bright)",
  background: "var(--panel)", fontSize: 13, fontFamily: "inherit", minWidth: 0,
};
const btn: React.CSSProperties = {
  ...mono, fontSize: 10, padding: ".5rem .8rem", borderRadius: 8, border: "1px solid var(--brand)",
  background: "var(--brand-wash)", color: "var(--brand-deep)", cursor: "pointer",
};

interface Contact { id: string; first_name: string | null; last_name: string | null; title: string | null; email: string | null; phone: string | null; contact_roles: string[]; }
interface Project { id: string; name: string; description: string | null; pod_quantity: number | null; }
interface Proposal { public_id: string; estimate_no: string; project_name: string | null; status: string; view_count: number; one_time_low_cents: number; one_time_high_cents: number; signed_at: string | null; }
interface Note { id: string; body: string; author: string; created_at: string; }
interface OrgFull { org: { id: string; name: string; website: string | null; notes: string | null }; contacts: Contact[]; projects: Project[]; proposals: Proposal[]; notes: Note[]; }

export default async function ClientDetail({ params }: { params: Promise<{ orgId: string }> }) {
  await requireOps();
  const { orgId } = await params;
  if (!UUID_RE.test(orgId)) notFound();
  const data = (await getOrganization(ADMIN_SECRET, orgId)) as OrgFull | null;
  if (!data?.org) notFound();
  const { org, contacts, projects, proposals, notes } = data;

  async function addContact(formData: FormData) {
    "use server";
    await requireOps();
    const first = String(formData.get("first") ?? "").trim();
    if (!first) return;
    await createContact(ADMIN_SECRET, {
      orgId, first,
      last: String(formData.get("last") ?? "").trim() || undefined,
      title: String(formData.get("title") ?? "").trim() || undefined,
      email: String(formData.get("email") ?? "").trim() || undefined,
      phone: String(formData.get("phone") ?? "").trim() || undefined,
      roles: [String(formData.get("role") ?? "commercial")],
    });
    revalidatePath(`/ops/clients/${orgId}`);
  }

  async function addProject(formData: FormData) {
    "use server";
    await requireOps();
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return;
    await createProject(ADMIN_SECRET, {
      orgId, name,
      description: String(formData.get("description") ?? "").trim() || undefined,
      pods: Number(formData.get("pods")) || undefined,
    });
    revalidatePath(`/ops/clients/${orgId}`);
  }

  async function addNote(formData: FormData) {
    "use server";
    await requireOps();
    const body = String(formData.get("body") ?? "").trim();
    if (body) await addOrgNote(ADMIN_SECRET, orgId, body);
    revalidatePath(`/ops/clients/${orgId}`);
  }

  return (
    <OpsShell
      active="/ops/clients"
      title={org.name}
      actions={<Link href="/ops/clients" style={{ ...mono, fontSize: 11, color: "var(--ink-faint)", textDecoration: "none" }}>← All clients</Link>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: "1.4rem", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "1.4rem" }}>
          {/* proposals */}
          <Panel label="Proposals">
            {proposals.length === 0 ? <Empty>No proposals yet.</Empty> : proposals.map((p) => (
              <Link key={p.public_id} href={`/ops/proposals/${p.public_id}`} style={{ display: "flex", gap: "0.8rem", alignItems: "baseline", padding: "0.5rem 0", borderTop: "1px solid var(--edge-faint)", textDecoration: "none", flexWrap: "wrap" }}>
                <span style={{ ...mono, fontSize: 9.5, color: "var(--ink-faint)", width: 120 }}>{p.estimate_no}</span>
                <span style={{ flex: "1 1 120px", fontSize: 13.5, color: "var(--ink-strong)" }}>{p.project_name ?? "—"}</span>
                <StatusPill status={p.signed_at ? "signed" : p.status} />
                <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 13, color: "var(--ink-dim)" }}>
                  {p.one_time_high_cents > 0 ? `${usd(p.one_time_low_cents)}–${usd(p.one_time_high_cents)}` : "—"}
                </span>
              </Link>
            ))}
          </Panel>

          {/* contacts */}
          <Panel label="Contacts">
            {contacts.map((c) => (
              <div key={c.id} style={{ display: "flex", gap: "0.7rem", alignItems: "baseline", padding: "0.5rem 0", borderTop: "1px solid var(--edge-faint)", flexWrap: "wrap" }}>
                <span style={{ fontSize: 13.5, color: "var(--ink-strong)", fontWeight: 500 }}>
                  {[c.first_name, c.last_name].filter(Boolean).join(" ")}
                </span>
                {c.title && <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>{c.title}</span>}
                {c.email && <span style={{ fontSize: 12.5, color: "var(--brand)" }}>{c.email}</span>}
                <span style={{ ...mono, fontSize: 8.5, color: "var(--ink-faint)", marginLeft: "auto" }}>{c.contact_roles.join(" · ")}</span>
              </div>
            ))}
            <form action={addContact} style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.7rem", paddingTop: "0.7rem", borderTop: "1px solid var(--edge)" }}>
              <input style={{ ...input, flex: "1 1 90px" }} name="first" required placeholder="First" />
              <input style={{ ...input, flex: "1 1 90px" }} name="last" placeholder="Last" />
              <input style={{ ...input, flex: "1 1 100px" }} name="title" placeholder="Title" />
              <input style={{ ...input, flex: "1 1 140px" }} name="email" type="email" placeholder="Email" />
              <select style={input} name="role" defaultValue="commercial">
                {["commercial", "technical", "procurement", "legal", "signer", "billing"].map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <button type="submit" style={btn}>+ Contact</button>
            </form>
          </Panel>

          {/* projects */}
          <Panel label="Projects">
            {projects.length === 0 && <Empty>No projects yet — a proposal needs a project, add one below.</Empty>}
            {projects.map((p) => (
              <div key={p.id} style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap", padding: "0.5rem 0", borderTop: "1px solid var(--edge-faint)" }}>
                <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                  <span style={{ fontSize: 13.5, color: "var(--ink-strong)", fontWeight: 500 }}>{p.name}</span>
                  {p.pod_quantity ? <span style={{ ...mono, fontSize: 9, color: "var(--ink-faint)", marginLeft: 8 }}>{p.pod_quantity} pods</span> : null}
                  {p.description && <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 2 }}>{p.description}</p>}
                </div>
                {/* a proposal can only be created here — under this client's project */}
                <form action={createProposalAction} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input type="hidden" name="orgId" value={orgId} />
                  <input type="hidden" name="projectId" value={p.id} />
                  <select name="mode" defaultValue="client_configured" style={{ ...input, minHeight: 34 }} aria-label="How the proposal is built">
                    <option value="client_configured">Client builds (menu)</option>
                    <option value="admin_built">I build the line items</option>
                  </select>
                  {contacts.length > 0 && (
                    <select name="contactId" defaultValue={contacts[0]?.id ?? ""} style={{ ...input, minHeight: 34 }} aria-label="Primary contact">
                      {contacts.map((c) => <option key={c.id} value={c.id}>{[c.first_name, c.last_name].filter(Boolean).join(" ") || c.email}</option>)}
                    </select>
                  )}
                  <button type="submit" style={btn}>+ New proposal</button>
                </form>
              </div>
            ))}
            <form action={addProject} style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.7rem", paddingTop: "0.7rem", borderTop: "1px solid var(--edge)" }}>
              <input style={{ ...input, flex: "1 1 160px" }} name="name" required placeholder="Project name" />
              <input style={{ ...input, width: 80 }} name="pods" type="number" min="1" placeholder="Pods" />
              <input style={{ ...input, flex: "1 1 100%" }} name="description" placeholder="Description (optional)" />
              <button type="submit" style={btn}>+ Project</button>
            </form>
          </Panel>
        </div>

        {/* right rail: notes */}
        <Panel label="Internal notes">
          <form action={addNote} style={{ display: "grid", gap: "0.5rem", marginBottom: "0.9rem" }}>
            <textarea name="body" rows={3} placeholder="Add a private note…" style={{ ...input, resize: "vertical" }} />
            <button type="submit" style={{ ...btn, justifySelf: "start" }}>Save note</button>
          </form>
          {notes.length === 0 ? <Empty>No notes.</Empty> : notes.map((n) => (
            <div key={n.id} style={{ padding: "0.5rem 0", borderTop: "1px solid var(--edge-faint)" }}>
              <p style={{ fontSize: 13, color: "var(--ink-strong)", lineHeight: 1.5 }}>{n.body}</p>
              <p style={{ ...mono, fontSize: 8.5, color: "var(--ink-faint)", marginTop: 3 }}>
                {n.author} · {new Date(n.created_at).toLocaleDateString("en-US")}
              </p>
            </div>
          ))}
        </Panel>
      </div>
    </OpsShell>
  );
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", padding: "1.1rem 1.2rem" }}>
      <p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", marginBottom: "0.6rem" }}>{label}</p>
      {children}
    </section>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, color: "var(--ink-faint)" }}>{children}</p>;
}
function StatusPill({ status }: { status: string }) {
  const tone = status === "signed" || status === "client_signed"
    ? { c: "#15803D", b: "rgba(34,197,94,.45)", bg: "rgba(34,197,94,.08)" }
    : status === "viewed"
      ? { c: "var(--cyan-deep)", b: "rgba(34,211,238,.45)", bg: "rgba(34,211,238,.08)" }
      : { c: "var(--ink-dim)", b: "var(--edge-bright)", bg: "var(--glass-bg-strong)" };
  return (
    <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", padding: ".2rem .5rem", borderRadius: 999, color: tone.c, border: `1px solid ${tone.b}`, background: tone.bg, whiteSpace: "nowrap" }}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
