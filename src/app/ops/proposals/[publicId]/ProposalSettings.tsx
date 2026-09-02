import { Settings2, Trash2 } from "lucide-react";
import { ADMIN_SECRET, listProjects } from "@/lib/estimates/admin";
import { deleteProposalAction, restoreProposalAction, setOutcomeAction, updateProposalAction, withdrawProposalAction } from "./actions";

/**
 * Proposal settings: edit the head (project, contact shown, validity, internal
 * notes), commercial outcome, withdraw / restore, delete. What is allowed
 * depends on the state — the database function is the authority; the UI only
 * hides what would be refused.
 */

const mono = { fontFamily: "var(--font-display)", letterSpacing: ".06em", textTransform: "uppercase" as const };
const input: React.CSSProperties = { padding: ".45rem .6rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", fontSize: 13, fontFamily: "inherit", minWidth: 0 };
const btn: React.CSSProperties = { ...mono, fontSize: 10, padding: ".5rem .8rem", borderRadius: 8, border: "1px solid var(--brand)", background: "var(--brand-wash)", color: "var(--brand-deep)", cursor: "pointer" };
const ghost: React.CSSProperties = { ...mono, fontSize: 9.5, padding: ".4rem .7rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", cursor: "pointer" };
const RELEASED = new Set(["released", "signature_requested", "client_signed", "signed", "countersigned", "completed", "won", "lost", "declined", "expired"]);

export interface HeadLike { organization_id: string; project_id?: string | null; client_name: string; client_email?: string | null; expires_at: string | null; notes?: string | null; status: string; signed_at: string | null; revoked?: boolean }

export default async function ProposalSettings({ publicId, head, locked }: { publicId: string; head: HeadLike; locked: boolean }) {
  const projects = ((await listProjects(ADMIN_SECRET)) ?? []).filter((p) => p.org_id === head.organization_id);
  const releasedOnce = locked || RELEASED.has(head.status) || !!head.signed_at;
  const revoked = !!head.revoked;
  const expires = head.expires_at ? new Date(head.expires_at).toISOString().slice(0, 10) : "";

  return (
    <details style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", marginBottom: "1.2rem" }}>
      <summary style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", padding: ".9rem 1.2rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, listStyle: "none" }}>
        <Settings2 size={14} aria-hidden /> Proposal settings · {revoked ? "withdrawn" : head.status.replace(/_/g, " ")} · valid until {head.expires_at ? new Date(head.expires_at).toLocaleDateString("en-US") : "—"}
      </summary>
      <div style={{ padding: "0 1.2rem 1.2rem", display: "grid", gap: "1rem" }}>
        <form action={updateProposalAction} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: ".6rem" }}>
          <input type="hidden" name="publicId" value={publicId} />
          <label style={{ display: "grid", gap: 3, fontSize: 11, color: "var(--ink-faint)" }}>Project
            <select name="projectId" defaultValue={head.project_id ?? ""} style={input} disabled={!!head.signed_at}>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label style={{ display: "grid", gap: 3, fontSize: 11, color: "var(--ink-faint)" }}>Client name on the document<input style={input} name="clientName" defaultValue={head.client_name} /></label>
          <label style={{ display: "grid", gap: 3, fontSize: 11, color: "var(--ink-faint)" }}>Client email on the document<input style={input} name="clientEmail" type="email" defaultValue={head.client_email ?? ""} /></label>
          <label style={{ display: "grid", gap: 3, fontSize: 11, color: "var(--ink-faint)" }}>Valid until<input style={input} name="expiresAt" type="date" defaultValue={expires} /></label>
          <label style={{ display: "grid", gap: 3, fontSize: 11, color: "var(--ink-faint)", gridColumn: "1 / -1" }}>Internal notes (never shown to the client)<textarea style={{ ...input, resize: "vertical" }} name="notes" rows={2} defaultValue={head.notes ?? ""} /></label>
          <div><button type="submit" style={btn}>Save proposal</button></div>
        </form>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", paddingTop: ".8rem", borderTop: "1px solid var(--edge)" }}>
          {releasedOnce && !revoked && (
            <form action={setOutcomeAction} style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input type="hidden" name="publicId" value={publicId} />
              <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>Outcome</span>
              {head.signed_at && <button type="submit" name="outcome" value="won" style={{ ...ghost, color: "#15803D", borderColor: "rgba(34,197,94,.45)" }}>Mark won</button>}
              <button type="submit" name="outcome" value="declined" style={ghost}>Declined</button>
              <button type="submit" name="outcome" value="lost" style={ghost}>Lost</button>
              <button type="submit" name="outcome" value="expired" style={ghost}>Expired</button>
            </form>
          )}
          {!revoked ? (
            <details style={{ marginLeft: "auto" }}>
              <summary style={{ ...ghost, listStyle: "none", color: "#B91C1C", borderColor: "rgba(185,28,28,.35)", display: "inline-flex", alignItems: "center", gap: 5 }}><Trash2 size={12} aria-hidden /> {releasedOnce ? "Withdraw proposal" : "Delete proposal"}</summary>
              <form action={releasedOnce ? withdrawProposalAction : deleteProposalAction} style={{ marginTop: 8, padding: ".7rem .9rem", border: "1px solid rgba(185,28,28,.35)", borderRadius: 10, background: "rgba(185,28,28,.04)", display: "grid", gap: 8, maxWidth: 520 }}>
                <input type="hidden" name="publicId" value={publicId} />
                <p style={{ fontSize: 12.5, color: "#7f1d1d", lineHeight: 1.5 }}>
                  {releasedOnce
                    ? "Withdraws the proposal from the client: every secure link stops working and the status becomes withdrawn. Versions, the stored PDF and the activity trail are kept. You can restore it later."
                    : "Permanently deletes this draft proposal, its line items, links and activity. It was never released to the client."}
                </p>
                {releasedOnce && <input style={input} name="reason" placeholder="Reason (optional, internal)" />}
                <label style={{ fontSize: 12.5, color: "var(--ink-dim)", display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name="confirm" required /> I understand</label>
                <button type="submit" style={{ ...mono, fontSize: 10, padding: ".5rem .8rem", borderRadius: 8, border: "none", background: "#B91C1C", color: "#fff", cursor: "pointer", justifySelf: "start" }}>{releasedOnce ? "Withdraw" : "Delete"}</button>
              </form>
            </details>
          ) : (
            <form action={restoreProposalAction} style={{ marginLeft: "auto" }}>
              <input type="hidden" name="publicId" value={publicId} />
              <button type="submit" style={btn}>Restore proposal</button>
            </form>
          )}
        </div>
      </div>
    </details>
  );
}
