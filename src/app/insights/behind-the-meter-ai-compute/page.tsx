/**
 * /insights/behind-the-meter-ai-compute
 * Archetype E, insight. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, no client JS. Original assets: a gated decision
 * framework and a worked queue-wait breakeven calculation with stated
 * assumptions. The Figure 1 chart and the sensitivity table BOTH read
 * the same SENSITIVITY array, so the figure can never drift from the
 * data. Deliberately no product photography — the numbers carry it.
 *
 * All external figures cite primary sources verified 2026-08-31;
 * company claims render only from claims.ts publishable entries with
 * their required qualifiers.
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
  QuoteMetric,
  DataFigure,
  CardGrid,
  LimitsBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/insights/behind-the-meter-ai-compute";
const TITLE = "Behind-the-Meter AI Compute: When It Beats the Queue";
const DESCRIPTION =
  "When on-site generation beats waiting in the interconnection queue: a six-gate decision framework, breakeven math, FERC co-location rules, and permit limits.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Queued Up: 2026 Edition — Characteristics of Power Plants Seeking Transmission Interconnection (data through end of 2025)",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://emp.lbl.gov/queues",
    date: "Jun 2026",
  },
  {
    n: 2,
    name: "FACT SHEET | FERC Directs Nation's Largest Grid Operator to Create New Rules (Docket Nos. EL25-49-000, et al.)",
    publisher: "Federal Energy Regulatory Commission",
    url: "https://www.ferc.gov/news-events/news/fact-sheet-ferc-directs-nations-largest-grid-operator-create-new-rules-embrace",
    date: "18 Dec 2025",
  },
  {
    n: 3,
    name: "Order No. 2023 — Improvements to Generator Interconnection Procedures and Agreements",
    publisher: "Federal Energy Regulatory Commission",
    url: "https://www.ferc.gov/media/order-no-2023",
    date: "2023",
  },
  {
    n: 4,
    name: "Incident Review — Considering Simultaneous Voltage-Sensitive Load Reductions",
    publisher: "North American Electric Reliability Corporation",
    url: "https://www.nerc.com/globalassets/our-work/reports/event-reports/incident_review_large_load_loss.pdf",
    date: "accessed 2026-08-31",
  },
  {
    n: 5,
    name: "40 CFR 63.6640 — operation requirements for stationary RICE (NESHAP subpart ZZZZ)",
    publisher: "eCFR / U.S. EPA",
    url: "https://www.ecfr.gov/current/title-40/section-63.6640",
    date: "accessed 2026-08-31",
  },
  {
    n: 6,
    name: "IEEE Std 1547-2018 — Interconnection and Interoperability of Distributed Energy Resources with Associated Electric Power Systems Interfaces",
    publisher: "IEEE Standards Association",
    url: "https://standards.ieee.org/ieee/1547/5915/",
    date: "2018",
  },
  {
    n: 7,
    name: "NFPA 110, Standard for Emergency and Standby Power Systems",
    publisher: "National Fire Protection Association",
    url: "https://www.nfpa.org/product/nfpa-110-standard/p0110code",
    date: "current ed.",
  },
  {
    n: 8,
    name: "Annual outage analysis 2026 (reporting Global Data Center Survey 2025 results)",
    publisher: "Uptime Institute",
    url: "https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2026.AnnualOutageAnalysis.pdf",
    date: "2026",
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

/* Gate framework — the original decision asset. Sequential, disqualifying. */
const GATES: Array<[string, string, string, string]> = [
  [
    "BTM-01",
    "What is actually blocking energization?",
    "Study-queue position, network upgrade, or delivered capacity — make the utility name it.",
    "On-site generation does not clear an upstream network upgrade that the load itself triggers.",
  ],
  [
    "BTM-02",
    "Is the prime mover permitted to run?",
    "Air-permit class, expected annual run hours, site emissions limits.",
    "Engines classified as emergency are capped at 100 hours a year and barred from peak shaving or paid supply.",
  ],
  [
    "BTM-03",
    "Can the site island deliberately?",
    "Protection coordination, intentional-island design, reconnection ramp rate.",
    "A site that cannot resynchronize under control is a liability to the grid and to itself.",
  ],
  [
    "BTM-04",
    "How firm must the grid-facing service be?",
    "The service taken when not islanded; whether withdrawals can be verifiably limited.",
    "A load that cannot curtail pays for firm service — which is most of the saving.",
  ],
  [
    "BTM-05",
    "What is the residual reliability plan?",
    "On-site plant redundancy, fuel supply, N+1 prime movers, standby behind them.",
    "A standby classification sized for a grid outage does not cover the on-site plant's own forced outages.",
  ],
  [
    "BTM-06",
    "What is the exit?",
    "Date grid capacity arrives, cost of stranding, second life as backup or peaking.",
    "Bridge plant with no second life must repay its whole cost inside the bridge window.",
  ],
];

