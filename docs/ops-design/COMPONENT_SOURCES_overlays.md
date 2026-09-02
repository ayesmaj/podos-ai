# Component sources — ops overlays & list chrome (2026-09-02)

Scope: right-side drawer · multi-step creation wizard inside the drawer · list toolbar · tabs · command search, for the bright PODOS operations platform (`/ops`).

## Method

21st MCP (`mcp__21st-global__search` → `get_component`, paid tier) was the first discovery source. Seven functional searches ran; eleven candidates had their **real source retrieved and read** (not judged from previews). Every adopted pattern is normalized below into the ops tokens — none is used verbatim; every Tailwind class, demo colour, hand-drawn SVG, sample copy and dark-mode branch is removed.

| # | Search intent (verbatim) | Retrieved (demo id) |
|---|---|---|
| 1 | `right side drawer sheet panel slide over` | 23558 ddoemonn Drawer · 25002 shadcnspace Sheet |
| 2 | `multi-step form wizard stepper with progress and next back` | 23576 ddoemonn Wizard Steps · 7821 dhileepkumargm Multi-step Wizard |
| 3 | `data table toolbar search filter sort view toggle` | 19516 cnippet Toolbar (Base UI) · 22162 felipemenezes098 Table with Filters |
| 4 | `segmented control toggle group icon buttons grid list view switch` | 23552 ddoemonn Segmented Control |
| 5 | `filter bar with filter chips popover and saved views` | none retrieved — results were chip breadcrumbs / e-commerce filter grids (wrong job) |
| 6 | `tabs animated underline indicator` | 24930 educalvolpz Animated Tabs · 24956 cnippet Underline Tabs |
| 7 | `command menu palette search cmdk` | 23522 ddoemonn Command Palette · 382 Origin UI Command |

Project constraints honoured everywhere:

- Next 16 / React 19. Server components by default; only the five interactive pieces are `"use client"`.
- The unlayered reset in `src/app/globals.css` zeroes margin/padding on everything outside `.invest`, so **no Tailwind spacing utilities**. All styling is one CSS module (`src/components/ops/ui/ops-ui.module.css`) plus a few inline style objects for computed values.
- Motion via the already-installed `motion` 12 (`motion/react`). Icons via `lucide-react`. **No new dependencies** for any adopted pattern (Radix, Base UI, cmdk, TanStack and class-variance-authority were all rejected on that ground).
- Fonts: Geist (`--font-display`) for titles, KPI figures and technical metadata with `font-variant-numeric: tabular-nums`; Inter Tight (`--font-body`) for text. No mono family.
- Buttons: primary gradient, 12px radius, min 44px, hover -1px, press scale .985, 180–260ms, `prefers-reduced-motion` respected.

## Ops tokens (add to `:root` in `src/app/globals.css`)

```css
:root {
  --ops-sidebar-width: 252px;
  --ops-page-max-width: 1680px;
  --ops-page-padding-x: clamp(24px, 3vw, 48px);
  --ops-page-padding-y: 32px;
  --ops-gap-section: 24px;
  --ops-gap-panel: 16px;
  --ops-pad-card: 22px;
  --ops-pad-panel: 26px;
  --ops-r-12: 12px; --ops-r-16: 16px; --ops-r-20: 20px; --ops-r-24: 24px;

  --ops-bg: #F4F7FC;
  --ops-bg-elevated: #F8FBFF;
  --ops-surface: #FFFFFF;
  --ops-surface-soft: #F2F7FF;
  --ops-surface-selected: #EAF2FF;
  --ops-ink: #071126;
  --ops-ink-secondary: #35425B;
  --ops-ink-muted: #7D8BA3;
  --ops-cobalt-deep: #1236C6;
  --ops-cobalt: #1B55F5;
  --ops-electric: #168DFF;
  --ops-cyan: #27C3EA;
  --ops-live: #20C77A;
  --ops-warning: #ECA43A;
  --ops-danger: #E25568;
  --ops-purple: #7759F6;
  --ops-border: rgba(34, 82, 154, .12);
  --ops-border-strong: rgba(27, 85, 245, .28);
  --ops-shadow-sm: 0 6px 22px rgba(27, 57, 103, .06);
  --ops-shadow-md: 0 16px 42px rgba(22, 53, 103, .09);
  --ops-shadow-active: 0 18px 48px rgba(27, 85, 245, .15);
  --ops-gradient-primary: linear-gradient(135deg, #1236C6 0%, #168DFF 62%, #27C3EA 100%);
  --ops-focus: 0 0 0 3px rgba(27, 85, 245, .28);
  --ops-ease: cubic-bezier(.22, 1, .36, 1);
  --ops-dur: 220ms;
}
```

## Shared CSS module — `src/components/ops/ui/ops-ui.module.css`

One file for all five patterns so they share one radius/elevation/focus logic (component-policy §10). Every class sets its own padding/margins because the reset removed the defaults.

```css
/* ---------- primitives ---------- */
.srOnly { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 44px; padding: 0 18px; border-radius: var(--ops-r-12);
  font-family: var(--font-body); font-size: 14px; font-weight: 650; line-height: 1;
  border: 1px solid transparent; cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: transform var(--ops-dur) var(--ops-ease), box-shadow var(--ops-dur) var(--ops-ease), background-color var(--ops-dur) var(--ops-ease), border-color var(--ops-dur) var(--ops-ease);
}
.btn:focus-visible { outline: none; box-shadow: var(--ops-focus); }
.btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }
.btnPrimary { background: var(--ops-gradient-primary); color: #fff; box-shadow: var(--ops-shadow-sm); }
.btnPrimary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: var(--ops-shadow-active); }
.btnPrimary:active:not(:disabled) { transform: scale(.985); }
.btnSecondary { background: var(--ops-surface); color: var(--ops-ink); border-color: var(--ops-border-strong); }
.btnSecondary:hover:not(:disabled) { background: var(--ops-surface-soft); transform: translateY(-1px); }
.btnSecondary:active:not(:disabled) { transform: scale(.985); }
.btnGhost { background: transparent; color: var(--ops-ink-secondary); min-height: 40px; padding: 0 12px; }
.btnGhost:hover:not(:disabled) { background: var(--ops-surface-soft); color: var(--ops-ink); }
.btnIcon { width: 40px; min-height: 40px; padding: 0; border-radius: var(--ops-r-12); }

.field {
  width: 100%; min-height: 44px; padding: 0 14px; border-radius: var(--ops-r-12);
  border: 1px solid var(--ops-border-strong); background: var(--ops-surface);
  font-family: var(--font-body); font-size: 14.5px; color: var(--ops-ink);
  transition: border-color var(--ops-dur) var(--ops-ease), box-shadow var(--ops-dur) var(--ops-ease);
}
.field:focus-visible { outline: none; border-color: var(--ops-cobalt); box-shadow: var(--ops-focus); }
.field::placeholder { color: var(--ops-ink-muted); }
.fieldLabel { display: grid; gap: 6px; }
.label { font-family: var(--font-body); font-size: 11.5px; line-height: 16px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--ops-ink-muted); }
.help { font-family: var(--font-body); font-size: 13px; line-height: 20px; color: var(--ops-ink-secondary); }
.meta { font-family: var(--font-display); font-size: 12px; line-height: 16px; color: var(--ops-ink-muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
.kbd { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 6px; border: 1px solid var(--ops-border); background: var(--ops-surface-soft); font-family: var(--font-display); font-size: 11px; font-variant-numeric: tabular-nums; color: var(--ops-ink-muted); }

@media (prefers-reduced-motion: reduce) {
  .btn, .field { transition: none; }
  .btnPrimary:hover:not(:disabled), .btnSecondary:hover:not(:disabled) { transform: none; }
}
```

---

## 1 · Right-side drawer — `OpsDrawer`

**Job:** hold a focused creation/edit task beside the list without leaving the page, trapping focus and returning it when closed.

### Candidates

| | 23558 ddoemonn **Drawer** | 25002 shadcnspace **Sheet** | 24837 base-ui **Drawer** (metadata only) |
|---|---|---|---|
| Deps | none (motion, already installed) | `@radix-ui/react-dialog`, `@radix-ui/react-label`, cva | `@base-ui-components/react` |
| Semantics | `role=dialog aria-modal aria-labelledby/-describedby` | Radix Dialog (good) | Base UI (good) |
| Focus / scroll | own focus trap, `inert` on siblings, return-focus, scroll-lock with gutter compensation | Radix handles | Base UI handles |
| Motion | spring `x` + scrim opacity tied to position, `useReducedMotion` | CSS keyframes via tailwind-animate | CSS |
| Mobile | `maxWidth: calc(100% - 40px)`, drag-to-dismiss | `w-3/4 sm:max-w-sm` | swipe |
| Fit | Zero deps, headless hook, all logic readable in one file | Would add a third overlay library to a repo with none | New dep for one component |

**Recommendation: 23558.** Only candidate with no new dependency; the `inert`-siblings + return-focus logic is exactly what a wizard drawer needs. Sheet/Base UI are fine components but each drags in a primitive library we would use once (policy §9).

