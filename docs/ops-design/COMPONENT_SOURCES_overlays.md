# Component sources — ops overlays & list chrome (2026-09-02)

Scope: right-side drawer · multi-step creation wizard inside the drawer · list toolbar · tabs · command search, for the bright PODOS operations platform (`/ops`).

## Method

21st MCP (`mcp__21st-global__search` → `get_component`, paid tier) was the first discovery source. Seven functional searches ran; eleven candidates had their **real source retrieved and read** (not judged from previews). Every adopted pattern is normalized below into the ops tokens — none is used verbatim; every Tailwind class, demo colour, hand-drawn SVG, sample copy and dark-mode branch is removed.

| # | Search intent (verbatim) | Retrieved (demo id) |
|---|---|---|
| 1 | `right side drawer sheet panel slide over` | 23558 ddoemonn Drawer · 25002 shadcnspace Sheet |
| 2 | `multi-step form wizard stepper with progress and next back` | 23576 ddoemonn Wizard Steps · 7821 dhileepkumargm Multi-step Wizard |
| 3 | `data table toolbar search filter sort view toggle` | 19516 cnippet Toolbar (Base UI) · 22162 felipemenezes098 Table with Filters |
| 4 | `segmented control toggle group icon buttons grid list view switch` | 23552 ddoemonn Segmented Control |
| 5 | `filter bar with filter chips popover and saved views` | none retrieved — results were chip breadcrumbs / e-commerce filter grids (wrong job) |
| 6 | `tabs animated underline indicator` | 24930 educalvolpz Animated Tabs · 24956 cnippet Underline Tabs |
| 7 | `command menu palette search cmdk` | 23522 ddoemonn Command Palette · 382 Origin UI Command |

Project constraints honoured everywhere:

- Next 16 / React 19. Server components by default; only the five interactive pieces are `"use client"`.
- The unlayered reset in `src/app/globals.css` zeroes margin/padding on everything outside `.invest`, so **no Tailwind spacing utilities**. All styling is one CSS module (`src/components/ops/ui/ops-ui.module.css`) plus a few inline style objects for computed values.
- Motion via the already-installed `motion` 12 (`motion/react`). Icons via `lucide-react`. **No new dependencies** for any adopted pattern (Radix, Base UI, cmdk, TanStack and class-variance-authority were all rejected on that ground).
- Fonts: Geist (`--font-display`) for titles, KPI figures and technical metadata with `font-variant-numeric: tabular-nums`; Inter Tight (`--font-body`) for text. No mono family.
- Buttons: primary gradient, 12px radius, min 44px, hover -1px, press scale .985, 180–260ms, `prefers-reduced-motion` respected.

## Ops tokens (add to `:root` in `src/app/globals.css`)

```css
:root {
  --ops-sidebar-width: 252px;
  --ops-page-max-width: 1680px;
  --ops-page-padding-x: clamp(24px, 3vw, 48px);
  --ops-page-padding-y: 32px;
  --ops-gap-section: 24px;
  --ops-gap-panel: 16px;
  --ops-pad-card: 22px;
  --ops-pad-panel: 26px;
  --ops-r-12: 12px; --ops-r-16: 16px; --ops-r-20: 20px; --ops-r-24: 24px;

  --ops-bg: #F4F7FC;
  --ops-bg-elevated: #F8FBFF;
  --ops-surface: #FFFFFF;
  --ops-surface-soft: #F2F7FF;
  --ops-surface-selected: #EAF2FF;
  --ops-ink: #071126;
  --ops-ink-secondary: #35425B;
  --ops-ink-muted: #7D8BA3;
  --ops-cobalt-deep: #1236C6;
  --ops-cobalt: #1B55F5;
  --ops-electric: #168DFF;
  --ops-cyan: #27C3EA;
  --ops-live: #20C77A;
  --ops-warning: #ECA43A;
  --ops-danger: #E25568;
  --ops-purple: #7759F6;
  --ops-border: rgba(34, 82, 154, .12);
  --ops-border-strong: rgba(27, 85, 245, .28);
  --ops-shadow-sm: 0 6px 22px rgba(27, 57, 103, .06);
  --ops-shadow-md: 0 16px 42px rgba(22, 53, 103, .09);
  --ops-shadow-active: 0 18px 48px rgba(27, 85, 245, .15);
  --ops-gradient-primary: linear-gradient(135deg, #1236C6 0%, #168DFF 62%, #27C3EA 100%);
  --ops-focus: 0 0 0 3px rgba(27, 85, 245, .28);
  --ops-ease: cubic-bezier(.22, 1, .36, 1);
  --ops-dur: 220ms;
}
```

