# DESIGN_LOCK.md — PODOS Configurator

Status: **Phase 0 lock** · 2026-08-31 · Derived from a full repo audit (8-agent sweep).
Parent lock: [docs/seo/design-language-lock.md](../seo/design-language-lock.md) governs all new pages sitewide. This file scopes that lock to the Configurator module and records the exact tokens, classes, components, and conventions the Configurator will reuse — and the new primitives it is allowed to add.

Rule zero: **the Configurator uses the MAIN site system** (paper/brand/cyan/Geist). The `/invest` system (`.invest`, `--iv-*`, ivory/gold) is quarantined — never import or imitate its visuals. Its *interaction* precedents (multi-step modal, slider/chips) may be mirrored in main-site clothing.

---

## 1. Tokens — reuse verbatim (source: `src/app/globals.css` `:root`)

### Surfaces
| Token | Value | Use |
|---|---|---|
| `--paper` | `#F7F9FB` | page background |
| `--canvas` | `#EEF2F6` | section washes |
| `--panel` | `#FFFFFF` | cards |
| `--panel-secondary` | `#E6ECF2` | secondary panels |
| `--mist` / `--steel` | `#DCE3EB` / `#C0CAD6` | dividers / disabled |
| `--ink` / `--ink-deep` | `#0F172A` / `#111827` | dark contrast panels |

### Brand + accents
| Token | Value |
|---|---|
| `--brand` / `-bright` / `-deep` / `-darker` | `#2563EB` / `#3B82F6` / `#1D4ED8` / `#1E3A8A` |
| `--cyan` / `-bright` / `-deep` / `-darker` | `#22D3EE` / `#67E8F9` / `#0891B2` / `#0E7490` |
| `--brand-gradient` | `linear-gradient(135deg, #2563EB 0%, #22D3EE 100%)` — THE brand signature |
| `--status` | `#22C55E` — **functional only** (LIVE dots, NOMINAL, healthy states). Never headlines/body/CTAs |
| glow/trace/wash variants | 0.22 / 0.08 / 0.04 alphas of brand & cyan |

### Type colors, edges, glass
- Text: `--ink-strong #0F172A`, `--ink-dim #475569`, `--ink-faint #94A3B8`; on dark: `--bone #F3F6FA`, `--bone-dim` 72%, `--bone-faint` 48%.
- Hairlines: `--edge` rgba(15,23,42,0.08), `--edge-bright` 0.16, `--edge-soft` 0.06, `--edge-faint` 0.04. Always 1px.
- Glass: `--glass-bg` rgba(255,255,255,0.6), `--glass-bg-strong` 0.82, `--glass-edge` rgba(0,0,0,0.05).
- Easings: `--ease-out-quart cubic-bezier(0.22,1,0.36,1)`, `--ease-out-expo`, `--ease-in-out-expo`.

**Never use legacy shims** (`--electric`, `--teal`, `--sky`, `--gold`, `--obsidian`, `--viridian`, `--ember`) — they exist only to keep old CSS alive.

### Radius / shadow grammar (conventional — no tokens exist; copy these values)
Pills/nav `9999px` · buttons `10px` · panels `12px` · glass cards `14px` · large CTAs `14–16px` · page overlay `40px`. Shadows are always cool-tinted `rgba(15,23,42, …)` or brand/cyan alphas; hover accent = faint cyan rim `0 0 0 1px rgba(34,211,238,0.18)` (`.card-lift`).

## 2. Fonts (wired in `src/app/layout.tsx`, inherited automatically — do not re-import)
- **Geist** → `--font-geist` → `--font-display` (headlines 700–900)
- **Inter Tight** → `--font-inter-tight` → `--font-body` (body 400–500)
- **Geist Mono** → `--font-geist-mono` → `--font-mono` (data, codes, prices — with `"tnum" 1, "zero" 1`)

No serif. No italic. ⚠️ Tailwind's `font-mono` utility maps to Inter Tight (repo quirk in `@theme inline`); for real mono use `font-family: var(--font-mono)` in CSS.

## 3. Global classes to reuse (globals.css)
Typography: `.t-display`, `.t-headline`, `.t-lede`, `.t-body`, `.t-number` (tabular stats), `.t-eyebrow`, `.t-sweep-brand` (gradient text — **max one phrase per headline, never a whole line**).
Layout: `.container-site` (1440px), `.section-pad`. Do **not** use `.pageOverlay` (needs a sticky hero underneath; the Configurator workspace has none).
Surfaces: `.glass`, `.glass-strong`, `.panel`, `.card-lift`.
Buttons: `.btn-primary` (brand gradient, 10px radius, 900ms diagonal shine sweep on hover), `.btn-ghost`. Large-CTA variants: copy `RequestAccessCTA.module.css` `.primary`/`.secondary` recipes.
Ambient utilities: `.live-pulse`, `.breathe`, `.data-stream`, `.scan-sweep`, `.digit-blink` — use sparingly, status-adjacent only.

