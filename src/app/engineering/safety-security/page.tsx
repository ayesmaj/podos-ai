/**
 * /engineering/safety-security — Archetype A, engineering deep dive.
 * See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, zero client JS. Composed from the section library
 * (src/components/seo/sections.tsx). This page carries NO imagery, so the
 * hero is HeroEditorial and every visual beat is typographic — tables,
 * a glass callout, and one ink quote band.
 *
 * Keyword cluster: "data center fire safety", "data center physical
 * security" (informational/TOFU). All external references cite the source
 * register or primary standards bodies verified 2026-08-31; company claims
 * render only from claims.ts publishable entries with their qualifiers.
 *
 * HARD RULE observed in copy: no certification, listing, or test-result
 * claim is made anywhere on this page — none is approved. Fire is never
 * described as impossible.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import {
  HeroEditorial,
  SummaryBand,
  MatrixTable,
  ProseWithRail,
  ExecutiveAnswer,
  QuoteMetric,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/engineering/safety-security";
const TITLE = "Modular Data Center Fire Safety and Physical Security";
const DESCRIPTION =
  "How modular AI data centers handle fire safety and physical security: detection, suppression options, access control, enclosure sealing, and NFPA 75/855.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

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
    name: "NEMA 250 — Enclosures for Electrical Equipment (1000 Volts Maximum) (catalog)",
    publisher: "NEMA",
    url: "https://www.nema.org",
    date: "current ed.",
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
/* table data                                                          */
/* ------------------------------------------------------------------ */

const STANDARD_ROWS: ReactNode[][] = [
  [
    <span key="c" className="pill">SS-01</span>,
    "NFPA 75",
    <>
      Fire protection of IT equipment and the areas containing it — construction, materials,
      protection, recovery.
      <Cite n={1} />
    </>,
    "The primary reference for an IT space. Its 2024 edition moved lithium-ion battery requirements out to NFPA 855.",
  ],
  [
    <span key="c" className="pill">SS-02</span>,
    "NFPA 72",
    <>
      Application, installation, performance, inspection, testing, and maintenance of fire alarm and
      signaling systems.
      <Cite n={3} />
    </>,
    "Governs detector selection and spacing — including the air-sampling detection commonly used where airflow dilutes smoke.",
  ],
  [
    <span key="c" className="pill">SS-03</span>,
    "NFPA 2001",
    <>
      Design, installation, testing, and maintenance of total-flooding and local application clean
      agent extinguishing systems.
      <Cite n={4} />
    </>,
    "Applies only if a clean agent is chosen. Enclosure volume and door leakage drive agent quantity and hold time.",
  ],
  [
    <span key="c" className="pill">SS-04</span>,
    "NFPA 70 (NEC)",
    <>
      Electrical installation requirements, including circuits serving fire protection and emergency
      functions.
      <Cite n={5} />
    </>,
    "Sets how emergency shutoff and suppression circuits are wired and how they survive the event they respond to.",
  ],
  [
    <span key="c" className="pill">SS-05</span>,
    "NFPA 855",
    <>
      Installation of stationary energy storage systems — separation, ventilation, explosion control,
      and commissioning.
      <Cite n={2} />
    </>,
    <>
      Applies to on-site battery storage, not to the IT space itself. UL 9540A test data is how a
      design is evaluated against its limits.
      <Cite n={6} />
    </>,
  ],
];

const SUPPRESSION_ROWS: ReactNode[][] = [
  [
    "Clean agent (total flooding)",
    <>
      Discharges a non-conductive agent to a design concentration held for a specified soak time, per
      NFPA 2001.
      <Cite n={4} />
    </>,
    "No water on energized equipment; fast knockdown.",
    "Needs a sealed volume and integrity verification; finite agent inventory; over-pressure venting must be designed in.",
  ],
  [
    "Pre-action sprinkler (double interlock)",
    "Piping stays dry until both a detection event and a head operate; only heads over the fire discharge.",
    "Widely accepted by AHJs; unlimited supply; no wetting from a single fault.",
    "Water reaches equipment when it operates; adds pipe, valves, and supervision inside a tight enclosure.",
  ],
  [
    "Water mist",
    "High-pressure fine droplets cool and locally displace oxygen using far less water than a sprinkler.",
    "Small water volume; effective in confined volumes.",
    "Still water in an energized space; nozzle placement is sensitive to obstruction by racks and containment.",
  ],
  [
    "Detect and de-energize",
    "Detection triggers alarm, orderly shutdown, and power removal; manual firefighting handles the remainder.",
    "Removes the ignition energy source; nothing discharged inside.",
    "Rarely sufficient alone where code requires suppression; total workload loss on every event.",
  ],
];

