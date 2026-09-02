"use client";

import { useId, type ReactNode } from "react";
import { FilePlus2, Pencil, Plus, StickyNote, UserPlus } from "lucide-react";
import Drawer from "@/components/ops/ui/Drawer";
import s from "@/components/ops/ui/ops.module.css";
import { createProposalAction } from "../../proposals/actions";
import { updateContactAction, updateOrgAction, updateProjectAction } from "./actions";

/**
 * Client-detail drawers. Every form posts to the SAME server action the page
 * used before (field names preserved verbatim); the page's inline actions
 * (addContact / addProject / addNote) arrive as props.
 */

type Action = (fd: FormData) => Promise<void>;
export interface ContactOpt { id: string; label: string }
export interface ProjectOpt { id: string; name: string }
export interface ContactRec { id: string; first_name: string | null; last_name: string | null; title: string | null; email: string | null; phone: string | null; contact_roles: string[] }
export interface ProjectRec { id: string; name: string; description: string | null; pod_quantity: number | null; required_capacity_mw: number | null; expected_gpus: number | null; workload: string | null; target_golive: string | null }
export interface OrgRec { id: string; name: string; legal_name: string | null; website: string | null; industry: string | null; country: string | null; notes: string | null }

const ROLES = ["commercial", "technical", "procurement", "legal", "signer", "billing"];
const TRIGGER = { primary: `${s.btn} ${s.btnPrimary}`, secondary: `${s.btn} ${s.btnSecondary}`, sm: `${s.btn} ${s.btnSecondary} ${s.btnSm}`, xs: `${s.btn} ${s.btnGhost} ${s.btnXs}` };
type Variant = keyof typeof TRIGGER;

function FormDrawer({ title, subtitle, trigger, variant = "sm", submit, action, children }: { title: string; subtitle?: string; trigger: ReactNode; variant?: Variant; submit: string; action: Action; children: ReactNode }) {
  const id = useId();
  return (
    <Drawer
      title={title} subtitle={subtitle}
      trigger={(open) => <button type="button" className={TRIGGER[variant]} onClick={open}>{trigger}</button>}
      footer={(close) => (
        <>
          <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={close}>Cancel</button>
          <button type="submit" form={id} className={`${s.btn} ${s.btnPrimary}`}>{submit}</button>
        </>
      )}
    >
      <form id={id} action={action} style={{ display: "grid", gap: 14 }}>{children}</form>
    </Drawer>
  );
}

const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 };

/* ---------- proposal ---------- */
export function NewProposalDrawer({ orgId, orgName, projects, contacts, projectId, variant = "primary" }: { orgId: string; orgName: string; projects: ProjectOpt[]; contacts: ContactOpt[]; projectId?: string; variant?: Variant }) {
  const fixed = projectId ? projects.find((p) => p.id === projectId) : undefined;
  return (
    <FormDrawer title="New proposal" subtitle={fixed ? `${orgName} · ${fixed.name}` : orgName} variant={variant} submit="Create proposal" action={createProposalAction}
      trigger={<><FilePlus2 size={variant === "xs" ? 13 : 16} aria-hidden /> New proposal</>}>
      <input type="hidden" name="orgId" value={orgId} />
      {fixed ? <input type="hidden" name="projectId" value={fixed.id} /> : (
        <label className={s.field}>Project
          {projects.length === 0
            ? <span className={s.muted} style={{ fontWeight: 450 }}>This client has no project yet — add one first; a proposal needs a project.</span>
            : <select className={s.input} name="projectId" required defaultValue={projects[0]?.id}>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>}
        </label>
      )}
      <fieldset style={{ border: 0, padding: 0, margin: 0, display: "grid", gap: 10 }}>
        <legend className={s.field} style={{ marginBottom: 10 }}>How the proposal is built</legend>
        <label className={s.choice}><input type="radio" name="mode" value="client_configured" defaultChecked /><span><span className={s.choiceTitle}>Client builds (menu)</span><span className={s.choiceText} style={{ display: "block" }}>The client configures their own requirements through the secure link.</span></span></label>
        <label className={s.choice}><input type="radio" name="mode" value="admin_built" /><span><span className={s.choiceTitle}>I build the line items</span><span className={s.choiceText} style={{ display: "block" }}>PODOS prepares the proposal; the client only reviews and signs.</span></span></label>
      </fieldset>
      {contacts.length > 0 && (
        <label className={s.field}>Primary contact
          <select className={s.input} name="contactId" defaultValue={contacts[0]?.id ?? ""}>{contacts.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
        </label>
      )}
    </FormDrawer>
  );
}

/* ---------- client record ---------- */
export function EditClientDrawer({ org, variant = "secondary" }: { org: OrgRec; variant?: Variant }) {
  return (
    <FormDrawer title="Edit client" subtitle="Company record used on every proposal." variant={variant} submit="Save client" action={updateOrgAction}
      trigger={<><Pencil size={variant === "xs" ? 13 : 16} aria-hidden /> Edit</>}>
      <input type="hidden" name="orgId" value={org.id} />
      <label className={s.field}>Company name<input className={s.input} name="name" required defaultValue={org.name} /></label>
      <label className={s.field}>Legal name<input className={s.input} name="legal_name" defaultValue={org.legal_name ?? ""} /></label>
      <label className={s.field}>Website<input className={s.input} name="website" defaultValue={org.website ?? ""} placeholder="https://" /></label>
      <div style={grid2}>
        <label className={s.field}>Industry<input className={s.input} name="industry" defaultValue={org.industry ?? ""} /></label>
        <label className={s.field}>Country<input className={s.input} name="country" defaultValue={org.country ?? ""} /></label>
      </div>
      <label className={s.field}>Internal notes<textarea className={s.input} name="notes" rows={3} defaultValue={org.notes ?? ""} /></label>
    </FormDrawer>
  );
}

/* ---------- contacts ---------- */
export function NewContactDrawer({ action }: { action: Action }) {
  return (
    <FormDrawer title="Add contact" subtitle="People at the client who can be invited to view or build proposals." submit="Add contact" action={action} variant="xs"
      trigger={<><UserPlus size={13} aria-hidden /> Add contact</>}>
      <div style={grid2}>
        <label className={s.field}>First name<input className={s.input} name="first" required autoFocus /></label>
        <label className={s.field}>Last name<input className={s.input} name="last" /></label>
      </div>
      <label className={s.field}>Title<input className={s.input} name="title" placeholder="CTO, Head of Infrastructure…" /></label>
      <label className={s.field}>Email<input className={s.input} name="email" type="email" /></label>
      <label className={s.field}>Phone<input className={s.input} name="phone" type="tel" /></label>
      <label className={s.field}>Role<select className={s.input} name="role" defaultValue="commercial">{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</select></label>
    </FormDrawer>
  );
}

export function EditContactDrawer({ orgId, contact }: { orgId: string; contact: ContactRec }) {
  const c = contact;
  return (
    <FormDrawer title="Edit contact" subtitle="Unsigned proposals addressed to this person follow the change." submit="Save contact" action={updateContactAction} variant="xs"
      trigger={<><Pencil size={13} aria-hidden /> Edit</>}>
      <input type="hidden" name="id" value={c.id} /><input type="hidden" name="orgId" value={orgId} />
      <div style={grid2}>
        <label className={s.field}>First name<input className={s.input} name="first" required defaultValue={c.first_name ?? ""} /></label>
        <label className={s.field}>Last name<input className={s.input} name="last" defaultValue={c.last_name ?? ""} /></label>
      </div>
      <label className={s.field}>Title<input className={s.input} name="title" defaultValue={c.title ?? ""} /></label>
      <label className={s.field}>Email<input className={s.input} name="email" type="email" defaultValue={c.email ?? ""} /></label>
      <label className={s.field}>Phone<input className={s.input} name="phone" type="tel" defaultValue={c.phone ?? ""} /></label>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className={s.field} style={{ marginBottom: 8 }}>Roles</legend>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {ROLES.map((r) => <label key={r} style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 13.5 }}><input type="checkbox" name="roles" value={r} defaultChecked={c.contact_roles.includes(r)} /> {r}</label>)}
        </div>
      </fieldset>
    </FormDrawer>
  );
}

