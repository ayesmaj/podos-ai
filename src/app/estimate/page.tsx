/**
 * /estimate — the PODOS estimator.
 *
 * Server shell (crawlable copy, metadata, breadcrumbs, JSON-LD) wrapping
 * the interactive ConfiguratorClient island. Capacity figures come from
 * the approved claims register; prices are PRELIMINARY and presented as a
 * range with a visible not-a-quote disclaimer, tunable from /admin/pricing.
 */

import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import ConfiguratorClient from "@/components/configurator/ConfiguratorClient";
import { ESTIMATOR_HERO } from "@/data/configuratorOptionImages";
import { PRICING } from "@/data/configuratorPricing";

/**
 * Indexability is gated on PRICING.approved. While it is false the figures
 * are placeholders, not a founder-approved price book — so the page stays
 * reachable by direct link (for internal review) but is noindex, absent
 * from the sitemap, and unlinked from site navigation. Setting
 * `approved: true` in configuratorPricing.ts restores all four together.
 */
export const metadata: Metadata = {
  ...buildMetadata({
    title: "Modular AI Infrastructure Cost Estimate | PODOS AI",
    description:
      "Size a modular AI deployment: choose pod count, cooling, power, and network, and see capacity plus a preliminary cost estimate for planning.",
    path: "/estimate",
  }),
  ...(PRICING.approved ? {} : { robots: { index: false, follow: false } }),
};

export default function EstimatePage() {
  return (
    <>
    <main className="pageOverlay" style={{ marginTop: 0, borderRadius: 0, boxShadow: "none", background: "var(--paper)" }}>
      <div className="container-site" style={{ paddingBlock: "clamp(88px, 10vw, 128px)" }}>
        <Breadcrumbs
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Estimate", path: "/estimate" },
          ]}
        />

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--brand)",
            marginTop: "1.6rem",
          }}
        >
          EST-01 · Estimate
        </p>

        <h1
          className="t-headline"
          style={{ marginTop: "0.7rem", maxWidth: "20ch" }}
        >
          Size your AI infrastructure deployment.
        </h1>

        {/* Dedicated configurator render (see docs/configurator/ASSETS.md).
            Conceptual, and labelled as such below — never documentary proof. */}
        <figure style={{ marginTop: "1.8rem" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "3 / 1",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid var(--edge)",
              background: "var(--canvas)",
            }}
          >
            <Image
              src={ESTIMATOR_HERO.src}
              alt={ESTIMATOR_HERO.alt}
              fill
              sizes="(max-width: 900px) 100vw, 1200px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <figcaption
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-faint)",
              marginTop: "0.6rem",
            }}
          >
            Conceptual visualization — final appearance subject to site engineering
          </figcaption>
        </figure>

        <p className="t-lede" style={{ marginTop: "1.1rem", maxWidth: "62ch" }}>
          Choose how much capacity you need and how the units should be
          configured. The estimator returns deployable capacity, accelerator
          count, a target deployment window, and a preliminary cost range
          you can take into a planning conversation.
        </p>

        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-dim)", marginTop: "0.9rem", maxWidth: "62ch" }}>
          Every PODOS Pod is{" "}
          <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>,{" "}
          <span data-claim="pod-gpu-capacity">designed for 128 GPUs</span>, with a{" "}
          <span data-claim="deployment-window">90-day deployment target</span> from
          order to commissioning. Capacity scales by adding units.
        </p>

        <div style={{ marginTop: "2.6rem" }}>
          <ConfiguratorClient />
        </div>

        <section
          style={{
            marginTop: "3.5rem",
            borderTop: "1px solid var(--edge)",
            paddingTop: "1.6rem",
            maxWidth: "70ch",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink-dim)",
            }}
          >
            How to read this estimate
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-dim)", marginTop: "0.8rem" }}>
            Figures are <strong>preliminary planning estimates</strong>, not a
            quote, offer, or contract. They are presented as a range because
            real project cost depends on factors this tool cannot know: site
            civil works, distance and route for transport, utility
            interconnection scope and queue position, local permitting, tax
            treatment, and the accelerator generation available when you
            order. A written proposal follows an engineering review of your
            specific site.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-dim)", marginTop: "0.8rem" }}>
            Deployment timing is a target rather than a guarantee, and
            assumes site power and pad readiness. If you are evaluating
            whether a site can host modular capacity at all, start with the{" "}
            <a href="/deploy" style={{ color: "var(--brand)" }}>
              deployment stages
            </a>{" "}
            and the{" "}
            <a href="/resources/ai-infrastructure-glossary" style={{ color: "var(--brand)" }}>
              infrastructure glossary
            </a>
            . For the engineering behind the options above, see{" "}
            <a href="/engineering/direct-to-chip-liquid-cooling" style={{ color: "var(--brand)" }}>
              direct-to-chip liquid cooling
            </a>{" "}
            and{" "}
            <a href="/engineering/data-center-power-architecture" style={{ color: "var(--brand)" }}>
              data-center power architecture
            </a>
            .
          </p>
        </section>
      </div>
    </main>
    </>
  );
}
