import Link from "next/link";
import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import CartLink from "@/components/CartLink";
import AuthStatus from "@/components/AuthStatus";

export const metadata: Metadata = {
  title: "ProdVault - Buy Digital Entertainment | Manga, Manhwa, Light Novels",
  description: "Your premium destination for digital entertainment. Founded and operated by Saurabh. Instant delivery, secure checkout.",
  keywords: ["manga", "manhwa", "light novels", "digital entertainment", "downloads", "saurabh"],
  authors: [{ name: "Saurabh", url: "https://provault.com" }],
  creator: "Saurabh",
  publisher: "ProdVault",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050816] text-slate-100 antialiased font-sans flex flex-col">
        <Providers>
          {/* Navbar */}
          <header className="border-b border-white/5 bg-black/40 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/90 text-xs font-semibold tracking-tight">
                  PV
                </div>
                <span className="text-base font-semibold tracking-tight">
                  ProdVault
                </span>
              </Link>

              <nav className="flex items-center gap-6 text-sm">
                <Link href="/products" className="text-slate-300 transition hover:text-white">
                  Products
                </Link>
                <CartLink />
                <AuthStatus />
              </nav>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
