import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, Download, PenLine, ShieldCheck } from "lucide-react";
import { VIEWER_COOKIE, getSelections, sessionProposal, signViaSession } from "@/lib/proposals/access";
import { docFromSession, skuNameMap } from "@/lib/proposals/document";
import ClientBar from "@/components/private/ClientBar";
import ProposalDocument from "@/components/private/ProposalDocument";
import s from "@/components/private/private.module.css";

/**
 * /client/proposals/[publicId]/proposal — the FORMAL proposal (redesign brief
 * §18). Separate from the configurator: visible only after PODOS releases it.
 * The signature CTA appears only while status is `signature_requested`
 * (admin-enabled), and is an identity-attached acknowledgement recorded
 * against the verified viewer session. Anything not released → 404.
 */

export const metadata: Metadata = { title: "Your PODOS proposal", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;
const VISIBLE = new Set(["released", "signature_requested", "client_signed", "signed", "countersigned", "completed"]);

export default async function ClientProposal({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();
  const jar = await cookies();
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (!session) notFound();
  const p = await sessionProposal(session);
  if (!p || p.public_id !== publicId || !VISIBLE.has(p.status)) notFound();

  const [selections, names] = await Promise.all([getSelections(session), skuNameMap()]);
  const doc = docFromSession(p, selections as Record<string, Record<string, unknown>>, names);
  const canSign = p.status === "signature_requested" && !p.signed_at;
  const preparedFor = p.company ? `${p.client_name} / ${p.company}` : p.client_name;

  async function sign(formData: FormData) {
    "use server";
    const name = String(formData.get("signerName") ?? "").trim();
    const title = String(formData.get("signerTitle") ?? "").trim();
    if (!name) return;
    const j = await cookies();
    const tok = j.get(VIEWER_COOKIE)?.value ?? "";
    if (!tok) return;
    await signViaSession(tok, name, title || undefined);
    revalidatePath(`/client/proposals/${publicId}/proposal`);
  }

  return (
    <div className={`${s.root} ${s.field}`}>
      <ClientBar
        publicId={publicId} project={p.project_name} preparedFor={preparedFor} label="Confidential proposal"
        right={
          <>
            <a href={`/api/proposal/${publicId}/pdf`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnSecondary}`} style={{ minHeight: 38, fontSize: 13 }}><Download size={14} aria-hidden /> Download PDF</a>
            <Link href={`/client/proposals/${publicId}`} className={`${s.btn} ${s.btnGhost}`} style={{ fontSize: 13 }}><ArrowLeft size={14} aria-hidden /> Workspace</Link>
          </>
        }
      />
      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(1.4rem, 3vw, 2.4rem) clamp(1rem, 3vw, 2rem) 5rem" }}>
        <div className={`${s.rise} ${s.twoCol}`}>
          <ProposalDocument d={doc} mode="client" />

          <aside style={{ position: "sticky", top: 84, display: "grid", gap: "1rem" }}>
            <div className={`${s.panel} ${s.panelLift}`} style={{ padding: "1.2rem" }}>
              <p className={`${s.label} ${s.labelBrand}`}>Document</p>
              <div style={{ display: "grid", gap: 6, marginTop: 10, fontSize: 13.5 }}>
                <Row k="Reference" v={doc.estimateNo} /><Row k="Version" v={`v${doc.rev}`} />
                <Row k="Status" v={p.status.replace(/_/g, " ")} />
                {doc.expires && <Row k="Valid until" v={new Date(doc.expires).toLocaleDateString("en-US", { dateStyle: "medium" })} />}
              </div>
              <a href={`/api/proposal/${publicId}/pdf`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnPrimary}`} style={{ width: "100%", marginTop: "1rem" }}><Download size={16} aria-hidden /> Download PDF</a>
            </div>

            {canSign && (
              <form action={sign} className={`${s.panel} ${s.panelLift}`} style={{ padding: "1.2rem", display: "grid", gap: "0.7rem", borderColor: "rgba(37,99,235,.35)" }}>
                <p className={`${s.label} ${s.labelBrand}`} style={{ display: "flex", alignItems: "center", gap: 6 }}><PenLine size={13} aria-hidden /> Accept &amp; sign</p>
                <p className={s.help} style={{ lineHeight: 1.55 }}>Your acceptance is recorded against your verified access ({p.viewer_email}). This is an acknowledgement of the proposal; contract execution follows.</p>
                <label className={`${s.label} ${s.fieldLabel}`} htmlFor="signerName">Full name</label>
                <input id="signerName" name="signerName" required className={s.input} autoComplete="name" />
                <label className={`${s.label} ${s.fieldLabel}`} htmlFor="signerTitle">Title (optional)</label>
                <input id="signerTitle" name="signerTitle" className={s.input} autoComplete="organization-title" />
                <button type="submit" className={`${s.btn} ${s.btnPrimary}`}>Sign and accept</button>
              </form>
            )}
            {p.signed_at && (
              <p className={`${s.chip} ${s.chipOk}`}><ShieldCheck size={12} aria-hidden /> Signed by {p.signer_name} · {new Date(p.signed_at).toLocaleDateString("en-US")}</p>
            )}
            <div className={s.panel} style={{ padding: "1rem 1.2rem" }}>
              <p className={`${s.label} ${s.labelBrand}`} style={{ display: "flex", alignItems: "center", gap: 6 }}><ShieldCheck size={13} aria-hidden /> Security &amp; confidentiality</p>
              <p className={s.help} style={{ marginTop: 6, lineHeight: 1.55 }}>This document is confidential and intended solely for the recipient. Access is recorded.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "var(--ink-faint)" }}>{k}</span><span style={{ fontWeight: 600, textTransform: "capitalize" }}>{v}</span></div>;
}
