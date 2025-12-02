export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/booking/:path*",
    "/profile/:path*",
    "/calendar/:path*",
    "/api/bookings/:path*",
    "/api/courts/:path*",
    "/api/penalties/:path*",
    "/api/user/:path*"
  ]
}
