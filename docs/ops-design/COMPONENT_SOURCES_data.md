# Component sources — ops data patterns (2026-09-02)

Scout report for the PODOS operations platform: **entity rows (data-table hybrid)**, **status chip system**, **activity timeline grouped by day**, **empty + loading states**. 21st.dev was searched through the connected `21st-global` MCP (paid tier); ten candidates were retrieved as real source with `get_component` and read before choosing. Nothing is used verbatim — every pattern below is normalized into the ops tokens from the founder brief of 2026-09-02.

Proposed repository location: `src/components/ops/data/` (one CSS module, seven small files). Not yet installed — this document is the spec; the code compiled clean against the project `tsconfig` (see *Verification*).

## Decisions that apply to all four patterns

| Topic | Decision |
|---|---|
| Dependencies | **Zero new packages.** Every candidate ships `class-variance-authority` + Radix (avatar, dropdown-menu, checkbox, collapsible, scroll-area, separator) or Base UI. All of it was removed: variants are `data-*` attributes read by CSS, the only interactive piece (`RowMenu`) is ~40 lines of React on native buttons, everything else is a server component. `lucide-react` (installed) is the icon language. |
| Styling | CSS module `ops-data.module.css`. Tailwind utilities are dead outside `.invest` (unlayered reset in `globals.css`), so every demo class was rewritten as module classes; widths in the skeleton are inline `style` objects. |
| Tokens | The brief's `--ops-*` tokens are declared once on `.root` (put it on the ops canvas). `private.module.css` stays as the client-configurator system; the ops app moves to this module — do not mix `s.chip` (uppercase 0.68rem) and `StatusChip` on one page. |
| Type | Geist (`--font-display`) for display, KPI, numeric cells and day labels — with `font-variant-numeric: tabular-nums` (founder rule: no mono family). Inter Tight (`--font-body`) for everything else. |
| Motion | Hover lift −1px / press scale .985 / 180–240 ms; every animation is switched off under `prefers-reduced-motion` (live-dot pulse, menu pop, shimmer, row lift). |
| Rejected on principle | Row-reveal stagger animations (tailwind-admin 25161), marquee-of-ghost-rows empty state (19377), Aceternity scroll-beam timeline (857), tilted icon stack (19746 `EmptyMedia` icon variant), pulsing `animate-ping` without a reduced-motion guard (25395, 5157). |

Statuses: the twelve founder states map onto the `estimates.status` column through `toProposalStatus()` (`released → proposal_sent`, `client_configuring → configuring`, `signature_requested / client_signed → signature`, `countersigned / completed / won → signed`, `revoked / archived → expired`, `lost → declined`).

---

## Shared foundation — `ops-data.module.css`

Every class referenced by the four patterns lives here (tokens, buttons, tone table, chip, rows, menu, timeline, empty, skeleton, reduced-motion, breakpoints).

