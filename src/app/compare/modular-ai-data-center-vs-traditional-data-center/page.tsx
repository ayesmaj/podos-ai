/**
 * /compare/modular-ai-data-center-vs-traditional-data-center
 * Archetype D, comparison. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, zero client JS. Composed entirely from the section
 * library (src/components/seo/sections.tsx) — 14 sections, 11 distinct
 * types, strict paper/canvas alternation with two ink beats.
 *
 * Claims discipline is unchanged: only publishable entries from
 * src/content/data/claims.ts render, each wrapped in data-claim with its
 * required qualifier; external numbers cite the source register. The
 * comparison stays balanced — four cases for each delivery model.
 */

import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import {
  HeroSplit,
  ExecutiveAnswer,
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

const PATH = "/compare/modular-ai-data-center-vs-traditional-data-center";
const TITLE = "Modular AI Data Center vs Traditional Data Center Compared";
const DESCRIPTION =
  "Neutral comparison of modular and traditional data centers for AI: schedule, capital profile, siting, permitting, scalability, and when each approach wins.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

/* ------------------------------------------------------------------ */
/* Sources — docs/seo/source-register.md (verified 2026-08-31)         */
/* ------------------------------------------------------------------ */
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
    name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://eta.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report",
    date: "Dec 2024",
  },
  {
    n: 3,
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 4,
    name: "Data centre electricity use surged in 2025, even with tightening bottlenecks driving a scramble for solutions",
    publisher: "IEA",
    url: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions",
    date: "2025",
  },
  {
    n: 5,
    name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)",
    publisher: "ASHRAE TC 9.9",
    url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf",
    date: "c. 2021",
  },
];

/* ------------------------------------------------------------------ */
/* Criteria matrix                                                     */
/* ------------------------------------------------------------------ */
const CRITERIA: { criterion: string; traditional: string; modular: string }[] = [
  {
    criterion: "Schedule",
    traditional:
      "Sequential: design, permits, sitework, shell, fit-out, commissioning — each trade waits on the last. Often dominated by permitting and interconnection.",
    modular:
      "Parallel: factory production runs while sitework and permitting proceed; on-site scope shrinks to foundations, tie-ins, and commissioning.",
  },
  {
    criterion: "Capital profile",
    traditional:
      "Large up-front commitment sized to forecast demand; capacity arrives in one tranche, often before it is fully utilized.",
    modular:
      "Capacity bought in unit-sized increments, so spend tracks demand — but per-unit procurement carries a manufacturer's margin.",
  },
  {
    criterion: "Siting",
    traditional:
      "Wide freedom: any parcel that can be permitted and powered; the building is designed to the site.",
    modular:
      "Constrained by logistics: unit dimensions and weights must survive road transport and crane placement.",
  },
  {
    criterion: "Scalability",
    traditional:
      "Expansion is another construction project; scale economics favor very large single campuses.",
    modular:
      "Expansion is repetition: add units as demand and available power allow — closer to procurement than construction.",
  },
  {
    criterion: "Quality control",
    traditional:
      "Field labor quality varies by market; integration issues tend to surface during on-site commissioning.",
    modular:
      "Repeatable assembly and pre-shipment testing catch integration issues early; the factory line becomes the concentrated point of process risk.",
  },
  {
    criterion: "Customization limits",
    traditional:
      "Nearly unlimited: floor plans, security zoning, redundancy topology, and architecture are bespoke.",
    modular:
      "Bounded by the product: configuration lives inside the unit's designed envelope; needs outside it push back toward a custom build.",
  },
  {
    criterion: "Permitting",
    traditional:
      "Full building-construction path: zoning, structural, fire, and environmental review for a permanent structure.",
    modular:
      "Sometimes shorter where jurisdictions treat units as pre-engineered equipment on a foundation — treatment varies by authority and is never guaranteed.",
  },
];

