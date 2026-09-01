/**
 * /use-cases — use-case hub (cluster router).
 *
 * Server component, composed from the SEO section library. Eight vertical
 * profiles, each with workload, binding constraint, and BOTH sides of the
 * fit question (master brief honesty rule). The four published vertical
 * guides are linked directly from the VERTICAL GUIDES card grid.
 *
 * Claims discipline: only publishable ids from src/content/data/claims.ts
 * render, wrapped in data-claim with the required qualifier wording.
 * No compliance certifications implied anywhere (stated explicitly in
 * U-04 / U-05 and the limitations section).
 */

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  HeroSplit,
  SummaryBand,
  ProseWithRail,
  CardGrid,
  MatrixTable,
  SplitFeature,
  QuoteMetric,
  LimitsBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/use-cases";
const TITLE = "Modular AI Data Center Use Cases: Fit and Limits — PODOS AI";
const DESCRIPTION =
  "Eight profiles for modular AI infrastructure — enterprise, research, healthcare, government, edge, and power producers — and where a pod does not fit.";

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
    name: "Demonstrating the Data Center as a Flexible Grid Asset",
    publisher: "NREL (U.S. Department of Energy)",
    url: "https://docs.nrel.gov/docs/fy25osti/94844.pdf",
    date: "FY2025",
  },
  {
    n: 5,
    name: "Data centre electricity use surged in 2025 even with tightening bottlenecks",
    publisher: "International Energy Agency",
    url: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions",
    date: "2025",
  },
];

const link: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

/**
 * Card bodies render inside a <p>, so every profile row is span-based —
 * a <div> or <p> here would be invalid nesting and break hydration.
 */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span style={{ display: "block", marginTop: "0.95rem" }}>
      <span className="eyebrow">{label}</span>
      <span style={{ display: "block", marginTop: "0.35rem" }}>{children}</span>
    </span>
  );
}

const FIT_ROWS: string[][] = [
  ["U-01", "Enterprise AI", "Fine-tuning + steady inference", "Rack density in existing rooms", "High sustained GPU utilization", "Spiky, experimental demand"],
  ["U-02", "Universities & research", "Shared training queues", "Campus power and cooling", "Funded multi-year cluster demand", "HPC hall with headroom"],
  ["U-03", "Manufacturing", "Inspection + digital twins", "Data gravity at plant sites", "MV service on the estate", "One-rack inference load"],
  ["U-04", "Healthcare", "Imaging + clinical language models", "Data control, constrained estates", "Institution-controlled land", "Compliance path not yet scoped"],
  ["U-05", "Government & secure", "Sovereign or air-gapped AI", "Authorization timelines", "Defined-perimeter requirement", "Data cleared for certified cloud"],
  ["U-06", "Edge", "Regional inference serving", "Thin megawatt-class middle tier", "Metro power near demand", "Kilowatt-scale sites"],
  ["U-07", "Supplemental capacity", "GPU expansion of a full facility", "Live-hall retrofit disruption", "Campus land plus spare power", "Stranded in-hall capacity"],
  ["U-08", "Power producers", "Compute at the generation source", "Interconnection queues", "Curtailed or queued megawatts", "Intermittent supply, no storage"],
];

const CHECKS: [string, string, string][] = [
  ["01", "Utilization", "Can you keep a megawatt-class unit productive most of the year — or aggregate workloads across teams until you can?"],
  ["02", "Power path", "Do you have existing medium-voltage service, behind-the-meter generation, or a credible interconnection position?"],
  ["03", "Site", "Is there a pad, delivery access, and a fiber route your network team accepts?"],
  ["04", "Data reason", "Is there a governance, gravity, or sovereignty reason to leave shared cloud — or only a cost hypothesis?"],
  ["05", "Operating model", "Who runs the unit on day 2, and with what monitoring and maintenance arrangement?"],
  ["06", "The alternative", "Have you scored modular against a retrofit of what you have and against traditional construction?"],
];

