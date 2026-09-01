/**
 * /resources/data-center-readiness-checklist — HUB, composed from the
 * PODOS SEO section library. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component. Keyword-map cluster ("data center readiness
 * checklist", informational). All external numbers cite the source
 * register; company claims render only from claims.ts publishable
 * entries with their required qualifiers.
 *
 * This page has NO images of its own, so it uses the image-free hero
 * (HeroEditorial) and image-free body sections only.
 *
 * As a hub it carries the inbound internal links for its two children:
 * /deploy/site-power-readiness and /resources/ai-infrastructure-glossary
 * are each linked twice — once from the child CardGrid, once from the
 * RelatedRail.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import {
  HeroEditorial,
  SummaryBand,
  ProseWithRail,
  CardGrid,
  MatrixTable,
  QuoteMetric,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

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

/** Flatten a run of domains into MatrixTable rows, keeping every check verbatim. */
function checkRows(codes: string[]) {
  return DOMAINS.filter((d) => codes.includes(d.code)).flatMap((d) =>
    d.rows.map(([item, pass, flag, cite]) => [
      <span key={`${d.code}-${item}-c`} className="pill">
        {d.code}
      </span>,
      item,
      pass,
      <span key={`${d.code}-${item}-f`}>
        {flag}
        {cite ? <Cite n={cite} /> : null}
      </span>,
    ]),
  );
}

const link: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

const TOC: [string, string][] = [
  ["#scoring", "How to score it"],
  ["#continue", "Where each domain continues"],
  ["#domains", "The eight domains"],
  ["#sr-01-04", "SR-01 – SR-04 checks"],
  ["#sr-05-08", "SR-05 – SR-08 checks"],
  ["#modular", "When the compute is modular"],
  ["#limitations", "When this is not the right fit"],
  ["#faq", "Questions"],
];

