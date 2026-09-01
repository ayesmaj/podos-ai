import type { Metadata } from "next";

/**
 * /estimate — private-access notice ONLY (rebuild brief §1A).
 *
 * The public estimator that lived here is retired: it exposed configuration
 * cards and placeholder prices to anyone, computed money in the browser, and
 * fed an inbound form from client-supplied figures. Proposals are now private:
 * each client receives a secure invitation (/proposal/invite/[token]) that is
 * verified and exchanged for a session before anything renders.
 *
 * This page shows NO prices, NO products, NO configuration UI, and no
 * proposal data of any kind. It is noindex at both layers (metadata here,
 * X-Robots-Tag via proxy.ts), Cache-Control: private, no-store via proxy.ts,
 * absent from the sitemap, and unlinked from public navigation.
 *
 * The configurator components remain in the repo for the authenticated
 * client workspace (MIGRATION_PLAN Phase B) — they are simply no longer
 * publicly routable.
 */

export const metadata: Metadata = {
  title: "Private proposal environment | PODOS AI",
  robots: { index: false, follow: false, nocache: true },
};

export default function EstimatePrivateNotice() {
  return (
    <main
      style={{
        background: "var(--paper)",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(48px, 10vw, 120px) 1.5rem",
      }}
    >
      <div style={{ maxWidth: 560, textAlign: "center" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--brand)",
          }}
        >
          PODOS · Private
        </p>
        <h1 className="t-headline" style={{ marginTop: "0.8rem" }}>
          This is a private proposal environment.
        </h1>
        <p style={{ color: "var(--ink-dim)", marginTop: "1rem", lineHeight: 1.65, fontSize: 15 }}>
          PODOS deployment proposals are prepared individually and shared through a secure
          invitation sent to your authorized email address. If you are evaluating PODOS
          infrastructure and would like a configuration prepared for you, contact our team.
        </p>
        <p style={{ marginTop: "1.6rem" }}>
          <a
            href="mailto:info@podosai.com"
            style={{
              display: "inline-block",
              padding: "0.85rem 1.5rem",
              borderRadius: 10,
              background: "var(--brand-gradient)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14.5,
              textDecoration: "none",
            }}
          >
            Contact PODOS →
          </a>
        </p>
        <p style={{ color: "var(--ink-faint)", fontSize: 12.5, marginTop: "1.6rem" }}>
          Received an invitation? Use the exact link from your email — it is unique to you.
        </p>
      </div>
    </main>
  );
}
