/**
 * /insights/warm-water-liquid-cooling-explained
 * Archetype E, insight. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Evergreen technical insight. Server component, no client JS.
 * Original contribution: the coolant-temperature ladder (ASHRAE W-class ->
 * ambient chiller-free threshold -> ASHRAE design percentile -> free-cooling
 * hours), and the supply/return decoupling argument that free-cooling hours
 * and heat-reuse value are set by two different temperatures.
 *
 * The page's visual centre is an ORIGINAL CSS chart driven by the same LADDER
 * array that feeds Table 1 below it, so the figure can never drift from the
 * data. Deliberately no product photography: an insight page earns attention
 * with a number, not a render.
 *
 * Every external number traces to the source rail; PODOS numbers render only
 * from claims.ts publishable entries with their required qualifiers.
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
  ProseWithRail,
  DataFigure,
  MatrixTable,
  QuoteMetric,
  CardGrid,
  LimitsBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/insights/warm-water-liquid-cooling-explained";
const TITLE = "Warm-Water Liquid Cooling: Free Cooling and Heat Reuse";
const DESCRIPTION =
  "Why warmer coolant is a feature: how ASHRAE W-classes set the ambient threshold for chiller-free heat rejection, and what the return heat is actually worth.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9, Datacom Series)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org",
    date: "2021",
  },
  {
    n: 2,
    name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)",
    publisher: "ASHRAE TC 9.9",
    url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf",
    date: "May 2021",
  },
  {
    n: 3,
    name: "Liquid in the Rack: Liquid Cooling Your Data Center (O. Van Geet, NREL; NREL/PR-7A40-72046; ESIF operating data for 1 Sep 2016 – 31 Aug 2017)",
    publisher: "LBNL Center of Expertise / NREL (DOE)",
    url: "https://datacenters.lbl.gov/sites/default/files/Liquid_Cooling_Your_Data_Center-NREL-EE.pdf",
    date: "2018",
  },
  {
    n: 4,
    name: "Weather Data Viewer 2025 / Handbook—Fundamentals Ch. 14, climatic design conditions",
    publisher: "ASHRAE",
    url: "https://weather.ashrae.org/",
    date: "2025 ed., accessed 2026-08-31",
  },
  {
    n: 5,
    name: "Directive (EU) 2023/1791 on energy efficiency (recast), Art. 12 and Art. 26(6)",
    publisher: "European Union (EUR-Lex)",
    url: "https://eur-lex.europa.eu/eli/dir/2023/1791/oj/eng",
    date: "Sep 2023",
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
    name: "ISO/IEC 30134-6:2021 — Data centres key performance indicators, Part 6: Energy Reuse Factor (ERF)",
    publisher: "ISO/IEC",
    url: "https://www.iso.org/standard/71717.html",
    date: "2021",
  },
  {
    n: 8,
    name: "GB200 NVL72 product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    date: "accessed 2026-08-31",
  },
  {
    n: 9,
    name: "Cooling Environments / Cold Plate sub-project (cold-plate-to-CDU technology cooling system requirements)",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/wiki/Cooling_Environments/Cold_Plate",
    date: "ongoing",
  },
];

const linkStyle: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };
const emph: CSSProperties = { fontWeight: 600, color: "var(--ink-strong)" };

const assumptionStyle: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 12.5,
  lineHeight: 1.7,
  color: "var(--ink-dim)",
  letterSpacing: "0.01em",
};

/* ---------------- original asset: the coolant-temperature ladder ----------
   `amb` is the numeric form of `ambient` — it drives the bar heights in
   Figure 1 so the chart and Table 1 read the same array and cannot drift. */
