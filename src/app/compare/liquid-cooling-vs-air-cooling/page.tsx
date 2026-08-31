/**
 * /compare/liquid-cooling-vs-air-cooling
 *
 * Comparison page (compare cluster). Server component — all copy in the
 * initial HTML, CSS-only hovers, no client JS. Styled with the MAIN site
 * light technical system (docs/seo/design-language-lock.md), never .iv-*.
 *
 * Neutral by construction: the page publishes its assumptions, gives air
 * cooling its genuine wins, and refuses to state a single universal kW
 * crossover. External figures cite docs/seo/source-register.md; company
 * claims render only from publishable claims.ts entries with their
 * required qualifiers.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";

const PATH = "/compare/liquid-cooling-vs-air-cooling";
const TITLE = "Liquid Cooling vs Air Cooling: Data Center Comparison";
const DESCRIPTION =
  "Neutral comparison of liquid and air cooling for AI racks: density ceilings, energy and water tradeoffs, retrofit paths, and when each approach genuinely wins.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

/* ------------------------------------------------------------------ */
/* Sources — docs/seo/source-register.md (verified 2026-08-31)         */
/* ------------------------------------------------------------------ */
const SOURCES: Source[] = [
  {
    n: 1,
    name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org",
    date: "2021",
  },
  {
    n: 2,
    name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)",
    publisher: "ASHRAE TC 9.9",
    url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf",
    date: "c. 2021",
  },
  {
    n: 3,
    name: "Global Data Center Survey 2025 (800+ operator respondents)",
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
    name: "Cooling Environments Project (cold plate, CDU, rear-door HX, heat reuse)",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/projects/cooling-environments",
    date: "ongoing",
  },
  {
    n: 6,
    name: "ACS Liquid Cooling Cold Plate Requirements, Rev 1.0",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/documents/ocp-acs-liquid-cooling-cold-plate-requirements-pdf",
  },
  {
    n: 7,
    name: "Liquid in the Rack: Liquid Cooling Your Data Center (NREL presentation)",
    publisher: "LBNL / NREL (DOE)",
    url: "https://datacenters.lbl.gov/sites/default/files/Liquid_Cooling_Your_Data_Center-NREL-EE.pdf",
  },
  {
    n: 8,
    name: "Data center efficiency (fleet trailing-12-month PUE 1.09)",
    publisher: "Google",
    url: "https://datacenters.google/efficiency/",
    date: "accessed 2026-08-31",
  },
  {
    n: 9,
    name: "Measuring energy and water efficiency for Microsoft datacenters (design PUE 1.12, WUE 0.30 L/kWh)",
    publisher: "Microsoft",
    url: "https://datacenters.microsoft.com/sustainability/efficiency/",
    date: "accessed 2026-08-31",
  },
  {
    n: 10,
    name: "HPC Data Center Waste Heat Reuse (ESIF)",
    publisher: "NREL (DOE)",
    url: "https://www.nrel.gov/computational-science/waste-heat-energy-reuse",
    date: "ongoing",
  },
];

