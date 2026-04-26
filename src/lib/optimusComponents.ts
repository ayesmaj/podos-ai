/**
 * Optimus pod callout data — the 9 components called out on the
 * interactive front-elevation in PodosPod.
 *
 * Why this is a data file and not hardcoded JSX:
 *   - The list will grow / be tuned by ops + sales without code changes
 *   - Prev/next navigation in DetailPanel needs deterministic ordering
 *   - The category legend filters this list — easier as plain data
 *
 * Coordinates are in PERCENT relative to the pod render
 * (`/public/optimus/optimus-pod-front.png`, 16:7-ish landscape).
 * They were eyeballed against the front-elevation; tune if the asset
 * is replaced. The SVG overlay uses these as `cx={x}% cy={y}%`.
 *
 * Pin category drives the color so the user can scan the pod by system
 * type. The category palette is enforced inside CalloutPin.
 */

export type OptimusCategory =
  | "compute"
  | "thermal"
  | "power"
  | "network"
  | "structural";

/**
 * Layout placement controls which callout-component renders the entry:
 *
 *   "corner" — engineering-drawing label that sits OUTSIDE the pod at one
 *     of the four corners, with a dashed connector line back to the
 *     `position` anchor. Used for top-level system callouts (GPU BAY,
 *     SWITCHGEAR, FRAME, COOLING MANIFOLD).
 *
 *   "port" — icon-box that sits BELOW the pod with a short dashed line
 *     going up to its anchor. Used for the bottom port row (PWR IN,
 *     COOL IN, COOL OUT, NET FIBER, EXHAUST).
 *
 * The `corner` field on a corner placement says which of the 4 corners
 * the label sits at — drives line geometry and label alignment.
 */
export type CalloutPlacement =
  | { kind: "corner"; corner: "tl" | "tr" | "bl" | "br" }
  | { kind: "port" };

export type OptimusComponent = {
  id: string;
  /** Short label rendered next to / under the callout. */
  label: string;
  /** Anchor point on the pod image as % coords (0–100). */
  position: { x: number; y: number };
  /** lucide-react icon name. Keep in sync with ICON_MAP in callout components. */
  icon: string;
  category: OptimusCategory;
  /** How and where the callout is rendered. */
  placement: CalloutPlacement;
  panel: {
    title: string;
    subtitle: string;
    specs: { label: string; value: string }[];
    description: string;
    /** Optional hero metric card at the top of the panel. */
    metric?: { label: string; value: string; delta?: string };
  };
};

