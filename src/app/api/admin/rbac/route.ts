import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ALL_PERMISSIONS } from "@/lib/permissions";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const groups = await prisma.rbacGroup.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Error fetching RBAC groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch RBAC groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      return NextResponse.json(
        { error: "At least one permission is required" },
        { status: 400 }
      );
    }

    // Validate all permissions are valid
    const invalidPerms = permissions.filter(
      (p: string) => !ALL_PERMISSIONS.includes(p as any)
    );
    if (invalidPerms.length > 0) {
      return NextResponse.json(
        { error: `Invalid permissions: ${invalidPerms.join(", ")}` },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const existing = await prisma.rbacGroup.findUnique({
      where: { name: name.trim() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A group with this name already exists" },
        { status: 409 }
      );
    }

    const group = await prisma.rbacGroup.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        permissions,
        isSystem: false,
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error("Error creating RBAC group:", error);
    return NextResponse.json(
      { error: "Failed to create RBAC group" },
      { status: 500 }
    );
  }
}
