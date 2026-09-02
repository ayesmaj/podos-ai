import "./proposal-print.css";
import { Boxes, Cpu, Network, Snowflake, Truck, Zap } from "lucide-react";
import type { DocData, DocLine } from "@/lib/proposals/types";
import type { PageMode, ProposalDesign } from "@/lib/proposals/design";
import { CATEGORY_ORDER, categoryLabel } from "@/lib/proposals/categories";
import { STEP_CATEGORY } from "@/lib/proposals/steps";
import { compactUsd, usd } from "@/lib/proposals/money";
import { STATIC_ASSETS as DEFAULT_ASSETS, type PrintAssets } from "@/lib/proposals/assets";
import { PREVIEW_MASK, displayName } from "@/lib/proposals/validate";

/**
 * ProposalPrint — the paginated proposal document. ONE design for every PDF
 * the platform produces: preliminary estimate (≤ 2 pages) and formal
 * commercial proposal (3 pages + appendix only when line items overflow).
 * Server component; plain <img> because headless Chrome prints this DOM.
 */

export interface ProposalPrintProps {
  d: DocData;
  pageMode: PageMode;
  design: ProposalDesign;
  /** short fingerprint printed in the footer */
  hash: string;
  /** design-preview banner + watermark; null for real documents */
  previewNotice?: string | null;
  assets?: Partial<PrintAssets>;
  /** wrap pages in the on-screen frame (false when printing) */
  screen?: boolean;
}

/* ---------- helpers ---------- */
const nf = new Intl.NumberFormat("en-US");
const fmtDate = (v: string | Date | null | undefined) => {
  if (!v) return "—";
  const t = new Date(v);
  if (Number.isNaN(t.getTime())) return "—";
  // a bare YYYY-MM-DD parses as UTC midnight; format it in UTC so the day never shifts
  const dateOnly = typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", ...(dateOnly ? { timeZone: "UTC" } : {}) }).format(t);
};
const addDays = (v: string, days: number) => new Date(new Date(v).getTime() + days * 86_400_000);
const real = (v: string | null | undefined): v is string => !!v && v !== PREVIEW_MASK;
const fmtMw = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
const proj = (d: DocData) => (real(d.project) ? displayName(d.project) : null);

function validUntil(d: DocData, design: ProposalDesign): Date | string | null {
  if (design.validity_days) return addDays(d.issued, design.validity_days);
  return d.expires ?? addDays(d.issued, 30);
}

function podCount(d: DocData): number | null {
  if (d.spec.pods != null) return d.spec.pods;
  const n = d.lineItems.filter((l) => l.category_slug === "platform" && !l.optional && !l.recurring).reduce((a, l) => a + l.qty, 0);
  return n > 0 ? n : null;
}

function summary(d: DocData, mode: PageMode): string {
  const company = real(d.company) ? displayName(d.company) : "Your organization";
  const pods = podCount(d);
  const p = proj(d);
  const parts: string[] = [];
  parts.push(`${company} is ${mode === "formal" ? "acquiring" : "evaluating"} ${pods ? `${pods} PODOS modular AI infrastructure unit${pods === 1 ? "" : "s"}` : "PODOS modular AI infrastructure"}`);
  if (d.spec.capacity_mw) parts.push(`delivering ${fmtMw(d.spec.capacity_mw)} MW of design capacity`);
  if (d.spec.gpus) parts.push(`for ${nf.format(d.spec.gpus)} accelerator positions`);
  if (real(d.spec.site)) parts.push(`at ${d.spec.site}`);
  const first = parts.join(" ") + ".";
  const second = mode === "formal"
    ? `This proposal defines the configured system, the scope PODOS delivers, the deployment timeline and the commercial terms${p ? ` for ${p}` : ""}.`
    : `This preliminary estimate reflects the configuration as selected and gives an indicative investment range ahead of engineering review${p ? ` for ${p}` : ""}.`;
  return `${first} ${second}`;
}

