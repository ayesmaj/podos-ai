/**
 * configuratorCatalog.ts — DEMO catalog for the PODOS Configurator.
 *
 * ⚠️ EVERY price, lead time and option in this file is DEMO PLACEHOLDER DATA.
 * Nothing here is an approved PODOS price, specification, or commercial term.
 * It exists so the configurator flow, rules and pricing engine can be built
 * and tested before real catalog data is entered. See
 * docs/configurator/BUSINESS_DATA_REQUIRED.md §B/§C/§D.
 *
 * Production gate: `CATALOG_IS_DEMO` must be flipped false only when real
 * admin-managed data replaces this file. While true, the UI shows a DEMO
 * banner and the route stays noindex.
 *
 * Money is in integer minor units (US cents). Never floats — see
 * src/server/configurator/pricing.ts.
 */

export const CATALOG_IS_DEMO = true;

export type StepId =
  | "workload"
  | "capacity"
  | "site"
  | "platform"
  | "compute"
  | "cooling"
  | "power"
  | "network"
  | "safety"
  | "services"
  | "support";

/** How an option's price behaves when the customer scales pod quantity. */
export type PriceBasis =
  | "per-pod" // multiplied by pod count
  | "flat" // charged once for the project
  | "per-pod-recurring" // annual, multiplied by pod count
  | "flat-recurring" // annual, charged once
  | "pending-review"; // no price may be shown — needs PODOS review

export interface CfgOption {
  id: string;
  label: string;
  /** One plain-English sentence: what this is and why it matters. */
  blurb: string;
  /** Collapsed "Technical details" copy. */
  detail?: string;
  /** Price in integer cents. Ignored when basis is "pending-review". */
  priceCents?: number;
  basis: PriceBasis;
  /** Weeks this option adds to the delivery window. */
  leadTimeWeeks?: number;
  recommended?: boolean;
  /** Option ids that must also be selected; surfaced as a blocking rule. */
  requires?: string[];
  /** Option ids that cannot be selected alongside this one. */
  excludes?: string[];
  /** Image from the generated library (src/data/configurator-page-images.ts). */
  image?: string;
}

export interface CfgStep {
  id: StepId;
  /** Chapter code in the site's item-code grammar. C- prefix is unused elsewhere. */
  code: string;
  label: string;
  question: string;
  help: string;
  /** "single" = radio, "multi" = checkboxes. */
  kind: "single" | "multi";
  options: CfgOption[];
  /** Stage visual for this step, from the generated library. */
  visual: string;
  visualAlt: string;
}

const IMG = "/visuals/configurator";

