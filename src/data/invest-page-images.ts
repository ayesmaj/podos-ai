/**
 * invest-page-images.ts — prompt registry for AI-generated /invest visuals.
 *
 * V3 art direction: BLACK PODOS HARDWARE inside a BRIGHT PREMIUM WORLD.
 * Warm white architecture, daylight industrial spaces, brushed aluminum,
 * architectural concrete, champagne accents. Blue only as a tiny
 * operational accent. Never a black void, never cyberpunk.
 *
 * Every prompt embeds PODOS_PRODUCT_VISUAL_DNA and the generator script
 * passes the real pod render as an image-edit reference so the product
 * stays consistent across frames.
 *
 * Regenerate:  node --env-file=.env.local scripts/generate-invest-images.mjs [id]
 * After regenerating, bump that asset's ?v= (busts browser + optimizer caches).
 */

export const PODOS_PRODUCT_VISUAL_DNA =
  "The PODOS unit: a physically believable modular AI compute and power infrastructure unit — long horizontal industrial enclosure, premium matte-black and graphite exterior, controlled rounded end sections, clean modular panel seams, low heavy-duty structural base, integrated roof surface, restrained PODOS wordmark, realistic ventilation and service points, serious engineered proportions, faithful to the reference image. No redesign, no spaceship styling, no neon, no fictional logos, no fake text.";

const NO_SCIFI =
  "No neon floors, no black void, no cyberpunk, no holograms, no glowing fantasy energy lines, no fake interface text, no company logos.";

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
  /** true = AI concept render; UI must label it (never documentary proof) */
  conceptual: boolean;
}

