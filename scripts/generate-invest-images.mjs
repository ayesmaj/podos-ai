/**
 * generate-invest-images.mjs — pre-generate /invest page visuals via the
 * OpenAI Images API (GPT Image 2) and save them to public/visuals/invest/.
 *
 * Usage:
 *   node --env-file=.env.local scripts/generate-invest-images.mjs          # all pending
 *   node --env-file=.env.local scripts/generate-invest-images.mjs hero-product   # one id (forces regen)
 *
 * Prompts live in src/data/invest-page-images.ts (parsed below so the data
 * file stays the single source of truth without a TS build step).
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "..");
const DATA = path.join(ROOT, "src", "data", "invest-page-images.ts");
const OUT = path.join(ROOT, "public", "visuals", "invest");

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error("OPENAI_API_KEY missing — run with: node --env-file=.env.local scripts/generate-invest-images.mjs");
  process.exit(1);
}
const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";

// ponytail: regex-parse the TS registry instead of adding a build step.
// Prompts may be double-quoted strings or template literals interpolating
// the two shared constants (PODOS_PRODUCT_VISUAL_DNA / NO_SCIFI).
const src = await readFile(DATA, "utf8");
const CONSTS = {};
for (const m of src.matchAll(/(?:const|export const)\s+(\w+)\s*=\s*\n?\s*"((?:[^"\\]|\\.)*)";/g)) {
  CONSTS[m[1]] = m[2].replace(/\\"/g, '"');
}
const resolveTemplate = (t) => t.replace(/\$\{(\w+)\}/g, (_, name) => CONSTS[name] ?? "");
const entries = [...src.matchAll(/\{\s*id:\s*"([^"]+)"[\s\S]*?prompt:\s*(?:"((?:[^"\\]|\\.)*)"|`([^`]*)`)[\s\S]*?width:\s*(\d+),\s*height:\s*(\d+),\s*status:\s*"(\w+)"/g)]
  .map((m) => ({
    id: m[1],
    prompt: m[2] !== undefined ? m[2].replace(/\\"/g, '"') : resolveTemplate(m[3]),
    width: +m[4],
    height: +m[5],
    status: m[6],
  }));

// Brand reference images per asset — the real pod render + logo lockup.
// When refs exist we hit /v1/images/edits (image-to-image) so every
// generation stays faithful to the actual PODOS product and brand colors.
const POD = "public/products/pod.png";
const REFS = {
  "hero-pavilion": [POD],
  "ca-power": [POD],
  "server-integration": [POD, "public/optimus/optimus-pod-front.png"],
  // traditional-construction: no refs — no PODOS unit in frame
  "product-anatomy": [POD, "public/optimus/optimus-pod-front.png"],
  manufacturing: [POD],
  transportation: [POD],
  commissioning: [POD],
  "modular-campus": [POD],
  "capital-capacity": [POD],
  "final-vision": [POD],
};

const wanted = process.argv[2]
  ? entries.filter((e) => e.id === process.argv[2])
  : entries.filter((e) => e.status !== "ready");

if (!wanted.length) {
  console.log(process.argv[2] ? `No entry with id "${process.argv[2]}"` : "All images already ready.");
  process.exit(0);
}

await mkdir(OUT, { recursive: true });
let updated = src;

for (const img of wanted) {
  const size = `${img.width}x${img.height}`;
  process.stdout.write(`Generating ${img.id} (${size}, ${MODEL}) ... `);
  try {
    const refs = REFS[img.id] || [];
    let res;
    if (refs.length) {
      const form = new FormData();
      form.append("model", MODEL);
      form.append("prompt", img.prompt);
      form.append("size", size);
      form.append("quality", "high");
      for (const ref of refs) {
        const buf = await readFile(path.join(ROOT, ref));
        form.append("image[]", new Blob([buf], { type: "image/png" }), path.basename(ref));
      }
      res = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}` },
        body: form,
      });
    } else {
      res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, prompt: img.prompt, size, quality: "high" }),
      });
    }
    if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
    const b64 = (await res.json()).data?.[0]?.b64_json;
    if (!b64) throw new Error("no b64_json in response");
    await writeFile(path.join(OUT, `${img.id}.png`), Buffer.from(b64, "base64"));
    updated = updated.replace(
      new RegExp(`(id: "${img.id}"[\\s\\S]*?status: ")\\w+(")`),
      `$1ready$2`
    );
    console.log("ok");
  } catch (err) {
    console.log(`FAILED — ${err.message}`);
  }
}

await writeFile(DATA, updated);
console.log("Done. Statuses updated in src/data/invest-page-images.ts");
