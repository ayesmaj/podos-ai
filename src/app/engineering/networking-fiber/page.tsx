/**
 * /engineering/networking-fiber — Archetype A, engineering deep dive
 * (ENG-05). See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, zero client JS. Composed entirely from the section
 * library (src/components/seo/sections.tsx). The page carries no
 * dedicated imagery, so the hero is editorial and every visual moment is
 * typographic — tables, cards, and one ink beat. All external numbers
 * cite the source register or primary sources verified 2026-08-31;
 * company claims render only from claims.ts publishable entries with
 * their required qualifiers, carried through as data-claim.
 * Non-confidential level — no PODOS-specific port counts, topologies, or
 * vendor detail.
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
  ProseWithRail,
  MatrixTable,
  QuoteMetric,
  CardGrid,
  LimitsBlock,
  FAQBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/engineering/networking-fiber";
const TITLE = "AI Data Center Network Architecture: Fiber and Leaf-Spine";
const DESCRIPTION =
  "AI data-center networking explained: fiber entry, leaf-spine fabrics, scale-up vs scale-out, east-west traffic in training vs inference, redundancy, monitoring.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

const SOURCES: Source[] = [
  {
    n: 1,
    name: "RoCE networks for distributed AI training at scale (companion to the ACM SIGCOMM 2024 paper)",
    publisher: "Meta Engineering",
    url: "https://engineering.fb.com/2024/08/05/data-center-engineering/roce-network-distributed-ai-training-at-scale/",
    date: "5 Aug 2024",
  },
  {
    n: 2,
    name: "Ultra Ethernet Specification 1.0 (announcement)",
    publisher: "Ultra Ethernet Consortium",
    url: "https://ultraethernet.org/ultra-ethernet-consortium-uec-launches-specification-1-0-transforming-ethernet-for-ai-and-hpc-at-scale/",
    date: "Jun 2025",
  },
  {
    n: 3,
    name: "Jupiter Evolving: Transforming Google's Datacenter Network via Optical Circuit Switches and Software-Defined Networking (ACM SIGCOMM 2022)",
    publisher: "Google Research",
    url: "https://research.google/pubs/jupiter-evolving-transforming-googles-datacenter-network-via-optical-circuit-switches-and-software-defined-networking/",
    date: "2022",
  },
  {
    n: 4,
    name: "IEEE Std 802.3df-2024 — Ethernet Amendment 9: 800 Gb/s MAC and 400/800 Gb/s physical layers",
    publisher: "IEEE SA",
    url: "https://standards.ieee.org/ieee/802.3df/11107/",
    date: "approved Feb 2024",
  },
  {
    n: 5,
    name: "ANSI/TIA-942 Telecommunications Infrastructure Standard for Data Centers (revision C)",
    publisher: "Telecommunications Industry Association",
    url: "https://tiaonline.org/products-and-services/tia942certification/ansi-tia-942-standard/",
    date: "revision C, accessed 2026-08-31",
  },
  {
    n: 6,
    name: "NVLink and NVLink Switch product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/nvlink/",
    date: "accessed 2026-08-31",
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
    name: "Global Data Center Survey 2025 (800+ operator respondents)",
    publisher: "Uptime Institute",
    url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025",
    date: "Jul 2025",
  },
];

/* FAQ — the SAME array feeds visible markup and FAQJsonLd. */
const FAQ = [
  {
    q: "What is east-west traffic in an AI data center?",
    a: "East-west traffic is machine-to-machine traffic inside the facility, as opposed to north-south traffic between the facility and the outside world. In AI clusters it dominates: training synchronises gradients across every participating GPU on every step, so the volume moving between racks dwarfs anything crossing the external uplink.",
  },
  {
    q: "What is the difference between scale-up and scale-out networking?",
    a: "Scale-up is the very high bandwidth fabric binding accelerators inside a node or rack into one domain — NVLink and its switch chips are the current example. Scale-out is the fabric between racks, on Ethernet or InfiniBand. Scale-up bandwidth per GPU is far higher, so schedulers keep tightly coupled parallelism inside one scale-up domain where they can.",
  },
  {
    q: "Why is single-mode fiber used instead of copper inside AI clusters?",
    a: "Copper direct-attach cables are cheaper and lower power, but at the lane rates current 400G and 800G optics run at, copper reach shrinks to a few metres, which confines it to intra-rack links. Anything crossing a rack or a row needs optics, and single-mode fiber carries those distances without the reach penalty multimode hits as lane rates climb.",
  },
  {
    q: "How much oversubscription is acceptable in an AI backend fabric?",
    a: "For the backend fabric carrying collectives the target is normally non-blocking, because a collective runs at the speed of its slowest path and oversubscription becomes a tax on every training step. Frontend, storage, and management networks are routinely oversubscribed, because their traffic tolerates queueing.",
  },
];

