# External Source Register — Engineering & Insight Content

Authoritative register of external sources for Podos AI engineering and insight content (blog posts, technical pages, investor-facing claims). Every fact-bearing claim in published content should trace to a source in this register, cited at the tier noted.

**Verification status:** every row in the main table was verified to exist via web search on 2026-08-31 (title + URL confirmed in search results). Rows in the "Unverified / verify before citing" section were NOT independently confirmed at the exact URL and must be checked before use.

## Reliability tiers

| Tier | Meaning | Usage rule |
|---|---|---|
| T1 | Primary authority: government lab, IGO, standards body, or the vendor's own spec/disclosure page | Cite directly; safe for headline claims |
| T2 | Peer-reviewed or industry-institution research (arXiv/OpenReview, Uptime Institute, OCP working groups) | Cite directly; attribute authors/institution |
| T3 | Reputable trade press or third-party explainer | Background only; never the sole source for a numeric claim |

## Register

| Source | Publisher | URL | Date | Supports which topics | Tier | Review by |
|---|---|---|---|---|---|---|
| Energy and AI (report; incl. Executive Summary, "Energy demand from AI", "Energy supply for AI" chapters) | IEA | https://www.iea.org/reports/energy-and-ai/executive-summary | Apr 2025 | Global data-centre electricity demand (~1.5% of global demand 2025 → ~3% / ~945–950 TWh by 2030); US DC share of demand growth; AI-driven load growth | T1 | 2027-04-30 |
| Electricity 2026 — Demand chapter | IEA | https://www.iea.org/reports/electricity-2026/demand | 2026 (exact month unknown) | Near-term global/US electricity demand forecasts incl. data centres | T1 | 2027-02-28 |
| Electricity Mid-Year Update 2025 — Demand | IEA | https://www.iea.org/reports/electricity-mid-year-update-2025/demand-global-electricity-use-to-grow-strongly-in-2025-and-2026 | 2025 | 2025–2026 global electricity demand growth (~3%/yr) context | T1 | 2026-12-31 |
| Key Questions on Energy and AI — Executive Summary | IEA | https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary | 2026 (exact date unknown) | Updated data-centre demand figures; 17% DC electricity growth in 2025; 2035 Base Case ~1,200 TWh | T1 | 2027-06-30 |
| News: "Data centre electricity use surged in 2025…" | IEA | https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions | 2025/2026 (unknown) | Grid-connection bottlenecks; 2025 DC demand surge narrative | T1 | 2027-06-30 |
| 2024 United States Data Center Energy Usage Report (LBNL-2001637; Shehabi et al.) | Lawrence Berkeley National Laboratory | https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf (landing: https://eta.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report) | Dec 2024 | US DC electricity 4.4% of US demand (2023) → 6.7–12% by 2028 (up to ~580 TWh); historical US DC consumption since 2014; mandated by Energy Act of 2020 | T1 | 2027-08-31 |
| Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9, Datacom Series) | ASHRAE | https://www.ashrae.org (bookstore; no free canonical PDF — cite the book, not scraped copies) | 2021 | Air-cooled classes A1–A4 (A4 up to 40°C inlet); H1 high-density class; liquid-cooling classes named by max facility water temp; humidity limits | T1 | 2027-08-31 |
| White paper: Emergence and Expansion of Liquid Cooling in Mainstream Data Centers | ASHRAE TC 9.9 | https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf | unknown (c. 2021) | Why liquid cooling is displacing air at high rack densities; facility water temperature guidance | T1 | 2027-08-31 |
| Cooling Environments Project (umbrella: cold plate, CDU, immersion, rear-door HX, heat reuse) | Open Compute Project | https://www.opencompute.org/projects/cooling-environments | ongoing | Industry standardization scope for DC liquid cooling | T2 | 2027-02-28 |
| ACS Liquid Cooling Cold Plate Requirements, Rev 1.0 | Open Compute Project | https://www.opencompute.org/documents/ocp-acs-liquid-cooling-cold-plate-requirements-pdf | unknown | Cold-plate interface/operational requirements; multi-vendor DLC ecosystem | T2 | 2027-02-28 |
| OCP Immersion Requirements, Rev 2.10 | Open Compute Project | https://www.opencompute.org/documents/ocp-acs-immersion-requirements-rev-2-1-pdf | unknown | Immersion cooling requirements | T2 | 2027-02-28 |
| OAI System Liquid Cooling Guidelines | Open Compute Project | https://www.opencompute.org/documents/oai-system-liquid-cooling-guidelines-in-ocp-template-mar-3-2023-update-pdf | Mar 2023 | Liquid cooling for open accelerator infrastructure (AI systems) | T2 | 2027-02-28 |
| Global Data Center Survey 2025 (15th annual; 800+ operator respondents, fielded Apr–May 2025) | Uptime Institute | https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025 | Jul 2025 (press release 2025-07-30) | Outage rates (50% had impactful outage in 3 yrs); industry-average PUE flat ~6 yrs; rack densities rising into 10–30 kW band; staffing/cost/capacity-forecast concerns | T2 | 2027-07-31 |
| GB200 NVL72 product page | NVIDIA | https://www.nvidia.com/en-us/data-center/gb200-nvl72/ | ongoing (spec page) | Official rack-scale specs: 36 Grace CPUs + 72 Blackwell GPUs, liquid-cooled, single NVLink domain, LLM-inference performance claims. Per-rack kW draw figures (~120–132 kW) circulate via third parties — confirm on the official datasheet before publishing a number | T1 | 2027-02-28 |
| Data center efficiency / PUE page (fleet-wide trailing-12-month PUE, 1.09 per latest reporting) | Google | https://datacenters.google/efficiency/ | ongoing (updated annually) | Hyperscaler best-in-class PUE benchmark; PUE measurement methodology (all-season, all-overhead TTM) | T1 | 2027-06-30 |
| Measuring energy and water efficiency for Microsoft datacenters | Microsoft | https://datacenters.microsoft.com/sustainability/efficiency/ | ongoing | Microsoft design PUE 1.12; WUE 0.30 L/kWh (vs 0.49 in 2021); regional fact sheets | T1 | 2027-06-30 |
| Azure blog: How Microsoft measures datacenter water and energy use | Microsoft | https://azure.microsoft.com/en-us/blog/how-microsoft-measures-datacenter-water-and-energy-use-to-improve-azure-cloud-sustainability/ | unknown (blog, c. 2022) | PUE/WUE methodology definitions | T1 | 2027-06-30 |
| 2023 Environmental Data Index (Meta Sustainability Report) | Meta | https://sustainability.atmeta.com/asset/2023-environmental-data-index/ | 2023 report year | Meta fleet PUE ~1.08–1.09, WUE ~0.18–0.20 L/kWh; DC electricity consumption disclosures | T1 | 2027-06-30 |
| TurboQuant: Online Vector Quantization with Near-optimal Distortion Rate | arXiv (2504.19874) / OpenReview (ICLR 2026) | https://arxiv.org/abs/2504.19874 and https://openreview.net/forum?id=tO3ASKZlok | Apr 2025 (arXiv v1) | KV-cache quantization: quality-neutral at ~3.5 bits/channel, marginal loss at ~2.5 bits; random-rotation approach; inference memory-footprint reduction | T2 | 2027-08-31 |
| Statistical Inference and Quality Measures of KV Cache Quantisations Inspired by TurboQuant (D'Alberto) | arXiv (2605.08114) | https://arxiv.org/abs/2605.08114 | 2026 | Quality-measurement methodology for KV-cache quantization | T2 | 2027-08-31 |
| Demonstrating the Data Center as a Flexible Grid Asset (NREL/Verrus Vulcan platform) | NREL (DOE) | https://docs.nrel.gov/docs/fy25osti/94844.pdf | FY2025 | 70 MW grid-interactive DC demo; 35 MW BESS dispatch <5 s with SLAs intact; DCs as demand-response assets | T1 | 2027-08-31 |
| Demand Response / Demand Flexibility Analysis | NREL (DOE) | https://www.nrel.gov/analysis/demand-flexibility-value-and-participation-mechanisms | ongoing | Demand-flexibility valuation and participation mechanisms | T1 | 2027-08-31 |
| HPC Data Center Waste Heat Reuse (ESIF) | NREL (DOE) | https://www.nrel.gov/computational-science/waste-heat-energy-reuse | ongoing | Heat reuse in practice: ESIF PUE ~1.04; office heating from HPC waste heat; energy-recovery water loop | T1 | 2027-08-31 |
| Opportunities to Use Energy Efficiency and Demand Flexibility to Reduce Data Center Energy Use and Peak Demand | ACEEE | https://www.aceee.org/sites/default/files/pdfs/opportunities_to_use_energy_efficiency_and_demand_flexibility_to_reduce_data_center_energy_use_and_peak_demand.pdf | unknown | DC efficiency + demand-flexibility policy analysis | T2 | 2027-08-31 |
| Liquid in the Rack: Liquid Cooling Your Data Center (NREL presentation hosted by LBNL Center of Expertise) | LBNL / NREL (DOE) | https://datacenters.lbl.gov/sites/default/files/Liquid_Cooling_Your_Data_Center-NREL-EE.pdf | unknown | Practical DLC retrofit guidance from the federal labs | T1 | 2027-08-31 |
| IEEE 3006 series — Power Systems Reliability (esp. 3006.7-2013, "7×24" continuous power systems) | IEEE | https://standards.ieee.org/ieee/3006.1/7391/ (series index via IEEE SA; 3006.7 on IEEE Xplore) | 2013–2018 (per part) | Reliability planning/analysis of critical-facility power incl. electrical distribution and mechanical cooling | T1 | 2028-08-31 |
| NFPA 75 — Standard for the Fire Protection of Information Technology Equipment, 2024 ed. | NFPA | https://www.nfpa.org (catalog; paywalled — see UL explainer: https://code-authorities.ul.com/wp-content/uploads/sites/40/2015/12/NFPA-75-and-Fire-Protection-and-Suppression-in-Data-Centers-white-paper_final.pdf) | 2024 ed. | Fire protection of ITE areas/data centers; 2024 ed. moved Li-ion battery requirements out to NFPA 855 | T1 | 2028-08-31 |
| NFPA 855 — Standard for the Installation of Stationary Energy Storage Systems | NFPA | https://www.nfpa.org (catalog; paywalled) | current ed. (year unknown) | BESS installation/fire-safety requirements relevant to on-site storage | T1 | 2028-08-31 |
| NFPA 70 — National Electrical Code (NEC) | NFPA | https://www.nfpa.org (catalog; paywalled) | current ed. (year unknown) | Electrical installation requirements incl. emergency-circuit wiring for suppression systems | T1 | 2028-08-31 |

## Unverified / verify before citing

- **Google Environmental Report (annual PDF)** — the efficiency page above is verified; the exact current-year report PDF URL at sustainability.google was not fetched. Verify the PDF URL and report year before deep-linking.
- **Exact NFPA document pages on nfpa.org** — the standards themselves are confirmed to exist (via UL and industry explainers above), but nfpa.org deep links were not fetched. Link only the nfpa.org catalog page you have opened.
- **GB200 NVL72 per-rack power draw (120 kW nominal / 130–132 kW observed)** — circulating in T3 sources (Supermicro datasheet lists rack figures; trade blogs report deployed draw). Confirm against NVIDIA's official datasheet before publishing a number.
- **IEA "Electricity 2025"** (the Feb 2025 annual) — superseded in search results by Electricity 2026 and the Mid-Year Update; if citing 2025-vintage forecasts, pull the exact report page first.
- **Uptime Institute Cooling Systems Survey** (separate from the Global Survey) — exists as a product line but no specific edition was verified; check intelligence.uptimeinstitute.com.

## Maintenance rules

1. Annual reports (IEA, Uptime, hyperscaler disclosures) roll every 12 months — the review-by dates above assume the next edition supersedes; re-point citations at the newest edition on review.
2. Never cite Scribd/StudyLib/third-party PDF mirrors of paywalled standards (ASHRAE, NFPA, IEEE) — cite the standard by name/edition and link the publisher's catalog.
3. Numbers move: any TWh, PUE, WUE, kW, or % figure copied into site content must carry the source's as-of year inline.
4. T3 trade-press links (DCD, Data Center Knowledge, etc.) may be used for narrative color only and are deliberately excluded from this register.
