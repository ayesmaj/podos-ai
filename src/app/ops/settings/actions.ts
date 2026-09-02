"use server";

import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import { attempt } from "@/lib/ops/result";
import { ADMIN_SECRET, setAppSettings } from "@/lib/estimates/admin";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const linesOf = (v: string) => v.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

/** Company identity + standard texts printed on every estimate sheet. */
export async function saveSettingsAction(fd: FormData) {
  await requireOps();
  const days = Number(s(fd, "default_validity_days"));
  const trust = [0, 1, 2].map((i) => ({ title: s(fd, `trust_title_${i}`), subtitle: s(fd, `trust_subtitle_${i}`) })).filter((t) => t.title);
  await attempt("Settings saved — every proposal now prints with these details.", () => setAppSettings(ADMIN_SECRET, {
    name: s(fd, "name"), legal_name: s(fd, "legal_name"), website: s(fd, "website"), email: s(fd, "email"), phone: s(fd, "phone"),
    address_lines: linesOf(s(fd, "address_lines")),
    default_validity_days: Number.isInteger(days) && days > 0 && days <= 365 ? days : 30,
    notify_email: s(fd, "notify_email"),
    trust: trust.length === 3 ? trust : undefined,
    notes: linesOf(s(fd, "notes")),
    warranty: s(fd, "warranty"),
  }));
  revalidatePath("/ops/settings");
}
