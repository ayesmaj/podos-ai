import { existsSync } from "node:fs";
import path from "node:path";
import type { DocData, DocLine, DocSpec } from "@/components/private/ProposalDocument";
import type { SessionProposal } from "@/lib/proposals/access";
import { STEPS, STEP_CATEGORY } from "@/lib/proposals/steps";

/**
 * document.ts — server-only mappers that turn the two proposal payload shapes
 * (client session_proposal, admin get_proposal_full) into ONE DocData used by
 * the web document and the PDF. Keeping the mapping here guarantees the
 * client's preview, the admin's preview and the downloaded PDF never drift.
 */

if (typeof window !== "undefined") throw new Error("src/lib/proposals/document.ts is server-only");

type Payload = Record<string, unknown>;

/** Only images that actually exist under public/visuals/menu/. */
export function menuImages(skus: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const sku of skus) {
    const rel = `/visuals/menu/${sku.toLowerCase()}.webp`;
    if (existsSync(path.join(process.cwd(), "public", rel))) out[sku] = rel;
  }
  const hero = "/visuals/menu/hero-pod-schematic.webp";
  if (existsSync(path.join(process.cwd(), "public", hero))) out.hero = hero;
  return out;
}

export function specFromSelections(
  selections: Record<string, Payload>,
  skuNames: Record<string, string>
): DocSpec {
  const pr = selections.project ?? {};
  const site = selections.site ?? {};
  const chosen = Object.entries(STEP_CATEGORY).flatMap(([step]) => {
    const sku = selections[step]?.sku as string | undefined;
    if (!sku) return [];
    return [{ step, label: STEPS.find((x) => x.id === step)?.title ?? step, name: skuNames[sku] ?? sku, sku }];
  });
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined);
  return {
    pods: num(pr.pod_quantity), capacity_mw: num(pr.required_capacity_mw), gpus: num(pr.expected_gpus),
    workload: typeof pr.workload === "string" && pr.workload ? pr.workload : undefined,
    golive: typeof pr.target_golive === "string" && pr.target_golive ? pr.target_golive : undefined,
    site: (typeof site.site_name === "string" && site.site_name) || (typeof site.address === "string" && site.address) || undefined,
    site_type: typeof site.site_type === "string" && site.site_type ? site.site_type : undefined,
    chosen,
  };
}

interface RawLine {
  name: string; customer_description?: string | null; category_slug?: string | null;
  qty: number; unit_price_cents: number; extended_cents?: number;
  recurring: boolean; pending_review: boolean; optional?: boolean; client_visible?: boolean;
}
const toLine = (l: RawLine): DocLine => ({
  name: l.name, customer_description: l.customer_description ?? null, category_slug: l.category_slug ?? null,
  qty: Number(l.qty), unit_price_cents: Number(l.unit_price_cents),
  extended_cents: l.extended_cents != null ? Number(l.extended_cents) : Math.round(Number(l.qty) * Number(l.unit_price_cents)),
  recurring: !!l.recurring, pending_review: !!l.pending_review, optional: !!l.optional,
});

/** Client side: from session_proposal + get_selections. */
export function docFromSession(p: SessionProposal, selections: Record<string, Payload>, skuNames: Record<string, string>): DocData {
  const lines = (p.line_items as unknown as RawLine[]).map(toLine);
  const spec = specFromSelections(selections, skuNames);
  return {
    publicId: p.public_id, estimateNo: p.estimate_no, rev: 1, status: p.status,
    clientName: p.client_name, company: p.company, project: p.project_name, contactEmail: p.viewer_email,
    issued: p.created_at, expires: p.expires_at,
    lowCents: p.one_time_low_cents, highCents: p.one_time_high_cents, recurringCents: p.recurring_cents,
    lineItems: lines, spec, images: menuImages([...spec.chosen.map((c) => c.sku), "POD-BASE"]),
    signedAt: p.signed_at, signerName: p.signer_name,
  };
}

export interface ProposalFull {
  head: {
    public_id: string; estimate_no: string; client_name: string; client_email: string | null; company: string | null;
    project_name: string | null; status: string; one_time_low_cents: number; one_time_high_cents: number;
    recurring_cents: number; expires_at: string | null; created_at: string; signed_at: string | null; signer_name: string | null;
  };
  version: { id: string; rev: number; status: string; locked_at: string | null } | null;
  line_items: RawLine[];
  selections: Record<string, Payload>;
}

/** Admin side: from get_proposal_full. */
export function docFromFull(f: ProposalFull, skuNames: Record<string, string>): DocData {
  const lines = (f.line_items ?? []).filter((l) => l.client_visible !== false).map(toLine);
  const spec = specFromSelections(f.selections ?? {}, skuNames);
  return {
    publicId: f.head.public_id, estimateNo: f.head.estimate_no, rev: f.version?.rev ?? 1, status: f.head.status,
    clientName: f.head.client_name, company: f.head.company, project: f.head.project_name, contactEmail: f.head.client_email,
    issued: f.head.created_at, expires: f.head.expires_at,
    lowCents: f.head.one_time_low_cents, highCents: f.head.one_time_high_cents, recurringCents: f.head.recurring_cents,
    lineItems: lines, spec, images: menuImages([...spec.chosen.map((c) => c.sku), "POD-BASE"]),
    signedAt: f.head.signed_at, signerName: f.head.signer_name,
  };
}

/** sku -> display name, from the client-safe catalog RPC (no cost fields). */
export async function skuNameMap(): Promise<Record<string, string>> {
  const URL_BASE = process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
  const ANON_KEY = process.env.PODOS_SUPABASE_ANON_KEY ?? "sb_publishable_1W4q68h6ES47vNdJZVsq7g_p88eLPi5";
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/public_catalog`, {
      method: "POST", headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "Content-Type": "application/json" }, body: "{}", cache: "no-store",
    });
    if (!res.ok) return {};
    const rows = (await res.json()) as { sku: string; name: string }[];
    return Object.fromEntries(rows.map((r) => [r.sku, r.name]));
  } catch { return {}; }
}