```css
// src/components/ops/data/ops-data.module.css
/*
 * ops-data.module.css — PODOS operations platform: data patterns
 * (entity rows, status chips, day-grouped activity timeline, empty + skeleton).
 * Tokens follow the founder brief of 2026-09-02. CSS module because the
 * unlayered reset in globals.css neutralises Tailwind spacing outside .invest.
 * Put `.root` on the ops page canvas once; every class below reads its tokens.
 */

.root {
  --ops-bg: #f4f7fc;
  --ops-bg-elevated: #f8fbff;
  --ops-surface: #ffffff;
  --ops-surface-soft: #f2f7ff;
  --ops-surface-selected: #eaf2ff;
  --ops-ink: #071126;
  --ops-ink-2: #35425b;
  --ops-ink-3: #7d8ba3;
  --ops-cobalt-deep: #1236c6;
  --ops-cobalt: #1b55f5;
  --ops-electric: #168dff;
  --ops-cyan: #27c3ea;
  --ops-live: #20c77a;
  --ops-warning: #eca43a;
  --ops-orange: #f07828;
  --ops-danger: #e25568;
  --ops-purple: #7759f6;
  --ops-violet: #5c4ce0;
  --ops-border: rgba(34, 82, 154, 0.12);
  --ops-border-strong: rgba(27, 85, 245, 0.28);
  --ops-shadow-sm: 0 6px 22px rgba(27, 57, 103, 0.06);
  --ops-shadow-md: 0 16px 42px rgba(22, 53, 103, 0.09);
  --ops-shadow-active: 0 18px 48px rgba(27, 85, 245, 0.15);
  --ops-gradient: linear-gradient(135deg, #1236c6 0%, #168dff 62%, #27c3ea 100%);
  --ops-r-sm: 12px;
  --ops-r-md: 16px;
  --ops-r-lg: 20px;
  --ops-r-xl: 24px;
  --ops-dur: 200ms;
  --ops-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ops-font-display: var(--font-display, var(--font-geist)), ui-sans-serif, system-ui, sans-serif;
  --ops-font-text: var(--font-body, var(--font-inter-tight)), ui-sans-serif, system-ui, sans-serif;
  font-family: var(--ops-font-text);
  color: var(--ops-ink);
  -webkit-font-smoothing: antialiased;
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* ============ buttons (one primary family, one secondary) ============ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border-radius: var(--ops-r-sm);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.005em;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    transform 180ms var(--ops-ease),
    box-shadow 240ms var(--ops-ease),
    border-color 180ms var(--ops-ease),
    background-color 180ms var(--ops-ease);
}
.btn:focus-visible { outline: 2px solid var(--ops-cobalt); outline-offset: 3px; }
.btnPrimary {
  border: 0;
  color: #fff;
  background: var(--ops-gradient);
  box-shadow: 0 10px 24px -12px rgba(27, 85, 245, 0.55);
}
.btnPrimary:hover { transform: translateY(-1px); box-shadow: var(--ops-shadow-active); }
.btnPrimary:active { transform: scale(0.985); }
.btnSecondary {
  background: var(--ops-surface);
  border: 1px solid var(--ops-border-strong);
  color: var(--ops-cobalt-deep);
}
.btnSecondary:hover { background: var(--ops-surface-soft); }
.btnSecondary:active { transform: scale(0.985); }

.iconBtn {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: var(--ops-r-sm);
  border: 1px solid transparent;
  background: transparent;
  color: var(--ops-ink-2);
  cursor: pointer;
  transition: background-color 180ms var(--ops-ease), border-color 180ms var(--ops-ease), color 180ms var(--ops-ease);
}
.iconBtn:hover,
.iconBtn[aria-expanded="true"] {
  background: var(--ops-surface-soft);
  border-color: var(--ops-border);
  color: var(--ops-cobalt-deep);
}
.iconBtn:focus-visible { outline: 2px solid var(--ops-cobalt); outline-offset: 2px; }

/* ============ status tones (shared by chips and timeline nodes) ============ */
.tone {
  --tone-fg: var(--ops-ink-2);
  --tone-bg: rgba(125, 139, 163, 0.14);
  --tone-dot: var(--ops-ink-3);
  --tone-border: transparent;
}
.tone[data-tone="invited"]            { --tone-fg: var(--ops-cobalt-deep); --tone-bg: rgba(27, 85, 245, 0.10);  --tone-dot: var(--ops-cobalt); }
.tone[data-tone="viewed"]             { --tone-fg: #0e63b5;                --tone-bg: rgba(22, 141, 255, 0.12); --tone-dot: var(--ops-electric); }
.tone[data-tone="configuring"]        { --tone-fg: #0b7c93;                --tone-bg: rgba(39, 195, 234, 0.14); --tone-dot: var(--ops-cyan); }
.tone[data-tone="submitted"]          { --tone-fg: #8a5a0b;                --tone-bg: rgba(236, 164, 58, 0.16); --tone-dot: var(--ops-warning); }
.tone[data-tone="engineering_review"] { --tone-fg: #9a4a0c;                --tone-bg: rgba(240, 120, 40, 0.14); --tone-dot: var(--ops-orange); }
.tone[data-tone="approved"]           { --tone-fg: #5a3ed6;                --tone-bg: rgba(119, 89, 246, 0.12); --tone-dot: var(--ops-purple); }
.tone[data-tone="proposal_sent"]      { --tone-fg: #ffffff;                --tone-bg: var(--ops-cobalt-deep);   --tone-dot: rgba(255, 255, 255, 0.9); }
.tone[data-tone="signature"]          { --tone-fg: #4a3fc4;                --tone-bg: rgba(92, 76, 224, 0.12);  --tone-dot: var(--ops-violet); }
.tone[data-tone="signed"]             { --tone-fg: #0f7a4a;                --tone-bg: rgba(32, 199, 122, 0.14); --tone-dot: var(--ops-live); }
.tone[data-tone="expired"]            { --tone-fg: var(--ops-ink-3);       --tone-bg: transparent;              --tone-dot: #b7c0cf; --tone-border: rgba(125, 139, 163, 0.5); }
.tone[data-tone="declined"]           { --tone-fg: #b4293c;                --tone-bg: rgba(226, 85, 104, 0.12); --tone-dot: var(--ops-danger); }

/* ============ status chip ============ */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 26px;
  padding: 0 10px 0 8px;
  border-radius: 999px;
  background: var(--tone-bg);
  color: var(--tone-fg);
  border: 1px solid var(--tone-border);
  font-family: var(--ops-font-text);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1;
  white-space: nowrap;
}
.chip[data-tone="expired"] { border-style: dashed; }
.chip[data-size="sm"] { height: 22px; font-size: 11px; padding: 0 8px 0 7px; gap: 6px; }
.chipDot {
  position: relative;
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--tone-dot);
}
.chip[data-live] .chipDot::after {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1.5px solid var(--tone-dot);
  opacity: 0;
  animation: opsPing 1.8s var(--ops-ease) infinite;
}
@keyframes opsPing {
  0% { transform: scale(0.6); opacity: 0.7; }
  80%, 100% { transform: scale(1.6); opacity: 0; }
}

/* ============ entity rows (identity · status · value · engagement · actions) ============ */
.list { display: grid; gap: 0; }
.listHead,
.row {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(150px, 1fr) minmax(150px, 0.9fr) minmax(170px, 1.1fr) auto;
  column-gap: 20px;
  align-items: center;
}
.listHead {
  padding: 0 23px 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ops-ink-3);
}
.rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}
.row {
  position: relative;
  min-height: 116px;
  padding: 22px;
  background: var(--ops-surface);
  border: 1px solid var(--ops-border);
  border-radius: var(--ops-r-md);
  box-shadow: var(--ops-shadow-sm);
  transition:
    box-shadow var(--ops-dur) var(--ops-ease),
    border-color var(--ops-dur) var(--ops-ease),
    transform var(--ops-dur) var(--ops-ease),
    background-color var(--ops-dur) var(--ops-ease);
}
.row:hover,
.row:has(:focus-visible) {
  border-color: var(--ops-border-strong);
  box-shadow: var(--ops-shadow-md);
  transform: translateY(-1px);
}
.row[data-selected="true"] {
  border-color: var(--ops-border-strong);
  background: linear-gradient(180deg, var(--ops-surface-selected), var(--ops-surface) 72%);
  box-shadow: var(--ops-shadow-active);
}

.cellIdentity {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  min-width: 0;
}
.mark {
  width: 44px;
  height: 44px;
  border-radius: var(--ops-r-sm);
  display: grid;
  place-items: center;
  background: var(--ops-surface-soft);
  border: 1px solid var(--ops-border);
  color: var(--ops-cobalt-deep);
  font-family: var(--ops-font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
}
.row[data-selected="true"] .mark { background: var(--ops-gradient); border-color: transparent; color: #fff; }
.identityText { min-width: 0; }
.name {
  display: inline-block;
  max-width: 100%;
  font-size: 15px;
  font-weight: 650;
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--ops-ink);
  text-decoration: none;
  overflow-wrap: anywhere;
  border-radius: 4px;
}
.name:hover { color: var(--ops-cobalt-deep); }
.name:focus-visible { outline: 2px solid var(--ops-cobalt); outline-offset: 3px; }
.meta {
  margin: 3px 0 0;
  font-size: 12.5px;
  line-height: 1.4;
  color: var(--ops-ink-3);
  font-variant-numeric: tabular-nums;
}

.cell { min-width: 0; display: grid; gap: 4px; align-content: center; justify-items: start; }
/* sr-only on desktop (the visual header row is aria-hidden), visible under 1100px */
.cellLabel {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
.primary { font-size: 14.5px; font-weight: 600; color: var(--ops-ink); }
.numeric {
  font-family: var(--ops-font-display);
  font-variant-numeric: tabular-nums;
  font-size: 15px;
  font-weight: 650;
  letter-spacing: -0.01em;
  white-space: nowrap;
  color: var(--ops-ink);
}
.sub { font-size: 12px; color: var(--ops-ink-3); font-variant-numeric: tabular-nums; }
.cellActions { display: flex; gap: 8px; align-items: center; justify-content: flex-end; }
.rowDetail {
  grid-column: 1 / -1;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--ops-border);
}

/* disclosure: "Secure access · 2 invitations · 1 verified" → expands to a panel */
.disclosure summary {
  list-style: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ops-cobalt-deep);
  border-radius: 6px;
}
.disclosure summary::-webkit-details-marker { display: none; }
.disclosure summary:focus-visible { outline: 2px solid var(--ops-cobalt); outline-offset: 3px; }
.disclosurePanel {
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: var(--ops-r-sm);
  background: var(--ops-surface-soft);
  border: 1px solid var(--ops-border);
}

/* row actions menu */
.menuWrap { position: relative; }
.menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  z-index: 30;
  min-width: 200px;
  padding: 6px;
  display: grid;
  gap: 2px;
  background: var(--ops-surface);
  border: 1px solid var(--ops-border);
  border-radius: 14px;
  box-shadow: var(--ops-shadow-md);
  animation: opsPop 160ms var(--ops-ease);
}
@keyframes opsPop {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: none; }
}
.menuItem {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 0;
  border-radius: 10px;
  background: none;
  font: inherit;
  font-size: 14px;
  font-weight: 550;
  color: var(--ops-ink);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}
.menuItem:hover { background: var(--ops-surface-soft); color: var(--ops-cobalt-deep); }
.menuItem:focus-visible { outline: 2px solid var(--ops-cobalt); outline-offset: -2px; background: var(--ops-surface-soft); }
.menuItem[data-danger="true"] { color: var(--ops-danger); }
.menuItem[data-danger="true"]:hover { background: rgba(226, 85, 104, 0.08); color: #b4293c; }
.menu form { display: contents; }

/* ============ activity timeline grouped by day ============ */
.timeline { --tl-bg: var(--ops-surface); display: grid; gap: 22px; }
.day { min-width: 0; }
.dayLabel {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0 0 12px;
  padding: 6px 0;
  background: linear-gradient(var(--tl-bg) 78%, transparent);
  font-family: var(--ops-font-display);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ops-ink-2);
}
.dayLabel time {
  font-family: var(--ops-font-text);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  color: var(--ops-ink-3);
  font-variant-numeric: tabular-nums;
}
.events {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}
.events::before {
  content: "";
  position: absolute;
  left: 15px;
  top: 18px;
  bottom: 18px;
  width: 2px;
  border-radius: 2px;
  background: linear-gradient(var(--ops-border-strong), var(--ops-border));
}
.event {
  position: relative;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}
.node {
  position: relative;
  z-index: 1;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--tone-bg);
  color: var(--tone-fg);
  border: 2px solid var(--tl-bg);
  box-shadow: 0 0 0 1px var(--ops-border);
}
.node[data-tone="expired"] { background: var(--ops-surface-soft); }
.eventBody { min-width: 0; padding-top: 6px; }
.eventTitle { margin: 0; font-size: 14px; font-weight: 550; line-height: 1.4; color: var(--ops-ink); }
.eventTitle a { color: inherit; text-decoration: none; border-radius: 4px; }
.eventTitle a:hover { color: var(--ops-cobalt-deep); text-decoration: underline; text-underline-offset: 3px; }
.eventTitle a:focus-visible { outline: 2px solid var(--ops-cobalt); outline-offset: 3px; }
.eventMeta { margin: 2px 0 0; font-size: 12px; color: var(--ops-ink-3); font-variant-numeric: tabular-nums; }
.eventNote {
  margin: 8px 0 0;
  padding: 10px 12px;
  border-radius: var(--ops-r-sm);
  background: var(--ops-surface-soft);
  border: 1px solid var(--ops-border);
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--ops-ink-2);
}
.event[data-kind="note"] .eventTitle { font-weight: 600; }

/* ============ empty state ============ */
.empty {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 8px;
  padding: 48px 24px;
  background: var(--ops-surface);
  border: 1px dashed var(--ops-border-strong);
  border-radius: var(--ops-r-lg);
}
.emptyCompact { padding: 28px 20px; }
.emptyMedia {
  width: 72px;
  height: 72px;
  margin-bottom: 8px;
  display: grid;
  place-items: center;
  border-radius: var(--ops-r-lg);
  color: var(--ops-cobalt-deep);
  background:
    radial-gradient(circle at 70% 20%, rgba(22, 141, 255, 0.18), transparent 60%),
    linear-gradient(rgba(27, 85, 245, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(27, 85, 245, 0.08) 1px, transparent 1px),
    var(--ops-surface-soft);
  background-size: auto, 12px 12px, 12px 12px, auto;
  border: 1px solid var(--ops-border);
  box-shadow: var(--ops-shadow-sm);
}
.emptyTitle {
  margin: 0;
  font-family: var(--ops-font-display);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ops-ink);
}
.emptyText { margin: 0; max-width: 46ch; font-size: 14.5px; line-height: 1.55; color: var(--ops-ink-2); }
.emptyText a { color: var(--ops-cobalt-deep); text-decoration: underline; text-underline-offset: 3px; }
.emptyActions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 12px; }

/* ============ skeleton ============ */
.bone {
  display: block;
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(27, 57, 103, 0.06) 0%, rgba(27, 57, 103, 0.11) 50%, rgba(27, 57, 103, 0.06) 100%);
  background-size: 200% 100%;
  animation: opsShimmer 1.4s linear infinite;
}
.bonePill { height: 24px; border-radius: 999px; }
.stack { display: grid; gap: 8px; }
.rowSkeleton { pointer-events: none; }
.rowSkeleton:hover { transform: none; box-shadow: var(--ops-shadow-sm); border-color: var(--ops-border); }
@keyframes opsShimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* ============ motion: respect the user ============ */
@media (prefers-reduced-motion: reduce) {
  .btn, .iconBtn, .row { transition: none; }
  .btnPrimary:hover, .row:hover, .row:has(:focus-visible) { transform: none; }
  .chip[data-live] .chipDot::after { animation: none; opacity: 0.35; }
  .menu { animation: none; }
  .bone { animation: none; background-position: 50% 0; }
}

/* ============ responsive ============ */
@media (max-width: 1100px) {
  .listHead { display: none; }
  .row {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      "identity actions"
      "status value"
      "engagement engagement"
      "detail detail";
    row-gap: 16px;
    column-gap: 16px;
  }
  .cellIdentity { grid-area: identity; }
  .cellStatus { grid-area: status; }
  .cellValue { grid-area: value; }
  .cellEngagement { grid-area: engagement; }
  .cellActions { grid-area: actions; align-self: start; }
  .rowDetail { grid-area: detail; margin-top: 0; }
  .cellLabel {
    position: static;
    width: auto;
    height: auto;
    margin: 0;
    clip: auto;
    overflow: visible;
    white-space: normal;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ops-ink-3);
  }
}
@media (max-width: 720px) {
  .row {
    padding: 18px;
    grid-template-columns: 1fr;
    grid-template-areas:
      "identity"
      "status"
      "value"
      "engagement"
      "detail"
      "actions";
  }
  .cellActions { justify-content: stretch; }
  .cellActions .btn { flex: 1 1 auto; }
  .menu { right: auto; left: 0; }
  .event { grid-template-columns: 28px minmax(0, 1fr); gap: 12px; }
  .node { width: 28px; height: 28px; }
  .events::before { left: 13px; }
  .empty { padding: 36px 18px; }
}
```

