import type { Metadata } from "next";
import Link from "next/link";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, opsDashboard, usd } from "@/lib/estimates/admin";
import OpsShell from "@/components/ops/OpsShell";

/**
 * /ops — operations dashboard (master brief 7.2). Live metrics + pipeline +
 * activity feed, all computed server-side from the database. No number here
 * is client-editable or browser-held.
 */

export const metadata: Metadata = {
  title: "Dashboard · PODOS ops",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const mono: React.CSSProperties = { fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase" };

const PIPELINE = [
  ["draft", "Draft"], ["client_invited", "Invited"], ["viewed", "Viewed"],
  ["client_configuring", "Configuring"], ["client_submitted", "Submitted"],
  ["engineering_review", "Eng. review"], ["approved", "Approved"],
  ["signature_requested", "Signature"], ["client_signed", "Signed"],
] as const;

function labelEvent(e: string) {
  return e.replace(/_/g, " ");
}

export default async function OpsDashboard() {
  await requireOps();
  const d = (await opsDashboard(ADMIN_SECRET)) ?? {};
  const byStatus = (d.by_status ?? {}) as Record<string, number>;
  const activity = (d.recent_activity ?? []) as { at: string; actor: string; event: string; estimate_no: string | null; public_id: string | null }[];

  const cards: [string, string | number][] = [
    ["Active proposals", Number(d.total ?? 0)],
    ["Pipeline value", usd(Number(d.pipeline_high_cents ?? 0))],
    ["Signed", Number(d.signed ?? 0)],
    ["Viewed today", Number(d.viewed_today ?? 0)],
    ["Active invitations", Number(d.active_invitations ?? 0)],
    ["Clients", Number(d.orgs ?? 0)],
    ["Projects", Number(d.projects ?? 0)],
  ];

  return (
    <OpsShell
      active="/ops"
      title="Dashboard"
      actions={
        <>
          <Link href="/ops/proposals" style={{ ...mono, fontSize: 11, padding: ".5rem .8rem", borderRadius: 8, textDecoration: "none", border: "1px solid var(--edge-bright)", color: "var(--ink-dim)" }}>
            All proposals
          </Link>
          <Link href="/ops/clients" style={{ ...mono, fontSize: 11, padding: ".5rem .8rem", borderRadius: 8, textDecoration: "none", background: "var(--brand-gradient)", color: "#fff" }}>
            + New client
          </Link>
        </>
      }
    >
      {/* metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.8rem" }}>
        {cards.map(([label, value]) => (
          <div key={label} style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", padding: "1rem 1.1rem" }}>
            <p style={{ ...mono, fontSize: 9.5, color: "var(--ink-faint)" }}>{label}</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink-strong)", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* pipeline */}
      <section style={{ marginTop: "2rem" }}>
        <p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", marginBottom: ".7rem" }}>Pipeline</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PIPELINE.map(([key, label]) => (
            <div key={key} style={{ flex: "1 1 90px", border: "1px solid var(--edge)", borderRadius: 10, background: "var(--panel)", padding: "0.7rem 0.5rem", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, color: byStatus[key] ? "var(--brand-deep)" : "var(--ink-faint)", fontVariantNumeric: "tabular-nums" }}>
                {byStatus[key] ?? 0}
              </p>
              <p style={{ ...mono, fontSize: 8.5, color: "var(--ink-faint)", marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* activity feed */}
      <section style={{ marginTop: "2rem" }}>
        <p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", marginBottom: ".7rem" }}>Recent activity</p>
        <div style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", overflow: "hidden" }}>
          {activity.length === 0 && (
            <p style={{ padding: "1rem", fontSize: 13, color: "var(--ink-faint)" }}>No activity yet.</p>
          )}
          {activity.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: "0.8rem", alignItems: "baseline", padding: "0.6rem 1rem", borderTop: i === 0 ? "none" : "1px solid var(--edge-faint)", fontSize: 13 }}>
              <span style={{ ...mono, fontSize: 9, color: "var(--ink-faint)", width: 120, flexShrink: 0 }}>
                {new Date(a.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
              <span style={{ color: "var(--ink-strong)", textTransform: "capitalize" }}>{labelEvent(a.event)}</span>
              <span style={{ color: "var(--ink-dim)" }}>{a.actor}</span>
              {a.public_id && (
                <Link href={`/ops/proposals/${a.public_id}`} style={{ ...mono, fontSize: 9.5, color: "var(--brand)", marginLeft: "auto", textDecoration: "none" }}>
                  {a.estimate_no}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </OpsShell>
  );
}
