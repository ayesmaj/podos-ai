# PODOS AI — Banned Claims

What may never be published, and what is gated until approval. Sources: the interest-mode securities restrictions encoded in `src/data/investOffering.ts`, the live disclosure language in `src/data/investContent.ts` (LEGAL), and the absolute prohibitions relayed from the master brief.

> The master brief document is not in this repo. Its full prohibition list beyond what is encoded below is **unknown** — extend this file when the brief text is supplied. Everything below is evidenced in the codebase.

## Securities — hard-gated while `offeringStatus === "interest"`

`src/data/investOffering.ts` runs the /invest page in interest mode (`termsApproved: false`, `termsVersion: "0.1-interest"`). Until founders flip to `"live-offering"` **and** `termsApproved === true` **and** real terms exist (`termsLive()`), the following may NEVER appear in any published content:

1. **Security type** — what an investor would actually buy.
2. **Price per security / share price.**
3. **Pre-money or post-money valuation.**
4. **Fully-diluted share count or any ownership-percentage math.**
5. **Maximum raise.**
6. **Any transaction portal URL** — "transactions are completed through an approved investment intermediary or portal — never directly on this page" (FAQ).
7. **Binding commitments** — everything is "Interest stage — non-binding" (HERO accessModule).

Live disclosure language that must accompany any investment-adjacent copy (LEGAL, `investContent.ts`):
- "Nothing on this page constitutes investment, legal, or tax advice, or an offer to sell or a solicitation of an offer to buy securities."
- "Any offering is made only through official offering documents, which supersede everything shown here."
- "Figures identified as targets or estimates are not guarantees."

### Derived bans
- No promised, projected, or implied returns, yields, exit multiples, or revenue figures. (None exist anywhere in the shipped copy; CAPITAL section deliberately stops at "Capacity creates the platform for revenue.")
- No allocation percentages — "Percentages will be published with official offering documents" (CAPITAL).
- No eligibility promises — "Eligibility depends on your jurisdiction and the final offering structure" (FAQ).
- Minimum investment may only be phrased as the **planned** entry point ($1,000), with "Final minimums are defined by the official offering documents."

## Relationships

Encoded in `investOffering.ts` (collaborations):

- **Never describe a discussion as a partnership** (verbatim code comment). Both current relationships are `status: "discussion"`.
- Only the exact `approvedPublicStatement` sentence may be rendered for a relationship — no paraphrase that upgrades it.
- **No partner naming** — `partnerNamePublic: false` on every entry; use the approved anonymous labels only.
- Status/statement upgrades happen "ONLY with founder authorization".
- Banned words for these relationships: partner, partnership, signed, contract, customer, client, LOI, MOU, pilot — unless the registry status and statement are upgraded first.

## Evidence & proof

- **No customer claims** — the CUSTOMERS evidence module is `approvedForPublicUse: false` with an empty statement.
- **No prototype claims** — PROTOTYPE module is unapproved.
- **No IP/patent-portfolio claims on /invest** — IP module is unapproved. (Note: the homepage team bio currently states "76+ patent claims … inventor of record on every USPTO filing" — see `approved-facts.md`; do not extend this claim to new surfaces without verification.)
- **Renders are never proof** — AI renders are "automatically labeled CONCEPT on the card, never shown as proof" (`investOffering.ts`), and LEGAL states imagery "depict[s] design intent, not completed deployments, facilities, or customer installations." Banned: presenting any render, film frame, or scale model as a photo of a real deployment.
- **No certifications, test results, or compliance claims** — none exist in the approved registries; anything of this kind is needs-approval by default.

## Numbers

- No number without its qualifier (target / estimate / verified / conceptual) — see `terminology.md`.
- No new market statistics outside the approved `claims[]` registry (currently: 10× compute-demand growth [industry estimate], 3–5 years traditional buildout [industry estimate], 90-day PODOS deployment target, 1-MW unit capacity target).
- The scale ladder (1 → 10 → 100 → 1,000 units) may only appear with its disclaimer: "Illustrative scale model … not a representation of current deployments."

## Product names

- **Optimus** and **MEGA SILO**: not publishable until founder approval (brief rule; see `terminology.md` for the current live-site conflict that needs resolution).

## Process rule

`investOffering.ts` is "the single source of truth for everything on /invest that could be a material claim … NOTHING financial or relational is hardcoded in JSX." Any new material claim must be added to that registry with `approvedForPublicUse` set by a founder — never written directly into copy.
