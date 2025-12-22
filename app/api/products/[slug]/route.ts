import { NextResponse } from "next/server";
import { getProductBySlug, seedDb } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug } = await params;
  
  let product = getProductBySlug(slug);
  
  // If no product found, try seeding the database
  if (!product) {
    console.log("Product not found in API, seeding database...");
    seedDb();
    product = getProductBySlug(slug);
  }
  
  if (!product) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  
  return NextResponse.json({ product });
}
