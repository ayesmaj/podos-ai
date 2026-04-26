"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Zap, Leaf } from "lucide-react";
import styles from "./SyntropicConsole.module.css";
import { WorldMap, type WorldMapArc } from "@/components/ui/world-map";
import {
  GridField,
  AmbientOrbs,
  CircuitTraces,
  Particles,
  VignetteLight,
} from "./BackgroundLayers";

/**
 * SYNTROPIC OPERATOR CONSOLE — mockup/syntropic-console
 *
 * The product-UI glimpse. Answers the LP question investors don't say
 * out loud during a compression-software pitch: "is this actually a
 * product people use, or an algorithms demo?" by showing the operator
 * surface a hyperscaler pilot customer sees on day one.
 *
 * Four tiles, deck-canonical content:
 *   1. FLEET MAP — global Pod deployment arcs across target markets
 *   2. DEPLOYMENT FEED — live events from a hyperscaler pilot
 *   3. TOKENS/SEC CHART — the 10× FUSION capacity multiplier in action
 *   4. CAPABILITY CARDS — two operator-facing Syntropic features
 *
 * This is a standalone mockup page, not part of the 12-section main
 * narrative arc — which keeps the primary pitch's attention budget
 * intact while giving investor calls a "here's a deeper product look"
 * surface to share.
 */

