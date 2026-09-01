# 02 - DESIGN LOCK
The PODOS visual system is already locked; this file scopes it to the private
platform. Parents: docs/seo/design-language-lock.md (site-wide) and
docs/configurator/DESIGN_LOCK.md (tokens, motion, gotchas).

## Tokens (verbatim from src/app/globals.css)
Porcelain --paper #F7F9FB / --canvas #EEF2F6 / --panel #FFF; ink #0F172A
hierarchy; cobalt --brand #2563EB deep #1D4ED8; cyan #22D3EE (secondary
technical accent); --status green #22C55E ONLY for approved/online/signed;
1px --edge* hairlines; radii 10/12/14; brand 135deg gradient for primary
actions; Geist (display) + Inter Tight (body). The monospace face was
REMOVED site-wide by founder order - metadata/labels use Inter Tight with
tracking, never a mono font.

## Private surfaces (client workspace + /ops)
- NO marketing nav, footer, energy layer, Lenis smooth-scroll, hero video,
  3D. (Gated via chromeless prefixes + motion-provider checks; keep the
  prefix list in src/lib/site/chromeless.ts in lockstep with routes.)
- Client utility bar only: PODOS logo, prepared-for, project, proposal no.,
  version, CONFIDENTIAL chip, autosave state, help, secure exit.
- Admin shell: light sidebar app, full desktop width (comfortable at
  1366-1600+), no narrow centered column, no dark hacker theme.
- Founder mockups (2026-09-01) are the layout contract for both surfaces;
  every data value inside them is placeholder.

## Menu image system (unchanged verdict)
Current 99-webp library is photographic; 0/99 at 4:3 - unusable as menu
diagrams. Required: orthographic front/side/top, porcelain ground, faint
cobalt blueprint grid, near-black shell, cobalt supply / cyan return paths,
4:3, contain, 10-14% padding, labels as SVG/HTML overlays never baked in.
Regenerate through scripts/generate-configurator-images.mjs with an ORTHO
style constant (GPT prompt template in the master brief section 10.3);
prefer hand-authored SVG for schematics (cooling loop, one-line power).

## Forbidden
ACP orange/black; SaaS purple; serif; cursor effects; particles; heavy
glass; template admin look; narrow article columns; photographic menu cards.
