/**
 * /engineering/thermal-enclosure — engineering explainer.
 *
 * Server component. Keyword cluster: "thermal enclosure" / "insulated
 * modular data center enclosure" (informational/TOFU). External facts
 * cite the source register or primary standards verified 2026-08-31;
 * company claims render only from claims.ts publishable entries with
 * their required qualifiers.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";

const PATH = "/engineering/thermal-enclosure";
const TITLE = "Thermal Enclosure Design for Modular AI Data Centers";
const DESCRIPTION =
  "How modular data-center enclosures control heat: six-surface insulation, vapor and condensation control, climate exposure, ingress ratings, and service access.";

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
    name: "Ingress Protection (IP) ratings — IEC 60529",
    publisher: "International Electrotechnical Commission",
    url: "https://www.iec.ch/ip-ratings",
    date: "accessed 2026-08-31",
  },
  {
    n: 4,
    name: "FAQs: Enclosures (ANSI/NEMA 250 enclosure types)",
    publisher: "NEMA",
    url: "https://www.nema.org/docs/default-source/standards-document-library/faq-enclosures.pdf",
    date: "accessed 2026-08-31",
  },
  {
    n: 5,
    name: "ISO 668:2020 — Series 1 freight containers: classification, dimensions and ratings",
    publisher: "ISO",
    url: "https://www.iso.org/standard/76912.html",
    date: "2020",
  },
  {
    n: 6,
    name: "Climatic design conditions — Weather Data Viewer (2025 Handbook — Fundamentals, RP-1923)",
    publisher: "ASHRAE",
    url: "https://weather.ashrae.org/",
    date: "2025 ed.",
  },
  {
    n: 7,
    name: "NFPA 75 — Standard for the Fire Protection of Information Technology Equipment",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "2024 ed.",
  },
  {
    n: 8,
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 9,
    name: "Liquid in the Rack: Liquid Cooling Your Data Center (NREL presentation)",
    publisher: "LBNL / NREL (DOE)",
    url: "https://datacenters.lbl.gov/sites/default/files/Liquid_Cooling_Your_Data_Center-NREL-EE.pdf",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "What is a thermal enclosure in a data center?",
    a: "The insulated, sealed shell separating a compute unit's controlled interior from the outdoor environment. In a modular unit all six surfaces are detailed together for conduction, air leakage, vapor movement, ingress, and fire.",
  },
  {
    q: "Why does a liquid-cooled unit still need a good envelope?",
    a: "Liquid cooling puts cold surfaces inside the box. Pipes, manifolds, and heat exchangers can sit below the dew point of the air around them, so a leaky or bridged envelope supplies both failure conditions at once: moisture, and cold surfaces.",
  },{
    q: "IP rating or NEMA type for an outdoor compute enclosure?",
    a: "Both apply, and they are not interchangeable. IEC 60529 IP codes rate solids and water with two digits; ANSI/NEMA 250 types add corrosion, icing, and construction requirements. A NEMA type maps to a minimum IP equivalent, but an IP code does not establish a NEMA type.",
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

const tdName: CSSProperties = { ...td, color: "var(--ink-strong)", fontWeight: 500 };

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

/* the envelope, face by face */
const SURFACES: Array<[string, string, string, string, string]> = [
  [
    "TE-01",
    "Roof",
    "Solar irradiance, snow load, standing water.",
    "Reflective skin, insulation carried over the frame, drained slope, sleeved penetrations.",
    "Ponding at a flattened seam; fasteners bridging insulation, printing cold spots on the liner.",
  ],
  [
    "TE-02",
    "Floor / underside",
    "Conduction to ground or deck, road spray, abrasion.",
    "Insulation continuous under the deck, vapor-tight abrasion-resistant underside.",
    "Floor dropping below interior dew point; coating damage starting a corrosion path.",
  ],
  [
    "TE-03",
    "Sun-facing long wall",
    "Largest single area plus the full diurnal solar swing.",
    "Exterior insulation, thermal breaks at frame members, joints sealed as air barrier.",
    "Expansion working panel joints loose — first an air leak, then a moisture path.",
  ],
  [
    "TE-04",
    "Shaded long wall",
    "Coldest interior surface in winter; equipment sits against it.",
    "Insulation continuity identical to the sun-facing wall, so orientation changes nothing.",
    "Shortcuts on the assumed shaded side, which reverse the moment the unit is rotated.",
  ],
  [
    "TE-05",
    "Service end wall",
    "Door openings; air exchange on every use.",
    "Insulated leaf matched to the wall, compression latching on a replaceable gasket.",
    "Gasket compression set: a door that still latches but no longer seals.",
  ],
  [
    "TE-06",
    "Utility end wall",
    "Every penetration in one plane — power, coolant, fiber, drains.",
    "Sealed insulated glands sized for movement, insulation reinstated at each sleeve.",
    "Highest leakage and condensation risk per unit area; an uninsulated gland sweats first.",
  ],
];

