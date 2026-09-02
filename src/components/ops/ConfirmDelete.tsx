import { Trash2 } from "lucide-react";
import s from "@/components/ops/ui/ops.module.css";

/**
 * Two-step destructive control shared by the ops lists and detail pages.
 * Plain: open → tick → confirm. Guarded (released / signed records exist):
 * the admin must also type the record's name — that unlocks the forced
 * delete in the database function. No client JS. Field contract (confirm,
 * confirm_name, expectName) is read by the server actions — do not rename.
 */
export default function ConfirmDelete({ action, hidden, label, text, guard, compact }: {
  action: (fd: FormData) => Promise<void>;
  hidden: Record<string, string>;
  label: string;
  text: string;
  /** when set, released/signed records exist: explain and require the typed name */
  guard?: { reason: string; expectName: string; what: string } | null;
  compact?: boolean;
}) {
  return (
    <details style={{ position: "relative" }}>
      <summary className={`${s.btn} ${s.btnDanger} ${compact ? s.btnXs : s.btnSm}`} style={{ listStyle: "none" }}>
        <Trash2 size={13} aria-hidden /> {label}
      </summary>
      <form action={action} style={{ marginTop: 8, padding: "14px 16px", border: "1px solid rgba(226,85,104,.35)", borderRadius: 12, background: "var(--ops-surface, #fff)", display: "grid", gap: 10, width: "min(520px, 90vw)", position: compact ? "absolute" : "static", right: 0, zIndex: 5, boxShadow: compact ? "var(--ops-shadow-md, 0 16px 40px -16px rgba(11,18,32,.35))" : undefined, textAlign: "left", fontSize: 13.5, lineHeight: 1.5, color: "var(--ops-ink-secondary, #35425b)" }}>
        {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
        {guard && <input type="hidden" name="expectName" value={guard.expectName} />}
        <p style={{ color: "#9f2d3a" }}>{text}</p>
        {guard && (
          <>
            <p style={{ color: "#9f2d3a", fontWeight: 600 }}>{guard.reason} Archiving keeps the record. To delete everything anyway, type <b>{guard.expectName}</b> below.</p>
            <input name="confirm_name" placeholder={`Type ${guard.what} to delete anyway`} autoComplete="off" className={s.input} style={{ borderColor: "rgba(226,85,104,.45)", height: 40 }} />
          </>
        )}
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 500 }}><input type="checkbox" name="confirm" required style={{ width: 16, height: 16, accentColor: "#e25568" }} /> I understand this cannot be undone</label>
        <button type="submit" className={`${s.btn} ${s.btnSm}`} style={{ background: "#e25568", color: "#fff", justifySelf: "start", borderColor: "transparent" }}>{label}</button>
      </form>
    </details>
  );
}
