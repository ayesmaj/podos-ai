# Redirect Map & Canonical Policy

Status: current-state audit + policy. Last updated: 2026-08-31 (all responses below measured
via `curl -I` on that date; host: Vercel).

---

## 1. Canonical policy

- **Canonical origin: `https://www.podosai.com`** — https, `www` host, **no trailing slash**
  (except the root `/`), lowercase hyphenated slugs.
- `next.config.ts` sets **no `trailingSlash` option**, so Next.js uses the default
  (`trailingSlash: false`); trailing-slash URLs are 308-redirected to the slashless form
  (verified: `https://www.podosai.com/invest/` → `308` → `/invest`).
- `src/app/sitemap.ts` already uses `https://www.podosai.com` as base and slashless `/invest`. Correct.
- `src/app/robots.ts` points to `https://www.podosai.com/sitemap.xml`. Correct.
- Paths are case-sensitive (verified: `/INVEST` → `404`). All internal links and published
  URLs must be lowercase.

## 2. Current measured state

| Request | Response | Location |
|---|---|---|
| `http://podosai.com/` | **308** | `https://podosai.com/` |
| `http://www.podosai.com/` | **308** | `https://www.podosai.com/` |
| `https://podosai.com/` | **307** Temporary | `https://www.podosai.com/` |
| `https://podosai.com/invest` | **307** Temporary | `https://www.podosai.com/invest` |
| `https://www.podosai.com/invest/` | **308** | `/invest` (trailing-slash strip, Next.js default) |
| `https://www.podosai.com/INVEST` | 404 | — (case-sensitive) |
| `https://www.podosai.com/nonexistent…` | 404 | — |

Notes:
- `http://podosai.com` chains two hops: `308` to https apex, then `307` to www. Two hops is
  acceptable but the second hop being temporary is not (see fix R1).
- Path is preserved across the apex→www redirect (good — deep links survive).

## 3. Required fixes

| # | Fix | Where | Why |
|---|---|---|---|
| **R1** | Change apex→www redirect from **307 to 308** (permanent) | Vercel dashboard → project → Settings → Domains → `podosai.com` → set redirect to `www.podosai.com` as **308 Permanent** (this redirect is served at Vercel's edge, not from `next.config.ts`) | 307 tells crawlers the move is temporary; signals/equity consolidate on www only with a permanent redirect |
| **R2** | `metadataBase` is the **apex** `https://podosai.com` in `src/app/layout.tsx` (line 53); `openGraph.url` is apex too (line 58) | Change both to `https://www.podosai.com` | **RESOLVED in repo at `c2c80a8`** (metadataBase + OG urls now www; per-page canonicals added on / and /invest) — verify on next production deploy |
| **R3** | No explicit canonical tag is set (`alternates.canonical` absent from `layout.tsx` metadata) | Add `alternates: { canonical: "./" }` alongside the corrected `metadataBase` so each page self-canonicalizes to its www URL | Removes ambiguity once R2 lands; protects against query-string duplicates |

No other 301/308 fixes are required today: only `/` and `/invest` exist, no legacy URLs have
been retired, and no `redirects()` block exists in `next.config.ts` (none currently needed).

## 4. Rules for future URL changes

1. **Never retire a published URL without a permanent redirect.** Add it to `redirects()` in
   `next.config.ts` with `permanent: true` (emits 308) in the same PR that moves/removes the page.
2. **Redirect straight to the final destination** — max one application-level hop. When a
   redirect target itself moves, update the old rule to point at the new final URL.
3. **Update internal links, `sitemap.ts`, and structured data in the same PR** — internal
   links must never rely on a redirect.
4. New slugs follow the canonical policy: lowercase, hyphenated, no trailing slash, www absolute
   form in sitemaps/OG, relative form in internal links.
5. **Log every redirect in the ledger below** with date and reason, so the map stays auditable.
6. Query-string variants (e.g. UTM) are not redirected; they are handled by the canonical tag (R3).

### Redirect ledger

| Date | From | To | Type | Where implemented | Reason |
|---|---|---|---|---|---|
| (pre-existing) | `http://*` | `https://*` same host | 308 | Vercel edge (automatic) | TLS enforcement |
| (pre-existing) | `https://podosai.com/*` | `https://www.podosai.com/*` | 307 → **change to 308 (R1)** | Vercel domain settings | Host canonicalization |
| (pre-existing) | `https://www.podosai.com/<path>/` | `/<path>` | 308 | Next.js default (`trailingSlash: false`) | Trailing-slash canonicalization |

## 5. External / brand domains — unknown, needs founder input

The site references the **Syntropic** and **Optimus** platforms and **MEGA SILO**
(`src/components/site/MeetTheTeam.tsx`, `HeroAIWall`), but the repo contains **no reference to
any external domain** for them (no `syntropic.*`, `optimus.*`, or similar host appears in code
or config). Whether such domains are registered, parked, or live is **unknown — founder input
required**. Policy if any exist: 308 them (path-preserving where sensible) to the matching
technology page on `www.podosai.com` (per `docs/seo/internal-link-map.md`), and record each in
the ledger above. The same applies to any other owned variants (e.g. `podos.ai`,
`podosai.net`) — none are referenced in the repo; status unknown.
