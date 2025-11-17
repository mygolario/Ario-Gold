import type { ReactNode } from "react"
import Link from "next/link"

import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { Button } from "@/components/ui/button"
import { requireAdminOrKyc, handleAuthError } from "@/lib/auth-guards"

const baseNav = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/kyc", label: "احراز هویت" },
  { href: "/admin/orders", label: "سفارش‌ها" },
  { href: "/admin/transactions", label: "تراکنش‌ها" },
  { href: "/admin/audit-logs", label: "گزارش فعالیت" },
]

const adminOnly = [
  { href: "/admin/users", label: "مدیریت کاربران" },
  { href: "/admin/delivery-requests", label: "تحویل فیزیکی" },
]

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminOrKyc().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const navItems = session.user.role === "ADMIN" ? [...adminOnly, ...baseNav] : baseNav

  return (
    <div className="flex min-h-screen bg-neutral-50" dir="rtl">
      <aside className="hidden w-64 flex-col border-l border-neutral-200 bg-white p-6 lg:flex">
        <Link href="/admin" className="text-lg font-semibold">کنترل پنل آریو</Link>
        <p className="mt-2 text-xs text-slate-500">{session.user.email ?? session.user.phone}</p>
        <div className="mt-8">
          <SidebarNav items={navItems} />
        </div>
        <div className="mt-auto pt-8 text-sm text-slate-500">
          <Button variant="link" className="px-0" asChild>
            <Link href="/" className="text-amber-600">
              مشاهده وب‌سایت
            </Link>
          </Button>
        </div>
      </aside>
      <main className="flex-1 px-4 py-8 lg:px-10">
        <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-slate-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
        {children}
      </main>
    </div>
  )
}
