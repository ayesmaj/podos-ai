"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from "lucide-react";
import styles from "./YossiVideoSection.module.css";

/**
 * YossiVideoSection — premium custom-controls video player.
 *
 * Why custom controls instead of native `<video controls>`:
 *   - Native UI is a tonal mismatch with the rest of the site
 *   - We want a centered play overlay on first paint (a CTA), not a
 *     thin chrome strip at the bottom
 *   - Investor sites do hover-to-reveal controls — native can't do that
 *
 * Browser APIs used (no library):
 *   - video.play() / video.pause()
 *   - video.currentTime, video.duration (for scrubbing)
 *   - video.muted, video.volume
 *   - element.requestFullscreen() / document.exitFullscreen()
 *   - DOM events: 'timeupdate', 'loadedmetadata', 'play', 'pause',
 *                  'ended', 'volumechange', 'fullscreenchange'
 *
 * Accessibility:
 *   - Keyboard shortcuts while focused: Space=play/pause, M=mute,
 *     F=fullscreen, ←/→ skip 5s
 *   - All buttons have aria-labels
 *   - Scrubber + volume slider are native <input range>, screen-reader
 *     friendly
 *
 * Performance:
 *   - preload="metadata" — pulls duration + first frame, not the whole
 *     27MB file, so the section is cheap until the user hits play
 *   - faststart MP4 (transcoded via ffmpeg) — bytes start playing
 *     before the file is fully buffered
 */

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function YossiVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Player state — mirrors the underlying <video> element so UI can react.
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Controls auto-hide during playback. Mouse activity refreshes the
  // "show controls" timer; idle for 2.5s while playing hides them.
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

  // === Subscribe to native <video> events so React state mirrors reality.
  // Without this, programmatic state would drift from actual video state
  // (e.g., when the user clicks the OS-level pause in some browsers).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(v.currentTime);
    const onLoad = () => setDuration(v.duration);
    const onVolume = () => {
      setIsMuted(v.muted);
      setVolume(v.volume);
    };
    const onEnded = () => setIsPlaying(false);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onLoad);
    v.addEventListener("volumechange", onVolume);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onLoad);
      v.removeEventListener("volumechange", onVolume);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  // Fullscreen state — listen at the document level because the change
  // event fires on document, not on the element. Also handles the case
  // where the user presses Esc to exit fullscreen (we still want UI sync).
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      // Promise-returning play() can reject on some browsers if autoplay
      // policy blocks; we surface it as a no-op since user-initiated
      // play (via click) almost always succeeds.
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  }, []);

  const onVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const newVol = Number(e.target.value);
    v.volume = newVol;
    // Unmute when user drags volume up from a muted state. UX expectation:
    // moving the slider means "I want to hear this", so muted=true would
    // be confusing.
    if (newVol > 0 && v.muted) v.muted = false;
  };

  const onScrub = (e: ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    v.currentTime = Number(e.target.value);
  };

  const toggleFullscreen = useCallback(async () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (document.fullscreenElement === el) {
      await document.exitFullscreen().catch(() => {});
    } else {
      await el.requestFullscreen().catch(() => {});
    }
  }, []);

  // Auto-hide controls during playback. Mousemove refreshes the timer;
  // pausing or hovering forces them visible.
  const refreshControls = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying]);

  useEffect(() => {
    refreshControls();
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, [isPlaying, refreshControls]);

  // Keyboard shortcuts when the wrapper has focus.
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      togglePlay();
    } else if (e.key.toLowerCase() === "m") {
      e.preventDefault();
      toggleMute();
    } else if (e.key.toLowerCase() === "f") {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === "ArrowRight") {
      const v = videoRef.current;
      if (v) v.currentTime = Math.min(v.duration, v.currentTime + 5);
    } else if (e.key === "ArrowLeft") {
      const v = videoRef.current;
      if (v) v.currentTime = Math.max(0, v.currentTime - 5);
    }
  };

  return (
    <section
      id="founder-message"
      className={`${styles.section} section-pad`}
      aria-labelledby="founder-message-heading"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowIdx}>WATCH</span>
            <span className={styles.eyebrowSep}>·</span>
            75 SECONDS
          </span>
          <h2 id="founder-message-heading" className={styles.headline}>
            What we&apos;re building, and{" "}
            <span className={styles.headlineAccent}>why now</span>.
          </h2>
        </header>

        <div
          ref={wrapperRef}
          className={`${styles.player} ${isFullscreen ? styles.playerFullscreen : ""}`}
          data-controls-visible={showControls || !isPlaying ? "true" : undefined}
          onMouseMove={refreshControls}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Founder video player"
        >
          {/* eslint-disable-next-line @next/next/jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            className={styles.video}
            src="/videos/yossi.mp4"
            preload="metadata"
            playsInline
            onClick={togglePlay}
          />

          {/* Center play overlay — big tappable button on initial state
              and after pause. Fades out during playback. */}
          {!isPlaying && (
            <button
              type="button"
              className={styles.centerPlay}
              onClick={togglePlay}
              aria-label="Play video"
            >
              <Play size={28} strokeWidth={2} fill="currentColor" />
            </button>
          )}

          {/* Bottom controls bar — hides during playback after 2.5s idle */}
          <div className={styles.controls} aria-hidden={!showControls && isPlaying}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
            </button>

            <span className={styles.timeLabel}>
              {formatTime(currentTime)}{" "}
              <span className={styles.timeSep}>/</span>{" "}
              {formatTime(duration)}
            </span>

            {/* Scrubber. Step is 0.1s for smooth feel; max-value updates
                from `duration` once metadata loads. */}
            <input
              type="range"
              className={`${styles.range} ${styles.scrubber}`}
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={onScrub}
              aria-label="Scrub video"
              style={{
                ["--progress" as string]: duration
                  ? `${(currentTime / duration) * 100}%`
                  : "0%",
              }}
            />

            <div className={styles.volumeWrap}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>
              <input
                type="range"
                className={`${styles.range} ${styles.volume}`}
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={onVolumeChange}
                aria-label="Volume"
                style={{
                  ["--progress" as string]: `${(isMuted ? 0 : volume) * 100}%`,
                }}
              />
            </div>

            <button
              type="button"
              className={styles.iconBtn}
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