**Kept:** open/close state contract (`open`, `onOpenChange`), portal to `document.body`, `inert` on body siblings, focus-first-control, Tab loop, Escape, return focus, scroll-lock with scrollbar-gutter compensation, spring position + scrim derived from `x`, reduced-motion → zero duration.
**Changed:** drag-to-dismiss removed (a creation wizard must not be lost by a header swipe; ~60 lines of `useDragControls` gone); default width 560 (wizard needs two-column rows); Tailwind → CSS module; stone/`#4568FF` demo palette → ops tokens; hand-drawn close SVG → lucide `X`; header becomes title 20/26 w700 Geist + 15/23 subtitle; footer is a slot rendered as a sticky action bar; full-bleed sheet under 720px (no left radius, no side gutter); scrim uses ink at 32 % — no blur, no glass.

### `src/components/ops/ui/OpsDrawer.tsx`

```tsx
"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { X } from "lucide-react";
import s from "./ops-ui.module.css";

const SPRING = { type: "spring", stiffness: 150, damping: 27, mass: 1 } as const;
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

type Inertable = HTMLElement & { inert?: boolean };

export type OpsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  width?: number;
  closeLabel?: string;
  dismissOnScrimClick?: boolean;
};

export default function OpsDrawer({
  open, onOpenChange, title, description, footer, children,
  width = 560, closeLabel = "Close panel", dismissOnScrimClick = true,
}: OpsDrawerProps) {
  const titleId = useId();
  const hintId = useId();
  const reduced = useReducedMotion();

  const away = width + 24;
  const x = useMotionValue(open ? 0 : away);
  const veil = useTransform(x, (v) => 1 - Math.min(1, Math.abs(v) / width));

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(open);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => setHost(document.body), []);

  /* position: spring in, spring out, then unmount the panel from the tree */
  useEffect(() => {
    if (open) setMounted(true);
    const controls = animate(x, open ? 0 : away, reduced ? { duration: 0 } : SPRING);
    if (!open) controls.then(() => setMounted(false));
    return () => controls.stop();
  }, [open, away, reduced, x]);

  /* focus: move in on open (once the panel is mounted), restore on close */
  useEffect(() => {
    if (open) {
      if (!mounted) return;
      const active = document.activeElement;
      returnTo.current = active instanceof HTMLElement ? active : null;
      const panel = panelRef.current;
      const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel)?.focus({ preventScroll: true });
      return;
    }
    const target = returnTo.current;
    returnTo.current = null;
    if (target?.isConnected) target.focus({ preventScroll: true });
  }, [open, mounted]);

  /* scroll lock with gutter compensation + inert siblings */
  useEffect(() => {
    const shell = rootRef.current;
    if (!open || !mounted || !shell) return;
    const root = document.documentElement;
    const prev = { overflow: root.style.overflow, pad: root.style.paddingRight };
    const gutter = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (gutter > 0) root.style.paddingRight = `${gutter}px`;

    const muted: Inertable[] = [];
    for (const node of Array.from(document.body.children)) {
      if (!(node instanceof HTMLElement) || node.contains(shell)) continue;
      const el = node as Inertable;
      if (el.inert) continue;
      el.inert = true;
      muted.push(el);
    }
    return () => {
      root.style.overflow = prev.overflow;
      root.style.paddingRight = prev.pad;
      for (const el of muted) el.inert = false;
    };
  }, [open, mounted]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const panel = panelRef.current;
    if (!panel) return;
    if (e.key === "Escape") { e.stopPropagation(); close(); return; }
    if (e.key !== "Tab") return;
    const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (nodes.length === 0) { e.preventDefault(); panel.focus(); return; }
    const first = nodes[0], last = nodes[nodes.length - 1], active = document.activeElement;
    if (e.shiftKey && (active === first || active === panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  };

  if (!host || !mounted) return null;

  return createPortal(
    <div ref={rootRef} className={s.drawerRoot} data-open={open || undefined}>
      <motion.div aria-hidden className={s.drawerScrim} style={{ opacity: veil }} onClick={dismissOnScrimClick ? close : undefined} />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={hintId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={s.drawerPanel}
        style={{ x, width }}
      >
        <header className={s.drawerHead}>
          <div className={s.drawerHeadText}>
            <h2 id={titleId} className={s.drawerTitle}>{title}</h2>
            {description ? <p className={s.drawerDesc}>{description}</p> : null}
          </div>
          <button type="button" onClick={close} aria-label={closeLabel} className={`${s.btn} ${s.btnGhost} ${s.btnIcon}`}>
            <X size={18} strokeWidth={1.75} aria-hidden />
          </button>
        </header>
        <div className={s.drawerBody}>{children}</div>
        {footer ? <footer className={s.drawerFoot}>{footer}</footer> : null}
        <span id={hintId} className={s.srOnly}>Press Escape to close this panel.</span>
      </motion.div>
    </div>,
    host,
  );
}
```

### CSS (append to `ops-ui.module.css`)

```css
/* ---------- drawer ---------- */
.drawerRoot { position: fixed; inset: 0; z-index: 60; overflow: hidden; pointer-events: none; }
.drawerRoot[data-open] { pointer-events: auto; }
.drawerScrim { position: absolute; inset: 0; background: rgba(7, 17, 38, .32); }
.drawerPanel {
  position: absolute; top: 0; right: 0; bottom: 0;
  max-width: 100%;
  display: flex; flex-direction: column;
  background: var(--ops-surface);
  border-left: 1px solid var(--ops-border);
  border-radius: var(--ops-r-20) 0 0 var(--ops-r-20);
  box-shadow: var(--ops-shadow-active);
  outline: none;
}
.drawerHead { display: flex; align-items: flex-start; gap: 16px; padding: var(--ops-pad-panel) var(--ops-pad-panel) 18px; border-bottom: 1px solid var(--ops-border); }
.drawerHeadText { min-width: 0; flex: 1; display: grid; gap: 4px; }
.drawerTitle { font-family: var(--font-display); font-size: 20px; line-height: 26px; font-weight: 700; letter-spacing: -.015em; color: var(--ops-ink); }
.drawerDesc { font-family: var(--font-body); font-size: 15px; line-height: 23px; color: var(--ops-ink-secondary); max-width: 60ch; }
.drawerBody { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 22px var(--ops-pad-panel); background: var(--ops-bg-elevated); }
.drawerFoot { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 16px var(--ops-pad-panel); border-top: 1px solid var(--ops-border); background: var(--ops-surface); padding-bottom: max(16px, env(safe-area-inset-bottom)); }

@media (max-width: 719px) {
  .drawerPanel { width: 100% !important; border-radius: 0; border-left: 0; }
  .drawerHead, .drawerBody, .drawerFoot { padding-left: 20px; padding-right: 20px; }
}
```

**Accessibility:** `role=dialog aria-modal`, labelled by the visible title; body siblings made `inert` so screen readers and Tab cannot leave; Escape closes; focus lands on the first control and returns to the trigger; hint text via `aria-describedby`; close button is a 40px labelled control — no hover-only affordance. Reduced motion: transitions collapse to 0 ms, scrim still fades via opacity (no movement).
**Responsive:** 560px panel on desktop (never wider than the viewport), full-bleed sheet under 720px with safe-area padding on the footer; body scrolls independently so the footer actions stay reachable on short viewports.

---

## 2 · Multi-step creation wizard inside the drawer — `WizardSteps` + `NewProposalWizard`

**Job:** walk an operator through mode → client → project → contact → review to create a proposal, gating each step on validity and submitting through the existing server action — replacing the inline `NewProposalForm` on `/ops/proposals` (brief: no inline creation forms on list pages).

### Candidates

| | 23576 ddoemonn **Wizard Steps** | 7821 dhileepkumargm **Multi-step Wizard** | 769 Origin UI **Stepper** (already adopted as `StepRail`, see `docs/component-sources.md`) |
|---|---|---|---|
| Deps | none (motion) | framer-motion (installed as `motion`) | none |
| TypeScript | strict, typed hook `useWizard` (controlled/uncontrolled, `furthest` gating, direction) | untyped (`errors = {}`, `handleChange = (e)`), one 500-line component with baked-in fields | typed context |
| Keyboard | rail is a roving-tabindex list (Arrow/Home/End clamped to `furthest`), `aria-current="step"`, live region announces position | none beyond native | buttons |
| Motion | direction-aware crossfade + 22px slide, `useReducedMotion` | full-width `x: 100%` slide with `anticipate` ease (heavy, not reduced-motion aware) | none |
| Fit | headless logic separable from the visual rail | must be rewritten field-by-field; demo copy/indigo everywhere | vertical rail for a page, not a drawer |

**Recommendation: 23576.** Its `useWizard` hook is the right abstraction (index/direction/furthest/next/back/goTo) and the same author's motion vocabulary as the drawer, so the two read as one system. The onboarding wizard (7821) is a demo, not a component. `StepRail` stays for the client configurator page; inside a 560px drawer a horizontal rail is correct.

**Kept:** `useWizard` (with `clampIndex`, controlled/uncontrolled, `furthest` high-water mark, `onComplete` on last `next()`), rail as `<ol>` of buttons with `aria-current="step"`, roving tabindex with Arrow/Home/End clamped to `furthest`, `aria-live` position sentence, direction-aware `AnimatePresence` variants, focus-intent tracking (focus returns to the rail or the panel depending on what moved you).
**Changed:** fixed `height` prop removed — the drawer body scrolls, the panel grows with content (`min-height: 220px`); step tiles 28px → cobalt when done/current with lucide `Check`, connector fill uses the primary gradient; the crossfading label row above the rail is dropped (the drawer title + step title carry it); Back/Next buttons are lifted out into the drawer footer via a render-prop so they sit in the sticky action bar; per-step `canAdvance` gate added (Next disabled until the step is valid); the final step is a real `<form action={serverAction}>` with hidden inputs so submission stays a server action with progressive enhancement; completion screen removed (the action redirects into the editor).

