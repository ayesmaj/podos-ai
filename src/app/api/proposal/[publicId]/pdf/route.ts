import { cookies } from "next/headers";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { ProposalPdf, type PdfData } from "@/lib/proposals/ProposalPdf";
import { VIEWER_COOKIE, getSelections, sessionProposal } from "@/lib/proposals/access";
import { ADMIN_COOKIE, ADMIN_SECRET, adminSessionValid, getProposalFull } from "@/lib/estimates/admin";
import { docFromFull, docFromSession, skuNameMap, type ProposalFull } from "@/lib/proposals/document";

/**
 * GET /api/proposal/[publicId]/pdf — the six-page branded proposal PDF.
 *
 * Dual auth (files are private; master brief §26): a viewer session bound to
 * THIS proposal, or an admin session (staff preview). Neither → 404. The
 * document is built from the same DocData mapper as the web preview, so the
 * download matches what was read online. Wordmark + cover pod are read from
 * /public on the server (never fetched over HTTP). private, no-store.
 */

export const dynamic = "force-dynamic";
const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;

async function dataUri(rel: string, mime: string): Promise<string | null> {
  const abs = path.join(process.cwd(), "public", rel);
  if (!existsSync(abs)) return null;
  return `data:${mime};base64,${(await readFile(abs)).toString("base64")}`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) return new Response("Not found", { status: 404 });

  const jar = await cookies();
  const names = await skuNameMap();
  let data: PdfData | null = null;
  const logo = (await dataUri("logo.png", "image/png")) ?? "";
  const pod = await dataUri("visuals/menu/pdf-cover-pod.png", "image/png");

  // 1) viewer session bound to this proposal
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (session) {
    const p = await sessionProposal(session);
    if (p && p.public_id === publicId) {
      const selections = (await getSelections(session)) as Record<string, Record<string, unknown>>;
      data = { ...docFromSession(p, selections, names), logo, pod, viewerEmail: p.viewer_email };
    }
  }

  // 2) admin session (staff preview)
  if (!data) {
    const adminTok = jar.get(ADMIN_COOKIE)?.value ?? "";
    if (adminTok && (await adminSessionValid(adminTok))) {
      const full = (await getProposalFull(ADMIN_SECRET, publicId)) as ProposalFull | null;
      if (full?.head) data = { ...docFromFull(full, names), logo, pod, viewerEmail: "ADMIN PREVIEW" };
    }
  }

  if (!data) return new Response("Not found", { status: 404 });

  try {
    const buffer = await renderToBuffer(ProposalPdf({ data }));
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${data.estimateNo}-PODOS-proposal.pdf"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      },
    });
  } catch (err) {
    console.error("[proposal/pdf] render failed:", err instanceof Error ? err.message : "unknown");
    return new Response("PDF unavailable", { status: 500 });
  }
}
