# OPS Typography System

Two families, no monospace. **Geist** for display (titles, KPI values, technical metadata),
**Inter Tight** for text (subtitles, rows, body, buttons). The founder retired the typewriter
face site-wide (see the `--font-mono` note in `src/app/globals.css`); the brief's Geist Mono is
overridden — technical metadata is Geist with `tabular-nums`.

Both families are loaded in `src/app/layout.tsx` via `next/font/google` as variable fonts and
exposed as `--font-geist` and `--font-inter-tight`. Intermediate weights (625, 675, 725, 825)
are legal for variable fonts; if a family is ever loaded as static cuts, round to the nearest
hundred.

```css
.ops {
  --ops-font-display: var(--font-geist), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --ops-font-text:    var(--font-inter-tight), ui-sans-serif, system-ui, -apple-system, sans-serif;
}
```

---

## 1. Role table

Sizes in px. `size/line` = font-size / line-height. Tracking in em. Weights are the chosen
point inside the brief's allowed range.

| # | Role | Class | Family | Size / line | Weight | Tracking | Color | Where |
|---|---|---|---|---|---|---|---|---|
| 1 | Page title | `.ops-t-page` | Geist | **36 / 40** | 800 | −0.030 | `--ops-ink` | one per page, page header |
| 2 | Subtitle | `.ops-t-sub` | Inter Tight | **15 / 23** | 450 | −0.005 | `--ops-ink-secondary` | under title, max-width 700px |
| 3 | Section title, primary | `.ops-t-section` | Geist | **20 / 26** (19–22 ok) | 725 | −0.020 | `--ops-ink` | content panel header |
| 4 | Section title, secondary | `.ops-t-section-sm` | Geist | **17 / 22** (16–18 ok) | 675 | −0.015 | `--ops-ink` | rail panel header, sub-groups |
| 5 | Card label | `.ops-t-label` | Inter Tight | **11.5 / 16** | 600 | +0.080 | `--ops-ink-muted` | KPI label, zone labels — uppercase, ≤ 3 words |
| 6 | KPI value | `.ops-t-kpi` | Geist | **34 / 38** (30–38) | 800 | −0.030 | `--ops-ink` | KPI card value; tabular |
| 7 | KPI value, compact | `.ops-t-kpi-sm` | Geist | **28 / 32** | 775 | −0.025 | `--ops-ink` | rail stats, mobile KPI |
| 8 | Table / row primary | `.ops-t-row` | Inter Tight | **14.5 / 20** | 600 | −0.008 | `--ops-ink` | entity name, table cell primary |
| 9 | Table / row secondary | `.ops-t-row-sub` | Inter Tight | **12.5 / 18** | 450 | 0 | `--ops-ink-secondary` | second line of a row |
| 10 | Technical metadata | `.ops-t-meta` | Geist | **11.5 / 16** | 500 | +0.020 | `--ops-ink-muted` | IDs (`PRP-2026-014`), timestamps, hashes, counts — tabular |
| 11 | Body | `.ops-t-body` | Inter Tight | **14 / 22** | 400 | −0.005 | `--ops-ink-secondary` | paragraphs, help, empty-state copy |
| 12 | Button | `.ops-t-btn` | Inter Tight | **14 / 20** | 625 | −0.005 | inherits | all buttons; `.ops-btn-sm` uses 13/18 |
| 13 | Chip | `.ops-t-chip` | Inter Tight | **12 / 16** | 600 | +0.010 | per status | status/filter chips — sentence case, never uppercase |
| 14 | Money, inline | `.ops-t-money` | Geist | inherits size | 650 | −0.010 | `--ops-ink` | currency inside rows/panels; tabular + nowrap |
| 15 | Money, large | `.ops-t-money-lg` | Geist | **24 / 28** | 750 | −0.020 | `--ops-ink` | totals panel in editor |
| 16 | Nav item | `.ops-t-nav` | Inter Tight | **14 / 20** | 550 (active 650) | −0.005 | `--ops-ink-secondary` | sidebar |
| 17 | Overline / eyebrow | `.ops-t-eyebrow` | Inter Tight | **11 / 16** | 600 | +0.120 | `--ops-ink-muted` | `OPERATIONS`, `SECURE ACCESS`, group headers |
| 18 | Breadcrumb | `.ops-t-crumb` | Inter Tight | **13 / 18** | 500 | 0 | `--ops-ink-muted`; current `--ops-ink-secondary` | utility bar |

