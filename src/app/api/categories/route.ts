import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            products: {
              where: { status: "ACTIVE" },
            },
          },
        },
        children: {
          orderBy: { sortOrder: "asc" },
          include: {
            _count: {
              select: {
                products: {
                  where: { status: "ACTIVE" },
                },
              },
            },
          },
        },
      },
    });

    const formatted = categories
      .filter((c) => !c.parentId)
      .map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        icon: category.icon,
        productCount: category._count.products,
        children: category.children.map((child) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          description: child.description,
          productCount: child._count.products,
        })),
      }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
