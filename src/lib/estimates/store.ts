/**
 * store.ts — server-side access to per-client estimates.
 *
 * Follows the repo's existing Supabase pattern (raw fetch to PostgREST, no SDK
 * — see src/app/api/investor-interest/route.ts) but calls RPC functions rather
 * than tables, because the tables are RLS deny-all: the anon key can read
 * nothing directly.
 *
 * Security model (master brief §13/§23):
 *   - the client link carries a 256-bit opaque token; only its SHA-256 hash is
 *     stored, so a database dump cannot be replayed as working links
 *   - unknown, revoked and expired tokens all return nothing, so an invalid
 *     link is indistinguishable from a missing one and cannot be probed
 *   - estimate_no (PODOS-1001) is display-only and never appears in a URL
 *   - privileged calls (create/list/revoke) require an admin secret that lives
 *     in the database, never in client code
 *
 * server-only: this module reads secrets and must never reach the browser.
 */

// Server-only guard without adding the `server-only` package (not installed in
// this repo). Importing this module into a client bundle throws immediately
// rather than silently shipping key handling to the browser.
if (typeof window !== "undefined") {
  throw new Error("src/lib/estimates/store.ts is server-only and must not be imported by client code");
}

const URL_BASE =
  process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
// Same publishable key the investor-interest route falls back to. It is safe by
// design: RLS denies the anon role all table access, and the estimate functions
// are the only reachable surface.
const ANON_KEY =
  process.env.PODOS_SUPABASE_ANON_KEY ?? "sb_publishable_1W4q68h6ES47vNdJZVsq7g_p88eLPi5";

export interface ClientEstimate {
  estimate_no: string;
  client_name: string;
  company: string | null;
  project_name: string | null;
  config: Record<string, unknown>;
  line_items: { label: string; amount: number }[];
  one_time_low_cents: number;
  one_time_high_cents: number;
  recurring_cents: number;
  currency: string;
  status: string;
  view_count: number;
  signed_at: string | null;
  signer_name: string | null;
  expires_at: string | null;
  created_at: string;
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T | null> {
  if (!ANON_KEY) {
    console.error("[estimates] PODOS_SUPABASE_ANON_KEY is not set");
    return null;
  }
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store", // an estimate must never be served from cache
    });
    if (!res.ok) {
      // Never log the token itself.
      console.error(`[estimates] rpc ${fn} failed: ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[estimates] rpc ${fn} threw:`, err instanceof Error ? err.message : "unknown");
    return null;
  }
}

/**
 * Resolve a client link. Records the view as a side effect (count, first/last
 * seen, audit row) — that is intentional and is what powers "viewed 3x".
 * Returns null for unknown, revoked or expired tokens alike.
 */
export async function getEstimateByToken(
  token: string,
  meta?: { userAgent?: string | null; referrer?: string | null }
): Promise<ClientEstimate | null> {
  if (!token || token.length < 32 || token.length > 128) return null; // cheap shape check
  const rows = await rpc<ClientEstimate[]>("get_estimate_by_token", {
    p_token: token,
    p_user_agent: meta?.userAgent ?? null,
    p_referrer: meta?.referrer ?? null,
  });
  return rows && rows.length > 0 ? rows[0] : null;
}

/** Record a client signature against one specific estimate. */
export async function signEstimate(
  token: string,
  signerName: string,
  signerTitle?: string
): Promise<boolean> {
  const ok = await rpc<boolean>("sign_estimate_by_token", {
    p_token: token,
    p_signer_name: signerName,
    p_signer_title: signerTitle ?? null,
  });
  return ok === true;
}

/** Create an estimate and return its one-time-only raw token. Admin secret required. */
export async function createEstimate(input: {
  adminSecret: string;
  clientName: string;
  projectName?: string;
  company?: string;
  clientEmail?: string;
  config?: Record<string, unknown>;
  lineItems?: { label: string; amount: number }[];
  lowCents?: number;
  highCents?: number;
  recurringCents?: number;
  expiresDays?: number;
}): Promise<{ estimate_no: string; token: string } | null> {
  const rows = await rpc<{ estimate_no: string; token: string }[]>("create_estimate", {
    p_admin_secret: input.adminSecret,
    p_client_name: input.clientName,
    p_project_name: input.projectName ?? null,
    p_company: input.company ?? null,
    p_client_email: input.clientEmail ?? null,
    p_config: input.config ?? {},
    p_line_items: input.lineItems ?? [],
    p_low_cents: input.lowCents ?? 0,
    p_high_cents: input.highCents ?? 0,
    p_recurring: input.recurringCents ?? 0,
    p_expires_days: input.expiresDays ?? 30,
  });
  return rows && rows.length > 0 ? rows[0] : null;
}

/** Format integer cents as USD. Never used for arithmetic. */
export function usd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
