import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSessionForUser } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    await createSessionForUser(user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[LOGIN_ERROR]", e);
    return NextResponse.json(
      { error: "LOGIN_FAILED", details: (e as Error).message },
      { status: 500 },
    );
  }
}
