import { SITE } from "@/lib/seo/site";

/**
 * settings.ts — company identity + defaults printed on the estimate sheet and
 * used by the ops app. Stored in `app_settings` (single row, partial jsonb);
 * every key falls back to the site constants so an empty row renders the
 * standard sheet. Read publicly (nothing sensitive lives here); written by
 * admins through /ops/settings.
 */

if (typeof window !== "undefined") throw new Error("src/lib/proposals/settings.ts is server-only");

const URL_BASE = process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
const ANON_KEY = process.env.PODOS_SUPABASE_ANON_KEY ?? "sb_publishable_1W4q68h6ES47vNdJZVsq7g_p88eLPi5";

export interface CompanySettings {
  name: string;
  legal_name: string;
  email: string;
  phone: string;
  website: string;
  /** printed under the company name on the sheet (street, city…) */
  address_lines: string[];
  /** proposal validity when no expiry is set */
  default_validity_days: number;
  /** where client comments / signatures are announced (informational until email is configured) */
  notify_email: string;
  /** trust band on the sheet: three title / subtitle pairs */
  trust: { title: string; subtitle: string }[];
  /** standard notes printed on every sheet */
  notes: string[];
  warranty: string;
}

export const DEFAULT_COMPANY: CompanySettings = {
  name: SITE.name,
  legal_name: SITE.legalName,
  email: SITE.email,
  phone: SITE.phone.replace(/^\+1-/, "+1 ").replace(/-/g, " "),
  website: "podosai.com",
  address_lines: [],
  default_validity_days: 30,
  notify_email: "",
  trust: [
    { title: "Factory-built", subtitle: "Integrated and tested before shipping" },
    { title: "Liquid-cooled", subtitle: "Direct-to-chip, high-density ready" },
    { title: "Commissioned on site", subtitle: "Delivered, connected, handed over" },
  ],
  notes: [
    "Pricing is based on the configuration documented above and on site conditions as provided.",
    "Utility power and fiber beyond the demarcation point, civil works, permits, taxes and duties are excluded.",
    "Servers and accelerators are excluded unless itemized.",
    "Delivery schedule is confirmed at order after the engineering review.",
  ],
  warranty: "Factory warranty on the PODOS unit and integrated systems; support and service levels as itemized or per the PODOS standard terms.",
};

const str = (v: unknown, d: string) => (typeof v === "string" && v.trim() ? v.trim() : d);
const lines = (v: unknown, d: string[]) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "").map((x) => x.trim()) : d);

export function resolveCompany(stored: unknown): CompanySettings {
  const s = (stored && typeof stored === "object" ? stored : {}) as Record<string, unknown>;
  const trustRaw = Array.isArray(s.trust) ? (s.trust as unknown[]) : null;
  const trust = trustRaw
    ? trustRaw.map((t) => (t && typeof t === "object" ? t : {}) as Record<string, unknown>).map((t) => ({ title: str(t.title, ""), subtitle: str(t.subtitle, "") })).filter((t) => t.title).slice(0, 3)
    : DEFAULT_COMPANY.trust;
  const days = Number(s.default_validity_days);
  return {
    name: str(s.name, DEFAULT_COMPANY.name),
    legal_name: str(s.legal_name, DEFAULT_COMPANY.legal_name),
    email: str(s.email, DEFAULT_COMPANY.email),
    phone: str(s.phone, DEFAULT_COMPANY.phone),
    website: str(s.website, DEFAULT_COMPANY.website),
    address_lines: lines(s.address_lines, DEFAULT_COMPANY.address_lines),
    default_validity_days: Number.isInteger(days) && days > 0 && days <= 365 ? days : DEFAULT_COMPANY.default_validity_days,
    notify_email: str(s.notify_email, ""),
    trust: trust.length === 3 ? trust : DEFAULT_COMPANY.trust,
    notes: lines(s.notes, DEFAULT_COMPANY.notes),
    warranty: str(s.warranty, DEFAULT_COMPANY.warranty),
  };
}

/** Public read (anon RPC); falls back to defaults on any failure so the sheet always renders. */
export async function getCompanySettings(): Promise<CompanySettings> {
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/get_app_settings`, {
      method: "POST", headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "Content-Type": "application/json" }, body: "{}", cache: "no-store",
    });
    if (!res.ok) return DEFAULT_COMPANY;
    return resolveCompany(await res.json());
  } catch { return DEFAULT_COMPANY; }
}