/* FAQ — the SAME array feeds the visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "At what rack density does liquid cooling become necessary?",
    a: "There is no universal threshold. Uptime Institute's Global Data Center Survey 2025 reports fleet densities climbing into the 10-30 kW band, and rack-scale AI systems such as NVIDIA's GB200 NVL72 ship liquid-cooled because no air-cooled version is offered. For a given hall the crossover depends on inlet temperature, containment quality, floor pressure, and how much fan energy the operator will tolerate.",
  },
  {
    q: "Is air cooling ever the better engineering choice?",
    a: "Yes. For general-purpose compute, storage, and networking at modest density, in an existing hall with working containment and no liquid infrastructure, air is simpler, cheaper to maintain, and staffed by people who already know it. Adding a loop there buys risk, not performance.",
  },
  {
    q: "Does liquid cooling use more water than air cooling?",
    a: "Not inherently. A closed loop circulates a fixed coolant charge and consumes nothing. Site water use is set by the rejection stage: evaporative towers consume water in either architecture, dry coolers consume none. Because liquid loops accept warmer supply water, they can reject heat dry more often.",
  },
  {
    q: "Can one facility run both air and liquid cooling?",
    a: "Almost every liquid-cooled facility already does. Cold plates capture heat only from the components they touch, so regulators, drives, and power supplies still need an air path. Mixed halls are the normal case, not an edge case.",
  },
];

/* ------------------------------------------------------------------ */
/* Criteria matrix — the neutral comparison                            */
/* ------------------------------------------------------------------ */
const CRITERIA: { code: string; criterion: string; air: string; liquid: string; decides: string }[] = [
  {
    code: "TH-01",
    criterion: "Density ceiling",
    air: "Falls away as density rises; fan power scales steeply with flow.",
    liquid: "Carries far more heat per unit volume, so density stops being binding.",
    decides: "Sustained kW per rack across the refresh horizon, not day one.",
  },
  {
    code: "TH-02",
    criterion: "Thermal path",
    air: "Die to sink to room air to coil — several steps, each adding temperature rise.",
    liquid: "Die to cold plate to coolant — short path, small rise, so the loop runs warm.",
    decides: "Thermal margin the processor needs at rated power.",
  },
  {
    code: "TH-03",
    criterion: "Facility plant",
    air: "CRAH units, containment, raised floor or ducting, chilled-water or DX plant.",
    liquid: "CDUs, manifolds, quick disconnects, a facility water loop, plus a retained air plant.",
    decides: "Whether the plant already exists or is designed from scratch.",
  },
  {
    code: "TH-04",
    criterion: "Parasitic energy",
    air: "Server and CRAH fans become a rising share of overhead as density climbs.",
    liquid: "Pumps replace most fan energy and typically draw less per unit of heat moved.",
    decides: "Density, and how warm the supply temperature may run.",
  },
  {
    code: "TH-05",
    criterion: "Free-cooling hours",
    air: "Bounded by the inlet temperature the IT accepts and the local wet-bulb.",
    liquid: "Warm water classes widen the dry-cooling window, often to most of the year.",
    decides: "Climate, and the warmest water class the hardware accepts.",
  },
  {
    code: "TH-06",
    criterion: "Water use",
    air: "Zero if rejected dry; substantial with evaporative or adiabatic assist.",
    liquid: "Same rule; warmer loops make dry rejection viable in more climates.",
    decides: "The rejection stage and local water rights — not the cooling method.",
  },
  {
    code: "TH-07",
    criterion: "Retrofit path",
    air: "Incremental: containment, blanking panels, floor pressure, higher setpoints.",
    liquid: "Staged: rear-door exchangers, then in-row CDUs, then a facility loop.",
    decides: "Floor loading, pipe routing, spare capacity in the rejection plant.",
  },
  {
    code: "TH-08",
    criterion: "Serviceability",
    air: "Pull the server; failure modes are fans, filters, and bypass airflow.",
    liquid: "Disconnect couplings; adds coolant chemistry, filtration, and pressure testing.",
    decides: "Staffing depth and appetite for a new maintenance discipline.",
  },
  {
    code: "TH-09",
    criterion: "Failure profile",
    air: "Graceful: a failed fan degrades slowly and hot spots show up early.",
    liquid: "Low probability, high consequence: leaks need detection and rehearsed isolation.",
    decides: "Risk appetite and the maturity of operating procedure.",
  },
  {
    code: "TH-10",
    criterion: "Heat reuse",
    air: "Exhaust heat is low grade, so recovery is rarely economic.",
    liquid: "Higher return-water temperature makes recovery practical.",
    decides: "Whether an adjacent heat consumer exists, and at what temperature.",
  },
];

const ASSUMPTIONS = [
  "Liquid here means single-phase direct-to-chip cold plates, the mainstream implementation. Immersion and two-phase fluids move the serviceability and cost rows.",
  "Air means a competently run hall: aisle containment, blanking panels, and setpoints raised toward the top of the accepted class. Comparing against a badly tuned room flatters liquid.",
  "No single kW-per-rack crossover is published here. That threshold is a site calculation, not an industry constant.",
  "Capital cost is directional only, because pricing depends on scale, region, and whether the plant already exists.",
  "Both architectures are held to the same availability target, so the comparison isolates the thermal question.",
  "Retrofit and greenfield are treated as different problems; the same criterion often resolves in opposite directions.",
];

