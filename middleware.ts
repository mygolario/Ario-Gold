import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

const userRoutes = ["/dashboard", "/buy", "/sell", "/kyc", "/delivery-requests"]

const isUserRoute = (pathname: string) =>
  userRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await auth()

  if (isUserRoute(pathname)) {
    if (!session?.user || session.user.role !== "USER") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "KYC_OFFICER")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/buy/:path*",
    "/sell/:path*",
    "/kyc/:path*",
    "/delivery-requests/:path*",
    "/admin/:path*",
  ],
}
