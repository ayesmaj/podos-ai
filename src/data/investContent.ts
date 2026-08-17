/**
 * investContent.ts — single source of truth for the /invest page.
 *
 * Every headline, stat, financial constant, CTA target, and legal line
 * lives here so the page can be re-priced or re-worded without touching
 * component code. All financial values are PLACEHOLDERS until the offering
 * structure is final — the UI labels every derived number "estimated".
 */

/* ============================= FINANCIALS ============================= */

export const MIN_INVESTMENT = 1_000;
export const MAX_INVESTMENT = 250_000;

/** ponytail: placeholder deal terms — swap these three numbers when the
 *  offering is priced. Everything downstream (calculator, hero card,
 *  ownership ring) derives from them. */
export const PRICE_PER_SHARE = 2.5;
export const TOTAL_SHARES_OUTSTANDING = 40_000_000;
export const SECURITY_TYPE = "Common Equity (placeholder — subject to final offering documents)";
export const SECURITY_TYPE_SHORT = "Common Equity*";

export const QUICK_AMOUNTS = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000];

export function estimatedShares(amount: number): number {
  return Math.floor(amount / PRICE_PER_SHARE);
}

export function estimatedOwnershipPct(amount: number): number {
  return (estimatedShares(amount) / TOTAL_SHARES_OUTSTANDING) * 100;
}

export const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const fmtPct = (n: number) =>
  `${n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}%`;

/* ================================ CTAs ================================ */

export const CTA = {
  /** External investment portal / payment flow. Placeholder until the
   *  approved provider handoff URL exists — points at contact for now. */
  investHref: "#calculator",
  continueHref: "mailto:info@podosai.com?subject=PODOS%20Investment%20Access",
  talkToTeamHref: "mailto:info@podosai.com?subject=PODOS%20Investor%20Conversation",
  phone: "+1 (408) 718-9946",
  email: "info@podosai.com",
};

/* ================================ COPY ================================ */

export const HERO = {
  eyebrow: "Investment access now open",
  headline: ["Own a piece of the", "infrastructure", "powering AI."],
  sub: "AI demand is exploding — and compute infrastructure is the bottleneck. PODOS builds factory-made, modular compute and power systems that deploy in months, not years. Investment access begins at $1,000.",
  primaryCta: "Invest from $1,000",
  secondaryCta: "See Ownership Calculator",
  cardNote: "Figures are estimates based on placeholder terms. Final terms are defined by official offering documents.",
};

export const WHY_NOW = {
  eyebrow: "The moment",
  headline: "Why this moment matters",
  cards: [
    {
      title: "AI demand is compounding",
      stat: "10×",
      statLabel: "projected growth in AI compute demand this decade",
      body: "Every model generation multiplies the compute required to train and serve it. Demand is no longer cyclical — it is structural.",
      icon: "TrendingUp",
    },
    {
      title: "Infrastructure is the bottleneck",
      stat: "3–5 yrs",
      statLabel: "typical lead time for a traditional data center",
      body: "Power, land, permits, and construction can't keep pace. The constraint on AI is no longer ideas — it is physical capacity.",
      icon: "Zap",
    },
    {
      title: "Speed is the edge",
      stat: "90 days",
      statLabel: "PODOS target from order to commissioning",
      body: "Factory-built modular pods compress years of construction into a manufacturing schedule. Speed of deployment becomes market share.",
      icon: "Timer",
    },
    {
      title: "PODOS is positioned to scale",
      stat: "1 MW",
      statLabel: "deployable compute per modular unit",
      body: "A repeatable product — not a one-off construction project. Each unit shipped compounds manufacturing learning and margin.",
      icon: "Boxes",
    },
  ],
};

export const OPPORTUNITY = {
  eyebrow: "The opportunity",
  headline: "Two ways to build the future. Only one scales fast enough.",
  sub: "The next wave of AI capacity will not be won by whoever pours the most concrete — it will be won by whoever ships capacity fastest.",
  traditional: {
    label: "Traditional buildout",
    points: [
      { title: "Slow", body: "3–5 year lead times from site selection to first rack." },
      { title: "Capital heavy", body: "Billions committed before a single watt is served." },
      { title: "Rigid", body: "Fixed sites, fixed capacity, no repeatability." },
      { title: "Centralized", body: "One location, one grid connection, one point of failure." },
    ],
  },
  podos: {
    label: "The PODOS model",
    points: [
      { title: "Modular", body: "Factory-built 1-MW pods, engineered as a product." },
      { title: "Fast", body: "Shipped and commissioned in a 90-day target window." },
      { title: "Repeatable", body: "Every unit improves the next — manufacturing, not construction." },
      { title: "Expandable", body: "Capacity grows pod by pod, wherever power exists." },
    ],
  },
};

export const CALCULATOR = {
  eyebrow: "Ownership simulator",
  headline: "See what your investment could represent",
  sub: "Explore an estimated view of your potential participation. All outputs are estimates based on placeholder terms and are not an offer of securities.",
  outputs: {
    investment: "Your investment",
    shares: "Estimated shares",
    ownership: "Estimated ownership",
    security: "Security type",
    participation: "Potential participation",
  },
  participationNote: "Early-stage exposure to PODOS growth, subject to final offering terms.",
};

