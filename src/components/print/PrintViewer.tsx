"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Maximize2, Minus, Plus } from "lucide-react";

/**
 * PrintViewer — fits the A4 page stack to the available width (so the same
 * DOM that prints reads correctly on a phone) and adds zoom controls. Uses
 * CSS `zoom` so layout height follows the scale — no transform bookkeeping.
 */

const A4_PX = 794; // 210mm at 96dpi

export default function PrintViewer({ children, toolbar }: { children: ReactNode; toolbar?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);
  const [zoom, setZoom] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setFit(Math.min(1, Math.max(0.3, (el.clientWidth - 24) / A4_PX))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = zoom ?? fit;
  const btn: CSSProperties = { display: "inline-grid", placeItems: "center", width: 34, height: 34, borderRadius: 8, border: "1px solid var(--edge, rgba(11,18,32,.12))", background: "var(--panel, #fff)", color: "inherit", cursor: "pointer" };

  return (
    <div ref={ref} style={{ display: "grid", gap: 10, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }} role="group" aria-label="Zoom">
          <button type="button" style={btn} aria-label="Zoom out" onClick={() => setZoom(Math.max(0.3, scale - 0.1))}><Minus size={15} aria-hidden /></button>
          <span style={{ minWidth: 48, textAlign: "center", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{Math.round(scale * 100)}%</span>
          <button type="button" style={btn} aria-label="Zoom in" onClick={() => setZoom(Math.min(2, scale + 0.1))}><Plus size={15} aria-hidden /></button>
          <button type="button" style={{ ...btn, width: "auto", padding: "0 10px", gap: 6, display: "inline-flex", fontSize: 13 }} onClick={() => setZoom(null)}><Maximize2 size={14} aria-hidden /> Fit width</button>
        </div>
        {toolbar}
      </div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ zoom: scale, width: "fit-content", margin: "0 auto" } as CSSProperties}>{children}</div>
      </div>
    </div>
  );
}
