# Content & Claims Audit — podosai.com

**Date:** 2026-08-31
**Scope:** All public copy in the repo (`src/data/siteContent.ts`, `src/data/investContent.ts`, `src/data/investOffering.ts`, `src/lib/optimusComponents.ts`, `src/components/site/*.tsx`, `src/components/invest/*.tsx`, `src/app/layout.tsx`, `src/app/invest/page.tsx`) plus artwork text baked into `public/products/pod.png` and `public/products/silo.png`. Verified against live HTML of `https://www.podosai.com/` and `/invest` (fetched 2026-08-31).
**Method:** grep sweep for numbers, units, and superlatives; image inspection of product artwork; live-HTML token check.
**Rule applied:** no conflict is resolved in this document. Every conflict is listed for founder decision.

Status legend (guesses, per `investOffering.ts` taxonomy): `target` = internal PODOS goal · `estimate` = external/industry figure · `verified` = evidenced · `conceptual` = design intent / placeholder · `unknown` = no basis found in repo.

---

## 1. Master claims table

### 1.1 Homepage `/` — rendered copy

| Claim text | Where it appears | Category | Status guess | Consistency notes |
|---|---|---|---|---|
| "1-MW deployable infrastructure **shipped in 90 days**" | `src/app/layout.tsx:52` (meta description — confirmed in live HTML) | timeline | target | **CONFLICT C1**: rest of homepage says 90–120 days; invest says 90 days *target* |
| "Deploy one megawatt in **90–120 days**. Not four years." | `src/components/site/PodosPod.tsx:202-206` (H2) | timeline | target | Conflicts with meta (90) and invest (90) — C1 |
| "DEPLOY · 90–120 DAYS · FACTORY TO FIRST MW" | `PodosPod.tsx:311`, `DeployTimelineScrub.tsx:63` | timeline | target | C1 |
| "DEPLOY 90–120 days · door to dashboard" | `PodosPod.tsx:70` (spec sheet) | timeline | target | C1 |
| D+0 order → D+30 factory complete → D+60 site+arrival → D+90–120 serving inference | `PodosPod.tsx:78-83` | timeline | target | Internally consistent with 90–120; not with 90 |
| "same **90-day** timeline, anywhere on the map" (off-grid card) | `EngineeringAdvantages.tsx:55` (confirmed live) | timeline | target | Third variant of the window — C1 |
| "POWER 1 MW per pod · **13.8 kV MV input**" | `PodosPod.tsx:62` | product | target | 13.8 kV input vs. Optimus panel "480V three-phase, 200A" grid ingress — C5 |
| "COMPUTE **128 GPUs** per pod" | `PodosPod.tsx:63`; `ProductShowcase.tsx:32`; blueprint label "128× GPU BAY" `PodosPod.tsx:701` | product | target | **CONFLICT C2**: Optimus panel in the SAME section says 64 GPUs |
| "GPU Count: **64 × H200 / B200 class**" · "64-GPU cluster" · "GPU Density 64× per pod" | `src/lib/optimusComponents.ts:255,262,265` (rendered by `OptimusInteractive` inside PodosPod section) | product | conceptual (file comment: "placeholder estimates … verify against the real Solar Freight datasheet before launch") | C2 — 64 vs 128 on the same page |
| "FOOTPRINT **720 sq ft** · 12 × 60 ft · fully relocatable" | `PodosPod.tsx:64`; `ProductShowcase.tsx:29,33` | product | target | **CONFLICT C3**: pod.png artwork shows 40 FT × 8 FT dimension callouts (=320 sq ft); DesignTechEnvironment alt text says 6058×2438 mm (≈20 ft × 8 ft ≈ 160 sq ft); Optimus panel says "6.1 × 1.7 m level pad" |
| "PUE **1.08–1.12** · hyperscaler avg **1.58**" | `PodosPod.tsx:66` | performance | target (PODOS) / estimate (avg) | **CONFLICT C4**: Optimus COOL panel says "PUE < 1.10, industry avg 1.55"; dead `siteContent.ts` says "< 1.15". Three PUE values, two "industry average" values, no source for either |
| "HEAT RECOVERY ORC · **60–110 kW** reclaimed per pod" | `PodosPod.tsx:69`; `EngineeringAdvantages.tsx:46` | performance | unknown | No source; paired with revenue claim below |
| "**$57K** /yr/pod reclaimed" (ORC card metric) | `EngineeringAdvantages.tsx:43-44` | financial | unknown | Revenue projection with no stated assumptions — on the public homepage |
| "OFF-GRID Solar + battery + generator · **no fiber or grid required**" | `PodosPod.tsx:68` | product | conceptual | Optimus NET panel backs "no fiber" via "Starlink + LTE"; dead `siteContent.ts` techSpecs instead promise "dual diverse fiber entry" |
| "0 GRID DEPENDENCY" / "Off-grid ready" | `EngineeringAdvantages.tsx:52-55` | product | conceptual | Physically strained by Optimus's own numbers (12 kW solar, 240 kWh battery vs 64×1,000 W GPUs) — C5 |
| "0 gal WATER · CONCRETE" · "zero water · zero concrete" · "lands on gravel or asphalt" | `EngineeringAdvantages.tsx:61-64`; `PodosPod.tsx:65` ("zero water") | product | target | Consistent across homepage; but "no slab permits" vs PodosPod timeline "concrete pad cured" at D+60 (`PodosPod.tsx:81`) — C6 |
| "Thermos enclosure … Arctic field to Phoenix tarmac, same PUE" · "6 surfaces INSULATED" | `EngineeringAdvantages.tsx:34-37` | performance | conceptual | Unverified thermal claim |
| "MFG California · shipped · not sited" | `PodosPod.tsx:71` | product | unknown | No factory evidence in repo; invest Evidence has no manufacturing-facility module |
| "PODOS POD … badge: **PILOT · VALIDATED**" | `ProductShowcase.tsx:36` | deployment | **unknown — high risk** | **CONFLICT C7**: invest page deliberately hides `prototype` and `customers` evidence modules as not publicly approvable (`investOffering.ts:262-264`). No pilot exists anywhere in repo data |
| "MEGA SILO … badge: **Q4 2026 · TAKING LOIs**" | `ProductShowcase.tsx:53` | deployment | **unknown — high risk** | C7 — an LOI claim is material; invest page shows zero customer/LOI evidence |
| "MEGA SILO · 20 MW · CLUSTER" | `ProductShowcase.tsx:44,48` | product | conceptual | **CONFLICT C8** (math): 24 pods × 1 MW = 24 MW, not 20 |
| "**2,560 GPUs**" (MEGA SILO) | `ProductShowcase.tsx:49` | product | conceptual | C8: 24 pods × 128 GPUs = 3,072; 2,560 = 20 × 128. Numbers don't reconcile with "24 pods" |
| "Hyperbaric N₂ compound at **3–5+ atm**. **24 pods in 20,000 sq ft** — replaces **100,000 sq ft** of traditional data center (**83% smaller**)" | `ProductShowcase.tsx:46,50-51` | product/performance | conceptual | C8; also silo.png artwork depicts 12 pods, not 24; "−83% vs DC" derived from unsourced 100,000 sq ft baseline |
| Artwork title "**OPTIMUS DATA CENTER** · 20 MW · CLUSTER" | `public/products/silo.png` (image text) | product | conceptual | **CONFLICT C9**: site card calls the same product "MEGA SILO"; two public names for one product |
| pod.png artwork text: "1 MW · UNIT", "720 sq ft", "128 GPUs", "90–120 days", dims "40 FT × 8 FT" | `public/products/pod.png` (image text) | product | conceptual | C1 (90–120), C3 (40×8 ft = 320 sq ft contradicts its own 720 sq ft line) |
| "3.2**–4 years** · Industry median from broken ground to first MW" | `ProblemDiagnosis.tsx:319,450-458` (M-01) | market | estimate | **CONFLICT C10**: invest page says "3–5 YEARS industry estimate" (`investContent.ts:112`) |
| "CAPEX PER MEGAWATT **$155–170 million**" + stack "$52M/$34M/$28M/$41M" | `ProblemDiagnosis.tsx:155-160,465-475` (M-02) | market | unknown / implausible as labeled | Segments sum to $155M. Common industry figures are ~$10–15M **per MW**; $155M/MW is off by ~10×. Either the unit label or the number needs founder review. No source cited |
| "GPU MEMORY USEFUL **12–20%**" · "**80–90% VRAM WASTED**" | `ProblemDiagnosis.tsx:321,485-501` (M-03) | market | unknown | No source; strong quantitative claim |
| "TIME-TO-POWER **30–36 months** · Utility interconnect queue for a 100 MW+ greenfield site" | `ProblemDiagnosis.tsx:323,506-516` (M-04) | market | estimate | **CONFLICT C11**: same section's lede says "**24-month** grid queue" (`ProblemDiagnosis.tsx:441`) |
| Legend "GRID QUEUE · 80% / ACTIVE BUILD · 12%" | `ProblemDiagnosis.tsx:520-527` | market | unknown | Percentages appear invented to fit the visualization; unsourced |
| "Creator of all **76+ patent claims** across both platforms — inventor of record on **every USPTO filing**" | `MeetTheTeam.tsx:26` (confirmed live) | product/IP | **unknown — high risk** | **CONFLICT C12**: invest Evidence `ip` module is hidden as not publicly approvable (`investOffering.ts:263`). Only patent number anywhere on the site; no filing numbers in repo. "76+ patent claims" ≠ 76 patents — easy to misread |
| Team lede: "deep operational experience across data center construction, industrial manufacturing, and AI infrastructure" | `MeetTheTeam.tsx:99-100` | team | unknown | Listed roles are Founder/Inventor, Real Estate Consultant, Graphic Designer & Web — copy overstates the roster shown beneath it |
| "Within **72 hours**" first-response commitment · "scoping call scheduled within the week" · "**30-min** intro call" | `RequestAccessCTA.tsx:30-43` | operational | unknown | Service-level promise; no process evidence |
| "OPEN · TAKING DEPLOYMENT INQUIRIES" / "Live · Taking deployment inquiries" | `RequestAccessCTA.tsx:276`; `Footer.tsx:121` | operational | unknown | Status claims — fine if true, needs founder confirmation |
| "Compression software + modular pod hardware in one company" | `HeroVideoNarrative.tsx:51` (hero sub) | product | unknown | Software (Syntropic) never appears on /invest; the two pages describe different companies — C13 |
| "POD-0042 · REV·F · CONFIDENTIAL — SEED · 2026" | `OptimusInteractive.tsx:118` (eyebrow over pod explorer) | decorative | conceptual | Fake document-control string on a public page; "CONFIDENTIAL" label on public content could mislead |
| Pod dims in alt text: "6058mm long, 2591mm tall, 2438mm wide" | `DesignTechEnvironment.tsx:95` | product | conceptual | C3 — third footprint variant (standard 20-ft container) |
| "**24-month** grid queue" (lede) | `ProblemDiagnosis.tsx:441` | market | estimate | C11 |
| "Unit economics prove at 1 MW · cluster economics unlock at 20 MW" | `ProductShowcase.tsx:97-98` | financial | unknown | Economics claim with no published economics |

