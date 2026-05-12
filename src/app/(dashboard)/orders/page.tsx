import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { LinkButton } from "@/components/shared/link-button";
import { Package, ShoppingCart } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400",
};

export const metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders.</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="mb-4 size-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No orders yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Start shopping to see your orders here.
            </p>
            <LinkButton href="/products">Browse Products</LinkButton>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Order History ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{order.items.length} item(s)</TableCell>
                    <TableCell className="font-mono">
                      {formatPrice(Number(order.total))}
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[order.status] || ""}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
