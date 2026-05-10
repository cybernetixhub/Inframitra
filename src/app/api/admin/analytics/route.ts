import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueAggregate,
      usersByRole,
      productsByStatus,
      ordersByStatus,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
      prisma.user.groupBy({
        by: ["role"],
        _count: { role: true },
      }),
      prisma.product.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          createdAt: true,
          buyer: { select: { name: true } },
        },
      }),
    ]);

    const totalRevenue = Number(revenueAggregate._sum.total ?? 0);

    const roleBreakdown = usersByRole.reduce(
      (acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      },
      {} as Record<string, number>
    );

    const statusBreakdown = productsByStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>
    );

    const orderStatusBreakdown = ordersByStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
      usersByRole: roleBreakdown,
      productsByStatus: statusBreakdown,
      ordersByStatus: orderStatusBreakdown,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
