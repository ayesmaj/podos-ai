import { getProposalAsset, isAssetType } from "@/lib/proposals/assets";

/**
 * GET /api/proposal-assets/[type].webp — an admin-generated document visual
 * from the DB store. Public (the images contain no client data); cached hard
 * because the URL carries the content hash (?v=…). 404 → the print falls
 * back to the shipped file in /public.
 */

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const t = type.replace(/\.webp$/i, "");
  if (!isAssetType(t)) return new Response("Not found", { status: 404 });
  const row = await getProposalAsset(t);
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(Buffer.from(row.webp_b64, "base64")), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=3600, s-maxage=31536000, immutable",
      ETag: `"${row.sha256}"`,
      "X-Robots-Tag": "noindex",
    },
  });
}
