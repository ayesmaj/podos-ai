export const hero = {
  eyebrow: "AI Infrastructure",
  headline: ["Advanced Compute,", "Engineered as", "a System."],
  sub: "Modular AI data center pods. Deployable in weeks. Built for scale.",
  cta: [
    { label: "Explore Technology", href: "#technology", primary: true },
    { label: "See Deployment", href: "#deployment", primary: false },
    { label: "Book a Call", href: "#contact", primary: false },
  ],
};

export const podSpecs = [
  { label: "Compute Density", value: "Up to 256 GPUs", unit: "per pod" },
  { label: "Power Capacity", value: "2–10 MW", unit: "scalable" },
  { label: "Cooling Efficiency", value: "PUE < 1.15", unit: "liquid + air" },
  { label: "Deployment Time", value: "< 12 weeks", unit: "factory to live" },
  { label: "Operating Temp", value: "−30°C to 55°C", unit: "ambient range" },
  { label: "Connectivity", value: "400G / 800G", unit: "InfiniBand / Ethernet" },
];

export const whyPoints = [
  {
    id: "deploy",
    label: "01 — Deployment Speed",
    headline: "Weeks, not years.",
    body:
      "PODOS pods are factory-assembled and tested before shipment. Site preparation is minimal. You are operational in under 12 weeks from order.",
  },
  {
    id: "modular",
    label: "02 — Modular Scale",
    headline: "Start small. Scale without limit.",
    body:
      "Each pod is a self-contained compute unit. Add pods as your AI workloads grow — no re-architecture, no downtime, no surprises.",
  },
  {
    id: "cooling",
    label: "03 — Advanced Cooling",
    headline: "Heat is a solved problem.",
    body:
      "Integrated liquid-assisted air cooling keeps PUE below 1.15. The thermal management system is designed for sustained full-load GPU operation.",
  },
  {
    id: "energy",
    label: "04 — Energy Intelligence",
    headline: "Power where you need it.",
    body:
      "On-grid, off-grid, and hybrid configurations supported. Optional renewable integration. Real-time power monitoring built into every pod.",
  },
  {
    id: "enclosure",
    label: "05 — Engineered Enclosure",
    headline: "Built for the field.",
    body:
      "IP54-rated steel enclosures with industrial-grade sealing. Designed for desert heat, arctic cold, and everything in between.",
  },
];

export const deployEnvironments = [
  { label: "Industrial Site", sub: "Heavy power, high density" },
  { label: "Solar Campus", sub: "Renewable-powered compute" },
  { label: "Edge Deployment", sub: "Distributed inference nodes" },
  { label: "Technology Park", sub: "Premium managed facilities" },
];

export const techSpecs = [
  { category: "Compute", items: ["NVIDIA H100 / H200 / B200", "AMD MI300X", "Custom accelerator-ready", "NVLink + InfiniBand fabric"] },
  { category: "Cooling", items: ["Rear-door liquid heat exchanger", "Direct liquid cooling (DLC) ready", "Precision airflow management", "Thermal runaway detection"] },
  { category: "Power", items: ["2N or N+1 redundancy", "On-site UPS integration", "Generator tie-in standard", "Real-time PDU monitoring"] },
  { category: "Connectivity", items: ["400G / 800G switching", "Dual diverse fiber entry", "Out-of-band management", "Zero-trust network segmentation"] },
];