const CHECKLIST: [string, string, string, string, number | null][] = [
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
];

const LIMITS: ReactNode[] = [
  "Fire is never impossible. Energized equipment, batteries, and combustible materials are present; the goal of every system above is early detection, limited damage, and safe response — not the elimination of ignition.",
  "No certification is implied. PODOS publishes no listing, certification, or test-result claims for safety or security systems. Approvals are project-specific and granted by the AHJ against locally adopted codes; nothing here should be read as a claim that any approval has been obtained.",
  "The AHJ has the final word. A unit engineered against consensus standards can still require modification for a specific jurisdiction. Early engagement changes the cost of that, not the authority.",
  "Site responsibilities do not travel with the unit. Perimeter fencing, approach lighting, guard response, water supply, and fire-department access are site scope; a well-secured enclosure in an unsecured yard is a partial control.",
  <>
    Procedure is the weakest link, and it belongs to the operator. Propped doors, stale credentials,
    silenced alarms, and untested shutdown sequences defeat correctly specified hardware — and Uptime
    Institute&apos;s 2025 survey of 800+ operators still finds impactful outages widespread.
    <Cite n={11} />
  </>,
  "Suppression is not recovery. A successful discharge means the fire stopped, not that the workload survived or the hardware is undamaged.",
];

const TOC: [string, string][] = [
  ["#standards", "Standards that apply"],
  ["#detection", "Detection"],
  ["#suppression", "Suppression options"],
  ["#physical-security", "Physical security"],
  ["#sealing", "Sealing and ratings"],
  ["#checklist", "Design review checklist"],
  ["#limitations", "Honest limits"],
  ["#faq", "FAQ"],
];

