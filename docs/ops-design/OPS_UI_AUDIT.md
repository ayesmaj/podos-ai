# /ops UI audit — current state vs. the 2026-09-02 design brief

Facts only. Every claim cites `file:line`. Paths are repo-relative (`src/...`). rem→px uses the browser default 16px: `html` (src/app/globals.css:163-171) sets no `font-size`, and `.root` in private.module.css sets none either.

Brief failure codes used in the per-page "Failures" lists:

| Code | Brief failure |
|---|---|
| F1 | Narrow, document-like content |
| F2 | Giant / inline creation form on a list page |
| F3 | Oversized empty cards |
| F4 | Secure-access details exposed as plain text (tokens / URLs) |
| F5 | Too many unrelated actions in one card |
| F6 | Tiny letter-spaced labels (≤ 11px uppercase, tracked) |
| F7 | Weak hierarchy |
| F8 | Inconsistent density |

---

## 0. Global facts every page inherits

### Tokens actually in use (src/app/globals.css) vs. brief
| Role | Current | Brief |
|---|---|---|
| page bg `--paper` | `#F7F9FB` (L13) | `#F4F7FC` |
| wash `--canvas` | `#EEF2F6` (L14) | surface-soft `#F2F7FF` |
| surface `--panel` | `#FFFFFF` (L15) | `#FFF` |
| `--brand` | `#2563EB` (L40) | cobalt `#1B55F5` |
| `--brand-deep` | `#1D4ED8` (L42) | cobalt-deep `#1236C6` |
| `--brand-wash` | `rgba(37,99,235,.04)` (L46) | surface-selected `#EAF2FF` |
| `--cyan` / `--cyan-deep` | `#22D3EE` / `#0891B2` (L49/L51) | `#27C3EA` |
| `--brand-gradient` | `135deg #2563EB→#22D3EE` (L58) | `135deg #1236C6 0% → #168DFF 62% → #27C3EA 100%` |
| `--ink-strong/-dim/-faint` | `#0F172A / #475569 / #94A3B8` (L72-74) | `#071126 / #35425B / #7D8BA3` |
| `--edge/-bright/-faint` | `rgba(15,23,42,.08/.16/.04)` (L29-31) | `rgba(34,82,154,.12)` / strong `rgba(27,85,245,.28)` |
| fonts | `--font-display` = Geist, `--font-body` = Inter Tight (L87-88); `--font-mono` and `--font-geist-mono` are aliased to Inter Tight (L93-94) | Geist display, Inter Tight text, no mono — already satisfied |

No `--ops-*` tokens exist anywhere. Semantic colours are hard-coded hex in every ops file instead of tokens: amber `#B45309`, red `#B91C1C`, green `#15803D`, `#7f1d1d`, `#6a4a00`, `#8a6a00`, `rgba(34,197,94,…)`, `rgba(185,28,28,…)`, `rgba(180,83,9,…)` (e.g. clients/page.tsx:66, ConfirmDelete.tsx:23, AdminResult.tsx:10-12, ProposalSettings.tsx:62-68, preview/page.tsx:59-62). Brief wants live `#20C77A`, warning `#ECA43A`, danger `#E25568`, purple `#7759F6`.

### The shell — src/components/ops/OpsShell.tsx
- Layout: `display:flex; minHeight:100vh; background:var(--paper)` (L58). Sidebar `width:224` (brief 252), `position:sticky; top:0; height:100vh`, `padding: 1.1rem .9rem` = 17.6/14.4px, `borderRight 1px --edge`, bg `--panel` (L60-73).
- Logo `<Image>` 116×40 (L75) — brief wants a 150–180px wordmark. "Ops" tag 9px uppercase `.12em` (L76). No OPERATIONS label, no PRODUCTION badge, no live dot.
- Nav (L79-108): `gap:2`; links **11px uppercase, letter-spacing .12em**, padding 8/8.8px, radius 8; active = `--brand-deep` on `--brand-wash`, w700; inactive w500 `--ink-dim`. Not-ready modules (Engineering Review, Signatures, Activity, Users & Roles — L24-27) render as 11px spans at `opacity:.5` (L84-86). No icons.
- Sign-out: 10px uppercase text button (L111-113); server action `signOut` L31-38 → `adminLogout(tok)`, delete `ADMIN_COOKIE`, redirect `/ops/login`. **Preserve.**
- Main canvas (L118): `flex:1; minWidth:0; padding: clamp(1.5rem,3vw,2.5rem)` = 24–40px. **No max-width, no centering** (brief: 1680 centred, `clamp(24px,3vw,48px)` x / 32px y).
- Page header (L119-124): flex row, `marginBottom:1.6rem` = 25.6px; `h1` Geist w800 `letter-spacing -.03em` `clamp(1.4rem,3vw,2rem)` = **22.4–32px** (brief 36/40 w800); `actions` slot right-aligned `gap .6rem`. **There is no subtitle slot, no utility bar, no KPI-row slot** — four pages fake a subtitle with a negative top margin (dashboard L76, proposals L82, pricing L36; design L35 without the hack).
- `MODULES` list L17-29 with `href`/`ready` flags — **preserve** (information architecture).
- Every ops page and action calls `requireOps()` first (src/lib/ops/session.ts:13-17) — **preserve.**

### private.module.css — classes the ops pages actually use (src/components/private/private.module.css)
| Class | Computed | Lines |
|---|---|---|
| `.root` | sets Inter Tight body font, `--prv-*` tokens (radii 16/10/999, shadows, ok/amber/danger hexes, 200ms ease), `min-height:100vh`, bg `--paper` | L10-27 |
| `.title` | 16.8px w700 `-0.01em` | L63 |
| `.body` | 15.2px / 1.6 `--ink-dim` | L64 |
| `.label` / `.labelBrand` | **10.9px w600 uppercase .12em** `--ink-faint` / `--brand-deep` | L65-72 |
| `.num` | `tabular-nums` | L73 |
| `.help` | 12.5px `--ink-faint`, mt 4 | L280 |
| `.chip` + `.chipBrand/.chipCyan/.chipOk/.chipAmber/.chipDanger` | **10.9px w600 uppercase .1em**, padding 4.5/11.2, pill, nowrap | L93-112 |
| `.panel` / `.panelPad` / `.panelLift` | white, 1px `--edge`, **radius 16**, shadow-1; pad `clamp(1.1rem,2vw,1.6rem)` = 17.6–25.6px | L115-122 |
| `.metric` / `.iconTile` / `.metricValue` | grid `44px 1fr` gap 14.4, pad 16/17.6, radius 16, hover lift −1px; 44px tile radius 12 brand-wash; value Geist w800 **24.8px** `-0.03em` | L124-148 |
| `.btn` + `.btnPrimary/.btnSecondary/.btnGhost` | min-h 44, pad 0 19.2, radius 10, **15.2px** w600; primary = 120° gradient brand-deep→brand→cyan-deep with hover `translateY(-1px)` and `:active scale(.98)`; reduced-motion honoured L352-356 | L243-263 |

Pages that wrap content in `.root` (and thus get Inter Tight + tokens): dashboard (page.tsx:75), proposals (proposals/page.tsx:80), pricing (pricing/page.tsx:35). **Clients, client detail, projects, proposal detail, design, settings, login do not** — they render in whatever `html` provides (globals.css:166 `--font-body`), so `--prv-*` tokens are undefined there. That is a root cause of F8.

