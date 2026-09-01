/**
 * /engineering/direct-to-chip-liquid-cooling — Archetype A, engineering
 * deep dive. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, zero client JS. Composed entirely from the section
 * library (src/components/seo/sections.tsx) — 9 sections, 7 distinct
 * types, 4 surface changes. All external numbers cite the source
 * register; company claims render only from claims.ts publishable
 * entries with their required qualifiers, carried through as data-claim.
 */

import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import {
  HeroSplit,
  SummaryBand,
  DiagramWide,
  StickyExplainer,
  SplitFeature,
  MatrixTable,
  QuoteMetric,
  LimitsBlock,
  ProseWithRail,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/engineering/direct-to-chip-liquid-cooling";
const TITLE = "Direct-to-Chip Liquid Cooling: How Cold Plates Cool AI Racks";
const DESCRIPTION =
  "How direct-to-chip liquid cooling works: cold plates, CDUs, facility loops, coolant classes, warm-water operation, and the tradeoffs that decide a design.";

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

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

const LOOP_ROWS: (string | React.ReactNode)[][] = [
  [
    <span key="c" className="pill">LC-01</span>,
    "Cold plate",
    "Microchannel plate clamped to the GPU or CPU package over a thermal interface material; coolant absorbs heat conducted from the die.",
    "Mounting pressure, interface-material degradation, channel fouling.",
  ],
  [
    <span key="c" className="pill">LC-02</span>,
    "Manifolds + quick disconnects",
    "Distribute coolant across servers in a rack; dripless quick disconnects allow a server to be pulled without draining the loop.",
    <>Seal wear; interoperability between vendors.<Cite n={4} /></>,
  ],
  [
    <span key="c" className="pill">LC-03</span>,
    "CDU",
    "Pumps, filtration, controls, and a plate heat exchanger isolating the technology loop from facility water. Built at in-rack, in-row, or facility scale.",
    "Pump redundancy; control of coolant supply temperature above dew point.",
  ],
  [
    <span key="c" className="pill">LC-04</span>,
    "Technology loop",
    "The treated-coolant circuit between CDU and cold plates, with monitored chemistry and wetted-material compatibility.",
    "Corrosion and biological growth control.",
  ],
  [
    <span key="c" className="pill">LC-05</span>,
    "Facility water loop",
    <>Carries rejected heat from CDUs to the heat-rejection plant; its supply temperature defines the ASHRAE facility water class.<Cite n={1} /></>,
    "Flow balancing across many CDUs.",
  ],
  [
    <span key="c" className="pill">LC-06</span>,
    "Heat rejection / reuse",
    "Dry coolers, evaporative towers, chillers, or a heat-reuse exchanger feeding another process.",
    "Water consumption vs approach temperature tradeoff.",
  ],
];

const DECISION: [string, string, string, string, number | null][] = [
  ["01", "Rack density trajectory", "Sustained kW per rack over the hardware refresh horizon, not the day-one figure.", "Densities beyond the economic reach of air push the design to liquid; survey data shows the fleet already moving into the 10–30 kW band.", 6],
  ["02", "Facility water class", "The warmest ASHRAE facility water class the selected IT hardware accepts.", "Warmer classes unlock dry-cooler free cooling and reduce or eliminate chiller plant.", 1],
  ["03", "Heat-rejection path", "Local water availability, permits, climate, and approach temperatures.", "Evaporative towers trade water for temperature; dry coolers trade temperature for zero water.", null],
  ["04", "Coolant class", "Single-phase water/glycol vs two-phase dielectric; serviceability vs heat-flux ceiling.", "Single-phase is the mainstream default; two-phase suits extreme flux with added pressure management.", 5],
  ["05", "Residual air fraction", "How much server heat the cold plates cannot capture (VRs, drives, PSUs, NICs).", "Sizes the remaining air-cooling plant; no direct-to-chip design eliminates it.", 8],
  ["06", "CDU placement", "In-rack, in-row, or facility-scale CDUs against floor loading and pipe routing.", "In-rack/in-row suits retrofits and small footprints; facility CDUs suit new builds at scale.", 3],
  ["07", "Interoperability", "Conformance with OCP cold-plate and quick-disconnect requirements.", "Keeps the loop open to multiple server vendors across refresh cycles.", 4],
  ["08", "Heat-reuse ambition", "Whether an adjacent heat consumer exists and what return temperature it needs.", "Favors warm-water loops and placing the heat exchanger where a consumer can connect.", 8],
];

export default function DirectToChipLiquidCoolingPage() {
  return (
    <main>
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

      {/* 1 · HERO — ink, text left, visual right */}
      <HeroSplit
        code="ENG-01"
        cluster="Engineering · Cooling"
        title="Direct-to-chip liquid cooling,"
        accent="explained"
        lede="Coolant runs through cold plates mounted on the processors, so heat leaves the silicon through liquid instead of room air. A coolant distribution unit then hands that heat to a facility loop for rejection or reuse."
        imageId="cooling-coldplate-macro"
        field="cooling"
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Engineering", path: "/engineering" },
              { name: "Direct-to-chip liquid cooling", path: PATH },
            ]}
          />
        }
        metrics={[
          { value: "2", label: "Loops, one heat exchanger" },
          { value: "6", label: "Stages, plate to rejection" },
          { value: "0", label: "Water used by a closed loop" },
        ]}
      />

      {/* 2 · SUMMARY — canvas */}
      <SummaryBand
        title="What you need to know"
        items={[
          {
            code: "01",
            title: "Air ran out of headroom",
            body: "Industry-average PUE has been essentially flat for about six years while rack densities climbed into the 10–30 kW band.",
          },
          {
            code: "02",
            title: "It is two loops, not one",
            body: "A treated technology loop touches the IT; a facility loop carries heat away. A plate heat exchanger keeps them separate.",
          },
          {
            code: "03",
            title: "Temperature is the real prize",
            body: "Warm supply water unlocks dry-cooler free cooling and makes recovered heat useful to an adjacent process.",
          },
          {
            code: "04",
            title: "It never removes all the heat",
            body: "Regulators, drives, and power supplies still need an air path. Every design runs two cooling systems.",
          },
        ]}
      />

      {/* 3 · DIAGRAM — the page's visual centre, wide */}
      <DiagramWide
        imageId="cooling-loop-schematic"
        eyebrow="The system, end to end"
        title="Two loops joined by a heat exchanger"
        lede="The Open Compute Project maintains vendor-neutral requirements for the parts — cold plates, CDUs, quick disconnects — so hardware from different vendors can share one loop."
        field="cooling"
        callouts={[
          { title: "Cold plate", body: "Microchannel plate on the die package. Absorbs heat by conduction into the coolant." },
          { title: "Manifold + QD", body: "Distributes coolant across the rack. Dripless couplings let a server be pulled without draining." },
          { title: "CDU", body: "Pumps, filters, controls temperature, and isolates the technology loop from facility water." },
          { title: "Rejection", body: "Dry coolers, evaporative towers, or a heat-reuse exchanger feeding another process." },
        ]}
      />

      {/* 4 · WHY — prose with a sticky rail */}
      <ProseWithRail
        id="definition"
        surface="canvas"
        rail={
          <div style={{ borderTop: "1px solid var(--edge-bright)", paddingTop: "1.25rem" }}>
            <p className="eyebrow">On this page</p>
            <ul style={{ listStyle: "none", marginTop: "1rem", display: "grid", gap: "0.6rem" }}>
              {[
                ["#definition", "Why liquid"],
                ["#loop", "The loop"],
                ["#coolants", "Coolant classes"],
                ["#warm-water", "Warm water"],
                ["#decision", "Decision criteria"],
                ["#limitations", "Honest limits"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={{ ...link, fontSize: "0.9rem", textDecoration: "none" }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "2rem" }}>
              <LastVerified
                published="2026-08-31"
                lastVerified="2026-08-31"
                author="Josef Elimelech"
                reviewer="PODOS AI Engineering"
              />
            </div>
          </div>
        }
      >
        <SectionHead
          eyebrow="Why the industry moved"
          title="Air is a poor coolant, and the hardware stopped waiting"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Air has carried data-center heat for decades because it is free and simple, but it is a
            poor coolant: low density, low heat capacity, and it needs large temperature differences
            and high fan power to move meaningful energy. ASHRAE&apos;s TC 9.9 — the committee that
            defines the thermal envelopes IT vendors design to — published a dedicated white paper on
            why liquid cooling is expanding into mainstream facilities as rack densities climb beyond
            what airflow can economically serve.<Cite n={2} /> Its thermal guidelines now define
            liquid-cooling facility water classes alongside the familiar A1–A4 air classes.
            <Cite n={1} />
          </p>
          <p>
            AI hardware forces the issue. NVIDIA&apos;s GB200 NVL72 packs 72 GPUs and 36 CPUs into one
            liquid-cooled rack acting as a single NVLink domain — the vendor ships it liquid-cooled
            because an air-cooled version of that density is not on offer.<Cite n={7} /> Meanwhile the
            Uptime Institute&apos;s 2025 survey of 800+ operators shows fleet-wide rack densities
            rising into the 10–30 kW band and industry-average PUE essentially flat for about six
            years — evidence that incremental air-side tuning has run out of headroom.<Cite n={6} />{" "}
            Google&apos;s fleet-wide trailing-twelve-month PUE of 1.09 (per its latest reporting)
            marks the practical ceiling of what world-class air-and-water plants achieve at scale.
            <Cite n={9} />
          </p>
        </div>
      </ProseWithRail>

      {/* 5 · STICKY EXPLAINER — canvas, sticky visual + numbered stages */}
      <StickyExplainer
        imageId="cooling-service-detail"
        eyebrow="Component by component"
        title="What each stage actually does"
        lede="The order an engineering review walks the loop, and the thing that fails first at each stage."
        caption="LC-02 · Manifold, quick disconnects, and flow instrumentation"
        surface="paper"
        field="cooling"
        steps={[
          { code: "LC-01", title: "Cold plate", body: "A machined microchannel plate is clamped to the GPU or CPU package over a thermal interface material, and coolant absorbs the heat conducted out of the die. Mounting pressure and interface degradation are what quietly cost you performance." },
          { code: "LC-02", title: "Manifolds and quick disconnects", body: "Coolant is distributed across the servers in a rack. Dripless couplings let a technician pull a server without draining the loop — and OCP conformance is what keeps those couplings interchangeable across vendors." },
          { code: "LC-03", title: "Coolant distribution unit", body: "Pumps, filtration, controls, and a plate heat exchanger that isolates the technology loop from facility water. It also holds supply temperature above dew point, which is the difference between cooling a rack and condensing water on it." },
          { code: "LC-04", title: "Technology loop", body: "The treated-coolant circuit between CDU and cold plates. Chemistry and wetted-material compatibility are monitored for the life of the system; a neglected loop degrades silently." },
          { code: "LC-05", title: "Facility water loop", body: "Carries rejected heat from the CDUs to the rejection plant. Its supply temperature is what defines the ASHRAE facility water class the design sits in." },
          { code: "LC-06", title: "Heat rejection or reuse", body: "Dry coolers, evaporative towers, chillers, or an exchanger handing the heat to an adjacent process. This is the stage — not the cooling method — that decides site water consumption." },
        ]}
      />

      {/* 6 · MATRIX — wide */}
      <MatrixTable
        eyebrow="Reference"
        title="The loop as a bill of materials"
        lede="Six stages, what each one is for, and the item that decides whether it survives five years in operation."
        surface="canvas"
        head={["Stage", "Component", "Function", "Primary failure / watch item"]}
        rows={LOOP_ROWS}
      />

      {/* 7 · COOLANTS — split, visual right */}
      <SplitFeature
        imageId="cooling-cdu-row"
        eyebrow="Coolant classes"
        title="Single-phase is the default;"
        accent="two-phase buys flux"
        surface="paper"
        field="cooling"
      >
        <p>
          Two coolant families dominate direct-to-chip designs. Single-phase water-based coolants —
          treated water or propylene-glycol mixes — stay liquid through the loop and win on heat
          capacity, cost, and mature chemistry; OCP&apos;s cold-plate requirements document the
          wetted-material and quality expectations that keep them stable.<Cite n={4} />
        </p>
        <p>
          Two-phase dielectric fluids boil inside the cold plate, absorbing heat as latent energy.
          They capture very high heat flux and are non-conductive at the chip, but bring pressure
          management, higher fluid cost, and growing regulatory scrutiny of engineered
          fluorocarbons. OCP&apos;s accelerator-infrastructure guidelines cover liquid-cooling
          practice for exactly the multi-GPU systems driving these choices.<Cite n={5} />
        </p>
      </SplitFeature>

      {/* 8 · WARM WATER — split flipped, visual left */}
      <SplitFeature
        imageId="cooling-heat-rejection"
        eyebrow="Warm water and free cooling"
        title="The quiet advantage is"
        accent="temperature"
        flip
        surface="canvas"
      >
        <p>
          Because liquid pulls heat straight off the die, the loop can run far warmer than the
          chilled air an air-cooled room needs. ASHRAE names facility water classes by their maximum
          supply temperature, and the warmer classes matter economically: if the IT accepts warm
          supply water, heat can be rejected through dry coolers for most or all of the year — free
          cooling — instead of through compressor-driven chillers.<Cite n={1} />
        </p>
        <p>
          Warm return water is also what makes heat reuse practical: the higher the return
          temperature, the more useful the heat is to an adjacent process. Federal-lab guidance
          treats warm-water direct-to-chip loops as the enabling step for both free cooling and
          energy recovery.<Cite n={8} /> The rejection choice then sets the site&apos;s water story —
          evaporative towers consume water to reach lower temperatures; dry coolers consume none but
          need warmer loops or more surface area.
        </p>
      </SplitFeature>

      {/* 9 · INK BEAT */}
      <QuoteMetric
        quote="A closed technology loop paired with dry-cooler rejection consumes no water in operation — which makes water a siting decision, not a property of liquid cooling."
        attribution="PODOS AI Engineering · closed-loop operation"
        metric="0"
        label="Litres consumed by the loop itself"
        field="cooling"
      />

      {/* 10 · DECISION MATRIX — wide, paper */}
      <MatrixTable
        eyebrow="Selecting a configuration"
        title="The eight questions that decide the design"
        lede="In roughly the order an engineering review asks them."
        head={["#", "Criterion", "What to evaluate", "Design consequence"]}
        rows={DECISION.map(([n, c, e, d, cite]) => [
          <span key={n} className="pill">{n}</span>,
          c,
          e,
          <>
            {d}
            {cite ? <Cite n={cite} /> : null}
          </>,
        ])}
      />

      {/* 11 · LIMITS — mandatory */}
      <LimitsBlock
        title="Operational tradeoffs and honest limitations"
        lede="Direct-to-chip cooling is not a free upgrade, and designs that pretend otherwise fail in operation."
        items={[
          "It does not capture everything. Cold plates cool the components they touch; the residual heat load from regulators, drives, and power supplies still requires an air path, so the facility runs two cooling systems, not one.",
          "Coolant is now an operations discipline. Chemistry, filtration, and wetted-material compatibility must be monitored for the life of the loop; a neglected technology loop degrades quietly until it damages hardware.",
          "Leaks are low-probability, high-consequence. Dripless disconnects, leak detection, and rehearsed isolation procedures are mandatory engineering, not options.",
          "Service procedures change. Technicians disconnect fluid couplings rather than sliding servers out of airflow, and commissioning adds pressure testing and flow balancing that air-cooled rooms never needed.",
          "Standards are still maturing. OCP requirements reduce vendor lock-in but do not yet guarantee that every cold plate, coupling, and CDU interoperates across generations.",
        ]}
      />

      {/* 12 · PODOS APPLICATION — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="In the product" title="How the PODOS Pod applies direct-to-chip cooling" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            PODOS builds these choices into a factory-integrated unit rather than a field-built
            plant. Each{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>,{" "}
            <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with closed-loop
            direct-to-chip liquid cooling specified as part of the enclosure rather than added to a
            room. Because the cold plates, manifolds, CDU, and heat-rejection interfaces are
            integrated and tested in the factory, the cooling system ships as a commissioned
            subsystem — one reason PODOS{" "}
            <span data-claim="deployment-window">targets a 90-day window from order to commissioning</span>{" "}
            for a standard unit.
          </p>
          <p>
            The same closed-loop architecture shapes the rest of the system: the{" "}
            <Link href="/engineering/data-center-power-architecture" style={link}>
              power architecture
            </Link>{" "}
            that feeds the racks, the{" "}
            <Link href="/deploy" style={link}>
              deployment model
            </Link>{" "}
            that treats cooling as cargo instead of construction, and the broader{" "}
            <Link href="/platform" style={link}>
              modular platform
            </Link>{" "}
            those units compose into.
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
          { href: "/engineering/data-center-power-architecture", label: "ENGINEERING", title: "Power architecture that feeds the racks" },
          { href: "/compare/liquid-cooling-vs-air-cooling", label: "COMPARE", title: "Liquid cooling vs air cooling" },
          { href: "/insights/warm-water-liquid-cooling-explained", label: "INSIGHT", title: "Warm-water liquid cooling, explained" },
          { href: "/resources/ai-infrastructure-glossary", label: "RESOURCE", title: "AI infrastructure glossary" },
        ]}
      />

      {/* 16 · CTA */}
      <CTABand
        title="Bring the cooling design to"
        accent="your site"
        body="Send the rack density, the water story, and the site constraints. Engineering will tell you what a pod-based loop looks like there."
        primary={{ href: "/estimate", label: "Size your deployment" }}
        secondary={{ href: "/deploy", label: "See the deployment model" }}
        field="cooling"
      />
    </main>
  );
}
