/**
 * /deploy/transport-placement — Archetype C, deploy cluster, stage 04 spoke.
 * See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component. Expands DP-04 from /deploy: route survey, freight
 * envelope and permits, pad and interface readiness, crane/rigging
 * sequence. External facts cite the source register; company claims
 * render only from publishable claims.ts entries with qualifiers.
 *
 * This page carries no registry image, so the hero is HeroEditorial and
 * every body section is image-free — the stage strip, the two matrices,
 * and the ink beat carry the composition instead.
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import {
  HeroEditorial,
  SummaryBand,
  CardGrid,
  MatrixTable,
  ProseWithRail,
  QuoteMetric,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/deploy/transport-placement";
const TITLE = "Modular Data Center Transport, Permits, and Crane Set";
const DESCRIPTION =
  "How a factory-built modular data center reaches its pad: route survey, freight envelope and permits, crane and rigging sequence, and interface readiness.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Commercial Vehicle Size and Weight Program — federal size and weight standards",
    publisher: "Federal Highway Administration (US DOT)",
    url: "https://ops.fhwa.dot.gov/freight/sw/overview/index.htm",
    date: "accessed 2026-08-31",
  },
  {
    n: 2,
    name: "New brief explores implementation of ICC/MBI Standards 1200 and 1205 for off-site construction",
    publisher: "International Code Council / Modular Building Institute",
    url: "https://www.iccsafe.org/building-safety-journal/bsj-technical/new-brief-explores-implementation-of-icc-mbi-standards-1200-and-1205-for-off-site-construction/",
    date: "2021 standards; brief Aug 2022",
  },
  {
    n: 3,
    name: "ISO 668:2020 — Series 1 freight containers: classification, dimensions and ratings",
    publisher: "ISO",
    url: "https://www.iso.org/standard/76912.html",
    date: "2020 (Amd 1:2022)",
  },
  {
    n: 4,
    name: "IEC 60529 — Degrees of protection provided by enclosures (IP Code)",
    publisher: "IEC",
    url: "https://www.iec.ch/ip-ratings",
    date: "1989 + AMD1:1999 + AMD2:2013",
  },
  {
    n: 5,
    name: "FAQs: Enclosures (ANSI/NEMA 250 enclosure types)",
    publisher: "NEMA",
    url: "https://www.nema.org/docs/default-source/standards-document-library/faq-enclosures.pdf",
    date: "accessed 2026-08-31",
  },
  {
    n: 6,
    name: "Climatic design conditions — Weather Data Viewer (2025 Handbook—Fundamentals, Ch. 14)",
    publisher: "ASHRAE",
    url: "https://weather.ashrae.org/",
    date: "2025 ed.",
  },
  {
    n: 7,
    name: "NFPA 70 — National Electrical Code (NEC)",
    publisher: "NFPA",
    url: "https://www.nfpa.org",
    date: "current edition",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "Does a modular data center need an oversize load permit?",
    a: "Usually yes, and always check before quoting a schedule. Under the Federal Highway Administration's commercial vehicle size and weight standards, width on the National Network is fixed at 102 inches and Interstate System weights are capped at 20,000 lb single axle, 34,000 lb tandem axle, and 80,000 lb gross, while vehicle height is left to the states. A factory-integrated data center unit typically exceeds at least one of those limits, so it moves under state-issued oversize or overweight permits — obtained separately in every jurisdiction the route crosses.",
  },
  {
    q: "What has to be finished before the unit arrives on site?",
    a: "A level, load-rated pad with known bearing capacity and anchor provisions; conduit and service stub-ups terminated where the unit's interfaces will land; heat-rejection clearance; a network handoff point; and a route from the public road to the pad that carries the transport and crane loads. If any of those is unfinished, the unit is stored rather than set, at cost.",
  },
  {
    q: "Is a crane always required to place a modular unit?",
    a: "No. A mobile crane is the common method because it is fast when access allows, but self-propelled modular transporters, jack-and-slide systems, and roller sets place units where a crane cannot be positioned or where overhead clearance is limited. The method is chosen during the route survey, because it changes pad design, approach width, and ground preparation.",
  },
  {
    q: "Can a placed unit be relocated later?",
    a: "A relocatable unit is designed to be disconnected, lifted, and moved by reversing the placement sequence. The practical constraints are the same ones that applied on the way in: route, permits, crane access, and interface disconnection. Relocation is a logistics project, not a facility demolition.",
  },
];

const link: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

/* The seven-step placement sequence — code, activity, coverage, risk. */
const SEQUENCE: [string, string, string, string][] = [
  [
    "TP-01",
    "Route survey",
    "Drive the route from the factory gate to the pad: bridge ratings, overhead clearances, turning radii, weight-restricted roads, seasonal restrictions.",
    "The survey — not the lift — is where placement projects succeed or fail.",
  ],
  [
    "TP-02",
    "Load engineering",
    "Fix transport configuration, tie-down and lift points, centre of gravity, and the trailer type the envelope demands.",
    "Determines which permits are needed and whether a crane or transporter sets the unit.",
  ],
  [
    "TP-03",
    "Permits and escorts",
    "Apply per jurisdiction for oversize/overweight movement; add pilot vehicles, police escorts, or curfew windows where required.",
    "Permits are issued state by state and carry lead times that belong on the critical path.",
  ],
  [
    "TP-04",
    "Pad and interface readiness",
    "Complete pad, anchors, conduit stub-ups, heat-rejection clearance and network handoff before the unit ships.",
    "An unfinished pad converts a delivery into paid storage.",
  ],
  [
    "TP-05",
    "Delivery and staging",
    "Arrive, stage the trailer, establish the exclusion zone, set crane mats or transporter path, hold the pre-lift briefing.",
    "Ground bearing pressure under the crane matters as much as under the unit.",
  ],
  [
    "TP-06",
    "Rig and set",
    "Lift under an engineered plan with rated rigging and spreader geometry; land on anchors; confirm level and alignment.",
    "Wind limits govern; a marginal forecast stops the lift, not the schedule discussion.",
  ],
  [
    "TP-07",
    "Interface connection",
    "Terminate power, connect heat-rejection and any facility fluid interfaces, land fibre, verify grounding and bonding.",
    "The interface list is the acceptance boundary between logistics and commissioning.",
  ],
];

