import { PROPOSAL_ASSETS, type ProposalAssetType } from "@/lib/proposals/imagePrompts";

/**
 * assets.ts — where the document's controlled visuals come from.
 *
 * Shipped defaults live in /public/visuals/proposal (generated once with
 * scripts/generate-proposal-assets.mts). The admin tool at /ops/design can
 * regenerate an asset with GPT Image 2; the result is stored in the DB
 * (proposal_assets, webp bytes) and served by /api/proposal-assets/[type],
 * overriding the shipped file. No client data is ever in these images.
 */

if (typeof window !== "undefined") throw new Error("src/lib/proposals/assets.ts is server-only");

const URL_BASE = process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
const ANON_KEY = process.env.PODOS_SUPABASE_ANON_KEY ?? "sb_publishable_1W4q68h6ES47vNdJZVsq7g_p88eLPi5";

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/${fn}`, {
      method: "POST", headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(args), cache: "no-store",
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : null;
  } catch { return null; }
}

export interface PrintAssets { logo: string; logoOnDark: string; cover: string | null; cutaway: string | null; deployment: string | null }
export const STATIC_ASSETS: PrintAssets = {
  logo: "/logo.png",
  logoOnDark: "/visuals/proposal/logo-lockup-white.png",
  cover: "/visuals/proposal/cover-pod-hero.webp",
  cutaway: "/visuals/proposal/system-cutaway.webp",
  deployment: "/visuals/proposal/deployment-site.webp",
};
export const ASSET_TYPES = Object.keys(PROPOSAL_ASSETS) as ProposalAssetType[];
export const isAssetType = (v: string): v is ProposalAssetType => (ASSET_TYPES as string[]).includes(v);

/** Shipped defaults, overridden by any admin-generated asset (cache-busted by content hash). */
export async function resolveAssetUrls(): Promise<PrintAssets> {
  const idx = (await rpc<{ type: string; sha256: string }[]>("proposal_asset_index", {})) ?? [];
  const out: PrintAssets = { ...STATIC_ASSETS };
  for (const r of idx) if (isAssetType(r.type)) out[r.type] = `/api/proposal-assets/${r.type}.webp?v=${r.sha256.slice(0, 12)}`;
  return out;
}

export interface AssetRow { type: ProposalAssetType; prompt: string; size: string; model: string; sha256: string; bytes: number; generated_at: string; generated_by: string | null }
export const listProposalAssets = (secret: string) => rpc<AssetRow[]>("list_proposal_assets", { p_admin_secret: secret });
export const getProposalAsset = async (type: ProposalAssetType) =>
  ((await rpc<{ webp_b64: string; sha256: string; generated_at: string }[]>("get_proposal_asset", { p_type: type })) ?? [])[0] ?? null;
export const upsertProposalAsset = (secret: string, type: ProposalAssetType, webpB64: string, by: string) =>
  rpc<{ type: string; sha256: string; bytes: number }>("upsert_proposal_asset", {
    p_admin_secret: secret, p_type: type, p_prompt: PROPOSAL_ASSETS[type].prompt, p_size: PROPOSAL_ASSETS[type].size, p_webp_b64: webpB64, p_by: by,
  });
export const deleteProposalAsset = (secret: string, type: ProposalAssetType) => rpc<boolean>("delete_proposal_asset", { p_admin_secret: secret, p_type: type });

/**
 * GPT Image 2 EDIT of the approved reference renders (never text-to-image, so
 * the product shape is preserved). Returns webp bytes ready for the store.
 * The API key is read here and never leaves the server.
 */
export async function generateProposalAsset(type: ProposalAssetType, references: Buffer[], quality: "low" | "medium" | "high" = "high"): Promise<{ webp: Buffer; bytes: number }> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not configured on the server");
  const spec = PROPOSAL_ASSETS[type];
  const form = new FormData();
  form.set("model", "gpt-image-2");
  form.set("prompt", spec.prompt);
  form.set("size", spec.size);
  form.set("quality", quality);
  form.set("n", "1");
  form.set("output_format", "png");
  references.forEach((buf, i) => form.append("image[]", new Blob([new Uint8Array(buf)], { type: "image/png" }), `ref-${i}.png`));
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const res = await fetch(`${base}/images/edits`, { method: "POST", headers: { Authorization: `Bearer ${key}` }, body: form });
  const payload = (await res.json().catch(() => null)) as { data?: { b64_json?: string }[]; error?: { message?: string } } | null;
  if (!res.ok) throw new Error(`Image API ${res.status}: ${(payload?.error?.message ?? "request failed").replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]")}`);
  const b64 = payload?.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image API returned no image");
  const sharp = (await import("sharp")).default;
  const webp = await sharp(Buffer.from(b64, "base64")).webp({ quality: 86 }).toBuffer();
  return { webp, bytes: webp.length };
}
