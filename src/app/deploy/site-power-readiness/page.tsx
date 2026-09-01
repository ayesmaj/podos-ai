/**
 * /deploy/site-power-readiness — deployment stage 01 guide.
 * Archetype C, deployment stage. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, no client JS. This page carries no photography of
 * its own (founder rule: one image = one placement), so the hero is
 * editorial and the visual weight is carried by the readiness matrix
 * and the stage strip. All external numbers cite the source register;
 * company claims render only from claims.ts publishable entries with
 * their required qualifiers.
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

const PATH = "/deploy/site-power-readiness";
const TITLE = "Site and Power Readiness for AI Data Center Deployment";
const DESCRIPTION =
  "Stage one of a modular AI deployment: how to assess site power, network, access, pad and permitting — and the conditions that disqualify a site early.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Data centre electricity use surged in 2025, even with tightening bottlenecks driving a scramble for solutions",
    publisher: "IEA",
    url: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions",
    date: "2025/2026",
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
    name: "Commercial Vehicle Size and Weight Program — federal size and weight standards",
    publisher: "Federal Highway Administration (US DOT)",
    url: "https://ops.fhwa.dot.gov/freight/sw/overview/index.htm",
    date: "accessed 2026-08-31",
  },
  {
    n: 5,
    name: "ICC/MBI 1205-2021 — Inspection and Regulatory Compliance in Off-Site Construction (implementation brief)",
    publisher: "International Code Council / Modular Building Institute",
    url: "https://www.iccsafe.org/building-safety-journal/bsj-technical/new-brief-explores-implementation-of-icc-mbi-standards-1200-and-1205-for-off-site-construction/",
    date: "2021 ed. (brief Aug 2022)",
  },
  {
    n: 6,
    name: "NFPA 70 — National Electrical Code (NEC)",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "current edition",
  },
  {
    n: 7,
    name: "NFPA 855 — Standard for the Installation of Stationary Energy Storage Systems",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "current edition",
  },
  {
    n: 8,
    name: "ANSI/TIA-942 Telecommunications Infrastructure Standard for Data Centers (rev. C)",
    publisher: "Telecommunications Industry Association",
    url: "https://tiaonline.org/products-and-services/tia942certification/ansi-tia-942-standard/",
  },
  {
    n: 9,
    name: "Climatic design conditions — Weather Data Viewer / Handbook—Fundamentals Ch. 14",
    publisher: "ASHRAE",
    url: "https://weather.ashrae.org/",
    date: "2025 ed.",
  },
  {
    n: 10,
    name: "ISO 668:2020 — Series 1 freight containers: classification, dimensions and ratings",
    publisher: "ISO",
    url: "https://www.iso.org/standard/76912.html",
    date: "2020",
  },
  {
    n: 11,
    name: "SP 800-53 Rev. 5 — Security and Privacy Controls (PE control family)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final",
    date: "Sep 2020",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "What is site and power readiness?",
    a: "It is the first stage of a modular data center deployment: an assessment of whether a location can accept, energize, connect, and legally operate a factory-built compute unit. Its output is a decision — proceed, remediate, or disqualify — not a design.",
  },
  {
    q: "What disqualifies a site fastest?",
    a: "Power with no credible path. With no existing megawatt-class service, no executed interconnection agreement, and no viable on-site generation plan, work on the other categories cannot change the schedule. The next fastest is access: a placement point heavy road freight cannot reach.",
  },
  {
    q: "Does a modular unit still need permits?",
    a: "Yes. Off-site construction moves fabrication into a factory; it does not remove the local authority having jurisdiction. ICC/MBI 1205 describes the split: in-plant inspection of what was built off site, plus on-site final inspection of foundation, anchorage, and connections.",
  },
  {
    q: "How early should this assessment happen?",
    a: "Before an order is placed. Every later stage assumes a site that can be energized on a known date, and finding an interconnection queue afterwards converts a schedule problem into a storage problem. The assessment is cheap and reversible; the order is neither.",
  },
];

const linkStyle: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

/* stage-one assessment: code, category, what is established, disqualifier */
const CATEGORIES: Array<[string, string, string, string]> = [
  [
    "SR-01",
    "Power",
    "Existing service capacity, an executed interconnection agreement, or a sized on-site generation plan — with a date attached.",
    "No capacity and no dated path to it.",
  ],
  [
    "SR-02",
    "Electrical boundary",
    "Service voltage, metering position, protection coordination, and who owns equipment on each side of the handoff.",
    "A handoff nobody will own or energize.",
  ],
  [
    "SR-03",
    "Pad and structure",
    "A level, drained, load-rated surface with a defined anchor pattern; geotechnical data where soils are unknown.",
    "Ground where no engineered foundation is permissible.",
  ],
  [
    "SR-04",
    "Access and rigging",
    "Route survey against federal road limits, turning radii, overhead clearance, and a rigging position at the placement point.",
    "No legal route, or nowhere to set the unit down.",
  ],
  [
    "SR-05",
    "Network",
    "Fiber or wireless backhaul with a defined entrance path and pathway diversity.",
    "No carrier presence and no funded build.",
  ],
  [
    "SR-06",
    "Permitting",
    "How the jurisdiction treats a placed, factory-built unit: in-plant versus on-site inspection, anchorage, electrical and energy-storage approvals.",
    "No recognized pathway for off-site construction.",
  ],
  [
    "SR-07",
    "Environment",
    "Design conditions — cooling dry bulb, coincident wet bulb, extreme dew point — plus altitude, corrosion, seismic and flood exposure.",
    "Conditions outside the unit's rated envelope.",
  ],
  [
    "SR-08",
    "Security and operations",
    "Access control, monitoring, visitor handling, and who is on site to escort a technician.",
    "No way to control or record physical access.",
  ],
];

