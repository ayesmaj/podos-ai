import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ADMIN_SECRET, listEstimates, usd, type EstimateRow } from "@/lib/estimates/admin";
import NewEstimateForm from "./NewEstimateForm";
import { SITE } from "@/lib/seo/site";

/**
 * /admin/estimates — staff view of every client estimate.
 *
 * Access: there is no auth system in this repo yet, so the page is gated by the
 * same shared secret the database RPCs require. Visit once with ?key=<secret>;
 * it is stored in an httpOnly cookie and the key drops out of the URL. Anything
 * without a valid secret gets a 404, identical to a route that does not exist,
 * so the page cannot be discovered by probing.
 *
 * This is a stopgap, NOT real access control — replace it with Supabase Auth
 * plus RBAC when the Phase 1 foundation lands (see BUSINESS_DATA_REQUIRED §I).
 */

export const metadata: Metadata = {
  title: "Estimates · PODOS admin",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

function Pill({ row }: { row: EstimateRow }) {
  const s = row.revoked ? "revoked" : row.status;
  const tone =
    s === "signed" ? { bg: "rgba(34,197,94,.10)", bd: "rgba(34,197,94,.45)", fg: "#15803D" }
    : s === "viewed" ? { bg: "rgba(34,211,238,.10)", bd: "rgba(34,211,238,.45)", fg: "var(--cyan-deep)" }
    : s === "revoked" || s === "expired" ? { bg: "rgba(15,23,42,.05)", bd: "var(--edge-bright)", fg: "var(--ink-faint)" }
    : { bg: "var(--glass-bg-strong)", bd: "var(--edge-bright)", fg: "var(--ink-dim)" };
  return (
    <span style={{ ...mono, fontSize: 10, padding: ".22rem .55rem", borderRadius: 999,
      background: tone.bg, border: `1px solid ${tone.bd}`, color: tone.fg, whiteSpace: "nowrap" }}>
      {s}
    </span>
  );
}

export default async function AdminEstimatesPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const jar = await cookies();

  // Secret may arrive by query (first visit) or cookie (afterwards).
  const supplied = key ?? jar.get("podos_admin")?.value ?? "";
  if (!ADMIN_SECRET || supplied !== ADMIN_SECRET) notFound();

  const rows = (await listEstimates(ADMIN_SECRET)) ?? [];
  const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString("en-US") : "—");

  const totalOpen = rows
    .filter((r) => !r.revoked && r.status !== "signed")
    .reduce((s, r) => s + r.one_time_high_cents, 0);
  const signed = rows.filter((r) => r.status === "signed").length;

  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <div className="container-site" style={{ paddingBlock: "clamp(40px,6vw,72px)", maxWidth: 1100 }}>
        <p style={{ ...mono, color: "var(--brand)" }}>PODOS · Admin</p>
        <h1 className="t-headline" style={{ marginTop: ".6rem" }}>Estimates</h1>

        <div style={{ display: "flex", gap: "1.6rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <span style={{ ...mono, color: "var(--ink-faint)" }}>{rows.length} total</span>
          <span style={{ ...mono, color: "var(--ink-faint)" }}>{signed} signed</span>
          <span style={{ ...mono, color: "var(--ink-faint)" }}>{usd(totalOpen)} open pipeline</span>
        </div>

        {/* If the secret came in by URL, store it and strip it from the address bar. */}
        {key ? <SetCookie value={key} /> : null}

        <NewEstimateForm />

        <NewLinkBanner />

        <div style={{ marginTop: "2rem", border: "1px solid var(--edge)", borderRadius: 14,
          background: "var(--panel)", overflow: "hidden" }}>
          {rows.length === 0 && (
            <p style={{ padding: "1.4rem", color: "var(--ink-dim)", fontSize: 14 }}>
              No estimates yet. Create the first one above — the client link is shown once.
            </p>
          )}
          {rows.map((r, i) => (
            <div key={r.estimate_no}
              style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap",
                padding: "1rem 1.2rem", borderTop: i === 0 ? "none" : "1px solid var(--edge-faint)" }}>
              <div style={{ flex: "1 1 260px", minWidth: 0 }}>
                <div style={{ display: "flex", gap: ".5rem", alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ ...mono, fontSize: 12, color: "var(--ink-strong)", fontWeight: 600 }}>
                    {r.estimate_no}
                  </span>
                  <span style={{ color: "var(--ink-dim)", fontSize: 14 }}>
                    — {r.client_name}{r.company ? ` · ${r.company}` : ""}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 2 }}>
                  {r.project_name ?? "No project name"}
                  {r.view_count > 0 && ` · viewed ${r.view_count}× · last ${fmt(r.last_viewed_at)}`}
                  {r.signed_at && ` · signed by ${r.signer_name}`}
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
                fontSize: 13.5, whiteSpace: "nowrap" }}>
                {r.one_time_high_cents > 0 ? `${usd(r.one_time_low_cents)} – ${usd(r.one_time_high_cents)}` : "—"}
              </div>
              <Pill row={r} />
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: "1.4rem", maxWidth: "72ch", lineHeight: 1.6 }}>
          Client links are stored only as a hash and are shown once, at creation. If a link is lost,
          regenerate it — that issues a new link and invalidates the old one. This page is gated by a
          shared secret, which is a stopgap until real authentication is in place.
        </p>
      </div>
    </main>
  );
}

/** Persists the admin secret in an httpOnly cookie, then reloads without the query string. */
function SetCookie({ value }: { value: string }) {
  return (
    <form action={async () => {
      "use server";
      const jar = await cookies();
      jar.set("podos_admin", value, {
        httpOnly: true, sameSite: "lax", path: "/admin",
        maxAge: 60 * 60 * 12, secure: process.env.NODE_ENV === "production",
      });
    }}>
      <button type="submit" style={{ ...mono, marginTop: "1rem", padding: ".5rem .9rem",
        borderRadius: 8, border: "1px solid var(--brand)", background: "var(--brand-wash)",
        color: "var(--brand-deep)", cursor: "pointer" }}>
        Remember me on this device
      </button>
    </form>
  );
}

/**
 * Shows a freshly created client link exactly once, then clears the one-shot
 * cookie so a reload will not surface it again.
 */
async function NewLinkBanner() {
  const jar = await cookies();
  const raw = jar.get("podos_new_link")?.value;
  if (!raw) return null;
  const idx = raw.indexOf(":");
  const estimateNo = raw.slice(0, idx);
  const token = raw.slice(idx + 1);

  return (
    <div style={{ marginTop: "1rem", border: "1px solid rgba(34,211,238,.45)", borderRadius: 12,
      background: "rgba(34,211,238,.07)", padding: "1rem 1.2rem" }}>
      <p style={{ ...mono, color: "var(--cyan-deep)" }}>
        {estimateNo} created · copy this link now, it is shown only once
      </p>
      <code style={{ display: "block", marginTop: ".55rem", fontFamily: "var(--font-mono)",
        fontSize: 12.5, wordBreak: "break-all", color: "var(--ink-strong)" }}>
        {SITE.baseUrl}/e/{token}
      </code>
      <form action={async () => {
        "use server";
        const j = await cookies();
        j.delete("podos_new_link");
      }}>
        <button type="submit" style={{ ...mono, marginTop: ".7rem", padding: ".4rem .8rem",
          borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)",
          color: "var(--ink-dim)", cursor: "pointer" }}>
          I have copied it
        </button>
      </form>
    </div>
  );
}
