/**
 * sync-image-status.mjs — reconcile registry `status` flags with the
 * files actually on disk.
 *
 * Needed because parallel generator batches each read-then-write the
 * same registry file (last writer wins clobbers siblings' status
 * updates). The PNGs are the source of truth; this re-derives status.
 *
 * Usage: node scripts/sync-image-status.mjs [seo|invest]
 */

import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "..");
const which = process.argv[2] ?? "seo";
const DATA = path.join(ROOT, "src", "data", which === "seo" ? "seo-page-images.ts" : "invest-page-images.ts");
const DIR = path.join(ROOT, "public", "visuals", which === "seo" ? "seo" : "invest");

const exists = async (p) => access(p).then(() => true).catch(() => false);

let src = await readFile(DATA, "utf8");
const ids = [...src.matchAll(/id: "([a-z0-9-]+)"/g)].map((m) => m[1]);

let ready = 0;
let pending = 0;
for (const id of ids) {
  const has = await exists(path.join(DIR, `${id}.png`));
  const want = has ? "ready" : "pending";
  if (has) ready++;
  else pending++;
  // rewrite the status field belonging to this id's object literal
  src = src.replace(
    new RegExp(`(id: "${id}"[\\s\\S]{0,2000}?status: ")\\w+(")`),
    `$1${want}$2`
  );
}

await writeFile(DATA, src);
console.log(`${which}: ${ready} ready, ${pending} pending (of ${ids.length}) — statuses synced to disk.`);
