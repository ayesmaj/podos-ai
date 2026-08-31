# CONFIGURATOR_ARCHITECTURE.md — PODOS Configurator

Status: **Phase 0 proposal — awaiting founder approval before Phase 1.**
Date: 2026-08-31 · Companion docs: [DESIGN_LOCK.md](DESIGN_LOCK.md), [BUSINESS_DATA_REQUIRED.md](BUSINESS_DATA_REQUIRED.md)

---

## 1. Current state (audited, not assumed)

| Area | Finding |
|---|---|
| Framework | Next.js **16.2.2** (App Router, Turbopack, `cacheComponents` OFF), React 19.2.4, TS 5.9 strict, Tailwind v4 CSS-first (no config file) |
| Pages | `/` and `/invest` only. 10 Sprint-2 routes are pre-registered in `INDEXABLE_ROUTES` + footer but have **no page.tsx** (pre-existing sitemap 404 debt — do not worsen) |
| Backend | **None.** No auth, no ORM, no sessions, no proxy/middleware, zero server actions. Two route handlers: `api/investor-interest` (raw-fetch Supabase PostgREST INSERT + Resend/FormSubmit relay), `api/generate-image` (dev-only) |
| Database | One Supabase project (`podos-invest`), one table, anon INSERT-only via RLS. No client SDK installed |
| Testing | Zero test files, zero frameworks, no CI. Gates today: `eslint`, `next build`, `npm run verify:seo` |
| Deploy | Vercel via GitHub integration (`ayesmaj/podos-ai`, main), zero config files |
| 3D | R3F installed; one monolithic 49.5MB GLB (no named parts, no animations) — **cannot drive per-option visual config** |
| Forms/validation | Nothing installed (no zod/react-hook-form/zustand as direct deps) |
| PDF/email/queue | Nothing installed |
| Design system | Fully locked (see DESIGN_LOCK.md); claims register + `verify:seo` gate governs public numbers |

Implication: Phases 2–6 of the master brief sit on a domain layer that must be provisioned in Phase 1. Nothing in the existing repo blocks this; the marketing site is untouched except nav/footer links and one `:not()` scope addition.

## 2. Stack decisions (recommended — flag disagreements before Phase 1)

