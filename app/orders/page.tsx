"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { formatINRFromCents } from "@/lib/money";

export default function OrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{ placed?: string }>;
}): React.ReactNode {
  const router = useRouter();
  const resolvedSearchParams = use(searchParams || Promise.resolve({ placed: undefined }));
  const placed = resolvedSearchParams.placed === "1";
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/auth/login");
          return;
        }
        setUser(data.user);
        
        // Fetch user's orders
        return fetch("/api/orders");
      })
      .then((res) => {
        if (res) {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          setOrders(data.orders || []);
        }
      })
      .catch((e) => {
        setError("Failed to load orders");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-red-500/20 bg-red-50 p-8 text-center">
          <div className="text-lg font-semibold text-red-700">Error</div>
          <div className="mt-2 text-red-600">{error}</div>
          <Link
            href="/"
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Orders</h1>
          <p className="mt-1 text-muted-foreground">
            Your purchase history and downloads
          </p>
        </div>
        <Link
          href="/products"
          className="text-sm font-semibold text-foreground/80 hover:text-foreground"
        >
          Browse products
        </Link>
      </div>

      {placed && (
        <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-50 p-6">
          <div className="text-lg font-semibold text-green-700">Order placed successfully!</div>
          <div className="mt-1 text-green-600">
            Your order has been received and will be processed shortly.
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-8">
          <div className="text-lg font-semibold">No orders yet</div>
          <div className="mt-1 text-muted-foreground">
            Once you purchase a product, it will appear here with download links.
          </div>
          <div className="mt-5">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-ring/40 hover:opacity-95"
            >
              Start shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold">Order #{order.id}</div>
                  <div className="text-sm text-muted-foreground">
                    Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recently"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{formatINRFromCents(order.totalCents)}</div>
                  <div className="text-sm text-muted-foreground">{order.items?.length || 0} items</div>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="text-sm font-semibold mb-3">Order Items</div>
                <div className="space-y-2">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <div className="font-medium">{item.product?.title || "Product"}</div>
                        <div className="text-muted-foreground">
                          {item.quantity} × {formatINRFromCents(item.unitCents)}
                        </div>
                      </div>
                      <div className="font-medium">{formatINRFromCents(item.totalCents)}</div>
                    </div>
                  )) || <div className="text-muted-foreground">No items found</div>}
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Status: <span className="font-medium text-green-600">Processing</span>
                </div>
                <button className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted">
                  View Downloads
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
