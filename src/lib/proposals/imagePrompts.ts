/**
 * imagePrompts.ts — the controlled GPT Image 2 asset set for the proposal
 * document (redesign brief §11–§15). Pure data: consumed by the admin
 * generation route (server) and scripts/generate-proposal-assets.mjs.
 *
 * Rules encoded here, not left to memory:
 *  - generated images carry NO dynamic client data (no names, numbers, prices,
 *    dates, specs, labels) — all of that stays HTML/SVG/PDF text
 *  - product shape is preserved by EDITING the approved pod render, never
 *    generating a pod from scratch
 *  - the official wordmark is composited in code, never drawn by the model
 */

export type ProposalAssetType = "cover" | "cutaway" | "deployment";

export interface ProposalAssetSpec {
  type: ProposalAssetType;
  /** GPT Image 2 size (w x h). Portrait for the A4 cover column, landscape for page-2 visuals. */
  size: "1024x1536" | "1536x1024";
  /** approved reference renders passed as image[] inputs to /v1/images/edits */
  references: string[];
  /** where the approved production file lives (webp for web, png kept for print pipelines) */
  file: string;
  alt: string;
  prompt: string;
}

const STYLE_BIBLE = `
Visual mode: bright technical-light premium. Porcelain-white studio, pale-blue architectural gradient,
faint blueprint geometry, thin cobalt (#1B55F5) and cyan (#28C4EA) technical pathways only where meaningful.
Materials: matte-black industrial shell with realistic metal, precise panel lines, restrained blue LED edge.
Lighting: clean white key light, soft cobalt rim light, controlled reflections, no deep-black scene, no neon.
Camera: low perspective distortion; product scale realistic and large; nothing cropped.
Absolutely no text, numbers, invented logos, fake labels, people, server rooms, city skylines, sunsets,
cyberpunk styling, sci-fi particles, shipping-container look, or distorted geometry.`;

export const PROPOSAL_ASSETS: Record<ProposalAssetType, ProposalAssetSpec> = {
  cover: {
    type: "cover",
    size: "1024x1536",
    references: ["public/products/pod.png"],
    file: "public/visuals/proposal/cover-pod-hero",
    alt: "PODOS modular AI data-center unit on an engineering platform in a bright studio environment",
    prompt: `Create a premium portrait-oriented product visualization for an A4 PODOS AI proposal cover.

Preserve the exact PODOS modular data-center unit from the supplied reference: same proportions, long
horizontal body, structural corners, access panels, vents, blue LED edge geometry, matte-black industrial
finish, and hardware details.

Place the full pod on a refined circular or low rectangular white engineering platform positioned toward the
lower-right of the composition.

Background: bright porcelain-white studio environment with a soft pale-blue architectural gradient, subtle
blueprint floor lines, faint technical measurement geometry, and restrained cyan data paths.

Lighting: bright premium product photography, clean white key light, soft cobalt rim light, controlled
reflections, realistic matte metal, no deep black scene.

Composition: large product scale, no cropping, enough negative space on the left and upper left for proposal
typography, sophisticated depth, slightly elevated three-quarter view, realistic industrial scale.

No text. No numbers. No invented logos. No people. No server room. No city skyline. No excessive glow.
No dark cyberpunk style. No shipping-container appearance. No distorted geometry.

The result must look like a custom $250,000 enterprise infrastructure proposal visual, not a stock image.
${STYLE_BIBLE}`,
  },
  cutaway: {
    type: "cutaway",
    size: "1536x1024",
    references: ["public/products/pod.png", "public/optimus/optimus-pod-front.png"],
    file: "public/visuals/proposal/system-cutaway",
    alt: "Technical cutaway of the PODOS unit showing rack positions, cooling distribution, power and fiber paths",
    prompt: `Create a bright premium technical cutaway visualization of the supplied PODOS modular AI data-center unit
for a commercial proposal.

Preserve the exact exterior geometry and product proportions.

Show a controlled partial cutaway through one side of the pod, revealing: organized rack positions, compute
zones, cooling distribution, power path, network/fiber path, monitoring and controls. Use clean physically
logical component organization.

Visual style: high-end aerospace engineering illustration combined with realistic product rendering, bright
white and pale cool-gray environment, thin cobalt and cyan technical pathways, subtle transparent layers,
precise materials, no clutter.

Camera: wide orthographic-style three-quarter side view with minimal perspective distortion.

Background: clean white technical field with faint blueprint geometry and generous empty space for SVG labels
added later in code.

No text. No numbers. No fake labels. No people. No random cables. No impossible electrical or coolant
geometry. No dark background. No exploded sci-fi particles. No changed pod shape.

The image must remain understandable at A4 print size.
${STYLE_BIBLE}`,
  },
  deployment: {
    type: "deployment",
    size: "1536x1024",
    references: ["public/products/pod.png"],
    file: "public/visuals/proposal/deployment-site",
    alt: "PODOS unit placed on an engineered pad with power and fiber connection pathways at a deployment site",
    prompt: `Create a premium bright deployment visualization for a PODOS AI commercial proposal.

Show the approved matte-black PODOS modular data-center unit placed on a clean, engineered concrete or modular
pad at a credible enterprise deployment site.

Use a straight side-to-three-quarter view with limited perspective distortion.

Include only: prepared pad, power connection pathway, fiber connection pathway, cooling or thermal-module
connection where appropriate, subtle approved external equipment, restrained landscaping or industrial context,
enough environment to demonstrate deployment without becoming a hero landscape.

Show the connections using thin cobalt and cyan technical overlays.

Lighting: clear bright daylight, white-blue atmosphere, soft realistic shadows, high-end architectural
visualization.

No workers. No trucks. No dramatic sunset. No city fantasy. No wind turbines. No fake text. No labels.
No distorted product. No excessive glow.

Keep the visual clean, credible, modular, and engineering-led.
${STYLE_BIBLE}`,
  },
};

/** Public URL for an approved proposal asset (webp for the web viewer). */
export function proposalAssetUrl(type: ProposalAssetType, ext: "webp" | "png" = "webp"): string {
  return `${PROPOSAL_ASSETS[type].file.replace(/^public/, "")}.${ext}`;
}
