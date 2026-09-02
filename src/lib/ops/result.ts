import { cookies } from "next/headers";
import { AdminRpcError } from "@/lib/estimates/admin";

/**
 * One-shot outcome banner for admin mutations (HttpOnly cookie, read by
 * <AdminResult/>). Lets a server action report "deleted" or the database's
 * refusal ("This client has released proposals…") without client JS.
 */

export const RESULT_COOKIE = "podos_admin_result";

export async function setAdminResult(ok: boolean, message: string) {
  (await cookies()).set(RESULT_COOKIE, `${ok ? "ok" : "err"}|${message.slice(0, 300)}`, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 300 });
}

export async function readAdminResult(): Promise<{ ok: boolean; message: string } | null> {
  const raw = (await cookies()).get(RESULT_COOKIE)?.value;
  if (!raw) return null;
  const i = raw.indexOf("|");
  return { ok: raw.slice(0, i) === "ok", message: raw.slice(i + 1) };
}

/** Run a mutation, record success or the refusal message; returns whether it succeeded. */
export async function attempt(okMessage: string, fn: () => Promise<unknown>): Promise<boolean> {
  try {
    const r = await fn();
    if (r === false) { await setAdminResult(false, "Nothing changed — the record was not found."); return false; }
    await setAdminResult(true, okMessage);
    return true;
  } catch (e) {
    await setAdminResult(false, e instanceof AdminRpcError ? e.message : e instanceof Error ? e.message : "The change failed.");
    return false;
  }
}
