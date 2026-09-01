/**
 * /use-cases/enterprise-ai — Archetype B, use case.
 * See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component. Deliberately a DIFFERENT composition from the
 * engineering archetype: media hero instead of split hero, no wide
 * diagram section, and the ink beat lands on the compliance statement
 * rather than a metric.
 *
 * Claims discipline: only publishable ids from src/content/data/claims.ts
 * render, each wrapped in data-claim with its required qualifier.
 * External numbers cite docs/seo/source-register.md rows only.
 * NO compliance certification, attestation, or accreditation is claimed
 * or implied anywhere on this page (stated explicitly in EA-05).
 */

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  HeroMedia,
  SummaryBand,
  ProseWithRail,
  MatrixTable,
  SplitFeature,
  QuoteMetric,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/use-cases/enterprise-ai";
const TITLE = "Enterprise AI Infrastructure: When On-Site GPUs Make Sense";
const DESCRIPTION =
  "How enterprises decide between cloud GPUs and dedicated on-site AI capacity: workload fit, buyer roles, site constraints, power, cooling, and network.";

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

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
    publisher: "International Energy Agency",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
    date: "Apr 2025",
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
    name: "GB200 NVL72 product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    date: "accessed 2026-08-31",
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
    name: "RoCE networks for distributed AI training at scale",
    publisher: "Meta Engineering",
    url: "https://engineering.fb.com/2024/08/05/data-center-engineering/roce-network-distributed-ai-training-at-scale/",
    date: "Aug 2024",
  },
  {
    n: 7,
    name: "IEEE Std 802.3df-2024 — Ethernet Amendment 9 (800 Gb/s MAC; 400/800 Gb/s PHYs)",
    publisher: "IEEE SA",
    url: "https://standards.ieee.org/ieee/802.3df/11107/",
    date: "published Mar 2024",
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
    name: "Commercial Vehicle Size and Weight Program — federal size and weight standards",
    publisher: "Federal Highway Administration (US DOT)",
    url: "https://ops.fhwa.dot.gov/freight/sw/overview/index.htm",
    date: "accessed 2026-08-31",
  },
  {
    n: 10,
    name: "ICC/MBI 1205-2021 — Inspection and Regulatory Compliance in Off-Site Construction",
    publisher: "International Code Council / Modular Building Institute",
    url: "https://www.iccsafe.org/building-safety-journal/bsj-technical/new-brief-explores-implementation-of-icc-mbi-standards-1200-and-1205-for-off-site-construction/",
    date: "2021 ed.",
  },
];

