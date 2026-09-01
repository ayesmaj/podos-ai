/**
 * /platform/syntropic — Syntropic, the PODOS AI inference-efficiency
 * software layer. Server component; SEO batch 2026-08-31.
 *
 * Claims discipline: only publishable entries from src/content/data/claims.ts
 * are rendered, each wrapped in data-claim with its required qualifier.
 * No benchmarks, no percentages of Syntropic performance, no model names
 * as validated results — the layer is described honestly as in development.
 */

import type { CSSProperties } from "react";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd, FAQJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import SeoImage from "@/components/seo/SeoImage";

export const metadata = buildMetadata({
  title: "Syntropic: AI Inference Memory Efficiency Software | PODOS",
  description:
    "Syntropic is the PODOS AI software layer in development to reduce KV-cache and GPU memory overhead in LLM inference: problem space, design goals, and status.",
  path: "/platform/syntropic",
});

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Efficient Memory Management for Large Language Model Serving with PagedAttention (Kwon et al., SOSP 2023)",
    publisher: "arXiv (2309.06180)",
    url: "https://arxiv.org/abs/2309.06180",
    date: "Sep 2023",
  },
  {
    n: 2,
    name: "TurboQuant: Online Vector Quantization with Near-optimal Distortion Rate",
    publisher: "arXiv (2504.19874)",
    url: "https://arxiv.org/abs/2504.19874",
    date: "Apr 2025",
  },
  {
    n: 3,
    name: "Statistical Inference and Quality Measures of KV Cache Quantisations Inspired by TurboQuant (D'Alberto)",
    publisher: "arXiv (2605.08114)",
    url: "https://arxiv.org/abs/2605.08114",
    date: "2026",
  },
  {
    n: 4,
    name: "Energy and AI — Executive Summary",
    publisher: "IEA",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
    date: "Apr 2025",
  },
  {
    n: 5,
    name: "2024 United States Data Center Energy Usage Report (LBNL-2001637, Shehabi et al.)",
    publisher: "Lawrence Berkeley National Laboratory",
    url: "https://eta.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report",
    date: "Dec 2024",
  },
  {
    n: 6,
    name: "GB200 NVL72 product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    date: "spec page",
  },
];

const FAQS = [
  {
    q: "What is Syntropic?",
    a: "Syntropic is the inference-efficiency software layer of the PODOS AI platform. It is in development and is designed to reduce KV-cache and GPU memory overhead when serving large language models.",
  },
  {
    q: "Is Syntropic available today?",
    a: "No. Syntropic is in development and not generally available, and no release date has been published. This page is updated as the status changes.",
  },
  {
    q: "Why does this page publish no performance numbers?",
    a: "PODOS holds efficiency claims to a published-methodology bar: model, hardware, baseline configuration, and limitations disclosed together. No Syntropic result currently meets that bar publicly, so no numbers appear here.",
  },
  {
    q: "Does Syntropic require PODOS hardware?",
    a: "Syntropic is developed as part of the PODOS platform and is designed to complement the PODOS Pod. Compatibility details beyond the platform will be published as the software approaches availability.",
  },
];

/* Documented recipes from docs/seo/design-language-lock.md §4.2–4.3 */
const mono: CSSProperties = { fontFamily: "var(--font-mono), monospace" };

const eyebrowPill: CSSProperties = {
  ...mono,
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
  padding: "0.35rem 0.9rem",
};

const codePill: CSSProperties = {
  ...mono,
  display: "inline-block",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  color: "var(--brand-deep)",
  background: "rgba(37,99,235,0.07)",
  border: "1px solid rgba(37,99,235,0.16)",
  borderRadius: 999,
  padding: "0.2rem 0.7rem",
};

const microLabel: CSSProperties = {
  ...mono,
  fontSize: "0.66rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
};

const th: CSSProperties = {
  ...microLabel,
  textAlign: "left",
  padding: "0.7rem 0.9rem",
  borderBottom: "1px solid var(--edge-bright)",
  whiteSpace: "nowrap",
};

