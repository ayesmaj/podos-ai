# PODOS Private Estimator — Data Flow

## 1. Invitation → session
admin `create_invitation(secret, estimate_no, email, name, policy, days)`
→ raw token shown once → client `/e/[token]` → `invitation_status` (masked
email) → `issue_otp`/`verify_invitation(token, answer)` → `proposal_sessions`
row (7d, hashed) → HttpOnly cookie `podos_proposal_session` (Path=/) →
`/client/proposals/[publicId]`. Events: invitation_link_opened,
otp_issued/verified, verification_failed, session_started.

## 2. Configure (autosave) → live estimate
Client edits a step → debounced 600ms → `POST /api/proposal/save-step
{step, payload}` → `save_selection(session, step, payload)` (scoped to the
session's proposal; size/step validated; event selection_saved) → the route
then calls `preview_estimate(session)` and returns `{ok, estimate}` where
estimate = `{low_cents, high_cents, recurring_cents, items[]}` computed IN THE
DATABASE from saved SKUs × pod_quantity × QUANTITY_TIER rule × RANGE spread.
The browser only animates the returned figures (spring count-up).
localStorage `podos:wsp:<publicId>` is a recovery cache only.

## 3. Submit
`POST /api/proposal/submit` → `submit_configuration(session)`: status →
`client_submitted`, event configuration_submitted, `notifications` row
(audience admin), returns `{reference, submitted_at}` → success screen.
Further edits are blocked server-side (`save_selection` refuses when status
∉ viewed/client_configuring) until admin requests revision.

## 4. Admin review → proposal
Dashboard `ops_dashboard` v2 exposes stage counts + values and the review
queue (client_submitted). Proposal editor:
- `import_selections(secret, publicId)` → for each product-step SKU adds a
  catalog line item (two-description snapshot) × pod_quantity; recomputes totals
- `upsert/delete_line_item` (existing) → `_recompute_totals`
- `release_proposal(secret, publicId)` → snapshot config + line items + totals
  into the current `proposal_versions` row, `locked_at`, `released_at`,
  status `released`; further line-item edits raise "version locked"; to
  change: create a new revision (next wave)
- `set_signature_state(secret, publicId, enabled)` → `signature_requested`
  ↔ `released`; event signature_requested
Events feed the proposal Activity rail and the dashboard feed.

## 5. Client proposal + signature
`/client/proposals/[publicId]/proposal` renders from `session_proposal`
(line items from the table, status). Visible only when status ∈ released,
signature_requested, client_signed, signed, countersigned, completed.
Sign form appears only in `signature_requested` → `sign_via_session`
(identity-attached acknowledgement; provider adapter later) → status
`client_signed`, version stays locked. PDF via `/api/proposal/[publicId]/pdf`.

## 6. Money invariants
Integer cents; half-up per line; totals = Σ rounded lines; range = ±spread
(pricing_rules RANGE, flagged needs verification); catalog cost never
serialized to clients (`public_catalog` omits cost_cents); all placeholder
prices remain `needs_business_verification=true` until founder approval.

## 7. Tables touched per flow
invitations: proposal_invitations, proposal_sessions, otp_codes, activity_events
configure: proposal_selections, activity_events
submit: estimates.status, notifications, activity_events
review: proposal_line_items, proposal_versions, estimates totals, audit_logs
sign: estimates.signed_at/signer_*, activity_events
