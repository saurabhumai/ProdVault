import { NextResponse } from "next/server";

export const runtime = "nodejs";

import { getCurrentUser } from "@/lib/auth";

export async function GET(): Promise<Response> {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
