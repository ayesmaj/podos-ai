import { ChevronDown, Settings2, Undo2 } from "lucide-react";
import { ADMIN_SECRET, listProjects } from "@/lib/estimates/admin";
import { fmtDate, ops as s } from "@/components/ops/ui";
import { statusMeta } from "@/components/ops/ui/status";
import ConfirmDelete from "@/components/ops/ConfirmDelete";
import { deleteProposalAction, restoreProposalAction, setOutcomeAction, updateProposalAction, withdrawProposalAction } from "./actions";
import p from "./proposal.module.css";

/**
 * Proposal settings: edit the head (project, contact shown, validity, internal
 * notes), commercial outcome, withdraw / restore, delete. What is allowed
 * depends on the state — the database function is the authority; the UI only
 * hides what would be refused. Rendered as a collapsible rail panel.
 */

const RELEASED = new Set(["released", "signature_requested", "client_signed", "signed", "countersigned", "completed", "won", "lost", "declined", "expired"]);

export interface HeadLike { organization_id: string; project_id?: string | null; client_name: string; client_email?: string | null; expires_at: string | null; notes?: string | null; status: string; signed_at: string | null; revoked?: boolean }

export default async function ProposalSettings({ publicId, head, locked }: { publicId: string; head: HeadLike; locked: boolean }) {
  const projects = ((await listProjects(ADMIN_SECRET)) ?? []).filter((p) => p.org_id === head.organization_id);
  const releasedOnce = locked || RELEASED.has(head.status) || !!head.signed_at;
  const revoked = !!head.revoked;
  const expires = head.expires_at ? new Date(head.expires_at).toISOString().slice(0, 10) : "";

  return (
    <details id="settings" className={`${s.panel} ${s.panelTight} ${p.collapse}`}>
      <summary>
        <div style={{ minWidth: 0 }}>
          <h2 className={s.sectionTitle} style={{ display: "flex", alignItems: "center", gap: 8 }}><Settings2 size={16} color="var(--ops-cobalt)" aria-hidden /> Proposal settings</h2>
          <p className={s.panelSummary}>{revoked ? "Withdrawn" : statusMeta(head.status, { signedAt: head.signed_at }).label} · valid until {fmtDate(head.expires_at)}</p>
        </div>
        <ChevronDown size={18} className={p.chev} aria-hidden />
      </summary>
      <div className={p.collapseBody}>
        <form action={updateProposalAction} className={p.formGrid}>
          <input type="hidden" name="publicId" value={publicId} />
          <label className={s.field}>Project
            <select name="projectId" defaultValue={head.project_id ?? ""} className={s.input} disabled={!!head.signed_at}>
              {projects.map((pr) => <option key={pr.id} value={pr.id}>{pr.name}</option>)}
            </select>
          </label>
          <label className={s.field}>Valid until<input className={s.input} name="expiresAt" type="date" defaultValue={expires} /></label>
          <label className={`${s.field} ${p.span2}`}>Client name on the document<input className={s.input} name="clientName" defaultValue={head.client_name} /></label>
          <label className={`${s.field} ${p.span2}`}>Client email on the document<input className={s.input} name="clientEmail" type="email" defaultValue={head.client_email ?? ""} /></label>
          <label className={`${s.field} ${p.span2}`}>Internal notes (never shown to the client)<textarea className={s.input} name="notes" rows={2} defaultValue={head.notes ?? ""} /></label>
          <div className={p.span2}><button type="submit" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Save proposal</button></div>
        </form>

        <div className={`${p.actions} ${p.hr}`}>
          {releasedOnce && !revoked && (
            <form action={setOutcomeAction} className={p.actions}>
              <input type="hidden" name="publicId" value={publicId} />
              <span className={s.label}>Outcome</span>
              {head.signed_at && <button type="submit" name="outcome" value="won" className={`${s.btn} ${s.btnSecondary} ${s.btnXs}`} style={{ color: "#15803d" }}>Mark won</button>}
              <button type="submit" name="outcome" value="declined" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`}>Declined</button>
              <button type="submit" name="outcome" value="lost" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`}>Lost</button>
              <button type="submit" name="outcome" value="expired" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`}>Expired</button>
            </form>
          )}
          {!revoked ? (
            <div className={p.actions} style={{ marginLeft: "auto", alignItems: "flex-start" }}>
              {releasedOnce && (
                <details>
                  <summary className={`${s.btn} ${s.btnDanger} ${s.btnXs} ${p.plain}`}><Undo2 size={12} aria-hidden /> Withdraw</summary>
                  <form action={withdrawProposalAction} className={p.danger}>
                    <input type="hidden" name="publicId" value={publicId} />
                    <p>Withdraws the proposal from the client: every secure link stops working and the status becomes Withdrawn. Versions, the stored PDF and the activity trail are kept. You can restore it later.</p>
                    <input className={s.input} name="reason" placeholder="Reason (optional, internal)" />
                    <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name="confirm" required /> I understand</label>
                    <button type="submit" className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} style={{ justifySelf: "start" }}>Withdraw</button>
                  </form>
                </details>
              )}
              <ConfirmDelete
                action={deleteProposalAction} hidden={{ publicId }} label="Delete proposal"
                text={releasedOnce ? "Permanently deletes this proposal with its versions, stored PDF, links and activity." : "Permanently deletes this draft proposal, its line items, links and activity. It was never released to the client."}
                guard={releasedOnce ? { reason: `It was released${head.signed_at ? " and signed" : ""} by the client.`, expectName: publicId, what: "the proposal number" } : null}
              />
            </div>
          ) : (
            <form action={restoreProposalAction} style={{ marginLeft: "auto" }}>
              <input type="hidden" name="publicId" value={publicId} />
              <button type="submit" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Restore proposal</button>
            </form>
          )}
        </div>
      </div>
    </details>
  );
}
