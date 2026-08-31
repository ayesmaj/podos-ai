/**
 * generate-configurator-images.mjs — pre-generate PODOS Configurator visuals
 * via the OpenAI Images API (GPT Image 2) into public/visuals/configurator/.
 *
 * Twin of generate-invest-images.mjs (same regex-parse + brand-ref approach),
 * with a small concurrency pool and 429-aware retries for large batches.
 *
 * Usage:
 *   node --env-file=.env.local scripts/generate-configurator-images.mjs            # all pending
 *   node --env-file=.env.local scripts/generate-configurator-images.mjs <id>       # one id (forces regen)
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "..");
const DATA = path.join(ROOT, "src", "data", "configurator-page-images.ts");
const OUT = path.join(ROOT, "public", "visuals", "configurator");

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error("OPENAI_API_KEY missing — run with: node --env-file=.env.local scripts/generate-configurator-images.mjs");
  process.exit(1);
}
const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
const CONCURRENCY = 3;

// ponytail: regex-parse the TS registry instead of adding a build step (invest precedent).
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

// Brand references: the real pod render keeps the product faithful; the logo
// lockup keeps the wordmark exact; the front elevation anchors interiors.
const POD = "public/products/pod.png";
const LOGO = "public/logo.png";
const FRONT = "public/optimus/optimus-pod-front.png";
const NO_REFS = new Set([
  "opt-rack-customer", "opt-cdu", "opt-drycooler", "opt-ups", "opt-transformer",
  "opt-generator", "opt-network-fabric", "opt-fiber-handoff", "opt-spares-kit",
]);
const EXTRA_REFS = {
  "stage-compute": [FRONT],
  "opt-rack-compute": [FRONT],
  "opt-branding-package": [LOGO],
};
const refsFor = (id) => (NO_REFS.has(id) ? [] : [POD, ...(EXTRA_REFS[id] || [])]);

const wanted = process.argv[2]
  ? entries.filter((e) => e.id === process.argv[2])
  : entries.filter((e) => e.status !== "ready");

if (!wanted.length) {
  console.log(process.argv[2] ? `No entry with id "${process.argv[2]}"` : "All images already ready.");
  process.exit(0);
}

await mkdir(OUT, { recursive: true });
const results = {};

async function generate(img, attempt = 1) {
  const size = `${img.width}x${img.height}`;
  const refs = refsFor(img.id);
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
  if (!res.ok) {
    const body = (await res.text()).slice(0, 300);
    if ((res.status === 429 || res.status >= 500) && attempt <= 3) {
      const wait = attempt * 20000;
      console.log(`  ${img.id}: HTTP ${res.status}, retry ${attempt}/3 in ${wait / 1000}s`);
      await new Promise((r) => setTimeout(r, wait));
      return generate(img, attempt + 1);
    }
    throw new Error(`${res.status} ${body}`);
  }
  const b64 = (await res.json()).data?.[0]?.b64_json;
  if (!b64) throw new Error("no b64_json in response");
  await writeFile(path.join(OUT, `${img.id}.png`), Buffer.from(b64, "base64"));
}

let done = 0;
const queue = [...wanted];
async function worker(n) {
  while (queue.length) {
    const img = queue.shift();
    const label = `${img.id} (${img.width}x${img.height})`;
    try {
      const t0 = Date.now();
      await generate(img);
      results[img.id] = "ready";
      console.log(`[${++done}/${wanted.length}] ok   ${label} ${(Date.now() - t0) / 1000 | 0}s`);
    } catch (err) {
      results[img.id] = "failed";
      console.log(`[${++done}/${wanted.length}] FAIL ${label} — ${err.message}`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, wanted.length) }, (_, i) => worker(i)));

let updated = src;
for (const [id, status] of Object.entries(results)) {
  updated = updated.replace(new RegExp(`(id: "${id}"[\\s\\S]*?status: ")\\w+(")`), `$1${status}$2`);
}
await writeFile(DATA, updated);
const ok = Object.values(results).filter((s) => s === "ready").length;
console.log(`Done: ${ok}/${wanted.length} ready. Statuses updated in src/data/configurator-page-images.ts`);
