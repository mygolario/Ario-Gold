import { KycLevel, KycStatus, OrderStatus, WalletType } from "@prisma/client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDateTime, formatGram, formatIrr } from "@/lib/formatters"
import { handleAuthError, requireUser } from "@/lib/auth-guards"
import { prisma } from "@/lib/prisma"

const orderStatusLabels: Record<OrderStatus, string> = {
  CREATED: "ایجاد شده",
  PENDING_PAYMENT: "در انتظار پرداخت",
  PAID: "پرداخت شده",
  COMPLETED: "تسویه شد",
  CANCELLED: "لغو شده",
}

const kycLevelLabels: Record<KycLevel, string> = {
  LEVEL0: "سطح ۰",
  LEVEL1: "سطح ۱",
  LEVEL2: "سطح ۲",
  LEVEL3: "سطح ۳",
}

const kycStatusLabels: Record<KycStatus, string> = {
  PENDING: "در انتظار بررسی",
  APPROVED: "تایید شده",
  REJECTED: "رد شده",
}

export default async function DashboardPage() {
  const session = await requireUser().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const [user, wallets, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { kycProfile: true },
    }),
    prisma.wallet.findMany({ where: { userId: session.user.id } }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  const fiatWallet = wallets.find((w) => w.type === WalletType.FIAT)
  const goldWallet = wallets.find((w) => w.type === WalletType.GOLD)

  return (
    <div className="space-y-8" dir="rtl">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">{user?.fullName ?? "کاربر"}</p>
        <h1 className="text-2xl font-semibold text-slate-900">خوش آمدید 👋</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">موجودی ریالی</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-slate-900">
            {formatIrr(Number(fiatWallet?.balance ?? 0))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">موجودی طلایی</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-slate-900">
            {formatGram(Number(goldWallet?.balance ?? 0))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">وضعیت احراز هویت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">سطح فعلی:</span>
              <Badge variant="secondary">
                {user?.kycProfile?.level ? kycLevelLabels[user.kycProfile.level] : "سطح ۰"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">وضعیت:</span>
              <Badge>
                {user?.kycProfile?.status ? kycStatusLabels[user.kycProfile.status] : "در انتظار بررسی"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>آخرین سفارش‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نوع</TableHead>
                <TableHead>مقدار طلا</TableHead>
                <TableHead>مبلغ ریالی</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-slate-500">
                    هنوز سفارشی ثبت نکرده‌اید.
                  </TableCell>
                </TableRow>
              )}
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.type === "BUY_GOLD" ? "خرید" : "فروش"}</TableCell>
                  <TableCell>{formatGram(Number(order.goldGrams))}</TableCell>
                  <TableCell>{formatIrr(Number(order.fiatAmount))}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{orderStatusLabels[order.status]}</Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
