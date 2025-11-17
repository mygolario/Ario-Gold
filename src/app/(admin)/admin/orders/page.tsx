import { OrderStatus } from "@prisma/client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"

const statuses: OrderStatus[] = ["CREATED", "PENDING_PAYMENT", "PAID", "COMPLETED", "CANCELLED"]

const statusLabels: Record<OrderStatus, string> = {
  CREATED: "ایجاد شده",
  PENDING_PAYMENT: "در انتظار پرداخت",
  PAID: "پرداخت شده",
  COMPLETED: "تسویه شد",
  CANCELLED: "لغو شده",
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const statusFilter = searchParams.status && statuses.includes(searchParams.status as OrderStatus)
    ? (searchParams.status as OrderStatus)
    : undefined

  const orders = await prisma.order.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">سفارش‌ها</h1>
          <p className="text-sm text-slate-500">پایش معاملات خرید و فروش طلا</p>
        </div>
        <form className="flex items-center gap-3">
          <label className="text-sm text-slate-600">فیلتر وضعیت</label>
          <select name="status" defaultValue={statusFilter ?? ""} className="rounded-md border border-neutral-200 p-2">
            <option value="">همه</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
          <button className="rounded-md bg-amber-600 px-4 py-2 text-sm text-white hover:bg-amber-700">
            اعمال
          </button>
        </form>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>آخرین سفارش‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>کاربر</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>مبلغ (تومان)</TableHead>
                <TableHead>مقدار طلا</TableHead>
                <TableHead>وضعیت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.user.fullName ?? order.user.phone}</TableCell>
                  <TableCell>{order.type === "BUY_GOLD" ? "خرید" : "فروش"}</TableCell>
                  <TableCell>{Number(order.fiatAmount).toLocaleString("fa-IR")}</TableCell>
                  <TableCell>{Number(order.goldGrams).toLocaleString("fa-IR")}</TableCell>
                  <TableCell>
                    <Badge>{statusLabels[order.status]}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
