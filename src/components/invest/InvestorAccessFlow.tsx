"use client";

/**
 * InvestorAccessFlow — the premium investor-commitment modal.
 *
 * Three steps: AMOUNT → DETAILS → REVIEW & ACKNOWLEDGE, then a recorded
 * NON-BINDING indication of interest (no payment — securities
 * transactions only ever happen through the approved intermediary in
 * offering.portalURL, which replaces this flow's final step when live).
 *
 * Opens from anywhere via openInvestorAccess(amount?) (window event).
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { INVEST_ACCESS_EVENT } from "./investAccess";
import { CTA, MIN_INVESTMENT, MAX_INVESTMENT, QUICK_AMOUNTS, fmtUSD } from "@/data/investContent";

type Step = "amount" | "details" | "review" | "done";

const STEP_INDEX: Record<Step, number> = { amount: 0, details: 1, review: 2, done: 3 };

export default function InvestorAccessFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState(25_000);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [investorType, setInvestorType] = useState("individual");
  const [accredited, setAccredited] = useState("unsure");
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /* open on demand, optionally seeded with the calculator amount */
  useEffect(() => {
    const onOpen = (e: Event) => {
      const a = (e as CustomEvent).detail?.amount;
      if (typeof a === "number" && a >= MIN_INVESTMENT && a <= MAX_INVESTMENT) setAmount(a);
      setStep("amount");
      setError("");
      setOpen(true);
    };
    window.addEventListener(INVEST_ACCESS_EVENT, onOpen);
    return () => window.removeEventListener(INVEST_ACCESS_EVENT, onOpen);
  }, []);

  /* esc close + body scroll lock */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("input, button")?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  const clamp = (n: number) => Math.min(MAX_INVESTMENT, Math.max(MIN_INVESTMENT, n));

  const validDetails =
    fullName.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  const submit = useCallback(async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/investor-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          amountUsd: amount,
          investorType,
          accredited,
          company: "", // honeypot stays empty for humans
        }),
      });
      const json = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong — please try again.");
        return;
      }
      setStep("done");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [fullName, email, phone, amount, investorType, accredited]);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--iv-white)",
    border: "1px solid var(--iv-border)",
    borderRadius: 8,
    padding: "13px 14px",
    fontSize: 15,
    color: "var(--iv-ink)",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--iv-mono)",
    fontSize: 10.5,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "var(--iv-steel)",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="invest fixed inset-0 z-[90] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: "rgba(23,25,27,0.55)", backdropFilter: "blur(6px)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Investor access"
        >
          <motion.div
            ref={panelRef}
            className="max-h-[92svh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl p-7 sm:rounded-2xl sm:p-9"
            initial={reduced ? false : { y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: "var(--iv-bg)", borderTop: "2px solid var(--iv-gold)" }}
          >
            {/* header */}
            <div className="flex items-start justify-between">
              <div>
                <div style={labelStyle}>{step === "done" ? "Recorded" : "Investor access"}</div>
                <h2 className="mt-1.5 text-[22px] font-extrabold tracking-tight">
                  {step === "amount" && "Choose your amount"}
                  {step === "details" && "Your details"}
                  {step === "review" && "Review & acknowledge"}
                  {step === "done" && "You're on the list"}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-2 transition-colors hover:bg-black/5"
                style={{ cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* progress */}
            {step !== "done" && (
              <div className="mt-5 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                    style={{ background: i <= STEP_INDEX[step] ? "var(--iv-gold)" : "var(--iv-border)" }}
                  />
                ))}
              </div>
            )}

            {/* step: amount */}
            {step === "amount" && (
              <div className="mt-7">
                <label style={labelStyle} htmlFor="ia-amount">
                  Intended investment
                </label>
                <div className="mt-2 flex items-center gap-1 border-b pb-2" style={{ borderColor: "var(--iv-ink)" }}>
                  <span className="iv-num text-[30px] font-bold" style={{ color: "var(--iv-warmgray)" }}>
                    $
                  </span>
                  <input
                    id="ia-amount"
                    className="iv-input !text-[30px]"
                    inputMode="numeric"
                    value={amount.toLocaleString("en-US")}
                    onChange={(e) => {
                      const d = Number(e.target.value.replace(/[^0-9]/g, ""));
                      if (!Number.isNaN(d)) setAmount(Math.min(MAX_INVESTMENT, d));
                    }}
                    onBlur={() => setAmount(clamp(amount))}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {QUICK_AMOUNTS.map((q) => (
                    <button key={q} className="iv-chip" data-active={amount === q} onClick={() => setAmount(q)}>
                      {fmtUSD(q)}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-[12px] leading-relaxed" style={{ color: "var(--iv-warmgray)" }}>
                  Non-binding — this records your interest level, not a purchase.
                </p>
                <button className="iv-btn iv-btn-primary mt-6 w-full" onClick={() => setStep("details")}>
                  Continue
                  <ArrowRight size={16} strokeWidth={2.2} />
                </button>
              </div>
            )}

            {/* step: details */}
            {step === "details" && (
              <div className="mt-7 space-y-4">
                <div>
                  <label style={labelStyle} htmlFor="ia-name">Full name</label>
                  <input id="ia-name" style={inputStyle} className="mt-1.5" value={fullName}
                    onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ia-email">Email</label>
                  <input id="ia-email" type="email" style={inputStyle} className="mt-1.5" value={email}
                    onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ia-phone">Phone (optional)</label>
                  <input id="ia-phone" type="tel" style={inputStyle} className="mt-1.5" value={phone}
                    onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle} htmlFor="ia-type">Investing as</label>
                    <select id="ia-type" style={inputStyle} className="mt-1.5" value={investorType}
                      onChange={(e) => setInvestorType(e.target.value)}>
                      <option value="individual">Individual</option>
                      <option value="entity">Entity / Fund</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="ia-acc">Accredited investor</label>
                    <select id="ia-acc" style={inputStyle} className="mt-1.5" value={accredited}
                      onChange={(e) => setAccredited(e.target.value)}>
                      <option value="unsure">Not sure</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button className="iv-btn iv-btn-ghost" onClick={() => setStep("amount")}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button className="iv-btn iv-btn-primary flex-1" disabled={!validDetails}
                    style={!validDetails ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
                    onClick={() => validDetails && setStep("review")}>
                    Continue <ArrowRight size={16} strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            )}

            {/* step: review */}
            {step === "review" && (
              <div className="mt-7">
                <dl className="space-y-3 border-y py-4" style={{ borderColor: "var(--iv-border)" }}>
                  {[
                    ["Intended amount", fmtUSD(amount)],
                    ["Name", fullName.trim()],
                    ["Email", email.trim()],
                    ["Investing as", investorType === "entity" ? "Entity / Fund" : "Individual"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 text-[14px]">
                      <dt style={{ color: "var(--iv-steel)" }}>{k}</dt>
                      <dd className="iv-num font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>

                <label className="mt-5 flex cursor-pointer items-start gap-3 text-[12.5px] leading-relaxed"
                  style={{ color: "var(--iv-steel)" }}>
                  <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    I understand this is a <strong>non-binding indication of interest</strong>, not an
                    investment or an offer to sell securities. Any offering is made only through official
                    offering documents via an approved intermediary. Early-stage investments involve
                    substantial risk, including total loss.
                  </span>
                </label>

                {error && (
                  <p className="mt-4 text-[13px] font-medium" role="alert" style={{ color: "#a33d2e" }}>
                    {error}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <button className="iv-btn iv-btn-ghost" onClick={() => setStep("details")}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button className="iv-btn iv-btn-primary flex-1" disabled={!acknowledged || submitting}
                    style={!acknowledged || submitting ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
                    onClick={() => acknowledged && !submitting && submit()}>
                    {submitting ? "Recording…" : "Record my interest"}
                    {!submitting && <ArrowRight size={16} strokeWidth={2.2} />}
                  </button>
                </div>
              </div>
            )}

            {/* done */}
            {step === "done" && (
              <div className="mt-7 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ background: "rgba(183,154,99,0.15)", border: "1px solid var(--iv-gold)" }}>
                  <Check size={24} strokeWidth={2.4} style={{ color: "var(--iv-gold-deep)" }} />
                </span>
                <p className="mx-auto mt-5 max-w-sm text-[14.5px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                  Your indication of interest for <strong className="iv-num">{fmtUSD(amount)}</strong> is
                  recorded. The team will contact you at <strong>{email.trim()}</strong> with official
                  offering documents when they are available.
                </p>
                <div className="mt-7 grid gap-3">
                  <a href={CTA.talkToTeamHref} className="iv-btn iv-btn-ghost w-full">
                    Talk to the team
                  </a>
                  <button className="iv-btn iv-btn-primary w-full" onClick={() => setOpen(false)}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
