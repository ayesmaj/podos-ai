/**
 * access.ts — server-side gateway to the private proposal access layer.
 *
 * Flow (rebuild brief §1B/§1C):
 *   invitation link  ->  /proposal/invite/[token]   (no proposal data)
 *   verification     ->  OTP e-mailed, or authorized-email confirmation
 *   exchange         ->  proposal_sessions row; raw session token returned once
 *   clean route      ->  /proposal/[id] reads the HttpOnly session cookie
 *
 * All tokens live in the database as SHA-256 hashes; the tables are RLS
 * deny-all and every call below goes through a SECURITY DEFINER function.
 * This module must never be imported into client code.
 */

if (typeof window !== "undefined") {
  throw new Error("src/lib/proposals/access.ts is server-only");
}

const URL_BASE =
  process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
const ANON_KEY =
  process.env.PODOS_SUPABASE_ANON_KEY ?? "sb_publishable_1W4q68h6ES47vNdJZVsq7g_p88eLPi5";

/** Client-route session cookie. HttpOnly, Secure, SameSite=Lax, path-scoped. */
export const VIEWER_COOKIE = "podos_proposal_session";

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!res.ok) {
      // Rate-limit exceptions surface as 400s with a message; report status only.
      console.error(`[proposals] rpc ${fn} -> ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[proposals] rpc ${fn} threw:`, err instanceof Error ? err.message : "unknown");
    return null;
  }
}

const looksLikeToken = (t: string) => /^[a-f0-9]{64}$/.test(t);

export interface InvitationStatus {
  ok: boolean;
  access_policy: "otp" | "email-confirm";
  masked_email: string;
  company: string | null;
}

/** Validate an invitation link. Reveals only the access screen's needs. */
export async function invitationStatus(token: string): Promise<InvitationStatus | null> {
  if (!looksLikeToken(token)) return null;
  const rows = await rpc<InvitationStatus[]>("invitation_status", { p_token: token });
  return rows?.[0] ?? null;
}

/**
 * Issue an OTP for an otp-policy invitation. Returns the code and recipient so
 * the caller can e-mail it. The code must never reach the browser.
 */
export async function issueOtp(token: string): Promise<{ code: string; recipient_email: string } | null> {
  if (!looksLikeToken(token)) return null;
  const rows = await rpc<{ code: string; recipient_email: string }[]>("issue_otp", { p_token: token });
  return rows?.[0] ?? null;
}

/** Exchange invitation + answer (OTP code or typed authorized email) for a session. */
export async function verifyInvitation(
  token: string,
  answer: string
): Promise<{ session_token: string; public_id: string } | null> {
  if (!looksLikeToken(token)) return null;
  const rows = await rpc<{ session_token: string; public_id: string }[]>("verify_invitation", {
    p_token: token,
    p_answer: answer,
  });
  return rows?.[0] ?? null;
}

export interface SessionProposal {
  estimate_uuid: string;
  public_id: string;
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
  viewer_email: string;
}

/** Resolve the viewer session. Records the view (that powers per-viewer analytics). */
export async function sessionProposal(sessionToken: string): Promise<SessionProposal | null> {
  if (!looksLikeToken(sessionToken)) return null;
  const rows = await rpc<SessionProposal[]>("session_proposal", { p_session: sessionToken });
  return rows?.[0] ?? null;
}

/** Sign through the verified session — signature is attached to a known viewer. */
export async function signViaSession(
  sessionToken: string,
  signerName: string,
  signerTitle?: string
): Promise<boolean> {
  if (!looksLikeToken(sessionToken)) return false;
  const ok = await rpc<boolean>("sign_via_session", {
    p_session: sessionToken,
    p_signer_name: signerName,
    p_signer_title: signerTitle ?? null,
  });
  return ok === true;
}

/** Send the OTP e-mail. Returns false when no provider is configured (fail closed). */
export async function sendOtpEmail(to: string, code: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM ?? "PODOS AI <onboarding@resend.dev>",
        to,
        subject: "Your PODOS verification code",
        // No pricing or proposal details in the e-mail (brief §19).
        text: `Your PODOS verification code is: ${code}\n\nIt expires in 10 minutes. If you did not request this, ignore this e-mail.`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Durable fixed-window rate limit (DB-backed; serverless shares no memory). */
export async function rateCheck(
  bucket: string,
  key: string,
  max: number,
  windowSeconds: number
): Promise<boolean> {
  const ok = await rpc<boolean>("rate_check", {
    p_bucket: bucket,
    p_key: key,
    p_max: max,
    p_window_seconds: windowSeconds,
  });
  // Fail closed on limiter errors for auth-adjacent buckets.
  return ok === true;
}

/** Client workspace: persist one step's payload (autosave). */
export async function saveSelection(session: string, step: string, payload: unknown): Promise<boolean> {
  const ok = await rpc<boolean>("save_selection", { p_session: session, p_step: step, p_payload: payload });
  return ok === true;
}

/** Client workspace: load all saved step payloads for the session's proposal. */
export async function getSelections(session: string): Promise<Record<string, unknown>> {
  const r = await rpc<Record<string, unknown>>("get_selections", { p_session: session });
  return r ?? {};
}