---

## 1 · Entity row — identity · status · value · engagement · actions

**Job:** one row per proposal (or client / project) that reads as a record at a glance, links to the detail page, and carries its own actions — 116–148 px tall, reflowing into a card on tablet/phone without losing column meaning.

**Search terms:** `data table rows with avatar identity, status badge, amount column and row actions menu` → 10 results, 2 fetched.

| Candidate (21st demo id) | What it offers | Deps | Semantics / keyboard | Responsive | Verdict |
|---|---|---|---|---|---|
| shadcnstore **Users List Datatable** (25159) — fetched | Identity cell (avatar + name + sub-line), status badges, per-row Radix dropdown menu, toolbar + pagination | 9 Radix packages + cva | `<table>`; Radix menu gives `role=menu`, roving focus, Esc | horizontal scroll only | **Pattern reference** for identity cell and the actions-menu contract; too heavy to install |
| bundui **Payments Table** (25160) — fetched | Minimal table: avatar, product, price, badge, date | radix-avatar + cva | plain `<table>`, no actions | scroll only | Too thin — no engagement, no actions |
| felipemenezes098 **Card Table** (22174) — metadata only | Table inside a card with totals footer | shadcn table | — | — | Same primitive as above; not fetched |

**Recommendation: focused custom build on a grid-row `<ul>`, borrowing 25159's identity cell and menu contract.** A `<table>` cannot deliver multi-line 116 px rows that reflow into stacked cards without `display:block` hacks that break table semantics anyway; a list with labelled cells does.

