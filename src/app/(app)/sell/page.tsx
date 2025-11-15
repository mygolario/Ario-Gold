import { LivePriceCard } from "@/components/pricing/live-price-card"
import { Card, CardContent } from "@/components/ui/card"
import { handleAuthError, requireUser } from "@/lib/auth-guards"
import { prisma } from "@/lib/prisma"
import { getLatestPrices } from "@/lib/price-service"

import { SellForm } from "./sell-form"

export default async function SellPage() {
  const session = await requireUser().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const [prices, goldWallet] = await Promise.all([
    getLatestPrices(),
    prisma.wallet.findFirst({ where: { userId: session.user.id, type: "GOLD" } }),
  ])

  const availableGrams = Number(goldWallet?.balance ?? 0)

  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">فروش طلا و تسویه ریالی</h1>
        <p className="text-sm text-slate-500">موجودی طلایی خود را به تومان تبدیل کنید.</p>
      </div>
      <LivePriceCard initialPrices={prices} />
      {prices ? (
        <SellForm pricePerGram={prices.gold18Buy} availableGrams={availableGrams} />
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-sm text-slate-500">
            امکان دریافت قیمت برای فروش وجود ندارد.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