| Concern | Decision | Rationale / alternative |
|---|---|---|
| Database | **Supabase Postgres — new dedicated project** (`podos-configurator`) | Relational spec fit; RLS for portal tokens; org already on Supabase. Alt: same project/new schema (weaker blast-radius isolation) |
| ORM & migrations | **Drizzle ORM + drizzle-kit** | Spec says "existing ORM; otherwise Prisma or Drizzle" — none exists. Drizzle: TS-first, SQL-transparent migrations, serverless-friendly, no codegen step. |
| Auth | **Supabase Auth** (magic links; MFA for admin roles) + app-level RBAC tables | One vendor; secure httpOnly cookie sessions via `@supabase/ssr`. Admin gate = `src/proxy.ts` optimistic check + **authorization re-checked inside every server action/route handler** (Next 16 mandate: actions are publicly POSTable) |
| File storage | **Supabase Storage**, private buckets, signed expiring URLs | Site uploads + generated PDFs. Vercel FS is read-only |
| Validation | **zod** (add as direct dep — it's only transitive today) — single schema source shared client/server | |
| Forms | **react-hook-form** + zod resolver | Spec-preferred |
| Wizard state | **zustand** (add as direct dep) with localStorage draft mirror + server autosave | Already transitive via R3F; declare it properly |
| Money | Integer **minor units (cents)** in Postgres `bigint`, hand-rolled integer math module with explicit rounding rules (half-up, per-line then sum) | No float ever touches currency. `ponytail:` no money library until multi-currency actually ships |
| Pricing/rules engines | Pure TS domain services in `src/server/` — **zero React imports, unit-tested** | Master brief §21 |
| PDF | **@react-pdf/renderer**, server-side, in a route handler (Vercel Fluid Compute default 300s is ample) | Deterministic, no headless browser. Upgrade path: queue + worker if generation volume demands. Alt: Playwright+chromium HTML-to-PDF (heavier, better CSS parity) — revisit at Phase 4 if react-pdf can't hit the brand bar |
| Background jobs | **None in Phase 1** — PDF/email run in request handlers with visible processing status; **Vercel Queues (beta) or Supabase cron as the named upgrade path** when volume/retry needs appear | `ponytail:` ceiling documented; the brief's "don't block requests" honored via async status polling |
| E-signature | **Provider adapter interface** + `DevSignatureProvider` (test mode) + **Dropbox Sign** as first production adapter | Spec-mandated adapter; webhook signature verification required |
| Email | **Resend adapter** (key placeholder already in `.env.local`) + dev console transport; templates as React Email or plain HTML in admin-editable records | FormSubmit stays as legacy fallback for the invest form only |
| Address/maps | **Provider adapter** with Google Maps Platform (autocomplete + validation + geocode + static map) when credentials exist; **manual-entry + manual-pin fallback built first** | Credentials do not exist yet → BUSINESS_DATA_REQUIRED |
| Rate limiting | **Upstash Redis** (Vercel Marketplace) for public form/token endpoints | The in-memory Map precedent resets per instance — inadequate for token brute-force protection |
| Analytics/engagement | First-party `activity_events` table (no third-party analytics on proposal data) | Spec §15 truthfulness rules |
| Testing | **Vitest** (domain unit), **Playwright** (E2E) — introduced in Phase 1 with the pricing engine, not deferred to Phase 7 | Repo has nothing; pricing engine without tests is unacceptable |

New direct dependencies (Phase 1): `drizzle-orm`, `drizzle-kit`, `postgres`, `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `react-hook-form`, `@hookform/resolvers`, `zustand`, `@react-pdf/renderer`, `resend`, `@upstash/ratelimit`, `@upstash/redis`, `vitest`, `@playwright/test`. (Each enters only in the phase that needs it.)

## 3. Route map

### Public / client (design: main-site system, `.cfg` scope)
| Route | Index? | Notes |
|---|---|---|
| `/configure` | **Indexable** | Entry + wizard. Registered in `INDEXABLE_ROUTES` (new cluster `"configure"`) only when it ships; `buildMetadata()`; Breadcrumbs; title per brief §26 |
| `/configure/resume/[secureToken]` | noindex,nofollow | Resume link; token validated server-side; rate-limited |
| `/proposal/[secureToken]` | noindex,nofollow | Client portal: status, PDF preview, versions, messages, revision request, sign entry |
| `/proposal/[secureToken]/sign` | noindex | Provider-embedded signing ceremony |

### Admin (auth required; `src/proxy.ts` matcher `/admin/:path*` + per-action authz)
`/admin` (dashboard) · `/admin/estimates` · `/admin/estimates/[estimateId]` · `/admin/catalog` · `/admin/warranties` · `/admin/pricing` · `/admin/templates` · `/admin/settings` · `/admin/login`
All noindex; no public nav link; robots already disallow nothing here so each page sets `robots: {index:false}` via `buildMetadata({noindex:true})` and proxy adds `X-Robots-Tag`.

### Server surface
- **Server actions** (`'use server'` — first in repo): draft autosave, step submit, estimate submit, admin mutations (status, discounts, revisions, approvals). Every action: session check → role check → zod parse → domain service → `updateTag()`/`revalidatePath()`. Body limit 1MB default — uploads do NOT go through actions.
- **Route handlers** (`src/app/api/configurator/*`): `uploads` (signed-URL issuance), `pdf/[versionId]` (generate/stream, auth/token-checked), `webhooks/signature` (provider webhook, signature-verified), `webhooks/email` (delivery events), `events` (first-party engagement beacon).

### Next 16 conventions (binding for all new code)
`params`/`searchParams`/`cookies()`/`headers()` are **Promises — always await**. Use `PageProps<'/route'>`/`RouteContext<'/route'>` generated types. `proxy.ts` (Node runtime) not middleware. **No `'use cache'`/`cacheLife`/`cacheTag`** (cacheComponents off) — use `unstable_cache`/tag revalidation and `{ next: { revalidate, tags } }`. `updateTag()` in actions for read-your-own-writes. No webpack config (Turbopack). `next build` doesn't lint — run `eslint` + `verify:seo` explicitly.

## 4. Module boundaries (domain services, no React)

```
src/server/
  db/            schema.ts (Drizzle), client.ts, migrations/
  auth/          session helpers, RBAC guards (requireRole)
  catalog/       items, variants, media, visibility, effective dating
  rules/         compatibility engine: evaluate(config) -> violations[] {severity, customerMessage, internalReason}
  pricing/       price(configSnapshot, priceBook) -> lines[] + totals; integer money math; display modes (exact|range|pending)
  estimates/     drafts, versions, snapshots, numbering (PODOS-E-YYYY-NNNN), status machine
  proposals/     document assembly, pdf generation, version immutability, hashing
  signatures/    provider adapter interface + dropbox-sign + dev provider, webhook state machine
  sites/         address adapter (google|manual), uploads
  engagement/    activity_events writes + rollups
  notifications/ email adapter (resend|console), template rendering, automation triggers
  audit/         audit_logs writer (called by every privileged mutation)
```

UI:
```
src/components/cfg/        shared primitives (inputs, option cards, stepper, drawer, table, summary bar…)
src/components/configure/  wizard steps + visual stage
src/components/proposal/   portal + PDF preview
src/components/admin/      admin surfaces
src/data/configuratorContent.ts   all static copy (invest-page pattern)
src/app/configure.css      .cfg scope styles (invest.css precedent)
```

## 5. Data model (Postgres via Drizzle — entity map)

Conventions: UUID PKs; human numbers separate (`estimate_no`); `created_at/updated_at/created_by/updated_by` everywhere; soft-delete (`status`, never hard delete commercial history); money = `bigint` minor units + `currency`; **every estimate version stores a full JSONB snapshot of config + resolved prices + rule versions** so later catalog edits can never mutate history; sent/signed versions immutable at the service layer + DB trigger.

- **Identity/RBAC**: `organizations`, `users` (Supabase auth mirror), `roles`, `user_roles`, `customer_contacts`, `collaborators`
- **Project/site**: `projects`, `deployment_sites` (address_raw, address_verified, verdict, lat/lng, site attrs), `site_uploads` (storage key, type, scan status)
- **Catalog**: `catalog_categories`, `catalog_items` (public/internal names, descriptions, metadata JSONB for power/cooling/dimensions, lead time, visibility, status, effective/expiry, evidence ref, **cost & margin in admin-only columns guarded by column-level grants + never serialized to client DTOs**), `catalog_item_variants`, `catalog_item_media`
- **Rules**: `compatibility_rules` (type: requires|excludes|recommends|quantity|capacity|power|cooling|dimension|region|site|lead-time|needs-eng|needs-legal; condition JSONB; severity; customer_message; internal_explanation; effective dates), `rule_versions`
- **Pricing**: `price_books` (region, currency, effective/expiry, status), `price_book_items` (pricing_kind: fixed|per-unit|per-rack|per-kw|per-km|percent|tiered|recurring|allowance|custom-review; params JSONB), `regional_pricing_rules`, `freight_zones`, `tax_rules`
- **Warranty**: `warranty_plans`, `warranty_versions`, `custom_warranty_requests` (always "Pricing pending PODOS review")
- **Configuration/estimate**: `configurations` (mode guided|advanced, current step, resume token hash), `configuration_answers`, `configuration_items`, `estimates` (estimate_no, owner, status machine: draft → submitted → eng_review → reviewed → approved → sent → viewed → signed | declined | expired | lost | won), `estimate_versions` (immutable snapshot JSONB, totals, display policy, price validity), `estimate_line_items` (kind one-time|recurring|optional|allowance|excluded|customer-supplied|pending-review; formula inputs JSONB), `estimate_assumptions`, `estimate_exclusions`, `estimate_approvals` (role, threshold, discount approvals)
- **Proposal/signature**: `proposal_documents` (version FK, storage key, sha256, generator+template versions, watermark flag), `signature_requests` (provider, provider_request_id, signer identity, consent ts, status), `signature_events` (webhook payload refs), `client_portal_links` (token hash, expiry, revoked, otp policy)
- **Engagement/ops**: `activity_events` (the §15 event vocabulary), `proposal_views`, `messages`, `email_deliveries`, `admin_notes`, `tasks`, `audit_logs`, `integration_webhooks`, `system_settings` (incl. production-readiness checklist state), plus `is_demo` flags on all catalog/pricing/warranty seed rows

## 6. Pricing engine (server-authoritative)

`priceEstimate(snapshot, priceBook, context) → { lines, subtotals: {oneTime, recurring, allowances}, tax, discounts, contingency, total | range, pendingReviewItems, meta: { priceBookVersion, ruleVersions, formulaInputsPerLine } }`
- Runs only on the server (server action recalculates on every option change; client renders results + optimistic display of last-known totals).
- Display modes per item/estimate: **exact | range | pending-review**, resolved from admin display policy (qualification, region, product, stage).
- Discounts: role thresholds from `system_settings`; above-threshold requires `estimate_approvals` row from Finance role.
- Rounding: integer cents, half-up at line level, totals = sum of rounded lines; document in code + tests.
- Every calculated line persists its formula inputs + rule version (auditability requirement §10).

## 7. Rules engine

Pure function over the config snapshot: `evaluate(config, rules) → Violation[]` with `severity: info | warning | blocked | review-required`. Guided mode consumes `recommends` rules to build the Step-04 baseline; Advanced mode surfaces the full option set with live compatibility state on every option card. **No thresholds are invented — rules ship empty except DEMO-flagged examples; admins author real rules in the rule builder (Phase 6) with test cases + simulator.**

## 8. Visualizer strategy (honest, from the 3D audit)

The existing GLB is monolithic — per-option 3D mutation is impossible without a re-authored asset. Strategy (matches brief §8's fallback ladder and the house style, where nearly everything "3D" is actually pre-rendered):

1. **Primary — layered deterministic renders + the existing optimus overlay system.** One base pod render per approved variant state (generated via `/generate-visual` with `products/pod.png` as brand ref, dedicated assets per the one-image-one-placement rule), with SVG/HTML overlays for dimensions, system labels, cooling/power/network routes (`.data-stream` animation), rack zones, and callout pins driven by a `configuratorComponents.ts` data file (same shape as `optimusComponents.ts`). Camera "changes" per step = curated crops/variants of the base render + overlay swaps.
2. **Secondary — `PodosRack3D` as an "INSPECT · 3D" moment** on the review step only (demand frameloop + in-view gating preserved; GLB gets a gltfpack/meshopt pass first).
3. **Deferred — segmented, named-node GLB** (Blender re-author) unlocks true per-option 3D. Listed as an asset ask in BUSINESS_DATA_REQUIRED; architecture keeps a `VisualizerSource` interface so the render pipeline can swap without UI rewrites.
4. Site preview levels: map pin (provider static map) → site-type scene (approved deterministic scenes) → optional customer-photo compositing, always labeled "Conceptual visualization only…" in UI + PDF (§8 brief). Selected camera/preview persisted per estimate version.

## 9. Security architecture

- **Tokens**: portal/resume tokens = 256-bit random, stored as SHA-256 hashes, expiring, revocable, single-purpose; optional email OTP step; Upstash rate limits on all token endpoints; non-enumerable errors (uniform 404).
- **RBAC**: roles per brief §19 seeded; every server action/handler calls `requireRole()`; cost/margin columns excluded from all client-bound DTO builders (typed serializers, tested).
- **Proxy**: `src/proxy.ts` — optimistic session-cookie check + redirect for `/admin/:path*`, `X-Robots-Tag: noindex` on admin/proposal/resume; real authz stays in the server layer.
- **Uploads**: type/size allowlist, signed PUT URLs, private buckets, signed expiring GET URLs; malware-scan hook point (provider TBD).
- **Webhooks**: provider signature verification (Dropbox Sign event hash), replay protection, payload archived to `signature_events`.
- **Headers**: CSP + security headers added in `next.config.ts` `headers()` for the new route groups (site-wide change reviewed separately to avoid breaking existing inline styles/videos).
- **Secrets**: env only; `.env.example` shipped; nothing client-side; logs redact tokens/PII.
- **Audit**: every privileged mutation writes `audit_logs` (actor, action, entity, before/after refs).

## 10. SEO integration

`/configure` only: registered in `INDEXABLE_ROUTES` (cluster `"configure"`) **at ship time**, `buildMetadata()` with brief §26 title/description, Breadcrumbs component, one H1, claims-gated copy (`data-claim` ids; only the three publishable claims with qualifiers), FAQ only if real/approved. Everything else noindex. No Product price JSON-LD (house policy). `npm run verify:seo` must pass — noting the pre-existing failure debt from 10 registered-but-unbuilt Sprint-2 routes (not ours to fix, not ours to worsen).

## 11. Component map (major new builds)

- **Wizard shell**: `ConfiguratorShell` (desktop 55–60/40–45 split grid, sticky visual stage), `ProgressRail` (top, chapter + % + saved state), `CommercialSummaryBar` (sticky bottom: total/range, validation state, Back/Continue), `SummaryDrawer` (full line-item breakdown)
- **Steps 00–18**: one component per step group under `src/components/configure/steps/`, driven by a step registry (id, chapter label, schema, visibility conditions) — conditional logic hides irrelevant fields
- **Visual stage**: `PodStage` (render + overlay layers per step), `SystemRouteOverlay` (cooling/power/network paths), `SiteMapStage`, `PdfPreviewStage` (Step 17 morphs the stage into A4 thumbnails)
- **Option primitives**: `OptionCard` (image, name, benefit, tech-details expander, compatibility badge, price/lead-time effect, Recommended badge, "Why this matters"), `CompareTray` (≤3), `SpecTable`, `PriceDelta`
- **Portal**: `ProposalPortal`, `PdfViewer` (thumbnails/zoom/fullscreen), `VersionTimeline`, `MessagePanel`, `SignaturePanel`
- **Admin**: `PipelineBoard`, `EstimateTable` (filters), `EstimateDetailTabs`, `CatalogEditor`, `RuleBuilder` + `RuleSimulator`, `PriceBookEditor`, `WarrantyEditor`, `TemplateEditor`, `SettingsPanel`
- 21st MCP research targets (Phase 2+, restyled to tokens): stepper, combobox, data table, drawer/sheet, upload zone, command menu, date input, toast

## 12. Implementation phases (mapped to master brief §30)

| Phase | Scope | Exit gate |
|---|---|---|
| **1 — Domain foundation** | Supabase project, Drizzle schema + migrations for all §5 entities, Supabase Auth + RBAC + proxy, catalog/rules/pricing services **with Vitest suites**, audit writer, DEMO seed + import templates, admin setup-checklist state | `npm run build` green; pricing/rules unit tests green; RBAC guard tests green |
| **2 — Client configurator** | `.cfg` scope + primitives, wizard shell + all step groups (guided + advanced), autosave/resume, zod validation, review summary, responsive 375px→desktop | E2E: guided flow desktop+mobile; advanced flow; incompatible-option block |
| **3 — Visualizer & location** | PodStage + overlays, configuratorComponents data, address adapter + manual fallback, site uploads, conceptual labels | Visual states per step verified in browser at 390/768/1440 |
| **4 — Proposal/PDF** | @react-pdf template (26-section structure §11), server generation, immutable versioned storage + hashes, preview UI | PDF visual snapshot baseline; version immutability tests |
| **5 — Review & e-signature** | Engineering review queue, approval → send flow, portal, signature adapter (dev + Dropbox Sign), webhooks, signed archive | E2E: approve→send→open→sign against dev provider; webhook state tests |
| **6 — Admin CRM & analytics** | Dashboard metrics, estimate detail tabs, catalog/pricing/warranty/rule/template editors, automations, engagement rollups | E2E: revise-without-mutating-sent-version; discount approval; unauthorized-role cannot see cost |
| **7 — QA & production readiness** | Full test matrix (§28), a11y (WCAG 2.2 AA), reduced motion, Lighthouse, security checklist, retention policy, docs (ADMIN_GUIDE, SECURITY_CHECKLIST, CLIENT_FLOW_COPY, CHANGELOG, .env.example) | All §31 acceptance criteria demonstrably true |

Blocked-by-business-data note: Phases 1–5 run fully on DEMO-flagged data. **Production launch is gated on BUSINESS_DATA_REQUIRED.md** — the app ships a protected setup checklist until real catalog/pricing/warranty/legal data is entered (brief §29).

## 13. Open decisions for the founder (answer before Phase 1)

1. **Supabase**: new dedicated project (recommended) vs reuse `podos-invest`?
2. **Nav placement**: "Configure" as a nav tab after Engineering (recommended, matches brief) — and does it also replace the de-facto "Contact" top-right emphasis, or sit alongside?
3. **E-sign provider**: Dropbox Sign (recommended, embeddable, cheaper) vs DocuSign — adapter covers both, but the first production integration + account is a purchase.
4. **PDF fidelity bar**: react-pdf (fast, deterministic) first with Playwright-HTML fallback only if brand fidelity misses — confirm tolerance for iterating in Phase 4.
5. **`/configure` copy scope**: which of the three publishable claims may appear on the indexable entry page, and does a "PODOS Configurator" public launch need any additional claim approvals?
