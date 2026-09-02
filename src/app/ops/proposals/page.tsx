import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  ADMIN_SECRET,
  adminLogout,
  adminSessionValid,
  createInvitation,
  listEstimates,
  listInvitations,
  revokeInvitation,
  usd,
  type EstimateRow,
  type InvitationRow,
} from "@/lib/estimates/admin";
import { SITE } from "@/lib/seo/site";
import NewEstimateForm from "./NewEstimateForm";

/**
 * /admin/estimates — staff proposal operations (interim single-page build of
 * the founder's admin mockup: proposals list + per-proposal Secure Access).
 *
 * Access: opaque admin session cookie set by /admin/login. The ?key= path is
 * GONE (audit F2). No session -> redirect to the login screen; the page never
 * renders proposal data to an unauthenticated request.
 *
 * Secure Access panel per proposal: named per-person invitations
 * (create/list/revoke, policy, exchanged state, per-viewer last-seen) —
 * these are the links clients actually receive. The legacy whole-proposal
 * /e/[token] link remains available from create/rotate until invitations
 * fully replace it (MIGRATION_PLAN).
 */

export const metadata: Metadata = {
  title: "Estimates · PODOS admin",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const mono: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

async function requireSession(): Promise<void> {
  const jar = await cookies();
  const tok = jar.get(ADMIN_COOKIE)?.value ?? "";
  if (!tok || !(await adminSessionValid(tok))) redirect("/ops/login");
}

/* ------------------------------------------------------------ actions */

async function logout() {
  "use server";
  const jar = await cookies();
  const tok = jar.get(ADMIN_COOKIE)?.value;
  if (tok) await adminLogout(tok);
  jar.delete(ADMIN_COOKIE);
  redirect("/ops/login");
}

async function invite(formData: FormData) {
  "use server";
  await requireSession();
  const estimateNo = String(formData.get("estimateNo") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const policy = formData.get("policy") === "otp" ? "otp" : "email-confirm";
  if (!estimateNo || !email) return;

  const rows = await createInvitation(ADMIN_SECRET, { estimateNo, email, name: name || undefined, policy });
  const created = rows?.[0];
  if (created) {
    const jar = await cookies();
    // One-shot server-side reveal (HttpOnly — never readable by page JS; audit F10).
    jar.set("podos_new_invite", `${estimateNo}:${created.token}`, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 300,
    });
  }
  revalidatePath("/ops/proposals");
}

async function revoke(formData: FormData) {
  "use server";
  await requireSession();
  const id = String(formData.get("invitationId") ?? "");
  if (id) await revokeInvitation(ADMIN_SECRET, id);
  revalidatePath("/ops/proposals");
}

async function dismissInviteReveal() {
  "use server";
  const jar = await cookies();
  jar.delete("podos_new_invite");
}

/* ------------------------------------------------------------ view bits */

function Pill({ r }: { r: EstimateRow }) {
  const s = r.revoked ? "revoked" : r.status;
  const tone =
    s === "signed"
      ? { bg: "rgba(34,197,94,.10)", bd: "rgba(34,197,94,.45)", fg: "#15803D" }
      : s === "viewed"
        ? { bg: "rgba(34,211,238,.10)", bd: "rgba(34,211,238,.45)", fg: "var(--cyan-deep)" }
        : s === "revoked" || s === "expired"
          ? { bg: "rgba(15,23,42,.05)", bd: "var(--edge-bright)", fg: "var(--ink-faint)" }
          : { bg: "var(--glass-bg-strong)", bd: "var(--edge-bright)", fg: "var(--ink-dim)" };
  return (
    <span style={{ ...mono, fontSize: 10, padding: ".22rem .55rem", borderRadius: 999, background: tone.bg, border: `1px solid ${tone.bd}`, color: tone.fg, whiteSpace: "nowrap" }}>
      {s}
    </span>
  );
}

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleDateString("en-US") : "—";
}

