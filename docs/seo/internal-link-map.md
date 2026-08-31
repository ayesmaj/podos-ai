# Internal Link Map — Cluster Linking Blueprint

Status: blueprint (Phase 1). Last updated: 2026-08-31.

Live URLs today: `/` and `/invest` only (see `src/app/sitemap.ts`). Every other URL below is a
**planned Phase-1 page** — slugs are proposals grounded in the live site's actual content
(products: PODOS Pod, MEGA SILO, Optimus, Syntropic; engineering: thermos enclosure, ORC heat
engine, off-grid, zero water / zero concrete; use cases per `src/components/site/UseCases.tsx`).
If a sibling brief in `docs/seo/` fixes different slugs, reconcile there first — the linking
rules in this file apply to whatever the final slugs are.

---

## 1. Phase-1 URL inventory

| Cluster | URL | Role |
|---|---|---|
| Home | `/` | Site root; links down into every hub |
| Investor | `/invest` | Conversion page; outside the topical clusters |
| Core | `/pod` | **Pillar hub** — the PODOS Pod system (1-MW factory-built modular AI compute pod) |
| Core | `/pod/mega-silo` | Child — MEGA SILO (**BLOCKED B3** — name not approved for publication) |
| Tech | `/technology/optimus` | Tech page — Optimus (**BLOCKED B3** — name not approved for publication) |
| Tech | `/technology/syntropic` | Tech page — Syntropic (compression platform) |
| Engineering | `/engineering` | Engineering hub |
| Engineering | `/engineering/thermos-enclosure` | Child |
| Engineering | `/engineering/orc-heat-engine` | Child |
| Engineering | `/engineering/off-grid-power` | Child |
| Engineering | `/engineering/zero-water-zero-concrete` | Child |
| Deploy | `/deploy` | The 90-day factory-to-commissioning path |
| Use case | `/use-cases` | Use-case hub |
| Use case | `/use-cases/enterprise-ai` | Child |
| Use case | `/use-cases/healthcare` | Child |
| Use case | `/use-cases/universities-research` | Child |
| Use case | `/use-cases/manufacturing` | Child |
| Use case | `/use-cases/financial-institutions` | Child |
| Use case | `/use-cases/government-secure` | Child |
| Use case | `/use-cases/edge-ai` | Child |
| Use case | `/use-cases/supplemental-capacity` | Child |
| Compare | `/compare/pod-vs-data-center-buildout` | Comparison page |
| Compare | `/compare/pod-vs-colocation` | Comparison page |
| Compare | `/compare/pod-vs-cloud-gpu` | Comparison page |
| Insight | `/insights` | Insights hub |
| Insight | `/insights/<slug>` | Individual posts (topics TBD — unknown until editorial calendar exists) |

---

## 2. Linking rules by page type

### Core (pillar → children)
- `/pod` links to **every** core child and both tech pages, with keyword anchors, in the first
  two screens of content — not only in a footer rail.
- Children (`/pod/mega-silo`, tech pages) link **up** to `/pod` in the breadcrumb and once
  in body copy ("the PODOS Pod system").
- Core pages carry the **"Explore the system"** rail (see §5).

### Engineering (child ↔ adjacent child, + deploy)
- Every engineering child links to its **two adjacent** engineering pages (the ring in §4)
  and to `/deploy` ("what this means for your 90-day deployment").
- Every engineering child links up to `/engineering` (breadcrumb) and once to `/pod` in body copy.
- Engineering children carry the **"Continue the engineering path"** rail (see §5).

### Use case → engineering requirements
- Each use-case page links to the 1–2 engineering pages that answer that audience's dominant
  constraint (mapping in §4), phrased as requirements: "requires <engineering capability>",
  anchor = the engineering page's H1 keyphrase.
- Each use-case page links up to `/use-cases` (breadcrumb), to `/pod` once in body, and to
  `/deploy` in its closing CTA block.

### Compare → both tech pages
- Every compare page links to **both** tech pages (`/technology/optimus` and
  `/technology/syntropic`) plus `/pod`, so comparison traffic lands on owned technology
  pages rather than bouncing.
- Compare pages link to `/deploy` in the conclusion (the differentiator is speed).
- Compare pages are children of the core cluster for breadcrumbs: Home › PODOS Pod › <compare>.

