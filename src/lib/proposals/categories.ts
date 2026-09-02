/** Client-facing category names + print order, shared by the web document and the paginated print. */
export const CATEGORY_ORDER = ["platform", "compute", "cooling", "power", "network", "deployment", "support", "custom"] as const;

export const CATEGORY_LABEL: Record<string, string> = {
  platform: "PODOS Platform", compute: "Compute", cooling: "Cooling", power: "Power & Electrical",
  network: "Network & Storage", deployment: "Deployment & Site", support: "Warranty & Support", custom: "Custom items",
};

export const categoryLabel = (slug: string | null | undefined) => CATEGORY_LABEL[slug ?? "custom"] ?? CATEGORY_LABEL.custom;
