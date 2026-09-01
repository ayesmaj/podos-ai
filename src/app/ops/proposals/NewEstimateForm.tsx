import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_SECRET, adminSessionValid, createEstimate } from "@/lib/estimates/admin";
import { SITE } from "@/lib/seo/site";

/**
 * Create a client estimate and surface its secret link exactly once.
 *
 * The raw token is never stored, so this is the only moment it can be shown.
 * It is rendered into the page (not redirected through a URL) so it does not
 * land in browser history or a server access log.
 */

async function create(formData: FormData) {
  "use server";
  // Server actions are publicly POSTable in Next 16 - re-check the session here.
  const jarAuth = await cookies();
  const sessTok = jarAuth.get(ADMIN_COOKIE)?.value ?? "";
  if (!sessTok || !(await adminSessionValid(sessTok))) redirect("/ops/login");
  const clientName = String(formData.get("clientName") ?? "").trim();
  if (!clientName) return;

  const dollars = (k: string) => {
    const n = Number(String(formData.get(k) ?? "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? Math.round(n * 100) : 0;
  };

  const created = await createEstimate(ADMIN_SECRET, {
    clientName,
    projectName: String(formData.get("projectName") ?? "").trim() || undefined,
    company: String(formData.get("company") ?? "").trim() || undefined,
    lowCents: dollars("low"),
    highCents: dollars("high"),
    recurringCents: dollars("recurring"),
    expiresDays: 30,
  });

  // The raw token exists only here. Hand it back through a one-shot cookie so
  // the page can display it once, rather than putting it in the URL where it
  // would land in history and access logs.
  const token = created?.[0]?.token;
  if (token) {
    const jar = await cookies();
    jar.set("podos_new_link", `${created?.[0]?.estimate_no}:${token}`, {
      httpOnly: true, sameSite: "strict", path: "/", maxAge: 300,
      secure: process.env.NODE_ENV === "production",
    });
  }
  revalidatePath("/ops/proposals");
}

const input: React.CSSProperties = {
  padding: "0.6rem 0.7rem",
  borderRadius: 8,
  border: "1px solid var(--edge-bright)",
  background: "var(--panel)",
  fontSize: 14,
  color: "var(--ink-strong)",
  minWidth: 0,
};
const label: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--ink-faint)",
  display: "block",
  marginBottom: 4,
};

export default function NewEstimateForm() {
  return (
    <form
      action={create}
      style={{
        marginTop: "1.8rem",
        border: "1px solid var(--edge)",
        borderRadius: 12,
        background: "var(--panel)",
        padding: "1.1rem 1.2rem",
        display: "grid",
        gap: "0.8rem",
        gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
        alignItems: "end",
      }}
    >
      <div style={{ gridColumn: "1 / -1" }}>
        <span style={{ ...label, fontSize: 11, color: "var(--brand-deep)" }}>+ New estimate</span>
      </div>
      <div><label style={label} htmlFor="clientName">Client name *</label>
        <input style={input} id="clientName" name="clientName" required placeholder="Jane Doe" /></div>
      <div><label style={label} htmlFor="company">Company</label>
        <input style={input} id="company" name="company" placeholder="Acme Industries" /></div>
      <div><label style={label} htmlFor="projectName">Project</label>
        <input style={input} id="projectName" name="projectName" placeholder="Pilot — 2 pods" /></div>
      <div><label style={label} htmlFor="low">Low (USD)</label>
        <input style={input} id="low" name="low" inputMode="numeric" placeholder="12300000" /></div>
      <div><label style={label} htmlFor="high">High (USD)</label>
        <input style={input} id="high" name="high" inputMode="numeric" placeholder="16700000" /></div>
      <div><label style={label} htmlFor="recurring">Support /yr</label>
        <input style={input} id="recurring" name="recurring" inputMode="numeric" placeholder="190000" /></div>
      <button type="submit" style={{
        fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "#fff",
        background: "var(--brand-gradient)", border: "1px solid rgba(29,78,216,.55)",
        borderRadius: 10, padding: "0.7rem 1.1rem", cursor: "pointer",
      }}>
        Create estimate
      </button>
      <p style={{ gridColumn: "1 / -1", fontSize: 11.5, color: "var(--ink-faint)", lineHeight: 1.55 }}>
        The client link appears once, on the row below, immediately after creation. Base URL for
        links: {SITE.baseUrl}/e/&lt;token&gt;
      </p>
    </form>
  );
}
