/**
 * /insights/direct-to-chip-vs-immersion-vs-air-cooling
 * Archetype E, insight. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Evergreen technical insight. Server component, no client JS.
 * Two original assets: (1) a worked airflow calculation that reframes
 * the air-cooling ceiling as a floor-plan geometry problem, rendered as
 * a CSS bar chart and a table that BOTH read the same AIRFLOW array so
 * the figure can never drift from the data; (2) a six-axis decision
 * matrix across the three cooling families. No product photography —
 * an insight page earns attention with a number, not a render.
 *
 * External numbers cite the source register; PODOS numbers render only
 * from claims.ts publishable entries with their required qualifiers.
 */

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import {
  HeroEditorial,
  ExecutiveAnswer,
  DataFigure,
  MatrixTable,
  QuoteMetric,
  LimitsBlock,
  ProseWithRail,
  CardGrid,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/insights/direct-to-chip-vs-immersion-vs-air-cooling";
const TITLE = "Direct-to-Chip vs Immersion vs Air Cooling: A Matrix";
const DESCRIPTION =
  "A three-way cooling decision matrix for AI racks: density ceiling, retrofit difficulty, serviceability, fluid handling, and ecosystem maturity compared.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)",
    publisher: "ASHRAE TC 9.9",
    url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf",
    date: "2021",
  },
  {
    n: 2,
    name:
      "Thermal Guidelines for Data Processing Environments, 5th ed. Revised & Expanded — TC 9.9 reference card (facility water classes W17–W45/W+)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/supplemental%20files/therm-gdlns-5th-r-e-refcard.pdf",
    date: "2021, 2024",
  },
  {
    n: 3,
    name: "Liquid in the Rack: Liquid Cooling Your Data Center (NREL/PR-7A40-72046)",
    publisher: "LBNL Center of Expertise / NREL (DOE)",
    url: "https://datacenters.lbl.gov/sites/default/files/Liquid_Cooling_Your_Data_Center-NREL-EE.pdf",
    date: "Aug 2018",
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
    name: "Cooling Environments Project (cold plate, CDU, immersion, rear-door HX)",
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
    name: "OCP Immersion Requirements, Rev 2.10",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/documents/ocp-acs-immersion-requirements-rev-2-1-pdf",
  },
  {
    n: 8,
    name: "Server Component Immersion Material Compatibility Testing Guidelines, v1.5",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/documents/ocp-component-compatibility-testing-guidelines-v1-5-final-june-5-2026-pdf",
    date: "Jun 2026",
  },
  {
    n: 9,
    name: "Global Data Center Survey 2025 (15th annual)",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
];

const linkStyle: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };
const emph: CSSProperties = { fontWeight: 600, color: "var(--ink-strong)" };

const eqStyle: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: "1.02rem",
  lineHeight: 1.8,
  color: "var(--ink-strong)",
  background: "var(--glass-bg-strong)",
  border: "1px solid var(--edge-bright)",
  borderRadius: 10,
  padding: "1.1rem 1.25rem",
};

const ASSUMPTIONS: string[] = [
  "Sensible-heat airflow, sea level: cfm = kW x 3,412 / (1.08 x delta-T in F).",
  "Server air temperature rise delta-T = 15 K (27 F) — a mid-range figure, not a vendor spec.",
  "Best-in-class raised-floor delivery of 1,900 cfm per tile, from ASHRAE TC 9.9.",
  "One rack is treated as occupying one tile of plan area.",
  "Close-coupled, overhead, and slab-delivery designs are deliberately excluded — see the limits section.",
];

/* Worked calculation — see the assumptions block above.
   cfm = kW x 3412 / (1.08 x dT_F), dT = 15 K = 27 F  ->  117 cfm per kW.
   `tiles` is a number so it can drive bar height in Figure 1; the table
   below renders the same value, so a data fix can never leave a stale
   figure behind. */
