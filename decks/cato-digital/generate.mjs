/**
 * generate.mjs — render the Cato Digital deck pages via the OpenAI Images API
 * (GPT Image 2), with the real PODOS logo + pod render sent as brand references.
 *
 * Output goes to decks/cato-digital/out/ — deliberately OUTSIDE public/, because
 * the deck is marked confidential and must not be served by the site.
 *
 * Usage:
 *   node --env-file=.env.local decks/cato-digital/generate.mjs               # all pages
 *   node --env-file=.env.local decks/cato-digital/generate.mjs 02-product    # one or more ids
 *   node --env-file=.env.local decks/cato-digital/generate.mjs --size=1024x1024
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { PAGES, REFS, fullPrompt } from "./prompts.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ROOT = path.resolve(HERE, "..", "..");
const OUT = path.join(HERE, "out");

const args = process.argv.slice(2);
/* 2560x1440 = exact 16:9. gpt-image-2 accepts any size whose width and height
 * are both divisible by 16 — the repo's usual 1536x1024 (3:2) squashed the pod
 * out of its real road-legal proportions, so the deck renders wide. */
const SIZE = args.find((a) => a.startsWith("--size="))?.slice(7) ?? "2560x1440";
const WANTED = args.filter((a) => !a.startsWith("--"));
const CONCURRENCY = 3;

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error("OPENAI_API_KEY missing — run with: node --env-file=.env.local decks/cato-digital/generate.mjs");
  process.exit(1);
}
const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";

const wanted = WANTED.length ? PAGES.filter((p) => WANTED.includes(p.id)) : PAGES;
if (!wanted.length) {
  console.error(`No pages matched: ${WANTED.join(", ")}`);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

// Load the brand references once — every page gets the same two.
const refBlobs = await Promise.all(
  REFS.map(async (ref) => ({
    name: path.basename(ref),
    buf: await readFile(path.join(ROOT, ref)),
  })),
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function renderPage(page) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const form = new FormData();
    form.append("model", MODEL);
    form.append("prompt", fullPrompt(page));
    form.append("size", SIZE);
    form.append("quality", "high");
    for (const { name, buf } of refBlobs) {
      form.append("image[]", new Blob([buf], { type: "image/png" }), name);
    }

    const res = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}` },
      body: form,
    });

    if (res.ok) {
      const b64 = (await res.json()).data?.[0]?.b64_json;
      if (!b64) throw new Error("no b64_json in response");
      const file = path.join(OUT, `${page.id}.png`);
      await writeFile(file, Buffer.from(b64, "base64"));
      return file;
    }

    const detail = (await res.text()).slice(0, 300);
    // 429 / 5xx are worth waiting out; anything else is a real error.
    if (res.status !== 429 && res.status < 500) throw new Error(`${res.status} ${detail}`);
    if (attempt === 4) throw new Error(`${res.status} after 4 attempts — ${detail}`);
    const delay = 4000 * 2 ** (attempt - 1);
    console.log(`  ${page.id}: HTTP ${res.status}, retrying in ${delay / 1000}s`);
    await sleep(delay);
  }
}

console.log(`Rendering ${wanted.length} page(s) at ${SIZE} via ${MODEL}, refs: ${REFS.join(", ")}\n`);

const queue = [...wanted];
const results = [];
await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length) {
      const page = queue.shift();
      const started = Date.now();
      try {
        const file = await renderPage(page);
        const secs = ((Date.now() - started) / 1000).toFixed(0);
        console.log(`ok    ${page.id} (${secs}s) -> ${path.relative(ROOT, file)}`);
        results.push({ id: page.id, ok: true });
      } catch (err) {
        console.log(`FAIL  ${page.id} — ${err.message}`);
        results.push({ id: page.id, ok: false, error: err.message });
      }
    }
  }),
);

const failed = results.filter((r) => !r.ok);
console.log(`\nDone. ${results.length - failed.length}/${results.length} rendered.`);
if (failed.length) {
  console.log(`Failed: ${failed.map((f) => f.id).join(", ")}`);
  process.exit(1);
}
