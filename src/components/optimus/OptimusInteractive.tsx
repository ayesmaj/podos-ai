"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  OPTIMUS_COMPONENTS,
  type OptimusCategory,
} from "@/lib/optimusComponents";
import PodCanvas from "./PodCanvas";
import DetailPanel from "./DetailPanel";
import FeatureRibbon from "./FeatureRibbon";
import styles from "./OptimusInteractive.module.css";

/**
 * OptimusInteractive — the orchestrator. Owns:
 *
 *   • activeId    — which callout's panel is open (or null)
 *   • filter      — optional category filter (null = show all)
 *   • lastFocus   — DOM ref of the last activator (for return-focus on close)
 *
 * Side effects (centralized so individual callouts stay dumb):
 *   • ESC key   → close active panel
 *   • ←/→ keys  → cycle prev/next when panel open
 *   • on close  → restore focus to the activator pin
 *
 * Reducer is overkill for 2 fields, but the prompt asked for one and
 * it makes the open/close/navigate intents explicit & testable.
 */

type State = {
  activeId: string | null;
  filter: OptimusCategory | null;
};

type Action =
  | { type: "open"; id: string }
  | { type: "close" }
  | { type: "navigate"; direction: "prev" | "next" }
  | { type: "setFilter"; category: OptimusCategory | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "open":
      return { ...state, activeId: action.id };
    case "close":
      return { ...state, activeId: null };
    case "navigate": {
      if (!state.activeId) return state;
      const idx = OPTIMUS_COMPONENTS.findIndex((c) => c.id === state.activeId);
      if (idx === -1) return state;
      const len = OPTIMUS_COMPONENTS.length;
      const next =
        action.direction === "next"
          ? (idx + 1) % len
          : (idx - 1 + len) % len;
      return { ...state, activeId: OPTIMUS_COMPONENTS[next].id };
    }
    case "setFilter":
      return { ...state, filter: action.category };
  }
}

export default function OptimusInteractive() {
  const [state, dispatch] = useReducer(reducer, {
    activeId: null,
    filter: null,
  });
  const lastFocusRef = useRef<HTMLElement | null>(null);

  // Open: stash the previously focused element so we can restore on close.
  const handleActivate = useCallback((id: string) => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    dispatch({ type: "open", id });
  }, []);

  const handleClose = useCallback(() => {
    dispatch({ type: "close" });
    // Defer focus restore until the panel has unmounted to avoid
    // fighting with the panel's internal focus management.
    requestAnimationFrame(() => {
      lastFocusRef.current?.focus();
    });
  }, []);

  const handleNavigate = useCallback((direction: "prev" | "next") => {
    dispatch({ type: "navigate", direction });
  }, []);

  // Global keyboard handler — ESC closes, ←/→ navigate when open.
  // Single listener on document keeps callouts free of keyboard logic.
  useEffect(() => {
    if (!state.activeId) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleNavigate("prev");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNavigate("next");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [state.activeId, handleClose, handleNavigate]);

  const activeComponent =
    OPTIMUS_COMPONENTS.find((c) => c.id === state.activeId) ?? null;

  return (
    <section
      className={styles.section}
      aria-labelledby="optimus-section-title"
    >
      {/* Section header — mirrors the reference's top strip. */}
      <header className={styles.header}>
        <p className={styles.eyebrow}>POD-0042 · REV·E · CONFIDENTIAL — SEED · 2026</p>
        <h3 id="optimus-section-title" className={styles.title}>
          8× DENSITY. LIQUID COOLED. BUILT TO SCALE.
        </h3>
        <p className={styles.subtitle}>
          High-density GPU infrastructure in a modular, liquid-cooled pod.
          Click any callout to explore the spec.
        </p>
      </header>

      <PodCanvas
        activeId={state.activeId}
        filterCategory={state.filter}
        onActivate={handleActivate}
      />

      <FeatureRibbon />

      <DetailPanel
        component={activeComponent}
        onClose={handleClose}
        onNavigate={handleNavigate}
      />
    </section>
  );
}
