import type { ReactNode } from "react"
import Link from "next/link"

import { KycBanner } from "@/components/dashboard/kyc-banner"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { Button } from "@/components/ui/button"
import { requireUser, handleAuthError } from "@/lib/auth-guards"
import { prisma } from "@/lib/prisma"

const navItems = [
  { href: "/dashboard", label: "داشبورد" },
  { href: "/buy", label: "خرید طلا" },
  { href: "/sell", label: "فروش طلا" },
  { href: "/dashboard/orders", label: "سفارش‌ها" },
  { href: "/kyc", label: "احراز هویت" },
  { href: "/delivery-requests", label: "درخواست تحویل" },
]

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireUser().catch((error) => {
    handleAuthError(error)
    return null as never
  })
  const kycProfile = await prisma.kycProfile.findUnique({ where: { userId: session.user.id } })
  const kycNextStep = (() => {
    if (kycProfile?.status === "REJECTED") {
      return "اصلاح و ارسال مجدد مدارک رد شده"
    }
    if (!kycProfile || kycProfile.level === "LEVEL0") {
      return "تکمیل اطلاعات پایه سطح ۱"
    }
    if (kycProfile.level === "LEVEL1") {
      return "بارگذاری مدارک تصویری سطح ۲"
    }
    if (kycProfile.level === "LEVEL2") {
      return "در انتظار تایید سطح ۳ / کاربران ویژه"
    }
    return null
  })()

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <aside className="hidden w-64 flex-col border-l border-neutral-200 bg-white p-6 lg:flex" dir="rtl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-900">
            آریو طلا
          </Link>
        </div>
        <div className="mt-6 text-sm text-slate-500">{session.user.name ?? session.user.phone}</div>
        <div className="mt-8">
          <SidebarNav items={navItems} />
        </div>
        <div className="mt-auto pt-8">
          <Button variant="link" className="px-0" asChild>
            <Link href="/">بازگشت به صفحه اصلی</Link>
          </Button>
        </div>
      </aside>
      <main className="flex-1 px-4 py-8 lg:px-10" dir="rtl">
        <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-slate-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <KycBanner
          status={kycProfile?.status}
          rejectionReason={kycProfile?.rejectionReason}
          nextStep={kycNextStep ?? undefined}
        />
        {children}
      </main>
    </div>
  )
}