Uppercase is limited to roles 5 and 17. Nothing else transforms case.

---

## 2. CSS classes

```css
/* ---- display (Geist) ---- */
.ops-t-page       { font: 800 36px/40px var(--ops-font-display); letter-spacing: -0.03em; color: var(--ops-ink); text-wrap: balance; }
.ops-t-section    { font: 725 20px/26px var(--ops-font-display); letter-spacing: -0.02em; color: var(--ops-ink); }
.ops-t-section-sm { font: 675 17px/22px var(--ops-font-display); letter-spacing: -0.015em; color: var(--ops-ink); }
.ops-t-kpi        { font: 800 34px/38px var(--ops-font-display); letter-spacing: -0.03em; color: var(--ops-ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
.ops-t-kpi-sm     { font: 775 28px/32px var(--ops-font-display); letter-spacing: -0.025em; color: var(--ops-ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
.ops-t-meta       { font: 500 11.5px/16px var(--ops-font-display); letter-spacing: 0.02em; color: var(--ops-ink-muted); font-variant-numeric: tabular-nums; }
.ops-t-money      { font-family: var(--ops-font-display); font-weight: 650; letter-spacing: -0.01em; color: var(--ops-ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
.ops-t-money-lg   { font: 750 24px/28px var(--ops-font-display); letter-spacing: -0.02em; color: var(--ops-ink); font-variant-numeric: tabular-nums; white-space: nowrap; }

/* ---- text (Inter Tight) ---- */
.ops-t-sub        { font: 450 15px/23px var(--ops-font-text); letter-spacing: -0.005em; color: var(--ops-ink-secondary); max-width: 700px; text-wrap: pretty; }
.ops-t-label      { font: 600 11.5px/16px var(--ops-font-text); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ops-ink-muted); }
.ops-t-eyebrow    { font: 600 11px/16px var(--ops-font-text); letter-spacing: 0.12em; text-transform: uppercase; color: var(--ops-ink-muted); }
.ops-t-row        { font: 600 14.5px/20px var(--ops-font-text); letter-spacing: -0.008em; color: var(--ops-ink); }
.ops-t-row-sub    { font: 450 12.5px/18px var(--ops-font-text); color: var(--ops-ink-secondary); }
.ops-t-body       { font: 400 14px/22px var(--ops-font-text); letter-spacing: -0.005em; color: var(--ops-ink-secondary); max-width: 76ch; text-wrap: pretty; }
.ops-t-btn        { font: 625 14px/20px var(--ops-font-text); letter-spacing: -0.005em; }
.ops-t-chip       { font: 600 12px/16px var(--ops-font-text); letter-spacing: 0.01em; }
.ops-t-nav        { font: 550 14px/20px var(--ops-font-text); letter-spacing: -0.005em; }
.ops-t-crumb      { font: 500 13px/18px var(--ops-font-text); color: var(--ops-ink-muted); }

/* ---- shared ---- */
.ops-truncate     { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.ops-clamp-2      { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.ops-num          { font-variant-numeric: tabular-nums; }
.ops-nowrap       { white-space: nowrap; }

/* ---- responsive steps ---- */
@media (max-width: 1023px) {
  .ops-t-page { font-size: 30px; line-height: 34px; }
  .ops-t-kpi  { font-size: 30px; line-height: 34px; }
}
@media (max-width: 767px) {
  .ops-t-page { font-size: 26px; line-height: 30px; letter-spacing: -0.025em; }
  .ops-t-kpi  { font-size: 28px; line-height: 32px; }
  .ops-t-section { font-size: 18px; line-height: 24px; }
}
```

Base font-feature-settings inherited from `html` in globals.css (`kern liga calt cv11 ss03`)
stay on. Do not add `"zero" 1` — slashed zeros read as code, which is the look being retired.

---

## 3. Numeric rules

