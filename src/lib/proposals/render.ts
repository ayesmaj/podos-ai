import type { DocData } from "@/lib/proposals/types";
import { ADMIN_SECRET, getProposalFull } from "@/lib/estimates/admin";
import { getSelections, type SessionProposal } from "@/lib/proposals/access";
import { docFromFull, docFromSession, skuNameMap, type ProposalFull } from "@/lib/proposals/document";
import { resolveDesign, type PageMode, type ProposalDesign } from "@/lib/proposals/design";
import { maskForPreview, validateProposalForRelease, type ValidationResult } from "@/lib/proposals/validate";
import { resolveAssetUrls, type PrintAssets } from "@/lib/proposals/assets";
import { documentHash } from "@/lib/proposals/pdf";

/**
 * render.ts — builds the ONE model every document surface renders from
 * (admin print, admin preview, client viewer, client print → PDF). Keeping
 * the validation → masking → design → assets → hash sequence here means no
 * surface can drift from another.
 */

if (typeof window !== "undefined") throw new Error("src/lib/proposals/render.ts is server-only");

export const RELEASED = new Set(["released", "signature_requested", "client_signed", "signed", "countersigned", "completed"]);
export const NOT_SUBMITTED = new Set(["draft", "sent", "client_invited", "viewed", "configuring", "in_progress", "revision_requested"]);

export interface RenderModel {
  doc: DocData;
  design: ProposalDesign;
  pageMode: PageMode;
  assets: PrintAssets;
  hash: string;
  validation: ValidationResult;
  /** admin-only banner text when the document is a masked design preview */
  previewNotice: string | null;
}

function finish(doc: DocData, design: ProposalDesign, pageMode: PageMode, assets: PrintAssets, validation: ValidationResult, admin: boolean): RenderModel {
  let d = doc; let previewNotice: string | null = null;
  if (!validation.ok) {
    d = maskForPreview(doc);
    if (admin) {
      const shown = validation.errors.slice(0, 2).map((e) => e.message).join(" ");
      previewNotice = `Design preview — ${validation.errors.length} release blocker${validation.errors.length === 1 ? "" : "s"}. ${shown}${validation.errors.length > 2 ? " …" : ""}`;
    }
  }
  return { doc: d, design, pageMode, assets, validation, previewNotice, hash: documentHash({ doc: d, pageMode, design, assets }) };
}

/** Admin surfaces. `modeOverride` lets the admin preview either page mode. */
export async function adminRenderModel(publicId: string, modeOverride?: string): Promise<(RenderModel & { full: ProposalFull }) | null> {
  const [full, names, assets] = await Promise.all([getProposalFull(ADMIN_SECRET, publicId) as Promise<ProposalFull | null>, skuNameMap(), resolveAssetUrls()]);
  if (!full?.head) return null;
  const doc = docFromFull(full, names);
  const design = resolveDesign(full.head.design, full.head.status);
  const pageMode: PageMode = modeOverride === "preliminary" || modeOverride === "formal" ? modeOverride : design.page_mode;
  const validation = validateProposalForRelease(doc, { mode: full.head.mode, submitted: !NOT_SUBMITTED.has(full.head.status) });
  return { ...finish(doc, design, pageMode, assets, validation, true), full };
}

/** Client surfaces: formal only once released, otherwise preliminary; never exposes validation text. */
export async function clientRenderModel(p: SessionProposal, session: string): Promise<RenderModel> {
  const [selections, names, assets] = await Promise.all([getSelections(session), skuNameMap(), resolveAssetUrls()]);
  const doc = docFromSession(p, selections as Record<string, Record<string, unknown>>, names);
  const design = resolveDesign(p.design, p.status);
  const pageMode: PageMode = RELEASED.has(p.status) ? design.page_mode : "preliminary";
  const validation = validateProposalForRelease(doc, { mode: p.mode, submitted: true });
  return finish(doc, design, pageMode, assets, validation, false);
}
