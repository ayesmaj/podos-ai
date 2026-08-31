/**
 * /compare/on-prem-ai-infrastructure-vs-cloud
 *
 * Comparison page (compare cluster). Server component — all copy in
 * initial HTML, CSS-only hovers, no client JS. Styled with the MAIN
 * site light technical system (design-language-lock.md), never .iv-*.
 *
 * Claims discipline: only publishable entries from
 * src/content/data/claims.ts render, each wrapped in data-claim with
 * its required qualifier. External numbers cite the source register.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";

const PATH = "/compare/on-prem-ai-infrastructure-vs-cloud";
const TITLE = "On-Prem AI Infrastructure vs Cloud GPUs: How to Decide";
const DESCRIPTION =
  "On-prem AI infrastructure versus cloud GPUs: utilization economics, data residency, latency, capex vs opex, burst capacity, and the staffing each model needs.";

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
    name: "Energy and AI — Executive Summary",
    publisher: "IEA",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
    date: "Apr 2025",
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
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 4,
    name: "Data centre electricity use surged in 2025, even with tightening bottlenecks driving a scramble for solutions",
    publisher: "IEA",
    url: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions",
    date: "2025",
  },
  {
    n: 5,
    name: "Data center efficiency (fleet trailing-12-month PUE)",
    publisher: "Google",
    url: "https://datacenters.google/efficiency/",
    date: "accessed 2026-08-31",
  },
  {
    n: 6,
    name: "Measuring energy and water efficiency for Microsoft datacenters",
    publisher: "Microsoft",
    url: "https://datacenters.microsoft.com/sustainability/efficiency/",
    date: "accessed 2026-08-31",
  },
  {
    n: 7,
    name: "GB200 NVL72 product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    date: "accessed 2026-08-31",
  },
  {
    n: 8,
    name: "Efficient Memory Management for Large Language Model Serving with PagedAttention (Kwon et al., SOSP 2023)",
    publisher: "arXiv:2309.06180",
    url: "https://arxiv.org/abs/2309.06180",
    date: "Sep 2023",
  },
  {
    n: 9,
    name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)",
    publisher: "ASHRAE TC 9.9",
    url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf",
    date: "c. 2021",
  },
];

/* ------------------------------------------------------------------ */
/* Break-even worksheet — variables, not invented numbers              */
/* ------------------------------------------------------------------ */
const WORKSHEET: { code: string; input: string; measure: string; error: string }[] = [
  {
    code: "BE-01",
    input: "Sustained utilization",
    measure:
      "Accelerator-hours doing useful work divided by accelerator-hours owned, averaged over a full quarter including holidays and refactors.",
    error: "Quoting a peak week, or counting allocated capacity as consumed capacity.",
  },
  {
    code: "BE-02",
    input: "Competitive life of the hardware",
    measure:
      "The number of years the accelerator stays economically useful for your workload — which is a market question, not a tax-schedule question.",
    error: "Borrowing a general-purpose server depreciation schedule for accelerators.",
  },
  {
    code: "BE-03",
    input: "All-in facility overhead",
    measure:
      "Power, cooling, floor space, and the PUE multiplier applied to every IT watt, plus spares and maintenance contracts.",
    error: "Comparing a rented GPU-hour against a bare hardware purchase price with no facility layer.",
  },
  {
    code: "BE-04",
    input: "Fully loaded staffing",
    measure:
      "Facility, hardware, and platform skills at loaded cost, including on-call coverage and the cost of not having a second person who knows the system.",
    error: "Assuming the existing IT team absorbs an AI facility at zero marginal cost.",
  },
  {
    code: "BE-05",
    input: "Shape of current cloud spend",
    measure:
      "The share of cloud spend already locked into reserved or committed-use contracts versus true on-demand.",
    error: "Treating committed cloud spend as elastic when it behaves like a fixed obligation.",
  },
  {
    code: "BE-06",
    input: "Data movement",
    measure:
      "Egress volume, dataset staging time, and cross-region replication for every training and evaluation cycle.",
    error: "Modelling storage cost but not the repeated cost and latency of moving data to the compute.",
  },
  {
    code: "BE-07",
    input: "Burst profile",
    measure: "Peak-to-median demand ratio, how often peaks occur, and how long they last.",
    error: "Sizing owned capacity to the peak instead of to the median with a burst path attached.",
  },
];

