"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

const sizeClasses = {
  sm: "size-3.5",
  md: "size-5",
  lg: "size-6",
};

export function StarRating({
  value,
  onChange,
  size = "md",
  readonly = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const isInteractive = !readonly && !!onChange;
  const displayValue = hoverValue || value;

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", {
        "cursor-pointer": isInteractive,
      })}
      onMouseLeave={() => isInteractive && setHoverValue(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly || !onChange}
          className={cn(
            "inline-flex items-center justify-center p-0 transition-colors",
            isInteractive && "hover:scale-110",
            !isInteractive && "pointer-events-none"
          )}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => isInteractive && setHoverValue(star)}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors",
              star <= displayValue
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/40"
            )}
          />
        </button>
      ))}
    </div>
  );
}
