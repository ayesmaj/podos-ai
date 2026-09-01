import { cookies, headers } from "next/headers";
import { VIEWER_COOKIE, rateCheck, verifyInvitation } from "@/lib/proposals/access";

/**
 * POST /api/proposal/verify — exchange an invitation + answer for a session.
 *
 * The answer is either the emailed six-digit code (otp policy) or the typed
 * authorized email (email-confirm policy); the database function decides and
 * enforces attempt caps. On success the opaque session token goes into an
 * HttpOnly cookie — it never reaches page JavaScript — and the response
 * carries only the clean proposal id to navigate to.
 *
 * Rate limited per IP (durable, DB-backed): verification guessing gets a
 * uniform failure with no oracle.
 */

export async function POST(req: Request) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();

  const allowed = await rateCheck("proposal-verify", ip, 10, 300);
  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many attempts. Wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let body: { token?: unknown; answer?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const token = typeof body.token === "string" ? body.token : "";
  const answer = typeof body.answer === "string" ? body.answer.trim() : "";
  if (!token || !answer) {
    return Response.json({ ok: false, error: "Verification failed. Check and try again." }, { status: 400 });
  }

  const result = await verifyInvitation(token, answer);
  if (!result) {
    // Wrong code, wrong email, expired, revoked — all identical from outside.
    return Response.json({ ok: false, error: "Verification failed. Check and try again." }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(VIEWER_COOKIE, result.session_token, {
    httpOnly: true,
    secure: true, // always — not gated on NODE_ENV (audit F10)
    sameSite: "lax", // email-link arrivals must carry it on top-level GET
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ ok: true, id: result.public_id });
}
