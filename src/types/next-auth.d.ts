import { Role } from "@prisma/client"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role: Role
      phone?: string
    }
  }

  interface User {
    role: Role
    phone: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role
    phone?: string
  }
}

export {}
