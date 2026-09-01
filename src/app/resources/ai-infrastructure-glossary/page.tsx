/**
 * /resources/ai-infrastructure-glossary — 40-term AI infrastructure
 * glossary. Server component; main-site light technical design system
 * (design-language-lock.md). All external stats cite the source
 * register; company numbers wrapped in data-claim with qualifiers.
 *
 * ponytail: spacing is inline styles, not Tailwind p-/m- utilities —
 * the unlayered reset in globals.css beats layered Tailwind spacing
 * outside `.invest` (see the reset comment at globals.css:152).
 */

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import SeoImage from "@/components/seo/SeoImage";

const PATH = "/resources/ai-infrastructure-glossary";
const TITLE = "AI Infrastructure Glossary: 40 Data Center Terms Defined";
const DESCRIPTION =
  "Plain-language definitions of 40 AI infrastructure terms — PUE, direct-to-chip cooling, CDU, KV cache, interconnection queue, rack density, and more.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const SOURCES: Source[] = [
  { n: 1, name: "Global Data Center Survey 2025", publisher: "Uptime Institute", url: "https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025", date: "Jul 2025" },
  { n: 2, name: "Data center efficiency (fleet trailing-twelve-month PUE)", publisher: "Google", url: "https://datacenters.google/efficiency/", date: "updated annually" },
  { n: 3, name: "Measuring energy and water efficiency for Microsoft datacenters", publisher: "Microsoft", url: "https://datacenters.microsoft.com/sustainability/efficiency/", date: "ongoing" },
  { n: 4, name: "2024 United States Data Center Energy Usage Report (LBNL-2001637)", publisher: "Lawrence Berkeley National Laboratory", url: "https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf", date: "Dec 2024" },
  { n: 5, name: "Energy and AI — Executive Summary", publisher: "IEA", url: "https://www.iea.org/reports/energy-and-ai/executive-summary", date: "Apr 2025" },
  { n: 6, name: "Thermal Guidelines for Data Processing Environments, 5th ed. (TC 9.9)", publisher: "ASHRAE", url: "https://www.ashrae.org", date: "2021" },
  { n: 7, name: "GB200 NVL72 product page", publisher: "NVIDIA", url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/", date: "spec page" },
  { n: 8, name: "HPC Data Center Waste Heat Reuse (ESIF)", publisher: "NREL (DOE)", url: "https://www.nrel.gov/computational-science/waste-heat-energy-reuse", date: "ongoing" },
  { n: 9, name: "ACS Liquid Cooling Cold Plate Requirements, Rev 1.0", publisher: "Open Compute Project", url: "https://www.opencompute.org/documents/ocp-acs-liquid-cooling-cold-plate-requirements-pdf" },
  { n: 10, name: "TurboQuant: Online Vector Quantization with Near-optimal Distortion Rate", publisher: "arXiv (2504.19874)", url: "https://arxiv.org/abs/2504.19874", date: "Apr 2025" },
  { n: 11, name: "Demonstrating the Data Center as a Flexible Grid Asset", publisher: "NREL (DOE)", url: "https://docs.nrel.gov/docs/fy25osti/94844.pdf", date: "FY2025" },
];

/* ---- glossary data ---- */

type Term = { id: string; term: string; def: ReactNode };

const link = (href: string, text: string) => (
  <Link
    href={href}
    className="underline decoration-[var(--brand)] underline-offset-2 transition-colors hover:text-[var(--brand-deep)]"
    style={{ color: "var(--ink-strong)" }}
  >
    {text}
  </Link>
);

