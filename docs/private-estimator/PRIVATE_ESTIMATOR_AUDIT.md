# PRIVATE_ESTIMATOR_AUDIT.md

2026-09-01 - 6-agent repo audit + live database inspection. Decision-grade summary.

## Current architecture
Next.js 16.2.2 (App Router, Turbopack, cacheComponents off), React 19.2.4,
Tailwind v4 CSS-first. No middleware/proxy file. No headers() in next.config.
Hosting: Vercel project podos-ai -> www.podosai.com (git auto-deploy NOT
firing; deploys via CLI). Supabase project podos-invest (buqghwxjjksqperiamag)
reached by raw PostgREST fetch - no SDK, no ORM.

## What exists today (the prototype being replaced)
- /estimate - public client-side estimator. Pricing from
  src/data/configuratorPricing.ts (browser-held PRICING), math in
  src/lib/configurator/estimate.ts (pure, pods 1-50, volume tiers, range
  spread), admin preview override in localStorage (podos:pricing-preview).
  Lead form posts CLIENT-COMPUTED cents to /api/estimate-request.
- /admin/pricing - localStorage-only editor; publishing = copy JSON into
  source. Anonymously reachable; pricing content ships in the public bundle.
- /admin/estimates - staff list; gate = shared secret via ?key= query -> a
  cookie holding the RAW secret. New-link one-shot cookie is httpOnly:false.
- /e/[token] - private client estimate; link possession = full access; no
  session, no OTP; robots via meta tag only (no X-Robots-Tag header).
- DB (live, verified): estimates, estimate_views, estimate_admin_config,
  investor_interest; RLS deny-all; access only via SECURITY DEFINER RPCs;
  tokens stored as SHA-256. RPC SQL was NOT in the repo (now exported to
  supabase/migrations/).

## Security findings (adversarial pass, F1-F12)
HIGH: F1 link-possession-only access. F2 admin secret in query string.
F3 no durable rate limiting. F4 no security headers (CSP/HSTS/Referrer-
Policy/XFO/nosniff all absent). F6 bearer token in URL path + referrer leak.
MEDIUM: F5 meta-only robots (no header) and robots.txt ADVERTISES /e/.
F7 no admin audit logging. F8 client-computed prices accepted by
/api/estimate-request; localStorage pricing spoofable. F9 estimate-request
abuse surface. F10 admin cookie = raw secret, SameSite=Lax; fresh client
token exposed to JS via one-shot cookie. F11 anon key/URL hardcoded
fallbacks; RPC SQL not in repo. LOW: F12 signing path has no UI and would
sign on link possession alone.

## Supporting infrastructure facts
- Email: RESEND_API_KEY commented out locally, absent from Vercel env ->
  NO email provider is live. FormSubmit fallback exists on the invest form.
- Deps: NO zod, NO test framework, NO PDF lib, NO signature SDK.
- Design: mono typeface removed site-wide (Geist + Inter Tight remain);
  chromeless prefixes exist (src/lib/site/chromeless.ts) but
  GlobalEnergyLayer + Lenis SmoothScrollProvider still mount on /admin and
  /e - marketing motion running on private surfaces.
- Image library: 99 webp, 63 at 1:1 + 36 at 3:2; ~95 photographic/
  environmental. 0 of 99 are 4:3; only ~2-4 approach orthographic-on-
  seamless. Meeting brief section 6 means a regeneration wave through the
  existing pipeline (scripts/generate-configurator-images.mjs), not reuse.
- Existing server pricing engine src/server/configurator/pricing.ts
  (integer cents, 14 assert checks) is unused - the seed for the real engine.

## What the rebuild keeps
The estimate/view/activity DB core, the SHA-256 token pattern, the
integer-cents money rule, the design tokens, and the claims-register
discipline. Everything else in the prototype is replaced per this folder.
