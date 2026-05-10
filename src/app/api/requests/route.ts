import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RequestType } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where: Record<string, unknown> = { userId: session.user.id };
    if (type && Object.values(RequestType).includes(type as RequestType)) {
      where.type = type;
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      include: {
        specs: { orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      type,
      title,
      description,
      categoryId,
      quantity,
      specs,
      images,
      // Contact info
      name,
      email,
      phone,
      company,
      // Configure & Quote specific
      budgetRange,
      preferredCondition,
      timeline,
      // Sell Hardware specific
      brandName,
      condition,
      age,
      expectedPrice,
      hasInvoice,
      warrantyStatus,
      reasonForSelling,
      // E-Recycle specific
      approxWeight,
      dataDestruction,
      // Pickup info
      pickupAddress,
      pickupCity,
      pickupState,
      pickupZip,
      pickupCountry,
      pickupDate,
    } = body;

    if (!type || !title || !description || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields: type, title, description, name, email" },
        { status: 400 }
      );
    }

    if (!Object.values(RequestType).includes(type as RequestType)) {
      return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    }

    if (expectedPrice && isNaN(parseFloat(expectedPrice))) {
      return NextResponse.json(
        { error: "expectedPrice must be a valid number" },
        { status: 400 }
      );
    }

    // Generate request number: REQ-YYYYMMDD-XXXX
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    const requestNumber = `REQ-${datePart}-${randomPart}`;

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        requestNumber,
        type: type as RequestType,
        userId: session.user.id,
        name,
        email,
        phone: phone || null,
        company: company || null,
        title,
        description,
        categoryId: categoryId || null,
        quantity: quantity || 1,
        // Configure & Quote
        budgetRange: budgetRange || null,
        preferredCondition: preferredCondition || null,
        timeline: timeline || null,
        // Sell Hardware
        brandName: brandName || null,
        condition: condition || null,
        age: age || null,
        expectedPrice: expectedPrice ? parseFloat(expectedPrice) : null,
        hasInvoice: hasInvoice ?? null,
        warrantyStatus: warrantyStatus || null,
        reasonForSelling: reasonForSelling || null,
        // E-Recycle
        approxWeight: approxWeight || null,
        dataDestruction: dataDestruction ?? null,
        // Pickup
        pickupAddress: pickupAddress || null,
        pickupCity: pickupCity || null,
        pickupState: pickupState || null,
        pickupZip: pickupZip || null,
        pickupCountry: pickupCountry || null,
        pickupDate: pickupDate || null,
        // Relations
        specs: specs?.length
          ? {
              create: specs.map(
                (spec: { label: string; value: string }, index: number) => ({
                  label: spec.label,
                  value: spec.value,
                  sortOrder: index,
                })
              ),
            }
          : undefined,
        images: images?.length
          ? {
              create: images.map((url: string, index: number) => ({
                url,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        specs: { orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
    });

    return NextResponse.json(serviceRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
