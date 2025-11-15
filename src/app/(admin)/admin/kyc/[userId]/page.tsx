import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { prisma } from "@/lib/prisma"

import { approveKycAction, rejectKycAction } from "../actions"

const levels = ["LEVEL1", "LEVEL2", "LEVEL3"] as const

export default async function KycDetailPage({ params }: { params: { userId: string } }) {
  const profile = await prisma.kycProfile.findUnique({
    where: { userId: params.userId },
    include: { user: true },
  })
  const documents = await prisma.document.findMany({
    where: { userId: params.userId },
    orderBy: { createdAt: "desc" },
  })

  if (!profile) {
    notFound()
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-semibold">بررسی مدارک {profile.user.fullName ?? profile.user.phone}</h1>
        <p className="text-sm text-slate-500">سطح درخواست شده: {profile.level}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>مدارک ارسال شده</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نوع</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>فایل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>
                    <Badge>{doc.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <a href={doc.fileUrl} target="_blank" className="text-blue-600">
                      مشاهده
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>تایید پرونده</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={approveKycAction} className="space-y-3">
              <input type="hidden" name="userId" value={profile.userId} />
              <label className="text-sm text-slate-600">سطح تایید</label>
              <select name="level" className="w-full rounded-md border border-neutral-200 p-2">
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <Button type="submit" className="w-full">
                تایید نهایی
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>رد پرونده</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={rejectKycAction} className="space-y-3">
              <input type="hidden" name="userId" value={profile.userId} />
              <label className="text-sm text-slate-600">دلیل رد</label>
              <Textarea name="reason" placeholder="مثلا کیفیت تصویر کارت ملی پایین است" required />
              <Button type="submit" variant="destructive" className="w-full">
                رد پرونده
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