const AIRFLOW: { kw: string; cfm: string; si: string; tiles: number; note: string }[] = [
  { kw: "10 kW", cfm: "1,170", si: "0.55", tiles: 0.6, note: "Conventional. Nothing is broken." },
  { kw: "20 kW", cfm: "2,340", si: "1.10", tiles: 1.2, note: "Containment becomes mandatory." },
  { kw: "30 kW", cfm: "3,510", si: "1.66", tiles: 1.8, note: "Needs close-coupled or overhead supplement." },
  { kw: "45 kW", cfm: "5,265", si: "2.48", tiles: 2.8, note: "Matches ASHRAE's published figure — see cross-check." },
  { kw: "60 kW", cfm: "7,020", si: "3.31", tiles: 3.7, note: "Air delivery, not heat capacity, is now the limit." },
  { kw: "120 kW", cfm: "14,040", si: "6.63", tiles: 7.4, note: "No plausible floor plan delivers this to one rack." },
];

const CHART_MAX = 8;

const MATRIX_ROWS: Array<{
  code: string;
  axis: string;
  air: ReactNode;
  dtc: ReactNode;
  imm: ReactNode;
}> = [
  {
    code: "AX-01",
    axis: "Density ceiling",
    air: (
      <>
        Federal-lab guidance places traditional air-cooled racks at 1–5 kW and calls liquid
        necessary across the 5–80 kW range.<Cite n={3} />
      </>
    ),
    dtc: (
      <>
        High enough that vendors ship it as the default: the GB200 NVL72 is described as a
        &ldquo;rack-scale, liquid-cooled design&rdquo; of 72 GPUs and 36 CPUs.<Cite n={4} />
      </>
    ),
    imm: (
      <>
        ASHRAE credits immersion with broad temperature support, high heat capture, and high
        density — but single-phase natural convection has its own ceiling, past which forced
        convection or two-phase is required.<Cite n={1} />
      </>
    ),
  },
  {
    code: "AX-02",
    axis: "Retrofit difficulty",
    air: <>None. It is the incumbent, and its capital is already sunk.</>,
    dtc: (
      <>
        Moderate. Where facility water has not been brought to the rack, ASHRAE offers liquid-to-air
        heat exchangers — in the rack or at the row — as an interim bridge, at the cost of rejecting
        that heat back into the room rather than to facility water. Rack weights, aisle pitch, and
        rolling-load paths still bind.<Cite n={1} />
      </>
    ),
    imm: (
      <>
        Highest. Horizontal tanks break the rack-and-aisle floor plan, and the load path —
        rolling loads, ramps, elevators — must carry a filled tank.<Cite n={1} />
      </>
    ),
  },
  {
    code: "AX-03",
    axis: "Serviceability",
    air: <>Pull the server, swap it, no fluid involved. This is air&rsquo;s strongest axis.</>,
    dtc: (
      <>
        Dripless quick disconnects keep the rack orientation and the service motion, but cold
        plates add airflow impedance and hybrid air/liquid boards keep fan power high.
        <Cite n={1} />
      </>
    ),
    imm: (
      <>
        ASHRAE: &ldquo;a crane or two-man lift is often required to remove IT equipment hardware
        for service.&rdquo; Yet immersion may cool high-power DIMMs without the serviceability
        problems cold plates create on the same parts.<Cite n={1} />
      </>
    ),
  },
  {
    code: "AX-04",
    axis: "Fluid handling",
    air: <>No working fluid at the rack. The fluid problem is displaced to the chiller plant.</>,
    dtc: (
      <>
        Treated water or glycol in a closed technology loop. Compatible metals and water chemistry
        are called crucial, alongside filtration with bypass and hydronic redundancy.<Cite n={3} />
      </>
    ),
    imm: (
      <>
        The whole board is wetted. ASHRAE recommends a materials-compatibility assessment and a
        warranty-impact evaluation before deployment;<Cite n={1} /> OCP publishes a dedicated
        component immersion compatibility test guideline.<Cite n={8} />
      </>
    ),
  },
  {
    code: "AX-05",
    axis: "Ecosystem maturity",
    air: <>Total. Every vendor, every integrator, every technician already speaks it.</>,
    dtc: (
      <>
        Converging fast: OCP maintains vendor-neutral cold-plate requirements<Cite n={6} /> inside
        a broader cooling-environments programme.<Cite n={5} />
      </>
    ),
    imm: (
      <>
        Active but younger. OCP immersion requirements sit at Rev 2.10<Cite n={7} /> with a
        separate 2026 compatibility guideline;<Cite n={8} /> ASHRAE describes a field of many
        startup and established players.<Cite n={1} />
      </>
    ),
  },
  {
    code: "AX-06",
    axis: "Heat capture fraction",
    air: <>By definition none to liquid — every watt leaves through the room.</>,
    dtc: (
      <>
        Depends entirely on what the plates touch. Federal-lab practice specifies at least 95% of
        rack heat captured directly to liquid;<Cite n={3} /> a CPU-only design that leaves memory
        on air misses that and erodes the economic case.<Cite n={1} />
      </>
    ),
    imm: <>Essentially complete by construction — the fluid touches everything on the board.</>,
  },
];