### Insight → pillar + adjacent + next step
- Every insight post links to: (1) the **pillar** `/pod` once, early; (2) at least one
  **adjacent** page in the cluster its topic belongs to (an engineering child, use case, or
  compare page); (3) one **next-step** link in the closing section — `/deploy` for
  buying-intent topics, `/invest` for market/thesis topics.
- Posts link up to `/insights` via breadcrumb only.

### Home and /invest
- `/` links to `/pod`, `/engineering`, `/use-cases`, `/deploy`, `/insights`, `/invest`
  (header/footer plus in-section links). Home is the only page without a breadcrumb.
- `/invest` links back to `/` and `/pod` only. Do not weave `/invest` into topical clusters;
  it receives its links from the site-wide CTA, not from body copy.

### Global caps
- No page exceeds ~100 outgoing links total (nav + body + rails + footer).
- Every Phase-1 page reachable in ≤ 2 clicks from `/` (hubs at 1 click, children at 2).
- No orphans: a page ships only after at least one hub and one sibling link to it.
- Internal links always use the canonical form: relative path, no trailing slash
  (see `docs/seo/redirect-map.md`).

---

## 3. Breadcrumbs

- On **every page except `/`**, visible breadcrumb + `BreadcrumbList` JSON-LD.
- Trails mirror the URL hierarchy:
  - `Home › PODOS Pod › MEGA SILO`
  - `Home › Engineering › ORC heat engine`
  - `Home › Use cases › Healthcare facilities`
  - `Home › PODOS Pod › Pod vs. colocation`
  - `Home › Insights › <post title>`
  - `Home › Invest`
- Each crumb (except the current page) is a real `<a>` to the canonical URL.

---

## 4. Concrete adjacency table (every Phase-1 URL)

"Required links out" are body/rail links mandated by §2 (site-wide header/footer excluded).
Engineering adjacency ring: **thermos-enclosure → orc-heat-engine → off-grid-power →
zero-water-zero-concrete → (back to thermos-enclosure)**; the path terminates at `/deploy`.

| URL | Required links out | Must be linked from |
|---|---|---|
| `/` | `/pod`, `/engineering`, `/use-cases`, `/deploy`, `/insights`, `/invest` | (root) |
| `/invest` | `/`, `/pod` | site-wide CTA on every page |
| `/pod` | `/pod/mega-silo`, `/technology/optimus`, `/technology/syntropic`, `/deploy`, `/use-cases`, `/invest` | `/`, every child, every compare, every insight |
| `/pod/mega-silo` | `/pod`, `/technology/optimus`, `/deploy` + system rail | `/pod`, system rail |
| `/technology/optimus` | `/pod`, `/technology/syntropic`, `/engineering/thermos-enclosure`, `/deploy` + system rail | `/pod`, all compare pages, system rail |
| `/technology/syntropic` | `/pod`, `/technology/optimus`, `/deploy` + system rail | `/pod`, all compare pages, system rail |
| `/engineering` | all 4 engineering children, `/pod`, `/deploy` | `/`, engineering children (breadcrumb) |
| `/engineering/thermos-enclosure` | `/engineering/zero-water-zero-concrete` (prev), `/engineering/orc-heat-engine` (next), `/deploy`, `/pod` | `/engineering`, ring neighbors, `/technology/optimus`, use cases: enterprise-ai, financial-institutions, government-secure |
| `/engineering/orc-heat-engine` | `/engineering/thermos-enclosure` (prev), `/engineering/off-grid-power` (next), `/deploy`, `/pod` | `/engineering`, ring neighbors, use cases: universities-research |
| `/engineering/off-grid-power` | `/engineering/orc-heat-engine` (prev), `/engineering/zero-water-zero-concrete` (next), `/deploy`, `/pod` | `/engineering`, ring neighbors, use cases: healthcare, manufacturing, government-secure, edge-ai |
| `/engineering/zero-water-zero-concrete` | `/engineering/off-grid-power` (prev), `/engineering/thermos-enclosure` (next), `/deploy`, `/pod` | `/engineering`, ring neighbors, use cases: healthcare, manufacturing, edge-ai, supplemental-capacity |
| `/deploy` | `/pod`, `/engineering`, `/use-cases`, `/invest` + system rail | every engineering child, every use case, every compare, system rail, buying-intent insights |
| `/use-cases` | all 8 use-case children, `/pod`, `/deploy` | `/`, use-case children (breadcrumb) |
| `/use-cases/enterprise-ai` | `/engineering/thermos-enclosure`, `/pod`, `/deploy` | `/use-cases` |
| `/use-cases/healthcare` | `/engineering/zero-water-zero-concrete`, `/engineering/off-grid-power`, `/pod`, `/deploy` | `/use-cases` |
| `/use-cases/universities-research` | `/engineering/orc-heat-engine`, `/pod`, `/deploy` | `/use-cases` |
| `/use-cases/manufacturing` | `/engineering/off-grid-power`, `/engineering/zero-water-zero-concrete`, `/pod`, `/deploy` | `/use-cases` |
| `/use-cases/financial-institutions` | `/engineering/thermos-enclosure`, `/pod`, `/deploy` | `/use-cases` |
| `/use-cases/government-secure` | `/engineering/thermos-enclosure`, `/engineering/off-grid-power`, `/pod`, `/deploy` | `/use-cases` |
| `/use-cases/edge-ai` | `/engineering/off-grid-power`, `/engineering/zero-water-zero-concrete`, `/pod`, `/deploy` | `/use-cases` |
| `/use-cases/supplemental-capacity` | `/engineering/zero-water-zero-concrete`, `/pod`, `/deploy` | `/use-cases` |
| `/compare/pod-vs-data-center-buildout` | `/technology/optimus`, `/technology/syntropic`, `/pod`, `/deploy` | `/pod`, relevant insights |
| `/compare/pod-vs-colocation` | `/technology/optimus`, `/technology/syntropic`, `/pod`, `/deploy` | `/pod`, relevant insights |
| `/compare/pod-vs-cloud-gpu` | `/technology/optimus`, `/technology/syntropic`, `/pod`, `/deploy` | `/pod`, relevant insights |
| `/insights` | latest posts, `/pod` | `/`, posts (breadcrumb) |
| `/insights/<slug>` | `/pod`, 1+ adjacent cluster page, next step (`/deploy` or `/invest`) | `/insights`, related posts |

