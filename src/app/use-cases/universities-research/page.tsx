/**
 * /use-cases/universities-research — Archetype B, use case.
 * See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component. Deepens hub profile U-02 (Universities & research):
 * grant cycles, shared clusters, campus power limits, existing
 * facilities — and where a pod beats a machine-room retrofit and where
 * it does not.
 *
 * Composition note: this page carries NO images, so it is built from the
 * image-free half of the section library and uses the editorial hero
 * rather than the media hero its sibling /use-cases/enterprise-ai uses.
 * The ink beat lands on the density ceiling rather than on a metric.
 *
 * Claims discipline: only publishable ids from src/content/data/claims.ts
 * render, each wrapped in data-claim with its required qualifier.
 * External numbers cite docs/seo/source-register.md entries only
 * (NSF MRI row added to the register 2026-08-31). No certification,
 * customer, benchmark, capex, or PODOS PUE claims anywhere.
 */

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
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
  QuoteMetric,
  MatrixTable,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/use-cases/universities-research";
const TITLE = "University Research Computing: Pod vs Machine-Room Retrofit";
const DESCRIPTION =
  "How grant cycles, campus power limits, and shared cluster demand decide whether a modular AI pod or a machine-room retrofit fits university research computing.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "NSF 23-519: Major Research Instrumentation Program (MRI) — program solicitation",
    publisher: "U.S. National Science Foundation",
    url: "https://www.nsf.gov/funding/opportunities/mri-major-research-instrumentation-program/nsf23-519/solicitation",
    date: "accessed 2026-08-31",
  },
  {
    n: 2,
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 3,
    name: "GB200 NVL72 product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    date: "accessed 2026-08-31",
  },
  {
    n: 4,
    name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://eta.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report",
    date: "Dec 2024",
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
    name: "High-Performance Computing Data Center Warm-Water Liquid Cooling (ESIF)",
    publisher: "NREL (U.S. Department of Energy)",
    url: "https://www.nrel.gov/computational-science/warm-water-liquid-cooling",
    date: "ongoing",
  },
  {
    n: 7,
    name: "HPC Data Center Waste Heat Reuse (ESIF)",
    publisher: "NREL (U.S. Department of Energy)",
    url: "https://www.nrel.gov/computational-science/waste-heat-energy-reuse",
    date: "ongoing",
  },
  {
    n: 8,
    name: "ICC/MBI 1205-2021 — Inspection and Regulatory Compliance in Off-Site Construction",
    publisher: "International Code Council / Modular Building Institute",
    url: "https://www.iccsafe.org/building-safety-journal/bsj-technical/new-brief-explores-implementation-of-icc-mbi-standards-1200-and-1205-for-off-site-construction/",
    date: "2021 ed.",
  },
  {
    n: 9,
    name: "Commercial Vehicle Size and Weight Program",
    publisher: "Federal Highway Administration (U.S. DOT)",
    url: "https://ops.fhwa.dot.gov/freight/sw/overview/index.htm",
    date: "accessed 2026-08-31",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "Can a research grant pay for a modular compute pod?",
    a: "That depends on the award and on how your institution classifies the unit — sponsored programs decide it, not the vendor. The structural contrast is clear, though: NSF's Major Research Instrumentation solicitation requires at least 70% of an acquisition's total project cost to sit on the equipment budget line, while a renovation is a construction cost.",
  },
  {
    q: "How much power does a campus need available for a liquid-cooled AI cluster?",
    a: "Enough spare capacity on the campus loop to carry the continuous IT load plus cooling and losses, with the transformer, protection, and metering to match. A campus electrical study comes before any hardware decision, because the answer sets whether a retrofit is even possible.",
  },
  {
    q: "Is a pod better than time on a national supercomputing facility?",
    a: "Not for bursty work. Shared allocations exist so a group needing a few large runs a year does not have to own, power, and staff a cluster. A dedicated unit makes sense when demand is sustained, when data cannot leave the institution, or when queue waits are the bottleneck.",
  },
  {
    q: "Does a modular unit avoid campus permitting?",
    a: "No. It moves most of the inspection burden off-site rather than removing it. ICC/MBI 1205 sets out how in-plant and third-party inspection relate to the local authority having jurisdiction, which still approves siting, foundations, and utility connections.",
  },
];

const link: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };
const strong: CSSProperties = { color: "var(--ink-strong)", fontWeight: 600 };

