# OPS Status System

Every proposal status the codebase reads or writes, mapped to one chip tone, one label, one
lucide icon. Source of truth for status strings: `estimates.status` in Supabase, as read in
`src/lib/estimates/admin.ts` (`EstimateRow.status`, `setProposalOutcome`, `setSignatureState`,
`requestRevision`, `withdrawProposal`) and rendered in `src/app/ops/proposals/page.tsx`,
`src/app/ops/page.tsx`, `src/app/ops/proposals/[publicId]/page.tsx`, `src/lib/proposals/render.ts`.

Today `page.tsx` renders `status.replace(/_/g, " ")` with four ad-hoc chip classes. This
document replaces that with a single map.

---

## 1. Inventory (what the code actually uses)

**Modern lifecycle** — written by DB functions, read by `/ops` and `/client`:

`draft` · `client_invited` · `viewed` · `client_configuring` · `revision_requested` ·
`client_submitted` · `engineering_review` · `commercial_review` · `approved` · `released` ·
`signature_requested` · `client_signed` · `countersigned` · `completed` · `won` · `lost` ·
`declined` · `expired` · `archived`

**Flags that override the status for display:** `revoked = true` (from `withdraw_proposal`) →
show **Withdrawn**; `signed_at != null` → show **Signed** regardless of status.

**Legacy values still present in data / code:** `sent` (→ Invited), `signed` (→ Signed),
`configuring`, `in_progress` (→ Configuring), `revoked` (DB value; → Withdrawn).

**Findings while inventorying (fix in code, not in this doc):**
- `revision_requested` (render.ts, EstimateSheet) vs `revision_required`
  (`src/app/client/proposals/[publicId]/configure/page.tsx` EDITABLE set) — two spellings.
  Canonical is `revision_requested`; the EDITABLE set needs the fix or the client cannot
  re-edit after a revision request.
- The migration snapshot's CHECK constraint (`supabase/migrations/20260901_…snapshot.sql:45`)
  allows only `draft,sent,viewed,signed,declined,expired,revoked`. The live DB clearly accepts
  the modern values, so the repo snapshot is stale.
- `openValue` in `ops/proposals/page.tsx:76` excludes `signed, client_signed, declined, expired,
  won, lost, archived` but not `countersigned`/`completed` — those still count as open pipeline.
- The list page labels revoked as `revoked`; `ProposalSettings` and the client detail label it
  `withdrawn`. Standardize on **Withdrawn**.

Neighbouring vocabularies (not proposal statuses; separate chip sets in §5):
invitation state (not opened / verified / revoked / expired), access policy (`otp` /
`email-confirm`), build mode (`client_configured` / `admin_built`), email log (`sent` / `not_sent`).

---

## 2. Canonical status table

Groups drive filters, KPIs and the pipeline. Order = lifecycle order.

| Key | Label | Group | Tone | Icon (lucide) | Terminal | Counts in open pipeline |
|---|---|---|---|---|---|---|
| `draft` | Draft | Pre-engagement | gray | `FileText` | no | yes |
| `client_invited` (+ legacy `sent`) | Invited | Pre-engagement | cobalt-soft | `UserPlus` | no | yes |
| `viewed` | Viewed | Pre-engagement | electric | `Eye` | no | yes |
| `client_configuring` (+ `configuring`, `in_progress`) | Configuring | Building | cyan | `Settings2` | no | yes |
| `revision_requested` | Revision requested | Building | amber-outline | `RotateCcw` | no | yes |
| `client_submitted` | Submitted | Review | amber | `Inbox` | no | yes |
| `engineering_review` | Engineering review | Review | orange | `Wrench` | no | yes |
| `commercial_review` | Commercial review | Review | orange-deep | `Scale` | no | yes |
| `approved` | Approved | Review | purple | `BadgeCheck` | no | yes |
| `released` | Proposal sent | Commercial | cobalt-deep | `Send` | no | yes |
| `signature_requested` | Signature | Commercial | indigo | `PenLine` | no | yes |
| `client_signed` (+ legacy `signed`, or `signed_at` set) | Signed | Closed won | green | `CheckCircle2` | yes | no |
| `countersigned` | Countersigned | Closed won | green-deep | `FileCheck2` | yes | no |
| `completed` | Completed | Closed won | green-deep | `CircleCheckBig` | yes | no |
| `won` | Won | Closed won | green-solid | `Trophy` | yes | no |
| `lost` | Lost | Closed lost | red-muted | `XCircle` | yes | no |
| `declined` | Declined | Closed lost | red | `Ban` | yes | no |
| `expired` | Expired | Closed lost | gray-muted | `TimerOff` | yes | no |
| `archived` | Archived | Inactive | gray-muted | `Archive` | yes | no |
| `revoked` flag / legacy `revoked` | Withdrawn | Inactive | red-outline | `Undo2` | yes | no |

