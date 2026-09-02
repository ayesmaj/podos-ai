import { Palette } from "lucide-react";
import type { ProposalDesign } from "@/lib/proposals/design";
import { saveDesignAction } from "./actions";

/**
 * Proposal Design panel: per-proposal settings for the estimate sheet. Plain
 * form → server action → estimates.design; the sheet, the client view and the
 * PDF read the same merged settings, so what is toggled here is what prints.
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
        <Palette size={14} aria-hidden /> Proposal design · {design.page_mode === "formal" ? "proposal" : "estimate"} · {design.watermark === "none" ? "no watermark" : `${design.watermark} watermark`}{design.signature_block ? " · signature line" : ""}
      </summary>
      <form action={saveDesignAction} style={{ padding: "0 1.2rem 1.2rem", display: "grid", gap: "1.1rem" }}>
        <input type="hidden" name="publicId" value={publicId} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1.2rem" }}>
          <div style={group}>
            <p style={head}>Document</p>
            <label style={{ fontSize: 12.5, color: "var(--ink-dim)", display: "grid", gap: 4 }}>Document type
              <select name="page_mode" defaultValue={design.page_mode} style={select}>
                <option value="formal">Proposal (released, priced)</option>
                <option value="preliminary">Estimate (indicative)</option>
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
            <p style={head}>Sheet sections</p>
            <Check name="v_product" label="Proposed-system image" on={design.visuals.product} />
            <Check name="s_summary" label="Project summary & key figures" on={design.sections.summary} />
            <Check name="s_notes" label="Notes" on={design.sections.notes} />
            <Check name="s_warranty" label="Warranty & support" on={design.sections.warranty} />
            <Check name="s_trust_band" label="Trust band (footer)" on={design.sections.trust_band} />
            <Check name="signature_block" label="Client signature line" on={design.signature_block} />
          </div>
          <div style={group}>
            <p style={head}>Client</p>
            <Check name="allow_download" label="Allow PDF download" on={design.allow_download} />
            <Check name="allow_comments" label="Allow questions / change requests" on={design.allow_comments} />
          </div>
        </div>
        <div>
          <button type="submit" style={{ ...mono, fontSize: 10, padding: ".55rem 1rem", borderRadius: 8, border: "none", background: "var(--brand-gradient)", color: "#fff", cursor: "pointer" }}>Save design</button>
        </div>
      </form>
    </details>
  );
}
