"use client";

import styles from "./BackgroundLayers.module.css";

/**
 * Composable cyber-tech background layers.
 *
 * Each section picks 2–4 of these to build its signature atmosphere.
 * All layers are light-weight (CSS + SVG only, no canvas/WebGL), stay
 * beneath content (z-index 0–1), and ignore pointer events so they
 * never interfere with scrolling or clicks.
 *
 * Exports:
 *   <GridField variant />      — animated architectural grid
 *   <GridDots />               — Palantir-style dotted field
 *   <AmbientOrbs />            — soft floating light sources
 *   <EnergyFlow />             — horizontal energy streamer(s)
 *   <CircuitTraces />          — animated circuit-board lines
 *   <Particles />              — faint drifting particle mesh
 *   <GradientWash />           — ambient diagonal color wash
 *   <VignetteLight />          — subtle edge darkening
 */

/* ----------------------------------------------------------------- */
/* GRID FIELD                                                         */
/* ----------------------------------------------------------------- */
export function GridField({
  variant = "default",
}: {
  variant?: "default" | "dense" | "sparse";
}) {
  const cls =
    variant === "dense"
      ? styles.gridFieldDense
      : variant === "sparse"
        ? styles.gridFieldSparse
        : styles.gridField;
  return <div className={cls} aria-hidden />;
}

export function GridDots() {
  return <div className={styles.gridDots} aria-hidden />;
}

/* ----------------------------------------------------------------- */
/* AMBIENT ORBS — soft color light sources                            */
/* ----------------------------------------------------------------- */
export function AmbientOrbs({
  config = "default",
}: {
  config?: "default" | "electric" | "teal" | "tri";
}) {
  if (config === "electric") {
    return (
      <>
        <div
          className={`${styles.orb} ${styles.orbElectric} ${styles.orbFloat}`}
          style={{ top: "-10%", right: "-5%", width: "620px", height: "620px" }}
          aria-hidden
        />
        <div
          className={`${styles.orb} ${styles.orbSky}`}
          style={{ bottom: "-15%", left: "-10%", width: "540px", height: "540px", animationDelay: "-4s" }}
          aria-hidden
        />
      </>
    );
  }
  if (config === "teal") {
    return (
      <>
        <div
          className={`${styles.orb} ${styles.orbTeal} ${styles.orbFloat}`}
          style={{ top: "20%", left: "-8%", width: "500px", height: "500px" }}
          aria-hidden
        />
        <div
          className={`${styles.orb} ${styles.orbElectric}`}
          style={{ bottom: "-10%", right: "-5%", width: "460px", height: "460px", animationDelay: "-7s" }}
          aria-hidden
        />
      </>
    );
  }
  if (config === "tri") {
    return (
      <>
        <div
          className={`${styles.orb} ${styles.orbElectric} ${styles.orbFloat}`}
          style={{ top: "-5%", left: "12%", width: "520px", height: "520px" }}
          aria-hidden
        />
        <div
          className={`${styles.orb} ${styles.orbTeal}`}
          style={{ top: "40%", right: "-5%", width: "480px", height: "480px", animationDelay: "-5s" }}
          aria-hidden
        />
        <div
          className={`${styles.orb} ${styles.orbGold}`}
          style={{ bottom: "-10%", left: "35%", width: "440px", height: "440px", animationDelay: "-9s" }}
          aria-hidden
        />
      </>
    );
  }

  // default
  return (
    <>
      <div
        className={`${styles.orb} ${styles.orbElectric} ${styles.orbFloat}`}
        style={{ top: "10%", right: "8%", width: "560px", height: "560px" }}
        aria-hidden
      />
      <div
        className={`${styles.orb} ${styles.orbTeal}`}
        style={{ bottom: "5%", left: "5%", width: "480px", height: "480px", animationDelay: "-6s" }}
        aria-hidden
      />
    </>
  );
}

