/**
 * /engineering/high-density-gpu-infrastructure — Archetype A, engineering
 * deep dive. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, zero client JS. Composed entirely from the section
 * library (src/components/seo/sections.tsx) — 14 sections, 12 distinct
 * types, full paper/canvas rotation with one ink beat and an ink CTA.
 *
 * This page ships NO photography, so the hero is HeroEditorial rather
 * than HeroSplit: the density ladder and the readiness checklist carry
 * it. External numbers cite docs/seo/source-register.md; company claims
 * render only from claims.ts publishable entries with their required
 * qualifiers. No product limits are published here — densities, weights,
 * and clearances are discussed as industry practice.
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
  DataFigure,
  ProseWithRail,
  QuoteMetric,
  CardGrid,
  MatrixTable,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/engineering/high-density-gpu-infrastructure";
const TITLE = "High-Density GPU Infrastructure: Designing the Rack";
const DESCRIPTION =
  "How high-density GPU racks are designed: power delivery per rack, cooling matched to the load, network fabric, service clearances, and floor loading.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Global Data Center Survey 2025 (800+ operator respondents)",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
  {
    n: 2,
    name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9)",
    publisher: "ASHRAE",
    url: "https://www.ashrae.org",
    date: "2021",
  },
  {
    n: 3,
    name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)",
    publisher: "ASHRAE TC 9.9",
    url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf",
    date: "c. 2021",
  },
  {
    n: 4,
    name: "GB200 NVL72 product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    date: "spec page, accessed 2026-08-31",
  },
  {
    n: 5,
    name: "Cooling Environments Project (cold plate, CDU, rear-door HX, heat reuse)",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/projects/cooling-environments",
    date: "ongoing",
  },
  {
    n: 6,
    name: "ACS Liquid Cooling Cold Plate Requirements, Rev 1.0",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/documents/ocp-acs-liquid-cooling-cold-plate-requirements-pdf",
  },
  {
    n: 7,
    name: "OAI System Liquid Cooling Guidelines",
    publisher: "Open Compute Project",
    url: "https://www.opencompute.org/documents/oai-system-liquid-cooling-guidelines-in-ocp-template-mar-3-2023-update-pdf",
    date: "Mar 2023",
  },
  {
    n: 8,
    name: "Liquid in the Rack: Liquid Cooling Your Data Center (NREL presentation)",
    publisher: "LBNL / NREL (U.S. Department of Energy)",
    url: "https://datacenters.lbl.gov/sites/default/files/Liquid_Cooling_Your_Data_Center-NREL-EE.pdf",
  },
  {
    n: 9,
    name: "NFPA 70 — National Electrical Code",
    publisher: "NFPA (publisher catalog)",
    url: "https://www.nfpa.org",
    date: "current edition",
  },
  {
    n: 10,
    name: "NFPA 75 — Standard for the Fire Protection of Information Technology Equipment",
    publisher: "NFPA (publisher catalog)",
    url: "https://www.nfpa.org",
    date: "2024 ed.",
  },
  {
    n: 11,
    name: "IEEE 3006 series — Power Systems Reliability for industrial and commercial facilities",
    publisher: "IEEE",
    url: "https://standards.ieee.org/ieee/3006.1/7391/",
    date: "2013–2018 per part",
  },
];

/* FAQ — visible copy and FAQJsonLd share these exact strings. */
const FAQ = [
  {
    q: "What counts as a high-density rack?",
    a: "There is no standards-body threshold. In practice a rack is treated as high density once its sustained load exceeds what conventional room air handling can serve at the aisle, which is why the term tracks cooling method more than a specific kilowatt number. Uptime Institute's 2025 survey of more than 800 operators shows fleet-wide densities climbing into the 10-30 kW band, while accelerator racks sold today ship liquid-cooled well above it.",
  },
  {
    q: "Can a high-density GPU rack be air cooled?",
    a: "Up to a point, and the point is economic rather than physical. Air needs large temperature differences and high fan power to move meaningful energy, so as density rises the fan energy, aisle airflow, and floor area needed per rack all grow faster than the compute does. Vendors of the densest accelerator racks now ship them liquid-cooled rather than offering an air-cooled variant.",
  },
  {
    q: "How much does a fully populated liquid-cooled rack weigh?",
    a: "Enough that it must be checked against the structure, not assumed. Accelerator chassis, busway, manifolds, and the coolant charge all add mass in a footprint smaller than a legacy rack, so the governing number is usually the point load under the casters or leveling feet rather than the distributed floor rating. Confirm both against the manufacturer's published weight and a structural review of the specific slab or raised floor.",
  },
  {
    q: "Does high density reduce total facility power?",
    a: "No. Consolidating the same compute into fewer racks shortens cable runs and can cut fan and pump energy, but the silicon draws what it draws. Density changes where the heat appears and how efficiently it is removed; it does not change the IT load itself.",
  },
];

