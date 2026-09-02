# OPS Card System

Four card levels. Every surface in `/ops` is one of these; nothing else gets a border and a
shadow. Tokens from `OPS_LAYOUT_TOKENS.md`, type roles from `OPS_TYPOGRAPHY_SYSTEM.md`.

| Level | Class | Min size | Padding | Radius | Shadow (rest) | Purpose |
|---|---|---|---|---|---|---|
| 1 KPI card | `.ops-kpi` | h 124 (118–132) · w 220 | 22 | 16 | sm | one metric + context |
| 2 Content panel | `.ops-panel` | h 260 · w 480 (rail: h 200 · w 320) | 26 (24–28) | 20 | sm | a titled section of content |
| 3 Entity card / row | `.ops-entity` | row h 116–148 · card w 320 | 22 | 16 | sm | one client / project / proposal |
| 4 Featured / selected | `.ops-featured` (modifier) | inherits | inherits | 20–24 | active | the chosen or hero item |

Shared base:

```css
.ops-card-base {
  position: relative;
  background: var(--ops-surface);
  border: 1px solid var(--ops-border);
  box-shadow: var(--ops-shadow-sm);
  min-width: 0;
  transition: box-shadow var(--ops-dur) var(--ops-ease), border-color var(--ops-dur) var(--ops-ease),
              transform var(--ops-dur-fast) var(--ops-ease), background-color var(--ops-dur) var(--ops-ease);
}
```

---

## 1. Level 1 — KPI card

### Anatomy

```
┌──────────────────────────────────────────┐  radius 16, padding 22
│ ┌────┐                          [▲ +3]  │  icon container 40×40 r12 · optional delta chip
│ │ ⌁  │                                  │  icon 18, stroke 1.75, --ops-cobalt
│ └────┘                                  │
│ OPEN PIPELINE                           │  .ops-t-label   (12 below icon)
│ $57.5M                                  │  .ops-t-kpi     (4 below label)
│ 14 proposals · 6 in review              │  .ops-t-row-sub (6 below value)
└──────────────────────────────────────────┘  min-height 124
```