### 1.2 Optimus interactive panel specs (rendered on `/` inside the PodosPod section)

All from `src/lib/optimusComponents.ts`. The file's own header comment (lines 22-25) says these are **"placeholder estimates … verify against the real Solar Freight datasheet before launch."** They are live on the public site today.

| Claim | Line | Category | Status guess | Notes |
|---|---|---|---|---|
| Solar: 8-panel, **12 kW** continuous, 22.5% cell efficiency, 25-year/80% lifecycle | 94-98 | product | conceptual/placeholder | 12 kW cannot support even the 64-GPU load its own COMPUTE panel states (64 kW) — C5 |
| "Off-Grid Runtime **12 hr** — summer median, full compute load" | 103-106 | performance | conceptual/placeholder | C5 |
| Battery **240 kWh** LFP · MPPT **99.5%** efficient · inverter **50 kW** · **6,000 cycles** | 122-134 | product | conceptual/placeholder | 240 kWh / 64 kW ≈ 3.75 hr, not 12 hr — internal math tension |
| Chassis: 8-axle, **28,500 kg**, no oversize permit, "The pod IS the truck", setup **< 30 min crane-free** | 149-162 | product | conceptual/placeholder | **CONFLICT C6**: PodosPod timeline says "pod craned in" (line 81) and EngineeringAdvantages alt text shows "Crane placing the PODOS pod" |
| Grid ingress **480V three-phase, 200A** (≈166 kVA) | 235 | product | conceptual/placeholder | C5 vs "1 MW per pod · 13.8 kV MV input" |
| GPUs **64 × H200/B200**, 1,000 W TDP, 9.2 TB HBM3e, 4×16-GPU sleds | 255-259 | product | conceptual/placeholder | C2 vs 128 GPUs |
| Cooling: 95%+ heat capture, 1,200 L/min, zero water, "PUE < 1.10, industry avg 1.55" | 281-289 | performance | conceptual/placeholder | C4 |
| Network: 4× 800G, Starlink + LTE failover, < 2 µs intra-pod | 303-306 | product | conceptual/placeholder | — |

