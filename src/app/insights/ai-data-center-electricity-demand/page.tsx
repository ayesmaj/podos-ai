/**
 * /insights/ai-data-center-electricity-demand — Archetype E, insight.
 * See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, no client JS. Original contribution: a side-by-side
 * reading of the IEA and LBNL projections that isolates WHICH assumptions
 * produce the gap, plus a worked one-at-a-time sensitivity on the IEA's own
 * published Base Case parameters. Figure 1 and Table 2 read the SAME
 * SENSITIVITY array, so the chart can never drift from the numbers.
 *
 * Deliberately no photography: an insight page earns attention with a
 * number, not a render. Every external figure is read from the primary
 * document; the single company claim carries a data-claim attribute.
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

const PATH = "/insights/ai-data-center-electricity-demand";
const TITLE = "AI Data Center Electricity Demand: What the Ranges Mean";
const DESCRIPTION =
  "The IEA and Berkeley Lab differ by about 50% on US data center electricity in 2030. Which assumptions drive that gap, and what the ranges mean for operators.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Key Questions on Energy and AI (World Energy Outlook Special Report), incl. Annex A Table A.1 and Table A.4",
    publisher: "IEA",
    url: "https://www.iea.org/reports/key-questions-on-energy-and-ai",
    date: "2026",
  },
  {
    n: 2,
    name: "Energy and AI (World Energy Outlook Special Report) — Executive summary",
    publisher: "IEA",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
    date: "Apr 2025",
  },
  {
    n: 3,
    name: "United States Data Center Energy Usage Report: 2025 Update (Smith, Hubbard, Newkirk et al.; DOI 10.71468/P1RP4F)",
    publisher: "Lawrence Berkeley National Laboratory (via DOE OSTI)",
    url: "https://www.osti.gov/biblio/3374245",
    date: "18 Jun 2026",
  },
  {
    n: 4,
    name: "2024 United States Data Center Energy Usage Report (LBNL-2001637; Shehabi et al.)",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf",
    date: "Dec 2024",
  },
  {
    n: 5,
    name: "2025 Long-Term Reliability Assessment",
    publisher: "North American Electric Reliability Corporation (NERC)",
    url: "https://www.nerc.com/globalassets/our-work/assessments/nerc_ltra_2025.pdf",
    date: "Jan 2026",
  },
  {
    n: 6,
    name: "Global Data Center Survey 2025 (keynote report)",
    publisher: "Uptime Institute",
    url: "https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2025.Annual.Survey.Report.pdf",
    date: "Jul 2025",
  },
];

const linkStyle: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

const noteStyle: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: "0.95rem",
  lineHeight: 1.75,
  color: "var(--ink-dim)",
  background: "var(--glass-bg-strong)",
  border: "1px solid var(--edge-bright)",
  borderRadius: 10,
  padding: "1.1rem 1.25rem",
};

/* ------------------------------------------------------------------ */
/* Original asset 1 — projections, assumptions, falsifiers             */
/* ------------------------------------------------------------------ */
type Row = { id: string; proj: string; scope: string; value: string; assume: string; wrong: string };

