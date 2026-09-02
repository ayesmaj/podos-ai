import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ImageIcon, RotateCcw, Sparkles } from "lucide-react";
import OpsShell from "@/components/ops/OpsShell";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET } from "@/lib/estimates/admin";
import { PROPOSAL_ASSETS } from "@/lib/proposals/imagePrompts";
import { ASSET_TYPES, listProposalAssets, resolveAssetUrls } from "@/lib/proposals/assets";
import { dismissAssetResult, regenerateAssetAction, revertAssetAction } from "./actions";

/**
 * /ops/design — the controlled visuals every proposal document uses (brief
 * §11–§15). Each asset is a GPT Image 2 EDIT of the approved pod render with a
 * fixed prompt; regenerating replaces it for all proposals at once (one design,
 * everywhere). Images never carry client text — the document composites that.
 */

export const metadata: Metadata = { title: "Document design · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const mono = { fontFamily: "var(--font-display)", letterSpacing: ".08em", textTransform: "uppercase" as const };
const USE: Record<string, string> = { cover: "Page 1 · cover hero (portrait)", cutaway: "Page 2 · technical illustration with SVG callouts", deployment: "Preliminary estimate · page 2 deployment visual" };

export default async function DesignPage() {
  await requireOps();
  const [rows, urls] = await Promise.all([listProposalAssets(ADMIN_SECRET), resolveAssetUrls()]);
  const byType = new Map((rows ?? []).map((r) => [r.type, r]));
  const jar = await cookies();
  const raw = jar.get("podos_asset_result")?.value;
  const [rType, rStatus, rDetail] = raw ? raw.split("|") : [];

  return (
    <OpsShell active="/ops/design" title="Document design">
      <p style={{ fontSize: 14, color: "var(--ink-dim)", maxWidth: 760, lineHeight: 1.6, marginBottom: "1.2rem" }}>
        These three visuals appear in every proposal document (preliminary and formal). Each one is a controlled GPT Image 2 edit of the approved
        PODOS pod render with a fixed prompt — regenerate when the product render changes, and the new image is used by every proposal immediately.
        Client names, numbers and labels are never inside the images; the document draws them.
      </p>

      {raw && (
        <div style={{ marginBottom: "1.2rem", border: `1px solid ${rStatus === "ok" ? "rgba(34,197,94,.45)" : "rgba(185,28,28,.4)"}`, borderRadius: 12, background: rStatus === "ok" ? "rgba(34,197,94,.07)" : "rgba(185,28,28,.06)", padding: "0.9rem 1.2rem", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <p style={{ ...mono, fontSize: 10, color: rStatus === "ok" ? "#15803D" : "#B91C1C" }}>{rType} · {rStatus === "ok" ? "done" : "failed"}</p>
          <p style={{ fontSize: 13, color: "var(--ink-dim)" }}>{rDetail}</p>
          <form action={dismissAssetResult} style={{ marginLeft: "auto" }}><button type="submit" style={{ ...mono, fontSize: 9.5, padding: ".4rem .7rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", cursor: "pointer" }}>Done</button></form>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.2rem" }}>
        {ASSET_TYPES.map((type) => {
          const spec = PROPOSAL_ASSETS[type];
          const row = byType.get(type);
          const src = urls[type] ?? "";
          return (
            <section key={type} style={{ border: "1px solid var(--edge)", borderRadius: 14, background: "var(--panel)", overflow: "hidden", display: "grid" }}>
              <div style={{ background: "#eef2f8", aspectRatio: spec.size === "1024x1536" ? "3 / 4" : "3 / 2", display: "grid", placeItems: "center", overflow: "hidden", maxHeight: 360 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={spec.alt} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <div style={{ padding: "1rem 1.2rem 1.2rem", display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, textTransform: "capitalize" }}>{type}</h2>
                  <span style={{ ...mono, fontSize: 9, color: "var(--ink-faint)" }}>{spec.size}</span>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--ink-dim)" }}>{USE[type]}</p>
                <p style={{ fontSize: 12, color: row ? "var(--brand-deep)" : "var(--ink-faint)", display: "flex", alignItems: "center", gap: 6 }}>
                  <ImageIcon size={13} aria-hidden />
                  {row ? `Generated ${new Date(row.generated_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} · ${(row.bytes / 1024).toFixed(0)} KB · ${row.sha256.slice(0, 12)}` : "Shipped asset (generated 1 Sep 2026)"}
                </p>
                <details>
                  <summary style={{ ...mono, fontSize: 9.5, color: "var(--ink-faint)", cursor: "pointer" }}>Prompt · references {spec.references.map((r) => r.replace(/^public/, "")).join(", ")}</summary>
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: 11.5, lineHeight: 1.5, color: "var(--ink-dim)", marginTop: 8, fontFamily: "inherit" }}>{spec.prompt.trim()}</pre>
                </details>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <form action={regenerateAssetAction} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input type="hidden" name="type" value={type} />
                    <select name="quality" defaultValue="high" aria-label="Quality" style={{ fontSize: 12.5, padding: ".45rem .5rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)" }}>
                      <option value="low">Low (test)</option><option value="medium">Medium</option><option value="high">High (production)</option>
                    </select>
                    <button type="submit" style={{ ...mono, fontSize: 10, padding: ".55rem .9rem", borderRadius: 8, border: "none", background: "var(--brand-gradient)", color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Sparkles size={13} aria-hidden /> Regenerate
                    </button>
                  </form>
                  {row && (
                    <form action={revertAssetAction}>
                      <input type="hidden" name="type" value={type} />
                      <button type="submit" style={{ ...mono, fontSize: 10, padding: ".55rem .9rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <RotateCcw size={13} aria-hidden /> Revert to shipped
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: "1.2rem", lineHeight: 1.6 }}>
        Regeneration takes one to three minutes and replaces the asset for every proposal (open a proposal preview to check the result before releasing).
        The API key stays on the server; nothing is sent to the client.
      </p>
    </OpsShell>
  );
}
