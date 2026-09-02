import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, CheckCircle2, Download, PenLine, ShieldCheck } from "lucide-react";
import { VIEWER_COOKIE, clientComment, clientComments, clientSelectOptional, sessionProposal, signViaSession } from "@/lib/proposals/access";
import { RELEASED, clientRenderModel } from "@/lib/proposals/render";
import { usd } from "@/lib/proposals/money";
import ClientBar from "@/components/private/ClientBar";
import EstimateSheet from "@/components/print/EstimateSheet";
import s from "@/components/private/private.module.css";

/**
 * /client/proposals/[publicId]/proposal — the released proposal as ONE
 * estimate sheet (the same DOM the PDF prints) with the client's actions
 * embedded: optional add-on toggles (until signed), Accept & Sign (only while
 * PODOS has enabled the signature), "Not ready?" change request with a reason,
 * and the client's own message history. Anything not released → 404.
 */

export const metadata: Metadata = { title: "Your PODOS proposal", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";
const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;
const REASONS: [string, string][] = [["price", "Price"], ["timing", "Timing / schedule"], ["scope", "Scope or configuration"], ["needs_revision", "Needs a revision"], ["question", "Just a question"], ["other", "Other"]];

export default async function ClientProposal({ params, searchParams }: { params: Promise<{ publicId: string }>; searchParams: Promise<{ sent?: string }> }) {
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();
  const { sent } = await searchParams;
  const jar = await cookies();
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (!session) notFound();
  const p = await sessionProposal(session);
  if (!p || p.public_id !== publicId || !RELEASED.has(p.status)) notFound();

  const [m, thread] = await Promise.all([clientRenderModel(p, session), clientComments(session)]);
  const canSign = p.status === "signature_requested" && !p.signed_at;
  const canToggle = !p.signed_at && (p.status === "released" || p.status === "signature_requested");
  const preparedFor = p.company ? `${p.client_name} / ${p.company}` : p.client_name;
  const back = `/client/proposals/${publicId}/proposal`;

  async function sign(formData: FormData) {
    "use server";
    const name = String(formData.get("signerName") ?? "").trim();
    const title = String(formData.get("signerTitle") ?? "").trim();
    if (!name || formData.get("consent") !== "on") return;
    const tok = (await cookies()).get(VIEWER_COOKIE)?.value ?? "";
    if (!tok) return;
    await signViaSession(tok, name, title || undefined);
    revalidatePath(back);
  }

  async function comment(formData: FormData) {
    "use server";
    const reason = REASONS.find(([k]) => k === String(formData.get("reason")))?.[1];
    const note = String(formData.get("note") ?? "").trim();
    if (note.length < 2) return;
    const tok = (await cookies()).get(VIEWER_COOKIE)?.value ?? "";
    if (!tok) return;
    const ok = await clientComment(tok, `${reason ? `[${reason}] ` : ""}${note}`.slice(0, 2000));
    if (ok) redirect(`${back}?sent=1`);
  }

  async function toggle(formData: FormData) {
    "use server";
    const id = String(formData.get("itemId") ?? "");
    const on = formData.get("selected") === "1";
    const tok = (await cookies()).get(VIEWER_COOKIE)?.value ?? "";
    if (!tok || !/^[0-9a-f-]{36}$/.test(id)) return;
    await clientSelectOptional(tok, id, on);
    revalidatePath(back);
  }

  const actions = (
    <>
      {canSign && (
        <details className="es-cta-box">
          <summary className="es-cta"><PenLine size={18} aria-hidden /> Accept &amp; Sign — {usd(m.doc.lowCents)}{m.doc.lowCents !== m.doc.highCents ? ` – ${usd(m.doc.highCents)}` : ""}</summary>
          <form action={sign} className="es-form">
            <label htmlFor="signerName">Your full legal name</label>
            <input id="signerName" name="signerName" required autoComplete="name" placeholder={p.client_name} />
            <label htmlFor="signerTitle">Title / role (optional)</label>
            <input id="signerTitle" name="signerTitle" autoComplete="organization-title" />
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", textTransform: "none", letterSpacing: 0, fontFamily: "inherit", fontWeight: 400, fontSize: 12.5, color: "#3a4557", lineHeight: 1.5 }}>
              <input type="checkbox" name="consent" required style={{ width: 16, height: 16, marginTop: 2, accentColor: "#1b55f5" }} />
              I agree that my electronic signature is legally binding and I accept this proposal, the selected add-ons and the totals shown above, recorded against {p.viewer_email}.
            </label>
            <button type="submit">Sign &amp; Accept</button>
          </form>
        </details>
      )}
      {p.signed_at && <p className="es-chip"><ShieldCheck size={14} aria-hidden /> Signed by {p.signer_name} · {new Date(p.signed_at).toLocaleDateString("en-US")}</p>}
      {sent === "1" && <p className="es-chip"><CheckCircle2 size={14} aria-hidden /> Message sent to PODOS</p>}
      {m.design.allow_comments && (
        <details className="es-alt" open={sent === "1"}>
          <summary>{canSign ? "Not ready? Request changes or ask a question" : "Questions or changes? Message PODOS"}</summary>
          <form action={comment} className="es-form">
            <label htmlFor="reason">Reason</label>
            <select id="reason" name="reason" defaultValue="question" style={{ font: "inherit", fontSize: 14, padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(11,18,32,.1)", background: "#fff" }}>
              {REASONS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <label htmlFor="note">Message to PODOS</label>
            <textarea id="note" name="note" required minLength={2} maxLength={2000} rows={4} />
            <button type="submit">Send to PODOS</button>
          </form>
          {thread && thread.length > 0 && (
            <div className="es-form" style={{ background: "#fff" }}>
              <label>Your messages</label>
              {thread.map((t, i) => (
                <p key={i} style={{ fontSize: 13, color: "#3a4557", borderLeft: "2px solid #1b55f5", paddingLeft: 10, lineHeight: 1.5 }}>
                  <span style={{ display: "block", fontSize: 11, color: "#6b7686" }}>{new Date(t.at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>{t.note}
                </p>
              ))}
            </div>
          )}
        </details>
      )}
    </>
  );

  return (
    <div className={`${s.root} ${s.field}`}>
      <ClientBar
        publicId={publicId} project={p.project_name} preparedFor={preparedFor} label="Confidential proposal"
        right={
          <>
            {m.design.allow_download && <a href={`/api/proposal/${publicId}/pdf`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnSecondary}`} style={{ minHeight: 38, fontSize: 13 }}><Download size={14} aria-hidden /> Download PDF</a>}
            <Link href={`/client/proposals/${publicId}`} className={`${s.btn} ${s.btnGhost}`} style={{ fontSize: 13 }}><ArrowLeft size={14} aria-hidden /> Workspace</Link>
          </>
        }
      />
      <main className={`es-stage${canSign ? " has-sticky" : ""}`} style={{ minHeight: 0 }}>
        <EstimateSheet
          d={m.doc} pageMode={m.pageMode} design={m.design} hash={m.hash} assets={m.assets} actions={actions}
          renderAddonToggle={canToggle ? (line, row) => (
            <form action={toggle}>
              <input type="hidden" name="itemId" value={line.id ?? ""} />
              <input type="hidden" name="selected" value={line.selected !== false ? "0" : "1"} />
              <button type="submit" aria-pressed={line.selected !== false} aria-label={`${line.selected !== false ? "Remove" : "Add"} ${line.name}`}>{row}</button>
            </form>
          ) : undefined}
        />
        {canSign && (
          <div className="es-sticky web-only">
            <div className="t"><small>Total</small><b>{usd(m.doc.lowCents)}</b></div>
            <a href="#accept">Accept &amp; Sign</a>
          </div>
        )}
      </main>
    </div>
  );
}