/* ------------------------------------------------------------------ */
/* FLEET MAP · PODOS deployment arcs across target markets             */
/* ------------------------------------------------------------------ */
const POD_DEPLOYMENT_ARCS: WorldMapArc[] = [
  {
    start: { lat: 37.3861, lng: -122.0839, label: "HQ · SV" },   // Silicon Valley
    end: { lat: 1.3521, lng: 103.8198, label: "Pod-A17 · SG" },  // Singapore
  },
  {
    start: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
    end: { lat: -33.8688, lng: 151.2093, label: "Pod-B09 · SYD" }, // Sydney
  },
  {
    start: { lat: 53.3498, lng: -6.2603, label: "Dublin" },
    end: { lat: 25.2048, lng: 55.2708, label: "Pod-C04 · DXB" }, // Dubai
  },
  {
    start: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
    end: { lat: 37.5665, lng: 126.978, label: "Pod-D02 · ICN" }, // Seoul
  },
  {
    start: { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
    end: { lat: 25.7617, lng: -80.1918, label: "Pod-E07 · MIA" }, // Miami
  },
  {
    start: { lat: 51.5074, lng: -0.1278, label: "London" },
    end: { lat: 50.1109, lng: 8.6821, label: "Pod-F12 · FRA" }, // Frankfurt
  },
];

/* ------------------------------------------------------------------ */
/* DEPLOYMENT FEED · events from day-1 of a hyperscaler pilot          */
/* ------------------------------------------------------------------ */
type FeedTone = "brand" | "cyan" | "status" | "mixed";
interface FeedEvent {
  code: string;
  tone: FeedTone;
  title: string;
  detail: string;
  time: string;
}
const FEED_EVENTS: FeedEvent[] = [
  {
    code: "PA",
    tone: "brand",
    title: "Pod-A17 · commissioned",
    detail: "Singapore cluster · 842 kW · thermals green",
    time: "now",
  },
  {
    code: "SY",
    tone: "cyan",
    title: "Syntropic v1.4 · live",
    detail: "KV compression 2.8× · <0.1ms streaming",
    time: "1m",
  },
  {
    code: "MS",
    tone: "mixed",
    title: "MEGA SILO N₂ · stable",
    detail: "3.2 atm · 24 pods hot · density ×83",
    time: "4m",
  },
  {
    code: "OR",
    tone: "status",
    title: "ORC heat reclaim · online",
    detail: "98 kW recovered · $57K/yr/pod run-rate",
    time: "12m",
  },
  {
    code: "MX",
    tone: "brand",
    title: "Workload · mixtral-8x22b",
    detail: "Scheduled on Pod-A17 · 2M-token context",
    time: "18m",
  },
  {
    code: "CO",
    tone: "status",
    title: "Carbon attribution · enabled",
    detail: "Per-inference CO₂ · ESG report ready",
    time: "26m",
  },
];

/* ------------------------------------------------------------------ */
/* CHART · tokens/sec per Pod — PODOS vs. Traditional DC baseline      */
/* ------------------------------------------------------------------ */
const CHART_MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const CHART_PODOS = [56, 120, 300, 600, 1200, 2400];   // exponential — 10× by Oct
const CHART_TRAD = [56, 90, 126, 170, 200, 240];       // linear baseline

/* ------------------------------------------------------------------ */
/* CAPABILITY CARDS · operator-facing Syntropic features               */
/* ------------------------------------------------------------------ */
interface Capability {
  code: string;
  title: string;
  detail: string;
  Icon: typeof Zap;
}
const CAPABILITIES: Capability[] = [
  {
    code: "OP-01",
    title: "Zero-config migration",
    detail:
      "Any GPU workload · any model format · no code changes. Drop the Syntropic runtime, keep your stack.",
    Icon: Zap,
  },
  {
    code: "OP-02",
    title: "Per-workload carbon",
    detail:
      "CO₂ attribution for every inference · automatic ESG-report drops. Paid for by the ORC reclaim alone.",
    Icon: Leaf,
  },
];

/* ================================================================== */
/* SECTION                                                             */
/* ================================================================== */
export default function SyntropicConsole() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const t = reduce ? 0 : 1;

  return (
    <section
      id="syntropic-console"
      ref={ref}
      className={`${styles.section} section-pad`}
      aria-labelledby="sc-heading"
    >
      <div className={styles.bg} aria-hidden>
        <GridField variant="sparse" />
        <AmbientOrbs config="teal" />
        <CircuitTraces accent="mixed" />
        <Particles count={10} />
        <VignetteLight />
      </div>

      <div className={`container-site ${styles.container}`}>
        {/* ============== HEADER ============== */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 * t, ease: "easeOut" }}
        >
          <span className="t-eyebrow">
            <span className={styles.eyebrowIdx}>M1</span>
            <span className={styles.eyebrowSep}>·</span>
            OPERATOR CONSOLE · DAY-1 PREVIEW
          </span>
          <h2 id="sc-heading" className={`${styles.headline} t-display`}>
            <span className="t-sweep-brand">Syntropic,</span> live &mdash; the software
            your team actually touches.
          </h2>
          <p className={styles.lede}>
            A walk-through of the operator surface a hyperscaler pilot customer
            sees in the first 72&nbsp;hours. Fleet telemetry, deployment events,
            capacity curves &mdash; all on the same compression runtime that
            delivers the 85&times; build-cost multiplier from Section 05.
          </p>
        </motion.header>

        {/* ============== 2×2 GRID ============== */}
        <div className={styles.grid}>
          {/* ---------- TILE 1 · FLEET MAP ---------- */}
          <motion.article
            className={`${styles.tile} ${styles.mapTile}`}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 * t, delay: 0.2 * t, ease: "easeOut" }}
          >
            <header className={styles.tileHead}>
              <span className={styles.tileTag}>
                <span className={styles.tileTagDot} aria-hidden />
                FLEET · GLOBAL POD PRESENCE
              </span>
              <span className={styles.tileMeta}>6 live · 0 degraded</span>
            </header>
            <h3 className={styles.tileTitle}>Pods hot across 6 regions.</h3>
            <p className={styles.tileSubtitle}>
              Anchors connect HQ sites to regional pods. Each arc is an active
              deployment cohort.
            </p>
            <div className={styles.mapFrame}>
              <div className={styles.mapBadge}>
                <span className={styles.mapBadgeDot} aria-hidden />
                Pod-A17 · Hot · 842 kW
              </div>
              <WorldMap
                dots={POD_DEPLOYMENT_ARCS}
                lineColor="#22D3EE"
                /* Let the primitive's new light-paper defaults apply — was
                   overriding to 0.22 opacity which rendered invisible. */
                showLabels
                animationDuration={1.8}
              />
            </div>
          </motion.article>

          {/* ---------- TILE 2 · DEPLOYMENT FEED ---------- */}
          <motion.article
            className={`${styles.tile} ${styles.feedTile}`}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 * t, delay: 0.32 * t, ease: "easeOut" }}
          >
            <header className={styles.tileHead}>
              <span className={styles.tileTag}>
                <span className={styles.tileTagDot} aria-hidden />
                DEPLOYMENT · LAST 72h
              </span>
              <span className={styles.tileMeta}>Pilot · Anchor</span>
            </header>
            <h3 className={styles.tileTitle}>
              First hyperscaler pilot is live.
            </h3>
            <p className={styles.tileSubtitle}>
              Events are streaming from Pod-A17 in Singapore &mdash; each one
              ties a deck claim to a timestamp.
            </p>
            <ul className={styles.feedList}>
              {FEED_EVENTS.map((e, i) => (
                <motion.li
                  key={e.code}
                  className={styles.feedItem}
                  initial={{ opacity: 0, x: 8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.45 * t,
                    delay: (0.5 + i * 0.08) * t,
                    ease: "easeOut",
                  }}
                >
                  <span
                    className={`${styles.feedIcon} ${
                      styles[
                        `feedIcon${e.tone.charAt(0).toUpperCase() + e.tone.slice(1)}`
                      ]
                    }`}
                    aria-hidden
                  >
                    {e.code}
                  </span>
                  <span className={styles.feedBody}>
                    <span className={styles.feedTitle}>{e.title}</span>
                    <span className={styles.feedDetail}>{e.detail}</span>
                  </span>
                  <span className={styles.feedTime}>{e.time}</span>
                </motion.li>
              ))}
            </ul>
          </motion.article>

          {/* ---------- TILE 3 · TOKENS/SEC CHART ---------- */}
          <motion.article
            className={`${styles.tile} ${styles.chartTile}`}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 * t, delay: 0.44 * t, ease: "easeOut" }}
          >
            <header className={styles.tileHead}>
              <span className={styles.tileTag}>
                <span className={styles.tileTagDot} aria-hidden />
                SYNTROPIC · TOKENS/SEC PER POD
              </span>
              <span className={styles.tileMeta}>6-month · measured</span>
            </header>
            <h3 className={styles.tileTitle}>10&times; capacity, same silicon.</h3>
            <p className={styles.tileSubtitle}>
              PODOS pods ramp from parity in May to 10&times; the traditional
              DC baseline by October &mdash; the Section 05 economics, charted.
            </p>
            <div className={styles.chartFrame}>
              <TokensChart
                months={CHART_MONTHS}
                podos={CHART_PODOS}
                trad={CHART_TRAD}
                animate={inView}
                t={t}
              />
            </div>
            <div className={styles.chartLegend}>
              <span className={styles.chartLegendItem}>
                <span
                  className={`${styles.chartSwatch} ${styles.chartSwatchPodos}`}
                  aria-hidden
                />
                PODOS · Syntropic runtime
              </span>
              <span className={styles.chartLegendItem}>
                <span
                  className={`${styles.chartSwatch} ${styles.chartSwatchTrad}`}
                  aria-hidden
                />
                Traditional DC baseline
              </span>
              <span className={styles.chartReadout}>
                Oct &middot; 2,400 tok/s &middot; +10&times;
              </span>
            </div>
          </motion.article>

          {/* ---------- TILE 4 · CAPABILITY CARDS ---------- */}
          <motion.div
            className={`${styles.tile} ${styles.capTile}`}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 * t, delay: 0.56 * t, ease: "easeOut" }}
          >
            <div className={styles.capGrid}>
              {CAPABILITIES.map((c, i) => {
                const Icon = c.Icon;
                return (
                  <motion.article
                    key={c.code}
                    className={styles.capCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.55 * t,
                      delay: (0.75 + i * 0.1) * t,
                      ease: "easeOut",
                    }}
                  >
                    <span className={styles.capTag}>
                      <Icon className={styles.capIcon} aria-hidden />
                      {c.code}
                    </span>
                    <h4 className={styles.capTitle}>{c.title}</h4>
                    <p className={styles.capDetail}>{c.detail}</p>
                    <span className={styles.capArrow} aria-hidden>
                      <ArrowUpRight size={16} />
                    </span>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   TokensChart · pure SVG area chart (no recharts dependency)
   Two series: PODOS (brand-gradient fill) + Traditional DC (muted line)
   Path animations drive in on viewport-enter.
   ================================================================== */
function TokensChart({
  months,
  podos,
  trad,
  animate,
  t,
}: {
  months: string[];
  podos: number[];
  trad: number[];
  animate: boolean;
  t: number;
}) {
  // Viewport in chart units — keep aspect ratio roomy so axis labels breathe.
  const W = 600;
  const H = 220;
  const PAD_X = 28;
  const PAD_Y = 22;
  const PAD_BOTTOM = 34; // leave room for x-axis labels

  const yMax = Math.max(...podos, ...trad) * 1.1;
  const xStep = (W - 2 * PAD_X) / (months.length - 1);

  const toPoint = (i: number, value: number) => ({
    x: PAD_X + i * xStep,
    y: H - PAD_BOTTOM - (value / yMax) * (H - PAD_BOTTOM - PAD_Y),
  });

  const buildLine = (series: number[]) =>
    series
      .map((v, i) => {
        const p = toPoint(i, v);
        return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      })
      .join(" ");

  const buildArea = (series: number[]) => {
    const first = toPoint(0, series[0]);
    const last = toPoint(series.length - 1, series[series.length - 1]);
    const body = buildLine(series);
    return `M ${first.x} ${H - PAD_BOTTOM} L ${first.x} ${first.y} ${body
      .slice(2)} L ${last.x} ${H - PAD_BOTTOM} Z`;
  };

  // y-axis gridlines at 25/50/75/100% of max
  const gridTicks = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={styles.chartSvg}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Tokens per second per Pod — PODOS vs. Traditional DC, 6-month ramp"
    >
      <defs>
        <linearGradient id="sc-area-podos" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
          <stop offset="65%" stopColor="#2563EB" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sc-line-podos" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {gridTicks.map((gt) => {
        const y = PAD_Y + (1 - gt) * (H - PAD_BOTTOM - PAD_Y);
        return (
          <line
            key={gt}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={y}
            y2={y}
            stroke="rgba(15,23,42,0.06)"
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Traditional DC line (baseline) */}
      <motion.path
        d={buildLine(trad)}
        fill="none"
        stroke="rgba(15,23,42,0.28)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        initial={{ pathLength: 0 }}
        animate={animate ? { pathLength: 1 } : {}}
        transition={{ duration: 1.2 * t, delay: 0.7 * t, ease: "easeOut" }}
      />

      {/* PODOS area fill */}
      <motion.path
        d={buildArea(podos)}
        fill="url(#sc-area-podos)"
        initial={{ opacity: 0 }}
        animate={animate ? { opacity: 1 } : {}}
        transition={{ duration: 0.9 * t, delay: 1.2 * t, ease: "easeOut" }}
      />

      {/* PODOS line */}
      <motion.path
        d={buildLine(podos)}
        fill="none"
        stroke="url(#sc-line-podos)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={animate ? { pathLength: 1 } : {}}
        transition={{ duration: 1.4 * t, delay: 1 * t, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* PODOS endpoint dot */}
      {(() => {
        const last = toPoint(podos.length - 1, podos[podos.length - 1]);
        return (
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={animate ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 * t, delay: 2.2 * t, ease: "easeOut" }}
          >
            <circle cx={last.x} cy={last.y} r="5" fill="#22D3EE" opacity="0.3" />
            <circle cx={last.x} cy={last.y} r="3.5" fill="#22D3EE" />
          </motion.g>
        );
      })()}

      {/* X-axis month labels */}
      {months.map((m, i) => {
        const x = PAD_X + i * xStep;
        return (
          <text
            key={m}
            x={x}
            y={H - 10}
            textAnchor="middle"
            fontFamily="var(--font-body)"
            fontSize="11"
            fontWeight="600"
            fill="rgba(15,23,42,0.45)"
            style={{ letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            {m}
          </text>
        );
      })}
    </svg>
  );
}
