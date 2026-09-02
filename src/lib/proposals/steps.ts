/**
 * steps.ts — the 14-step client configuration flow (master brief 9.1–9.4).
 *
 * Field-driven so the workspace renders generically and autosaves each step's
 * payload under its `id`. Product-selection steps (platform/compute/cooling/…)
 * offer options; their catalog and prices are DB-backed (passed in at render),
 * so nothing here hardcodes a price. This file is pure data — safe to import
 * on client or server.
 */

export type FieldType = "text" | "textarea" | "number" | "email" | "tel" | "date" | "select" | "multiselect";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  help?: string;
}

export interface Step {
  id: string;
  no: string;
  title: string;
  intro?: string;
  fields: Field[];
}

export const STEPS: Step[] = [
  {
    id: "company", no: "01", title: "Company & contacts",
    intro: "Who we are preparing this for.",
    fields: [
      { key: "company_legal_name", label: "Company legal name", type: "text" },
      { key: "website", label: "Company website", type: "text", placeholder: "https://" },
      { key: "industry", label: "Industry", type: "text" },
      { key: "company_size", label: "Company size", type: "select", options: ["1–50", "51–200", "201–1000", "1000+"] },
      { key: "country", label: "Country", type: "text" },
      { key: "primary_first", label: "Primary contact — first name", type: "text" },
      { key: "primary_last", label: "Primary contact — last name", type: "text" },
      { key: "primary_title", label: "Job title", type: "text" },
      { key: "primary_email", label: "Work email", type: "email" },
      { key: "primary_phone", label: "Mobile phone", type: "tel" },
      { key: "signer_name", label: "Authorized signer", type: "text", help: "Who will sign the final agreement." },
      { key: "signer_title", label: "Signer title", type: "text" },
    ],
  },
  {
    id: "project", no: "02", title: "Project",
    fields: [
      { key: "project_name", label: "Project name", type: "text" },
      { key: "description", label: "Project description", type: "textarea" },
      { key: "objective", label: "Business objective", type: "textarea" },
      { key: "workload", label: "Intended workload", type: "select", options: ["Training", "Inference", "HPC", "Rendering", "Research", "Mixed"] },
      { key: "required_capacity_mw", label: "Required capacity (MW)", type: "number" },
      { key: "pod_quantity", label: "Pod quantity", type: "number" },
      { key: "expected_gpus", label: "Expected GPU count", type: "number" },
      { key: "target_golive", label: "Target go-live date", type: "date" },
      { key: "budget_range", label: "Budget range", type: "text" },
      { key: "procurement_stage", label: "Procurement stage", type: "select", options: ["Exploring", "Budgeting", "Approved", "Ready to purchase"] },
    ],
  },
  {
    id: "site", no: "03", title: "Deployment site",
    intro: "Where the deployment will physically go. Multiple candidate sites can be discussed with our team.",
    fields: [
      { key: "site_name", label: "Candidate site name", type: "text" },
      { key: "address", label: "Site address", type: "textarea", help: "We will validate and standardize this with you." },
      { key: "site_type", label: "Site type", type: "select", options: ["Greenfield", "Existing data center", "Industrial", "Warehouse", "Other"] },
      { key: "utility_capacity", label: "Existing utility capacity", type: "text" },
      { key: "service_voltage", label: "Service voltage", type: "text" },
      { key: "behind_meter", label: "Behind-the-meter generation", type: "multiselect", options: ["Solar", "Wind", "Gas", "Fuel cell", "Battery storage", "None"] },
      { key: "fiber", label: "Fiber availability", type: "select", options: ["On-site", "Nearby", "Needs build", "Unknown"] },
      { key: "road_access", label: "Road / crane access", type: "textarea" },
      { key: "permit_status", label: "Permit status", type: "text" },
    ],
  },
  { id: "platform", no: "04", title: "PODOS platform", intro: "Base pod configuration.", fields: [] },
  { id: "compute", no: "05", title: "Compute", fields: [] },
  { id: "cooling", no: "06", title: "Cooling", fields: [] },
  { id: "power", no: "07", title: "Power", fields: [] },
  { id: "network", no: "08", title: "Network", fields: [] },
  {
    id: "safety", no: "09", title: "Safety & monitoring",
    fields: [
      { key: "monitoring", label: "Monitoring & security requirements", type: "textarea" },
      { key: "compliance", label: "Compliance requirements", type: "textarea", help: "Any certifications or standards you must meet." },
    ],
  },
  {
    id: "software", no: "10", title: "Software",
    fields: [
      { key: "orchestration", label: "Orchestration / scheduling needs", type: "textarea" },
      { key: "syntropic", label: "Interested in Syntropic software", type: "select", options: ["Yes", "No", "Tell me more"] },
    ],
  },
  {
    id: "deployment", no: "11", title: "Deployment",
    fields: [
      { key: "transport_notes", label: "Transport / placement notes", type: "textarea" },
      { key: "commissioning", label: "Commissioning expectations", type: "textarea" },
    ],
  },
  {
    id: "warranty", no: "12", title: "Warranty & support",
    fields: [
      { key: "support_level", label: "Support level of interest", type: "select", options: ["Standard", "Enhanced", "Fully managed", "Not sure"] },
      { key: "warranty_notes", label: "Warranty notes", type: "textarea" },
    ],
  },
  {
    id: "custom", no: "13", title: "Custom requirements",
    fields: [
      { key: "custom", label: "Anything specific to your deployment", type: "textarea", help: "Non-standard requests are routed to engineering review." },
    ],
  },
  { id: "review", no: "14", title: "Review & submit", fields: [] },
];

/** Product steps map to a catalog category slug for their option cards. */
export const STEP_CATEGORY: Record<string, string> = {
  platform: "platform", compute: "compute", cooling: "cooling",
  power: "power", network: "network",
};
