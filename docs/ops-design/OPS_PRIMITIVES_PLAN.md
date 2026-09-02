# OPS Primitives — implementation plan (one day)

Reconciles the Phase-1 outputs — `OPS_UI_AUDIT.md`, `COMPONENT_SOURCES_shell.md`, `COMPONENT_SOURCES_data.md`, `COMPONENT_SOURCES_overlays.md`, `OPS_LAYOUT_TOKENS.md`, `OPS_TYPOGRAPHY_SYSTEM.md`, `OPS_CARD_SYSTEM.md`, `OPS_STATUS_SYSTEM.md`, `OPS_PAGE_ARCHETYPES.md` — against what is **already shipped** in `src/components/ops/ui/` (`index.tsx`, `ops.module.css`, `ops-tokens.css`, `Drawer.tsx`, `status.ts`) and consumed by all ten `/ops` pages.

This is therefore a **v1 → v2 delta**, not a greenfield build. Every primitive below states: shipped today → change → props → server/client → CSS classes → 21st source.

---

## 0. Decisions where the docs disagreed (or disagreed with shipped code)

| Topic | Docs said | Shipped | Decision |
|---|---|---|---|
| CSS modules | 3 docs → 5 modules (`OpsShell/KpiCard/PipelineStages.module.css`, `ops-data.module.css`, `ops-ui.module.css`) | one `ops.module.css` | **One module** `src/components/ops/ui/ops.module.css`. |
| Token scope | overlays: `:root` in `globals.css`; layout: `.ops` scope | `.ops` scope in `ops-tokens.css`, imported by `ui/index.tsx` | **`.ops` scope** (marketing site untouched). Import moves to a new `src/app/ops/layout.tsx` so `/ops/login` (uses `.ops` but never imports `index.tsx`) also receives tokens. |
| Token names | `--ops-font-display/--ops-font-text`, `--ops-r-12…24`, `--ops-ink-2/-3` | `--ops-display/--ops-text`, `--ops-radius-sm…xl`, `--ops-ink-secondary/-muted` | **Keep shipped names.** Add only tokens a component reads (§1). |
| Status model | data doc: collapse to 12 states; status doc: 25 keys / 18 tones | `status.ts`: 25 keys, 12 tones, 8 stages | **Shipped `status.ts` is canonical** (12-state collapse loses Withdrawn/Lost/Archived). Adopt the status doc's icons and contrast-safe fg values into the 12 tones. |
| Pipeline stages | 7 | 8 (Draft first) | **8** — KPIs and filters already key off `PIPELINE_STAGES`. |
| List-page KPIs | archetype: 4 | 6 | **6** (task brief). |
| Right rail on list | archetype: none | 8/4 with rail | **8/4** (task brief): attention · recent activity · engagement. |
| Drawer | `OpsDrawer` on `motion` springs, `inert`, focus trap | CSS keyframes, Esc, backdrop, scroll lock | **Keep shipped; add** focus-first / return-focus / `inert` siblings (~12 lines). No `motion` import. Width 560. |
| Wizard | `useWizard` + `AnimatePresence` + roving rail | inline `useState` in `NewProposalWizard` | **Extract a `Wizard` primitive, no motion.** `<ol>` rail with `aria-current="step"`, footer nav, `canAdvance`. Reused by Grant-access drawer. |
| Toolbar | client `ListToolbar` + `Segmented` (debounce, density, layout) | server `<form method=get>` + `<Link>` chips | **Keep server Toolbar** (URL is state, zero JS). Add a `sort` link group. Segmented/density/layout deferred (YAGNI). |
| Tabs | client Tabs with `layoutId` indicator | none | **Server link-tabs** (`<nav>` + `aria-current="page"`, `?tab=`). Client variant only when in-page switching without navigation is needed. |
| KPI semantics | `<dl>`/`dt`/`dd` per row | `<p>`s inside optional `<Link>` | **Keep shipped** (clickable KPI needs the `<Link>` wrapper; one `dl` per row would break it). |
| Entity row link | whole card is an absolute `<Link>` overlay | title is the link + `Open` button | **Keep shipped** (overlay + nested interactives is an a11y trap). |
| Row actions | `Open` + `⋯ RowMenu` (client) | `Open` + `ConfirmDelete` popover | **Keep ConfirmDelete** (no-JS `<details>` popover), restyled to an icon-ghost trigger so the row shows ≤2 controls. |
| Secure access links | never render `/e/<token>` text or hrefs | row prints `Build link` / `Proposal link` anchors + reveal `<input value=url>` | **Remove URL text and hrefs.** One `CopyLink` client button (clipboard) in the reveal Notice and per invitation row. Ceiling: the token still travels in the RSC payload — acceptable for an authenticated admin; the upgrade is a server "re-issue link" action. |
| Type sizes | table forbids 9/10/13.5px | `envBadge` 10px, `navSoon` 9px, `13.5px` ×9 | envBadge → 11px, navSoon → 11px, `13.5` → `13` (one find-replace). |
| Sidebar | nav groups + user chip | flat list | **Add groups** (Work · Accounts · Configure · System). **Skip user chip** — no user identity exists beyond the admin cookie. |
| Command search ⌘K | `CommandSearch` (large client component) | none | **Deferred** — not needed for `/ops/proposals`. `AppShell` gets a `utility` slot so it drops in later. |