## 4. Visual grammar (source: page-anatomy audit)
- **Eyebrow pill** (canonical section marker, mono): `<span class="eyebrow"><span class="eyebrowIdx">01</span><span class="eyebrowSep">·</span>SITE & INTENT</span>` → renders `01 · SITE & INTENT`. Recipe: mono 0.78rem, ls 0.16em, uppercase, `--brand-deep`, 1px `--edge-bright`, radius 999px, `--glass-bg-strong` + blur(8px); idx w800 `--cyan-deep`.
- **Item codes**: `LETTER-NN`. Taken: M-, F- (×2), U-, E-, D-, T-, PROD-. **Configurator claims `C-01…` and flavor codes `CFG-#### · DRAFT`** (mirrors `POD-0042 · ASSY`).
- **Headlines**: Geist 800, sentence case, terminal period, one `.t-sweep-brand` accent phrase. Voice: declarative, numbers as protagonists, contrast constructions ("90 days. Not four years.").
- **HUD/status vocabulary**: mono caps — `SYSTEM STATUS`, `NOMINAL`, `LIVE`, `OPEN`, `DEGRADED`, `DRAFT`, `SAVED`. Status dots via `.live-pulse`.
- **Spec rows** ("nameplate"): `{ label: "POWER", value: "1", unit: "MW", note: "…" }` mono label, big Geist value.
- **Blueprint treatments**: `.sectionBlueprint` two-tier grid; `DimensionLines.tsx` for measurements; dashed cyan callout leaders `strokeDasharray="3 2"`; corner-bracket `.framePanel`. Technical/schematic SVG is sanctioned; decorative SVG is prohibited (AGENTS.md).
- **CTAs**: Title Case invitations — e.g. `Start Configuration →`, `Build Your Pod →`, `Generate Preliminary Estimate →`.

## 5. Components to reuse (exact files)
| Component | File | Role in Configurator |
|---|---|---|
| `NavHeader` | `src/components/ui/nav-header.tsx` | Site header — **must be mounted per-page** (it is NOT in layout). Use cross-route hrefs (`/#podos`). Add `{ label: "Configure", href: "/configure" }` to `SITE_NAV` in `HeroVideoNarrative.tsx:56` |
| `Footer` | `src/components/site/Footer.tsx` | Page footer + add Configure link to its columns |
| Eyebrow/card/section chrome | `src/components/site/NewSections.module.css` | Section surfaces, eyebrow pill, headline/lede, card system, framePanel |
| Background atmosphere | `src/components/site/BackgroundLayers.tsx` | `GridField`, `AmbientOrbs`, `VignetteLight` — restrained use in entry/review steps only |
| Callout/spec system | `src/components/optimus/*` + `src/lib/optimusComponents.ts` | **The visualizer backbone**: PodCanvas layer-stack, EngineeringCallout, PortCallout, DetailPanel drawer, DimensionLines, CutawayOverlay, percent-coordinate data shape |
| 3D rack viewer | `src/components/site/PodosRack3D.tsx` + `public/models/podos-rack.glb` | Optional "inspect in 3D" moment (demand frameloop + in-view gate pattern is mandatory if reused) |
| Metric/telemetry cards | `src/components/site/ProblemDiagnosis.tsx` | Count-up + status-pill card grammar for estimate totals |
| Product cards | `src/components/site/ProductShowcase.tsx` | Option-card anatomy (mono label, spec grid, availability badge) |
| Stepper/HUD grammar | `src/components/site/DeploymentTimeline.tsx` | Progress rail, % badge, phase stepper, HUD corners |
| Multi-step form precedent | `src/components/invest/InvestorAccessFlow.tsx` | Interaction pattern only (AnimatePresence step flow) — restyle to main palette |
| Calculator precedent | `src/components/invest/OwnershipCalculator.tsx` | Slider + chips + formatted input interaction — restyle to main palette |
| Icons | `lucide-react` + `src/components/site/LineIcon.tsx` | All UI icons. Never hand-drawn |
| SEO | `src/components/seo/{Breadcrumbs,jsonld}.tsx`, `src/lib/seo/{site,metadata}.ts` | Breadcrumbs required on internal pages; `buildMetadata()`; route registry |

## 6. New primitives the Configurator may add (none exist today)
Light-surface form controls, styled purely from the tokens above: input, select/combobox, radio option-card, checkbox, slider, segmented control, stepper rail, drawer/sheet, data table, tooltip, toast, upload zone, modal. Base recipe: `--panel` bg, `1px solid var(--edge-bright)`, radius 10px, `--font-body`, focus ring `rgba(34,211,238,0.5)` or `--brand`; numeric readouts in `--font-mono` with `tnum`. 21st MCP is the functional-pattern source for these (steppers, comboboxes, tables, drawers) — **always rebuilt onto PODOS tokens**, per the master brief. Record sources in `docs/configurator/component-sources.md`.

