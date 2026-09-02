import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { VIEWER_COOKIE, sessionProposal } from "@/lib/proposals/access";
import { NOT_SUBMITTED, clientRenderModel } from "@/lib/proposals/render";
import ProposalPrint from "@/components/print/ProposalPrint";

/**
 * /client/proposals/[publicId]/print — client-safe print source (what the
 * client's PDF download prints). Formal only once released; preliminary once
 * the configuration is submitted. ?screen=0 = printing: refused when the
 * admin disabled downloads for this proposal.
 */

export const metadata: Metadata = { title: "Your PODOS proposal", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";
const PUBLIC_ID_RE = /^POD-EST-\d{4}-\d{4}$/;

export default async function ClientPrintPage({ params, searchParams }: { params: Promise<{ publicId: string }>; searchParams: Promise<{ screen?: string }> }) {
  const { publicId } = await params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();
  const sp = await searchParams;
  const jar = await cookies();
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (!session) notFound();
  const p = await sessionProposal(session);
  if (!p || p.public_id !== publicId || NOT_SUBMITTED.has(p.status)) notFound();

  const m = await clientRenderModel(p, session);
  const printing = sp.screen === "0";
  if (printing && !m.design.allow_download) notFound();
  return <ProposalPrint d={m.doc} pageMode={m.pageMode} design={m.design} hash={m.hash} assets={m.assets} screen={!printing} />;
}
