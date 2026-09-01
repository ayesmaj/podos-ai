/**
 * /insights/how-to-evaluate-ai-infrastructure-claims — evergreen insight.
 * Archetype E, insight. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, no client JS. Original asset: an eight-domain evidence
 * checklist that borrows the maturity scale each domain already has, plus a
 * worked screening ratio rendered as an original CSS scale figure driven by
 * the same BAND_ZONES / BANDS data that feeds the table below it — so the
 * figure can never drift from the table.
 *
 * PODOS numbers render only from claims.ts publishable entries with their
 * required qualifiers; the self-assessment section deliberately states which
 * artifacts do NOT exist.
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

const PATH = "/insights/how-to-evaluate-ai-infrastructure-claims";
const TITLE = "How to Evaluate AI Infrastructure Claims: A Checklist";
const DESCRIPTION =
  "An evidence checklist for AI infrastructure vendors: readiness level, grid interconnection, factory inspection, benchmark method, patents, references, capital.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Technology Readiness Levels (TRL 1–9 definitions)",
    publisher: "NASA",
    url: "https://www.nasa.gov/directorates/somd/space-communications-navigation-program/technology-readiness-levels/",
    date: "accessed 2026-08-31",
  },
  {
    n: 2,
    name: "Explainer on the Interconnection Final Rule (Order No. 2023)",
    publisher: "Federal Energy Regulatory Commission",
    url: "https://www.ferc.gov/explainer-interconnection-final-rule",
    date: "final rule issued 28 Jul 2023",
  },
  {
    n: 3,
    name: "News: Data centre electricity use surged in 2025, even with tightening bottlenecks",
    publisher: "IEA",
    url: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions",
    date: "accessed 2026-08-31",
  },
  {
    n: 4,
    name: "New brief explores implementation of ICC/MBI Standards 1200 and 1205 for off-site construction",
    publisher: "International Code Council / Modular Building Institute",
    url: "https://www.iccsafe.org/building-safety-journal/bsj-technical/new-brief-explores-implementation-of-icc-mbi-standards-1200-and-1205-for-off-site-construction/",
    date: "standards 2021 ed.",
  },
  {
    n: 5,
    name: "MLPerf Inference: Datacenter — divisions, availability categories, required disclosures",
    publisher: "MLCommons",
    url: "https://mlcommons.org/benchmarks/inference-datacenter/",
    date: "accessed 2026-08-31",
  },
  {
    n: 6,
    name: "General MLPerf Submission Rules (submission_rules.adoc)",
    publisher: "MLCommons",
    url: "https://github.com/mlcommons/policies/blob/master/submission_rules.adoc",
    date: "accessed 2026-08-31",
  },
  {
    n: 7,
    name: "MLPerf Inference Benchmark (Reddi et al.), arXiv:1911.02549",
    publisher: "arXiv",
    url: "https://arxiv.org/abs/1911.02549",
    date: "2019",
  },
  {
    n: 8,
    name: "ISO/IEC 30134-2:2016 — Data centres, key performance indicators, Part 2: Power usage effectiveness (PUE)",
    publisher: "ISO/IEC",
    url: "https://www.iso.org/standard/63451.html",
    date: "2016",
  },
  {
    n: 9,
    name: "Global Data Center Survey 2025 — average PUE little changed for the sixth consecutive year",
    publisher: "Uptime Institute Intelligence",
    url: "https://intelligence.uptimeinstitute.com/resource/uptime-institute-global-data-center-survey-2025",
    date: "2025",
  },
  {
    n: 10,
    name: "Data center efficiency (fleet-wide trailing-twelve-month PUE)",
    publisher: "Google",
    url: "https://datacenters.google/efficiency/",
    date: "accessed 2026-08-31",
  },
  {
    n: 11,
    name: "Patent search tools — Patent Public Search, Patent Center, Assignment Center",
    publisher: "USPTO",
    url: "https://www.uspto.gov/patents/search",
    date: "accessed 2026-08-31",
  },
  {
    n: 12,
    name: "EDGAR Full-Text Search (Form D notices of exempt offering)",
    publisher: "U.S. Securities and Exchange Commission",
    url: "https://www.sec.gov/edgar/search/",
    date: "accessed 2026-08-31",
  },
  {
    n: 13,
    name: "GB200 NVL72 product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    date: "accessed 2026-08-31",
  },
];

const linkStyle: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };
const emph: CSSProperties = { color: "var(--ink-strong)", fontWeight: 600 };

const eqStyle: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
  lineHeight: 1.8,
  color: "var(--ink-strong)",
  background: "var(--glass-bg-strong)",
  border: "1px solid var(--edge-bright)",
  borderRadius: 10,
  padding: "1.1rem 1.25rem",
  letterSpacing: "0.01em",
};

/* ------------------------------------------------------------------ */
/* the original asset: the checklist                                   */
/* ------------------------------------------------------------------ */
type Row = {
  code: string;
  domain: string;
  ask: string;
  good: string;
  artifact: string;
  cite?: number[];
};

