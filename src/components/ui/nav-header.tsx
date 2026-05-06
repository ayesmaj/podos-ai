"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import styles from "./nav-header.module.css";

/**
 * NavHeader · glass-bubble pill-rail nav (v2)
 *
 * What's new vs. v1 (the black/white brutalist primitive):
 *
 *   1. VISUAL — blue→cyan glass bubble with backdrop-filter blur,
 *      specular top-edge highlight, and a brand-glow outer shadow.
 *      Cursor pill uses --brand-gradient (the site's signature
 *      blue→cyan diagonal). All styling lives in nav-header.module.css
 *      because globals.css's unlayered `* { padding: 0 }` reset beats
 *      Tailwind's layered utilities.
 *
 *   2. ACTIVE-SECTION DETECTION — IntersectionObserver watches each
 *      section's DOM id and updates `activeHref`. Sections are
 *      considered "active" when their top edge sits inside the top
 *      10%–40% band of the viewport (set via rootMargin). That's
 *      roughly the reading-zone just below the fixed nav.
 *
 *   3. DOCK-TO-ACTIVE — when the user isn't hovering any tab, the
 *      cursor pill docks under the currently-active section. When
 *      they DO hover, it follows the cursor. Logic:
 *
 *         currentHref = hoveredHref ?? activeHref
 *
 *      The useLayoutEffect that measures + positions the pill runs
 *      whenever currentHref changes (and on window resize).
 *
 *   4. LABEL COLOR SWAPS on :hover AND .tabActive — no mix-blend
 *      trick. Because we know which tab the pill is under, we can
 *      just color its label white directly. Works against any
 *      backdrop, not just black/white.
 *
 * ---
 *
 * API — unchanged from v1:
 *
 *   <NavHeader
 *     items={[{ label: "Problem", href: "#problem" }, ...]}
 *     ariaLabel="..."
 *   />
 *
 * Why `href` is kept as an opaque string (not "anchor id only"):
 *   On the main site we pass "#podos" — same-document anchor jumps.
 *   On /mockups/* routes we pass "/#podos" — cross-route navigation
 *   back to the home route then anchor-scroll. Both work because
 *   we render a real <a href> and the browser handles it. The
 *   IntersectionObserver uses a regex (`/#(.+)$/`) that extracts the
 *   id from either form — and on mockup routes (where those ids
 *   don't exist on the page) it simply finds no targets and does
 *   nothing. Graceful no-op.
 *
 * Dependencies: framer-motion only (already installed).
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface NavHeaderProps {
  items?: NavItem[];
  /** Aria-label for the nav landmark. */
  ariaLabel?: string;
  /**
   * Optional brand lockup rendered INSIDE the glass bubble, before the
   * tabs. Pass an `<Image>` (or any ReactNode); the slot vertically
   * centers it and applies the bubble's glass treatment around it.
   *
   * When omitted, the bubble holds tabs only — same look as v2 had
   * before the logo slot was added. So existing call sites that don't
   * pass a logo are unaffected.
   */
  logo?: React.ReactNode;
}

const DEFAULT_ITEMS: NavItem[] = [
  { label: "Home", href: "#top" },
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#podos" },
  { label: "Market", href: "#market" },
  { label: "Invest", href: "#use-of-funds" },
];

type CursorPosition = {
  left: number;
  width: number;
  opacity: number;
};

