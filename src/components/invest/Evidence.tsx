"use client";

/**
 * Evidence — the credibility wall. Renders ONLY configuration-approved
 * modules (no fabricated proof), as an editorial numbered grid with
 * status tags, closing on the founder statement. AI renders never appear
 * here — this section is deliberately typographic.
 */

import { EVIDENCE } from "@/data/investContent";
import { approvedEvidence } from "@/data/investOffering";
import GeneratedSectionImage from "./GeneratedSectionImage";
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

        <div className="mt-9 grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--iv-border)" }}>
          {modules.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.06} className={m.wide ? "sm:col-span-2" : undefined}>
              <article className="flex h-full flex-col" style={{ background: "var(--iv-white)" }}>
                {m.imageId && (
                  <div className="relative h-28 overflow-hidden">
                    <GeneratedSectionImage
                      id={m.imageId}
                      fill
                      sizes="(max-width: 640px) 100vw, 420px"
                      labelText="CONCEPT"
                      rounded={false}
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-baseline justify-between">
                      <span className="iv-num text-[13px] font-semibold" style={{ color: "var(--iv-warmgray)" }}>
                        {m.index}
                      </span>
                      <span className={`iv-claim-chip ${m.status === "verified" ? "iv-claim-chip--target" : ""}`}>
                        {STATUS_LABEL[m.status]}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[15px] font-extrabold tracking-[0.06em]">{m.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                      {m.statement}
                    </p>
                  </div>
                  {m.detail && (
                    <p className="mt-3 text-[11.5px]" style={{ color: "var(--iv-warmgray)" }}>
                      {m.detail}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}

          {/* founder statement fills the sixth grid cell — the human close
              of the credibility argument, inside the wall itself */}
          <Reveal delay={0.2}>
            <figure className="flex h-full flex-col justify-center p-6 iv-band-ink">
              <div className="iv-label" style={{ color: "var(--iv-gold)" }}>
                {EVIDENCE.founderStatement.title}
              </div>
              <blockquote className="mt-3 text-[14.5px] font-medium leading-snug">
                &ldquo;{EVIDENCE.founderStatement.text}&rdquo;
              </blockquote>
              <figcaption className="iv-label mt-4" style={{ color: "rgba(245,244,240,0.6)" }}>
                {EVIDENCE.founderStatement.name}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
