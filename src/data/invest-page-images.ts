/**
 * invest-page-images.ts — prompt registry for AI-generated /invest visuals.
 *
 * Each entry is the single source of truth for one generated asset:
 * its prompt (editable), where it renders, and its current status.
 * Regenerate any asset with:  node scripts/generate-invest-images.mjs [id]
 * After regenerating, bump the ?v= on that asset's src — the version query
 * busts both the browser cache and Next's image-optimizer cache.
 * Assets land in public/visuals/invest/<id>.png and are served through
 * next/image (which auto-delivers WebP/AVIF).
 */

export type InvestImageStatus = "pending" | "ready" | "failed";

export interface InvestImage {
  id: string;
  section: string;
  prompt: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  status: InvestImageStatus;
}

export const INVEST_IMAGES: InvestImage[] = [
  {
    id: "hero-product",
    section: "InvestHero",
    prompt:
      "Using the reference images of the PODOS modular compute pod (long, low, matte-black unit with segmented side panels, rounded corners, and a solar-panel roof) and the PODOS logo, create a cinematic luxury product reveal render of this exact pod. Keep the pod's proportions and design faithful to the reference. Dramatic hero composition, deep navy-black void background (#02050C), electric blue rim light (#1FA8FF) tracing the pod's edges, subtle glowing particle waves on the floor, glossy dark reflective ground, Octane-quality photorealism, no added text or labels beyond the small PODOS wordmark already on the pod.",
    alt: "PODOS modular compute pod in a dark studio with electric blue rim lighting",
    src: "/visuals/invest/hero-product.png?v=2",
    width: 1536,
    height: 1024,
    status: "ready",
  },
  {
    id: "opportunity-network",
    section: "OpportunitySection",
    prompt:
      "Using the reference image of the PODOS modular compute pod (long, low, matte-black unit with segmented panels and solar roof), create a conceptual premium visualization: a traditional massive data center facility on the left dissolving into an elegant distributed network of many PODOS pods connected by glowing electric-blue energy lines (#1FA8FF) across a deep navy landscape (#02050C). Keep every pod faithful to the reference design. Cinematic isometric composition, luminous atmosphere, dramatic contrast, suitable for a luxury investor page. No text, no labels.",
    alt: "Traditional data center transforming into a glowing network of PODOS modular pods",
    src: "/visuals/invest/opportunity-network.png?v=2",
    width: 1536,
    height: 1024,
    status: "ready",
  },
  {
    id: "ownership-abstract",
    section: "OwnershipCalculator",
    prompt:
      "Using the reference image of the PODOS logo (spherical mark built from curved blue gradient blades), create a luxurious fintech-style abstract visual representing ownership and capital participation: elegant concentric glass rings orbiting a glowing core that echoes the logo's curved-blade sphere geometry and its light-blue-to-deep-blue gradient (#67E8F9 to #1FA8FF). Deep navy background (#02050C), precision geometry, premium glowing glass textures, subtle bokeh starfield, sophisticated dark atmosphere. No text, no numbers, no labels.",
    alt: "Abstract glowing blue rings echoing the PODOS logo, representing ownership",
    src: "/visuals/invest/ownership-abstract.png?v=2",
    width: 1024,
    height: 1024,
    status: "ready",
  },
  {
    id: "capital-allocation",
    section: "CapitalAllocationSection",
    prompt:
      "Using the reference image of the PODOS modular compute pod (long, low, matte-black unit with segmented panels and solar roof), create a premium concept image of a high-tech factory assembly line manufacturing these exact pods: robotic arms with electric-blue task lighting (#1FA8FF) assembling matte-black pod modules in a dark refined industrial hall, deep navy atmosphere (#02050C), cinematic rim lighting, luxury industrial photography feel, dramatic contrast, believable engineering detail. Keep the pods faithful to the reference design. No text, no labels.",
    alt: "PODOS pods on a high-tech assembly line with electric blue lighting",
    src: "/visuals/invest/capital-allocation.png?v=2",
    width: 1536,
    height: 1024,
    status: "ready",
  },
  {
    id: "final-cta",
    section: "FinalCTA",
    prompt:
      "Using the reference image of the PODOS modular compute pod (long, low, matte-black unit with segmented panels and solar roof), create an aspirational cinematic wide shot of a vast fleet of these exact pods deployed in perfect rows across a dark minimalist plain at night, each pod traced with electric blue rim light (#1FA8FF), glowing energy lines connecting them across the ground, deep navy sky (#02050C) with a subtle starfield, sense of massive scale and future growth, refined industrial design, dramatic contrast, wealthy powerful mood. Keep the pods faithful to the reference design. No text, no labels.",
    alt: "Vast night-time fleet of PODOS pods glowing with electric blue light",
    src: "/visuals/invest/final-cta.png?v=2",
    width: 1536,
    height: 1024,
    status: "ready",
  },
];

export const getInvestImage = (id: string) =>
  INVEST_IMAGES.find((i) => i.id === id);
