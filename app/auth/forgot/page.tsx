"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage(): React.ReactNode {
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-3xl border border-border bg-card p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-1 text-muted-foreground">
          We’ll send a reset link to your email (backend will be connected next).
        </p>

        <form
          className="mt-6 grid gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-ring/40 hover:opacity-95"
          >
            Send reset link (demo)
          </button>

          <div className="text-sm text-muted-foreground">
            Back to{" "}
            <Link href="/auth/login" className="font-semibold hover:text-foreground">
              login
            </Link>
            .
          </div>
        </form>
      </div>
    </div>
  );
}
