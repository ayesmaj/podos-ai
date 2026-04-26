"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import LineIcon, { type IconName } from "./LineIcon";
import {
  GridField,
  AmbientOrbs,
  VignetteLight,
} from "./BackgroundLayers";
import styles from "./NvidiaBlueprint.module.css";

/* ==================================================================
   SECTION 05·½ — THE $3.4T BLUEPRINT
   ==================================================================
   The rhetorical pivot of the deck.

   Most investor decks explain why the company is *different* from the
   incumbent. We do the opposite: we show that California Modulars is
   running Nvidia's *exact* revenue architecture, one layer deeper in
   the stack — at the physical infrastructure Nvidia doesn't ship.

   That reframes the valuation discussion. Investors stop asking
   "is this bigger than compression software?" and start asking
   "what's an Nvidia-shaped outcome worth at pre-seed?"

   Visual structure:
     1. Anchor bar    — $3.4T · 5 layers · 30 years (scale of the play)
     2. Parallel ledger — 5 rows, Nvidia side ↔ our side, per layer
     3. Closing statement — the "earlier in the arc" punch line

   Design discipline:
     - No hostile framing. The parallel is positive — "same architecture".
     - Nvidia side rendered in neutral ink (steel). Our side in brand
       blue→cyan. The tone reads as "descended from" not "competing with".
     - Revenue model tag (mono, all-caps) anchors each row.
     - Row-by-row stagger in, with a faint horizontal rule drawing
       between columns — like a ledger ruling up its own page.
   ================================================================== */

// --------------------------- DATA ---------------------------

type LayerRow = {
  code: string;
  name: string;
  icon: IconName;
  /** What Nvidia does at this layer. One short sentence + stat. */
  nvidia: {
    product: string;
    stat: string;
  };
  /** What we do at this same layer. */
  ours: {
    product: string;
    stat: string;
  };
  /** Revenue-model tag — how money is captured at this layer. */
  revenue: string;
};

/**
 * The five parallel revenue layers.
 *
 * Numbers below are defaults calibrated for the current narrative
 * (seed round, 76+ patents, 1-MW POD + 20-MW SILO lineup). Revenue-
 * model tags ("PER-UNIT SALE", etc.) are the terms an operator or
 * LP will recognize without explanation.
 *
 * NOTE — if the financial model lands on different unit economics,
 * the stat strings are the only thing to update. Names, icons, and
 * revenue-model tags are structural and shouldn't drift.
 */
const LAYERS: LayerRow[] = [
  {
    code: "L.01",
    name: "SILICON & SYSTEMS",
    icon: "chip",
    nvidia: {
      product: "Blackwell GPUs, DGX systems",
      stat: "$78B data center revenue (Q4 ’24)",
    },
    ours: {
      product: "1-MW pods · 20-MW silos",
      stat: "$8–12M per MW deployed",
    },
    revenue: "PER-UNIT SALE",
  },
  {
    code: "L.02",
    name: "NETWORKING & POWER",
    icon: "grid",
    nvidia: {
      product: "NVLink, InfiniBand, Spectrum-X",
      stat: "Rack-scale integration moat",
    },
    ours: {
      product: "PUE 1.08–1.12 cooling + power",
      stat: "Hyperscaler avg PUE 1.58",
    },
    revenue: "BUNDLED · MARGIN ENHANCER",
  },
  {
    code: "L.03",
    name: "SOFTWARE PLATFORM",
    icon: "layers",
    nvidia: {
      product: "CUDA · TensorRT · cuDNN",
      stat: "~95% AI-developer mindshare",
    },
    ours: {
      product: "Syntropic compression",
      stat: "8× GPU density · 99.6% quality",
    },
    revenue: "PER-GPU LICENSE · RECURRING",
  },
  {
    code: "L.04",
    name: "MANAGED SERVICES",
    icon: "gauge",
    nvidia: {
      product: "DGX Cloud (w/ Azure, GCP)",
      stat: "Multi-$B contracted pipeline",
    },
    ours: {
      product: "DCaaS — managed operations",
      stat: "90–120 day deploy → live ops",
    },
    revenue: "RECURRING · $ / MW / MONTH",
  },
  {
    code: "L.05",
    name: "IP & PATENT MASS",
    icon: "patent",
    nvidia: {
      product: "Omniverse, systems patents",
      stat: "Defensive + platform lock-in",
    },
    ours: {
      product: "76+ USPTO patents (granted)",
      stat: "Modular-deployment category",
    },
    revenue: "LICENSING + DEFENSIVE MOAT",
  },
];

/** Top anchor bar — three stats. */
const ANCHOR_STATS = [
  { k: "$3.4T", label: "Nvidia market cap", sub: "built from the stack" },
  { k: "5", label: "Compounding revenue layers", sub: "same architecture" },
  { k: "30 yrs", label: "To build that moat", sub: "we skip the wait" },
];

// --------------------------- COMPONENT ---------------------------