Unused by ops but reusable: `.field` blueprint atmosphere (radial glows + 32px grid at 6% alpha, masked) L30-46 — close to the brief's background spec; `.input/.select/.textarea` 44px controls with focus ring L266-278; `.progress/.progressFill` L235-240; `.rise` L349-350; `.twoCol` responsive grid L341-346.

### Shared ops components
- **AdminResult** (src/components/ops/AdminResult.tsx): async server component; reads `readAdminResult()` (src/lib/ops/result.ts:16-21, cookie `podos_admin_result`, `ok|msg` / `err|msg`); banner radius 12, pad 12.8/17.6, green/red hard-coded, icon 16, message 13.5px, "Done" button **10px uppercase** (L14) → `dismissAdminResult` (src/app/ops/result-actions.ts:7-10). Used on clients, clients/[orgId], projects, proposals, proposals/[publicId], settings. `attempt(okMessage, fn)` (result.ts:24-34) is the RPC wrapper that writes the cookie — **preserve.**
- **ConfirmDelete** (src/components/ops/ConfirmDelete.tsx): `<details>`; summary = **9px (compact) / 9.5px uppercase** red-bordered pill (L23); form popover `width:min(520px,90vw)`, compact → `position:absolute; right:0; z-index:5` (L26); renders hidden fields (L27), `expectName` hidden + `confirm_name` typed-name input when `guard` (L28-34), required `confirm` checkbox (L36), red 10px uppercase submit (L37). Server-side contract: `fd.get("confirm") === "on"`, `confirm_name` vs `expectName` case-insensitive (clients/[orgId]/actions.ts:42-45; deleteProposalAction compares upper-case to `publicId`, [publicId]/actions.ts:215). **Preserve the field names.**

---

## 1. `/ops` — Dashboard (src/app/ops/page.tsx)

**Layout / width.** Full shell width, no max-width. `.root` wrapper with `minHeight:0; background:transparent` (L75). Three stacked grids: KPI `repeat(auto-fit, minmax(160px,1fr))` gap 12.8 (L79); `minmax(0,2fr) minmax(300px,1fr)` gap 16 (L88); `minmax(0,1fr) minmax(0,1.2fr)` gap 16 (L128). No 12-col grid; no responsive breakpoints (inline styles only).

**Typography (px).** Subtitle `.body` 15.2 (L76). KPI label `.label` 10.9 uppercase; KPI value `.metricValue` 24.8 (L83). Section titles `.title` 16.8 w700 as `<p>` — no `<h2>` anywhere (L92, L112, L132, L153, L171). Stage-card label **8.3px** (`fontSize:"0.52rem"`, `.06em`) (L99); stage value 21.6 (L100); stage money `.help` 12.5 (L101). Activity rows 13 / help 12.5 (L116-121). Engagement header `.label` 10.9 (L136); rows 13.5 (L138); avatar initials 11 w800 in a 28px circle (L140). Review-queue title 14 w700, meta 12.5, chip 10.9 (L162-165). Live sessions 13 (L175). "View all" links are `.label` 10.9 (L133, L154). Total pipeline strong 16 (L93).

**Spacing.** Subtitle `marginTop:-1rem; marginBottom:1.4rem` (L76) — compensates for the shell's fixed header margin. Panels `.panel .panelPad` → 17.6–25.6 padding. Stage cards pad 12.8/11.2, radius 12, bg `--paper`, 6px gap (L95-97). Review rows pad 11.2/12.8 radius 12 (L159). Engagement rows pad 9.6/0 (L138). Activity rows pad 7.2/0 (L116).

**Cards.** KPI = `.metric` (no min-height → ≈78px tall, no context line, 160px min column). Stage cards inside the pipeline panel are a second, denser card style (L97). Review queue rows are a third (bordered, `--paper` bg). Engagement and Live sessions are borderless list rows.

**Failures.** F6 (8.3px stage labels L99; 10.9px labels throughout; 10.9px "View all" links L133/L154). F7 (section titles 16.8px `<p>`; KPI value 24.8 vs brief 30–38; no page subtitle slot; KPI label above value with no context line L83). F8 (four different row/card treatments in one page; KPI columns minmax 160 vs brief 220–250). F5 (one card holds "Proposal review queue" **and** "Live client sessions" L151-182). Not F1/F2/F3/F4.

**Preserve.** `opsDashboard(ADMIN_SECRET)` + `listOrganizations(ADMIN_SECRET)` in `Promise.all` (L48); `Dash` type L37-44 (`total, pipeline_high_cents, signed, viewed_today, active_invitations, configuring, submitted, released, orgs, projects, by_status{n,value_cents}, review_queue[], live_sessions[], recent_activity[]`); `STAGES` L25-33 and the legacy-status folding `stageN/stageV` L52-53; `ago()` L35; `usd` L34; `compactUsd` + `EstimateFigure` (L10/L61); links `/ops/clients/{id}`, `/ops/proposals/{public_id}`; "New client" header action is a **link** to `/ops/clients` (L70), not a form. `metadata` robots noindex + `dynamic="force-dynamic"` (L22-23) — every ops page repeats this pair.

---

## 2. `/ops/clients` — Clients list (src/app/ops/clients/page.tsx)

**Layout / width.** Full shell width; no `.root`. `AdminResult` (L43) → inline create form (L44-48) → table-ish div (L53-87).

**Typography.** Create inputs 13.5 (L22); "+ Add client" **10.5px uppercase .12em** gradient (L47). Header row **9px uppercase .12em** (L54). Name 14 w500 (L64); "archived" badge **8.5px uppercase** amber pill (L66); website 11.5 (L67); counts 13.5 tabular `--ink-dim` (L69-71); open value 13.5 tabular (L72). Ghost actions **9px uppercase .12em**, pad 4/8, icon 11 (L23, L74-77). Empty state plain 14px `<p>` (L51).

**Spacing.** Form `gap .5rem`, `marginBottom 1.4rem` (L44). Header pad 8.8/16 (L54); rows pad 11.2/16 (L63); flex with fixed widths Company `1 1 240` · 70 · 70 · 80 · 120 · Actions 230 (L55-60). Row height ≈ 50px (brief entity row 116–148). `overflow:visible` on the container so the compact ConfirmDelete popover can escape (L53).

**Cards.** One bordered container radius 12 bg panel (L53); rows separated by `--edge-faint`; archived rows `opacity .6` (L63).

**Failures.** F2 (inline creation form at top of the list L44-48). F6 (9px header L54; 9px ghost buttons L23; 8.5px badge L66; 10.5px submit L47). F7 (no KPI/summary row; no status column; company name 14 w500). F5 (Open · edit + Archive/Restore + Delete on every row L73-84). F8 (fixed-px flex columns, 50px rows). Not F1/F3/F4.

**Preserve.** `listOrganizations` → `OrgRow` L25 (`id,name,website,archived_at,contacts,projects,proposals,released,open_value_cents`); inline server action `newClient` L27-35 (`createOrganization(ADMIN_SECRET, name, website?)`, `revalidatePath("/ops/clients")`); `archiveOrgAction` (hidden `orgId`, `archived` "0"/"1") and `deleteOrgAction` imported from `./[orgId]/actions` (L10); ConfirmDelete `guard` when `released > 0` with `expectName = o.name` (L82); `usd` from admin.

