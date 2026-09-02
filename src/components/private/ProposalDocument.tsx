import Image from "next/image";
import {
  Boxes, Cpu, Snowflake, Zap, Network, Truck, LifeBuoy, MapPin, Calendar, DollarSign, Layers, ShieldCheck, CheckCircle2,
} from "lucide-react";
import s from "./private.module.css";

/**
 * ProposalDocument — the formal PODOS proposal as a designed web document
 * (redesign brief §18). One structured source (DocData) feeds this preview
 * AND the PDF, so what the client reads online is what they download.
 * Renders for staff (mode "admin", watermark) and clients (mode "client").
 * Every number is server-computed; every product name comes from the catalog.
 */

export interface DocLine {
  name: string; customer_description?: string | null; category_slug?: string | null;
  qty: number; unit_price_cents: number; extended_cents: number;
  recurring: boolean; pending_review: boolean; optional?: boolean;
}
export interface DocSpec {
  pods?: number; capacity_mw?: number; gpus?: number; workload?: string; golive?: string;
  site?: string; site_type?: string;
  chosen: { step: string; label: string; name: string; sku: string }[];
}
export interface DocData {
  publicId: string; estimateNo: string; rev: number; status: string;
  clientName: string; company: string | null; project: string | null;
  contactEmail?: string | null; issued: string; expires: string | null;
  lowCents: number; highCents: number; recurringCents: number;
  lineItems: DocLine[]; spec: DocSpec; images: Record<string, string>;
  signedAt?: string | null; signerName?: string | null;
}

