import "@/components/ops/ui/ops-tokens.css";
import type { Metadata } from "next";
import Image from "next/image";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import s from "@/components/ops/ui/ops.module.css";
import l from "./login.module.css";
import {
  ADMIN_COOKIE,
  adminLogin,
  adminLoginPin,
  adminRateCheck,
  adminSessionValid,
} from "@/lib/estimates/admin";

/**
 * /admin/login — the only way into the admin surfaces.
 *
 * Replaces the ?key=<secret> query-string gate (audit F2: the shared secret
 * landed in access logs, browser history and referrers). The secret is now
 * entered in a POST form, exchanged server-side for an opaque 12-hour
 * database session (admin_login RPC — failures are audit-logged), and only
 * that opaque token is stored in the cookie. SameSite=Strict, Secure always,
 * HttpOnly (audit F10). Login attempts are rate-limited per IP with a
 * durable DB counter (audit F3).
 *
 * Interim single-role model; Supabase Auth staff accounts + the role matrix
 * are Phase F (docs/private-estimator/ADMIN_SYSTEM_ARCHITECTURE.md).
 */

export const metadata: Metadata = {
  title: "Sign in · PODOS ops",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

async function login(formData: FormData) {
  "use server";
  const secret = String(formData.get("secret") ?? "");
  if (!secret) redirect("/ops/login?e=1");

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const allowed = await adminRateCheck("admin-login", ip, 5, 900);
  if (!allowed) redirect("/ops/login?e=2");

  // a short numeric access code (set in /ops/settings) or the full master secret
  const ua = h.get("user-agent") ?? undefined;
  const token = /^\d{4,12}$/.test(secret) ? await adminLoginPin(secret, ua) : await adminLogin(secret, ua);
  if (!token) redirect("/ops/login?e=1");

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/ops/proposals");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const { e } = await searchParams;

  // Already signed in? Straight to the app.
  const jar = await cookies();
  const existing = jar.get(ADMIN_COOKIE)?.value;
  if (existing && (await adminSessionValid(existing))) redirect("/ops/proposals");

  return (
    <main className={`ops ${l.page}`}>
      <div className={l.card}>
        <div className={l.brand}>
          <Image src="/logo.png" alt="PODOS AI" width={168} height={58} priority sizes="168px" className={l.logo} />
          <span className={s.label}>Operations</span>
        </div>
        <div>
          <h1 className={l.title}>Sign in</h1>
          <p className={l.sub}>Enter your access code to open the operations console.</p>
        </div>
        <form action={login} className={l.form}>
          <label htmlFor="secret" className={s.field}>
            <span className={s.label}>Access code</span>
            <input id="secret" name="secret" type="password" required inputMode="numeric" autoComplete="current-password" className={s.input} />
          </label>
          {e === "1" && <p role="alert" className={`${s.notice} ${s.noticeDanger}`}>Sign-in failed.</p>}
          {e === "2" && <p role="alert" className={`${s.notice} ${s.noticeDanger}`}>Too many attempts. Wait 15 minutes.</p>}
          <button type="submit" className={`${s.btn} ${s.btnPrimary}`}>Sign in <ArrowRight size={16} aria-hidden /></button>
        </form>
        <p className={l.foot}>Sessions last 12 hours. Every sign-in and failure is audit-logged.</p>
      </div>
    </main>
  );
}
