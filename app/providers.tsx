"use client";

import { CartProvider } from "@/components/cart/cart-context";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return <CartProvider>{children}</CartProvider>;
}
