import { PackageSearch } from "lucide-react";
import { ProductCard } from "./product-card";

interface Product {
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
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <PackageSearch className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h3 className="mb-2 text-lg font-semibold">No products found</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try adjusting your search or filter criteria to find what you are
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
