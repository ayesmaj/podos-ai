/**
 * /engineering/data-center-power-architecture — indexable SEO page.
 *
 * Server component (no client JS). Design per docs/seo/design-language-lock.md:
 * light technical system, brand blue/cyan tokens, Geist stack, mono micro-labels.
 * Claims discipline per src/content/data/claims.ts (publishable:true only,
 * wrapped in data-claim) and docs/seo/source-register.md (numbered citations).
 */

import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import SeoImage from "@/components/seo/SeoImage";
import { buildMetadata } from "@/lib/seo/metadata";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";

const PATH = "/engineering/data-center-power-architecture";
const TITLE = "AI Data Center Power Architecture: Utility to Rack | PODOS";
const DESCRIPTION =
  "How power moves through an AI data center — utility interconnection, MV switchgear, transformers, UPS, and busway distribution — and where a 1 MW block fits.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Energy and AI — Executive Summary",
    publisher: "International Energy Agency (IEA)",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
    date: "Apr 2025",
  },
  {
    n: 2,
    name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf",
    date: "Dec 2024",
  },
  {
    n: 3,
    name: "Data centre electricity use surged in 2025, even with tightening bottlenecks driving a scramble for solutions",
    publisher: "International Energy Agency (IEA), news",
    url: "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions",
    date: "2025",
  },
  {
    n: 4,
    name: "Demonstrating the Data Center as a Flexible Grid Asset",
    publisher: "NREL (U.S. Department of Energy)",
    url: "https://docs.nrel.gov/docs/fy25osti/94844.pdf",
    date: "FY2025",
  },
  {
    n: 5,
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 6,
    name: "GB200 NVL72 product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    date: "spec page, ongoing",
  },
  {
    n: 7,
    name: "IEEE 3006 series — Power Systems Reliability for industrial and commercial facilities",
    publisher: "IEEE",
    url: "https://standards.ieee.org/ieee/3006.1/7391/",
    date: "2013–2018 per part",
  },
  {
    n: 8,
    name: "NFPA 855 — Standard for the Installation of Stationary Energy Storage Systems",
    publisher: "NFPA (publisher catalog)",
    url: "https://www.nfpa.org",
    date: "current edition",
  },
];

/* FAQ — visible copy and FAQJsonLd share these exact strings. */
const FAQ = [
  {
    q: "What voltage does a data center take from the utility?",
    a: "It depends on facility size and the serving utility. Smaller facilities take medium-voltage distribution service — 4.16 kV to 34.5 kV classes are common in North America — while large campuses interconnect at transmission voltages through a dedicated substation. The PODOS Pod is designed to accept medium-voltage service in a widely used North American distribution class.",
  },
  {
    q: "Why is grid interconnection the long pole for AI data centers?",
    a: "Because the interconnection study, upgrade, and energization process is controlled by the utility, not the builder. The IEA identifies grid-connection bottlenecks as a primary constraint on data-center growth, and demand keeps compounding the queue. Every other stage of the power chain can be compressed with engineering; the interconnection date largely cannot.",
  },
  {
    q: "Do AI facilities need UPS coverage for the entire load?",
    a: "It is a design choice, not a rule. Some operators protect the full IT load with double-conversion UPS; others protect only control, network, and storage planes and accept interruption risk on restartable compute. On-site battery systems fall under NFPA 855, and NREL has shown large batteries can also serve the grid, dispatching a 35 MW battery system in under five seconds in a 70 MW grid-interactive demonstration.",
  },
];

/* --- local style shorthands (tokens only, per design lock) --- */

const eyebrowPill: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  fontFamily: "var(--font-mono)",
  fontSize: "0.78rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--brand-deep)",
  background: "var(--glass-bg-strong)",
  border: "1px solid var(--edge-bright)",
  borderRadius: 999,
  padding: "0.4rem 0.9rem",
};

