"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage(): React.ReactNode {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      // Check if response is ok before trying to parse JSON
      if (!res.ok) {
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(text || "Signup failed");
        }
        throw new Error(data.error || "Signup failed");
      }

      // Try to parse JSON response
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("JSON Parse Error:", text);
        throw new Error("Invalid response from server");
      }

      if (!data.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Redirect to login after successful signup
      router.push("/auth/login?message=Account created successfully");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-3xl border border-border bg-card p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-1 text-muted-foreground">
          Create an account to start shopping.
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-ring/40 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>

          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold hover:text-foreground">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
