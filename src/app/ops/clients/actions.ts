"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import { attempt } from "@/lib/ops/result";
import { ADMIN_SECRET, createOrganization } from "@/lib/estimates/admin";

/** New client (from the drawer). Lands on the client page so contacts and projects can be added next. */
export async function newClientAction(fd: FormData) {
  await requireOps();
  const name = String(fd.get("name") ?? "").trim();
  const website = String(fd.get("website") ?? "").trim();
  const notes = String(fd.get("notes") ?? "").trim();
  if (!name) return;
  let id: string | null = null;
  await attempt(`${name} created — add a contact and a project next.`, async () => { id = await createOrganization(ADMIN_SECRET, name, website || undefined, notes || undefined); return id; });
  revalidatePath("/ops/clients"); revalidatePath("/ops");
  if (id) redirect(`/ops/clients/${id}`);
}
