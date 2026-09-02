import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  Activity, Check, CheckCircle2, ChevronDown, Download, Eye, FileCheck2, FilePlus2, Import, Inbox, KeyRound, Layers, ListChecks, Mail, MoreHorizontal, Palette, PenLine, Send,
  Settings2, ShieldCheck, Trash2, Undo2, UserPlus, Wand2, Wrench, DollarSign, History, Link2,
} from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { nowMs } from "@/lib/ops/clock";
import { ADMIN_SECRET, getProposalFull, listCatalog, listContacts, listInvitations } from "@/lib/estimates/admin";
import { resolveDesign } from "@/lib/proposals/design";
import { docFromFull, type ProposalFull as DocFull } from "@/lib/proposals/document";
import { validateProposalForRelease } from "@/lib/proposals/validate";
import { NOT_SUBMITTED, RELEASED } from "@/lib/proposals/render";
import { STEPS, STEP_CATEGORY } from "@/lib/proposals/steps";
import { SITE } from "@/lib/seo/site";
import { AppShell, Chip, EmptyState, Notice, Panel, StatusChip, ago, compact, fmtDate, ops as s, usd } from "@/components/ops/ui";
import { PIPELINE_STAGES, stageKeyFor } from "@/components/ops/ui/status";
import AdminResult from "@/components/ops/AdminResult";
import { dismissInviteReveal, revokeInvitationAction } from "../actions";
import { dismissReleaseReveal, importClientSelections, releaseToClient, reopenForClientAction, sendBackForRevision, setModeAction, toggleSignature } from "./actions";
import LineItemEditor, { type Item, type CatalogOption } from "./LineItemEditor";
import ProposalSettings from "./ProposalSettings";
import DesignPanel from "./DesignPanel";
import InviteDrawer from "./InviteDrawer";
import p from "./proposal.module.css";

/**
 * /ops/proposals/[publicId] — the proposal editor (archetype 4, Editor/Split).
 *
 * Header (title · status · meta · one primary) → status strip (the 8 pipeline
 * stages, current highlighted) → 7/5 split: line-item editor, the client's
 * configuration and notes/revision on the left; totals (featured), release
 * checklist, versions, secure access, settings and document design on the
 * right. One server round-trip (get_proposal_full); every figure is the
 * database's own — money is never derived in the browser.
 */