Code findings carried from `OPS_STATUS_SYSTEM.md §1` that are one-liners and ship with this work:
- `src/app/client/proposals/[publicId]/configure/page.tsx:28` — `revision_required` → `revision_requested` (client cannot re-edit after a revision request today).
- `proposals/page.tsx:37-39` local `RELEASED_STATES`/`stageOf`/`isActive` duplicate `status.ts` → import `stageKeyFor`/`isOpenProposal` instead.

---

## 1. Token block (global stylesheet)

File: `src/components/ops/ui/ops-tokens.css` (plain CSS, `.ops`-scoped). Imported **once** from `src/app/ops/layout.tsx`:

```tsx
// src/app/ops/layout.tsx  (server)
import "@/components/ops/ui/ops-tokens.css";
export default function OpsLayout({ children }: { children: React.ReactNode }) { return children; }
```

Remove `import "./ops-tokens.css"` from `ui/index.tsx`. Everything already in the file stays. **Add** these (only what components below read):

```css
.ops {
  --ops-drawer-width: 560px;                 /* overlays doc: 560 (wizard needs two-column rows) */
  --ops-utility-bar-height: 56px;
  --ops-border-hairline: rgba(34, 82, 154, 0.07);   /* dividers inside cards */
  --ops-focus-ring: 0 0 0 3px rgba(27, 85, 245, 0.22);
  --ops-dur-fast: 180ms;
  --ops-dur-slow: 260ms;
  --ops-z-utility: 20; --ops-z-backdrop: 60; --ops-z-drawer: 61;

  /* status chip ladder — contrast-checked fg (≥4.5:1 on its tint over #fff), OPS_STATUS_SYSTEM §3 */
  --ops-chip-gray-fg: #4b5872;    --ops-chip-gray-bg: rgba(125,139,163,.14);
  --ops-chip-muted-fg: #6e7a90;   --ops-chip-muted-bg: rgba(125,139,163,.08);
  --ops-chip-cobalt-fg: #1b44c2;  --ops-chip-cobalt-bg: rgba(27,85,245,.09);
  --ops-chip-deep-fg: #ffffff;    --ops-chip-deep-bg: #1236c6;               /* Proposal sent — the one filled chip */
  --ops-chip-electric-fg: #0b67c2;--ops-chip-electric-bg: rgba(22,141,255,.11);
  --ops-chip-cyan-fg: #0e7a94;    --ops-chip-cyan-bg: rgba(39,195,234,.13);
  --ops-chip-amber-fg: #8a5a0b;   --ops-chip-amber-bg: rgba(236,164,58,.15);
  --ops-chip-orange-fg: #9a4a12;  --ops-chip-orange-bg: rgba(240,138,60,.14);
  --ops-chip-purple-fg: #5537c9;  --ops-chip-purple-bg: rgba(119,89,246,.11);
  --ops-chip-violet-fg: #3a43c4;  --ops-chip-violet-bg: rgba(91,91,240,.11);
  --ops-chip-green-fg: #147a4c;   --ops-chip-green-bg: rgba(32,199,122,.13);
  --ops-chip-red-fg: #b12e42;     --ops-chip-red-bg: rgba(226,85,104,.11);
}
```

The `.chip*` classes in `ops.module.css` switch from literal hex to these tokens. No `--ops-indigo`, no spacing-scale variables, no shim block (nothing under `/ops` still reads `--paper/--brand/--edge`; `ConfirmDelete`/`AdminResult` lose their last marketing-token references in §2.16/§2.17).

---

## 2. Primitives

All in `src/components/ops/ui/`. Server components are exported from `index.tsx` (no `"use client"` there); each client primitive is its own file so the server barrel stays server-only. Styling: `ops.module.css` only — no Tailwind, no inline style objects except computed widths.

### 2.1 AppShell — `index.tsx` (server)

Shipped: 252px sticky sidebar, wordmark 168×58, flat `MODULES`, env badge, crumbs topbar, 1680 canvas, CSS-only mobile rail. Adapts arunjdass **Dashboard Sidebar** (21st 14941) frame, inference-sh **Sidebar Light** (19361) `<Link aria-current>` semantics, kumail_ali_r **Core Header Navbar** (9847) blueprint-grid atmosphere.

Change: nav groups; `utility` slot in the topbar; `<nav><ul><li>` list semantics; env badge 11px.

```ts
type Crumb = { label: string; href?: string };
export function AppShell(p: {
  active: string;                 // module href, e.g. "/ops/proposals"
  crumbs?: Crumb[];               // default: ["Operations", current module]
  utility?: ReactNode;            // topbar right, before the env badge (command search later)
  children: ReactNode;
}): JSX.Element;
// MODULES gains `group: "Work" | "Accounts" | "Configure" | "System"`; render one <li class=navGroup> label per group.
```

Classes: `shell sidebar brand brandLogo brandMeta brandLabel envBadge liveDot nav navGroup navItem navItemActive navItemSoon navSoon sidebarFoot signOut canvas topbar crumbs topbarRight inner`.

### 2.2 OpsSidebar / OpsTopBar

