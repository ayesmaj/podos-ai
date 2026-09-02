import { cookies, headers } from "next/headers";
import { VIEWER_COOKIE } from "@/lib/proposals/access";
import { ADMIN_COOKIE, adminSessionValid } from "@/lib/estimates/admin";
import { printUrlToPdf, type PrintCookie } from "@/lib/proposals/pdf";

/**
 * GET /api/proposal/[publicId]/pdf — prints the caller's own print route with
 * headless Chrome and streams the PDF. The print route does the authorization
 * (viewer session bound to this proposal, or admin session) — this handler
 * only decides WHICH route to print and forwards the caller's cookie to it,
 * so there is exactly one document design and one auth path.
 *
 * ?mode=formal|preliminary is honoured for admins only (clients get the
 * released document).
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;
const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;

export async function GET(req: Request, { params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) return new Response("Not found", { status: 404 });

  const jar = await cookies();
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return new Response("Not found", { status: 404 });
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  const mode = new URL(req.url).searchParams.get("mode");

  let path: string | null = null;
  let cookie: PrintCookie | null = null;
  const viewer = jar.get(VIEWER_COOKIE)?.value;
  const admin = jar.get(ADMIN_COOKIE)?.value;
  if (viewer) { path = `/client/proposals/${publicId}/print`; cookie = { name: VIEWER_COOKIE, value: viewer }; }
  else if (admin && (await adminSessionValid(admin))) {
    path = `/ops/proposals/${publicId}/print${mode === "formal" || mode === "preliminary" ? `?mode=${mode}&` : "?"}`;
    cookie = { name: ADMIN_COOKIE, value: admin };
  }
  if (!path || !cookie) return new Response("Not found", { status: 404 });

  const target = `${proto}://${host}${path}${path.includes("?") ? "" : "?"}screen=0`;
  try {
    const { pdf, sha256 } = await printUrlToPdf(target, [cookie]);
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${publicId}-PODOS-proposal.pdf"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
        "X-Document-SHA256": sha256,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("[proposal/pdf] render failed:", msg);
    if (/returned 404/.test(msg)) return new Response("Not found", { status: 404 });
    // admins see the cause (clients never do) — the PDF service has no other observable surface
    const detail = cookie.name === ADMIN_COOKIE ? ` — ${msg.slice(0, 400)}` : "";
    return new Response(`PDF unavailable${detail}`, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