Use-case → engineering mapping above is a suggested default; adjust to the copy actually
written for each page, but every use case must keep ≥ 1 engineering-requirement link.

---

## 5. Rails

### "Explore the system" (core / tech / deploy pages)
Fixed card rail near the page end on `/pod`, `/pod/mega-silo`, `/technology/optimus`,
`/technology/syntropic`, `/deploy`. Cards: those five URLs minus the current page, in that
order. Card anchor = the target page's short product name (e.g. "MEGA SILO", "Optimus",
"Syntropic", "90-day deployment").

### "Continue the engineering path" (engineering children)
Prev/next pair at the end of each engineering child following the §4 ring, plus one
persistent terminal card: "See the 90-day deployment path → `/deploy`". One prominent
"next" (large card), one quiet "previous" (text link).

---

## 6. Anchor-text guidance

- Anchor = the target page's H1 keyphrase or a close natural variant. Never bare
  "click here" / "learn more" / "read more" as the only anchor text on a link.
- First in-body link to a target on a page uses the descriptive keyword anchor; subsequent
  links to the same target may use branded or shorthand anchors ("the pod", "Syntropic").
- Keep 2–3 anchor variants per target site-wide, not one exact-match anchor everywhere.
- Rails and breadcrumbs use short labels (product name / section name); body links carry
  the descriptive anchors.
- One link per target per section — don't link the same URL twice in one paragraph block.

---

## 7. Hub-page composition (`/pod`, `/engineering`, `/use-cases`, `/insights`)

1. **Intro** (150–300 words) that positions the cluster and links the pillar/adjacent hub once.
2. **Child cards** — one card per child, card title = child H1 keyphrase (this is the anchor),
   1–2 line description, whole card clickable to the canonical URL.
3. **Cross-cluster rail** — one row linking sideways (engineering hub → `/deploy` + `/pod`;
   use-case hub → `/engineering` + `/deploy`; insights hub → `/pod`).
4. **CTA block** — `/invest` (site-wide CTA) or contact.
5. No pagination in Phase 1; hubs list all children on one page.
