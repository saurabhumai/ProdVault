import { NextResponse } from "next/server";
import { getProductReviews, getProductReviewSummary } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  try {
    const { slug } = await params;
    // First get the product by slug to get the product ID
    const productRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/products/${slug}`);
    if (!productRes.ok) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    const { product } = await productRes.json();
    
    // Get reviews and summary
    const reviews = getProductReviews(product.id);
    const summary = getProductReviewSummary(product.id);
    
    return NextResponse.json({ reviews, summary });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { rating, title, content, userId } = body;
    
    if (!rating || !content || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }
    
    // Get product by slug
    const productRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/products/${slug}`);
    if (!productRes.ok) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    const { product } = await productRes.json();
    
    // Import createReview function
    const { createReview } = await import("@/lib/db");
    const result = createReview(product.id, userId, rating, title || null, content);
    
    return NextResponse.json({ success: true, reviewId: result.reviewId });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
