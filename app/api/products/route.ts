import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db";

export async function GET(): Promise<Response> {
  const products = getProducts();
  return NextResponse.json({ products });
}
