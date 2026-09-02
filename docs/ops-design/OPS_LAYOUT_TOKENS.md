# OPS Layout Tokens

PODOS AI operations platform (`/ops/*`). Bright, premium, engineered. This file is the
single source for shell geometry, spacing, color, radius, shadow and grid tokens. The other
four docs (`OPS_TYPOGRAPHY_SYSTEM`, `OPS_CARD_SYSTEM`, `OPS_STATUS_SYSTEM`,
`OPS_PAGE_ARCHETYPES`) reference these names and never redefine them.

Founder brief: 2026-09-02. Supersedes `design-system/podos-private-proposal-platform/MASTER.md`
for everything under `/ops`. Marketing site tokens in `src/app/globals.css` stay untouched —
ops tokens are scoped to `.ops` so nothing leaks into the public site.

---

## 1. Principles

1. One canvas, centered, max 1680px. Nothing stretches edge to edge on a 4K monitor.
2. 12-column grid, 24px gutter. Every composition is a whole-column split (8/4, 7/5, 6/6, 12).
3. Spacing is a 4px scale. Section gap 24, panel gap 16. No 13px, no 0.9rem.
4. Light only. No dark surfaces, no particles, no neon. Depth comes from blue-tinted shadows
   and a faint blueprint grid, not from black.
5. Numbers never wrap. Currency is `tabular-nums` + `nowrap` everywhere.

---

## 2. Token sheet

Drop into `src/app/ops/ops-tokens.css` (or the top of an `ops.module.css`) and apply the
`.ops` class on the shell root. Legacy names remain valid through the shim block in §3.

```css
.ops {
  /* ---------- shell geometry ---------- */
  --ops-sidebar-width: 252px;
  --ops-sidebar-rail-width: 72px;            /* tablet collapsed rail */
  --ops-utility-bar-height: 56px;
  --ops-page-max-width: 1680px;
  --ops-page-padding-x: clamp(24px, 3vw, 48px);
  --ops-page-padding-y: 32px;
  --ops-drawer-width: 520px;                 /* right-side wizard drawer (min 480, max 640) */

  /* ---------- spacing scale (4-based) ---------- */
  --ops-space-1: 4px;
  --ops-space-2: 8px;
  --ops-space-3: 12px;
  --ops-space-4: 16px;   /* panel gap */
  --ops-space-5: 20px;
  --ops-space-6: 24px;   /* section gap, grid gutter */
  --ops-space-8: 32px;
  --ops-space-10: 40px;
  --ops-space-12: 48px;

  --ops-gap-section: 24px;
  --ops-gap-panel: 16px;
  --ops-gap-grid: 24px;
  --ops-pad-card: 22px;
  --ops-pad-panel: 26px;

  /* ---------- radii ---------- */
  --ops-radius-sm: 12px;   /* buttons, inputs, icon containers, chips-rect, nav items */
  --ops-radius-md: 16px;   /* KPI cards, entity rows/cards */
  --ops-radius-lg: 20px;   /* content panels */
  --ops-radius-xl: 24px;   /* featured/hero panel, drawer, modal */
  --ops-radius-pill: 999px;

  /* ---------- color: surfaces ---------- */
  --ops-bg: #F4F7FC;
  --ops-bg-elevated: #F8FBFF;
  --ops-surface: #FFFFFF;
  --ops-surface-soft: #F2F7FF;
  --ops-surface-selected: #EAF2FF;

  /* ---------- color: ink ---------- */
  --ops-ink: #071126;
  --ops-ink-secondary: #35425B;
  --ops-ink-muted: #7D8BA3;
  --ops-ink-on-brand: #FFFFFF;

  /* ---------- color: brand ---------- */
  --ops-cobalt-deep: #1236C6;
  --ops-cobalt: #1B55F5;
  --ops-electric: #168DFF;
  --ops-cyan: #27C3EA;
  --ops-purple: #7759F6;

  /* ---------- color: semantic ---------- */
  --ops-live: #20C77A;
  --ops-warning: #ECA43A;
  --ops-danger: #E25568;
  /* status-only extensions (not in the brief; needed for the chip ladder in OPS_STATUS_SYSTEM) */
  --ops-orange: #F08A3C;
  --ops-indigo: #4F5AEE;

  /* ---------- borders ---------- */
  --ops-border: rgba(34, 82, 154, 0.12);
  --ops-border-strong: rgba(27, 85, 245, 0.28);
  --ops-border-hairline: rgba(34, 82, 154, 0.07);   /* dividers inside cards */

  /* ---------- shadows ---------- */
  --ops-shadow-sm: 0 6px 22px rgba(27, 57, 103, 0.06);
  --ops-shadow-md: 0 16px 42px rgba(22, 53, 103, 0.09);
  --ops-shadow-active: 0 18px 48px rgba(27, 85, 245, 0.15);
  --ops-focus-ring: 0 0 0 3px rgba(27, 85, 245, 0.22);

  /* ---------- gradients ---------- */
  --ops-gradient-primary: linear-gradient(135deg, #1236C6 0%, #168DFF 62%, #27C3EA 100%);
  --ops-gradient-soft: linear-gradient(180deg, #F8FBFF 0%, #EAF2FF 100%);
  --ops-gradient-glow: radial-gradient(60% 50% at 100% 0%, rgba(22, 141, 255, 0.14), transparent 70%);

  /* ---------- motion ---------- */
  --ops-dur-fast: 180ms;
  --ops-dur: 220ms;
  --ops-dur-slow: 260ms;
  --ops-ease: cubic-bezier(0.22, 1, 0.36, 1);        /* out-quart */
  --ops-ease-expo: cubic-bezier(0.16, 1, 0.3, 1);    /* drawers */

  /* ---------- z-index ---------- */
  --ops-z-utility: 20;
  --ops-z-sidebar: 30;
  --ops-z-backdrop: 40;
  --ops-z-drawer: 50;
  --ops-z-toast: 60;
  --ops-z-tooltip: 70;
}

@media (prefers-reduced-motion: reduce) {
  .ops { --ops-dur-fast: 0ms; --ops-dur: 0ms; --ops-dur-slow: 0ms; }
}
```

