import "./ops-tokens.css";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Activity, Building2, ChevronRight, FileText, FolderKanban, LayoutDashboard, Palette, PenLine, Search, Settings, Tags, Users, Wrench,
} from "lucide-react";
import { ADMIN_COOKIE, adminLogout } from "@/lib/estimates/admin";
import { statusMeta, type ChipTone } from "./status";
import s from "./ops.module.css";

/**
 * PODOS Operations UI primitives — one shell, one scale, one card language for
 * every /ops page. Server components (no client JS) except Drawer.tsx.
 */

export { s as ops };

/* ---------- money ---------- */
const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const usd = (cents: number) => USD.format(cents / 100);
export function compact(cents: number): string {
  const v = cents / 100; const a = Math.abs(v);
  if (a >= 1e9) return `$${(v / 1e9).toFixed(2).replace(/\.?0+$/, "")}B`;
  if (a >= 1e6) return `$${(v / 1e6).toFixed(a >= 1e8 ? 0 : 1).replace(/\.0$/, "")}M`;
  if (a >= 1e4) return `$${Math.round(v / 1e3)}K`;
  return USD.format(v);
}
export const ago = (d: string | null | undefined) => {
  if (!d) return "—";
  const m = Math.max(1, Math.round((Date.now() - new Date(d).getTime()) / 60000));
  return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
};
export const fmtDate = (d: string | null | undefined) => (d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—");

/* ---------- shell ---------- */
const MODULES: { label: string; href: string; icon: ReactNode; ready: boolean }[] = [
  { label: "Dashboard", href: "/ops", icon: <LayoutDashboard size={17} strokeWidth={1.9} />, ready: true },
  { label: "Clients", href: "/ops/clients", icon: <Building2 size={17} strokeWidth={1.9} />, ready: true },
  { label: "Projects", href: "/ops/projects", icon: <FolderKanban size={17} strokeWidth={1.9} />, ready: true },
  { label: "Proposals", href: "/ops/proposals", icon: <FileText size={17} strokeWidth={1.9} />, ready: true },
  { label: "Catalog & Pricing", href: "/ops/pricing", icon: <Tags size={17} strokeWidth={1.9} />, ready: true },
  { label: "Document Design", href: "/ops/design", icon: <Palette size={17} strokeWidth={1.9} />, ready: true },
  { label: "Engineering Review", href: "/ops/engineering-review", icon: <Wrench size={17} strokeWidth={1.9} />, ready: false },
  { label: "Signatures", href: "/ops/signatures", icon: <PenLine size={17} strokeWidth={1.9} />, ready: false },
  { label: "Activity", href: "/ops/activity", icon: <Activity size={17} strokeWidth={1.9} />, ready: false },
  { label: "Users & Roles", href: "/ops/users", icon: <Users size={17} strokeWidth={1.9} />, ready: false },
  { label: "Settings", href: "/ops/settings", icon: <Settings size={17} strokeWidth={1.9} />, ready: true },
];

async function signOut() {
  "use server";
  const jar = await cookies();
  const tok = jar.get(ADMIN_COOKIE)?.value;
  if (tok) await adminLogout(tok);
  jar.delete(ADMIN_COOKIE);
  redirect("/ops/login");
}

export function AppShell({ active, crumbs, children }: { active: string; crumbs?: { label: string; href?: string }[]; children: ReactNode }) {
  const env = process.env.VERCEL_ENV === "production" ? "Production" : process.env.VERCEL_ENV ? "Staging" : "Local";
  const current = MODULES.find((m) => m.href === active);
  return (
    <div className={`ops ${s.shell}`}>
      <aside className={s.sidebar} aria-label="Operations navigation">
        <div className={s.brand}>
          <Link href="/ops" aria-label="PODOS Operations home"><Image src="/logo.png" alt="PODOS AI" width={168} height={58} priority className={s.brandLogo} /></Link>
          <div className={s.brandMeta}>
            <span className={s.brandLabel}>Operations</span>
            <span className={s.envBadge}><span className={s.liveDot} aria-hidden /> {env}</span>
          </div>
        </div>
        <nav className={s.nav}>
          {MODULES.map((m) => m.ready ? (
            <Link key={m.href} href={m.href} className={`${s.navItem}${m.href === active ? ` ${s.navItemActive}` : ""}`} aria-current={m.href === active ? "page" : undefined}>{m.icon}{m.label}</Link>
          ) : (
            <span key={m.href} className={`${s.navItem} ${s.navItemSoon}`} aria-disabled>{m.icon}{m.label}<span className={s.navSoon}>Soon</span></span>
          ))}
        </nav>
        <div className={s.sidebarFoot}>
          <form action={signOut}><button type="submit" className={s.signOut}>Sign out</button></form>
        </div>
      </aside>
      <div className={s.canvas}>
        <div className={s.topbar}>
          <div className={s.crumbs}>
            <Link href="/ops">Operations</Link>
            {(crumbs ?? (current && current.href !== "/ops" ? [{ label: current.label }] : [])).map((c, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><ChevronRight size={14} aria-hidden />{c.href ? <Link href={c.href}>{c.label}</Link> : <b>{c.label}</b>}</span>
            ))}
          </div>
          <div className={s.topbarRight}>
            <span className={s.envBadge}><span className={s.liveDot} aria-hidden /> Live · {env}</span>
          </div>
        </div>
        <div className={s.inner}>{children}</div>
      </div>
    </div>
  );
}

/* ---------- page header ---------- */
export function PageHeader({ title, subtitle, count, actions }: { title: string; subtitle?: string; count?: string; actions?: ReactNode }) {
  return (
    <header className={s.pageHeader}>
      <div style={{ minWidth: 0 }}>
        <h1 className={s.pageTitle}>{title}</h1>
        {subtitle && <p className={s.pageSubtitle}>{subtitle}</p>}
        {count && <p className={s.pageCount}>{count}</p>}
      </div>
      {actions && <div className={s.pageActions}>{actions}</div>}
    </header>
  );
}

/* ---------- KPI card ---------- */
export function KpiCard({ icon, label, value, context, tone = "cobalt", href }: { icon: ReactNode; label: string; value: string | number; context?: string; tone?: "cobalt" | "cyan" | "green" | "amber" | "purple" | "red" | "electric"; href?: string }) {
  const toneClass = { cobalt: s.toneCobalt, cyan: s.toneCyan, green: s.toneGreen, amber: s.toneAmber, purple: s.tonePurple, red: s.toneRed, electric: s.toneElectric }[tone];
  const body = (
    <>
      <span className={`${s.kpiIcon} ${toneClass}`}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <p className={s.kpiLabel}>{label}</p>
        <p className={s.kpiValue} data-kpi-value>{value}</p>
        {context && <p className={s.kpiContext}>{context}</p>}
      </div>
    </>
  );
  return href ? <Link href={href} className={s.kpi}>{body}</Link> : <div className={s.kpi}>{body}</div>;
}
export function KpiGrid({ children }: { children: ReactNode }) { return <div className={s.kpiGrid}>{children}</div>; }

/* ---------- panel ---------- */
export function Panel({ title, icon, summary, action, children, tight, className }: { title?: ReactNode; icon?: ReactNode; summary?: string; action?: ReactNode; children: ReactNode; tight?: boolean; className?: string }) {
  return (
    <section className={`${s.panel}${tight ? ` ${s.panelTight}` : ""}${className ? ` ${className}` : ""}`}>
      {(title || action) && (
        <div className={s.panelHead}>
          <div style={{ minWidth: 0 }}>
            {title && <h2 className={s.panelTitle}>{icon}{title}</h2>}
            {summary && <p className={s.panelSummary}>{summary}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
export function PanelLink({ href, children }: { href: string; children: ReactNode }) { return <Link href={href} className={s.panelAction}>{children} <ChevronRight size={14} aria-hidden /></Link>; }

/* ---------- status chip ---------- */
const TONE_CLASS: Record<ChipTone, string> = { gray: s.chipGray, muted: s.chipMuted, cobalt: s.chipCobalt, deep: s.chipDeep, electric: s.chipElectric, cyan: s.chipCyan, amber: s.chipAmber, orange: s.chipOrange, purple: s.chipPurple, violet: s.chipViolet, green: s.chipGreen, red: s.chipRed };
export function Chip({ tone = "gray", children, title }: { tone?: ChipTone; children: ReactNode; title?: string }) { return <span className={`${s.chip} ${TONE_CLASS[tone]}`} title={title}>{children}</span>; }
export function StatusChip({ status, revoked, signedAt }: { status: string; revoked?: boolean; signedAt?: string | null }) {
  const m = statusMeta(status, { revoked, signedAt });
  return <Chip tone={m.tone}>{m.label}</Chip>;
}

/* ---------- pipeline ---------- */
export interface PipelineStage { key: string; label: string; icon: ReactNode; count: number; valueCents: number }
export function Pipeline({ stages, active, hrefFor, totalCents }: { stages: PipelineStage[]; active?: string | null; hrefFor?: (key: string) => string; totalCents?: number }) {
  const total = stages.reduce((a, x) => a + x.count, 0) || 1;
  const palette = ["#1236c6", "#1b55f5", "#168dff", "#27c3ea", "#f0803a", "#1236c6", "#5b5bf0", "#20c77a"];
  return (
    <div>
      <div className={s.pipeline} style={{ "--stages": stages.length } as React.CSSProperties}>
        {stages.map((st) => {
          const cls = `${s.stage}${active === st.key ? ` ${s.stageActive}` : ""}`;
          const inner = (
            <>
              <span className={s.stageIcon}>{st.icon}</span>
              <span className={s.stageLabel}>{st.label}</span>
              <span className={s.stageCount}>{st.count}</span>
              <span className={s.stageValue}>{compact(st.valueCents)}</span>
            </>
          );
          return hrefFor ? <Link key={st.key} href={hrefFor(st.key)} className={cls} aria-pressed={active === st.key}>{inner}</Link> : <div key={st.key} className={cls}>{inner}</div>;
        })}
      </div>
      <div className={s.pipelineBar} aria-hidden>
        {stages.map((st, i) => <span key={st.key} style={{ width: `${(st.count / total) * 100}%`, background: palette[i % palette.length] }} />)}
      </div>
      {totalCents != null && <p className={s.muted} style={{ marginTop: 10, fontSize: 13 }}>Total pipeline value <b className={s.num} style={{ color: "var(--ops-ink)" }}>{usd(totalCents)}</b></p>}
    </div>
  );
}

/* ---------- toolbar ---------- */
export function Toolbar({ searchName = "q", searchValue, placeholder, filters, count, children, action = "" }: {
  searchName?: string; searchValue?: string; placeholder?: string;
  filters?: { label: string; href: string; active?: boolean }[]; count?: string; children?: ReactNode; action?: string;
}) {
  return (
    <div className={s.toolbar}>
      <form action={action} method="get" className={s.search} role="search">
        <Search size={16} aria-hidden />
        <input name={searchName} defaultValue={searchValue} placeholder={placeholder ?? "Search"} aria-label={placeholder ?? "Search"} />
      </form>
      {filters?.map((f) => <Link key={f.label} href={f.href} className={`${s.filterChip}${f.active ? ` ${s.filterChipActive}` : ""}`}>{f.label}</Link>)}
      {children}
      {count && <span className={s.toolbarCount}>{count}</span>}
    </div>
  );
}

/* ---------- empty / skeleton / notice ---------- */
export function EmptyState({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className={s.empty}>
      <span className={s.emptyIcon}>{icon ?? <FileText size={22} strokeWidth={1.8} />}</span>
      <p className={s.emptyTitle}>{title}</p>
      {text && <p className={s.emptyText}>{text}</p>}
      {action}
    </div>
  );
}
export function Skeleton({ h = 16, w = "100%" }: { h?: number; w?: number | string }) { return <div className={s.skeleton} style={{ height: h, width: w }} aria-hidden />; }
export function Notice({ tone = "info", children }: { tone?: "info" | "ok" | "warn" | "danger"; children: ReactNode }) {
  const cls = tone === "ok" ? s.noticeOk : tone === "warn" ? s.noticeWarn : tone === "danger" ? s.noticeDanger : "";
  return <div className={`${s.notice} ${cls}`}>{children}</div>;
}

/* ---------- entity row pieces ---------- */
export function Avatar({ name }: { name: string }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "—";
  return <span className={s.avatar} aria-hidden>{initials}</span>;
}
export function Cell({ label, children, className }: { label?: string; children: ReactNode; className?: string }) {
  return <div className={`${s.rowCell}${className ? ` ${className}` : ""}`}>{label && <span className={s.rowCellLabel}>{label}</span>}{children}</div>;
}
