import type { Metadata } from "next";
import { invitationStatus } from "@/lib/proposals/access";
import AccessForm from "./AccessForm";

/**
 * /proposal/invite/[token] — Step 00, the secure access screen.
 *
 * Reveals ONLY what verification needs: the company the proposal was prepared
 * for, a masked recipient email, and the access policy. Never prices, never
 * configuration, never the client's full identity. Unknown, expired and
 * revoked tokens all render the same minimal screen so the route cannot be
 * used to probe which invitations exist.
 *
 * Verification exchanges the invitation for an HttpOnly session cookie and
 * redirects to the clean /proposal/[id] route — the raw invitation URL is
 * never used for content access itself (audit F1/F6).
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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        background: "var(--paper)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(40px, 8vw, 96px) 1.25rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
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

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const status = await invitationStatus(token);

  if (!status?.ok) {
    // Uniform for missing, revoked and expired — no oracle.
    return (
      <Shell>
        <p style={{ ...mono, color: "var(--brand)" }}>PODOS · Private</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 10, color: "var(--ink-strong)" }}>
          This link is not active.
        </h1>
        <p style={{ color: "var(--ink-dim)", fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>
          The invitation may have expired or been replaced. Contact the PODOS team member who
          sent it, or <a href="mailto:info@podosai.com" style={{ color: "var(--brand)" }}>info@podosai.com</a>.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <p style={{ ...mono, color: "var(--brand)" }}>PODOS · Secure access</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 10, color: "var(--ink-strong)" }}>
        Private proposal{status.company ? ` for ${status.company}` : ""}
      </h1>
      <p style={{ color: "var(--ink-dim)", fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>
        This workspace is confidential and prepared for the authorized recipient
        {" "}<strong style={{ color: "var(--ink-strong)" }}>{status.masked_email}</strong>.
        {status.access_policy === "otp"
          ? " We will email a six-digit code to that address to verify it is you."
          : " Confirm the authorized email address to continue."}
      </p>

      <AccessForm token={token} policy={status.access_policy} maskedEmail={status.masked_email} />

      <p style={{ ...mono, marginTop: "1.6rem", lineHeight: 1.7 }}>
        Confidential — do not forward. Access is recorded.
      </p>
    </Shell>
  );
}
