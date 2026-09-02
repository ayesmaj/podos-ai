import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Archive, ArchiveRestore, DollarSign, FileText, FolderKanban, Info, MoreHorizontal, ShieldCheck, StickyNote, Trash2, Users } from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, addOrgNote, createContact, createProject, getOrganization } from "@/lib/estimates/admin";
import { AppShell, Avatar, Chip, KpiCard, KpiGrid, Panel, PanelLink, StatusChip, compact, fmtDate, ops as s, usd } from "@/components/ops/ui";
import { isOpenProposal } from "@/components/ops/ui/status";
import AdminResult from "@/components/ops/AdminResult";
import ConfirmDelete from "@/components/ops/ConfirmDelete";
import { deleteContactAction, deleteNoteAction, deleteOrgAction, deleteProjectAction, archiveOrgAction } from "./actions";
import { EditClientDrawer, EditContactDrawer, EditProjectDrawer, NewContactDrawer, NewNoteDrawer, NewProjectDrawer, NewProposalDrawer } from "./ClientDrawers";
import c from "./client.module.css";

/**
 * /ops/clients/[orgId] — client detail (archetype 3): identity header · 4 KPIs ·
 * 8/4 split. Main panel = proposals, contacts, projects, notes as compact rows;
 * every create/edit form lives in a drawer posting to the same server actions.
 * Rail = facts, secure-access summary, internal notes. Safety rules are enforced
 * by the database functions and echoed in the UI (typed-name guards).
 */