const AIR_WINS = [
  "Modest, stable density. General-purpose compute, storage, and network racks at conventional densities are designed for air, and the fan-power penalty stays small there.",
  "An existing hall with adequate containment and cooling capacity, where tuning the room is cheaper than plumbing it.",
  "Short remaining facility life. A lease with a few years left rarely justifies plant that pays back over a decade.",
  "Thin operations staffing, since coolant chemistry, filtration, and leak procedure need people and drills.",
  "Heterogeneous, frequently refreshed hardware. Cold plates are package-specific, so mixed fleets keep re-qualifying interfaces.",
  "Cool climates with long economiser seasons, where the energy argument for liquid is weakest.",
];

const LIQUID_WINS = [
  "The hardware ships liquid-cooled, so the question is not whether to plumb but where the CDU sits.",
  "Density is the binding constraint. Liquid converts an airflow problem into a plumbing problem — usually the cheaper of the two.",
  "Warm climates where free cooling matters, because warm water classes allow dry rejection across more of the year.",
  "Scarce water or contested permits: a closed loop rejected through dry coolers consumes no water in operation.",
  "A nearby heat consumer, since higher return-water temperature is what makes recovery worthwhile.",
  "Expensive floor area, because removing airflow volume lets the same load occupy far less space.",
];

const LIMITS = [
  "No capital number: cost is dominated by site, scale, and procurement position, so any published dollar-per-kW figure is someone else's project.",
  "Immersion and two-phase fluids are out of scope, and they change the serviceability and regulatory rows.",
  "Competent operation is assumed on both sides; a neglected loop and a badly contained hall both fail, and neither failure argues about architecture.",
  "Liquid cannot eliminate air. Cold plates cool only what they touch, so liquid-cooled facilities run two cooling systems, not one.",
  "Standards are still converging: water classes and component requirements are published, but cross-generation interoperability is not guaranteed.",
];

/* ------------------------------------------------------------------ */
/* Shared inline styles (server component — CSS-only hovers)           */
/* ------------------------------------------------------------------ */
const th: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 11.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
  textAlign: "left",
  padding: "0.65rem 0.9rem",
  borderBottom: "1px solid var(--edge-bright)",
  whiteSpace: "nowrap",
};

const td: CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.55,
  color: "var(--ink-dim)",
  padding: "0.65rem 0.9rem",
  borderBottom: "1px solid var(--edge-faint)",
  verticalAlign: "top",
  minWidth: "12rem",
};

const codePill: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  color: "var(--brand-deep)",
  background: "rgba(37,99,235,0.07)",
  border: "1px solid rgba(37,99,235,0.16)",
  borderRadius: 999,
  padding: "0.15rem 0.6rem",
  whiteSpace: "nowrap",
};

const h2Style: CSSProperties = {
  fontFamily: "var(--font-display), ui-sans-serif, system-ui",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  lineHeight: 1.1,
  color: "var(--ink-strong)",
  fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
};

const h3Style: CSSProperties = {
  fontFamily: "var(--font-display), ui-sans-serif, system-ui",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: "var(--ink-strong)",
  fontSize: "1.1rem",
};

const linkStyle: CSSProperties = {
  color: "var(--brand-deep)",
  textDecoration: "underline",
};

