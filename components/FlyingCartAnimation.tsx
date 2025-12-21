"use client";

import { useEffect, useRef } from "react";

interface FlyingCartAnimationProps {
  trigger: boolean;
  onComplete: () => void;
  sourceElement?: HTMLElement | null;
  productImage?: string;
  productTitle?: string;
}

export default function FlyingCartAnimation({
  trigger,
  onComplete,
  sourceElement,
  productImage,
  productTitle,
}: FlyingCartAnimationProps) {
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || !sourceElement) return;

    const flyingItem = animationRef.current;
    if (!flyingItem) return;

    // Get source and target positions
    const sourceRect = sourceElement.getBoundingClientRect();
    const cartElement = document.querySelector('[data-cart-icon]') as HTMLElement;
    const targetRect = cartElement?.getBoundingClientRect();

    if (!targetRect) {
      onComplete();
      return;
    }

    // Set initial position
    flyingItem.style.position = 'fixed';
    flyingItem.style.left = `${sourceRect.left + sourceRect.width / 2}px`;
    flyingItem.style.top = `${sourceRect.top + sourceRect.height / 2}px`;
    flyingItem.style.transform = 'translate(-50%, -50%)';
    flyingItem.style.zIndex = '9999';
    flyingItem.style.pointerEvents = 'none';
    flyingItem.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    flyingItem.style.opacity = '1';

    // Show the flying item
    setTimeout(() => {
      if (flyingItem) {
        flyingItem.style.left = `${targetRect.left + targetRect.width / 2}px`;
        flyingItem.style.top = `${targetRect.top + targetRect.height / 2}px`;
        flyingItem.style.transform = 'translate(-50%, -50%) scale(0.3)';
        flyingItem.style.opacity = '0.8';
      }
    }, 50);

    // Clean up after animation
    setTimeout(() => {
      if (flyingItem) {
        flyingItem.style.opacity = '0';
      }
      setTimeout(() => {
        onComplete();
      }, 200);
    }, 800);
  }, [trigger, sourceElement, onComplete]);

  if (!trigger) return null;

  return (
    <div
      ref={animationRef}
      className="w-12 h-12 rounded-lg bg-white shadow-lg border border-gray-200 flex items-center justify-center"
    >
      {productImage ? (
        <img
          src={productImage}
          alt={productTitle}
          className="w-10 h-10 object-contain"
        />
      ) : (
        <span className="text-lg font-bold text-gray-600">
          {productTitle?.charAt(0) || "P"}
        </span>
      )}
    </div>
  );
}
