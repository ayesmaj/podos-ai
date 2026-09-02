import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { AlertTriangle, CheckCircle2, ExternalLink, FileText, ImageIcon, Layers, PenLine, RotateCcw, Settings2, Stamp } from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, listEstimates } from "@/lib/estimates/admin";
import { PROPOSAL_ASSETS } from "@/lib/proposals/imagePrompts";
import { ASSET_TYPES, listProposalAssets, resolveAssetUrls } from "@/lib/proposals/assets";
import { AppShell, Chip, EmptyState, Notice, PageHeader, Panel, PanelLink, fmtDate, ops as s } from "@/components/ops/ui";
import RegenerateDrawer from "./RegenerateDrawer";
import { dismissAssetResult, regenerateAssetAction, revertAssetAction } from "./actions";
import d from "./design.module.css";

/**
 * /ops/design — Editor / Split archetype (brief §20). Left: the one featured
 * item, a live preview of the estimate sheet rendered by the print route.
 * Right: the three controlled visuals every proposal document uses (brief
 * §11–§15) — each a GPT Image 2 EDIT of the approved pod render with a fixed
 * prompt; regenerating replaces it for all proposals at once — plus a pointer
 * to the per-proposal options. Images never carry client text.
 */

export const metadata: Metadata = { title: "Document design · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const USE: Record<string, string> = {
  cover: "Estimate sheet · “Proposed system” image next to the project title",
  cutaway: "Not used by the current sheet layout (kept for technical appendices)",
  deployment: "Not used by the current sheet layout (kept for site documents)",
};
const cap = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

