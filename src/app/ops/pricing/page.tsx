import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_SECRET, adminSessionValid, usd } from "@/lib/estimates/admin";
import OpsShell from "@/components/ops/OpsShell";

/**
 * /ops/pricing — server-rendered view of the DATABASE catalog.
 *
 * Replaces the localStorage prototype editor (AdminPricingClient), which held
 * the price book in the browser, "published" via copy-JSON-into-source, and —
 * decisively — bundled every placeholder dollar figure into a publicly
 * fetchable JS chunk. This page is a server component: prices render only
 * into the HTML of an authenticated response, and no pricing ships in any
 * static chunk (master brief 3.3).
 *
 * Data: catalog_categories/items + pricing_rules imported from the prototype,
 * every row needs_business_verification=true until the founder approves real
 * values. Editing UI is the Phase-3 catalog manager
 * (docs/estimator/08-MIGRATION-PLAN.md); until then values change via the
 * database, not via a browser-local preview.
 */

export const metadata: Metadata = {
  title: "Pricing · PODOS ops",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

interface CatalogRow {
  category: string | null;
  sku: string;
  name: string;
  short_description: string | null;
  price_mode: string;
  price_cents: number | null;
  billing_frequency: string;
  needs_business_verification: boolean;
  published: boolean;
}

const URL_BASE =
  process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
const ANON_KEY =
  process.env.PODOS_SUPABASE_ANON_KEY ?? "sb_publishable_1W4q68h6ES47vNdJZVsq7g_p88eLPi5";

async function listCatalog(): Promise<CatalogRow[]> {
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/list_catalog`, {
      method: "POST",
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_admin_secret: ADMIN_SECRET }),
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as CatalogRow[];
  } catch {
    return [];
  }
}

const mono: React.CSSProperties = {
  fontSize: 10.5,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

export default async function OpsPricingPage() {
  const jar = await cookies();
  const tok = jar.get(ADMIN_COOKIE)?.value ?? "";
  if (!tok || !(await adminSessionValid(tok))) redirect("/ops/login");

  const rows = await listCatalog();
  const byCategory = new Map<string, CatalogRow[]>();
  for (const r of rows) {
    const key = r.category ?? "Uncategorized";
    byCategory.set(key, [...(byCategory.get(key) ?? []), r]);
  }

  return (
    <OpsShell active="/ops/pricing" title="Catalog & pricing">
      <div style={{ maxWidth: 1100 }}>
        <p style={{ color: "var(--ink-dim)", fontSize: 14, marginTop: ".8rem", maxWidth: "72ch", lineHeight: 1.6 }}>
          Database-backed catalog ({rows.length} items). Every value imported from the prototype is
          flagged <strong>needs verification</strong> and none are published to clients until the
          founder approves real figures. The editing UI arrives with the Phase-3 catalog manager.
        </p>

        {[...byCategory.entries()].map(([cat, items]) => (
          <section key={cat} style={{ marginTop: "1.8rem" }}>
            <h2 style={{ ...mono, fontSize: 11.5, color: "var(--brand-deep)" }}>{cat}</h2>
            <div style={{ marginTop: ".6rem", border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", overflow: "hidden" }}>
              {items.map((r, i) => (
                <div key={r.sku} style={{ display: "flex", gap: "1rem", alignItems: "baseline", flexWrap: "wrap", padding: ".7rem 1rem", borderTop: i === 0 ? "none" : "1px solid var(--edge-faint)" }}>
                  <span style={{ ...mono, fontSize: 10, color: "var(--ink-faint)", width: 120 }}>{r.sku}</span>
                  <span style={{ flex: "1 1 200px", fontSize: 14, color: "var(--ink-strong)", fontWeight: 500 }}>
                    {r.name}
                    <span style={{ display: "block", fontSize: 12, color: "var(--ink-faint)", fontWeight: 400 }}>
                      {r.short_description}
                    </span>
                  </span>
                  <span style={{ ...mono, fontSize: 10, color: "var(--ink-faint)" }}>{r.price_mode}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 13.5, color: "var(--ink-strong)", whiteSpace: "nowrap" }}>
                    {r.price_cents != null ? usd(r.price_cents) : "—"}
                    {r.billing_frequency === "per_year" ? " / yr" : ""}
                  </span>
                  <span style={{ ...mono, fontSize: 9.5, padding: ".18rem .5rem", borderRadius: 999,
                    ...(r.needs_business_verification
                      ? { color: "#B45309", border: "1px solid rgba(180,83,9,.4)", background: "rgba(180,83,9,.07)" }
                      : { color: "#15803D", border: "1px solid rgba(34,197,94,.45)", background: "rgba(34,197,94,.08)" }) }}>
                    {r.needs_business_verification ? "needs verification" : "verified"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </OpsShell>
  );
}
