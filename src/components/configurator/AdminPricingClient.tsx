"use client";

/**
 * AdminPricingClient — edit every estimator price, preview live, export.
 *
 * Deliberately storage-light: values live in localStorage under
 * "podos:pricing-preview" (which ConfiguratorClient reads), plus copy /
 * download so the founder can hand the JSON over to be committed. No
 * database, no auth wall — the page is noindex and holds no secrets, but
 * see the note in the UI: this is a preview, not a publish.
 */

import { useMemo, useState } from "react";
import { type PricingConfig } from "@/data/configuratorPricing";
import { publishPricingOverride, usePricingOverride } from "@/lib/configurator/usePricingOverride";
import { DEFAULT_SELECTION, estimate, fmtCompact, fmtUSD } from "@/lib/configurator/estimate";

const label: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10.5,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
};

function Money({
  value,
  onChange,
  id,
}: {
  value: number;
  onChange: (n: number) => void;
  id: string;
}) {
  return (
    <input
      id={id}
      type="number"
      min={0}
      step={1000}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width: "100%",
        padding: "0.5rem 0.6rem",
        borderRadius: 8,
        border: "1px solid var(--edge)",
        background: "var(--panel)",
        fontFamily: "var(--font-mono)",
        fontSize: 14,
        color: "var(--ink-strong)",
      }}
    />
  );
}

export default function AdminPricingClient() {
  // Stored override is the external source of truth; `draft` holds edits
  // made in this session. No setState-in-effect, so no cascading renders.
  const { pricing: stored } = usePricingOverride();
  const [draft, setDraft] = useState<PricingConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const cfg = draft ?? stored;

  /** apply an edit: update the draft AND publish it for the estimator */
  const setCfg = (next: PricingConfig | ((c: PricingConfig) => PricingConfig)) => {
    const value = typeof next === "function" ? next(cfg) : next;
    setDraft(value);
    publishPricingOverride(value);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  };

  const sample = useMemo(() => estimate(DEFAULT_SELECTION, cfg), [cfg]);

  const setGroup = (
    group: "cooling" | "power" | "network" | "services",
    id: string,
    price: number,
  ) =>
    setCfg((c) => ({
      ...c,
      [group]: { ...c[group], [id]: { ...c[group][id], price } },
    }));

  const setSupport = (id: string, pricePerYear: number) =>
    setCfg((c) => ({
      ...c,
      support: { ...c.support, [id]: { ...c.support[id], pricePerYear } },
    }));

  const json = JSON.stringify(cfg, null, 2);

  const download = () => {
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "podos-pricing.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const card: React.CSSProperties = {
    border: "1px solid var(--edge)",
    borderRadius: 12,
    background: "var(--panel)",
    padding: "1.1rem",
  };

  return (
    <div style={{ marginTop: "2rem", display: "grid", gap: "1.6rem", gridTemplateColumns: "minmax(0,1fr)" }}>
      <div
        style={{
          ...card,
          background: "var(--cyan-wash)",
          borderColor: "var(--cyan-trace)",
          fontSize: 13.5,
          lineHeight: 1.6,
          color: "var(--ink-strong)",
        }}
      >
        <strong>Preview only.</strong> Edits are saved in this browser and
        change what <em>you</em> see on <a href="/configure" style={{ color: "var(--brand)" }}>/configure</a>.
        Visitors keep seeing the committed prices until the exported JSON is
        merged into <code>src/data/configuratorPricing.ts</code>.
        {saved && <span style={{ marginLeft: 8, color: "var(--brand)" }}>Saved ✓</span>}
      </div>

      <div style={{ display: "grid", gap: "1.2rem", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
        <div style={card}>
          <h2 style={label}>Base</h2>
          <div style={{ display: "grid", gap: "0.8rem", marginTop: "0.8rem" }}>
            <div>
              <label htmlFor="podBase" style={{ fontSize: 13.5 }}>Pod base (per unit)</label>
              <Money id="podBase" value={cfg.podBase} onChange={(n) => setCfg((c) => ({ ...c, podBase: n }))} />
            </div>
            <div>
              <label htmlFor="computePackage" style={{ fontSize: 13.5 }}>Compute package (per unit)</label>
              <Money id="computePackage" value={cfg.computePackage} onChange={(n) => setCfg((c) => ({ ...c, computePackage: n }))} />
            </div>
            <div>
              <label htmlFor="spread" style={{ fontSize: 13.5 }}>Estimate spread (± fraction)</label>
              <input
                id="spread"
                type="number"
                min={0}
                max={0.5}
                step={0.01}
                value={cfg.rangeSpread}
                onChange={(e) => setCfg((c) => ({ ...c, rangeSpread: Number(e.target.value) }))}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.6rem",
                  borderRadius: 8,
                  border: "1px solid var(--edge)",
                  background: "var(--panel)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                }}
              />
            </div>
          </div>
        </div>

        {(["cooling", "power", "network", "services"] as const).map((group) => (
          <div key={group} style={card}>
            <h2 style={label}>{group}</h2>
            <div style={{ display: "grid", gap: "0.8rem", marginTop: "0.8rem" }}>
              {Object.entries(cfg[group]).map(([id, o]) => (
                <div key={id}>
                  <label htmlFor={group + "-" + id} style={{ fontSize: 13.5 }}>{o.label}</label>
                  <Money
                    id={group + "-" + id}
                    value={o.price ?? 0}
                    onChange={(n) => setGroup(group, id, n)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={card}>
          <h2 style={label}>Support (per year)</h2>
          <div style={{ display: "grid", gap: "0.8rem", marginTop: "0.8rem" }}>
            {Object.entries(cfg.support).map(([id, o]) => (
              <div key={id}>
                <label htmlFor={"support-" + id} style={{ fontSize: 13.5 }}>{o.label}</label>
                <Money id={"support-" + id} value={o.pricePerYear} onChange={(n) => setSupport(id, n)} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...card, background: "var(--canvas)" }}>
          <h2 style={label}>Live sample — 2 pods, standard config</h2>
          <div style={{ marginTop: "0.8rem", fontFamily: "var(--font-mono)" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "var(--ink-strong)" }}>
              {fmtCompact(sample.low)} – {fmtCompact(sample.high)}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 6 }}>
              + {fmtUSD(sample.recurringPerYear)} / yr support
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 2 }}>
              {sample.totalMw} MW · {sample.totalGpus.toLocaleString("en-US")} GPUs
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
        <button
          onClick={() => {
            navigator.clipboard.writeText(json);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          style={{
            padding: "0.75rem 1.2rem",
            borderRadius: 999,
            background: "var(--ink)",
            color: "#F3F6FA",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            border: "none",
          }}
        >
          {copied ? "Copied ✓" : "Copy config JSON"}
        </button>
        <button
          onClick={download}
          style={{
            padding: "0.75rem 1.2rem",
            borderRadius: 999,
            background: "var(--panel)",
            border: "1px solid var(--edge)",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Download JSON
        </button>
        <button
          onClick={() => {
            publishPricingOverride(null);
            setDraft(null);
          }}
          style={{
            padding: "0.75rem 1.2rem",
            borderRadius: 999,
            background: "transparent",
            border: "1px solid var(--edge)",
            fontSize: 14,
            cursor: "pointer",
            color: "var(--ink-dim)",
          }}
        >
          Reset to committed values
        </button>
      </div>
    </div>
  );
}