export default function UseCasesPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Modular AI Data Center Use Cases: Fit and Limits"
        description="Eight use-case profiles for modular AI infrastructure, each with workload pattern, binding constraint, and an honest account of where a factory-built unit fits and where it does not."
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="Article"
      />

      {/* 1 · HERO — ink, split */}
      <HeroSplit
        code="UC-01"
        cluster="Use cases"
        title="Where modular AI infrastructure fits —"
        accent="and where it does not"
        lede="Modular AI infrastructure fits organizations that need dedicated GPU capacity on their own terms — their site, their power, their data — and cannot wait years for a conventional facility. It fits poorly where demand is small or intermittent, where no realistic power path exists, or where an existing data center still has headroom."
        imageId="usecase-campus"
        field="deploy"
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Use cases", path: PATH },
            ]}
          />
        }
        metrics={[
          { value: "8", label: "Use-case profiles" },
          { value: "4", label: "Recurring disqualifiers" },
          { value: "6", label: "Checks before shortlisting" },
        ]}
      />

      {/* 2 · THE PATTERN — canvas */}
      <SummaryBand
        title="The pattern behind every profile"
        items={[
          {
            code: "01",
            title: "What the workload actually is",
            body: "Sustained fine-tuning and steady inference behave differently from bursty experimentation, and only one of them justifies owned capacity.",
          },
          {
            code: "02",
            title: "Which constraint binds first",
            body: "Power, cooling, space, data governance, or time. The binding one decides whether hardware selection is even the right next step.",
          },
          {
            code: "03",
            title: "Relief, or relocation",
            body: "Whether a factory-built unit relieves that constraint — or merely relocates it somewhere the problem is still yours.",
          },
        ]}
      />

      {/* 3 · FRAMING — paper, prose with rail */}
      <ProseWithRail
        id="pattern"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {[
                ["#guides", "Vertical guides"],
                ["#fit", "Fit at a glance"],
                ["#profiles", "Use-case profiles"],
                ["#limitations", "Where it does not fit"],
                ["#checks", "Decision checklist"],
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
          eyebrow="Framing"
          title="Broad-based demand, meeting rooms built for another decade"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Demand for dedicated AI capacity is broad-based, not a hyperscaler phenomenon. U.S.
            data centers consumed about 4.4% of national electricity in 2023, with Lawrence
            Berkeley National Laboratory projecting 6.7–12% by 2028
            <Cite n={1} />, and the IEA expects global data-centre electricity use to roughly
            double toward ~945 TWh by 2030, driven largely by AI
            <Cite n={2} />. Yet the facilities most organizations already operate were not built
            for this: the Uptime Institute&apos;s 2025 operator survey places typical rack
            densities in the 10–30 kW band, well below what dense GPU nodes draw <Cite n={3} />.
          </p>
          <p>
            Every profile below therefore turns on the same three questions: what the workload
            actually is, which constraint binds first — power, cooling, space, data governance, or
            time — and whether a factory-built unit like the one described on the{" "}
            <Link href="/platform" style={link}>
              platform overview
            </Link>{" "}
            relieves that constraint or merely relocates it. These are workload profiles and design
            intent, not customer references: PODOS is an early-stage company, and no deployments,
            customers, or certifications are claimed on this page.
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · VERTICAL GUIDES — canvas. The published child pages. */}
      <CardGrid
        id="guides"
        eyebrow="Vertical guides"
        title="Four verticals have a dedicated guide"
        lede="Each guide takes one profile further: the workload in detail, the roles that must agree, the site requirements, and the cases where the answer is no."
        surface="canvas"
        field="deploy"
        columns={2}
        items={[
          {
            code: "U-01",
            title: "Enterprise AI",
            body: (
              <>
                Workload fit, buyer roles, site constraints, power, cooling, and network for
                enterprises deciding between cloud GPUs and dedicated on-site AI capacity.
                <span style={{ display: "block", marginTop: "0.85rem" }}>
                  <Link href="/use-cases/enterprise-ai" style={link}>
                    Enterprise AI infrastructure: when on-site GPUs make sense →
                  </Link>
                </span>
              </>
            ),
          },
          {
            code: "U-02",
            title: "Universities & research",
            body: (
              <>
                How grant cycles, campus power limits, and shared cluster demand decide whether a
                modular AI pod or a machine-room retrofit fits university research computing.
                <span style={{ display: "block", marginTop: "0.85rem" }}>
                  <Link href="/use-cases/universities-research" style={link}>
                    University research computing: pod vs machine-room retrofit →
                  </Link>
                </span>
              </>
            ),
          },
          {
            code: "U-04",
            title: "Healthcare",
            body: (
              <>
                How health systems site AI compute on their own property: data residency, imaging
                and clinical inference workloads, hospital estate limits, and honest fit.
                <span style={{ display: "block", marginTop: "0.85rem" }}>
                  <Link href="/use-cases/healthcare" style={link}>
                    Healthcare AI infrastructure: on-premises GPU compute →
                  </Link>
                </span>
              </>
            ),
          },
          {
            code: "U-06",
            title: "Edge AI",
            body: (
              <>
                How megawatt-scale edge AI infrastructure gets sited: latency-driven placement,
                power and connectivity limits, unattended operation, and when cloud wins.
                <span style={{ display: "block", marginTop: "0.85rem" }}>
                  <Link href="/use-cases/edge-ai" style={link}>
                    Edge AI infrastructure: placing compute near the data →
                  </Link>
                </span>
              </>
            ),
          },
        ]}
      />

      {/* 5 · FIT TABLE — paper, wide */}
      <MatrixTable
        id="fit"
        eyebrow="Router"
        title="Fit at a glance"
        lede="A strong fit signal is a reason to read the matching profile; a weak fit signal is a reason to stop before spending engineering time."
        surface="paper"
        head={["Code", "Profile", "Typical workload", "Binding constraint", "Strong fit signal", "Weak fit signal"]}
        rows={FIT_ROWS.map((r) => [
          <span key={r[0]} className="pill">
            {r[0]}
          </span>,
          r[1],
          r[2],
          r[3],
          r[4],
          r[5],
        ])}
      />

      {/* 6 · PROFILES — canvas. U-03 and U-04 get their own split sections below. */}
      <CardGrid
        id="profiles"
        eyebrow="Profiles"
        title="Use-case profiles"
        lede="Each profile states both sides of the fit question — where a factory-built unit helps, and where it does not."
        surface="canvas"
        columns={2}
        items={[
          {
            code: "U-01",
            title: "Enterprise AI",
            body: (
              <>
                <Row label="Workload">
                  Sustained fine-tuning and internal inference on proprietary data — the pattern
                  where reserved cloud GPU commitments run at high utilization month after month.
                </Row>
                <Row label="Binding constraint">
                  Corporate server rooms were provisioned for single-digit-kW racks
                  <Cite n={3} />, and retrofitting one for{" "}
                  <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
                    direct-to-chip liquid cooling
                  </Link>{" "}
                  is often a larger project than the cluster itself.
                </Row>
                <Row label="Where modular helps">
                  A dedicated unit on company or leased industrial land gives the cluster a
                  purpose-built envelope.{" "}
                  <span data-claim="unit-capacity-1mw">
                    Each PODOS Pod is designed as a standardized 1 MW building block
                  </span>
                  , <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so capacity
                  planning stays arithmetic — units, not bespoke halls.
                </Row>
                <Row label="Where it does not">
                  Bursty experimentation and workloads that idle most of the week. If a megawatt
                  cannot be kept busy, shared cloud remains the honest default.
                </Row>
              </>
            ),
          },
          {
            code: "U-02",
            title: "Universities & research",
            body: (
              <>
                <Row label="Workload">
                  Many principal investigators sharing one scheduler; long training queues;
                  hardware funded in discrete grant awards.
                </Row>
                <Row label="Binding constraint">
                  Campus machine rooms rarely hold spare megawatts or liquid-cooling loops, and new
                  academic buildings move at capital-planning speed.
                </Row>
                <Row label="Where modular helps">
                  A self-contained unit sited near existing campus electrical infrastructure hands
                  facilities teams a fixed, documented envelope — power in, heat out — instead of
                  an open-ended construction program.
                </Row>
                <Row label="Where it does not">
                  Institutions whose HPC hall still has power and cooling headroom; expanding in
                  place is usually cheaper. Funding rules that favor operating spend over capital
                  purchases also point back to cloud credits.
                </Row>
              </>
            ),
          },
          {
            code: "U-05",
            title: "Government & secure",
            body: (
              <>
                <Row label="Workload">
                  Training and inference under sovereignty, air-gap, or controlled-access
                  requirements that rule out shared cloud regions.
                </Row>
                <Row label="Binding constraint">
                  Procurement and facility-authorization timelines dominate; a program can hold
                  budget for compute yet wait years for an approved place to put it.
                </Row>
                <Row label="Where modular helps">
                  A physically bounded unit gives security teams a defined perimeter to assess —
                  one enclosure, one power feed, documented ingress — rather than a shared hall.
                </Row>
                <Row label="Where it does not">
                  Modular construction shortens the building, not the authorization. PODOS claims
                  no government accreditation, and programs whose data can lawfully run in
                  certified cloud regions may find that path faster.
                </Row>
              </>
            ),
          },
          {
            code: "U-06",
            title: "Edge",
            body: (
              <>
                <Row label="Workload">
                  Regional inference serving — models placed near users or data sources rather than
                  in a distant region.
                </Row>
                <Row label="Binding constraint">
                  The middle tier is thin: device-level edge AI and hyperscale regions are both well
                  served, while megawatt-class capacity in secondary metros is scarce.
                </Row>
                <Row label="Where modular helps">
                  A unit designed to be relocatable can occupy that middle tier where metro power
                  exists — and move if demand does.
                </Row>
                <Row label="Where it does not">
                  True edge sites measured in kilowatts — a closet rack, not a pod. Any latency
                  benefit is workload-specific and should be measured before committing; no general
                  number honestly applies.{" "}
                  <Link href="/use-cases/edge-ai" style={link}>
                    Full edge AI guide
                  </Link>
                  .
                </Row>
              </>
            ),
          },
          {
            code: "U-07",
            title: "Supplemental capacity",
            body: (
              <>
                <Row label="Workload">
                  An operator whose existing halls are out of power or cooling headroom for GPU
                  racks, with demand still arriving.
                </Row>
                <Row label="Binding constraint">
                  Retrofitting a live hall for high-density liquid cooling disrupts tenants and
                  takes floor space out of service.
                </Row>
                <Row label="Where modular helps">
                  Added capacity beside the existing facility, on the same campus and network,
                  while the main hall keeps running.{" "}
                  <span data-claim="deployment-window">
                    PODOS targets a 90-day window from order to commissioning for a standard unit
                  </span>{" "}
                  — the{" "}
                  <Link href="/deploy" style={link}>
                    deployment process
                  </Link>{" "}
                  is documented separately.
                </Row>
                <Row label="Where it does not">
                  Halls with stranded power and empty white space are often better served by a
                  targeted retrofit — run that comparison before adding enclosures.
                </Row>
              </>
            ),
          },
          {
            code: "U-08",
            title: "Power producers & stranded energy",
            body: (
              <>
                <Row label="Workload">
                  Turning curtailed, queued, or under-contracted generation into a sellable compute
                  product by colocating AI capacity at the source.
                </Row>
                <Row label="Binding constraint">
                  Interconnection queues run years, and the IEA reports grid-connection bottlenecks
                  tightening even as data-centre electricity use surged in 2025 <Cite n={5} />.
                </Row>
                <Row label="Where modular helps">
                  Compute placed behind the meter consumes power where it is generated, and NREL
                  has demonstrated data centers operating as flexible grid assets, including a
                  70 MW grid-interactive facility <Cite n={4} />. A unit-sized building block is
                  intended to be matched to generation blocks rather than forcing a monolithic
                  campus.
                </Row>
                <Row label="Where it does not">
                  Sites without a workable fiber path, or highly intermittent generation without
                  storage. Compute economics depend on sustained utilization; a resource that runs
                  a few hundred hours a year cannot carry a cluster.
                </Row>
              </>
            ),
          },
        ]}
      />

      {/* 7 · U-03 MANUFACTURING — paper, split */}
      <SplitFeature
        imageId="usecase-factory"
        eyebrow="U-03 · Manufacturing"
        title="Data gravity keeps the compute"
        accent="on the estate"
        surface="paper"
      >
        <p>
          <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Workload.</strong> Vision
          inspection, defect detection, digital-twin simulation, and process optimization — heavy
          inference near the line plus periodic retraining on plant telemetry.
        </p>
        <p>
          <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>
            Binding constraint.
          </strong>{" "}
          Data gravity. Plants generate more camera and sensor data than is economical to backhaul,
          and industrial estates have power but no data hall.
        </p>
        <p>
          <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>
            Where modular helps.
          </strong>{" "}
          Many industrial sites already take medium-voltage service — the class of input the
          pod&apos;s{" "}
          <Link href="/engineering/data-center-power-architecture" style={link}>
            power architecture
          </Link>{" "}
          is designed around — so a unit can sit on the same estate as the machines it serves.
        </p>
        <p>
          <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Where it does not.</strong>{" "}
          Batch analytics that tolerate a round trip to a cloud region, or a single line whose
          inference fits in one rack. A megawatt is the wrong granularity for a kilowatt problem.
        </p>
      </SplitFeature>

      {/* 8 · U-04 HEALTHCARE — canvas, split flipped */}
      <SplitFeature
        imageId="usecase-hospital"
        eyebrow="U-04 · Healthcare"
        title="A utility pad, not"
        accent="clinical space"
        flip
        surface="canvas"
      >
        <p>
          <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Workload.</strong> Imaging
          models, clinical documentation, and research on protected records — cases where governance
          teams want data on infrastructure the institution controls.
        </p>
        <p>
          <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>
            Binding constraint.
          </strong>{" "}
          Hospital estates are chronically short on space and power, and clinical buildings are the
          wrong place for a GPU cluster.
        </p>
        <p>
          <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>
            Where modular helps.
          </strong>{" "}
          A dedicated unit on institution-controlled property keeps training and inference inside
          the organization&apos;s own physical and network perimeter.
        </p>
        <p>
          <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Where it does not.</strong>{" "}
          PODOS claims no healthcare compliance certification. Regulatory review, privacy
          assessment, and accreditation are the operator&apos;s work and run on their own clock;
          smaller inference loads may also fit hardware the institution already owns. The{" "}
          <Link href="/use-cases/healthcare" style={link}>
            healthcare guide
          </Link>{" "}
          takes this further.
        </p>
      </SplitFeature>

      {/* 9 · INK BEAT */}
      <QuoteMetric
        quote="The question is never whether a factory-built unit is impressive. It is whether it relieves the binding constraint — or merely relocates it."
        attribution="UC-01 · The test applied to all eight profiles"
        metric="8"
        label="Profiles, both sides stated"
        field="deploy"
      />

      {/* 10 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="Where modular does not fit"
        lede="Four disqualifiers recur across every vertical, and they are worth naming plainly."
        items={[
          "Small or spiky demand. A megawatt-class unit is the wrong tool for teams still in evaluation, and shared cloud absorbs that phase better.",
          "The absence of a power path. A pod does not create electrons, so a site still needs medium-voltage service, behind-the-meter generation, or a credible interconnection position.",
          <>
            Existing headroom. An organization with usable space, power, and cooling in a facility
            it already runs should price a retrofit before pricing new enclosures — the{" "}
            <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={link}>
              modular vs traditional comparison
            </Link>{" "}
            treats this honestly.
          </>,
          "Operations. Staffing, monitoring, and maintenance do not disappear because the building arrived on a truck.",
          "PODOS is an early-stage company: capacity and timeline figures on this page are design targets, not measured results from operating deployments, and no customer installations, certifications, or accreditations are claimed.",
          "Regulated buyers in particular should treat compliance as their own workstream with its own calendar.",
        ]}
      />

      {/* 11 · CHECKLIST — paper, split */}
      <SplitFeature
        imageId="usecase-edge-site"
        eyebrow="Decision"
        title="Six checks before shortlisting"
        accent="modular"
        surface="paper"
      >
        <ol style={{ listStyle: "none", display: "grid", gap: "1.1rem" }} id="checks">
          {CHECKS.map(([n, t, body]) => (
            <li key={n} style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr", gap: "0.75rem" }}>
              <span className="eyebrow" style={{ paddingTop: "0.25rem" }}>
                {n}
              </span>
              <span>
                <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>{t}.</strong> {body}
              </span>
            </li>
          ))}
        </ol>
        <p style={{ marginTop: "1.5rem" }}>
          If most checks pass, the next steps are the{" "}
          <Link href="/platform/podos-pod" style={link}>
            PODOS Pod unit page
          </Link>{" "}
          for what a unit is, the{" "}
          <Link href="/engineering" style={link}>
            engineering section
          </Link>{" "}
          for how its systems work, and the{" "}
          <Link href="/resources/ai-infrastructure-glossary" style={link}>
            AI infrastructure glossary
          </Link>{" "}
          for the vocabulary used across this site.
        </p>
      </SplitFeature>

      {/* 12 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED — paper */}
      <RelatedRail
        title="Continue"
        surface="paper"
        items={[
          { href: "/platform/podos-pod", label: "PLATFORM", title: "What a PODOS Pod is" },
          { href: "/engineering", label: "ENGINEERING", title: "How the systems work" },
          { href: "/resources/ai-infrastructure-glossary", label: "RESOURCE", title: "AI infrastructure glossary" },
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Test your profile against"
        accent="a real configuration"
        body="Bring the utilization curve, the binding constraint, and the power path. The configurator walks the same variables an engineering review would."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy", label: "See the deployment process" }}
        field="deploy"
      />
    </main>
  );
}
