import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

// Terapkan hanya ke route tertentu
export const config = {
    matcher: ["/dashboard/:path*", "/chart/:path*"],
};
