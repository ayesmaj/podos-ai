import type { Metadata } from "next";
import { headers } from "next/headers";
import { invitationStatus } from "@/lib/proposals/access";
import { getEstimateByToken, usd } from "@/lib/estimates/store";
import AccessForm from "./AccessForm";

/**
 * /e/[token] — the unified secure entry (docs/estimator/03-ROUTE-ARCHITECTURE).
 *
 * Dual lookup, invitation-first:
 *  1. proposal_invitations — the canonical per-recipient invitation. Renders
 *     the Step-00 access screen (masked email, OTP or email-confirm) which
 *     exchanges the token for an HttpOnly session and moves to the clean
 *     /client/proposals/[publicId] route.
 *  2. legacy estimates.token_hash — the retired link-possession tier. Old
 *     links keep working during migration (rendered read-only, logged as
 *     'legacy_link_used' via the view tracking) until the founder rotates or
 *     revokes them (09-BUSINESS-DATA founder decisions).
 * Unknown/revoked/expired of EITHER kind render one identical screen.
 */

export const metadata: Metadata = {
  title: "Secure access | PODOS AI",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const mono: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--ink-faint)",
};

function Shell({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <main
      style={{
        background: "var(--paper)",
        minHeight: "100vh",
        display: "flex",
        alignItems: wide ? "flex-start" : "center",
        justifyContent: "center",
        padding: "clamp(40px, 8vw, 96px) 1.25rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: wide ? 880 : 460,
          border: "1px solid var(--edge)",
          borderRadius: 16,
          background: "var(--panel)",
          padding: "2rem",
          boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 24px 60px -30px rgba(15,23,42,.25)",
        }}
      >
        {children}
      </div>
    </main>
  );
}

export default async function SecureEntry({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // ---- 1. invitation tier (canonical) ----
  const invite = await invitationStatus(token);
  if (invite?.ok) {
    return (
      <Shell>
        <p style={{ ...mono, color: "var(--brand)" }}>PODOS · Secure access</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 10, color: "var(--ink-strong)" }}>
          Private proposal{invite.company ? ` for ${invite.company}` : ""}
        </h1>
        <p style={{ color: "var(--ink-dim)", fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>
          This workspace is confidential and prepared for the authorized recipient{" "}
          <strong style={{ color: "var(--ink-strong)" }}>{invite.masked_email}</strong>.
          {invite.access_policy === "otp"
            ? " We will email a six-digit code to that address to verify it is you."
            : " Confirm the authorized email address to continue."}
        </p>
        <AccessForm token={token} policy={invite.access_policy} maskedEmail={invite.masked_email} />
        <p style={{ ...mono, marginTop: "1.6rem", lineHeight: 1.7 }}>
          Confidential — do not forward. Access is recorded.
        </p>
      </Shell>
    );
  }

  // ---- 2. legacy link-possession tier (migration window) ----
  const h = await headers();
  const legacy = await getEstimateByToken(token, {
    userAgent: `legacy-link ${h.get("user-agent") ?? ""}`.slice(0, 380),
    referrer: h.get("referer"),
  });
  if (legacy) {
    const expires = legacy.expires_at ? new Date(legacy.expires_at) : null;
    return (
      <Shell wide>
        <p style={{ ...mono, color: "var(--brand)" }}>
          {legacy.estimate_no} · Prepared for {legacy.client_name}
          {legacy.company ? ` · ${legacy.company}` : ""}
        </p>
        <h1 className="t-headline" style={{ marginTop: "0.6rem" }}>
          {legacy.project_name ?? "Your PODOS estimate"}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.7rem, 4vw, 2.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "var(--ink-strong)",
            marginTop: "1.2rem",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {usd(legacy.one_time_low_cents)} – {usd(legacy.one_time_high_cents)}
        </p>
        {legacy.recurring_cents > 0 && (
          <p style={{ fontSize: 14, color: "var(--ink-dim)", marginTop: "0.4rem" }}>
            + {usd(legacy.recurring_cents)} / year support
          </p>
        )}
        {legacy.line_items?.length > 0 && (
          <div style={{ marginTop: "1.3rem", borderTop: "1px solid var(--edge)", paddingTop: "1rem", display: "grid", gap: "0.4rem" }}>
            {legacy.line_items.map((li, i) => (
              <div key={`${li.label}-${i}`} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: 13.5 }}>
                <span style={{ color: "var(--ink-dim)" }}>{li.label}</span>
                <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink-strong)" }}>{usd(li.amount)}</span>
              </div>
            ))}
          </div>
        )}
        {legacy.signed_at && (
          <p style={{ ...mono, color: "#15803D", marginTop: "1rem" }}>
            Signed by {legacy.signer_name} on {new Date(legacy.signed_at).toLocaleDateString("en-US")}
          </p>
        )}
        <p style={{ fontSize: 12.5, lineHeight: 1.65, color: "var(--ink-faint)", marginTop: "1.6rem", maxWidth: "70ch", borderLeft: "2px solid var(--edge-bright)", paddingLeft: "0.9rem" }}>
          Preliminary configuration estimate prepared for {legacy.client_name}. Not a quote, offer,
          or contract. Final pricing, schedule, performance and scope remain subject to engineering
          review, site validation, equipment availability, applicable taxes, freight, permitting
          requirements and the executed agreement.
          {expires && ` Valid until ${expires.toLocaleDateString("en-US")}.`}
        </p>
        <p style={{ ...mono, marginTop: "1.4rem" }}>
          Questions? <a href="mailto:info@podosai.com" style={{ color: "var(--brand)" }}>info@podosai.com</a>
        </p>
      </Shell>
    );
  }

  // ---- uniform not-active screen (no oracle) ----
  return (
    <Shell>
      <p style={{ ...mono, color: "var(--brand)" }}>PODOS · Private</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 10, color: "var(--ink-strong)" }}>
        This link is not active.
      </h1>
      <p style={{ color: "var(--ink-dim)", fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>
        The invitation may have expired or been replaced. Contact the PODOS team member who sent
        it, or <a href="mailto:info@podosai.com" style={{ color: "var(--brand)" }}>info@podosai.com</a>.
      </p>
    </Shell>
  );
}
