# PODOS AI — Design-Language Lock for New Pages

**Status:** Locked. Definitive reference for any NEW page built on podosai.com (SEO pages included).
**Applies to:** everything EXCEPT `/invest`.
**Source of truth:** `src/app/globals.css`, `src/app/layout.tsx`, `src/app/mobile.css`, `src/app/perf.css`, `src/components/SmoothScrollProvider.tsx`, `src/components/site/*.module.css`. Values below are copied verbatim from those files — do not restyle from memory.

> **Critical scoping rule:** the `/invest` page (`src/app/invest/invest.css`) runs a deliberately different, warmer system — ivory `#f7f6f2` paper, stone/titanium neutrals, champagne gold `#b79a63`, `--iv-*` tokens, `.iv-*` classes — **namespaced entirely under `.invest`**. New pages must NEVER import, reference, or imitate the `/invest` system. New pages use the MAIN site system documented here.

Design direction (verbatim from `globals.css` header comment): "premium cyber-tech investor site — light, architectural, Tesla/Nvidia/Palantir/SpaceX energy. Bright neutrals with electric-green + deep-teal + subtle-blue energy. Geometric sans-serif throughout, no serif italics, no romantic typography." The blue→cyan gradient IS the brand.

---

## 1. Color tokens (from `src/app/globals.css` `:root`)

### 1.1 Base surfaces — logo-derived light

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F7F9FB` | off-white — primary page surface (never pure white pages) |
| `--canvas` | `#EEF2F6` | light cool gray — section wash |
| `--panel` | `#FFFFFF` | card surface (above paper, selectively) |
| `--panel-secondary` | `#E6ECF2` | secondary panel / elevated surface |
| `--mist` | `#DCE3EB` | subtle divider / inactive surface |
| `--steel` | `#C0CAD6` | muted element / disabled |
| `--graphite` | `#475569` | secondary graphic |
| `--ink` | `#0F172A` | deep navy — type + dark contrast panels |
| `--ink-deep` | `#111827` | slate — full-bleed dark pivot (rare) |

### 1.2 Glass + edges

| Token | Value |
|---|---|
| `--glass-bg` | `rgba(255, 255, 255, 0.6)` |
| `--glass-bg-strong` | `rgba(255, 255, 255, 0.82)` |
| `--glass-edge` | `rgba(0, 0, 0, 0.05)` |
| `--edge` | `rgba(15, 23, 42, 0.08)` |
| `--edge-bright` | `rgba(15, 23, 42, 0.16)` |
| `--edge-faint` | `rgba(15, 23, 42, 0.04)` |
| `--edge-soft` | `rgba(15, 23, 42, 0.06)` |

### 1.3 Brand — deep blue (primary ink)

| Token | Value |
|---|---|
| `--brand` | `#2563EB` |
| `--brand-bright` | `#3B82F6` |
| `--brand-deep` | `#1D4ED8` |
| `--brand-darker` | `#1E3A8A` |
| `--brand-glow` | `rgba(37, 99, 235, 0.22)` |
| `--brand-trace` | `rgba(37, 99, 235, 0.08)` |
| `--brand-wash` | `rgba(37, 99, 235, 0.04)` |

### 1.4 Cyan — secondary brand ink (right side of logo gradient)

| Token | Value |
|---|---|
| `--cyan` | `#22D3EE` |
| `--cyan-bright` | `#67E8F9` |
| `--cyan-deep` | `#0891B2` |
| `--cyan-darker` | `#0E7490` |
| `--cyan-glow` | `rgba(34, 211, 238, 0.22)` |
| `--cyan-trace` | `rgba(34, 211, 238, 0.08)` |
| `--cyan-wash` | `rgba(34, 211, 238, 0.04)` |

### 1.5 Brand gradients — the signature look

| Token | Value |
|---|---|
| `--brand-gradient` | `linear-gradient(135deg, #2563EB 0%, #22D3EE 100%)` |
| `--brand-gradient-soft` | `linear-gradient(135deg, rgba(37,99,235,0.12), rgba(34,211,238,0.12))` |
| `--brand-gradient-glow` | `radial-gradient(ellipse at center, rgba(34,211,238,0.18), rgba(37,99,235,0.06) 55%, transparent 75%)` |

