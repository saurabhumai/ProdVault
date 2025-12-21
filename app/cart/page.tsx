"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/cart-context";
import { formatINRFromCents } from "@/lib/money";

export default function CartPage(): React.ReactNode {
  const { items, setQuantity, removeItem, subtotalCents, itemCount } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from API
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cartItemsWithDetails = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
      total: product ? product.priceCents * item.quantity : 0,
    };
  });

  // Calculate real subtotal from fetched products
  const realSubtotalCents = cartItemsWithDetails.reduce((sum, item) => {
    return sum + (item.total || 0);
  }, 0);

  const hasItems = items.length > 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="mt-6 h-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="mt-1 text-muted-foreground">
            Review and modify your items before checkout.
          </p>
        </div>
        <Link
          href="/products"
          className="text-sm font-semibold text-foreground/80 hover:text-foreground"
        >
          Continue shopping
        </Link>
      </div>

      {!hasItems ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
          <div className="text-lg font-semibold">Your cart is empty</div>
          <div className="mt-1 text-muted-foreground">
            Add some products to get started!
          </div>
          <div className="mt-5">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-ring/40 hover:opacity-95"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            {cartItemsWithDetails.map((item) => (
              <div
                key={item.productId}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-lg font-medium text-muted-foreground">${item.product?.title?.charAt(0) || "P"}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-lg font-medium text-muted-foreground">
                        {item.product?.title?.charAt(0) || "P"}
                      </span>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">
                      {item.product?.category || "Digital Product"}
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {item.product?.title || "Product"}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {item.product?.description || "Digital product for instant download"}
                    </div>
                    <div className="mt-2 text-sm font-medium">
                      {formatINRFromCents(item.product?.priceCents || 0)} each
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex flex-col items-end gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded border border-border bg-background text-sm hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded border border-border bg-background text-sm hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                    
                    {/* Item Total */}
                    <div className="text-lg font-semibold">
                      {formatINRFromCents(item.total)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Simple Total and Checkout */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total ({itemCount} items)</div>
                <div className="text-2xl font-semibold">{formatINRFromCents(realSubtotalCents)}</div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold hover:bg-muted"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-ring/40 hover:opacity-95"
                >
                  Proceed to Pay
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
