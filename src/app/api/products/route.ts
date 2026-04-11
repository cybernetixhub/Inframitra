import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { slugify } from "@/lib/format";
import { Prisma } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const condition = searchParams.get("condition") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "12", 10), 50);
    const seller = searchParams.get("seller") || "";

    const skip = (page - 1) * limit;

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
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (condition) {
      const conditions = condition.split(",");
      where.condition = { in: conditions as any };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = new Prisma.Decimal(minPrice);
      }
      if (maxPrice) {
        where.price.lte = new Prisma.Decimal(maxPrice);
      }
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

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          brand: {
            select: { id: true, name: true, slug: true },
          },
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
          reviews: {
            select: { rating: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithRatings = products.map((product) => {
      const ratings = product.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
      const { reviews, ...rest } = product;
      return {
        ...rest,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: ratings.length,
      };
    });

    return NextResponse.json({
      products: productsWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { sellerProfile: true },
    });

    if (!user || user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Only sellers can create products" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      comparePrice,
      condition,
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

    if (!title || !description || !price || !condition || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, price, condition, categoryId" },
        { status: 400 }
      );
    }

    let slug = slugify(title);
    const existingSlug = await prisma.product.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const product = await prisma.product.create({
      data: {
        sellerId: session.user.id,
        title,
        slug,
        description,
        price: new Prisma.Decimal(price),
        comparePrice: comparePrice
          ? new Prisma.Decimal(comparePrice)
          : undefined,
        condition,
        status: "ACTIVE",
        categoryId,
        brandId: brandId || undefined,
        sku: sku || undefined,
        quantity: quantity ?? 1,
        warranty: warranty || undefined,
        shippingInfo: shippingInfo || undefined,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        images: images?.length
          ? {
              create: images.map(
                (img: { url: string; alt?: string }, index: number) => ({
                  url: img.url,
                  alt: img.alt || title,
                  sortOrder: index,
                })
              ),
            }
          : undefined,
        specs: specs?.length
          ? {
              create: specs.map(
                (
                  spec: { label: string; value: string },
                  index: number
                ) => ({
                  label: spec.label,
                  value: spec.value,
                  sortOrder: index,
                })
              ),
            }
          : undefined,
      },
      include: {
        images: true,
        specs: true,
        category: true,
        brand: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