Use for: key words in headlines, buttons, highlights, lines, dividers, interactive elements.

### 1.6 Status accent (minimal — functional only)

| Token | Value |
|---|---|
| `--status` | `#22C55E` |
| `--status-bright` | `#4ADE80` |
| `--status-deep` | `#15803D` |
| `--status-glow` | `rgba(34, 197, 94, 0.22)` |
| `--status-trace` | `rgba(34, 197, 94, 0.08)` |

Rule (verbatim): "status only: LIVE pills, healthy metrics, uptime indicators. Never in body copy, never in headlines. Strictly functional."

### 1.7 Type colors

| Token | Value | Use |
|---|---|---|
| `--ink-strong` | `#0F172A` | primary type |
| `--ink-dim` | `#475569` | secondary type |
| `--ink-faint` | `#94A3B8` | tertiary / captions |
| `--ink-ghost` | `rgba(15, 23, 42, 0.32)` | ghost text |
| `--ink-whisper` | `rgba(15, 23, 42, 0.18)` | faintest |
| `--bone` | `#F3F6FA` | type on dark panels |
| `--bone-dim` | `rgba(243, 246, 250, 0.72)` | secondary on dark |
| `--bone-faint` | `rgba(243, 246, 250, 0.48)` | tertiary on dark |

### 1.8 Legacy shims — do NOT use in new code

`--electric`, `--teal`, `--sky`, `--gold`, `--obsidian`, `--basalt`, `--viridian`, `--ember` all exist only to keep old CSS alive (remapped onto brand/cyan). Comment in globals.css: "New code should prefer `--brand` / `--cyan` / `--status` directly." `--gold` is explicitly "retired" (remapped to cyan depth). New pages use only sections 1.1–1.7 tokens.

---

## 2. Typography

### 2.1 Font families (loaded via `next/font/google` in `src/app/layout.tsx` — never load fonts any other way)

| Variable | Face | Weights loaded | Role |
|---|---|---|---|
| `--font-geist` → `--font-display` | Geist | 400–900 | display / headlines (used at 700–900). "Tight, controlled, infrastructural." |
| `--font-inter-tight` → `--font-body` | Inter Tight | 400–700 | body / lede (400–500), line-height 1.55–1.65 |
| `--font-geist-mono` → `--font-mono` | Geist Mono | 400–600 | numbers, telemetry labels, live pills, code pills, eyebrows. Tabular figures. |

All `display: "swap"`. Stack fallbacks defined in globals.css (`ui-sans-serif, system-ui, ...`). Layout.tsx verdict, verbatim: "No serif. No italic. No startup friendliness. Every glyph reads as system output, not marketing."

Base body: `font-weight: 400; line-height: 1.6; letter-spacing: -0.005em;` — html carries `font-feature-settings: "kern" 1, "liga" 1, "calt" 1, "cv11" 1, "ss03" 1;`.

### 2.2 Type scale — utility classes in `globals.css` (use these, don't re-invent)

| Class | Family | Weight | Size | Line-height | Tracking |
|---|---|---|---|---|---|
| `.t-display` | display | 800 | `clamp(3.4rem, 8vw, 8rem)` | 1.02 | −0.045em |
| `.t-display--mega` | display | 900 | `clamp(5rem, 12vw, 13rem)` | 0.94 | −0.055em |
| `.t-headline` | display | 700 | `clamp(2.4rem, 4.8vw, 4.4rem)` | 1.04 | −0.038em |
| `.t-lede` | body | 400 | `clamp(1.05rem, 1.3vw, 1.25rem)` | 1.6 | −0.005em |
| `.t-body` | body | 400 | `1rem` | 1.65 | −0.005em |
| `.t-mono` | body | 500 | — | — | 0.02em, `"tnum" 1, "zero" 1` |
| `.t-number` | display | 700 | — | — | −0.035em, `"tnum" 1, "zero" 1, "ss01" 1` |
| `.t-eyebrow` | body | 500 | 0.875rem | — | 0.04em, uppercase, `--ink-faint` |

Section-header scale used inside modules (e.g. `EngineeringAdvantages.module.css .headline`): `clamp(2rem, 4.5vw, 3.4rem)`, weight 800, tracking −0.035em, line-height 1.06, `text-wrap: balance`. Subheads: `clamp(1rem, 1.2vw, 1.15rem)`, `--ink-dim`, max-width `56ch`.

