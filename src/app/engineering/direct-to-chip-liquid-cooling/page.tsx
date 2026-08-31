/**
 * /engineering/direct-to-chip-liquid-cooling — engineering explainer.
 *
 * Server component. Keyword-map cluster #4 ("direct-to-chip liquid
 * cooling", informational/TOFU). All external numbers cite the
 * source register; company claims render only from claims.ts
 * publishable entries with their required qualifiers.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";

const PATH = "/engineering/direct-to-chip-liquid-cooling";
const TITLE = "Direct-to-Chip Liquid Cooling: How Cold Plates Cool AI Racks";
const DESCRIPTION =
  "How direct-to-chip liquid cooling works: cold plates, CDUs, facility loops, coolant classes, warm-water operation, and the tradeoffs that decide a design.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org",
    date: "2021",
  },
  {
    n: 2,
    name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)",
    publisher: "ASHRAE TC 9.9",
    url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf",
    date: "c. 2021",
  },
  {
    n: 3,
    name: "Cooling Environments Project",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/projects/cooling-environments",
    date: "ongoing",
  },
  {
    n: 4,
    name: "ACS Liquid Cooling Cold Plate Requirements, Rev 1.0",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/documents/ocp-acs-liquid-cooling-cold-plate-requirements-pdf",
  },
  {
    n: 5,
    name: "OAI System Liquid Cooling Guidelines",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/documents/oai-system-liquid-cooling-guidelines-in-ocp-template-mar-3-2023-update-pdf",
    date: "Mar 2023",
  },
  {
    n: 6,
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
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
    name: "Liquid in the Rack: Liquid Cooling Your Data Center (NREL presentation)",
    publisher: "LBNL / NREL (DOE)",
    url: "https://datacenters.lbl.gov/sites/default/files/Liquid_Cooling_Your_Data_Center-NREL-EE.pdf",
  },
  {
    n: 9,
    name: "Data center efficiency (fleet trailing-12-month PUE)",
    publisher: "Google",
    url: "https://datacenters.google/efficiency/",
    date: "accessed 2026-08-31",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "Does direct-to-chip cooling remove all of a server's heat?",
    a: "No. Cold plates capture heat only from the components they touch — typically GPUs, CPUs, and sometimes memory. Heat from voltage regulators, drives, NICs, and power supplies still leaves through air, so every direct-to-chip design keeps a smaller air-cooling path sized for that remainder.",
  },
  {
    q: "Does a closed-loop liquid cooling system consume water?",
    a: "The loop itself does not — the same coolant circulates continuously. Site water consumption is decided by the heat-rejection stage: evaporative cooling towers consume water, while dry coolers reject heat to air without evaporation at the cost of higher approach temperatures.",
  },
  {
    q: "What does a CDU do?",
    a: "A coolant distribution unit pumps coolant through the technology loop, filters it, controls its temperature and flow, and exchanges heat with the facility water loop across a plate heat exchanger — keeping the fluid that touches IT equipment isolated from facility water.",
  },
  {
    q: "Can direct-to-chip cooling be retrofitted into an air-cooled facility?",
    a: "Often, yes. In-rack or in-row CDUs let operators add liquid-cooled racks without building a facility water plant, and federal-lab guidance covers retrofit piping and integration practice. The constraints are floor loading, pipe routing, and how much heat the existing rejection plant can absorb.",
  },
];

/* ------------------------------------------------------------------ */
/* small shared styles (server component — CSS-only hovers)            */
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
  minWidth: "10rem",
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