### `src/components/ops/ui/WizardSteps.tsx`

```tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import s from "./ops-ui.module.css";

const RAIL = { type: "spring", stiffness: 520, damping: 40, mass: 0.5 } as const;
const PANEL = { type: "spring", stiffness: 260, damping: 34, mass: 0.8 } as const;
const EXIT = { duration: 0.14, ease: [0.4, 0, 1, 1] as const };

export type WizardDirection = 1 | -1;

function clampIndex(v: number, total: number) {
  return total < 1 ? 0 : Math.max(0, Math.min(total - 1, Math.trunc(v)));
}

export function useWizard({ total, index, defaultIndex = 0, onIndexChange, onComplete }: {
  total: number; index?: number; defaultIndex?: number;
  onIndexChange?: (index: number, direction: WizardDirection) => void; onComplete?: () => void;
}) {
  const [internal, setInternal] = useState(() => clampIndex(defaultIndex, total));
  const current = clampIndex(index ?? internal, total);
  const [seen, setSeen] = useState<{ index: number; direction: WizardDirection }>({ index: current, direction: 1 });
  if (seen.index !== current) setSeen({ index: current, direction: current > seen.index ? 1 : -1 });
  const [furthest, setFurthest] = useState(current);
  if (furthest < current) setFurthest(current);

  const emit = useRef(onIndexChange); emit.current = onIndexChange;
  const finish = useRef(onComplete); finish.current = onComplete;
  const controlled = index !== undefined;

  const goTo = useCallback((to: number) => {
    const target = clampIndex(to, total);
    if (target === current) return;
    if (!controlled) setInternal(target);
    emit.current?.(target, target > current ? 1 : -1);
  }, [controlled, current, total]);
  const next = useCallback(() => { if (current >= total - 1) finish.current?.(); else goTo(current + 1); }, [current, goTo, total]);
  const back = useCallback(() => goTo(current - 1), [current, goTo]);

  return { index: current, direction: seen.direction, furthest: Math.min(furthest, Math.max(total - 1, 0)), total, isFirst: current === 0, isLast: current === total - 1, next, back, goTo };
}

export type WizardStep = {
  id: string;
  label: string;
  /** Short line under the title inside the panel. */
  hint?: string;
  content: ReactNode;
  /** Gate for Next. Defaults to true. */
  canAdvance?: boolean;
};

export type WizardStepsProps = {
  steps: WizardStep[];
  index: number;
  onIndexChange: (index: number, direction: WizardDirection) => void;
  railLabel?: string;
  /** Renders the footer actions (put this inside OpsDrawer's `footer`). */
  children?: never;
};

/** Headless-ish: renders rail + panel; footer buttons come from <WizardActions/>. */
export default function WizardSteps({ steps, index, onIndexChange, railLabel = "Steps" }: WizardStepsProps) {
  const total = steps.length;
  const at = clampIndex(index, total);
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const intent = useRef<"list" | "panel" | null>(null);
  const [furthest, setFurthest] = useState(at);
  if (furthest < at) setFurthest(at);
  const direction = useRef<WizardDirection>(1);
  const prev = useRef(at);
  if (prev.current !== at) { direction.current = at > prev.current ? 1 : -1; prev.current = at; }

  useEffect(() => {
    const move = intent.current; intent.current = null;
    if (move === "list") listRef.current?.querySelector<HTMLButtonElement>('button[aria-current="step"]')?.focus();
    if (move === "panel") viewportRef.current?.focus({ preventScroll: true });
  }, [at]);

  const variants = useMemo(() => ({
    enter: (d: WizardDirection) => (reduced ? { opacity: 0 } : { opacity: 0, x: d * 22 }),
    center: reduced ? { opacity: 1 } : { opacity: 1, x: 0 },
    exit: (d: WizardDirection) => (reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: d * -22, transition: EXIT }),
  }), [reduced]);

  const onRailKey = (e: KeyboardEvent<HTMLElement>) => {
    let t = at;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") t = at + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") t = at - 1;
    else if (e.key === "Home") t = 0;
    else if (e.key === "End") t = furthest;
    else return;
    e.preventDefault();
    t = Math.min(clampIndex(t, total), furthest);
    if (t === at) return;
    intent.current = "list";
    onIndexChange(t, t > at ? 1 : -1);
  };

  const step = steps[at];
  if (!step) return null;
  const position = `Step ${at + 1} of ${total}: ${step.label}`;

  return (
    <div className={s.wiz}>
      <p aria-live="polite" className={s.srOnly}>{position}</p>
      <ol ref={listRef} aria-label={railLabel} className={s.wizRail}>
        {steps.map((st, i) => {
          const done = i < at, here = i === at, reachable = i <= furthest;
          const tile = (
            <motion.span aria-hidden className={s.wizTile} data-state={done ? "done" : here ? "current" : "todo"}
              initial={false} animate={{ scale: here ? 1 : 0.92 }} transition={reduced ? { duration: 0 } : RAIL}>
              {done ? <Check size={13} strokeWidth={2.5} /> : i + 1}
            </motion.span>
          );
          return (
            <li key={st.id} className={s.wizItem}>
              {reachable ? (
                <button type="button" className={s.wizTileBtn} aria-current={here ? "step" : undefined} tabIndex={here ? 0 : -1}
                  aria-label={`Step ${i + 1} of ${total}: ${st.label}`} onKeyDown={onRailKey}
                  onClick={() => { if (!here) { intent.current = "list"; onIndexChange(i, i > at ? 1 : -1); } }}>
                  {tile}
                </button>
              ) : (
                <span className={s.wizTileBtn}><span className={s.srOnly}>{`Step ${i + 1} of ${total}: ${st.label}`}</span>{tile}</span>
              )}
              {i < total - 1 ? (
                <span aria-hidden className={s.wizTrack}>
                  <motion.span className={s.wizTrackFill} initial={false} animate={{ scaleX: done ? 1 : 0 }} transition={reduced ? { duration: 0 } : RAIL} />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div ref={viewportRef} tabIndex={-1} role="group" aria-label={position} className={s.wizViewport}>
        <AnimatePresence initial={false} custom={direction.current} mode="wait">
          <motion.div key={step.id} custom={direction.current} variants={variants} initial="enter" animate="center" exit="exit"
            transition={reduced ? { duration: 0 } : PANEL} className={s.wizPanel}>
            <h3 className={s.wizStepTitle}>{step.label}</h3>
            {step.hint ? <p className={s.help}>{step.hint}</p> : null}
            <div className={s.wizStepBody}>{step.content}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Footer actions — render inside OpsDrawer `footer`. Pass `submitForm` on the last step to submit a form by id. */
export function WizardActions({ index, steps, onIndexChange, submitFormId, finishLabel = "Create" }: {
  index: number; steps: WizardStep[]; onIndexChange: (i: number, d: WizardDirection) => void; submitFormId?: string; finishLabel?: string;
}) {
  const at = clampIndex(index, steps.length);
  const isFirst = at === 0, isLast = at === steps.length - 1;
  const can = steps[at]?.canAdvance ?? true;
  return (
    <>
      {!isFirst && <button type="button" className={`${s.btn} ${s.btnSecondary}`} onClick={() => onIndexChange(at - 1, -1)}>Back</button>}
      <span className={s.meta} style={{ marginRight: "auto" }}>{at + 1} / {steps.length}</span>
      {isLast ? (
        <button type="submit" form={submitFormId} disabled={!can} className={`${s.btn} ${s.btnPrimary}`}>{finishLabel}</button>
      ) : (
        <button type="button" disabled={!can} className={`${s.btn} ${s.btnPrimary}`} onClick={() => onIndexChange(at + 1, 1)}>Next</button>
      )}
    </>
  );
}
```

### `src/app/ops/proposals/NewProposalWizard.tsx` (replaces `NewProposalForm.tsx`)

```tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import OpsDrawer from "@/components/ops/ui/OpsDrawer";
import WizardSteps, { WizardActions, type WizardStep } from "@/components/ops/ui/WizardSteps";
import { createProposalAction } from "./actions";
import s from "@/components/ops/ui/ops-ui.module.css";

export interface OrgOpt { id: string; name: string }
export interface ProjectOpt { id: string; name: string; org_id: string | null }
export interface ContactOpt { id: string; organization_id: string; label: string }

const FORM_ID = "new-proposal";

export default function NewProposalWizard({ orgs, projects, contacts }: { orgs: OrgOpt[]; projects: ProjectOpt[]; contacts: ContactOpt[] }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"client_configured" | "admin_built">("client_configured");
  const [orgId, setOrgId] = useState(orgs[0]?.id ?? "");
  const [projectId, setProjectId] = useState("");
  const [contactId, setContactId] = useState("");

  const orgProjects = useMemo(() => projects.filter((p) => p.org_id === orgId), [projects, orgId]);
  const orgContacts = useMemo(() => contacts.filter((c) => c.organization_id === orgId), [contacts, orgId]);
  const validProject = orgProjects.some((p) => p.id === projectId) ? projectId : "";
  const orgName = orgs.find((o) => o.id === orgId)?.name ?? "";
  const projectName = orgProjects.find((p) => p.id === validProject)?.name ?? "";

  const steps: WizardStep[] = [
    { id: "mode", label: "How is this proposal built?", hint: "Decides who adds the line items.", content: (
        <div className={s.choiceList} role="radiogroup" aria-label="Build mode">
          {([["client_configured", "The client builds it", "Guided menu configurator, then PODOS reviews."], ["admin_built", "PODOS builds it", "You add the line items; the client reviews and signs."]] as const).map(([v, t, d]) => (
            <label key={v} className={s.choice} data-checked={mode === v || undefined}>
              <input type="radio" name="mode-pick" value={v} checked={mode === v} onChange={() => setMode(v)} className={s.srOnly} />
              <span className={s.choiceTitle}>{t}</span><span className={s.help}>{d}</span>
            </label>
          ))}
        </div>
      ) },
    { id: "client", label: "Client", canAdvance: !!orgId, content: (
        <label className={s.fieldLabel}><span className={s.label}>Client</span>
          <select className={s.field} value={orgId} onChange={(e) => { setOrgId(e.target.value); setProjectId(""); setContactId(""); }}>
            {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </label>
      ) },
    { id: "project", label: "Project", canAdvance: !!validProject, hint: orgProjects.length === 0 ? "This client has no project yet." : undefined, content: (
        orgProjects.length === 0
          ? <Link href={`/ops/clients/${orgId}`} className={`${s.btn} ${s.btnSecondary}`}>Add a project to {orgName}</Link>
          : <label className={s.fieldLabel}><span className={s.label}>Project</span>
              <select className={s.field} value={validProject} onChange={(e) => setProjectId(e.target.value)}>
                <option value="" disabled>Choose a project…</option>
                {orgProjects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
      ) },
    { id: "contact", label: "Primary contact", hint: "Optional. Only contacts with an email can be invited later.", content: (
        <label className={s.fieldLabel}><span className={s.label}>Contact</span>
          <select className={s.field} value={contactId} onChange={(e) => setContactId(e.target.value)}>
            <option value="">None yet</option>
            {orgContacts.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </label>
      ) },
    { id: "review", label: "Review", canAdvance: !!orgId && !!validProject, content: (
        <form id={FORM_ID} action={createProposalAction} className={s.reviewList}>
          <input type="hidden" name="mode" value={mode} />
          <input type="hidden" name="orgId" value={orgId} />
          <input type="hidden" name="projectId" value={validProject} />
          <input type="hidden" name="contactId" value={contactId} />
          <dl className={s.reviewGrid}>
            <dt className={s.label}>Build</dt><dd>{mode === "admin_built" ? "PODOS builds" : "Client builds"}</dd>
            <dt className={s.label}>Client</dt><dd>{orgName}</dd>
            <dt className={s.label}>Project</dt><dd>{projectName}</dd>
            <dt className={s.label}>Contact</dt><dd>{orgContacts.find((c) => c.id === contactId)?.label ?? "—"}</dd>
          </dl>
        </form>
      ) },
  ];

  if (orgs.length === 0) {
    return <Link href="/ops/clients" className={`${s.btn} ${s.btnPrimary}`}>Add the first client</Link>;
  }

  return (
    <>
      <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={() => { setStep(0); setOpen(true); }}>
        <FilePlus2 size={16} strokeWidth={1.75} aria-hidden /> New proposal
      </button>
      <OpsDrawer open={open} onOpenChange={setOpen} title="New proposal" description="Every proposal belongs to a client's project. Five short steps."
        footer={<WizardActions index={step} steps={steps} onIndexChange={(i) => setStep(i)} submitFormId={FORM_ID} finishLabel="Create proposal" />}>
        <WizardSteps steps={steps} index={step} onIndexChange={(i) => setStep(i)} />
      </OpsDrawer>
    </>
  );
}
```

On `/ops/proposals/page.tsx`: replace the `<NewProposalForm …/>` block with `<NewProposalWizard …/>` and move it into `OpsShell`'s `actions` slot (the page-header right actions) — same props, no data change. `createProposalAction` already reads `mode/orgId/projectId/contactId` from `FormData`.

### CSS (append to `ops-ui.module.css`)

```css
/* ---------- wizard ---------- */
.wiz { display: grid; gap: 20px; }
.wizRail { list-style: none; display: flex; align-items: center; gap: 6px; padding: 0; margin: 0; }
.wizItem { display: flex; align-items: center; gap: 6px; flex: 1; }
.wizItem:last-child { flex: 0 0 auto; }
.wizTileBtn { display: inline-flex; border-radius: 10px; background: none; border: 0; padding: 0; cursor: pointer; outline: none; }
.wizTileBtn:focus-visible { box-shadow: var(--ops-focus); }
span.wizTileBtn { cursor: default; }
.wizTile {
  display: grid; place-items: center; width: 28px; height: 28px; border-radius: 9px;
  font-family: var(--font-display); font-size: 12px; font-weight: 650; font-variant-numeric: tabular-nums;
  border: 1px solid var(--ops-border-strong); background: var(--ops-surface); color: var(--ops-ink-muted);
  transition: background-color var(--ops-dur) var(--ops-ease), color var(--ops-dur) var(--ops-ease), border-color var(--ops-dur) var(--ops-ease);
}
.wizTile[data-state="current"] { color: var(--ops-cobalt-deep); border-color: var(--ops-cobalt); background: var(--ops-surface-selected); box-shadow: var(--ops-shadow-sm); }
.wizTile[data-state="done"] { color: #fff; border-color: transparent; background: var(--ops-gradient-primary); }
.wizTrack { position: relative; flex: 1; height: 3px; border-radius: 2px; background: var(--ops-surface-selected); overflow: hidden; }
.wizTrackFill { position: absolute; inset: 0; transform-origin: left; border-radius: 2px; background: var(--ops-gradient-primary); }
.wizViewport { position: relative; min-height: 220px; border-radius: var(--ops-r-16); border: 1px solid var(--ops-border); background: var(--ops-surface); box-shadow: var(--ops-shadow-sm); outline: none; overflow: hidden; }
.wizViewport:focus-visible { border-color: var(--ops-cobalt); box-shadow: var(--ops-focus); }
.wizPanel { padding: var(--ops-pad-card); display: grid; gap: 8px; }
.wizStepTitle { font-family: var(--font-display); font-size: 17px; line-height: 22px; font-weight: 700; letter-spacing: -.01em; color: var(--ops-ink); }
.wizStepBody { margin-top: 10px; display: grid; gap: 14px; }

.choiceList { display: grid; gap: 10px; }
.choice { display: grid; gap: 4px; padding: 16px 18px; border-radius: var(--ops-r-16); border: 1px solid var(--ops-border-strong); background: var(--ops-surface); cursor: pointer; transition: border-color var(--ops-dur) var(--ops-ease), background-color var(--ops-dur) var(--ops-ease), box-shadow var(--ops-dur) var(--ops-ease); }
.choice:hover { background: var(--ops-surface-soft); }
.choice[data-checked] { border-color: var(--ops-cobalt); background: var(--ops-surface-selected); box-shadow: var(--ops-shadow-sm); }
.choice:has(:focus-visible) { box-shadow: var(--ops-focus); }
.choiceTitle { font-family: var(--font-body); font-size: 15px; font-weight: 650; color: var(--ops-ink); }
.reviewList { display: grid; gap: 12px; }
.reviewGrid { display: grid; grid-template-columns: max-content 1fr; column-gap: 20px; row-gap: 10px; align-items: baseline; font-family: var(--font-body); font-size: 14.5px; font-weight: 550; color: var(--ops-ink); }
.reviewGrid dd { margin: 0; }

@media (max-width: 719px) {
  .wizTrack { display: none; }
  .wizRail { gap: 8px; }
  .wizItem { flex: 0 0 auto; }
  .reviewGrid { grid-template-columns: 1fr; row-gap: 4px; }
  .reviewGrid dd { margin-bottom: 8px; }
}
```

**Accessibility:** rail is an ordered list of real buttons; only reached steps are focusable (unreached are inert spans with visually-hidden text); `aria-current="step"`; Arrow/Home/End clamped to the furthest reached step; live region announces "Step n of N: label" on every change; after keyboard navigation focus lands on the current rail tile, after Next/Back on the panel group; Next is `disabled` (not hidden) until the step validates, and the last step's button is a native `type="submit"` bound via `form=` so the server action runs with progressive enhancement; the mode choice cards are real radios in a `radiogroup` with `:has(:focus-visible)` rings — no hover-only state.
**Responsive:** in the 560px drawer the rail is five 28px tiles with gradient connectors; under 720px connectors hide and tiles pack left, review grid stacks, actions live in the sticky drawer footer so they never scroll away. Panel height is content-driven; the drawer body scrolls.

---

## 3 · List toolbar — `ListToolbar` + `Segmented`

**Job:** one bar above every list page that lets an operator search, filter, switch saved view, sort, change density and layout, and see the result count — with the state living in the URL so the server-rendered list re-queries and links stay shareable.

### Candidates

| | 19516 cnippet **Toolbar** (Base UI) | 22162 felipemenezes098 **Table with Filters** | 23552 ddoemonn **Segmented Control** |
|---|---|---|---|
| Deps | `@base-ui-components/react` | `@tanstack/react-table`, `@radix-ui/react-select` | none (motion) |
| What it actually is | thin wrappers over Base UI Toolbar (roving tabindex); no search/filter/sort/view logic of its own | a client-side TanStack table with an input + status Select; filtering happens in the browser | `role=radiogroup` of `role=radio` buttons with Arrow/Home/End, sliding thumb (`useMotionValue` + masked label track), reduced-motion aware |
| Fit to job | wrong altitude — the job is the composition, not the focus model; and a new dep for one bar | wrong architecture — our lists are server components reading Supabase; filter state must be URL/query, not in-memory rows | right piece for saved views / density / layout switches |

