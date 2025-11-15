"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "خانه", href: "/" },
  { label: "قیمت‌ها", href: "#prices" },
  { label: "چطور کار می‌کند؟", href: "#how-it-works" },
  { label: "درباره ما", href: "/about" },
  { label: "سوالات متداول", href: "/faq" },
  { label: "تماس", href: "/contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4" dir="rtl">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">
            آ
          </span>
          آریو طلا
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-blue-600",
                pathname === item.href && "text-blue-600",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {role === "ADMIN" || role === "KYC_OFFICER" ? (
            <Button variant="ghost" asChild>
              <Link href="/admin">ورود مدیر</Link>
            </Button>
          ) : role === "USER" ? (
            <Button variant="ghost" asChild>
              <Link href="/dashboard">پنل کاربری</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">ورود</Link>
              </Button>
              <Button asChild>
                <Link href="/register">افتتاح حساب</Link>
              </Button>
            </>
          )}
        </div>
        <div className="lg:hidden">
          <Link
            href={
              role === "ADMIN" || role === "KYC_OFFICER"
                ? "/admin"
                : role === "USER"
                  ? "/dashboard"
                  : "/login"
            }
            className="text-sm font-medium text-blue-600"
          >
            {role ? "ورود به پنل" : "ورود"}
          </Link>
        </div>
      </div>
    </header>
  )
}
