/**
 * site.ts — canonical site constants + the indexable-route registry.
 *
 * SINGLE SOURCE OF TRUTH for: canonical host, org identity used in
 * JSON-LD, and the list of indexable routes (sitemap.ts and
 * scripts/verify-seo.mjs both derive from it — adding a page here is
 * what "publishes" it to the sitemap and the quality gate).
 *
 * Canonical policy (docs/seo/redirect-map.md): https + www, no trailing
 * slash. The apex 301/307s to www at the platform level.
 */

import { PRICING_APPROVED } from "@/data/pricingFlags";

export const SITE = {
  baseUrl: "https://www.podosai.com",
  name: "PODOS AI",
  legalName: "PODOS AI",
  description:
    "PODOS AI builds factory-built modular AI compute infrastructure — standardized 1-MW units integrating power, cooling, racks, and networking.",
  email: "info@podosai.com",
  phone: "+1-408-718-9946",
  logo: "https://www.podosai.com/logo.png",
} as const;

export interface IndexableRoute {
  /** path starting with "/", no trailing slash (except "/") */
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  /** cluster key for internal-link and reporting purposes */
  cluster: "core" | "platform" | "engineering" | "deploy" | "use-cases" | "compare" | "invest" | "resources" | "insights";
}

/* Only routes that exist AND pass quality gates belong here. */
export const INDEXABLE_ROUTES: IndexableRoute[] = [
  // /configure is indexable ONLY once a founder-approved price book is in
  // configuratorPricing.ts. Until then the estimator quotes placeholder
  // figures and must not be crawled, ranked, or linked from navigation.
  ...(PRICING_APPROVED
    ? [{ path: "/estimate", changeFrequency: "monthly", priority: 0.9, cluster: "core" } as IndexableRoute]
    : []),
  { path: "/", changeFrequency: "weekly", priority: 1, cluster: "core" },
  { path: "/invest", changeFrequency: "weekly", priority: 0.9, cluster: "invest" },
  /* Sprint 2 pillar pages */
  { path: "/platform", changeFrequency: "monthly", priority: 0.9, cluster: "platform" },
  { path: "/platform/podos-pod", changeFrequency: "monthly", priority: 0.9, cluster: "platform" },
  { path: "/platform/syntropic", changeFrequency: "monthly", priority: 0.8, cluster: "platform" },
  { path: "/engineering", changeFrequency: "monthly", priority: 0.8, cluster: "engineering" },
  { path: "/engineering/direct-to-chip-liquid-cooling", changeFrequency: "monthly", priority: 0.8, cluster: "engineering" },
  { path: "/engineering/data-center-power-architecture", changeFrequency: "monthly", priority: 0.8, cluster: "engineering" },
  { path: "/engineering/networking-fiber", changeFrequency: "monthly", priority: 0.8, cluster: "engineering" },
  { path: "/engineering/safety-security", changeFrequency: "monthly", priority: 0.7, cluster: "engineering" },
  { path: "/engineering/high-density-gpu-infrastructure", changeFrequency: "monthly", priority: 0.8, cluster: "engineering" },
  { path: "/engineering/monitoring-controls", changeFrequency: "monthly", priority: 0.8, cluster: "engineering" },
  { path: "/engineering/data-center-heat-recovery", changeFrequency: "monthly", priority: 0.8, cluster: "engineering" },
  { path: "/engineering/thermal-enclosure", changeFrequency: "monthly", priority: 0.8, cluster: "engineering" },
  { path: "/deploy", changeFrequency: "monthly", priority: 0.8, cluster: "deploy" },
  { path: "/use-cases", changeFrequency: "monthly", priority: 0.8, cluster: "use-cases" },
  { path: "/compare/modular-ai-data-center-vs-traditional-data-center", changeFrequency: "monthly", priority: 0.7, cluster: "compare" },
  { path: "/compare/factory-built-vs-site-built-data-center", changeFrequency: "monthly", priority: 0.7, cluster: "compare" },
  { path: "/compare/liquid-cooling-vs-air-cooling", changeFrequency: "monthly", priority: 0.7, cluster: "compare" },
  { path: "/resources/ai-infrastructure-glossary", changeFrequency: "monthly", priority: 0.7, cluster: "resources" },
  /* Estimator */
  { path: "/resources/data-center-readiness-checklist", changeFrequency: "monthly", priority: 0.7, cluster: "resources" },
  { path: "/compare/on-prem-ai-infrastructure-vs-cloud", changeFrequency: "monthly", priority: 0.7, cluster: "compare" },
  { path: "/deploy/transport-placement", changeFrequency: "monthly", priority: 0.7, cluster: "deploy" },
  { path: "/use-cases/edge-ai", changeFrequency: "monthly", priority: 0.7, cluster: "use-cases" },
  { path: "/deploy/operations-maintenance", changeFrequency: "monthly", priority: 0.7, cluster: "deploy" },
  { path: "/insights/behind-the-meter-ai-compute", changeFrequency: "monthly", priority: 0.7, cluster: "insights" },
  { path: "/deploy/site-power-readiness", changeFrequency: "monthly", priority: 0.8, cluster: "deploy" },
  { path: "/insights/direct-to-chip-vs-immersion-vs-air-cooling", changeFrequency: "monthly", priority: 0.7, cluster: "insights" },
  { path: "/use-cases/enterprise-ai", changeFrequency: "monthly", priority: 0.7, cluster: "use-cases" },
  { path: "/use-cases/universities-research", changeFrequency: "monthly", priority: 0.7, cluster: "use-cases" },
  { path: "/deploy/commissioning", changeFrequency: "monthly", priority: 0.8, cluster: "deploy" },
  { path: "/use-cases/healthcare", changeFrequency: "monthly", priority: 0.7, cluster: "use-cases" },
  { path: "/deploy/factory-build-testing", changeFrequency: "monthly", priority: 0.8, cluster: "deploy" },
  { path: "/deploy/configuration-engineering", changeFrequency: "monthly", priority: 0.8, cluster: "deploy" },
  { path: "/insights/kv-cache-memory-bottleneck", changeFrequency: "monthly", priority: 0.7, cluster: "insights" },
  { path: "/insights/why-ai-infrastructure-is-moving-to-liquid-cooling", changeFrequency: "monthly", priority: 0.7, cluster: "insights" },
  { path: "/insights/warm-water-liquid-cooling-explained", changeFrequency: "monthly", priority: 0.7, cluster: "insights" },
  { path: "/insights/closed-loop-cooling-and-data-center-water-use", changeFrequency: "monthly", priority: 0.7, cluster: "insights" },
  { path: "/insights/how-to-evaluate-ai-infrastructure-claims", changeFrequency: "monthly", priority: 0.7, cluster: "insights" },
  { path: "/insights/ai-data-center-electricity-demand", changeFrequency: "monthly", priority: 0.7, cluster: "insights" },
  /* Legal. Indexable but low priority — they exist to be findable and
     linkable from the footer, not to rank. */
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3, cluster: "core" },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3, cluster: "core" },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3, cluster: "core" },
];

export const canonicalUrl = (path: string) =>
  path === "/" ? `${SITE.baseUrl}/` : `${SITE.baseUrl}${path.replace(/\/$/, "")}`;
