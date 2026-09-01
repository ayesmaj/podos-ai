# 03 - ROUTE ARCHITECTURE

## Final route map
CLIENT
- /e/[token]            unified invitation entry (NEW canonical). Dual-lookup
                        during migration: proposal_invitations first (access
                        screen -> verify -> session), else legacy
                        estimates.token_hash (link-tier view, logged
                        'legacy_link_used'). Uniform not-active screen else.
- /client/proposals/[publicId]   clean session-bound workspace (publicId =
                        POD-EST-2026-NNNN; the internal uuid NEVER appears
                        in URLs again).
- /client/proposals/[publicId]/configure|proposal|documents|sign  (Phase 4+)
REDIRECTS (permanent): /proposal/invite/[t] -> /e/[t];
  /proposal/[uuid] -> resolved via session to /client/proposals/[publicId].
ADMIN (base /ops; /admin/* 308-redirects)
- /ops/login /ops /ops/proposals /ops/proposals/[id] /ops/clients
  /ops/catalog /ops/pricing ... expanding per master 6.1 as phases land.
API: /api/proposal/verify, /api/proposal/request-otp (token-scoped,
rate-limited); /api/estimate-request (public, server-priced).

## Identifiers
uuid = internal only. estimate_no (PODOS-100x) = frozen legacy display.
public_id = POD-EST-YYYY-NNNN unique, URL-safe, backfilled for all rows;
versions later display as POD-PR-YYYY-NNNN-Vnn.

## Cookies (rename-safe)
Viewer podos_proposal_session and admin podos_admin_session both move to
Path=/ (was /proposal, /admin - the old scoping would silently break on
route renames). HttpOnly, Secure always; viewer SameSite=Lax (email-link
arrivals), admin Strict.

## Headers
src/proxy.ts matcher covers OLD + NEW prefixes IN THE SAME COMMIT as any
route addition (no unprotected deploy window): /e, /proposal, /client,
/admin, /ops, /estimate. Same header set as Phase A. CSP+nonce staged for
the phase that owns all inline styles on private surfaces.
