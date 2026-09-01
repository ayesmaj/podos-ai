/**
 * /insights/why-ai-infrastructure-is-moving-to-liquid-cooling
 * Archetype E, insight. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Evergreen technical insight. Server component, no client JS.
 * The page's visual centre is an ORIGINAL CSS chart derived from the
 * same FANLAW array that feeds the table below it — so the figure can
 * never drift from the data. Deliberately no product photography: an
 * insight page earns attention with a number, not a render.
 *
 * Every external number cites the source register; company figures
 * render only from claims.ts publishable entries with their qualifiers.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
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

const PATH = "/insights/why-ai-infrastructure-is-moving-to-liquid-cooling";
const TITLE = "Why AI Infrastructure Is Moving to Liquid Cooling: The Math";
const DESCRIPTION =
  "A worked heat-removal calculation showing where air cooling stops paying for itself in an AI rack, why fan power scales cubically, and what operators should do.";

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const SOURCES: Source[] = [
  {
    n: 1,
    name:
      "Thermal Guidelines for Data Processing Environments, 5th ed. — TC 9.9 Reference Card (Table 2.1 air classes A1–A4; Table 2.2 high-density class H1)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/supplemental%20files/therm-gdlns-5th-r-e-refcard.pdf",
    date: "2021, rev. 2024",
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
    name: "2025 ASHRAE Handbook—Fundamentals (fluid properties; fan and pump laws)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org/technical-resources/ashrae-handbook/description-2025-ashrae-handbook-fundamentals",
    date: "2025 ed.",
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
    name:
      "Global Data Center Survey 2025 — keynote report (PUE weighted average 1.54, n = 681; rack density distribution, n = 709)",
    publisher: "Uptime Institute",
    url: "https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2025.Annual.Survey.Report.pdf",
    date: "2025",
  },
  {
    n: 6,
    name: "WP #29 — ERE: A Metric for Measuring the Benefit of Reuse Energy from a Data Center",
    publisher: "The Green Grid",
    url: "https://archive.thegreengrid.org/en/resources/library-and-tools/242-WP",
    date: "2010",
  },
  {
    n: 7,
    name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf",
    date: "Dec 2024",
  },
  {
    n: 8,
    name: "Energy and AI — Executive Summary",
    publisher: "IEA",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
    date: "Apr 2025",
  },
  {
    n: 9,
    name: "Liquid in the Rack: Liquid Cooling Your Data Center (NREL presentation)",
    publisher: "LBNL / NREL (DOE)",
    url: "https://datacenters.lbl.gov/sites/default/files/Liquid_Cooling_Your_Data_Center-NREL-EE.pdf",
  },
  {
    n: 10,
    name: "Cooling Environments Project",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/projects/cooling-environments",
    date: "ongoing",
  },
];

const linkStyle: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };
const emph: CSSProperties = { fontWeight: 600, color: "var(--ink-strong)" };

const eqStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "1.02rem",
  lineHeight: 1.8,
  color: "var(--ink-strong)",
  background: "var(--glass-bg-strong)",
  border: "1px solid var(--edge-bright)",
  borderRadius: 10,
  padding: "1.1rem 1.25rem",
};

const ASSUMPTIONS: [string, string, string, string][] = [
  ["01", "Air state at rack inlet", "25 °C, sea level, dry", "ρ = 1.184 kg/m³ from the ideal-gas relation at 101.325 kPa"],
  ["02", "Specific heat of air", "cₚ = 1.005 kJ/(kg·K)", "Standard value at near-ambient conditions"],
  ["03", "Volumetric heat capacity", "ρ·cₚ = 1.19 kJ/(m³·K)", "The single number that governs everything below"],
  ["04", "Rack face, gross", "0.6 m × 2.0 m = 1.2 m²", "Conventional 19-inch rack front aperture"],
  ["05", "Net free area", "50% of gross = 0.60 m²", "Perforated door plus chassis intake obstruction; the softest assumption here"],
  ["06", "Face velocity, v", "1.5–5.0 m/s", "1.5–2.5 m/s is quiet and conventional; 5 m/s is a deliberately aggressive ceiling"],
  ["07", "ΔT across the IT", "10–25 K", "Inlet-to-exhaust rise; 25 K puts exhaust at 50 °C"],
];

/* Table 2 — sensible heat one rack of air can carry, kW. */
const GRID: { v: string; cfm: string; kwk: string; cells: string[] }[] = [
  { v: "1.5", cfm: "1,907", kwk: "1.07", cells: ["11", "16", "21", "27"] },
  { v: "2.5", cfm: "3,178", kwk: "1.79", cells: ["18", "27", "36", "45"] },
  { v: "3.5", cfm: "4,450", kwk: "2.50", cells: ["25", "37", "50", "62"] },
  { v: "5.0", cfm: "6,357", kwk: "3.57", cells: ["36", "54", "71", "89"] },
];