/* specification checklist */
const CHECKLIST: Array<[string, string, string, string, number | null]> = [
  [
    "01",
    "Climate envelope",
    "Worst-case design conditions across every intended site, not an average.",
    "Cooling and heating dry bulb and extreme dew point each drive a different part of the design.",
    6,
  ],
  [
    "02",
    "Interior dew point",
    "The humidity band held inside, and its margin over the coldest coolant surface.",
    "Sets the air-tightness requirement and the minimum coolant supply temperature.",
    1,
  ],
  [
    "03",
    "Thermal bridge budget",
    "Effective assembly conductance including frame, fasteners, penetrations.",
    "A welded steel frame can dominate real conductance; bridges condense first.",
    null,
  ],[    "04",
    "Ingress and corrosion",
    "IP code for openings, NEMA type for the enclosure, plus a corrosion allowance.",
    "IP digits cover solids and water only; NEMA types add corrosion and icing.",
    4,
  ],[    "05",
    "Idle-state freeze protection",
    "Every fluid loop during shipping, commissioning, and powered-down periods.",
    "A de-energized unit stays above freezing only briefly; glycol or trace heat covers the rest.",
    9,
  ],
  [    "06",
    "Transport case",
    "Series-1 dimensions, ratings, corner fittings, plus road and sea vibration.",
    "Conformance moves the unit on existing equipment; what loosens in transit arrives as a leak.",
    5,
  ],
];