**Recommendation: focused custom build for the bar, with 23552 adopted for its three segmented switches.** Neither toolbar candidate models the job (server-side list + URL state). The bar is a native `<form method="get">` — every control is a real form control, so the page's `searchParams` is the single source of truth, it works before hydration, and the only JavaScript is "submit on change" plus a 250 ms search debounce.

**Kept (23552):** the radiogroup/radio contract, Arrow-key traversal semantics, animated thumb with `useReducedMotion`, controlled/uncontrolled value.
**Changed:** `role=radio` buttons → real `<input type="radio">` (native arrow keys, native form participation, no `onKeyDown` code at all); the masked double-label thumb trick → one `layoutId` thumb behind the checked label (half the DOM); icon options for density/layout with visually-hidden labels; stone/`#4568FF` palette → ops tokens; hover-tinting state removed (CSS `:hover` handles it).

### `src/components/ops/ui/Segmented.tsx`

```tsx
"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import s from "./ops-ui.module.css";

export type SegmentedOption = { value: string; label: string; icon?: ReactNode; disabled?: boolean };

export default function Segmented({ name, label, options, value, defaultValue, onChange, iconOnly = false }: {
  name: string; label: string; options: SegmentedOption[];
  value?: string; defaultValue?: string; onChange?: (value: string) => void; iconOnly?: boolean;
}) {
  const uid = useId();
  const reduced = useReducedMotion();
  const current = value ?? defaultValue ?? options[0]?.value;
  return (
    <fieldset className={s.seg} data-icon-only={iconOnly || undefined}>
      <legend className={s.srOnly}>{label}</legend>
      {options.map((o) => {
        const checked = o.value === current;
        return (
          <label key={o.value} className={s.segItem} data-checked={checked || undefined} title={iconOnly ? o.label : undefined}>
            <input type="radio" name={name} value={o.value} className={s.srOnly}
              checked={value !== undefined ? checked : undefined} defaultChecked={value === undefined ? checked : undefined}
              disabled={o.disabled} onChange={() => onChange?.(o.value)} />
            {checked && <motion.span aria-hidden className={s.segThumb} layoutId={`${uid}-thumb`} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 34, mass: 0.45 }} />}
            {o.icon ? <span className={s.segIcon} aria-hidden>{o.icon}</span> : null}
            <span className={iconOnly ? s.srOnly : s.segLabel}>{o.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
```

### `src/components/ops/ui/ListToolbar.tsx`

```tsx
"use client";

import { useRef } from "react";
import { AlignJustify, LayoutGrid, Rows3, Search, SlidersHorizontal, StretchHorizontal } from "lucide-react";
import Segmented from "./Segmented";
import s from "./ops-ui.module.css";

export type ToolbarState = { q?: string; view?: string; status?: string[]; sort?: string; density?: "comfortable" | "compact"; layout?: "rows" | "cards" };

export type ListToolbarProps = {
  action: string;                                   // the list route, e.g. "/ops/proposals"
  state: ToolbarState;                              // parsed from the page's searchParams
  total: number;                                    // rows after filtering (server-computed)
  views: { value: string; label: string }[];        // saved views
  statuses: { value: string; label: string }[];     // filter chips
  sorts: { value: string; label: string }[];
  searchPlaceholder?: string;
};

export default function ListToolbar({ action, state, total, views, statuses, sorts, searchPlaceholder = "Search" }: ListToolbarProps) {
  const form = useRef<HTMLFormElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submit = () => form.current?.requestSubmit();
  const debounced = () => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(submit, 250); };
  const active = state.status?.length ?? 0;

  return (
    <form ref={form} method="get" action={action} role="search" aria-label="List controls" className={s.tb} onChange={(e) => { if ((e.target as HTMLElement).tagName !== "INPUT" || (e.target as HTMLInputElement).type !== "search") submit(); }}>
      <label className={s.tbSearch}>
        <Search size={16} strokeWidth={1.75} aria-hidden className={s.tbSearchIcon} />
        <span className={s.srOnly}>{searchPlaceholder}</span>
        <input type="search" name="q" defaultValue={state.q ?? ""} placeholder={searchPlaceholder} className={`${s.field} ${s.tbSearchInput}`} onInput={debounced} enterKeyHint="search" />
      </label>

      <details className={s.tbFilters}>
        <summary className={`${s.btn} ${s.btnSecondary} ${s.tbSummary}`}>
          <SlidersHorizontal size={16} strokeWidth={1.75} aria-hidden /> Filters{active ? <span className={s.tbCount}>{active}</span> : null}
        </summary>
        <fieldset className={s.tbPop}>
          <legend className={s.label}>Status</legend>
          <div className={s.chipWrap}>
            {statuses.map((st) => (
              <label key={st.value} className={s.chipToggle} data-status={st.value}>
                <input type="checkbox" name="status" value={st.value} defaultChecked={state.status?.includes(st.value)} className={s.srOnly} />
                <span>{st.label}</span>
              </label>
            ))}
          </div>
          <a href={action} className={`${s.btn} ${s.btnGhost}`} style={{ justifySelf: "start" }}>Clear all</a>
        </fieldset>
      </details>

      <Segmented name="view" label="Saved view" options={views} defaultValue={state.view ?? views[0]?.value} />

      <label className={s.tbSort}>
        <span className={s.srOnly}>Sort by</span>
        <select name="sort" defaultValue={state.sort ?? sorts[0]?.value} className={`${s.field} ${s.tbSelect}`}>
          {sorts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>

      <div className={s.tbRight}>
        <Segmented name="density" label="Row density" iconOnly defaultValue={state.density ?? "comfortable"} options={[
          { value: "comfortable", label: "Comfortable rows", icon: <StretchHorizontal size={16} strokeWidth={1.75} /> },
          { value: "compact", label: "Compact rows", icon: <AlignJustify size={16} strokeWidth={1.75} /> },
        ]} />
        <Segmented name="layout" label="Layout" iconOnly defaultValue={state.layout ?? "rows"} options={[
          { value: "rows", label: "Rows", icon: <Rows3 size={16} strokeWidth={1.75} /> },
          { value: "cards", label: "Cards", icon: <LayoutGrid size={16} strokeWidth={1.75} /> },
        ]} />
        <output aria-live="polite" className={s.tbTotal}>{total.toLocaleString("en-US")} {total === 1 ? "result" : "results"}</output>
      </div>
      <noscript><button type="submit" className={`${s.btn} ${s.btnSecondary}`}>Apply</button></noscript>
    </form>
  );
}
```

Server side (`page.tsx`): `const sp = await searchParams;` → build `ToolbarState` (`status` via `getAll`-style: `Array.isArray(sp.status) ? sp.status : sp.status ? [sp.status] : []`), pass it to both the query and `<ListToolbar state=… total={rows.length} …/>`. Density and layout are read by the list renderer (`data-density`, rows vs. entity-card grid).

### CSS (append to `ops-ui.module.css`)

```css
/* ---------- segmented ---------- */
.seg { display: inline-grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 2px; padding: 3px; margin: 0; border: 1px solid var(--ops-border); border-radius: var(--ops-r-12); background: var(--ops-surface-soft); min-width: 0; }
.segItem { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 36px; padding: 0 12px; border-radius: 9px; cursor: pointer; font-family: var(--font-body); font-size: 13.5px; font-weight: 600; color: var(--ops-ink-secondary); white-space: nowrap; user-select: none; transition: color var(--ops-dur) var(--ops-ease); }
.segItem:hover { color: var(--ops-ink); }
.segItem[data-checked] { color: var(--ops-cobalt-deep); }
.segItem:has(:focus-visible) { box-shadow: var(--ops-focus); }
.segItem:has(:disabled) { opacity: .45; cursor: not-allowed; }
.segThumb { position: absolute; inset: 0; border-radius: 9px; background: var(--ops-surface); border: 1px solid var(--ops-border-strong); box-shadow: var(--ops-shadow-sm); }
.segIcon, .segLabel { position: relative; z-index: 1; display: inline-flex; align-items: center; }
.seg[data-icon-only] .segItem { width: 40px; padding: 0; }

/* ---------- toolbar ---------- */
.tb { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; padding: 12px 14px; border-radius: var(--ops-r-16); border: 1px solid var(--ops-border); background: var(--ops-surface); box-shadow: var(--ops-shadow-sm); }
.tbSearch { position: relative; flex: 1 1 260px; min-width: 200px; display: block; }
.tbSearchIcon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--ops-ink-muted); pointer-events: none; }
.tbSearchInput { padding-left: 40px; }
.tbFilters { position: relative; }
.tbSummary { list-style: none; min-height: 44px; }
.tbSummary::-webkit-details-marker { display: none; }
.tbFilters[open] .tbSummary { border-color: var(--ops-cobalt); background: var(--ops-surface-selected); }
.tbCount { display: inline-grid; place-items: center; min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px; background: var(--ops-cobalt); color: #fff; font-family: var(--font-display); font-size: 11px; font-variant-numeric: tabular-nums; }
.tbPop { position: absolute; top: calc(100% + 8px); left: 0; z-index: 30; min-width: 320px; display: grid; gap: 12px; padding: 18px; margin: 0; border: 1px solid var(--ops-border); border-radius: var(--ops-r-16); background: var(--ops-surface); box-shadow: var(--ops-shadow-md); }
.chipWrap { display: flex; flex-wrap: wrap; gap: 8px; }
.chipToggle { display: inline-flex; align-items: center; min-height: 32px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--ops-border-strong); background: var(--ops-surface); font-family: var(--font-body); font-size: 12.5px; font-weight: 600; color: var(--ops-ink-secondary); cursor: pointer; transition: background-color var(--ops-dur) var(--ops-ease), color var(--ops-dur) var(--ops-ease), border-color var(--ops-dur) var(--ops-ease); }
.chipToggle:hover { background: var(--ops-surface-soft); }
.chipToggle:has(:checked) { background: var(--ops-surface-selected); border-color: var(--ops-cobalt); color: var(--ops-cobalt-deep); }
.chipToggle:has(:focus-visible) { box-shadow: var(--ops-focus); }
.tbSort { display: block; flex: 0 1 200px; }
.tbSelect { min-height: 44px; padding-right: 36px; appearance: auto; }
.tbRight { display: flex; align-items: center; gap: 10px; margin-left: auto; }
.tbTotal { font-family: var(--font-display); font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--ops-ink-secondary); white-space: nowrap; padding-left: 4px; }

@media (max-width: 899px) {
  .tbSearch { flex-basis: 100%; }
  .tbRight { margin-left: 0; flex-basis: 100%; justify-content: space-between; }
  .tbPop { left: auto; right: 0; min-width: min(320px, calc(100vw - 48px)); }
}
```

