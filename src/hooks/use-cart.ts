"use client";

import useSWR from "swr";

interface CartProduct {
  id: string;
  title: string;
  slug: string;
  price: string | number;
  quantity: number;
  images: { id: string; url: string; alt?: string | null }[];
}

export interface CartItemData {
  id: string;
  productId: string;
  quantity: number;
  product: CartProduct;
}

interface CartResponse {
  items: CartItemData[];
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
  });

export function useCart() {
  const { data, error, isLoading, mutate } = useSWR<CartResponse>(
    "/api/cart",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  );

  const items = data?.items ?? [];

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  async function addToCart(productId: string, qty: number = 1) {
    const existingItem = items.find((i) => i.productId === productId);

    const optimisticItems = existingItem
      ? items.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + qty }
            : i
        )
      : items;

    mutate({ items: optimisticItems }, false);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: qty }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add to cart");
      }

      mutate();
    } catch (err) {
      mutate();
      throw err;
    }
  }

  async function updateQuantity(productId: string, qty: number) {
    const optimisticItems = items.map((i) =>
      i.productId === productId ? { ...i, quantity: qty } : i
    );

    mutate({ items: optimisticItems }, false);

    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: qty }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update quantity");
      }

      mutate();
    } catch (err) {
      mutate();
      throw err;
    }
  }

  async function removeItem(productId: string) {
    const optimisticItems = items.filter((i) => i.productId !== productId);

    mutate({ items: optimisticItems }, false);

    try {
      const res = await fetch(`/api/cart?productId=${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to remove item");
      }

      mutate();
    } catch (err) {
      mutate();
      throw err;
    }
  }

  return {
    items,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeItem,
    isLoading,
    error,
    mutate,
  };
}
