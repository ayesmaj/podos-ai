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
  { path: "/", changeFrequency: "weekly", priority: 1, cluster: "core" },
  { path: "/invest", changeFrequency: "weekly", priority: 0.9, cluster: "invest" },
];

export const canonicalUrl = (path: string) =>
  path === "/" ? `${SITE.baseUrl}/` : `${SITE.baseUrl}${path.replace(/\/$/, "")}`;
