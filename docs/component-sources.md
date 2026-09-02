# Component sources — private proposal platform (2026-09-01)

21st MCP was searched by function per component family (protocol in the
ayesmaj-premium-web skill). Three sources were retrieved and inspected; each
was normalized into the PODOS token system — none is used verbatim.

| Project component | 21st search intent | Selected source | Why selected | Dependencies | License/attribution | Major modifications | Status |
|---|---|---|---|---|---|---|---|
| `StepRail` (client configurator, left rail) | vertical stepper with completed/current/upcoming states | Origin UI **Stepper** (demo id 769) — https://21st.dev/@originui/components/stepper | Cleanest context-driven state model (`completed/active/inactive`), button triggers, data-state hooks; shadcn-grade a11y | none (lucide + radix-icons in source) | Origin UI, MIT-style registry | Tailwind classes replaced by CSS module (utilities are dead outside `.invest` here); radix-icons → lucide `Check`; vertical orientation only; added completion % and pending-review state | integrated |
| `OptionCard` group (configurator product steps) | radio group as selectable cards with image, description, selected check | Origin UI **Radio Group — Card** (demo id 747) — https://21st.dev/@originui/components/radio-group | Correct semantics: a card IS a radio; keyboard arrows move selection; `has(:checked)` styling | @radix-ui/react-radio-group (NOT adopted) | Origin UI | Radix replaced by native `<input type="radio">` in `<fieldset>` (same arrow-key semantics, zero deps); menu-illustration slot, price-effect line, pending-review and recommended chips, soft selection glow | integrated |
| `MetricCard` + animated estimate figure | KPI stat card with count-up value and trend badge | ravikatiyar162 **Stat Card** (demo id 7461) — https://21st.dev/@ravikatiyar162/components/card-10 | Spring count-up via framer-motion (already installed), role/aria pattern for the figure | framer-motion 12 (installed) | 21st community | Currency formatting (integer cents, tabular figures), reduced-motion bypass, PODOS palette; trend badge kept only where a real prior period exists (no invented deltas) | integrated |
| `EstimatePanel` (sticky live estimate) | — | custom | Composition of MetricCard figure + selected-options list; no catalog component models server-authoritative ranges | — | — | — | custom |
| `ProposalDocument` web preview + PDF blocks | — | custom | Document typography/section blocks are brand-specific (component-policy §8) | @react-pdf/renderer (installed) | — | — | custom |
| Ops shell sidebar | — | existing `OpsShell` (restyled) | already normalized; nav-state-active + logo | — | — | — | kept |

Searches also run (no source adopted): "multi-step product configurator with live price summary" (results were SaaS pricing tables — wrong job), "dashboard KPI stat card grid" (id 7461 chosen from this set).
