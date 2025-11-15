"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, RefreshCw } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NormalizedPrices } from "@/lib/price-service"

const formatter = new Intl.NumberFormat("fa-IR")

export function LivePriceCard({ initialPrices }: { initialPrices: NormalizedPrices | null }) {
  const [prices, setPrices] = useState(initialPrices)
  const [lastUpdated, setLastUpdated] = useState(initialPrices?.lastUpdated ?? "-")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [flash, setFlash] = useState(false)

  const rows = useMemo(
    () => [
      { label: "هر گرم طلای ۱۸ عیار", value: prices?.gold18Sell },
      { label: "هر گرم طلای ۲۴ عیار", value: prices?.gold24Sell },
      { label: "طلای آب‌شده", value: prices?.rawGold },
      { label: "سکه امامی", value: prices?.emamiCoin },
    ],
    [prices],
  )

  useEffect(() => {
    const interval = setInterval(async () => {
      setIsRefreshing(true)
      try {
        const response = await fetch("/api/prices/latest", { cache: "no-store" })
        if (!response.ok) return
        const data = (await response.json()) as NormalizedPrices
        setPrices((prev) => {
          if (!prev || prev.gold18Sell !== data.gold18Sell) {
            setFlash(true)
            setTimeout(() => setFlash(false), 1200)
          }
          return data
        })
        setLastUpdated(data.lastUpdated)
      } finally {
        setIsRefreshing(false)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (!prices) {
    return (
      <Card className="border-none bg-white/80 shadow-2xl" dir="rtl">
        <CardContent className="py-10 text-center text-sm text-slate-500">دریافت قیمت امکان‌پذیر نیست.</CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`border-none bg-white/80 shadow-2xl transition ${flash ? "ring-2 ring-blue-200" : ""}`}
      dir="rtl"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">قیمت‌های لحظه‌ای</CardTitle>
            <p className="text-sm text-slate-500">به‌روزرسانی: {lastUpdated}</p>
          </div>
          <RefreshCw className={`h-4 w-4 text-blue-600 ${isRefreshing ? "animate-spin" : ""}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {rows.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-slate-600">{item.label}</span>
            <span className="text-base font-semibold text-slate-900">{formatValue(item.value)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>منبع: {prices.source === "tgju_live" ? "شبکه طلا و ارز" : "snapshot"}</span>
          {flash && (
            <span className="flex items-center gap-1 text-emerald-600">
              <ArrowUpRight className="h-3 w-3" /> به‌روزرسانی قیمت
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function formatValue(value?: number) {
  if (!value) return "نامشخص"
  return `${formatter.format(Math.round(value))} تومان`
}