/* ------------------------------------------------------------------ */
/* FAQ — one array feeds the visible section AND FAQJsonLd             */
/* ------------------------------------------------------------------ */
const FAQ: { q: string; a: string }[] = [
  {
    q: "What counts as a modular data center?",
    a: "A facility assembled from factory-built modules that integrate power distribution, cooling, and IT space, tested before delivery and completed on site with foundations, utility tie-ins, and commissioning. A traditional data center is constructed trade by trade in place.",
  },
  {
    q: "Is a modular data center the same as a container data center?",
    a: "No. Container data centers are one subset of the modular category. Many current modular units are purpose-engineered enclosures rather than converted shipping containers, though both share the factory-built, ship-then-commission delivery model.",
  },
  {
    q: "Are modular data centers cheaper than traditional builds?",
    a: "There is no defensible general answer. Delivered cost depends on site conditions, scale, labor market, power path, and what scope each quote includes. Category-wide cost claims usually compare unlike scopes; compare fully delivered scope for your specific site instead.",
  },
  {
    q: "Why do AI workloads change this comparison?",
    a: "AI racks concentrate more power and heat than most existing facilities were designed around — Uptime Institute's 2025 survey reports typical rack densities rising into the 10 to 30 kW band, with AI clusters above it — and dense racks increasingly require liquid cooling. Factory integration of power, liquid cooling, and IT in one tested unit is a direct response to that shift.",
  },
];

