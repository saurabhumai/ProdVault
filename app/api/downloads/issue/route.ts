import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { daysFromNow, newToken, sha256Hex } from "@/lib/security";

const IssueSchema = z.object({
  orderId: z.string().min(1),
  productId: z.string().min(1),
});

export async function POST(req: Request): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const json = (await req.json().catch(() => null)) as unknown;
  const parsed = IssueSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { id: parsed.data.orderId, userId: user.id, status: { in: ["PAID", "FULFILLED"] } },
    select: { id: true },
  });

  if (!order) {
    return NextResponse.json({ error: "ORDER_NOT_ELIGIBLE" }, { status: 403 });
  }

  const token = newToken(24);
  const tokenHash = sha256Hex(token);
  const expiresAt = daysFromNow(3);

  await prisma.download.create({
    data: {
      tokenHash,
      expiresAt,
      userId: user.id,
      orderId: parsed.data.orderId,
      productId: parsed.data.productId,
    },
  });

  return NextResponse.json({ token, expiresAt: expiresAt.toISOString() });
}
