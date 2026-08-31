"use client";

/**
 * usePricingOverride — subscribe to the admin price preview in
 * localStorage.
 *
 * useSyncExternalStore rather than an effect + setState: localStorage is
 * an external store, the server snapshot is null (so SSR renders the
 * committed prices and hydration matches), and cross-tab "storage"
 * events keep an open /estimate tab in sync while the founder edits in
 * /admin/pricing.
 */

import { useMemo, useSyncExternalStore } from "react";
import { PRICING, type PricingConfig } from "@/data/configuratorPricing";

export const PRICING_KEY = "podos:pricing-preview";

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(PRICING_KEY, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(PRICING_KEY, onChange);
  };
};

const getSnapshot = () => {
  try {
    return window.localStorage.getItem(PRICING_KEY);
  } catch {
    return null;
  }
};

/** server + first client render: no override, so hydration matches */
const getServerSnapshot = () => null;

/** Notify same-tab listeners (the storage event only fires cross-tab). */
export function publishPricingOverride(cfg: PricingConfig | null) {
  try {
    if (cfg) window.localStorage.setItem(PRICING_KEY, JSON.stringify(cfg));
    else window.localStorage.removeItem(PRICING_KEY);
    window.dispatchEvent(new Event(PRICING_KEY));
  } catch {
    /* storage unavailable — preview simply will not persist */
  }
}

export function usePricingOverride(): { pricing: PricingConfig; isOverride: boolean } {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    if (!raw) return { pricing: PRICING, isOverride: false };
    try {
      return {
        pricing: { ...PRICING, ...(JSON.parse(raw) as Partial<PricingConfig>) },
        isOverride: true,
      };
    } catch {
      return { pricing: PRICING, isOverride: false };
    }
  }, [raw]);
}