Vertical rhythm: icon 40 → 12 → label 16 → 4 → value 38 → 6 → context 18 = 134 with padding 22×2
= 178 on a full card; trim by putting the icon and the label on the same row (icon left, label
right-aligned to the icon's midline) when the row must hit 124:

```
│ ┌────┐  OPEN PIPELINE                   │  icon + label share a 40px row
│ └────┘                                  │
│ $57.5M                                  │
│ 14 proposals · 6 in review              │  → 40 + 10 + 38 + 6 + 18 = 112 + 44 = 156… use padding 20/22
```

Rule: **min-height 124, natural height wins**. All KPI cards in a row share the tallest height
(grid `align-items: stretch`). Never fix a height.

```css
.ops-kpi { composes: ops-card-base; border-radius: var(--ops-radius-md); padding: var(--ops-pad-card); min-height: 124px; display: grid; grid-template-rows: auto auto 1fr; gap: 0; }
.ops-kpi .icon  { width: 40px; height: 40px; border-radius: var(--ops-radius-sm); background: var(--ops-surface-soft); color: var(--ops-cobalt); display: grid; place-items: center; }
.ops-kpi .label { margin-top: 12px; }
.ops-kpi .value { margin-top: 4px; }
.ops-kpi .ctx   { margin-top: 6px; color: var(--ops-ink-muted); }
.ops-kpi .delta { position: absolute; top: 22px; right: 22px; }   /* chip 20px, green/red per sign */

/* variants */
.ops-kpi[data-tone="accent"] .icon { background: var(--ops-gradient-primary); color: #fff; }
.ops-kpi[data-tone="warning"] .icon { background: rgba(236,164,58,.16); color: #8A5A0B; }
.ops-kpi[data-tone="danger"]  .icon { background: rgba(226,85,104,.12); color: #B12E42; }
.ops-kpi[data-size="compact"] { min-height: 96px; padding: 16px 18px; }
.ops-kpi[data-size="compact"] .value { font-size: 28px; line-height: 32px; }
```

Content rules: label ≤ 3 words; value is one number (or one compact money); context line ≤ 40
chars, one line, ellipsized. Deltas only when a real prior period exists — the dashboard
comment in `src/app/ops/page.tsx` forbids fabricated trends; keep it that way.

Clickable KPI (filters the list below): whole card is a `<Link>`; hover state from §5; a 14px
`ArrowUpRight` appears top-right on hover.

---

## 2. Level 2 — Content panel

### Anatomy

```
┌──────────────────────────────────────────────────────────────────┐  radius 20, padding 26
│ Review queue                        6 waiting     [View all →]  │  header: title · summary · action
│ Submitted configurations awaiting engineering.                   │  summary 13/18 secondary (optional)
│ ────────────────────────────────────────────────────────────────  │  hairline, 18 below header
│                                                                  │
│  body (list, table, chart, form)                                 │
│                                                                  │
│ ────────────────────────────────────────────────────────────────  │  optional footer hairline
│ Updated 2 min ago                                    [Refresh]  │  footer: meta left · ghost action right
└──────────────────────────────────────────────────────────────────┘  min-height 260
```

```css
.ops-panel { composes: ops-card-base; border-radius: var(--ops-radius-lg); padding: var(--ops-pad-panel); min-height: 260px; display: flex; flex-direction: column; }
.ops-panel > header { display: flex; align-items: flex-start; gap: 16px; }
.ops-panel > header .titles { flex: 1; min-width: 0; }
.ops-panel > header .title  { /* .ops-t-section */ }
.ops-panel > header .summary{ margin-top: 4px; font: 450 13px/18px var(--ops-font-text); color: var(--ops-ink-secondary); }
.ops-panel > header .count  { /* .ops-t-meta, 20px tall pill, bg --ops-surface-soft, padding 0 8px, radius 999 */ }
.ops-panel > header .action { flex-shrink: 0; }  /* .ops-btn-ghost or .ops-btn-secondary .ops-btn-sm */
.ops-panel > .body   { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--ops-border-hairline); flex: 1; min-height: 0; }
.ops-panel > footer  { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--ops-border-hairline); display: flex; align-items: center; justify-content: space-between; gap: 12px; }

/* rail variant — right column of an 8/4 or 7/5 split */
.ops-panel[data-rail] { padding: 22px; min-height: 200px; }
.ops-panel[data-rail] > header .title { /* .ops-t-section-sm */ }
.ops-panel[data-rail] > .body { margin-top: 14px; padding-top: 14px; }

/* flush variant — body is a table or row list that should touch the edges */
.ops-panel[data-flush] > .body { margin: 18px -26px -26px; padding: 0; border-radius: 0 0 var(--ops-radius-lg) var(--ops-radius-lg); overflow: hidden; }
```

Header rules: title + optional count pill on one line; summary below; exactly one action
(ghost link or small secondary button). A panel with two actions puts the second in a `…` menu.
Panels never nest panels; inside a panel use rows, lists, or hairline-separated groups.

Sticky panels (editor totals, detail facts): `position: sticky; top: calc(var(--ops-utility-bar-height) + 24px)`.

---

## 3. Level 3 — Entity card / row

One client, project, or proposal. Two layouts from the same content: **row** (list pages,
≥1024) and **card** (dashboards, related-item grids, mobile).

### Row anatomy — five zones

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐ r16, padding 22, h 116–148
│ ┌──┐ Cato Digital · Pod cluster A     ● Configuring   $1.2M – $1.8M   viewed 3× · Sep 1   [Open] [⋯] │
│ │CD│ PRP-2026-014 · Jane Cole                          one-time high    2 invitations · 1 verified      │
│ └──┘ Client builds                                                                                      │
│ ─────────────────────────────────────────────────────────────────────────────────────── (expander)      │
│ ▸ Secure access · 2 invitations · 1 verified · next expiry Sep 15                                       │
└──────────────────────────────────────────────────────────────────────────────────────────┘
   IDENTITY (1.6fr, min 280)  STATUS (150)  COMMERCIAL (1fr,min 180)  ENGAGEMENT (1fr,min 200)  ACTIONS (auto)
```

| Zone | Width | Content | Type |
|---|---|---|---|
| Identity | `minmax(280px, 1.6fr)` | avatar/monogram 40 r12 (`--ops-surface-soft`, cobalt initials 13 w700) · name (`.ops-t-row`, truncates) · sub line (`.ops-t-meta` id + `.ops-t-row-sub` contact) · mode tag | link to detail |
| Status | `150px` | one status chip (OPS_STATUS_SYSTEM) | centered vertically |
| Commercial | `minmax(180px, 1fr)` | money range `.ops-t-money` 15px, right-aligned · caption `.ops-t-row-sub` (`one-time high` / `per year`) | nowrap |
| Engagement | `minmax(200px, 1fr)` | `viewed 3× · Sep 1` · `2 invitations · 1 verified` | `.ops-t-row-sub`; `not viewed yet` in muted |
| Actions | `auto` | ≤ 2 visible: `Open` (secondary sm) + `⋯` icon button holding Delete / Withdraw / Invite | right-aligned |

```css
.ops-entity { composes: ops-card-base; border-radius: var(--ops-radius-md); padding: var(--ops-pad-card); }
.ops-entity[data-layout="row"] {
  display: grid; align-items: center; column-gap: 20px;
  grid-template-columns: minmax(280px, 1.6fr) 150px minmax(180px, 1fr) minmax(200px, 1fr) auto;
  min-height: 116px;
}
.ops-entity .zone-commercial { text-align: right; }
.ops-entity .expander { grid-column: 1 / -1; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--ops-border-hairline); }