export default function DirectToChipLiquidCoolingPage() {
  return (
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="Direct-to-chip liquid cooling, explained"
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
            { name: "Engineering", path: "/engineering" },
            { name: "Direct-to-chip liquid cooling", path: PATH },
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
          <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>ENG-01</span>
          <span aria-hidden style={{ opacity: 0.4 }}>
            ·
          </span>
          ENGINEERING
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
          Direct-to-chip liquid cooling, <span className="t-sweep-brand">explained</span>
        </h1>

        <p className="t-lede mt-5 max-w-[62ch]" style={{ color: "var(--ink-dim)" }}>
          Direct-to-chip liquid cooling pumps coolant through cold plates mounted on processors, so
          heat leaves the silicon through liquid instead of room air. A coolant distribution unit
          (CDU) then transfers that heat to a facility loop for rejection or reuse. This page walks
          the loop end to end — cold plates, CDUs, coolant classes, warm-water operation — and the
          tradeoffs that decide a design.
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
      <article
        className="container-site"
        style={{ paddingBottom: "clamp(4rem, 8vh, 6rem)" }}
      >
        <div className="max-w-[76ch]">
          {/* -------- what it is -------- */}
          <section id="definition" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Why the industry is moving heat into liquid</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Air has carried data-center heat for decades because it is free and simple, but it is
              a poor coolant: low density, low heat capacity, and it needs large temperature
              differences and high fan power to move meaningful energy. ASHRAE&apos;s TC 9.9 — the
              committee that defines the thermal envelopes IT vendors design to — published a
              dedicated white paper on why liquid cooling is expanding into mainstream facilities as
              rack densities climb beyond what airflow can economically serve.<Cite n={2} /> Its
              thermal guidelines now define liquid-cooling facility water classes alongside the
              familiar A1–A4 air classes.<Cite n={1} />
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              AI hardware forces the issue. NVIDIA&apos;s GB200 NVL72 packs 72 GPUs and 36 CPUs into
              one liquid-cooled rack acting as a single NVLink domain — the vendor ships it
              liquid-cooled because an air-cooled version of that density is not on offer.
              <Cite n={7} /> Meanwhile the Uptime Institute&apos;s 2025 survey of 800+ operators
              shows fleet-wide rack densities rising into the 10–30 kW band and industry-average PUE
              essentially flat for about six years — evidence that incremental air-side tuning has
              run out of headroom.<Cite n={6} /> Google&apos;s fleet-wide trailing-twelve-month PUE
              of 1.09 (per its latest reporting) marks the practical ceiling of what world-class
              air-and-water plants achieve at scale.<Cite n={9} />
            </p>
          </section>

          {/* -------- the loop -------- */}
          <section id="loop" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>The loop, component by component</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              A direct-to-chip system is two loops joined by a heat exchanger. The technology
              cooling loop touches the IT equipment; the facility water loop carries heat away. The
              Open Compute Project&apos;s Cooling Environments group maintains vendor-neutral
              requirements for the parts — cold plates, CDUs, quick disconnects — so hardware from
              different vendors can share one loop.<Cite n={3} />
              <Cite n={4} />
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Stage</th>
                    <th style={th}>Component</th>
                    <th style={th}>Function</th>
                    <th style={th}>Primary failure/watch item</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={td}><span style={codePill}>LC-01</span></td>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>Cold plate</td>
                    <td style={td}>
                      Microchannel plate clamped to the GPU or CPU package over a thermal interface
                      material; coolant absorbs heat conducted from the die.
                    </td>
                    <td style={td}>Mounting pressure, interface-material degradation, channel fouling.</td>
                  </tr>
                  <tr>
                    <td style={td}><span style={codePill}>LC-02</span></td>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>Manifolds + quick disconnects</td>
                    <td style={td}>
                      Distribute coolant across servers in a rack; dripless quick disconnects allow a
                      server to be pulled without draining the loop.
                    </td>
                    <td style={td}>Seal wear; interoperability between vendors.<Cite n={4} /></td>
                  </tr>
                  <tr>
                    <td style={td}><span style={codePill}>LC-03</span></td>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>CDU</td>
                    <td style={td}>
                      Pumps, filtration, controls, and a plate heat exchanger isolating the
                      technology loop from facility water. Built at in-rack, in-row, or facility
                      scale.
                    </td>
                    <td style={td}>Pump redundancy; control of coolant supply temperature above dew point.</td>
                  </tr>
                  <tr>
                    <td style={td}><span style={codePill}>LC-04</span></td>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>Technology loop</td>
                    <td style={td}>
                      The treated-coolant circuit between CDU and cold plates, with monitored
                      chemistry and wetted-material compatibility.
                    </td>
                    <td style={td}>Corrosion and biological growth control.</td>
                  </tr>
                  <tr>
                    <td style={td}><span style={codePill}>LC-05</span></td>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>Facility water loop</td>
                    <td style={td}>
                      Carries rejected heat from CDUs to the heat-rejection plant; its supply
                      temperature defines the ASHRAE facility water class.<Cite n={1} />
                    </td>
                    <td style={td}>Flow balancing across many CDUs.</td>
                  </tr>
                  <tr>
                    <td style={td}><span style={codePill}>LC-06</span></td>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>Heat rejection / reuse</td>
                    <td style={td}>
                      Dry coolers, evaporative towers, chillers, or a heat-reuse exchanger feeding
                      another process.
                    </td>
                    <td style={td}>Water consumption vs approach temperature tradeoff.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- coolant classes -------- */}
          <section id="coolants" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Coolant classes in the technology loop</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Two coolant families dominate direct-to-chip designs. Single-phase water-based
              coolants — treated water or propylene-glycol mixes — stay liquid through the loop and
              win on heat capacity, cost, and mature chemistry; OCP&apos;s cold-plate requirements
              document the wetted-material and quality expectations that keep them stable.
              <Cite n={4} /> Two-phase dielectric fluids boil inside the cold plate, absorbing heat
              as latent energy; they capture very high heat flux and are non-conductive at the chip,
              but bring pressure management, higher fluid cost, and growing regulatory scrutiny of
              engineered fluorocarbons. OCP&apos;s accelerator-infrastructure guidelines cover
              liquid-cooling practice for exactly the multi-GPU systems driving these choices.
              <Cite n={5} />
            </p>
          </section>

          {/* -------- warm water + heat rejection -------- */}
          <section id="warm-water" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Warm water, free cooling, and heat rejection</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              The quiet advantage of direct-to-chip cooling is temperature. Because liquid pulls
              heat straight off the die, the loop can run far warmer than the chilled air an
              air-cooled room needs. ASHRAE&apos;s thermal guidelines name facility water classes by
              their maximum supply temperature, and the warmer classes matter economically: if the
              IT accepts warm supply water, heat can be rejected through dry coolers for most or all
              of the year — free cooling — instead of through compressor-driven chillers.
              <Cite n={1} />
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Warm return water is also what makes heat reuse practical: the higher the return
              temperature, the more useful the heat is to an adjacent process. Federal-lab practice
              guidance treats warm-water direct-to-chip loops as the enabling step for both free
              cooling and energy recovery.<Cite n={8} /> The heat-rejection choice then sets the
              site&apos;s water story — evaporative towers consume water to reach lower
              temperatures; dry coolers consume none but need warmer loops or more surface area.
            </p>
          </section>

          {/* -------- closed loop -------- */}
          <section id="closed-loop" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Closed-loop operation</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              A closed-loop system circulates a fixed charge of coolant indefinitely: nothing is
              evaporated, nothing is discharged. That makes water consumption a property of the
              heat-rejection stage alone, not of the cooling method. A closed technology loop paired
              with dry-cooler rejection consumes no water in operation — a meaningful siting
              difference in regions where water rights or cooling-tower permits gate construction.
              It also changes maintenance: coolant chemistry is managed like an industrial system —
              sampled, filtered, and corrected — rather than continuously made up from a municipal
              supply.
            </p>
          </section>

          {/* -------- decision table -------- */}
          <section id="decision" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Selecting a configuration: the decision criteria</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              These are the questions that actually decide a direct-to-chip design, in the order an
              engineering review tends to ask them.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Criterion</th>
                    <th style={th}>What to evaluate</th>
                    <th style={th}>Design consequence</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "01",
                      "Rack density trajectory",
                      "Sustained kW per rack over the hardware refresh horizon, not the day-one figure.",
                      "Densities beyond the economic reach of air push the design to liquid; survey data shows the fleet already moving into the 10–30 kW band.",
                      6,
                    ],
                    [
                      "02",
                      "Facility water class",
                      "The warmest ASHRAE facility water class the selected IT hardware accepts.",
                      "Warmer classes unlock dry-cooler free cooling and reduce or eliminate chiller plant.",
                      1,
                    ],
                    [
                      "03",
                      "Heat-rejection path",
                      "Local water availability, permits, climate, and approach temperatures.",
                      "Evaporative towers trade water for temperature; dry coolers trade temperature for zero water.",
                      null,
                    ],
                    [
                      "04",
                      "Coolant class",
                      "Single-phase water/glycol vs two-phase dielectric; serviceability vs heat-flux ceiling.",
                      "Single-phase is the mainstream default; two-phase suits extreme flux with added pressure management.",
                      5,
                    ],
                    [
                      "05",
                      "Residual air fraction",
                      "How much server heat the cold plates cannot capture (VRs, drives, PSUs, NICs).",
                      "Sizes the remaining air-cooling plant; no direct-to-chip design eliminates it.",
                      8,
                    ],
                    [
                      "06",
                      "CDU placement",
                      "In-rack, in-row, or facility-scale CDUs against floor loading and pipe routing.",
                      "In-rack/in-row suits retrofits and small footprints; facility CDUs suit new builds at scale.",
                      3,
                    ],
                    [
                      "07",
                      "Interoperability",
                      "Conformance with OCP cold-plate and quick-disconnect requirements.",
                      "Keeps the loop open to multiple server vendors across refresh cycles.",
                      4,
                    ],
                    [
                      "08",
                      "Heat-reuse ambition",
                      "Whether an adjacent heat consumer exists and what return temperature it needs.",
                      "Favors warm-water loops and placing the heat exchanger where a consumer can connect.",
                      8,
                    ],
                  ].map(([n, c, e, d, cite]) => (
                    <tr key={n as string}>
                      <td style={td}>
                        <span style={codePill}>{n as string}</span>
                      </td>
                      <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>{c as string}</td>
                      <td style={td}>{e as string}</td>
                      <td style={td}>
                        {d as string}
                        {cite ? <Cite n={cite as number} /> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- limitations -------- */}
          <section id="limitations" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Operational tradeoffs and honest limitations</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Direct-to-chip cooling is not a free upgrade, and designs that pretend otherwise fail
              in operation.
            </p>
            <ul className="mt-4 grid gap-3 list-disc pl-5">
              {[
                "It does not capture everything. Cold plates cool the components they touch; the residual heat load from regulators, drives, and power supplies still requires an air path, so the facility runs two cooling systems, not one.",
                "Coolant is now an operations discipline. Chemistry, filtration, and wetted-material compatibility must be monitored for the life of the loop; a neglected technology loop degrades quietly until it damages hardware.",
                "Leaks are low-probability, high-consequence. Dripless disconnects, leak detection, and rehearsed isolation procedures are mandatory engineering, not options.",
                "Service procedures change. Technicians disconnect fluid couplings rather than sliding servers out of airflow, and commissioning adds pressure testing and flow balancing that air-cooled rooms never needed.",
                "Standards are still maturing. OCP requirements reduce vendor lock-in but do not yet guarantee that every cold plate, coupling, and CDU interoperates across generations.",
              ].map((t) => (
                <li key={t.slice(0, 24)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* -------- PODOS application -------- */}
          <section id="podos" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>How the PODOS Pod applies direct-to-chip cooling</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              PODOS builds these choices into a factory-integrated unit rather than a field-built
              plant. Each{" "}
              <Link href="/platform/podos-pod" style={{ color: "var(--brand-deep)", textDecoration: "underline" }}>
                PODOS Pod
              </Link>{" "}
              is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>,{" "}
              <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with closed-loop
              direct-to-chip liquid cooling specified as part of the enclosure rather than added to
              a room. Because the cold plates, manifolds, CDU, and heat-rejection interfaces are
              integrated and tested in the factory, the cooling system ships as a commissioned
              subsystem — one reason PODOS{" "}
              <span data-claim="deployment-window">
                targets a 90-day window from order to commissioning
              </span>{" "}
              for a standard unit.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              The same closed-loop architecture shapes the rest of the system: the{" "}
              <Link href="/engineering/data-center-power-architecture" style={{ color: "var(--brand-deep)", textDecoration: "underline" }}>
                power architecture
              </Link>{" "}
              that feeds the racks, the{" "}
              <Link href="/deploy" style={{ color: "var(--brand-deep)", textDecoration: "underline" }}>
                deployment model
              </Link>{" "}
              that treats cooling as cargo instead of construction, and the broader{" "}
              <Link href="/platform" style={{ color: "var(--brand-deep)", textDecoration: "underline" }}>
                modular platform
              </Link>{" "}
              those units compose into. For how this compares with building a conventional facility,
              see{" "}
              <Link
                href="/compare/modular-ai-data-center-vs-traditional-data-center"
                style={{ color: "var(--brand-deep)", textDecoration: "underline" }}
              >
                modular vs traditional AI data centers
              </Link>
              ; unfamiliar terms are defined in the{" "}
              <Link href="/resources/ai-infrastructure-glossary" style={{ color: "var(--brand-deep)", textDecoration: "underline" }}>
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
