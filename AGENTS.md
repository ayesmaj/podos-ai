<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:visual-assets-policy -->
# Visual Assets — MANDATORY behavior

When asked to add visual elements (cards, icons, illustrations, hero shots, decorative graphics, backgrounds), follow this routing strictly:

## Routing rules

1. **UI icons** (search, menu, arrow, settings, cpu, server, network, etc.)
   → Use `lucide-react`. **Never hand-draw SVG for these.**
   ```tsx
   import { Cpu, Server, Network, Shield } from "lucide-react";
   <Cpu className="w-16 h-16 text-cyan-400" strokeWidth={1.5} />
   ```

2. **Hero illustrations, branded renders, product mockups, decorative graphics**
   → Use the **`/generate-visual` skill** (installed at `~/.claude/skills/generate-visual/`). It exposes two Python scripts invoked via Bash:
     - **`scripts/gemini.py`** (Nano Banana, free tier 1500/day) — DEFAULT. Best for first-pass generation, edits, brand-consistent variations.
     - **`scripts/fal.py`** (Flux Pro / Recraft / Ideogram, paid) — escalate when Gemini misses the quality bar after 2 iterations.
   → Save output to `public/visuals/<descriptive-name>.png`. Next.js `<Image>` will auto-deliver WebP/AVIF.
   → Import as Next.js `<Image>` with explicit width/height and `alt`.
   → **Never hand-draw decorative SVG for hero/illustration purposes.**

   Invocation pattern:
   ```bash
   python "C:/Users/smadj/.claude/skills/generate-visual/scripts/gemini.py" \
       "<full descriptive prompt with style + subject + lighting + colors>" \
       --aspect 16:9 \
       --out "C:/Users/smadj/Documents/podos-ai/public/visuals/<name>.png"
   ```

3. **Interactive 3D scenes** (rotates on scroll, reacts to cursor, animates with data)
   → Use R3F: `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing` (all already installed).
   → Use `<Environment preset="city" />` for reflections, `<EffectComposer>` with `<Bloom>` for glow.

4. **Looping animations** (background effects, micro-interactions, transitions)
   → Source `.lottie` files from LottieFiles, render with `@lottiefiles/dotlottie-react`.

5. **Component patterns** (cards, modals, glass effects, navigation patterns)
   → Check `mcp__magic__21st_magic_component_inspiration` first before writing from scratch.

6. **Stock 3D renders, illustrations, mockup videos** (when fal.ai output isn't satisfactory)
   → Search via `envato-market` MCP, license, download to `public/visuals/`.

## Decision tree — which `/generate-visual` script to call

| Task | Pick this | Why |
|---|---|---|
| First-time generation of a brand new hero shot | `gemini.py` | Free tier, fast, good baseline quality |
| Iterating/editing an existing brand visual | `gemini.py` | Best-in-class for "change X, keep everything else" |
| Composing multiple reference images into one | `gemini.py` | Multi-image input is its strength |
| Hero shot that needs absolute peak photoreal quality | `fal.py --model flux` | Sharper, more detailed than Gemini |
| Vector-style illustrations, transparent BG icons | `fal.py --model recraft` | Built for clean illustration output |
| Marketing graphic with legible custom text in it | `fal.py --model ideogram` | Best text rendering in any image model |
| Budget-conscious bulk generation (50+ images) | `gemini.py` | Free tier (1500/day) covers it |

**Default behavior**: start with `gemini.py`. Only escalate to `fal.py` when Gemini's output doesn't hit the quality bar after 2 iterations.

## Prompt guidelines for image generation

When invoking either script for Podos AI visuals, default prompt scaffold:

```
Cinematic isometric 3D render, photoreal Octane quality, [SUBJECT]
[DETAIL: ports, surfaces, components — be specific]
Lighting: electric cyan rim light from edges, dark navy void background
Subtle starfield with bokeh depth, no fill light, dramatic contrast
Color grade: deep navy-black (#02050C), electric cyan (#1FA8FF), white-hot cores
Aspect ratio: [16:9 hero / 1:1 card / 4:3 portrait]
No text, no labels, transparent or void background
```

Default model preference: **Nano Banana** for first-pass generations and edits (free tier, 1500/day), escalate to **Flux Pro 1.1** via fal.ai only when peak photoreal quality is needed and nano-banana hasn't matched it after 2 iterations.

## Prohibited patterns

- ❌ Hand-writing decorative `<svg>` with `<rect>`, `<circle>`, `<path>` for icons/illustrations.
- ❌ Glow effects via `filter: drop-shadow` on hand-drawn primitives (produces flat, generic-looking output).
- ❌ Tailwind-only "icons" built from `<div>` boxes with borders and gradients.
- ❌ Saving generated PNGs without converting to WebP.

## Escape hatch

If the right tool for a visual isn't available (MCP not connected, package not installed, fal.ai API key missing/rate-limited), **STOP and ask the user before falling back to hand-drawn SVG.** Surface the friction; don't silently produce flat output.
<!-- END:visual-assets-policy -->
