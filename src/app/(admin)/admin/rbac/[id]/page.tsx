import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { RbacGroupForm } from "@/components/admin/rbac-group-form";
import { RbacGroupUsers } from "@/components/admin/rbac-group-users";
import { RbacGroupDeleteButton } from "@/components/admin/rbac-group-delete-button";
import { ArrowLeft, Lock, Shield, Users } from "lucide-react";

export const metadata = {
  title: "RBAC Group Details",
};

export default async function RbacGroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const group = await prisma.rbacGroup.findUnique({
    where: { id },
    include: {
      users: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
            },
          },
        },
        orderBy: { assignedAt: "desc" },
      },
    },
  });

  if (!group) {
    notFound();
  }

  // Serialize dates for the client component
  const serializedUsers = group.users.map((u) => ({
    ...u,
    assignedAt: u.assignedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LinkButton href="/admin/rbac" variant="ghost" size="icon-sm">
            <ArrowLeft className="size-4" />
          </LinkButton>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {group.name}
              </h1>
              {group.isSystem && (
                <Badge variant="default">
                  <Lock className="mr-1 size-3" />
                  System
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {group.description || "No description provided."}
            </p>
          </div>
        </div>
        {!group.isSystem && <RbacGroupDeleteButton groupId={group.id} groupName={group.name} />}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{group.users.length}</p>
              <p className="text-xs text-muted-foreground">
                Users in this group
              </p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Shield className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{group.permissions.length}</p>
              <p className="text-xs text-muted-foreground">
                Permissions assigned
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Section */}
      <Card>
        <CardHeader>
          <CardTitle>Group Members</CardTitle>
        </CardHeader>
        <CardContent>
          <RbacGroupUsers groupId={group.id} users={serializedUsers} />
        </CardContent>
      </Card>

      {/* Permissions Editor */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Edit Permissions</h2>
        <RbacGroupForm
          group={{
            id: group.id,
            name: group.name,
            description: group.description,
            permissions: group.permissions,
            isSystem: group.isSystem,
          }}
        />
      </div>
    </div>
  );
}
