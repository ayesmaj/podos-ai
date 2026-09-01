# 01 - CURRENT SYSTEM AUDIT
2026-09-01, commit 053ae8a. Sources: 6-agent repo audit (F1-F12 adversarial
findings), 4-agent ACP-reference study, live Supabase inspection. Supersedes
nothing; extends docs/private-estimator/PRIVATE_ESTIMATOR_AUDIT.md.

## Already built and verified (Phase A, live on www.podosai.com)
- /proposal/invite/[token] invitation access screen (masked email, policy
  otp|email-confirm), OTP issue/verify (10-min TTL, 5 attempts, 3/hr),
  HttpOnly viewer sessions (7d), /proposal/[uuid] session-bound workspace v1.
- /admin/login -> opaque 12h DB sessions; ?key= gate deleted; /admin/pricing
  gated; per-proposal Secure Access invitations panel.
- src/proxy.ts private headers (X-Robots-Tag, no-store, no-referrer, DENY,
  nosniff, HSTS) on /e /proposal /admin /estimate; robots.txt no longer
  advertises private prefixes.
- /estimate public estimator REMOVED (notice only). /api/estimate-request
  recomputes money server-side (verified: absurd client cents ignored).
- DB: 10 tables RLS deny-all + SECURITY DEFINER RPCs, tokens SHA-256, all
  paths tested (invalid/expired/revoked uniform, cross-proposal 404, rate
  limiter blocks at limit+1). Contract in supabase/migrations/.

## Browser-only state still in play (to eliminate)
- src/data/configuratorPricing.ts: whole price book as TS const, DOLLARS not
  cents, approved:false. Publishing = git commit.
- /admin/pricing + usePricingOverride: localStorage podos:pricing-preview is
  the editor's only store; copy/download JSON is the publish workflow.
- src/data/configuratorCatalog.ts: 649-line hardcoded catalog with
  requires/excludes rules and lead times; zero DB representation.
- src/server/configurator/pricing.ts: real cents-based server engine EXISTS
  but is unused; the live calculator is the browser engine estimate.ts.

## Public/insecure remnants
- Legacy /e/[token]: link possession alone still renders the full estimate
  and can sign. Admin UI still prints these links on create/rotate.
- PRICING placeholder dollars are bundled into PUBLIC marketing JS chunks:
  SiteChrome/Footer/HeroVideoNarrative import PRICING to read .approved
  (fix: extract the flag into its own module).
- Anon key + project URL hardcoded as fallbacks in 6 files (defensible via
  RLS deny-all; documented, kept).
- /api/estimate-request open unauthenticated write for a retired flow
  (rate-limited; keep hardened, feeds future workspace).

## Missing vs master section 23: 24 of 28 entities have NO table
(users, roles, organizations, contacts, projects, deployment_sites,
site_files, proposal_versions, proposal_selections, proposal_line_items,
pricing_snapshots, catalog_*, pricing_rules, compatibility_rules,
warranty_plans, service_plans, proposal_approvals, proposal_documents,
proposal_comments, signature_requests, signature_signers, email_deliveries,
notifications, internal_notes, tasks, system_settings). Partial: access
policy column, per-session viewer email, single notes column,
admin-config singleton. Client intake surface today = 6 columns + config
jsonb; sections 9.2-9.4 fields are almost entirely missing.

## Status/roles deltas
7-state check constraint vs the 20-state model; zero user identity (one
shared secret, audit actor is the literal string 'admin') vs 8-role RBAC.

## ACP reference: operating model worth translating (never the brand)
- Revision model: estimates head row + estimate_revisions with locked_at +
  full snapshot_json frozen AT SIGNING (lockRevision) - signature pins the
  revision id and acceptedTotalCents.
- Two-description pattern: internal description vs customer_description,
  snapshotted onto the line item at add-time so price-book edits never
  rewrite history.
- Line items: section + optional tier (good/better/best) + optional flag +
  client-writable selected flag; internal unit_cost never serialized
  (publicTotals vs full totals; canSeeCost role gate).
- Event log as a product feature: append-only events where user_id null =
  client action; dashboard activity feed built from it.
- View tracking: counted only when sent && !signed; staff cookie excludes
  team; same ip+UA within 30 min dedupes to a lastViewed bump.
- Numbering computed from id (ACP-1042) - nothing to keep in sync.
Anti-patterns NOT to carry: raw session tokens in DB, owner-fallback auth,
deposit/balance consumer model, single-signer canvas as the legal mechanism,
print-CSS screenshot PDF, duplicated admin-preview vs client-view layouts.
