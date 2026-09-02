"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireOps } from "@/lib/ops/session";
import { attempt } from "@/lib/ops/result";
import {
  ADMIN_SECRET, archiveOrganization, deleteContact, deleteNote, deleteOrganization, deleteProject,
  updateContact, updateOrganization, updateProject,
} from "@/lib/estimates/admin";

/**
 * Client detail mutations. Every rule that matters (a client or project with
 * released / signed proposals cannot be deleted, deleting a contact revokes its
 * links) lives in the database function; here we only shape the form data and
 * report the outcome.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const opt = (fd: FormData, k: string) => s(fd, k) || undefined;
const num = (fd: FormData, k: string) => { const v = s(fd, k); if (!v) return null; const n = Number(v); return Number.isFinite(n) ? n : null; };
const refresh = (orgId: string) => { revalidatePath(`/ops/clients/${orgId}`); revalidatePath("/ops/clients"); revalidatePath("/ops/projects"); revalidatePath("/ops/proposals"); };

export async function updateOrgAction(fd: FormData) {
  await requireOps();
  const orgId = s(fd, "orgId"); if (!UUID_RE.test(orgId)) return;
  const name = s(fd, "name"); if (!name) return;
  await attempt("Client updated.", () => updateOrganization(ADMIN_SECRET, { orgId, name, legalName: opt(fd, "legal_name"), website: opt(fd, "website"), industry: opt(fd, "industry"), country: opt(fd, "country"), notes: opt(fd, "notes") }));
  refresh(orgId);
}

export async function archiveOrgAction(fd: FormData) {
  await requireOps();
  const orgId = s(fd, "orgId"); if (!UUID_RE.test(orgId)) return;
  const archived = s(fd, "archived") === "1";
  await attempt(archived ? "Client archived — hidden from new-proposal pickers; existing proposals untouched." : "Client restored.", () => archiveOrganization(ADMIN_SECRET, orgId, archived));
  refresh(orgId);
}

export async function deleteOrgAction(fd: FormData) {
  await requireOps();
  const orgId = s(fd, "orgId"); if (!UUID_RE.test(orgId) || fd.get("confirm") !== "on") return;
  const ok = await attempt("Client deleted with its contacts, projects and draft proposals.", () => deleteOrganization(ADMIN_SECRET, orgId));
  refresh(orgId);
  if (ok) redirect("/ops/clients");
}

export async function updateContactAction(fd: FormData) {
  await requireOps();
  const id = s(fd, "id"), orgId = s(fd, "orgId"); if (!UUID_RE.test(id) || !UUID_RE.test(orgId)) return;
  const first = s(fd, "first"); if (!first) return;
  const roles = fd.getAll("roles").map(String).filter(Boolean);
  await attempt("Contact updated (unsigned proposals addressed to them follow).", () => updateContact(ADMIN_SECRET, { id, first, last: opt(fd, "last"), title: opt(fd, "title"), email: opt(fd, "email"), phone: opt(fd, "phone"), roles: roles.length ? roles : undefined }));
  refresh(orgId);
}

export async function deleteContactAction(fd: FormData) {
  await requireOps();
  const id = s(fd, "id"), orgId = s(fd, "orgId"); if (!UUID_RE.test(id) || !UUID_RE.test(orgId) || fd.get("confirm") !== "on") return;
  await attempt("Contact removed; their secure links were revoked.", () => deleteContact(ADMIN_SECRET, id));
  refresh(orgId);
}

export async function updateProjectAction(fd: FormData) {
  await requireOps();
  const id = s(fd, "id"), orgId = s(fd, "orgId"); if (!UUID_RE.test(id) || !UUID_RE.test(orgId)) return;
  const name = s(fd, "name"); if (!name) return;
  await attempt("Project updated (its proposals show the new name).", () => updateProject(ADMIN_SECRET, {
    id, name, description: opt(fd, "description"), pods: num(fd, "pods"), capacityMw: num(fd, "capacity_mw"), gpus: num(fd, "gpus"), workload: opt(fd, "workload"), golive: opt(fd, "golive") ?? null,
  }));
  refresh(orgId);
}

export async function deleteProjectAction(fd: FormData) {
  await requireOps();
  const id = s(fd, "id"), orgId = s(fd, "orgId"); if (!UUID_RE.test(id) || !UUID_RE.test(orgId) || fd.get("confirm") !== "on") return;
  await attempt("Project deleted with its draft proposals.", () => deleteProject(ADMIN_SECRET, id));
  refresh(orgId);
}

export async function deleteNoteAction(fd: FormData) {
  await requireOps();
  const id = s(fd, "id"), orgId = s(fd, "orgId"); if (!UUID_RE.test(id) || !UUID_RE.test(orgId)) return;
  await attempt("Note deleted.", () => deleteNote(ADMIN_SECRET, id));
  refresh(orgId);
}
