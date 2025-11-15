"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-4" dir="rtl">
      <h1 className="text-2xl font-semibold text-slate-900">خطایی رخ داده است</h1>
      <p className="max-w-md text-center text-sm text-slate-600">
        در پردازش درخواست شما مشکلی به وجود آمد. لطفاً دوباره تلاش کنید یا در صورت تکرار خطا با پشتیبانی تماس
        بگیرید.
      </p>
      <Button onClick={reset}>تلاش مجدد</Button>
    </div>
  )
}
