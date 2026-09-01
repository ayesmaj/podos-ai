/**
 * /platform/podos-pod — product page for the PODOS Pod.
 *
 * Server component only. Claims discipline: every company number on this
 * page renders through the publishable entries of src/content/data/claims.ts
 * (unit-capacity-1mw, pod-gpu-capacity, deployment-window), each wrapped in
 * a data-claim element with its required qualifier. Everything else stays
 * qualitative by design — no PUE, kV, sq ft, or $ figures (blocked ids).
 *
 * Visuals come from the registry (src/data/seo-page-images.ts) via SeoImage,
 * which stamps every conceptual render with its CONCEPTUAL VISUALIZATION tag.
 */

import Link from "next/link";
import styles from "@/components/site/NewSections.module.css";
import SeoImage from "@/components/seo/SeoImage";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { ProductJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import { claim } from "@/content/data/claims";

export const metadata = buildMetadata({
  title: "PODOS Pod: Factory-Built 1 MW Modular AI Data Center",
  description:
    "The PODOS Pod is a factory-built modular data-center unit designed as a standardized 1 MW building block for AI compute, with a 90-day deployment target.",
  path: "/platform/podos-pod",
});

const SOURCES: Source[] = [
  { n: 1, name: "Energy and AI — Executive Summary", publisher: "IEA", url: "https://www.iea.org/reports/energy-and-ai/executive-summary", date: "Apr 2025" },
  { n: 2, name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)", publisher: "Lawrence Berkeley National Laboratory", url: "https://eta.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report", date: "Dec 2024" },
  { n: 3, name: "Global Data Center Survey 2025", publisher: "Uptime Institute", url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025", date: "Jul 2025" },
  { n: 4, name: "GB200 NVL72 product page", publisher: "NVIDIA", url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/", date: "accessed Aug 2026" },
  { n: 5, name: "Emergence and Expansion of Liquid Cooling in Mainstream Data Centers (white paper)", publisher: "ASHRAE TC 9.9", url: "https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf", date: "c. 2021" },
  { n: 6, name: "ACS Liquid Cooling Cold Plate Requirements, Rev 1.0", publisher: "Open Compute Project", url: "https://www.opencompute.org/documents/ocp-acs-liquid-cooling-cold-plate-requirements-pdf" },
];

const FAQ = [
  {
    q: "Is the PODOS Pod a shipping-container data center?",
    a: "No. The PODOS Pod is a purpose-designed, factory-built data-center unit. It shares the logistics logic of containerized systems — build centrally, ship complete — but the enclosure is engineered from the start as a data-center envelope, with thermal insulation, cooling integration, and service access designed in, rather than adapted from an ISO freight container.",
  },
  {
    q: "How many GPUs does one PODOS Pod hold?",
    a: "Each PODOS Pod is designed for 128 GPUs, housed in liquid-cooled racks inside the unit. This is a design specification, not a measured deployment figure.",
  },
  {
    q: "How long does a PODOS Pod take to deploy?",
    a: "PODOS targets a 90-day window from order to commissioning for a standard unit, with factory assembly and site preparation running in parallel. The 90-day figure is a PODOS target, not a measured average of completed deployments.",
  },
  {
    q: "Can PODOS Pods be combined into larger installations?",
    a: "Each unit is designed as a standardized 1 MW building block, and larger capacity is designed to be reached by placing multiple units on one site rather than by redesigning the unit. PODOS has not completed multi-unit deployments; scaling descriptions are design intent.",
  },
];

export default function PodosPodPage() {
  return (
    <>
    <main style={{ background: "var(--paper)", color: "var(--ink-strong)" }}>
      <ProductJsonLd
        name="PODOS Pod"
        description="Factory-built modular data-center unit designed as a standardized 1 MW building block for AI compute, integrating power, direct-to-chip liquid cooling, racks, and networking."
        path="/platform/podos-pod"
      />
      <FAQJsonLd items={FAQ} />

      {/* ---------------- Hero — compact, blueprint surface ---------------- */}
      <section className={styles.sectionBlueprint}>
        <div className="container-site" style={{ paddingBlock: "clamp(7rem, 16vh, 11rem) clamp(3rem, 8vh, 5rem)" }}>
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Platform", path: "/platform" },
              { name: "PODOS Pod", path: "/platform/podos-pod" },
            ]}
          />

          <p className={styles.eyebrow} style={{ marginTop: "2.2rem" }}>
            <span className={styles.eyebrowIdx}>PLT-02</span>
            <span className={styles.eyebrowSep}>·</span>
            PODOS POD
          </p>

          <h1 className="t-headline" style={{ marginTop: "1.4rem", maxWidth: "22ch" }} data-claim="unit-capacity-1mw">
            PODOS Pod: designed as a standardized <span className="t-sweep-brand">1&nbsp;MW</span> building block for AI compute
          </h1>

          <p className="t-lede" style={{ marginTop: "1.4rem", maxWidth: "56ch", color: "var(--ink-dim)" }}>
            The PODOS Pod is a factory-built modular data-center unit: power distribution,
            direct-to-chip liquid cooling, GPU racks, and networking integrated in one
            transportable enclosure. It is assembled and tested in a factory, shipped complete,
            and commissioned on a prepared site —{" "}
            <span data-claim="pod-gpu-capacity">each unit is designed for 128 GPUs</span>.
          </p>

          <div style={{ marginTop: "2rem" }}>
            <LastVerified published="2026-08-31" lastVerified="2026-08-31" author="Josef Elimelech" reviewer="PODOS AI Engineering" />
          </div>

          <figure style={{ margin: "2.6rem 0 0", maxWidth: "980px" }}>
            <SeoImage id="pod-hero-studio" priority sizes="(max-width: 768px) 100vw, 980px" />
            <figcaption className="t-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "0.7rem" }}>
              PODOS Pod — front three-quarter view of the current unit design
            </figcaption>
          </figure>

          {/* Verified-facts strip — the three publishable claims, nothing else */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginTop: "2.6rem" }}>
            <div className="panel card-lift" style={{ padding: "1.3rem 1.4rem" }} data-claim="unit-capacity-1mw">
              <p className="t-number" style={{ fontSize: "2rem", background: "var(--brand-gradient)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>1 MW</p>
              <p className="t-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)", marginTop: "0.4rem" }}>Designed unit capacity</p>
              <p className="t-body" style={{ fontSize: "0.85rem", color: "var(--ink-dim)", marginTop: "0.5rem" }}>{claim("unit-capacity-1mw").statement}</p>
            </div>
            <div className="panel card-lift" style={{ padding: "1.3rem 1.4rem" }} data-claim="pod-gpu-capacity">
              <p className="t-number" style={{ fontSize: "2rem", background: "var(--brand-gradient)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>128 GPUs</p>
              <p className="t-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)", marginTop: "0.4rem" }}>Designed for, per unit</p>
              <p className="t-body" style={{ fontSize: "0.85rem", color: "var(--ink-dim)", marginTop: "0.5rem" }}>{claim("pod-gpu-capacity").statement}</p>
            </div>
            <div className="panel card-lift" style={{ padding: "1.3rem 1.4rem" }} data-claim="deployment-window">
              <p className="t-number" style={{ fontSize: "2rem", background: "var(--brand-gradient)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>90 days</p>
              <p className="t-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)", marginTop: "0.4rem" }}>Deployment target</p>
              <p className="t-body" style={{ fontSize: "0.85rem", color: "var(--ink-dim)", marginTop: "0.5rem" }}>{claim("deployment-window").statement}</p>
            </div>
          </div>
          <p className="t-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--ink-faint)", marginTop: "0.9rem" }}>
            DESIGN TARGETS FROM THE PODOS CLAIMS REGISTER — NOT MEASURED DEPLOYMENT DATA
          </p>
        </div>
      </section>

      {/* ---------------- Body ---------------- */}
      <section className={styles.section}>
        <div className="container-site section-pad" style={{ maxWidth: "880px" }}>

          <h2 className="t-headline" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>What the PODOS Pod is</h2>
          <div className="t-body" style={{ marginTop: "1rem", color: "var(--ink-dim)", display: "grid", gap: "1rem" }}>
            <p>
              A PODOS Pod is a product, not a project. Conventional AI data-center capacity is
              delivered as construction: a site is selected, a shell is erected, and the electrical
              and cooling plants are engineered in the field for that one building. The pod inverts
              the sequence. The unit is designed to be manufactured on a production line, integrated
              and tested before it leaves the factory, and placed on a prepared site. Capacity then
              grows by repetition — adding units — rather than by redesign. How that differs from a
              conventional build, step by step, is covered in{" "}
              <Link href="/compare/modular-ai-data-center-vs-traditional-data-center" style={{ color: "var(--brand)", textDecoration: "underline" }}>
                modular vs traditional AI data centers
              </Link>.
            </p>
            <p>
              The pod is the hardware half of the PODOS platform. The software half,{" "}
              <Link href="/platform/syntropic" style={{ color: "var(--brand)", textDecoration: "underline" }}>Syntropic</Link>,
              addresses how efficiently the GPUs inside are used. The{" "}
              <Link href="/platform" style={{ color: "var(--brand)", textDecoration: "underline" }}>platform overview</Link>{" "}
              explains how the two layers fit together.
            </p>
          </div>

          <figure style={{ margin: "2rem 0 0" }}>
            <SeoImage id="pod-scale-humans" />
            <figcaption className="t-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "0.7rem" }}>
              The unit shown with engineers alongside it for scale
            </figcaption>
          </figure>

          <h2 className="t-headline" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginTop: "3.2rem" }} data-claim="unit-capacity-1mw">What is designed into a 1 MW unit</h2>
          <p className="t-body" style={{ marginTop: "1rem", color: "var(--ink-dim)" }}>
            Six subsystems that a conventional build procures, engineers, and commissions
            separately arrive in the pod as one integrated machine.
          </p>

          <div className="overflow-x-auto" style={{ marginTop: "1.4rem" }}>
            <table className="w-full" style={{ borderCollapse: "collapse", fontSize: "0.9rem", minWidth: "640px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--edge-bright)" }}>
                  <th className="t-mono" style={{ textAlign: "left", padding: "0.7rem 0.8rem", fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)" }}>Code</th>
                  <th className="t-mono" style={{ textAlign: "left", padding: "0.7rem 0.8rem", fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)" }}>Subsystem</th>
                  <th className="t-mono" style={{ textAlign: "left", padding: "0.7rem 0.8rem", fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)" }}>Role</th>
                  <th className="t-mono" style={{ textAlign: "left", padding: "0.7rem 0.8rem", fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)" }}>Design approach</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--ink-dim)" }}>
                {[
                  ["PP-01", "Compute bay", "Houses the GPU cluster", <span key="c" data-claim="pod-gpu-capacity">Liquid-cooled racks, designed for 128 GPUs per unit, pre-cabled as one cluster</span>],
                  ["PP-02", "Power distribution", "Utility input to rack busways", "Medium-voltage utility input stepped down and distributed inside the enclosure; the electrical chain is installed and factory-tested, not field-assembled"],
                  ["PP-03", "Cooling", "Removes heat at the chip", "Closed-loop direct-to-chip liquid cooling — cold plates on the highest-power silicon, no evaporative water consumption in the design"],
                  ["PP-04", "Enclosure", "Thermal, weather, and access envelope", "Purpose-designed insulated enclosure engineered as a data-center envelope, not a converted freight container"],
                  ["PP-05", "Networking", "Cluster fabric and uplink", "Rack-to-rack fabric terminated inside the unit; external connectivity lands at the enclosure boundary"],
                  ["PP-06", "Controls", "Monitoring and protection", "Integrated power, thermal, and coolant-loop telemetry, designed to be exercised during factory burn-in"],
                ].map(([code, name, role, approach]) => (
                  <tr key={code as string} style={{ borderBottom: "1px solid var(--edge)" }}>
                    <td className="t-mono" style={{ padding: "0.7rem 0.8rem", color: "var(--brand-deep)", fontSize: "0.72rem", letterSpacing: "0.14em", whiteSpace: "nowrap" }}>{code}</td>
                    <td style={{ padding: "0.7rem 0.8rem", fontWeight: 600, color: "var(--ink-strong)" }}>{name}</td>
                    <td style={{ padding: "0.7rem 0.8rem" }}>{role}</td>
                    <td style={{ padding: "0.7rem 0.8rem" }}>{approach}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="t-body" style={{ marginTop: "0.9rem", fontSize: "0.85rem", color: "var(--ink-faint)" }}>
            Subsystem descriptions reflect the current design specification. PODOS has not
            published measured performance data for these subsystems.
          </p>

          <figure style={{ margin: "1.8rem 0 0" }}>
            <SeoImage id="pod-panel-detail" />
            <figcaption className="t-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "0.7rem" }}>
              PP-04 enclosure — panel seams, service latch, and solar roof edge
            </figcaption>
          </figure>

          <p className="t-body" style={{ marginTop: "1.4rem", color: "var(--ink-dim)" }}>
            The cooling and electrical subsystems carry most of the engineering weight; they are
            documented in depth in{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={{ color: "var(--brand)", textDecoration: "underline" }}>
              direct-to-chip liquid cooling
            </Link>{" "}
            and{" "}
            <Link href="/engineering/data-center-power-architecture" style={{ color: "var(--brand)", textDecoration: "underline" }}>
              data-center power architecture
            </Link>.
          </p>

          <h2 className="t-headline" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginTop: "3.2rem" }} data-claim="unit-capacity-1mw">Why 1 MW is the designed unit size</h2>
          <div className="t-body" style={{ marginTop: "1rem", color: "var(--ink-dim)", display: "grid", gap: "1rem" }}>
            <p>
              AI hardware has collapsed the megawatt into a few racks. NVIDIA&apos;s GB200 NVL72
              packs 72 GPUs and 36 CPUs into a single liquid-cooled rack acting as one NVLink
              domain<Cite n={4} />, and the Uptime Institute&apos;s 2025 operator survey shows
              rack densities climbing into the 10–30 kW band industry-wide, with AI racks far
              beyond it<Cite n={3} />. At those densities a megawatt is no longer a hall — it is
              a short row of racks. <span data-claim="unit-capacity-1mw">That is why the pod
              is designed at 1 MW: the smallest envelope that still holds a coherent GPU
              cluster, and the largest one that can be built, transported, and craned onto a
              site as a single factory-made object.</span>
            </p>
            <p>
              The grid pushes toward the same number from the other side. The IEA projects data
              centres rising from about 1.5% of global electricity demand in 2025 to roughly 3% —
              around 945 TWh — by 2030<Cite n={1} />, and Lawrence Berkeley National Laboratory
              estimates US data centres alone could reach 6.7–12% of national electricity
              consumption by 2028, up from 4.4% in 2023<Cite n={2} />. Campus-scale
              interconnections queue for years against that demand. <span data-claim="unit-capacity-1mw">A
              load in the pod&apos;s designed 1 MW class</span>, by contrast, fits the
              distribution infrastructure that already exists at many industrial and
              commercial sites. The unit is designed to put compute where power
              is already available instead of waiting for new power to reach the compute.
            </p>
          </div>

          <h2 className="t-headline" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginTop: "3.2rem" }} data-claim="deployment-window">Factory build and the 90-day target</h2>
          <div className="t-body" style={{ marginTop: "1rem", color: "var(--ink-dim)", display: "grid", gap: "1rem" }}>
            <p data-claim="deployment-window">
              PODOS targets a 90-day window from order to commissioning for a standard unit. The
              target rests on one structural change: the slowest work moves off the critical
              path. While the unit is assembled, integrated, and burned in at the factory, the
              site is prepared in parallel — pad, utility connection, network. Field work reduces
              to placement, hook-up, and acceptance testing. The 90-day figure is a PODOS
              target, not a measured average of completed deployments.
            </p>
            <p>
              What factory integration and site preparation each involve, stage by stage, is
              laid out on the{" "}
              <Link href="/deploy" style={{ color: "var(--brand)", textDecoration: "underline" }}>deployment page</Link>.
            </p>
          </div>

          <figure style={{ margin: "2rem 0 0" }}>
            <SeoImage id="pod-siting-pad" />
            <figcaption className="t-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "0.7rem" }}>
              A unit set on a prepared pad, with the site utility cabinet alongside
            </figcaption>
          </figure>

          <h2 className="t-headline" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginTop: "3.2rem" }} data-claim="unit-capacity-1mw">Does the 1 MW unit design fit your problem?</h2>
          <p className="t-body" style={{ marginTop: "1rem", color: "var(--ink-dim)" }}>
            A short diagnostic. The pod is a specific answer to a specific shape of problem — it
            is the wrong answer to others.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: "1.4rem" }}>
            <div className="panel" style={{ padding: "1.4rem 1.5rem" }}>
              <p className="t-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--brand-deep)" }}>Signals a pod fits</p>
              <ul className="t-body" style={{ marginTop: "0.9rem", color: "var(--ink-dim)", display: "grid", gap: "0.6rem", listStyle: "disc", paddingLeft: "1.1rem" }}>
                <li>You need dedicated AI capacity in megawatt-scale increments — not tens of megawatts on day one.</li>
                <li>Power is available or procurable at your site: behind an existing meter, at an industrial facility, or from on-site generation.</li>
                <li>Data residency, security, or latency argues for compute on ground you control — the pattern behind most <Link href="/use-cases" style={{ color: "var(--brand)", textDecoration: "underline" }}>PODOS use cases</Link>.</li>
                <li>Your timeline is measured in quarters, not years.</li>
                <li>You expect to scale by adding units, not by re-architecting a facility.</li>
              </ul>
            </div>
            <div className="panel" style={{ padding: "1.4rem 1.5rem" }}>
              <p className="t-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)" }}>Signals it does not</p>
              <ul className="t-body" style={{ marginTop: "0.9rem", color: "var(--ink-dim)", display: "grid", gap: "0.6rem", listStyle: "disc", paddingLeft: "1.1rem" }}>
                <li>You are planning a single campus of hundreds of megawatts with its own substation — purpose-built construction amortizes better at that scale.</li>
                <li>Your workloads are occasional or bursty — cloud capacity will price better than owned hardware.</li>
                <li>There is no realistic path to roughly a megawatt of power at your site.</li>
                <li>Your procurement requires audited, measured facility data today — PODOS figures are currently design targets.</li>
              </ul>
            </div>
          </div>

          <h2 className="t-headline" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginTop: "3.2rem" }}>Limitations and open questions</h2>
          <ul className="t-body" style={{ marginTop: "1rem", color: "var(--ink-dim)", display: "grid", gap: "0.7rem", listStyle: "disc", paddingLeft: "1.1rem" }}>
            <li>
              Every PODOS number on this page is a design target. There are no completed customer
              deployments to cite, and product imagery elsewhere on this site depicts design
              intent, not installed units.
            </li>
            <li data-claim="unit-capacity-1mw">
              The 1 MW design granularity carries overhead at very large scale: each unit
              duplicates enclosure, controls, and cooling plant that a monolithic facility
              would share.
            </li>
            <li>
              The unit does not remove site obligations. Power procurement, permitting, a
              structural pad, and network connectivity remain the buyer&apos;s critical path, and
              their timelines vary by jurisdiction.
            </li>
            <li>
              Direct-to-chip liquid cooling demands operational discipline — coolant quality,
              loop maintenance, serviceability procedures. Industry standardization of these
              interfaces is still in progress through bodies like the Open Compute Project
              <Cite n={6} />, and ASHRAE guidance on liquid-cooled facilities continues to
              evolve<Cite n={5} />.
            </li>
            <li>
              GPU pricing, allocation, and lead times sit outside the unit specification and can
              dominate a real project schedule.
            </li>
          </ul>

          <h2 className="t-headline" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginTop: "3.2rem" }}>Frequently asked questions</h2>
          <div style={{ marginTop: "1.2rem", display: "grid", gap: "1rem" }}>
            {FAQ.map((f) => (
              <details key={f.q} open className="panel" style={{ padding: "1.1rem 1.3rem" }}>
                <summary className="t-body" style={{ fontWeight: 600, color: "var(--ink-strong)", cursor: "pointer" }}>{f.q}</summary>
                <p
                  className="t-body"
                  style={{ marginTop: "0.7rem", color: "var(--ink-dim)" }}
                  data-claim={f.q.includes("GPUs") ? "pod-gpu-capacity" : f.q.includes("deploy") ? "deployment-window" : f.q.includes("combined") ? "unit-capacity-1mw" : undefined}
                >
                  {f.a}
                </p>
              </details>
            ))}
          </div>

          <EvidenceSourceRail sources={SOURCES} />

          {/* Cross-links */}
          <nav aria-label="Related pages" style={{ marginTop: "2.5rem", borderTop: "1px solid var(--edge)", paddingTop: "1.5rem" }}>
            <p className="t-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-dim)" }}>Continue</p>
            <ul className="t-body" style={{ marginTop: "0.8rem", display: "grid", gap: "0.5rem" }}>
              <li><Link href="/platform" style={{ color: "var(--brand)", textDecoration: "underline" }}>The PODOS platform — hardware and software together</Link></li>
              <li><Link href="/engineering" style={{ color: "var(--brand)", textDecoration: "underline" }}>Engineering — how the pod&apos;s cooling and power are designed</Link></li>
              <li><Link href="/resources/ai-infrastructure-glossary" style={{ color: "var(--brand)", textDecoration: "underline" }}>AI infrastructure glossary — the terms used on this page</Link></li>
              <li><Link href="/invest" style={{ color: "var(--brand)", textDecoration: "underline" }}>Investor information — PODOS AI</Link></li>
            </ul>
          </nav>
        </div>
      </section>
    </main>
    </>
  );
}