/* Network planes: [code, plane, carries, if it degrades] */
const PLANES: [string, string, string, string][] = [
  [
    "NET-01",
    "Scale-up fabric",
    "All-to-all accelerator traffic inside one rack-scale domain.",
    "The domain loses most of its throughput; jobs stall.",
  ],
  [
    "NET-02",
    "Scale-out backend",
    "Collectives between racks; pipeline stage handoffs.",
    "Step time rises for every rank, not just one.",
  ],
  [
    "NET-03",
    "Frontend and storage",
    "Dataset reads, checkpoint writes, images, inference requests.",
    "Data loaders starve GPUs; checkpoints land late.",
  ],
  [
    "NET-04",
    "Out-of-band management",
    "BMC and console access, firmware, sensor telemetry.",
    "Operators lose remote hands when they most need them.",
  ],
  [
    "NET-05",
    "External uplinks",
    "Carrier transit, peering, remote operations, data ingress.",
    "The site is unreachable while still computing.",
  ],
];

/* Training vs inference: [dimension, training, inference] */
const TRAFFIC: [string, string, string][] = [
  [
    "Traffic shape",
    "Synchronous bursts — every rank transmits at the end of a step, then quiet.",
    "Continuous and request-driven; smooth in aggregate, spiky per tenant.",
  ],
  [
    "Flow profile",
    "Few very large elephant flows, deeply imbalanced across paths.",
    "Many small flows, plus large KV-cache transfers when disaggregated.",
  ],
  [
    "Primary metric",
    "Step time — the slowest path paces every rank.",
    "Tail latency at a percentile, end to end.",
  ],
  [
    "Loss tolerance",
    "Effectively zero; one retransmit stalls the collective.",
    "Low but non-zero; a request retries without stalling the fleet.",
  ],
  [
    "Failure response",
    "Restart from checkpoint — blast radius is the whole job.",
    "Affected replicas drain; the service degrades, not stops.",
  ],
  [
    "Fabric requirement",
    "Non-blocking backend, careful congestion control, tight failure domains.",
    "Predictable queueing, spike headroom, graceful partial failure.",
  ],
];

/* Design checklist: [n, criterion, what to evaluate, consequence, cite] */
const CHECKLIST: [string, string, string, string, number | null][] = [
  [
    "01",
    "Scale-up domain size",
    "Accelerators bound into one domain, and whether the model fits inside it.",
    "Sets the rack boundary; parallelism that fits never touches the fabric.",
    7,
  ],
  [
    "02",
    "Backend oversubscription",
    "Leaf uplink capacity against accelerator port bandwidth beneath it.",
    "Non-blocking is the default; any ratio above 1:1 is a per-step tax.",
    null,
  ],
  [
    "03",
    "Transport and congestion control",
    "RoCEv2 with PFC/ECN tuning, InfiniBand, or an Ultra Ethernet path.",
    "Sets behaviour under incast — the most operationally sensitive choice here.",
    2,
  ],
  [
    "04",
    "Media and lane rate",
    "Copper reach in-rack versus optics between racks; breakout plans.",
    "Fixes the optics count, which drives capex and component failure rate.",
    4,
  ],
  [
    "05",
    "Cabling discipline",
    "Entrance rooms, pathways, cross-connects, labelling against a standard.",
    "Decides whether the plant is extensible in year five.",
    5,
  ],
  [
    "06",
    "Failure domain sizing",
    "Accelerators one leaf, optic, or feed removes from a running job.",
    "Blast radius sets the checkpoint interval, and the cost of a failure.",
    1,
  ],
  [
    "07",
    "Uplink diversity",
    "Two carriers over physically separate entry paths and conduits.",
    "Diversity on paper is not diversity in the ground.",
    null,
  ],
  [
    "08",
    "Telemetry depth",
    "Queue counters, ECN/PFC rates, optical light levels, job-step correlation.",
    "Without correlation a degrading optic reads as a slow model.",
    8,
  ],
];

