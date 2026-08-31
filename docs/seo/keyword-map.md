# Keyword & Cluster Map — podosai.com

Target architecture: **platform · engineering · deploy · use-cases · compare · invest-education · resources · insights** (per the SEO master brief).

- **Method**: live SERP inspection via web search on 2026-08-31 for each primary query below. No keyword-tool access in this session, so **volume / KD / CPC = unknown** for every row. Re-run through a keyword tool (Ahrefs/Semrush/GSC) before prioritizing by traffic.
- **Site today**: two indexable pages — `/` (product) and `/invest` (interest-stage investor page). Every target URL below is **proposed** (status = planned) unless it is one of those two.
- **Facts baseline** (what the live site/repo actually claims, usable in content): PODOS POD = standardized 1 MW factory-built unit, 128 GPUs, 13.8 kV MV input, 720 sq ft, closed-loop direct-to-chip liquid cooling with zero water, PUE 1.08–1.12 (stated), ORC heat-recovery engine reclaiming 60–110 kW per pod, off-grid option (solar + battery + generator), 90–120 day door-to-dashboard target, manufactured in California, MEGA SILO = 20 MW product (NAMING GATE: "MEGA SILO" and "Optimus" are NOT publishable names until founder approval — see terminology.md and banned-claims.md; treat this row as internal reference only); use cases: enterprise AI, healthcare, universities/research, manufacturing, financial, government/secure, edge, supplemental capacity. Company is pre-revenue/interest-stage; the /invest legal block states imagery is conceptual and figures are targets, not deployments. **No customers, revenue, certifications, or completed deployments may be claimed in any SEO page.** Patent claim counts appear only in a team bio ("76+ patent claims") — verify against USPTO records before using in content; until verified: unknown.

Legend — Intent: informational (I), commercial-investigation (C), transactional (T), navigational (N). Funnel: TOFU / MOFU / BOFU.

---

## Cluster overview

| Cluster | URL prefix (proposed) | Role | Head intent |
|---|---|---|---|
| platform | `/platform/…` | What the product is; category ownership | I / C |
| engineering | `/engineering/…` | How it works: cooling, power, heat, enclosure | I |
| deploy | `/deploy/…` | Speed, logistics, power access, site requirements | I / C |
| use-cases | `/use-cases/…` | Who it's for, by vertical | C |
| compare | `/compare/…` | X-vs-Y decision queries | C |
| invest-education | `/invest/learn/…` | Investor education (compliance-gated, no advice) | I |
| resources | `/resources/…` | Glossary, spec sheets, checklists | I |
| insights | `/insights/…` | Analysis/news-shaped pieces, market data | I |

---

## Cluster: platform

### 1. modular AI data center

- **Supporting queries**: modular data center for AI, AI modular data center solutions, modular data center pods, prefab AI data center, modular data center benefits
- **Intent / funnel**: C (with heavy I overlap) / MOFU
- **Target URL**: `/platform` (pillar)
- **Content type**: category pillar page — definition, architecture diagram, spec table, links to every spoke
- **Dominant SERP format observed**: vendor solution pages (Schneider EcoStruxure, Flex) + listicle/explainer articles (Built In, datacenters.com, AirSys blog) + a downloadable vendor guide (Schneider "Modular AI Data Center Guide")
- **Top results fail to cover**: transparent spec-level data (real PUE, per-unit power, footprint); a standardized repeatable unit narrative — incumbents sell custom-engineered projects, not a product; no pricing or unit-economics signal anywhere on page one
- **Evidence required**: full POD nameplate spec (already on site); PUE figures must be labeled design targets unless measured data exists (unknown); no deployment counts
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

### 2. 1 MW AI compute pod

- **Supporting queries**: 1 MW data center pod, 1 MW modular data center, AI compute pod, megawatt-scale AI pod, 1 MW GPU pod
- **Intent / funnel**: C / MOFU–BOFU
- **Target URL**: `/platform/pod` (product page for PODOS POD)
- **Content type**: product spec page — nameplate table, cutaway, deployment timeline, FAQ
- **Dominant SERP format observed**: fragmented, low-competition mix — vendor pages (HPE AI Mod POD, Schneider AI solutions), arXiv PDFs, USPTO patents, two ModulEdge blog guides. No result owns the exact phrase; emerging adjacent topic is the 1 MW rack / 800 VDC transition (NVIDIA)
- **Top results fail to cover**: a definitive "what is a 1 MW AI pod and what's inside it" page; per-pod GPU counts, MV input, footprint; relocatability; how a 1 MW unit compounds to campus scale
- **Evidence required**: POD spec sheet claims as stated on site (1 MW, 128 GPUs, 13.8 kV, 720 sq ft); "90–120 days" always labeled target; MEGA SILO 20 MW labeled product roadmap, not delivered product
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

