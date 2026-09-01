# DATABASE_SCHEMA_PLAN.md

Live in Supabase podos-invest (buqghwxjjksqperiamag); SQL mirrored in
supabase/migrations/. RLS deny-all everywhere; access ONLY via SECURITY
DEFINER functions; every token SHA-256 at rest; money = bigint minor units.

## Tables (built, verified by test this session)
- estimates - proposal core: estimate_no (display), token_hash (legacy link
  tier), client/company/project, config jsonb, line_items jsonb, low/high/
  recurring cents, status machine (draft -> sent -> viewed -> signed |
  declined | expired | revoked), view counters, signer, expiry, revoked.
- estimate_views - one row per open (UA/referrer, timestamp).
- proposal_invitations - per-recipient: email, name, policy otp or
  email-confirm, token_hash unique, issued/expires, revoked, exchanged_at.
- proposal_sessions - invitation/estimate FKs, viewer_email, token_hash,
  7-day expiry, last_seen, revoked (cascades on invitation revoke - tested).
- otp_codes - code_hash, 10-min expiry, attempts cap 5, consumed_at; issue
  throttle 3/hr/invitation (tested: 4th raises).
- activity_events - estimate/invitation FKs, actor, event, metadata; feeds
  per-viewer analytics (brief section 17).
- audit_logs - actor, action, entity, detail (admin logins/failures,
  invitation create/revoke, ...).
- admin_sessions - opaque staff sessions (12h, revocable).
- rate_counters + rate_check() - durable fixed-window limiter (tested:
  blocks at call 4 of limit 3).
- estimate_admin_config - singleton shared secret (rotate via
  set_admin_secret, current + new required; value never printed).

## Functions (all tested this session)
Client path: invitation_status, issue_otp, verify_invitation,
session_proposal, sign_via_session. Legacy: get_estimate_by_token,
sign_estimate_by_token. Admin: admin_login/valid/logout, create_estimate,
list_estimates, revoke_estimate, rotate_estimate_token, create_invitation,
list_invitations, revoke_invitation, list_activity, request_estimate (public
inbound, flood-guarded). Internal-only (EXECUTE revoked from anon): _hash,
_rand_token, _check_admin, _secret_for_session.

## Next phase (normalization toward brief section 21)
organizations, contacts, projects, deployment_sites, site_files,
proposal_versions (immutable snapshots + status machine of section 10),
proposal_selections (step-keyed configurator state), catalog_categories/
items/item_versions, pricing_rules, compatibility_rules, warranty_plans,
pricing_snapshots, proposal_line_items, signature_requests/signers,
notifications, tasks. Approach: additive tables; estimates becomes the
proposal head row; current jsonb config/line_items become the v1 snapshot in
proposal_versions row 1. Human numbers move to POD-EST-YYYY-NNNN then.