const BINDING: string[] = [
  "The hall binds. An air-cooled facility with racks under about 20 kW is not broken; containment and airflow discipline still have room, and the table above says so.",
  "The hardware binds. If the accelerator vendor ships the rack liquid-cooled, direct-to-chip is not a selection you make — it is the product you bought.",
  "The board binds. Where heat sits on components cold plates cannot reach — dense memory, mixed boards — immersion is the honest answer, even at the cost of the service motion.",
  "The site binds. No water plant, no floor-loading headroom, no crane: the constraint is the building, and a factory-integrated closed loop moves cooling off the site's critical path.",
];

const TOC: [string, string][] = [
  ["#airflow-wall", "The air ceiling"],
  ["#figure", "Figure 1 · the tile ratio"],
  ["#airflow-table", "Airflow per rack"],
  ["#matrix", "The decision matrix"],
  ["#binding", "Which constraint binds"],
  ["#operators", "For operators"],
  ["#limitations", "What this does not prove"],
];

export default function CoolingComparisonInsightPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Direct-to-chip vs immersion vs air cooling: a decision matrix"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />

      {/* 1 · HERO — editorial, paper. No product shot; the numbers carry it. */}
      <HeroEditorial
        category="Thermal engineering · Analysis"
        title="Direct-to-chip, immersion, or air: which constraint"
        accent="binds first"
        lede="There is no winner across all six axes, and any page that names one is selling something. Air cooling does not fail because air cannot carry the heat — it fails because a rack cannot be given enough floor area to receive the air."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Direct-to-chip vs immersion vs air cooling", path: PATH },
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
          { value: "1,900 cfm", label: "Best-in-class raised-floor delivery, one tile" },
          { value: "7.4 tiles", label: "Air a 120 kW rack demands at a 15 K rise" },
          { value: "≈80 kW", label: "Fan-power swing on a 1 MW critical block" },
        ]}
      />

      {/* 2 · EXECUTIVE ANSWER — canvas glass panel */}
      <ExecutiveAnswer>
        Direct-to-chip wins wherever the hardware vendor has already decided, and immersion wins on
        precisely the components cold plates cannot reach. The engineering question is not which
        method is best; it is which constraint binds first on your site.
      </ExecutiveAnswer>

      {/* 3 · THE AIR CEILING — prose with the sticky TOC rail, paper */}
      <ProseWithRail
        id="airflow-wall"
        surface="paper"
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
        <SectionHead
          eyebrow="First principles"
          title="The air ceiling is geometry, not thermodynamics"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The usual argument against air is that it is a poor coolant. True, but it sends
            operators to the wrong test. Air will carry any heat load you like if you move enough of
            it; what it cannot do is arrive. A rack occupies roughly one floor tile of plan area,
            and ASHRAE&apos;s TC 9.9 committee puts best-of-breed raised-floor delivery at about
            1,900 cfm per tile.<Cite n={1} /> That single number turns the cooling question into a
            floor-plan question: how many tiles of air does one tile of rack demand?
          </p>
        </div>

        <div style={{ ...eqStyle, marginTop: "2rem" }}>
          cfm = kW × 3,412 / (1.08 × ΔT<sub>°F</sub>)
          <br />
          <span style={{ color: "var(--ink-dim)" }}>ΔT = 15 K = 27 °F → about 117 cfm per kW</span>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <p className="eyebrow">Assumptions</p>
          <ul className="limits" style={{ marginTop: "1rem" }}>
            {ASSUMPTIONS.map((t) => (
              <li key={t.slice(0, 20)}>{t}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <p>
            <span style={emph}>Cross-check.</span> ASHRAE independently states that a 40–50 kW rack
            can demand up to 5,000 cfm against that 1,900 cfm tile.<Cite n={1} /> The model above
            returns 5,265 cfm at 45 kW — within about 5%, which is the confidence every other row
            inherits. The committee states the same physics as a rack-fill limit: servers drawing
            100 cfm or more per U would fill only 19U if one tile were the whole supply.
            <Cite n={1} />
          </p>
          <p>
            A second bill lands on the critical power budget rather than the mechanical one. ASHRAE
            reports that fan power of 10% to 20% of server power is not uncommon on denser servers,
            and that moving from 2% to 10% is equivalent to cutting usable UPS capacity by 8%.
            <Cite n={1} /> On a 1 MW critical block that swing is roughly 80 kW — capacity bought,
            cooled, and protected as if it were compute, then spent on moving air. That number, not
            any coolant property, tends to end the argument.
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · FIGURE 1 — the page's visual centre, an original CSS chart, canvas */}
      <DataFigure
        id="figure"
        eyebrow="Figure 1 · Original analysis"
        title="How many tiles of air one tile of rack"
        lede="Every bar is one rack drawing its air from best-in-class raised-floor delivery at a 15 K rise. The dashed line is the floor plan itself: one rack, one tile. Past it, a rack is asking for air the plan area in front of it cannot supply."
        surface="canvas"
        field="insight"
        caption="Figure 1 · Tiles of best-in-class raised-floor delivery demanded by one rack. Derived from the airflow model stated above against ASHRAE's 1,900 cfm per tile; close-coupled, overhead, and slab-delivery designs are excluded and are not bound by this ratio."
      >
        <div
          style={{
            border: "1px solid var(--edge-bright)",
            borderRadius: 14,
            background: "var(--glass-bg-strong)",
            padding: "clamp(1.5rem, 3vw, 2.75rem)",
          }}
        >
          <div
            role="img"
            aria-label="Bar chart: tiles of best-in-class raised-floor air delivery demanded by a single rack, rising from 0.6 tiles at 10 kW to 1.2 at 20 kW, 1.8 at 30 kW, 2.8 at 45 kW, 3.7 at 60 kW, and 7.4 at 120 kW, against the one tile of plan area a rack occupies."
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: `repeat(${AIRFLOW.length}, minmax(0, 1fr))`,
              gap: "clamp(0.5rem, 1.5vw, 1.5rem)",
              alignItems: "end",
              height: "clamp(240px, 34vh, 380px)",
              paddingTop: "1.5rem",
            }}
          >
            {/* one-tile reference line — the floor plan, not the physics */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: `${(1 / CHART_MAX) * 100}%`,
                borderTop: "1px dashed var(--brand-deep)",
                pointerEvents: "none",
              }}
            >
              <span
                className="eyebrow"
                style={{ position: "absolute", left: 0, top: "-1.35rem", color: "var(--brand-deep)" }}
              >
                One rack = one tile
              </span>
            </div>

            {AIRFLOW.map((row) => (
              <div
                key={row.kw}
                style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}
              >
                <span
                  className="metric"
                  style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)", marginBottom: "0.5rem", textAlign: "center" }}
                >
                  {row.tiles}×
                </span>
                <div
                  style={{
                    height: `${(row.tiles / CHART_MAX) * 100}%`,
                    borderRadius: "6px 6px 0 0",
                    background:
                      row.tiles >= 3.7
                        ? "linear-gradient(180deg, var(--cyan) 0%, var(--cyan-deep) 100%)"
                        : "linear-gradient(180deg, var(--brand-bright) 0%, var(--brand-deep) 100%)",
                    opacity: row.tiles >= 1 ? 1 : 0.72,
                  }}
                />
              </div>
            ))}
          </div>

          <div
            aria-hidden
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${AIRFLOW.length}, minmax(0, 1fr))`,
              gap: "clamp(0.5rem, 1.5vw, 1.5rem)",
              borderTop: "1px solid var(--edge-bright)",
              paddingTop: "0.75rem",
              marginTop: "0.25rem",
            }}
          >
            {AIRFLOW.map((row) => (
              <span key={row.kw} className="eyebrow" style={{ justifyContent: "center" }}>
                {row.kw}
              </span>
            ))}
          </div>
        </div>
      </DataFigure>

      {/* 5 · INK BEAT */}
      <QuoteMetric
        quote="Air will carry any heat load you like if you move enough of it; what it cannot do is arrive."
        attribution="The ceiling is floor-plan geometry, not thermodynamics"
        metric="1,900"
        label="cfm per tile — best-in-class raised-floor delivery"
        field="insight"
      />

      {/* 6 · TABLE 1 — the numbers behind Figure 1, canvas */}
      <MatrixTable
        id="airflow-table"
        eyebrow="Table 1 · The numbers behind Figure 1"
        title="Airflow required per rack, and the floor it needs"
        lede="Read the tile column as a plan-area ratio, not a physical law: it is what best-in-class raised-floor delivery would have to put in front of one rack to carry that load at a 15 K rise."
        surface="canvas"
        head={["Rack load", "Airflow (cfm)", "Airflow (m³/s)", "Tiles of delivery", "Reading"]}
        rows={AIRFLOW.map((row) => [row.kw, row.cfm, row.si, `${row.tiles}`, row.note])}
      />

      {/* 7 · TABLE 2 — the decision matrix, paper */}
      <MatrixTable
        id="matrix"
        eyebrow="Table 2 · Original analysis"
        title="The decision matrix"
        lede="Six axes, three approaches. Read column-down for a method, row-across for where each one genuinely wins — because each one does."
        surface="paper"
        head={["Axis", "Air", "Direct-to-chip", "Immersion"]}
        rows={MATRIX_ROWS.map((r) => [
          <span key={r.code}>
            <span className="pill">{r.code}</span>
            <span style={{ ...emph, display: "block", marginTop: "0.55rem", fontWeight: 500 }}>
              {r.axis}
            </span>
          </span>,
          r.air,
          r.dtc,
          r.imm,
        ])}
      />

      {/* 8 · READING THE MATRIX — prose, canvas */}
      <ProseWithRail id="binding" surface="canvas">
        <SectionHead eyebrow="Reading the matrix" title="Which constraint binds first" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            AX-03 is the row worth re-reading. Received wisdom makes immersion the serviceability
            loser, and for whole-chassis work it is — ASHRAE is explicit about the crane. But the
            same paper observes that immersion may cool high-power memory adequately without the
            serviceability problems cold plates introduce on those same parts.<Cite n={1} /> Cold
            plates are excellent where they touch and irrelevant where they do not, and memory is
            exactly that boundary.
          </p>
          <p>
            Run these in order and stop at the first that is true for your site. The method is a
            consequence of the answer, not a preference expressed before it.
          </p>
          <ol style={{ marginTop: "1.5rem", display: "grid", gap: "0.85rem", paddingLeft: "1.35rem" }}>
            {BINDING.map((t) => (
              <li key={t.slice(0, 22)}>{t}</li>
            ))}
          </ol>
        </div>
      </ProseWithRail>

      {/* 9 · FOR OPERATORS — cards, paper */}
      <CardGrid
        id="operators"
        eyebrow="Practice"
        title="What this means for operators"
        surface="paper"
        columns={3}
        items={[
          {
            code: "01",
            title: "Airflow first, product second",
            body: (
              <>
                Compute your own airflow number before evaluating a single product. Rack kW and your
                real server delta-T give the cfm; compare it against what your delivery method can
                put in front of that rack. If the ratio exceeds one, the shortlist is already
                decided.
              </>
            ),
          },
          {
            code: "02",
            title: "Capture fraction, not cooling type",
            body: (
              <>
                Ask vendors for heat capture fraction, not cooling type. Federal-lab practice
                specifies at least 95% of rack heat captured directly to liquid;<Cite n={3} /> a
                quotation that says &ldquo;liquid-cooled&rdquo; without a capture fraction is
                describing a hybrid whose residual air plant you still have to build.
              </>
            ),
          },
          {
            code: "03",
            title: "Fan power is critical power",
            body: (
              <>
                Move fan power into the critical-power line of the model. It runs on the same UPS as
                the GPUs, and ASHRAE puts the 2%-to-10% move at 8% of UPS capacity.<Cite n={1} />
              </>
            ),
          },
          {
            code: "04",
            title: "Fluid needs a named owner",
            body: (
              <>
                Name an owner for fluid before the first fill. Chemistry, filtration, material
                compatibility, and warranty impact are operating disciplines with a schedule, not a
                commissioning task that closes.<Cite n={1} />
              </>
            ),
          },
          {
            code: "05",
            title: "Re-ask the maturity question",
            body: (
              <>
                Re-ask the maturity question annually. Uptime Institute&apos;s 2025 operator survey
                — its fifteenth — frames the year as rising costs, worsening power constraints, and
                challenges in meeting the demands for AI.<Cite n={9} /> The inputs that decide this
                matrix are the ones actively moving.
              </>
            ),
          },
        ]}
      />

      {/* 10 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="What this does not prove"
        eyebrow="Honest limits"
        lede="The calculation above is a heuristic built on published figures, and it fails in several identifiable ways."
        items={[
          "The delta-T assumption drives every number. At 20 K rise the airflow column drops by about a quarter; at 10 K it rises by half. Nothing here establishes that 15 K is right for your hardware — only that it reproduces ASHRAE's own published figure at 45 kW.",
          "The tile ratio is a floor-plan heuristic, not a physical law. The 1,900 cfm figure describes best-in-class raised-floor delivery in a 2021 ASHRAE paper citing a 2016 volume. Row-based, overhead, and slab designs are not bound by it, and a rack served by close-coupled coolers is not served by tiles at all — there, the ratio column overstates the difficulty.",
          "Fan-power percentages are a characterisation, not a fleet average. ASHRAE describes 10% to 20% as 'not uncommon' on denser servers; your fleet may sit far below that, and the 80 kW figure is arithmetic on that band, not a measurement.",
          "The 1–5 kW air band, the 5–80 kW liquid band, and the 95% capture target come from a 2018 federal-lab presentation. They are design guidance from a specific HPC facility's practice, not a current census of what air can be pushed to; treat the boundaries as soft and dated.",
          "The immersion serviceability findings are from 2021, and the standards surface has moved since — OCP immersion requirements are at Rev 2.10, with a component compatibility guideline dated 2026. Treat crane-and-warranty as the state of a maturing field, not a fixed property.",
          "There is no cost data here. Capex, opex, refresh cycles, and local energy and water pricing decide real projects; a matrix that ignores money cannot select a method on its own.",
          "None of these figures are measured PODOS results. Everything quantitative above belongs to ASHRAE, the federal labs, OCP, NVIDIA, or Uptime Institute, and is cited as theirs.",
        ]}
      />

      {/* 11 · PODOS — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="In the product" title="Where PODOS sits on this question" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            PODOS answers the fourth constraint — the one where the building binds. Each{" "}
            <Link href="/platform/podos-pod" style={linkStyle}>
              PODOS Pod
            </Link>{" "}
            is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with a closed{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
              direct-to-chip liquid cooling
            </Link>{" "}
            loop specified as part of the enclosure rather than added to a room. That is not a claim
            that cold plates beat immersion on every axis — the matrix says plainly that they do
            not. It is a decision about which constraint the product removes: the site&apos;s.
            Because the loop, the{" "}
            <Link href="/engineering/thermal-enclosure" style={linkStyle}>
              thermal enclosure
            </Link>
            , and the rejection interfaces are integrated and tested in the factory, the cooling
            system arrives commissioned — one reason PODOS{" "}
            <span data-claim="deployment-window">
              targets a 90-day window from order to commissioning
            </span>{" "}
            for a standard unit.
          </p>
          <p style={{ color: "var(--ink-faint)", fontSize: 13.5 }}>
            Review schedule: 90 days. ASHRAE facility water classes<Cite n={2} /> and the OCP
            requirement revisions cited here are the fastest-moving inputs on this page.
          </p>
        </div>
      </ProseWithRail>

      {/* 12 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED — paper */}
      <RelatedRail
        title="Continue reading"
        surface="paper"
        items={[
          {
            href: "/compare/liquid-cooling-vs-air-cooling",
            label: "COMPARE",
            title: "Liquid cooling vs air cooling — the two-way version",
          },
          {
            href: "/engineering/high-density-gpu-infrastructure",
            label: "ENGINEERING",
            title: "High-density GPU infrastructure",
          },
          {
            href: "/deploy/operations-maintenance",
            label: "DEPLOY",
            title: "Operations and maintenance",
          },
          {
            href: "/resources/ai-infrastructure-glossary",
            label: "RESOURCE",
            title: "AI infrastructure glossary",
          },
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Find out which constraint binds on"
        accent="your site"
        body="Bring the rack load, the delivery method, and the floor plan. Engineering will tell you which row of the matrix you are actually standing on."
        primary={{ href: "/estimate", label: "Size your deployment" }}
        secondary={{ href: "/engineering", label: "Engineering index" }}
        field="insight"
      />
    </main>
  );
}