Not separate exports — they are the two halves of `AppShell` (one consumer, one file). Listed here only so the brief's names resolve: `OpsSidebar` = `<aside className={s.sidebar}>`, `OpsTopBar` = `<div className={s.topbar}>`. Splitting them would add two files nobody imports.

### 2.3 PageHeader — `index.tsx` (server)

Shipped and compliant (36/40 w800 title, ≤700px subtitle, count line, actions). Adapt: `count` accepts `ReactNode`; cap actions guidance (≤1 primary + 2 secondary) in the JSDoc. No code change otherwise.

```ts
export function PageHeader(p: { title: string; subtitle?: string; count?: ReactNode; actions?: ReactNode }): JSX.Element;
```
Classes: `pageHeader pageTitle pageSubtitle pageCount pageActions`.

### 2.4 KpiCard / KpiGrid — `index.tsx` (server)

Shipped: icon tile 44 · label 11.5 uppercase · value 34/1.05 w800 tabular nowrap · context; container-query grid 6/3/2/1; optional `href`. Adapts lavikatiyar **Activity Stats Card** (21st 7797); animated money would reuse `EstimateFigure` (21st 7461) — not needed on `/ops/proposals`.

Change: `featured?: boolean` (Level-4 modifier, `kpiFeatured`); `ArrowUpRight` 14px appears on hover for `href` cards (`kpiGo`); `value: ReactNode`.

```ts
export type KpiTone = "cobalt" | "cyan" | "green" | "amber" | "purple" | "red" | "electric";
export function KpiCard(p: { icon: ReactNode; label: string; value: ReactNode; context?: string; tone?: KpiTone; href?: string; featured?: boolean }): JSX.Element;
export function KpiGrid(p: { children: ReactNode }): JSX.Element;
```
Classes: `kpiGrid kpi kpiFeatured kpiIcon kpiLabel kpiValue kpiContext kpiGo tone{Cobalt,Cyan,Green,Amber,Purple,Red,Electric}`.

### 2.5 Panel / PanelLink — `index.tsx` (server)

Shipped: title+icon, summary, single action, `tight` (rail variant, no min-height). Change per `OPS_CARD_SYSTEM §2`: optional `count` pill next to the title, optional `footer` row, hairline under the header (`panelBody` wrapper).

```ts
export function Panel(p: { title?: ReactNode; icon?: ReactNode; summary?: string; count?: ReactNode; action?: ReactNode; footer?: ReactNode; tight?: boolean; className?: string; children: ReactNode }): JSX.Element;
export function PanelLink(p: { href: string; children: ReactNode }): JSX.Element;
```
Classes: `panel panelTight panelHead panelTitle panelCount panelSummary panelAction panelBody panelFoot sectionTitle label muted secondary num`.

### 2.6 EntityRow / EntityList — new `index.tsx` export (server)

Shipped: composed inline in `proposals/page.tsx:159-217`, `clients/page.tsx`, `projects/page.tsx` from `s.row`, `Avatar`, `Cell`, `s.rowActions`. Adapts shadcnstore **Users List Datatable** (21st 25159) identity cell + trailing-actions contract; grid-row `<ul>` per the data doc (a `<table>` cannot reflow 116px multi-line rows into cards).

Change: extract; the three list pages call it. `Avatar` and `Cell` remain exported for bespoke rows.

```ts
export function EntityList(p: { label: string; children: ReactNode }): JSX.Element;          // <ul aria-label class=rows>
export function EntityRow(p: {
  href: string;                        // detail page; also the Open button target
  name: string;                        // "Cato Digital — Pod cluster A"
  meta?: ReactNode;                    // "PRP-2026-014 · EST-… · Jane Cole"  (.num on ids)
  metaMuted?: ReactNode;               // "Client builds via the menu · created Sep 1, 2026"
  status: ReactNode;                   // <StatusChip/> (+ optional neutral tag)
  statusSub?: ReactNode;               // validity / signed-by line
  value: ReactNode;                    // formatted money, never wraps
  valueSub?: ReactNode;                // "$12,000 / yr recurring"
  engagement?: ReactNode; engagementSub?: ReactNode;
  actions?: ReactNode;                 // rendered after Open — <ConfirmDelete compact …/>
  openLabel?: string;                  // default "Open"
  featured?: boolean;                  // Level-4 treatment (needs attention)
  children?: ReactNode;                // full-width detail slot → <SecureAccess/>
}): JSX.Element;                       // <li class=row [rowFeatured]>
export function Avatar(p: { name: string }): JSX.Element;
export function Cell(p: { label?: string; children: ReactNode; className?: string }): JSX.Element;
```
Classes: `rows row rowFeatured rowIdentity avatar rowTitle rowMeta rowMetaMuted rowCell rowCellLabel rowCellEngagement rowValue rowSmall rowActions progress`. Breakpoints stay container-based (`@container rows`): 5-zone ≥981 → 3-zone + actions row 621–980 → single column ≤620.

### 2.7 StatusChip / Chip — `index.tsx` (server) + `status.ts`

Shipped: `status.ts` 25 keys → 12 `ChipTone`s + label + stage; `Chip` (26px pill, 12/620); `StatusChip` applies `revoked` → `signed_at` → status precedence. Adapts diceui **Status** (21st 25395) dot+label+`data-tone` structure.

