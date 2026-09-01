import { headers } from "next/headers";
import { issueOtp, rateCheck, sendOtpEmail } from "@/lib/proposals/access";

/**
 * POST /api/proposal/request-otp — issue and email a six-digit code for an
 * otp-policy invitation.
 *
 * The code is generated in the database (10-minute TTL, 5 attempts, at most 3
 * codes per invitation per hour — enforced there) and is emailed server-side.
 * It never appears in this response. If no email provider is configured the
 * request fails CLOSED with an explicit message rather than silently leaving
 * the client stuck — admins should issue email-confirm invitations until
 * RESEND_API_KEY is live (BUSINESS_DATA_REQUIRED A1).
 */

export async function POST(req: Request) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();

  const allowed = await rateCheck("otp-request", ip, 6, 600);
  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many requests. Wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let body: { token?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const token = typeof body.token === "string" ? body.token : "";
  if (!token) return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });

  if (!process.env.RESEND_API_KEY) {
    console.error("[proposal] OTP requested but no email provider is configured");
    return Response.json(
      { ok: false, error: "Code delivery is temporarily unavailable. Contact info@podosai.com for access." },
      { status: 503 }
    );
  }

  const otp = await issueOtp(token);
  if (!otp) {
    // Invalid/expired/revoked invitation or DB throttle — uniform failure.
    return Response.json({ ok: false, error: "Could not send a code for this link." }, { status: 400 });
  }

  const sent = await sendOtpEmail(otp.recipient_email, otp.code);
  if (!sent) {
    console.error("[proposal] OTP email send failed");
    return Response.json(
      { ok: false, error: "Could not send the code. Try again or contact info@podosai.com." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