---

## 3. Legacy → new mapping

Existing `/ops` pages import `src/components/private/private.module.css` and use the
marketing tokens from `globals.css`. Map as follows when migrating; the shim block keeps old
code rendering with the new palette during the transition.

| Old (globals.css / private.module.css) | New | Notes |
|---|---|---|
| `--paper` | `--ops-bg` | #F7F9FB → #F4F7FC (cooler, more blue) |
| `--canvas` | `--ops-bg-elevated` | |
| `--panel` | `--ops-surface` | |
| `--brand-wash` `--brand-trace` | `--ops-surface-soft` | solid, not alpha — cards stack cleanly |
| (none) | `--ops-surface-selected` | new: selected row / featured fill |
| `--ink-strong` | `--ops-ink` | #0F172A → #071126 |
| `--ink-dim` `--graphite` | `--ops-ink-secondary` | |
| `--ink-faint` | `--ops-ink-muted` | #94A3B8 → #7D8BA3 (passes 4.5:1 on white) |
| `--brand-deep` `--brand-darker` | `--ops-cobalt-deep` | |
| `--brand` | `--ops-cobalt` | #2563EB → #1B55F5 |
| `--brand-bright` `--sky` | `--ops-electric` | |
| `--cyan` `--teal` `--electric-bright` | `--ops-cyan` | #22D3EE → #27C3EA |
| `--status` `--prv-ok` | `--ops-live` | |
| `--prv-amber` | `--ops-warning` | fg use needs the darker chip fg from OPS_STATUS_SYSTEM |
| `--prv-danger` | `--ops-danger` | |
| `--edge` `--edge-soft` | `--ops-border` | |
| `--edge-bright` | `--ops-border-strong` | |
| `--edge-faint` | `--ops-border-hairline` | |
| `--brand-gradient` | `--ops-gradient-primary` | 2-stop → 3-stop |
| `--prv-r-ctrl` (10) | `--ops-radius-sm` (12) | |
| `--prv-r-card` (16) | `--ops-radius-md` (16) KPI/entity · `--ops-radius-lg` (20) panels | split by card level |
| `--prv-r-chip` | `--ops-radius-pill` | |
| `--prv-shadow-1` | `--ops-shadow-sm` | |
| `--prv-shadow-2` | `--ops-shadow-md` | |
| `--prv-shadow-glow` | `--ops-shadow-active` | |
| `--prv-dur` (200) / `--prv-ease` | `--ops-dur` (220) / `--ops-ease` | |
| `--font-mono` `--font-geist-mono` `.t-mono` | `.ops-t-meta` (Geist + tnum) | monospace retired by founder rule |
| `s.chipBrand/Cyan/Ok/Amber/Danger` | `--ops-status-*` tokens | see OPS_STATUS_SYSTEM §3 |
| `s.panel` | `.ops-panel` / `.ops-card` | by level, see OPS_CARD_SYSTEM |
| `s.btn s.btnPrimary` | `.ops-btn .ops-btn-primary` | §8 below |

