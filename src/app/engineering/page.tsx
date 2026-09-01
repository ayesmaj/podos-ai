/**
 * /engineering — cluster hub for AI data-center engineering.
 *
 * Server component. Design system: main-site light technical lock
 * (docs/seo/design-language-lock.md) — paper surfaces, blue/cyan brand,
 * Geist stack, mono micro-labels. Chapter prefix for this page: ENG.
 *
 * Claims discipline: only publishable entries from
 * src/content/data/claims.ts render, each wrapped in data-claim with its
 * required qualifier. Every external figure cites the numbered source
 * rail (docs/seo/source-register.md).
 */

import Link from "next/link";
import {
  Droplets,
  Zap,
  Gauge,
  Thermometer,
  Network,
  Activity,
  Shield,
  ArrowRight,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import SeoImage from "@/components/seo/SeoImage";

export const metadata = buildMetadata({
  title: "AI Data Center Engineering: Cooling, Power, Density | PODOS",
  description:
    "How megawatt-scale AI infrastructure is engineered: direct-to-chip liquid cooling, medium-voltage power, rack density, thermal envelope, monitoring, safety.",
  path: "/engineering",
});

const SOURCES: Source[] = [
  { n: 1, name: "Energy and AI — Executive Summary", publisher: "IEA", url: "https://www.iea.org/reports/energy-and-ai/executive-summary", date: "Apr 2025" },
  { n: 2, name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)", publisher: "Lawrence Berkeley National Laboratory", url: "https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf", date: "Dec 2024" },
  { n: 3, name: "Global Data Center Survey 2025", publisher: "Uptime Institute", url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025", date: "Jul 2025" },
  { n: 4, name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9)", publisher: "ASHRAE", url: "https://www.ashrae.org", date: "2021" },
  { n: 5, name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)", publisher: "ASHRAE TC 9.9", url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf", date: "c. 2021" },
  { n: 6, name: "Cooling Environments Project", publisher: "Open Compute Project", url: "https://www.opencompute.org/projects/cooling-environments" },
  { n: 7, name: "GB200 NVL72 product page", publisher: "NVIDIA", url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/" },
  { n: 8, name: "IEEE 3006 series — Power Systems Reliability for industrial and commercial facilities", publisher: "IEEE", url: "https://standards.ieee.org/ieee/3006.1/7391/", date: "2013–2018" },
  { n: 9, name: "NFPA 75 — Standard for the Fire Protection of Information Technology Equipment", publisher: "NFPA", url: "https://www.nfpa.org", date: "2024 ed." },
  { n: 10, name: "HPC Data Center Waste Heat Reuse (ESIF)", publisher: "NREL (DOE)", url: "https://www.nrel.gov/computational-science/waste-heat-energy-reuse" },
];

/* ---------- small server-side style helpers ---------- */

const mono = "var(--font-geist-mono), monospace";

const caption: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "0.66rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
};

const linkStyle: React.CSSProperties = {
  color: "var(--brand-deep)",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
};

function Eyebrow({ idx, label }: { idx: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 uppercase"
      style={{
        fontFamily: mono,
        fontSize: "0.78rem",
        letterSpacing: "0.16em",
        color: "var(--brand-deep)",
        background: "var(--glass-bg-strong)",
        border: "1px solid var(--edge-bright)",
        borderRadius: 999,
        padding: "0.35rem 0.85rem",
      }}
    >
      <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>{idx}</span>
      <span aria-hidden style={{ opacity: 0.4 }}>
        ·
      </span>
      {label}
    </span>
  );
}

function CodePill({ code }: { code: string }) {
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: "0.72rem",
        fontWeight: 600,
        letterSpacing: "0.18em",
        color: "var(--brand-deep)",
        background: "rgba(37, 99, 235, 0.07)",
        border: "1px solid rgba(37, 99, 235, 0.16)",
        borderRadius: 999,
        padding: "0.2rem 0.7rem",
      }}
    >
      {code}
    </span>
  );
}

