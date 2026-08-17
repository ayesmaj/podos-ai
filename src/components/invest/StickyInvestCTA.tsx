"use client";

/**
 * StickyInvestCTA — mobile-only fixed bottom bar. Appears after the hero,
 * hides while the final CTA section is on screen (its own buttons take over).
 */

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { openInvestorAccess } from "./investAccess";

export default function StickyInvestCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const final = document.getElementById("access");
    let finalOnScreen = false;
    const obs = final
      ? new IntersectionObserver(([e]) => {
          finalOnScreen = e.isIntersecting;
          setVisible(window.scrollY > window.innerHeight * 0.8 && !finalOnScreen);
        })
      : null;
    if (final && obs) obs.observe(final);
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight * 0.8 && !finalOnScreen);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs?.disconnect();
    };
  }, []);

  return (
    <div
      className="iv-sticky-cta"
      style={{
        transform: visible ? "translateY(0)" : "translateY(120%)",
        transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <button
        onClick={() => openInvestorAccess()}
        className="iv-btn iv-btn-primary w-full !py-4"
        style={{ boxShadow: "0 12px 40px -10px rgba(23,25,27,0.5)" }}
      >
        INVESTOR ACCESS
        <ArrowRight size={17} strokeWidth={2.2} />
      </button>
    </div>
  );
}
