/**
 * /insights/closed-loop-cooling-and-data-center-water-use
 * Archetype E, insight. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Evergreen technical insight. Server component, no images, no client JS.
 * Original assets: (1) an architecture-to-water mapping table, (2) a worked
 * source-water calculation with stated assumptions and a break-even result,
 * (3) an original CSS chart of that break-even against the US grid average.
 * The chart and the table below it BOTH read the same BREAKEVEN array, so a
 * data fix can never leave a stale figure behind. Every external number cites
 * the source rail; PODOS numbers render only from claims.ts publishable
 * entries with their required qualifiers.
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
  MatrixTable,
  DataFigure,
  QuoteMetric,
  CardGrid,
  LimitsBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/insights/closed-loop-cooling-and-data-center-water-use";
const TITLE = "Closed-Loop Cooling and Where Data Center WUE Misleads";
const DESCRIPTION =
  "Facility water, source water, closed coolant loops and heat rejection are four different things. A table and a worked calculation on where WUE misleads.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "2024 United States Data Center Energy Usage Report (Shehabi et al.)",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf",
    date: "December 2024",
  },
  {
    n: 2,
    name: "ISO/IEC 30134-9:2022 — Data centres key performance indicators, Part 9: Water usage effectiveness (WUE)",
    publisher: "ISO/IEC",
    url: "https://www.iso.org/standard/77692.html",
    date: "2022",
  },
  {
    n: 3,
    name: "WP#35 — Water Usage Effectiveness (WUE): A Green Grid Data Center Sustainability Metric",
    publisher: "The Green Grid",
    url: "https://archive.thegreengrid.org/en/resources/library-and-tools/238-WP",
    date: "1 March 2011",
  },
  {
    n: 4,
    name: "Sustainable by design: next-generation datacenters consume zero water for cooling",
    publisher: "Microsoft",
    url: "https://www.microsoft.com/en-us/microsoft-cloud/blog/2024/12/09/sustainable-by-design-next-generation-datacenters-consume-zero-water-for-cooling/",
    date: "9 December 2024",
  },
  {
    n: 5,
    name: "Measuring energy and water efficiency for Microsoft datacenters (FY24–FY25 PUE and WUE)",
    publisher: "Microsoft",
    url: "https://datacenters.microsoft.com/sustainability/efficiency/",
    date: "accessed 2026-08-31",
  },
  {
    n: 6,
    name: "Our commitment to climate-conscious data center cooling",
    publisher: "Google",
    url: "https://blog.google/company-news/outreach-and-initiatives/sustainability/our-commitment-to-climate-conscious-data-center-cooling/",
    date: "21 November 2022",
  },
  {
    n: 7,
    name: "Advancing responsible water use at our data centers",
    publisher: "Google",
    url: "https://datacenters.google/water/",
    date: "accessed 2026-08-31",
  },
  {
    n: 8,
    name: "The Hidden Water Geography of U.S. Hyperscale Data Centers in the AI Era (Guidi & Dominici), arXiv:2607.02531",
    publisher: "arXiv",
    url: "https://arxiv.org/abs/2607.02531",
    date: "June 2026",
  },
  {
    n: 9,
    name: "Directive (EU) 2023/1791 on energy efficiency (recast), Article 12 — data centre reporting",
    publisher: "European Union (EUR-Lex)",
    url: "https://eur-lex.europa.eu/eli/dir/2023/1791/oj/eng",
    date: "September 2023",
  },
];

const linkStyle: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

const eqStyle: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: "1.02rem",
  lineHeight: 1.8,
  color: "var(--ink-strong)",
  background: "var(--glass-bg-strong)",
  border: "1px solid var(--edge-bright)",
  borderRadius: 10,
  padding: "1.1rem 1.25rem",
  overflowX: "auto",
};

const panelStyle: CSSProperties = {
  border: "1px solid var(--edge-bright)",
  borderRadius: 14,
  background: "var(--glass-bg-strong)",
  padding: "clamp(1.1rem, 2.5vw, 1.6rem)",
};

const bulletStyle: CSSProperties = {
  fontSize: "1rem",
  lineHeight: 1.78,
  color: "var(--ink-dim)",
};

/* ------------------------------------------------------------------ */
/* original asset 1 — architecture to water mapping                    */
/* ------------------------------------------------------------------ */
type Row = [code: string, arch: string, loop: string, rejection: string, siteWater: string, misleads: string];

