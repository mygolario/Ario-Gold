import type { AuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { Role } from "@prisma/client"
import { z } from "zod"

import { userAdapter } from "@/lib/auth/user-adapter"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const authConfig: AuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "ایمیل", type: "email" },
        password: { label: "کلمه عبور", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) {
          return null
        }

        const user = await userAdapter.findByEmail(parsed.data.email)
        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await compare(parsed.data.password, user.passwordHash)
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          name: user.fullName ?? user.email ?? user.phone,
          email: user.email,
          role: user.role,
          phone: user.phone,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role
        token.phone = (user as { phone: string }).phone
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as Role
        session.user.phone = token.phone as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      return url
    },
  },
}