export default async function DesignPage() {
  await requireOps();
  const [rows, urls, estimates] = await Promise.all([listProposalAssets(ADMIN_SECRET), resolveAssetUrls(), listEstimates(ADMIN_SECRET)]);
  const byType = new Map((rows ?? []).map((r) => [r.type, r]));
  const regenerated = ASSET_TYPES.filter((t) => byType.has(t)).length;
  const preview = (estimates ?? []).filter((e) => !e.revoked).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] ?? null;

  const jar = await cookies();
  const raw = jar.get("podos_asset_result")?.value;
  const [rType, rStatus, rDetail] = raw ? raw.split("|") : [];

  return (
    <AppShell active="/ops/design">
      <PageHeader
        title="Document design"
        subtitle="The controlled visuals and layout every proposal document shares. Regenerate a visual once and every proposal — preliminary and formal — uses it immediately; client names, numbers and labels are drawn by the document, never baked into the images."
        count={`${ASSET_TYPES.length} controlled visuals · ${regenerated} regenerated · ${ASSET_TYPES.length - regenerated} shipped`}
      />

      {raw && (
        <Notice tone={rStatus === "ok" ? "ok" : "danger"}>
          {rStatus === "ok" ? <CheckCircle2 size={16} aria-hidden /> : <AlertTriangle size={16} aria-hidden />}
          <div style={{ flex: 1, minWidth: 0 }}><b>{cap(rType ?? "")} · {rStatus === "ok" ? "done" : "failed"}</b> · {rDetail}</div>
          <form action={dismissAssetResult}><button type="submit" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Done</button></form>
        </Notice>
      )}

      <div className={s.split75}>
        {/* LEFT · featured live preview */}
        <Panel
          className={d.featured}
          title="Live preview"
          icon={<FileText size={18} aria-hidden />}
          summary={preview ? `Formal estimate sheet of ${preview.company ?? preview.client_name}${preview.project_name ? ` — ${preview.project_name}` : ""}, the most recent proposal.` : "Renders the most recent proposal with the current visuals."}
          action={preview ? <a href={`/ops/proposals/${preview.public_id}/print?mode=formal&screen=1`} target="_blank" rel="noopener" className={s.panelAction}>Open full size <ExternalLink size={13} aria-hidden /></a> : undefined}
        >
          {preview ? (
            <>
              <iframe
                src={`/ops/proposals/${preview.public_id}/print?mode=formal&screen=1`}
                title={`Estimate sheet preview · ${preview.public_id}`}
                className={d.preview}
                loading="lazy"
              />
              <div className={d.previewMeta}>
                <span><b className={s.num} style={{ color: "var(--ops-ink-secondary)" }}>{preview.public_id}</b> · {preview.estimate_no} · created {fmtDate(preview.created_at)} · same document the client sees and the PDF prints</span>
                <Link href={`/ops/proposals/${preview.public_id}`} className={s.panelAction}>Open proposal</Link>
              </div>
            </>
          ) : (
            <EmptyState
              icon={<FileText size={22} strokeWidth={1.8} />}
              title="No proposal to preview yet"
              text="The live preview renders the most recent proposal's estimate sheet with the current visuals. It appears as soon as the first proposal exists."
              action={<Link href="/ops/proposals" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Go to Proposals</Link>}
            />
          )}
        </Panel>

        {/* RIGHT · controlled visuals + per-proposal options */}
        <aside className={s.stack}>
          {ASSET_TYPES.map((type) => {
            const spec = PROPOSAL_ASSETS[type];
            const row = byType.get(type);
            const src = urls[type] ?? "";
            const refs = spec.references.map((r) => r.replace(/^public/, ""));
            return (
              <Panel key={type} tight title={cap(type)} icon={<ImageIcon size={18} aria-hidden />} action={row ? <Chip tone="cobalt">Regenerated</Chip> : <Chip tone="gray">Shipped</Chip>}>
                <div className={d.asset}>
                  <div className={d.thumb} style={{ aspectRatio: spec.size === "1024x1536" ? "3 / 4" : "3 / 2" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={spec.alt} />
                  </div>
                  <div className={d.facts}>
                    <div className={d.fact}><span className={s.label}>Use</span><span className={d.factValue}>{USE[type]}</span></div>
                    <div className={d.fact}><span className={s.label}>Size</span><span className={d.factMeta}>{spec.size.replace("x", " × ")} px · {spec.size === "1024x1536" ? "portrait" : "landscape"}</span></div>
                    <div className={d.fact}>
                      <span className={s.label}>Current file</span>
                      <span className={d.factMeta} title={row ? new Date(row.generated_at).toISOString() : undefined}>
                        {row ? `Generated ${new Date(row.generated_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} · ${(row.bytes / 1024).toFixed(0)} KB · ${row.sha256.slice(0, 12)}` : "Shipped asset · generated Sep 1, 2026"}
                      </span>
                    </div>
                    <details className={d.prompt}>
                      <summary>Prompt · references {refs.join(", ")}</summary>
                      <pre>{spec.prompt.trim()}</pre>
                    </details>
                  </div>
                  <div className={d.actions}>
                    <RegenerateDrawer type={type} label={type} references={refs} action={regenerateAssetAction} />
                    {row && (
                      <form action={revertAssetAction}>
                        <input type="hidden" name="type" value={type} />
                        <button type="submit" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`}><RotateCcw size={14} aria-hidden /> Revert to shipped</button>
                      </form>
                    )}
                  </div>
                </div>
              </Panel>
            );
          })}

          <Panel tight title="Per-proposal options" icon={<Settings2 size={18} aria-hidden />} action={<PanelLink href="/ops/proposals">Proposals</PanelLink>}>
            <div className={d.options}>
              <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--ops-ink-secondary)" }}>The visuals above are global. Everything that differs per document is set in that proposal&apos;s <b style={{ color: "var(--ops-ink)" }}>Proposal design</b> panel:</p>
              <div className={d.option}><Layers size={15} aria-hidden /><span><b>Page mode</b> — preliminary estimate or formal proposal.</span></div>
              <div className={d.option}><Stamp size={15} aria-hidden /><span><b>Watermark</b> — draft / confidential marking on every page.</span></div>
              <div className={d.option}><FileText size={15} aria-hidden /><span><b>Sections</b> — which blocks of the document are included.</span></div>
              <div className={d.option}><PenLine size={15} aria-hidden /><span><b>Signature</b> — whether the client can sign the document.</span></div>
            </div>
          </Panel>
        </aside>
      </div>

      <p className={s.muted} style={{ fontSize: 13, lineHeight: 1.6, maxWidth: "76ch" }}>
        Regeneration takes one to three minutes and replaces the asset for every proposal — check the live preview before releasing anything. The image API key stays on the server; nothing is sent to the client.
      </p>
    </AppShell>
  );
}