const PROJECTIONS: Row[] = [
  {
    id: "DC-01",
    proj: "IEA Base Case",
    scope: "World, 2030",
    value: "945 TWh",
    assume:
      "Accelerator shipments rise by a factor of 2.2 from 2025 to 2030, in line with IT-industry projections; fleet capacity factor holds near 48%; fleet PUE falls from 1.38 to 1.29.",
    wrong:
      "The fleet runs harder than 48% as the AI share grows, or accelerator shipments outrun the IT-industry forecast the model is fed.",
  },
  {
    id: "DC-02",
    proj: "IEA Lift-Off Case",
    scope: "World, 2030",
    value: "1,008 TWh",
    assume:
      "Stronger AI adoption, and bottlenecks in chips, energy equipment and grid connection are effectively resolved over time.",
    wrong:
      "The bottlenecks persist. The IEA's own 2026 update reports a high-bandwidth-memory shortage expected to last through at least end-2027 and places Lift-Off close to the Base Case in the near term.",
  },
  {
    id: "DC-03",
    proj: "IEA Headwinds Case",
    scope: "World, 2030",
    value: "833 TWh",
    assume:
      "AI monetisation disappoints, investment slows, and local constraints delay data center development.",
    wrong:
      "Capital keeps arriving. The same report puts announced 2026 capital expenditure by leading hyperscalers and neo-clouds at USD 715 billion, a 75% increase on 2025.",
  },
  {
    id: "DC-04",
    proj: "IEA High Efficiency Case",
    scope: "World, 2030",
    value: "868 TWh",
    assume:
      "Demand follows the Base Case, but rightsizing of models, continued model-efficiency gains and a shift toward edge computing offset it.",
    wrong:
      "Efficiency is spent rather than banked — cheaper inference per token buys more tokens, leaving facility energy flat or higher.",
  },
  {
    id: "DC-05",
    proj: "IEA Base Case",
    scope: "United States, 2030",
    value: "426 TWh",
    assume: "Same model and same shipment inputs as DC-01, resolved to the US region.",
    wrong: "See DC-06 — a second bottom-up model puts the same quantity 52% higher.",
  },
  {
    id: "DC-06",
    proj: "LBNL Reference Case",
    scope: "United States, 2030",
    value: "649 TWh",
    assume:
      "Shipment data through November 2025; accelerator service life 5 years; AI server utilization 80% for training and 20% for inference; AI idle power 20% of rated.",
    wrong:
      "Accelerators retire a year sooner (LBNL's own case: −9.1%) or shipments consolidate 15% lower (−10.8%).",
  },
  {
    id: "DC-07",
    proj: "LBNL High Inference Energy",
    scope: "United States, 2030",
    value: "782 TWh",
    assume:
      "Same installed equipment as DC-06, but AI idle power rises to 30% of rated and inference utilization to 30%.",
    wrong:
      "Inference stays lean. Note what this case does not change: installed capacity is identical to the Reference Case.",
  },
  {
    id: "DC-08",
    proj: "LBNL Compounded Uncertainty",
    scope: "United States, 2030",
    value: "521–843 TWh",
    assume:
      "Every parameter simultaneously at its extreme. LBNL states it does not assume these variables are correlated; the range is a stress test, not a distribution.",
    wrong:
      "Nothing. It is a bound. Treating its midpoint as a forecast is a category error, and its low bound still sits 22% above the IEA Base Case for the same country and year.",
  },
];

/* ------------------------------------------------------------------ */
/* Original asset 2 — one-at-a-time sensitivity, IEA Base Case 2030    */
/* Figure 1 (the CSS bar chart) and Table 2 BOTH read this array, so a  */
/* data fix can never leave a stale figure behind. `move` is the        */
/* absolute size of the shift in TWh, so it can drive bar height.       */
/* ------------------------------------------------------------------ */
type Sens = {
  id: string;
  change: string;
  result: string;
  delta: string;
  /** Absolute magnitude of the move from the published Base Case, TWh. */
  move: number;
  /** Short axis label for Figure 1. */
  tag: string;
  /** "param" = a conversion constant nobody argues about; "scenario" = the IEA's own published spread. */
  kind: "base" | "param" | "scenario";
};

const SENSITIVITY: Sens[] = [
  {
    id: "S-00",
    change: "Identity reproduced from the IEA's own published Base Case parameters",
    result: "950 TWh",
    delta: "reference (published total: 945 TWh; 0.5% rounding)",
    move: 0,
    tag: "Published Base Case",
    kind: "base",
  },
  {
    id: "S-01",
    change: "Fleet capacity factor 48% → 55%, installed capacity unchanged",
    result: "1,089 TWh",
    delta: "+139 TWh (+15%)",
    move: 139,
    tag: "CF 48% → 55%",
    kind: "param",
  },
  {
    id: "S-02",
    change: "Fleet capacity factor 48% → 60%, installed capacity unchanged",
    result: "1,188 TWh",
    delta: "+238 TWh (+25%)",
    move: 238,
    tag: "CF 48% → 60%",
    kind: "param",
  },
  {
    id: "S-03",
    change: "PUE stays at its 2025 level of 1.38 instead of falling to 1.29",
    result: "1,010 TWh",
    delta: "+60 TWh (+6%)",
    move: 60,
    tag: "PUE held at 1.38",
    kind: "param",
  },
  {
    id: "S-04",
    change: "For comparison — the IEA's own Base Case → Lift-Off Case",
    result: "1,008 TWh",
    delta: "+63 TWh (+6.7%)",
    move: 63,
    tag: "→ Lift-Off Case",
    kind: "scenario",
  },
  {
    id: "S-05",
    change: "For comparison — the IEA's own Base Case → Headwinds Case",
    result: "833 TWh",
    delta: "−112 TWh (−11.9%)",
    move: 112,
    tag: "→ Headwinds Case",
    kind: "scenario",
  },
];

