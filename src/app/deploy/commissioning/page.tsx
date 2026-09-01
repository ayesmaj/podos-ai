/**
 * /deploy/commissioning — deployment stage 05 deep-dive.
 * Archetype C, deploy. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, no client JS. This page carries NO registered image
 * of its own — `deploy-commission-check` is already placed on /deploy,
 * and one image serves exactly one placement — so the hero is editorial
 * and every section below is built from image-free types.
 *
 * External facts cite the source register; company claims render only
 * from claims.ts publishable entries with their required qualifiers.
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

const PATH = "/deploy/commissioning";
const TITLE = "Data Center Commissioning Plan: Tests and Sign-Offs";
const DESCRIPTION =
  "What a data center commissioning plan contains: electrical, thermal, network, and controls testing, acceptance criteria, and who signs off at handover.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "ICC/MBI 1205-2021 — Standard for Inspection and Regulatory Compliance in Off-Site Construction",
    publisher: "International Code Council / Modular Building Institute",
    url: "https://www.iccsafe.org/building-safety-journal/bsj-technical/new-brief-explores-implementation-of-icc-mbi-standards-1200-and-1205-for-off-site-construction/",
    date: "2021 ed.",
  },
  {
    n: 2,
    name: "IEEE 3006 series — Power Systems Reliability (incl. 3006.7, continuous power systems)",
    publisher: "IEEE",
    url: "https://standards.ieee.org/ieee/3006.1/7391/",
    date: "2013–2018",
  },
  {
    n: 3,
    name: "IEC 61000-4-30 Ed. 4.0 — Power quality measurement methods",
    publisher: "IEC",
    url: "https://webstore.iec.ch/en/publication/71611",
    date: "2025",
  },
  {
    n: 4,
    name: "IEEE 519-2022 — Standard for Harmonic Control in Electric Power Systems",
    publisher: "IEEE",
    url: "https://standards.ieee.org/ieee/519/10677/",
    date: "2022",
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
    name: "Liquid in the Rack: Liquid Cooling Your Data Center (NREL presentation)",
    publisher: "LBNL / NREL (DOE)",
    url: "https://datacenters.lbl.gov/sites/default/files/Liquid_Cooling_Your_Data_Center-NREL-EE.pdf",
  },
  {
    n: 7,
    name: "ANSI/TIA-942 Telecommunications Infrastructure Standard for Data Centers (rev. C)",
    publisher: "Telecommunications Industry Association",
    url: "https://tiaonline.org/products-and-services/tia942certification/ansi-tia-942-standard/",
  },
  {
    n: 8,
    name: "Redfish Scalable Platforms Management API Specification (DSP0266)",
    publisher: "DMTF",
    url: "https://www.dmtf.org/standards/redfish",
    date: "v1.24.0, Apr 2026",
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
    name: "SP 800-53 Rev. 5 — Security and Privacy Controls (PE control family)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final",
    date: "Sep 2020, upd. 2025",
  },
  {
    n: 11,
    name: "Global Data Center Survey 2025 (800+ operator respondents)",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "What is data center commissioning?",
    a: "Commissioning is the structured process of verifying that installed power, cooling, network, controls, and life-safety systems perform together as designed, under load, before workloads are admitted. It runs from design-intent review through factory testing, installation checks, functional testing of each system, integrated failure-mode testing, and a documented site acceptance test at handover.",
  },
  {
    q: "Does factory testing replace site commissioning?",
    a: "No. A factory acceptance test proves the unit against itself on factory utilities. It cannot prove the site interface: the actual service and protection settings, the real grounding electrode system, ambient conditions at the pad, the carrier circuit, or how the unit behaves when site power fails. Factory testing shortens the site script; it does not remove it.",
  },
  {
    q: "Who signs off on commissioning?",
    a: "Typically five parties, each on a different scope: the manufacturer or installing contractor certifies its own systems, an independent commissioning authority owns the plan and the issues log, the authority having jurisdiction accepts code-regulated work through inspection, the serving utility accepts the interconnection, and the owner or operations lead signs the site acceptance test that starts warranty and transfers operational responsibility.",
  },
  {
    q: "How long does commissioning take for a modular unit?",
    a: "It depends on how much of the script the factory already retired and how many parties must witness it. The site scope for a factory-tested unit is narrower than for a field-built plant — the interfaces rather than the whole build — but integrated systems testing, witnessed failure-mode exercises, and AHJ inspections still occupy calendar time that no amount of factory work removes.",
  },
];

const linkStyle: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

const LEVELS: [string, string, string, string][] = [
  [
    "CX-01",
    "Design intent & plan",
    "The commissioning plan is written against the design basis: which systems are commissioned, the test scripts, pass/fail criteria, witness requirements, and the issues-log procedure.",
    "Commissioning authority, with owner sign-on",
  ],
  [
    "CX-02",
    "Factory acceptance test",
    "The unit is exercised on factory utilities: power-up, cooling loop run, control sequences, and load-bank operation against the manufacturer’s test procedure.",
    "Manufacturer, witnessed by owner or CxA",
  ],
  [
    "CX-03",
    "Installation & pre-functional checks",
    "Static verification after placement: anchoring, grounding electrode connection, conductor terminations and torque, loop fill and pressure test, cable certification, labeling, as-built markup.",
    "Installing contractors; CxA verifies",
  ],
  [
    "CX-04",
    "Functional performance testing",
    "Each system proven alone against its script — protection settings, transfer operations, pumps and heat rejection, alarm points, detection and suppression devices.",
    "System vendors; CxA scripts and records",
  ],
  [
    "CX-05",
    "Integrated systems testing",
    "All systems run together under load while faults are deliberately introduced: loss of a power path, loss of heat rejection, loss of controls, loss of network.",
    "CxA, all vendors present",
  ],
  [
    "CX-06",
    "Site acceptance & handover",
    "Documented acceptance test, closed issues log, as-builts, O&M manuals, operator training, spares and warranty start. Operational responsibility transfers.",
    "Owner / operations lead",
  ],
];

const SIGNATORIES: [string, string, string][] = [
  [
    "Manufacturer / installing contractor",
    "Its own equipment and installation",
    "Factory test report, pre-functional checklists, torque and insulation records",
  ],
  [
    "Commissioning authority (independent)",
    "The plan, the scripts, and the issues log",
    "Functional and integrated test records with measured results, all issues closed or accepted",
  ],
  [
    "Authority having jurisdiction",
    "Code-regulated work: electrical, fire, structural",
    "Inspection records, including in-plant and on-site inspection for off-site-built work",
  ],
  [
    "Serving utility",
    "The interconnection and metering",
    "Witnessed protection settings, relay coordination, permission to operate",
  ],
  [
    "Owner / operations lead",
    "The site acceptance test and transfer of responsibility",
    "Complete handover package, training completed, spares on site, warranty start dated",
  ],
];

/* Handover package — the checklist, one line per card, verbatim. */
const HANDOVER: { code: string; title: string; body: string }[] = [
  {
    code: "01",
    title: "Test scripts and results",
    body: "Commissioning plan and every completed test script, with measured results and the date and name of each witness.",
  },
  {
    code: "02",
    title: "Issues log",
    body: "Issues log, fully dispositioned — each item closed, waived with a written reason, or carried with an owner and a due date.",
  },
  {
    code: "03",
    title: "As-built drawings",
    body: "As-built drawings: single-line, grounding, piping and instrumentation, cable schedule, control points list.",
  },
  {
    code: "04",
    title: "Setpoints and sequences",
    body: "Setpoints and sequences of operation as commissioned, not as designed, with the delta explained.",
  },
  {
    code: "05",
    title: "Measured baselines",
    body: "Measured baselines from integrated testing: transfer times, thermal drift rates, restart duration, link loss budgets.",
  },
  {
    code: "06",
    title: "Manuals and chemistry",
    body: "Operations and maintenance manuals, recommended maintenance intervals, and coolant chemistry limits and sampling procedure.",
  },
  {
    code: "07",
    title: "Training, spares, warranty",
    body: "Operator training records, spares inventory delivered on site, and warranty start dates per subsystem.",
  },
];

