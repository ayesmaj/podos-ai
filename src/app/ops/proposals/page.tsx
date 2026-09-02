import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Send, ShieldCheck, Trash2 } from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import {
  ADMIN_SECRET, listContacts, listEstimates, listInvitations, listOrganizations, listProjects, usd,
  type EstimateRow, type InvitationRow,
} from "@/lib/estimates/admin";
import { SITE } from "@/lib/seo/site";
import OpsShell from "@/components/ops/OpsShell";
import NewProposalForm from "./NewProposalForm";
import { dismissInviteReveal, inviteContactAction, revokeInvitationAction } from "./actions";
import s from "@/components/private/private.module.css";

/**
 * /ops/proposals — every proposal, each bound to a client and a project
 * (the database enforces it). New proposals are created for an existing
 * client's project; invitations go only to that client's contacts. There is
 * no legacy whole-proposal link any more — access is per-person.
 */

export const metadata: Metadata = { title: "Proposals · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString("en-US") : "—");
const label: React.CSSProperties = { fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" };

function StatusPill({ r }: { r: EstimateRow }) {
  const st = r.revoked ? "revoked" : r.signed_at ? "signed" : r.status;
  const cls = st === "signed" || st === "client_signed" ? s.chipOk
    : st === "viewed" || st === "client_configuring" ? s.chipCyan
    : st === "client_submitted" || st === "engineering_review" ? s.chipAmber
    : st === "released" || st === "signature_requested" ? s.chipBrand : "";
  return <span className={`${s.chip} ${cls}`}>{st.replace(/_/g, " ")}</span>;
}

async function NewInviteReveal() {
  const jar = await cookies();
  const raw = jar.get("podos_new_invite")?.value;
  if (!raw) return null;
  const [estimateNo, token, status, detail] = raw.split("|");
  const sent = status === "sent";
  return (
    <div className={s.panel} style={{ marginTop: "1rem", padding: "1rem 1.2rem", borderColor: sent ? "rgba(34,197,94,.45)" : "rgba(180,83,9,.4)", background: sent ? "rgba(34,197,94,.07)" : "rgba(180,83,9,.06)" }}>
      <p className={s.label} style={{ color: sent ? "#15803D" : "#B45309" }}>
        Invitation for {estimateNo} · {sent ? `emailed to ${detail}` : `email NOT sent — ${detail}`}
      </p>
      <p className={s.help} style={{ marginTop: 4 }}>{sent ? "The link is also shown here once, in case you want to forward it yourself:" : "Send the client this personal link yourself (shown only once):"}</p>
      <code style={{ display: "block", marginTop: ".5rem", fontSize: 12.5, wordBreak: "break-all", color: "var(--ink-strong)" }}>{SITE.baseUrl}/e/{token}</code>
      <form action={dismissInviteReveal}><button type="submit" className={`${s.btn} ${s.btnSecondary}`} style={{ marginTop: ".6rem", minHeight: 34, fontSize: 12 }}>I have copied it</button></form>
    </div>
  );
}

export default async function ProposalsPage() {
  await requireOps();
  const [rows, orgs, projects, contacts] = await Promise.all([
    listEstimates(ADMIN_SECRET), listOrganizations(ADMIN_SECRET), listProjects(ADMIN_SECRET), listContacts(ADMIN_SECRET),
  ]);
  const estimates = rows ?? [];
  const invitations = new Map<string, InvitationRow[]>();
  for (const r of estimates) invitations.set(r.estimate_no, (await listInvitations(ADMIN_SECRET, r.estimate_no)) ?? []);
  const contactOpts = (contacts ?? []).map((c) => ({
    id: c.id, organization_id: c.organization_id,
    label: `${[c.first_name, c.last_name].filter(Boolean).join(" ") || "Contact"}${c.email ? ` · ${c.email}` : " · no email"}`,
    hasEmail: !!c.email,
  }));
  const orgName = new Map((orgs ?? []).map((o) => [o.id, o.name]));

  const openValue = estimates.filter((r) => !r.revoked && !["signed", "client_signed", "declined", "expired", "won", "lost", "archived"].includes(r.status)).reduce((a, r) => a + r.one_time_high_cents, 0);

  return (
    <OpsShell active="/ops/proposals" title="Proposals" actions={<Link href="/ops/clients" className={`${s.btn} ${s.btnSecondary}`} style={{ minHeight: 40, fontSize: 13.5 }}>Clients</Link>}>
      <div className={s.root} style={{ minHeight: 0, background: "transparent" }}>
        <div style={{ display: "flex", gap: "1.4rem", flexWrap: "wrap", marginTop: "-0.8rem", marginBottom: "1rem" }}>
          <span className={s.label}>{estimates.length} total</span>
          <span className={s.label}>{estimates.filter((r) => r.signed_at).length} signed</span>
          <span className={s.label}>{usd(openValue)} open pipeline</span>
        </div>

        <NewProposalForm
          orgs={(orgs ?? []).map((o) => ({ id: o.id, name: o.name }))}
          projects={(projects ?? []).map((p) => ({ id: p.id, name: p.name, org_id: p.org_id }))}
          contacts={contactOpts.filter((c) => c.hasEmail).map(({ id, organization_id, label: l }) => ({ id, organization_id, label: l }))}
        />
        <NewInviteReveal />

        <div style={{ display: "grid", gap: "0.9rem", marginTop: "1.4rem" }}>
          {estimates.length === 0 && (
            <div className={s.panel} style={{ padding: "1.4rem" }}>
              <p className={s.title}>No proposals yet.</p>
              <p className={s.body} style={{ marginTop: 4 }}>Add a client and a project in <Link href="/ops/clients" style={{ color: "var(--brand)" }}>Clients</Link>, then create the first proposal above.</p>
            </div>
          )}
          {estimates.map((r) => {
            const orgContacts = contactOpts.filter((c) => c.organization_id === r.organization_id && c.hasEmail);
            const inv = invitations.get(r.estimate_no) ?? [];
            return (
              <div key={r.public_id} className={s.panel} style={{ padding: "1rem 1.2rem" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                    <div style={{ display: "flex", gap: ".6rem", alignItems: "baseline", flexWrap: "wrap" }}>
                      <Link href={`/ops/proposals/${r.public_id}`} style={{ fontSize: 13, color: "var(--brand-deep)", fontWeight: 700, textDecoration: "none" }}>{r.estimate_no}</Link>
                      <Link href={`/ops/clients/${r.organization_id}`} style={{ fontSize: 14.5, color: "var(--ink-strong)", fontWeight: 600, textDecoration: "none" }}>{orgName.get(r.organization_id) ?? r.company}</Link>
                      <span style={{ color: "var(--ink-dim)", fontSize: 14 }}>· {r.project_name}</span>
                    </div>
                    <p className={s.help} style={{ marginTop: 2 }}>
                      {r.client_name}{r.view_count > 0 ? ` · viewed ${r.view_count}× · last ${fmt(r.last_viewed_at)}` : " · not viewed yet"}{r.signed_at ? ` · signed by ${r.signer_name}` : ""}
                    </p>
                  </div>
                  <span className={s.num} style={{ fontSize: 13.5, color: "var(--ink-strong)", whiteSpace: "nowrap" }}>
                    {r.one_time_high_cents > 0 ? `${usd(r.one_time_low_cents)} – ${usd(r.one_time_high_cents)}` : "—"}
                  </span>
                  <StatusPill r={r} />
                  <span className={s.chip} title="How this proposal is built">{r.mode === "admin_built" ? "PODOS builds" : "Client builds"}</span>
                  <Link href={`/ops/proposals/${r.public_id}`} className={`${s.btn} ${s.btnSecondary}`} style={{ minHeight: 34, fontSize: 12.5 }}>Open</Link>
                </div>

                {/* secure access — contacts of this client only */}
                <div style={{ marginTop: "0.9rem", borderTop: "1px solid var(--edge-faint)", paddingTop: "0.8rem" }}>
                  <p className={`${s.label} ${s.labelBrand}`} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><ShieldCheck size={12} aria-hidden /> Secure access</p>
                  {inv.length === 0 ? <p className={s.help}>No invitations yet.</p> : (
                    <div style={{ display: "grid", gap: 4 }}>
                      {inv.map((i) => (
                        <div key={i.invitation_id} style={{ display: "flex", gap: "0.7rem", alignItems: "baseline", flexWrap: "wrap", fontSize: 12.5 }}>
                          <span style={{ color: "var(--ink-strong)" }}>{i.recipient_name ? `${i.recipient_name} · ` : ""}{i.recipient_email}</span>
                          <span style={{ ...label, fontSize: 9, color: "var(--ink-faint)" }}>{i.access_policy}</span>
                          {!i.revoked && i.link_token && (
                            <span style={{ display: "inline-flex", gap: 10, flexWrap: "wrap", fontSize: 11.5 }}>
                              {r.mode === "client_configured" && <a href={`${SITE.baseUrl}/e/${i.link_token}?to=configure`} target="_blank" rel="noopener" style={{ color: "var(--brand)" }}>Edit estimate link</a>}
                              <a href={`${SITE.baseUrl}/e/${i.link_token}?to=proposal`} target="_blank" rel="noopener" style={{ color: "var(--brand)" }}>View proposal link</a>
                            </span>
                          )}
                          {i.revoked ? <span className={`${s.chip} ${s.chipDanger}`}>revoked</span> : (
                            <>
                              <span className={s.help} style={{ marginTop: 0 }}>{i.exchanged_at ? `verified · last seen ${fmt(i.last_seen)}` : `not opened · expires ${fmt(i.expires_at)}`}</span>
                              <form action={revokeInvitationAction} style={{ display: "inline" }}>
                                <input type="hidden" name="invitationId" value={i.invitation_id} />
                                <input type="hidden" name="publicId" value={r.public_id} />
                                <button type="submit" className={s.btnGhost} style={{ ...label, fontSize: 9, color: "#B91C1C", background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}><Trash2 size={11} aria-hidden /> Revoke</button>
                              </form>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {orgContacts.length === 0 ? (
                    <p className={s.help} style={{ marginTop: 8 }}>Add a contact with an email to <Link href={`/ops/clients/${r.organization_id}`} style={{ color: "var(--brand)" }}>{orgName.get(r.organization_id) ?? "this client"}</Link> to invite them.</p>
                  ) : (
                    <form action={inviteContactAction} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.7rem", alignItems: "center" }}>
                      <input type="hidden" name="estimateNo" value={r.estimate_no} />
                      <input type="hidden" name="publicId" value={r.public_id} />
                      <input type="hidden" name="mode" value={r.mode} />
                      <input type="hidden" name="company" value={orgName.get(r.organization_id) ?? r.company ?? ""} />
                      <input type="hidden" name="project" value={r.project_name ?? ""} />
                      <select name="contactId" required defaultValue="" style={{ padding: "0.45rem 0.6rem", borderRadius: 8, border: "1px solid var(--edge-bright)", fontSize: 13, fontFamily: "inherit", minWidth: 240 }}>
                        <option value="" disabled>Choose a contact…</option>
                        {orgContacts.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                      <select name="policy" defaultValue="email-confirm" style={{ padding: "0.45rem 0.6rem", borderRadius: 8, border: "1px solid var(--edge-bright)", fontSize: 13, fontFamily: "inherit" }}>
                        <option value="email-confirm">Email confirm</option>
                        <option value="otp">Email OTP</option>
                      </select>
                      <button type="submit" className={`${s.btn} ${s.btnSecondary}`} style={{ minHeight: 36, fontSize: 12.5 }}><Send size={13} aria-hidden /> Invite</button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className={s.help} style={{ marginTop: "1.4rem", maxWidth: "76ch", lineHeight: 1.6 }}>
          Invitation links are personal to a client contact, stored only as hashes, and shown once. Email OTP requires a configured email provider; until then use Email confirm. Revoking an invitation ends its active sessions.
        </p>
      </div>
    </OpsShell>
  );
}
