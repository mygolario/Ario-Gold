"use server"

import { revalidatePath } from "next/cache"
import { DeliveryType, TransactionRefType, TransactionType, WalletType } from "@prisma/client"
import { z } from "zod"

import { handleAuthError, requireUser } from "@/lib/auth-guards"
import { prisma } from "@/lib/prisma"
import { recordAuditLog } from "@/lib/services/audit-service"
import { adjustWalletBalance } from "@/lib/services/wallet-service"

const requestSchema = z.object({
  grams: z.coerce.number().min(1, "حداقل ۱ گرم"),
  type: z.nativeEnum(DeliveryType),
  city: z.string().min(2),
  address: z.string().min(5),
  postalCode: z.string().min(5),
})

export type DeliveryActionState = { status: string; message?: string }

export async function requestDeliveryAction(_prevState: DeliveryActionState, formData: FormData) {
  const session = await requireUser().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const parsed = requestSchema.safeParse({
    grams: formData.get("grams"),
    type: formData.get("type") ?? undefined,
    city: formData.get("city"),
    address: formData.get("address"),
    postalCode: formData.get("postalCode"),
  })

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است" }
  }

  try {
    let newRequestId: string | null = null
    await prisma.$transaction(async (tx) => {
      const request = await tx.deliveryRequest.create({
        data: {
          userId: session.user.id,
          grams: parsed.data.grams,
          type: parsed.data.type,
          status: "REQUESTED",
          city: parsed.data.city,
          address: parsed.data.address,
          postalCode: parsed.data.postalCode,
        },
      })

      await adjustWalletBalance({
        userId: session.user.id,
        walletType: WalletType.GOLD,
        amount: parsed.data.grams,
        direction: TransactionType.DEBIT,
        refType: TransactionRefType.DELIVERY_REQUEST,
        refId: request.id,
        tx,
      })
      newRequestId = request.id
    })

    await recordAuditLog({
      actorId: session.user.id,
      action: "DELIVERY_REQUEST_CREATED",
      entity: "DeliveryRequest",
      entityId: newRequestId ?? undefined,
      metadata: parsed.data,
    })
  } catch (error) {
    const message =
      error instanceof Error && error.message === "negative_balance"
        ? "موجودی طلای شما کافی نیست."
        : "در ثبت درخواست مشکلی رخ داد."
    return { status: "error", message }
  }

  revalidatePath("/delivery-requests")
  return { status: "success", message: "درخواست شما ثبت شد." }
}
