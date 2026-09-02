# OPS Page Archetypes

Six page shapes cover every `/ops` route. Each is a composition of the same four bands —
**header → summary → toolbar → content** — on the 12-column grid from `OPS_LAYOUT_TOKENS.md`,
using the card levels from `OPS_CARD_SYSTEM.md`, type from `OPS_TYPOGRAPHY_SYSTEM.md` and chips
from `OPS_STATUS_SYSTEM.md`.

| Archetype | Routes | Summary band | Content split | Right rail |
|---|---|---|---|---|
| 1 Dashboard | `/ops` | 6 KPI | 8 / 4 | live sessions, activity, quick actions |
| 2 List / Category | `/ops/proposals`, `/ops/clients`, `/ops/projects`, `/ops/pricing` (catalog) | 4 KPI | 12 (rows) | none — creation happens in the drawer |
| 3 Detail | `/ops/clients/[orgId]`, `/ops/projects/[id]` | 4 KPI | 8 / 4 | facts, secure access, activity |
| 4 Editor / Split | `/ops/proposals/[publicId]`, `/ops/design`, `/ops/pricing` (rule editor) | inline status strip | 7 / 5 | totals (featured), release checklist, versions |
| 5 Settings | `/ops/settings`, `/ops/users` | none | 3 / 9 | none (left sub-nav instead) |
| 6 Queue | `/ops/engineering-review`, `/ops/signatures`, `/ops/activity` | 4 KPI | 8 / 4 | selected item preview, next action |

---

## 0. Shared bands

```
UTILITY BAR   56px sticky · breadcrumb · ⌘K search · env badge · user
PAGE HEADER   title 36/40 · subtitle 15/23 ≤700px · actions right (≤1 primary + 2 secondary)
SUMMARY       KPI row (Level 1 cards), pinned 4 or 6 — or a status strip on editor pages
TOOLBAR       48px row: search 320 · filter pills · sort · view toggle ····· density / export
CONTENT       12-col grid — 8/4, 7/5, 6/6, or 12
FOOT NOTE     .ops-t-body ≤76ch, muted — policy or help text (optional)
```

Vertical gaps between bands: 24px (`--ops-gap-section`). Inside a band: 16px.

Toolbar spec:

```css
.ops-toolbar { display: flex; align-items: center; gap: 12px; min-height: 48px; flex-wrap: wrap; }
.ops-toolbar .search { width: 320px; max-width: 100%; }
.ops-toolbar .spacer { flex: 1; }
.ops-filter { height: 32px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--ops-border); background: var(--ops-surface); font: 550 13px/18px var(--ops-font-text); color: var(--ops-ink-secondary); display: inline-flex; align-items: center; gap: 8px; }
.ops-filter .n { /* .ops-t-meta */ }
.ops-filter[aria-pressed="true"] { background: var(--ops-surface-selected); border-color: var(--ops-border-strong); color: var(--ops-cobalt-deep); }
```

### Shared states (every archetype)

**Empty** — a Level 2 panel, centered content, max-width 420:

```
┌──────────────────────────────────────────────┐
│               ┌────┐                          │  icon container 48×48 r14 surface-soft, icon 22 cobalt
│               │ ⌁  │                          │
│               └────┘                          │
│          No proposals yet                     │  .ops-t-section-sm, 16 below icon
│  Add a client and a project, then create      │  .ops-t-body, ≤48ch, centered, 6 below
│  the first proposal from here.                │
│         [ New proposal ]  Go to clients       │  primary + ghost, 20 below
└──────────────────────────────────────────────┘  padding 48 26
```

Filtered-empty (search/filter returns nothing) uses the same panel with `No matches for "cato"`
and a single `Clear filters` ghost button — never the onboarding copy.

**Loading** — skeletons that match the real geometry, never spinners for page loads:

