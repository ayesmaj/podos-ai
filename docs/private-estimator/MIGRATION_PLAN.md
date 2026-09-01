# MIGRATION_PLAN.md

## Phase A - Security core (THIS phase)
DB: invitations/OTP/sessions/activity/audit/admin-sessions/rate limiter (all
tested). App: /proposal/invite/[token] access screen -> /proposal/[id]
session-gated workspace v1; /estimate public estimator REMOVED (private-
access notice); /admin behind login sessions (?key= removed), /admin/pricing
gated too; proxy.ts security headers; robots.txt stops advertising private
prefixes; /api/estimate-request recomputes money server-side; one-shot link
cookie HttpOnly; SQL exported to supabase/migrations/.

## Phase B - Client workspace
Route-group private layout (no marketing chrome or motion), step rail +
canvas + sticky summary per mockup, autosave (proposal_selections), steps
01-03 (company/project/site + uploads via Supabase Storage), review and
submit, engineering-review status.

## Phase C - Catalog + pricing admin
DB catalog/rules tables; admin catalog manager (mock bottom strip); server
priceProposal() on the DB price book; import prototype values flagged
needs_business_verification; retire configuratorPricing.ts + localStorage.

## Phase D - Documents
@react-pdf renderer, 13-page template, private storage + signed URLs,
watermarks, versioned immutable releases, web preview parity.

## Phase E - Signature + notifications
Dropbox Sign adapter + webhooks (founder account required); Resend for
invitations/OTP/notifications (RESEND_API_KEY + domain required); admin
notification preferences.

## Phase F - Staff accounts + roles
Supabase Auth, section-20 role matrix inside RPCs, per-user audit
attribution, view-as-client mode.

## Standing risks
- TWO Claude sessions share this working tree; check file mtimes before
  editing shared files (repeated clobbering this session).
- Git auto-deploy is not firing; deploys are CLI (vercel --prod).
- No email provider live -> email-confirm policy is the operational default;
  the OTP path is built and switches on when RESEND_API_KEY lands.
- Legacy /e/[token] links remain valid until invitations replace them;
  rotate or revoke via admin when sunsetting.
