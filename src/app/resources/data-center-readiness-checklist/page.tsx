/**
 * /resources/data-center-readiness-checklist — site readiness checklist.
 *
 * Server component. Keyword-map cluster ("data center readiness
 * checklist", informational). All external numbers cite the source
 * register; company claims render only from claims.ts publishable
 * entries with their required qualifiers.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";

const PATH = "/resources/data-center-readiness-checklist";
const TITLE = "Data Center Readiness Checklist: Site Pass/Flag Criteria";
const DESCRIPTION =
  "A site readiness checklist for AI data centers: power and interconnection, pad and structural loads, network, water, permitting, logistics, and security.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Energy and AI — Executive Summary",
    publisher: "IEA",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
    date: "Apr 2025",
  },
  {
    n: 2,
    name: "Data centre electricity use surged in 2025, even with tightening bottlenecks",
    publisher: "IEA",
    url: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions",
    date: "2026",
  },
  {
    n: 3,
    name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://eta.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report",
    date: "Dec 2024",
  },
  {
    n: 4,
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 5,
    name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org",
    date: "2021",
  },
  {
    n: 6,
    name: "Demonstrating the Data Center as a Flexible Grid Asset",
    publisher: "NREL (DOE)",
    url: "https://docs.nrel.gov/docs/fy25osti/94844.pdf",
    date: "FY2025",
  },
  {
    n: 7,
    name: "HPC Data Center Waste Heat Reuse (ESIF)",
    publisher: "NREL (DOE)",
    url: "https://www.nrel.gov/computational-science/waste-heat-energy-reuse",
    date: "ongoing",
  },
  {
    n: 8,
    name: "NFPA 75 — Fire Protection of Information Technology Equipment, 2024 ed.",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "2024 ed.",
  },
  {
    n: 9,
    name: "NFPA 855 — Installation of Stationary Energy Storage Systems",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
  },
  {
    n: 10,
    name: "NFPA 70 — National Electrical Code (NEC)",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
  },
  {
    n: 11,
    name: "IEEE 3006 series — Power Systems Reliability (incl. 3006.7, continuous power systems)",
    publisher: "IEEE",
    url: "https://standards.ieee.org/ieee/3006.1/7391/",
    date: "2013–2018",
  },
  {
    n: 12,
    name: "Measuring energy and water efficiency for Microsoft datacenters",
    publisher: "Microsoft",
    url: "https://datacenters.microsoft.com/sustainability/efficiency/",
    date: "accessed 2026-08-31",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "What is a data center readiness checklist?",
    a: "A structured site assessment across the eight domains that decide whether compute can be energized at a location: power and interconnection, space and pad, structural, network, water and heat rejection, permitting, logistics, and security. Each item scores pass or flag, and every flag becomes a cost and a date.",
  },
  {
    q: "Which readiness item fails sites most often?",
    a: "Interconnection timing. A site can have adequate land, structure, fiber, and cooling water and still be unusable because the utility cannot energize the load inside the project schedule.",
  },
  {
    q: "How much power headroom should a readiness assessment require?",
    a: "Enough for mechanical and electrical overhead above IT load plus the density trajectory of the hardware, not day-one nameplate. Operator survey data shows fleet rack densities still climbing, so headroom sized to today's racks ages badly.",
  },
  {
    q: "Does this replace a feasibility study or geotechnical report?",
    a: "No. It is a screening instrument that decides which sites deserve paid engineering. Geotechnical borings, utility system-impact studies, environmental review, and stamped structural calculations all sit downstream of it.",
  },
];

/* ------------------------------------------------------------------ */
/* checklist data — 8 domains, 25 checks, pass/flag criteria           */
/* ------------------------------------------------------------------ */
type Row = [item: string, pass: string, flag: string, cite?: number];

