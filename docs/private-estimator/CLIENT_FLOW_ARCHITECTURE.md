# CLIENT_FLOW_ARCHITECTURE.md

Design contract: the two founder mockups (admin operations + client
workspace, 2026-09-01). Their layout and hierarchy are binding; every DATA
value in them (pod models, GPU counts, dollar figures) is placeholder and
never ships.

## Step 00 - Secure access (BUILT this phase)
/proposal/invite/[token]: confidentiality notice, company name, masked
recipient email, then per policy:
- otp: Send code -> 6-digit code e-mailed (10-min TTL, 5 attempts, 3/hr) ->
  enter code.
- email-confirm (operational default until an email provider is live):
  type the authorized email exactly.
Success -> session cookie -> redirect to /proposal/[id]. Invalid, expired
and revoked links render an identical minimal screen (no oracle).

## Workspace shell (per client mockup)
- Utility rail (NOT the marketing nav): PODOS logo, project name, proposal
  number, version, CONFIDENTIAL chip, autosave state, expiry, help, exit.
- Left step rail (01 Company -> 10 Review), center step canvas, right sticky
  summary (capacity, GPU/pod counts, one-time range, recurring, selected
  options, pending-review items, preview/download actions).
- Confidentiality marker on every screen:
  CONFIDENTIAL - PREPARED FOR [COMPANY] (+ viewer email watermark option).
- Private layout excludes GlobalEnergyLayer, Lenis smooth-scroll, marketing
  header/footer (route-group layout).

## Step sequence (target; fields per master brief section 5)
00 Access (built) - 01 Company and contacts - 02 Project - 03 Site (+uploads,
map pin) - 04 Pod platform - 05 Compute - 06 Cooling - 07 Power - 08 Network
- 09 Safety/monitoring - 10 Syntropic/software - 11 Transport/commissioning -
12 Services/warranty - 13 Custom requirements - 14 Review and submit.
Every option card: orthographic menu image (4:3, object-fit contain), name,
one-line note, price effect or Pending engineering review, compatibility
state. Autosave: debounced server writes, visible Saved/Saving/Failed states,
localStorage as recovery cache only.

## v1 delivered this phase
Step 00 + the workspace shell rendering the proposal document (summary, line
items, status, signing via verified session, confidentiality footer), with
per-viewer view tracking. The 14-step configurator canvas is the next phase;
its state model (proposal_selections keyed by step) is in
DATABASE_SCHEMA_PLAN.

## Menu image system (brief section 6 - honest status)
Current 99-asset library is photographic; 0/99 at 4:3 -> does NOT meet spec.
Regeneration wave through the existing GPT-Image-2 pipeline with a new ORTHO
style constant (front/side/top elevation, pale grid ground, near-black shell,
cobalt/cyan pathways, 4:3 at 1600x1200 minimum, contain, no environment) -
plus hand-authored SVG for schematics where technical truth matters (cooling
loop, one-line power). Until then the UI must not crop photos into fake
diagrams.
