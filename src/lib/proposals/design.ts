/**
 * design.ts — per-proposal document settings stored in `estimates.design`
 * (jsonb, partial). Everything here has a default so an empty object renders
 * the standard document; the admin "Proposal Design" panel only stores what
 * was changed.
 */

export type PageMode = "preliminary" | "formal";
export type Watermark = "none" | "draft" | "confidential" | "preview";

export interface ProposalDesign {
  page_mode: PageMode;
  visuals: { cover: boolean; cutaway: boolean; deployment: boolean };
  sections: {
    exec_summary: boolean; metrics: boolean; spec_modules: boolean; scope: boolean;
    timeline: boolean; responsibilities: boolean; assumptions: boolean; next_step: boolean;
  };
  /** show the signature block on the last page (independent of the web Sign CTA) */
  signature_block: boolean;
  /** overrides expires_at for the printed validity line; null = use expires_at or issue+30d */
  validity_days: number | null;
  watermark: Watermark;
  allow_download: boolean;
  allow_comments: boolean;
}

export const DEFAULT_DESIGN: ProposalDesign = {
  page_mode: "formal",
  visuals: { cover: true, cutaway: true, deployment: true },
  sections: { exec_summary: true, metrics: true, spec_modules: true, scope: true, timeline: true, responsibilities: true, assumptions: true, next_step: true },
  signature_block: false,
  validity_days: null,
  watermark: "none",
  allow_download: true,
  allow_comments: true,
};

const RELEASED = new Set(["released", "signature_requested", "client_signed", "signed", "countersigned", "completed"]);

/** Merge stored partial settings over defaults; page mode falls back to the proposal state. */
export function resolveDesign(stored: unknown, status: string): ProposalDesign {
  const s = (stored && typeof stored === "object" ? stored : {}) as Partial<Record<keyof ProposalDesign, unknown>>;
  const d: ProposalDesign = {
    ...DEFAULT_DESIGN,
    page_mode: s.page_mode === "preliminary" || s.page_mode === "formal" ? s.page_mode : RELEASED.has(status) ? "formal" : "preliminary",
    visuals: { ...DEFAULT_DESIGN.visuals, ...(typeof s.visuals === "object" && s.visuals ? (s.visuals as object) : {}) },
    sections: { ...DEFAULT_DESIGN.sections, ...(typeof s.sections === "object" && s.sections ? (s.sections as object) : {}) },
    signature_block: typeof s.signature_block === "boolean" ? s.signature_block : status === "signature_requested" || status === "client_signed" || status === "signed" || status === "countersigned",
    validity_days: typeof s.validity_days === "number" && s.validity_days > 0 && s.validity_days <= 365 ? Math.round(s.validity_days) : null,
    watermark: s.watermark === "draft" || s.watermark === "confidential" || s.watermark === "preview" ? s.watermark : "none",
    allow_download: typeof s.allow_download === "boolean" ? s.allow_download : true,
    allow_comments: typeof s.allow_comments === "boolean" ? s.allow_comments : true,
  };
  return d;
}