/* Breakeven sensitivity — all inputs are stated placeholders.
   Figure 1 and Table 2 BOTH read this array, so a data fix can never
   leave a stale chart behind. d is a number so it can drive bar height. */
const SENSITIVITY: { v: string; cells: { e: string; d: number }[] }[] = [
  { v: "$0.5 M", cells: [{ e: "$10", d: 37.7 }, { e: "$25", d: 51.1 }, { e: "$50", d: 73.5 }] },
  { v: "$1.0 M", cells: [{ e: "$10", d: 18.9 }, { e: "$25", d: 25.6 }, { e: "$50", d: 36.7 }] },
  { v: "$2.0 M", cells: [{ e: "$10", d: 9.4 }, { e: "$25", d: 12.8 }, { e: "$50", d: 18.4 }] },
];

const CHART_MAX = 75;
/* Median request-to-operation exceeded five years for projects built in 2025 [1]. */
const QUEUE_LINE = 60;

const ASSUMPTIONS = [
  "C(btm) = $1.2 M per MW incremental for generation, switchgear, and fuel infrastructure.",
  "ΔE = $25/MWh premium for self-generated energy over delivered grid power.",
  "LF = 0.85 annual load factor on the IT load.",
  "T = 5 years of premium paid before grid service would have arrived anyway.",
  "V = gross contribution per MW-year of operating compute — the input that varies most, and the one you must supply.",
];

const OPERATOR_ACTIONS: { code: string; title: string; body: string }[] = [
  {
    code: "01",
    title: "Name the constraint first",
    body: "Make the utility name the constraint before designing anything. Queue position, network upgrade, and capacity shortfall are three different problems.",
  },
  {
    code: "02",
    title: "Price the delay",
    body: "Price the delay, not the electricity. If the breakeven exceeds the delay you can realistically avoid, the fuel-price debate is irrelevant.",
  },
  {
    code: "03",
    title: "Read the air permit first",
    body: "Audit the air permit before the single-line diagram. A plan resting on emergency-classified engines is already outside federal limits.",
  },
  {
    code: "04",
    title: "Make islanding a deliverable",
    body: "Specify islanding as an interconnection design: protection coordination, resynchronization, and reconnection ramp rate are the deliverables.",
  },
  {
    code: "05",
    title: "Curtailability is commercial",
    body: "Treat verifiable curtailability as a commercial asset — it is what separates cheap non-firm service from expensive firm service.",
  },
];

const LIMITS = [
  "The breakeven is a structure, not a result. Every input above is a placeholder — no market quote, no vendor price, no PODOS figure — and the output moves almost eightfold across the grid.",
  "The FERC order covers one region and is not final. It sets a paper hearing rather than final rates, and declines to resolve jurisdictional questions about retail load served through co-location.",
  "Queue medians do not predict a single project. They describe thousands of heterogeneous generation projects, not one load's service request — which is not even the same process.",
  "One incident is not a fleet characterization. NERC analysed a single event; it shows the disturbance-counting behaviour exists at scale, not how widespread that configuration is.",
  "Federal air limits are a floor. State and local permitting, nonattainment status, and nuisance rules can rule out on-site combustion entirely.",
  "The framework assumes the compute is worth running now. If capacity is built ahead of demand, the value of arriving early collapses, and the case with it.",
];

const TOC: [string, string][] = [
  ["#answer", "The short answer"],
  ["#queue", "What you are escaping"],
  ["#framework", "The six gates"],
  ["#plant", "The plant you have"],
  ["#breakeven", "The worked calculation"],
  ["#operators", "For operators"],
  ["#limitations", "What this does not prove"],
];