/* Density regimes — qualitative design bands, not standards thresholds. */
const REGIMES: [string, string, string, string][] = [
  [
    "HD-01",
    "Conventional enterprise racks",
    "Room or in-row air handling with contained aisles; standard single- or dual-corded rack PDUs.",
    "Floor area and aisle airflow, not the rack itself. Structural and clearance rules are the legacy ones.",
  ],
  [
    "HD-02",
    "Dense air, contained",
    "Containment becomes mandatory; blanking panels, aisle pressure control, and ASHRAE class discipline decide whether the room holds.",
    "Fan energy and inlet temperature spread across the rack face; hot spots at the top of the rack.",
  ],
  [
    "HD-03",
    "Air-assist transition",
    "Rear-door heat exchangers or in-row liquid-to-air units move heat into water without touching the server internals.",
    "Facility water availability and floor space for the exchanger; a retrofit path more than a destination.",
  ],
  [
    "HD-04",
    "Direct-to-chip liquid",
    "Cold plates on GPUs and CPUs, rack manifolds, quick disconnects, and a CDU; a residual air path stays for everything the plates do not touch.",
    "Coolant chemistry and flow balancing become operations disciplines; leak detection and isolation are engineered, not optional.",
  ],
  [
    "HD-05",
    "Rack-scale accelerator systems",
    "Vendor-integrated liquid-cooled racks that behave as one machine rather than a shelf of servers.",
    "The rack is now a single procurement, power, cooling, and service unit — partial population and mixed vendors get harder.",
  ],
];

/* Pre-installation readiness checklist. */
const READINESS: [string, string, string, string][] = [
  [
    "R-01",
    "Power",
    "Per-rack circuit topology, phase balance across the rack face, and overcurrent sizing for continuous load.",
    "Breakers sized to nameplate rather than to code continuous-load rules trip under sustained training runs.",
  ],
  [
    "R-02",
    "Power",
    "Redundancy intent: dual feed to the rack, single feed with restartable jobs, or something in between.",
    "Redundancy assumed at the rack but absent upstream — the failure mode IEEE 3006 reliability analysis exists to expose.",
  ],
  [
    "R-03",
    "Cooling",
    "Cooling capacity matched to the actual sustained rack load, with the residual air fraction sized separately.",
    "Cold plates carry the GPUs while regulators, drives, and PSUs overheat in an under-sized air path.",
  ],
  [
    "R-04",
    "Cooling",
    "Facility water supply temperature and flow against the class the IT hardware accepts.",
    "A loop too cold risks condensation; too warm and the plates cannot hold junction temperature at full load.",
  ],
  [
    "R-05",
    "Fabric",
    "Cable plant sized for the east-west topology, including bend radius, tray fill, and optics reach.",
    "Cable bulk blocks the rear service access the liquid manifolds need.",
  ],
  [
    "R-06",
    "Fabric",
    "Placement of the switching tier relative to the compute racks and the reach budget that implies.",
    "Topology decided after the floor plan, forcing longer, more expensive optics or an extra hop.",
  ],
  [
    "R-07",
    "Clearance",
    "Front and rear service envelopes, door swing, and the working space electrical code requires in front of energized gear.",
    "A rack that fits the floor plan but cannot legally or physically be serviced in place.",
  ],
  [
    "R-08",
    "Clearance",
    "Overhead zone allocation between busway, cable tray, piping, and fire protection.",
    "Two trades designing into the same overhead volume; discovered during installation, not design.",
  ],
  [
    "R-09",
    "Structure",
    "Distributed floor load and the point load under casters or leveling feet, against the rated structure.",
    "A slab or raised floor that passes on average and fails under a single foot.",
  ],
  [
    "R-10",
    "Structure",
    "The delivery path: dock height, door widths, corridor turns, elevator capacity, and ramp angles.",
    "Equipment that clears the room but not the route to it.",
  ],
];