Kept from 25159: 44 px identity tile + name + meta line; status as a chip in its own column; trailing actions column; `aria-haspopup="menu"` / `aria-expanded` / `role="menuitem"` contract. Changed: `<table>` → `<ul>` of grid rows; Radix DropdownMenu → `RowMenu` (native buttons, items are links or server actions); checkbox/bulk-select column dropped (no bulk ops in the brief); avatar image → initials/short-code tile (no client photos exist); `text-muted-foreground` / `bg-muted` → ops ink and surface tokens; hover `bg-muted/30` → border-strong + shadow-md + −1 px lift; added `data-selected` featured state (blue atmospheric fill, gradient tile, active shadow); added full-width `rowDetail` slot for the secure-access disclosure.

```tsx
// src/components/ops/data/EntityRow.tsx
import Link from "next/link";
import type { ReactNode } from "react";
import s from "./ops-data.module.css";

/**
 * EntityList + EntityRow — the identity · status · value · engagement · actions
 * hybrid. Server components. A grid-row list (not <table>) because rows are
 * 116–148px, multi-line, and reflow into stacked cards under 1100px.
 * Identity cell and row-action contract taken from shadcnstore `Users List
 * Datatable` (21st demo 25159); everything else is PODOS.
 */

export type EntityColumns = readonly [identity: string, status: string, value: string, engagement: string];

export function EntityList({
  columns,
  label,
  children,
}: {
  columns: EntityColumns;
  /** Accessible name of the list, e.g. "Proposals". */
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={s.list}>
      <div className={s.listHead} aria-hidden="true">
        {columns.map((c) => (
          <span key={c}>{c}</span>
        ))}
        <span />
      </div>
      <ul className={s.rows} aria-label={label}>
        {children}
      </ul>
    </div>
  );
}

export type EntityRowProps = {
  href: string;
  /** Two–four characters for the identity tile: initials or a short code. */
  mark: string;
  name: string;
  /** "PRP-0142 · Cato Digital Deck" */
  meta?: ReactNode;
  /** Usually <StatusChip/>. */
  status: ReactNode;
  statusSub?: ReactNode;
  /** Already formatted, e.g. usd(low) – usd(high). Never wraps. */
  value: ReactNode;
  valueSub?: ReactNode;
  engagement: ReactNode;
  engagementSub?: ReactNode;
  columns: EntityColumns;
  /** <RowMenu/>, <ConfirmDelete/> … rendered after the Open button. */
  actions?: ReactNode;
  openLabel?: string;
  selected?: boolean;
  /** Full-width detail strip under the cells (secure-access summary, notes). */
  children?: ReactNode;
};

export function EntityRow(p: EntityRowProps) {
  const [, statusLabel, valueLabel, engagementLabel] = p.columns;
  return (
    <li className={s.row} data-selected={p.selected || undefined}>
      <div className={s.cellIdentity}>
        <span className={s.mark} aria-hidden="true">
          {p.mark}
        </span>
        <div className={s.identityText}>
          <Link href={p.href} className={s.name}>
            {p.name}
          </Link>
          {p.meta ? <p className={s.meta}>{p.meta}</p> : null}
        </div>
      </div>

      <div className={`${s.cell} ${s.cellStatus}`}>
        <span className={s.cellLabel}>{statusLabel}</span>
        <div>{p.status}</div>
        {p.statusSub ? <span className={s.sub}>{p.statusSub}</span> : null}
      </div>

      <div className={`${s.cell} ${s.cellValue}`}>
        <span className={s.cellLabel}>{valueLabel}</span>
        <span className={s.numeric}>{p.value}</span>
        {p.valueSub ? <span className={s.sub}>{p.valueSub}</span> : null}
      </div>

      <div className={`${s.cell} ${s.cellEngagement}`}>
        <span className={s.cellLabel}>{engagementLabel}</span>
        <span className={s.primary}>{p.engagement}</span>
        {p.engagementSub ? <span className={s.sub}>{p.engagementSub}</span> : null}
      </div>

      <div className={s.cellActions}>
        <Link href={p.href} className={`${s.btn} ${s.btnSecondary}`}>
          {p.openLabel ?? "Open"}
          <span className={s.srOnly}> {p.name}</span>
        </Link>
        {p.actions}
      </div>

      {p.children ? <div className={s.rowDetail}>{p.children}</div> : null}
    </li>
  );
}
```

