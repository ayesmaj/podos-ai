import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, Download, ExternalLink, Eye } from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { adminRenderModel } from "@/lib/proposals/render";
import ProposalPrint from "@/components/print/ProposalPrint";
import PrintViewer from "@/components/print/PrintViewer";
import OpsShell from "@/components/ops/OpsShell";
import s from "@/components/private/private.module.css";

/**
 * /ops/proposals/[publicId]/preview — "view as client": the exact paginated
 * document the client sees and the PDF prints (one design everywhere), plus
 * the release-readiness result. Never counts as a client view.
 */

export const metadata: Metadata = { title: "Proposal preview · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";
const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;

export default async function ProposalPreview({ params, searchParams }: { params: Promise<{ publicId: string }>; searchParams: Promise<{ mode?: string }> }) {
  await requireOps();
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();
  const sp = await searchParams;
  const m = await adminRenderModel(publicId, sp.mode);
  if (!m) notFound();
  const other = m.pageMode === "formal" ? "preliminary" : "formal";
  const btn = { minHeight: 40, fontSize: 13.5 } as const;

  return (
    <OpsShell
      active="/ops/proposals"
      title="Proposal document"
      actions={
        <>
          <a href={`/api/proposal/${publicId}/pdf?mode=${m.pageMode}`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnPrimary}`} style={btn}><Download size={15} aria-hidden /> Download PDF</a>
          <Link href={`/ops/proposals/${publicId}/preview?mode=${other}`} className={`${s.btn} ${s.btnSecondary}`} style={btn}><Eye size={15} aria-hidden /> View {other}</Link>
          <a href={`/ops/proposals/${publicId}/print?mode=${m.pageMode}`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnSecondary}`} style={btn}><ExternalLink size={15} aria-hidden /> Print view</a>
          <Link href={`/ops/proposals/${publicId}`} className={`${s.btn} ${s.btnSecondary}`} style={btn}><ArrowLeft size={15} aria-hidden /> Back to editor</Link>
        </>
      }
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <Readiness ok={m.validation.ok} errors={m.validation.errors.map((e) => e.message)} warnings={m.validation.warnings.map((w) => w.message)} />
        <div className={s.panel} style={{ padding: "1rem", borderRadius: 16, background: "#e6eaf1" }}>
          <PrintViewer toolbar={<p className={`${s.chip} ${s.chipCyan}`} style={{ margin: 0 }}><Eye size={12} aria-hidden /> {m.pageMode} · viewing as {m.doc.clientName} · {m.full.head.status.replace(/_/g, " ")}</p>}>
            <ProposalPrint d={m.doc} pageMode={m.pageMode} design={m.design} hash={m.hash} assets={m.assets} previewNotice={m.previewNotice} />
          </PrintViewer>
        </div>
      </div>
    </OpsShell>
  );
}

function Readiness({ ok, errors, warnings }: { ok: boolean; errors: string[]; warnings: string[] }) {
  if (ok && !warnings.length) return <p className={`${s.chip} ${s.chipOk}`}><CheckCircle2 size={12} aria-hidden /> Ready for release — validation passed</p>;
  return (
    <div className={s.panel} style={{ padding: "0.9rem 1.1rem", borderColor: ok ? undefined : "rgba(185,28,28,.35)", display: "grid", gap: 8 }}>
      <p className={s.label} style={{ display: "flex", alignItems: "center", gap: 6, color: ok ? "#8a6a00" : "#B91C1C" }}>
        <AlertTriangle size={13} aria-hidden /> {ok ? `${warnings.length} warning${warnings.length === 1 ? "" : "s"}` : `${errors.length} release blocker${errors.length === 1 ? "" : "s"} — document shown as design preview`}
      </p>
      {errors.length > 0 && <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "#7f1d1d", display: "grid", gap: 3 }}>{errors.map((e) => <li key={e}>{e}</li>)}</ul>}
      {warnings.length > 0 && <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--ink-dim)", display: "grid", gap: 3 }}>{warnings.map((w) => <li key={w}>{w}</li>)}</ul>}
    </div>
  );
}