function UpcomingPill() {
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: "0.66rem",
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--ink-dim)",
        border: "1px solid var(--edge)",
        borderRadius: 999,
        padding: "0.2rem 0.7rem",
      }}
    >
      Deep dive in preparation
    </span>
  );
}

function DomainHead({ code, title, icon }: { code: string; title: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {icon}
      <CodePill code={code} />
      <h2
        className="w-full sm:w-auto"
        style={{
          fontFamily: "var(--font-geist), ui-sans-serif, system-ui",
          fontWeight: 800,
          fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "var(--ink-strong)",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

const th: React.CSSProperties = {
  fontFamily: mono,
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

const td: React.CSSProperties = {
  fontSize: "0.92rem",
  lineHeight: 1.5,
  color: "var(--ink-dim)",
  padding: "0.75rem 0.9rem",
  borderBottom: "1px solid var(--edge-faint)",
  verticalAlign: "top",
};

const iconProps = { strokeWidth: 1.5, className: "shrink-0", size: 26, color: "var(--brand)" } as const;

/* ---------- page ---------- */

export default function EngineeringHub() {
  return (
    <>
      <SiteHeader />
    <main style={{ background: "var(--paper)", color: "var(--ink-strong)" }}>
      <TechArticleJsonLd
        headline="AI data-center engineering: cooling, power, density, and the envelope"
        description="How megawatt-scale AI infrastructure is engineered: direct-to-chip liquid cooling, medium-voltage power, rack density, thermal envelope, monitoring, safety."
        path="/engineering"
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />

      {/* ---- Compact hero ---- */}
      <section
        className="section-pad"
        style={{ borderBottom: "1px solid var(--edge-faint)", paddingBottom: "clamp(2.5rem, 5vh, 4rem)" }}
      >
        <div className="container-site flex flex-col gap-6" style={{ maxWidth: 960 }}>
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Engineering", path: "/engineering" },
            ]}
          />
          <Eyebrow idx="ENG-00" label="Engineering Index" />
          <h1 className="t-headline" style={{ maxWidth: "18ch" }}>
            AI data-center <span className="t-sweep-brand">engineering</span>
          </h1>
          <p className="t-lede" style={{ color: "var(--ink-dim)", maxWidth: "62ch" }}>
            AI data-center engineering is the discipline of moving electricity into GPUs and moving
            heat back out — reliably, at densities conventional facilities were never designed to
            hold. Seven domains decide whether a megawatt of compute actually serves inference:
            cooling, power, compute density, the thermal envelope, networking, monitoring, and
            safety. This index summarizes each domain, explains how the constraints change when the
            facility is a factory-built unit rather than a construction project, and links to the
            deep dives as they publish.
          </p>
          <LastVerified
            published="2026-08-31"
            lastVerified="2026-08-31"
            author="Josef Elimelech"
            reviewer="PODOS AI Engineering"
          />
          <figure className="flex flex-col gap-2" style={{ margin: 0, width: "100%" }}>
            <SeoImage id="engineering-hub-cutaway" priority />
            <figcaption style={caption}>
              Cutaway view — the internal zones the seven domains below describe
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---- Why AI breaks conventional facility engineering ---- */}
      <section className="section-pad" style={{ paddingBlock: "clamp(2.5rem, 6vh, 4.5rem)" }}>
        <div className="container-site flex flex-col gap-5" style={{ maxWidth: 960 }}>
          <h2
            style={{
              fontFamily: "var(--font-geist), ui-sans-serif, system-ui",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              letterSpacing: "-0.032em",
              lineHeight: 1.08,
            }}
          >
            Why AI compute breaks conventional facility engineering
          </h2>
          <p className="t-body" style={{ color: "var(--ink-dim)", maxWidth: "70ch" }}>
            The load is growing faster than the buildings. Data centers consumed about 1.5% of the
            world&rsquo;s electricity in 2024, and the IEA projects that figure to roughly double by
            2030, to about 945 TWh.<Cite n={1} /> In the United States, data centers drew 4.4% of
            national electricity in 2023; Lawrence Berkeley National Laboratory projects between
            6.7% and 12% by 2028.<Cite n={2} /> At the same time, the industry&rsquo;s average
            efficiency has stopped improving — Uptime Institute&rsquo;s 2025 survey finds
            industry-average PUE roughly flat for about six years, even as typical rack densities
            climb into the 10–30 kW band.<Cite n={3} />
          </p>
          <p className="t-body" style={{ color: "var(--ink-dim)", maxWidth: "70ch" }}>
            Conventional engineering answers this with bigger projects: more shell, more chillers,
            more substation. A factory-built approach answers it with a repeatable unit — solve each
            domain once, then manufacture the solution. The trade-offs between the two approaches
            are examined in{" "}
            <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>
              modular AI data center vs traditional data center
            </Link>
            ; the product architecture that results is described in the{" "}
            <Link href="/platform" style={linkStyle}>
              platform overview
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ---- Domain table ---- */}
      <section
        className="section-pad"
        style={{ background: "var(--canvas)", borderBlock: "1px solid var(--edge-faint)", paddingBlock: "clamp(2.5rem, 6vh, 4.5rem)" }}
      >
        <div className="container-site flex flex-col gap-5" style={{ maxWidth: 1080 }}>
          <h2
            style={{
              fontFamily: "var(--font-geist), ui-sans-serif, system-ui",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              letterSpacing: "-0.032em",
              lineHeight: 1.08,
            }}
          >
            Seven domains, one envelope
          </h2>
          <p className="t-body" style={{ color: "var(--ink-dim)", maxWidth: "70ch" }}>
            Each domain has its own failure mode, and the failure modes compound: a cooling shortfall
            becomes a density cap, a density cap strands power, stranded power breaks the economics.
            The table reads as a pre-mortem — what goes wrong when a domain is under-engineered.
          </p>
          <div className="overflow-x-auto panel" style={{ padding: "0.4rem 0.2rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={th} scope="col">Code</th>
                  <th style={th} scope="col">Domain</th>
                  <th style={th} scope="col">What it governs</th>
                  <th style={th} scope="col">Failure mode if under-engineered</th>
                  <th style={th} scope="col">Deep dive</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={td}><CodePill code="ENG-01" /></td>
                  <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>Cooling</td>
                  <td style={td}>Heat extraction from silicon to ambient</td>
                  <td style={td}>Thermal throttling — GPUs derate long before they fail</td>
                  <td style={td}>
                    <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
                      Direct-to-chip liquid cooling
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td style={td}><CodePill code="ENG-02" /></td>
                  <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>Power</td>
                  <td style={td}>Medium-voltage service down to rack-level distribution</td>
                  <td style={td}>Stranded capacity — a facility that cannot feed its own racks</td>
                  <td style={td}>
                    <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
                      Data-center power architecture
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td style={td}><CodePill code="ENG-03" /></td>
                  <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>Compute density</td>
                  <td style={td}>kW and accelerators per rack, per square foot</td>
                  <td style={td}>An overbuilt shell wrapped around underfilled racks</td>
                  <td style={td}><UpcomingPill /></td>
                </tr>
                <tr>
                  <td style={td}><CodePill code="ENG-04" /></td>
                  <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>Thermal envelope</td>
                  <td style={td}>The boundary between machine climate and weather</td>
                  <td style={td}>Cooling plant sized for the worst hour of the worst day</td>
                  <td style={td}><UpcomingPill /></td>
                </tr>
                <tr>
                  <td style={td}><CodePill code="ENG-05" /></td>
                  <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>Networking</td>
                  <td style={td}>The east–west fabric between accelerators</td>
                  <td style={td}>Idle GPUs waiting on the interconnect</td>
                  <td style={td}><UpcomingPill /></td>
                </tr>
                <tr>
                  <td style={td}><CodePill code="ENG-06" /></td>
                  <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>Monitoring</td>
                  <td style={td}>Telemetry, alerting, capacity forecasting</td>
                  <td style={td}>Outages diagnosed after the fact instead of prevented</td>
                  <td style={td}><UpcomingPill /></td>
                </tr>
                <tr>
                  <td style={td}><CodePill code="ENG-07" /></td>
                  <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>Safety</td>
                  <td style={td}>Fire protection, energy storage, code compliance</td>
                  <td style={td}>A unit that works but cannot be permitted</td>
                  <td style={td}><UpcomingPill /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---- ENG-01 Cooling ---- */}
      <section id="cooling" className="section-pad" style={{ scrollMarginTop: 96, paddingBlock: "clamp(2.5rem, 6vh, 4.5rem)" }}>
        <div className="container-site flex flex-col gap-5" style={{ maxWidth: 960 }}>
          <DomainHead code="ENG-01" title="Cooling: move heat with liquid, not air" icon={<Droplets {...iconProps} />} />
          <p className="t-body" style={{ color: "var(--ink-dim)", maxWidth: "70ch" }}>
            At AI densities, air stops being a workable transport medium for heat. ASHRAE TC 9.9 —
            the committee whose thermal guidelines define data-center environmental classes — has
            documented the shift toward liquid cooling in mainstream facilities as rack power rises.
            <Cite n={4} />
            <Cite n={5} /> The practical response is direct-to-chip liquid cooling: cold plates on
            the hottest silicon and a coolant loop in place of a room full of moving air, with the
            Open Compute Project now maintaining multi-vendor requirements for cold plates and
            coolant distribution units.<Cite n={6} /> The PODOS Pod&rsquo;s cooling is designed as a
            closed direct-to-chip loop, which also concentrates heat into a recoverable stream —
            NREL&rsquo;s ESIF facility, for example, heats its offices with waste heat from
            liquid-cooled supercomputers and reports an annualized PUE near 1.04.<Cite n={10} />
          </p>
          <div className="panel card-lift" style={{ padding: "1.1rem 1.3rem", maxWidth: 640 }}>
            <Link href="/engineering/direct-to-chip-liquid-cooling" className="flex items-center justify-between gap-4" style={{ textDecoration: "none", color: "inherit" }}>
              <span>
                <span style={{ fontFamily: mono, fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)", display: "block", marginBottom: "0.3rem" }}>
                  Deep dive · ENG-01
                </span>
                <span style={{ fontWeight: 600, color: "var(--ink-strong)" }}>
                  Direct-to-chip liquid cooling, explained
                </span>
              </span>
              <ArrowRight strokeWidth={1.5} size={20} color="var(--brand)" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- ENG-02 Power ---- */}
      <section id="power" className="section-pad" style={{ scrollMarginTop: 96, background: "var(--canvas)", borderBlock: "1px solid var(--edge-faint)", paddingBlock: "clamp(2.5rem, 6vh, 4.5rem)" }}>
        <div className="container-site flex flex-col gap-5" style={{ maxWidth: 960 }}>
          <DomainHead code="ENG-02" title="Power: from medium voltage to the rack" icon={<Zap {...iconProps} />} />
          <p className="t-body" style={{ color: "var(--ink-dim)", maxWidth: "70ch" }}>
            A megawatt of IT load is an industrial electrical project. The chain runs from a
            medium-voltage utility feed through transformation, switchgear, distribution, and power
            conversion down to the rack — and every stage adds losses, footprint, and failure modes.
            Reliability engineering for that chain is a discipline of its own; the IEEE 3006 series
            covers reliability analysis for critical-facility power systems.<Cite n={8} />{" "}
            Field-built electrical rooms are engineered one project at a time. A factory-built unit
            integrates the same chain into a manufactured product, so the design is validated once
            and then repeated; the PODOS Pod is designed to accept a medium-voltage utility feed and
            carry distribution inside the unit.
          </p>
          <div className="panel card-lift" style={{ padding: "1.1rem 1.3rem", maxWidth: 640 }}>
            <Link href="/engineering/data-center-power-architecture" className="flex items-center justify-between gap-4" style={{ textDecoration: "none", color: "inherit" }}>
              <span>
                <span style={{ fontFamily: mono, fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)", display: "block", marginBottom: "0.3rem" }}>
                  Deep dive · ENG-02
                </span>
                <span style={{ fontWeight: 600, color: "var(--ink-strong)" }}>
                  Data-center power architecture, explained
                </span>
              </span>
              <ArrowRight strokeWidth={1.5} size={20} color="var(--brand)" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- ENG-03 Density ---- */}
      <section id="density" className="section-pad" style={{ scrollMarginTop: 96, paddingBlock: "clamp(2.5rem, 6vh, 4.5rem)" }}>
        <div className="container-site flex flex-col gap-5" style={{ maxWidth: 960 }}>
          <DomainHead code="ENG-03" title="Compute density: the number every other domain inherits" icon={<Gauge {...iconProps} />} />
          <p className="t-body" style={{ color: "var(--ink-dim)", maxWidth: "70ch" }}>
            Density sets the requirements for cooling, power, envelope, and safety at once. Uptime
            Institute&rsquo;s 2025 survey shows typical racks moving into the 10–30 kW band,
            <Cite n={3} /> and accelerator vendors have already moved past it: NVIDIA&rsquo;s GB200
            NVL72 packages 72 GPUs and 36 CPUs into a single liquid-cooled rack that behaves as one
            NVLink domain.<Cite n={7} />{" "}
            <span data-claim="pod-gpu-capacity">
              Each PODOS Pod is designed for 128 GPUs
            </span>{" "}
            inside its unit envelope — a design figure, not a measured deployment. Signs a design
            has crossed the air-cooling threshold:
          </p>
          <ul className="flex flex-col gap-2" style={{ maxWidth: "70ch" }}>
            {[
              <>Rack loads pushing past the range ASHRAE documents as air&rsquo;s practical territory<Cite n={4} /><Cite n={5} /></>,
              <>Accelerator inlet temperatures riding the top of the allowable class limits<Cite n={4} /></>,
              <>Hot-aisle containment already deployed — and still insufficient</>,
              <>Fan energy becoming a visible share of facility overhead</>,
            ].map((item, i) => (
              <li key={i} className="t-body flex gap-3" style={{ color: "var(--ink-dim)" }}>
                <span aria-hidden style={{ fontFamily: mono, color: "var(--cyan-deep)", fontSize: "0.8rem", lineHeight: 1.9 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- ENG-04 Thermal envelope ---- */}
      <section id="thermal-envelope" className="section-pad" style={{ scrollMarginTop: 96, background: "var(--canvas)", borderBlock: "1px solid var(--edge-faint)", paddingBlock: "clamp(2.5rem, 6vh, 4.5rem)" }}>
        <div className="container-site flex flex-col gap-5" style={{ maxWidth: 960 }}>
          <DomainHead code="ENG-04" title="Thermal envelope: the boundary condition" icon={<Thermometer {...iconProps} />} />
          <p className="t-body" style={{ color: "var(--ink-dim)", maxWidth: "70ch" }}>
            The envelope decides how much of the outside climate the cooling plant has to fight.
            ASHRAE&rsquo;s environmental classes — A1–A4 for air-cooled equipment, an H1 class for
            high-density gear, and liquid-cooling classes named by facility water temperature —
            define the machine-side climate that must hold regardless of weather.<Cite n={4} /> A
            conventional building maintains that climate with mass and mechanical plant, assembled
            on-site. A manufactured enclosure treats the envelope as a product surface: insulation
            and barriers engineered once, on a production line. The PODOS enclosure is designed as a
            fully insulated envelope, so cooling capacity is spent on silicon rather than on the
            weather.
          </p>
          <UpcomingPill />
        </div>
      </section>

      {/* ---- ENG-05 Networking ---- */}
      <section id="networking" className="section-pad" style={{ scrollMarginTop: 96, paddingBlock: "clamp(2.5rem, 6vh, 4.5rem)" }}>
        <div className="container-site flex flex-col gap-5" style={{ maxWidth: 960 }}>
          <DomainHead code="ENG-05" title="Networking: the east–west fabric" icon={<Network {...iconProps} />} />
          <p className="t-body" style={{ color: "var(--ink-dim)", maxWidth: "70ch" }}>
            AI clusters live or die on east–west bandwidth — traffic between accelerators inside the
            cluster, not north–south traffic to the internet. Rack-scale designs make the point
            structurally: the GB200 NVL72 presents 72 GPUs as one NVLink domain because the
            interconnect is, in effect, the computer.<Cite n={7} /> At unit scale the open
            engineering questions are topology, cabling economics, and how a unit{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1-MW block</span> joins a
            larger fabric without re-architecting it — the questions the forthcoming networking
            explainer will take up.
          </p>
          <UpcomingPill />
        </div>
      </section>

      {/* ---- ENG-06 Monitoring ---- */}
      <section id="monitoring" className="section-pad" style={{ scrollMarginTop: 96, background: "var(--canvas)", borderBlock: "1px solid var(--edge-faint)", paddingBlock: "clamp(2.5rem, 6vh, 4.5rem)" }}>
        <div className="container-site flex flex-col gap-5" style={{ maxWidth: 960 }}>
          <DomainHead code="ENG-06" title="Monitoring: telemetry as a design input" icon={<Activity {...iconProps} />} />
          <p className="t-body" style={{ color: "var(--ink-dim)", maxWidth: "70ch" }}>
            Half of the operators surveyed by Uptime Institute in 2025 reported an impactful outage
            within the previous three years.<Cite n={3} /> Monitoring is the difference between a
            derate you catch and an outage you explain. In a factory-built unit, telemetry can be
            designed in — sensor points and alarms specified on the production line rather than
            commissioned ad hoc at each site. The open questions are which signals matter per
            subsystem, and what a fleet of standardized units makes possible that one-off facilities
            cannot: like-for-like comparison across every unit in service.
          </p>
          <UpcomingPill />
        </div>
      </section>

      {/* ---- ENG-07 Safety ---- */}
      <section id="safety" className="section-pad" style={{ scrollMarginTop: 96, paddingBlock: "clamp(2.5rem, 6vh, 4.5rem)" }}>
        <div className="container-site flex flex-col gap-5" style={{ maxWidth: 960 }}>
          <DomainHead code="ENG-07" title="Safety: fire, energy storage, and code" icon={<Shield {...iconProps} />} />
          <p className="t-body" style={{ color: "var(--ink-dim)", maxWidth: "70ch" }}>
            Data-center safety is governed by code. NFPA 75 covers fire protection for
            information-technology equipment spaces, and its 2024 edition moves stationary
            lithium-ion battery requirements out to NFPA 855 — so any unit that carries on-site
            energy storage inherits both standards.<Cite n={9} /> Factory manufacture changes the
            compliance surface: detection, suppression, and egress can be engineered into a
            repeatable product instead of re-derived per project. It does not remove the local
            permitting authority, whose review remains site-specific.
          </p>
          <UpcomingPill />
        </div>
      </section>

      {/* ---- Pod mapping ---- */}
      <section className="section-pad" style={{ background: "var(--canvas)", borderBlock: "1px solid var(--edge-faint)", paddingBlock: "clamp(2.5rem, 6vh, 4.5rem)" }}>
        <div className="container-site flex flex-col gap-5" style={{ maxWidth: 960 }}>
          <h2
            style={{
              fontFamily: "var(--font-geist), ui-sans-serif, system-ui",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              letterSpacing: "-0.032em",
              lineHeight: 1.08,
            }}
          >
            How the seven domains map to the PODOS Pod
          </h2>
          <p className="t-body" style={{ color: "var(--ink-dim)", maxWidth: "70ch" }}>
            The positions above are embodied in one product.{" "}
            <span data-claim="unit-capacity-1mw">
              Each PODOS Pod is designed as a standardized 1-MW building block
            </span>{" "}
            that integrates power, cooling, racks, and networking in a factory-built unit, with{" "}
            <span data-claim="deployment-window">
              a 90-day target window from order to commissioning
            </span>{" "}
            — a target, not a measured deployment record. The hardware is specified on the{" "}
            <Link href="/platform/podos-pod" style={linkStyle}>
              PODOS Pod product page
            </Link>
            ; the order-to-commissioning process is described in{" "}
            <Link href="/deploy" style={linkStyle}>
              deployment
            </Link>
            ; terms used across this cluster are defined in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
              AI infrastructure glossary
            </Link>
            . The software layer above the hardware is covered under{" "}
            <Link href="/platform/syntropic" style={linkStyle}>
              Syntropic
            </Link>
            , and the company&rsquo;s investor page is at{" "}
            <Link href="/invest" style={linkStyle}>
              invest
            </Link>
            .
          </p>
          <figure className="flex flex-col gap-2" style={{ margin: 0, width: "100%", maxWidth: 760 }}>
            <SeoImage id="engineering-systems-bench" sizes="(max-width: 768px) 100vw, 760px" />
            <figcaption style={caption}>
              Subsystem hardware across the cooling, power, and networking domains
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---- Limitations ---- */}
      <section className="section-pad" style={{ paddingBlock: "clamp(2.5rem, 6vh, 4.5rem)" }}>
        <div className="container-site flex flex-col gap-5" style={{ maxWidth: 960 }}>
          <h2
            style={{
              fontFamily: "var(--font-geist), ui-sans-serif, system-ui",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              letterSpacing: "-0.032em",
              lineHeight: 1.08,
            }}
          >
            Limitations of this index
          </h2>
          <ul className="flex flex-col gap-3" style={{ maxWidth: "70ch" }}>
            <li className="t-body" style={{ color: "var(--ink-dim)" }}>
              PODOS figures on this page are design targets. No measured efficiency, uptime, or
              deployment data is published here, because no figures from completed customer
              deployments exist to publish.
            </li>
            <li className="t-body" style={{ color: "var(--ink-dim)" }}>
              Two of the seven domains have full explainers today — cooling and power. The other
              five are summarized ahead of their deep dives and carry an in-preparation label; the
              summaries state the engineering questions, not settled answers.
            </li>
            <li className="t-body" style={{ color: "var(--ink-dim)" }}>
              Site-specific engineering is out of scope: utility interconnection, permitting, and
              structural loading vary by jurisdiction and often dominate real project schedules.
            </li>
            <li className="t-body" style={{ color: "var(--ink-dim)" }}>
              External figures carry their source&rsquo;s as-of year and are re-verified on the date
              shown at the top of the page; annual reports roll, and newer editions supersede the
              citations below.
            </li>
          </ul>
        </div>
      </section>

      {/* ---- Sources ---- */}
      <section className="section-pad" style={{ paddingTop: 0, paddingBottom: "clamp(3rem, 8vh, 6rem)" }}>
        <div className="container-site" style={{ maxWidth: 960 }}>
          <EvidenceSourceRail sources={SOURCES} />
        </div>
      </section>
    </main>
      <Footer />
    </>
  );
}
