import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, Mail } from "lucide-react";
import OpsShell from "@/components/ops/OpsShell";
import AdminResult from "@/components/ops/AdminResult";
import { requireOps } from "@/lib/ops/session";
import { getCompanySettings } from "@/lib/proposals/settings";
import { isEmailConfigured } from "@/lib/email/proposals";
import { saveSettingsAction, setAdminPinAction } from "./actions";

/**
 * /ops/settings — company identity and standard texts printed on every
 * estimate sheet, defaults, and the operational status of email + admin
 * access. Nothing sensitive is stored here.
 */

export const metadata: Metadata = { title: "Settings · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const mono: React.CSSProperties = { fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase" };
const input: React.CSSProperties = { padding: ".5rem .65rem", borderRadius: 8, border: "1px solid var(--edge-bright)", background: "var(--panel)", fontSize: 13.5, fontFamily: "inherit", minWidth: 0, width: "100%" };
const label: React.CSSProperties = { display: "grid", gap: 4, fontSize: 11, color: "var(--ink-faint)" };

export default async function SettingsPage() {
  await requireOps();
  const c = await getCompanySettings();
  const email = isEmailConfigured();

  return (
    <OpsShell active="/ops/settings" title="Settings">
      <AdminResult />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)", gap: "1.4rem", alignItems: "start" }}>
        <form action={saveSettingsAction} style={{ display: "grid", gap: "1.4rem" }}>
          <Panel label="Company identity (printed on every estimate sheet)">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: ".7rem" }}>
              <label style={label}>Company name<input style={input} name="name" required defaultValue={c.name} /></label>
              <label style={label}>Legal name<input style={input} name="legal_name" defaultValue={c.legal_name} /></label>
              <label style={label}>Website (as printed)<input style={input} name="website" defaultValue={c.website} /></label>
              <label style={label}>Email<input style={input} name="email" type="email" defaultValue={c.email} /></label>
              <label style={label}>Phone<input style={input} name="phone" defaultValue={c.phone} /></label>
              <label style={label}>Default validity (days)<input style={input} name="default_validity_days" type="number" min={1} max={365} defaultValue={c.default_validity_days} /></label>
              <label style={{ ...label, gridColumn: "1 / -1" }}>Address (one line per row, optional)<textarea style={{ ...input, resize: "vertical" }} name="address_lines" rows={2} defaultValue={c.address_lines.join("\n")} /></label>
            </div>
          </Panel>
          <Panel label="Standard texts">
            <div style={{ display: "grid", gap: ".7rem" }}>
              <label style={label}>Notes (one bullet per line)<textarea style={{ ...input, resize: "vertical" }} name="notes" rows={5} defaultValue={c.notes.join("\n")} /></label>
              <label style={label}>Warranty &amp; support (when no support item is on the proposal)<textarea style={{ ...input, resize: "vertical" }} name="warranty" rows={2} defaultValue={c.warranty} /></label>
              <p style={{ ...mono, fontSize: 9.5, color: "var(--brand-deep)", marginTop: 4 }}>Trust band (three items)</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: ".7rem" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ display: "grid", gap: 6 }}>
                    <input style={input} name={`trust_title_${i}`} defaultValue={c.trust[i]?.title ?? ""} placeholder="Title" />
                    <input style={input} name={`trust_subtitle_${i}`} defaultValue={c.trust[i]?.subtitle ?? ""} placeholder="Subtitle" />
                  </div>
                ))}
              </div>
            </div>
          </Panel>
          <Panel label="Notifications">
            <label style={label}>Internal notify email (client comments, signatures — used once email delivery is configured)<input style={input} name="notify_email" type="email" defaultValue={c.notify_email} /></label>
          </Panel>
          <div><button type="submit" style={{ ...mono, fontSize: 10.5, padding: ".6rem 1rem", borderRadius: 8, border: "none", background: "var(--brand-gradient)", color: "#fff", cursor: "pointer" }}>Save settings</button></div>
        </form>

        <div style={{ display: "grid", gap: "1.4rem" }}>
          <Panel label="Email delivery">
            <p style={{ fontSize: 13, color: email ? "#15803D" : "#B45309", display: "flex", alignItems: "center", gap: 6 }}><Mail size={14} aria-hidden /> {email ? "Configured — clients are emailed their secure links." : "Not configured — release shows the secure link for you to send by hand."}</p>
            {!email && <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 6, lineHeight: 1.55 }}>Set <code>RESEND_API_KEY</code> and <code>NOTIFY_FROM</code> in the Vercel project environment, then redeploy.</p>}
          </Panel>
          <Panel label="Admin access">
            <p style={{ fontSize: 13, color: "var(--ink-dim)", display: "flex", alignItems: "center", gap: 6 }}><KeyRound size={14} aria-hidden /> Sign in with the numeric access code below or the master secret. Sessions last 12 hours; every attempt is audit-logged and rate-limited.</p>
            <form action={setAdminPinAction} style={{ display: "grid", gap: 8, marginTop: 10 }}>
              <label style={label}>New access code (4–12 digits; 6+ recommended)<input style={input} name="pin" inputMode="numeric" pattern="[0-9]{4,12}" required autoComplete="off" /></label>
              <label style={label}>Repeat the code<input style={input} name="pin_again" inputMode="numeric" pattern="[0-9]{4,12}" required autoComplete="off" /></label>
              <button type="submit" style={{ ...mono, fontSize: 10, padding: ".5rem .8rem", borderRadius: 8, border: "1px solid var(--brand)", background: "var(--brand-wash)", color: "var(--brand-deep)", cursor: "pointer", justifySelf: "start" }}>Change access code</button>
            </form>
            <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 10, lineHeight: 1.55 }}>The master secret (<code>PODOS_ADMIN_SECRET</code>) also lives in the Vercel environment; rotate it only by changing both the database and Vercel in the same step.</p>
          </Panel>
          <Panel label="Document design">
            <p style={{ fontSize: 13, color: "var(--ink-dim)", lineHeight: 1.55 }}>Visuals used by every sheet are managed in <Link href="/ops/design" style={{ color: "var(--brand)" }}>Document Design</Link>; per-proposal options live in each proposal&apos;s Proposal design panel.</p>
          </Panel>
        </div>
      </div>
    </OpsShell>
  );
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return <section style={{ border: "1px solid var(--edge)", borderRadius: 12, background: "var(--panel)", padding: "1.1rem 1.2rem" }}><p style={{ ...mono, fontSize: 10, color: "var(--brand-deep)", marginBottom: ".8rem" }}>{label}</p>{children}</section>;
}