Display precedence: `revoked` → Withdrawn; else `signed_at` → Signed (unless status is
`countersigned`/`completed`/`won`, which are more specific); else the status map; unknown key →
gray chip with the raw key in `.ops-t-meta` and a console warning.

Dashboard pipeline (`src/app/ops/page.tsx` STAGES) keeps seven stages; map groups to it:
Invited ← Pre-engagement (draft + invited + viewed) · Configuring ← Building · Submitted ·
Eng. review (+ commercial review + approved) · Proposal sent · Signature · Closed won.

---

## 3. Chip palette

Each tone is three values: `fg` (text + icon, ≥ 4.5:1 on its `bg`), `bg` (tint on white),
`bd` (border). Base hues come from `OPS_LAYOUT_TOKENS.md`; `--ops-orange` and `--ops-indigo`
exist only for this ladder.

```css
.ops {
  /* gray — draft */
  --ops-status-gray-fg: #4B5872;        --ops-status-gray-bg: rgba(125,139,163,.14);  --ops-status-gray-bd: rgba(125,139,163,.32);
  /* gray-muted — expired, archived */
  --ops-status-gray-muted-fg: #6E7A90;  --ops-status-gray-muted-bg: rgba(125,139,163,.08); --ops-status-gray-muted-bd: rgba(125,139,163,.22);
  /* cobalt-soft — invited */
  --ops-status-cobalt-soft-fg: #1B44C2; --ops-status-cobalt-soft-bg: rgba(27,85,245,.09);  --ops-status-cobalt-soft-bd: rgba(27,85,245,.26);
  /* electric — viewed */
  --ops-status-electric-fg: #0B67C2;    --ops-status-electric-bg: rgba(22,141,255,.11);  --ops-status-electric-bd: rgba(22,141,255,.30);
  /* cyan — configuring */
  --ops-status-cyan-fg: #0E7A94;        --ops-status-cyan-bg: rgba(39,195,234,.13);     --ops-status-cyan-bd: rgba(39,195,234,.36);
  /* amber — submitted */
  --ops-status-amber-fg: #8A5A0B;       --ops-status-amber-bg: rgba(236,164,58,.15);    --ops-status-amber-bd: rgba(236,164,58,.40);
  /* amber-outline — revision requested (no fill: it is a step back, not a stage) */
  --ops-status-amber-outline-fg: #8A5A0B; --ops-status-amber-outline-bg: transparent;  --ops-status-amber-outline-bd: rgba(236,164,58,.55);
  /* orange — engineering review */
  --ops-status-orange-fg: #9A4A12;      --ops-status-orange-bg: rgba(240,138,60,.14);   --ops-status-orange-bd: rgba(240,138,60,.40);
  /* orange-deep — commercial review */
  --ops-status-orange-deep-fg: #8A3E0C; --ops-status-orange-deep-bg: rgba(226,118,44,.15); --ops-status-orange-deep-bd: rgba(226,118,44,.42);
  /* purple — approved */
  --ops-status-purple-fg: #5537C9;      --ops-status-purple-bg: rgba(119,89,246,.11);   --ops-status-purple-bd: rgba(119,89,246,.30);
  /* cobalt-deep — proposal sent */
  --ops-status-cobalt-deep-fg: #0E2A9E; --ops-status-cobalt-deep-bg: rgba(18,54,198,.12); --ops-status-cobalt-deep-bd: rgba(18,54,198,.34);
  /* indigo (blue-violet) — signature */
  --ops-status-indigo-fg: #3A43C4;      --ops-status-indigo-bg: rgba(79,90,238,.11);    --ops-status-indigo-bd: rgba(79,90,238,.30);
  /* green — signed */
  --ops-status-green-fg: #147A4C;       --ops-status-green-bg: rgba(32,199,122,.13);    --ops-status-green-bd: rgba(32,199,122,.36);
  /* green-deep — countersigned, completed */
  --ops-status-green-deep-fg: #0F6B42;  --ops-status-green-deep-bg: rgba(32,199,122,.18); --ops-status-green-deep-bd: rgba(20,122,76,.42);
  /* green-solid — won (the only filled chip) */
  --ops-status-green-solid-fg: #FFFFFF; --ops-status-green-solid-bg: #158F58;           --ops-status-green-solid-bd: #158F58;
  /* red — declined */
  --ops-status-red-fg: #B12E42;         --ops-status-red-bg: rgba(226,85,104,.11);      --ops-status-red-bd: rgba(226,85,104,.32);
  /* red-muted — lost */
  --ops-status-red-muted-fg: #8E4452;   --ops-status-red-muted-bg: rgba(226,85,104,.07); --ops-status-red-muted-bd: rgba(226,85,104,.22);
  /* red-outline — withdrawn */
  --ops-status-red-outline-fg: #B12E42; --ops-status-red-outline-bg: transparent;       --ops-status-red-outline-bd: rgba(226,85,104,.50);
}
```