/* Table 3 / Figure 1 — the fan-power square law, one anchored baseline.
   The chart and the table below BOTH read this array, so a data fix can
   never leave a stale figure behind. share is a number so it can drive
   bar height; the table renders it back as a percentage string. */
const FANLAW: { q: number; flow: string; fan: string; share: number }[] = [
  { q: 20, flow: "1.00×", fan: "1.0", share: 5 },
  { q: 30, flow: "1.50×", fan: "3.4", share: 11 },
  { q: 40, flow: "2.00×", fan: "8.0", share: 20 },
  { q: 50, flow: "2.50×", fan: "15.6", share: 31 },
  { q: 60, flow: "3.00×", fan: "27.0", share: 45 },
  { q: 80, flow: "4.00×", fan: "64.0", share: 80 },
  { q: 100, flow: "5.00×", fan: "125.0", share: 125 },
];

const CHART_MAX = 125;

export default function LiquidCoolingInsightPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Why AI infrastructure is moving to liquid cooling"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />

      {/* 1 · HERO — editorial. No product shot; the numbers carry it. */}
      <HeroEditorial
        category="Thermal engineering · Analysis"
        title="Why AI infrastructure is moving to"
        accent="liquid cooling"
        lede="Air does not fail at high rack density. It gets expensive, on a curve steep enough to end the argument. Here is that calculation, with every assumption stated."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Why AI infrastructure is moving to liquid cooling", path: PATH },
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
          { value: "3,500×", label: "Water's volumetric heat capacity vs air" },
          { value: "16 kW", label: "A quiet conventional rack of air" },
          { value: "45%", label: "Modelled fan share of IT load at 60 kW" },
        ]}
      />

      {/* 2 · EXECUTIVE ANSWER — canvas glass panel */}
      <ExecutiveAnswer>
        Air stops being the right coolant not when physics forbids it, but when the fan power needed
        to move it becomes a material fraction of the load it cools. Heat removed rises linearly with
        airflow while fan power rises with its cube, so at fixed geometry a rack spending 5% of IT
        power on fans at 20 kW spends roughly 20% at 40 kW and 45% at 60 kW. That square-law penalty
        — not a thermodynamic wall — is why measured fleet densities have settled in the 10–30 kW
        band<Cite n={5} /> and why the densest AI racks now ship liquid-cooled with no air-cooled
        equivalent.<Cite n={4} />
      </ExecutiveAnswer>

      {/* 3 · THE CONSTANTS — prose with a rail */}
      <ProseWithRail
        id="constants"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {[
                ["#constants", "Two constants"],
                ["#calculation", "Worked calculation"],
                ["#square-law", "The square law"],
                ["#guidelines", "The guidelines"],
                ["#operators", "For operators"],
                ["#limitations", "What this does not prove"],
              ].map(([href, label]) => (
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
        <SectionHead eyebrow="First principles" title="Two constants decide the whole argument" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The first belongs to air. At 25 °C and sea level its density is near 1.184 kg/m³ and its
            specific heat near 1.005 kJ/(kg·K), so a cubic metre carries about 1.19 kJ per kelvin of
            temperature rise. Water carries roughly 4,180 kJ per cubic metre per kelvin.<Cite n={3} />{" "}
            That is about 3,500 times more heat per unit volume moved. Everything below follows: to
            shift heat in air you move a great deal of air, accept a large temperature rise, or both.
          </p>
          <p>
            The second constant belongs to fans, not air. Under the fan laws, volumetric flow scales
            with impeller speed, static pressure with its square, and shaft power with its cube.
            <Cite n={3} /> Hold a server&apos;s heatsinks, ducting and free area fixed, and doubling
            the airflow through it costs eight times the fan power. Heat removal is linear in flow;
            the energy to produce that flow is cubic. Two exponents, pulling against each other,
            inside the same box.
          </p>
        </div>
        <div style={{ ...eqStyle, marginTop: "2rem" }}>
          Q = ρ · c<sub>p</sub> · A · v · ΔT
          <br />
          <span style={{ color: "var(--ink-dim)" }}>
            Q [kW] · ρ·c<sub>p</sub> = 1.19 kJ/(m³·K) · A [m²] · v [m/s] · ΔT [K]
          </span>
        </div>
      </ProseWithRail>

      {/* 4 · FIGURE 1 — the page's visual centre, an original CSS chart */}
      <DataFigure
        id="square-law"
        eyebrow="Figure 1 · Original analysis"
        title="The economic wall arrives long before the"
        lede="Hold ΔT and geometry fixed and airflow scales linearly with load while fan power scales with its cube — so fan power as a share of IT load rises with the square of density. Bars past the 100% line are where the model refutes itself: the air handling would draw more than the compute it cools."
        surface="canvas"
        field="insight"
        caption="Figure 1 · Modelled server fan power as a share of IT power. Anchor: 5% of IT power at 20 kW/rack, fixed geometry, fixed ΔT. Illustrative, not measured — substitute your own fleet telemetry and the curve keeps its shape while every threshold moves."
      >
        <div
          style={{
            border: "1px solid var(--edge-bright)",
            borderRadius: 14,
            background: "var(--glass-bg-strong)",
            padding: "clamp(1.5rem, 3vw, 2.75rem)",
          }}
        >
          <div style={{ ...eqStyle, background: "transparent", border: 0, padding: 0, marginBottom: "2rem" }}>
            f(Q) = f₀ · (Q / Q₀)²
          </div>

          <div
            role="img"
            aria-label="Bar chart: modelled server fan power as a share of IT power rises from 5% at 20 kW per rack to 20% at 40 kW, 45% at 60 kW, 80% at 80 kW, and 125% at 100 kW."
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: `repeat(${FANLAW.length}, minmax(0, 1fr))`,
              gap: "clamp(0.5rem, 1.5vw, 1.5rem)",
              alignItems: "end",
              height: "clamp(240px, 34vh, 380px)",
              paddingTop: "1.5rem",
            }}
          >
            {/* 100% reference line — where fans out-draw the servers */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: `${(100 / CHART_MAX) * 100}%`,
                borderTop: "1px dashed var(--brand-deep)",
                pointerEvents: "none",
              }}
            >
              <span
                className="eyebrow"
                /* left, not right: the tallest bars sit on the right and
                   their value labels collided with this one. */
                style={{ position: "absolute", left: 0, top: "-1.35rem", color: "var(--brand-deep)" }}
              >
                Fan power = IT power
              </span>
            </div>

            {FANLAW.map((row) => (
              <div
                key={row.q}
                style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}
              >
                <span
                  className="metric"
                  style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)", marginBottom: "0.5rem", textAlign: "center" }}
                >
                  {row.share}%
                </span>
                <div
                  style={{
                    height: `${(row.share / CHART_MAX) * 100}%`,
                    borderRadius: "6px 6px 0 0",
                    background:
                      row.share >= 100
                        ? "linear-gradient(180deg, var(--cyan) 0%, var(--cyan-deep) 100%)"
                        : "linear-gradient(180deg, var(--brand-bright) 0%, var(--brand-deep) 100%)",
                    opacity: row.share >= 45 ? 1 : 0.72,
                  }}
                />
              </div>
            ))}
          </div>

          <div
            aria-hidden
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${FANLAW.length}, minmax(0, 1fr))`,
              gap: "clamp(0.5rem, 1.5vw, 1.5rem)",
              borderTop: "1px solid var(--edge-bright)",
              paddingTop: "0.75rem",
              marginTop: "0.25rem",
            }}
          >
            {FANLAW.map((row) => (
              <span key={row.q} className="eyebrow" style={{ justifyContent: "center" }}>
                {row.q} kW
              </span>
            ))}
          </div>
        </div>
      </DataFigure>

      {/* 5 · THE READING — prose, paper */}
      <ProseWithRail surface="paper">
        <SectionHead eyebrow="Reading the curve" title="Why 10–30 kW is not a preference" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            A 10% fan-power budget is exhausted at about 28 kW per rack; a 20% budget lasts to 40 kW.
            By 63 kW the fans draw half as much power as the servers they cool, and past 90 kW the
            model refutes itself — the air handling would consume more than the compute.
          </p>
          <p>
            Now set that against measurement. Uptime Institute&apos;s 2025 survey reports average
            rack densities rising slowly, &ldquo;driven by greater adoption of racks in the 10 kW to
            30 kW range&rdquo; (n = 709), while the weighted-average annual PUE sat at 1.54 (n = 681)
            — the sixth consecutive year that headline figure has barely moved.<Cite n={5} /> Read
            through the square law, that band stops looking like an industry preference and starts
            looking like the solution to an inequality: 10–30 kW is where a fixed-geometry air path
            keeps fan power in the single digits to low teens.
          </p>
          <p>
            The flat PUE is a measurement artefact as much as an efficiency plateau. PUE is total
            facility energy over IT energy, and server fans sit <span style={emph}>inside</span> the
            IT boundary.<Cite n={6} /> Every watt the square law adds to those fans lands in the
            denominator, not the numerator. A facility can push density hard, watch fan fraction
            climb from 5% toward 20%, and report an unchanged PUE the whole way.
          </p>
        </div>
      </ProseWithRail>

      {/* 6 · INK BEAT */}
      <QuoteMetric
        quote="The industry's headline efficiency metric is structurally blind to the cost that ends air cooling."
        attribution="Server fans sit inside the IT boundary of PUE"
        metric="1.19"
        label="kJ per m³ per K — what air carries"
        field="insight"
      />

      {/* 7 · ASSUMPTIONS — wide matrix, paper */}
      <MatrixTable
        id="calculation"
        eyebrow="Table 1 · Stated assumptions"
        title="Every input, and where it is soft"
        lede="A rack is not an unbounded duct. Face area is fixed and face velocity is bounded by noise and by the static pressure chassis fans can develop, leaving velocity and ΔT as the only free variables."
        surface="paper"
        head={["#", "Assumption", "Value", "Basis / caveat"]}
        rows={ASSUMPTIONS.map(([n, label, value, basis]) => [
          <span key={n} className="pill">{n}</span>,
          label,
          value,
          basis,
        ])}
      />

      {/* 8 · CAPABILITY GRID — wide matrix, canvas */}
      <MatrixTable
        eyebrow="Table 2 · Capability"
        title="How much heat one rack of air actually carries"
        lede="At 0.60 m² net free area the rack carries 0.60 · v · 1.19 kW per kelvin. A quiet, conventional rack — 1.5 m/s, 15 K rise — carries about 16 kW. Push to a hard 3.5 m/s and 20 K and the same rack reaches roughly 50 kW."
        surface="canvas"
        head={["Face velocity", "Airflow", "Capacity", "ΔT 10 K", "ΔT 15 K", "ΔT 20 K", "ΔT 25 K"]}
        rows={GRID.map((row) => [
          `${row.v} m/s`,
          `${row.cfm} CFM`,
          `${row.kwk} kW/K`,
          ...row.cells.map((c) => `${c} kW`),
        ])}
      />

      {/* 9 · FAN LAW TABLE — the numbers behind Figure 1, paper */}
      <MatrixTable
        eyebrow="Table 3 · The numbers behind Figure 1"
        title="Fan-power square law"
        lede="Carrying 120 kW in air would take 5 m/s and a 34 K rise, putting exhaust near 59 °C at a 25 °C inlet: a wind tunnel with a hot aisle nobody can work in. Not impossible — which is the point. The question is economic, not physical."
        surface="paper"
        head={["Rack load", "Airflow vs baseline", "Modelled fan power", "Share of IT power"]}
        rows={FANLAW.map((row) => [`${row.q} kW`, row.flow, `${row.fan} kW`, `${row.share}%`])}
      />

      {/* 10 · GUIDELINES — prose, canvas */}
      <ProseWithRail id="guidelines" surface="canvas">
        <SectionHead
          eyebrow="The standards"
          title="The guidelines already encode the contradiction"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            ASHRAE&apos;s TC 9.9 guidelines spent two decades widening air envelopes — class A4
            allows inlet air from 5 °C to 45 °C — and the same fifth edition adds an H1 class for
            high-density servers whose <span style={emph}>recommended</span> band, 18–22 °C, is
            narrower than the 18–27 °C recommended for classes A1 to A4.<Cite n={1} /> Both moves are
            correct, and they point in opposite directions. Warmer inlet air earns free cooling and a low PUE; colder inlet air buys back
            the ΔT headroom Table 2 shows density consuming. In air you get one. The committee&apos;s
            own white paper on liquid cooling entering mainstream facilities states the resolution:
            past a certain density, change the fluid rather than keep tuning the airflow.<Cite n={2} />
          </p>
          <p>
            Vendors have already voted with their product lines. NVIDIA&apos;s GB200 NVL72 packages
            36 Grace CPUs and 72 Blackwell GPUs into a single 72-GPU NVLink domain as a liquid-cooled
            design, with no air-cooled equivalent of that rack on the page.<Cite n={4} /> When the
            densest rack you can buy ships with one thermal option, the question stops being whether
            to use liquid and becomes where in the loop the heat exchanger goes — which is what the
            Open Compute Project&apos;s Cooling Environments work keeps multi-vendor,<Cite n={10} />{" "}
            and what federal-lab retrofit guidance addresses for operators without a clean sheet.
            <Cite n={9} />
          </p>
          <p>
            One term is routinely forgotten: elevation. At roughly 1,500 m the atmosphere is about
            14% thinner, so every figure in Table 2 falls by about 14%. Recovering that capacity
            means moving about 16% more air, which by the cube law costs about 55% more fan power.
            An air-cooled density target is site-specific. A cold plate&apos;s capture capability is
            not. Scale is why this matters beyond one rack: LBNL put US data-center electricity at
            176 TWh in 2023 — 4.4% of national consumption — on a path to 6.7%–12.0% of the 2028
            forecast,<Cite n={7} /> and the IEA&apos;s base case has global data-centre electricity
            consumption roughly doubling to around 945 TWh by 2030.<Cite n={8} />
          </p>
        </div>
      </ProseWithRail>

      {/* 11 · FOR OPERATORS — cards, paper */}
      <CardGrid
        id="operators"
        eyebrow="Practice"
        title="What this means for operators"
        surface="paper"
        columns={3}
        items={[
          { code: "01", title: "Specify a fan-power ceiling", body: "Not a density target. Put maximum server fan power as a percentage of IT load into the spec and let Figure 1 say which densities survive it." },
          { code: "02", title: "Stop reading flat PUE as healthy", body: "Instrument fan power separately — most out-of-band telemetry exposes it — and track it as a fraction of IT load." },
          { code: "03", title: "Size for the next refresh", body: "Getting the fluid decision wrong costs a rebuild; getting it early costs pumps and plumbing." },
          { code: "04", title: "Correct for elevation", body: "A density figure quoted at sea level overstates capability at 1,500 m by roughly 14%, and closing that gap in air costs about 55% more fan power." },
          { code: "05", title: "Keep an air path regardless", body: "Cold plates cool only what they touch; regulators, drives, NICs and power supplies still reject to air." },
          { code: "06", title: "Assign ΔT an owner", body: "Unowned, inlet-to-exhaust rise defaults to whatever chassis firmware decides — usually the conservative, high-airflow answer." },
        ]}
      />

      {/* 12 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="What this does not prove"
        eyebrow="Honest limits"
        lede="The calculation above is a model. Where it is thin:"
        items={[
          "The cube law assumes fixed geometry. Vendors change it every generation — taller heatsinks, vapour chambers, higher-static-pressure fans — and each change resets the anchor. The exponent survives; Figure 1's specific thresholds do not.",
          "The 5%-at-20 kW anchor is illustrative, not measured. Substitute your own fleet telemetry: the curve keeps its shape while every threshold moves.",
          "Net free area is the softest input. Fifty percent open area is a defensible mid-range, but a given rack may do materially better or worse, and every kW figure in Table 2 scales linearly with it.",
          "Air does not fail. Racks in the 30–50 kW range run in production today with containment, in-row cooling and rear-door heat exchangers. The argument is that they get expensive, not impossible.",
          "The Uptime density band is correlation, not causation. It is consistent with the square law but does not establish that fan economics caused it; hardware availability, power procurement and facility age all contribute.",
          "Liquid relocates the problem rather than deleting it. The heat still has to be rejected, and the loop brings pumping power, plumbing, chemistry and leak management. Nothing here is a cost-of-ownership comparison.",
          "No claim is made about any product's power draw. NVIDIA's page confirms the GB200 NVL72 is liquid-cooled but states no per-rack kW figure; the 120 kW above is illustrative, not a specification.",
        ]}
      />

      {/* 13 · PODOS — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="In the product" title="How PODOS treats the fluid decision" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            If density settles the fluid decision, the decision belongs in the factory. Each{" "}
            <Link href="/platform/podos-pod" style={linkStyle}>
              PODOS Pod
            </Link>{" "}
            is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with closed-loop{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
              direct-to-chip liquid cooling
            </Link>{" "}
            specified as part of the{" "}
            <Link href="/engineering/thermal-enclosure" style={linkStyle}>
              thermal enclosure
            </Link>{" "}
            rather than retrofitted into a room — fixing geometry and ΔT at design time instead of
            leaving them to chassis firmware.
          </p>
        </div>
      </ProseWithRail>

      {/* 14 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 15 · RELATED — paper */}
      <RelatedRail
        title="Related analysis"
        surface="paper"
        items={[
          { href: "/engineering/direct-to-chip-liquid-cooling", label: "ENGINEERING", title: "Direct-to-chip liquid cooling, explained" },
          { href: "/compare/liquid-cooling-vs-air-cooling", label: "COMPARE", title: "Liquid cooling vs air cooling" },
          { href: "/engineering/high-density-gpu-infrastructure", label: "ENGINEERING", title: "High-density GPU infrastructure" },
          { href: "/insights/warm-water-liquid-cooling-explained", label: "INSIGHT", title: "Warm-water liquid cooling, explained" },
        ]}
      />

      {/* 16 · CTA */}
      <CTABand
        title="Run the numbers against"
        accent="your density target"
        body="Bring the rack load, the geometry, and the site elevation. Engineering will tell you where the fan curve puts you."
        primary={{ href: "/estimate", label: "Size your deployment" }}
        secondary={{ href: "/engineering", label: "Engineering index" }}
        field="insight"
      />
    </main>
  );
}
