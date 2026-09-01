/**
 * configuratorPricing.ts — the single source of truth for every number
 * the /estimate estimator shows.
 *
 * STATUS: PRELIMINARY. These figures are placeholders chosen to be
 * order-of-magnitude defensible for modular AI infrastructure; they are
 * NOT an approved PODOS price book. The estimator therefore presents a
 * RANGE and labels every output a preliminary estimate, never a quote.
 *
 * To publish real pricing: edit this file (or use /admin/pricing to tune
 * values and export the JSON), then set `approved: true`.
 */

export interface PricingConfig {
  /** flip to true only when a real, approved price book is in here */
  approved: boolean;
  currency: "USD";
  /** +/- spread applied to every total, since this is an estimate */
  rangeSpread: number;
  /** infrastructure shell: enclosure, structure, base, integration */
  podBase: number;
  /** PODOS-supplied compute per pod (128 GPUs designed-for) */
  computePackage: number;
  cooling: Record<string, { label: string; price: number; note: string }>;
  power: Record<string, { label: string; price: number; note: string }>;
  network: Record<string, { label: string; price: number; note: string }>;
  support: Record<string, { label: string; pricePerYear: number; note: string }>;
  /** one-off per-deployment services */
  services: Record<string, { label: string; price: number; note: string }>;
  /** volume discount tiers: pods >= n → multiplier on hardware subtotal */
  volumeTiers: { minPods: number; multiplier: number }[];
}

export const PRICING: PricingConfig = {
  approved: false,
  currency: "USD",
  rangeSpread: 0.15,

  podBase: 1_850_000,
  computePackage: 4_400_000,

  cooling: {
    "direct-to-chip": {
      label: "Direct-to-chip liquid",
      price: 320_000,
      note: "Cold plates, CDU, internal loop. Required above ~40 kW/rack.",
    },
    hybrid: {
      label: "Hybrid liquid + air",
      price: 240_000,
      note: "Liquid to the highest-density racks, air for the balance.",
    },
    air: {
      label: "Air only",
      price: 120_000,
      note: "Suitable for lower-density deployments.",
    },
  },

  power: {
    standard: {
      label: "Standard distribution",
      price: 210_000,
      note: "Switchgear, transformer interface, busway, monitoring.",
    },
    redundant: {
      label: "N+1 redundant",
      price: 480_000,
      note: "Redundant distribution paths and UPS capacity.",
    },
    "off-grid": {
      label: "Off-grid capable",
      price: 760_000,
      note: "On-site generation interface, storage, islanding controls.",
    },
  },

  network: {
    standard: {
      label: "Standard fabric",
      price: 145_000,
      note: "Leaf/spine switching, fiber entry, monitoring.",
    },
    "high-bandwidth": {
      label: "High-bandwidth fabric",
      price: 310_000,
      note: "Higher east-west capacity for distributed training.",
    },
  },

  support: {
    standard: {
      label: "Standard",
      pricePerYear: 95_000,
      note: "Remote monitoring, business-hours response, scheduled service.",
    },
    enhanced: {
      label: "Enhanced",
      pricePerYear: 180_000,
      note: "24/7 response, priority spares, quarterly on-site service.",
    },
    "fully-managed": {
      label: "Fully managed",
      pricePerYear: 320_000,
      note: "PODOS operates the unit end to end.",
    },
  },

  services: {
    siteAssessment: {
      label: "Site & power assessment",
      price: 45_000,
      note: "Power availability, pad, access, permitting review.",
    },
    transport: {
      label: "Transport & placement",
      price: 130_000,
      note: "Freight, route planning, crane placement. Varies by distance.",
    },
    commissioning: {
      label: "Commissioning",
      price: 165_000,
      note: "Electrical, thermal, network, controls, acceptance testing.",
    },
  },

  volumeTiers: [
    { minPods: 1, multiplier: 1 },
    { minPods: 3, multiplier: 0.96 },
    { minPods: 6, multiplier: 0.92 },
    { minPods: 12, multiplier: 0.88 },
  ],
};
