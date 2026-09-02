# PODOS Private Estimator — Design System (MASTER)

Synthesis of: the founder's five mockups (binding layout contract), the locked
PODOS site tokens (`src/app/globals.css`), UI UX Pro Max output
(`design-system/podos-private-proposal-platform/MASTER.md` — pattern
"Interactive Configurator" + "Trust & Authority"; its Roboto/orange
suggestions are overridden by brand), and the ayesmaj-premium-web quality bar.
Implementation: `src/components/private/private.module.css`.

## Brand thesis
"A technical infrastructure interface that turns complexity into confidence."
Bright technical-light mode. Sales + engineering + luxury technology.

## Visual mode
Technical light system (primary) + spatial object stage (supporting: the pod
schematic as hero object). Never dark, never flat, never SaaS-purple.

## Color roles (from globals.css, extended)
- canvas `--paper` #F7F9FB · elevated `--panel` #FFF · sunken `--canvas` #EEF2F6
- text `--ink-strong` #0F172A / `--ink-dim` / `--ink-faint`
- line `--edge` / `--edge-bright` / `--edge-faint`
- primary accent `--brand` #2563EB, deep `--brand-deep` #1D4ED8, wash `--brand-wash`
- secondary technical accent `--cyan` #22D3EE (flow/return paths, live states)
- success `--status` #22C55E — ONLY approved / online / saved / signed
- warning amber #B45309 — pending review only
- danger #B91C1C — revoke/delete only
- atmosphere: `--prv-field` pale-blue radial + blueprint grid (CSS gradients,
  or `blueprint-field.webp` when generated)

## Typography roles (Geist display · Inter Tight text)
- display `clamp(2rem,4vw,3rem)` 800 −0.04em (welcome title, estimate figure)
- headline `clamp(1.5rem,2.6vw,2rem)` 800 −0.03em (step title, page title)
- title 1.05rem 700 (card titles)
- body 0.95–1rem 400 lh 1.6
- label 0.68rem 600 uppercase +0.12em (eyebrows, chips, meta) — Inter Tight,
  never mono (founder rule)
- numeric: `font-variant-numeric: tabular-nums` on all money/counts

## Grid & containers
Workspace: 12-col, max 1680px, gutters clamp(16px,3vw,32px).
Configurator: rail 220–240px · canvas flexible · summary 340–380px (sticky).
Ops: sidebar 232px · canvas fluid to 1600px+; no centered narrow column.
Document preview: 1200–1440px reading width, page-like elevation.

## Spacing scale
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 (rem multiples of 0.25).

## Radius families
- `--prv-r-card` 16px (cards, panels) · `--prv-r-ctrl` 10px (inputs, buttons)
- `--prv-r-chip` 999px (chips, status) · document blocks 12px

## Materials & elevation
- `--prv-shadow-1` hairline + 1px lift (rest)
- `--prv-shadow-2` 0 24px 60px −30px rgba(15,23,42,.25) (panels, hover)
- `--prv-shadow-glow` 0 0 0 3px var(--brand-wash), 0 12px 32px −12px rgba(37,99,235,.35) (selected)
- glass only on the sticky estimate panel header (backdrop-blur 10px, 70% white)
- blueprint grid: 1px lines `rgba(37,99,235,.07)` every 32px, faded radially

## Image language
Orthographic technical menu illustrations (4:3, `object-fit: contain`,
generated set in `public/visuals/menu/`). Hero pod schematic 16:9 with left
copy-safe third. No photography in menus. Labels/prices always HTML.

## Icon language
lucide-react, strokeWidth 1.75, sizes 16/20/24. Never emoji.

## Buttons
- primary: brand gradient, white, 600, 10px radius, hover lift −1px + glow,
  press scale .98, gradient shift on hover (background-position)
- secondary: panel bg, edge-bright border, ink-dim
- text link: brand, underline on hover
One primary per screen.

## Card families (4)
1. Option card (selectable, image, price effect, chips, recommended)
2. Metric card (icon tile, label, big number, optional trend)
3. Summary row card (icon, label, value, chips, thumbnail) — review table
4. Panel (section container for rails/summaries/document blocks)

## Forms
Visible labels, 44px min height, helper text, validate on blur, error under
field, autosave badge (Saving/Saved/Failed) with aria-live=polite.

## Motion (one signature + supporting)
Signature: the live estimate figure springs to its new value and the changed
summary row shimmers once (cobalt→transparent).
Supporting: step canvas crossfade + 8px rise (220ms ease-out-quart), card
hover depth (160ms), selection glow (200ms), progress ring tween, success
check draw. All disabled under `prefers-reduced-motion`.

## Responsive
Desktop primary. Tablet: summary collapses to top strip. Mobile: rail →
compact step header with progress, summary → sticky bottom sheet with
expand; option cards single column; 16px min body.

## Accessibility
4.5:1 text contrast, visible focus (2px brand outline offset 2px),
fieldset/legend for option groups, aria-current on active step,
aria-live for autosave + estimate updates, reduced motion.

## Forbidden
Public nav/footer; dark mode; orange/purple; mono labels; generic tables as
pages; cursor followers; particles; hover-only content; placeholder mock
data (ORION-7 etc.) shipping as real content.

## 2026-09-02 — Operations app design system

The `/ops` application now has its own universal system (bright porcelain / cobalt, one shell, one scale, one card language). Source of truth: `docs/ops-design/` (audit, layout tokens, typography, cards, status, page archetypes, 21st component sources) and the implementation in `src/components/ops/ui/`. Visual QA: `scripts/ops-qa.mjs` (1920/1440/1366/390 screenshots with overflow, KPI-wrap and console checks).
