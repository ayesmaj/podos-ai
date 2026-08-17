/**
 * GeneratedSectionImage — renders an AI-generated visual from the
 * invest-page-images registry, with a graceful placeholder while an
 * asset is still `pending` (or failed to generate).
 *
 * Server component: no interactivity needed; next/image handles
 * WebP/AVIF delivery and lazy loading.
 */

import Image from "next/image";
import { getInvestImage } from "@/data/invest-page-images";

export default function GeneratedSectionImage({
  id,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, 60vw",
}: {
  id: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const img = getInvestImage(id);

  if (!img || img.status !== "ready") {
    // Placeholder: quiet layered gradient in the page palette, correct
    // aspect ratio so layout doesn't shift once the real asset lands.
    return (
      <div
        aria-hidden
        className={className}
        style={{
          aspectRatio: img ? `${img.width} / ${img.height}` : "3 / 2",
          borderRadius: 24,
          background:
            "radial-gradient(70% 60% at 30% 20%, rgba(202,214,232,0.55), transparent 70%), radial-gradient(60% 55% at 80% 80%, rgba(200,169,107,0.18), transparent 70%), linear-gradient(150deg, #eef1f6, #edebe4)",
          border: "1px solid rgba(20,20,20,0.07)",
        }}
      />
    );
  }

  return (
    <Image
      src={img.src}
      alt={img.alt}
      width={img.width}
      height={img.height}
      priority={priority}
      sizes={sizes}
      className={className}
      style={{ borderRadius: 24, width: "100%", height: "auto" }}
    />
  );
}
