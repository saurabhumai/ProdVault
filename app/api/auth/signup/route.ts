import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<Response> {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Implement actual signup logic
    return NextResponse.json(
      { message: "Signup functionality not yet implemented" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}