"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, FilePlus2, FileText, ListChecks, Mail, ShieldCheck, Wand2 } from "lucide-react";
import Drawer from "@/components/ops/ui/Drawer";
import s from "@/components/ops/ui/ops.module.css";
import { createProposalAction } from "./actions";

/**
 * NewProposalWizard — the "+ New Proposal" right-side drawer. Seven focused
 * steps; the final step submits ONE server action (createProposalAction) with
 * everything chosen. A proposal can only be created for an existing client's
 * project (the database enforces it), so the wizard never asks for free text.
 */

export interface OrgOpt { id: string; name: string }
export interface ProjectOpt { id: string; name: string; org_id: string | null }
export interface ContactOpt { id: string; organization_id: string; label: string; hasEmail: boolean }

const STEPS = ["Type", "Client", "Project", "Contact", "Build mode", "Access", "Review"];

export default function NewProposalWizard({ orgs, projects, contacts, initialOrgId }: { orgs: OrgOpt[]; projects: ProjectOpt[]; contacts: ContactOpt[]; initialOrgId?: string }) {
  const [step, setStep] = useState(0);
  const [pageMode, setPageMode] = useState<"preliminary" | "formal">("preliminary");
  const [orgId, setOrgId] = useState(initialOrgId && orgs.some((o) => o.id === initialOrgId) ? initialOrgId : orgs[0]?.id ?? "");
  const orgProjects = useMemo(() => projects.filter((p) => p.org_id === orgId), [projects, orgId]);
  const orgContacts = useMemo(() => contacts.filter((c) => c.organization_id === orgId), [contacts, orgId]);
  const [projectId, setProjectId] = useState("");
  const [contactId, setContactId] = useState("");
  const [mode, setMode] = useState<"client_configured" | "admin_built">("client_configured");
  const [policy, setPolicy] = useState<"email-confirm" | "otp">("email-confirm");
  const [inviteNow, setInviteNow] = useState(true);
  const project = orgProjects.find((p) => p.id === projectId) ?? orgProjects[0];
  const contact = orgContacts.find((c) => c.id === contactId);
  const org = orgs.find((o) => o.id === orgId);
  const canNext = step === 1 ? !!orgId : step === 2 ? !!project : true;

  const Choice = ({ active, onClick, icon, title, text }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; text: string }) => (
    <button type="button" onClick={onClick} className={`${s.choice}${active ? ` ${s.choiceActive}` : ""}`} aria-pressed={active}>
      <span className={`${s.kpiIcon} ${active ? s.toneCobalt : ""}`} style={{ width: 38, height: 38 }}>{icon}</span>
      <span style={{ textAlign: "left" }}><span className={s.choiceTitle}>{title}</span><span className={s.choiceText} style={{ display: "block" }}>{text}</span></span>
    </button>
  );

  return (
    <Drawer
      title="New proposal" subtitle="A proposal always belongs to a client's project. Seven quick steps."
      trigger={(open) => <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={open}><FilePlus2 size={16} aria-hidden /> New proposal</button>}
      footer={(close) => (
        <>
          <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => (step === 0 ? close() : setStep(step - 1))}><ChevronLeft size={16} aria-hidden /> {step === 0 ? "Cancel" : "Back"}</button>
          {step < STEPS.length - 1 ? (
            <button type="button" className={`${s.btn} ${s.btnPrimary}`} disabled={!canNext} onClick={() => setStep(step + 1)}>Continue <ChevronRight size={16} aria-hidden /></button>
          ) : (
            <button type="submit" form="new-proposal-form" className={`${s.btn} ${s.btnPrimary}`} disabled={!project}><FilePlus2 size={16} aria-hidden /> Create proposal</button>
          )}
        </>
      )}
    >
      <div className={s.steps} aria-label="Steps">
        {STEPS.map((label, i) => (
          <span key={label} className={`${s.step}${i === step ? ` ${s.stepActive}` : ""}${i < step ? ` ${s.stepDone}` : ""}`}><span className={s.stepDot}>{i < step ? <Check size={12} /> : i + 1}</span>{label}</span>
        ))}
      </div>

      {orgs.length === 0 && (
        <div className={s.notice}>Proposals belong to a client&apos;s project. <Link href="/ops/clients" style={{ color: "var(--ops-cobalt)", fontWeight: 600, marginLeft: 6 }}>Add the first client →</Link></div>
      )}

      {step === 0 && (
        <div style={{ display: "grid", gap: 10 }}>
          <p className={s.sectionTitle}>What are you sending first?</p>
          <Choice active={pageMode === "preliminary"} onClick={() => setPageMode("preliminary")} icon={<FileText size={18} />} title="Estimate" text="Indicative range while the configuration is being refined. Prints as ESTIMATE." />
          <Choice active={pageMode === "formal"} onClick={() => setPageMode("formal")} icon={<ShieldCheck size={18} />} title="Proposal" text="Formal, priced document ready for review and signature. Prints as PROPOSAL." />
        </div>
      )}

      {step === 1 && (
        <div style={{ display: "grid", gap: 10 }}>
          <p className={s.sectionTitle}>Client</p>
          <label className={s.field}>Company
            <select className={s.input} value={orgId} onChange={(e) => { setOrgId(e.target.value); setProjectId(""); setContactId(""); }}>
              {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </label>
          <p className={s.muted} style={{ fontSize: 13 }}>Need a new client? <Link href="/ops/clients" style={{ color: "var(--ops-cobalt)", fontWeight: 600 }}>Add it in Clients</Link>, then come back.</p>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: "grid", gap: 10 }}>
          <p className={s.sectionTitle}>Project</p>
          {orgProjects.length === 0 ? (
            <div className={s.notice}>{org?.name ?? "This client"} has no project yet. <Link href={`/ops/clients/${orgId}`} style={{ color: "var(--ops-cobalt)", fontWeight: 600, marginLeft: 6 }}>Add a project →</Link></div>
          ) : orgProjects.map((p) => (
            <Choice key={p.id} active={project?.id === p.id} onClick={() => setProjectId(p.id)} icon={<ListChecks size={18} />} title={p.name} text="Proposal will be filed under this project." />
          ))}
        </div>
      )}

      {step === 3 && (
        <div style={{ display: "grid", gap: 10 }}>
          <p className={s.sectionTitle}>Primary contact</p>
          <p className={s.muted} style={{ fontSize: 13 }}>The person who receives the secure link and signs. Optional now — you can invite later.</p>
          <label className={s.field}>Contact
            <select className={s.input} value={contactId} onChange={(e) => setContactId(e.target.value)}>
              <option value="">— none yet —</option>
              {orgContacts.map((c) => <option key={c.id} value={c.id} disabled={!c.hasEmail}>{c.label}{c.hasEmail ? "" : " (no email)"}</option>)}
            </select>
          </label>
        </div>
      )}

      {step === 4 && (
        <div style={{ display: "grid", gap: 10 }}>
          <p className={s.sectionTitle}>Who builds the configuration?</p>
          <Choice active={mode === "client_configured"} onClick={() => setMode("client_configured")} icon={<ListChecks size={18} />} title="The client builds it" text="Guided menu configurator; you review and release." />
          <Choice active={mode === "admin_built"} onClick={() => setMode("admin_built")} icon={<Wand2 size={18} />} title="PODOS builds it" text="You add the line items; the client reviews and signs." />
        </div>
      )}

      {step === 5 && (
        <div style={{ display: "grid", gap: 10 }}>
          <p className={s.sectionTitle}>Secure access</p>
          <Choice active={policy === "email-confirm"} onClick={() => setPolicy("email-confirm")} icon={<Mail size={18} />} title="Email confirmation" text="The contact confirms their email address to open the link." />
          <Choice active={policy === "otp"} onClick={() => setPolicy("otp")} icon={<ShieldCheck size={18} />} title="One-time code" text="A code is emailed on each visit. Requires email delivery to be configured." />
          <label className={s.field} style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 500 }}>
            <input type="checkbox" checked={inviteNow && !!contact} disabled={!contact} onChange={(e) => setInviteNow(e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--ops-cobalt)" }} />
            Issue the secure link to {contact ? contact.label : "the primary contact"} right away
          </label>
        </div>
      )}

      {step === 6 && (
        <form id="new-proposal-form" action={createProposalAction} style={{ display: "grid", gap: 10 }}>
          <p className={s.sectionTitle}>Review</p>
          <input type="hidden" name="orgId" value={orgId} />
          <input type="hidden" name="projectId" value={project?.id ?? ""} />
          <input type="hidden" name="contactId" value={contactId} />
          <input type="hidden" name="mode" value={mode} />
          <input type="hidden" name="pageMode" value={pageMode} />
          <input type="hidden" name="policy" value={policy} />
          <input type="hidden" name="inviteNow" value={inviteNow && contact ? "1" : "0"} />
          <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 16px", fontSize: 14 }}>
            <dt className={s.muted}>Document</dt><dd style={{ fontWeight: 600 }}>{pageMode === "formal" ? "Proposal" : "Estimate"}</dd>
            <dt className={s.muted}>Client</dt><dd style={{ fontWeight: 600 }}>{org?.name}</dd>
            <dt className={s.muted}>Project</dt><dd style={{ fontWeight: 600 }}>{project?.name}</dd>
            <dt className={s.muted}>Contact</dt><dd style={{ fontWeight: 600 }}>{contact?.label ?? "—"}</dd>
            <dt className={s.muted}>Build</dt><dd style={{ fontWeight: 600 }}>{mode === "admin_built" ? "PODOS builds the line items" : "Client builds via the menu"}</dd>
            <dt className={s.muted}>Access</dt><dd style={{ fontWeight: 600 }}>{policy === "otp" ? "One-time code" : "Email confirmation"}{inviteNow && contact ? " · link issued now" : ""}</dd>
          </dl>
          <p className={s.muted} style={{ fontSize: 13 }}>You land in the proposal editor next.</p>
        </form>
      )}
    </Drawer>
  );
}
