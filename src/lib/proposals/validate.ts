import type { DocData } from "@/lib/proposals/types";

/**
 * validate.ts — release gate for the proposal document (redesign brief §19).
 *
 * Pure function over the same DocData the document renders from, so the
 * formal print route, the release action and the admin editor all agree on
 * what "releasable" means. Errors block release/formal rendering; warnings
 * are shown to the admin but do not block.
 *
 * Nothing here mutates data. `maskForPreview` returns a COPY with flagged
 * placeholder text replaced by "Pending engineering review" so a design
 * preview can show real numbers without printing junk like "gsg".
 */

export interface Issue { code: string; field: string; message: string }
export interface ValidationResult { ok: boolean; errors: Issue[]; warnings: Issue[] }

export interface ValidationContext {
  mode?: "client_configured" | "admin_built";
  /** client mode: has the client submitted their configuration? */
  submitted?: boolean;
  /** raw step payloads (client mode) — used to detect unfinished steps */
  selections?: Record<string, Record<string, unknown>>;
  requiredSteps?: string[];
}

const PLACEHOLDER_WORDS = new Set(["tbd", "tba", "test", "testing", "asdf", "qwerty", "n/a", "na", "none", "xxx", "lorem", "ipsum", "placeholder", "sample", "demo", "todo", "fff", "ggg", "sss", "aaa"]);
const INTERNAL_MARKERS = /\b(internal|cost basis|cogs|margin|markup|pending[_ ]review|do not send|draft only|vendor price)\b/i;
const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;

/** True when free text is obviously not a real value (too short, no vowels, repeated chars, blocklisted). */
export function isPlaceholderText(v: unknown): boolean {
  if (typeof v !== "string") return false;
  const t = v.trim();
  if (!t) return true;
  const lower = t.toLowerCase();
  if (PLACEHOLDER_WORDS.has(lower)) return true;
  const letters = lower.replace(/[^a-z]/g, "");
  if (letters.length > 0 && letters.length < 3) return true;
  if (letters.length >= 3 && /^(.)\1+$/.test(letters)) return true;
  if (letters.length >= 3 && !/[aeiouy]/.test(letters)) return true;
  if (/^[^a-z0-9]*$/i.test(t)) return true;
  return false;
}

const isLower = (v: string | null | undefined) => !!v && v.trim().length > 0 && v === v.toLowerCase() && /[a-z]/.test(v);
const validDate = (v: string | null | undefined) => !!v && !Number.isNaN(new Date(v).getTime());

