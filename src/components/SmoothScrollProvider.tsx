"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Lenis tuning (2026-05-20 — second perf pass):
    //  - Switched from `duration` to `lerp`. duration: 0.9 meant every
    //    wheel tick triggered ~54 frames of interpolation, each running
    //    the full scroll-handler chain (Lenis emit → ScrollTrigger update
    //    → scroll-gate → ScrollProgressRail tick → every framer-motion
    //    useScroll measure). lerp: 0.15 catches up in ~8 frames (~133ms)
    //    — same butter-smooth feel, ~6× less per-tick work.
    //  - wheelMultiplier dropped 1.4 → 1.0. The boosted multiplier made
    //    each wheel tick scroll further → longer settle → more frames of
    //    JS work. Native multiplier gives proper page-down behavior on
    //    real wheel mice without the perceived "boost lag".
    //  - smoothWheel stays true so trackpads/precision mice still feel
    //    silky. Touch scrolling on mobile is unaffected (always smooth).
    const lenis = new Lenis({
      lerp: 0.15,
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      // syncTouch off — touch scrolling uses the browser's native momentum
      // which is GPU-accelerated and free. Forcing Lenis into the loop
      // there hurts mobile perf.
      syncTouch: false,
    });

    lenisRef.current = lenis;
    // Expose globally so other components (e.g. PodosScrollHeroIntro)
    // can stop/start Lenis while they own scroll input. Without this,
    // a sub-component would have to either pierce React context OR
    // accept that Lenis will fight its own scroll-lock logic.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Keep GSAP ScrollTrigger in sync with Lenis virtual scroll
    lenis.on("scroll", ScrollTrigger.update);

    // === Scroll-gate for heavy CSS effects (2026-05-20 perf pass) ===
    // While scrolling, set data-scrolling on <html> so perf.css can
    // drop backdrop-filters + decorative blurs (the #1 cause of the
    // ~2 FPS scroll we measured). Clear it 140ms after the last scroll
    // event so the glass returns at rest. The doc element write is
    // cheap and idempotent; we only touch the DOM on the leading edge
    // and the trailing timeout, NOT every frame.
    const docEl = document.documentElement;
    let scrollIdleTimer = 0;
    let scrollFlagOn = false;
    const onScrollGate = () => {
      if (!scrollFlagOn) {
        docEl.setAttribute("data-scrolling", "");
        scrollFlagOn = true;
      }
      if (scrollIdleTimer) window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        docEl.removeAttribute("data-scrolling");
        scrollFlagOn = false;
      }, 140);
    };
    lenis.on("scroll", onScrollGate);
    // Also catch native scroll (touch / keyboard / programmatic) which
    // Lenis may not always emit for.
    window.addEventListener("scroll", onScrollGate, { passive: true });

    // GSAP ticker drives Lenis. The previous lagSmoothing(0) call
    // DISABLED frame-skipping protection — when the page was busy, GSAP
    // would keep trying to catch up on missed frames instead of dropping
    // them, which feels like "stutter on every scroll". Default smoothing
    // (500ms threshold, 33ms target) is what production Lenis+GSAP setups
    // use; it lets the browser breathe under load.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(500, 33);

    // Anchor-link handling. Lenis owns scroll, so native <a href="#x">
    // clicks update the URL hash but don't actually scroll. This delegated
    // handler intercepts in-page anchor clicks and routes them through
    // lenis.scrollTo(). The offset mirrors the CSS scroll-padding-top
    // (clamp 64–104px) so targets land below the fixed NavHeader.
    const NAV_OFFSET = 96;
    const onAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const link = (e.target as Element | null)?.closest?.("a[href]") as
        | HTMLAnchorElement
        | null;
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      // The hero section (#top) is position: sticky and always rect-pinned
      // at y=0, so the rect+scrollY formula collapses to scrollY itself.
      // Scrolling "home" means going to the document start.
      const isPinnedSticky =
        getComputedStyle(target).position === "sticky" &&
        target.getBoundingClientRect().top <= 0;
      const targetY = isPinnedSticky
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      lenis.scrollTo(Math.max(0, targetY));
      history.pushState(null, "", href);
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("scroll", onScrollGate);
      if (scrollIdleTimer) window.clearTimeout(scrollIdleTimer);
      docEl.removeAttribute("data-scrolling");
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
