# Current Site Audit — podosai.com

Audited: 2026-08-31. Sources: repo at commit `333a408` (deployed state) plus live fetches of
`https://www.podosai.com/` and `https://www.podosai.com/invest`. Note: at audit time the working
tree contained **uncommitted, undeployed SEO scaffolding** (`src/lib/seo/`, `src/components/seo/jsonld.tsx`,
`src/content/`, and edits to `layout.tsx` / both pages / `sitemap.ts`) being built in parallel; this
document describes the **live site**, i.e. the committed state.

---

## 1. Route tree and rendering modes

| Route | Source | Rendering | Evidence |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Static prerender (SSG), served from Vercel edge cache | `X-Nextjs-Prerender: 1`, `X-Vercel-Cache: HIT` |
| `/invest` | `src/app/invest/page.tsx` | Static prerender (SSG) | same headers |
| `/api/investor-interest` | `src/app/api/investor-interest/route.ts` | Dynamic POST handler — records non-binding investor interest to Supabase (RLS insert-only), best-effort email via Resend/FormSubmit, in-memory per-IP throttle | file header comment |
| `/api/generate-image` | `src/app/api/generate-image/route.ts` | Dynamic POST — regenerates `/invest` AI visuals; disabled in production unless `GENERATE_IMAGE_SECRET` header matches | file header comment |
| `/sitemap.xml` | `src/app/sitemap.ts` | Metadata route | live, returns 2 URLs. *Post-audit note: at `c2c80a8` sitemap.ts was refactored to derive from the `INDEXABLE_ROUTES` registry in `src/lib/seo/site.ts`; the `lastModified: new Date()` criticism (gap #9) still applies.* |
| `/robots.txt` | `src/app/robots.ts` | Metadata route | live |
| `/icon.png`, `/opengraph-image.png` | `src/app/icon.png`, `src/app/opengraph-image.png` | File-convention favicon + OG image | live (`og:image` 1028×962) |

There are only **two indexable HTML pages** on the entire site.

Host / redirect behavior: apex `https://podosai.com/` responds **`307 Temporary Redirect`** to
`https://www.podosai.com/` (Vercel platform redirect). www is the canonical host per the sitemap.

Layout (`src/app/layout.tsx`): fonts Geist / Inter Tight / Geist Mono via `next/font`,
`lang="en"`, mounts `GlobalEnergyLayer` (ambient motion) and `SmoothScrollProvider` (Lenis).
No `<link rel="canonical">`, no JSON-LD, no analytics script anywhere in the layout.

Nearly every section component is `"use client"` (59 files), but Next still server-renders them, so
**body copy is present in the HTML** — both pages expose a lot of indexable text (verified via live
fetch; representative copy renders server-side).

---

## 2. Existing metadata (as rendered live)

### `/` (from root `layout.tsx` metadata export)

- `<title>`: `PODOS AI — The New Physical Layer for AI`
- description: `PODOS AI builds factory-built modular AI compute pods. 1-MW deployable infrastructure shipped in 90 days, ready to commission at your facility.`
- `metadataBase`: `https://podosai.com` (**apex, not www** — mismatch with sitemap host)
- OG: title `PODOS AI`, description `The AI economy needs a new physical layer.`, `og:url https://podosai.com` (redirecting apex), `og:type website`, `og:site_name PODOS AI`, `og:image /opengraph-image.png` at **1028×962** (non-standard; 1200×630 recommended)
- Twitter: `summary` card (not `summary_large_image`), no image tag pointing at a proper card asset
- **No canonical tag** (confirmed live: 0 occurrences)

### `/invest` (page-level metadata export)

- `<title>`: `Invest in PODOS — Turn Available Power into Deployable AI Compute`
- description: `PODOS builds factory-made modular units that integrate power, cooling, server racks, and communications — a faster path to AI capacity. Explore the investment opportunity.`
- OG rendered live: **only** `og:title`, `og:description`, `og:url https://podosai.com/invest` — the page's `openGraph` override drops `og:image`, `og:type`, and `og:site_name` (Next shallow-merges the `openGraph` object)
- Twitter tags on `/invest` are **inherited from the root and wrong**: `twitter:title PODOS AI`, `twitter:description The AI economy needs a new physical layer.`
- **No canonical tag**

### Heading structure (live)

- `/`: exactly **1 × h1** ("The integrated AI compute platform."), 12 × h2, 35 × h3. h2s follow the narrative: broken infrastructure → factory-built pods → 90–120-day deployment → product ladder → deployment process → use cases → manufacturing → engineering → team → CTA.
- `/invest`: exactly **1 × h1** ("Turn available power into deployable AI compute"), 13 × h2, 25 × h3 (anatomy systems: Power input, Cooling, Server racks…; process: Discover / Review / Verify / Invest).

Heading hygiene is good on both pages. Titles/descriptions are on-brand but keyword targeting is
thin (see gaps).

---

## 3. Section components

### Homepage (`src/components/site/`, in page order)

| Component | Purpose |
|---|---|
| `HeroVideoNarrative` | Scroll-driven hero: self-contained nav, intro.mp4 video, chapter overlays; carries the h1 |
| `ProblemDiagnosis` | "The AI economy is running on broken infrastructure" problem framing |
| `YossiVideoSection` | Founder video with custom player (play/scrub/volume/fullscreen) |
| `SolutionCards` | "Factory-built AI compute pods" solution cards |
| `PodosPod` | Pod deep-dive; "Deploy one megawatt in 90–120 days" |
| `DeploymentTimeline` | Sticky-video scroll section, "From factory to facility" |
| `UseCases` | Target-organization use cases |
| `Manufacturing` | "Built through modular manufacturing discipline" |
| `DesignTechEnvironment` | "Engineered for deployment, density, and control" engineering features (Thermos enclosure, ORC heat engine, off-grid, zero water/concrete) |
| `MeetTheTeam` | Team section |
| `RequestAccessCTA` | Contact / request-access CTA |
| `Footer` | Four-column footer (Product / Deployment link groups, Privacy/Terms/Cookies placeholders) |
| `ScrollProgressRail` | Floating right-side progress rail (decorative) |

Orphaned in `src/components/site/` (imported by nothing): `PodosScrollHeroIntro`, `HeroAIWall`,
`ProductShowcase`, `EngineeringAdvantages`, `DeployTimelineScrub`, `BackgroundLayers`,
`VideoBackground` — plus a `src/components/ui/` grab-bag (testimonial, world-map, infinite-slider…)
also largely unused. Dead weight, not an SEO problem per se, but bundle/maintenance noise.

### /invest (`src/components/invest/`, in page order)

| Component | Purpose |
|---|---|
| `InvestNav` | Sticky glass nav, frosts on scroll |
| `InvestHero` | Monumental pavilion hero + investor-access module; h1 |
| `PodosFilm` | 35-second investor film (poster + play overlay, `preload="metadata"`) |
| `Constraint` | Market-constraint stats with claim-status chips (industry estimate vs PODOS target) |
| `Collaborations` | Confidential-relationship strip (POWER → PODOS → COMPUTE); only config-approved statements render |
| `ProductAnatomy` | Interactive cutaway system tour (power, cooling, racks, comms…) |
| `OpportunitySection` | Traditional construction vs PODOS deployment-model timelines |
| `DeploymentJourney` | Five-stage factory-to-deployment film strip |
| `ScaleModel` | Illustrative 1 → 10 → 100 → 1,000-unit scale pull-back |
| `Evidence` | Credibility wall; renders only configuration-approved proof modules |
| `MoneyMoment` | Single typographic beat ("Why we're building PODOS") |
| `CapitalCycle` | Capital → capacity → customer loop diagram |
| `OwnershipCalculator` | $1,000–$250,000 exploration slider; ownership math gated by `investOffering` config |
| `ProcessSection` | Discover / Review / Verify / Invest line + risk/offering FAQ accordion |
| `FinalCTA` | Monumental closing CTA |
| `LegalDisclaimer` | Closing disclosures (server component) |
| `StickyInvestCTA` | Mobile-only fixed bottom CTA bar |
| `InvestorAccessFlow` | 3-step interest-capture modal (AMOUNT → DETAILS → REVIEW), posts to `/api/investor-interest` |
| Helpers: `Reveal` (scroll entrance), `GeneratedSectionImage` (AI-render registry loader), `investAccess.ts` (shared open-modal event) | |

---

## 4. Data layer (`src/data/`)

- `siteContent.ts` (71 lines) — homepage hero copy, pod specs (256 GPUs/pod, 2–10 MW, PUE < 1.15, <12-week deployment), why-points, deploy environments, tech specs. Partially superseded: current homepage components carry much of their own copy.
- `investContent.ts` (277 lines) — /invest narrative copy.
- `investOffering.ts` (267 lines) — single source of truth for material claims: offering status (`"interest"`, `termsApproved: false`, min $1,000), collaboration disclosure levels, evidence modules. Components hide anything not explicitly approved.
- `invest-page-images.ts` (252 lines) — registry of the 19 approved GPT-Image-2 renders in `public/visuals/invest/`.

## 5. `next.config.ts`

Minimal: `transpilePackages: ["lenis"]`, `images.localPatterns` allowing `?v=` cache-busters only under `/visuals/invest/**`, Turbopack root anchor. No redirects, no headers, no `images.formats` override (defaults deliver WebP/AVIF via `next/image`).

## 6. Live sitemap and robots

`https://www.podosai.com/sitemap.xml` — exactly 2 URLs, both `changefreq weekly`, `lastmod` stamped
at build time (`new Date()` — every deploy rewrites lastmod, which makes it meaningless to crawlers):

1. `https://www.podosai.com/` (priority 1)
2. `https://www.podosai.com/invest` (priority 0.9)

`robots.txt`: `User-Agent: *`, `Allow: /`, `Disallow: /api/`, sitemap pointer to www. Correct.

## 7. Media / asset inventory (`public/`, ~683 MB total)

| Location | Contents |
|---|---|
| `public/` root | ~17 stray `ChatGPT Image *.png` files (spaces in names), `tmp1nzr2adn.mp4`, `tmpl3w5_kx8.mp4`, heavy videos: `factory.mp4` 66 MB, `factory to site.mp4` 60 MB (space in name), `factory-scrub.mp4` 28 MB, `problem-bg-scrub.mp4` 20 MB, `intro.mp4` 19 MB, plus logos, `.glb` model |
| `public/videos/` | 142 MB — `podos-investor-film.mp4`, `yossi.mp4`, hero/background loops, poster JPGs |
| `public/visuals/invest/` | 19 approved GPT-Image-2 PNGs (45 MB dir) |
| `public/engineering/`, `products/`, `use-cases/`, `team/`, `optimus/`, `market/`, `syntropic/`, `hero/`, `intro/`, `models/` | Section imagery; `use-cases/` contains misspelled/stray files (`hostipal.jpg`, `manifactoor.jpg`, `mNIFctroing site.png`, `helicopter.mov`) |
| `public/graphics/` | empty |

Images are served through `next/image` (runtime WebP/AVIF), so PNG-at-rest is acceptable, but
several videos load-bearing on first paint are very large, and repo-root stray files
(`podos ai video.mp4` etc., untracked) plus temp files in `public/` are shippable clutter.
Homepage alt-text: at least one empty `alt=""` found live; alt coverage not systematically audited.

## 8. Analytics

**None.** No GA4/gtag, GTM, Vercel Analytics/Speed Insights, PostHog, Plausible, Mixpanel, Segment,
Clarity, or Hotjar in `package.json` or `src/` (grep hits for "analytics" are marketing copy only).
There is no measurement of traffic, conversions, or investor-interest funnel beyond the Supabase
rows themselves.

---

## 9. Top 10 SEO gaps (ordered by impact)

1. **Only two pages exist.** There is no content surface to rank: no use-case, product, engineering, FAQ, about, or blog/insights URLs — the h2/h3 topics (cooling, off-grid power, 90-day deployment, use cases) live as sections on one page instead of indexable pages. This caps organic reach more than anything else.
2. **No canonical URLs.** Neither page emits `<link rel="canonical">`, and `metadataBase`/`og:url` point at the **apex** (`https://podosai.com`) while the site serves from **www** — canonical signals contradict each other.
3. **Apex → www redirect is a 307 (temporary), not 301/308.** Crawlers are told the www move isn't permanent; combined with #2 this splits host signals. Fix at the Vercel domain config.
4. **No structured data on the live site.** Zero JSON-LD (Organization, WebSite, WebPage, FAQPage for the /invest FAQ). A `jsonld.tsx` component exists in the working tree but is not imported anywhere or deployed.
5. **No analytics or Search Console evidence.** Nothing measures organic traffic or conversions, so no SEO work can be validated. (GSC status: unknown — not verifiable from repo.)
6. **/invest social metadata is broken.** No `og:image`, `og:type`, or `og:site_name` (page-level `openGraph` override drops inherited fields), and its Twitter card shows the homepage's title/description. Investor links shared on social/messaging render with the wrong or missing preview.
7. **Weak OG/Twitter assets globally.** `og:image` is 1028×962 (not 1200×630) and the Twitter card is `summary` rather than `summary_large_image` with a dedicated card image.
8. **Title/description keyword targeting is thin.** "The New Physical Layer for AI" is brand poetry; neither page title contains the terms buyers search (e.g. "modular data center", "AI data center pods", "containerized GPU compute" — candidate terms, volumes unknown). No title template for future pages.
9. **Sitemap `lastmod` is build-time `new Date()`** — rewritten on every deploy for unchanged content, so crawlers learn nothing from it; and footer links to Privacy/Terms/Cookies pages that do not exist (placeholder hrefs), an E-E-A-T/trust gap for an investor site.
10. **Page-weight / asset hygiene.** ~683 MB in `public/`, 60–66 MB videos, temp/misnamed files, some empty `alt` attributes, and heavy scroll-video hero on the primary page — Core Web Vitals unmeasured (no field data tooling installed; lab audit not run here — unknown).

---

*Not invented in this audit: traffic numbers, rankings, customer counts, certifications, Core Web
Vitals scores, and Search Console status are all unknown/unmeasured.*
