import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminLogout } from "@/lib/estimates/admin";

/**
 * OpsShell — the PODOS operations application frame (master brief 7.1).
 *
 * Light sidebar, full desktop width, no marketing nav or footer. Rendered by
 * every authenticated /ops page (login stays outside it, chrome-free). The
 * sidebar is a plain server component; `active` highlights the current
 * module. Modules with no page yet are shown disabled so the information
 * architecture is legible while later phases fill them in.
 */

const MODULES: { label: string; href: string; ready: boolean }[] = [
  { label: "Dashboard", href: "/ops", ready: true },
  { label: "Clients", href: "/ops/clients", ready: true },
  { label: "Projects", href: "/ops/projects", ready: true },
  { label: "Proposals", href: "/ops/proposals", ready: true },
  { label: "Catalog & Pricing", href: "/ops/pricing", ready: true },
  { label: "Engineering Review", href: "/ops/engineering-review", ready: false },
  { label: "Signatures", href: "/ops/signatures", ready: false },
  { label: "Activity", href: "/ops/activity", ready: false },
  { label: "Users & Roles", href: "/ops/users", ready: false },
  { label: "Settings", href: "/ops/settings", ready: false },
];

async function signOut() {
  "use server";
  const jar = await cookies();
  const tok = jar.get(ADMIN_COOKIE)?.value;
  if (tok) await adminLogout(tok);
  jar.delete(ADMIN_COOKIE);
  redirect("/ops/login");
}

const mono: React.CSSProperties = {
  fontSize: 10.5,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

export default function OpsShell({
  active,
  title,
  actions,
  children,
}: {
  active: string;
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--paper)" }}>
      {/* ---- sidebar ---- */}
      <aside
        style={{
          width: 224,
          flexShrink: 0,
          borderRight: "1px solid var(--edge)",
          background: "var(--panel)",
          padding: "1.1rem 0.9rem",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <Link href="/ops" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 8, padding: "0 0.4rem" }}>
          <Image src="/logo.png" alt="PODOS AI" width={116} height={40} priority sizes="116px" style={{ height: 40, width: "auto" }} />
          <span style={{ ...mono, fontSize: 9, color: "var(--brand)" }}>Ops</span>
        </Link>

        <nav style={{ marginTop: "1.4rem", display: "grid", gap: 2, flex: 1, alignContent: "start" }}>
          {MODULES.map((m) => {
            const isActive = m.href === active;
            if (!m.ready) {
              return (
                <span key={m.href} style={{ ...mono, fontSize: 11, color: "var(--ink-faint)", opacity: 0.5, padding: "0.5rem 0.55rem" }}>
                  {m.label}
                </span>
              );
            }
            return (
              <Link
                key={m.href}
                href={m.href}
                style={{
                  ...mono,
                  fontSize: 11,
                  padding: "0.5rem 0.55rem",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: isActive ? "var(--brand-deep)" : "var(--ink-dim)",
                  background: isActive ? "var(--brand-wash)" : "transparent",
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {m.label}
              </Link>
            );
          })}
        </nav>

        <form action={signOut}>
          <button type="submit" style={{ ...mono, fontSize: 10, color: "var(--ink-faint)", background: "none", border: "none", cursor: "pointer", padding: "0.5rem 0.55rem" }}>
            Sign out
          </button>
        </form>
      </aside>

      {/* ---- working canvas ---- */}
      <main style={{ flex: 1, minWidth: 0, padding: "clamp(1.5rem, 3vw, 2.5rem)" }}>
        <header style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.6rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.03em", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--ink-strong)" }}>
            {title}
          </h1>
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.6rem", alignItems: "center" }}>{actions}</div>
        </header>
        {children}
      </main>
    </div>
  );
}
