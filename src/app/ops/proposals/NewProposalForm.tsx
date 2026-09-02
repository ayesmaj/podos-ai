"use client";

/**
 * NewProposalForm — creates a proposal ONLY for an existing client's project.
 * Client → project (filtered to that client) → optional primary contact.
 * No free-text names: the database refuses a proposal without a client and
 * project, so the form cannot express one. Redirects into the editor.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import { createProposalAction } from "./actions";
import s from "@/components/private/private.module.css";

export interface OrgOpt { id: string; name: string; }
export interface ProjectOpt { id: string; name: string; org_id: string | null; }
export interface ContactOpt { id: string; organization_id: string; label: string; }

export default function NewProposalForm({ orgs, projects, contacts }: { orgs: OrgOpt[]; projects: ProjectOpt[]; contacts: ContactOpt[] }) {
  const [orgId, setOrgId] = useState(orgs[0]?.id ?? "");
  const orgProjects = useMemo(() => projects.filter((p) => p.org_id === orgId), [projects, orgId]);
  const orgContacts = useMemo(() => contacts.filter((c) => c.organization_id === orgId), [contacts, orgId]);
  const [projectId, setProjectId] = useState(orgProjects[0]?.id ?? "");
  const validProject = orgProjects.some((p) => p.id === projectId) ? projectId : (orgProjects[0]?.id ?? "");

  if (orgs.length === 0) {
    return (
      <div id="new" className={s.panel} style={{ padding: "1.1rem 1.2rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <p className={s.body}>Proposals belong to a client&apos;s project. Create the client first.</p>
        <Link href="/ops/clients" className={`${s.btn} ${s.btnPrimary}`} style={{ minHeight: 40, fontSize: 13.5 }}>Add the first client →</Link>
      </div>
    );
  }

  const field: React.CSSProperties = { padding: "0.55rem 0.7rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", fontSize: 13.5, fontFamily: "inherit", minHeight: 40, minWidth: 0 };

  return (
    <form id="new" action={createProposalAction} className={s.panel} style={{ padding: "1.1rem 1.2rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0.7rem", alignItems: "end" }}>
      <label style={{ display: "grid", gap: 4 }}>
        <span className={s.label}>Client</span>
        <select name="orgId" value={orgId} onChange={(e) => setOrgId(e.target.value)} style={field} required>
          {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </label>
      <label style={{ display: "grid", gap: 4 }}>
        <span className={s.label}>Project</span>
        {orgProjects.length === 0 ? (
          <Link href={`/ops/clients/${orgId}`} className={`${s.btn} ${s.btnSecondary}`} style={{ minHeight: 40, fontSize: 13 }}>Add a project to this client →</Link>
        ) : (
          <select name="projectId" value={validProject} onChange={(e) => setProjectId(e.target.value)} style={field} required>
            {orgProjects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        )}
      </label>
      <label style={{ display: "grid", gap: 4 }}>
        <span className={s.label}>Primary contact (optional)</span>
        <select name="contactId" defaultValue="" style={field}>
          <option value="">—</option>
          {orgContacts.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </label>
      <button type="submit" disabled={orgProjects.length === 0} className={`${s.btn} ${s.btnPrimary}`} style={{ minHeight: 40, fontSize: 13.5 }}>
        <FilePlus2 size={15} aria-hidden /> Create proposal
      </button>
    </form>
  );
}
