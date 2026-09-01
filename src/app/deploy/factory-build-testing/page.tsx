/**
 * /deploy/factory-build-testing — Archetype C, deployment stage guide
 * (stage DP-03). See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, zero client JS. Composed entirely from the section
 * library (src/components/seo/sections.tsx) — 14 sections, 9 distinct
 * types, alternating surfaces. No product photography exists for this
 * page, so the hero is editorial and the visual beats are the two
 * matrices, the card strip, and the ink quote.
 *
 * All external numbers cite the source register; company claims render
 * only from claims.ts publishable entries with their qualifiers.
 */

import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import {
  HeroEditorial,
  SummaryBand,
  CardGrid,
  MatrixTable,
  ProseWithRail,
  QuoteMetric,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/deploy/factory-build-testing";
const TITLE = "Factory Acceptance Testing for Modular Data Center Pods";
const DESCRIPTION =
  "Inside stage 03 of modular AI data center deployment: controlled assembly, QA hold points, burn-in under load, factory acceptance testing, and handover docs.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

const SOURCES: Source[] = [
  {
    n: 1,
    name: "ICC/MBI 1205-2021 — Inspection and Regulatory Compliance in Off-Site Construction (implementation brief)",
    publisher: "International Code Council / Modular Building Institute",
    url: "https://www.iccsafe.org/building-safety-journal/bsj-technical/new-brief-explores-implementation-of-icc-mbi-standards-1200-and-1205-for-off-site-construction/",
    date: "2021 ed. (brief Aug 2022)",
  },
  {
    n: 2,
    name: "Global Data Center Survey 2025 (800+ operator respondents)",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 3,
    name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org",
    date: "2021",
  },
  {
    n: 4,
    name: "ACS Liquid Cooling Cold Plate Requirements, Rev 1.0",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/documents/ocp-acs-liquid-cooling-cold-plate-requirements-pdf",
  },
  {
    n: 5,
    name: "IEEE 3006 series — Power Systems Reliability (incl. 3006.7, continuous power systems)",
    publisher: "IEEE",
    url: "https://standards.ieee.org/ieee/3006.1/7391/",
    date: "2013–2018",
  },
  {
    n: 6,
    name: "IEEE 519-2022 — Harmonic Control in Electric Power Systems",
    publisher: "IEEE",
    url: "https://standards.ieee.org/ieee/519/10677/",
    date: "2022",
  },
  {
    n: 7,
    name: "IEC 61000-4-30 Ed. 4.0 — Power quality measurement methods",
    publisher: "IEC",
    url: "https://webstore.iec.ch/en/publication/71611",
    date: "Oct 2025",
  },
  {
    n: 8,
    name: "IEC 60529 — Degrees of protection provided by enclosures (IP Code)",
    publisher: "International Electrotechnical Commission",
    url: "https://www.iec.ch/ip-ratings",
    date: "1989 + AMD1:1999 + AMD2:2013",
  },
  {
    n: 9,
    name: "NFPA 72 — National Fire Alarm and Signaling Code",
    publisher: "NFPA",
    url: "https://www.nfpa.org/product/nfpa-72-national-fire-alarm-and-signaling-code/p0072code",
    date: "current ed.",
  },
  {
    n: 10,
    name: "Redfish Scalable Platforms Management API Specification (DSP0266)",
    publisher: "DMTF",
    url: "https://www.dmtf.org/standards/redfish",
    date: "v1.24.0, Apr 2026",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "What is a factory acceptance test (FAT)?",
    a: "A factory acceptance test is the documented gate at the end of the production line: the finished unit is run against the frozen configuration and a written test procedure, with every result recorded and every deviation dispositioned before shipment. Passing the FAT is what turns a built unit into a shippable one.",
  },
  {
    q: "Why is factory testing better than testing on site?",
    a: "Because a factory has what a construction site does not: instrumentation, load banks, spare parts on a shelf, the engineers who designed the system, and the ability to stop the line. A defect found at a workstation costs an hour; the same defect found after the unit is set on a pad costs a mobilization, and possibly a crane.",
  },
  {
    q: "Does factory testing replace site commissioning?",
    a: "No. Factory testing proves the unit against factory power, factory water, and factory conditions. Commissioning proves it against your utility, your grounding system, your heat-rejection path, and your climate. The two are sequential gates, not alternatives.",
  },
  {
    q: "What documentation should ship with a factory-built unit?",
    a: "As-built drawings and single-line diagrams, the signed FAT record with raw test data, calibration certificates for the instruments used, torque and pressure logs, coolant chemistry and fill records, firmware and configuration inventories, spare-parts lists, and the operations and maintenance manual. Anything missing at handover becomes an operations problem later.",
  },
];

const BUILD_STEPS: [string, string, string, string][] = [
  [
    "FT-01",
    "Kit release",
    "The frozen configuration is released to the line as a bill of materials; components are serialized and matched against the build record before anything is fastened.",
    "Kit audit — every serial recorded against the unit number.",
  ],
  [
    "FT-02",
    "Structure & enclosure",
    "Frame, insulation, and sealing surfaces are assembled, then the enclosure is checked against the ingress protection it is specified to.",
    "Enclosure integrity check against the declared IP code.",
  ],
  [
    "FT-03",
    "Power distribution",
    "Switchgear, distribution, protection, grounding, and busway are installed and terminated to a written torque schedule.",
    "Point-to-point continuity, insulation resistance, torque log.",
  ],
  [
    "FT-04",
    "Cooling loop",
    "Cold plates, manifolds, quick disconnects, and the CDU are installed, filled with treated coolant, and pressure-held.",
    "Pressure decay test, flow balance per branch, coolant chemistry record.",
  ],
  [
    "FT-05",
    "Racks & IT integration",
    "Racks are populated, cabled, and labeled; structured cabling is tested rather than assumed.",
    "Cable test results and a label-to-drawing reconciliation.",
  ],
  [
    "FT-06",
    "Controls & safety",
    "Sensors, controllers, leak detection, detection and alarm devices, and interlocks are brought up as one system.",
    "Every interlock exercised end to end and logged.",
  ],
  [
    "FT-07",
    "Burn-in",
    "The unit is loaded and run continuously against factory power and factory heat rejection while telemetry is recorded.",
    "Continuous run at rated load with no unresolved fault.",
  ],
  [
    "FT-08",
    "Factory acceptance test",
    "The complete unit is run against the written FAT procedure, with the buyer or their representative invited to witness.",
    "Signed FAT record; every deviation dispositioned before release.",
  ],
];

const FAT_ROWS: [string, string, string][] = [
  [
    "Electrical",
    "Staged energization, protection coordination and trip verification, grounding and bonding continuity, phase rotation, load-bank test at rated load.",
    "Reliability practice for continuous-power systems follows the IEEE 3006 series; harmonics from rectifier-heavy IT load are bounded by IEEE 519.",
  ],
  [
    "Power quality",
    "Voltage, frequency, unbalance, harmonics, dips and swells recorded across the load profile using Class-A measurement methods.",
    "IEC 61000-4-30 fixes the measurement methods and aggregation intervals that make these numbers comparable rather than anecdotal.",
  ],
  [
    "Thermal",
    "Inlet and outlet temperatures, coolant supply and return, approach temperatures, and fan and pump behaviour at rated and step loads.",
    "Checked against the environmental classes the installed IT equipment is specified to, as defined in the ASHRAE thermal guidelines.",
  ],
  [
    "Fluid",
    "Pressure decay hold, flow per branch, filtration and chemistry sampling, disconnect and reconnect of quick couplings.",
    "Cold-plate and coupling expectations follow the OCP cold-plate requirements, which is what keeps a loop serviceable across vendors.",
  ],
  [
    "Controls & alarms",
    "Every setpoint, alarm, interlock, and shutdown path exercised deliberately, including leak detection and emergency stop.",
    "Detection and alarm devices are installed and tested to NFPA 72 practice; each path is proven rather than merely wired.",
  ],
  [
    "Failure modes",
    "Loss of a power path, loss of a pump, loss of heat rejection, and loss of a network path, each induced on purpose under load.",
    "This is the test a live site will not let you run, which is precisely why it belongs in the factory.",
  ],
  [
    "Telemetry",
    "Out-of-band monitoring verified end to end, and a baseline data set captured for the unit as built.",
    "A vendor-neutral telemetry model such as DMTF Redfish keeps that baseline portable to whatever the operator runs.",
  ],
];

/* Which source numbers attach to which FAT row, kept beside the data so a
   row edit cannot silently orphan a citation. */
const FAT_CITES: Record<number, number[]> = {
  0: [5, 6],
  1: [7],
  2: [3],
  3: [4],
  4: [9],
  6: [10],
};

const HANDOVER: string[] = [
  "As-built drawings: single-line diagram, piping and instrumentation diagram, rack elevations, and cable schedule — reconciled against the physical labels, not against design intent.",
  "The signed FAT record with raw data rather than a pass mark: test values, instrument identities, and calibration certificates for the instruments used.",
  "Torque, pressure, and fill logs, including coolant chemistry at fill and the wetted-material list for the loop.",
  "Firmware, configuration, and serial inventory for every controller, PDU, switch, and CDU, so a later replacement can be matched exactly.",
  "Deviation and disposition register: what was found during build and burn-in, what was done about it, and who approved it.",
  "Operations and maintenance manuals carrying the maintenance intervals, consumables, and spare-parts list the operator needs in year one.",
];

export default function FactoryBuildTestingPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Factory build and testing: find the defects before the unit ships"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — editorial. No product shot exists for this stage. */}
      <HeroEditorial
        code="DP-03"
        field="deploy"
        category="Deploy · Stage 03"
        title="Factory build and testing: find the defects"
        accent="before the unit ships"
        lede="Stage 03 is where a modular AI data center is actually built: a frozen configuration moves through a production line with QA hold points, is loaded and run in burn-in, then has to pass a written factory acceptance test before it is allowed onto a truck. The reason to test in a factory rather than on a pad is not speed. It is that a factory can stop, take the unit apart, and try again — and a live site cannot."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Deploy", path: "/deploy" },
              { name: "Factory build & testing", path: PATH },
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
          { value: "8", label: "Stations, kit release to FAT" },
          { value: "7", label: "FAT domains, each recorded" },
          { value: "6", label: "Handover records at the gate" },
        ]}
      />

      {/* 2 · WHAT THE STAGE DELIVERS — canvas */}
      <SummaryBand
        title="What stage 03 delivers"
        items={[
          {
            code: "01",
            title: "A frozen configuration, built to a record",
            body: "The bill of materials is released to the line and components are serialized against the unit number, so every part is matched to the build record before it is fastened.",
          },
          {
            code: "02",
            title: "Eight stations, each with an exit gate",
            body: "Work does not advance until the previous step has produced evidence: torque logs, pressure decay, cable test results, interlocks exercised end to end.",
          },
          {
            code: "03",
            title: "Burn-in, then a witnessed FAT",
            body: "The unit runs continuously at rated load, then passes a written factory acceptance test with every deviation dispositioned before release to transport.",
          },
          {
            code: "04",
            title: "An evidence pack that ships with it",
            body: "As-builts, raw test data, calibration certificates, torque and chemistry logs, firmware inventories, and the deviation register.",
          },
        ]}
      />

      {/* 3 · THE SIX-STAGE CHAIN — paper */}
      <CardGrid
        id="stages"
        eyebrow="The deployment model"
        title="Where stage 03 sits"
        lede="Six stages, run in order. Stage 03 is the only one where the unit can still be taken apart cheaply."
        surface="paper"
        field="deploy"
        columns={3}
        items={[
          {
            code: "DP-01",
            title: "Site & power readiness",
            body: (
              <>
                Utility service, grounding, and the pad. Usually the binding constraint on the
                schedule.{" "}
                <Link href="/deploy/site-power-readiness" style={link}>
                  Stage 01
                </Link>
              </>
            ),
          },
          {
            code: "DP-02",
            title: "Configuration & engineering",
            body: (
              <>
                The configuration is engineered and then frozen — factory build starts at that
                freeze.{" "}
                <Link href="/deploy/configuration-engineering" style={link}>
                  Stage 02
                </Link>
              </>
            ),
          },
          {
            code: "DP-03",
            title: "Factory build & testing",
            body: (
              <>
                <strong>You are here.</strong> Controlled assembly, QA hold points, burn-in under
                load, and a signed factory acceptance test.
              </>
            ),
          },
          {
            code: "DP-04",
            title: "Transport & placement",
            body: (
              <>
                Transport happens after the test: road freight applies shock and vibration a signed
                FAT does not survive on its own.{" "}
                <Link href="/deploy/transport-placement" style={link}>
                  Stage 04
                </Link>
              </>
            ),
          },
          {
            code: "DP-05",
            title: "Commissioning",
            body: (
              <>
                Where the unit is finally proven against a real site — your utility, grounding, and
                heat-rejection path.{" "}
                <Link href="/deploy/commissioning" style={link}>
                  Stage 05
                </Link>
              </>
            ),
          },
          {
            code: "DP-06",
            title: "Operations & maintenance",
            body: (
              <>
                The maintenance intervals, consumables, and spares the handover package specifies,
                run for the service life.{" "}
                <Link href="/deploy/operations-maintenance" style={link}>
                  Stage 06
                </Link>
              </>
            ),
          },
        ]}
      />

      {/* 4 · BUILD SEQUENCE — canvas matrix */}
      <MatrixTable
        id="build-sequence"
        eyebrow="The line"
        title="The build sequence and its hold points"
        lede="A production line converts a project into a sequence of stations, each with an entry condition, a defined scope of work, and an exit gate. The gate matters more than the station: work does not advance until the previous step has produced evidence. The sequence below is the general shape of a modular unit build, from released kit to signed factory acceptance test."
        surface="canvas"
        field="deploy"
        head={["Step", "Station", "Work", "QA hold point / evidence"]}
        rows={BUILD_STEPS.map(([code, station, work, gate]) => [
          <span className="pill" key={code}>
            {code}
          </span>,
          station,
          work,
          gate,
        ])}
      />

      {/* 5 · WHY THE FACTORY, WHAT THE LINE BUYS, BURN-IN — paper prose */}
      <ProseWithRail
        id="why-factory"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {[
                ["#build-sequence", "Build sequence"],
                ["#why-factory", "Why the factory"],
                ["#fat", "Factory acceptance test"],
                ["#documentation", "Documentation set"],
                ["#limitations", "Honest limits"],
                ["#podos", "How PODOS runs it"],
                ["#faq", "FAQ"],
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
        <SectionHead eyebrow="The case" title="Why defect discovery belongs in the factory" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Every defect has a cost that rises with how late it is found, and data-center
            construction is an unusually cruel version of that curve. A miswired current transformer
            caught at a workstation is an hour of rework. The same fault found after the unit is set
            on a pad is a mobilization: a technician flight, a rigging window, a utility outage
            request, and a schedule that now belongs to somebody else&rsquo;s calendar. Site-built
            facilities discover most of their integration defects at commissioning — the worst
            possible place, because that is where the cost of access is highest and the remaining
            float is lowest.
          </p>
          <p>
            The consequences are not theoretical. Uptime Institute&rsquo;s 2025 global survey of
            more than 800 operators reports that roughly half had an impactful outage in the
            previous three years, with configuration, installation, and human error recurring as
            root causes rather than exotic component failures.<Cite n={2} /> Those are exactly the
            failure classes a controlled production line is built to catch: wrong part, wrong torque,
            wrong sequence, untested interlock.
          </p>
          <p>
            Off-site construction also has its own compliance framework, which is worth knowing
            before anyone argues that factory work is the less regulated option. ICC/MBI 1205 covers
            inspection and regulatory compliance for off-site construction: in-plant inspection,
            third-party inspection agencies, the role of the authority having jurisdiction, and how
            in-plant records are accepted rather than repeated in the field.
            <Cite n={1} /> Factory-built does not mean inspection-exempt. It means the inspection
            happens while the work is still visible.
          </p>
        </div>

        <h3 className="h3" style={{ marginTop: "2.5rem" }}>
          What the production line buys
        </h3>
        <div style={{ marginTop: "1rem" }}>
          <p>
            Two properties of that list do the real work. The first is repetition: the same stations
            run for every unit, so a defect found once becomes a permanent change to the procedure
            rather than a lesson one crew happens to remember. The second is single ownership of the
            interfaces — the enclosure,{" "}
            <Link href="/engineering/data-center-power-architecture" style={link}>
              power architecture
            </Link>
            ,{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
              liquid-cooling loop
            </Link>
            , and{" "}
            <Link href="/engineering/networking-fiber" style={link}>
              network fabric
            </Link>{" "}
            are integrated under one build record, instead of by separate trades whose interfaces are
            only tested when the last one has left the site.
          </p>
        </div>

        <h3 className="h3" style={{ marginTop: "2.5rem" }} id="burn-in">
          Burn-in: running the unit before anyone depends on it
        </h3>
        <div style={{ marginTop: "1rem" }}>
          <p>
            Burn-in exists because assemblies fail on a bathtub curve. Infant mortality — a marginal
            solder joint, a weak power supply, a fan bearing that was never right, a cold plate
            seated slightly off — shows up in the first hours under load, not on a bench at idle.
            Running the finished unit continuously at rated load in the factory moves that
            early-failure window to a place where the replacement part is on a shelf ten metres away.
          </p>
          <p>
            It is also the only realistic way to observe the unit as a thermal system rather than a
            parts list. Steady-state load reveals approach temperatures and flow balance; step
            changes reveal control-loop behaviour, pump and fan response, and whether coolant supply
            temperature holds where the design says it should — measured against the environmental
            classes the installed IT equipment is specified to, which the ASHRAE thermal guidelines
            define for both air and facility water.<Cite n={3} /> The telemetry captured during
            burn-in becomes the baseline the{" "}
            <Link href="/engineering/monitoring-controls" style={link}>
              monitoring and controls
            </Link>{" "}
            stack compares against for the rest of the unit&rsquo;s life — a comparison that is only
            useful if the baseline was recorded on that unit, not on a similar one.
          </p>
        </div>
      </ProseWithRail>

      {/* 6 · THE FAT — canvas matrix */}
      <MatrixTable
        id="fat"
        eyebrow="The gate"
        title="The factory acceptance test"
        lede="The FAT is a written procedure agreed before the build, executed on the finished unit, witnessed where the buyer wants to witness it, and signed. It is not a walkthrough and it is not a demonstration. Its function is to convert “we built it to the drawings” into recorded evidence that the unit does what the frozen configuration says it does, with every deviation either corrected or formally dispositioned before the unit is released to transport."
        surface="canvas"
        head={["Domain", "What is tested", "Why it is done this way"]}
        rows={FAT_ROWS.map(([domain, what, why], i) => [
          domain,
          what,
          <span key={domain}>
            {why}
            {(FAT_CITES[i] ?? []).map((n) => (
              <Cite key={n} n={n} />
            ))}
          </span>,
        ])}
      />

      {/* 7 · ENCLOSURE + THE DOCUMENTATION SET — paper prose */}
      <ProseWithRail id="documentation" surface="paper">
        <SectionHead
          eyebrow="Evidence"
          title="Enclosure integrity, and the records that ship with the unit"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Enclosure integrity deserves a separate mention, because it is close to impossible to
            verify once the unit is sited. A sealed outdoor enclosure is specified to an
            ingress-protection code — the IEC 60529 IP code, first digit solids, second digit water
            <Cite n={8} /> — and the place to confirm the as-built enclosure meets its declared
            rating is on the line, with the gaskets, penetrations, and cable entries still in front
            of you.
          </p>
        </div>

        <h3 className="h3" style={{ marginTop: "2.5rem" }}>
          The documentation set is part of the product
        </h3>
        <div style={{ marginTop: "1rem" }}>
          <p>
            A unit that arrives without its records is an undocumented machine, and undocumented
            machines are expensive for their whole service life. The handover package should be
            specified in the contract and checked at the FAT, not requested afterwards.
          </p>
        </div>
        <ul className="limits" style={{ marginTop: "1.75rem" }}>
          {HANDOVER.map((t) => (
            <li key={t.slice(0, 28)}>{t}</li>
          ))}
        </ul>
        <div style={{ marginTop: "1.75rem" }}>
          <p>
            The receiving end needs its own preparation to match; the{" "}
            <Link href="/resources/data-center-readiness-checklist" style={link}>
              readiness checklist
            </Link>{" "}
            covers what has to be true on site before a tested unit arrives.
          </p>
        </div>
      </ProseWithRail>

      {/* 8 · INK BEAT */}
      <QuoteMetric
        quote="A defect found at a workstation costs an hour; the same defect found after the unit is set on a pad costs a mobilization, and possibly a crane."
        attribution="Stage 03 · why the gate sits in the factory"
        metric="~50%"
        label="Operators with an impactful outage in three years — Uptime Institute 2025"
        field="deploy"
      />

      {/* 9 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="What factory testing cannot prove — and when the unit is the wrong fit"
        eyebrow="Honest limits"
        lede="Factory testing is a strong gate, not a complete one. Treating it as complete is how a factory-built unit earns a reputation it does not deserve. The production-line model also trades flexibility for repeatability, and that trade is wrong for some projects — it is cheaper to be honest about this before the configuration freeze than after it."
        items={[
          "It proves the unit against factory power. Your utility service, source impedance, grounding system, and protection coordination with upstream devices are site properties that only site commissioning can verify.",
          "It proves the unit against factory conditions. Ambient extremes, altitude, dust, salt air, seismic and wind loading, and your actual heat-rejection path are not reproduced on a production floor.",
          "It cannot test interfaces that do not exist yet — the path to your carrier, the connection into your monitoring stack, and the operator procedures that surround the machine.",
          "Transport happens after the test. Road freight applies shock and vibration that a signed FAT does not survive on its own, which is why arrival inspection and re-verification of fluid and electrical connections belong in the site scope.",
          "It is only as good as its procedure. A FAT that omits deliberate failure-mode testing, or that accepts a pass mark without raw data, is a ceremony rather than a gate.",
          "The specification is not stable. Factory build starts at a configuration freeze; a project whose hardware selection is still moving will either wait or pay for change orders against work already completed.",
          "The requirement is genuinely bespoke. If the design does not fit the standard envelope — unusual voltages, a custom footprint, a facility loop with no analogue on the line — an engineered site-built solution may serve better than forcing the unit to be special.",
          "There is already commissioned white space with spare power and cooling. Fill it before buying an enclosure the site does not need.",
          "The site cannot physically accept the unit. If heavy-freight access, crane positioning, or load-rated ground are not achievable, factory testing has no bearing on the outcome — the unit still has to arrive.",
          "The workload is small, short-lived, or bursty. A megawatt-class building block is the wrong granularity for a few racks; that is a capacity decision, not a build-method decision.",
        ]}
      />

      {/* 10 · PODOS — paper prose */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="In the product" title="How PODOS runs stage 03" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The underlying tradeoff is laid out in{" "}
            <Link href="/compare/factory-built-vs-site-built-data-center" style={link}>
              factory-built versus site-built data centers
            </Link>
            , and the granularity question in{" "}
            <Link href="/compare/on-prem-ai-infrastructure-vs-cloud" style={link}>
              on-prem AI infrastructure versus cloud
            </Link>
            .
          </p>
          <p>
            A{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, which is what makes
            a repeatable line possible at all: the same stations, the same test procedure, and the
            same evidence pack for every unit. Structure, power distribution, the closed-loop cooling
            circuit, racks, and networking are integrated and tested before the unit is released to
            transport, and safety systems are exercised inside that same gate rather than left as a
            separate{" "}
            <Link href="/engineering/safety-security" style={link}>
              safety and security
            </Link>{" "}
            scope to be handled on site.
          </p>
          <p>
            That is also where the schedule comes from. Because the factory stage runs in parallel
            with site preparation and the unit arrives already proven, PODOS{" "}
            <span data-claim="deployment-window">
              targets a 90-day window from order to commissioning
            </span>{" "}
            for a standard unit — a target, not a guarantee, and one whose binding constraint is
            usually site power rather than the production line. Stage 03 sits between{" "}
            <Link href="/deploy/configuration-engineering" style={link}>
              configuration and engineering
            </Link>{" "}
            and{" "}
            <Link href="/deploy/transport-placement" style={link}>
              transport and placement
            </Link>{" "}
            in the{" "}
            <Link href="/deploy" style={link}>
              six-stage deployment model
            </Link>
            , and hands off to{" "}
            <Link href="/deploy/commissioning" style={link}>
              commissioning
            </Link>
            , which is where the unit is finally proven against a real site.
          </p>
        </div>
      </ProseWithRail>

      {/* 11 · FAQ — canvas */}
      <FAQBlock items={FAQ} surface="canvas" />

      {/* 12 · SOURCES — paper */}
      <Section surface="paper" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED — canvas, previous and next stage first */}
      <RelatedRail
        title="Continue the deployment chain"
        surface="canvas"
        items={[
          {
            href: "/deploy/configuration-engineering",
            label: "PREVIOUS · DP-02",
            title: "Configuration and engineering",
          },
          {
            href: "/deploy/transport-placement",
            label: "NEXT · DP-04",
            title: "Transport and placement",
          },
          {
            href: "/compare/factory-built-vs-site-built-data-center",
            label: "COMPARE",
            title: "Factory-built vs site-built data centers",
          },
          { href: "/deploy", label: "DEPLOY", title: "The six-stage deployment model" },
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Witness the test that releases"
        accent="your unit"
        body="Bring the configuration and the site constraints. Engineering will walk the build sequence, the hold points, and the FAT procedure line by line."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy", label: "Deployment model" }}
        field="deploy"
      />
    </main>
  );
}