**Accessibility:** the bar is a `role="search"` landmark form; every control is a native input/select/radio/checkbox with a visible or visually-hidden label (icon-only segments also carry `title`); filter chips are checkboxes so they announce state; the result count is an `<output aria-live="polite">`; `<noscript>` gives an Apply button; `<details>` is keyboard-openable without JavaScript. Roving-tabindex (`role=toolbar`) was deliberately **not** used: mixed native controls with their own arrow-key models (radios, select) are better served by ordinary Tab order.
**Responsive:** desktop is one row (search grows, right cluster pinned); under 900px search takes the full first row, the density/layout/count cluster becomes its own row, the filter popover right-aligns and caps at viewport width. Touch targets are 44px (fields, summary) and 40px (icon segments).

---

## 4 · Tabs — `Tabs` / `TabPanel`

**Job:** switch between sibling views of one entity (proposal detail: Overview · Line items · Access · Activity) without a route change, with a sliding underline that tells the eye where it is.

### Candidates

| | 24930 educalvolpz **Animated Tabs** | 24956 cnippet **Underline Tabs** | 18143 unlumen **Highlight** (metadata only) |
|---|---|---|---|
| Deps | none (motion, `cn`) | `@radix-ui/react-tabs`, `@radix-ui/react-slot`, `@radix-ui/react-label`, cva | none |
| Semantics | `role=tablist/tab`, `aria-selected`, roving tabindex, Arrow/Home/End — **but no panels/`aria-controls`** | full Radix tabs incl. panels | a hover-tracking highlight, not tabs |
| Motion | `layoutId` indicator, `useReducedMotion` | CSS | spring highlight |
| Fit | correct keyboard model, small, easy to finish | four new packages for one component | wrong job |

**Recommendation: 24930**, completed with the panel half it lacks. Radix Tabs would be the "safe" pick but violates the no-new-overlay-library rule for a 60-line component.

**Kept:** tablist/tab roles, controlled/uncontrolled `activeTab`, roving tabindex with Arrow/Home/End (wrapping), `layoutId` indicator with reduced-motion fallback, `useId`-scoped ids.
**Changed:** added `TabPanel` (`role=tabpanel`, `aria-labelledby`, `hidden` when inactive, `tabIndex=0` so the panel is reachable), `aria-controls` on tabs; the pill/segment variants removed (`Segmented` covers that job — one component per job); `cn`/Tailwind → CSS module; indicator is a 2px primary-gradient bar; optional count badge per tab (Geist tabular); tab type 14/w600, 44px hit height; overflow-x scroll on narrow screens with edge fade.

### `src/components/ops/ui/Tabs.tsx`

```tsx
"use client";

import { createContext, useCallback, useContext, useId, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import s from "./ops-ui.module.css";

type Ctx = { uid: string; active: string };
const TabsCtx = createContext<Ctx | null>(null);

export type TabItem = { id: string; label: string; icon?: ReactNode; count?: number };

export function Tabs({ tabs, activeTab, defaultTab, onChange, label = "Sections", children }: {
  tabs: TabItem[]; activeTab?: string; defaultTab?: string; onChange?: (id: string) => void; label?: string; children: ReactNode;
}) {
  const uid = useId();
  const reduced = useReducedMotion();
  const [internal, setInternal] = useState(defaultTab ?? tabs[0]?.id ?? "");
  const active = activeTab ?? internal;

  const select = useCallback((id: string) => { if (activeTab === undefined) setInternal(id); onChange?.(id); }, [activeTab, onChange]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const n = tabs.length;
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    const t = tabs[next];
    if (!t) return;
    select(t.id);
    document.getElementById(`${uid}-tab-${t.id}`)?.focus();
  };

  return (
    <TabsCtx.Provider value={{ uid, active }}>
      <div role="tablist" aria-label={label} className={s.tabs}>
        {tabs.map((t, i) => {
          const on = t.id === active;
          return (
            <button key={t.id} type="button" role="tab" id={`${uid}-tab-${t.id}`} aria-selected={on} aria-controls={`${uid}-panel-${t.id}`}
              tabIndex={on ? 0 : -1} className={s.tab} data-active={on || undefined} onClick={() => select(t.id)} onKeyDown={(e) => onKeyDown(e, i)}>
              {t.icon ? <span className={s.tabIcon} aria-hidden>{t.icon}</span> : null}
              <span>{t.label}</span>
              {typeof t.count === "number" ? <span className={s.tabCount}>{t.count.toLocaleString("en-US")}</span> : null}
              {on && <motion.span aria-hidden className={s.tabIndicator} layoutId={`${uid}-ind`} transition={reduced ? { duration: 0 } : { type: "spring", bounce: 0.05, duration: 0.25 }} />}
            </button>
          );
        })}
      </div>
      {children}
    </TabsCtx.Provider>
  );
}

export function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("TabPanel must be inside <Tabs>");
  const on = ctx.active === id;
  return (
    <div role="tabpanel" id={`${ctx.uid}-panel-${id}`} aria-labelledby={`${ctx.uid}-tab-${id}`} hidden={!on} tabIndex={0} className={s.tabPanel}>
      {on ? children : null}
    </div>
  );
}
```

Usage: `<Tabs tabs={[{id:"overview",label:"Overview"},{id:"items",label:"Line items",count:12},{id:"access",label:"Secure access"}]}> <TabPanel id="overview">…</TabPanel> … </Tabs>`. For **route-level** section switching (e.g. `/ops/proposals` ↔ `/ops/clients`) use plain `<nav>` links with `aria-current="page"` — those are pages, not tabs.

### CSS (append to `ops-ui.module.css`)

```css
/* ---------- tabs ---------- */
.tabs { position: relative; display: flex; gap: 4px; border-bottom: 1px solid var(--ops-border); overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; mask-image: linear-gradient(90deg, #000 calc(100% - 24px), transparent); }
.tabs::-webkit-scrollbar { display: none; }
.tab { position: relative; display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 14px; border: 0; background: none; cursor: pointer; border-radius: 10px 10px 0 0; font-family: var(--font-body); font-size: 14px; font-weight: 600; color: var(--ops-ink-secondary); white-space: nowrap; transition: color var(--ops-dur) var(--ops-ease), background-color var(--ops-dur) var(--ops-ease); }
.tab:hover { color: var(--ops-ink); background: var(--ops-surface-soft); }
.tab[data-active] { color: var(--ops-cobalt-deep); }
.tab:focus-visible { outline: none; box-shadow: var(--ops-focus); }
.tabIcon { display: inline-flex; color: currentColor; }
.tabCount { display: inline-grid; place-items: center; min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px; background: var(--ops-surface-selected); color: var(--ops-cobalt-deep); font-family: var(--font-display); font-size: 11px; font-weight: 650; font-variant-numeric: tabular-nums; }
.tabIndicator { position: absolute; left: 10px; right: 10px; bottom: -1px; height: 2px; border-radius: 2px; background: var(--ops-gradient-primary); }
.tabPanel { padding-top: var(--ops-gap-section); outline: none; }
.tabPanel:focus-visible { box-shadow: var(--ops-focus); border-radius: var(--ops-r-12); }
```

**Accessibility:** WAI-ARIA tabs pattern in full — `tablist` → `tab` (`aria-selected`, `aria-controls`, roving tabindex, Arrow/Home/End with wrap) → `tabpanel` (`aria-labelledby`, `hidden`, focusable). Selection follows focus (automatic activation), which is correct for lightweight in-memory panels. Indicator motion is decorative and collapses under reduced motion.
**Responsive:** tablist scrolls horizontally with a right edge fade when tabs overflow (no wrapping, no truncation of labels); 44px hit height throughout.

---

## 5 · Command search — `CommandSearch`