/* Limitations — when high density is the wrong answer. */
const LIMITS = [
  "The workload does not need adjacency. Density earns its cost when jobs span many GPUs and depend on low-latency interconnect. Embarrassingly parallel or storage-bound work runs perfectly well at conventional density and cheaper.",
  "The building cannot take the load. Older shells with limited structural capacity, no facility water, or a fixed electrical service will consume more in retrofit than the density saves.",
  "The operations team has no liquid experience. A liquid loop is an industrial system with chemistry, filtration, and leak procedures. Without trained staff or a service contract, density transfers risk from the design to the operator.",
  "Growth is uncertain. Concentrating capacity into a small number of very large racks makes the increment coarse: the next unit of capacity is a whole rack, not a shelf.",
  "Availability targets exceed the design. Uptime Institute's survey work continues to find outages a routine industry experience; density concentrates the consequence of a single rack-level fault, so the availability strategy has to be decided before the density is.",
];

const TOC: [string, string][] = [
  ["#definition", "Why density"],
  ["#regimes", "Density regimes"],
  ["#cooling", "Cooling and envelope"],
  ["#fabric", "Network fabric"],
  ["#readiness", "Readiness checklist"],
  ["#limitations", "Honest limits"],
  ["#faq", "FAQ"],
];

export default function HighDensityGpuInfrastructurePage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="High-density GPU infrastructure, rack by rack"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — editorial (this page ships no photography) */}
      <HeroEditorial
        category="Engineering · Density"
        title="High-density GPU infrastructure,"
        accent="rack by rack"
        lede="High-density GPU infrastructure is the practice of concentrating accelerated compute into racks whose sustained load exceeds what conventional room air cooling can serve — and then redesigning power delivery, heat removal, network fabric, clearances, and floor loading around that concentration. Density is not a specification you buy; it is the constraint set that every other decision in the room has to satisfy at once."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Engineering", path: "/engineering" },
              { name: "High-density GPU infrastructure", path: PATH },
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
          { value: "5", label: "Density design regimes" },
          { value: "10", label: "Site readiness checks" },
          { value: "11", label: "Standards and sources cited" },
        ]}
      />

      {/* 2 · SUMMARY — canvas */}
      <SummaryBand
        title="What you need to know"
        items={[
          {
            code: "01",
            title: "Density is a constraint set, not a spec",
            body:
              "Concentrating accelerated compute redraws power delivery, heat removal, fabric, clearance, and floor loading at the same time.",
          },
          {
            code: "02",
            title: "The hardware moved first",
            body: (
              <>
                Vendors now ship rack-scale accelerator systems liquid-cooled, while fleet-wide
                densities are still climbing into the 10–30 kW band.
                <Cite n={1} />
              </>
            ),
          },
          {
            code: "03",
            title: "Cooling method follows density",
            body:
              "Once the sustained load is fixed the cooling approach is implied rather than chosen — and every liquid design keeps a residual air path.",
          },
          {
            code: "04",
            title: "Weight stops more projects than heat",
            body:
              "The governing number is usually the point load under a caster, not the distributed floor rating — and the delivery route gets checked last.",
          },
        ]}
      />

      {/* 3 · WHY DENSITY + POWER — prose with a TOC rail */}
      <ProseWithRail
        id="definition"
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
        <SectionHead eyebrow="The pull and the push" title="Why density became the design driver" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Training and inference clusters are latency-sensitive in a way general enterprise
            workloads are not. Accelerators that must exchange gradients or activations every few
            milliseconds pay for every metre of cable between them, so the fastest way to build a
            coherent machine is to put more of it in less space. That is the pull. The push is
            hardware: vendors now ship rack-scale accelerator systems as single liquid-cooled units
            — NVIDIA&apos;s GB200 NVL72, for example, places 72 GPUs and 36 CPUs in one rack acting
            as a single NVLink domain, and ships it liquid-cooled rather than offering an air
            variant.<Cite n={4} />
          </p>
          <p>
            The installed base is moving more slowly than the hardware. Uptime Institute&apos;s
            2025 survey of more than 800 operators shows rack densities rising into the 10–30 kW
            band fleet-wide<Cite n={1} /> — well below what a modern accelerator rack demands. That
            gap is the whole problem: most existing rooms were designed for an airflow regime that
            the newest hardware has already left, and ASHRAE&apos;s TC 9.9 committee published a
            dedicated white paper on why liquid cooling is expanding into mainstream facilities for
            exactly this reason.<Cite n={3} />
          </p>
        </div>

        <div style={{ marginTop: "3rem" }} id="power">
          <SectionHead eyebrow="Electrical" title="Power delivery per rack" />
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            At conventional density a rack is fed by whips from a floor PDU and nobody thinks hard
            about it. At high density the rack becomes a small electrical room. Three practical
            things change. First, the feed moves from cord-and-receptacle distribution toward
            overhead busway or dedicated panel feeds, because the conductor count and ampacity stop
            fitting under a floor. Second, phase balance becomes a per-rack concern rather than a
            per-row one: an accelerator rack draws a flat, high, sustained load, so imbalance shows
            up as heat and neutral current instead of averaging out. Third, overcurrent devices and
            conductors must be sized for continuous operation under the National Electrical Code,
            not for a nameplate peak the equipment never returns from.<Cite n={9} />
          </p>
          <p>
            Redundancy has to be decided explicitly, because AI workloads split into two very
            different populations. Control planes, storage, and network fabric behave like classic
            critical load and justify concurrent-maintainable topology. Training jobs are
            checkpointed and restartable, so some operators accept a single path to the compute
            rack and spend the capital on capacity instead. Either choice is defensible; what is
            not defensible is assuming rack-level redundancy that the upstream distribution does
            not actually provide — the class of error the IEEE 3006 reliability-analysis series
            exists to surface.<Cite n={11} /> The upstream chain that feeds all of this is covered
            in{" "}
            <Link href="/engineering/data-center-power-architecture" style={link}>
              data center power architecture
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 4 · DENSITY REGIMES — canvas, wide figure */}
      <DataFigure
        id="regimes"
        surface="canvas"
        width="wide"
        field="power"
        eyebrow="The ladder"
        title="What changes as density climbs"
        lede="Density is best read as a sequence of design regimes rather than a number. Each step changes the cooling method, and each cooling method drags a different constraint to the front of the review."
      >
        <div className="tblwrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th>Regime</th>
                <th>Typical cooling approach</th>
                <th>Constraint that dominates</th>
              </tr>
            </thead>
            <tbody>
              {REGIMES.map(([code, name, approach, constraint]) => (
                <tr key={code}>
                  <td>
                    <span className="pill">{code}</span>
                  </td>
                  <td>{name}</td>
                  <td>{approach}</td>
                  <td>{constraint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.85rem",
            lineHeight: 1.65,
            color: "var(--ink-faint)",
            maxWidth: "70ch",
          }}
        >
          Regime boundaries are engineering conventions, not thresholds published by a standards
          body. The only fleet-wide measurement referenced above is Uptime Institute&apos;s
          10–30 kW density band.<Cite n={1} />
        </p>
      </DataFigure>

      {/* 5 · COOLING + PHYSICAL ENVELOPE — prose, paper */}
      <ProseWithRail id="cooling" surface="paper">
        <SectionHead eyebrow="Thermal" title="Matching cooling to the load" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The cooling method is not a free choice once density is fixed — it is implied by it.
            ASHRAE&apos;s thermal guidelines define the air classes IT vendors design to, along
            with a high-density air class and facility water classes for liquid-cooled equipment;
            the class the hardware accepts sets the supply temperature the facility has to
            deliver.<Cite n={2} /> Below the air ceiling, the work is containment discipline:
            blanking panels, aisle pressure, and inlet temperature uniformity across the full rack
            face. Above it, heat has to move into liquid, either at the rack door with a rear-door
            heat exchanger or at the die with cold plates. The Open Compute Project maintains
            vendor-neutral requirements across that whole range — cold plates, CDUs, rear-door
            exchangers, and heat reuse — so a loop can serve hardware from more than one
            vendor.<Cite n={5} />
            <Cite n={6} /> Its accelerator-infrastructure guidelines address multi-GPU systems
            specifically.<Cite n={7} />
          </p>
          <p>
            The detail most often missed at design time is the residual air fraction. Cold plates
            capture heat only from the components they contact; voltage regulators, drives, NICs,
            and power supplies still reject heat to air. A high-density room therefore runs two
            cooling systems, and the smaller one still has to be engineered rather than inherited.
            Federal-lab guidance on liquid cooling in the rack treats this dual path — and the
            retrofit sequencing it implies — as standard practice.<Cite n={8} /> The loop itself is
            covered in detail in{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
              direct-to-chip liquid cooling
            </Link>
            .
          </p>
        </div>

        <div style={{ marginTop: "3rem" }} id="envelope">
          <SectionHead eyebrow="Physical envelope" title="Clearances, weight, and floor loading" />
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            High density compresses compute into a smaller footprint but does not compress the
            space around it. Service envelopes grow rather than shrink: a liquid-cooled rack needs
            rear access for manifolds and couplings, front access for chassis service, room for
            door swing, and the working space electrical code requires in front of equipment likely
            to be examined while energized.<Cite n={9} /> The overhead zone is equally contested —
            busway, cable tray, piping, and fire protection all want the same volume, and NFPA 75
            governs the fire-protection design of the IT equipment area itself.<Cite n={10} /> A
            layout that satisfies the floor plan and fails the overhead section is a common and
            expensive discovery.
          </p>
          <p>
            Weight is the constraint most often checked last and most likely to stop a project.
            Accelerator chassis, busway, manifolds, and the coolant charge concentrate mass into a
            footprint no larger than a legacy rack, and the governing figure is usually not the
            distributed floor rating but the point load under each caster or leveling foot. Raised
            floors have both a rated distributed load and a rated point load, and the second is
            what fails first. Two checks belong in every high-density design review: the structural
            capacity of the specific slab or raised floor against the manufacturer&apos;s published
            weights, and the delivery route — dock height, door widths, corridor turns, elevator
            capacity, ramp angles — from the truck to the final position. Seismic anchoring
            requirements, where local code imposes them, are a third.
          </p>
        </div>
      </ProseWithRail>

      {/* 6 · INK BEAT */}
      <QuoteMetric
        quote="Cold plates capture heat only from the components they contact — so a high-density room always runs two cooling systems, and the smaller one still has to be engineered rather than inherited."
        attribution="PODOS AI Engineering · the residual air fraction"
        metric="2"
        label="Cooling systems in a dense room"
        field="power"
      />

      {/* 7 · NETWORK FABRIC — canvas cards (ink must be followed by light) */}
      <CardGrid
        id="fabric"
        surface="canvas"
        field="network"
        columns={2}
        eyebrow="Interconnect"
        title="Network fabric at density"
        lede="Three physical consequences follow, and all three are decided by the floor plan. Fabric layout, cooling layout, and service access are one design problem, and separating them is how rooms end up unserviceable."
        items={[
          {
            code: "NF-00",
            title: "The traffic pattern changes first",
            body: (
              <>
                Concentrating GPUs changes the traffic pattern before it changes anything else. Most
                of the bandwidth in an AI cluster is east-west — accelerator to accelerator — rather
                than north-south to users, so the fabric is designed around collective operations
                and tail latency, not aggregate throughput. Vendor rack-scale systems push this to
                its conclusion by making an entire rack one coherent interconnect domain.
                <Cite n={4} />
              </>
            ),
          },
          {
            code: "NF-01",
            title: "Reach",
            body:
              "The distance between compute racks and the switching tier sets whether links land on direct-attach copper, active copper, or optics, and optics are both a cost and a failure population.",
          },
          {
            code: "NF-02",
            title: "Cable mass and bend radius",
            body:
              "High-radix fabrics put a very large number of terminations at the back of the rack, exactly where liquid manifolds and quick disconnects also live.",
          },
          {
            code: "NF-03",
            title: "Airflow",
            body:
              "A dense rear cable bundle in an air-assisted regime is a thermal obstruction, not just an aesthetic one.",
          },
        ]}
      />

      {/* 8 · READINESS MATRIX — paper, wide */}
      <MatrixTable
        id="readiness"
        surface="paper"
        field="deploy"
        eyebrow="Before install"
        title="Site readiness checklist for a high-density rack"
        lede="Ten items, in the order an engineering review tends to reach them. Each one has a specific failure mode when it is assumed instead of confirmed."
        head={["#", "Domain", "Confirm before install", "Failure mode if assumed"]}
        rows={READINESS.map(([code, domain, confirm, failure]) => [
          <span key={code} className="pill">
            {code}
          </span>,
          domain,
          confirm,
          failure,
        ])}
      />

      {/* 9 · LIMITS — mandatory, canvas */}
      <LimitsBlock
        title="When high density is not the right answer"
        lede="Density is a means, not a goal. There are cases where the honest recommendation is to build wider rather than denser."
        items={LIMITS}
      />

      {/* 10 · PODOS APPLICATION — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead
          eyebrow="In the product"
          title="How PODOS handles the density constraint set"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The list above is long because, in a conventional build, each item is resolved by a
            different party at a different time. PODOS moves the resolution into the factory. Each{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with power
            distribution, closed-loop liquid cooling, rack structure, and network paths engineered
            together as one enclosure rather than negotiated across trades on a site. Because the
            structural, clearance, and cooling relationships are fixed and tested before shipment,
            the site work reduces to the interfaces — service, water or heat rejection, and fibre —
            which is why PODOS{" "}
            <span data-claim="deployment-window">targets a 90-day window from order to commissioning</span>{" "}
            for a standard unit.
          </p>
          <p>
            The same reasoning runs through the rest of the{" "}
            <Link href="/platform" style={link}>
              platform
            </Link>
            , the{" "}
            <Link href="/deploy" style={link}>
              deployment model
            </Link>
            , and the{" "}
            <Link href="/use-cases" style={link}>
              workloads these units are built for
            </Link>
            . For the build-versus-buy framing, see{" "}
            <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={link}>
              modular vs traditional AI data centers
            </Link>
            ; terms used above are defined in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={link}>
              AI infrastructure glossary
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 11 · FAQ — canvas */}
      <FAQBlock items={FAQ} surface="canvas" />

      {/* 12 · SOURCES */}
      <Section surface="paper" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 13 · RELATED */}
      <RelatedRail
        title="Adjacent systems"
        items={[
          {
            href: "/engineering/direct-to-chip-liquid-cooling",
            label: "ENGINEERING",
            title: "Direct-to-chip liquid cooling",
          },
          {
            href: "/engineering/data-center-power-architecture",
            label: "ENGINEERING",
            title: "Data center power architecture",
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

      {/* 14 · CTA */}
      <CTABand
        title="Bring your density target to"
        accent="engineering"
        body="Send the sustained rack load, the building constraints, and the growth increment. Engineering will tell you what a pod-based build looks like there."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy", label: "See the deployment model" }}
        field="power"
      />
    </main>
  );
}
