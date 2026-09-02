# PODOS Operations — Redesign Report

Date: 2026-09-02 · Scope: every `/ops` route · Brief: "Universal page, panel, card and category-window design system" (founder, 2026-09-02).
Benchmark: the dashboard composition (large KPI cards, connected pipeline, 8/4 panels). Rejected: the old proposals page (narrow, inline creation form, exposed secure links, tiny letter-spaced labels).

## What was built

| Phase | Output |
|---|---|
| 1 · System | `docs/ops-design/` — UI audit (10 pages, every failure cited file:line), layout tokens, typography, card system, status system, page archetypes, 21st.dev component sources (shell, KPI, pipeline, entity rows, chips, timeline, drawer, wizard, toolbar), primitives plan |
| 2 · Benchmark screens | `src/components/ops/ui/` — tokens (`ops-tokens.css`), shared classes (`ops.module.css`), server primitives (`index.tsx`: AppShell, PageHeader, KpiCard/KpiGrid, Panel, StatusChip, Pipeline, Toolbar, EmptyState, Skeleton, Notice, Avatar/Cell), client `Drawer`, `status.ts` (one status → chip map, pipeline stages). `/ops`, `/ops/proposals` (New Proposal wizard drawer, collapsible Secure Access), `/ops/clients` (New Client drawer) rebuilt |
| 3 · Apply | `/ops/clients/[orgId]` (detail archetype, all forms in drawers), `/ops/projects`, `/ops/proposals/[publicId]` (editor archetype: status strip, 7/5, featured totals, release checklist wired to the real validator), `/ops/pricing` (category rail, product cards, tier editor), `/ops/design` (large live preview), `/ops/settings` (3/9 sub-nav), `/ops/login`, loading skeletons |

Everything renders real data from the existing RPCs; no metric, trend or record was invented. Every server action, form field, guard and redirect was preserved (verified by the audit's preserve lists and the final QA pass).

## QA evidence

`scripts/ops-qa.mjs` (headless Chrome, admin session) over nine routes × 1920 / 1440 / 1366 / 390:

| Check | Result |
|---|---|
| HTTP status | 200 on all 36 captures |
| Horizontal overflow | none |
| KPI values wrapping | none |
| Console errors | none (the design-page preview frame required allowing same-origin framing of the print route in `src/proxy.ts`) |
| `tsc --noEmit` | clean |
| `eslint src/app/ops src/components/ops src/proxy.ts` | clean |
| `next build` | passes |

Visual review (QA director + founder-facing spot checks) fixed: logo collapsing to 0 px under 1024 px, mobile dashboard names breaking per letter, ragged KPI rows (container queries: 6 across ≥1380 px canvas, 5 for five cards ≥1040 px, 3×2 on 1440-class), labels wrapping at 1920 (shorter KPI labels), sub-11 px letter-spaced controls (ConfirmDelete, badges), settings grid leaving the right quarter empty, validator false positive on "internal loop".

## Acceptance criteria (brief §35)

| # | Criterion | Status |
|---|---|---|
| 1–4 | Same shell, typography scale, spacing, centered 1680 px max width on every route | Met |
| 5–7 | Large readable cards, no KPI wrap, no spreadsheet look | Met (catalog uses product cards; projects/clients/proposals use entity rows) |
| 8–9 | No inline creation forms; creation in drawers/wizards | Met (proposal wizard, client drawer, contact/project/note/edit drawers) |
| 10 | Secure access in expandable panels, no raw tokens | Met (one-time reveal after issuing a link remains, styled as a notice) |
| 11–12 | Proposals page matches the dashboard; Clients page not mostly empty | Met (right rail carries attention / top accounts / activity) |
| 13–15 | Official logo, bright design, disciplined cobalt/cyan | Met |
| 16 | 21st.dev components fully restyled | Met (sources logged in `COMPONENT_SOURCES_*.md`; nothing pasted verbatim) |
| 17 | Empty and loading states per category | Met (EmptyState per route, loading.tsx skeletons for dashboard, proposals, clients, projects) |
| 18–19 | Functionality preserved, no console errors | Met |
| 20 | Looks custom-designed for PODOS | Founder review |

## Known limits / next

- Engineering Review, Signatures, Activity, Users & Roles are still "Soon" in the sidebar: they need data models (assignments, signature provider, users) that do not exist yet; the queue archetype is specified in `OPS_PAGE_ARCHETYPES.md` §6.
- Line-item price inputs are plain numbers (no thousands grouping while typing).
- The proposal editor's right rail is not sticky (long line-item lists scroll past the totals panel).
- Command search (⌘K), saved views, density toggle and CSV export from the brief's toolbar are not built.
- The ops app is a desktop tool; under 1024 px the sidebar becomes a wrapped top strip (usable, not a drawer).
