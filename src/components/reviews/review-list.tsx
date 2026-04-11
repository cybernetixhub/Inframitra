"use client";

import { useEffect, useState, useCallback } from "react";
import { StarRating } from "./star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { Loader2 } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ReviewListProps {
  productId: string;
  refreshKey?: number;
}

export function ReviewList({ productId, refreshKey }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const loadReviews = useCallback(
    async (pageNum: number, append = false) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products/${productId}/reviews?page=${pageNum}&limit=10`
        );
        if (res.ok) {
          const data = await res.json();
          setReviews((prev) =>
            append ? [...prev, ...data.reviews] : data.reviews
          );
          setTotal(data.pagination.total);
          setHasMore(pageNum < data.pagination.totalPages);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    setPage(1);
    loadReviews(1);
  }, [productId, refreshKey, loadReviews]);

  function handleLoadMore() {
    const next = page + 1;
    setPage(next);
    loadReviews(next, true);
  }

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {total} review{total !== 1 ? "s" : ""}
      </p>
      {reviews.map((review) => (
        <div key={review.id} className="space-y-2 border-b pb-6 last:border-0">
          <div className="flex items-start gap-3">
            <Avatar size="sm">
              {review.user.image && (
                <AvatarImage
                  src={review.user.image}
                  alt={review.user.name || "User"}
                />
              )}
              <AvatarFallback>
                {review.user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {review.user.name || "Anonymous"}
                </span>
                {review.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified Purchase
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <StarRating value={review.rating} readonly size="sm" />
              {review.title && (
                <p className="text-sm font-medium">{review.title}</p>
              )}
              {review.comment && (
                <p className="text-sm text-muted-foreground">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
}
