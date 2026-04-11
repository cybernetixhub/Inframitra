import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/constants";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export const metadata = {
  title: "All Orders",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      buyer: { select: { name: true, email: true } },
      items: {
        take: 3,
        select: {
          id: true,
          productTitle: true,
          quantity: true,
          totalPrice: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Orders</h1>
        <p className="text-muted-foreground">
          View and monitor all marketplace orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No orders yet.
        </p>
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
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
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
                  <TableCell className="font-medium">
                    {formatPrice(order.total.toString())}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[order.status] || ""
                      }`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.paymentStatus === "PAID"
                          ? "default"
                          : order.paymentStatus === "FAILED"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