const h2Style: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 800,
  fontSize: "clamp(1.55rem, 2.6vw, 2.15rem)",
  letterSpacing: "-0.035em",
  lineHeight: 1.08,
  color: "var(--ink-strong)",
};

const h3Style: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "1.1rem",
  letterSpacing: "-0.02em",
  color: "var(--ink-strong)",
};

const codePill: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  color: "var(--brand-deep)",
  background: "var(--brand-trace)",
  border: "1px solid rgba(37, 99, 235, 0.16)",
  borderRadius: 999,
  padding: "0.15rem 0.6rem",
  whiteSpace: "nowrap",
};

const thStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.68rem",
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
  textAlign: "left",
  padding: "0.7rem 0.9rem",
  borderBottom: "1px solid var(--edge-bright)",
  whiteSpace: "nowrap",
};

const tdStyle: CSSProperties = {
  fontSize: "0.92rem",
  lineHeight: 1.55,
  color: "var(--ink-dim)",
  padding: "0.75rem 0.9rem",
  borderBottom: "1px solid var(--edge-soft)",
  verticalAlign: "top",
  minWidth: "9rem",
};

function P({ children }: { children: ReactNode }) {
  return (
    <p className="t-body" style={{ color: "var(--ink-dim)", maxWidth: "68ch", marginTop: "1rem" }}>
      {children}
    </p>
  );
}

