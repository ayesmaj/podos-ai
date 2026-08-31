# BUSINESS_DATA_REQUIRED.md — PODOS Configurator

Everything the system **cannot truthfully implement without PODOS input**. Per the master brief, nothing below is invented: the build ships with `DEMO`-prefixed fictional data and a protected setup checklist; production launch is blocked until the items marked **[launch-blocking]** are supplied and approved.

Legend: **[P1]** needed during Phase 1 (foundation) · **[P4–5]** needed for proposal/signature phases · **[launch]** needed before production.

---

## A. Credentials & infrastructure decisions
| # | Item | Needed for | Who |
|---|---|---|---|
| A1 | Supabase decision: new `podos-configurator` project (recommended) or reuse `podos-invest` — then project URL + service-role key in Vercel env **[P1]** | Database, auth, storage | Founder + Claude (Supabase MCP can provision) |
| A2 | Upstash Redis (Vercel Marketplace, free tier) **[P1]** | Rate limiting on public/token endpoints | Founder click-through |
| A3 | Resend: verified sending domain (podosai.com DNS records) + production API key **[P4–5, launch]** | All configurator email (resume links, notifications, signature requests). `RESEND_API_KEY` placeholder already exists in `.env.local` | Founder (DNS access) |
| A4 | Google Maps Platform: billing-enabled project, keys for Places Autocomplete + Address Validation + Geocoding + Static Maps, domain-restricted **[P3]** | Address experience + proposal map. Until supplied, manual address entry + manual pin is the (already-planned) fallback | Founder |
| A5 | E-signature provider account: **Dropbox Sign recommended** (or DocuSign) — API key + webhook secret, test mode first **[P5]**, production plan **[launch]** | Binding signatures. Dev-mode stub works without it | Founder (purchase) |
| A6 | Vercel env vars set for all of the above (names delivered in `.env.example`; no secrets in repo) **[launch]** | Deploy | Founder |
| A7 | Malware-scanning choice for customer uploads (e.g. Cloudmersive/VirusTotal API, or explicitly accept "extension/type allowlist only" at launch) **[launch]** | Upload safety §23 | Founder |

## B. Catalog — products, parts, options **[launch-blocking]**
For every configurable item in Steps 05–13 (pod platforms, exterior packages, compute, cooling, power, network, safety, software, deployment services, support tiers): SKU/code, public name, customer description, technical description, image/diagram, compatibility metadata (power/cooling/dimensions/weight), lead time, min/max quantity, geographic availability, visibility tier, effective dates, evidence source.
An **import template (CSV/JSON)** + admin editor will be provided — engineering fills it. Until then every item is `DEMO-*`.
Specific known gaps surfaced by the audit:
- Approved pod model list & which base architectures (stationary/relocatable/road-rated) are actually offered.
- Whether PODOS-supplied compute is offered at launch or customer-furnished only.
- Approved cooling/power/network component sets and redundancy tiers actually available.

## C. Pricing **[launch-blocking]**
- Price book(s): region(s), currency (USD only at launch?), effective dates.
- Real prices per catalog item (one-time + recurring), freight zones/rules, tax rules, allowances, contingency policy.
- Discount policy: role thresholds, approval chain.
- **Display policy**: which customers/stages see exact price vs range vs "pending review" (brief §10).
- Rounding/currency policy sign-off (integer cents, half-up — see architecture §6).

## D. Compatibility rules & thresholds **[launch-blocking]**
Every real constraint (rack density → cooling capacity, redundancy → pump/UPS counts, pod size → rack limits, region → climate/seismic packages…). The rule builder + simulator will exist; **engineering must author values** — the brief forbids inventing thresholds. Needed as: IF-condition, requirement, severity, customer message, internal explanation.

## E. Warranty **[launch-blocking]**
Standard plan definitions (term, covered systems, parts/labor/travel, response targets, exclusions, geography, renewal, price), which plans allow custom requests, and the review workflow owner for custom-warranty requests.