### 1.3 Invest page `/invest` — rendered copy

The invest page is governed by `investOffering.ts` (claims registry with status flags) — structurally much cleaner than the homepage. All numbers below are data-driven.

| Claim | Where | Category | Declared status | Consistency notes |
|---|---|---|---|---|
| "**90 DAYS** — PODOS target" (deployment comparison) | `investContent.ts:118-119`; `investOffering.ts:167-177`; JOURNEY stage 05 "TARGET: 90 DAYS" (`investContent.ts:134`) | timeline | target (declared, badged) | **C1**: homepage says 90–120 days; metadata says 90 |
| "**3–5 YEARS** — industry estimate" (traditional buildout) | `investContent.ts:112-113`; `investOffering.ts:154-165` | market | estimate (declared) | **C10**: homepage says 3.2–4 years |
| "**10×** AI COMPUTE DEMAND — projected … this decade" | `investOffering.ts:141-152` | market | estimate (declared, "Industry estimate" label, no URL) | `sourceUrl` empty — unsourced |
| "**1 MW** PER MODULAR UNIT — standardized 1-MW building block" | `investOffering.ts:179-189`; FAQ (`investContent.ts:226`) | product | target (declared) | Consistent on /invest; homepage agrees (1 MW) except dead `siteContent.ts` says 2–10 MW |
| Scale model 1→10→100→1,000 units = 1 MW→1 GW | `investContent.ts:144-152` | product | conceptual (disclaimed: "Illustrative scale model … not current deployments") | Properly disclaimed |
| "deploy in **months** instead of waiting **years**" | `investContent.ts:37` (hero sub) | timeline | target | Consistent with 90-day target framing |
| Minimum planned entry **$1,000**; MAX_INVESTMENT **$250,000**; quick amounts $1k–$100k | `investOffering.ts:40`; `investContent.ts:13-14` | financial | target ("planned entry point"; disclaimed as non-binding) | Gated by interest mode; live HTML confirms $1,000 shown |
| "In active discussions with a major California utility …" / "… leading provider of server, rack, and communications infrastructure …" | `investOffering.ts:80-105` | relationship | verified-as-worded (Level C "discussions"; disclosure flags set) | Homepage carries no relationship claims — consistent |
| Film "3 MIN" | `investContent.ts:63` | decorative | unknown | Code comment in `invest/page.tsx:4` calls it a "35-second film" (comment only, not rendered) |
| Evidence modules 01-05 (engineering/power/cooling/industry/team), statuses `in-progress`/`verified` | `investOffering.ts:213-260` | product | as declared | `prototype`, `ip`, `customers` explicitly **hidden** — which the homepage badges contradict (C7, C12) |
| Legal: "conceptual visualizations … targets or estimates are not guarantees … interest mode" | `investContent.ts:258-267` | legal | verified (present) | **No equivalent disclaimer exists on the homepage**, which carries far harder claims — C14 |

