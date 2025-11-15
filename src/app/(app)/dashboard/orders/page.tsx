import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDateTime, formatGram, formatIrr } from "@/lib/formatters"
import { handleAuthError, requireUser } from "@/lib/auth-guards"
import { prisma } from "@/lib/prisma"

const statusItems = [
  { status: "CREATED", label: "ایجاد شده" },
  { status: "PENDING_PAYMENT", label: "در انتظار پرداخت" },
  { status: "PAID", label: "پرداخت شده" },
  { status: "COMPLETED", label: "تسویه شد" },
  { status: "CANCELLED", label: "لغو شده" },
] as const

export default async function OrdersPage() {
  const session = await requireUser().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">سفارش‌های من</h1>
        <p className="text-sm text-slate-500">گزارش کامل تراکنش‌های خرید و فروش طلا</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>جزئیات سفارش‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نوع</TableHead>
                <TableHead>مقدار طلا</TableHead>
                <TableHead>قیمت هر گرم</TableHead>
                <TableHead>مبلغ کل</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-slate-500">
                    هنوز سفارشی ثبت نشده است.
                  </TableCell>
                </TableRow>
              )}
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.type === "BUY_GOLD" ? "خرید طلا" : "فروش طلا"}</TableCell>
                  <TableCell>{formatGram(Number(order.goldGrams))}</TableCell>
                  <TableCell>{formatIrr(Number(order.pricePerGram))}</TableCell>
                  <TableCell>{formatIrr(Number(order.fiatAmount))}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {statusItems.find((item) => item.status === order.status)?.label}
                    </Badge>
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
