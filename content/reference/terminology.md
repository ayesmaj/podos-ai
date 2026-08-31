# PODOS AI — Terminology & Naming

Canonical naming for all published content. Sources: shipped copy in `src/data/*.ts`, mounted components in `src/components/site/*`, and naming rules relayed from the master brief.

## Canonical names

| Term | Refers to | Status |
|---|---|---|
| **PODOS AI** | The company and the overall platform | Publishable |
| **PODOS** | Short form of the company/platform in product and system contexts (used alone throughout /invest) | Publishable |
| **PODOS Pod** | The hardware unit — the factory-built 1-MW modular unit | Publishable |
| **Syntropic** | The software layer (compression) | Publishable name; see restrictions below |
| **Optimus** | Internal hardware identity | **NOT publishable until approved** |
| **MEGA SILO** | 20-MW cluster product concept | **NOT publishable until approved** |

### Restriction detail — Optimus and MEGA SILO

Per the brief: neither name may appear in new published content until founder approval. **Known conflict:** both names currently appear on the live homepage —

- `src/components/site/MeetTheTeam.tsx` (Josef Elimelech bio: "Technical architect of PODOS Pod, MEGA SILO, Syntropic, and Optimus")
- `src/components/site/ProductShowcase.tsx` (MEGA SILO product card, mounted inside `PodosPod.tsx`)
- `src/components/optimus/OptimusInteractive.tsx` (mounted inside `PodosPod.tsx`; note `src/lib/optimusComponents.ts` says its numerical specs are "placeholder estimates … verify against the real Solar Freight datasheet before launch")

Resolve with founders: either the restriction is lifted for these placements, or the placements come down. Do not propagate either name into new copy in the meantime.

### Syntropic

The software pillar (`PodosPod.tsx` comment: "SYNTROPIC (next section) is the SOFTWARE pillar"). The dedicated Syntropic section component is not currently mounted on any page; the only live public mention is the team bio and the hero line "Compression software + modular pod hardware in one company." (`HeroVideoNarrative.tsx` — a code comment there flags this line as possibly contradicting an earlier "PODOS-only public-website cleanup"; verify intent before reusing).

## Capitalization rules

- **PODOS AI** — always both words in caps; never "Podos", "podos AI", or "PodosAI". The domain is written `podosai.com`.
- **PODOS Pod** — prose form. Display/spec-sheet contexts use full caps "PODOS POD" (product card, `ProductShowcase.tsx`). Lowercase "pod"/"pods" is correct for generic references to the units ("PODOS pods are factory-assembled…").
- **Syntropic** — capital S, one word. The related site is written `thesyntropic.com`.
- **MEGA SILO** — two words, all caps (as in the team bio and product card). Not publishable regardless (see above).
- Eyebrow/label text is ALL-CAPS mono by design system convention ("PRODUCT LADDER", "1 MW · UNIT"); this is typography, not naming.

## The 1-MW unit phrasing

- **Adjectival (hyphenated):** "a standardized 1-MW building block" — the canonical formulation, used in `investContent.ts` FAQ and `investOffering.ts` (unit-capacity claim).
- **Standalone measurement (space, no hyphen):** "1 MW", "20 MW", "100 MW". Scale math is written "10 × 1 MW" (multiplication sign, spaces) — `investContent.ts` SCALE.
- The 1-MW capacity is a **target** (`status: "target"`, `internalTarget: true` in `investOffering.ts`): phrase as "designed as a standardized 1-MW building block", never "delivers 1 MW".

## "Target" qualifier rules

Encoded in `src/data/investOffering.ts` (`PublicClaim.status`) and applied throughout the shipped copy:

1. Every PODOS-internal number that is not yet demonstrated carries **"target"** at the point of use: "90 DAYS — PODOS target", "the target window from order to operation is 90 days", "PODOS DEPLOYMENT TARGET".
2. Third-party/market numbers carry **"estimate"** with a source register: "3–5 YEARS — industry estimate", "Industry estimate" sourceLabel.
3. **"verified"** is reserved for claims with real backing (currently only the TEAM evidence module).
4. **"conceptual"** labels renders and visualizations; AI renders are auto-labeled CONCEPT and "never shown as proof".
5. Blanket rule from LEGAL: "Figures identified as targets or estimates are not guarantees." Never drop the qualifier when reusing a number.
6. Homepage figures that differ from the invest-page target (e.g., "90–120 days" on the homepage spec sheet vs the "90 days" PODOS target on /invest) must not be merged or averaged in new copy — use the invest-page claim registry (`investOffering.ts` `claims[]`) as the source of truth and flag the discrepancy for founder resolution.

## Relationship language

- Approved formulation: "In active discussions with …" (the exact `approvedPublicStatement` strings in `investOffering.ts` are the ONLY sentences renderable for each relationship).
- Partners are never named publicly at this stage (`partnerNamePublic: false`); use the approved public labels ("a major California utility", "a leading provider of server, rack, and communications infrastructure").
- Never "partnership", "partner", "signed", "customer", or "pilot with" for a discussion-stage relationship.