/* six spec modules: chosen menu items by category, else line items by category, else the standard scope */
const MODULES = [
  { key: "platform", title: "Platform", cats: ["platform"], Icon: Boxes, fallback: "Factory-integrated PODOS modular unit" },
  { key: "compute", title: "Compute", cats: ["compute"], Icon: Cpu, fallback: "Rack positions for client-specified accelerators" },
  { key: "cooling", title: "Cooling", cats: ["cooling"], Icon: Snowflake, fallback: "Integrated liquid-cooling loop and thermal module" },
  { key: "power", title: "Power & electrical", cats: ["power"], Icon: Zap, fallback: "Distribution and protection to rack level" },
  { key: "network", title: "Network & storage", cats: ["network"], Icon: Network, fallback: "Fiber backbone and structured cabling" },
  { key: "deployment", title: "Deployment & support", cats: ["deployment", "support"], Icon: Truck, fallback: "Delivery, commissioning, warranty" },
] as const;

const stepCat = (step: string) => (STEP_CATEGORY as Record<string, string>)[step];

function moduleItems(d: DocData, cats: readonly string[]): string[] {
  const chosen = d.spec.chosen.filter((c) => cats.includes(stepCat(c.step))).map((c) => c.name);
  if (chosen.length) return Array.from(new Set(chosen));
  const lines = d.lineItems.filter((l) => cats.includes(l.category_slug ?? "") && !l.optional).map((l) => l.name);
  return Array.from(new Set(lines));
}

/* itemized rows, grouped, with pagination */
type Row = { kind: "group"; label: string } | { kind: "item"; line: DocLine };
function buildRows(lines: DocLine[]): Row[] {
  const rows: Row[] = [];
  for (const cat of CATEGORY_ORDER) {
    const group = lines.filter((l) => !l.recurring && (l.category_slug ?? "custom") === cat);
    if (!group.length) continue;
    rows.push({ kind: "group", label: categoryLabel(cat) });
    for (const line of group) rows.push({ kind: "item", line });
  }
  const rec = lines.filter((l) => l.recurring);
  if (rec.length) { rows.push({ kind: "group", label: "Recurring services (annual)" }); for (const line of rec) rows.push({ kind: "item", line }); }
  return rows;
}
const PAGE3_ROWS = 12, FULL_PAGE3_ROWS = 16, APPENDIX_ROWS = 34;

/* callout anchors on the generated cutaway (1536 × 1024 image space); labels sit in the white margins */
const CALLOUTS = [
  { n: 1, label: "Compute rack positions", ax: 950, ay: 500, lx: 1010, ly: 150 },
  { n: 2, label: "Cooling distribution", ax: 470, ay: 530, lx: 200, ly: 150 },
  { n: 3, label: "Power distribution", ax: 395, ay: 625, lx: 200, ly: 900 },
  { n: 4, label: "Network & fiber path", ax: 800, ay: 612, lx: 700, ly: 930 },
  { n: 5, label: "Monitoring & controls", ax: 1300, ay: 470, lx: 1440, ly: 900 },
  { n: 6, label: "Structural enclosure", ax: 215, ay: 470, lx: 200, ly: 250 },
];
const CHAR_W = 15; // ≈ average glyph width of the 26px callout label

const STAGES = [
  { w: "Week 0", s: "Engineering review" },
  { w: "Weeks 2–10", s: "Factory build" },
  { w: "Week 10", s: "Factory acceptance" },
  { w: "Weeks 11–12", s: "Site commissioning" },
  { w: "Week 13", s: "Handover" },
];

