import "./estimate-sheet.css";
import type { ReactNode } from "react";
import { Check, CheckCircle2, Globe, Mail, PenLine, Phone, ShieldCheck } from "lucide-react";
import type { DocData, DocLine } from "@/lib/proposals/types";
import type { PageMode, ProposalDesign } from "@/lib/proposals/design";
import { CATEGORY_ORDER, categoryLabel } from "@/lib/proposals/categories";
import { usd } from "@/lib/proposals/money";
import { STATIC_ASSETS, type PrintAssets } from "@/lib/proposals/assets";
import { PREVIEW_MASK, displayName } from "@/lib/proposals/validate";
import { DEFAULT_COMPANY, type CompanySettings } from "@/lib/proposals/settings";

/**
 * EstimateSheet — the ONE PODOS estimate / proposal document. A single
 * flowing sheet (classic estimate anatomy: header band, status banner,
 * parties, project, itemized table + total summary, optional add-ons,
 * notes / warranty / signature, trust band) rendered identically on the web
 * and in the Letter PDF. Server component.
 *
 * Optional line items are add-ons: they count toward the totals only while
 * `selected` (the same rule the DB's _recompute_totals applies). On the web
 * the client toggles them through `renderAddonToggle`; in print the state is
 * shown as a checked / unchecked box.
 */

export interface EstimateSheetProps {
  d: DocData;
  pageMode: PageMode;
  design: ProposalDesign;
  hash: string;
  assets?: Partial<PrintAssets>;
  /** company identity + standard texts from /ops/settings (defaults when absent) */
  company?: CompanySettings;
  previewNotice?: string | null;
  /** web-only interactive block (accept & sign, request change) rendered under the totals */
  actions?: ReactNode;
  /** web-only: wraps each optional add-on row in its toggle control */
  renderAddonToggle?: (line: DocLine, row: ReactNode) => ReactNode;
}

const nf = new Intl.NumberFormat("en-US");
const fmtDate = (v: string | Date | null | undefined) => {
  if (!v) return "—";
  const t = new Date(v);
  if (Number.isNaN(t.getTime())) return "—";
  const dateOnly = typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", ...(dateOnly ? { timeZone: "UTC" } : {}) }).format(t);
};
const addDays = (v: string, days: number) => new Date(new Date(v).getTime() + days * 86_400_000);
const real = (v: string | null | undefined): v is string => !!v && v !== PREVIEW_MASK;
const fmtMw = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
export const isCounted = (l: DocLine) => !l.optional || l.selected !== false;

function validUntil(d: DocData, design: ProposalDesign, defaultDays = 30) {
  if (design.validity_days) return addDays(d.issued, design.validity_days);
  return d.expires ?? addDays(d.issued, defaultDays);
}
function podCount(d: DocData): number | null {
  if (d.spec.pods != null) return d.spec.pods;
  const n = d.lineItems.filter((l) => l.category_slug === "platform" && isCounted(l) && !l.recurring).reduce((a, l) => a + l.qty, 0);
  return n > 0 ? n : null;
}
/** "a • b • c" or multi-line descriptions become bullets; single sentences stay a paragraph */
function descriptionParts(v: string | null | undefined): string[] {
  if (!v) return [];
  return v.split(/\n|(?:^|\s)[•*-]\s+/).map((s) => s.trim()).filter(Boolean);
}
function Description({ text }: { text: string | null | undefined }) {
  const parts = descriptionParts(text);
  if (parts.length > 1) return <ul className="ds">{parts.map((p) => <li key={p}>{p}</li>)}</ul>;
  if (parts.length === 1) return <div className="ds">{parts[0]}</div>;
  return null;
}

type Row = { kind: "group"; label: string } | { kind: "item"; n: number; line: DocLine };
function buildRows(lines: DocLine[]): Row[] {
  const rows: Row[] = []; let n = 0;
  for (const cat of CATEGORY_ORDER) {
    const group = lines.filter((l) => !l.recurring && (l.category_slug ?? "custom") === cat);
    if (!group.length) continue;
    rows.push({ kind: "group", label: categoryLabel(cat) });
    for (const line of group) rows.push({ kind: "item", n: ++n, line });
  }
  const rec = lines.filter((l) => l.recurring);
  if (rec.length) { rows.push({ kind: "group", label: "Recurring services (per year)" }); for (const line of rec) rows.push({ kind: "item", n: ++n, line }); }
  return rows;
}

const SIGNED = new Set(["client_signed", "signed", "countersigned", "completed"]);

