import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ALL_PERMISSIONS } from "@/lib/permissions";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ group });
  } catch (error) {
    console.error("Error fetching RBAC group:", error);
    return NextResponse.json(
      { error: "Failed to fetch RBAC group" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, permissions } = body;

    const existing = await prisma.rbacGroup.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: {
      name?: string;
      description?: string | null;
      permissions?: string[];
    } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Group name cannot be empty" },
          { status: 400 }
        );
      }
      // Check for duplicate name (excluding current group)
      const duplicate = await prisma.rbacGroup.findFirst({
        where: { name: name.trim(), id: { not: id } },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: "A group with this name already exists" },
          { status: 409 }
        );
      }
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (permissions !== undefined) {
      if (!Array.isArray(permissions) || permissions.length === 0) {
        return NextResponse.json(
          { error: "At least one permission is required" },
          { status: 400 }
        );
      }

      const invalidPerms = permissions.filter(
        (p: string) => !ALL_PERMISSIONS.includes(p as any)
      );
      if (invalidPerms.length > 0) {
        return NextResponse.json(
          { error: `Invalid permissions: ${invalidPerms.join(", ")}` },
          { status: 400 }
        );
      }
      updateData.permissions = permissions;
    }

    const group = await prisma.rbacGroup.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error updating RBAC group:", error);
    return NextResponse.json(
      { error: "Failed to update RBAC group" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const group = await prisma.rbacGroup.findUnique({
      where: { id },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    if (group.isSystem) {
      return NextResponse.json(
        { error: "System groups cannot be deleted" },
        { status: 400 }
      );
    }

    // Remove all user assignments first, then delete the group
    await prisma.$transaction([
      prisma.userRbacGroup.deleteMany({ where: { groupId: id } }),
      prisma.rbacGroup.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting RBAC group:", error);
    return NextResponse.json(
      { error: "Failed to delete RBAC group" },
      { status: 500 }
    );
  }
}
