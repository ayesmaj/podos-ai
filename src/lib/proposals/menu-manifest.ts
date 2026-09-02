/**
 * menu-manifest.ts — static registry of the generated PODOS menu illustrations
 * (public/visuals/menu, see docs/asset-map.md).
 *
 * A manifest instead of filesystem probes on purpose: `existsSync(public/...)`
 * in server code made Vercel's output tracer bundle the ENTIRE public/ folder
 * into the function (772 MB) and failed the deploy. Files in public/ are
 * served by the CDN, never read from the function filesystem. Pure data —
 * importable from server and client code.
 */

export const MENU_SKUS = [
  "POD-BASE", "COMPUTE-PKG",
  "COOL-D2C", "COOL-HYBRID", "COOL-AIR",
  "PWR-STD", "PWR-N1", "PWR-OFFGRID",
  "NET-STD", "NET-HBW",
  "SUP-STD", "SUP-ENH", "SUP-MGD",
  "SVC-ASSESS", "SVC-TRANSPORT", "SVC-COMMISSION",
] as const;

const SKU_SET: ReadonlySet<string> = new Set(MENU_SKUS);

/** Public URL of a SKU's 4:3 menu illustration, or undefined if none was generated. */
export function menuImage(sku: string): string | undefined {
  return SKU_SET.has(sku) ? `/visuals/menu/${sku.toLowerCase()}.webp` : undefined;
}

export const HERO_IMAGE = "/visuals/menu/hero-pod-schematic.webp";
export const BLUEPRINT_FIELD = "/visuals/menu/blueprint-field.webp";
