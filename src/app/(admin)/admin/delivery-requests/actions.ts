"use server"

import { revalidatePath } from "next/cache"
import { DeliveryStatus, TransactionRefType, TransactionType, WalletType } from "@prisma/client"
import { z } from "zod"

import { handleAuthError, requireAdmin } from "@/lib/auth-guards"
import { prisma } from "@/lib/prisma"
import { recordAuditLog } from "@/lib/services/audit-service"
import { adjustWalletBalance } from "@/lib/services/wallet-service"

const statusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(DeliveryStatus),
  trackingCode: z.string().optional(),
})

export async function updateDeliveryStatusAction(formData: FormData) {
  const session = await requireAdmin().catch((error) => {
    handleAuthError(error)
    return null as never
  })

  const parsed = statusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status") ?? undefined,
    trackingCode: formData.get("trackingCode") ?? undefined,
  })

  if (!parsed.success) return

  const request = await prisma.deliveryRequest.findUnique({ where: { id: parsed.data.id } })
  if (!request) return

  await prisma.$transaction(async (tx) => {
    await tx.deliveryRequest.update({
      where: { id: parsed.data.id },
      data: {
        status: parsed.data.status,
        trackingCode: parsed.data.trackingCode,
      },
    })

    if (parsed.data.status === "REJECTED" && request.status !== "REJECTED") {
      await adjustWalletBalance({
        userId: request.userId,
        walletType: WalletType.GOLD,
        amount: Number(request.grams),
        direction: TransactionType.CREDIT,
        refType: TransactionRefType.DELIVERY_REQUEST,
        refId: request.id,
        note: "بازگشت طلای بلوکه شده پس از رد تحویل",
        tx,
      })
    }
  })

  await recordAuditLog({
    actorId: session.user.id,
    action: "DELIVERY_STATUS_UPDATED",
    entity: "DeliveryRequest",
    entityId: parsed.data.id,
    metadata: parsed.data,
  })

  revalidatePath("/admin/delivery-requests")
}
