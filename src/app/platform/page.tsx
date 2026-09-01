/**
 * /platform — cluster hub: the PODOS platform (PODOS Pod hardware +
 * Syntropic software) as one system. Server component, zero client JS.
 *
 * Claims discipline: only publishable entries from
 * src/content/data/claims.ts appear, each wrapped in data-claim with its
 * required qualifier. External figures cite docs/seo/source-register.md
 * rows via the numbered EvidenceSourceRail.
 */

import type { CSSProperties } from "react";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import SeoImage from "@/components/seo/SeoImage";

export const metadata = buildMetadata({
  title: "Modular AI Data Center Platform: PODOS Pod + Syntropic",
  description:
    "How a modular AI data center platform works: the factory-built PODOS Pod, designed as a standardized 1 MW unit, plus the Syntropic software layer above it.",
  path: "/platform",
});

/* ------------------------------------------------------------------ */
/* Sources — every row verified in docs/seo/source-register.md         */
/* ------------------------------------------------------------------ */
const SOURCES: Source[] = [
  { n: 1, name: "Energy and AI — Executive Summary", publisher: "IEA", url: "https://www.iea.org/reports/energy-and-ai/executive-summary", date: "Apr 2025" },
  { n: 2, name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)", publisher: "Lawrence Berkeley National Laboratory", url: "https://eta.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report", date: "Dec 2024" },
  { n: 3, name: "Data centre electricity use surged in 2025, even with tightening bottlenecks driving a scramble for solutions", publisher: "IEA", url: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions", date: "2025" },
  { n: 4, name: "Global Data Center Survey 2025", publisher: "Uptime Institute", url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025", date: "Jul 2025" },
  { n: 5, name: "GB200 NVL72 product specifications", publisher: "NVIDIA", url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/", date: "2025" },
  { n: 6, name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)", publisher: "ASHRAE TC 9.9", url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf", date: "c. 2021" },
  { n: 7, name: "Cooling Environments Project", publisher: "Open Compute Project", url: "https://www.opencompute.org/projects/cooling-environments", date: "ongoing" },
];

/* FAQ — rendered visibly below AND mirrored 1:1 into FAQJsonLd */
const FAQ = [
  {
    q: "What is a modular AI data center?",
    a: "A modular AI data center is AI compute capacity built as standardized, factory-integrated units rather than as a one-off construction project. Power distribution, liquid cooling, racks, and networking are assembled and tested before each unit ships to site.",
  },
  {
    q: "Is a modular data center the same as a containerized data center?",
    a: "They overlap but are not the same. Containerized usually describes a form factor — ISO shipping-container enclosures. Modular describes a manufacturing model — standardized units integrated in a factory, whatever the enclosure. A modular unit can use a container envelope, but it does not have to.",
  },
  {
    q: "How fast is a PODOS Pod designed to deploy?",
    a: "PODOS targets a 90-day window from order to commissioning for a standard unit. That figure is a company target, not a measured deployment record.",
  },
  {
    q: "Does PODOS operate deployed data centers today?",
    a: "No. PODOS is at the design and pre-deployment stage. The specifications published on this site describe design targets, not operating facilities.",
  },
];

/* ------------------------------------------------------------------ */
/* Small style helpers (design-language-lock recipes, copied exactly)  */
/* ------------------------------------------------------------------ */
const mono: CSSProperties = { fontFamily: "var(--font-geist-mono), monospace" };

function Eyebrow({ idx, label }: { idx: string; label: string }) {
  return (
    <span
      style={{
        ...mono,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
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
      <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>{idx}</span>
      <span aria-hidden style={{ opacity: 0.4 }}>·</span>
      {label}
    </span>
  );
}

function CodePill({ code }: { code: string }) {
  return (
    <span
      style={{
        ...mono,
        fontSize: "0.72rem",
        fontWeight: 600,
        letterSpacing: "0.18em",
        color: "var(--brand-deep)",
        background: "rgba(37,99,235,0.07)",
        border: "1px solid rgba(37,99,235,0.16)",
        borderRadius: 999,
        padding: "0.25rem 0.7rem",
      }}
    >
      {code}
    </span>
  );
}

const h2Style: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 800,
  fontSize: "clamp(1.7rem, 3.4vw, 2.4rem)",
  letterSpacing: "-0.03em",
  lineHeight: 1.08,
  color: "var(--ink-strong)",
  textWrap: "balance",
};

const h3Style: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "1.15rem",
  letterSpacing: "-0.02em",
  color: "var(--ink-strong)",
};

const bodyStyle: CSSProperties = { color: "var(--ink-dim)", maxWidth: "68ch" };

const figureStyle: CSSProperties = { maxWidth: "920px", width: "100%" };

const figcaptionStyle: CSSProperties = {
  ...mono,
  fontSize: "0.66rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
};

const linkStyle: CSSProperties = {
  color: "var(--brand-deep)",
  textDecoration: "underline",
  textDecorationColor: "rgba(37,99,235,0.35)",
  textUnderlineOffset: 3,
};

const thStyle: CSSProperties = {
  ...mono,
  fontSize: "0.66rem",
  fontWeight: 600,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
  textAlign: "left",
  padding: "0.65rem 0.9rem",
  borderBottom: "1px solid var(--edge-bright)",
  whiteSpace: "nowrap",
};

const tdStyle: CSSProperties = {
  fontSize: "0.92rem",
  lineHeight: 1.55,
  color: "var(--ink-dim)",
  padding: "0.75rem 0.9rem",
  borderBottom: "1px solid var(--edge)",
  verticalAlign: "top",
};

export default function PlatformPage() {
  return (
    <>
      <SiteHeader />
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="The modular AI data center, delivered as one platform"
        description="How the factory-built PODOS Pod hardware unit and the Syntropic software layer are designed to work as a single AI infrastructure platform."
        path="/platform"
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* ---------------- HERO (compact) ---------------- */}
      <section
        className="container-site"
        style={{
          paddingTop: "clamp(6.5rem, 14vh, 9rem)",
          paddingBottom: "clamp(2.5rem, 6vh, 4rem)",
          borderBottom: "1px solid var(--edge-faint)",
        }}
      >
        <Breadcrumbs
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Platform", path: "/platform" },
          ]}
        />
        <div className="mt-8">
          <Eyebrow idx="01" label="Platform" />
        </div>
        <h1
          className="t-headline mt-5"
          style={{ maxWidth: "18ch", textWrap: "balance" }}
        >
          The modular AI data center, delivered as{" "}
          <span className="t-sweep-brand">one platform</span>
        </h1>
        <p className="t-lede mt-6" style={{ color: "var(--ink-dim)", maxWidth: "62ch" }}>
          A modular AI data center is AI compute capacity built as a standardized,
          factory-integrated unit — power distribution, liquid cooling, racks, and
          networking assembled and tested before the unit ships — rather than as a
          custom construction project. PODOS approaches the category as a single
          platform with two layers: the PODOS Pod, a factory-built hardware unit{" "}
          <span data-claim="unit-capacity-1mw">
            designed as a standardized 1 MW building block
          </span>
          , and Syntropic, the compression software layer designed to raise how
          efficiently that hardware serves AI workloads.
        </p>
        <figure className="mt-8" style={figureStyle}>
          <SeoImage id="platform-overview" priority sizes="(max-width: 768px) 100vw, 920px" />
          <figcaption className="mt-3" style={figcaptionStyle}>
            The two layers: the factory-built Pod, and the software layer above it
          </figcaption>
        </figure>
        <div className="mt-7">
          <LastVerified
            published="2026-08-31"
            lastVerified="2026-08-31"
            author="Josef Elimelech"
            reviewer="PODOS AI Engineering"
          />
        </div>
      </section>

      {/* ---------------- WHY THE CATEGORY EXISTS ---------------- */}
      <section className="container-site" style={{ paddingBlock: "clamp(3rem, 7vh, 5rem)" }}>
        <Eyebrow idx="02" label="Context" />
        <h2 className="mt-4" style={h2Style}>
          Why AI infrastructure is becoming a product
        </h2>
        <div className="mt-5 grid gap-4">
          <p className="t-body" style={bodyStyle}>
            Demand is outrunning the way facilities get built. The IEA projects
            data-centre electricity consumption will roughly double from about 1.5
            percent of global electricity today to around 945 TWh — about 3 percent —
            by 2030 (2025 estimate)
            <Cite n={1} />. In the United States, Lawrence Berkeley National
            Laboratory measured data centers at 4.4 percent of national electricity
            in 2023 and projects 6.7 to 12 percent by 2028
            <Cite n={2} />. The binding constraint has moved from chips to sites and
            grid connections: the IEA reported in 2025 that connection bottlenecks
            tightened even as data-centre electricity use surged
            <Cite n={3} />.
          </p>
          <p className="t-body" style={bodyStyle}>
            At the same time, the unit of compute is densifying. The Uptime
            Institute&rsquo;s 2025 operator survey shows rack densities climbing into
            the 10–30 kW band
            <Cite n={4} />, and rack-scale systems such as NVIDIA&rsquo;s GB200 NVL72
            place 72 GPUs in a single liquid-cooled rack
            <Cite n={5} />. ASHRAE&rsquo;s technical committee has documented why air
            cooling gives way to liquid at these densities
            <Cite n={6} />. Buildings designed around air handling absorb this shift
            slowly and expensively.
          </p>
          <p className="t-body" style={bodyStyle}>
            The modular response treats the facility itself as a manufactured
            product: standardize one unit, integrate and test it in a factory, and
            repeat it, instead of engineering each building as a bespoke project.
            The trade-offs against conventional construction are examined in detail
            in the{" "}
            <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>
              modular versus traditional data center comparison
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ---------------- TWO LAYERS ---------------- */}
      <section
        className="container-site"
        style={{ paddingBlock: "clamp(3rem, 7vh, 5rem)", borderTop: "1px solid var(--edge-faint)" }}
      >
        <Eyebrow idx="03" label="Architecture" />
        <h2 className="mt-4" style={h2Style}>
          Two layers, one system
        </h2>
        <p className="t-body mt-4" style={bodyStyle}>
          The platform splits into a physical layer and a software layer. Each is
          documented on its own page; the summaries below are the map.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="panel card-lift" style={{ padding: "1.6rem 1.7rem" }}>
            <div className="flex items-center gap-3">
              <CodePill code="PL-01" />
              <span style={{ ...mono, fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)" }}>
                Hardware layer
              </span>
            </div>
            <h3 className="mt-4" style={h3Style}>
              PODOS Pod — the physical layer
            </h3>
            <p className="t-body mt-3" style={{ color: "var(--ink-dim)" }}>
              The PODOS Pod is a factory-built unit{" "}
              <span data-claim="unit-capacity-1mw">
                designed as a standardized 1 MW building block
              </span>{" "}
              and{" "}
              <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>,
              with closed-loop direct-to-chip liquid cooling and medium-voltage
              power input integrated at manufacture. Because integration, testing,
              and burn-in happen in the factory rather than on site, PODOS{" "}
              <span data-claim="deployment-window">
                targets a 90-day window from order to commissioning
              </span>{" "}
              for a standard unit — a target, not a measured deployment record.
            </p>
            <p className="t-body mt-3" style={{ color: "var(--ink-dim)" }}>
              Start with the{" "}
              <Link href="/platform/podos-pod" style={linkStyle}>
                PODOS Pod unit architecture
              </Link>
              , then go deeper on the{" "}
              <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
                direct-to-chip liquid cooling loop
              </Link>{" "}
              and the{" "}
              <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
                power architecture from grid input to rack
              </Link>
              .
            </p>
          </article>

          <article className="panel card-lift" style={{ padding: "1.6rem 1.7rem" }}>
            <div className="flex items-center gap-3">
              <CodePill code="PL-02" />
              <span style={{ ...mono, fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)" }}>
                Software layer
              </span>
            </div>
            <h3 className="mt-4" style={h3Style}>
              Syntropic — the software layer
            </h3>
            <p className="t-body mt-3" style={{ color: "var(--ink-dim)" }}>
              Syntropic is compression software for AI workloads, designed to
              reduce the memory footprint of serving models so that a fixed
              hardware envelope does more useful work. The division of labor is
              deliberate: hardware determines how much compute a site can host;
              software determines how much of that compute turns into throughput.
              PODOS has not published performance benchmarks for Syntropic —
              its capabilities are described as design intent.
            </p>
            <p className="t-body mt-3" style={{ color: "var(--ink-dim)" }}>
              The{" "}
              <Link href="/platform/syntropic" style={linkStyle}>
                Syntropic software layer page
              </Link>{" "}
              covers the design approach and its current status.
            </p>
          </article>
        </div>

        <p className="t-body mt-6" style={bodyStyle}>
          The reason one company builds both layers is the interface between them.
          Serving efficiency is usually lost where facility design and software
          stacks meet — cooling designed without knowledge of the workload, software
          tuned without knowledge of the power and thermal envelope. Industry
          standardization of liquid-cooling interfaces through the Open Compute
          Project makes factory integration practical with multi-vendor parts
          <Cite n={7} />; designing both sides of the remaining interface together
          is the platform argument.
        </p>
      </section>

      {/* ---------------- PLATFORM MAP TABLE ---------------- */}
      <section
        className="container-site"
        style={{ paddingBlock: "clamp(3rem, 7vh, 5rem)", borderTop: "1px solid var(--edge-faint)" }}
      >
        <Eyebrow idx="04" label="Platform map" />
        <h2 className="mt-4" style={h2Style}>
          The platform, mapped
        </h2>
        <p className="t-body mt-4" style={bodyStyle}>
          Every subsystem below carries an honest design status. Nothing on this
          page describes an operating facility.
        </p>
        <div className="mt-6 overflow-x-auto" style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)" }}>
          <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Subsystem</th>
                <th style={thStyle}>What it does</th>
                <th style={thStyle}>Design status</th>
                <th style={thStyle}>Documentation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...tdStyle, ...mono, fontSize: "0.8rem", color: "var(--brand-deep)" }}>COMPUTE</td>
                <td style={tdStyle}>
                  Hosts the GPU racks; each unit is{" "}
                  <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>.
                </td>
                <td style={tdStyle}>Design target</td>
                <td style={tdStyle}>
                  <Link href="/platform/podos-pod" style={linkStyle}>PODOS Pod architecture</Link>
                </td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, ...mono, fontSize: "0.8rem", color: "var(--brand-deep)" }}>COOLING</td>
                <td style={tdStyle}>
                  Closed-loop direct-to-chip liquid cooling; no evaporative water
                  consumption by design.
                </td>
                <td style={tdStyle}>Designed, pre-deployment</td>
                <td style={tdStyle}>
                  <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>Direct-to-chip cooling</Link>
                </td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, ...mono, fontSize: "0.8rem", color: "var(--brand-deep)" }}>POWER</td>
                <td style={tdStyle}>
                  Medium-voltage input with factory-integrated distribution to the
                  racks.
                </td>
                <td style={tdStyle}>Designed, pre-deployment</td>
                <td style={tdStyle}>
                  <Link href="/engineering/data-center-power-architecture" style={linkStyle}>Power architecture</Link>
                </td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, ...mono, fontSize: "0.8rem", color: "var(--brand-deep)" }}>DEPLOY</td>
                <td style={tdStyle}>
                  Factory integration, testing, and burn-in;{" "}
                  <span data-claim="deployment-window">
                    a targeted 90-day window from order to commissioning
                  </span>
                  .
                </td>
                <td style={tdStyle}>Company target</td>
                <td style={tdStyle}>
                  <Link href="/deploy" style={linkStyle}>Deployment process</Link>
                </td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, ...mono, fontSize: "0.8rem", color: "var(--brand-deep)" }}>SOFTWARE</td>
                <td style={tdStyle}>
                  Compression layer designed to raise serving efficiency on the
                  installed hardware.
                </td>
                <td style={tdStyle}>Design intent; no published benchmarks</td>
                <td style={tdStyle}>
                  <Link href="/platform/syntropic" style={linkStyle}>Syntropic</Link>
                </td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, ...mono, fontSize: "0.8rem", color: "var(--brand-deep)", borderBottom: "none" }}>SCALE</td>
                <td style={{ ...tdStyle, borderBottom: "none" }}>
                  Capacity added in repeatable increments — each unit{" "}
                  <span data-claim="unit-capacity-1mw">
                    designed as a standardized 1 MW building block
                  </span>
                  .
                </td>
                <td style={{ ...tdStyle, borderBottom: "none" }}>Design model</td>
                <td style={{ ...tdStyle, borderBottom: "none" }}>
                  <Link href="/use-cases" style={linkStyle}>Use cases</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <figure className="mt-8" style={figureStyle}>
          <SeoImage id="platform-integration" sizes="(max-width: 768px) 100vw, 920px" />
          <figcaption className="mt-3" style={figcaptionStyle}>
            Site interfaces on a unit pad: power feed, fiber route, cooling connection
          </figcaption>
        </figure>
      </section>

      {/* ---------------- LIMITATIONS ---------------- */}
      <section
        className="container-site"
        style={{ paddingBlock: "clamp(3rem, 7vh, 5rem)", borderTop: "1px solid var(--edge-faint)" }}
      >
        <Eyebrow idx="05" label="Limits" />
        <h2 className="mt-4" style={h2Style}>
          Limitations, stated plainly
        </h2>
        <ul className="mt-6 grid gap-4" style={{ maxWidth: "72ch" }}>
          <li className="t-body" style={{ color: "var(--ink-dim)", paddingLeft: "1.1rem", borderLeft: "2px solid var(--mist)" }}>
            <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Pre-deployment status.</strong>{" "}
            There are no completed customer deployments, no measured uptime, and no
            operating history to cite. Every company figure on this site is a design
            target or estimate, labeled at the point of use.
          </li>
          <li className="t-body" style={{ color: "var(--ink-dim)", paddingLeft: "1.1rem", borderLeft: "2px solid var(--mist)" }}>
            <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Power still gates everything.</strong>{" "}
            A modular unit changes how fast available power becomes usable compute.
            It does not create grid capacity or remove interconnection requirements
            where no power exists.
          </li>
          <li className="t-body" style={{ color: "var(--ink-dim)", paddingLeft: "1.1rem", borderLeft: "2px solid var(--mist)" }}>
            <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Liquid cooling changes operations.</strong>{" "}
            Direct-to-chip loops require coolant-quality management and service
            procedures most IT teams have not run before. The{" "}
            <Link href="/engineering" style={linkStyle}>engineering documentation</Link>{" "}
            describes what changes.
          </li>
          <li className="t-body" style={{ color: "var(--ink-dim)", paddingLeft: "1.1rem", borderLeft: "2px solid var(--mist)" }}>
            <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Software claims are unbenchmarked publicly.</strong>{" "}
            Syntropic has no published methodology, hardware configuration, or
            results. Until it does, treat its capabilities as design intent.
          </li>
          <li className="t-body" style={{ color: "var(--ink-dim)", paddingLeft: "1.1rem", borderLeft: "2px solid var(--mist)" }}>
            <strong style={{ color: "var(--ink-strong)", fontWeight: 600 }}>Standardization trades customization.</strong>{" "}
            A unit{" "}
            <span data-claim="unit-capacity-1mw">
              designed as a standardized 1 MW building block
            </span>{" "}
            will not fit every site or workload shape. The{" "}
            <Link href="/use-cases" style={linkStyle}>use-case pages</Link>{" "}
            describe where it is designed to fit and where it is not.
          </li>
        </ul>
      </section>

      {/* ---------------- HUB ROUTER ---------------- */}
      <section
        className="container-site"
        style={{ paddingBlock: "clamp(3rem, 7vh, 5rem)", borderTop: "1px solid var(--edge-faint)" }}
      >
        <Eyebrow idx="06" label="Index" />
        <h2 className="mt-4" style={h2Style}>
          Where to go next
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p style={{ ...mono, fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)" }}>
              The product
            </p>
            <ul className="mt-3 grid gap-2">
              <li className="t-body">
                <Link href="/platform/podos-pod" style={linkStyle}>PODOS Pod unit architecture</Link>
              </li>
              <li className="t-body">
                <Link href="/platform/syntropic" style={linkStyle}>Syntropic software layer</Link>
              </li>
              <li className="t-body">
                <Link href="/deploy" style={linkStyle}>How factory-built deployment works</Link>
              </li>
            </ul>
          </div>
          <div>
            <p style={{ ...mono, fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)" }}>
              The engineering
            </p>
            <ul className="mt-3 grid gap-2">
              <li className="t-body">
                <Link href="/engineering" style={linkStyle}>Engineering overview</Link>
              </li>
              <li className="t-body">
                <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>Direct-to-chip liquid cooling, explained</Link>
              </li>
              <li className="t-body">
                <Link href="/engineering/data-center-power-architecture" style={linkStyle}>Data center power architecture</Link>
              </li>
            </ul>
          </div>
          <div>
            <p style={{ ...mono, fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)" }}>
              The decision
            </p>
            <ul className="mt-3 grid gap-2">
              <li className="t-body">
                <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>Modular vs traditional data center</Link>
              </li>
              <li className="t-body">
                <Link href="/use-cases" style={linkStyle}>Who modular AI infrastructure is designed for</Link>
              </li>
              <li className="t-body">
                <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>AI infrastructure glossary</Link>
              </li>
              <li className="t-body">
                <Link href="/invest" style={linkStyle}>Investor information</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section
        className="container-site"
        style={{ paddingBlock: "clamp(3rem, 7vh, 5rem)", borderTop: "1px solid var(--edge-faint)" }}
      >
        <Eyebrow idx="07" label="FAQ" />
        <h2 className="mt-4" style={h2Style}>
          Frequently asked questions
        </h2>
        <div className="mt-6 grid gap-6" style={{ maxWidth: "72ch" }}>
          {FAQ.map((item) => (
            <div key={item.q}>
              <h3 style={h3Style}>{item.q}</h3>
              {item.q === "How fast is a PODOS Pod designed to deploy?" ? (
                <p className="t-body mt-2" style={{ color: "var(--ink-dim)" }}>
                  <span data-claim="deployment-window">{item.a}</span>
                </p>
              ) : (
                <p className="t-body mt-2" style={{ color: "var(--ink-dim)" }}>
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <EvidenceSourceRail sources={SOURCES} />
      </section>
    </main>
      <Footer />
    </>
  );
}
