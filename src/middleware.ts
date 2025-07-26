import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const { token } = req.nextauth

    // Admin routes protection - ONLY admin routes need authentication
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Only admin routes require authentication - all others are public
        if (pathname.startsWith("/admin")) {
          return !!token && token.role === "ADMIN"
        }

        // All other routes are public
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    // Only protect admin routes
    "/admin/:path*"
  ],
}