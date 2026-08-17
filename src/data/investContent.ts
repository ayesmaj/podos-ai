/**
 * investContent.ts — copy + structure for /invest (V3).
 *
 * Narrative order: product clarity → market problem → industry validation
 * → how it works → deployment → modular scale → evidence → economics →
 * ownership → action. Financial terms live in investOffering.ts and are
 * gated by approval state — never hardcoded here.
 */

import { offering } from "./investOffering";

export const MIN_INVESTMENT = offering.minimumInvestment;
export const MAX_INVESTMENT = 250_000;
export const QUICK_AMOUNTS = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000];

export const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const fmtPct = (n: number) =>
  `${n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}%`;

/* ================================ CTAs ================================ */

export const CTA = {
  accessHref: "mailto:info@podosai.com?subject=PODOS%20Investor%20Access",
  talkToTeamHref: "mailto:info@podosai.com?subject=PODOS%20Investor%20Conversation",
  documentsHref: "mailto:info@podosai.com?subject=PODOS%20Offering%20Documents%20Request",
  phone: "+1 (408) 718-9946",
  email: "info@podosai.com",
};

/* ================================ HERO ================================ */

export const HERO = {
  eyebrow: "Modular AI Infrastructure",
  headline: ["Turn available power", "into deployable", "AI compute."],
  sub: "PODOS combines power, cooling, server racks, communications, and operations inside factory-built modular units — designed to deploy in months instead of waiting years for traditional data-center construction.",
  investorLine: "Own a piece of the company building a faster path to AI capacity.",
  primaryCta: "Explore the Opportunity",
  secondaryCta: "Watch the Film",
  tertiaryCta: "Get Investor Access",
  accessModule: {
    label: "Investor access",
    rows: [
      { k: "Company", v: "Private company" },
      { k: "Minimum planned entry", v: fmtUSD(offering.minimumInvestment) },
      { k: "Current status", v: "Interest stage — non-binding" },
    ],
    cta: "Get investor access",
    note: "Offering terms, if and when available, are defined solely by official offering documents.",
  },
};

/* ================================ FILM ================================ */

export const FILM = {
  eyebrow: "The PODOS investor film",
  headline: ["From power", "to AI capacity."],
  /** real produced film — when set, PodosFilm renders a video player
   *  instead of the still-sequence storyboard */
  videoSrc: "/videos/podos-investor-film.mp4",
  poster: "/videos/podos-film-poster.jpg",
  durationLabel: "3 MIN",
  scenes: [
    { imageId: "ca-power", text: ["POWER EXISTS."], seconds: 4.5 },
    { imageId: "server-integration", text: ["AI DEMAND IS", "ACCELERATING."], seconds: 4.5 },
    { imageId: "traditional-construction", text: ["DEPLOYMENT IS", "THE BOTTLENECK."], seconds: 4.5 },
    { imageId: "product-anatomy", text: ["PODOS CONNECTS", "POWER TO COMPUTE."], seconds: 5 },
    { imageId: "manufacturing", text: ["FACTORY-BUILT.", "STANDARDIZED.", "REPEATABLE."], seconds: 5 },
    { imageId: "commissioning", text: ["DEPLOYED IN MONTHS,*", "NOT YEARS."], seconds: 4.5 },
    { imageId: "modular-campus", text: ["ONE UNIT. ONE SITE.", "ONE SCALABLE NETWORK."], seconds: 4.5 },
    { imageId: "final-vision", text: ["TURN POWER", "INTO AI CAPACITY."], seconds: 5 },
  ],
  closing: "PODOS — Modular AI Infrastructure",
  footnote: "Film contains conceptual visualizations. Deployment timelines shown are PODOS targets.",
  cta: "Explore the Investment Opportunity",
};

/* ============================ CONSTRAINT ============================= */

export const CONSTRAINT = {
  eyebrow: "The market problem",
  headline: ["AI is scaling.", "Physical infrastructure", "is the constraint."],
  sub: "Compute demand no longer waits for construction schedules. The organizations that can deploy capacity fastest will define the next decade of AI.",
};

/* =========================== COLLABORATIONS ========================== */

export const VALIDATION = {
  eyebrow: "Industry validation",
  headline: ["Built with the industry", "that has to deploy it."],
  sub: "PODOS is being developed in direct contact with organizations that understand the real physical constraints of power availability, server infrastructure, networking, deployment, and operations.",
  flowLabels: { left: "POWER", center: "PODOS", right: "COMPUTE" },
  flowResult: "INTEGRATED INFRASTRUCTURE",
};

/* ============================== ANATOMY ============================== */