---

## 3. `/ops/clients/[orgId]` — Client detail (src/app/ops/clients/[orgId]/page.tsx)

**Layout / width.** Full width; no `.root`. Title = `org.name` (L85); header actions = "Archived" 9.5px pill (L88) + "← All clients" 11px uppercase link (L89). Then `AdminResult` (L93) → collapsed `<details>` "Client details" (L96-124) → grid `minmax(0,2fr) minmax(0,1fr)` gap 22.4 (L126); left column stacks Proposals / Contacts / Projects panels gap 22.4 (L127); right column = Internal notes (L231).

**Typography.** Panel titles = local `Panel` → **10px uppercase .12em** `--brand-deep` `<p>` (L258-259). Details summary 10px uppercase (L97). `Field` label 11 (L255); inputs 13 (L26); `btn` **10px uppercase** brand-wash (L27); `ghost` 9.5px (L28); `danger` 9.5px (L29). Proposals rows: estimate_no **9.5px uppercase** width 120 (L131), project 13.5 (L132), `StatusPill` **9px uppercase .1em** (L269), range 13 tabular (L134). Contacts: name 13.5 w500, title/email/phone 12.5 (L143-146), roles "· edit" **8.5px uppercase** (L147); role checkboxes 12 (L157). Projects: name 13.5 w500 (L186), pods/MW meta **9px uppercase** (L187-188), description 12.5 (L189), "N proposals · edit" **8.5px uppercase** (L191). Notes body 13 (L238); meta **8.5px uppercase** (L240); Delete note **8.5px** (L243). `Empty` 13 (L261).

**Spacing.** Panel pad 17.6/19.2, radius 12 (L259). List rows pad 8/0 with `--edge-faint` top borders (L130, L142, L184, L237). Inline add forms sit below a `--edge` rule with `marginTop/paddingTop .7rem` (L166, L222). Edit forms `gap .5–.6rem` grids `auto-fit minmax(140–200px,1fr)` (L101, L149, L193).

**Cards.** Uniform local `Panel` (bordered, radius 12, panel bg) — no shadow, no header row, no action slot. Every contact and project is a `<details>` whose summary is the list row and whose body is an inline edit form + actions (L141-164, L183-219).

**Failures.** F2 ×4 inline creation forms: add contact (L166-174, 6 inputs + select), add project (L222-227), add note (L232-235), and a "+ New proposal" form inside every project (L205-216). F5: "Client details" combines edit + archive/restore + delete (L96-124); each project combines edit form + create-proposal form + delete (L193-218); each contact combines edit + remove (L149-163). F6 (8.5px L147/L191/L240/L243; 9px L187-188/L269; 9.5px L131/L28-29; 10px L97/L259). F7 (all section titles 10px uppercase `<p>`; all content 12.5–13.5; no KPI/commercial summary for the client). F8 (details/summary rows vs. inline form grids in the same panel). Not F1/F3/F4.

**Preserve — data.** `UUID_RE` guard → `notFound()` (L25, L45); `getOrganization(ADMIN_SECRET, orgId)` → `OrgFull` (L38: `org, contacts, projects, proposals, notes`; field lists L33-37); `RELEASED` set (L30) and `released(p)` (L40: `signed_at || locked || RELEASED.has(status)`); `ROLES` L31; per-project `own`/`blocked` (L180-181); `id="project-{p.id}"` anchor (L183) — deep-link target from `/ops/projects` (projects/page.tsx:54).
**Preserve — actions.** Inline: `addContact` L51-65 (`createContact` with `roles:[role]`), `addProject` L66-73 (`createProject` name/description/pods), `addNote` L74-80 (`addOrgNote`). Imported from `./actions.ts`: `updateOrgAction` (L25-31, fields `orgId,name,legal_name,website,industry,country,notes`), `archiveOrgAction` (L33-39), `deleteOrgAction` (L47-54, force via `typedMatches`, `redirect("/ops/clients")` on success), `updateContactAction` (L56-63, `roles` via `getAll`), `deleteContactAction` (L65-70), `updateProjectAction` (L72-80, `pods,capacity_mw,gpus,workload,golive,description`), `deleteProjectAction` (L82-88), `deleteNoteAction` (L90-95); `refresh()` revalidates `/ops/clients/{id}`, `/ops/clients`, `/ops/projects`, `/ops/proposals` (L23). `createProposalAction` from `../../proposals/actions` with hidden `orgId,projectId` + `mode` + `contactId` selects (L205-215).

---

## 4. `/ops/projects` — Projects index (src/app/ops/projects/page.tsx)

**Layout / width.** Full width; no `.root`. `AdminResult` (L30) → bordered table container (L34-65). Empty state = 14px `<p>` with a link (L32).

**Typography.** Header **9px uppercase .12em** (L35). Name 14 w500 (L44); description 11.5 (L46); client link 13 brand (L49); pods/proposals 13.5 tabular (L51-52). Ghost "Edit" **9px uppercase** (L20, L54). ConfirmDelete compact 9px.

**Spacing.** Header pad 8.8/16; rows pad 11.2/16 (L43); columns Project `1 1 200` · Client `1 1 160` · Pods 60 · Proposals 80 · Actions 170 (L36-40). Rows ≈ 50px.

**Cards.** Same container as clients (radius 12, border, panel bg) — no shadow.

**Failures.** F6 (9px header/ghost). F7 (no KPI row, no status, no commercial column). F5 (Edit + Delete inline on every row L53-62). F8 (px-width flex table). Not F1/F2/F3/F4 — creation deliberately lives in the client (doc comment L11-13).

**Preserve.** `listProjects` → `ProjectRow` L22 (`id,name,description,org_id,org_name,pod_quantity,proposals,released`); Edit link `/ops/clients/{org_id}#project-{id}` (L54); `deleteProjectAction` from `../clients/[orgId]/actions` with hidden `id,orgId` and guard when `released > 0` (L56-60).

---

## 5. `/ops/proposals` — Proposals list (src/app/ops/proposals/page.tsx + NewProposalForm.tsx + actions.ts)

**Layout / width.** `.root` wrapper (L80). Header action "Clients" secondary button 40px/13.5 (L79). Order: `AdminResult` → summary strip → `NewProposalForm` → `NewInviteReveal` → card list (gap 14.4, L95) → footer note.

**Typography.** Summary strip = three `.label` **10.9px uppercase** spans: "N total", "N signed", "$ open pipeline" (L83-85) — the page's KPIs rendered as tiny labels. Card: estimate_no link 13 w700 `--brand-deep` (L110); org link 14.5 w600 (L111); project 14 `--ink-dim` (L112); meta `.help` 12.5 (L114-116); range 13.5 tabular nowrap (L118); `StatusPill` `.chip` 10.9 uppercase (L34-41); mode chip 10.9 (L122); "Open · edit" secondary 34px/12.5 (L123). Secure-access label `.label .labelBrand` 10.9 (L133); invitation rows 12.5 (L137); `access_policy` **9px uppercase** (L139); link anchors 11.5 (L141-144); Revoke **9px uppercase** red (L152); invite selects 13 (L169, L173); Invite button 36px/12.5 (L177). Footer help 12.5 `max-width 76ch` (L185). Empty state `.title` 16.8 + `.body` 15.2 (L97-100).