```css
.ops-skel { background: var(--ops-surface-soft); border-radius: 8px; position: relative; overflow: hidden; }
.ops-skel::after { content: ""; position: absolute; inset: 0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent); animation: ops-shimmer 1.4s linear infinite; }
@keyframes ops-shimmer { to { transform: translateX(100%); } }
@media (prefers-reduced-motion: reduce) { .ops-skel::after { animation: none; } }
```

KPI skeleton = card frame + 40 icon block + 80×12 label + 140×34 value. Row skeleton = 116px
frame + 40 avatar + 220×14 + 160×12 + 100×24 chip + 120×14 money. Panel skeleton = frame +
180×20 title + three 12px lines. Use `loading.tsx` per route segment; server components stream
the shell first. Spinners (16px, 2px stroke, cobalt) live only inside buttons during actions.

**Error** — inline, never a red page:

```
┌──────────────────────────────────────────────┐  Level 2 panel, 3px left bar --ops-danger
│ ⚠ Couldn't load proposals                     │  .ops-t-section-sm, icon AlertTriangle 18 red-fg
│ The database did not answer (list_estimates). │  .ops-t-body
│ [ Try again ]   Copy details                  │  secondary + ghost
└──────────────────────────────────────────────┘
```

Action errors (server actions) → toast bottom-right, 360 wide, 6s, red-outline tone, with the
DB's refusal message verbatim (`AdminRpcError`). Success → same toast, green tone, 4s. Existing
`AdminResult` maps to this toast.

**Permission / not found** — `notFound()` renders the empty-panel shape with `This proposal
doesn't exist or was deleted` and a `Back to proposals` button.

---

## 1. Dashboard — `/ops`

Purpose: what needs attention today, and how big the pipeline is. No editing here.

```
┌─ HEADER ─────────────────────────────────────────────────────────────────────────────┐
│ Operations Dashboard                                         [ New proposal ] [⋯]   │
│ Pipeline, review queue and live client activity — computed server-side.             │
├─ SUMMARY  6 KPI · repeat(6,1fr) ≥1920 · 3×2 below ─────────────────────────────────┤
│ ┌Invitations┐┌Configuring┐┌Submitted ┐┌Prop. sent┐┌Pipeline $┐┌Signed    ┐          │
│ │    12     ││     4     ││    6     ││    3     ││  $57.5M  ││    9     │          │
│ └──────────┘└──────────┘└──────────┘└──────────┘└──────────┘└──────────┘          │
├─ CONTENT  8 / 4 ─────────────────────────────────────────────────────────────────────┤
│ ┌── 8 · Pipeline by stage (Level 4 hero, r24) ────────────┐ ┌── 4 · Live sessions ─┐│
│ │ Invited  Configuring  Submitted  Eng.rev  Sent  Sig  Won  │ │ ● Jane Cole · Cato    ││
│ │  ▇▇▇      ▇▇▇▇        ▇▇         ▇        ▇▇    ▇    ▇▇  │ │   step 9/14 · 2m ago  ││
│ │  12/$8M   4/$6.1M     6/$12M     2/$4M   3/$9M 1/$2M 9/$16M│ │ ● …                   ││
│ └──────────────────────────────────────────────────────────┘ ├── 4 · Recent activity ─┤│
│ ┌── 8 · Review queue (Level 2, flush rows) ────────────────┐ │ · released PRP-014 3h  ││
│ │ PRP-2026-014  Cato Digital · Pod A   Submitted  $1.8M  →  │ │ · viewed PRP-011  5h  ││
│ │ PRP-2026-009  Nordic DC · Phase 2   Eng. review $4.2M  →  │ │ · invited …            ││
│ │ …                                                         │ ├── 4 · Quick actions ───┤│
│ └──────────────────────────────────────────────────────────┘ │ [New client] [New proj]││
│                                                              └────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────────────┘
```

- **Header actions:** `New proposal` (primary → opens the proposal drawer), `⋯` (export CSV,
  refresh).