Shim (temporary, delete once every `/ops` file is migrated):

```css
.ops {
  --paper: var(--ops-bg); --panel: var(--ops-surface);
  --ink-strong: var(--ops-ink); --ink-dim: var(--ops-ink-secondary); --ink-faint: var(--ops-ink-muted);
  --brand: var(--ops-cobalt); --brand-deep: var(--ops-cobalt-deep); --brand-bright: var(--ops-electric);
  --cyan: var(--ops-cyan); --status: var(--ops-live);
  --edge: var(--ops-border); --edge-bright: var(--ops-border-strong); --edge-faint: var(--ops-border-hairline);
  --brand-wash: var(--ops-surface-soft); --brand-gradient: var(--ops-gradient-primary);
}
```

---

## 4. Shell geometry

```
┌──────────┬────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR  │ UTILITY BAR  56px   [search ⌘K]            [env PRODUCTION ●] [user ▾] │
│ 252px    ├────────────────────────────────────────────────────────────────────────┤
│ fixed    │ ← page-padding-x →┌──────────── canvas, max 1680, centered ──────────┐ │
│          │                   │ PAGE HEADER                                     │ │
│ [logo]   │                   │  Title 36/40 ······················ [Actions]   │ │
│ 160w     │                   │  Subtitle 15/23, max-width 700px                │ │
│ OPERATIONS                   │                                                 │ │
│ PRODUCTION●                  │ ── 24 ──                                        │ │
│          │                   │ SUMMARY KPI ROW  (grid, gap 16)                 │ │
│ Dashboard│                   │ ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐            │ │
│ Clients  │                   │ └────┘└────┘└────┘└────┘└────┘└────┘            │ │
│ Projects │                   │ ── 24 ──                                        │ │
│ Proposals│                   │ TOOLBAR  [search][filters ▾][sort ▾] ··· [view] │ │
│ …        │                   │ ── 24 ──                                        │ │
│          │                   │ CONTENT  (12-col grid, gutter 24)               │ │
│          │                   │ ┌────────── 8 ──────────┐ ┌──── 4 ────┐         │ │
│ Sign out │                   │ └───────────────────────┘ └───────────┘         │ │
└──────────┴───────────────────┴─────────────────────────────────────────────────┴─┘
```

### 4.1 Sidebar (fixed, light)

| Part | Value |
|---|---|
| Width | `--ops-sidebar-width` 252px (brief range 240–260) |
| Position | `position: fixed; inset: 0 auto 0 0; height: 100dvh; overflow-y: auto` |
| Background | `--ops-surface` with `border-right: 1px solid var(--ops-border)` |
| Padding | 24px 16px 20px |
| Logo | official wordmark `/logo.png`, rendered width **160px** (range 150–180), height auto, `priority` |
| Label row | `OPERATIONS` — 11px w600 +0.12em uppercase `--ops-ink-muted`, 12px below logo |
| Env badge | `PRODUCTION` pill: 20px tall, 10.5px w650 +0.08em, fg `--ops-cobalt-deep`, bg `--ops-surface-soft`, border `--ops-border-strong`; 6px live dot `--ops-live` with 2.2s ring pulse (from `.live-pulse` in globals) |
| Nav item | height 40, padding 0 12px, radius `--ops-radius-sm`, 14px w550 `--ops-ink-secondary`, icon 18 stroke 1.75, gap 10 |
| Nav active | bg `--ops-surface-selected`, fg `--ops-cobalt-deep`, w650, 3px left accent bar `--ops-gradient-primary` radius 2 (inset 8px top/bottom) |
| Nav hover | bg `--ops-surface-soft`, 180ms |
| Nav disabled (module not ready) | fg `--ops-ink-muted` at 55% opacity, `cursor: default`, no hover |
| Nav groups | uppercase 11px label + 8px gap; groups: Work (Dashboard, Proposals, Engineering Review, Signatures) · Accounts (Clients, Projects) · Configure (Catalog & Pricing, Document Design, Settings) · System (Activity, Users & Roles) |
| Footer | user chip (avatar 28 + name 13 w550 + role 11.5 muted) and Sign out ghost button 36px |

