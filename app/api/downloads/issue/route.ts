import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const IssueSchema = z.object({
  orderId: z.string().min(1),
  productId: z.string().min(1),
});

export async function POST(req: Request): Promise<Response> {
  // Return a mock response for now to enable deployment
  return NextResponse.json({ 
    message: "Download issue endpoint - Under development",
    token: "mock-token-" + Math.random().toString(36).substr(2, 9),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  });
}
