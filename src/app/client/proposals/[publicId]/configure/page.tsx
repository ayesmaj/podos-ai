import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { VIEWER_COOKIE, getSelections, sessionProposal } from "@/lib/proposals/access";
import Configurator, { type CatalogOption } from "./Configurator";

/**
 * /client/proposals/[publicId]/configure — the session-gated client workspace
 * (master brief 9). Loads the viewer's saved step selections and the DB-backed
 * catalog options for the product steps, then hands them to the client
 * Configurator. No marketing chrome (utility bar only); session-bound to this
 * one proposal.
 */

export const metadata: Metadata = {
  title: "Configure your proposal | PODOS AI",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;
const mono: React.CSSProperties = { fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)" };

const URL_BASE = process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
const ANON_KEY = process.env.PODOS_SUPABASE_ANON_KEY ?? "sb_publishable_1W4q68h6ES47vNdJZVsq7g_p88eLPi5";

interface RawCatalog { category: string | null; sku: string; name: string; short_description: string | null; price_cents: number | null; billing_frequency: string; needs_business_verification: boolean; }

/** Public catalog for the client's option cards — no admin secret, no cost. */
async function publicCatalog(): Promise<Record<string, CatalogOption[]>> {
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/public_catalog`, {
      method: "POST", headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "Content-Type": "application/json" },
      body: "{}", cache: "no-store",
    });
    if (!res.ok) return {};
    const rows = (await res.json()) as RawCatalog[];
    const bySlug: Record<string, CatalogOption[]> = {};
    for (const r of rows) {
      const slug = r.category ?? "other";
      (bySlug[slug] ??= []).push({
        sku: r.sku, name: r.name, short_description: r.short_description,
        price_cents: r.price_cents, billing_frequency: r.billing_frequency,
        pending: r.needs_business_verification,
      });
    }
    return bySlug;
  } catch {
    return {};
  }
}

export default async function ConfigurePage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();

  const jar = await cookies();
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (!session) notFound();

  const p = await sessionProposal(session);
  if (!p || p.public_id !== publicId) notFound();

  const [selections, catalog] = await Promise.all([getSelections(session), publicCatalog()]);
  // catalog is keyed by category NAME from the RPC; remap to category slug used by steps
  const bySlug: Record<string, CatalogOption[]> = {};
  const NAME_TO_SLUG: Record<string, string> = {
    "PODOS Platform": "platform", "Compute": "compute", "Cooling": "cooling",
    "Power & Electrical": "power", "Network & Storage": "network",
  };
  for (const [name, opts] of Object.entries(catalog)) {
    bySlug[NAME_TO_SLUG[name] ?? name] = opts;
  }

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      {/* utility bar (NOT marketing nav) */}
      <header style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", padding: "0.7rem clamp(1rem,3vw,2rem)", borderBottom: "1px solid var(--edge)", background: "var(--panel)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--ink-strong)" }}>PODOS</span>
        <span style={mono}>{p.estimate_no} · Configure</span>
        <span style={{ ...mono, color: "var(--brand-deep)", border: "1px solid rgba(37,99,235,.35)", background: "rgba(37,99,235,.06)", borderRadius: 999, padding: "0.2rem 0.6rem" }}>Confidential</span>
        <Link href={`/client/proposals/${publicId}`} style={{ ...mono, color: "var(--brand)", marginLeft: "auto", textDecoration: "none" }}>← Proposal</Link>
        <span style={mono}>{p.viewer_email}</span>
      </header>

      <Configurator
        publicId={publicId}
        viewerEmail={p.viewer_email}
        company={p.company}
        catalogByCategory={bySlug}
        initial={(selections ?? {}) as Record<string, Record<string, unknown>>}
      />
    </div>
  );
}
