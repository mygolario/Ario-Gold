import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"

const dateFormatter = new Intl.DateTimeFormat("fa-IR", { dateStyle: "short", timeStyle: "short" })

export default async function AdminTransactionsPage() {
  const transactions = await prisma.walletTransaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { wallet: { include: { user: true } } },
    take: 100,
  })

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-semibold">تراکنش‌های کیف پول</h1>
        <p className="text-sm text-slate-500">لیست آخرین تراکنش‌های ریالی و طلایی</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>آخرین ۱۰۰ تراکنش</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>کاربر</TableHead>
                <TableHead>نوع کیف</TableHead>
                <TableHead>عملیات</TableHead>
                <TableHead>مبلغ</TableHead>
                <TableHead>تاریخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.wallet.user.fullName ?? tx.wallet.user.phone}</TableCell>
                  <TableCell>{tx.wallet.type === "FIAT" ? "ریالی" : "طلایی"}</TableCell>
                  <TableCell>{tx.type === "CREDIT" ? "واریز" : "برداشت"}</TableCell>
                  <TableCell>{Number(tx.amount).toLocaleString("fa-IR")}</TableCell>
                  <TableCell>{dateFormatter.format(tx.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
