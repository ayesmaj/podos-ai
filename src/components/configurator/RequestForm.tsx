"use client";

/**
 * RequestForm — turns a configured estimate into a real inbound lead.
 *
 * Replaces a mailto: link, which did nothing at all unless the visitor had a
 * desktop mail client configured, and carried ~700 characters of encoded body
 * that several clients truncate. The request now posts to the server and
 * creates a draft estimate visible in /admin/estimates.
 */

import { useState } from "react";

export interface RequestPayload {
  config: Record<string, unknown>;
  lowCents: number;
  highCents: number;
  recurringCents: number;
}

const field: React.CSSProperties = {
  width: "100%",
  padding: "0.62rem 0.7rem",
  borderRadius: 8,
  border: "1px solid var(--edge-bright)",
  background: "var(--panel)",
  fontSize: 14,
  color: "var(--ink-strong)",
  fontFamily: "inherit",
};
const label: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--ink-faint)",
  display: "block",
  marginBottom: 4,
};

export default function RequestForm({ payload }: { payload: RequestPayload }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setMessage("");

    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/estimate-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: fd.get("clientName"),
          clientEmail: fd.get("clientEmail"),
          company: fd.get("company"),
          company_website: fd.get("company_website"), // honeypot
          projectName: fd.get("projectName"),
          ...payload,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setState("error");
        setMessage(json.error ?? "Could not send that. Please email info@podosai.com.");
        return;
      }
      setReference(typeof json.reference === "string" ? json.reference : "");
      setState("sent");
    } catch {
      setState("error");
      setMessage("Network problem. Please email info@podosai.com.");
    }
  }

  if (state === "sent") {
    return (
      <div
        role="status"
        style={{
          marginTop: "1.3rem",
          padding: "1rem",
          borderRadius: 12,
          border: "1px solid rgba(34,197,94,.45)",
          background: "rgba(34,197,94,.08)",
        }}
      >
        <p style={{ fontWeight: 600, fontSize: 14.5, color: "var(--ink-strong)" }}>
          Request received{reference ? ` — ${reference}` : ""}
        </p>
        <p style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 4, lineHeight: 1.55 }}>
          Your configuration was sent to the PODOS team with this estimate attached. We&apos;ll
          follow up by email with an engineering-reviewed proposal.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ marginTop: "1.3rem", display: "grid", gap: "0.7rem" }}>
      <p style={{ fontSize: 13, color: "var(--ink-dim)", lineHeight: 1.55 }}>
        Send this configuration to our team and we&apos;ll come back with an
        engineering-reviewed proposal.
      </p>

      <div>
        <label style={label} htmlFor="clientName">Your name *</label>
        <input style={field} id="clientName" name="clientName" required autoComplete="name" />
      </div>
      <div>
        <label style={label} htmlFor="clientEmail">Work email *</label>
        <input style={field} id="clientEmail" name="clientEmail" type="email" required autoComplete="email" />
      </div>
      <div>
        <label style={label} htmlFor="company">Company</label>
        <input style={field} id="company" name="company" autoComplete="organization" />
      </div>
      <div>
        <label style={label} htmlFor="projectName">Project or site</label>
        <input style={field} id="projectName" name="projectName" placeholder="e.g. Phoenix pilot" />
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />

      {state === "error" && (
        <p role="alert" style={{ fontSize: 13, color: "#B91C1C", lineHeight: 1.5 }}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        style={{
          display: "block",
          width: "100%",
          textAlign: "center",
          padding: "0.9rem 1rem",
          borderRadius: 999,
          background: "var(--ink)",
          color: "#F3F6FA",
          fontWeight: 600,
          fontSize: 14.5,
          border: "none",
          cursor: state === "sending" ? "wait" : "pointer",
          opacity: state === "sending" ? 0.6 : 1,
        }}
      >
        {state === "sending" ? "Sending…" : "Request a deployment conversation →"}
      </button>
    </form>
  );
}
