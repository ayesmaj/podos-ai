"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import {
  ADMIN_SECRET, createInvitation, createProposal, revokeInvitation,
} from "@/lib/estimates/admin";

/**
 * Proposal-list actions under the CONNECTED model: a proposal is created for
 * an existing client's project (the database refuses anything else) and an
 * invitation goes to one of that client's contacts. No free-text clients.
 */

export async function createProposalAction(formData: FormData) {
  await requireOps();
  const orgId = String(formData.get("orgId") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  const contactId = String(formData.get("contactId") ?? "") || null;
  if (!orgId || !projectId) return;
  const rows = await createProposal(ADMIN_SECRET, { orgId, projectId, contactId });
  const created = rows?.[0];
  if (created) redirect(`/ops/proposals/${created.public_id}`);
  revalidatePath("/ops/proposals");
}

export async function inviteContactAction(formData: FormData) {
  await requireOps();
  const estimateNo = String(formData.get("estimateNo") ?? "").trim();
  const contactId = String(formData.get("contactId") ?? "");
  const policy = formData.get("policy") === "otp" ? "otp" : "email-confirm";
  if (!estimateNo || !contactId) return;
  const rows = await createInvitation(ADMIN_SECRET, { estimateNo, contactId, policy });
  const created = rows?.[0];
  if (created) {
    const jar = await cookies();
    // one-shot, HttpOnly reveal — the raw token is never readable by page JS
    jar.set("podos_new_invite", `${estimateNo}:${created.token}`, {
      httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 300,
    });
  }
  revalidatePath("/ops/proposals");
}

export async function revokeInvitationAction(formData: FormData) {
  await requireOps();
  const id = String(formData.get("invitationId") ?? "");
  if (id) await revokeInvitation(ADMIN_SECRET, id);
  revalidatePath("/ops/proposals");
}

export async function dismissInviteReveal() {
  await requireOps();
  const jar = await cookies();
  jar.delete("podos_new_invite");
  revalidatePath("/ops/proposals");
}
