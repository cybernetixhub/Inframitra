"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ImageIcon, Minus, Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/hooks/use-cart";

export function CartSheet() {
  const { items, cartCount, cartTotal, updateQuantity, removeItem } = useCart();

  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" }) + " relative"}>
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </Badge>
          )}
          <span className="sr-only">Cart</span>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse our products and add items to your cart.
              </p>
            </div>
            <SheetClose>
              <Link href="/products" className={buttonVariants()}>Browse Products</Link>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-4 px-4">
              <div className="divide-y">
                {items.map((item) => {
                  const image = item.product.images?.[0];
                  const unitPrice = Number(item.product.price);

                  return (
                    <div key={item.id} className="flex gap-3 py-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.alt || item.product.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <p className="text-sm font-medium truncate">
                            {item.product.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(unitPrice)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold mb-4">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <SheetClose>
                  <Link href="/cart" className={buttonVariants({ variant: "outline" }) + " w-full"}>View Cart</Link>
                </SheetClose>
                <SheetClose>
                  <Link href="/checkout" className={buttonVariants() + " w-full"}>Checkout</Link>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
