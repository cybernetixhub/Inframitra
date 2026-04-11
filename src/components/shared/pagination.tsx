"use client";

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }), "h-9 w-9")}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "h-9 w-9 pointer-events-none opacity-50"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </span>
      )}

      {pages.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </span>
          );
        }

        const isActive = page === currentPage;
        if (isActive) {
          return (
            <span
              key={page}
              className={cn(
                buttonVariants({ variant: "default", size: "icon" }),
                "h-9 w-9 pointer-events-none"
              )}
            >
              {page}
            </span>
          );
        }

        return (
          <Link
            key={page}
            href={createPageUrl(page)}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "h-9 w-9")}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }), "h-9 w-9")}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "h-9 w-9 pointer-events-none opacity-50"
          )}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </span>
      )}
    </nav>
  );
}
