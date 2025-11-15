import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"

const dateFormatter = new Intl.DateTimeFormat("fa-IR", { dateStyle: "short", timeStyle: "short" })

export default async function AuditLogsPage() {
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    include: { actor: true },
    take: 100,
  })

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-semibold">گزارش فعالیت سیستم</h1>
        <p className="text-sm text-slate-500">رهگیری تمامی عملیات حساس (KYC، دسترسی و ...)</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>آخرین لاگ‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>زمان</TableHead>
                <TableHead>کاربر</TableHead>
                <TableHead>اقدام</TableHead>
                <TableHead>موجودیت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{dateFormatter.format(log.createdAt)}</TableCell>
                  <TableCell>{log.actor?.email ?? log.actor?.phone ?? "سیستم"}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.entity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
