"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";

interface FeaturedProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  condition: string;
  images: { id: string; url: string; alt: string | null }[];
  seller: {
    id: string;
    name: string | null;
    sellerProfile: {
      storeName: string;
      storeSlug: string;
      verified: boolean;
    } | null;
  };
  category: { name: string; slug: string };
  avgRating: number;
  reviewCount: number;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);

  useEffect(() => {
    fetch("/api/products?limit=6&sort=newest")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold tracking-tight">
          Trending This Week
        </h2>
        <p className="mx-auto mb-10 max-w-lg text-center text-muted-foreground">
          Hand-picked enterprise hardware at unbeatable prices
        </p>

        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[260px] flex-shrink-0 md:min-w-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