const LIMITATIONS = [
  "Single-rack and inference-only deployments do not need a dedicated backend fabric. If the work fits in one scale-up domain, a second non-blocking fabric buys operational surface, not throughput.",
  "Lossless Ethernet is a discipline, not a purchase. Badly tuned PFC and ECN produce head-of-line blocking and congestion spreading — worse than a slower fabric nobody tuned.",
  "Optics dominate the failure budget. A high-radix fabric holds more transceivers than any other active component, and they degrade gradually rather than fail cleanly.",
  "Prefabricated units constrain topology. Cable lengths and cross-unit port counts are fixed at the factory, so multi-unit topologies are planned before manufacture, not patched in the field.",
  "Standards are still moving. Ultra Ethernet 1.0 is recent; multi-vendor interoperability is something to test on real hardware rather than assume.",
];

const TOC: [string, string][] = [
  ["#planes", "The planes"],
  ["#fabric-planes", "Plane reference"],
  ["#east-west", "East-west traffic"],
  ["#operations", "In operation"],
  ["#checklist", "Design checklist"],
  ["#limitations", "Honest limits"],
  ["#podos", "In the product"],
  ["#faq", "FAQ"],
];

const PLANE_ROWS: ReactNode[][] = PLANES.map(([code, plane, carries, degrades]) => [
  <span key={code} className="pill">
    {code}
  </span>,
  plane,
  carries,
  degrades,
]);

const TRAFFIC_ROWS: ReactNode[][] = TRAFFIC.map(([dim, train, infer]) => [dim, train, infer]);

const CHECKLIST_ROWS: ReactNode[][] = CHECKLIST.map(([n, criterion, evaluate, consequence, cite]) => [
  <span key={n} className="pill">
    {n}
  </span>,
  criterion,
  evaluate,
  <>
    {consequence}
    {cite ? <Cite n={cite} /> : null}
  </>,
]);

