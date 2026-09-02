"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import {
  ADMIN_SECRET, createInvitation, createProposal, listContacts, logEmail, revokeInvitation, type ProposalMode,
} from "@/lib/estimates/admin";
import { invitationEmail, sendProposalEmail } from "@/lib/email/proposals";

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
  if (created) redirect(`/ops/proposals/${created.public_id}`);
  revalidatePath("/ops/proposals");
}

export async function inviteContactAction(formData: FormData) {
  await requireOps();
  const estimateNo = String(formData.get("estimateNo") ?? "").trim();
  const publicId = String(formData.get("publicId") ?? "").trim();
  const contactId = String(formData.get("contactId") ?? "");
  const policy = formData.get("policy") === "otp" ? "otp" : "email-confirm";
  const mode: ProposalMode = formData.get("mode") === "admin_built" ? "admin_built" : "client_configured";
  // recipient comes from the contact record, never from the form
  const contact = ((await listContacts(ADMIN_SECRET)) ?? []).find((c) => c.id === contactId);
  const recipientEmail = contact?.email ?? "";
  const recipientName = contact ? ([contact.first_name, contact.last_name].filter(Boolean).join(" ") || null) : null;
  const company = String(formData.get("company") ?? "") || null;
  const project = String(formData.get("project") ?? "") || null;
  if (!estimateNo || !contactId) return;

  const rows = await createInvitation(ADMIN_SECRET, { estimateNo, contactId, policy });
  const created = rows?.[0];
  if (!created) return;

  // email the personal link (fails closed; the admin still gets the link)
  let status = "notsent"; let detail = "no email provider configured";
  if (recipientEmail) {
    const msg = invitationEmail({ mode, company, project, recipientName, token: created.token });
    const r = await sendProposalEmail(recipientEmail, msg);
    status = r.sent ? "sent" : "notsent"; detail = r.sent ? recipientEmail : (r.reason ?? "send failed");
    if (publicId) await logEmail(ADMIN_SECRET, { publicId, to: recipientEmail, template: `invitation_${mode}`, subject: msg.subject, status: r.sent ? "sent" : "not_sent", providerId: r.id, error: r.reason });
  }

  const jar = await cookies();
  // one-shot, HttpOnly reveal: estimateNo | token | sent/notsent | detail
  jar.set("podos_new_invite", [estimateNo, created.token, status, detail].join("|"), {
    httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 300,
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
