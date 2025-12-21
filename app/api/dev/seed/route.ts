import { NextResponse } from "next/server";
import { seedDb } from "@/lib/db";

export async function GET(): Promise<Response> {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "NOT_ALLOWED" }, { status: 403 });
  }

  return NextResponse.json({
    message:
      "Use POST on this endpoint to seed the database (browser opens as GET and returns 405 otherwise).",
    example:
      "Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/dev/seed",
  });
}

export async function POST(): Promise<Response> {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "NOT_ALLOWED" }, { status: 403 });
    }

    const result = seedDb();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("[SEED_ERROR]", e);
    return NextResponse.json(
      { error: "SEED_FAILED", details: (e as Error).message },
      { status: 500 },
    );
  }
}
