"use client";

/**
 * DeploymentJourney — five stages as a horizontal film-strip (scroll-snap
 * on touch), each with an image, one sentence and a status tag. Not five
 * identical rounded cards: a continuous strip separated by hairlines.
 */

import { JOURNEY } from "@/data/investContent";
import GeneratedSectionImage from "./GeneratedSectionImage";
import Reveal from "./Reveal";

export default function DeploymentJourney() {
  return (
    <section id="journey" className="iv-section" style={{ background: "var(--iv-beige)" }}>
      <div className="iv-container">
        <Reveal className="max-w-3xl">
          <span className="iv-eyebrow">{JOURNEY.eyebrow}</span>
          <h2 className="iv-display-md mt-5">
            {JOURNEY.headline[0]}
            <br />
            {JOURNEY.headline[1]}
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="iv-strip mt-12">
          {JOURNEY.stages.map((s) => (
            <article key={s.n} className="px-6 py-8">
              <div className="flex items-baseline justify-between">
                <span className="iv-num text-[15px] font-bold" style={{ color: "var(--iv-gold-deep)" }}>
                  {s.n}
                </span>
                <span className="iv-claim-chip">{s.tag}</span>
              </div>
              <h3 className="mt-3 text-[20px] font-extrabold tracking-tight">{s.title}</h3>
              <div className="mt-4">
                <GeneratedSectionImage id={s.imageId} sizes="420px" />
              </div>
              <p className="mt-4 text-[13.5px] leading-relaxed" style={{ color: "var(--iv-steel)" }}>
                {s.body}
              </p>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
