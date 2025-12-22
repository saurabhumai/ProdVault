import Link from "next/link";
import { CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { formatINRFromCents } from "@/lib/money";

type SortKey = "popular" | "price_asc" | "price_desc";

type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDesc: string;
  priceCents: number;
  popularity: number;
  categoryName?: string;
  image?: string;
};

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products", {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("API response not OK:", res.status, res.statusText);
      throw new Error("Failed to fetch products");
    }
    const data = await res.json();
    console.log("API data:", data);
    const { products } = data;
    return products.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      longDesc: p.longDesc,
      priceCents: p.priceCents,
      popularity: p.popularity,
      categoryName: p.categoryName,
      image: p.image,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

function normalizeSort(value: unknown): SortKey {
  if (value === "price_asc" || value === "price_desc") return value;
  return "popular";
}

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { q?: string; sort?: string };
}): Promise<React.ReactNode> {
  const q = (searchParams?.q ?? "").trim();
  const sort = normalizeSort(searchParams?.sort);

  try {
    const products = await getProducts();
    console.log("Products fetched:", products.length);

    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Products</h1>
            <p className="mt-1 text-slate-400">
              Premium digital downloads. Instant access after purchase.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-lg font-semibold text-slate-50">
            Found {products.length} products
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((p) => (
              <div key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-slate-50">{p.title}</div>
                <div className="text-xs text-slate-400 mt-1">{p.categoryName}</div>
                <div className="text-xs text-slate-300 mt-2">{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ProductsPage:", error);
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-red-500">Error loading products: {error instanceof Error ? error.message : 'Unknown error'}</div>
      </div>
    );
  }
}