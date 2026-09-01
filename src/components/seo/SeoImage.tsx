/**
 * SeoImage — renders a registered SEO-page visual (src/data/seo-page-images.ts)
 * with correct intrinsic dimensions, lazy loading, and a visible
 * CONCEPTUAL VISUALIZATION tag on concept renders (truthfulness rule).
 * Server component; graceful placeholder while an asset is pending.
 */

import Image from "next/image";
import { getSeoImage } from "@/data/seo-page-images";

export default function SeoImage({
  id,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, 900px",
  label = true,
  ratio,
  radius = 12,
  cover = false,
}: {
  id: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  label?: boolean;
  /** Crop to this aspect ratio (e.g. "16 / 9", "4 / 3") and cover-fill it.
   *  Lets a render occupy a section half or a full-bleed band instead of
   *  sitting boxed at its native ratio inside a reading column. */
  ratio?: string;
  radius?: number;
  /** Fill a positioned parent completely (used by the media hero). */
  cover?: boolean;
}) {
  const img = getSeoImage(id);

  if (!img || img.status !== "ready") {
    return (
      <div
        aria-hidden
        className={className}
        style={{
          ...(cover
            ? { position: "absolute" as const, inset: 0 }
            : { aspectRatio: ratio ?? (img ? `${img.width} / ${img.height}` : "3 / 2") }),
          borderRadius: radius,
          width: "100%",
          background:
            "radial-gradient(70% 60% at 30% 20%, rgba(37,99,235,0.08), transparent 70%), linear-gradient(150deg, #f2f5fa, #e8edf4)",
          border: "1px solid var(--edge)",
        }}
      />
    );
  }

  return (
    <span
      className="relative block"
      style={{
        borderRadius: radius,
        overflow: "hidden",
        ...(cover
          ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
          : ratio
            ? { aspectRatio: ratio }
            : null),
      }}
    >
      <Image
        src={img.src}
        alt={img.alt}
        width={img.width}
        height={img.height}
        priority={priority}
        sizes={sizes}
        className={className}
        style={
          cover || ratio
            ? { width: "100%", height: "100%", objectFit: "cover", display: "block" }
            : { width: "100%", height: "auto", display: "block" }
        }
      />
      {label && img.conceptual && (
        <span
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            padding: "5px 9px",
            color: "var(--graphite)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(6px)",
            border: "1px solid var(--edge)",
            borderRadius: 4,
            pointerEvents: "none",
          }}
        >
          CONCEPTUAL VISUALIZATION
        </span>
      )}
    </span>
  );
}
