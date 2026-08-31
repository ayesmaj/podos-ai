# ASSETS.md — PODOS Configurator image system

How the Configurator's visual assets are produced, governed, and regenerated. Mirrors the `/invest` pipeline so there is one house workflow, not two.

## Pieces

| Piece | Path | Role |
|---|---|---|
| Prompt registry | `src/data/configurator-page-images.ts` | Single source of truth: id, section, prompt, alt text, src, dimensions, status, `conceptual` flag |
| Generator | `scripts/generate-configurator-images.mjs` | GPT Image 2 via OpenAI Images API; concurrency 3; 429/5xx retry with backoff; flips `status` in the registry |
| WebP pass | `scripts/webp-configurator-images.mjs` | Converts PNG → WebP (q90) and repoints registry `src` paths; `--prune` deletes the PNGs |
| Output | `public/visuals/configurator/` | Served assets |

## Hard-won rule: do not ask for the wordmark

A 7-agent visual QA pass over wave 1 (2026-08-31) found one systemic defect: **GPT Image 2 garbles the PODOS wordmark whenever it renders below roughly 40px wide** — three assets came back reading `POOOS` / `POCOS`, and others carried invented stamped marks (`3GRE` on a base frame), garbled licence plates, and nonsense micro-lettering on connector panels. A misspelled brand mark on a founder-facing asset is a hard fail.

The fix is structural, not per-prompt:

- `CFG_DNA` no longer requests a wordmark — it says **unmarked exterior**.
- `UNBRANDED` is appended to every pod-in-frame prompt: *"The enclosure is unbranded in this frame: no wordmark, no lettering on any surface."*
- `NO_TEXT` forbids stamped, embossed, engraved, etched or printed text on any panel, frame, foot, lug, cabinet or nameplate, plus licence plates, decals and placards, and requires label areas to be blank untextured surfaces.
- The wordmark is requested **only** where it is the subject and renders large — currently just `opt-branding-package`, which passes with a clean correct mark and uses `logo.png` as a reference.

Genuine regulatory signage (an `OVERSIZE LOAD` banner) is the one permitted exception, because it is real, correctly spelled, and belongs in the scene.

Where a page needs the brand on a visual, put the wordmark in **HTML or PDF text over the image**, never inside the generated pixels.

## Brand fidelity — how the pod stays the pod

Every prompt that has a PODOS unit in frame embeds `CFG_DNA` (the shared product-description constant) **and** the generator passes real brand references to `/v1/images/edits` rather than generating from text alone:

- `public/products/pod.png` — the canonical pod render (all pod-in-frame assets)
- `public/optimus/optimus-pod-front.png` — front elevation (interior/rack shots)
- `public/logo.png` — the wordmark (branding shots)

Equipment-only option cards (CDU, dry cooler, UPS, transformer, generator, network fabric, fiber handoff, spares kit, customer-furnished racks) are listed in `NO_REFS` and generate without a pod reference, because no PODOS unit belongs in frame.

Art direction is the approved `/invest` V3 direction: **black PODOS hardware inside a bright premium world** — warm white architecture, daylight industrial spaces, matte-black hardware, blue only as a tiny operational accent. Never a black void, never cyberpunk. Every prompt carries the `NO_SCIFI` negative constant.

## Commands

```bash
node --env-file=.env.local scripts/generate-configurator-images.mjs
```

That generates every entry whose `status` is not `ready`. To force one asset:

```bash
node --env-file=.env.local scripts/generate-configurator-images.mjs stage-cooling
```

Then convert and repoint:

```bash
node scripts/webp-configurator-images.mjs --prune
```

## Rules

1. **One image = one placement** (founder rule). Configurator assets are dedicated — they never reuse `/invest` or homepage renders, and no configurator asset is used twice across placements.
2. **Every asset is `conceptual: true`** — these are AI concept renders, not documentary proof. UI and PDF must label them: *"Conceptual visualization only. Final placement, clearances, interfaces, and appearance are subject to site engineering and approved construction documents."*
3. **No text in images.** Headings, labels, prices, and legal copy are real HTML/PDF text. The only lettering permitted in-frame is the correct PODOS wordmark on branded product shots.
4. **Alt text lives in the registry** and is required — `scripts/verify-seo.mjs` fails any indexable page with an image missing `alt`.
5. **Cache-busting**: if an asset is regenerated after being referenced in a page, bump its `?v=` and add a `/visuals/configurator/**` entry to `images.localPatterns` in `next.config.ts` — query strings on local images are otherwise blocked outside `/visuals/invest/**`.
6. **Cost**: each high-quality generation is a paid API call taking 80–150s. Regenerate deliberately, one id at a time, not by resetting the whole registry.

## Visual QA (run this after every wave)

Generation is not done when the files exist. Every wave gets an adversarial visual review — agents open the brand references and each generated file, and judge four things: pod fidelity against `pod.png`, any readable invented text or logos, art direction (bright premium world, matte black, no sci-fi), and fitness for the placement the id implies. Verdicts are `pass` / `minor-issue` / `regenerate`.

Wave 1 result: **23 pass, 19 minor, 4 regenerate**. Everything flagged for invented text or a materially wrong subject was re-prompted and regenerated; purely cosmetic notes (a crop nit, a slightly cool graphite) were accepted.

## Coverage — 99 assets across two waves

Wave 1 (46): wizard stage (14), site-type scenes (9), option cards (23).

Wave 2 (53), mapped to the step architecture in the master brief:
- **Workload cards (6)** — inference, training, HPC, rendering, research, confidential compute (Step 02)
- **Site types (6)** — coastal, cold climate, desert solar, port logistics, mining, telecom edge (Step 03)
- **Exterior options (6)** — lighting, corrosion, high altitude, roof equipment, service doors, seismic base (Step 05)
- **Cooling options (5)** — manifold, leak detection, heat recovery, waterless, pump redundancy (Step 07)
- **Power options (5)** — busway/PDU, battery storage, microgrid, metering, EPO (Step 08)
- **Network options (3)** — out-of-band management, cross-connect, security appliance (Step 09)
- **Safety options (4)** — fire detection, water leak, cameras, access control (Step 10)
- **Software (2)** — remote operations desk, telemetry wall (Step 11)
- **Deployment services (6)** — site survey, permit package, civil prep, electrical work, FAT, training (Step 12)
- **Support (3)** — preventive maintenance, on-site response, annual inspection (Step 13)
- **Redundancy tiers (3)** — N, N+1, 2N
- **Comms surfaces (4)** — `/configure` OpenGraph card, two email headers, a processing-state backdrop

Every wave-2 subject is drawn from the option categories the master brief enumerates — none were invented. **Which of them survive to production depends on the approved catalog** (see [BUSINESS_DATA_REQUIRED.md](BUSINESS_DATA_REQUIRED.md) §B/§G): an image for an option PODOS does not actually sell gets deleted, not shipped.