Change: 24px height; icon per status (lucide 12/2) via an `ICON` map in `index.tsx` (React nodes cannot live in the server-safe `status.ts`); `size="sm"` (20px, text only) for tables/timeline; `dot` for live states (`viewed`, `configuring` group) — CSS ring, frozen under reduced motion; chip colours read the `--ops-chip-*` tokens. Neutral tags (policy, mode) use `Chip tone="muted"` — never a status tone.

```ts
export type ChipTone = "gray" | "muted" | "cobalt" | "deep" | "electric" | "cyan" | "amber" | "orange" | "purple" | "violet" | "green" | "red";
export function Chip(p: { tone?: ChipTone; size?: "md" | "sm"; dot?: boolean; icon?: ReactNode; title?: string; children: ReactNode }): JSX.Element;
export function StatusChip(p: { status: string; revoked?: boolean; signedAt?: string | null; size?: "md" | "sm" }): JSX.Element;
// status.ts (unchanged API): statusMeta(), PIPELINE_STAGES (8), CLOSED_STATUSES, stageKeyFor(), isOpenProposal()
```
Classes: `chip chipSm chipDot chip{Gray,Muted,Cobalt,Deep,Electric,Cyan,Amber,Orange,Purple,Violet,Green,Red}`.

### 2.8 Pipeline — `index.tsx` (server)

Shipped: `--stages` grid of tiles (icon · label · count · compact value), connector `::before`, distribution bar with a hard-coded hex palette, `aria-pressed` on links (invalid). Adapts ddoemonn **Wizard Steps** (21st 23576) `<ol>` connected-rail semantics only; bklitai Funnel (10130) rejected.

