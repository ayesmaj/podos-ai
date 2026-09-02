import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

/**
 * ProposalPdf — the branded PDF, rendered server-side by @react-pdf/renderer
 * from the SAME structured proposal data as the web view (master brief 15/26:
 * a real renderer with deterministic pagination, never a browser screenshot).
 *
 * Every page carries the running footer (proposal number, version,
 * confidentiality, page x of y) and the dynamic watermark
 * CONFIDENTIAL — PREPARED FOR [COMPANY] — [EMAIL]. Money arrives already
 * computed in cents; this file only formats.
 */

export interface PdfLine { name: string; qty: number; unit_price_cents: number; recurring: boolean; pending_review?: boolean; }
export interface PdfData {
  estimate_no: string;
  rev: number;
  client_name: string;
  company: string | null;
  project_name: string | null;
  viewer_email: string;
  status: string;
  one_time_low_cents: number;
  one_time_high_cents: number;
  recurring_cents: number;
  line_items: PdfLine[];
  issued: string;
  expires: string | null;
}

const usd = (c: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(c / 100);

const INK = "#0F172A", DIM = "#475569", FAINT = "#94A3B8";
const BRAND = "#1D4ED8", EDGE = "#E2E8F0", PAPER = "#FFFFFF";

const s = StyleSheet.create({
  page: { paddingTop: 54, paddingBottom: 64, paddingHorizontal: 54, fontSize: 10, color: INK, backgroundColor: PAPER, fontFamily: "Helvetica" },
  watermark: { position: "absolute", bottom: 30, left: 54, right: 54, fontSize: 7, color: FAINT, letterSpacing: 1 },
  footer: { position: "absolute", bottom: 30, right: 54, fontSize: 7, color: FAINT },
  brandRow: { flexDirection: "row", alignItems: "baseline", gap: 6, marginBottom: 4 },
  brand: { fontSize: 18, fontFamily: "Helvetica-Bold", letterSpacing: -0.5, color: INK },
  kicker: { fontSize: 8, letterSpacing: 2, color: BRAND, textTransform: "uppercase" },
  h1: { fontSize: 26, fontFamily: "Helvetica-Bold", letterSpacing: -1, marginTop: 24, color: INK },
  h2: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 22, marginBottom: 8, color: INK },
  meta: { fontSize: 9, color: DIM, marginTop: 3 },
  bigPrice: { fontSize: 28, fontFamily: "Helvetica-Bold", letterSpacing: -1, marginTop: 6, color: INK },
  label: { fontSize: 8, letterSpacing: 1.5, color: FAINT, textTransform: "uppercase" },
  row: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: EDGE, paddingVertical: 5 },
  cellName: { flex: 1, fontSize: 10, color: INK },
  cellAmt: { fontSize: 10, color: INK, fontFamily: "Helvetica-Bold" },
  disclaimer: { fontSize: 8.5, color: FAINT, lineHeight: 1.5, marginTop: 18, borderLeftWidth: 2, borderLeftColor: EDGE, paddingLeft: 8 },
  card: { borderWidth: 1, borderColor: EDGE, borderRadius: 8, padding: 14, marginTop: 10 },
  sigLine: { borderTopWidth: 1, borderTopColor: INK, marginTop: 40, width: 240, paddingTop: 4, fontSize: 8, color: FAINT },
});

function Chrome({ data }: { data: PdfData }) {
  const mark = `CONFIDENTIAL — PREPARED FOR ${(data.company ?? data.client_name).toUpperCase()} — ${data.viewer_email.toUpperCase()}`;
  return (
    <>
      <Text style={s.watermark} fixed>{mark}</Text>
      <Text style={s.footer} fixed render={({ pageNumber, totalPages }) => `${data.estimate_no} · v${data.rev} · Page ${pageNumber} of ${totalPages}`} />
    </>
  );
}

