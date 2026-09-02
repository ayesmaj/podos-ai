import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireOps } from "@/lib/ops/session";
import { adminRenderModel } from "@/lib/proposals/render";
import EstimateSheet from "@/components/print/EstimateSheet";

/**
 * /ops/proposals/[publicId]/print — the print source for the admin (also what
 * the PDF service prints). ?mode=formal|preliminary overrides the stored page
 * mode; ?screen=0 drops the on-screen stage (PDF).
 *
 * A proposal that fails validateProposalForRelease renders as a DESIGN
 * PREVIEW: real numbers, placeholder text masked, watermark, blockers in the
 * notice. It can never be released in that state.
 */

export const metadata: Metadata = { title: "Proposal document · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";
const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;

export default async function OpsPrintPage({ params, searchParams }: { params: Promise<{ publicId: string }>; searchParams: Promise<{ mode?: string; screen?: string }> }) {
  await requireOps();
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();
  const sp = await searchParams;
  const m = await adminRenderModel(publicId, sp.mode);
  if (!m) notFound();
  const sheet = <EstimateSheet d={m.doc} pageMode={m.pageMode} design={m.design} hash={m.hash} assets={m.assets} previewNotice={m.previewNotice} />;
  return sp.screen === "0" ? sheet : <div className="es-stage">{sheet}</div>;
}
