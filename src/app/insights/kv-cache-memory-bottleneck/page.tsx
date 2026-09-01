/**
 * /insights/kv-cache-memory-bottleneck — Archetype E, insight /
 * thought leadership. See docs/design/PAGE_ARCHETYPES.md.
 *
 * Server component, zero client JS. Composed from the section library
 * (src/components/seo/sections.tsx). Original asset: a worked KV-cache
 * calculation derived from published Llama 3 hyperparameters and NVIDIA
 * H200 specs, plus an arithmetic-intensity derivation. Every external
 * number cites the source register; company claims render only from
 * claims.ts publishable entries with their required qualifiers.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { TechArticleJsonLd } from "@/components/seo/jsonld";
import { EvidenceSourceRail, Cite, type Source } from "@/components/seo/EvidenceSource";
import LastVerified from "@/components/seo/LastVerified";
import {
  HeroEditorial,
  ExecutiveAnswer,
  SummaryBand,
  ProseWithRail,
  MatrixTable,
  QuoteMetric,
  CardGrid,
  LimitsBlock,
  RelatedRail,
  CTABand,
  Section,
  SectionHead,
} from "@/components/seo/sections";

const PATH = "/insights/kv-cache-memory-bottleneck";
const TITLE = "KV Cache Math: Why Memory, Not FLOPs, Binds Inference";
const DESCRIPTION =
  "A worked calculation of KV-cache growth in LLM serving, and why HBM capacity and bandwidth — not tensor-core FLOPs — set the concurrency ceiling of a node.";

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const link = { color: "var(--brand-deep)", textDecoration: "underline" } as const;

const formula = {
  fontFamily: "var(--font-body)",
  fontSize: "0.88rem",
  lineHeight: 1.75,
  color: "var(--ink-strong)",
  background: "var(--glass-bg-strong)",
  border: "1px solid var(--edge-bright)",
  borderRadius: 12,
  padding: "1rem 1.1rem",
  marginTop: "1.5rem",
  overflowX: "auto" as const,
};

const num = {
  fontFamily: "var(--font-body)",
  fontVariantNumeric: "tabular-nums" as const,
  whiteSpace: "nowrap" as const,
};

const SOURCES: Source[] = [
  {
    n: 1,
    name: "Fast Transformer Decoding: One Write-Head is All You Need (arXiv:1911.02150)",
    publisher: "Noam Shazeer",
    url: "https://arxiv.org/abs/1911.02150",
    date: "Nov 2019",
  },
  {
    n: 2,
    name: "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints (arXiv:2305.13245)",
    publisher: "Ainslie et al.",
    url: "https://arxiv.org/abs/2305.13245",
    date: "May 2023",
  },
  {
    n: 3,
    name: "Efficiently Scaling Transformer Inference (arXiv:2211.05102)",
    publisher: "Pope et al., Google",
    url: "https://arxiv.org/abs/2211.05102",
    date: "Nov 2022",
  },
  {
    n: 4,
    name: "Efficient Memory Management for Large Language Model Serving with PagedAttention (arXiv:2309.06180, SOSP 2023)",
    publisher: "Kwon et al.",
    url: "https://arxiv.org/abs/2309.06180",
    date: "Sep 2023",
  },
  {
    n: 5,
    name: "The Llama 3 Herd of Models — Table 3, key hyperparameters (arXiv:2407.21783)",
    publisher: "Llama Team, Meta AI",
    url: "https://arxiv.org/abs/2407.21783",
    date: "Jul 2024",
  },
  {
    n: 6,
    name: "H200 Tensor Core GPU product page — 141GB HBM3e, 4.8TB/s, 1,979 FP16 TFLOPS (with sparsity)",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/h200/",
    date: "accessed 2026-08-31",
  },
  {
    n: 7,
    name: "NVLink and NVLink Switch product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/nvlink/",
    date: "accessed 2026-08-31",
  },
  {
    n: 8,
    name: "GB200 NVL72 product page",
    publisher: "NVIDIA",
    url: "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
    date: "accessed 2026-08-31",
  },
  {
    n: 9,
    name: "DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model (arXiv:2405.04434)",
    publisher: "DeepSeek-AI",
    url: "https://arxiv.org/abs/2405.04434",
    date: "May 2024",
  },
  {
    n: 10,
    name: "TurboQuant: Online Vector Quantization with Near-optimal Distortion Rate (arXiv:2504.19874)",
    publisher: "Zandieh et al.",
    url: "https://arxiv.org/abs/2504.19874",
    date: "Apr 2025",
  },
];

const TOC: [string, string][] = [
  ["#answer", "The short answer"],
  ["#bytes-per-token", "Bytes per token"],
  ["#worked-calculation", "The calculation"],
  ["#three-numbers", "Three numbers"],
  ["#arithmetic-intensity", "Why batching fails"],
  ["#operators", "For operators"],
  ["#limitations", "What it does not prove"],
];

/* Fig. 1 — per-token KV footprint, derived from [5]. */
const SHAPES: string[][] = [
  ["8B", "32", "32", "8", "128 KiB", "512 KiB"],
  ["70B", "80", "64", "8", "320 KiB", "2,560 KiB"],
  ["405B", "126", "128", "8", "504 KiB", "8,064 KiB"],
];

