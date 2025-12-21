import { NextResponse } from "next/server";

export const runtime = "nodejs";

import { clearSession } from "@/lib/auth";

export async function POST(): Promise<Response> {
  await clearSession();
  return NextResponse.json({ ok: true });
}
