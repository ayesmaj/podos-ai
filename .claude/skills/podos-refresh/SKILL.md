---
name: podos-refresh
description: Use when updating an existing podosai.com page from Search Console data or because a cited source changed. Preserves URLs and intent, re-verifies every citation, and refuses cosmetic freshness edits.
---

# podos-refresh

Update a page that already exists. The default action is **no change** —
editing a page that is working is a way to lose rankings, not gain them.

## Refresh only for a real reason

Valid triggers:
- A cited source published new figures, or a URL rotted.
- The page's `Last verified` date is past its 60/90-day review.
- Search Console shows the page ranking for a query it does not actually
  answer (an intent mismatch worth fixing).
- A claim in `src/content/data/claims.ts` changed status — for example a
  number moved from `blocked-needs-approval` to `publishable`, or the
  reverse, which is urgent.
- A factual error.

Not valid: "make it fresh", "add keywords", rewriting because the page is
old. **Do not change pages just to appear updated.**

## Rules

1. **Preserve the URL** unless the intent genuinely changed. If it must
   move, 301 the old URL and record it in `docs/seo/redirect-map.md`.
2. **Preserve the intent.** One URL, one query. If new material serves a
   different intent, it belongs on a new page.
3. **Re-verify every citation.** Fetch each source URL. Replace rotted
   links, update figures that changed, and correct the surrounding text —
   never leave a stale number under a live citation.
4. **Re-check claims.** Every `data-claim` id must still be
   `publishable: true` with its qualifier intact. If a claim was revoked,
   remove the number from the page immediately.
5. **Update `Last verified`** and note materially changed facts. Silent
   edits to substantive claims are not acceptable.

## Workflow

1. Pull the page's queries, impressions, clicks, and position. Record the
   baseline before touching anything.
2. Read the page and list what is actually wrong. If the list is empty,
   update `Last verified` and stop.
3. Fix the specific problems. Keep the diff small and legible.
4. Re-run `tsc`, `eslint`, `npm run verify:seo`.
5. Record what changed and why in the page's update note, and re-measure
   after ~30 days against the baseline.

## Judging the result

Rankings alone are a poor signal. Look at whether the page now answers
the query it ranks for, and whether qualified inquiries improved.
