import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RequestStatus, UserRole } from "@/generated/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        specs: { orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            company: true,
          },
        },
        category: true,
      },
    });

    if (!serviceRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Users can only view their own requests; admins can view all
    const isAdmin = session.user.role === UserRole.ADMIN;
    if (!isAdmin && serviceRequest.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(serviceRequest);
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { error: "Failed to fetch request" },
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
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.serviceRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const isAdmin = session.user.role === UserRole.ADMIN;
    const isOwner = existing.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Admin updates: status, offeredPrice, adminNotes, reviewedAt
    if (isAdmin) {
      const updateData: Record<string, unknown> = {};

      if (body.status && Object.values(RequestStatus).includes(body.status as RequestStatus)) {
        updateData.status = body.status;
      }
      if (body.offeredPrice !== undefined) {
        if (body.offeredPrice && isNaN(parseFloat(body.offeredPrice))) {
          return NextResponse.json(
            { error: "offeredPrice must be a valid number" },
            { status: 400 }
          );
        }
        updateData.offeredPrice = body.offeredPrice ? parseFloat(body.offeredPrice) : null;
      }
      if (body.adminNotes !== undefined) {
        updateData.adminNotes = body.adminNotes;
      }
      if (body.reviewedAt !== undefined) {
        updateData.reviewedAt = body.reviewedAt ? new Date(body.reviewedAt) : new Date();
      }

      const updated = await prisma.serviceRequest.update({
        where: { id },
        data: updateData,
        include: {
          specs: { orderBy: { sortOrder: "asc" } },
          images: { orderBy: { sortOrder: "asc" } },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              company: true,
            },
          },
          category: true,
        },
      });

      return NextResponse.json(updated);
    }

    // User accept/reject: allowed when status is QUOTED
    if (
      body.status &&
      (body.status === "ACCEPTED" || body.status === "REJECTED") &&
      existing.status === RequestStatus.QUOTED
    ) {
      const updated = await prisma.serviceRequest.update({
        where: { id },
        data: { status: body.status as RequestStatus },
        include: {
          specs: { orderBy: { sortOrder: "asc" } },
          images: { orderBy: { sortOrder: "asc" } },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              company: true,
            },
          },
          category: true,
        },
      });

      return NextResponse.json(updated);
    }

    // User updates: only allowed when status is SUBMITTED
    if (existing.status !== RequestStatus.SUBMITTED) {
      return NextResponse.json(
        { error: "Can only edit requests with SUBMITTED status" },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      categoryId,
      quantity,
      specs,
      images,
      name,
      email,
      phone,
      company,
      budgetRange,
      preferredCondition,
      timeline,
      brandName,
      condition,
      age,
      expectedPrice,
      hasInvoice,
      warrantyStatus,
      reasonForSelling,
      approxWeight,
      dataDestruction,
      pickupAddress,
      pickupCity,
      pickupState,
      pickupZip,
      pickupCountry,
      pickupDate,
    } = body;

    if (expectedPrice !== undefined && expectedPrice && isNaN(parseFloat(expectedPrice))) {
      return NextResponse.json(
        { error: "expectedPrice must be a valid number" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (company !== undefined) updateData.company = company || null;
    if (budgetRange !== undefined) updateData.budgetRange = budgetRange || null;
    if (preferredCondition !== undefined) updateData.preferredCondition = preferredCondition || null;
    if (timeline !== undefined) updateData.timeline = timeline || null;
    if (brandName !== undefined) updateData.brandName = brandName || null;
    if (condition !== undefined) updateData.condition = condition || null;
    if (age !== undefined) updateData.age = age || null;
    if (expectedPrice !== undefined) updateData.expectedPrice = expectedPrice ? parseFloat(expectedPrice) : null;
    if (hasInvoice !== undefined) updateData.hasInvoice = hasInvoice;
    if (warrantyStatus !== undefined) updateData.warrantyStatus = warrantyStatus || null;
    if (reasonForSelling !== undefined) updateData.reasonForSelling = reasonForSelling || null;
    if (approxWeight !== undefined) updateData.approxWeight = approxWeight || null;
    if (dataDestruction !== undefined) updateData.dataDestruction = dataDestruction;
    if (pickupAddress !== undefined) updateData.pickupAddress = pickupAddress || null;
    if (pickupCity !== undefined) updateData.pickupCity = pickupCity || null;
    if (pickupState !== undefined) updateData.pickupState = pickupState || null;
    if (pickupZip !== undefined) updateData.pickupZip = pickupZip || null;
    if (pickupCountry !== undefined) updateData.pickupCountry = pickupCountry || null;
    if (pickupDate !== undefined) updateData.pickupDate = pickupDate || null;

    // Handle specs replacement
    if (specs !== undefined) {
      await prisma.serviceRequestSpec.deleteMany({ where: { requestId: id } });
      if (specs.length > 0) {
        await prisma.serviceRequestSpec.createMany({
          data: specs.map(
            (spec: { label: string; value: string }, index: number) => ({
              requestId: id,
              label: spec.label,
              value: spec.value,
              sortOrder: index,
            })
          ),
        });
      }
    }

    // Handle images replacement
    if (images !== undefined) {
      await prisma.serviceRequestImage.deleteMany({ where: { requestId: id } });
      if (images.length > 0) {
        await prisma.serviceRequestImage.createMany({
          data: images.map((url: string, index: number) => ({
            requestId: id,
            url,
            sortOrder: index,
          })),
        });
      }
    }

    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: updateData,
      include: {
        specs: { orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            company: true,
          },
        },
        category: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}
