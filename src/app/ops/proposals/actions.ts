"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import {
  ADMIN_SECRET, createInvitation, createProposal, listContacts, listOrganizations, listProjects, logEmail, revokeInvitation, setProposalDesign, type ProposalMode,
} from "@/lib/estimates/admin";
import { invitationEmail, sendProposalEmail } from "@/lib/email/proposals";

/** Issue a personal secure link to one of the client's contacts, email it when possible, and reveal it once to the admin. */
async function issueInvitation(i: { estimateNo: string; publicId: string; contactId: string; policy: "otp" | "email-confirm"; mode: ProposalMode; company: string | null; project: string | null }) {
  const contact = ((await listContacts(ADMIN_SECRET)) ?? []).find((c) => c.id === i.contactId);
  const recipientEmail = contact?.email ?? "";
  const recipientName = contact ? ([contact.first_name, contact.last_name].filter(Boolean).join(" ") || null) : null;
  const rows = await createInvitation(ADMIN_SECRET, { estimateNo: i.estimateNo, contactId: i.contactId, policy: i.policy });
  const created = rows?.[0];
  if (!created) return;
  let status = "notsent"; let detail = "no email provider configured";
  if (recipientEmail) {
    const msg = invitationEmail({ mode: i.mode, company: i.company, project: i.project, recipientName, token: created.token });
    const r = await sendProposalEmail(recipientEmail, msg);
    status = r.sent ? "sent" : "notsent"; detail = r.sent ? recipientEmail : (r.reason ?? "send failed");
    await logEmail(ADMIN_SECRET, { publicId: i.publicId, to: recipientEmail, template: `invitation_${i.mode}`, subject: msg.subject, status: r.sent ? "sent" : "not_sent", providerId: r.id, error: r.reason });
  }
  (await cookies()).set("podos_new_invite", [i.estimateNo, created.token, status, detail].join("|"), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 300 });
}

/**
 * Proposal-list actions under the CONNECTED model: a proposal is created for
 * an existing client's project (the database refuses anything else) and an
 * invitation goes to one of that client's contacts. Invitations are emailed
 * when a provider is configured; either way the secure link is revealed once
 * to the admin (with the email outcome) so nothing silently stalls.
 */

export async function createProposalAction(formData: FormData) {
  await requireOps();
  const orgId = String(formData.get("orgId") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  const contactId = String(formData.get("contactId") ?? "") || null;
  const mode: ProposalMode = formData.get("mode") === "admin_built" ? "admin_built" : "client_configured";
  if (!orgId || !projectId) return;
  const rows = await createProposal(ADMIN_SECRET, { orgId, projectId, contactId, mode });
  const created = rows?.[0];
  if (!created) { revalidatePath("/ops/proposals"); return; }
  // wizard extras: document type + optional immediate invitation
  if (formData.get("pageMode") === "formal" || formData.get("pageMode") === "preliminary") {
    await setProposalDesign(ADMIN_SECRET, created.public_id, { page_mode: formData.get("pageMode") });
  }
  if (contactId && formData.get("inviteNow") === "1") {
    const [orgs, projects] = await Promise.all([listOrganizations(ADMIN_SECRET), listProjects(ADMIN_SECRET)]);
    await issueInvitation({
      estimateNo: created.estimate_no, publicId: created.public_id, contactId,
      policy: formData.get("policy") === "otp" ? "otp" : "email-confirm", mode,
      company: (orgs ?? []).find((o) => o.id === orgId)?.name ?? null,
      project: (projects ?? []).find((p) => p.id === projectId)?.name ?? null,
    });
  }
  revalidatePath("/ops/proposals");
  redirect(`/ops/proposals/${created.public_id}`);
}

export async function inviteContactAction(formData: FormData) {
  await requireOps();
  const estimateNo = String(formData.get("estimateNo") ?? "").trim();
  const publicId = String(formData.get("publicId") ?? "").trim();
  const contactId = String(formData.get("contactId") ?? "");
  const policy = formData.get("policy") === "otp" ? "otp" : "email-confirm";
  const mode: ProposalMode = formData.get("mode") === "admin_built" ? "admin_built" : "client_configured";
  if (!estimateNo || !contactId) return;
  await issueInvitation({
    estimateNo, publicId, contactId, policy, mode,
    company: String(formData.get("company") ?? "") || null, project: String(formData.get("project") ?? "") || null,
  });
  revalidatePath("/ops/proposals");
  if (publicId) revalidatePath(`/ops/proposals/${publicId}`);
}

export async function revokeInvitationAction(formData: FormData) {
  await requireOps();
  const id = String(formData.get("invitationId") ?? "");
  const publicId = String(formData.get("publicId") ?? "");
  if (id) await revokeInvitation(ADMIN_SECRET, id);
  revalidatePath("/ops/proposals");
  if (publicId) revalidatePath(`/ops/proposals/${publicId}`);
}

export async function dismissInviteReveal() {
  await requireOps();
  const jar = await cookies();
  jar.delete("podos_new_invite");
  revalidatePath("/ops/proposals");
}
