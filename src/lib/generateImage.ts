/**
 * generateImage.ts — server-side utility around the OpenAI Images API
 * (GPT Image 2). Used by app/api/generate-image/route.ts and by
 * scripts/generate-invest-images.mjs (which re-implements the same call
 * in plain Node for CLI use).
 *
 * Env: OPENAI_API_KEY (required), OPENAI_IMAGE_MODEL (default gpt-image-2).
 */

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export interface GenerateImageOptions {
  prompt: string;
  /** e.g. "1536x1024" | "1024x1024" | "1024x1536" */
  size?: string;
  quality?: "low" | "medium" | "high";
  /** File stem; saved to public/visuals/invest/<id>.png when persist=true */
  id?: string;
  /** Persist to /public (works locally; serverless filesystems are read-only) */
  persist?: boolean;
}

export interface GenerateImageResult {
  ok: boolean;
  /** Public URL when persisted, otherwise a data: URL */
  url?: string;
  model?: string;
  error?: string;
}

const OUT_DIR = path.join(process.cwd(), "public", "visuals", "invest");

export async function generateImage(
  opts: GenerateImageOptions
): Promise<GenerateImageResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { ok: false, error: "OPENAI_API_KEY is not set" };

  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt: opts.prompt,
      size: opts.size ?? "1536x1024",
      quality: opts.quality ?? "high",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    return { ok: false, model, error: `OpenAI ${res.status}: ${detail.slice(0, 500)}` };
  }

  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) return { ok: false, model, error: "No image data in response" };

  if (opts.persist && opts.id) {
    // ponytail: local-dev persistence only. On Vercel the filesystem is
    // read-only — swap this branch for Vercel Blob when admin regeneration
    // needs to work in production.
    await mkdir(OUT_DIR, { recursive: true });
    const file = path.join(OUT_DIR, `${opts.id.replace(/[^a-z0-9-]/gi, "")}.png`);
    await writeFile(file, Buffer.from(b64, "base64"));
    return { ok: true, model, url: `/visuals/invest/${path.basename(file)}` };
  }

  return { ok: true, model, url: `data:image/png;base64,${b64}` };
}
