import Link from "next/link";
import { CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { formatINRFromCents } from "@/lib/money";
import { getProducts } from "@/lib/db";

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

  console.log("Loading products from database...");
  const dbProducts = getProducts();
  console.log("Database products loaded:", dbProducts.length);
  
  const products = dbProducts.map((p: any) => ({
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

  const filtered = products.filter((p) => {
    const matchesQuery =
      q.length === 0 ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.description.toLowerCase().includes(q.toLowerCase());

    return matchesQuery;
  })
    .slice()
    .sort((a, b) => {
      if (sort === "price_asc") return a.priceCents - b.priceCents;
      if (sort === "price_desc") return b.priceCents - a.priceCents;
      return b.popularity - a.popularity;
    });

  const productsByCategory = CATEGORIES.map(category => ({
    category,
    products: filtered.filter(p => p.categoryName === category)
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Products</h1>
          <p className="mt-1 text-slate-400">
            Premium digital downloads. Instant access after purchase.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <form className="flex gap-2" action="/products" method="get">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search products"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-400/60 sm:w-64"
            />
            {sort ? <input type="hidden" name="sort" value={sort} /> : null}
            <button
              type="submit"
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm font-semibold text-slate-50">Categories</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="#all"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
          >
            All
          </a>
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="text-lg font-semibold text-slate-50">No products found</div>
          <div className="mt-1 text-slate-400">
            Try a different search.
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {/* All Products Section */}
          <section id="all" className="scroll-mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-50">All Products</h2>
              <div className="text-sm text-slate-400">
                {filtered.length} product{filtered.length === 1 ? "" : "s"}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </section>

          {/* Individual Category Sections */}
          {productsByCategory.map(({ category, products: categoryProducts }) => (
            categoryProducts.length > 0 && (
              <section 
                key={category} 
                id={category.toLowerCase().replace(/\s+/g, '-')} 
                className="scroll-mt-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-slate-50">{category}</h2>
                  <div className="text-sm text-slate-400">
                    {categoryProducts.length} product{categoryProducts.length === 1 ? "" : "s"}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {categoryProducts.map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </div>
              </section>
            )
          ))}
        </div>
      )}
    </div>
  );
}