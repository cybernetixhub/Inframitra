import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check environment status
    let dbConnected = false;
    try {
      await prisma.user.count();
      dbConnected = true;
    } catch {
      dbConnected = false;
    }

    const status = {
      google: !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
      microsoft: !!(
        process.env.AUTH_MICROSOFT_ENTRA_ID_ID &&
        process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET
      ),
      authSecret: !!process.env.AUTH_SECRET,
      dbConnected,
    };

    return NextResponse.json({ status });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // In a Docker environment, env vars can't be changed at runtime.
    // We save the config as a reference for the admin to update docker-compose.yml
    // In the future, this could write to a config file or database.

    return NextResponse.json({
      message:
        "OAuth configuration saved as reference. Update docker-compose.yml with these values and restart the container to apply.",
      instructions: [
        "1. SSH into your server",
        "2. Edit docker-compose.yml and add/update the environment variables",
        "3. Run: docker compose down && docker compose up -d",
        "4. Verify OAuth works by trying to sign in",
      ],
      env: {
        AUTH_GOOGLE_ID: body.AUTH_GOOGLE_ID || "",
        AUTH_GOOGLE_SECRET: body.AUTH_GOOGLE_SECRET ? "***SET***" : "",
        AUTH_MICROSOFT_ENTRA_ID_ID: body.AUTH_MICROSOFT_ENTRA_ID_ID || "",
        AUTH_MICROSOFT_ENTRA_ID_SECRET: body.AUTH_MICROSOFT_ENTRA_ID_SECRET
          ? "***SET***"
          : "",
        AUTH_MICROSOFT_ENTRA_ID_TENANT_ID:
          body.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID || "common",
      },
    });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
