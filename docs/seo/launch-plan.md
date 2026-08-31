# PODOS AI — SEO Launch Plan (5 Sprints)

Adapted from the master brief's 5-sprint launch sequence to the **actual state of this repo** (Next.js 16.2.2 App Router, live at https://www.podosai.com).

**What already exists** (do not rebuild):

| Asset | Location | State |
|---|---|---|
| Homepage `/` | `src/app/page.tsx` + `src/components/site/*` | Live |
| Investor page `/invest` | `src/app/invest/page.tsx` + `src/components/invest/*` | Live, "interest" mode |
| Sitemap | `src/app/sitemap.ts` | Live — lists `/` and `/invest`, base `https://www.podosai.com` |
| Robots | `src/app/robots.ts` | Live — allow all, disallow `/api/`, points at www sitemap |
| Claims gating | `src/data/investOffering.ts` | Single source of truth for offering terms, collaborations, claims, evidence; `termsApproved: false`, `offeringStatus: "interest"` |
| Interest capture | `src/app/api/investor-interest/route.ts` | Supabase (RLS insert-only) + Resend/FormSubmit notify to info@podosai.com; honeypot + per-IP throttle |
| Image pipeline | `scripts/generate-invest-images.mjs` + `src/data/invest-page-images.ts` | GPT-Image-2, brand refs (`public/products/pod.png`, `public/optimus/optimus-pod-front.png`), output to `public/visuals/invest/` |
| Root OG image | `src/app/opengraph-image.png` | Exists for `/` |

**What does NOT exist yet** (verified by repo search): analytics of any kind (no GA4/Plausible/PostHog/@vercel/analytics), JSON-LD structured data, canonical tags, a `/invest` OG image, Search Console verification file/meta, any pages beyond `/` and `/invest`.

**Known inconsistencies found during this audit** (feed into Sprint 1–2 gates):

1. **Canonical-host mismatch.** ~~`sitemap.ts` declares www canonical but `layout.tsx`/invest OG use the apex.~~ **RESOLVED at `c2c80a8`**: metadataBase + all OG urls → www, per-page canonicals on / and /invest, /invest og:image added. Verify on next production deploy.
2. **Ungated homepage claims.** `layout.tsx` meta description states "shipped in 90 days" as fact; `investOffering.ts` classifies 90 days as an *internal target*. `MeetTheTeam.tsx` bio claims "76+ patent claims… inventor of record on every USPTO filing" — this claim is not in the gated claims registry and is unverified in-repo.
3. **MEGA SILO spec conflict.** `PodosPod.tsx` says "MEGA SILO (20 MW)"; `ProductShowcase.tsx` alt text says "24-pod cluster" (24 × 1 MW pods). Reconcile.
4. **Naming already public.** MEGA SILO (product card), Optimus (interactive section), and Syntropic (team bio + thesyntropic.com reference) are already rendered on the live homepage even though public naming approval is listed as pending. This is a live exposure, not a future decision.

---

## Blocked-on-founder/legal register (referenced by sprint)

