"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, CheckSquare, Square } from "lucide-react";
import {
  PERMISSION_GROUPS,
  PERMISSION_LABELS,
  type Permission,
} from "@/lib/permissions";

interface RbacGroupFormProps {
  group?: {
    id: string;
    name: string;
    description: string | null;
    permissions: string[];
    isSystem: boolean;
  };
}

export function RbacGroupForm({ group }: RbacGroupFormProps) {
  const router = useRouter();
  const [name, setName] = useState(group?.name || "");
  const [description, setDescription] = useState(group?.description || "");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(group?.permissions || [])
  );
  const [loading, setLoading] = useState(false);

  function togglePermission(perm: string) {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(perm)) {
        next.delete(perm);
      } else {
        next.add(perm);
      }
      return next;
    });
  }

  function selectAllInCategory(perms: Permission[]) {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      perms.forEach((p) => next.add(p));
      return next;
    });
  }

  function deselectAllInCategory(perms: Permission[]) {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      perms.forEach((p) => next.delete(p));
      return next;
    });
  }

  function isCategoryFullySelected(perms: Permission[]) {
    return perms.every((p) => selectedPermissions.has(p));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Group name is required");
      return;
    }

    if (selectedPermissions.size === 0) {
      toast.error("Select at least one permission");
      return;
    }

    setLoading(true);
    try {
      const url = group
        ? `/api/admin/rbac/${group.id}`
        : "/api/admin/rbac";
      const method = group ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          permissions: Array.from(selectedPermissions),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save group");
      }

      const data = await res.json();
      toast.success(
        group ? "Group updated successfully" : "Group created successfully"
      );

      if (group) {
        router.refresh();
      } else {
        router.push(`/admin/rbac/${data.id}`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save group"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Group Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Content Editor"
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this group is for..."
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Permissions ({selectedPermissions.size} selected)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(PERMISSION_GROUPS).map(([category, perms]) => {
            const allSelected = isCategoryFullySelected(perms);
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{category}</h3>
                  <button
                    type="button"
                    onClick={() =>
                      allSelected
                        ? deselectAllInCategory(perms)
                        : selectAllInCategory(perms)
                    }
                    className="text-xs text-primary hover:underline"
                    disabled={loading}
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {perms.map((perm) => (
                    <label
                      key={perm}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.has(perm)}
                        onChange={() => togglePermission(perm)}
                        disabled={loading}
                        className="sr-only"
                      />
                      {selectedPermissions.has(perm) ? (
                        <CheckSquare className="size-4 text-primary" />
                      ) : (
                        <Square className="size-4 text-muted-foreground" />
                      )}
                      <div>
                        <span className="font-medium">
                          {PERMISSION_LABELS[perm] || perm}
                        </span>
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          ({perm})
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          {group ? "Update Group" : "Create Group"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
