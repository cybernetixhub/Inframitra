"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryActionsProps {
  categoryId: string;
  categoryName: string;
  productCount: number;
}

export function CategoryActions({
  categoryId,
  categoryName,
  productCount,
}: CategoryActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (productCount > 0) {
      toast.error(
        `Cannot delete "${categoryName}" because it has ${productCount} product(s). Move or delete products first.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete category");
      }

      toast.success(`Category "${categoryName}" deleted successfully`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/categories/new?edit=${categoryId}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" })
        )}
      >
        <Pencil className="size-4" />
        <span className="sr-only">Edit {categoryName}</span>
      </Link>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4 text-destructive" />
        )}
        <span className="sr-only">Delete {categoryName}</span>
      </Button>
    </div>
  );
}
