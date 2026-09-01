import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { VIEWER_COOKIE, sessionProposal } from "@/lib/proposals/access";

/**
 * Legacy route: /proposal/[uuid] exposed the internal database id in the URL,
 * which the route architecture forbids (docs/estimator/03). A holder of a
 * valid session is forwarded to the clean /client/proposals/[publicId] route;
 * everyone else gets the uniform 404.
 */
export const dynamic = "force-dynamic";

export default async function LegacyProposalRedirect() {
  const jar = await cookies();
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (!session) notFound();
  const p = await sessionProposal(session);
  if (!p) notFound();
  redirect(`/client/proposals/${p.public_id}`);
}
