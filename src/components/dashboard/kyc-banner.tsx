import { KycStatus } from "@prisma/client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

type AlertVariant = "default" | "destructive"

export function KycBanner({
  status,
  rejectionReason,
  nextStep,
}: {
  status?: KycStatus
  rejectionReason?: string | null
  nextStep?: string
}) {
  if (!status || status === "APPROVED") {
    return null
  }

  const variant: AlertVariant = status === "REJECTED" ? "destructive" : "default"
  const title = status === "REJECTED" ? "احراز هویت نیاز به اصلاح دارد" : "احراز هویت در حال بررسی است"
  const description =
    status === "REJECTED"
      ? rejectionReason ?? "لطفاً مدارک خود را بررسی و مجدداً بارگذاری کنید."
      : "مدارک شما در صف بررسی کارشناسان قرار دارد."

  return (
    <Alert variant={variant} className="mb-6" dir="rtl">
      <AlertTitle className="flex items-center gap-2">
        <Badge variant="outline">وضعیت KYC</Badge>
        {title}
      </AlertTitle>
      <AlertDescription>
        {description}
        {nextStep && (
          <span className="mt-1 block text-xs text-slate-600">
            مرحله بعدی: <strong>{nextStep}</strong>
          </span>
        )}
      </AlertDescription>
    </Alert>
  )
}
