"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  X,
  Shield,
  CheckSquare,
  Square,
} from "lucide-react";

interface AvailableGroup {
  id: string;
  name: string;
  description: string | null;
}

interface UserRbacGroupsManagerProps {
  userId: string;
  currentGroupIds: string[];
  allGroups: AvailableGroup[];
}

export function UserRbacGroupsManager({
  userId,
  currentGroupIds,
  allGroups,
}: UserRbacGroupsManagerProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(currentGroupIds)
  );
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const assignedGroups = allGroups.filter((g) => selectedIds.has(g.id));
  const availableGroups = allGroups.filter((g) => !selectedIds.has(g.id));

  function toggleGroup(groupId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          groupIds: Array.from(selectedIds),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update groups");
      }

      toast.success("RBAC groups updated");
      setShowPicker(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update groups"
      );
    } finally {
      setLoading(false);
    }
  }

  const hasChanges =
    selectedIds.size !== currentGroupIds.length ||
    !currentGroupIds.every((id) => selectedIds.has(id));

  return (
    <div className="space-y-4">
      {/* Current groups */}
      {assignedGroups.length === 0 && !showPicker ? (
        <p className="text-sm text-muted-foreground">
          No RBAC groups assigned to this user.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {assignedGroups.map((group) => (
            <div
              key={group.id}
              className="flex items-center gap-1"
            >
              <Link href={`/admin/rbac/${group.id}`}>
                <Badge variant="secondary" className="gap-1">
                  <Shield className="size-3" />
                  {group.name}
                </Badge>
              </Link>
              {showPicker && (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="rounded-full p-0.5 hover:bg-muted"
                  disabled={loading}
                >
                  <X className="size-3 text-muted-foreground" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Group picker */}
      {showPicker && (
        <div className="space-y-3 rounded-lg border p-4">
          <p className="text-sm font-medium">
            Select groups to assign:
          </p>
          {allGroups.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No RBAC groups available. Create groups in the RBAC Groups section
              first.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {allGroups.map((group) => (
                <label
                  key={group.id}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(group.id)}
                    onChange={() => toggleGroup(group.id)}
                    disabled={loading}
                    className="sr-only"
                  />
                  {selectedIds.has(group.id) ? (
                    <CheckSquare className="mt-0.5 size-4 shrink-0 text-primary" />
                  ) : (
                    <Square className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">{group.name}</p>
                    {group.description && (
                      <p className="text-xs text-muted-foreground">
                        {group.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={loading || !hasChanges}
              size="sm"
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Changes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedIds(new Set(currentGroupIds));
                setShowPicker(false);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {!showPicker && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPicker(true)}
        >
          <Plus className="mr-2 size-4" />
          Manage Groups
        </Button>
      )}
    </div>
  );
}
