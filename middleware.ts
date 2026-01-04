import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  })

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || 
                     request.nextUrl.pathname.startsWith("/signup") ||
                     request.nextUrl.pathname.startsWith("/staff/login")

  const isStaffPage = request.nextUrl.pathname.startsWith("/staff") && 
                      !request.nextUrl.pathname.startsWith("/staff/login")
  
  const isProtectedPage = request.nextUrl.pathname.startsWith("/booking") ||
                          request.nextUrl.pathname.startsWith("/profile") ||
                          request.nextUrl.pathname.startsWith("/calendar")

  if (isAuthPage) {
    if (token) {
      // If already logged in and on staff login, redirect to appropriate dashboard
      if (request.nextUrl.pathname.startsWith("/staff/login")) {
        if (token.role === "staff" || token.role === "admin") {
          return NextResponse.redirect(new URL("/staff/dashboard", request.url))
        }
        return NextResponse.redirect(new URL("/", request.url))
      }
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Protected staff routes
  if (isStaffPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/staff/login", request.url))
    }
    if (token.role !== "staff" && token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Protected user routes
  if (isProtectedPage) {
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/booking/:path*",
    "/profile/:path*",
    "/calendar/:path*",
    "/login",
    "/signup",
    "/staff/:path*"
  ]
}
