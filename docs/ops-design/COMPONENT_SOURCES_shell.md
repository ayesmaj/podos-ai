# Ops shell component sources — shell · KPI card · pipeline stages

Scout run: 2026-09-01 · 21st MCP (`mcp__magic__search` / `get_component`, paid tier) — 5 searches, 8 component retrievals, real source inspected for every shortlisted candidate. Nothing is used verbatim; every recommendation below is normalized into the PODOS ops tokens (founder brief 2026-09-02).

Inputs read: `docs/component-sources.md`, `design-system/podos-private-proposal-platform/MASTER.md`, `src/components/ops/OpsShell.tsx`, `src/app/ops/page.tsx`, `src/components/private/private.module.css`, `src/app/globals.css` (unlayered reset, font variables), `src/components/private/EstimateFigure.tsx`, `src/lib/proposals/money.ts`. `docs/website-brief.md` and `docs/design-direction.md` do not exist in this repo — the founder brief in the task prompt was used as the design authority.

Stack constraints honoured: Next 16.2 / React 19 server components by default; the unlayered reset in `globals.css` (`*:where(:not(.invest, .invest *)) { margin:0; padding:0 }`) neutralises Tailwind spacing outside `.invest`, so all styling is CSS modules; Geist display + Inter Tight text via `--font-display` / `--font-body`; no mono family (Geist + `tabular-nums` for technical metadata); `lucide-react` icons; `framer-motion` already installed (used only through the existing `EstimateFigure`).

All three adapted components were type-checked in place (`npx tsc --noEmit`, exit 0) before this document was written. They are **not yet installed** — see "Implementation status".

---

## Shared token layer

Tokens live on the shell root (`.shell` in `OpsShell.module.css`) as `--ops-*` custom properties; KPI and pipeline modules read them with fallbacks so they also render outside the shell (previews, print). Mapping from the brief:

| Brief | Token | Value |
|---|---|---|
| sidebar / page max / padding | `--ops-sidebar-width` `--ops-page-max-width` `--ops-page-padding-x/y` | 252px · 1680px · clamp(24px,3vw,48px) · 32px |
| gaps / padding | `--ops-section-gap` `--ops-panel-gap` `--ops-card-pad` `--ops-panel-pad` | 24 · 16 · 22 · 26 |
| radii | `--ops-r-12/16/20/24` | 12 / 16 / 20 / 24 |
| surfaces | `--ops-bg` `--ops-bg-elevated` `--ops-surface` `--ops-surface-soft` `--ops-surface-selected` | #F4F7FC · #F8FBFF · #FFF · #F2F7FF · #EAF2FF |
| ink | `--ops-ink` `--ops-ink-2` `--ops-ink-3` | #071126 · #35425B · #7D8BA3 |
| brand | `--ops-cobalt-deep` `--ops-cobalt` `--ops-electric` `--ops-cyan` `--ops-live` `--ops-warning` `--ops-danger` `--ops-purple` | per brief |
| borders / shadows / gradient | `--ops-border` `--ops-border-strong` `--ops-shadow-sm/md/active` `--ops-gradient-primary` | per brief |
| type | `--ops-font-display` `--ops-font-text` | `var(--font-display)` (Geist) · `var(--font-body)` (Inter Tight) |
| motion | `--ops-dur` `--ops-ease` | 200ms · cubic-bezier(.22,1,.36,1) |