### 3. containerized data center

- **Supporting queries**: container data center, shipping container data center, containerized data center for AI, containerized data center pros and cons
- **Intent / funnel**: I / TOFU
- **Target URL**: `/platform` (secondary target on the pillar) **or** `/resources/containerized-vs-modular` if the pillar can't rank for both — decide after 90 days of GSC data. Do **not** create a standalone page first; near-synonym of the pillar head term (cannibalization risk, see rules)
- **Content type**: pillar section + glossary cross-link
- **Dominant SERP format observed**: glossary/definition pages (TechTarget, Sunbird, GIGABYTE) + vendor product pages (Delta, BMarko, CenCore)
- **Top results fail to cover**: AI-density reality — most content assumes pre-AI rack densities; nothing on liquid-cooled 1 MW-class containers, zero-water cooling, or heat recovery in a container form factor
- **Evidence required**: same as pillar; explicitly position POD as engineered enclosure, not a converted shipping container (site claims "Thermos" 6-surface insulated enclosure)
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

---

## Cluster: engineering

### 4. direct-to-chip liquid cooling

- **Supporting queries**: what is direct-to-chip cooling, direct to chip liquid cooling data center, cold plate cooling GPU, D2C cooling, closed-loop liquid cooling
- **Intent / funnel**: I / TOFU
- **Target URL**: `/engineering/liquid-cooling`
- **Content type**: technical explainer with diagrams — how D2C works in the POD's closed loop, why zero water
- **Dominant SERP format observed**: vendor glossary pages (Supermicro, Trane, nVent) + explainer blogs (Park Place, CyrusOne, WhiteFiber) + one top-10 listicle + arXiv. Definition-style content dominates
- **Top results fail to cover**: operational realities in a modular/containerized context; water consumption comparison (closed-loop zero-water vs evaporative); what D2C means for site requirements (no cooling towers, no water rights, no slab permits — the site's claim); coolant maintenance
- **Evidence required**: POD cooling architecture as designed; "zero water" is a design property of a closed loop (defensible); PUE 1.08–1.12 labeled design target; hyperscaler-average comparison (site cites 1.58) needs a citable source (e.g., Uptime Institute survey) before publishing
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

### 5. AI data center power architecture

- **Supporting queries**: data center power distribution for AI, 800 VDC data center, medium voltage data center input, power requirements for AI data centers, rack power density kW
- **Intent / funnel**: I / TOFU
- **Target URL**: `/engineering/power`
- **Content type**: technical explainer — MV input → distribution → rack, where the industry is heading (800 VDC), how a 1 MW unit simplifies the chain
- **Dominant SERP format observed**: semiconductor-vendor solution pages (onsemi, Infineon, Power Integrations), NVIDIA technical blog on 800 VDC, one NAE institutional article, arXiv papers. Component-level angle dominates
- **Top results fail to cover**: facility-level explanation for buyers (everything is chip/PSU-vendor framing); what 13.8 kV MV input means for a site; power architecture of a factory-integrated unit vs field-built electrical rooms
- **Evidence required**: POD electrical claims as designed (13.8 kV MV input, per site); redundancy claims only as designed; cite NVIDIA/industry sources for 800 VDC trend
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

### 6. data center heat recovery

- **Supporting queries**: data center waste heat reuse, waste heat recovery data center, ORC data center, data center heat reuse revenue, organic rankine cycle waste heat
- **Intent / funnel**: I / TOFU
- **Target URL**: `/engineering/heat-recovery`
- **Content type**: technical explainer — why closed-loop liquid cooling makes heat recoverable; ORC at pod scale
- **Dominant SERP format observed**: institutional/reference content (IRENA, Danfoss, ScienceDirect review, TechTarget, EESI) + USPTO patents. High-authority but generic
- **Top results fail to cover**: heat recovery at 1 MW modular scale (all content is district-heating / large-facility); converting waste heat to grid-synchronous electricity via ORC as a per-unit revenue line; almost nothing commercial in the SERP
- **Evidence required**: ORC 60–110 kW reclaimed per pod is a **design claim** — label as such; "adds revenue per pod" must be framed as design intent, not achieved revenue (company is pre-revenue)
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

### 7. KV cache compression

- **Supporting queries**: KV cache optimization, KV cache memory LLM, GPU memory utilization inference, VRAM waste LLM inference, KV cache overhead
- **Intent / funnel**: I / TOFU (technical audience)
- **Target URL**: `/engineering/memory-efficiency` — **only if** the software pillar (Syntropic) gets public substantiation; otherwise route to `/insights/` as analysis
- **Content type**: practitioner-level technical explainer bridging KV-cache economics → infrastructure cost (the site's "10–20% of GPU memory useful" problem framing)
- **Dominant SERP format observed**: almost entirely arXiv papers and GitHub repos (surveys, ChunkKV, KVComp, EvolKV, vllm-kvcompress). No accessible practitioner explainer on page one — pure academic SERP
- **Top results fail to cover**: anything readable by an infrastructure buyer; the link from KV-cache overhead to wasted capex per MW; no vendor owns this SERP yet
- **Evidence required**: **high bar** — this SERP is research-grade, so the page needs a technically credible author and citations to the arXiv literature. PODOS's own software claims (Syntropic) are not documented on the live site beyond a team-bio mention; any Syntropic performance claim = unknown until substantiated. The site's "10–20% GPU memory useful / 80–90% VRAM wasted" stat needs a citable external source before an SEO page repeats it
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

### 8. off-grid data center (solar + battery)

- **Supporting queries**: solar powered data center, off-grid AI data center, data center microgrid, solar plus storage data center, data center without grid connection
- **Intent / funnel**: I–C / MOFU
- **Target URL**: `/engineering/off-grid`
- **Content type**: reference-architecture explainer — the POD's solar + battery + generator envelope; when off-grid beats waiting for interconnect
- **Dominant SERP format observed**: specialist blogs (Scale Microgrids ×2, ModulEdge, PERC), Fast Company feature, arXiv ("Offgrid AI"), a listicle. Economics content exists ($/MWh comparisons) but is scattered
- **Top results fail to cover**: 1 MW-scale off-grid reference architecture for AI (most content models 20 MW+); modular unit + microgrid pairing; realistic availability expectations at small scale
- **Evidence required**: off-grid option is a designed configuration (per site); no availability/uptime numbers may be claimed (unknown — no deployments); cite Scale Microgrids / arXiv for economics
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

---

## Cluster: deploy

### 9. factory-built data center

- **Supporting queries**: prefabricated data center, prefab modular data center, factory-assembled data center, prefabricated data center modules, data center factory integration burn-in
- **Intent / funnel**: I–C / MOFU
- **Target URL**: `/deploy/factory-build`
- **Content type**: process page — what factory integration, testing, and burn-in actually include; D+0 → D+90–120 timeline
- **Dominant SERP format observed**: vendor product/catalog pages (Schneider, Eaton, Vertiv, Flex, BMarko) + USPTO patents + one benefits blog (Legence). Product-catalog SERP with a thin content layer
- **Top results fail to cover**: process transparency — nobody shows what happens inside the factory, what "tested before shipment" means, or an honest timeline with stage gates; McKinsey modular-construction stats are quoted but never operationalized
- **Evidence required**: the D+0/D+30/D+60/D+90–120 timeline is a **target** (site labels it so) — every mention labeled; "manufactured in California" as stated on site; no completed-unit counts (unknown)
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

### 10. behind-the-meter compute

- **Supporting queries**: behind the meter data center, behind-the-meter power for AI, BTM data center, on-site power generation data center, bypass grid interconnection data center
- **Intent / funnel**: I / TOFU–MOFU
- **Target URL**: `/deploy/behind-the-meter`
- **Content type**: explainer + decision guide — what BTM means, why it pairs with modular units that land where power already exists
- **Dominant SERP format observed**: news/analysis (Cleanview report with ~90 GW dataset, Data Center Knowledge ×2, DCD, Latitude Media) + energy-vendor blogs (Enverus, ATK, Landgate). Analysis-heavy, hyperscale-and-gas-turbine framing
- **Top results fail to cover**: BTM at 1 MW granularity; how an enterprise (not a hyperscaler) actually executes BTM; the "turn available power into deployable compute" angle — matching modular units to stranded/underused power, which is PODOS's core /invest thesis
- **Evidence required**: cite Cleanview (~90 GW BTM pipeline) and queue statistics from RMI/LBNL-class sources; PODOS positioning only as design capability
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

---

## Cluster: use-cases

### 11. on-prem GPU cluster (enterprise)

- **Supporting queries**: on-premise GPU cluster, build GPU cluster on premises, enterprise AI infrastructure on prem, GPU cluster power and cooling requirements, H100 cluster on premise
- **Intent / funnel**: C / MOFU
- **Target URL**: `/use-cases/enterprise` (spoke; anchors the use-case hub `/use-cases`)
- **Content type**: use-case page + practical guide — what hosting a GPU cluster physically requires, and the pod as the missing facility layer
- **Dominant SERP format observed**: long-form guides (vCluster playbook, DataCouch ×2, Towards Data Science/Medium) + AI-generated-looking content farms (OneSource, ifactoryapp). Guide-shaped SERP, moderate quality
- **Top results fail to cover**: nearly all guides assume a facility already exists — power, cooling, and site are hand-waved; cloud-vs-on-prem breakeven math exists (e.g., ~12-month 8×H100 breakeven claims) but no one connects it to "where does the cluster physically live"
- **Evidence required**: any TCO/breakeven numbers cited from named external sources only; POD capacity claims per spec sheet; verticals (healthcare, gov, finance) described as designed-for, with zero implied customers
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

### 12. edge AI infrastructure

- **Supporting queries**: edge AI deployment, edge data center for AI, distributed AI inference infrastructure, AI compute at the edge
- **Intent / funnel**: I / TOFU
- **Target URL**: `/use-cases/edge`
- **Content type**: use-case explainer — physical infrastructure for edge AI at pod scale
- **Dominant SERP format observed**: big-vendor glossary pages (IBM, Red Hat, AI21) + infrastructure-vendor blogs (Chatsworth, Scale Computing) + trade press (SiliconANGLE)
- **Top results fail to cover**: SERP is dominated by device-level edge AI (models on IoT hardware); the middle tier — megawatt-class compute placed near where data is generated — is barely represented; site-requirement checklists absent
- **Evidence required**: POD relocatability and off-grid claims per spec sheet (design claims); latency benefits framed generically, no measured numbers (unknown)
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

---

## Cluster: compare

### 13. liquid cooling vs air cooling

- **Supporting queries**: liquid vs air cooling data center, air cooled vs liquid cooled servers, when to switch to liquid cooling, liquid cooling PUE savings
- **Intent / funnel**: C / MOFU
- **Target URL**: `/compare/liquid-vs-air-cooling`
- **Content type**: comparison page — neutral matrix + decision framework by rack density
- **Dominant SERP format observed**: established comparison explainers (TechTarget, Sunbird, Enconnex, Park Place, Eaton, LG). Mature, competitive SERP with a fixed format
- **Top results fail to cover**: AI-era density specifics (100 kW+ racks); quantified PUE deltas presented as a decision table; the "air cooling caps out ~20 kW/rack" threshold is mentioned but never turned into a buyer's decision tree; modular deployment context absent
- **Evidence required**: efficiency comparisons cited to external sources (Eaton, TechTarget-cited studies); PODOS PUE only as design target
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

### 14. on-prem AI infrastructure vs cloud

- **Supporting queries**: on premise vs cloud AI, cloud vs on-prem GPU cost, AI infrastructure TCO cloud vs on premise, when to move AI off cloud
- **Intent / funnel**: C / MOFU
- **Target URL**: `/compare/on-prem-vs-cloud`
- **Content type**: comparison page with TCO framework
- **Dominant SERP format observed**: B2B blog explainers (Tamr, InfraCloud, Quinnox, Medium, plus low-authority content farms). Beatable SERP — no dominant authority
- **Top results fail to cover**: real TCO numbers over 3–5 years with assumptions shown; the facility problem (guides assume you have a data center — the actual blocker); compliance verticals treated in one throwaway paragraph; hybrid burst patterns
- **Evidence required**: all cost figures from named external sources; PODOS presented as the third option (own the facility without building one) — capability claims per spec sheet only
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

### 15. direct-to-chip vs immersion cooling

- **Supporting queries**: immersion cooling vs direct to chip, cold plate vs immersion, single-phase immersion vs D2C, liquid cooling types compared
- **Intent / funnel**: C / MOFU
- **Target URL**: `/compare/direct-to-chip-vs-immersion`
- **Content type**: comparison page
- **Dominant SERP format observed**: vendor comparison blogs on both sides (Submer = immersion vendor; Dixon, Steel & O'Brien = component vendors; Park Place, Data Center Frontier sponsored). Every top result has a horse in the race
- **Top results fail to cover**: genuinely neutral decision framework; serviceability/maintenance-time data; retrofit vs new-build economics; why a factory-integrated pod chooses D2C (integration + serviceability), stated with reasons rather than marketing
- **Evidence required**: PODOS's D2C choice explained via published design rationale; no disparagement of immersion beyond sourced trade-offs
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

---

## Cluster: invest-education

Compliance rules for this whole cluster: educational only; no investment advice, no securities terms, no return projections; every page carries the disclosure language pattern already used in `/invest` (offering defined solely by official documents; interest mode). These pages support `/invest` but must never duplicate its intent.

### 16. how to invest in AI infrastructure

- **Supporting queries**: invest in AI data centers, AI infrastructure investment opportunities, data center investing for individuals, private AI infrastructure investment risks
- **Intent / funnel**: I (YMYL) / TOFU for the invest funnel
- **Target URL**: `/invest/learn/ai-infrastructure-investing`
- **Content type**: educational explainer — the landscape (REITs, ETFs, suppliers, private funds, debt, early-stage private companies), with a heavy risk section
- **Dominant SERP format observed**: major finance media (Bloomberg explainer, US News, Forbes, Motley Fool) + finance newsletters (Global Data Center Hub, CREanalyst). **Very high E-E-A-T bar — YMYL SERP**
- **Top results fail to cover**: the early-stage/private-company path and its real risks (illiquidity, total-loss potential) — coverage skews to public equities; what "interest stage / non-binding" means; how offering documents work
- **Evidence required**: market-size figures cited to named sources (e.g., McKinsey $5.2T-by-2030 estimate appears in SERP — verify original before citing); zero PODOS return/valuation claims; legal review before publish. Ranking odds are low near-term — value is trust-building for direct /invest visitors, not SERP capture
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

### 17. data center cost per megawatt

- **Supporting queries**: data center construction cost per MW, how much does it cost to build a data center, AI data center capex, cost to build 1 MW data center
- **Intent / funnel**: I–C / MOFU (serves both buyers and investor-education readers)
- **Target URL**: `/invest/learn/cost-per-megawatt` (canonical home; buyers reach it from /deploy links — do not create a second cost page)
- **Content type**: data explainer — cost breakdown (electrical 40–45%, cooling 15–25% per SERP sources), traditional vs AI-optimized vs modular
- **Dominant SERP format observed**: cost-guide listicle blogs (dgtlinfra, Mastt, Opendock, ConstructElements, TrueLook, iRecruit benchmarks). Numbers vary widely across page one ($8–12M/MW standard, $15–20M+/MW AI-optimized)
- **Top results fail to cover**: reconciliation of the wildly divergent figures; modular/prefab per-MW economics vs stick-built (one vendor claims ~30% less $/kW — uncorroborated); a calculator; the site's own "$155–170M per MW" ProblemDiagnosis figure is far above SERP consensus — **reconcile or re-source that on-site claim before this page ships** (as written it will contradict the page and damage credibility)
- **Evidence required**: every $ figure cited to a named external benchmark; PODOS unit pricing = unknown (never published — do not imply)
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

---

## Cluster: insights

### 18. data center interconnection queue / time-to-power

- **Supporting queries**: grid interconnection queue data center, time to power data center, why data centers wait years for grid connection, PJM interconnection timeline, data center power crisis
- **Intent / funnel**: I / TOFU
- **Target URL**: `/insights/time-to-power`
- **Content type**: analysis piece with data — queue-length trend, regional variance, alternatives ranked by realistic timeline
- **Dominant SERP format observed**: analysis/news (RMI, Data Center Knowledge, Landgate, Camus Energy, Verse, Spencer Ogden, Introl). Fresh-content SERP — dates matter; will need periodic refresh
- **Top results fail to cover**: a ranked practical menu of workarounds (BTM, batteries + accelerated interconnect, modular-on-existing-power) with timeline evidence; most pieces diagnose without prescribing
- **Evidence required**: queue statistics cited (RMI, LBNL, PJM figures appear in SERP — verify originals); the site's "24–36 months" M-04 claim should align with the sourced range used here
- **Volume / KD / CPC**: unknown · **Status**: planned · **Last researched**: 2026-08-31

---

## Cluster: resources

No primary query in the researched set lands here yet; this cluster exists to absorb "what is X" glossary intent without cannibalizing pillars. Seed entries live in the ledger below (PUE, ORC, BTM, 800 VDC, rack density, DLC). Research SERPs before building — status = planned, last-researched = never.

---

## Unused-keyword ledger

Queries observed during research (in SERPs, supporting content, or on-site copy) that **no page currently targets**. Nothing may target these until a row above (or a new row) claims them — this ledger is the parking lot that prevents ad-hoc cannibalization.

| Query | Likely cluster | Notes | SERP researched? |
|---|---|---|---|
| prefabricated modular data center | deploy | currently a supporting query of #9; promote to its own page only if GSC shows distinct impressions | partially (2026-08-31) |
| modular data center vs traditional data center | compare | strong candidate for next compare page; SERP not directly inspected | no |
| what is PUE / data center PUE explained | resources | glossary; supports every cooling page | no |
| organic rankine cycle explained | resources | glossary; supports #6 | no |
| 800 VDC data center | engineering or resources | emerging term (NVIDIA-driven); watch — may deserve its own page as volume grows | partially (2026-08-31) |
| AI factory | platform | NVIDIA-coined category term; monitor before targeting | no |
| zero water data center cooling | engineering | differentiator angle; likely folds into #4 | no |
| relocatable / redeployable data center | platform or deploy | site claims redeployable foundation option; niche query | no |
| data center microgrid | engineering | overlaps #8; keep as supporting there | partially (2026-08-31) |
| GPU cluster cooling requirements | use-cases | supporting for #11 unless volume justifies a spoke | no |
| sovereign AI infrastructure / secure government AI compute | use-cases | maps to gov/secure use case (U-06); SERP unknown | no |
| colocation vs on-prem AI | compare | third leg of the #14 decision; candidate compare page | no |
| supplemental data center capacity | use-cases | site use case U-08; likely zero-volume phrasing — find the real query first | no |
| data center heat reuse revenue | engineering | supporting for #6 | partially (2026-08-31) |
| how long does it take to build a data center | deploy or insights | feeds #9/#18; snippet-format opportunity | no |
| invest in private AI companies | invest-education | YMYL; only with legal review | no |
| Syntropic / KV cache software product queries | (blocked) | no public substantiation of the software pillar exists on-site; do not build until it does | no |

---

## Anti-cannibalization mapping rules

1. **One primary query → one URL, forever.** The tables above are the registry. Before any new page or post is created, check this file; if the query (or a close synonym) is already assigned, the new content must either target a different query or be merged into the owning page.
2. **Synonyms share a URL.** "Modular AI data center", "containerized data center", "prefab AI data center" all resolve to `/platform` until GSC impression data proves distinct intent. Splitting comes only after data, never before.
3. **Compare pages own every "X vs Y" phrasing** (both orders, "difference between", "or"). Pillars and explainers link to compare pages for versus intent instead of adding versus sections that could outrank them.
4. **Glossary (`/resources/…`) owns "what is X" only when no pillar/explainer already targets definition intent.** #4 (direct-to-chip) targets its own "what is" — so no glossary entry for D2C; PUE gets a glossary entry because no page above targets "what is PUE".
5. **`/insights/` posts must not target any query owned by an evergreen page.** Insights are for time-bound analysis, data drops, and commentary. If a post starts ranking for an owned query, canonical or 301 it into the owning page.
6. **`/invest` (the money page) owns only navigational/brand investor queries** ("Podos invest", "Podos AI investor"). All non-brand investor-education queries route to `/invest/learn/…`, which links down-funnel to `/invest`. Never optimize `/invest` itself for generic queries — its legal posture (interest mode) must stay stable.
7. **Hub pages target head terms; spokes target modified terms.** `/use-cases` targets nothing competitive itself (it's a router); each spoke owns its vertical + modifier queries.
8. **Internal anchor discipline**: exact-match internal anchors for a query point only at its owning URL. Sibling pages use descriptive, non-exact anchors when linking near an owned query.
9. **Claims discipline (site-wide)**: targets stay labeled as targets (90–120 days, PUE, ORC output); no customers/deployments/certifications implied anywhere; investor-cluster pages carry disclosure blocks; unverified stats (VRAM-waste %, $/MW on-site figure, patent counts) are unknown until sourced — flagged inline above.

---

*Maintained in `docs/seo/keyword-map.md`. Update `last-researched` whenever a SERP is re-inspected; move ledger rows up into clusters as they're claimed. Volume/KD/CPC columns to be filled on first keyword-tool run.*
