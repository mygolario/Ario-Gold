"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"

const navItems = [
  { label: "خانه", href: "/" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
  { label: "سوالات متداول", href: "/faq" },
]

export function SiteHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur" dir="rtl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-600 text-white">
            آ
          </span>
          آریو طلا
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-amber-600">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {session ? (
            <Link
              href="/dashboard"
              className="text-xs text-slate-500 hover:text-amber-600 hidden lg:block"
            >
              داشبورد
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs text-slate-600 hover:text-amber-600 hidden lg:block"
              >
                ورود
              </Link>
              <Button asChild size="sm">
                <Link href="/register">ثبت‌نام</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
