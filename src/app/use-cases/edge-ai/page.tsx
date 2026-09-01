/**
 * /use-cases/edge-ai — Archetype B, use case.
 * See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component. Keyword-map cluster #12 ("edge AI infrastructure",
 * informational/TOFU). This page has NO dedicated imagery, so the hero is
 * editorial and the composition leans on tables, cards and the ink beat
 * instead of media — deliberately a different shape from /use-cases/enterprise-ai.
 *
 * External numbers cite the source register; company claims render only from
 * claims.ts publishable entries with their required qualifiers.
 */

import type { CSSProperties } from "react";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import {
  HeroEditorial,
  SummaryBand,
  ProseWithRail,
  MatrixTable,
  CardGrid,
  QuoteMetric,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/use-cases/edge-ai";
const TITLE = "Edge AI Infrastructure: Placing Compute Near the Data";
const DESCRIPTION =
  "How megawatt-scale edge AI infrastructure gets sited: latency-driven placement, power and connectivity limits, unattended operation, and when cloud wins.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://eta.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report",
    date: "Dec 2024",
  },
  {
    n: 2,
    name: "Energy and AI — Executive Summary",
    publisher: "IEA",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
    date: "Apr 2025",
  },
  {
    n: 3,
    name: "Data centre electricity use surged in 2025, even with tightening bottlenecks (news)",
    publisher: "IEA",
    url: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions",
    date: "accessed 2026-08-31",
  },
  {
    n: 4,
    name: "Global Data Center Survey 2025 (800+ operator respondents)",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 5,
    name: "Commercial Vehicle Size and Weight Program",
    publisher: "Federal Highway Administration (US DOT)",
    url: "https://ops.fhwa.dot.gov/freight/sw/overview/index.htm",
    date: "accessed 2026-08-31",
  },
  {
    n: 6,
    name: "ICC/MBI 1205-2021 — Inspection and Regulatory Compliance in Off-Site Construction",
    publisher: "International Code Council / Modular Building Institute",
    url: "https://www.iccsafe.org/building-safety-journal/bsj-technical/new-brief-explores-implementation-of-icc-mbi-standards-1200-and-1205-for-off-site-construction/",
    date: "2021 ed.",
  },
  {
    n: 7,
    name: "Climatic design conditions — Weather Data Viewer / Handbook—Fundamentals Ch. 14",
    publisher: "ASHRAE",
    url: "https://weather.ashrae.org/",
    date: "2025 ed.",
  },
  {
    n: 8,
    name: "IEC 60529 — Degrees of protection provided by enclosures (IP Code)",
    publisher: "IEC",
    url: "https://www.iec.ch/ip-ratings",
    date: "1989 + AMD1:1999 + AMD2:2013",
  },
  {
    n: 9,
    name: "FAQs: Enclosures (ANSI/NEMA 250 enclosure types)",
    publisher: "NEMA",
    url: "https://www.nema.org/docs/default-source/standards-document-library/faq-enclosures.pdf",
    date: "accessed 2026-08-31",
  },
  {
    n: 10,
    name: "Redfish Scalable Platforms Management API Specification (DSP0266)",
    publisher: "DMTF",
    url: "https://www.dmtf.org/standards/redfish",
    date: "v1.24.0, Apr 2026",
  },
  {
    n: 11,
    name: "SP 800-53 Rev. 5 — Security and Privacy Controls (PE control family)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final",
    date: "Sep 2020, upd. 2025",
  },
  {
    n: 12,
    name: "Demonstrating the Data Center as a Flexible Grid Asset",
    publisher: "NREL (DOE)",
    url: "https://docs.nrel.gov/docs/fy25osti/94844.pdf",
    date: "FY2025",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "Does an edge site need a fiber connection?",
    a: "It needs enough connectivity for control, telemetry, model updates, and results — not for the raw sensor firehose, which is why the compute moved in the first place. Microwave, satellite, or a modest leased line can work, but the design must treat the uplink as intermittent: local buffers, queued replication, and graceful degradation when the link drops.",
  },
  {
    q: "What breaks first at an unattended site?",
    a: "Usually nothing dramatic: a clogged filter, a failed fan or pump, a battery that silently lost capacity, an expired certificate. Each is trivial with staff on site and expensive without, which is why out-of-band telemetry and remote power control matter more at the edge than raw redundancy.",
  },
  {
    q: "When is centralized cloud still the better answer?",
    a: "Whenever the workload tolerates the round trip, the data can legally and economically move, and utilization is bursty. Pretraining, batch analytics, and experimental work almost always belong in a central region, where capacity is pooled, staffed, and paid for by the hour instead of by the site.",
  },
];