/* ----------------------------------------------------------------- */
/* ENERGY FLOW — horizontal streamers                                 */
/* ----------------------------------------------------------------- */
export function EnergyFlow({
  lines = 3,
}: {
  lines?: number;
}) {
  // Deterministic placement so React doesn't remount different DOM per render
  const items = Array.from({ length: lines }, (_, i) => ({
    top: `${15 + ((i * 37) % 75)}%`,
    variant: i % 3 === 0 ? "teal" : i % 3 === 1 ? "sky" : "default",
    delay: `${(i * 1.7) % 6}s`,
    duration: `${8 + (i % 3) * 2}s`,
  }));
  return (
    <div aria-hidden>
      {items.map((it, i) => {
        const cls =
          it.variant === "teal"
            ? `${styles.energyFlow} ${styles.energyFlowTeal}`
            : it.variant === "sky"
              ? `${styles.energyFlow} ${styles.energyFlowSky}`
              : styles.energyFlow;
        return (
          <div
            key={i}
            className={cls}
            style={{
              top: it.top,
            }}
          >
            <style>{`.ef-${i}::before { animation-delay: ${it.delay}; animation-duration: ${it.duration}; }`}</style>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* CIRCUIT TRACES — SVG lines with animated dashes + pulsing nodes    */
/* ----------------------------------------------------------------- */
export function CircuitTraces({ accent = "electric" }: { accent?: "electric" | "teal" | "mixed" }) {
  const nodeClass =
    accent === "teal"
      ? styles.circuitNodeTeal
      : styles.circuitNode;

  return (
    <div className={styles.circuitLayer} aria-hidden>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {/* Horizontal trunks */}
        <path className={styles.circuitPath} d="M 0 200 L 420 200 L 460 240 L 800 240 L 840 200 L 1440 200" />
        <path className={styles.circuitPath} d="M 0 480 L 280 480 L 320 440 L 680 440 L 720 480 L 1440 480" style={{ animationDelay: "-1.5s" }} />
        <path className={styles.circuitPath} d="M 0 720 L 520 720 L 560 680 L 960 680 L 1000 720 L 1440 720" style={{ animationDelay: "-3s" }} />
        {/* Verticals */}
        <path className={styles.circuitPath} d="M 240 0 L 240 140 L 280 180 L 280 380" style={{ animationDelay: "-0.5s" }} />
        <path className={styles.circuitPath} d="M 1160 0 L 1160 160 L 1120 200 L 1120 420" style={{ animationDelay: "-2s" }} />
        <path className={styles.circuitPath} d="M 760 520 L 760 620 L 800 660 L 800 900" style={{ animationDelay: "-2.5s" }} />

        {/* Nodes */}
        <circle className={nodeClass} cx="420" cy="200" r="3.5" />
        <circle className={nodeClass} cx="840" cy="200" r="3.5" style={{ animationDelay: "-0.8s" }} />
        <circle className={nodeClass} cx="320" cy="440" r="3.5" style={{ animationDelay: "-1.4s" }} />
        <circle className={nodeClass} cx="720" cy="480" r="3.5" style={{ animationDelay: "-2s" }} />
        <circle className={nodeClass} cx="560" cy="680" r="3.5" style={{ animationDelay: "-0.3s" }} />
        <circle className={nodeClass} cx="1000" cy="720" r="3.5" style={{ animationDelay: "-1.9s" }} />
        <circle
          className={accent === "mixed" ? styles.circuitNodeTeal : nodeClass}
          cx="280"
          cy="180"
          r="3"
          style={{ animationDelay: "-1.1s" }}
        />
        <circle
          className={accent === "mixed" ? styles.circuitNodeTeal : nodeClass}
          cx="1120"
          cy="200"
          r="3"
          style={{ animationDelay: "-2.3s" }}
        />
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* PARTICLES — drifting faint energy dots                             */
/* ----------------------------------------------------------------- */
export function Particles({ count = 18 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 73) % 100}%`,
    top: `${(i * 41) % 100}%`,
    dx: `${((i % 5) - 2) * 40}px`,
    dy: `${((i % 7) - 3) * 30}px`,
    delay: `${(i * 0.7) % 6}s`,
    duration: `${10 + (i % 5) * 2}s`,
    variant: i % 3 === 0 ? "teal" : i % 3 === 1 ? "sky" : "default",
  }));
  return (
    <div className={styles.particles} aria-hidden>
      {items.map((p, i) => {
        const cls =
          p.variant === "teal"
            ? `${styles.particle} ${styles.particleTeal}`
            : p.variant === "sky"
              ? `${styles.particle} ${styles.particleSky}`
              : styles.particle;
        return (
          <span
            key={i}
            className={cls}
            style={
              {
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration,
                ["--dx" as string]: p.dx,
                ["--dy" as string]: p.dy,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* GRADIENT WASH                                                      */
/* ----------------------------------------------------------------- */
export function GradientWash({
  accent = "electric",
}: {
  accent?: "electric" | "teal";
}) {
  return (
    <div
      className={accent === "teal" ? styles.washTeal : styles.washElectric}
      aria-hidden
    />
  );
}

/* ----------------------------------------------------------------- */
/* VIGNETTE                                                           */
/* ----------------------------------------------------------------- */
export function VignetteLight() {
  return <div className={styles.vignetteLight} aria-hidden />;
}