/* Constraint comparison — retrofit vs pod, campus by campus. */
const COMPARISON: Array<[string, string, string, ReactNode]> = [
  [
    "UR-01",
    "How the money arrives",
    "A construction cost on the capital-planning calendar, funded separately from the award that bought the hardware.",
    "Procured as equipment — though whether it qualifies on an equipment budget line is an institutional question.",
  ],
  [
    "UR-02",
    "Schedule against the award period",
    "Design, bid, abatement, and construction inside an occupied building, often with the hall offline.",
    <>
      Fabrication runs off-site in parallel with site works; ICC/MBI 1205 splits in-plant and
      on-site inspection with the local jurisdiction.
      <Cite n={8} />
    </>,
  ],
  [
    "UR-03",
    "Rack density ceiling",
    "Bounded by the existing airflow design — most academic machine rooms assume single-digit kilowatt racks.",
    "A property of the enclosure, not the building; specified around liquid-cooled racks from the start.",
  ],
  [
    "UR-04",
    "Cooling loop",
    "New facility water, pipe routing through occupied floors, and a heat-rejection plant the building may lack.",
    <>
      Closed loop and heat-rejection interfaces integrated and tested before shipment; ASHRAE
      facility water classes still govern the interface.
      <Cite n={5} />
    </>,
  ],
  [
    "UR-05",
    "Electrical service",
    "New feeders, switchgear, often a transformer upgrade — the long-lead item in most retrofits.",
    "Still needs campus capacity; distribution inside the boundary is factory-built.",
  ],
  [
    "UR-06",
    "Physical access",
    "Freight elevators, door widths, and floor loading in a building designed for none of it.",
    <>
      Constrained by the road: federal limits fix National Network width at 102 in and interstate
      gross weight at 80,000 lb.
      <Cite n={9} />
    </>,
  ],
  [
    "UR-07",
    "Waste heat",
    "Usually rejected to atmosphere; capturing it means touching the building hydronic system.",
    <>
      A warm-water loop returns fluid at a temperature a campus heating network can accept.
      <Cite n={7} />
    </>,
  ],
  [
    "UR-08",
    "Who operates it",
    "Absorbed by existing facilities and research-computing staff, who inherit the new liquid loop.",
    "Unchanged. A pod does not create an operations team; coolant chemistry is new either way.",
  ],
];

const TOC: Array<[string, string]> = [
  ["#grant-cycle", "The grant cycle"],
  ["#campus-limits", "What the campus delivers"],
  ["#comparison", "Pod vs retrofit"],
  ["#shared-clusters", "Shared clusters and queues"],
  ["#heat", "Waste heat"],
  ["#limitations", "When it does not fit"],
  ["#podos", "How PODOS fits"],
  ["#faq", "Questions"],
];

