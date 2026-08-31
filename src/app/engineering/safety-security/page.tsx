/**
 * /engineering/safety-security — fire safety + physical security explainer.
 *
 * Server component. Keyword cluster: "data center fire safety",
 * "data center physical security" (informational/TOFU). All external
 * references cite the source register or primary standards bodies
 * verified 2026-08-31; company claims render only from claims.ts
 * publishable entries with their required qualifiers.
 *
 * HARD RULE observed in copy: no certification, listing, or test-result
 * claim is made anywhere on this page — none is approved. Fire is never
 * described as impossible.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";

const PATH = "/engineering/safety-security";
const TITLE = "Modular Data Center Fire Safety and Physical Security";
const DESCRIPTION =
  "How modular AI data centers handle fire safety and physical security: detection, suppression options, access control, enclosure sealing, and NFPA 75/855.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "NFPA 75 — Standard for the Fire Protection of Information Technology Equipment, 2024 ed. (catalog; see also the UL code-authorities explainer)",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "2024 ed.",
  },
  {
    n: 2,
    name: "NFPA 855 — Standard for the Installation of Stationary Energy Storage Systems (catalog)",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "current ed.",
  },
  {
    n: 3,
    name: "NFPA 72 — National Fire Alarm and Signaling Code",
    publisher: "NFPA",
    url: "https://www.nfpa.org/product/nfpa-72-national-fire-alarm-and-signaling-code/p0072code",
    date: "accessed 2026-08-31",
  },
  {
    n: 4,
    name: "NFPA 2001 — Standard on Clean Agent Fire Extinguishing Systems (catalog)",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "current ed.",
  },
  {
    n: 5,
    name: "NFPA 70 — National Electrical Code (catalog)",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "current ed.",
  },
  {
    n: 6,
    name: "UL 9540A Test Method for Battery Energy Storage Systems",
    publisher: "UL Solutions",
    url: "https://www.ul.com/services/ul-9540a-test-method",
    date: "accessed 2026-08-31",
  },
  {
    n: 7,
    name: "SP 800-53 Rev. 5, Security and Privacy Controls for Information Systems and Organizations (PE control family)",
    publisher: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final",
    date: "accessed 2026-08-31",
  },
  {
    n: 8,
    name: "IEC 60529 — Degrees of protection provided by enclosures (IP Code)",
    publisher: "IEC",
    url: "https://webstore.iec.ch/en/publication/2452",
    date: "accessed 2026-08-31",
  },
  {
    n: 9,
    name: "ANSI/NEMA 250-2020 — Enclosures for Electrical Equipment (1000 Volts Maximum), contents and scope",
    publisher: "NEMA",
    url: "https://www.nema.org/docs/default-source/standards-document-library/ansi_nema_250-2020-contents-and-scope76f809d7-afad-4aa1-80cd-e1d09b60f2e5.pdf",
    date: "2020",
  },
  {
    n: 10,
    name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org",
    date: "2021",
  },
  {
    n: 11,
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "Which fire code applies to a modular data center?",
    a: "There is no single code. The authority having jurisdiction applies the locally adopted building and fire codes, which typically reference NFPA 75 for IT equipment areas, NFPA 72 for detection and alarm, NFPA 70 for electrical installation, and NFPA 855 where stationary battery storage is present. A modular enclosure escapes none of these; it changes how they are satisfied and who does the work.",
  },
  {
    q: "Is a clean-agent suppression system required in a data center?",
    a: "Not universally. Clean agent systems designed to NFPA 2001 are one option among several — pre-action sprinkler, water mist, and detect-and-de-energize strategies are all used in practice. The answer depends on the occupancy classification, the value and recoverability of the equipment, the adopted code, and what the AHJ will accept.",
  },
  {
    q: "Does liquid cooling increase fire risk?",
    a: "It changes the risk profile rather than simply raising or lowering it. Water-based coolant is not a fuel, but a closed loop adds a leak hazard near energized equipment. That is why leak detection, isolation valves, and a rehearsed shutdown sequence belong in the same design review as detection and suppression.",
  },
  {
    q: "How is physical security different in a modular unit?",
    a: "The control objectives match NIST SP 800-53's physical and environmental protection family — authorized access, monitoring, visitor records, tamper evidence, emergency shutoff. What changes is the boundary: the enclosure wall is the security perimeter, so door hardware, intrusion sensing, and camera coverage become enclosure design decisions rather than building fit-out decisions.",
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

const linkStyle: CSSProperties = {
  color: "var(--brand-deep)",
  textDecoration: "underline",
};

export default function SafetySecurityPage() {
  return (
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="Fire safety and physical security in modular data centers"
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
            { name: "Safety and security", path: PATH },
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
          <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>ENG-03</span>
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
          Fire safety and physical security in <span className="t-sweep-brand">modular</span> data
          centers
        </h1>

        <p className="t-lede mt-5 max-w-[62ch]" style={{ color: "var(--ink-dim)" }}>
          Fire safety and physical security in a modular data center are the same disciplines
          practiced in a conventional facility — detection, suppression, access control, monitoring
          — resolved inside a shipping-sized enclosure instead of a building. The enclosure wall
          becomes the fire boundary and the security perimeter at once, which makes both factory
          design decisions rather than site fit-out decisions. This page covers the standards that
          apply, the detection and suppression options and their tradeoffs, the access-control
          layers, environmental sealing, and the questions to settle before any of it is specified.
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
          {/* -------- standards -------- */}
          <section id="standards" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Which standards actually apply</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              No single document governs a compute enclosure. The authority having jurisdiction
              (AHJ) applies the locally adopted building and fire codes, then reaches for the
              consensus standards those codes reference. Four do most of the work in an IT space; a
              fifth appears the moment lithium-ion storage is on the pad. They overlap deliberately —
              detection is specified in one, the equipment it protects in another, the wiring that
              powers it in a third.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Ref</th>
                    <th style={th}>Standard</th>
                    <th style={th}>What it governs</th>
                    <th style={th}>Why it matters in an enclosure</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={td}>
                      <span style={codePill}>SS-01</span>
                    </td>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>NFPA 75</td>
                    <td style={td}>
                      Fire protection of IT equipment and the areas containing it — construction,
                      materials, protection, recovery.
                      <Cite n={1} />
                    </td>
                    <td style={td}>
                      The primary reference for an IT space. Its 2024 edition moved lithium-ion
                      battery requirements out to NFPA 855.
                    </td>
                  </tr>
                  <tr>
                    <td style={td}>
                      <span style={codePill}>SS-02</span>
                    </td>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>NFPA 72</td>
                    <td style={td}>
                      Application, installation, performance, inspection, testing, and maintenance
                      of fire alarm and signaling systems.
                      <Cite n={3} />
                    </td>
                    <td style={td}>
                      Governs detector selection and spacing — including the air-sampling detection
                      commonly used where airflow dilutes smoke.
                    </td>
                  </tr>
                  <tr>
                    <td style={td}>
                      <span style={codePill}>SS-03</span>
                    </td>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>NFPA 2001</td>
                    <td style={td}>
                      Design, installation, testing, and maintenance of total-flooding and local
                      application clean agent extinguishing systems.
                      <Cite n={4} />
                    </td>
                    <td style={td}>
                      Applies only if a clean agent is chosen. Enclosure volume and door leakage
                      drive agent quantity and hold time.
                    </td>
                  </tr>
                  <tr>
                    <td style={td}>
                      <span style={codePill}>SS-04</span>
                    </td>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>NFPA 70 (NEC)</td>
                    <td style={td}>
                      Electrical installation requirements, including circuits serving fire
                      protection and emergency functions.
                      <Cite n={5} />
                    </td>
                    <td style={td}>
                      Sets how emergency shutoff and suppression circuits are wired and how they
                      survive the event they respond to.
                    </td>
                  </tr>
                  <tr>
                    <td style={td}>
                      <span style={codePill}>SS-05</span>
                    </td>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>NFPA 855</td>
                    <td style={td}>
                      Installation of stationary energy storage systems — separation, ventilation,
                      explosion control, and commissioning.
                      <Cite n={2} />
                    </td>
                    <td style={td}>
                      Applies to on-site battery storage, not to the IT space itself. UL 9540A test
                      data is how a design is evaluated against its limits.
                      <Cite n={6} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- detection -------- */}
          <section id="detection" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Detection comes before suppression</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              The hard problem in a compute space is not extinguishing a fire — it is noticing one
              early enough that extinguishing is a small job. High airflow works against detection:
              moving air dilutes smoke before it reaches a ceiling-mounted spot detector, which is
              why air-sampling detection, drawing a continuous sample through a pipe network to a
              central detector, is common in IT rooms. NFPA 72 governs how any of these devices are
              selected, located, and tested.<Cite n={3} />
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              A serious design layers detection rather than choosing one method. Air sampling catches
              overheating insulation before visible smoke; conventional spot detection provides the
              code-recognized alarm and release signal; thermal sensing on busway and terminations
              catches connection faults that never produce smoke at all; and where battery storage is
              present, off-gas detection is the earliest available indication of a cell entering
              thermal runaway — the failure mode UL 9540A exists to characterize.<Cite n={6} /> Each
              layer answers a different question, and none substitutes for the others.
            </p>
          </section>

          {/* -------- suppression options -------- */}
          <section id="suppression" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Suppression options and what each one costs you</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              There is no default answer here, and any vendor who offers one has skipped the
              analysis. The choice is a negotiation between the adopted code, the AHJ, equipment
              value, recovery time, and what the enclosure geometry can physically support.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Option</th>
                    <th style={th}>How it works</th>
                    <th style={th}>Argues for</th>
                    <th style={th}>Argues against</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>
                      Clean agent (total flooding)
                    </td>
                    <td style={td}>
                      Discharges a non-conductive agent to a design concentration held for a
                      specified soak time, per NFPA 2001.<Cite n={4} />
                    </td>
                    <td style={td}>No water on energized equipment; fast knockdown.</td>
                    <td style={td}>
                      Needs a sealed volume and integrity verification; finite agent inventory;
                      over-pressure venting must be designed in.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>
                      Pre-action sprinkler (double interlock)
                    </td>
                    <td style={td}>
                      Piping stays dry until both a detection event and a head operate; only heads
                      over the fire discharge.
                    </td>
                    <td style={td}>
                      Widely accepted by AHJs; unlimited supply; no wetting from a single fault.
                    </td>
                    <td style={td}>
                      Water reaches equipment when it operates; adds pipe, valves, and supervision
                      inside a tight enclosure.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>
                      Water mist
                    </td>
                    <td style={td}>
                      High-pressure fine droplets cool and locally displace oxygen using far less
                      water than a sprinkler.
                    </td>
                    <td style={td}>Small water volume; effective in confined volumes.</td>
                    <td style={td}>
                      Still water in an energized space; nozzle placement is sensitive to
                      obstruction by racks and containment.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>
                      Detect and de-energize
                    </td>
                    <td style={td}>
                      Detection triggers alarm, orderly shutdown, and power removal; manual
                      firefighting handles the remainder.
                    </td>
                    <td style={td}>Removes the ignition energy source; nothing discharged inside.</td>
                    <td style={td}>
                      Rarely sufficient alone where code requires suppression; total workload loss on
                      every event.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="t-body mt-5" style={{ color: "var(--ink-dim)" }}>
              Two enclosure-specific consequences follow. A gaseous agent depends on the volume
              staying closed long enough to hold concentration, so door seals, cable penetrations,
              and cooling-air openings become fire-protection components rather than weather
              details. And every one of these systems needs power and signal paths that survive the
              event, which is where NFPA 70&apos;s emergency-circuit requirements intersect the{" "}
              <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
                power architecture
              </Link>
              .<Cite n={5} />
            </p>
          </section>

          {/* -------- physical security -------- */}
          <section id="physical-security" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Physical security: the enclosure is the perimeter</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              The control objectives do not change because the building did. NIST SP 800-53&apos;s
              physical and environmental protection family names them plainly: access
              authorizations, access control, monitoring of physical access, visitor records,
              emergency shutoff, emergency power and lighting, fire protection, and water damage
              protection.<Cite n={7} /> What changes in a modular unit is that these controls have
              nowhere to hide. There is no lobby, no shared corridor, no building security desk — the
              wall of the unit is the outermost layer and often the only one.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              That argues for nested layers, each with its own detection and its own log. The site
              perimeter — fencing, lighting, approach cameras — is usually site scope and varies
              enormously between a fenced substation yard and an open lot. Enclosure access is the
              layer the unit owns: hardened door hardware, credentialed entry, door-position and
              tamper sensing on every opening panel, interior camera coverage. Rack and port access
              is the innermost layer, where locking cabinets and disabled unused ports keep an
              authorized visitor from becoming an unauthorized one. Logging binds them: an access
              event that is not recorded and reviewable did not happen as far as an audit is
              concerned.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Two failure modes recur, and neither is solved by hardware — the propped door, where a
              technician blocks a latch through a long maintenance window, and credential sprawl,
              where contractor badges outlive the contract.
            </p>
          </section>

          {/* -------- sealing -------- */}
          <section id="sealing" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Environmental sealing and what a rating does not promise</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              An outdoor enclosure has to keep weather, dust, and airborne contaminants away from
              electronics while still rejecting heat. Two standards measure that. IEC 60529 assigns
              an IP code whose first digit rates protection against solid ingress and second digit
              against liquids.<Cite n={8} /> ANSI/NEMA 250 defines enclosure types for indoor,
              outdoor, and hazardous locations, with an annex cross-referencing those types to IP
              degrees.<Cite n={9} /> Both are ingress tests under defined conditions. Neither is a
              fire rating or a security rating, and a rating on the enclosure says nothing about the
              equipment inside it.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Sealing also has a contamination dimension operators discover late. ASHRAE&apos;s
              thermal guidelines address particulate and gaseous contamination alongside temperature
              and humidity, because corrosive gases and salt-laden air attack connectors over years
              rather than hours.<Cite n={10} /> Sites near coastlines, agriculture, or heavy industry
              need that assessed at siting time. Sealing interacts with cooling too: the tighter the
              enclosure, the more of the heat path has to be liquid — one argument for{" "}
              <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
                direct-to-chip liquid cooling
              </Link>{" "}
              in an outdoor unit. That adds a hazard air-cooled rooms never had — a pressurized
              coolant loop beside energized equipment — so leak detection, isolation valves, and an
              interlock between leak alarm and load shed belong in this same review.
            </p>
          </section>

          {/* -------- decision checklist -------- */}
          <section id="checklist" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Design review checklist</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              These are the questions worth resolving in order, before anyone specifies a detector
              or a lock. Most disputes late in a project trace back to one of them being answered by
              assumption.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Question</th>
                    <th style={th}>What settles it</th>
                    <th style={th}>Consequence if deferred</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "01",
                      "Who is the AHJ, and which code editions has the jurisdiction adopted?",
                      "The local fire marshal or building official, in writing, before design freeze.",
                      "A factory-built unit arrives on site with a suppression design the jurisdiction will not accept.",
                      null,
                    ],
                    [
                      "02",
                      "Is stationary battery storage in scope on this pad?",
                      "The site power design. If yes, NFPA 855 applies with separation, ventilation, and explosion control.",
                      "Setbacks and ventilation appear late and consume site area already allocated.",
                      2,
                    ],
                    [
                      "03",
                      "Which detection layers, and where does each one alarm?",
                      "A matrix mapping every sensor to alarm, release, and shutdown actions per NFPA 72.",
                      "Detection exists but nothing acts on it, or one sensor triggers a discharge nobody wanted.",
                      3,
                    ],
                    [
                      "04",
                      "Suppression method, and does the enclosure hold agent long enough?",
                      "Enclosure-integrity assessment for gaseous agents; drainage and equipment exposure for water-based.",
                      "An agent system that vents its concentration through cable penetrations in seconds.",
                      4,
                    ],
                    [
                      "05",
                      "How does suppression interact with cooling and power?",
                      "A written sequence of operations: alarm, fan and pump shutdown, load shed, power removal, discharge.",
                      "Cooling fans keep running during discharge and blow the agent out of the space.",
                      5,
                    ],
                    [
                      "06",
                      "Who holds credentials, what is logged, and who reviews it?",
                      "A named access-authorization owner, revocation tied to contract end dates, and a stated retention period.",
                      "Contractor badges outlive the contract, and the evidence window rolls over before an incident is reviewed.",
                      7,
                    ],
                    [
                      "07",
                      "What ingress and contamination environment is the site actually in?",
                      "IP/NEMA target set from real site conditions, plus a contamination assessment.",
                      "Connector corrosion appears in year two and is diagnosed as random hardware failure.",
                      8,
                    ],
                    [
                      "08",
                      "Who responds, and have they walked the unit?",
                      "A pre-incident plan agreed with the responding fire department, including isolation points.",
                      "Responders arrive at a sealed enclosure with energized equipment and no plan for either.",
                      1,
                    ],
                  ].map(([n, q, s, c, cite]) => (
                    <tr key={n as string}>
                      <td style={td}>
                        <span style={codePill}>{n as string}</span>
                      </td>
                      <td style={{ ...td, color: "var(--ink-strong)", fontWeight: 500 }}>
                        {q as string}
                      </td>
                      <td style={td}>
                        {s as string}
                        {cite ? <Cite n={cite as number} /> : null}
                      </td>
                      <td style={td}>{c as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- limitations -------- */}
          <section id="limitations" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Honest limitations: what a modular enclosure does not solve</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Factory integration removes variance from safety and security systems. It does not
              remove risk, and it does not remove obligations.
            </p>
            <ul className="mt-4 grid gap-3 list-disc pl-5">
              {[
                "Fire is never impossible. Energized equipment, batteries, and combustible materials are present; the goal of every system above is early detection, limited damage, and safe response — not the elimination of ignition.",
                "No certification is implied. PODOS publishes no listing, certification, or test-result claims for safety or security systems. Approvals are project-specific and granted by the AHJ against locally adopted codes; nothing here should be read as a claim that any approval has been obtained.",
                "The AHJ has the final word. A unit engineered against consensus standards can still require modification for a specific jurisdiction. Early engagement changes the cost of that, not the authority.",
                "Site responsibilities do not travel with the unit. Perimeter fencing, approach lighting, guard response, water supply, and fire-department access are site scope; a well-secured enclosure in an unsecured yard is a partial control.",
                "Procedure is the weakest link, and it belongs to the operator. Propped doors, stale credentials, silenced alarms, and untested shutdown sequences defeat correctly specified hardware — and Uptime Institute's 2025 survey of 800+ operators still finds impactful outages widespread.",
                "Suppression is not recovery. A successful discharge means the fire stopped, not that the workload survived or the hardware is undamaged.",
              ].map((t) => (
                <li key={t.slice(0, 24)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                  {t}
                  {t.startsWith("Procedure") ? <Cite n={11} /> : null}
                </li>
              ))}
            </ul>
          </section>

          {/* -------- PODOS application -------- */}
          <section id="podos" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>How PODOS approaches this</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              PODOS treats safety and security as enclosure design rather than site fit-out. Each{" "}
              <Link href="/platform/podos-pod" style={linkStyle}>
                PODOS Pod
              </Link>{" "}
              is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
              and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so the detection
              layout, access hardware, sealing details, and shutdown sequence are properties of a
              repeated product rather than decisions re-made for every site. That repetition is the
              point: one review is inherited by every unit instead of being re-litigated on each
              build.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              It is also what makes the schedule credible. PODOS{" "}
              <span data-claim="deployment-window">
                targets a 90-day window from order to commissioning
              </span>{" "}
              for a standard unit, and a schedule like that only holds if safety systems are
              installed and tested in a factory rather than discovered on a pad — the same logic
              behind the{" "}
              <Link href="/deploy" style={linkStyle}>
                deployment model
              </Link>{" "}
              and the wider{" "}
              <Link href="/platform" style={linkStyle}>
                modular platform
              </Link>
              . What does not travel with the unit is jurisdiction: AHJ engagement, site perimeter,
              and responder planning remain project work every time. For the broader comparison see{" "}
              <Link
                href="/compare/modular-ai-data-center-vs-traditional-data-center"
                style={linkStyle}
              >
                modular vs traditional AI data centers
              </Link>
              , and for the vocabulary used above, the{" "}
              <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
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