**Spacing.** Summary strip `marginTop -0.8rem; marginBottom 1rem` (L82). Card `.panel` pad 16/19.2 (L106). Secure-access block `marginTop .9rem; borderTop; paddingTop .8rem` (L132). Invite form `marginTop .7rem` (L163). Cards vary in height with invitation count (F8).

**Cards.** Every proposal is a `.panel` (radius 16, shadow-1) whose top row is identity + money + two chips + two action controls, and whose bottom half is the full secure-access list + invite form, always expanded.

**NewProposalForm** (NewProposalForm.tsx): client component; `.panel` pad 17.6/19.2, grid `1fr 1fr 1fr auto` `alignItems:end` (L39); full-width "How is this proposal built?" select (L40-46); Client / Project / Primary contact selects with `.label` 10.9 captions (L47-69); field style 13.5 min-h 40 (L36); primary button 40px/13.5 (L70). Logic to keep: org→project filter (L22), org→contact filter (L23), `validProject` fallback (L25), submit disabled when the org has no projects (L70), "Add a project to this client →" link substitute (L56), zero-org panel (L27-34), `id="new"` anchor (L29, L39).

**NewInviteReveal** (page.tsx L43-59): reads cookie `podos_new_invite` = `estimateNo|token|sent/notsent|detail` (actions.ts L61-65, `httpOnly, secure, strict, maxAge 300`); prints **`{SITE.baseUrl}/e/{token}`** in a `<code>` at 12.5px (L55); "I have copied it" → `dismissInviteReveal`.

**Failures.** F2 (NewProposalForm above the list L88-92). F4 (raw token URL in `<code>` L55; `href="{SITE.baseUrl}/e/{link_token}?to=configure|proposal"` anchors on every card L142-143 — token visible on hover/status bar/DOM; whole invitation list + invite form expanded on every card by default L132-180 — brief wants a summary line that expands). F5 (open/edit, delete, invite, revoke, links on one card L107-180). F6 (9px L139/L152; 10.9px chips/labels; KPIs as 10.9px labels L83-85). F7 (KPIs as labels; estimate_no 13 vs org 14.5 vs project 14 — flat). F8 (card height varies with invitations; two select styles L169 vs NewProposalForm L36). Not F1/F3. Perf fact: `listInvitations` is awaited per estimate in a serial loop (L68).

**Preserve — data.** `listEstimates, listOrganizations, listProjects, listContacts` in `Promise.all` (L63-65); `listInvitations(ADMIN_SECRET, estimate_no)` per row (L68); `EstimateRow`/`InvitationRow` types (L8); `RELEASED_STATES` (L18); `openValue` rule (L76: excludes revoked and `signed, client_signed, declined, expired, won, lost, archived`); `contactOpts` label + `hasEmail` (L69-73); `orgName` map (L74); `fmt()` (L31); `SITE.baseUrl`.
**Preserve — actions** (proposals/actions.ts). `createProposalAction` L20-31 (`orgId, projectId, contactId|null, mode`, redirects to `/ops/proposals/{public_id}`); `inviteContactAction` L33-68 (hidden `estimateNo, publicId, mode, company, project` + `contactId`, `policy` = `otp` | `email-confirm`; recipient resolved from the contact record L41-43; `createInvitation` → `invitationEmail` + `sendProposalEmail` + `logEmail`; sets `podos_new_invite`); `revokeInvitationAction` L70-77 (`invitationId, publicId`); `dismissInviteReveal` L79-84; `deleteProposalAction` from `./[publicId]/actions` with guard `expectName = public_id` when signed or released (L124-128).

---

## 6. `/ops/proposals/[publicId]` — Proposal editor (src/app/ops/proposals/[publicId]/page.tsx)

**Layout / width.** Full width; no `.root`. Title = `head.company ?? head.client_name` (L83). Header `actions` slot holds up to **seven** controls (L84-129). Then: overview bar (L132-151) → `ReleaseReveal` (L153) → `AdminResult` (L154) → `ProposalSettings` `<details>` (L155) → `DesignPanel` `<details>` (L156) → grid `minmax(0,2fr) minmax(280px,1fr)` gap 22.4 (L158). Left column gap 19.2 (L160). Right rail `position:sticky; top:1rem`, gap 19.2 (L226).

**Typography.** Header actions all **11px uppercase .12em** ghost/gradient buttons, pad 8/12.8–14.4, radius 8, icons 13 (L86-127); "Released PDF · {sha256 first 8}" (L94). Overview: estimate_no 11 uppercase (L133); "v{rev} · locked" 10 uppercase (L134); `StatusPill` 9.5 uppercase (L369-380, only signed/viewed/other tones); mode segmented control **9.5px uppercase** pills (L137-146); project 13.5 (L147); "viewed N×" 10 uppercase right (L148-150). Left "Client configuration" section: label 10 uppercase (L164), meta **9px** (L165), waiting box 14 w600 + 12.5 (L169-172), step label **9px uppercase** (L182), SKU name 14 w600 + SKU **9px** (L183), facts 12.5 (L187-190), import CTA 13 + gradient button **10px uppercase** (L199-206). "Line items" label 10 uppercase (L217). Right rail: "Client configuration" (duplicate title) 10/9 (L230-231), progress bar 5px (L233-235), facts 12.5 (L242), chosen SKUs **9.5 uppercase** (L248), import button 9.5 (L256), revision input 12 + button 9.5 (L264-266); "Preliminary total" label 10, figure Geist **24px** w800 tabular (L276), recurring 13 (L280), note **8.5px uppercase** (L282); "Secure access · client links" label 10 (L288), email 12.5 w600 (L297), status **8.5px uppercase** (L298), Revoke **8.5px** (L305), `LinkRow` label **8.5px uppercase** + URL 11.5 `word-break:break-all` (L433-440), legacy note 11.5 (L316), invite selects 12.5 + "New link" 9.5 (L330-340); "Activity" label 10 (L348), rows 12 (L352), meta **8px uppercase** (L354), note callout 12.5 (L358).

**Spacing.** Overview bar `gap 1.4rem; marginBottom 1.4rem; paddingBottom 1rem; borderBottom --edge` (L132). Sections radius 12, pad 19.2 (left, L162/L216) vs 17.6/19.2 (rail, L228/L274/L287/L347). Rail rows pad 9.6/0 (L295); activity rows pad 4/0 (L352). Details panels (`ProposalSettings`, `DesignPanel`) `marginBottom 1.2rem` (ProposalSettings.tsx:28, DesignPanel.tsx:24).

**Cards.** Bordered sections radius 12 (no shadow) for content; `<details>` bordered blocks for settings/design; coloured notice blocks (green/amber/red) for reveals; brand-wash callouts for empty/import states.

