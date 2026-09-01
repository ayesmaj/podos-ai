import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  adminLogin,
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
  title: "Sign in | PODOS admin",
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

  const token = await adminLogin(secret, h.get("user-agent") ?? undefined);
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
    <main
      style={{
        background: "var(--paper)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.25rem",
      }}
    >
      <form
        action={login}
        style={{
          width: "100%",
          maxWidth: 380,
          border: "1px solid var(--edge)",
          borderRadius: 16,
          background: "var(--panel)",
          padding: "2rem",
          display: "grid",
          gap: "0.8rem",
          boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 24px 60px -30px rgba(15,23,42,.25)",
        }}
      >
        <p style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--brand)" }}>
          PODOS · Internal
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink-strong)" }}>
          Admin sign-in
        </h1>
        <label htmlFor="secret" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          Access secret
        </label>
        <input
          id="secret"
          name="secret"
          type="password"
          required
          autoComplete="current-password"
          style={{
            padding: "0.7rem 0.8rem",
            borderRadius: 10,
            border: "1px solid var(--edge-bright)",
            fontSize: 15,
            fontFamily: "inherit",
          }}
        />
        {e === "1" && (
          <p role="alert" style={{ fontSize: 13, color: "#B91C1C" }}>
            Sign-in failed.
          </p>
        )}
        {e === "2" && (
          <p role="alert" style={{ fontSize: 13, color: "#B91C1C" }}>
            Too many attempts. Wait 15 minutes.
          </p>
        )}
        <button
          type="submit"
          style={{
            padding: "0.8rem 1rem",
            borderRadius: 10,
            background: "var(--brand-gradient)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14.5,
            border: "none",
            cursor: "pointer",
          }}
        >
          Sign in →
        </button>
        <p style={{ fontSize: 11.5, color: "var(--ink-faint)", lineHeight: 1.6 }}>
          Sessions last 12 hours. Every sign-in and failure is audit-logged.
        </p>
      </form>
    </main>
  );
}
