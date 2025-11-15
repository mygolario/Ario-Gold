"use client"

import { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

import { Toaster } from "@/components/ui/sonner"

export function AppProviders({ children, session }: { children: ReactNode; session: Session | null }) {
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster position="top-right" />
    </SessionProvider>
  )
}