**Failures.** F4 — strongest instance in the app: `LinkRow` prints the **full `https://…/e/{token}?to=…` URL as visible text** for every active invitation (L311-313, L437) and again ×3 in `ReleaseReveal` (L417-419). F5 (header: Preview / PDF / Released PDF / Release / Reopen / Enable signature / back, L84-129; rail "Client configuration" mixes progress + facts + import + request-revision L228-272; "Secure access" mixes list + revoke + invite form + outcome banner L287-345). F6 (8px L354; 8.5px L282/L298/L305/L436/L453; 9px L165/L182/L183/L231; 9.5px L137-146/L248/L256/L265/L338/L376; 10px section labels; 11px header buttons). F7 (every section title is a 10px uppercase `<p>`; "Client configuration" appears twice L164/L230; total 24px vs brief KPI 30–38; StatusPill covers 2 of the brief's 12 statuses). F8 (three section paddings; rail vs left; details vs sections). Not F1/F2/F3.

**Preserve — data.** `PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/` → `notFound()` (L35, L56); `getProposalFull(ADMIN_SECRET, publicId)` → `ProposalFull` (L37-51: `head{public_id, estimate_no, organization_id, client_name, company, project_name, status, view_count, mode, one_time_low_cents, one_time_high_cents, recurring_cents, signed_at, signer_name, expires_at}`, `version{id, rev, status, locked_at, pdf_sha256?, pdf_generated_at?}`, `line_items`, `selections`, `invitations`, `viewers`, `activity[]{at, actor, event, metadata{note?, sha256?}}`); `listCatalog` → `skuName` map + `catalogOptions` (SKU-only, L68-77); `listContacts` + `listInvitations(estimate_no)` (`link_token`, `sessions`, `recipient_name`, L69); `orgContacts` filter (L70); derived flags `released` (L62), `submitted` (L73), `clientMode` (L72), `locked = !!version.locked_at` (L78), release gate `blocked = clientMode && !submitted && line_items.length === 0` (L100); `chosen`/`stepsSaved` from `STEPS`/`STEP_CATEGORY` (L63-67); `resolveDesign(head.design, head.status)` (L156); cookies `podos_release` = `token|sent/notsent/blocked|detail` (L392-394; blocked variant L394-405) and `podos_new_invite` (L446-447); URLs `/ops/proposals/{id}/preview`, `/api/proposal/{id}/pdf`, `/api/proposal/{id}/pdf/stored`, `${SITE.baseUrl}/e/{token}`, `?to=configure`, `?to=proposal`.

**Preserve — actions** (src/app/ops/proposals/[publicId]/actions.ts). `saveLineItem` L25-41 (clamps cents ≤ 1e11, qty ≤ 1e5, unit ≤ 16 chars → `upsertLineItem`); `removeLineItem` L43-47; `addFromCatalog` L49-53; `importClientSelections` L58-63; `releaseToClient` L71-110 (`adminRenderModel` validation gate → `podos_release` "blocked"; `releaseProposal`; `printUrlToPdf(".../print?mode=formal&screen=0", [ADMIN_COOKIE])` + `recordProposalPdf`; `releasedEmail` + `sendProposalEmail` + `logEmail`; sets `podos_release`); `dismissReleaseReveal` L112-116; `setModeAction` L119-125; `reopenForClientAction` L128-133; `toggleSignature` L136-142 (`enable` "0"/"1"); `saveDesignAction` L145-164 (field names `page_mode, watermark, validity_days, v_product, s_summary, s_notes, s_warranty, s_trust_band, signature_block, allow_download, allow_comments`); `updateProposalAction` L168-183 (`projectId, clientName, clientEmail, expiresAt, notes`); `setOutcomeAction` L185-192 (`won|lost|declined|expired|completed`); `withdrawProposalAction` L194-200 (`confirm`, `reason`); `restoreProposalAction` L202-208; `deleteProposalAction` L210-220 (force when `confirm_name` = publicId; redirects to `/ops/proposals`); `sendBackForRevision` L223-229 (`note`). From `../actions`: `inviteContactAction`, `revokeInvitationAction`, `dismissInviteReveal` (page.tsx L6).

### 6a. LineItemEditor (src/app/ops/proposals/[publicId]/LineItemEditor.tsx, client)
- Groups by `category_slug ?? "custom"` (L34-38); category label **9px uppercase** (L75). Row = flex-wrap, pad 6.4, radius 8, `--edge-faint` border, busy → brand-wash (L78): name input `flex 1 1 200` 13 w500 (L79-83); qty `width 60` (L84-89); `$` + unit price `width 110`, **dollars typed → ×100 cents** (L92-97); line total 13 tabular width 100 (L99-101); Rec / Opt / Pend checkboxes **8.5px uppercase** (L102-110); `✕` delete 9px with `window.confirm` (L111-120); per-row `<details>` (summary **8.5px**) for customer_description textarea / category select (8 slugs L133) / unit input `maxLength 16` (L122-137). `cell` style 13px radius 6 (L24).
- Commit-on-blur through `saveLineItem` via `useTransition` (L40-58) — **preserve** the change-detection guards (`!==` checks before commit).
- Add controls (L145-148): `AddCatalog` select + "+ Add" 9.5px (L153-173, `addFromCatalog`), `AddCustom` input + "+ Custom" (L175-193, creates `pendingReview:true, categorySlug:"custom"`).
- Locked → 9.5px amber notice + `ReadOnlyTable` (L60-69, L195-211).

### 6b. ProposalSettings (src/app/ops/proposals/[publicId]/ProposalSettings.tsx, async server)
- `listProjects` filtered to `head.organization_id` (L22); `releasedOnce` (L23), `revoked` (L24); `<details>` summary **10px uppercase Geist .06em** "Proposal settings · {status} · valid until {date}" (L29-31).
- Form grid `auto-fit minmax(180px,1fr)` gap 9.6; labels 11; `projectId` select disabled when signed (L36); `clientName`, `clientEmail`, `expiresAt` (date), `notes` textarea (L35-43); "Save proposal" **10px uppercase** (L44).
- Action row (L47-84): Outcome buttons (Mark won only when signed; Declined / Lost / Expired) 9.5px ghost (L48-57); Withdraw `<details>` with reason input + `confirm` checkbox + amber 10px submit (L61-70); ConfirmDelete guarded with `expectName = publicId` (L72-76); Restore when revoked (L79-82). `RELEASED` set L17; `HeadLike` L19.

### 6c. DesignPanel (src/app/ops/proposals/[publicId]/DesignPanel.tsx, server)
- `<details>` radius 12; summary **10px uppercase Geist .06em** with live summary text (page_mode / watermark / signature) (L25-27).
- Form grid `auto-fit minmax(190px,1fr)` gap 19.2 with three groups headed **9.5px uppercase** (L20): Document (page_mode select, watermark select, validity_days number) L31-47; Sheet sections (6 checkboxes, 16px, `accentColor --brand`) L48-56; Client (2 checkboxes) L57-61; labels 12.5 (L15, L33). "Save design" gradient **10px uppercase** (L64). Field names must match `saveDesignAction` (actions.ts L149-161).

### 6d. `/ops/proposals/[publicId]/preview` (preview/page.tsx)
- Shell page; title "Proposal document"; four `.btn` 40px/13.5 actions: Download PDF (primary, `/api/proposal/{id}/pdf?mode=`), View as {other}, Print view (`/print?mode=`), Back to editor (L37-40). Body grid gap 16: `Readiness` (chipOk line, or `.panel` pad 14.4/17.6 with `.label` + `<ul>` 13.5 / 13, L55-66) → info `.chip` 10.9 uppercase (L46) → `EstimateSheet` inside `.es-stage` radius 16 (L47-49). `adminRenderModel(publicId, sp.mode)` (L26). F6 only (10.9px chips). **Preserve** the action URLs and the `Readiness` errors/warnings split.

### 6e. `/ops/proposals/[publicId]/print` (print/page.tsx)
- **No shell.** Renders `EstimateSheet`; `?screen=0` drops the `.es-stage` wrapper (L28-29). This is the PDF source hit by `printUrlToPdf` (actions.ts L92) — **must not** receive ops chrome or theme changes.

---

## 7. `/ops/pricing` — Catalog & pricing (src/app/ops/pricing/page.tsx + CatalogEditor.tsx + actions.ts)

**Layout / width.** `.root` wrapper (L35). Subtitle `.body` 15.2 `maxWidth 80ch` with `marginTop:-1rem` (L36-39). `CatalogEditor` grid gap 19.2 (CatalogEditor.tsx L51).

**Typography.** Panel titles `.label .labelBrand` **10.9px uppercase** (L54, L67, L106); `.help` counts 12.5 (L68). Rules sub-titles `.title` overridden to **15.2px** (L144, L171); help 12.5. Column headers **10px uppercase .1em** (L21, L72, L147). Cells 13.5, min-h 38, radius 8 (L20); name w600 (L77). Buttons `.btn` 36px/12.5 (L157-158, L176) and 38px/13 (L109). Saving indicator `.help` + inline `<style>` spinner (L111-112).

**Spacing.** Every section `.panel` pad 17.6/19.2 (L53, L65, L105). Rules 2-col grid gap 19.2 (L55). Item rows pad 4.8, radius 10, gap 8 (L76). `AddItem` row `borderTop 1px dashed`, `paddingTop 10` (L121).

**Cards.** `.panel` per category plus one for rules and one for "New category". Item grid is a fixed 7-column template `minmax(140px,1.1fr) minmax(160px,1.6fr) 130px 120px 90px 44px 36px` (L72, L76, L121) with **no `overflow-x` container** — sums to ≥ 720px + gaps before the flexible columns, so it overflows the page below ≈ 1000px viewport.

**Failures.** F2 (inline `AddItem` row at the bottom of every category L98/L117-135; "New category" inline form L105-110). F6 (10px headers L72/L147; 10.9px panel labels). F7 (section titles are labels; rules titles 15.2 vs brief 19–22). F8 (rules card uses `.title`, categories use `.label`). Not F1/F3/F4/F5 (row actions are all catalog-related).

**Preserve — data.** `listCatalog, listCatalogCategories, listPricingRules` in `Promise.all` (page.tsx L25-27); `tierRule = QUANTITY_TIER && active`, `rangeRule = RANGE && active` (L28-29); `tiers` mapped from `params[]` (L30); `spreadPercent = round(spread ?? 0.15 × 100)` (L31); `CatalogItemRow`/`CatalogCategoryRow` types; grouping seeds every category even when empty (CatalogEditor L31-32); `commit()` patch semantics incl. `price_cents: null` for blank (L34-48, L82).
**Preserve — actions** (pricing/actions.ts). `saveCatalogItem` L16-24 (`id?, categorySlug, sku?, name, shortDescription?, priceCents|null, billingFrequency one_time|per_year, unit?, clientVisible?`; cents clamp ≤ 1e12); `removeCatalogItem` L26-30; `addCatalogCategory` L32-38 (slug derivation, ≥ 2 chars, ≤ 40); `saveVolumeTiers` L40-48 (minPods ≥ 1, multiplier .01–2, sorted); `saveRangeSpread` L50-55 (0–0.9). Visibility toggle uses `aria-pressed` (CatalogEditor L88) — keep.

---

## 8. `/ops/design` — Document design (src/app/ops/design/page.tsx + actions.ts)

**Layout / width.** No `.root`. Intro `<p>` 14px `maxWidth 760`, lh 1.6 (L35-39). Result banner (L41-47) from cookie `podos_asset_result` = `type|ok/err|detail` (actions.ts L17-23). Card grid `auto-fit minmax(300px,1fr)` gap 19.2 (L49). Footer note 12.5 (L98-101).

**Typography.** Banner label **10px uppercase Geist .08em** (L22, L43), detail 13, "Done" 9.5 (L45). Card `<h2>` Geist 16 w700 `capitalize` (L62) — the only `<h2>` in the ops app; size tag **9px uppercase** (L63); use text 12.5 (L65); generated meta 12 (timestamp · KB · sha 12 chars) (L66-69); prompt `<details>` summary **9.5px uppercase**, `<pre>` 11.5 (L70-73); quality select 12.5 (L77); Regenerate gradient **10px uppercase** (L80); Revert ghost 10 (L87).

**Spacing / cards.** Card radius 14, border, panel bg, `overflow:hidden` (L55); image box bg `#eef2f8`, `aspect-ratio 3/4 | 3/2`, `maxHeight 360`, plain `<img>` (L56-58); body pad 16/19.2/19.2, gap 10 (L60).

**Failures.** F1 (760px document-style intro paragraph L35 while the grid below is full width). F6 (9/9.5/10px L43/L45/L63/L71/L80/L87). F7 (no page subtitle slot; h2 16 vs brief secondary 16–18 OK, but meta/prompt labels compete). Not F2/F3/F4/F5/F8 (card actions are all about the same asset).

**Preserve.** `listProposalAssets(ADMIN_SECRET)` + `resolveAssetUrls()` (L27); `PROPOSAL_ASSETS[type].size/alt/prompt/references`, `ASSET_TYPES` (L7-8, L51); `USE` copy map (L23); `maxDuration = 300` (L20); `regenerateAssetAction` (actions.ts L25-47: `type`, `quality low|medium|high`, fetches references from own origin, `generateProposalAsset`, `upsertProposalAsset`, `report()`), `revertAssetAction` L49-55 (`deleteProposalAsset`), `dismissAssetResult` L57-60.

---

## 9. `/ops/settings` (src/app/ops/settings/page.tsx + actions.ts)

**Layout / width.** No `.root`. `AdminResult` (L31) → grid `minmax(0,2fr) minmax(280px,1fr)` gap 22.4 (L32). Left = **one** `<form action={saveSettingsAction}>` spanning three `Panel`s with a single "Save settings" button at the bottom (L33-64). Right column: Email delivery, Admin access, Document design panels (L66-83).

**Typography.** Local `Panel` label **10px uppercase .12em** `--brand-deep`, `marginBottom .8rem` (L89-90). Field labels 11 (L22); inputs 13.5, pad 8/10.4, radius 8, `width 100%` (L21). "Trust band (three items)" **9.5px uppercase** (L49). Save settings gradient **10.5px uppercase** (L63). Email status 13 green/amber with icon 14 (L68); env-var hint 12.5 with `<code>RESEND_API_KEY</code>` / `<code>NOTIFY_FROM</code>` (L69). Admin access copy 13 (L72); PIN inputs `inputMode numeric pattern [0-9]{4,12}` (L74-75); "Change access code" **10px uppercase** brand-wash (L76); note 12.5 naming `PODOS_ADMIN_SECRET` (L78).

**Spacing / cards.** Panels pad 17.6/19.2 radius 12, no shadow (L90); identity grid `auto-fit minmax(220px,1fr)` gap 11.2 (L35); trust band 3-col grid (L50).

**Failures.** F6 (10px panel labels, 9.5 L49, 10.5/10 buttons). F7 (panel titles are labels; single save button 3 panels below its first field L63). F4-adjacent: security configuration (env-var names, PIN policy, master-secret rotation guidance) printed as body copy (L69, L72, L78) — no secrets, but the brief wants access details behind a summary → panel. F8 (left column is one form, right column three unrelated info panels). Not F1/F2/F3/F5.

**Preserve.** `getCompanySettings()` (L26) fields `name, legal_name, website, email, phone, default_validity_days, address_lines[], notes[], warranty, trust[3]{title,subtitle}, notify_email`; `isEmailConfigured()` (L27); `saveSettingsAction` (actions.ts L21-35: `linesOf`, days 1–365 else 30, trust saved only when all 3 titles present); `setAdminPinAction` (L9-15: mismatch → `setAdminResult(false, …)`; `setAdminPin`); link to `/ops/design` (page.tsx L81).

---

## 10. `/ops/login` (src/app/ops/login/page.tsx)

**Layout / width.** No shell. `<main>` flex-centred, `minHeight 100vh`, bg `--paper`, pad 48/20 (L73-82). Card `maxWidth 380`, radius 16, border `--edge`, bg panel, pad 32, grid gap 12.8, custom shadow (L83-96). No background atmosphere.

**Typography.** Logo 140×48 + "Internal" **10px uppercase .16em** brand (L97-100). `<h1>` Geist 20 w700 (L101). Label **11px uppercase .12em** (L104). Input 15, pad 11.2/12.8, radius 10, `type=password inputMode=numeric autoComplete=current-password` (L107-121). Errors 13 red `role=alert` for `e=1` / `e=2` (L122-131). Submit gradient 14.5 w600, radius 10, pad 12.8/16 (L132-146). Footnote 11.5 (L147-149).

**Failures.** F6 (10/11px labels). F7 (h1 20; brief page title 36). Plain — none of the brief's blueprint grid / glow. Not F1 (a 380px auth card is appropriate) / F2 / F3 / F4 / F5 / F8.

**Preserve.** Inline server action `login` (L34-58): `adminRateCheck("admin-login", ip, 5, 900)` from `x-forwarded-for` → `?e=2`; `/^\d{4,12}$/` → `adminLoginPin(secret, ua)` else `adminLogin(secret, ua)` → `?e=1`; cookie `ADMIN_COOKIE` `httpOnly, secure, sameSite strict, path /, maxAge 43200`; redirect `/ops/proposals`. Already-valid session → redirect (L68-70). Metadata title "Sign in | PODOS admin" noindex (L28-31).

---

## 11. Failure matrix

| Page | F1 narrow | F2 inline create | F3 empty cards | F4 secure text | F5 mixed actions | F6 tiny labels | F7 hierarchy | F8 density |
|---|---|---|---|---|---|---|---|---|
| Dashboard | – | – | – | – | ✔ L151-182 | ✔ (8.3px L99) | ✔ | ✔ |
| Clients | – | ✔ L44-48 | – | – | ✔ L73-84 | ✔ (9px) | ✔ | ✔ |
| Client detail | – | ✔ ×4 L166/L205/L222/L232 | – | – | ✔ L96-124, L193-218 | ✔ (8.5px) | ✔ | ✔ |
| Projects | – | – | – | – | ✔ L53-62 | ✔ (9px) | ✔ | ✔ |
| Proposals | – | ✔ L88-92 | – | ✔ L55, L142-143 | ✔ L107-180 | ✔ (9px) | ✔ | ✔ |
| Proposal detail | – | – | – | ✔ L311-313, L417-419, L437 | ✔ L84-129, L228-272, L287-345 | ✔ (8px L354) | ✔ | ✔ |
| Preview | – | – | – | – | – | ✔ (10.9px) | – | – |
| Print | n/a (PDF source) | | | | | | | |
| Pricing | – | ✔ L98/L105 | – | – | – | ✔ (10px) | ✔ | ✔ |
| Design | ✔ L35 | – | – | – | – | ✔ (9px) | ✔ | – |
| Settings | – | – | – | ◐ env/PIN copy L69/L72/L78 | – | ✔ (9.5px) | ✔ | ✔ |
| Login | – | – | – | – | – | ✔ (10/11px) | ✔ | – |

Cross-page facts behind the matrix:
- **Four independent StatusPill implementations** with different palettes: dashboard (page.tsx:165 — cyan for `client_submitted`, brand otherwise), proposals (proposals/page.tsx:34-41 — ok/cyan/amber/brand/default), client detail (clients/[orgId]/page.tsx:262-270 — green/red/cyan/gray), proposal detail ([publicId]/page.tsx:369-380 — green/cyan/gray). None covers the brief's 12 statuses (draft, invited, viewed, configuring, submitted, engineering review, approved, proposal sent, signature, signed, expired, declined).
- **Nine files define their own `mono`/`btn`/`ghost`/`input`/`cell`/`field` inline style objects**: OpsShell.tsx:40-44, clients/page.tsx:21-23, clients/[orgId]/page.tsx:24-29, projects/page.tsx:19-20, proposals/page.tsx:32, [publicId]/page.tsx:34, LineItemEditor.tsx:23-24, ProposalSettings.tsx:13-16, DesignPanel.tsx:11/L21, CatalogEditor.tsx:20-21, settings/page.tsx:20-22, design/page.tsx:22, ConfirmDelete.tsx:10, NewProposalForm.tsx:36. Font sizes across them: 8, 8.5, 9, 9.5, 10, 10.5, 11.
- **Three local `Panel` helpers** with identical output (clients/[orgId]/page.tsx:258-260, settings/page.tsx:89-91) plus hand-written `<section>` equivalents in [publicId]/page.tsx:162/216/228/274/287/347 and design/page.tsx:55.
- **Five one-shot cookie banners** with near-identical markup: AdminResult, `NewInviteReveal` (proposals/page.tsx:43-59), `ReleaseReveal` (L388-430), `InviteOutcome` (L443-457), design result (design/page.tsx:41-47), plus preview `Readiness` (preview/page.tsx:55-66).
- **Subtitle hack** (`marginTop` negative) on dashboard L76, proposals L82, pricing L36 because the shell has no subtitle slot.
- Only 3 of 10 shell pages use `.root`, so `--prv-*` tokens and Inter Tight are inconsistently applied (see §0).

---

## 12. Reusable pieces inventory

| Piece | Path | Keep / replace |
|---|---|---|
| `OpsShell` (sidebar, header, `signOut`, `MODULES`) | src/components/ops/OpsShell.tsx | Keep `signOut` L31-38 and `MODULES` L17-29; replace layout/typography L58-126 |
| `AdminResult` + `dismissAdminResult` | src/components/ops/AdminResult.tsx; src/app/ops/result-actions.ts | Keep data path (`readAdminResult`, cookie); restyle as a Notice primitive |
| `ConfirmDelete` | src/components/ops/ConfirmDelete.tsx | Keep form contract (`hidden`, `confirm`, `confirm_name`, `expectName`, `guard`) ; restyle trigger/popover |
| `attempt`, `setAdminResult`, `readAdminResult`, `RESULT_COOKIE` | src/lib/ops/result.ts | Keep |
| `requireOps` | src/lib/ops/session.ts | Keep |
| `private.module.css` — `.root .panel .panelPad .metric .iconTile .metricValue .chip* .btn* .label .title .body .help .num .field .input .select .textarea .progress*` | src/components/private/private.module.css | Shared with the client configurator and the document — do not edit for ops; create an `ops.module.css` with brief tokens instead |
| `EstimateFigure` (spring-animated money) | src/components/private/EstimateFigure.tsx | Keep; wrap in the KPI primitive |
| `compactUsd`, `usd` | src/lib/proposals/money.ts (imported page.tsx:10, EstimateFigure.tsx:14) | Keep |
| `DesignPanel` | src/app/ops/proposals/[publicId]/DesignPanel.tsx | Keep form fields/action; restyle as a Disclosure panel |
| `ProposalSettings` | src/app/ops/proposals/[publicId]/ProposalSettings.tsx | Keep data + actions; split outcome / withdraw / delete into a danger-zone section |
| `LineItemEditor` (+ `AddCatalog`, `AddCustom`, `ReadOnlyTable`) | src/app/ops/proposals/[publicId]/LineItemEditor.tsx | Keep commit logic, dollars→cents, change guards; restyle as a DataTable |
| `NewProposalForm` | src/app/ops/proposals/NewProposalForm.tsx | Keep org→project→contact logic; move into the Drawer primitive |
| `CatalogEditor` (+ `AddItem`, `TiersEditor`, `SpreadEditor`) | src/app/ops/pricing/CatalogEditor.tsx | Keep commit logic; restyle rows as DataTable with an overflow container; move `AddItem`/new category into Drawer |
| `LinkRow`, `ReleaseReveal`, `InviteOutcome`, `NewInviteReveal` | [publicId]/page.tsx:388-457; proposals/page.tsx:43-59 | Replace with SecureAccess primitive; keep cookie parsing |
| Status maps (4×) | see §11 | Replace with one `StatusChip` |
| Local `Panel`, `Field`, `Empty`, `StatusPill` | clients/[orgId]/page.tsx:254-270; settings/page.tsx:89-91 | Replace |

---

## 13. Ranked list — shared primitives to build

Ranked by how many pages/failures each one retires. Each should live under `src/components/ops/` with a single `ops.module.css` carrying the brief's `--ops-*` tokens.

1. **Ops tokens + `OpsShell` v2** (`ops.module.css`, `OpsShell`, `PageHeader`) — fixed 252px light sidebar with 150–180px wordmark, OPERATIONS label, PRODUCTION badge, live dot; centred 1680 canvas with `clamp(24px,3vw,48px)`/32px padding; utility bar; header with title 36/40 w800, subtitle slot (≤700px), actions, and a KPI-row slot. Retires the subtitle hacks and F1/F7/F8 root causes on all 10 pages. Keep `signOut` and `MODULES`.
2. **`StatusChip`** — one mapping for the 12 brief statuses (plus legacy `sent/viewed/draft/won/lost/withdrawn/revoked` folding, see dashboard L52-53), 11–12px w600 limited-uppercase. Replaces 4 StatusPill copies and `.chip*` usage on dashboard, clients detail, proposals, proposal detail, preview.
3. **`KpiCard` / `KpiRow`** — icon container, 11–12px label, 30–38px tabular value (wraps `EstimateFigure`/`compactUsd`), context line; `minmax(220–250px,1fr)`, min-height 118–132. Used by dashboard metrics (L56-86), proposals summary strip (L82-86), clients/projects/pricing headers.
4. **`Panel` + `SectionTitle`** — content panel min-height 260, padding 26, header row (19–22px title, summary, action slot). Replaces the 3 local `Panel`s, `.panel .panelPad`, and every hand-built `<section>` in [publicId]/page.tsx, design, settings.
5. **`EntityRow` / `EntityCard`** — 116–148px row: identity (avatar/initials, name, meta) · status chip · commercial (tabular money, nowrap) · engagement · actions (overflow menu). For clients, projects, proposals lists, dashboard review queue/engagement, client-detail proposals/contacts/projects. Retires F5 on list rows and the 9px ghost buttons.
6. **`Drawer`** (client, right-side wizard) — hosts the existing server-action forms unchanged: `newClient`, `addContact`, `addProject`, `addNote`, `NewProposalForm`, per-project create proposal, `AddItem`/new category, invite contact. Retires every F2.
7. **`SecureAccessSummary`** — one line ("3 links · 2 verified · last seen 2h ago · expires …") that expands to a panel listing recipients, policy, state, Revoke, and a "New link" form; **never renders `/e/{token}` text or hrefs**; one-shot reveals (`podos_release`, `podos_new_invite`) become a copy-to-clipboard control inside a Notice. Retires all F4 on proposals list, proposal detail, and the reveal banners.
8. **`Button` / `IconButton` / `Field` (`Input`, `Select`, `Textarea`, `Checkbox`)** — 44px min, 14px w600, 12px radius, gradient primary with lift/press and reduced-motion; labels 12px w600 non-tracked. Replaces the 14 inline `mono/btn/ghost/input/cell/field` objects (§11) and `.btn*` on ops pages.
9. **`Notice`** (ok / warning / danger / info, optional dismiss action) — unifies AdminResult, ReleaseReveal (incl. "blocked"), NewInviteReveal, InviteOutcome, design result banner, preview Readiness.
10. **`DataTable`** — semantic table, 12–13px w600 header (not uppercase-tracked), tabular numeric cells, `overflow-x:auto` wrapper, row-hover. For LineItemEditor, CatalogEditor (fixes the un-wrapped 7-column grid), TiersEditor, and any dense list where EntityRow is too tall.
11. **`Money`** — `usd`/`compactUsd` with `tabular-nums; white-space:nowrap`, compact variant for summaries (brief: nothing wraps in currency). Used everywhere money prints (dashboard L93/L101/L143, clients L72, client detail L134, proposals L119, detail L277, LineItemEditor L100/L204, CatalogEditor price cells).
12. **`Disclosure`** — styled `<details>/<summary>` (16–18px title, summary text, chevron) for ProposalSettings, DesignPanel, Client details, LineItem row extras, design prompt, ConfirmDelete popover trigger.
13. **`EmptyState`** — panel-level empty (icon, 16–18 title, 15 body, CTA) replacing bare 13–14px paragraphs (clients L51, projects L32, client detail `Empty` L261, dashboard L114/L146/L157/L173, detail L290/L350).
14. **`ActivityList`** — event · actor · relative time (+ note callout) shared by dashboard (L115-123) and proposal detail (L349-362); one `ago()` helper.
15. **`PageIntro`** — subtitle ≤700px in the header slot; replaces the 760px/80ch paragraphs on design (L35) and pricing (L36) and the negative-margin subtitles.