## Shared CSS module — `src/components/ops/ui/ops-ui.module.css`

One file for all five patterns so they share one radius/elevation/focus logic (component-policy §10). Every class sets its own padding/margins because the reset removed the defaults.

```css
/* ---------- primitives ---------- */
.srOnly { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 44px; padding: 0 18px; border-radius: var(--ops-r-12);
  font-family: var(--font-body); font-size: 14px; font-weight: 650; line-height: 1;
  border: 1px solid transparent; cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: transform var(--ops-dur) var(--ops-ease), box-shadow var(--ops-dur) var(--ops-ease), background-color var(--ops-dur) var(--ops-ease), border-color var(--ops-dur) var(--ops-ease);
}
.btn:focus-visible { outline: none; box-shadow: var(--ops-focus); }
.btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }
.btnPrimary { background: var(--ops-gradient-primary); color: #fff; box-shadow: var(--ops-shadow-sm); }
.btnPrimary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: var(--ops-shadow-active); }
.btnPrimary:active:not(:disabled) { transform: scale(.985); }
.btnSecondary { background: var(--ops-surface); color: var(--ops-ink); border-color: var(--ops-border-strong); }
.btnSecondary:hover:not(:disabled) { background: var(--ops-surface-soft); transform: translateY(-1px); }
.btnSecondary:active:not(:disabled) { transform: scale(.985); }
.btnGhost { background: transparent; color: var(--ops-ink-secondary); min-height: 40px; padding: 0 12px; }
.btnGhost:hover:not(:disabled) { background: var(--ops-surface-soft); color: var(--ops-ink); }
.btnIcon { width: 40px; min-height: 40px; padding: 0; border-radius: var(--ops-r-12); }

.field {
  width: 100%; min-height: 44px; padding: 0 14px; border-radius: var(--ops-r-12);
  border: 1px solid var(--ops-border-strong); background: var(--ops-surface);
  font-family: var(--font-body); font-size: 14.5px; color: var(--ops-ink);
  transition: border-color var(--ops-dur) var(--ops-ease), box-shadow var(--ops-dur) var(--ops-ease);
}
.field:focus-visible { outline: none; border-color: var(--ops-cobalt); box-shadow: var(--ops-focus); }
.field::placeholder { color: var(--ops-ink-muted); }
.fieldLabel { display: grid; gap: 6px; }
.label { font-family: var(--font-body); font-size: 11.5px; line-height: 16px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--ops-ink-muted); }
.help { font-family: var(--font-body); font-size: 13px; line-height: 20px; color: var(--ops-ink-secondary); }
.meta { font-family: var(--font-display); font-size: 12px; line-height: 16px; color: var(--ops-ink-muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
.kbd { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 6px; border: 1px solid var(--ops-border); background: var(--ops-surface-soft); font-family: var(--font-display); font-size: 11px; font-variant-numeric: tabular-nums; color: var(--ops-ink-muted); }

@media (prefers-reduced-motion: reduce) {
  .btn, .field { transition: none; }
  .btnPrimary:hover:not(:disabled), .btnSecondary:hover:not(:disabled) { transform: none; }
}
```

<!-- CONTINUE -->
