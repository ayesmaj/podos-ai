/**
 * POST /api/estimate-request — inbound lead from the public estimator.
 *
 * Replaces a mailto: link, which silently did nothing for anyone without a
 * desktop mail client configured. The request now creates a draft estimate
 * that staff see in /admin/estimates.
 *
 * The database function does the real validation and flood control; this
 * handler validates shape at the trust boundary and never returns the
 * estimate's token — only staff can issue a client link.
 */

const URL_BASE =
  process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
const ANON_KEY =
  process.env.PODOS_SUPABASE_ANON_KEY ?? "sb_publishable_1W4q68h6ES47vNdJZVsq7g_p88eLPi5";

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
const int = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Return success so they don't retry.
  if (str(body.company_website, 200)) return Response.json({ ok: true });

  const clientName = str(body.clientName, 200);
  const clientEmail = str(body.clientEmail, 320);
  if (!clientName) return Response.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clientEmail)) {
    return Response.json({ ok: false, error: "Please enter a valid work email." }, { status: 400 });
  }

  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/request_estimate`, {
      method: "POST",
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        p_client_name: clientName,
        p_client_email: clientEmail,
        p_company: str(body.company, 200) || null,
        p_project_name: str(body.projectName, 200) || null,
        p_config: typeof body.config === "object" && body.config ? body.config : {},
        p_low_cents: int(body.lowCents),
        p_high_cents: int(body.highCents),
        p_recurring: int(body.recurringCents),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      // The function raises for flood control; surface that one kindly.
      if (detail.includes("too many requests")) {
        return Response.json(
          { ok: false, error: "We already have your recent request — we'll be in touch shortly." },
          { status: 429 }
        );
      }
      console.error("[estimate-request] rpc failed:", res.status);
      return Response.json({ ok: false, error: "Could not send that. Please email info@podosai.com." }, { status: 502 });
    }

    const estimateNo = await res.json();
    return Response.json({ ok: true, reference: estimateNo });
  } catch (err) {
    console.error("[estimate-request] threw:", err instanceof Error ? err.message : "unknown");
    return Response.json({ ok: false, error: "Could not send that. Please email info@podosai.com." }, { status: 502 });
  }
}
