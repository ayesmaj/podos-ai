/**
 * /compare/factory-built-vs-site-built-data-center
 *
 * Compare cluster, delivery-method framing (CMP-02). Sibling page
 * CMP-01 compares the PRODUCT categories (modular vs traditional);
 * this page compares the DELIVERY METHOD for the same scope of work —
 * schedule overlap, inspection regimes, permitting interfaces,
 * customization limits, transport envelope, and where site-built wins.
 *
 * Server component: all copy in initial HTML, CSS-only hovers, no
 * client JS. MAIN light technical design system only (never the
 * investor dark-theme utility classes).
 * Company claims render only from publishable claims.ts entries with
 * their required qualifier; external numbers cite the source rail.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";

const PATH = "/compare/factory-built-vs-site-built-data-center";
const TITLE = "Factory-Built vs Site-Built Data Centers: Full Comparison";
const DESCRIPTION =
  "How factory-built and site-built data centers differ on schedule overlap, quality control, permitting interfaces, customization, and transport limits.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

/* ------------------------------------------------------------------ */
/* Sources — source register + primary sources verified 2026-08-31     */
/* ------------------------------------------------------------------ */
const SOURCES: Source[] = [
  {
    n: 1,
    name: "Commercial Vehicle Size and Weight Program (federal size and weight standards)",
    publisher: "Federal Highway Administration (US DOT)",
    url: "https://ops.fhwa.dot.gov/freight/sw/overview/index.htm",
    date: "accessed 2026-08-31",
  },
  {
    n: 2,
    name: "ICC/MBI 1205-2021, Standard for Inspection and Regulatory Compliance in Off-Site Construction",
    publisher: "International Code Council / Modular Building Institute",
    url: "https://codes.iccsafe.org/content/ICC12052021P1",
    date: "2021 ed.",
  },
  {
    n: 3,
    name: "New brief explores implementation of ICC/MBI standards 1200 and 1205 for off-site construction",
    publisher: "International Code Council (Building Safety Journal)",
    url: "https://www.iccsafe.org/building-safety-journal/bsj-technical/new-brief-explores-implementation-of-icc-mbi-standards-1200-and-1205-for-off-site-construction/",
  },
  {
    n: 4,
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 5,
    name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)",
    publisher: "ASHRAE TC 9.9",
    url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf",
    date: "c. 2021",
  },
  {
    n: 6,
    name: "NFPA 75, Standard for the Fire Protection of Information Technology Equipment",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "2024 ed.",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "What is the difference between a factory-built and a site-built data center?",
    a: "The scope of work is nearly identical; its location moves. A site-built data center is assembled in place, trade by trade, under a local building permit. A factory-built one is produced on a production line, inspected in the plant, then transported and connected on a prepared pad. The difference is schedule overlap, inspection regime, and transport limits — not physics.",
  },
  {
    q: "Do factory-built data centers still need building permits?",
    a: "Yes. Factory-built units add an approval interface rather than removing one: plans reviewed once and inspected in-plant by a third-party agency or a state industrialized-building program, while the local authority having jurisdiction still permits foundations, utilities, and final connection. ICC/MBI 1205 describes that handoff.",
  },
  {
    q: "How much can factory production actually compress a schedule?",
    a: "Only the part of the critical path that is construction work. Unit production overlaps sitework and permitting, so integration and testing leave it. Utility interconnection, environmental review, and long-lead equipment do not move — if a grid connection governs the date, the delivery method changes little.",
  },
  {
    q: "What limits how large a factory-built module can be?",
    a: "The road, not the factory. Federal Highway Administration standards set 80,000 lb gross vehicle weight, 20,000 lb on a single axle and 34,000 lb on a tandem axle on the Interstate System, plus a 102-inch width no state may set above or below on the National Network. Beyond those figures delivery becomes an oversize/overweight permit exercise.",
  },
  {
    q: "When is site-built still the better choice?",
    a: "When the requirement is bespoke, when a powered shell already exists, when the campus is large enough that one design amortizes across hundreds of megawatts, or when the route cannot accept a unit. Then conventional construction is the honest answer.",
  },
];

