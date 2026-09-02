import { cookies } from "next/headers";
import { VIEWER_COOKIE, submitConfiguration } from "@/lib/proposals/access";

/**
 * POST /api/proposal/submit — the client submits their configuration for
 * PODOS review. Intake only (master redesign brief §1): no approval, no
 * signature. The database flips status to client_submitted, logs the event,
 * queues an admin notification and returns the reference + timestamp for the
 * success screen. Re-submits return ok:false with reason already_submitted.
 */

export async function POST() {
  const jar = await cookies();
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (!session) return Response.json({ ok: false }, { status: 401 });

  const result = await submitConfiguration(session);
  if (!result) return Response.json({ ok: false }, { status: 401 });
  return Response.json(result, { status: result.ok ? 200 : 409 });
}
