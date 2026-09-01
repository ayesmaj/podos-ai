/**
 * /use-cases — use-case hub (cluster router, SEO batch 2026-08-31).
 *
 * Server component. Eight vertical profiles, each with workload,
 * binding constraint, and BOTH sides of the fit question (master
 * brief honesty rule). Child vertical pages are upcoming — no links
 * to them yet; this hub links across clusters only.
 *
 * Claims discipline: only publishable ids from src/content/data/claims.ts
 * render, wrapped in data-claim with the required qualifier wording.
 * No compliance certifications implied anywhere (stated explicitly in
 * U-04 / U-05 and the limitations section).
 */

import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import SeoImage from "@/components/seo/SeoImage";
import { TechArticleJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import { buildMetadata } from "@/lib/seo/metadata";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = buildMetadata({
  title: "Modular AI Data Center Use Cases: Fit and Limits — PODOS AI",
  description:
    "Eight profiles for modular AI infrastructure — enterprise, research, healthcare, government, edge, and power producers — and where a pod does not fit.",
  path: "/use-cases",
});

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

/* ---- shared micro-styles (server component — CSS-only hovers) ---- */

const mono: React.CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
};

const microLabel: React.CSSProperties = {
  ...mono,
  fontSize: "0.66rem",
  fontWeight: 600,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
};

const codePill: React.CSSProperties = {
  ...mono,
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  color: "var(--brand-deep)",
  background: "rgba(37, 99, 235, 0.07)",
  border: "1px solid rgba(37, 99, 235, 0.16)",
  borderRadius: 999,
  padding: "0.3rem 0.75rem",
  display: "inline-flex",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <p style={microLabel}>{label}</p>
      <p className="t-body mt-1" style={{ fontSize: "0.95rem" }}>
        {children}
      </p>
    </div>
  );
}

function Figure({
  id,
  caption,
  sizes,
  priority = false,
}: {
  id: string;
  caption: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <figure className="mt-6">
      <SeoImage id={id} priority={priority} sizes={sizes} />
      <figcaption className="mt-3" style={microLabel}>
        {caption}
      </figcaption>
    </figure>
  );
}

function ProfileCard({
  code,
  title,
  children,
}: {
  code: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="panel card-lift p-6 md:p-7">
      <div className="flex items-center gap-3">
        <span style={codePill}>{code}</span>
        <h3
          className="t-body"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "-0.02em",
            color: "var(--ink-strong)",
          }}
        >
          {title}
        </h3>
      </div>
      {children}
    </article>
  );
}

const th: React.CSSProperties = {
  ...microLabel,
  textAlign: "left",
  padding: "0.7rem 0.9rem",
  borderBottom: "1px solid var(--edge-bright)",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "0.65rem 0.9rem",
  borderBottom: "1px solid var(--edge-faint)",
  fontSize: "0.88rem",
  lineHeight: 1.5,
  color: "var(--ink-dim)",
  verticalAlign: "top",
};

const FIT_ROWS = [
  ["U-01", "Enterprise AI", "Fine-tuning + steady inference", "Rack density in existing rooms", "High sustained GPU utilization", "Spiky, experimental demand"],
  ["U-02", "Universities & research", "Shared training queues", "Campus power and cooling", "Funded multi-year cluster demand", "HPC hall with headroom"],
  ["U-03", "Manufacturing", "Inspection + digital twins", "Data gravity at plant sites", "MV service on the estate", "One-rack inference load"],
  ["U-04", "Healthcare", "Imaging + clinical language models", "Data control, constrained estates", "Institution-controlled land", "Compliance path not yet scoped"],
  ["U-05", "Government & secure", "Sovereign or air-gapped AI", "Authorization timelines", "Defined-perimeter requirement", "Data cleared for certified cloud"],
  ["U-06", "Edge", "Regional inference serving", "Thin megawatt-class middle tier", "Metro power near demand", "Kilowatt-scale sites"],
  ["U-07", "Supplemental capacity", "GPU expansion of a full facility", "Live-hall retrofit disruption", "Campus land plus spare power", "Stranded in-hall capacity"],
  ["U-08", "Power producers", "Compute at the generation source", "Interconnection queues", "Curtailed or queued megawatts", "Intermittent supply, no storage"],
];

