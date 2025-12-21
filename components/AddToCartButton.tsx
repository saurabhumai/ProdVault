"use client";

import { useState, useRef } from "react";
import { useCart } from "@/components/cart/cart-context";
import FlyingCartAnimation from "@/components/FlyingCartAnimation";

export default function AddToCartButton({
  productId,
  productImage,
  productTitle,
}: {
  productId: string;
  productImage?: string;
  productTitle?: string;
}): React.ReactNode {
  const { addItem } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = () => {
    setIsAnimating(true);
    addItem(productId, 1);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleAddToCart}
        className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 transition-colors"
      >
        Add to cart
      </button>
      <FlyingCartAnimation
        trigger={isAnimating}
        sourceElement={buttonRef.current}
        productImage={productImage}
        productTitle={productTitle}
        onComplete={handleAnimationComplete}
      />
    </>
  );
}
