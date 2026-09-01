/**
 * /engineering/data-center-power-architecture — Archetype A, engineering
 * deep dive. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, zero client JS. Composed entirely from the section
 * library (src/components/seo/sections.tsx) — 14 sections, 12 distinct
 * types, surfaces rotating paper/canvas with ink on the hero, the pull
 * quote, and the CTA. All external numbers cite the source register;
 * company figures render only from claims.ts publishable entries with
 * their required qualifiers, carried through as data-claim.
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  HeroSplit,
  SummaryBand,
  ProseWithRail,
  MatrixTable,
  SplitFeature,
  QuoteMetric,
  CardGrid,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/engineering/data-center-power-architecture";
const TITLE = "AI Data Center Power Architecture: Utility to Rack | PODOS";
const DESCRIPTION =
  "How power moves through an AI data center — utility interconnection, MV switchgear, transformers, UPS, and busway distribution — and where a 1 MW block fits.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Energy and AI — Executive Summary",
    publisher: "International Energy Agency (IEA)",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
    date: "Apr 2025",
  },
  {
    n: 2,
    name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf",
    date: "Dec 2024",
  },
  {
    n: 3,
    name: "Data centre electricity use surged in 2025, even with tightening bottlenecks driving a scramble for solutions",
    publisher: "International Energy Agency (IEA), news",
    url: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions",
    date: "2025",
  },
  {
    n: 4,
    name: "Demonstrating the Data Center as a Flexible Grid Asset",
    publisher: "NREL (U.S. Department of Energy)",
    url: "https://docs.nrel.gov/docs/fy25osti/94844.pdf",
    date: "FY2025",
  },
  {
    n: 5,
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 6,
    name: "GB200 NVL72 product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    date: "spec page, ongoing",
  },
  {
    n: 7,
    name: "IEEE 3006 series — Power Systems Reliability for industrial and commercial facilities",
    publisher: "IEEE",
    url: "https://standards.ieee.org/ieee/3006.1/7391/",
    date: "2013–2018 per part",
  },
  {
    n: 8,
    name: "NFPA 855 — Standard for the Installation of Stationary Energy Storage Systems",
    publisher: "NFPA (publisher catalog)",
    url: "https://www.nfpa.org",
    date: "current edition",
  },
];

/* FAQ — visible copy and FAQJsonLd share these exact strings. */
const FAQ = [
  {
    q: "What voltage does a data center take from the utility?",
    a: "It depends on facility size and the serving utility. Smaller facilities take medium-voltage distribution service — 4.16 kV to 34.5 kV classes are common in North America — while large campuses interconnect at transmission voltages through a dedicated substation. The PODOS Pod is designed to accept medium-voltage service in a widely used North American distribution class.",
  },
  {
    q: "Why is grid interconnection the long pole for AI data centers?",
    a: "Because the interconnection study, upgrade, and energization process is controlled by the utility, not the builder. The IEA identifies grid-connection bottlenecks as a primary constraint on data-center growth, and demand keeps compounding the queue. Every other stage of the power chain can be compressed with engineering; the interconnection date largely cannot.",
  },
  {
    q: "Do AI facilities need UPS coverage for the entire load?",
    a: "It is a design choice, not a rule. Some operators protect the full IT load with double-conversion UPS; others protect only control, network, and storage planes and accept interruption risk on restartable compute. On-site battery systems fall under NFPA 855, and NREL has shown large batteries can also serve the grid, dispatching a 35 MW battery system in under five seconds in a 70 MW grid-interactive demonstration.",
  },
];

