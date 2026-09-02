# Proposal Redirection Audit

Date: 2026-09-01 · Scope: the proposal document (web preview + PDF) for every proposal the platform produces.
Founder direction: **the new design is universal — one document system for all PDF outputs** (preliminary estimate, formal proposal, client download, admin preview). No second look survives.

## 1. What exists today

| Layer | Current | Problem |
|---|---|---|
| Web document | `src/components/private/ProposalDocument.tsx` — one long scrolling page, CSS Modules | Not paginated; no relationship to what the PDF prints; hero image is a menu illustration |
| PDF | `src/lib/proposals/ProposalPdf.tsx` via `@react-pdf/renderer` 4.3.1, rendered in `/api/proposal/[publicId]/pdf` | **6 sparse pages** (cover, summary, spec, items, terms, signature); repeats the price range on 4 pages; react-pdf has no CSS Grid, no real SVG filters, brittle font embedding; layout drifts from the web view |
| Data mapper | `src/lib/proposals/document.ts` → `DocData` (shared by web + PDF) | Good — kept as the single source |
| Assets | `src/lib/proposals/assets/{logo.png,pdf-cover-pod.png}` | Only two; no cutaway, no deployment visual, cover pod is small |
| Validation | none | A proposal can be released and **signed** with junk data |
| Design settings | none | No per-proposal control of sections, visuals, signature, watermark |

## 2. PODOS-1002 (POD-EST-2026-0002) — the live test case

Status `client_signed`, mode `client_configured`, 13 saved steps, 5 line items, published range **$6,285,750 – $8,504,250**.

Values that must never print (all real rows, entered during testing):

| Field | Stored | Verdict |
|---|---|---|
| site.site_name | `gsg` | placeholder (no vowels, 3 letters) |
| site.address | `sg` | placeholder (< 3 letters) |
| project.required_capacity_mw | `33333` | not credible (> 1000 MW) |
| project.project_name | `fff` | placeholder (repeated char) |
| organization.name / contact name | `rafael smadja` | real, but all lowercase → render in proper case |

**State problem:** the proposal is already *signed* with these values. The signature is legally meaningless against placeholder scope. Recommendation: the founder reopens/voids PODOS-1002 (or creates PODOS-1003 with real inputs). Until then it renders **only** in a watermarked design-preview mode ("DESIGN PREVIEW — SAMPLE VALUES") that keeps the real numbers and masks placeholder text as "Pending engineering review". Design preview can never be released.

## 3. Redirection

1. **One paginated document component** (`ProposalPrint`) with two page modes — `preliminary` (≤ 2 pages) and `formal` (exactly 3 pages, optional appendix only when line items overflow) — rendered at `/ops/proposals/[publicId]/print` and a client-safe `/client/proposals/[publicId]/print`. A4 in millimetres, `@page { size: A4; margin: 0 }`, CSS Grid, inline SVG backgrounds. Same component drives the on-screen viewer (scaled pages) so preview = print.
2. **PDF = headless Chrome printing that route** (`puppeteer-core` + `@sparticuz/chromium` on Vercel, system Chrome locally). `@react-pdf/renderer` is removed; there is no fallback renderer because a fallback would be a second design.
3. **`validateProposalForRelease()`** (`src/lib/proposals/validate.ts`) gates release and formal rendering: errors block, warnings show. Placeholder detection, capacity/pod ranges, dates, internal-wording leak, totals reconciliation against the server snapshot.
4. **Controlled assets** generated once with GPT Image 2 *edits* of the approved pod render (`scripts/generate-proposal-assets.mts`, prompts in `src/lib/proposals/imagePrompts.ts`): cover hero (portrait), technical cutaway (landscape), deployment visual (landscape). No text in images; wordmark composited in code. Regeneration only through the admin tool.
5. **`estimates.design` jsonb** + `set_proposal_design` RPC: page mode, visuals on/off, section toggles, signature, validity override, watermark, download/comments permissions.
6. Typography stays **Geist (display) + Inter Tight (text)** — founder rule: no monospace family. Tabular figures for every number.

## 4. Kept / removed

- Keep: `document.ts` mapper, money helpers, menu manifest, the client/admin routing and auth model, `ProposalDocument.tsx` web view until the paginated viewer replaces it (then delete).
- Remove: `ProposalPdf.tsx`, `@react-pdf/renderer`, `assets/pdf-cover-pod.png` (superseded by generated cover).
- Add: print route, PDF service, validator, design settings, asset generator, QA render script (200 DPI page inspection).
