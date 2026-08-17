/**
 * POST /api/generate-image — regenerate an /invest visual on demand.
 *
 * Body: { id?: string, prompt?: string, size?: string, quality?: "low"|"medium"|"high" }
 *   - Pass a known `id` from data/invest-page-images.ts to reuse its prompt,
 *     or a raw `prompt` for ad-hoc generation.
 *
 * Dev-only guard: image generation spends real API credit, so the route is
 * disabled in production unless GENERATE_IMAGE_SECRET matches the
 * x-generate-secret header.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/generateImage";
import { getInvestImage } from "@/data/invest-page-images";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    const secret = process.env.GENERATE_IMAGE_SECRET;
    if (!secret || req.headers.get("x-generate-secret") !== secret) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }
  }

  let body: { id?: string; prompt?: string; size?: string; quality?: "low" | "medium" | "high" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const known = body.id ? getInvestImage(body.id) : undefined;
  const prompt = body.prompt ?? known?.prompt;
  if (!prompt) {
    return NextResponse.json(
      { ok: false, error: "Provide a `prompt` or a known image `id`" },
      { status: 400 }
    );
  }

  const result = await generateImage({
    prompt,
    id: body.id,
    size: body.size ?? (known ? `${known.width}x${known.height}` : undefined),
    quality: body.quality,
    persist: Boolean(body.id) && process.env.NODE_ENV !== "production",
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
