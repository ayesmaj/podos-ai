"use client";

import { Sparkles } from "lucide-react";
import Drawer from "@/components/ops/ui/Drawer";
import s from "@/components/ops/ui/ops.module.css";

/**
 * "Regenerate" drawer for one controlled visual — the quality choice and the
 * consequences (replaces the image for every proposal) live here, not inline
 * in the panel. Posts to the same regenerateAssetAction as before.
 */
export default function RegenerateDrawer({ type, label, references, action }: { type: string; label: string; references: string[]; action: (formData: FormData) => Promise<void> }) {
  const id = `regen-${type}`;
  return (
    <Drawer
      title={`Regenerate ${label.toLowerCase()} visual`}
      subtitle="A GPT Image 2 edit of the approved pod render with the fixed prompt. Takes one to three minutes."
      trigger={(open) => <button type="button" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`} onClick={open}><Sparkles size={14} aria-hidden /> Regenerate</button>}
      footer={(close) => (
        <>
          <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={close}>Cancel</button>
          <button type="submit" form={id} className={`${s.btn} ${s.btnPrimary}`}><Sparkles size={15} aria-hidden /> Regenerate now</button>
        </>
      )}
    >
      <form id={id} action={action} style={{ display: "grid", gap: 16 }}>
        <input type="hidden" name="type" value={type} />
        <label className={s.field}>
          Quality
          <select name="quality" defaultValue="high" className={s.input}>
            <option value="low">Low (test)</option>
            <option value="medium">Medium</option>
            <option value="high">High (production)</option>
          </select>
        </label>
        <div style={{ display: "grid", gap: 6 }}>
          <span className={s.label}>References</span>
          <p style={{ fontSize: 13.5, color: "var(--ops-ink-secondary)" }}>{references.join(", ")}</p>
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--ops-ink-secondary)" }}>
          The new image replaces the current one for <b style={{ color: "var(--ops-ink)" }}>every proposal</b> immediately. Check the live preview afterwards; you can revert to the shipped asset at any time. The API key stays on the server.
        </p>
      </form>
    </Drawer>
  );
}
