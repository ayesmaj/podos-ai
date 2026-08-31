/**
 * configuratorOptionImages.ts — maps estimator option ids to the dedicated
 * PODOS Configurator image library in public/visuals/configurator/.
 *
 * The renders were generated against the real pod render and logo as brand
 * references and reviewed over three adversarial QA passes (no invented
 * lettering, matte-black hardware, bright-premium art direction). See
 * docs/configurator/ASSETS.md.
 *
 * Keys match the option ids in src/data/configuratorPricing.ts. Kept as a
 * separate module so pricing data stays purely commercial and an option
 * without a picture simply renders without one.
 *
 * Thumbnails are decorative: each sits beside its own visible text label, so
 * alt is intentionally empty to avoid duplicate screen-reader announcements.
 */

const DIR = "/visuals/configurator";

export const COOLING_IMAGES: Record<string, string> = {
  "direct-to-chip": `${DIR}/opt-cdu.webp`,
  hybrid: `${DIR}/opt-cooling-skid.webp`,
  air: `${DIR}/opt-drycooler.webp`,
};

export const POWER_IMAGES: Record<string, string> = {
  standard: `${DIR}/opt-transformer.webp`,
  redundant: `${DIR}/opt-ups.webp`,
  "off-grid": `${DIR}/opt-microgrid.webp`,
};

export const NETWORK_IMAGES: Record<string, string> = {
  standard: `${DIR}/opt-cross-connect.webp`,
  "high-bandwidth": `${DIR}/opt-network-fabric.webp`,
};

export const SUPPORT_IMAGES: Record<string, string> = {
  standard: `${DIR}/svc-annual-inspection.webp`,
  enhanced: `${DIR}/svc-preventive-maintenance.webp`,
  "fully-managed": `${DIR}/svc-onsite-response.webp`,
};

export const SERVICE_IMAGES: Record<string, string> = {
  siteAssessment: `${DIR}/svc-site-survey.webp`,
  transport: `${DIR}/opt-transport.webp`,
  commissioning: `${DIR}/opt-commissioning.webp`,
};

export const COMPUTE_IMAGES = {
  podos: `${DIR}/opt-rack-compute.webp`,
  customer: `${DIR}/opt-rack-customer.webp`,
};

/** Wide hero for the estimator page header. */
export const ESTIMATOR_HERO = {
  src: `${DIR}/entry-hero.webp`,
  alt: "A PODOS modular AI infrastructure unit in a bright industrial pavilion",
  width: 1536,
  height: 1024,
};