export default function NvidiaBlueprint() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();

  // Cheap motion kill-switch for reduced-motion users — we still
  // render the content, just without the entrance choreography.
  const t = (d = 0) =>
    reduce
      ? { duration: 0, delay: 0 }
      : {
          duration: 0.7,
          delay: d,
          ease: [0.22, 0.61, 0.36, 1] as const,
        };

  return (
    <section
      ref={ref}
      id="rail-blueprint"
      className={`${styles.section} section-pad`}
    >
      {/* Ambient background — keeps this section cohesive with the
          surrounding narrative panels without dominating. Sparse grid
          variant + default orbs match the BLUEPRINT tone: analytical,
          ledger-like, not flashy. Opacity is controlled via .bg CSS. */}
      <div className={styles.bg} aria-hidden>
        <GridField variant="sparse" />
        <AmbientOrbs />
        <VignetteLight />
      </div>

      <div className="container-site">
        {/* ========== HEADER ========== */}
        <header className={styles.header}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={t(0)}
          >
            <span className={styles.eyebrowIdx}>05·½</span>
            <span className={styles.eyebrowSep}>·</span>
            <span>The $3.4T Blueprint</span>
          </motion.p>

          <motion.h2
            className={styles.headline}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={t(0.08)}
          >
            $3.4 trillion didn’t come from{" "}
            <span className="t-sweep-brand">selling chips.</span>
          </motion.h2>

          <motion.p
            className={styles.lede}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={t(0.18)}
          >
            Nvidia became the most valuable AI company on earth by
            compounding value across five layers of the stack. Optimus +
            Syntropic runs the <b>same architecture</b> — earlier in the
            arc, on the physical layer Nvidia doesn’t ship.
          </motion.p>
        </header>

        {/* ========== ANCHOR STAT BAR ========== */}
        <motion.div
          className={styles.anchor}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={t(0.26)}
        >
          {ANCHOR_STATS.map((s) => (
            <div key={s.k} className={styles.anchorStat}>
              <span className={styles.anchorValue}>{s.k}</span>
              <div className={styles.anchorLabels}>
                <span className={styles.anchorLabel}>{s.label}</span>
                <span className={styles.anchorSub}>{s.sub}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ========== PARALLEL LEDGER ========== */}
        <div className={styles.ledger}>
          {/* Column headers — only visible ≥880px so the mobile stack
              stays clean (each row gets its own Nvidia/Ours labels). */}
          <div className={styles.ledgerHead} aria-hidden>
            <span className={styles.ledgerHeadLayer}>LAYER</span>
            <span className={styles.ledgerHeadNvidia}>
              <span className={styles.ledgerHeadDot} data-tone="nvidia" />
              NVIDIA · THE REFERENCE
            </span>
            <span className={styles.ledgerHeadOurs}>
              <span className={styles.ledgerHeadDot} data-tone="ours" />
              OPTIMUS + SYNTROPIC · US
            </span>
          </div>

          {LAYERS.map((row, i) => (
            <motion.div
              key={row.code}
              className={styles.row}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={t(0.34 + i * 0.08)}
            >
              {/* Layer column: code + name + icon */}
              <div className={styles.layerCell}>
                <div className={styles.layerIconWrap}>
                  <LineIcon name={row.icon} size={20} />
                </div>
                <div className={styles.layerText}>
                  <span className={styles.layerCode}>{row.code}</span>
                  <span className={styles.layerName}>{row.name}</span>
                </div>
              </div>

              {/* Nvidia side */}
              <div className={styles.sideCell} data-side="nvidia">
                <span
                  className={styles.sideLabel}
                  aria-hidden
                >
                  NVIDIA
                </span>
                <p className={styles.sideProduct}>{row.nvidia.product}</p>
                <p className={styles.sideStat}>{row.nvidia.stat}</p>
              </div>

              {/* Our side */}
              <div className={styles.sideCell} data-side="ours">
                <span
                  className={styles.sideLabel}
                  aria-hidden
                >
                  US
                </span>
                <p className={styles.sideProduct}>{row.ours.product}</p>
                <p className={styles.sideStat}>{row.ours.stat}</p>
              </div>

              {/* Revenue-model tag spans the width below on wider
                  viewports, or stacks at the bottom on mobile. */}
              <div className={styles.revenueCell}>
                <span className={styles.revenueDot} aria-hidden />
                <span className={styles.revenueLabel}>
                  REVENUE MODEL
                </span>
                <span className={styles.revenueValue}>{row.revenue}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ========== CLOSING STATEMENT ========== */}
        <motion.div
          className={styles.closing}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={t(0.34 + LAYERS.length * 0.08 + 0.1)}
        >
          <div className={styles.closingRule} aria-hidden />
          <p className={styles.closingText}>
            We’re not betting Nvidia is wrong. We’re betting the{" "}
            <b>same architecture</b> wins for the part of the stack{" "}
            <b>Nvidia doesn’t ship.</b>
          </p>
          <div className={styles.closingStats}>
            <span className={styles.closingStat}>
              <b>5</b> revenue layers
            </span>
            <span className={styles.closingSep} aria-hidden>
              ·
            </span>
            <span className={styles.closingStat}>
              <b>76+</b> USPTO patents
            </span>
            <span className={styles.closingSep} aria-hidden>
              ·
            </span>
            <span className={styles.closingStat}>
              <b>1</b> integrated stack
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
