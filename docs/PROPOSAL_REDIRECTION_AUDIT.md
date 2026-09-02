# Proposal Redirection Audit

Date: 2026-09-01 · Scope: the proposal document (web + PDF) for every proposal the platform produces.
Founder direction (final, same day): **one document design for every PDF**, and that design is **a classic single estimate sheet like the ACP client estimate page, in PODOS style** — not a multi-page brochure.

## 1. What existed

| Layer | Before | Problem |
|---|---|---|
| Web document | `ProposalDocument.tsx` — long scrolling page | Not the document the PDF printed; hero image was a menu illustration |
| PDF | `ProposalPdf.tsx` via `@react-pdf/renderer` | 6 sparse pages, price repeated on 4, no CSS Grid/SVG, brittle fonts, drift from the web view |
| Data mapper | `document.ts` → `DocData` | Good — kept as the single source |
| Validation | none | A proposal could be released and **signed** with junk data |
| Design settings | none | No per-proposal control |

## 2. PODOS-1002 (POD-EST-2026-0002) — the live test case

Status `client_signed`, 13 saved steps, 5 line items, published range $6,285,750 – $8,504,250. Values that must never print (entered during testing): site `gsg`, address `sg`, capacity `33333` MW, project `fff`; org/contact `rafael smadja` (real, lowercase). The proposal is already signed against this scope, so it renders only as a watermarked **design preview** (real numbers, placeholder text masked) and the release action refuses it until the data is corrected or the proposal is rebuilt.

## 3. What was built

1. **`EstimateSheet`** (`src/components/print/EstimateSheet.tsx` + `estimate-sheet.css`): one flowing sheet — header band, status banner, parties, project + proposed-system image, grouped item table + total summary, optional add-ons, notes / warranty / signature, trust band, footer hash. Same DOM on `/client/proposals/[id]/proposal`, `/ops/proposals/[id]/preview`, both `/print` routes and the PDF. Responsive (rows become cards under 760px); Letter print with `@page` margins and page numbers.
2. **PDF = headless Chrome printing the print route** (`src/lib/proposals/pdf.ts`; `@sparticuz/chromium` on Vercel, traced via glob keys in `next.config.ts`). No second renderer.
3. **`validateProposalForRelease()`** gates release and drives design-preview masking (`src/lib/proposals/validate.ts`); `render.ts` builds the one model every surface uses (validate → mask → design → assets → hash).
4. **`estimates.design` + Proposal Design panel** (`design.ts`, `DesignPanel.tsx`, `set_proposal_design`).
5. **Client interaction** (from the ACP map): add-on toggles → `client_select_optional` (recomputes totals in the DB), Accept & Sign with consent → `sign_via_session`, change request with reason + message history → `client_comment` / `client_comments`, sticky mobile action bar.
6. **Immutable PDF per released version**: `record_proposal_pdf` stores bytes + sha at release; `/api/proposal/[id]/pdf/stored` serves it to admins.
7. **Controlled visuals**: product image (GPT Image 2 edit of the approved render), regenerable at `/ops/design` (DB store + `/api/proposal-assets/[type]`).

## 4. Removed

`ProposalPdf.tsx`, `@react-pdf/renderer`, `ProposalDocument.tsx`, the interim `ProposalPrint`/`PrintViewer` paginated layout, `src/lib/proposals/assets/*.png`.
