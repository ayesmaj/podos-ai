import { redirect } from "next/navigation";

/**
 * Legacy invitation path. /e/[token] is the canonical secure entry
 * (docs/estimator/03-ROUTE-ARCHITECTURE); outstanding emailed links land here
 * and are forwarded with the token path segment preserved. The proxy already
 * sets Referrer-Policy: no-referrer on both prefixes, so the hop is safe.
 */
export default async function LegacyInviteRedirect({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  redirect(`/e/${token}`);
}
