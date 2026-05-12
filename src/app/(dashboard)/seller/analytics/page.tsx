import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

export const metadata = { title: "Seller Analytics" };

export default async function SellerAnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [products, orderItems, reviews] = await Promise.all([
    prisma.product.findMany({
      where: { sellerId: session.user.id },
      select: { id: true, status: true, views: true },
    }),
    prisma.orderItem.findMany({
      where: { sellerId: session.user.id },
      select: { totalPrice: true, quantity: true },
    }),
    prisma.review.findMany({
      where: {
        product: { sellerId: session.user.id },
      },
      select: { rating: true },
    }),
  ]);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "ACTIVE").length;
  const totalViews = products.reduce((sum, p) => sum + p.views, 0);
  const totalOrders = orderItems.length;
  const totalRevenue = orderItems.reduce(
    (sum, item) => sum + Number(item.totalPrice),
    0
  );
  const totalUnitsSold = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "N/A";

  const stats = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Products Listed",
      value: `${activeProducts} / ${totalProducts}`,
      icon: Package,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Units Sold",
      value: totalUnitsSold.toString(),
      icon: TrendingUp,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Seller Analytics</h1>
        <p className="text-muted-foreground">
          Overview of your sales performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex size-12 items-center justify-center rounded-xl ${stat.bg}`}
                >
                  <stat.icon className={`size-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Product Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalViews.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgRating}</p>
            <p className="text-xs text-muted-foreground">
              from {reviews.length} review(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalOrders > 0
                ? formatPrice(totalRevenue / totalOrders)
                : formatPrice(0)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