### 1.4 Unmounted / dead copy that still carries claims (in repo, not rendered)

| Claim | Where | Notes |
|---|---|---|
| "Up to **256 GPUs** per pod" | `src/data/siteContent.ts:13` | Dead file — nothing imports `siteContent.ts`. Third GPU count (64 / 128 / 256) |
| "Power Capacity **2–10 MW** scalable" | `siteContent.ts:14` | Contradicts 1 MW everywhere else |
| "PUE **< 1.15**" · "**< 12 weeks** factory to live" · "operational in under 12 weeks" | `siteContent.ts:15-16,27` | 12 weeks = 84 days — a fourth deployment window |
| "Operating Temp −30°C to 55°C", "IP54", "400G/800G", "H100/H200/B200, MI300X", "2N or N+1" | `siteContent.ts:17-18,67-70` | Dead but greppable/indexable if ever re-mounted |
| "PODOS deploys AI infrastructure in **90–120 days**." | `PodosScrollHeroIntro.tsx:62` | Component not imported by any page |
| "1-MW Modular Pods" · "90–120 day Deploy" · fake uptime "47 days" telemetry | `HeroAIWall.tsx:32,201-203` | Component not imported by any page |
| "85× in FUSION" (compression multiplier) | `PodosPod.tsx:55` code comment | Comment only, never rendered |

---