const td: CSSProperties = {
  padding: "0.75rem 0.9rem",
  borderBottom: "1px solid var(--edge-faint)",
  fontSize: "0.92rem",
  lineHeight: 1.55,
  color: "var(--ink-dim)",
  verticalAlign: "top",
};

const tdLead: CSSProperties = { ...td, color: "var(--ink-strong)", fontWeight: 500 };

const DESIGN_GOALS = [
  {
    code: "SY-01",
    title: "Cache footprint reduction",
    body: "Reduce the per-token memory cost of the KV cache, so a fixed pool of GPU memory is designed to serve longer contexts or more concurrent requests without new hardware.",
  },
  {
    code: "SY-02",
    title: "Quality preservation",
    body: "An efficiency technique is only useful if output quality survives it. Syntropic's development bar is quality-first: quality claims will be published with full methodology or not at all.",
  },
  {
    code: "SY-03",
    title: "Measurable utilization",
    body: "Make GPU memory utilization observable, so operators can see how much of an accelerator's memory is doing useful work at a given moment rather than estimating it.",
  },
  {
    code: "SY-04",
    title: "Platform integration",
    body: "Operate alongside the PODOS Pod hardware, so software efficiency and facility efficiency are designed to compound inside one platform instead of being procured separately.",
  },
];