const CHART_MAX = 238;

/* ------------------------------------------------------------------ */
/* Claims + the source numbers that carry their statistics             */
/* ------------------------------------------------------------------ */
type Claim = { t: string; c: number[] };

const cites = (c: number[]) => c.map((n) => <Cite key={n} n={n} />);

const OPERATORS: (Claim & { code: string; title: string })[] = [
  {
    code: "01",
    title: "Never size a site from a national forecast.",
    t: "The chain from TWh to your interconnection megawatts runs through a capacity-factor assumption that neither institution tests, and the 48-50% figure both use is a fleet average that includes enterprise server rooms. A dedicated accelerated-compute facility is not that fleet.",
    c: [1, 3],
  },
  {
    code: "02",
    title: "Track the parameters, not the headline.",
    t: "Three numbers move these projections: accelerator shipments, accelerator service life, and inference idle power plus utilization. Only the first is outside your control.",
    c: [3],
  },
  {
    code: "03",
    title: "Price energy risk and capacity risk separately.",
    t: "A scenario that adds 20.6% to energy and nothing to megawatts is survivable under a capacity reservation and expensive under an energy-linked contract.",
    c: [3],
  },
  {
    code: "04",
    title: "Measure the parameter the models guess at.",
    t: "Idle power fraction and per-node utilization are directly observable through out-of-band telemetry from day one. An operator who instruments this knows their own capacity factor within a quarter, while the national models are still estimating it.",
    c: [],
  },
  {
    code: "05",
    title: "Treat forecast revision as the design constraint, not forecast level.",
    t: "Berkeley Lab's 2024 report gave 2028 as a 325-580 TWh band; its 2025 update puts the Reference Case for that year at 464 TWh and extends to 649 TWh in 2030. Any commitment whose economics depend on a specific point on that curve will be re-litigated before it is commissioned.",
    c: [4, 3],
  },
];

const LIMITS: Claim[] = [
  {
    t: "It does not show that either institution is wrong. Both publish their assumptions and both publish ranges; Berkeley Lab attributes the divergence to assumptions about server and accelerator shipment trajectories, and says so in print.",
    c: [3],
  },
  {
    t: "It does not show that agreement would mean anything. Both are bottom-up shipment models drawing on commercial market-research datasets - Omdia for the IEA, Omdia and IDC for Berkeley Lab. A shared upstream error would propagate into both with no visible disagreement to warn you.",
    c: [1, 3],
  },
  {
    t: "It does not establish any probability. Berkeley Lab states its Compounded Uncertainty range sets every parameter to an extreme simultaneously and does not assume they are correlated; the IEA labels its 2035 figures exploratory. Averaging two endpoints produces a number with no defined meaning.",
    c: [3, 1],
  },
  {
    t: "The sensitivity calculation above is arithmetic, not evidence. Perturbing the IEA's published capacity factor shows how much the answer moves; it does not show that 48% is wrong. The IEA's own table has hyperscale capacity factor drifting slightly down, from 52% in 2025 to 51% in 2030, which may correctly reflect redundancy, phased fill and maintenance.",
    c: [1],
  },
  {
    t: "The agreement on 2024 is narrower evidence than it looks. It is agreement on one historical year drawn from overlapping shipment datasets, not agreement on method, and the two share-of-national-electricity figures rest on different denominators - Berkeley Lab's 11.8% uses the NERC forecast that was itself revised sharply upward in a single year.",
    c: [3, 5],
  },
  {
    t: "Nothing here is measured at a site. Both models are aggregates, and neither can say what a specific substation will deliver in a specific year - the only quantity that decides whether a project gets built.",
    c: [],
  },
];

