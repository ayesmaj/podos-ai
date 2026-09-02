import { cookies } from "next/headers";
import { VIEWER_COOKIE, previewEstimate, saveSelection } from "@/lib/proposals/access";

/**
 * POST /api/proposal/save-step — autosave one configuration step.
 *
 * Auth is the HttpOnly viewer session cookie (the client never holds the
 * token in JS). The database scopes the write to the session's own proposal,
 * validates the step id and payload size, and logs a selection_saved activity
 * event. Returns {ok} for the workspace's Saving/Saved/Failed indicator.
 */

export async function POST(req: Request) {
  const jar = await cookies();
  const session = jar.get(VIEWER_COOKIE)?.value ?? "";
  if (!session) return Response.json({ ok: false }, { status: 401 });

  let body: { step?: unknown; payload?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const step = typeof body.step === "string" ? body.step : "";
  if (!step || typeof body.payload !== "object" || body.payload === null) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const ok = await saveSelection(session, step, body.payload);
  if (!ok) return Response.json({ ok: false }, { status: 400 });

  // The live estimate is computed in the database from the saved selections —
  // the browser only animates what comes back (no client-side money math).
  const estimate = await previewEstimate(session);
  return Response.json({ ok: true, estimate });
}
