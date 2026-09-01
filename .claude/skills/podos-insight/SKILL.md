---
name: podos-insight
description: Use when writing an evergreen technical analysis article under /insights for podosai.com. Requires primary-source research, an original PODOS interpretation, an explicit what-this-does-not-prove section, and a review schedule.
---

# podos-insight

Write analysis that a data-center engineer would bookmark. Not news, not
a rewrite of someone else's article.

## The bar

An insight earns its URL only if it adds something the sources do not
already say: an original interpretation, a diagram, a decision framework,
a worked calculation, or engineering commentary. **Summarising a report
is not an insight.** If the whole article could be replaced by a link to
the source, do not publish it.

## Non-negotiables

1. **Primary sources only.** Go to IEA, LBNL, ASHRAE, OCP, NREL, NVIDIA
   spec pages, arXiv/OpenReview, ISO/IEEE/NFPA — not a blog summarising
   them. Verify every URL resolves. `docs/seo/source-register.md` is the
   starting library; add new verified sources to it.
2. **Two mandatory sections.** "What this means for operators" and
   **"What this does not prove"**. The second is the credibility anchor:
   state the limits of the evidence, the assumptions, and what would have
   to be true for the conclusion to fail.
3. **Claims discipline.** PODOS numbers come only from
   `src/content/data/claims.ts` with `publishable: true`, wrapped in
   `data-claim` with their qualifier. No benchmark claims, no competitor
   numbers you cannot source, no implied superiority.
4. **Dated and revisited.** Render `Published` and `Last verified`, and
   set a 60- or 90-day review. Time-sensitive claims decay; an unrevisited
   article becomes a liability.
5. **Design lock + server rendering.** Same rules as `podos-page`: light
   technical system, no `.iv-*`, no `"use client"`, copy in initial HTML.

## Workflow

1. Pick the question, not the keyword. What would a facility engineer
   genuinely need explained?
2. Gather primary sources and read them. Record exact figures, dates,
   methodology, and limitations.
3. Write the executive answer first — 2–4 sentences that stand alone.
4. Build the original asset: the diagram, the decision matrix, the
   calculation with stated assumptions.
5. Write the analysis, citing inline with `<Cite n={k} />`.
6. Write "what this does not prove" honestly enough that a skeptic would
   agree it is fair.
7. Use `TechArticleJsonLd` (never `NewsArticle` — that is for real company
   news only), add `EvidenceSourceRail` and `LastVerified`, register the
   route, and run `tsc` / `eslint` / `npm run verify:seo`.

## Structure

Header with author + reviewer + dates → executive answer → sticky table of
contents on desktop → original diagram or data visualisation → sourced
analysis → what this means for operators → what this does not prove → key
takeaways → sources → related cluster links.

## Slugs

Leave the year out unless the article is genuinely an annual edition. If
a yearly edition is warranted, publish a new URL and link editions
together — never silently change what an old URL means.
