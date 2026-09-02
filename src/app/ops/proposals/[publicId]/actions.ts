"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import {
  ADMIN_SECRET, addCatalogLineItem, deleteLineItem, upsertLineItem,
  importSelections, logEmail, releaseProposal, requestRevision, setProposalMode, setSignatureState,
  type ProposalMode,
} from "@/lib/estimates/admin";
import { releasedEmail, sendProposalEmail } from "@/lib/email/proposals";

/**
 * Server actions for the proposal editor. Each re-checks the admin session
 * (server actions are publicly POSTable in Next 16) and delegates to a
 * SECURITY DEFINER RPC that recomputes totals server-side. Money never
 * originates in the browser.
 */

export async function saveLineItem(input: {
  publicId: string; itemId?: string | null; name: string; customerDescription?: string;
  categorySlug?: string; qty: number; unitPriceCents: number;
  optional: boolean; recurring: boolean; pendingReview: boolean;
}) {
  await requireOps();
  const cents = Math.max(0, Math.min(100_000_000_000, Math.round(input.unitPriceCents)));
  const qty = Math.max(0, Math.min(100_000, input.qty));
  await upsertLineItem(ADMIN_SECRET, {
    publicId: input.publicId, itemId: input.itemId ?? null, name: input.name,
    customerDescription: input.customerDescription, categorySlug: input.categorySlug,
    qty, unitPriceCents: cents, optional: input.optional,
    recurring: input.recurring, pendingReview: input.pendingReview,
  });
  revalidatePath(`/ops/proposals/${input.publicId}`);
}

export async function removeLineItem(publicId: string, itemId: string) {
  await requireOps();
  await deleteLineItem(ADMIN_SECRET, publicId, itemId);
  revalidatePath(`/ops/proposals/${publicId}`);
}

export async function addFromCatalog(publicId: string, sku: string) {
  await requireOps();
  await addCatalogLineItem(ADMIN_SECRET, publicId, sku);
  revalidatePath(`/ops/proposals/${publicId}`);
}

/* ---- corrected flow: submission → review → release → signature ---- */

/** Turn the client's saved product selections into catalog line items (× pod quantity). */
export async function importClientSelections(formData: FormData) {
  await requireOps();
  const publicId = String(formData.get("publicId") ?? "");
  if (publicId) await importSelections(ADMIN_SECRET, publicId);
  revalidatePath(`/ops/proposals/${publicId}`);
}

/**
 * Release = snapshot + lock this version, issue a fresh secure invitation for
 * the client's contact, and email them the link. If no email provider is
 * configured (or the send fails) the release still happens and the link is
 * revealed once to the admin to send by hand — nothing stalls silently.
 */
export async function releaseToClient(formData: FormData) {
  await requireOps();
  const publicId = String(formData.get("publicId") ?? "");
  if (!publicId) return;
  const r = await releaseProposal(ADMIN_SECRET, publicId);
  let status = "notsent"; let detail = "no contact with an email on this client";
  if (r?.invited && r.token && r.recipient_email) {
    const msg = releasedEmail({ company: r.company ?? null, project: r.project ?? null, recipientName: r.recipient_name ?? null, token: r.token });
    const sent = await sendProposalEmail(r.recipient_email, msg);
    status = sent.sent ? "sent" : "notsent";
    detail = sent.sent ? r.recipient_email : (sent.reason ?? "send failed");
    await logEmail(ADMIN_SECRET, { publicId, to: r.recipient_email, template: "proposal_released", subject: msg.subject, status: sent.sent ? "sent" : "not_sent", providerId: sent.id, error: sent.reason });
  }
  const jar = await cookies();
  // one-shot, HttpOnly reveal for the editor: token | sent/notsent | detail
  jar.set("podos_release", [r?.token ?? "", status, detail].join("|"), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 600 });
  revalidatePath(`/ops/proposals/${publicId}`);
}

export async function dismissReleaseReveal() {
  await requireOps();
  const jar = await cookies();
  jar.delete("podos_release");
}

/** Client builds via the menu, or PODOS builds the line items. */
export async function setModeAction(formData: FormData) {
  await requireOps();
  const publicId = String(formData.get("publicId") ?? "");
  const mode: ProposalMode = formData.get("mode") === "admin_built" ? "admin_built" : "client_configured";
  if (publicId) await setProposalMode(ADMIN_SECRET, publicId, mode);
  revalidatePath(`/ops/proposals/${publicId}`);
}

/** Show or hide the client's Sign CTA. */
export async function toggleSignature(formData: FormData) {
  await requireOps();
  const publicId = String(formData.get("publicId") ?? "");
  const enable = formData.get("enable") === "1";
  if (publicId) await setSignatureState(ADMIN_SECRET, publicId, enable);
  revalidatePath(`/ops/proposals/${publicId}`);
}

/** Send a submitted configuration back to the client for changes. */
export async function sendBackForRevision(formData: FormData) {
  await requireOps();
  const publicId = String(formData.get("publicId") ?? "");
  const note = String(formData.get("note") ?? "").trim() || undefined;
  if (publicId) await requestRevision(ADMIN_SECRET, publicId, note);
  revalidatePath(`/ops/proposals/${publicId}`);
}
