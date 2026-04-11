"use client";

import { formatPrice } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subtotal: number;
}

const TAX_RATE = 0.18; // GST 18%
const FREE_SHIPPING_THRESHOLD = 25000;
const SHIPPING_COST = 1999;

export function CartSummary({ subtotal }: CartSummaryProps) {
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">GST (18%)</span>
        <span>{formatPrice(tax)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span>
          {shipping === 0 ? (
            <span className="text-emerald-600 dark:text-emerald-400">Free</span>
          ) : (
            formatPrice(shipping)
          )}
        </span>
      </div>
      {shipping > 0 && (
        <p className="text-xs text-muted-foreground">
          Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
        </p>
      )}
      <Separator />
      <div className="flex justify-between font-semibold text-base">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
