---
name: podos-page
description: Use when creating or rewriting a PODOS product, platform, engineering, deployment, use-case, comparison, or resource page on podosai.com. Enforces the design lock, the claims register, sourced evidence, and the SEO quality gate.
---

# podos-page

Build one indexable page for podosai.com that survives the quality gate.

## Non-negotiables

1. **Design lock.** Read `docs/seo/design-language-lock.md` first. The main
   site uses the light technical system: `--paper`, `--ink-strong`,
   `--brand` (#2563EB), `--cyan`, Geist / Inter Tight / Geist Mono, `.t-*`
   type classes, mono micro-labels with chapter codes (`ENG-04`, `DEP-02`).
   **Never** use `.iv-*` classes, ivory, or gold — those are scoped to
   `/invest` and must not leak.
2. **Claims register.** `src/content/data/claims.ts` is the only source of
   company numbers. A claim renders only when `publishable: true`, wrapped
   as `<span data-claim="id">…</span>` and carrying its `requiredQualifier`
   ("designed as", "designed for", "targets"). Everything else
   company-quantitative — PUE figures, capex, patent counts, benchmark
   results, customers, pilots, LOIs, "MEGA SILO", "Optimus" — is banned.
   If a number seems important but is not publishable, write around it.
3. **Sourced evidence.** Every external statistic needs a `<Cite n={k} />`
   and a matching `EvidenceSourceRail` entry with a real URL from
   `docs/seo/source-register.md`, or a new primary source you verified.
   Never invent a statistic, a volume, or a source.
4. **Server-rendered.** No `"use client"`, no framer-motion, no
   canvas-gated copy. Core text lives in the initial HTML.

## Workflow

1. Read the design lock, `content/reference/*` (voice, terminology,
   banned claims, approved facts), and the claims register.
2. Check `docs/seo/keyword-map.md` for the target URL. One URL, one
   intent — if a sibling already owns the query, extend that page instead
   of creating a cannibal.
3. Research the live SERP for the primary query. Note what the top three
   results fail to explain; that gap is the page's reason to exist.
4. Draft a brief before writing: primary query, intent, the original
   asset (table, checklist, decision matrix, calculation), the sources,
   and the honest limitation.
5. Build from the house template — copy an existing Sprint-2 page such as
   `src/app/engineering/direct-to-chip-liquid-cooling/page.tsx`.
6. Register the route in `src/lib/seo/site.ts` `INDEXABLE_ROUTES`.
7. Run `npx tsc --noEmit`, `npx eslint`, and `npm run verify:seo`.

## Page shape

- Mono eyebrow with a chapter code, then exactly one `<h1>`.
- Answer-first: the first two sentences define or answer the query.
- 900–1,600 original words with `<h2>`/`<h3>` structure.
- At least one thing competitors cannot cheaply copy: an original table,
  a decision checklist, a worked calculation, or a readiness matrix.
  Wrap tables in `overflow-x-auto`.
- An explicit "when this is not the right fit" section. Honesty is the
  differentiator; a page that only sells reads as marketing.
- `Breadcrumbs`, `LastVerified`, `EvidenceSourceRail`, and JSON-LD that
  mirrors visible content only (FAQ schema only with a visible FAQ).
- Three or more contextual internal links, every one to a route that
  actually exists — check `src/app/**/page.tsx` before linking.

## Voice

Direct, technically literate, answer first. Short paragraphs. No
"unlock", "revolutionary", "game-changing", "seamless", "world-class",
no exclamation marks in technical copy, no invented anecdotes or quotes.

## Done means

`tsc` clean, `eslint` clean, `npm run verify:seo` green, every internal
link resolves, and every number on the page traces to either the claims
register or a cited source.
