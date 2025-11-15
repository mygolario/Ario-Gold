"use client"

import { useEffect } from "react"
import { useFormState } from "react-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Wallet } from "@prisma/client"

import { adjustWalletAction, type AdjustState } from "./actions"

const initialState: AdjustState = { status: "idle" }

export function AdjustWalletForm({ userId, wallets }: { userId: string; wallets: Wallet[] }) {
  const [state, formAction] = useFormState<AdjustState, FormData>(adjustWalletAction, initialState)

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
        <CardTitle>تنظیم دستی موجودی</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4" dir="rtl">
          <input type="hidden" name="userId" value={userId} />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="walletType">انتخاب کیف پول</Label>
              <Select name="walletType" defaultValue={wallets[0]?.type}>
                <SelectTrigger id="walletType">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.type}>
                      {wallet.type === "FIAT" ? "کیف ریالی" : "کیف طلایی"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="direction">نوع عملیات</Label>
              <Select name="direction" defaultValue="CREDIT">
                <SelectTrigger id="direction">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREDIT">واریز</SelectItem>
                  <SelectItem value="DEBIT">برداشت</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">مبلغ / مقدار</Label>
            <Input id="amount" name="amount" type="number" min={1000} step={1000} placeholder="مثلا 1,000,000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">توضیحات</Label>
            <Textarea id="note" name="note" placeholder="دلیل تغییر موجودی" />
          </div>
          <Button type="submit" className="w-full">
            ثبت عملیات
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
