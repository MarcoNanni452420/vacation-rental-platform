import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const { token } = req.nextauth

    // Generate CSP nonce for security using Web Crypto API
    const nonce = crypto.randomUUID().replace(/-/g, '')
    
    // Admin routes protection - ONLY admin routes need authentication
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    const response = NextResponse.next({
      request: {
        headers: (() => {
          const requestHeaders = new Headers(req.headers)
          requestHeaders.set('x-nonce', nonce)
          return requestHeaders
        })(),
      },
    })
    
    // Add nonce to response headers
    response.headers.set('x-nonce', nonce)
    
    // Set CSP header with actual nonce (override next.config.ts header)
    const isDevelopment = process.env.NODE_ENV === 'development'
    const cspValue = [
      "default-src 'self'",
      // Use nonce with strict-dynamic for secure script execution
      // Add unsafe-eval for development mode (Next.js requirement)
      `script-src 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ""} https://maps.googleapis.com https://maps.google.com https://www.googletagmanager.com`,
      // Style still needs unsafe-inline for Tailwind CSS and Google Maps
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
      "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://a0.muscache.com https://ui-avatars.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' https://*.googleapis.com https://maps.google.com https://www.google-analytics.com https://api.octorateplus.com",
      "frame-src https://www.google.com/maps/",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://api.octorateplus.com",
      "frame-ancestors 'none'"
    ].join('; ')
    
    response.headers.set('Content-Security-Policy', cspValue)
    
    return response
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
    // Admin routes need authentication
    "/admin/:path*",
    // All routes need nonce for CSP
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}