export const OPTIMUS_COMPONENTS: OptimusComponent[] = [
  {
    id: "gpu-bay",
    label: "128× GPU Bay",
    // Anchor sits at the cutaway grid's top-left corner, just inside
    // the pod's left bezel. Keep in sync with GRID_X in CutawayOverlay.
    position: { x: 11, y: 14 },
    icon: "Cpu",
    category: "compute",
    placement: { kind: "corner", corner: "tl" },
    panel: {
      title: "128× GPU Compute Bay",
      subtitle: "High-density accelerator array",
      specs: [
        { label: "GPU Count", value: "128 × H200 / B200 class" },
        { label: "Per-GPU Power", value: "Up to 1,000W TDP" },
        { label: "Interconnect", value: "NVLink + 400G InfiniBand" },
        { label: "Memory Pool", value: "18.4 TB HBM3e aggregate" },
        { label: "Form Factor", value: "8× 16-GPU sleds, hot-swap" },
      ],
      description:
        "Densely packed liquid-cooled GPU sleds form the compute core of every Optimus pod. Eight independent sleds run as one logical fabric, scheduled by Syntropic for sub-millisecond workload migration.",
      metric: {
        label: "Compute Density",
        value: "8×",
        delta: "vs. air-cooled baseline",
      },
    },
  },
  {
    id: "mv-switchgear",
    label: "MV Switchgear",
    position: { x: 92, y: 18 },        // top-right corner of pod chassis (inside canvas margin)
    icon: "Zap",
    category: "power",
    placement: { kind: "corner", corner: "tr" },
    panel: {
      title: "Medium-Voltage Switchgear",
      subtitle: "Grid-tie power distribution",
      specs: [
        { label: "Input Voltage", value: "13.8 kV / 34.5 kV" },
        { label: "Capacity", value: "1.25 MW continuous" },
        { label: "Redundancy", value: "N+1 with bypass" },
        { label: "Protection", value: "Arc-flash rated, IEC 62271" },
        { label: "Step-down", value: "Integrated 480V three-phase" },
      ],
      description:
        "Direct grid-tie at medium voltage eliminates external transformer infrastructure. Pods connect to utility feeds in days, not months.",
      metric: {
        label: "Deploy Time",
        value: "90–120 days",
        delta: "vs. 18+ months traditional",
      },
    },
  },
  {
    id: "cooling-manifold",
    label: "Cooling Manifold",
    position: { x: 92, y: 78 },        // bottom-right corner (inside canvas margin)
    icon: "Droplets",
    category: "thermal",
    placement: { kind: "corner", corner: "br" },
    panel: {
      title: "Closed-Loop Cooling Manifold",
      subtitle: "Direct-to-chip liquid cooling",
      specs: [
        { label: "Coolant", value: "Dielectric, two-phase" },
        { label: "Heat Capture", value: "95%+ at the die" },
        { label: "Flow Rate", value: "2,400 L/min peak" },
        { label: "Inlet Temp", value: "32°C ambient tolerant" },
        { label: "PUE Contribution", value: "< 1.08" },
      ],
      description:
        "A closed dielectric loop carries heat directly off the die, enabling 8× compute density with zero water consumption and no chiller plant.",
      metric: { label: "PUE", value: "< 1.08", delta: "industry avg 1.55" },
    },
  },
  {
    id: "pwr-in",
    label: "PWR IN",
    // Port row anchors sit at canvas y=78% — the same horizontal line
    // as the bl/br engineering-callout `+` anchors. This pulls the
    // whole port row UP into the bottom-bezel band of the pod (just
    // inside the chassis baseline) instead of floating below it.
    // Five callouts spread evenly at exactly 8% spacing, centered on
    // the cutaway midpoint x=33: 17 / 25 / 33 / 41 / 49.
    position: { x: 17, y: 78 },
    icon: "Plug",
    category: "power",
    placement: { kind: "port" },
    panel: {
      title: "Power Ingress",
      subtitle: "Single-feed grid connection",
      specs: [
        { label: "Connection", value: "MV cable, single-point" },
        { label: "Capacity", value: "1.25 MW" },
        { label: "Metering", value: "Utility-grade, real-time" },
        { label: "Disconnect", value: "Lockable, code-compliant" },
      ],
      description:
        "One cable, one connection. Pod ships pre-commissioned — power-in to first workload in under 4 hours.",
    },
  },
  {
    id: "cool-in",
    label: "COOL IN",
    position: { x: 25, y: 78 },           // 17 + 8
    icon: "Waves",
    category: "thermal",
    placement: { kind: "port" },
    panel: {
      title: "Coolant Inlet",
      subtitle: "Closed-loop supply",
      specs: [
        { label: "Loop Type", value: "Closed, dielectric" },
        { label: "Operating Pressure", value: "4.5 bar nominal" },
        { label: "Quick-disconnect", value: "Dripless, field-rated" },
        { label: "Top-up Interval", value: "36+ months" },
      ],
      description:
        "Coolant arrives pre-charged from factory. Field service is connect-and-run — no fluid handling required.",
    },
  },
  {
    id: "cool-out",
    label: "COOL OUT",
    position: { x: 33, y: 78 },           // 25 + 8 (centered on cutaway midpoint)
    icon: "Waves",
    category: "thermal",
    placement: { kind: "port" },
    panel: {
      title: "Coolant Return",
      subtitle: "Heat reject loop",
      specs: [
        { label: "Reject Temp", value: "55–65°C" },
        { label: "Heat Recovery", value: "Optional district heating tap" },
        { label: "Dry-cooler Compatible", value: "Yes, no chillers required" },
      ],
      description:
        "Hot return is warm enough for direct dry-cooler reject in most climates — and warm enough for downstream heat reuse.",
    },
  },
  {
    id: "net-fiber",
    label: "NET FIBER",
    position: { x: 41, y: 78 },           // 33 + 8
    icon: "Network",
    category: "network",
    placement: { kind: "port" },
    panel: {
      title: "Fiber Network Ingress",
      subtitle: "High-speed fabric uplink",
      specs: [
        { label: "Uplink", value: "4× 800G QSFP-DD" },
        { label: "East-West", value: "400G InfiniBand to peer pods" },
        { label: "Latency", value: "< 2 µs intra-pod" },
        { label: "Redundancy", value: "Dual-plane, hitless failover" },
      ],
      description:
        "Pre-terminated fiber bulkhead. Connects to site fabric in minutes; supports both Ethernet and InfiniBand on the same chassis.",
    },
  },
  {
    id: "exhaust",
    label: "EXHAUST",
    position: { x: 49, y: 78 },           // 41 + 8
    icon: "Fan",
    category: "thermal",
    placement: { kind: "port" },
    panel: {
      title: "Air Exhaust",
      subtitle: "Auxiliary thermal vent",
      specs: [
        { label: "Function", value: "Switchgear + auxiliary cooling" },
        { label: "Filter", value: "MERV-13, field-replaceable" },
        { label: "Acoustic", value: "< 72 dBA at 1m" },
      ],
      description:
        "The compute core is fully liquid-cooled. Exhaust handles only the small auxiliary heat load from power conversion and control systems.",
    },
  },
  {
    id: "seismic-frame",
    label: "Seismic Frame",
    position: { x: 8, y: 78 },         // bottom-left corner (inside canvas margin)
    icon: "Shield",
    category: "structural",
    placement: { kind: "corner", corner: "bl" },
    panel: {
      title: "Seismic Frame",
      subtitle: "Structural chassis",
      specs: [
        { label: "Rating", value: "Zone 4 / IEC SS-2" },
        { label: "Material", value: "Welded structural steel" },
        { label: "Lift Points", value: "4-corner ISO certified" },
        { label: "Transport", value: "Standard flatbed, no permits" },
      ],
      description:
        "The pod ships as a single ruggedized unit. Pre-stressed seismic frame allows craned placement on a poured slab with no internal recommissioning.",
    },
  },
];

/** Brand-disciplined palette per category. Cyan reserved for thermal. */
export const CATEGORY_COLOR: Record<OptimusCategory, string> = {
  compute: "#1B3FD9",
  thermal: "#06B6D4",
  power: "#F59E0B",
  network: "#8B5CF6",
  structural: "#64748B",
};

export const CATEGORY_LABEL: Record<OptimusCategory, string> = {
  compute: "Compute",
  thermal: "Thermal",
  power: "Power",
  network: "Network",
  structural: "Structural",
};
