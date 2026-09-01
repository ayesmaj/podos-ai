/**
 * legal.ts — the factual basis for /privacy, /terms and /cookies.
 *
 * These are NOT marketing copy. Every row below was verified against the
 * code that actually runs, so the published policies describe real
 * behaviour rather than a template:
 *
 *   - src/app/api/investor-interest/route.ts  (the only visitor-facing
 *     form; fields, storage, and the two email paths)
 *   - src/app/admin/**                        (staff cookie, not visitors)
 *   - src/lib/configurator/usePricingOverride.ts (localStorage key)
 *   - src/app/layout.tsx                      (next/font self-hosts, so
 *     no Google Fonts request leaves the visitor's browser)
 *
 * If any of those change, update this file FIRST — the three pages read
 * from it, so a code change that is not reflected here becomes a false
 * statement on a legal page.
 *
 * IMPORTANT: written by the engineering team as an accurate description
 * of system behaviour. It has not been reviewed by counsel.
 */

/** Date the policies were last checked against the code. */
export const LEGAL_UPDATED = "2026-09-01";

export const LEGAL_ENTITY = "PODOS AI";
export const LEGAL_CONTACT = "info@podosai.com";

/** Every field the investor-interest form sends to the server. */
export const COLLECTED_FIELDS: {
  field: string;
  required: string;
  why: string;
}[] = [
  { field: "Full name", required: "Required", why: "To know who the enquiry is from." },
  { field: "Email address", required: "Required", why: "The only channel used to reply." },
  { field: "Phone number", required: "Optional", why: "Used only if you supply it and ask to be called." },
  { field: "Indicated amount", required: "Required", why: "To understand the scale of the enquiry. It is not a commitment." },
  { field: "Individual or entity", required: "Required", why: "To route the enquiry correctly." },
  { field: "Accredited-investor answer", required: "Required", why: "Self-declared. We do not verify it and it grants no status." },
  { field: "Message", required: "Optional", why: "Free text you choose to send." },
];

/** Third parties that receive data, and what each one gets. */
export const PROCESSORS: {
  name: string;
  role: string;
  data: string;
}[] = [
  {
    name: "Supabase",
    role: "Database that stores submitted enquiries",
    data: "Every field listed above, plus the submission timestamp.",
  },
  {
    name: "FormSubmit / Resend",
    role: "Email delivery of the notification to our inbox",
    data: "The same fields, in the body of a notification email.",
  },
  {
    name: "Vercel",
    role: "Hosting and content delivery",
    data: "Standard server request data — IP address, user agent, requested URL — as any web host receives.",
  },
];

/**
 * Browser storage actually used. Deliberately short: there is no
 * analytics, advertising, or third-party tracking on this site.
 */
export const STORAGE_ITEMS: {
  name: string;
  kind: string;
  scope: string;
  purpose: string;
}[] = [
  {
    name: "podos:pricing-preview",
    kind: "localStorage",
    scope: "Staff only (/admin/pricing)",
    purpose:
      "Holds a draft price book while a staff member previews the estimator. Never leaves the browser it was set in and is not read by any server.",
  },
  {
    name: "Admin session value",
    kind: "Cookie",
    scope: "Staff only (/admin)",
    purpose:
      "Gates the internal admin pages. Never set for ordinary visitors browsing the public site.",
  },
];

/** Stated plainly so the pages and the product cannot disagree. */
export const NOT_TRUE_OF_THIS_SITE = [
  "No analytics product runs on this site — no Google Analytics, Tag Manager, Plausible, PostHog, Segment, or similar.",
  "No advertising or retargeting pixels are present.",
  "No third-party cookies are set, and no cookie banner is shown because none is required for what the site does.",
  "Fonts are self-hosted and served from this domain, so viewing a page makes no request to Google Fonts.",
  "We do not sell, rent, or share personal information with anyone for their own marketing.",
  "No account system exists, so there is nothing to log into and no profile is built about you.",
];
