#!/usr/bin/env node --experimental-strip-types
/**
 * Generate the controlled proposal asset set with GPT Image 2 EDITS so the
 * approved pod render is preserved (brief §11–§15). One visual bible, three
 * assets, PNG (print) + WebP (web) per asset, prompt + metadata sidecar.
 *
 *   node --experimental-strip-types scripts/generate-proposal-assets.mts [cover|cutaway|deployment ...] [--quality low|medium|high]
 *
 * Requires OPENAI_API_KEY in the environment (read here, never logged).
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import { PROPOSAL_ASSETS, type ProposalAssetType } from "../src/lib/proposals/imagePrompts.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const BASE = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
const args = process.argv.slice(2);
const qIdx = args.indexOf("--quality");
const quality = qIdx >= 0 ? args[qIdx + 1] : "high";
const wanted = args.filter((a, i) => !a.startsWith("--") && i !== qIdx + 1) as ProposalAssetType[];
const types = (wanted.length ? wanted : (Object.keys(PROPOSAL_ASSETS) as ProposalAssetType[])).filter((t) => t in PROPOSAL_ASSETS);

const key = process.env.OPENAI_API_KEY;
if (!key) { console.error("OPENAI_API_KEY is not set"); process.exit(1); }

const redact = (s: string) => s.replace(/sk-[A-Za-z0-9_-]+/g, "[REDACTED]");

async function generate(type: ProposalAssetType) {
  const spec = PROPOSAL_ASSETS[type];
  const form = new FormData();
  form.set("model", "gpt-image-2");
  form.set("prompt", spec.prompt);
  form.set("size", spec.size);
  form.set("quality", quality);
  form.set("n", "1");
  form.set("output_format", "png");
  for (const ref of spec.references) {
    const abs = path.join(ROOT, ref);
    form.append("image[]", new Blob([await fs.readFile(abs)], { type: "image/png" }), path.basename(ref));
  }

  console.log(`[${type}] editing ${spec.references.length} reference(s) → ${spec.size} @ ${quality}`);
  const res = await fetch(`${BASE}/images/edits`, { method: "POST", headers: { Authorization: `Bearer ${key}` }, body: form });
  const payload = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`[${type}] API ${res.status}: ${redact(JSON.stringify(payload?.error ?? payload))}`);
  const item = payload?.data?.[0];
  if (!item?.b64_json) throw new Error(`[${type}] no image data returned`);

  const png = Buffer.from(item.b64_json, "base64");
  const out = path.join(ROOT, spec.file);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(`${out}.png`, png);
  await sharp(png).webp({ quality: 86 }).toFile(`${out}.webp`);

  const meta = path.join(ROOT, "prompts", "proposal");
  await fs.mkdir(meta, { recursive: true });
  await fs.writeFile(path.join(meta, `${type}.txt`), spec.prompt.trim() + "\n");
  await fs.writeFile(path.join(meta, `${type}.generation.json`), JSON.stringify({
    created_at: new Date().toISOString(), model: "gpt-image-2", endpoint: "images/edits", type,
    size: spec.size, quality, references: spec.references, outputs: [`${spec.file}.png`, `${spec.file}.webp`],
    usage: payload.usage ?? null, revised_prompt: item.revised_prompt ?? null,
  }, null, 2) + "\n");
  const info = await sharp(png).metadata();
  console.log(`[${type}] saved ${spec.file}.{png,webp} (${info.width}x${info.height}, ${(png.length / 1024 / 1024).toFixed(1)} MB png)`);
}

let failed = 0;
for (const t of types) {
  try { await generate(t); } catch (e) { failed++; console.error(redact(e instanceof Error ? e.message : String(e))); }
}
process.exit(failed ? 1 : 0);
