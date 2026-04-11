"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const PRODUCT_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "PENDING_REVIEW",
  "SOLD",
  "ARCHIVED",
] as const;

export function AdminProductActions({
  productId,
  currentStatus,
}: {
  productId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update product status");
      }

      toast.success("Product status updated");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update product status"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={loading}
      className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
    >
      {PRODUCT_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
