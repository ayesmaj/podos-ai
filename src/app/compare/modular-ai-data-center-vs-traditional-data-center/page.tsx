/**
 * /compare/modular-ai-data-center-vs-traditional-data-center
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
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import SeoImage from "@/components/seo/SeoImage";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";

const PATH = "/compare/modular-ai-data-center-vs-traditional-data-center";
const TITLE = "Modular AI Data Center vs Traditional Data Center Compared";
const DESCRIPTION =
  "Neutral comparison of modular and traditional data centers for AI: schedule, capital profile, siting, permitting, scalability, and when each approach wins.";

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
    name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)",
    publisher: "ASHRAE TC 9.9",
    url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf",
    date: "c. 2021",
  },
];

/* ------------------------------------------------------------------ */
/* Criteria matrix                                                     */
/* ------------------------------------------------------------------ */
const CRITERIA: { criterion: string; traditional: string; modular: string }[] = [
  {
    criterion: "Schedule",
    traditional:
      "Sequential: design, permits, sitework, shell, fit-out, commissioning — each trade waits on the last. Often dominated by permitting and interconnection.",
    modular:
      "Parallel: factory production runs while sitework and permitting proceed; on-site scope shrinks to foundations, tie-ins, and commissioning.",
  },
  {
    criterion: "Capital profile",
    traditional:
      "Large up-front commitment sized to forecast demand; capacity arrives in one tranche, often before it is fully utilized.",
    modular:
      "Capacity bought in unit-sized increments, so spend tracks demand — but per-unit procurement carries a manufacturer's margin.",
  },
  {
    criterion: "Siting",
    traditional:
      "Wide freedom: any parcel that can be permitted and powered; the building is designed to the site.",
    modular:
      "Constrained by logistics: unit dimensions and weights must survive road transport and crane placement.",
  },
  {
    criterion: "Scalability",
    traditional:
      "Expansion is another construction project; scale economics favor very large single campuses.",
    modular:
      "Expansion is repetition: add units as demand and available power allow — closer to procurement than construction.",
  },
  {
    criterion: "Quality control",
    traditional:
      "Field labor quality varies by market; integration issues tend to surface during on-site commissioning.",
    modular:
      "Repeatable assembly and pre-shipment testing catch integration issues early; the factory line becomes the concentrated point of process risk.",
  },
  {
    criterion: "Customization limits",
    traditional:
      "Nearly unlimited: floor plans, security zoning, redundancy topology, and architecture are bespoke.",
    modular:
      "Bounded by the product: configuration lives inside the unit's designed envelope; needs outside it push back toward a custom build.",
  },
  {
    criterion: "Permitting",
    traditional:
      "Full building-construction path: zoning, structural, fire, and environmental review for a permanent structure.",
    modular:
      "Sometimes shorter where jurisdictions treat units as pre-engineered equipment on a foundation — treatment varies by authority and is never guaranteed.",
  },
];

/* ------------------------------------------------------------------ */
/* FAQ — one array feeds the visible section AND FAQJsonLd             */
/* ------------------------------------------------------------------ */
const FAQ: { q: string; a: string }[] = [
  {
    q: "What counts as a modular data center?",
    a: "A facility assembled from factory-built modules that integrate power distribution, cooling, and IT space, tested before delivery and completed on site with foundations, utility tie-ins, and commissioning. A traditional data center is constructed trade by trade in place.",
  },
  {
    q: "Is a modular data center the same as a container data center?",
    a: "No. Container data centers are one subset of the modular category. Many current modular units are purpose-engineered enclosures rather than converted shipping containers, though both share the factory-built, ship-then-commission delivery model.",
  },
  {
    q: "Are modular data centers cheaper than traditional builds?",
    a: "There is no defensible general answer. Delivered cost depends on site conditions, scale, labor market, power path, and what scope each quote includes. Category-wide cost claims usually compare unlike scopes; compare fully delivered scope for your specific site instead.",
  },
  {
    q: "Why do AI workloads change this comparison?",
    a: "AI racks concentrate more power and heat than most existing facilities were designed around — Uptime Institute's 2025 survey reports typical rack densities rising into the 10 to 30 kW band, with AI clusters above it — and dense racks increasingly require liquid cooling. Factory integration of power, liquid cooling, and IT in one tested unit is a direct response to that shift.",
  },
];

