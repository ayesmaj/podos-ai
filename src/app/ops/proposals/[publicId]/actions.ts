"use server";

import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import {
  ADMIN_SECRET, addCatalogLineItem, deleteLineItem, upsertLineItem,
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
