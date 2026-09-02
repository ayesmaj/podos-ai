/**
 * money.ts — display formatters for integer cents. Pure and directive-free so
 * BOTH server components and client components can import them (a "use
 * client" module would hand server callers an unusable client reference).
 * Formatting only — no arithmetic on money happens outside the database.
 */

export const usd = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

/** Compact money for big figures: $5.42M, $920K, $4,500 */
export function compactUsd(cents: number) {
  const d = cents / 100;
  if (Math.abs(d) >= 1_000_000) return `$${(d / 1_000_000).toFixed(2)}M`;
  if (Math.abs(d) >= 10_000) return `$${Math.round(d / 1_000)}K`;
  return usd(cents);
}
