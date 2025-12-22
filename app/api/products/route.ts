import { NextResponse } from "next/server";
import { getProducts, seedDb } from "@/lib/db";

export async function GET(): Promise<Response> {
  let products = getProducts();
  
  // If no products, seed the database
  if (products.length === 0) {
    const result = seedDb();
    console.log('Seeded database:', result);
    products = getProducts();
  }
  
  return NextResponse.json({ products });
}