Glyph colours inside icon containers are deepened where the brief hue is too faint on white (cyan #27C3EA → #0E93B3, electric #168DFF → #0F6FCF, live #20C77A → #148F57, warning → #B86F0C, purple → #5B45D9). The brief hue is kept for fills and bar segments.

---

## Pattern 1 — Application shell

**Job:** frame every `/ops` page with a fixed 252px light sidebar (identity · module nav · environment) and a sticky top utility bar, then centre the working canvas at 1680px.

**Search terms:** "dashboard application shell with fixed sidebar navigation and top header bar" (component, 12 results).

### Candidate matrix

| | A — Dashboard Sidebar · arunjdass · demo 14941 | B — Sidebar Light · inference-sh · demo 19361 | C — Core Header Navbar · kumail_ali_r · demo 9847 |
|---|---|---|---|
| Structure | Sidebar 260px + h-14 top bar (collapse toggle, breadcrumb, search/avatar slots) + workspace frame. Grouped nav with headings, badge slot, nested groups via `grid-rows-[0fr→1fr]` | `<aside><nav>` with real `<a>` leaves, active by pathname, nested groups | Top bar: title left, identity right, blueprint grid masked to a corner |
| Semantics | Nav items are `<div onClick>` — no links, no buttons | Correct: `<a>` leaves; parents are non-interactive `<div>`s | `<h1>` inside `<nav>` (conflicts with page H1); tabs are `<div onClick>` |
| Keyboard | None (divs) | Native links | None on tabs |
| Reduced motion | Not handled | n/a (no motion) | n/a |
| Mobile | Sidebar → width 0; no alternative nav | None specified | Horizontal scroll tabs |
| Deps / license | lucide only; 21st community | none; 21st community | none; 21st community |
| Fit | Right frame; wrong interaction layer; Tailwind-only; client state everywhere | Right link semantics; too small (no frame) | Only the corner-grid atmosphere idea is useful |

**Recommendation:** keep the existing `OpsShell` (already a server component with `next/link` + server-action sign-out) as the base and re-frame it using A's structure (sidebar / sticky utility bar / canvas grid, grouped list, crumb), B's link semantics (`<nav><ul><li><Link aria-current="page">`), and C's blueprint-grid idea moved to the canvas background as the brief specifies. No collapse state (brief: fixed sidebar). Below 1024px the sidebar becomes an identity row + horizontally scrolling module rail, CSS-only — zero client JS.

**Dependencies / license:** none added. Pattern reference only — 21st community registry (author-published; no attribution requirement stated on the component pages).

**Kept from sources:** frame proportions (sidebar ≈ 252, utility bar 56), crumb "workspace / page", grouped list with disabled-module treatment, real link nav, corner-masked grid atmosphere.
**Changed:** all Tailwind → CSS module; `div onClick` → `<Link aria-current>`; workspace switcher, command palette, collapse toggle, kbd hover hints, avatar placeholder, italic uppercase title all removed; identity block = 164px wordmark + OPERATIONS kicker + environment badge with live dot (pulses only in production, static under reduced motion); page header (36/40 w800 title, ≤700px subtitle, right actions) and `utility` slot for secure-access summary added.

### `src/components/ops/OpsShell.tsx`

```tsx
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ADMIN_COOKIE, adminLogout } from "@/lib/estimates/admin";
import s from "./OpsShell.module.css";

const MODULES: { label: string; href: string; ready: boolean }[] = [
  { label: "Dashboard", href: "/ops", ready: true },
  { label: "Clients", href: "/ops/clients", ready: true },
  { label: "Projects", href: "/ops/projects", ready: true },
  { label: "Proposals", href: "/ops/proposals", ready: true },
  { label: "Catalog & Pricing", href: "/ops/pricing", ready: true },
  { label: "Document Design", href: "/ops/design", ready: true },
  { label: "Engineering Review", href: "/ops/engineering-review", ready: false },
  { label: "Signatures", href: "/ops/signatures", ready: false },
  { label: "Activity", href: "/ops/activity", ready: false },
  { label: "Users & Roles", href: "/ops/users", ready: false },
  { label: "Settings", href: "/ops/settings", ready: true },
];

const ENV =
  process.env.VERCEL_ENV === "production" ? "production" : process.env.VERCEL_ENV === "preview" ? "preview" : "development";

async function signOut() {
  "use server";
  const jar = await cookies();
  const tok = jar.get(ADMIN_COOKIE)?.value;
  if (tok) await adminLogout(tok);
  jar.delete(ADMIN_COOKIE);
  redirect("/ops/login");
}

export default function OpsShell({
  active,
  title,
  subtitle,
  actions,
  utility,
  children,
}: {
  /** href of the current module — highlights the nav item */
  active: string;
  title: string;
  /** one sentence, ≤700px wide */
  subtitle?: string;
  /** right side of the page header (primary/secondary buttons) */
  actions?: ReactNode;
  /** right side of the sticky utility bar (search, user, secure-access summary) */
  utility?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={s.shell}>
      <aside className={s.sidebar} aria-label="Operations">
        <div className={s.identity}>
          <Link href="/ops" className={s.logo} aria-label="PODOS AI operations home">
            <Image src="/logo.png" alt="" width={164} height={56} priority sizes="164px" />
          </Link>
          <div className={s.identityMeta}>
            <span className={s.kicker}>Operations</span>
            <span className={s.envBadge} data-env={ENV}>
              <span className={s.liveDot} aria-hidden="true" />
              {ENV}
            </span>
          </div>
        </div>

        <nav className={s.nav} aria-label="Modules">
          <ul className={s.navList}>
            {MODULES.map((m) => (
              <li key={m.href}>
                {m.ready ? (
                  <Link href={m.href} className={s.navItem} aria-current={m.href === active ? "page" : undefined}>
                    {m.label}
                  </Link>
                ) : (
                  <span className={s.navItem} aria-disabled="true">
                    {m.label}
                    <span className={s.soon}>Soon</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <form action={signOut} className={s.signOut}>
          <button type="submit" className={s.signOutBtn}>
            Sign out
          </button>
        </form>
      </aside>

      <div className={s.canvas}>
        <div className={s.utilityBar}>
          <p className={s.crumb}>
            <span>Operations</span>
            <span aria-hidden="true">/</span>
            <span className={s.crumbCurrent}>{title}</span>
          </p>
          {utility && <div className={s.utilitySlot}>{utility}</div>}
        </div>

        <main className={s.main} id="main">
          <header className={s.pageHeader}>
            <div className={s.pageHeading}>
              <h1 className={s.pageTitle}>{title}</h1>
              {subtitle && <p className={s.pageSubtitle}>{subtitle}</p>}
            </div>
            {actions && <div className={s.pageActions}>{actions}</div>}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
```

### `src/components/ops/OpsShell.module.css`

```css
.shell {
  --ops-sidebar-width: 252px;
  --ops-page-max-width: 1680px;
  --ops-page-padding-x: clamp(24px, 3vw, 48px);
  --ops-page-padding-y: 32px;
  --ops-section-gap: 24px;
  --ops-panel-gap: 16px;
  --ops-card-pad: 22px;
  --ops-panel-pad: 26px;
  --ops-r-12: 12px;
  --ops-r-16: 16px;
  --ops-r-20: 20px;
  --ops-r-24: 24px;

  --ops-bg: #f4f7fc;
  --ops-bg-elevated: #f8fbff;
  --ops-surface: #ffffff;
  --ops-surface-soft: #f2f7ff;
  --ops-surface-selected: #eaf2ff;
  --ops-ink: #071126;
  --ops-ink-2: #35425b;
  --ops-ink-3: #7d8ba3;
  --ops-cobalt-deep: #1236c6;
  --ops-cobalt: #1b55f5;
  --ops-electric: #168dff;
  --ops-cyan: #27c3ea;
  --ops-live: #20c77a;
  --ops-warning: #eca43a;
  --ops-danger: #e25568;
  --ops-purple: #7759f6;
  --ops-border: rgba(34, 82, 154, 0.12);
  --ops-border-strong: rgba(27, 85, 245, 0.28);
  --ops-shadow-sm: 0 6px 22px rgba(27, 57, 103, 0.06);
  --ops-shadow-md: 0 16px 42px rgba(22, 53, 103, 0.09);
  --ops-shadow-active: 0 18px 48px rgba(27, 85, 245, 0.15);
  --ops-gradient-primary: linear-gradient(135deg, #1236c6 0%, #168dff 62%, #27c3ea 100%);

  /* Geist display / Inter Tight text — set on <html> by app/layout.tsx.
     No mono family (founder rule): technical metadata = Geist + tabular-nums. */
  --ops-font-display: var(--font-display, var(--font-geist), system-ui, sans-serif);
  --ops-font-text: var(--font-body, var(--font-inter-tight), system-ui, sans-serif);
  --ops-dur: 200ms;
  --ops-ease: cubic-bezier(0.22, 1, 0.36, 1);

  display: grid;
  grid-template-columns: var(--ops-sidebar-width) minmax(0, 1fr);
  min-height: 100dvh;
  background: var(--ops-bg);
  color: var(--ops-ink);
  font-family: var(--ops-font-text);
  font-size: 14px;
  line-height: 1.5;
}

/* ---- sidebar ---- */
.sidebar {
  position: sticky;
  top: 0;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 22px 16px 18px;
  background: var(--ops-bg-elevated);
  border-right: 1px solid var(--ops-border);
  overflow-y: auto;
}
.identity { display: grid; gap: 12px; padding: 0 8px; }
.logo { display: inline-flex; width: 164px; }
.logo img { display: block; width: 164px; height: auto; }
.identityMeta { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.kicker {
  font: 600 11px/16px var(--ops-font-display);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ops-ink-3);
}
.envBadge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid var(--ops-border);
  background: var(--ops-surface);
  font: 650 10.5px/14px var(--ops-font-display);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ops-ink-2);
}
.liveDot { width: 7px; height: 7px; border-radius: 50%; background: var(--ops-ink-3); }
.envBadge[data-env="production"] .liveDot {
  background: var(--ops-live);
  animation: opsPulse 2.4s ease-out infinite;
}
.envBadge[data-env="preview"] .liveDot { background: var(--ops-warning); }
@keyframes opsPulse {
  0% { box-shadow: 0 0 0 0 rgba(32, 199, 122, 0.45); }
  70% { box-shadow: 0 0 0 6px rgba(32, 199, 122, 0); }
  100% { box-shadow: 0 0 0 0 rgba(32, 199, 122, 0); }
}

.nav { flex: 1; }
.navList { list-style: none; display: grid; gap: 2px; }
.navItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 40px;
  padding: 0 12px;
  border-radius: var(--ops-r-12);
  font: 600 14px/20px var(--ops-font-text);
  color: var(--ops-ink-2);
  text-decoration: none;
  transition: background var(--ops-dur) var(--ops-ease), color var(--ops-dur) var(--ops-ease);
}
a.navItem:hover { background: var(--ops-surface-soft); color: var(--ops-ink); }
a.navItem[aria-current="page"] {
  color: var(--ops-cobalt-deep);
  /* 3px cobalt rule + selected fill in one paint, clipped by the radius */
  background: linear-gradient(90deg, var(--ops-cobalt) 0 3px, var(--ops-surface-selected) 3px);
}
a.navItem:focus-visible { outline: 2px solid var(--ops-cobalt); outline-offset: 2px; }
.navItem[aria-disabled="true"] { color: var(--ops-ink-3); cursor: default; }
.soon {
  font: 600 10px/14px var(--ops-font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ops-ink-3);
  border: 1px dashed var(--ops-border-strong);
  border-radius: 999px;
  padding: 1px 6px;
}
.signOut { border-top: 1px solid var(--ops-border); padding: 14px 4px 0; }
.signOutBtn {
  font: 600 13px/20px var(--ops-font-text);
  color: var(--ops-ink-3);
  background: none;
  border: 0;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
}
.signOutBtn:hover { color: var(--ops-danger); background: var(--ops-surface); }
.signOutBtn:focus-visible { outline: 2px solid var(--ops-cobalt); outline-offset: 2px; }

/* ---- canvas ---- */
.canvas { min-width: 0; position: relative; isolation: isolate; }
.canvas::before {
  /* brief: soft blue-white base · faint blueprint grid (3%) · upper-right glow · connector nodes */
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(900px 520px at 88% -10%, rgba(22, 141, 255, 0.16), transparent 70%),
    radial-gradient(circle, rgba(27, 85, 245, 0.1) 1px, transparent 1.6px),
    linear-gradient(to right, rgba(27, 85, 245, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(27, 85, 245, 0.03) 1px, transparent 1px);
  background-size: auto, 128px 128px, 32px 32px, 32px 32px;
}
.utilityBar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 56px;
  padding: 0 var(--ops-page-padding-x);
  background: rgba(244, 247, 252, 0.92);
  border-bottom: 1px solid var(--ops-border);
  backdrop-filter: blur(8px);
}
.crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font: 500 13px/20px var(--ops-font-text);
  color: var(--ops-ink-3);
}
.crumbCurrent { color: var(--ops-ink); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.utilitySlot { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

.main {
  width: 100%;
  max-width: var(--ops-page-max-width);
  margin: 0 auto;
  padding: var(--ops-page-padding-y) var(--ops-page-padding-x) calc(var(--ops-page-padding-y) * 2);
  display: grid;
  gap: var(--ops-section-gap);
  align-content: start;
}
.pageHeader { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.pageHeading { display: grid; gap: 8px; max-width: 700px; }
.pageTitle { font: 800 36px/40px var(--ops-font-display); letter-spacing: -0.03em; color: var(--ops-ink); }
.pageSubtitle { font: 400 15px/23px var(--ops-font-text); color: var(--ops-ink-2); }
.pageActions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* ---- tablet / mobile: sidebar → identity row + scrolling module rail ---- */
@media (max-width: 1023px) {
  .shell { grid-template-columns: minmax(0, 1fr); }
  .sidebar {
    position: static;
    height: auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas: "identity signout" "nav nav";
    gap: 10px 12px;
    padding: 12px 16px 8px;
    border-right: 0;
    border-bottom: 1px solid var(--ops-border);
    overflow: visible;
  }
  .identity { grid-area: identity; grid-template-columns: auto auto; justify-content: start; align-items: center; padding: 0; }
  .logo, .logo img { width: 132px; }
  .kicker { display: none; }
  .nav { grid-area: nav; }
  .navList {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;
  }
  .navList::-webkit-scrollbar { display: none; }
  .navItem { white-space: nowrap; min-height: 36px; font-size: 13px; }
  .signOut { grid-area: signout; border: 0; padding: 0; }
  .pageTitle { font-size: 28px; line-height: 32px; }
  .pageHeader { align-items: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  .liveDot { animation: none; }
  .navItem { transition: none; }
}
```

**Accessibility:** landmarks `aside[aria-label]`, `nav[aria-label]`, `main#main`, one `h1` per page; current module via `aria-current="page"` (styled from the attribute, so state and style cannot drift); unavailable modules are non-focusable `span[aria-disabled]` with a visible "Soon" chip (not opacity-only); all interactive elements are native links/buttons with `:focus-visible` rings; logo `alt=""` inside a link with `aria-label`; live dot is decorative (`aria-hidden`), environment word is the text; pulse stops under `prefers-reduced-motion`; utility bar is `position: sticky` (content never hidden behind it).
**Responsive:** ≥1024 fixed 252px sidebar, canvas centred at 1680 with clamp padding; ≤1023 identity row + sign-out on one line, module rail scrolls horizontally (no wrapping, no JS), title drops to 28/32, header stacks. No horizontal page overflow (`minmax(0,1fr)` column, `min-width:0` canvas).
**Props compatibility:** `active`, `title`, `actions`, `children` unchanged from the current shell; `subtitle` and `utility` added. Existing pages compile without edits.

---

## Pattern 2 — KPI stat card

**Job:** show one operational number with its icon, label and one line of real context, in a row of 4–6 equal cards where currency never wraps.

**Search terms:** "KPI stat card with icon label large number and description" (component, 12 results). Prior project search "dashboard KPI stat card grid" (2026-09-01) already logged.

### Candidate matrix

| | A — Activity Stats Card · lavikatiyar · demo 7797 | B — Stats Card · ravikatiyar162 · demo 8321 | C — Stat Card · ravikatiyar162 · demo 7461 (already in repo as `EstimateFigure`) |
|---|---|---|---|
| Anatomy | Icon container · title · large metric (+unit) · subtext — exact brief anatomy | Title + icon top-right · value · "change from last month" line | Value + trend badge, spring count-up |
| Semantics | Metric is an `<h2>` (heading misuse); `aria-live` on a value that animates 1.5s → screen-reader spam | shadcn `Card` (`h3` title); needs `@/components/ui/card` registry file | `span[aria-live]`, correct |
| Motion | framer `animate` writes `toFixed(2)` into textContent — wrong for integers/currency; no reduced motion | none | spring, honours `useReducedMotion` |
| Styling | Round primary-coloured icon circle, `max-w-xs` (demo styling) | Tailwind + shadcn tokens; invents copy | already normalized |
| Deps / license | framer-motion (installed); 21st community | shadcn card registry; 21st community | framer-motion; 21st community |

**Recommendation:** A's anatomy, rebuilt as a server-rendered `<dl>` group, with C's existing `EstimateFigure` supplying the animated currency figure where wanted (reuse — no second count-up implementation). B's "from last month" trend line is rejected: the dashboard has no prior-period series and the project rule forbids invented deltas.

**Dependencies / license:** none added (`EstimateFigure` already depends on framer-motion). Pattern reference only — 21st community registry.

**Kept:** icon container + label + value + context stack; 44px icon tile; grid of equal cards.
**Changed:** Tailwind → CSS module; `h2` metric → `dt`/`dd` pairs inside one `dl` per row; count-up removed from the card (delegated to `EstimateFigure`, client boundary only where needed); round primary circle → 12px-radius tinted container with six status tones; `featured` variant (strong border, atmospheric blue fill, active shadow); no hover lift on a non-interactive card; value 34/38 w800 Geist, tabular, `nowrap`.

### `src/components/ops/KpiCard.tsx`

```tsx
import type { ReactNode } from "react";
import s from "./KpiCard.module.css";

export type KpiTone = "cobalt" | "electric" | "cyan" | "live" | "warning" | "purple";

/** One <dl> per row of cards — KpiCard must render inside it. */
export function KpiGrid({ children }: { children: ReactNode }) {
  return <dl className={s.grid}>{children}</dl>;
}

export default function KpiCard({
  icon,
  label,
  value,
  context,
  tone = "cobalt",
  featured = false,
}: {
  /** lucide icon, size 20, strokeWidth 1.75 */
  icon: ReactNode;
  label: string;
  /** preformatted — number, "$57.5M", or <EstimateFigure cents={…} /> */
  value: ReactNode;
  /** one line of real context (never an invented delta) */
  context?: ReactNode;
  tone?: KpiTone;
  /** stronger border, soft blue fill, elevated shadow */
  featured?: boolean;
}) {
  return (
    <div className={s.card} data-featured={featured || undefined}>
      <span className={s.icon} data-tone={tone} aria-hidden="true">
        {icon}
      </span>
      <div className={s.body}>
        <dt className={s.label}>{label}</dt>
        <dd className={s.value}>{value}</dd>
        {context && <dd className={s.context}>{context}</dd>}
      </div>
    </div>
  );
}
```

### `src/components/ops/KpiCard.module.css`

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(236px, 1fr));
  gap: var(--ops-panel-gap, 16px);
  margin: 0;
}
.card {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  column-gap: 14px;
  align-items: start;
  min-height: 124px;
  padding: var(--ops-card-pad, 22px);
  background: var(--ops-surface, #fff);
  border: 1px solid var(--ops-border, rgba(34, 82, 154, 0.12));
  border-radius: var(--ops-r-16, 16px);
  box-shadow: var(--ops-shadow-sm, 0 6px 22px rgba(27, 57, 103, 0.06));
}
.card[data-featured] {
  border-color: var(--ops-border-strong, rgba(27, 85, 245, 0.28));
  background: linear-gradient(180deg, var(--ops-surface-soft, #f2f7ff) 0%, var(--ops-surface, #fff) 72%);
  box-shadow: var(--ops-shadow-active, 0 18px 48px rgba(27, 85, 245, 0.15));
}

.icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: var(--kpi-ink);
  background: var(--kpi-soft);
}
/* glyph colours are deepened where the brand tint alone is too faint on white */
.icon[data-tone="cobalt"]   { --kpi-ink: var(--ops-cobalt-deep, #1236c6); --kpi-soft: #eaf0ff; }
.icon[data-tone="electric"] { --kpi-ink: #0f6fcf; --kpi-soft: #e8f3ff; }
.icon[data-tone="cyan"]     { --kpi-ink: #0e93b3; --kpi-soft: #e6f8fc; }
.icon[data-tone="live"]     { --kpi-ink: #148f57; --kpi-soft: #e7f9f0; }
.icon[data-tone="warning"]  { --kpi-ink: #b86f0c; --kpi-soft: #fef3e2; }
.icon[data-tone="purple"]   { --kpi-ink: #5b45d9; --kpi-soft: #f0ecff; }

.body { display: grid; gap: 6px; min-width: 0; }
.label {
  font: 600 11.5px/16px var(--ops-font-display, system-ui, sans-serif);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ops-ink-3, #7d8ba3);
}
.value {
  font: 800 34px/38px var(--ops-font-display, system-ui, sans-serif);
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--ops-ink, #071126);
}
.context {
  font: 500 12.5px/18px var(--ops-font-text, system-ui, sans-serif);
  color: var(--ops-ink-2, #35425b);
}

@media (max-width: 640px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .card { min-height: 112px; padding: 18px; grid-template-columns: 38px minmax(0, 1fr); column-gap: 12px; }
  .icon { width: 38px; height: 38px; border-radius: 10px; }
  .value { font-size: 28px; line-height: 32px; }
}
@media (max-width: 400px) {
  .grid { grid-template-columns: minmax(0, 1fr); }
}
```

**Usage (dashboard):**

```tsx
<KpiGrid>
  <KpiCard icon={<UserPlus size={20} strokeWidth={1.75} />} label="Active invitations" value={d.active_invitations ?? 0} context="Awaiting first client sign-in" tone="cobalt" />
  <KpiCard icon={<DollarSign size={20} strokeWidth={1.75} />} label="Pipeline value" value={<EstimateFigure cents={Number(d.pipeline_high_cents ?? 0)} />} context={`${d.total ?? 0} open proposals`} tone="electric" featured />
</KpiGrid>
```

**Accessibility:** one `dl` per row → screen readers announce "Active invitations, 12" as term/definition pairs; icon is decorative (`aria-hidden`) so the label carries meaning; no hover-only information; label 11.5px uppercase is limited to the term line (brief allows 11–12 w600); text contrast: ink-3 #7D8BA3 on white = 3.6:1 — used only for the ≥11.5px w600 uppercase label, the value and context use ink/ink-2 (≥ 9:1). If the label must meet 4.5:1, switch `.label` to `--ops-ink-2`.
**Responsive:** `auto-fit minmax(236px,1fr)` gives 6 cards at 1680, 4 at ~1100, 3 at ~800; ≤640 two columns with 38px tile and 28/32 value; ≤400 one column. `white-space: nowrap` + `tabular-nums` on the value; use `compactUsd` ("$57.5M") for summary rows so nothing overflows in a 2-column mobile grid.

---

## Pattern 3 — Connected pipeline stages

**Job:** show the seven proposal stages as one connected left-to-right flow, each with a count and a compact value, plus a proportional distribution bar — readable without hover.

**Search terms:** "sales pipeline funnel stages with counts and values horizontal steps" (12), "deal pipeline stage summary connected steps with count badge and total value per stage" (12), "segmented stacked progress bar with legend breakdown by category" (10). The catalog has no read-only "stage strip with counts"; results were funnel charts, wizards/steppers, and progress bars.

### Candidate matrix

| | A — Wizard Steps · ddoemonn · demo 23576 | B — Funnel Chart · bklitai · demo 10130 | C — Process Pillars · ankitsharma2615 · demo 3192 |
|---|---|---|---|
| Structure | `<ol>` rail: tiles + connector segments, `aria-current="step"`, sr-only position text, `useReducedMotion` variants | Spring-animated SVG funnel; label overlays; ResizeObserver sizing; `PatternLines` fill | Five hard-coded pillars, decorative only |
| Interaction | Arrow/Home/End keyboard on reachable steps; buttons | Hover-only dimming (`pointer-events-none` segments; overlays catch mouse) | `pointer-events-none` |
| Data model | Wizard (one current step, others future/done) — wrong for a live count per stage | Monotonic funnel (`value / first.value`) — stage counts are not monotonic (e.g. 2 invited, 5 configuring) | none |
| Reduced motion | Yes | No | No |
| Deps / license | motion/react (installed as `motion`); 21st community | motion/react, clsx, tailwind-merge (all installed); 21st community | framer-motion; 21st community |
| Fit | Right rail semantics + connector idiom; strip wizard panel/buttons | Wrong chart type + hover-only | Structurally wrong |

**Recommendation:** rebuild on A's `<ol>` connected-rail semantics as a read-only server component: each stage is a tile (icon · label · count · compact value) and, when a filtered list route exists, a real `<Link>` — so the "drill in" interaction is keyboard/touch native and never hover-only. Replace the dashboard's current `hsl()`-computed distribution bar with a `role="img"` bar whose segments use the brief's status tones and whose `aria-label` reads every share. No motion (values are server-computed; nothing "arrives"). B is rejected because a funnel geometry asserts monotonic decrease and hides labels behind hover; C is decorative.

**Dependencies / license:** none added. Pattern reference only — 21st community registry.

**Kept:** ordered-list rail, connector between items, per-stage tile, sr-visible naming of each stage, reduced-motion respect.
**Changed:** wizard state machine, panel, back/next buttons, stone palette and dark variants removed; steps → stages with `count`/`valueCents`/`tone`/`href`; connector = 2px line + 6px node in the 16px gap (brief: "small connector nodes"); `emphasis` prop applies the featured/selected treatment without auto-picking; vertical rail ≤760px; distribution bar added.

### `src/components/ops/PipelineStages.tsx`

```tsx
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { compactUsd } from "@/lib/proposals/money";
import s from "./PipelineStages.module.css";

/** brief status colours: invited soft cobalt · configuring cyan · submitted amber ·
 *  engineering review orange · proposal sent deep cobalt · signature blue-violet · signed green */
export type StageTone = "cobalt-soft" | "cyan" | "amber" | "orange" | "cobalt-deep" | "violet" | "green";

export type PipelineStage = {
  key: string;
  label: string;
  /** lucide icon, size 16, strokeWidth 1.75 */
  icon: ReactNode;
  count: number;
  valueCents: number;
  tone: StageTone;
  /** filtered list, e.g. /ops/proposals?status=client_invited */
  href?: string;
};

export default function PipelineStages({
  stages,
  title = "Proposal pipeline",
  totalCents,
  emphasis,
  id = "pipeline",
}: {
  stages: PipelineStage[];
  title?: string;
  /** server-computed total; defaults to the sum of stage values */
  totalCents?: number;
  /** key of a stage to render in the featured/selected treatment */
  emphasis?: string;
  /** unique per instance on a page (heading id) */
  id?: string;
}) {
  const totalCount = stages.reduce((a, st) => a + st.count, 0);
  const total = totalCents ?? stages.reduce((a, st) => a + st.valueCents, 0);
  const share = (n: number) => (totalCount ? (n / totalCount) * 100 : 0);
  const summary = stages.map((st) => `${st.label} ${st.count} (${Math.round(share(st.count))}%)`).join(", ");

  return (
    <section className={s.panel} aria-labelledby={`${id}-title`}>
      <header className={s.head}>
        <h2 id={`${id}-title`} className={s.title}>
          {title}
        </h2>
        <p className={s.total}>
          <span className={s.totalLabel}>Total pipeline value</span>
          <strong className={s.totalValue}>{compactUsd(total)}</strong>
        </p>
      </header>

      <ol className={s.rail} aria-label="Stages, in order" style={{ "--stages": stages.length } as CSSProperties}>
        {stages.map((st) => {
          const inner = (
            <>
              <span className={s.tile} aria-hidden="true">
                {st.icon}
              </span>
              <span className={s.stageLabel}>{st.label}</span>
              <span className={s.count}>{st.count}</span>
              <span className={s.value}>{compactUsd(st.valueCents)}</span>
            </>
          );
          const name = `${st.label}: ${st.count} ${st.count === 1 ? "proposal" : "proposals"}, ${compactUsd(st.valueCents)}`;
          return (
            <li key={st.key} className={s.stage} data-tone={st.tone} data-emphasis={st.key === emphasis || undefined}>
              {st.href ? (
                <Link href={st.href} className={s.stageLink} aria-label={name}>
                  {inner}
                </Link>
              ) : (
                <div className={s.stageLink}>{inner}</div>
              )}
            </li>
          );
        })}
      </ol>

      <div className={s.bar} role="img" aria-label={`Distribution by stage: ${summary}`}>
        {stages.map(
          (st) =>
            st.count > 0 && <span key={st.key} className={s.barSeg} data-tone={st.tone} style={{ width: `${share(st.count)}%` }} />,
        )}
      </div>
    </section>
  );
}
```

### `src/components/ops/PipelineStages.module.css`

```css
.panel {
  min-height: 260px;
  padding: var(--ops-panel-pad, 26px);
  background: var(--ops-surface, #fff);
  border: 1px solid var(--ops-border, rgba(34, 82, 154, 0.12));
  border-radius: var(--ops-r-20, 20px);
  box-shadow: var(--ops-shadow-sm, 0 6px 22px rgba(27, 57, 103, 0.06));
  display: grid;
  gap: 20px;
  align-content: start;
}
.head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.title { font: 750 20px/26px var(--ops-font-display, system-ui, sans-serif); letter-spacing: -0.02em; color: var(--ops-ink, #071126); }
.total { display: flex; align-items: baseline; gap: 8px; }
.totalLabel {
  font: 600 11.5px/16px var(--ops-font-display, system-ui, sans-serif);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ops-ink-3, #7d8ba3);
}
.totalValue {
  font: 800 18px/22px var(--ops-font-display, system-ui, sans-serif);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--ops-ink, #071126);
}

/* ---- rail ---- */
.rail {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(var(--stages, 7), minmax(0, 1fr));
  gap: 16px;
}
.stage { position: relative; min-width: 0; }
/* connector line + node between stages (fills the 16px gap) */
.stage:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -16px;
  width: 16px;
  height: 2px;
  transform: translateY(-50%);
  background: var(--ops-border-strong, rgba(27, 85, 245, 0.28));
}
.stage:not(:last-child)::before {
  content: "";
  position: absolute;
  top: 50%;
  right: -11px;
  width: 6px;
  height: 6px;
  transform: translateY(-50%);
  border-radius: 50%;
  background: var(--ops-cobalt, #1b55f5);
  z-index: 1;
}
.stageLink {
  display: grid;
  gap: 6px;
  height: 100%;
  padding: 16px 14px 14px;
  border-radius: var(--ops-r-16, 16px);
  border: 1px solid var(--ops-border, rgba(34, 82, 154, 0.12));
  background: var(--ops-bg-elevated, #f8fbff);
  color: inherit;
  text-decoration: none;
  transition: border-color var(--ops-dur, 200ms) var(--ops-ease, ease), box-shadow var(--ops-dur, 200ms) var(--ops-ease, ease),
    transform var(--ops-dur, 200ms) var(--ops-ease, ease);
}
a.stageLink:hover {
  border-color: var(--ops-border-strong, rgba(27, 85, 245, 0.28));
  box-shadow: var(--ops-shadow-sm, 0 6px 22px rgba(27, 57, 103, 0.06));
  transform: translateY(-1px);
}
a.stageLink:focus-visible { outline: 2px solid var(--ops-cobalt, #1b55f5); outline-offset: 2px; }
.stage[data-emphasis] .stageLink {
  border-color: var(--ops-border-strong, rgba(27, 85, 245, 0.28));
  background: var(--ops-surface-selected, #eaf2ff);
  box-shadow: var(--ops-shadow-active, 0 18px 48px rgba(27, 85, 245, 0.15));
}
.tile {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  margin-bottom: 4px;
  color: var(--stage-ink);
  background: var(--stage-soft);
}
.stageLabel {
  font: 600 11.5px/16px var(--ops-font-display, system-ui, sans-serif);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ops-ink-3, #7d8ba3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.count {
  font: 800 26px/30px var(--ops-font-display, system-ui, sans-serif);
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: var(--ops-ink, #071126);
}
.value {
  font: 600 12.5px/18px var(--ops-font-text, system-ui, sans-serif);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: var(--ops-ink-2, #35425b);
}

/* ---- status tones (glyph ink deepened for legibility; bar uses the brief hue) ---- */
.stage[data-tone="cobalt-soft"], .barSeg[data-tone="cobalt-soft"] { --stage-ink: #1b55f5; --stage-soft: #eaf0ff; --stage-bar: #7fa4ff; }
.stage[data-tone="cyan"],        .barSeg[data-tone="cyan"]        { --stage-ink: #0e93b3; --stage-soft: #e6f8fc; --stage-bar: #27c3ea; }
.stage[data-tone="amber"],       .barSeg[data-tone="amber"]       { --stage-ink: #b86f0c; --stage-soft: #fef3e2; --stage-bar: #eca43a; }
.stage[data-tone="orange"],      .barSeg[data-tone="orange"]      { --stage-ink: #c2540f; --stage-soft: #feede2; --stage-bar: #f0813a; }
.stage[data-tone="cobalt-deep"], .barSeg[data-tone="cobalt-deep"] { --stage-ink: #1236c6; --stage-soft: #e6ecff; --stage-bar: #1236c6; }
.stage[data-tone="violet"],      .barSeg[data-tone="violet"]      { --stage-ink: #5b45d9; --stage-soft: #eeeaff; --stage-bar: #7759f6; }
.stage[data-tone="green"],       .barSeg[data-tone="green"]       { --stage-ink: #148f57; --stage-soft: #e7f9f0; --stage-bar: #20c77a; }

/* ---- distribution bar ---- */
.bar {
  display: flex;
  gap: 2px;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--ops-surface-soft, #f2f7ff);
}
.barSeg { display: block; height: 100%; min-width: 4px; background: var(--stage-bar); }

/* ---- 761–1180px: two rows of stages, no connector at a row end ---- */
@media (min-width: 761px) and (max-width: 1180px) {
  .rail { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .stage:nth-child(4n)::after, .stage:nth-child(4n)::before { display: none; }
}

/* ---- ≤760px: vertical rail, connector runs down the tile column ---- */
@media (max-width: 760px) {
  .rail { grid-template-columns: minmax(0, 1fr); gap: 10px; }
  .stageLink {
    grid-template-columns: 32px minmax(0, 1fr) auto;
    grid-template-areas: "tile label count" "tile value count";
    align-items: center;
    column-gap: 12px;
    row-gap: 2px;
    padding: 12px 14px;
  }
  .tile { grid-area: tile; margin: 0; }
  .stageLabel { grid-area: label; }
  .value { grid-area: value; }
  .count { grid-area: count; font-size: 22px; line-height: 26px; }
  .stage:not(:last-child)::after {
    top: auto;
    right: auto;
    bottom: -10px;
    left: 29px;
    width: 2px;
    height: 10px;
    transform: none;
  }
  .stage:not(:last-child)::before { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .stageLink { transition: none; }
  a.stageLink:hover { transform: none; }
}
```

**Usage (dashboard, replacing the inline STAGES grid + hsl bar in `src/app/ops/page.tsx`):**

```tsx
const TONES: Record<string, StageTone> = {
  client_invited: "cobalt-soft", client_configuring: "cyan", client_submitted: "amber",
  engineering_review: "orange", released: "cobalt-deep", signature_requested: "violet", client_signed: "green",
};
<PipelineStages
  totalCents={Number(d.pipeline_high_cents ?? 0)}
  stages={STAGES.map(([k, label, icon]) => ({
    key: k, label, icon, tone: TONES[k], count: stageN(k), valueCents: stageV(k),
    href: `/ops/proposals?status=${k}`, // only if the proposals list reads ?status=
  }))}
/>
```

**Accessibility:** `section[aria-labelledby]` with an `h2`; `ol[aria-label]` conveys order; each linked stage has an `aria-label` that starts with its visible label ("Invited: 2 proposals, $57.5M") so label-in-name holds; non-linked stages are plain content; connectors and tiles are pseudo-elements / `aria-hidden`; the bar is `role="img"` with a full textual summary of shares, so nothing depends on colour or hover; focus ring on links; lift removed under reduced motion. Colour is never the only carrier — each stage has its text label.
**Responsive:** ≥1181 seven equal columns with connectors; 761–1180 two rows of four (connector suppressed at the row end); ≤760 vertical list rows (tile · label/value · count) with a 2px connector running down the tile column. Labels ellipsise instead of wrapping; counts and values are `nowrap` tabular.

---

## Token adaptation plan (all three)

1. Drop the six files into `src/components/ops/` (paths above). `OpsShell.tsx` replaces the existing inline-styled shell 1:1 (props are a superset).
2. Dashboard: swap the `s.metric` grid for `KpiGrid`/`KpiCard`, the STAGES grid + `hsl()` bar for `PipelineStages`, and pass the existing lede sentence as `subtitle`. Other pages: no change required; move `s.root` background/padding hacks into shell defaults over time.
3. Buttons keep `private.module.css` `.btn/.btnPrimary` for now; the brief's gradient (`--ops-gradient-primary`), 12px radius, 44px min-height and press scale .985 should land in one shared `ops` button class in the next pass — not duplicated per component.
4. Status chips: `PipelineStages` tones are the canonical status→colour map; reuse the same `data-tone` names when the chip family is normalized.

## Implementation status

- 21st MCP: available and used (5 searches, 8 retrievals — demo ids 14941, 19361, 9847, 7797, 8321, 3192, 10130, 23576; 7461 referenced from the prior log).
- Adapted code: written, type-checked in the project (`npx tsc --noEmit`, exit 0), then removed from `src/` — **not installed** (installation was not authorized in this run). No dependencies added; no shadcn registry files pulled.
- Not run in this pass: browser render at 390/768/1440/1920 (requires installation first), UI UX Pro Max, font specimen, image generation, SEO (not applicable to an authenticated app shell). Vercel plugin hooks suggested `bootstrap`, `next-upgrade`, `next-cache-components`, `react-best-practices` skills; none were run (out of scope for a component scout — nothing here touches caching, deployment or the Next version).
- Verification still owed after installation: render `/ops` at the four widths, check the mobile module rail scrolls without page overflow, confirm `aria-current` styling, confirm the pipeline bar percentages match `by_status` counts.

## Source-log entries

Appended to `docs/component-sources.md`:

| Project component | 21st search intent | Selected source | Why selected | Dependencies | License/attribution | Major modifications | Status |
|---|---|---|---|---|---|---|---|
| `OpsShell` (fixed light sidebar + utility bar + canvas) | dashboard application shell with fixed sidebar navigation and top header bar | arunjdass **Dashboard Sidebar** (demo 14941) for frame structure; inference-sh **Sidebar Light** (demo 19361) for link semantics; kumail_ali_r **Core Header Navbar** (demo 9847) for the masked-grid atmosphere | Right frame proportions and grouped nav; the others fix its `div onClick` interaction layer | none | 21st community (author-published) | Tailwind → CSS module with `--ops-*` tokens; real `<Link aria-current>`; switcher/command palette/collapse removed; 164px wordmark + OPERATIONS + environment badge/live dot; page header + `utility` slot; CSS-only mobile module rail | adapted, awaiting install |
| `KpiCard` + `KpiGrid` | KPI stat card with icon label large number and description | lavikatiyar **Activity Stats Card** (demo 7797); animated figure reuses existing `EstimateFigure` (21st 7461) | Exact anatomy (icon container · label · value · context); ravikatiyar162 8321 rejected for invented "from last month" trend | none (framer-motion via existing `EstimateFigure`) | 21st community | `<dl>` semantics, no in-card count-up, six tinted tones, featured variant, 34/38 Geist tabular nowrap value, CSS module | adapted, awaiting install |
| `PipelineStages` | sales pipeline funnel stages with counts and values; deal pipeline stage summary connected steps; segmented stacked progress bar | ddoemonn **Wizard Steps** (demo 23576) — `<ol>` rail semantics + connectors only | Only candidate with correct list semantics, keyboard reach and reduced-motion handling; bklitai Funnel Chart (10130) rejected (monotonic funnel, hover-only), Process Pillars (3192) decorative | none | 21st community | Wizard state/panel/buttons removed; stages carry count/value/tone/optional href; connector line + node; `role="img"` distribution bar with textual summary; vertical rail ≤760px; server component | adapted, awaiting install |
