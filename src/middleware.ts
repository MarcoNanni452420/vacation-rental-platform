import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const { token } = req.nextauth

    // Admin routes protection
    if (pathname.startsWith("/admin")) {
      if (!token || (token.role !== "HOST" && token.role !== "ADMIN")) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    // User account routes protection  
    if (pathname.startsWith("/account")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes that don't require authentication
        if (
          pathname === "/" ||
          pathname.startsWith("/properties") ||
          pathname.startsWith("/auth") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/public")
        ) {
          return true
        }

        // All other routes require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}