const TERMS: Term[] = [
  {
    id: "800-vdc",
    term: "800 VDC power architecture",
    def: (
      <>
        A rack power-distribution approach that replaces multiple AC conversion stages with a single
        high-voltage direct-current bus feeding the rack. It is promoted for multi-hundred-kilowatt AI
        racks to cut conversion losses and copper mass; standards are still forming.
      </>
    ),
  },
  {
    id: "ashrae-thermal-guidelines",
    term: "ASHRAE thermal guidelines",
    def: (
      <>
        The de facto environmental envelope for IT equipment. The fifth edition defines air-cooled
        classes A1–A4 — A4 permitting inlet air up to 40 °C — plus liquid-cooling classes named by
        maximum facility water temperature.<Cite n={6} />
      </>
    ),
  },
  {
    id: "bess",
    term: "Battery energy storage system (BESS)",
    def: (
      <>
        Utility-scale batteries co-located with a facility to ride through disturbances, shave peaks, or
        sell flexibility to the grid. An NREL demonstration dispatched a 35 MW battery at a 70 MW
        grid-interactive data center in under five seconds without breaking service commitments.
        <Cite n={11} />
      </>
    ),
  },
  {
    id: "behind-the-meter",
    term: "Behind-the-meter (BTM)",
    def: (
      <>
        Generation or storage connected on the customer side of the utility meter, serving local load
        without waiting on grid-connection studies. BTM power is one route around long
        interconnection queues; the {link("/deploy", "deployment overview")} covers how it pairs with
        modular capacity.
      </>
    ),
  },
  {
    id: "cdu",
    term: "CDU (coolant distribution unit)",
    def: (
      <>
        A pump-and-heat-exchanger skid that isolates the facility water loop from the technology cooling
        loop serving cold plates. It regulates flow, pressure, and supply temperature — typically holding
        coolant above dew point so condensation never forms on hardware.
      </>
    ),
  },
  {
    id: "closed-loop-liquid-cooling",
    term: "Closed-loop liquid cooling",
    def: (
      <>
        A cooling architecture in which a fixed charge of coolant circulates continuously between heat
        sources and heat rejection, with no evaporation and no continuous make-up water. Closed loops are
        what make zero-water operation and practical heat recovery possible.
      </>
    ),
  },
  {
    id: "cold-plate",
    term: "Cold plate",
    def: (
      <>
        A metal plate with internal fluid channels mounted directly on a processor package, moving heat
        into liquid at the die instead of into room air. The Open Compute Project publishes cold-plate
        requirements so plates, manifolds, and CDUs from different vendors interoperate.<Cite n={9} />
      </>
    ),
  },
  {
    id: "colocation",
    term: "Colocation",
    def: (
      <>
        Renting space, power, and cooling for your own hardware inside a shared third-party facility.
        Colocation transfers the facility problem to a landlord; available density and liquid-cooling
        readiness vary widely between sites.
      </>
    ),
  },
  {
    id: "demand-response",
    term: "Demand response",
    def: (
      <>
        Utility or market programs that compensate large electricity consumers for reducing or shifting
        load during grid stress. A flexible data center can treat demand response as a revenue stream
        rather than an interruption.
      </>
    ),
  },
  {
    id: "direct-to-chip",
    term: "Direct-to-chip (D2C) liquid cooling",
    def: (
      <>
        A liquid-cooling method that pipes coolant through cold plates mounted on GPUs and CPUs,
        removing most heat at the silicon. Loop architecture and trade-offs are covered in the{" "}
        {link("/engineering/direct-to-chip-liquid-cooling", "direct-to-chip liquid cooling explainer")}.
      </>
    ),
  },
  {
    id: "dry-cooler",
    term: "Dry cooler",
    def: (
      <>
        A closed-circuit, air-to-liquid heat exchanger that rejects loop heat to ambient air without
        evaporating water. Dry coolers enable zero-water heat rejection at the cost of efficiency in
        peak heat.
      </>
    ),
  },
  {
    id: "edge-data-center",
    term: "Edge data center",
    def: (
      <>
        A small facility placed near where data is generated or consumed, cutting latency and backhaul
        cost. AI inference is pushing edge sites from closet scale toward megawatt-class units; see the
        {" "}{link("/use-cases", "designed-for use cases")}.
      </>
    ),
  },
  {
    id: "ere",
    term: "Energy reuse effectiveness (ERE)",
    def: (
      <>
        (Total facility energy − energy reused elsewhere) ÷ IT energy. Unlike PUE, ERE credits heat
        exported to buildings or processes, so it can fall below 1.0 for a facility with a real heat
        customer.
      </>
    ),
  },
  {
    id: "evaporative-cooling",
    term: "Evaporative cooling",
    def: (
      <>
        Heat rejection that cools air or water by evaporating water, trading water consumption for
        electrical efficiency. It is the main driver of data-center water use and of WUE differences
        between designs.
      </>
    ),
  },
  {
    id: "facility-water-system",
    term: "Facility water system (FWS)",
    def: (
      <>
        The building-side hydronic loop carrying heat from CDUs out to heat rejection — dry coolers,
        cooling towers, or a heat-reuse customer. Its supply temperature largely determines which
        rejection options are viable.
      </>
    ),
  },
  {
    id: "gpu-cluster",
    term: "GPU cluster",
    def: (
      <>
        A set of GPU servers linked by high-bandwidth fabric so thousands of chips behave as one machine.
        Density is rising fast: NVIDIA&rsquo;s GB200 NVL72 places 72 GPUs and 36 CPUs in a single
        liquid-cooled rack acting as one NVLink domain.<Cite n={7} />
      </>
    ),
  },
  {
    id: "heat-reuse",
    term: "Heat reuse (waste-heat recovery)",
    def: (
      <>
        Capturing heat a facility would otherwise reject and delivering it to a productive use — district
        heating, offices, industrial processes. NREL&rsquo;s ESIF facility heats its office space with
        HPC waste heat and reports a PUE near 1.04.<Cite n={8} />
      </>
    ),
  },
  {
    id: "hyperscale",
    term: "Hyperscale data center",
    def: (
      <>
        A facility class operated by the largest cloud and AI platforms, typically tens to hundreds of
        megawatts with custom hardware and leading efficiency. Google reports a fleet-wide
        trailing-twelve-month PUE of 1.09 per its latest reporting.<Cite n={2} />
      </>
    ),
  },
  {
    id: "immersion-cooling",
    term: "Immersion cooling",
    def: (
      <>
        Liquid cooling that submerges entire servers in a non-conductive dielectric fluid, in
        single-phase or two-phase variants. It removes nearly all heat to liquid but changes
        serviceability and hardware qualification.
      </>
    ),
  },
  {
    id: "inference",
    term: "Inference",
    def: (
      <>
        Running a trained model to produce output. Inference is latency-sensitive and often
        memory-bound, and over a model&rsquo;s life it usually consumes more total compute than the
        training run did.
      </>
    ),
  },
  {
    id: "interconnection-queue",
    term: "Interconnection queue",
    def: (
      <>
        The ordered backlog of projects waiting on utility studies and network upgrades before they may
        connect to the grid. Queue timelines run to years in many regions, making grid access a defining
        constraint on where new AI capacity can be built.
      </>
    ),
  },
  {
    id: "it-load",
    term: "IT load",
    def: (
      <>
        The electrical power consumed by computing, storage, and network equipment alone — excluding
        cooling, conversion losses, and building systems. IT load is the denominator in PUE, WUE, and
        ERE.
      </>
    ),
  },
  {
    id: "kv-cache",
    term: "KV cache",
    def: (
      <>
        In transformer inference, the per-token key and value tensors held in GPU memory so earlier
        context is not recomputed. KV caches grow with context length and batch size; published research
        shows quantization to roughly 3.5 bits per channel can be quality-neutral.<Cite n={10} /> The{" "}
        {link("/platform/syntropic", "Syntropic overview")} covers the software side of memory
        efficiency.
      </>
    ),
  },
  {
    id: "mv-switchgear",
    term: "Medium-voltage (MV) switchgear",
    def: (
      <>
        Switching, protection, and metering equipment operating at medium voltage — roughly 1 kV to 35
        kV, with 13.8 kV a common North American distribution class. How a site accepts and steps down MV
        power is covered in {link("/engineering/data-center-power-architecture", "data-center power architecture")}.
      </>
    ),
  },
  {
    id: "microgrid",
    term: "Microgrid",
    def: (
      <>
        A local energy system — generation, storage, and controls — that can run connected to the utility
        grid or islanded from it. Microgrids let compute operate where grid service is weak, delayed, or
        absent.
      </>
    ),
  },
  {
    id: "modular-data-center",
    term: "Modular data center",
    def: (
      <>
        Data-center capacity produced as a factory-built, transportable unit — structure, power, cooling,
        and racks integrated and tested before shipment — rather than constructed in place.{" "}
        <span data-claim="unit-capacity-1mw">
          PODOS applies the model at fixed scale: each {link("/platform/podos-pod", "PODOS Pod")} is
          designed as a standardized 1 MW building block.
        </span>{" "}
        For the full decision framework, see{" "}
        {link("/compare/modular-ai-data-center-vs-traditional-data-center", "modular vs traditional data centers")}.
      </>
    ),
  },
  {
    id: "n-plus-1",
    term: "N+1 redundancy",
    def: (
      <>
        A redundancy scheme providing one spare unit beyond the number required to carry the load — five
        pumps where four suffice. Contrast 2N, which duplicates the entire system, and N, which carries no
        spare at all.
      </>
    ),
  },
  {
    id: "ocp",
    term: "Open Compute Project (OCP)",
    def: (
      <>
        An industry body that open-sources data-center hardware and cooling specifications, including
        cold-plate, immersion, and CDU requirements. Its cooling-environments work is what keeps the
        liquid-cooling ecosystem multi-vendor.<Cite n={9} />
      </>
    ),
  },
  {
    id: "orc",
    term: "Organic Rankine cycle (ORC)",
    def: (
      <>
        A heat engine that generates electricity from low-temperature heat by boiling an organic working
        fluid instead of water. ORC systems are one route to converting data-center waste heat into
        usable power rather than venting it.
      </>
    ),
  },
  {
    id: "pdu",
    term: "Power distribution unit (PDU)",
    def: (
      <>
        Equipment that takes conditioned facility power and distributes it to racks. PDUs are usually
        where circuit-level power monitoring lives.
      </>
    ),
  },
  {
    id: "pue",
    term: "Power usage effectiveness (PUE)",
    def: (
      <>
        Total facility energy ÷ IT energy — the industry&rsquo;s standard overhead metric, where 1.0
        would mean zero overhead. Industry-average PUE has stayed roughly flat for about six years in
        Uptime Institute&rsquo;s surveys,<Cite n={1} /> while leading hyperscale fleets report figures
        near 1.09.<Cite n={2} />
      </>
    ),
  },
  {
    id: "rack-density",
    term: "Rack density",
    def: (
      <>
        The power drawn by a single rack, in kW. Uptime&rsquo;s 2025 survey shows densities climbing into
        the 10–30 kW band for many operators;<Cite n={1} /> current AI racks sit far above that, which is
        why liquid cooling is displacing air.
      </>
    ),
  },
  {
    id: "rear-door-heat-exchanger",
    term: "Rear-door heat exchanger (RDHx)",
    def: (
      <>
        A liquid-cooled coil that replaces a rack&rsquo;s rear door, absorbing server exhaust heat into
        water before it enters the room. A retrofit-friendly middle step between air cooling and
        direct-to-chip.
      </>
    ),
  },
  {
    id: "substation",
    term: "Substation",
    def: (
      <>
        The transformers and switchgear that step transmission or distribution voltage down for site use.
        For large campuses a new substation is often the longest-lead physical asset on the project.
      </>
    ),
  },
  {
    id: "tcs",
    term: "Technology cooling system (TCS)",
    def: (
      <>
        The server-side loop between the CDU and the cold plates, running treated coolant at controlled
        temperature and pressure — kept separate from the facility loop to protect hardware from
        water-quality excursions.
      </>
    ),
  },
  {
    id: "time-to-power",
    term: "Time-to-power",
    def: (
      <>
        The elapsed time from committing to a site until it can draw its contracted power — driven by
        interconnection studies, substation work, and utility construction.{" "}
        <span data-claim="deployment-window">
          PODOS targets a 90-day window from order to commissioning for a standard unit
        </span>
        , a target that presumes power is already available at the site; see{" "}
        {link("/deploy", "how deployment is sequenced")}.
      </>
    ),
  },
  {
    id: "training",
    term: "Training",
    def: (
      <>
        Building or updating a model&rsquo;s weights by processing large datasets across many
        synchronized GPUs. Training is throughput-bound rather than latency-bound, and it stresses
        interconnect bandwidth and sustained power draw.
      </>
    ),
  },
  {
    id: "ups",
    term: "Uninterruptible power supply (UPS)",
    def: (
      <>
        Batteries or flywheels plus power electronics that carry the IT load for the seconds-to-minutes
        between a grid disturbance and generator pickup. UPS topology is a core decision in{" "}
        {link("/engineering/data-center-power-architecture", "power architecture")}.
      </>
    ),
  },
  {
    id: "wue",
    term: "Water usage effectiveness (WUE)",
    def: (
      <>
        Liters of water consumed on site per kWh of IT energy. Microsoft reports a design WUE of 0.30
        L/kWh for new builds, down from 0.49 in 2021;<Cite n={3} /> closed-loop designs aim for zero
        operational water consumption.
      </>
    ),
  },
  {
    id: "zero-water-cooling",
    term: "Zero-water cooling",
    def: (
      <>
        Heat rejection designed to consume no water in operation — typically a closed coolant loop
        rejecting heat through dry coolers. It removes water permits and drought exposure from siting
        decisions.
      </>
    ),
  },
];

