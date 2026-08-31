/**
 * /engineering/data-center-heat-recovery — engineering explainer.
 *
 * Server component. Keyword-map cluster ("data center heat recovery",
 * informational/TOFU). All external numbers cite the source register or
 * a primary source verified 2026-08-31; company claims render only from
 * claims.ts publishable entries with their required qualifiers.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";

const PATH = "/engineering/data-center-heat-recovery";
const TITLE = "Data Center Heat Recovery: Heat Grade, ERE, and Reuse";
const DESCRIPTION =
  "How data center heat recovery works: heat grade, warm-water loops, ERE and ERF metrics, district and campus reuse, ORC, and where reuse stops paying off.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

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
    name: "High-Performance Computing Data Center Waste Heat Reuse (ESIF)",
    publisher: "NREL (DOE)",
    url: "https://www.nrel.gov/computational-science/waste-heat-energy-reuse",
    date: "accessed 2026-08-31",
  },
  {
    n: 3,
    name: "High-Performance Computing Data Center Warm-Water Liquid Cooling",
    publisher: "NREL (DOE)",
    url: "https://www.nrel.gov/computational-science/warm-water-liquid-cooling",
    date: "accessed 2026-08-31",
  },
  {
    n: 4,
    name: "WP #29 — ERE: A Metric for Measuring the Benefit of Reuse Energy from a Data Center",
    publisher: "The Green Grid",
    url: "https://archive.thegreengrid.org/en/resources/library-and-tools/242-WP",
    date: "2010",
  },
  {
    n: 5,
    name: "ISO/IEC 30134-6:2021 — Data centres key performance indicators, Part 6: Energy Reuse Factor (ERF)",
    publisher: "ISO/IEC",
    url: "https://www.iso.org/standard/71717.html",
    date: "2021",
  },
  {
    n: 6,
    name: "4th Generation District Heating (4GDH): Integrating smart thermal grids into future sustainable energy systems (Lund et al., Energy 68:1–11)",
    publisher: "Elsevier",
    url: "https://doi.org/10.1016/j.energy.2014.02.089",
    date: "Apr 2014",
  },
  {
    n: 7,
    name: "Directive (EU) 2023/1791 on energy efficiency (recast), Art. 12 and Art. 26",
    publisher: "European Union (EUR-Lex)",
    url: "https://eur-lex.europa.eu/eli/dir/2023/1791/oj/eng",
    date: "Sep 2023",
  },
  {
    n: 8,
    name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://eta.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report",
    date: "Dec 2024",
  },
  {
    n: 9,
    name: "Energy and AI — Executive Summary",
    publisher: "IEA",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
    date: "Apr 2025",
  },
  {
    n: 10,
    name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)",
    publisher: "ASHRAE TC 9.9",
    url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf",
    date: "c. 2021",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "What is data center heat recovery?",
    a: "The capture of heat a data center would otherwise reject to ambient, and its delivery to a useful load outside the facility — building heating, a district network, an industrial process, or a power cycle.",
  },
  {
    q: "What is the difference between ERE and ERF?",
    a: "ERF, the energy reuse factor, is the share of energy entering the data center that is beneficially reused outside its boundary, on a scale of 0 to 1. ERE folds that into a PUE-style number: ERE = (1 − ERF) × PUE.",
  },
  {
    q: "Does heat recovery lower a data center's own energy use?",
    a: "No. The facility draws the same electricity; the saving lands on the off-taker's fuel bill. That is why reuse needs a metric outside PUE.",
  },
  {
    q: "Is an ORC worth adding to a data center?",
    a: "Mainly where no thermal off-taker exists and the loop runs warm. The Carnot ceiling at data-center temperatures sits in the single digits to low teens of percent, and a real machine returns a fraction of that.",
  },
];

/* ------------------------------------------------------------------ */
/* small shared styles (server component — CSS-only hovers)            */
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
  minWidth: "10rem",
};

