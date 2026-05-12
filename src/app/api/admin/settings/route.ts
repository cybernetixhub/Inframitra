import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const OAUTH_KEYS = [
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
  "AUTH_MICROSOFT_ENTRA_ID_ID",
  "AUTH_MICROSOFT_ENTRA_ID_SECRET",
  "AUTH_MICROSOFT_ENTRA_ID_TENANT_ID",
];

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let dbConnected = false;
    try {
      await prisma.user.count();
      dbConnected = true;
    } catch {
      dbConnected = false;
    }

    // Read saved config from DB
    let savedConfig: Record<string, string> = {};
    try {
      const configs = await prisma.siteConfig.findMany({
        where: { key: { in: OAUTH_KEYS } },
      });
      for (const c of configs) {
        savedConfig[c.key] = c.value;
      }
    } catch {
      // Table might not exist yet
    }

    const googleId = process.env.AUTH_GOOGLE_ID || savedConfig.AUTH_GOOGLE_ID || "";
    const googleSecret = process.env.AUTH_GOOGLE_SECRET || savedConfig.AUTH_GOOGLE_SECRET || "";
    const msId = process.env.AUTH_MICROSOFT_ENTRA_ID_ID || savedConfig.AUTH_MICROSOFT_ENTRA_ID_ID || "";
    const msSecret = process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET || savedConfig.AUTH_MICROSOFT_ENTRA_ID_SECRET || "";
    const msTenant = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID || savedConfig.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID || "common";

    const status = {
      google: !!(googleId && googleSecret),
      microsoft: !!(msId && msSecret),
      authSecret: !!process.env.AUTH_SECRET,
      dbConnected,
    };

    // Return masked values so admin can see what's configured
    const config = {
      AUTH_GOOGLE_ID: googleId ? googleId.substring(0, 20) + "..." : "",
      AUTH_GOOGLE_SECRET: googleSecret ? "••••••••••" : "",
      AUTH_MICROSOFT_ENTRA_ID_ID: msId ? msId.substring(0, 20) + "..." : "",
      AUTH_MICROSOFT_ENTRA_ID_SECRET: msSecret ? "••••••••••" : "",
      AUTH_MICROSOFT_ENTRA_ID_TENANT_ID: msTenant,
    };

    return NextResponse.json({ status, config });
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

    // Save each non-empty value to SiteConfig
    let savedCount = 0;
    for (const key of OAUTH_KEYS) {
      const value = body[key];
      if (value !== undefined && value !== "") {
        await prisma.siteConfig.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
        savedCount++;
      }
    }

    return NextResponse.json({
      message: `${savedCount} setting(s) saved successfully. Restart the container to apply OAuth changes.`,
      savedCount,
    });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
