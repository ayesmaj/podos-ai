import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_SECRET, adminSessionValid, getStoredPdf } from "@/lib/estimates/admin";

/**
 * GET /api/proposal/[publicId]/pdf/stored[?rev=N] — the immutable PDF that was
 * generated and stored when the version was released (admin only). This is the
 * audit copy: re-rendering the live document can differ if data changed later.
 */

export const dynamic = "force-dynamic";
const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;

export async function GET(req: Request, { params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) return new Response("Not found", { status: 404 });
  const admin = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  if (!admin || !(await adminSessionValid(admin))) return new Response("Not found", { status: 404 });
  const rev = Number(new URL(req.url).searchParams.get("rev"));
  const row = await getStoredPdf(ADMIN_SECRET, publicId, Number.isInteger(rev) && rev > 0 ? rev : undefined);
  if (!row) return new Response("No stored PDF for this version", { status: 404 });
  return new Response(new Uint8Array(Buffer.from(row.pdf_b64, "base64")), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${publicId}-rev${row.rev}-PODOS-proposal.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      "X-Document-SHA256": row.sha256,
    },
  });
}