### 2.3 Gradient sweep text — `.t-sweep-brand`

`linear-gradient(135deg, var(--brand-deep) 0%, var(--brand) 45%, var(--cyan) 100%)` clipped to text. Rule, verbatim: use "on the 1-2 words per hero/section that carry the meaning… Never paint a whole line — gradient text stops reading as type." Aliases `.t-sweep-electric`, `.t-sweep-teal`, `.t-sweep-ink` exist for legacy; new code uses `.t-sweep-brand`.

---

## 3. Layout, spacing, radius, shadows

### 3.1 Layout utilities (globals.css + mobile.css)

| Utility | Value |
|---|---|
| `.container-site` | max-width 1440px; padding-inline `clamp(1.25rem, 4vw, 3.5rem)`; mobile ≤640px: `clamp(1rem, 4vw, 1.25rem)` |
| `.section-pad` | padding-block `clamp(5rem, 10vh, 9rem)`; mobile ≤640px: `clamp(2.4rem, 6vw, 3.5rem)` |
| Module containers | some sections use narrower 1280px (e.g. `EngineeringAdvantages.module.css .container`) |
| Anchor offset | html `scroll-padding-top: clamp(64px, 10vh, 104px)`; anchored section ids get `scroll-margin-top: 84px` (mobile) / `96px` (≥769px) in mobile.css |

**Overflow law (breaks sticky if violated):** NO `overflow-*` rules on `html` or `body`. Horizontal safety comes from `main, section { max-width: 100vw; overflow-x: clip; }` (mobile.css) and per-section `overflow: hidden`.

### 3.2 Radius scale (observed values — pick from this list)

| Radius | Where |
|---|---|
| `999px` | pills: eyebrows, code pills, labels |
| `10px` | buttons (`.btn-primary`, `.btn-ghost`) |
| `12px` | `.panel` |
| `14px` | `.glass`, `.glass-strong` |
| `18px` | image frames inside cards (`EngineeringAdvantages .imageFrame`) |
| `22px` | glass telemetry/diagnosis cards (`ProblemDiagnosis .card`) |
| `26px` | large feature cards (`EngineeringAdvantages .card`) |
| `40px 40px 0 0` | `.pageOverlay` top corners (28px on ≤640px) — homepage hero overlay only |

### 3.3 Shadow recipes (copy exactly)

- **`.panel`:** `0 1px 2px rgba(15,23,42,0.03), 0 4px 20px -8px rgba(15,23,42,0.06)` on `#FFFFFF` with `1px solid var(--edge)`.
- **`.glass-strong`:** `0 1px 2px rgba(15,23,42,0.04), 0 12px 40px -12px rgba(15,23,42,0.08)` + `backdrop-filter: blur(24px) saturate(1.2)`.
- **Feature-card three-shadow stack** (`EngineeringAdvantages .card`): `0 0 0 1px rgba(15,23,42,0.02), 0 6px 16px -8px rgba(15,23,42,0.06), 0 24px 50px -22px rgba(37,99,235,0.08)` — "hairline outline, soft mid, generous floor."
- **`.card-lift:hover`** (the signature micro-interaction): `translateY(-3px)` + faint cyan rim `0 0 0 1px rgba(34,211,238,0.18)`. Comment: "Hover adds a faint cyan rim… Keeps the 'cool, engineered, electric' feel on every card."
- Shadows are always ink-cool (`15,23,42`) or blue/cyan tinted. **Never green, never warm.**

---

## 4. Component vocabulary (with file references)

### 4.1 Section surface classes — `src/components/site/NewSections.module.css`

| Class | Recipe |
|---|---|
| `.section` | `var(--paper)` + `border-top: 1px solid var(--edge-faint)`, `overflow: hidden` |
| `.sectionDeep` | two brand/cyan radial glow vignettes over `var(--canvas)` |
| `.sectionBlueprint` | white drafting paper: `--paper` + major grid 100×100px at `rgba(37,99,235,0.08)` + minor grid 20×20px at `0.04` alpha + radial edge fade; `::before/::after` are 18×18px "+" corner registration marks at brand-blue 0.35 alpha, inset 24px |
| `.sectionDark` | rare full-bleed dark pivot: radial cyan/blue glows over `var(--ink-deep)`, type switches to `--bone` |
| `.sectionLightShow` | white paper + 4-layer repeating-linear-gradient zigzag hairlines + floating orbs/beams layer (12–28s durations) |