/* The one-line diagram, stage by stage — every row preserved. */
const CHAIN_ROWS: ReactNode[][] = [
  [
    <span key="p" className="pill">PW-01</span>,
    "Utility interconnection at the point of common coupling",
    "Transmission (69 kV and up) for campuses; MV distribution for smaller sites",
    "Delivers grid energy under a studied, contracted allocation",
    "Everything — the interconnection date sets the schedule",
  ],
  [
    <span key="p" className="pill">PW-02</span>,
    "Service entrance and revenue metering",
    "MV classes such as 4.16–34.5 kV; 13.8 kV is a common class",
    "Marks the utility demarcation; measures billed energy and demand",
    "No legal or commercial boundary between utility and facility",
  ],
  [
    <span key="p" className="pill">PW-03</span>,
    "Medium-voltage switchgear — breakers and protective relays",
    "Same MV class as the service",
    "Isolates faults; sectionalizes the plant so parts can be maintained live",
    "A single fault anywhere de-energizes the entire facility",
  ],
  [
    <span key="p" className="pill">PW-04</span>,
    "Step-down transformers",
    "MV to LV — for example 13.8 kV to 480 V three-phase",
    "Converts distribution voltage to a level IT power equipment accepts",
    "No usable voltage for downstream distribution",
  ],
  [
    <span key="p" className="pill">PW-05</span>,
    "Low-voltage distribution — busway, switchboards, panelboards",
    "480 V / 415 V three-phase",
    "Carries power across the white space; busway tap-offs let rack rows move without rewiring",
    "Stranded capacity — power exists but cannot reach new racks",
  ],
  [
    <span key="p" className="pill">PW-06</span>,
    "UPS and energy storage",
    <>LV, with battery strings per NFPA 855<Cite n={8} /></>,
    "Rides through sags and short outages; bridges to standby generation",
    "Every grid disturbance becomes a compute interruption",
  ],
  [
    <span key="p" className="pill">PW-07</span>,
    "PDU and rack distribution",
    <>415 / 240 V to the rack; vendor rack architectures are pushing this stage upward<Cite n={6} /></>,
    "Final delivery, branch protection, and per-rack metering",
    "No visibility into which racks draw what — capacity planning goes blind",
  ],
  [
    <span key="p" className="pill">PW-08</span>,
    "Protection and monitoring layer — relay coordination, power quality meters, EPMS",
    "Spans every level above",
    <>Trips the smallest possible zone on a fault; streams telemetry for operations<Cite n={7} /></>,
    "Faults cascade upstream; small events become site-wide outages",
  ],
];

/* Site power readiness — PR-01 … PR-08, wording preserved. */
const READINESS = [
  {
    code: "PR-01",
    title: "Deliverable capacity",
    body: "Deliverable capacity confirmed in writing at the point of interconnection — not nameplate feeder capacity.",
  },
  {
    code: "PR-02",
    title: "Voltage class and fault current",
    body: "Service voltage class, available fault current, and the utility's protection requirements at the demarcation.",
  },
  {
    code: "PR-03",
    title: "Energization date",
    body: "Interconnection study status and a realistic energization date — the schedule anchor for everything else.",
  },
  {
    code: "PR-04",
    title: "Space and clearances",
    body: "Space and access for MV gear, transformers, and battery enclosures, with code-required clearances.",
  },
  {
    code: "PR-05",
    title: "Coordination study ownership",
    body: "Who owns the relay coordination study across the utility boundary, and when it happens.",
  },
  {
    code: "PR-06",
    title: "Battery permitting",
    body: "Battery permitting path under NFPA 855 and the local fire authority's stance on lithium storage.",
  },
  {
    code: "PR-07",
    title: "Metering and telemetry",
    body: "Metering and telemetry obligations — utility settlement metering plus the facility's own EPMS reach.",
  },
  {
    code: "PR-08",
    title: "Room for a second block",
    body: "Whether the interconnection and gear sizing admit a second block without a restudy.",
  },
];

const NAV: [string, string][] = [
  ["#why", "Why density changed it"],
  ["#one-line", "The one-line diagram"],
  ["#protection", "UPS and protection"],
  ["#readiness", "Site readiness"],
  ["#limitations", "Honest limits"],
  ["#faq", "FAQ"],
];

