import { getServerSession } from "next-auth"

import { authConfig } from "@/lib/auth-options"

export function auth() {
  return getServerSession(authConfig)
}
