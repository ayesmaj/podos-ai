/**
 * investOffering.ts — the single source of truth for everything on /invest
 * that could be a material claim: offering terms, industry relationships,
 * market statistics, and proof/evidence modules.
 *
 * NOTHING financial or relational is hardcoded in JSX. Components read
 * this file and hide anything not explicitly approved. The page runs in
 * two modes driven by `offering.offeringStatus` + `offering.termsApproved`:
 *
 *   "interest"      → investor education + non-binding interest capture.
 *                     No security type, share price, valuation, or
 *                     ownership math is ever displayed.
 *   "live-offering" → requires termsApproved === true; unlocks the real
 *                     terms + portal CTA.
 */

/* ============================ OFFERING ============================ */

export type OfferingStatus = "interest" | "live-offering";

export interface InvestmentOfferingConfig {
  offeringStatus: OfferingStatus;
  /** Approved for public use: planned entry point communicated by founders */
  minimumInvestment: number;
  /** The fields below stay undefined until real approved terms exist */
  securityType?: string;
  pricePerSecurity?: number;
  preMoneyValuation?: number;
  postMoneyValuation?: number;
  fullyDilutedShares?: number;
  maximumRaise?: number;
  portalURL?: string;
  termsApproved: boolean;
  termsVersion: string;
  termsUpdatedAt: string;
}

export const offering: InvestmentOfferingConfig = {
  offeringStatus: "interest",
  minimumInvestment: 1_000,
  termsApproved: false,
  termsVersion: "0.1-interest",
  termsUpdatedAt: "2026-08-16",
};

/** True only when real approved securities terms may be displayed */
export const termsLive = () =>
  offering.offeringStatus === "live-offering" &&
  offering.termsApproved === true &&
  offering.pricePerSecurity !== undefined &&
  offering.fullyDilutedShares !== undefined;

/* ========================= COLLABORATIONS ========================= */

export type CollaborationStatus =
  | "signed"
  | "active-work"
  | "pilot"
  | "mou"
  | "discussion"
  | "vendor"
  | "hidden";

export interface ConfidentialCollaboration {
  id: string;
  publicLabel: string;
  category: string;
  status: CollaborationStatus;
  /** The ONLY sentence that may be rendered publicly for this relationship */
  approvedPublicStatement: string;
  publicDisclosureApproved: boolean;
  partnerNamePublic: boolean;
  imageId: string;
  conceptualVisualization: boolean;
}

/* Statements are the conservative "active discussions" level (Level C).
 * Upgrade status + statement here ONLY with founder authorization —
 * never describe a discussion as a partnership. */
export const collaborations: ConfidentialCollaboration[] = [
  {
    id: "ca-utility",
    publicLabel: "Major California Electric Utility",
    category: "POWER · GRID INTEGRATION · DEPLOYMENT",
    status: "discussion",
    approvedPublicStatement:
      "In active discussions with a major California utility regarding power integration and potential deployment pathways for modular AI infrastructure.",
    publicDisclosureApproved: true,
    partnerNamePublic: false,
    imageId: "ca-power",
    conceptualVisualization: true,
  },
  {
    id: "compute-provider",
    publicLabel: "Leading Server, Rack & Communications Infrastructure Provider",
    category: "COMPUTE HARDWARE · RACKS · NETWORKING",
    status: "discussion",
    approvedPublicStatement:
      "In active discussions with a leading provider of server, rack, and communications infrastructure regarding system integration and deployment requirements.",
    publicDisclosureApproved: true,
    partnerNamePublic: false,
    imageId: "server-integration",
    conceptualVisualization: true,
  },
];

export const visibleCollaborations = () =>
  collaborations.filter((c) => c.publicDisclosureApproved && c.status !== "hidden");

/** Quiet framing line — approved alongside the cards above */
export const collaborationsFootnote =
  "Selected industry relationships are presented without public naming at this stage.";

/* ============================= CLAIMS ============================= */

