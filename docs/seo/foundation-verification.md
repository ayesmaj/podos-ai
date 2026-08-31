# Sprint-1 Foundation Docs — Adversarial Verification

**Verified:** 2026-08-31, against working tree at commit `c2c80a8` plus live `curl` checks.
**Verdict: PASS with 3 required corrections (no fabrications, no missing files).**

---

## 1. File inventory — complete (14/14)

| Required | Present |
|---|---|
| docs/seo/current-site-audit.md | yes |
| docs/seo/design-language-lock.md | yes |
| docs/seo/content-and-claims-audit.md | yes |
| docs/seo/keyword-map.md | yes |
| docs/seo/internal-link-map.md | yes |
| docs/seo/redirect-map.md | yes |
| docs/seo/source-register.md | yes |
| docs/seo/launch-plan.md | yes |
| docs/seo/monthly-report-template.md | yes |
| content/reference/approved-facts.md | yes |
| content/reference/banned-claims.md | yes |
| content/reference/terminology.md | yes |
| content/reference/brand-voice.md | yes |
| content/reference/authors.md | yes |

No missing files. All are untracked (`?? docs/`, `?? content/`) — commit them.

## 2. Fabrication spot-check — 18 statements traced, 17 confirmed, 1 misquote

Every sampled factual statement was grepped to source:

| Doc statement | Repo evidence | Result |
|---|---|---|
| Meta description "shipped in 90 days" | `src/app/layout.tsx:52` | confirmed |
| H2 "Deploy one megawatt in 90–120 days. Not four years." | `PodosPod.tsx:201-206` | confirmed |
| "76+ patent claims … every USPTO filing" bio | `MeetTheTeam.tsx:26` | confirmed |
| Min $1,000 / max $250,000 | `investOffering.ts:40`, `investContent.ts:13` | confirmed |
| Optimus "64 × H200 / B200 class" + "placeholder estimates" header | `optimusComponents.ts:24,255` | confirmed |
| Badges "PILOT · VALIDATED" / "Q4 2026 · TAKING LOIs" / 20 MW / 2,560 GPUs | `ProductShowcase.tsx:36,44,49,53` | confirmed |
| `siteContent.ts` dead (no importers) with 256 GPUs / 2–10 MW / PUE <1.15 / <12 weeks | repo-wide grep: zero imports; `siteContent.ts:13-16` | confirmed |
| prototype/ip/customers evidence hidden (`approvedForPublicUse: false`) | `investOffering.ts:262-264` | confirmed |
| "24-month grid queue" lede vs "30–36 months" M-04 card (C11) | `ProblemDiagnosis.tsx:441` and `useCountUp(30)` + "–36" at 323, 505-513 | confirmed |
| PUE "1.08–1.12 · hyperscaler avg 1.58" | `PodosPod.tsx:66` | confirmed |
| "$57K /yr/pod" ORC + "60–110 kW" | `EngineeringAdvantages.tsx:43-46`, `PodosPod.tsx:69` | confirmed |
| "POD-0042 · REV·F · CONFIDENTIAL — SEED · 2026" | `OptimusInteractive.tsx:118` | confirmed |
| Film "3 MIN" label vs "35-second" code comment | `investContent.ts:63`, `invest/page.tsx:4` | confirmed |
| "Within 72 hours" response promise | `RequestAccessCTA.tsx:30,198` | confirmed |
| Design tokens `--paper #F7F9FB`, `--brand #2563EB`, `--cyan #22D3EE`; `--liquid-glass: blur(60px) saturate(2.5) brightness(1.4)` | `globals.css:13,40,49`; `ProblemDiagnosis.module.css:202` | confirmed |
| Zero exclamation marks in shipped copy | `grep -c '!' siteContent.ts` → 0 | confirmed |
| Apex→www is 307; trailing slash strips via 308 | live `curl -sI` 2026-08-31: 307 and 308 | confirmed |
| Use-case verticals (enterprise/healthcare/universities/manufacturing/financial/gov/edge/supplemental) | `UseCases.tsx:19-74` | confirmed |
| **keyword-map §17: site claims "$130–170M per MW"** | `ProblemDiagnosis.tsx:320` (`useCountUp(155)`) + `:472` ("–170") — actual figure is **$155–170M** | **MISQUOTE — fix** |

