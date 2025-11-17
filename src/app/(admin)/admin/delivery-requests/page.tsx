import { DeliveryStatus } from "@prisma/client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"

import { updateDeliveryStatusAction } from "./actions"

const statuses: DeliveryStatus[] = ["REQUESTED", "IN_PROGRESS", "SHIPPED", "DELIVERED", "REJECTED"]

const statusLabels: Record<DeliveryStatus, string> = {
  REQUESTED: "درخواست شده",
  IN_PROGRESS: "در حال پردازش",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل داده شده",
  REJECTED: "رد شده",
}

const typeLabels: Record<string, string> = {
  GOLD_BAR: "شمش",
  GOLD_COIN: "سکه",
  RAW_GOLD: "آب‌شده",
}

export default async function DeliveryRequestsPage() {
  const requests = await prisma.deliveryRequest.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-semibold">مدیریت درخواست‌های تحویل</h1>
        <p className="text-sm text-slate-500">ثبت وضعیت ارسال و کد رهگیری</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>درخواست‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>کاربر</TableHead>
                <TableHead>مقدار (گرم)</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>به‌روزرسانی</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="text-sm font-semibold">{request.user.fullName ?? request.user.phone}</div>
                    <div className="text-xs text-slate-500">{request.city}</div>
                  </TableCell>
                  <TableCell>{Number(request.grams).toLocaleString("fa-IR")}</TableCell>
                  <TableCell>{typeLabels[request.type] ?? request.type}</TableCell>
                  <TableCell>
                    <Badge>{statusLabels[request.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    <form action={updateDeliveryStatusAction} className="flex flex-col gap-2 text-xs">
                      <input type="hidden" name="id" value={request.id} />
                      <select name="status" defaultValue={request.status} className="rounded-md border border-neutral-200 p-1">
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                      <input
                        className="rounded-md border border-neutral-200 p-1"
                        name="trackingCode"
                        placeholder="کد رهگیری"
                        defaultValue={request.trackingCode ?? ""}
                      />
                      <button className="rounded-md bg-amber-600 py-1 text-white hover:bg-amber-700">
                        ذخیره
                      </button>
                    </form>
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