export default function LiquidVsAirCoolingPage() {
  return (
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="Liquid cooling vs air cooling for AI data centers"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* ---------------- compact hero ---------------- */}
      <header
        className="container-site"
        style={{ paddingTop: "clamp(6.5rem, 12vh, 9rem)", paddingBottom: "clamp(2.5rem, 5vh, 4rem)" }}
      >
        <Breadcrumbs
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Liquid cooling vs air cooling", path: PATH },
          ]}
        />

        <p
          className="mt-8 inline-flex items-center gap-2"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--brand-deep)",
            background: "var(--glass-bg-strong)",
            border: "1px solid var(--edge-bright)",
            borderRadius: 999,
            padding: "0.35rem 0.9rem",
          }}
        >
          <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>CMP-02</span>
          <span aria-hidden style={{ opacity: 0.4 }}>
            ·
          </span>
          COMPARE
        </p>

        <h1
          className="mt-5 max-w-4xl"
          style={{
            fontFamily: "var(--font-display), ui-sans-serif, system-ui",
            fontWeight: 800,
            letterSpacing: "-0.038em",
            lineHeight: 1.05,
            fontSize: "clamp(2.2rem, 4.6vw, 3.9rem)",
            color: "var(--ink-strong)",
          }}
        >
          Liquid cooling vs <span className="t-sweep-brand">air cooling</span>
        </h1>

        <p className="t-lede mt-5 max-w-[62ch]" style={{ color: "var(--ink-dim)" }}>
          Air cooling moves server heat with fans and room airflow; liquid cooling moves it through
          a fluid circulating in a cold plate on the processor itself. Density decides between them:
          air stays the simpler and cheaper choice for conventional racks, while rack-scale AI
          systems are sold liquid-cooled because no air-cooled equivalent is offered.<Cite n={4} />{" "}
          This page sets out the criteria, the assumptions behind them, and where each side wins.
        </p>

        <div className="mt-6">
          <LastVerified
            published="2026-08-31"
            lastVerified="2026-08-31"
            author="Josef Elimelech"
            reviewer="PODOS AI Engineering"
          />
        </div>
      </header>

      {/* ---------------- article body ---------------- */}
      <article className="container-site" style={{ paddingBottom: "clamp(4rem, 8vh, 6rem)" }}>
        <div className="max-w-[76ch]">
          {/* -------- the short answer -------- */}
          <section id="short-answer" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>The short answer</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Air is a poor coolant that happens to be free: low density, low heat capacity, so
              removing more heat means moving more air, and fan power rises steeply with flow. That
              trade stays comfortable at conventional densities and becomes punishing as racks fill
              with accelerators — which is why ASHRAE&apos;s TC 9.9 committee, which defines the
              thermal envelopes IT vendors design to, published a white paper on liquid cooling
              moving into mainstream facilities,<Cite n={2} /> and why its guidelines now name
              liquid-cooling facility water classes alongside the A1–A4 air classes.<Cite n={1} />
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              The market is mid-transition, not post-transition. Uptime Institute&apos;s 2025 survey
              of more than 800 operators shows rack densities climbing into the 10–30 kW band while
              industry-average PUE has been flat for roughly six years: air-side tuning has run out
              of headroom, yet most halls remain air-cooled.<Cite n={3} /> A site running both is
              the normal outcome, not a compromise.
            </p>
          </section>

          {/* -------- assumptions -------- */}
          <section id="assumptions" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Assumptions behind this comparison</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Cooling comparisons go wrong when the assumptions stay hidden. These are ours; change
              one and rows in the matrix move.
            </p>
            <ol className="mt-4 grid gap-3 list-decimal pl-5">
              {ASSUMPTIONS.map((t) => (
                <li key={t.slice(0, 24)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                  {t}
                </li>
              ))}
            </ol>
          </section>

          {/* -------- criteria matrix -------- */}
          <section id="criteria" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Criteria matrix</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Ten criteria, each with the input that decides it. The fourth column is the useful
              one: most disagreements about cooling are really disagreements about which input is
              binding.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Criterion</th>
                    <th style={th}>Air cooling</th>
                    <th style={th}>Liquid (direct-to-chip)</th>
                    <th style={th}>What decides it</th>
                  </tr>
                </thead>
                <tbody>
                  {CRITERIA.map((r) => (
                    <tr key={r.code}>
                      <td style={td}>
                        <span style={codePill}>{r.code}</span>
                      </td>
                      <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>
                        {r.criterion}
                      </td>
                      <td style={td}>{r.air}</td>
                      <td style={td}>{r.liquid}</td>
                      <td style={td}>{r.decides}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- when air wins -------- */}
          <section id="air-wins" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>When air cooling genuinely wins</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Air cooling is not a legacy technology to apologise for. Each case below is one where
              adding liquid buys risk rather than performance.
            </p>
            <ul className="mt-4 grid gap-3 list-disc pl-5">
              {AIR_WINS.map((t) => (
                <li key={t.slice(0, 24)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* -------- when liquid wins -------- */}
          <section id="liquid-wins" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>When liquid cooling wins</h2>
            <ul className="mt-4 grid gap-3 list-disc pl-5">
              {LIQUID_WINS.map((t) => (
                <li key={t.slice(0, 24)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* -------- energy and water -------- */}
          <section id="energy-water" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Energy and water: what actually changes</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Liquid cooling does not transform facility efficiency by itself. The published ceiling
              for excellent conventional plants is already high — Google reports a fleet-wide
              trailing-twelve-month PUE of 1.09, and Microsoft publishes a design PUE of 1.12 with
              water-use effectiveness of 0.30 L/kWh.<Cite n={8} />
              <Cite n={9} /> Against numbers like those, the overhead liquid can remove is real but
              bounded. What it changes decisively is the density at which those numbers stay
              achievable at all.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Water is the other misread. A closed loop consumes nothing; consumption belongs to the
              rejection stage, where evaporative towers trade water for lower temperatures and dry
              coolers trade temperature for zero water — in either architecture. Liquid loops
              tolerate warmer supply water, so the dry option stays viable in more climates,
              <Cite n={1} />
              <Cite n={7} /> and that same warm return water is what makes heat recovery economic.
              <Cite n={10} />
            </p>
          </section>

          {/* -------- retrofit -------- */}
          <section id="retrofit" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>The retrofit ladder</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Most operators are not choosing an architecture; they are choosing how far up a ladder
              to climb inside a building they already own. Rung one is air-side tuning. Rung two is
              rear-door heat exchangers, capturing rack exhaust into water without touching the
              servers. Rung three is in-rack or in-row CDUs, which carry direct-to-chip racks with
              no facility water plant. Rung four is a facility loop with plant-scale CDUs — a
              construction project. Federal-lab guidance covers piping and integration for the
              middle rungs,<Cite n={7} /> and the Open Compute Project publishes vendor-neutral
              cold-plate and disconnect requirements that keep a loop open to more than one vendor.
              <Cite n={5} />
              <Cite n={6} />
            </p>
          </section>

          {/* -------- limitations -------- */}
          <section id="limitations" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>What this comparison does not settle</h2>
            <ul className="mt-4 grid gap-3 list-disc pl-5">
              {LIMITS.map((t) => (
                <li key={t.slice(0, 24)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* -------- PODOS position -------- */}
          <section id="podos" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Where PODOS sits on this question</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              PODOS resolves the tradeoff at the factory rather than on the floor. Each{" "}
              <Link href="/platform/podos-pod" style={linkStyle}>
                PODOS Pod
              </Link>{" "}
              is{" "}
              <span data-claim="unit-capacity-1mw">
                designed as a standardized 1 MW building block
              </span>{" "}
              and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with closed-loop{" "}
              <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
                direct-to-chip liquid cooling
              </Link>{" "}
              specified as part of the enclosure instead of added to a room. Density, loop,{" "}
              <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
                power architecture
              </Link>
              , and heat-rejection interface are designed together and tested before shipment — one
              reason PODOS{" "}
              <span data-claim="deployment-window">
                targets a 90-day window from order to commissioning
              </span>{" "}
              for a standard unit.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              That is a constraint as much as an advantage: a factory-integrated thermal design is
              the wrong answer for an operator who needs more capacity out of an existing
              air-cooled hall. The wider build-versus-manufacture question is covered in{" "}
              <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>
                modular vs traditional AI data centers
              </Link>
              , the delivery model under{" "}
              <Link href="/deploy" style={linkStyle}>
                deployment
              </Link>
              , and unfamiliar terms in the{" "}
              <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
                AI infrastructure glossary
              </Link>
              .
            </p>
          </section>

          {/* -------- FAQ -------- */}
          <section id="faq" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Frequently asked questions</h2>
            <div className="mt-6 grid gap-6">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <h3 style={h3Style}>{f.q}</h3>
                  <p className="t-body mt-2" style={{ color: "var(--ink-dim)" }}>
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <EvidenceSourceRail sources={SOURCES} />
        </div>
      </article>
    </main>
  );
}