export default function SafetySecurityPage() {
  return (
    <main>
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

      {/* 1 · HERO — editorial (this page ships no imagery) */}
      <HeroEditorial
        category="Engineering · Safety and security"
        title="Fire safety and physical security in"
        accent="modular data centers"
        lede="Fire safety and physical security in a modular data center are the same disciplines practiced in a conventional facility — detection, suppression, access control, monitoring — resolved inside a shipping-sized enclosure instead of a building. The enclosure wall becomes the fire boundary and the security perimeter at once, which makes both factory design decisions rather than site fit-out decisions. This page covers the standards that apply, the detection and suppression options and their tradeoffs, the access-control layers, environmental sealing, and the questions to settle before any of it is specified."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Engineering", path: "/engineering" },
              { name: "Safety and security", path: PATH },
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
          { value: "5", label: "Standards doing the work" },
          { value: "4", label: "Suppression options compared" },
          { value: "8", label: "Questions before design freeze" },
        ]}
      />

      {/* 2 · SUMMARY — canvas */}
      <SummaryBand
        title="What you need to know"
        items={[
          {
            code: "01",
            title: "No single code governs it",
            body: "The authority having jurisdiction applies locally adopted codes, which reach for NFPA 75, 72, and 70 — plus 855 the moment batteries are on the pad.",
          },
          {
            code: "02",
            title: "Detection is the hard part",
            body: "High airflow dilutes smoke before it reaches a spot detector, so serious designs layer detection methods instead of picking one.",
          },
          {
            code: "03",
            title: "Suppression has no default",
            body: "Clean agent, pre-action sprinkler, water mist, and detect-and-de-energize each buy something and cost something.",
          },
          {
            code: "04",
            title: "The wall is the perimeter",
            body: "There is no lobby and no building security desk, so door hardware, tamper sensing, and camera coverage become enclosure design decisions.",
          },
        ]}
      />

      {/* 3 · STANDARDS MATRIX — paper, wide */}
      <MatrixTable
        id="standards"
        eyebrow="Which standards actually apply"
        title="Four do most of the work, and a fifth arrives with batteries"
        lede="No single document governs a compute enclosure. The authority having jurisdiction (AHJ) applies the locally adopted building and fire codes, then reaches for the consensus standards those codes reference. Four do most of the work in an IT space; a fifth appears the moment lithium-ion storage is on the pad. They overlap deliberately — detection is specified in one, the equipment it protects in another, the wiring that powers it in a third."
        field="safety"
        head={["Ref", "Standard", "What it governs", "Why it matters in an enclosure"]}
        rows={STANDARD_ROWS}
      />

      {/* 4 · DETECTION — canvas prose with TOC rail */}
      <ProseWithRail
        id="detection"
        surface="canvas"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {TOC.map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={{ ...link, fontSize: "0.9rem", textDecoration: "none" }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <SectionHead
          code="ENG-03"
          eyebrow="Detection first"
          title="Detection comes before suppression"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The hard problem in a compute space is not extinguishing a fire — it is noticing one early
            enough that extinguishing is a small job. High airflow works against detection: moving air
            dilutes smoke before it reaches a ceiling-mounted spot detector, which is why air-sampling
            detection, drawing a continuous sample through a pipe network to a central detector, is
            common in IT rooms. NFPA 72 governs how any of these devices are selected, located, and
            tested.
            <Cite n={3} />
          </p>
          <p>
            A serious design layers detection rather than choosing one method. Air sampling catches
            overheating insulation before visible smoke; conventional spot detection provides the
            code-recognized alarm and release signal; thermal sensing on busway and terminations
            catches connection faults that never produce smoke at all; and where battery storage is
            present, off-gas detection is the earliest available indication of a cell entering thermal
            runaway — the failure mode UL 9540A exists to characterize.
            <Cite n={6} /> Each layer answers a different question, and none substitutes for the
            others.
          </p>
        </div>
      </ProseWithRail>

      {/* 5 · SUPPRESSION MATRIX — paper, wide */}
      <MatrixTable
        id="suppression"
        eyebrow="Suppression"
        title="Four options, and what each one costs you"
        lede="There is no default answer here, and any vendor who offers one has skipped the analysis. The choice is a negotiation between the adopted code, the AHJ, equipment value, recovery time, and what the enclosure geometry can physically support."
        head={["Option", "How it works", "Argues for", "Argues against"]}
        rows={SUPPRESSION_ROWS}
      />

      {/* 6 · CONSEQUENCES — canvas glass callout */}
      <ExecutiveAnswer label="Two enclosure-specific consequences" surface="canvas">
        <p>
          A gaseous agent depends on the volume staying closed long enough to hold concentration, so
          door seals, cable penetrations, and cooling-air openings become fire-protection components
          rather than weather details. And every one of these systems needs power and signal paths
          that survive the event, which is where NFPA 70&apos;s emergency-circuit requirements
          intersect the{" "}
          <Link href="/engineering/data-center-power-architecture" style={link}>
            power architecture
          </Link>
          .<Cite n={5} />
        </p>
      </ExecutiveAnswer>

      {/* 7 · PHYSICAL SECURITY — paper prose */}
      <ProseWithRail id="physical-security" surface="paper">
        <SectionHead
          eyebrow="Physical security"
          title="The enclosure is"
          accent="the perimeter"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The control objectives do not change because the building did. NIST SP 800-53&apos;s
            physical and environmental protection family names them plainly: access authorizations,
            access control, monitoring of physical access, visitor records, emergency shutoff,
            emergency power and lighting, fire protection, and water damage protection.
            <Cite n={7} /> What changes in a modular unit is that these controls have nowhere to hide.
            There is no lobby, no shared corridor, no building security desk — the wall of the unit is
            the outermost layer and often the only one.
          </p>
          <p>
            That argues for nested layers, each with its own detection and its own log. The site
            perimeter — fencing, lighting, approach cameras — is usually site scope and varies
            enormously between a fenced substation yard and an open lot. Enclosure access is the layer
            the unit owns: hardened door hardware, credentialed entry, door-position and tamper
            sensing on every opening panel, interior camera coverage. Rack and port access is the
            innermost layer, where locking cabinets and disabled unused ports keep an authorized
            visitor from becoming an unauthorized one. Logging binds them: an access event that is not
            recorded and reviewable did not happen as far as an audit is concerned.
          </p>
          <p>
            Two failure modes recur, and neither is solved by hardware — the propped door, where a
            technician blocks a latch through a long maintenance window, and credential sprawl, where
            contractor badges outlive the contract.
          </p>
        </div>
      </ProseWithRail>

      {/* 8 · INK BEAT */}
      <QuoteMetric
        quote="The goal of every system on this page is early detection, limited damage, and safe response — not the elimination of ignition."
        attribution="PODOS AI Engineering · design posture"
        field="safety"
      />

      {/* 9 · SEALING — canvas prose */}
      <ProseWithRail id="sealing" surface="canvas">
        <SectionHead
          eyebrow="Environmental sealing"
          title="What an IP or NEMA rating"
          accent="does not promise"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            An outdoor enclosure has to keep weather, dust, and airborne contaminants away from
            electronics while still rejecting heat. Two standards measure that. IEC 60529 assigns an
            IP code whose first digit rates protection against solid ingress and second digit against
            liquids.
            <Cite n={8} /> NEMA 250 defines enclosure types for indoor, outdoor, and hazardous
            locations against its own test conditions, so a NEMA type and an IP code are not
            interchangeable statements.
            <Cite n={9} /> Both are ingress tests under defined conditions. Neither is a fire rating
            or a security rating, and a rating on the enclosure says nothing about the equipment
            inside it.
          </p>
          <p>
            Sealing also has a contamination dimension operators discover late. ASHRAE&apos;s thermal
            guidelines address particulate and gaseous contamination alongside temperature and
            humidity, because corrosive gases and salt-laden air attack connectors over years rather
            than hours.
            <Cite n={10} /> Sites near coastlines, agriculture, or heavy industry need that assessed
            at siting time. Sealing interacts with cooling too: the tighter the enclosure, the more of
            the heat path has to be liquid — one argument for{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
              direct-to-chip liquid cooling
            </Link>{" "}
            in an outdoor unit. That adds a hazard air-cooled rooms never had — a pressurized coolant
            loop beside energized equipment — so leak detection, isolation valves, and an interlock
            between leak alarm and load shed belong in this same review.
          </p>
        </div>
      </ProseWithRail>

      {/* 10 · CHECKLIST MATRIX — paper, wide */}
      <MatrixTable
        id="checklist"
        eyebrow="Design review checklist"
        title="The eight questions worth resolving in order"
        lede="These are the questions worth resolving in order, before anyone specifies a detector or a lock. Most disputes late in a project trace back to one of them being answered by assumption."
        head={["#", "Question", "What settles it", "Consequence if deferred"]}
        rows={CHECKLIST.map(([n, q, s, c, cite]) => [
          <span key={n} className="pill">
            {n}
          </span>,
          q,
          <>
            {s}
            {cite ? <Cite n={cite} /> : null}
          </>,
          c,
        ])}
      />

      {/* 11 · LIMITS — mandatory */}
      <LimitsBlock
        title="Honest limitations: what a modular enclosure does not solve"
        lede="Factory integration removes variance from safety and security systems. It does not remove risk, and it does not remove obligations."
        items={LIMITS}
      />

      {/* 12 · PODOS APPLICATION — paper prose */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="In the product" title="How PODOS approaches this" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            PODOS treats safety and security as enclosure design rather than site fit-out. Each{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so the detection
            layout, access hardware, sealing details, and shutdown sequence are properties of a
            repeated product rather than decisions re-made for every site. That repetition is the
            point: one review is inherited by every unit instead of being re-litigated on each build.
          </p>
          <p>
            It is also what makes the schedule credible. PODOS{" "}
            <span data-claim="deployment-window">
              targets a 90-day window from order to commissioning
            </span>{" "}
            for a standard unit, and a schedule like that only holds if safety systems are installed
            and tested in a factory rather than discovered on a pad — the same logic behind the{" "}
            <Link href="/deploy" style={link}>
              deployment model
            </Link>{" "}
            and the wider{" "}
            <Link href="/platform" style={link}>
              modular platform
            </Link>
            . What does not travel with the unit is jurisdiction: AHJ engagement, site perimeter, and
            responder planning remain project work every time. For the broader comparison see{" "}
            <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={link}>
              modular vs traditional AI data centers
            </Link>
            , and for the vocabulary used above, the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={link}>
              AI infrastructure glossary
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 13 · FAQ */}
      <FAQBlock items={FAQ} surface="canvas" />

      {/* 14 · SOURCES */}
      <Section surface="paper" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 15 · RELATED */}
      <RelatedRail
        title="Adjacent systems"
        items={[
          {
            href: "/engineering/data-center-power-architecture",
            label: "ENGINEERING",
            title: "Power architecture that feeds the racks",
          },
          {
            href: "/engineering/direct-to-chip-liquid-cooling",
            label: "ENGINEERING",
            title: "Direct-to-chip liquid cooling, explained",
          },
          {
            href: "/compare/modular-ai-data-center-vs-traditional-data-center",
            label: "COMPARE",
            title: "Modular vs traditional AI data centers",
          },
          {
            href: "/resources/ai-infrastructure-glossary",
            label: "RESOURCE",
            title: "AI infrastructure glossary",
          },
        ]}
      />

      {/* 16 · CTA */}
      <CTABand
        title="Bring the safety review to"
        accent="your jurisdiction"
        body="Send the site, the AHJ, and the battery question. Engineering will tell you what the detection, suppression, and access design looks like there."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy", label: "See the deployment model" }}
        field="safety"
      />
    </main>
  );
}
