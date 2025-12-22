import { NextResponse } from "next/server";
import { getProducts, seedDb } from "@/lib/db";

export async function GET(): Promise<Response> {
  try {
    console.log("GET /api/products hit - starting to fetch products");
    
    console.log("Calling getProducts() from database...");
    let products = getProducts();
    console.log("getProducts() returned:", products.length, "products");
    
    // If no products, seed the database
    if (products.length === 0) {
      console.log("No products found, seeding database");
      const result = seedDb();
      console.log('Seeded database:', result);
      products = getProducts();
      console.log('Products after seeding:', products.length);
    }
    
    console.log('Returning products:', products.length);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error in products API:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack available');
    console.error("Error message:", error instanceof Error ? error.message : 'Unknown error type');
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
