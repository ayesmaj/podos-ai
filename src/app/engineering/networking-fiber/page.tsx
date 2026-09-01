/**
 * /engineering/networking-fiber — engineering explainer (ENG-05).
 *
 * Server component. Keyword cluster: "AI data center network
 * architecture" / "leaf spine fiber" (informational/TOFU). All external
 * numbers cite the source register or primary sources verified
 * 2026-08-31; company claims render only from claims.ts publishable
 * entries with their required qualifiers. Non-confidential level — no
 * PODOS-specific port counts, topologies, or vendor detail.
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

const PATH = "/engineering/networking-fiber";
const TITLE = "AI Data Center Network Architecture: Fiber and Leaf-Spine";
const DESCRIPTION =
  "AI data-center networking explained: fiber entry, leaf-spine fabrics, scale-up vs scale-out, east-west traffic in training vs inference, redundancy, monitoring.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

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

const tdStrong: CSSProperties = { ...td, color: "var(--ink-strong)", fontWeight: 500 };

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

const linkStyle: CSSProperties = { color: "var(--brand-deep)", textDecoration: "underline" };

const bodyP = "t-body mt-4";
const bodyColor: CSSProperties = { color: "var(--ink-dim)" };

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

export default function NetworkingFiberPage() {
  return (
    <>
      <SiteHeader />
    <main style={{ background: "var(--paper)" }}>
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

      {/* ---------------- compact hero ---------------- */}
      <header
        className="container-site"
        style={{ paddingTop: "clamp(6.5rem, 12vh, 9rem)", paddingBottom: "clamp(2.5rem, 5vh, 4rem)" }}
      >
        <Breadcrumbs
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Engineering", path: "/engineering" },
            { name: "Networking and fiber", path: PATH },
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
          <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>ENG-05</span>
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
          Networking and fiber in an <span className="t-sweep-brand">AI data center</span>
        </h1>

        <p className="t-lede mt-5 max-w-[62ch]" style={bodyColor}>
          An AI data center runs several networks at once, not one. A scale-up fabric binds
          accelerators inside a rack into a single compute domain, a scale-out backend fabric carries
          collective traffic between racks, and a separate frontend network handles storage,
          management, and the outside world. Fiber enters the building at one controlled point and
          fans out through a leaf-spine fabric — but almost all of the traffic that decides whether
          GPUs stay busy never leaves the building.
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
          {/* -------- planes -------- */}
          <section id="planes" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Four networks in one building</h2>
            <p className={bodyP} style={bodyColor}>
              Enterprise data centers converge onto one general-purpose fabric. AI sites deliberately
              do not. Meta&apos;s published account of its training clusters describes separating GPU
              training onto its own dedicated backend network, because its traffic — bursty,
              load-imbalanced, coordinated across tens of thousands of GPUs for weeks at a time — is
              hostile to anything sharing a fabric with it.<Cite n={1} />
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th} scope="col">Plane</th>
                    <th style={th} scope="col">Scope</th>
                    <th style={th} scope="col">What it carries</th>
                    <th style={th} scope="col">If it degrades</th>
                  </tr>
                </thead>
                <tbody>
                  {PLANES.map(([code, plane, carries, degrades]) => (
                    <tr key={code}>
                      <td style={td}>
                        <span style={codePill}>{code}</span>
                      </td>
                      <td style={tdStrong}>{plane}</td>
                      <td style={td}>{carries}</td>
                      <td style={td}>{degrades}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* -------- fiber entry -------- */}
          <section id="fiber-entry" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Fiber entry and the physical plant</h2>
            <p className={bodyP} style={bodyColor}>
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
          </section>

          {/* -------- leaf spine -------- */}
          <section id="leaf-spine" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Leaf-spine: why the fabric looks the way it does</h2>
            <p className={bodyP} style={bodyColor}>
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
            <p className={bodyP} style={bodyColor}>
              Hyperscale practice has already moved past the flat two-tier picture. Google&apos;s
              Jupiter work replaced a static spine layer with optical circuit switches under
              software-defined control, reporting 5× higher speed and capacity, a 30% capex reduction,
              and a 41% power reduction across the evolution period while serving live traffic.
              <Cite n={3} /> The transferable lesson for a smaller site is not optical switching — it
              is that topology has to be incrementally extensible, because the next hardware generation
              arrives before the building is full.
            </p>
          </section>

          {/* -------- east-west -------- */}
          <section id="east-west" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>East-west traffic: training and inference are different workloads</h2>
            <p className={bodyP} style={bodyColor}>
              East-west means machine-to-machine traffic inside the facility. It dominates AI sites,
              but training and inference stress the fabric in opposite ways, and a fabric tuned for one
              is mediocre at the other.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th} scope="col">Dimension</th>
                    <th style={th} scope="col">Distributed training</th>
                    <th style={th} scope="col">Inference serving</th>
                  </tr>
                </thead>
                <tbody>
                  {TRAFFIC.map(([dim, train, infer]) => (
                    <tr key={dim}>
                      <td style={tdStrong}>{dim}</td>
                      <td style={td}>{train}</td>
                      <td style={td}>{infer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className={bodyP} style={bodyColor}>
              This is where the scale-up boundary earns its keep. NVIDIA describes NVLink as a direct
              GPU-to-GPU interconnect that scales multi-GPU I/O within a server, with NVLink Switch
              chips extending all-to-all GPU communication across the rack<Cite n={6} />; a GB200
              NVL72 rack presents 72 GPUs and 36 CPUs as a single NVLink domain.<Cite n={7} /> Traffic
              between racks falls to Ethernet or InfiniBand instead. Parallelism that fits inside the
              scale-up domain never touches the fiber plant; parallelism that does not crosses a
              bandwidth cliff at the rack boundary, which makes scheduler placement a networking
              decision. The transport underneath is meanwhile consolidating on Ethernet: the Ultra
              Ethernet Consortium launched Specification 1.0 in June 2025, an RDMA transport for
              Ethernet and IP specified across NICs, switches, optics, and cables so multi-vendor
              fabrics interoperate without lock-in.<Cite n={2} />
            </p>
          </section>

          {/* -------- redundancy -------- */}
          <section id="redundancy" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Redundancy, failure domains, and monitoring</h2>
            <p className={bodyP} style={bodyColor}>
              Network redundancy in an AI site is failure-domain arithmetic. Dual-homing servers to two
              leaf switches, running N+1 spines, and feeding paired switches from separate power paths
              all reduce the number of accelerators one component can take out of a running job. That
              number is the design output: it sets how often jobs checkpoint, and therefore what a
              failure costs. The Uptime Institute&apos;s 2025 survey of more than 800 operators found
              roughly half had an impactful outage in the previous three years — redundancy is judged
              on what it contains, not on what is installed.<Cite n={8} />
            </p>
            <p className={bodyP} style={bodyColor}>
              Monitoring has to reach past up and down: per-queue depth and drop counters, ECN marking
              and PFC pause rates on lossless fabrics, per-lane optical light levels, correctable-error
              counts, fabric-wide path utilisation. Alone these are graphs. They become diagnostic when
              correlated with job metrics — step time, collective completion time, rank stragglers —
              because the characteristic AI failure is not a link going down but one degrading optic
              quietly slowing every iteration of a job spanning thousands of GPUs.
            </p>
          </section>

          {/* -------- checklist -------- */}
          <section id="checklist" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Network design checklist</h2>
            <p className={bodyP} style={bodyColor}>
              The questions an engineering review actually asks, in roughly the order their answers
              constrain each other.
            </p>

            <div className="overflow-x-auto mt-6 panel" style={{ borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th} scope="col">#</th>
                    <th style={th} scope="col">Criterion</th>
                    <th style={th} scope="col">What to evaluate</th>
                    <th style={th} scope="col">Design consequence</th>
                  </tr>
                </thead>
                <tbody>
                  {CHECKLIST.map(([n, criterion, evaluate, consequence, cite]) => (
                    <tr key={n}>
                      <td style={td}>
                        <span style={codePill}>{n}</span>
                      </td>
                      <td style={tdStrong}>{criterion}</td>
                      <td style={td}>{evaluate}</td>
                      <td style={td}>
                        {consequence}
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
            <h2 style={h2Style}>When this architecture is not the right fit</h2>
            <ul className="mt-5 grid gap-3 list-disc pl-5">
              {LIMITATIONS.map((t) => (
                <li key={t.slice(0, 24)} className="t-body" style={bodyColor}>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* -------- PODOS application -------- */}
          <section id="podos" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>How PODOS treats the network as part of the unit</h2>
            <p className={bodyP} style={bodyColor}>
              In a conventional build the cabling plant is field work: pathways pulled, fiber
              terminated, links tested on site after the shell is up. PODOS moves that work into the
              factory. Each{" "}
              <Link href="/platform/podos-pod" style={linkStyle}>
                PODOS Pod
              </Link>{" "}
              is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
              and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, so the internal
              fabric — racks, in-rack copper, intra-unit fiber, and the management plane — is a fixed,
              repeatable topology rather than a bespoke design per site. Site-side work reduces to
              landing external fiber on a defined interface at the unit boundary, which is part of why
              PODOS{" "}
              <span data-claim="deployment-window">targets a 90-day window from order to commissioning</span>{" "}
              for a standard unit.
            </p>
            <p className={bodyP} style={bodyColor}>
              Treating the unit as the failure domain lines the network up with the other physical
              domains: the{" "}
              <Link href="/engineering/data-center-power-architecture" style={linkStyle}>
                power architecture
              </Link>{" "}
              feeding the racks and the{" "}
              <Link href="/engineering/direct-to-chip-liquid-cooling" style={linkStyle}>
                cooling loop
              </Link>{" "}
              are scoped to the same boundary as the fabric inside it, so blast radius means one thing
              across all three. See the{" "}
              <Link href="/platform" style={linkStyle}>
                platform overview
              </Link>{" "}
              and{" "}
              <Link href="/deploy" style={linkStyle}>
                deployment model
              </Link>{" "}
              for how units compose,{" "}
              <Link href="/use-cases" style={linkStyle}>
                use cases
              </Link>{" "}
              for the workloads these fabrics carry,{" "}
              <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={linkStyle}>
                modular vs traditional AI data centers
              </Link>{" "}
              for the comparison with a conventional facility, and the{" "}
              <Link href="/resources/ai-infrastructure-glossary" style={linkStyle}>
                AI infrastructure glossary
              </Link>{" "}
              for unfamiliar terms.
            </p>
          </section>

          {/* -------- FAQ -------- */}
          <section id="faq" className="mt-14" style={{ scrollMarginTop: 96 }}>
            <h2 style={h2Style}>Frequently asked questions</h2>
            <div className="mt-6 grid gap-6">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <h3 style={h3Style}>{f.q}</h3>
                  <p className="t-body mt-2" style={bodyColor}>
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
