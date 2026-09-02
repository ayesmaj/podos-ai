import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowRight, Clock3, ListChecks, ShieldCheck, Boxes, FileText, Send, Lock } from "lucide-react";
import { VIEWER_COOKIE, getSelections, sessionProposal } from "@/lib/proposals/access";
import { STEPS } from "@/lib/proposals/steps";
import ClientBar from "@/components/private/ClientBar";
import s from "@/components/private/private.module.css";

/**
 * /client/proposals/[publicId] — the client WELCOME (redesign brief §6).
 *
 * "PODOS prepared a confidential infrastructure planning experience for you."
 * Prepared-for card, what the configurator does, time to complete, progress
 * preview, confidentiality note, one primary CTA. No approval, no signature —
 * the formal proposal (and its sign step) lives on /proposal once released.
 * Session-bound to exactly one proposal; anything else is a uniform 404.
 */

export const metadata: Metadata = {
  title: "Your PODOS configuration workspace",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;
const RELEASED = new Set(["released", "signature_requested", "client_signed", "signed", "countersigned", "completed"]);
const HERO = "/visuals/menu/hero-pod-schematic.webp";

export default async function ClientWelcome({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();

  const jar = await cookies();
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (!session) notFound();
  const p = await sessionProposal(session);
  if (!p || p.public_id !== publicId) notFound();

  const selections = await getSelections(session);
  const done = STEPS.filter((st) => {
    const payload = selections[st.id] as Record<string, unknown> | undefined;
    return !!payload && Object.values(payload).some((v) => v !== "" && v != null);
  }).length;
  const pct = Math.round((done / STEPS.length) * 100);
  const released = RELEASED.has(p.status);
  const submitted = p.status === "client_submitted" || p.status === "engineering_review" || p.status === "commercial_review" || p.status === "approved";
  const heroExists = existsSync(path.join(process.cwd(), "public", HERO));
  const preparedFor = p.company ? `${p.client_name} / ${p.company}` : p.client_name;

  const cta = released
    ? { href: `/client/proposals/${publicId}/proposal`, label: "View your proposal" }
    : submitted
      ? { href: `/client/proposals/${publicId}/configure?step=review`, label: "Review your submission" }
      : done > 0
        ? { href: `/client/proposals/${publicId}/configure`, label: "Resume configuration" }
        : { href: `/client/proposals/${publicId}/configure`, label: "Begin configuration" };

  return (
    <div className={`${s.root} ${s.field}`}>
      <ClientBar publicId={publicId} project={p.project_name} preparedFor={preparedFor} />

      <main style={{ maxWidth: 1680, margin: "0 auto", padding: "clamp(1.5rem, 4vw, 3.5rem) clamp(1rem, 3vw, 2rem)" }}>
        <div className={`${s.rise} ${s.twoCol}`}>
          {/* ---- welcome card (dominant) ---- */}
          <section className={`${s.panel} ${s.panelLift}`} style={{ padding: "clamp(1.6rem, 3vw, 2.8rem)", position: "relative", overflow: "hidden" }}>
            <div className={heroExists ? s.heroSplit : undefined} style={{ display: "grid", gap: "2rem", alignItems: "center" }}>
              <div>
                <p className={`${s.label} ${s.labelBrand}`} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Boxes size={14} strokeWidth={1.75} aria-hidden /> Private client configurator
                </p>
                <h1 className={s.display} style={{ marginTop: "0.9rem", maxWidth: "16ch" }}>
                  Welcome to your PODOS configuration workspace
                </h1>
                <div style={{ width: 52, height: 3, borderRadius: 999, background: "linear-gradient(90deg, var(--brand), var(--cyan))", marginTop: "1rem" }} aria-hidden />
                <p className={s.body} style={{ marginTop: "1.1rem", maxWidth: "52ch", fontSize: "1.02rem" }}>
                  This guided configurator helps you define the ideal modular AI infrastructure
                  deployment for your performance, scale, and operational requirements. PODOS
                  prepared it for {p.company ?? p.client_name}
                  {p.project_name ? ` — ${p.project_name}` : ""}.
                </p>
              </div>
              {heroExists && (
                <div style={{ position: "relative", aspectRatio: "16 / 10", borderRadius: 14, overflow: "hidden", background: "var(--canvas)", border: "1px solid var(--edge-faint)" }}>
                  <Image src={HERO} alt="Technical elevation of a PODOS modular pod with airflow paths" fill sizes="(max-width: 900px) 100vw, 40vw" style={{ objectFit: "contain" }} priority />
                </div>
              )}
            </div>

            {/* info tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.9rem", marginTop: "2rem" }}>
              <Tile icon={<Clock3 size={18} strokeWidth={1.75} />} label="Estimated completion time">
                <p className={s.headline} style={{ fontSize: "1.6rem" }}>10–15 <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink-dim)" }}>min</span></p>
                <p className={s.help}>Save and resume anytime — progress is kept for you.</p>
              </Tile>
              <Tile icon={<ListChecks size={18} strokeWidth={1.75} />} label="You will configure">
                <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", listStyle: "none", padding: 0, margin: "0.3rem 0 0", fontSize: 13, color: "var(--ink-dim)" }}>
                  {["Platform", "Compute", "Cooling", "Power", "Network", "Deployment", "Support", "Site"].map((x) => (
                    <li key={x} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--brand)" }} aria-hidden /> {x}
                    </li>
                  ))}
                </ul>
              </Tile>
              <Tile icon={<ShieldCheck size={18} strokeWidth={1.75} />} label="Your progress">
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <p className={s.headline} style={{ fontSize: "1.6rem" }}>{pct}%</p>
                  <span className={s.help} style={{ marginTop: 0 }}>{done} of {STEPS.length} steps</span>
                </div>
                <div className={s.progress} style={{ marginTop: 10 }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                  <div className={s.progressFill} style={{ width: `${pct}%` }} />
                </div>
              </Tile>
            </div>

            <Link href={cta.href} className={`${s.btn} ${s.btnPrimary}`} style={{ marginTop: "1.8rem", width: "100%", minHeight: 56, fontSize: "1.05rem" }}>
              <ArrowRight size={20} strokeWidth={2} aria-hidden /> {cta.label}
            </Link>
            <p className={s.help} style={{ textAlign: "center", marginTop: "0.8rem", display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
              <Lock size={12} strokeWidth={2} aria-hidden /> Secure private link — configuration data is encrypted and confidential.
            </p>
          </section>

          {/* ---- what happens next ---- */}
          <aside className={s.panel} style={{ padding: "1.4rem" }}>
            <p className={s.title} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={18} strokeWidth={1.75} color="var(--brand)" aria-hidden /> What happens next
            </p>
            <ol style={{ listStyle: "none", padding: 0, margin: "1.1rem 0 0", display: "grid", gap: "1.1rem" }}>
              <NextStep n={1} icon={<Boxes size={18} strokeWidth={1.75} />} title="Configure" text="Tailor each component to match your technical and operational requirements." />
              <NextStep n={2} icon={<FileText size={18} strokeWidth={1.75} />} title="Review" text="Review your configuration summary, specifications, and preliminary estimate." />
              <NextStep n={3} icon={<Send size={18} strokeWidth={1.75} />} title="Submit" text="Submit for engineering review. PODOS returns a formal proposal." />
            </ol>
          </aside>
        </div>

        {/* security strip */}
        <p style={{ display: "flex", justifyContent: "center", gap: "1.4rem", flexWrap: "wrap", marginTop: "2rem", fontSize: 12.5, color: "var(--ink-faint)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--brand-deep)", fontWeight: 600 }}><ShieldCheck size={14} strokeWidth={2} aria-hidden /> Enterprise-grade security</span>
          <span>Data encrypted in transit and at rest</span>
          <span>Access limited to authorized recipients only</span>
        </p>
      </main>
    </div>
  );
}

function Tile({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid var(--edge)", borderRadius: 14, background: "var(--paper)", padding: "1rem 1.1rem" }}>
      <p className={s.label} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink-dim)" }}>
        <span style={{ color: "var(--brand)" }}>{icon}</span> {label}
      </p>
      <div style={{ marginTop: "0.6rem" }}>{children}</div>
    </div>
  );
}

function NextStep({ n, icon, title, text }: { n: number; icon: React.ReactNode; title: string; text: string }) {
  return (
    <li style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: "0.8rem" }}>
      <span className={s.iconTile}>{icon}</span>
      <div>
        <p style={{ fontWeight: 700, fontSize: 14.5, color: "var(--ink-strong)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 20, height: 20, borderRadius: 999, background: "var(--brand)", color: "#fff", fontSize: 11, display: "grid", placeItems: "center" }}>{n}</span> {title}
        </p>
        <p className={s.help} style={{ marginTop: 3, fontSize: 13, lineHeight: 1.5 }}>{text}</p>
      </div>
    </li>
  );
}