export const ANATOMY = {
  eyebrow: "One integrated system",
  headline: ["Everything required", "to turn power", "into compute."],
  systems: [
    { n: "01", title: "Power input", body: "Connects the PODOS unit to the available site power infrastructure." },
    { n: "02", title: "Electrical distribution", body: "Conditions and distributes utility power to every internal system." },
    { n: "03", title: "Cooling", body: "Maintains the thermal environment required by high-density compute systems." },
    { n: "04", title: "Server racks", body: "Provides the physical compute architecture within a standardized modular enclosure." },
    { n: "05", title: "Communications", body: "Integrates networking, fiber, switching, monitoring, and external connectivity." },
    { n: "06", title: "Monitoring", body: "Tracks power, thermal, and system health across the unit in real time." },
    { n: "07", title: "Safety & security", body: "Physical access control, fire suppression, and protective systems." },
    { n: "08", title: "Service access", body: "Engineered access panels and corridors for maintenance without downtime." },
  ],
};

/* ============================ OPPORTUNITY ============================ */

export const OPPORTUNITY = {
  eyebrow: "Two deployment models",
  headline: ["Years of construction,", "or months of manufacturing."],
  traditional: {
    label: "Traditional data center",
    duration: "3–5 YEARS",
    durationNote: "industry estimate",
    steps: ["SITE", "PERMIT", "CONSTRUCTION", "INFRASTRUCTURE", "COMMISSIONING"],
  },
  podos: {
    label: "PODOS",
    duration: "90 DAYS",
    durationNote: "PODOS target",
    steps: ["FACTORY", "TRANSPORT", "SITE", "POWER", "COMMISSION"],
  },
};

/* ============================== JOURNEY ============================== */

export const JOURNEY = {
  eyebrow: "The deployment journey",
  headline: ["Built in a factory.", "Deployed as infrastructure."],
  stages: [
    { n: "01", title: "ENGINEER", body: "One standardized architecture: power, cooling, racks, networking, and operations designed as a single product.", imageId: "product-anatomy", tag: "SYSTEM DESIGN" },
    { n: "02", title: "MANUFACTURE", body: "Units are assembled and tested in controlled factory conditions — not on an exposed construction site.", imageId: "manufacturing", tag: "FACTORY BUILD" },
    { n: "03", title: "INTEGRATE", body: "Server racks, fiber, switching, and monitoring are installed and validated before the unit ships.", imageId: "server-integration", tag: "SYSTEMS INTEGRATION" },
    { n: "04", title: "TRANSPORT", body: "Each unit moves as standard heavy freight to any prepared site with available power.", imageId: "transportation", tag: "LOGISTICS" },
    { n: "05", title: "COMMISSION", body: "Grid connection, testing, and activation — the target window from order to operation is 90 days.", imageId: "commissioning", tag: "TARGET: 90 DAYS" },
  ],
};

/* ================================ SCALE ============================== */

export const SCALE = {
  eyebrow: "Illustrative scale model",
  headline: ["From one unit", "to an infrastructure network."],
  sub: "PODOS capacity is not one construction project — it is a repeatable product. The same standardized unit compounds into campuses and regional networks.",
  steps: [
    { units: 1, capacity: "1 MW", math: "1 × 1 MW" },
    { units: 10, capacity: "10 MW", math: "10 × 1 MW" },
    { units: 100, capacity: "100 MW", math: "100 × 1 MW" },
    { units: 1000, capacity: "1 GW", math: "1,000 × 1 MW" },
  ],
  disclaimer:
    "Illustrative scale model of the modular architecture — not a representation of current deployments.",
};

/* ============================== EVIDENCE ============================= */

export const EVIDENCE = {
  eyebrow: "Evidence, not just vision",
  headline: ["Built,", "not just pitched."],
  sub: "Renders explain the vision. The work behind them is engineering, manufacturing preparation, and direct industry engagement.",
  founderStatement: {
    title: "Why we're building PODOS",
    text: "The next era of AI will not run on ideas alone. It will run on infrastructure — and infrastructure is won by whoever can build it fastest. We are building the standardized unit that makes AI capacity a manufactured product instead of a construction project.",
    name: "The PODOS Founding Team",
  },
};

/* ============================ MONEY MOMENT =========================== */

export const MONEY_MOMENT = {
  lines: ["The world isn't", "running out of AI ideas."],
  emphasis: ["It's running out of", "places to run them."],
  closing: "PODOS is building those places.",
};

/* ============================ CAPITAL CYCLE ========================== */

