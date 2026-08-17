"use client";

/**
 * Evidence — the credibility wall. Renders ONLY configuration-approved
 * modules (no fabricated proof), as an editorial numbered grid with
 * status tags, closing on the founder statement. AI renders never appear
 * here — this section is deliberately typographic.
 */

import { EVIDENCE } from "@/data/investContent";
import { approvedEvidence } from "@/data/investOffering";
import Reveal from "./Reveal";

const STATUS_LABEL: Record<string, string> = {
  verified: "VERIFIED",
  "in-progress": "IN PROGRESS",
  target: "TARGET",
  conceptual: "CONCEPT",
};

export default function Evidence() {
  const modules = approvedEvidence();

  return (
    <section id="evidence" className="iv-section" style={{ background: "var(--iv-white)" }}>
      <div className="iv-container">
        <Reveal className="max-w-3xl">
          <span className="iv-eyebrow">{EVIDENCE.eyebrow}</span>
          <h2 className="iv-display mt-5">
            {EVIDENCE.headline[0]}
            <br />
            {EVIDENCE.headline[1]}
          </h2>
          <p className="iv-sub mt-6">{EVIDENCE.sub}</p>
        </Reveal>

        <div className="mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--iv-border)" }}>
          {modules.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.06}>
              <article className="flex h-full flex-col justify-between p-7" style={{ background: "var(--iv-white)" }}>
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="iv-num text-[13px] font-semibold" style={{ color: "var(--iv-warmgray)" }}>
                      {m.index}
                    </span>
                    <span className={`iv-claim-chip ${m.status === "verified" ? "iv-claim-chip--target" : ""}`}>
                      {STATUS_LABEL[m.status]}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[16px] font-extrabold tracking-[0.06em]">{m.title}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                    {m.statement}
                  </p>
                </div>
                {m.detail && (
                  <p className="mt-4 text-[12px]" style={{ color: "var(--iv-warmgray)" }}>
                    {m.detail}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {/* founder statement — the human close of the credibility argument */}
        <Reveal delay={0.1}>
          <figure className="mx-auto mt-20 max-w-3xl border-l-2 pl-8" style={{ borderColor: "var(--iv-gold)" }}>
            <div className="iv-label">{EVIDENCE.founderStatement.title}</div>
            <blockquote
              className="mt-4 text-[clamp(1.15rem,2vw,1.45rem)] font-medium leading-snug tracking-tight"
            >
              &ldquo;{EVIDENCE.founderStatement.text}&rdquo;
            </blockquote>
            <figcaption className="iv-label mt-5">{EVIDENCE.founderStatement.name}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
