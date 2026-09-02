#!/usr/bin/env node
/**
 * Temporary, clearly-labelled QA records for /ops visual review — created and
 * removed through the app's own database functions (no fake data left behind).
 *
 *   node --env-file=.env.local scripts/ops-qa-seed.mjs seed    # creates "PODOS internal QA — delete me"
 *   node --env-file=.env.local scripts/ops-qa-seed.mjs clean   # force-deletes that client and everything under it
 */
const [cmd = "seed"] = process.argv.slice(2);
const SUPA = process.env.PODOS_SUPABASE_URL ?? "https://buqghwxjjksqperiamag.supabase.co";
const ANON = process.env.PODOS_SUPABASE_ANON_KEY ?? "";
const SECRET = process.env.PODOS_ADMIN_SECRET ?? "";
if (!SECRET || !ANON) { console.error("run with node --env-file=.env.local"); process.exit(1); }
const NAME = "PODOS internal QA — delete me";

async function rpc(fn, args) {
  const res = await fetch(`${SUPA}/rest/v1/rpc/${fn}`, { method: "POST", headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, "Content-Type": "application/json" }, body: JSON.stringify({ p_admin_secret: SECRET, ...args }) });
  const text = await res.text();
  if (!res.ok) throw new Error(`${fn}: ${res.status} ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
}

const orgs = await rpc("list_organizations", {});
const existing = (orgs ?? []).find((o) => o.name === NAME);

if (cmd === "clean") {
  if (!existing) { console.log("nothing to clean"); process.exit(0); }
  await rpc("delete_organization", { p_org_id: existing.id, p_force: true });
  console.log("removed", NAME);
  process.exit(0);
}

if (existing) { console.log("already seeded:", existing.id); process.exit(0); }
const orgId = await rpc("create_organization", { p_name: NAME, p_website: "https://www.podosai.com", p_notes: "Temporary record for design QA. Safe to delete." });
const contactId = await rpc("create_contact", { p_org_id: orgId, p_first: "QA", p_last: "Reviewer", p_title: "Engineering lead", p_email: "qa-reviewer@podosai.com", p_phone: null, p_roles: ["technical", "signer"] });
const projectId = await rpc("create_project", { p_org_id: orgId, p_name: "QA pilot deployment", p_description: "Temporary project for design QA", p_pods: 2, p_capacity_mw: 2.0, p_golive: "2026-12-01" });
const [p1] = await rpc("create_proposal", { p_org_id: orgId, p_project_id: projectId, p_contact_id: contactId, p_expires_days: 30, p_mode: "admin_built" });
const [p2] = await rpc("create_proposal", { p_org_id: orgId, p_project_id: projectId, p_contact_id: contactId, p_expires_days: 45, p_mode: "client_configured" });
const catalog = (await rpc("list_catalog", {})) ?? [];
const skus = catalog.filter((c) => c.sku && c.client_visible && c.price_cents > 0).slice(0, 5).map((c) => c.sku);
for (const sku of skus) await rpc("add_catalog_line_item", { p_public_id: p1.public_id, p_sku: sku });
console.log(JSON.stringify({ orgId, contactId, projectId, proposals: [p1.public_id, p2.public_id], items: skus.length }, null, 2));
