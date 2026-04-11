"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";

interface OrderData {
  id: string;
  orderNumber: string;
  total: string | number;
  subtotal: string | number;
  tax: string | number;
  shippingCost: string | number;
  status: string;
  createdAt: string;
  items: {
    id: string;
    productTitle: string;
    productImage: string | null;
    quantity: number;
    unitPrice: string | number;
    totalPrice: string | number;
  }[];
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch order");
        return res.json();
      })
      .then((data) => {
        setOrder(data.order);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h1 className="text-2xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {orderNumber && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <Package className="h-4 w-4" />
            <span className="text-sm font-medium">
              Order Number: {orderNumber}
            </span>
          </div>
        )}

        {order && (
          <Card className="mt-8 text-left">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.productTitle} x{item.quantity}
                    </span>
                    <span>{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {Number(order.shippingCost) === 0
                      ? "Free"
                      : formatPrice(order.shippingCost)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/products" className={buttonVariants()}>
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/orders"
            className={buttonVariants({ variant: "outline" })}
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