const DOMAINS: { code: string; title: string; intro: string; rows: Row[] }[] = [
  {
    code: "SR-01",
    title: "Power availability and interconnection",
    intro: "This domain decides the schedule. Everything else on the list can be engineered around.",
    rows: [
      [
        "Firm capacity at the service point",
        "The utility confirms in writing the full connected load plus mechanical and electrical overhead.",
        "Capacity depends on a substation or transmission upgrade with no committed in-service date.",
      ],
      [
        "Energization date vs hardware delivery",
        "A written energization date precedes hardware arrival, with float for utility rework.",
        "The date is study-pending or trails delivery — the usual cause of stranded capital.",
        2,
      ],
      [
        "Voltage, transformer, and fault duty",
        "Medium-voltage service, transformer sizing, and available fault current are documented for equipment ratings.",
        "Only low-voltage service exists, or fault-current data is missing, forcing conservative gear selection.",
        10,
      ],
      [
        "Flexibility where capacity is short",
        "A curtailable arrangement and on-site storage siting are priced before the site is rejected.",
        "No curtailment tolerance, no firm capacity, and no storage plan — three constraints with no engineering answer.",
        6,
      ],
    ],
  },
  {
    code: "SR-02",
    title: "Space, pad, and clearances",
    intro: "Measure the usable rectangle, not the parcel.",
    rows: [
      [
        "Clear buildable rectangle",
        "Area net of setbacks, easements, and drainage fits the footprint plus service clearances.",
        "It fits only by encroaching on a setback, turning a site question into a variance question.",
      ],
      [
        "Pad and lift envelope",
        "Pad flatness, bearing, and finish are specified; a crane reaches every set position.",
        "Overhead conductors cross the approach with no de-energization window scheduled.",
      ],
      [
        "Expansion adjacency",
        "The next unit position and its power and cooling paths are reserved on the plan today.",
        "Phase two is assumed but undrawn, stranding the second unit across the parcel.",
      ],
    ],
  },
  {
    code: "SR-03",
    title: "Structural and geotechnical",
    intro:
      "Dense compute is a concentrated load on a small footprint; bearing capacity drives foundation cost more than area does.",
    rows: [
      [
        "Allowable bearing pressure",
        "A geotechnical report on this parcel supports the point and distributed loads as configured.",
        "Bearing capacity is inferred from adjacent construction rather than measured here.",
      ],
      [
        "Seismic, wind, and anchorage",
        "Design category is established and equipment anchorage details exist for that category.",
        "The category surfaces after equipment selection, forcing anchorage and enclosure rework.",
      ],
      [
        "Flood, grading, and drainage",
        "The pad sits above regulated flood elevation with drainage away from electrical equipment.",
        "Mapped flood zone, or stormwater discharge needs a permit outside the schedule.",
      ],
    ],
  },
  {
    code: "SR-04",
    title: "Network and connectivity",
    intro:
      "Score this against the workload the site will actually run — training and inference have different profiles.",
    rows: [
      [
        "Physically diverse fiber entry",
        "Two carrier paths enter via separate conduits and rights-of-way, verified on a route map.",
        "Two carriers share one duct bank: logical diversity without physical diversity.",
      ],
      [
        "Latency and data gravity",
        "Round-trip latency to users, data sources, and storage is measured and acceptable.",
        "The site is chosen for power while the corpus sits behind a metro egress bottleneck.",
      ],
      [
        "Out-of-band management path",
        "A management path independent of the production carrier exists for remote diagnosis.",
        "Management shares the production carrier, so the outage removes the means to diagnose it.",
      ],
    ],
  },
  {
    code: "SR-05",
    title: "Water, cooling, and heat rejection",
    intro:
      "The heat-rejection choice, not the cooling method, decides whether the site consumes water.",
    rows: [
      [
        "Rejection method and design conditions",
        "Dry or evaporative rejection is chosen against local design wet-bulb and the facility water class the hardware accepts.",
        "The method is deferred to detailed design, leaving water demand and plot area unresolved.",
        5,
      ],
      [
        "Water rights, makeup, and discharge",
        "Makeup supply, blowdown discharge, and withdrawal permits are confirmed before evaporative rejection is assumed.",
        "Evaporative rejection is assumed where water rights are contested; water per unit of energy is now a published operating metric.",
        12,
      ],
      [
        "Heat reuse adjacency",
        "An identified consumer of low-grade heat exists and its required return temperature is known.",
        "Heat reuse is claimed as a benefit with no offtaker, which makes it a marketing line.",
        7,
      ],
    ],
  },
  {
    code: "SR-06",
    title: "Permitting, code, and fire protection",
    intro:
      "Permitting is where optimistic schedules break. Meet the authority having jurisdiction before scoring the site.",
    rows: [
      [
        "Zoning, use, and noise",
        "Zoning permits the use by right and property-line noise limits are achievable as equipped.",
        "A conditional-use permit adds a public hearing calendar to the critical path.",
      ],
      [
        "Fire protection for IT equipment areas",
        "Detection and suppression follow the IT-equipment fire standard, accepted in concept by the AHJ.",
        "Suppression is assumed identical to ordinary commercial occupancy.",
        8,
      ],
      [
        "Energy storage fire code",
        "Stationary storage is sited and spaced to the energy-storage standard with a scoped hazard analysis.",
        "Storage appears on the single-line diagram but not in the fire-code review.",
        9,
      ],
    ],
  },
  {
    code: "SR-07",
    title: "Access, transport, and logistics",
    intro:
      "Routinely skipped, routinely expensive — prefabricated equipment only saves time if it can reach the pad.",
    rows: [
      [
        "Transport route survey",
        "A survey confirms turning radii, bridge ratings, clearances, and permits for the largest load.",
        "The route is assumed from a mapping application, which is how projects find a low bridge on delivery day.",
      ],
      [
        "Laydown, staging, and rigging",
        "Staging area, crane class, pick weights, and outrigger bearing are established before scoring.",
        "Deliveries must stage on a public road, leaving no tolerance for delay.",
      ],
      [
        "Commissioning labor",
        "Qualified trades and a testing authority are available locally in the scheduled window.",
        "Trades must be imported; staffing scarcity remains a persistent operator concern in survey data.",
        4,
      ],
    ],
  },
  {
    code: "SR-08",
    title: "Security and operations",
    intro: "Score how the site will be run, not only how it will be built.",
    rows: [
      [
        "Perimeter and access control",
        "Perimeter, lighting, cameras, and credentialed access are specified; utility and IT areas separated.",
        "Security is deferred to an operations phase with no budget line.",
      ],
      [
        "Response time and remote hands",
        "A qualified responder reaches the site inside the defined response window at any hour.",
        "The nearest qualified technician is hours away with no local support agreement.",
      ],
      [
        "Reliability basis and maintenance access",
        "Alarm routing and the electrical reliability basis follow recognized continuous-power practice, and components isolate without stopping compute.",
        "Redundancy is described in tier marketing language with no single-line analysis.",
        11,
      ],
    ],
  },
];