/* ------------------------------------------------------------------ */
/* Small style helpers (tokens only — design-language-lock.md)         */
/* ------------------------------------------------------------------ */
const h2Style: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 800,
  fontSize: "clamp(1.6rem, 3vw, 2.3rem)",
  lineHeight: 1.06,
  letterSpacing: "-0.035em",
  color: "var(--ink-strong)",
  textWrap: "balance",
};

const codePillStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  color: "var(--brand-deep)",
  background: "rgba(37, 99, 235, 0.07)",
  border: "1px solid rgba(37, 99, 235, 0.16)",
  borderRadius: 999,
  padding: "0.28rem 0.7rem",
  display: "inline-block",
};

const panelStyle: React.CSSProperties = {
  background: "var(--panel)",
  border: "1px solid var(--edge)",
  borderRadius: 12,
  boxShadow: "0 1px 2px rgba(15,23,42,0.03), 0 4px 20px -8px rgba(15,23,42,0.06)",
};

function VerdictCard({ code, title, body }: { code: string; title: string; body: React.ReactNode }) {
  return (
    <div className="card-lift" style={{ ...panelStyle, padding: "1.4rem 1.5rem" }}>
      <span style={codePillStyle}>{code}</span>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "1.08rem",
          letterSpacing: "-0.02em",
          color: "var(--ink-strong)",
          marginTop: "0.75rem",
        }}
      >
        {title}
      </h3>
      <p className="t-body" style={{ marginTop: "0.45rem", fontSize: "0.95rem" }}>
        {body}
      </p>
    </div>
  );
}

