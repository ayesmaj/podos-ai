/**
 * POST /api/investor-interest — records a NON-BINDING indication of
 * investor interest. This is NOT a payment endpoint: no money moves, no
 * securities are sold. Actual transactions happen only through the
 * approved intermediary configured in investOffering.portalURL.
 *
 * Storage: Supabase (podos-invest project) via PostgREST — the table is
 * RLS-locked to INSERT-only for the anon role, and the key stays
 * server-side. Env: PODOS_SUPABASE_URL, PODOS_SUPABASE_ANON_KEY.
 *
 * Notification: when RESEND_API_KEY is set, each recorded submission is
 * also emailed to info@podosai.com (NOTIFY_EMAIL to override). Email is
 * best-effort — a mail failure never loses the lead, the DB row is the
 * source of truth.
 */

import { NextRequest, NextResponse } from "next/server";

const MIN = 1_000;
const MAX = 250_000;

/* ponytail: in-memory per-IP throttle — resets on redeploy, good enough
 * to blunt casual spam; upgrade to Upstash/KV if abuse ever shows up. */
const hits = new Map<string, { n: number; t: number }>();
function throttled(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > 5;
}

export async function POST(req: NextRequest) {
  /* The publishable key is designed for public exposure (client bundles
   * ship it in every Supabase app); security lives in RLS, which locks
   * this key to INSERT-only on investor_interest — verified: reads
   * return nothing. Env vars remain as overrides. */
  const url = process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
  const key =
    process.env.PODOS_SUPABASE_ANON_KEY ?? "sb_publishable_1W4q68h6ES47vNdJZVsq7g_p88eLPi5";

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  let body: {
    fullName?: string;
    email?: string;
    phone?: string;
    amountUsd?: number;
    investorType?: string;
    accredited?: string;
    message?: string;
    /** honeypot — humans never fill this */
    company?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (body.company) return NextResponse.json({ ok: true }); // silently drop bots

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const amount = Math.round(Number(body.amountUsd));

  if (fullName.length < 2 || fullName.length > 120) {
    return NextResponse.json({ ok: false, error: "Please enter your full name" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email" }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount < MIN || amount > MAX) {
    return NextResponse.json(
      { ok: false, error: `Amount must be between $${MIN.toLocaleString()} and $${MAX.toLocaleString()}` },
      { status: 400 }
    );
  }

  const res = await fetch(`${url}/rest/v1/investor_interest`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      full_name: fullName,
      email,
      phone: body.phone?.trim().slice(0, 40) || null,
      amount_usd: amount,
      investor_type: ["individual", "entity"].includes(body.investorType ?? "") ? body.investorType : "individual",
      accredited: ["yes", "no", "unsure"].includes(body.accredited ?? "") ? body.accredited : "unsure",
      message: body.message?.trim().slice(0, 2000) || null,
      source: "invest-page",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("investor-interest insert failed:", res.status, detail.slice(0, 300));
    return NextResponse.json(
      { ok: false, error: "Could not record your interest — please try again or email info@podosai.com" },
      { status: 502 }
    );
  }

  await notifyTeam({ fullName, email, phone: body.phone?.trim(), amount, investorType: body.investorType, accredited: body.accredited });

  return NextResponse.json({ ok: true });
}

/** Best-effort email notification — never blocks the lead.
 *  Uses Resend when RESEND_API_KEY is set; otherwise relays through
 *  FormSubmit (no account — info@podosai.com clicks a one-time
 *  activation link on the first submission). */
async function notifyTeam(lead: {
  fullName: string;
  email: string;
  phone?: string;
  amount: number;
  investorType?: string;
  accredited?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL ?? "info@podosai.com";
  if (!key) {
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${to}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New investor interest — ${lead.fullName} · $${lead.amount.toLocaleString("en-US")}`,
          _template: "table",
          _captcha: "false",
          _replyto: lead.email,
          Name: lead.fullName,
          Email: lead.email,
          Phone: lead.phone || "—",
          "Intended amount": `$${lead.amount.toLocaleString("en-US")} (non-binding)`,
          "Investing as": lead.investorType === "entity" ? "Entity / Fund" : "Individual",
          Accredited: lead.accredited ?? "unsure",
          Source: "podosai.com/invest",
        }),
      });
      if (!res.ok) console.error("formsubmit notify failed:", res.status, (await res.text()).slice(0, 200));
    } catch (e) {
      console.error("formsubmit notify error:", e);
    }
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM ?? "PODOS Invest <onboarding@resend.dev>",
        to: [process.env.NOTIFY_EMAIL ?? "info@podosai.com"],
        reply_to: lead.email,
        subject: `New investor interest — ${lead.fullName} · $${lead.amount.toLocaleString("en-US")}`,
        text: [
          "New indication of investor interest from podosai.com/invest:",
          "",
          `Name:        ${lead.fullName}`,
          `Email:       ${lead.email}`,
          `Phone:       ${lead.phone || "—"}`,
          `Amount:      $${lead.amount.toLocaleString("en-US")} (non-binding)`,
          `Investing as: ${lead.investorType === "entity" ? "Entity / Fund" : "Individual"}`,
          `Accredited:  ${lead.accredited ?? "unsure"}`,
          "",
          "Full record: Supabase → podos-invest → investor_interest",
        ].join("\n"),
      }),
    });
    if (!res.ok) console.error("notify email failed:", res.status, (await res.text()).slice(0, 200));
  } catch (e) {
    console.error("notify email error:", e);
  }
}
