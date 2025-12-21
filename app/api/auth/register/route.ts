import { NextRequest, NextResponse } from "next/server";
import { hashPassword, createSessionForUser } from "@/lib/auth";
import { getUserByEmail, createUser } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { name, email, password } = await request.json();

    console.log("[SIGNUP_ATTEMPT]", { name, email });

    if (!name || !email || !password) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "PASSWORD_TOO_SHORT" }, { status: 400 });
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "EMAIL_EXISTS" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const { userId } = createUser(name, email, passwordHash);
    await createSessionForUser(userId);

    return NextResponse.json({ ok: true, message: "User created successfully" });
  } catch (e) {
    console.error("[SIGNUP_ERROR]", e);
    return NextResponse.json(
      { error: "SIGNUP_FAILED", details: (e as Error).message },
      { status: 500 },
    );
  }
}
