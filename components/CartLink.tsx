"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-context";

export default function CartLink(): React.ReactNode {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative text-foreground/80 hover:text-foreground"
      data-cart-icon
    >
      Cart
      {itemCount > 0 ? (
        <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
