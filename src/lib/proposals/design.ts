/**
 * design.ts — per-proposal document settings stored in `estimates.design`
 * (jsonb, partial). Everything here has a default so an empty object renders
 * the standard estimate sheet; the admin "Proposal Design" panel only stores
 * what was changed. Keys from older layouts are ignored on read.
 */

export type PageMode = "preliminary" | "formal";
export type Watermark = "none" | "draft" | "confidential" | "preview";

export interface ProposalDesign {
  /** preliminary = "ESTIMATE" (indicative), formal = "PROPOSAL" (released, priced) */
  page_mode: PageMode;
  visuals: { product: boolean };
  sections: { summary: boolean; notes: boolean; warranty: boolean; trust_band: boolean };
  /** signature line on the sheet (independent of the web Sign CTA) */
  signature_block: boolean;
  /** overrides expires_at for the printed validity line; null = expires_at or issue + 30 d */
  validity_days: number | null;
  watermark: Watermark;
  allow_download: boolean;
  allow_comments: boolean;
}

export const DEFAULT_DESIGN: ProposalDesign = {
  page_mode: "formal",
  visuals: { product: true },
  sections: { summary: true, notes: true, warranty: true, trust_band: true },
  signature_block: true,
  validity_days: null,
  watermark: "none",
  allow_download: true,
  allow_comments: true,
};

const RELEASED = new Set(["released", "signature_requested", "client_signed", "signed", "countersigned", "completed"]);
const obj = (v: unknown) => (typeof v === "object" && v ? (v as Record<string, unknown>) : {});
const bool = (v: unknown, dflt: boolean) => (typeof v === "boolean" ? v : dflt);

/** Merge stored partial settings over defaults; page mode falls back to the proposal state. */
export function resolveDesign(stored: unknown, status: string): ProposalDesign {
  const s = obj(stored);
  const vis = obj(s.visuals); const sec = obj(s.sections);
  return {
    page_mode: s.page_mode === "preliminary" || s.page_mode === "formal" ? s.page_mode : RELEASED.has(status) ? "formal" : "preliminary",
    visuals: { product: bool(vis.product, DEFAULT_DESIGN.visuals.product) },
    sections: {
      summary: bool(sec.summary, true), notes: bool(sec.notes, true), warranty: bool(sec.warranty, true), trust_band: bool(sec.trust_band, true),
    },
    signature_block: bool(s.signature_block, true),
    validity_days: typeof s.validity_days === "number" && s.validity_days > 0 && s.validity_days <= 365 ? Math.round(s.validity_days) : null,
    watermark: s.watermark === "draft" || s.watermark === "confidential" || s.watermark === "preview" ? s.watermark : "none",
    allow_download: bool(s.allow_download, true),
    allow_comments: bool(s.allow_comments, true),
  };
}
