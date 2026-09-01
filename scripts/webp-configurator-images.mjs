/**
 * webp-configurator-images.mjs — convert generated configurator PNGs to WebP
 * and repoint the registry, per AGENTS.md ("never save generated PNGs
 * without converting to WebP").
 *
 * Run AFTER generate-configurator-images.mjs (and after any regeneration):
 *   node scripts/webp-configurator-images.mjs           # convert + keep PNGs
 *   node scripts/webp-configurator-images.mjs --prune   # convert + delete PNGs
 *
 * ponytail: sharp is used from node_modules where Next.js hoists it rather
 * than being declared — this is a dev-only script, and it fails loudly below
 * if that ever stops resolving. Ceiling: declare sharp as a devDependency if
 * the hoist disappears or this script ever runs in CI.
 */

import { readFile, writeFile, readdir, unlink, stat } from "node:fs/promises";
import path from "node:path";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("sharp is not resolvable. Install it first:  npm i -D sharp");
  process.exit(1);
}

const ROOT = path.resolve(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "..");
const DIR = path.join(ROOT, "public", "visuals", "configurator");
const DATA = path.join(ROOT, "src", "data", "configurator-page-images.ts");
const PRUNE = process.argv.includes("--prune");
const QUALITY = 90;

const pngs = (await readdir(DIR)).filter((f) => f.endsWith(".png"));
if (!pngs.length) {
  console.log("No PNGs to convert.");
  process.exit(0);
}

let before = 0;
let after = 0;
const converted = [];

for (const file of pngs) {
  const src = path.join(DIR, file);
  const out = src.replace(/\.png$/, ".webp");
  const inSize = (await stat(src)).size;
  await sharp(src).webp({ quality: QUALITY, effort: 6 }).toFile(out);
  const outSize = (await stat(out)).size;
  before += inSize;
  after += outSize;
  converted.push(file.replace(/\.png$/, ""));
  const pct = Math.round((1 - outSize / inSize) * 100);
  console.log(`${file.padEnd(30)} ${(inSize / 1e6).toFixed(2)}MB → ${(outSize / 1e6).toFixed(2)}MB  (-${pct}%)`);
}

// Repoint the registry: /visuals/configurator/<id>.png -> .webp
const srcTs = await readFile(DATA, "utf8");
const updated = srcTs.replace(/(\/visuals\/configurator\/[a-z0-9-]+)\.png/g, "$1.webp");
if (updated !== srcTs) {
  await writeFile(DATA, updated);
  console.log("Registry src paths repointed to .webp");
}

if (PRUNE) {
  for (const file of pngs) await unlink(path.join(DIR, file));
  console.log(`Deleted ${pngs.length} source PNGs.`);
}

console.log(
  `\n${converted.length} images: ${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(1)}MB ` +
    `(-${Math.round((1 - after / before) * 100)}%)${PRUNE ? "" : "  · rerun with --prune to remove the PNGs"}`
);