const railLink: CSSProperties = { ...linkStyle, fontSize: "0.9rem", textDecoration: "none" };

export default function CommissioningPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Data center commissioning: the plan, the tests, and the sign-offs"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — editorial. No product shot: this page's stage image is
             already placed on /deploy, and one image serves one placement. */}
      <HeroEditorial
        category="Deploy · DP-05 · Deployment stage 05 of 6"
        title="Commissioning: proving the unit"
        accent="before load"
        lede="A data center commissioning plan is a written test program that proves electrical, thermal, network, controls, and life-safety systems perform together under load before any workload is admitted — and it names, for every test, the criterion that counts as a pass and the party who signs it. This page covers what belongs in that plan, the six levels it runs through, and who accepts the unit at handover."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Deploy", path: "/deploy" },
              { name: "Commissioning", path: PATH },
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
          { value: "06", label: "Commissioning levels" },
          { value: "05", label: "Parties that sign different scopes" },
          { value: "07", label: "Handover package deliverables" },
        ]}
      />

      {/* 2 · WHAT THIS STAGE DELIVERS — canvas */}
      <SummaryBand
        title="What this stage delivers"
        items={[
          {
            code: "01",
            title: "Proof under load, not presence",
            body: "Installation proves equipment is present and connected. Commissioning proves it works together, under load, and when something fails.",
          },
          {
            code: "02",
            title: "Six levels, six owners",
            body: "From design-intent review to site acceptance, each rung has a different owner, a different location, and a different exit criterion.",
          },
          {
            code: "03",
            title: "Five signatures",
            body: "Manufacturer, commissioning authority, authority having jurisdiction, serving utility, and owner each accept a different scope.",
          },
          {
            code: "04",
            title: "A handover package",
            body: "Test records, a dispositioned issues log, as-builts, as-commissioned setpoints, measured baselines, manuals, training, and spares.",
          },
        ]}
      />

      {/* 3 · STAGE STRIP — the six deploy stages, this one emphasised */}
      <CardGrid
        id="sequence"
        eyebrow="Deployment sequence"
        title="Stage five of six"
        lede="Commissioning begins where transport and placement ends and closes when the handover package transfers the unit into operations."
        surface="paper"
        field="deploy"
        columns={3}
        items={[
          {
            code: "DP-01",
            title: "Site & power readiness",
            body: (
              <>
                Confirm power, permits, ground, access, network.{" "}
                <Link href="/deploy/site-power-readiness" style={linkStyle}>
                  Stage 01
                </Link>
              </>
            ),
          },
          {
            code: "DP-02",
            title: "Configuration engineering",
            body: (
              <>
                Fix the build specification from a bounded menu.{" "}
                <Link href="/deploy/configuration-engineering" style={linkStyle}>
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
                Assembly, integration, burn-in on the line.{" "}
                <Link href="/deploy/factory-build-testing" style={linkStyle}>
                  Stage 03
                </Link>
              </>
            ),
          },
          {
            code: "DP-04",
            title: "Transport & placement",
            body: (
              <>
                Ship as heavy freight, rig, set, connect.{" "}
                <Link href="/deploy/transport-placement" style={linkStyle}>
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
                <strong style={{ color: "var(--brand-deep)" }}>You are here.</strong> Energize,
                verify, load-test on site power before any workload is admitted.
              </>
            ),
          },
          {
            code: "DP-06",
            title: "Operations & maintenance",
            body: (
              <>
                Monitor, maintain, grow unit by unit.{" "}
                <Link href="/deploy/operations-maintenance" style={linkStyle}>
                  Stage 06
                </Link>
              </>
            ),
          },
        ]}
      />

      {/* 4 · THE LADDER — wide matrix, canvas */}
      <MatrixTable
        id="levels"
        eyebrow="The ladder"
        title="The six levels of a commissioning plan"
        lede="A commissioning plan is not one test. It is a ladder, and each rung has a different owner, a different location, and a different exit criterion. For a factory-built unit the first two rungs happen before the unit ever reaches the site."
        surface="canvas"
        field="deploy"
        head={["Level", "Stage", "What is tested", "Who owns it"]}
        rows={LEVELS.map(([code, name, what, owner]) => [
          <span key={code} className="pill">
            {code}
          </span>,
          name,
          what,
          owner,
        ])}
      />

      {/* 5 · THE BODY — the only long-prose container, with a nav rail */}
      <ProseWithRail
        id="what-it-proves"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {[
                ["#sequence", "The six stages"],
                ["#levels", "The six levels"],
                ["#electrical", "Electrical acceptance"],
                ["#thermal", "Thermal and cooling"],
                ["#network-controls", "Network and controls"],
                ["#integrated", "Integrated systems test"],
                ["#sign-off", "Who signs off"],
                ["#handover", "Handover package"],
                ["#limitations", "Honest limits"],
                ["#podos", "For a factory-built unit"],
                ["#faq", "Questions"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={railLink}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <SectionHead eyebrow="The point of the stage" title="What commissioning actually proves" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Installation proves that equipment is present and connected. Commissioning proves that it
            works — together, under load, and when something fails. The distinction is the whole point
            of the stage. Every subsystem can pass its own vendor checkout and the integrated machine
            can still fail on the interfaces between them: a transfer that works electrically but
            drops the cooling pumps long enough to trip a thermal limit, an alarm that reaches the
            controls system but never reaches a human, a fiber pair that lights but fails its loss
            budget at temperature.
          </p>
          <p>
            The operational record justifies the rigor. In the Uptime Institute&rsquo;s 2025 survey of
            more than 800 operators, about half reported an outage with meaningful impact in the
            previous three years<Cite n={11} /> — and the failure modes that commissioning exercises
            deliberately, chiefly power-path and cooling-continuity events, are the ones that recur.
            Commissioning is the last point at which those exercises are cheap: a failure discovered
            during integrated testing costs a schedule day, and the same failure discovered in service
            costs an outage.
          </p>
        </div>

        <h3 className="h3" id="electrical" style={{ marginTop: "2.75rem", scrollMarginTop: 96 }}>
          Electrical acceptance
        </h3>
        <div style={{ marginTop: "1rem" }}>
          <p>
            Electrical commissioning starts static and ends dynamic. The static half verifies what
            cannot be measured once the system is live: grounding and bonding continuity, insulation
            resistance, conductor terminations and torque values, phase rotation, and
            protective-device settings against the coordination study. The dynamic half energizes in
            stages and then loads the unit — normally with load banks, so the test is repeatable and
            no production hardware is at risk — while measuring what the design promised. Reliability
            analysis of critical-facility distribution follows established practice such as the IEEE
            3006 series.<Cite n={2} />
          </p>
          <p>
            Two measurement standards matter at this point because AI loads are electrically unusual.
            Power quality should be recorded with defined methods and aggregation intervals rather
            than a handheld spot reading — IEC 61000-4-30 specifies those methods<Cite n={3} /> — and
            harmonic distortion from large rectifier loads is assessed against the limits IEEE 519
            sets at the point of common coupling.<Cite n={4} /> Step loading matters as much as steady
            state: GPU clusters swing power hard between idle and full synchronous training load, so
            the test script should ramp and dump load, not only hold it. How medium-voltage input
            becomes rack power is covered in the{" "}
            <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
              power-architecture explainer
            </Link>
            .
          </p>
        </div>

        <h3 className="h3" id="thermal" style={{ marginTop: "2.75rem", scrollMarginTop: 96 }}>
          Thermal and cooling acceptance
        </h3>
        <div style={{ marginTop: "1rem" }}>
          <p>
            A liquid-cooled unit adds tests an air-cooled room never needed. The loop is flushed and
            filled to a documented chemistry, pressure-tested and held, then flow-balanced across
            every branch — federal-lab guidance treats fill, flush, and flow verification as core
            practice for direct-to-chip loops.<Cite n={6} /> Leak detection is proven by simulating a
            leak, not by confirming the sensor is installed. Supply temperature control is verified
            against the environmental envelope the IT equipment is specified for; ASHRAE&rsquo;s
            thermal guidelines define the classes that verification is written against.<Cite n={5} />
          </p>
          <p>
            The load test then answers the only question that matters: at design ambient and full
            electrical load, does the unit hold its thermal setpoints with margin, and how fast does
            it drift when heat rejection is interrupted? That ride-through number — minutes to a
            thermal trip with rejection lost — belongs in the handover package, because operations
            will plan maintenance windows around it. The loop architecture being verified is described
            in{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
              direct-to-chip liquid cooling
            </Link>
            .
          </p>
        </div>

        <h3
          className="h3"
          id="network-controls"
          style={{ marginTop: "2.75rem", scrollMarginTop: 96 }}
        >
          Network and controls acceptance
        </h3>
        <div style={{ marginTop: "1rem" }}>
          <p>
            Network commissioning is mostly certification and documentation. Structured cabling,
            pathways, and cross-connects are built and tested against the data-center cabling
            standard<Cite n={7} />; every fiber pair is certified for loss against the reach class of
            the optics it will carry; the demarcation to the carrier or campus fabric is proven end to
            end rather than assumed. The internal fabric choices this verifies are covered in{" "}
            <Link href="/engineering/networking-fiber" style={linkStyle}>
              networking and fiber
            </Link>
            .
          </p>
          <p>
            Controls acceptance is where commissioning most often gets shortened and should not be.
            Every monitored point is proven end to end — sensor to controller to dashboard to alarm
            destination — by forcing the condition and confirming the notification arrives at a
            person. Out-of-band machine telemetry is verified through a vendor-neutral interface such
            as Redfish so the operator is not locked into one vendor&rsquo;s agent<Cite n={8} />;
            setpoints, sequences of operation, and trending intervals are recorded as-commissioned.
            Life safety is tested to its own codes: detection and notification devices are
            acceptance-tested and documented under NFPA 72<Cite n={9} />, emergency power off is
            proven to actually de-energize what it claims, and physical access controls, monitoring,
            and visitor records are verified against the physical and environmental protection
            controls in NIST SP 800-53.<Cite n={10} /> See{" "}
            <Link href="/engineering/monitoring-controls" style={linkStyle}>
              monitoring and controls
            </Link>{" "}
            and{" "}
            <Link href="/engineering/safety-security" style={linkStyle}>
              safety and security
            </Link>{" "}
            for the systems themselves.
          </p>
        </div>

        <h3 className="h3" id="integrated" style={{ marginTop: "2.75rem", scrollMarginTop: 96 }}>
          Integrated systems testing: the rung most often skipped
        </h3>
        <div style={{ marginTop: "1rem" }}>
          <p>
            Level CX-05 is the difference between a commissioned unit and a checked-out one. With the
            unit under representative load and every vendor present, faults are introduced on purpose
            and the response is timed and recorded. A minimum script covers: loss of the primary power
            path; loss of a cooling pump and then loss of heat rejection entirely; loss of the controls
            network; loss of the upstream data link; and an emergency power off followed by a full
            restart to a serving state. Each exercise produces a measured number — transfer time,
            temperature slope, restart duration — not a checkbox.
          </p>
          <p>
            These numbers become the operational baseline. Without them, the first real fault is also
            the first measurement, and nobody can tell degraded behavior from normal behavior.
          </p>
        </div>

        <h3 className="h3" style={{ marginTop: "2.75rem" }}>
          Who accepts the unit
        </h3>
        <div style={{ marginTop: "1rem" }}>
          <p>
            Commissioning is not accepted by one signature. Five parties typically sign different
            scopes, and confusion about which signature closes which scope is a common cause of
            handover delay. Off-site construction adds a wrinkle worth planning for: the ICC/MBI
            off-site construction standard sets out in-plant inspection, third-party inspection, and
            on-site final inspection roles precisely because work completed in a factory is not
            inspected the way field-built work is.<Cite n={1} />
          </p>
        </div>
      </ProseWithRail>

      {/* 6 · SIGN-OFF MATRIX — canvas */}
      <MatrixTable
        id="sign-off"
        eyebrow="Acceptance"
        title="Who signs off, and on what"
        surface="canvas"
        field="deploy"
        head={["Signatory", "Accepts", "Evidence they sign against"]}
        rows={SIGNATORIES.map(([who, what, evidence]) => [
          <span key={who} style={{ color: "var(--ink-strong)", fontWeight: 500 }}>
            {who}
          </span>,
          what,
          evidence,
        ])}
      />

      {/* 7 · INK BEAT */}
      <QuoteMetric
        quote="A failure found during integrated testing costs a schedule day. The same failure found in service costs an outage."
        attribution="Level CX-05 — integrated systems testing"
        metric="CX-05"
        label="The rung most often skipped"
        field="deploy"
      />

      {/* 8 · DELIVERABLES — what the customer receives, paper */}
      <CardGrid
        id="handover"
        eyebrow="Deliverables"
        title="The handover package"
        lede="What transfers to the owner at CX-06 — the evidence that the tests happened, and the measured baselines operations will run against."
        surface="paper"
        field="deploy"
        columns={4}
        items={HANDOVER}
      />

      {/* 9 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="When this depth of commissioning is not the right fit"
        eyebrow="Honest limits"
        lede="A full independent commissioning program costs calendar time and money, and it is not proportionate to every deployment. It is worth being direct about where it is not."
        items={[
          "Small, non-critical, or research installations. A single unit running interruptible batch work with no redundancy to prove and no code-regulated systems beyond the basics does not need a five-party witnessed program; a documented vendor checkout plus a load test may be defensible. Say so in writing rather than quietly skipping steps.",
          "Sites where the schedule pressure is real and the risk is genuinely low. Compressing the script is a decision with consequences — make it explicitly, record what was not tested, and put those items on the operations risk register.",
          "Commissioning is a point-in-time proof, not a durability claim. It measures behavior on the day, at that ambient. Summer-peak performance, seasonal heat-rejection margin, and long-run coolant chemistry are only knowable through operation and periodic retesting.",
          "It does not validate workloads. A commissioned unit is proven to deliver power, cooling, network, and control. Model throughput, cluster efficiency, and job-level behavior are a separate exercise with separate acceptance criteria.",
          "Recommissioning is not optional after change. Firmware updates, setpoint changes, hardware refreshes, and capacity additions invalidate parts of the original evidence; a change that touches a tested sequence should retest that sequence.",
        ]}
      />

      {/* 10 · IN THE PRODUCT — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead
          eyebrow="In the product"
          title="How commissioning works for a factory-built unit"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The modular model changes where commissioning happens, not whether it happens. Each{" "}
            <Link href="/platform/podos-pod" style={linkStyle}>
              PODOS Pod
            </Link>{" "}
            is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so levels CX-02 and
            much of CX-03 are retired inside the factory against a repeatable test procedure, on the
            same configuration every time. What remains on site is the interface set: the service
            connection and protection settings, the grounding electrode system, heat rejection at the
            real ambient, the carrier handoff, and the integrated failure-mode script that only the
            assembled site can prove. That front-loading is one reason PODOS{" "}
            <span data-claim="deployment-window">
              targets a 90-day window from order to commissioning
            </span>{" "}
            for a standard unit — a target, not a guarantee, and the site-side items above still own
            their calendar.
          </p>
          <p>
            The site-side prerequisites that make this package achievable on schedule are listed in
            the{" "}
            <Link href="/resources/data-center-readiness-checklist" style={linkStyle}>
              data center readiness checklist
            </Link>
            .
          </p>
          <p>
            Commissioning is stage five of six in the{" "}
            <Link href="/deploy" style={linkStyle}>
              deployment sequence
            </Link>
            . It begins where{" "}
            <Link href="/deploy/transport-placement" style={linkStyle}>
              transport and placement
            </Link>{" "}
            ends and closes when the handover package transfers the unit into{" "}
            <Link href="/deploy/operations-maintenance" style={linkStyle}>
              operations and maintenance
            </Link>
            . How the factory-versus-field split changes the inspection path is discussed in{" "}
            <Link href="/compare/factory-built-vs-site-built-data-center" style={linkStyle}>
              factory-built vs site-built
            </Link>
            , and unfamiliar terms are defined in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
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

      {/* 13 · RELATED — the stage chain, previous and next */}
      <RelatedRail
        title="Continue the deployment sequence"
        surface="canvas"
        items={[
          {
            href: "/deploy/transport-placement",
            label: "PREVIOUS · DP-04",
            title: "Transport and placement",
          },
          {
            href: "/deploy/operations-maintenance",
            label: "NEXT · DP-06",
            title: "Operations and maintenance",
          },
          {
            href: "/compare/factory-built-vs-site-built-data-center",
            label: "COMPARE",
            title: "Factory-built vs site-built",
          },
          {
            href: "/resources/data-center-readiness-checklist",
            label: "RESOURCE",
            title: "Data center readiness checklist",
          },
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Write the commissioning script"
        accent="before the unit ships"
        body="Bring your site, your acceptance criteria, and your witness list. Engineering will map which levels the factory retires and which stay on your calendar."
        primary={{ href: "/estimate", label: "Size your deployment" }}
        secondary={{ href: "/deploy", label: "Deployment sequence" }}
        field="deploy"
      />
    </main>
  );
}