const ARCHITECTURES: Row[] = [
  [
    "W-01",
    "Air-cooled room, air-cooled chiller or DX",
    "None — air is the only fluid touching IT",
    "Air-cooled condenser",
    "Effectively zero; humidification only",
    "Looks best on paper. LBNL states the tradeoff plainly: air-cooled chillers use no water and use more energy, which moves the water to the power plant.",
  ],
  [
    "W-02",
    "Air-cooled room, water-cooled chiller, open tower",
    "Closed chilled-water loop, open condenser loop",
    "Evaporative cooling tower",
    "High — evaporation plus blowdown",
    "LBNL's worst case, and the one WUE captures well. The error is generalising from it to every water-cooled design.",
  ],
  [
    "W-03",
    "Airside economiser with adiabatic assist",
    "None or partial",
    "Outside air, evaporative pre-cool in wet mode",
    "Low annual average, spiky in hot hours",
    "An annual average hides that consumption concentrates in the heatwave hours when the basin is most stressed.",
  ],
  [
    "W-04",
    "Direct-to-chip liquid, facility loop to open tower",
    "Closed technology loop, fixed coolant charge",
    "Evaporative cooling tower",
    "High — set entirely by the tower",
    "Read as proof that liquid cooling consumes water. The sealed loop consumes none; the tower consumes all of it.",
  ],
  [
    "W-05",
    "Direct-to-chip liquid, facility loop to dry cooler",
    "Closed technology loop, fixed coolant charge",
    "Dry cooler or air-cooled chiller",
    "Zero in operation after the initial fill",
    "WUE falls to about zero — true and incomplete. The fan and compressor energy replacing evaporation raises PUE, and therefore source water.",
  ],
  [
    "W-06",
    "Direct-to-chip liquid, dry cooler with adiabatic assist",
    "Closed technology loop, fixed coolant charge",
    "Dry cooler, wet mode on hot days",
    "Low annually, weather-driven, not zero",
    "Called dry in procurement documents. LBNL ranks adiabatically assisted dry coolers highest among the otherwise low-water designs.",
  ],
  [
    "W-07",
    "Any of the above, with heat exported for reuse",
    "Unchanged",
    "Partly displaced by the heat off-taker",
    "Falls in proportion to heat exported",
    "WUE has no term for exported heat, so displacing rejection load earns no credit in the metric that frames the water-permit conversation.",
  ],
];

/* ------------------------------------------------------------------ */
/* original asset 2 — the 1 MW worked result                           */
/* ------------------------------------------------------------------ */
const ONE_MW: Array<[string, string, string]> = [
  ["Site water consumed", "7.0 million litres", "0"],
  ["Facility electricity", "10,512 MWh", "11,388 MWh"],
  ["Source water in that electricity", "47.5 million litres", "51.5 million litres"],
  ["Total water consumed", "54.5 million litres", "51.5 million litres"],
  ["Reported site WUE", "0.8 L/kWh", "0"],
];

/* ------------------------------------------------------------------ */
/* original asset 3 — break-even sensitivity.                          */
/* Figure 2 and the table under it both read this array; `w` is numeric */
/* so it can drive bar height, and `wLabel` renders it back as text.    */
/* ------------------------------------------------------------------ */
const BREAKEVEN: { d: string; w: number; wLabel: string; note: string }[] = [
  { d: "0.05", w: 16.0, wLabel: "16.0 L/kWh", note: "Dry rejection wins on total water on any realistic grid." },
  {
    d: "0.10",
    w: 8.0,
    wLabel: "8.0 L/kWh",
    note: "Dry rejection still wins on an average US grid, but by roughly a third of what WUE implies.",
  },
  {
    d: "0.15",
    w: 5.3,
    wLabel: "5.3 L/kWh",
    note: "Margin nearly gone; a hydro-heavy or nuclear-heavy balancing authority can flip it.",
  },
  {
    d: "0.20",
    w: 4.0,
    wLabel: "4.0 L/kWh",
    note: "Below the US average. The dry-cooled site consumes more total water while reporting a WUE of zero.",
  },
];

