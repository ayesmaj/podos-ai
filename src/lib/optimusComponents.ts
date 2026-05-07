/**
 * Solar Freight pod callout data — the 9 components called out on the
 * interactive front-elevation in PodosPod.
 *
 * Why this is a data file and not hardcoded JSX:
 *   - The list will grow / be tuned by ops + sales without code changes
 *   - Prev/next navigation in DetailPanel needs deterministic ordering
 *   - The category legend filters this list — easier as plain data
 *
 * Coordinates are in PERCENT relative to the pod render
 * (`/public/optimus/optimus-pod-front.png`, 1448×411 ≈ 3.52:1 landscape).
 * They were eyeballed against the front-elevation; tune if the asset
 * is replaced. The SVG overlay uses these as `cx={x}% cy={y}%`.
 *
 * Pin category drives the color so the user can scan the pod by system
 * type. The category palette is enforced inside CalloutPin.
 *
 * 2026-05-07 rebrand: shifted from the prior Optimus rack identity
 * (open doors, 6 visible GPU bays, MV switchgear, seismic frame) to
 * the Solar Freight identity (closed body, on-board solar array,
 * road-rated mobility chassis). The 9-slot structure is preserved so
 * the layout chrome (DetailPanel prev/next, mobile flex-row spacing,
 * ARIA flow) doesn't need re-tuning. Numerical specs in the panels
 * are placeholder estimates that match the visible product story —
 * verify against the real Solar Freight datasheet before launch.
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
 *     `position` anchor. Used for top-level system callouts (Solar Array,
 *     Charge Controller, Mobility Chassis, Drive Coupler).
 *
 *   "port" — icon-box that sits BELOW the pod with a short dashed line
 *     going up to its anchor. Used for the bottom port row (SOLAR OUT,
 *     PWR IN, COMPUTE, COOL, NET).
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
  // ────────────────────────────────────────────────────────────────────
  // Corner callouts (4) — engineering-drawing style, label outside the
  // pod silhouette with a `+` anchor on the pod feature it describes.
  // ────────────────────────────────────────────────────────────────────
  {
    id: "solar-array",
    label: "Solar Array",
    // Anchor at the leading edge of the roof-mounted solar panels.
    // Top of the pod silhouette is around y=12-15% on the new image;
    // x=12 lands on the first visible panel section.
    position: { x: 12, y: 14 },
    icon: "Sun",
    category: "power",
    placement: { kind: "corner", corner: "tl" },
    panel: {
      title: "On-Board Solar Array",
      subtitle: "Self-contained energy harvest",
      specs: [
        { label: "Configuration", value: "8-panel monocrystalline" },
        { label: "Peak Output", value: "12 kW continuous" },
        { label: "Cell Efficiency", value: "22.5% (Tier-1)" },
        { label: "Tracking", value: "Static, factory-tilted" },
        { label: "Lifecycle", value: "25-year, 80% capacity" },
      ],
      description:
        "Roof-mounted solar array runs the pod off-grid in field deployments — or trickle-charges the on-board battery bank when paired with grid power. Eliminates the chiller plant and substation that conventional pods require.",
      metric: {
        label: "Off-Grid Runtime",
        value: "12 hr",
        delta: "summer median, full compute load",
      },
    },
  },
  {
    id: "charge-ctrl",
    label: "Charge Controller",
    // Anchor at the trailing edge of the array — battery + power
    // electronics live in the upper tail behind the last panel.
    position: { x: 89, y: 14 },
    icon: "Zap",
    category: "power",
    placement: { kind: "corner", corner: "tr" },
    panel: {
      title: "Battery + Charge Controller",
      subtitle: "MPPT power management",
      specs: [
        { label: "Battery Bank", value: "240 kWh LFP, modular" },
        { label: "Charge Controller", value: "MPPT, 99.5% efficient" },
        { label: "Bidirectional Inverter", value: "50 kW continuous" },
        { label: "Cycle Life", value: "6,000 cycles to 80% SOH" },
        { label: "Thermal Tap", value: "Integrated dielectric loop" },
      ],
      description:
        "Battery and charge electronics live in the upper tail behind the solar array. The pod runs from solar alone, hybrid solar+grid, or grid-only — switching modes without compute interruption.",
      metric: {
        label: "Battery Capacity",
        value: "240 kWh",
        delta: "LFP, 6 000-cycle warranty",
      },
    },
  },
  {
    id: "mobility-chassis",
    label: "Mobility Chassis",
    // Anchor at the first wheel set on the left side of the chassis,
    // just below the body baseline. Matches the BL corner of the pod.
    position: { x: 8, y: 78 },
    icon: "Shield",
    category: "structural",
    placement: { kind: "corner", corner: "bl" },
    panel: {
      title: "Self-Mobile Chassis",
      subtitle: "Field-deployable freight platform",
      specs: [
        { label: "Configuration", value: "8-axle, freight-rated" },
        { label: "Curb Weight", value: "28,500 kg loaded" },
        { label: "Road Class", value: "ISO 6346 / DOT freight" },
        { label: "Permits", value: "Standard flatbed, no oversize" },
        { label: "Auto-leveling", value: "Hydraulic, ±100 mm" },
      ],
      description:
        "The pod IS the truck. Pre-rigged for highway transport with no separate chassis swap — drive to site, level, connect, run. Standard freight permit windows; no escort required.",
      metric: {
        label: "Setup Time",
        value: "< 30 min",
        delta: "crane-free, single-operator",
      },
    },
  },
  {
    id: "drive-coupler",
    label: "Drive Coupler",
    // Anchor at the rear coupling point — tractor hitch + ground
    // anchor stakes live at the chassis tail.
    position: { x: 92, y: 78 },
    icon: "Plug",
    category: "structural",
    placement: { kind: "corner", corner: "br" },
    panel: {
      title: "Drive Coupler & Site Anchor",
      subtitle: "Tractor and ground interface",
      specs: [
        { label: "Hitch Type", value: "Class 8 fifth-wheel" },
        { label: "Anchor Points", value: "4× tie-down, 6 t each" },
        { label: "Auto-Couple", value: "Pneumatic, single-actuator" },
        { label: "Site Footprint", value: "6.1 × 1.7 m level pad" },
        { label: "Disconnect", value: "< 2 min, no rigging" },
      ],
      description:
        "Couple to a standard tractor for relocation; release and self-anchor with the four ground stakes for static deployment. No external rigging required.",
    },
  },
  // ────────────────────────────────────────────────────────────────────
  // Port callouts (5) — icon-and-label boxes that sit in the bottom
  // strip of the canvas, with a short riser line up to the pod baseline.
  // Anchored at y=78 (just below the body, level with the wheel hubs)
  // so the riser lines visually meet the pod at its underside —
  // engineering-drawing language carried over from the prior Optimus
  // rack design.
  //
  // X coordinates spread evenly between the BL corner anchor (x=8) and
  // the BR corner anchor (x=92): 18 / 34 / 50 / 66 / 82 (16% spacing,
  // centered on x=50). The previous design clustered ports at 17–49
  // because the GPU cutaway was on the LEFT half of the rack render;
  // the freight pod has features all along its length so ports use the
  // full width. Mobile (≤760px) overrides absolute positioning to a
  // flex row — see PodCanvas.module.css `.portRow` rule.
  // ────────────────────────────────────────────────────────────────────
  {
    id: "solar-out",
    label: "SOLAR OUT",
    position: { x: 18, y: 78 },
    icon: "Sun",
    category: "power",
    placement: { kind: "port" },
    panel: {
      title: "Solar Output",
      subtitle: "Array-to-bus DC",
      specs: [
        { label: "Connector", value: "MC4 quick-connect" },
        { label: "Output", value: "600V DC, up to 20A" },
        { label: "Disconnect", value: "Rapid-shutdown compliant" },
        { label: "Bypass", value: "Per-panel diode, shade-tolerant" },
      ],
      description:
        "Solar array DC output flows through a single rapid-shutdown disconnect into the pod's MPPT controller. Code-compliant for occupied-site deployments.",
    },
  },
  {
    id: "pwr-in",
    label: "PWR IN",
    position: { x: 34, y: 78 },
    icon: "Plug",
    category: "power",
    placement: { kind: "port" },
    panel: {
      title: "Grid Ingress",
      subtitle: "Optional charge-only feed",
      specs: [
        { label: "Connection", value: "480V three-phase, 200A" },
        { label: "Connector", value: "Pin-and-sleeve, IP67" },
        { label: "Mode", value: "Charge-only when solar deficit" },
        { label: "Disconnect", value: "Lockable, code-compliant" },
      ],
      description:
        "Optional grid feed for hybrid operation in low-light deployments. The pod runs solar-first; grid is a fallback, not a dependency.",
    },
  },
  {
    id: "compute",
    label: "COMPUTE",
    position: { x: 50, y: 78 },
    icon: "Cpu",
    category: "compute",
    placement: { kind: "port" },
    panel: {
      title: "Compute Backplane",
      subtitle: "On-board GPU cluster",
      specs: [
        { label: "GPU Count", value: "64 × H200 / B200 class" },
        { label: "Per-GPU Power", value: "1,000 W TDP" },
        { label: "Interconnect", value: "NVLink + 400G InfiniBand" },
        { label: "Memory Pool", value: "9.2 TB HBM3e aggregate" },
        { label: "Form Factor", value: "4× 16-GPU sleds, hot-swap" },
      ],
      description:
        "Behind the closed doors: a fully provisioned 64-GPU cluster sized to fit the pod's solar+battery envelope while still delivering production-grade training and inference workloads.",
      metric: {
        label: "GPU Density",
        value: "64×",
        delta: "per pod, off-grid capable",
      },
    },
  },
  {
    id: "cool-loop",
    label: "COOL",
    position: { x: 66, y: 78 },
    icon: "Droplets",
    category: "thermal",
    placement: { kind: "port" },
    panel: {
      title: "Closed-Loop Cooling",
      subtitle: "Direct-to-chip dielectric",
      specs: [
        { label: "Coolant", value: "Dielectric, two-phase" },
        { label: "Heat Capture", value: "95%+ at the die" },
        { label: "Reject", value: "Roof radiator pack" },
        { label: "Flow Rate", value: "1,200 L/min peak" },
        { label: "Water Use", value: "Zero — closed loop" },
      ],
      description:
        "Closed dielectric loop carries heat from the GPU sleds to the roof radiator pack. Zero water consumption — critical for off-grid and arid deployments.",
      metric: { label: "PUE", value: "< 1.10", delta: "industry avg 1.55" },
    },
  },
  {
    id: "net-uplink",
    label: "NET",
    position: { x: 82, y: 78 },
    icon: "Network",
    category: "network",
    placement: { kind: "port" },
    panel: {
      title: "Network Uplink",
      subtitle: "Multi-path connectivity",
      specs: [
        { label: "Primary", value: "4× 800G QSFP-DD fiber" },
        { label: "Backup", value: "Starlink + LTE failover" },
        { label: "Latency", value: "< 2 µs intra-pod" },
        { label: "Fabric", value: "Dual-plane, hitless failover" },
      ],
      description:
        "Pre-terminated fiber bulkhead PLUS satellite + LTE backups means the pod stays uplinked even at remote sites with no fiber drop.",
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