export default function NetworkingFiberPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="Networking and fiber in an AI data center"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQ} />

      {/* 1 · HERO — editorial (this page carries no dedicated imagery) */}
      <HeroEditorial
        category="Engineering · Networking and fiber"
        title="Networking and fiber in an"
        accent="AI data center"
        lede="An AI data center runs several networks at once, not one. A scale-up fabric binds accelerators inside a rack into a single compute domain, a scale-out backend fabric carries collective traffic between racks, and a separate frontend network handles storage, management, and the outside world. Fiber enters the building at one controlled point and fans out through a leaf-spine fabric — but almost all of the traffic that decides whether GPUs stay busy never leaves the building."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Engineering", path: "/engineering" },
              { name: "Networking and fiber", path: PATH },
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
          { value: "5", label: "Traffic planes, one building" },
          { value: "800G", label: "Ethernet defined by IEEE 802.3df-2024" },
          { value: "72", label: "GPUs in one NVLink domain (NVL72)" },
        ]}
      />

      {/* 2 · SUMMARY — canvas */}
      <SummaryBand
        title="What you need to know"
        items={[
          {
            code: "01",
            title: "Several networks, not one",
            body: "Scale-up inside the rack, scale-out between racks, frontend and storage, out-of-band management, and external uplinks each carry different traffic and fail differently.",
          },
          {
            code: "02",
            title: "Fiber enters at one point",
            body: "Outside-plant fiber terminates in an entrance room and cross-connects into the main distribution area. Two carrier paths in one conduit are one path with two invoices.",
          },
          {
            code: "03",
            title: "Training and inference are opposites",
            body: "Training is synchronous bursts of elephant flows paced by the slowest path; inference is many small flows judged on tail latency. One fabric tuned for both is mediocre at each.",
          },
          {
            code: "04",
            title: "The failure is rarely a link going down",
            body: "It is one optic degrading quietly and slowing every iteration of a job spanning thousands of GPUs — which only telemetry correlated with job metrics can find.",
          },
        ]}
      />

      {/* 3 · CORE EXPLANATION — prose with a sticky TOC rail */}
      <ProseWithRail
        id="planes"
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
          eyebrow="Engineering"
          code="ENG-05"
          title="Four networks in one building"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Enterprise data centers converge onto one general-purpose fabric. AI sites deliberately do
            not. Meta&apos;s published account of its training clusters describes separating GPU
            training onto its own dedicated backend network, because its traffic — bursty,
            load-imbalanced, coordinated across tens of thousands of GPUs for weeks at a time — is
            hostile to anything sharing a fabric with it.<Cite n={1} />
          </p>
        </div>

        <div id="fiber-entry" style={{ marginTop: "3rem", scrollMarginTop: 96 }}>
          <SectionHead title="Fiber entry and the physical plant" />
          <div style={{ marginTop: "1.5rem" }}>
            <p>
              Everything external begins at the entrance facility: outside-plant fiber terminating in
              an entrance room, transitioning to inside-plant cable, cross-connecting into the main
              distribution area. ANSI/TIA-942 — the data-center telecommunications infrastructure
              standard, currently at revision C — defines those spaces, pathways, and redundancy
              topologies.<Cite n={5} /> Two carrier paths sharing one conduit are one path with two
              invoices; real diversity means separate entry points, conduits, and routes off the
              property. Inside, media follows the lane rate rather than taste. IEEE Std 802.3df-2024
              defines 800 Gb/s Ethernet and 400/800 Gb/s physical layers on 100 Gb/s-per-lane
              signalling, with separate copper, multimode, and single-mode variants.<Cite n={4} />{" "}
              Copper direct-attach survives a couple of metres at those lane rates, so it stays inside
              the rack; anything crossing a row runs on fiber, and single-mode dominates because its
              reach does not collapse as lane rates climb.
            </p>
          </div>
        </div>

        <div id="leaf-spine" style={{ marginTop: "3rem", scrollMarginTop: 96 }}>
          <SectionHead title="Leaf-spine: why the fabric looks the way it does" />
          <div style={{ marginTop: "1.5rem" }}>
            <p>
              A leaf-spine fabric is a two-tier Clos topology: every leaf connects to every spine, and
              nothing connects leaf to leaf. Path length is uniform, so any server is the same number
              of hops from any other — which matters when a collective completes only as fast as its
              slowest participant. Load spreads across many equal-cost paths instead of one tree, and
              capacity grows by adding spines rather than replacing a chassis. The pressure point is
              oversubscription: the ratio of bandwidth facing servers to bandwidth facing spines.
              Backend AI fabrics are normally built non-blocking, because a bottleneck between racks is
              paid on every training step for the life of the cluster; frontend and storage planes are
              routinely oversubscribed, because their traffic tolerates queueing.
            </p>
            <p>
              Hyperscale practice has already moved past the flat two-tier picture. Google&apos;s
              Jupiter work replaced a static spine layer with optical circuit switches under
              software-defined control, reporting 5× higher speed and capacity, a 30% capex reduction,
              and a 41% power reduction across the evolution period while serving live traffic.
              <Cite n={3} /> The transferable lesson for a smaller site is not optical switching — it
              is that topology has to be incrementally extensible, because the next hardware generation
              arrives before the building is full.
            </p>
          </div>
        </div>
      </ProseWithRail>

      {/* 4 · PLANE REFERENCE — wide table, canvas */}
      <MatrixTable
        id="fabric-planes"
        eyebrow="Reference"
        title="The planes, and what each one costs when it degrades"
        lede="Five traffic planes share one building. They are separated because their failure modes are not interchangeable."
        surface="canvas"
        field="network"
        head={["Plane", "Scope", "What it carries", "If it degrades"]}
        rows={PLANE_ROWS}
      />

      {/* 5 · INK BEAT */}
      <QuoteMetric
        quote="A collective completes only as fast as its slowest participant — which is why a backend fabric is built non-blocking and every ratio above 1:1 is paid on every training step."
        attribution="PODOS AI Engineering · backend fabric design"
        metric="1:1"
        label="Target backend oversubscription"
        field="network"
      />

      {/* 6 · EAST-WEST — wide table, paper */}
      <MatrixTable
        id="east-west"
        eyebrow="East-west traffic"
        title="Training and inference are different workloads"
        lede="East-west means machine-to-machine traffic inside the facility. It dominates AI sites, but training and inference stress the fabric in opposite ways, and a fabric tuned for one is mediocre at the other."
        surface="paper"
        head={["Dimension", "Distributed training", "Inference serving"]}
        rows={TRAFFIC_ROWS}
      />

      {/* 7 · IN OPERATION — cards, canvas */}
      <CardGrid
        id="operations"
        eyebrow="In operation"
        title="Scale-up boundaries, redundancy, and monitoring"
        lede="Three things decide whether a fabric that looks right on a diagram keeps GPUs busy in production."
        surface="canvas"
        field="network"
        columns={3}
        items={[
          {
            code: "OPS-01",
            title: "Where the scale-up boundary earns its keep",
            body: (
              <>
                NVIDIA describes NVLink as a direct GPU-to-GPU interconnect that scales multi-GPU I/O
                within a server, with NVLink Switch chips extending all-to-all GPU communication across
                the rack<Cite n={6} />; a GB200 NVL72 rack presents 72 GPUs and 36 CPUs as a single
                NVLink domain.<Cite n={7} /> Traffic between racks falls to Ethernet or InfiniBand
                instead. Parallelism that fits inside the scale-up domain never touches the fiber plant;
                parallelism that does not crosses a bandwidth cliff at the rack boundary, which makes
                scheduler placement a networking decision. The transport underneath is meanwhile
                consolidating on Ethernet: the Ultra Ethernet Consortium launched Specification 1.0 in
                June 2025, an RDMA transport for Ethernet and IP specified across NICs, switches,
                optics, and cables so multi-vendor fabrics interoperate without lock-in.<Cite n={2} />
              </>
            ),
          },
          {
            code: "OPS-02",
            title: "Redundancy is failure-domain arithmetic",
            body: (
              <>
                Network redundancy in an AI site is failure-domain arithmetic. Dual-homing servers to
                two leaf switches, running N+1 spines, and feeding paired switches from separate power
                paths all reduce the number of accelerators one component can take out of a running job.
                That number is the design output: it sets how often jobs checkpoint, and therefore what
                a failure costs. The Uptime Institute&apos;s 2025 survey of more than 800 operators
                found roughly half had an impactful outage in the previous three years — redundancy is
                judged on what it contains, not on what is installed.<Cite n={8} />
              </>
            ),
          },
          {
            code: "OPS-03",
            title: "Monitoring has to reach past up and down",
            body: (
              <>
                Monitoring has to reach past up and down: per-queue depth and drop counters, ECN marking
                and PFC pause rates on lossless fabrics, per-lane optical light levels, correctable-error
                counts, fabric-wide path utilisation. Alone these are graphs. They become diagnostic
                when correlated with job metrics — step time, collective completion time, rank
                stragglers — because the characteristic AI failure is not a link going down but one
                degrading optic quietly slowing every iteration of a job spanning thousands of GPUs.
              </>
            ),
          },
        ]}
      />

      {/* 8 · DESIGN CHECKLIST — wide table, paper */}
      <MatrixTable
        id="checklist"
        eyebrow="Selecting a design"
        title="Network design checklist"
        lede="The questions an engineering review actually asks, in roughly the order their answers constrain each other."
        surface="paper"
        head={["#", "Criterion", "What to evaluate", "Design consequence"]}
        rows={CHECKLIST_ROWS}
      />

      {/* 9 · LIMITS — mandatory */}
      <LimitsBlock
        title="When this architecture is not the right fit"
        lede="A dedicated backend fabric is a commitment, and the cases below are where it does not pay for itself."
        items={LIMITATIONS}
      />

      {/* 10 · PODOS APPLICATION — prose, paper */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead
          eyebrow="In the product"
          title="How PODOS treats the network as part of the unit"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            In a conventional build the cabling plant is field work: pathways pulled, fiber terminated,
            links tested on site after the shell is up. PODOS moves that work into the factory. Each{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so the internal
            fabric — racks, in-rack copper, intra-unit fiber, and the management plane — is a fixed,
            repeatable topology rather than a bespoke design per site. Site-side work reduces to landing
            external fiber on a defined interface at the unit boundary, which is part of why PODOS{" "}
            <span data-claim="deployment-window">targets a 90-day window from order to commissioning</span>{" "}
            for a standard unit.
          </p>
          <p>
            Treating the unit as the failure domain lines the network up with the other physical
            domains: the{" "}
            <Link href="/engineering/data-center-power-architecture" style={link}>
              power architecture
            </Link>{" "}
            feeding the racks and the{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
              cooling loop
            </Link>{" "}
            are scoped to the same boundary as the fabric inside it, so blast radius means one thing
            across all three. See the{" "}
            <Link href="/platform" style={link}>
              platform overview
            </Link>{" "}
            and{" "}
            <Link href="/deploy" style={link}>
              deployment model
            </Link>{" "}
            for how units compose,{" "}
            <Link href="/use-cases" style={link}>
              use cases
            </Link>{" "}
            for the workloads these fabrics carry,{" "}
            <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={link}>
              modular vs traditional AI data centers
            </Link>{" "}
            for the comparison with a conventional facility, and the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={link}>
              AI infrastructure glossary
            </Link>{" "}
            for unfamiliar terms.
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
            href: "/engineering/data-center-power-architecture",
            label: "ENGINEERING",
            title: "Power architecture that feeds the racks",
          },
          {
            href: "/engineering/direct-to-chip-liquid-cooling",
            label: "ENGINEERING",
            title: "Direct-to-chip liquid cooling",
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
        title="Bring the fabric design to"
        accent="your site"
        body="Send the workload mix, the carrier options, and the site constraints. Engineering will tell you what the network inside a pod-based build looks like there."
        primary={{ href: "/configure", label: "Configure a build" }}
        secondary={{ href: "/deploy", label: "See the deployment model" }}
        field="network"
      />
    </main>
  );
}
