# PODOS AI — Brand Voice

Derived from the copy actually shipped in `src/data/siteContent.ts`, `src/data/investContent.ts`, `src/data/investOffering.ts`, and the mounted homepage components (`src/components/site/*`), plus the voice rules relayed from the master brief (answer-first, no hype words, no exclamation marks, banned-phrase list).

> Note: the master brief document itself is not in this repo. The rules below marked **[brief]** were relayed by the founders; the rules marked **[observed]** are derived from live copy. The brief's full banned-phrase list is **unknown** — only the phrases evidenced below are listed.

## Core stance

PODOS copy reads as system output, not marketing. The layout comment in `src/app/layout.tsx` states the intent directly: "Every glyph reads as system output, not marketing." Engineering-document register: nameplates, spec sheets, blueprint callouts, mono eyebrow labels.

## Rules

### 1. Answer-first **[brief + observed]**
Lead with the conclusion, then support it. Every headline in the live copy states the answer before the explanation:

- "Weeks, not years." (`siteContent.ts`, whyPoints)
- "Heat is a solved problem." (`siteContent.ts`, whyPoints)
- "Built, not just pitched." (`investContent.ts`, EVIDENCE)
- "Years of construction, or months of manufacturing." (`investContent.ts`, OPPORTUNITY)

Body copy follows the same shape: claim first, mechanism second. "PODOS pods are factory-assembled and tested before shipment. Site preparation is minimal."

### 2. No exclamation marks **[brief + observed]**
Zero exclamation marks exist anywhere in the shipped copy (verified by grep across `src/data` and `src/components`). Never add one.

### 3. No hype words **[brief + observed]**
The live copy contains none of: revolutionary, game-changing, cutting-edge, world-class, unprecedented, disruptive, best-in-class, state-of-the-art (verified by grep). Intensity comes from numbers and contrast ("90 DAYS" vs "3–5 YEARS"), never from adjectives.

### 4. Numbers carry the argument — with qualifiers attached **[observed]**
Every figure ships with its epistemic label, in-line, at the point of use:

- "90 DAYS — PODOS target" vs "3–5 YEARS — industry estimate" (`investContent.ts`, OPPORTUNITY)
- "Deployment timelines shown are PODOS targets." (FILM footnote)
- "Illustrative scale model of the modular architecture — not a representation of current deployments." (SCALE disclaimer)
- "Magnified for visibility — the number is the truth." (OWNERSHIP)

Never publish a number without its qualifier. The qualifier vocabulary is fixed: `target`, `estimate`, `verified`, `conceptual` (the `status` field in `investOffering.ts`).

### 5. Short declaratives; deliberate fragments **[observed]**
"Modular AI data center pods. Deployable in weeks. Built for scale." Sentence fragments are used as verdicts, not decoration. Average sentence length in body copy is short; subordinate clauses are rare.

### 6. Design-intent language for anything unbuilt **[observed]**
Unshipped capability is always framed as design, not fact: "designed to deploy", "designed as a standardized 1-MW building block", "engineered for", "planned allocation categories". See `terminology.md` for the full qualifier rules.

### 7. Plain-language honesty about limits **[observed]**
The copy names its own uncertainty rather than hiding it: "Exploration mode — the official offering structure has not been published." / "Renders explain the vision." Keep this register: state what is not yet true as plainly as what is.

## Banned phrases (evidenced)

The brief's full banned-phrase list is **unknown** (document not in repo). The following are banned based on rules encoded in the codebase and the observed copy:

- Any hype adjective listed under rule 3.
- "partner" / "partnership" for any relationship at discussion stage — `investOffering.ts` comment: "never describe a discussion as a partnership". Approved phrasing is "in active discussions with".
- "guaranteed", "guarantee" applied to returns, timelines, or performance — LEGAL: "Figures identified as targets or estimates are not guarantees."
- Any phrasing that presents a render as a photograph, deployment, facility, or customer installation — LEGAL paragraph 4.
- Exclamation marks (rule 2).

## Register by surface

- **Eyebrows / labels**: ALL-CAPS mono, telegraphic ("THE DIAGNOSIS", "PRODUCT LADDER", "1 MW · UNIT").
- **Headlines**: sentence case, answer-first, often two-part contrast.
- **Body**: plain, mechanism-focused, no first-person singular; "we" is used sparingly (founder statement only).
- **Legal / disclosure**: complete sentences, unhedged about risk ("including illiquidity and the possible loss of your entire investment").
