import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminSessionValid } from "@/lib/estimates/admin";

/**
 * requireOps — gate every /ops application page behind the opaque admin
 * session. Server-only. Redirects to the login screen when the cookie is
 * missing or the DB says the session is invalid/expired/revoked. Every page
 * and server action in the ops app calls this first (master brief 22:
 * authorization is never a hidden-UI control — it is checked server-side on
 * each request).
 */
export async function requireOps(): Promise<void> {
  const jar = await cookies();
  const tok = jar.get(ADMIN_COOKIE)?.value ?? "";
  if (!tok || !(await adminSessionValid(tok))) redirect("/ops/login");
}
