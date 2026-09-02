# PODOS Private Estimator — Architecture (redesign, 2026-09-01)

Three connected products on one data layer, one design system, one brand.

## A) Private client configurator  `/e/[token]` → `/client/proposals/[publicId]/…`
Confidential, invitation-only intake + configuration. NOT an approval page.
Welcome → 14 guided steps (option cards, structured fields) with a persistent
live preliminary-estimate panel → Review & Submit → success state.
Signing never appears here.

## B) Internal operations system  `/ops/*`
Proposal operations center: dashboard (metrics, stage pipeline, review
queue, activity), clients, projects, proposal requests (live view of client
configuration progress), proposal editor (import client selections → line
items, adjust pricing, notes), release formal proposal, enable signature,
catalog & pricing, activity.

## C) Formal proposal — web preview + PDF
Admin preview at `/ops/proposals/[publicId]/preview`; client view at
`/client/proposals/[publicId]/proposal` (visible only once released). Same
structured data feeds a document-style web page and the @react-pdf renderer
(cover/executive summary, configuration, scope, commercial summary,
timeline, terms + signature). Sign CTA only in `signature_requested`.

## Flow (corrected)
1 admin creates invitation (client, company, email, project, notes) →
2 secure tokenized link → 3 client verifies (email-confirm / OTP) → 4 welcome →
5 configure with live estimate (autosave) → 6 submit → 7 admin sees
submission (dashboard queue + proposal request detail) → 8 admin imports
selections, adjusts line items, adds scope/notes → 9 admin releases proposal
(version snapshot locked) → 10 client receives proposal link → 11 admin
enables signature → 12 client signs on the proposal page.

## Security (unchanged invariants)
RLS deny-all + SECURITY DEFINER RPCs; SHA-256 tokens; HttpOnly sessions bound
to one proposal; private headers via `src/proxy.ts`; money computed only in
the database (`_recompute_totals`, `preview_estimate`); cost/margin never in
client payloads; append-only activity + audit logs.

## Stack
Next.js 16 App Router (server components + server actions), React 19,
CSS Modules + CSS variables, framer-motion 12, lucide-react icons,
@react-pdf/renderer, Supabase Postgres via PostgREST RPC. Marketing chrome and
motion providers are excluded from private routes.

## Ownership of state
| State | Source of truth | Client role |
|---|---|---|
| Step selections | `proposal_selections` (server) | debounced autosave; localStorage = recovery cache only |
| Preliminary estimate | `preview_estimate` RPC | animate returned figures |
| Line items / totals | `proposal_line_items` + `_recompute_totals` | admin edits via server actions |
| Status | `estimates.status` (20-state machine) | read-only |
| Signature | `sign_via_session` (dev provider) | only when `signature_requested` |
