import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/shared/link-button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Shield, Lock, Plus } from "lucide-react";

export const metadata = {
  title: "RBAC Groups",
};

export default async function RbacGroupsPage() {
  const groups = await prisma.rbacGroup.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: { users: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">RBAC Groups</h1>
          <p className="text-muted-foreground">
            Manage role-based access control groups and permissions.
          </p>
        </div>
        <LinkButton href="/admin/rbac/new">
          <Plus className="mr-2 size-4" />
          Create Group
        </LinkButton>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Users</TableHead>
              <TableHead className="text-center">Permissions</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Shield className="size-8" />
                    <p>No RBAC groups found.</p>
                    <p className="text-xs">
                      Create your first group to get started.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <Link
                      href={`/admin/rbac/${group.id}`}
                      className="flex items-center gap-2 font-medium text-primary hover:underline"
                    >
                      <Shield className="size-4" />
                      {group.name}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                    {group.description || "--"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{group._count.users}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">
                      {group.permissions.length}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {group.isSystem ? (
                      <Badge variant="default">
                        <Lock className="mr-1 size-3" />
                        System
                      </Badge>
                    ) : (
                      <Badge variant="outline">Custom</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <LinkButton
                      href={`/admin/rbac/${group.id}`}
                      variant="ghost"
                      size="sm"
                    >
                      Manage
                    </LinkButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
