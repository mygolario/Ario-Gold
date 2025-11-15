import { LivePriceCard } from "@/components/pricing/live-price-card"
import { Card, CardContent } from "@/components/ui/card"
import { handleAuthError, requireUser } from "@/lib/auth-guards"
import { getLatestPrices } from "@/lib/price-service"

import { BuyForm } from "./buy-form"

export default async function BuyPage() {
  await requireUser().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const prices = await getLatestPrices()

  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">خرید طلای دیجیتال</h1>
        <p className="text-sm text-slate-500">قیمت لحظه‌ای و محاسبه شفاف کارمزد</p>
      </div>
      <LivePriceCard initialPrices={prices} />
      {prices ? (
        <BuyForm pricePerGram={prices.gold18Sell} />
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-sm text-slate-500">
            امکان دریافت قیمت لحظه‌ای وجود ندارد. لطفا بعدا تلاش کنید.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
