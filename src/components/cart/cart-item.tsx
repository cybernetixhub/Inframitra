"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { CartItemData } from "@/hooks/use-cart";

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  const unitPrice = Number(product.price);
  const lineTotal = unitPrice * quantity;
  const image = product.images?.[0];
  const maxStock = product.quantity;

  return (
    <div className="flex gap-4 py-4">
      {/* Product Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || product.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/products/${product.slug}`}
              className="text-sm font-medium hover:underline line-clamp-2"
            >
              {product.title}
            </Link>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatPrice(unitPrice)} each
            </p>
          </div>
          <p className="text-sm font-semibold whitespace-nowrap ml-4">
            {formatPrice(lineTotal)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                onUpdateQuantity(item.productId, Math.max(1, quantity - 1))
              }
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                onUpdateQuantity(
                  item.productId,
                  Math.min(maxStock, quantity + 1)
                )
              }
              disabled={quantity >= maxStock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item.productId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