export const metadata: Metadata = {
  title: "Proposal · PODOS ops",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;
const REVIEWING = new Set(["client_submitted", "engineering_review", "commercial_review"]);
const STAGE_ICON: Record<string, React.ReactNode> = {
  draft: <FilePlus2 size={16} strokeWidth={1.9} />, invited: <UserPlus size={16} strokeWidth={1.9} />, configuring: <Settings2 size={16} strokeWidth={1.9} />,
  submitted: <Inbox size={16} strokeWidth={1.9} />, review: <Wrench size={16} strokeWidth={1.9} />, sent: <Send size={16} strokeWidth={1.9} />,
  signature: <PenLine size={16} strokeWidth={1.9} />, signed: <CheckCircle2 size={16} strokeWidth={1.9} />,
};
const humanize = (e: string) => e.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

interface ProposalFull extends Omit<DocFull, "head" | "line_items"> {
  head: DocFull["head"] & {
    organization_id: string; project_id?: string | null; view_count: number; notes?: string | null; revoked?: boolean;
    mode: "client_configured" | "admin_built";
  };
  line_items: Item[];
  invitations: { invitation_id: string; recipient_email: string; access_policy: string; issued_at: string; expires_at: string; revoked: boolean; exchanged_at: string | null }[];
  viewers: { email: string; total_sessions: number; last_view_at: string | null; first_view_at: string | null }[];
  activity: { at: string; actor: string; event: string; metadata?: { note?: string; sha256?: string } | null }[];
}

export default async function ProposalDetail({ params }: { params: Promise<{ publicId: string }> }) {
  await requireOps();
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();

  const data = (await getProposalFull(ADMIN_SECRET, publicId)) as ProposalFull | null;
  if (!data?.head) notFound();
  const { head, version, line_items, activity } = data;
  const selections = data.selections ?? {};
  const [catalogRaw, allContacts, invitesRaw] = await Promise.all([listCatalog(ADMIN_SECRET), listContacts(ADMIN_SECRET), listInvitations(ADMIN_SECRET, head.estimate_no)]);
  const catalog = catalogRaw ?? [];
  const invites = invitesRaw ?? [];
  const orgContacts = (allContacts ?? []).filter((c) => c.organization_id === head.organization_id && c.email);
  const skuName = new Map(catalog.map((c) => [c.sku ?? "", c.name]));
  // add-from-catalog is keyed by SKU; items saved without one are edited in /ops/pricing first
  const catalogOptions: CatalogOption[] = catalog
    .filter((c): c is typeof c & { sku: string } => !!c.sku)
    .map((c) => ({ sku: c.sku, name: c.name, category: c.category, price_cents: c.price_cents }));

  const clientMode = head.mode === "client_configured";
  const submitted = ["client_submitted", "engineering_review", "commercial_review", "approved"].includes(head.status);
  const released = RELEASED.has(head.status);
  const locked = !!version?.locked_at;
  const chosen = Object.entries(STEP_CATEGORY).flatMap(([step]) => {
    const sku = selections[step]?.sku as string | undefined;
    return sku ? [{ step, label: STEPS.find((x) => x.id === step)?.title ?? step, sku }] : [];
  });
  const stepsSaved = Object.keys(selections).length;
  const stepsTotal = STEPS.length - 1;
  // Client-builds: releasing before the client has built anything locks an empty
  // proposal (that is what happened to PODOS-1002). Require a submission or line items.
  const blocked = clientMode && !submitted && line_items.length === 0;
  const canRevise = !locked && REVIEWING.has(head.status);
  const reopenAllowed = released && !head.signed_at;
  // the same gate releaseToClient applies — shown here so the checklist never lies
  const validation = validateProposalForRelease(docFromFull(data, Object.fromEntries(catalogOptions.map((c) => [c.sku, c.name]))), { mode: head.mode, submitted: !NOT_SUBMITTED.has(head.status) });

  const pendingCount = line_items.filter((i) => i.pending_review).length;
  const optionalCount = line_items.filter((i) => i.optional).length;
  const live = invites.filter((i) => !i.revoked);
  const verified = live.filter((i) => i.exchanged_at).length;
  const sessions = live.reduce((a, i) => a + (Number(i.sessions) || 0), 0);
  const company = head.company ?? head.client_name;
  const title = head.project_name ? `${company} · ${head.project_name}` : company;
  const stageKey = stageKeyFor({ status: head.status, revoked: head.revoked, signed_at: head.signed_at });
  const stageIdx = PIPELINE_STAGES.findIndex((st) => st.key === stageKey);
  const sigOn = head.status === "signature_requested";
  const contactOpts = orgContacts.map((c) => ({ id: c.id, label: `${[c.first_name, c.last_name].filter(Boolean).join(" ") || c.email} · ${c.email}` }));

  const checklist: { label: string; ok: boolean }[] = [
    { label: "Client and project bound", ok: !!head.organization_id && !!(head.project_name || head.project_id) },
    ...(clientMode ? [{ label: "Client submitted the configuration", ok: submitted || released }] : []),
    { label: "At least one line item", ok: line_items.length > 0 },
    { label: pendingCount ? `${pendingCount} item${pendingCount === 1 ? "" : "s"} still pending review` : "No line items pending review", ok: line_items.length > 0 && pendingCount === 0 },
    { label: orgContacts.length ? `${orgContacts.length} contact${orgContacts.length === 1 ? "" : "s"} with an email` : "A contact with an email on the client", ok: orgContacts.length > 0 },
    { label: validation.ok ? "Release gate passes" : `Release gate · ${validation.errors.length} blocker${validation.errors.length === 1 ? "" : "s"}`, ok: validation.ok },
  ];

  const primary = !locked ? (
    <form action={releaseToClient} title={blocked ? "In Client-builds mode the client must build and submit their estimate first (or switch to PODOS builds)." : "Lock this version and send the client their link"}>
      <input type="hidden" name="publicId" value={publicId} />
      <button type="submit" disabled={blocked} className={`${s.btn} ${s.btnPrimary}`}><Send size={16} aria-hidden /> {blocked ? "Release (waiting for client)" : "Release proposal"}</button>
    </form>
  ) : reopenAllowed ? (
    <form action={reopenForClientAction} title="Undo this release so the client can build their estimate (allowed while unsigned)">
      <input type="hidden" name="publicId" value={publicId} />
      <button type="submit" className={`${s.btn} ${s.btnPrimary}`}><Undo2 size={16} aria-hidden /> Reopen for client</button>
    </form>
  ) : null;

  return (
    <AppShell active="/ops/proposals" crumbs={[{ label: "Proposals", href: "/ops/proposals" }, { label: head.estimate_no }]}>
      <header className={s.pageHeader}>
        <div style={{ minWidth: 0 }}>
          <div className={p.titleRow}>
            <h1 className={s.pageTitle}>{title}</h1>
            <StatusChip status={head.status} revoked={head.revoked} signedAt={head.signed_at} />
          </div>
          <p className={p.meta}>
            <b>{head.public_id}</b><span aria-hidden>·</span><span>{head.estimate_no}</span><span aria-hidden>·</span>
            <span>{clientMode ? "Client builds" : "PODOS builds"}</span><span aria-hidden>·</span>
            <span>{head.expires_at ? `valid until ${fmtDate(head.expires_at)}` : "no validity date"}</span><span aria-hidden>·</span>
            <span>rev {version?.rev ?? 1}{locked ? " · locked" : ""}</span><span aria-hidden>·</span>
            <span>viewed {head.view_count}×</span>
          </p>
        </div>
        <div className={s.pageActions}>
          <Link href={`/ops/proposals/${publicId}/preview`} className={`${s.btn} ${s.btnSecondary}`}><Eye size={16} aria-hidden /> Preview as client</Link>
          <a href={`/api/proposal/${publicId}/pdf`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnSecondary}`}><Download size={16} aria-hidden /> PDF</a>
          {version?.pdf_sha256 && (
            <a href={`/api/proposal/${publicId}/pdf/stored`} target="_blank" rel="noopener" title={`Immutable PDF stored at release · sha256 ${version.pdf_sha256}`} className={`${s.btn} ${s.btnSecondary}`}><FileCheck2 size={16} aria-hidden /> Released PDF</a>
          )}
          <details className={p.menu}>
            <summary className={`${s.btn} ${s.btnSecondary} ${p.plain}`} aria-label="More actions" title="More actions"><MoreHorizontal size={18} aria-hidden /></summary>
            <div className={p.menuPop}>
              {released && (
                <form action={toggleSignature}>
                  <input type="hidden" name="publicId" value={publicId} />
                  <input type="hidden" name="enable" value={sigOn ? "0" : "1"} />
                  <button type="submit" className={p.menuItem}><PenLine size={15} aria-hidden /> {sigOn ? "Disable signature" : "Enable signature"}</button>
                </form>
              )}
              {reopenAllowed && !locked && (
                <form action={reopenForClientAction}>
                  <input type="hidden" name="publicId" value={publicId} />
                  <button type="submit" className={p.menuItem}><Undo2 size={15} aria-hidden /> Reopen for client</button>
                </form>
              )}
              {canRevise && <a href="#revision" className={p.menuItem}><Undo2 size={15} aria-hidden /> Send back for revision</a>}
              <form action={setModeAction}>
                <input type="hidden" name="publicId" value={publicId} />
                <button type="submit" name="mode" value={clientMode ? "admin_built" : "client_configured"} disabled={locked} className={p.menuItem} title={locked ? "The version is locked" : undefined}>
                  {clientMode ? <Wand2 size={15} aria-hidden /> : <ListChecks size={15} aria-hidden />} Switch to {clientMode ? "PODOS builds" : "Client builds (menu)"}
                </button>
              </form>
              <div className={p.menuSep} aria-hidden />
              {/* ponytail: anchors scroll to the collapsible panels; the operator opens them there */}
              <a href="#settings" className={p.menuItem}><Settings2 size={15} aria-hidden /> Proposal settings</a>
              <a href="#design" className={p.menuItem}><Palette size={15} aria-hidden /> Document design</a>
            </div>
          </details>
          {primary}
        </div>
      </header>

      {/* status strip — the 8 pipeline stages, current highlighted (replaces the KPI row) */}
      <div className={p.strip} role="list" aria-label="Pipeline stage">
        {PIPELINE_STAGES.map((st, i) => {
          const state = stageIdx < 0 ? "future" : i < stageIdx ? "done" : i === stageIdx ? "current" : "future";
          return (
            <div key={st.key} role="listitem" className={p.node} data-state={state} aria-current={state === "current" ? "step" : undefined}>
              <span className={p.nodeIcon}>{state === "done" ? <Check size={15} strokeWidth={2.5} aria-hidden /> : STAGE_ICON[st.key]}</span>
              <span className={p.nodeLabel}>{st.label}</span>
            </div>
          );
        })}
      </div>

      <AdminResult />
      <ReleaseReveal />

      <div className={s.split75}>
        {/* ---- main (7): editor ---- */}
        <div className={s.stack}>
          <Panel title="Line items" icon={<Layers size={18} aria-hidden />}
            summary={clientMode ? "Imported from the client's configuration — adjust, then release." : "PODOS builds the line items; the range is recomputed server-side on every edit."}
            action={<span className={p.pill}>{line_items.length} item{line_items.length === 1 ? "" : "s"}{pendingCount ? ` · ${pendingCount} pending` : ""}</span>}>
            {clientMode && line_items.length === 0 ? (
              <EmptyState icon={<Import size={22} strokeWidth={1.8} />} title="No line items yet" text="Import the client's configuration once they have saved it, or switch to PODOS builds (⋯ menu) to add the items yourself." />
            ) : (
              <LineItemEditor publicId={publicId} items={line_items} catalog={catalogOptions} locked={locked} />
            )}
          </Panel>

          {clientMode && (
            <Panel title="Client configuration" icon={<ListChecks size={18} aria-hidden />} summary="Live view of the client's workspace — what they have saved in the menu configurator."
              action={<span className={p.pill}>{stepsSaved} / {stepsTotal} steps</span>}>
              <div className={s.progress} style={{ marginBottom: 16 }} aria-hidden><span style={{ width: `${Math.min(100, Math.round((stepsSaved / stepsTotal) * 100))}%` }} /></div>
              {(() => {
                const pr = selections.project ?? {}; const site = selections.site ?? {};
                const facts: [string, unknown][] = [["Pods", pr.pod_quantity], ["Capacity (MW)", pr.required_capacity_mw], ["Workload", pr.workload], ["Go-live", pr.target_golive], ["Site", site.site_name ?? site.address]];
                const shown = facts.filter(([, v]) => v !== undefined && v !== null && v !== "");
                return shown.length > 0 ? (
                  <dl className={p.facts} style={{ marginBottom: 16 }}>
                    {shown.map(([k, v]) => <div key={k} className={p.fact}><dt>{k}</dt><dd>{String(v)}</dd></div>)}
                  </dl>
                ) : null;
              })()}
              {stepsSaved === 0 ? (
                <Notice>
                  <ListChecks size={16} aria-hidden />
                  <div style={{ flex: 1, minWidth: 0 }}><b>Waiting for the client to configure.</b> <span className={s.secondary}>Their selections and live estimate appear here as they save. Invite a contact from Secure access if you have not yet, or switch to PODOS builds to add the line items yourself.</span></div>
                </Notice>
              ) : (
                <div className={p.steps}>
                  {Object.entries(selections).filter(([step]) => step !== "review").map(([step, payload]) => {
                    const stepDef = STEPS.find((x) => x.id === step);
                    const sku = payload.sku as string | undefined;
                    const facts = Object.entries(payload).filter(([k, v]) => k !== "sku" && v !== "" && v != null && !(Array.isArray(v) && v.length === 0));
                    return (
                      <div key={step} className={p.stepCard}>
                        <p className={s.label}>{stepDef?.no ? `${stepDef.no} · ` : ""}{stepDef?.title ?? step}</p>
                        {sku && <p style={{ fontSize: 14.5, fontWeight: 600, marginTop: 4 }}>{skuName.get(sku) ?? sku} <span className={s.mono} style={{ marginLeft: 6 }}>{sku}</span></p>}
                        {facts.length > 0 && (
                          <div className={p.stepFacts}>
                            {facts.map(([k, v]) => <div key={k} className={p.stepFact}><span>{k.replace(/_/g, " ")}</span><span>{Array.isArray(v) ? v.join(", ") : String(v)}</span></div>)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {!locked && chosen.length > 0 && (
                    <Notice tone={submitted ? "ok" : "info"}>
                      <Import size={16} aria-hidden />
                      <div style={{ flex: 1, minWidth: 0 }}>{submitted ? "The client submitted this configuration." : "The client is still configuring."} Import their selections to turn them into line items you can adjust and release.</div>
                      <form action={importClientSelections}>
                        <input type="hidden" name="publicId" value={publicId} />
                        <button type="submit" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}><Import size={14} aria-hidden /> Import as line items</button>
                      </form>
                    </Notice>
                  )}
                </div>
              )}
            </Panel>
          )}

          <Panel title="Notes & revision" icon={<Activity size={18} aria-hidden />} summary="Send a submitted configuration back for changes; the activity trail below is the audit log." tight>
            {canRevise && (
              <form id="revision" action={sendBackForRevision} style={{ display: "grid", gap: 10, marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid var(--ops-border)" }}>
                <input type="hidden" name="publicId" value={publicId} />
                <label className={s.field}>Note to the client (optional)<textarea className={s.input} name="note" rows={2} placeholder="What should they change before resubmitting?" /></label>
                <div><button type="submit" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}><Undo2 size={14} aria-hidden /> Send back for revision</button></div>
              </form>
            )}
            {activity.length === 0 ? <p className={s.muted} style={{ fontSize: 13.5 }}>No activity yet — events appear as the client opens links, configures, comments and signs.</p> : activity.slice(0, 15).map((a, i) => (
              <div key={i} className={s.listRow} style={i === 0 ? { paddingTop: 0 } : undefined}>
                <span style={{ minWidth: 0 }}>
                  <span className={s.timelineText} style={a.event === "client_comment" ? { color: "var(--ops-cobalt-deep)" } : undefined}>{humanize(a.event)}</span>
                  <span className={s.timelineMeta} style={{ display: "block" }}>{a.actor} · {fmtDate(a.at)}</span>
                  {a.metadata?.note && <blockquote className={p.note}>{a.metadata.note}</blockquote>}
                </span>
                <span className={s.timelineTime} title={new Date(a.at).toLocaleString("en-US")}>{ago(a.at)}</span>
              </div>
            ))}
          </Panel>
        </div>

        {/* ---- rail (5) ---- */}
        <aside className={s.stack}>
          <Panel title="Totals" icon={<DollarSign size={18} aria-hidden />} tight className={p.featured} action={<span className={p.pill}>server-computed</span>}>
            <p className={s.label}>One-time</p>
            <p className={p.moneyLg} data-kpi-value>
              {head.one_time_high_cents > 0 ? (head.one_time_low_cents === head.one_time_high_cents ? compact(head.one_time_high_cents) : `${compact(head.one_time_low_cents)} – ${compact(head.one_time_high_cents)}`) : "—"}
            </p>
            <p className={p.moneyExact}>{head.one_time_high_cents > 0 ? (head.one_time_low_cents === head.one_time_high_cents ? usd(head.one_time_high_cents) : `${usd(head.one_time_low_cents)} – ${usd(head.one_time_high_cents)}`) : "no priced line items yet"}</p>
            <dl className={p.facts} style={{ marginTop: 16 }}>
              <div className={p.fact}><dt>Recurring</dt><dd className={s.num}>{head.recurring_cents > 0 ? `${usd(head.recurring_cents)} / yr` : "—"}</dd></div>
              <div className={p.fact}><dt>Line items</dt><dd className={s.num}>{line_items.length}</dd></div>
              <div className={p.fact}><dt>Pending review</dt><dd className={s.num} style={pendingCount ? { color: "#8a5a00" } : undefined}>{pendingCount}</dd></div>
              <div className={p.fact}><dt>Optional alternates</dt><dd className={s.num}>{optionalCount}</dd></div>
            </dl>
          </Panel>

          <Panel title="Release checklist" icon={<CheckCircle2 size={18} aria-hidden />} tight>
            {checklist.map((c) => (
              <div key={c.label} className={p.check} data-ok={c.ok}><span className={p.checkDot}>{c.ok && <Check size={12} strokeWidth={3} aria-hidden />}</span><span>{c.label}</span></div>
            ))}
            {!validation.ok && (
              <div className={p.blockers}>
                {validation.errors.slice(0, 5).map((e, i) => <span key={i}>{e.message}</span>)}
                {validation.errors.length > 5 && <span>+{validation.errors.length - 5} more — open the preview for the full list.</span>}
              </div>
            )}
            {validation.ok && validation.warnings.length > 0 && <p className={s.muted} style={{ fontSize: 12.5, marginTop: 10 }}>{validation.warnings.length} warning{validation.warnings.length === 1 ? "" : "s"} (non-blocking): {validation.warnings.slice(0, 2).map((w) => w.message).join(" ")}</p>}
          </Panel>

          <Panel title="Versions" icon={<History size={18} aria-hidden />} tight>
            {version ? (
              <>
                <div className={s.listRow} style={{ paddingTop: 0 }}>
                  <span style={{ minWidth: 0 }}><span className={s.timelineText}>rev {version.rev} · {locked ? "locked" : "editable draft"}</span><span className={s.timelineMeta} style={{ display: "block" }}>{version.locked_at ? `Locked ${fmtDate(version.locked_at)}` : "Not released yet — line items can still change"}</span></span>
                  <a href={`/api/proposal/${publicId}/pdf`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`}><Download size={13} aria-hidden /> Live PDF</a>
                </div>
                {version.pdf_sha256 && (
                  <div className={s.listRow}>
                    <span style={{ minWidth: 0 }}><span className={s.timelineText}>Released PDF (stored)</span><span className={s.timelineMeta} style={{ display: "block" }}>sha256 {version.pdf_sha256.slice(0, 12)}…{version.pdf_generated_at ? ` · ${fmtDate(version.pdf_generated_at)}` : ""}</span></span>
                    <a href={`/api/proposal/${publicId}/pdf/stored`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`}><FileCheck2 size={13} aria-hidden /> Open</a>
                  </div>
                )}
              </>
            ) : <p className={s.muted} style={{ fontSize: 13.5 }}>No version yet.</p>}
          </Panel>

          <Panel title="Secure access" icon={<ShieldCheck size={18} aria-hidden />} tight
            action={orgContacts.length > 0 ? <InviteDrawer estimateNo={head.estimate_no} publicId={publicId} mode={head.mode} company={head.company ?? ""} project={head.project_name ?? ""} contacts={contactOpts} /> : undefined}>
            {/* summary line → invitation rows; links are buttons, never printed URLs */}
            <details open>
              <summary className={p.accessSummary}>
                <span>{live.length} authorized viewer{live.length === 1 ? "" : "s"} · {verified} verified · {sessions} session{sessions === 1 ? "" : "s"}{invites.length - live.length > 0 ? ` · ${invites.length - live.length} revoked` : ""}</span>
                <ChevronDown size={16} className={p.chev} aria-hidden />
              </summary>
              <div className={p.accessBody}>
                {invites.length === 0 && <p className={s.muted} style={{ fontSize: 13 }}>No client links yet. Issue a personal link — each person gets their own secret link.</p>}
                {invites.map((i) => {
                  const expired = !i.revoked && !i.exchanged_at && new Date(i.expires_at).getTime() < nowMs();
                  const base = i.link_token ? `${SITE.baseUrl}/e/${i.link_token}` : null;
                  return (
                    <div key={i.invitation_id} className={p.accessRow} style={i.revoked ? { opacity: 0.65 } : undefined}>
                      <div className={p.accessTop}>
                        <div style={{ minWidth: 0 }}><b style={{ display: "block", fontWeight: 600, fontSize: 14 }}>{i.recipient_name ?? "Contact"}</b><span className={s.muted} style={{ fontSize: 12.5 }}>{i.recipient_email}</span></div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <Chip tone="gray">{i.access_policy === "otp" ? "One-time code" : "Email confirm"}</Chip>
                          {i.revoked ? <Chip tone="red">Revoked</Chip> : i.exchanged_at ? <Chip tone="green" title={i.last_seen ? `Last seen ${ago(i.last_seen)}` : undefined}>Verified · {i.sessions} session{Number(i.sessions) === 1 ? "" : "s"}</Chip> : expired ? <Chip tone="muted">Expired {fmtDate(i.expires_at)}</Chip> : <Chip tone="gray">Not opened · expires {fmtDate(i.expires_at)}</Chip>}
                        </div>
                      </div>
                      {!i.revoked && (
                        <div className={p.accessActions}>
                          {base && clientMode && <a href={`${base}?to=configure`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`}><Link2 size={13} aria-hidden /> Build estimate</a>}
                          {base && <a href={`${base}?to=proposal`} target="_blank" rel="noopener" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`}><Eye size={13} aria-hidden /> {released ? "View proposal" : "View (after release)"}</a>}
                          {base && <a href={base} target="_blank" rel="noopener" className={`${s.btn} ${s.btnGhost} ${s.btnXs}`}><KeyRound size={13} aria-hidden /> Workspace</a>}
                          <form action={revokeInvitationAction} style={{ marginLeft: "auto" }}>
                            <input type="hidden" name="invitationId" value={i.invitation_id} />
                            <input type="hidden" name="publicId" value={publicId} />
                            <button type="submit" className={`${s.btn} ${s.btnDanger} ${s.btnXs}`}><Trash2 size={12} aria-hidden /> Revoke</button>
                          </form>
                        </div>
                      )}
                      {!i.revoked && !base && <p className={s.muted} style={{ fontSize: 12.5 }}>Link issued before link storage existed — revoke and invite again to get an openable link.</p>}
                    </div>
                  );
                })}
              </div>
            </details>
            {orgContacts.length === 0 && (
              <p className={s.muted} style={{ fontSize: 13, marginTop: 12 }}>Add a contact with an email to <Link href={`/ops/clients/${head.organization_id}`} style={{ color: "var(--ops-cobalt)", fontWeight: 600 }}>{company}</Link> to create a link.</p>
            )}
            <InviteOutcome />
          </Panel>

          <ProposalSettings publicId={publicId} head={head} locked={locked} />
          <DesignPanel publicId={publicId} design={resolveDesign(head.design, head.status)} />
        </aside>
      </div>
    </AppShell>
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
  const done = <form action={dismissReleaseReveal}><button type="submit" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Done</button></form>;
  if (status === "blocked") {
    return (
      <Notice tone="danger">
        <Send size={16} aria-hidden />
        <div style={{ flex: 1, minWidth: 0 }}>
          <b>Release blocked — nothing was locked or sent.</b>
          <p style={{ marginTop: 4, lineHeight: 1.5 }}>{detail}</p>
          <p style={{ marginTop: 4, fontSize: 12.5, opacity: 0.8 }}>Fix the data (or ask the client to correct their configuration), check the preview, then release again.</p>
        </div>
        {done}
      </Notice>
    );
  }
  return (
    <Notice tone={sent ? "ok" : "warn"}>
      <Mail size={16} aria-hidden />
      <div style={{ flex: 1, minWidth: 0 }}>
        <b>Proposal released · {sent ? `email sent to ${detail}` : `email not sent — ${detail}`}</b>
        {token ? (
          <>
            <p style={{ marginTop: 4, fontSize: 13 }}>{sent ? "The client received this secure link. It is also shown here once in case you want to forward it yourself:" : "Send the client this secure link yourself (shown only once):"}</p>
            <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
              <LinkRow label="Build estimate" href={`${SITE.baseUrl}/e/${token}?to=configure`} />
              <LinkRow label="View proposal" href={`${SITE.baseUrl}/e/${token}?to=proposal`} />
              <LinkRow label="Workspace" href={`${SITE.baseUrl}/e/${token}`} />
            </div>
          </>
        ) : (
          <p style={{ marginTop: 4, fontSize: 13 }}>Add a contact with an email to this client, then release again to issue their link.</p>
        )}
      </div>
      {done}
    </Notice>
  );
}

/** One client link with its purpose — selectable text so it can be copied in one click (one-time reveal only). */
function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <div className={p.linkRow}>
      <span className={s.label}>{label}</span>
      <a href={href} target="_blank" rel="noopener" className={p.linkUrl}>{href}</a>
    </div>
  );
}

/** After "New link": whether the invitation email went out, plus the link itself, once (one-shot cookie set by the action). */
async function InviteOutcome() {
  const jar = await cookies();
  const raw = jar.get("podos_new_invite")?.value;
  if (!raw) return null;
  const [, token, status, detail] = raw.split("|");
  const sent = status === "sent";
  return (
    <div style={{ marginTop: 12 }}>
      <Notice tone={sent ? "ok" : "warn"}>
        <KeyRound size={16} aria-hidden />
        <div style={{ flex: 1, minWidth: 0 }}>
          <b>Secure link issued</b> · {sent ? `emailed to ${detail}` : `email not sent (${detail}) — send it yourself`}
          {token && <input readOnly value={`${SITE.baseUrl}/e/${token}`} className={s.input} style={{ marginTop: 8, height: 36, fontSize: 12.5 }} aria-label="Secure link (shown once)" />}
        </div>
        <form action={dismissInviteReveal}><button type="submit" className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}>Done</button></form>
      </Notice>
    </div>
  );
}
