import { Palette } from "lucide-react";
import type { ProposalDesign } from "@/lib/proposals/design";
import { saveDesignAction } from "./actions";

/**
 * Proposal Design panel (brief §16): per-proposal document settings. Plain
 * form → server action → estimates.design; the print route and the client
 * viewer read the same merged settings, so what is toggled here is what prints.
 */

const mono = { fontFamily: "var(--font-display)", letterSpacing: ".06em", textTransform: "uppercase" as const };

export default function DesignPanel({ publicId, design }: { publicId: string; design: ProposalDesign }) {
  const Check = ({ name, label, on }: { name: string; label: string; on: boolean }) => (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-dim)" }}>
      <input type="checkbox" name={name} defaultChecked={on} style={{ width: 16, height: 16, accentColor: "var(--brand)" }} /> {label}
    </label>
  );
  const group = { display: "grid", gap: 6, alignContent: "start" } as const;
  const head = { ...mono, fontSize: 9.5, color: "var(--brand-deep)", marginBottom: 4 } as const;
  const select = { fontSize: 13, padding: ".4rem .6rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "inherit" } as const;

  return (
    <details style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", marginBottom: "1.2rem" }}>
      <summary style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", padding: ".9rem 1.2rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, listStyle: "none" }}>
        <Palette size={14} aria-hidden /> Proposal design · {design.page_mode} · {design.watermark === "none" ? "no watermark" : `${design.watermark} watermark`}{design.signature_block ? " · signature block" : ""}
      </summary>
      <form action={saveDesignAction} style={{ padding: "0 1.2rem 1.2rem", display: "grid", gap: "1.1rem" }}>
        <input type="hidden" name="publicId" value={publicId} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1.2rem" }}>
          <div style={group}>
            <p style={head}>Document</p>
            <label style={{ fontSize: 12.5, color: "var(--ink-dim)", display: "grid", gap: 4 }}>Page mode
              <select name="page_mode" defaultValue={design.page_mode} style={select}>
                <option value="formal">Formal commercial proposal (3 pages)</option>
                <option value="preliminary">Preliminary configuration estimate (2 pages)</option>
              </select>
            </label>
            <label style={{ fontSize: 12.5, color: "var(--ink-dim)", display: "grid", gap: 4 }}>Watermark
              <select name="watermark" defaultValue={design.watermark} style={select}>
                <option value="none">None</option><option value="draft">Draft</option><option value="confidential">Confidential</option><option value="preview">Preview</option>
              </select>
            </label>
            <label style={{ fontSize: 12.5, color: "var(--ink-dim)", display: "grid", gap: 4 }}>Validity override (days, blank = expiry date)
              <input type="number" name="validity_days" min={1} max={365} defaultValue={design.validity_days ?? ""} style={select} />
            </label>
          </div>
          <div style={group}>
            <p style={head}>Visuals</p>
            <Check name="v_cover" label="Cover pod hero" on={design.visuals.cover} />
            <Check name="v_cutaway" label="Technical cutaway (page 2)" on={design.visuals.cutaway} />
            <Check name="v_deployment" label="Deployment visual (preliminary)" on={design.visuals.deployment} />
          </div>
          <div style={group}>
            <p style={head}>Sections</p>
            <Check name="s_exec_summary" label="Executive summary" on={design.sections.exec_summary} />
            <Check name="s_metrics" label="Key metrics" on={design.sections.metrics} />
            <Check name="s_spec_modules" label="Specification modules" on={design.sections.spec_modules} />
            <Check name="s_scope" label="Included scope" on={design.sections.scope} />
            <Check name="s_timeline" label="Deployment timeline" on={design.sections.timeline} />
            <Check name="s_responsibilities" label="Responsibilities" on={design.sections.responsibilities} />
            <Check name="s_assumptions" label="Assumptions · exclusions · validity" on={design.sections.assumptions} />
            <Check name="s_next_step" label="Next step band" on={design.sections.next_step} />
          </div>
          <div style={group}>
            <p style={head}>Client</p>
            <Check name="signature_block" label="Signature block on last page" on={design.signature_block} />
            <Check name="allow_download" label="Allow PDF download" on={design.allow_download} />
            <Check name="allow_comments" label="Allow comments / revision requests" on={design.allow_comments} />
          </div>
        </div>
        <div>
          <button type="submit" style={{ ...mono, fontSize: 10, padding: ".55rem 1rem", borderRadius: 8, border: "none", background: "var(--brand-gradient)", color: "#fff", cursor: "pointer" }}>Save design</button>
        </div>
      </form>
    </details>
  );
}