export default function EstimateSheet({ d, pageMode, design, hash, assets: partial, company = DEFAULT_COMPANY, previewNotice = null, actions, renderAddonToggle }: EstimateSheetProps) {
  const assets: PrintAssets = { ...STATIC_ASSETS, ...partial };
  const companyName = displayName(d.company);
  const client = displayName(d.clientName);
  const project = real(d.project) ? displayName(d.project) : d.project ?? null;
  const pods = podCount(d);
  const counted = d.lineItems.filter(isCounted);
  const addons = d.lineItems.filter((l) => l.optional);
  const rows = buildRows(counted);
  const subtotal = counted.filter((l) => !l.recurring).reduce((a, l) => a + l.extended_cents, 0);
  const isRange = d.lowCents !== d.highCents;
  const total = d.lowCents > 0 ? d.lowCents : subtotal;
  const wm = previewNotice ? "Design preview" : design.watermark === "none" ? null : design.watermark;
  const title = pageMode === "formal" ? "Proposal" : "Estimate";
  const supportItems = counted.filter((l) => l.category_slug === "support").map((l) => l.name);
  const signed = SIGNED.has(d.status) && d.signedAt;
  const until = validUntil(d, design, company.default_validity_days);

  return (
    <article className="es-sheet" aria-label={`${title} ${d.publicId}`}>
      {wm && <div className="es-wm" aria-hidden="true"><span>{wm}</span></div>}

      <header className="es-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assets.logoOnDark} alt="PODOS AI" />
        <div className="es-head-right">
          <div className="es-doc-title">{title}</div>
          <dl className="es-meta">
            <dt>{title} No</dt><dd className="es-num">{d.publicId}</dd>
            <dt>Date</dt><dd>{fmtDate(d.issued)}</dd>
            <dt>Valid until</dt><dd>{fmtDate(until)}</dd>
          </dl>
        </div>
      </header>

      {signed ? (
        <p className="es-banner ok"><CheckCircle2 size={15} aria-hidden /> Accepted &amp; signed by {displayName(d.signerName)} on {fmtDate(d.signedAt)}{d.status === "countersigned" || d.status === "completed" ? " · countersigned by PODOS" : ""}</p>
      ) : d.status === "signature_requested" ? (
        <p className="es-banner info web-only"><PenLine size={15} aria-hidden /> Ready for your signature — review the items below, then Accept &amp; Sign</p>
      ) : d.status === "revision_requested" ? (
        <p className="es-banner warn">Changes requested — PODOS will issue a revised version</p>
      ) : null}
      {previewNotice && <p className="es-notice">{previewNotice}</p>}

      <div className="es-body">
        <section className="es-parties">
          <div>
            <p className="es-party-name">{company.name}</p>
            <ul className="es-lines">
              {company.address_lines.map((l) => <li key={l} style={{ paddingLeft: 22 }}>{l}</li>)}
              <li><Globe size={14} strokeWidth={2} aria-hidden /> {company.website}</li>
              <li><Mail size={14} strokeWidth={2} aria-hidden /> {company.email}</li>
              <li><Phone size={14} strokeWidth={2} aria-hidden /> {company.phone}</li>
            </ul>
          </div>
          <div>
            <span className="es-label">Prepared for</span>
            <div className="es-prepared">
              <b>{client || companyName || "—"}</b>
              {companyName && companyName !== client && <span>{companyName}</span>}
              {d.contactEmail && <span>{d.contactEmail}</span>}
              {project && <span>Project: {project}</span>}
            </div>
            <p className="es-rev">Revision {d.rev}</p>
          </div>
        </section>

        <section className="es-project">
          <div>
            <span className="es-label">Project / system</span>
            <h1>{project ?? "PODOS modular AI infrastructure"}</h1>
            {design.sections.summary && (
              <>
                <p className="es-summary">
                  {pods ? `${pods} PODOS modular AI infrastructure unit${pods === 1 ? "" : "s"}` : "PODOS modular AI infrastructure"}
                  {d.spec.capacity_mw ? `, ${fmtMw(d.spec.capacity_mw)} MW design capacity` : ""}
                  {d.spec.gpus ? `, ${nf.format(d.spec.gpus)} accelerator positions` : ""}
                  {real(d.spec.site) ? `, for ${d.spec.site}` : ""}. Factory-integrated, delivered and commissioned as one system.
                </p>
                <div className="es-specs">
                  {pods != null && <span><b>{nf.format(pods)}</b> pod{pods === 1 ? "" : "s"}</span>}
                  {d.spec.capacity_mw ? <span><b>{fmtMw(d.spec.capacity_mw)} MW</b> critical IT</span> : null}
                  {d.spec.gpus ? <span><b>{nf.format(d.spec.gpus)}</b> GPU positions</span> : null}
                  {d.spec.workload && real(d.spec.workload) ? <span><b>{d.spec.workload}</b> workload</span> : null}
                  {d.spec.golive ? <span>target go-live <b>{fmtDate(d.spec.golive)}</b></span> : null}
                </div>
              </>
            )}
          </div>
          {design.visuals.product && assets.cover && (
            <figure className="es-product">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assets.cover} alt="PODOS modular unit" />
              <figcaption>Proposed system</figcaption>
            </figure>
          )}
        </section>

        <section className="es-main">
          <div className="es-table-wrap">
            <table className="es-table">
              <thead><tr><th>Item</th><th>Description</th><th className="r">Qty</th><th className="r">Unit price</th><th className="r">Total</th></tr></thead>
              <tbody>
                {rows.length === 0 && <tr><td colSpan={5} className="ds" style={{ padding: 18 }}>No items yet — pricing follows the engineering review.</td></tr>}
                {rows.map((r, i) => r.kind === "group"
                  ? <tr className="group" key={`g${i}`}><td colSpan={5}>{r.label}</td></tr>
                  : (
                    <tr key={`i${i}`}>
                      <td className="n es-num">{r.n}</td>
                      <td className="d">
                        <span className="nm">{r.line.name}</span>
                        {r.line.optional && <span className="tag">Add-on</span>}
                        {r.line.recurring && <span className="tag">Per year</span>}
                        <Description text={r.line.customer_description} />
                      </td>
                      <td className="r qty es-num" data-price={r.line.unit_price_cents > 0 ? usd(r.line.unit_price_cents) : "pending"}>{nf.format(r.line.qty)}<span className="u">{(r.line.unit ?? "EA").toUpperCase()}</span></td>
                      <td className="r pr es-num">{r.line.unit_price_cents > 0 ? usd(r.line.unit_price_cents) : "Pending"}</td>
                      <td className="r tot es-num">{r.line.unit_price_cents > 0 ? usd(r.line.extended_cents) : "—"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <aside className="es-sum">
            <div className="es-sum-head">Total summary</div>
            <div className="es-sum-row"><span>Subtotal</span><b className="es-num">{usd(subtotal)}</b></div>
            {isRange && <div className="es-sum-row"><span>Engineering range</span><b className="es-num">{usd(d.lowCents)} – {usd(d.highCents)}</b></div>}
            <div className="es-sum-total">
              <span className="k">{isRange ? "Total from" : "Total"}</span>
              <span className="v es-num">{usd(total)}</span>
              {isRange && <span className="v2 es-num">up to {usd(d.highCents)} after engineering review</span>}
            </div>
            {d.recurringCents > 0 && <div className="es-sum-row"><span>Recurring services</span><b className="es-num">{usd(d.recurringCents)} / yr</b></div>}
            <div className="es-sum-row"><span>Valid until</span><b>{fmtDate(until)}</b></div>
            <p className="es-sum-note">USD, excluding taxes and duties. {pageMode === "formal" ? "Final pricing confirmed at order after the engineering review." : "Indicative until PODOS releases the formal proposal."}</p>
          </aside>
        </section>

        {addons.length > 0 && (
          <section className="es-addons">
            <span className="es-label">Optional add-ons</span>
            <p className="es-addons-help">{renderAddonToggle ? "Tick any you would like — the totals above update." : "Selected add-ons are included in the totals above."}</p>
            {addons.map((l) => {
              const on = l.selected !== false;
              const row = (
                <div className={`es-addon${on ? " on" : ""}`} key={l.id ?? l.name}>
                  <span className="box" aria-hidden>{on && <Check size={13} strokeWidth={3} />}</span>
                  <div><span className="nm">{l.name}</span>{l.recurring && <span className="tag">Per year</span>}<Description text={l.customer_description} /></div>
                  <span className="pr es-num">{l.unit_price_cents > 0 ? `+ ${usd(l.extended_cents)}${l.recurring ? " / yr" : ""}` : "Pending"}</span>
                </div>
              );
              return renderAddonToggle ? <div key={l.id ?? l.name}>{renderAddonToggle(l, row)}</div> : row;
            })}
          </section>
        )}

        {actions && <section className="es-actions web-only" id="accept">{actions}</section>}

        <section className="es-terms">
          {design.sections.notes ? (
            <div>
              <span className="es-label">Notes</span>
              <ul className="es-bullets">{company.notes.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
          ) : <div />}
          {design.sections.warranty ? (
            <div>
              <span className="es-label">Warranty &amp; support</span>
              <div className="es-warranty">
                <ShieldCheck size={18} strokeWidth={2} aria-hidden />
                <p>{supportItems.length ? <>Covered by <b>{supportItems.join(", ")}</b> as itemized above.</> : company.warranty}</p>
              </div>
            </div>
          ) : <div />}
          {design.signature_block ? (
            <div className="es-sign">
              <div className="line">{d.signedAt && d.signerName && <span>{displayName(d.signerName)}</span>}</div>
              <div className="cap"><b>Client signature</b><span>{d.signedAt ? fmtDate(d.signedAt) : "Date"}</span></div>
            </div>
          ) : <div />}
        </section>
      </div>

      {design.sections.trust_band && (
        <section className="es-trust">
          {company.trust.map((t) => <div key={t.title}><CheckCircle2 size={20} strokeWidth={2} aria-hidden /><div><b>{t.title}</b><span>{t.subtitle}</span></div></div>)}
        </section>
      )}
      <footer className="es-foot">{company.name} · Revision {d.rev} · Prepared specifically for {client || companyName} · <span className="es-num">{d.publicId} · {hash}</span></footer>
    </article>
  );
}
