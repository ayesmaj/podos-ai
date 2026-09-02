import { CheckCircle2, XCircle } from "lucide-react";
import { readAdminResult } from "@/lib/ops/result";
import { dismissAdminResult } from "@/app/ops/result-actions";

/** Outcome of the last admin mutation (success or the database's refusal), shown once. */
export default async function AdminResult() {
  const r = await readAdminResult();
  if (!r) return null;
  return (
    <div style={{ marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", border: `1px solid ${r.ok ? "rgba(34,197,94,.45)" : "rgba(185,28,28,.4)"}`, borderRadius: 12, background: r.ok ? "rgba(34,197,94,.07)" : "rgba(185,28,28,.06)", padding: "0.8rem 1.1rem" }}>
      {r.ok ? <CheckCircle2 size={16} color="#15803D" aria-hidden /> : <XCircle size={16} color="#B91C1C" aria-hidden />}
      <p style={{ fontSize: 13.5, color: r.ok ? "#15803D" : "#7f1d1d", flex: 1, minWidth: 200 }}>{r.message}</p>
      <form action={dismissAdminResult}>
        <button type="submit" style={{ fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", padding: ".4rem .7rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", cursor: "pointer" }}>Done</button>
      </form>
    </div>
  );
}
