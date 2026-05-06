"use client";

import type { FC } from "react";
import Image from "next/image";

/**
 * Sticky-stack parallax card list.
 *
 * Each card is `position: sticky; top: 0` and full-viewport height.
 * As the user scrolls, the current card stays pinned to the viewport
 * top while the next one slides up over it — the browser handles the
 * stack layering for free; no JS needed.
 *
 * Adapted from the upstream `scroll-cards` component to use this
 * project's typography tokens (--font-display, --font-body) and
 * Next.js `<Image>` with `fill` (the upstream `layout="fill"` is
 * deprecated in next/image v13+).
 */

export interface ScrollCardItem {
  /** Headline. Renders huge inside the card. */
  title: string;
  /** One-line subhead under the title. */
  description: string;
  /** Small uppercase code or label (e.g. "U-02"). */
  tag: string;
  /** Hero image src. Rendered full-bleed behind the title with a dark overlay. */
  src: string;
  /** Optional click-through. Use `#` if there is no destination yet. */
  link?: string;
  /** Fallback solid color shown until the image loads (and as a tinted scrim). */
  color?: string;
  /** Foreground text color — choose for contrast against `src`. */
  textColor?: string;
}

interface CardProps extends Omit<ScrollCardItem, "src" | "link"> {
  i: number;
  src: string;
  total: number;
}

const Card: FC<CardProps> = ({
  title,
  description,
  tag,
  color = "#0b1628",
  textColor = "#ffffff",
  src,
  i,
  total,
}) => {
  // Each successive card sits a touch lower than the previous one so
  // the stack visibly thickens as the user scrolls — gives the
  // sticky pin a sense of depth instead of a perfectly stacked deck.
  const topOffset = `calc(${i * 24}px)`;

  return (
    <div className="h-screen flex items-center justify-center sticky top-0 px-4 md:px-0">
      <div
        className="relative flex flex-col h-[420px] w-full max-w-[820px] rounded-3xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: color,
          top: topOffset,
        }}
      >
        {/* Background image — full-bleed under the copy. */}
        <div className="absolute inset-0 z-0">
          <Image
            className="object-cover"
            src={src}
            alt=""
            fill
            sizes="(max-width: 880px) 100vw, 820px"
            unoptimized
            priority={i < 2}
          />
          {/* Dark gradient scrim so the title and body always have
              contrast no matter what hero image is behind. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,13,26,0.15) 0%, rgba(5,13,26,0.55) 60%, rgba(5,13,26,0.85) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-12">
          {/* Tag pill */}
          <span
            className="inline-flex items-center self-start mb-4 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-medium tracking-[0.2em] uppercase"
            style={{ color: textColor }}
          >
            {tag}
            <span className="ml-2 opacity-50">
              {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </span>

          {/* Title — uses the site's display font */}
          <h3
            className="font-extrabold tracking-tight text-4xl md:text-6xl leading-[1.02] mb-4"
            style={{
              color: textColor,
              fontFamily: "var(--font-display)",
              textShadow: "0 2px 24px rgba(0,0,0,0.55)",
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            className="text-base md:text-lg leading-relaxed max-w-[60ch]"
            style={{
              color: textColor,
              fontFamily: "var(--font-body)",
              opacity: 0.92,
              textShadow: "0 1px 14px rgba(0,0,0,0.5)",
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

interface CardsParallaxProps {
  items: ScrollCardItem[];
}

export const CardsParallax: FC<CardsParallaxProps> = ({ items }) => {
  return (
    <div>
      {items.map((item, i) => (
        <Card key={`scroll-card-${i}`} {...item} i={i} total={items.length} />
      ))}
    </div>
  );
};