const tdStrong: CSSProperties = {
  ...td,
  color: "var(--ink-strong)",
  fontWeight: 500,
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

const captionStyle: CSSProperties = {
  captionSide: "top",
  textAlign: "left",
  padding: "0.9rem 0.9rem 0.2rem",
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 11.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
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

const monoInline: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  color: "var(--ink-strong)",
};

/* HR-01…HR-05 — the heat-grade ladder. */
const GRADE_LADDER: Array<[string, string, string, string, string]> = [
  ["HR-01", "Room return air", "Lowest", "Nothing off-site on its own", "Free, and near worthless — diluted into a large air mass"],
  [
    "HR-02",
    "Rear-door exchanger, air-coil water",
    "Low",
    "Building preheat, once a heat pump lifts it",
    "Cheap to retrofit; the grade penalty is paid in heat-pump power",
  ],
  [
    "HR-03",
    "Cold-plate return, cool water class",
    "Moderate",
    "Space heating; a low-temperature secondary loop",
    "Needs direct-to-chip capture, and leaves a chiller in place",
  ],
  [
    "HR-04",
    "Cold-plate return, warm water class",
    "Good",
    "Direct feed to a low-temperature district or campus loop",
    "Needs IT rated for a warm class; costs thermal margin at the die",
  ],
  [
    "HR-05",
    "Heat-pump-boosted loop",
    "High",
    "Legacy high-temperature networks, hot water, process heat",
    "Buys grade with electricity that must cost less than the heat",
  ],
];

/* Decision checklist — the go/no-go screen for a reuse scheme. */
const CHECKLIST: Array<[string, string, string, string]> = [
  ["01", "Is there an off-taker, and how far?", "A committed load within short pipe distance", "Pipe is costly per metre and sheds grade en route"],
  ["02", "Do the loads coincide in time?", "A year-round load — process heat, hot water, greenhouses", "A heating-season off-taker idles the plant half the year"],
  ["03", "Does your loop meet their supply temperature?", "A warm cold-plate return that feeds the network unboosted", "A higher requirement forces a heat pump that can outcost the heat"],
  ["04", "Does the contract outlive the hardware?", "Terms written around the site, not one GPU generation", "Network operators plan in decades; fleets refresh far faster"],
  ["05", "Is the boundary metered and agreed?", "A defined control volume, a meter, a rule on pumping cost", "Without it the ERF figure is unauditable"],
  ["06", "Is there a regulatory driver?", "A mandate that makes the study a cost you owe anyway", "Absent one, reuse competes with every other use of capital"],
  ["07", "What else could that capital buy?", "Capex small against the contract or permit it unlocks", "The same money in compute or power usually returns more"],
];

const LIMITS = [
  "No off-taker means no recovery. Heat cannot be stored cheaply or shipped far, and a scheme built on a hypothetical future neighbour is a rejection plant with extra pipework.",
  "Reuse does not cut the data center's own consumption. The facility draws the same electricity; the saving lands on the off-taker's fuel bill.",
  "Full-capacity rejection stays mandatory. Reuse is never firm, so recovery is additive capital, never a substitute for the rejection plant.",
  "Summer inverts the economics. Heating demand collapses exactly when ambient temperatures make rejection hardest.",
  "Heat pumps relocate the problem. Boosting a cool loop burns electricity on site to displace fuel off site.",
];

export default function DataCenterHeatRecoveryPage() {
  return (
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="Data center heat recovery, explained"
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
            { name: "Engineering", path: "/engineering" },
            { name: "Data center heat recovery", path: PATH },
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
          <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>ENG-08</span>
          <span aria-hidden style={{ opacity: 0.4 }}>
            ·
          </span>
          ENGINEERING
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
          Data center heat recovery, <span className="t-sweep-brand">explained</span>
        </h1>

        <p className="t-lede mt-5 max-w-[62ch]" style={{ color: "var(--ink-dim)" }}>
          Data center heat recovery captures heat a facility would otherwise reject to ambient and
          delivers it to a useful load — building heat, a district network, an industrial process, or
          a power cycle. It succeeds or fails on one variable: the temperature the heat arrives at,
          because temperature, not quantity, decides what a load can accept. Below: heat grade,
          warm-water loops, ERE and ERF, district and campus reuse, ORC, and where reuse stops
          paying.
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
          {/* -------- grade -------- */}
          <section id="heat-grade" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Quantity is not the constraint. Grade is.</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Essentially all electricity a data center draws leaves it as heat, and the quantity is
              no longer marginal: Lawrence Berkeley National Laboratory put US data-center
              electricity at 4.4% of national demand in 2023, on a path to 6.7–12% by 2028,
              <Cite n={8} /> and the IEA puts data centres near 1.5% of global electricity demand in
              2025, heading toward about 3% by 2030.<Cite n={9} /> Almost none of it is useful as
              delivered, because energy has a quality as well as a quantity. Heat a few degrees above
              ambient does almost no work however much there is; the same watts captured in liquid at
              the die arrive far hotter. ASHRAE names liquid-cooling facility water classes by their
              maximum supply temperature precisely because that number, not the cooling method, is
              the design variable.<Cite n={1} />
            </p>
          </section>

          {/* -------- warm water loops -------- */}
          <section id="warm-water" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Warm-water loops: how grade is engineered</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              A recovery-capable facility is designed backwards from the off-taker: not how cold the
              loop can be made, but how warm it may run while silicon stays inside its thermal
              envelope. Direct-to-chip capture is what makes that question answerable, collecting
              heat at the cold plate before it disperses into room air,<Cite n={10} /> and
              federal-lab practice treats warm-water liquid cooling as the enabling step for free
              cooling and energy recovery, in that order.<Cite n={3} />
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Three details then decide how much grade survives. Topology: devices plumbed in series
              see progressively warmer water, so the last position returns the most useful heat and
              keeps the least margin. Approach temperature: every exchanger between die and off-taker
              costs a few degrees. Residual air load: cold plates never capture everything, so size
              recovery on the liquid stream alone.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <caption style={captionStyle}>The heat-grade ladder</caption>
                <thead>
                  <tr>
                    <th style={th} scope="col">Code</th>
                    <th style={th} scope="col">Heat stream</th>
                    <th style={th} scope="col">Grade</th>
                    <th style={th} scope="col">Loads it can serve</th>
                    <th style={th} scope="col">What it costs to get there</th>
                  </tr>
                </thead>
                <tbody>
                  {GRADE_LADDER.map(([code, stream, grade, serves, cost]) => (
                    <tr key={code}>
                      <td style={td}>
                        <span style={codePill}>{code}</span>
                      </td>
                      <td style={tdStrong}>{stream}</td>
                      <td style={td}>{grade}</td>
                      <td style={td}>{serves}</td>
                      <td style={td}>{cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- ERE / ERF -------- */}
          <section id="ere-erf" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>ERE and ERF: the metrics that score reuse</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              PUE stops at the fence. It divides facility energy by IT energy and cannot credit heat
              that leaves the boundary usefully, so a facility heating a district scores no better
              than one venting the same energy to the sky. The Green Grid closed that gap with energy
              reuse effectiveness, <span style={monoInline}>ERE = (1 − ERF) × PUE</span>, where the
              energy reuse factor runs from 0 to 1; with no reuse ERF is 0 and ERE collapses back to
              PUE.<Cite n={4} />
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              ERF is now standardised as ISO/IEC 30134-6: energy reused over total energy consumed by
              the data centre.<Cite n={5} /> Two consequences are easy to miss. Reuse must be
              beneficial and outside the boundary, so internal recirculation does not count and an
              ERF target compels a real external off-taker. And ERF says nothing about how
              efficiently that off-taker uses the heat. NREL&apos;s Energy Systems Integration
              Facility is the federal reference — an energy-recovery loop spanning supercomputer,
              campus heating, and legacy IT, in a building reporting a PUE near 1.04<Cite n={2} /> —
              and its lesson is architectural: the loop was designed in, not bolted on.
            </p>
          </section>

          {/* -------- where the heat goes -------- */}
          <section id="reuse-models" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>District and campus reuse</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              District heating is the highest-value destination where a network exists, and it became
              viable for data centers because the networks got colder. Fourth-generation district
              heating describes low-temperature distribution around 55 °C supply and 20 °C return —
              temperatures a warm direct-to-chip loop can approach without a heat pump, where an
              older high-temperature network never could.<Cite n={6} /> The test is not whether a
              city has district heating but which generation reaches the property line. Campus reuse
              is smaller and far easier to contract, because both sides of the meter share an owner:
              offices, labs, hot-water preheat, greenhouses. Its limit is that campus demand is a
              fraction of what an AI facility rejects.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Regulation is increasingly the forcing function. The recast EU Energy Efficiency
              Directive requires member states to ensure waste-heat utilisation at data centres above
              1 MW of total rated energy input unless the operator shows it is not technically or
              economically feasible, with annual reporting from 500 kW of installed IT power.
              <Cite n={7} /> The feasibility study becomes a compliance artefact — better done early
              enough to shape the design.
            </p>
          </section>

          {/* -------- ORC -------- */}
          <section id="orc" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>The organic Rankine cycle, honestly</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              An organic Rankine cycle is a closed steam cycle that swaps water for an organic
              working fluid with a much lower boiling point, so it vaporises on heat too cool to
              raise steam: pump, evaporator against the hot loop, expander, condenser to a cold sink.
              The output is electricity, which needs no pipe and no neighbour.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Thermodynamics sets the expectation. Any heat engine is bounded by the Carnot
              efficiency <span style={monoInline}>1 − T_cold / T_hot</span> in absolute temperature,
              and data-center heat sits close to its own sink. At an illustrative 60 °C source
              against a 20 °C sink the ceiling is 1 − 293 K / 333 K, about 12%; at 45 °C against
              25 °C, roughly 6%. A real machine returns a fraction of that, and its pumps come off
              the top. It also needs a genuinely cold sink, costs heavily per kW at small scale, and
              recovers only the liquid loop. It is a stranded-heat fallback — a design that leads
              with an ORC usually could not find a neighbour.
            </p>
          </section>

          {/* -------- decision checklist -------- */}
          <section id="checklist" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Does reuse pencil at this site?</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Seven questions, in the order a feasibility review should ask them. A scheme that fails
              the first two rarely recovers on the strength of the rest.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th} scope="col">#</th>
                    <th style={th} scope="col">Question</th>
                    <th style={th} scope="col">Worth engineering when</th>
                    <th style={th} scope="col">Stops making sense when</th>
                  </tr>
                </thead>
                <tbody>
                  {CHECKLIST.map(([n, q, go, stop]) => (
                    <tr key={n}>
                      <td style={td}>
                        <span style={codePill}>{n}</span>
                      </td>
                      <td style={tdStrong}>{q}</td>
                      <td style={td}>{go}</td>
                      <td style={td}>{stop}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- limitations -------- */}
          <section id="limitations" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>When heat recovery is not the right fit</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Heat recovery is oversold more often than it is under-built. These limits decide most
              real projects.
            </p>
            <ul className="mt-4 grid gap-3 list-disc pl-5">
              {LIMITS.map((t) => (
                <li key={t.slice(0, 28)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* -------- PODOS application -------- */}
          <section id="podos" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>What this means for a modular unit</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Recovery readiness is an architecture decision, made before the loop is plumbed. Each{" "}
              <Link href="/platform/podos-pod" style={linkStyle}>
                PODOS Pod
              </Link>{" "}
              is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
              and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with a closed
              direct-to-chip loop specified as part of the enclosure — heat stays at HR-03/HR-04
              grade instead of dispersing into room air, and the reuse boundary lands on one
              meterable connection. Whether a site reuses that heat still depends on the off-taker,
              not the unit.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Modularity changes the siting question too: because the unit is factory-built and
              relocatable — PODOS{" "}
              <span data-claim="deployment-window">
                targets a 90-day window from order to commissioning
              </span>{" "}
              for a standard unit — capacity can be placed next to a thermal load rather than waiting
              for one to appear beside a finished building. Adjacent engineering:{" "}
              <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
                direct-to-chip liquid cooling
              </Link>{" "}
              and the{" "}
              <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
                power architecture
              </Link>{" "}
              that sets how much heat exists to recover; siting in{" "}
              <Link href="/deploy" style={linkStyle}>
                deployment
              </Link>
              ; the head-to-head in{" "}
              <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>
                modular vs traditional AI data centers
              </Link>
              ; vocabulary in the{" "}
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
