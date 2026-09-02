import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Archive, ArchiveRestore, Pencil, Trash2 } from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, addOrgNote, createContact, createProject, getOrganization, usd } from "@/lib/estimates/admin";
import OpsShell from "@/components/ops/OpsShell";
import AdminResult from "@/components/ops/AdminResult";
import ConfirmDelete from "@/components/ops/ConfirmDelete";
import { createProposalAction } from "../../proposals/actions";
import { archiveOrgAction, deleteContactAction, deleteNoteAction, deleteOrgAction, deleteProjectAction, updateContactAction, updateOrgAction, updateProjectAction } from "./actions";

/**
 * /ops/clients/[orgId] — client detail with FULL control: edit / archive /
 * delete the client, edit / remove contacts and projects, delete notes, create
 * proposals under a project. Safety rules are enforced by the database
 * functions and echoed in the UI (delete disabled with the reason).
 */

export const metadata: Metadata = { title: "Client · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const mono: React.CSSProperties = { fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase" };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const input: React.CSSProperties = { padding: "0.45rem 0.6rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", fontSize: 13, fontFamily: "inherit", minWidth: 0 };
const btn: React.CSSProperties = { ...mono, fontSize: 10, padding: ".5rem .8rem", borderRadius: 8, border: "1px solid var(--brand)", background: "var(--brand-wash)", color: "var(--brand-deep)", cursor: "pointer" };
const ghost: React.CSSProperties = { ...mono, fontSize: 9.5, padding: ".35rem .6rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 };
const danger: React.CSSProperties = { ...ghost, color: "#B91C1C", borderColor: "rgba(185,28,28,.35)" };
const RELEASED = new Set(["released", "signature_requested", "client_signed", "signed", "countersigned", "completed", "won"]);
const ROLES = ["commercial", "technical", "procurement", "legal", "signer", "billing"];

interface Contact { id: string; first_name: string | null; last_name: string | null; title: string | null; email: string | null; phone: string | null; contact_roles: string[] }
interface Project { id: string; name: string; description: string | null; pod_quantity: number | null; required_capacity_mw: number | null; expected_gpus: number | null; workload: string | null; target_golive: string | null }
interface Proposal { public_id: string; estimate_no: string; project_name: string | null; project_id: string | null; status: string; revoked: boolean; locked: boolean; view_count: number; one_time_low_cents: number; one_time_high_cents: number; signed_at: string | null }
interface Note { id: string; body: string; author: string; created_at: string }
interface Org { id: string; name: string; legal_name: string | null; website: string | null; industry: string | null; country: string | null; notes: string | null; archived_at: string | null }
interface OrgFull { org: Org; contacts: Contact[]; projects: Project[]; proposals: Proposal[]; notes: Note[] }

const released = (p: Proposal) => p.signed_at != null || p.locked || RELEASED.has(p.status);

export default async function ClientDetail({ params }: { params: Promise<{ orgId: string }> }) {
  await requireOps();
  const { orgId } = await params;
  if (!UUID_RE.test(orgId)) notFound();
  const data = (await getOrganization(ADMIN_SECRET, orgId)) as OrgFull | null;
  if (!data?.org) notFound();
  const { org, contacts, projects, proposals, notes } = data;
  const hasReleased = proposals.some(released);

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
    await createProject(ADMIN_SECRET, { orgId, name, description: String(formData.get("description") ?? "").trim() || undefined, pods: Number(formData.get("pods")) || undefined });
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
      actions={
        <>
          {org.archived_at && <span style={{ ...mono, fontSize: 9.5, color: "#B45309", border: "1px solid rgba(180,83,9,.4)", borderRadius: 999, padding: ".25rem .6rem" }}>Archived</span>}
          <Link href="/ops/clients" style={{ ...mono, fontSize: 11, color: "var(--ink-faint)", textDecoration: "none" }}>← All clients</Link>
        </>
      }
    >
      <AdminResult />

      {/* client record: edit + archive + delete */}
      <details style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", marginBottom: "1.4rem" }}>
        <summary style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", padding: ".9rem 1.2rem", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <Pencil size={13} aria-hidden /> Client details · {org.website ?? "no website"} · {org.country ?? "country not set"}
        </summary>
        <div style={{ padding: "0 1.2rem 1.2rem", display: "grid", gap: "1rem" }}>
          <form action={updateOrgAction} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.6rem" }}>
            <input type="hidden" name="orgId" value={orgId} />
            <Field label="Company name"><input style={input} name="name" required defaultValue={org.name} /></Field>
            <Field label="Legal name"><input style={input} name="legal_name" defaultValue={org.legal_name ?? ""} /></Field>
            <Field label="Website"><input style={input} name="website" defaultValue={org.website ?? ""} /></Field>
            <Field label="Industry"><input style={input} name="industry" defaultValue={org.industry ?? ""} /></Field>
            <Field label="Country"><input style={input} name="country" defaultValue={org.country ?? ""} /></Field>
            <Field label="Internal notes" wide><textarea style={{ ...input, resize: "vertical" }} name="notes" rows={2} defaultValue={org.notes ?? ""} /></Field>
            <div><button type="submit" style={btn}>Save client</button></div>
          </form>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", paddingTop: "0.8rem", borderTop: "1px solid var(--edge)" }}>
            <form action={archiveOrgAction}>
              <input type="hidden" name="orgId" value={orgId} />
              <input type="hidden" name="archived" value={org.archived_at ? "0" : "1"} />
              <button type="submit" style={ghost}>{org.archived_at ? <><ArchiveRestore size={13} aria-hidden /> Restore client</> : <><Archive size={13} aria-hidden /> Archive client</>}</button>
            </form>
            <ConfirmDelete
              action={deleteOrgAction} hidden={{ orgId }} label="Delete client"
              text={`Permanently deletes ${org.name}, its ${contacts.length} contact(s), ${projects.length} project(s) and ${proposals.length} proposal(s).`}
              guard={hasReleased ? { reason: `${proposals.filter(released).length} proposal(s) were released or signed.`, expectName: org.name, what: "the company name" } : null}
            />
          </div>
        </div>
      </details>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: "1.4rem", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "1.4rem" }}>
          <Panel label="Proposals">
            {proposals.length === 0 ? <Empty>No proposals yet.</Empty> : proposals.map((p) => (
              <Link key={p.public_id} href={`/ops/proposals/${p.public_id}`} style={{ display: "flex", gap: "0.8rem", alignItems: "baseline", padding: "0.5rem 0", borderTop: "1px solid var(--edge-faint)", textDecoration: "none", flexWrap: "wrap", opacity: p.revoked ? 0.6 : 1 }}>
                <span style={{ ...mono, fontSize: 9.5, color: "var(--ink-faint)", width: 120 }}>{p.estimate_no}</span>
                <span style={{ flex: "1 1 120px", fontSize: 13.5, color: "var(--ink-strong)" }}>{p.project_name ?? "—"}</span>
                <StatusPill status={p.revoked ? "withdrawn" : p.signed_at ? "signed" : p.status} />
                <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 13, color: "var(--ink-dim)" }}>{p.one_time_high_cents > 0 ? `${usd(p.one_time_low_cents)}–${usd(p.one_time_high_cents)}` : "—"}</span>
              </Link>
            ))}
          </Panel>

          <Panel label="Contacts">
            {contacts.map((c) => (
              <details key={c.id} style={{ borderTop: "1px solid var(--edge-faint)" }}>
                <summary style={{ display: "flex", gap: "0.7rem", alignItems: "baseline", padding: "0.5rem 0", flexWrap: "wrap", cursor: "pointer", listStyle: "none" }}>
                  <span style={{ fontSize: 13.5, color: "var(--ink-strong)", fontWeight: 500 }}>{[c.first_name, c.last_name].filter(Boolean).join(" ") || c.email}</span>
                  {c.title && <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>{c.title}</span>}
                  {c.email && <span style={{ fontSize: 12.5, color: "var(--brand)" }}>{c.email}</span>}
                  {c.phone && <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>{c.phone}</span>}
                  <span style={{ ...mono, fontSize: 8.5, color: "var(--ink-faint)", marginLeft: "auto" }}>{c.contact_roles.join(" · ")} · edit</span>
                </summary>
                <form action={updateContactAction} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.5rem", padding: "0.4rem 0 0.8rem" }}>
                  <input type="hidden" name="id" value={c.id} /><input type="hidden" name="orgId" value={orgId} />
                  <input style={input} name="first" required defaultValue={c.first_name ?? ""} placeholder="First" />
                  <input style={input} name="last" defaultValue={c.last_name ?? ""} placeholder="Last" />
                  <input style={input} name="title" defaultValue={c.title ?? ""} placeholder="Title" />
                  <input style={input} name="email" type="email" defaultValue={c.email ?? ""} placeholder="Email" />
                  <input style={input} name="phone" type="tel" defaultValue={c.phone ?? ""} placeholder="Phone" />
                  <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    {ROLES.map((r) => <label key={r} style={{ fontSize: 12, color: "var(--ink-dim)", display: "flex", gap: 4, alignItems: "center" }}><input type="checkbox" name="roles" value={r} defaultChecked={c.contact_roles.includes(r)} /> {r}</label>)}
                    <button type="submit" style={{ ...btn, marginLeft: "auto" }}>Save contact</button>
                  </div>
                </form>
                <div style={{ paddingBottom: "0.8rem" }}>
                  <ConfirmDelete action={deleteContactAction} hidden={{ id: c.id, orgId }} label="Remove contact" text={`Removes ${[c.first_name, c.last_name].filter(Boolean).join(" ") || c.email} and revokes every secure link issued to ${c.email ?? "them"}.`} guard={null} />
                </div>
              </details>
            ))}
            <form action={addContact} style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.7rem", paddingTop: "0.7rem", borderTop: "1px solid var(--edge)" }}>
              <input style={{ ...input, flex: "1 1 90px" }} name="first" required placeholder="First" />
              <input style={{ ...input, flex: "1 1 90px" }} name="last" placeholder="Last" />
              <input style={{ ...input, flex: "1 1 100px" }} name="title" placeholder="Title" />
              <input style={{ ...input, flex: "1 1 140px" }} name="email" type="email" placeholder="Email" />
              <input style={{ ...input, flex: "1 1 110px" }} name="phone" type="tel" placeholder="Phone" />
              <select style={input} name="role" defaultValue="commercial">{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</select>
              <button type="submit" style={btn}>+ Contact</button>
            </form>
          </Panel>

          <Panel label="Projects">
            {projects.length === 0 && <Empty>No projects yet — a proposal needs a project, add one below.</Empty>}
            {projects.map((p) => {
              const own = proposals.filter((x) => x.project_id === p.id);
              const blocked = own.some(released);
              return (
                <details key={p.id} id={`project-${p.id}`} style={{ borderTop: "1px solid var(--edge-faint)" }}>
                  <summary style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap", padding: "0.5rem 0", cursor: "pointer", listStyle: "none" }}>
                    <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                      <span style={{ fontSize: 13.5, color: "var(--ink-strong)", fontWeight: 500 }}>{p.name}</span>
                      {p.pod_quantity ? <span style={{ ...mono, fontSize: 9, color: "var(--ink-faint)", marginLeft: 8 }}>{p.pod_quantity} pods</span> : null}
                      {p.required_capacity_mw ? <span style={{ ...mono, fontSize: 9, color: "var(--ink-faint)", marginLeft: 8 }}>{p.required_capacity_mw} MW</span> : null}
                      {p.description && <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 2 }}>{p.description}</p>}
                    </div>
                    <span style={{ ...mono, fontSize: 8.5, color: "var(--ink-faint)" }}>{own.length} proposal{own.length === 1 ? "" : "s"} · edit</span>
                  </summary>
                  <form action={updateProjectAction} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem", padding: "0.4rem 0 0.8rem" }}>
                    <input type="hidden" name="id" value={p.id} /><input type="hidden" name="orgId" value={orgId} />
                    <Field label="Name" wide><input style={input} name="name" required defaultValue={p.name} /></Field>
                    <Field label="Pods"><input style={input} name="pods" type="number" min={1} defaultValue={p.pod_quantity ?? ""} /></Field>
                    <Field label="Capacity (MW)"><input style={input} name="capacity_mw" type="number" step="0.1" min={0} defaultValue={p.required_capacity_mw ?? ""} /></Field>
                    <Field label="GPU positions"><input style={input} name="gpus" type="number" min={0} defaultValue={p.expected_gpus ?? ""} /></Field>
                    <Field label="Workload"><input style={input} name="workload" defaultValue={p.workload ?? ""} /></Field>
                    <Field label="Target go-live"><input style={input} name="golive" type="date" defaultValue={p.target_golive ?? ""} /></Field>
                    <Field label="Description" wide><input style={input} name="description" defaultValue={p.description ?? ""} /></Field>
                    <div><button type="submit" style={btn}>Save project</button></div>
                  </form>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", paddingBottom: "0.8rem" }}>
                    <form action={createProposalAction} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                      <input type="hidden" name="orgId" value={orgId} /><input type="hidden" name="projectId" value={p.id} />
                      <select name="mode" defaultValue="client_configured" style={{ ...input, minHeight: 34 }} aria-label="How the proposal is built">
                        <option value="client_configured">Client builds (menu)</option><option value="admin_built">I build the line items</option>
                      </select>
                      {contacts.length > 0 && (
                        <select name="contactId" defaultValue={contacts[0]?.id ?? ""} style={{ ...input, minHeight: 34 }} aria-label="Primary contact">
                          {contacts.map((c) => <option key={c.id} value={c.id}>{[c.first_name, c.last_name].filter(Boolean).join(" ") || c.email}</option>)}
                        </select>
                      )}
                      <button type="submit" style={btn}>+ New proposal</button>
                    </form>
                    <ConfirmDelete action={deleteProjectAction} hidden={{ id: p.id, orgId }} label="Delete project" text={`Deletes ${p.name} and its ${own.length} proposal(s).`} guard={blocked ? { reason: `${own.filter(released).length} proposal(s) were released or signed.`, expectName: p.name, what: "the project name" } : null} />
                  </div>
                </details>
              );
            })}
            <form action={addProject} style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.7rem", paddingTop: "0.7rem", borderTop: "1px solid var(--edge)" }}>
              <input style={{ ...input, flex: "1 1 160px" }} name="name" required placeholder="Project name" />
              <input style={{ ...input, width: 80 }} name="pods" type="number" min="1" placeholder="Pods" />
              <input style={{ ...input, flex: "1 1 100%" }} name="description" placeholder="Description (optional)" />
              <button type="submit" style={btn}>+ Project</button>
            </form>
          </Panel>
        </div>

        <Panel label="Internal notes">
          <form action={addNote} style={{ display: "grid", gap: "0.5rem", marginBottom: "0.9rem" }}>
            <textarea name="body" rows={3} placeholder="Add a private note…" style={{ ...input, resize: "vertical" }} />
            <button type="submit" style={{ ...btn, justifySelf: "start" }}>Save note</button>
          </form>
          {notes.length === 0 ? <Empty>No notes.</Empty> : notes.map((n) => (
            <div key={n.id} style={{ padding: "0.5rem 0", borderTop: "1px solid var(--edge-faint)" }}>
              <p style={{ fontSize: 13, color: "var(--ink-strong)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{n.body}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                <p style={{ ...mono, fontSize: 8.5, color: "var(--ink-faint)" }}>{n.author} · {new Date(n.created_at).toLocaleDateString("en-US")}</p>
                <form action={deleteNoteAction} style={{ marginLeft: "auto" }}>
                  <input type="hidden" name="id" value={n.id} /><input type="hidden" name="orgId" value={orgId} />
                  <button type="submit" style={{ ...danger, padding: ".2rem .5rem", fontSize: 8.5 }} aria-label="Delete note"><Trash2 size={11} aria-hidden /> Delete</button>
                </form>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </OpsShell>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return <label style={{ display: "grid", gap: 3, fontSize: 11, color: "var(--ink-faint)", gridColumn: wide ? "1 / -1" : undefined }}>{label}{children}</label>;
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return <section style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", padding: "1.1rem 1.2rem" }}><p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", marginBottom: "0.6rem" }}>{label}</p>{children}</section>;
}
function Empty({ children }: { children: React.ReactNode }) { return <p style={{ fontSize: 13, color: "var(--ink-faint)" }}>{children}</p>; }
function StatusPill({ status }: { status: string }) {
  const tone = status === "signed" || status === "client_signed" || status === "won"
    ? { c: "#15803D", b: "rgba(34,197,94,.45)", bg: "rgba(34,197,94,.08)" }
    : status === "withdrawn" || status === "lost" || status === "declined"
      ? { c: "#B91C1C", b: "rgba(185,28,28,.35)", bg: "rgba(185,28,28,.06)" }
      : status === "viewed" ? { c: "var(--cyan-deep)", b: "rgba(34,211,238,.45)", bg: "rgba(34,211,238,.08)" }
      : { c: "var(--ink-dim)", b: "var(--edge-bright)", bg: "var(--glass-bg-strong)" };
  return <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", padding: ".2rem .5rem", borderRadius: 999, color: tone.c, border: `1px solid ${tone.b}`, background: tone.bg, whiteSpace: "nowrap" }}>{status.replace(/_/g, " ")}</span>;
}
