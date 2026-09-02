# PODOS Private Estimator — Routes

| Route | Who | Guard | Purpose | Index |
|---|---|---|---|---|
| `/e/[token]` | client | invitation token (hashed) → verify | Step 00 access (masked email; OTP or email-confirm); legacy possession links still resolve during migration | noindex |
| `/client/proposals/[publicId]` | client | viewer session bound to proposal | **Welcome** — prepared-for card, what happens next, Begin configuration / Resume | noindex |
| `/client/proposals/[publicId]/configure` | client | session | 14-step configurator + live estimate panel (autosave) | noindex |
| `/client/proposals/[publicId]/configure?step=review` | client | session | Review & Submit → success state | noindex |
| `/client/proposals/[publicId]/proposal` | client | session + status ∈ released/signature_requested/… | Formal proposal (web document) · Download PDF · Sign only when `signature_requested` | noindex |
| `/api/proposal/verify`, `/request-otp` | client | token + rate limit | exchange / OTP | — |
| `/api/proposal/save-step` | client | session | autosave one step; returns `{ok, estimate}` (server-computed preview) | — |
| `/api/proposal/submit` | client | session | submit configuration → `client_submitted` | — |
| `/api/proposal/[publicId]/pdf` | client or admin | session bound to proposal OR admin session | branded PDF (private, no-store) | — |
| `/ops/login` | staff | — | sign in (POST only, rate-limited) | noindex |
| `/ops` | staff | admin session | Operations dashboard: metrics, stage pipeline with values, review queue, activity | noindex |
| `/ops/clients`, `/ops/clients/[orgId]` | staff | session | clients list + detail (contacts, projects, proposals, notes) | noindex |
| `/ops/projects` | staff | session | projects index | noindex |
| `/ops/proposals` | staff | session | proposals list + New client invitation | noindex |
| `/ops/proposals/[publicId]` | staff | session | proposal editor: client configuration (live), line items, totals, access, activity; actions: Import selections · Release proposal · Enable signature · Preview PDF | noindex |
| `/ops/proposals/[publicId]/preview` | staff | session | formal proposal web preview ("view as client") | noindex |
| `/ops/pricing` | staff | session | catalog & pricing (DB) | noindex |
| `/admin/*` | — | — | 308 → `/ops/*` | — |
| `/estimate` | public | — | private-access notice only | noindex |

Headers on every private prefix (`src/proxy.ts`): X-Robots-Tag noindex/nofollow/
noarchive/nosnippet · Cache-Control private,no-store · Referrer-Policy
no-referrer · X-Frame-Options DENY · nosniff · HSTS.

Identifiers: `publicId` = POD-EST-YYYY-NNNN (URL-safe, non-sequential per
client, never the DB uuid). Tokens: 256-bit random, SHA-256 at rest, shown once.

## Proposal document routes (added 2026-09-01)

| Route | Auth | Purpose |
|---|---|---|
| `/ops/proposals/[publicId]/print?mode=formal\|preliminary&screen=0` | admin session | Print source for the estimate sheet (one design for all PDFs, Letter); `screen=0` = bare sheet for the PDF service |
| `/ops/proposals/[publicId]/preview?mode=` | admin session | The sheet as the client sees it + release-readiness result |
| `/client/proposals/[publicId]/print?screen=0` | viewer session bound to the proposal | Client print source; formal after release, preliminary after submission; refuses `screen=0` when downloads are disabled |
| `/api/proposal/[publicId]/pdf?mode=` | viewer or admin session (forwarded to the print route) | Headless-Chrome PDF of the caller's own print route; `X-Document-SHA256` header |
| `/api/proposal-assets/[type].webp?v=sha` | public (no client data) | Admin-generated document visual from the DB store; 404 → shipped file in `/public/visuals/proposal` |
| `/ops/design` | admin session | Regenerate / revert the three controlled visuals (GPT Image 2 edits, server-side key) |

## Full admin control (added 2026-09-01)

| Surface | What it can do now | Safety rule (enforced in the DB function) |
|---|---|---|
| `/ops/clients/[orgId]` | edit client (name, legal name, website, industry, country, notes); archive / restore; delete; edit / remove contacts (roles, phone); edit / delete projects (pods, MW, GPUs, workload, go-live); delete notes | delete refused while any proposal is released or signed → archive instead; deleting a contact revokes its links; deleting a project removes only draft proposals |
| `/ops/proposals/[publicId]` · Proposal settings | edit project (same client), client name / email on the document, validity, internal notes; mark won / lost / declined / expired; withdraw (links stop, record kept) / restore; delete draft | delete only for never-released drafts; a signed proposal cannot change project; won / completed require a signature |
| `/ops/proposals/[publicId]` · line items | client description (bullets), category, unit; delete confirms | locked versions stay read-only |
| `/ops/settings` | company identity + address, standard notes, warranty text, trust band, default validity, notify email — printed on every estimate sheet | admin secret rotation stays a DB + Vercel change (documented on the page) |