Subtler alternative grid: `EngineeringAdvantages.module.css .gridBackdrop` — 80×80px grid at `rgba(15,23,42,0.025)` with radial mask fade ("should READ as texture, not pattern").

### 4.2 Numbered-chapter eyebrow — `NewSections.module.css .eyebrow`

Pattern (see `DesignTechEnvironment.tsx`): `<span class="eyebrow"><span class="eyebrowIdx">07</span><span class="eyebrowSep">·</span>ENGINEERING</span>`
Style: `--font-mono`, 0.78rem, tracking 0.16em, uppercase, `--brand-deep`, glass pill (`--glass-bg-strong`, `1px solid var(--edge-bright)`, radius 999px). Index digit weight 800 in `--cyan-deep`; separator `·` at 0.4 opacity. On `.sectionDark` the eyebrow flips to `--cyan-bright` on `rgba(255,255,255,0.06)`. Homepage sections are numbered sequentially — new pages continue this convention.

### 4.3 Technical micro-label code pills

Each card family carries a mono index code — a load-bearing brand signature:
- `M-01…M-04` — `ProblemDiagnosis.tsx` (market diagnosis)
- `E-01…E-04` — `EngineeringAdvantages.tsx`
- `D-01…D-06` — `DesignTechEnvironment.tsx` (engineering pillars)
- `PROD-01/02` — `ProductShowcase.tsx`; asset plates like `POD-0042 · ASSY` in `PodosPod.tsx` / `HeroAIWall.tsx`

Pill style (`EngineeringAdvantages.module.css .codePill`): `--font-mono`, 0.72rem, weight 600, tracking 0.18em, `--brand-deep`, bg `rgba(37,99,235,0.07)`, border `rgba(37,99,235,0.16)`, radius 999px. Companion `.metricLabel`: mono 0.66rem, tracking 0.16em, uppercase, `--ink-dim`. Metric values render in `--brand-gradient` clipped text.
**New pages introduce their own letter prefix (e.g. `S-01` for an SEO/solutions page) rather than reusing M/E/D/PROD.**

### 4.4 Glass telemetry panel — `ProblemDiagnosis.module.css .card`, `HeroAIWall.tsx`

Liquid-glass recipe: border `1px solid rgba(180,210,255,0.35)`, radius 22px, `--liquid-glass: blur(60px) saturate(2.5) brightness(1.4)` applied via `backdrop-filter: var(--liquid-glass)` (the custom-property indirection defeats Lightning CSS prefix de-duplication AND lets `perf.css` kill it during scroll — copy this pattern for any new glass), inset top highlight `inset 0 1px 0 0 rgba(255,255,255,0.4)`, diagonal sheen via `::before`. Cards must stay readable with backdrop-filter off (border + inset shadow carry the shape) — perf.css strips glass mid-scroll.

### 4.5 Global utilities (globals.css)

- **Buttons:** `.btn-primary` (brand-gradient fill, white type, display font 0.88rem/600, 900ms `::after` diagonal shine sweep on hover, blue/cyan-tinted shadows) and `.btn-ghost` (transparent, `--edge-bright` border, ink type).
- **Ambient living layer:** `.live-pulse` (+ `--brand`/`--cyan`/`--sm` modifiers), `.breathe`/`.breathe-slow`, `.glow-breathe` ("one climax card per section max"), `.data-stream` (+ `--slow`/`--fast`), `.digit-blink`, `.scan-sweep` (11s cyan beam). All transform/opacity-only; all clamped by the reduced-motion block.
- **Surfaces:** `.glass`, `.glass-strong`, `.panel`, `.card-lift`.
- **Background/site-wide:** `GlobalEnergyLayer` (in `layout.tsx`, renders for every page), `BackgroundLayers.tsx`, `ScrollProgressRail.tsx` (hidden ≤640px), `LineIcon.tsx`.

### 4.6 Icons and imagery (AGENTS.md — mandatory routing)