export const usd = (c: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(c / 100);
const fmtDate = (d: string | null | undefined) => (d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—");

const STEP_ICON: Record<string, React.ReactNode> = {
  platform: <Boxes size={18} strokeWidth={1.75} />, compute: <Cpu size={18} strokeWidth={1.75} />,
  cooling: <Snowflake size={18} strokeWidth={1.75} />, power: <Zap size={18} strokeWidth={1.75} />,
  network: <Network size={18} strokeWidth={1.75} />, deployment: <Truck size={18} strokeWidth={1.75} />,
  support: <LifeBuoy size={18} strokeWidth={1.75} />,
};

const CATEGORY_LABEL: Record<string, string> = {
  platform: "PODOS Platform", compute: "Compute", cooling: "Cooling", power: "Power & Electrical",
  network: "Network & Storage", deployment: "Deployment & Site", support: "Warranty & Support", custom: "Custom items",
};

export default function ProposalDocument({ d, mode }: { d: DocData; mode: "admin" | "client" }) {
  const oneTime = d.lineItems.filter((l) => !l.recurring);
  const recurring = d.lineItems.filter((l) => l.recurring);
  const grouped = new Map<string, DocLine[]>();
  for (const l of oneTime) grouped.set(l.category_slug ?? "custom", [...(grouped.get(l.category_slug ?? "custom") ?? []), l]);
  const subtotal = oneTime.reduce((a, l) => a + l.extended_cents, 0);
  const heroImg = d.images["POD-BASE"] ?? d.images.hero;
  const isPreliminary = !["released", "signature_requested", "client_signed", "signed", "countersigned", "completed"].includes(d.status);

  return (
    <article className={s.docPage} style={{ position: "relative", overflow: "hidden" }} aria-label={`${d.estimateNo} proposal`}>
      {mode === "admin" && (
        <p className={`${s.chip} ${s.chipAmber}`} style={{ position: "absolute", top: 16, right: 16 }}>Admin preview — not counted as a client view</p>
      )}

      {/* ---- cover ---- */}
      <header style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)", gap: "2rem", alignItems: "center" }}>
        <div>
          <Image src="/logo.png" alt="PODOS AI" width={150} height={52} sizes="150px" style={{ height: 44, width: "auto" }} />
          {heroImg && (
            <div style={{ position: "relative", aspectRatio: "3 / 2", marginTop: "1.4rem", borderRadius: 14, overflow: "hidden", background: "var(--canvas)", border: "1px solid var(--edge-faint)" }}>
              <Image src={heroImg} alt="Technical elevation of the configured PODOS pod" fill priority sizes="(max-width: 900px) 100vw, 45vw" style={{ objectFit: "contain" }} />
            </div>
          )}
        </div>
        <div>
          <p className={`${s.label} ${s.labelBrand}`}>{isPreliminary ? "Preliminary configuration estimate" : "Proposal"}</p>
          <h1 className={s.display} style={{ marginTop: 8, fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)" }}>{d.project ?? "PODOS deployment"}</h1>
          <p className={s.body} style={{ marginTop: 6 }}>Modular AI infrastructure solution</p>
          <p className={`${s.label} ${s.labelBrand}`} style={{ marginTop: "1.4rem" }}>Prepared for</p>
          <p className={s.title} style={{ fontSize: "1.15rem", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.02em" }}>{d.company ?? d.clientName}</p>
          <p style={{ fontSize: 14, color: "var(--ink-dim)", marginTop: 2 }}>{d.clientName}{d.contactEmail ? ` · ${d.contactEmail}` : ""}</p>
          <p className={`${s.label} ${s.labelBrand}`} style={{ marginTop: "1.2rem" }}>Project reference</p>
          <p style={{ fontWeight: 700, marginTop: 4 }}>{d.estimateNo} <span style={{ color: "var(--ink-faint)", fontWeight: 500 }}>· {d.publicId} · v{d.rev}</span></p>
          <p style={{ fontSize: 13.5, color: "var(--ink-dim)", marginTop: 6 }}>{fmtDate(d.issued)}{d.expires ? ` · valid until ${fmtDate(d.expires)}` : ""}</p>
        </div>
      </header>

      {/* ---- executive summary ---- */}
      <section className={s.docBand} style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "48px 1fr", gap: "1rem" }}>
        <span className={s.iconTile}><ShieldCheck size={20} strokeWidth={1.75} /></span>
        <div>
          <p className={`${s.label} ${s.labelBrand}`}>Executive summary</p>
          <p className={s.body} style={{ marginTop: 6, color: "var(--ink-strong)" }}>
            PODOS proposes a factory-built modular AI compute deployment for {d.company ?? d.clientName}
            {d.spec.pods ? ` — ${d.spec.pods} pod${d.spec.pods === 1 ? "" : "s"}` : ""}
            {d.spec.workload ? ` for ${d.spec.workload.toLowerCase()} workloads` : ""}
            {d.spec.site ? `, deployed at ${d.spec.site}` : ""}. The configuration below reflects the client&apos;s selections and PODOS engineering review; pricing is {isPreliminary ? "a preliminary range" : "the proposed commercial scope"} subject to the terms on the final page.
          </p>
        </div>
      </section>

      {/* ---- key metrics ---- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.8rem", marginTop: "1rem" }}>
        <Metric icon={<Zap size={18} strokeWidth={1.75} />} label="Total capacity" value={d.spec.capacity_mw ? `${d.spec.capacity_mw} MW` : "TBD"} sub="IT load (client target)" />
        <Metric icon={<Boxes size={18} strokeWidth={1.75} />} label="Pod count" value={d.spec.pods ? String(d.spec.pods) : "TBD"} sub="PODOS pods" />
        <Metric icon={<Calendar size={18} strokeWidth={1.75} />} label="Target go-live" value={d.spec.golive ? fmtDate(d.spec.golive) : "TBD"} sub="client target" />
        <Metric icon={<DollarSign size={18} strokeWidth={1.75} />} label={isPreliminary ? "Estimated range" : "Total investment"} value={d.highCents > 0 ? `${usd(d.lowCents)} – ${usd(d.highCents)}` : "TBD"} sub="USD, one-time" />
      </div>

      {/* ---- configuration ---- */}
      <h2 className={s.headline} style={{ fontSize: "1.4rem", marginTop: "2.4rem" }}>Configuration summary</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "0.9rem", marginTop: "1rem" }}>
        {d.spec.chosen.length === 0 && <p className={s.body}>Configuration is finalized with PODOS during review.</p>}
        {d.spec.chosen.map((c) => (
          <div key={c.step} className={s.panel} style={{ padding: "0.9rem", display: "grid", gap: 8 }}>
            {d.images[c.sku] ? (
              <span className={s.optionMedia} style={{ aspectRatio: "4 / 3" }}><Image src={d.images[c.sku]} alt="" width={460} height={345} sizes="230px" /></span>
            ) : (
              <span className={s.iconTile}>{STEP_ICON[c.step] ?? <Layers size={18} />}</span>
            )}
            <p className={s.label}>{c.label}</p>
            <p style={{ fontWeight: 700, fontSize: 14.5 }}>{c.name}</p>
          </div>
        ))}
        {(d.spec.site || d.spec.site_type) && (
          <div className={s.panel} style={{ padding: "0.9rem", display: "grid", gap: 8 }}>
            <span className={s.iconTile}><MapPin size={18} strokeWidth={1.75} /></span>
            <p className={s.label}>Deployment site</p>
            <p style={{ fontWeight: 700, fontSize: 14.5 }}>{d.spec.site ?? d.spec.site_type}</p>
          </div>
        )}
      </div>

      {/* ---- scope & deliverables ---- */}
      <h2 className={s.headline} style={{ fontSize: "1.4rem", marginTop: "2.4rem" }}>Scope &amp; deliverables</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
        <div className={s.docBand}>
          <p className={`${s.label} ${s.labelBrand}`}>Included</p>
          <ul style={{ margin: "0.6rem 0 0", padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
            {oneTime.filter((l) => !l.optional).map((l, i) => (
              <li key={i} style={{ display: "flex", gap: 8, fontSize: 13.5 }}><CheckCircle2 size={15} color="#15803D" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden /> {l.name}{l.qty > 1 ? ` (×${l.qty})` : ""}</li>
            ))}
            {oneTime.filter((l) => !l.optional).length === 0 && <li className={s.help}>Defined with PODOS during review.</li>}
          </ul>
        </div>
        <div className={s.docBand}>
          <p className={`${s.label} ${s.labelBrand}`}>Assumptions &amp; dependencies</p>
          <p className={s.help} style={{ marginTop: "0.6rem", lineHeight: 1.6, fontSize: 13 }}>
            Standard site conditions and equipment availability at time of order. Utility interconnection, permitting, civil works, taxes, duties and freight beyond the quoted zone are excluded unless itemized. Items marked “pending review” are confirmed by PODOS engineering before release.
          </p>
          {oneTime.some((l) => l.pending_review) && <p className={`${s.chip} ${s.chipAmber}`} style={{ marginTop: 10 }}>{oneTime.filter((l) => l.pending_review).length} item(s) pending engineering review</p>}
        </div>
      </div>

      {/* ---- commercial summary ---- */}
      <h2 className={s.headline} style={{ fontSize: "1.4rem", marginTop: "2.4rem" }}>Commercial summary</h2>
      <div className={s.panel} style={{ marginTop: "1rem", overflow: "hidden" }}>
        {[...grouped.entries()].map(([cat, lines]) => (
          <div key={cat} style={{ padding: "0.9rem 1.2rem", borderTop: "1px solid var(--edge-faint)" }}>
            <p className={`${s.label} ${s.labelBrand}`}>{CATEGORY_LABEL[cat] ?? cat}</p>
            {lines.map((l, i) => (
              <div key={i} className={s.docRow} style={{ borderTop: i === 0 ? "none" : undefined }}>
                <span style={{ color: "var(--ink-strong)" }}>{l.name}{l.qty > 1 ? <span style={{ color: "var(--ink-faint)" }}> ×{l.qty}</span> : null}{l.pending_review && <span className={`${s.chip} ${s.chipAmber}`} style={{ marginLeft: 8 }}>pending</span>}</span>
                <span className={s.num} style={{ fontWeight: 600 }}>{l.pending_review ? "Review" : usd(l.extended_cents)}</span>
              </div>
            ))}
          </div>
        ))}
        <div style={{ padding: "1rem 1.2rem", borderTop: "2px solid var(--ink-strong)", background: "var(--brand-wash)" }}>
          <div className={s.docRow} style={{ borderTop: "none" }}><span>Subtotal (one-time)</span><span className={s.num}>{usd(subtotal)}</span></div>
          <div className={s.docRow}><span style={{ fontWeight: 700 }}>{isPreliminary ? "Preliminary one-time range" : "Total investment"}</span><span className={s.num} style={{ fontWeight: 800, color: "var(--brand-deep)", fontSize: "1.05rem" }}>{d.highCents > 0 ? `${usd(d.lowCents)} – ${usd(d.highCents)}` : "TBD"}</span></div>
          {recurring.length > 0 && <div className={s.docRow}><span>Recurring support</span><span className={s.num}>{usd(d.recurringCents)} / year</span></div>}
        </div>
      </div>

      {/* ---- timeline ---- */}
      <h2 className={s.headline} style={{ fontSize: "1.4rem", marginTop: "2.4rem" }}>Process &amp; timeline</h2>
      <ol style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.7rem", listStyle: "none", padding: 0, margin: "1rem 0 0" }}>
        {["Discovery", "Engineering review", "Fabrication readiness", "Deployment", "Go-live & support"].map((t, i) => (
          <li key={t} className={s.docBand} style={{ padding: "0.9rem 1rem" }}>
            <span className={s.stepNo} style={{ background: "var(--brand)", color: "#fff" }}>{String(i + 1).padStart(2, "0")}</span>
            <p style={{ fontWeight: 700, fontSize: 14, marginTop: 8 }}>{t}</p>
          </li>
        ))}
      </ol>
      <p className={s.help} style={{ marginTop: 8 }}>Schedule targets are confirmed in the executed agreement.</p>

      {/* ---- terms ---- */}
      <h2 className={s.headline} style={{ fontSize: "1.4rem", marginTop: "2.4rem" }}>Terms &amp; acceptance</h2>
      <p className={s.help} style={{ marginTop: "0.8rem", lineHeight: 1.65, fontSize: 13, borderLeft: "2px solid var(--edge-bright)", paddingLeft: 12, maxWidth: "80ch" }}>
        Preliminary configuration estimate prepared for {d.clientName}. Not a quote, offer, or contract. Final pricing, schedule, performance and scope remain subject to engineering review, site validation, equipment availability, applicable taxes, freight, permitting requirements and the executed agreement. This document is confidential and intended solely for the recipient organization.
      </p>
      {d.signedAt && (
        <p className={`${s.chip} ${s.chipOk}`} style={{ marginTop: "1rem" }}><CheckCircle2 size={12} aria-hidden /> Accepted by {d.signerName} on {fmtDate(d.signedAt)}</p>
      )}
      <p className={s.label} style={{ marginTop: "2rem", textAlign: "center" }}>Confidential — prepared for {d.company ?? d.clientName} · {d.estimateNo} · v{d.rev}</p>
    </article>
  );
}

function Metric({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className={s.metric}>
      <span className={s.iconTile}>{icon}</span>
      <div>
        <p className={s.label}>{label}</p>
        <p className={s.metricValue} style={{ fontSize: "1.25rem" }}>{value}</p>
        <p className={s.help} style={{ marginTop: 0 }}>{sub}</p>
      </div>
    </div>
  );
}