/* ------------------------------------------------------------------ */
/* Comparison matrix                                                   */
/* ------------------------------------------------------------------ */
const MATRIX: { code: string; dimension: string; cloud: string; onprem: string; edge: string }[] = [
  {
    code: "OC-01",
    dimension: "Utilization economics",
    cloud: "Pay for hours consumed; idle capacity costs nothing.",
    onprem: "Cost is fixed regardless of duty cycle; unit economics improve as utilization rises.",
    edge: "Cloud below your break-even duty cycle, on-prem above it.",
  },
  {
    code: "OC-02",
    dimension: "Cost predictability",
    cloud: "Variable, with committed-use discounts that reintroduce fixed cost by another name.",
    onprem: "Known capital and facility cost across the asset life.",
    edge: "On-prem.",
  },
  {
    code: "OC-03",
    dimension: "Burst capacity",
    cloud: "Effectively unbounded within quota and region limits, available in minutes.",
    onprem: "Hard-bounded by installed capacity; more capacity means procurement lead time.",
    edge: "Cloud, decisively.",
  },
  {
    code: "OC-04",
    dimension: "Time to first capacity",
    cloud: "Minutes to hours.",
    onprem: "Weeks to years, depending entirely on whether power and space already exist.",
    edge: "Cloud.",
  },
  {
    code: "OC-05",
    dimension: "Data residency and custody",
    cloud: "Jurisdiction is selectable by region; physical custody stays with the provider.",
    onprem: "Legal and physical custody stay inside your own perimeter.",
    edge: "On-prem where the requirement is custody rather than jurisdiction.",
  },
  {
    code: "OC-06",
    dimension: "Latency and data gravity",
    cloud: "Adequate for most inference; always a network round trip from the data source.",
    onprem: "Compute can sit beside the dataset or the process it controls.",
    edge: "On-prem for control-loop and very large local datasets.",
  },
  {
    code: "OC-07",
    dimension: "Facility efficiency",
    cloud:
      "Hyperscale plants report best-in-class overhead — a 1.09 fleet trailing-twelve-month PUE at Google and a 1.12 design PUE at Microsoft.",
    onprem:
      "Entirely dependent on the facility; industry-average PUE has been essentially flat for about six years (Uptime, 2025).",
    edge: "Cloud, unless the on-prem facility is purpose-built for the load.",
  },
  {
    code: "OC-08",
    dimension: "Team requirements",
    cloud: "Provider owns power, cooling, and hardware lifecycle; you still own the platform layer.",
    onprem: "You own the facility, the hardware, and the platform layer.",
    edge: "Cloud.",
  },
  {
    code: "OC-09",
    dimension: "Hardware choice and refresh risk",
    cloud: "New accelerator generations appear without a purchase decision; you never hold the depreciating asset.",
    onprem: "You pick the exact configuration and keep it as long as it earns.",
    edge: "Split: cloud for optionality, on-prem for control.",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "Is on-prem AI infrastructure cheaper than cloud GPUs?",
    a: "Only above a break-even duty cycle. Owning hardware converts a variable cost into a fixed one, so on-prem economics improve as sustained utilization rises and get worse as it falls. Below that threshold — and for workloads that are bursty, seasonal, or still being explored — cloud is usually the cheaper and lower-risk option.",
  },
  {
    q: "Does a cloud region satisfy a data residency requirement?",
    a: "It satisfies a jurisdiction requirement, not necessarily a custody requirement. Selecting a region keeps data inside a legal boundary, but the equipment, the physical access controls, and the operational staff remain the provider's. Where a regulation, contract, or classification demands physical custody, on-premises infrastructure is the only architecture that provides it.",
  },
  {
    q: "What is the right hybrid split between owned and rented AI compute?",
    a: "The common pattern is to own the predictable baseline and rent the peaks. Size owned capacity to sustained median demand, keep a cloud path for burst training runs, evaluation sweeps, and unexpected inference spikes, and re-measure the split each time the workload or the hardware generation changes.",
  },
  {
    q: "Can existing server rooms host modern AI racks?",
    a: "Usually not without significant work. Rack-scale AI systems such as NVIDIA's GB200 NVL72 — 72 GPUs and 36 CPUs behaving as one NVLink domain — ship liquid-cooled, and ASHRAE's TC 9.9 has documented why air cooling stops being economic at those densities. Power capacity, floor loading, and a liquid-cooling path are the three constraints that most often rule a legacy room out.",
  },
];

