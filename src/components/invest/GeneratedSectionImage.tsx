/**
 * GeneratedSectionImage — renders an AI-generated visual from the
 * invest-page-images registry with a graceful placeholder while pending.
 *
 * Truthfulness rule: assets flagged `conceptual` carry a visible
 * CONCEPTUAL VISUALIZATION tag (suppress per-instance with `label={false}`
 * only where the surrounding section already labels the imagery, e.g. the
 * film footnote or the scale model's ILLUSTRATIVE tag).
 */

import Image from "next/image";
import { getInvestImage } from "@/data/invest-page-images";

export default function GeneratedSectionImage({
  id,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, 60vw",
  label = true,
  labelText,
  fill = false,
  rounded = true,
}: {
  id: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  /** show the conceptual tag (when the asset is conceptual) */
  label?: boolean;
  labelText?: string;
  /** render as an absolutely-filled cover image inside a relative parent */
  fill?: boolean;
  rounded?: boolean;
}) {
  const img = getInvestImage(id);

  if (!img || img.status !== "ready") {
    return (
      <div
        aria-hidden
        className={className}
        style={{
          aspectRatio: img ? `${img.width} / ${img.height}` : "3 / 2",
          borderRadius: rounded ? 12 : 0,
          width: "100%",
          height: fill ? "100%" : undefined,
          background:
            "radial-gradient(70% 60% at 30% 20%, rgba(218,229,241,0.6), transparent 70%), radial-gradient(60% 55% at 80% 80%, rgba(183,154,99,0.14), transparent 70%), linear-gradient(150deg, #f2f1ec, #e7e4db)",
          border: "1px solid rgba(23,25,27,0.07)",
        }}
      />
    );
  }

  const tag =
    label && img.conceptual ? (
      <span className="iv-concept-tag">{labelText ?? "CONCEPTUAL VISUALIZATION"}</span>
    ) : null;

  if (fill) {
    return (
      <span className="absolute inset-0 block">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={className}
          style={{ objectFit: "cover" }}
        />
        {tag}
      </span>
    );
  }

  return (
    <span className="iv-figure block" style={{ borderRadius: rounded ? 12 : 0 }}>
      <Image
        src={img.src}
        alt={img.alt}
        width={img.width}
        height={img.height}
        priority={priority}
        sizes={sizes}
        className={className}
        style={{ width: "100%", height: "auto" }}
      />
      {tag}
    </span>
  );
}