/* FAQ — the SAME array feeds the visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "When is dedicated AI infrastructure cheaper than cloud GPUs?",
    a: "When utilization is high and sustained. Owned capacity is paid for whether or not it runs, so the comparison is the fully loaded cost of an owned megawatt divided by the hours it is actually busy, set against reserved cloud capacity. Workloads that idle most of the week rarely clear that bar; steady fine-tuning and production inference often do.",
  },
  {
    q: "Does putting AI hardware on our own site make us compliant?",
    a: "No. Physical custody changes where data sits and who can touch the hardware, which supports many control objectives — but compliance status comes from an audit against a named framework, not from an enclosure. PODOS AI claims no certification, attestation, or accreditation for any product.",
  },
  {
    q: "What has to be true about the site first?",
    a: "A power path with a credible energization date, a prepared pad with legal road access for the delivery, an authority having jurisdiction that accepts off-site-built equipment, and a heat-rejection strategy that fits the local climate and water position. Any one missing turns a hardware decision into a construction program.",
  },
  {
    q: "Do we need a separate network for the GPUs?",
    a: "For multi-node training, generally yes. Large-scale practice separates the frontend network from a dedicated non-blocking backend fabric carrying collective traffic between GPUs. Single-node or inference-only deployments can often stay on one fabric.",
  },
];

const link: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

const ROLES: [string, string, string, string][] = [
  ["EA-R1", "Head of AI / ML platform", "Model roadmap, utilization, scheduler policy", "Whether today's silicon is still right two refresh cycles out."],
  ["EA-R2", "VP infrastructure / CIO", "Capacity plan, operating model, remote hands", "Who carries the pager for a facility IT has never owned."],
  ["EA-R3", "Security & data governance", "Classification, access control, egress rules", "Whether physical custody is a stated requirement or a preference."],
  ["EA-R4", "Facilities / real estate", "Land, pad, loading, delivery route, heat rejection", "Whether the site takes another megawatt without a service upgrade."],
  ["EA-R5", "Finance / procurement", "Capital treatment, depreciation horizon, vendor risk", "Utilization assumptions — the case collapses if the cluster idles."],
  ["EA-R6", "External: utility and AHJ", "Service study, interconnection, permits, inspection", "Energization date; acceptance of off-site-built equipment."],
];

const SITE_REQS: [string, string, ReactNode][] = [
  ["Power path", "Service headroom, or an interconnection request with a credible energization date.", "The usual reason an on-site plan slips from quarters to years."],
  ["Pad and access", "A level pad with structural capacity and a legal road route for delivery.", <>Interstate limits are 80,000 lb gross and 102 in wide on the National Network; height is left to the states.<Cite n={9} /></>],
  ["Permitting", "An AHJ that accepts factory-built equipment and plant-stage inspection.", "Off-site construction standards define those roles, but adoption varies by jurisdiction."],
  ["Heat rejection", "Somewhere for the heat to go: dry coolers, evaporative equipment, or a heat consumer.", "Climate and water position decide it; evaporative permits are the slow path."],
  ["Network entrance", "Fiber in, sized for operations traffic and data movement to the corporate estate.", "A cluster with no path to its data is a stranded asset."],
  ["Operations coverage", "Named remote hands, spares logistics, escalation path.", "The organization now operates infrastructure instead of consuming a service."],
];

const CHECKLIST: [string, string][] = [
  ["Sustained utilization clears reserved cloud pricing over a quarter, not a peak week.", "Stay on reserved cloud capacity."],
  ["A named residency, custody, or egress requirement rented capacity cannot satisfy.", "The driver is preference — reassess."],
  ["A controlled site with a power path and a credible energization date.", "Solve power before selecting hardware."],
  ["A rack-density target agreed by the AI team and facilities across the refresh horizon.", "The envelope is wrong within a generation."],
  ["A cooling method matched to that density, with the heat-rejection path named.", "Liquid-ready hardware lands in an air-only room."],
  ["Network design settled: one fabric or two, plus the wide-area path to the data.", "The cluster waits on data instead of training."],
  ["Delivery route surveyed and permitting posture confirmed with the AHJ.", "Schedule risk moves to the roadside."],
  ["An operating model on paper: monitoring, dispatch, spares.", "Availability becomes an unowned problem."],
  ["Control objectives written as controls, with the audit path owned internally.", "Nobody can define 'secure enough' at handover."],
  ["An exit and refresh plan for end of life or a workload that moves.", "A five-year decision on an eighteen-month roadmap."],
];

export default function EnterpriseAiUseCasePage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Enterprise AI infrastructure: when dedicated capacity earns its place"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="Article"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — the siting photograph IS the surface */}
      <HeroMedia
        code="UC-02"
        cluster="Use case · Enterprise AI"
        title="When dedicated capacity"
        accent="earns its place"
        lede="Three conditions have to hold at once: utilization is high and sustained, the data carries a residency requirement rented capacity cannot satisfy, and a real power path exists on land you control. Miss one and reserved cloud is the better answer."
        imageId="usecase-enterprise-hero"
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Use cases", path: "/use-cases" },
              { name: "Enterprise AI", path: PATH },
            ]}
          />
        }
        metrics={[
          { value: "3", label: "Conditions, all required" },
          { value: "6", label: "Roles that must agree" },
          { value: "10", label: "Checks before hardware" },
        ]}
      />

      {/* 2 · THE TEST — canvas */}
      <SummaryBand
        title="The test, in three parts"
        items={[
          {
            code: "01",
            title: "Utilization is sustained",
            body: "Continuous fine-tuning, batch scoring, production inference. It runs most hours and grows in a straight line, not in bursts.",
          },
          {
            code: "02",
            title: "Residency is named, not preferred",
            body: "A contract clause, a regulator's expectation, a jurisdiction rule. “We'd prefer in-house” does not survive a capital review.",
          },
          {
            code: "03",
            title: "A power path exists",
            body: "Service headroom or an interconnection request with a credible energization date, on land the organization controls.",
          },
        ]}
      />

      {/* 3 · WORKLOAD — prose with a rail */}
      <ProseWithRail
        id="workload"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {[
                ["#workload", "Workload profile"],
                ["#roles", "Who decides"],
                ["#profile", "Power, cooling, network"],
                ["#site", "Site requirements"],
                ["#residency", "Control posture"],
                ["#limitations", "When it does not fit"],
                ["#checklist", "Decision checklist"],
              ].map(([href, label]) => (
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
          eyebrow="The economics"
          title="The workload profile that justifies owning capacity"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Enterprise AI rarely looks like a research cluster. The load that justifies owned
            infrastructure is repetitive: continuous fine-tuning on proprietary corpora, batch
            scoring against internal records, and production inference behind an internal assistant
            or a customer-facing feature. It runs on a schedule, it runs most hours, and it grows in
            a straight line rather than in bursts.
          </p>
          <p>
            That distinction decides the economics. An owned megawatt is paid for whether or not it
            is busy, so the comparison is never list price against list price — it is the fully
            loaded cost of the asset divided by the hours it actually runs. Experimental workloads
            with long idle stretches lose that comparison; steady, forecastable ones win it, which
            is why the underlying load is growing as it is. U.S. data centers consumed roughly 4.4%
            of national electricity in 2023, with Lawrence Berkeley National Laboratory projecting
            6.7–12% by 2028,<Cite n={1} /> and the IEA expects global data-centre electricity use to
            climb toward roughly 945 TWh by 2030, driven largely by AI.<Cite n={2} />
          </p>
          <p>
            The second qualifier is data. A residency requirement is a requirement only when
            somebody can name it — a contract clause, a regulator&apos;s expectation, a jurisdiction
            rule. &quot;We would prefer to keep it in-house&quot; is a preference, and preferences
            do not survive a capital review. The two delivery models are compared directly in{" "}
            <Link href="/compare/on-prem-ai-infrastructure-vs-cloud" style={link}>
              on-prem AI infrastructure vs cloud
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · ROLES — wide matrix, canvas */}
      <MatrixTable
        eyebrow="Decision map"
        title="Who decides, and what each role blocks on"
        lede="On-site AI capacity requires the AI team, infrastructure, security, facilities, and finance to agree — plus two external parties nobody in the building controls. Projects stall on the role invited last."
        surface="canvas"
        head={["Code", "Role", "Owns", "Blocks on"]}
        rows={ROLES.map(([code, role, owns, blocks]) => [
          <span key={code} className="pill">{code}</span>,
          role,
          owns,
          blocks,
        ])}
      />

      {/* 5 · PROFILE — split, visual left */}
      <SplitFeature
        imageId="usecase-enterprise-interior"
        eyebrow="Technical profile"
        title="A GPU cluster is not a"
        accent="bigger server room"
        flip
        surface="paper"
        ratio="1 / 1"
      >
        <p>
          The Uptime Institute&apos;s 2025 survey of more than 800 operators reports fleet rack
          densities rising into the 10–30 kW band,<Cite n={3} /> while rack-scale AI systems ship
          liquid-cooled — NVIDIA&apos;s GB200 NVL72 puts 72 GPUs and 36 CPUs in one rack acting as a
          single NVLink domain, with no air-cooled equivalent on offer.<Cite n={4} /> A room built
          for the first number does not quietly accommodate the second.
        </p>
        <p>
          <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Power.</strong> Dense
          racks change the design upstream as much as the rack itself: service capacity,
          distribution topology, and the redundancy the workload actually needs — often lower for a
          training cluster than for a transactional system.{" "}
          <Link href="/engineering/data-center-power-architecture" style={link}>
            Power architecture
          </Link>
          .
        </p>
        <p>
          <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Cooling.</strong>{" "}
          ASHRAE&apos;s thermal guidelines define both air classes and facility water classes for
          liquid cooling,<Cite n={5} /> and above a certain density the question stops being which
          class and becomes which loop.{" "}
          <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
            Direct-to-chip cooling
          </Link>
          .
        </p>
        <p>
          <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Network.</strong>{" "}
          Multi-node training generally needs two fabrics: practice at scale separates the frontend
          network from a dedicated, non-blocking backend fabric carrying collective traffic between
          GPUs.<Cite n={6} /> The IEEE standardized 800 Gb/s Ethernet in 2024,<Cite n={7} /> so the
          components exist — the wide-area path back to the data estate is the part most plans
          underestimate.{" "}
          <Link href="/engineering/networking-fiber" style={link}>
            Networking and fiber
          </Link>
          .
        </p>
      </SplitFeature>

      {/* 6 · SITE — wide matrix, canvas */}
      <MatrixTable
        eyebrow="Site survey"
        title="What the site has to provide"
        lede="A modular unit removes the building program, not the site program. Six things still have to be true about the property before hardware selection means anything."
        surface="canvas"
        field="deploy"
        head={["Requirement", "What “done” looks like", "Why it bites"]}
        rows={SITE_REQS.map(([req, done, why]) => [req, done, why])}
      />

      {/* 7 · INK BEAT — the compliance statement, not a metric */}
      <QuoteMetric
        quote="A private enclosure is a physical-control posture, not a compliance status. Compliance is produced by an audit against a named framework, by a qualified assessor, for a defined scope."
        attribution="EA-05 · Control posture · PODOS AI claims no certification, attestation, or accreditation for any product"
        field="safety"
      />

      {/* 8 · RESIDENCY — prose, paper */}
      <ProseWithRail id="residency" surface="paper">
        <SectionHead
          eyebrow="EA-05 · Control posture"
          title="Data residency and control: what a private site changes"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Owning the enclosure changes three concrete things: where the data physically sits, who
            can put hands on the hardware, and who holds the keys to the management plane. Those map
            to an existing control vocabulary — NIST&apos;s SP 800-53 physical and environmental
            protection family covers access authorizations, physical access control and monitoring,
            visitor records, and emergency shutoff.<Cite n={8} /> Stating requirements in that
            vocabulary lets security, facilities, and the AI team argue about the same objects.
          </p>
          <p>
            What it does not change: where a control objective must be evidenced, the audit path
            stays the buyer&apos;s to own. Buying hardware before scoping the audit inverts the
            order of work.
          </p>
        </div>
      </ProseWithRail>

      {/* 9 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="When this is not the right fit"
        lede="Modular infrastructure relieves a specific constraint. Where that constraint is not the binding one, it adds cost and complexity for nothing."
        items={[
          "Spiky or exploratory demand. If the cluster would idle for days at a time, elastic capacity is cheaper and faster. Stay there until the load flattens.",
          "Sub-megawatt requirements. A few racks of inference hardware belong in a colocation cage or an existing room, not in a megawatt-class unit.",
          "An existing facility with real headroom. If the hall still takes the power, the cooling, and the floor loading, expanding in place is the lower-risk path.",
          "No credible power path. A modular unit compresses construction, not interconnection; where energization is years out, the utility queue sets the schedule regardless.",
          "Compliance programs with no scoped audit path. Buying hardware before scoping the audit inverts the order of work.",
          "Teams that must always run the newest silicon. Owned capacity locks a generation for its depreciation life; rented capacity does not.",
        ]}
      />

      {/* 10 · CHECKLIST — wide matrix, paper */}
      <MatrixTable
        eyebrow="Before hardware selection"
        title="Ten checks, in clearing order"
        lede="An unresolved item delays hardware selection rather than being worked around."
        surface="paper"
        head={["#", "Check", "If it fails"]}
        rows={CHECKLIST.map(([check, fail], i) => [
          <span key={check} className="pill">{String(i + 1).padStart(2, "0")}</span>,
          check,
          fail,
        ])}
      />

      {/* 11 · PODOS — prose, canvas */}
      <ProseWithRail id="podos" surface="canvas">
        <SectionHead eyebrow="In the product" title="How PODOS approaches enterprise deployments" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            PODOS builds capacity as a repeatable unit rather than a bespoke facility. Each{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with power
            distribution, closed-loop liquid cooling, and network interfaces integrated and tested
            before the unit leaves the factory. Capacity planning becomes arithmetic — units, not
            custom halls — and integration risk moves off the site. PODOS{" "}
            <span data-claim="deployment-window">targets a 90-day window from order to commissioning</span>{" "}
            for a standard unit; the sequence behind that target is on the{" "}
            <Link href="/deploy" style={link}>
              deployment page
            </Link>
            .
          </p>
          <p>
            PODOS AI is an early-stage company. Nothing here describes a completed deployment, a
            customer, or a certified product; the profile above is design intent. To size a
            configuration against a specific site, the{" "}
            <Link href="/estimate" style={link}>
              configurator
            </Link>{" "}
            walks the same variables.
          </p>
        </div>
      </ProseWithRail>

      {/* 12 · FAQ — paper */}
      <FAQBlock items={FAQ} surface="paper" />

      {/* 13 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 14 · RELATED — paper */}
      <RelatedRail
        title="Related reading"
        surface="paper"
        items={[
          { href: "/compare/on-prem-ai-infrastructure-vs-cloud", label: "COMPARE", title: "On-prem AI infrastructure vs cloud" },
          { href: "/resources/data-center-readiness-checklist", label: "RESOURCE", title: "Data center readiness checklist" },
          { href: "/use-cases", label: "USE CASES", title: "All vertical profiles" },
          { href: "/engineering/networking-fiber", label: "ENGINEERING", title: "Networking and fiber" },
        ]}
      />

      {/* 15 · CTA */}
      <CTABand
        title="Size it against"
        accent="your site"
        body="Bring the utilization curve, the residency requirement, and the power path. The configurator walks the same variables an engineering review would."
        primary={{ href: "/estimate", label: "Size your deployment" }}
        secondary={{ href: "/use-cases", label: "Other verticals" }}
        field="deploy"
      />
    </main>
  );
}
