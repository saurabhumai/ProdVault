import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PRODUCTS } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";
import { formatINRFromCents } from "@/lib/money";

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

async function getProduct(slug: string): Promise<Product | null> {
  // Use absolute URL for server-side rendering
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const url = `${baseUrl}/api/products/${slug}`;
  console.log('Using ABSOLUTE product URL on server:', url);
  
  const res = await fetch(url, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const { product } = await res.json();
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    longDesc: product.longDesc,
    priceCents: product.priceCents,
    popularity: product.popularity,
    categoryName: product.categoryName,
    image: product.image,
  };
}

function ProductDetailContent({ product }: { product: Product }) {
  const related = PRODUCTS.filter(
    (p) => p.category === (product.categoryName || "Uncategorized") && p.id !== product.id,
  ).slice(0, 3);

  const currentProduct = PRODUCTS.find((p) => p.slug === product.slug);
  const highlights = currentProduct?.highlights || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link
          href="/products"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Products
        </Link>
        <span className="text-sm text-muted-foreground">/</span>
        <span className="text-sm text-muted-foreground">{product.categoryName || "Uncategorized"}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-card">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain"
                loading="eager"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{product.description}</p>
          </div>

          {/* Price and Category */}
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold">{formatINRFromCents(product.priceCents)}</span>
            <span className="rounded-full border px-3 py-1 text-xs font-semibold">
              {product.categoryName}
            </span>
            <span className="text-sm text-muted-foreground">
              Popularity: {product.popularity}/100
            </span>
          </div>

          {/* Product Highlights */}
          {highlights.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Features</h2>
              <ul className="grid gap-2 text-sm text-muted-foreground">
                {highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <AddToCartButton 
              productId={product.id} 
              productImage={product.image}
              productTitle={product.title}
            />
            <div className="grid grid-cols-2 gap-3">
              <button className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted">
                Add to Wishlist
              </button>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted"
              >
                Go to cart
              </Link>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.longDesc}
            </p>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Product Information</h2>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Format</span>
                <span>Digital Download</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Delivery</span>
                <span>Instant Access</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Compatibility</span>
                <span>All Devices</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">License</span>
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <button className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted">
            Write a Review
          </button>
        </div>

        {/* Review Summary */}
        <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold">4.5</div>
              <div className="mt-1 text-sm text-muted-foreground">out of 5</div>
            </div>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`h-4 w-4 ${
                    star <= 4 ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Based on 12 reviews
            </div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm w-3">{rating}</span>
                <span className="text-sm">★</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${rating === 5 ? 60 : rating === 4 ? 25 : rating === 3 ? 10 : rating === 2 ? 3 : 2}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">
                  {rating === 5 ? 7 : rating === 4 ? 3 : rating === 3 ? 1 : rating === 2 ? 1 : 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Reviews */}
        <div className="space-y-4">
          {[1, 2, 3].map((review) => (
            <div key={review} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                    {String.fromCharCode(65 + review - 1)}
                  </div>
                  <div>
                    <div className="font-semibold">User {review}</div>
                    <div className="text-sm text-muted-foreground">2 days ago</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`h-4 w-4 ${
                        star <= 4 ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground">
                Great product! Exactly what I was looking for. The digital quality is excellent and the download was instant.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold">Related Products</h2>
            <Link
              href="/products"
              className="text-sm font-semibold text-foreground/80 hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="rounded-2xl border border-border bg-card p-5 hover:bg-muted"
              >
                <div className="text-sm text-muted-foreground">{p.category}</div>
                <div className="mt-1 font-semibold">{p.title}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {formatINRFromCents(p.priceCents)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Secure delivery will be enabled once payments are connected.
      </div>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.ReactNode> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return <ProductDetailContent product={product} />;
}