- **Summary:** the six metrics already in `src/app/ops/page.tsx`. Each KPI links to the list
  page pre-filtered (`/ops/proposals?group=review`). No deltas until a real prior-period series
  exists.
- **Main (8):** Pipeline panel is the one **featured/hero** item on the page (Level 4, r24):
  seven stage columns, each a 32px tinted stage square (tone from OPS_STATUS_SYSTEM §2), count
  `.ops-t-kpi-sm`, compact value `.ops-t-meta`, a proportional bar 6px r3 in the stage's fg.
  Below it the Review queue panel (Level 2, `data-flush`): compact rows 56px — id (meta),
  client · project (row), chip (sm), money (right), age, arrow. Max 8 rows + `View all`.
- **Right rail (4):** Live sessions (rail panel; presence dot, viewer, step progress `9/14`,
  relative time; empty: `No one is configuring right now`), Recent activity (rail panel; 6px
  tone dot + text + time; max 10; `View activity →`), Quick actions (rail panel; two secondary
  buttons).
- **Empty:** first-run dashboard shows the six KPIs at `0`, the pipeline panel with all stages
  at 0 and its own empty copy (`Create a client, then a project, then a proposal`), rail panels
  each with a one-line empty state.
- **Loading:** 6 KPI skeletons, hero panel skeleton, 5 row skeletons, 3 rail skeletons.
- **Tablet:** KPI 2×3, hero panel full width, queue full width, rail panels stack below in a
  2-col grid; mobile 1-col.

---

## 2. List / Category page — `/ops/proposals`, `/ops/clients`, `/ops/projects`

Purpose: find, scan, open. Creation happens in a **right-side wizard drawer**, never inline.

```
┌─ HEADER ────────────────────────────────────────────────────────────────────────────┐
│ Proposals                                              [ New proposal ] [Clients]  │
│ Every proposal, bound to a client and a project. Access is per person.             │
├─ SUMMARY  4 KPI ────────────────────────────────────────────────────────────────────┤
│ ┌ Total 24 ┐┌ Open pipeline $57.5M ┐┌ In review 6 ┐┌ Signed 9 ┐                     │
├─ TOOLBAR ───────────────────────────────────────────────────────────────────────────┤
│ [🔍 Search proposals, clients, ids ] (All 24)(Open 14)(In review 6)(Sent 3)(Won 9) │
│                                          ····· Sort: Updated ▾  [≡ rows][▦ cards]  │
├─ CONTENT  12 · entity rows, gap 12 ─────────────────────────────────────────────────┤
│ ┌ CD Cato Digital · Pod cluster A   ● Configuring  $1.2M–$1.8M  viewed 3× · Sep 1 [Open][⋯] ┐
│ │    PRP-2026-014 · Jane Cole · Client builds                    2 invitations · 1 verified │
│ │ ▸ Secure access · 2 invitations · 1 verified · next expiry Sep 15                          │
│ └───────────────────────────────────────────────────────────────────────────────────────────┘
│ ┌ ND Nordic DC · Phase 2            ● Eng. review  $4.2M        viewed 8× · Aug 30 [Open][⋯] ┐
│ └───────────────────────────────────────────────────────────────────────────────────────────┘
│ …                                                       Showing 24 of 24 · [Load more]      │
├─ FOOT NOTE ─────────────────────────────────────────────────────────────────────────┤
│ Invitation links are personal, stored as hashes, shown once. Revoking ends sessions.│
└─────────────────────────────────────────────────────────────────────────────────────┘
                                                              ┌─ DRAWER 520 ──────────┐
                                                              │ New proposal      [×] │
                                                              │ ● Client ○ Project ○ … │
                                                              │ ─────────────────────  │
                                                              │ Client        [Cato ▾] │
                                                              │ Project   [Pod clus ▾] │
                                                              │ Build mode  (•) Client │
                                                              │             ( ) PODOS  │
                                                              │ Invite now  [Jane C ▾] │
                                                              │ Policy   [Email conf ▾]│
                                                              │ Valid for     [30 days]│
                                                              │ ─────────────────────  │
                                                              │        [Cancel][Create]│
                                                              └────────────────────────┘
```

