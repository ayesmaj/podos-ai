---
name: podos-news
description: Use ONLY for real, approved PODOS company announcements under /newsroom. Requires an approved announcement, a named spokesperson, exact dates, and a media contact. Never for analysis or speculation.
---

# podos-news

Publish a company announcement. This skill has the narrowest gate on the
site because a newsroom post is a public factual assertion about the
company.

## Refuse to publish unless ALL of these exist

- [ ] A written, founder-approved announcement — not an inference from a
      deck, a chat message, or an internal doc.
- [ ] A **named spokesperson** with an exact title, approved for quoting.
- [ ] **Exact dates.** No "recently", no "coming months".
- [ ] A media contact (name or address) that is monitored.
- [ ] For anything involving another organisation: written confirmation
      that they approve being named, in the exact wording used.

If any box is unchecked, stop and tell the founder what is missing. Do
not soften the claim to make it publishable.

## Absolutely never

- Invented partnerships, customers, deployments, or funding.
- Upgrading a relationship: a discussion is not a pilot, a pilot is not a
  partnership, an LOI is not a contract. Use the exact approved level
  from `src/data/investOffering.ts` collaboration statements.
- Naming a counterparty that has not approved being named. The house
  pattern is the unnamed public label ("a major California utility").
- Certification language (HIPAA, SOC 2, ITAR, FedRAMP, UL) unless the
  certificate exists and is in hand.
- Forward-looking financial statements or anything resembling an offer of
  securities — that belongs to the offering documents and counsel.

## Implementation

- Route under `/newsroom/<slug>`; server component, design lock applies.
- `NewsArticle` JSON-LD is permitted **here only**, and only for genuine
  current news. Analysis uses `TechArticle` via `podos-insight`.
- Include dateline, spokesperson quote, boilerplate, and media contact.
- Company numbers still come from the claims register with qualifiers.
- Register the route, then run `tsc`, `eslint`, `npm run verify:seo`.

## After publishing

News decays into archive. Keep the URL stable, never rewrite history to
match later events; if something changes, publish a follow-up and link
the two.
