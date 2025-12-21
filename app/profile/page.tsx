"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatINRFromCents } from "@/lib/money";

export default function ProfilePage(): React.ReactNode {
  const router = useRouter();
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
        
        // Fetch user's orders - don't fail the whole profile if orders fail
        return fetch("/api/orders").catch(() => null);
      })
      .then((res) => {
        if (res) {
          if (!res.ok) {
            // If orders fail, just log it and continue with empty orders
            console.warn("Orders API failed, showing empty orders");
            setOrders([]);
            return;
          }
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          setOrders(data.orders || []);
        }
      })
      .catch((e) => {
        console.error("Profile load error:", e);
        // Don't set error state, just show profile without orders
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-8"></div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="h-64 bg-muted rounded"></div>
            <div className="md:col-span-2 space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
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
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account and view your order history
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold hover:bg-muted"
        >
          Logout
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* User Info Card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-sm font-semibold">Account Details</div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="mt-1 font-medium">{user?.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="mt-1 font-medium">{user?.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Member Since</div>
              <div className="mt-1 font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Recent Orders</div>
            <Link href="/orders" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          
          {orders.length === 0 ? (
            <div className="mt-4 text-center py-8">
              <div className="text-muted-foreground">No orders yet</div>
              <Link
                href="/products"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div>
                    <div className="font-medium">Order #{order.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatINRFromCents(order.totalCents)}</div>
                    <div className="text-sm text-muted-foreground">{order.items?.length || 0} items</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="text-sm font-semibold">Quick Actions</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link
            href="/orders"
            className="flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-muted"
          >
            View All Orders
          </Link>
          <Link
            href="/products"
            className="flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-muted"
          >
            Browse Products
          </Link>
          <Link
            href="/cart"
            className="flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-muted"
          >
            Shopping Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
