"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { handleAuthError, requireUser } from "@/lib/auth-guards"
import { recordAuditLog } from "@/lib/services/audit-service"
import { createSellOrder } from "@/lib/services/order-service"

const MIN_GRAMS = 0.1
const MAX_GRAMS = 5_000
const FEE_PERCENT = 0.002

const sellSchema = z.object({
  grams: z.coerce
    .number()
    .min(MIN_GRAMS, "حداقل ۰.۱ گرم")
    .max(MAX_GRAMS, "سقف فروش ۵۰۰۰ گرم است"),
  pricePerGram: z.coerce.number().positive(),
})

export type SellActionState = { status: string; message?: string }

export async function sellGoldAction(_prevState: SellActionState, formData: FormData) {
  const session = await requireUser().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const parsed = sellSchema.safeParse({
    grams: formData.get("grams"),
    pricePerGram: formData.get("pricePerGram"),
  })

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" }
  }

  try {
    const order = await createSellOrder({
      userId: session.user.id,
      goldGrams: parsed.data.grams,
      pricePerGram: parsed.data.pricePerGram,
      feePercent: FEE_PERCENT,
    })

    await recordAuditLog({
      actorId: session.user.id,
      action: "ORDER_CREATED_SELL",
      entity: "Order",
      entityId: order.id,
      metadata: parsed.data,
    })
  } catch (error) {
    const message =
      error instanceof Error && error.message === "insufficient_gold"
        ? "موجودی طلای شما کافی نیست."
        : "در ثبت درخواست فروش خطایی رخ داد."
    return { status: "error", message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/orders")

  return { status: "success", message: "درخواست فروش ثبت شد." }
}
