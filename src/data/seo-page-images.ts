/**
 * seo-page-images.ts — generated-image registry for the SEO pillar pages.
 *
 * Art direction — MAIN SITE system (docs/seo/design-language-lock.md):
 * bright white / cool light-gray technical environments, blueprint-blue
 * and cyan accents matching the brand gradient, soft neutral daylight,
 * precision engineering-catalog photography. The matte-black pod stays
 * matte black. NEVER the invest ivory/gold world, never dark voids or
 * neon. One image = one placement (founder rule).
 *
 * Generate: node --env-file=.env.local scripts/generate-invest-images.mjs --file=seo [ids…]
 */

export const SEO_STYLE_DNA =
  "Bright clean technical environment: white and cool light-gray architectural surfaces, subtle blueprint-blue and cyan accents (#2563EB to #22D3EE family), soft neutral daylight, precision industrial-catalog photography, premium light modern infrastructure-brand aesthetic. No dark voids, no cyberpunk, no neon, no warm gold or ivory tones.";

/** Hard negative — company claims must live in gated HTML, never in pixels. */
export const NO_TEXT =
  "ABSOLUTELY NO TEXT ANYWHERE IN THE IMAGE: no signage, no wall lockups, no spec panels, no stat boards, no dimension callouts, no floor decals, no placards, no banners, no monument signs, no nameplates, no watermarks, no numbers, no units, no measurements, no slogans, no blueprint labels, no garbled pseudo-lettering. Surfaces stay clean and blank. The only permitted marking is the small PODOS wordmark already present on the unit's flank in the reference image.";

export const POD_DNA =
  "The PODOS Pod: a physically believable modular AI compute unit — long horizontal industrial enclosure, premium matte-black and graphite exterior, rounded end sections, clean modular panel seams, low heavy-duty structural base, integrated solar-panel roof surface, restrained PODOS wordmark, realistic service points, serious engineered proportions, faithful to the reference image. No redesign.";

export type SeoImageStatus = "pending" | "ready" | "failed";

export interface SeoImage {
  id: string;
  page: string;
  prompt: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  status: SeoImageStatus;
  conceptual: boolean;
}


