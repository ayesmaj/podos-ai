import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import { FAQJsonLd, TechArticleJsonLd } from "@/components/seo/jsonld";
import LastVerified from "@/components/seo/LastVerified";
import SeoImage from "@/components/seo/SeoImage";
import Footer from "@/components/site/Footer";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * /deploy — deployment cluster hub (SEO batch, server component).
 * Six-stage deployment overview. Styling: main-site light technical
 * system only (globals.css tokens + Tailwind utilities). Claims are
 * gated through src/content/data/claims.ts via data-claim attributes.
 */

const TITLE = "Modular AI Data Center Deployment: The Six Stages | PODOS AI";
const DESCRIPTION =
  "How a factory-built modular AI data center is deployed: six stages from site and power readiness to operations, and the 90-day target window explained.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/deploy",
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

const STAGES = [
  { code: "DP-01", name: "Site & power readiness", focus: "Confirm power, permits, ground, access, network", owner: "Owner / operator + utility", exit: "Power path and permit scope confirmed" },
  { code: "DP-02", name: "Configuration", focus: "Fix the build specification from a bounded menu", owner: "Owner + PODOS", exit: "Configuration freeze signed" },
  { code: "DP-03", name: "Factory build & testing", focus: "Assembly, integration, burn-in on the line", owner: "PODOS factory", exit: "Factory acceptance test passed" },
  { code: "DP-04", name: "Transport & placement", focus: "Ship as heavy freight, rig, set, connect", owner: "Logistics + site crew", exit: "Unit set and mechanically connected" },
  { code: "DP-05", name: "Commissioning", focus: "Energize, verify, load-test on site power", owner: "Commissioning team", exit: "Site acceptance test passed" },
  { code: "DP-06", name: "Operations", focus: "Monitor, maintain, grow unit by unit", owner: "Operator", exit: "Ongoing" },
];

/* FAQ — the visible answers and the JSON-LD payload share these strings. */
const FAQ_1_CLAIM =
  "PODOS targets a 90-day window from order to commissioning for a standard unit.";
const FAQ_1_REST =
  "The target assumes a ready site; in practice the calendar is set by site power availability, permitting, and transport, so the honest answer for a specific project starts with a site and power assessment.";
