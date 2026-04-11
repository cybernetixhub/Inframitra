import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/constants";
import { SellerOrderStatusUpdate } from "@/components/seller/order-status-update";

export const metadata = {
  title: "Seller Orders",
};

export default async function SellerOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    where: {
      items: { some: { sellerId: session.user.id } },
    },
    orderBy: { createdAt: "desc" },
    include: {
      buyer: { select: { name: true, email: true } },
      items: {
        where: { sellerId: session.user.id },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Seller Orders</h1>
        <p className="text-muted-foreground">
          Manage orders for your products.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Update Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const sellerTotal = order.items.reduce(
                  (sum, item) => sum + Number(item.totalPrice),
                  0
                );
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {order.buyer.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.buyer.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <p key={item.id} className="text-sm">
                            {item.productTitle} x{item.quantity}
                          </p>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(sellerTotal)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[order.status] || ""
                        }`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <SellerOrderStatusUpdate
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
