import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET, getProposalFull, listCatalog, listContacts, listInvitations, usd } from "@/lib/estimates/admin";
import { dismissInviteReveal, inviteContactAction, revokeInvitationAction } from "../actions";
import OpsShell from "@/components/ops/OpsShell";
import LineItemEditor, { type Item, type CatalogOption } from "./LineItemEditor";
import { cookies } from "next/headers";
import { dismissReleaseReveal, importClientSelections, releaseToClient, reopenForClientAction, sendBackForRevision, setModeAction, toggleSignature } from "./actions";
import { Download, Eye, Import, ListChecks, Mail, PenLine, Send, Undo2, Wand2 } from "lucide-react";
import { SITE } from "@/lib/seo/site";
import { STEPS, STEP_CATEGORY } from "@/lib/proposals/steps";

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
    public_id: string; estimate_no: string; organization_id: string; client_name: string; company: string | null;
    project_name: string | null; status: string; view_count: number;
    mode: "client_configured" | "admin_built";
    one_time_low_cents: number; one_time_high_cents: number; recurring_cents: number;
    signed_at: string | null; signer_name: string | null; expires_at: string | null;
  };
  version: { id: string; rev: number; status: string; locked_at: string | null } | null;
  line_items: Item[];
  selections: Record<string, Record<string, unknown>>;
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
  const { head, version, line_items, activity } = data;
  const selections = data.selections ?? {};
  const released = ["released", "signature_requested", "client_signed", "signed", "countersigned", "completed"].includes(head.status);
  const chosen = Object.entries(STEP_CATEGORY).flatMap(([step]) => {
    const sku = selections[step]?.sku as string | undefined;
    return sku ? [{ step, label: STEPS.find((x) => x.id === step)?.title ?? step, sku }] : [];
  });
  const stepsSaved = Object.keys(selections).length;
  const catalog = (await listCatalog(ADMIN_SECRET)) ?? [];
  const [allContacts, invitesWithLinks] = await Promise.all([listContacts(ADMIN_SECRET), listInvitations(ADMIN_SECRET, head.estimate_no)]);
  const orgContacts = (allContacts ?? []).filter((c) => c.organization_id === head.organization_id && c.email);
  const skuName = new Map(catalog.map((c) => [c.sku ?? "", c.name]));
  const clientMode = head.mode === "client_configured";
  const submitted = ["client_submitted", "engineering_review", "commercial_review", "approved"].includes(head.status);
  // add-from-catalog is keyed by SKU; items saved without one are edited in /ops/pricing first
  const catalogOptions: CatalogOption[] = catalog
    .filter((c): c is typeof c & { sku: string } => !!c.sku)
    .map((c) => ({ sku: c.sku, name: c.name, category: c.category, price_cents: c.price_cents }));
  const locked = !!version?.locked_at;

  return (
    <OpsShell
      active="/ops/proposals"
      title={head.company ?? head.client_name}
      actions={
        <>
          <Link href={`/ops/proposals/${publicId}/preview`} style={{ ...mono, fontSize: 11, padding: ".5rem .8rem", borderRadius: 8, textDecoration: "none", border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Eye size={13} aria-hidden /> Preview as client
          </Link>
          <a href={`/api/proposal/${publicId}/pdf`} target="_blank" rel="noopener" style={{ ...mono, fontSize: 11, padding: ".5rem .8rem", borderRadius: 8, textDecoration: "none", border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Download size={13} aria-hidden /> PDF
          </a>
          {!locked && (() => {
            // Client-builds: releasing before the client has built anything locks an empty
            // proposal (that is what happened to PODOS-1002). Require a submission or line items.
            const blocked = clientMode && !submitted && line_items.length === 0;
            return (
              <form action={releaseToClient} title={blocked ? "In Client-builds mode the client must build and submit their estimate first (or switch to PODOS builds)." : "Lock this version and send the client their link"}>
                <input type="hidden" name="publicId" value={publicId} />
                <button type="submit" disabled={blocked} style={{ ...mono, fontSize: 11, padding: ".5rem .9rem", borderRadius: 8, border: "none", background: blocked ? "var(--edge-bright)" : "var(--brand-gradient)", color: blocked ? "var(--ink-faint)" : "#fff", cursor: blocked ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Send size={13} aria-hidden /> {blocked ? "Release (waiting for client)" : "Release proposal"}
                </button>
              </form>
            );
          })()}
          {released && !head.signed_at && (
            <form action={reopenForClientAction} title="Undo this release so the client can build their estimate (allowed while unsigned)">
              <input type="hidden" name="publicId" value={publicId} />
              <button type="submit" style={{ ...mono, fontSize: 11, padding: ".5rem .9rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Undo2 size={13} aria-hidden /> Reopen for client
              </button>
            </form>
          )}
          {released && (
            <form action={toggleSignature}>
              <input type="hidden" name="publicId" value={publicId} />
              <input type="hidden" name="enable" value={head.status === "signature_requested" ? "0" : "1"} />
              <button type="submit" style={{ ...mono, fontSize: 11, padding: ".5rem .9rem", borderRadius: 8, border: "1px solid var(--brand)", background: head.status === "signature_requested" ? "var(--panel)" : "var(--brand-wash)", color: "var(--brand-deep)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <PenLine size={13} aria-hidden /> {head.status === "signature_requested" ? "Disable signature" : "Enable signature"}
              </button>
            </form>
          )}
          <Link href="/ops/proposals" style={{ ...mono, fontSize: 11, color: "var(--ink-faint)", textDecoration: "none" }}>← All proposals</Link>
        </>
      }
    >
      {/* overview bar */}
      <div style={{ display: "flex", gap: "1.4rem", flexWrap: "wrap", alignItems: "baseline", marginBottom: "1.4rem", paddingBottom: "1rem", borderBottom: "1px solid var(--edge)" }}>
        <span style={{ ...mono, fontSize: 11, color: "var(--brand-deep)" }}>{head.estimate_no}</span>
        <span style={{ ...mono, fontSize: 10, color: "var(--ink-faint)" }}>v{version?.rev ?? 1}{locked ? " · locked" : ""}</span>
        <StatusPill status={head.signed_at ? "signed" : head.status} />
        {/* how this proposal is built — the client picks from the menu, or PODOS builds the line items */}
        <form action={setModeAction} style={{ display: "inline-flex", gap: 4, alignItems: "center", border: "1px solid var(--edge)", borderRadius: 999, padding: 2 }}>
          <input type="hidden" name="publicId" value={publicId} />
          {([["client_configured", "Client builds (menu)", <ListChecks key="a" size={12} aria-hidden />], ["admin_built", "PODOS builds", <Wand2 key="b" size={12} aria-hidden />]] as const).map(([m, lbl, icon]) => (
            <button key={m} type="submit" name="mode" value={m} disabled={locked} aria-pressed={head.mode === m}
              style={{ ...mono, fontSize: 9.5, padding: ".3rem .65rem", borderRadius: 999, border: "none", cursor: locked ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: 5,
                background: head.mode === m ? "var(--brand)" : "transparent", color: head.mode === m ? "#fff" : "var(--ink-dim)" }}>
              {icon} {lbl}
            </button>
          ))}
        </form>
        <span style={{ fontSize: 13.5, color: "var(--ink-dim)" }}>{head.project_name ?? "No project name"}</span>
        <span style={{ ...mono, fontSize: 10, color: "var(--ink-faint)", marginLeft: "auto" }}>
          viewed {head.view_count}×
        </span>
      </div>

      <ReleaseReveal />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(280px,1fr)", gap: "1.4rem", alignItems: "start" }}>
        {/* main column — driven by the build mode */}
        <div style={{ display: "grid", gap: "1.2rem" }}>
          {clientMode && (
            <section style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", padding: "1.2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)" }}>Client configuration</p>
                <span style={{ ...mono, fontSize: 9, color: "var(--ink-faint)" }}>{stepsSaved} / {STEPS.length - 1} steps saved · {head.status.replace(/_/g, " ")}</span>
              </div>
              {stepsSaved === 0 ? (
                <div style={{ marginTop: "0.9rem", padding: "1rem 1.1rem", borderRadius: 10, background: "var(--brand-wash)", border: "1px solid rgba(37,99,235,.2)" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-strong)" }}>Waiting for the client to configure.</p>
                  <p style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 4, lineHeight: 1.55 }}>
                    The client builds this proposal from the menu configurator. Invite a contact below if you have not yet — their selections and live estimate will appear here as they save. Switch to <strong>PODOS builds</strong> if you want to add the line items yourself.
                  </p>
                </div>
              ) : (
                <div style={{ marginTop: "0.9rem", display: "grid", gap: "0.9rem" }}>
                  {Object.entries(selections).filter(([step]) => step !== "review").map(([step, payload]) => {
                    const stepDef = STEPS.find((x) => x.id === step);
                    const sku = payload.sku as string | undefined;
                    const facts = Object.entries(payload).filter(([k, v]) => k !== "sku" && v !== "" && v != null && !(Array.isArray(v) && v.length === 0));
                    return (
                      <div key={step} style={{ borderTop: "1px solid var(--edge-faint)", paddingTop: "0.7rem" }}>
                        <p style={{ ...mono, fontSize: 9, color: "var(--brand-deep)" }}>{stepDef?.no} · {stepDef?.title ?? step}</p>
                        {sku && <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-strong)", marginTop: 4 }}>{skuName.get(sku) ?? sku} <span style={{ ...mono, fontSize: 9, color: "var(--ink-faint)", marginLeft: 6 }}>{sku}</span></p>}
                        {facts.length > 0 && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "4px 16px", marginTop: 4 }}>
                            {facts.map(([k, v]) => (
                              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12.5 }}>
                                <span style={{ color: "var(--ink-faint)", textTransform: "capitalize" }}>{k.replace(/_/g, " ")}</span>
                                <span style={{ color: "var(--ink-strong)", textAlign: "right" }}>{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {!locked && chosen.length > 0 && (
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", padding: "0.9rem 1rem", borderRadius: 10, background: submitted ? "rgba(34,197,94,.08)" : "var(--brand-wash)", border: `1px solid ${submitted ? "rgba(34,197,94,.45)" : "rgba(37,99,235,.2)"}` }}>
                      <p style={{ fontSize: 13, color: "var(--ink-strong)", flex: "1 1 240px" }}>
                        {submitted ? "The client submitted this configuration." : "The client is still configuring."} Import their selections to turn them into line items you can adjust and release.
                      </p>
                      <form action={importClientSelections}>
                        <input type="hidden" name="publicId" value={publicId} />
                        <button type="submit" style={{ ...mono, fontSize: 10, padding: ".55rem .9rem", borderRadius: 8, border: "none", background: "var(--brand-gradient)", color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <Import size={13} aria-hidden /> Import selections as line items
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {(!clientMode || line_items.length > 0) && (
            <section style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", padding: "1.2rem" }}>
              <p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", marginBottom: "0.9rem" }}>
                Line items{clientMode ? " · imported from the client's configuration" : ""}
              </p>
              <LineItemEditor publicId={publicId} items={line_items} catalog={catalogOptions} locked={locked} />
            </section>
          )}
        </div>

        {/* right rail */}
        <div style={{ display: "grid", gap: "1.2rem", position: "sticky", top: "1rem" }}>
          {/* ---- client configuration (live view of the client's workspace) ---- */}
          <section style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", padding: "1.1rem 1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)" }}>Client configuration</p>
              <span style={{ ...mono, fontSize: 9, color: "var(--ink-faint)" }}>{stepsSaved} / {STEPS.length - 1} steps saved</span>
            </div>
            <div style={{ height: 5, borderRadius: 999, background: "var(--canvas)", marginTop: 8, overflow: "hidden" }} aria-hidden>
              <div style={{ width: `${Math.min(100, Math.round((stepsSaved / (STEPS.length - 1)) * 100))}%`, height: "100%", background: "linear-gradient(90deg, var(--brand), var(--cyan))" }} />
            </div>
            {(() => {
              const pr = selections.project ?? {}; const site = selections.site ?? {};
              const facts: [string, unknown][] = [["Pods", pr.pod_quantity], ["Capacity (MW)", pr.required_capacity_mw], ["Workload", pr.workload], ["Go-live", pr.target_golive], ["Site", site.site_name ?? site.address]];
              const shown = facts.filter(([, v]) => v !== undefined && v !== null && v !== "");
              return shown.length > 0 ? (
                <div style={{ display: "grid", gap: 4, marginTop: 10 }}>
                  {shown.map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}><span style={{ color: "var(--ink-faint)" }}>{k}</span><span style={{ color: "var(--ink-strong)", fontWeight: 600 }}>{String(v)}</span></div>)}
                </div>
              ) : <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 8 }}>The client has not started configuring yet.</p>;
            })()}
            {chosen.length > 0 && (
              <div style={{ marginTop: 10, display: "grid", gap: 4 }}>
                {chosen.map((c) => <div key={c.step} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}><span style={{ color: "var(--ink-faint)" }}>{c.label}</span><span style={{ ...mono, fontSize: 9.5, color: "var(--brand-deep)" }}>{c.sku}</span></div>)}
              </div>
            )}
            {!locked && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                {head.mode === "client_configured" && chosen.length > 0 && (
                  <form action={importClientSelections}>
                    <input type="hidden" name="publicId" value={publicId} />
                    <button type="submit" style={{ ...mono, fontSize: 9.5, padding: ".45rem .7rem", borderRadius: 8, border: "1px solid var(--brand)", background: "var(--brand-wash)", color: "var(--brand-deep)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Import size={12} aria-hidden /> Import selections as line items
                    </button>
                  </form>
                )}
                {["client_submitted", "engineering_review", "commercial_review"].includes(head.status) && (
                  <form action={sendBackForRevision} style={{ display: "flex", gap: 6 }}>
                    <input type="hidden" name="publicId" value={publicId} />
                    <input name="note" placeholder="Note to client (optional)" style={{ padding: ".4rem .6rem", borderRadius: 8, border: "1px solid var(--edge-bright)", fontSize: 12, fontFamily: "inherit", minWidth: 160 }} />
                    <button type="submit" style={{ ...mono, fontSize: 9.5, padding: ".45rem .7rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Undo2 size={12} aria-hidden /> Request revision
                    </button>
                  </form>
                )}
              </div>
            )}
          </section>

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
            <p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", marginBottom: "0.6rem" }}>Secure access · client links</p>
            {(invitesWithLinks ?? []).length === 0 && (
              <p style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>No client links yet. Invite a contact below — each person gets their own secret link.</p>
            )}
            {(invitesWithLinks ?? []).map((i) => {
              const base = i.link_token ? `${SITE.baseUrl}/e/${i.link_token}` : null;
              return (
                <div key={i.invitation_id} style={{ padding: "0.6rem 0", borderTop: "1px solid var(--edge-faint)" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap", fontSize: 12.5 }}>
                    <span style={{ color: "var(--ink-strong)", fontWeight: 600 }}>{i.recipient_name ? `${i.recipient_name} · ` : ""}{i.recipient_email}</span>
                    <span style={{ ...mono, fontSize: 8.5, color: i.revoked ? "#B91C1C" : i.exchanged_at ? "#15803D" : "var(--ink-faint)" }}>
                      {i.revoked ? "revoked" : i.exchanged_at ? `verified · ${i.sessions} session${Number(i.sessions) === 1 ? "" : "s"}` : `not opened · expires ${new Date(i.expires_at).toLocaleDateString("en-US")}`}
                    </span>
                    {!i.revoked && (
                      <form action={revokeInvitationAction} style={{ display: "inline", marginLeft: "auto" }}>
                        <input type="hidden" name="invitationId" value={i.invitation_id} />
                        <input type="hidden" name="publicId" value={publicId} />
                        <button type="submit" style={{ ...mono, fontSize: 8.5, color: "#B91C1C", background: "none", border: "none", cursor: "pointer" }}>Revoke</button>
                      </form>
                    )}
                  </div>
                  {!i.revoked && (base ? (
                    <div style={{ display: "grid", gap: 4, marginTop: 6 }}>
                      {clientMode && <LinkRow label="Build estimate" href={`${base}?to=configure`} />}
                      <LinkRow label={released ? "View proposal" : "View (after release)"} href={`${base}?to=proposal`} />
                      <LinkRow label="Workspace" href={base} />
                    </div>
                  ) : (
                    <p style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: 4 }}>Link issued before link storage existed — revoke and invite again to get a visible link.</p>
                  ))}
                </div>
              );
            })}
            {orgContacts.length === 0 ? (
              <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 8 }}>Add a contact with an email to <Link href={`/ops/clients/${head.organization_id}`} style={{ color: "var(--brand)" }}>this client</Link> to create a link.</p>
            ) : (
              <form action={inviteContactAction} style={{ display: "grid", gap: 6, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--edge)" }}>
                <input type="hidden" name="estimateNo" value={head.estimate_no} />
                <input type="hidden" name="publicId" value={publicId} />
                <input type="hidden" name="mode" value={head.mode} />
                <input type="hidden" name="company" value={head.company ?? ""} />
                <input type="hidden" name="project" value={head.project_name ?? ""} />
                <select name="contactId" required defaultValue="" style={{ padding: "0.45rem 0.6rem", borderRadius: 8, border: "1px solid var(--edge-bright)", fontSize: 12.5, fontFamily: "inherit" }}>
                  <option value="" disabled>Choose a contact…</option>
                  {orgContacts.map((c) => <option key={c.id} value={c.id}>{[c.first_name, c.last_name].filter(Boolean).join(" ") || c.email} · {c.email}</option>)}
                </select>
                <div style={{ display: "flex", gap: 6 }}>
                  <select name="policy" defaultValue="email-confirm" style={{ padding: "0.45rem 0.6rem", borderRadius: 8, border: "1px solid var(--edge-bright)", fontSize: 12.5, fontFamily: "inherit", flex: 1 }}>
                    <option value="email-confirm">Email confirm</option><option value="otp">Email OTP</option>
                  </select>
                  <button type="submit" style={{ ...mono, fontSize: 9.5, padding: ".5rem .8rem", borderRadius: 8, border: "1px solid var(--brand)", background: "var(--brand-wash)", color: "var(--brand-deep)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Send size={12} aria-hidden /> New link
                  </button>
                </div>
              </form>
            )}
            <InviteOutcome />
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

/**
 * After "Release proposal": what happened next. Shows whether the client was
 * emailed and reveals the fresh secure link ONCE (HttpOnly cookie, read
 * server-side) so the admin can send it by hand when no email provider is
 * configured or the send failed.
 */
async function ReleaseReveal() {
  const jar = await cookies();
  const raw = jar.get("podos_release")?.value;
  if (!raw) return null;
  const [token, status, detail] = raw.split("|");
  const sent = status === "sent";
  return (
    <div style={{ marginBottom: "1.2rem", border: `1px solid ${sent ? "rgba(34,197,94,.45)" : "rgba(180,83,9,.4)"}`, borderRadius: 12, background: sent ? "rgba(34,197,94,.07)" : "rgba(180,83,9,.06)", padding: "1rem 1.2rem" }}>
      <p style={{ ...mono, fontSize: 10, color: sent ? "#15803D" : "#B45309", display: "flex", alignItems: "center", gap: 6 }}>
        <Mail size={13} aria-hidden /> Proposal released · {sent ? `email sent to ${detail}` : `email NOT sent — ${detail}`}
      </p>
      {token ? (
        <>
          <p style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 6 }}>
            {sent ? "The client received this secure link. It is also shown here once in case you want to forward it yourself:" : "Send the client this secure link yourself (shown only once):"}
          </p>
          <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
            <LinkRow label="Build estimate" href={`${SITE.baseUrl}/e/${token}?to=configure`} />
            <LinkRow label="View proposal" href={`${SITE.baseUrl}/e/${token}?to=proposal`} />
            <LinkRow label="Workspace" href={`${SITE.baseUrl}/e/${token}`} />
          </div>
        </>
      ) : (
        <p style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 6 }}>Add a contact with an email to this client, then release again to issue their link.</p>
      )}
      <form action={dismissReleaseReveal}>
        <button type="submit" style={{ ...mono, marginTop: 8, fontSize: 9.5, padding: ".4rem .7rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", cursor: "pointer" }}>Done</button>
      </form>
    </div>
  );
}

/** One client link with its purpose — selectable text so it can be copied in one click. */
function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 8, alignItems: "baseline" }}>
      <span style={{ ...mono, fontSize: 8.5, color: "var(--brand-deep)" }}>{label}</span>
      <a href={href} target="_blank" rel="noopener" style={{ fontSize: 11.5, color: "var(--ink-dim)", wordBreak: "break-all", textDecoration: "none", borderBottom: "1px dotted var(--edge-bright)" }}>{href}</a>
    </div>
  );
}

/** After "New link": whether the invitation email went out (one-shot cookie set by the action). */
async function InviteOutcome() {
  const jar = await cookies();
  const raw = jar.get("podos_new_invite")?.value;
  if (!raw) return null;
  const [, , status, detail] = raw.split("|");
  const sent = status === "sent";
  return (
    <div style={{ marginTop: 10, padding: "0.6rem 0.8rem", borderRadius: 8, fontSize: 12, border: `1px solid ${sent ? "rgba(34,197,94,.45)" : "rgba(180,83,9,.4)"}`, background: sent ? "rgba(34,197,94,.07)" : "rgba(180,83,9,.06)", color: sent ? "#15803D" : "#B45309" }}>
      {sent ? `Link created and emailed to ${detail}.` : `Link created — email NOT sent (${detail}). Copy the link above and send it yourself.`}
      <form action={dismissInviteReveal} style={{ display: "inline", marginLeft: 8 }}>
        <button type="submit" style={{ ...mono, fontSize: 8.5, background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)" }}>dismiss</button>
      </form>
    </div>
  );
}
