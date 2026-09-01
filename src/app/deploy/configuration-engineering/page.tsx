/**
 * /deploy/configuration-engineering — Archetype C, deployment stage guide
 * (DP-02 "Configuration"). See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, zero client JS. Composed entirely from the section
 * library (src/components/seo/sections.tsx) — 14 sections, 11 distinct
 * types, alternating surfaces. The page carries no images of its own, so
 * the hero is the image-free HeroEditorial relabelled for the deploy
 * cluster. External numbers cite the source register; company claims
 * render only from claims.ts publishable entries with their required
 * qualifiers, carried through as data-claim.
 */

import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import {
  HeroEditorial,
  SummaryBand,
  CardGrid,
  ProseWithRail,
  MatrixTable,
  QuoteMetric,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/deploy/configuration-engineering";
const TITLE = "Configuration Engineering: Specifying an AI Data Center Unit";
const DESCRIPTION =
  "Stage 02 of modular AI deployment: how workload profile, accelerator family, rack density, cooling selection, and site interfaces become a frozen build spec.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Global Data Center Survey 2025",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 2,
    name: "GB200 NVL72 product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    date: "accessed 2026-08-31",
  },
  {
    n: 3,
    name: "NVLink and NVLink Switch product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/nvlink/",
    date: "accessed 2026-08-31",
  },
  {
    n: 4,
    name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org",
    date: "2021",
  },
  {
    n: 5,
    name: "ACS Liquid Cooling Cold Plate Requirements, Rev 1.0",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/documents/ocp-acs-liquid-cooling-cold-plate-requirements-pdf",
  },
  {
    n: 6,
    name: "IEEE 519-2022 — Harmonic Control in Electric Power Systems",
    publisher: "IEEE",
    url: "https://standards.ieee.org/ieee/519/10677/",
    date: "2022",
  },
  {
    n: 7,
    name: "ANSI/TIA-942 Telecommunications Infrastructure Standard for Data Centers (rev. C)",
    publisher: "Telecommunications Industry Association",
    url: "https://tiaonline.org/products-and-services/tia942certification/ansi-tia-942-standard/",
  },
  {
    n: 8,
    name: "IEEE Std 802.3df-2024 — Ethernet Amendment 9 (800 Gb/s MAC; 400/800 Gb/s PHYs)",
    publisher: "IEEE SA",
    url: "https://standards.ieee.org/ieee/802.3df/11107/",
    date: "published Mar 2024",
  },
  {
    n: 9,
    name: "Climatic design conditions — Weather Data Viewer / 2025 Handbook—Fundamentals Ch. 14",
    publisher: "ASHRAE",
    url: "https://weather.ashrae.org/",
    date: "2025 ed.",
  },
  {
    n: 10,
    name: "IEC 60529 — Degrees of protection provided by enclosures (IP Code)",
    publisher: "IEC",
    url: "https://www.iec.ch/ip-ratings",
    date: "1989 + AMD1:1999 + AMD2:2013",
  },
  {
    n: 11,
    name: "Redfish Scalable Platforms Management API Specification (DSP0266)",
    publisher: "DMTF",
    url: "https://www.dmtf.org/standards/redfish",
    date: "v1.24.0, Apr 2026",
  },
  {
    n: 12,
    name: "Commercial Vehicle Size and Weight Program — federal size and weight standards",
    publisher: "Federal Highway Administration (US DOT)",
    url: "https://ops.fhwa.dot.gov/freight/sw/overview/index.htm",
    date: "accessed 2026-08-31",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "What is configuration engineering in a data center deployment?",
    a: "It is the stage that converts requirements into a build specification. On a standardized unit it is a bounded selection problem rather than a design project: workload profile, accelerator family, rack density, cooling option, site interfaces, and operating model are each chosen from a fixed menu and signed as a configuration freeze.",
  },
  {
    q: "What is a configuration freeze?",
    a: "The signed specification the factory builds against and every later acceptance test references. Once frozen, changes run as documented change orders, because procurement, fabrication sequencing, and factory test plans are all derived from it.",
  },
  {
    q: "Which decision should be made first?",
    a: "The workload profile. It sets the accelerator family, which sets rack density, which sets the cooling selection, which sets the heat-rejection and site-interface requirements. Working the chain in the other direction produces a specification that does not close.",
  },
  {
    q: "Can the configuration change after the freeze?",
    a: "Some of it, at a cost. Monitoring scope and operating-model choices stay flexible longest. Accelerator family, rack density, and anything touching the cooling loop or the electrical service become expensive once fabrication and long-lead procurement have started.",
  },
];