function NavHeader({
  items = DEFAULT_ITEMS,
  ariaLabel = "Site sections",
  logo,
}: NavHeaderProps) {
  // Active section — set by the IntersectionObserver. Defaults to
  // items[0] so the pill has a sensible docking target on first paint
  // (before the observer has fired).
  const [activeHref, setActiveHref] = useState<string>(items[0]?.href ?? "");

  // Hover state. `currentHref` resolves to hoveredHref if set, else
  // activeHref — this gives the pill two modes: follow cursor while
  // hovering, rest on active section while idle.
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const currentHref = hoveredHref ?? activeHref;

  // Mobile menu open/closed. The hamburger button (visible ≤640px) toggles
  // this; the full-screen overlay menu reads it. Independent of hover/active
  // state so opening the menu doesn't disturb the desktop pill animation.
  const [mobileOpen, setMobileOpen] = useState(false);

  // Cursor pill position — measured from the DOM each time currentHref
  // changes (or on window resize).
  const [position, setPosition] = useState<CursorPosition>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Per-tab refs keyed by href. Used for measurement (positioning the
  // cursor pill) in both hover and active-dock paths.
  const tabRefs = useRef(new Map<string, HTMLLIElement>());

  // ── Active-section detection via IntersectionObserver ──────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Extract the anchor id from each href. The regex matches both
    // "#foo" and "/#foo" so the same component works on the main site
    // and on /mockups/* routes.
    const hrefById = new Map<string, string>();
    for (const item of items) {
      const id = item.href.match(/#(.+)$/)?.[1];
      if (id) hrefById.set(id, item.href);
    }

    const targets: HTMLElement[] = [];
    for (const id of hrefById.keys()) {
      const el = document.getElementById(id);
      if (el) targets.push(el);
    }
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Among currently-intersecting sections, pick the one whose
        // top edge is highest in the viewport. Stabler than "last to
        // enter" when two sections animate in together.
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((best, e) =>
          e.boundingClientRect.top < best.boundingClientRect.top ? e : best,
        );
        const href = hrefById.get(topmost.target.id);
        if (href) setActiveHref(href);
      },
      {
        // Reading band: top 10%–40% of the viewport. A section is
        // "active" when its top edge lies inside that band. Roughly
        // matches "what the user is reading just below the fixed nav".
        rootMargin: "-10% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  // ── Cursor pill positioning ────────────────────────────────────────
  // useLayoutEffect so measurement + paint happen in the same frame
  // (no flash of mis-positioned pill). Re-runs on currentHref change
  // and on window resize (layout can shift on viewport changes).
  useLayoutEffect(() => {
    const update = () => {
      const el = tabRefs.current.get(currentHref);
      if (!el) return;
      setPosition({
        left: el.offsetLeft,
        width: el.getBoundingClientRect().width,
        opacity: 1,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [currentHref]);

  // Stable per-href ref-setter — memoized so Tab doesn't re-mount.
  const registerTab = useCallback(
    (href: string) => (el: HTMLLIElement | null) => {
      if (el) tabRefs.current.set(href, el);
      else tabRefs.current.delete(href);
    },
    [],
  );

  // ── Mobile menu: ESC closes, body scroll locks, auto-close on resize ──
  // Single effect handles all three. Body-scroll lock prevents the page
  // behind the overlay from scrolling under touch — important on iOS where
  // the rubber-band would otherwise leak through. Auto-close on resize
  // covers the orientation/zoom case where a phone-width viewport widens
  // past the breakpoint while the menu is open.
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (mobileOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = previousOverflow;
        document.removeEventListener("keydown", onKey);
      };
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 641px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Bubble structure (v3 — adds logo slot):
  //   <nav class=bubble>             ← outer glass shell, rounded, blurred
  //     <a class=logoSlot>{logo}</a> ← optional brand lockup, anchors home
  //     <ul class=tabs>              ← positioned context for cursor pill
  //       …tabs…
  //       <Cursor />
  //     </ul>
  //   </nav>
  //
  // The cursor uses tab.offsetLeft (relative to its offsetParent — the
  // <ul.tabs>, which has `position: relative`). Moving the glass styling
  // to <nav> doesn't disturb that math because the cursor's coordinate
  // system stays anchored to <ul.tabs>.
  //
  // The logo links to items[0].href — by site convention items[0] IS
  // the home target (#top on the main site, /#top on mockup routes).
  // That keeps cross-route navigation working: clicking the logo from
  // /mockups/industrial pulls the reviewer back to the main site at
  // hero, exactly like the "Home" tab does.
  const homeHref = items[0]?.href ?? "#top";

  return (
    <>
      <nav aria-label={ariaLabel} className={styles.bubble}>
        {logo && (
          <a href={homeHref} className={styles.logoSlot} aria-label="Home">
            {logo}
          </a>
        )}
        <ul
          className={styles.tabs}
          onMouseLeave={() => setHoveredHref(null)}
        >
          {items.map((item) => (
            <Tab
              key={item.href}
              href={item.href}
              active={item.href === activeHref}
              onHover={setHoveredHref}
              registerRef={registerTab(item.href)}
            >
              {item.label}
            </Tab>
          ))}

          <Cursor position={position} />
        </ul>

        {/* Hamburger button — visible only ≤640px (CSS-driven). Replaces
            the truncated tab list on mobile; opens a full-screen overlay
            menu with all `items`. The 3 bars use absolute positioning so
            the open-state X transform pivots cleanly around their center. */}
        <button
          type="button"
          className={`${styles.menuToggle} ${mobileOpen ? styles.menuToggleOpen : ""}`.trim()}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="nav-mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className={styles.menuToggleBar} aria-hidden />
          <span className={styles.menuToggleBar} aria-hidden />
          <span className={styles.menuToggleBar} aria-hidden />
        </button>
      </nav>

      {/* Mobile overlay menu — full-screen frosted backdrop with stacked
          link tiles. Conditional render keeps it out of the DOM when
          closed. Backdrop click + link click + ESC + resize-to-desktop
          all dismiss it. */}
      {mobileOpen && (
        <div
          id="nav-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={styles.menuOverlay}
          onClick={(e) => {
            // Backdrop click only — ignore clicks bubbled from the panel
            if (e.target === e.currentTarget) setMobileOpen(false);
          }}
        >
          <div className={styles.menuPanel}>
            <button
              type="button"
              className={styles.menuClose}
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <span aria-hidden>×</span>
            </button>
            <ul className={styles.menuList}>
              {items.map((item, i) => (
                <li key={item.href} className={styles.menuItem} style={{ animationDelay: `${i * 40}ms` }}>
                  <a
                    href={item.href}
                    className={`${styles.menuLink} ${item.href === activeHref ? styles.menuLinkActive : ""}`.trim()}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className={styles.menuLinkIdx}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.menuLinkLabel}>{item.label}</span>
                    <span className={styles.menuLinkArrow} aria-hidden>→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- internals ---------- */

function Tab({
  children,
  href,
  active,
  onHover,
  registerRef,
}: {
  children: React.ReactNode;
  href: string;
  active: boolean;
  onHover: (href: string) => void;
  registerRef: (el: HTMLLIElement | null) => void;
}) {
  return (
    <li
      ref={registerRef}
      onMouseEnter={() => onHover(href)}
      className={`${styles.tab} ${active ? styles.tabActive : ""}`.trim()}
    >
      <a href={href} className={styles.link}>
        {children}
      </a>
    </li>
  );
}

function Cursor({ position }: { position: CursorPosition }) {
  return (
    <motion.li
      aria-hidden
      animate={position}
      transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.9 }}
      className={styles.cursor}
    />
  );
}

export default NavHeader;
