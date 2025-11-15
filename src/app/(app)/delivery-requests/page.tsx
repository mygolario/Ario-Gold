import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { handleAuthError, requireUser } from "@/lib/auth-guards"
import { prisma } from "@/lib/prisma"

import { DeliveryRequestForm } from "./delivery-form"

export default async function DeliveryRequestsPage() {
  const session = await requireUser().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const [requests, goldWallet] = await Promise.all([
    prisma.deliveryRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.wallet.findFirst({ where: { userId: session.user.id, type: "GOLD" } }),
  ])

  const formatter = new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" })

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-semibold">درخواست تحویل فیزیکی</h1>
        <p className="text-sm text-slate-500">پس از ثبت درخواست، کارشناسان زمان‌بندی ارسال را اعلام می‌کنند.</p>
      </div>
      <DeliveryRequestForm availableGrams={Number(goldWallet?.balance ?? 0)} />
      <Card>
        <CardHeader>
          <CardTitle>درخواست‌های من</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>تاریخ</TableHead>
                <TableHead>مقدار</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>رهگیری</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{formatter.format(req.createdAt)}</TableCell>
                  <TableCell>{Number(req.grams).toLocaleString("fa-IR")} گرم</TableCell>
                  <TableCell>{req.type}</TableCell>
                  <TableCell>{req.status}</TableCell>
                  <TableCell>{req.trackingCode ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
