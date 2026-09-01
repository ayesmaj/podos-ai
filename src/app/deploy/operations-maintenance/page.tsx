/**
 * /deploy/operations-maintenance — Archetype C, deployment stage guide (DP-06).
 * See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, composed from the section library. The page carries no
 * images of its own, so the hero is editorial and the visual moments are the
 * stage strip, two wide matrices, and a single ink beat.
 *
 * Claims discipline: only publishable ids from src/content/data/claims.ts
 * render, each wrapped in data-claim with its required qualifier. External
 * numbers cite docs/seo/source-register.md rows only.
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
  CardGrid,
  ProseWithRail,
  MatrixTable,
  QuoteMetric,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/deploy/operations-maintenance";
const TITLE = "AI Data Center Operations and Maintenance: An O&M Guide";
const DESCRIPTION =
  "How AI data center operations and maintenance works: service access, monitoring, preventive maintenance, spares strategy, upgrades, and lifecycle planning.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Global Data Center Survey 2025 (15th annual, 800+ operator respondents)",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 2,
    name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org",
    date: "2021",
  },
  {
    n: 3,
    name: "ACS Liquid Cooling Cold Plate Requirements, Rev 1.0",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/documents/ocp-acs-liquid-cooling-cold-plate-requirements-pdf",
  },
  {
    n: 4,
    name: "Liquid in the Rack: Liquid Cooling Your Data Center (NREL presentation)",
    publisher: "LBNL / NREL (DOE)",
    url: "https://datacenters.lbl.gov/sites/default/files/Liquid_Cooling_Your_Data_Center-NREL-EE.pdf",
  },
  {
    n: 5,
    name: "Redfish Scalable Platforms Management API Specification (DSP0266)",
    publisher: "DMTF",
    url: "https://www.dmtf.org/standards/redfish",
    date: "v1.24.0, Apr 2026",
  },
  {
    n: 6,
    name: "IEC 61000-4-30 Ed. 4.0 — Power quality measurement methods",
    publisher: "IEC",
    url: "https://webstore.iec.ch/en/publication/71611",
    date: "Oct 2025",
  },
  {
    n: 7,
    name: "NFPA 72 — National Fire Alarm and Signaling Code",
    publisher: "NFPA",
    url: "https://www.nfpa.org/product/nfpa-72-national-fire-alarm-and-signaling-code/p0072code",
    date: "current edition",
  },
  {
    n: 8,
    name: "SP 800-53 Rev. 5 — Security and Privacy Controls (PE control family)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final",
    date: "Sep 2020, upd. 2025",
  },
  {
    n: 9,
    name: "FAQs: Enclosures (ANSI/NEMA 250 enclosure types vs IP codes)",
    publisher: "NEMA",
    url: "https://www.nema.org/docs/default-source/standards-document-library/faq-enclosures.pdf",
    date: "accessed 2026-08-31",
  },
  {
    n: 10,
    name: "IEEE 3006 series — Power Systems Reliability (incl. 3006.7, continuous power systems)",
    publisher: "IEEE",
    url: "https://standards.ieee.org/ieee/3006.1/7391/",
    date: "2013–2018",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "What does operations and maintenance cover in a modular AI data center?",
    a: "Six workstreams: monitoring and alarm response, preventive maintenance on the cooling and power plant, corrective maintenance and spares, access control, upgrade planning, and end-of-life or relocation planning. Only the first is continuous.",
  },
  {
    q: "Does liquid cooling make maintenance harder?",
    a: "It adds a discipline rather than a difficulty. A liquid loop brings coolant chemistry, filtration, and leak-detection tasks an air-cooled room does not have, and technicians break fluid couplings instead of sliding servers out of airflow. In exchange, the thermal envelope is far more stable.",
  },
  {
    q: "How many people does a modular unit need on site?",
    a: "Fewer than a conventional room of equivalent capacity, but never zero. Remote telemetry handles observation and first-line diagnosis; scheduled work, component replacement, and anything involving fluids or energized equipment needs a technician on site.",
  },
];

const link: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

const MAINTENANCE: [string, string, string, string, number][] = [
  [
    "OM-01",
    "Coolant chemistry",
    "Sample and correct inhibitor level, conductivity, and biological growth.",
    "Corrosion products reach the cold plates and raise die temperature before an alarm fires.",
    3,
  ],
  [
    "OM-02",
    "Filtration",
    "Change on differential pressure, not on a calendar date.",
    "A blinded filter starves rack flow; a bypassed one sends particulate to the cold plates.",
    3,
  ],
  [
    "OM-03",
    "Pumps, CDU, disconnects",
    "Rotate redundant pumps, verify failover, inspect seals, rehearse isolation.",
    "Redundancy that is never exercised is an assumption, not a capability.",
    4,
  ],
  [
    "OM-04",
    "Heat rejection",
    "Clean coil surfaces; verify approach temperature against the design ambient.",
    "Approach drifts with fouling, so capacity is lost on the hottest days.",
    2,
  ],
  [
    "OM-05",
    "Power train",
    "Thermography on terminations, breaker and trip-unit testing, battery and generator load tests.",
    "Hot terminations and untested batteries are the classic outage.",
    10,
  ],
  [
    "OM-06",
    "Life safety and access",
    "Test detection, alarm, and suppression per code; review access authorizations.",
    "Drifted detection is worse than none, because it is trusted.",
    7,
  ],
];

const REFRESH_GATES: [string, string, string][] = [
  [
    "01",
    "Does the loop have headroom at the same supply temperature?",
    "Cold plates, flow rate, and whether heat rejection must be resized.",
  ],
  [
    "02",
    "Does the power train carry the new draw with redundancy intact?",
    "Distribution capacity, protection settings, battery autonomy.",
  ],
  [
    "03",
    "Does the fabric match the new node count and port speeds?",
    "Optics, cabling, and when redesign beats adaptation.",
  ],
  [
    "04",
    "Is the physical work possible in the window, with the access you have?",
    "A rolling in-place swap versus a unit taken out of service.",
  ],
];

/* The six-stage chain. DP-06 is this page. */
const STAGES: { code: string; title: string; href: string; body: string }[] = [
  {
    code: "DP-01",
    title: "Site and power readiness",
    href: "/deploy/site-power-readiness",
    body: "The power path, the pad, and the access route, confirmed before anything is built.",
  },
  {
    code: "DP-02",
    title: "Configuration engineering",
    href: "/deploy/configuration-engineering",
    body: "Where the loop, the power train, and the fabric are fixed for the life of the unit.",
  },
  {
    code: "DP-03",
    title: "Factory build and testing",
    href: "/deploy/factory-build-testing",
    body: "Integration and test happen in the plant rather than on the site.",
  },
  {
    code: "DP-04",
    title: "Transport and placement",
    href: "/deploy/transport-placement",
    body: "The unit moves by road to the prepared pad and is set in place.",
  },
  {
    code: "DP-05",
    title: "Commissioning",
    href: "/deploy/commissioning",
    body: "Where the baseline every later trend is measured against gets set.",
  },
  {
    code: "DP-06",
    title: "Operations and maintenance",
    href: PATH,
    body: "You are here. The first five stages end on a fixed date; this one does not.",
  },
];