export default function ThermalEnclosurePage() {
  return (
    <>
      <SiteHeader />
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="Thermal enclosure design for a modular data center"
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
            { name: "Thermal enclosure", path: PATH },
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
          <span className="t-sweep-brand">Thermal enclosure</span> design for a modular data center
        </h1>

        <p className="t-lede mt-5 max-w-[62ch]" style={{ color: "var(--ink-dim)" }}>
          A thermal enclosure is the insulated, sealed shell separating a compute unit&apos;s controlled
              interior from the weather outside it. In a modular data center it is a designed component, not
              a shipping shell: all six surfaces — roof, floor, two long walls, two ends — are detailed as
              one envelope for conduction, air leakage, vapor movement, ingress, and fire. Here is how it
              gets specified, and where it stops helping.
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
          {/* -------- why it is a component -------- */}
          <section id="why" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Why the enclosure is a component, not a container</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              In a building the envelope is a modest share of the cooling load: a large floor plate has a
              low surface-to-volume ratio and a slow, forgiving skin. Compress the same compute into a
              transportable box and that inverts — far more skin per cubic metre, and a welded steel frame
              through every wall. Keeping heat out is then the least important of its jobs: solar and
              conduction gains are small next to the IT load inside. It earns its place four other ways:
            </p>
            <ul className="mt-4 grid gap-3 list-disc pl-5">
              {[                "Holding a controlled interior, so the same hardware behaves the same way in a desert and on a coast.",
"Controlling dew point. Liquid cooling puts cold surfaces inside the box by design, and condensation control is an envelope property before it is a controls one.",
                "Protecting fluid loops when nothing is running. Shipping and idle periods have no IT load to keep the interior warm, and one freeze event costs more than years of inefficiency.",                "Carrying the structural, ingress, fire, and acoustic boundary in one assembly, resolved in a factory rather than on a slab.",
].map((t) => (
                <li key={t.slice(0, 24)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                  {t}
                </li>
              ))}
            </ul>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Density raises the stakes on all four. Uptime Institute&apos;s 2025 survey of 800+ operators
              shows fleet rack densities climbing into the 10–30 kW band<Cite n={8} /> — and the more power
              sits behind one door, the more an envelope fault costs when it shows itself.
            </p>
          </section>

          {/* -------- six surfaces -------- */}
          <section id="six-surfaces" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>The six surfaces, face by face</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Six faces, six different loads. Specifying them as one line — &quot;insulated panel, all
              sides&quot; — is how envelopes fail: the failure starts at the face whose load was never named.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Ref</th>
                    <th style={th}>Surface</th>
                    <th style={th}>Dominant load</th>
                    <th style={th}>Design response</th>
                    <th style={th}>Failure mode</th>
                  </tr>
                </thead>
                <tbody>
                  {SURFACES.map(([ref, name, load, response, failure]) => (
                    <tr key={ref}>
                      <td style={td}>
                        <span style={codePill}>{ref}</span>
                      </td>
                      <td style={tdName}>{name}</td>
                      <td style={td}>{load}</td>
                      <td style={td}>{response}</td>
                      <td style={td}>{failure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- vapor and condensation -------- */}
          <section id="vapor" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Vapor drive and condensation control</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Condensation happens wherever a surface sits below the dew point of the air touching
              it, so two temperatures govern the envelope: the outdoor design condition and the
              interior dew point. ASHRAE&apos;s thermal guidelines define the humidity envelope IT
              equipment operates within,<Cite n={1} /> and its liquid-cooling work extends that to
              facility water temperatures.<Cite n={2} /> In a{" "}
              <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
                direct-to-chip cooled
              </Link>{" "}
              unit the strategy runs from both ends: hold the interior dew point low and stable, and
              keep coolant supply temperature above it with margin.
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Vapor drive direction is what separates a transportable enclosure from a building. A fixed
              building is detailed for its climate — vapor pushes inward in hot-humid regions and outward in
              cold ones, and the retarder goes on the matching side. A unit that may ship to either cannot
              be re-detailed per site, so the answer is an envelope that does not care: a low-permeance
              skin, a sealed liner, no cold cavity between them. Continuous exterior insulation does most of
              that work by keeping the structural steel warm — framing that crosses the insulation line
              conducts an order of magnitude better than the insulation around it, and those bridges print
              onto the liner as cold stripes in winter and wet lines in humid weather.
            </p>
          </section>

          {/* -------- climate exposure -------- */}
          <section id="climate" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Climate exposure: design to conditions, not averages</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Annual averages design nothing. ASHRAE publishes climatic design conditions per weather
              station rather than per region,<Cite n={6} /> and four of those values drive four different
              parts of the enclosure: cooling design dry bulb sizes skin gain, heating design dry bulb sizes
              freeze protection, extreme annual dew point sets the condensation case, coincident wet bulb
              governs heat rejection outside the box. Exposure is a materials question too: salt attacks coatings and dissimilar-metal joints, UV
              degrades gaskets, altitude derates fans. A fleet-deployable enclosure is specified to the worst
              case across its intended sites, and that scope is a costed decision, not an assumption.
            </p>
          </section>

          {/* -------- materials + ingress -------- */}
          <section id="materials" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Material selection and ingress protection</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Skin material trades corrosion resistance against weight, repairability, and fire behavior.
              Steel is cheap and field-repairable but lives or dies by its coating; aluminium is lighter and
              more corrosion-tolerant but needs isolation wherever it meets steel; composites avoid galvanic
              pairing and bridging but are harder to repair. Insulation has its own trade: closed-cell foams
              give more resistance per inch and act as their own vapor retarder but are combustible, while
              mineral wool is non-combustible and vapor-open — an advantage or a liability depending on
              whether the assembly has a coherent vapor plan. NFPA 75 covers fire protection of the IT
              space, and its 2024 edition moved lithium-ion storage requirements to a separate standard.
              <Cite n={7} />
            </p>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Ingress protection is written in two vocabularies. IEC 60529 assigns an IP code — first digit
              for solid objects, second for water.<Cite n={3} /> ANSI/NEMA 250 types
              cover the same ground and add corrosion, icing, and construction requirements, split
              by indoor, outdoor, and hazardous location.<Cite n={4} /> A NEMA type maps to a minimum IP equivalent; the reverse does not, because an IP code says
              nothing about corrosion or ice. Specify what the equipment and jurisdiction require, and name
              the standard you mean.
            </p>
          </section>

          {/* -------- maintainability -------- */}
          <section id="maintainability" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Maintainability: the envelope has to be opened</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              An envelope that cannot be opened safely is one that gets left open. Every serviceable part
              needs an access path that restores the boundary when the technician leaves: door swings sized
              for the largest replaceable assembly, gaskets treated as scheduled consumables, penetration
              seals reinstated by hand. Federal-lab liquid-cooling guidance makes the same point —
              procedures, isolation, and access are engineering deliverables.<Cite n={9} /> Instrumentation closes the loop: interior dew point, differential pressure, and liner
              temperatures at known bridge locations turn slow degradation into a trend instead of a puddle
              someone finds. Transport is the other half. ISO 668 fixes the dimensions, ratings, and
              corner-fitting geometry of series-1 freight containers,<Cite n={5} /> so a conforming enclosure moves
              on equipment that already exists — and every joint has to survive the journey.
            </p>
          </section>

          {/* -------- checklist -------- */}
          <section id="checklist" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Specification checklist</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              Six items decide whether an enclosure specification is real, in the order a design review asks.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Item</th>
                    <th style={th}>What to specify</th>
                    <th style={th}>Why it bites later</th>
                  </tr>
                </thead>
                <tbody>
                  {CHECKLIST.map(([n, item, spec, why, cite]) => (
                    <tr key={n}>
                      <td style={td}>
                        <span style={codePill}>{n}</span>
                      </td>
                      <td style={tdName}>{item}</td>
                      <td style={td}>{spec}</td>
                      <td style={td}>
                        {why}
                        {cite ? <Cite n={cite} /> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- limitations -------- */}
          <section id="limitations" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>When an engineered enclosure is not the right answer</h2>
            <ul className="mt-6 grid gap-3 list-disc pl-5">
              {[
                "Inside an existing conditioned hall it is duplicated cost — the useful boundary there is rack or row containment.",
                "It cannot rescue an undersized heat-rejection plant: the kilowatts made inside still have to reach ambient.",
                "Insulation has a knee. Once IT load dominates, added R-value buys little — the return comes from air-tightness, bridge-free detailing, and idle-state freeze protection.",
                "Fixed geometry constrains internal layout and the largest replaceable assembly, and severe sites — heavy salt, high altitude, arctic — need a variant, not a setting.",
                ].map((t) => (
                <li key={t.slice(0, 24)} className="t-body" style={{ color: "var(--ink-dim)" }}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* -------- PODOS application -------- */}
          <section id="podos" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>How PODOS treats the enclosure</h2>
            <p className="t-body mt-4" style={{ color: "var(--ink-dim)" }}>
              PODOS builds the envelope in the factory, alongside the systems it protects. Each{" "}
              <Link href="/platform/podos-pod" style={linkStyle}>
                PODOS Pod
              </Link>{" "}
              is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
              and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with the
              six-surface envelope, the closed-loop cooling inside it, and the{" "}
              <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
                power architecture
              </Link>{" "}
              specified as one assembly rather than three trades meeting on site. Envelope work that would
              otherwise be field-detailed and weather-dependent becomes repeatable — one reason PODOS{" "}
              <span data-claim="deployment-window">targets a 90-day window from order to commissioning</span>{" "}
              for a standard unit. The same logic runs through the{" "}
              <Link href="/platform" style={linkStyle}>
                modular platform
              </Link>{" "}
              and the{" "}
              <Link href="/deploy" style={linkStyle}>
                deployment model
              </Link>
              . For the comparison against a conventional build, see{" "}
              <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>
                modular vs traditional AI data centers
              </Link>
              ; terms are defined in the{" "}
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
      <Footer />
    </>
  );
}
