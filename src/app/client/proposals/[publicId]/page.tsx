import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  VIEWER_COOKIE,
  sessionProposal,
  signViaSession,
} from "@/lib/proposals/access";

/**
 * /client/proposals/[publicId] — the clean, session-gated client workspace.
 *
 * No token and NO internal id in this URL: [publicId] is the human-readable
 * proposal id (POD-EST-2026-NNNN; docs/estimator/03-ROUTE-ARCHITECTURE), and
 * access requires the HttpOnly viewer session set by the invitation exchange.
 * Missing/expired/revoked session, or a session for a DIFFERENT proposal,
 * all render the same 404 (no oracle).
 *
 * Workspace v1 = utility rail (per the founder mockup: logo, proposal no.,
 * version, CONFIDENTIAL, viewer identity, exit) + the proposal document +
 * identity-attached signing. The 14-step configurator canvas is Phase B
 * (docs/private-estimator/CLIENT_FLOW_ARCHITECTURE.md).
 */

export const metadata: Metadata = {
  title: "Private proposal | PODOS AI",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

const mono: React.CSSProperties = {
  fontSize: 10.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-faint)",
};

const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;

function usd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function ProposalWorkspace({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();

  const jar = await cookies();
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (!session) notFound();

  const p = await sessionProposal(session);
  if (!p) notFound();

  // The session is scoped to exactly one proposal; bind it to the URL so a
  // valid session for proposal A can never render at proposal B's address.
  // Mismatch is a uniform 404.
  if (p.public_id !== publicId) notFound();

  const expires = p.expires_at ? new Date(p.expires_at) : null;

  async function sign(formData: FormData) {
    "use server";
    const name = String(formData.get("signerName") ?? "").trim();
    const title = String(formData.get("signerTitle") ?? "").trim();
    if (!name) return;
    const jar2 = await cookies();
    const tok = jar2.get(VIEWER_COOKIE)?.value ?? "";
    if (!tok) return;
    await signViaSession(tok, name, title || undefined);
    revalidatePath(`/client/proposals/${publicId}`);
  }

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      {/* ---- utility rail: NOT the marketing nav ---- */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "0.7rem clamp(1rem, 3vw, 2rem)",
          borderBottom: "1px solid var(--edge)",
          background: "var(--panel)",
        }}
      >
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--ink-strong)" }}>
          PODOS
        </span>
        <span style={mono}>{p.estimate_no} · v1</span>
        <span
          style={{
            ...mono,
            color: "var(--brand-deep)",
            border: "1px solid rgba(37,99,235,.35)",
            background: "rgba(37,99,235,.06)",
            borderRadius: 999,
            padding: "0.2rem 0.6rem",
          }}
        >
          Confidential
        </span>
        <span style={{ ...mono, marginLeft: "auto" }}>{p.viewer_email}</span>
        {expires && <span style={mono}>Valid until {expires.toLocaleDateString("en-US")}</span>}
        <a href="mailto:info@podosai.com" style={{ ...mono, color: "var(--brand)" }}>
          Help
        </a>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(28px, 5vw, 56px) 1.25rem" }}>
        <p style={mono}>
          Prepared for {p.client_name}
          {p.company ? ` · ${p.company}` : ""}
        </p>
        <h1 className="t-headline" style={{ marginTop: "0.6rem", maxWidth: "20ch" }}>
          {p.project_name ?? "Your PODOS deployment proposal"}
        </h1>

        <section
          style={{
            marginTop: "2rem",
            border: "1px solid var(--edge)",
            borderRadius: 14,
            background: "var(--panel)",
            padding: "1.6rem",
            boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 18px 50px -30px rgba(15,23,42,.25)",
          }}
        >
          <p style={mono}>Preliminary estimate</p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.9rem, 4.5vw, 2.9rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "var(--ink-strong)",
              marginTop: "0.35rem",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {usd(p.one_time_low_cents)} – {usd(p.one_time_high_cents)}
          </p>
          {p.recurring_cents > 0 && (
            <p style={{ fontSize: 14, color: "var(--ink-dim)", marginTop: "0.45rem" }}>
              + {usd(p.recurring_cents)} / year support
            </p>
          )}

          {p.line_items?.length > 0 && (
            <div style={{ marginTop: "1.3rem", borderTop: "1px solid var(--edge)", paddingTop: "1rem" }}>
              <p style={mono}>Line items</p>
              <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.6rem" }}>
                {p.line_items.map((li, i) => (
                  <div key={`${li.label}-${i}`} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: 13.5 }}>
                    <span style={{ color: "var(--ink-dim)" }}>{li.label}</span>
                    <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink-strong)" }}>{usd(li.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ---- signing: attached to the verified viewer identity ---- */}
        {p.signed_at ? (
          <p style={{ ...mono, color: "#15803D", marginTop: "1.2rem" }}>
            Signed by {p.signer_name} on {new Date(p.signed_at).toLocaleDateString("en-US")}
          </p>
        ) : (
          <form
            action={sign}
            style={{
              marginTop: "1.4rem",
              border: "1px solid var(--edge)",
              borderRadius: 12,
              background: "var(--panel)",
              padding: "1.1rem 1.2rem",
              display: "grid",
              gap: "0.7rem",
              maxWidth: 520,
            }}
          >
            <p style={{ ...mono, color: "var(--brand-deep)" }}>Acknowledge and accept</p>
            <p style={{ fontSize: 12.5, color: "var(--ink-dim)", lineHeight: 1.6 }}>
              Acceptance is recorded against your verified access ({p.viewer_email}). This is a
              preliminary-estimate acknowledgement, not a provider-certified signature.
            </p>
            <input name="signerName" required placeholder="Full name" style={{ padding: "0.65rem 0.75rem", borderRadius: 10, border: "1px solid var(--edge-bright)", fontSize: 14.5, fontFamily: "inherit" }} />
            <input name="signerTitle" placeholder="Title (optional)" style={{ padding: "0.65rem 0.75rem", borderRadius: 10, border: "1px solid var(--edge-bright)", fontSize: 14.5, fontFamily: "inherit" }} />
            <button type="submit" style={{ padding: "0.8rem 1rem", borderRadius: 10, background: "var(--brand-gradient)", color: "#fff", fontWeight: 600, fontSize: 14.5, border: "none", cursor: "pointer" }}>
              Sign and accept →
            </button>
          </form>
        )}

        <p
          style={{
            fontSize: 12.5,
            lineHeight: 1.65,
            color: "var(--ink-faint)",
            marginTop: "2rem",
            maxWidth: "70ch",
            borderLeft: "2px solid var(--edge-bright)",
            paddingLeft: "0.9rem",
          }}
        >
          Preliminary configuration estimate prepared for {p.client_name}. Not a quote, offer, or
          contract. Final pricing, schedule, performance and scope remain subject to engineering
          review, site validation, equipment availability, applicable taxes, freight, permitting
          requirements and the executed agreement.
        </p>

        <p style={{ ...mono, marginTop: "2.2rem" }}>
          Confidential — prepared for {p.company ?? p.client_name} · {p.viewer_email} · access is recorded
        </p>
      </main>
    </div>
  );
}
