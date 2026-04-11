import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const VALID_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "25", 10),
      100
    );
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status && VALID_STATUSES.includes(status)) {
      where.status = status;
    }

    const [leads, total] = await Promise.all([
      prisma.salesLead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.salesLead.count({ where }),
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, requirement, chatTranscript, source } =
      body;

    if (!name || !email || !requirement) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, requirement" },
        { status: 400 }
      );
    }

    const lead = await prisma.salesLead.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        requirement,
        chatTranscript: chatTranscript || "[]",
        source: source || "ai-chat",
        status: "NEW",
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
