import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { menuImage } from "@/lib/proposals/menu-manifest";
import { notFound } from "next/navigation";
import { LogOut } from "lucide-react";
import { VIEWER_COOKIE, getSelections, previewEstimate, sessionProposal } from "@/lib/proposals/access";
import { STEPS } from "@/lib/proposals/steps";
import ClientBar from "@/components/private/ClientBar";
import Configurator, { type CatalogOption } from "./Configurator";
import s from "@/components/private/private.module.css";

/**
 * /client/proposals/[publicId]/configure — server wrapper for the guided
 * configurator. Loads the viewer's saved steps, the server-computed estimate
 * preview, the client-safe catalog (never cost) and the menu-illustration map
 * (only images that exist on disk), then hands everything to the client
 * Configurator. Intake-only; read-only once submitted.
 */

export const metadata: Metadata = {
  title: "Configure your PODOS deployment",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;
const EDITABLE = new Set(["draft", "sent", "client_invited", "viewed", "client_configuring", "revision_required"]);
const URL_BASE = process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
const ANON_KEY = process.env.PODOS_SUPABASE_ANON_KEY ?? "sb_publishable_1W4q68h6ES47vNdJZVsq7g_p88eLPi5";
const NAME_TO_SLUG: Record<string, string> = {
  "PODOS Platform": "platform", "Compute": "compute", "Cooling": "cooling",
  "Power & Electrical": "power", "Network & Storage": "network",
  "Deployment & Site": "deployment", "Warranty & Support": "support",
};

interface RawCatalog { category: string | null; sku: string; name: string; short_description: string | null; price_cents: number | null; billing_frequency: string; needs_business_verification: boolean; }

async function publicCatalog(): Promise<Record<string, CatalogOption[]>> {
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/public_catalog`, {
      method: "POST", headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "Content-Type": "application/json" }, body: "{}", cache: "no-store",
    });
    if (!res.ok) return {};
    const rows = (await res.json()) as RawCatalog[];
    const out: Record<string, CatalogOption[]> = {};
    for (const r of rows) {
      const slug = NAME_TO_SLUG[r.category ?? ""] ?? (r.category ?? "other").toLowerCase();
      // "pending" is client-facing: an option with NO price is pending engineering
      // review. needs_business_verification stays an internal flag (visible in
      // /ops/pricing) — for the client, every figure is already labeled preliminary.
      (out[slug] ??= []).push({ sku: r.sku, name: r.name, short_description: r.short_description, price_cents: r.price_cents, billing_frequency: r.billing_frequency, pending: r.price_cents == null });
    }
    return out;
  } catch { return {}; }
}

/** Menu illustrations per SKU from the static manifest (no fs probes — see menu-manifest.ts). */
function imageMap(catalog: Record<string, CatalogOption[]>): Record<string, string> {
  const map: Record<string, string> = {};
  for (const opts of Object.values(catalog)) for (const o of opts) {
    const rel = menuImage(o.sku);
    if (rel) map[o.sku] = rel;
  }
  return map;
}

export default async function ConfigurePage({ params, searchParams }: { params: Promise<{ publicId: string }>; searchParams: Promise<{ step?: string }> }) {
  const { publicId } = await params;
  const { step } = await searchParams;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();

  const jar = await cookies();
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (!session) notFound();
  const p = await sessionProposal(session);
  if (!p || p.public_id !== publicId) notFound();

  const [selections, catalog, estimate] = await Promise.all([getSelections(session), publicCatalog(), previewEstimate(session)]);
  const images = imageMap(catalog);
  const initialStep = step === "review" ? STEPS.length - 1 : Math.max(0, STEPS.findIndex((x) => x.id === step));
  const preparedFor = p.company ? `${p.client_name} / ${p.company}` : p.client_name;

  return (
    <div className={`${s.root} ${s.field}`}>
      <ClientBar
        publicId={publicId} project={p.project_name} preparedFor={preparedFor} label="Confidential configurator"
        right={<Link href={`/client/proposals/${publicId}`} className={`${s.btn} ${s.btnGhost}`} style={{ fontSize: 13 }}><LogOut size={14} aria-hidden /> Exit</Link>}
      />
      <Configurator
        publicId={publicId}
        viewerEmail={p.viewer_email}
        company={p.company}
        project={p.project_name}
        catalogByCategory={catalog}
        images={images}
        initial={(selections ?? {}) as Record<string, Record<string, unknown>>}
        initialEstimate={estimate}
        locked={!EDITABLE.has(p.status)}
        initialStep={initialStep < 0 ? 0 : initialStep}
      />
    </div>
  );
}
