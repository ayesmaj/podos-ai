import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Building2, FileText, KeyRound, Mail, Palette } from "lucide-react";
import { requireOps } from "@/lib/ops/session";
import { getCompanySettings } from "@/lib/proposals/settings";
import { isEmailConfigured } from "@/lib/email/proposals";
import { AppShell, Notice, PageHeader, Panel, PanelLink, ops as s } from "@/components/ops/ui";
import AdminResult from "@/components/ops/AdminResult";
import AdminPinDrawer from "./AdminPinDrawer";
import { saveSettingsAction } from "./actions";
import f from "./settings.module.css";

/**
 * /ops/settings — archetype 5 (Settings): header · 3/9 split with a sticky
 * sub-nav and stacked form panels. One <form> spans Company / Standard texts /
 * Notifications because saveSettingsAction expects the complete field set in
 * a single submit. The access code is changed in a drawer and never displayed.
 */

export const metadata: Metadata = { title: "Settings · PODOS ops", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";

const SECTIONS = [["company", "Company"], ["texts", "Standard texts"], ["notifications", "Notifications"], ["email", "Email delivery"], ["access", "Admin access"], ["design", "Document design"]] as const;

export default async function SettingsPage() {
  await requireOps();
  const c = await getCompanySettings();
  const email = isEmailConfigured();

  return (
    <AppShell active="/ops/settings">
      <PageHeader title="Settings" subtitle="Company identity, standard texts and defaults printed on every proposal, plus the operational status of email delivery and admin access." />
      <AdminResult />

      <div className={f.grid}>
        <aside className={f.subnav}>
          <Panel tight>
            <p className={s.label}>On this page</p>
            <nav className={f.subnavList} aria-label="Settings sections">
              {SECTIONS.map(([id, label]) => <a key={id} href={`#${id}`} className={f.subnavItem}>{label}</a>)}
            </nav>
          </Panel>
        </aside>

        <div className={f.stack}>
          <form action={saveSettingsAction} className={f.stack}>
            <section id="company" className={f.section}><Panel tight title="Company" icon={<Building2 size={18} aria-hidden />} summary="Identity block printed in the header of every estimate sheet.">
              <div className={f.rows}>
                <Field id="name" label="Company name"><input id="name" className={s.input} name="name" required defaultValue={c.name} /></Field>
                <Field id="legal_name" label="Legal name" hint="Used in the signature block."><input id="legal_name" className={s.input} name="legal_name" defaultValue={c.legal_name} /></Field>
                <Field id="website" label="Website" hint="As printed, without https://."><input id="website" className={s.input} name="website" defaultValue={c.website} /></Field>
                <Field id="email" label="Email"><input id="email" className={s.input} name="email" type="email" defaultValue={c.email} /></Field>
                <Field id="phone" label="Phone"><input id="phone" className={s.input} name="phone" defaultValue={c.phone} /></Field>
                <Field id="default_validity_days" label="Default validity" hint="Days a new proposal stays valid (1–365)."><input id="default_validity_days" className={s.input} name="default_validity_days" type="number" min={1} max={365} defaultValue={c.default_validity_days} style={{ maxWidth: 160 }} /></Field>
                <Field id="address_lines" label="Address" hint="One line per row. Optional." tall><textarea id="address_lines" className={s.input} name="address_lines" rows={3} defaultValue={c.address_lines.join("\n")} /></Field>
              </div>
            </Panel></section>

            <section id="texts" className={f.section}><Panel tight title="Standard texts" icon={<FileText size={18} aria-hidden />} summary="Notes, warranty and the three-item trust band on every sheet.">
              <div className={f.rows}>
                <Field id="notes" label="Notes" hint="One bullet per line." tall><textarea id="notes" className={s.input} name="notes" rows={5} defaultValue={c.notes.join("\n")} /></Field>
                <Field id="warranty" label="Warranty & support" hint="Printed when no support item is on the proposal." tall><textarea id="warranty" className={s.input} name="warranty" rows={3} defaultValue={c.warranty} /></Field>
                <Field id="trust_title_0" label="Trust band" hint="Three title / subtitle pairs. All three titles are required for the band to change." tall>
                  <div className={f.trust}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className={f.trustItem}>
                        <input id={`trust_title_${i}`} className={s.input} name={`trust_title_${i}`} defaultValue={c.trust[i]?.title ?? ""} placeholder={`Item ${i + 1} title`} aria-label={`Trust item ${i + 1} title`} />
                        <input className={s.input} name={`trust_subtitle_${i}`} defaultValue={c.trust[i]?.subtitle ?? ""} placeholder="Subtitle" aria-label={`Trust item ${i + 1} subtitle`} />
                      </div>
                    ))}
                  </div>
                </Field>
              </div>
            </Panel></section>

            <section id="notifications" className={f.section}><Panel tight title="Notifications" icon={<Bell size={18} aria-hidden />} summary="Where PODOS is told about client comments and signatures.">
              <div className={f.rows}>
                <Field id="notify_email" label="Internal notify email" hint="Used once email delivery is configured."><input id="notify_email" className={s.input} name="notify_email" type="email" defaultValue={c.notify_email} /></Field>
              </div>
              <div className={f.foot}>
                <p className={f.footText}>Saves Company, Standard texts and Notifications together. Every proposal prints with the new details immediately.</p>
                <button type="submit" className={`${s.btn} ${s.btnPrimary}`}>Save settings</button>
              </div>
            </Panel></section>
          </form>

          <section id="email" className={f.section}><Panel tight title="Email delivery" icon={<Mail size={18} aria-hidden />} summary="How clients receive their secure proposal links.">
            <Notice tone={email ? "ok" : "warn"}>
              <Mail size={16} aria-hidden />
              <span>{email ? "Configured — clients are emailed their secure links when a proposal is released." : "Not configured — release shows the secure link for you to send by hand."}</span>
            </Notice>
            {!email && <p className={f.body} style={{ marginTop: 12 }}>Set <code className={f.code}>RESEND_API_KEY</code> and <code className={f.code}>NOTIFY_FROM</code> in the Vercel project environment, then redeploy.</p>}
          </Panel></section>

          <section id="access" className={f.section}><Panel tight title="Admin access" icon={<KeyRound size={18} aria-hidden />} summary="Sign-in to Operations. Sessions last 12 hours; every attempt is audit-logged and rate-limited." action={<AdminPinDrawer />}>
            <div>
              <div className={f.fact}>
                <span className={s.label}>Access code</span>
                <span className={f.factValue}><span className={f.masked} aria-label="Access code, hidden">••••••</span><span className={s.muted} style={{ fontSize: 13 }}>Stored as a hash — never shown here.</span></span>
              </div>
              <div className={f.fact}>
                <span className={s.label}>Master secret</span>
                <span className={f.factValue}><span className={f.masked} aria-label="Master secret, hidden">••••••</span><span className={s.muted} style={{ fontSize: 13 }}><code className={f.code}>PODOS_ADMIN_SECRET</code> in the Vercel environment</span></span>
              </div>
            </div>
            <p className={f.body} style={{ marginTop: 16 }}>Rotate the master secret only by changing the database and Vercel in the same step; the access code can be changed here at any time.</p>
          </Panel></section>

          <section id="design" className={f.section}><Panel tight title="Document design" icon={<Palette size={18} aria-hidden />} summary="Visuals shared by every sheet." action={<PanelLink href="/ops/design">Open Document Design</PanelLink>}>
            <p className={f.body}>Watermark, accent and cover imagery are managed in <Link href="/ops/design">Document Design</Link>. Per-proposal options live in each proposal&apos;s own design panel.</p>
          </Panel></section>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ id, label, hint, tall, children }: { id: string; label: string; hint?: string; tall?: boolean; children: React.ReactNode }) {
  return (
    <div className={f.frow}>
      <div className={`${f.frowLabel}${tall ? ` ${f.frowLabelTall}` : ""}`}>
        <label htmlFor={id} className={s.label}>{label}</label>
        {hint && <p className={f.hint}>{hint}</p>}
      </div>
      {children}
    </div>
  );
}
