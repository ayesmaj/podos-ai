import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, getProposalFull } from "@/lib/estimates/admin";
import { docFromFull, skuNameMap, type ProposalFull } from "@/lib/proposals/document";
import ProposalDocument from "@/components/private/ProposalDocument";
import OpsShell from "@/components/ops/OpsShell";
import s from "@/components/private/private.module.css";

/**
 * /ops/proposals/[publicId]/preview — "view as client". Renders the exact
 * document the client will see (same DocData mapper) with an admin watermark;
 * never counts as a client view (no session_proposal call).
 */

export const metadata: Metadata = { title: "Proposal preview · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";
const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;

export default async function ProposalPreview({ params }: { params: Promise<{ publicId: string }> }) {
  await requireOps();
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();
  const [full, names] = await Promise.all([getProposalFull(ADMIN_SECRET, publicId) as Promise<ProposalFull | null>, skuNameMap()]);
  if (!full?.head) notFound();
  const doc = docFromFull(full, names);

  return (
    <OpsShell
      active="/ops/proposals"
      title="Proposal preview"
      actions={
        <>
          <a href={`/api/proposal/${publicId}/pdf`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnPrimary}`} style={{ minHeight: 40, fontSize: 13.5 }}>
            <Download size={15} aria-hidden /> Download PDF
          </a>
          <Link href={`/ops/proposals/${publicId}`} className={`${s.btn} ${s.btnSecondary}`} style={{ minHeight: 40, fontSize: 13.5 }}>
            <ArrowLeft size={15} aria-hidden /> Back to editor
          </Link>
        </>
      }
    >
      <p className={`${s.chip} ${s.chipCyan}`} style={{ marginBottom: "1rem" }}><Eye size={12} aria-hidden /> Viewing as {doc.clientName} · status {doc.status.replace(/_/g, " ")}</p>
      <div className={`${s.root} ${s.field}`} style={{ minHeight: 0, padding: "1.4rem", borderRadius: 16, background: "transparent" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <ProposalDocument d={doc} mode="admin" />
        </div>
      </div>
    </OpsShell>
  );
}