## 7. Motion recipe (copy exactly)
- Entrances: framer-motion `whileInView`, `viewport={{ once: true, amount: 0.2 }}`, `hidden: { opacity: 0, y: 18–24, filter: 'blur(6–8px)' }`, duration 0.7, ease `[0.22, 1, 0.36, 1]`, stagger `0.06–0.08 * i`.
- Price/total changes: count/transition via the `useCountUp` pattern (`ProblemDiagnosis.tsx:41` — rAF, quartic ease-out, init-at-target + safety timeout).
- Step transitions: small opacity/blur/translate only. Route/system paths (cooling, power, network) animate slowly via `.data-stream` dashed strokes — "controlled fluid flow, not lightning."
- **Always** branch on `useReducedMotion()` → duration 0 (global CSS kill-switch also exists).
- **Critical UI (prices, totals, form controls, validation) must never be gated behind `whileInView`** — IntersectionObserver misfires under Lenis + sticky ancestors; the repo hardcodes `inView = true` defensively in those cases.
- Forbidden (brief §25 + house rules): cursor effects, bouncy cards, floating particles competing with forms, scroll-jacking in the form, spinning 3D, dark neon.

## 8. Integration gotchas (all verified in audit — violating any of these breaks the site)
1. **Unlayered reset**: `globals.css:155` — `*:where(:not(.invest, .invest *)) { margin: 0; padding: 0 }` beats Tailwind's layered utilities, so **Tailwind spacing utilities silently do nothing** outside `.invest`. Decision: the Configurator subtree gets a scope class **`.cfg`** added to that `:not()` exclusion (exactly the `/invest` precedent), so Tailwind preflight + spacing work inside `/configure`, `/proposal`, `/admin`. Everything outside the subtree keeps using CSS Modules.
2. **perf.css**: while `<html data-scrolling>` (Lenis scrolling), ALL `backdrop-filter`s are forced off. Glass surfaces must stay legible on border + inset shadow alone; declare heavy glass via the `--liquid-glass` custom-property convention. Do not "fix" the flattening.
3. **Lenis owns scrolling** (`window.__lenis`, GSAP ticker, `data-scrolling`, anchor interception at 96px offset). Scroll-driven UI hooks `lenis.on('scroll', …)` (triple-listener pattern). Never put `overflow` on html/body; contain per-section with `max-width: 100vw; overflow-x: clip`. `position: sticky` dies inside `overflow: hidden` ancestors (killed DeployTimelineScrub once already).
4. **mobile.css targets hashed module-class names** via `[class*="X-module"]` — renaming a `.module.css` file silently breaks its mobile overrides. New Configurator mobile rules live in the Configurator's own CSS, not in mobile.css.
5. **`images.localPatterns`** blocks query strings on local images except `/visuals/invest/**`. Configurator assets with `?v=` cache-busters need their own entry in `next.config.ts`.
6. **Fonts**: inherited from the root layout — never re-import or hardcode families without the variable stacks.
7. Anchor targets need `scroll-margin-top` ~84–96px (fixed nav pill clearance) or rely on the html `scroll-padding-top` clamp.

## 9. Content governance (binding)
- Any quantitative/spec claim on the **indexable** `/configure` page must reference `src/content/data/claims.ts` with `publishable: true`, carry its `requiredQualifier`, and be tagged `data-claim="<id>"`. Blocked today: pod footprint (720 sq ft), 10× demand, 3–5yr buildout, 76+ patents, Syntropic benchmark. `npm run verify:seo` enforces this.
- **Naming gate**: "MEGA SILO" and "Optimus" are NOT approved public names. Public name is **PODOS Configurator**; label `Configure · Estimate · Engineer · Deploy`.
- JSON-LD policy: **no offers, price, aggregateRating, availability** in structured data, ever — including for the configurator.
- Approved publishable claims (with qualifiers): 1 MW/unit ("designed as"), 90-day deployment ("target"), 128 GPUs/pod ("designed for").
- No prices, parts, warranties, lead times, or legal terms are invented — all come from admin-managed data (see BUSINESS_DATA_REQUIRED.md). Customer-facing default disclaimer per master brief §3.
- Founder rule: **one image = one placement** — the Configurator gets dedicated generated assets (via `/generate-visual`), never reuses `products/pod.png` etc.

## 10. Do not introduce
New fonts · new palettes · dark hacker/cyberpunk screens · purple gradients · generic SaaS cards · cartoon illustrations · uncontrolled glassmorphism · cursor effects of any kind · unstyled Envato/21st template looks · a separate app design language. The Configurator must read as podosai.com, not as a bolted-on tool.
