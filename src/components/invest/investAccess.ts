/**
 * investAccess — tiny event bus for the investor-access flow.
 * Any CTA on the page calls openInvestorAccess(amount?) and the mounted
 * InvestorAccessFlow modal picks it up; avoids threading context through
 * a dozen section components.
 */

export const INVEST_ACCESS_EVENT = "podos:invest-access";

export function openInvestorAccess(amount?: number) {
  window.dispatchEvent(new CustomEvent(INVEST_ACCESS_EVENT, { detail: { amount } }));
}