export const CAPITAL = {
  eyebrow: "Capital becomes capacity",
  headline: ["Capital builds capacity.", "Capacity creates the platform for revenue."],
  cycle: ["CAPITAL", "MANUFACTURING", "POD", "DEPLOYMENT", "CAPACITY", "CUSTOMER"],
  cycleNote: "Each deployed unit is designed to serve compute demand — and every cycle funds the next unit.",
  allocation: {
    note: "Planned allocation categories. Percentages will be published with official offering documents.",
    categories: ["ENGINEERING", "MANUFACTURING", "POWER SYSTEMS", "DEPLOYMENT", "OPERATIONS", "GROWTH"],
  },
};

/* ============================= OWNERSHIP ============================= */

export const OWNERSHIP = {
  transition: ["Now that you understand", "what PODOS is building —", "see what participation", "could represent."],
  eyebrow: "Your piece of PODOS",
  headline: "Explore your participation",
  sub: "Choose an amount to explore. Securities terms, pricing, and ownership figures are defined solely by official offering documents once published.",
  demoNotice:
    "Exploration mode — the official offering structure has not been published. No securities terms are shown.",
  outputs: {
    investment: "Your investment",
    securities: "Estimated securities",
    ownership: "Estimated ownership",
  },
  demoCta: "Request official offering documents",
  viewActual: "Actual scale",
  viewMagnified: "Magnified view",
  magnifiedNote: "Magnified for visibility — the number is the truth.",
};

/* ============================== PROCESS ============================== */

export const PROCESS = {
  eyebrow: "The path to participation",
  headline: "How investment works",
  steps: [
    { n: "01", title: "DISCOVER", body: "Understand the product, the market constraint, and the deployment model." },
    { n: "02", title: "REVIEW", body: "Request and review the official offering materials when available." },
    { n: "03", title: "VERIFY", body: "Complete identity and eligibility verification through the approved intermediary." },
    { n: "04", title: "INVEST", body: "Complete your investment through the approved portal and receive confirmation." },
  ],
};

/* ================================ FAQ ================================ */

export const FAQ = [
  {
    q: "What exactly does PODOS build?",
    a: "Factory-built modular infrastructure units that integrate power distribution, cooling, server racks, communications, monitoring, and physical security — each designed as a standardized 1-MW building block for AI compute.",
  },
  {
    q: "What is the minimum investment?",
    a: `The planned entry point is ${fmtUSD(offering.minimumInvestment)}. Final minimums are defined by the official offering documents.`,
  },
  {
    q: "What am I buying?",
    a: "The security type, pricing, and terms will be defined by official offering documents. Until those are published, this page operates in interest mode and does not display securities terms.",
  },
  {
    q: "How do I complete an investment?",
    a: "When the offering is live, transactions are completed through an approved investment intermediary or portal — never directly on this page.",
  },
  {
    q: "Who can invest?",
    a: "Eligibility depends on your jurisdiction and the final offering structure. Details are provided in the offering documents.",
  },
];

/* ============================== FINAL CTA ============================ */

export const FINAL_CTA = {
  headline: ["Own a piece", "of what powers", "the next era of AI."],
  primary: "Get Investor Access",
  primaryLive: "View the Offering",
  secondary: "Talk to the Team",
  note: "Offering terms and securities transactions are provided through the applicable approved investment intermediary.",
};

/* ================================ LEGAL ============================== */

export const LEGAL = {
  title: "Important disclosures",
  paragraphs: [
    "Investing in early-stage companies involves substantial risk, including illiquidity and the possible loss of your entire investment. Invest only capital you can afford to lose.",
    "Nothing on this page constitutes investment, legal, or tax advice, or an offer to sell or a solicitation of an offer to buy securities. Any offering is made only through official offering documents, which supersede everything shown here.",
    "This page currently operates in interest mode: no securities terms, share prices, valuations, or ownership percentages are offered or implied. Figures identified as targets or estimates are not guarantees.",
    "Certain imagery on this page consists of conceptual visualizations and illustrative scale models, labeled accordingly. They depict design intent, not completed deployments, facilities, or customer installations.",
    "Industry relationships are described at their accurate current level and presented without public naming. Securities transactions, if and when available, are conducted only through an approved intermediary or portal. Eligibility restrictions may apply.",
  ],
};

export const NAV_LINKS = [
  { label: "Story", href: "#film" },
  { label: "Why now", href: "#constraint" },
  { label: "Validation", href: "#validation" },
  { label: "Product", href: "#anatomy" },
  { label: "Scale", href: "#scale" },
  { label: "Ownership", href: "#calculator" },
  { label: "FAQ", href: "#faq" },
];