const link: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

/* Site-constraint rows: [code, constraint, what to check, why it bites, cite] */
const CONSTRAINTS: [string, string, string, string, number | null][] = [
  [
    "EA-01",
    "Available power",
    "Firm capacity at the meter, the utility's queue position for any increase, and what the site can hold during an outage.",
    "Edge sites rarely sit next to spare megawatts, and grid-connection delay is now a headline constraint on siting generally.",
    3,
  ],
  [
    "EA-02",
    "Uplink and its failure modes",
    "Committed bandwidth, path diversity, expected outage duration, and whether the link is metered.",
    "The workload moved because raw data will not fit up the pipe. Control, telemetry, and model distribution still need a link that fails predictably rather than silently.",
    null,
  ],
  [
    "EA-03",
    "Climate envelope",
    "Site-specific cooling design dry bulb, coincident wet bulb, and extreme annual dew point — not a regional average.",
    "Heat rejection is sized against the design day. ASHRAE publishes per-station design conditions precisely because a regional average is how equipment gets undersized.",
    7,
  ],
  [
    "EA-04",
    "Delivery and access",
    "Road classification, bridge and turn geometry, crane or offload plan, and the legal envelope of the vehicle.",
    "Federal rules fix National Network width at 102 inches and interstate limits at 80,000 lb gross, height left to the states — a unit either fits that envelope or needs permits and escorts.",
    5,
  ],
  [
    "EA-05",
    "Physical protection",
    "Ingress rating for dust and water, corrosion and icing exposure, and the enclosure type the local code official expects.",
    "IEC 60529 IP codes and ANSI/NEMA 250 types overlap but are not interchangeable; NEMA adds corrosion, icing, and construction requirements outdoor sites actually meet.",
    8,
  ],
  [
    "EA-06",
    "Permitting path",
    "Whether the jurisdiction runs an industrialized-building program, accepts third-party in-plant inspection, and what remains for on-site final inspection.",
    "Off-site construction standards exist for this exact split, but the authority having jurisdiction still governs and small jurisdictions vary widely.",
    6,
  ],
  [
    "EA-07",
    "People within reach",
    "Distance to the nearest qualified technician, contracted response time, and who holds the spares.",
    "Staffing is a persistent operator concern in survey data, and a remote site turns every hands-on task into a scheduled trip.",
    4,
  ],
];

/* The minimum before a site is left alone: [code, new short title, verbatim requirement] */
const UNATTENDED: [string, string, string][] = [
  [
    "01",
    "Out-of-band telemetry and control",
    "Out-of-band telemetry and control on a path independent of the production network — thermal, power, and health data plus remote power cycling. Redfish gives a vendor-neutral model for exactly this.",
  ],
  [
    "02",
    "Fail-safe thermal behaviour",
    "Fail-safe thermal behaviour: on loss of the uplink, cooling holds a safe state and sheds compute rather than waiting for an instruction that will not arrive.",
  ],
  [
    "03",
    "Local fire actuation",
    "Automated fire detection and suppression with local actuation, because a remote confirmation step is not available.",
  ],
  [
    "04",
    "Access control mapped to a control set",
    "Physical access control, monitoring, and visitor records mapped to a recognised control set — NIST SP 800-53's physical and environmental protection family is the usual reference.",
  ],
  [
    "05",
    "Deterministic recovery",
    "Deterministic recovery: after a power loss the site restarts to a known state and reports it, with nobody present to sequence the startup.",
  ],
  [
    "06",
    "Spares planned as a trip",
    "A spares and consumables plan that assumes a scheduled trip — filters, pumps, fans, batteries, and the tooling to swap them.",
  ],
];

