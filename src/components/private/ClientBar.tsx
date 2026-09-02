import Image from "next/image";
import Link from "next/link";
import { LockKeyhole, BadgeCheck } from "lucide-react";
import s from "./private.module.css";

/**
 * ClientBar — the minimal confidential utility bar for every client surface
 * (welcome, configurator, proposal). Per the redesign brief §6: official
 * logo, CONFIDENTIAL label, project + reference, prepared-for, optional right
 * slot (save state / step / exit). Never the marketing nav.
 */
export default function ClientBar({
  publicId,
  project,
  preparedFor,
  verified = true,
  label = "Confidential",
  right,
}: {
  publicId: string;
  project: string | null;
  preparedFor: string;
  verified?: boolean;
  label?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className={s.bar} role="banner">
      <Link href={`/client/proposals/${publicId}`} aria-label="PODOS AI — your proposal workspace" style={{ display: "inline-flex", alignItems: "center" }}>
        <Image src="/logo.png" alt="PODOS AI" width={82} height={28} priority sizes="82px" style={{ height: 28, width: "auto" }} />
      </Link>
      <span className={s.barSep} aria-hidden />
      <span className={`${s.chip} ${s.chipBrand}`}>
        <LockKeyhole size={12} strokeWidth={2} aria-hidden /> {label}
      </span>
      <span className={s.barSep} aria-hidden />
      <div className={s.barMeta}>
        <span style={{ fontSize: 13, color: "var(--ink-dim)" }}>
          Project: <strong style={{ color: "var(--brand-deep)", fontWeight: 600 }}>{project ?? "PODOS deployment"}</strong>
        </span>
        <span className={s.label} style={{ letterSpacing: "0.06em", textTransform: "none", fontSize: 11.5 }}>Ref: {publicId}</span>
      </div>
      <span className={s.barSep} aria-hidden />
      <div className={`${s.barMeta} ${s.barHideMobile}`}>
        <span className={s.label}>Prepared for</span>
        <span style={{ fontSize: 13.5, color: "var(--ink-strong)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
          {preparedFor}
          {verified && <BadgeCheck size={15} strokeWidth={2} color="#15803D" aria-label="verified recipient" />}
        </span>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.8rem" }}>{right}</div>
    </header>
  );
}