/* 116 → 148: the expander (secure access summary line) adds 32px when present */
@media (max-width: 1365px) {
  .ops-entity[data-layout="row"] { grid-template-columns: minmax(240px, 1.6fr) 140px minmax(160px, 1fr) auto; }
  .ops-entity[data-layout="row"] .zone-engagement { grid-column: 1 / -1; margin-top: 8px; }   /* engagement drops under identity */
}
@media (max-width: 1023px) { .ops-entity[data-layout="row"] { display: block; } .ops-entity[data-layout="row"] > * { margin-top: 10px; } .ops-entity[data-layout="row"] .zone-commercial { text-align: left; } }
```

### Card anatomy (grid `minmax(320px,1fr)`)

```
┌────────────────────────────────┐ r16, padding 22, min-h 148
│ ┌──┐ Cato Digital      ● Configuring
│ │CD│ Pod cluster A               │
│ └──┘ PRP-2026-014               │
│ ─────────────────────────────── │
│ $1.2M – $1.8M       viewed 3×   │  commercial left, engagement right
│ one-time high       Sep 1       │
│ ─────────────────────────────── │
│ Jane Cole · Client builds  [Open]│
└────────────────────────────────┘
```

Clickable surface: the whole row/card is a link to the detail page **except** the actions
zone and the expander (nested interactive elements). Implement as a `<Link>` covering the card
(`position:absolute; inset:0`) with actions raised via `position:relative; z-index:1`.

### Secure access expander

Never raw tokens or URLs in a list row. Collapsed: one summary line —
`Secure access · 2 invitations · 1 verified · next expiry Sep 15`, eyebrow style, 12px
`ShieldCheck` icon, chevron. Expanded (in place, 220ms height): the invitation mini-rows
(name · email · policy tag · state chip · `Revoke`), then a single `Invite contact…` button that
opens the drawer. Link reveal happens once, in a toast-like success panel, not in the row.

---

## 4. Level 4 — Featured / selected

A modifier, not a separate component. Applied to a KPI, panel, or entity that is the current
selection (editor split, queue preview) or the hero item (dashboard pipeline panel).

```css
.ops-featured, [aria-selected="true"].ops-entity, [aria-current="true"].ops-entity {
  border-color: var(--ops-border-strong);
  background:
    radial-gradient(60% 50% at 100% 0%, rgba(22,141,255,.12), transparent 70%),
    linear-gradient(180deg, #F7FAFF 0%, var(--ops-surface-selected) 100%);
  box-shadow: var(--ops-shadow-active);
}
.ops-featured::before {           /* left accent bar */
  content: ""; position: absolute; left: -1px; top: 16px; bottom: 16px; width: 3px;
  border-radius: 2px; background: var(--ops-gradient-primary);
}
.ops-featured[data-hero] { border-radius: var(--ops-radius-xl); }   /* dashboard hero panel: 24 */
```

Rules: at most **one** featured item per view region (one selected row in a list, one hero
panel on the dashboard). Featured never stacks with `danger`/`warning` tones — a selected
declined proposal keeps its red chip, the card frame stays blue.

---

## 5. States

| State | Trigger | Visual | Motion |
|---|---|---|---|
| Rest | — | border `--ops-border`, shadow sm, bg surface | — |
| Hover (clickable only) | `:hover` | border → `rgba(27,85,245,.18)`, shadow sm → md, `translateY(-1px)` | 220ms `--ops-ease` |
| Pressed | `:active` | `scale(.995)`, shadow back to sm | 180ms |
| Focus | `:focus-visible` on the card link | `box-shadow: var(--ops-shadow-sm), var(--ops-focus-ring)` | 0 |
| Selected | `aria-selected` / `aria-current` | Level 4 treatment | 220ms |
| Disabled / archived | `data-disabled` | opacity .6, bg `--ops-bg-elevated`, no hover, chip stays legible | — |
| Loading | skeleton sibling | same geometry, `--ops-surface-soft` blocks, shimmer 1.4s linear (disabled under reduced motion) | — |
| Dragging (queue reorder) | `data-dragging` | shadow active, `rotate(0.4deg)`, opacity .95 | — |

```css
.ops-card-base[data-interactive]:hover { border-color: rgba(27,85,245,.18); box-shadow: var(--ops-shadow-md); transform: translateY(-1px); }
.ops-card-base[data-interactive]:active { transform: scale(.995); box-shadow: var(--ops-shadow-sm); }
.ops-card-base:has(> a:focus-visible) { box-shadow: var(--ops-shadow-sm), var(--ops-focus-ring); }
@media (prefers-reduced-motion: reduce) { .ops-card-base { transition: none; } .ops-card-base[data-interactive]:hover { transform: none; } }
```

Non-interactive KPI cards and content panels have **no** hover state. Hover means "this opens".

---

## 6. Grid rules

| Grid | Template | Gap | Notes |
|---|---|---|---|
| KPI row | `repeat(auto-fit, minmax(220px, 1fr))`, pinned to 4 or 6 per OPS_LAYOUT_TOKENS §5.3 | 16 | equal heights via `align-items: stretch` |
| Entity cards | `repeat(auto-fit, minmax(320px, 1fr))` (≤ 380 ideal) | 16 | cards, not rows |
| Entity rows | single column, `display: grid; gap: 12px` | 12 | rows never share a line |
| Panels | 12-col splits 8/4 · 7/5 · 6/6, or `repeat(auto-fit, minmax(480px, 1fr))` | 24 | rail panels min 320 |
| Inside a panel | rows separated by `--ops-border-hairline`, 12px vertical padding, no nested cards | 0 | |

Compositions:

```
8/4:  [ main panel(s) 8 cols ] [ rail: 2–3 rail panels stacked, gap 16 ]
7/5:  [ editor 7 cols        ] [ preview / totals (featured), sticky ]
6/6:  [ panel ] [ panel ]
12:   [ entity rows, gap 12 ]
```

---

## 7. Do / Don't

**Do**
- Pick the level first, then fill it. If the content does not fit a level, the content is
  wrong for a card — use a table or a plain list inside a panel.
- Keep one status chip per entity. Mode (`Client builds` / `PODOS builds`) is a neutral tag,
  not a chip.
- Right-align money; caption it (`one-time high`, `per year`).
- Use the expander for secure access; keep tokens and URLs out of rows.
- Give clickable cards a hover and a focus ring; give static ones neither.

**Don't**
- Don't nest a card inside a card. Panel → rows. Never panel → panel.
- Don't fix card heights; set `min-height` and let the grid equalize.
- Don't put more than two visible actions on a row.
- Don't show inline `<select>` + `Invite` forms in rows (current `page.tsx` does) — drawer.
- Don't use `flex-wrap` for the row zones; the grid template handles breakpoints.
- Don't animate `height`/`width` on hover; only `transform`, `box-shadow`, `border-color`.