UI icons: `lucide-react` only (`strokeWidth={1.5}` convention). Hero/branded illustration: generated via the `/generate-visual` skill into `public/visuals/`, imported with `next/image` + explicit width/height + descriptive alt (see `DesignTechEnvironment.tsx` for the alt-text standard). Interactive 3D: R3F stack. Loops: dotLottie. Founder rule (memory): **one image = one placement — never reuse an existing image on a new page; generate a dedicated asset.**

---

## 5. Motion rules

### 5.1 Easing tokens (globals.css)

| Token | Value |
|---|---|
| `--ease-out-quart` | `cubic-bezier(0.22, 1, 0.36, 1)` — the house ease |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out-expo` | `cubic-bezier(0.87, 0, 0.13, 1)` |

### 5.2 Scroll infrastructure — `src/components/SmoothScrollProvider.tsx`

Lenis (`lerp: 0.15`, `wheelMultiplier: 1.0`, `smoothWheel: true`, `syncTouch: false`) drives all pages via `layout.tsx`; GSAP ticker runs it with `lagSmoothing(500, 33)`; ScrollTrigger synced via `lenis.on("scroll", ScrollTrigger.update)`. Lenis is exposed as `window.__lenis`. Anchor clicks are intercepted and routed through `lenis.scrollTo()` with `NAV_OFFSET = 96`. **New pages inherit all of this for free — do not add scroll libraries or handlers.**

### 5.3 Perf scroll gate — `src/app/perf.css`

While scrolling, `data-scrolling` on `<html>` strips ALL `backdrop-filter` (via `--liquid-glass: none`, an `@supports` block, and `-webkit-` fallback) and every `filter` on elements whose class contains `orb|Orb|lightOrb|glow|Glow`; restored 140ms after scroll stops. Consequences for new pages:
1. Glass surfaces must degrade gracefully with backdrop-filter off (keep a border + inset shadow).
2. Never apply `backdrop-filter` with `!important`.
3. Decorative blur orbs must be radial-gradients first; any `filter: blur()` on them is treated as disposable — and name such elements with `orb`/`glow` so the gate catches them.

### 5.4 Framer Motion entrance pattern (house standard — `DesignTechEnvironment.tsx`, `Manufacturing.tsx`, etc.)

```tsx
const reduce = useReducedMotion();
const transition = reduce
  ? { duration: 0 }
  : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

// element:
initial={{ opacity: 0, y: 8–20 }}          // eyebrow y:8, headline y:16, lede y:12
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.2–0.6 }} // always once: true
transition={{ ...transition, delay: 0.05–0.15 }}  // card stagger: 0.06 * i, 0 when reduce
```

Card variant with blur: `hidden: { opacity: 0, y: 20, filter: "blur(6px)" }` → `visible: { opacity: 1, y: 0, filter: "blur(0px)" }`. CSS transitions on cards run 380ms with `--ease-out-quart`. Ambient CSS keyframes (breathe 6–9s, glow 5.5s, scan 11s, orbs 12–28s) are long-duration and organic — nothing jittery.

### 5.5 Reduced motion

globals.css clamps every animation/transition to 0.01ms under `prefers-reduced-motion: reduce` and restores `scroll-behavior: auto`; components additionally use `useReducedMotion()` to zero durations and stagger. Both layers are mandatory on new pages.

---

## 6. Do-not-introduce list

The literal "master brief" document was **not found in this repo** (unknown location); this list is assembled from binding in-repo rules — globals.css/layout.tsx design comments, `AGENTS.md` prohibited patterns, `perf.css`/`mobile.css` constraints, and project memory.

1. **No serif typefaces, no italics, no editorial/romantic typography** (globals.css header; layout.tsx: "No serif. No italic. No startup friendliness.").
2. **No new font families** — only Geist / Inter Tight / Geist Mono via the existing `layout.tsx` `next/font` variables.
3. **No pure-white page backgrounds** — `--paper #F7F9FB` is the floor ("Avoid pure white").
4. **No green in copy or headlines** — `--status` is strictly functional (LIVE pills, uptime, healthy metrics).
5. **No full-line gradient text** — `.t-sweep-brand` on 1–2 emphasis words max.
6. **No `/invest` tokens, gold, ivory, or `.iv-*` classes outside `.invest`** — and no warm palette drift generally; `--gold` is retired.
7. **No legacy shim tokens in new code** (`--electric`, `--teal`, `--sky`, `--gold`, `--viridian`, `--ember`, `--obsidian`, `--basalt`).
8. **No hand-drawn decorative SVG** (`<rect>/<circle>/<path>` icons or illustrations), no `filter: drop-shadow` glow on hand-drawn primitives, no Tailwind/div-built "icons" (AGENTS.md prohibited patterns). UI icons = lucide-react; illustrations = generated assets. If the right tool is unavailable, STOP and ask — never silently fall back.
9. **No `overflow` rules on `html`/`body`** — breaks `position: sticky`; contain overflow per-section (`overflow-x: clip` on main/section).
10. **No new scroll/animation libraries or competing scroll handlers** — Lenis + GSAP ScrollTrigger + framer-motion are the stack; route programmatic scrolling through `window.__lenis`.
11. **No `backdrop-filter` that escapes the perf gate** (no `!important`, must look acceptable when stripped mid-scroll).
12. **No image reuse** — one image = one placement; generate a dedicated asset per placement (project memory rule).
13. **No unconverted heavy raster assets** — AGENTS.md prohibits saving generated PNGs without WebP conversion; serve through `next/image`.
14. **No warm shadows** — shadows stay ink-cool or blue/cyan tinted.
15. **No animation without a reduced-motion path** — both the global CSS clamp and `useReducedMotion()` per component.