/* ------------------------------------------------------------------ */
/* small shared styles (server component — CSS-only hovers)            */
/* ------------------------------------------------------------------ */
const th: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 11.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
  textAlign: "left",
  padding: "0.65rem 0.9rem",
  borderBottom: "1px solid var(--edge-bright)",
  whiteSpace: "nowrap",
};

const td: CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.55,
  color: "var(--ink-dim)",
  padding: "0.65rem 0.9rem",
  borderBottom: "1px solid var(--edge-faint)",
  verticalAlign: "top",
  minWidth: "13rem",
};

const codePill: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  color: "var(--brand-deep)",
  background: "rgba(37,99,235,0.07)",
  border: "1px solid rgba(37,99,235,0.16)",
  borderRadius: 999,
  padding: "0.15rem 0.6rem",
  whiteSpace: "nowrap",
};

const h2Style: CSSProperties = {
  fontFamily: "var(--font-display), ui-sans-serif, system-ui",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  lineHeight: 1.1,
  color: "var(--ink-strong)",
  fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
};

const h3Style: CSSProperties = {
  fontFamily: "var(--font-display), ui-sans-serif, system-ui",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: "var(--ink-strong)",
  fontSize: "1.1rem",
};

const linkStyle: CSSProperties = {
  color: "var(--brand-deep)",
  textDecoration: "underline",
};