export default function UniversitiesResearchUseCasePage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="AI infrastructure for universities and research computing"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — editorial. This page has no photography; the stat rail carries it. */}
      <HeroEditorial
        category="Universities & research · UC-02"
        title="AI infrastructure for universities and"
        accent="research computing"
        lede="On most campuses the binding constraint on AI research is not the GPU budget — it is the machine room. A modular pod beats a retrofit when a group has funded hardware, a campus electrical service with spare capacity, and no room that can take a liquid-cooled rack. A retrofit wins when the existing hall already has the power, the floor, and the staff. Here are the criteria that separate the two, and the cases where neither is the answer."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Use cases", path: "/use-cases" },
              { name: "Universities & research", path: PATH },
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
          { value: "3", label: "Campus limits, in discovery order" },
          { value: "8", label: "Constraints compared" },
          { value: "6", label: "Cases where neither fits" },
        ]}
      />

      {/* 2 · THE QUALIFYING CONDITIONS — canvas */}
      <SummaryBand
        title="When a pod beats a retrofit"
        items={[
          {
            code: "01",
            title: "The hardware is funded, the room is not",
            body: "An award bought accelerators. The feeders, the chilled-water branch, and the structural work sit on a different budget line, on a different calendar.",
          },
          {
            code: "02",
            title: "The campus service has headroom",
            body: "Spare capacity on the campus loop for the continuous IT load plus cooling and losses. Without it, neither option proceeds — the load study comes first.",
          },
          {
            code: "03",
            title: "No existing hall takes a liquid-cooled rack",
            body: "If the machine room already has the power, the floor loading, the facility water, and the staff, adding racks there is the lower-risk path.",
          },
        ]}
      />

      {/* 3 · THE MONEY — prose with a TOC rail, paper */}
      <ProseWithRail
        id="grant-cycle"
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
        <SectionHead
          eyebrow="The funding shape"
          title="The grant cycle sets the clock, not the roadmap"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            University compute does not arrive on an annual refresh curve. It arrives in discrete
            awards, and the shape of those awards decides what can be bought. NSF&apos;s Major
            Research Instrumentation program is the clearest example: up to $4 million for the
            acquisition or development of a multi-user research instrument, an acquisition award of
            up to three years, and at least 70% of total project cost on the equipment line of the
            budget.
            <Cite n={1} />
          </p>
          <p>
            That budget rule explains most of the friction. Instrumentation money is built to buy
            instruments. A machine-room renovation — feeders, a chilled-water branch, structural
            work, abatement — is a construction cost, funded through a separate capital process on
            the university&apos;s calendar rather than the award&apos;s. Departments routinely end up
            holding hardware they cannot energize because the facility half never got its own line.
            Whether a self-contained unit qualifies as equipment is a question for sponsored
            programs, not for a vendor, but the contrast between buying an instrument and renovating
            a building is not ambiguous. The award period compounds it: three years sounds generous
            until eighteen months go to design and capital review, and the depreciation clock on
            accelerators starts at purchase, not at plug-in.
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · CAMPUS LIMITS — cards, canvas */}
      <CardGrid
        id="campus-limits"
        eyebrow="Physical envelope"
        title="What the campus can actually deliver"
        lede="Three physical limits decide the answer, usually discovered in this order."
        surface="canvas"
        field="power"
        columns={3}
        items={[
          {
            code: "01",
            title: "Density",
            body: (
              <>
                Most academic machine rooms were laid out for single-digit kilowatt racks on raised
                floor. Uptime Institute&apos;s 2025 survey of more than 800 operators shows
                fleet-wide densities climbing into the 10–30 kW band
                <Cite n={2} />, and rack-scale AI systems sit far above that: NVIDIA ships the GB200
                NVL72 as 72 GPUs and 36 CPUs in one liquid-cooled rack, with no air-cooled
                equivalent on offer.
                <Cite n={3} />
              </>
            ),
          },
          {
            code: "02",
            title: "Power",
            body: (
              <>
                Campus distribution is a shared resource with its own queue: a load study, likely new
                feeders and switchgear, sometimes a transformer with a lead time measured in
                quarters. The competition is not local either — LBNL&apos;s congressionally mandated
                assessment put US data-center electricity at about 4.4% of national demand in 2023
                and projected 6.7–12% by 2028.
                <Cite n={4} />
              </>
            ),
          },
          {
            code: "03",
            title: "Cooling",
            body: (
              <>
                Once the racks are liquid-cooled, the building needs a facility water loop with a
                defined supply temperature — ASHRAE names liquid-cooling facility water classes
                alongside the air classes
                <Cite n={5} /> — plus heat rejection and pipe routing to the room. In an occupied
                building, the routing is often harder than the plant.
              </>
            ),
          },
        ]}
      />

      {/* 5 · INK BEAT — the density ceiling, stated plainly */}
      <QuoteMetric
        quote="A room that cannot cool one such rack cannot be tuned into one that can."
        attribution="UR-03 · Rack density ceiling — the limit that ends most retrofit conversations"
        field="cooling"
      />

      {/* 6 · COMPARISON — wide matrix, paper */}
      <MatrixTable
        id="comparison"
        eyebrow="Constraint by constraint"
        title="Pod versus machine-room retrofit"
        lede="The comparison a research-computing director and a facilities engineer tend to run together. Neither column wins every row."
        surface="paper"
        field="network"
        head={["#", "Constraint", "Machine-room retrofit", "Modular pod on campus land"]}
        rows={COMPARISON.map(([code, constraint, retrofit, pod]) => [
          <span key={code} className="pill">
            {code}
          </span>,
          <span key={`${code}-c`} style={{ color: "var(--ink-strong)", fontWeight: 500 }}>
            {constraint}
          </span>,
          retrofit,
          pod,
        ])}
      />

      {/* 7 · CONTROL POSTURE — who the capacity is for, canvas */}
      <ProseWithRail id="shared-clusters" surface="canvas">
        <SectionHead
          eyebrow="Operating posture"
          title="Shared clusters, queues, and who the capacity is for"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            A campus cluster is a shared instrument with a scheduler in front of it, so the question
            for new capacity is not only how big it is but whether it lands inside the existing queue
            or beside it. A self-contained unit lands beside it by default. That helps when the
            owning group needs isolation — a data-use agreement forbidding co-tenancy, a
            reproducibility requirement forbidding a moving software stack, a run that cannot
            tolerate preemption. It hurts when the institution&apos;s goal was consolidation and the
            new capacity splits a thin operations team across two environments.
          </p>
        </div>
      </ProseWithRail>

      {/* 8 · WASTE HEAT — prose with a link rail, paper */}
      <ProseWithRail
        id="heat"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">The mechanics</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              <li>
                <Link
                  href="/engineering/data-center-heat-recovery"
                  style={{ ...link, fontSize: "0.9rem", textDecoration: "none" }}
                >
                  Heat recovery
                </Link>
              </li>
              <li>
                <Link
                  href="/engineering/direct-to-chip-liquid-cooling"
                  style={{ ...link, fontSize: "0.9rem", textDecoration: "none" }}
                >
                  Direct-to-chip liquid cooling
                </Link>
              </li>
            </ul>
          </div>
        }
      >
        <SectionHead eyebrow="The campus advantage" title="Waste heat is an asset on a campus" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Universities are one of the few settings where reject heat has a customer next door.
            Campuses run their own heating networks, and a warm-water direct-to-chip loop returns
            fluid at a temperature those networks can use. NREL&apos;s Energy Systems Integration
            Facility is the reference implementation: warm-water cooling enables chiller-free
            operation and energy recovery
            <Cite n={6} />, and captured HPC waste heat reheats the building&apos;s office and lab
            space, at a reported facility PUE of roughly 1.04.
            <Cite n={7} /> That turns an operating cost into a supply. The mechanics are in our{" "}
            <Link href="/engineering/data-center-heat-recovery" style={link}>
              heat recovery
            </Link>{" "}
            and{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
              direct-to-chip liquid cooling
            </Link>{" "}
            pages.
          </p>
        </div>
      </ProseWithRail>

      {/* 9 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="When a pod is not the right fit"
        lede="Several common campus situations are better served by something else."
        items={[
          "Demand is bursty. If a group needs a few large runs a year, an allocation on a national or consortium facility beats owning, powering, and staffing hardware that idles between deadlines.",
          "The existing hall already has headroom. Spare capacity, a facility water loop, adequate floor loading, and staff who already run the room — adding racks there beats siting anything new.",
          "There is no operating budget. A capital award buys hardware; it rarely funds the electricity, cooling, staff, and coolant discipline for the years after.",
          "There is nowhere to put it. Historic-district review, setbacks, and master plans constrain siting as firmly as any engineering limit, and a unit that cannot be routed to its pad cannot be delivered.",
          "The requirement is regulatory rather than physical. Compliance and accreditation obligations must be evaluated on their own terms — PODOS publishes no certification claims, and none should be inferred from the enclosure.",
          "The workload is bound to data that cannot move. If the training set lives on existing campus storage, the network path, not the compute, may be the constraint worth funding first.",
        ]}
      />

      {/* 10 · PODOS — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead
          eyebrow="In the product"
          title="How PODOS fits a research-computing program"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            PODOS integrates power, cooling, racks, and networking into a factory-built unit rather
            than a field-built room. Each{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span> — one funded
            increment, one deliverable, one commissioning event. Because subsystems are integrated
            and tested before shipment, PODOS{" "}
            <span data-claim="deployment-window">targets a 90-day window from order to commissioning</span>{" "}
            for a standard unit. These are design targets, not measured campus results.
          </p>
          <p>
            The sequence for a research-computing office: confirm campus electrical headroom, confirm
            siting and the delivery route, then decide whether the capacity joins the existing queue
            or stands beside it. Our{" "}
            <Link href="/resources/data-center-readiness-checklist" style={link}>
              readiness checklist
            </Link>{" "}
            orders the site questions, the{" "}
            <Link href="/engineering/data-center-power-architecture" style={link}>
              power architecture
            </Link>{" "}
            covers the other side of the service connection, and{" "}
            <Link href="/deploy" style={link}>
              deployment
            </Link>{" "}
            covers site works. If the campus question is construction versus manufacturing, start
            with{" "}
            <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={link}>
              modular versus traditional data centers
            </Link>
            . Other verticals are profiled on the{" "}
            <Link href="/use-cases" style={link}>
              use-case hub
            </Link>
            ; terms are defined in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={link}>
              AI infrastructure glossary
            </Link>
            .
          </p>
          <p style={{ ...strong, fontSize: "0.95rem" }}>
            PODOS AI is an early-stage company. Nothing above describes a completed campus
            deployment, a customer, or a certified product.
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
            href: "/compare/modular-ai-data-center-vs-traditional-data-center",
            label: "COMPARE",
            title: "Modular vs traditional data centers",
          },
          {
            href: "/resources/data-center-readiness-checklist",
            label: "RESOURCE",
            title: "Data center readiness checklist",
          },
          {
            href: "/engineering/data-center-heat-recovery",
            label: "ENGINEERING",
            title: "Data center heat recovery",
          },
          { href: "/use-cases", label: "USE CASES", title: "All vertical profiles" },
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Size it against"
        accent="your campus"
        body="Bring the campus electrical study, the siting constraint, and the award period. The configurator walks the same variables a facilities review would."
        primary={{ href: "/estimate", label: "Size your deployment" }}
        secondary={{ href: "/use-cases", label: "Other verticals" }}
        field="network"
      />
    </main>
  );
}
