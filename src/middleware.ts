import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Just pass through — auth is handled by individual pages/layouts
  // This avoids cookie-name mismatch issues behind Cloudflare/Nginx proxy
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|uploads|images).*)",
  ],
};