const FAQ_ITEMS = [
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

/* --------------------------------------------------------------- styles */

const mono: CSSProperties = { fontFamily: "var(--font-geist-mono), monospace" };

const h2Style: CSSProperties = {
  fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
  fontWeight: 800,
  fontSize: "clamp(1.65rem, 3.2vw, 2.4rem)",
  lineHeight: 1.06,
  letterSpacing: "-0.035em",
  color: "var(--ink-strong)",
};

const proseStyle: CSSProperties = { maxWidth: "70ch", color: "var(--ink-dim)" };

const linkStyle: CSSProperties = {
  color: "var(--brand-deep)",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  textDecorationColor: "rgba(37, 99, 235, 0.35)",
};

const codePillStyle: CSSProperties = {
  ...mono,
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  color: "var(--brand-deep)",
  background: "rgba(37, 99, 235, 0.07)",
  border: "1px solid rgba(37, 99, 235, 0.16)",
  borderRadius: 999,
  padding: "0.3rem 0.75rem",
};

const thStyle: CSSProperties = {
  ...mono,
  fontSize: "0.66rem",
  fontWeight: 600,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
  textAlign: "left",
  padding: "0.7rem 0.9rem",
  borderBottom: "1px solid var(--edge-bright)",
  whiteSpace: "nowrap",
};

const tdStyle: CSSProperties = {
  fontSize: "0.92rem",
  lineHeight: 1.55,
  color: "var(--ink-dim)",
  padding: "0.75rem 0.9rem",
  borderBottom: "1px solid var(--edge)",
  verticalAlign: "top",
};

const captionStyle: CSSProperties = {
  ...mono,
  fontSize: "0.74rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--ink-faint)",
};

function Figure({
  id,
  caption,
  priority = false,
}: {
  id: string;
  caption: string;
  priority?: boolean;
}) {
  return (
    <figure style={{ margin: 0, maxWidth: "760px", width: "100%" }}>
      <SeoImage id={id} priority={priority} sizes="(max-width: 768px) 100vw, 720px" />
      <figcaption className="mt-3" style={captionStyle}>
        {caption}
      </figcaption>
    </figure>
  );
}

function StageSection({
  code,
  title,
  children,
}: {
  code: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={code.toLowerCase()}
      className="section-pad"
      style={{ borderTop: "1px solid var(--edge-faint)", scrollMarginTop: "96px", paddingBlock: "clamp(2.6rem, 5vh, 4rem)" }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span style={codePillStyle}>{code}</span>
        <h2 style={h2Style}>{title}</h2>
      </div>
      <div className="mt-5 grid gap-4 t-body" style={proseStyle}>
        {children}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- page */

export default function DeployPage() {
  return (
    <>
      <TechArticleJsonLd
        headline="How a modular AI data center gets deployed: the six stages"
        description={DESCRIPTION}
        path="/deploy"
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
      />
      <FAQJsonLd items={FAQ_ITEMS} />

      <main style={{ background: "var(--paper)", color: "var(--ink-strong)" }}>
        {/* ---- Compact hero ---- */}
        <section
          style={{
            background:
              "radial-gradient(ellipse at 75% -10%, rgba(34,211,238,0.10), rgba(37,99,235,0.04) 55%, transparent 75%), var(--paper)",
            borderBottom: "1px solid var(--edge-faint)",
          }}
        >
          <div
            className="container-site"
            style={{ paddingBlock: "clamp(5.5rem, 12vh, 8rem) clamp(2.8rem, 6vh, 4.5rem)" }}
          >
            <Breadcrumbs
              crumbs={[
                { name: "Home", path: "/" },
                { name: "Deploy", path: "/deploy" },
              ]}
            />

            <p className="mt-8">
              <span
                style={{
                  ...mono,
                  fontSize: "0.78rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--brand-deep)",
                  background: "var(--glass-bg-strong)",
                  border: "1px solid var(--edge-bright)",
                  borderRadius: 999,
                  padding: "0.45rem 0.95rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.55rem",
                }}
              >
                <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>DEP-01</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>Deployment</span>
              </span>
            </p>

            <h1 className="t-headline mt-6" style={{ maxWidth: "24ch" }}>
              How a modular AI data center gets <span className="t-sweep-brand">deployed</span>
            </h1>

            <p className="t-lede mt-6" style={{ maxWidth: "62ch", color: "var(--ink-dim)" }}>
              Deploying a factory-built modular AI data center is a six-stage process: site and
              power readiness, configuration, factory build and testing, transport and placement,
              commissioning, and operations. The stages overlap — the unit is built and tested in a
              factory while the site is prepared in parallel, which is why{" "}
              <span data-claim="deployment-window">
                PODOS targets a 90-day window from order to commissioning for a standard unit
              </span>
              .
            </p>

            <p className="t-body mt-4" style={{ maxWidth: "62ch", color: "var(--ink-dim)" }}>
              This page is the overview: what each stage covers, who owns it, what must be true
              before the next stage starts, and where the schedule risk actually lives. Each{" "}
              <Link href="/platform/podos-pod" style={linkStyle}>
                PODOS Pod
              </Link>{" "}
              is{" "}
              <span data-claim="unit-capacity-1mw">
                designed as a standardized 1-MW building block
              </span>{" "}
              and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so the process
              repeats per unit rather than being re-engineered per project.
            </p>

            <div className="mt-8">
              <Figure
                id="deploy-pad-prep"
                priority
                caption="Stage one — a prepared pad with anchor points and conduit stub-ups, before the unit arrives"
              />
            </div>

            <div className="mt-8">
              <LastVerified
                published="2026-08-31"
                lastVerified="2026-08-31"
                author="Josef Elimelech"
                reviewer="PODOS AI Engineering"
              />
            </div>
          </div>
        </section>

        <div className="container-site">
          {/* ---- Stage index table ---- */}
          <section
            className="section-pad"
            style={{ paddingBlock: "clamp(2.8rem, 6vh, 4.5rem) clamp(2.2rem, 4vh, 3rem)" }}
          >
            <h2 style={h2Style}>The six stages at a glance</h2>
            <div className="mt-6 overflow-x-auto panel" style={{ padding: 0 }}>
              <table style={{ width: "100%", minWidth: 760, borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Code</th>
                    <th style={thStyle}>Stage</th>
                    <th style={thStyle}>What happens</th>
                    <th style={thStyle}>Primary owner</th>
                    <th style={thStyle}>Exit criterion</th>
                  </tr>
                </thead>
                <tbody>
                  {STAGES.map((s, i) => (
                    <tr key={s.code}>
                      <td style={{ ...tdStyle, ...mono, fontSize: "0.78rem", fontWeight: 600, color: "var(--brand-deep)", ...(i === STAGES.length - 1 ? { borderBottom: "none" } : {}) }}>
                        {s.code}
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 600, color: "var(--ink-strong)", ...(i === STAGES.length - 1 ? { borderBottom: "none" } : {}) }}>{s.name}</td>
                      <td style={{ ...tdStyle, ...(i === STAGES.length - 1 ? { borderBottom: "none" } : {}) }}>{s.focus}</td>
                      <td style={{ ...tdStyle, ...(i === STAGES.length - 1 ? { borderBottom: "none" } : {}) }}>{s.owner}</td>
                      <td style={{ ...tdStyle, ...(i === STAGES.length - 1 ? { borderBottom: "none" } : {}) }}>{s.exit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4" style={{ ...mono, fontSize: "0.74rem", letterSpacing: "0.08em", color: "var(--ink-faint)", textTransform: "uppercase" }}>
              Detailed per-stage guides · upcoming — this page is the overview
            </p>
          </section>

          {/* ---- DP-01 ---- */}
          <StageSection code="DP-01" title="Site & power readiness">
            <p>
              Everything starts with power. A modular unit removes construction from the critical
              path, but it cannot manufacture electrons: the site needs megawatt-class power
              available, or a credible path to it, before anything else matters. The IEA reports
              that data-centre electricity use surged in 2025 while grid-connection bottlenecks
              tightened
              <Cite n={1} />, and Lawrence Berkeley National Laboratory estimates US data centers
              consumed 4.4% of US electricity in 2023, projected to reach 6.7–12% by 2028
              <Cite n={2} />. Competition for grid capacity is structural, not cyclical — which is
              why this stage comes first and owns the real calendar.
            </p>
            <p>Readiness means answering a short list of questions honestly before an order is placed:</p>
            <div className="panel" style={{ padding: "1.25rem 1.4rem" }}>
              <ul className="grid gap-3" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {[
                  ["Power", <>Is megawatt-class capacity available at the site today — an existing service, an on-site source, or an executed interconnection agreement? The <Link href="/engineering/data-center-power-architecture" style={linkStyle}>power-architecture explainer</Link> covers how medium-voltage input becomes rack power.</>],
                  ["Permits", <>What does the local jurisdiction require for a placed, factory-built unit — electrical work under the National Electrical Code (NFPA 70)<Cite n={3} />, and stationary energy-storage rules under NFPA 855 if batteries are in scope<Cite n={4} />?</>],
                  ["Ground", <>Is there a level, load-rated surface — pad or engineered foundation — with drainage?</>],
                  ["Access", <>Can heavy road freight reach the placement point: turning radii, overhead clearance, crane or rigging position?</>],
                  ["Network", <>Is there a data path — fiber or wireless backhaul — matched to the intended workloads?</>],
                ].map(([label, body]) => (
                  <li key={label as string} className="grid gap-1">
                    <span style={{ ...mono, fontSize: "0.66rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--brand-deep)" }}>
                      {label}
                    </span>
                    <span style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>{body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </StageSection>

          {/* ---- DP-02 ---- */}
          <StageSection code="DP-02" title="Configuration">
            <p>
              Configuration fixes the build specification before the factory starts. Because the
              unit is standardized, this is a bounded menu rather than a design project: the GPU
              platform installed at integration, the electrical service arrangement at the site
              boundary, the heat-rejection option, the network handoff, and the operating model —
              who monitors and who maintains. The output is a configuration freeze: a signed
              specification the factory builds against and the reference every later acceptance
              test uses. What is deliberately not on the menu is the core architecture — enclosure,
              cooling loop, power distribution — which stays identical across units. The{" "}
              <Link href="/platform/podos-pod" style={linkStyle}>
                PODOS Pod page
              </Link>{" "}
              describes what is inside that fixed architecture.
            </p>
          </StageSection>

          {/* ---- DP-03 ---- */}
          <StageSection code="DP-03" title="Factory build & testing">
            <p>
              The factory stage is where the modular model earns its schedule. Structure, power
              distribution, the closed-loop{" "}
              <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
                direct-to-chip liquid-cooling
              </Link>{" "}
              circuit, racks, and networking are assembled and integrated on a production line
              instead of being sequenced as separate trades on a construction site. Integration
              testing happens before shipment: point-to-point electrical verification, pressure and
              flow testing of the coolant loop, controls and safety interlocks exercised end to
              end, and burn-in of installed IT under load. The exit gate is a factory acceptance
              test against the configuration freeze.
            </p>
            <p>
              Factory testing has a real limit, and the commissioning stage exists to close it: it
              validates the unit against factory power and factory conditions — not against your
              utility, your grounding system, or your climate.
            </p>
          </StageSection>

          {/* ---- DP-04 ---- */}
          <StageSection code="DP-04" title="Transport & placement">
            <p>
              While the factory builds, the site is prepared: pad, conduit runs, service
              connections. This parallelism is the schedule mechanism — the two longest
              workstreams run at the same time instead of one after the other. The finished unit
              then ships as heavy road freight, is rigged onto the prepared surface, and is
              connected mechanically: power terminations, heat-rejection connections, network.
            </p>
            <p>
              Placement is measured in days rather than months because nothing is being
              constructed on site — the unit arrives as a tested machine, and site work is limited
              to connections. The units are designed to be relocatable, so a later move follows
              the same steps in reverse.
            </p>
            <Figure
              id="deploy-crane-lift"
              caption="DP-04 — the unit is rigged and set onto the prepared surface"
            />
          </StageSection>

          {/* ---- DP-05 ---- */}
          <StageSection code="DP-05" title="Commissioning">
            <p>
              Commissioning proves the unit on real site power under real load. The sequence is
              conventional critical-facility practice applied to a factory-tested machine: staged
              energization with protection and grounding verification, cooling-loop verification
              against the thermal envelopes the IT equipment is specified for — ASHRAE&rsquo;s
              thermal guidelines define the environmental classes commissioning verifies against
              <Cite n={5} /> — then integrated load testing and deliberate failure-mode exercises
              (loss of a power path, loss of heat rejection) before workloads are admitted.
              Reliability analysis of the site&rsquo;s electrical distribution follows established
              practice such as the IEEE 3006 series
              <Cite n={6} />.
            </p>
            <p>
              The discipline matters. In Uptime Institute&rsquo;s 2025 global survey, roughly half
              of operators reported an outage with meaningful impact within the previous three
              years
              <Cite n={7} />. A factory-tested unit shortens commissioning; it does not replace it.
              The exit gate is a site acceptance test, after which the unit enters operations.
            </p>
            <Figure
              id="deploy-commission-check"
              caption="DP-05 — systems checked at the open service bay on site power"
            />
          </StageSection>

          {/* ---- DP-06 ---- */}
          <StageSection code="DP-06" title="Operations">
            <p>
              Operations is the longest stage and the least discussed. It covers monitoring —
              power, thermals, coolant-loop health, IT telemetry — plus preventive maintenance on
              pumps, filtration, and heat-rejection equipment, a spares strategy, and physical
              security. Industry rack densities keep rising: Uptime Institute&rsquo;s 2025 survey
              reports typical densities moving into the 10–30 kW band
              <Cite n={7} />, which is why the liquid loop is maintained as a first-class system
              rather than an afterthought.
            </p>
            <p>
              Growth is additive. Because each unit is{" "}
              <span data-claim="unit-capacity-1mw">
                designed as a standardized 1-MW building block
              </span>
              , capacity scales by repeating the same six stages for the next unit instead of
              re-entering a construction program. Which organizations this model fits is covered in
              the{" "}
              <Link href="/use-cases" style={linkStyle}>
                use-cases overview
              </Link>
              ; how it differs from a conventional build is covered in the{" "}
              <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>
                modular-vs-traditional comparison
              </Link>
              .
            </p>
          </StageSection>

          {/* ---- 90-day target ---- */}
          <section className="section-pad" style={{ borderTop: "1px solid var(--edge-faint)", paddingBlock: "clamp(2.6rem, 5vh, 4rem)" }}>
            <h2 style={h2Style}>
              Where the <span data-claim="deployment-window">90-day target</span> comes from
            </h2>
            <div className="mt-5 grid gap-4 t-body" style={proseStyle}>
              <p>
                <span data-claim="deployment-window">
                  PODOS targets a 90-day window from order to commissioning for a standard unit.
                </span>{" "}
                The target is arithmetic, not optimism: the factory stage and site preparation run
                concurrently, transport and placement are measured in days, and commissioning
                verifies a machine that has already passed a factory acceptance test rather than
                debugging a first-of-a-kind assembly.
              </p>
              <p>
                Three dependencies sit outside the target and can extend it: power availability at
                the site (the dominant variable), permitting timelines in the local jurisdiction,
                and transport distance and routing. The target is a design goal for a standard unit
                on a ready site — it is not a measured deployment statistic, and PODOS does not
                publish deployment counts or completed-project timelines at this stage.
              </p>
            </div>
          </section>

          {/* ---- Limitations ---- */}
          <section className="section-pad" style={{ borderTop: "1px solid var(--edge-faint)", paddingBlock: "clamp(2.6rem, 5vh, 4rem)" }}>
            <h2 style={h2Style}>Limitations and open variables</h2>
            <ul className="mt-5 grid gap-3 t-body" style={{ ...proseStyle, paddingLeft: "1.2rem", listStyle: "disc" }}>
              <li>
                The <span data-claim="deployment-window">90-day window</span> and the{" "}
                <span data-claim="unit-capacity-1mw">1-MW unit capacity</span> are company targets, not measured
                results from completed deployments. No deployment counts or customer projects are
                published.
              </li>
              <li>
                Site power availability dominates the real calendar and sits outside any
                vendor&rsquo;s control. A site without a power path has an indeterminate timeline
                regardless of how fast the unit is built.
              </li>
              <li>
                Permitting is jurisdiction-specific. A placed, factory-built unit typically narrows
                the construction-permitting scope, but it does not remove electrical, fire, or
                zoning review.
              </li>
              <li>
                Factory acceptance testing validates the unit against factory conditions.
                Site-specific risks — utility power quality, grounding, climate extremes — are only
                retired at commissioning.
              </li>
              <li>
                This page describes single-unit deployment. Multi-unit sites add shared-infrastructure
                decisions this overview does not cover.
              </li>
            </ul>
          </section>

          {/* ---- FAQ ---- */}
          <section className="section-pad" style={{ borderTop: "1px solid var(--edge-faint)", paddingBlock: "clamp(2.6rem, 5vh, 4rem)" }}>
            <h2 style={h2Style}>Deployment FAQ</h2>
            <div className="mt-6 grid gap-4" style={{ maxWidth: "70ch" }}>
              <div className="panel card-lift" style={{ padding: "1.25rem 1.4rem" }}>
                <h3 className="t-body" style={{ fontWeight: 600, color: "var(--ink-strong)" }}>{FAQ_ITEMS[0].q}</h3>
                <p className="t-body mt-2" style={{ color: "var(--ink-dim)" }}>
                  <span data-claim="deployment-window">{FAQ_1_CLAIM}</span> {FAQ_1_REST}
                </p>
              </div>
              {FAQ_ITEMS.slice(1).map((f) => (
                <div key={f.q} className="panel card-lift" style={{ padding: "1.25rem 1.4rem" }}>
                  <h3 className="t-body" style={{ fontWeight: 600, color: "var(--ink-strong)" }}>{f.q}</h3>
                  <p className="t-body mt-2" style={{ color: "var(--ink-dim)" }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---- Related + sources ---- */}
          <section className="section-pad" style={{ borderTop: "1px solid var(--edge-faint)", paddingBlock: "clamp(2.6rem, 5vh, 4rem) clamp(4rem, 8vh, 6rem)" }}>
            <p className="t-body" style={proseStyle}>
              Deployment is one leg of the platform. The{" "}
              <Link href="/platform" style={linkStyle}>
                platform overview
              </Link>{" "}
              covers the full architecture, the{" "}
              <Link href="/engineering" style={linkStyle}>
                engineering hub
              </Link>{" "}
              covers the systems each stage exercises, and investors evaluating the model can
              review the{" "}
              <Link href="/invest" style={linkStyle}>
                investor page
              </Link>
              .
            </p>
            <EvidenceSourceRail sources={SOURCES} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
