"use client";

/**
 * ConfiguratorClient — the interactive estimator island for /configure.
 *
 * Left: configuration controls. Right: sticky live summary with capacity
 * (from the approved claims register) and a PRELIMINARY price RANGE.
 * Never presents a quote; fit problems surface as honest warnings rather
 * than being silently corrected.
 *
 * Pricing comes from src/data/configuratorPricing.ts, with an optional
 * admin preview override in localStorage (written by /admin/pricing) so
 * the founder can tune numbers before committing them.
 */

import { useMemo, useState } from "react";
import Image from "next/image";
import { usePricingOverride } from "@/lib/configurator/usePricingOverride";
import {
  COMPUTE_IMAGES,
  COOLING_IMAGES,
  NETWORK_IMAGES,
  POWER_IMAGES,
  SERVICE_IMAGES,
  SUPPORT_IMAGES,
} from "@/data/configuratorOptionImages";
import {
  DEFAULT_SELECTION,
  estimate,
  fmtCompact,
  fmtUSD,
  type Selection,
} from "@/lib/configurator/estimate";

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
};

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ borderTop: "1px solid var(--edge)", paddingTop: "1.4rem", marginTop: "1.8rem" }}>
      <h2 style={mono}>{title}</h2>
      <div style={{ marginTop: "0.9rem" }}>{children}</div>
    </section>
  );
}

type Opt = { label: string; price?: number; pricePerYear?: number; note: string };

/**
 * Decorative option thumbnail. alt is empty on purpose — the card already
 * carries a visible label, so announcing the picture too would just repeat it.
 */
function OptionThumb({ src }: { src?: string }) {
  if (!src) return null;
  return (
    <span
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: 7,
        overflow: "hidden",
        border: "1px solid var(--edge)",
        background: "var(--canvas)",
        marginBottom: "0.65rem",
      }}
    >
      <Image src={src} alt="" fill sizes="(max-width: 1024px) 45vw, 240px" style={{ objectFit: "cover" }} />
    </span>
  );
}

function OptionCards({
  options,
  value,
  onChange,
  name,
  images,
}: {
  options: Record<string, Opt>;
  value: string;
  onChange: (v: string) => void;
  name: string;
  images?: Record<string, string>;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      style={{ display: "grid", gap: "0.6rem", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))" }}
    >
      {Object.entries(options).map(([id, o]) => {
        const active = value === id;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            style={{
              textAlign: "left",
              padding: "0.85rem 0.95rem",
              borderRadius: 10,
              cursor: "pointer",
              background: active ? "var(--brand-wash)" : "var(--panel)",
              border: "1px solid " + (active ? "var(--brand)" : "var(--edge)"),
              boxShadow: active ? "0 0 0 3px var(--brand-trace)" : "none",
              transition: "border-color .2s, background .2s, box-shadow .2s",
            }}
          >
            <OptionThumb src={images?.[id]} />
            <div style={{ fontWeight: 600, fontSize: 14.5, color: "var(--ink-strong)" }}>{o.label}</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--ink-dim)", marginTop: 4 }}>{o.note}</div>
          </button>
        );
      })}
    </div>
  );
}