```tsx
// src/components/ops/data/RowMenu.tsx
"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { Ellipsis } from "lucide-react";
import s from "./ops-data.module.css";

/**
 * RowMenu — the only client component in this set. Replaces the Radix
 * DropdownMenu used by 21st demo 25159 with ~40 lines: aria-haspopup/expanded,
 * role=menu/menuitem, Esc closes and restores focus, arrow keys rove, blur-out
 * closes. Items are links or server actions (both serialisable from a server
 * component parent).
 * ponytail: no portal — the menu is absolutely positioned inside the row, so a
 * row inside an overflow:hidden ancestor would clip it; add a portal only if
 * that layout ever appears.
 */
export type RowMenuItem = {
  label: string;
  href?: string;
  action?: (formData: FormData) => void | Promise<void>;
  danger?: boolean;
};

export function RowMenu({ label, items }: { label: string; items: RowMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <div
      ref={root}
      className={s.menuWrap}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          trigger.current?.focus();
          return;
        }
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        const els = Array.from(root.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
        if (els.length === 0) return;
        e.preventDefault();
        const cur = els.indexOf(document.activeElement as HTMLElement);
        const next = e.key === "ArrowDown" ? (cur + 1) % els.length : cur <= 0 ? els.length - 1 : cur - 1;
        els[next].focus();
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={s.iconBtn}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <Ellipsis size={18} aria-hidden="true" />
      </button>

      {open ? (
        <div id={id} role="menu" aria-label={label} className={s.menu}>
          {items.map((it, i) =>
            it.href ? (
              <Link
                key={it.label}
                role="menuitem"
                href={it.href}
                className={s.menuItem}
                data-danger={it.danger || undefined}
                autoFocus={i === 0}
                onClick={() => setOpen(false)}
              >
                {it.label}
              </Link>
            ) : (
              <form key={it.label} action={it.action}>
                <button
                  type="submit"
                  role="menuitem"
                  className={s.menuItem}
                  data-danger={it.danger || undefined}
                  autoFocus={i === 0}
                >
                  {it.label}
                </button>
              </form>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
```

**Accessibility.** The list is `<ul aria-label>`; the visual column header is `aria-hidden` and each cell carries an sr-only label that becomes visible under 1100 px, so screen readers hear "Status: Viewed" in both layouts. The name is the row link; "Open" repeats it with an sr-only suffix (`Open Cato Digital Deck`) so link text is unique. No whole-row click target (nested interactive content). `RowMenu`: trigger announces menu + state; first item auto-focuses; ↑/↓ wrap; Esc closes and returns focus; blur outside closes. Menu items that mutate are `<form action>` submits, so they work as real POSTs. Contrast: all chip text ≥ 4.5:1 on its tint (viewed uses `#0e63b5`, not the raw electric blue). Focus rings: 2 px cobalt, 3 px offset.

**Responsive.** ≥1101 px: five columns `2.2fr · 1fr · .9fr · 1.1fr · auto`, 20 px column gap, 22 px padding. 721–1100 px: header hidden, cells become a 2-column card (`identity | actions`, `status | value`, `engagement`, `detail`) with visible small-caps labels. ≤720 px: single column, "Open" stretches full width, menu opens to the left edge, padding 18 px. Currency never wraps (`white-space: nowrap; tabular-nums`); long names wrap with `overflow-wrap: anywhere`.

---

## 2 · Status chip system

**Job:** one chip shape that encodes the twelve proposal states by tone, is legible at 11–12 px, and signals "client is live right now" without motion for people who opted out.

**Search terms:** `status badge chip variants with dot indicator` → 10 results, 2 fetched.

| Candidate | What it offers | Deps | Semantics | Verdict |
|---|---|---|---|---|
| diceui **Status** (25395) — fetched | Pill with `StatusIndicator` dot (animate-ping halo) + `StatusLabel`; variant on `data-variant` | none (Radix `Slot` optional) | inert `div`s — fine for a label | **Selected structure** |
| coss.com **Badge** (11356) — fetched | 8 semantic variants, 3 sizes, polymorphic `render`, coarse-pointer hit area | `@base-ui/react` | good | Rejected — pulls in Base UI for a span |
| edwinvakayil **Status Dot** (24882) — metadata only | Rippling dot with deployment presets | ? | — | Overlaps diceui; not fetched |

