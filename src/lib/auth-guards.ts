import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthorizationError"
  }
}

async function requireSession() {
  const session = await auth()
  if (!session?.user) {
    throw new AuthorizationError("UNAUTHORIZED")
  }
  return session
}

export async function requireUser() {
  const session = await requireSession()
  if (session.user.role !== "USER") {
    throw new AuthorizationError("FORBIDDEN")
  }
  return session
}

export async function requireAdmin() {
  const session = await requireSession()
  if (session.user.role !== "ADMIN") {
    throw new AuthorizationError("FORBIDDEN")
  }
  return session
}

export async function requireAdminOrKyc() {
  const session = await requireSession()
  if (session.user.role !== "ADMIN" && session.user.role !== "KYC_OFFICER") {
    throw new AuthorizationError("FORBIDDEN")
  }
  return session
}

export function handleAuthError(error: unknown) {
  if (error instanceof AuthorizationError) {
    redirect("/login")
  }
  throw error
}