export function validateProposalForRelease(d: DocData, ctx: ValidationContext = {}): ValidationResult {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const err = (code: string, field: string, message: string) => errors.push({ code, field, message });
  const warn = (code: string, field: string, message: string) => warnings.push({ code, field, message });

  /* identity */
  if (!PUBLIC_ID_RE.test(d.publicId)) err("missing_number", "publicId", "Proposal number is missing or malformed.");
  if (!d.estimateNo?.trim()) err("missing_number", "estimateNo", "Internal estimate number is missing.");
  if (!d.clientName?.trim() || isPlaceholderText(d.clientName)) err("missing_client", "clientName", "Client contact name is missing or a placeholder.");
  if (!d.company?.trim() || isPlaceholderText(d.company)) err("missing_company", "company", "Client company is missing or a placeholder.");
  if (!d.project?.trim() || isPlaceholderText(d.project)) err("missing_project", "project", "Project name is missing or a placeholder.");
  if (isLower(d.clientName)) warn("lowercase_name", "clientName", "Client name is all lowercase — it will be rendered in proper case.");
  if (isLower(d.company)) warn("lowercase_name", "company", "Company name is all lowercase — it will be rendered in proper case.");

  /* dates */
  if (!validDate(d.issued)) err("bad_date", "issued", "Issue date is malformed.");
  if (d.expires && !validDate(d.expires)) err("bad_date", "expires", "Validity date is malformed.");
  else if (d.expires) {
    const days = (new Date(d.expires).getTime() - Date.now()) / 86_400_000;
    if (days < 0) err("expired", "expires", "Validity date is in the past.");
    else if (days < 7) warn("expiring_soon", "expires", `Proposal validity ends in ${Math.ceil(days)} day(s).`);
  } else warn("no_validity", "expires", "No validity date — the document will show 30 days from issue.");

  /* configuration */
  const s = d.spec;
  if (s.pods == null) err("missing_pods", "spec.pods", "Pod quantity is missing.");
  else if (!Number.isInteger(s.pods) || s.pods < 1 || s.pods > 500) err("invalid_pods", "spec.pods", `Pod quantity ${s.pods} is out of range (1–500).`);
  if (s.capacity_mw == null) warn("missing_capacity", "spec.capacity_mw", "Required capacity (MW) is not set.");
  else if (!(s.capacity_mw > 0 && s.capacity_mw <= 1000)) err("invalid_capacity", "spec.capacity_mw", `Required capacity ${s.capacity_mw} MW is not credible (0–1000 MW).`);
  if (s.gpus != null && (!Number.isInteger(s.gpus) || s.gpus < 0 || s.gpus > 1_000_000)) err("invalid_gpus", "spec.gpus", `GPU count ${s.gpus} is out of range.`);
  if (s.site && isPlaceholderText(s.site)) err("placeholder_site", "spec.site", `Site "${s.site}" looks like a placeholder.`);
  if (!s.site) warn("missing_site", "spec.site", "No site name or address — the document will read \"Site to be confirmed\".");
  if (s.workload && isPlaceholderText(s.workload)) err("placeholder_workload", "spec.workload", `Workload "${s.workload}" looks like a placeholder.`);
  if (!s.golive) warn("missing_golive", "spec.golive", "No target go-live — the timeline will show relative weeks only.");

  /* client-mode completeness */
  if (ctx.mode === "client_configured") {
    if (ctx.submitted === false) err("not_submitted", "status", "The client has not submitted their configuration yet.");
    if (ctx.selections && ctx.requiredSteps) {
      const missing = ctx.requiredSteps.filter((step) => !ctx.selections![step] || Object.keys(ctx.selections![step]).length === 0);
      if (missing.length) err("pending_selections", "selections", `Unfinished configuration steps: ${missing.join(", ")}.`);
    }
  }

  /* commercial */
  const visible = d.lineItems;
  if (visible.length === 0) err("no_items", "lineItems", "There are no client-visible line items.");
  const priced = visible.filter((l) => l.unit_price_cents > 0);
  if (visible.length > 0 && priced.length === 0) err("no_price", "lineItems", "No line item carries a price.");
  for (const l of visible) {
    if (!l.name?.trim() || isPlaceholderText(l.name)) err("placeholder_item", "lineItems", `Line item name "${l.name}" is a placeholder.`);
    if (INTERNAL_MARKERS.test(l.name) || INTERNAL_MARKERS.test(l.customer_description ?? "")) err("internal_leak", "lineItems", `"${l.name}" contains internal wording that must not reach the client.`);
    if (l.pending_review) err("pending_price", "lineItems", `"${l.name}" is still marked pending — confirm its price first.`);
    if (l.qty <= 0) err("invalid_qty", "lineItems", `"${l.name}" has quantity ${l.qty}.`);
  }
  if (d.lowCents < 0 || d.highCents < 0 || d.lowCents > d.highCents) err("totals_invalid", "totals", "Estimate range is inverted or negative.");
  // optional items count only while the client has selected them (same rule as _recompute_totals)
  const counted = (l: DocData["lineItems"][number]) => !l.optional || l.selected !== false;
  const oneTime = visible.filter((l) => !l.recurring && counted(l)).reduce((a, l) => a + l.extended_cents, 0);
  const recurring = visible.filter((l) => l.recurring && counted(l)).reduce((a, l) => a + l.extended_cents, 0);
  // totals come from the server snapshot; the visible items must sit inside the published range
  if (visible.length && !(oneTime >= d.lowCents - 1 && oneTime <= d.highCents + 1) && !(d.lowCents === 0 && d.highCents === 0))
    err("totals_mismatch", "totals", `Visible one-time items sum to ${oneTime} cents, outside the published range ${d.lowCents}–${d.highCents}.`);
  if (Math.abs(recurring - d.recurringCents) > 1 && d.recurringCents !== 0)
    warn("recurring_mismatch", "totals", "Recurring items do not sum to the published recurring total.");
  if (d.lowCents === 0 && d.highCents === 0 && priced.length) err("totals_zero", "totals", "Published total is zero while items carry prices — recompute before release.");

  return { ok: errors.length === 0, errors, warnings };
}

export const PREVIEW_MASK = "Pending engineering review";

/** Proper-case an all-lowercase person/company name for display (data untouched). */
export function displayName(v: string | null | undefined): string {
  if (!v) return "";
  if (!isLower(v)) return v;
  return v.replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

/** Copy of the document with flagged placeholder text masked — for design preview only, never for release. */
export function maskForPreview(d: DocData): DocData {
  const m = (v: string | null | undefined) => (v && isPlaceholderText(v) ? PREVIEW_MASK : v ?? null);
  const s = d.spec;
  return {
    ...d,
    clientName: displayName(m(d.clientName) ?? ""),
    company: displayName(m(d.company)),
    project: m(d.project),
    spec: {
      ...s,
      site: m(s.site) ?? undefined,
      workload: m(s.workload) ?? undefined,
      capacity_mw: s.capacity_mw != null && s.capacity_mw > 0 && s.capacity_mw <= 1000 ? s.capacity_mw : undefined,
      gpus: s.gpus != null && s.gpus >= 0 && s.gpus <= 1_000_000 ? s.gpus : undefined,
    },
    lineItems: d.lineItems.map((l) => ({ ...l, name: m(l.name) ?? l.name, customer_description: m(l.customer_description) })),
  };
}