Current `OpsShell.tsx` is 224px with 10.5px uppercase mono nav — migrate to the values above.

### 4.2 Utility bar

Height 56, `position: sticky; top: 0`, bg `rgba(244,247,252,0.82)` + `backdrop-filter: blur(12px)`,
bottom border `--ops-border-hairline`. Contents: breadcrumb (13px muted, `/` separators) left;
command-search field 320×36 center-left; right cluster: env badge (duplicated from sidebar on
tablet where the sidebar is hidden), notifications icon button 36, user menu. Padding-x matches
`--ops-page-padding-x`.

### 4.3 Main canvas

```css
.ops-main {
  margin-left: var(--ops-sidebar-width);
  min-width: 0;
  background: var(--ops-bg);
}
.ops-page {
  max-width: var(--ops-page-max-width);
  margin: 0 auto;
  padding: var(--ops-page-padding-y) var(--ops-page-padding-x) 64px;
  display: grid;
  gap: var(--ops-gap-section);
}
```

The 1680 cap only engages on viewports ≥ 2028px (252 + 96 + 1680). On every standard laptop
and 1920 monitor the canvas is fluid.

### 4.4 Page header

| Part | Value |
|---|---|
| Layout | `display:flex; align-items:flex-end; gap:24px` — title block grows, actions cluster right |
| Title | `.ops-t-page` 36/40 w800 |
| Subtitle | `.ops-t-sub` 15/23, `max-width: 700px`, margin-top 6 |
| Actions | ≤ 1 primary + 2 secondary buttons, gap 10; overflow → `…` menu |
| Bottom | 24px to KPI row (section gap). No border under the header. |

---

## 5. Grid system

### 5.1 The 12-column grid

```css
.ops-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--ops-gap-grid);
}
.ops-col-8 { grid-column: span 8; min-width: 0; }
.ops-col-7 { grid-column: span 7; min-width: 0; }
.ops-col-6 { grid-column: span 6; min-width: 0; }
.ops-col-5 { grid-column: span 5; min-width: 0; }
.ops-col-4 { grid-column: span 4; min-width: 0; }
.ops-col-12 { grid-column: 1 / -1; }

/* auto-fit sub-grids */
.ops-kpi-grid    { display: grid; gap: var(--ops-gap-panel); grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.ops-entity-grid { display: grid; gap: var(--ops-gap-panel); grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
.ops-panel-grid  { display: grid; gap: var(--ops-gap-grid);  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); }
```

Named splits (the only main compositions allowed):

| Split | Use | Rail min |
|---|---|---|
| 8 / 4 | Dashboard, Detail, Queue — main content + contextual rail | 320px |
| 7 / 5 | Editor/Split — editor + live preview/totals | 400px |
| 6 / 6 | Two equal panels (Settings compare, side-by-side lists) | 480px |
| 12 | List rows, tables, full-width panels | — |

Splits stack to 12/12 when the canvas content width drops below 1000px (tablet).

### 5.2 Breakpoints and computed geometry

Content width = viewport − sidebar − 2 × padding-x. Column width = (content − 11 × 24) / 12.

| Viewport | Sidebar | pad-x | Content | 12-col col width | 8/4 → main / rail | 7/5 → main / rail |
|---|---|---|---|---|---|---|
| 1920 | 252 | 48 | **1572** | 109 | 1040 / 508 | 907 / 641 |
| 1600 | 252 | 48 | **1252** | 82 | 827 / 401 | 720 / 508 |
| 1440 | 252 | 43 | **1102** | 70 | 708 / 351 | 633 / 445 |
| 1366 | 252 | 41 | **1032** | 64 | 680 / 328 | 592 / 416 |
| 1024 (tablet landscape) | 72 rail | 31 | **891** | 8-col grid, gutter 20 → 94 | stacked 12/12 | stacked |
| 768 (tablet portrait) | off-canvas | 24 | **720** | 8-col, gutter 20 → 73 | stacked | stacked |
| 390 (mobile) | off-canvas | 24 | **342** | 4-col, gutter 16 → 74 | stacked | stacked |

