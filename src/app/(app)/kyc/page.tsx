import { DocumentType, KycLevel, KycStatus } from "@prisma/client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { handleAuthError, requireUser } from "@/lib/auth-guards"
import { prisma } from "@/lib/prisma"

import { UploadCard } from "./upload-card"

const requiredDocs = [
  {
    type: DocumentType.NATIONAL_ID,
    title: "تصویر کارت ملی",
    description: "تصویر واضح از دو سمت کارت ملی هوشمند.",
  },
  {
    type: DocumentType.SELFIE,
    title: "سلفی احراز هویت",
    description: "سلفی زنده مطابق دستورالعمل کارشناسان.",
  },
  {
    type: DocumentType.ADDRESS_PROOF,
    title: "مدرک محل سکونت",
    description: "قبض یا سند معتبر با اعتبار حداقل سه ماه.",
  },
]

const levelFlow: { level: KycLevel; title: string; description: string }[] = [
  { level: "LEVEL0", title: "سطح ۰", description: "ثبت‌نام اولیه" },
  { level: "LEVEL1", title: "سطح ۱", description: "اطلاعات هویتی" },
  { level: "LEVEL2", title: "سطح ۲", description: "مدارک تصویری" },
  { level: "LEVEL3", title: "سطح ۳", description: "تایید ویژه" },
]

export default async function KycPage() {
  const session = await requireUser().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const [kycProfile, documents] = await Promise.all([
    prisma.kycProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.document.findMany({ where: { userId: session.user.id } }),
  ])

  const docsByType: Partial<Record<DocumentType, (typeof documents)[number]>> = {}
  documents.forEach((doc) => {
    docsByType[doc.type] = doc
  })

  const currentLevel = kycProfile?.level ?? "LEVEL0"
  const currentStatus = kycProfile?.status ?? "PENDING"
  const levelLabel = levelFlow.find((lvl) => lvl.level === currentLevel)?.title ?? "سطح ۰"
  const statusLabel: Record<KycStatus, string> = {
    PENDING: "در انتظار بررسی",
    APPROVED: "تایید شده",
    REJECTED: "رد شده",
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">احراز هویت</h1>
        <p className="text-sm text-slate-500">برای افزایش سقف تراکنش‌ها مدارک لازم را بارگذاری کنید.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>وضعیت فعلی</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-3">
          <div>
            <p className="text-slate-500">سطح تایید شده</p>
            <Badge variant="secondary">{levelLabel}</Badge>
          </div>
          <div>
            <p className="text-slate-500">وضعیت بررسی</p>
            <Badge>{statusLabel[currentStatus]}</Badge>
          </div>
          {kycProfile?.rejectionReason && (
            <div>
              <p className="text-slate-500">دلیل رد</p>
              <p className="text-sm text-amber-600">{kycProfile.rejectionReason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>پیشرفت مراحل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {levelFlow.map((step) => {
              const achieved = levelFlow.findIndex((lvl) => lvl.level === step.level) <=
                levelFlow.findIndex((lvl) => lvl.level === currentLevel)
              return (
                <div
                  key={step.level}
                  className={`rounded-2xl border p-4 text-sm ${achieved ? "border-blue-200 bg-blue-50" : "border-neutral-200"}`}
                >
                  <p className="font-semibold text-slate-900">{step.title}</p>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {requiredDocs.map((doc) => {
          const currentDoc = docsByType[doc.type]
          return (
            <UploadCard
              key={doc.type}
              type={doc.type}
              title={doc.title}
              description={doc.description}
              document={
                currentDoc
                  ? {
                      status: currentDoc.status,
                      fileUrl: currentDoc.fileUrl,
                    }
                  : undefined
              }
            />
          )
        })}
      </div>
    </div>
  )
}
