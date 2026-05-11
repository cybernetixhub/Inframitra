"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, UserMinus, UserPlus, Mail } from "lucide-react";

interface GroupUser {
  id: string;
  assignedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    image: string | null;
  };
}

interface RbacGroupUsersProps {
  groupId: string;
  users: GroupUser[];
}

export function RbacGroupUsers({ groupId, users }: RbacGroupUsersProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoadingId, setRemoveLoadingId] = useState<string | null>(null);

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Enter an email address");
      return;
    }

    setAddLoading(true);
    try {
      // First find the user by email
      const searchRes = await fetch(
        `/api/admin/users?search=${encodeURIComponent(email.trim())}`
      );

      // If search doesn't work, try to look up directly
      // We'll use PATCH to assign group
      // First we need to find the user ID from the email
      const lookupRes = await fetch("/api/admin/users");
      if (!lookupRes.ok) {
        throw new Error("Failed to fetch users");
      }

      const { users: allUsers } = await lookupRes.json();
      const foundUser = allUsers.find(
        (u: { email: string }) =>
          u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!foundUser) {
        toast.error("No user found with that email address");
        return;
      }

      // Check if user is already in the group
      if (users.some((u) => u.user.id === foundUser.id)) {
        toast.error("User is already in this group");
        return;
      }

      // Get current group IDs for this user and add the new one
      const currentGroupIds = (foundUser.rbacGroups || []).map(
        (rg: { group: { id: string } }) => rg.group.id
      );

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: foundUser.id,
          groupIds: [...currentGroupIds, groupId],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add user to group");
      }

      toast.success(`Added ${foundUser.name || foundUser.email} to group`);
      setEmail("");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add user"
      );
    } finally {
      setAddLoading(false);
    }
  }

  async function handleRemoveUser(userRbacGroupUser: GroupUser) {
    const { user } = userRbacGroupUser;

    setRemoveLoadingId(user.id);
    try {
      // Get user's current groups and remove this one
      const lookupRes = await fetch("/api/admin/users");
      if (!lookupRes.ok) {
        throw new Error("Failed to fetch users");
      }

      const { users: allUsers } = await lookupRes.json();
      const foundUser = allUsers.find(
        (u: { id: string }) => u.id === user.id
      );

      if (!foundUser) {
        throw new Error("User not found");
      }

      const currentGroupIds = (foundUser.rbacGroups || [])
        .map((rg: { group: { id: string } }) => rg.group.id)
        .filter((gid: string) => gid !== groupId);

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          groupIds: currentGroupIds,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove user from group");
      }

      toast.success(`Removed ${user.name || user.email} from group`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove user"
      );
    } finally {
      setRemoveLoadingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Add user form */}
      <form onSubmit={handleAddUser} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email to add..."
            className="pl-9"
            disabled={addLoading}
          />
        </div>
        <Button type="submit" disabled={addLoading} size="default">
          {addLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 size-4" />
          )}
          Add
        </Button>
      </form>

      {/* Users list */}
      {users.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No users assigned to this group yet.
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {users.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {entry.user.image ? (
                  <img
                    src={entry.user.image}
                    alt={entry.user.name || "User"}
                    className="size-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {entry.user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">
                    {entry.user.name || "Unnamed User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.user.email}
                  </p>
                </div>
                <Badge
                  variant={
                    entry.user.role === "ADMIN"
                      ? "default"
                      : entry.user.role === "SELLER"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {entry.user.role}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleRemoveUser(entry)}
                disabled={removeLoadingId === entry.user.id}
              >
                {removeLoadingId === entry.user.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UserMinus className="size-4 text-destructive" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