**Job:** from anywhere in `/ops`, press ⌘K / Ctrl K, type a few letters, and jump to a proposal, client, project or module, or run a primary action (New proposal, Invite contact) — keyboard-first, mouse-friendly, never exposing tokens or raw links.

### Candidates

| | 23522 ddoemonn **Command Palette** | 382 Origin UI **Command** | 5530 lovesickfromthe6ix **Omni Command Palette** (metadata only) |
|---|---|---|---|
| Deps | none (motion) | `cmdk`, `@radix-ui/react-dialog`, `@radix-ui/react-icons` | unknown; async sources, recents, presets |
| Semantics | `input role=combobox aria-expanded aria-controls aria-activedescendant aria-autocomplete=list` → `ul role=listbox` / `li role=option aria-selected`; `role=status` live count (debounced 400 ms) | cmdk does the same internally | — |
| Ranking | own `rank()`: subsequence match, streak + word-boundary bonuses, keyword aliases, length penalty; deterministic tie-break | cmdk's command-score | fuzzy + highlighting |
| Overlay | portal, Escape captured at document level, scroll-lock with gutter, spring scale/opacity, `useReducedMotion` | Radix Dialog | — |
| Fit | everything readable in one file; groups are the only missing feature | two more libraries; `DialogTitle` hacks to silence warnings | more than the job needs |

**Recommendation: 23522.** Same author and motion vocabulary as the drawer/wizard/segmented switches; zero deps; the combobox/listbox contract is already correct. cmdk is a fine library, but it would be the only third-party overlay primitive in the codebase — for one palette.

**Kept:** `rank()` scoring, `useCommandPalette` (active id pinning, wrap-around Arrow keys, Home/End, Enter, Escape, pointer-move activation that ignores stationary pointers, `scrollTop` reveal), combobox/listbox ARIA, debounced live status, portal layer with document-level Escape and scroll lock, spring entrance with reduced-motion bypass.
**Changed:** fixed-row-height geometry (`ROW/GAP/PAD` maths) → `max-height` + normal flow; grouped results (`group` field → visually-hidden `role=group` labelling, "Navigate · Proposals · Clients · Actions"); hand-drawn search SVG → lucide `Search`; `font-mono` shortcut keys → Geist tabular `.kbd`; stone palette → ops tokens, panel radius 20, shadow-active, scrim ink 32 %; sits at 12vh from the top (not centred) so the list can grow downward; global ⌘K/Ctrl K hotkey hook exported; items carry `href` **or** `run`, selection navigates via `next/navigation` router; `hint` renders entity metadata (status chip text, client) in Geist 12 tabular.

### `src/components/ops/ui/CommandSearch.tsx`

```tsx
"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search } from "lucide-react";
import s from "./ops-ui.module.css";

export type CommandItem = {
  id: string; label: string; group: string;
  hint?: string; keywords?: string; shortcut?: string[];
  href?: string; run?: () => void;
};

const BOUNDARY = /[\s\-_/.:#]/;
function scoreOne(text: string, q: string) {
  const t = text.toLowerCase(); let cursor = 0, total = 0, streak = 0;
  for (let i = 0; i < q.length; i++) {
    const at = t.indexOf(q[i], cursor); if (at < 0) return -1;
    streak = at === cursor && i > 0 ? streak + 1 : 0; total += 2 + streak * 4;
    if (at === 0) total += 12; else if (BOUNDARY.test(t[at - 1])) total += 8;
    cursor = at + 1;
  }
  return total;
}
export function rank(items: CommandItem[], query: string) {
  const q = query.trim().toLowerCase(); if (!q) return items;
  const out: { item: CommandItem; score: number; order: number }[] = [];
  items.forEach((item, order) => {
    const direct = scoreOne(item.label, q);
    const aliased = item.keywords ? scoreOne(item.keywords, q) - 3 : -1;
    const best = Math.max(direct, aliased); if (best < 0) return;
    out.push({ item, score: best - item.label.length * 0.05, order });
  });
  return out.sort((a, b) => b.score - a.score || a.order - b.order).map((x) => x.item);
}

/** ⌘K / Ctrl K toggles; returns [open, setOpen]. */
export function useCommandHotkey(): [boolean, (v: boolean) => void] {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen((o) => !o); } };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return [open, setOpen];
}

export default function CommandSearch({ open, onOpenChange, items, placeholder = "Search proposals, clients, projects…", label = "Command search", emptyLabel = "Nothing matches" }: {
  open: boolean; onOpenChange: (open: boolean) => void; items: CommandItem[]; placeholder?: string; label?: string; emptyLabel?: string;
}) {
  const uid = useId();
  const router = useRouter();
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [pinned, setPinned] = useState<string | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
  const pointer = useRef({ x: -1, y: -1 });

  const results = useMemo(() => rank(items, query), [items, query]);
  const activeId = results.some((r) => r.id === pinned) ? pinned : (results[0]?.id ?? null);
  const groups = useMemo(() => { const m = new Map<string, CommandItem[]>(); for (const r of results) m.set(r.group, [...(m.get(r.group) ?? []), r]); return [...m]; }, [results]);

  useEffect(() => setHost(document.body), []);
  useEffect(() => { if (open) { setQuery(""); setPinned(null); requestAnimationFrame(() => inputRef.current?.focus()); } }, [open]);
  useEffect(() => { if (listRef.current) listRef.current.scrollTop = 0; }, [query]);
  useEffect(() => {
    const t = setTimeout(() => { if (liveRef.current) liveRef.current.textContent = results.length === 0 ? emptyLabel : `${results.length} ${results.length === 1 ? "result" : "results"}`; }, 400);
    return () => clearTimeout(t);
  }, [results.length, emptyLabel]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); onOpenChange(false); } };
    document.addEventListener("keydown", esc, true);
    const root = document.documentElement; const prev = { o: root.style.overflow, p: root.style.paddingRight };
    const gutter = window.innerWidth - root.clientWidth; root.style.overflow = "hidden"; if (gutter > 0) root.style.paddingRight = `${gutter}px`;
    return () => { document.removeEventListener("keydown", esc, true); root.style.overflow = prev.o; root.style.paddingRight = prev.p; };
  }, [open, onOpenChange]);

  const reveal = (id: string) => listRef.current?.querySelector<HTMLElement>(`[id="${uid}-${id}"]`)?.scrollIntoView({ block: "nearest" });
  const move = (delta: number) => {
    if (!results.length) return;
    const i = Math.max(0, results.findIndex((r) => r.id === activeId));
    const n = results[(i + delta + results.length) % results.length]; setPinned(n.id); reveal(n.id);
  };
  const run = (item?: CommandItem) => {
    const target = item ?? results.find((r) => r.id === activeId); if (!target) return;
    onOpenChange(false);
    if (target.run) target.run(); else if (target.href) router.push(target.href);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Home") { e.preventDefault(); if (results[0]) { setPinned(results[0].id); reveal(results[0].id); } }
    else if (e.key === "End") { e.preventDefault(); const l = results[results.length - 1]; if (l) { setPinned(l.id); reveal(l.id); } }
    else if (e.key === "Enter") { e.preventDefault(); run(); }
  };

  if (!host) return null;
  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div key="cmd" className={s.cmdLayer} onPointerDown={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}>
          <motion.div aria-hidden className={s.cmdScrim} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={reduced ? { duration: 0 } : { duration: 0.18 }} />
          <motion.div className={s.cmdPanel} role="dialog" aria-modal="true" aria-label={label}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.99 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36, mass: 0.9 }}>
            <div className={s.cmdHead}>
              <Search size={18} strokeWidth={1.75} aria-hidden className={s.cmdIcon} />
              <input ref={inputRef} type="text" role="combobox" aria-label={label} aria-expanded aria-controls={`${uid}-list`} aria-autocomplete="list"
                aria-activedescendant={activeId ? `${uid}-${activeId}` : undefined} autoComplete="off" spellCheck={false}
                value={query} placeholder={placeholder} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown} className={s.cmdInput} />
              <span className={s.kbd} aria-hidden>Esc</span>
            </div>
            <ul ref={listRef} id={`${uid}-list`} role="listbox" aria-label={label} className={s.cmdList} onMouseDown={(e) => e.preventDefault()}>
              {groups.map(([group, rows]) => (
                <li key={group} role="presentation" className={s.cmdGroup}>
                  <span className={s.cmdGroupLabel} aria-hidden>{group}</span>
                  <ul role="group" aria-label={group} className={s.cmdGroupList}>
                    {rows.map((item) => {
                      const active = item.id === activeId;
                      return (
                        <li key={item.id} id={`${uid}-${item.id}`} role="option" aria-selected={active} className={s.cmdRow} data-active={active || undefined}
                          onPointerMove={(e) => { const p = pointer.current; if (e.clientX === p.x && e.clientY === p.y) return; pointer.current = { x: e.clientX, y: e.clientY }; if (!active) setPinned(item.id); }}
                          onClick={() => run(item)}>
                          <span className={s.cmdLabel}>{item.label}</span>
                          {item.hint ? <span className={s.meta}>{item.hint}</span> : null}
                          {item.shortcut ? <span className={s.cmdKeys}>{item.shortcut.map((k) => <kbd key={k} className={s.kbd}>{k}</kbd>)}</span> : null}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
              {results.length === 0 ? <li role="presentation" className={s.cmdEmpty}>{emptyLabel}</li> : null}
            </ul>
            <span ref={liveRef} role="status" aria-live="polite" className={s.srOnly} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    host,
  );
}
```