export function ProposalPdf({ data }: { data: PdfData }) {
  const oneTime = data.line_items.filter((l) => !l.recurring);
  const recurring = data.line_items.filter((l) => l.recurring);

  return (
    <Document title={`${data.estimate_no} — PODOS proposal`} author="PODOS AI">
      {/* Cover */}
      <Page size="A4" style={s.page}>
        <Chrome data={data} />
        <View style={s.brandRow}>
          <Text style={s.brand}>PODOS</Text>
          <Text style={s.kicker}>Preliminary Configuration Estimate</Text>
        </View>
        <Text style={s.h1}>{data.project_name ?? "PODOS deployment proposal"}</Text>
        <Text style={s.meta}>Prepared for {data.client_name}{data.company ? ` · ${data.company}` : ""}</Text>
        <Text style={s.meta}>Recipient: {data.viewer_email}</Text>

        <View style={s.card}>
          <Text style={s.label}>Preliminary one-time estimate</Text>
          <Text style={s.bigPrice}>{usd(data.one_time_low_cents)} – {usd(data.one_time_high_cents)}</Text>
          {data.recurring_cents > 0 && <Text style={s.meta}>+ {usd(data.recurring_cents)} / year support</Text>}
        </View>

        <View style={{ flexDirection: "row", gap: 24, marginTop: 20 }}>
          <View><Text style={s.label}>Proposal no.</Text><Text style={s.meta}>{data.estimate_no}</Text></View>
          <View><Text style={s.label}>Version</Text><Text style={s.meta}>v{data.rev}</Text></View>
          <View><Text style={s.label}>Issued</Text><Text style={s.meta}>{data.issued}</Text></View>
          {data.expires && <View><Text style={s.label}>Valid until</Text><Text style={s.meta}>{data.expires}</Text></View>}
        </View>

        <Text style={s.disclaimer}>
          Conceptual visualization and preliminary configuration estimate prepared for {data.client_name}.
          Not a quote, offer, or contract. Final pricing, schedule, performance and scope remain subject to
          engineering review, site validation, equipment availability, applicable taxes, freight, permitting
          requirements and the executed agreement.
        </Text>
      </Page>

      {/* Configuration & pricing */}
      <Page size="A4" style={s.page}>
        <Chrome data={data} />
        <Text style={s.kicker}>Configuration & pricing</Text>
        <Text style={s.h2}>Itemized scope</Text>
        {oneTime.length === 0 ? (
          <Text style={s.meta}>Line items are finalized with PODOS during configuration.</Text>
        ) : oneTime.map((l, i) => (
          <View key={i} style={s.row}>
            <Text style={s.cellName}>{l.name}{l.qty > 1 ? `  ×${l.qty}` : ""}{l.pending_review ? "  (pending review)" : ""}</Text>
            <Text style={s.cellAmt}>{l.pending_review ? "Review" : usd(Math.round(l.qty * l.unit_price_cents))}</Text>
          </View>
        ))}
        <View style={[s.row, { borderTopWidth: 2, borderTopColor: INK, marginTop: 4 }]}>
          <Text style={[s.cellName, { fontFamily: "Helvetica-Bold" }]}>Preliminary one-time range</Text>
          <Text style={s.cellAmt}>{usd(data.one_time_low_cents)} – {usd(data.one_time_high_cents)}</Text>
        </View>

        {recurring.length > 0 && (
          <>
            <Text style={s.h2}>Recurring support</Text>
            {recurring.map((l, i) => (
              <View key={i} style={s.row}>
                <Text style={s.cellName}>{l.name}</Text>
                <Text style={s.cellAmt}>{usd(Math.round(l.qty * l.unit_price_cents))} / yr</Text>
              </View>
            ))}
          </>
        )}

        <Text style={s.h2}>Assumptions & exclusions</Text>
        <Text style={s.disclaimer}>
          Pricing assumes standard site conditions and equipment availability at time of order. Taxes,
          duties, freight beyond the quoted zone, permitting, civil works, and utility interconnection
          are excluded unless explicitly itemized. Non-standard requirements marked “pending review” are
          confirmed by PODOS engineering before release of a formal proposal.
        </Text>
      </Page>

      {/* Acceptance */}
      <Page size="A4" style={s.page}>
        <Chrome data={data} />
        <Text style={s.kicker}>Acceptance</Text>
        <Text style={s.h2}>Next steps</Text>
        <Text style={[s.meta, { lineHeight: 1.6 }]}>
          To proceed, acknowledge this preliminary estimate in your secure PODOS workspace or contact your
          PODOS representative. A formal proposal follows engineering and commercial review.
        </Text>
        <Text style={s.sigLine}>Authorized signature</Text>
        <Text style={[s.sigLine, { marginTop: 30 }]}>Name & title</Text>
        <Text style={[s.sigLine, { marginTop: 30 }]}>Date</Text>
        <Text style={s.disclaimer}>
          This document is confidential and prepared solely for {data.company ?? data.client_name}. It may
          not be shared outside the recipient organization without written consent from PODOS AI.
        </Text>
      </Page>
    </Document>
  );
}
