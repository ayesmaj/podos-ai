# PODOS AI — Approved Facts

Facts currently published on the live site (podosai.com, pages `/` and `/invest`), with their existing qualifiers, cited to the source file in this repo (main branch = deployed). **Anything not on this list is needs-approval before publication.**

Legend for the on-page qualifier column: the exact hedge/label the site attaches to the fact. Reuse the fact WITH its qualifier or not at all.

## Company / platform

| Fact | On-page qualifier | Where published |
|---|---|---|
| PODOS AI builds factory-built modular AI compute pods | none (declarative) | `src/app/layout.tsx` meta description; `src/components/site/Footer.tsx` tagline |
| "The integrated AI compute platform." / "Compression software + modular pod hardware in one company." | none | Homepage hero, `src/components/site/HeroVideoNarrative.tsx` (code comment flags the compression line for intent verification) |
| Contact: info@podosai.com; phone +1 (408) 718-9946 | none | `src/data/investContent.ts` CTA; Footer |
| Team: Josef Elimelech (Founder & Inventor), Jesse Ramirez (Real Estate Consultant), Rafael Smadja (Graphic Designer & Web) | none | `src/components/site/MeetTheTeam.tsx` |
| Josef Elimelech: "Creator of all 76+ patent claims across both platforms — inventor of record on every USPTO filing." | none | `MeetTheTeam.tsx` bio — published, but no backing registry entry (the IP evidence module on /invest is unapproved); verify before reuse on any other surface |

## Product — PODOS Pod (homepage spec sheet, `src/components/site/PodosPod.tsx`)

All rows appear as a manufacturer-nameplate spec sheet, no target/estimate labels attached on-page:

| Spec | Published value |
|---|---|
| Power | 1 MW per pod · 13.8 kV MV input |
| Compute | 128 GPUs per pod |
| Footprint | 720 sq ft · 12 × 60 ft · fully relocatable |
| Cooling | Closed-loop liquid · direct-to-chip · zero water |
| PUE | 1.08–1.12 (note: "hyperscaler avg 1.58") |
| Enclosure | "Thermos" · 6-surface foam + reflective barrier |
| Off-grid | Solar + battery + generator · no fiber or grid required |
| Heat recovery | ORC engine · 60–110 kW reclaimed per pod |
| Deploy | 90–120 days · "door to dashboard" |
| Manufacturing | California · shipped, not sited |
| Deploy timeline | D+0 order → D+30 factory complete → D+60 site + arrival → D+90–120 serving inference |

Caution: these homepage specs carry no qualifier, while /invest phrases capacity and timeline as targets ("designed as a standardized 1-MW building block"; "90 days — PODOS target"). For new content, prefer the /invest qualified phrasing.

## Product ladder (homepage, `src/components/site/ProductShowcase.tsx`)

| Fact | On-page qualifier | Note |
|---|---|---|
| PODOS POD: 1 MW, 128 GPUs, 720 sq ft, 90–120 days | badge "PILOT · VALIDATED" | No entry in the `investOffering.ts` claims/evidence registries backs "pilot" or "validated" — verify with founders before reuse |
| MEGA SILO: 20 MW cluster, 2,560 GPUs, hyperbaric N₂ 3–5+ atm, 24 pods in 20,000 sq ft, −83% footprint vs traditional DC | badge "Q4 2026 · TAKING LOIs" | Name is not publishable in new content (see `terminology.md`); "TAKING LOIs" has no registry backing — verify |

## Market framing (homepage, `src/components/site/ProblemDiagnosis.tsx`)

| Fact | On-page qualifier |
|---|---|
| Build timeline 3.2–4 years | "Industry median from broken ground to first MW serving inference." |
| Capex per megawatt $155–170 million | "Mostly concrete, substation, and cooling — not compute." (no source label on-page) |
| GPU memory useful 12–20% ("80–90% VRAM WASTED") | "The rest is duplication, KV-cache overhead, and idle VRAM." |
| Time-to-power 30–36 months | "Utility interconnect queue for a 100 MW+ greenfield site." |

No external sources are cited on-page for these four metrics — treat as needing source verification before reuse elsewhere.

## /invest — approved claim registry (`src/data/investOffering.ts`, all `approvedForPublicUse: true`)

| Fact | Status label | ID |
|---|---|---|
| ~10× projected growth in AI compute demand this decade | estimate · "Industry estimate" | `compute-demand` |
| 3–5 years typical traditional data-center buildout | estimate · "Industry estimate" | `traditional-buildout` |
| 90-day target window from order to commissioning | **target** · internal target | `podos-deployment` |
| Each unit designed as a standardized 1-MW building block | **target** · internal target | `unit-capacity` |

## /invest — offering facts (`investOffering.ts`, `investContent.ts`)

| Fact | On-page qualifier |
|---|---|
| Minimum planned entry: $1,000 | "planned entry point … Final minimums are defined by the official offering documents." |
| Status: interest stage, non-binding; no securities terms shown | "Exploration mode — the official offering structure has not been published." |
| Private company | none |
| Scale ladder 1 unit/1 MW → 1,000 units/1 GW | "Illustrative scale model … not a representation of current deployments." |

## /invest — industry relationships (only these two, only these sentences)

1. "In active discussions with a major California utility regarding power integration and potential deployment pathways for modular AI infrastructure."
2. "In active discussions with a leading provider of server, rack, and communications infrastructure regarding system integration and deployment requirements."

Framing line: "Selected industry relationships are presented without public naming at this stage." (`investOffering.ts`)

## /invest — evidence modules (approved, `investOffering.ts`)

Engineering, Power, Cooling (all `in-progress`: architecture "developed to manufacturable specification" / "designed for" / "specified for"); Industry engagement (`in-progress`); Team (`verified`). Prototype, IP, and Customers modules are **unapproved and unpublished**.

## Not published / needs-approval (non-exhaustive)

- Everything in `src/data/siteContent.ts` — this file is **not imported anywhere**; its specs (256 GPUs, 2–10 MW, PUE < 1.15, < 12 weeks, IP54) are legacy and NOT on the live site. Do not cite it as published fact.
- The "85×" software–hardware multiplier (exists only in a code comment in `PodosPod.tsx`, not rendered).
- Optimus interactive panel specs — `src/lib/optimusComponents.ts` states they are "placeholder estimates … verify against the real Solar Freight datasheet before launch."
- Any customer, revenue, prototype, certification, IP-portfolio, or valuation claim: **unknown / needs-approval**.