/* ---- shared styles ---- */

const mono: CSSProperties = {
  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
};

const h2Style: CSSProperties = {
  fontFamily: "var(--font-geist), var(--font-display), ui-sans-serif",
  fontWeight: 800,
  fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
  letterSpacing: "-0.03em",
  lineHeight: 1.08,
  color: "var(--ink-strong)",
};

export default function GlossaryPage() {
  return (
    <>
      <SiteHeader />
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="AI infrastructure glossary"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />

      {/* ---- compact hero ---- */}
      <section style={{ borderBottom: "1px solid var(--edge-faint)" }}>
        <div
          className="container-site"
          style={{ paddingTop: "clamp(6.5rem, 14vh, 10rem)", paddingBottom: "clamp(2.5rem, 6vh, 4rem)" }}
        >
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "AI Infrastructure Glossary", path: PATH },
            ]}
          />

          <p
            style={{
              ...mono,
              marginTop: "1.6rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.78rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--brand-deep)",
              background: "var(--glass-bg-strong)",
              border: "1px solid var(--edge-bright)",
              borderRadius: 999,
              padding: "0.45rem 1rem",
            }}
          >
            <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>R-01</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Resources</span>
          </p>

          <h1 className="t-headline" style={{ marginTop: "1.2rem", maxWidth: "18ch" }}>
            AI infrastructure <span className="t-sweep-brand">glossary</span>
          </h1>

          <p className="t-lede" style={{ marginTop: "1.1rem", maxWidth: "56ch", color: "var(--ink-dim)" }}>
            This glossary defines 40 terms used across AI data-center engineering — power, cooling,
            compute, and grid interconnection — in two to four plain sentences each. It is written for
            people evaluating megawatt-scale AI infrastructure, not for people selling it.
          </p>

          <p className="t-body" style={{ marginTop: "0.9rem", maxWidth: "62ch", color: "var(--ink-dim)" }}>
            The load behind this vocabulary is growing: data centers consumed about 1.5% of global
            electricity in 2025, heading toward roughly 3% by 2030 per the IEA,<Cite n={5} /> and 4.4%
            of US electricity in 2023, projected at 6.7–12% by 2028 per LBNL.<Cite n={4} />
          </p>

          <div style={{ marginTop: "1.6rem" }}>
            <LastVerified
              published="2026-08-31"
              lastVerified="2026-08-31"
              author="Josef Elimelech"
              reviewer="PODOS AI Engineering"
            />
          </div>

          {/* decorative header plate — registry alt is intentionally empty */}
          <div style={{ marginTop: "clamp(2rem, 5vh, 3rem)", maxWidth: 900 }}>
            <SeoImage id="glossary-abstract" priority />
          </div>
        </div>
      </section>

      {/* ---- term index ---- */}
      <section>
        <div className="container-site" style={{ paddingTop: "clamp(2.5rem, 6vh, 4rem)" }}>
          <h2 className="t-eyebrow" style={{ ...mono, letterSpacing: "0.16em" }}>
            Term index — 40 entries
          </h2>
          <nav aria-label="Glossary term index" style={{ marginTop: "1rem" }}>
            <ul style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", listStyle: "none" }}>
              {TERMS.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="transition-colors hover:border-[var(--brand)] hover:text-[var(--brand-deep)]"
                    style={{
                      ...mono,
                      display: "inline-block",
                      fontSize: "0.72rem",
                      letterSpacing: "0.06em",
                      color: "var(--ink-dim)",
                      border: "1px solid var(--edge)",
                      borderRadius: 999,
                      padding: "0.35rem 0.75rem",
                      textDecoration: "none",
                      minHeight: 36,
                    }}
                  >
                    {t.term}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* ---- efficiency metrics table ---- */}
      <section>
        <div className="container-site" style={{ paddingTop: "clamp(3rem, 7vh, 4.5rem)" }}>
          <h2 style={h2Style}>Efficiency metrics, side by side</h2>
          <p className="t-body" style={{ marginTop: "0.7rem", maxWidth: "62ch", color: "var(--ink-dim)" }}>
            All three share a denominator — IT energy — but answer different questions. Compare them
            only with measurement boundary and season stated.
          </p>

          <div
            className="panel overflow-x-auto"
            style={{ marginTop: "1.4rem", borderRadius: 12, border: "1px solid var(--edge)", background: "var(--panel)" }}
          >
            <table style={{ width: "100%", minWidth: 760, borderCollapse: "collapse", fontSize: "0.92rem" }}>
              <thead>
                <tr>
                  {["Metric", "Formula", "What it tells you", "Published reference points", "Common distortions"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      style={{
                        ...mono,
                        textAlign: "left",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--ink-dim)",
                        padding: "0.9rem 1rem",
                        borderBottom: "1px solid var(--edge)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    m: "PUE",
                    f: "Total facility energy ÷ IT energy",
                    w: "Overhead spent on cooling, conversion, and building systems",
                    r: (
                      <>
                        Industry average roughly flat for ~6 years<Cite n={1} />; Google fleet TTM 1.09
                        <Cite n={2} />
                      </>
                    ),
                    d: "Snapshot vs annualized figures; partially loaded facilities read worse",
                  },
                  {
                    m: "WUE",
                    f: "Site water (L) ÷ IT energy (kWh)",
                    w: "Water consumed on site, mostly by evaporative cooling",
                    r: (
                      <>
                        Microsoft design WUE 0.30 L/kWh, down from 0.49 in 2021<Cite n={3} />
                      </>
                    ),
                    d: "Excludes water embedded in off-site electricity generation",
                  },
                  {
                    m: "ERE",
                    f: "(Total energy − reused energy) ÷ IT energy",
                    w: "Efficiency after crediting heat exported to a real customer",
                    r: (
                      <>
                        Can fall below 1.0 with heat export; NREL&rsquo;s ESIF pairs heat reuse with PUE
                        ~1.04<Cite n={8} />
                      </>
                    ),
                    d: "Meaningless without an actual off-taker for the heat",
                  },
                ].map((row) => (
                  <tr key={row.m}>
                    <td style={{ ...mono, fontWeight: 600, color: "var(--brand-deep)", padding: "0.9rem 1rem", borderBottom: "1px solid var(--edge-faint)", verticalAlign: "top" }}>
                      {row.m}
                    </td>
                    <td style={{ padding: "0.9rem 1rem", borderBottom: "1px solid var(--edge-faint)", color: "var(--ink-strong)", verticalAlign: "top" }}>{row.f}</td>
                    <td style={{ padding: "0.9rem 1rem", borderBottom: "1px solid var(--edge-faint)", color: "var(--ink-dim)", verticalAlign: "top" }}>{row.w}</td>
                    <td style={{ padding: "0.9rem 1rem", borderBottom: "1px solid var(--edge-faint)", color: "var(--ink-dim)", verticalAlign: "top" }}>{row.r}</td>
                    <td style={{ padding: "0.9rem 1rem", borderBottom: "1px solid var(--edge-faint)", color: "var(--ink-dim)", verticalAlign: "top" }}>{row.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---- the glossary ---- */}
      <section>
        <div className="container-site" style={{ paddingTop: "clamp(3rem, 7vh, 4.5rem)" }}>
          <h2 style={h2Style}>Terms, A to Z</h2>
          <dl style={{ marginTop: "0.5rem", maxWidth: "72ch" }}>
            {TERMS.map((t) => (
              <div key={t.id} style={{ borderBottom: "1px solid var(--edge-faint)", padding: "1.35rem 0" }}>
                <dt
                  id={t.id}
                  className="scroll-mt-24"
                  style={{
                    fontFamily: "var(--font-geist), var(--font-display), ui-sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    letterSpacing: "-0.02em",
                    color: "var(--ink-strong)",
                    scrollMarginTop: 96,
                  }}
                >
                  {t.term}
                </dt>
                <dd className="t-body" style={{ marginTop: "0.45rem", color: "var(--ink-dim)" }}>
                  {t.def}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- limitations ---- */}
      <section>
        <div className="container-site" style={{ paddingTop: "clamp(3rem, 7vh, 4.5rem)" }}>
          <h2 style={h2Style}>What this glossary does not settle</h2>
          <ul
            className="t-body"
            style={{ marginTop: "1rem", maxWidth: "68ch", color: "var(--ink-dim)", display: "grid", gap: "0.7rem", paddingLeft: "1.2rem" }}
          >
            <li>
              Definitions reflect common industry usage; vendors attach narrower or looser meanings to
              terms like &ldquo;pod&rdquo; and &ldquo;AI-ready.&rdquo; Contracts should define terms
              explicitly.
            </li>
            <li>
              Every metric here depends on measurement boundary and season. A PUE or WUE quoted without
              methodology, load level, and averaging period is not comparable to one quoted with them.
            </li>
            <li>
              ASHRAE, NFPA, and IEEE standards are paywalled; these entries summarize scope and do not
              substitute for the current editions.
            </li>
            <li>
              Where PODOS figures appear they are design targets, not measured results from operating
              deployments. Third-party numbers carry their source and as-of year inline.
            </li>
            <li>
              The vocabulary is moving — 800 VDC distribution, for one, is still being standardized.
              These definitions were last verified on 2026-08-31.
            </li>
          </ul>
        </div>
      </section>

      {/* ---- related reading ---- */}
      <section>
        <div
          className="container-site"
          style={{ paddingTop: "clamp(3rem, 7vh, 4.5rem)", paddingBottom: "clamp(4rem, 9vh, 6rem)" }}
        >
          <h2 className="t-eyebrow" style={{ ...mono, letterSpacing: "0.16em" }}>
            Go deeper
          </h2>
          <ul
            className="t-body"
            style={{ marginTop: "1rem", display: "grid", gap: "0.6rem", listStyle: "none", color: "var(--ink-dim)" }}
          >
            <li>{link("/engineering", "Engineering overview")} — how the cooling, power, and enclosure decisions fit together.</li>
            <li>{link("/platform", "Platform overview")} — what a standardized modular AI data-center unit is.</li>
            <li>{link("/compare/modular-ai-data-center-vs-traditional-data-center", "Modular vs traditional data centers")} — the decision framework behind the vocabulary.</li>
            <li>
              {link("/", "PODOS AI")} builds factory-built modular AI compute infrastructure; investor
              information lives on the {link("/invest", "invest page")}.
            </li>
          </ul>

          <EvidenceSourceRail sources={SOURCES} />
        </div>
      </section>
    </main>
      <Footer />
    </>
  );
}
