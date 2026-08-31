"use server";

/**
 * Server actions for the PODOS Configurator.
 *
 * The brief requires every commercial calculation to run on the server: the
 * browser may render a total but must never be the authoritative calculator.
 * This is the only path that produces a customer-facing estimate.
 *
 * Security note (Next 16): server actions are reachable by direct POST from
 * anywhere, regardless of the UI. This action is deliberately read-only, takes
 * no identifiers, touches no database, and returns nothing that isn't already
 * public catalog data — so it needs no session check. Any future action that
 * writes a draft, prices a real price book, or reads a customer record MUST
 * do its own authentication and authorization check here, inside the action.
 */

import { priceConfiguration, type Estimate } from "@/server/configurator/pricing";

/** Hard cap on submitted ids — a stale or hostile client cannot force huge work. */
const MAX_SELECTIONS = 64;

export async function calculateEstimate(selectedIds: unknown): Promise<Estimate> {
  // Validate at the trust boundary; never trust the shape the client sent.
  const ids = Array.isArray(selectedIds)
    ? selectedIds.filter((id): id is string => typeof id === "string" && id.length < 64).slice(0, MAX_SELECTIONS)
    : [];

  return priceConfiguration(ids);
}