/** Chart ceiling and the US data-center-weighted grid average (LBNL, 2023). */
const CHART_MAX = 16;
const US_AVERAGE = 4.52;

export default function ClosedLoopCoolingWaterPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Closed-loop cooling and data center water use: what WUE does and does not measure"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />

      {/* 1 · HERO — editorial. No product shot; the numbers carry it. */}
      <HeroEditorial
        code="INS-01"
        category="Water and cooling · Analysis"
        title="Closed-loop cooling and the four things people mean by"
        accent="data center water"
        lede="A closed coolant loop consumes nothing. Water is consumed at one stage only — heat rejection — and the metric the industry reports can only see part of it. Here is the mapping, and the worked calculation."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Closed-loop cooling and data center water use", path: PATH },
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
          { value: "12×", label: "Source water hidden by the site boundary, 2023 US fleet" },
          { value: "4.52 L/kWh", label: "Source water in US data-center electricity, 2023" },
          { value: "2.3×", label: "How far WUE overstates the saving in the worked case" },
        ]}
      />

      {/* 2 · EXECUTIVE ANSWER — canvas glass panel */}
      <ExecutiveAnswer>
        A closed coolant loop consumes no water. Neither does liquid cooling as such. Water is
        consumed at one stage only — heat rejection — and the metric the industry reports, water
        usage effectiveness, measures only the water crossing the site boundary. In the 2023 US
        fleet that boundary hid roughly twelve times more water than it disclosed: 66 billion litres
        consumed on site against nearly 800 billion litres consumed at the power plants supplying
        it.<Cite n={1} /> Any water decision made on site WUE alone is being made on about eight
        percent of the evidence.
      </ExecutiveAnswer>

      {/* 3 · FOUR CONCEPTS — prose with an anchor rail, paper */}
      <ProseWithRail
        id="four-concepts"
        surface="paper"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {[
                ["#four-concepts", "Four quantities, one word"],
                ["#mapping", "Architecture to water"],
                ["#calculation", "Worked calculation"],
                ["#breakeven", "The break-even test"],
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
        <SectionHead
          eyebrow="First principles"
          title="Four different quantities, one word"
          lede="Most arguments about data center water are people comparing four unlike quantities."
        />
        <div style={{ marginTop: "2rem", display: "grid", gap: "1.75rem" }}>
          <div>
            <h3 className="h3">1. Facility water — withdrawal versus consumption</h3>
            <p style={{ marginTop: "0.6rem" }}>
              What the site meter records. Withdrawal is what is taken from the source; consumption
              is the part that evaporates and does not return to the basin. A once-through system
              withdraws enormous volumes and consumes little; a tower withdraws modestly and
              consumes nearly all of it. WUE is defined on consumption per unit of IT energy
              <Cite n={2} /> — and was proposed in 2011 as a companion to PUE, never as a substitute
              for it.<Cite n={3} />
            </p>
          </div>
          <div>
            <h3 className="h3">2. Source water — the litres inside the kilowatt-hour</h3>
            <p style={{ marginTop: "0.6rem" }}>
              Thermal plants evaporate water to condense steam. LBNL puts the 2023 average at 4.52
              litres consumed per kilowatt-hour of electricity used by US data centers, against 4.35
              L/kWh for US electricity overall.<Cite n={1} /> A 2026 analysis of 472 US hyperscale
              facilities attributes about three-quarters of total operational water to generation
              rather than cooling.<Cite n={8} />
            </p>
          </div>
          <div>
            <h3 className="h3">3. The closed coolant loop</h3>
            <p style={{ marginTop: "0.6rem" }}>
              A sealed circuit carrying a fixed charge of treated fluid between cold plates and a
              heat exchanger. Microsoft describes exactly this for its zero-water design: filled
              during construction, then circulated without a fresh water supply.<Cite n={4} /> A
              closed loop has no consumption term. Make-up water is a maintenance event, not an
              operating input.
            </p>
          </div>
          <div>
            <h3 className="h3">4. The heat-rejection method</h3>
            <p style={{ marginTop: "0.6rem" }}>
              The last stage, where heat leaves for the atmosphere. Towers buy low approach
              temperatures with water; dry coolers buy zero water with fan and compressor energy.
              This is the only stage that consumes anything, and it is chosen almost independently of
              everything upstream of it.
            </p>
          </div>
        </div>
        <p style={{ marginTop: "1.75rem" }}>
          So &ldquo;does liquid cooling use water?&rdquo; is a malformed question. The real question
          is which rejection stage the loop terminates in — a siting decision, not a
          cooling-technology one. The same{" "}
          <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
            direct-to-chip architecture
          </Link>{" "}
          can be the highest-water or the zero-water option on the same drawing.
        </p>
      </ProseWithRail>

      {/* 4 · TABLE 1 — architecture to water, canvas */}
      <MatrixTable
        id="mapping"
        eyebrow="Table 1 · Original analysis"
        title="Mapping architecture to actual water consumption"
        lede="The last column is the point: in every row, site WUE is either measuring the wrong stage, averaging away the hours that matter, or silent on the term that dominates."
        surface="canvas"
        field="insight"
        head={["#", "Architecture", "Coolant loop", "Heat rejection", "On-site water", "Where WUE misleads"]}
        rows={ARCHITECTURES.map(([code, arch, loop, rejection, siteWater, misleads]) => [
          <span key={code} className="pill">
            {code}
          </span>,
          arch,
          loop,
          rejection,
          siteWater,
          misleads,
        ])}
      />

      {/* 5 · WORKED CALCULATION — assumptions and the 1 MW result, paper */}
      <ProseWithRail id="calculation" surface="paper">
        <SectionHead
          eyebrow="Original analysis"
          title="Worked calculation: what a zero-WUE site actually saves"
        />
        <div style={{ marginTop: "1.75rem" }}>
          <p>
            The rankings in W-01, W-02 and W-06 come from LBNL&apos;s cooling-system modelling, which
            also warns directly that a low site WUE is not necessarily a good one.<Cite n={1} />
          </p>
          <p>
            Microsoft&apos;s zero-water design is the clearest published version of this tradeoff: it
            avoids more than 125 million litres per year per datacenter, and the same disclosure
            notes a nominal increase in annual energy usage against its evaporative designs.
            <Cite n={4} /> Google has put a number on the same direction, reporting that water-cooled
            data centers use about 10% less energy than many air-cooled ones.<Cite n={6} /> That
            energy difference is the one worth pricing. Here it is, for one megawatt of IT load.
          </p>
        </div>

        <div style={{ ...panelStyle, marginTop: "2rem" }}>
          <p className="eyebrow">Stated assumptions</p>
          <ul className="mt-3 grid gap-2 list-disc pl-5">
            <li style={bulletStyle}>1 MW IT load, 8,760 h/yr — 8.76 GWh of IT energy.</li>
            <li style={bulletStyle}>
              Case A, evaporative rejection: annualised PUE 1.20, site WUE 0.8 L/kWh of IT energy —
              the baseline of the 2026 hyperscale study, whose scenario range is 0.2–1.5 L/kWh.
              <Cite n={8} />
            </li>
            <li style={bulletStyle}>Case B, closed loop to dry cooler: annualised PUE 1.30, site WUE 0.</li>
            <li style={bulletStyle}>
              Source-water intensity 4.52 L/kWh, LBNL&apos;s 2023 US data-center-weighted average.
              <Cite n={1} />
            </li>
            <li style={bulletStyle}>
              Same IT load, same year. Water embodied in construction, fluids and hardware is
              excluded.
            </li>
          </ul>
        </div>

        <div className="tblwrap" style={{ marginTop: "2rem" }}>
          <table className="tbl">
            <caption className="sr-only">
              Annual site water, facility electricity, source water and total water for an
              evaporative and a dry-cooled 1 MW configuration
            </caption>
            <thead>
              <tr>
                <th>Annual result, 1 MW IT</th>
                <th>A — evaporative</th>
                <th>B — closed loop, dry cooler</th>
              </tr>
            </thead>
            <tbody>
              {ONE_MW.map(([k, a, b]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <SectionHead eyebrow="Reading the result" title="The saving was relocated, not eliminated" />
        </div>
        <div style={{ marginTop: "1.75rem" }}>
          <p>
            WUE says the dry-cooled site saved 7.0 million litres. It saved 3.0 million. The metric
            overstates the benefit by a factor of about 2.3, because most of the apparent saving was
            not eliminated — it was relocated to a cooling tower at a power station upstream.
          </p>
          <p>
            Setting the site water saved equal to the source water added gives a break-even grid
            intensity that needs only two numbers an operator already has:
          </p>
        </div>
        <div style={{ ...eqStyle, marginTop: "1.5rem" }}>w* = WUE(evaporative) ÷ ΔPUE</div>
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Above a grid intensity of w*, going dry consumes more total water than staying wet.
            Holding WUE at 0.8 L/kWh and varying only the PUE penalty:
          </p>
        </div>
      </ProseWithRail>

      {/* 6 · FIGURE 1 — original CSS chart driven by the BREAKEVEN array, canvas */}
      <DataFigure
        id="breakeven"
        eyebrow="Figure 1 · Original analysis"
        title="Where the break-even crosses the"
        lede="Each bar is the grid water intensity at which dry rejection stops saving water. The dashed line is LBNL's 2023 US data-center-weighted average. A bar below that line is a configuration that reports a WUE of zero while consuming more total water than the evaporative design it replaced."
        surface="canvas"
        field="insight"
        caption="Figure 1 · Break-even grid water intensity w* as a function of the PUE penalty of going dry, holding site WUE at 0.8 L/kWh. Reference line: 4.52 L/kWh, LBNL's 2023 US data-center-weighted average. Illustrative — substitute your own balancing authority's intensity and the shape holds while every threshold moves."
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
            aria-label="Bar chart: break-even grid water intensity falls from 16.0 litres per kilowatt-hour at a 0.05 PUE penalty, to 8.0 at 0.10, 5.3 at 0.15, and 4.0 at 0.20 — the last of which sits below the 4.52 litres per kilowatt-hour US data-center average."
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: `repeat(${BREAKEVEN.length}, minmax(0, 1fr))`,
              gap: "clamp(0.75rem, 2vw, 2rem)",
              alignItems: "end",
              height: "clamp(240px, 34vh, 380px)",
              paddingTop: "1.5rem",
            }}
          >
            {/* US grid average — below this line, the ranking inverts */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: `${(US_AVERAGE / CHART_MAX) * 100}%`,
                borderTop: "1px dashed var(--brand-deep)",
                pointerEvents: "none",
              }}
            >
              <span
                className="eyebrow"
                style={{ position: "absolute", left: 0, top: "-1.35rem", color: "var(--brand-deep)" }}
              >
                US average grid · 4.52 L/kWh
              </span>
            </div>

            {BREAKEVEN.map((row) => (
              <div
                key={row.d}
                style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}
              >
                <span
                  className="metric"
                  style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)", marginBottom: "0.5rem", textAlign: "center" }}
                >
                  {row.w.toFixed(1)}
                </span>
                <div
                  style={{
                    height: `${(row.w / CHART_MAX) * 100}%`,
                    borderRadius: "6px 6px 0 0",
                    background:
                      row.w <= US_AVERAGE
                        ? "linear-gradient(180deg, var(--cyan) 0%, var(--cyan-deep) 100%)"
                        : "linear-gradient(180deg, var(--brand-bright) 0%, var(--brand-deep) 100%)",
                    opacity: row.w <= US_AVERAGE ? 1 : 0.78,
                  }}
                />
              </div>
            ))}
          </div>

          <div
            aria-hidden
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${BREAKEVEN.length}, minmax(0, 1fr))`,
              gap: "clamp(0.75rem, 2vw, 2rem)",
              borderTop: "1px solid var(--edge-bright)",
              paddingTop: "0.75rem",
              marginTop: "0.25rem",
            }}
          >
            {BREAKEVEN.map((row) => (
              <span key={row.d} className="eyebrow" style={{ justifyContent: "center" }}>
                ΔPUE {row.d}
              </span>
            ))}
          </div>
        </div>
      </DataFigure>

      {/* 7 · TABLE 2 — the numbers behind Figure 1, paper */}
      <MatrixTable
        eyebrow="Table 2 · The numbers behind Figure 1"
        title="Break-even grid intensity, row by row"
        lede="At a 0.20 penalty — plausible for a hot site where compressors run most of the year — the dry-cooled configuration consumes 55.4 million litres against the evaporative site's 54.5, while reporting a WUE of zero. The ranking has inverted and the metric cannot see it. The limit case is the general rule: WUE is exactly right only when the grid's water intensity is zero, and flatters dry rejection in proportion to how thirsty the local generation mix is."
        surface="paper"
        head={["ΔPUE of going dry", "Break-even grid intensity w*", "Reading"]}
        rows={BREAKEVEN.map((row) => [row.d, row.wLabel, row.note])}
      />

      {/* 8 · INK BEAT */}
      <QuoteMetric
        quote="A closed loop has no consumption term. Make-up water is a maintenance event, not an operating input."
        attribution="Water is consumed at one stage only — heat rejection"
        metric="8%"
        label="Share of the evidence a site-WUE decision rests on"
        field="insight"
      />

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
            title: "Specify the rejection stage, not the cooling technology",
            body: "“Closed-loop liquid cooling” in a specification says nothing about water until the rejection stage is named.",
          },
          {
            code: "02",
            title: "Carry PUE and WUE together or carry neither",
            body: (
              <>
                Low-WUE designs are usually the higher-energy ones, so a scorecard with one and not
                the other will reliably pick the wrong plant.<Cite n={1} /> Both hyperscalers that
                publish the pair report them together for exactly this reason — Microsoft&apos;s FY25
                disclosure gives a global PUE of 1.17 alongside a WUE of 0.27 L/kWh.<Cite n={5} />
              </>
            ),
          },
          {
            code: "03",
            title: "Get your balancing authority's water intensity before choosing",
            body: (
              <>
                The break-even test needs one regional number, and LBNL&apos;s county map shows wide
                variation around the 4.52 L/kWh national average.<Cite n={1} />
              </>
            ),
          },
          {
            code: "04",
            title: "Litres are not fungible",
            body: (
              <>
                WUE counts reclaimed effluent identically to potable groundwater in a stressed basin,
                and the 2026 study finds direct and electricity-related burdens landing in entirely
                different basins and grid regions.<Cite n={8} /> Google frames its own siting as
                balancing watershed condition against carbon rather than optimising a single number.
                <Cite n={7} />
              </>
            ),
          },
          {
            code: "05",
            title: "Price the hot hours, not the annual average",
            body: "Adiabatic designs consume water exactly when the basin is most stressed; an hourly wet-mode profile shows that, an annual WUE does not.",
          },
          {
            code: "06",
            title: "Expect to report it",
            body: (
              <>
                Article 12 of the EU energy efficiency recast already requires data centre reporting
                from 500 kW of installed IT power.<Cite n={9} />
              </>
            ),
          },
        ]}
      />

      {/* 10 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="What this does not prove"
        eyebrow="Honest limits"
        lede="This is a framework, not a verdict, and several inputs are softer than they look."
        items={[
          "It does not prove dry cooling is worse. In the base case it still wins — by 3.0 million litres rather than the 7.0 the metric claims. The inversion needs a large PUE penalty and a water-intensive grid together.",
          <>
            The source-water intensity is a modelled average built from regional generation mixes,
            not a meter reading.<Cite n={1} /> It does not track a site&apos;s power purchase
            agreements or behind-the-meter generation, either of which moves its real intensity. On
            dedicated wind the term approaches zero and the calculation collapses in favour of dry
            rejection.
          </>,
          <>
            The PUE penalty is assumed. It depends on climate, facility water temperature, chiller
            selection and load profile; Microsoft characterises its own only as nominal.
            <Cite n={4} />
          </>,
          <>
            The WUE input is a scenario value spanning 0.2–1.5 L/kWh,<Cite n={8} /> while
            LBNL&apos;s 2023 US fleet average sits just over 0.36 L/kWh.<Cite n={1} /> A lower true
            WUE lowers the threshold — the direction is stable, the magnitude is not.
          </>,
          "Consumption is not scarcity. Nothing here weights a litre by basin stress, recharge rate or potability, so identical totals can carry very different local consequences.",
          "Operational only. Water embodied in construction, in the semiconductors and in the cooling plant sits outside every figure here.",
        ]}
      />

      {/* 11 · PODOS + TAKEAWAYS — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="In the product" title="How this shapes a factory-built unit" />
        <div style={{ marginTop: "1.75rem" }}>
          <p>
            On a real project these land in three places: the{" "}
            <Link href="/engineering/thermal-enclosure" style={linkStyle}>
              thermal enclosure
            </Link>{" "}
            fixes how much heat must leave and at what temperature,{" "}
            <Link href="/deploy/site-power-readiness" style={linkStyle}>
              site power readiness
            </Link>{" "}
            establishes which grid you are actually drawing from, and{" "}
            <Link href="/engineering/data-center-heat-recovery" style={linkStyle}>
              heat recovery
            </Link>{" "}
            decides whether any of the load can be sold rather than rejected. Terms are defined in
            the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
              AI infrastructure glossary
            </Link>
            ; the upstream choice is covered in{" "}
            <Link href="/compare/liquid-cooling-vs-air-cooling" style={linkStyle}>
              liquid cooling versus air cooling
            </Link>
            .
          </p>
          <p>
            A modular unit forces the distinction to be explicit, because the coolant loop and the
            rejection stage cross the factory boundary at different points. Each{" "}
            <Link href="/platform/podos-pod" style={linkStyle}>
              PODOS Pod
            </Link>{" "}
            is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with its closed
            technology loop specified and filled as part of the enclosure. What that loop terminates
            in stays a site decision — taken with the local grid&apos;s water intensity and the local
            basin in front of you, alongside the{" "}
            <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
              power architecture
            </Link>{" "}
            that ultimately sets the source-water term.
          </p>
        </div>

        <div style={{ marginTop: "2.5rem" }}>
          <p className="eyebrow">Key takeaways</p>
          <ul className="mt-4 grid gap-3 list-disc pl-5">
            {[
              "Closed loops consume no water. Heat rejection does. Everything else in the chain is neutral.",
              "Site WUE measures one stage of a two-stage problem — and in the 2023 US fleet, the smaller stage by roughly twelve to one.",
              "The break-even test is w* = WUE ÷ ΔPUE. Above that grid intensity, going dry raises total water consumption while reporting zero.",
              "WUE is exactly correct only on a zero-water grid; its error grows with the water intensity of the mix behind the meter.",
              "Report PUE and WUE as a pair, name the rejection stage in the specification, and get the regional water intensity before either.",
            ].map((t) => (
              <li key={t.slice(0, 26)} style={bulletStyle}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </ProseWithRail>

      {/* 12 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
        <p className="eyebrow" style={{ marginTop: "1.5rem" }}>
          Review schedule — 90 days. Next verification due 2026-11-29.
        </p>
      </Section>

      {/* 13 · RELATED — paper */}
      <RelatedRail
        title="Related reading"
        surface="paper"
        items={[
          { href: "/engineering", label: "INDEX", title: "The engineering index" },
          {
            href: "/engineering/direct-to-chip-liquid-cooling",
            label: "ENGINEERING",
            title: "Direct-to-chip liquid cooling",
          },
          { href: "/platform", label: "PLATFORM", title: "The modular platform" },
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Bring your grid, your basin, and"
        accent="your rejection stage"
        body="Engineering will run the break-even against your balancing authority's water intensity before anything is specified."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/engineering", label: "Engineering index" }}
        field="insight"
      />
    </main>
  );
}
