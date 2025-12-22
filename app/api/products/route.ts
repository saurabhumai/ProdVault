import { NextResponse } from "next/server";
import { getProducts, seedDb } from "@/lib/db";

export async function GET(): Promise<Response> {
  try {
    console.log("Products API called");
    let products = getProducts();
    
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
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
