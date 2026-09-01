# 05 - SECURITY MODEL
Base = Phase A, all properties verified by test (see 01). Summary + deltas.

## Access chains
Client: invitation token (hashed, expiring, revocable, per-recipient,
one-time-exchange marker) -> OTP or authorized-email verification ->
opaque 7d session (hashed, revocable, cascade-revoked with invitation) ->
clean route bound to exactly one proposal. Invalid=expired=revoked=uniform.
Admin: secret -> POST-only login (per-IP rate limit, failures audited) ->
opaque 12h DB session cookie. Secret never in URLs/cookies.

## Enforced everywhere
Server-side authorization inside every RPC (UI hiding is never the
control); durable DB rate limiting; append-only audit_logs for privileged
actions; private headers via proxy (see 03); no tokens in referrers
(no-referrer), analytics, or logs; money server-computed only.

## Gaps -> phased
- Roles: single-role admin now; users/roles/user_roles tables land in wave 2,
  Supabase Auth + 8-role matrix (SUPER_ADMIN..READ_ONLY) enforced inside
  RPCs in the roles phase; per-user audit attribution replaces 'admin'.
- Storage: site_files/proposal_documents tables exist from wave 2; Supabase
  Storage private buckets + signed URLs + MIME/size limits land with uploads
  and PDF phases; every download logged.
- CSP + nonces: staged (inline styles must go first). MFA: with Supabase
  Auth. Malware scanning: integration point documented, provider is a
  founder decision.
- Legacy /e possession tier: dual-lookup keeps old links alive but logged;
  sunset = rotate/revoke remaining tokens, then estimates.token_hash
  becomes nullable and the legacy RPC is revoked.