export default function DataCenterReadinessChecklistPage() {
  return (
    <>
      <SiteHeader />
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="Data center readiness checklist"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* ---------------- compact hero ---------------- */}
      <header
        className="container-site"
        style={{ paddingTop: "clamp(6.5rem, 12vh, 9rem)", paddingBottom: "clamp(2.5rem, 5vh, 4rem)" }}
      >
        <Breadcrumbs
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Data center readiness checklist", path: PATH },
          ]}
        />

        <p
          className="mt-8 inline-flex items-center gap-2"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--brand-deep)",
            background: "var(--glass-bg-strong)",
            border: "1px solid var(--edge-bright)",
            borderRadius: 999,
            padding: "0.35rem 0.9rem",
          }}
        >
          <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>R-02</span>
          <span aria-hidden style={{ opacity: 0.4 }}>
            ·
          </span>
          Resources
        </p>

        <h1
          className="mt-5 max-w-4xl"
          style={{
            fontFamily: "var(--font-display), ui-sans-serif, system-ui",
            fontWeight: 800,
            letterSpacing: "-0.038em",
            lineHeight: 1.05,
            fontSize: "clamp(2.2rem, 4.6vw, 3.9rem)",
            color: "var(--ink-strong)",
          }}
        >
          Data center readiness <span className="t-sweep-brand">checklist</span>
        </h1>

        <p className="t-lede mt-5 max-w-[62ch]" style={{ color: "var(--ink-dim)" }}>
          A data center readiness checklist tests whether a specific site can host and energize
          compute, across eight domains: power and interconnection, space and pad, structural,
          network, water and heat rejection, permitting, logistics, and security. The 25 checks
          below each carry a pass criterion and the condition that should raise a flag.
        </p>

        <div className="mt-6">
          <LastVerified
            published="2026-08-31"
            lastVerified="2026-08-31"
            author="Josef Elimelech"
            reviewer="PODOS AI Engineering"
          />
        </div>
      </header>

      {/* ---------------- article body ---------------- */}
      <article className="container-site" style={{ paddingBottom: "clamp(4rem, 8vh, 6rem)" }}>
        <div className="max-w-[76ch]">
          {/* -------- how to score -------- */}
          <section id="scoring" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>How to score it</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              A flag is not a rejection but an unpriced item, and the discipline is converting every
              flag into a number and a date. A parcel with four priced flags beats one with no flags
              and an unanswered interconnection question. Three answers decide the schedule before
              the rest matter: the written energization date, the heat-rejection method, and the
              transport route survey.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Score each check as pass (met, and evidenced by a document rather than a
              conversation), flag (not met, with an owner, a cost, and a date), or unknown — the
              most dangerous state, because tired reviewers quietly score unknowns as passes. Walk
              the domains in order: power first, because it eliminates sites outright; security
              last, because it rarely does. LBNL put US data-center electricity near 4.4% of
              national consumption in 2023, with a 2028 range of 6.7% to 12%.<Cite n={3} /> The IEA
              projects data-centre demand rising from about 1.5% of global electricity in 2025
              toward roughly 3% by 2030.<Cite n={1} />
            </p>
          </section>

          {/* -------- the eight domains -------- */}
          {DOMAINS.map((d) => (
            <section
              key={d.code}
              id={d.code.toLowerCase()}
              className="mt-14"
              style={{ scrollMarginTop: 96 }}
            >
              <h2 style={h2Style}>
                <span style={{ ...codePill, marginRight: "0.7rem", verticalAlign: "middle" }}>
                  {d.code}
                </span>
                {d.title}
              </h2>
              <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
                {d.intro}
              </p>

              <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={th}>Check</th>
                      <th style={th}>Pass when</th>
                      <th style={th}>Flag when</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.rows.map(([item, pass, flag, cite]) => (
                      <tr key={item}>
                        <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>{item}</td>
                        <td style={td}>{pass}</td>
                        <td style={td}>
                          {flag}
                          {cite ? <Cite n={cite} /> : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          {/* -------- limitations -------- */}
          <section id="limitations" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>When this checklist is not the right fit</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              This is a screening instrument for siting megawatt-scale AI compute. It is the wrong
              tool in five common situations.
            </p>
            <ul className="mt-4 grid gap-3 list-disc pl-5">
              {[
                "It does not replace engineering. Geotechnical borings, system-impact studies, arc-flash analysis, environmental review, and stamped calculations sit downstream of it.",
                "It assumes a greenfield or light-retrofit pad. Deep retrofits add hazardous-material surveys, tenant coordination, and riser capacity that this list does not model.",
                "It is jurisdiction-blind. Permitting sequence, noise ordinances, water rights, and tariffs vary enough that those domains must be re-specified locally.",
                "It prices nothing and scores one site at a time. Two sites with identical flags can differ by an order of magnitude in remedy cost.",
                "Colocation changes the list: leased capacity turns most of these physical questions into contractual ones — SLA definitions, remote-hands terms, per-cabinet density.",
              ].map((t) => (
                <li key={t.slice(0, 24)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* -------- modular application -------- */}
          <section id="modular" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>What changes when the compute is modular</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              A factory-built unit removes no domain from this list, but it moves work off the site
              into a controlled environment. Cooling, power distribution, and enclosure integration
              are tested before delivery, narrowing the site question to interfaces: a pad, a
              service point, a fiber entry, a heat-rejection connection. Each{" "}
              <Link href="/platform/podos-pod" style={linkStyle}>
                PODOS Pod
              </Link>{" "}
              is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
              and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so SR-01 is
              scored against a known unit load rather than a moving estimate.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              That shifts weight onto SR-07: transport, laydown, and rigging become primary, because
              the delivery is the construction. It is also why interconnection dominates the
              timeline — PODOS{" "}
              <span data-claim="deployment-window">
                targets a 90-day window from order to commissioning
              </span>{" "}
              for a standard unit, which only helps on a site whose energization date can meet it.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              See the{" "}
              <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
                power architecture
              </Link>{" "}
              behind SR-01 and{" "}
              <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
                direct-to-chip liquid cooling
              </Link>{" "}
              behind SR-05. The{" "}
              <Link href="/deploy" style={linkStyle}>
                deployment model
              </Link>{" "}
              covers moving from a scored checklist to an operating unit;{" "}
              <Link href="/use-cases" style={linkStyle}>
                use cases
              </Link>{" "}
              show which workloads justify which compromises; and{" "}
              <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>
                modular vs traditional AI data centers
              </Link>{" "}
              covers the build decision. Terms sit in the{" "}
              <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
                AI infrastructure glossary
              </Link>
              .
            </p>
          </section>

          {/* -------- FAQ -------- */}
          <section id="faq" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Frequently asked questions</h2>
            <div className="mt-6 grid gap-6">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <h3 style={h3Style}>{f.q}</h3>
                  <p className="t-body mt-2" style={{ color: "var(--ink-dim)" }}>
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <EvidenceSourceRail sources={SOURCES} />
        </div>
      </article>
    </main>
      <Footer />
    </>
  );
}
