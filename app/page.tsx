// app/page.tsx
import Link from "next/link";

const navigation = [
  { name: "Products", href: "/products" },
  { name: "Cart", href: "/cart" },
  { name: "Orders", href: "/orders" },
  { name: "Profile", href: "/profile" },
];

const featuredProducts = [
  {
    category: "Manga",
    price: "₹899",
    title: "Berserk Volume 1",
    description: "The legendary dark fantasy manga that defined a genre.",
    href: "/products/berserk-volume-1",
  },
  {
    category: "Light Novel",
    price: "₹999",
    title: "Omniscient Reader's Viewpoint Volume 1",
    description: "The only reader who knows how the world ends.",
    href: "/products/omniscient-readers-viewpoint-volume-1",
  },
  {
    category: "Light Novel",
    price: "₹999",
    title: "Reverend Insanity Volume 1",
    description:
      "A cunning demon lord's journey to defy fate and achieve immortality.",
    href: "/products/reverend-insanity-volume-1",
  },
];

const categories = [
  { name: "Anime", href: "/products?category=Anime" },
  { name: "Light Novel", href: "/products?category=Light%20Novel" },
  { name: "Manga", href: "/products?category=Manga" },
  { name: "Web Novel", href: "/products?category=Web%20Novel" },
];

const howItWorks = [
  {
    step: "1",
    title: "Choose a product",
    description: "Browse and select your digital products.",
  },
  {
    step: "2",
    title: "Pay securely",
    description: "Safe checkout with multiple payment options.",
  },
  {
    step: "3",
    title: "Instant access",
    description: "Download immediately from your dashboard.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 flex flex-col">
      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 space-y-16 md:space-y-24">
          {/* Hero */}
          <section className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] items-center">
            <div className="space-y-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-indigo-300/80">
                INSTANT DELIVERY · SECURE CHECKOUT
              </p>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
                ProdVault: Buy Entertainment at Your Fingertips
              </h1>

              <p className="max-w-xl text-sm md:text-base text-slate-300">
                Buy your favorite manga, manhwa, light novels, and more with
                instant delivery and secure transactions.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="rounded-md bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-400"
                >
                  Browse products
                </Link>
              </div>

              <dl className="mt-4 grid gap-4 text-xs text-slate-200 sm:grid-cols-3">
                <div className="rounded-lg border border-white/5 bg-white/5 px-3 py-3">
                  <dt className="font-medium">Secure Downloads</dt>
                  <dd className="mt-1 text-[11px] text-slate-300">
                    Encrypted links & access history.
                  </dd>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 px-3 py-3">
                  <dt className="font-medium">Creator Tools</dt>
                  <dd className="mt-1 text-[11px] text-slate-300">
                    Analytics & revenue tracking.
                  </dd>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 px-3 py-3">
                  <dt className="font-medium">Payment Ready</dt>
                  <dd className="mt-1 text-[11px] text-slate-300">
                    Multiple payment methods.
                  </dd>
                </div>
              </dl>
            </div>

            {/* Hero side card */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/40 via-purple-500/20 to-sky-500/40 blur-2xl opacity-40" />
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-5 shadow-xl">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Secure delivery active
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-200">
                    Live
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Recent purchases</span>
                    <span className="text-[11px] text-slate-400">
                      Last 30 days
                    </span>
                  </div>
                  <div className="text-3xl font-semibold tracking-tight text-slate-50">
                    2,847
                  </div>
                  <div className="mt-3 rounded-lg border border-dashed border-indigo-500/40 bg-indigo-500/5 px-3 py-3 text-[11px] text-slate-200">
                    “Downloads are instant and hassle-free. Perfect for manga
                    and light novel collections.”
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured products */}
          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-50">
                  Featured Products
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Handpicked digital products from our collection.
                </p>
              </div>
              <Link
                href="/products"
                className="hidden text-xs font-medium text-indigo-300 hover:text-indigo-200 md:inline-flex"
              >
                View all →
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {featuredProducts.map((product) => (
                <div
                  key={product.title}
                  className="group flex flex-col rounded-xl border border-white/5 bg-white/5 p-4 text-sm shadow-sm transition hover:border-indigo-400/60 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[11px] text-indigo-200">
                      {product.category}
                    </span>
                    <span className="font-semibold text-slate-100">
                      {product.price}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold tracking-tight text-slate-50">
                    {product.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs text-slate-300">
                    {product.description}
                  </p>
                  <Link
                    href={product.href}
                    className="mt-4 inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-slate-100 transition group-hover:bg-indigo-500"
                  >
                    View product
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-2 md:hidden">
              <Link
                href="/products"
                className="text-xs font-medium text-indigo-300 hover:text-indigo-200"
              >
                View all →
              </Link>
            </div>
          </section>

          {/* Categories */}
          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-50">
                  Browse Categories
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Find your next digital product.
                </p>
              </div>
              <Link
                href="/products"
                className="hidden text-xs font-medium text-indigo-300 hover:text-indigo-200 md:inline-flex"
              >
                View all →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group flex flex-col rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-slate-100 transition hover:border-indigo-400/60 hover:bg-white/10"
                >
                  <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-200">
                    {category.name[0]}
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight">
                    {category.name}
                  </h3>
                  <span className="mt-1 text-xs text-slate-300">
                    Browse collection
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-2 md:hidden">
              <Link
                href="/products"
                className="text-xs font-medium text-indigo-300 hover:text-indigo-200"
              >
                View all →
              </Link>
            </div>
          </section>

          {/* How it works & For creators */}
          <section className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] items-start">
            {/* How it works */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight text-slate-50">
                How It Works
              </h2>
              <p className="text-sm text-slate-300">
                Simple, secure, and instant.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {howItWorks.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-slate-200"
                  >
                    <div className="mb-4 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-[11px] font-semibold text-indigo-200">
                      {item.step}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-50">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-300">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* For creators */}
            <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-500/15 via-slate-900 to-slate-950 p-6 text-sm text-slate-100 shadow-lg">
              <h2 className="text-xl font-semibold tracking-tight text-slate-50">
                For Creators
              </h2>
              <p className="mt-1 text-sm text-slate-200">Start Selling Today</p>
              <p className="mt-3 text-xs text-slate-200">
                Professional platform for digital product sales with analytics
                and secure delivery. Launch quickly and grow your audience with
                tools built for creators.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-xs">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-400"
                >
                  Start selling
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center rounded-md border border-indigo-300/50 bg-transparent px-4 py-2 text-xs font-medium text-indigo-100 transition hover:border-indigo-200 hover:bg-indigo-500/10"
                >
                  Go to cart
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/90 text-xs font-semibold tracking-tight">
                  PV
                </div>
                <span className="text-base font-semibold tracking-tight">
                  ProdVault
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Your premium destination for digital entertainment. Founded and operated by Saurabh.
              </p>
              <div className="mt-4 space-y-1 text-xs text-slate-500">
                <p>Contact: saurabh@provault.com</p>
                <p>Owner: Saurabh</p>
                <p> 2024 ProdVault - All rights reserved</p>
              </div>
            </div>

            <div className="md:col-span-8 grid gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-50">Company</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-400">
                  <li>
                    <Link href="/about" className="transition hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="transition hover:text-white">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="transition hover:text-white">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-50">Product</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-400">
                  <li>
                    <Link href="/products" className="transition hover:text-white">
                      Browse
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="transition hover:text-white">
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/deals" className="transition hover:text-white">
                      Deals
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-50">Legal</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-400">
                  <li>
                    <Link href="/privacy" className="transition hover:text-white">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="transition hover:text-white">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/refund" className="transition hover:text-white">
                      Refund Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/5 pt-8 text-center text-xs text-slate-500">
            <p> 2024 ProdVault. Owned and operated by Saurabh. All trademarks and copyrights belong to their respective owners.</p>
            <p className="mt-1">Digital entertainment platform built with passion for manga, manhwa, and light novel enthusiasts.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