const WHEN_NOT: string[] = [
  "The workload is bursty. Central regions pool demand across thousands of tenants; a dedicated edge site is paid for whether or not it is busy, and low utilization destroys the economics.",
  "The job is training rather than serving. Pretraining wants the biggest possible interconnect domain and tolerates being far away; it belongs where that fabric already exists.",
  "The latency requirement is a preference, not a deadline. If nothing breaks when the response is slower, the problem is capacity or model size — both cheaper to fix centrally.",
  "The data can move legally and affordably. If the uplink can carry it and no jurisdiction forbids it, shipping data beats shipping a facility.",
  "Nobody owns operations. An edge site needs a named team with a response contract; without one, it runs beautifully for six months and then quietly stops.",
  "The power question has no answer yet. If firm capacity, storage, or the interconnect queue is unresolved, fix the electrical story first — grid connection is a bottleneck, not a formality.",
];

export default function EdgeAiUseCasePage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Edge AI infrastructure: siting megawatt-class compute near the data"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — editorial: this page has no dedicated imagery */}
      <HeroEditorial
        category="Use case · Edge AI"
        title="Edge AI infrastructure,"
        accent="placed honestly"
        lede="Move AI compute to the edge for one of three reasons: the round trip to a central region breaks the application, the data cannot legally or economically leave the site, or the uplink is narrower than the data being produced. If none of those is true, centralized cloud is the better answer. What follows is what edge placement actually costs — power, connectivity, climate, access, and the maintenance reality of an unattended site."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Use cases", path: "/use-cases" },
              { name: "Edge AI", path: PATH },
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
          { value: "3", label: "Drivers that move placement" },
          { value: "7", label: "Site constraints to clear" },
          { value: "6", label: "Requirements before it runs unattended" },
        ]}
      />

      {/* 2 · THE TEST — canvas */}
      <SummaryBand
        title="The three drivers, in order of durability"
        items={[
          {
            code: "01",
            title: "Latency with a deadline",
            body: "A control loop, a robotic cell, or an interactive assistant that misses a real deadline on the round trip. Only geography closes that gap.",
          },
          {
            code: "02",
            title: "Data gravity",
            body: "Sensor, imaging, and video streams that produce more per hour than the uplink can move in an hour. The compute goes to the data.",
          },
          {
            code: "03",
            title: "Jurisdiction and control",
            body: "Data that cannot leave a country, a campus, or a classified boundary. Categorical rather than economic — it survives every round of cost-cutting.",
          },
        ]}
      />

      {/* 3 · DEFINITION + DRIVERS — prose with a rail */}
      <ProseWithRail
        id="definition"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {[
                ["#definition", "What “edge AI” means here"],
                ["#drivers", "Three drivers"],
                ["#constraints", "Site constraints"],
                ["#power", "The power stall point"],
                ["#unattended", "Unattended operation"],
                ["#maintenance", "Maintenance reality"],
                ["#limitations", "When cloud wins"],
                ["#faq", "Questions"],
              ].map(([href, label]) => (
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
        <SectionHead
          eyebrow="Definition"
          title="Two different things are called “edge AI”"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The first is device-level: a compact model running on a camera, a controller, or a
            handset, measured in watts. The second is facility-level: racks of accelerators placed
            at a regional site, measured in hundreds of kilowatts or megawatts. Most search results
            describe the first. This page is about the second — the tier where siting, power, and
            cooling decisions get made.
          </p>
          <p>
            The reason the second tier exists is that compute has concentrated. US data centres
            consumed roughly 4.4% of national electricity in 2023, on a trajectory the federal
            lab&apos;s modelling puts at 6.7–12% by 2028.<Cite n={1} /> The IEA describes the same
            concentration globally, with data-centre demand rising sharply through 2030.
            <Cite n={2} /> Concentration is efficient, but it puts compute a long way from most of
            the places data is created. Edge placement is the deliberate, expensive exception.
          </p>

          <h2 className="h2" id="drivers" style={{ marginTop: "3rem", scrollMarginTop: 96 }}>
            Three drivers that genuinely move placement
          </h2>
          <p style={{ marginTop: "1.25rem" }}>
            <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Latency.</strong>{" "}
            Distance sets a floor on round-trip time that no amount of bandwidth removes. If a
            control loop, a robotic cell, or an interactive assistant has a deadline the round trip
            cannot meet, no software fix closes the gap — only geography does. The honest test is
            whether there is a real deadline. Many workloads called latency-sensitive are just
            sensitive to being slow, and those are throughput problems.
          </p>
          <p>
            <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Data gravity.</strong>{" "}
            High-rate sensor, imaging, and video streams are usually cheaper to process where they
            land than to ship. When the volume produced per hour exceeds what the uplink can move
            in an hour, the decision is already made: compute goes to the data.
          </p>
          <p>
            <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>
              Jurisdiction and control.
            </strong>{" "}
            Some data cannot leave a country, a campus, or a classified boundary. That constraint
            is categorical rather than economic — it does not respond to a better price per hour,
            and it is the one driver that survives every round of cost-cutting.
          </p>
          <p>
            Notably absent from that list: cost. Edge sites are usually more expensive per unit of
            compute, because they lose the pooling that makes central capacity cheap. Anyone
            selling edge placement as a savings story should be asked for the utilization
            assumption underneath it.
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · CONSTRAINTS — wide matrix, canvas */}
      <MatrixTable
        id="constraints"
        eyebrow="Site survey"
        title="What an edge site imposes on the design"
        lede="A remote or constrained site removes the assumptions a purpose-built facility provides by default. These seven decide feasibility, in survey order."
        surface="canvas"
        field="deploy"
        head={["#", "Constraint", "What to establish", "Why it bites at the edge"]}
        rows={CONSTRAINTS.map(([code, name, check, why, cite]) => [
          <span key={code} className="pill">
            {code}
          </span>,
          <span key={`${code}-n`} style={{ color: "var(--ink-strong)", fontWeight: 500 }}>
            {name}
          </span>,
          check,
          <span key={`${code}-w`}>
            {why}
            {cite ? <Cite n={cite} /> : null}
          </span>,
        ])}
      />

      {/* 5 · POWER — prose, paper */}
      <ProseWithRail id="power" surface="paper">
        <SectionHead
          eyebrow="EA-01 · Power"
          title="Where edge projects most often stall"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Power is where edge projects most often stall. Where firm capacity is short, on-site
            storage can make a site viable by shaping the load rather than raising the connection:
            a federal-lab demonstration of a 70 MW data centre run as a flexible grid asset
            dispatched 35 MW of battery storage in under five seconds with service levels intact.
            <Cite n={12} /> The technique scales down, but it turns a passive electrical service
            into an operated system. The{" "}
            <Link href="/engineering/data-center-power-architecture" style={link}>
              power architecture
            </Link>{" "}
            page covers the distribution side in detail.
          </p>
        </div>
      </ProseWithRail>

      {/* 6 · UNATTENDED — cards, canvas */}
      <CardGrid
        id="unattended"
        eyebrow="Unattended operation"
        title="Designing for a site with nobody in it"
        lede="Unattended does not mean unmanaged. Every routine action a technician would take by walking over must work across a link that sometimes fails. This is the minimum before a site is left alone."
        surface="canvas"
        field="safety"
        columns={2}
        items={UNATTENDED.map(([code, title, body]) => ({ code, title, body }))}
      />

      {/* 7 · INK BEAT — the inversion that reshapes an edge design */}
      <QuoteMetric
        quote="At a central facility, mean time to repair is dominated by diagnosis. At an edge site it is dominated by driving."
        attribution="EA-07 · People within reach · maintenance reality at an unattended site"
        field="deploy"
      />

      {/* 8 · MAINTENANCE — prose, paper */}
      <ProseWithRail id="maintenance" surface="paper">
        <SectionHead
          eyebrow="Operations"
          title="Maintenance reality: repair time is travel time"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            That inversion should reshape the design: redundancy that buys days rather than
            minutes, components that fail predictably on a schedule rather than rarely and
            catastrophically, and a factory-commissioned thermal system rather than one that needs
            field balancing. A{" "}
            <Link href="/engineering/thermal-enclosure" style={link}>
              sealed thermal enclosure
            </Link>{" "}
            is worth more at a dusty, remote, or coastal site than it is in a clean hall, and the
            enclosure rating conversation — IP code versus NEMA type — is a real engineering
            decision rather than a paperwork one.<Cite n={9} />
          </p>
          <p>
            Plan the first year as a maintenance schedule, not an incident queue: consumable
            intervals, firmware and certificate expiry, coolant chemistry sampling, and one
            rehearsed full-site restart. Then check the plan against the site survey using the{" "}
            <Link href="/resources/data-center-readiness-checklist" style={link}>
              readiness checklist
            </Link>
            .
          </p>

          <h3 className="h3" style={{ marginTop: "2.5rem" }}>
            The telemetry is the only instrument
          </h3>
          <p style={{ marginTop: "1rem" }}>
            Telemetry standardisation matters more here than in a staffed facility, because the
            data stream is the operator&apos;s only instrument.<Cite n={10} /> Access controls
            matter more because the deterrent of an occupied building is gone.<Cite n={11} /> And
            the industry&apos;s own numbers argue for humility: in a survey of more than 800
            operators, roughly half reported an impactful outage within the previous three years.
            <Cite n={4} /> Those failures happen in staffed buildings. See{" "}
            <Link href="/engineering/monitoring-controls" style={link}>
              monitoring and controls
            </Link>{" "}
            for the instrumentation layer.
          </p>
        </div>
      </ProseWithRail>

      {/* 9 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="When centralized cloud is the better answer"
        lede="Edge placement is the wrong choice more often than it is the right one. Do not move compute to the edge when:"
        items={WHEN_NOT}
      />

      {/* 10 · THE SPLIT + PODOS — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead
          eyebrow="In the product"
          title="A split, and where the PODOS Pod fits an edge deployment"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The realistic answer for most organisations is a split: central capacity for training
            and batch work, edge capacity only for the inference paths that fail without it. That
            tradeoff is laid out in{" "}
            <Link href="/compare/on-prem-ai-infrastructure-vs-cloud" style={link}>
              on-prem AI infrastructure vs cloud
            </Link>
            .
          </p>
          <p>
            PODOS builds the facility layer as a factory-integrated unit rather than a field-built
            room. Each{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with power
            distribution, closed-loop liquid cooling, racks, and instrumentation specified together
            and commissioned before the unit leaves the factory. That matters at an edge site for
            one reason: the parts hardest to build correctly with a small local crew arrive already
            built and tested.
          </p>
          <p>
            That approach shortens the on-site sequence to civil works, service connection, and
            commissioning, which is why PODOS{" "}
            <span data-claim="deployment-window">
              targets a 90-day window from order to commissioning
            </span>{" "}
            for a standard unit — a target, not a measured result. The{" "}
            <Link href="/deploy" style={link}>
              deployment model
            </Link>{" "}
            describes that sequence; other placements for the same unit are collected under{" "}
            <Link href="/use-cases" style={link}>
              use cases
            </Link>
            , and unfamiliar terms are defined in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={link}>
              AI infrastructure glossary
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 11 · FAQ — canvas */}
      <FAQBlock items={FAQ} surface="canvas" />

      {/* 12 · SOURCES — paper */}
      <Section surface="paper" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED — canvas */}
      <RelatedRail
        title="Related reading"
        surface="canvas"
        items={[
          {
            href: "/compare/on-prem-ai-infrastructure-vs-cloud",
            label: "COMPARE",
            title: "On-prem AI infrastructure vs cloud",
          },
          {
            href: "/engineering/thermal-enclosure",
            label: "ENGINEERING",
            title: "Sealed thermal enclosure",
          },
          {
            href: "/resources/data-center-readiness-checklist",
            label: "RESOURCE",
            title: "Data center readiness checklist",
          },
          { href: "/use-cases", label: "USE CASES", title: "Other placements for the same unit" },
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Survey the site before"
        accent="you specify the hardware"
        body="Bring the firm capacity, the uplink, the climate design day, and the road route. The configurator walks the same variables an engineering review would."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/resources/data-center-readiness-checklist", label: "Readiness checklist" }}
        field="deploy"
      />
    </main>
  );
}
