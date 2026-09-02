/**
 * status.ts — the ONE proposal status → chip mapping (brief §28). Every real
 * status string the estimates table can hold is covered; unknown strings fall
 * back to a neutral chip with the raw text humanised.
 */

export type ChipTone = "gray" | "muted" | "cobalt" | "deep" | "electric" | "cyan" | "amber" | "orange" | "purple" | "violet" | "green" | "red";

export interface StatusMeta { label: string; tone: ChipTone; stage: number }

const MAP: Record<string, StatusMeta> = {
  draft: { label: "Draft", tone: "gray", stage: 0 },
  sent: { label: "Invited", tone: "cobalt", stage: 1 },
  client_invited: { label: "Invited", tone: "cobalt", stage: 1 },
  viewed: { label: "Viewed", tone: "electric", stage: 1 },
  configuring: { label: "Configuring", tone: "cyan", stage: 2 },
  in_progress: { label: "Configuring", tone: "cyan", stage: 2 },
  client_configuring: { label: "Configuring", tone: "cyan", stage: 2 },
  revision_requested: { label: "Revision requested", tone: "amber", stage: 2 },
  client_submitted: { label: "Submitted", tone: "amber", stage: 3 },
  engineering_review: { label: "Engineering review", tone: "orange", stage: 4 },
  commercial_review: { label: "Commercial review", tone: "orange", stage: 4 },
  approved: { label: "Approved", tone: "purple", stage: 4 },
  released: { label: "Proposal sent", tone: "deep", stage: 5 },
  signature_requested: { label: "Signature", tone: "violet", stage: 6 },
  client_signed: { label: "Signed", tone: "green", stage: 7 },
  signed: { label: "Signed", tone: "green", stage: 7 },
  countersigned: { label: "Countersigned", tone: "green", stage: 7 },
  completed: { label: "Completed", tone: "green", stage: 7 },
  won: { label: "Won", tone: "green", stage: 7 },
  lost: { label: "Lost", tone: "red", stage: -1 },
  declined: { label: "Declined", tone: "red", stage: -1 },
  expired: { label: "Expired", tone: "muted", stage: -1 },
  revoked: { label: "Withdrawn", tone: "red", stage: -1 },
  archived: { label: "Archived", tone: "muted", stage: -1 },
};

export function statusMeta(status: string, opts?: { revoked?: boolean; signedAt?: string | null }): StatusMeta {
  if (opts?.revoked) return MAP.revoked;
  if (opts?.signedAt && !["won", "completed", "countersigned", "lost", "declined"].includes(status)) return MAP.client_signed;
  return MAP[status] ?? { label: status.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()), tone: "gray", stage: 0 };
}

/** The connected pipeline: stage index → label + which statuses fold into it. */
export const PIPELINE_STAGES: { key: string; label: string; statuses: string[] }[] = [
  { key: "draft", label: "Draft", statuses: ["draft"] },
  { key: "invited", label: "Invited", statuses: ["sent", "client_invited", "viewed"] },
  { key: "configuring", label: "Configuring", statuses: ["configuring", "in_progress", "client_configuring", "revision_requested"] },
  { key: "submitted", label: "Submitted", statuses: ["client_submitted"] },
  { key: "review", label: "Eng. review", statuses: ["engineering_review", "commercial_review", "approved"] },
  { key: "sent", label: "Proposal sent", statuses: ["released"] },
  { key: "signature", label: "Signature", statuses: ["signature_requested"] },
  { key: "signed", label: "Signed", statuses: ["client_signed", "signed", "countersigned", "completed", "won"] },
];
export const CLOSED_STATUSES = new Set(["lost", "declined", "expired", "archived", "revoked"]);

/** Pipeline stage key for a proposal row (null when withdrawn or closed). */
export function stageKeyFor(r: { status: string; revoked?: boolean; signed_at?: string | null }): string | null {
  if (r.revoked || CLOSED_STATUSES.has(r.status)) return null;
  const st = r.signed_at && !["won", "completed", "countersigned"].includes(r.status) ? "client_signed" : r.status;
  return PIPELINE_STAGES.find((x) => x.statuses.includes(st))?.key ?? "draft";
}
export const isOpenProposal = (r: { status: string; revoked?: boolean; signed_at?: string | null }) =>
  !r.revoked && !CLOSED_STATUSES.has(r.status) && !r.signed_at && !["client_signed", "signed", "countersigned", "completed", "won"].includes(r.status);
