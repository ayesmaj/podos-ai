# SECURE_ROUTE_ARCHITECTURE.md

## Route map (target)

| Route | Access | Notes |
|---|---|---|
| /estimate | public, minimal | Private-access notice only. No estimator, no prices. noindex header + meta, no-store. Not in sitemap/nav. |
| /proposal/invite/[token] | invitation token | Step 00 access screen. Reveals ONLY masked recipient email + policy. Verify (OTP or authorized email) -> exchange for session -> cookie -> redirect. |
| /proposal/[id] | viewer session cookie | Clean client route (estimate UUID, never sequential). 404 without a valid session for THAT proposal. |
| /e/[token] | legacy link tier | Kept during migration as the link-only policy tier; sunset once invitations are the norm. Same headers. |
| /admin/login | public form | POST -> admin_login RPC (rate-limited). Sets opaque session cookie. |
| /admin/* | admin session | 404-identical without session. ?key= REMOVED entirely. |
| /api/proposal/* | token/session-scoped | verify, request-otp. All rate-limited via rate_check. |
| /api/estimate-request | public | Server recomputes money from the submitted selection; client-sent prices discarded (F8). |

## Sessions and cookies
- Viewer: podos_proposal_session - HttpOnly, Secure (always), SameSite=Lax
  (email-link arrivals), Path=/proposal, max 7 days. Value = opaque 256-bit
  token, stored hashed in proposal_sessions, revocable server-side.
- Admin: podos_admin_session - HttpOnly, Secure (always), SameSite=Strict,
  Path=/admin, 12h. Value = opaque token from admin_login; the shared secret
  itself never rides in a URL or cookie again.
- One-shot link-reveal cookie becomes HttpOnly (read server-side only).

## Headers (proxy.ts - Node runtime, Next 16 convention)
Matcher: /e/:path*, /proposal/:path*, /admin/:path*, /estimate.
Sets: X-Robots-Tag: noindex, nofollow, noarchive, nosnippet.
Cache-Control: private, no-store. Referrer-Policy: no-referrer.
X-Frame-Options: DENY. X-Content-Type-Options: nosniff.
Strict-Transport-Security: max-age=63072000; includeSubDomains.
CSP with per-request nonces is staged for the phase that owns all inline
styles on private routes (current pages use inline style attributes, which a
strict CSP would break; tracked in MIGRATION_PLAN).
robots.txt: /e/ and /admin/ disallow lines REMOVED - enumerating private
prefixes advertises them; the header is authoritative (F5).

## Rate limiting (durable, DB-backed - F3)
rate_check(bucket, key, max, window) on Postgres (serverless instances share
no memory). Buckets: verify per IP 10/5min, otp-issue per invitation 3/hr
(also DB-side), otp-verify 5 attempts/code, admin-login per IP 5/15min,
estimate-request per IP 5/hr. On block: uniform error, no oracle.

## Token rules
256-bit random, SHA-256 at rest, single purpose, expiring, revocable;
invitation marked exchanged_at on first success; raw values surface exactly
once. Invalid = revoked = expired = uniform 404/empty (no enumeration
oracle). Anon-key note: the publishable key appears as a code fallback; that
is safe ONLY because tables are RLS deny-all and every RPC self-authorizes -
that SQL now lives in supabase/migrations/ so the claim is auditable (F11).