const LADDER: Array<{
  code: string;
  cls: string;
  short: string;
  ambient: string;
  amb: number;
  ret: string;
  reuse: string;
  breaks: string;
}> = [
  {
    code: "WW-01",
    cls: "W17 — supply to 17 °C",
    short: "W17",
    ambient: "7 °C",
    amb: 7,
    ret: "27 °C",
    breaks: "Needs mechanical cooling for most of the year almost everywhere.",
    reuse: "Below almost every sink. Slab preheat or a heat pump, nothing else.",
  },
  {
    code: "WW-02",
    cls: "W27 — supply to 27 °C",
    short: "W27",
    ambient: "17 °C",
    amb: 17,
    ret: "37 °C",
    breaks: "Dry-only rejection fails on summer afternoons; needs a wet stage or a trim chiller.",
    reuse: "Low-temperature space heating. This is the NREL ESIF band in practice.",
  },
  {
    code: "WW-03",
    cls: "W32 — supply to 32 °C",
    short: "W32",
    ambient: "22 °C",
    amb: 22,
    ret: "42 °C",
    breaks: "Marginal in hot-humid climates without adiabatic assist.",
    reuse: "Ultra-low-temperature networks and return-side injection; short of a 55 °C supply.",
  },
  {
    code: "WW-04",
    cls: "W40 — supply to 40 °C",
    short: "W40",
    ambient: "30 °C",
    amb: 30,
    ret: "50 °C",
    breaks: "Exceeded only on design-day afternoons in most temperate climates.",
    reuse: "Within a small lift of a fourth-generation district-heating supply.",
  },
  {
    code: "WW-05",
    cls: "W45 — supply to 45 °C",
    short: "W45",
    ambient: "35 °C",
    amb: 35,
    ret: "55 °C",
    breaks: "Chip-side headroom, not the plant, becomes the binding constraint.",
    reuse: "Meets the 55 °C 4GDH distribution supply directly, with no heat pump.",
  },
  {
    code: "WW-06",
    cls: "W+ — supply above 45 °C",
    short: "W+",
    ambient: "35 °C and above",
    amb: 35,
    ret: "55 °C and above",
    breaks: "Cold-plate and interface-material qualification, and IT vendor support.",
    reuse: "Legacy network territory, still short of a conventional third-generation supply.",
  },
];

/** Chart ceiling in °C — above the highest threshold in LADDER, for headroom. */
const CHART_MAX = 42;

const HOURS: Array<[string, string, string, string]> = [
  ["0.4 %", "≈ 35 h", "≈ 8,725 h", "Trim plant runs a handful of afternoons a year."],
  ["1.0 %", "≈ 88 h", "≈ 8,672 h", "Trim plant is a seasonal asset, still full capacity."],
  ["2.0 %", "≈ 175 h", "≈ 8,585 h", "Free cooling dominates OPEX; CAPEX barely moves."],
];

const RAIL_LINKS: [string, string][] = [
  ["#answer", "The short answer"],
  ["#ladder", "The temperature ladder"],
  ["#hours", "Free-cooling hours"],
  ["#levers", "Supply vs return"],
  ["#operators", "For operators"],
  ["#limitations", "What this does not prove"],
  ["#podos", "In the product"],
];

export default function WarmWaterLiquidCoolingInsightPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Warm-water liquid cooling: why 45 °C is a feature, not a compromise"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />

      {/* 1 · HERO — editorial, paper. No product shot; the ladder carries it. */}
      <HeroEditorial
        category="Thermal engineering · Analysis"
        title="Warm-water liquid cooling: why 45 °C is a"
        accent="feature"
        lede="Every kelvin the IT concedes at the cold plate is a kelvin of climate the site no longer has to buy a compressor for. Here is the ladder that converts a coolant class into free-cooling hours — and into heat somebody will actually take."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Warm-water liquid cooling", path: PATH },
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
          { value: "35 °C", label: "Ambient a 45 °C loop stays compressor-free to" },
          { value: "55 °C", label: "4GDH distribution supply a W45 return meets unaided" },
          { value: "1.034", label: "NREL ESIF measured PUE, with no mechanical chillers" },
        ]}
      />

      {/* 2 · EXECUTIVE ANSWER — canvas glass panel */}
      <ExecutiveAnswer>
        Warm-water cooling is not a thermal compromise. It is a heat-rejection decision taken at the
        chip: ASHRAE names its liquid-cooling classes for the maximum supply temperature the IT
        equipment accepts, and every degree of that allowance converts almost one-for-one into
        ambient headroom for the rejection plant.<Cite n={1} /> Under ordinary approach assumptions a
        45 °C loop stays compressor-free up to roughly 35 °C ambient, where a 32 °C loop needs
        mechanical help above about 22 °C. The trap is that free-cooling hours and heat-reuse value
        are governed by two different temperatures — supply and return — and most designs optimise
        only one of them.
      </ExecutiveAnswer>

      {/* 3 · FIRST PRINCIPLES — prose with the on-this-page rail, paper */}
      <ProseWithRail
        id="first-principles"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {RAIL_LINKS.map(([href, label]) => (
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
        <SectionHead eyebrow="First principles" title="The temperature ladder, written out" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Air-cooled rooms hide their thermal budget inside a single number — the supply air
            temperature. A{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
              direct-to-chip loop
            </Link>{" "}
            exposes it as a chain of approach temperatures, and that is what makes it tractable.
            ASHRAE&apos;s fifth-edition thermal guidelines renamed the liquid-cooling classes after
            the number that matters — W17 (formerly W1), W27 (W2), W32 (W3), W40 (new), W45 (W4) and
            an open-ended W+ (W5), all sharing a 2 °C lower limit.<Cite n={1} />
            <Cite n={2} /> The committee tightened the definition at the same time: operating within
            a class requires full performance across the entire range of that class under nonfailure
            conditions, so the label is literally the warmest supply water the equipment will take
            unthrottled.<Cite n={2} /> The white paper frames the shift as a response to chip vendors
            raising thermal design power while lowering package case-temperature limits.
            <Cite n={2} /> The hardware follows: NVIDIA describes the GB200 NVL72 as connecting 36
            Grace CPUs and 72 Blackwell GPUs in a rack-scale, liquid-cooled design.<Cite n={8} />
          </p>
          <p>
            Walk the chain outward from the die and the economics fall out of arithmetic. Coolant
            leaves the CDU at the class temperature. The CDU&apos;s plate heat exchanger sits a few
            kelvin above the facility water it is fed. A dry cooler can only pull that facility water
            down to some approach above ambient dry bulb. Chiller-free operation therefore requires
            nothing more than ambient dry bulb staying below{" "}
            <span style={emph}>class temperature minus the two approaches</span>. Every kelvin the IT
            concedes at the cold plate is a kelvin of climate the site no longer has to buy a
            compressor for.
          </p>
        </div>

        <div className="panel" style={{ marginTop: "1.75rem", borderRadius: 12, padding: "1.1rem 1.25rem" }}>
          <p style={assumptionStyle}>
            <span className="pill" style={{ marginRight: "0.6rem" }}>
              ASSUMPTIONS
            </span>
            <br />
            CDU liquid-to-liquid approach 3 K · dry-cooler approach to ambient dry bulb 7 K ·
            technology-loop ΔT across the rack 10 K · single-phase water/glycol · no adiabatic or
            evaporative assist · ≥ 95 % of rack heat captured directly to liquid, per federal-lab
            practice<Cite n={3} />, with the residual air load rejected separately.
            <br />
            Ambient threshold = class temperature − 3 K − 7 K. Return = class temperature + 10 K.
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · FIGURE 1 — the page's visual centre, an original CSS chart, canvas */}
      <DataFigure
        id="ladder"
        eyebrow="Figure 1 · Original analysis"
        title="Climate headroom, bought one kelvin at a"
        lede="Each bar is the ambient dry bulb below which the loop rejects heat with no compressor running, derived from the stated assumptions: class temperature minus a 3 K CDU approach minus a 7 K dry-cooler approach. The ladder is almost linear because both approaches are fixed — which is precisely why the coolant class, not the plant, is the variable worth negotiating."
        surface="canvas"
        field="insight"
        caption="Figure 1 · Chiller-free ambient threshold by ASHRAE liquid-cooling class. Framework, not measurement: change either approach temperature and every bar moves. W+ is open-ended above 45 °C supply, so its bar is drawn at the 45 °C floor of the class."
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
            aria-label="Bar chart: chiller-free ambient dry-bulb threshold rises from 7 °C for a W17 loop to 17 °C for W27, 22 °C for W32, 30 °C for W40, and 35 °C for W45 and above."
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${LADDER.length}, minmax(0, 1fr))`,
              gap: "clamp(0.5rem, 1.5vw, 1.5rem)",
              alignItems: "end",
              height: "clamp(240px, 34vh, 380px)",
              paddingTop: "1.5rem",
            }}
          >
            {LADDER.map((row) => (
              <div
                key={row.code}
                style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}
              >
                <span
                  className="metric"
                  style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)", marginBottom: "0.5rem", textAlign: "center" }}
                >
                  {row.amb}
                  {row.short === "W+" ? "+" : ""} °C
                </span>
                <div
                  style={{
                    height: `${(row.amb / CHART_MAX) * 100}%`,
                    borderRadius: "6px 6px 0 0",
                    background:
                      row.amb >= 30
                        ? "linear-gradient(180deg, var(--cyan) 0%, var(--cyan-deep) 100%)"
                        : "linear-gradient(180deg, var(--brand-bright) 0%, var(--brand-deep) 100%)",
                    opacity: row.amb >= 22 ? 1 : 0.72,
                  }}
                />
              </div>
            ))}
          </div>

          <div
            aria-hidden
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${LADDER.length}, minmax(0, 1fr))`,
              gap: "clamp(0.5rem, 1.5vw, 1.5rem)",
              borderTop: "1px solid var(--edge-bright)",
              paddingTop: "0.75rem",
              marginTop: "0.25rem",
            }}
          >
            {LADDER.map((row) => (
              <span key={row.code} className="eyebrow" style={{ justifyContent: "center" }}>
                {row.short}
              </span>
            ))}
          </div>
        </div>
      </DataFigure>

      {/* 5 · TABLE 1 — the full ladder behind Figure 1, paper */}
      <MatrixTable
        eyebrow="Table 1 · The numbers behind Figure 1"
        title="Coolant class, threshold, return, and what the heat is worth"
        lede="Ambient threshold = class temperature − 3 K CDU approach − 7 K dry-cooler approach. Return = class temperature + the 10 K loop ΔT. The last two columns are where the framework stops being arithmetic and starts being a judgement about sinks."
        surface="paper"
        head={[
          "Ref",
          "ASHRAE class (max supply)",
          "Chiller-free up to",
          "Return at 10 K ΔT",
          "What the return heat can serve",
          "Where it breaks",
        ]}
        rows={LADDER.map((r) => [
          <span key={r.code} className="pill">
            {r.code}
          </span>,
          r.cls,
          r.ambient,
          r.ret,
          r.reuse,
          r.breaks,
        ])}
      />

      {/* 6 · READING THE LADDER — prose, canvas */}
      <ProseWithRail surface="canvas">
        <SectionHead
          eyebrow="Reading the ladder"
          title="Free-cooling hours are the wrong headline"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The reuse column is calibrated against real sinks rather than optimism. Fourth-generation
            district heating is defined around a 55 °C distribution supply and a 20 °C return
            <Cite n={6} />, which is exactly where a W45 loop lands without a heat pump — and exactly
            why a W32 loop does not. NREL&apos;s ESIF data center is the working proof of the lower
            band: 24 °C supply water, 35–40 °C return captured to heat offices and lab space, and no
            mechanical chillers at all.<Cite n={3} />
          </p>
          <p>
            Once the ambient threshold is known, hours come straight out of published climatology.
            ASHRAE&apos;s climatic design conditions report cooling design dry bulb at annual
            cumulative frequencies of 0.4 %, 1.0 % and 2.0 % across 12,424 processed stations.
            <Cite n={4} /> Those percentiles are exceedance fractions of the 8,760-hour year, so the
            conversion is one multiplication: find the percentile at which the site&apos;s design dry
            bulb equals your threshold, and free-cooling hours are 8,760 × (1 − p).
          </p>
        </div>
      </ProseWithRail>

      {/* 7 · TABLE 2 — percentile to hours, paper */}
      <MatrixTable
        id="hours"
        eyebrow="Table 2 · Climatology, converted"
        title="What a design percentile is actually telling you"
        lede="One multiplication turns an ASHRAE exceedance fraction into an annual hour count. The fourth column is the part the hour count conceals."
        surface="paper"
        head={[
          "Design percentile met",
          "Hours exceeded / yr",
          "Free-cooling hours / yr",
          "What it actually tells you",
        ]}
        rows={HOURS.map((r) => [r[0], r[1], r[2], r[3]])}
      />

      {/* 8 · INK BEAT */}
      <QuoteMetric
        quote="Free-cooling hours are an operating-expense metric; the trim plant is a capital one."
        attribution="The compressor leaves on a step function, not a gradient"
        metric="0.929"
        label="ESIF energy reuse effectiveness, first thermosyphon year"
        field="insight"
      />

      {/* 9 · SUPPLY VS RETURN — prose, canvas (light surface after ink) */}
      <ProseWithRail id="levers" surface="canvas">
        <SectionHead eyebrow="The decoupling" title="Supply and return are separate levers" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Here is the part the hours number conceals. Ninety-nine percent free cooling sounds like a
            chiller you no longer need. It is not. Those 88 remaining hours still demand 100 % of the
            thermal capacity, so the trim plant is sized for the design day regardless of how rarely
            it runs. Free-cooling hours are an operating-expense metric; the trim plant is a capital
            one, and warm water moves the first continuously while moving the second not at all —
            until the ambient threshold clears the site&apos;s extreme annual maximum dry bulb, at
            which point the compressor disappears entirely. That is a step function, not a gradient,
            and it is the only transition in this whole analysis worth designing around. It is also
            why the marginal value of a warmer class is wildly site-specific: the same 5 K is worth
            almost nothing in a cool maritime climate and worth an entire chiller plant in a hot arid
            one.
          </p>
          <p>
            The common failure in warm-water arguments is treating &ldquo;coolant temperature&rdquo;
            as one number. It is a pair. Free cooling is decided by the supply temperature, because
            that sets the ambient threshold. Heat reuse is decided by the return temperature, because
            that is what the off-taker consumes. They are joined by the loop ΔT, and ΔT is a design
            choice — a wider ΔT means lower flow, less pump energy, and a hotter return without
            touching the supply.
          </p>
          <p>
            ESIF proves the decoupling empirically. Its supply water is 24 °C, which is a modest class
            by the table above, yet it produces 35–40 °C return heat useful enough to warm a building
            on the coldest day of the year, and it does so with no chillers.<Cite n={3} /> It reaches
            that return from that supply by running a wide ΔT into 60–80 kW racks, and it protects the
            hottest silicon by cooling in series so that the most sensitive components see the coolest
            liquid.<Cite n={3} /> The published outcome is a PUE of 1.034 and an energy reuse
            effectiveness of 0.929 in its first year of thermosyphon operation.<Cite n={3} />
          </p>
          <p>
            So the honest version of &ldquo;warmer is better&rdquo; is narrower than the slogan.
            Raising the supply class buys climate tolerance. Widening ΔT buys reuse value and pump
            savings. Both spend from the same account — the thermal budget between the coolant and the
            chip&apos;s limit — and the binding constraint is the last device in a series path, not
            the average. A design that raises supply and widens ΔT at once has to prove the outlet
            device still meets its case temperature, which is precisely what the vendor-neutral
            cold-plate and CDU requirements coming out of the Open Compute Project&apos;s cooling work
            exist to make checkable across suppliers.<Cite n={9} />
          </p>
          <p>
            The reuse-metric definition is ISO/IEC 30134-6<Cite n={7} />; the European duties are
            Articles 12 and 26(6) of the 2023 energy-efficiency recast<Cite n={5} />. Both are worth
            reading before a heat-reuse business case is written, because both measure quantity rather
            than value.
          </p>
        </div>
      </ProseWithRail>

      {/* 10 · FOR OPERATORS — cards, paper */}
      <CardGrid
        id="operators"
        eyebrow="Practice"
        title="What this means for operators"
        surface="paper"
        columns={3}
        items={[
          {
            code: "01",
            title: "Specify the class, not the setpoint",
            body: "Procure IT against an ASHRAE W-class and you have bought a climate tolerance you can price. Procure against a nominal supply temperature and you have bought nothing enforceable.",
          },
          {
            code: "02",
            title: "Compute your ambient threshold before you shop for a site",
            body: "Class minus the CDU approach minus the dry-cooler approach is a single number, and it converts any candidate location into a design percentile in one lookup.",
          },
          {
            code: "03",
            title: "Decide whether you are buying hours or eliminating a plant",
            body: "If the threshold does not clear the site's extreme annual maximum, you are still building the compressor — so justify the warmer class on energy, not on capital.",
          },
          {
            code: "04",
            title: "Size the loop ΔT against the return your off-taker needs, then check the outlet device",
            body: "Reuse value is set on the hot side; the reliability risk sits on the same side.",
          },
          {
            code: "05",
            title: "Confirm the sink exists before you value the heat",
            body: "Energy reuse factor is standardised as reused energy over total energy consumed, and it counts only heat that leaves the data-centre boundary and is genuinely used.",
          },
          {
            code: "06",
            title: "In the EU, check the threshold that already applies to you",
            body: "Member States must ensure data centres above 1 MW total rated energy input utilise waste heat unless infeasibility is shown, with public reporting from 500 kW of installed IT power.",
          },
        ]}
      />

      {/* 11 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="What this does not prove"
        eyebrow="Honest limits"
        lede="The ladder above is a framework built on stated assumptions, not a measurement, and it fails in identifiable ways."
        items={[
          "The approach temperatures are assumptions. A 3 K CDU approach and a 7 K dry-cooler approach are ordinary but not universal; they depend on coil sizing, glycol fraction, fouling, and altitude. Tightening either is a capital purchase, and every ambient threshold in the table moves with them.",
          "A W-class is an acceptance rating, not a performance guarantee. It certifies unthrottled operation within the class. It does not say the machine draws the same power there — semiconductor leakage rises with junction temperature, and the residual air-cooled fraction gets harder to cool as the enclosure warms. Nothing cited here quantifies that penalty, and it works against the warm-water case.",
          "Design percentiles are climatology, not a forecast. They give exceedance fractions, not consecutive-hour durations. Whether the exceedance arrives as 88 scattered hours or as four consecutive afternoons changes thermal-storage and load-shed design completely, and the percentile alone cannot tell you which.",
          "ESIF is one facility in one climate. Its 1.034 PUE and 0.929 ERE come from a dry, high-altitude Colorado site with an adjacent building that wanted the heat. Those figures are evidence that the architecture works; they are not transferable numbers for any other site.",
          "Heat reuse is not shown to be economic anywhere. ERF and ERE measure how much energy is reused, not what it is worth. The European duty carries an explicit technical and economic feasibility exemption. A 55 °C return with no off-taker inside pipe distance has a value of zero.",
          "Nothing here is a PODOS measurement. No figure in this article was produced by PODOS hardware, and the framework should be re-derived against a specific vendor's cold-plate data before it drives a purchase.",
        ]}
      />

      {/* 12 · PODOS — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="In the product" title="How PODOS treats the coolant budget" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            A factory-integrated unit turns this from a site negotiation into a specification. The{" "}
            <Link href="/platform/podos-pod" style={linkStyle}>
              PODOS Pod
            </Link>{" "}
            is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with the cold
            plates, CDU, loop ΔT, and{" "}
            <Link href="/engineering/thermal-enclosure" style={linkStyle}>
              enclosure
            </Link>{" "}
            specified together rather than reconciled on site. Because the whole thermal chain is
            fixed before shipment, the ambient threshold is a known property of the unit rather than
            an outcome of commissioning — which is part of why PODOS{" "}
            <span data-claim="deployment-window">
              targets a 90-day window from order to commissioning
            </span>{" "}
            for a standard unit. Note that a unit at that scale also sits at the level where the
            European waste-heat duty attaches, which makes the return temperature a compliance
            variable, not only an efficiency one.<Cite n={5} />
          </p>
          <p>
            The downstream consequences are covered separately: what to do with the return heat in{" "}
            <Link href="/engineering/data-center-heat-recovery" style={linkStyle}>
              data-center heat recovery
            </Link>
            , the density that forces the loop in the first place in{" "}
            <Link href="/engineering/high-density-gpu-infrastructure" style={linkStyle}>
              high-density GPU infrastructure
            </Link>
            , the site-side prerequisites in{" "}
            <Link href="/deploy/site-power-readiness" style={linkStyle}>
              site power readiness
            </Link>
            , and the head-to-head in{" "}
            <Link href="/compare/liquid-cooling-vs-air-cooling" style={linkStyle}>
              liquid cooling vs air cooling
            </Link>
            . Terms used above are defined in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
              AI infrastructure glossary
            </Link>
            , and the wider technical set sits under{" "}
            <Link href="/engineering" style={linkStyle}>
              engineering
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 13 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 14 · RELATED — paper */}
      <RelatedRail
        title="Related analysis"
        surface="paper"
        items={[
          {
            href: "/engineering/data-center-heat-recovery",
            label: "ENGINEERING",
            title: "Data-center heat recovery",
          },
          {
            href: "/compare/liquid-cooling-vs-air-cooling",
            label: "COMPARE",
            title: "Liquid cooling vs air cooling",
          },
          {
            href: "/engineering/high-density-gpu-infrastructure",
            label: "ENGINEERING",
            title: "High-density GPU infrastructure",
          },
          {
            href: "/deploy/site-power-readiness",
            label: "DEPLOY",
            title: "Site power readiness",
          },
        ]}
      />

      {/* 15 · CTA */}
      <CTABand
        title="Set the coolant budget"
        accent="before you pick the site"
        body="Bring your target W-class, the site's design dry bulb, and the return temperature an off-taker would actually take. Engineering will tell you whether the compressor leaves."
        primary={{ href: "/estimate", label: "Size your deployment" }}
        secondary={{ href: "/engineering", label: "Engineering index" }}
        field="insight"
      />
    </main>
  );
}
