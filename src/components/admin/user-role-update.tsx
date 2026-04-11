"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ROLES = ["BUYER", "SELLER", "ADMIN"] as const;

export function AdminUserRoleUpdate({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRoleChange(newRole: string) {
    if (newRole === currentRole) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }

      toast.success("User role updated");
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
    <select
      value={currentRole}
      onChange={(e) => handleRoleChange(e.target.value)}
      disabled={loading}
      className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
    >
      {ROLES.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  );
}