| ID | Item | Blocks | Owner |
|---|---|---|---|
| B1 | Claim conflicts: "90 days" as fact vs internal target; "76+ patent claims / USPTO inventor of record" bio claim; MEGA SILO 20 MW vs 24-pod | Sprint 1 exit, Sprint 2 copy | Founder |
| B2 | Syntropic public naming — currently live in `MeetTheTeam.tsx` bio; confirm keep/remove and whether thesyntropic.com may be linked | Sprint 2, Sprint 4 | Founder |
| B3 | MEGA SILO / Optimus naming approval — both live on homepage; approve retroactively or rename | Sprint 2, Sprint 4 | Founder |
| B4 | Investor-education content legal review (all `/invest` copy, disclaimers, "non-binding interest" language, amount range $1,000–$250,000) | Sprint 3 exit | Securities counsel |
| B5 | Analytics tool choice (GA4 vs Plausible vs Vercel Analytics vs PostHog) — nothing is installed today | Sprint 1 measurement, Sprint 5 reporting | Founder |
| B6 | Google Search Console property verification + sitemap submission (needs DNS or deploy access under founder's Google account) | Sprint 1 exit, all reporting | Founder |
| B7 | Live-offering terms (security type, price, valuation, portal URL) — `termsApproved` stays `false` until counsel signs off | Sprint 5+ (post-launch) | Founder + counsel |

Nothing in this plan flips `offering.termsApproved`, upgrades a collaboration status, or sets `approvedForPublicUse: true` on hidden evidence (`prototype`, `ip`, `customers`) — those are founder-only edits per the comments in `investOffering.ts`.

---

## Sprint 1 — Technical foundation & indexation readiness

Most of the classic Sprint-1 work (sitemap, robots) already exists; this sprint closes the gaps.

**Deliverables**
- Fix canonical host: `metadataBase` and all OG `url` values → `https://www.podosai.com`; add `alternates.canonical` per page.
- JSON-LD: `Organization` schema in `layout.tsx` (name, url, logo, `contactPoint` info@podosai.com); `WebSite` schema. No product/offer schema yet (blocked by B4/B7 — never emit `Offer` markup for an unapproved offering).
- `/invest` OG image (generate via the existing GPT-Image-2 pipeline; per the no-image-reuse rule, a dedicated asset, not the root OG image).
- Repo hygiene: move the untracked root-level `.mp4` files and stray `.png` screenshots out of the repo root (or `.gitignore` them) so they never deploy or get crawled.
- Verify apex→www 307 is actually a 301/308 at the host level (307 is stated in the `sitemap.ts` comment; permanent redirect is the SEO-correct form) — check in Vercel domain settings.
- Search Console: prepare verification method; **submission itself is B6**.
- Analytics: install the chosen tool sitewide — **choice is B5**.

**Quality gates**
- Content/claims: no copy changes this sprint except metadata; metadata description rewrite must resolve B1's "90 days" wording (use "90-day deployment target").
- Design: no visual regressions; OG images render at 1200×630 in social-card validators.
- A11y: no changes that remove landmarks or alt text.
- SEO: `curl` both pages — one canonical, one `<title>`, meta description ≤160 chars, sitemap fetches 200, robots fetches 200, JSON-LD passes Rich Results test.

**Pages shipping:** none new — `/` and `/invest` redeploy with corrected metadata.

**Exit criteria:** canonical mismatch gone; JSON-LD live; `/invest` has its own OG image; B5 + B6 answered or explicitly deferred by founder in writing.

---

## Sprint 2 — Homepage claims hardening & on-page SEO

**Deliverables**
- Extend the `investOffering.ts` gating pattern to homepage claims: move the "90 days", "1 MW", MEGA SILO capacity, and patent-claim statements into the claims registry (or a sibling registry in `src/data/siteContent.ts`) so every public number has `status` + `approvedForPublicUse`.
- Resolve B1 conflicts with founder sign-off; reconcile MEGA SILO 20 MW vs 24-pod.
- Apply B2/B3 decisions: keep, rename, or remove Syntropic/Optimus/MEGA SILO references (they are live today — decision cannot be deferred past this sprint).
- On-page SEO pass on `/`: single H1, heading hierarchy, descriptive alt text on all `next/image` uses, internal link to `/invest` in crawlable HTML.
- Performance pass: the homepage carries heavy media (multiple videos, 3D `PodosRack3D`, `GlobalEnergyLayer` ambient motion). Measure LCP/INP/CLS; lazy-load below-fold video; confirm `prefers-reduced-motion` behavior (already implemented for GlobalEnergyLayer per its comment) still holds.

**Quality gates**
- Content/claims: zero public numbers outside a registry with `approvedForPublicUse: true`; targets visually badged as targets (pattern already exists on `/invest`).
- Design: desktop AND mobile verified in browser (per project non-negotiable).
- A11y: keyboard-navigable interactive sections (Optimus panel already cycles components — verify focus handling), contrast on stat text, alt text on product cards.
- SEO: Lighthouse SEO ≥ 95; CWV lab pass (LCP < 2.5s on Fast 4G is the target — current value unknown until measured).

**Pages shipping:** `/` (hardened).

**Exit criteria:** B1–B3 resolved with founder decisions recorded in `investOffering.ts` / registry comments; CWV baseline recorded in the monthly report template.

---

## Sprint 3 — /invest investor experience & capture QA

The page and gating already exist; this sprint is legal review + funnel QA, not a rebuild.

**Deliverables**
- Full copy export of `/invest` (all sections, `LegalDisclaimer`, CTA language, the $1,000 minimum and $250,000 API cap) to counsel — **B4**.
- Apply counsel edits via `investOffering.ts` / `investContent.ts` only (no hardcoded JSX claims — the file header mandates this).
- End-to-end interest-capture test: form → `/api/investor-interest` → Supabase `investor_interest` row → notify email received at info@podosai.com (test both Resend path and FormSubmit fallback; FormSubmit requires the one-time activation click). Verify 429 throttle, honeypot drop, amount clamp errors surface in the UI.
- Note for founder: the per-IP throttle is in-memory and resets per deploy/instance (flagged `ponytail:` in the route) — decide whether launch traffic justifies the Upstash/KV upgrade.
- Confirm all AI renders on the page carry the CONCEPT label (mechanism exists in the evidence/image registry).
- On-page SEO for `/invest`: canonical, heading structure, FAQ content if counsel approves (only then consider `FAQPage` schema).

**Quality gates**
- Content/claims: no security type, price, valuation, or ownership math visible while `termsLive()` is false (mechanism exists — verify rendered output, not just code); collaborations render only the `approvedPublicStatement` sentences.
- Design: mobile verification of the long-scroll narrative and `StickyInvestCTA`.
- A11y: form labels, error announcements, focus management in `InvestorAccessFlow`.
- SEO: indexable, canonical to www, dedicated OG image (from Sprint 1).

**Pages shipping:** `/invest` (legally reviewed).

**Exit criteria:** written legal sign-off on the interest-mode page (B4); one real test lead verified in Supabase + inbox; throttle decision recorded.

---

## Sprint 4 — Supporting pages & site architecture

**Deliverables** (each new page = add to `sitemap.ts`, dedicated metadata, dedicated OG image via the existing pipeline, dedicated generated visuals per the no-image-reuse rule)
- `/product` (or `/pod`): PODOS Pod detail page built from existing `optimusComponents` data. **Blocked on B3** for any Optimus naming in URLs/headings.
- `/team`: expand `MeetTheTeam` content — bios must pass the same claims gate (B1 patent claim).
- `/faq` or investor-education page: **blocked on B4** — counsel reviews before publish.
- MEGA SILO page: **blocked on B3** and the 20 MW/24-pod reconciliation (B1).
- Internal linking: header/footer nav to all pages; breadcrumb JSON-LD on subpages.

**Quality gates**
- Content/claims: every number sourced from a registry; unknown/unapproved → omitted, never estimated.
- Design: matches the established Geist/Inter Tight/Geist Mono system in `layout.tsx`; browser-verified desktop + mobile.
- A11y: axe scan clean of critical issues per page.
- SEO: unique titles/descriptions, no keyword cannibalization between `/` and `/product`, sitemap updated, pages return 200 and are internally linked.

**Pages shipping:** only the subset unblocked by B2/B3/B4 — realistic minimum is `/team`; the rest ship as approvals land.

**Exit criteria:** every unblocked page live, in sitemap, and crawl-error-free; blocked pages have drafts parked in the repo (unlinked, `robots` noindex or not routed) awaiting approval.

---

## Sprint 5 — Authority, measurement & operating cadence

**Deliverables**
- Search Console: property verified, sitemap submitted, both pages inspected/requested for indexing — **B6**.
- Analytics live (B5) with conversion event on successful interest submission (the API returns `{ ok: true }` — fire client-side on that).
- AI-search visibility pass (`ai-seo` skill): ensure the Organization schema, plain-HTML claim statements, and about/team content are citable; check whether ChatGPT/Perplexity can answer "what is PODOS AI" — baseline unknown today.
- Off-site foundation: consistent NAP + description for any directory/LinkedIn/Crunchbase profiles (existing profiles: unknown — inventory first, don't create without founder approval since company positioning is investor-sensitive).
- Instantiate the reporting loop: first monthly report from `docs/seo/monthly-report-template.md`.
- Post-launch backlog: live-offering flip checklist (B7) — the exact code path is `offering.offeringStatus = "live-offering"` + `termsApproved: true` + terms fields + `portalURL`, which auto-unlocks the terms UI via `termsLive()`; nothing else should be hand-edited.

**Quality gates**
- Content/claims: outreach/profile copy uses only registry-approved claims.
- SEO: GSC shows both pages indexed, zero coverage errors; CWV field data begins accruing (28-day lag — first real read arrives in month 2).
- Measurement: analytics events verified firing in production.

**Pages shipping:** none new; measurement layer ships.

**Exit criteria:** GSC + analytics live; first monthly report filled in (with "unknown" where data hasn't accrued); B7 checklist documented and parked with founder/counsel.

---

## Reporting

Monthly report uses `docs/seo/monthly-report-template.md` (same directory). Until B5/B6 land, most metric fields will read "unknown — blocked on B5/B6"; the Supabase `investor_interest` table is the only measurement that works today and should be reported from day one.