**No invented metrics, volumes, customers, or certifications found in any doc.** Not re-verified (method-disclosed, plausible): text baked into `pod.png`/`silo.png` (image inspection) and live h1/h2 counts (live-HTML fetch).

## 3. Deployment-window conflict — caught

`content-and-claims-audit.md` **C1** catches it fully: 90 days (meta, EngineeringAdvantages, all of /invest) vs 90–120 days (PodosPod, ProductShowcase, pod.png) vs <12 weeks (dead siteContent), with file:line cites, plus a 15-row cross-page inconsistency register (C1–C15) and a 19-item founder-decision block. `terminology.md` §"Target qualifier rules" item 6 independently flags the same conflict. Requirement met.

## 4. Design-language lock — invest system forbidden

`design-language-lock.md` forbids the invest ivory/gold system three ways: the "Critical scoping rule" (never import/reference/imitate ivory `#f7f6f2`, gold `#b79a63`, `--iv-*`/`.iv-*` outside `.invest`), do-not-introduce rule #6 ("No `/invest` tokens, gold, ivory, or `.iv-*` classes outside `.invest`… `--gold` is retired"), and the checklist gate "`/invest` styles untouched and unreferenced". Requirement met.

## 5. Findings — corrections required

### F1 (fix): keyword-map.md §17 misquotes the on-site capex figure
Says the site claims "$130–170M per MW"; the site claims **$155–170M** (`ProblemDiagnosis.tsx`). The sibling claims-audit quotes it correctly. One-line fix; the section's conclusion (reconcile before the cost page ships) still stands.

### F2 (fix): keyword-map "Facts baseline" contradicts terminology.md on MEGA SILO
The baseline lists "MEGA SILO = 20 MW product" among facts "usable in content", but `terminology.md` and `banned-claims.md` gate the MEGA SILO (and Optimus) names as **not publishable until founder approval**. Add the naming gate to the baseline. Same gate is also missing from `internal-link-map.md`, which plans `/technology/optimus` and `/pod/mega-silo` URLs without flagging B2/B3 (launch-plan does gate them).

### F3 (update): three docs now trail the repo by one commit
Commit `c2c80a8` ("SEO Sprint 1 infrastructure") landed **after** the docs were written and fixes what they report:
- `metadataBase` is now `https://www.podosai.com` (`layout.tsx:57`) — redirect-map **R2** and launch-plan inconsistency #1 are done-in-repo (mark "resolved at c2c80a8, verify on deploy"). current-site-audit explicitly scopes itself to the deployed state at `333a408`, so it stands as written.
- `sitemap.ts` was refactored to derive from `src/lib/seo/site.ts` `INDEXABLE_ROUTES` — current-site-audit §6's description of the old inline file is stale, though its `lastModified: new Date()` criticism (gap #9) still applies to the new code.
- `src/lib/seo/`, `src/components/seo/` (jsonld, Breadcrumbs, EvidenceSource, LastVerified), `src/content/` are now committed, no longer "uncommitted scaffolding".

### Minor (no rewrite needed)
- current-site-audit pins `333a408`, claims-audit pins the older `d847028`; both commits exist and every claims-audit line cite checked was still accurate against the current tree.
- internal-link-map labels `/deploy` "the 90-day … path" without a C1 qualifier — internal doc, but keep the target label when copy is written.
- Cross-doc URL architectures diverge (keyword-map: `/platform`, `/engineering/liquid-cooling`… vs internal-link-map: `/pod`, `/engineering/thermos-enclosure`…). internal-link-map already flags this and defers to reconciliation; resolve before Sprint 4.

## 6. Weak-section rewrite list

1. `keyword-map.md` §17 — correct $130–170M → $155–170M (F1).
2. `keyword-map.md` facts-baseline paragraph — add MEGA SILO/Optimus naming gate (F2).
3. `internal-link-map.md` §1 — annotate `/technology/optimus` and `/pod/mega-silo` rows as blocked on B3 naming approval (F2).
4. `redirect-map.md` §3 R2 and `launch-plan.md` inconsistency #1 — mark resolved at `c2c80a8`, pending deploy verification (F3).
5. `current-site-audit.md` §6 — one-line note that sitemap.ts was refactored post-audit (F3).

No section requires a ground-up rewrite; all five are surgical edits.
