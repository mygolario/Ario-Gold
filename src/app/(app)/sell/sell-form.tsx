"use client"

import { useEffect, useMemo, useState } from "react"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useFormState } from "react-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { sellGoldAction, type SellActionState } from "./actions"

const initialState: SellActionState = { status: "idle" }
const FEE_PERCENT = 0.002

export function SellForm({ pricePerGram, availableGrams }: { pricePerGram: number; availableGrams: number }) {
  const [grams, setGrams] = useState(0)
  const [price, setPrice] = useState(pricePerGram)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [state, formAction] = useFormState(sellGoldAction, initialState)

  const grossValue = useMemo(() => grams * price, [grams, price])
  const feeAmount = useMemo(() => grossValue * FEE_PERCENT, [grossValue])
  const payout = grossValue - feeAmount
  const isValid = grams > 0 && grams <= availableGrams

  useEffect(() => {
    if (state.status === "success" && state.message) {
      toast.success(state.message)
      setGrams(0)
    } else if (state.status === "error" && state.message) {
      toast.error(state.message)
    }
  }, [state])

  useEffect(() => {
    const interval = setInterval(async () => {
      setIsRefreshing(true)
      try {
        const res = await fetch("/api/prices/latest", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        setPrice(data.gold18Buy)
      } finally {
        setIsRefreshing(false)
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>درخواست فروش</CardTitle>
          <span className="text-xs text-slate-500">موجودی طلایی: {availableGrams.toFixed(3)} گرم</span>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4" dir="rtl">
          <input type="hidden" name="pricePerGram" value={price} />
          <div className="space-y-2">
            <Label htmlFor="grams">مقدار طلا (گرم)</Label>
            <Input
              id="grams"
              name="grams"
              type="number"
              step={0.01}
              min={0.1}
              value={grams ? grams : ""}
              onChange={(event) => setGrams(event.target.value ? Number(event.target.value) : 0)}
            />
            {!isValid && grams > 0 && <p className="text-xs text-rose-600">مقدار وارد شده بیشتر از موجودی است.</p>}
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>قیمت خرید هر گرم</span>
              <span className="flex items-center gap-2">
                {price.toLocaleString("fa-IR")} تومان
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>کارمزد ({(FEE_PERCENT * 100).toFixed(1)}٪)</span>
              <span>{feeAmount > 0 ? `${feeAmount.toLocaleString("fa-IR")} تومان` : "-"}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-semibold text-slate-900">
              <span>واریزی خالص</span>
              <span>{payout > 0 ? `${payout.toLocaleString("fa-IR")} تومان` : "-"}</span>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={!isValid || payout <= 0}>
            ثبت درخواست فروش
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