Media queries (viewport-based; sidebar changes drive the jumps):

```css
@media (max-width: 1365px) { .ops { --ops-sidebar-width: 72px; } }              /* icon rail */
@media (max-width: 1023px) { .ops { --ops-sidebar-width: 0px; } }               /* drawer nav */
@media (max-width: 1279px) { .ops-col-8, .ops-col-7, .ops-col-6, .ops-col-5, .ops-col-4 { grid-column: 1 / -1; } }
@media (max-width: 767px)  { .ops { --ops-page-padding-y: 20px; --ops-gap-section: 20px; } }
```

### 5.3 Column counts per grid type

Auto-fit counts at each content width (gap 16 for KPI/entity, 24 for panels):

| Grid | 1920 (1572) | 1600 (1252) | 1440 (1102) | 1366 (1032) | 1024 (891) | 768 (720) | 390 (342) |
|---|---|---|---|---|---|---|---|
| KPI `minmax(220px,1fr)` | 6 (249 each) | 5 (237) | 4 (263) | 4 (246) | 3 (286) | 3 (229) | 1 → use compact 2-up |
| Entity `minmax(320px,1fr)` | 4 (381) | 3 (406) | 3 (357) | 3 (333) | 2 (437) | 2 (352) | 1 |
| Panels `minmax(480px,1fr)` | 3 (508) | 2 (614) | 2 (539) | 2 (504) | 1 | 1 | 1 |

**Orphan rule.** A KPI row must divide evenly at every breakpoint. Author KPI sets of 4 or 6 and
pin them explicitly rather than trusting auto-fit:

```css
.ops-kpi-grid[data-count="6"] { grid-template-columns: repeat(6, 1fr); }
.ops-kpi-grid[data-count="4"] { grid-template-columns: repeat(4, 1fr); }
@media (max-width: 1919px) { .ops-kpi-grid[data-count="6"] { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 1023px) { .ops-kpi-grid[data-count="6"], .ops-kpi-grid[data-count="4"] { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 767px)  { .ops-kpi-grid[data-count="6"], .ops-kpi-grid[data-count="4"] { grid-template-columns: repeat(2, minmax(0, 1fr)); } } /* compact KPI (min-h 96, value 28) */
```

Result: 6-set → 6×1 (≥1920), 3×2 (1366–1919), 2×3 (tablet/mobile). 4-set → 4×1 (≥1024), 2×2 below.

---

## 6. Background recipe

Soft blue-white base, faint blueprint grid at 2–4% opacity, one radial glow upper-right, a few
connector nodes. No dark, no particles, no animation on the background.

```css
.ops-main {
  background-color: var(--ops-bg);
  background-image:
    radial-gradient(52% 40% at 100% 0%, rgba(22, 141, 255, 0.10), transparent 70%),   /* glow */
    linear-gradient(rgba(27, 85, 245, 0.035) 1px, transparent 1px),                   /* grid rows */
    linear-gradient(90deg, rgba(27, 85, 245, 0.035) 1px, transparent 1px);            /* grid cols */
  background-size: auto, 48px 48px, 48px 48px;
  background-attachment: fixed, local, local;
}
/* connector nodes: a single decorative SVG (generated asset, not hand-drawn) placed
   absolute top:-40px right:-60px, 420×320, opacity .55, pointer-events:none,
   hidden below 1366px. Source it via /generate-visual, save to public/visuals/ops-nodes.webp. */
```

Grid opacity 3.5% ≈ brief's 2–4%. Cards sit on top with `--ops-surface` (#FFF) so the grid
disappears behind content and only shows in gutters.

---

## 7. Do / Don't

**Do**
- Center the canvas; cap at 1680.
- Use whole-column splits. If a layout needs 9/3, the rail is too thin — use 8/4.
- Keep every gap on the 4px scale: 4, 8, 12, 16, 20, 24, 32, 40, 48.
- Give every grid child `min-width: 0` so long names ellipsize instead of blowing the grid.
- Stack the rail below the main column at tablet; never side-by-side under 1000px content.
- Put KPI rows in sets of 4 or 6.

