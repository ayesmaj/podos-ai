/**
 * types.ts — the one document model every proposal surface renders from
 * (paginated print/PDF, admin preview, client viewer). Built by document.ts
 * from either payload shape; validated by validate.ts.
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
