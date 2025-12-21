"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import { formatINRFromCents } from "@/lib/money";

type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDesc: string;
  priceCents: number;
  popularity: number;
  categoryName?: string;
  image?: string;
};

export default function ProductCard({ p }: { p: Product }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden transition hover:bg-white/10">
      {/* Book Cover Image */}
      <div className="aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
        {p.image && !imageError ? (
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-full object-contain"
            onError={handleImageError}
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-600">
            {p.title.charAt(0)}
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="text-xs text-slate-400">{p.categoryName || "Uncategorized"}</div>
        </div>

        <Link href={`/products/${p.slug}`} className="mt-1 block">
          <div className="text-sm font-semibold tracking-tight text-slate-50 group-hover:text-indigo-400 line-clamp-2">
            {p.title}
          </div>
          <div className="mt-1 text-xs text-slate-400 line-clamp-2">
            {p.description}
          </div>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-slate-50">
            {formatINRFromCents(p.priceCents)}
          </div>
          <AddToCartButton 
            productId={p.id} 
            productImage={p.image}
            productTitle={p.title}
          />
        </div>
      </div>
    </div>
  );
}