/* Pad and interface readiness — hold point label + the acceptance criterion. */
const READINESS: [string, string][] = [
  [
    "Pad",
    "Pad is level, load-rated, and drained, with documented bearing capacity for both the unit and the placement equipment.",
  ],
  [
    "Anchorage",
    "Anchorage or tie-down provisions are installed and located to the unit's published interface drawing, not improvised on the day.",
  ],
  [
    "Stub-ups",
    "Conduit and service stub-ups terminate where the unit's connection points will land, with slack for final alignment.",
  ],
  [
    "Heat-rejection clearance",
    "Clearance around heat-rejection equipment is preserved — no walls, fences, or neighbouring plant inside the airflow envelope.",
  ],
  [
    "Placement standing area",
    "Crane standing area or transporter path is prepared: mats sized, underground services located, overhead lines cleared or de-energised.",
  ],
  [
    "Site access",
    "Site access from the public road carries the transport load — culverts, turning radii, gate widths, and any temporary road works.",
  ],
  [
    "Network handoff",
    "Network handoff point is installed and tested to the demarcation, so fibre termination is a connection rather than a build.",
  ],
  [
    "Documents",
    "Permits, insurance certificates, and the lift plan are on site and current before the transport leaves the factory.",
  ],
];

/* The six deploy stages — DP-04 is this page. */
const STAGES: { code: string; title: string; href?: string; body: string }[] = [
  {
    code: "DP-01",
    title: "Site & power readiness",
    href: "/deploy/site-power-readiness",
    body: "Confirm power, permits, ground, access, and network before anything is specified.",
  },
  {
    code: "DP-02",
    title: "Configuration engineering",
    href: "/deploy/configuration-engineering",
    body: "Fix the build specification from a bounded menu, then freeze it.",
  },
  {
    code: "DP-03",
    title: "Factory build & testing",
    href: "/deploy/factory-build-testing",
    body: "Assembly, integration, and burn-in on the line, ending in a factory acceptance test.",
  },
  {
    code: "DP-04",
    title: "Transport & placement — this stage",
    body: "Ship as heavy freight, rig, set, and connect. It ends with the unit set and mechanically connected.",
  },
  {
    code: "DP-05",
    title: "Commissioning",
    href: "/deploy/commissioning",
    body: "Energize, verify, and load-test on site power until the site acceptance test passes.",
  },
  {
    code: "DP-06",
    title: "Operations & maintenance",
    href: "/deploy/operations-maintenance",
    body: "Monitor, maintain, and grow unit by unit once the schedule stops.",
  },
];

