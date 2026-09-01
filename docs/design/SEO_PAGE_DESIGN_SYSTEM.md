# SEO_PAGE_DESIGN_SYSTEM.md

The layout system for every PODOS SEO page. Companion docs:
[PAGE_ARCHETYPES.md](PAGE_ARCHETYPES.md) ·
[COMPONENT_MAP.md](COMPONENT_MAP.md) ·
[VISUAL_SECTION_LIBRARY.md](VISUAL_SECTION_LIBRARY.md)

This **evolves** the existing PODOS language defined in
`docs/seo/design-language-lock.md`. Tokens, fonts, and colours do not
change. What changes is composition.

---

## 1. Audit — why the current pages feel weak

Measured against `src/app/engineering/direct-to-chip-liquid-cooling/page.tsx`
(representative of all Sprint 2–3 pages):

| Symptom | Measured cause |
|---|---|
| Too narrow | Body capped at `max-w-[62ch]` / `[76ch]` inside a 1440px container. On a 1440px display the content occupies ~700–760px — **roughly half the viewport is dead margin**. |
| No horizontal composition | **Zero** `gridTemplateColumns` declarations. Every element is a block in one vertical column. No split-screen, no diagram-left/copy-right, no sticky visual. |
| Repetitive rhythm | **2** background treatments across **9** sections (`--paper`, one glass panel). Nothing signals "new kind of content". |
| Boring images | 4 images, each inside the same narrow column and the same bordered box. A 1536×1024 render displays at ~700px. |
| Document-like scroll | No section is composed to the viewport. The page reads as an academic paper: heading, paragraphs, heading, paragraphs. |
| Weak hierarchy | One H1 size, one H2 size, one body size, repeated. No metric bands, no pull quotes, no scale contrast. |

**Root cause:** the pages were built as *content in a column*. They must be
built as *a sequence of composed sections*.

---

## 2. The three laws

1. **Section-first, not column-first.** A page is 5–8 composed sections,
   each with its own width, background, and internal grid. The column is
   one section type among many — never the default.
2. **Reading width is for prose only.** Body paragraphs stay at 62–70ch
   for legibility, but they must sit *inside* a wider composition — paired
   with a visual, a data rail, or a diagram. A 70ch paragraph alone in a
   1440px viewport is the bug.
3. **Rhythm is mandatory.** No two adjacent sections may share the same
   background *and* the same internal layout. Alternate surface, width,
   and grid so the eye is told where it is.

---

## 3. Width scale

Replaces "everything in `.container-site`".

| Token | Width | Use |
|---|---|---|
| `--w-bleed` | 100vw | Cinematic hero, full-bleed media band, CTA band |
| `--w-wide` | min(1680px, 96vw) | Diagram sections, comparison tables, 3-col bands |
| `--w-site` | 1440px | Default section frame (existing `.container-site`) |
| `--w-content` | 1120px | Two-column editorial (copy + side rail) |
| `--w-prose` | 68ch | Paragraph measure — **only inside a wider parent** |

## 4. Vertical scale

| Token | Value | Use |
|---|---|---|
| `--sec-hero` | `clamp(560px, 78vh, 860px)` | Hero composition |
| `--sec-major` | `clamp(480px, 70vh, 780px)` | Full-bleed visual / sticky explainer |
| `--sec-band` | `clamp(280px, 38vh, 420px)` | Metric band, quote band, CTA |
| `--sec-flow` | `clamp(72px, 9vw, 128px)` padding | Reading sections |

Major sections should *feel* composed inside the viewport. That does not
mean forcing `100vh` on everything — it means the section's primary idea
resolves without scrolling past it.

## 5. Surface rotation

Six surfaces, rotated so adjacent sections differ:

1. `--paper` — default light
2. `--canvas` — cool grey wash
3. **ink band** — `--ink` deep navy, light type (the cinematic register,
   as in the reference heroes)
4. **blueprint** — paper + technical grid overlay
5. **glass panel** — `--glass-bg-strong` + edge, floated over a surface
6. **media** — an image or render as the surface itself

Rule: an ink band must be followed by a light surface. Two ink bands in a
row turns the page into the dark-SaaS look this system rejects.

## 6. Background language per cluster

Each cluster gets a distinct, restrained ambient treatment so pages are
not interchangeable. All are low-opacity, behind content, and never
compete with type.

| Cluster | Treatment |
|---|---|
| Cooling | Flowing thermal paths, soft cyan gradient drift |
| Power | Orthogonal electrical routing, node junctions |
| Networking | Fibre arcs, data-path dashes |
| Deploy | Site plan / logistics geometry, measured rules |
| Safety | Layered containment rectangles |
| Compare | Split field — two subtly different grid densities |
| Insight | Sparse plot grid with a faint data curve |

## 7. Typography hierarchy

Same families (Geist / Inter Tight / Geist Mono). Stronger scale contrast:

| Role | Size | Notes |
|---|---|---|
| Display (hero H1) | `clamp(2.75rem, 6vw, 5rem)` | −0.04em, line-height 0.98 |
| Section H2 | `clamp(2rem, 3.6vw, 3.25rem)` | −0.03em, commanding |
| H3 | `clamp(1.15rem, 1.6vw, 1.5rem)` | |
| Lede | `clamp(1.05rem, 1.4vw, 1.35rem)` | line-height 1.55 |
| Body | `1rem/1.75` | at 62–70ch |
| Metric | `clamp(2.5rem, 5vw, 4.5rem)` | mono, tabular |
| Label | `11px` mono, `0.16em` | eyebrows, codes, captions |

Accent: key words in H1/H2 may take `.t-sweep-brand` (blue→cyan). One
accent phrase per heading, never more.

## 8. Media rules

- Hero and full-bleed media: **21:9 or 3:1**, edge-to-edge or `--w-wide`.
- Split media: **4:3 or 1:1**, filling its half completely.
- Never place a wide render inside a prose column.
- Annotated diagrams get their own section at `--w-wide` with labels in
  HTML (mono, cyan leader lines) — never baked into the image.
- Captions: mono 11px, plus the `CONCEPTUAL VISUALIZATION` tag where the
  truthfulness rule requires it.

## 9. Motion

Restrained: fade+rise on section entry (once, 0.7s,
`cubic-bezier(.22,1,.36,1)`), line-draw for diagrams, sticky visual
transitions, hover elevation on cards. Respect `prefers-reduced-motion`
by disabling transform/opacity animation, never by hiding content.
No cursor effects, no scroll hijacking, no parallax beyond 1.03 scale.

## 10. Mobile

Mobile is composed, not collapsed:

- Hero keeps its ink band and display type; visual moves below the fold.
- Split sections stack **visual-first** where the visual carries meaning.
- Wide tables become horizontally scrollable cards inside a labelled
  scroller, never a shrunken grid.
- Metric bands become a 2-up grid, not a 1-up list.
- Section identity (surface + eyebrow + rule) is preserved at every width.

## 11. Acceptance gate

A page ships only if all are true:

- [ ] 5–8 sections, using **at least 4 different** section types
- [ ] At least one full-bleed or `--w-wide` visual moment
- [ ] At least one ink band, followed by a light surface
- [ ] No two adjacent sections share background **and** layout
- [ ] Every prose block sits in a composition, not alone in the viewport
- [ ] Hero variant chosen per archetype — not the same hero as its siblings
- [ ] Passes `npm run verify:seo`, `tsc`, `eslint`
- [ ] 375px: no horizontal scroll, tables scroll in their own container,
      sections still read as distinct
