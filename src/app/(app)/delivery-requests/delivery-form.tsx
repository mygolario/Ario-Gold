"use client"

import { useEffect } from "react"
import { useFormState } from "react-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { requestDeliveryAction, type DeliveryActionState } from "./actions"

const initialState: DeliveryActionState = { status: "idle" }

export function DeliveryRequestForm({ availableGrams }: { availableGrams: number }) {
  const [state, formAction] = useFormState(requestDeliveryAction, initialState)

  useEffect(() => {
    if (state.status === "success" && state.message) {
      toast.success(state.message)
    } else if (state.status === "error" && state.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <Card>
      <CardHeader>
        <CardTitle>فرم درخواست تحویل فیزیکی</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4" dir="rtl">
          <div className="space-y-2 text-sm text-slate-500">
            <p>موجودی طلایی: {availableGrams.toFixed(3)} گرم</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="grams">مقدار (گرم)</Label>
              <Input id="grams" name="grams" type="number" step={0.1} min={1} placeholder="مثلا 10" />
            </div>
            <div className="space-y-2">
              <Label>نوع تحویل</Label>
              <Select name="type" defaultValue="GOLD_BAR">
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GOLD_BAR">شمش</SelectItem>
                  <SelectItem value="GOLD_COIN">سکه</SelectItem>
                  <SelectItem value="RAW_GOLD">طلای آب‌شده</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">شهر</Label>
            <Input id="city" name="city" placeholder="تهران" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">آدرس کامل</Label>
            <Textarea id="address" name="address" rows={3} />
          </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">کدپستی</Label>
              <Input id="postalCode" name="postalCode" />
            </div>
          <Button type="submit" className="w-full">
            ثبت درخواست
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
