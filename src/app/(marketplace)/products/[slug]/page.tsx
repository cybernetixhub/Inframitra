import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  Package,
  Truck,
  MessageSquare,
  ShoppingCart,
  Store,
  ChevronRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { CONDITION_LABELS, CONDITION_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/shared/link-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductSpecs } from "@/components/products/product-specs";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      specs: { orderBy: { sortOrder: "asc" } },
      category: true,
      brand: true,
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          sellerProfile: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) return null;

  // Increment views in the background
  prisma.product
    .update({
      where: { slug },
      data: { views: { increment: 1 } },
    })
    .catch(() => {});

  return product;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.metaTitle || `${product.title} | IT Hardware Marketplace`,
    description:
      product.metaDescription ||
      product.description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.substring(0, 160),
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const ratings = product.reviews.map((r) => r.rating);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;
  const reviewCount = ratings.length;
  const price = Number(product.price);
  const comparePrice = product.comparePrice
    ? Number(product.comparePrice)
    : null;
  const sellerProfile = product.seller.sellerProfile;
  const sellerName =
    sellerProfile?.storeName || product.seller.name || "Seller";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {product.category && (
          <>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-foreground"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="truncate text-foreground">{product.title}</span>
      </nav>

      {/* Main product section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Gallery */}
        <ProductGallery images={product.images} title={product.title} />

        {/* Right: Product info */}
        <div className="space-y-6">
          {/* Title and badge */}
          <div>
            {product.brand && (
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                {product.brand.name}
              </p>
            )}
            <h1 className="text-2xl font-bold lg:text-3xl">{product.title}</h1>
          </div>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(avgRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} ({reviewCount}{" "}
                {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(price)}</span>
            {comparePrice && comparePrice > price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
            {comparePrice && comparePrice > price && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                Save {formatPrice(comparePrice - price)}
              </Badge>
            )}
          </div>

          {/* Condition */}
          <div className="flex items-center gap-3">
            <Badge
              className={CONDITION_COLORS[product.condition] || ""}
              variant="secondary"
            >
              {CONDITION_LABELS[product.condition] || product.condition}
            </Badge>
            {product.sku && (
              <span className="text-sm text-muted-foreground">
                SKU: {product.sku}
              </span>
            )}
          </div>

          <Separator />

          {/* Stock & shipping */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>
                {product.quantity > 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {product.quantity} in stock
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">
                    Out of stock
                  </span>
                )}
              </span>
            </div>
            {product.warranty && (
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <span>{product.warranty}</span>
              </div>
            )}
            {product.shippingInfo && (
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span>{product.shippingInfo}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" disabled={product.quantity <= 0}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <LinkButton
              href={`/messages?seller=${product.seller.id}&product=${product.id}`}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Seller
            </LinkButton>
          </div>

          <Separator />

          {/* Seller info */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-muted">
                {product.seller.image ? (
                  <Image
                    src={product.seller.image}
                    alt={sellerName}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <Store className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{sellerName}</span>
                  {sellerProfile?.verified && (
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                {sellerProfile && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {sellerProfile.rating > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {sellerProfile.rating.toFixed(1)}
                      </span>
                    )}
                    {sellerProfile.totalSales > 0 && (
                      <span>{sellerProfile.totalSales} sales</span>
                    )}
                  </div>
                )}
              </div>
              {sellerProfile && (
                <LinkButton
                  href={`/sellers/${sellerProfile.storeSlug}`}
                  variant="outline"
                  size="sm"
                >
                  View Store
                </LinkButton>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specifications, Reviews */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {product.description}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <ProductSpecs specs={product.specs} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {product.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reviews yet. Be the first to review this product.
              </p>
            ) : (
              <div className="space-y-6">
                {/* Review summary */}
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {avgRating.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < Math.round(avgRating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-16" />
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratings.filter(
                        (r) => r === star
                      ).length;
                      const percentage =
                        reviewCount > 0
                          ? (count / reviewCount) * 100
                          : 0;
                      return (
                        <div
                          key={star}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="w-3 text-muted-foreground">
                            {star}
                          </span>
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-amber-400"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-6 text-right text-muted-foreground">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Individual reviews */}
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
                            {review.user.image ? (
                              <Image
                                src={review.user.image}
                                alt={review.user.name || "User"}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium">
                                {(review.user.name || "U").charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {review.user.name || "Anonymous"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.title && (
                        <p className="mb-1 text-sm font-semibold">
                          {review.title}
                        </p>
                      )}
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      )}
                      {review.verified && (
                        <Badge
                          variant="secondary"
                          className="mt-2 text-xs"
                        >
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
