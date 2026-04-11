import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            comparePrice: true,
            condition: true,
            status: true,
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
            },
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
            reviews: {
              select: { rating: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const items = wishlistItems.map((item) => {
      const ratings = item.product.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
      const { reviews, ...product } = item.product;
      return {
        id: item.id,
        productId: item.productId,
        createdAt: item.createdAt,
        product: {
          ...product,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: ratings.length,
        },
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Toggle: remove if exists, add if not
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ wishlisted: false, message: "Removed from wishlist" });
    }

    await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    return NextResponse.json(
      { wishlisted: true, message: "Added to wishlist" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}