export default function ConfiguratorClient() {
  const [sel, setSel] = useState<Selection>(DEFAULT_SELECTION);
  // External store (localStorage) rather than effect+setState: SSR-safe,
  // no cascading renders, and it live-updates while admin edits prices.
  const { pricing, isOverride: previewNote } = usePricingOverride();

  const result = useMemo(() => estimate(sel, pricing), [sel, pricing]);
  const set = <K extends keyof Selection>(k: K, v: Selection[K]) =>
    setSel((s) => ({ ...s, [k]: v }));

  const toggleService = (id: string) =>
    setSel((s) => ({
      ...s,
      services: s.services.includes(id) ? s.services.filter((x) => x !== id) : [...s.services, id],
    }));

  const mailBody = [
    "Configuration",
    "------------",
    "Pods: " + sel.pods,
    "Capacity: " + result.totalMw + " MW",
    "Compute: " + (sel.includeCompute ? "PODOS-supplied (" + result.totalGpus + " GPUs)" : "Customer-furnished"),
    "Cooling: " + sel.cooling,
    "Power: " + sel.power,
    "Network: " + sel.network,
    "Support: " + sel.support,
    "Services: " + (sel.services.join(", ") || "none"),
    "Site power available: " + (sel.sitePowerMw || "not specified") + " MW",
    "",
    "Preliminary estimate: " + fmtCompact(result.low) + " - " + fmtCompact(result.high) + " one-time" +
      (result.recurringPerYear ? ", " + fmtUSD(result.recurringPerYear) + "/yr support" : ""),
    "",
    "My details",
    "----------",
    "Name:",
    "Company:",
    "Site location:",
    "Timeline:",
    "",
  ].join("\n");

  const mailto =
    "mailto:info@podosai.com?subject=" +
    encodeURIComponent("PODOS deployment inquiry") +
    "&body=" +
    encodeURIComponent(mailBody);

  return (
    <div className="cfg-grid">
      {/* ---------------- controls ---------------- */}
      <div>
        <Group title="01 · Capacity">
          <label htmlFor="pods" style={{ display: "block", fontSize: 14, color: "var(--ink-dim)" }}>
            How many PODOS Pods?
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.6rem" }}>
            <input
              id="pods"
              type="range"
              min={1}
              max={20}
              value={sel.pods}
              onChange={(e) => set("pods", Number(e.target.value))}
              style={{ flex: 1, accentColor: "var(--brand)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 26,
                fontWeight: 700,
                color: "var(--ink-strong)",
                minWidth: "2.5ch",
                textAlign: "right",
              }}
            >
              {sel.pods}
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: "0.5rem" }}>
            Each pod is{" "}
            <span data-claim="unit-capacity-1mw">designed as a standardized 1 MW building block</span>.
          </p>

          <label htmlFor="sitePower" style={{ ...mono, display: "block", marginTop: "1.4rem" }}>
            Power available on site (MW, optional)
          </label>
          <input
            id="sitePower"
            type="number"
            min={0}
            step={0.5}
            value={sel.sitePowerMw || ""}
            placeholder="e.g. 5"
            onChange={(e) => set("sitePowerMw", Number(e.target.value))}
            style={{
              marginTop: "0.45rem",
              width: 180,
              padding: "0.6rem 0.7rem",
              borderRadius: 8,
              border: "1px solid var(--edge)",
              background: "var(--panel)",
              fontSize: 15,
              color: "var(--ink-strong)",
            }}
          />
        </Group>

        <Group title="02 · Compute">
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {[
              { v: true, label: "PODOS-supplied compute", note: "Designed for 128 GPUs per pod", img: COMPUTE_IMAGES.podos },
              { v: false, label: "Customer-furnished compute", note: "You supply accelerators; we supply the infrastructure", img: COMPUTE_IMAGES.customer },
            ].map((o) => {
              const active = sel.includeCompute === o.v;
              return (
                <button
                  key={String(o.v)}
                  onClick={() => set("includeCompute", o.v)}
                  aria-pressed={active}
                  style={{
                    flex: "1 1 240px",
                    textAlign: "left",
                    padding: "0.85rem 0.95rem",
                    borderRadius: 10,
                    cursor: "pointer",
                    background: active ? "var(--brand-wash)" : "var(--panel)",
                    border: "1px solid " + (active ? "var(--brand)" : "var(--edge)"),
                  }}
                >
                  <OptionThumb src={o.img} />
                  <div style={{ fontWeight: 600, fontSize: 14.5 }}>{o.label}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 4 }}>{o.note}</div>
                </button>
              );
            })}
          </div>
        </Group>

        <Group title="03 · Cooling">
          <OptionCards options={pricing.cooling} value={sel.cooling} onChange={(v) => set("cooling", v)} name="Cooling" images={COOLING_IMAGES} />
        </Group>

        <Group title="04 · Power">
          <OptionCards options={pricing.power} value={sel.power} onChange={(v) => set("power", v)} name="Power" images={POWER_IMAGES} />
        </Group>

        <Group title="05 · Network">
          <OptionCards options={pricing.network} value={sel.network} onChange={(v) => set("network", v)} name="Network" images={NETWORK_IMAGES} />
        </Group>

        <Group title="06 · Support">
          <OptionCards options={pricing.support} value={sel.support} onChange={(v) => set("support", v)} name="Support" images={SUPPORT_IMAGES} />
        </Group>

        <Group title="07 · Deployment services">
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {Object.entries(pricing.services).map(([id, s]) => {
              const on = sel.services.includes(id);
              return (
                <label
                  key={id}
                  style={{
                    display: "flex",
                    gap: "0.7rem",
                    alignItems: "flex-start",
                    padding: "0.75rem 0.9rem",
                    borderRadius: 10,
                    cursor: "pointer",
                    background: on ? "var(--brand-wash)" : "var(--panel)",
                    border: "1px solid " + (on ? "var(--brand)" : "var(--edge)"),
                  }}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleService(id)}
                    style={{ marginTop: 3, accentColor: "var(--brand)" }}
                  />
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: "block", maxWidth: 220 }}>
                      <OptionThumb src={SERVICE_IMAGES[id]} />
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 14.5 }}>{s.label}</span>
                    <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-dim)", marginTop: 2 }}>{s.note}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </Group>
      </div>

      {/* ---------------- summary ---------------- */}
      <aside className="cfg-summary">
        <div
          style={{
            border: "1px solid var(--edge)",
            borderRadius: 14,
            background: "var(--panel)",
            padding: "1.4rem",
            boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 18px 50px -30px rgba(15,23,42,.25)",
          }}
        >
          <div style={mono}>Preliminary estimate</div>

          <div style={{ marginTop: "0.9rem", display: "grid", gap: "0.55rem" }}>
            {[
              ["Capacity", result.totalMw + " MW"],
              ["GPUs", result.totalGpus ? result.totalGpus.toLocaleString("en-US") : "Customer-furnished"],
              ["Deployment target", result.deployTargetDays + " days"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: 13.5 }}>
                <span style={{ color: "var(--ink-dim)" }}>{k}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--edge)", marginTop: "1.1rem", paddingTop: "1.1rem" }}>
            <div style={mono}>Estimated one-time</div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--ink-strong)",
                marginTop: 4,
              }}
            >
              {fmtCompact(result.low)} – {fmtCompact(result.high)}
            </div>
            {result.volumeMultiplier < 1 && (
              <div style={{ fontSize: 12, color: "var(--brand)", marginTop: 4 }}>
                Volume adjustment applied ({Math.round((1 - result.volumeMultiplier) * 100)}%)
              </div>
            )}
            {result.recurringPerYear > 0 && (
              <div style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: "0.6rem" }}>
                + {fmtUSD(result.recurringPerYear)} / year support
              </div>
            )}
          </div>

          {result.warnings.length > 0 && (
            <ul style={{ listStyle: "none", marginTop: "1.1rem", display: "grid", gap: "0.55rem" }}>
              {result.warnings.map((w) => (
                <li
                  key={w}
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    color: "var(--ink-strong)",
                    background: "var(--cyan-wash)",
                    border: "1px solid var(--cyan-trace)",
                    borderRadius: 8,
                    padding: "0.6rem 0.7rem",
                  }}
                >
                  {w}
                </li>
              ))}
            </ul>
          )}

          <details style={{ marginTop: "1.1rem" }}>
            <summary style={{ ...mono, cursor: "pointer" }}>Line items</summary>
            <div style={{ marginTop: "0.7rem", display: "grid", gap: "0.4rem" }}>
              {result.lineItems.map((li) => (
                <div key={li.label} style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", fontSize: 12.5 }}>
                  <span style={{ color: "var(--ink-dim)" }}>
                    {li.label}
                    {li.kind === "recurring" ? " (per year)" : ""}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)" }}>{fmtUSD(li.amount)}</span>
                </div>
              ))}
            </div>
          </details>

          <a
            href={mailto}
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "1.3rem",
              padding: "0.9rem 1rem",
              borderRadius: 999,
              background: "var(--ink)",
              color: "#F3F6FA",
              fontWeight: 600,
              fontSize: 14.5,
              textDecoration: "none",
            }}
          >
            Request a deployment conversation →
          </a>

          <p style={{ fontSize: 11, lineHeight: 1.55, color: "var(--ink-faint)", marginTop: "0.9rem" }}>
            Preliminary estimate for planning only — not a quote, offer, or
            contract. Figures are indicative, exclude site-specific civil
            works, utility interconnection, and taxes, and are subject to
            engineering review and a written proposal.
            {previewNote ? " Admin price preview active in this browser." : ""}
          </p>
        </div>
      </aside>

      <style>{`
        /* Defined here rather than inline: an inline style would win over
           the media query and force the single-column layout at all sizes. */
        .cfg-grid {
          display: grid;
          gap: 2.5rem;
          align-items: start;
          grid-template-columns: minmax(0, 1fr);
        }
        @media (min-width: 1024px) {
          .cfg-grid { grid-template-columns: minmax(0,1fr) 380px; }
          .cfg-summary { position: sticky; top: 96px; }
        }
      `}</style>
    </div>
  );
}