export const INVEST_IMAGES: InvestImage[] = [
  {
    id: "hero-pavilion",
    section: "InvestHero",
    prompt: `Monumental photorealistic commercial architecture photograph of the PODOS modular AI infrastructure unit inside an enormous bright industrial pavilion. ${PODOS_PRODUCT_VISUAL_DNA} Warm white polished concrete floor, huge architectural ceiling with white structural beams, soft daylight entering through enormous openings, subtle volumetric haze, brushed aluminum and glass details, bright horizon visible outside. Low 30mm cinematic camera angle. Tiny engineers far in the background for scale. Matte-black unit with controlled highlights and only tiny subtle blue operational status lighting. IMAX-level industrial photography, institutional and expensive mood. ${NO_SCIFI}`,
    alt: "Monumental black PODOS unit inside a vast bright white architectural pavilion with tiny engineers for scale",
    src: "/visuals/invest/hero-pavilion.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "ca-power",
    section: "Collaborations / Film scene 1",
    prompt: `Highly realistic editorial infrastructure photograph set in California: modern high-voltage electrical substation, transmission towers and utility-scale power distribution, dry golden landscape with distant mountains, warm early-morning light. One PODOS unit positioned conceptually near a prepared industrial pad in the middle distance. ${PODOS_PRODUCT_VISUAL_DNA} No utility branding, no identifiable uniforms, credible electrical engineering, institutional infrastructure photography. ${NO_SCIFI}`,
    alt: "California high-voltage substation and transmission lines at dawn with a PODOS unit near a prepared site",
    src: "/visuals/invest/ca-power.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "server-integration",
    section: "Collaborations / Film scene 2",
    prompt: `Ultra-realistic bright technical interior of the PODOS modular infrastructure unit during system integration: high-density server racks, clean fiber distribution, communications and network switching equipment, power distribution, cooling interfaces, disciplined cable management, two engineers performing inspection, realistic rack spacing and service access, bright neutral industrial lighting. ${PODOS_PRODUCT_VISUAL_DNA} No visible manufacturer logos, no blue science-fiction glow, no impossible components. ${NO_SCIFI}`,
    alt: "Bright interior of a PODOS unit with server racks, fiber distribution and engineers inspecting integration",
    src: "/visuals/invest/server-integration.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "traditional-construction",
    section: "Opportunity / Film scene 3",
    prompt: `Photorealistic editorial aerial photograph of an enormous traditional hyperscale data center campus under construction in daylight: tower cranes, poured concrete structures, earthworks, electrical infrastructure staging, hundreds of construction vehicles and workers at realistic scale. Clean professional construction site — represents scale and complexity, not failure or dystopia. Bright natural light, Bloomberg Businessweek editorial aerial photography. ${NO_SCIFI}`,
    alt: "Aerial view of a massive traditional data center construction site with cranes and concrete structures",
    src: "/visuals/invest/traditional-construction.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "product-anatomy",
    section: "ProductAnatomy / Film scene 4",
    prompt: `Technically believable premium cutaway visualization of the PODOS modular AI infrastructure unit on a bright neutral studio background, showing separate but integrated internal zones: electrical input and power distribution at one end, cooling systems, rows of server racks, networking and communications, monitoring, and service access corridor. ${PODOS_PRODUCT_VISUAL_DNA} Architectural visualization quality, graphite and silver materials, warm white environment, clean section cut with the outer shell partially removed — not an impossible transparent hologram. Leave label areas empty; no text in the image. ${NO_SCIFI}`,
    alt: "Cutaway view of a PODOS unit revealing power, cooling, server racks, networking and service zones",
    src: "/visuals/invest/product-anatomy.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "manufacturing",
    section: "DeploymentJourney / Film scene 5",
    prompt: `Realistic premium industrial manufacturing photograph: technicians assembling the PODOS modular enclosure in a bright clean factory hall. Structural assembly, electrical integration, rack installation stations, inspection tooling, overhead gantry crane, natural daylight through high windows plus neutral industrial lighting. ${PODOS_PRODUCT_VISUAL_DNA} Aerospace / advanced-manufacturing documentary quality — believable human work, not robot-arm science fiction, no impossible automation. ${NO_SCIFI}`,
    alt: "Technicians assembling a black PODOS enclosure in a bright factory with overhead crane",
    src: "/visuals/invest/manufacturing.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "transportation",
    section: "DeploymentJourney / Film scene 6",
    prompt: `Highly realistic infrastructure logistics photograph: one PODOS modular unit secured to a heavy industrial lowboy transport trailer traveling on a desert highway toward a prepared deployment site in the American Southwest, warm early-morning light, realistic road and vehicle scale, escort vehicle behind. ${PODOS_PRODUCT_VISUAL_DNA} No futuristic transporter, no impossible dimensions. ${NO_SCIFI}`,
    alt: "PODOS unit on a heavy transport trailer traveling a desert highway at dawn",
    src: "/visuals/invest/transportation.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "commissioning",
    section: "DeploymentJourney / Film scene 6b",
    prompt: `Photorealistic deployment and commissioning scene in bright daylight: one PODOS unit positioned on a prepared concrete industrial pad, technicians in safety gear connecting electrical and communications systems, realistic utility infrastructure and switchgear nearby, service vehicles, credible safety clearances, sophisticated engineering photography. ${PODOS_PRODUCT_VISUAL_DNA} No fake glowing cables. ${NO_SCIFI}`,
    alt: "Technicians commissioning a PODOS unit on a concrete pad with utility connections",
    src: "/visuals/invest/commissioning.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "modular-campus",
    section: "ScaleModel / Film scene 7",
    prompt: `Aerial editorial infrastructure photograph at warm golden dawn: a believable modular AI compute campus containing ten PODOS units arranged in realistic industrial clusters with proper spacing, an electrical substation, utility connections, service roads, drainage, maintenance vehicles and small human figures for scale, real desert terrain with distant mountains. ${PODOS_PRODUCT_VISUAL_DNA} Looks like something that could physically be built tomorrow — no endless duplicated grid, no fantasy network beams. ${NO_SCIFI}`,
    alt: "Aerial dawn view of a realistic campus of about ten PODOS units with substation and service roads",
    src: "/visuals/invest/modular-campus.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "capital-capacity",
    section: "CapitalCycle",
    prompt: `Premium editorial still-life visual narrative on a warm ivory architectural background showing the transformation of capital into physical infrastructure WITHOUT any money imagery: from left to right — engineering drawings and a precision component, a partially assembled PODOS module section, and the finished matte-black PODOS unit, connected by a single thin restrained champagne-gold line. ${PODOS_PRODUCT_VISUAL_DNA} Bright institutional aesthetic, realistic materials, soft studio daylight. Absolutely no coins, bills, charts, or hands shaking. ${NO_SCIFI}`,
    alt: "Editorial sequence from engineering drawings to components to a finished PODOS unit, linked by a thin gold line",
    src: "/visuals/invest/capital-capacity.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  /* ---- dedicated assets (one image = one placement, never recycled) ---- */
  {
    id: "engineering-design",
    section: "DeploymentJourney 01 ENGINEER",
    prompt: `Premium editorial photograph of an engineering design studio where the PODOS unit is being engineered: engineers at large workstations reviewing technical drawings and a physical scale model of the PODOS unit on the desk, large monitors showing wireframe outlines (screens angled away, unreadable), bright daylight studio with warm white walls and architectural shelving, believable professional atmosphere. ${PODOS_PRODUCT_VISUAL_DNA} ${NO_SCIFI}`,
    alt: "Engineers reviewing drawings and a scale model of the PODOS unit in a bright design studio",
    src: "/visuals/invest/engineering-design.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "rack-install",
    section: "DeploymentJourney 03 INTEGRATE",
    prompt: `Highly realistic close-quarters photograph inside the open PODOS unit during rack integration: a technician guiding a high-density server rack into its bay on rails, second technician checking a torque tool, fiber bundles staged on a cart, bright neutral task lighting, believable clearances and cable management. Distinctly closer and more hands-on than a wide interior view. ${PODOS_PRODUCT_VISUAL_DNA} No visible manufacturer logos. ${NO_SCIFI}`,
    alt: "Technicians sliding a server rack into place inside the PODOS unit",
    src: "/visuals/invest/rack-install.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "factory-line",
    section: "OpportunitySection PODOS timeline",
    prompt: `Wide editorial photograph of a bright modular-infrastructure factory hall with three PODOS units in sequential assembly stages along a production line: bare structural frame, partially clad unit, and finished matte-black unit, work platforms and staged components between them, natural daylight through high clerestory windows, aerospace-grade cleanliness. Communicates repeatable manufacturing rhythm. ${PODOS_PRODUCT_VISUAL_DNA} No excessive robot arms. ${NO_SCIFI}`,
    alt: "Three PODOS units in sequential assembly stages along a bright factory line",
    src: "/visuals/invest/factory-line.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "evidence-engineering",
    section: "Evidence 01 ENGINEERING",
    prompt: `Premium editorial still-life of infrastructure engineering work on a warm white desk: precise technical drawings of a long modular unit, a machined aluminum component, calipers, fastener samples and material swatches arranged with architectural order, soft daylight, shallow depth of field, institutional calm. Top-down or three-quarter composition, no people, no readable text on drawings. ${NO_SCIFI}`,
    alt: "Engineering drawings, machined components and measurement tools on a bright desk",
    src: "/visuals/invest/evidence-engineering.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "evidence-power",
    section: "Evidence 02 POWER",
    prompt: `Ultra-realistic technical close-up of the electrical power interface end of the PODOS unit: industrial switchgear panel open for inspection, heavy-gauge conductors, busbars, professional lockout tags, matte-black enclosure surfaces with graphite detailing, bright neutral engineering lighting. Serious utility-grade electrical craftsmanship. ${PODOS_PRODUCT_VISUAL_DNA} ${NO_SCIFI}`,
    alt: "Close-up of the PODOS unit's industrial power interface and switchgear",
    src: "/visuals/invest/evidence-power.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "evidence-cooling",
    section: "Evidence 03 COOLING",
    prompt: `Ultra-realistic technical close-up of the cooling architecture inside the PODOS unit: polished coolant manifolds, precision piping runs, heat-exchanger cores and quick-disconnect fittings in brushed metal and graphite, faint condensation detail, bright clean engineering lighting, believable thermal-engineering craftsmanship. ${PODOS_PRODUCT_VISUAL_DNA} ${NO_SCIFI}`,
    alt: "Close-up of coolant manifolds and heat exchangers inside the PODOS unit",
    src: "/visuals/invest/evidence-cooling.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "evidence-industry",
    section: "Evidence 04 INDUSTRY",
    prompt: `Realistic editorial photograph of an infrastructure site walkthrough: a small group of engineers in unbranded hard hats and safety vests reviewing plans on a tablet and printed drawings beside utility-scale electrical infrastructure, with a PODOS unit visible in the middle distance on a prepared pad, warm morning light, California terrain. Professional, collaborative, believable. No logos, no identifiable uniforms, no handshakes. ${PODOS_PRODUCT_VISUAL_DNA} ${NO_SCIFI}`,
    alt: "Engineers reviewing plans during a site walkthrough near power infrastructure and a PODOS unit",
    src: "/visuals/invest/evidence-industry.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
  {
    id: "money-backdrop",
    section: "MoneyMoment",
    prompt: `Ultra-minimal abstract architectural background in warm ivory and soft white: an enormous bright empty concrete hall dissolving into pure light, faint volumetric sunbeams through atmospheric haze, extremely low contrast, elegant institutional calm, subtle warm stone and pale champagne tones, near-monochrome brightness. No objects, no people, no text — a quiet backdrop designed to sit behind large dark typography. ${NO_SCIFI}`,
    alt: "",
    src: "/visuals/invest/money-backdrop.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: false,
  },
  {
    id: "final-vision",
    section: "FinalCTA / Film scene 8",
    prompt: `Monumental photorealistic image: the PODOS modular compute unit inside a huge bright architectural infrastructure hall at sunrise, enormous open portal revealing warm desert light outside, polished concrete, white structural beams, brushed metal, cinematic volumetric sunlight, subtle human silhouettes for scale. ${PODOS_PRODUCT_VISUAL_DNA} Optimistic, rich, institutional mood — Apple product launch meets architectural cinema. ${NO_SCIFI}`,
    alt: "PODOS unit in a vast bright hall at sunrise with an open portal to warm desert light",
    src: "/visuals/invest/final-vision.png",
    width: 1536,
    height: 1024,
    status: "ready",
    conceptual: true,
  },
];

export const getInvestImage = (id: string) =>
  INVEST_IMAGES.find((i) => i.id === id);