/* early exits — condition, why no downstream stage recovers it */
const DISQUALIFIERS: Array<[string, string]> = [
  [
    "No power and no dated path to it",
    "A queue position without a milestone schedule is a forecast, not capacity.",
  ],
  [
    "No legal delivery route",
    "If a permitted vehicle cannot reach the placement point, the unit cannot arrive at any price.",
  ],
  [
    "No rigging position",
    "A reachable site with nowhere to stand a crane is the same failure one step later.",
  ],
  [
    "No off-site construction pathway",
    "If the authority will not recognize in-plant inspection, the factory advantage is spent on rework.",
  ],
  [
    "Unbuildable ground",
    "Fill, high water table, or contaminated soils where no engineered foundation is permissible.",
  ],
  [
    "No network path and no funded build to one",
    "Backhaul that depends on an unfunded carrier extension is an assumption.",
  ],
  [
    "Design conditions outside the rated envelope",
    "Those sites need a different product, not a harder deployment.",
  ],
  [
    "No one to control physical access",
    "An unattended site with no access control cannot meet a basic security baseline.",
  ],
];

const NOT_A_FIT = [
  "You are buying capacity, not siting it. Colocation and cloud move every category here onto someone else's balance sheet; the comparison is commercial, not civil.",
  "The requirement is one or two racks. Below the point where a dedicated unit is the sensible increment, an existing electrical room usually wins.",
  "The workload has no location constraint. If no data, latency, or sovereignty requirement ties compute here, readiness answers a question nobody asked.",
  "The site is already a commissioned data center with spare capacity. The real study is then a density and cooling retrofit, not a placement.",
  "The schedule is set by something else. If funding or hiring gates the project by a year, an early readiness pass goes stale before it is used.",
  "And what stage one cannot do: it does not shorten an interconnection queue, bind a jurisdiction to a verbal interpretation, or replace a stamped civil design.",
];

/* the six-stage chain; DP-01 is this page */
const STAGES: Array<[string, string, string, string | null]> = [
  ["DP-01 · This stage", "Site & power readiness", "Confirm power, permits, ground, access, network.", null],
  ["DP-02", "Configuration engineering", "Fix the build specification from a bounded menu.", "/deploy/configuration-engineering"],
  ["DP-03", "Factory build & testing", "Assembly, integration, burn-in on the line.", "/deploy/factory-build-testing"],
  ["DP-04", "Transport & placement", "Ship as heavy freight, rig, set, connect.", "/deploy/transport-placement"],
  ["DP-05", "Commissioning", "Energize, verify, load-test on site power.", "/deploy/commissioning"],
  ["DP-06", "Operations & maintenance", "Monitor, maintain, grow unit by unit.", "/deploy/operations-maintenance"],
];

