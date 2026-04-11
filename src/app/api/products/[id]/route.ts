import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@/generated/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        specs: {
          orderBy: { sortOrder: "asc" },
        },
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

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Increment views in the background
    prisma.product
      .update({
        where: { id },
        data: { views: { increment: 1 } },
      })
      .catch(() => {});

    const ratings = product.reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    return NextResponse.json({
      ...product,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: ratings.length,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: { sellerId: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const isOwner = product.sellerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      comparePrice,
      condition,
      status,
      categoryId,
      brandId,
      sku,
      quantity,
      warranty,
      shippingInfo,
      images,
      specs,
      metaTitle,
      metaDescription,
    } = body;

    const updateData: Prisma.ProductUpdateInput = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = new Prisma.Decimal(price);
    if (comparePrice !== undefined) {
      updateData.comparePrice = comparePrice
        ? new Prisma.Decimal(comparePrice)
        : null;
    }
    if (condition !== undefined) updateData.condition = condition;
    if (status !== undefined) updateData.status = status;
    if (categoryId !== undefined)
      updateData.category = { connect: { id: categoryId } };
    if (brandId !== undefined) {
      updateData.brand = brandId ? { connect: { id: brandId } } : { disconnect: true };
    }
    if (sku !== undefined) updateData.sku = sku;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (warranty !== undefined) updateData.warranty = warranty;
    if (shippingInfo !== undefined) updateData.shippingInfo = shippingInfo;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      updateData.metaDescription = metaDescription;

    // Handle images replacement
    if (images !== undefined) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map(
            (img: { url: string; alt?: string }, index: number) => ({
              productId: id,
              url: img.url,
              alt: img.alt || "",
              sortOrder: index,
            })
          ),
        });
      }
    }

    // Handle specs replacement
    if (specs !== undefined) {
      await prisma.productSpec.deleteMany({ where: { productId: id } });
      if (specs.length > 0) {
        await prisma.productSpec.createMany({
          data: specs.map(
            (spec: { label: string; value: string }, index: number) => ({
              productId: id,
              label: spec.label,
              value: spec.value,
              sortOrder: index,
            })
          ),
        });
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        specs: { orderBy: { sortOrder: "asc" } },
        category: true,
        brand: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: { sellerId: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const isOwner = product.sellerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.product.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return NextResponse.json({ message: "Product archived successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
