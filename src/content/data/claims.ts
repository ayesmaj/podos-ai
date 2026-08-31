/**
 * claims.ts — sitewide public-claims register (SEO master brief §4).
 *
 * Every quantitative or comparative company claim rendered on an
 * indexable page must reference an entry here by id, and may render
 * ONLY when `publishable: true`. scripts/verify-seo.mjs fails the gate
 * if a page references a blocked/unknown claim id.
 *
 * Relationship to src/data/investOffering.ts: that file remains the
 * offering/securities gate for /invest (terms, collaborations). This
 * register is the sitewide FACTUAL claims ledger; invest-page market
 * stats are mirrored here so future pages reuse one source.
 *
 * Seeded ONLY from copy already live on podosai.com. Conflicting or
 * deck-only numbers enter as blocked-needs-approval — never resolved
 * unilaterally.
 */

export type ClaimStatus =
  | "externally-verified"
  | "internally-validated"
  | "company-target"
  | "conceptual"
  | "confidential"
  | "blocked-needs-approval";

export type PublicClaim = {
  id: string;
  statement: string;
  shortLabel?: string;
  status: ClaimStatus;
  publishable: boolean;
  sourceName?: string;
  sourceUrl?: string;
  sourceDocument?: string;
  evidenceDate?: string;
  approvedBy?: string;
  approvedAt?: string;
  requiredQualifier?: string;
  notes?: string;
};

export const CLAIMS: Record<string, PublicClaim> = {
  "unit-capacity-1mw": {
    id: "unit-capacity-1mw",
    statement: "Each PODOS Pod is designed as a standardized 1 MW building block for AI infrastructure.",
    shortLabel: "1 MW per unit",
    status: "company-target",
    publishable: true,
    requiredQualifier: "designed as",
    notes: "Live on / and /invest. Design capacity, not a measured deployment figure.",
  },
  "deployment-window": {
    id: "deployment-window",
    statement: "PODOS targets a 90-day window from order to commissioning for a standard unit.",
    shortLabel: "90-day deployment target",
    status: "blocked-needs-approval",
    publishable: false,
    requiredQualifier: "target",
    notes: "CONFLICT: /invest and root metadata say 90 days; public/products/pod.png artwork says 90–120 days. Founder must pick one number before any NEW page uses it. Existing pages keep their current copy until resolved.",
  },
  "compute-demand-10x": {
    id: "compute-demand-10x",
    statement: "Projected order-of-magnitude (10×) growth in demand for AI compute this decade.",
    shortLabel: "10× compute demand",
    status: "blocked-needs-approval",
    publishable: false,
    notes: "Live on /invest labeled 'Industry estimate' but no named source. New pages need a named, linked source (IEA/LBNL from docs/seo/source-register.md) before reuse.",
  },
  "traditional-buildout-years": {
    id: "traditional-buildout-years",
    statement: "Conventional data-center construction typically takes 3–5 years from site selection to commissioning.",
    shortLabel: "3–5 yr traditional buildout",
    status: "blocked-needs-approval",
    publishable: false,
    notes: "Live on /invest as 'Industry estimate' without a named source; attach one (Uptime/industry report) before reuse on new pages.",
  },
  "pod-gpu-capacity": {
    id: "pod-gpu-capacity",
    statement: "128 GPUs per PODOS Pod.",
    status: "blocked-needs-approval",
    publishable: false,
    notes: "Appears only inside pod.png artwork. Rack density / accelerator count must not be published as text until the company approves exact public limits (brief §7.15).",
  },
  "pod-footprint": {
    id: "pod-footprint",
    statement: "720 sq ft PODOS Pod footprint, 40 ft × 8 ft envelope.",
    status: "blocked-needs-approval",
    publishable: false,
    notes: "From pod.png artwork ('720 sq ft, fully relocatable, off-grid capable'). Needs engineering confirmation before text publication; 'off-grid capable' additionally needs a qualifier decision.",
  },
  "patent-claims-count": {
    id: "patent-claims-count",
    statement: "76+ patent claims across both platforms; inventor of record on every USPTO filing.",
    status: "blocked-needs-approval",
    publishable: false,
    notes: "Live in the team section bio. Patent COUNTS on dedicated IP/tech pages need filing numbers or counsel sign-off first (brief §4 audit list).",
  },
  "syntropic-benchmark": {
    id: "syntropic-benchmark",
    statement: "Syntropic validated 99.6% quality preservation on Mistral-7B across 3 GPU platforms.",
    status: "blocked-needs-approval",
    publishable: false,
    notes: "Live in a team bio. A benchmark claim on product/technical pages requires public methodology, hardware config, baseline, date, and limitations (brief §4) — none published yet.",
  },
};

export const claim = (id: keyof typeof CLAIMS): PublicClaim => CLAIMS[id];

/** ids safe to render on new indexable pages */
export const publishableClaimIds = () =>
  Object.values(CLAIMS).filter((c) => c.publishable).map((c) => c.id);