const TOC: Array<[string, string]> = [
  ["#power-first", "Power owns the calendar"],
  ["#assessment", "The eight categories"],
  ["#site-work", "Access, network, permits"],
  ["#disqualifiers", "Early disqualifiers"],
  ["#limitations", "When this is not the fit"],
  ["#podos", "How PODOS runs stage one"],
];

export default function SitePowerReadinessPage() {
  return (
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="Site and power readiness: stage one of a modular deployment"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — editorial (this page owns no photography) */}
      <HeroEditorial
        category="Deploy stage DP-01 of 06"
        title="Site and power readiness,"
        accent="stage one"
        lede="Site and power readiness decides whether a location can accept, energize, connect, and legally operate a factory-built compute unit — before an order is placed. The output is a decision, not a design: proceed, remediate, or disqualify."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Deploy", path: "/deploy" },
              { name: "Site & power readiness", path: PATH },
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
          { value: "8", label: "Readiness categories assessed" },
          { value: "3", label: "Outcomes — proceed, remediate, disqualify" },
          { value: "DP-01", label: "First of six deployment stages" },
        ]}
      />

      {/* 2 · SUMMARY — canvas */}
      <SummaryBand
        title="What stage one establishes"
        items={[
          {
            code: "SR-01…08",
            title: "Eight questions, asked once",
            body: "It answers eight questions: power, electrical boundary, pad, access, network, permitting, environment, and security.",
          },
          {
            code: "POWER",
            title: "Power owns the calendar",
            body: "A modular unit removes construction from the critical path. It does not manufacture electrons.",
          },
          {
            code: "ACCESS",
            title: "Delivery is road law",
            body: "A factory-built unit arrives as cargo, which makes road law part of the site assessment.",
          },
          {
            code: "PERMIT",
            title: "The jurisdiction stays put",
            body: "Factory construction moves the work, not the jurisdiction.",
          },
        ]}
      />

      {/* 3 · STAGE STRIP — paper, this stage emphasised */}
      <CardGrid
        id="stages"
        eyebrow="The chain"
        title="Where this sits in the six-stage sequence"
        lede="The stages overlap, but they do not reorder. Everything downstream assumes a site that has already passed stage one."
        surface="paper"
        field="deploy"
        columns={3}
        items={STAGES.map(([code, name, focus, href]) => ({
          code,
          title: name,
          body: href ? (
            <>
              {focus}{" "}
              <Link href={href} style={linkStyle}>
                Stage guide
              </Link>
            </>
          ) : (
            <>{focus} You are reading this stage.</>
          ),
        }))}
      />

      {/* 4 · WHY POWER LEADS — prose with a TOC rail, canvas */}
      <ProseWithRail
        id="power-first"
        surface="canvas"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {TOC.map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={{ ...linkStyle, fontSize: "0.9rem", textDecoration: "none" }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <SectionHead eyebrow="Stage one, first principle" title="Power owns the calendar" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Once the building is no longer the long pole, the interconnection is — and that
            constraint is structural, not cyclical. The IEA reports that data-centre electricity use
            surged in 2025 while grid-connection bottlenecks tightened, driving a scramble for
            alternatives.<Cite n={1} /> Lawrence Berkeley National Laboratory estimates US data
            centers consumed 4.4% of US electricity in 2023, on a path to 6.7–12% by 2028.
            <Cite n={2} /> Every site assessed today competes against that curve.
          </p>
          <p>
            So the first question is not how much power the workload needs, but what power exists
            here and on what date. Three answers qualify: an existing service with headroom, an
            executed interconnection agreement with a milestone schedule, or a sized and permitted
            on-site generation plan. Density then decides how much of that capacity a single
            placement consumes — Uptime Institute&apos;s 2025 survey of more than 800 operators shows
            fleet rack densities rising into the 10–30 kW band, above what most existing electrical
            rooms were designed against.<Cite n={3} />
          </p>
        </div>
      </ProseWithRail>

      {/* 5 · THE EIGHT CATEGORIES — wide matrix, paper */}
      <MatrixTable
        id="assessment"
        eyebrow="The assessment"
        title="The eight readiness categories"
        lede="Each category is assessed independently and carries its own disqualifier. Separating them matters: a site can fail one and still be worth remediating, while a site that fails SR-01 or SR-04 rarely is."
        surface="paper"
        field="power"
        head={["Code", "Category", "What is established", "Disqualifier"]}
        rows={CATEGORIES.map(([code, name, what, kill]) => [
          <span key={code} className="pill">
            {code}
          </span>,
          <span key={`${code}-n`} style={{ color: "var(--ink-strong)", fontWeight: 500 }}>
            {name}
          </span>,
          what,
          kill,
        ])}
      />

      {/* 6 · THE SITE WORK — long prose, canvas */}
      <ProseWithRail id="site-work" surface="canvas">
        <SectionHead
          eyebrow="Categories in detail"
          title="Ground, road, fiber, and the authority having jurisdiction"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            For the item-level survey — the questions to ask and how to score the answers — use the{" "}
            <Link href="/resources/data-center-readiness-checklist" style={linkStyle}>
              data center readiness checklist
            </Link>
            . This page covers what those answers mean for the deployment sequence.
          </p>

          <h3 className="h3" style={{ marginTop: "2.25rem" }}>
            Access, pad, and the physics of delivery
          </h3>
          <p style={{ marginTop: "0.9rem" }}>
            Federal size and weight standards on the Interstate System cap a single axle at 20,000
            lb, a tandem axle at 34,000 lb, and gross vehicle weight at 80,000 lb, while width on the
            National Network is fixed at 102 inches — no state may set a higher or lower figure.
            <Cite n={4} /> Height is left to the states. Units built to ISO series-1 container
            geometry inherit standard external dimensions, ratings, and corner-fitting positions,
            which is what lets a route be planned and a lift be rigged from published data rather
            than a field measurement.<Cite n={10} />
          </p>
          <p>
            The route survey runs from the highway to the exact placement point: turning radii at the
            last intersections, overhead clearance including utility spans, bridge and culvert
            ratings on the final approach, and a rigging position with the reach and ground bearing
            to set the unit down. The pad is a civil deliverable — level, drained, load-rated, with
            anchor points and conduit stub-ups matching the unit&apos;s published pattern. Where soils
            are unknown, the geotechnical work belongs here, not in the week the truck arrives; the
            move itself is covered in{" "}
            <Link href="/deploy/transport-placement" style={linkStyle}>
              transport and placement
            </Link>
            .
          </p>

          <h3 className="h3" style={{ marginTop: "2.25rem" }}>
            Network path and entrance
          </h3>
          <p style={{ marginTop: "0.9rem" }}>
            Network readiness is two findings: whether a carrier can serve the site at all, and
            whether the physical entrance path exists. ANSI/TIA-942 defines the structure behind the
            second — entrance rooms, pathways, cross-connects, and the distribution areas that
            connect them — alongside the redundancy topologies that decide whether one backhoe can
            take the site offline.<Cite n={8} /> Diverse entry means two paths with real physical
            separation, not two strands in one conduit. How much bandwidth the workload needs is a
            configuration question; the{" "}
            <Link href="/engineering/networking-fiber" style={linkStyle}>
              networking and fiber
            </Link>{" "}
            guide covers the fabric side. Stage one only establishes that a path exists, who owns it,
            and what it costs to light.
          </p>

          <h3 className="h3" style={{ marginTop: "2.25rem" }}>
            Permitting a unit that was built somewhere else
          </h3>
          <p style={{ marginTop: "0.9rem" }}>
            The ICC/MBI off-site construction standards describe the split: in-plant inspection of
            what was fabricated off site, third-party inspection agencies, state modular programs,
            and on-site final inspection of foundation, anchorage, and connections by the local
            authority having jurisdiction.<Cite n={5} /> Reading that pathway early is what keeps a
            finished unit from waiting on a permit.
          </p>
          <p>
            Two code families apply regardless of where the unit was built: electrical work at the
            site boundary and inside the enclosure follows the National Electrical Code
            <Cite n={6} />, and batteries bring stationary energy-storage requirements governing
            siting, separation, and fire protection.<Cite n={7} /> Physical security has its own
            baseline — the NIST SP 800-53 physical and environmental protection controls cover access
            authorization, monitoring, visitor records, and emergency shutoff, which a remote or
            shared site still has to satisfy.<Cite n={11} /> The{" "}
            <Link href="/engineering/safety-security" style={linkStyle}>
              safety and security
            </Link>{" "}
            guide covers how those controls land in a modular enclosure.
          </p>

          <h3 className="h3" style={{ marginTop: "2.25rem" }}>
            Site conditions the enclosure has to survive
          </h3>
          <p style={{ marginTop: "0.9rem" }}>
            Heat rejection is designed against the site, not a national average. ASHRAE publishes
            per-station climatic design conditions — cooling design dry bulb, coincident wet bulb,
            extreme annual dew point — and those are the numbers a dry cooler is sized to, with the
            as-of edition recorded alongside them.<Cite n={9} /> Altitude derates air-side equipment;
            coastal salt and industrial dust drive material choices; seismic and flood exposure drive
            anchorage and pad elevation. None of these disqualify a site alone, but all change the
            configuration — which is why they belong here rather than in commissioning. The{" "}
            <Link href="/engineering/thermal-enclosure" style={linkStyle}>
              thermal enclosure
            </Link>{" "}
            guide covers what the envelope is asked to do once those conditions are known.
          </p>
        </div>
      </ProseWithRail>

      {/* 7 · EARLY EXITS — cards, paper */}
      <CardGrid
        id="disqualifiers"
        eyebrow="Early exits"
        title="What disqualifies a site early"
        lede="Disqualifying early is the cheapest work in the deployment. Each condition below ends the assessment, because no downstream stage recovers it."
        surface="paper"
        columns={4}
        items={DISQUALIFIERS.map(([title, body], i) => ({
          code: String(i + 1).padStart(2, "0"),
          title,
          body,
        }))}
      />

      {/* 8 · INK BEAT */}
      <QuoteMetric
        quote="A queue position with no date is a forecast, and should be recorded as one."
        attribution="Stage one records what exists, not what is hoped for"
        metric="8"
        label="Categories, each with its own disqualifier"
        field="power"
      />

      {/* 9 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="When this stage is not the right fit"
        eyebrow="Honest limits"
        lede="The assessment assumes a specific problem: placing standardized compute units on land you control or can lease. It is the wrong instrument in several common cases."
        items={NOT_A_FIT}
      />

      {/* 10 · PODOS — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="In the product" title="How PODOS runs stage one" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Because the hardware is standardized, so is the assessment. Each{" "}
            <Link href="/platform/podos-pod" style={linkStyle}>
              PODOS Pod
            </Link>{" "}
            is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1-MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so the electrical,
            structural, and access requirements are known before a site is visited. Stage one becomes
            a comparison between fixed requirements and a specific piece of ground, rather than a
            design study whose answers move as the building does.
          </p>
          <p>
            That is also what makes the schedule conditional. PODOS{" "}
            <span data-claim="deployment-window">
              targets a 90-day window from order to commissioning
            </span>{" "}
            for a standard unit — a window measured from a site that has already passed this stage,
            with readiness work running in parallel with the factory build. The full sequence is in
            the{" "}
            <Link href="/deploy" style={linkStyle}>
              six-stage deployment overview
            </Link>
            , the electrical side in the{" "}
            <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
              power architecture
            </Link>{" "}
            guide, and the reason the work splits this way in{" "}
            <Link href="/compare/factory-built-vs-site-built-data-center" style={linkStyle}>
              factory-built versus site-built
            </Link>
            . Terms are defined in the{" "}
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

      {/* 13 · RELATED — canvas. DP-01 has no previous stage, so the hub opens the chain. */}
      <RelatedRail
        title="Continue the deployment chain"
        surface="canvas"
        items={[
          { href: "/deploy", label: "START · OVERVIEW", title: "The six-stage deployment sequence" },
          {
            href: "/deploy/configuration-engineering",
            label: "NEXT · DP-02",
            title: "Configuration engineering",
          },
          {
            href: "/resources/data-center-readiness-checklist",
            label: "RESOURCE",
            title: "Data center readiness checklist",
          },
          {
            href: "/engineering/data-center-power-architecture",
            label: "ENGINEERING",
            title: "Data center power architecture",
          },
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Bring us a site and"
        accent="a date"
        body="Stage one is cheap and reversible. Send the service capacity, the access route, and the jurisdiction, and engineering will tell you which of the eight categories needs work."
        primary={{ href: "/estimate", label: "Size your deployment" }}
        secondary={{ href: "/deploy", label: "Deployment overview" }}
        field="deploy"
      />
    </main>
  );
}