Wiring: a small client `OpsCommand` mounted once in `OpsShell` — `const [open, setOpen] = useCommandHotkey();` — with a visible trigger button in the top utility bar (`Search` icon + "Search" + `.kbd` ⌘K) and `items` built server-side from the same `listEstimates/listOrganizations/listProjects` data the pages already fetch (labels: `estimate_no · client`, hint: status + project; hrefs: `/ops/proposals/{public_id}`). **Never** put invitation tokens or `/e/{token}` URLs in items — only public ids.

### CSS (append to `ops-ui.module.css`)

```css
/* ---------- command search ---------- */
.cmdLayer { position: fixed; inset: 0; z-index: 70; display: flex; justify-content: center; align-items: flex-start; padding: 12vh 16px 16px; }
.cmdScrim { position: absolute; inset: 0; background: rgba(7, 17, 38, .32); }
.cmdPanel { position: relative; width: 100%; max-width: 640px; display: flex; flex-direction: column; max-height: min(70vh, 640px); overflow: hidden; border-radius: var(--ops-r-20); border: 1px solid var(--ops-border); background: var(--ops-surface); box-shadow: var(--ops-shadow-active); }
.cmdHead { display: flex; align-items: center; gap: 12px; height: 60px; padding: 0 20px; border-bottom: 1px solid var(--ops-border); }
.cmdIcon { color: var(--ops-ink-muted); flex-shrink: 0; }
.cmdInput { flex: 1; min-width: 0; height: 100%; border: 0; background: transparent; outline: none; font-family: var(--font-body); font-size: 16px; color: var(--ops-ink); }
.cmdInput::placeholder { color: var(--ops-ink-muted); }
.cmdList { list-style: none; margin: 0; padding: 8px; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; }
.cmdGroup { list-style: none; padding: 6px 0; }
.cmdGroup + .cmdGroup { border-top: 1px solid var(--ops-border); }
.cmdGroupLabel { display: block; padding: 6px 12px 4px; font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--ops-ink-muted); }
.cmdGroupList { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.cmdRow { display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 12px; border-radius: var(--ops-r-12); cursor: default; transition: background-color var(--ops-dur) var(--ops-ease); }
.cmdRow[data-active] { background: var(--ops-surface-selected); }
.cmdLabel { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--font-body); font-size: 14.5px; font-weight: 600; color: var(--ops-ink); }
.cmdRow[data-active] .cmdLabel { color: var(--ops-cobalt-deep); }
.cmdKeys { display: inline-flex; gap: 4px; margin-left: 8px; }
.cmdEmpty { padding: 28px 12px; text-align: center; font-family: var(--font-body); font-size: 14px; color: var(--ops-ink-secondary); }

@media (max-width: 719px) {
  .cmdLayer { padding: 8px 8px 0; align-items: flex-start; }
  .cmdPanel { max-height: calc(100dvh - 16px); border-radius: var(--ops-r-16); }
  .cmdHead { height: 56px; padding: 0 16px; }
  .cmdInput { font-size: 16px; } /* prevents iOS zoom */
  .cmdRow .meta { display: none; }
}
```

**Accessibility:** editable combobox pattern — `role=combobox` input with `aria-controls`/`aria-activedescendant` over a `role=listbox` of `role=option` rows; groups are `role=group` lists with `aria-label`; result count announced via a debounced `role=status`; Arrow/Home/End/Enter/Escape; pointer highlight only on real pointer movement (no jump when the list scrolls under a still mouse); the trigger button is visible (⌘K is a shortcut, not the only way in). Focus returns to the trigger because the palette unmounts and the document's prior `activeElement` is untouched.
**Responsive:** 640px panel at 12vh on desktop so results grow downward; full-width, top-anchored sheet on phones with `100dvh` cap, 16px input to defeat iOS zoom, hints hidden, 44px rows.

---

## Source log (mirrors `docs/component-sources.md`)

| Project component | 21st search intent | Selected source | Why selected | Dependencies | License/attribution | Major modifications | Status |
|---|---|---|---|---|---|---|---|
| `OpsDrawer` | right side drawer sheet panel slide over | ddoemonn **Drawer** (demo 23558) — https://21st.dev/@ddoemonn/components/drawer | zero deps; `inert` siblings + return-focus + gutter-safe scroll lock in one readable file | motion (installed) | 21st community registry (author ddoemonn) | drag-to-dismiss removed; width 560; CSS module + ops tokens; lucide X; sticky footer slot; full-bleed < 720px | documented, not yet in repo |
| `WizardSteps` / `WizardActions` / `NewProposalWizard` | multi-step form wizard stepper with progress and next back | ddoemonn **Wizard Steps** (demo 23576) — https://21st.dev/@ddoemonn/components/wizard-steps | typed `useWizard` (furthest gating, direction), roving-tabindex rail, live region, reduced-motion variants | motion (installed) | 21st community registry | fixed height removed; actions lifted to drawer footer; `canAdvance` gate; final step is a real `<form action={createProposalAction}>`; cobalt tiles + gradient connectors | documented, not yet in repo |
| `Segmented` | segmented control toggle group icon buttons grid list view switch | ddoemonn **Segmented Control** (demo 23552) — https://21st.dev/@ddoemonn/components/segmented-control | correct radiogroup contract with sliding thumb and reduced motion | motion (installed) | 21st community registry | `role=radio` buttons → native radios (form-GET participation, native arrow keys); single `layoutId` thumb; icon-only mode | documented, not yet in repo |
| `ListToolbar` | data table toolbar search filter sort view toggle · filter bar with filter chips popover and saved views | **custom** (19516 Base UI Toolbar and 22162 TanStack table inspected and rejected: new deps, wrong altitude/architecture for server-rendered URL-state lists) | native `<form method="get" role="search">`; state = `searchParams` | none | — | composed from `Segmented` + native search/select/`<details>`/checkbox chips + `<output>` live count | documented, not yet in repo |
| `Tabs` / `TabPanel` | tabs animated underline indicator | educalvolpz **Animated Tabs** (demo 24930) — https://21st.dev/@educalvolpz/components/animated-tabs | correct tablist keyboard model, `layoutId` indicator, no deps | motion (installed) | 21st community registry | added `TabPanel` + `aria-controls`/`aria-labelledby`; pill/segment variants dropped; count badge; gradient 2px indicator; overflow-x scroll | documented, not yet in repo |
| `CommandSearch` / `useCommandHotkey` | command menu palette search cmdk | ddoemonn **Command Palette** (demo 23522) — https://21st.dev/@ddoemonn/components/command-palette | combobox/listbox ARIA + deterministic ranking + portal layer with no deps (cmdk/Radix rejected) | motion (installed) | 21st community registry | grouped results; `href`/`run` items via `next/navigation`; lucide Search; Geist tabular kbd; top-anchored 12vh; mobile sheet | documented, not yet in repo |

Rejected after source inspection: 25002 shadcnspace Sheet (Radix + cva), 7821 dhileepkumargm Multi-step Wizard (untyped demo), 19516 cnippet Toolbar (Base UI dep), 22162 Table with Filters (TanStack + Radix Select), 24956 cnippet Underline Tabs (4 Radix packages), 382 Origin UI Command (cmdk + Radix Dialog).

## Integration checklist (when authorized)

1. Add the `--ops-*` token block to `:root` in `src/app/globals.css`.
2. Create `src/components/ops/ui/ops-ui.module.css` from the five CSS blocks above (primitives → drawer → wizard → segmented/toolbar → tabs → command).
3. Add the six TSX files under `src/components/ops/ui/` and `src/app/ops/proposals/NewProposalWizard.tsx`; delete `NewProposalForm.tsx`; move the trigger into `OpsShell`'s `actions` slot.
4. `OpsShell`: widen the sidebar to `var(--ops-sidebar-width)`, add the top utility bar with the command trigger, mount `OpsCommand` once.
5. `/ops/proposals/page.tsx`: parse `searchParams` into `ToolbarState`, apply `q/status/view/sort` to the query (server-side), pass `total`, render `<ListToolbar/>` between the KPI row and the list; render rows vs. entity cards from `layout`, `data-density` from `density`.
6. Run `npm run lint` and `npx tsc --noEmit`; then verify in the browser at 1440×900 and 390×844: drawer open/close with keyboard only, wizard Arrow keys on the rail, toolbar without JS (`<noscript>` Apply), tabs Arrow/Home/End, ⌘K palette with screen reader announcing counts.
7. Update `docs/component-sources.md` status column from "documented" to "integrated".

## Verification status

- 21st MCP: **ran** (7 searches, 11 source retrievals, paid tier — quota unconstrained).
- Design-system read: `design-system/podos-private-proposal-platform/MASTER.md` read; it predates the ops brief (Roboto/orange CTA) and is **superseded** by the founder tokens above for `/ops`. `docs/website-brief.md` and `docs/design-direction.md` do not exist in this repo — the founder brief in the task prompt was used as the design direction.
- UI UX Pro Max, GPT Image 2, font inventory: **not run** — no visual assets or new typefaces are in scope for these interaction components.
- Browser verification: **not run** — nothing is installed in the repo yet; the code above is authored against React 19 / Next 16 / `motion` 12 / `lucide-react` 1.x as pinned in `package.json`, and has not been typechecked in place. Step 6 above is the gate before "integrated".

