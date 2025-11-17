import Link from "next/link"
import { KycLevel } from "@prisma/client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"

const levelLabels: Record<KycLevel, string> = {
  LEVEL0: "سطح ۰",
  LEVEL1: "سطح ۱",
  LEVEL2: "سطح ۲",
  LEVEL3: "سطح ۳",
}

export default async function AdminKycPage() {
  const profiles = await prisma.kycProfile.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  })

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-semibold">پرونده‌های KYC در انتظار</h1>
        <p className="text-sm text-slate-500">کارشناسان می‌توانند از اینجا مدارک را بررسی کنند.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>لیست در انتظار</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>کاربر</TableHead>
                <TableHead>شماره موبایل</TableHead>
                <TableHead>سطح درخواست</TableHead>
                <TableHead>اقدام</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.user.fullName ?? "-"}</TableCell>
                  <TableCell>{profile.user.phone}</TableCell>
                  <TableCell>{levelLabels[profile.level]}</TableCell>
                  <TableCell>
                    <Link href={`/admin/kyc/${profile.userId}`} className="text-amber-600 hover:underline">
                      بررسی
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
