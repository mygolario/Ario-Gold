import { notFound } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"

import { AdjustWalletForm } from "./adjust-form"

export default async function AdminUserDetailPage({ params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: { wallets: true, kycProfile: true },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-semibold">{user.fullName ?? user.phone}</h1>
        <p className="text-sm text-slate-500">نقش: {user.role}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات احراز هویت</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-slate-600">
          <div>
            <p className="text-slate-500">سطح</p>
            <p>{user.kycProfile?.level ?? "LEVEL0"}</p>
          </div>
          <div>
            <p className="text-slate-500">وضعیت</p>
            <p>{user.kycProfile?.status ?? "PENDING"}</p>
          </div>
          {user.kycProfile?.rejectionReason && (
            <div>
              <p className="text-slate-500">دلیل رد</p>
              <p className="text-amber-600">{user.kycProfile.rejectionReason}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>کیف پول‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نوع</TableHead>
                <TableHead>واحد</TableHead>
                <TableHead>موجودی</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.wallets.map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell>{wallet.type === "FIAT" ? "ریالی" : "طلا"}</TableCell>
                  <TableCell>{wallet.currency}</TableCell>
                  <TableCell>{wallet.balance.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AdjustWalletForm userId={user.id} wallets={user.wallets} />
    </div>
  )
}