const TOC: [string, string][] = [
  ["#sequence", "The placement sequence"],
  ["#freight-envelope", "Freight envelope"],
  ["#permits", "Permits and inspection"],
  ["#pad-readiness", "Pad and interfaces"],
  ["#rigging", "Crane and rigging"],
  ["#podos", "How PODOS approaches it"],
  ["#limitations", "When it is not a fit"],
  ["#faq", "Questions"],
];

export default function TransportPlacementPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Transport and placement: getting a modular data center onto its pad"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — editorial, paper. This page carries no registry image. */}
      <HeroEditorial
        category="Deploy · Stage 04 · Transport & placement"
        title="Transport and placement: getting a modular data center"
        accent="onto its pad"
        lede="Transport and placement is a freight-and-rigging problem, not a construction one. A finished unit is surveyed against the route, engineered as a load, permitted in every jurisdiction it crosses, delivered to a pad that is already finished, then rigged, set, and connected. Almost everything that decides this stage is settled weeks earlier — in the route survey and the interface drawing — not on lift day."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Deploy", path: "/deploy" },
              { name: "Transport & placement", path: PATH },
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
          { value: "04", label: "Stage of six" },
          { value: "07", label: "Steps in the sequence" },
          { value: "08", label: "Pad readiness hold points" },
        ]}
      />

      {/* 2 · WHAT THIS STAGE DELIVERS — canvas */}
      <SummaryBand
        title="What this stage delivers"
        items={[
          {
            code: "04",
            title: "Where the stage sits",
            body: (
              <>
                This stage is stage 04 of the{" "}
                <Link href="/deploy" style={link}>
                  six-stage deployment model
                </Link>
                . It begins while the unit is still on the factory line and ends the moment the
                interfaces are landed and commissioning can start.
              </>
            ),
          },
          {
            code: "ENVELOPE",
            title: "The road is a design input",
            body: "Width, weight and height limits shape the enclosure before the factory cuts steel. Step outside them and permits, escorts and curfew windows follow.",
          },
          {
            code: "PERMITS",
            title: "Two tracks, in parallel",
            body: "State-issued oversize movement permits and building-code acceptance of factory-built work are separate processes. Both carry lead times.",
          },
          {
            code: "PAD",
            title: "The pad is the site work",
            body: "It is the only part genuinely built on site, and the usual source of delay. Unfinished on arrival, the unit is stored rather than set.",
          },
        ]}
      />

      {/* 3 · STAGE STRIP — paper, deploy field */}
      <CardGrid
        eyebrow="Deployment model"
        title="Six stages, and where this one lands"
        lede="Each stage hands a defined artefact to the next. Stage 04 receives a unit that has passed factory acceptance testing, and hands over a unit that is set, anchored, and mechanically connected."
        surface="paper"
        field="deploy"
        columns={3}
        id="stages"
        items={STAGES.map((s) => ({
          code: s.code,
          title: s.title,
          body: s.href ? (
            <>
              {s.body}{" "}
              <Link href={s.href} style={link}>
                Read stage {s.code.slice(-2)}
              </Link>
              .
            </>
          ) : (
            s.body
          ),
        }))}
      />

      {/* 4 · SEQUENCE — canvas, wide matrix */}
      <MatrixTable
        eyebrow="TP-01 → TP-07"
        title="The placement sequence, step by step"
        lede="Seven steps, in order, with the item that actually carries the risk in each."
        surface="canvas"
        id="sequence"
        head={["Step", "Activity", "What it covers", "Where the risk sits"]}
        rows={SEQUENCE.map(([code, name, covers, risk]) => [
          <span key={code} className="pill">
            {code}
          </span>,
          name,
          covers,
          risk,
        ])}
      />

      {/* 5 · FREIGHT, PERMITS, PAD — paper prose with a navigation rail */}
      <ProseWithRail
        id="freight-envelope"
        surface="paper"
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
          eyebrow="Design constraint"
          title="The freight envelope and why it governs the design"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            A modular unit is designed backwards from the road. Federal standards fix vehicle width
            on the National Network at 102 inches — a figure no state may set higher or lower — and
            cap Interstate System weights at 20,000 lb on a single axle, 34,000 lb on a tandem axle,
            and 80,000 lb gross vehicle weight. Vehicle height is deliberately left to the states, so
            the legal ceiling changes as the route crosses borders.<Cite n={1} /> Anything outside
            those figures moves as an oversize or overweight load under a permit issued by each
            jurisdiction, not by a single national authority.
          </p>
          <p>
            That is why the envelope is a design input rather than a shipping detail. An enclosure
            that stays inside the routine legal envelope travels on standard trailers, on ordinary
            notice, with no escort. One that steps outside it acquires permits, pilot vehicles,
            curfew windows, and — on some corridors — seasonal weight restrictions that close the
            route for part of the year. Where the enclosure is built to ISO Series 1 corner-fitting
            geometry, standard container handling gear and twistlocks apply, because those dimensions
            and ratings are internationally standardized.<Cite n={3} />
          </p>
        </div>

        <div id="permits" style={{ marginTop: "3rem", scrollMarginTop: 96 }}>
          <SectionHead eyebrow="Two tracks" title="Permits, and who inspects factory work" />
          <div style={{ marginTop: "1.5rem" }}>
            <p>
              Two permit tracks run in parallel and are frequently confused. The first is transport:
              state-issued oversize and overweight movement permits, applied for per jurisdiction,
              with lead times that belong on the critical path rather than in a logistics footnote.
              The second is the building-code track — the authority having jurisdiction still has to
              accept a structure that was largely built somewhere else.
            </p>
            <p>
              The off-site construction standards ICC/MBI 1200 and 1205 exist precisely for that
              handoff. They set out how compliance is demonstrated when fabrication happens in a
              plant: in-plant inspection, third-party inspection agencies, state industrialized
              building programs, and a final on-site inspection covering the work that could only
              happen at the site.<Cite n={2} /> Understanding that division early is what keeps site
              inspection scoped to foundations, connections, and setting instead of re-litigating
              factory assembly at the pad.
            </p>
          </div>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <SectionHead eyebrow="The one thing built on site" title="Pad and interface readiness" />
          <div style={{ marginTop: "1.5rem" }}>
            <p>
              The pad is the one part of a modular deployment that is genuinely built on site, and it
              is the most common source of delay. Every item below should be complete and verified
              before the transport leaves the factory — not scheduled to finish while it is in
              transit. For the wider site picture, work through the{" "}
              <Link href="/resources/data-center-readiness-checklist" style={link}>
                data center readiness checklist
              </Link>
              .
            </p>
            <p>
              Two site facts deserve attention beyond the checklist. Because the unit stands
              outdoors, its enclosure rating is a siting constraint: IP codes describe protection
              against solids and liquids, NEMA enclosure types add corrosion, icing, and construction
              requirements, and the two systems are not interchangeable in either direction.
              <Cite n={4} />
              <Cite n={5} /> And heat-rejection equipment is sized against the specific pad&apos;s
              design conditions — the design dry bulb and coincident wet bulb published for the
              nearest climatic station, not a national average.<Cite n={6} /> Both belong in the{" "}
              <Link href="/engineering/thermal-enclosure" style={link}>
                enclosure and thermal design
              </Link>{" "}
              conversation before the pad is poured.
            </p>
          </div>
        </div>
      </ProseWithRail>

      {/* 6 · READINESS MATRIX — canvas, wide */}
      <MatrixTable
        eyebrow="Hold points"
        title="Pad and interface readiness checklist"
        lede="Eight acceptance criteria. Each one is a hold point: unmet, it stops the transport rather than the lift."
        surface="canvas"
        field="deploy"
        id="pad-readiness"
        head={[
          "Ref",
          "Hold point",
          "Acceptance criterion — verified before the transport leaves the factory",
        ]}
        rows={READINESS.map(([label, criterion], i) => [
          <span key={label} className="pill">
            PR-{String(i + 1).padStart(2, "0")}
          </span>,
          label,
          criterion,
        ])}
      />

      {/* 7 · RIGGING + PODOS — paper prose */}
      <ProseWithRail id="rigging" surface="paper">
        <SectionHead eyebrow="Lift day" title="Crane, rigging, and the alternatives" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            A mobile crane is the default because it is quick where access allows, but the lift is an
            engineered operation: a written lift plan, rated rigging matched to the unit&apos;s
            designated pick points, spreader geometry that keeps sling angles inside their rating,
            mats sized to the crane&apos;s ground bearing pressure, a located-and-cleared underground
            and overhead survey, an exclusion zone, and a wind limit that stops work regardless of
            what the schedule says.
          </p>
          <p>
            Where a crane cannot stand — constrained yards, overhead lines that cannot be
            de-energised, poor ground, or a pad tucked behind an existing building — the load is
            placed by self-propelled modular transporter, jack-and-slide, or roller sets. Those
            methods trade speed for reach and change what the site must provide: a continuous
            prepared path rather than a single standing area. That choice belongs in the route
            survey, because it changes the pad design.
          </p>
          <p>
            Connection follows setting. Power terminations are field work governed by the electrical
            code in force at the site<Cite n={7} /> and executed against the{" "}
            <Link href="/engineering/data-center-power-architecture" style={link}>
              power architecture
            </Link>{" "}
            defined during configuration; heat-rejection and any facility fluid interfaces are made
            up and pressure-checked; fibre is landed at the demarcation. When the interface list is
            signed off, the unit passes from logistics to commissioning.
          </p>
        </div>

        <div id="podos" style={{ marginTop: "3rem", scrollMarginTop: 96 }}>
          <SectionHead
            eyebrow="In the product"
            title="How PODOS approaches transport and placement"
          />
          <div style={{ marginTop: "1.5rem" }}>
            <p>
              PODOS treats the road as a design constraint rather than a downstream problem. Each{" "}
              <Link href="/platform/podos-pod" style={link}>
                PODOS Pod
              </Link>{" "}
              is{" "}
              <span data-claim="unit-capacity-1mw">
                designed as a standardized 1 MW building block
              </span>{" "}
              and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, integrated and
              tested on the line so that site work reduces to preparing a pad and landing interfaces.
              Because the unit is a repeated product rather than a one-off structure, the route
              survey, lift plan, and interface drawing are reusable engineering — which is part of
              why PODOS{" "}
              <span data-claim="deployment-window">
                targets a 90-day window from order to commissioning
              </span>{" "}
              for a standard unit on a ready site.
            </p>
            <p>
              That target assumes the constraints on this page are cleared, not ignored: a surveyed
              route, permits in hand, and a finished pad. If you are weighing this model against
              pouring a building, the{" "}
              <Link href="/compare/factory-built-vs-site-built-data-center" style={link}>
                factory-built versus site-built comparison
              </Link>{" "}
              sets out the tradeoffs; to size a configuration before a site visit, use the{" "}
              <Link href="/configure" style={link}>
                configurator
              </Link>
              ; and any unfamiliar term here is defined in the{" "}
              <Link href="/resources/ai-infrastructure-glossary" style={link}>
                AI infrastructure glossary
              </Link>
              .
            </p>
          </div>
        </div>
      </ProseWithRail>

      {/* 8 · INK BEAT */}
      <QuoteMetric
        quote="The survey — not the lift — is where placement projects succeed or fail."
        attribution="TP-01 · Route survey · the first step of the placement sequence"
        metric="07"
        label="Steps, factory gate to interface sign-off"
        field="deploy"
      />

      {/* 9 · DELIVERABLES — paper, back to a light surface after the ink band */}
      <CardGrid
        eyebrow="Stage 04 output"
        title="What the customer receives"
        lede="Every deliverable in this stage is a document before it is an event. Each one is produced, reviewed, and held on site before the transport moves."
        surface="paper"
        columns={3}
        id="deliverables"
        items={[
          {
            code: "TP-01",
            title: "Route survey record",
            body: "Bridge ratings, overhead clearances, turning radii, weight-restricted roads and seasonal restrictions, recorded from the factory gate to the pad.",
          },
          {
            code: "TP-02",
            title: "Transport load engineering",
            body: "Transport configuration, tie-down and lift points, centre of gravity, and the trailer type the envelope demands.",
          },
          {
            code: "TP-03",
            title: "Permit and escort pack",
            body: "Oversize and overweight movement permits per jurisdiction, plus pilot vehicles, police escorts, or curfew windows where required, with insurance certificates.",
          },
          {
            code: "TP-04",
            title: "Interface drawing",
            body: "Published anchor locations, stub-up positions, and the heat-rejection clearance envelope the pad is built to, rather than improvised on the day.",
          },
          {
            code: "TP-06",
            title: "Engineered lift plan",
            body: "A written plan with rated rigging, spreader geometry, mat sizing, the exclusion zone, and the wind limit that stops work.",
          },
          {
            code: "TP-07",
            title: "Signed interface list",
            body: "Power terminated, heat-rejection and facility fluid interfaces made up and pressure-checked, fibre landed at the demarcation. The acceptance boundary between logistics and commissioning.",
          },
        ]}
      />

      {/* 10 · LIMITS — canvas, mandatory */}
      <LimitsBlock
        title="When placement is not the right fit"
        lede="Factory-built infrastructure only wins where the finished machine can physically reach its position. These are the situations where it does not, and where a site-built approach or a different location is the more honest answer."
        items={[
          "No heavy-freight route to the pad. Dense urban cores, weight-restricted bridges, tight mountain switchbacks, or a gate the trailer cannot turn through will end the project before rigging is discussed. Route survey first, always.",
          "Placement inside an existing building. Rooftops, basements, and interior halls are structural and access problems that a relocatable outdoor unit is not designed to solve; that is a fit-out project.",
          "Permit calendars longer than the build. Some corridors combine slow oversize permitting with seasonal load restrictions, so the legal window — not the factory — sets the delivery date.",
          "Power that is not yet resolved. Setting a unit onto a pad with no energisation path parks capital on a slab; site and power readiness has to close first.",
          "Sites with no viable crane position and no path for alternative rigging. If neither a crane nor a transporter can reach the pad, the placement method does not exist at any budget.",
          "Very small loads. Where the requirement is a handful of racks rather than megawatt-class capacity, the logistics overhead of moving an integrated unit is hard to justify.",
        ]}
      />

      {/* 11 · FAQ — paper */}
      <FAQBlock items={FAQ} surface="paper" />

      {/* 12 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED — paper; the six-stage chain runs through here */}
      <RelatedRail
        title="Continue the deployment chain"
        surface="paper"
        items={[
          {
            href: "/deploy/factory-build-testing",
            label: "PREVIOUS · STAGE 03",
            title: "Factory build and testing",
          },
          {
            href: "/deploy/commissioning",
            label: "NEXT · STAGE 05",
            title: "Commissioning and sign-off",
          },
          { href: "/deploy", label: "DEPLOY", title: "The six-stage deployment model" },
          {
            href: "/compare/factory-built-vs-site-built-data-center",
            label: "COMPARE",
            title: "Factory-built vs site-built",
          },
        ]}
      />

      {/* 14 · CTA — ink */}
      <CTABand
        title="Survey the route before"
        accent="you pour the pad"
        body="Bring the access route, the pad drawing, and the interface positions. Sizing a configuration first makes the freight envelope a known quantity rather than a late surprise."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy/commissioning", label: "Next: commissioning" }}
        field="deploy"
      />
    </main>
  );
}
