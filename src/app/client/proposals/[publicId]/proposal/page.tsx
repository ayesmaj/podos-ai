import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, CheckCircle2, Download, MessageSquare, PenLine, ShieldCheck } from "lucide-react";
import { VIEWER_COOKIE, clientComment, sessionProposal, signViaSession } from "@/lib/proposals/access";
import { RELEASED, clientRenderModel } from "@/lib/proposals/render";
import ClientBar from "@/components/private/ClientBar";
import ProposalPrint from "@/components/print/ProposalPrint";
import PrintViewer from "@/components/print/PrintViewer";
import s from "@/components/private/private.module.css";

/**
 * /client/proposals/[publicId]/proposal — the FORMAL proposal (redesign brief
 * §18). Renders the same paginated document the PDF prints (one design,
 * everywhere). Visible only after PODOS releases it; the signature CTA appears
 * only while status is `signature_requested` and is recorded against the
 * verified viewer session. Anything not released → 404.
 */

export const metadata: Metadata = { title: "Your PODOS proposal", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";
const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;

export default async function ClientProposal({ params, searchParams }: { params: Promise<{ publicId: string }>; searchParams: Promise<{ sent?: string }> }) {
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();
  const { sent } = await searchParams;
  const jar = await cookies();
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (!session) notFound();
  const p = await sessionProposal(session);
  if (!p || p.public_id !== publicId || !RELEASED.has(p.status)) notFound();

  const m = await clientRenderModel(p, session);
  const canSign = p.status === "signature_requested" && !p.signed_at;
  const preparedFor = p.company ? `${p.client_name} / ${p.company}` : p.client_name;
  const download = m.design.allow_download ? (
    <a href={`/api/proposal/${publicId}/pdf`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnSecondary}`} style={{ minHeight: 38, fontSize: 13 }}><Download size={14} aria-hidden /> Download PDF</a>
  ) : null;

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

  async function comment(formData: FormData) {
    "use server";
    const note = String(formData.get("note") ?? "").trim();
    if (note.length < 2) return;
    const tok = (await cookies()).get(VIEWER_COOKIE)?.value ?? "";
    if (!tok) return;
    const ok = await clientComment(tok, note.slice(0, 2000));
    if (ok) redirect(`/client/proposals/${publicId}/proposal?sent=1`);
  }

  return (
    <div className={`${s.root} ${s.field}`}>
      <ClientBar
        publicId={publicId} project={p.project_name} preparedFor={preparedFor} label="Confidential proposal"
        right={<>{download}<Link href={`/client/proposals/${publicId}`} className={`${s.btn} ${s.btnGhost}`} style={{ fontSize: 13 }}><ArrowLeft size={14} aria-hidden /> Workspace</Link></>}
      />
      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(1.4rem, 3vw, 2.4rem) clamp(1rem, 3vw, 2rem) 5rem" }}>
        <div className={`${s.rise} ${s.twoCol}`}>
          <div style={{ minWidth: 0 }}>
            <PrintViewer>
              <ProposalPrint d={m.doc} pageMode={m.pageMode} design={m.design} hash={m.hash} assets={m.assets} />
            </PrintViewer>
          </div>

          <aside style={{ position: "sticky", top: 84, display: "grid", gap: "1rem", alignSelf: "start" }}>
            <div className={`${s.panel} ${s.panelLift}`} style={{ padding: "1.2rem" }}>
              <p className={`${s.label} ${s.labelBrand}`}>Document</p>
              <div style={{ display: "grid", gap: 6, marginTop: 10, fontSize: 13.5 }}>
                <Row k="Reference" v={m.doc.publicId} /><Row k="Version" v={`v${m.doc.rev}`} />
                <Row k="Status" v={p.status.replace(/_/g, " ")} />
                {m.doc.expires && <Row k="Valid until" v={new Date(m.doc.expires).toLocaleDateString("en-US", { dateStyle: "medium" })} />}
                <Row k="Document hash" v={m.hash} />
              </div>
              {m.design.allow_download && <a href={`/api/proposal/${publicId}/pdf`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnPrimary}`} style={{ width: "100%", marginTop: "1rem" }}><Download size={16} aria-hidden /> Download PDF</a>}
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
            {m.design.allow_comments && (
              <form action={comment} className={s.panel} style={{ padding: "1.2rem", display: "grid", gap: "0.6rem" }}>
                <p className={`${s.label} ${s.labelBrand}`} style={{ display: "flex", alignItems: "center", gap: 6 }}><MessageSquare size={13} aria-hidden /> Questions or changes</p>
                <p className={s.help} style={{ lineHeight: 1.55 }}>Ask a question or request a change to this proposal. Your message is recorded on the proposal for the PODOS team, who reply by email.</p>
                {sent === "1" && <p className={`${s.chip} ${s.chipOk}`}><CheckCircle2 size={12} aria-hidden /> Message sent to PODOS</p>}
                <label className={`${s.label} ${s.fieldLabel}`} htmlFor="note">Message</label>
                <textarea id="note" name="note" required minLength={2} maxLength={2000} rows={4} className={s.input} style={{ resize: "vertical", minHeight: 96 }} />
                <button type="submit" className={`${s.btn} ${s.btnSecondary}`}>Send to PODOS</button>
              </form>
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
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ color: "var(--ink-faint)" }}>{k}</span><span style={{ fontWeight: 600, textTransform: "capitalize", fontVariantNumeric: "tabular-nums" }}>{v}</span></div>;
}
