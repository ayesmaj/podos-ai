"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import { ADMIN_SECRET } from "@/lib/estimates/admin";
import { PROPOSAL_ASSETS } from "@/lib/proposals/imagePrompts";
import { deleteProposalAsset, generateProposalAsset, isAssetType, upsertProposalAsset } from "@/lib/proposals/assets";

/**
 * /ops/design actions — regenerate or revert one controlled document visual.
 * Generation is a GPT Image 2 EDIT of the approved reference renders fetched
 * from our own origin (never the filesystem, so the function bundle stays
 * small). Outcome is shown once via an HttpOnly cookie like the other flows.
 */

const RESULT_COOKIE = "podos_asset_result";

async function report(type: string, ok: boolean, detail: string) {
  const jar = await cookies();
  jar.set(RESULT_COOKIE, [type, ok ? "ok" : "err", detail.slice(0, 300)].join("|"), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 600 });
  revalidatePath("/ops/design");
}

export async function regenerateAssetAction(formData: FormData) {
  await requireOps();
  const type = String(formData.get("type") ?? "");
  if (!isAssetType(type)) return;
  const q = String(formData.get("quality") ?? "high");
  const quality = q === "low" || q === "medium" ? q : "high";
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    const refs = await Promise.all(PROPOSAL_ASSETS[type].references.map(async (rel) => {
      const r = await fetch(`${proto}://${host}${rel.replace(/^public/, "")}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`reference ${rel} unavailable (${r.status})`);
      return Buffer.from(await r.arrayBuffer());
    }));
    const { webp, bytes } = await generateProposalAsset(type, refs, quality);
    const saved = await upsertProposalAsset(ADMIN_SECRET, type, webp.toString("base64"), "ops");
    if (!saved) throw new Error("could not store the generated asset");
    await report(type, true, `generated at ${quality} quality · ${(bytes / 1024).toFixed(0)} KB · ${saved.sha256.slice(0, 12)}`);
  } catch (e) {
    await report(type, false, e instanceof Error ? e.message : "generation failed");
  }
}

export async function revertAssetAction(formData: FormData) {
  await requireOps();
  const type = String(formData.get("type") ?? "");
  if (!isAssetType(type)) return;
  await deleteProposalAsset(ADMIN_SECRET, type);
  await report(type, true, "reverted to the shipped asset");
}

export async function dismissAssetResult() {
  await requireOps();
  (await cookies()).delete(RESULT_COOKIE);
}
