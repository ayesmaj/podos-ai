import { ChevronDown, Palette } from "lucide-react";
import type { ProposalDesign } from "@/lib/proposals/design";
import { ops as s } from "@/components/ops/ui";
import { saveDesignAction } from "./actions";
import p from "./proposal.module.css";

/**
 * Proposal Design panel: per-proposal settings for the estimate sheet. Plain
 * form → server action → estimates.design; the sheet, the client view and the
 * PDF read the same merged settings, so what is toggled here is what prints.
 * Rendered as a collapsible rail panel.
 */

function Check({ name, label, on }: { name: string; label: string; on: boolean }) {
  return (
    <label className={p.flag} style={{ fontSize: 13.5, fontWeight: 500 }}>
      <input type="checkbox" name={name} defaultChecked={on} /> {label}
    </label>
  );
}

export default function DesignPanel({ publicId, design }: { publicId: string; design: ProposalDesign }) {
  return (
    <details id="design" className={`${s.panel} ${s.panelTight} ${p.collapse}`}>
      <summary>
        <div style={{ minWidth: 0 }}>
          <h2 className={s.sectionTitle} style={{ display: "flex", alignItems: "center", gap: 8 }}><Palette size={16} color="var(--ops-cobalt)" aria-hidden /> Document design</h2>
          <p className={s.panelSummary}>{design.page_mode === "formal" ? "Proposal" : "Estimate"} · {design.watermark === "none" ? "no watermark" : `${design.watermark} watermark`}{design.signature_block ? " · signature line" : ""}</p>
        </div>
        <ChevronDown size={18} className={p.chev} aria-hidden />
      </summary>
      <form action={saveDesignAction} className={p.collapseBody}>
        <input type="hidden" name="publicId" value={publicId} />
        <div className={p.formGrid} style={{ gap: 18 }}>
          <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
            <p className={`${s.label} ${p.groupTitle}`}>Document</p>
            <label className={s.field}>Document type
              <select name="page_mode" defaultValue={design.page_mode} className={s.input}>
                <option value="formal">Proposal (released, priced)</option>
                <option value="preliminary">Estimate (indicative)</option>
              </select>
            </label>
            <label className={s.field}>Watermark
              <select name="watermark" defaultValue={design.watermark} className={s.input}>
                <option value="none">None</option><option value="draft">Draft</option><option value="confidential">Confidential</option><option value="preview">Preview</option>
              </select>
            </label>
            <label className={s.field}>Validity override (days, blank = expiry date)
              <input type="number" name="validity_days" min={1} max={365} defaultValue={design.validity_days ?? ""} className={s.input} />
            </label>
          </div>
          <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
            <p className={`${s.label} ${p.groupTitle}`}>Sheet sections</p>
            <Check name="v_product" label="Proposed-system image" on={design.visuals.product} />
            <Check name="s_summary" label="Project summary & key figures" on={design.sections.summary} />
            <Check name="s_notes" label="Notes" on={design.sections.notes} />
            <Check name="s_warranty" label="Warranty & support" on={design.sections.warranty} />
            <Check name="s_trust_band" label="Trust band (footer)" on={design.sections.trust_band} />
            <Check name="signature_block" label="Client signature line" on={design.signature_block} />
            <p className={`${s.label} ${p.groupTitle}`} style={{ marginTop: 8 }}>Client</p>
            <Check name="allow_download" label="Allow PDF download" on={design.allow_download} />
            <Check name="allow_comments" label="Allow questions / change requests" on={design.allow_comments} />
          </div>
        </div>
        <div><button type="submit" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Save design</button></div>
      </form>
    </details>
  );
}
