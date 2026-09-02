import { Document, Page, Text, View, Image, StyleSheet, Svg, Line } from "@react-pdf/renderer";
import type { DocData, DocLine } from "@/components/private/ProposalDocument";

/**
 * ProposalPdf — the premium PODOS proposal PDF (redesign brief §19–§20).
 * Six pages from the SAME DocData as the web document: cover + executive
 * summary · configuration summary · scope & deliverables · commercial
 * summary · process & timeline · terms + signature. Bright white base,
 * blue-gray bands, cobalt accents, subtle blueprint lines, running header
 * and footer with the confidentiality watermark. Rendered server-side by
 * @react-pdf/renderer; it only FORMATS numbers that the database computed.
 */

export interface PdfData extends DocData {
  logo: string;          // PNG data URI (wordmark)
  pod?: string | null;   // PNG data URI (cover pod illustration) — optional
  viewerEmail: string;   // recipient / ADMIN PREVIEW for the watermark
}

const usd = (c: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(c / 100);
const fmtDate = (d: string | null | undefined) => (d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—");

const INK = "#0F172A", DIM = "#475569", FAINT = "#94A3B8", BRAND = "#1D4ED8", BRAND2 = "#2563EB", CYAN = "#0891B2";
const EDGE = "#E2E8F0", BAND = "#F1F5F9", PAPER = "#FFFFFF", OK = "#15803D", AMBER = "#B45309";

const s = StyleSheet.create({
  page: { paddingTop: 64, paddingBottom: 66, paddingHorizontal: 52, fontSize: 9.5, color: INK, backgroundColor: PAPER, fontFamily: "Helvetica", lineHeight: 1.45 },
  header: { position: "absolute", top: 26, left: 52, right: 52, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerText: { fontSize: 7, color: FAINT, letterSpacing: 1.2, textTransform: "uppercase" },
  footer: { position: "absolute", bottom: 26, left: 52, right: 52, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 6.5, color: FAINT, letterSpacing: 0.8 },
  kicker: { fontSize: 7.5, letterSpacing: 2, color: BRAND, textTransform: "uppercase", fontFamily: "Helvetica-Bold" },
  h1: { fontSize: 28, fontFamily: "Helvetica-Bold", letterSpacing: -1, lineHeight: 1.05, color: INK },
  h2: { fontSize: 18, fontFamily: "Helvetica-Bold", letterSpacing: -0.6, color: INK, marginBottom: 8 },
  h3: { fontSize: 11, fontFamily: "Helvetica-Bold", color: INK },
  body: { fontSize: 9.5, color: DIM, lineHeight: 1.5 },
  small: { fontSize: 8, color: FAINT, lineHeight: 1.5 },
  label: { fontSize: 6.8, letterSpacing: 1.4, color: FAINT, textTransform: "uppercase" },
  band: { backgroundColor: BAND, borderRadius: 8, padding: 14, borderWidth: 1, borderColor: EDGE },
  card: { borderWidth: 1, borderColor: EDGE, borderRadius: 8, padding: 12, backgroundColor: PAPER },
  row: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: EDGE, paddingVertical: 6 },
  cellName: { flex: 1, fontSize: 9.5, color: INK, paddingRight: 8 },
  cellAmt: { fontSize: 9.5, color: INK, fontFamily: "Helvetica-Bold" },
  big: { fontSize: 22, fontFamily: "Helvetica-Bold", letterSpacing: -0.8, color: INK },
  metric: { flex: 1, borderWidth: 1, borderColor: EDGE, borderRadius: 8, padding: 10, backgroundColor: PAPER },
  rule: { height: 2, width: 40, backgroundColor: BRAND2, borderRadius: 1, marginTop: 10, marginBottom: 12 },
  sigLine: { borderTopWidth: 1, borderTopColor: INK, width: 220, paddingTop: 4, fontSize: 7.5, color: FAINT },
  chipOk: { fontSize: 6.5, color: OK, letterSpacing: 1, textTransform: "uppercase" },
  chipAmber: { fontSize: 6.5, color: AMBER, letterSpacing: 1, textTransform: "uppercase" },
});

const CATEGORY_LABEL: Record<string, string> = {
  platform: "PODOS Platform", compute: "Compute", cooling: "Cooling", power: "Power & Electrical",
  network: "Network & Storage", deployment: "Deployment & Site", support: "Warranty & Support", custom: "Custom items",
};

/** Faint blueprint grid — the technical atmosphere layer, subordinate to content. */
function Grid() {
  // react-pdf lays an Svg out IN FLOW (it ignored position:absolute on the Svg
  // itself and consumed the whole page) — so the grid lives inside a fixed,
  // absolutely positioned View, sized to the A4 page in points.
  const lines: React.ReactElement[] = [];
  for (let x = 0; x <= 595; x += 40) lines.push(<Line key={`v${x}`} x1={x} y1={0} x2={x} y2={842} stroke="#2563EB" strokeWidth={0.4} strokeOpacity={0.08} />);
  for (let y = 0; y <= 842; y += 40) lines.push(<Line key={`h${y}`} x1={0} y1={y} x2={595} y2={y} stroke="#2563EB" strokeWidth={0.4} strokeOpacity={0.08} />);
  return (
    <View fixed style={{ position: "absolute", top: 0, left: 0, width: 595, height: 842 }}>
      <Svg width={595} height={842} viewBox="0 0 595 842">{lines}</Svg>
    </View>
  );
}

function Chrome({ d, title }: { d: PdfData; title: string }) {
  const mark = `CONFIDENTIAL — PREPARED FOR ${(d.company ?? d.clientName).toUpperCase()} — ${d.viewerEmail.toUpperCase()}`;
  return (
    <>
      <View style={s.header} fixed>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf primitive, not a DOM <img>; has no alt prop */}
        <Image src={d.logo} style={{ width: 90, height: 31 }} />
        <Text style={s.headerText}>{title}</Text>
        <Text style={s.headerText}>{d.estimateNo} · v{d.rev}</Text>
      </View>
      <View style={s.footer} fixed>
        <Text style={s.footerText}>{mark}</Text>
        <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages} · ${fmtDate(d.issued)}`} />
      </View>
    </>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={s.metric}>
      <Text style={s.label}>{label}</Text>
      <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", letterSpacing: -0.4, marginTop: 4, color: INK }}>{value}</Text>
      {sub && <Text style={s.small}>{sub}</Text>}
    </View>
  );
}

export function ProposalPdf({ data: d }: { data: PdfData }) {
  const isPrelim = !["released", "signature_requested", "client_signed", "signed", "countersigned", "completed"].includes(d.status);
  const oneTime = d.lineItems.filter((l) => !l.recurring);
  const recurring = d.lineItems.filter((l) => l.recurring);
  const grouped = new Map<string, DocLine[]>();
  for (const l of oneTime) grouped.set(l.category_slug ?? "custom", [...(grouped.get(l.category_slug ?? "custom") ?? []), l]);
  const subtotal = oneTime.reduce((a, l) => a + l.extended_cents, 0);
  const rangeText = d.highCents > 0 ? `${usd(d.lowCents)} – ${usd(d.highCents)}` : "TBD";
  const docTitle = isPrelim ? "Preliminary Configuration Estimate" : "Proposal";

  return (
    <Document title={`${d.estimateNo} — PODOS ${docTitle}`} author="PODOS AI" subject={d.project ?? "PODOS deployment"}>
      {/* 1 — Cover + executive summary */}
      <Page size="A4" style={s.page}>
        <Grid />
        <Chrome d={d} title={docTitle} />
        <View style={{ flexDirection: "row", gap: 22, alignItems: "flex-start" }}>
          <View style={{ flex: 1.15 }}>
            <Text style={s.kicker}>{docTitle}</Text>
            <Text style={[s.h1, { marginTop: 10 }]}>{d.project ?? "PODOS deployment"}</Text>
            <View style={s.rule} />
            <Text style={s.body}>Modular AI infrastructure solution prepared by PODOS AI.</Text>
            <Text style={[s.kicker, { marginTop: 18 }]}>Prepared for</Text>
            <Text style={[s.h3, { fontSize: 13, marginTop: 3 }]}>{(d.company ?? d.clientName).toUpperCase()}</Text>
            <Text style={s.body}>{d.clientName}{d.contactEmail ? `  ·  ${d.contactEmail}` : ""}</Text>
            <Text style={[s.kicker, { marginTop: 14 }]}>Project reference</Text>
            <Text style={[s.h3, { marginTop: 3 }]}>{d.estimateNo}  <Text style={{ color: FAINT, fontFamily: "Helvetica" }}>· {d.publicId} · v{d.rev}</Text></Text>
            <Text style={s.body}>{fmtDate(d.issued)}{d.expires ? `  ·  valid until ${fmtDate(d.expires)}` : ""}</Text>
          </View>
          <View style={{ flex: 0.85 }}>
            {d.pod ? (
              <View style={{ borderWidth: 1, borderColor: EDGE, borderRadius: 10, backgroundColor: BAND, padding: 8 }}>
                {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf primitive, not a DOM <img>; has no alt prop */}
                <Image src={d.pod} style={{ width: "100%", height: 150, objectFit: "contain" }} />
              </View>
            ) : (
              <View style={[s.band, { height: 166, justifyContent: "center", alignItems: "center" }]}><Text style={s.label}>PODOS modular pod</Text></View>
            )}
          </View>
        </View>

        <View style={[s.band, { marginTop: 22 }]}>
          <Text style={s.kicker}>Executive summary</Text>
          <Text style={[s.body, { marginTop: 6, color: INK }]}>
            PODOS proposes a factory-built modular AI compute deployment for {d.company ?? d.clientName}
            {d.spec.pods ? ` — ${d.spec.pods} pod${d.spec.pods === 1 ? "" : "s"}` : ""}
            {d.spec.workload ? ` for ${d.spec.workload.toLowerCase()} workloads` : ""}
            {d.spec.site ? `, deployed at ${d.spec.site}` : ""}. The configuration reflects the client&apos;s selections and PODOS engineering review; pricing is {isPrelim ? "a preliminary range" : "the proposed commercial scope"} subject to the terms on the final page.
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
          <Metric label="Total capacity" value={d.spec.capacity_mw ? `${d.spec.capacity_mw} MW` : "TBD"} sub="IT load (client target)" />
          <Metric label="Pod count" value={d.spec.pods ? String(d.spec.pods) : "TBD"} sub="PODOS pods" />
          <Metric label="Target go-live" value={d.spec.golive ? fmtDate(d.spec.golive) : "TBD"} sub="client target" />
          <Metric label={isPrelim ? "Estimated range" : "Total investment"} value={rangeText} sub="USD, one-time" />
        </View>
        <Text style={[s.small, { marginTop: 14 }]}>
          Conceptual visualization. Not a quote, offer, or contract — see Terms &amp; acceptance.
        </Text>
      </Page>

      {/* 2 — Configuration summary */}
      <Page size="A4" style={s.page}>
        <Grid />
        <Chrome d={d} title="Configuration summary" />
        <Text style={s.kicker}>02 · Configuration</Text>
        <Text style={[s.h2, { marginTop: 6 }]}>Selected configuration</Text>
        <Text style={s.body}>Each block reflects the option selected in the client workspace and confirmed for this version.</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {d.spec.chosen.length === 0 && <Text style={s.body}>Configuration is finalized with PODOS during review.</Text>}
          {d.spec.chosen.map((c) => (
            <View key={c.step} style={[s.card, { width: "31.5%" }]}>
              <Text style={s.label}>{c.label}</Text>
              <Text style={[s.h3, { marginTop: 4 }]}>{c.name}</Text>
            </View>
          ))}
          {(d.spec.site || d.spec.site_type) && (
            <View style={[s.card, { width: "31.5%" }]}><Text style={s.label}>Deployment site</Text><Text style={[s.h3, { marginTop: 4 }]}>{d.spec.site ?? d.spec.site_type}</Text></View>
          )}
          {d.spec.gpus ? <View style={[s.card, { width: "31.5%" }]}><Text style={s.label}>Expected GPUs</Text><Text style={[s.h3, { marginTop: 4 }]}>{d.spec.gpus}</Text></View> : null}
          {d.spec.workload ? <View style={[s.card, { width: "31.5%" }]}><Text style={s.label}>Workload</Text><Text style={[s.h3, { marginTop: 4 }]}>{d.spec.workload}</Text></View> : null}
        </View>
        <View style={[s.band, { marginTop: 18 }]}>
          <Text style={s.kicker}>Engineering note</Text>
          <Text style={[s.body, { marginTop: 4 }]}>All configurations are validated by PODOS engineering for compatibility, power and thermal envelopes before release. Items marked pending review carry no committed price until validated.</Text>
        </View>
      </Page>

      {/* 3 — Scope & deliverables */}
      <Page size="A4" style={s.page}>
        <Grid />
        <Chrome d={d} title="Scope & deliverables" />
        <Text style={s.kicker}>03 · Scope</Text>
        <Text style={[s.h2, { marginTop: 6 }]}>Scope &amp; deliverables</Text>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          <View style={[s.band, { flex: 1 }]}>
            <Text style={s.kicker}>Included</Text>
            {oneTime.filter((l) => !l.optional).map((l, i) => (
              <Text key={i} style={[s.body, { marginTop: 5, color: INK }]}>•  {l.name}{l.qty > 1 ? `  (×${l.qty})` : ""}{l.pending_review ? "  — pending review" : ""}</Text>
            ))}
            {oneTime.filter((l) => !l.optional).length === 0 && <Text style={[s.small, { marginTop: 6 }]}>Defined with PODOS during review.</Text>}
          </View>
          <View style={[s.band, { flex: 1 }]}>
            <Text style={s.kicker}>Optional</Text>
            {oneTime.filter((l) => l.optional).map((l, i) => <Text key={i} style={[s.body, { marginTop: 5, color: INK }]}>•  {l.name}</Text>)}
            {oneTime.filter((l) => l.optional).length === 0 && <Text style={[s.small, { marginTop: 6 }]}>No optional alternates in this version.</Text>}
            <Text style={[s.kicker, { marginTop: 14 }]}>Recurring</Text>
            {recurring.map((l, i) => <Text key={i} style={[s.body, { marginTop: 5, color: INK }]}>•  {l.name}  —  {usd(l.extended_cents)} / year</Text>)}
            {recurring.length === 0 && <Text style={[s.small, { marginTop: 6 }]}>No recurring services selected.</Text>}
          </View>
        </View>
        <View style={[s.card, { marginTop: 12 }]}>
          <Text style={s.kicker}>Assumptions &amp; dependencies</Text>
          <Text style={[s.body, { marginTop: 5 }]}>
            Standard site conditions and equipment availability at time of order. Utility interconnection, permitting, civil works, taxes, duties and freight beyond the quoted zone are excluded unless itemized. Client provides site access, prepared pad and utility feed per the PODOS site guide; PODOS provides factory-built pods, integration, commissioning and the selected support plan.
          </Text>
        </View>
      </Page>

      {/* 4 — Commercial summary */}
      <Page size="A4" style={s.page}>
        <Grid />
        <Chrome d={d} title="Commercial summary" />
        <Text style={s.kicker}>04 · Commercial</Text>
        <Text style={[s.h2, { marginTop: 6 }]}>Commercial summary</Text>
        {[...grouped.entries()].map(([cat, lines]) => (
          <View key={cat} style={{ marginTop: 10 }}>
            <Text style={s.kicker}>{CATEGORY_LABEL[cat] ?? cat}</Text>
            {lines.map((l, i) => (
              <View key={i} style={[s.row, i === 0 ? { borderTopWidth: 0 } : {}]}>
                <Text style={s.cellName}>{l.name}{l.qty > 1 ? `  ×${l.qty}` : ""}{l.pending_review ? "   (pending review)" : ""}</Text>
                <Text style={s.cellAmt}>{l.pending_review ? "Review" : usd(l.extended_cents)}</Text>
              </View>
            ))}
          </View>
        ))}
        {oneTime.length === 0 && <Text style={[s.body, { marginTop: 10 }]}>Line items are finalized with PODOS during review.</Text>}
        <View style={[s.band, { marginTop: 16, backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" }]}>
          <View style={[s.row, { borderTopWidth: 0 }]}><Text style={s.body}>Subtotal (one-time)</Text><Text style={s.cellAmt}>{usd(subtotal)}</Text></View>
          <View style={s.row}><Text style={[s.h3]}>{isPrelim ? "Preliminary one-time range" : "Total investment"}</Text><Text style={[s.big, { fontSize: 15, color: BRAND }]}>{rangeText}</Text></View>
          {recurring.length > 0 && <View style={s.row}><Text style={s.body}>Recurring support</Text><Text style={s.cellAmt}>{usd(d.recurringCents)} / year</Text></View>}
        </View>
        <Text style={[s.small, { marginTop: 10 }]}>Taxes, duties and freight beyond the quoted zone are excluded. Prices in USD.</Text>
      </Page>

      {/* 5 — Process & timeline */}
      <Page size="A4" style={s.page}>
        <Grid />
        <Chrome d={d} title="Process & timeline" />
        <Text style={s.kicker}>05 · Process</Text>
        <Text style={[s.h2, { marginTop: 6 }]}>From configuration to go-live</Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
          {[["Discovery", "Requirements, site data and objectives captured in the private workspace."],
            ["Engineering review", "PODOS validates compatibility, power and thermal envelopes; pending items resolved."],
            ["Fabrication readiness", "Factory build slot, integration plan and acceptance criteria confirmed."],
            ["Deployment", "Transport, placement and connection at the prepared site."],
            ["Go-live & support", "Commissioning, acceptance testing and the selected support plan."]].map(([t, x], i) => (
            <View key={t} style={[s.card, { flex: 1 }]}>
              <Text style={{ fontSize: 9, color: BRAND, fontFamily: "Helvetica-Bold" }}>{String(i + 1).padStart(2, "0")}</Text>
              <Text style={[s.h3, { fontSize: 9.5, marginTop: 4 }]}>{t}</Text>
              <Text style={[s.small, { marginTop: 4 }]}>{x}</Text>
            </View>
          ))}
        </View>
        <View style={[s.band, { marginTop: 16 }]}>
          <Text style={s.kicker}>Schedule</Text>
          <Text style={[s.body, { marginTop: 4 }]}>{d.spec.golive ? `Client target go-live: ${fmtDate(d.spec.golive)}. ` : ""}Delivery and commissioning dates are confirmed in the executed agreement following engineering review and site validation.</Text>
        </View>
      </Page>

      {/* 6 — Terms + signature */}
      <Page size="A4" style={s.page}>
        <Grid />
        <Chrome d={d} title="Terms & acceptance" />
        <Text style={s.kicker}>06 · Terms</Text>
        <Text style={[s.h2, { marginTop: 6 }]}>Terms &amp; acceptance</Text>
        <Text style={[s.body, { marginTop: 8 }]}>
          Preliminary configuration estimate prepared for {d.clientName}. Not a quote, offer, or contract. Final pricing, schedule, performance and scope remain subject to engineering review, site validation, equipment availability, applicable taxes, freight, permitting requirements and the executed agreement. This document is confidential and intended solely for {d.company ?? d.clientName}; it may not be shared outside the recipient organization without written consent from PODOS AI.
        </Text>
        <Text style={[s.body, { marginTop: 8 }]}>Validity: {d.expires ? `this ${docTitle.toLowerCase()} is valid until ${fmtDate(d.expires)}.` : "validity window to be confirmed with your PODOS representative."}</Text>
        {d.signedAt ? (
          <View style={[s.band, { marginTop: 18, borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" }]}>
            <Text style={s.chipOk}>Accepted</Text>
            <Text style={[s.h3, { marginTop: 4 }]}>{d.signerName}</Text>
            <Text style={s.small}>{fmtDate(d.signedAt)} · recorded against the verified recipient access</Text>
          </View>
        ) : (
          <View style={{ flexDirection: "row", gap: 40, marginTop: 40 }}>
            <View>
              <Text style={s.kicker}>Client</Text>
              <Text style={[s.sigLine, { marginTop: 34 }]}>Authorized signature</Text>
              <Text style={[s.sigLine, { marginTop: 26 }]}>Name &amp; title</Text>
              <Text style={[s.sigLine, { marginTop: 26 }]}>Date</Text>
            </View>
            <View>
              <Text style={s.kicker}>PODOS AI</Text>
              <Text style={[s.sigLine, { marginTop: 34 }]}>Authorized representative</Text>
              <Text style={[s.sigLine, { marginTop: 26 }]}>Name &amp; title</Text>
              <Text style={[s.sigLine, { marginTop: 26 }]}>Date</Text>
            </View>
          </View>
        )}
        <Text style={[s.small, { marginTop: 26, color: CYAN }]}>podosai.com · {d.estimateNo} · v{d.rev} · issued {fmtDate(d.issued)}</Text>
      </Page>
    </Document>
  );
}
