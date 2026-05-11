"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UserActiveToggleProps {
  userId: string;
  isActive: boolean;
}

export function UserActiveToggle({ userId, isActive }: UserActiveToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(isActive);

  async function handleToggle(checked: boolean) {
    if (checked === active) return;

    if (!checked) {
      const confirmed = window.confirm(
        "Are you sure you want to deactivate this user? They will not be able to log in."
      );
      if (!confirmed) return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: checked }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }

      setActive(checked);
      toast.success(checked ? "User activated" : "User deactivated");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="active-toggle">Account Active</Label>
        {loading ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <Switch
            id="active-toggle"
            checked={active}
            onCheckedChange={handleToggle}
            disabled={loading}
          />
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {active
          ? "This account is active. The user can log in and use the platform."
          : "This account is disabled. The user cannot log in."}
      </p>
    </div>
  );
}
