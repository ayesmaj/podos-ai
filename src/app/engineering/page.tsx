/**
 * /engineering — cluster hub for AI data-center engineering.
 *
 * HUB archetype, composed entirely from the section library
 * (src/components/seo/sections.tsx). Server component, zero client JS.
 * 13 sections, 11 distinct types, surface rotation ink → canvas → paper.
 *
 * Its job is to route: every one of the eight engineering deep dives is
 * linked twice — once as a card in the CardGrid, once in the "Deep dive"
 * column of the domain matrix.
 *
 * Claims discipline: only publishable entries from
 * src/content/data/claims.ts render, each wrapped in data-claim with its
 * required qualifier. Every external figure cites the numbered source
 * rail (docs/seo/source-register.md).
 */

import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import {
  HeroSplit,
  SummaryBand,
  CardGrid,
  ProseWithRail,
  MatrixTable,
  QuoteMetric,
  SplitFeature,
  LimitsBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/engineering";
const TITLE = "AI Data Center Engineering: Cooling, Power, Density | PODOS";
const DESCRIPTION =
  "How megawatt-scale AI infrastructure is engineered: direct-to-chip liquid cooling, medium-voltage power, rack density, thermal envelope, monitoring, safety.";

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

const SOURCES: Source[] = [
  { n: 1, name: "Energy and AI — Executive Summary", publisher: "IEA", url: "https://www.iea.org/reports/energy-and-ai/executive-summary", date: "Apr 2025" },
  { n: 2, name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)", publisher: "Lawrence Berkeley National Laboratory", url: "https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf", date: "Dec 2024" },
  { n: 3, name: "Global Data Center Survey 2025", publisher: "Uptime Institute", url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025", date: "Jul 2025" },
  { n: 4, name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9)", publisher: "ASHRAE", url: "https://www.ashrae.org", date: "2021" },
  { n: 5, name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)", publisher: "ASHRAE TC 9.9", url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf", date: "c. 2021" },
  { n: 6, name: "Cooling Environments Project", publisher: "Open Compute Project", url: "https://www.opencompute.org/projects/cooling-environments" },
  { n: 7, name: "GB200 NVL72 product page", publisher: "NVIDIA", url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/" },
  { n: 8, name: "IEEE 3006 series — Power Systems Reliability for industrial and commercial facilities", publisher: "IEEE", url: "https://standards.ieee.org/ieee/3006.1/7391/", date: "2013–2018" },
  { n: 9, name: "NFPA 75 — Standard for the Fire Protection of Information Technology Equipment", publisher: "NFPA", url: "https://www.nfpa.org", date: "2024 ed." },
  { n: 10, name: "HPC Data Center Waste Heat Reuse (ESIF)", publisher: "NREL (DOE)", url: "https://www.nrel.gov/computational-science/waste-heat-energy-reuse" },
];

/* The eight deep dives. This array is the hub's whole reason to exist —
   it is the only inbound internal link path to most of these pages. */
const DEEP_DIVES: { code: string; domain: string; href: string; title: string; governs: string }[] = [
  {
    code: "ENG-01",
    domain: "Cooling",
    href: "/engineering/direct-to-chip-liquid-cooling",
    title: "Direct-to-chip liquid cooling",
    governs: "Heat extraction from silicon to ambient.",
  },
  {
    code: "ENG-02",
    domain: "Power",
    href: "/engineering/data-center-power-architecture",
    title: "Data-center power architecture",
    governs: "Medium-voltage service down to rack-level distribution.",
  },
  {
    code: "ENG-03",
    domain: "Compute density",
    href: "/engineering/high-density-gpu-infrastructure",
    title: "High-density GPU infrastructure",
    governs: "kW and accelerators per rack, per square foot.",
  },
  {
    code: "ENG-04",
    domain: "Thermal envelope",
    href: "/engineering/thermal-enclosure",
    title: "Thermal enclosure design",
    governs: "The boundary between machine climate and weather.",
  },
  {
    code: "ENG-05",
    domain: "Networking",
    href: "/engineering/networking-fiber",
    title: "Network architecture: fiber and leaf-spine",
    governs: "The east–west fabric between accelerators.",
  },
  {
    code: "ENG-06",
    domain: "Monitoring",
    href: "/engineering/monitoring-controls",
    title: "Monitoring and controls",
    governs: "Telemetry, alerting, capacity forecasting.",
  },
  {
    code: "ENG-07",
    domain: "Safety",
    href: "/engineering/safety-security",
    title: "Fire safety and physical security",
    governs: "Fire protection, energy storage, code compliance.",
  },
  {
    code: "ENG-08",
    domain: "Heat recovery",
    href: "/engineering/data-center-heat-recovery",
    title: "Data-center heat recovery",
    governs: "What happens to the heat once a liquid loop has concentrated it into a recoverable stream.",
  },
];

/* The pre-mortem: what goes wrong when a domain is under-engineered. */
const FAILURE_MODES: [string, string, string, string, string][] = [
  ["ENG-01", "Cooling", "Heat extraction from silicon to ambient", "Thermal throttling — GPUs derate long before they fail", "/engineering/direct-to-chip-liquid-cooling"],
  ["ENG-02", "Power", "Medium-voltage service down to rack-level distribution", "Stranded capacity — a facility that cannot feed its own racks", "/engineering/data-center-power-architecture"],
  ["ENG-03", "Compute density", "kW and accelerators per rack, per square foot", "An overbuilt shell wrapped around underfilled racks", "/engineering/high-density-gpu-infrastructure"],
  ["ENG-04", "Thermal envelope", "The boundary between machine climate and weather", "Cooling plant sized for the worst hour of the worst day", "/engineering/thermal-enclosure"],
  ["ENG-05", "Networking", "The east–west fabric between accelerators", "Idle GPUs waiting on the interconnect", "/engineering/networking-fiber"],
  ["ENG-06", "Monitoring", "Telemetry, alerting, capacity forecasting", "Outages diagnosed after the fact instead of prevented", "/engineering/monitoring-controls"],
  ["ENG-07", "Safety", "Fire protection, energy storage, code compliance", "A unit that works but cannot be permitted", "/engineering/safety-security"],
];

const NAV: [string, string][] = [
  ["#cooling", "ENG-01 · Cooling"],
  ["#power", "ENG-02 · Power"],
  ["#density", "ENG-03 · Density"],
  ["#thermal-envelope", "ENG-04 · Envelope"],
  ["#networking", "ENG-05 · Networking"],
  ["#monitoring", "ENG-06 · Monitoring"],
  ["#safety", "ENG-07 · Safety"],
  ["#limitations", "Honest limits"],
];

const domainHead = { marginTop: "2.5rem", scrollMarginTop: 96 } as const;

/* ---------- page ---------- */

export default function EngineeringHub() {
  return (
    <main>
      <TechArticleJsonLd
        headline="AI data-center engineering: cooling, power, density, and the envelope"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />

      {/* 1 · HERO — ink, text left, cutaway right */}
      <HeroSplit
        code="ENG-00"
        cluster="Engineering · Index"
        title="AI data-center"
        accent="engineering"
        lede="AI data-center engineering is the discipline of moving electricity into GPUs and moving heat back out — reliably, at densities conventional facilities were never designed to hold. Seven domains decide whether a megawatt of compute actually serves inference: cooling, power, compute density, the thermal envelope, networking, monitoring, and safety."
        imageId="engineering-hub-cutaway"
        field="blueprint"
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Engineering", path: PATH },
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
        metrics={[
          { value: "07", label: "Engineering domains" },
          { value: "08", label: "Deep dives published" },
          { value: "10", label: "External sources cited" },
        ]}
      />

      {/* 2 · SUMMARY — canvas */}
      <SummaryBand
        title="What this index covers"
        items={[
          {
            code: "01",
            title: "The load outran the buildings",
            body: "Data centers took about 1.5% of world electricity in 2024, and the IEA projects roughly double by 2030.",
          },
          {
            code: "02",
            title: "Efficiency stopped improving",
            body: "Uptime Institute finds industry-average PUE roughly flat for about six years while rack densities climbed into the 10–30 kW band.",
          },
          {
            code: "03",
            title: "The failure modes compound",
            body: "A cooling shortfall becomes a density cap, a density cap strands power, and stranded power breaks the economics.",
          },
          {
            code: "04",
            title: "Solve once, then manufacture",
            body: "A factory-built unit answers each domain with a repeatable product surface rather than a fresh construction project.",
          },
        ]}
      />

      {/* 3 · THE DEEP DIVES — paper. The hub's routing job. */}
      <CardGrid
        id="deep-dives"
        eyebrow="The engineering library"
        title="Eight deep dives, one per domain"
        lede="Each domain below has a full explainer. Start with the one that constrains your site."
        columns={4}
        field="blueprint"
        items={DEEP_DIVES.map((d) => ({
          code: d.code,
          title: d.domain,
          body: (
            <>
              {d.governs}{" "}
              <Link href={d.href} style={link}>
                {d.title}
              </Link>
            </>
          ),
        }))}
      />

      {/* 4 · WHY — prose with a nav rail, canvas */}
      <ProseWithRail
        id="why"
        surface="canvas"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {NAV.map(([href, label]) => (
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
          eyebrow="The pressure"
          title="Why AI compute breaks conventional facility engineering"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The load is growing faster than the buildings. Data centers consumed about 1.5% of the
            world&rsquo;s electricity in 2024, and the IEA projects that figure to roughly double by
            2030, to about 945 TWh.<Cite n={1} /> In the United States, data centers drew 4.4% of
            national electricity in 2023; Lawrence Berkeley National Laboratory projects between
            6.7% and 12% by 2028.<Cite n={2} /> At the same time, the industry&rsquo;s average
            efficiency has stopped improving — Uptime Institute&rsquo;s 2025 survey finds
            industry-average PUE roughly flat for about six years, even as typical rack densities
            climb into the 10–30 kW band.<Cite n={3} />
          </p>
          <p>
            Conventional engineering answers this with bigger projects: more shell, more chillers,
            more substation. A factory-built approach answers it with a repeatable unit — solve each
            domain once, then manufacture the solution. The trade-offs between the two approaches
            are examined in{" "}
            <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={link}>
              modular AI data center vs traditional data center
            </Link>
            ; the product architecture that results is described in the{" "}
            <Link href="/platform" style={link}>
              platform overview
            </Link>
            .
          </p>
          <p>
            This index summarizes each domain, explains how the constraints change when the facility
            is a factory-built unit rather than a construction project, and links to the deep dive
            for every one.
          </p>
        </div>
      </ProseWithRail>

      {/* 5 · MATRIX — paper, wide. The pre-mortem. */}
      <MatrixTable
        id="domains"
        eyebrow="Pre-mortem"
        title="Seven domains, one envelope"
        lede="Each domain has its own failure mode, and the failure modes compound: a cooling shortfall becomes a density cap, a density cap strands power, stranded power breaks the economics. The table reads as a pre-mortem — what goes wrong when a domain is under-engineered."
        field="blueprint"
        head={["Code", "Domain", "What it governs", "Failure mode if under-engineered", "Deep dive"]}
        rows={FAILURE_MODES.map(([code, domain, governs, failure, href]) => [
          <span key={code} className="pill">
            {code}
          </span>,
          domain,
          governs,
          failure,
          <Link key={href} href={href} style={link}>
            Read the explainer
          </Link>,
        ])}
      />

      {/* 6 · DOMAINS 01–04 — canvas */}
      <ProseWithRail id="domains-a" surface="canvas" width="content">
        <SectionHead
          eyebrow="Domains 01–04"
          title="Cooling, power, density, and the boundary they all share"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <h3 className="h3" id="cooling" style={domainHead}>
            ENG-01 · Cooling: move heat with liquid, not air
          </h3>
          <p>
            At AI densities, air stops being a workable transport medium for heat. ASHRAE TC 9.9 —
            the committee whose thermal guidelines define data-center environmental classes — has
            documented the shift toward liquid cooling in mainstream facilities as rack power rises.
            <Cite n={4} />
            <Cite n={5} /> The practical response is direct-to-chip liquid cooling: cold plates on
            the hottest silicon and a coolant loop in place of a room full of moving air, with the
            Open Compute Project now maintaining multi-vendor requirements for cold plates and
            coolant distribution units.<Cite n={6} /> The PODOS Pod&rsquo;s cooling is designed as a
            closed direct-to-chip loop, which also concentrates heat into a recoverable stream —
            NREL&rsquo;s ESIF facility, for example, heats its offices with waste heat from
            liquid-cooled supercomputers and reports an annualized PUE near 1.04.<Cite n={10} /> Both
            halves have their own explainer:{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
              direct-to-chip liquid cooling
            </Link>{" "}
            and{" "}
            <Link href="/engineering/data-center-heat-recovery" style={link}>
              data-center heat recovery
            </Link>
            .
          </p>

          <h3 className="h3" id="power" style={domainHead}>
            ENG-02 · Power: from medium voltage to the rack
          </h3>
          <p>
            A megawatt of IT load is an industrial electrical project. The chain runs from a
            medium-voltage utility feed through transformation, switchgear, distribution, and power
            conversion down to the rack — and every stage adds losses, footprint, and failure modes.
            Reliability engineering for that chain is a discipline of its own; the IEEE 3006 series
            covers reliability analysis for critical-facility power systems.<Cite n={8} />{" "}
            Field-built electrical rooms are engineered one project at a time. A factory-built unit
            integrates the same chain into a manufactured product, so the design is validated once
            and then repeated; the PODOS Pod is designed to accept a medium-voltage utility feed and
            carry distribution inside the unit. The full chain is walked stage by stage in{" "}
            <Link href="/engineering/data-center-power-architecture" style={link}>
              data-center power architecture
            </Link>
            .
          </p>

          <h3 className="h3" id="density" style={domainHead}>
            ENG-03 · Compute density: the number every other domain inherits
          </h3>
          <p>
            Density sets the requirements for cooling, power, envelope, and safety at once. Uptime
            Institute&rsquo;s 2025 survey shows typical racks moving into the 10–30 kW band,
            <Cite n={3} /> and accelerator vendors have already moved past it: NVIDIA&rsquo;s GB200
            NVL72 packages 72 GPUs and 36 CPUs into a single liquid-cooled rack that behaves as one
            NVLink domain.<Cite n={7} />{" "}
            <span data-claim="pod-gpu-capacity">Each PODOS Pod is designed for 128 GPUs</span> inside
            its unit envelope — a design figure, not a measured deployment. The rack-level design
            problem is taken up in{" "}
            <Link href="/engineering/high-density-gpu-infrastructure" style={link}>
              high-density GPU infrastructure
            </Link>
            . Signs a design has crossed the air-cooling threshold:
          </p>
          <ul className="limits" style={{ marginTop: "1.25rem" }}>
            <li>
              Rack loads pushing past the range ASHRAE documents as air&rsquo;s practical territory
              <Cite n={4} />
              <Cite n={5} />
            </li>
            <li>
              Accelerator inlet temperatures riding the top of the allowable class limits
              <Cite n={4} />
            </li>
            <li>Hot-aisle containment already deployed — and still insufficient</li>
            <li>Fan energy becoming a visible share of facility overhead</li>
          </ul>

          <h3 className="h3" id="thermal-envelope" style={domainHead}>
            ENG-04 · Thermal envelope: the boundary condition
          </h3>
          <p>
            The envelope decides how much of the outside climate the cooling plant has to fight.
            ASHRAE&rsquo;s environmental classes — A1–A4 for air-cooled equipment, an H1 class for
            high-density gear, and liquid-cooling classes named by facility water temperature —
            define the machine-side climate that must hold regardless of weather.<Cite n={4} /> A
            conventional building maintains that climate with mass and mechanical plant, assembled
            on-site. A manufactured enclosure treats the envelope as a product surface: insulation
            and barriers engineered once, on a production line. The PODOS enclosure is designed as a
            fully insulated envelope, so cooling capacity is spent on silicon rather than on the
            weather — the subject of{" "}
            <Link href="/engineering/thermal-enclosure" style={link}>
              thermal enclosure design
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 7 · INK BEAT */}
      <QuoteMetric
        quote="A cooling shortfall becomes a density cap, a density cap strands power, and stranded power breaks the economics."
        attribution="PODOS AI Engineering · why the domains cannot be sequenced"
        metric="945 TWh"
        label="IEA projection for data-center electricity in 2030"
        field="blueprint"
      />

      {/* 8 · DOMAINS 05–07 — canvas */}
      <ProseWithRail id="domains-b" surface="canvas" width="content">
        <SectionHead
          eyebrow="Domains 05–07"
          title="The fabric, the telemetry, and the code"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <h3 className="h3" id="networking" style={domainHead}>
            ENG-05 · Networking: the east–west fabric
          </h3>
          <p>
            AI clusters live or die on east–west bandwidth — traffic between accelerators inside the
            cluster, not north–south traffic to the internet. Rack-scale designs make the point
            structurally: the GB200 NVL72 presents 72 GPUs as one NVLink domain because the
            interconnect is, in effect, the computer.<Cite n={7} /> At unit scale the open
            engineering questions are topology, cabling economics, and how a unit{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1-MW block</span> joins a
            larger fabric without re-architecting it — the questions taken up in{" "}
            <Link href="/engineering/networking-fiber" style={link}>
              AI data center network architecture: fiber and leaf-spine
            </Link>
            .
          </p>

          <h3 className="h3" id="monitoring" style={domainHead}>
            ENG-06 · Monitoring: telemetry as a design input
          </h3>
          <p>
            Half of the operators surveyed by Uptime Institute in 2025 reported an impactful outage
            within the previous three years.<Cite n={3} /> Monitoring is the difference between a
            derate you catch and an outage you explain. In a factory-built unit, telemetry can be
            designed in — sensor points and alarms specified on the production line rather than
            commissioned ad hoc at each site. The open questions are which signals matter per
            subsystem, and what a fleet of standardized units makes possible that one-off facilities
            cannot: like-for-like comparison across every unit in service. Both are worked through in{" "}
            <Link href="/engineering/monitoring-controls" style={link}>
              data-center monitoring and controls
            </Link>
            .
          </p>

          <h3 className="h3" id="safety" style={domainHead}>
            ENG-07 · Safety: fire, energy storage, and code
          </h3>
          <p>
            Data-center safety is governed by code. NFPA 75 covers fire protection for
            information-technology equipment spaces, and its 2024 edition moves stationary
            lithium-ion battery requirements out to NFPA 855 — so any unit that carries on-site
            energy storage inherits both standards.<Cite n={9} /> Factory manufacture changes the
            compliance surface: detection, suppression, and egress can be engineered into a
            repeatable product instead of re-derived per project. It does not remove the local
            permitting authority, whose review remains site-specific. The standards landscape is
            mapped in{" "}
            <Link href="/engineering/safety-security" style={link}>
              modular data center fire safety and physical security
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 9 · POD MAPPING — paper, split with the systems bench */}
      <SplitFeature
        imageId="engineering-systems-bench"
        eyebrow="In the product"
        title="How the seven domains map to"
        accent="the PODOS Pod"
        surface="paper"
        field="blueprint"
        flip
      >
        <p>
          The positions above are embodied in one product.{" "}
          <span data-claim="unit-capacity-1mw">
            Each PODOS Pod is designed as a standardized 1-MW building block
          </span>{" "}
          that integrates power, cooling, racks, and networking in a factory-built unit, with{" "}
          <span data-claim="deployment-window">
            a 90-day target window from order to commissioning
          </span>{" "}
          — a target, not a measured deployment record. The hardware is specified on the{" "}
          <Link href="/platform/podos-pod" style={link}>
            PODOS Pod product page
          </Link>
          ; the order-to-commissioning process is described in{" "}
          <Link href="/deploy" style={link}>
            deployment
          </Link>
          ; terms used across this cluster are defined in the{" "}
          <Link href="/resources/ai-infrastructure-glossary" style={link}>
            AI infrastructure glossary
          </Link>
          . The software layer above the hardware is covered under{" "}
          <Link href="/platform/syntropic" style={link}>
            Syntropic
          </Link>
          , and the company&rsquo;s investor page is at{" "}
          <Link href="/invest" style={link}>
            invest
          </Link>
          .
        </p>
      </SplitFeature>

      {/* 10 · LIMITS — mandatory, canvas */}
      <LimitsBlock
        title="Limitations of this index"
        items={[
          "PODOS figures on this page are design targets. No measured efficiency, uptime, or deployment data is published here, because no figures from completed customer deployments exist to publish.",
          "This page is an index, not an argument. Each domain is summarized in a paragraph; the engineering positions, tradeoffs, and honest limits belong to the eight deep dives linked above, and the summaries here are deliberately lossy.",
          "Site-specific engineering is out of scope: utility interconnection, permitting, and structural loading vary by jurisdiction and often dominate real project schedules.",
          "External figures carry their source's as-of year and are re-verified on the date shown at the top of the page; annual reports roll, and newer editions supersede the citations below.",
        ]}
      />

      {/* 11 · SOURCES — paper */}
      <Section surface="paper" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 12 · RELATED — canvas */}
      <RelatedRail
        title="Continue"
        items={[
          {
            href: "/compare/modular-ai-data-center-vs-traditional-data-center",
            label: "COMPARE",
            title: "Modular vs traditional data center",
          },
          { href: "/platform/podos-pod", label: "PLATFORM", title: "The PODOS Pod, specified" },
          { href: "/deploy", label: "DEPLOY", title: "Order to commissioning" },
          {
            href: "/resources/ai-infrastructure-glossary",
            label: "RESOURCE",
            title: "AI infrastructure glossary",
          },
        ]}
      />

      {/* 13 · CTA — ink */}
      <CTABand
        title="Bring the seven domains to"
        accent="your site"
        body="Send the load, the site, and the constraint that worries you most. Engineering will tell you which domain decides your build."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy", label: "See the deployment model" }}
        field="blueprint"
      />
    </main>
  );
}
