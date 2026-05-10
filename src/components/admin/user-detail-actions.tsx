"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";

const ROLES = ["BUYER", "SELLER", "ADMIN"] as const;

const ROLE_DESCRIPTIONS: Record<string, string> = {
  BUYER: "Can browse, purchase products, and leave reviews.",
  SELLER: "Can list products for sale and manage orders.",
  ADMIN: "Full access to all admin features and settings.",
};

interface UserDetailActionsProps {
  userId: string;
  currentRole: string;
  userName: string;
}

export function UserDetailActions({
  userId,
  currentRole,
  userName,
}: UserDetailActionsProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);

  async function handleUpdateRole() {
    if (selectedRole === currentRole) {
      toast.info("Role is unchanged");
      return;
    }

    if (selectedRole === "ADMIN") {
      const confirmed = window.confirm(
        `Are you sure you want to grant ADMIN access to "${userName}"? This will give them full control over the platform.`
      );
      if (!confirmed) return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: selectedRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }

      toast.success(`Role updated to ${selectedRole}`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update role"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role">User Role</Label>
        <select
          id="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          disabled={loading}
          className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-muted-foreground">
        {ROLE_DESCRIPTIONS[selectedRole] || ""}
      </p>

      {selectedRole === "ADMIN" && selectedRole !== currentRole && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" />
          <p className="text-xs">
            Granting admin access gives this user full control over all platform
            settings, users, and data.
          </p>
        </div>
      )}

      <Button
        onClick={handleUpdateRole}
        disabled={loading || selectedRole === currentRole}
        className="w-full"
      >
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        Update Role
      </Button>
    </div>
  );
}
