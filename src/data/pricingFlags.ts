/**
 * pricingFlags.ts — the ONLY pricing-related value marketing code may import.
 *
 * Marketing components (SiteChrome, Footer, HeroVideoNarrative) and the SEO
 * route registry previously imported the whole PRICING const just to read
 * .approved — which bundled every placeholder dollar figure into PUBLIC
 * marketing JS chunks (gap audit section 2). This module carries only the
 * flag, so the price book stays out of public bundles entirely.
 *
 * Flip to true only when a real, founder-approved price book exists in the
 * database catalog (needs_business_verification cleared).
 */
export const PRICING_APPROVED = false;
