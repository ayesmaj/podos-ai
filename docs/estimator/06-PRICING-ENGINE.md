# 06 - PRICING ENGINE
Rules (binding, unchanged): server-only; integer minor units; half-up per
line; totals = sum of rounded lines; formula inputs retained per line;
immutable snapshot per released version; internal cost/margin never in
client payloads; placeholder values carry NEEDS_BUSINESS_VERIFICATION until
founder approval.

Engine: src/server/configurator/pricing.ts (cents, violations model, 14
assert checks) is promoted from unused to the core, refactored to read the
DB catalog: priceProposal(selection, priceBook) -> lines/subtotals/pending/
violations/meta. Price modes per master section 12 (FIXED..CUSTOM_QUOTE).
The browser engine estimate.ts and usePricingOverride localStorage flow are
retired when /ops/pricing (DB editor) replaces /admin/pricing; local
override key podos:pricing-preview must be ignored/cleared then.

Immediate hardening this phase: PRICING.approved moves to its own module so
marketing chunks stop bundling the whole placeholder price book; catalog
data imported to DB flagged unverified (dollars->cents for
configuratorPricing values).
