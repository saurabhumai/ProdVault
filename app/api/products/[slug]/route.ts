import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ product });
}
