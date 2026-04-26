"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTES = [
  { href: "/mockups", label: "Index", letter: "·" },
  { href: "/mockups/prospectus", label: "Prospectus", letter: "A" },
  { href: "/mockups/industrial", label: "Industrial", letter: "B" },
  { href: "/mockups/hyperscaler", label: "Hyperscaler", letter: "C" },
];

export default function DirectionSwitcher() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Direction switcher"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 18,
        transform: "translateX(-50%)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "6px 6px",
        background: "rgba(20,20,20,0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 999,
        fontFamily: "var(--font-plex-mono), ui-monospace, monospace",
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#e9e4d6",
        boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
      }}
    >
      {ROUTES.map((r) => {
        const active = pathname === r.href;
        return (
          <Link
            key={r.href}
            href={r.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 999,
              background: active ? "#e9e4d6" : "transparent",
              color: active ? "#111" : "rgba(233,228,214,0.7)",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <span
              style={{
                fontWeight: 600,
                fontSize: 10,
                opacity: 0.9,
                border: `1px solid ${active ? "rgba(0,0,0,0.25)" : "rgba(233,228,214,0.3)"}`,
                borderRadius: 999,
                padding: "1px 6px",
              }}
            >
              {r.letter}
            </span>
            <span>{r.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
