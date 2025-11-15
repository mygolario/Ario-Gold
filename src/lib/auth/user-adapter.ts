import { Role, type User } from "@prisma/client"
import { prisma } from "@/lib/prisma"

// Minimal data-access layer to keep auth logic decoupled from raw Prisma calls.
export type AuthUser = Pick<User, "id" | "email" | "phone" | "passwordHash" | "role" | "fullName">

export const userAdapter = {
  async findByEmail(email: string) {
    if (!email) return null
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  },
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },
  async create(params: {
    phone: string
    email: string
    passwordHash: string
    fullName?: string
    role?: Role
  }) {
    return prisma.user.create({
      data: {
        phone: params.phone,
        email: params.email.toLowerCase(),
        passwordHash: params.passwordHash,
        fullName: params.fullName,
        role: params.role ?? Role.USER,
      },
    })
  },
}
