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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const LEAD_STATUSES = [
  { value: "NEW", label: "New", color: "text-blue-600" },
  { value: "CONTACTED", label: "Contacted", color: "text-amber-600" },
  { value: "QUALIFIED", label: "Qualified", color: "text-purple-600" },
  { value: "CONVERTED", label: "Converted", color: "text-emerald-600" },
  { value: "LOST", label: "Lost", color: "text-red-600" },
] as const;

interface LeadActionsProps {
  leadId: string;
  currentStatus: string;
  currentNotes: string | null;
  currentAssignedTo: string | null;
}

export function LeadActions({
  leadId,
  currentStatus,
  currentNotes,
  currentAssignedTo,
}: LeadActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [assignedTo, setAssignedTo] = useState(currentAssignedTo ?? "");
  const [notes, setNotes] = useState(currentNotes ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          assignedTo: assignedTo || null,
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update lead");
      }

      toast.success("Lead updated successfully");
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
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={(value) => {
            if (value) setStatus(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                <span className={s.color}>{s.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Input
          id="assignedTo"
          placeholder="Team member name or email"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add notes about this lead..."
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="size-4 animate-spin" />}
        Update Lead
      </Button>
    </form>
  );
}
