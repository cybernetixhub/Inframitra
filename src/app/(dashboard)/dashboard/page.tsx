import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { LinkButton } from "@/components/shared/link-button";
import {
  ShoppingCart,
  Heart,
  Package,
  DollarSign,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const userId = session.user.id;
  const role = session.user.role;

  if (role === "SELLER" || role === "ADMIN") {
    return <SellerDashboard userId={userId} />;
  }

  return <BuyerDashboard userId={userId} />;
}

async function BuyerDashboard({ userId }: { userId: string }) {
  const [recentOrders, wishlistCount] = await Promise.all([
    prisma.order.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        items: { take: 2 },
      },
    }),
    prisma.wishlistItem.count({ where: { userId } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here is an overview of your account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-3xl">{recentOrders.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart className="size-4" />
              <span>Lifetime orders</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Wishlist Items</CardDescription>
            <CardTitle className="text-3xl">{wishlistCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="size-4" />
              <span>Items saved</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your latest purchases</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No orders yet.</p>
              <LinkButton
                href="/products"
                variant="default"
                size="sm"
                className="mt-4"
              >
                Browse Products
              </LinkButton>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)} -{" "}
                      {order.items.map((i) => i.productTitle).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(order.total.toString())}
                    </p>
                    <Badge variant="secondary">{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

async function SellerDashboard({ userId }: { userId: string }) {
  const [productCount, orderItems, recentOrders] = await Promise.all([
    prisma.product.count({ where: { sellerId: userId } }),
    prisma.orderItem.findMany({
      where: { sellerId: userId },
      select: { totalPrice: true },
    }),
    prisma.order.findMany({
      where: { items: { some: { sellerId: userId } } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        buyer: { select: { name: true, email: true } },
        items: {
          where: { sellerId: userId },
        },
      },
    }),
  ]);

  const totalRevenue = orderItems.reduce(
    (sum, item) => sum + Number(item.totalPrice),
    0
  );
  const totalSales = orderItems.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Seller Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your store performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">
              {formatPrice(totalRevenue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="size-4" />
              <span>Lifetime earnings</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Sales</CardDescription>
            <CardTitle className="text-3xl">{totalSales}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="size-4" />
              <span>Items sold</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Products</CardDescription>
            <CardTitle className="text-3xl">{productCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="size-4" />
              <span>Active listings</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Orders</CardDescription>
            <CardTitle className="text-3xl">{recentOrders.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClipboardList className="size-4" />
              <span>Recent orders</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders for your products</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No orders yet.
            </p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.buyer.name || order.buyer.email} -{" "}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(
                        order.items
                          .reduce((s, i) => s + Number(i.totalPrice), 0)
                          .toString()
                      )}
                    </p>
                    <Badge variant="secondary">{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
