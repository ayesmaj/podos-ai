# Decision log — private proposal platform

## 2026-09-01 — Client configurator is intake-only (no approval/sign)
- Context: the first workspace showed a "Sign and accept" form on the client's
  configuration page; the founder's redesign brief corrects the flow.
- Decision: client flow = welcome → 14-step configure (autosave, live
  preliminary estimate) → review & submit → success. Signing lives ONLY on the
  formal proposal view, which the admin releases; the sign CTA appears only in
  status `signature_requested`.
- Reason: a preliminary configuration is not a commercial document; asking for
  acceptance there misrepresents the stage and confuses procurement.
- Alternatives rejected: keep sign on the workspace behind a flag.
- Consequence: `submit_configuration` + `release_proposal` +
  `set_signature_state` RPCs; `/client/proposals/[id]/proposal` route.

## 2026-09-01 — Typography stays Geist (display) + Inter Tight (text)
- Context: skill Phase 4 requires a font-library review; UI UX Pro Max
  suggested Roboto.
- Decision: keep the site's locked pair; no mono family (founder removed it).
- Reason: the local library (78 zips) is display/pixel/script/retro faces —
  none serve a technical-light enterprise system better; the pair already
  ships via next/font with no extra weight.
- Alternatives rejected: Roboto (generic Material look), any local display face.

## 2026-09-01 — Native radios instead of Radix for option cards
- Context: 21st source (Origin UI Radio Group) depends on @radix-ui/react-radio-group, not installed.
- Decision: `<fieldset>` + native `<input type="radio">` visually-hidden, card
  as `<label>`; selection styling via `:has(:checked)`.
- Reason: identical keyboard semantics (arrow keys, tab-stop), zero new deps.
- Consequence: no Radix in the bundle; pattern documented in the CSS module.

## 2026-09-01 — Motion via framer-motion 12 (already installed)
- Decision: spring count-up for the estimate figure, step-canvas crossfade,
  card hover depth; everything gated by `prefers-reduced-motion`.
- Rejected: GSAP/Lenis on private routes (marketing motion is disabled there).

## 2026-09-01 — Styling via CSS Modules + CSS variables
- Reason: the repo's unlayered reset kills Tailwind spacing outside `.invest`;
  CSS modules are the house convention; tokens extend globals.css roles.

## 2026-09-01 — Live estimate is server-computed
- Decision: `preview_estimate(p_session)` computes the preliminary range in
  the database from saved SKUs × pod quantity × volume tiers × range spread;
  the browser only animates the returned figures.
- Reason: master brief rule — the browser is never the source of truth for money.

## 2026-09-01 — Brand palette overrides UI UX Pro Max output
- Decision: keep porcelain/cobalt/cyan/near-black; no orange CTA.
- Reason: source-of-truth order (brand > skill defaults). Its pattern advice
  (configurator hero, sticky action bar, Trust & Authority style) is adopted.
