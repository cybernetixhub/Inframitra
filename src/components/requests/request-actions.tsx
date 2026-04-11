"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";

interface RequestActionsProps {
  requestId: string;
  currentStatus: string;
}

export function RequestActions({
  requestId,
  currentStatus,
}: RequestActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);

  if (currentStatus !== "QUOTED") {
    return null;
  }

  async function handleAction(action: "ACCEPTED" | "REJECTED") {
    setLoading(action === "ACCEPTED" ? "accept" : "reject");

    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update request");
      }

      toast.success(
        action === "ACCEPTED"
          ? "Quote accepted successfully"
          : "Quote rejected"
      );
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-3">
      <Button
        onClick={() => handleAction("ACCEPTED")}
        disabled={loading !== null}
        className="flex-1"
      >
        {loading === "accept" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Check className="size-4" />
        )}
        Accept Quote
      </Button>
      <Button
        variant="destructive"
        onClick={() => handleAction("REJECTED")}
        disabled={loading !== null}
        className="flex-1"
      >
        {loading === "reject" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <X className="size-4" />
        )}
        Reject Quote
      </Button>
    </div>
  );
}