export default function UseCasesPage() {
  return (
    <>
      <SiteHeader />
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="Modular AI Data Center Use Cases: Fit and Limits"
        description="Eight use-case profiles for modular AI infrastructure, each with workload pattern, binding constraint, and an honest account of where a factory-built unit fits and where it does not."
        path="/use-cases"
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="Article"
      />

      {/* ---- Compact hero ---- */}
      <header
        className="container-site"
        style={{
          paddingTop: "clamp(6.5rem, 12vh, 9rem)",
          paddingBottom: "clamp(2.5rem, 5vh, 4rem)",
        }}
      >
        <Breadcrumbs
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Use cases", path: "/use-cases" },
          ]}
        />

        <p
          className="mt-8 inline-flex items-center gap-2"
          style={{
            ...mono,
            fontSize: "0.78rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--brand-deep)",
            background: "var(--glass-bg-strong)",
            border: "1px solid var(--edge-bright)",
            borderRadius: 999,
            padding: "0.4rem 0.9rem",
          }}
        >
          <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>UC-01</span>
          <span style={{ opacity: 0.4 }}>·</span>
          USE CASES
        </p>

        <h1 className="t-headline mt-6" style={{ maxWidth: "20ch" }}>
          Where modular AI infrastructure{" "}
          <span className="t-sweep-brand">fits</span> — and where it does not
        </h1>

        <p className="t-lede mt-6" style={{ maxWidth: "62ch" }}>
          Modular AI infrastructure fits organizations that need dedicated GPU capacity
          on their own terms — their site, their power, their data — and cannot wait
          years for a conventional facility. It fits poorly where demand is small or
          intermittent, where no realistic power path exists, or where an existing data
          center still has headroom.
        </p>

        <div className="mt-8">
          <LastVerified
            published="2026-08-31"
            lastVerified="2026-08-31"
            author="Josef Elimelech"
            reviewer="PODOS AI Engineering"
          />
        </div>
      </header>

      {/* ---- Framing ---- */}
      <section className="container-site" style={{ paddingBottom: "clamp(2rem, 4vh, 3rem)" }}>
        <div style={{ maxWidth: "72ch" }}>
          <h2 className="t-headline" style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)" }}>
            The pattern behind every profile
          </h2>
          <p className="t-body mt-4">
            Demand for dedicated AI capacity is broad-based, not a hyperscaler
            phenomenon. U.S. data centers consumed about 4.4% of national electricity in
            2023, with Lawrence Berkeley National Laboratory projecting 6.7–12% by 2028
            <Cite n={1} />, and the IEA expects global data-centre electricity use to
            roughly double toward ~945 TWh by 2030, driven largely by AI
            <Cite n={2} />. Yet the facilities most organizations already operate were
            not built for this: the Uptime Institute&apos;s 2025 operator survey places
            typical rack densities in the 10–30 kW band, well below what dense GPU nodes
            draw <Cite n={3} />.
          </p>
          <p className="t-body mt-4">
            Every profile below therefore turns on the same three questions: what the
            workload actually is, which constraint binds first — power, cooling, space,
            data governance, or time — and whether a factory-built unit like the one
            described on the{" "}
            <Link href="/platform" style={{ color: "var(--brand)", textDecoration: "underline" }}>
              platform overview
            </Link>{" "}
            relieves that constraint or merely relocates it. These are workload
            profiles and design intent, not customer references: PODOS is an
            early-stage company, and no deployments, customers, or certifications are
            claimed on this page.
          </p>

          <Figure
            id="usecase-campus"
            priority
            sizes="(max-width: 768px) 100vw, 720px"
            caption="Conceptual siting — a unit placed on institutional land near existing infrastructure (profile U-02)"
          />
        </div>
      </section>

      {/* ---- Fit table ---- */}
      <section
        className="section-pad"
        style={{ background: "var(--canvas)", borderTop: "1px solid var(--edge-faint)" }}
      >
        <div className="container-site">
          <h2 className="t-headline" style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)" }}>
            Fit at a glance
          </h2>
          <p className="t-body mt-3" style={{ maxWidth: "62ch" }}>
            A strong fit signal is a reason to read the matching profile; a weak fit
            signal is a reason to stop before spending engineering time.
          </p>
          <div className="overflow-x-auto mt-6 panel" style={{ padding: "0.4rem" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 880 }}>
              <thead>
                <tr>
                  <th style={th} scope="col">Code</th>
                  <th style={th} scope="col">Profile</th>
                  <th style={th} scope="col">Typical workload</th>
                  <th style={th} scope="col">Binding constraint</th>
                  <th style={th} scope="col">Strong fit signal</th>
                  <th style={th} scope="col">Weak fit signal</th>
                </tr>
              </thead>
              <tbody>
                {FIT_ROWS.map((r) => (
                  <tr key={r[0]}>
                    <td style={{ ...td, ...mono, color: "var(--brand-deep)", fontSize: "0.78rem" }}>{r[0]}</td>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 600 }}>{r[1]}</td>
                    <td style={td}>{r[2]}</td>
                    <td style={td}>{r[3]}</td>
                    <td style={td}>{r[4]}</td>
                    <td style={td}>{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---- Profiles ---- */}
      <section className="section-pad" style={{ borderTop: "1px solid var(--edge-faint)" }}>
        <div className="container-site">
          <h2 className="t-headline" style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)" }}>
            Use-case profiles
          </h2>
          <p className="t-body mt-3" style={{ maxWidth: "62ch" }}>
            Each profile states both sides of the fit question. Dedicated pages per
            vertical are in preparation; until they publish, this hub is the reference.
          </p>

          <div className="grid gap-5 md:grid-cols-2 mt-8">
            <ProfileCard code="U-01" title="Enterprise AI">
              <Row label="Workload">
                Sustained fine-tuning and internal inference on proprietary data — the
                pattern where reserved cloud GPU commitments run at high utilization
                month after month.
              </Row>
              <Row label="Binding constraint">
                Corporate server rooms were provisioned for single-digit-kW racks
                <Cite n={3} />, and retrofitting one for{" "}
                <Link href="/engineering/direct-to-chip-liquid-cooling" style={{ color: "var(--brand)", textDecoration: "underline" }}>
                  direct-to-chip liquid cooling
                </Link>{" "}
                is often a larger project than the cluster itself.
              </Row>
              <Row label="Where modular helps">
                A dedicated unit on company or leased industrial land gives the cluster
                a purpose-built envelope.{" "}
                <span data-claim="unit-capacity-1mw">
                  Each PODOS Pod is designed as a standardized 1 MW building block
                </span>
                ,{" "}
                <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so
                capacity planning stays arithmetic — units, not bespoke halls.
              </Row>
              <Row label="Where it does not">
                Bursty experimentation and workloads that idle most of the week. If a
                megawatt cannot be kept busy, shared cloud remains the honest default.
              </Row>
            </ProfileCard>

            <ProfileCard code="U-02" title="Universities & research">
              <Row label="Workload">
                Many principal investigators sharing one scheduler; long training
                queues; hardware funded in discrete grant awards.
              </Row>
              <Row label="Binding constraint">
                Campus machine rooms rarely hold spare megawatts or liquid-cooling
                loops, and new academic buildings move at capital-planning speed.
              </Row>
              <Row label="Where modular helps">
                A self-contained unit sited near existing campus electrical
                infrastructure hands facilities teams a fixed, documented envelope —
                power in, heat out — instead of an open-ended construction program.
              </Row>
              <Row label="Where it does not">
                Institutions whose HPC hall still has power and cooling headroom;
                expanding in place is usually cheaper. Funding rules that favor
                operating spend over capital purchases also point back to cloud
                credits.
              </Row>
            </ProfileCard>

            <ProfileCard code="U-03" title="Manufacturing">
              <Row label="Workload">
                Vision inspection, defect detection, digital-twin simulation, and
                process optimization — heavy inference near the line plus periodic
                retraining on plant telemetry.
              </Row>
              <Row label="Binding constraint">
                Data gravity. Plants generate more camera and sensor data than is
                economical to backhaul, and industrial estates have power but no data
                hall.
              </Row>
              <Row label="Where modular helps">
                Many industrial sites already take medium-voltage service — the class
                of input the pod&apos;s{" "}
                <Link href="/engineering/data-center-power-architecture" style={{ color: "var(--brand)", textDecoration: "underline" }}>
                  power architecture
                </Link>{" "}
                is designed around — so a unit can sit on the same estate as the
                machines it serves.
              </Row>
              <Row label="Where it does not">
                Batch analytics that tolerate a round trip to a cloud region, or a
                single line whose inference fits in one rack. A megawatt is the wrong
                granularity for a kilowatt problem.
              </Row>
              <Figure
                id="usecase-factory"
                sizes="(max-width: 768px) 100vw, 560px"
                caption="Conceptual siting — a unit on the industrial estate it serves"
              />
            </ProfileCard>

            <ProfileCard code="U-04" title="Healthcare">
              <Row label="Workload">
                Imaging models, clinical documentation, and research on protected
                records — cases where governance teams want data on infrastructure the
                institution controls.
              </Row>
              <Row label="Binding constraint">
                Hospital estates are chronically short on space and power, and clinical
                buildings are the wrong place for a GPU cluster.
              </Row>
              <Row label="Where modular helps">
                A dedicated unit on institution-controlled property keeps training and
                inference inside the organization&apos;s own physical and network
                perimeter.
              </Row>
              <Row label="Where it does not">
                PODOS claims no healthcare compliance certification. Regulatory review,
                privacy assessment, and accreditation are the operator&apos;s work and
                run on their own clock; smaller inference loads may also fit hardware
                the institution already owns.
              </Row>
              <Figure
                id="usecase-hospital"
                sizes="(max-width: 768px) 100vw, 560px"
                caption="Conceptual siting — a utility pad on institution-controlled property, outside clinical space"
              />
            </ProfileCard>

            <ProfileCard code="U-05" title="Government & secure">
              <Row label="Workload">
                Training and inference under sovereignty, air-gap, or controlled-access
                requirements that rule out shared cloud regions.
              </Row>
              <Row label="Binding constraint">
                Procurement and facility-authorization timelines dominate; a program
                can hold budget for compute yet wait years for an approved place to put
                it.
              </Row>
              <Row label="Where modular helps">
                A physically bounded unit gives security teams a defined perimeter to
                assess — one enclosure, one power feed, documented ingress — rather
                than a shared hall.
              </Row>
              <Row label="Where it does not">
                Modular construction shortens the building, not the authorization.
                PODOS claims no government accreditation, and programs whose data can
                lawfully run in certified cloud regions may find that path faster.
              </Row>
            </ProfileCard>

            <ProfileCard code="U-06" title="Edge">
              <Row label="Workload">
                Regional inference serving — models placed near users or data sources
                rather than in a distant region.
              </Row>
              <Row label="Binding constraint">
                The middle tier is thin: device-level edge AI and hyperscale regions
                are both well served, while megawatt-class capacity in secondary metros
                is scarce.
              </Row>
              <Row label="Where modular helps">
                A unit designed to be relocatable can occupy that middle tier where
                metro power exists — and move if demand does.
              </Row>
              <Row label="Where it does not">
                True edge sites measured in kilowatts — a closet rack, not a pod. Any
                latency benefit is workload-specific and should be measured before
                committing; no general number honestly applies.
              </Row>
              <Figure
                id="usecase-edge-site"
                sizes="(max-width: 768px) 100vw, 560px"
                caption="Conceptual siting — a self-contained unit at a remote site with local generation nearby"
              />
            </ProfileCard>

            <ProfileCard code="U-07" title="Supplemental capacity">
              <Row label="Workload">
                An operator whose existing halls are out of power or cooling headroom
                for GPU racks, with demand still arriving.
              </Row>
              <Row label="Binding constraint">
                Retrofitting a live hall for high-density liquid cooling disrupts
                tenants and takes floor space out of service.
              </Row>
              <Row label="Where modular helps">
                Added capacity beside the existing facility, on the same campus and
                network, while the main hall keeps running.{" "}
                <span data-claim="deployment-window">
                  PODOS targets a 90-day window from order to commissioning for a
                  standard unit
                </span>{" "}
                — the{" "}
                <Link href="/deploy" style={{ color: "var(--brand)", textDecoration: "underline" }}>
                  deployment process
                </Link>{" "}
                is documented separately.
              </Row>
              <Row label="Where it does not">
                Halls with stranded power and empty white space are often better served
                by a targeted retrofit — run that comparison before adding enclosures.
              </Row>
            </ProfileCard>

            <ProfileCard code="U-08" title="Power producers & stranded energy">
              <Row label="Workload">
                Turning curtailed, queued, or under-contracted generation into a
                sellable compute product by colocating AI capacity at the source.
              </Row>
              <Row label="Binding constraint">
                Interconnection queues run years, and the IEA reports grid-connection
                bottlenecks tightening even as data-centre electricity use surged in
                2025 <Cite n={5} />.
              </Row>
              <Row label="Where modular helps">
                Compute placed behind the meter consumes power where it is generated,
                and NREL has demonstrated data centers operating as flexible grid
                assets, including a 70 MW grid-interactive facility <Cite n={4} />. A
                unit-sized building block is intended to be matched to generation
                blocks rather than forcing a monolithic campus.
              </Row>
              <Row label="Where it does not">
                Sites without a workable fiber path, or highly intermittent generation
                without storage. Compute economics depend on sustained utilization; a
                resource that runs a few hundred hours a year cannot carry a cluster.
              </Row>
            </ProfileCard>
          </div>
        </div>
      </section>

      {/* ---- Honest limitations ---- */}
      <section
        className="section-pad"
        style={{ background: "var(--canvas)", borderTop: "1px solid var(--edge-faint)" }}
      >
        <div className="container-site" style={{ maxWidth: 1280 }}>
          <h2 className="t-headline" style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)" }}>
            Where modular does not fit
          </h2>
          <div className="t-body mt-4" style={{ maxWidth: "72ch" }}>
            <p>
              Four disqualifiers recur across every vertical, and they are worth naming
              plainly. First, small or spiky demand: a megawatt-class unit is the wrong
              tool for teams still in evaluation, and shared cloud absorbs that phase
              better. Second, the absence of a power path — a pod does not create
              electrons, so a site still needs medium-voltage service, behind-the-meter
              generation, or a credible interconnection position. Third, existing
              headroom: an organization with usable space, power, and cooling in a
              facility it already runs should price a retrofit before pricing new
              enclosures — the{" "}
              <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={{ color: "var(--brand)", textDecoration: "underline" }}>
                modular vs traditional comparison
              </Link>{" "}
              treats this honestly. Fourth, operations: staffing, monitoring, and
              maintenance do not disappear because the building arrived on a truck.
            </p>
            <p className="mt-4">
              One structural note applies to everything above. PODOS is an early-stage
              company: capacity and timeline figures on this page are design targets,
              not measured results from operating deployments, and no customer
              installations, certifications, or accreditations are claimed. Regulated
              buyers in particular should treat compliance as their own workstream with
              its own calendar.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Decision checklist ---- */}
      <section className="section-pad" style={{ borderTop: "1px solid var(--edge-faint)" }}>
        <div className="container-site">
          <h2 className="t-headline" style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)" }}>
            Six checks before shortlisting modular
          </h2>
          <ol className="panel mt-6 p-6 md:p-8 grid gap-4" style={{ maxWidth: "76ch" }}>
            {[
              ["01", "Utilization", "Can you keep a megawatt-class unit productive most of the year — or aggregate workloads across teams until you can?"],
              ["02", "Power path", "Do you have existing medium-voltage service, behind-the-meter generation, or a credible interconnection position?"],
              ["03", "Site", "Is there a pad, delivery access, and a fiber route your network team accepts?"],
              ["04", "Data reason", "Is there a governance, gravity, or sovereignty reason to leave shared cloud — or only a cost hypothesis?"],
              ["05", "Operating model", "Who runs the unit on day 2, and with what monitoring and maintenance arrangement?"],
              ["06", "The alternative", "Have you scored modular against a retrofit of what you have and against traditional construction?"],
            ].map(([n, t, body]) => (
              <li key={n} className="flex gap-4">
                <span style={{ ...mono, fontWeight: 600, color: "var(--cyan-deep)", fontSize: "0.8rem", paddingTop: "0.2rem" }}>
                  {n}
                </span>
                <p className="t-body" style={{ fontSize: "0.95rem" }}>
                  <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>{t}.</strong>{" "}
                  {body}
                </p>
              </li>
            ))}
          </ol>
          <p className="t-body mt-5" style={{ maxWidth: "72ch" }}>
            If most checks pass, the next steps are the{" "}
            <Link href="/platform/podos-pod" style={{ color: "var(--brand)", textDecoration: "underline" }}>
              PODOS Pod unit page
            </Link>{" "}
            for what a unit is, the{" "}
            <Link href="/engineering" style={{ color: "var(--brand)", textDecoration: "underline" }}>
              engineering section
            </Link>{" "}
            for how its systems work, and the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={{ color: "var(--brand)", textDecoration: "underline" }}>
              AI infrastructure glossary
            </Link>{" "}
            for the vocabulary used across this site.
          </p>

          <EvidenceSourceRail sources={SOURCES} />
        </div>
      </section>
    </main>
      <Footer />
    </>
  );
}