const CHECKLIST: Row[] = [
  {
    code: "EC-01",
    domain: "System maturity",
    ask: "At what readiness level, in which environment?",
    good:
      "A level on a named scale. NASA's ladder separates a laboratory proof-of-concept (TRL 3) from a functional prototype (TRL 6) and a system proven in operation (TRL 9).",
    artifact: "Test report with date, environment, and witnesses; photographs of the article tested, not a render of the one designed.",
    cite: [1],
  },
  {
    code: "EC-02",
    domain: "Grid interconnection",
    ask: "For this site, who owns the energization date?",
    good:
      "A named utility or ISO, a queue position, the study milestone reached, and a date in writing. Under FERC's first-ready, first-served cluster process, a queue position is not a study result, and a study result is not an executed agreement.",
    artifact: "Interconnection request receipt, cluster study assignment, executed interconnection or service agreement.",
    cite: [2, 3],
  },
  {
    code: "EC-03",
    domain: "Manufacturing readiness",
    ask: "Who inspects the factory, and who accepts the unit on site?",
    good:
      "A named third-party in-plant inspection agency and an acceptance path with the destination authority having jurisdiction. ICC/MBI 1200 covers the plant's quality process; 1205 covers who verifies it.",
    artifact: "Inspection agency approval, plant audit reports, AHJ correspondence for the destination.",
    cite: [4],
  },
  {
    code: "EC-04",
    domain: "Performance benchmarks",
    ask: "Could someone outside your company reproduce this?",
    good:
      "A submission shaped like MLPerf's Closed division: the reference model unmodified, a published system description, a link to the code, and an availability category saying whether the hardware can be bought — Available, Preview, or research/internal.",
    artifact: "A published result entry with system description and code, or full disclosure of model, dataset, precision, hardware, baseline, and date.",
    cite: [5, 6, 7],
  },
  {
    code: "EC-05",
    domain: "Efficiency claims",
    ask: "Designed or measured — at which category, boundary, and period?",
    good:
      "ISO/IEC 30134-2 defines PUE with measurement categories precisely because a bare ratio is not comparable. Name the category, the boundary, the averaging period, and whether the figure is design intent or measurement.",
    artifact: "A metering plan mapped to the standard's categories, plus the reporting period. Google publishes a fleet-wide trailing-twelve-month PUE — the shape of a checkable number.",
    cite: [8, 10],
  },
  {
    code: "EC-06",
    domain: "Intellectual property",
    ask: "Which numbers?",
    good:
      "Publication numbers for pending applications and patent numbers for grants, with jurisdiction and status. A claim count is a filing statistic, not a right; pending is not granted.",
    artifact: "Records the buyer pulls from USPTO Patent Public Search, plus assignment records showing current ownership.",
    cite: [11],
  },
  {
    code: "EC-07",
    domain: "References",
    ask: "Who has operated this, and may we call them?",
    good:
      "A named reference willing to take a call, or an anonymised deployment given by size, date, and workload with an operator reachable under NDA. Confidentiality explains a missing name, not a missing deployment.",
    artifact: "A reference call, a site visit, or an agreement given by scope and execution date — distinguished from a non-binding expression of interest or an exploratory discussion.",
  },
  {
    code: "EC-08",
    domain: "Capital and risk",
    ask: "What does the next tranche buy, and what stops without it?",
    good:
      "A use-of-proceeds statement tied to milestones, and the company's own list of its likeliest failure modes. A vendor who cannot name its top three risks has not looked or will not say.",
    artifact: "Offering documents. For a US private offering, the Form D notice is public on EDGAR, checkable without asking the company.",
    cite: [12],
  },
];

