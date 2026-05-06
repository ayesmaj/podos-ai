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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    // Expose globally so other components (e.g. PodosScrollHeroIntro)
    // can stop/start Lenis while they own scroll input. Without this,
    // a sub-component would have to either pierce React context OR
    // accept that Lenis will fight its own scroll-lock logic.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Keep GSAP ScrollTrigger in sync with Lenis virtual scroll
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

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
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