const TAKEAWAYS: Claim[] = [
  {
    t: "The IEA and Berkeley Lab agree on history and diverge on the forecast: about 5% apart on US data center electricity in 2024 (183 vs 192 TWh), about 52% apart in 2030 (426 vs 649 TWh).",
    c: [1, 3],
  },
  {
    t: "That gap is not an accounting artifact: both are bottom-up models driven by the same kind of commercial shipment data, so agreement between them would not have been independent confirmation either.",
    c: [1, 3],
  },
  {
    t: "A 7-percentage-point change in the assumed fleet capacity factor moves the IEA's 2030 world figure more than twice as far as the entire distance from its central case to its most bullish one.",
    c: [1],
  },
  {
    t: "Energy risk and capacity risk are separable. Berkeley Lab's largest single sensitivity adds 20.6% to projected electricity and zero megawatts to installed capacity.",
    c: [3],
  },
  {
    t: "None of these ranges are probability distributions. Berkeley Lab calls its outer range a stress test; the IEA labels its 2035 figures exploratory.",
    c: [3, 1],
  },
];

const RAIL_LINKS: [string, string][] = [
  ["#answer", "The short answer"],
  ["#levers", "Three levers"],
  ["#projections", "What each projection assumes"],
  ["#sensitivity", "Worked calculation"],
  ["#capacity", "Energy is not capacity"],
  ["#operators", "For operators"],
  ["#limitations", "What this does not prove"],
];

export default function AiDataCenterElectricityDemandPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="AI data center electricity demand: what the ranges disagree about"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />

      {/* 1 · HERO — editorial paper. No product shot; the numbers carry it. */}
      <HeroEditorial
        code="INS-01"
        category="Energy modelling · Analysis"
        title="AI data center electricity demand: what the ranges"
        accent="disagree about"
        lede="Two bottom-up models, the same country and the same year, roughly 50% apart. The gap does not live in the scenario labels. It lives in three conversion constants, and only one of them is about AI."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "AI data center electricity demand", path: PATH },
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
          { value: "426 TWh", label: "IEA Base Case — US data centers, 2030" },
          { value: "649 TWh", label: "Berkeley Lab Reference Case — same country, same year" },
          { value: "~5%", label: "How far apart the same two models sit on 2024" },
          { value: "+20.6%", label: "Largest LBNL energy sensitivity — and zero extra megawatts" },
        ]}
      />

      {/* 2 · EXECUTIVE ANSWER — canvas glass panel */}
      <ExecutiveAnswer>
        The two most-cited authorities on this question now differ by about 50% on the same number.
        The IEA&apos;s Base Case puts United States data center electricity at 426 TWh in 2030;
        <Cite n={1} /> Berkeley Lab&apos;s Reference Case puts it at 649 TWh.
        <Cite n={3} /> They are only about 5% apart on 2024, so the disagreement lives entirely in
        forward assumptions — and it is not an accounting artifact, because both are bottom-up models
        built from the same kind of commercial server-shipment data. The useful conclusion for an
        operator is not a number but a hierarchy: the parameter that moves projected energy the most
        in Berkeley Lab&apos;s own sensitivity analysis changes installed megawatts by exactly zero,
        which means an energy forecast is close to worthless as an input to a capacity decision.
      </ExecutiveAnswer>

      {/* 3 · THREE LEVERS — prose with the on-this-page rail, paper */}
      <ProseWithRail
        id="levers"
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
        <SectionHead
          eyebrow="First principles"
          title="Three levers, and only one of them is about AI"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Published projections are usually quoted as headline totals with the assumptions stripped
            off, which is what makes them look like disagreements about AI. They are not. Every figure
            in the table below is a deterministic output of a small set of stated parameters, and the
            honest way to read a range is to ask what would have to be true for each endpoint to be the
            wrong one. The four-case framework was set out in the IEA&apos;s 2025 Energy and AI report
            <Cite n={2} /> and carried forward, updated, into its 2026 edition.
          </p>
          <p>
            Both models compute the same identity. Annual energy equals installed capacity multiplied
            by 8,760 hours and by a capacity factor; total facility energy equals IT energy multiplied
            by PUE. That means three independent levers set the answer: how much accelerated capacity
            is installed, how hard it runs, and what the infrastructure overhead costs. Public argument
            concentrates almost entirely on the first.
          </p>
          <p>
            The second lever is the one to watch. Across all four of the IEA&apos;s cases and every
            projection year, the published fleet capacity factor sits between 48% and 50% — it is
            effectively a constant, and it is never sensitivity-tested.<Cite n={1} /> Berkeley Lab
            independently uses 50% when it converts energy to interconnection capacity, and is candid
            that the figure is weakly evidenced: current utilization of interconnection capacity
            &quot;is not well documented but is estimated to be around 50% due to high redundancy
            requirements and maintenance needs.&quot;<Cite n={3} /> Two institutions converging on the
            same lightly-sourced constant is not corroboration.
          </p>
          <p>
            The third lever is quietly load-bearing too. The IEA&apos;s Base Case has fleet PUE
            improving from 1.38 in 2025 to 1.29 in 2030.<Cite n={1} /> Uptime Institute&apos;s 2025
            survey of more than 800 operators reports industry-average PUE essentially flat for about
            six years.<Cite n={6} /> Those two statements are not compatible without a large mix shift
            toward new-build hyperscale capacity — which is a real effect, but it is an assumption, not
            an observation.
          </p>
          <p style={{ fontSize: "0.92rem" }}>
            Sources for Table 1: IEA Key Questions on Energy and AI, Annex A<Cite n={1} />; LBNL 2025
            Update, Tables 1–2<Cite n={3} />
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · TABLE 1 — projections, assumptions, falsifiers. Canvas. */}
      <MatrixTable
        id="projections"
        eyebrow="Table 1 · Published projections"
        title="What each projection actually assumes"
        lede="The table states each projection with the assumption doing the most work and the observation that would falsify it."
        surface="canvas"
        head={["Ref", "Projection", "Scope", "Value", "Load-bearing assumption", "What would make it wrong"]}
        rows={PROJECTIONS.map((r) => [
          <span key={r.id} className="pill">
            {r.id}
          </span>,
          r.proj,
          r.scope,
          r.value,
          r.assume,
          r.wrong,
        ])}
      />

      {/* 5 · FIGURE 1 — the page's visual centre, an original CSS chart. Paper. */}
      <DataFigure
        id="sensitivity"
        eyebrow="Figure 1 · Original analysis"
        title="Worked calculation: which assumption actually moves the answer"
        lede="The following perturbs the IEA's own published Base Case parameters one at a time and compares each result against the spread the IEA itself publishes between its scenarios."
        surface="paper"
        field="insight"
        caption="Figure 1 · Absolute size of the shift in the IEA's 2030 world data center electricity figure, one parameter changed at a time. Cyan bars are conversion constants that carry no scenario label; blue bars are the IEA's own published distance from its central case to its bullish and bearish ones. Arithmetic on the IEA's published parameters, not a competing forecast."
      >
        <div
          style={{
            border: "1px solid var(--edge-bright)",
            borderRadius: 14,
            background: "var(--glass-bg-strong)",
            padding: "clamp(1.5rem, 3vw, 2.75rem)",
          }}
        >
          <div style={{ ...noteStyle, background: "transparent", border: 0, padding: 0, marginBottom: "2rem" }}>
            Stated assumptions: 2030 world installed capacity is held at the published 226 GW; total IT
            electricity at 732 TWh; energy = capacity × 8,760 h × capacity factor; total = IT × PUE;
            each row changes one parameter only. The 2035 figures are excluded because the IEA labels
            them exploratory.<Cite n={1} />
          </div>

          <div
            role="img"
            aria-label="Bar chart: moving the IEA's assumed fleet capacity factor from 48% to 55% shifts its 2030 world figure by 139 TWh and from 48% to 60% by 238 TWh, while holding PUE at 1.38 shifts it by 60 TWh. For comparison, the IEA's own published distance from its Base Case to its Lift-Off Case is 63 TWh and to its Headwinds Case 112 TWh."
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${SENSITIVITY.length}, minmax(0, 1fr))`,
              gap: "clamp(0.5rem, 1.5vw, 1.5rem)",
              alignItems: "end",
              height: "clamp(240px, 34vh, 380px)",
              paddingTop: "1.5rem",
            }}
          >
            {SENSITIVITY.map((s) => (
              <div
                key={s.id}
                style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}
              >
                <span
                  className="metric"
                  style={{ fontSize: "clamp(0.8rem, 1.15vw, 1.05rem)", marginBottom: "0.5rem", textAlign: "center" }}
                >
                  {s.move === 0 ? "—" : `${s.move}`}
                </span>
                <div
                  style={{
                    height: `${(s.move / CHART_MAX) * 100}%`,
                    borderRadius: "6px 6px 0 0",
                    background:
                      s.kind === "param"
                        ? "linear-gradient(180deg, var(--cyan) 0%, var(--cyan-deep) 100%)"
                        : "linear-gradient(180deg, var(--brand-bright) 0%, var(--brand-deep) 100%)",
                    opacity: s.kind === "scenario" ? 0.72 : 1,
                  }}
                />
              </div>
            ))}
          </div>

          <div
            aria-hidden
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${SENSITIVITY.length}, minmax(0, 1fr))`,
              gap: "clamp(0.5rem, 1.5vw, 1.5rem)",
              borderTop: "1px solid var(--edge-bright)",
              paddingTop: "0.75rem",
              marginTop: "0.25rem",
            }}
          >
            {SENSITIVITY.map((s) => (
              <span key={s.id} className="eyebrow" style={{ justifyContent: "center", textAlign: "center" }}>
                {s.tag}
              </span>
            ))}
          </div>

          <p className="eyebrow" style={{ marginTop: "1.5rem" }}>
            TWh shift · cyan = unargued conversion constant · blue = the IEA&apos;s own scenario spread
          </p>
        </div>
      </DataFigure>

      {/* 6 · TABLE 2 — the numbers behind Figure 1. Canvas. */}
      <MatrixTable
        eyebrow="Table 2 · The numbers behind Figure 1"
        title="One-at-a-time sensitivity on the IEA Base Case, 2030"
        lede="Each row changes exactly one published parameter and leaves the rest of the identity untouched."
        surface="canvas"
        head={["Ref", "Change from the published Base Case", "2030 world electricity", "Difference"]}
        rows={SENSITIVITY.map((s) => [
          <span key={s.id} className="pill">
            {s.id}
          </span>,
          s.change,
          s.result,
          s.delta,
        ])}
      />

      {/* 7 · READING THE RESULT + ENERGY IS NOT CAPACITY — prose, paper */}
      <ProseWithRail id="capacity" surface="paper">
        <SectionHead eyebrow="Reading the result" title="The labels absorb the attention" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The result is uncomfortable for the way this debate is normally conducted. Moving the
            assumed fleet capacity factor by seven percentage points — from 48% to 55%, a change nobody
            argues about in public — shifts the 2030 world figure by more than twice the entire
            distance between the IEA&apos;s central case and its most bullish one. Holding PUE flat,
            which is roughly what Uptime&apos;s operator survey has observed for six years,
            <Cite n={6} /> is worth about as much as the whole Base-to-Lift-Off gap on its own. The
            scenario labels absorb the attention; the conversion constants absorb the uncertainty.
          </p>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <SectionHead
            eyebrow="The separable risk"
            title="Energy is not capacity, and the two risks are separable"
          />
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Berkeley Lab&apos;s 2025 update makes the cleanest demonstration of this available
            anywhere, and it is easy to miss. Its High Inference Energy scenario raises projected 2030
            US data center electricity by 20.6% — the largest single-parameter move in the study,
            larger than a 15% swing in accelerator shipments — purely by raising AI server idle power
            from 20% to 30% of rated and inference utilization from 20% to 30%. Because the installed
            equipment is unchanged, the report states plainly that total capacity needs would be
            unchanged; those facilities would simply run at higher utilization.
            <Cite n={3} />
          </p>
          <p>
            For a developer that is a design rule, not a footnote: energy exposure and capacity
            exposure respond to different parameters and should be priced separately. It also means the
            two families of number circulating in this debate are not comparable at all. Berkeley Lab
            models consumption from installed equipment and puts requested interconnection capacity —
            and the generation that must be added to serve it — explicitly out of scope;
            <Cite n={3} /> a utility interconnection queue is the opposite, a register of requests.
            Comparing a queue figure to a consumption forecast sets requested optionality against
            modelled physics.
          </p>
          <p>
            The magnitudes are worth keeping in view. Applying its 50% utilization assumption, Berkeley
            Lab&apos;s Reference Case implies 148 GW of US interconnection capacity serving data centers
            in 2030, an average addition of 17.4 GW per year from 2024.<Cite n={3} /> Over the same
            horizon NERC raised its ten-year summer peak demand growth projection from 132 GW to 224 GW
            in a single annual revision — a 69% increase between consecutive editions of the same
            assessment.<Cite n={5} />
          </p>
        </div>
      </ProseWithRail>

      {/* 8 · INK BEAT */}
      <QuoteMetric
        quote="The scenario labels absorb the attention; the conversion constants absorb the uncertainty."
        attribution="One-at-a-time sensitivity on the IEA's own published Base Case parameters"
        metric="+238"
        label="TWh added by moving capacity factor 48% → 60%"
        field="insight"
      />

      {/* 9 · FOR OPERATORS — cards, paper (light surface after the ink beat) */}
      <CardGrid
        id="operators"
        eyebrow="Practice"
        title="What this means for operators"
        surface="paper"
        columns={3}
        items={OPERATORS.map((o) => ({
          code: o.code,
          title: o.title,
          body: (
            <>
              {o.t}
              {cites(o.c)}
            </>
          ),
        }))}
      />

      {/* 10 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="What this does not prove"
        eyebrow="Honest limits"
        lede="Two published models were read side by side and one of them was perturbed. Where that stops:"
        items={LIMITS.map((l) => (
          <span key={l.t.slice(0, 28)}>
            {l.t}
            {cites(l.c)}
          </span>
        ))}
      />

      {/* 11 · PODOS APPLICATION + KEY TAKEAWAYS — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="In the product" title="How PODOS treats forecast revision" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            That last point is the one PODOS is built around. A{" "}
            <Link href="/platform/podos-pod" style={linkStyle}>
              PODOS Pod
            </Link>{" "}
            is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>,
            which makes capacity a quantity added in increments as the forecast resolves rather than a
            single bet placed years ahead of the load. See{" "}
            <Link href="/engineering/monitoring-controls" style={linkStyle}>
              monitoring and controls
            </Link>{" "}
            for the telemetry layer,{" "}
            <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
              power architecture
            </Link>{" "}
            and{" "}
            <Link href="/deploy/site-power-readiness" style={linkStyle}>
              site power readiness
            </Link>{" "}
            for the interconnection questions, the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
              glossary
            </Link>{" "}
            for terms, and{" "}
            <Link href="/estimate" style={linkStyle}>
              the configurator
            </Link>{" "}
            to turn a target load into a unit count.
          </p>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <SectionHead eyebrow="Summary" title="Key takeaways" />
        </div>
        <ol style={{ marginTop: "1.5rem", display: "grid", gap: "0.85rem", paddingLeft: "1.35rem" }}>
          {TAKEAWAYS.map((k) => (
            <li key={k.t.slice(0, 28)}>
              {k.t}
              {cites(k.c)}
            </li>
          ))}
        </ol>
      </ProseWithRail>

      {/* 12 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED — paper */}
      <RelatedRail
        title="Related reading"
        surface="paper"
        items={[
          { href: "/engineering", label: "INDEX", title: "The engineering index" },
          {
            href: "/engineering/high-density-gpu-infrastructure",
            label: "ENGINEERING",
            title: "High-density GPU infrastructure",
          },
          {
            href: "/compare/modular-ai-data-center-vs-traditional-data-center",
            label: "COMPARE",
            title: "Modular vs traditional AI data centers",
          },
        ]}
      />

      {/* 14 · CTA — ink */}
      <CTABand
        title="Turn a load target into"
        accent="a unit count"
        body="Bring the megawatts you can actually interconnect, not the terawatt-hours a national model projects. Engineering will size the rest."
        primary={{ href: "/estimate", label: "Size your deployment" }}
        secondary={{ href: "/engineering", label: "Engineering index" }}
        field="insight"
      />
    </main>
  );
}