export const SEO_IMAGES: SeoImage[] = [
  /* ---------------- /platform ---------------- */
  {
    id: "platform-overview",
    page: "/platform",
    prompt: `Editorial wide shot of the PODOS Pod on a clean white studio pad with a large bright architectural wall behind it, a thin luminous blue data line rising from the pod and resolving into an elegant abstract layer of translucent blue planes above (hardware-to-software metaphor). ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "PODOS Pod beneath an abstract translucent software layer, representing the integrated platform",
    src: "/visuals/seo/platform-overview.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "platform-integration",
    page: "/platform",
    prompt: `Clean overhead three-quarter view of the PODOS Pod docked to a bright technical site pad with precise blueprint-blue utility markings on light concrete: power feed, fiber route, cooling interface — drawn as thin engineering linework on the ground around the unit. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Overhead view of a PODOS Pod on a marked technical pad showing power, fiber, and cooling interfaces",
    src: "/visuals/seo/platform-integration.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },

  /* ---------------- /platform/podos-pod ---------------- */
  {
    id: "pod-hero-studio",
    page: "/platform/podos-pod",
    prompt: `Hero product photograph of the PODOS Pod, front three-quarter angle, in an enormous bright white technical studio with a subtle blueprint grid floor, soft daylight, crisp reflections, catalog-cover quality. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "PODOS Pod front three-quarter view in a bright technical studio",
    src: "/visuals/seo/pod-hero-studio.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "pod-scale-humans",
    page: "/platform/podos-pod",
    prompt: `The PODOS Pod in a bright white exhibition hall with two engineers in light-gray workwear standing beside it for true scale (unit is 40 ft long, 8 ft tall), neutral daylight, honest proportions, documentary-clean composition. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Engineers standing beside a PODOS Pod showing its 40-foot scale",
    src: "/visuals/seo/pod-scale-humans.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "pod-panel-detail",
    page: "/platform/podos-pod",
    prompt: `Tight macro detail of the PODOS Pod's matte-black modular panel seams, service latch, and the edge of the solar roof line, shallow depth of field, bright neutral light, material-quality product photography. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Macro detail of PODOS Pod panel seams and service latch",
    src: "/visuals/seo/pod-panel-detail.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "pod-siting-pad",
    page: "/platform/podos-pod",
    prompt: `The PODOS Pod installed on a fresh light-concrete pad at a tidy industrial site under a bright overcast sky, low fence line and small switchgear cabinet nearby, realistic siting context, clean editorial framing. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "PODOS Pod installed on a concrete pad at a clean industrial site",
    src: "/visuals/seo/pod-siting-pad.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },

  /* ---------------- /platform/syntropic ---------------- */
  {
    id: "syntropic-memory-abstract",
    page: "/platform/syntropic",
    prompt: `Abstract technical visualization of GPU memory pressure: dense translucent blue cubes compressing into a sparser, ordered lattice, rendered as precise glass geometry on a bright white field with fine blueprint gridlines, elegant scientific-figure aesthetic. No hardware, no people. ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Abstract visualization of dense memory blocks compressing into an ordered lattice",
    src: "/visuals/seo/syntropic-memory-abstract.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "syntropic-datapath",
    page: "/platform/syntropic",
    prompt: `Minimal abstract render of a data path: a wide stream of fine blue light filaments narrowing through a precise crystalline gate and emerging compact and ordered, on a clean white background with subtle cyan accents, premium scientific illustration. No hardware, no text. ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Abstract data stream narrowing through a crystalline gate, representing inference efficiency",
    src: "/visuals/seo/syntropic-datapath.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },

  /* ---------------- /engineering ---------------- */
  {
    id: "engineering-hub-cutaway",
    page: "/engineering",
    prompt: `Technical cutaway of the PODOS Pod from a high three-quarter angle on a pure white background: outer shell lifted to reveal ordered internal zones (power electronics, coolant loops, rack rows, network spine), rendered like a premium engineering-manual plate with blueprint-blue section lines. Leave label areas empty. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Engineering cutaway plate of the PODOS Pod showing internal system zones",
    src: "/visuals/seo/engineering-hub-cutaway.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "engineering-systems-bench",
    page: "/engineering",
    prompt: `Bright engineering-lab bench scene: precision components laid out in a neat grid on white — a copper cold plate, coolant quick-disconnects, a busbar section, fiber cassette, sensor module — top-down catalog photography with thin blueprint-blue callout ticks. No text. ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Engineering components laid out in a grid: cold plate, quick-disconnects, busbar, fiber cassette",
    src: "/visuals/seo/engineering-systems-bench.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },

  /* ---------------- /engineering/direct-to-chip-liquid-cooling ---------------- */
  {
    id: "cooling-coldplate-macro",
    page: "/engineering/direct-to-chip-liquid-cooling",
    prompt: `Macro photograph of a direct-to-chip liquid cooling cold plate mounted on a GPU module: machined copper microchannel plate, two coolant fittings with blue anodized collars, clean cabling, bright neutral studio light, extreme technical clarity. No visible brand logos. ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Copper direct-to-chip cold plate with coolant fittings mounted on a GPU module",
    src: "/visuals/seo/cooling-coldplate-macro.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "cooling-cdu-row",
    page: "/engineering/direct-to-chip-liquid-cooling",
    prompt: `INTERIOR-ONLY scene, no PODOS unit exterior in frame: a coolant distribution unit (CDU) cabinet with open service panels beside a white server rack row inside a bright technical equipment corridor — manifolds, flow meters, supply and return piping in orderly runs, cool neutral lighting, precision mechanical-room photography. Do NOT include any solar panels or rooftop array (this is indoors). ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Coolant distribution unit and manifold piping inside a bright PODOS Pod corridor",
    src: "/visuals/seo/cooling-cdu-row.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "cooling-heat-rejection",
    page: "/engineering/direct-to-chip-liquid-cooling",
    prompt: `Exterior view of dry coolers / heat-rejection units on a light concrete pad beside the PODOS Pod, fan arrays visible, warm-water pipe run connecting them, bright overcast daylight, tidy industrial landscaping, editorial infrastructure photography. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Dry cooler heat-rejection units connected to a PODOS Pod on a concrete pad",
    src: "/visuals/seo/cooling-heat-rejection.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },

  /* ---------------- /engineering/data-center-power-architecture ---------------- */
  {
    id: "power-switchgear-bay",
    page: "/engineering/data-center-power-architecture",
    prompt: `Interior of a bright electrical room: medium-voltage switchgear lineup in light-gray cabinets with closed panels, orderly cable trays overhead, polished concrete floor, cool white lighting with subtle blue indicator accents, utility-grade craftsmanship. No readable labels. ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Medium-voltage switchgear lineup in a bright electrical room",
    src: "/visuals/seo/power-switchgear-bay.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "power-transformer-yard",
    page: "/engineering/data-center-power-architecture",
    prompt: `A compact pad-mounted transformer and utility interconnection cabinet on light gravel beside the PODOS Pod, cable trench with covers running between them, bright daylight, chain-link perimeter softly out of focus, believable utility engineering. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Pad-mounted transformer and interconnection cabinet feeding a PODOS Pod",
    src: "/visuals/seo/power-transformer-yard.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "power-busway-run",
    page: "/engineering/data-center-power-architecture",
    prompt: `Interior technical view along a white equipment corridor: overhead busway duct with tap-off boxes feeding rack positions, tidy conduit and cable-tray runs, bright even lighting, precision electrical installation photography. No readable labels. ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Overhead busway with tap-off boxes feeding rack positions in a bright corridor",
    src: "/visuals/seo/power-busway-run.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },

  /* ---------------- /deploy ---------------- */
  {
    id: "deploy-crane-lift",
    page: "/deploy",
    prompt: `A mobile crane lowering the PODOS Pod onto a prepared light-concrete pad, rigging taut, two spotters in light-gray safety gear guiding placement, bright morning daylight, clean staging area, professional heavy-lift photography. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Crane lowering a PODOS Pod onto its prepared concrete pad",
    src: "/visuals/seo/deploy-crane-lift.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "deploy-pad-prep",
    page: "/deploy",
    prompt: `Site-readiness scene before delivery: a freshly cured concrete pad with embedded anchor points and stub-up conduits, surveyor tripod, marked utility trench, bright neutral daylight — an empty stage awaiting the unit. No pod in frame. ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Prepared concrete pad with anchor points and conduit stub-ups awaiting a PODOS Pod",
    src: "/visuals/seo/deploy-pad-prep.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "deploy-commission-check",
    page: "/deploy",
    prompt: `Commissioning scene at the PODOS Pod's open service bay: an engineer with a rugged tablet checking systems, interior rack glow spilling soft white light, service cover opened on gas struts, bright exterior daylight, believable acceptance-testing moment. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Engineer commissioning a PODOS Pod at its open service bay",
    src: "/visuals/seo/deploy-commission-check.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },

  /* ---------------- /use-cases ---------------- */
  {
    id: "usecase-campus",
    page: "/use-cases",
    prompt: `The PODOS Pod placed discreetly behind a modern university research building with light brick and glass architecture, neat landscaping, students far in the background, bright afternoon light — on-campus AI capacity without a datacenter build. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "PODOS Pod sited behind a university research building",
    src: "/visuals/seo/usecase-campus.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "usecase-factory",
    page: "/use-cases",
    prompt: `The PODOS Pod beside a bright modern manufacturing plant with white cladding, loading docks in the distance, forklift passing, clean industrial yard, overcast-bright light — compute at the point of production. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "PODOS Pod in the yard of a modern manufacturing plant",
    src: "/visuals/seo/usecase-factory.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "usecase-hospital",
    page: "/use-cases",
    prompt: `The PODOS Pod on a screened utility pad beside a contemporary hospital wing (white facade, glass), discreet placement near existing mechanical equipment, bright clean daylight — data kept on premises. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "PODOS Pod on a utility pad beside a modern hospital building",
    src: "/visuals/seo/usecase-hospital.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },
  {
    id: "usecase-edge-site",
    page: "/use-cases",
    prompt: `The PODOS Pod at a remote edge site: high-plains landscape with a small solar array and a telecom mast nearby, crisp morning light, vast sky, the unit self-contained on its pad — believable off-grid-capable siting. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "PODOS Pod at a remote edge site with solar array and telecom mast",
    src: "/visuals/seo/usecase-edge-site.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },

  /* ---------------- /compare/... ---------------- */
  {
    id: "compare-split-frame",
    page: "/compare/modular-ai-data-center-vs-traditional-data-center",
    prompt: `Single bright editorial frame split by a thin vertical blueprint-blue line: LEFT — a large traditional data-center construction site (cranes, concrete shell, daylight); RIGHT — the finished PODOS Pod operating on its small pad. Same light grading both sides, neutral and honest, no winner styling. ${POD_DNA} ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "Split frame comparing a traditional data center construction site with an installed PODOS Pod",
    src: "/visuals/seo/compare-split-frame.png", width: 1536, height: 1024, status: "ready", conceptual: true,
  },

  /* ---------------- /resources/ai-infrastructure-glossary ---------------- */
  {
    id: "glossary-abstract",
    page: "/resources/ai-infrastructure-glossary",
    prompt: `Quiet abstract header image: fine blueprint-blue engineering linework — pipe runs, one-line electrical symbols, rack outlines — etched sparsely across a bright white field with one small cyan accent node, minimal and encyclopedic. No text, no readable symbols. ${SEO_STYLE_DNA} ${NO_TEXT}`,
    alt: "",
    src: "/visuals/seo/glossary-abstract.png", width: 1536, height: 1024, status: "ready", conceptual: false,
  },
];

export const getSeoImage = (id: string) => SEO_IMAGES.find((i) => i.id === id);
