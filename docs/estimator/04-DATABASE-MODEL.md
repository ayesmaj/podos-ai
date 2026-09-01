# 04 - DATABASE MODEL
Supabase podos-invest (buqghwxjjksqperiamag). Invariants: RLS deny-all,
SECURITY DEFINER RPC access only, SHA-256 tokens, bigint minor units,
pgcrypto NOT used (sha256()/gen_random_uuid() built-ins), contract mirrored
in supabase/migrations/.

## Wave 1 (built + tested)
estimates, estimate_views, estimate_admin_config, proposal_invitations,
proposal_sessions, otp_codes, activity_events, audit_logs, admin_sessions,
rate_counters. Functions: invitation_status, issue_otp, verify_invitation,
session_proposal, sign_via_session, admin_login/valid/logout,
create/list/revoke estimate+invitation, rotate token, list_activity,
request_estimate, rate_check, set_admin_secret.

## Wave 2 (THIS phase)
- estimates.public_id unique (POD-EST-2026-NNNN) + backfill; session_proposal
  returns it (RPC contract change).
- status check widened to the 20-state machine (lowercase): draft,
  internal_review, client_invited, viewed, client_configuring,
  client_submitted, engineering_review, revision_required, commercial_review,
  approved, released, signature_requested, partially_signed, client_signed,
  countersigned, completed, declined, expired, revoked, archived (+ won,
  lost as outcome columns on the head row, not states).
- Full section-23 entity set created (tables + indexes + RLS deny-all;
  RPCs added as features consume them): organizations, contacts, projects,
  deployment_sites, site_files, proposal_versions, proposal_selections,
  proposal_line_items, pricing_snapshots, catalog_categories, catalog_items,
  catalog_item_versions, pricing_rules, compatibility_rules, warranty_plans,
  service_plans, proposal_approvals, proposal_documents, proposal_comments,
  proposal_viewers, signature_requests, signature_signers, email_deliveries,
  notifications, internal_notes, tasks, system_settings, users, roles,
  user_roles.
- Catalog import: configuratorPricing.ts (DOLLARS -> cents conversion) +
  configuratorCatalog.ts (already cents) -> catalog_categories/items +
  pricing_rules (volume tiers) + compatibility_rules (requires/excludes),
  every row needs_business_verification = true.

## ACP-translated design decisions
- proposal_versions carries rev int, note, locked_at, snapshot jsonb (config
  + line items + totals + client/site copy) written at release AND at
  signing; signature rows pin version_id + accepted_total_cents.
- proposal_line_items: version_id, category_id, catalog_item_id nullable,
  name + customer_description SNAPSHOTTED at add-time, kind
  standard|allowance, qty numeric, unit, unit_price_cents,
  unit_cost_cents (internal-only, never in client DTOs), taxable, optional,
  selected (client-writable), client_visible, pending_review, sort_order.
- activity_events already implements the ACP event-log pattern (actor text;
  staff='admin'); add is_staff boolean on future per-user attribution.
- View dedupe (same viewer within 30 min bumps last_seen without +1) goes in
  session_proposal when per-viewer analytics land in the /ops activity tab.