## F. Legal & commercial templates **[launch-blocking — counsel]**
- Preliminary-estimate disclaimer (default text from brief §3 needs counsel sign-off).
- Proposal terms sections (assumptions, exclusions, commercial terms, acceptance page).
- E-record/e-signature consent language; countersignature policy (required or not).
- Privacy/cookie disclosure updates for proposal tracking (§15/§23) — note footer Privacy/Terms links are currently `#` placeholders sitewide.
- Data retention & deletion policy for customer/site/proposal data.
- Commercial structures actually offered (purchase / phased / lease / managed service) — Step 15 renders only admin-enabled ones.

## G. Brand & visual assets
| # | Item | Notes |
|---|---|---|
| G1 | Dedicated configurator pod renders **[P3]** | Founder rule: one image = one placement — `products/pod.png` etc. cannot be reused. Generated via the existing `/generate-visual` + brand-ref pipeline; founder approves the set |
| G2 | Per-option images/diagrams for catalog items **[launch]** | Or approval to generate them per the image style bible |
| G3 | *(Optional, unlocks true 3D config)* Segmented, named-node GLB of the pod (Blender re-author; compressed) | Current `podos-rack.glb` is one monolithic node — cannot toggle/highlight parts. Not required for launch (layered-render strategy covers it) |
| G4 | Site-type scene set (industrial/renewable/enterprise/campus/remote) **[P3]** | Deterministic approved scenes for deployment preview |
| G5 | Known asset debt (pre-existing): `products/pod.png` artwork still shows "90–120 days" vs approved 90-day claim; `optimusComponents.ts` COMPUTE panel still says "64-GPU" in two fields | Fix before configurator reuses either data file |

## H. Claims, naming, and copy approvals **[launch-blocking]**
- Public name **"PODOS Configurator"** + menu label "Configure" + CTA "Build Your Pod →" — founder sign-off (naming gate precedent: "MEGA SILO"/"Optimus" are NOT approved public names and will not appear in the configurator).
- Which publishable claims may appear on `/configure` (currently available: 1 MW "designed as", 90-day "target", 128 GPUs "designed for").
- Blocked claims stay out unless flipped by founder in `claims.ts`: pod footprint (720 sq ft — note Step 05 wants dimensions on option cards; either approve the footprint claim or dimensions render only in the private/authenticated flow), 10× demand, 3–5-yr buildout, 76+ patents, Syntropic benchmark.
- Syntropic: plain-English description + exact licensed scope + any performance numbers (all currently unapproved) for Step 11.
- FAQ content for `/configure` (only if real/approved).
- Email template copy approval (F below lists the 14 templates from brief §18).

## I. People, roles, process **[launch-blocking]**
- Admin user list with roles (Super Admin, Sales Admin, Sales Rep, Engineering Reviewer, Finance/Pricing Approver, Legal/Template Manager, Operations, Read-only Exec) — real emails for magic-link auth; MFA mandate confirmation for privileged roles.
- Estimate ownership/assignment rules; engineering-review SLA shown to customers ("expected response time").
- Notification recipients per event; reminder cadence defaults (draft reminder delay, expiry warnings).
- Proposal expiry default (price-validity window).

## J. Email templates (admin-editable; initial copy needed) **[P5–launch]**
Save/resume · draft reminder · configuration submitted · info requested · review started/completed · proposal ready/sent · viewed notification (staff) · revision available · signature requested/reminder · signed confirmation · expiry warning · expired. Skeletons will be provided in brand voice; founder edits/approves in `/admin/templates`.

---

### Not required from PODOS (already resolved by the audit)
Design tokens/typography/motion (locked), Next 16 conventions, deployment target (Vercel git integration), claims-register mechanics, image-generation pipeline, icon system, form/validation stack — all covered in [DESIGN_LOCK.md](DESIGN_LOCK.md) and [CONFIGURATOR_ARCHITECTURE.md](CONFIGURATOR_ARCHITECTURE.md).