Change: `<ol aria-label="Stages, in order">` / `<li>`; stage link `aria-label="{label}: {count} proposals, {compact}"` and `aria-current={active ? "true" : undefined}`; bar becomes `role="img"` with a textual share summary; segments coloured by `data-tone` (tone = the stage's chip tone from `statusMeta(stage.statuses[0]).tone`) instead of the palette array.

```ts
export interface PipelineStage { key: string; label: string; icon: ReactNode; count: number; valueCents: number; tone?: ChipTone }
export function Pipeline(p: { stages: PipelineStage[]; active?: string | null; hrefFor?: (key: string) => string; totalCents?: number }): JSX.Element;
```
Classes: `pipeline stage stageActive stageIcon stageLabel stageCount stageValue pipelineBar pipelineSeg`. Breakpoints: 8 → 4 (≤1366) → 2 (≤640).

### 2.9 Toolbar — `index.tsx` (server)

Shipped: `<form method="get" role="search">` + `<Link>` filter chips + count. Overlays doc's `ListToolbar` (client) rejected in §0; custom build stands. Change: optional `sort` link group (same chip style, prefixed "Sort"); `count` right-aligned as `<output>`.

```ts
type LinkChip = { label: string; href: string; active?: boolean; count?: number };
export function Toolbar(p: { action?: string; searchName?: string; searchValue?: string; placeholder?: string; filters?: LinkChip[]; sort?: LinkChip[]; count?: string; children?: ReactNode }): JSX.Element;
```
Classes: `toolbar search filterChip filterChipActive filterChipCount toolbarSort toolbarCount select`.

### 2.10 Drawer — `Drawer.tsx` (client)

Shipped: trigger render-prop, controlled/uncontrolled `open`, Esc, backdrop click, body scroll lock, sticky footer, bottom-sheet ≤760px, content unmounted when closed. Adapts ddoemonn **Drawer** (21st 23558) — `inert` siblings + return-focus adopted; drag-to-dismiss and `motion` springs not adopted.

Change: on open → focus the first focusable in the body (fallback: close button); on close → return focus to the trigger; set `inert` on `document.body` children except the portal-free drawer root (the drawer renders in place, so mark siblings of the shell root); `role="dialog" aria-modal aria-labelledby aria-describedby`; width `var(--ops-drawer-width)`; `description` alias for `subtitle`.

```ts
export default function Drawer(p: {
  trigger: (open: () => void) => ReactNode;
  title: string; subtitle?: string;
  children: ReactNode | ((close: () => void) => ReactNode);
  footer?: ReactNode | ((close: () => void) => ReactNode);
  open?: boolean; onOpenChange?: (open: boolean) => void;
  wide?: boolean;                       // 720px for editors (CatalogEditor tiers)
}): JSX.Element;
```
Classes: `backdrop drawer drawerWide drawerHead drawerTitle drawerSub drawerBody drawerFoot iconBtn`.

### 2.11 Wizard — new `Wizard.tsx` (client)

Shipped: step machine inline in `NewProposalWizard.tsx` (`STEPS`, `step`, `canNext`, `.steps/.step/.stepDot`). Adapts ddoemonn **Wizard Steps** (21st 23576): rail semantics, `canAdvance` gating, actions lifted into the drawer footer, last step is a real `<form action={serverAction}>`. `useWizard` hook, `AnimatePresence`, roving-tabindex rail **not** adopted (a 7-step drawer does not need a keyboard-navigable rail; steps are reached with Back/Continue).

```ts
export type WizardStep = { id: string; label: string; canAdvance?: boolean };
export function Wizard(p: {
  steps: WizardStep[];
  step: number; onStep: (i: number) => void;      // parent owns state (it also owns the form values)
  children: ReactNode;                            // the active step's panel
}): JSX.Element;                                  // <ol class=steps aria-label="Steps"> + <div role=region aria-live=polite aria-label="Step N of M: label">
export function WizardFooter(p: {
  step: number; total: number; canAdvance: boolean;
  onBack: () => void; onNext: () => void; onCancel: () => void;
  submit: { formId: string; label: string; icon?: ReactNode; disabled?: boolean };   // rendered on the last step
}): JSX.Element;                                  // goes in Drawer `footer`
```
Classes: `steps step stepActive stepDone stepDot stepPanel choice choiceActive choiceTitle choiceText field input`.

### 2.12 Tabs — new `index.tsx` export (server)

No consumer on `/ops/proposals`; the detail page (`[publicId]`) is the target. Overlays doc adapts educalvolpz **Animated Tabs** (21st 24930) as a client component — deferred. Ship the zero-JS version: link tabs driven by `?tab=`.

```ts
export function Tabs(p: { label: string; tabs: { id: string; label: string; href: string; count?: number; icon?: ReactNode }[]; active: string }): JSX.Element;
// <nav aria-label={label} class=tabs> <Link aria-current="page" class=tab tabActive> — 44px hit height, 2px gradient underline, overflow-x auto with edge fade
```
Classes: `tabs tab tabActive tabCount`.

### 2.13 Timeline — new `index.tsx` export (server)

Shipped: `.timeline*` classes exist but the rail renders `listRow`s. Adapts preetsuthar17 **Timeline** (21st 5157) node/connector/`<time>` model + felipemenezes098 **Activity Feed** (19073) event-vs-note density; `groupByDay` from the data doc (pure `Intl`, fixed zone).

```ts
export type TimelineItem = { at: string; title: ReactNode; meta?: ReactNode; note?: string; icon?: ReactNode; tone?: ChipTone; href?: string };
export function Timeline(p: { items: TimelineItem[]; grouped?: boolean; timeZone?: string; compact?: boolean; limit?: number }): JSX.Element;
// grouped: <section aria-labelledby><h3 class=timelineDay>Today · Wed, Sep 2</h3><ol>…   compact (rail): flat <ol>, 32px icon, relative time via ago(), absolute in title=
export function groupByDay<T extends { at: string }>(events: readonly T[], timeZone: string, now?: Date): { key: string; label: string; date: string; events: T[] }[];
```
Classes: `timeline timelineDay timelineItem timelineIcon timelineText timelineMeta timelineNote timelineTime`.

### 2.14 EmptyState — `index.tsx` (server)

Shipped and close to spec (dashed border, 52px icon tile, title 17, text ≤46ch, action slot). Adapts cnippet **Empty** (21st 19746) slot structure. Change: title is a real heading (`as?: "h2" | "h3"`, default `h3`); `compact` (padding 24) for rail panels; filtered-empty copy is the caller's job (never the onboarding text).

```ts
export function EmptyState(p: { icon?: ReactNode; title: string; text?: ReactNode; action?: ReactNode; as?: "h2" | "h3"; compact?: boolean }): JSX.Element;
```
Classes: `empty emptyCompact emptyIcon emptyTitle emptyText`.

### 2.15 Skeleton — new `Skeleton.tsx` (server)

Shipped: `Skeleton` block in `index.tsx`; `KpiSkel/RowSkel/PanelSkel/ToolbarSkel/HeaderSkel/Kpis` live in the **route file** `src/app/ops/loading.tsx` and are imported by sibling `loading.tsx` files via `../loading`. Adapts cnippet **Data Table Skeleton** (21st 19002): mirror the real grid so the swap has zero layout shift.

Change: move the helpers to `ui/Skeleton.tsx`; `RowSkel` uses `s.row`'s real template (drop the inline `gridTemplateColumns`); wrapper gets `aria-busy="true"` + sr-only label; shimmer is already static under reduced motion via `ops-tokens.css`.

```ts
export function Skeleton(p: { h?: number; w?: number | string }): JSX.Element;
export function KpiSkel(): JSX.Element;  export function Kpis(p: { n: number }): JSX.Element;
export function RowSkel(): JSX.Element;  export function RowsSkel(p: { n: number; label?: string }): JSX.Element;
export function PanelSkel(p: { lines?: number; rows?: number; tight?: boolean }): JSX.Element;
export function ToolbarSkel(): JSX.Element;  export function HeaderSkel(): JSX.Element;
```
Classes: `skeleton` (+ reuses `kpi row panel toolbar pageHeader`).

### 2.16 ConfirmDelete-compatible danger controls — `ConfirmDelete.tsx` moves to `ui/ConfirmDelete.tsx` (server)

Shipped: `<details>` popover + form; contract `action(fd)`, `hidden`, `confirm` checkbox, `confirm_name` + `expectName` when `guard` is set; inline styles with marketing tokens (`--panel`, `--ink-dim`) and 9–10px uppercase. **Contract is preserved verbatim** (`deleteProposalAction`, `deleteOrgAction`, `deleteProjectAction`, `deleteContactAction`, `ProposalSettings` all keep working).

Change: restyle with module classes; `compact` trigger becomes an icon-ghost button (`Trash2` 14 + sr-only label) so rows show ≤2 visible controls; full trigger = `btn btnDanger btnSm`; popover = `dangerPop` (r12, danger border, shadow-md, `position:absolute; right:0` when compact); add `DangerZone` panel wrapper for detail pages (3px left `--ops-danger` bar, `dangerZone`). Update the 6 import paths (`@/components/ops/ConfirmDelete` → `@/components/ops/ui/ConfirmDelete`).

```ts
export default function ConfirmDelete(p: { action: (fd: FormData) => Promise<void>; hidden: Record<string, string>; label: string; text: string; guard?: { reason: string; expectName: string; what: string } | null; compact?: boolean }): JSX.Element;
export function DangerZone(p: { title?: string; children: ReactNode }): JSX.Element;
```
Classes: `dangerTrigger dangerPop dangerText dangerInput dangerCheck dangerZone btnDanger btnXs btnSm`.

### 2.17 Notice / AdminResult — `index.tsx` (server) + `AdminResult.tsx`

Shipped `Notice` is compliant. `AdminResult.tsx` still uses inline styles and `--edge-bright` → rewrite its body as `<Notice tone={r.ok ? "ok" : "danger"} action={<form action={dismissAdminResult}>…}>`. Add `action?: ReactNode` to `Notice` (right-aligned dismiss slot) — this also hosts the invite reveal's `Done` button.

```ts
export function Notice(p: { tone?: "info" | "ok" | "warn" | "danger"; icon?: ReactNode; action?: ReactNode; children: ReactNode }): JSX.Element;
```

### 2.18 SecureAccess + CopyLink — new `SecureAccess.tsx` (server) + `CopyLink.tsx` (client)

The audit's #7 primitive; shipped inline in `proposals/page.tsx:188-216`. Summary line → in-place `<details>` expander → invitation mini-rows → grant-access form. **No `/e/<token>` text or href anywhere.**

```ts
// SecureAccess.tsx (server)
export function SecureAccess(p: {
  proposal: { publicId: string; estimateNo: string; mode: ProposalMode; company: string; project: string | null; organizationId: string };
  invitations: InvitationRow[];
  contacts: { id: string; label: string }[];                     // org contacts WITH email
  actions: { invite: (fd: FormData) => Promise<void>; revoke: (fd: FormData) => Promise<void> };   // inviteContactAction / revokeInvitationAction passed in
  baseUrl: string;                                               // SITE.baseUrl, only handed to <CopyLink/>
}): JSX.Element;
// CopyLink.tsx (client, ~15 lines)
export default function CopyLink(p: { url: string; label?: string; className?: string }): JSX.Element;  // navigator.clipboard.writeText; "Copied" state 1.5s; never renders url
```
Per invitation row: name/email · `Chip tone="muted"` policy tag · state text (`Verified · last seen 2h ago` / `Not opened · expires Sep 15`) · actions: `CopyLink` (only if `link_token`) + `Revoke` (form → `actions.revoke`, fields `invitationId`, `publicId`). Footer: grant-access form → `actions.invite` (fields `estimateNo publicId mode company project contactId policy`), or the "add a contact with an email" hint linking to `/ops/clients/{organizationId}`.

Classes: `expander expanderBody accessRow accessState accessActions`.

---

## 3. `/ops/proposals` composition

Server component. Data: `listEstimates`, `listOrganizations`, `listProjects`, `listContacts`, `opsDashboard`, then `listInvitations` per row in `Promise.all` (shipped; ceiling = N RPCs — upgrade is one `list_invitations_all` RPC, not today).

```
AppShell active="/ops/proposals"
├─ PageHeader  title "Proposals" · subtitle (≤700px) · count "24 proposals · 14 active"
│              actions: <Link Clients (btnSecondary)>  <NewProposalWizard/>  (one primary)
├─ AdminResult                      → Notice ok/danger + Done
├─ NewInviteReveal                  → Notice ok/warn: "Secure link issued for EST-…" · emailed-to / not-sent reason · <CopyLink/> · Done   (cookie podos_new_invite, no URL text)
├─ KpiGrid (6)                       — all clickable, each sets ?show / ?stage
│   1 Active proposals      FileText   cobalt   value active.length      ctx "24 total · 2 withdrawn"        href show=active
│   2 Open pipeline         DollarSign green    value compact(open$)     ctx usd(open$) | "no open value yet"  (not a filter)
│   3 Configurations        Settings2  cyan     value invited+configuring ctx "{active_invitations} active links"  href stage=configuring
│   4 Submitted for review  Inbox      amber    value submitted+review    ctx "needs engineering or commercial review"  href stage=submitted
│   5 Proposals sent        Send       electric value sent+signature      ctx "{viewed_today} viewed in the last 24 h"  href stage=sent
│   6 Signed                PenLine    purple   value signed.length       ctx usd(signed$) | "no signatures yet"  href stage=signed
├─ Panel "Proposal pipeline" tight · summary "Click a stage to filter" · action "Clear stage filter" (when ?stage)
│   └─ Pipeline stages=8 (Draft · Invited · Configuring · Submitted · Eng. review · Proposal sent · Signature · Signed)
│        count + compact value per stage from PIPELINE_STAGES/stageKeyFor · active=?stage · hrefFor toggles · totalCents=open$ · role=img bar
└─ split84
   ├─ stack (8)
   │   ├─ Toolbar  action=/ops/proposals · q · filters All/Active/Signed/Closed-withdrawn (?show) · sort Updated/Value/Client/Expiry (?sort) · count "12 of 24"
   │   ├─ EmptyState (all.length===0: onboarding + "Go to Clients") | EmptyState (visible.length===0: "Nothing matches" + Clear filters)
   │   └─ EntityList "Proposals"
   │        EntityRow ×N  href=/ops/proposals/{public_id}
   │          name     "{company} — {project_name}"
   │          meta     <b class=num>{public_id}</b> · {estimate_no} · {client_name}
   │          metaMuted "PODOS builds the line items" | "Client builds via the menu" · created {fmtDate}
   │          status   <StatusChip status revoked signedAt/>  (+ Chip muted "v released" when stage ≥ 5 & unsigned)
   │          statusSub Signed by … · date | Valid until … | Validity expired … | No validity date
   │          value    usd(high) | compact(low) – compact(high) | —       valueSub  usd(recurring) / yr | "no recurring services"
   │          engagement "{live} authorized · {verified} verified"        engagementSub "Viewed 3× · last 2h ago" | "Not opened yet"
   │          featured  status ∈ {client_submitted, engineering_review, commercial_review, signature_requested} && !revoked
   │          actions  <ConfirmDelete compact action=deleteProposalAction hidden={publicId} guard=(signed|released ? {expectName: public_id, what:"the proposal number"} : null)/>
   │          children <SecureAccess proposal invitations contacts actions={{invite: inviteContactAction, revoke: revokeInvitationAction}} baseUrl/>
   │                    summary: "Secure access · 2 authorized viewers · 5 sessions · 1 revoked"
   └─ rail (4, sticky top 72)
       ├─ Panel "Attention required" tight (AlertTriangle)
       │    ≤8 <Link class=listRow>: "{company} — {project}" / why · <Chip tone>{label}</Chip>
       │    rules: submitted/eng/commercial review → "Awaiting your review" amber · signature_requested & !signed → "Signature pending · last viewed …" violet
       │           active & expires <7d → "Expires in N days" amber | "Validity expired" red · released/sent/invited & !first_viewed & >3d → "Sent 3+ days ago, not opened" cobalt
       │    empty: "Nothing is waiting on you."
       ├─ Panel "Recent activity" tight (Clock) action PanelLink /ops "Dashboard"
       │    <Timeline compact limit=8 items=dash.recent_activity.map → {at, title: event humanised · company, meta: public_id · actor · “note”, tone: statusMeta(event).tone}/>
       └─ Panel "Engagement" tight (Eye)
            3 stat tiles (kpi compact class `statTile`): Viewed today · Active links · Live sessions
```

Filtering (server): `q` over company/client/project/estimate_no/public_id; `show` ∈ all|active|signed|closed via `isOpenProposal`/`stageKeyFor`/`CLOSED_STATUSES`; `stage` validated against `PIPELINE_STAGES`; `sort` ∈ updated (created_at desc, default) | value (one_time_high desc) | client (company asc) | expiry (expires_at asc, nulls last). `href(patch)` merges `q show stage sort`.

Removed from the shipped page: `RELEASED_STATES`/`stageOf`/`isActive` (use `status.ts`), the two `/e/{token}` anchors, the reveal `<input value=url>`, inline `style={{}}` on rail items (→ `listRow` children classes `listRowMain listRowSub`).

### 3.1 New Proposal wizard drawer — `src/app/ops/proposals/NewProposalWizard.tsx` (client, rebuilt on `Drawer` + `Wizard`)

Props unchanged: `orgs: {id,name}[]`, `projects: {id,name,org_id}[]`, `contacts: {id, organization_id, label, hasEmail}[]`, `initialOrgId?`. Trigger: `btn btnPrimary` "New proposal" (`FilePlus2`). Drawer title "New proposal", subtitle "A proposal always belongs to a client's project. Seven quick steps."

| # | Step | Control(s) | State | `canAdvance` | Form field → `createProposalAction` |
|---|---|---|---|---|---|
| 1 | Type | 2 `choice` tiles: Estimate (preliminary) / Proposal (formal) | `pageMode` | always | `pageMode` = `preliminary` \| `formal` → `setProposalDesign(page_mode)` |
| 2 | Client | `<select class=input>` of `orgs` (archived filtered by page); hint link → `/ops/clients` | `orgId` (resets project/contact) | `!!orgId` | `orgId` |
| 3 | Project | `choice` tile per `projects.filter(org_id===orgId)`; empty → Notice "Add a project →" `/ops/clients/{orgId}` | `projectId` | `!!project` | `projectId` |
| 4 | Contact | `<select>` of org contacts (`disabled` when `!hasEmail`), "— none yet —" allowed | `contactId` | always (optional) | `contactId` (may be "") |
| 5 | Build mode | 2 tiles: Client builds (`client_configured`) / PODOS builds (`admin_built`) | `mode` | always | `mode` |
| 6 | Access | 2 tiles: Email confirmation (`email-confirm`) / One-time code (`otp`); checkbox "Issue the secure link to {contact} right away" (disabled without contact) | `policy`, `inviteNow` | always | `policy`; `inviteNow` = `"1"` \| `"0"` |
| 7 | Review | `<form id="new-proposal-form" action={createProposalAction}>` with 7 hidden inputs + `<dl>` summary (Document · Client · Project · Contact · Build · Access) + "You land in the proposal editor next." | — | submit enabled when `!!project` | all of the above |

`WizardFooter`: Back/Cancel (step 0 closes) · Continue (disabled by `canAdvance`) · last step `submit={{ formId: "new-proposal-form", label: "Create proposal" }}`. On success the action `redirect`s to `/ops/proposals/{public_id}`; when `inviteNow==="1"` it also runs `issueInvitation` and sets `podos_new_invite` (rendered by `NewInviteReveal` on return to the list — no change to `actions.ts`).

### 3.2 Grant-access drawer (inside `SecureAccess`) — same primitives, two steps

Served by `inviteContactAction`. Because `SecureAccess` is a server component, the drawer trigger is a tiny client file `GrantAccessDrawer.tsx` (props: `contacts`, hidden proposal fields) using `Drawer` + `Wizard` with steps **Contact → Access** and a final `<form action={inviteContactAction}>` carrying `estimateNo publicId mode company project contactId policy`. Ponytail: if the day runs short, keep the shipped inline `<select>+Grant access` form inside the expander (it is already a form, not a creation form on the row surface) and ship the drawer next.

---

## 4. Day plan

| Block | Work | Files |
|---|---|---|
| 09:00–10:30 | §1 tokens + `layout.tsx`; chip token classes; envBadge/navSoon/13.5 fixes; nav groups + `utility` slot; Pipeline `<ol>`/`role=img`/`aria-current`/`data-tone`; KpiCard `featured`/`kpiGo`; Panel `count`/`footer`; Notice `action`; Toolbar `sort` | `ops-tokens.css`, `ops.module.css`, `index.tsx`, `src/app/ops/layout.tsx` |
| 10:30–12:30 | Extract `EntityRow/EntityList`; `SecureAccess.tsx` + `CopyLink.tsx`; `Wizard.tsx` + `WizardFooter`; rebuild `NewProposalWizard` on it; Drawer focus/return/inert + `--ops-drawer-width` | `index.tsx`, `SecureAccess.tsx`, `CopyLink.tsx`, `Wizard.tsx`, `Drawer.tsx`, `NewProposalWizard.tsx` |
| 13:30–15:00 | Recompose `/ops/proposals/page.tsx` per §3 (delete local status helpers, URL anchors, inline styles); `StatusChip` icons/size/dot; `Timeline` + `groupByDay` for the rail; `Tabs` (link version) | `proposals/page.tsx`, `index.tsx`, `status.ts` |
| 15:00–16:30 | `Skeleton.tsx` move + 4 `loading.tsx` imports; `ConfirmDelete` → `ui/` restyle + `DangerZone` + 6 imports; `AdminResult` on `Notice`; clients/projects pages switch to `EntityRow` (mechanical) | `Skeleton.tsx`, `ConfirmDelete.tsx`, `AdminResult.tsx`, `clients/page.tsx`, `projects/page.tsx`, `*/loading.tsx` |
| 16:30–17:30 | `revision_required` one-liner; `npx tsc --noEmit`; `npm run lint`; browser at 390 / 768 / 1440 / 1920 (see §5) | — |

Out of the day (recorded, not started): `CommandSearch` ⌘K, `Segmented` density/layout toggle, client `Tabs` with sliding indicator, `RowMenu`, `list_invitations_all` RPC, sidebar user chip, `[publicId]` page migration to `Tabs`/`DangerZone`/`Timeline`.

---

## 5. Verification (gates "done")

1. `npx tsc --noEmit` exit 0; `npm run lint` clean.
2. `/ops/login`, `/ops`, `/ops/proposals`, `/ops/clients`, `/ops/projects` render with tokens (login was the page most at risk before `layout.tsx`).
3. `/ops/proposals` at 1920: 6 KPIs on one row, 8 stages on one row, 8/4 split with sticky rail. 1440: KPIs 3×2, 8 stages, split holds. 768: KPIs 2×3, 4+4 stages, rail below main, rows 3-zone. 390: 1–2 KPIs per row, 2+…stages, rows single column, drawer is a bottom sheet — no horizontal page scroll anywhere.
4. Grep the rendered `/ops/proposals` HTML for `/e/` → zero matches (reveal Notice and expander included).
5. Keyboard: open New proposal with Enter → focus lands in the drawer → Tab stays inside → Esc closes and returns focus to the button; Continue disabled on steps 2–3 until valid; step 7 submits via the footer button (`form=` attribute).
6. Pipeline bar `aria-label` percentages sum to ~100 and match visible counts; each stage link's name starts with its visible label.
7. `ConfirmDelete` with `guard`: typing the wrong name is refused by the DB function (existing behaviour) and the message surfaces through `AdminResult`.
8. Reduced motion: no shimmer, no lift, no pulse.