- **Header actions:** one primary (`New proposal` / `New client` / `New project`) → drawer;
  one secondary cross-link.
- **Summary (4):** Total · Open pipeline (compact money) · In review · Signed. Clicking a KPI
  applies the matching filter pill.
- **Toolbar:** search (client, project, id, contact), filter pills from OPS_STATUS_SYSTEM §4
  groups with counts, sort (`Updated`, `Value`, `Client`, `Expiry`), rows/cards toggle
  (persist in `localStorage`).
- **Content:** Level 3 entity rows (row layout ≥1024; card layout when the toggle says so or
  on mobile). Each row's secure-access **summary line** expands in place; invitation links are
  never printed. `Invite contact…` inside the expander opens the drawer at the invite step. The
  one-time link reveal (`NewInviteReveal`) becomes a dismissible success toast/panel above the
  rows with a `Copy link` button and no visible URL.
- **Drawer wizard:** steps Client → Project → Mode → Invite (optional) → Review. Sticky footer
  `Cancel` / `Create`. Validation inline under fields. On success: close, toast, new row appears
  featured (Level 4) for 3s then settles.
- **Clients list variant:** identity (name, website), status = archived tag or none, commercial
  = open value, engagement = `3 contacts · 2 proposals`, actions Open / ⋯ (archive).
- **Projects list variant:** identity (name · client), commercial = `12 pods · 6 MW`,
  engagement = `go-live Q2 2027 · 2 proposals`.
- **Catalog (pricing) variant:** grouped by category, rows = item name · SKU (meta) · price
  (money, right) · billing tag · visibility tag; edit opens the drawer.
- **Empty:** onboarding panel (§0) with the primary action opening the drawer. **Loading:** 4
  KPI + 6 row skeletons. **Error:** inline panel in the content band; KPIs render `—`.
- **Tablet/mobile:** KPI 2×2; toolbar wraps (search full width, pills scroll horizontally);
  rows switch to block layout; the drawer becomes full-width.

Rule: **no inline creation forms on list pages.** `NewProposalForm` and the per-row
`<select> + Invite` forms move into the drawer.

---

## 3. Detail page — `/ops/clients/[orgId]`, `/ops/projects/[id]`

Purpose: everything about one entity, with its children (projects, proposals, contacts).