/* ================================================================== */
export default function ModularVsTraditionalPage() {
  return (
    <main style={{ background: "var(--paper)", color: "var(--ink-strong)" }}>
      <TechArticleJsonLd
        headline={TITLE}
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="Article"
      />
      <FAQJsonLd items={FAQ} />

      {/* ---------------- HERO — compact ---------------- */}
      <section
        style={{
          borderBottom: "1px solid var(--edge-faint)",
          paddingTop: "clamp(6.5rem, 14vh, 9rem)",
          paddingBottom: "clamp(2.5rem, 6vh, 4rem)",
        }}
      >
        <div className="container-site" style={{ maxWidth: 1160 }}>
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Modular vs traditional data center", path: PATH },
            ]}
          />

          <p
            style={{
              marginTop: "2.2rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--brand-deep)",
              background: "var(--glass-bg-strong)",
              border: "1px solid var(--edge-bright)",
              borderRadius: 999,
              padding: "0.4rem 0.95rem",
            }}
          >
            <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>CMP-01</span>
            <span aria-hidden style={{ opacity: 0.4 }}>
              ·
            </span>
            COMPARE
          </p>

          <h1
            className="t-headline"
            style={{ marginTop: "1.3rem", maxWidth: "22ch", textWrap: "balance" }}
          >
            Modular AI data center <span className="t-sweep-brand">vs</span> traditional data
            center
          </h1>

          <p className="t-lede" style={{ marginTop: "1.4rem", maxWidth: "62ch" }}>
            A modular AI data center is assembled from factory-built units — power, cooling, and IT
            integrated and tested before they reach the site. A traditional data center is
            engineered and constructed in place, trade by trade. Neither is better in the abstract:
            the choice moves schedule risk, capital commitment, and quality control between a
            production line and a construction site.
          </p>

          <div style={{ marginTop: "1.6rem" }}>
            <LastVerified
              published="2026-08-31"
              lastVerified="2026-08-31"
              author="Josef Elimelech"
              reviewer="PODOS AI Engineering"
            />
          </div>

          <figure style={{ marginTop: "2.4rem", maxWidth: 900 }}>
            <SeoImage id="compare-split-frame" priority />
            <figcaption
              style={{
                marginTop: "0.7rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--ink-dim)",
              }}
            >
              Left: built in place. Right: factory-built, commissioned on a pad.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------- WHY THE QUESTION IS LIVE ---------------- */}
      <section className="section-pad" style={{ paddingBottom: "clamp(2rem, 4vh, 3rem)" }}>
        <div className="container-site" style={{ maxWidth: 1160 }}>
          <div style={{ maxWidth: "70ch" }}>
            <h2 style={h2Style}>Why AI forces the comparison</h2>
            <p className="t-body" style={{ marginTop: "1rem" }}>
              AI demand turned a niche procurement question into a schedule question. The IEA
              projects data centres rising from around 1.5% of global electricity consumption in
              2025 to roughly 3% — about 945 TWh — by 2030
              <Cite n={1} />; Lawrence Berkeley National Laboratory estimates US data centers used
              4.4% of US electricity in 2023, projected at 6.7–12% by 2028
              <Cite n={2} />; and grid-connection bottlenecks tightened through 2025 even as demand
              surged
              <Cite n={4} />.
            </p>
            <p className="t-body" style={{ marginTop: "0.9rem" }}>
              The workload changed shape too. Uptime Institute&apos;s 2025 survey reports typical
              rack densities rising into the 10–30 kW band, with AI clusters beyond it
              <Cite n={3} />, and ASHRAE documents liquid cooling displacing air as densities climb
              <Cite n={5} />. Dense capacity rewards tight integration of{" "}
              <Link
                href="/engineering/direct-to-chip-liquid-cooling"
                style={{ color: "var(--brand-deep)", textDecoration: "underline" }}
              >
                direct-to-chip liquid cooling
              </Link>{" "}
              and{" "}
              <Link
                href="/engineering/data-center-power-architecture"
                style={{ color: "var(--brand-deep)", textDecoration: "underline" }}
              >
                power architecture
              </Link>{" "}
              — work a factory repeats and a field crew rebuilds on every project. That is the
              engineering case for modular. It is not the whole case.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- CRITERIA TABLE ---------------- */}
      <section className="section-pad" style={{ paddingTop: "clamp(2rem, 4vh, 3rem)" }}>
        <div className="container-site" style={{ maxWidth: 1160 }}>
          <h2 style={h2Style}>Seven criteria, no winner column</h2>
          <p className="t-body" style={{ marginTop: "0.9rem", maxWidth: "70ch" }}>
            Each row states where the risk or constraint actually sits — read it against your
            project, not a vendor&apos;s brochure, including ours.
          </p>

          <div
            style={{
              ...panelStyle,
              marginTop: "1.8rem",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: 780,
                borderCollapse: "collapse",
                fontSize: "0.92rem",
                lineHeight: 1.55,
              }}
            >
              <caption className="sr-only">
                Comparison of traditional and modular data centers across seven criteria
              </caption>
              <thead>
                <tr>
                  {["Criterion", "Traditional (built in place)", "Modular (factory-built)"].map(
                    (h) => (
                      <th
                        key={h}
                        scope="col"
                        style={{
                          textAlign: "left",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          color: "var(--ink-dim)",
                          padding: "0.95rem 1.2rem",
                          borderBottom: "1px solid var(--edge)",
                          background: "var(--canvas)",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {CRITERIA.map((row) => (
                  <tr key={row.criterion}>
                    <th
                      scope="row"
                      style={{
                        textAlign: "left",
                        verticalAlign: "top",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.74rem",
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--brand-deep)",
                        padding: "0.95rem 1.2rem",
                        borderTop: "1px solid var(--edge-faint)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.criterion}
                    </th>
                    <td
                      style={{
                        verticalAlign: "top",
                        color: "var(--ink-dim)",
                        padding: "0.95rem 1.2rem",
                        borderTop: "1px solid var(--edge-faint)",
                      }}
                    >
                      {row.traditional}
                    </td>
                    <td
                      style={{
                        verticalAlign: "top",
                        color: "var(--ink-dim)",
                        padding: "0.95rem 1.2rem",
                        borderTop: "1px solid var(--edge-faint)",
                      }}
                    >
                      {row.modular}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------------- WHEN TRADITIONAL WINS ---------------- */}
      <section className="section-pad" style={{ paddingTop: "clamp(2rem, 4vh, 3rem)" }}>
        <div className="container-site" style={{ maxWidth: 1160 }}>
          <h2 style={h2Style}>When a traditional build is the right call</h2>
          <p className="t-body" style={{ marginTop: "0.9rem", maxWidth: "70ch" }}>
            Modular vendors rarely say this part plainly. Traditional construction wins when scale
            economics or unlimited customization is the binding requirement.
          </p>
          <div
            style={{
              marginTop: "1.6rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <VerdictCard
              code="CMP-T1"
              title="Hyperscale campuses"
              body="At hundreds of megawatts on one site, a purpose-built campus amortizes design, sitework, and utility infrastructure across the whole build. Unit-by-unit delivery adds little there."
            />
            <VerdictCard
              code="CMP-T2"
              title="Bespoke requirements"
              body="Custom security zoning, unusual redundancy topologies, special floor loading, or multi-tenant architecture exceed any standardized unit's envelope. Bespoke problems justify bespoke buildings."
            />
            <VerdictCard
              code="CMP-T3"
              title="An existing shell"
              body="A powered building with usable structure already in hand can make a fit-out cheaper and faster than shipping new enclosures — the enclosure is the part you already own."
            />
            <VerdictCard
              code="CMP-T4"
              title="Jurisdictions that treat modules as buildings"
              body="Where the authority routes factory-built units through the full building-permit path anyway, the permitting advantage shrinks and the decision reverts to logistics and quality control."
            />
          </div>
        </div>
      </section>

      {/* ---------------- WHEN MODULAR WINS ---------------- */}
      <section className="section-pad" style={{ paddingTop: "clamp(2rem, 4vh, 3rem)" }}>
        <div className="container-site" style={{ maxWidth: 1160 }}>
          <h2 style={h2Style}>When modular wins</h2>
          <div
            style={{
              marginTop: "1.6rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <VerdictCard
              code="CMP-M1"
              title="Time-bound AI capacity"
              body="When GPU capacity has a deadline, moving integration work off the critical path and into a factory is the main lever a buyer controls. Sitework and production run in parallel instead of in sequence."
            />
            <VerdictCard
              code="CMP-M2"
              title="High density from day one"
              body={
                <>
                  Liquid-cooled AI racks exceed the design assumptions of most legacy floor plans
                  <Cite n={3} />
                  <Cite n={5} />. A unit engineered around direct-to-chip cooling avoids retrofitting
                  a building that was designed for air.
                </>
              }
            />
            <VerdictCard
              code="CMP-M3"
              title="Capacity where power already exists"
              body={
                <>
                  With grid connections bottlenecked
                  <Cite n={4} />, compact factory-built units can be placed at sites that already
                  have power — substations, industrial parcels, campus edges — rather than waiting on
                  a greenfield interconnection.
                </>
              }
            />
            <VerdictCard
              code="CMP-M4"
              title="Uncertain demand curves"
              body="Buying capacity in unit-sized increments converts a forecast-sized capital commitment into a sequence of smaller, reversible decisions. Under-forecasting costs a purchase order, not a building."
            />
          </div>
        </div>
      </section>

      {/* ---------------- ASSUMPTIONS + LIMITATIONS ---------------- */}
      <section className="section-pad" style={{ paddingTop: "clamp(2rem, 4vh, 3rem)" }}>
        <div className="container-site" style={{ maxWidth: 1160 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.4rem",
            }}
          >
            <div style={{ ...panelStyle, padding: "1.6rem 1.7rem" }}>
              <h2 style={{ ...h2Style, fontSize: "1.35rem" }}>Assumptions behind this comparison</h2>
              <ul
                className="t-body"
                style={{
                  marginTop: "0.9rem",
                  fontSize: "0.95rem",
                  display: "grid",
                  gap: "0.6rem",
                  paddingLeft: "1.1rem",
                  listStyle: "disc",
                }}
              >
                <li>
                  New-build capacity for AI or other high-density workloads, where both delivery
                  models are actually available.
                </li>
                <li>
                  Power availability binds both paths equally; neither model manufactures megawatts.
                </li>
                <li>
                  No cost figures. Delivered $/MW varies too widely by site, scale, and scope to
                  publish a general number honestly.
                </li>
                <li>
                  &quot;Modular&quot; is used vendor-neutrally for factory-built units of any form
                  factor — see the{" "}
                  <Link
                    href="/resources/ai-infrastructure-glossary"
                    style={{ color: "var(--brand-deep)", textDecoration: "underline" }}
                  >
                    AI infrastructure glossary
                  </Link>{" "}
                  for term boundaries.
                </li>
              </ul>
            </div>

            <div style={{ ...panelStyle, padding: "1.6rem 1.7rem" }}>
              <h2 style={{ ...h2Style, fontSize: "1.35rem" }}>What this comparison cannot tell you</h2>
              <ul
                className="t-body"
                style={{
                  marginTop: "0.9rem",
                  fontSize: "0.95rem",
                  display: "grid",
                  gap: "0.6rem",
                  paddingLeft: "1.1rem",
                  listStyle: "disc",
                }}
              >
                <li>
                  No public, apples-to-apples dataset of measured schedules and costs exists across
                  both models at fleet scale. Vendors publish targets; operators rarely publish
                  actuals.
                </li>
                <li>
                  The category boundary blurs in practice — many traditional builds now use
                  prefabricated electrical rooms and cooling skids.
                </li>
                <li>
                  The numbers cited here are industry-level demand and density figures, not
                  predictions for any specific project.
                </li>
                <li>
                  PODOS builds modular hardware. Read this page knowing where it comes from.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- WHERE PODOS SITS ---------------- */}
      <section className="section-pad" style={{ paddingTop: "clamp(2rem, 4vh, 3rem)" }}>
        <div className="container-site" style={{ maxWidth: 1160 }}>
          <div style={{ maxWidth: "70ch" }}>
            <h2 style={h2Style}>Where PODOS sits in this comparison</h2>
            <p className="t-body" style={{ marginTop: "1rem" }}>
              PODOS builds on the modular side of this table.{" "}
              <span data-claim="unit-capacity-1mw">
                Each PODOS Pod is designed as a standardized 1-MW building block for AI
                infrastructure
              </span>
              ,{" "}
              <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, and{" "}
              <span data-claim="deployment-window">
                PODOS targets a 90-day window from order to commissioning for a standard unit
              </span>{" "}
              — a target, not a measured deployment figure. The{" "}
              <Link
                href="/platform"
                style={{ color: "var(--brand-deep)", textDecoration: "underline" }}
              >
                platform overview
              </Link>{" "}
              explains the architecture, the{" "}
              <Link
                href="/platform/podos-pod"
                style={{ color: "var(--brand-deep)", textDecoration: "underline" }}
              >
                PODOS Pod page
              </Link>{" "}
              carries the unit specification, and the{" "}
              <Link href="/deploy" style={{ color: "var(--brand-deep)", textDecoration: "underline" }}>
                deployment model
              </Link>{" "}
              covers what happens between order and commissioning. If your project matches the
              traditional-wins rows above, a pod is the wrong tool.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="section-pad" style={{ paddingTop: "clamp(2rem, 4vh, 3rem)" }}>
        <div className="container-site" style={{ maxWidth: 1160 }}>
          <h2 style={h2Style}>Frequently asked questions</h2>
          <div style={{ marginTop: "1.6rem", display: "grid", gap: "1rem", maxWidth: "78ch" }}>
            {FAQ.map((item, i) => (
              <div key={item.q} style={{ ...panelStyle, padding: "1.3rem 1.5rem" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.02rem",
                    letterSpacing: "-0.015em",
                    color: "var(--ink-strong)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      color: "var(--cyan-deep)",
                      marginRight: "0.6rem",
                    }}
                  >
                    Q{i + 1}
                  </span>
                  {item.q}
                </h3>
                <p className="t-body" style={{ marginTop: "0.55rem", fontSize: "0.95rem" }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SOURCES ---------------- */}
      <section style={{ paddingBottom: "clamp(4rem, 8vh, 6rem)" }}>
        <div className="container-site" style={{ maxWidth: 1160 }}>
          <EvidenceSourceRail sources={SOURCES} />
        </div>
      </section>
    </main>
  );
}
