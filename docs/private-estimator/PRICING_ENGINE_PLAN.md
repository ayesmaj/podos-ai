# PRICING_ENGINE_PLAN.md

## Rules (binding)
Server-side only; the browser renders results and never supplies money
(prototype violation F8 fixed: /api/estimate-request recomputes from the
submitted SELECTION and discards client-sent cents). Integer minor units;
rounding half-up per line; totals = sum of rounded lines; every line retains
its formula inputs; every released version snapshots prices immutably;
internal cost/margin never in client payloads.

## Engine
Seed: src/server/configurator/pricing.ts (pure, integer cents, violations
model, 14 assert checks in scripts/check-pricing.mjs) + the interim
src/lib/configurator/estimate.ts math (volume tiers, range spread) - both in
repo. Target: one domain service priceProposal(selection, priceBook) ->
{ lines[], subtotals, pending[], violations[], meta } where priceBook rows
come from the DB catalog (catalog-manager phase). Pricing modes per brief
section 7: fixed / per-unit / per-rack / per-GPU / per-kW / per-MW /
recurring / tiered / zone / percentage / range / allowance / pending-review /
included / optional / custom.

## Price data migration
Everything now in configuratorPricing.ts + configuratorCatalog.ts imports
into catalog_items flagged needs_business_verification=true (brief section
29) - values are placeholders until the founder approves them
(BUSINESS_DATA_REQUIRED sections B/C). localStorage preview stays as an
admin-only visual preview, never an input to stored records.
