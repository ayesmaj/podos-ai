import { cookies } from "next/headers";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { ProposalPdf, type PdfData, type PdfLine } from "@/lib/proposals/ProposalPdf";
import { VIEWER_COOKIE, sessionProposal } from "@/lib/proposals/access";
import { ADMIN_COOKIE, ADMIN_SECRET, adminSessionValid, getProposalFull } from "@/lib/estimates/admin";

/**
 * GET /api/proposal/[publicId]/pdf — the branded proposal PDF.
 *
 * Dual auth (master brief 26 — files are private, authorized before access):
 *  - a valid viewer session bound to THIS proposal, or
 *  - a valid admin session (staff preview / "view as client").
 * Neither → 404, identical to any other miss. The document is rendered
 * server-side from structured data; nothing is cached (private, no-store).
 */

export const dynamic = "force-dynamic";
const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;

function fmt(d: string | null | undefined) {
  return d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null;
}

export async function GET(_req: Request, { params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) return new Response("Not found", { status: 404 });

  const jar = await cookies();
  let data: PdfData | null = null;
  // Wordmark for the cover — read from /public on the server, never fetched over HTTP.
  const logo = "data:image/png;base64," +
    (await readFile(path.join(process.cwd(), "public", "logo.png"))).toString("base64");

  // 1) viewer session bound to this proposal
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (session) {
    const p = await sessionProposal(session);
    if (p && p.public_id === publicId) {
      data = {
        estimate_no: p.estimate_no, rev: 1, client_name: p.client_name, company: p.company,
        project_name: p.project_name, viewer_email: p.viewer_email, status: p.status,
        one_time_low_cents: p.one_time_low_cents, one_time_high_cents: p.one_time_high_cents,
        recurring_cents: p.recurring_cents,
        line_items: (p.line_items as unknown as { name: string; qty: number; unit_price_cents: number; recurring: boolean; pending_review?: boolean }[])
          .map<PdfLine>((l) => ({ name: l.name, qty: l.qty, unit_price_cents: l.unit_price_cents, recurring: l.recurring, pending_review: l.pending_review })),
        logo, issued: fmt(p.created_at) ?? "", expires: fmt(p.expires_at),
      };
    }
  }

  // 2) admin session (staff preview)
  if (!data) {
    const adminTok = jar.get(ADMIN_COOKIE)?.value ?? "";
    if (adminTok && (await adminSessionValid(adminTok))) {
      const full = (await getProposalFull(ADMIN_SECRET, publicId)) as {
        head?: { estimate_no: string; client_name: string; company: string | null; project_name: string | null; status: string; one_time_low_cents: number; one_time_high_cents: number; recurring_cents: number; expires_at: string | null; created_at: string };
        version?: { rev: number };
        line_items?: { name: string; qty: number; unit_price_cents: number; recurring: boolean; pending_review: boolean; client_visible: boolean }[];
      } | null;
      if (full?.head) {
        data = {
          estimate_no: full.head.estimate_no, rev: full.version?.rev ?? 1,
          client_name: full.head.client_name, company: full.head.company,
          project_name: full.head.project_name, viewer_email: "ADMIN PREVIEW",
          status: full.head.status, one_time_low_cents: full.head.one_time_low_cents,
          one_time_high_cents: full.head.one_time_high_cents, recurring_cents: full.head.recurring_cents,
          line_items: (full.line_items ?? []).filter((l) => l.client_visible)
            .map<PdfLine>((l) => ({ name: l.name, qty: l.qty, unit_price_cents: l.unit_price_cents, recurring: l.recurring, pending_review: l.pending_review })),
          logo, issued: fmt(full.head.created_at) ?? "", expires: fmt(full.head.expires_at),
        };
      }
    }
  }

  if (!data) return new Response("Not found", { status: 404 });

  const buffer = await renderToBuffer(ProposalPdf({ data }));
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${data.estimate_no}-PODOS.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
    },
  });
}
