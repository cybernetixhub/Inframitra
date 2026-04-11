"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_COLORS,
  REQUEST_TYPE_LABELS,
  REQUEST_TYPE_COLORS,
} from "@/lib/constants";

interface RequestStatusBadgeProps {
  status: string;
  type?: string;
}

export function RequestStatusBadge({ status, type }: RequestStatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2">
      {type && (
        <Badge
          className={cn(
            "border-0",
            REQUEST_TYPE_COLORS[type] ?? "bg-zinc-100 text-zinc-800"
          )}
        >
          {REQUEST_TYPE_LABELS[type] ?? type}
        </Badge>
      )}
      <Badge
        className={cn(
          "border-0",
          REQUEST_STATUS_COLORS[status] ?? "bg-zinc-100 text-zinc-800"
        )}
      >
        {REQUEST_STATUS_LABELS[status] ?? status}
      </Badge>
    </span>
  );
}