/* ---------- projects ---------- */
export function NewProjectDrawer({ action }: { action: Action }) {
  return (
    <FormDrawer title="Add project" subtitle="A site or phase the client wants priced. Every proposal belongs to a project." submit="Add project" action={action} variant="xs"
      trigger={<><Plus size={13} aria-hidden /> Add project</>}>
      <label className={s.field}>Project name<input className={s.input} name="name" required autoFocus placeholder="Pod cluster A" /></label>
      <label className={s.field}>Pods<input className={s.input} name="pods" type="number" min={1} placeholder="12" /></label>
      <label className={s.field}>Description (optional)<input className={s.input} name="description" /></label>
    </FormDrawer>
  );
}

export function EditProjectDrawer({ orgId, project }: { orgId: string; project: ProjectRec }) {
  const p = project;
  return (
    <FormDrawer title="Edit project" subtitle="Its proposals show the new name." submit="Save project" action={updateProjectAction} variant="xs"
      trigger={<><Pencil size={13} aria-hidden /> Edit</>}>
      <input type="hidden" name="id" value={p.id} /><input type="hidden" name="orgId" value={orgId} />
      <label className={s.field}>Name<input className={s.input} name="name" required defaultValue={p.name} /></label>
      <div style={grid2}>
        <label className={s.field}>Pods<input className={s.input} name="pods" type="number" min={1} defaultValue={p.pod_quantity ?? ""} /></label>
        <label className={s.field}>Capacity (MW)<input className={s.input} name="capacity_mw" type="number" step="0.1" min={0} defaultValue={p.required_capacity_mw ?? ""} /></label>
        <label className={s.field}>GPU positions<input className={s.input} name="gpus" type="number" min={0} defaultValue={p.expected_gpus ?? ""} /></label>
        <label className={s.field}>Target go-live<input className={s.input} name="golive" type="date" defaultValue={p.target_golive ?? ""} /></label>
      </div>
      <label className={s.field}>Workload<input className={s.input} name="workload" defaultValue={p.workload ?? ""} /></label>
      <label className={s.field}>Description<input className={s.input} name="description" defaultValue={p.description ?? ""} /></label>
    </FormDrawer>
  );
}

/* ---------- notes ---------- */
export function NewNoteDrawer({ action }: { action: Action }) {
  return (
    <FormDrawer title="Add note" subtitle="Private to PODOS — never shown to the client." submit="Save note" action={action} variant="xs"
      trigger={<><StickyNote size={13} aria-hidden /> Add note</>}>
      <label className={s.field}>Note<textarea className={s.input} name="body" rows={5} required autoFocus placeholder="Call summary, decision, next step…" /></label>
    </FormDrawer>
  );
}
