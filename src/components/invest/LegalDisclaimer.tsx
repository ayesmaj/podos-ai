/**
 * LegalDisclaimer — visually quiet but clear closing disclosures.
 * Server component; static text from investContent.
 */

import Image from "next/image";
import { LEGAL, CTA } from "@/data/investContent";

export default function LegalDisclaimer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--iv-border-soft)", background: "var(--iv-bg)" }}
    >
      <div className="iv-container py-14">
        <Image
          src="/podos-invest-logo.png"
          alt="PODOS AI Invest"
          width={2172}
          height={724}
          sizes="190px"
          style={{ width: "auto", height: 56 }}
          className="mb-8"
        />
        <div className="iv-label">{LEGAL.title}</div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {LEGAL.paragraphs.map((p) => (
            <p
              key={p.slice(0, 24)}
              className="text-[12.5px] leading-relaxed"
              style={{ color: "var(--iv-warmgray)" }}
            >
              {p}
            </p>
          ))}
        </div>
        <div
          className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-6 text-[12px]"
          style={{ borderColor: "var(--iv-border-soft)", fontFamily: "var(--iv-mono)", color: "var(--iv-warmgray)" }}
        >
          <span>© {new Date().getFullYear()} PODOS AI · podosai.com</span>
          <span>
            {CTA.email} · {CTA.phone}
          </span>
        </div>
      </div>
    </footer>
  );
}
