# PAGE_ARCHETYPES.md

Six archetypes. **Never** apply one template to every page — pick the
archetype that fits the content, and vary the hero within it.

Section keys map to `VISUAL_SECTION_LIBRARY.md`.

---

## A · Engineering deep dive
`/engineering/*` — cooling, power, density, networking, safety, enclosure, heat recovery

| # | Section | Notes |
|---|---|---|
| 1 | `HeroSplit` (ink) | Technical hero: code label, display H1 with one accent phrase, lede, metric rail. Visual = annotated system render. |
| 2 | `SummaryBand` | 3–4 scannable takeaways, mono labels. Light surface. |
| 3 | `DiagramWide` | Full-bleed or `--w-wide` annotated diagram with HTML callouts. **The page's visual centre.** |
| 4 | `StickyExplainer` | Sticky visual left, scrolling numbered systems right. |
| 5 | `MatrixTable` | Tradeoffs / failure modes / design decisions. |
| 6 | `QuoteMetric` (ink) | One insight + one metric. |
| 7 | `LimitsBlock` | "When this is not the right answer." Non-negotiable. |
| 8 | `RelatedRail` + `CTABand` | Adjacent domains, then "Talk to engineering". |

Hero variant: **text-left / wide visual-right**.

---

## B · Use case
`/use-cases/*` — enterprise, research, healthcare, edge, manufacturing

| # | Section | Notes |
|---|---|---|
| 1 | `HeroMedia` (ink) | Scenario hero: siting photograph as the surface, headline overlaid. |
| 2 | `ProblemSolutionSplit` | Constraint left / approach right, two columns. |
| 3 | `ProfileGrid` | Workload, power, cooling, network, data profile as cards. |
| 4 | `DiagramWide` or `MediaBand` | Deployment context visual, wide. |
| 5 | `ChecklistGrid` | Readiness criteria, two columns. |
| 6 | `LimitsBlock` | Where a pod is the wrong answer for this vertical. |
| 7 | `RelatedRail` + `CTABand` | Engineering requirements → "Configure a build". |

Hero variant: **full-bleed media with overlay**.

---

## C · Deployment / service
`/deploy/*`

| # | Section | Notes |
|---|---|---|
| 1 | `HeroStat` (ink) | Stage code, H1, and the 90-day target as a metric rail. |
| 2 | `TimelineStrip` | Horizontal 5–6 stage strip; current stage emphasised. |
| 3 | `StickyExplainer` | What happens in this stage, step by step. |
| 4 | `DeliverablesGrid` | What the customer receives — cards. |
| 5 | `MediaBand` | Wide stage photograph. |
| 6 | `MatrixTable` or `ChecklistGrid` | Inputs required / criteria. |
| 7 | `FAQAccordion` + `CTABand` | |

Hero variant: **sticky hero with metric rail**.

---

## D · Comparison
`/compare/*`

| # | Section | Notes |
|---|---|---|
| 1 | `HeroSplit` (split field) | Two-sided hero: the two options rendered as a visual split. |
| 2 | `VerdictBand` | The honest one-paragraph answer, up front. |
| 3 | `ComparisonMatrix` | Wide criteria table, row emphasis, hover. |
| 4 | `SplitVisualBand` | Side-by-side imagery at `--w-wide`. |
| 5 | `WhenEachWins` | Two columns: A wins / B wins. Genuinely balanced. |
| 6 | `AssumptionsBlock` | What the comparison assumes. |
| 7 | `FAQAccordion` + `CTABand` | |

Hero variant: **wide hero with split visual layers**.

---

## E · Insight / thought leadership
`/insights/*`

| # | Section | Notes |
|---|---|---|
| 1 | `HeroEditorial` | Editorial hero: category, large H1, byline + dates, no product shot. |
| 2 | `ExecutiveAnswer` | 2–4 sentences, oversized, in a glass panel. |
| 3 | `StatBand` (ink) | The key figures with sources. |
| 4 | `ProseWithRail` | Analysis at 68ch **with** a sticky source/TOC rail. |
| 5 | `DataFigure` | Original chart/table/worked calculation, `--w-wide`. |
| 6 | `QuoteMetric` | Pull-quote of the core interpretation. |
| 7 | `WhatThisDoesNotProve` | Distinct surface. Mandatory. |
| 8 | `RelatedRail` | Adjacent insights + one pillar page. |

Hero variant: **editorial stat hero**.

---

## F · Glossary / explainer
`/resources/*`

| # | Section | Notes |
|---|---|---|
| 1 | `HeroCentered` | Centred hero over a blueprint field. |
| 2 | `DefinitionCard` | Definition first, oversized, glass. |
| 3 | `VisualExplainer` | Annotated diagram. |
| 4 | `IndexGrid` / `TermList` | Alphabetical, multi-column, anchored. |
| 5 | `RelatedRail` + `CTABand` | |

Hero variant: **centred hero with background diagram**.

---

## Anti-repetition rule

Sibling pages in the same cluster must differ in at least **two** of:
hero variant, the order of sections 2–4, the surface of the ink band, or
the type of the primary visual moment. Reviewers should not be able to
predict page N+1 from page N.