**Don't**
- Don't use `rem` gaps like 0.9rem / 1.4rem (current pages do). Use tokens.
- Don't add a fourth shadow. Three levels (sm/md/active) are the whole vocabulary.
- Don't paint dark panels, gradients on text blocks, or particle fields.
- Don't let the sidebar scroll with the page — it's fixed.
- Don't inline creation forms in list pages; open the right drawer (`--ops-drawer-width`).
- Don't exceed 700px on subtitles or 76ch on help text.

---

## 8. Core snippets

Buttons (used by every archetype):

```css
.ops-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 44px; padding: 0 18px;
  border-radius: var(--ops-radius-sm);
  font: 600 14px/20px var(--font-inter-tight), system-ui, sans-serif; letter-spacing: -0.005em;
  cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: transform var(--ops-dur-fast) var(--ops-ease), box-shadow var(--ops-dur) var(--ops-ease),
              background-color var(--ops-dur) var(--ops-ease), border-color var(--ops-dur) var(--ops-ease);
}
.ops-btn:hover  { transform: translateY(-1px); }
.ops-btn:active { transform: scale(0.985); }
.ops-btn:focus-visible { outline: none; box-shadow: var(--ops-focus-ring); }
.ops-btn[disabled] { opacity: .55; pointer-events: none; }

.ops-btn-primary   { color: #fff; border: 0; background: var(--ops-gradient-primary); box-shadow: 0 10px 24px -12px rgba(27,85,245,.55); }
.ops-btn-primary:hover { box-shadow: var(--ops-shadow-active); filter: brightness(1.05); }
.ops-btn-secondary { color: var(--ops-ink); background: var(--ops-surface); border: 1px solid var(--ops-border-strong); }
.ops-btn-secondary:hover { border-color: var(--ops-cobalt); color: var(--ops-cobalt-deep); background: var(--ops-surface-soft); }
.ops-btn-ghost     { color: var(--ops-cobalt-deep); background: transparent; border: 0; min-height: 36px; padding: 0 10px; }
.ops-btn-danger    { color: #B12E42; background: rgba(226,85,104,.08); border: 1px solid rgba(226,85,104,.32); }
.ops-btn-sm        { min-height: 36px; padding: 0 12px; font-size: 13px; }
.ops-btn-icon      { width: 36px; min-height: 36px; padding: 0; }
```

Inputs:

```css
.ops-input, .ops-select, .ops-textarea {
  width: 100%; min-height: 44px; padding: 0 14px;
  border: 1px solid var(--ops-border-strong); border-radius: var(--ops-radius-sm);
  background: var(--ops-surface); color: var(--ops-ink);
  font: 500 14px/20px var(--font-inter-tight), system-ui, sans-serif;
  transition: border-color var(--ops-dur) var(--ops-ease), box-shadow var(--ops-dur) var(--ops-ease);
}
.ops-input:focus-visible { outline: none; border-color: var(--ops-cobalt); box-shadow: var(--ops-focus-ring); }
.ops-input::placeholder { color: var(--ops-ink-muted); }
```

Right drawer (creation wizard — replaces `NewProposalForm` inline on list pages):

```css
.ops-drawer {
  position: fixed; inset: 0 0 0 auto; width: var(--ops-drawer-width); max-width: 100vw;
  background: var(--ops-surface); border-left: 1px solid var(--ops-border);
  border-radius: var(--ops-radius-xl) 0 0 var(--ops-radius-xl);
  box-shadow: -24px 0 64px rgba(22,53,103,.16);
  display: grid; grid-template-rows: auto 1fr auto; z-index: var(--ops-z-drawer);
  transform: translateX(100%); transition: transform var(--ops-dur-slow) var(--ops-ease-expo);
}
.ops-drawer[data-open="true"] { transform: none; }
.ops-drawer-backdrop { position: fixed; inset: 0; background: rgba(7,17,38,.28); backdrop-filter: blur(4px); z-index: var(--ops-z-backdrop); }
.ops-drawer > header, .ops-drawer > footer { padding: 24px 32px; }
.ops-drawer > footer { border-top: 1px solid var(--ops-border-hairline); display: flex; justify-content: flex-end; gap: 10px; }
.ops-drawer > .body { padding: 8px 32px 24px; overflow-y: auto; }
@media (max-width: 767px) { .ops-drawer { width: 100vw; border-radius: 0; } }
```