/* Fig. 2 — KV cache GiB, 70B shape, FP16. Bold = over the 815 GiB budget. */
const GRID: string[][] = [
  ["4,096 (4K)", "1.25", "10", "40", "160"],
  ["32,768 (32K)", "10", "80", "320", "1,280"],
  ["131,072 (128K)", "40", "320", "1,280", "5,120"],
];
const OVER = new Set(["1,280", "5,120"]);

/* Fig. 3 — decode-attention arithmetic intensity by attention scheme. */
const INTENSITY: string[][] = [
  ["MHA", "64", "1", "0.5%"],
  ["GQA 8:1 (Llama 3 shape)", "8", "8", "3.9%"],
  ["MQA", "1", "64", "31%"],
];

const cell = (v: string, i: number, emphasise = false): ReactNode => (
  <span
    key={i}
    style={{ ...num, ...(emphasise ? { color: "var(--ink-strong)", fontWeight: 600 } : null) }}
  >
    {v}
  </span>
);

export default function KvCacheMemoryBottleneckPage() {
  return (
    <main>
      <TechArticleJsonLd
        headline="KV cache math: why memory, not FLOPs, binds LLM inference"
        description={DESCRIPTION}
        path={PATH}
        datePublished="2026-08-31"
        dateModified="2026-08-31"
        authorName="Josef Elimelech"
        articleType="TechArticle"
      />

      {/* 1 · EDITORIAL HERO */}
      <HeroEditorial
        category="Inference economics"
        title="The KV cache is why inference is"
        accent="memory-bound"
        lede="In large-language-model serving the binding constraint is usually memory, not arithmetic. The key-value (KV) cache grows linearly with context length and with the number of concurrent sequences, and — unlike model weights — it is not shared across a batch. On an eight-GPU H200 node serving a Llama-3-70B-shaped model in FP16, the cache overtakes the model itself at roughly 427,000 tokens of live context, and the attention step that reads it runs at about 4% of the accelerator's FLOP-per-byte ridge point. Capacity planning that counts TFLOPS will size the wrong machine."
        crumbs={
          <Breadcrumbs
            crumbs={[
              { name: "Home", path: "/" },
              { name: "KV cache memory bottleneck", path: PATH },
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
          { value: "320 KiB", label: "KV per token · 70B shape, FP16" },
          { value: "427,000", label: "Tokens before cache exceeds weights" },
          { value: "8 FLOP/B", label: "Decode-attention intensity" },
        ]}
      />

      {/* 2 · SUMMARY — canvas, breaks the paper hero */}
      <SummaryBand
        title="What you need to know"
        items={[
          {
            code: "01",
            title: "Cache size is arithmetic",
            body: "2 x layers x kv_heads x head_dim x bytes, times context, times concurrency. No benchmark required — published model shapes give an exact answer.",
          },
          {
            code: "02",
            title: "It does not amortise",
            body: "Batching reads the weights once for the whole batch. Every sequence still reads its own cache, in full, on every step.",
          },
          {
            code: "03",
            title: "Concurrency is the ceiling",
            body: "HBM left after the weights, divided by bytes per token, is the number of sequences a node can hold. Clock speed does not enter into it.",
          },
          {
            code: "04",
            title: "The fix is bytes, not FLOPs",
            body: "Grouped-query attention, latent attention, and KV quantization all buy the same thing: fewer bytes per cached token.",
          },
        ]}
      />

      {/* 3 · EXECUTIVE ANSWER — required */}
      <ExecutiveAnswer surface="paper">
        The KV cache binds LLM serving because it is per-sequence and read in full on every decode
        step, so batching amortises the weights but multiplies the cache. Its size is arithmetic, not
        a benchmark: 2 × layers × kv_heads × head_dim × bytes, times context, times concurrency. On
        the published Llama-3-70B shape — 80 layers, 8 KV heads, head dim 128<Cite n={5} /> — that
        is 320 KiB per token in FP16, so an eight-GPU H200 node with 1,128 GB of HBM3e<Cite n={6} /> has
        roughly 815 GiB left after weights and overhead: about 20 concurrent 128K-token sequences,
        and a cache that outweighs the model itself past ~427,000 tokens of live context. Meanwhile
        the decode-attention step reads those bytes at an arithmetic intensity of exactly
        q_heads/kv_heads — 8 FLOP per byte against a ~206 FLOP/byte ridge point, or 3.9% of the
        machine&apos;s arithmetic capability. A capacity model denominated in TFLOPS cannot see any of
        this, and will size the wrong machine.
      </ExecutiveAnswer>


      {/* 4 · WHAT IT IS — prose with sticky TOC rail */}
      <ProseWithRail
        id="bytes-per-token"
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
          eyebrow="Plain English first"
          title="What the cache actually is, and why its size is not negotiable"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            A transformer generates one token at a time, and every new token attends to every token
            before it. Rather than recompute the representation of the whole conversation on each
            step, the server keeps two vectors per token, per layer — a key and a value — and
            re-reads them. That store is the KV cache. It is not optional, and its size is not a
            matter of tuning; it is arithmetic:
          </p>
          <p style={formula}>
            bytes per token = 2 (K and V) × layers × kv_heads × head_dim × bytes_per_element
            <br />
            cache bytes = bytes_per_token × context_length × concurrent_sequences
          </p>
          <p style={{ marginTop: "1.5rem" }}>
            Nothing in that expression is a benchmark. Put a published model shape into it and the
            answer is exact. Meta publishes the shapes for Llama 3: 32 / 80 / 126 layers at 8B / 70B
            / 405B, model dimensions of 4,096 / 8,192 / 16,384, 32 / 64 / 128 attention heads, and —
            critically — 8 key/value heads at every size.<Cite n={5} /> Head dimension is model
            dimension over attention heads, which is 128 in all three cases.
          </p>
        </div>
      </ProseWithRail>

      {/* 5 · FIGURE 1 */}
      <MatrixTable
        eyebrow="Fig. 1 · Derived from [5]"
        title="What one cached token costs"
        lede="Head dim 128, two bytes per element. The last column is the counterfactual if the same shape used one KV head per query head — the reason grouped-query attention exists at all."
        surface="paper"
        field="insight"
        head={["Shape", "Layers", "Q heads", "KV heads", "FP16 KV per token", "Same shape, full MHA"]}
        rows={SHAPES.map((r) => [
          r[0],
          cell(r[1], 1),
          cell(r[2], 2),
          cell(r[3], 3),
          cell(r[4], 4, true),
          cell(r[5], 5),
        ])}
      />

      {/* 6 · THE CALCULATION */}
      <ProseWithRail id="worked-calculation" surface="canvas">
        <SectionHead
          eyebrow="The worked calculation"
          title="Assumptions on the surface, not buried in a spreadsheet"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            Shazeer named the underlying problem in 2019: incremental inference is often slow &quot;due to
            the memory-bandwidth cost of repeatedly loading the large keys and values tensors,&quot;
            and sharing one KV head across all query heads shrinks those tensors directly.
            <Cite n={1} /> GQA generalised that to an intermediate number of KV heads, reaching
            quality close to full multi-head attention at multi-query speed.<Cite n={2} /> Pope et
            al. quantified the payoff in the currency that matters here: the lower memory requirement
            of multiquery attention enabled scaling up to 32× larger context lengths.<Cite n={3} />
          </p>
          <p>
            So take a 70B-shaped model on a node of eight H200 SXM GPUs. NVIDIA lists 141GB of HBM3e
            and 4.8TB/s per GPU.<Cite n={6} /> The assumptions below are the ones worth arguing with.
          </p>
          <ul className="limits" style={{ marginTop: "1.75rem" }}>
            {[
              "Model weights held in FP16: 70B × 2 bytes = 140 GB (130 GiB).",
              "Node HBM: 8 × 141 GB = 1,128 GB (1,050 GiB).",
              "Reserve 10% of node HBM (105 GiB) for activations, workspace, graph buffers and allocator overhead.",
              "Remaining KV budget: 1,050 − 130 − 105 ≈ 815 GiB.",
              "KV in FP16 — no quantization, no prefix sharing, no offload to host memory.",
              "Cache sharded across the eight GPUs by tensor parallelism, so the pool is the node, not one GPU.",
            ].map((t) => (
              <li key={t.slice(0, 24)}>{t}</li>
            ))}
          </ul>
        </div>
      </ProseWithRail>

      {/* 7 · FIGURE 2 — the original asset */}
      <MatrixTable
        eyebrow="Fig. 2 · KV cache, 70B shape, FP16"
        title="Cache footprint by context length and concurrency"
        lede="Emphasised cells exceed the 815 GiB node budget derived above. They do not fit, at any clock speed."
        surface="paper"
        field="insight"
        head={["Context length", "1 sequence", "8 sequences", "32 sequences", "128 sequences"]}
        rows={GRID.map((r) => [
          r[0],
          ...r.slice(1).map((v, i) => cell(`${v} GiB`, i, OVER.has(v))),
        ])}
      />

      {/* 8 · THREE NUMBERS */}
      <ProseWithRail id="three-numbers" surface="canvas">
        <SectionHead
          eyebrow="Reading the table"
          title="Three numbers a FLOPs-based capacity model cannot see"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            First, the <strong>concurrency ceiling</strong>: 815 GiB divided by 40 GiB per
            full-context sequence is about 20 concurrent 128K-token sequences on that node — 81 at
            32K, roughly 650 at 4K. Second, the <strong>crossover point</strong>: at 320 KiB per
            token, the cache equals the 130 GiB of FP16 weights at about 427,000 tokens of live
            context. That is only 3.3 sequences at 128K, 13 at 32K, or 104 at 4K. Past that line the
            cache — not the model — is the larger tenant of the node&apos;s HBM. Third, the{" "}
            <strong>shape of the growth</strong>: the cache is linear in context and linear in
            concurrency, so it is quadratic in &quot;serve twice as many users at twice the
            context.&quot;
          </p>
          <p>
            These are ceilings, not achievable operating points. Real allocators do worse: the vLLM
            authors measured that &quot;only 20.4% - 38.2% of the KV cache memory is used to store
            the actual token states in the existing systems&quot; before paged allocation, the rest
            lost to internal and external fragmentation.<Cite n={4} /> Paged management recovers most
            of that headroom, but it recovers it against the same hard ceiling — it does not raise
            it.
          </p>
        </div>
      </ProseWithRail>

      {/* 9 · INK BEAT */}
      <QuoteMetric
        quote="The arithmetic intensity of decode attention is simply the grouped-query ratio. Head dimension cancels. Context length cancels. Layer count cancels. Batch size cancels."
        attribution="PODOS AI Engineering · derived from [1][2][5][6]"
        metric="8"
        label="FLOP per byte · Llama 3 shape"
        field="insight"
      />

      {/* 10 · WHY BATCHING FAILS */}
      <ProseWithRail id="arithmetic-intensity" surface="paper">
        <SectionHead
          eyebrow="The derivation"
          title="Batching rescues the weights and does nothing for the cache"
        />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The standard answer to a memory-bandwidth problem is to batch: read the weights once and
            amortise them across many sequences. That works for the weights. It does nothing for the
            cache — every sequence has its own, and every sequence reads all of it, every step.
            Batching multiplies KV traffic instead of amortising it. Per layer, per sequence, per
            generated token, over a context of length L:
          </p>
          <p style={formula}>
            bytes read = 2 × kv_heads × head_dim × L × 2 B = 4 · kv_heads · head_dim · L
            <br />
            FLOPs (QKᵀ then AV) = 2 × (2 · q_heads · head_dim · L) = 4 · q_heads · head_dim · L
            <br />
            intensity = FLOPs / bytes = q_heads / kv_heads
          </p>
          <p style={{ marginTop: "1.5rem" }}>
            Compare that to the ridge point of the hardware. NVIDIA lists 1,979 FP16 tensor-core
            TFLOPS for H200 with sparsity — roughly 990 dense — against 4.8TB/s, giving about 206
            FLOP per byte before the tensor cores are saturated.<Cite n={6} />
          </p>
        </div>
      </ProseWithRail>

      {/* 11 · FIGURE 3 */}
      <MatrixTable
        eyebrow="Fig. 3 · Derived, not measured"
        title="Every attention scheme is memory-bound; they differ only in how badly"
        lede="A 64-query-head shape against the 206 FLOP/byte ridge point. Group sizes from [1][2][5]; ridge point from [6]."
        surface="canvas"
        field="insight"
        head={["Scheme", "KV heads", "FLOP per byte", "Share of the ridge point"]}
        rows={INTENSITY.map((r) => [r[0], cell(r[1], 1), cell(r[2], 2, true), cell(r[3], 3)])}
      />

      {/* 12 · WHAT ARCHITECTURES DO ABOUT IT */}
      <ProseWithRail surface="paper">
        <div>
          <p>
            Grouped-query attention moves a 70B-shaped model eight times closer to the ridge and
            still leaves it running attention at about 4% of the machine&apos;s arithmetic
            capability. This is the real content of the claim that inference is memory-bound: not a
            benchmark result, but a structural property of the operation. Which is also why the
            interesting architectural work attacks bytes rather than operations — DeepSeek-V2&apos;s
            multi-head latent attention reports a 93.3% reduction in KV cache by compressing keys and
            values into a latent vector,<Cite n={9} /> and TurboQuant reports quality-neutral KV
            quantization at about 3.5 bits per channel, with marginal degradation at 2.5.
            <Cite n={10} /> Both buy the same thing: bytes.
          </p>
        </div>
      </ProseWithRail>

      {/* 13 · FOR OPERATORS */}
      <CardGrid
        id="operators"
        eyebrow="Consequences"
        title="What this means for operators"
        lede="If the constraint is memory, then the capacity model, the purchasing decision, and the telemetry all move."
        surface="canvas"
        columns={3}
        items={[
          {
            code: "OP-01",
            title: "Size in tokens, not TFLOPS",
            body: "The useful line item is HBM remaining after weights, divided by bytes per token — a figure a facility can commit to and a customer can be sold.",
          },
          {
            code: "OP-02",
            title: "Context is a capacity purchase",
            body: "Moving a product from 32K to 128K does not cost 4× the compute. On the numbers above it costs 4× the cache and cuts concurrency per node by the same factor.",
          },
          {
            code: "OP-03",
            title: "Provision the memory domain",
            body: (
              <>
                Tensor-parallel serving splits the cache across accelerators sharing one
                high-bandwidth GPU-to-GPU fabric, so the ceiling is set by the NVLink domain — a
                rack-scale quantity in designs where 72 GPUs act as one domain.<Cite n={8} />
              </>
            ),
          },
          {
            code: "OP-04",
            title: "Do not de-rate power or cooling",
            body: "Prefill is compute-bound and interleaves with decode on the same silicon. The thermal and electrical design still has to carry nameplate draw.",
          },
          {
            code: "OP-05",
            title: "Instrument HBM occupancy",
            body: "Cache pressure, not GPU utilization, is what precedes queueing and eviction in a serving fleet — and a utilization dashboard cannot see it.",
          },
          {
            code: "OP-06",
            title: "Re-run the arithmetic per model",
            body: "Two models of the same parameter count can differ eightfold in bytes per token. The KV shape, not the parameter count, is what a capacity model needs.",
          },
        ]}
      />

      {/* 14 · PODOS APPLICATION */}
      <ProseWithRail id="podos" surface="paper">
        <SectionHead eyebrow="In the product" title="Why this shapes the unit, not just the server" />
        <div style={{ marginTop: "1.5rem" }}>
          <p>
            The infrastructure consequence is unglamorous: the memory you can power and cool inside
            one coherent GPU-to-GPU domain<Cite n={7} />
            <Cite n={8} /> sets the inference capacity of a site. That is the design problem behind{" "}
            <Link href="/engineering/high-density-gpu-infrastructure" style={link}>
              high-density GPU infrastructure
            </Link>{" "}
            — packing accelerators tightly enough to share one fabric, then removing the heat that
            packing creates through{" "}
            <Link href="/engineering/direct-to-chip-liquid-cooling" style={link}>
              direct-to-chip liquid cooling
            </Link>{" "}
            and feeding it with a{" "}
            <Link href="/engineering/data-center-power-architecture" style={link}>
              power architecture
            </Link>{" "}
            sized for the worst-case phase.
          </p>
          <p>
            Each{" "}
            <Link href="/platform/podos-pod" style={link}>
              PODOS Pod
            </Link>{" "}
            is <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>{" "}
            and <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span> — a unit sized so
            that power, cooling and the accelerator domain scale together rather than being
            renegotiated per site. To sketch capacity against your own workload, start with the{" "}
            <Link href="/estimate" style={link}>
              configurator
            </Link>
            ; unfamiliar terms are defined in the{" "}
            <Link href="/resources/ai-infrastructure-glossary" style={link}>
              AI infrastructure glossary
            </Link>
            .
          </p>
        </div>
      </ProseWithRail>

      {/* 15 · WHAT THIS DOES NOT PROVE — mandatory */}
      <LimitsBlock
        eyebrow="Honest limits"
        title="What this does not prove"
        lede="The calculations above are arithmetic on published specifications. No hardware was measured for this article, and the following limits are load-bearing."
        items={[
          "It is not a benchmark. Figures 1–3 are derived from vendor spec sheets and a published hyperparameter table, not from a serving run. Treat them as ceilings and ratios, never as throughput or latency predictions.",
          "The dense FLOPS figure is inferred. NVIDIA publishes 1,979 FP16 TFLOPS with sparsity; the ~990 dense figure follows the usual 2× convention rather than a separately published number, and no real kernel reaches peak. A lower dense figure moves the ridge point down, making attention look less memory-bound, not more.",
          "The FP16 assumption dominates the result. KV quantization to about 3.5 bits per channel would cut the cache roughly 4.5× and raise decode intensity by the same factor; anyone quoting these tables at a different precision is quoting the wrong tables.",
          "Linear-in-context is an architectural assumption, not a law. Latent attention, sliding-window and hybrid attention, and state-space layers all break the linear model — for those, the crossover arithmetic must be redone from the actual per-token byte count.",
          "The node budget is an idealisation. It ignores fragmentation, which pre-paging systems suffered heavily, and ignores prefix sharing and offload, which cut the other way. Real usable headroom sits below 815 GiB and depends on the serving stack.",
          "It says nothing about which regime dominates a given workload. Prefill is compute-bound, and nothing here establishes the prefill/decode mix for any particular deployment.",
          "For the conclusion to fail, one of two things must become true: accelerator memory capacity and bandwidth would have to grow faster than context windows and concurrency, or attention would have to stop re-reading a per-sequence cache. Neither has happened yet; both are worth watching.",
        ]}
      />

      {/* 16 · SOURCES */}
      <Section surface="paper" width="content" pad="flow">
        <EvidenceSourceRail sources={SOURCES} />
      </Section>

      {/* 17 · RELATED */}
      <RelatedRail
        title="Continue"
        items={[
          {
            href: "/engineering/high-density-gpu-infrastructure",
            label: "ENGINEERING",
            title: "High-density GPU infrastructure",
          },
          {
            href: "/engineering/direct-to-chip-liquid-cooling",
            label: "ENGINEERING",
            title: "Direct-to-chip liquid cooling, explained",
          },
          {
            href: "/platform/podos-pod",
            label: "PLATFORM",
            title: "The PODOS Pod",
          },
          {
            href: "/resources/ai-infrastructure-glossary",
            label: "RESOURCE",
            title: "AI infrastructure glossary",
          },
        ]}
      />

      {/* 18 · CTA */}
      <CTABand
        title="Bring your own"
        accent="token budget"
        body="Send the model shape, the context window, and the concurrency you need to serve. Engineering will work the memory arithmetic back to a unit count."
        primary={{ href: "/estimate", label: "Size your deployment" }}
        secondary={{ href: "/engineering", label: "See the engineering" }}
        field="insight"
      />
    </main>
  );
}
