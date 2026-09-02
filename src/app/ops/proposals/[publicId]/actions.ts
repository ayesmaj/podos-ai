"use server";

import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import {
  ADMIN_SECRET, addCatalogLineItem, deleteLineItem, upsertLineItem,
  importSelections, releaseProposal, requestRevision, setSignatureState,
} from "@/lib/estimates/admin";

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

/** Snapshot + lock this version and make the formal proposal visible to the client. */
export async function releaseToClient(formData: FormData) {
  await requireOps();
  const publicId = String(formData.get("publicId") ?? "");
  if (publicId) await releaseProposal(ADMIN_SECRET, publicId);
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
