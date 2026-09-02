import { Trash2 } from "lucide-react";

/**
 * Two-step destructive control shared by the ops lists and detail pages.
 * Plain: open → tick → confirm. Guarded (released / signed records exist):
 * the admin must also type the record's name — that unlocks the forced
 * delete in the database function. No client JS.
 */

const mono: React.CSSProperties = { fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" };

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
      <summary style={{ ...mono, fontSize: compact ? 9 : 9.5, padding: compact ? ".25rem .5rem" : ".35rem .6rem", borderRadius: 8, border: "1px solid rgba(185,28,28,.35)", background: "var(--panel)", color: "#B91C1C", cursor: "pointer", listStyle: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
        <Trash2 size={11} aria-hidden /> {label}
      </summary>
      <form action={action} style={{ marginTop: 8, padding: "0.7rem 0.9rem", border: "1px solid rgba(185,28,28,.35)", borderRadius: 10, background: "#fff", display: "grid", gap: 8, width: "min(520px, 90vw)", position: compact ? "absolute" : "static", right: 0, zIndex: 5, boxShadow: compact ? "0 16px 40px -16px rgba(11,18,32,.35)" : undefined, textAlign: "left" }}>
        {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
        {guard && <input type="hidden" name="expectName" value={guard.expectName} />}
        <p style={{ fontSize: 12.5, color: "#7f1d1d", lineHeight: 1.5 }}>{text}</p>
        {guard && (
          <>
            <p style={{ fontSize: 12.5, color: "#7f1d1d", lineHeight: 1.5, fontWeight: 600 }}>{guard.reason} Archiving keeps the record. To delete everything anyway, type <b>{guard.expectName}</b> below.</p>
            <input name="confirm_name" placeholder={`Type ${guard.what} to delete anyway`} autoComplete="off" style={{ padding: ".45rem .6rem", borderRadius: 8, border: "1px solid rgba(185,28,28,.35)", fontSize: 13, fontFamily: "inherit" }} />
          </>
        )}
        <label style={{ fontSize: 12.5, color: "var(--ink-dim)", display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name="confirm" required /> I understand this cannot be undone</label>
        <button type="submit" style={{ ...mono, padding: ".5rem .8rem", borderRadius: 8, border: "none", background: "#B91C1C", color: "#fff", cursor: "pointer", justifySelf: "start" }}>{label}</button>
      </form>
    </details>
  );
}
