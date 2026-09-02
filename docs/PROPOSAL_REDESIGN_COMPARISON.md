# Proposal Redesign — Comparison Report

Date: 2026-09-01 · Test case: PODOS-1002 (POD-EST-2026-0002), rendered in design-preview mode (real numbers, placeholder text masked).
Direction (founder, 2026-09-01): **one classic estimate sheet, like the ACP client estimate page, in PODOS style** — replacing both the old six-page react-pdf export and the interim three-page minimal layout.
Evidence: `docs/proposal-qa/` (PDF + 150 DPI page renders + desktop/mobile web captures; regenerate with `node --env-file=.env.local scripts/proposal-qa.mjs <publicId> <formal|preliminary>`).

## Before → after

| | Before | After |
|---|---|---|
| Renderer | `@react-pdf/renderer` (own layout engine) + a separate scrolling web document | **One** flowing sheet (`EstimateSheet`) — the client page, the admin preview and the PDF are the same DOM; headless Chrome prints it (Letter, `@page` margins, page numbers in the margin box) |
| Page count (5 items) | 6 sparse pages | **1 page**; longer item lists flow naturally with the table header repeated |
| Anatomy | cover / summary / spec / items / terms / signature, price repeated 4× | header band (logo · PROPOSAL/ESTIMATE · no · date · valid until) → status banner → PODOS vs PREPARED FOR → project + proposed-system image → grouped item table + total summary → optional add-ons → notes · warranty · signature → trust band → footer with hash |
| Client interaction | download only | add-on toggles (until signed, totals recompute in the DB), Accept & Sign with consent, "Not ready?" change request with reason, message history, sticky mobile action bar |
| Data safety | none — `gsg` / `33333 MW` / `fff` printed and signed | `validateProposalForRelease()` blocks release; invalid proposals render as a watermarked design preview with masked text; names proper-cased |
| Typography | Helvetica fallback | Geist 800 display (letter-spaced document title, group labels, numbers), Inter Tight text, tabular numerals |
| Design control | none | `estimates.design` + Proposal Design panel: document type, watermark, validity, product image, summary/notes/warranty/trust sections, signature line, download/comments permissions |
| Integrity | none | footer hash on the sheet, `X-Document-SHA256` on every PDF, immutable PDF bytes + sha stored per released version (`/api/proposal/[id]/pdf/stored`) |
| Assets | 2 static files | product image (GPT Image 2 edit of the approved pod render) regenerable from `/ops/design`; two more controlled assets kept for future documents |

## QA results (final render)

| Mode | PDF pages (Chrome) | PDF pages (API route) | Web overflow 1440 / 390 |
|---|---|---|---|
| proposal (formal) | 1 | 1 | none / none |
| estimate (preliminary) | 1 | 1 | none / none |

Iterations on the renders: (1) five items spilled to two Letter pages → print type scale 10.5px, tighter paddings, narrower summary column; (2) mobile table side-scrolled with prices hidden → rows become stacked cards (number + description, then qty × unit price and total); (3) footer line orphaned on page 2 → header/body/trust spacing trimmed, footer kept with the trust band.

## Known limits / follow-ups

- PODOS-1002 stays a design preview until its placeholder data is corrected (or it is reopened/voided and rebuilt). The release action refuses it.
- Signature is typed (name + title + consent), recorded against the verified viewer session. A drawn-signature canvas would need a new DB column and RPC.
- The client's add-on toggles submit to the server (totals recompute in the DB and the page re-renders); there is no optimistic client-side total yet.
- `OPENAI_API_KEY` must exist in the Vercel environment for `/ops/design` regeneration; without it the action reports "not configured" and the shipped assets keep being used.
