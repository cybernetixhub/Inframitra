"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import { REQUEST_STATUS_LABELS } from "@/lib/constants";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ALL_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "QUOTED",
  "ACCEPTED",
  "REJECTED",
  "COMPLETED",
  "EXPIRED",
] as const;

interface AdminRequestFormProps {
  requestId: string;
  currentStatus: string;
  currentPrice: number | null;
  currentNotes: string | null;
}

export function AdminRequestForm({
  requestId,
  currentStatus,
  currentPrice,
  currentNotes,
}: AdminRequestFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [offeredPrice, setOfferedPrice] = useState(
    currentPrice?.toString() ?? ""
  );
  const [adminNotes, setAdminNotes] = useState(currentNotes ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          offeredPrice: offeredPrice || null,
          adminNotes: adminNotes || null,
          reviewedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update request");
      }

      toast.success("Request updated successfully");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="mb-2">Current Status</Label>
        <RequestStatusBadge status={currentStatus} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Update Status</Label>
        <Select value={status} onValueChange={(value) => { if (value) setStatus(value); }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {REQUEST_STATUS_LABELS[s] ?? s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="offeredPrice">Offered Price ($)</Label>
        <Input
          id="offeredPrice"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={offeredPrice}
          onChange={(e) => setOfferedPrice(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="adminNotes">Admin Notes</Label>
        <Textarea
          id="adminNotes"
          placeholder="Add notes about this request..."
          rows={4}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="size-4 animate-spin" />}
        Update Request
      </Button>
    </form>
  );
}
