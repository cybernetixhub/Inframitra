import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductSearch } from "@/components/products/product-search";
import { Pagination } from "@/components/shared/pagination";

export const metadata = {
  title: "Products | IT Hardware Marketplace",
  description:
    "Browse enterprise IT hardware including servers, storage, networking, and more.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    condition?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    limit?: string;
    seller?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category || "";
  const brand = params.brand || "";
  const condition = params.condition || "";
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;
  const sort = params.sort || "newest";
  const page = parseInt(params.page || "1", 10);
  const limit = Math.min(parseInt(params.limit || "12", 10), 50);
  const seller = params.seller || "";

  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
  };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (category) {
    const categorySlugs = category.split(",");
    if (categorySlugs.length === 1) {
      where.category = { slug: categorySlugs[0] };
    } else {
      where.category = { slug: { in: categorySlugs } };
    }
  }

  if (brand) {
    const brandSlugs = brand.split(",");
    if (brandSlugs.length === 1) {
      where.brand = { slug: brandSlugs[0] };
    } else {
      where.brand = { slug: { in: brandSlugs } };
    }
  }

  if (condition) {
    const conditions = condition.split(",");
    where.condition = { in: conditions as any };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = new Prisma.Decimal(minPrice);
    if (maxPrice) where.price.lte = new Prisma.Decimal(maxPrice);
  }

  if (seller) {
    where.sellerId = seller;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput;
  switch (sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "rating":
      orderBy = { reviews: { _count: "desc" } };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  // Fetch data in parallel
  const [productsRaw, total, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
            sellerProfile: {
              select: {
                storeName: true,
                storeSlug: true,
                verified: true,
                rating: true,
              },
            },
          },
        },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: { where: { status: "ACTIVE" } } },
        },
      },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const products = productsRaw.map((product) => {
    const ratings = product.reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;
    const { reviews, ...rest } = product;
    return {
      ...rest,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: ratings.length,
    };
  });

  const totalPages = Math.ceil(total / limit);

  const formattedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    productCount: c._count.products,
  }));

  const formattedBrands = brands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Products</h1>
        <p className="text-muted-foreground">
          Browse enterprise IT hardware from trusted sellers
        </p>
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <ProductSearch />
        </Suspense>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters sidebar */}
        <aside className="w-full shrink-0 lg:w-64">
          <Suspense fallback={null}>
            <ProductFilters
              categories={formattedCategories}
              brands={formattedBrands}
            />
          </Suspense>
        </aside>

        {/* Product listing */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {total} {total === 1 ? "product" : "products"} found
            </p>
          </div>

          <ProductGrid products={products} />

          {totalPages > 1 && (
            <div className="mt-8">
              <Suspense fallback={null}>
                <Pagination currentPage={page} totalPages={totalPages} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