---

## 7. Page-builder checklist (every item must pass before a new page ships)

**Tokens & type**
- [ ] All colors come from Section 1 tokens (1.1–1.7) — zero hard-coded hex outside documented recipes.
- [ ] Headlines: Geist 700–900, tracking ≤ −0.035em, line-height ≤ 1.06; body: Inter Tight 400–500, line-height ~1.6; data/labels/eyebrows: Geist Mono with `tnum`.
- [ ] Gradient sweep limited to 1–2 emphasis words; green used only for status semantics.

**Layout**
- [ ] Page content wrapped in `.container-site` (or a documented 1280px module container); sections use `.section-pad`.
- [ ] Section surfaces chosen from the Section 4.1 vocabulary (`.section` / `.sectionDeep` / `.sectionBlueprint` / `.sectionDark` / `.sectionLightShow`) or built from `.panel`/`.glass` recipes.
- [ ] Radii and shadows picked from Sections 3.2–3.3 exactly.
- [ ] Anchored sections have ids + `scroll-margin-top` clearance (84/96px pattern).
- [ ] No overflow rules on html/body; horizontal overflow clipped at section level.

**Component vocabulary**
- [ ] Section header = numbered mono eyebrow pill (`NN · LABEL`) + display headline + `--ink-dim` lede (max ~56ch).
- [ ] Card families carry a unique mono code-pill prefix (new letter, not M/E/D/PROD).
- [ ] Hover on cards = `.card-lift` behavior (−3/−4px lift + cyan rim), 380ms `--ease-out-quart`.
- [ ] Icons via lucide-react; illustrations generated per AGENTS.md routing into `public/visuals/`; every image is a dedicated, never-reused asset via `next/image` with explicit width/height and descriptive alt.

**Motion**
- [ ] Entrances use the house framer-motion pattern (0.7s, `[0.22,1,0.36,1]`, `whileInView` + `viewport={{ once: true }}`, 0.06s stagger) with `useReducedMotion()` zeroing.
- [ ] Any glass/blur element survives the `data-scrolling` gate visually; blur orbs named with `orb`/`glow`.
- [ ] At most one `.glow-breathe` climax card per section; ambient motion is long-duration, transform/opacity-only.

**Quality gates**
- [ ] Verified in-browser at desktop AND mobile widths (360px/375px lower bound); no horizontal scroll anywhere.
- [ ] Tap targets ≥36px on touch; text contrast meets WCAG AA on chosen surface (use `--ink-dim`, not `--ink-faint`, for body copy).
- [ ] `prefers-reduced-motion` renders a stable, complete page.
- [ ] `/invest` styles untouched and unreferenced.
- [ ] Page inherits `layout.tsx` shell (fonts, `GlobalEnergyLayer`, `SmoothScrollProvider`) — no bespoke providers.
