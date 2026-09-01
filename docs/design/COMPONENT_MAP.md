# COMPONENT_MAP.md

Every section on an SEO page comes from this library. Source:
`src/components/seo/sections.tsx` + `src/app/seo-sections.css`.
All are **server components** — SEO pages ship zero client JS.

## Why a CSS file and not Tailwind utilities

`globals.css` carries an **unlayered** reset
(`*:where(:not(.invest, .invest *)) { margin:0; padding:0 }`). Unlayered
rules beat Tailwind's layered utilities, so `py-24` on a section computes
to `0`. Class selectors (specificity 0,1,0) beat the universal selector,
so the section primitives live in `seo-sections.css` as real classes.
This is the same bug that broke `/invest` spacing.

## Primitives

| Class | Purpose |
|---|---|
| `.sec` | Section shell. Modifiers: `--paper` `--canvas` `--ink` `--blueprint`; `--hero` `--major` `--band` `--flow` |
| `.sec__in` | Inner frame. Modifiers: `--bleed` `--wide` `--site` `--content` |
| `.sec__grain` | Ambient cluster field (see `data-field`) |
| `.prose` | 68ch measure — only inside a wider parent |
| `.eyebrow` | Mono label, 11px / 0.16em |
| `.h-display` `.h2` `.h3` `.lede` `.metric` | Type roles |

## Components

| Component | Props | Notes |
|---|---|---|
| `Section` | `surface` `width` `pad` `field` `id` | Wrapper for everything below |
| `Eyebrow` | `code` `children` | Cyan code + label |
| `SectionHead` | `eyebrow` `code` `title` `lede` `align` | Standard heading block |
| `HeroSplit` | `code` `cluster` `title` `accent` `lede` `metrics` `imageId` `crumbs` `meta` | Archetype A / D hero. Ink, text-left, wide visual right |
| `HeroEditorial` | `category` `title` `accent` `lede` `meta` `stats` `crumbs` | Archetype E hero. No product shot |
| `HeroMedia` | `code` `title` `accent` `lede` `imageId` `crumbs` `metrics` | Archetype B hero. Media is the surface |
| `MetricRail` | `items[{value,label,claim?}]` `tone` | Mono tabular metrics; `claim` emits `data-claim` |
| `SummaryBand` | `title` `items[{code,title,body}]` | 3–4 scannable takeaways |
| `DiagramWide` | `imageId` `title` `caption` `callouts[{n,label,body}]` | Wide visual + HTML callouts. **Never bake labels into pixels** |
| `StickyExplainer` | `imageId` `title` `steps[{code,title,body}]` | Sticky visual + scrolling steps (CSS `position:sticky`, no JS) |
| `SplitFeature` | `imageId` `title` `body` `flip` `bullets` | Copy/visual 50-50, alternate `flip` |
| `MatrixTable` | `head[]` `rows[][]` `id` | Wide, scrolls in its own container |
| `ExecutiveAnswer` | `label` `children` | Archetype E. The answer up front, oversized, glass panel |
| `DataFigure` | `title` `caption` `children` | Wide figure wrapper for an original chart / worked calculation |
| `QuoteMetric` | `quote` `attribution` `metric` `label` | Ink pull-quote band |
| `LimitsBlock` | `title` `items[]` | Honest limits. Mandatory on A/B/E |
| `ProseWithRail` | `rail` `children` | 68ch prose + sticky rail |
| `CardGrid` | `title` `cols` `items[{code,title,body}]` | Profile / deliverables / checklist |
| `FAQBlock` | `items[{q,a}]` | Pairs with `FAQJsonLd` from the same array |
| `RelatedRail` | `items[{href,label,title}]` | Internal links as cards |
| `CTABand` | `title` `body` `primary` `secondary` | Ink conversion band |

## Compliance carried through

- Company numbers pass `claim` ids → rendered as `data-claim`, so
  `verify-seo.mjs` still catches a blocked claim.
- `SeoImage` keeps its `CONCEPTUAL VISUALIZATION` tag in every new
  section, including full-bleed use.
- `Cite` / `EvidenceSourceRail` / `LastVerified` / `Breadcrumbs` are
  unchanged and compose into the new sections.

## Image reuse

The founder rule stands: **one image, one placement.** `DiagramWide`,
`SplitFeature`, `StickyExplainer`, and the heroes each take a distinct
registry id. Reusing an id across two sections is a review failure.

## 21st MCP

Component *patterns* (sticky explainer, comparison matrix, editorial
hero) were used as reference shapes only. Nothing is pasted in: these
pages are server-rendered with project tokens and no new dependency —
adding a client component library to a zero-JS SEO page would cost more
than it returns.


## Measured result (2026-08-31, dev server, verified in-browser)

Old template vs the three rebuilt sample pages:

| Metric | Old `/engineering/direct-to-chip-liquid-cooling` | Rebuilt |
|---|---|---|
| Multi-column grids | **0** | **18** |
| Content width @1440 | ~700 px (`max-w-[76ch]`) | 1120 / 1325 / 1354 px |
| Surface treatments | 2 | 3 + 3 ink bands |
| Adjacent identical sections | many | **0** |
| Sections / distinct types | 9 / 3 | 16 / 12 |

Verified in-browser, not asserted:

- **Contrast** — 226 / 209 / 249 text nodes audited per page with alpha
  compositing against the true painted background: **0 AA failures**.
  Two real defects were found and fixed this way: the current breadcrumb
  rendered ink-on-ink at ratio **1.00**, and `--cyan-deep` accents
  measured **3.49** on light surfaces.
- **Desktop composition @1440** — hero 602+554, sticky explainer 563+592
  (`position: sticky`), prose+rail 629+272, split 578+578 with
  `flip` order 2.
- **Mobile @375** — `document.scrollWidth` 375, no horizontal overflow;
  every split stacks; tables scroll inside `.tblwrap` (311 visible /
  704 scrollable); metric rails 2-up.
- `tsc`, `eslint`, `npm run build`, and `verify-seo` (41 pages) all pass.
