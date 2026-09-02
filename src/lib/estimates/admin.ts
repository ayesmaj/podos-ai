/**
 * admin.ts — staff-side estimate operations.
 *
 * Every function here requires the admin secret, which is checked inside the
 * database (estimate_admin_config), not in the app. The secret never reaches
 * the browser: these run only from server components and server actions.
 */

if (typeof window !== "undefined") {
  throw new Error("src/lib/estimates/admin.ts is server-only");
}

const URL_BASE =
  process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
const ANON_KEY =
  process.env.PODOS_SUPABASE_ANON_KEY ?? "sb_publishable_1W4q68h6ES47vNdJZVsq7g_p88eLPi5";

export const ADMIN_SECRET = process.env.PODOS_ADMIN_SECRET ?? "";

export interface EstimateRow {
  public_id: string;
  estimate_no: string;
  client_name: string;
  company: string | null;
  project_name: string | null;
  status: string;
  view_count: number;
  one_time_low_cents: number;
  one_time_high_cents: number;
  recurring_cents: number;
  first_viewed_at: string | null;
  last_viewed_at: string | null;
  signed_at: string | null;
  signer_name: string | null;
  expires_at: string | null;
  revoked: boolean;
  created_at: string;
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[estimates/admin] ${fn} -> ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[estimates/admin] ${fn} threw:`, err instanceof Error ? err.message : "unknown");
    return null;
  }
}

export const listEstimates = (secret: string) =>
  rpc<EstimateRow[]>("list_estimates", { p_admin_secret: secret });

export const rotateToken = (secret: string, estimateNo: string) =>
  rpc<string>("rotate_estimate_token", { p_admin_secret: secret, p_estimate_no: estimateNo });

export const revokeEstimate = (secret: string, estimateNo: string) =>
  rpc<boolean>("revoke_estimate", { p_admin_secret: secret, p_estimate_no: estimateNo });

export const createEstimate = (secret: string, i: {
  clientName: string; projectName?: string; company?: string;
  lowCents?: number; highCents?: number; recurringCents?: number; expiresDays?: number;
}) =>
  rpc<{ estimate_no: string; token: string }[]>("create_estimate", {
    p_admin_secret: secret,
    p_client_name: i.clientName,
    p_project_name: i.projectName ?? null,
    p_company: i.company ?? null,
    p_client_email: null,
    p_config: {},
    p_line_items: [],
    p_low_cents: i.lowCents ?? 0,
    p_high_cents: i.highCents ?? 0,
    p_recurring: i.recurringCents ?? 0,
    p_expires_days: i.expiresDays ?? 30,
  });

export const usd = (c: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(c / 100);

/** Cookie holding the opaque admin session token (never the secret itself). */
export const ADMIN_COOKIE = "podos_admin_session";

export async function adminLogin(secret: string, userAgent?: string): Promise<string | null> {
  const tok = await rpc<string>("admin_login", { p_secret: secret, p_user_agent: userAgent ?? null });
  return typeof tok === "string" && tok.length === 64 ? tok : null;
}

export async function adminSessionValid(sessionToken: string): Promise<boolean> {
  if (!/^[a-f0-9]{64}$/.test(sessionToken)) return false;
  const ok = await rpc<boolean>("admin_session_valid", { p_session: sessionToken });
  return ok === true;
}

export async function adminLogout(sessionToken: string): Promise<void> {
  await rpc<boolean>("admin_logout", { p_session: sessionToken });
}

export async function adminRateCheck(bucket: string, key: string, max: number, windowSeconds: number): Promise<boolean> {
  const ok = await rpc<boolean>("rate_check", { p_bucket: bucket, p_key: key, p_max: max, p_window_seconds: windowSeconds });
  return ok === true; // fail closed
}

export interface InvitationRow {
  invitation_id: string;
  recipient_email: string;
  recipient_name: string | null;
  access_policy: "otp" | "email-confirm";
  issued_at: string;
  expires_at: string;
  revoked: boolean;
  exchanged_at: string | null;
  sessions: number;
  last_seen: string | null;
}

export const listInvitations = (secret: string, estimateNo: string) =>
  rpc<InvitationRow[]>("list_invitations", { p_admin_secret: secret, p_estimate_no: estimateNo });

export const createInvitation = (secret: string, i: {
  estimateNo: string; email: string; name?: string;
  policy?: "otp" | "email-confirm"; expiresDays?: number;
}) =>
  rpc<{ invitation_id: string; token: string }[]>("create_invitation", {
    p_admin_secret: secret,
    p_estimate_no: i.estimateNo,
    p_recipient_email: i.email,
    p_recipient_name: i.name ?? null,
    p_access_policy: i.policy ?? "email-confirm",
    p_expires_days: i.expiresDays ?? 14,
  });

export const revokeInvitation = (secret: string, invitationId: string) =>
  rpc<boolean>("revoke_invitation", { p_admin_secret: secret, p_invitation_id: invitationId });

/* ---------------------------------------------------------------------------
 * /ops application (Phase 2+) — dashboard, clients, projects, proposal editor.
 * All gated by the same admin secret, checked inside the database.
 * ------------------------------------------------------------------------- */

export const opsDashboard = (secret: string) =>
  rpc<Record<string, unknown>>("ops_dashboard", { p_admin_secret: secret });

export const listOrganizations = (secret: string) =>
  rpc<OrganizationRow[]>("list_organizations", { p_admin_secret: secret });

export const getOrganization = (secret: string, orgId: string) =>
  rpc<Record<string, unknown>>("get_organization", { p_admin_secret: secret, p_org_id: orgId });

export const createOrganization = (secret: string, name: string, website?: string, notes?: string) =>
  rpc<string>("create_organization", { p_admin_secret: secret, p_name: name, p_website: website ?? null, p_notes: notes ?? null });

export const createContact = (secret: string, i: {
  orgId: string; first: string; last?: string; title?: string; email?: string; phone?: string; roles?: string[];
}) =>
  rpc<string>("create_contact", {
    p_admin_secret: secret, p_org_id: i.orgId, p_first: i.first, p_last: i.last ?? null,
    p_title: i.title ?? null, p_email: i.email ?? null, p_phone: i.phone ?? null,
    p_roles: i.roles ?? ["commercial"],
  });

export const addOrgNote = (secret: string, orgId: string, body: string) =>
  rpc<boolean>("add_org_note", { p_admin_secret: secret, p_org_id: orgId, p_body: body });

export const listProjects = (secret: string) =>
  rpc<ProjectRow[]>("list_projects", { p_admin_secret: secret });

export const createProject = (secret: string, i: {
  orgId: string; name: string; description?: string; pods?: number; capacityMw?: number; golive?: string;
}) =>
  rpc<string>("create_project", {
    p_admin_secret: secret, p_org_id: i.orgId, p_name: i.name, p_description: i.description ?? null,
    p_pods: i.pods ?? null, p_capacity_mw: i.capacityMw ?? null, p_golive: i.golive ?? null,
  });

export const getProposalFull = (secret: string, publicId: string) =>
  rpc<Record<string, unknown>>("get_proposal_full", { p_admin_secret: secret, p_public_id: publicId });

export const upsertLineItem = (secret: string, i: {
  publicId: string; itemId?: string | null; name?: string; customerDescription?: string;
  categorySlug?: string; qty?: number; unit?: string; unitPriceCents?: number;
  optional?: boolean; recurring?: boolean; pendingReview?: boolean;
}) =>
  rpc<string>("upsert_line_item", {
    p_admin_secret: secret, p_public_id: i.publicId, p_item_id: i.itemId ?? null,
    p_name: i.name ?? null, p_customer_description: i.customerDescription ?? null,
    p_category_slug: i.categorySlug ?? null, p_qty: i.qty ?? 1, p_unit: i.unit ?? "pod",
    p_unit_price_cents: i.unitPriceCents ?? 0, p_optional: i.optional ?? false,
    p_recurring: i.recurring ?? false, p_pending_review: i.pendingReview ?? false,
  });

export const deleteLineItem = (secret: string, publicId: string, itemId: string) =>
  rpc<boolean>("delete_line_item", { p_admin_secret: secret, p_public_id: publicId, p_item_id: itemId });

export const addCatalogLineItem = (secret: string, publicId: string, sku: string) =>
  rpc<string>("add_catalog_line_item", { p_admin_secret: secret, p_public_id: publicId, p_sku: sku });

export const listCatalog = (secret: string) =>
  rpc<CatalogItemRow[]>("list_catalog", { p_admin_secret: secret });

export interface OrganizationRow {
  id: string; name: string; website: string | null; notes: string | null;
  contacts: number; proposals: number; open_value_cents: number;
}
export interface ProjectRow {
  id: string; name: string; description: string | null;
  org_id: string | null; org_name: string | null;
  pod_quantity: number | null; required_capacity_mw: number | null;
  target_golive: string | null; proposals: number;
}
export interface CatalogItemRow {
  category: string | null; sku: string; name: string; short_description: string | null;
  price_mode: string; price_cents: number | null; billing_frequency: string;
  needs_business_verification: boolean; published: boolean;
}
export interface LineItemRow {
  id: string; name: string; customer_description: string | null; category_slug: string | null;
  qty: number; unit: string | null; unit_price_cents: number;
  optional: boolean; selected: boolean; recurring: boolean; pending_review: boolean;
  client_visible: boolean; sort_order: number;
}
