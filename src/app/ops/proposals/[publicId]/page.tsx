import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, getProposalFull, listCatalog, usd } from "@/lib/estimates/admin";
import OpsShell from "@/components/ops/OpsShell";
import LineItemEditor, { type Item, type CatalogOption } from "./LineItemEditor";

/**
 * /ops/proposals/[publicId] — proposal detail (master brief 7.5 + 8).
 *
 * Left: overview + the categorized line-item editor. Right (sticky): totals,
 * secure access (per-viewer invitation/last-seen), and the activity feed.
 * Everything is one server round-trip (get_proposal_full). Money on the right
 * is the DB's own recomputed value, never derived in the browser.
 */

export const metadata: Metadata = {
  title: "Proposal · PODOS ops",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const mono: React.CSSProperties = { fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase" };
const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;

interface ProposalFull {
  head: {
    public_id: string; estimate_no: string; client_name: string; company: string | null;
    project_name: string | null; status: string; view_count: number;
    one_time_low_cents: number; one_time_high_cents: number; recurring_cents: number;
    signed_at: string | null; signer_name: string | null; expires_at: string | null;
  };
  version: { id: string; rev: number; status: string; locked_at: string | null } | null;
  line_items: Item[];
  invitations: { invitation_id: string; recipient_email: string; access_policy: string; issued_at: string; expires_at: string; revoked: boolean; exchanged_at: string | null }[];
  viewers: { email: string; total_sessions: number; last_view_at: string | null; first_view_at: string | null }[];
  activity: { at: string; actor: string; event: string }[];
}

export default async function ProposalDetail({ params }: { params: Promise<{ publicId: string }> }) {
  await requireOps();
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();

  const data = (await getProposalFull(ADMIN_SECRET, publicId)) as ProposalFull | null;
  if (!data?.head) notFound();
  const { head, version, line_items, invitations, viewers, activity } = data;
  const catalog = (await listCatalog(ADMIN_SECRET)) ?? [];
  const catalogOptions: CatalogOption[] = catalog.map((c) => ({ sku: c.sku, name: c.name, category: c.category, price_cents: c.price_cents }));
  const locked = !!version?.locked_at;

  return (
    <OpsShell
      active="/ops/proposals"
      title={head.company ?? head.client_name}
      actions={
        <>
          <a href={`/api/proposal/${publicId}/pdf`} target="_blank" rel="noopener" style={{ ...mono, fontSize: 11, padding: ".5rem .8rem", borderRadius: 8, textDecoration: "none", border: "1px solid var(--brand)", background: "var(--brand-wash)", color: "var(--brand-deep)" }}>
            Preview PDF
          </a>
          <Link href="/ops/proposals" style={{ ...mono, fontSize: 11, color: "var(--ink-faint)", textDecoration: "none" }}>← All proposals</Link>
        </>
      }
    >
      {/* overview bar */}
      <div style={{ display: "flex", gap: "1.4rem", flexWrap: "wrap", alignItems: "baseline", marginBottom: "1.4rem", paddingBottom: "1rem", borderBottom: "1px solid var(--edge)" }}>
        <span style={{ ...mono, fontSize: 11, color: "var(--brand-deep)" }}>{head.estimate_no}</span>
        <span style={{ ...mono, fontSize: 10, color: "var(--ink-faint)" }}>v{version?.rev ?? 1}{locked ? " · locked" : ""}</span>
        <StatusPill status={head.signed_at ? "signed" : head.status} />
        <span style={{ fontSize: 13.5, color: "var(--ink-dim)" }}>{head.project_name ?? "No project name"}</span>
        <span style={{ ...mono, fontSize: 10, color: "var(--ink-faint)", marginLeft: "auto" }}>
          viewed {head.view_count}×
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(280px,1fr)", gap: "1.4rem", alignItems: "start" }}>
        {/* editor */}
        <section style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", padding: "1.2rem" }}>
          <p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", marginBottom: "0.9rem" }}>Line items</p>
          <LineItemEditor publicId={publicId} items={line_items} catalog={catalogOptions} locked={locked} />
        </section>

        {/* right rail */}
        <div style={{ display: "grid", gap: "1.2rem", position: "sticky", top: "1rem" }}>
          <section style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", padding: "1.1rem 1.2rem" }}>
            <p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)" }}>Preliminary total</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink-strong)", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
              {usd(head.one_time_low_cents)} – {usd(head.one_time_high_cents)}
            </p>
            {head.recurring_cents > 0 && (
              <p style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 3 }}>+ {usd(head.recurring_cents)} / year</p>
            )}
            <p style={{ ...mono, fontSize: 8.5, color: "var(--ink-faint)", marginTop: "0.6rem", lineHeight: 1.6 }}>
              Range auto-recomputed server-side as you edit line items.
            </p>
          </section>

          <section style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", padding: "1.1rem 1.2rem" }}>
            <p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", marginBottom: "0.6rem" }}>Secure access</p>
            {invitations.length === 0 && viewers.length === 0 ? (
              <p style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>No invitations yet — create one from the proposals list.</p>
            ) : (
              <>
                {invitations.map((i) => (
                  <div key={i.invitation_id} style={{ fontSize: 12.5, padding: "0.3rem 0", borderTop: "1px solid var(--edge-faint)" }}>
                    <span style={{ color: "var(--ink-strong)" }}>{i.recipient_email}</span>
                    <span style={{ ...mono, fontSize: 8.5, color: i.revoked ? "#B91C1C" : "var(--ink-faint)", marginLeft: 6 }}>
                      {i.revoked ? "revoked" : i.exchanged_at ? "verified" : "not opened"}
                    </span>
                  </div>
                ))}
                {viewers.map((v) => (
                  <div key={v.email} style={{ fontSize: 12, color: "var(--ink-faint)", padding: "0.2rem 0" }}>
                    {v.email} · {v.total_sessions} session{v.total_sessions === 1 ? "" : "s"}
                    {v.last_view_at && ` · last ${new Date(v.last_view_at).toLocaleDateString("en-US")}`}
                  </div>
                ))}
              </>
            )}
          </section>

          <section style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", padding: "1.1rem 1.2rem" }}>
            <p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", marginBottom: "0.6rem" }}>Activity</p>
            {activity.length === 0 ? (
              <p style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>No activity yet.</p>
            ) : activity.slice(0, 15).map((a, i) => (
              <div key={i} style={{ fontSize: 12, padding: "0.25rem 0", borderTop: i === 0 ? "none" : "1px solid var(--edge-faint)" }}>
                <span style={{ color: "var(--ink-strong)", textTransform: "capitalize" }}>{a.event.replace(/_/g, " ")}</span>
                <span style={{ ...mono, fontSize: 8, color: "var(--ink-faint)", marginLeft: 6 }}>
                  {new Date(a.at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </OpsShell>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone = status === "signed" || status === "client_signed"
    ? { c: "#15803D", b: "rgba(34,197,94,.45)", bg: "rgba(34,197,94,.08)" }
    : status === "viewed"
      ? { c: "var(--cyan-deep)", b: "rgba(34,211,238,.45)", bg: "rgba(34,211,238,.08)" }
      : { c: "var(--ink-dim)", b: "var(--edge-bright)", bg: "var(--glass-bg-strong)" };
  return (
    <span style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", padding: ".22rem .55rem", borderRadius: 999, color: tone.c, border: `1px solid ${tone.b}`, background: tone.bg }}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
