import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of paths that don't require authentication
const publicPaths = ["/", "/login", "/register", "/forgot-password"]

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value
    const { pathname } = request.nextUrl

    // Check if the path is public
    const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

    // If the path is not public and there's no token, redirect to login
    if (!isPublicPath && !token) {
        const url = new URL("/login", request.url)
        url.searchParams.set("from", pathname)
        return NextResponse.redirect(url)
    }

    // If the user is logged in and tries to access login/register, redirect to dashboard
    if (token && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
    ],
}

