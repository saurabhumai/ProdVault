import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(): Promise<Response> {
  return NextResponse.json(
    {
      error: "NOT_IMPLEMENTED",
      message:
        "Stripe checkout will be wired next (requires STRIPE_SECRET_KEY + webhook).",
    },
    { status: 501 },
  );
}
