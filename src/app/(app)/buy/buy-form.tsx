"use client"

import { useEffect, useMemo, useState } from "react"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useFormState } from "react-dom"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { buyGoldAction, type BuyActionState } from "./actions"

const initialState: BuyActionState = { status: "idle", message: "" }
const FEE_PERCENT = 0.002
const MIN_AMOUNT = 100_000
const MAX_AMOUNT = 5_000_000_000

export function BuyForm({ pricePerGram }: { pricePerGram: number }) {
  const [amount, setAmount] = useState(0)
  const [currentPrice, setCurrentPrice] = useState(pricePerGram)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [state, formAction] = useFormState(buyGoldAction, initialState)

  const feeAmount = useMemo(() => amount * FEE_PERCENT, [amount])
  const investable = Math.max(amount - feeAmount, 0)
  const estimatedGrams = useMemo(() => {
    if (!currentPrice || investable <= 0) return 0
    return investable / currentPrice
  }, [currentPrice, investable])

  const isAmountValid = amount >= MIN_AMOUNT && amount <= MAX_AMOUNT

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message)
      setAmount(0)
    } else if (state.status === "error" && state.message) {
      toast.error(state.message)
    }
  }, [state.status, state.message])

  useEffect(() => {
    const interval = setInterval(async () => {
      setIsRefreshing(true)
      try {
        const response = await fetch("/api/prices/latest", { cache: "no-store" })
        if (!response.ok) return
        const data = await response.json()
        setCurrentPrice(data.gold18Sell)
      } finally {
        setIsRefreshing(false)
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-[1fr,0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>فرم خرید طلا</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="pricePerGram" value={currentPrice} />
            <div className="space-y-2">
              <Label htmlFor="amount">مبلغ مورد نظر (تومان)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min={MIN_AMOUNT}
                max={MAX_AMOUNT}
                step={10000}
                value={amount ? amount : ""}
                onChange={(event) => {
                  const value = event.target.value
                  setAmount(value ? Number(value) : 0)
                }}
                placeholder="مثلا ۵,۰۰۰,۰۰۰"
              />
              <p className="text-xs text-slate-500">
                حداقل {MIN_AMOUNT.toLocaleString("fa-IR")} و حداکثر {MAX_AMOUNT.toLocaleString("fa-IR")} تومان
              </p>
              {!isAmountValid && amount > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>مبلغ وارد شده خارج از محدوده مجاز است.</AlertDescription>
                </Alert>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={!isAmountValid || !currentPrice}>
              ثبت سفارش خرید
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>برآورد لحظه‌ای</CardTitle>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              آخرین قیمت: {currentPrice ? `${currentPrice.toLocaleString("fa-IR")} تومان` : "-"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <Line label="مبلغ ورودی" value={amount} suffix="تومان" />
          <Line label={`کارمزد (${(FEE_PERCENT * 100).toFixed(1)}٪)`} value={feeAmount} suffix="تومان" />
          <Line label="مبلغ خالص سرمایه‌گذاری" value={investable} suffix="تومان" emphasize />
          <Line label="مقدار تقریبی طلا" value={estimatedGrams} suffix="گرم" decimals />
        </CardContent>
      </Card>
    </div>
  )
}

function Line({
  label,
  value,
  suffix,
  emphasize,
  decimals,
}: {
  label: string
  value: number
  suffix: string
  emphasize?: boolean
  decimals?: boolean
}) {
  const formatter = new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: decimals ? 3 : 0,
  })
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className={emphasize ? "text-base font-semibold text-slate-900" : "text-slate-900"}>
        {Number.isFinite(value) ? `${formatter.format(value)} ${suffix}` : "-"}
      </span>
    </div>
  )
}