export const metadata: Metadata = { title: "Client · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const RELEASED = new Set(["released", "signature_requested", "client_signed", "signed", "countersigned", "completed", "won"]);

interface Contact { id: string; first_name: string | null; last_name: string | null; title: string | null; email: string | null; phone: string | null; contact_roles: string[] }
interface Project { id: string; name: string; description: string | null; pod_quantity: number | null; required_capacity_mw: number | null; expected_gpus: number | null; workload: string | null; target_golive: string | null }
interface Proposal { public_id: string; estimate_no: string; project_name: string | null; project_id: string | null; status: string; revoked: boolean; locked: boolean; view_count: number; one_time_low_cents: number; one_time_high_cents: number; signed_at: string | null }
interface Note { id: string; body: string; author: string; created_at: string }
interface Org { id: string; name: string; legal_name: string | null; website: string | null; industry: string | null; country: string | null; notes: string | null; archived_at: string | null; created_at: string }
interface OrgFull { org: Org; contacts: Contact[]; projects: Project[]; proposals: Proposal[]; notes: Note[] }

const released = (p: Proposal) => p.signed_at != null || p.locked || RELEASED.has(p.status);
const fullName = (x: Contact) => [x.first_name, x.last_name].filter(Boolean).join(" ") || x.email || "Contact";
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
const host = (u: string | null) => u?.replace(/^https?:\/\//, "").replace(/\/$/, "") ?? null;
const range = (p: Proposal) => p.one_time_high_cents > 0 ? (p.one_time_low_cents === p.one_time_high_cents ? usd(p.one_time_high_cents) : `${usd(p.one_time_low_cents)} – ${usd(p.one_time_high_cents)}`) : "—";

export default async function ClientDetail({ params }: { params: Promise<{ orgId: string }> }) {
  await requireOps();
  const { orgId } = await params;
  if (!UUID_RE.test(orgId)) notFound();
  const data = (await getOrganization(ADMIN_SECRET, orgId)) as OrgFull | null;
  if (!data?.org) notFound();
  const { org, contacts, projects, proposals, notes } = data;
  const releasedCount = proposals.filter(released).length;
  const open = proposals.filter(isOpenProposal);
  const openValue = open.reduce((a, p) => a + p.one_time_high_cents, 0);
  const withEmail = contacts.filter((x) => x.email).length;
  const pods = projects.reduce((a, p) => a + (p.pod_quantity ?? 0), 0);
  const contactOpts = contacts.map((x) => ({ id: x.id, label: `${fullName(x)}${x.email ? ` · ${x.email}` : ""}` }));
  const projectOpts = projects.map((p) => ({ id: p.id, name: p.name }));
  const meta = [host(org.website), org.industry, org.country, `client since ${fmtDate(org.created_at)}`].filter(Boolean).join(" · ");

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
    <AppShell active="/ops/clients" crumbs={[{ label: "Clients", href: "/ops/clients" }, { label: org.name }]}>
      <header className={s.pageHeader}>
        <div style={{ minWidth: 0 }}>
          <p className={c.crumb}><Link href="/ops/clients">Clients</Link> / {org.name}</p>
          <div className={c.identity}>
            <Avatar name={org.name} />
            <div style={{ minWidth: 0 }}>
              <div className={c.titleRow}>
                <h1 className={s.pageTitle}>{org.name}</h1>
                {org.archived_at && <Chip tone="muted" title={`Archived ${fmtDate(org.archived_at)}`}><Archive size={12} aria-hidden /> Archived</Chip>}
              </div>
              <p className={c.metaLine}>{meta}</p>
            </div>
          </div>
        </div>
        <div className={s.pageActions}>
          <NewProposalDrawer orgId={orgId} orgName={org.name} projects={projectOpts} contacts={contactOpts} />
          <EditClientDrawer org={org} />
          <details className={c.menu}>
            <summary className={`${s.btn} ${s.btnSecondary}`} aria-label="More actions" title="Archive or delete"><MoreHorizontal size={18} aria-hidden /></summary>
            <div className={c.menuBody}>
              <form action={archiveOrgAction} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <input type="hidden" name="orgId" value={orgId} />
                <input type="hidden" name="archived" value={org.archived_at ? "0" : "1"} />
                <span className={c.railText}>{org.archived_at ? "Restore the client to the pickers." : "Hide from new-proposal pickers; existing proposals untouched."}</span>
                <button type="submit" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>{org.archived_at ? <><ArchiveRestore size={14} aria-hidden /> Restore</> : <><Archive size={14} aria-hidden /> Archive</>}</button>
              </form>
              <ConfirmDelete
                action={deleteOrgAction} hidden={{ orgId }} label="Delete client"
                text={`Permanently deletes ${org.name}, its ${contacts.length} contact(s), ${projects.length} project(s) and ${proposals.length} proposal(s).`}
                guard={releasedCount > 0 ? { reason: `${releasedCount} proposal(s) were released or signed.`, expectName: org.name, what: "the company name" } : null}
              />
            </div>
          </details>
        </div>
      </header>
      <AdminResult />

      <div className={c.kpi4}>
        <KpiGrid>
          <KpiCard icon={<DollarSign size={20} strokeWidth={1.8} />} label="Open value" value={openValue > 0 ? compact(openValue) : "—"} context={openValue > 0 ? usd(openValue) : "no priced open proposal"} tone="green" />
          <KpiCard icon={<FileText size={20} strokeWidth={1.8} />} label="Proposals" value={proposals.length} context={`${open.length} open · ${releasedCount} released or signed`} />
          <KpiCard icon={<FolderKanban size={20} strokeWidth={1.8} />} label="Projects" value={projects.length} context={pods > 0 ? `${plural(pods, "pod")} requested in total` : "no pod count yet"} tone="cyan" />
          <KpiCard icon={<Users size={20} strokeWidth={1.8} />} label="Contacts" value={contacts.length} context={`${withEmail} with an email address`} tone="purple" />
        </KpiGrid>
      </div>

      <div className={s.split84}>
        <Panel tight>
          <nav className={c.tabs} aria-label="Sections">
            <a href="#proposals">Proposals <b>{proposals.length}</b></a>
            <a href="#contacts">Contacts <b>{contacts.length}</b></a>
            <a href="#projects">Projects <b>{projects.length}</b></a>
            <a href="#notes">Notes <b>{notes.length}</b></a>
          </nav>

          <section id="proposals" className={c.section}>
            <div className={c.sectionHead}>
              <h3>Proposals <span>{proposals.length}</span></h3>
              <PanelLink href="/ops/proposals">All proposals</PanelLink>
            </div>
            {proposals.length === 0 ? <p className={c.sectionEmpty}>No proposals yet — use “New proposal” above{projects.length === 0 ? " once a project exists" : ""}.</p> : proposals.map((p) => (
              <div key={p.public_id} className={c.row} style={p.revoked ? { opacity: 0.65 } : undefined}>
                <div className={c.rowMain}>
                  <Link href={`/ops/proposals/${p.public_id}`} className={c.rowTitle}><span>{p.project_name ?? "Untitled project"}</span></Link>
                  <p className={c.rowSub}><span className={s.mono}>{p.public_id}</span><span className={s.mono}>{p.estimate_no}</span>{p.view_count > 0 ? <span>viewed {p.view_count}×</span> : <span className={s.muted}>not opened yet</span>}</p>
                </div>
                <div className={c.rowSide}>
                  <StatusChip status={p.status} revoked={p.revoked} signedAt={p.signed_at} />
                  <span className={c.money}>{range(p)}</span>
                </div>
              </div>
            ))}
          </section>

          <section id="contacts" className={c.section}>
            <div className={c.sectionHead}>
              <h3>Contacts <span>{contacts.length}</span></h3>
              <NewContactDrawer action={addContact} />
            </div>
            {contacts.length === 0 ? <p className={c.sectionEmpty}>No contacts yet. Someone with an email address is needed before a proposal can be shared.</p> : contacts.map((x) => (
              <div key={x.id} className={c.row}>
                <div className={c.rowMain}>
                  <p className={c.rowTitle}><span>{fullName(x)}</span>{x.title && <span className={s.muted} style={{ fontWeight: 450 }}>· {x.title}</span>}</p>
                  <p className={c.rowSub}>
                    {x.email ? <a href={`mailto:${x.email}`}>{x.email}</a> : <span className={s.muted}>no email — cannot be invited</span>}
                    {x.phone && <span>{x.phone}</span>}
                    {x.contact_roles.length > 0 && <span className={c.roles}>{x.contact_roles.map((r) => <span key={r} className={c.role}>{r}</span>)}</span>}
                  </p>
                </div>
                <div className={c.rowSide}>
                  <EditContactDrawer orgId={orgId} contact={x} />
                  <ConfirmDelete compact action={deleteContactAction} hidden={{ id: x.id, orgId }} label="Remove" text={`Removes ${fullName(x)} and revokes every secure link issued to ${x.email ?? "them"}.`} guard={null} />
                </div>
              </div>
            ))}
          </section>

          <section id="projects" className={c.section}>
            <div className={c.sectionHead}>
              <h3>Projects <span>{projects.length}</span></h3>
              <NewProjectDrawer action={addProject} />
            </div>
            {projects.length === 0 ? <p className={c.sectionEmpty}>No projects yet — a proposal needs a project; add one to get started.</p> : projects.map((p) => {
              const own = proposals.filter((x) => x.project_id === p.id);
              const blocked = own.filter(released).length;
              const facts = [p.pod_quantity ? plural(p.pod_quantity, "pod") : null, p.required_capacity_mw ? `${p.required_capacity_mw} MW` : null, p.expected_gpus ? `${p.expected_gpus.toLocaleString("en-US")} GPUs` : null, p.target_golive ? `go-live ${fmtDate(p.target_golive)}` : null, plural(own.length, "proposal")].filter(Boolean);
              return (
                <div key={p.id} id={`project-${p.id}`} className={c.row} style={{ scrollMarginTop: 80 }}>
                  <div className={c.rowMain}>
                    <p className={c.rowTitle}><span>{p.name}</span></p>
                    <p className={c.rowSub}>{facts.map((f, i) => <span key={i}>{f}</span>)}</p>
                    {p.description && <p className={c.rowSub} style={{ display: "block" }}>{p.description}</p>}
                  </div>
                  <div className={c.rowSide}>
                    <NewProposalDrawer orgId={orgId} orgName={org.name} projects={projectOpts} contacts={contactOpts} projectId={p.id} variant="xs" />
                    <EditProjectDrawer orgId={orgId} project={p} />
                    <ConfirmDelete compact action={deleteProjectAction} hidden={{ id: p.id, orgId }} label="Delete" text={`Deletes ${p.name} and its ${own.length} proposal(s).`} guard={blocked > 0 ? { reason: `${blocked} proposal(s) were released or signed.`, expectName: p.name, what: "the project name" } : null} />
                  </div>
                </div>
              );
            })}
          </section>

          <section id="notes" className={c.section}>
            <div className={c.sectionHead}>
              <h3>Notes <span>{notes.length}</span></h3>
              <NewNoteDrawer action={addNote} />
            </div>
            {notes.length === 0 ? <p className={c.sectionEmpty}>No notes yet. Notes are private to PODOS.</p> : notes.map((n) => (
              <div key={n.id} className={c.note}>
                <div style={{ minWidth: 0 }}>
                  <p className={c.noteBody}>{n.body}</p>
                  <p className={c.noteMeta}>{n.author} · <span title={new Date(n.created_at).toISOString()}>{fmtDate(n.created_at)}</span></p>
                </div>
                <form action={deleteNoteAction}>
                  <input type="hidden" name="id" value={n.id} /><input type="hidden" name="orgId" value={orgId} />
                  <button type="submit" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`} aria-label="Delete note"><Trash2 size={13} aria-hidden /> Delete</button>
                </form>
              </div>
            ))}
          </section>
        </Panel>

        <aside className={s.rail}>
          <Panel title="Facts" icon={<Info size={18} aria-hidden />} tight action={<EditClientDrawer org={org} variant="xs" />}>
            <dl className={c.facts}>
              <div><dt>Legal name</dt><dd>{org.legal_name ?? <span className={s.muted}>—</span>}</dd></div>
              <div><dt>Website</dt><dd>{org.website ? <a href={org.website.startsWith("http") ? org.website : `https://${org.website}`} target="_blank" rel="noopener">{host(org.website)}</a> : <span className={s.muted}>—</span>}</dd></div>
              <div><dt>Industry</dt><dd>{org.industry ?? <span className={s.muted}>—</span>}</dd></div>
              <div><dt>Country</dt><dd>{org.country ?? <span className={s.muted}>—</span>}</dd></div>
              <div><dt>Created</dt><dd>{fmtDate(org.created_at)}</dd></div>
              {org.archived_at && <div><dt>Archived</dt><dd>{fmtDate(org.archived_at)}</dd></div>}
            </dl>
          </Panel>

          <Panel title="Secure access" icon={<ShieldCheck size={18} aria-hidden />} tight action={<PanelLink href="/ops/proposals">Proposals</PanelLink>}>
            <p className={c.railBig}>{withEmail}</p>
            <p className={c.railText} style={{ marginTop: 4 }}>{withEmail === 1 ? "contact can be invited" : "contacts can be invited"} · {contacts.length - withEmail} without an email</p>
            <p className={c.railText} style={{ marginTop: 14 }}>Secure links are issued per proposal and are not loaded on this page. Grant or revoke access from each proposal in Proposals.</p>
          </Panel>

          <Panel title="Internal notes" icon={<StickyNote size={18} aria-hidden />} tight action={<a href="#notes" className={s.panelAction}>Timeline</a>}>
            {org.notes ? <p className={c.noteBody}>{org.notes}</p> : <p className={c.railText}>No standing note on this client. Add one via Edit; dated notes live in the timeline.</p>}
            <p className={c.noteMeta} style={{ marginTop: 10 }}>Company record · {plural(notes.length, "dated note")}</p>
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}
