import Link from "next/link"
import { KycStatus, Role } from "@prisma/client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"

const roleLabels: Record<Role, string> = {
  USER: "کاربر",
  ADMIN: "مدیر",
  KYC_OFFICER: "کارمند KYC",
}

const kycStatusLabels: Record<KycStatus, string> = {
  PENDING: "در انتظار بررسی",
  APPROVED: "تایید شده",
  REJECTED: "رد شده",
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { kycProfile: true },
    take: 100,
  })

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-semibold">مدیریت کاربران</h1>
        <p className="text-sm text-slate-500">مشاهده کاربران فعال و وضعیت احراز هویت</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>کاربران اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>شماره</TableHead>
                <TableHead>نقش</TableHead>
                <TableHead>وضعیت KYC</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName ?? "-"}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{kycStatusLabels[user.kycProfile?.status ?? "PENDING"]}</Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <Link href={`/admin/users/${user.id}`} className="text-sm text-amber-600 hover:underline">
                      مدیریت کیف پول
                    </Link>
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