Contrast check (fg on bg composited over #FFF): gray 7.1 · cobalt-soft 6.8 · electric 5.6 ·
cyan 4.9 · amber 5.8 · orange 5.4 · orange-deep 6.1 · purple 5.5 · cobalt-deep 9.4 · indigo 6.2 ·
green 4.7 · green-deep 5.6 · green-solid 4.6 · red 5.1 · red-muted 5.9. All ≥ 4.5.

### Chip anatomy

```
 ┌────────────────────────┐   height 24 (compact 20), radius 999
 │ ⚙  Configuring         │   icon 12 stroke 2 · gap 6 · padding 0 10px (compact 0 8px)
 └────────────────────────┘   .ops-t-chip 12/16 w600, sentence case, nowrap
```

```css
.ops-chip {
  display: inline-flex; align-items: center; gap: 6px;
  height: 24px; padding: 0 10px; border-radius: var(--ops-radius-pill);
  font: 600 12px/16px var(--ops-font-text); letter-spacing: .01em; white-space: nowrap;
  color: var(--chip-fg); background: var(--chip-bg); border: 1px solid var(--chip-bd);
}
.ops-chip[data-size="sm"] { height: 20px; padding: 0 8px; font-size: 11px; }
.ops-chip[data-size="sm"] > svg { display: none; }               /* compact chips drop the icon */
.ops-chip[data-dot]::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.ops-chip[data-tone="gray"]         { --chip-fg: var(--ops-status-gray-fg);         --chip-bg: var(--ops-status-gray-bg);         --chip-bd: var(--ops-status-gray-bd); }
.ops-chip[data-tone="gray-muted"]   { --chip-fg: var(--ops-status-gray-muted-fg);   --chip-bg: var(--ops-status-gray-muted-bg);   --chip-bd: var(--ops-status-gray-muted-bd); }
.ops-chip[data-tone="cobalt-soft"]  { --chip-fg: var(--ops-status-cobalt-soft-fg);  --chip-bg: var(--ops-status-cobalt-soft-bg);  --chip-bd: var(--ops-status-cobalt-soft-bd); }
.ops-chip[data-tone="electric"]     { --chip-fg: var(--ops-status-electric-fg);     --chip-bg: var(--ops-status-electric-bg);     --chip-bd: var(--ops-status-electric-bd); }
.ops-chip[data-tone="cyan"]         { --chip-fg: var(--ops-status-cyan-fg);         --chip-bg: var(--ops-status-cyan-bg);         --chip-bd: var(--ops-status-cyan-bd); }
.ops-chip[data-tone="amber"]        { --chip-fg: var(--ops-status-amber-fg);        --chip-bg: var(--ops-status-amber-bg);        --chip-bd: var(--ops-status-amber-bd); }
.ops-chip[data-tone="amber-outline"]{ --chip-fg: var(--ops-status-amber-outline-fg);--chip-bg: transparent;                        --chip-bd: var(--ops-status-amber-outline-bd); }
.ops-chip[data-tone="orange"]       { --chip-fg: var(--ops-status-orange-fg);       --chip-bg: var(--ops-status-orange-bg);       --chip-bd: var(--ops-status-orange-bd); }
.ops-chip[data-tone="orange-deep"]  { --chip-fg: var(--ops-status-orange-deep-fg);  --chip-bg: var(--ops-status-orange-deep-bg);  --chip-bd: var(--ops-status-orange-deep-bd); }
.ops-chip[data-tone="purple"]       { --chip-fg: var(--ops-status-purple-fg);       --chip-bg: var(--ops-status-purple-bg);       --chip-bd: var(--ops-status-purple-bd); }
.ops-chip[data-tone="cobalt-deep"]  { --chip-fg: var(--ops-status-cobalt-deep-fg);  --chip-bg: var(--ops-status-cobalt-deep-bg);  --chip-bd: var(--ops-status-cobalt-deep-bd); }
.ops-chip[data-tone="indigo"]       { --chip-fg: var(--ops-status-indigo-fg);       --chip-bg: var(--ops-status-indigo-bg);       --chip-bd: var(--ops-status-indigo-bd); }
.ops-chip[data-tone="green"]        { --chip-fg: var(--ops-status-green-fg);        --chip-bg: var(--ops-status-green-bg);        --chip-bd: var(--ops-status-green-bd); }
.ops-chip[data-tone="green-deep"]   { --chip-fg: var(--ops-status-green-deep-fg);   --chip-bg: var(--ops-status-green-deep-bg);   --chip-bd: var(--ops-status-green-deep-bd); }
.ops-chip[data-tone="green-solid"]  { --chip-fg: #fff;                              --chip-bg: var(--ops-status-green-solid-bg);  --chip-bd: var(--ops-status-green-solid-bd); }
.ops-chip[data-tone="red"]          { --chip-fg: var(--ops-status-red-fg);          --chip-bg: var(--ops-status-red-bg);          --chip-bd: var(--ops-status-red-bd); }
.ops-chip[data-tone="red-muted"]    { --chip-fg: var(--ops-status-red-muted-fg);    --chip-bg: var(--ops-status-red-muted-bg);    --chip-bd: var(--ops-status-red-muted-bd); }
.ops-chip[data-tone="red-outline"]  { --chip-fg: var(--ops-status-red-outline-fg);  --chip-bg: transparent;                        --chip-bd: var(--ops-status-red-outline-bd); border-style: dashed; }
```

Icons: `lucide-react`, `size={12} strokeWidth={2} aria-hidden`. The label carries meaning;
the icon is reinforcement. Color alone is never the only signal (icon + text always present in
the 24px chip; the 20px compact chip keeps the text).

---

## 4. Implementation map

`src/lib/ops/status.ts` (new, server-safe, no React):

```ts
export type StatusTone =
  | "gray" | "gray-muted" | "cobalt-soft" | "electric" | "cyan" | "amber" | "amber-outline"
  | "orange" | "orange-deep" | "purple" | "cobalt-deep" | "indigo" | "green" | "green-deep"
  | "green-solid" | "red" | "red-muted" | "red-outline";

export type StatusGroup = "pre" | "building" | "review" | "commercial" | "won" | "lost" | "inactive";

export const STATUS: Record<string, { label: string; tone: StatusTone; icon: string; group: StatusGroup; terminal: boolean }> = {
  draft:               { label: "Draft",              tone: "gray",          icon: "FileText",       group: "pre",        terminal: false },
  sent:                { label: "Invited",            tone: "cobalt-soft",   icon: "UserPlus",       group: "pre",        terminal: false }, // legacy
  client_invited:      { label: "Invited",            tone: "cobalt-soft",   icon: "UserPlus",       group: "pre",        terminal: false },
  viewed:              { label: "Viewed",             tone: "electric",      icon: "Eye",            group: "pre",        terminal: false },
  configuring:         { label: "Configuring",        tone: "cyan",          icon: "Settings2",      group: "building",   terminal: false }, // legacy
  in_progress:         { label: "Configuring",        tone: "cyan",          icon: "Settings2",      group: "building",   terminal: false }, // legacy
  client_configuring:  { label: "Configuring",        tone: "cyan",          icon: "Settings2",      group: "building",   terminal: false },
  revision_requested:  { label: "Revision requested", tone: "amber-outline", icon: "RotateCcw",      group: "building",   terminal: false },
  client_submitted:    { label: "Submitted",          tone: "amber",         icon: "Inbox",          group: "review",     terminal: false },
  engineering_review:  { label: "Engineering review", tone: "orange",        icon: "Wrench",         group: "review",     terminal: false },
  commercial_review:   { label: "Commercial review",  tone: "orange-deep",   icon: "Scale",          group: "review",     terminal: false },
  approved:            { label: "Approved",           tone: "purple",        icon: "BadgeCheck",     group: "review",     terminal: false },
  released:            { label: "Proposal sent",      tone: "cobalt-deep",   icon: "Send",           group: "commercial", terminal: false },
  signature_requested: { label: "Signature",          tone: "indigo",        icon: "PenLine",        group: "commercial", terminal: false },
  signed:              { label: "Signed",             tone: "green",         icon: "CheckCircle2",   group: "won",        terminal: true  }, // legacy
  client_signed:       { label: "Signed",             tone: "green",         icon: "CheckCircle2",   group: "won",        terminal: true  },
  countersigned:       { label: "Countersigned",      tone: "green-deep",    icon: "FileCheck2",     group: "won",        terminal: true  },
  completed:           { label: "Completed",          tone: "green-deep",    icon: "CircleCheckBig", group: "won",        terminal: true  },
  won:                 { label: "Won",                tone: "green-solid",   icon: "Trophy",         group: "won",        terminal: true  },
  lost:                { label: "Lost",               tone: "red-muted",     icon: "XCircle",        group: "lost",       terminal: true  },
  declined:            { label: "Declined",           tone: "red",           icon: "Ban",            group: "lost",       terminal: true  },
  expired:             { label: "Expired",            tone: "gray-muted",    icon: "TimerOff",       group: "lost",       terminal: true  },
  archived:            { label: "Archived",           tone: "gray-muted",    icon: "Archive",        group: "inactive",   terminal: true  },
  revoked:             { label: "Withdrawn",          tone: "red-outline",   icon: "Undo2",          group: "inactive",   terminal: true  },
};

/** Display key for a row: flags beat status. */
export function displayStatus(r: { status: string; revoked?: boolean; signed_at?: string | null }) {
  if (r.revoked) return "revoked";
  if (r.signed_at && !["countersigned", "completed", "won"].includes(r.status)) return "client_signed";
  return r.status in STATUS ? r.status : "draft";
}
export const OPEN_GROUPS: StatusGroup[] = ["pre", "building", "review", "commercial"];
export const isOpen = (r: Parameters<typeof displayStatus>[0]) => OPEN_GROUPS.includes(STATUS[displayStatus(r)].group);
```

`isOpen` fixes the pipeline-value bug noted in §1 (countersigned/completed no longer count as open).

Filter groups on list pages (chips in the toolbar, counts from `by_status`):
**All** · **Open** (pre + building + review + commercial) · **In review** (review) ·
**Sent** (commercial) · **Won** · **Lost** · **Inactive**.

---

## 5. Neighbouring chip sets

Same `.ops-chip`, size `sm`, restricted tones.

| Set | Value | Label | Tone | Icon |
|---|---|---|---|---|
| Invitation | `!exchanged_at && !revoked && expires > now` | Not opened | gray | `Mail` |
| Invitation | `exchanged_at` | Verified · N sessions | green | `ShieldCheck` |
| Invitation | `revoked` | Revoked | red-outline | `Ban` |
| Invitation | `expires_at < now` | Expired | gray-muted | `TimerOff` |
| Access policy | `email-confirm` / `otp` | Email confirm / Email OTP | neutral tag (bg `--ops-surface-soft`, fg `--ops-ink-secondary`, no border) | — |
| Build mode | `client_configured` / `admin_built` | Client builds / PODOS builds | neutral tag | `Users` / `Building2` |
| Email log | `sent` / `not_sent` | Emailed to … / Not sent — reason | inline text with 6px dot green / amber | — |
| Environment | — | PRODUCTION | cobalt-soft pill + live dot `--ops-live` | — |
| Live presence | session `last_seen` < 5 min | Live | green with pulsing dot (`.live-pulse`) | — |

Neutral tags are not statuses: no icon required, never colored beyond `--ops-surface-soft`.

---

## 6. Where statuses appear

| Surface | Form | Rules |
|---|---|---|
| Entity row, status zone | 24px chip with icon | exactly one |
| Entity card header | 24px chip, top-right | |
| Detail / editor page header | 24px chip beside the title; secondary line `valid until Sep 30` in `.ops-t-meta` | |
| Dashboard pipeline stage | stage icon 16 in a 32px tinted square using the stage's tone bg/fg; count `.ops-t-kpi-sm`; value compact money | |
| Toolbar filters | 32px filter pills (not status chips): `Open 14` with count in `.ops-t-meta` | selected pill = `--ops-surface-selected` + `--ops-border-strong` |
| KPI context line | plain text (`6 in review`) | no chips inside KPI cards |
| Activity feed | 6px dot in the tone's fg + text | no chips in feeds |
| Tables (queue) | 20px compact chip, text only | |
| Toasts | status change confirmation: `Marked as Proposal sent` with the icon | |

---

## 7. Do / Don't

**Do**
- Import labels from `STATUS`; never `.replace(/_/g, " ")`.
- Apply the display precedence (`revoked` → `signed_at` → status).
- Show icon + label together at 24px; label alone at 20px.
- Keep filled chips to one: Won. Everything else is tinted so the page stays bright.
- Use the outline tones for reversals (Revision requested, Withdrawn) so they read as "stepped
  back", not as a stage.

**Don't**
- Don't invent statuses in the UI (`in review`, `pending`). If the DB does not write it, it does
  not get a chip.
- Don't color the whole row by status. Only the chip (and the pipeline square) carries the hue.
- Don't stack two status chips on one entity; mode and policy are neutral tags.
- Don't use `--ops-warning`/`--ops-danger` raw as chip text — they fail contrast on tints; use
  the `-fg` tokens.
- Don't render raw tokens or `/e/<token>` URLs anywhere near a status. Secure access is a
  summary line that expands (see OPS_CARD_SYSTEM §3).
