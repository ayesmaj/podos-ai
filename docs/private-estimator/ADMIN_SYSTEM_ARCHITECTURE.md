# ADMIN_SYSTEM_ARCHITECTURE.md

Design contract: founder admin mockup (sidebar app: Dashboard, Clients,
Projects, Proposals, Engineering Review, Pricing, Catalog, Signatures,
Activity, Settings; KPI row; pipeline stage bar; proposals table; right rail
with Secure Access viewers + Activity Timeline + PDF preview; bottom Pricing
Engine/Rules/Approval strip). Mock numbers are placeholders.

## Auth model
Phase now: single-role admin via opaque DB sessions (admin_login RPC, 12h,
revocable, audited; login form only - ?key= removed). Phase next: Supabase
Auth staff accounts + the section-20 role matrix (SUPER ADMIN, SALES,
ENGINEERING, FINANCE, LEGAL, OPERATIONS, VIEWER) enforced inside every RPC -
the RPC layer already centralizes authorization, so roles slot into
_check_admin -> _check_role(session, needed_role) without route rewrites.

## Modules -> delivery phases
| Mock module | Now (this phase) | Later |
|---|---|---|
| Dashboard | KPI cards + pipeline counts from live data | win-rate, timing metrics |
| Proposals | table (no., client, value, status, viewed, owner) | detail tabs per section 15 |
| Secure Access | per-proposal invitations: create/list/revoke, policy, per-viewer last-seen | collaborator roles |
| Activity | per-proposal event feed (list_activity) | global feed, filters |
| Pricing/Catalog | localStorage page retired behind login | DB catalog manager (section 18) |
| Signatures | native session-signing state | provider adapter (section 11) |
| Clients/Projects | fields on estimate rows | normalized orgs/contacts/projects |

## Rules
- Every admin RPC self-authorizes in the database; UI hiding is never the
  control. All privileged actions write audit_logs.
- Internal cost/margin fields (future catalog) are never serialized to any
  client-facing payload; separate DTO builders, tested.
- View-as-client: read-only, watermarked ADMIN PREVIEW, never counts a view,
  never triggers client email (build with the workspace phase).