/* ------------------------------------------------------------------ */
/* shared styles (server component — CSS-only hovers)                  */
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
  minWidth: "11rem",
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

const link: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

export default function OnPremVsCloudPage() {
  return (
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="On-prem AI infrastructure vs cloud"
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
            { name: "On-prem AI infrastructure vs cloud", path: PATH },
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
          On-prem AI infrastructure <span className="t-sweep-brand">vs</span> cloud
        </h1>

        <p className="t-lede mt-5 max-w-[62ch]" style={{ color: "var(--ink-dim)" }}>
          On-premises AI infrastructure means owning the accelerators and the facility that powers
          and cools them; cloud AI infrastructure means renting that capacity by the hour inside
          someone else&apos;s facility. The choice is decided mostly by one number — sustained
          utilization — with data residency, latency, and burst profile acting as overrides that can
          flip the answer regardless of what the economics say.
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
          {/* -------- utilization -------- */}
          <section id="utilization" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>The variable that decides it: sustained utilization</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Buying accelerators converts a variable cost into a fixed one. A rented GPU costs
              nothing at 3am on a Sunday; an owned GPU costs exactly the same whether it is running a
              training job or sitting dark. Every other argument in this comparison is a modifier on
              that single fact. The figure that matters is not peak utilization during a launch week
              but the sustained duty cycle across the whole competitive life of the hardware —
              through model rewrites, dataset regressions, hiring gaps, and the quarters where the
              research direction changes.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Measuring that number honestly is harder than it looks, because allocated capacity is
              not consumed capacity. The PagedAttention work behind vLLM found that serving systems
              without paged memory management used roughly 20–38% of allocated KV-cache memory for
              actual token state (2023 measurements).<Cite n={8} /> A cluster whose dashboards report
              full allocation can still be doing a fraction of the work its memory footprint
              implies. Size an ownership decision against measured throughput, not against an
              allocation graph.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              The macro backdrop pushes in the same direction. The IEA projects data-centre
              electricity demand roughly doubling as a share of global consumption — from about 1.5%
              in 2025 toward about 3% by 2030 — with AI the dominant driver (Apr 2025).
              <Cite n={1} /> LBNL put US data centers at 4.4% of national electricity in 2023 and
              projected 6.7–12% by 2028 (Dec 2024).<Cite n={2} /> That growth is what makes
              accelerator capacity scarce and priced accordingly in both models; it does not by
              itself favour either one.
            </p>
          </section>

          {/* -------- break-even worksheet -------- */}
          <section id="break-even" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>The break-even worksheet</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Published cost comparisons rarely survive contact with a real workload because they
              omit one of these seven inputs. Fill them in with your own numbers before reading any
              vendor&apos;s. The right-hand column is the error we see most often in each row.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Input</th>
                    <th style={th}>How to measure it honestly</th>
                    <th style={th}>Common error</th>
                  </tr>
                </thead>
                <tbody>
                  {WORKSHEET.map((r) => (
                    <tr key={r.code}>
                      <td style={td}>
                        <span style={codePill}>{r.code}</span>
                      </td>
                      <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>{r.input}</td>
                      <td style={td}>{r.measure}</td>
                      <td style={td}>{r.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- matrix -------- */}
          <section id="matrix" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Nine dimensions, and who actually wins each</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Cloud wins more rows than infrastructure vendors usually admit. The rows on-prem wins
              are the ones that tend to be non-negotiable when they apply.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Dimension</th>
                    <th style={th}>Cloud</th>
                    <th style={th}>On-prem</th>
                    <th style={th}>Structural advantage</th>
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map((r) => (
                    <tr key={r.code}>
                      <td style={td}>
                        <span style={codePill}>{r.code}</span>
                      </td>
                      <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>
                        {r.dimension}
                      </td>
                      <td style={td}>
                        {r.cloud}
                        {r.code === "OC-07" ? (
                          <>
                            <Cite n={5} />
                            <Cite n={6} />
                          </>
                        ) : null}
                      </td>
                      <td style={td}>
                        {r.onprem}
                        {r.code === "OC-07" ? <Cite n={3} /> : null}
                      </td>
                      <td style={td}>{r.edge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- cloud wins -------- */}
          <section id="cloud-wins" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Where cloud is simply the better answer</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Variable and bursty workloads are the clearest case. If demand swings by an order of
              magnitude between a quiet week and an evaluation sweep, owned capacity is either idle
              most of the time or too small when it matters — and cloud absorbs that swing in
              minutes. Small scale is the second case: below roughly a rack of accelerators, the
              fixed overheads of power, cooling, spares, and staffing dominate the hardware cost, and
              no utilization rate rescues the arithmetic.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Cloud also wins on optionality and on facility efficiency. Teams still deciding which
              accelerator generation suits their models should not be holding a depreciating asset
              while they find out. And a hyperscale plant runs at overheads a typical enterprise room
              does not reach: Google reports a fleet-wide trailing-twelve-month PUE of 1.09 and
              Microsoft a design PUE of 1.12 with a water-use effectiveness of 0.30 L/kWh, while
              Uptime&apos;s 2025 survey of more than 800 operators found industry-average PUE
              essentially flat for about six years.<Cite n={5} />
              <Cite n={6} />
              <Cite n={3} /> If the on-prem option is a converted server room, the efficiency
              comparison is not close.
            </p>
          </section>

          {/* -------- residency + latency -------- */}
          <section id="residency" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Residency, custody, latency, and data gravity</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Data residency is two requirements wearing one name. Jurisdictional residency — data
              must remain inside a legal boundary — is solved by choosing a cloud region. Custody —
              the equipment, the physical access, and the operators must be yours — is not. Defence
              work, some clinical and biometric data, certain industrial process data, and contracts
              that forbid third-party physical access all fall in the second category, and no region
              selector satisfies them. Read the obligation carefully before assuming it forces an
              on-prem build; read it just as carefully before assuming a region satisfies it.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Latency splits the same way. For most inference, a network round trip is irrelevant
              next to model execution time. It stops being irrelevant when the model sits inside a
              control loop — a production line, a robot, a diagnostic instrument, a trading path —
              where the round trip is a hard budget rather than a nuisance. Data gravity is the
              quieter constraint: when a dataset is large enough, or regenerated often enough, moving
              compute to the data is cheaper than moving the data to the compute, and that
              calculation lands on-prem more often as datasets grow. The{" "}
              <Link href="/use-cases" style={link}>
                use-case breakdown
              </Link>{" "}
              walks through which workloads sit on which side of that line.
            </p>
          </section>

          {/* -------- capex/opex -------- */}
          <section id="capex-opex" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Capex vs opex, honestly accounted</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              The capex-versus-opex framing flatters both sides when it is done loosely. On-prem
              comparisons understate cost by pricing hardware and forgetting the facility layer
              underneath it — power, cooling, floor space, spares, and staff — which is why BE-03 and
              BE-04 exist in the worksheet above. Cloud comparisons understate cost by pricing on-demand rates while ignoring
              egress, storage, idle reservations, and the committed-use contracts most large
              consumers sign. A three-year committed spend is not elastic. It is a fixed obligation
              recorded in a different place on the income statement, and it should be compared
              against owned capacity as such.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              The second honest adjustment is on the utilization side. Software that raises the work
              extracted per accelerator changes the break-even point for both models at once —
              memory-efficient serving, batching, and compression each move the same lever, which is
              why{" "}
              <Link href="/platform/syntropic" style={link}>
                Syntropic
              </Link>{" "}
              sits alongside the hardware rather than after it.
            </p>
          </section>

          {/* -------- team -------- */}
          <section id="team" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Team requirements: the line item that gets skipped</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Cloud outsources the facility, not the platform. Someone on your side still owns
              scheduling, images, drivers, networking, observability, and cost control. On-prem adds
              a second discipline on top: electrical and mechanical systems, hardware RMA cycles,
              spares inventory, and a maintenance calendar. Both models need enough depth that no
              single person is the only one who understands the system — Uptime&apos;s 2025 survey
              reports staffing and skills among operators&apos; standing concerns alongside outage
              experience, with roughly half of respondents reporting an impactful outage within
              three years.<Cite n={3} /> Resilience is bought deliberately in either model; neither
              includes it for free.
            </p>
          </section>

          {/* -------- limitations -------- */}
          <section id="limitations" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>When on-prem is not the right fit</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              If any of these describe your situation, the honest recommendation is cloud — or a
              hybrid that keeps the owned footprint small.
            </p>
            <ul className="mt-4 grid gap-3 list-disc pl-5">
              {[
                "Demand is genuinely unpredictable. If you cannot state a median duty cycle with confidence, you cannot compute a break-even, and buying against a guess is the most expensive outcome in this comparison.",
                "The requirement is below rack scale. A handful of accelerators does not amortize a facility, and consumer-grade workarounds create an operations burden that outlives the savings.",
                "There is no power path. Interconnection queues and grid-connection bottlenecks are now a first-order constraint on new capacity, and no procurement schedule outruns a utility timeline.",
                "The existing room cannot host the hardware. Rack-scale AI systems such as NVIDIA's GB200 NVL72 ship liquid-cooled, and ASHRAE's TC 9.9 has documented why air cooling stops being economic at those densities; power capacity, floor loading, and a liquid path rule out most legacy rooms.",
                "The workload is still being defined. Hardware bought against a model architecture that changes in six months carries refresh risk that a rented instance simply does not.",
                "Nobody owns the facility. Without staffing for the electrical and mechanical layer, an on-prem cluster degrades quietly until it fails loudly.",
              ].map((t) => (
                <li key={t.slice(0, 24)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                  {t}
                </li>
              ))}
            </ul>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Two of those constraints have external evidence worth reading directly: the IEA&apos;s
              reporting on grid-connection bottlenecks driving the current scramble for capacity
              (2025)<Cite n={4} />, and ASHRAE TC 9.9&apos;s white paper on why liquid cooling is
              displacing air at high rack densities<Cite n={9} />, alongside NVIDIA&apos;s own
              specification for a 72-GPU liquid-cooled rack acting as one NVLink domain.
              <Cite n={7} /> Our{" "}
              <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
                direct-to-chip liquid cooling explainer
              </Link>{" "}
              covers the second constraint end to end, and the{" "}
              <Link href="/engineering/data-center-power-architecture" style={link}>
                power architecture page
              </Link>{" "}
              covers the first.
            </p>
          </section>

          {/* -------- hybrid -------- */}
          <section id="hybrid" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Hybrid is the usual answer, not a compromise</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Most organisations past the experimentation stage end up owning the predictable
              baseline and renting the peaks. Size owned capacity to sustained median demand, keep a
              cloud path for burst training runs, evaluation sweeps, and unexpected inference spikes,
              and re-measure the split whenever the workload or the hardware generation changes. That
              structure captures the utilization advantage of ownership without paying for capacity
              that exists only to survive a peak — and it keeps the residency-sensitive fraction of
              the data inside a perimeter you control while everything else stays elastic.
            </p>
          </section>

          {/* -------- PODOS -------- */}
          <section id="podos" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Where PODOS sits in this comparison</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              PODOS is on the on-prem side of the line, aimed specifically at the objections above
              that are about facilities rather than economics. Each{" "}
              <Link href="/platform/podos-pod" style={link}>
                PODOS Pod
              </Link>{" "}
              is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
              and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with power and
              closed-loop liquid cooling integrated in the factory rather than built on site — so the
              &quot;the room cannot host it&quot; and &quot;nobody owns the facility&quot;
              constraints are answered by the product instead of by a construction project. PODOS{" "}
              <span data-claim="deployment-window">
                targets a 90-day window from order to commissioning
              </span>{" "}
              for a standard unit, which is the lever that matters against OC-04: shortening
              time-to-capacity is how owned infrastructure stops conceding that row by default.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              It does not change the arithmetic in BE-01. If sustained utilization is low, renting is
              still the right call, and we would rather say so than sell a unit that runs idle. For
              the adjacent comparison — owning capacity through factory-built units versus a
              conventional facility — see{" "}
              <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={link}>
                modular vs traditional AI data centers
              </Link>
              . The{" "}
              <Link href="/deploy" style={link}>
                deployment model
              </Link>{" "}
              explains how a unit reaches a site, the{" "}
              <Link href="/platform" style={link}>
                platform overview
              </Link>{" "}
              shows how units compose, and unfamiliar terms are defined in the{" "}
              <Link href="/resources/ai-infrastructure-glossary" style={link}>
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