/* ---------- background system ---------- */
function PageBackground({ variant, watermark, uid }: { variant: 1 | 2 | 3 | 4; watermark: string | null; uid: string }) {
  const path = variant === 1 ? "M -10 212 C 60 200, 110 262, 220 236"
    : variant === 2 ? "M -10 160 C 60 154, 140 166, 220 158"
    : variant === 3 ? "M 123 -10 C 118 80, 128 200, 122 310"
    : "M -10 40 C 60 34, 140 46, 220 38";
  return (
    <svg className="pdf-bg" viewBox="0 0 210 297" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id={`rg-${uid}`} cx="0.9" cy="0.05" r="0.75">
          <stop offset="0" stopColor="#1b55f5" stopOpacity="0.13" />
          <stop offset="0.55" stopColor="#28c4ea" stopOpacity="0.04" />
          <stop offset="1" stopColor="#f7f9fc" stopOpacity="0" />
        </radialGradient>
        <pattern id={`grid-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#0b1220" strokeWidth="0.12" />
        </pattern>
        <linearGradient id={`ep-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1b55f5" stopOpacity="0" />
          <stop offset="0.35" stopColor="#1b55f5" stopOpacity="0.9" />
          <stop offset="0.7" stopColor="#28c4ea" stopOpacity="0.9" />
          <stop offset="1" stopColor="#28c4ea" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="210" height="297" fill="#f7f9fc" />
      <rect width="210" height="297" fill={`url(#rg-${uid})`} />
      <rect width="210" height="297" fill={`url(#grid-${uid})`} opacity="0.3" />
      <path d="M 10 20 V 10 H 20" fill="none" stroke="#1b55f5" strokeWidth="0.3" opacity="0.55" />
      <path d="M 200 277 V 287 H 190" fill="none" stroke="#1b55f5" strokeWidth="0.3" opacity="0.55" />
      <path d={path} fill="none" stroke={`url(#ep-${uid})`} strokeWidth="0.55" strokeLinecap="round" />
      {watermark && (
        <text x="105" y="152" textAnchor="middle" transform="rotate(-30 105 148)" fontFamily="var(--display)" fontWeight="800" fontSize="8.6" letterSpacing="0.5" fill="#1b55f5" opacity="0.08">{watermark}</text>
      )}
    </svg>
  );
}

function Foot({ d, hash, page, total }: { d: DocData; hash: string; page: number; total: number }) {
  return (
    <footer className="pdf-foot">
      <span>PODOS AI · Confidential</span>
      <span className="c pdf-num">{d.publicId} · Rev {d.rev} · Hash {hash}</span>
      <span className="r pdf-num">Page {page} of {total}</span>
    </footer>
  );
}

function Head({ logo, label, right }: { logo: string; label: string; right: React.ReactNode }) {
  return (
    <header className="pdf-head">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt="PODOS AI" style={{ height: "9mm", width: "auto" }} />
      <div className="pdf-head-right">
        <span className="pdf-label">{label}</span>
        {right}
      </div>
    </header>
  );
}

function Ref({ d }: { d: DocData }) {
  return <span className="pdf-num" style={{ fontWeight: 700, fontSize: "9pt" }}>{d.publicId}</span>;
}

/* ---------- pages ---------- */
function Cover({ d, mode, design, assets, hash, page, total, notice, wm }: { d: DocData; mode: PageMode; design: ProposalDesign; assets: PrintAssets; hash: string; page: number; total: number; notice: string | null; wm: string | null }) {
  const pods = podCount(d);
  const company = displayName(d.company);
  const client = displayName(d.clientName);
  const p = proj(d);
  const title = mode === "formal"
    ? (p ? `Modular AI infrastructure for ${p}` : "Modular AI infrastructure proposal")
    : (p ? `Preliminary estimate for ${p}` : "Preliminary configuration estimate");
  return (
    <section className="pdf-page">
      <PageBackground variant={1} watermark={wm} uid={`p${page}`} />
      <div className="pdf-content">
        <Head logo={assets.logo} label={mode === "formal" ? "Formal commercial proposal" : "Preliminary configuration estimate"}
          right={<><Ref d={d} /><span className="pdf-small">Issued {fmtDate(d.issued)}</span></>} />
        <div className="pdf-cover-grid">
          <div className="pdf-cover-title">
            {notice && <p className="pdf-notice">{notice}</p>}
            <div>
              <span className="pdf-label">{mode === "formal" ? "Prepared exclusively for" : "Prepared for"} {company || client}</span>
              <h1 className="pdf-title">{title}</h1>
            </div>
          </div>
          <div className="pdf-cover-left">
            <dl className="pdf-prepared">
              <dt>Company</dt><dd>{company || "—"}</dd>
              <dt>Contact</dt><dd>{client || "—"}</dd>
              <dt>Project</dt><dd>{p ?? d.project ?? "—"}</dd>
              <dt>Reference</dt><dd className="pdf-num">{d.publicId} · Rev {d.rev}</dd>
              <dt>Date</dt><dd>{fmtDate(d.issued)}</dd>
              <dt>Valid until</dt><dd>{fmtDate(validUntil(d, design))}</dd>
            </dl>
            {design.sections.exec_summary && (
              <div>
                <span className="pdf-label muted">{mode === "formal" ? "Executive summary" : "About this estimate"}</span>
                <p className="pdf-lede" style={{ marginTop: "2mm" }}>{summary(d, mode)}</p>
              </div>
            )}
          </div>
          <figure className="pdf-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={design.visuals.cover && assets.cover ? assets.cover : "/products/pod.png"} alt="PODOS modular AI infrastructure unit" />
            <figcaption className="pdf-hero-caption pdf-small">PODOS modular unit · product visualization</figcaption>
          </figure>
          {design.sections.metrics && (
            <div className="pdf-metrics">
              <Metric label="Pods" value={pods != null ? nf.format(pods) : "—"} unit={pods != null ? "factory-built units" : "to be confirmed"} />
              <Metric label="Design capacity" value={d.spec.capacity_mw ? fmtMw(d.spec.capacity_mw) : "—"} unit={d.spec.capacity_mw ? "MW critical IT" : "to be confirmed"} />
              <Metric label="Accelerator positions" value={d.spec.gpus ? nf.format(d.spec.gpus) : "—"} unit={d.spec.gpus ? "GPU slots provisioned" : "per final compute selection"} />
              <Metric label={mode === "formal" ? "Investment" : "Indicative range"} value={compactUsd(d.lowCents)}
                unit={d.lowCents === d.highCents ? "one-time, USD" : `to ${compactUsd(d.highCents)} · one-time, USD`} />
            </div>
          )}
        </div>
        <Foot d={d} hash={hash} page={page} total={total} />
      </div>
    </section>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="pdf-metric">
      <span className="pdf-label muted">{label}</span>
      <div className="v pdf-num">{value}</div>
      <div className="u">{unit}</div>
    </div>
  );
}

function Timeline({ golive }: { golive?: string }) {
  return (
    <div className="pdf-timeline">
      <span className="pdf-label">Deployment timeline{golive ? ` · target go-live ${fmtDate(golive)}` : ""}</span>
      <div className="pdf-track"><i className="ln" />{STAGES.map((s) => <span className="dot" key={s.w} />)}</div>
      <div className="pdf-stages">{STAGES.map((s) => <div className="pdf-stage" key={s.w}><div className="w pdf-num">{s.w}</div><div className="s">{s.s}</div></div>)}</div>
      <p className="pdf-small">Indicative schedule from order confirmation; confirmed in the engineering review.</p>
    </div>
  );
}

function Modules({ d, empty }: { d: DocData; empty: string }) {
  return (
    <div className="pdf-modules">
      {MODULES.map((m) => {
        const items = moduleItems(d, m.cats);
        return (
          <div className="pdf-module" key={m.key}>
            <span className="ic"><m.Icon size={15} strokeWidth={1.9} /></span>
            <div>
              <div className="t">{m.title}</div>
              <div className="n">{items.length ? items.slice(0, 2).join(" · ") : empty === "fallback" ? m.fallback : empty}</div>
              {items.length > 2 && <div className="d">+ {items.length - 2} more</div>}
              {!items.length && empty === "fallback" && <div className="d">Standard specification</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SystemPage({ d, design, assets, hash, page, total, wm }: { d: DocData; design: ProposalDesign; assets: PrintAssets; hash: string; page: number; total: number; wm: string | null }) {
  const cats = new Set(d.lineItems.map((l) => l.category_slug ?? "custom").concat(d.spec.chosen.map((c) => stepCat(c.step))));
  const scope = [
    "Factory-integrated PODOS unit(s), enclosure and access panels",
    "Rack positions with power and cooling interfaces",
    cats.has("cooling") ? "Liquid-cooling loop and coolant distribution" : null,
    cats.has("power") ? "Power distribution and protection to rack level" : null,
    cats.has("network") ? "Network backbone and structured fiber" : null,
    "Delivery, placement and site connection",
    "Commissioning, acceptance testing and training",
    cats.has("support") ? "Warranty and support as itemized" : null,
  ].filter(Boolean).slice(0, 7) as string[];
  return (
    <section className="pdf-page">
      <PageBackground variant={2} watermark={wm} uid={`p${page}`} />
      <div className="pdf-content">
        <Head logo={assets.logo} label="Your PODOS system" right={<Ref d={d} />} />
        <div className="pdf-sys">
          <div className="pdf-section-head">
            <h2 className="pdf-h2">Your PODOS system</h2>
            <p className="pdf-small" style={{ maxWidth: "80mm", textAlign: "right" }}>One factory-built unit integrates compute positions, cooling, power and network — delivered and commissioned as a single system.</p>
          </div>
          {design.visuals.cutaway && assets.cutaway && (
            <figure className="pdf-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assets.cutaway} alt="Technical cutaway of the PODOS unit" />
              <svg className="callouts" viewBox="0 0 1536 1024" preserveAspectRatio="none" aria-hidden="true">
                {CALLOUTS.map((c) => {
                  const right = c.lx > c.ax;
                  const w = c.label.length * CHAR_W + 24;
                  const pillX = right ? c.lx - 24 - w : c.lx - 20;
                  return (
                    <g key={c.n}>
                      <path d={`M ${c.ax} ${c.ay} L ${c.lx} ${c.ly}`} stroke="#1b55f5" strokeWidth="2.2" fill="none" opacity="0.85" />
                      <circle cx={c.ax} cy={c.ay} r="9" fill="#ffffff" stroke="#1b55f5" strokeWidth="3" />
                      <rect x={pillX} y={c.ly - 22} width={w + 44} height="44" rx="22" fill="#ffffff" fillOpacity="0.92" stroke="#1b55f5" strokeOpacity="0.25" strokeWidth="1.5" />
                      <circle cx={c.lx} cy={c.ly} r="15" fill="#1b55f5" />
                      <text x={c.lx} y={c.ly + 8} textAnchor="middle" fontFamily="var(--display)" fontWeight="800" fontSize="21" fill="#fff">{c.n}</text>
                      <text x={right ? c.lx - 24 : c.lx + 24} y={c.ly + 9} textAnchor={right ? "end" : "start"} fontFamily="var(--display)" fontWeight="700" fontSize="26" fill="#0b1220" letterSpacing="0.2">{c.label}</text>
                    </g>
                  );
                })}
              </svg>
            </figure>
          )}
          {design.sections.spec_modules && <Modules d={d} empty="fallback" />}
          <div className="pdf-three">
            {design.sections.scope && (
              <div>
                <span className="pdf-label">Included scope</span>
                <ul className="pdf-bullets">{scope.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            )}
            {design.sections.timeline && <Timeline golive={d.spec.golive} />}
            {design.sections.responsibilities && (
              <div className="pdf-resp">
                <div>
                  <span className="pdf-label">PODOS provides</span>
                  <ul className="pdf-bullets"><li>System design & engineering review</li><li>Factory build, integration & FAT</li><li>Delivery, placement & commissioning</li><li>Documentation & training</li></ul>
                </div>
                <div>
                  <span className="pdf-label muted">Client provides</span>
                  <ul className="pdf-bullets"><li>Prepared pad and site access</li><li>Utility power & fiber to demarcation</li><li>Permits and local approvals</li></ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <Foot d={d} hash={hash} page={page} total={total} />
      </div>
    </section>
  );
}

function ItemsTable({ rows, continued }: { rows: Row[]; continued?: boolean }) {
  return (
    <table className="pdf-table">
      <thead><tr><th style={{ width: "58%" }}>Item</th><th className="r">Qty</th><th className="r">Unit</th><th className="r">Extended</th></tr></thead>
      <tbody>
        {rows.map((r, i) => r.kind === "group"
          ? <tr className="group" key={`g${i}`}><td colSpan={4}>{r.label}</td></tr>
          : (
            <tr key={`i${i}`}>
              <td><span className="nm">{r.line.name}</span>{r.line.optional && <span className="tag">Optional</span>}{r.line.recurring && <span className="tag">Annual</span>}{r.line.customer_description && <div className="ds">{r.line.customer_description}</div>}</td>
              <td className="r pdf-num">{nf.format(r.line.qty)}</td>
              <td className="r pdf-num">{r.line.unit_price_cents > 0 ? usd(r.line.unit_price_cents) : "Pending"}</td>
              <td className="r pdf-num" style={{ fontWeight: 600 }}>{r.line.unit_price_cents > 0 ? usd(r.line.extended_cents) : "—"}</td>
            </tr>
          ))}
        {continued && <tr><td colSpan={4} className="pdf-small" style={{ borderBottom: 0, paddingTop: "3mm" }}>Continued in Appendix A — itemized detail.</td></tr>}
      </tbody>
    </table>
  );
}

function CommercialPage({ d, design, assets, hash, page, total, rows, continued, wm }: { d: DocData; design: ProposalDesign; assets: PrintAssets; hash: string; page: number; total: number; rows: Row[]; continued: boolean; wm: string | null }) {
  const optional = d.lineItems.filter((l) => l.optional).length;
  const until = validUntil(d, design);
  return (
    <section className="pdf-page">
      <PageBackground variant={3} watermark={wm} uid={`p${page}`} />
      <div className="pdf-content">
        <Head logo={assets.logo} label="Commercial proposal" right={<Ref d={d} />} />
        <div className="pdf-com">
          <div className="pdf-section-head">
            <h2 className="pdf-h2">Commercial proposal</h2>
            <p className="pdf-small" style={{ maxWidth: "70mm", textAlign: "right" }}>All amounts in USD, excluding taxes and duties. Totals are computed from the released version of this proposal.</p>
          </div>
          <div className="pdf-com-grid">
            <ItemsTable rows={rows} continued={continued} />
            <div className="pdf-total">
              <div>
                <span className="pdf-label">One-time investment</span>
                <div className="big pdf-num" style={{ marginTop: "2mm" }}>{usd(d.lowCents)}</div>
                {d.lowCents !== d.highCents && <div className="pdf-num" style={{ fontSize: "11pt", fontWeight: 600, marginTop: "1.4mm", color: "rgba(255,255,255,.85)" }}>to {usd(d.highCents)}</div>}
              </div>
              {d.recurringCents > 0 && <div className="row"><span>Recurring services</span><b className="pdf-num">{usd(d.recurringCents)} / year</b></div>}
              <div className="row"><span>Pods</span><b className="pdf-num">{podCount(d) ?? "—"}</b></div>
              {d.spec.capacity_mw ? <div className="row"><span>Design capacity</span><b className="pdf-num">{fmtMw(d.spec.capacity_mw)} MW</b></div> : null}
              <div className="row"><span>Valid until</span><b>{fmtDate(until)}</b></div>
              <p className="note">{optional ? `${optional} optional item${optional === 1 ? "" : "s"} shown for reference and excluded from totals. ` : ""}Final pricing is confirmed at order after the engineering review.</p>
            </div>
          </div>
          {design.sections.assumptions && (
            <div className="pdf-terms">
              <div><span className="pdf-label">Assumptions</span><ul className="pdf-bullets"><li>Configuration as documented on the preceding pages</li><li>Site conditions as provided by the client</li><li>Standard lead times at order confirmation</li></ul></div>
              <div><span className="pdf-label">Exclusions</span><ul className="pdf-bullets"><li>Utility power and fiber beyond the demarcation point</li><li>Civil works, permits, taxes and import duties</li><li>Servers and accelerators unless itemized above</li></ul></div>
              <div><span className="pdf-label">Validity</span><ul className="pdf-bullets"><li>Valid until {fmtDate(until)}</li><li>Prices in USD, excluding taxes</li><li>Subject to final engineering review</li></ul></div>
            </div>
          )}
          {design.signature_block ? (
            <div className="pdf-sign">
              <div>
                <div className="who">{displayName(d.company) || "Client"}</div>
                <div className="line">{d.signedAt && d.signerName && <span>{displayName(d.signerName)}</span>}</div>
                <div className="cap"><span>{d.signedAt ? `Signed ${fmtDate(d.signedAt)}` : "Authorized signature"}</span><span>Name · Title · Date</span></div>
              </div>
              <div>
                <div className="who">PODOS AI</div>
                <div className="line" />
                <div className="cap"><span>Authorized signatory</span><span>Name · Title · Date</span></div>
              </div>
            </div>
          ) : design.sections.next_step ? (
            <div className="pdf-next">
              <div>
                <span className="pdf-label">Next step</span>
                <p className="pdf-body" style={{ marginTop: "1.2mm" }}>Review this proposal with your team. Confirm, request changes or ask questions from your secure PODOS workspace — your PODOS contact will schedule the engineering review on confirmation.</p>
              </div>
              <span className="pdf-ready">Ready for client review</span>
            </div>
          ) : null}
        </div>
        <Foot d={d} hash={hash} page={page} total={total} />
      </div>
    </section>
  );
}

function AppendixPage({ d, assets, hash, page, total, rows, letter, wm }: { d: DocData; assets: PrintAssets; hash: string; page: number; total: number; rows: Row[]; letter: string; wm: string | null }) {
  return (
    <section className="pdf-page">
      <PageBackground variant={4} watermark={wm} uid={`p${page}`} />
      <div className="pdf-content">
        <Head logo={assets.logo} label={`Appendix ${letter}`} right={<Ref d={d} />} />
        <div style={{ paddingTop: "6mm", minHeight: 0 }}>
          <h2 className="pdf-h2" style={{ marginBottom: "5mm" }}>Itemized detail (continued)</h2>
          <ItemsTable rows={rows} />
        </div>
        <Foot d={d} hash={hash} page={page} total={total} />
      </div>
    </section>
  );
}

function EstimatePage({ d, design, assets, hash, page, total, wm }: { d: DocData; design: ProposalDesign; assets: PrintAssets; hash: string; page: number; total: number; wm: string | null }) {
  return (
    <section className="pdf-page">
      <PageBackground variant={3} watermark={wm} uid={`p${page}`} />
      <div className="pdf-content">
        <Head logo={assets.logo} label="Configuration estimate" right={<Ref d={d} />} />
        <div className="pdf-est">
          <div className="pdf-section-head">
            <h2 className="pdf-h2">Your configuration</h2>
            <p className="pdf-small" style={{ maxWidth: "76mm", textAlign: "right" }}>Indicative range built from the PODOS catalog for the selections below. Not a commercial offer.</p>
          </div>
          <Modules d={d} empty="Not yet selected" />
          {design.visuals.deployment && assets.deployment && (
            <figure className="pdf-figure pdf-est-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assets.deployment} alt="PODOS unit at a deployment site" />
              <figcaption className="pdf-small pdf-est-caption">Conceptual deployment visualization · final site layout defined in engineering review</figcaption>
            </figure>
          )}
          <div className="pdf-est-grid">
            <div>
              <span className="pdf-label">How this estimate is built</span>
              <ul className="pdf-bullets">
                <li>Catalog pricing for each selected module, multiplied by the pod quantity</li>
                <li>A range reflecting site, integration and volume factors confirmed in engineering review</li>
                <li>Recurring services shown separately from one-time investment</li>
                <li>Indicative until PODOS releases the formal commercial proposal</li>
              </ul>
            </div>
            <div className="pdf-range">
              <span className="pdf-label">Indicative investment</span>
              <div className="big pdf-num">{usd(d.lowCents)}</div>
              {d.lowCents !== d.highCents && <div className="pdf-num" style={{ fontSize: "11pt", fontWeight: 600, color: "rgba(255,255,255,.85)" }}>to {usd(d.highCents)}</div>}
              {d.recurringCents > 0 && <div className="pdf-small" style={{ color: "rgba(255,255,255,.7)" }}>+ {usd(d.recurringCents)} / year recurring services</div>}
              <p className="pdf-small" style={{ color: "rgba(255,255,255,.6)" }}>One-time, USD, excluding taxes.</p>
            </div>
          </div>
          {design.sections.timeline && <Timeline golive={d.spec.golive} />}
          <div className="pdf-next">
            <div>
              <span className="pdf-label">Next step</span>
              <p className="pdf-body" style={{ marginTop: "1.2mm" }}>Confirm your configuration in your secure PODOS workspace. PODOS reviews feasibility and releases the formal commercial proposal with itemized pricing.</p>
            </div>
            <span className="pdf-ready">Preliminary estimate</span>
          </div>
        </div>
        <Foot d={d} hash={hash} page={page} total={total} />
      </div>
    </section>
  );
}

/* ---------- document ---------- */
export default function ProposalPrint({ d, pageMode, design, hash, previewNotice = null, assets: partial, screen = true }: ProposalPrintProps) {
  const assets: PrintAssets = { ...DEFAULT_ASSETS, ...partial };
  const wm = previewNotice ? "DESIGN PREVIEW · SAMPLE VALUES" : design.watermark === "none" ? null : design.watermark.toUpperCase();

  const pages: React.ReactNode[] = [];
  if (pageMode === "preliminary") {
    const total = 2;
    pages.push(<Cover key="c" d={d} mode="preliminary" design={design} assets={assets} hash={hash} page={1} total={total} notice={previewNotice} wm={wm} />);
    pages.push(<EstimatePage key="e" d={d} design={design} assets={assets} hash={hash} page={2} total={total} wm={wm} />);
  } else {
    const rows = buildRows(d.lineItems);
    const fits = rows.length <= FULL_PAGE3_ROWS;
    const first = fits ? rows : rows.slice(0, PAGE3_ROWS);
    const rest = fits ? [] : rows.slice(PAGE3_ROWS);
    const chunks: Row[][] = [];
    for (let i = 0; i < rest.length; i += APPENDIX_ROWS) chunks.push(rest.slice(i, i + APPENDIX_ROWS));
    const total = 3 + chunks.length;
    pages.push(<Cover key="c" d={d} mode="formal" design={design} assets={assets} hash={hash} page={1} total={total} notice={previewNotice} wm={wm} />);
    pages.push(<SystemPage key="s" d={d} design={design} assets={assets} hash={hash} page={2} total={total} wm={wm} />);
    pages.push(<CommercialPage key="m" d={d} design={design} assets={assets} hash={hash} page={3} total={total} rows={first} continued={chunks.length > 0} wm={wm} />);
    chunks.forEach((c, i) => pages.push(<AppendixPage key={`a${i}`} d={d} assets={assets} hash={hash} page={4 + i} total={total} rows={c} letter="A" wm={wm} />));
  }

  return <div className={`pdf-doc${screen ? " pdf-screen" : ""}`}>{pages}</div>;
}