const TOC: [string, string][] = [
  ["#scope", "Scope and service access"],
  ["#preventive", "The maintenance register"],
  ["#monitoring", "Monitoring and intervals"],
  ["#spares", "Spares strategy"],
  ["#lifecycle", "Upgrades and lifecycle"],
  ["#podos", "In the product"],
  ["#limitations", "When it does not fit"],
  ["#faq", "Questions"],
];

export default function OperationsMaintenancePage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Operations and maintenance for a modular AI data center"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — editorial: this page carries no product shot of its own */}
      <HeroEditorial
        category="Deployment · DP-06 · Stage 06 of 06"
        title="Operations and maintenance for a"
        accent="modular AI data center"
        lede="Operations and maintenance is the stage that lasts. It runs six workstreams — monitoring and alarm response, preventive maintenance, corrective maintenance and spares, access control, upgrade planning, and end-of-life planning — against a machine watched remotely and touched on a schedule. This guide covers what sets the intervals and where a modular unit changes the answer."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Deployment", path: "/deploy" },
              { name: "Operations & maintenance", path: PATH },
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
          { value: "06", label: "Deployment stage" },
          { value: "6", label: "Operating workstreams" },
          { value: "3", label: "Spares tiers" },
        ]}
      />

      {/* 2 · WHAT THIS STAGE DELIVERS — canvas */}
      <SummaryBand
        title="What stage 06 delivers"
        items={[
          {
            code: "01",
            title: "Six workstreams, one continuous",
            body: "Monitoring and alarm response runs without pause. Preventive maintenance, corrective work and spares, access control, upgrade planning, and end-of-life planning run on triggers.",
          },
          {
            code: "02",
            title: "A register, not a calendar",
            body: "Six subsystems, each with an owner, a trigger, and a recorded result. Intervals come from the equipment manufacturer and the governing code.",
          },
          {
            code: "03",
            title: "A spares pool sized by lead time",
            body: "Three tiers — on-unit, regional pool, factory or vendor — sorted by whether holding a part costs less than the downtime its lead time would cause.",
          },
          {
            code: "04",
            title: "A refresh plan with four gates",
            body: "Loop headroom, power train, fabric, and physical access, each cleared before a hardware refresh becomes a purchase decision.",
          },
        ]}
      />

      {/* 3 · THE STAGE CHAIN — paper, this stage emphasised */}
      <CardGrid
        eyebrow="The deployment chain"
        title="Six stages, and where this one sits"
        lede="Stages 01 through 05 each end on a fixed date. Stage 06 inherits every decision they made."
        surface="paper"
        field="deploy"
        columns={3}
        items={STAGES.map((s) => ({
          code: s.code,
          title: s.title,
          body:
            s.href === PATH ? (
              <>
                <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>{s.body}</strong>
              </>
            ) : (
              <>
                {s.body}{" "}
                <Link href={s.href} style={link}>
                  Stage {s.code.slice(3)}
                </Link>
                .
              </>
            ),
        }))}
      />

      {/* 4 · SCOPE + SERVICE ACCESS — canvas prose with a navigation rail */}
      <ProseWithRail
        id="scope"
        surface="canvas"
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
          eyebrow="Stage scope"
          title="Stage 06 is where the schedule stops and the record starts"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The first five stages of a{" "}
            <Link href="/deploy" style={link}>
              modular deployment
            </Link>{" "}
            end on a fixed date. Operations does not. Every earlier decision — the loop fixed in{" "}
            <Link href="/deploy/configuration-engineering" style={link}>
              configuration engineering
            </Link>
            , the baseline set at{" "}
            <Link href="/deploy/commissioning" style={link}>
              commissioning
            </Link>{" "}
            — becomes a routine or a recurring problem here, one-way. Uptime Institute&apos;s 2025
            survey of 800+ operators still finds outages common and staffing a persistent
            constraint: reasons to design O&amp;M before the unit ships.<Cite n={1} />
          </p>
          <h3 className="h3" style={{ marginTop: "2.25rem" }}>
            Service access: the constraint nobody prices
          </h3>
          <p>
            A maintainable unit is one where every serviceable part can be reached, isolated, and
            replaced by one technician without shutting down the load. Four requirements follow.
            Clearance: room to withdraw a pump, a filter cartridge, or a battery string. Isolation:
            valves and breakers placed so one subsystem drops out while the rest runs, with obvious
            lockout points. Fluid handling: dripless disconnects, a drain and fill path, and a
            rehearsed procedure for breaking a coupling on a live loop.<Cite n={3} /> Environmental
            separation: an outdoor-rated enclosure opens into weather, so ingress rating and
            corrosion class decide what can be serviced in the rain — and enclosure type ratings and
            IP codes do not translate cleanly both ways.<Cite n={9} />
          </p>
          <p>
            In a factory-built unit all four are design parameters tested before shipment rather
            than negotiated with whatever the room turned out to be — but the envelope cannot be
            widened later. Clearance that was wrong in the factory is wrong on site.
          </p>
        </div>
      </ProseWithRail>

      {/* 5 · PREVENTIVE MAINTENANCE REGISTER — wide matrix, paper */}
      <MatrixTable
        id="preventive"
        eyebrow="Preventive maintenance"
        title="The register every unit has to keep"
        lede="Intervals belong to the equipment manufacturer and the governing code, not to a generic table. What is generic is the register: the subsystems that must each have an owner, a trigger, and a recorded result."
        surface="paper"
        field="deploy"
        head={["Code", "Subsystem", "Task", "Consequence of skipping"]}
        rows={MAINTENANCE.map(([code, sub, task, risk, cite]) => [
          <span key={`${code}-c`} className="pill">
            {code}
          </span>,
          <span key={`${code}-s`} style={{ color: "var(--ink-strong)", fontWeight: 500 }}>
            {sub}
          </span>,
          <span key={`${code}-t`}>
            {task}
            <Cite n={cite} />
          </span>,
          risk,
        ])}
      />

      {/* 6 · WHAT THE REGISTER ASSUMES + MONITORING — canvas prose */}
      <ProseWithRail id="monitoring" surface="canvas">
        <SectionHead
          eyebrow="Reading the register"
          title="Monitoring is the input to maintenance, not a substitute"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Loop work (OM-01, OM-02) is the habit air-cooled operators never had to build;
            federal-lab guidance treats it as core practice, not an add-on.<Cite n={4} />{" "}
            Power-train work (OM-05) has the shortest path to a full outage, which is why
            reliability practice counts maintenance inside the reliability calculation.
            <Cite n={10} /> Access records are controls only while somebody audits them.
            <Cite n={8} />
          </p>
          <p>
            Telemetry earns its cost when it changes what a technician does. Server health, thermal,
            and power sensors are readable out-of-band through a vendor-neutral model, so IT
            telemetry survives an unresponsive operating system.<Cite n={5} /> Facility telemetry
            adds the loop — supply and return temperature, differential pressure, flow, filter
            delta-P — and the electrical side, where Class-A methods define how dips, unbalance, and
            harmonics are measured rather than sampled.<Cite n={6} /> The instrumentation
            architecture behind that is covered in the{" "}
            <Link href="/engineering/monitoring-controls" style={link}>
              monitoring and controls guide
            </Link>
            .
          </p>
          <p>
            The operational point is narrower: trends set intervals. Filter changes follow
            differential pressure, coil cleaning follows approach temperature, pump service follows
            vibration.
          </p>
        </div>
      </ProseWithRail>

      {/* 7 · SPARES — cards, paper */}
      <CardGrid
        id="spares"
        eyebrow="Spares strategy"
        title="Three tiers, one decision rule"
        lede="One rule sorts the whole parts list: hold a part locally when holding it costs less than the downtime its lead time would cause. Three tiers fall out."
        surface="paper"
        columns={4}
        items={[
          {
            code: "T1",
            title: "On-unit",
            body: "Anything whose failure stops compute and whose replacement is a hand-tool job: filter cartridges, coolant charge, fans, seals, optics, fuses, a few drives. These live in the unit, not in a supply chain.",
          },
          {
            code: "T2",
            title: "Regional pool",
            body: "Pumps, CDU modules, power modules, breakers, battery strings, spare nodes. Shared across units, sized against failure rates, reachable inside a service-level window.",
          },
          {
            code: "T3",
            title: "Factory or vendor",
            body: "Long-lead assemblies needing requalification: transformers, switchgear, custom manifolds. Managed by contract lead times, not inventory.",
          },
          {
            code: "WHY",
            title: "What makes the pool affordable",
            body: "Standardization is what makes this affordable. When every unit is the same build, one pool covers the fleet and every technician has seen the layout. Individually engineered rooms can pool nothing — the hidden operating cost of bespoke construction.",
          },
        ]}
      />

      {/* 8 · INK BEAT */}
      <QuoteMetric
        quote="A calendar-only plan services healthy equipment and misses degrading equipment."
        attribution="DP-06 · Trends set the intervals"
        metric="06"
        label="Subsystems needing an owner, a trigger, and a recorded result"
        field="deploy"
      />

      {/* 9 · REFRESH GATES — wide matrix, canvas (light surface after the ink beat) */}
      <MatrixTable
        id="lifecycle"
        eyebrow="Upgrades and lifecycle"
        title="Four gates before a refresh becomes a purchase"
        lede="Compute turns over faster than the infrastructure holding it, so a lifecycle plan is a plan for repeated re-population. Each refresh clears four gates before it becomes a purchase decision."
        surface="canvas"
        field="deploy"
        head={["Gate", "Question", "What it constrains"]}
        rows={REFRESH_GATES.map(([n, q, c]) => [
          <span key={`${n}-g`} className="pill">
            {n}
          </span>,
          <span key={`${n}-q`} style={{ color: "var(--ink-strong)", fontWeight: 500 }}>
            {q}
          </span>,
          c,
        ])}
      />

      {/* 10 · LIFECYCLE CLOSE + PODOS — paper prose */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead
          eyebrow="In the product"
          title="How PODOS approaches operations in a factory-built unit"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Density is the variable that moves: the same 2025 survey shows fleet rack densities
            rising into the 10–30 kW band, so plan for the next generation asking for more.
            <Cite n={1} /> A lifecycle plan also needs an ending — decommissioning, coolant
            recovery, data destruction, and, for a relocatable unit, moving it to where demand went.
            Those requirements sit with{" "}
            <Link href="/engineering/thermal-enclosure" style={link}>
              enclosure design
            </Link>{" "}
            and{" "}
            <Link href="/engineering/safety-security" style={link}>
              safety and security
            </Link>
            .
          </p>
          <p>
            PODOS treats the maintenance register as part of the product definition, not a document
            written after handover. Because each{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1-MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, service
            procedures, spares lists, and telemetry maps are identical across units — which is what
            makes a shared pool possible. The closed-loop{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
              direct-to-chip cooling system
            </Link>{" "}
            and the{" "}
            <Link href="/engineering/data-center-power-architecture" style={link}>
              power architecture
            </Link>{" "}
            are commissioned in the factory, so the site inherits a known baseline to trend against.
          </p>
          <p>
            Growth repeats stages 01 through 06 for another unit rather than re-opening a
            construction program, and PODOS{" "}
            <span data-claim="deployment-window">
              targets a 90-day window from order to commissioning
            </span>{" "}
            for a standard unit. Terms here are defined in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={link}>
              AI infrastructure glossary
            </Link>
            , and the buy-versus-rent framing is in the{" "}
            <Link href="/compare/on-prem-ai-infrastructure-vs-cloud" style={link}>
              on-prem versus cloud comparison
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 11 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="When this operating model is not the right fit"
        lede="A remotely monitored, scheduled-touch unit is not universally the right answer."
        items={[
          "No technician within reach. The model assumes a qualified person can be on site inside the response window the workload implies. Without service coverage, the honest answer is more redundancy and a slower expectation — or a different site.",
          "Workloads that tolerate no maintenance window. If nothing can be taken out of service, redundancy has to be bought as a second unit — a capital decision, not a maintenance one.",
          "No operations function. Someone must own the register, read the trends, and act. Where nobody will, a managed or colocation arrangement outperforms a self-operated unit.",
          "Very small or highly variable loads. A fraction of a unit carries the same fixed overhead on too little useful work; compare against rented capacity instead.",
        ]}
      />

      {/* 12 · FAQ — paper */}
      <FAQBlock items={FAQ} surface="paper" />

      {/* 13 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 14 · RELATED — paper; DP-05 closes the stage chain */}
      <RelatedRail
        title="Continue the chain"
        surface="paper"
        items={[
          {
            href: "/deploy/commissioning",
            label: "PREVIOUS · DP-05",
            title: "Commissioning",
          },
          { href: "/deploy", label: "DEPLOYMENT", title: "All six stages" },
          {
            href: "/engineering/monitoring-controls",
            label: "ENGINEERING",
            title: "Monitoring and controls",
          },
          {
            href: "/compare/on-prem-ai-infrastructure-vs-cloud",
            label: "COMPARE",
            title: "On-prem AI infrastructure vs cloud",
          },
        ]}
      />

      {/* 15 · CTA */}
      <CTABand
        title="Design the operating model"
        accent="before the unit ships"
        body="Bring the response window, the spares posture, and the refresh horizon. The configurator walks the same variables an engineering review would."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy", label: "Back to deployment" }}
        field="deploy"
      />
    </main>
  );
}
