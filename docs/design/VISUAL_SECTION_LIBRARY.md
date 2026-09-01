# VISUAL_SECTION_LIBRARY.md

What each section looks like, and the rule that keeps it premium.
Implementation: `src/components/seo/sections.tsx`.

---

## 1 · HeroSplit — technical hero (ink)
`[ breadcrumbs ]`
`[ ENG-01 · COOLING ]`
`H1 (display, one cyan-sweep phrase)   |   wide annotated render`
`lede (58ch)                           |   4:3, fills its half, bleeds right`
`[ metric · metric · metric ]`

Ink surface with a cluster field behind. The visual is **not** boxed in
the text column — it occupies the right 46% and bleeds to the viewport
edge. Mobile: text first, visual below at 16:9.

## 2 · HeroEditorial — insight hero (paper + blueprint)
Category · date · read time, then an oversized H1 at `--w-content`, lede,
byline row, and a 3-up stat rail on a rule. No product photography — an
insight page earns attention with a number, not a render.

## 3 · HeroMedia — scenario hero (media surface)
Full-bleed image, ink scrim gradient (not a flat overlay), headline and
lede bottom-left at `--w-site`, metrics on a hairline. Minimum contrast
against the scrim is checked, not assumed.

## 4 · SummaryBand — what you need to know (canvas)
3–4 cards on one row, each `CODE / title / 2 lines`. Top hairline, mono
codes, no shadows. Purpose is scanning, so nothing exceeds three lines.

## 5 · DiagramWide — the visual centre (paper + field, `--w-wide`)
The page's largest moment. A 21:9 or 16:9 render at `--w-wide` with
numbered HTML callouts below in a 4-up grid. Labels are **HTML** — cyan
numeral, mono label, one-line body — never painted into the image, which
keeps them translatable, selectable, and truthful.

## 6 · StickyExplainer — walk the system (canvas)
Left column sticks (`position: sticky; top: 12vh`) while the right column
scrolls through 4–6 numbered steps. Pure CSS, no scroll library. Mobile
un-sticks and the visual leads.

## 7 · SplitFeature — argument + evidence (paper / canvas, alternating)
50-50. Copy at 58ch on one side, a 4:3 visual filling the other edge to
edge. `flip` alternates direction between instances so two consecutive
splits never mirror each other.

## 8 · MatrixTable — the decision table (`--w-wide`)
Mono uppercase headers on a bright rule, tabular numerals, row hover
tint, first column a code pill. Wrapped in `.tblwrap` with
`overflow-x:auto` and a fade mask so it scrolls on mobile instead of
crushing.

## 9 · QuoteMetric — the ink beat (ink, `--band`)
One sentence at `clamp(1.5rem, 3vw, 2.5rem)`, attribution in mono, and a
single oversized metric right-aligned. This is the page's contrast
moment; it must be followed by a light surface.

## 10 · LimitsBlock — honest limits (canvas, left cyan rule)
Numbered list, generous leading, deliberately plain. Every engineering,
use-case, and insight page carries one. This is the section that makes
the rest credible — it is never cut for space.

## 11 · ProseWithRail — the reading section (`--w-content`)
`68ch prose  |  sticky rail (sources / on this page / verified date)`
The only place long prose is allowed, and it is still a two-column
composition, never a lone column in a wide viewport.

## 12 · CardGrid — profile / deliverables / checklist
2, 3, or 4 columns of `code / title / body` cards with a hairline border
and a hover lift of 2px. Reused across archetypes with different titles;
the count changes the rhythm.

## 13 · FAQBlock — questions (paper)
Two columns on desktop, one on mobile. Static markup (no accordion) so
the answers are in the DOM for `FAQJsonLd` and for crawlers.

## 14 · RelatedRail — where to go next (canvas)
3–4 link cards, each with a mono cluster label and an arrow that moves
4px on hover. Real internal links, no carousel.

## 15 · CTABand — the close (ink, `--band`)
Display headline, one line of body, primary + secondary button. Radial
brand glow behind, cluster field faint. One per page, at the end.

---

## Ambient fields (`data-field`)

Rendered as CSS gradients + `repeating-linear-gradient` — no images, no
extra bytes:

`cooling` soft cyan drift · `power` orthogonal routing ·
`network` fibre arcs · `deploy` site-plan rules ·
`safety` containment layers · `compare` split field ·
`insight` sparse plot grid.

Max opacity 0.5 on light surfaces, 0.35 on ink. If a field is legible as
a pattern rather than a texture, it is too strong.