const AXES: [string, string, string, string][] = [
  [
    "CFG-01",
    "Workload profile",
    "Training, inference, or mixed; sustained versus bursty duty; latency and data-residency limits.",
    "Sets every axis below it. A sustained training profile and a spiky inference profile produce different hardware from the same enclosure.",
  ],
  [
    "CFG-02",
    "Accelerator family",
    "Which accelerator platform is installed at integration, and how the vendor packages it at rack scale.",
    "Rack-scale vendor packages carry their own thermal and interconnect assumptions; accepting the family means accepting those.",
  ],
  [
    "CFG-03",
    "Rack density",
    "Sustained kW per rack across the refresh horizon, not the day-one figure.",
    "Decides whether air stays viable, how many racks the unit carries, and how much of the electrical budget is compute.",
  ],
  [
    "CFG-04",
    "Cooling selection",
    "Coolant class, facility water supply temperature, and the heat-rejection method at the boundary.",
    "Warmer accepted supply water buys free cooling; the rejection choice sets the site water story and outdoor footprint.",
  ],
  [
    "CFG-05",
    "Site interfaces",
    "Four boundaries: electrical service, network handoff, heat rejection, physical placement.",
    "The only points where a standardized unit meets a non-standard world, so they hold most of the remaining risk.",
  ],
  [
    "CFG-06",
    "Operating model",
    "Who monitors, who maintains, what telemetry leaves the unit, and to whom.",
    "Sets monitoring integration scope, spares, and response commitments. The last axis to stay flexible.",
  ],
];

const FREEZE_CHECKLIST: string[] = [
  "Workload profile stated in writing, including the sustained duty the thermal design is sized against.",
  "Accelerator family and quantity fixed, with the vendor's thermal and interconnect requirements attached.",
  "Sustained kW per rack agreed for the refresh horizon, not only the first installed generation.",
  "Coolant class and facility water supply temperature selected and confirmed against the installed hardware.",
  "Heat-rejection method chosen, with the site's climatic design conditions named as the sizing basis.",
  "Electrical service arrangement fixed: voltage, transformer ownership, protection coordination, harmonic responsibility.",
  "Network handoff defined: demarcation point, media type, port speeds, cross-connect ownership.",
  "Physical placement resolved: pad, anchorage, clearances, access route, transport envelope.",
  "Enclosure rating stated for the site's exposure, corrosion, and altitude conditions.",
  "Operating model signed: monitoring scope, telemetry destination, maintenance responsibility, spares position.",
  "Change-order process agreed, naming which axes stay open and what reopening each one costs.",
];

/* The six-stage chain. DP-02 is this page. */
const STAGES: { code: string; title: string; href: string | null; body: string }[] = [
  {
    code: "DP-01",
    title: "Site and power readiness",
    href: "/deploy/site-power-readiness",
    body: "The site-side half of the freeze checklist is worked here — service, interconnect, pad, and access route.",
  },
  {
    code: "DP-02 · THIS STAGE",
    title: "Configuration engineering",
    href: null,
    body: "Requirements become a signed build specification: six axes chosen in dependency order and frozen.",
  },
  {
    code: "DP-03",
    title: "Factory build and testing",
    href: "/deploy/factory-build-testing",
    body: "The unit is built and tested against the frozen specification, indoors and off the critical path.",
  },
  {
    code: "DP-04",
    title: "Transport and placement",
    href: "/deploy/transport-placement",
    body: "The finished unit moves to site inside the transport envelope named in the freeze, and lands on its pad.",
  },
  {
    code: "DP-05",
    title: "Commissioning",
    href: "/deploy/commissioning",
    body: "On-site acceptance testing, referenced back to the specification frozen in this stage.",
  },
  {
    code: "DP-06",
    title: "Operations and maintenance",
    href: "/deploy/operations-maintenance",
    body: "The operating model signed in the freeze becomes live monitoring, maintenance, and spares.",
  },
];

