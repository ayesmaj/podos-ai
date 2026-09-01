import { headers } from "next/headers";
import { DEFAULT_SELECTION, estimate, type Selection } from "@/lib/configurator/estimate";

/**
 * POST /api/estimate-request — inbound deployment inquiry.
 *
 * Rebuilt per audit F8/F9: the previous version accepted CLIENT-COMPUTED
 * cents and forwarded them to the database — a visitor could submit
 * attacker-chosen figures. Money is now recomputed HERE from the submitted
 * selection using the committed price table; any client-sent numbers are
 * ignored entirely. Also adds a durable per-IP rate limit in front of the
 * database's own flood control.
 *
 * Note: the public estimator UI is retired (/estimate is a private-access
 * notice), so this endpoint currently serves programmatic/legacy submissions
 * and the future authenticated workspace. It stays hardened either way.
 */

const URL_BASE =
  process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
const ANON_KEY =
  process.env.PODOS_SUPABASE_ANON_KEY ?? "sb_publishable_1W4q68h6ES47vNdJZVsq7g_p88eLPi5";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Coerce an untrusted selection into a safe Selection — never trust shape. */
function sanitizeSelection(raw: unknown): Selection {
  const r = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const pick = (v: unknown, allowed: string[], fallback: string) =>
    typeof v === "string" && allowed.includes(v) ? v : fallback;
  return {
    pods: typeof r.pods === "number" && Number.isFinite(r.pods) ? Math.max(1, Math.min(50, Math.round(r.pods))) : DEFAULT_SELECTION.pods,
    includeCompute: typeof r.includeCompute === "boolean" ? r.includeCompute : DEFAULT_SELECTION.includeCompute,
    cooling: pick(r.cooling, ["direct-to-chip", "hybrid", "air"], DEFAULT_SELECTION.cooling),
    power: pick(r.power, ["standard", "redundant", "off-grid"], DEFAULT_SELECTION.power),
    network: pick(r.network, ["standard", "high-bandwidth"], DEFAULT_SELECTION.network),
    support: pick(r.support, ["standard", "enhanced", "fully-managed"], DEFAULT_SELECTION.support),
    services: Array.isArray(r.services)
      ? r.services.filter((x): x is string => typeof x === "string" && ["siteAssessment", "transport", "commissioning"].includes(x)).slice(0, 10)
      : DEFAULT_SELECTION.services,
    sitePowerMw: typeof r.sitePowerMw === "number" && Number.isFinite(r.sitePowerMw) ? Math.max(0, Math.min(1000, r.sitePowerMw)) : 0,
  };
}

async function rateAllowed(ip: string): Promise<boolean> {
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/rate_check`, {
      method: "POST",
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_bucket: "estimate-request", p_key: ip, p_max: 5, p_window_seconds: 3600 }),
      cache: "no-store",
    });
    if (!res.ok) return false; // fail closed
    return (await res.json()) === true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (!(await rateAllowed(ip))) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again later or email info@podosai.com." },
      { status: 429 }
    );
  }

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

  // ---- Server-side pricing: the ONLY money that gets stored (F8). ----
  const selection = sanitizeSelection(body.selection ?? body.config);
  const priced = estimate(selection);

  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/request_estimate`, {
      method: "POST",
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        p_client_name: clientName,
        p_client_email: clientEmail,
        p_company: str(body.company, 200) || null,
        p_project_name: str(body.projectName, 200) || null,
        p_config: { ...selection, server_priced: true },
        p_low_cents: Math.round(priced.low * 100),
        p_high_cents: Math.round(priced.high * 100),
        p_recurring: Math.round(priced.recurringPerYear * 100),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
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
