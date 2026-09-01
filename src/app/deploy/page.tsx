/**
 * /deploy — deployment cluster HUB, composed from the SEO section library.
 * See docs/design/PAGE_ARCHETYPES.md and SEO_PAGE_DESIGN_SYSTEM.md.
 *
 * Server component, zero client JS. This hub is the parent of the six
 * per-stage guides under /deploy/* — every one of them is linked here
 * (card grid, stage table, prose rail, CTA), because a hub that does not
 * link its children leaves them orphaned.
 *
 * Claims discipline: only publishable ids from src/content/data/claims.ts
 * render, each wrapped in data-claim (or passed as a MetricRail `claim`)
 * with its required qualifier.
 */

import type { CSSProperties } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import { FAQJsonLd, TechArticleJsonLd } from "@/components/seo/jsonld";
import LastVerified from "@/components/seo/LastVerified";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  HeroSplit,
  SummaryBand,
  CardGrid,
  MatrixTable,
  ProseWithRail,
  SplitFeature,
  QuoteMetric,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/deploy";
const TITLE = "Modular AI Data Center Deployment: The Six Stages | PODOS AI";
const DESCRIPTION =
  "How a factory-built modular AI data center is deployed: six stages from site and power readiness to operations, and the 90-day target window explained.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

/* ---------------------------------------------------------------- data */

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Data centre electricity use surged in 2025, even with tightening bottlenecks driving a scramble for solutions",
    publisher: "IEA",
    url: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions",
    date: "2025",
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
    name: "NFPA 70 — National Electrical Code (NEC)",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "current edition",
  },
  {
    n: 4,
    name: "NFPA 855 — Standard for the Installation of Stationary Energy Storage Systems",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "current edition",
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
    name: "IEEE 3006 series — Power Systems Reliability for Industrial and Commercial Facilities",
    publisher: "IEEE",
    url: "https://standards.ieee.org/ieee/3006.1/7391/",
    date: "2013–2018",
  },
  {
    n: 7,
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
];

/** The six stages — and the six child guides this hub is the parent of. */
const STAGES: {
  code: string;
  name: string;
  focus: string;
  owner: string;
  exit: string;
  href: string;
}[] = [
  {
    code: "DP-01",
    name: "Site & power readiness",
    focus: "Confirm power, permits, ground, access, network",
    owner: "Owner / operator + utility",
    exit: "Power path and permit scope confirmed",
    href: "/deploy/site-power-readiness",
  },
  {
    code: "DP-02",
    name: "Configuration",
    focus: "Fix the build specification from a bounded menu",
    owner: "Owner + PODOS",
    exit: "Configuration freeze signed",
    href: "/deploy/configuration-engineering",
  },
  {
    code: "DP-03",
    name: "Factory build & testing",
    focus: "Assembly, integration, burn-in on the line",
    owner: "PODOS factory",
    exit: "Factory acceptance test passed",
    href: "/deploy/factory-build-testing",
  },
  {
    code: "DP-04",
    name: "Transport & placement",
    focus: "Ship as heavy freight, rig, set, connect",
    owner: "Logistics + site crew",
    exit: "Unit set and mechanically connected",
    href: "/deploy/transport-placement",
  },
  {
    code: "DP-05",
    name: "Commissioning",
    focus: "Energize, verify, load-test on site power",
    owner: "Commissioning team",
    exit: "Site acceptance test passed",
    href: "/deploy/commissioning",
  },
  {
    code: "DP-06",
    name: "Operations",
    focus: "Monitor, maintain, grow unit by unit",
    owner: "Operator",
    exit: "Ongoing",
    href: "/deploy/operations-maintenance",
  },
];

/* FAQ — the visible answers and the JSON-LD payload share these strings. */
const FAQ_1_CLAIM =
  "PODOS targets a 90-day window from order to commissioning for a standard unit.";
const FAQ_1_REST =
  "The target assumes a ready site; in practice the calendar is set by site power availability, permitting, and transport, so the honest answer for a specific project starts with a site and power assessment.";