const TOC: [string, string][] = [
  ["#decides", "What it decides"],
  ["#axes", "The six axes"],
  ["#interfaces", "Site interfaces"],
  ["#freeze", "Freeze checklist"],
  ["#podos", "How PODOS runs it"],
  ["#limitations", "Honest limits"],
  ["#faq", "FAQ"],
];

export default function ConfigurationEngineeringPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Configuration engineering: requirements become a specified unit"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — paper, editorial (this page carries no images) */}
      <HeroEditorial
        code="DP-02"
        category="Deploy · Deployment stage"
        field="deploy"
        title="Configuration engineering: requirements become a"
        accent="specified unit"
        lede="Configuration engineering is the stage that turns a workload requirement into a build specification. On a standardized modular unit it is a bounded selection problem, not a design project: workload profile, accelerator family, rack density, cooling selection, site interfaces, and operating model are each chosen from a fixed menu. The output is a configuration freeze — the signed specification the factory builds against and every later acceptance test references."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Deploy", path: "/deploy" },
              { name: "Configuration engineering", path: PATH },
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
          { value: "6", label: "Configuration axes, in dependency order" },
          { value: "4", label: "Site interfaces to define" },
          { value: "11", label: "Lines in the freeze checklist" },
        ]}
      />

      {/* 2 · SUMMARY — canvas */}
      <SummaryBand
        title="What stage 02 delivers"
        items={[
          {
            code: "01",
            title: "One deliverable: the freeze",
            body: "The stage has one deliverable and one failure mode. The deliverable is the configuration freeze — the signed specification the factory builds against.",
          },
          {
            code: "02",
            title: "A bounded menu, not a design project",
            body: "The architecture is already fixed, so configuration is the short step of choosing among options the platform already supports.",
          },
          {
            code: "03",
            title: "Order is the whole discipline",
            body: "Six axes, each constraining the next. Working the chain backwards is the most common way a configuration fails to close.",
          },
          {
            code: "04",
            title: "One failure mode",
            body: "Freezing a specification nobody traced end to end — an accelerator chosen without checking the density it implies.",
          },
        ]}
      />

      {/* 3 · STAGE STRIP — paper, DP-02 emphasised */}
      <CardGrid
        id="stages"
        eyebrow="The chain"
        title="Where stage 02 sits in the six-stage deployment model"
        lede="Each stage inherits the decisions frozen in the one before it. This page is the stage-02 detail."
        field="deploy"
        columns={3}
        items={STAGES.map((s) => ({
          code: s.code,
          title: s.title,
          body: s.href ? (
            <>
              {s.body}{" "}
              <Link href={s.href} style={link}>
                Read stage {s.code.slice(3)}
              </Link>
              .
            </>
          ) : (
            <>
              <strong style={{ color: "var(--ink-strong)" }}>You are here.</strong> {s.body}
            </>
          ),
        }))}
      />

      {/* 4 · THE NARRATIVE — canvas, the only long-prose container */}
      <ProseWithRail
        id="decides"
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
          eyebrow="Scope"
          title="What this stage actually decides"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            In a conventional build, configuration and design are the same activity, and they run
            for months because almost nothing is fixed. In a factory-built model the architecture is
            already fixed — enclosure, cooling topology, power distribution, rack geometry — so
            configuration is the short step of choosing among options the platform already supports.
            That is the whole trade: less freedom, far less schedule. This page is the stage-02
            detail behind the{" "}
            <Link href="/deploy" style={link}>
              six-stage deployment overview
            </Link>
            .
          </p>
          <p>
            The stage has one deliverable and one failure mode. The deliverable is the configuration
            freeze. The failure mode is freezing a specification nobody traced end to end — an
            accelerator chosen without checking the density it implies, a density chosen without
            checking the cooling it forces, a cooling selection chosen without checking what the
            site can reject heat into.
          </p>

          <h3 className="h3" style={{ marginTop: "2.5rem" }}>
            Workload profile sets everything else
          </h3>
          <p>
            The first question is not which GPU. It is what the machine is for, and how hard it
            runs. A sustained training profile pins accelerators near their power ceiling for long
            stretches, so the thermal design is sized against a near-continuous load. An inference
            profile is spikier and more sensitive to latency and data residency, which often decides
            the site before it decides the hardware. A mixed profile must be sized against its worst
            sustained case — averaging is how thermal designs end up undersized.
          </p>
          <p>
            Two assumptions belong in writing at this point: the sustained duty the cooling is sized
            against, and the horizon over which the unit must absorb a hardware generation or two.
            Both are what a later disagreement will be about.
          </p>

          <h3 className="h3" style={{ marginTop: "2.5rem" }}>
            Accelerator family and rack density
          </h3>
          <p>
            Choosing an accelerator family is no longer only a compute decision. Vendors now ship
            rack-scale packages with their own cooling and interconnect assumptions built in:
            NVIDIA&apos;s GB200 NVL72 is delivered as a liquid-cooled rack acting as a single NVLink
            domain, because an air-cooled build of that density is not on offer.
            <Cite n={2} /> The interconnect topology travels with the choice too: NVLink Switch gives
            all-to-all GPU communication across the rack,<Cite n={3} /> which is a different design
            question from the fabric between racks. Configuration has to accept both, or pick a
            different family.
          </p>
          <p>
            Rack density then falls out of that choice, and it belongs in the freeze as a sustained
            figure across the refresh horizon rather than a day-one nameplate. Uptime
            Institute&apos;s 2025 global data center survey tracks the same shift across the operator
            base: fleet densities are climbing past what conventional air cooling handles
            comfortably.<Cite n={1} /> The{" "}
            <Link href="/engineering/high-density-gpu-infrastructure" style={link}>
              high-density GPU infrastructure
            </Link>{" "}
            page covers what that density does to the rest of the design.
          </p>

          <h3 className="h3" style={{ marginTop: "2.5rem" }}>
            Cooling selection follows density, not preference
          </h3>
          <p>
            Once density is fixed, the cooling selection is mostly determined. What remains open is
            the coolant class, the facility water supply temperature the installed hardware accepts,
            and the heat-rejection method at the boundary. ASHRAE&apos;s thermal guidelines name
            liquid-cooling facility water classes by their maximum supply temperature, and the choice
            is economic as much as thermal: the warmer the class the hardware tolerates, the more of
            the year heat can be rejected without compressors.
            <Cite n={4} /> Open Compute&apos;s cold-plate requirements set the wetted-material and
            interface expectations that keep a multi-vendor loop stable across refreshes.
            <Cite n={5} />
          </p>
          <p>
            The rejection method is the genuinely site-specific part, sized against climatic design
            conditions for the actual location — design dry bulb, extreme dew point, coincident wet
            bulb — not a national average.<Cite n={9} /> A dry cooler consumes no water but needs a
            warmer loop or more surface area; evaporative rejection buys lower approach temperatures
            and pays in water. The loop itself is covered on the{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
              direct-to-chip liquid cooling
            </Link>{" "}
            page.
          </p>
        </div>
      </ProseWithRail>

      {/* 5 · AXES MATRIX — paper, wide */}
      <MatrixTable
        id="axes"
        eyebrow="Dependency order"
        title="The six configuration axes, in dependency order"
        lede="These are decided in order, because each constrains the next. Working the chain backwards — from a preferred cooling method or a preferred site — is the most common way a configuration fails to close."
        field="deploy"
        head={["Axis", "Decision", "What is chosen", "Downstream consequence"]}
        rows={AXES.map(([code, name, choice, consequence]) => [
          <span key={code} className="pill">
            {code}
          </span>,
          <span key={`${code}-n`} style={{ color: "var(--ink-strong)", fontWeight: 500 }}>
            {name}
          </span>,
          choice,
          consequence,
        ])}
      />

      {/* 6 · SITE INTERFACES — canvas, four boundary cards */}
      <CardGrid
        id="interfaces"
        eyebrow="CFG-05"
        title="Site interfaces: where a standard unit meets a non-standard world"
        lede="A standardized unit has exactly four boundaries, and configuring them is most of the remaining engineering."
        surface="canvas"
        columns={4}
        items={[
          {
            code: "ELECTRICAL",
            title: "Service, ownership, harmonics",
            body: (
              <>
                On the electrical side the specification states the service arrangement, transformer
                ownership, protection coordination, and who owns harmonic performance at the point of
                common coupling — IEEE 519 sets the limits rectifier-heavy loads are judged against.
                <Cite n={6} /> The{" "}
                <Link href="/engineering/data-center-power-architecture" style={link}>
                  power architecture
                </Link>{" "}
                page describes what sits on the unit side of that boundary.
              </>
            ),
          },
          {
            code: "NETWORK",
            title: "Demarcation, media, port speeds",
            body: (
              <>
                On the network side, the freeze names the demarcation point, media type, port speeds,
                and cross-connect ownership. TIA-942 supplies the vocabulary for entrance rooms,
                pathways, and cross-connects that site agreements are written in,
                <Cite n={7} /> while IEEE 802.3df defines the 400 and 800 Gb/s Ethernet layers now
                common on AI fabrics — and their very different copper, multimode, and single-mode
                reach classes, which is really a question about where the unit can sit relative to the
                meet-me point.<Cite n={8} /> See{" "}
                <Link href="/engineering/networking-fiber" style={link}>
                  networking and fiber
                </Link>{" "}
                for the fabric side.
              </>
            ),
          },
          {
            code: "THERMAL",
            title: "Heat rejection and clearances",
            body: <>The thermal boundary is the heat-rejection equipment and its clearances.</>,
          },
          {
            code: "PHYSICAL",
            title: "Pad, anchorage, access route",
            body: (
              <>
                The physical boundary is the pad, anchorage, access route, and the enclosure rating
                the site&apos;s exposure demands, for which the IP code is the usual shorthand.
                <Cite n={10} /> The route is a hard constraint, not a formality: federal standards fix
                the National Network width at 102 inches and cap interstate gross vehicle weight at
                80,000 pounds.<Cite n={12} />
              </>
            ),
          },
        ]}
      />

      {/* 7 · FREEZE CHECKLIST — paper, wide */}
      <MatrixTable
        id="freeze"
        eyebrow="Acceptance criteria"
        title="The configuration freeze checklist"
        lede="A freeze is complete when every line below has a stated answer and a named owner. An open line is not a detail for later — it is a change order waiting to happen after procurement has started."
        head={["#", "What must be answered, and owned, before the freeze is signed"]}
        rows={FREEZE_CHECKLIST.map((item, i) => [
          <span key={item.slice(0, 28)} className="pill">
            {String(i + 1).padStart(2, "0")}
          </span>,
          item,
        ])}
      />

      {/* 8 · INK BEAT */}
      <QuoteMetric
        quote="A freeze is complete when every line has a stated answer and a named owner. An open line is a change order waiting to happen after procurement has started."
        attribution="PODOS AI Engineering · configuration freeze"
        metric="11"
        label="Lines that must close before signature"
        field="deploy"
      />

      {/* 9 · PODOS APPLICATION — paper (light surface after the ink band) */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="In the product" title="How PODOS runs stage 02" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The site-side half of this list is worked in stage 01; the{" "}
            <Link href="/resources/data-center-readiness-checklist" style={link}>
              data center readiness checklist
            </Link>{" "}
            covers it in detail, and unfamiliar terms are defined in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={link}>
              AI infrastructure glossary
            </Link>
            . Finally, the operating model decides what telemetry leaves the unit and in what form;
            Redfish is the vendor-neutral out-of-band model most{" "}
            <Link href="/engineering/monitoring-controls" style={link}>
              monitoring and controls
            </Link>{" "}
            integrations are built against.<Cite n={11} />
          </p>
          <p>
            PODOS keeps the architecture fixed so the menu can stay short. Each{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with the enclosure,
            closed-loop direct-to-chip cooling, and power distribution identical from unit to unit.
            Configuration therefore selects the accelerator family, the heat-rejection option, the
            service and network arrangements at the boundary, and the operating model — nothing
            structural. Holding the architecture constant is what makes the calendar predictable
            enough that PODOS{" "}
            <span data-claim="deployment-window">
              targets a 90-day window from order to commissioning
            </span>{" "}
            for a standard unit.
          </p>
          <p>
            To work the axes above as a live selection, use the{" "}
            <Link href="/configure" style={link}>
              configurator
            </Link>
            . It walks the same order — profile, accelerators, density, cooling, site interfaces —
            and produces the outline a configuration freeze is written from.
          </p>
        </div>
      </ProseWithRail>

      {/* 10 · LIMITS — mandatory, canvas */}
      <LimitsBlock
        title="When configuration engineering is not the right fit"
        lede="A bounded configuration menu is an advantage only when the requirement fits inside it. It does not, in these cases:"
        items={[
          "The requirement is genuinely unknown. If the workload is still being discovered, freezing early gives a precise answer to the wrong question. Rent capacity, learn the load, then configure.",
          "The design must leave the fixed architecture. A non-standard enclosure geometry, a bespoke rack pitch, or a cooling topology outside the platform's options is a design project and should be priced as one.",
          "A single scale-up domain exceeds what one unit holds. When a model needs more tightly-coupled accelerators than a unit carries, the interconnect topology between units becomes the primary design problem.",
          "The binding constraint is upstream. Configuration cannot shorten an interconnect queue, resolve a zoning dispute, or create water rights. If the site is the constraint, stage 01 owns the calendar.",
          "The jurisdiction has no off-site construction path. Where the authority having jurisdiction will not accept factory inspection in lieu of site inspection, a site-built comparison deserves a fair hearing.",
        ]}
      />

      {/* 11 · FAQ — paper */}
      <FAQBlock items={FAQ} surface="paper" />

      {/* 12 · SOURCES — canvas */}
      <Section surface="canvas" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED — paper; previous and next stage keep the chain intact */}
      <RelatedRail
        title="Continue the chain"
        surface="paper"
        items={[
          {
            href: "/deploy/site-power-readiness",
            label: "DP-01 · PREVIOUS",
            title: "Site and power readiness",
          },
          {
            href: "/deploy/factory-build-testing",
            label: "DP-03 · NEXT",
            title: "Factory build and testing",
          },
          { href: "/deploy", label: "OVERVIEW", title: "The six-stage deployment model" },
          {
            href: "/resources/data-center-readiness-checklist",
            label: "RESOURCE",
            title: "Data center readiness checklist",
          },
        ]}
      />

      {/* 14 · CTA — ink */}
      <CTABand
        title="Work the six axes as a"
        accent="live selection"
        body="Start from the workload profile and let each axis constrain the next. The configurator produces the outline a configuration freeze is written from."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy", label: "See the deployment model" }}
        field="deploy"
      />
    </main>
  );
}