function Invitations({ rows }: { rows: InvitationRow[] }) {
  if (!rows.length) {
    return <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>No invitations yet.</p>;
  }
  return (
    <div style={{ display: "grid", gap: "0.35rem" }}>
      {rows.map((i) => (
        <div key={i.invitation_id} style={{ display: "flex", gap: "0.7rem", alignItems: "baseline", flexWrap: "wrap", fontSize: 12.5 }}>
          <span style={{ color: "var(--ink-strong)" }}>{i.recipient_email}</span>
          <span style={{ ...mono, fontSize: 9.5, color: "var(--ink-faint)" }}>{i.access_policy}</span>
          {i.revoked ? (
            <span style={{ ...mono, fontSize: 9.5, color: "#B91C1C" }}>revoked</span>
          ) : (
            <>
              <span style={{ color: "var(--ink-faint)" }}>
                {i.exchanged_at ? `verified · last seen ${fmt(i.last_seen)}` : `not yet opened · expires ${fmt(i.expires_at)}`}
              </span>
              <form action={revoke} style={{ display: "inline" }}>
                <input type="hidden" name="invitationId" value={i.invitation_id} />
                <button type="submit" style={{ ...mono, fontSize: 9.5, color: "#B91C1C", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Revoke
                </button>
              </form>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

async function NewInviteReveal() {
  const jar = await cookies();
  const raw = jar.get("podos_new_invite")?.value;
  if (!raw) return null;
  const idx = raw.indexOf(":");
  const estimateNo = raw.slice(0, idx);
  const token = raw.slice(idx + 1);
  return (
    <div style={{ marginTop: "1rem", border: "1px solid rgba(34,211,238,.45)", borderRadius: 12, background: "rgba(34,211,238,.07)", padding: "1rem 1.2rem" }}>
      <p style={{ ...mono, color: "var(--cyan-deep)" }}>
        Invitation for {estimateNo} · copy now, shown only once
      </p>
      <code style={{ display: "block", marginTop: ".5rem", fontSize: 12.5, wordBreak: "break-all", color: "var(--ink-strong)" }}>
        {SITE.baseUrl}/e/{token}
      </code>
      <form action={dismissInviteReveal}>
        <button type="submit" style={{ ...mono, marginTop: ".6rem", padding: ".35rem .7rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", color: "var(--ink-dim)", cursor: "pointer" }}>
          I have copied it
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------ page */

export default async function AdminEstimatesPage() {
  await requireSession();

  const rows = (await listEstimates(ADMIN_SECRET)) ?? [];
  const invitations = new Map<string, InvitationRow[]>();
  for (const r of rows) {
    invitations.set(r.estimate_no, (await listInvitations(ADMIN_SECRET, r.estimate_no)) ?? []);
  }

  const totalOpen = rows
    .filter((r) => !r.revoked && r.status !== "signed")
    .reduce((s, r) => s + r.one_time_high_cents, 0);
  const signed = rows.filter((r) => r.status === "signed").length;

  const input: React.CSSProperties = {
    padding: "0.5rem 0.6rem",
    borderRadius: 8,
    border: "1px solid var(--edge-bright)",
    background: "var(--panel)",
    fontSize: 13,
    fontFamily: "inherit",
    minWidth: 0,
  };

  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <div className="container-site" style={{ paddingBlock: "clamp(32px,5vw,56px)", maxWidth: 1100 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
          <p style={{ ...mono, color: "var(--brand)" }}>PODOS · Admin</p>
          <form action={logout} style={{ marginLeft: "auto" }}>
            <button type="submit" style={{ ...mono, color: "var(--ink-faint)", background: "none", border: "none", cursor: "pointer" }}>
              Sign out
            </button>
          </form>
        </div>
        <h1 className="t-headline" style={{ marginTop: ".5rem" }}>Estimates</h1>

        <div style={{ display: "flex", gap: "1.6rem", flexWrap: "wrap", marginTop: "0.9rem" }}>
          <span style={{ ...mono, color: "var(--ink-faint)" }}>{rows.length} total</span>
          <span style={{ ...mono, color: "var(--ink-faint)" }}>{signed} signed</span>
          <span style={{ ...mono, color: "var(--ink-faint)" }}>{usd(totalOpen)} open pipeline</span>
        </div>

        <NewEstimateForm />
        <NewInviteReveal />

        <div style={{ marginTop: "1.8rem", display: "grid", gap: "0.9rem" }}>
          {rows.length === 0 && (
            <p style={{ color: "var(--ink-dim)", fontSize: 14 }}>No estimates yet — create the first above.</p>
          )}
          {rows.map((r) => (
            <div key={r.estimate_no} style={{ border: "1px solid var(--edge)", borderRadius: 14, background: "var(--panel)", padding: "1rem 1.2rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 260px", minWidth: 0 }}>
                  <div style={{ display: "flex", gap: ".5rem", alignItems: "baseline", flexWrap: "wrap" }}>
                    <Link href={`/ops/proposals/${r.public_id}`} style={{ fontSize: 12.5, color: "var(--brand-deep)", fontWeight: 700, textDecoration: "none" }}>{r.estimate_no}</Link>
                    <span style={{ color: "var(--ink-dim)", fontSize: 14 }}>
                      — {r.client_name}
                      {r.company ? ` · ${r.company}` : ""}
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 2 }}>
                    {r.project_name ?? "No project name"}
                    {r.view_count > 0 && ` · viewed ${r.view_count}× · last ${fmt(r.last_viewed_at)}`}
                    {r.signed_at && ` · signed by ${r.signer_name}`}
                  </div>
                </div>
                <div style={{ fontVariantNumeric: "tabular-nums", fontSize: 13.5, whiteSpace: "nowrap", color: "var(--ink-strong)" }}>
                  {r.one_time_high_cents > 0 ? `${usd(r.one_time_low_cents)} – ${usd(r.one_time_high_cents)}` : "—"}
                </div>
                <Pill r={r} />
              </div>

              {/* ---- Secure Access (per the admin mockup's right rail) ---- */}
              <div style={{ marginTop: "0.9rem", borderTop: "1px solid var(--edge-faint)", paddingTop: "0.8rem" }}>
                <p style={{ ...mono, fontSize: 9.5, color: "var(--brand-deep)", marginBottom: "0.5rem" }}>Secure access</p>
                <Invitations rows={invitations.get(r.estimate_no) ?? []} />
                <form action={invite} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.7rem", alignItems: "center" }}>
                  <input type="hidden" name="estimateNo" value={r.estimate_no} />
                  <input style={{ ...input, flex: "1 1 180px" }} name="email" type="email" required placeholder="viewer@company.com" />
                  <input style={{ ...input, flex: "1 1 120px" }} name="name" placeholder="Name (optional)" />
                  <select style={input} name="policy" defaultValue="email-confirm">
                    <option value="email-confirm">Email confirm</option>
                    <option value="otp">Email OTP</option>
                  </select>
                  <button type="submit" style={{ ...mono, fontSize: 10, padding: ".5rem .8rem", borderRadius: 8, border: "1px solid var(--brand)", background: "var(--brand-wash)", color: "var(--brand-deep)", cursor: "pointer" }}>
                    + Invite viewer
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: "1.4rem", maxWidth: "76ch", lineHeight: 1.6 }}>
          Invitation links are personal, stored only as hashes, and shown once. Email OTP requires a
          configured email provider; until then use Email confirm (the recipient types the
          authorized address). Revoking an invitation also ends its active sessions.
        </p>
      </div>
    </main>
  );
}