/* ------------------------------------------------------------------ */
/* Shared styles (server component — no client JS)                     */
/* ------------------------------------------------------------------ */
const th: CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 11.5,
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
  textAlign: "left",
  padding: "0.8rem 1rem",
  borderBottom: "1px solid var(--edge-bright)",
  background: "var(--canvas)",
  whiteSpace: "nowrap",
};

const td: CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.55,
  color: "var(--ink-dim)",
  padding: "0.8rem 1rem",
  borderBottom: "1px solid var(--edge-faint)",
  verticalAlign: "top",
  minWidth: "12rem",
};

const tdKey: CSSProperties = {
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

const tableWrap: CSSProperties = {
  marginTop: "1.6rem",
  overflowX: "auto",
  background: "var(--panel)",
  border: "1px solid var(--edge)",
  borderRadius: 12,
  boxShadow: "0 1px 2px rgba(15,23,42,0.03), 0 4px 20px -8px rgba(15,23,42,0.06)",
};

const table: CSSProperties = { width: "100%", minWidth: 760, borderCollapse: "collapse" };

/* ------------------------------------------------------------------ */
/* Quality-control regimes                                             */
/* ------------------------------------------------------------------ */
const QC: { code: string; point: string; site: string; factory: string }[] = [
  {
    code: "FB-01",
    point: "Who performs the work",
    site: "A rotating crew from the local trade market, different on every project and often between phases of one project.",
    factory:
      "A fixed crew repeating the same build, where the tenth unit is assembled by the people who assembled the first nine.",
  },
  {
    code: "FB-02",
    point: "When defects surface",
    site: "During on-site commissioning, at the end of the schedule, when rework is most expensive and most likely to move the date.",
    factory:
      "During in-plant inspection and pre-shipment testing — but a process defect repeats across every unit already built.",
  },
  {
    code: "FB-03",
    point: "Inspection regime",
    site: "Progressive inspections by the local authority having jurisdiction as each phase closes; the record is per-project.",
    factory:
      "In-plant inspection by a third-party agency or a state industrialized-building program, plus on-site final inspection after assembly.",
  },
  {
    code: "FB-04",
    point: "Test conditions",
    site: "Cooling and power are proven under whatever weather exists on the commissioning date.",
    factory:
      "Integration is tested indoors on instrumented benches, with a failed test re-run the same day.",
  },
  {
    code: "FB-05",
    point: "Failure mode of the QC system",
    site: "Variance — quality tracks the crew and the market; no two rooms are identical.",
    factory:
      "Correlation — a line defect is a fleet defect. Concentration is both the benefit and the exposure.",
  },
];

/* ------------------------------------------------------------------ */
/* Permitting / approval interfaces                                    */
/* ------------------------------------------------------------------ */
const PERMITS: { code: string; interfaceName: string; owner: string; note: string; cite?: number }[] =
  [
    {
      code: "FB-P1",
      interfaceName: "Land use and zoning",
      owner: "Local jurisdiction",
      note: "Identical for both. Use, setbacks, noise, screening, and height are decided by the parcel, not by where the equipment was assembled.",
    },
    {
      code: "FB-P2",
      interfaceName: "Utility interconnection",
      owner: "Utility / grid operator",
      note: "Identical for both, and frequently the governing item. No delivery method shortens a queue position.",
    },
    {
      code: "FB-P3",
      interfaceName: "Module plan review and in-plant inspection",
      owner: "State modular program or approved third-party agency",
      note: "Unique to factory-built. ICC/MBI 1205 sets out permitting, in-plant and final inspection, third-party inspectors, and industrialized-building departments.",
      cite: 2,
    },
    {
      code: "FB-P4",
      interfaceName: "Site permit for foundations and connections",
      owner: "Local authority having jurisdiction",
      note: "Still required. The AHJ permits the pad, utilities, and tie-ins, then inspects the assembled result.",
      cite: 3,
    },
    {
      code: "FB-P5",
      interfaceName: "Fire protection and life safety",
      owner: "Fire code official / AHJ",
      note: "Detection and suppression for IT areas are reviewed locally under NFPA 75 wherever the enclosure was built.",
      cite: 6,
    },
    {
      code: "FB-P6",
      interfaceName: "Transport and route approval",
      owner: "State DOT / permit offices",
      note: "Unique to factory-built. Oversize or overweight moves need routing, escorts, and bridge analysis before a date can be promised.",
      cite: 1,
    },
  ];

/* ------------------------------------------------------------------ */
/* Decision checklist                                                  */
/* ------------------------------------------------------------------ */
const CHECKLIST: { n: string; q: string; leans: string }[] = [
  {
    n: "01",
    q: "Is the governing constraint on the completion date construction work, or interconnection and review?",
    leans:
      "If construction dominates, factory production removes it from the critical path. If utility or environmental review dominates, the method barely moves the date.",
  },
  {
    n: "02",
    q: "Can the requirement be met inside a standardized envelope?",
    leans:
      "Configurable-within-a-product favors factory-built. Bespoke floor plans, security zoning, or unusual redundancy favor site-built.",
  },
  {
    n: "03",
    q: "Will the design be frozen early enough for a production slot?",
    leans:
      "Factory-built turns late changes into change orders. Moving scope is safer built in place.",
  },
  {
    n: "04",
    q: "Does the route to the pad accept the module legally?",
    leans:
      "Inside the legal road envelope, transport is routine freight. Outside it, permits and escorts become schedule risk of their own.",
  },
  {
    n: "05",
    q: "Does the jurisdiction have an off-site construction path?",
    leans:
      "A state modular program or accepted third-party agency preserves the approval advantage. Jurisdictions that review units as ordinary buildings erase it.",
  },
  {
    n: "06",
    q: "Is there an existing powered shell?",
    leans:
      "If the building and the service are already there, fitting out usually beats shipping new enclosures.",
  },
  {
    n: "07",
    q: "How many identical increments will be ordered?",
    leans:
      "Repetition pays for tooling and process. One-off capacity rarely recovers that setup cost.",
  },
  {
    n: "08",
    q: "Who carries the integration risk in the contract?",
    leans:
      "Factory delivery consolidates responsibility with one manufacturer; site-built spreads it across trades and a general contractor. Choose which counterparty you would rather hold.",
  },
];

/* ================================================================== */
export default function FactoryBuiltVsSiteBuiltPage() {
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

      {/* ---------------- HERO ---------------- */}
      <header
        className="container-site"
        style={{
          maxWidth: 1160,
          paddingTop: "clamp(6.5rem, 12vh, 9rem)",
          paddingBottom: "clamp(2.5rem, 5vh, 4rem)",
        }}
      >
        <Breadcrumbs
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Factory-built vs site-built data center", path: PATH },
          ]}
        />

        <p
          style={{
            marginTop: "2.2rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.55rem",
            fontFamily: "var(--font-geist-mono), monospace",
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
          <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>CMP-02</span>
          <span aria-hidden style={{ opacity: 0.4 }}>
            ·
          </span>
          COMPARE
        </p>

        <h1
          className="t-headline"
          style={{ marginTop: "1.3rem", maxWidth: "20ch", textWrap: "balance" }}
        >
          Factory-built <span className="t-sweep-brand">vs</span> site-built data centers
        </h1>

        <p className="t-lede" style={{ marginTop: "1.4rem", maxWidth: "64ch", color: "var(--ink-dim)" }}>
          Factory-built and site-built data centers do the same work in different places. A
          site-built facility is assembled on the parcel, trade by trade, under a local building
          permit. A factory-built facility is produced as finished units on a production line,
          inspected in the plant, then transported and connected on a prepared pad. The choice moves
          schedule overlap, inspection regime, customization freedom, and transport risk — it does
          not change the physics of power and heat.
        </p>

        <div style={{ marginTop: "1.6rem" }}>
          <LastVerified
            published="2026-08-31"
            lastVerified="2026-08-31"
            author="Josef Elimelech"
            reviewer="PODOS AI Engineering"
          />
        </div>
      </header>

      <article className="container-site" style={{ maxWidth: 1160, paddingBottom: "clamp(4rem, 8vh, 6rem)" }}>
        {/* -------- framing -------- */}
        <section id="framing" style={{ scrollMarginTop: 96 }}>
          <h2 style={h2Style}>The scope does not shrink — it relocates</h2>
          <p className="t-body" style={{ marginTop: "1rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            Every megawatt of AI capacity needs the same components either way: switchgear,
            distribution, cooling plant, a thermal loop to the chips, structure, fire protection, and
            a commissioning campaign that proves it all works together. Factory construction does not
            delete that scope. It moves the standardizable part indoors and leaves the rest —
            earthwork, foundations, utility service, final tie-ins — on the site.
          </p>
          <p className="t-body" style={{ marginTop: "0.9rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            That matters more than it used to because of what goes inside. Uptime Institute&apos;s
            2025 survey puts typical rack densities in the 10–30 kW band with AI clusters above it
            <Cite n={4} />, and ASHRAE documents liquid cooling moving into mainstream facilities as
            densities climb<Cite n={5} />. Dense racks demand tight integration between{" "}
            <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
              power distribution
            </Link>{" "}
            and{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
              direct-to-chip liquid cooling
            </Link>{" "}
            — repeated, tolerance-sensitive assembly that a production line does well and a rotating
            field crew rebuilds from scratch on every job. This page compares the two methods of
            building; for the product-level comparison, see{" "}
            <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>
              modular vs traditional AI data centers
            </Link>
            .
          </p>
        </section>

        {/* -------- schedule overlap -------- */}
        <section id="schedule" style={{ marginTop: "clamp(3rem, 6vh, 4.5rem)", scrollMarginTop: 96 }}>
          <h2 style={h2Style}>Schedule overlap: what actually leaves the critical path</h2>
          <p className="t-body" style={{ marginTop: "1rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            The schedule argument is narrower than it is usually presented. A site-built project is
            largely sequential because the work shares one physical space: the slab cures before the
            structure rises, the structure before mechanical rough-in, rough-in before fit-out,
            fit-out before commissioning. Each trade inherits the previous trade&apos;s delay.
          </p>
          <p className="t-body" style={{ marginTop: "0.9rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            Factory construction breaks that dependency by putting the work in two places at once:
            while units are produced and tested indoors, the site crew is clearing, grading, pouring,
            and running conduit. The compression comes entirely from that overlap, so it is bounded
            by it. Three things do not overlap:
          </p>
          <ul style={{ marginTop: "1rem", display: "grid", gap: "0.6rem", paddingLeft: "1.25rem", listStyle: "disc" }}>
            {[
              "Utility interconnection. A queue position, a study, and a service upgrade run on the utility's calendar. If the grid connection governs the date, the method is close to irrelevant.",
              "Environmental and land-use review. The parcel is reviewed on its own merits; a factory changes nothing about what the jurisdiction examines.",
              "Long-lead equipment. Transformers, switchgear, and chillers have lead times a production line consumes rather than creates — the factory waits for the same parts the field would have.",
            ].map((t) => (
              <li key={t.slice(0, 20)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                {t}
              </li>
            ))}
          </ul>
          <p className="t-body" style={{ marginTop: "1rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            The test is simple: draw the critical path, then ask what fraction of it is construction
            labour. That fraction is the ceiling on what factory production can win. A schedule
            advantage quoted without naming it — by any manufacturer, ours included — is a best case,
            not a forecast.
          </p>
        </section>

        {/* -------- quality control -------- */}
        <section id="quality" style={{ marginTop: "clamp(3rem, 6vh, 4.5rem)", scrollMarginTop: 96 }}>
          <h2 style={h2Style}>Quality control: two different failure modes</h2>
          <p className="t-body" style={{ marginTop: "1rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            Neither method is inherently higher quality. They fail differently, and the difference is
            worth understanding before choosing.
          </p>

          <div style={tableWrap}>
            <table style={table}>
              <caption className="sr-only">
                Quality-control comparison between site-built and factory-built data centers
              </caption>
              <thead>
                <tr>
                  <th style={th} scope="col">
                    Ref
                  </th>
                  <th style={th} scope="col">
                    Control point
                  </th>
                  <th style={th} scope="col">
                    Site-built
                  </th>
                  <th style={th} scope="col">
                    Factory-built
                  </th>
                </tr>
              </thead>
              <tbody>
                {QC.map((r) => (
                  <tr key={r.code}>
                    <td style={td}>
                      <span style={codePill}>{r.code}</span>
                    </td>
                    <td style={tdKey}>{r.point}</td>
                    <td style={td}>{r.site}</td>
                    <td style={td}>{r.factory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="t-body" style={{ marginTop: "1.2rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            Row FB-05 is the one buyers underweight: site-built quality varies unit to unit, while
            factory-built quality correlates, so a repeated mistake ships to everyone in the batch.
            Traceability, documented test records, and a corrective-action path matter more than any
            single unit&apos;s test report.
          </p>
        </section>

        {/* -------- permitting -------- */}
        <section id="permitting" style={{ marginTop: "clamp(3rem, 6vh, 4.5rem)", scrollMarginTop: 96 }}>
          <h2 style={h2Style}>Permitting interfaces: one more approval, not one fewer</h2>
          <p className="t-body" style={{ marginTop: "1rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            Factory-built capacity does not avoid permitting. It splits approval across two
            authorities: an off-site path that reviews and inspects the unit where it is made, and
            the ordinary local path that permits the ground it lands on. The International Code
            Council and the Modular Building Institute published ICC/MBI 1200 and 1205 to
            standardize that handoff — 1200 covering planning, design, fabrication, and assembly in
            off-site construction; 1205 covering permitting, in-plant and on-site final inspection,
            third-party inspection, industrialized-building departments, state modular programs, and
            the authority having jurisdiction.
            <Cite n={2} />
            <Cite n={3} />
          </p>

          <div style={tableWrap}>
            <table style={table}>
              <caption className="sr-only">
                Approval interfaces and which authority owns each for factory-built and site-built
                projects
              </caption>
              <thead>
                <tr>
                  <th style={th} scope="col">
                    Ref
                  </th>
                  <th style={th} scope="col">
                    Approval interface
                  </th>
                  <th style={th} scope="col">
                    Authority
                  </th>
                  <th style={th} scope="col">
                    What changes with delivery method
                  </th>
                </tr>
              </thead>
              <tbody>
                {PERMITS.map((r) => (
                  <tr key={r.code}>
                    <td style={td}>
                      <span style={codePill}>{r.code}</span>
                    </td>
                    <td style={tdKey}>{r.interfaceName}</td>
                    <td style={td}>{r.owner}</td>
                    <td style={td}>
                      {r.note}
                      {r.cite ? <Cite n={r.cite} /> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="t-body" style={{ marginTop: "1.2rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            The advantage is repetition, not exemption: one plan set reviewed once and inspected
            in-plant serves many identical units, and local review narrows to the site scope. Where
            the jurisdiction has no off-site program, that advantage disappears.
          </p>
        </section>

        {/* -------- customization -------- */}
        <section id="customization" style={{ marginTop: "clamp(3rem, 6vh, 4.5rem)", scrollMarginTop: 96 }}>
          <h2 style={h2Style}>Customization limits and the design freeze</h2>
          <p className="t-body" style={{ marginTop: "1rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            Site-built construction stays customizable late; factory-built construction is
            customizable early and expensive to change late. A field crew can absorb a redesigned
            electrical room in week thirty because the room is still a drawing and a stack of
            conduit. A production line cannot: the change propagates to tooling, test fixtures,
            approved plan sets, and units already in progress.
          </p>
          <p className="t-body" style={{ marginTop: "0.9rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            So the question is not &ldquo;how customizable is it?&rdquo; but &ldquo;when does
            customization close?&rdquo; Factory-built products configure inside a fixed envelope —
            rack layout, power topology, coolant interface, ambient rating. Requirements that break
            the envelope push the project back toward a custom building; a manufacturer that agrees
            to break its own envelope is selling site-built work at factory prices.
          </p>
        </section>

        {/* -------- transport -------- */}
        <section id="transport" style={{ marginTop: "clamp(3rem, 6vh, 4.5rem)", scrollMarginTop: 96 }}>
          <h2 style={h2Style}>Transport constraints: the road designs the product</h2>
          <p className="t-body" style={{ marginTop: "1rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            The hardest limit on factory-built infrastructure is not manufacturing capability. It is
            the public road. Federal Highway Administration standards on the Interstate System set
            80,000 lb gross vehicle weight, 20,000 lb on a single axle, and 34,000 lb on a tandem
            axle; on the National Network no state may impose a width limitation of more or less
            than 102 inches, while height limits are left to the states.<Cite n={1} /> Those figures
            are the real design constraint behind every standardized unit on the market.
          </p>
          <p className="t-body" style={{ marginTop: "0.9rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            Two strategies follow. The first stays inside the legal envelope — often at or near
            standard intermodal freight-container proportions — so delivery is ordinary freight on
            ordinary trailers. The second exceeds it and
            accepts oversize or overweight permitting: state-by-state routing, escorts, bridge
            analysis, curfews, and a date set by a permit office. Neither is wrong, but the second
            reintroduces on the highway the schedule variance factory production was meant to
            remove.
          </p>
          <p className="t-body" style={{ marginTop: "0.9rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            Placement is the second half. Units land by crane, which needs an approach, a laydown
            area, a load-rated pad, and overhead clearance. Tight infill sites, weight-restricted
            bridges, and sites with no crane standing room can rule out factory delivery on geometry
            alone — a constraint that never appears in a spreadsheet comparison.
          </p>
        </section>

        {/* -------- when site-built wins -------- */}
        <section id="site-built-wins" style={{ marginTop: "clamp(3rem, 6vh, 4.5rem)", scrollMarginTop: 96 }}>
          <h2 style={h2Style}>Where site-built remains the right answer</h2>
          <p className="t-body" style={{ marginTop: "1rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            Manufacturers rarely publish this list. It is short, and it is decisive when it applies.
          </p>
          <ul style={{ marginTop: "1rem", display: "grid", gap: "0.6rem", paddingLeft: "1.25rem", listStyle: "disc" }}>
            {[
              "Very large single-site campuses. At hundreds of megawatts on one parcel, one purpose-built design amortizes across the whole build, and the site already carries the crews and cranes that make field repetition work.",
              "Genuinely bespoke requirements. Multi-tenant zoning, unusual redundancy topologies, or special floor loading that a standardized envelope cannot express.",
              "An existing powered shell. If the structure and the electrical service are already in place, fit-out is normally cheaper and faster than shipping enclosures to stand beside it.",
              "Sites the road cannot reach. Weight-restricted bridges, tight approaches, low clearances, or no crane standing room — geometry beats economics.",
              "Jurisdictions without an off-site path. Where every unit is reviewed as a conventional building anyway, site-built is the lower-friction route.",
              "Programmes whose scope is still moving. If the requirement will change mid-build, buy the flexibility of field construction instead of change orders against a frozen production design.",
            ].map((t) => (
              <li key={t.slice(0, 20)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* -------- checklist -------- */}
        <section id="checklist" style={{ marginTop: "clamp(3rem, 6vh, 4.5rem)", scrollMarginTop: 96 }}>
          <h2 style={h2Style}>Eight questions that decide the method</h2>
          <p className="t-body" style={{ marginTop: "1rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            Run these in order. Any one of them can settle the decision on its own.
          </p>

          <div style={tableWrap}>
            <table style={table}>
              <caption className="sr-only">
                Decision checklist for choosing between factory-built and site-built delivery
              </caption>
              <thead>
                <tr>
                  <th style={th} scope="col">
                    #
                  </th>
                  <th style={th} scope="col">
                    Question
                  </th>
                  <th style={th} scope="col">
                    Which way it leans
                  </th>
                </tr>
              </thead>
              <tbody>
                {CHECKLIST.map((r) => (
                  <tr key={r.n}>
                    <td style={td}>
                      <span style={codePill}>{r.n}</span>
                    </td>
                    <td style={tdKey}>{r.q}</td>
                    <td style={td}>{r.leans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* -------- PODOS -------- */}
        <section id="podos" style={{ marginTop: "clamp(3rem, 6vh, 4.5rem)", scrollMarginTop: 96 }}>
          <h2 style={h2Style}>Where PODOS sits in this comparison</h2>
          <p className="t-body" style={{ marginTop: "1rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            PODOS builds on the factory side of this line, and the constraints above are the ones the
            product is designed around. Each{" "}
            <Link href="/platform/podos-pod" style={linkStyle}>
              PODOS Pod
            </Link>{" "}
            is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with power and
            liquid cooling integrated and tested before the unit leaves the plant. Because the
            integration work happens on a line rather than on a pad, PODOS{" "}
            <span data-claim="deployment-window">targets a 90-day window from order to commissioning</span>{" "}
            for a standard unit — a target that assumes the site work and utility connection proceed
            in parallel, which is exactly the overlap this page describes and exactly the assumption
            a buyer should test against their own critical path.
          </p>
          <p className="t-body" style={{ marginTop: "0.9rem", maxWidth: "72ch", color: "var(--ink-dim)" }}>
            The rest follows from that choice: the{" "}
            <Link href="/deploy" style={linkStyle}>
              deployment sequence
            </Link>{" "}
            treats integration as cargo instead of construction, the{" "}
            <Link href="/platform" style={linkStyle}>
              platform
            </Link>{" "}
            composes capacity from repeated units, and the{" "}
            <Link href="/use-cases" style={linkStyle}>
              use cases
            </Link>{" "}
            that suit it best are the ones where units land inside the envelope above. Where a
            project fails the checklist — bespoke scope, an unreachable site, a campus large enough
            to amortize its own design — site-built is the better engineering answer, and we would
            rather say so here than at a kickoff meeting. Terms used on this page are defined in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
              AI infrastructure glossary
            </Link>
            .
          </p>
        </section>

        {/* -------- FAQ -------- */}
        <section id="faq" style={{ marginTop: "clamp(3rem, 6vh, 4.5rem)", scrollMarginTop: 96 }}>
          <h2 style={h2Style}>Frequently asked questions</h2>
          <div style={{ marginTop: "1.5rem", display: "grid", gap: "1.5rem", maxWidth: "72ch" }}>
            {FAQ.map((f) => (
              <div key={f.q}>
                <h3 style={h3Style}>{f.q}</h3>
                <p className="t-body" style={{ marginTop: "0.5rem", color: "var(--ink-dim)" }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <EvidenceSourceRail sources={SOURCES} />
      </article>
    </main>
  );
}