export default function BehindTheMeterAiComputePage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Behind-the-meter AI compute: when it beats the interconnection queue"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />

      {/* 1 · HERO — editorial, paper. No product shot; the numbers carry it. */}
      <HeroEditorial
        code="IN-01"
        category="Insight · Grid interconnection"
        title="Behind-the-meter AI compute: when it"
        accent="beats the queue"
        lede="On-site generation does not make you invisible to the grid, and it rarely wins on the price of electricity. It wins — or fails — on how many months of delay it actually removes. Here is the framework and the arithmetic, with every input stated."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Behind-the-meter AI compute", path: PATH },
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
          { value: "5+ yrs", label: "Median US request to commercial operation, 2025 builds" },
          { value: "13%", label: "Of capacity requested 2000–2020 operating by end 2025" },
          { value: "100 h/yr", label: "Federal ceiling on emergency-classified engines" },
        ]}
      />

      {/* 2 · EXECUTIVE ANSWER — canvas glass panel */}
      <ExecutiveAnswer>
        Behind-the-meter generation pays only when it pulls energization forward by more than the
        delay needed to repay its capital and its energy premium — a threshold near two years at
        plausible AI-compute margins, not the five-plus years operators assume they are escaping. The
        queue is real: median request-to-operation exceeded five years for US projects built in 2025,
        and only 13% of the capacity requested between 2000 and 2020 was operating by the end of 2025.
        <Cite n={1} /> But the deciding questions are regulatory and protection-engineering ones — the
        prime mover&apos;s permit class, whether the site can island deliberately, and how firm its
        grid-facing service must be.<Cite n={2} />
        <Cite n={5} />
      </ExecutiveAnswer>

      {/* 3 · WHAT YOU ARE ESCAPING — prose with sticky TOC rail, paper */}
      <ProseWithRail
        id="queue"
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
          title="What you are actually escaping — and what you are not"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <h3 className="h3">The queue you are avoiding may not be the queue you are in</h3>
          <p style={{ marginTop: "1rem" }}>
            As of the end of 2025, roughly 8,200 projects were actively seeking grid interconnection
            in the US — 1,312 GW of generation and about 749 GW of storage. Median duration from
            request to commercial operation was over five years for projects built in 2025, and of the
            capacity requested between 2000 and 2020, 13% was operating by the end of 2025, 75% had
            been withdrawn, and 10% was still waiting.<Cite n={1} />
          </p>
          <p>
            The number that should change how an operator reads this is quieter: 549 GW already holds
            a draft or executed interconnection agreement and still has not reached commercial
            operation, including 45 GW of gas.<Cite n={1} /> For that capacity, the interconnection
            right is not the binding constraint — equipment, labour, and capital are. A private
            generator buys you out of the study queue, not the turbine order book, and active gas
            capacity in the queues grew 86% in 2025, to 253 GW<Cite n={1} /> — the signature of many
            developers reaching the same conclusion at once. FERC&apos;s Order No. 2023 queue reforms
            are being implemented,<Cite n={3} /> but Berkeley Lab judges it too early to measure their
            effect.<Cite n={1} />
          </p>

          <h3 className="h3" style={{ marginTop: "2.5rem" }}>
            Behind-the-meter is not a way to be invisible
          </h3>
          <p style={{ marginTop: "1rem" }}>
            On 18 December 2025, FERC ruled on the co-location proceeding it had opened against PJM
            the previous February. It found PJM&apos;s tariff unjust and unreasonable for lacking
            clarity on service to co-located load, found the tariff&apos;s existing Behind-the-Meter
            Generation rules no longer just and reasonable, and directed PJM to make the customer
            serving a co-located load choose among four transmission services: network integration
            service, a new interim non-firm service available while upgrades complete, and new firm
            and non-firm contract demand services.<Cite n={2} />
          </p>
          <p>
            Read structurally rather than as news, that says a load sitting beside its own generator
            is still a transmission customer. The variable is not whether you take service but how
            firm it is — FERC framed the gap as a missing provision for customers &quot;able to limit
            their energy withdrawals from the transmission system.&quot;<Cite n={2} /> That turns
            islanding capability into a commercial instrument. A site that can verifiably curtail can
            argue for non-firm service; a site that cannot buys firm service, and firm service at
            campus scale is most of the money co-location was supposed to save.
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · ORIGINAL ASSET — the gate framework, canvas */}
      <MatrixTable
        id="framework"
        eyebrow="Table 1 · Original framework"
        title="The decision framework: six gates, in order"
        lede="The gates are sequential and disqualifying. A plan that fails an early gate does not get to argue the economics of a later one — which is the usual failure mode, because the economics are the easiest part to model and the least likely to be the constraint."
        surface="canvas"
        field="insight"
        head={["Gate", "Question", "What to evaluate", "What disqualifies behind-the-meter"]}
        rows={GATES.map(([id, q, e, d]) => [
          <span key={id} className="pill">
            {id}
          </span>,
          <strong key={`${id}-q`} style={{ color: "var(--ink-strong)", fontWeight: 500 }}>
            {q}
          </strong>,
          e,
          d,
        ])}
      />

      {/* 5 · THE PLANT YOU ALREADY HAVE — prose, paper */}
      <ProseWithRail id="plant" surface="paper">
        <SectionHead
          eyebrow="The existing plant"
          title="The plant you already have is not the plant you need"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <h3 className="h3">Most data centers already island — accidentally</h3>
          <p style={{ marginTop: "1rem" }}>
            NERC&apos;s review of a July 2024 event in the Eastern Interconnection is the most useful
            document in this debate, and it is rarely read as one. A lightning arrestor failed on a
            230 kV line; auto-reclosing configured for three attempts at each terminal produced six
            successive faults in 82 seconds, each cleared correctly in 42 to 66 milliseconds, with
            voltage in the affected area dipping to 0.25–0.40 per unit. About 1,500 MW of load came
            off — all of it data-center type, none of it disconnected by utility equipment.
            Customer-side protection transferred the load to backup, and roughly 1,260 MW did not
            return for hours.<Cite n={4} />
          </p>
          <p>
            The mechanism matters more than the magnitude. Beyond ordinary UPS transfer, sites had
            deployed a disturbance-counting scheme: typically, three voltage disturbances within one
            minute triggers a transfer to backup, held there until manually returned.<Cite n={4} />{" "}
            That is an islanding policy — already installed at gigawatt scale, and badly specified. It
            separates on the grid&apos;s schedule, runs on plant legally constrained in annual hours,
            and reconnects by hand. Deliberate behind-the-meter generation is the same event with the
            sign flipped, and the discipline for doing it on purpose is the DER interconnection
            standard, which treats islanding, abnormal-condition response, and power quality as
            interconnection requirements rather than site preferences.<Cite n={6} />
          </p>

          <h3 className="h3" style={{ marginTop: "2.5rem" }}>
            The permit ceiling nobody prices in
          </h3>
          <p style={{ marginTop: "1rem" }}>
            The most common behind-the-meter plan is also the most common mistake: run the existing
            standby generators. Federal air rules do not allow it. An engine classified as emergency
            may operate a maximum of 100 hours per calendar year for maintenance and readiness
            testing, at most 50 of those hours in non-emergency situations, and those hours
            &quot;cannot be used for peak shaving or non-emergency demand response, or to generate
            income for a facility to supply power to an electric grid.&quot; Operate outside the
            limits and the engine is no longer an emergency engine — it must meet every requirement
            applying to non-emergency engines.<Cite n={5} />
          </p>
          <p>
            The standby fleet is a bridge measured in hours. Standby systems are classified by how
            long they carry load and how fast they pick it up,<Cite n={7} /> which is a different
            design question from annual duty cycle, fuel logistics, forced-outage rate, and overhaul
            intervals. Behind-the-meter prime power is a generation project that happens to sit on
            your parcel, and it moves reliability risk onto the operator — half of surveyed operators
            (50%) reported an impactful or serious outage in the prior three years even with the
            utility carrying supply.<Cite n={8} />
          </p>
        </div>
      </ProseWithRail>

      {/* 6 · INK BEAT */}
      <QuoteMetric
        quote="The standby fleet is a bridge measured in hours, not a generation project."
        attribution="Federal air rules cap an emergency-classified engine at 100 hours a year"
        metric="1,500 MW"
        label="Data-center load that islanded itself in one 82-second event"
        field="insight"
      />

      {/* 7 · ORIGINAL ASSET — the worked calculation and Figure 1, paper */}
      <DataFigure
        id="breakeven"
        eyebrow="Figure 1 · Original analysis"
        title="The worked calculation: how much delay must it avoid?"
        lede="Behind-the-meter generation does not create value by being cheap power. It rarely is. It creates value by moving revenue earlier in time, so the settling question is how many months of delay it must avoid to pay for itself."
        surface="paper"
        field="insight"
        caption="Figure 1 · Breakeven delay D* in months, computed from the stated placeholder assumptions. Bars within each group are ΔE = $10, $25 and $50 per MWh. Dashed line: five years, the median request-to-operation duration for US projects built in 2025. Illustrative — no market quote, no vendor price, no PODOS figure."
      >
        <div
          style={{
            border: "1px solid var(--edge-bright)",
            borderRadius: 14,
            background: "var(--glass-bg-strong)",
            padding: "clamp(1.5rem, 3vw, 2.75rem)",
          }}
        >
          <p style={{ color: "var(--ink-dim)", lineHeight: 1.78 }}>
            Per megawatt of IT load, the breakeven delay <em>D*</em> in months is:
          </p>

          <div style={{ ...eqStyle, marginTop: "1.25rem" }}>
            D* = 12 × ( C<sub>btm</sub> + ΔE × 8,760 × LF × T ) ÷ V
          </div>

          <p style={{ color: "var(--ink-dim)", lineHeight: 1.78, marginTop: "1.25rem" }}>
            C<sub>btm</sub> is the incremental capital cost of the on-site plant per MW, ΔE the
            energy-cost premium of self-generation over delivered grid power in $/MWh, LF the annual
            load factor, T the years the premium is paid before grid service arrives, and V the gross
            contribution earned per MW-year of running compute.
          </p>

          <div
            style={{
              marginTop: "2rem",
              borderTop: "1px solid var(--edge-bright)",
              paddingTop: "1.5rem",
            }}
          >
            <p className="eyebrow">Stated assumptions — placeholders, not quotes or PODOS figures</p>
            <ul
              style={{
                marginTop: "1rem",
                display: "grid",
                gap: "0.5rem",
                listStyle: "disc",
                paddingLeft: "1.25rem",
                color: "var(--ink-dim)",
                lineHeight: 1.7,
              }}
            >
              {ASSUMPTIONS.map((t) => (
                <li key={t.slice(0, 20)}>{t}</li>
              ))}
            </ul>
            <p style={{ color: "var(--ink-dim)", lineHeight: 1.78, marginTop: "1.25rem" }}>
              At V = $1.0 M per MW-year the energy premium totals $25 × 8,760 × 0.85 × 5 = $930,750
              per MW, so the numerator is $1,200,000 + $930,750 = $2,130,750 and D* = 12 × $2,130,750
              ÷ $1,000,000 ≈ <strong style={{ color: "var(--ink-strong)" }}>25.6 months</strong>.
            </p>
          </div>

          {/* The chart reads SENSITIVITY, the same array Table 2 renders. */}
          <div
            role="img"
            aria-label="Grouped bar chart of breakeven delay D* in months. At V = $0.5 M per MW-year: 37.7, 51.1 and 73.5 months for energy premiums of $10, $25 and $50 per MWh. At V = $1.0 M: 18.9, 25.6 and 36.7 months. At V = $2.0 M: 9.4, 12.8 and 18.4 months."
            style={{
              position: "relative",
              marginTop: "2.5rem",
              display: "grid",
              gridTemplateColumns: `repeat(${SENSITIVITY.length}, minmax(0, 1fr))`,
              gap: "clamp(1rem, 3vw, 3rem)",
              alignItems: "end",
              height: "clamp(240px, 34vh, 380px)",
              paddingTop: "1.75rem",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: `${(QUEUE_LINE / CHART_MAX) * 100}%`,
                borderTop: "1px dashed var(--brand-deep)",
                pointerEvents: "none",
              }}
            >
              <span
                className="eyebrow"
                style={{ position: "absolute", left: 0, top: "-1.35rem", color: "var(--brand-deep)" }}
              >
                Five years — median queue duration
              </span>
            </div>

            {SENSITIVITY.map((row) => (
              <div
                key={row.v}
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${row.cells.length}, minmax(0, 1fr))`,
                  gap: "clamp(0.35rem, 1vw, 0.8rem)",
                  alignItems: "end",
                  height: "100%",
                }}
              >
                {row.cells.map((c) => (
                  <div
                    key={c.e}
                    style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}
                  >
                    <span
                      className="metric"
                      style={{
                        fontSize: "clamp(0.72rem, 1.1vw, 0.95rem)",
                        marginBottom: "0.4rem",
                        textAlign: "center",
                      }}
                    >
                      {c.d}
                    </span>
                    <div
                      style={{
                        height: `${(c.d / CHART_MAX) * 100}%`,
                        borderRadius: "6px 6px 0 0",
                        background:
                          c.d >= QUEUE_LINE
                            ? "linear-gradient(180deg, var(--cyan) 0%, var(--cyan-deep) 100%)"
                            : "linear-gradient(180deg, var(--brand-bright) 0%, var(--brand-deep) 100%)",
                        opacity: c.d >= 24 ? 1 : 0.72,
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div
            aria-hidden
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${SENSITIVITY.length}, minmax(0, 1fr))`,
              gap: "clamp(1rem, 3vw, 3rem)",
              borderTop: "1px solid var(--edge-bright)",
              paddingTop: "0.75rem",
              marginTop: "0.25rem",
            }}
          >
            {SENSITIVITY.map((row) => (
              <span key={row.v} className="eyebrow" style={{ justifyContent: "center" }}>
                V = {row.v} / MW-yr
              </span>
            ))}
          </div>
        </div>
      </DataFigure>

      {/* 8 · THE NUMBERS BEHIND FIGURE 1 — canvas */}
      <MatrixTable
        eyebrow="Table 2 · Breakeven delay avoided, D* in months"
        title="Reading the result: the spread is the point"
        lede="Across plausible inputs the breakeven sits between roughly nine and seventy-three months, so the answer is rarely decided by the cost of generation. It is decided by how much compute margin an idle megawatt is losing — one input that swings the result fourfold. Two operators can face the same site, fuel price, and queue position and be correctly opposed."
        surface="canvas"
        head={["V per MW-year", "ΔE = $10/MWh", "ΔE = $25/MWh", "ΔE = $50/MWh"]}
        rows={SENSITIVITY.map((row) => [
          <strong key={row.v} style={{ color: "var(--ink-strong)", fontWeight: 500 }}>
            {row.v}
          </strong>,
          ...row.cells.map((c) => c.d.toFixed(1)),
        ])}
      />

      {/* 9 · FOR OPERATORS — cards, paper */}
      <CardGrid
        id="operators"
        eyebrow="Practice"
        title="What this means for operators"
        surface="paper"
        columns={3}
        items={OPERATOR_ACTIONS}
      />

      {/* 10 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="What this does not prove"
        eyebrow="Honest limits"
        lede="The evidence above is strong on regulation and queue statistics, and weaker everywhere the decision actually gets made."
        items={LIMITS}
      />

      {/* 11 · PODOS — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="In the product" title="Where the PODOS approach sits in this" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Gate BTM-06 punishes plant sized for a campus that never materializes, and the breakeven
            rewards whatever arrives soonest at the smallest committed increment. That is the design
            premise of the{" "}
            <Link href="/platform/podos-pod" style={linkStyle}>
              PODOS Pod
            </Link>
            , which is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>; PODOS{" "}
            <span data-claim="deployment-window">targets a 90-day window from order to commissioning</span>{" "}
            for a standard unit. A 1 MW increment is a smaller bet against an uncertain interconnection
            date than a campus-scale commitment, and it lets generation be sized to load that already
            exists.
          </p>
          <p>
            The gates map onto the rest of the cluster: BTM-03 and BTM-05 are{" "}
            <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
              power architecture
            </Link>{" "}
            questions, BTM-04 depends on{" "}
            <Link href="/engineering/monitoring-controls" style={linkStyle}>
              monitoring and controls
            </Link>
            , and V rests on{" "}
            <Link href="/engineering/high-density-gpu-infrastructure" style={linkStyle}>
              high-density GPU infrastructure
            </Link>
            . For site prerequisites, use the{" "}
            <Link href="/resources/data-center-readiness-checklist" style={linkStyle}>
              readiness checklist
            </Link>{" "}
            and the{" "}
            <Link href="/deploy" style={linkStyle}>
              deployment model
            </Link>
            ; for the schedule comparison behind the calculation, see{" "}
            <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>
              modular vs traditional AI data centers
            </Link>
            . Terms are defined in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
              AI infrastructure glossary
            </Link>
            , and you can size an increment in the{" "}
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
            href: "/engineering/data-center-power-architecture",
            label: "ENGINEERING",
            title: "Data center power architecture",
          },
          {
            href: "/engineering/monitoring-controls",
            label: "ENGINEERING",
            title: "Monitoring and controls",
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
        ]}
      />

      {/* 14 · CTA */}
      <CTABand
        title="Size the increment against"
        accent="your interconnection date"
        body="Bring the constraint the utility named, the delay you are actually trying to avoid, and the margin an idle megawatt is losing. Engineering will tell you which gate you fail first."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy", label: "Deployment model" }}
        field="insight"
      />
    </main>
  );
}
