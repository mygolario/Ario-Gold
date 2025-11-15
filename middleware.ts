import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const userRoutes = ["/dashboard", "/buy", "/sell", "/kyc", "/delivery-requests"]

const isUserRoute = (pathname: string) =>
  userRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (isUserRoute(pathname)) {
    if (!token || token.role !== "USER") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!token || (token.role !== "ADMIN" && token.role !== "KYC_OFFICER")) {
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

