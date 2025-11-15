"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export type SidebarItem = {
  href: string
  label: string
}

export function SidebarNav({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-2 text-sm font-medium",
            pathname === item.href ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