export default function SyntropicPage() {
  return (
    <>
      <SiteHeader />
    <main style={{ background: "var(--paper)" }}>
      <TechArticleJsonLd
        headline="Syntropic: the AI inference-efficiency software layer"
        description="What the KV-cache memory bottleneck in LLM inference is, what the Syntropic software layer is designed to do about it, and where development stands."
        path="/platform/syntropic"
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />
      <FAQJsonLd items={FAQS} />

      {/* ---- Compact hero ---- */}
      <section
        style={{ borderBottom: "1px solid var(--edge-faint)" }}
        className="overflow-x-clip"
      >
        <div
          className="container-site"
          style={{ paddingTop: "clamp(7rem, 16vh, 11rem)", paddingBottom: "clamp(3rem, 7vh, 5rem)" }}
        >
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "Platform", path: "/platform" },
              { name: "Syntropic", path: "/platform/syntropic" },
            ]}
          />

          <p style={{ ...eyebrowPill, marginTop: "2.2rem" }}>
            <span style={{ fontWeight: 800, color: "var(--cyan-deep)" }}>PLT-02</span>
            <span aria-hidden style={{ opacity: 0.4 }}>·</span>
            SOFTWARE LAYER
          </p>

          <h1 className="t-headline" style={{ marginTop: "1.4rem", maxWidth: "16ch" }}>
            <span className="t-sweep-brand">Syntropic</span>: the inference-efficiency software layer
          </h1>

          <p className="t-lede" style={{ marginTop: "1.4rem", maxWidth: "62ch" }}>
            Syntropic is the software layer of the PODOS AI platform: an inference-efficiency
            system, currently in development, designed to reduce the memory overhead of serving
            large language models. Its primary focus is the KV cache — the fastest-growing
            consumer of GPU memory during LLM inference — and the broader question of how much
            of an accelerator&rsquo;s memory does useful work at any moment. This page explains the
            problem space, what the layer is designed to do, and where development honestly stands.
          </p>

          <figure style={{ marginTop: "2.6rem", maxWidth: 900 }}>
            <SeoImage id="syntropic-memory-abstract" priority />
            <figcaption style={{ ...microLabel, marginTop: "0.8rem" }}>
              THE KV CACHE — ATTENTION STATE HELD IN GPU MEMORY DURING GENERATION
            </figcaption>
          </figure>

          <div style={{ marginTop: "1.8rem" }}>
            <LastVerified
              published="2026-08-31"
              lastVerified="2026-08-31"
              author="Josef Elimelech"
              reviewer="PODOS AI Engineering"
            />
          </div>
        </div>
      </section>

      {/* ---- 01 · The problem ---- */}
      <section className="section-pad overflow-x-clip" style={{ borderBottom: "1px solid var(--edge-faint)" }}>
        <div className="container-site" style={{ maxWidth: 1080 }}>
          <p style={microLabel}>01 · PROBLEM SPACE</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.06,
              color: "var(--ink-strong)",
              marginTop: "0.9rem",
              maxWidth: "24ch",
            }}
          >
            The memory bottleneck in LLM inference
          </h2>

          <div className="t-body" style={{ marginTop: "1.6rem", maxWidth: "70ch", display: "grid", gap: "1.1rem" }}>
            <p>
              Large language model inference is frequently bound by memory, not arithmetic. During
              generation, a transformer stores key and value tensors — the KV cache — for every
              token, in every attention layer, so earlier tokens do not have to be recomputed at
              each decoding step. That cache grows linearly with sequence length and with the
              number of concurrent requests, and it competes for the same GPU memory that holds
              the model weights.<Cite n={1} />
            </p>
            <p>
              The result is a throughput ceiling that has little to do with raw compute. Research
              on production serving systems measured that pre-paging LLM serving frameworks used
              as little as roughly 20 to 40 percent of allocated KV-cache memory for actual token
              states, with the remainder lost to fragmentation and over-reservation (Kwon et al.,
              2023).<Cite n={1} /> The same work introduced paged memory management for the KV
              cache — handling GPU memory the way an operating system pages RAM — precisely
              because contiguous per-request allocation wastes so much of it.
            </p>
            <p>
              Compression is the second active front. Quantization research indicates the KV cache
              can be stored at roughly 3.5 bits per channel while remaining close to baseline
              output quality, and at around 2.5 bits with marginal loss (TurboQuant, 2025).
              <Cite n={2} /> Follow-on work concentrates on how to measure the quality impact of
              KV-cache quantization rigorously rather than anecdotally.<Cite n={3} /> The
              direction of the public literature is consistent: substantial headroom exists
              between how inference systems store attention state today and what models actually
              need to preserve their behavior.
            </p>
          </div>

          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.15rem, 1.8vw, 1.4rem)",
              letterSpacing: "-0.02em",
              color: "var(--ink-strong)",
              marginTop: "2.6rem",
            }}
          >
            Why a facility company cares about kilobytes per token
          </h3>
          <div className="t-body" style={{ marginTop: "1rem", maxWidth: "70ch", display: "grid", gap: "1.1rem" }}>
            <p>
              Memory efficiency compounds into infrastructure economics. Data centres consumed
              around 1.5 percent of global electricity in 2025, a share the IEA projects to
              roughly double to about 3 percent — around 945 TWh — by 2030, with AI as the main
              driver (IEA, 2025).<Cite n={4} /> In the United States, data centres drew 4.4
              percent of national electricity in 2023, projected by Lawrence Berkeley National
              Laboratory to reach 6.7 to 12 percent by 2028 (LBNL, 2024).<Cite n={5} /> The
              hardware serving inference keeps densifying in parallel: NVIDIA&rsquo;s GB200 NVL72
              packages 72 GPUs into a single liquid-cooled, rack-scale NVLink domain built for
              exactly these workloads.<Cite n={6} /> Every point of memory utilization recovered
              in software is inference capacity that does not have to be built, powered, and
              cooled as new floor space.
            </p>
          </div>

          {/* Growth-driver table */}
          <div
            className="panel overflow-x-auto"
            style={{ marginTop: "2.4rem", padding: "0.4rem 0.2rem" }}
          >
            <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse" }}>
              <caption
                style={{
                  ...microLabel,
                  captionSide: "top",
                  textAlign: "left",
                  padding: "0.9rem 0.9rem 0.5rem",
                }}
              >
                TABLE 01 · WHAT DRIVES KV-CACHE GROWTH
              </caption>
              <thead>
                <tr>
                  <th style={th} scope="col">Driver</th>
                  <th style={th} scope="col">How it scales</th>
                  <th style={th} scope="col">Operational consequence</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdLead}>Sequence length</td>
                  <td style={td}>Linear — per token, per layer, per attention head</td>
                  <td style={td}>
                    Long-context and multi-step reasoning workloads inflate the cache faster than
                    they raise useful throughput
                  </td>
                </tr>
                <tr>
                  <td style={tdLead}>Concurrent requests</td>
                  <td style={td}>Linear — one cache per in-flight request</td>
                  <td style={td}>
                    Serving capacity hits the memory ceiling before the compute ceiling; batch
                    size becomes a memory decision
                  </td>
                </tr>
                <tr>
                  <td style={tdLead}>Model architecture</td>
                  <td style={td}>Fixed multiplier — layers × heads × head dimension</td>
                  <td style={td}>
                    Larger models raise the per-token memory price of every conversation they hold
                  </td>
                </tr>
                <tr>
                  <td style={tdLead}>Numeric precision</td>
                  <td style={td}>Bytes per element — 16-bit floating point as the common baseline</td>
                  <td style={td}>
                    Quantization toward roughly 4 bits per channel and below is an active research
                    frontier<Cite n={2} />
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdLead, borderBottom: "none" }}>Allocation strategy</td>
                  <td style={{ ...td, borderBottom: "none" }}>
                    Overhead — fragmentation and over-reservation
                  </td>
                  <td style={{ ...td, borderBottom: "none" }}>
                    Measured 20–40 percent utilization in pre-paging serving systems; paging
                    recovers most of the loss<Cite n={1} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---- 02 · Design goals ---- */}
      <section className="section-pad overflow-x-clip" style={{ borderBottom: "1px solid var(--edge-faint)" }}>
        <div className="container-site" style={{ maxWidth: 1080 }}>
          <p style={microLabel}>02 · DESIGN GOALS</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.06,
              color: "var(--ink-strong)",
              marginTop: "0.9rem",
              maxWidth: "24ch",
            }}
          >
            What Syntropic is designed to do
          </h2>
          <p className="t-body" style={{ marginTop: "1.4rem", maxWidth: "70ch" }}>
            Syntropic approaches the problem above as an infrastructure question rather than a
            model question: the memory a serving stack wastes is capacity an operator already
            paid for. The layer is being developed around four design goals. These are goals for
            a system in development — not shipped capabilities, and not performance claims.
          </p>

          <figure style={{ marginTop: "2.2rem", maxWidth: 900 }}>
            <SeoImage id="syntropic-datapath" />
            <figcaption style={{ ...microLabel, marginTop: "0.8rem" }}>
              DESIGN GOALS SY-01 AND SY-03 — SMALLER CACHE FOOTPRINT, OBSERVABLE UTILIZATION
            </figcaption>
          </figure>

          <div
            style={{
              marginTop: "2.2rem",
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {DESIGN_GOALS.map((g) => (
              <article key={g.code} className="panel card-lift" style={{ padding: "1.4rem 1.4rem 1.5rem" }}>
                <p style={codePill}>{g.code}</p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.08rem",
                    letterSpacing: "-0.02em",
                    color: "var(--ink-strong)",
                    marginTop: "0.9rem",
                  }}
                >
                  {g.title}
                </h3>
                <p className="t-body" style={{ marginTop: "0.55rem", fontSize: "0.92rem" }}>{g.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- 03 · Evaluation checklist ---- */}
      <section className="section-pad overflow-x-clip" style={{ borderBottom: "1px solid var(--edge-faint)" }}>
        <div className="container-site" style={{ maxWidth: 1080 }}>
          <p style={microLabel}>03 · EVALUATION STANDARD</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.06,
              color: "var(--ink-strong)",
              marginTop: "0.9rem",
              maxWidth: "26ch",
            }}
          >
            How to evaluate any inference-efficiency claim
          </h2>
          <p className="t-body" style={{ marginTop: "1.4rem", maxWidth: "70ch" }}>
            The efficiency-software market is full of percentages with no context attached. The
            checklist below is the bar PODOS applies to vendor claims — including, when they are
            eventually published, its own.
          </p>

          <div className="panel overflow-x-auto" style={{ marginTop: "2.2rem", padding: "0.4rem 0.2rem" }}>
            <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse" }}>
              <caption
                style={{
                  ...microLabel,
                  captionSide: "top",
                  textAlign: "left",
                  padding: "0.9rem 0.9rem 0.5rem",
                }}
              >
                TABLE 02 · BUYER&rsquo;S CHECKLIST FOR EFFICIENCY CLAIMS
              </caption>
              <thead>
                <tr>
                  <th style={th} scope="col">Question to ask</th>
                  <th style={th} scope="col">Why it matters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdLead}>
                    Is the full methodology published — model, hardware, baseline configuration,
                    and dates?
                  </td>
                  <td style={td}>A percentage without a disclosed baseline is marketing, not measurement</td>
                </tr>
                <tr>
                  <td style={tdLead}>
                    Is quality measured on task-relevant metrics, not only perplexity?
                  </td>
                  <td style={td}>
                    Cache compression can leave aggregate metrics intact while degrading specific
                    downstream behavior; measurement methodology is its own research problem
                    <Cite n={3} />
                  </td>
                </tr>
                <tr>
                  <td style={tdLead}>Are results reported on more than one hardware platform?</td>
                  <td style={td}>
                    Memory behavior differs across accelerator generations and memory hierarchies
                  </td>
                </tr>
                <tr>
                  <td style={tdLead}>
                    Is the baseline a modern paged serving stack, not a naive allocator?
                  </td>
                  <td style={td}>
                    Paged allocation already recovers most fragmentation waste; beating an
                    obsolete baseline overstates the gain<Cite n={1} />
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdLead, borderBottom: "none" }}>
                    Are limitations and failure cases stated?
                  </td>
                  <td style={{ ...td, borderBottom: "none" }}>
                    Every compression scheme has workloads where it underperforms; a claim without
                    caveats has not been tested hard enough
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="t-body" style={{ marginTop: "1.4rem", maxWidth: "70ch" }}>
            PODOS publishes no Syntropic performance numbers today because no result currently
            meets this bar publicly. When numbers appear on this page, they will arrive with the
            methodology attached.
          </p>
        </div>
      </section>

      {/* ---- 04 · Platform context ---- */}
      <section className="section-pad overflow-x-clip" style={{ borderBottom: "1px solid var(--edge-faint)" }}>
        <div className="container-site" style={{ maxWidth: 1080 }}>
          <p style={microLabel}>04 · PLATFORM CONTEXT</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.06,
              color: "var(--ink-strong)",
              marginTop: "0.9rem",
              maxWidth: "26ch",
            }}
          >
            Where Syntropic sits in the PODOS platform
          </h2>

          <div className="t-body" style={{ marginTop: "1.6rem", maxWidth: "70ch", display: "grid", gap: "1.1rem" }}>
            <p>
              PODOS AI treats AI infrastructure as one integrated{" "}
              <Link href="/platform" style={{ color: "var(--brand)", textDecoration: "underline" }}>
                modular AI data center platform
              </Link>
              : hardware that compresses how fast compute can be deployed, and software that
              raises how much useful work that compute does. The hardware unit is the{" "}
              <Link href="/platform/podos-pod" style={{ color: "var(--brand)", textDecoration: "underline" }}>
                PODOS Pod
              </Link>
              ,{" "}
              <span data-claim="unit-capacity-1mw">
                designed as a standardized 1-MW building block for AI infrastructure
              </span>{" "}
              and <span data-claim="pod-gpu-capacity">designed for 128 GPUs per pod</span>. Its
              thermal and electrical systems are covered in the{" "}
              <Link
                href="/engineering/direct-to-chip-liquid-cooling"
                style={{ color: "var(--brand)", textDecoration: "underline" }}
              >
                direct-to-chip liquid cooling explainer
              </Link>{" "}
              and the{" "}
              <Link
                href="/engineering/data-center-power-architecture"
                style={{ color: "var(--brand)", textDecoration: "underline" }}
              >
                data center power architecture explainer
              </Link>
              , with the wider engineering approach on the{" "}
              <Link href="/engineering" style={{ color: "var(--brand)", textDecoration: "underline" }}>
                engineering hub
              </Link>
              .
            </p>
            <p>
              On the deployment side,{" "}
              <span data-claim="deployment-window">
                PODOS targets a 90-day window from order to commissioning for a standard unit
              </span>{" "}
              — the reasoning behind that target is laid out on the{" "}
              <Link href="/deploy" style={{ color: "var(--brand)", textDecoration: "underline" }}>
                deployment model page
              </Link>
              . Syntropic is the software counterpart to that hardware thesis: where the pod is
              designed to compress the time between deciding to own compute and operating it,
              Syntropic is designed to raise the useful work extracted from the GPUs inside. The
              intended beneficiaries are the same organizations described across the{" "}
              <Link href="/use-cases" style={{ color: "var(--brand)", textDecoration: "underline" }}>
                platform use cases
              </Link>{" "}
              — teams running inference on infrastructure they control.
            </p>
            <p>
              For the vocabulary used on this page — KV cache, quantization, NVLink domain, PUE
              and related terms — see the{" "}
              <Link
                href="/resources/ai-infrastructure-glossary"
                style={{ color: "var(--brand)", textDecoration: "underline" }}
              >
                AI infrastructure glossary
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ---- 05 · Status & limitations ---- */}
      <section className="section-pad overflow-x-clip" style={{ borderBottom: "1px solid var(--edge-faint)" }}>
        <div className="container-site" style={{ maxWidth: 1080 }}>
          <p style={microLabel}>05 · STATUS</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.06,
              color: "var(--ink-strong)",
              marginTop: "0.9rem",
              maxWidth: "24ch",
            }}
          >
            Development status and limitations
          </h2>

          <ul
            className="t-body"
            style={{ marginTop: "1.6rem", maxWidth: "70ch", display: "grid", gap: "0.9rem", paddingLeft: "1.1rem", listStyle: "disc" }}
          >
            <li>
              Syntropic is in development. It is not generally available, and no availability
              date has been published.
            </li>
            <li>
              No performance benchmarks are published. Internal results exist but do not yet meet
              the public-methodology bar described above, so this page carries no numbers by
              design.
            </li>
            <li>
              No customers, pilots, or production deployments are claimed. PODOS is a
              pre-revenue company; figures identified as targets are not guarantees.
            </li>
            <li>
              The problem framing on this page rests on cited public research, not on PODOS
              measurements. Where the literature moves, this page will be re-verified — the
              header carries the last-verified date.
            </li>
            <li>
              Readers evaluating PODOS as a company rather than as a vendor can find the
              interest-stage overview on the{" "}
              <Link href="/invest" style={{ color: "var(--brand)", textDecoration: "underline" }}>
                investor information page
              </Link>
              .
            </li>
          </ul>
        </div>
      </section>

      {/* ---- 06 · FAQ ---- */}
      <section className="section-pad overflow-x-clip">
        <div className="container-site" style={{ maxWidth: 1080 }}>
          <p style={microLabel}>06 · FAQ</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.06,
              color: "var(--ink-strong)",
              marginTop: "0.9rem",
            }}
          >
            Frequently asked questions
          </h2>

          <div style={{ marginTop: "2rem", display: "grid", gap: "1rem", maxWidth: 820 }}>
            {FAQS.map((f) => (
              <div key={f.q} className="panel" style={{ padding: "1.3rem 1.4rem" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.02rem",
                    letterSpacing: "-0.015em",
                    color: "var(--ink-strong)",
                  }}
                >
                  {f.q}
                </h3>
                <p className="t-body" style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>{f.a}</p>
              </div>
            ))}
          </div>

          <EvidenceSourceRail sources={SOURCES} />
        </div>
      </section>
    </main>
      <Footer />
    </>
  );
}
