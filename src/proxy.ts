import { NextResponse } from "next/server";

/**
 * proxy.ts — security headers for the private surfaces (Next 16: proxy
 * replaces middleware; Node runtime; one file per project).
 *
 * Closes audit F4/F5/F6: previously NO real security headers existed anywhere
 * — robots was a <meta> tag only, tokens could leak via Referer, and the
 * private pages were frameable. Headers here are authoritative for crawlers
 * and non-HTML fetches in a way metadata can never be.
 *
 * This is header decoration only — never authorization. Sessions are checked
 * server-side in the pages/actions themselves (Next's own guidance: proxy is
 * for optimistic checks, not auth).
 */

const PRIVATE_HEADERS: Record<string, string> = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
  "Cache-Control": "private, no-store",
  // A bearer token lives in /e/* and /proposal/invite/* URLs — no referrer, ever.
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
};

export function proxy() {
  const response = NextResponse.next();
  for (const [k, v] of Object.entries(PRIVATE_HEADERS)) {
    response.headers.set(k, v);
  }
  return response;
}

export const config = {
  matcher: ["/e/:path*", "/proposal/:path*", "/admin/:path*", "/estimate"],
};