export const ALLOCATION = {
  eyebrow: "Use of capital",
  headline: "What your investment helps build",
  sub: "Capital is deployed into physical, revenue-bearing infrastructure — not overhead.",
  items: [
    { icon: "Cpu", title: "Hardware", body: "Compute, cooling, and electrical systems inside every pod." },
    { icon: "Truck", title: "Deployment", body: "Logistics, siting, and commissioning of customer units." },
    { icon: "Factory", title: "Manufacturing", body: "Production capacity, tooling, and assembly throughput." },
    { icon: "PlugZap", title: "Power systems", body: "Grid interconnect, distribution, and energy engineering." },
    { icon: "Settings2", title: "Operations", body: "Monitoring, maintenance, and fleet reliability." },
    { icon: "Rocket", title: "Scaling growth", body: "New capacity, new markets, and the team to serve them." },
  ],
};

export const MONEY = {
  eyebrow: "The upside",
  headline: "Position yourself in a high-growth infrastructure opportunity",
  cards: [
    { big: "$1,000", title: "Accessible entry", body: "Participation starts at one thousand dollars — early access without institutional minimums." },
    { big: "1 MW", title: "Real infrastructure", body: "Your capital builds physical, deployable compute — assets, not slideware." },
    { big: "90-day", title: "Deployment velocity", body: "A manufacturing model built to capture demand while others are still permitting." },
    { big: "Early", title: "Strategic timing", body: "Exposure to AI infrastructure growth at the stage where positioning matters most." },
  ],
  note: "Early-stage investments carry risk. Nothing on this page is a promise of returns — it is an invitation to participate in what we are building.",
};

export const TRUST = {
  eyebrow: "Why PODOS",
  headline: "Built like infrastructure. Run like a product company.",
  pillars: [
    { title: "Modular by design", body: "Every PODOS unit is a standardized, factory-tested product — engineered once, manufactured repeatedly." },
    { title: "Scalable by architecture", body: "Capacity compounds pod by pod. The business scales like manufacturing, not construction." },
    { title: "Positioned for next-wave demand", body: "Purpose-built for the compute-constrained decade ahead, where deployment speed decides winners." },
  ],
  founderQuote: {
    text: "The next era of AI will not run on ideas alone. It will run on infrastructure — and infrastructure is won by whoever can build it fastest. That is the entire company.",
    name: "The PODOS Founding Team",
    role: "PODOS AI",
  },
  faq: [
    {
      q: "What is the minimum investment?",
      a: "Access begins at $1,000. Larger allocations are available, subject to the terms of the offering.",
    },
    {
      q: "What exactly am I buying?",
      a: "The security type and final terms are defined by the official offering documents. Figures shown on this page are estimates based on placeholder terms and will be replaced by final numbers at offering launch.",
    },
    {
      q: "Are the ownership numbers on this page exact?",
      a: "No — the calculator provides an estimated view based on configurable placeholder values (share price and shares outstanding). Final ownership depends on the priced round.",
    },
    {
      q: "How do I complete an investment?",
      a: "Transactions are completed through an approved investment flow. After you choose an amount, you'll be directed to the secure portal (or to our team) to finish the process and receive confirmation.",
    },
    {
      q: "Who can invest?",
      a: "Eligibility depends on your jurisdiction and the final offering structure. Some offerings carry investor-eligibility restrictions; details are provided in the offering documents.",
    },
  ],
};

export const STEPS = {
  eyebrow: "The process",
  headline: "How to invest",
  steps: [
    { n: "01", title: "Choose your amount", body: "Start from $1,000. Use the simulator to size your position." },
    { n: "02", title: "Review your estimate", body: "See your estimated shares and ownership before you commit." },
    { n: "03", title: "Complete the secure flow", body: "Finish the transaction through the approved investment portal." },
    { n: "04", title: "Become part of PODOS", body: "Receive confirmation and investor onboarding details." },
  ],
};

export const FINAL_CTA = {
  headline: "Own a piece of what powers the next era of AI.",
  sub: "The next era of AI will not run on ideas alone. It will run on infrastructure. Entry starts at $1,000 — take your place early.",
  primary: "Invest Now",
  secondary: "Talk to the Team",
};

export const LEGAL = {
  title: "Important disclosures",
  paragraphs: [
    "Investing in early-stage companies involves substantial risk, including illiquidity and the possible loss of your entire investment. You should invest only capital you can afford to lose.",
    "Nothing on this page constitutes investment, legal, or tax advice, or an offer to sell or a solicitation of an offer to buy securities. Any offering is made only through official offering documents, which qualify and supersede everything shown here.",
    "Share counts, share prices, and ownership percentages displayed on this page are estimates based on placeholder values and are provided for illustration only unless otherwise stated in official documents.",
    "Payment and securities transactions, if and when available, are conducted through an approved provider or portal. Investor-eligibility restrictions may apply depending on your jurisdiction and the structure of the offering.",
  ],
};

export const NAV_LINKS = [
  { label: "Why now", href: "#why-now" },
  { label: "Opportunity", href: "#opportunity" },
  { label: "Calculator", href: "#calculator" },
  { label: "Use of capital", href: "#allocation" },
  { label: "How to invest", href: "#steps" },
  { label: "FAQ", href: "#faq" },
];
