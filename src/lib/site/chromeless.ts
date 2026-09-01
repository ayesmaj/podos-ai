/**
 * Routes that render without site header/footer.
 *
 * Site chrome is mounted globally in app/layout.tsx, which is right for
 * marketing pages but wrong for two surfaces:
 *
 *   /e/*      a private client estimate — a document sent to one client, not a
 *             page of the website. Site nav invites them away from the thing
 *             they were sent to read.
 *   /admin/*  internal tools. Public marketing nav has no business there, and
 *             showing it implies these are part of the public site.
 *
 * Kept in one place so the header and the footer can never disagree.
 */
export const CHROMELESS_PREFIXES = ["/admin", "/ops", "/e/", "/proposal", "/client", "/estimate"] as const;

export function isChromeless(pathname: string | null): boolean {
  if (!pathname) return false;
  return CHROMELESS_PREFIXES.some((p) => pathname === p || pathname.startsWith(p));
}
