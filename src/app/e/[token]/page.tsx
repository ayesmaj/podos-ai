import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getEstimateByToken, usd } from "@/lib/estimates/store";

/**
 * /e/[token] — a private, per-client estimate.
 *
 * Reachable only by its secret link: a 256-bit token, stored server-side as a
 * SHA-256 hash. Unknown, revoked and expired tokens all render the same 404, so
 * the page cannot be used to probe for valid links.
 *
 * Never indexed, never cached, never in the sitemap (master brief §23/§26).
 * Opening the page records a view, which is what powers the "viewed 3x" column
 * on the staff side.
 */

export const metadata: Metadata = {
  title: "Your PODOS estimate",
  robots: { index: false, follow: false, nocache: true },
};

// Every request must hit the database: the view counter has to increment, and a
// commercial document must never be served from a shared cache.
export const dynamic = "force-dynamic";

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "signed"
      ? { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.45)", fg: "#15803D" }
      : status === "viewed"
        ? { bg: "rgba(34,211,238,0.10)", bd: "rgba(34,211,238,0.45)", fg: "var(--cyan-deep)" }
        : { bg: "var(--glass-bg-strong)", bd: "var(--edge-bright)", fg: "var(--ink-dim)" };
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: "0.25rem 0.6rem",
        borderRadius: 999,
        background: tone.bg,
        border: `1px solid ${tone.bd}`,
        color: tone.fg,
      }}
    >
      {status}
    </span>
  );
}

export default async function ClientEstimatePage({
  params,
}: {
  // Next 16: params is a Promise and must be awaited.
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const h = await headers();
  const estimate = await getEstimateByToken(token, {
    userAgent: h.get("user-agent"),
    referrer: h.get("referer"),
  });

  // One response for missing, revoked and expired alike — no information leak.
  if (!estimate) notFound();

  const mono: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--ink-faint)",
  };
  const expires = estimate.expires_at ? new Date(estimate.expires_at) : null;

  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <div className="container-site" style={{ paddingBlock: "clamp(48px, 8vw, 96px)", maxWidth: 900 }}>
        <p style={mono}>
          {estimate.estimate_no} · Prepared for {estimate.client_name}
          {estimate.company ? ` · ${estimate.company}` : ""}
        </p>

        <h1 className="t-headline" style={{ marginTop: "0.8rem", maxWidth: "18ch" }}>
          {estimate.project_name ?? "Your PODOS deployment estimate"}
        </h1>

        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginTop: "1rem", flexWrap: "wrap" }}>
          <StatusPill status={estimate.status} />
          <span style={mono}>Viewed {estimate.view_count}×</span>
          {expires && <span style={mono}>Valid until {expires.toLocaleDateString("en-US")}</span>}
        </div>

        {/* ---- the numbers ---- */}
        <section
          style={{
            marginTop: "2.4rem",
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
              // Geist display, not mono: mono is this site's data face for small
              // readouts and codes. The headline figure is a statement number,
              // so it uses the same treatment as the site's giant stats
              // (.t-number) — display weight with tabular figures so the digits
              // still align.
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.1rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "var(--ink-strong)",
              marginTop: "0.4rem",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {usd(estimate.one_time_low_cents)} – {usd(estimate.one_time_high_cents)}
          </p>
          {estimate.recurring_cents > 0 && (
            <p style={{ fontSize: 14, color: "var(--ink-dim)", marginTop: "0.5rem" }}>
              + {usd(estimate.recurring_cents)} / year support
            </p>
          )}

          {estimate.line_items?.length > 0 && (
            <div style={{ marginTop: "1.4rem", borderTop: "1px solid var(--edge)", paddingTop: "1rem" }}>
              <p style={mono}>Line items</p>
              <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.7rem" }}>
                {estimate.line_items.map((li, i) => (
                  <div
                    key={`${li.label}-${i}`}
                    style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: 13.5 }}
                  >
                    <span style={{ color: "var(--ink-dim)" }}>{li.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
                      {usd(li.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {estimate.signed_at && (
          <p style={{ ...mono, marginTop: "1.2rem", color: "#15803D" }}>
            Signed by {estimate.signer_name} on{" "}
            {new Date(estimate.signed_at).toLocaleDateString("en-US")}
          </p>
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
          Preliminary configuration estimate prepared for {estimate.client_name}. This is not a
          quote, offer, or contract. Final pricing, schedule, performance and scope remain subject
          to engineering review, site validation, equipment availability, applicable taxes, freight,
          permitting requirements and the executed agreement.
        </p>

        <p style={{ ...mono, marginTop: "2rem" }}>
          Questions? <a href="mailto:info@podosai.com" style={{ color: "var(--brand)" }}>info@podosai.com</a>
        </p>
      </div>
    </main>
  );
}