## 2. Cross-page inconsistency register (all found)

| # | Conflict | Variants in play | Files |
|---|---|---|---|
| **C1** | Deployment window — 4 different values | **90 days** (`/` metadata, EngineeringAdvantages off-grid card, all of `/invest`) · **90–120 days** (PodosPod H2 + spec, DeployTimelineScrub, ProductShowcase, pod.png artwork, dead heroes) · **< 12 weeks / 84 days** (dead siteContent) · timeline detail D+90–120 | `layout.tsx:52`, `PodosPod.tsx:70,202,311`, `EngineeringAdvantages.tsx:55`, `ProductShowcase.tsx:34`, `pod.png`, `investContent.ts:118,134`, `investOffering.ts:167`, `siteContent.ts:16` |
| **C2** | GPUs per pod — 3 values | **128** (PodosPod spec, blueprint, ProductShowcase, pod.png) · **64 × H200/B200** (Optimus panel, same page/section) · **up to 256** (dead siteContent) | `PodosPod.tsx:63,701`, `ProductShowcase.tsx:32`, `optimusComponents.ts:255-265`, `siteContent.ts:13` |
| **C3** | Pod footprint/dimensions — 4 values | **720 sq ft / 12 × 60 ft** (PodosPod, ProductShowcase, pod.png text) · **40 FT × 8 FT** (pod.png dimension callouts = 320 sq ft, contradicting the same image's 720 sq ft) · **6058 × 2438 mm ≈ 20 × 8 ft** (DesignTechEnvironment alt) · **6.1 × 1.7 m pad** (Optimus panel) | `PodosPod.tsx:64`, `ProductShowcase.tsx:29,33`, `pod.png`, `DesignTechEnvironment.tsx:95`, `optimusComponents.ts:181` |
| **C4** | PUE + industry-average baseline | **1.08–1.12 vs "hyperscaler avg 1.58"** · **< 1.10 vs "industry avg 1.55"** · **< 1.15** (dead) | `PodosPod.tsx:66`, `optimusComponents.ts:289`, `siteContent.ts:15` |
| **C5** | Power architecture — MV grid pod vs solar freight pod | **1 MW · 13.8 kV MV input** vs Optimus **12 kW solar / 240 kWh battery / 50 kW inverter / 480V 200A grid feed / "solar-first, grid is a fallback"** — two different products described as one; the solar envelope can't run either GPU count | `PodosPod.tsx:62,68`, `optimusComponents.ts:94-134,235-241` |
| **C6** | Installation method | "pod **craned in**" (timeline) + crane image alt vs Optimus "**crane-free**, single-operator, < 30 min" + "The pod IS the truck" vs "zero concrete" vs "concrete pad cured" at D+60 | `PodosPod.tsx:81`, `EngineeringAdvantages.tsx:64-66`, `optimusComponents.ts:157-162` |
| **C7** | Pilot & LOI badges vs invest evidence policy | Homepage: "**PILOT · VALIDATED**", "**Q4 2026 · TAKING LOIs**" — invest page hides `prototype` and `customers` modules as not approved for public use, and legal copy promises relationships are "described at their accurate current level" | `ProductShowcase.tsx:36,53`, `investOffering.ts:262-264`, `investContent.ts:265` |
| **C8** | MEGA SILO math | 20 MW ≠ 24 pods × 1 MW (=24) · 2,560 GPUs ≠ 24 × 128 (=3,072; 2,560 = 20 pods) · artwork shows 12 pods | `ProductShowcase.tsx:44-51`, `silo.png` |
| **C9** | Product naming | Site card "**MEGA SILO**" vs artwork title "**OPTIMUS DATA CENTER**" (same image); "Optimus" also survives as internal component naming | `ProductShowcase.tsx:43`, `silo.png`, `src/components/optimus/*` |
| **C10** | Traditional buildout duration | **3.2–4 years** (homepage) vs **3–5 years** (invest, declared estimate) | `ProblemDiagnosis.tsx:450-458`, `investContent.ts:112`, `investOffering.ts:156` |
| **C11** | Grid-queue duration (same homepage section) | lede "**24-month** grid queue" vs card "**30–36 months**" | `ProblemDiagnosis.tsx:441,506-516` |
| **C12** | Patent claims | "**76+ patent claims** … every USPTO filing" on homepage vs invest `ip` evidence module hidden pending approval; no filing numbers anywhere in repo | `MeetTheTeam.tsx:26`, `investOffering.ts:263` |
| **C13** | Company definition | Homepage hero: "**Compression software + modular pod hardware** in one company" (+ Syntropic/85× in comments) vs `/invest` which never mentions software | `HeroVideoNarrative.tsx:51`, all of `investContent.ts` |
| **C14** | Disclaimer asymmetry | `/invest` labels targets/estimates and carries full legal disclosures; `/` carries the hardest claims (pilot, LOIs, $57K/yr, 76+ patents, capex figures) with **no** disclaimer, source, or target-badge system | `investContent.ts:258-267` vs entire homepage |
| **C15** | Fiber requirement | "no fiber or grid required" (PodosPod) vs dead techSpecs "Dual diverse fiber entry" | `PodosPod.tsx:68`, `siteContent.ts:70` |

---

## 3. BLOCKED — needs founder approval before any copy edit

Do not resolve without an explicit decision on each:

1. **Canonical deployment window** — pick one: 90 days, 90–120 days, or "<12 weeks". Affects `/` metadata, PodosPod H2/spec/eyebrow, EngineeringAdvantages, ProductShowcase, pod.png artwork (image must be regenerated), `/invest` claims registry. (C1)
2. **Canonical GPU count per pod** — 64, 128, or 256. Affects PodosPod spec + blueprint, ProductShowcase, Optimus COMPUTE panel, pod.png artwork. (C2)
3. **Canonical pod dimensions/footprint** — 720 sq ft (12×60 ft) vs 40×8 ft vs 20-ft-container dims. pod.png currently contradicts itself. (C3)
4. **"PILOT · VALIDATED" badge** — is there a validated pilot? If not, this is the single riskiest string on the site given the invest page's own evidence policy. (C7)
5. **"Q4 2026 · TAKING LOIs" badge** — are LOIs actually being taken, and is Q4 2026 an approved public date? (C7)
6. **"76+ patent claims … every USPTO filing"** — confirm filings exist, whether "76+ claims" is the approved public formulation, and whether it may appear publicly while the invest IP module is withheld. (C12)
7. **Product name: MEGA SILO vs OPTIMUS DATA CENTER** — one public name; silo.png artwork and/or card must change. (C9)
8. **MEGA SILO math set** — choose a consistent tuple of {MW, pod count, GPU count, sq ft}; current 20 MW / 24 pods / 2,560 GPUs cannot all be true; artwork shows 12 pods. (C8)
9. **Hyperbaric N₂ 3–5+ atm claim** — confirm this is an approved public technical claim or label it conceptual. (C8)
10. **$57K/yr/pod ORC revenue** and **60–110 kW heat recovery** — approve, source, or remove. (§1.1)
11. **CAPEX "$155–170 million per megawatt"** — confirm the unit (per MW vs per facility); as written it is ~10× typical industry figures and unsourced. (§1.1)
12. **Homepage market stats** — 3.2–4 yr build, 12–20% GPU memory useful, 80–90% VRAM wasted, 24 vs 30–36 month queue, 10× demand: approve sources or align to the invest claims registry. (C10, C11)
13. **Which pod product story is public** — MV-grid 1-MW pod (PodosPod spec) or Solar Freight pod (Optimus panels, flagged in-code as placeholder pending "real Solar Freight datasheet")? They currently coexist in one section. (C5, C6)
14. **"Compression software + modular pod hardware in one company"** — decide whether Syntropic/software is part of the public story; align `/invest`. (C13)
15. **Team lede** ("deep operational experience across data center construction, industrial manufacturing…") — confirm accuracy against the actual public roster. (§1.1)
16. **Response-time promise ("within 72 hours")** and "Live · Taking deployment inquiries" — confirm operationally true. (§1.1)
17. **"CONFIDENTIAL — SEED · 2026" decorative label** on public pod explorer — approve or remove. (§1.1)
18. **Dead-claim cleanup authorization** — `siteContent.ts` (256 GPUs, 2–10 MW, <12 weeks, PUE <1.15), `PodosScrollHeroIntro.tsx`, `HeroAIWall.tsx` carry conflicting numbers that could be re-mounted or scraped; deleting them is a code change requiring sign-off. (§1.4)
19. **Homepage disclaimer parity** — decide whether `/` gets the same target/estimate labeling + disclaimer system `/invest` already has. (C14)

---

*Prepared from repo state at commit `d847028` and live HTML fetched 2026-08-31. No conflicts were resolved; all copy left untouched.*
