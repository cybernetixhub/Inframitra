import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { Heart } from "lucide-react";

export const metadata = { title: "My Wishlist" };

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: { select: { name: true, slug: true } },
          seller: {
            select: {
              id: true,
              name: true,
              sellerProfile: {
                select: {
                  storeName: true,
                  storeSlug: true,
                  verified: true,
                },
              },
            },
          },
          reviews: { select: { rating: true } },
        },
      },
    },
  });

  const products = wishlistItems.map((item) => {
    const ratings = item.product.reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? Math.round(
            (ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10
          ) / 10
        : 0;
    return {
      id: item.product.id,
      title: item.product.title,
      slug: item.product.slug,
      price: Number(item.product.price),
      comparePrice: item.product.comparePrice
        ? Number(item.product.comparePrice)
        : null,
      condition: item.product.condition as string,
      images: item.product.images,
      seller: item.product.seller,
      category: item.product.category,
      avgRating,
      reviewCount: ratings.length,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Wishlist</h1>
        <p className="text-muted-foreground">
          Products you&apos;ve saved for later.
        </p>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="mb-4 size-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">Your wishlist is empty</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Browse products and click the heart icon to save them here.
            </p>
            <LinkButton href="/products">Browse Products</LinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