1. **Tabular everywhere numbers align.** KPI values, money, counts, dates in rows, table cells,
   chips with counts: `font-variant-numeric: tabular-nums`. Body prose may stay proportional.
2. **Currency never wraps.** Every money string gets `white-space: nowrap`. If it does not fit,
   the container ellipsizes the *name* next to it, never the number.
3. **Two currency formats, chosen by context:**
   - Summaries, KPIs, chips, pipeline stages: compact — `$57.5M`, `$1.2M`, `$840K`, `$9,900`
     (below $10K show the full figure). One decimal for M/B, none for K. Use
     `compactUsd` from `src/lib/proposals/money.ts`.
   - Rows, tables, totals, PDFs: full — `$57,500,000`. Use `usd` from `src/lib/estimates/admin.ts`
     (0 fraction digits).
   - Ranges: `$1.2M – $1.8M` — en dash (U+2013) with spaces; same format on both ends.
4. **Right-align numeric columns**; left-align text; center nothing.
5. **Percent**: 0 decimals in KPIs (`62%`), 1 decimal max in tables (`62.4%`).
6. **Dates**: rows `Sep 1, 2026` (`toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"})`);
   technical metadata `2026-09-01 14:32` (ISO-like, tabular); activity feeds relative `3h ago`,
   switching to the row format after 7 days. Always show the absolute date in a `title`.
7. **Negative numbers** use minus U+2212 (`−$12,400`), never a hyphen. Deltas get a sign:
   `+3`, `−2`.
8. **Zero and null differ**: `0` renders `0`; unknown renders an em dash `—` in `--ops-ink-muted`.
9. **IDs** (`PRP-2026-014`, public ids, invitation ids) use `.ops-t-meta` (Geist tabular +0.02em),
   never body text. They are copyable: wrap in a `<button>` with a copy icon 12px; the visible
   text stays as-is.
10. **Letter-spacing on digits** never exceeds +0.02em. Wide tracking on numbers is the mono
    look and is out.
11. **Large-figure animation** (count-up on KPI mount) is allowed once, 400ms, `--ops-ease`,
    and disabled under `prefers-reduced-motion`. No perpetual blinking (`.digit-blink` from
    globals.css is not used in ops).

---

## 4. Hierarchy examples

Page header:

```
Proposals                                   36/40 w800 Geist
Every proposal, bound to a client and a     15/23 w450 Inter Tight, ≤700px
project. Access is per person.
```

KPI card:

```
OPEN PIPELINE                                11.5/16 w600 +0.08em uppercase muted
$57.5M                                       34/38 w800 tabular
14 proposals · 6 in review                   12.5/18 w450 secondary
```

Entity row:

```
Cato Digital · Pod cluster A                 14.5/20 w600 ink   (name ellipsizes)
PRP-2026-014 · Jane Cole · viewed 3× · Sep 1 11.5/16 meta (id) + 12.5/18 row-sub
                                    $1.2M – $1.8M   money w650 tabular nowrap, right-aligned
```

---

## 5. Do / Don't

**Do**
- One `.ops-t-page` per page. Panel titles are `.ops-t-section`; nothing in a panel is larger.
- Keep KPI labels to ≤ 3 words (`OPEN PIPELINE`, `SIGNED`, `IN REVIEW`).
- Pair Geist for the number with Inter Tight for its context line; that contrast is the system.
- Use `text-wrap: balance` on titles, `pretty` on paragraphs.
- Truncate names with `.ops-truncate`; clamp descriptions with `.ops-clamp-2`.

**Don't**
- Don't use uppercase for chips, buttons, nav items or table headers (table headers are
  `.ops-t-label` — the one exception, because they are labels).
- Don't render status keys raw (`client_configuring` → `Configuring`); see OPS_STATUS_SYSTEM.
- Don't use `letter-spacing: 0.12em` on anything but the eyebrow role.
- Don't use font sizes off the table (10px, 13.5px, 0.95rem…). If a new role is needed, add it here first.
- Don't put gradient fills on text in ops. `.t-sweep-*` is a marketing-site device.
- Don't mix `rem` and `px` in ops type — the table is px; the shell is px.