Kept from 25395: dot + label composition, tone as a data attribute, `w-fit shrink-0 whitespace-nowrap` behaviour. Changed: five generic variants → twelve named proposal tones in one `.tone[data-tone]` table shared with the timeline nodes; `before:animate-ping` halo → a single `::after` ring on **live states only** (viewed, configuring), frozen at 35 % opacity under reduced motion; `div` → `span` (inline in a table cell); `proposal_sent` is the only filled chip (deep cobalt, white text) to mark the outbound milestone; `expired` is dashed/transparent; sentence case 12 px/600 (the founder's "limited uppercase" — headers carry the caps, chips carry the words).

```ts
// src/components/ops/data/status.ts
/** The twelve founder-approved proposal states (brief 2026-09-02). */
export type ProposalStatus =
  | "draft"
  | "invited"
  | "viewed"
  | "configuring"
  | "submitted"
  | "engineering_review"
  | "approved"
  | "proposal_sent"
  | "signature"
  | "signed"
  | "expired"
  | "declined";

export const STATUS_LABEL: Record<ProposalStatus, string> = {
  draft: "Draft",
  invited: "Invited",
  viewed: "Viewed",
  configuring: "Configuring",
  submitted: "Submitted",
  engineering_review: "Engineering review",
  approved: "Approved",
  proposal_sent: "Proposal sent",
  signature: "Signature",
  signed: "Signed",
  expired: "Expired",
  declined: "Declined",
};

/** The client is in the product right now — the chip dot pulses (unless reduced motion). */
export const LIVE_STATUSES: ReadonlySet<ProposalStatus> = new Set<ProposalStatus>(["viewed", "configuring"]);

/** estimates.status raw values → chip state. Unknown values fall back to draft. */
const RAW: Record<string, ProposalStatus> = {
  draft: "draft",
  invited: "invited",
  sent: "invited",
  viewed: "viewed",
  client_configuring: "configuring",
  client_submitted: "submitted",
  engineering_review: "engineering_review",
  approved: "approved",
  released: "proposal_sent",
  signature_requested: "signature",
  client_signed: "signature",
  signed: "signed",
  countersigned: "signed",
  completed: "signed",
  won: "signed",
  expired: "expired",
  archived: "expired",
  revoked: "expired",
  declined: "declined",
  lost: "declined",
};

export function toProposalStatus(
  raw: string,
  flags: { revoked?: boolean; signedAt?: string | null } = {},
): ProposalStatus {
  if (flags.revoked) return "expired";
  if (flags.signedAt) return "signed";
  return RAW[raw] ?? "draft";
}
```

```tsx
// src/components/ops/data/StatusChip.tsx
import { LIVE_STATUSES, STATUS_LABEL, type ProposalStatus } from "./status";
import s from "./ops-data.module.css";

/**
 * StatusChip — server component. Twelve tones, one shape.
 * Structure ported from diceui `Status` (21st demo 25395): indicator dot + label,
 * variant on a data attribute. Palette, type and the pulse rule are PODOS.
 */
export function StatusChip({
  status,
  size = "md",
  className,
}: {
  status: ProposalStatus;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={[s.tone, s.chip, className].filter(Boolean).join(" ")}
      data-tone={status}
      data-size={size}
      data-live={LIVE_STATUSES.has(status) || undefined}
    >
      <i className={s.chipDot} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}
```

**Accessibility.** The chip is text — no `role`, no `title`, the label is the meaning. The dot is `aria-hidden`. Tones are never the only signal (every tone has a distinct word). Text/tint pairs checked for ≥ 4.5:1 (darkened text for viewed, configuring, submitted, engineering review, approved, signature, signed, declined). The live pulse is decorative; nothing is conveyed only by it.

**Responsive.** Fixed height 26 px (`sm` 22 px) with `white-space: nowrap`; in the entity row it sits in the status cell at every breakpoint; in dense tables use `size="sm"`.

---

## 3 · Activity timeline grouped by day

**Job:** the audit trail of a proposal (or the whole platform) as a newest-first vertical timeline, grouped under sticky day labels ("Today", "Yesterday", "Thu, Aug 20"), distinguishing system events from human notes.

**Search terms:** `activity feed timeline grouped by date with icons and timestamps` → 10 results, 3 fetched. None groups by day; grouping is custom.

| Candidate | What it offers | Deps | Semantics / motion | Verdict |
|---|---|---|---|---|
| preetsuthar17 **Timeline** (5157) — fetched | Status-toned node + connector, timestamp positions, custom content slot | radix scroll-area + cva | `<h3>` per item (heading soup), `<time>` used, `animate-pulse` without reduced-motion guard | **Selected node/connector model** |
| felipemenezes098 **Activity Feed** (19073) — fetched | Two densities: comment (avatar, name, text) vs system event (icon chip, one line) | radix-avatar + cva | plain `div`s, no list semantics | Borrowed the two-density idea |
| cnippet **Incident Status Timeline** (24943) — fetched | Badge + time + message per event, collapsible card | radix collapsible + separator | index keys, time as plain text | Borrowed nothing beyond confirming tone-per-event |

Kept from 5157: circular node with tone colour on the connector axis, connector line spanning the list, `<time>` for timestamps, description slot. Changed: flat list → `<section aria-labelledby>` per day with a sticky `<h3>` day label and an `<ol>` of events (real chronology semantics); per-item `<h3>` → `<p>`; five generic statuses → the shared twelve-tone table; `animate-pulse` removed; lucide icon per event type (routing rule: never hand-drawn); horizontal orientation and ScrollArea dropped; notes render in a soft panel (from 19073's comment density).

```ts
// src/components/ops/data/timeline-group.ts
/** Pure day-grouping for the activity timeline. Newest day and newest event first. */
export type DayGroup<T extends { at: string }> = {
  /** ISO calendar date in the given time zone, e.g. "2026-09-02" — used as key and <time dateTime>. */
  key: string;
  /** "Today" | "Yesterday" | "Thu, Aug 20" */
  label: string;
  /** Always the calendar date, e.g. "Wed, Sep 2" (shown beside relative labels). */
  date: string;
  relative: boolean;
  events: T[];
};

export function groupByDay<T extends { at: string }>(
  events: readonly T[],
  timeZone: string,
  now: Date = new Date(),
): DayGroup<T>[] {
  const keyFmt = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
  const dateFmt = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", month: "short", day: "numeric" });
  const today = keyFmt.format(now);
  // ponytail: "yesterday" = now − 24h; off by one hour on DST-change days, which only
  // matters if an event lands in that exact hour. Use a calendar library if it ever does.
  const yesterday = keyFmt.format(new Date(now.getTime() - 86_400_000));

  const groups = new Map<string, DayGroup<T>>();
  for (const e of [...events].sort((a, b) => Date.parse(b.at) - Date.parse(a.at))) {
    const d = new Date(e.at);
    const key = keyFmt.format(d);
    let g = groups.get(key);
    if (!g) {
      const relative = key === today || key === yesterday;
      g = {
        key,
        relative,
        label: key === today ? "Today" : key === yesterday ? "Yesterday" : dateFmt.format(d),
        date: dateFmt.format(d),
        events: [],
      };
      groups.set(key, g);
    }
    g.events.push(e);
  }
  return [...groups.values()];
}

export function timeFormatter(timeZone: string): (iso: string) => string {
  const f = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" });
  return (iso) => f.format(new Date(iso));
}
```

```tsx
// src/components/ops/data/ActivityTimeline.tsx
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BadgeCheck,
  CircleX,
  Clock,
  Eye,
  FileText,
  Inbox,
  MessageSquare,
  PenLine,
  Send,
  SlidersHorizontal,
} from "lucide-react";
import type { ProposalStatus } from "./status";
import { groupByDay, timeFormatter } from "./timeline-group";
import s from "./ops-data.module.css";

/**
 * ActivityTimeline — server component. Events grouped by calendar day (in the
 * ops time zone), each day a <section> with a sticky label and an <ol>.
 * Node + connector model from preetsuthar17 `Timeline` (21st demo 5157); the
 * two densities (system event vs. human note) from felipemenezes098 `Activity
 * Feed` (19073). Day grouping, tones, icons and type are PODOS.
 */
export type ActivityType =
  | "invited"
  | "viewed"
  | "configured"
  | "submitted"
  | "approved"
  | "sent"
  | "signed"
  | "declined"
  | "expired"
  | "note";

export type ActivityEvent = {
  id: string;
  /** ISO 8601 with offset or Z. */
  at: string;
  type: ActivityType;
  /** "Ada Lovelace viewed the proposal" */
  title: ReactNode;
  /** "PRP-0142 · Cato Digital" */
  meta?: ReactNode;
  /** Free text for notes / client comments. */
  note?: ReactNode;
  href?: string;
};

const ICON: Record<ActivityType, typeof Eye> = {
  invited: Send,
  viewed: Eye,
  configured: SlidersHorizontal,
  submitted: Inbox,
  approved: BadgeCheck,
  sent: FileText,
  signed: PenLine,
  declined: CircleX,
  expired: Clock,
  note: MessageSquare,
};

const TONE: Record<ActivityType, ProposalStatus> = {
  invited: "invited",
  viewed: "viewed",
  configured: "configuring",
  submitted: "submitted",
  approved: "approved",
  sent: "proposal_sent",
  signed: "signed",
  declined: "declined",
  expired: "expired",
  note: "draft",
};

export function ActivityTimeline({
  events,
  timeZone = "America/New_York",
  now,
  fallback = null,
}: {
  events: readonly ActivityEvent[];
  timeZone?: string;
  /** Inject for deterministic tests; defaults to request time. */
  now?: Date;
  /** Rendered when there are no events (usually <EmptyState compact/>). */
  fallback?: ReactNode;
}) {
  const groups = groupByDay(events, timeZone, now);
  if (groups.length === 0) return <>{fallback}</>;
  const time = timeFormatter(timeZone);

  return (
    <div className={s.timeline}>
      {groups.map((g) => (
        <section key={g.key} className={s.day} aria-labelledby={`day-${g.key}`}>
          <h3 id={`day-${g.key}`} className={s.dayLabel}>
            <span>{g.label}</span>
            {g.relative ? <time dateTime={g.key}>{g.date}</time> : null}
          </h3>
          <ol className={s.events}>
            {g.events.map((e) => {
              const Icon = ICON[e.type];
              return (
                <li key={e.id} className={s.event} data-kind={e.type === "note" ? "note" : "event"}>
                  <span className={`${s.tone} ${s.node}`} data-tone={TONE[e.type]} aria-hidden="true">
                    <Icon size={14} strokeWidth={1.75} />
                  </span>
                  <div className={s.eventBody}>
                    <p className={s.eventTitle}>{e.href ? <Link href={e.href}>{e.title}</Link> : e.title}</p>
                    <p className={s.eventMeta}>
                      <time dateTime={e.at}>{time(e.at)}</time>
                      {e.meta ? <> · {e.meta}</> : null}
                    </p>
                    {e.note ? <p className={s.eventNote}>{e.note}</p> : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
```

**Accessibility.** One landmark per day (`section` + heading), events in an ordered list, every timestamp a `<time dateTime>` with the ISO value. Node icons are `aria-hidden` — the title sentence carries the meaning ("Ada Lovelace viewed the proposal"). Sticky day labels never cover focused items (top offset 0 inside the panel; add `scroll-margin-top` if the panel scrolls). Server-rendered dates use one explicit `timeZone`, so there is no hydration mismatch and the ops team reads one clock.

**Responsive.** Column `32px · 1fr` (28 px nodes under 720 px); text wraps under the node axis; day labels stay sticky in a scrolling panel. Timeline inherits `--tl-bg` from the panel surface so the sticky label fades correctly on white and on the page ground (`--tl-bg: var(--ops-bg)` when placed directly on the canvas).

---

## 4 · Empty and loading (skeleton) states

**Job:** (a) a list or panel with nothing in it tells the operator what would appear here and offers the one next action — without an inline creation form (brief: right-side wizard drawer); (b) while data streams, the list keeps its exact shape so nothing jumps.

**Search terms:** `empty state placeholder with icon, title, description and action; skeleton loading rows` and `empty state no results with illustration icon, heading, helper text and primary action button` → 18 results, 3 fetched.

| Candidate | What it offers | Deps | Semantics / motion | Verdict |
|---|---|---|---|---|
| cnippet **Empty** (19746) — fetched | Composable `Empty / Header / Media / Title / Description / Content`; stacked tilted icon variant | cva | title is a `div`, no heading | **Selected slot structure**; heading fixed, stack dropped |
| shadcnui-blocks **Empty State with Marquee** (19377) — fetched | Vertically scrolling ghost rows behind the copy | marquee util | continuous motion, no reduced-motion guard | Rejected — decorative motion, second design language |
| cnippet **Data Table Skeleton** (19002) — fetched | Header + avatar rows + pill + pagination shimmer mirroring a table | none | no `aria-busy`, `animate-pulse` | **Selected for skeleton structure**; a11y + motion added |

Kept: slot structure and centred, text-balanced layout (19746); row-mirroring skeleton with a pill placeholder in the status column (19002). Changed: `div` title → real `h2`/`h3`; media tile carries the PODOS blueprint grid + upper-right glow instead of a tilted icon stack; dashed cobalt border marks the empty slot; actions are a slot so the page can mount a client wizard-drawer trigger; skeleton mirrors `EntityRow`'s exact grid (zero layout shift on swap), gets `aria-busy` + a spoken label, and the shimmer freezes under reduced motion.

```tsx
// src/components/ops/data/EmptyState.tsx
import type { ReactNode } from "react";
import s from "./ops-data.module.css";

/**
 * EmptyState — server component. Slot structure from cnippet `Empty` (21st demo
 * 19746): media / title / description / content. Fixed: the title is a real
 * heading; the media tile carries the PODOS blueprint grid instead of a tilted
 * icon stack; actions are passed in so a page can mount its wizard-drawer
 * trigger (client) or a plain <Link className={`${s.btn} ${s.btnPrimary}`}>.
 */
export function EmptyState({
  icon,
  title,
  description,
  actions,
  as: Heading = "h2",
  compact = false,
}: {
  /** A lucide icon element, e.g. <Inbox size={28} strokeWidth={1.5} />. */
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  as?: "h2" | "h3";
  compact?: boolean;
}) {
  return (
    <div className={compact ? `${s.empty} ${s.emptyCompact}` : s.empty}>
      <div className={s.emptyMedia} aria-hidden="true">
        {icon}
      </div>
      <Heading className={s.emptyTitle}>{title}</Heading>
      {description ? <p className={s.emptyText}>{description}</p> : null}
      {actions ? <div className={s.emptyActions}>{actions}</div> : null}
    </div>
  );
}
```

```tsx
// src/components/ops/data/RowsSkeleton.tsx
import s from "./ops-data.module.css";

/**
 * RowsSkeleton — mirrors EntityRow's grid exactly so the swap is zero-shift.
 * Shape from cnippet `Data Table Skeleton` (21st demo 19002); added aria-busy,
 * a spoken label, and a static fallback under prefers-reduced-motion.
 * Use as the Suspense fallback around the list, or in loading.tsx.
 */
const HEAD = [88, 64, 72, 96];

export function RowsSkeleton({ rows = 4, label = "Loading" }: { rows?: number; label?: string }) {
  return (
    <div className={s.list} aria-busy="true" aria-live="polite">
      <span className={s.srOnly}>{label}</span>
      <div className={s.listHead} aria-hidden="true">
        {HEAD.map((w) => (
          <span key={w} className={s.bone} style={{ width: w, height: 10 }} />
        ))}
        <span />
      </div>
      <ul className={s.rows} aria-hidden="true">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className={`${s.row} ${s.rowSkeleton}`}>
            <div className={s.cellIdentity}>
              <span className={`${s.mark} ${s.bone}`} style={{ borderRadius: 12 }} />
              <div className={s.stack}>
                <span className={s.bone} style={{ width: "58%" }} />
                <span className={s.bone} style={{ width: "38%", height: 10 }} />
              </div>
            </div>
            <div className={`${s.cell} ${s.cellStatus}`}>
              <span className={`${s.bone} ${s.bonePill}`} style={{ width: 96 }} />
            </div>
            <div className={`${s.cell} ${s.cellValue}`}>
              <span className={s.bone} style={{ width: 128 }} />
            </div>
            <div className={`${s.cell} ${s.cellEngagement}`}>
              <span className={s.bone} style={{ width: 84 }} />
              <span className={s.bone} style={{ width: 120, height: 10 }} />
            </div>
            <div className={s.cellActions}>
              <span className={s.bone} style={{ width: 84, height: 44, borderRadius: 12 }} />
              <span className={s.bone} style={{ width: 44, height: 44, borderRadius: 12 }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Accessibility.** Empty state is ordinary content with a real heading in the page outline; the icon tile is `aria-hidden`; the description may contain links (styled). Skeleton container is `aria-busy="true" aria-live="polite"` with an sr-only "Loading proposals" label; the bones themselves are `aria-hidden`. Never leave a skeleton without a timeout or error boundary — pair it with `error.tsx`.

**Responsive.** Empty: padding 48/24 → 36/18 under 720 px, copy capped at 46ch, actions wrap and centre. Skeleton follows the row breakpoints automatically because it reuses the row classes.

---

## Wiring example — `/ops/proposals`

```tsx
// src/app/ops/proposals/page.tsx (excerpt) — server component
import { Suspense } from "react";
import { Inbox, ShieldCheck } from "lucide-react";
import { usd } from "@/lib/estimates/admin";
import s from "@/components/ops/data/ops-data.module.css";
import { EntityList, EntityRow } from "@/components/ops/data/EntityRow";
import { RowMenu } from "@/components/ops/data/RowMenu";
import { StatusChip } from "@/components/ops/data/StatusChip";
import { toProposalStatus } from "@/components/ops/data/status";
import { EmptyState } from "@/components/ops/data/EmptyState";
import { RowsSkeleton } from "@/components/ops/data/RowsSkeleton";
import { compactUsd } from "@/components/ops/data/format";

const COLUMNS = ["Proposal", "Status", "Value", "Engagement"] as const;
const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—");

export default async function ProposalsPage() {
  return (
    <div className={s.root}>
      <Suspense fallback={<RowsSkeleton rows={4} label="Loading proposals" />}>
        <ProposalRows />
      </Suspense>
    </div>
  );
}

async function ProposalRows() {
  const rows = (await listEstimates(ADMIN_SECRET)) ?? [];
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<Inbox size={28} strokeWidth={1.5} />}
        title="No proposals yet"
        description={<>Create the first proposal for an existing client's project. Clients and projects live in <a href="/ops/clients">Clients</a>.</>}
        actions={<NewProposalDrawerTrigger className={`${s.btn} ${s.btnPrimary}`} />}  // client component, opens the right-side wizard
      />
    );
  }
  return (
    <EntityList columns={COLUMNS} label="Proposals">
      {rows.map((r) => (
        <EntityRow
          key={r.public_id}
          columns={COLUMNS}
          href={`/ops/proposals/${r.public_id}`}
          mark={r.estimate_no.replace(/\D/g, "").slice(-3) || "PRP"}
          name={r.company}
          meta={<>{r.estimate_no} · {r.project_name}</>}
          status={<StatusChip status={toProposalStatus(r.status, { revoked: r.revoked, signedAt: r.signed_at })} />}
          statusSub={r.mode === "admin_built" ? "PODOS builds" : "Client builds"}
          value={r.one_time_high_cents > 0 ? `${usd(r.one_time_low_cents)} – ${usd(r.one_time_high_cents)}` : "—"}
          valueSub="one-time · range"
          engagement={r.view_count > 0 ? `${r.view_count} views` : "Not viewed"}
          engagementSub={r.view_count > 0 ? `last ${fmt(r.last_viewed_at)} · ${r.client_name}` : r.client_name}
          actions={<RowMenu label={`Actions for ${r.estimate_no}`} items={[{ label: "Preview", href: `/ops/proposals/${r.public_id}/preview` }, { label: "Print", href: `/ops/proposals/${r.public_id}/print` }]} />}
        >
          {/* Secure access: summary line → panel. Never tokens or raw links. */}
          <details className={s.disclosure}>
            <summary><ShieldCheck size={14} aria-hidden="true" /> Secure access · {inviteCount} invitations · {verifiedCount} verified</summary>
            <div className={s.disclosurePanel}>{/* per-contact rows with policy, last seen, revoke */}</div>
          </details>
        </EntityRow>
      ))}
    </EntityList>
  );
}
```

KPI summary row above the list uses `compactUsd(openPipelineCents)` → `$57.5M`.

---

## Verification

- `tsc --noEmit` against the project `tsconfig.json` (React 19.2, Next 16.2 types, `strict`): **0 errors** in the seven files.
- Logic check (`node check.mjs`, asserts on `groupByDay`, `timeFormatter`, `toProposalStatus`): **pass** — Today/Yesterday/`Thu, Aug 20` grouping in `America/New_York`, newest-first ordering, 12-state mapping, unknown → draft.
- Not yet run in the browser: the components are not installed in the repo. Install step = copy `src/components/ops/data/*` from this document, add `.root` to the ops canvas, wire `/ops/proposals`, then run the visual QA matrix (390 / 768 / 1440 / 1920) and the RowMenu keyboard pass before sign-off.

## Source log (mirrored into `docs/component-sources.md`)

| Project component | 21st search intent | Selected source | Why selected | Dependencies | License / attribution | Major modifications | Status |
|---|---|---|---|---|---|---|---|
| `EntityList` / `EntityRow` / `RowMenu` | data table rows with avatar identity, status badge, amount column and row actions menu | shadcnstore **Users List Datatable** (demo 25159) — pattern reference only; bundui Payments Table (25160) inspected | Only candidate with a complete identity cell + row-action contract | none adopted (source: 9 Radix pkgs + cva) | 21st registry / shadcnstore | `<table>` → grid-row `<ul>`; Radix menu → 40-line native `RowMenu` (links or server actions); ops tokens; selected state; detail slot; card reflow ≤1100 px | spec — awaiting install |
| `StatusChip` + `status.ts` | status badge chip variants with dot indicator | diceui **Status** (demo 25395); coss Badge (11356) inspected | Cleanest dot + label + data-variant structure, zero deps | none | 21st registry / diceui | 5 → 12 named tones in one shared tone table; pulse only on live states, frozen under reduced motion; span; sentence case | spec — awaiting install |
| `ActivityTimeline` + `timeline-group.ts` | activity feed timeline grouped by date with icons and timestamps | preetsuthar17 **Timeline** (demo 5157); Activity Feed (19073) and Incident Status Timeline (24943) inspected | Best node/connector/`<time>` model; 19073 supplied the event-vs-note density | none adopted (source: radix scroll-area + cva) | 21st registry / preetsuthar17 | day grouping via `Intl` in a fixed zone; `<section>`+`<h3>`+`<ol>` semantics; lucide icon per type; shared tones; no pulse | spec — awaiting install |
| `EmptyState` / `RowsSkeleton` | empty state with icon, heading, helper text, primary action; skeleton loading rows | cnippet **Empty** (demo 19746) + cnippet **Data Table Skeleton** (demo 19002); Empty State with Marquee (19377) rejected | Composable slots; row-mirroring skeleton | none (source: cva) | 21st registry / cnippet.dev | real heading; blueprint-grid media tile; actions slot for the wizard-drawer trigger; skeleton mirrors EntityRow grid, `aria-busy`, reduced-motion static | spec — awaiting install |
