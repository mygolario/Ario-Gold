import { prisma } from "@/lib/prisma"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboardPage() {
  const [users, pendingKyc, pendingDeliveries, openOrders] = await Promise.all([
    prisma.user.count(),
    prisma.kycProfile.count({ where: { status: "PENDING" } }),
    prisma.deliveryRequest.count({ where: { status: "REQUESTED" } }),
    prisma.order.count({ where: { status: { in: ["CREATED", "PENDING_PAYMENT"] } } }),
  ])

  const cards = [
    { label: "کل کاربران", value: users.toLocaleString("fa-IR") },
    { label: "پرونده‌های KYC در انتظار", value: pendingKyc.toLocaleString("fa-IR") },
    { label: "درخواست تحویل", value: pendingDeliveries.toLocaleString("fa-IR") },
    { label: "سفارش‌های باز", value: openOrders.toLocaleString("fa-IR") },
  ]

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-semibold">داشبورد مدیریتی</h1>
        <p className="text-sm text-slate-500">نمای کلی از وضعیت سامانه طلا</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">{item.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-slate-900">{item.value}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