export interface PublicClaim {
  id: string;
  value: string;
  unit?: string;
  label: string;
  description: string;
  category:
    | "product"
    | "performance"
    | "timeline"
    | "relationship"
    | "market"
    | "financial"
    | "deployment";
  status: "target" | "estimate" | "verified" | "conceptual";
  sourceLabel?: string;
  sourceUrl?: string;
  asOf?: string;
  /** true = a PODOS internal target, visually badged as such */
  internalTarget: boolean;
  approvedForPublicUse: boolean;
}

export const claims: PublicClaim[] = [
  {
    id: "compute-demand",
    value: "10",
    unit: "×",
    label: "AI COMPUTE DEMAND",
    description:
      "Projected order-of-magnitude growth in demand for AI compute this decade.",
    category: "market",
    status: "estimate",
    sourceLabel: "Industry estimate",
    internalTarget: false,
    approvedForPublicUse: true,
  },
  {
    id: "traditional-buildout",
    value: "3–5",
    unit: "YEARS",
    label: "TRADITIONAL BUILDOUT",
    description:
      "Typical time from site selection to commissioning for conventional data-center construction.",
    category: "market",
    status: "estimate",
    sourceLabel: "Industry estimate",
    internalTarget: false,
    approvedForPublicUse: true,
  },
  {
    id: "podos-deployment",
    value: "90",
    unit: "DAYS",
    label: "PODOS DEPLOYMENT TARGET",
    description:
      "PODOS target window from order to commissioning for a standard unit.",
    category: "timeline",
    status: "target",
    internalTarget: true,
    approvedForPublicUse: true,
  },
  {
    id: "unit-capacity",
    value: "1",
    unit: "MW",
    label: "PER MODULAR UNIT",
    description:
      "Each PODOS unit is designed as a standardized 1-MW building block for AI infrastructure.",
    category: "product",
    status: "target",
    internalTarget: true,
    approvedForPublicUse: true,
  },
];

export const approvedClaims = () => claims.filter((c) => c.approvedForPublicUse);

/* ============================ EVIDENCE ============================ */

export interface EvidenceModule {
  id: string;
  index: string;
  title: string;
  statement: string;
  detail?: string;
  status: "verified" | "in-progress" | "target" | "conceptual";
  approvedForPublicUse: boolean;
}

/* Only approved modules render. Add prototype photos, IP filings, LOIs,
 * test milestones etc. here as they become publicly shareable. */
export const evidence: EvidenceModule[] = [
  {
    id: "engineering",
    index: "01",
    title: "ENGINEERING",
    statement: "Complete unit architecture: power, cooling, racks, networking and service access engineered as one standardized product.",
    detail: "Industrial design and system architecture developed to manufacturable specification.",
    status: "in-progress",
    approvedForPublicUse: true,
  },
  {
    id: "power-architecture",
    index: "02",
    title: "POWER",
    statement: "Electrical architecture designed for utility-scale interconnection at standard industrial sites.",
    status: "in-progress",
    approvedForPublicUse: true,
  },
  {
    id: "cooling-architecture",
    index: "03",
    title: "COOLING",
    statement: "Thermal architecture specified for high-density AI compute loads within the modular envelope.",
    status: "in-progress",
    approvedForPublicUse: true,
  },
  {
    id: "industry-engagement",
    index: "04",
    title: "INDUSTRY",
    statement: "Active engagement across the power and compute-infrastructure ecosystem, including a major California utility and a leading server, rack and communications provider.",
    status: "in-progress",
    approvedForPublicUse: true,
  },
  {
    id: "team",
    index: "05",
    title: "TEAM",
    statement: "Leadership across engineering, manufacturing, real estate and deployment — profiled on the main site.",
    detail: "See podosai.com for the full team.",
    status: "verified",
    approvedForPublicUse: true,
  },
  /* Hidden until real, publicly-approved material exists: */
  { id: "prototype", index: "06", title: "PROTOTYPE", statement: "", status: "in-progress", approvedForPublicUse: false },
  { id: "ip", index: "07", title: "IP", statement: "", status: "in-progress", approvedForPublicUse: false },
  { id: "customers", index: "08", title: "CUSTOMERS", statement: "", status: "in-progress", approvedForPublicUse: false },
];

export const approvedEvidence = () => evidence.filter((e) => e.approvedForPublicUse);