export const STEPS: CfgStep[] = [
  {
    id: "workload",
    code: "C-01",
    label: "Workload",
    question: "What will run in this deployment?",
    help: "This sets the starting point for rack density, cooling and network. You can change any of it later.",
    kind: "single",
    visual: `${IMG}/stage-compute.webp`,
    visualAlt: "Interior of a PODOS unit showing rows of server rack bays",
    options: [
      {
        id: "wl-inference",
        label: "Inference serving",
        blurb: "Steady-state model serving with predictable, sustained load.",
        detail:
          "Favours consistent rack density and a simpler cooling envelope than burst training. DEMO baseline assumes uniform population across bays.",
        priceCents: 0,
        basis: "per-pod",
        recommended: true,
        image: `${IMG}/wl-inference.webp`,
      },
      {
        id: "wl-training",
        label: "Model training",
        blurb: "High-density training clusters with heavy east-west traffic.",
        detail:
          "Drives the highest rack power and the largest interconnect requirement. DEMO baseline pairs this with the high-density cooling tier.",
        priceCents: 48_000_00,
        basis: "per-pod",
        leadTimeWeeks: 2,
        image: `${IMG}/wl-training.webp`,
      },
      {
        id: "wl-hpc",
        label: "HPC and simulation",
        blurb: "Tightly coupled compute for simulation and scientific workloads.",
        detail: "Latency-sensitive fabric; DEMO baseline assumes liquid-cooled sleds.",
        priceCents: 32_000_00,
        basis: "per-pod",
        leadTimeWeeks: 2,
        image: `${IMG}/wl-hpc.webp`,
      },
      {
        id: "wl-confidential",
        label: "Confidential compute",
        blurb: "Isolated capacity for regulated or sensitive workloads.",
        detail:
          "Adds physical segregation and audit requirements. Scope and certification are confirmed during engineering review.",
        basis: "pending-review",
        image: `${IMG}/wl-confidential.webp`,
      },
    ],
  },
  {
    id: "capacity",
    code: "C-02",
    label: "Capacity",
    question: "How much capacity do you need at first service?",
    help: "Each PODOS pod is designed as a one-megawatt unit. Quantity can be phased — tell us the target for day one.",
    kind: "single",
    visual: `${IMG}/stage-multi-pod.webp`,
    visualAlt: "Aerial view of several PODOS units arranged on a shared pad",
    options: [
      {
        id: "cap-1",
        label: "1 pod",
        blurb: "A single unit — the usual pilot or first-capacity deployment.",
        priceCents: 0,
        basis: "flat",
        recommended: true,
      },
      {
        id: "cap-2",
        label: "2 pods",
        blurb: "Two units sharing site works, power and cooling infrastructure.",
        priceCents: 0,
        basis: "flat",
      },
      {
        id: "cap-4",
        label: "4 pods",
        blurb: "A small cluster with shared plant and a common service lane.",
        priceCents: 0,
        basis: "flat",
      },
      {
        id: "cap-8",
        label: "8 pods",
        blurb: "Multi-unit capacity, typically phased across two deliveries.",
        priceCents: 0,
        basis: "flat",
      },
      {
        id: "cap-20",
        label: "20 pods",
        blurb: "Full cluster scale. Always routed to engineering for a site plan.",
        basis: "pending-review",
      },
    ],
  },
  {
    id: "site",
    code: "C-03",
    label: "Site",
    question: "Where will this deploy?",
    help: "Site type drives foundation, weather package, access and logistics. Exact address is captured after your estimate.",
    kind: "single",
    visual: `${IMG}/site-industrial.webp`,
    visualAlt: "A PODOS unit installed on a pad within an industrial campus",
    options: [
      {
        id: "site-industrial",
        label: "Industrial campus",
        blurb: "An existing industrial site with yard access and utility power.",
        priceCents: 0,
        basis: "per-pod",
        recommended: true,
        image: `${IMG}/site-industrial.webp`,
      },
      {
        id: "site-datacenter",
        label: "Data center campus",
        blurb: "Alongside existing mission-critical facilities and plant.",
        priceCents: 0,
        basis: "per-pod",
        image: `${IMG}/site-datacenter.webp`,
      },
      {
        id: "site-enterprise",
        label: "Enterprise facility",
        blurb: "A corporate campus service yard with screening requirements.",
        priceCents: 18_000_00,
        basis: "per-pod",
        image: `${IMG}/site-enterprise.webp`,
      },
      {
        id: "site-utility",
        label: "Utility or energy site",
        blurb: "Adjacent to substation or generation infrastructure.",
        priceCents: 12_000_00,
        basis: "per-pod",
        image: `${IMG}/site-utility.webp`,
      },
      {
        id: "site-renewable",
        label: "Renewable generation site",
        blurb: "Co-located with solar or wind generation capacity.",
        priceCents: 22_000_00,
        basis: "per-pod",
        leadTimeWeeks: 3,
        image: `${IMG}/site-renewable.webp`,
      },
      {
        id: "site-remote",
        label: "Remote edge site",
        blurb: "Limited access and services — needs a logistics and autonomy plan.",
        basis: "pending-review",
        image: `${IMG}/site-remote.webp`,
      },
    ],
  },
  {
    id: "platform",
    code: "C-04",
    label: "Platform",
    question: "Which exterior packages does the site require?",
    help: "Environmental and access packages. Pick everything the site conditions demand — compatibility is checked as you go.",
    kind: "multi",
    visual: `${IMG}/stage-exterior.webp`,
    visualAlt: "Side elevation of the PODOS unit on a studio background",
    options: [
      {
        id: "ext-climate",
        label: "Cold-climate package",
        blurb: "Weather-hooded intakes and heat-traced service lines for freezing sites.",
        detail: "DEMO scope: insulated panel section, low-ambient condenser, heat tracing.",
        priceCents: 42_000_00,
        basis: "per-pod",
        leadTimeWeeks: 2,
        image: `${IMG}/opt-climate-package.webp`,
      },
      {
        id: "ext-corrosion",
        label: "Coastal corrosion package",
        blurb: "Marine-grade fasteners, sealed joints and protective coatings.",
        priceCents: 36_000_00,
        basis: "per-pod",
        leadTimeWeeks: 2,
        image: `${IMG}/opt-corrosion-package.webp`,
      },
      {
        id: "ext-seismic",
        label: "Seismic restraint package",
        blurb: "Anchor brackets, isolation pads and cross-bracing to the foundation.",
        priceCents: 28_000_00,
        basis: "per-pod",
        image: `${IMG}/opt-seismic-base.webp`,
      },
      {
        id: "ext-acoustic",
        label: "Acoustic attenuation",
        blurb: "Baffled louver banks for sites with noise limits or nearby occupancy.",
        priceCents: 31_000_00,
        basis: "per-pod",
        image: `${IMG}/opt-acoustic.webp`,
      },
      {
        id: "ext-solar",
        label: "Roof solar package",
        blurb: "Low-profile array flush with the roof line for supplementary generation.",
        priceCents: 26_000_00,
        basis: "per-pod",
        leadTimeWeeks: 1,
        image: `${IMG}/opt-roof-solar.webp`,
      },
      {
        id: "ext-lighting",
        label: "Service-area lighting",
        blurb: "Shielded LED service luminaires for night maintenance access.",
        priceCents: 8_000_00,
        basis: "per-pod",
        image: `${IMG}/opt-lighting-package.webp`,
      },
    ],
  },
  {
    id: "compute",
    code: "C-05",
    label: "Compute",
    question: "Who supplies the compute hardware?",
    help: "Each pod is designed for up to 128 accelerators. You can bring your own equipment or have PODOS supply and integrate it.",
    kind: "single",
    visual: `${IMG}/opt-rack-compute.webp`,
    visualAlt: "A populated high-density compute rack inside a PODOS unit",
    options: [
      {
        id: "cmp-customer",
        label: "Customer-furnished equipment",
        blurb: "You supply servers and accelerators; PODOS integrates and commissions them.",
        detail:
          "Rack elevations and a bill of materials are requested during engineering review. DEMO integration allowance only.",
        priceCents: 0,
        basis: "per-pod",
        recommended: true,
        image: `${IMG}/opt-rack-customer.webp`,
      },
      {
        id: "cmp-podos",
        label: "PODOS-supplied compute",
        blurb: "PODOS procures, installs and validates the full compute stack.",
        detail:
          "Accelerator family and quantity are confirmed with engineering. Hardware pricing follows current supply agreements.",
        basis: "pending-review",
        image: `${IMG}/opt-rack-compute.webp`,
      },
    ],
  },
  {
    id: "cooling",
    code: "C-06",
    label: "Cooling",
    question: "Which cooling architecture fits this deployment?",
    help: "Direct-to-chip liquid cooling is the PODOS baseline. Redundancy and heat rejection depend on your density and climate.",
    kind: "single",
    visual: `${IMG}/stage-cooling.webp`,
    visualAlt: "A PODOS unit connected to an external cooling skid",
    options: [
      {
        id: "cool-n",
        label: "Baseline liquid cooling (N)",
        blurb: "Single-path direct-to-chip loop with a dry cooler for heat rejection.",
        priceCents: 0,
        basis: "per-pod",
        recommended: true,
        image: `${IMG}/opt-cooling-skid.webp`,
      },
      {
        id: "cool-n1",
        label: "Redundant cooling (N+1)",
        blurb: "Adds a standby pump and spare capacity so service continues during maintenance.",
        detail: "DEMO scope: third pump on the common header, additional isolation valves.",
        priceCents: 68_000_00,
        basis: "per-pod",
        leadTimeWeeks: 2,
        image: `${IMG}/opt-pump-redundancy.webp`,
      },
      {
        id: "cool-waterless",
        label: "Waterless closed loop",
        blurb: "Sealed refrigerant-based rejection for sites with no water allocation.",
        priceCents: 84_000_00,
        basis: "per-pod",
        leadTimeWeeks: 4,
        image: `${IMG}/opt-waterless.webp`,
      },
      {
        id: "cool-recovery",
        label: "Heat recovery interface",
        blurb: "Plate exchanger handing rejected heat to a building or process loop.",
        detail: "Requires a receiving load on site; confirmed during site engineering.",
        basis: "pending-review",
        image: `${IMG}/opt-heat-recovery.webp`,
      },
    ],
  },
  {
    id: "power",
    code: "C-07",
    label: "Power",
    question: "What power is available at the site?",
    help: "Tell us what exists today. Interconnect capacity is always verified during site engineering — nothing here confirms utility availability.",
    kind: "single",
    visual: `${IMG}/stage-power.webp`,
    visualAlt: "A PODOS unit on a pad beside a transformer and switchgear",
    options: [
      {
        id: "pwr-grid",
        label: "Utility grid connection",
        blurb: "Existing service with adequate capacity at or near the pad.",
        priceCents: 0,
        basis: "per-pod",
        recommended: true,
        image: `${IMG}/opt-transformer.webp`,
      },
      {
        id: "pwr-grid-upgrade",
        label: "Grid connection with upgrade",
        blurb: "Service exists but needs a transformer and switchgear build-out.",
        priceCents: 145_000_00,
        basis: "per-pod",
        leadTimeWeeks: 8,
        image: `${IMG}/opt-transformer.webp`,
      },
      {
        id: "pwr-microgrid",
        label: "Hybrid microgrid",
        blurb: "Generation, storage and grid combined behind a common switchgear skid.",
        detail: "Sizing depends on generation profile and target autonomy.",
        basis: "pending-review",
        image: `${IMG}/opt-microgrid.webp`,
      },
      {
        id: "pwr-offgrid",
        label: "Behind-the-meter generation",
        blurb: "Site generation with no utility interconnect at first service.",
        basis: "pending-review",
        image: `${IMG}/opt-generator.webp`,
      },
    ],
  },
  {
    id: "network",
    code: "C-08",
    label: "Network",
    question: "How should the deployment connect?",
    help: "Fabric inside the pod is included. This is about the uplink and how it reaches you.",
    kind: "multi",
    visual: `${IMG}/stage-network.webp`,
    visualAlt: "A PODOS unit with fiber routing toward its network interface",
    options: [
      {
        id: "net-redundant",
        label: "Redundant uplink",
        blurb: "A second diverse path so a single fiber cut doesn't take capacity offline.",
        priceCents: 34_000_00,
        basis: "per-pod",
        recommended: true,
        image: `${IMG}/opt-fiber-handoff.webp`,
      },
      {
        id: "net-oob",
        label: "Out-of-band management",
        blurb: "A separate management path that stays reachable if the primary network fails.",
        priceCents: 12_000_00,
        basis: "per-pod",
        recommended: true,
        image: `${IMG}/opt-oob-management.webp`,
      },
      {
        id: "net-crossconnect",
        label: "Carrier cross-connect",
        blurb: "Structured hand-off to your chosen carrier or interconnect provider.",
        priceCents: 18_000_00,
        basis: "flat",
        image: `${IMG}/opt-cross-connect.webp`,
      },
      {
        id: "net-firewall",
        label: "Security appliance",
        blurb: "Dedicated firewall and inspection at the network edge.",
        priceCents: 22_000_00,
        basis: "per-pod",
        image: `${IMG}/opt-firewall.webp`,
      },
    ],
  },
  {
    id: "safety",
    code: "C-09",
    label: "Safety",
    question: "Which safety and security systems are required?",
    help: "Code compliance is always confirmed with the authority having jurisdiction — the configurator flags what needs review, it does not certify.",
    kind: "multi",
    visual: `${IMG}/stage-safety.webp`,
    visualAlt: "Access door of a PODOS unit with badge reader and camera",
    options: [
      {
        id: "saf-access",
        label: "Multi-factor physical access",
        blurb: "Badge, keypad and biometric control on personnel doors.",
        priceCents: 16_000_00,
        basis: "per-pod",
        recommended: true,
        image: `${IMG}/opt-access-control.webp`,
      },
      {
        id: "saf-cameras",
        label: "Camera and intrusion detection",
        blurb: "Exterior coverage with door sensors and alarm integration.",
        priceCents: 14_000_00,
        basis: "per-pod",
        recommended: true,
        image: `${IMG}/opt-cameras.webp`,
      },
      {
        id: "saf-fire",
        label: "Fire detection",
        blurb: "Aspirating smoke detection with alarm escalation.",
        detail: "Suppression scope depends on jurisdiction and is reviewed separately.",
        priceCents: 26_000_00,
        basis: "per-pod",
        image: `${IMG}/opt-fire-detection.webp`,
      },
      {
        id: "saf-leak",
        label: "Water and coolant leak detection",
        blurb: "Sensing rope and controller covering the coolant loop and floor.",
        priceCents: 9_000_00,
        basis: "per-pod",
        recommended: true,
        image: `${IMG}/opt-water-leak.webp`,
      },
    ],
  },
  {
    id: "services",
    code: "C-10",
    label: "Deployment",
    question: "Which deployment services should PODOS carry?",
    help: "Anything not selected stays with you or your contractor. Site works are allowances until a survey is complete.",
    kind: "multi",
    visual: `${IMG}/stage-deployment.webp`,
    visualAlt: "A crane lowering a PODOS unit onto a prepared pad",
    options: [
      {
        id: "svc-survey",
        label: "Site survey",
        blurb: "On-site assessment of access, ground conditions, power and fiber.",
        priceCents: 24_000_00,
        basis: "flat",
        recommended: true,
        image: `${IMG}/svc-site-survey.webp`,
      },
      {
        id: "svc-civil",
        label: "Civil and foundation works",
        blurb: "Pad design and construction, grading and drainage.",
        detail: "Allowance only until a geotechnical survey is complete.",
        priceCents: 96_000_00,
        basis: "per-pod",
        leadTimeWeeks: 4,
        image: `${IMG}/svc-civil-prep.webp`,
      },
      {
        id: "svc-electrical",
        label: "Electrical site works",
        blurb: "Trenching, cabling and termination from your service to the pad.",
        priceCents: 78_000_00,
        basis: "per-pod",
        leadTimeWeeks: 3,
        image: `${IMG}/svc-electrical-work.webp`,
      },
      {
        id: "svc-transport",
        label: "Transport and placement",
        blurb: "Factory-to-site haulage, crane and final placement.",
        priceCents: 62_000_00,
        basis: "per-pod",
        recommended: true,
        image: `${IMG}/opt-transport.webp`,
      },
      {
        id: "svc-commissioning",
        label: "Commissioning and acceptance",
        blurb: "Factory and site acceptance testing through to handover.",
        priceCents: 45_000_00,
        basis: "per-pod",
        recommended: true,
        image: `${IMG}/opt-commissioning.webp`,
      },
      {
        id: "svc-permit",
        label: "Permit package",
        blurb: "Drawing set and submissions for local approvals.",
        detail: "Scope varies by jurisdiction; fees are excluded.",
        basis: "pending-review",
        image: `${IMG}/svc-permit.webp`,
      },
    ],
  },
  {
    id: "support",
    code: "C-11",
    label: "Support",
    question: "What level of ongoing support do you need?",
    help: "Support is billed annually and shown separately from one-time cost.",
    kind: "single",
    visual: `${IMG}/stage-support.webp`,
    visualAlt: "A technician performing maintenance at an open PODOS service bay",
    options: [
      {
        id: "sup-standard",
        label: "Standard",
        blurb: "Business-hours remote support with an annual inspection.",
        priceCents: 48_000_00,
        basis: "per-pod-recurring",
        image: `${IMG}/svc-annual-inspection.webp`,
      },
      {
        id: "sup-monitored",
        label: "24/7 monitored",
        blurb: "Round-the-clock monitoring, alerting and preventive maintenance visits.",
        priceCents: 96_000_00,
        basis: "per-pod-recurring",
        recommended: true,
        image: `${IMG}/svc-preventive-maintenance.webp`,
      },
      {
        id: "sup-onsite",
        label: "24/7 with on-site response",
        blurb: "Everything in monitored, plus a committed on-site response target.",
        detail: "Response targets depend on site location and are confirmed in the agreement.",
        priceCents: 168_000_00,
        basis: "per-pod-recurring",
        leadTimeWeeks: 0,
        image: `${IMG}/svc-onsite-response.webp`,
      },
    ],
  },
];

/** DEMO base price for one pod platform before any options. */
export const BASE_POD_PRICE_CENTS = 1_850_000_00;

/** DEMO baseline delivery target, in weeks, before option lead times. */
export const BASE_LEAD_TIME_WEEKS = 13;

/** Pod count implied by a capacity option id. */
export const POD_COUNT: Record<string, number> = {
  "cap-1": 1,
  "cap-2": 2,
  "cap-4": 4,
  "cap-8": 8,
  "cap-20": 20,
};

export const STEP_BY_ID = new Map(STEPS.map((s) => [s.id, s]));
export const OPTION_BY_ID = new Map(
  STEPS.flatMap((s) => s.options.map((o) => [o.id, { ...o, stepId: s.id }] as const))
);
