"use server";

import { cookies } from "next/headers";
import { requireOps } from "@/lib/ops/session";
import { RESULT_COOKIE } from "@/lib/ops/result";

export async function dismissAdminResult() {
  await requireOps();
  (await cookies()).delete(RESULT_COOKIE);
}
