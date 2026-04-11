import Link from "next/link";
import Image from "next/image";
import { Star, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { CONDITION_LABELS, CONDITION_COLORS } from "@/lib/constants";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number | string;
    comparePrice?: number | string | null;
    condition: string;
    images: { id: string; url: string; alt?: string | null }[];
    seller: {
      id: string;
      name: string | null;
      sellerProfile?: {
        storeName: string;
        storeSlug: string;
        verified: boolean;
      } | null;
    };
    category?: {
      name: string;
      slug: string;
    } | null;
    avgRating: number;
    reviewCount: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0];
  const price = Number(product.price);
  const comparePrice = product.comparePrice
    ? Number(product.comparePrice)
    : null;
  const sellerName =
    product.seller?.sellerProfile?.storeName || product.seller?.name || "Seller";

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.alt || product.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
          <Badge
            className={`absolute left-2 top-2 ${CONDITION_COLORS[product.condition] || ""}`}
            variant="secondary"
          >
            {CONDITION_LABELS[product.condition] || product.condition}
          </Badge>
        </div>
        <CardContent className="p-4">
          {product.category && (
            <p className="mb-1 text-xs text-muted-foreground">
              {product.category.name}
            </p>
          )}
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight">
            {product.title}
          </h3>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(price)}
            </span>
            {comparePrice && comparePrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
          </div>
          <div className="mb-2 flex items-center gap-1">
            {product.reviewCount > 0 ? (
              <>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.round(product.avgRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">No reviews</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{sellerName}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