export default function DataCenterPowerArchitecturePage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Data center power architecture for AI workloads"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — ink, text left, switchgear render right */}
      <HeroSplit
        code="ENG-02"
        cluster="Engineering · Power"
        title="Data center power architecture"
        accent="for AI workloads"
        lede="Power architecture is the chain of electrical equipment that moves energy from a utility interconnection point to the server racks: medium-voltage service, switchgear, transformers, low-voltage distribution, UPS and batteries, and the protection and monitoring layer that keeps the chain safe. This page walks that chain stage by stage."
        imageId="power-switchgear-bay"
        field="power"
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Engineering", path: "/engineering" },
              { name: "Power Architecture", path: PATH },
            ]}
          />
        }
        metrics={[
          { value: "08", label: "Stages, utility to rack" },
          { value: "01", label: "Stage outside the builder's control" },
          { value: "13.8 kV", label: "A common service class" },
        ]}
      />

      {/* 2 · SUMMARY — canvas */}
      <SummaryBand
        title="What you need to know"
        items={[
          {
            code: "01",
            title: "Power is the gating discipline",
            body: "Demand is compounding while rack densities climb. Power, not compute, now decides what a site can host.",
          },
          {
            code: "02",
            title: "Eight stages, one line",
            body: "From the utility point of common coupling to rack PDUs, every design walks the same chain of transformation and protection.",
          },
          {
            code: "03",
            title: "The utility owns the calendar",
            body: "Interconnection is studied, upgraded, and energized on the utility's process — the one stage engineering cannot compress.",
          },
          {
            code: "04",
            title: "Protection sets the blast radius",
            body: "Relay coordination and metering decide whether a fault trips one zone or the entire service entrance.",
          },
        ]}
      />

      {/* 3 · WHY — prose with a sticky rail */}
      <ProseWithRail
        id="why"
        surface="paper"
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
            <div style={{ marginTop: "2rem" }}>
              <LastVerified
                published="2026-08-31"
                lastVerified="2026-08-31"
                author="Josef Elimelech"
                reviewer="PODOS AI Engineering"
              />
            </div>
          </div>
        }
      >
        <SectionHead
          eyebrow="The load and the grid"
          title="Why AI density changes the electrical problem"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The load is growing faster than the grid that feeds it. The IEA&apos;s 2025 analysis puts
            data centers at roughly 1.5 percent of global electricity consumption, on a path toward
            around 945 TWh by 2030.<Cite n={1} /> In the United States, Berkeley Lab measured data
            centers at 4.4 percent of national electricity in 2023 and projects 6.7 to 12 percent by
            2028.<Cite n={2} />
          </p>
          <p>
            Density is climbing at the same time. The Uptime Institute&apos;s 2025 operator survey
            shows typical rack densities rising into the 10–30 kW band<Cite n={5} /> — and
            accelerated racks leave that band entirely: NVIDIA&apos;s GB200 NVL72 integrates 72 GPUs
            and 36 CPUs into a single liquid-cooled rack.<Cite n={6} /> Power, not compute, has
            become the gating design discipline. The thermal half of the same problem is covered in
            our explainer on{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
              direct-to-chip liquid cooling
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · THE ONE-LINE — wide reference table */}
      <MatrixTable
        id="one-line"
        surface="canvas"
        field="power"
        eyebrow="Utility-to-rack power chain"
        title="The one-line diagram, stage by stage"
        lede="Electrical engineers compress the whole facility into a one-line diagram: a single path from grid to rack with every transformation and protection device on it. The table walks that line in order. Voltage classes are typical North American values — exact levels are set by the serving utility and local code."
        head={["Stage", "Equipment", "Typical level", "What it does", "What fails without it"]}
        rows={CHAIN_ROWS}
      />

      {/* 5 · INTERCONNECTION — split, transformer yard on the left */}
      <SplitFeature
        imageId="power-transformer-yard"
        eyebrow="Stages PW-01 to PW-04, at the site boundary"
        title="Interconnection: the schedule is set at the grid,"
        accent="not the site"
        flip
        surface="paper"
        field="power"
      >
        <p>
          Interconnection requests are studied, upgraded, and energized on the utility&apos;s
          process, and the IEA reports those grid-connection bottlenecks tightened through 2025 even
          as data-center electricity use surged.<Cite n={3} /> Its Energy and AI analysis names grid
          constraints among the principal limits on how fast new AI capacity comes online.
          <Cite n={1} />
        </p>
        <p>
          Flexibility is emerging as a negotiating tool. NREL demonstrated a 70 MW grid-interactive
          data center in which a 35 MW battery system responded to grid dispatch in under five
          seconds with compute service-level agreements intact<Cite n={4} /> — a facility that can
          shed or shift load is a smaller problem for a constrained grid. The same logic favors
          right-sized blocks: a <span data-claim="unit-capacity-1mw">1 MW</span> request lands very
          differently in a utility study than a 100 MW campus. How PODOS approaches siting and
          energization is covered under{" "}
          <Link href="/deploy" style={link}>
            deployment
          </Link>
          .
        </p>
      </SplitFeature>

      {/* 6 · INK BEAT */}
      <QuoteMetric
        quote="Of the eight stages, only the first is outside the builder's control — and it dominates the calendar."
        attribution="PODOS AI Engineering · interconnection as the schedule anchor"
        metric="35 MW"
        label="Battery dispatched in under five seconds, NREL demonstration"
        field="power"
      />

      {/* 7 · UPS, BATTERIES, PROTECTION — prose */}
      <ProseWithRail id="protection" surface="canvas">
        <SectionHead eyebrow="Inside the chain" title="UPS, batteries, and the protection layer" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The UPS question for AI facilities is no longer &quot;how many minutes of runtime&quot;
            but &quot;which loads deserve protection at all.&quot; Double-conversion UPS on the full
            IT load is the conservative answer. A growing alternative is tiered protection: control
            plane, network, and storage stay on UPS, while interruptible training capacity rides on
            the grid with battery ride-through only — a checkpointed training job tolerates a
            restart; a latency-bound inference service does not.
          </p>
          <p>
            Batteries carry their own engineering envelope. Stationary storage installations fall
            under NFPA 855, which governs spacing, enclosure, and fire protection for lithium
            systems.<Cite n={8} /> Reliability analysis of the whole chain — UPS topology, bypass
            paths, maintenance concurrency — is the subject of the IEEE 3006 series.<Cite n={7} />{" "}
            And storage is becoming an asset rather than pure insurance: the NREL demonstration
            above used the batteries that protect the load to sell fast response back to the grid.
            <Cite n={4} />
          </p>
          <h3 className="h3" style={{ marginTop: "2.25rem" }}>
            Protection and monitoring
          </h3>
          <p>
            Protection design decides how much of the facility a single fault takes down. A
            coordination study tunes every relay and breaker so the device nearest the fault trips
            first, containing the event to one zone instead of tripping the service entrance.
            Arc-flash analysis, selective coordination, and single-point-of-failure review are the
            standard disciplines here.<Cite n={7} /> The monitoring layer — power meters at every
            level feeding an electrical power management system — turns the chain from static copper
            into an operable system: per-rack telemetry exposes stranded capacity, phase imbalance,
            and drift before they become outages. Definitions for the vocabulary on this page live
            in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={link}>
              AI infrastructure glossary
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 8 · READINESS CHECKLIST — cards */}
      <CardGrid
        id="readiness"
        surface="paper"
        field="power"
        columns={2}
        eyebrow="Site power readiness"
        title="What to confirm before anything ships"
        lede="Field-built or factory-built, these are the questions a power engineer asks about a candidate site — cheaper to answer early than during commissioning."
        items={READINESS}
      />

      {/* 9 · LIMITS — mandatory */}
      <LimitsBlock
        title="Limitations and open questions"
        lede="Where this walkthrough stops."
        items={[
          "This page is a descriptive walkthrough, not a design document.",
          "Voltage classes, interconnection procedures, and permitting differ by utility, state, and country.",
          "Nothing here substitutes for a licensed engineer's site-specific one-line and study set.",
        ]}
      />

      {/* 10 · PODOS APPLICATION — split, busway on the right */}
      <SplitFeature
        imageId="power-busway-run"
        eyebrow="Stage PW-05 across the white space"
        title="What a factory-integrated 1 MW block"
        accent="changes"
        surface="paper"
        field="power"
      >
        <p>
          In a conventional project, stages PW-02 through PW-08 are engineered per site: one-line
          drawn, gear procured, field-installed, then commissioned in place. The PODOS approach
          moves that work into a factory. Each PODOS Pod is{" "}
          <span data-claim="unit-capacity-1mw">designed as a standardized 1-MW building block</span>{" "}
          with transformation, distribution, protection, and monitoring integrated and tested before
          shipment — designed to accept standard medium-voltage service at the site boundary, so the
          site-specific scope narrows to the interconnection and the MV tie-in. Inside, each unit is{" "}
          <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span> on a closed-loop
          liquid-cooling plant matched to the electrical envelope.
        </p>
        <p>
          Compressing stages PW-02 to PW-08 into a manufactured product is why PODOS{" "}
          <span data-claim="deployment-window">
            targets a 90-day window from order to commissioning
          </span>{" "}
          for a standard unit — a target, not a measured deployment figure. The full specification
          lives on the{" "}
          <Link href="/platform/podos-pod" style={link}>
            PODOS Pod product page
          </Link>
          , and the trade-offs against field-built plants are examined in{" "}
          <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={link}>
            modular vs traditional data centers
          </Link>
          .
        </p>
        <p>
          Rack-level distribution is a moving target — vendor rack architectures keep reshaping
          stages PW-05 through PW-07,<Cite n={6} /> and published per-rack power figures vary by
          configuration, so we cite the architecture, not a wattage. On the PODOS side: all unit
          figures on this page — <span data-claim="unit-capacity-1mw">1 MW capacity</span>,{" "}
          <span data-claim="pod-gpu-capacity">128-GPU compute</span>,{" "}
          <span data-claim="deployment-window">the 90-day window</span> — are design targets for a
          factory-built product, not measurements from completed deployments, and a 1 MW block still
          requires a utility interconnection process like any other load. How the electrical,
          thermal, and software layers fit together is on the{" "}
          <Link href="/platform" style={link}>
            platform page
          </Link>
          , and the rest of the engineering series is indexed at{" "}
          <Link href="/engineering" style={link}>
            /engineering
          </Link>
          .
        </p>
      </SplitFeature>

      {/* 11 · FAQ */}
      <FAQBlock items={FAQ} surface="canvas" />

      {/* 12 · SOURCES */}
      <Section surface="paper" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED */}
      <RelatedRail
        title="Adjacent systems"
        items={[
          {
            href: "/engineering/direct-to-chip-liquid-cooling",
            label: "ENGINEERING",
            title: "Direct-to-chip liquid cooling, explained",
          },
          { href: "/platform/podos-pod", label: "PLATFORM", title: "PODOS Pod specification" },
          {
            href: "/compare/modular-ai-data-center-vs-traditional-data-center",
            label: "COMPARE",
            title: "Modular vs traditional data centers",
          },
          { href: "/invest", label: "INVESTORS", title: "Investor information" },
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Size the power chain for"
        accent="your site"
        body="Send the interconnection status, the service class, and the capacity you can actually get delivered. Engineering will tell you what a pod-based block looks like there."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy", label: "See the deployment model" }}
        field="power"
      />
    </main>
  );
}
