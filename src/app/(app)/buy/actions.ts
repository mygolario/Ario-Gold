"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { handleAuthError, requireUser } from "@/lib/auth-guards"
import { recordAuditLog } from "@/lib/services/audit-service"
import { createBuyOrder } from "@/lib/services/order-service"

const MIN_AMOUNT = 100_000
const MAX_AMOUNT = 5_000_000_000
const FEE_PERCENT = 0.002

const buySchema = z.object({
  amount: z
    .coerce.number()
    .min(MIN_AMOUNT, "حداقل خرید ۱۰۰ هزار تومان است")
    .max(MAX_AMOUNT, "حداکثر مبلغ مجاز ۵ میلیارد تومان است"),
  pricePerGram: z.coerce.number().positive(),
})

export type BuyActionState = {
  status: string
  message: string
}

export async function buyGoldAction(_prevState: BuyActionState, formData: FormData) {
  const session = await requireUser().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const parsed = buySchema.safeParse({
    amount: formData.get("amount"),
    pricePerGram: formData.get("pricePerGram"),
  })

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" }
  }

  try {
    const order = await createBuyOrder({
      userId: session.user.id,
      fiatAmount: parsed.data.amount,
      pricePerGram: parsed.data.pricePerGram,
      feePercent: FEE_PERCENT,
    })

    await recordAuditLog({
      actorId: session.user.id,
      action: "ORDER_CREATED_BUY",
      entity: "Order",
      entityId: order.id,
      metadata: {
        fiatAmount: parsed.data.amount,
        pricePerGram: parsed.data.pricePerGram,
        feePercent: FEE_PERCENT,
      },
    })
  } catch (error) {
    const message =
      error instanceof Error && error.message === "insufficient_funds"
        ? "موجودی ریالی شما کافی نیست."
        : "در ثبت سفارش مشکلی رخ داد."
    return { status: "error", message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/orders")

  return { status: "success", message: "سفارش با موفقیت ثبت شد." }
}