const RED_FLAGS = [
  "A number without its qualifier: designed, target, measured, or third-party verified.",
  "A render standing in where a photograph would settle the question.",
  "“Up to” without the condition that produces the maximum.",
  "A benchmark quoted without its baseline, hardware, or date.",
  "A timeline that silently excludes the interconnection and the permit.",
  "A patent claim count offered in place of a patent number.",
];

/* The screening-ratio judgement bands. BANDS feeds the table; BAND_ZONES
   places the same three ranges on the Figure 1 scale, so the figure and the
   table can never disagree. */
const BANDS: [string, string, string][] = [
  [
    "Below ~2 kW",
    "Accelerators alone would consume nearly all provisioned capacity, leaving nothing for balance of system.",
    "Is the nameplate an IT-load figure presented as a service rating, or is the accelerator count aspirational?",
  ],
  [
    "~3–10 kW",
    "Sized for the whole system plus headroom — the ordinary shape for a dense liquid-cooled unit.",
    "What sustained load, as a fraction of nameplate, is the cooling designed to remove continuously?",
  ],
  [
    "Above ~15 kW",
    "Either deliberate oversizing for future refreshes, or capacity the thermal design cannot use.",
    "Which limit binds first — is the unit heat-limited or power-limited?",
  ],
];

const SCALE_MAX = 20; // kW per accelerator — axis ceiling for Figure 1
const RATIO = 7.8; // 1,000 kW ÷ 128 designed accelerators

const BAND_ZONES: { from: number; to: number; label: string; tone: "edge" | "core" }[] = [
  { from: 0, to: 2, label: "Below ~2 kW", tone: "edge" },
  { from: 3, to: 10, label: "~3–10 kW", tone: "core" },
  { from: 15, to: SCALE_MAX, label: "Above ~15 kW", tone: "edge" },
];

const pct = (kw: number) => (kw / SCALE_MAX) * 100;

const RAIL_LINKS: [string, string][] = [
  ["#answer", "The short answer"],
  ["#thesis", "The failure mode"],
  ["#checklist", "The evidence checklist"],
  ["#worked-check", "A worked cross-check"],
  ["#bands", "Reading the ratio"],
  ["#operators", "For operators"],
  ["#limitations", "What this does not prove"],
  ["#podos", "Running it on PODOS"],
];

export default function EvaluateAiInfrastructureClaimsPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="How to evaluate AI infrastructure claims"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />

      {/* 1 · HERO — editorial, paper. No product shot; the checklist carries it. */}
      <HeroEditorial
        category="Procurement method · Analysis"
        code="INS-01"
        title="How to evaluate AI infrastructure"
        accent="claims"
        lede="Most AI-infrastructure claims are not false. They are unfalsifiable as written, because no artifact is named that could settle them. The useful question is therefore not whether a claim is true but which document would prove it, and whether that document exists yet. This page turns that into an eight-domain checklist and runs it on PODOS."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "How to evaluate AI infrastructure claims", path: PATH },
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
          { value: "8", label: "Evidence domains, each borrowing an existing scale" },
          { value: "7.8 kW", label: "Screening ratio: 1 MW designed ÷ 128 designed GPUs" },
          { value: "6th", label: "Consecutive year average PUE barely moved (Uptime 2025)" },
        ]}
      />

      {/* 2 · EXECUTIVE ANSWER — canvas glass panel */}
      <ExecutiveAnswer>
        <p>
          Evaluate an AI-infrastructure claim by asking which document would settle it, then asking
          whether that document exists yet. Three things establish it. The{" "}
          <strong style={emph}>qualifier</strong> — designed, target, measured, or third-party
          verified. The <strong style={emph}>boundary</strong> — what sat inside the measurement,
          over what period, and what was excluded. The <strong style={emph}>artifact</strong> — the
          dated test report, interconnection study milestone, in-plant inspection approval,
          published benchmark entry with system description and code, or patent number a buyer can
          pull without asking the vendor.
        </p>
        <p style={{ marginTop: "1.1rem" }}>
          Eight domains cover nearly everything that matters: system maturity, grid interconnection,
          manufacturing readiness, performance benchmarks, efficiency, intellectual property,
          references, and capital. Each borrows its scale from a discipline that already solved the
          disclosure problem, so the buyer is not inventing a standard mid-negotiation. Where the
          artifact does not exist yet, the accurate label is <em>unverified</em> — not false, and
          not silence. The checklist below is the working form of that, and the last two sections
          state plainly what it cannot settle.
        </p>
      </ExecutiveAnswer>

      {/* 3 · THESIS — prose with the sticky TOC rail, paper */}
      <ProseWithRail
        id="thesis"
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
          title="The failure mode is disclosure, not deception"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The claims that cost money are rarely lies. They are statements whose truth conditions
            were never specified: a capacity figure that never says whether it is a service rating
            or an operating load, a timeline that never says which permits it assumes, an efficiency
            ratio that never says what sat inside the boundary. Neither party&apos;s belief is
            testable.
          </p>
          <p>
            The fix is not more scepticism. Every domain below belongs to a discipline that already
            solved this. Spaceflight has readiness levels.<Cite n={1} /> Machine learning has
            divisions, availability categories, and published code.<Cite n={5} />
            <Cite n={7} /> Efficiency has an ISO/IEC standard with measurement categories.
            <Cite n={8} /> Off-site construction has an inspection standard naming who verifies the
            plant.<Cite n={4} /> Grid connection has a regulated queue with study milestones.
            <Cite n={2} /> Patents have numbers.<Cite n={11} /> The checklist makes the borrowing
            explicit, so buyers ask for the artifact, not the adjective.
          </p>
          <p>
            It matters more now because the aggregate has stopped moving. Uptime Institute&apos;s
            2025 global survey reports average PUE showing little change for the sixth consecutive
            year, with improvement constrained by legacy infrastructure and region-specific barriers
            to efficient cooling.<Cite n={9} /> Against that, claims of large individual gains need
            individual evidence.
          </p>
        </div>

        <h3 className="h3" style={{ marginTop: "2.5rem" }}>
          Wordings that need a follow-up
        </h3>
        <ul className="limits" style={{ marginTop: "1.25rem" }}>
          {RED_FLAGS.map((f) => (
            <li key={f.slice(0, 28)}>{f}</li>
          ))}
        </ul>
      </ProseWithRail>

      {/* 4 · THE CHECKLIST — the page's central asset, wide matrix, canvas */}
      <MatrixTable
        id="checklist"
        eyebrow="Table 1 · The evidence checklist"
        title="Eight domains, and the artifact that settles each"
        lede="Eight domains: the question, the shape of a checkable answer, and the artifact that settles it."
        surface="canvas"
        field="insight"
        head={["#", "Domain", "Ask", "What a good answer looks like", "The artifact that settles it"]}
        rows={CHECKLIST.map((r) => [
          <span key={r.code} className="pill">
            {r.code}
          </span>,
          r.domain,
          r.ask,
          <span key={`${r.code}-good`}>
            {r.good}
            {r.cite?.map((c) => (
              <Cite key={c} n={c} />
            ))}
          </span>,
          r.artifact,
        ])}
      />

      {/* 5 · FIGURE 1 — original CSS scale figure, paper */}
      <DataFigure
        id="worked-check"
        eyebrow="Figure 1 · Original analysis"
        title="A worked cross-check: provisioned kilowatts per accelerator"
        lede="The screening ratio, and where the PODOS Pod's own published design numbers land on the judgement bands."
        surface="paper"
        field="insight"
        caption="Figure 1 · The screening ratio placed on the bands tabulated below. Numerator is designed service capacity, not measured load; denominator is a design population, not a shipped configuration. The bands are judgement, not specification, and the intervals between them are deliberately left unstated."
      >
        <div
          style={{
            border: "1px solid var(--edge-bright)",
            borderRadius: 14,
            background: "var(--glass-bg-strong)",
            padding: "clamp(1.5rem, 3vw, 2.75rem)",
          }}
        >
          <p className="lede" style={{ maxWidth: "72ch", marginBottom: "1.75rem" }}>
            One piece of arithmetic catches internally inconsistent specifications: divide a
            unit&apos;s nameplate electrical capacity by the accelerators it is designed to hold.
            Applied to the PODOS Pod, which is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>:
          </p>

          <div style={eqStyle}>1,000 kW ÷ 128 accelerators = 7.8 kW provisioned per accelerator</div>

          <div
            role="img"
            aria-label="Scale from 0 to 20 kW provisioned per accelerator. Below about 2 kW the specification is internally inconsistent; about 3 to 10 kW is the ordinary band; above about 15 kW suggests oversizing. The PODOS Pod's designed ratio of 7.8 kW falls inside the ordinary band."
            style={{ marginTop: "2.5rem", position: "relative", paddingTop: "2.75rem" }}
          >
            {/* the marker: where the worked ratio lands */}
            <div
              style={{
                position: "absolute",
                top: "2.25rem",
                bottom: "3.25rem",
                left: `${pct(RATIO)}%`,
                width: 2,
                background: "var(--ink-strong)",
              }}
            >
              <span
                className="eyebrow"
                style={{
                  position: "absolute",
                  top: "-2.1rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  color: "var(--ink-strong)",
                }}
              >
                7.8 kW · designed
              </span>
            </div>

            <div
              style={{
                position: "relative",
                height: "clamp(56px, 8vh, 76px)",
                borderRadius: 8,
                border: "1px solid var(--edge-bright)",
                background: "var(--glass-bg-strong)",
                overflow: "hidden",
              }}
            >
              {BAND_ZONES.map((z) => (
                <div
                  key={z.label}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${pct(z.from)}%`,
                    width: `${pct(z.to - z.from)}%`,
                    background:
                      z.tone === "core"
                        ? "linear-gradient(180deg, var(--brand-bright) 0%, var(--brand-deep) 100%)"
                        : "linear-gradient(180deg, var(--cyan) 0%, var(--cyan-deep) 100%)",
                    opacity: z.tone === "core" ? 1 : 0.72,
                  }}
                />
              ))}
            </div>

            {/* zone labels, positioned under their own range */}
            <div style={{ position: "relative", height: "1.5rem", marginTop: "0.6rem" }}>
              {BAND_ZONES.map((z, i) => (
                <span
                  key={z.label}
                  className="eyebrow"
                  style={{
                    position: "absolute",
                    top: 0,
                    whiteSpace: "nowrap",
                    ...(i === 0
                      ? { left: 0 }
                      : i === BAND_ZONES.length - 1
                        ? { right: 0 }
                        : {
                            left: `${pct((z.from + z.to) / 2)}%`,
                            transform: "translateX(-50%)",
                          }),
                  }}
                >
                  {z.label}
                </span>
              ))}
            </div>

            <div
              aria-hidden
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                borderTop: "1px solid var(--edge-bright)",
                paddingTop: "0.7rem",
                marginTop: "0.9rem",
              }}
            >
              {[0, 5, 10, 15, 20].map((tick) => (
                <span key={tick} className="eyebrow">
                  {tick} kW
                </span>
              ))}
            </div>
          </div>
        </div>
      </DataFigure>

      {/* 6 · THE READING — prose, canvas */}
      <ProseWithRail surface="canvas">
        <SectionHead eyebrow="Reading the result" title="What the ratio can and cannot tell you" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Assumptions, stated so they can be rejected: the numerator is designed service capacity,
            not measured load; the denominator is a design population, not a shipped configuration;
            and the ratio charges all provisioned power to accelerators alone.
          </p>
          <p>
            That last assumption is deliberately unfair, which is the point. Accelerators are the
            largest single load but never the only one — NVIDIA ships the GB200 NVL72 as 72 GPUs
            alongside 36 CPUs in one liquid-cooled rack,<Cite n={13} /> and a unit adds network,
            storage, pumps, fans, conversion losses, and headroom. A healthy ratio therefore sits
            well above one device&apos;s rated draw.
          </p>
          <p>
            The ratio never proves a design is sound. It tells you whether two published numbers can
            both be true at once — and a vendor who cannot explain their own has told you how the
            specification was assembled. It applies across{" "}
            <Link href="/engineering/high-density-gpu-infrastructure" style={linkStyle}>
              high-density GPU infrastructure
            </Link>
            , where the binding constraint is usually thermal; see{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
              direct-to-chip liquid cooling
            </Link>{" "}
            for what removes the heat.
          </p>
        </div>
      </ProseWithRail>

      {/* 7 · THE BANDS — the numbers behind Figure 1, wide matrix, paper */}
      <MatrixTable
        id="bands"
        eyebrow="Table 2 · The bands behind Figure 1"
        title="Three ratios, and the follow-up each one earns"
        lede="The bands below are judgement, not specification."
        surface="paper"
        head={["Ratio", "What it suggests", "Follow-up question"]}
        rows={BANDS.map(([band, meaning, followUp]) => [band, meaning, followUp])}
      />

      {/* 8 · INK BEAT */}
      <QuoteMetric
        quote="Ask which document would settle the claim, then ask whether that document exists yet."
        attribution="The whole method, in one instruction"
        metric="EC-02"
        label="The row that binds hardest — grid interconnection"
        field="insight"
      />

      {/* 9 · FOR OPERATORS — cards, paper */}
      <CardGrid
        id="operators"
        eyebrow="Practice"
        title="What this means for operators"
        surface="paper"
        columns={2}
        items={[
          {
            code: "OP-01",
            title: "Ask before the deep-dive",
            body: "Convert claims into artifact requests before the technical deep-dive. The checklist is cheap to send, and the response time is itself data.",
          },
          {
            code: "OP-02",
            title: "Power leads the schedule",
            body: "Sequence power first. The interconnection milestone usually sets the project date, and a utility owns it — not the vendor.",
          },
          {
            code: "OP-03",
            title: "Keep the qualifier attached",
            body: "Make the qualifier travel with the number, in the document rather than the meeting. A figure that loses it gets quoted back as a commitment.",
          },
          {
            code: "OP-04",
            title: "Re-run it at every milestone",
            body: "Write the artifact column into the RFP, then re-run it at each milestone. Which artifacts arrive on schedule beats how impressive any single one is.",
          },
        ]}
      />

      {/* 10 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="What this does not prove"
        eyebrow="Honest limits"
        items={[
          "A checklist tests disclosure, not truth. A vendor can produce every artifact and still miss the schedule; another can be excellent and document badly. Passing is a floor, not a verdict.",
          "A missing artifact is not a missing capability. Early-stage companies legitimately hold test data confidential and are bound by NDAs. The inference is that a claim is unverified, not false.",
          "The maturity scales are borrowed by analogy. TRL was written for spaceflight and MLCommons' divisions for machine-learning systems; neither certifies modular units.",
          "The kilowatts-per-accelerator bands are heuristic. No standard defines them, and a unit can sit outside them for legitimate reasons — oversizing for future refreshes being the obvious one.",
          "None of the cited sources evaluate any vendor. IEA, FERC, ISO/IEC, MLCommons, ICC/MBI, Uptime, USPTO, and the SEC describe processes and lookup tools; they endorse nobody.",
          "This is a method for evaluating engineering claims. It is not investment, legal, or tax advice, and figures identified as targets or estimates are not guarantees.",
        ]}
      />

      {/* 11 · PODOS SELF-ASSESSMENT — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="Applied to us" title="Running the checklist on PODOS" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            A checklist a company will not apply to itself is marketing. The{" "}
            <Link href="/platform/podos-pod" style={linkStyle}>
              PODOS Pod
            </Link>{" "}
            is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, and PODOS{" "}
            <span data-claim="deployment-window">
              targets a 90-day window from order to commissioning
            </span>{" "}
            for a standard unit. All three are labelled as targets where they appear. Under EC-01
            they are specification, not demonstration.
          </p>
          <p>
            What is not published matters more. PODOS has issued no readiness-level statement or
            third-party test report (EC-01); no benchmark for the pod or for{" "}
            <Link href="/platform/syntropic" style={linkStyle}>
              Syntropic
            </Link>{" "}
            with disclosed model, hardware, baseline, and method (EC-04); no named in-plant
            inspection agency (EC-03); no PUE at any measurement category (EC-05); no application or
            grant numbers (EC-06); and no operating reference (EC-07). The{" "}
            <Link href="/invest" style={linkStyle}>
              investor page
            </Link>{" "}
            is at interest stage with no offering terms (EC-08). Mark those rows unanswered, because
            they are.
          </p>
          <p>
            EC-02 binds hardest. A 90-day manufacturing target is a claim about a factory, not a
            utility. The IEA reports grid-connection bottlenecks tightening as data-centre
            electricity use surges,<Cite n={3} /> and FERC&apos;s cluster process sets the milestones
            a request must clear before anyone can promise an energization date.
            <Cite n={2} /> Every vendor timeline, this one included, depends on a study result nobody
            in the sales conversation controls — which is why{" "}
            <Link href="/deploy/site-power-readiness" style={linkStyle}>
              site power readiness
            </Link>{" "}
            is scoped separately from the unit and the{" "}
            <Link href="/resources/data-center-readiness-checklist" style={linkStyle}>
              readiness checklist
            </Link>{" "}
            starts with the interconnection.
          </p>
          <p>
            The{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
              AI infrastructure glossary
            </Link>{" "}
            defines the recurring terms;{" "}
            <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>
              modular versus traditional AI data centers
            </Link>{" "}
            covers the differences this keeps surfacing. To size a configuration first, use the{" "}
            <Link href="/configure" style={linkStyle}>
              configurator
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 12 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED — paper */}
      <RelatedRail
        title="Related analysis"
        surface="paper"
        items={[
          {
            href: "/insights/why-ai-infrastructure-is-moving-to-liquid-cooling",
            label: "INSIGHT",
            title: "Why AI infrastructure is moving to liquid cooling",
          },
          {
            href: "/compare/modular-ai-data-center-vs-traditional-data-center",
            label: "COMPARE",
            title: "Modular vs traditional AI data centers",
          },
          {
            href: "/resources/data-center-readiness-checklist",
            label: "RESOURCE",
            title: "Data center readiness checklist",
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
        title="Send us the checklist and"
        accent="hold us to it"
        body="Bring the eight domains to the first call. Engineering will answer the rows it can and mark the rest unanswered."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy/site-power-readiness", label: "Site power readiness" }}
        field="insight"
      />
    </main>
  );
}
