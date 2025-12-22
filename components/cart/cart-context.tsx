"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  itemCount: number;
  subtotalCents: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "prodvault_cart_v1";

function isValidCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.productId === "string" &&
    typeof record.quantity === "number" &&
    Number.isFinite(record.quantity)
  );
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;
      const cleaned = parsed
        .filter(isValidCartItem)
        .map((item) => ({
          productId: item.productId,
          quantity: Math.max(1, Math.floor(item.quantity)),
        }));
      setItems(cleaned);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      return;
    }
  }, [items]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotalCents = useMemo(() => {
    return items.reduce((sum, item) => {
      // For now, use a default price since we can't access the API from client context
      // In a real app, you'd fetch product details or store price in cart
      const defaultPrice = 89900; // Default price in cents
      return sum + defaultPrice * item.quantity;
    }, 0);
  }, [items]);

  const value: CartContextValue = useMemo(
    () => ({
      items,
      addItem: (productId, quantity = 1) => {
        setItems((prev) => {
          const q = Math.max(1, Math.floor(quantity));
          const existing = prev.find((p) => p.productId === productId);
          if (!existing) return [...prev, { productId, quantity: q }];
          return prev.map((p) =>
            p.productId === productId
              ? { ...p, quantity: p.quantity + q }
              : p,
          );
        });
      },
      removeItem: (productId) => {
        setItems((prev) => prev.filter((p) => p.productId !== productId));
      },
      setQuantity: (productId, quantity) => {
        setItems((prev) => {
          const q = Math.floor(quantity);
          if (q <= 0) return prev.filter((p) => p.productId !== productId);
          return prev.map((p) =>
            p.productId === productId ? { ...p, quantity: q } : p,
          );
        });
      },
      clear: () => setItems([]),
      itemCount,
      subtotalCents,
    }),
    [items, itemCount, subtotalCents],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