const FAQ = [
  {
    q: "How long does it take to deploy a modular AI data center?",
    a: `${FAQ_1_CLAIM} ${FAQ_1_REST}`,
  },
  {
    q: "What does a site need before a unit arrives?",
    a: "Megawatt-class power available or contracted, applicable permits, a level load-rated surface, heavy-freight access to the placement point, and a network path. Power is the item to resolve first — it determines whether the rest of the schedule is real.",
  },
  {
    q: "Do the six stages happen strictly in sequence?",
    a: "No. Site and power readiness and configuration come first, but factory build and site preparation run in parallel, and that overlap is what compresses the calendar. Commissioning and operations are sequential by nature — a unit is proven before it carries workloads.",
  },
];

const link: CSSProperties = {
  color: "var(--brand-deep)",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  textDecorationColor: "rgba(37, 99, 235, 0.35)",
};

const strong: CSSProperties = { color: "var(--ink-strong)", fontWeight: 600 };

/* ----------------------------------------------------------------- page */

export default function DeployPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="How a modular AI data center gets deployed: the six stages"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — ink, text left, prepared pad right */}
      <HeroSplit
        code="DEP-01"
        cluster="Deployment"
        title="How a modular AI data center gets"
        accent="deployed"
        lede="Deploying a factory-built modular AI data center is a six-stage process: site and power readiness, configuration, factory build and testing, transport and placement, commissioning, and operations. The stages overlap — the unit is built and tested in a factory while the site is prepared in parallel."
        imageId="deploy-pad-prep"
        field="deploy"
        metrics={[
          { value: "6", label: "Stages, two run in parallel" },
          {
            value: "90 days",
            label: "Target, order to commissioning",
            claim: "deployment-window",
          },
          { value: "1 MW", label: "Per standardized unit", claim: "unit-capacity-1mw" },
        ]}
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Deploy", path: PATH },
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
      />

      {/* 2 · TAKEAWAYS — canvas */}
      <SummaryBand
        title="What the six stages actually decide"
        items={[
          {
            code: "01",
            title: "Two stages run at the same time",
            body: "Site and power readiness and configuration come first, but factory build and site preparation run in parallel, and that overlap is what compresses the calendar.",
          },
          {
            code: "02",
            title: "Power owns the real calendar",
            body: "Site power availability dominates the real calendar and sits outside any vendor's control. A site without a power path has an indeterminate timeline regardless of how fast the unit is built.",
          },
          {
            code: "03",
            title: "90 days is a design target",
            body: (
              <>
                <span data-claim="deployment-window">
                  PODOS targets a 90-day window from order to commissioning for a standard unit
                </span>{" "}
                — a design goal for a ready site, not a measured deployment statistic.
              </>
            ),
          },
          {
            code: "04",
            title: "Growth is additive",
            body: "Capacity scales by repeating the same six stages for the next unit instead of re-entering a construction program.",
          },
        ]}
      />

      {/* 3 · THE SIX CHILD GUIDES — paper. Every stage links to its own page. */}
      <CardGrid
        id="stages"
        eyebrow="Stage guides"
        title="Six stages, six detailed guides"
        lede="This page is the overview. Each stage has its own guide covering what happens inside it, who owns it, and the criterion that has to be met before the next stage starts."
        surface="paper"
        field="deploy"
        columns={3}
        items={STAGES.map((s) => ({
          code: s.code,
          title: s.name,
          body: (
            <>
              {s.focus}. Exit criterion: {s.exit.toLowerCase()}.{" "}
              <Link href={s.href} style={link}>
                Read the {s.name.toLowerCase()} guide
              </Link>
              .
            </>
          ),
        }))}
      />

      {/* 4 · STAGE INDEX — canvas, wide table */}
      <MatrixTable
        id="at-a-glance"
        eyebrow="Stage index"
        title="The six stages at a glance"
        lede="Who owns each stage, and what has to be true before it closes."
        surface="canvas"
        head={["Code", "Stage", "What happens", "Primary owner", "Exit criterion"]}
        rows={STAGES.map((s) => [
          <span key={`${s.code}-c`} className="pill">
            {s.code}
          </span>,
          <Link key={`${s.code}-n`} href={s.href} style={link}>
            {s.name}
          </Link>,
          s.focus,
          s.owner,
          s.exit,
        ])}
      />

      {/* 5 · DP-01 + DP-02 — paper prose, stage-guide rail */}
      <ProseWithRail
        id="before-the-factory"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">Stage guides</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.7rem" }}>
              {STAGES.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    style={{ ...link, fontSize: "0.9rem", textDecoration: "none" }}
                  >
                    <span className="pill">{s.code}</span> {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <SectionHead
          eyebrow="DP-01 · DP-02"
          title="Before the factory starts: readiness, then a frozen specification"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            This page is the overview: what each stage covers, who owns it, what must be true
            before the next stage starts, and where the schedule risk actually lives. Each{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is{" "}
            <span data-claim="unit-capacity-1mw">
              designed as a standardized 1-MW building block
            </span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so the process
            repeats per unit rather than being re-engineered per project.
          </p>

          <h3 className="h3" style={{ marginTop: "2.5rem" }}>
            DP-01 · Site &amp; power readiness
          </h3>
          <p style={{ marginTop: "1rem" }}>
            Everything starts with power. A modular unit removes construction from the critical
            path, but it cannot manufacture electrons: the site needs megawatt-class power
            available, or a credible path to it, before anything else matters. The IEA reports that
            data-centre electricity use surged in 2025 while grid-connection bottlenecks tightened
            <Cite n={1} />, and Lawrence Berkeley National Laboratory estimates US data centers
            consumed 4.4% of US electricity in 2023, projected to reach 6.7–12% by 2028
            <Cite n={2} />. Competition for grid capacity is structural, not cyclical — which is why
            this stage comes first and owns the real calendar.
          </p>
          <p>
            Readiness means answering a short list of questions honestly before an order is placed:
          </p>
          <ul className="limits" style={{ marginTop: "1.5rem" }}>
            <li>
              <strong style={strong}>Power.</strong> Is megawatt-class capacity available at the
              site today — an existing service, an on-site source, or an executed interconnection
              agreement? The{" "}
              <Link href="/engineering/data-center-power-architecture" style={link}>
                power-architecture explainer
              </Link>{" "}
              covers how medium-voltage input becomes rack power.
            </li>
            <li>
              <strong style={strong}>Permits.</strong> What does the local jurisdiction require for
              a placed, factory-built unit — electrical work under the National Electrical Code
              (NFPA 70)
              <Cite n={3} />, and stationary energy-storage rules under NFPA 855 if batteries are in
              scope
              <Cite n={4} />?
            </li>
            <li>
              <strong style={strong}>Ground.</strong> Is there a level, load-rated surface — pad or
              engineered foundation — with drainage?
            </li>
            <li>
              <strong style={strong}>Access.</strong> Can heavy road freight reach the placement
              point: turning radii, overhead clearance, crane or rigging position?
            </li>
            <li>
              <strong style={strong}>Network.</strong> Is there a data path — fiber or wireless
              backhaul — matched to the intended workloads?
            </li>
          </ul>
          <p style={{ marginTop: "1.5rem" }}>
            The full assessment, including the conditions that disqualify a site early, is in the{" "}
            <Link href="/deploy/site-power-readiness" style={link}>
              site and power readiness guide
            </Link>
            .
          </p>

          <h3 className="h3" style={{ marginTop: "2.5rem" }}>
            DP-02 · Configuration
          </h3>
          <p style={{ marginTop: "1rem" }}>
            Configuration fixes the build specification before the factory starts. Because the unit
            is standardized, this is a bounded menu rather than a design project: the GPU platform
            installed at integration, the electrical service arrangement at the site boundary, the
            heat-rejection option, the network handoff, and the operating model — who monitors and
            who maintains. The output is a configuration freeze: a signed specification the factory
            builds against and the reference every later acceptance test uses. What is deliberately
            not on the menu is the core architecture — enclosure, cooling loop, power distribution —
            which stays identical across units. The{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod page
            </Link>{" "}
            describes what is inside that fixed architecture, and the{" "}
            <Link href="/deploy/configuration-engineering" style={link}>
              configuration engineering guide
            </Link>{" "}
            walks the menu decision by decision.
          </p>
        </div>
      </ProseWithRail>

      {/* 6 · DP-03 + DP-04 — canvas split, the crane set */}
      <SplitFeature
        imageId="deploy-crane-lift"
        eyebrow="DP-03 · DP-04"
        title="Built and tested on a line, then"
        accent="rigged onto the pad"
        surface="canvas"
        field="deploy"
        flip
      >
        <p>
          The factory stage is where the modular model earns its schedule. Structure, power
          distribution, the closed-loop{" "}
          <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
            direct-to-chip liquid-cooling
          </Link>{" "}
          circuit, racks, and networking are assembled and integrated on a production line instead
          of being sequenced as separate trades on a construction site. Integration testing happens
          before shipment: point-to-point electrical verification, pressure and flow testing of the
          coolant loop, controls and safety interlocks exercised end to end, and burn-in of
          installed IT under load. The exit gate is a factory acceptance test against the
          configuration freeze —{" "}
          <Link href="/deploy/factory-build-testing" style={link}>
            the factory build and testing guide
          </Link>{" "}
          covers the hold points and handover documents.
        </p>
        <p>
          Factory testing has a real limit, and the commissioning stage exists to close it: it
          validates the unit against factory power and factory conditions — not against your
          utility, your grounding system, or your climate.
        </p>
        <p>
          While the factory builds, the site is prepared: pad, conduit runs, service connections.
          This parallelism is the schedule mechanism — the two longest workstreams run at the same
          time instead of one after the other. The finished unit then ships as heavy road freight,
          is rigged onto the prepared surface, and is connected mechanically: power terminations,
          heat-rejection connections, network.
        </p>
        <p>
          Placement is measured in days rather than months because nothing is being constructed on
          site — the unit arrives as a tested machine, and site work is limited to connections. The
          units are designed to be relocatable, so a later move follows the same steps in reverse.
          Route survey, freight envelope, permits, and the rigging sequence are detailed in the{" "}
          <Link href="/deploy/transport-placement" style={link}>
            transport and placement guide
          </Link>
          .
        </p>
      </SplitFeature>

      {/* 7 · DP-05 + DP-06 — paper split, systems check on site power */}
      <SplitFeature
        imageId="deploy-commission-check"
        eyebrow="DP-05 · DP-06"
        title="Proven on site power, then"
        accent="operated for years"
        surface="paper"
      >
        <p>
          Commissioning proves the unit on real site power under real load. The sequence is
          conventional critical-facility practice applied to a factory-tested machine: staged
          energization with protection and grounding verification, cooling-loop verification against
          the thermal envelopes the IT equipment is specified for — ASHRAE&rsquo;s thermal
          guidelines define the environmental classes commissioning verifies against
          <Cite n={5} /> — then integrated load testing and deliberate failure-mode exercises (loss
          of a power path, loss of heat rejection) before workloads are admitted. Reliability
          analysis of the site&rsquo;s electrical distribution follows established practice such as
          the IEEE 3006 series
          <Cite n={6} />.
        </p>
        <p>
          The discipline matters. In Uptime Institute&rsquo;s 2025 global survey, roughly half of
          operators reported an outage with meaningful impact within the previous three years
          <Cite n={7} />. A factory-tested unit shortens commissioning; it does not replace it. The
          exit gate is a site acceptance test, after which the unit enters operations — the tests
          and sign-offs are enumerated in the{" "}
          <Link href="/deploy/commissioning" style={link}>
            commissioning guide
          </Link>
          .
        </p>
        <p>
          Operations is the longest stage and the least discussed. It covers monitoring — power,
          thermals, coolant-loop health, IT telemetry — plus preventive maintenance on pumps,
          filtration, and heat-rejection equipment, a spares strategy, and physical security.
          Industry rack densities keep rising: Uptime Institute&rsquo;s 2025 survey reports typical
          densities moving into the 10–30 kW band
          <Cite n={7} />, which is why the liquid loop is maintained as a first-class system rather
          than an afterthought. The{" "}
          <Link href="/deploy/operations-maintenance" style={link}>
            operations and maintenance guide
          </Link>{" "}
          covers service access, spares, and lifecycle planning.
        </p>
        <p>
          Growth is additive. Because each unit is{" "}
          <span data-claim="unit-capacity-1mw">
            designed as a standardized 1-MW building block
          </span>
          , capacity scales by repeating the same six stages for the next unit instead of
          re-entering a construction program. Which organizations this model fits is covered in the{" "}
          <Link href="/use-cases" style={link}>
            use-cases overview
          </Link>
          ; how it differs from a conventional build is covered in the{" "}
          <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={link}>
            modular-vs-traditional comparison
          </Link>
          .
        </p>
      </SplitFeature>

      {/* 8 · INK BEAT — the target, stated honestly */}
      <QuoteMetric
        quote="The target is arithmetic, not optimism: the factory stage and site preparation run concurrently, transport and placement are measured in days, and commissioning verifies a machine that has already passed a factory acceptance test."
        attribution="Design goal for a standard unit on a ready site — not a measured deployment statistic"
        metric="90 days"
        label="Order to commissioning"
        claim="deployment-window"
        field="deploy"
      />

      {/* 9 · THE TARGET — paper prose */}
      <ProseWithRail id="target" surface="paper">
        <SectionHead
          eyebrow="Schedule"
          title="Where the 90-day target comes from"
          lede="Three dependencies sit outside the target, and the largest of them is not a vendor decision."
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            <span data-claim="deployment-window">
              PODOS targets a 90-day window from order to commissioning for a standard unit.
            </span>{" "}
            The target is arithmetic, not optimism: the factory stage and site preparation run
            concurrently, transport and placement are measured in days, and commissioning verifies a
            machine that has already passed a factory acceptance test rather than debugging a
            first-of-a-kind assembly.
          </p>
          <p>
            Three dependencies sit outside the target and can extend it: power availability at the
            site (the dominant variable), permitting timelines in the local jurisdiction, and
            transport distance and routing. The target is a design goal for a standard unit on a
            ready site — it is not a measured deployment statistic, and PODOS does not publish
            deployment counts or completed-project timelines at this stage.
          </p>
        </div>
      </ProseWithRail>

      {/* 10 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="Limitations and open variables"
        eyebrow="HONEST LIMITS"
        items={[
          <>
            The <span data-claim="deployment-window">90-day window</span> and the{" "}
            <span data-claim="unit-capacity-1mw">1-MW unit capacity</span> are company targets, not
            measured results from completed deployments. No deployment counts or customer projects
            are published.
          </>,
          "Site power availability dominates the real calendar and sits outside any vendor's control. A site without a power path has an indeterminate timeline regardless of how fast the unit is built.",
          "Permitting is jurisdiction-specific. A placed, factory-built unit typically narrows the construction-permitting scope, but it does not remove electrical, fire, or zoning review.",
          "Factory acceptance testing validates the unit against factory conditions. Site-specific risks — utility power quality, grounding, climate extremes — are only retired at commissioning.",
          "This page describes single-unit deployment. Multi-unit sites add shared-infrastructure decisions this overview does not cover.",
        ]}
      />

      {/* 11 · FAQ — paper */}
      <FAQBlock items={FAQ} title="Deployment FAQ" surface="paper" />

      {/* 12 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED — paper */}
      <RelatedRail
        title="Related reading"
        surface="paper"
        items={[
          { href: "/platform", label: "PLATFORM", title: "The full architecture" },
          { href: "/engineering", label: "ENGINEERING", title: "The systems each stage exercises" },
          {
            href: "/compare/modular-ai-data-center-vs-traditional-data-center",
            label: "COMPARE",
            title: "Modular vs traditional build",
          },
          { href: "/invest", label: "INVEST", title: "Evaluating the model" },
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Start where the schedule actually"
        accent="starts"
        body="Power availability, permitting, and access decide the calendar before a unit is ordered. Stage one is the assessment that tells you whether the rest of the schedule is real."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy/site-power-readiness", label: "Site & power readiness" }}
        field="deploy"
      />
    </main>
  );
}