export default function DataCenterReadinessChecklistPage() {
  return (
    <main>
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

      {/* 1 · HERO — paper. No product shot on this page, so a stat hero. */}
      <HeroEditorial
        code="R-02"
        category="Resources · Site readiness"
        field="deploy"
        title="Data center readiness"
        accent="checklist"
        lede="A data center readiness checklist tests whether a specific site can host and energize compute, across eight domains: power and interconnection, space and pad, structural, network, water and heat rejection, permitting, logistics, and security. The 25 checks below each carry a pass criterion and the condition that should raise a flag."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Data center readiness checklist", path: PATH },
            ]}
          />
        }
        meta={
          <LastVerified
            published="2026-08-31"
            lastVerified="2026-08-31"
            author="Josef Elimelech"
            reviewer="PODOS AI Engineering"
          />
        }
        stats={[
          { value: "8", label: "Readiness domains" },
          { value: "25", label: "Pass / flag checks" },
          { value: String(SOURCES.length), label: "Cited sources" },
        ]}
      />

      {/* 2 · SCORING RULES AT A GLANCE — canvas */}
      <SummaryBand
        title="How the scoring works"
        items={[
          {
            code: "01",
            title: "Eight domains, 25 checks",
            body: "Power and interconnection, space and pad, structural, network, water and heat rejection, permitting, logistics, and security — each check with a pass criterion and a flag condition.",
          },
          {
            code: "02",
            title: "A flag is a price, not a rejection",
            body: "Every flag becomes a cost and a date. A parcel with four priced flags beats one with no flags and an unanswered interconnection question.",
          },
          {
            code: "03",
            title: "Unknown is the dangerous score",
            body: "Pass, flag, or unknown — and unknown is the state that hurts, because tired reviewers quietly score unknowns as passes.",
          },
          {
            code: "04",
            title: "Three answers set the schedule",
            body: "The written energization date, the heat-rejection method, and the transport route survey decide the timeline before the rest matter.",
          },
        ]}
      />

      {/* 3 · HOW TO SCORE IT — paper, prose with a navigation rail */}
      <ProseWithRail
        id="scoring"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {TOC.map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={{ ...link, fontSize: "0.9rem", textDecoration: "none" }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <SectionHead eyebrow="Method" title="How to score it" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            A flag is not a rejection but an unpriced item, and the discipline is converting every
            flag into a number and a date. A parcel with four priced flags beats one with no flags
            and an unanswered interconnection question. Three answers decide the schedule before the
            rest matter: the written energization date, the heat-rejection method, and the transport
            route survey.
          </p>
          <p>
            Score each check as pass (met, and evidenced by a document rather than a conversation),
            flag (not met, with an owner, a cost, and a date), or unknown — the most dangerous
            state, because tired reviewers quietly score unknowns as passes. Walk the domains in
            order: power first, because it eliminates sites outright; security last, because it
            rarely does. LBNL put US data-center electricity near 4.4% of national consumption in
            2023, with a 2028 range of 6.7% to 12%.<Cite n={3} /> The IEA projects data-centre
            demand rising from about 1.5% of global electricity in 2025 toward roughly 3% by 2030.
            <Cite n={1} />
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · CHILD PAGES — canvas. The hub's job: real links, not promises. */}
      <CardGrid
        id="continue"
        surface="canvas"
        field="deploy"
        columns={2}
        eyebrow="Where each domain continues"
        title="Two pages carry this checklist further"
        lede="Screening ends where paid engineering begins. SR-01 and SR-02 continue into the deployment sequence; the vocabulary the checks use is defined term by term in the glossary."
        items={[
          {
            code: "DEPLOY · STAGE 01",
            title: "Site and power readiness",
            body: (
              <>
                Stage one of a modular AI deployment takes SR-01 and SR-02 out of screening and into
                engineering: how to assess site power, network, access, pad and permitting — and the
                conditions that disqualify a site early.{" "}
                <Link href="/deploy/site-power-readiness" style={link}>
                  Site and power readiness
                </Link>
              </>
            ),
          },
          {
            code: "RESOURCE",
            title: "AI infrastructure glossary",
            body: (
              <>
                Plain-language definitions of 40 AI infrastructure terms used across these checks —
                PUE, direct-to-chip cooling, CDU, KV cache, interconnection queue, rack density, and
                more.{" "}
                <Link href="/resources/ai-infrastructure-glossary" style={link}>
                  AI infrastructure glossary
                </Link>
              </>
            ),
          },
        ]}
      />

      {/* 5 · THE EIGHT DOMAINS — paper. Every domain intro preserved. */}
      <CardGrid
        id="domains"
        surface="paper"
        columns={4}
        eyebrow="SR-01 – SR-08"
        title="The eight domains, in scoring order"
        lede="Walk them in order: power first, because it eliminates sites outright; security last, because it rarely does."
        items={DOMAINS.map((d) => ({ code: d.code, title: d.title, body: d.intro }))}
      />

      {/* 6 · CHECKS SR-01 – SR-04 — canvas */}
      <MatrixTable
        id="sr-01-04"
        surface="canvas"
        field="deploy"
        eyebrow="Checks 01 – 13"
        title="Power, space, structure, network"
        lede="The four domains that eliminate a site. Each row is one check: what a pass looks like, and the condition that should raise a flag."
        head={["Domain", "Check", "Pass when", "Flag when"]}
        rows={checkRows(["SR-01", "SR-02", "SR-03", "SR-04"])}
      />

      {/* 7 · CHECKS SR-05 – SR-08 — paper */}
      <MatrixTable
        id="sr-05-08"
        surface="paper"
        eyebrow="Checks 14 – 25"
        title="Water, permitting, logistics, security"
        lede="The four domains that price a site. Flags here rarely kill a project outright, but they are where unbudgeted cost accumulates."
        head={["Domain", "Check", "Pass when", "Flag when"]}
        rows={checkRows(["SR-05", "SR-06", "SR-07", "SR-08"])}
      />

      {/* 8 · INK BEAT */}
      <QuoteMetric
        quote="A flag is not a rejection but an unpriced item. A parcel with four priced flags beats one with no flags and an unanswered interconnection question."
        attribution="Method · How to score it"
        metric="25"
        label="Checks across eight domains"
        field="deploy"
      />

      {/* 9 · MODULAR APPLICATION — paper, prose */}
      <ProseWithRail id="modular" surface="paper">
        <SectionHead
          eyebrow="In the product"
          title="What changes when the compute is modular"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            A factory-built unit removes no domain from this list, but it moves work off the site
            into a controlled environment. Cooling, power distribution, and enclosure integration
            are tested before delivery, narrowing the site question to interfaces: a pad, a service
            point, a fiber entry, a heat-rejection connection. Each{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so SR-01 is scored
            against a known unit load rather than a moving estimate.
          </p>
          <p>
            That shifts weight onto SR-07: transport, laydown, and rigging become primary, because
            the delivery is the construction. It is also why interconnection dominates the timeline
            — PODOS{" "}
            <span data-claim="deployment-window">
              targets a 90-day window from order to commissioning
            </span>{" "}
            for a standard unit, which only helps on a site whose energization date can meet it.
          </p>
          <p>
            See the{" "}
            <Link href="/engineering/data-center-power-architecture" style={link}>
              power architecture
            </Link>{" "}
            behind SR-01 and{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
              direct-to-chip liquid cooling
            </Link>{" "}
            behind SR-05. The{" "}
            <Link href="/deploy" style={link}>
              deployment model
            </Link>{" "}
            covers moving from a scored checklist to an operating unit, and{" "}
            <Link href="/deploy/site-power-readiness" style={link}>
              site and power readiness
            </Link>{" "}
            is the stage that picks SR-01 up;{" "}
            <Link href="/use-cases" style={link}>
              use cases
            </Link>{" "}
            show which workloads justify which compromises; and{" "}
            <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={link}>
              modular vs traditional AI data centers
            </Link>{" "}
            covers the build decision. Terms sit in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={link}>
              AI infrastructure glossary
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 10 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="When this checklist is not the right fit"
        lede="This is a screening instrument for siting megawatt-scale AI compute. It is the wrong tool in five common situations."
        items={[
          "It does not replace engineering. Geotechnical borings, system-impact studies, arc-flash analysis, environmental review, and stamped calculations sit downstream of it.",
          "It assumes a greenfield or light-retrofit pad. Deep retrofits add hazardous-material surveys, tenant coordination, and riser capacity that this list does not model.",
          "It is jurisdiction-blind. Permitting sequence, noise ordinances, water rights, and tariffs vary enough that those domains must be re-specified locally.",
          "It prices nothing and scores one site at a time. Two sites with identical flags can differ by an order of magnitude in remedy cost.",
          "Colocation changes the list: leased capacity turns most of these physical questions into contractual ones — SLA definitions, remote-hands terms, per-cabinet density.",
        ]}
      />

      {/* 11 · FAQ — paper */}
      <FAQBlock items={FAQ} surface="paper" />

      {/* 12 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED — paper. Second inbound link for each child page. */}
      <RelatedRail
        title="Related reading"
        surface="paper"
        items={[
          {
            href: "/deploy/site-power-readiness",
            label: "DEPLOY",
            title: "Site and power readiness",
          },
          {
            href: "/resources/ai-infrastructure-glossary",
            label: "RESOURCE",
            title: "AI infrastructure glossary",
          },
          {
            href: "/engineering/data-center-power-architecture",
            label: "ENGINEERING",
            title: "Data center power architecture",
          },
          {
            href: "/compare/modular-ai-data-center-vs-traditional-data-center",
            label: "COMPARE",
            title: "Modular vs traditional AI data centers",
          },
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Score a site against"
        accent="a known unit load"
        body="Bring the energization date, the heat-rejection method, and the transport route survey. The configurator walks the same variables an engineering review would."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy", label: "Deployment model" }}
        field="deploy"
      />
    </main>
  );
}
