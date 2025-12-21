"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthStatus() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  if (loading) {
    return <div className="w-12 h-4 bg-muted animate-pulse rounded"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/orders" className="text-foreground/80 hover:text-foreground">
          Orders
        </Link>
        <Link href="/profile" className="text-foreground/80 hover:text-foreground">
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="text-foreground/80 hover:text-foreground"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link href="/auth/login" className="text-foreground/80 hover:text-foreground">
      Login
    </Link>
  );
}