/* ================================================================== */
export default function ModularVsTraditionalPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline={TITLE}
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="Article"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — ink, split field. The only image on the page. */}
      <HeroSplit
        code="CMP-01"
        cluster="Compare"
        title="Modular AI data center vs traditional"
        accent="data center"
        lede="A modular AI data center is assembled from factory-built units — power, cooling, and IT integrated and tested before they reach the site. A traditional data center is engineered and constructed in place, trade by trade."
        imageId="compare-split-frame"
        field="compare"
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Modular vs traditional data center", path: PATH },
            ]}
          />
        }
        meta={
          <>
            <LastVerified
              published="2026-08-31"
              lastVerified="2026-08-31"
              author="Josef Elimelech"
              reviewer="PODOS AI Engineering"
            />
            <p className="eyebrow" style={{ marginTop: "1rem" }}>
              Left: built in place. Right: factory-built, commissioned on a pad.
            </p>
          </>
        }
      />

      {/* 2 · THE VERDICT, UP FRONT — canvas glass panel */}
      <ExecutiveAnswer label="The honest verdict">
        Neither is better in the abstract: the choice moves schedule risk, capital commitment, and
        quality control between a production line and a construction site. Modular vendors rarely say
        this part plainly. Traditional construction wins when scale economics or unlimited
        customization is the binding requirement.
      </ExecutiveAnswer>

      {/* 3 · WHY THE QUESTION IS LIVE — prose with a jump rail, paper */}
      <ProseWithRail
        id="why"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {[
                ["#answer", "The honest verdict"],
                ["#criteria", "Seven criteria"],
                ["#traditional-wins", "When traditional wins"],
                ["#modular-wins", "When modular wins"],
                ["#assumptions", "Assumptions"],
                ["#limitations", "What it cannot tell you"],
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
          eyebrow="Context"
          code="CMP-02"
          title="Why AI forces the comparison"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            AI demand turned a niche procurement question into a schedule question. The IEA projects
            data centres rising from around 1.5% of global electricity consumption in 2025 to roughly
            3% — about 945 TWh — by 2030
            <Cite n={1} />; Lawrence Berkeley National Laboratory estimates US data centers used 4.4%
            of US electricity in 2023, projected at 6.7–12% by 2028
            <Cite n={2} />; and grid-connection bottlenecks tightened through 2025 even as demand
            surged
            <Cite n={4} />.
          </p>
          <p>
            The workload changed shape too. Uptime Institute&apos;s 2025 survey reports typical rack
            densities rising into the 10–30 kW band, with AI clusters beyond it
            <Cite n={3} />, and ASHRAE documents liquid cooling displacing air as densities climb
            <Cite n={5} />. Dense capacity rewards tight integration of{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
              direct-to-chip liquid cooling
            </Link>{" "}
            and{" "}
            <Link href="/engineering/data-center-power-architecture" style={link}>
              power architecture
            </Link>{" "}
            — work a factory repeats and a field crew rebuilds on every project. That is the
            engineering case for modular. It is not the whole case.
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · THE CRITERIA MATRIX — canvas, wide, split field */}
      <MatrixTable
        id="criteria"
        eyebrow="The comparison"
        title="Seven criteria, no winner column"
        lede="Each row states where the risk or constraint actually sits — read it against your project, not a vendor's brochure, including ours."
        surface="canvas"
        field="compare"
        head={["Criterion", "Traditional (built in place)", "Modular (factory-built)"]}
        rows={CRITERIA.map((row) => [
          <strong key={row.criterion} style={{ color: "var(--ink-strong)" }}>
            {row.criterion}
          </strong>,
          row.traditional,
          row.modular,
        ])}
      />

      {/* 5 · WHEN TRADITIONAL WINS — paper, two columns */}
      <CardGrid
        id="traditional-wins"
        eyebrow="Case A"
        title="When a traditional build is the right call"
        lede="Four project shapes where constructing in place remains the correct decision."
        surface="paper"
        columns={2}
        items={[
          {
            code: "CMP-T1",
            title: "Hyperscale campuses",
            body: "At hundreds of megawatts on one site, a purpose-built campus amortizes design, sitework, and utility infrastructure across the whole build. Unit-by-unit delivery adds little there.",
          },
          {
            code: "CMP-T2",
            title: "Bespoke requirements",
            body: "Custom security zoning, unusual redundancy topologies, special floor loading, or multi-tenant architecture exceed any standardized unit's envelope. Bespoke problems justify bespoke buildings.",
          },
          {
            code: "CMP-T3",
            title: "An existing shell",
            body: "A powered building with usable structure already in hand can make a fit-out cheaper and faster than shipping new enclosures — the enclosure is the part you already own.",
          },
          {
            code: "CMP-T4",
            title: "Jurisdictions that treat modules as buildings",
            body: "Where the authority routes factory-built units through the full building-permit path anyway, the permitting advantage shrinks and the decision reverts to logistics and quality control.",
          },
        ]}
      />

      {/* 6 · WHEN MODULAR WINS — canvas, two columns, same weight */}
      <CardGrid
        id="modular-wins"
        eyebrow="Case B"
        title="When modular wins"
        lede="The same count, on the same terms: four project shapes where factory delivery is the correct decision."
        surface="canvas"
        columns={2}
        items={[
          {
            code: "CMP-M1",
            title: "Time-bound AI capacity",
            body: "When GPU capacity has a deadline, moving integration work off the critical path and into a factory is the main lever a buyer controls. Sitework and production run in parallel instead of in sequence.",
          },
          {
            code: "CMP-M2",
            title: "High density from day one",
            body: (
              <>
                Liquid-cooled AI racks exceed the design assumptions of most legacy floor plans
                <Cite n={3} />
                <Cite n={5} />. A unit engineered around direct-to-chip cooling avoids retrofitting a
                building that was designed for air.
              </>
            ),
          },
          {
            code: "CMP-M3",
            title: "Capacity where power already exists",
            body: (
              <>
                With grid connections bottlenecked
                <Cite n={4} />, compact factory-built units can be placed at sites that already have
                power — substations, industrial parcels, campus edges — rather than waiting on a
                greenfield interconnection.
              </>
            ),
          },
          {
            code: "CMP-M4",
            title: "Uncertain demand curves",
            body: "Buying capacity in unit-sized increments converts a forecast-sized capital commitment into a sequence of smaller, reversible decisions. Under-forecasting costs a purchase order, not a building.",
          },
        ]}
      />

      {/* 7 · INK BEAT — why no cost table appears anywhere above */}
      <QuoteMetric
        quote="Vendors publish targets; operators rarely publish actuals."
        attribution="Why this page carries no delivered-cost table"
        metric="10–30 kW"
        label="Typical rack density band — Uptime Institute, 2025"
        field="compare"
      />

      {/* 8 · ASSUMPTIONS — paper, two columns */}
      <CardGrid
        id="assumptions"
        eyebrow="Ground rules"
        title="Assumptions behind this comparison"
        lede="Change any one of these and the rows above change with it."
        surface="paper"
        columns={2}
        items={[
          {
            code: "CMP-A1",
            title: "New-build capacity, both models available",
            body: "New-build capacity for AI or other high-density workloads, where both delivery models are actually available.",
          },
          {
            code: "CMP-A2",
            title: "Power binds both paths equally",
            body: "Power availability binds both paths equally; neither model manufactures megawatts.",
          },
          {
            code: "CMP-A3",
            title: "No cost figures",
            body: "No cost figures. Delivered $/MW varies too widely by site, scale, and scope to publish a general number honestly.",
          },
          {
            code: "CMP-A4",
            title: "Vendor-neutral terminology",
            body: (
              <>
                &quot;Modular&quot; is used vendor-neutrally for factory-built units of any form
                factor — see the{" "}
                <Link href="/resources/ai-infrastructure-glossary" style={link}>
                  AI infrastructure glossary
                </Link>{" "}
                for term boundaries.
              </>
            ),
          },
        ]}
      />

      {/* 9 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        eyebrow="Honest limits"
        title="What this comparison cannot tell you"
        items={[
          "No public, apples-to-apples dataset of measured schedules and costs exists across both models at fleet scale.",
          "The category boundary blurs in practice — many traditional builds now use prefabricated electrical rooms and cooling skids.",
          "The numbers cited here are industry-level demand and density figures, not predictions for any specific project.",
          "PODOS builds modular hardware. Read this page knowing where it comes from.",
        ]}
      />

      {/* 10 · WHERE PODOS SITS — paper prose, disclosed after the limits */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="Disclosure" title="Where PODOS sits in this comparison" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            PODOS builds on the modular side of this table.{" "}
            <span data-claim="unit-capacity-1mw">
              Each PODOS Pod is designed as a standardized 1-MW building block for AI infrastructure
            </span>
            , <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, and{" "}
            <span data-claim="deployment-window">
              PODOS targets a 90-day window from order to commissioning for a standard unit
            </span>{" "}
            — a target, not a measured deployment figure. The{" "}
            <Link href="/platform" style={link}>
              platform overview
            </Link>{" "}
            explains the architecture, the{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod page
            </Link>{" "}
            carries the unit specification, and the{" "}
            <Link href="/deploy" style={link}>
              deployment model
            </Link>{" "}
            covers what happens between order and commissioning. If your project matches the
            traditional-wins rows above, a pod is the wrong tool.
          </p>
        </div>
      </ProseWithRail>

      {/* 11 · FAQ — canvas. Same array that feeds FAQJsonLd. */}
      <FAQBlock items={FAQ} surface="canvas" />

      {/* 12 · SOURCES — paper */}
      <Section surface="paper" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED — canvas */}
      <RelatedRail
        title="Continue"
        surface="canvas"
        items={[
          {
            href: "/engineering/direct-to-chip-liquid-cooling",
            label: "ENGINEERING",
            title: "Direct-to-chip liquid cooling, explained",
          },
          {
            href: "/engineering/data-center-power-architecture",
            label: "ENGINEERING",
            title: "Data center power architecture",
          },
          {
            href: "/platform/podos-pod",
            label: "PLATFORM",
            title: "The PODOS Pod specification",
          },
          {
            href: "/deploy",
            label: "DEPLOY",
            title: "Order to commissioning, stage by stage",
          },
        ]}
      />

      {/* 14 · CTA — ink */}
      <CTABand
        title="Run this comparison against"
        accent="your actual site"
        body="Bring the parcel, the power path, and the density target. If the traditional-wins rows describe your project, engineering will say so."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy", label: "Deployment model" }}
        field="compare"
      />
    </main>
  );
}