function Figure({
  id,
  caption,
  priority = false,
}: {
  id: string;
  caption: string;
  priority?: boolean;
}) {
  return (
    <figure style={{ margin: "1.8rem 0 0", maxWidth: "56rem" }}>
      <SeoImage id={id} priority={priority} sizes="(max-width: 768px) 100vw, 896px" />
      <figcaption
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ink-faint)",
          marginTop: "0.7rem",
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

export default function DataCenterPowerArchitecturePage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Engineering", path: "/engineering" },
    { name: "Power Architecture", path: PATH },
  ];

  return (
    <>
      <SiteHeader />
    <main style={{ background: "var(--paper)", overflowX: "clip" }}>
      <TechArticleJsonLd
        headline="Data center power architecture for AI workloads"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* Hero — compact, blueprint-grid surface per design lock §4.1 */}
      <header
        style={{
          borderBottom: "1px solid var(--edge-faint)",
          backgroundImage:
            "linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px, 20px 20px, 100px 100px, 100px 100px",
        }}
      >
        <div
          className="container-site"
          style={{ paddingTop: "clamp(6.5rem, 14vh, 9rem)", paddingBottom: "clamp(2.5rem, 6vh, 4rem)" }}
        >
          <Breadcrumbs crumbs={crumbs} />
          <p style={{ ...eyebrowPill, marginTop: "1.6rem" }}>
            <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>ENG-02</span>
            <span aria-hidden style={{ opacity: 0.4 }}>·</span>
            POWER ARCHITECTURE
          </p>
          <h1
            className="t-headline"
            style={{ marginTop: "1.1rem", maxWidth: "22ch", textWrap: "balance" }}
          >
            Data center <span className="t-sweep-brand">power architecture</span> for AI workloads
          </h1>
          <p className="t-lede" style={{ marginTop: "1.2rem", maxWidth: "56ch", color: "var(--ink-dim)" }}>
            Power architecture is the chain of electrical equipment that moves energy from a utility
            interconnection point to the server racks: medium-voltage service, switchgear,
            transformers, low-voltage distribution, UPS and batteries, and the protection and
            monitoring layer that keeps the chain safe. This page walks that chain stage by stage.
          </p>
          <div style={{ marginTop: "1.6rem" }}>
            <LastVerified
              published="2026-08-31"
              lastVerified="2026-08-31"
              author="Josef Elimelech"
              reviewer="PODOS AI Engineering"
            />
          </div>
        </div>
      </header>

      <article className="container-site" style={{ paddingBottom: "clamp(4rem, 8vh, 6rem)" }}>
        {/* 01 — why AI changes the problem */}
        <section style={{ paddingTop: "clamp(3rem, 6vh, 4.5rem)" }}>
          <h2 style={h2Style}>Why AI density changes the electrical problem</h2>
          <P>
            The load is growing faster than the grid that feeds it. The IEA&apos;s 2025 analysis puts
            data centers at roughly 1.5 percent of global electricity consumption, on a path toward
            around 945 TWh by 2030.<Cite n={1} /> In the United States, Berkeley Lab measured data
            centers at 4.4 percent of national electricity in 2023 and projects 6.7 to 12 percent by
            2028.<Cite n={2} />
          </P>
          <P>
            Density is climbing at the same time. The Uptime Institute&apos;s 2025 operator survey
            shows typical rack densities rising into the 10–30 kW band<Cite n={5} /> — and
            accelerated racks leave that band entirely: NVIDIA&apos;s GB200 NVL72 integrates 72 GPUs
            and 36 CPUs into a single liquid-cooled rack.<Cite n={6} /> Power, not compute, has
            become the gating design discipline. The thermal half of the same problem is covered in
            our explainer on{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={{ color: "var(--brand-deep)", textDecoration: "underline" }}>
              direct-to-chip liquid cooling
            </Link>
            .
          </P>
          <Figure
            id="power-switchgear-bay"
            priority
            caption="Medium-voltage switchgear — the isolation and protection stage of the power chain"
          />
        </section>

        {/* 02 — one-line walkthrough table */}
        <section style={{ paddingTop: "clamp(3rem, 6vh, 4.5rem)" }}>
          <h2 style={h2Style}>The one-line diagram, stage by stage</h2>
          <P>
            Electrical engineers compress the whole facility into a one-line diagram: a single path
            from grid to rack with every transformation and protection device on it. The table walks
            that line in order. Voltage classes are typical North American values — exact levels are
            set by the serving utility and local code.
          </P>
          <div className="panel" style={{ marginTop: "1.4rem", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "56rem" }}>
              <caption
                style={{
                  captionSide: "top",
                  textAlign: "left",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink-faint)",
                  padding: "0.8rem 0.9rem 0.2rem",
                }}
              >
                Utility-to-rack power chain — one-line diagram order
              </caption>
              <thead>
                <tr>
                  <th style={thStyle} scope="col">Stage</th>
                  <th style={thStyle} scope="col">Equipment</th>
                  <th style={thStyle} scope="col">Typical level</th>
                  <th style={thStyle} scope="col">What it does</th>
                  <th style={thStyle} scope="col">What fails without it</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><span style={codePill}>PW-01</span></td>
                  <td style={tdStyle}>Utility interconnection at the point of common coupling</td>
                  <td style={tdStyle}>Transmission (69 kV and up) for campuses; MV distribution for smaller sites</td>
                  <td style={tdStyle}>Delivers grid energy under a studied, contracted allocation</td>
                  <td style={tdStyle}>Everything — the interconnection date sets the schedule</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={codePill}>PW-02</span></td>
                  <td style={tdStyle}>Service entrance and revenue metering</td>
                  <td style={tdStyle}>MV classes such as 4.16–34.5 kV; 13.8 kV is a common class</td>
                  <td style={tdStyle}>Marks the utility demarcation; measures billed energy and demand</td>
                  <td style={tdStyle}>No legal or commercial boundary between utility and facility</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={codePill}>PW-03</span></td>
                  <td style={tdStyle}>Medium-voltage switchgear — breakers and protective relays</td>
                  <td style={tdStyle}>Same MV class as the service</td>
                  <td style={tdStyle}>Isolates faults; sectionalizes the plant so parts can be maintained live</td>
                  <td style={tdStyle}>A single fault anywhere de-energizes the entire facility</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={codePill}>PW-04</span></td>
                  <td style={tdStyle}>Step-down transformers</td>
                  <td style={tdStyle}>MV to LV — for example 13.8 kV to 480 V three-phase</td>
                  <td style={tdStyle}>Converts distribution voltage to a level IT power equipment accepts</td>
                  <td style={tdStyle}>No usable voltage for downstream distribution</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={codePill}>PW-05</span></td>
                  <td style={tdStyle}>Low-voltage distribution — busway, switchboards, panelboards</td>
                  <td style={tdStyle}>480 V / 415 V three-phase</td>
                  <td style={tdStyle}>Carries power across the white space; busway tap-offs let rack rows move without rewiring</td>
                  <td style={tdStyle}>Stranded capacity — power exists but cannot reach new racks</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={codePill}>PW-06</span></td>
                  <td style={tdStyle}>UPS and energy storage</td>
                  <td style={tdStyle}>LV, with battery strings per NFPA 855<Cite n={8} /></td>
                  <td style={tdStyle}>Rides through sags and short outages; bridges to standby generation</td>
                  <td style={tdStyle}>Every grid disturbance becomes a compute interruption</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={codePill}>PW-07</span></td>
                  <td style={tdStyle}>PDU and rack distribution</td>
                  <td style={tdStyle}>415 / 240 V to the rack; vendor rack architectures are pushing this stage upward<Cite n={6} /></td>
                  <td style={tdStyle}>Final delivery, branch protection, and per-rack metering</td>
                  <td style={tdStyle}>No visibility into which racks draw what — capacity planning goes blind</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={codePill}>PW-08</span></td>
                  <td style={tdStyle}>Protection and monitoring layer — relay coordination, power quality meters, EPMS</td>
                  <td style={tdStyle}>Spans every level above</td>
                  <td style={tdStyle}>Trips the smallest possible zone on a fault; streams telemetry for operations<Cite n={7} /></td>
                  <td style={tdStyle}>Faults cascade upstream; small events become site-wide outages</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 03 — interconnection reality */}
        <section style={{ paddingTop: "clamp(3rem, 6vh, 4.5rem)" }}>
          <h2 style={h2Style}>Interconnection: the schedule is set at the grid, not the site</h2>
          <P>
            Of the eight stages, only the first is outside the builder&apos;s control — and it
            dominates the calendar. Interconnection requests are studied, upgraded, and energized on
            the utility&apos;s process, and the IEA reports those grid-connection bottlenecks
            tightened through 2025 even as data-center electricity use surged.<Cite n={3} /> Its
            Energy and AI analysis names grid constraints among the principal limits on how fast new
            AI capacity comes online.<Cite n={1} />
          </P>
          <P>
            Flexibility is emerging as a negotiating tool. NREL demonstrated a 70 MW
            grid-interactive data center in which a 35 MW battery system responded to grid dispatch
            in under five seconds with compute service-level agreements intact<Cite n={4} /> — a
            facility that can shed or shift load is a smaller problem for a constrained grid. The
            same logic favors right-sized blocks: a{" "}
            <span data-claim="unit-capacity-1mw">1 MW</span> request lands very differently in a
            utility study than a 100 MW campus. How PODOS approaches siting and energization is covered
            under{" "}
            <Link href="/deploy" style={{ color: "var(--brand-deep)", textDecoration: "underline" }}>
              deployment
            </Link>
            .
          </P>
          <Figure
            id="power-transformer-yard"
            caption="Interconnection cabinet and pad-mounted transformer at the site boundary — stages PW-01 to PW-04"
          />
        </section>

        {/* 04 — UPS and battery strategy */}
        <section style={{ paddingTop: "clamp(3rem, 6vh, 4.5rem)" }}>
          <h2 style={h2Style}>UPS and battery strategy</h2>
          <P>
            The UPS question for AI facilities is no longer &quot;how many minutes of runtime&quot;
            but &quot;which loads deserve protection at all.&quot; Double-conversion UPS on the full
            IT load is the conservative answer. A growing alternative is tiered protection: control
            plane, network, and storage stay on UPS, while interruptible training capacity rides on
            the grid with battery ride-through only — a checkpointed training job tolerates a
            restart; a latency-bound inference service does not.
          </P>
          <P>
            Batteries carry their own engineering envelope. Stationary storage installations fall
            under NFPA 855, which governs spacing, enclosure, and fire protection for lithium
            systems.<Cite n={8} /> Reliability analysis of the whole chain — UPS topology, bypass
            paths, maintenance concurrency — is the subject of the IEEE 3006 series.<Cite n={7} />
            And storage is becoming an asset rather than pure insurance: the NREL demonstration
            above used the batteries that protect the load to sell fast response back to the grid.
            <Cite n={4} />
          </P>
        </section>

        {/* 05 — protection and monitoring */}
        <section style={{ paddingTop: "clamp(3rem, 6vh, 4.5rem)" }}>
          <h2 style={h2Style}>Protection and monitoring</h2>
          <P>
            Protection design decides how much of the facility a single fault takes down. A
            coordination study tunes every relay and breaker so the device nearest the fault trips
            first, containing the event to one zone instead of tripping the service entrance.
            Arc-flash analysis, selective coordination, and single-point-of-failure review are the
            standard disciplines here.<Cite n={7} /> The monitoring layer — power meters at every
            level feeding an electrical power management system — turns the chain from static copper
            into an operable system: per-rack telemetry exposes stranded capacity, phase imbalance,
            and drift before they become outages. Definitions for the vocabulary on this page live
            in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={{ color: "var(--brand-deep)", textDecoration: "underline" }}>
              AI infrastructure glossary
            </Link>
            .
          </P>
        </section>

        {/* 06 — the 1 MW block */}
        <section style={{ paddingTop: "clamp(3rem, 6vh, 4.5rem)" }}>
          <h2 style={h2Style}>What a factory-integrated 1 MW block changes</h2>
          <P>
            In a conventional project, stages PW-02 through PW-08 are engineered per site: one-line
            drawn, gear procured, field-installed, then commissioned in place. The PODOS approach
            moves that work into a factory. Each PODOS Pod is{" "}
            <span data-claim="unit-capacity-1mw">
              designed as a standardized 1-MW building block
            </span>{" "}
            with transformation, distribution, protection, and monitoring integrated and tested
            before shipment — designed to accept standard medium-voltage service at the site
            boundary, so the site-specific scope narrows to the interconnection and the MV tie-in.
            Inside, each unit is <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span> on
            a closed-loop liquid-cooling plant matched to the electrical envelope.
          </P>
          <Figure
            id="power-busway-run"
            caption="Overhead busway with tap-off boxes feeding rack positions — stage PW-05 across the white space"
          />
          <P>
            Compressing stages PW-02 to PW-08 into a manufactured product is why PODOS{" "}
            <span data-claim="deployment-window">
              targets a 90-day window from order to commissioning
            </span>{" "}
            for a standard unit — a target, not a measured deployment figure. The full specification
            lives on the{" "}
            <Link href="/platform/podos-pod" style={{ color: "var(--brand-deep)", textDecoration: "underline" }}>
              PODOS Pod product page
            </Link>
            , and the trade-offs against field-built plants are examined in{" "}
            <Link
              href="/compare/modular-ai-data-center-vs-traditional-data-center"
              style={{ color: "var(--brand-deep)", textDecoration: "underline" }}
            >
              modular vs traditional data centers
            </Link>
            .
          </P>
        </section>

        {/* 07 — readiness checklist */}
        <section style={{ paddingTop: "clamp(3rem, 6vh, 4.5rem)" }}>
          <h2 style={h2Style}>Site power readiness: what to confirm before anything ships</h2>
          <P>
            Field-built or factory-built, these are the questions a power engineer asks about a
            candidate site — cheaper to answer early than during commissioning.
          </P>
          <ul style={{ marginTop: "1.2rem", display: "grid", gap: "0.7rem", maxWidth: "68ch" }}>
            {[
              ["PR-01", "Deliverable capacity confirmed in writing at the point of interconnection — not nameplate feeder capacity."],
              ["PR-02", "Service voltage class, available fault current, and the utility's protection requirements at the demarcation."],
              ["PR-03", "Interconnection study status and a realistic energization date — the schedule anchor for everything else."],
              ["PR-04", "Space and access for MV gear, transformers, and battery enclosures, with code-required clearances."],
              ["PR-05", "Who owns the relay coordination study across the utility boundary, and when it happens."],
              ["PR-06", "Battery permitting path under NFPA 855 and the local fire authority's stance on lithium storage."],
              ["PR-07", "Metering and telemetry obligations — utility settlement metering plus the facility's own EPMS reach."],
              ["PR-08", "Whether the interconnection and gear sizing admit a second block without a restudy."],
            ].map(([code, text]) => (
              <li key={code} style={{ display: "flex", gap: "0.8rem", alignItems: "baseline" }}>
                <span style={codePill}>{code}</span>
                <span className="t-body" style={{ color: "var(--ink-dim)" }}>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 08 — limitations */}
        <section style={{ paddingTop: "clamp(3rem, 6vh, 4.5rem)" }}>
          <h2 style={h2Style}>Limitations and open questions</h2>
          <P>
            This page is a descriptive walkthrough, not a design document. Voltage classes,
            interconnection procedures, and permitting differ by utility, state, and country;
            nothing here substitutes for a licensed engineer&apos;s site-specific one-line and study
            set. Rack-level distribution is a moving target — vendor rack architectures keep
            reshaping stages PW-05 through PW-07,<Cite n={6} /> and published per-rack power figures
            vary by configuration, so we cite the architecture, not a wattage.
          </P>
          <P>
            On the PODOS side: all unit figures on this page —{" "}
            <span data-claim="unit-capacity-1mw">1 MW capacity</span>,{" "}
            <span data-claim="pod-gpu-capacity">128-GPU compute</span>,{" "}
            <span data-claim="deployment-window">the 90-day window</span> — are design targets for a
            factory-built product, not measurements from
            completed deployments, and a 1 MW block still requires a utility interconnection process
            like any other load. How the electrical, thermal, and software layers fit together is on
            the{" "}
            <Link href="/platform" style={{ color: "var(--brand-deep)", textDecoration: "underline" }}>
              platform page
            </Link>
            , and the rest of the engineering series is indexed at{" "}
            <Link href="/engineering" style={{ color: "var(--brand-deep)", textDecoration: "underline" }}>
              /engineering
            </Link>
            .
          </P>
        </section>

        {/* FAQ — mirrored in FAQJsonLd above */}
        <section style={{ paddingTop: "clamp(3rem, 6vh, 4.5rem)" }}>
          <h2 style={h2Style}>Frequently asked questions</h2>
          <div style={{ marginTop: "0.4rem" }}>
            {FAQ.map((item) => (
              <div key={item.q} style={{ marginTop: "1.6rem" }}>
                <h3 style={h3Style}>{item.q}</h3>
                <P>{item.a}</P>
              </div>
            ))}
          </div>
        </section>

        <EvidenceSourceRail sources={SOURCES} />

        {/* footer nav */}
        <nav
          aria-label="Related pages"
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--edge)",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8rem",
          }}
        >
          <Link href="/engineering" className="btn-ghost">
            Engineering index
          </Link>
          <Link href="/platform/podos-pod" className="btn-ghost">
            PODOS Pod specification
          </Link>
          <Link href="/invest" className="btn-ghost">
            Investor information
          </Link>
        </nav>
      </article>
    </main>
      <Footer />
    </>
  );
}