```
┌─ HEADER ────────────────────────────────────────────────────────────────────────────┐
│ Clients / Cato Digital                                                              │
│ ┌──┐ Cato Digital                          [ New proposal ] [Edit] [⋯ archive]     │
│ │CD│ catodigital.com · Colocation · Denmark · client since Jun 2026                 │
├─ SUMMARY  4 KPI ────────────────────────────────────────────────────────────────────┤
│ ┌ Open value $12.4M ┐┌ Proposals 3 ┐┌ Projects 2 ┐┌ Contacts 4 ┐                    │
├─ CONTENT  8 / 4 ────────────────────────────────────────────────────────────────────┤
│ ┌── 8 ──────────────────────────────────────────┐ ┌── 4 · Facts ─────────────────┐ │
│ │ [Overview] [Proposals 3] [Projects 2] [Contacts 4] [Notes]                       │ │
│ │ ───────────────────────────────────────────── │ │ Legal name  Cato Digital ApS │ │
│ │ Proposals                        [New →]      │ │ Website     catodigital.com  │ │
│ │ ┌ PRP-014 · Pod A  ● Configuring  $1.8M  → ┐  │ │ Industry    Colocation        │ │
│ │ ┌ PRP-011 · Pod B  ● Signed       $4.0M  → ┐  │ │ Country     Denmark           │ │
│ │                                               │ ├── 4 · Secure access ─────────┤ │
│ │ Projects                         [New →]      │ │ 4 contacts · 3 invited        │ │
│ │ ┌ Pod cluster A · 12 pods · 6 MW · 1 prop → ┐ │ │ ▸ Jane Cole  Verified · 2 s. │ │
│ │ ┌ Pod cluster B · 8 pods · 4 MW · 2 props → ┐ │ │ ▸ Ole Berg   Not opened      │ │
│ │                                               │ │ [Invite contact…]             │ │
│ │ Contacts                         [Add →]      │ ├── 4 · Activity ──────────────┤ │
│ │ ┌ Jane Cole · CTO · jane@…  commercial ⋯ ┐    │ │ · note added        2h        │ │
│ │ ┌ Ole Berg · CFO · ole@…    signer    ⋯ ┐    │ │ · PRP-014 viewed    5h        │ │
│ └───────────────────────────────────────────────┘ └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

- **Header:** breadcrumb in the utility bar *and* a one-line crumb above the title; identity
  block = monogram 48 r14 + title + meta line (`.ops-t-row-sub`); status chip beside the title
  where the entity has one (proposals, archived clients). Actions: primary `New proposal`
  (drawer, client pre-selected), `Edit` (drawer with the entity form), `⋯` (archive / delete
  with `ConfirmDelete` guard).
- **Summary (4):** Open value · Proposals · Projects · Contacts (client); Proposals · Pods ·
  Capacity MW · Go-live (project).
- **Main (8):** one Level 2 panel with a tab strip (`aria-selected` tab: `--ops-cobalt-deep`
  text + 2px underline gradient). Overview tab shows the three child groups as compact rows
  (56px, `data-flush`), each with a `New →` ghost action that opens the drawer. Other tabs show
  the full entity rows of that type.
- **Right rail (4):** Facts (definition list, label `.ops-t-label` 120px column, value
  `.ops-t-row-sub` in ink), Secure access (rail panel: summary count line + per-contact
  invitation mini-rows with state chip; `Revoke` in a `⋯`; never a URL), Activity (rail panel,
  last 8, `View all →`). Rail is `position: sticky; top: 80px` when shorter than the viewport.
- **Empty:** a client with nothing yet — Overview tab shows three small empty groups, each
  with its own `Add` ghost action; no full-page empty state.
- **Loading:** header skeleton (48 avatar + 240×36), 4 KPI, panel skeleton with tab strip,
  3 rail skeletons. **Error:** inline panel replaces the main panel; rail still renders what it
  has.
- **Tablet:** rail stacks below main as a 2-col grid of rail panels; mobile 1-col; tabs scroll.

---

## 4. Editor / Split page — `/ops/proposals/[publicId]`, `/ops/design`, `/ops/pricing` rules

Purpose: change a document while watching its effect. Left edits, right reflects.

```
┌─ HEADER ────────────────────────────────────────────────────────────────────────────┐
│ Proposals / PRP-2026-014                                                            │
│ Cato Digital · Pod cluster A   ● Configuring          [Release proposal] [Preview] [⋯]│
│ PRP-2026-014 · Client builds · valid until Sep 30 · rev 2                            │
├─ STATUS STRIP (replaces KPI row) ───────────────────────────────────────────────────┤
│ Invited ✓ → Configuring ● → Submitted → Eng. review → Sent → Signature → Signed       │
├─ CONTENT  7 / 5 ────────────────────────────────────────────────────────────────────┤
│ ┌── 7 · Editor (Level 2 panels stacked, gap 16) ──────┐ ┌── 5 · Totals (Level 4, sticky) ┐
│ │ Line items                              [+ Catalog] │ │ One-time            $1,240,000 │
│ │ ┌ Pod, 1 MW           ×12   $85,000   $1,020,000 ⋯┐ │ │ Range      $1.2M – $1.8M       │
│ │ ┌ Cooling loop         ×12   $12,500    $150,000 ⋯┐ │ │ Recurring / yr        $96,000  │
│ │ ┌ Commissioning         ×1   $70,000     $70,000 ⋯┐ │ │ ─────────────────────────────  │
│ │ [+ Add line]                                        │ │ 3 items · 1 pending review     │
│ ├──────────────────────────────────────────────────── │ ├── 5 · Release checklist ───────┤
│ │ Client's configuration (14 steps)     [Import →]    │ │ ✓ Client and project bound     │
│ │ ┌ 01 Site   … ┐ ┌ 02 Power … ┐ ┌ 03 Cooling … ┐    │ │ ✓ At least one line item       │
│ ├──────────────────────────────────────────────────── │ │ ○ Pending-review items cleared │
│ │ Notes & revision requests            [Request rev.] │ │ ○ Contact with email invited   │
│ └──────────────────────────────────────────────────── │ ├── 5 · Versions ────────────────┤
│                                                       │ │ rev 2 · draft · now             │
│                                                       │ │ rev 1 · released · Aug 12 · PDF │
│                                                       │ ├── 5 · Secure access ───────────┤
│                                                       │ │ 2 invitations · 1 verified  ▸   │
│                                                       │ └────────────────────────────────┘
└─────────────────────────────────────────────────────────────────────────────────────┘
```

- **Header:** breadcrumb; title = client · project; status chip inline; meta line (`.ops-t-meta`
  id · mode tag · validity · revision). Actions depend on state: `Release proposal` (primary,
  disabled until the checklist is green), `Preview` (secondary, opens the client render in a new
  tab), `⋯` holds Enable/Disable signature, Request revision, Reopen, Withdraw, Mark
  won/lost/declined/expired, Delete (guarded). Never more than one primary.
- **Status strip:** replaces KPIs. 7 stages as 32px squares + label, connected by a 2px line;
  done stages `--ops-live` check, current stage in its own tone (featured square), future gray.
- **Main (7):** stacked Level 2 panels: Line items (table inside `data-flush`; columns name ·
  qty · unit price · total (money, right) · ⋯; `pending review` shows an amber-outline sm chip;
  add row inline at the bottom — editors may edit inline, lists may not), Client configuration
  (step tiles 3-up), Notes & revision, Document design (on `/ops/design`: form groups).
- **Right rail (5):** Totals panel is **featured** (Level 4) and `sticky; top: 80px`; money in
  `.ops-t-money-lg`; ranges never wrap. Release checklist (rail panel; each item a 6px dot
  green/gray + text; drives the primary button). Versions (rail panel; rev list with PDF link
  for released revs — the stored PDF, not a token URL). Secure access (rail panel; summary line
  expands to invitation rows; `Invite contact…` opens the drawer).
- **Design page variant:** left = design form groups (watermark, accent, cover), right = live
  preview iframe in a featured panel with a 3:4 aspect box.
- **Pricing rules variant:** left = rule editor (tier table), right = worked example panel
  (`12 pods → $85,000/pod`).
- **Empty:** line-item panel empty state: `No line items yet — import the client's
  configuration or add from the catalog` with two buttons. Totals show `—`. Checklist all gray.
- **Loading:** header + strip skeletons, 2 panel skeletons left, 3 rail skeletons. **Error:**
  main panel error inline; if the head record fails, `notFound()` shape.
- **Tablet:** 7/5 stacks — totals panel first (featured, not sticky), then editor panels, then
  the rest of the rail. Mobile same, single column.

---

## 5. Settings page — `/ops/settings`, `/ops/users`

Purpose: rarely-changed configuration. Calm, form-first, no KPIs.

```
┌─ HEADER ────────────────────────────────────────────────────────────────────────────┐
│ Settings                                                                            │
│ Email provider, access codes, defaults. Changes apply to every proposal.            │
├─ CONTENT  3 / 9 ────────────────────────────────────────────────────────────────────┤
│ ┌── 3 · sub-nav (sticky) ─┐ ┌── 9 · form panels, max-width 760, gap 16 ───────────┐│
│ │ ▍General                │ │ ┌ General ───────────────────────────────────────┐  ││
│ │  Email                  │ │ │ Company name        [PODOS AI              ]   │  ││
│ │  Access & security      │ │ │ Default validity    [30] days                  │  ││
│ │  Proposal defaults      │ │ │ Currency            [USD ▾]                    │  ││
│ │  Danger zone            │ │ │                                      [Save]    │  ││
│ └─────────────────────────┘ │ └────────────────────────────────────────────────┘  ││
│                             │ ┌ Email ─────────────────────────────────────────┐  ││
│                             │ │ Provider   ● Configured · Resend      [Test →] │  ││
│                             │ │ From       [proposals@podos.ai          ]      │  ││
│                             │ └────────────────────────────────────────────────┘  ││
│                             │ ┌ Access & security ─────────────────────────────┐  ││
│                             │ │ Admin access code   ••••••  [Rotate]           │  ││
│                             │ │ Sessions            3 active · [Sign out all]  │  ││
│                             │ └────────────────────────────────────────────────┘  ││
│                             │ ┌ Danger zone (red-outline frame) ───────────────┐  ││
│                             │ │ Purge archived proposals        [Purge…]       │  ││
│                             │ └────────────────────────────────────────────────┘  ││
│                             └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
```

- **Header:** no actions (each panel saves itself).
- **Summary:** none.
- **Content:** 3/9. Left sub-nav = Level 2 rail panel, sticky, items 36px with a 3px left
  accent on the active item; scroll-spy. Right = stacked Level 2 panels, each one setting
  group: header (title + one-line summary) → 2-col form grid (label 200px + control) → footer
  with a single `Save` secondary button that turns primary when dirty. `max-width: 760px`.
- **Users & Roles variant:** the 9-col area holds one panel with a user table (name, email,
  role tag, last seen, ⋯) and an `Invite user` primary in the panel header (drawer).
- **Secrets:** never display tokens/keys; show `••••••` + `Rotate`/`Reveal once` which reveals
  into a copy panel for 60s. Access codes are set via a drawer with confirmation.
- **Danger zone:** last panel, `border-color: rgba(226,85,104,.5)`, title in red-fg, every
  action goes through `ConfirmDelete`-style typed confirmation.
- **Empty:** N/A (settings always have values). **Loading:** sub-nav + 3 panel skeletons.
  **Error:** per-panel inline error bar; other panels still editable.
- **Tablet/mobile:** sub-nav becomes a horizontal pill strip above the panels.

---

## 6. Queue page — `/ops/engineering-review`, `/ops/signatures`, `/ops/activity`

Purpose: work through items in order. Age and SLA are the organizing principle.

```
┌─ HEADER ────────────────────────────────────────────────────────────────────────────┐
│ Engineering Review                                            [Assign to me] [⋯]    │
│ Submitted configurations waiting for an engineer. Oldest first.                     │
├─ SUMMARY  4 KPI ────────────────────────────────────────────────────────────────────┤
│ ┌ Waiting 6 ┐┌ Oldest 3d 4h (warning tone) ┐┌ Median time 1d 2h ┐┌ Done today 2 ┐    │
├─ TOOLBAR ───────────────────────────────────────────────────────────────────────────┤
│ [🔍 Search]  (All 6)(Submitted 4)(Eng. review 2)   Assignee ▾   Age ▾   ····· [⇅]  │
├─ CONTENT  8 / 4 ────────────────────────────────────────────────────────────────────┤
│ ┌── 8 · Queue (Level 2, flush rows 64px) ──────────────────┐ ┌── 4 · Selected ─────┐│
│ │ ▍ PRP-2026-009 Nordic DC · Phase 2  Eng. review 3d 4h $4.2M│ │ PRP-2026-009 (feat.)││
│ │   PRP-2026-014 Cato Digital · Pod A Submitted   1d 2h $1.8M│ │ Nordic DC · Phase 2 ││
│ │   PRP-2026-016 Helix · Edge site    Submitted     6h  $900K│ │ 14/14 steps · 3 pend││
│ │   …                                                        │ │ Requested: 12 pods, ││
│ │                                                            │ │ 6 MW, liquid cooling││
│ └────────────────────────────────────────────────────────────┘ │ ─────────────────── ││
│                                                                │ [Open editor]       ││
│                                                                │ [Request revision]  ││
│                                                                │ [Move to commercial]││
│                                                                ├── 4 · Next up ──────┤│
│                                                                │ PRP-2026-014 · 1d 2h││
│                                                                └─────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
```

- **Header actions:** `Assign to me` (secondary; primary only if the queue is unassigned),
  `⋯` (export, SLA settings).
- **Summary (4):** Waiting · Oldest (KPI turns `warning` tone at > 2d, `danger` at > 5d) ·
  Median time in stage · Done today.
- **Toolbar:** search, status pills limited to the queue's statuses, assignee, age bucket,
  sort direction.
- **Main (8):** Level 2 panel, `data-flush`, 64px rows: age bar (3px left, green < 1d, amber
  1–3d, red > 3d), id (meta), client · project (row), compact chip, age (tabular), money (right).
  Selected row gets `aria-selected` (Level 4). Keyboard: ↑/↓ move selection, Enter opens the
  editor, `r` requests revision.
- **Right rail (4):** Selected item preview — **featured** rail panel: identity, step progress,
  requested spec summary (pods · MW · cooling · go-live), pending-review count, then 2–3 stacked
  action buttons (one primary). Next up — rail panel showing the following item so the operator
  keeps moving.
- **Signatures variant:** rows = proposals in `signature_requested` / `client_signed` awaiting
  countersign; rail actions `Countersign`, `Download PDF`, `Disable signature`.
- **Activity variant:** no rail — 12-col feed grouped by day, 40px rows (tone dot · actor ·
  event · id link · time), filter pills by event type, infinite scroll.
- **Empty:** `Queue clear — nothing waiting for engineering` with a `CheckCircle2` icon in
  green tint and a `Go to dashboard` ghost. Rail shows nothing (hidden, not empty-stated).
- **Loading:** 4 KPI + 6 row skeletons + 1 rail skeleton. **Error:** inline in the queue panel.
- **Tablet/mobile:** rail becomes a bottom sheet (drawer variant anchored bottom, radius 24 top)
  that opens on row tap.

---

## 7. Right-rail contents, summarized

| Archetype | Rail panels (top → bottom) | Featured? |
|---|---|---|
| Dashboard | Live sessions · Recent activity · Quick actions | no (hero is in main) |
| Detail | Facts · Secure access · Activity | no |
| Editor / Split | Totals · Release checklist · Versions · Secure access | Totals |
| Queue | Selected item · Next up | Selected item |
| List / Settings | none | — |

Rail rules: `min-width: 320px` (8/4) or `400px` (7/5); panels are `data-rail` (padding 22,
min-h 200); ≤ 4 panels; sticky only when the rail is shorter than the viewport; stacks below
main under 1280px viewport.

---

## 8. Do / Don't

**Do**
- Start every page with the four bands; drop a band only where the archetype says so
  (Settings has no summary; Editor swaps KPIs for the status strip).
- Put creation and editing forms in the drawer (list, detail, settings) or the editor page.
  Rows and rails only summarize and link.
- Keep one primary button per page header.
- Use `loading.tsx` skeletons per route and inline error panels; never a spinner page or a
  red page.
- Let KPIs act as filters on list and queue pages.

**Don't**
- Don't render tokens, `/e/<token>` URLs, or admin secrets on any archetype. Secure access is a
  summary line → panel → one-time copy.
- Don't add a fifth band (banners, notices) above the header; system notices go in the utility
  bar or as toasts.
- Don't put a right rail on a list page — width belongs to rows.
- Don't place more than one featured item in a view.
- Don't mix archetypes on one route (a detail page with an inline editor becomes an Editor
  page; link to it).
