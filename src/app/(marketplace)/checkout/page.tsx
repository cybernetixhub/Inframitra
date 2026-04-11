"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CartSummary } from "@/components/cart/cart-summary";
import {
  CheckoutForm,
  type ShippingData,
} from "@/components/checkout/checkout-form";
import { MockPayment } from "@/components/checkout/mock-payment";
import { useCart } from "@/hooks/use-cart";
import type { PaymentResult } from "@/lib/payment";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const { items, cartTotal, isLoading, mutate } = useCart();
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total with tax and shipping for payment
  const TAX_RATE = 0.08;
  const FREE_SHIPPING_THRESHOLD = 500;
  const SHIPPING_COST = 29.99;
  const tax = cartTotal * TAX_RATE;
  const shipping =
    cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = cartTotal + tax + shipping;

  if (authStatus === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to checkout</h1>
        <p className="text-muted-foreground mb-6">
          You need to be signed in to complete your purchase.
        </p>
        <Link href="/signin?callbackUrl=/checkout" className={buttonVariants()}>Sign In</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Add items to your cart before checking out.
        </p>
        <Link href="/products" className={buttonVariants()}>Browse Products</Link>
      </div>
    );
  }

  function handleShippingSubmit(data: ShippingData) {
    setShippingData(data);
  }

  async function handlePaymentSuccess(result: PaymentResult) {
    if (!shippingData) {
      setError("Please fill in the shipping form first.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingName: shippingData.name,
          shippingAddress: shippingData.address,
          shippingCity: shippingData.city,
          shippingState: shippingData.state,
          shippingZip: shippingData.zip,
          shippingCountry: shippingData.country,
          shippingPhone: shippingData.phone || undefined,
          paymentDetails: {
            cardNumber: "mock",
            expiryMonth: "12",
            expiryYear: "28",
            cvv: "123",
            name: shippingData.name,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Checkout failed");
        return;
      }

      mutate();
      router.push(
        `/checkout/success?orderId=${data.order.id}&orderNumber=${data.order.orderNumber}`
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handlePaymentError(msg: string) {
    setError(msg);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/cart" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column: Shipping + Payment */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutForm
                onSubmit={handleShippingSubmit}
                onChange={(partial) => {
                  // Keep partial shipping data synced
                }}
              />
              {!shippingData && (
                <Button
                  type="submit"
                  form="shipping-form"
                  className="mt-4 w-full"
                >
                  Continue to Payment
                </Button>
              )}
              {shippingData && (
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  Shipping address saved
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              {shippingData ? (
                <MockPayment
                  amount={total}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  disabled={isSubmitting}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Please fill in your shipping address first.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground truncate mr-2">
                      {item.product.title} x{item.quantity}
                    </span>
                    <span className="whitespace-nowrap font-medium">
                      $
                      {(Number(item.product.price) * item.quantity).toFixed(
                        2
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <CartSummary subtotal={cartTotal} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
