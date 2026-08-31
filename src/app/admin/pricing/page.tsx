/**
 * /admin/pricing — founder price controls for the /configure estimator.
 *
 * noindex + nofollow: internal tool, never a search result.
 *
 * Persistence reality (no database by design): edits are stored in THIS
 * browser's localStorage and drive a live preview of the estimator. To
 * publish prices for real visitors, use "Copy config" / "Download JSON"
 * and commit the values into src/data/configuratorPricing.ts. The page
 * says so plainly so nobody mistakes a local preview for a live change.
 */

import type { Metadata } from "next";
import AdminPricingClient from "@/components/configurator/AdminPricingClient";

export const metadata: Metadata = {
  title: "Pricing admin — PODOS",
  robots: { index: false, follow: false },
};

export default function AdminPricingPage() {
  return (
    <main className="pageOverlay" style={{ marginTop: 0, borderRadius: 0, boxShadow: "none", background: "var(--paper)" }}>
      <div className="container-site" style={{ paddingBlock: "clamp(72px, 8vw, 104px)" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--brand)",
          }}
        >
          Internal · Pricing admin
        </p>
        <h1 className="t-headline" style={{ marginTop: "0.7rem", fontSize: "clamp(2rem,4vw,2.8rem)" }}>
          Estimator pricing
        </h1>
        <p className="t-lede" style={{ marginTop: "0.9rem", maxWidth: "60ch" }}>
          Set the numbers the public estimator uses. Changes here preview
          instantly in your browser; export and commit them to publish.
        </p>
        <AdminPricingClient />
      </div>
    </main>
  );
}
