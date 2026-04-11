"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONDITION_LABELS } from "@/lib/constants";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
}

export function ProductFilters({ categories, brands }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );

  const selectedCategories = searchParams.get("category")?.split(",") || [];
  const selectedConditions = searchParams.get("condition")?.split(",") || [];
  const selectedBrands = searchParams.get("brand")?.split(",") || [];
  const currentSort = searchParams.get("sort") || "newest";

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Reset to page 1 when filters change
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const toggleFilter = useCallback(
    (key: string, value: string) => {
      const current = searchParams.get(key)?.split(",").filter(Boolean) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const queryString = createQueryString({
        [key]: updated.length > 0 ? updated.join(",") : null,
      });
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [searchParams, createQueryString, router, pathname]
  );

  const applyPriceFilter = useCallback(() => {
    const queryString = createQueryString({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
    });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, [minPrice, maxPrice, createQueryString, router, pathname]);

  const handleSortChange = useCallback(
    (value: string | null) => {
      if (!value) return;
      const queryString = createQueryString({ sort: value });
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [createQueryString, router, pathname]
  );

  const clearAllFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
    setMinPrice("");
    setMaxPrice("");
  }, [router, pathname]);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedConditions.length > 0 ||
    selectedBrands.length > 0 ||
    minPrice ||
    maxPrice;

  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <h2 className="font-semibold">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <h3 className="mb-3 text-sm font-medium">Sort by</h3>
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-sm font-medium">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.slug}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.slug)}
                onChange={() => toggleFilter("category", category.slug)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <span className="flex-1">{category.name}</span>
              <span className="text-xs text-muted-foreground">
                ({category.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Condition */}
      <div>
        <h3 className="mb-3 text-sm font-medium">Condition</h3>
        <div className="space-y-2">
          {Object.entries(CONDITION_LABELS).map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedConditions.includes(key)}
                onChange={() => toggleFilter("condition", key)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="mb-3 text-sm font-medium">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
            className="h-9"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
            className="h-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={applyPriceFilter}
          className="mt-2 w-full"
        >
          Apply
        </Button>
      </div>

      <Separator />

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium">Brand</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label
                key={brand.slug}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.slug)}
                  onChange={() => toggleFilter("brand", brand.slug)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                <span>{brand.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
