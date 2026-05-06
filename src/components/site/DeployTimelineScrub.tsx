"use client";

import { useEffect, useRef } from "react";
import styles from "./DeployTimelineScrub.module.css";

/**
 * DeployTimelineScrub — inline autoplay video.
 *
 * The previous scroll-scrub (sticky 250vh runway + JS-pinned stage)
 * had two unfixable issues in this layout:
 *   1. The PodosPod parent has `overflow: hidden`, which kills
 *      `position: sticky`. We worked around it with `position: fixed`,
 *      but a fixed full-viewport stage visually covered the section
 *      above (OptimusInteractive) — the "section above disappears" bug.
 *   2. The 250vh runway introduced a giant empty area below the video
 *      that felt like dead space.
 *
 * Replaced with the simplest reliable approach: a regular block-flow
 * video that autoplays muted once it enters the viewport, and pauses
 * when it leaves. No scroll lock, no fixed positioning — the rest of
 * the page scrolls past it normally.
 */
export default function DeployTimelineScrub() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Try to play. Some browsers reject programmatic play if
            // the doc hasn't been interacted with — that's fine, the
            // user can scroll, and video stays at first frame.
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.35 }
    );
    io.observe(video);

    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <video
          ref={videoRef}
          className={styles.video}
          src="/deploy-timeline.mp4"
          muted
          playsInline
          preload="auto"
          loop
        />
        <span className={styles.eyebrow}>
          DEPLOY · 90–120 DAYS · FACTORY TO FIRST MW
        </span>
      </div>
    </div>
  );
}
