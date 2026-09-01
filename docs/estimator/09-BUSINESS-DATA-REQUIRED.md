# 09 - BUSINESS DATA REQUIRED
Nothing below is invented by the build; placeholders are flagged
NEEDS_BUSINESS_VERIFICATION in the database.

## Blocking real client use
- RESEND_API_KEY + verified podosai.com domain (invitation + OTP email; until
  then codes cannot send and invitations are delivered manually).
- Real catalog: products, options, descriptions, lead times; real prices per
  item + volume tiers + freight/tax treatment; compatibility thresholds
  (engineering-authored); warranty plans and terms.
- Legal: proposal terms, assumptions/exclusions, acceptance language,
  confidentiality text, e-record consent, privacy-policy update for
  per-viewer tracking; proposal validity window.
- E-signature provider account (Dropbox Sign recommended) for
  provider-certified signing; until then signing is the labeled
  session-acknowledgement.
- Staff list + role assignments for the 8-role matrix; MFA decision.
- Google Maps keys for site-step address autocomplete (manual entry is the
  fallback); malware-scanning provider decision for uploads.

## Founder decisions
- Keep proposal system in podos-invest Supabase project or split before
  client data accumulates.
- Sunset timing for legacy /e possession links (rotate/revoke).
- Orthographic menu-illustration wave: approve style spec, then regenerate
  per approved catalog item (one image = one placement).
