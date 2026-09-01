"use client";

/**
 * AccessForm — verification step of the secure invitation flow.
 *
 * otp policy:            "Send code" → 6-digit input → verify.
 * email-confirm policy:  type the authorized email exactly → verify.
 *
 * Verification happens at /api/proposal/verify, which sets the HttpOnly
 * session cookie server-side (this component never sees the session token)
 * and returns the clean proposal route to navigate to.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

const field: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.8rem",
  borderRadius: 10,
  border: "1px solid var(--edge-bright)",
  background: "var(--panel)",
  fontSize: 15,
  color: "var(--ink-strong)",
  fontFamily: "inherit",
};

export default function AccessForm({
  token,
  policy,
  maskedEmail,
}: {
  token: string;
  policy: "otp" | "email-confirm";
  maskedEmail: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<"start" | "code" | "busy">(policy === "otp" ? "start" : "code");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function requestCode() {
    setPhase("busy");
    setError("");
    try {
      const res = await fetch("/api/proposal/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Could not send the code. Contact info@podosai.com.");
        setPhase("start");
        return;
      }
      setNotice(`Code sent to ${maskedEmail}. It expires in 10 minutes.`);
      setPhase("code");
    } catch {
      setError("Network problem — try again.");
      setPhase("start");
    }
  }

  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const answer = String(new FormData(e.currentTarget).get("answer") ?? "").trim();
    if (!answer) return;
    setPhase("busy");
    setError("");
    try {
      const res = await fetch("/api/proposal/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, answer }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Verification failed. Check and try again.");
        setPhase("code");
        return;
      }
      router.replace(`/client/proposals/${json.id}`);
    } catch {
      setError("Network problem — try again.");
      setPhase("code");
    }
  }

  return (
    <div style={{ marginTop: "1.3rem" }}>
      {policy === "otp" && phase === "start" && (
        <button
          type="button"
          onClick={requestCode}
          style={{
            width: "100%",
            padding: "0.85rem 1rem",
            borderRadius: 10,
            background: "var(--brand-gradient)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14.5,
            border: "none",
            cursor: "pointer",
          }}
        >
          Email me a verification code
        </button>
      )}

      {(phase === "code" || phase === "busy") && (
        <form onSubmit={verify} style={{ display: "grid", gap: "0.7rem" }}>
          {notice && <p style={{ fontSize: 13, color: "var(--cyan-deep)" }}>{notice}</p>}
          <label htmlFor="answer" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
            {policy === "otp" ? "Six-digit code" : "Authorized email address"}
          </label>
          <input
            style={field}
            id="answer"
            name="answer"
            autoFocus
            autoComplete={policy === "otp" ? "one-time-code" : "email"}
            inputMode={policy === "otp" ? "numeric" : "email"}
            placeholder={policy === "otp" ? "000000" : "name@company.com"}
            maxLength={policy === "otp" ? 6 : 320}
          />
          <button
            type="submit"
            disabled={phase === "busy"}
            style={{
              padding: "0.85rem 1rem",
              borderRadius: 10,
              background: "var(--brand-gradient)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14.5,
              border: "none",
              cursor: phase === "busy" ? "wait" : "pointer",
              opacity: phase === "busy" ? 0.6 : 1,
            }}
          >
            {phase === "busy" ? "Verifying…" : "Continue to private workspace →"}
          </button>
          {policy === "otp" && (
            <button
              type="button"
              onClick={requestCode}
              disabled={phase === "busy"}
              style={{ background: "none", border: "none", color: "var(--brand)", fontSize: 12.5, cursor: "pointer", justifySelf: "start", padding: 0 }}
            >
              Resend code
            </button>
          )}
        </form>
      )}

      {error && (
        <p role="alert" style={{ fontSize: 13, color: "#B91C1C", marginTop: "0.7rem", lineHeight: 1.5 }}>
          {error}
        </p>
      )}
    </div>
  );
}
