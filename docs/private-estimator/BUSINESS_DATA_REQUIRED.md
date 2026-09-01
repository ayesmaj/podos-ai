# BUSINESS_DATA_REQUIRED.md — private proposal system

Nothing below is invented by the build. Items marked [launch] block real
client use; the system runs on placeholder data flagged
NEEDS BUSINESS VERIFICATION until they are supplied.

## A. Credentials and purchases (founder)
- A1 [launch] RESEND_API_KEY + verified podosai.com sending domain — without
  it there is NO email: OTP policy cannot send codes (email-confirm policy is
  the operational default), invitations must be delivered manually, and no
  notifications fire.
- A2 [launch] E-signature provider account (Dropbox Sign recommended) — until
  then signing is the native session-acknowledgement, labeled as such, not a
  provider-certified signature.
- A3 Google Maps Platform keys (site step address autocomplete/validation/
  static map) — manual entry + manual pin is the fallback, already planned.
- A4 Decision: keep using Supabase project podos-invest (current) or move the
  proposal system to a dedicated project before client data accumulates.
- A5 Malware-scanning choice for client uploads (or explicit acceptance of
  type/size allowlist only at launch).

## B. Commercial data [launch]
- Real catalog: products, options, descriptions, lead times, availability.
  Everything imported from configuratorPricing.ts/configuratorCatalog.ts is
  a placeholder and is flagged needs_business_verification.
- Real prices per item + pricing modes; volume tiers; regional/freight zones;
  tax treatment; discount policy and approval thresholds.
- Compatibility rules and thresholds (engineering must author; the rules
  engine will not invent limits).
- Warranty plans (terms, coverage, response targets, prices) + custom-warranty
  review workflow owner.

## C. Legal [launch]
- Proposal terms, assumptions/exclusions boilerplate, acceptance language,
  countersignature policy, confidentiality/NDA text, e-record consent copy.
- Privacy policy update covering proposal tracking (per-viewer activity is
  recorded) and the processors involved.
- Proposal validity window default and expiry policy.

## D. People and process [launch]
- Staff list with roles for the section-20 matrix (drives Phase F Supabase
  Auth build); MFA requirement decision.
- Engineering-review SLA shown to clients; notification recipients per event.

## E. Visual assets
- Orthographic menu-illustration wave (brief section 6): the current 99-image
  library is photographic — 0/99 at 4:3. Regeneration runs through the
  existing pipeline once the real catalog is known (one image per approved
  item; founder rule: one image = one placement).
- Approved pod visualization for the PDF cover.

## F. Already resolved (no founder input needed)
Design tokens/typography; claims-register mechanics; token/session security
model; integer-cents money rule; deployment target (Vercel); DB schema and
functions (tested); admin secret rotation mechanism (set_admin_secret).
